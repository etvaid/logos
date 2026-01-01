#!/usr/bin/env python3
"""
LOGOS Data Readiness Check
==========================

Verifies that the database has sufficient data for calibration and analysis.

Usage:
    python scripts/data_readiness_check.py

Requirements:
    - Database connection (via DATABASE_URL or hardcoded)
    - asyncpg installed
"""

import asyncio
import asyncpg
import os
from typing import Dict, Any, List, Tuple

# Database URL
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    os.getenv("DATABASE_URL", "")
)

# Minimum requirements for calibration
MIN_REQUIREMENTS = {
    "authors": 10,
    "works": 20,
    "source_texts": 100,
    "passages_with_embeddings": 50,
    "translations": 20,
    "translators": 5,
}


async def check_table_counts(conn: asyncpg.Connection) -> Dict[str, int]:
    """Check row counts for key tables."""
    tables = [
        "authors", "works", "source_texts", "passages", "translations",
        "translators", "meaning_anchors", "style_residuals", "translator_centroids",
        "calibration_runs", "hypotheses", "anomalies", "latent_axes",
        "synoptic_alignments", "q_reconstructions", "pericopes", "doctrinal_axes"
    ]

    counts = {}
    for table in tables:
        try:
            count = await conn.fetchval(f"SELECT COUNT(*) FROM {table}")
            counts[table] = count or 0
        except Exception as e:
            counts[table] = f"ERROR: {str(e)[:50]}"

    return counts


async def check_embeddings(conn: asyncpg.Connection) -> Dict[str, Any]:
    """Check embedding coverage."""
    results = {}

    # Passages with embeddings
    try:
        total_passages = await conn.fetchval("SELECT COUNT(*) FROM passages")
        with_embeddings = await conn.fetchval(
            "SELECT COUNT(*) FROM passages WHERE embedding IS NOT NULL"
        )
        results["passages"] = {
            "total": total_passages or 0,
            "with_embeddings": with_embeddings or 0,
            "coverage": f"{(with_embeddings or 0) / max(total_passages or 1, 1) * 100:.1f}%"
        }
    except Exception as e:
        results["passages"] = {"error": str(e)}

    # Translations with embeddings
    try:
        total_trans = await conn.fetchval("SELECT COUNT(*) FROM translations")
        with_emb = await conn.fetchval(
            "SELECT COUNT(*) FROM translations WHERE embedding IS NOT NULL"
        )
        results["translations"] = {
            "total": total_trans or 0,
            "with_embeddings": with_emb or 0,
            "coverage": f"{(with_emb or 0) / max(total_trans or 1, 1) * 100:.1f}%"
        }
    except Exception as e:
        results["translations"] = {"error": str(e)}

    return results


async def check_meaning_anchors(conn: asyncpg.Connection) -> Dict[str, Any]:
    """Check meaning anchor computation status."""
    try:
        total_sources = await conn.fetchval("SELECT COUNT(*) FROM source_texts")
        with_anchors = await conn.fetchval("""
            SELECT COUNT(DISTINCT source_text_id)
            FROM meaning_anchors
        """)

        return {
            "total_source_texts": total_sources or 0,
            "with_meaning_anchors": with_anchors or 0,
            "coverage": f"{(with_anchors or 0) / max(total_sources or 1, 1) * 100:.1f}%"
        }
    except Exception as e:
        return {"error": str(e)}


async def check_style_residuals(conn: asyncpg.Connection) -> Dict[str, Any]:
    """Check style residual computation status."""
    try:
        total_trans = await conn.fetchval("SELECT COUNT(*) FROM translations")
        with_residuals = await conn.fetchval("SELECT COUNT(*) FROM style_residuals")

        return {
            "total_translations": total_trans or 0,
            "with_style_residuals": with_residuals or 0,
            "coverage": f"{(with_residuals or 0) / max(total_trans or 1, 1) * 100:.1f}%"
        }
    except Exception as e:
        return {"error": str(e)}


async def check_calibration_status(conn: asyncpg.Connection) -> Dict[str, Any]:
    """Check calibration run history."""
    try:
        latest = await conn.fetchrow("""
            SELECT run_id, created_at,
                   gate_1_passed, gate_2_passed, gate_3_passed, gate_4_passed,
                   all_gates_passed
            FROM calibration_runs
            ORDER BY created_at DESC
            LIMIT 1
        """)

        total_runs = await conn.fetchval("SELECT COUNT(*) FROM calibration_runs")
        passed_runs = await conn.fetchval(
            "SELECT COUNT(*) FROM calibration_runs WHERE all_gates_passed = TRUE"
        )

        return {
            "total_runs": total_runs or 0,
            "passed_runs": passed_runs or 0,
            "latest_run": dict(latest) if latest else None
        }
    except Exception as e:
        return {"error": str(e)}


