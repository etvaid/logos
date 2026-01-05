#!/usr/bin/env npx ts-node
/**
 * LOGOS Database Audit Script
 * Phase 0: Detect existing infrastructure and generate report
 */

import { Pool } from 'pg';
import * as fs from 'fs';
import * as path from 'path';

const DATABASE_URL = process.env.DATABASE_URL ||
  'postgresql://postgres:voqQePIH4adopQUa-1UUaFKnOT-mtsod@maglev.proxy.rlwy.net:49514/railway';

interface AuditReport {
  timestamp: string;
  embeddingInfra: {
    columns: Array<{table: string; column: string; type: string}>;
    dimensions: Record<string, number | null>;
    primaryStore: string;
  };
  sourceCounts: Record<string, number>;
  totalSources: number;
  embeddingCoverage: {
    total: number;
    withEmbeddings: number;
    missing: number;
    coveragePercent: number;
  };
  translationCoverage: {
    total: number;
    withEmbeddings: number;
    uniqueUrns: number;
    multiTranslationUrns: number;
  };
  morphologyCoverage: {
    morphEntries: number;
    passageTokens: number;
  };
  backfillJobsExists: boolean;
  indexes: Array<{name: string; definition: string}>;
  existingTranslationTables: string[];
  recommendations: string[];
}

