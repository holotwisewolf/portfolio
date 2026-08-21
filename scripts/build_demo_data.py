# Builds demo-data.json for the VPOC and orderflow workspace demos from real
# Databento parquet tick data (NQ futures). One-off: run manually, commit the JSONs.
# Usage: python scripts/build_demo_data.py

import json
from pathlib import Path

import pandas as pd
import pyarrow.parquet as pq

SRC = r"C:\Users\YJ\Desktop\claude\projects\Orderflow Research\data_library\NQ\NQ.FUT_2025-03-01_2025-04-01.parquet"
OUT_VPOC = Path(__file__).resolve().parents[1] / "components/workspace/projects/trading/vpoc/demo-data.json"
OUT_OF = Path(__file__).resolve().parents[1] / "components/workspace/projects/trading/orderflow/demo-data.json"

BAR_MIN = 2          # bar size in minutes
PROFILE_BINS = 60    # volume-at-price bins per day
TOUCH_TOL = 0.0005   # |close - vpoc| / vpoc to count as "at the level"
LEAVE_TOL = 0.002    # must be this far away before a return counts as a new touch
REACTION_BARS = 15   # bars after touch to search for the reaction extreme
N_DAYS = 6           # days shipped in the demo

print("reading parquet...")
tbl = pq.read_table(
    SRC,
    columns=["ts_event", "action", "side", "price", "size", "symbol"],
    filters=[("action", "=", "T")],
)
df = tbl.to_pandas()
print(f"trades: {len(df):,}")

dominant = df["symbol"].value_counts().idxmax()
df = df[df["symbol"] == dominant]
df = df[df["price"] > 5000]  # drop spread/odd instruments sharing the symbol space
print(f"dominant symbol: {dominant}, trades: {len(df):,}")

df["ts_event"] = pd.to_datetime(df["ts_event"], utc=True).dt.tz_convert("America/New_York")
df["date"] = df["ts_event"].dt.date

def fmt(t):
    return t.strftime("%H:%M")

days = []
for date, g in df.groupby("date"):
    if len(g) < 100_000:  # partial/holiday sessions
        continue
    lo, hi = g["price"].min(), g["price"].max()
    if (hi - lo) / lo < 0.004:  # dead day, nothing to show
        continue

    # volume-at-price profile -> VPOC
    import numpy as np
    bins = np.linspace(lo, hi, PROFILE_BINS + 1)
    vol, _ = np.histogram(g["price"], bins=bins, weights=g["size"])
    vpoc = float(bins[int(vol.argmax())] + (bins[1] - bins[0]) / 2)

    # 2-min OHLC-ish bars: last price + signed volume
    bar = g.set_index("ts_event").resample(f"{BAR_MIN}min")
    closes = bar["price"].last().dropna()
    signed = g.assign(s=np.where(g["side"] == "A", g["size"], np.where(g["side"] == "B", -g["size"], 0)))
    bar_signed = signed.set_index("ts_event").resample(f"{BAR_MIN}min")["s"].sum()
    buys = g[g["side"] == "A"].set_index("ts_event")["size"].resample(f"{BAR_MIN}min").sum()
    sells = g[g["side"] == "B"].set_index("ts_event")["size"].resample(f"{BAR_MIN}min").sum()

    points = [[fmt(t), round(float(p), 2)] for t, p in closes.items()]

    # touch + reaction detection on closes
    closes_list = list(closes.items())
    touches = []
    outside = True
    for i, (t, p) in enumerate(closes_list):
        d = abs(p - vpoc) / vpoc
        if outside and d < TOUCH_TOL:
            window = closes_list[i + 1 : i + 1 + REACTION_BARS]
            if window:
                rt, rp = max(window, key=lambda x: abs(x[1] - vpoc))
                touches.append({
                    "t": fmt(t), "price": round(float(p), 2),
                    "rt": fmt(rt), "rprice": round(float(rp), 2),
                    "move": round((float(rp) - vpoc) / vpoc * 100, 3),  # % reaction off the level
                })
            outside = False
        elif not outside and d > LEAVE_TOL:
            outside = True

    best = max((abs(x["move"]) for x in touches), default=0)
    days.append({
        "date": str(date), "lo": round(float(lo), 2), "hi": round(float(hi), 2),
        "vpoc": round(vpoc, 2), "points": points,
        "profile": [[round(float(bins[i] + (bins[1] - bins[0]) / 2), 2), int(vol[i])] for i in range(PROFILE_BINS)],
        "touches": touches, "best_reaction": best,
        "buy": [int(x) for x in buys.fillna(0).reindex(closes.index).fillna(0)],
        "sell": [int(x) for x in sells.fillna(0).reindex(closes.index).fillna(0)],
        "delta": [int(x) for x in bar_signed.fillna(0).reindex(closes.index).fillna(0)],
    })
    print(f"{date}: vpoc={vpoc:.2f} range=[{lo:.2f},{hi:.2f}] touches={len(touches)} best_reaction={best:.3f}%")

# variety: sort by reaction strength, take evenly spaced
days.sort(key=lambda d: d["best_reaction"], reverse=True)
picked = [days[int(i * (len(days) - 1) / (N_DAYS - 1))] for i in range(N_DAYS)]

meta = {"instrument": dominant, "source": "Databento NQ futures, March 2025 (real trades)", "bar": f"{BAR_MIN}min"}

for out, extra in ((OUT_VPOC, ("profile", "touches")), (OUT_OF, ("buy", "sell", "delta"))):
    slim = []
    for d in picked:
        s = {"date": d["date"], "lo": d["lo"], "hi": d["hi"], "vpoc": d["vpoc"], "points": d["points"]}
        if "touches" in extra:
            s["touches"] = d["touches"]
        if "profile" in extra:
            s["profile"] = d["profile"]
        if "delta" in extra:
            s["delta"] = d["delta"]
            s["buy"] = d["buy"]
            s["sell"] = d["sell"]
        slim.append(s)
    out.write_text(json.dumps({**meta, "days": slim}))
    print(f"wrote {out} ({out.stat().st_size / 1024:.0f} KB)")
