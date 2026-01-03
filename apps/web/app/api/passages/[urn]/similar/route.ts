import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import type { SemanticSearchResult } from '@/lib/types';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ urn: string }> }
) {
  try {
    const { urn } = await params;
    const decodedUrn = decodeURIComponent(urn);
    const searchParams = request.nextUrl.searchParams;
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 50);
    const excludeSameWork = searchParams.get('exclude_same_work') === 'true';

    // First, get the source passage and its embedding
    const sourcePassage = await query<{ content: string; author: string; work: string; language: string }>(
      `SELECT content, author, work, language FROM source_texts WHERE urn = $1`,
      [decodedUrn]
    );

    if (sourcePassage.length === 0) {
      return NextResponse.json(
        { error: 'Passage not found' },
        { status: 404 }
      );
    }

    const source = sourcePassage[0];

    // Try vector similarity search first
    let results: SemanticSearchResult[];

    try {
      // Check if we have embeddings with HNSW index
      const vectorResults = await query<SemanticSearchResult>(
        `WITH source_embedding AS (
          SELECT vector FROM embeddings WHERE urn = $1 LIMIT 1
        )
        SELECT
          st.urn,
          st.author,
          st.work,
          st.section,
          LEFT(st.content, 500) as content,
          st.language,
          1 - (e.vector <=> se.vector) as similarity
        FROM embeddings e
        CROSS JOIN source_embedding se
        JOIN source_texts st ON e.urn = st.urn
        WHERE e.urn != $1
        ${excludeSameWork ? 'AND st.work != $3' : ''}
        ORDER BY e.vector <=> se.vector
        LIMIT $2`,
        excludeSameWork
          ? [decodedUrn, limit, source.work]
          : [decodedUrn, limit]
      );

      results = vectorResults;
    } catch {
      // Fall back to text similarity if vector search unavailable
      results = await query<SemanticSearchResult>(
        `SELECT
          urn,
          author,
          work,
          section,
          LEFT(content, 500) as content,
          language,
          similarity(content, $1) as similarity
        FROM source_texts
        WHERE urn != $2
        ${excludeSameWork ? 'AND work != $4' : ''}
        AND content % $1
        ORDER BY similarity DESC
        LIMIT $3`,
        excludeSameWork
          ? [source.content.substring(0, 500), decodedUrn, limit, source.work]
          : [source.content.substring(0, 500), decodedUrn, limit]
      );
    }

    return NextResponse.json({
      source_urn: decodedUrn,
      source_author: source.author,
      source_work: source.work,
      results,
      count: results.length,
    });
  } catch (error) {
    console.error('Similar passages error:', error);
    return NextResponse.json(
      { error: 'Failed to find similar passages' },
      { status: 500 }
    );
  }
}
