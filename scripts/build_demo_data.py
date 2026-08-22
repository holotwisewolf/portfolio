# Builds demo JSONs for the workspace demos from real Databento parquet tick data
# (NQ futures). Emits OHLC bars (candles) + delta + VPOC analysis + labeled-zone
# windows. One-off: run manually, commit the JSONs.
# Usage: python scripts/build_demo_data.py

import json
from pathlib import Path

import numpy as np
import pandas as pd
import pyarrow.parquet as pq

DATA_LIB = Path(r"C:\Users\YJ\Desktop\claude\projects\Orderflow Research\data_library\NQ")
RESEARCH = Path(r"C:\Users\YJ\Desktop\Orderflow Research")
OUT_DIR = Path(__file__).resolve().parents[1] / "components/workspace/projects/trading"
SRC = DATA_LIB / "NQ.FUT_2025-03-01_2025-04-01.parquet"

BAR_MIN = 5          # candle size in minutes
PROFILE_BINS = 60    # volume-at-price bins per day
TOUCH_TOL = 0.0005   # |close - vpoc| / vpoc to count as "at the level"
LEAVE_TOL = 0.002    # must be this far away before a return counts as a new touch
REACTION_BARS = 6    # bars after touch to search for the reaction extreme (5-min bars)
N_DAYS = 6           # days shipped in the demo

def fmt(t):
    return t.strftime("%H:%M")

def load_ticks(path):
    tbl = pq.read_table(path, columns=["ts_event", "action", "side", "price", "size", "symbol"],
                        filters=[("action", "=", "T")])
    df = tbl.to_pandas()
    dominant = df["symbol"].value_counts().idxmax()
    df = df[(df["symbol"] == dominant) & (df["price"] > 5000)]
    df["ts_event"] = pd.to_datetime(df["ts_event"], utc=True).dt.tz_convert("America/New_York")
    return df, dominant

def ohlc_bars(g):
    """5-min OHLCV + aggressor delta bars for one day's ticks."""
    idx = g.set_index("ts_event")
    b = idx["price"].resample(f"{BAR_MIN}min").agg(open="first", high="max", low="min", close="last").dropna()
    signed = g.assign(s=np.where(g["side"] == "A", g["size"], np.where(g["side"] == "B", -g["size"], 0)))
    b["delta"] = signed.set_index("ts_event")["s"].resample(f"{BAR_MIN}min").sum().reindex(b.index).fillna(0)
    b["buy"] = g[g["side"] == "A"].set_index("ts_event")["size"].resample(f"{BAR_MIN}min").sum().reindex(b.index).fillna(0)
    b["sell"] = g[g["side"] == "B"].set_index("ts_event")["size"].resample(f"{BAR_MIN}min").sum().reindex(b.index).fillna(0)
    return b

def bars_json(b):
    return [
        [fmt(t), round(float(r.open), 2), round(float(r.high), 2), round(float(r.low), 2), round(float(r.close), 2),
         int(r.delta), int(r.buy), int(r.sell)]
        for t, r in b.iterrows()
    ]

print("reading parquet...")
df, dominant = load_ticks(SRC)
print(f"dominant symbol: {dominant}, trades: {len(df):,}")
df["date"] = df["ts_event"].dt.date

days = []
for date, g in df.groupby("date"):
    if len(g) < 100_000:  # partial/holiday sessions
        continue
    lo, hi = g["price"].min(), g["price"].max()
    if (hi - lo) / lo < 0.004:  # dead day
        continue

    # volume-at-price profile -> VPOC
    bins = np.linspace(lo, hi, PROFILE_BINS + 1)
    vol, _ = np.histogram(g["price"], bins=bins, weights=g["size"])
    vpoc = float(bins[int(vol.argmax())] + (bins[1] - bins[0]) / 2)

    b = ohlc_bars(g)
    bars = bars_json(b)
    closes = [(bar[0], bar[4]) for bar in bars]

    # touch + reaction detection on closes
    touches = []
    outside = True
    for i, (t, p) in enumerate(closes):
        d = abs(p - vpoc) / vpoc
        if outside and d < TOUCH_TOL:
            window = closes[i + 1 : i + 1 + REACTION_BARS]
            if window:
                rt, rp = max(window, key=lambda x: abs(x[1] - vpoc))
                touches.append({
                    "t": t, "price": p,
                    "rt": rt, "rprice": rp,
                    "move": round((rp - vpoc) / vpoc * 100, 3),
                })
            outside = False
        elif not outside and d > LEAVE_TOL:
            outside = True

    best = max((abs(x["move"]) for x in touches), default=0)
    days.append({
        "date": str(date), "lo": round(float(lo), 2), "hi": round(float(hi), 2),
        "vpoc": round(vpoc, 2), "bars": bars,
        "profile": [[round(float(bins[i] + (bins[1] - bins[0]) / 2), 2), int(vol[i])] for i in range(PROFILE_BINS)],
        "touches": touches, "best_reaction": best,
    })
    print(f"{date}: vpoc={vpoc:.2f} touches={len(touches)} best_reaction={best:.3f}%")

