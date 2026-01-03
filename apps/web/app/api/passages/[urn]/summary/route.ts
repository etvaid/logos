import { NextRequest, NextResponse } from 'next/server';
import { query, queryOne } from '@/lib/db';
import { CACHE_HEADERS } from '@/lib/cache';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ urn: string }> }
) {
  try {
    const { urn } = await params;
    const decodedUrn = decodeURIComponent(urn);

    // Fetch from materialized views for speed
    const [passage, intertexts, entities] = await Promise.all([
      queryOne<{ work: string; section: string; content: string }>(
        'SELECT work, section, content FROM source_texts WHERE urn = $1',
        [decodedUrn]
      ),
      queryOne<{ intertext_count: number; avg_confidence: number; top_connections: string[] }>(
        'SELECT intertext_count, avg_confidence, top_connections FROM mv_passage_intertexts WHERE urn = $1',
        [decodedUrn]
      ),
      queryOne<{ entity_count: number; entity_types: string[]; people: string[]; places: string[] }>(
        'SELECT entity_count, entity_types, people, places FROM mv_passage_entities WHERE urn = $1',
        [decodedUrn]
      ),
    ]);

    if (!passage) {
      return NextResponse.json({ error: 'Passage not found' }, { status: 404 });
    }

    return NextResponse.json({
      urn: decodedUrn,
      work: passage.work,
      section: passage.section,
      content_preview: passage.content?.substring(0, 200),
      intertexts: intertexts ? {
        count: intertexts.intertext_count,
        avg_confidence: intertexts.avg_confidence,
        top_connections: intertexts.top_connections?.slice(0, 5) || [],
      } : { count: 0, avg_confidence: 0, top_connections: [] },
      entities: entities ? {
        count: entities.entity_count,
        types: entities.entity_types || [],
        people: entities.people?.slice(0, 5) || [],
        places: entities.places || [],
      } : { count: 0, types: [], people: [], places: [] },
    }, {
      headers: CACHE_HEADERS.computed,
    });
  } catch (error) {
    console.error('Summary fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch summary' },
      { status: 500 }
    );
  }
}
