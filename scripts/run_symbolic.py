# R2: symbolic regression alone, with utf-8 safe capture (their output has
# unicode symbols that crash cp1252 pipes on Windows).

import subprocess
import sys
from pathlib import Path

RESEARCH = Path(r"C:\Users\YJ\Desktop\Orderflow Research")
features_csv = RESEARCH / "zone_classifier/outputs/features/zone_features.csv"

proc = subprocess.run(
    [sys.executable, str(RESEARCH / "core/symbolic_regression.py"), str(features_csv)],
    cwd=str(RESEARCH),
    capture_output=True,
    text=True,
    encoding="utf-8",
    errors="replace",
    timeout=1800,
)
out = proc.stdout or ""
print("\n".join(out.splitlines()[-80:]))
if proc.returncode != 0:
    print("RC:", proc.returncode)
    print("STDERR:", "\n".join((proc.stderr or "").splitlines()[-15:]))
