#!/usr/bin/env python3
"""
LOGOS Database Audit Script
Phase 0: Detect existing infrastructure and generate report
"""

import os
import sys
import json
import asyncio
from datetime import datetime
from typing import Dict, List, Any, Optional
from dataclasses import dataclass, asdict
import asyncpg

DATABASE_URL = os.getenv('DATABASE_URL',
    'postgresql://postgres:voqQePIH4adopQUa-1UUaFKnOT-mtsod@maglev.proxy.rlwy.net:49514/railway')

@dataclass
class AuditReport:
    timestamp: str
    embedding_infra: Dict[str, Any]
    source_counts: Dict[str, int]
    total_sources: int
    embedding_coverage: Dict[str, Any]
    translation_coverage: Dict[str, Any]
    morphology_coverage: Dict[str, int]
    backfill_jobs_exists: bool
    indexes: List[Dict[str, str]]
    existing_translation_tables: List[str]
    recommendations: List[str]

async def run_audit() -> AuditReport:
    """Run comprehensive database audit."""
    # Try connection with different SSL modes
    conn = None
    for ssl_mode in [False, 'prefer', 'require']:
        try:
            conn = await asyncpg.connect(DATABASE_URL, ssl=ssl_mode)
            print(f"Connected with ssl={ssl_mode}")
            break
        except Exception as e:
            print(f"Connection with ssl={ssl_mode} failed: {e}")
            continue

    if conn is None:
        raise Exception("Could not connect to database with any SSL mode")

    report = AuditReport(
        timestamp=datetime.now().isoformat(),
        embedding_infra={'columns': [], 'dimensions': {}, 'primary_store': 'unknown'},
        source_counts={},
        total_sources=0,
        embedding_coverage={'total': 0, 'with_embeddings': 0, 'missing': 0, 'coverage_percent': 0},
        translation_coverage={'total': 0, 'with_embeddings': 0, 'unique_urns': 0, 'multi_translation_urns': 0},
        morphology_coverage={'morph_entries': 0, 'passage_tokens': 0},
        backfill_jobs_exists=False,
        indexes=[],
        existing_translation_tables=[],
        recommendations=[]
    )

    try:
        print('Auditing embedding infrastructure...')

        # 1. Embedding columns
        embed_cols = await conn.fetch("""
            SELECT table_name, column_name, data_type
            FROM information_schema.columns
            WHERE table_schema = 'public'
            AND (data_type ILIKE '%vector%'
                 OR column_name ILIKE '%embed%'
                 OR column_name ILIKE '%vector%')
            ORDER BY table_name, column_name
        """)
        report.embedding_infra['columns'] = [
            {'table': r['table_name'], 'column': r['column_name'], 'type': r['data_type']}
            for r in embed_cols
        ]

        # 2. Check vector dimensions
        try:
            dims = await conn.fetchrow("""
                SELECT vector_dims(embedding) as dims
                FROM translations
                WHERE embedding IS NOT NULL
                LIMIT 1
            """)
            if dims:
                report.embedding_infra['dimensions']['translations'] = dims['dims']
        except Exception as e:
            print(f'Note: translations.embedding dimension check: {e}')

        try:
            dims = await conn.fetchrow("""
                SELECT
                  CASE WHEN original_embedding IS NOT NULL THEN vector_dims(original_embedding) ELSE NULL END as orig_dims,
                  CASE WHEN invariant_embedding IS NOT NULL THEN vector_dims(invariant_embedding) ELSE NULL END as inv_dims
                FROM style_invariant_embeddings
                WHERE original_embedding IS NOT NULL OR invariant_embedding IS NOT NULL
                LIMIT 1
            """)
            if dims:
                report.embedding_infra['dimensions']['style_invariant_original'] = dims['orig_dims']
                report.embedding_infra['dimensions']['style_invariant_invariant'] = dims['inv_dims']
        except Exception as e:
            print(f'Note: style_invariant_embeddings dimension check: {e}')

        try:
            dims = await conn.fetchrow("""
                SELECT vector_dims(embedding) as dims
                FROM passages
                WHERE embedding IS NOT NULL
                LIMIT 1
            """)
            if dims:
                report.embedding_infra['dimensions']['passages'] = dims['dims']
        except Exception as e:
            print(f'Note: passages.embedding dimension check: {e}')

        # 3. Source text counts by language
        print('Counting source texts...')
        source_counts = await conn.fetch("""
            SELECT language, COUNT(*) as count
            FROM source_texts
            GROUP BY language
            ORDER BY count DESC
        """)
        for r in source_counts:
            report.source_counts[r['language'] or 'unknown'] = int(r['count'])
        report.total_sources = sum(report.source_counts.values())

        # 4. Embedding coverage
        print('Checking embedding coverage...')
        embed_count = await conn.fetchrow("SELECT COUNT(*) as count FROM embeddings")
        report.embedding_coverage['total'] = report.total_sources
        report.embedding_coverage['with_embeddings'] = int(embed_count['count'])
        report.embedding_coverage['missing'] = report.total_sources - report.embedding_coverage['with_embeddings']
        if report.total_sources > 0:
            report.embedding_coverage['coverage_percent'] = (
                report.embedding_coverage['with_embeddings'] / report.total_sources * 100
            )

        # 5. Translation coverage
        print('Checking translation coverage...')
        trans_count = await conn.fetchrow("SELECT COUNT(*) as count FROM translations")
        report.translation_coverage['total'] = int(trans_count['count'])

        trans_with_embed = await conn.fetchrow(
            "SELECT COUNT(*) as count FROM translations WHERE embedding IS NOT NULL"
        )
        report.translation_coverage['with_embeddings'] = int(trans_with_embed['count'])

        # Check for URN-like columns
        urn_cols = await conn.fetch("""
            SELECT column_name FROM information_schema.columns
            WHERE table_name = 'translations'
            AND column_name IN ('urn', 'source_text_id', 'passage_urn', 'source_urn')
        """)
        if urn_cols:
            urn_col = urn_cols[0]['column_name']
            try:
                unique_urns = await conn.fetchrow(f"""
                    SELECT COUNT(DISTINCT {urn_col}) as count
                    FROM translations WHERE {urn_col} IS NOT NULL
                """)
                report.translation_coverage['unique_urns'] = int(unique_urns['count'])

                multi_trans = await conn.fetchrow(f"""
                    SELECT COUNT(*) as count FROM (
                        SELECT {urn_col} FROM translations
                        WHERE {urn_col} IS NOT NULL
                        GROUP BY {urn_col}
                        HAVING COUNT(*) >= 2
                    ) sub
                """)
                report.translation_coverage['multi_translation_urns'] = int(multi_trans['count'])
            except Exception as e:
                print(f'Note: URN analysis failed: {e}')

        # 6. Morphology coverage
        print('Checking morphology coverage...')
        try:
            morph_count = await conn.fetchrow("SELECT COUNT(*) as count FROM morph_entries")
            report.morphology_coverage['morph_entries'] = int(morph_count['count'])
        except:
            pass

        try:
            token_count = await conn.fetchrow("SELECT COUNT(*) as count FROM passage_tokens")
            report.morphology_coverage['passage_tokens'] = int(token_count['count'])
        except:
            pass

        # 7. Backfill jobs check
        print('Checking backfill_jobs table...')
        backfill_check = await conn.fetchrow("""
            SELECT EXISTS (
                SELECT 1 FROM information_schema.tables
                WHERE table_name = 'backfill_jobs'
            ) as exists
        """)
        report.backfill_jobs_exists = backfill_check['exists']

        # 8. Index check
        print('Checking indexes...')
        indexes = await conn.fetch("""
            SELECT indexname, indexdef
            FROM pg_indexes
            WHERE schemaname = 'public'
            AND (indexdef ILIKE '%vector%'
                 OR indexdef ILIKE '%hnsw%'
                 OR indexdef ILIKE '%ivfflat%'
                 OR indexname ILIKE '%urn%'
                 OR indexname ILIKE '%language%')
            ORDER BY indexname
        """)
        report.indexes = [{'name': r['indexname'], 'definition': r['indexdef']} for r in indexes]

        # 9. Existing translation system tables
        print('Checking existing translation system tables...')
        existing_tables = await conn.fetch("""
            SELECT table_name
            FROM information_schema.tables
            WHERE table_schema = 'public'
            AND table_name IN (
                'passage_consensus',
                'passage_style_variants',
                'translation_memory_lexeme',
                'translation_memory_phrase',
                'translation_memory_idiom',
                'translation_order_templates',
                'translation_runs',
                'translation_review_queue',
                'bridge_embeddings',
                'chunk_bridge_embeddings',
                'concept_clusters',
                'concept_members',
                'concept_edges',
                'evidence_trails'
            )
        """)
        report.existing_translation_tables = [r['table_name'] for r in existing_tables]

        # Determine primary embedding store
        if any(c['table'] == 'embeddings' and c['column'] == 'embedding'
               for c in report.embedding_infra['columns']):
            report.embedding_infra['primary_store'] = 'embeddings table'
        elif any(c['table'] == 'source_texts' and c['column'] == 'embedding'
                 for c in report.embedding_infra['columns']):
            report.embedding_infra['primary_store'] = 'source_texts.embedding'

        # 10. Check embeddings table structure
        embed_cols_detail = await conn.fetch("""
            SELECT column_name, data_type
            FROM information_schema.columns
            WHERE table_name = 'embeddings'
            ORDER BY ordinal_position
        """)
        report.embedding_infra['embeddings_table_columns'] = [
            {'column': r['column_name'], 'type': r['data_type']}
            for r in embed_cols_detail
        ]

        # 11. Sample translation structure
        trans_cols = await conn.fetch("""
            SELECT column_name, data_type
            FROM information_schema.columns
            WHERE table_name = 'translations'
            ORDER BY ordinal_position
        """)
        report.translation_coverage['table_columns'] = [
            r['column_name'] for r in trans_cols
        ]

        # Generate recommendations
        if report.embedding_coverage['coverage_percent'] < 100:
            report.recommendations.append(
                f"Embeddings coverage is {report.embedding_coverage['coverage_percent']:.1f}%. "
                f"{report.embedding_coverage['missing']:,} passages need embeddings."
            )
        if not report.backfill_jobs_exists:
            report.recommendations.append('Create backfill_jobs table for resumable processing')
        if report.translation_coverage['multi_translation_urns'] > 0:
            report.recommendations.append(
                f"{report.translation_coverage['multi_translation_urns']:,} passages have multiple translations - "
                f"eligible for consensus building"
            )
        if not any('hnsw' in idx['definition'].lower() for idx in report.indexes):
            report.recommendations.append('Consider adding HNSW indexes for vector similarity search')

    finally:
        await conn.close()

    return report


