import { NextRequest, NextResponse } from 'next/server';
import { query, queryOne } from '@/lib/db';

export const dynamic = 'force-dynamic';

interface NamedEntity {
  id: number;
  entity_type: string;
  canonical_name: string;
  display_name: string;
  description: string | null;
  latitude: number | null;
  longitude: number | null;
  region: string | null;
  date_start: number | null;
  date_end: number | null;
}

interface ThematicTag {
  id: number;
  tag_name: string;
  category: string;
  description: string | null;
}

interface TimelineEvent {
  id: number;
  event_name: string;
  event_type: string;
  date_start: number;
  date_end: number | null;
  date_display: string;
  description: string | null;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ urn: string }> }
) {
  try {
    const { urn } = await params;
    const decodedUrn = decodeURIComponent(urn);

    // Check for cached context card
    const cached = await queryOne<{ entities: unknown; places: unknown; themes: unknown; date_range: unknown; historical_context: string }>(
      'SELECT entities, places, themes, date_range, historical_context FROM context_cards WHERE urn = $1',
      [decodedUrn]
    );

    if (cached) {
      return NextResponse.json({
        urn: decodedUrn,
        cached: true,
        ...cached,
      });
    }

    // Get passage info
    const passage = await queryOne<{ work: string; section: string; content: string }>(
      'SELECT work, section, content FROM source_texts WHERE urn = $1',
      [decodedUrn]
    );

    if (!passage) {
      return NextResponse.json({ error: 'Passage not found' }, { status: 404 });
    }

    // Get entity mentions for this passage
    const mentions = await query<{ entity_id: number; mention_text: string }>(
      `SELECT entity_id, mention_text FROM entity_mentions WHERE urn = $1`,
      [decodedUrn]
    );

    // Get full entity details
    let entities: NamedEntity[] = [];
    if (mentions.length > 0) {
      const entityIds = mentions.map(m => m.entity_id);
      entities = await query<NamedEntity>(
        `SELECT id, entity_type, canonical_name, display_name, description,
                latitude, longitude, region, date_start, date_end
         FROM named_entities WHERE id = ANY($1)`,
        [entityIds]
      );
    }

    // Get themes for this passage
    const passageThemes = await query<{ tag_id: number }>(
      'SELECT tag_id FROM passage_themes WHERE urn = $1',
      [decodedUrn]
    );

    let themes: ThematicTag[] = [];
    if (passageThemes.length > 0) {
      const tagIds = passageThemes.map(t => t.tag_id);
      themes = await query<ThematicTag>(
        'SELECT id, tag_name, category, description FROM thematic_tags WHERE id = ANY($1)',
        [tagIds]
      );
    }

    // Get all available thematic tags for reference
    const allTags = await query<ThematicTag>(
      'SELECT id, tag_name, category, description FROM thematic_tags ORDER BY category, tag_name'
    );

    // Separate places from other entities
    const places = entities.filter(e => e.entity_type === 'place' && e.latitude);
    const people = entities.filter(e => e.entity_type === 'person');
    const institutions = entities.filter(e => e.entity_type === 'institution');

    // Get timeline events for the estimated time period
    // For NT texts, default to 30 CE
    const estimatedYear = 30;
    const timelineEvents = await query<TimelineEvent>(
      `SELECT id, event_name, event_type, date_start, date_end, date_display, description
       FROM timeline_events
       WHERE date_start BETWEEN $1 AND $2
       ORDER BY date_start`,
      [estimatedYear - 50, estimatedYear + 50]
    );

    return NextResponse.json({
      urn: decodedUrn,
      work: passage.work,
      section: passage.section,
      cached: false,
      entities: {
        people,
        places,
        institutions,
        all: entities,
      },
      themes,
      available_tags: allTags,
      timeline: {
        estimated_year: estimatedYear,
        events: timelineEvents,
      },
      map_markers: places.map(p => ({
        id: p.id,
        name: p.display_name,
        lat: p.latitude,
        lng: p.longitude,
        region: p.region,
      })),
    });
  } catch (error) {
    console.error('Context fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch context' },
      { status: 500 }
    );
  }
}
