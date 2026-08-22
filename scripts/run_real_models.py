# R2 runner: trains/runs the REAL research models and prints structured results
# for transcription into portfolio content. Reuses the research code directly.
# Run from the portfolio repo: python scripts/run_real_models.py

import json
import subprocess
import sys
from pathlib import Path

import numpy as np
import pandas as pd

RESEARCH = Path(r"C:\Users\YJ\Desktop\Orderflow Research")
sys.path.insert(0, str(RESEARCH))

print("=" * 70)
print("1. ZONE CLASSIFIER — real training on 106 hand-labeled zones")
print("=" * 70)
from core import zone_classifier_trainer as zct

features_csv = RESEARCH / "zone_classifier/outputs/features/zone_features.csv"
df = zct.load_zone_features(str(features_csv))
print("feature columns:", [c for c in df.columns if c not in ("label", "start_time", "end_time")])

results = {}
importances = None
for model_type in ("random_forest", "gradient_boosting", "logistic"):
    model, scaler, feature_cols, metrics = zct.train_zone_classifier(df, model_type=model_type)
    results[model_type] = {k: (round(v, 4) if isinstance(v, (int, float)) else v) for k, v in metrics.items() if isinstance(v, (int, float))}
    if model_type == "random_forest" and hasattr(model, "feature_importances_"):
        pairs = sorted(zip(feature_cols, model.feature_importances_), key=lambda x: -x[1])
        importances = [(f, round(float(w), 4)) for f, w in pairs]

print("\nZONE RESULTS JSON")
print(json.dumps(results, indent=1))
print("\nRF FEATURE IMPORTANCE (top 12)")
for f, w in (importances or [])[:12]:
    print(f"  {f}: {w}")

print()
print("=" * 70)
print("2. HMM — real 4-state GaussianHMM on NQ March 2025 (their pipeline)")
print("=" * 70)
from core.data_cleaner import preprocess_data_for_modeling
from hmmlearn import hmm

pq = RESEARCH / "archive_legacy/data_library/NQ/NQ.FUT_2025-03-01_2025-04-01.parquet"
raw = pd.read_parquet(pq)
cd = preprocess_data_for_modeling(raw, timeframe="15min")
cd["range_pct"] = (cd["high"] - cd["low"]) / cd["close"]
cd["body_pct"] = cd["body"] / cd["close"]
cd["volume_ma20"] = cd["volume"].rolling(20).mean()
cd["volatility"] = cd["range_pct"].rolling(20).std()
cd["volume_ratio"] = cd["volume"] / cd["volume_ma20"]
feat_cols = ["range_pct", "body_pct", "volume_ratio", "volatility"]
cd = cd.dropna(subset=feat_cols)
X = cd[feat_cols].values.astype(np.float32)

model = hmm.GaussianHMM(n_components=4, covariance_type="full", n_iter=100, random_state=42)
model.fit(X)
states = model.predict(X)
probs = model.predict_proba(X)

counts = np.bincount(states, minlength=4)
confident = (probs.max(axis=1) > 0.7).sum()
print(f"bars: {len(X)}   high-confidence (>70%): {confident} ({confident/len(X)*100:.1f}%)")
for s in range(4):
    means = model.means_[s]
    print(f"state {s}: {counts[s]} bars ({counts[s]/len(X)*100:.1f}%)  "
          f"range={means[0]:.5f} body={means[1]:.5f} volratio={means[2]:.3f} vol={means[3]:.6f}")

# transitions count + daily dominant-state sequence (compact for the chart)
trans = (states[1:] != states[:-1]).sum()
print(f"transitions: {trans}")
cd2 = cd.assign(state=states).copy()
cd2.index = pd.to_datetime(cd2.index)
daily = cd2.resample("1D")["state"].agg(lambda s: pd.Series(s).mode().iloc[0] if len(s) else None).dropna()
print("daily dominant state:", [int(x) for x in daily.values])

print()
print("=" * 70)
print("3. SYMBOLIC REGRESSION — gplearn on zone features")
print("=" * 70)
proc = subprocess.run(
    [sys.executable, str(RESEARCH / "core/symbolic_regression.py"), str(features_csv)],
    cwd=str(RESEARCH), capture_output=True, text=True, timeout=1800,
)
tail = "\n".join(proc.stdout.splitlines()[-60:])
print(tail)
if proc.returncode != 0:
    print("STDERR tail:", "\n".join(proc.stderr.splitlines()[-15:]))