async function runAudit(): Promise<AuditReport> {
  const pool = new Pool({
    connectionString: DATABASE_URL,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 30000,
  });

  const report: AuditReport = {
    timestamp: new Date().toISOString(),
    embeddingInfra: { columns: [], dimensions: {}, primaryStore: 'unknown' },
    sourceCounts: {},
    totalSources: 0,
    embeddingCoverage: { total: 0, withEmbeddings: 0, missing: 0, coveragePercent: 0 },
    translationCoverage: { total: 0, withEmbeddings: 0, uniqueUrns: 0, multiTranslationUrns: 0 },
    morphologyCoverage: { morphEntries: 0, passageTokens: 0 },
    backfillJobsExists: false,
    indexes: [],
    existingTranslationTables: [],
    recommendations: [],
  };

  try {
    console.log('Connecting to database...');
    const client = await pool.connect();

    // 1. Embedding columns
    console.log('Auditing embedding infrastructure...');
    const embedCols = await client.query(`
      SELECT table_name, column_name, data_type
      FROM information_schema.columns
      WHERE table_schema = 'public'
      AND (data_type ILIKE '%vector%'
           OR column_name ILIKE '%embed%'
           OR column_name ILIKE '%vector%')
      ORDER BY table_name, column_name
    `);
    report.embeddingInfra.columns = embedCols.rows.map(r => ({
      table: r.table_name,
      column: r.column_name,
      type: r.data_type
    }));

    // 2. Check vector dimensions on translations
    try {
      const transDims = await client.query(`
        SELECT vector_dims(embedding) as dims
        FROM translations
        WHERE embedding IS NOT NULL
        LIMIT 1
      `);
      if (transDims.rows.length > 0) {
        report.embeddingInfra.dimensions.translations = transDims.rows[0].dims;
      }
    } catch (e) {
      console.log('Note: translations.embedding dimension check failed');
    }

    // 3. Check style_invariant_embeddings dimensions
    try {
      const sieDims = await client.query(`
        SELECT
          CASE WHEN original_embedding IS NOT NULL THEN vector_dims(original_embedding) ELSE NULL END as orig_dims,
          CASE WHEN invariant_embedding IS NOT NULL THEN vector_dims(invariant_embedding) ELSE NULL END as inv_dims
        FROM style_invariant_embeddings
        WHERE original_embedding IS NOT NULL OR invariant_embedding IS NOT NULL
        LIMIT 1
      `);
      if (sieDims.rows.length > 0) {
        report.embeddingInfra.dimensions.style_invariant_original = sieDims.rows[0].orig_dims;
        report.embeddingInfra.dimensions.style_invariant_invariant = sieDims.rows[0].inv_dims;
      }
    } catch (e) {
      console.log('Note: style_invariant_embeddings dimension check failed');
    }

    // 4. Check passages dimensions
    try {
      const passDims = await client.query(`
        SELECT vector_dims(embedding) as dims
        FROM passages
        WHERE embedding IS NOT NULL
        LIMIT 1
      `);
      if (passDims.rows.length > 0) {
        report.embeddingInfra.dimensions.passages = passDims.rows[0].dims;
      }
    } catch (e) {
      console.log('Note: passages.embedding dimension check failed');
    }

    // 5. Source text counts by language
    console.log('Counting source texts...');
    const sourceCounts = await client.query(`
      SELECT language, COUNT(*) as count
      FROM source_texts
      GROUP BY language
      ORDER BY count DESC
    `);
    sourceCounts.rows.forEach(r => {
      report.sourceCounts[r.language || 'unknown'] = parseInt(r.count);
    });
    report.totalSources = Object.values(report.sourceCounts).reduce((a, b) => a + b, 0);

    // 6. Embedding coverage
    console.log('Checking embedding coverage...');
    const embedCount = await client.query(`SELECT COUNT(*) as count FROM embeddings`);
    report.embeddingCoverage.total = report.totalSources;
    report.embeddingCoverage.withEmbeddings = parseInt(embedCount.rows[0].count);
    report.embeddingCoverage.missing = report.totalSources - report.embeddingCoverage.withEmbeddings;
    report.embeddingCoverage.coveragePercent =
      (report.embeddingCoverage.withEmbeddings / report.totalSources * 100);

    // 7. Translation coverage
    console.log('Checking translation coverage...');
    const transCount = await client.query(`SELECT COUNT(*) as count FROM translations`);
    report.translationCoverage.total = parseInt(transCount.rows[0].count);

    const transWithEmbed = await client.query(`
      SELECT COUNT(*) as count FROM translations WHERE embedding IS NOT NULL
    `);
    report.translationCoverage.withEmbeddings = parseInt(transWithEmbed.rows[0].count);

    // Check for URN column and count unique
    try {
      const urnCheck = await client.query(`
        SELECT column_name FROM information_schema.columns
        WHERE table_name = 'translations' AND column_name IN ('urn', 'source_text_id', 'passage_urn')
      `);
      if (urnCheck.rows.length > 0) {
        const urnCol = urnCheck.rows[0].column_name;
        const uniqueUrns = await client.query(`
          SELECT COUNT(DISTINCT ${urnCol}) as count FROM translations WHERE ${urnCol} IS NOT NULL
        `);
        report.translationCoverage.uniqueUrns = parseInt(uniqueUrns.rows[0].count);

        const multiTrans = await client.query(`
          SELECT COUNT(*) as count FROM (
            SELECT ${urnCol} FROM translations
            WHERE ${urnCol} IS NOT NULL
            GROUP BY ${urnCol}
            HAVING COUNT(*) >= 2
          ) sub
        `);
        report.translationCoverage.multiTranslationUrns = parseInt(multiTrans.rows[0].count);
      }
    } catch (e) {
      console.log('Note: URN analysis failed');
    }

    // 8. Morphology coverage
    console.log('Checking morphology coverage...');
    try {
      const morphCount = await client.query(`SELECT COUNT(*) as count FROM morph_entries`);
      report.morphologyCoverage.morphEntries = parseInt(morphCount.rows[0].count);
    } catch (e) {
      report.morphologyCoverage.morphEntries = 0;
    }

    try {
      const tokenCount = await client.query(`SELECT COUNT(*) as count FROM passage_tokens`);
      report.morphologyCoverage.passageTokens = parseInt(tokenCount.rows[0].count);
    } catch (e) {
      report.morphologyCoverage.passageTokens = 0;
    }

    // 9. Backfill jobs check
    console.log('Checking backfill_jobs table...');
    const backfillCheck = await client.query(`
      SELECT EXISTS (
        SELECT 1 FROM information_schema.tables
        WHERE table_name = 'backfill_jobs'
      ) as exists
    `);
    report.backfillJobsExists = backfillCheck.rows[0].exists;

    // 10. Index check
    console.log('Checking indexes...');
    const indexes = await client.query(`
      SELECT indexname, indexdef
      FROM pg_indexes
      WHERE schemaname = 'public'
      AND (indexdef ILIKE '%vector%'
           OR indexdef ILIKE '%hnsw%'
           OR indexdef ILIKE '%ivfflat%'
           OR indexname ILIKE '%urn%'
           OR indexname ILIKE '%language%')
      ORDER BY indexname
    `);
    report.indexes = indexes.rows.map(r => ({
      name: r.indexname,
      definition: r.indexdef
    }));

    // 11. Existing translation system tables
    console.log('Checking existing translation system tables...');
    const existingTables = await client.query(`
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
    `);
    report.existingTranslationTables = existingTables.rows.map(r => r.table_name);

    // Determine primary embedding store
    if (report.embeddingInfra.columns.some(c => c.table === 'embeddings' && c.column === 'embedding')) {
      report.embeddingInfra.primaryStore = 'embeddings table';
    } else if (report.embeddingInfra.columns.some(c => c.table === 'source_texts' && c.column === 'embedding')) {
      report.embeddingInfra.primaryStore = 'source_texts.embedding';
    }

    // Generate recommendations
    if (report.embeddingCoverage.coveragePercent < 100) {
      report.recommendations.push(
        `Embeddings coverage is ${report.embeddingCoverage.coveragePercent.toFixed(1)}%. ` +
        `${report.embeddingCoverage.missing.toLocaleString()} passages need embeddings.`
      );
    }
    if (!report.backfillJobsExists) {
      report.recommendations.push('Create backfill_jobs table for resumable processing');
    }
    if (report.translationCoverage.multiTranslationUrns > 0) {
      report.recommendations.push(
        `${report.translationCoverage.multiTranslationUrns.toLocaleString()} passages have multiple translations - ` +
        `eligible for consensus building`
      );
    }
    if (report.indexes.filter(i => i.definition.includes('hnsw')).length === 0) {
      report.recommendations.push('Consider adding HNSW indexes for vector similarity search');
    }

    client.release();
    return report;

  } finally {
    await pool.end();
  }
}

