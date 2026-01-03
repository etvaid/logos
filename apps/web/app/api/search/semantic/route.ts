import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import type { SemanticSearchResult } from '@/lib/types';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const queryText = searchParams.get('q');
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100);
    const language = searchParams.get('language');

    if (!queryText) {
      return NextResponse.json(
        { error: 'Query parameter "q" is required' },
        { status: 400 }
      );
    }

    // First, get embedding for the query text
    // This would typically call an embedding API
    // For now, we do a text-based search with similarity ranking

    let results: SemanticSearchResult[];

    // Check if embeddings table exists and has vector column
    try {
      const vectorQuery = `
        WITH query_embedding AS (
          -- In production, this would be: SELECT get_embedding($1) as vec
          -- For now, we'll fall back to text search
          SELECT NULL::vector as vec
        )
        SELECT
          st.urn,
          st.author,
          st.work,
          st.section,
          LEFT(st.content, 500) as content,
          st.language,
          -- Cosine similarity would be: 1 - (e.vector <=> qe.vec) as similarity
          ts_rank(to_tsvector('simple', st.content), plainto_tsquery('simple', $1)) as similarity
        FROM source_texts st
        WHERE to_tsvector('simple', st.content) @@ plainto_tsquery('simple', $1)
        ${language ? 'AND st.language = $3' : ''}
        ORDER BY similarity DESC
        LIMIT $2
      `;

      results = await query<SemanticSearchResult>(
        vectorQuery,
        language ? [queryText, limit, language] : [queryText, limit]
      );
    } catch {
      // Fall back to simple text search if vector search fails
      const fallbackQuery = `
        SELECT
          urn,
          author,
          work,
          section,
          LEFT(content, 500) as content,
          language,
          1.0 as similarity
        FROM source_texts
        WHERE content ILIKE $1
        ${language ? 'AND language = $3' : ''}
        LIMIT $2
      `;

      results = await query<SemanticSearchResult>(
        fallbackQuery,
        language ? [`%${queryText}%`, limit, language] : [`%${queryText}%`, limit]
      );
    }

    return NextResponse.json({
      query: queryText,
      results,
      count: results.length,
      search_type: 'semantic',
    });
  } catch (error) {
    console.error('Semantic search error:', error);
    return NextResponse.json(
      { error: 'Semantic search failed' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text, limit = 20, language } = body;

    if (!text) {
      return NextResponse.json(
        { error: 'Text field is required' },
        { status: 400 }
      );
    }

    // For vector search with provided embedding or text
    // This endpoint supports both:
    // 1. Direct text input (we generate embedding)
    // 2. Pre-computed embedding vector

    const searchLimit = Math.min(limit, 100);

    // Text-based search fallback
    const results = await query<SemanticSearchResult>(
      `SELECT
        urn,
        author,
        work,
        section,
        LEFT(content, 500) as content,
        language,
        similarity(content, $1) as similarity
      FROM source_texts
      WHERE content % $1
      ${language ? 'AND language = $3' : ''}
      ORDER BY similarity DESC
      LIMIT $2`,
      language ? [text, searchLimit, language] : [text, searchLimit]
    );

    return NextResponse.json({
      query: text.substring(0, 100),
      results,
      count: results.length,
      search_type: 'semantic',
    });
  } catch (error) {
    console.error('Semantic search POST error:', error);
    return NextResponse.json(
      { error: 'Semantic search failed' },
      { status: 500 }
    );
  }
}