# variety: sort by reaction strength, take evenly spaced
days.sort(key=lambda d: d["best_reaction"], reverse=True)
picked = [days[int(i * (len(days) - 1) / (N_DAYS - 1))] for i in range(N_DAYS)]

meta = {"instrument": dominant, "source": "Databento NQ futures, March 2025 (real trades)", "bar": f"{BAR_MIN}min"}

for name, keep in (("vpoc/demo-data.json", ("profile", "touches")), ("orderflow/demo-data.json", ())):
    slim = []
    for d in picked:
        s = {"date": d["date"], "lo": d["lo"], "hi": d["hi"], "vpoc": d["vpoc"], "bars": d["bars"]}
        if "touches" in keep:
            s["touches"] = d["touches"]
            s["profile"] = d["profile"]
        slim.append(s)
    out = OUT_DIR / name
    out.write_text(json.dumps({**meta, "days": slim}))
    print(f"wrote {out} ({out.stat().st_size / 1024:.0f} KB)")

# --- labeled-zone windows (the benchmark gallery) ---
print("building zone windows from my_zone_labels.csv...")
zl = pd.read_csv(RESEARCH / "zone_classifier/outputs/labels/my_zone_labels.csv")
# label times are naive ET; bar index is tz-aware ET (DST-ambiguous times dropped)
zl["start_time"] = pd.to_datetime(zl["start_time"]).dt.tz_localize("America/New_York", ambiguous="NaT", nonexistent="NaT")
zl["end_time"] = pd.to_datetime(zl["end_time"]).dt.tz_localize("America/New_York", ambiguous="NaT", nonexistent="NaT")
zl = zl.dropna(subset=["start_time", "end_time"])

zone_names = {1: "neutral", 2: "consolidation", 3: "breakout"}
CONTEXT = 10  # bars of context on each side of the zone window

zones = []
for month, zg in zl.groupby(zl["start_time"].dt.to_period("M")):
    first = month.to_timestamp()
    after_last = month.to_timestamp(how="end").normalize() + pd.offsets.Day(1)
    pq_path = DATA_LIB / f"NQ.FUT_{first.strftime('%Y-%m-%d')}_{after_last.strftime('%Y-%m-%d')}.parquet"
    if not pq_path.exists():
        print(f"  skip {month}: no parquet ({pq_path.name})")
        continue
    g, _ = load_ticks(pq_path)
    b = ohlc_bars(g)
    for _, row in zg.iterrows():
        i0 = b.index.searchsorted(row["start_time"])
        i1 = max(i0 + 1, b.index.searchsorted(row["end_time"]))
        if i0 >= len(b):
            continue
        lo = max(0, i0 - CONTEXT)
        hi_i = min(len(b), i1 + CONTEXT)
        window = b.iloc[lo:hi_i]
        zones.append({
            "date": first.strftime("%Y-%m-%d"),
            "start": row["start_time"].strftime("%Y-%m-%d %H:%M"),
            "end": row["end_time"].strftime("%Y-%m-%d %H:%M"),
            "label": int(row["label"]),
            "zone_from": int(i0 - lo),
            "zone_to": int(min(i1, hi_i) - lo),
            "bars": bars_json(window),
        })

for label, name in zone_names.items():
    print(f"  {name}: {sum(1 for z in zones if z['label'] == label)} zones")

out = OUT_DIR / "zone-classifier/zone-labels.json"
out.write_text(json.dumps({"source": "hand-labeled zones (my_zone_labels.csv) on real NQ ticks", "zones": zones}))
print(f"wrote {out} ({out.stat().st_size / 1024:.0f} KB, {len(zones)} zones)")
