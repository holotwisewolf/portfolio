# Prediction demo builder: trains the RF zone classifier on the real zone_features.csv,
# samples windows from an UNSEEN month (NQ June 2025), extracts features with the
# author's own extract_zone_features(), and records model predictions + probabilities.
# Output: public/data/zone-predictions.json

import json
import sys
from pathlib import Path

import numpy as np
import pandas as pd

RESEARCH = Path(r"C:\Users\YJ\Desktop\Orderflow Research")
sys.path.insert(0, str(RESEARCH))

from core import zone_classifier_trainer as zct
from core.feature_extraction import extract_zone_features

UNSEEN = RESEARCH / "archive_legacy/data_library/NQ/NQ.FUT_2025-06-01_2025-07-01.parquet"
N_WINDOWS = 24
SEED = 42

# 1. Train the real model on the real features
features_csv = RESEARCH / "zone_classifier/outputs/features/zone_features.csv"
df = zct.load_zone_features(str(features_csv))
model, scaler, feature_cols, metrics = zct.train_zone_classifier(df, model_type="random_forest")
print(f"trained RF: cv_mean={metrics['cv_mean']:.3f}")

# 2. Unseen month -> 15-min candles (their pipeline, with the same tick
# filtering the demo builder uses: trades only, dominant symbol, sane prices)
raw = pd.read_parquet(UNSEEN, columns=["ts_event", "action", "price", "size", "symbol"])
raw = raw[(raw["action"] == "T") & (raw["price"] > 5000)]
dominant = raw["symbol"].value_counts().idxmax()
raw = raw[raw["symbol"] == dominant]
raw["ts_event"] = pd.to_datetime(raw["ts_event"])
raw = raw.set_index("ts_event").sort_index()
print(f"unseen month: {dominant}, {len(raw):,} trades")
candles = raw["price"].resample("15min").ohlc()
candles["volume"] = raw["size"].resample("15min").sum().astype("float64")
candles = candles.dropna()
bars5_all = raw["price"].resample("5min").ohlc().dropna()
del raw
print(f"unseen month candles: {len(candles)}")

# 3. Sample windows (their suggest_zones protocol: 4-24 candle durations)
rng = np.random.default_rng(SEED)
zone_names = {1: "neutral", 2: "consolidation", 3: "breakout"}
out = []
picks = sorted(rng.choice(range(len(candles) - 30), N_WINDOWS, replace=False).tolist())
for i in picks:
    dur = int(rng.integers(4, 24))
    start, end = candles.index[i], candles.index[min(i + dur, len(candles) - 1)]
    try:
        feats = extract_zone_features(candles, start, end, prev_zone=0, prev_zones=[])
    except Exception as e:
        print(f"skip {start}: {e}")
        continue
    row = pd.DataFrame([feats])
    missing = [c for c in feature_cols if c not in row.columns]
    for m in missing:
        row[m] = 0.0
    X = row[feature_cols].apply(pd.to_numeric, errors="coerce").fillna(0.0).values
    X = np.nan_to_num(X.astype(float))
    Xs = scaler.transform(X)
    proba = model.predict_proba(Xs)[0]
    pred = int(model.classes_[proba.argmax()])

    # candle window for display: context bars each side, 5-min bars like the gallery
    bars5 = bars5_all.loc[start - pd.Timedelta(minutes=90): end + pd.Timedelta(minutes=90)]
    zone_mask = (bars5.index >= start) & (bars5.index <= end)
    bars = [[t.strftime("%H:%M"), round(float(r.open), 2), round(float(r.high), 2),
             round(float(r.low), 2), round(float(r.close), 2)] for t, r in bars5.iterrows()]
    out.append({
        "start": start.strftime("%Y-%m-%d %H:%M"),
        "end": end.strftime("%Y-%m-%d %H:%M"),
        "predicted": pred,
        "predicted_name": zone_names[pred],
        "proba": {zone_names[int(c)]: round(float(p), 3) for c, p in zip(model.classes_, proba)},
        "zone_from": int(zone_mask.argmax()),
        "zone_to": int(zone_mask.sum() + zone_mask.argmax()),
        "bars": bars,
    })
    print(f"{start} -> {zone_names[pred]} {out[-1]['proba']}")

dest = Path(__file__).resolve().parents[1] / "public/data/zone-predictions.json"
dest.write_text(json.dumps({
    "source": "RF zone classifier (25-zone training set) predicting unseen NQ June 2025 windows",
    "windows": out,
}))
print(f"wrote {dest} ({dest.stat().st_size / 1024:.0f} KB, {len(out)} windows)")
