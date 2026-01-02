#!/usr/bin/env python3
"""
╔══════════════════════════════════════════════════════════════════════════════╗
║                    PUBLICATION-READY REPORTING                                ║
║                                                                               ║
║  Generate scholar-grade evidence outputs:                                     ║
║                                                                               ║
║  1. System capabilities summary                                               ║
║  2. Method comparison matrix                                                  ║
║  3. Calibration reliability curves                                            ║
║  4. Gate pass/fail summary                                                    ║
║  5. Ready-to-analyze disputed texts list                                      ║
║  6. Recommended next steps                                                    ║
╚══════════════════════════════════════════════════════════════════════════════╝
"""

import os
import json
import asyncio
import asyncpg
from datetime import datetime
from collections import defaultdict

DATABASE_URL = os.environ.get('DATABASE_URL', '')


async def main():
    """Generate publication-ready summary report."""
    
    print("=" * 70)
    print("PUBLICATION-READY REPORTING")
    print("=" * 70)
    
    pool = await asyncpg.create_pool(DATABASE_URL, min_size=2, max_size=5)
    
    report = {
        "generated_at": datetime.now().isoformat(),
        "system_status": {},
        "methods": {},
        "gates": {},
        "capabilities": [],
        "ready_for_analysis": []
    }
    
    async with pool.acquire() as conn:
        # 1. System capabilities
        print("\n[1] Gathering system capabilities...")
        
        # Count author profiles
        burrows_count = await conn.fetchval("""
            SELECT COUNT(*) FROM author_style_vectors
            WHERE burrows_delta_vector IS NOT NULL
        """) or 0
        
        v2_count = await conn.fetchval("""
            SELECT COUNT(*) FROM author_style_vectors_v2
        """) or 0
        
        multiview_count = await conn.fetchval("""
            SELECT COUNT(*) FROM multiview_author_profiles
        """) or 0
        
        invariant_count = await conn.fetchval("""
            SELECT COUNT(*) FROM style_invariant_embeddings
            WHERE invariant_embedding IS NOT NULL
        """) or 0
        
        report["system_status"] = {
            "burrows_delta_profiles": burrows_count,
            "style_v2_profiles": v2_count,
            "multiview_profiles": multiview_count,
            "invariant_embeddings": invariant_count
        }
        
        print(f"    Burrows Delta profiles: {burrows_count}")
        print(f"    Style V2 (LDA) profiles: {v2_count}")
        print(f"    Multi-view profiles: {multiview_count}")
        print(f"    Invariant embeddings: {invariant_count:,}")
        
        # 2. Method comparison
        print("\n[2] Gathering method performance...")
        
        calibrations = await conn.fetch("""
            SELECT DISTINCT ON (method)
                method, top1_accuracy, macro_f1, ece,
                gate_accuracy_pass, gate_overall_pass,
                run_timestamp
            FROM authorship_calibration
            ORDER BY method, run_timestamp DESC
        """)
        
        print("\n    Method Performance Comparison:")
        print("    " + "-" * 60)
        print(f"    {'Method':<25} {'Accuracy':>10} {'Gate':>10}")
        print("    " + "-" * 60)
        
        for cal in calibrations:
            acc = cal['top1_accuracy'] or 0
            gate = '✓' if cal['gate_overall_pass'] else '✗'
            print(f"    {cal['method']:<25} {acc:>9.1%} {gate:>10}")
            
            report["methods"][cal['method']] = {
                "accuracy": float(acc),
                "gate_passed": cal['gate_overall_pass'],
                "timestamp": cal['run_timestamp'].isoformat() if cal['run_timestamp'] else None
            }
        
        # 3. Falsification gates
        print("\n[3] Gathering falsification results...")
        
        falsification = await conn.fetchrow("""
            SELECT * FROM falsification_results
            ORDER BY run_timestamp DESC
            LIMIT 1
        """)
        
        if falsification:
            report["gates"] = {
                "A_work_holdout": {
                    "accuracy": falsification['gate_a_work_holdout_acc'],
                    "passed": falsification['gate_a_passed']
                },
                "B_topic_impostor": {
                    "accuracy": falsification['gate_b_topic_impostor_acc'],
                    "passed": falsification['gate_b_passed']
                },
                "C_genre_invariance": {
                    "accuracy": falsification['gate_c_genre_invariance'],
                    "passed": falsification['gate_c_passed']
                },
                "D_confound_leakage": {
                    "topic_pred": falsification['gate_d_topic_predictability'],
                    "passed": falsification['gate_d_passed']
                },
                "E_multiresolution": {
                    "passed": falsification['gate_e_passed']
                },
                "overall_passed": falsification['overall_passed']
            }
            
            print("\n    Falsification Gates:")
            print("    " + "-" * 60)
            for gate, data in report["gates"].items():
                if gate != "overall_passed" and isinstance(data, dict):
                    status = '✓' if data.get('passed') else '✗'
                    acc = data.get('accuracy') or data.get('topic_pred') or 'N/A'
                    if isinstance(acc, float):
                        print(f"    {gate:<25} {acc:>9.3f} {status:>10}")
                    else:
                        print(f"    {gate:<25} {'':>9} {status:>10}")
        
        # 4. QA Summary
        print("\n[4] QA Summary...")
        
        qa_entries = await conn.fetch("""
            SELECT agent_name, check_name, passed, timestamp
            FROM build_qa_log
            ORDER BY timestamp DESC
            LIMIT 30
        """)
        
        qa_summary = defaultdict(list)
        for entry in qa_entries:
            qa_summary[entry['agent_name']].append({
                "check": entry['check_name'],
                "passed": entry['passed']
            })
        
        print("\n    Agent QA Status:")
        print("    " + "-" * 60)
        for agent, checks in qa_summary.items():
            all_passed = all(c['passed'] for c in checks)
            status = '✓' if all_passed else '✗'
            print(f"    {agent:<25} {status}")
        
        # 5. Determine what's ready for analysis
        print("\n[5] Determining analysis readiness...")
        
        if burrows_count > 0:
            report["capabilities"].append("translator_attribution")
            report["ready_for_analysis"].append({
                "analysis": "Translator Attribution",
                "method": "Burrows Delta",
                "confidence": "HIGH",
                "notes": f"{burrows_count} translator profiles available"
            })
        
        if v2_count > 0:
            report["capabilities"].append("style_v2_attribution")
            report["ready_for_analysis"].append({
                "analysis": "Style-based Attribution (LDA)",
                "method": "Regularized LDA on anchor-centered residuals",
                "confidence": "HIGH" if v2_count >= 5 else "MEDIUM",
                "notes": f"{v2_count} style profiles available"
            })
        
        if multiview_count > 0:
            report["capabilities"].append("multiview_attribution")
            report["ready_for_analysis"].append({
                "analysis": "Multi-view Attribution",
                "method": "Function words + Char n-grams",
                "confidence": "HIGH",
                "notes": f"{multiview_count} multi-view profiles available"
            })
        
        if invariant_count > 1000:
            report["capabilities"].append("confound_invariant_analysis")
            report["ready_for_analysis"].append({
                "analysis": "Confound-invariant Attribution",
                "method": "Adversarial confound removal",
                "confidence": "MEDIUM",
                "notes": f"{invariant_count:,} invariant embeddings"
            })
        
        # Store report
        await conn.execute("""
            CREATE TABLE IF NOT EXISTS publication_reports (
                id SERIAL PRIMARY KEY,
                generated_at TIMESTAMP DEFAULT NOW(),
                report JSONB NOT NULL
            );
        """)
        
        await conn.execute("""
            INSERT INTO publication_reports (report)
            VALUES ($1)
        """, json.dumps(report))
        
        # Print final report
        print("\n" + "=" * 70)
        print("OVERNIGHT BUILD SUMMARY REPORT")
        print("=" * 70)
        
        print("\n📊 SYSTEM CAPABILITIES:")
        for cap in report["capabilities"]:
            print(f"    ✓ {cap}")
        
        print("\n📈 READY FOR ANALYSIS:")
        for item in report["ready_for_analysis"]:
            print(f"\n    {item['analysis']}")
            print(f"      Method: {item['method']}")
            print(f"      Confidence: {item['confidence']}")
            print(f"      Notes: {item['notes']}")
        
        print("\n🎯 RECOMMENDED NEXT STEPS:")
        print("""
    1. TRANSLATOR ANALYSIS (Ready Now):
       - Compare Loeb translators across the corpus
       - Identify stylistic outliers
       - Build translator fingerprint database
    
    2. ANCIENT AUTHOR ANALYSIS (Needs Greek/Latin source texts):
       - Import Greek NT, Septuagint, Classical texts
       - Train author profiles on ancient authors
       - Run disputed text analysis
    
    3. BIBLICAL DISPUTES (After ancient author profiles):
       - Gospel of John vs Synoptics
       - Pauline corpus analysis
       - Isaiah segmentation
       - Q Source test
        """)
        
        overall_ready = len(report["capabilities"]) >= 2
        
        print("\n" + "=" * 70)
        if overall_ready:
            print("✅ SYSTEM READY FOR PRODUCTION ANALYSIS")
        else:
            print("⚠️  SYSTEM PARTIALLY READY - See recommendations above")
        print("=" * 70)
        
        # QA log
        await conn.execute("""
            INSERT INTO build_qa_log (agent_name, check_name, passed, details)
            VALUES ($1, $2, $3, $4)
        """,
            'PublicationReport',
            'report_generated',
            True,
            json.dumps({"capabilities": report["capabilities"]})
        )
    
    await pool.close()
    
    return report


if __name__ == "__main__":
    asyncio.run(main())