function formatReport(report: AuditReport): string {
  let output = `
================================================================================
                        LOGOS DATABASE AUDIT REPORT
                        ${report.timestamp}
================================================================================

EMBEDDING INFRASTRUCTURE
-------------------------
Primary Store: ${report.embeddingInfra.primaryStore}

Vector Columns Found: ${report.embeddingInfra.columns.length}
`;

  const tableGroups: Record<string, string[]> = {};
  report.embeddingInfra.columns.forEach(c => {
    if (!tableGroups[c.table]) tableGroups[c.table] = [];
    tableGroups[c.table].push(`${c.column} (${c.type})`);
  });
  Object.entries(tableGroups).forEach(([table, cols]) => {
    output += `  ${table}: ${cols.join(', ')}\n`;
  });

  output += `
Detected Dimensions:
`;
  Object.entries(report.embeddingInfra.dimensions).forEach(([key, dims]) => {
    output += `  ${key}: ${dims ?? 'N/A'}\n`;
  });

  output += `
SOURCE TEXT COUNTS
------------------
Total: ${report.totalSources.toLocaleString()}
`;
  Object.entries(report.sourceCounts)
    .sort((a, b) => b[1] - a[1])
    .forEach(([lang, count]) => {
      output += `  ${lang}: ${count.toLocaleString()}\n`;
    });

  output += `
EMBEDDING COVERAGE
------------------
Total Passages: ${report.embeddingCoverage.total.toLocaleString()}
With Embeddings: ${report.embeddingCoverage.withEmbeddings.toLocaleString()}
Missing: ${report.embeddingCoverage.missing.toLocaleString()}
Coverage: ${report.embeddingCoverage.coveragePercent.toFixed(2)}%

TRANSLATION COVERAGE
--------------------
Total Translations: ${report.translationCoverage.total.toLocaleString()}
With Embeddings: ${report.translationCoverage.withEmbeddings.toLocaleString()}
Unique URNs: ${report.translationCoverage.uniqueUrns.toLocaleString()}
Multi-Translation URNs (>=2): ${report.translationCoverage.multiTranslationUrns.toLocaleString()}

MORPHOLOGY COVERAGE
-------------------
Morph Entries: ${report.morphologyCoverage.morphEntries.toLocaleString()}
Passage Tokens: ${report.morphologyCoverage.passageTokens.toLocaleString()}

INFRASTRUCTURE STATUS
---------------------
backfill_jobs table exists: ${report.backfillJobsExists ? 'YES' : 'NO'}
Existing translation system tables: ${report.existingTranslationTables.length > 0 ? report.existingTranslationTables.join(', ') : 'NONE'}

VECTOR INDEXES
--------------
`;
  if (report.indexes.length === 0) {
    output += '  No vector/urn/language indexes found\n';
  } else {
    report.indexes.forEach(idx => {
      output += `  ${idx.name}\n`;
    });
  }

  output += `
RECOMMENDATIONS
---------------
`;
  if (report.recommendations.length === 0) {
    output += '  None - infrastructure looks complete\n';
  } else {
    report.recommendations.forEach((rec, i) => {
      output += `  ${i + 1}. ${rec}\n`;
    });
  }

  output += `
================================================================================
                              END OF AUDIT REPORT
================================================================================
`;
  return output;
}

async function main() {
  console.log('Starting LOGOS Database Audit...\n');

  try {
    const report = await runAudit();
    const formattedReport = formatReport(report);

    // Write to logs/audit.txt
    const logsDir = path.join(__dirname, '..', '..', 'logs');
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir, { recursive: true });
    }
    const auditPath = path.join(logsDir, 'audit.txt');
    fs.writeFileSync(auditPath, formattedReport);

    // Also write JSON for programmatic access
    const jsonPath = path.join(logsDir, 'audit.json');
    fs.writeFileSync(jsonPath, JSON.stringify(report, null, 2));

    console.log(formattedReport);
    console.log(`\nAudit report written to: ${auditPath}`);
    console.log(`JSON report written to: ${jsonPath}`);

  } catch (error) {
    console.error('Audit failed:', error);
    process.exit(1);
  }
}

main();