async def check_loeb_data(conn: asyncpg.Connection) -> Dict[str, Any]:
    """Check Loeb Library data specifically."""
    try:
        # Check for Loeb-specific data patterns
        loeb_authors = await conn.fetchval("""
            SELECT COUNT(DISTINCT author) FROM source_texts
            WHERE urn LIKE 'urn:cts:%'
        """)

        loeb_works = await conn.fetchval("""
            SELECT COUNT(DISTINCT urn) FROM source_texts
            WHERE urn LIKE 'urn:cts:%'
        """)

        loeb_passages = await conn.fetchval("""
            SELECT COUNT(*) FROM source_texts
            WHERE urn LIKE 'urn:cts:%'
        """)

        # Check languages
        lang_dist = await conn.fetch("""
            SELECT language, COUNT(*) as count
            FROM source_texts
            GROUP BY language
            ORDER BY count DESC
        """)

        return {
            "cts_authors": loeb_authors or 0,
            "cts_works": loeb_works or 0,
            "cts_passages": loeb_passages or 0,
            "language_distribution": {r['language']: r['count'] for r in lang_dist}
        }
    except Exception as e:
        return {"error": str(e)}


async def check_q_reconstruction_readiness(conn: asyncpg.Connection) -> Dict[str, Any]:
    """Check readiness for Q reconstruction."""
    try:
        synoptic = await conn.fetchval("SELECT COUNT(*) FROM synoptic_alignments")
        pericopes = await conn.fetchval("SELECT COUNT(*) FROM pericopes")
        q_recon = await conn.fetchval("SELECT COUNT(*) FROM q_reconstructions")
        redaction_sigs = await conn.fetchval("SELECT COUNT(*) FROM redaction_signatures")

        return {
            "synoptic_alignments": synoptic or 0,
            "pericopes": pericopes or 0,
            "q_reconstructions": q_recon or 0,
            "redaction_signatures": redaction_sigs or 0,
            "ready_for_q": (pericopes or 0) > 0 or (synoptic or 0) > 0
        }
    except Exception as e:
        return {"error": str(e)}


async def check_doctrinal_axes(conn: asyncpg.Connection) -> Dict[str, Any]:
    """Check doctrinal axes setup."""
    try:
        axes = await conn.fetch("""
            SELECT axis_name, language,
                   array_length(positive_seed_terms, 1) as pos_terms,
                   array_length(negative_seed_terms, 1) as neg_terms
            FROM doctrinal_axes
        """)

        return {
            "total_axes": len(axes),
            "axes": [
                {
                    "name": a['axis_name'],
                    "language": a['language'],
                    "positive_terms": a['pos_terms'] or 0,
                    "negative_terms": a['neg_terms'] or 0
                }
                for a in axes
            ]
        }
    except Exception as e:
        return {"error": str(e)}


def assess_readiness(counts: Dict[str, int]) -> Tuple[bool, List[str]]:
    """Assess overall data readiness."""
    issues = []

    for table, minimum in MIN_REQUIREMENTS.items():
        if table == "passages_with_embeddings":
            # Special case handled separately
            continue
        actual = counts.get(table, 0)
        if isinstance(actual, int) and actual < minimum:
            issues.append(f"{table}: {actual} < {minimum} minimum")

    ready = len(issues) == 0
    return ready, issues


