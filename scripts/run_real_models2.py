# R2 part 2: HMM (patched numerics) + symbolic regression.
# Deviations from core/hmm_analysis_tool.py, both noted in portfolio provenance:
#   - 15-min OHLCV built directly from raw trades (their data_cleaner dropped 85%
#     of candles on this file and produced singular covariances)
#   - features standardized before fit (hmmlearn recommendation for full covariance)

import subprocess
import sys
from pathlib import Path

import numpy as np
import pandas as pd

RESEARCH = Path(r"C:\Users\YJ\Desktop\Orderflow Research")

pq = RESEARCH / "archive_legacy/data_library/NQ/NQ.FUT_2025-03-01_2025-04-01.parquet"
raw = pd.read_parquet(pq, columns=["ts_event", "action", "price", "size", "symbol"])
raw = raw[(raw["action"] == "T") & (raw["price"] > 5000)]
dominant = raw["symbol"].value_counts().idxmax()
raw = raw[raw["symbol"] == dominant]
raw["ts_event"] = pd.to_datetime(raw["ts_event"], utc=True).dt.tz_convert("America/New_York")

bars = raw.set_index("ts_event")["price"].resample("15min").agg(["first", "max", "min", "last"])
vol = raw.set_index("ts_event")["size"].resample("15min").sum()
bars = bars.dropna()
bars["volume"] = vol.reindex(bars.index).fillna(0)
bars.columns = ["open", "high", "low", "close", "volume"]

cd = bars.copy()
cd["range_pct"] = (cd["high"] - cd["low"]) / cd["close"]
cd["body"] = (cd["close"] - cd["open"]).abs()
cd["body_pct"] = cd["body"] / cd["close"]
cd["volume_ma20"] = cd["volume"].rolling(20).mean()
cd["volatility"] = cd["range_pct"].rolling(20).std()
cd["volume_ratio"] = cd["volume"] / cd["volume_ma20"]
feat_cols = ["range_pct", "body_pct", "volume_ratio", "volatility"]
cd = cd.dropna(subset=feat_cols)
print(f"15-min bars from raw ticks: {len(cd)} bars, symbol {dominant}")

from hmmlearn import hmm
from sklearn.preprocessing import StandardScaler

X = StandardScaler().fit_transform(cd[feat_cols].values.astype(np.float32))
model = hmm.GaussianHMM(n_components=4, covariance_type="full", n_iter=100, random_state=42)
model.fit(X)
states = model.predict(X)
probs = model.predict_proba(X)

counts = np.bincount(states, minlength=4)
confident = (probs.max(axis=1) > 0.7).sum()
print(f"bars: {len(X)}   high-confidence (>70%): {confident} ({confident/len(X)*100:.1f}%)")
mu = StandardScaler().fit(cd[feat_cols].values.astype(np.float32))
for s in range(4):
    m = mu.inverse_transform(model.means_[s].reshape(1, -1))[0]
    print(f"state {s}: {counts[s]} bars ({counts[s]/len(X)*100:.1f}%)  "
          f"range={m[0]:.5f} body={m[1]:.5f} volratio={m[2]:.3f} vol={m[3]:.6f}")

trans = (states[1:] != states[:-1]).sum()
print(f"transitions: {trans}")
cd2 = cd.assign(state=states).copy()
daily = cd2.resample("1D")["state"].agg(lambda s: pd.Series(s).mode().iloc[0] if len(s) else None).dropna()
print("daily dominant state:", [int(x) for x in daily.values])

print()
print("=" * 70)
print("SYMBOLIC REGRESSION — gplearn on zone features")
print("=" * 70)
features_csv = RESEARCH / "zone_classifier/outputs/features/zone_features.csv"
proc = subprocess.run(
    [sys.executable, str(RESEARCH / "core/symbolic_regression.py"), str(features_csv)],
    cwd=str(RESEARCH), capture_output=True, text=True, timeout=1800,
)
print("\n".join(proc.stdout.splitlines()[-70:]))
if proc.returncode != 0:
    print("STDERR tail:", "\n".join(proc.stderr.splitlines()[-15:]))
