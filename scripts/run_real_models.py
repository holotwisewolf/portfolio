# R2 runner: trains the zone classifier on the real features CSV and prints
# structured results for transcription into portfolio content. Reuses the
# research code directly.
# Run from the portfolio repo: python scripts/run_real_models.py
#
# HMM and symbolic regression live in their own runners:
#   - scripts/run_real_models2.py  (HMM re-run, patched numerics)
#   - scripts/run_symbolic.py      (gplearn, utf-8 safe capture)

import json
import sys
from pathlib import Path

RESEARCH = Path(r"C:\Users\YJ\Desktop\Orderflow Research")
sys.path.insert(0, str(RESEARCH))

print("=" * 70)
print("ZONE CLASSIFIER — real training on the 25-zone features set")
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
