import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import type { IntertextEvidence } from '@/lib/types';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const sourceUrn = searchParams.get('source');
    const targetUrn = searchParams.get('target');

    if (!sourceUrn || !targetUrn) {
      return NextResponse.json(
        { error: 'Both source and target URN parameters are required' },
        { status: 400 }
      );
    }

    // Fetch intertext evidence for this edge
    const evidence = await query<IntertextEvidence>(
      `SELECT
        id,
        source_urn,
        target_urn,
        confidence_score,
        connection_type,
        directionality,
        lexical_overlap,
        function_word_overlap,
        rare_word_overlap,
        semantic_similarity,
        ngram_overlap_2,
        ngram_overlap_3,
        ngram_overlap_4,
        syntax_similarity,
        matched_phrases,
        shared_rare_words,
        shared_ngrams,
        alternative_explanations,
        confidence_notes,
        computed_at,
        pipeline_version
      FROM intertext_evidence
      WHERE (source_urn = $1 AND target_urn = $2)
         OR (source_urn = $2 AND target_urn = $1)
      LIMIT 1`,
      [sourceUrn, targetUrn]
    );

    if (evidence.length === 0) {
      // Return a structured "no evidence yet" response
      return NextResponse.json({
        source_urn: sourceUrn,
        target_urn: targetUrn,
        has_evidence: false,
        evidence: null,
        message: 'Evidence not yet computed for this connection',
      });
    }

    const e = evidence[0];

    // Format the response with computed fields
    return NextResponse.json({
      source_urn: e.source_urn,
      target_urn: e.target_urn,
      has_evidence: true,
      evidence: {
        ...e,
        // Add computed summary
        top_signals: getTopSignals(e),
        confidence_tier: getConfidenceTier(e.confidence_score),
      },
    });
  } catch (error) {
    console.error('Intertext evidence fetch error:', error);

    if (error instanceof Error && error.message.includes('does not exist')) {
      return NextResponse.json({
        source_urn: '',
        target_urn: '',
        has_evidence: false,
        evidence: null,
        message: 'Intertext evidence table not yet populated',
      });
    }

    return NextResponse.json(
      { error: 'Failed to fetch intertext evidence' },
      { status: 500 }
    );
  }
}

// Helper to identify top contributing signals
function getTopSignals(evidence: IntertextEvidence): { name: string; value: number; contribution: string }[] {
  const signals = [
    { name: 'Lexical Overlap', value: evidence.lexical_overlap, weight: 0.2 },
    { name: 'Rare Word Overlap', value: evidence.rare_word_overlap, weight: 0.25 },
    { name: 'Semantic Similarity', value: evidence.semantic_similarity, weight: 0.25 },
    { name: 'N-gram Overlap (2)', value: evidence.ngram_overlap_2, weight: 0.1 },
    { name: 'N-gram Overlap (3)', value: evidence.ngram_overlap_3, weight: 0.1 },
    { name: 'Syntax Similarity', value: evidence.syntax_similarity, weight: 0.1 },
  ];

  // Sort by weighted contribution
  return signals
    .map(s => ({
      name: s.name,
      value: s.value || 0,
      contribution: ((s.value || 0) * s.weight * 100).toFixed(1) + '%',
    }))
    .filter(s => s.value > 0)
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);
}

function getConfidenceTier(score: number): string {
  if (score >= 0.85) return 'high';
  if (score >= 0.65) return 'medium';
  if (score >= 0.45) return 'low';
  return 'uncertain';
}
