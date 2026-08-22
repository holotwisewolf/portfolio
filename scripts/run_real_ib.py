# R3: real IB-strategy backtest on real parquet data. Calls the author's
# run_ib_backtest() directly (the __main__ lab is interactive).
# Prints summary + reads the auto-saved trade-log CSV for transcription.

import sys
from pathlib import Path

RESEARCH = Path(r"C:\Users\YJ\Desktop\Orderflow Research")
sys.path.insert(0, str(RESEARCH))
sys.path.insert(0, str(RESEARCH / "archive_legacy/old_systems/original_research"))

import ib_strategy

pq = RESEARCH / "archive_legacy/data_library/NQ/NQ.FUT_2025-03-01_2025-04-01.parquet"
res = ib_strategy.run_ib_backtest(
    str(pq),
    strategy_mode="both",
    resample_tf="5min",
    target_mode="conservative",
)
print("\nRETURN KEYS:", list(res.keys()) if isinstance(res, dict) else type(res))

# the backtest saves a detailed CSV — find the newest one it just wrote
import os
import time

candidates = []
for root, _, files in os.walk(RESEARCH):
    for f in files:
        if f.endswith(".csv") and ("ib" in f.lower() or "detailed" in f.lower() or "trade" in f.lower()):
            p = Path(root) / f
            candidates.append((p.stat().st_mtime, p))
candidates.sort(reverse=True)
for mtime, p in candidates[:5]:
    print(f"{time.strftime('%Y-%m-%d %H:%M', time.localtime(mtime))}  {p}")