async def main():
    """Run all data readiness checks."""
    print("=" * 70)
    print("LOGOS DATA READINESS CHECK")
    print("=" * 70)
    print()

    try:
        pool = await asyncpg.create_pool(DATABASE_URL, min_size=1, max_size=5)
    except Exception as e:
        print(f"ERROR: Could not connect to database: {e}")
        return

    async with pool.acquire() as conn:
        # 1. Table counts
        print("1. TABLE COUNTS")
        print("-" * 40)
        counts = await check_table_counts(conn)
        for table, count in counts.items():
            status = "OK" if isinstance(count, int) and count > 0 else "EMPTY"
            print(f"   {table}: {count} {status}")
        print()

        # 2. Embedding coverage
        print("2. EMBEDDING COVERAGE")
        print("-" * 40)
        embeddings = await check_embeddings(conn)
        for category, data in embeddings.items():
            if "error" in data:
                print(f"   {category}: ERROR - {data['error']}")
            else:
                print(f"   {category}: {data['with_embeddings']}/{data['total']} ({data['coverage']})")
        print()

        # 3. Meaning anchors
        print("3. MEANING ANCHORS")
        print("-" * 40)
        anchors = await check_meaning_anchors(conn)
        if "error" in anchors:
            print(f"   ERROR: {anchors['error']}")
        else:
            print(f"   Source texts with anchors: {anchors['with_meaning_anchors']}/{anchors['total_source_texts']} ({anchors['coverage']})")
        print()

        # 4. Style residuals
        print("4. STYLE RESIDUALS")
        print("-" * 40)
        residuals = await check_style_residuals(conn)
        if "error" in residuals:
            print(f"   ERROR: {residuals['error']}")
        else:
            print(f"   Translations with residuals: {residuals['with_style_residuals']}/{residuals['total_translations']} ({residuals['coverage']})")
        print()

        # 5. Calibration status
        print("5. CALIBRATION STATUS")
        print("-" * 40)
        calibration = await check_calibration_status(conn)
        if "error" in calibration:
            print(f"   ERROR: {calibration['error']}")
        else:
            print(f"   Total runs: {calibration['total_runs']}")
            print(f"   Passed runs: {calibration['passed_runs']}")
            if calibration['latest_run']:
                latest = calibration['latest_run']
                print(f"   Latest: {latest.get('created_at', 'N/A')}")
                print(f"   Gates: G1={latest.get('gate_1_passed')}, G2={latest.get('gate_2_passed')}, G3={latest.get('gate_3_passed')}, G4={latest.get('gate_4_passed')}")
        print()

        # 6. Loeb/CTS data
        print("6. LOEB/CTS DATA")
        print("-" * 40)
        loeb = await check_loeb_data(conn)
        if "error" in loeb:
            print(f"   ERROR: {loeb['error']}")
        else:
            print(f"   CTS Authors: {loeb['cts_authors']}")
            print(f"   CTS Works: {loeb['cts_works']}")
            print(f"   CTS Passages: {loeb['cts_passages']}")
            print(f"   Languages: {loeb['language_distribution']}")
        print()

        # 7. Q Reconstruction readiness
        print("7. Q RECONSTRUCTION READINESS")
        print("-" * 40)
        q_ready = await check_q_reconstruction_readiness(conn)
        if "error" in q_ready:
            print(f"   ERROR: {q_ready['error']}")
        else:
            print(f"   Synoptic alignments: {q_ready['synoptic_alignments']}")
            print(f"   Pericopes: {q_ready['pericopes']}")
            print(f"   Q reconstructions: {q_ready['q_reconstructions']}")
            print(f"   Redaction signatures: {q_ready['redaction_signatures']}")
            print(f"   Ready: {'YES' if q_ready['ready_for_q'] else 'NO - Run seed_pericopes.py first'}")
        print()

        # 8. Doctrinal axes
        print("8. DOCTRINAL AXES")
        print("-" * 40)
        axes = await check_doctrinal_axes(conn)
        if "error" in axes:
            print(f"   ERROR: {axes['error']}")
        else:
            print(f"   Total axes: {axes['total_axes']}")
            for ax in axes.get('axes', []):
                print(f"   - {ax['name']} ({ax['language']}): +{ax['positive_terms']}/-{ax['negative_terms']} terms")
            if axes['total_axes'] == 0:
                print("   WARNING: Run seed_doctrinal_axes.py to populate")
        print()

        # Overall assessment
        print("=" * 70)
        print("OVERALL ASSESSMENT")
        print("=" * 70)
        ready, issues = assess_readiness(counts)

        if ready:
            print("STATUS: READY FOR CALIBRATION")
        else:
            print("STATUS: NOT READY")
            print("\nIssues:")
            for issue in issues:
                print(f"   - {issue}")
            print("\nRecommendations:")
            print("   1. Run corpus loading scripts to populate source_texts")
            print("   2. Run embedding computation for passages")
            print("   3. Run seed scripts: seed_pericopes.py, seed_doctrinal_axes.py")
        print()

    await pool.close()


if __name__ == "__main__":
    asyncio.run(main())
