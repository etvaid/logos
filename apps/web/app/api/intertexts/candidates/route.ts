import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

interface IntertextCandidate {
  source_urn: string;
  target_urn: string;
  method: string;
  score: number;
  rank: number;
  created_at: string;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sourceUrn = searchParams.get('source_urn');
    const targetUrn = searchParams.get('target_urn');
    const method = searchParams.get('method');
    const minScore = parseFloat(searchParams.get('min_score') || '0');
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 200);

    let whereClause = 'WHERE 1=1';
    const params: (string | number)[] = [];
    let paramIndex = 1;

    if (sourceUrn) {
      whereClause += ` AND source_urn = $${paramIndex++}`;
      params.push(sourceUrn);
    }

    if (targetUrn) {
      whereClause += ` AND target_urn = $${paramIndex++}`;
      params.push(targetUrn);
    }

    if (method) {
      whereClause += ` AND method = $${paramIndex++}`;
      params.push(method);
    }

    if (minScore > 0) {
      whereClause += ` AND score >= $${paramIndex++}`;
      params.push(minScore);
    }

    const candidates = await query<IntertextCandidate>(
      `SELECT source_urn, target_urn, method, score, rank, created_at
       FROM intertext_candidates
       ${whereClause}
       ORDER BY score DESC, rank ASC
       LIMIT $${paramIndex}`,
      [...params, limit]
    );

    // Get method distribution
    const methodStats = await query<{ method: string; count: number }>(
      `SELECT method, COUNT(*)::int as count
       FROM intertext_candidates
       ${whereClause}
       GROUP BY method`,
      params
    );

    return NextResponse.json({
      candidates,
      count: candidates.length,
      methods: Object.fromEntries(methodStats.map((m) => [m.method, m.count])),
    });
  } catch (error) {
    console.error('Candidate fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch candidates' },
      { status: 500 }
    );
  }
}
