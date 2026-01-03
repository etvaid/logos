import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import type { GateResults, ConfidenceScore } from '@/lib/types';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ entityType: string; entityId: string }> }
) {
  try {
    const { entityType, entityId } = await params;
    const decodedId = decodeURIComponent(entityId);

    // Fetch gate results
    const gateRows = await query<{
      gate_1_name: string;
      gate_1_passed: boolean;
      gate_1_score: number;
      gate_1_threshold: number;
      gate_1_details: Record<string, unknown>;
      gate_2_name: string;
      gate_2_passed: boolean;
      gate_2_score: number;
      gate_2_threshold: number;
      gate_2_details: Record<string, unknown>;
      gate_3_name: string;
      gate_3_passed: boolean;
      gate_3_score: number;
      gate_3_threshold: number;
      gate_3_details: Record<string, unknown>;
      gate_4_name: string;
      gate_4_passed: boolean;
      gate_4_score: number;
      gate_4_threshold: number;
      gate_4_details: Record<string, unknown>;
      gate_5_name: string;
      gate_5_passed: boolean;
      gate_5_score: number;
      gate_5_threshold: number;
      gate_5_details: Record<string, unknown>;
      gates_passed: number;
      metrics_json: Record<string, unknown>;
      computed_at: string;
      pipeline_version: string;
    }>(
      `SELECT * FROM gate_results
       WHERE entity_type = $1 AND entity_id = $2`,
      [entityType, decodedId]
    );

    // Fetch confidence score
    const confidenceRows = await query<{
      score: number;
      tier: string;
      components_json: Record<string, number>;
      computed_at: string;
      pipeline_version: string;
    }>(
      `SELECT score, tier, components_json, computed_at, pipeline_version
       FROM confidence_scores
       WHERE entity_type = $1 AND entity_id = $2`,
      [entityType, decodedId]
    );

    // Format gate results
    let gateResults: GateResults | null = null;
    if (gateRows.length > 0) {
      const row = gateRows[0];
      gateResults = {
        entity_type: entityType,
        entity_id: decodedId,
        gates: [
          {
            name: row.gate_1_name || 'statistical_significance',
            passed: row.gate_1_passed,
            score: row.gate_1_score,
            threshold: row.gate_1_threshold,
            details: row.gate_1_details,
          },
          {
            name: row.gate_2_name || 'random_baseline',
            passed: row.gate_2_passed,
            score: row.gate_2_score,
            threshold: row.gate_2_threshold,
            details: row.gate_2_details,
          },
          {
            name: row.gate_3_name || 'permutation_test',
            passed: row.gate_3_passed,
            score: row.gate_3_score,
            threshold: row.gate_3_threshold,
            details: row.gate_3_details,
          },
          {
            name: row.gate_4_name || 'feature_ablation',
            passed: row.gate_4_passed,
            score: row.gate_4_score,
            threshold: row.gate_4_threshold,
            details: row.gate_4_details,
          },
          {
            name: row.gate_5_name || 'cross_validation',
            passed: row.gate_5_passed,
            score: row.gate_5_score,
            threshold: row.gate_5_threshold,
            details: row.gate_5_details,
          },
        ].filter(g => g.score !== null),
        gates_passed: row.gates_passed,
        total_gates: 5,
        metrics: row.metrics_json,
        computed_at: row.computed_at,
        pipeline_version: row.pipeline_version,
      };
    }

    // Format confidence score
    let confidenceScore: ConfidenceScore | null = null;
    if (confidenceRows.length > 0) {
      const row = confidenceRows[0];
      confidenceScore = {
        entity_type: entityType,
        entity_id: decodedId,
        score: row.score,
        tier: row.tier as 'high' | 'medium' | 'low' | 'uncertain',
        components: row.components_json || {},
        computed_at: row.computed_at,
        pipeline_version: row.pipeline_version,
      };
    }

    // Return combined evidence
    return NextResponse.json({
      entity_type: entityType,
      entity_id: decodedId,
      has_evidence: gateResults !== null || confidenceScore !== null,
      gate_results: gateResults,
      confidence: confidenceScore,
    });
  } catch (error) {
    console.error('Evidence fetch error:', error);

    // Return empty evidence if table doesn't exist yet
    if (error instanceof Error && error.message.includes('does not exist')) {
      return NextResponse.json({
        entity_type: '',
        entity_id: '',
        has_evidence: false,
        gate_results: null,
        confidence: null,
        message: 'Evidence tables not yet populated',
      });
    }

    return NextResponse.json(
      { error: 'Failed to fetch evidence' },
      { status: 500 }
    );
  }
}
