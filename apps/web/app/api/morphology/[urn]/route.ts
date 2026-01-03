import { NextRequest, NextResponse } from 'next/server';
import { query, queryOne } from '@/lib/db';

export const dynamic = 'force-dynamic';

interface PassageTokens {
  urn: string;
  language: string;
  tokens: string[];
  morph_ids: number[];
  char_starts: number[];
  char_ends: number[];
  token_count: number;
}

interface MorphEntry {
  morph_id: number;
  language: string;
  lemma: string;
  pos: string;
  feats: Record<string, string>;
  gloss: string | null;
  frequency: number;
}

interface HydratedToken {
  index: number;
  surface_form: string;
  char_start: number;
  char_end: number;
  lemma: string;
  pos: string;
  feats: Record<string, string>;
  gloss: string | null;
  frequency: number;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ urn: string }> }
) {
  try {
    const { urn } = await params;
    const decodedUrn = decodeURIComponent(urn);

    // First, try the new compact schema (passage_tokens + morph_entries)
    const passage = await queryOne<PassageTokens>(
      `SELECT urn, language, tokens, morph_ids, char_starts, char_ends, token_count
       FROM passage_tokens
       WHERE urn = $1`,
      [decodedUrn]
    );

    if (passage && passage.tokens.length > 0) {
      // Hydrate with morph_entries in one query
      const morphIds = passage.morph_ids.filter((id) => id != null);

      if (morphIds.length === 0) {
        // No morph data, return tokens without morphology
        return NextResponse.json({
          urn: decodedUrn,
          language: passage.language,
          tokens: passage.tokens.map((token, i) => ({
            index: i,
            surface_form: token,
            char_start: passage.char_starts[i],
            char_end: passage.char_ends[i],
            lemma: token,
            pos: 'unknown',
            feats: {},
            gloss: null,
            frequency: 0,
          })),
          has_morphology: false,
          token_count: passage.token_count,
          schema_version: 'v2',
        });
      }

      // Fetch all referenced morph_entries in one query
      const morphEntries = await query<MorphEntry>(
        `SELECT morph_id, language, lemma, pos, feats, gloss, frequency
         FROM morph_entries
         WHERE morph_id = ANY($1)`,
        [morphIds]
      );

      // Create lookup map
      const morphMap = new Map<number, MorphEntry>();
      for (const entry of morphEntries) {
        morphMap.set(entry.morph_id, entry);
      }

      // Hydrate tokens
      const hydratedTokens: HydratedToken[] = passage.tokens.map((token, i) => {
        const morphId = passage.morph_ids[i];
        const morph = morphMap.get(morphId);

        return {
          index: i,
          surface_form: token,
          char_start: passage.char_starts[i],
          char_end: passage.char_ends[i],
          lemma: morph?.lemma ?? token,
          pos: morph?.pos ?? 'unknown',
          feats: morph?.feats ?? {},
          gloss: morph?.gloss ?? null,
          frequency: morph?.frequency ?? 0,
        };
      });

      return NextResponse.json({
        urn: decodedUrn,
        language: passage.language,
        tokens: hydratedTokens,
        has_morphology: true,
        token_count: passage.token_count,
        schema_version: 'v2',
      });
    }

    // Fallback: try the legacy token_annotations table
    const legacyTokens = await query<{
      token_index: number;
      surface_form: string;
      lemma: string;
      pos: string;
      gloss: string | null;
    }>(
      `SELECT token_index, surface_form, lemma, pos, gloss
       FROM token_annotations
       WHERE urn = $1
       ORDER BY token_index`,
      [decodedUrn]
    );

    if (legacyTokens.length > 0) {
      return NextResponse.json({
        urn: decodedUrn,
        tokens: legacyTokens.map((t) => ({
          index: t.token_index,
          surface_form: t.surface_form,
          char_start: 0,
          char_end: 0,
          lemma: t.lemma,
          pos: t.pos ?? 'unknown',
          feats: {},
          gloss: t.gloss,
          frequency: 0,
        })),
        has_morphology: true,
        token_count: legacyTokens.length,
        schema_version: 'v1_legacy',
      });
    }

    // No morphology data found
    return NextResponse.json({
      urn: decodedUrn,
      tokens: [],
      has_morphology: false,
      token_count: 0,
      message: 'No morphology data available for this passage yet',
    });
  } catch (error) {
    console.error('Morphology fetch error:', error);

    if (error instanceof Error && error.message.includes('DATABASE_URL')) {
      return NextResponse.json({
        urn: '',
        tokens: [],
        has_morphology: false,
        message: 'Database not configured',
      });
    }

    return NextResponse.json(
      { error: 'Failed to fetch morphology data' },
      { status: 500 }
    );
  }
}
