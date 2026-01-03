import { NextRequest, NextResponse } from 'next/server';
import { query, queryOne } from '@/lib/db';

export const dynamic = 'force-dynamic';

interface IntertextEvidence {
  id: number;
  source_urn: string;
  target_urn: string;
  confidence_score: number;
  connection_type: string;
  directionality: string;
  lexical_overlap: number;
  ngram_overlap_2: number;
  ngram_overlap_3: number;
  ngram_overlap_4: number;
  syntax_similarity: number;
  semantic_similarity: number;
  matched_phrases: string;
  shared_rare_words: string;
  shared_ngrams: string;
  alternative_explanations: string;
  confidence_notes: string;
  pipeline_version: string;
  computed_at: string;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ sourceUrn: string; targetUrn: string }> }
) {
  try {
    const { sourceUrn, targetUrn } = await params;
    const decodedSource = decodeURIComponent(sourceUrn);
    const decodedTarget = decodeURIComponent(targetUrn);

    // Fetch evidence
    const evidence = await queryOne<IntertextEvidence>(
      `SELECT * FROM intertext_evidence
       WHERE source_urn = $1 AND target_urn = $2`,
      [decodedSource, decodedTarget]
    );

    if (!evidence) {
      return NextResponse.json({
        error: 'No evidence found for this pair',
        source_urn: decodedSource,
        target_urn: decodedTarget,
      }, { status: 404 });
    }

    // Parse JSON fields
    const parsedEvidence = {
      ...evidence,
      matched_phrases: JSON.parse(evidence.matched_phrases || '[]'),
      shared_rare_words: JSON.parse(evidence.shared_rare_words || '[]'),
      shared_ngrams: JSON.parse(evidence.shared_ngrams || '[]'),
      alternative_explanations: JSON.parse(evidence.alternative_explanations || '[]'),
    };

    // Fetch passage texts for context
    const [sourcePassage, targetPassage] = await Promise.all([
      queryOne<{ content: string; work: string; section: string }>(
        'SELECT content, work, section FROM source_texts WHERE urn = $1',
        [decodedSource]
      ),
      queryOne<{ content: string; work: string; section: string }>(
        'SELECT content, work, section FROM source_texts WHERE urn = $1',
        [decodedTarget]
      ),
    ]);

    return NextResponse.json({
      evidence: parsedEvidence,
      source: sourcePassage ? {
        urn: decodedSource,
        work: sourcePassage.work,
        section: sourcePassage.section,
        content: sourcePassage.content,
      } : null,
      target: targetPassage ? {
        urn: decodedTarget,
        work: targetPassage.work,
        section: targetPassage.section,
        content: targetPassage.content,
      } : null,
    });
  } catch (error) {
    console.error('Evidence fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch evidence' },
      { status: 500 }
    );
  }
}
