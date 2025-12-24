import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const language = searchParams.get('lang') || 'all';
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    if (!query || query.length < 2) {
      return NextResponse.json({ 
        error: 'Query must be at least 2 characters long' 
      }, { status: 400 });
    }

    const db = await getDb();
    
    let whereClause = `WHERE (lemma LIKE ? OR definition LIKE ? OR transliteration LIKE ?)`;
    let params = [`%${query}%`, `%${query}%`, `%${query}%`];

    if (language !== 'all') {
      whereClause += ` AND language = ?`;
      params.push(language);
    }

    const searchQuery = `
      SELECT 
        id,
        lemma,
        transliteration,
        definition,
        language,
        pos,
        frequency,
        era,
        etymology,
        created_at
      FROM lexicon 
      ${whereClause}
      ORDER BY 
        CASE 
          WHEN lemma LIKE ? THEN 1
          WHEN lemma LIKE ? THEN 2
          ELSE 3
        END,
        frequency DESC,
        lemma
      LIMIT ? OFFSET ?
    `;

    const countQuery = `
      SELECT COUNT(*) as total
      FROM lexicon 
      ${whereClause}
    `;

    params.push(`${query}%`, `%${query}%`, limit, offset);
    const countParams = [`%${query}%`, `%${query}%`, `%${query}%`];
    if (language !== 'all') {
      countParams.push(language);
    }

    const [entries, countResult] = await Promise.all([
      db.all(searchQuery, params),
      db.get(countQuery, countParams)
    ]);

    const total = countResult?.total || 0;
    const hasMore = offset + limit < total;

    const data = {
      entries,
      pagination: {
        total,
        limit,
        offset,
        hasMore,
        currentPage: Math.floor(offset / limit) + 1,
        totalPages: Math.ceil(total / limit)
      },
      query,
      language
    };

    return NextResponse.json({ data });
  } catch (error) {
    console.error('Lexicon search error:', error);
    return NextResponse.json({ 
      error: 'Failed to search lexicon' 
    }, { status: 500 });
  }
}