def format_report(report: AuditReport) -> str:
    """Format audit report as human-readable text."""
    output = f"""
================================================================================
                        LOGOS DATABASE AUDIT REPORT
                        {report.timestamp}
================================================================================

EMBEDDING INFRASTRUCTURE
-------------------------
Primary Store: {report.embedding_infra['primary_store']}

Vector Columns Found: {len(report.embedding_infra['columns'])}
"""

    # Group columns by table
    table_groups: Dict[str, List[str]] = {}
    for c in report.embedding_infra['columns']:
        table = c['table']
        if table not in table_groups:
            table_groups[table] = []
        table_groups[table].append(f"{c['column']} ({c['type']})")

    for table, cols in sorted(table_groups.items()):
        output += f"  {table}: {', '.join(cols)}\n"

    output += "\nDetected Dimensions:\n"
    for key, dims in report.embedding_infra['dimensions'].items():
        output += f"  {key}: {dims if dims else 'N/A'}\n"

    if 'embeddings_table_columns' in report.embedding_infra:
        output += "\nEmbeddings Table Structure:\n"
        for col in report.embedding_infra['embeddings_table_columns']:
            output += f"  {col['column']}: {col['type']}\n"

    output += f"""
SOURCE TEXT COUNTS
------------------
Total: {report.total_sources:,}
"""
    for lang, count in sorted(report.source_counts.items(), key=lambda x: -x[1]):
        output += f"  {lang}: {count:,}\n"

    output += f"""
EMBEDDING COVERAGE
------------------
Total Passages: {report.embedding_coverage['total']:,}
With Embeddings: {report.embedding_coverage['with_embeddings']:,}
Missing: {report.embedding_coverage['missing']:,}
Coverage: {report.embedding_coverage['coverage_percent']:.2f}%

TRANSLATION COVERAGE
--------------------
Total Translations: {report.translation_coverage['total']:,}
With Embeddings: {report.translation_coverage['with_embeddings']:,}
Unique URNs: {report.translation_coverage.get('unique_urns', 'N/A')}
Multi-Translation URNs (>=2): {report.translation_coverage.get('multi_translation_urns', 'N/A')}
"""

    if 'table_columns' in report.translation_coverage:
        output += f"Table Columns: {', '.join(report.translation_coverage['table_columns'])}\n"

    output += f"""
MORPHOLOGY COVERAGE
-------------------
Morph Entries: {report.morphology_coverage['morph_entries']:,}
Passage Tokens: {report.morphology_coverage['passage_tokens']:,}

INFRASTRUCTURE STATUS
---------------------
backfill_jobs table exists: {'YES' if report.backfill_jobs_exists else 'NO'}
Existing translation system tables: {', '.join(report.existing_translation_tables) if report.existing_translation_tables else 'NONE'}

VECTOR INDEXES
--------------
"""
    if not report.indexes:
        output += "  No vector/urn/language indexes found\n"
    else:
        for idx in report.indexes:
            output += f"  {idx['name']}\n"

    output += """
RECOMMENDATIONS
---------------
"""
    if not report.recommendations:
        output += "  None - infrastructure looks complete\n"
    else:
        for i, rec in enumerate(report.recommendations, 1):
            output += f"  {i}. {rec}\n"

    output += """
================================================================================
                              END OF AUDIT REPORT
================================================================================
"""
    return output


async def main():
    print('Starting LOGOS Database Audit...\n')

    try:
        report = await run_audit()
        formatted_report = format_report(report)

        # Ensure logs directory exists
        logs_dir = os.path.join(os.path.dirname(__file__), '..', '..', 'logs')
        os.makedirs(logs_dir, exist_ok=True)

        # Write text report
        audit_path = os.path.join(logs_dir, 'audit.txt')
        with open(audit_path, 'w') as f:
            f.write(formatted_report)

        # Write JSON report
        json_path = os.path.join(logs_dir, 'audit.json')
        with open(json_path, 'w') as f:
            json.dump(asdict(report), f, indent=2, default=str)

        print(formatted_report)
        print(f"\nAudit report written to: {audit_path}")
        print(f"JSON report written to: {json_path}")

    except Exception as e:
        print(f'Audit failed: {e}')
        import traceback
        traceback.print_exc()
        sys.exit(1)


if __name__ == '__main__':
    asyncio.run(main())
