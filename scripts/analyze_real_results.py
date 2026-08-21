# Prints real summaries from the research result CSVs for transcription into
# portfolio content files. Read-only. Run: python scripts/analyze_real_results.py

import pandas as pd
import numpy as np

R = r"C:\Users\YJ\Desktop\claude\projects\Orderflow Research"

print("=" * 60)
print("ELASTICITY ANALYSIS (real, 43k high-delta events, ES Dec 18 2024)")
print("=" * 60)
e = pd.read_csv(R + r"\old_results\elasticity_analysis.csv")
print(f"events: {len(e):,}")
print(f"elasticity: mean={e.elasticity.mean():.6f} std={e.elasticity.std():.6f} "
      f"p10={e.elasticity.quantile(0.1):.6f} p50={e.elasticity.quantile(0.5):.6f} p90={e.elasticity.quantile(0.9):.6f}")
print(f"overall continuation rate: {e.continuation.mean() * 100:.1f}%")
med = e.elasticity.median()
lo, hi = e[e.elasticity <= med], e[e.elasticity > med]
print(f"low-E (<=median) continuation: {lo.continuation.mean() * 100:.1f}%  (n={len(lo):,})")
print(f"high-E (>median) continuation: {hi.continuation.mean() * 100:.1f}%  (n={len(hi):,})")
# decile histogram for the portfolio chart (10 bins, % of events)
counts, edges = np.histogram(e.elasticity, bins=10)
total = counts.sum()
hist = [(f"{edges[i]:.4f}", int(counts[i]), round(counts[i] / total * 100, 1)) for i in range(10)]
print("decile histogram (bin_left, n, pct):")
for h in hist:
    print("  ", h)

print()
print("=" * 60)
print("NEUTRAL CANDLE GRID SEARCH (real, 2026-01-13 run)")
print("=" * 60)
g = pd.read_csv(R + r"\old_systems\original_research\neutral_candle_results\full_grid_search_results_2026-01-13_05-39-19.csv")
print(f"configs: {len(g):,}   timeframes: {g.timeframe.unique().tolist()}")
print(f"trades total: {g.n.sum():,}")
print(f"wr: mean={g.wr.mean() * 100:.1f}% max={g.wr.max() * 100:.1f}%")
print(f"ev: max=${g.ev.max():.0f}   recovery_factor max={g.recovery_factor.max():.2f}")
print(f"profitable configs (total_pnl>0): {(g.total_pnl > 0).sum():,} ({(g.total_pnl > 0).mean() * 100:.0f}%)")
best = g.loc[g.ev.idxmax()]
print("best-by-EV config:")
print(best.to_string())
# wr distribution buckets for chart
wr_bins = pd.cut(g.wr, [0, 0.4, 0.5, 0.6, 0.7, 1.0], labels=["<40%", "40-50%", "50-60%", "60-70%", "70%+"])
print("win-rate distribution (configs):")
print(wr_bins.value_counts().reindex(["<40%", "40-50%", "50-60%", "60-70%", "70%+"]).to_string())

print()
print("SLIPPAGE SENSITIVITY (real): best filter set EV across slippage regimes")
s = pd.read_csv(R + r"\old_systems\original_research\neutral_candle_results\slippage_impact_analysis.csv")
s["filters"] = s["filters"].astype(str)
row = s[s["filters"] == "{8, 1, 3, 5}"]
if len(row):
    print(row.to_string(index=False))
else:
    print(s.head(8).to_string(index=False))
