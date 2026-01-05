from __future__ import annotations
import os
import json
import pandas as pd
import matplotlib.pyplot as plt
from astro_nav import db

async def export_run_csv(run_key: str, out_dir: str = "reports") -> dict[str, str]:
    os.makedirs(out_dir, exist_ok=True)
    run = await db.fetch("SELECT run_id, config FROM astro.analysis_runs WHERE run_key=$1", run_key)
    if not run:
        raise RuntimeError("run_key not found")
    run_id = int(run[0]["run_id"])
    preds = await db.fetch("""
      SELECT p.hypothesis, p.entry_id, p.epoch_year, p.pred_lon, p.pred_lat, p.dlon, p.dlat, p.ang_resid, p.loglik,
             o.canonical_name, o.object_key, o.constellation, o.hip_id
      FROM astro.predictions p JOIN astro.catalog_entries e ON e.entry_id=p.entry_id JOIN astro.objects o ON o.object_id=e.object_id WHERE p.run_id=$1
    """, run_id)
    df = pd.DataFrame([dict(r) for r in preds])
    csv_path = os.path.join(out_dir, f"{run_key}_predictions.csv")
    df.to_csv(csv_path, index=False)
    summ = await db.fetch("SELECT * FROM astro.model_summaries WHERE run_id=$1", run_id)
    summ_path = os.path.join(out_dir, f"{run_key}_model_summary.json")
    with open(summ_path, "w", encoding="utf-8") as f:
        json.dump([dict(r) for r in summ], f, indent=2, default=str)
    return {"predictions_csv": csv_path, "model_summary_json": summ_path}

async def make_figures(run_key: str, out_dir: str = "reports/figures") -> list[str]:
    os.makedirs(out_dir, exist_ok=True)
    run = await db.fetch("SELECT run_id FROM astro.analysis_runs WHERE run_key=$1", run_key)
    if not run:
        raise RuntimeError("run_key not found")
    run_id = int(run[0]["run_id"])
    preds = await db.fetch("SELECT hypothesis, ang_resid, dlon, dlat FROM astro.predictions WHERE run_id=$1 AND hypothesis IN ('ptolemy_epoch','hipparchus_copy')", run_id)
    df = pd.DataFrame([dict(r) for r in preds])
    paths = []
    plt.figure()
    for hyp in ["ptolemy_epoch","hipparchus_copy"]:
        sub = df[df["hypothesis"]==hyp]["ang_resid"].dropna().astype(float)
        plt.hist(sub, bins=40, alpha=0.5, label=hyp)
    plt.xlabel("Angular residual (deg)")
    plt.ylabel("Count")
    plt.legend()
    p1 = os.path.join(out_dir, f"{run_key}_residual_hist.png")
    plt.savefig(p1, dpi=160, bbox_inches="tight")
    plt.close()
    paths.append(p1)
    plt.figure()
    for hyp in ["ptolemy_epoch","hipparchus_copy"]:
        sub = df[df["hypothesis"]==hyp]
        plt.scatter(sub["dlon"], sub["dlat"], s=6, alpha=0.5, label=hyp)
    plt.xlabel("dlon (deg)")
    plt.ylabel("dlat (deg)")
    plt.legend()
    p2 = os.path.join(out_dir, f"{run_key}_dlon_dlat.png")
    plt.savefig(p2, dpi=160, bbox_inches="tight")
    plt.close()
    paths.append(p2)
    return paths

async def generate_markdown(run_key: str, out_path: str = None) -> str:
    if out_path is None:
        out_path = f"reports/{run_key}_REPORT.md"
    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    run = await db.fetch("SELECT run_id, created_at, config FROM astro.analysis_runs WHERE run_key=$1", run_key)
    if not run:
        raise RuntimeError("run_key not found")
    run_id, config = int(run[0]["run_id"]), run[0]["config"]
    summary = await db.fetch("SELECT * FROM astro.model_summaries WHERE run_id=$1 ORDER BY created_at DESC LIMIT 1", run_id)
    s = dict(summary[0]) if summary else {}
    figs = await make_figures(run_key)
    md = [f"# LOGOS Astro Navigator Report\n", f"Run key: `{run_key}`\n", f"Config: `{json.dumps(config, indent=2)}`\n"]
    if s:
        md.extend(["## Model summary\n", f"- Catalog: `{s.get('catalog_key')}`\n", f"- Entries analyzed: **{s.get('n_entries')}**\n", f"- Mixture weight (Hipparchus-copy): **{s.get('mix_weight_b'):.3f}**\n", f"- BIC: Ptolemy={s.get('bic_a'):.1f}, Hipparchus={s.get('bic_b'):.1f}, Mixture={s.get('bic_mix'):.1f}\n", f"- log Bayes factor (mixture vs best single): **{s.get('log_bayes_factor_mix_vs_best'):.2f}**\n"])
    md.append("\n## Figures\n")
    for f in figs:
        md.append(f"![]({os.path.relpath(f, os.path.dirname(out_path))})\n")
    with open(out_path, "w", encoding="utf-8") as fp:
        fp.write("\n".join(md))
    return out_path
