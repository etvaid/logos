'use client';

import { useState, useEffect } from 'react';
import { Card, Button, Badge, LoadingSpinner } from '@/components/ui';
import type { GateResults, ConfidenceScore, IntertextEvidence } from '@/lib/types';

// ============================================================================
// Types
// ============================================================================

interface EvidenceDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  entityType: string;
  entityId: string;
  title?: string;
}

interface GateBadgeProps {
  gate: {
    name: string;
    passed: boolean;
    score: number;
    threshold: number;
  };
  onClick?: () => void;
}

interface ConfidenceMeterProps {
  score: number;
  tier: string;
  components?: Record<string, number>;
}

// ============================================================================
// Gate Badge Component
// ============================================================================

export function GateBadge({ gate, onClick }: GateBadgeProps) {
  const gateLabels: Record<string, string> = {
    statistical_significance: 'Stat. Sig.',
    random_baseline: 'vs Random',
    permutation_test: 'Permutation',
    feature_ablation: 'Ablation',
    cross_validation: 'Cross-Val',
  };

  return (
    <button
      onClick={onClick}
      className={`
        px-2 py-1 text-xs rounded-full font-medium transition
        flex items-center gap-1
        ${gate.passed
          ? 'bg-green-900/30 text-green-400 border border-green-400/30 hover:bg-green-900/50'
          : 'bg-red-900/30 text-red-400 border border-red-400/30 hover:bg-red-900/50'
        }
      `}
      title={`${gate.name}: ${(gate.score * 100).toFixed(1)}% (threshold: ${(gate.threshold * 100).toFixed(1)}%)`}
    >
      <span>{gate.passed ? '✓' : '✗'}</span>
      <span>{gateLabels[gate.name] || gate.name}</span>
    </button>
  );
}

// ============================================================================
// Confidence Meter Component
// ============================================================================

export function ConfidenceMeter({ score, tier, components }: ConfidenceMeterProps) {
  const tierColors: Record<string, string> = {
    high: 'bg-green-500',
    medium: 'bg-yellow-500',
    low: 'bg-orange-500',
    uncertain: 'bg-red-500',
  };

  const tierLabels: Record<string, string> = {
    high: 'High Confidence',
    medium: 'Medium Confidence',
    low: 'Low Confidence',
    uncertain: 'Uncertain',
  };

  return (
    <div className="space-y-3">
      {/* Main score bar */}
      <div className="space-y-1">
        <div className="flex justify-between text-sm">
          <span className="text-[#F5F3EF]/70">{tierLabels[tier] || tier}</span>
          <span className="text-[#C9A962] font-mono">{(score * 100).toFixed(1)}%</span>
        </div>
        <div className="h-2 bg-[#C9A962]/10 rounded-full overflow-hidden">
          <div
            className={`h-full ${tierColors[tier] || 'bg-[#C9A962]'} transition-all duration-500`}
            style={{ width: `${score * 100}%` }}
          />
        </div>
      </div>

      {/* Component breakdown */}
      {components && Object.keys(components).length > 0 && (
        <div className="space-y-2 pt-2 border-t border-[#C9A962]/20">
          <span className="text-xs text-[#F5F3EF]/50 uppercase tracking-wider">Components</span>
          {Object.entries(components)
            .sort(([, a], [, b]) => b - a)
            .map(([name, value]) => (
              <div key={name} className="flex items-center gap-2">
                <span className="text-xs text-[#F5F3EF]/60 w-24 truncate capitalize">
                  {name.replace(/_/g, ' ')}
                </span>
                <div className="flex-1 h-1.5 bg-[#C9A962]/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#C9A962]/60"
                    style={{ width: `${value * 100}%` }}
                  />
                </div>
                <span className="text-xs text-[#F5F3EF]/40 w-12 text-right font-mono">
                  {(value * 100).toFixed(0)}%
                </span>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Gate Details Panel
// ============================================================================

function GateDetailsPanel({ gates }: { gates: GateResults }) {
  const [expandedGate, setExpandedGate] = useState<string | null>(null);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm text-[#F5F3EF]/70">Falsification Gates</span>
        <Badge variant={gates.gates_passed >= 4 ? 'success' : gates.gates_passed >= 2 ? 'warning' : 'error'}>
          {gates.gates_passed}/{gates.total_gates} passed
        </Badge>
      </div>

      <div className="flex flex-wrap gap-2">
        {gates.gates.map((gate) => (
          <GateBadge
            key={gate.name}
            gate={gate}
            onClick={() => setExpandedGate(expandedGate === gate.name ? null : gate.name)}
          />
        ))}
      </div>

      {/* Expanded gate details */}
      {expandedGate && (
        <div className="p-3 bg-[#C9A962]/5 rounded-lg border border-[#C9A962]/20 animate-fade-in">
          {gates.gates
            .filter((g) => g.name === expandedGate)
            .map((gate) => (
              <div key={gate.name} className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-[#C9A962]">
                    {gate.name.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                  </span>
                  <Badge size="sm" variant={gate.passed ? 'success' : 'error'}>
                    {gate.passed ? 'PASSED' : 'FAILED'}
                  </Badge>
                </div>
                <div className="text-xs text-[#F5F3EF]/60">
                  Score: <span className="font-mono">{(gate.score * 100).toFixed(2)}%</span>
                  {' | '}
                  Threshold: <span className="font-mono">{(gate.threshold * 100).toFixed(2)}%</span>
                </div>
                {gate.details && (
                  <pre className="text-xs text-[#F5F3EF]/40 overflow-x-auto">
                    {JSON.stringify(gate.details, null, 2)}
                  </pre>
                )}
              </div>
            ))}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Main Evidence Drawer Component
// ============================================================================

export function EvidenceDrawer({
  isOpen,
  onClose,
  entityType,
  entityId,
  title = 'Evidence',
}: EvidenceDrawerProps) {
  const [loading, setLoading] = useState(false);
  const [gateResults, setGateResults] = useState<GateResults | null>(null);
  const [confidence, setConfidence] = useState<ConfidenceScore | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && entityType && entityId) {
      fetchEvidence();
    }
  }, [isOpen, entityType, entityId]);

  const fetchEvidence = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/evidence/${encodeURIComponent(entityType)}/${encodeURIComponent(entityId)}`
      );
      const data = await response.json();

      if (data.error) {
        setError(data.error);
      } else {
        setGateResults(data.gate_results);
        setConfidence(data.confidence);
      }
    } catch (err) {
      setError('Failed to load evidence');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 animate-slide-up">
      <div className="max-w-4xl mx-auto">
        <Card className="rounded-b-none border-b-0 shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-[#C9A962]/20">
            <div className="flex items-center gap-3">
              <span className="text-lg">🔍</span>
              <h3 className="font-semibold text-[#C9A962]">{title}</h3>
              <Badge size="sm" variant="default">{entityType}</Badge>
            </div>
            <button
              onClick={onClose}
              className="p-1 text-[#F5F3EF]/50 hover:text-[#F5F3EF] transition"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="p-4 max-h-[50vh] overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <LoadingSpinner />
                <span className="ml-3 text-[#F5F3EF]/50">Loading evidence...</span>
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <p className="text-red-400">{error}</p>
              </div>
            ) : !gateResults && !confidence ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-4">📊</div>
                <p className="text-[#F5F3EF]/50">
                  Evidence not yet computed for this item.
                </p>
                <p className="text-xs text-[#F5F3EF]/30 mt-2">
                  Run the evidence pipeline to populate this data.
                </p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {/* Confidence section */}
                {confidence && (
                  <div>
                    <h4 className="text-sm font-semibold text-[#F5F3EF]/70 mb-3 uppercase tracking-wider">
                      Confidence Score
                    </h4>
                    <ConfidenceMeter
                      score={confidence.score}
                      tier={confidence.tier}
                      components={confidence.components}
                    />
                    <p className="text-xs text-[#F5F3EF]/40 mt-2">
                      Computed: {new Date(confidence.computed_at).toLocaleDateString()}
                      {' | '}
                      Pipeline: {confidence.pipeline_version}
                    </p>
                  </div>
                )}

                {/* Gates section */}
                {gateResults && (
                  <div>
                    <h4 className="text-sm font-semibold text-[#F5F3EF]/70 mb-3 uppercase tracking-wider">
                      Validation Gates
                    </h4>
                    <GateDetailsPanel gates={gateResults} />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-3 border-t border-[#C9A962]/20 bg-[#C9A962]/5">
            <span className="text-xs text-[#F5F3EF]/40">
              Entity: {entityId.substring(0, 50)}{entityId.length > 50 ? '...' : ''}
            </span>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={() => fetchEvidence()}>
                Refresh
              </Button>
              <Button variant="secondary" size="sm" onClick={onClose}>
                Close
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

// ============================================================================
// Intertext Evidence Drawer (Specialized for edges)
// ============================================================================

interface IntertextEvidenceDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  sourceUrn: string;
  targetUrn: string;
}

export function IntertextEvidenceDrawer({
  isOpen,
  onClose,
  sourceUrn,
  targetUrn,
}: IntertextEvidenceDrawerProps) {
  const [loading, setLoading] = useState(false);
  const [evidence, setEvidence] = useState<IntertextEvidence | null>(null);
  const [topSignals, setTopSignals] = useState<{ name: string; value: number; contribution: string }[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && sourceUrn && targetUrn) {
      fetchEvidence();
    }
  }, [isOpen, sourceUrn, targetUrn]);

  const fetchEvidence = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/intertexts/evidence?source=${encodeURIComponent(sourceUrn)}&target=${encodeURIComponent(targetUrn)}`
      );
      const data = await response.json();

      if (data.error) {
        setError(data.error);
      } else if (data.has_evidence) {
        setEvidence(data.evidence);
        setTopSignals(data.evidence.top_signals || []);
      }
    } catch (err) {
      setError('Failed to load evidence');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 animate-slide-up">
      <div className="max-w-4xl mx-auto">
        <Card className="rounded-b-none border-b-0 shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-[#C9A962]/20">
            <div className="flex items-center gap-3">
              <span className="text-lg">🔗</span>
              <h3 className="font-semibold text-[#C9A962]">Connection Evidence</h3>
            </div>
            <button onClick={onClose} className="p-1 text-[#F5F3EF]/50 hover:text-[#F5F3EF]">
              ×
            </button>
          </div>

          {/* Content */}
          <div className="p-4 max-h-[60vh] overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <LoadingSpinner />
              </div>
            ) : error ? (
              <p className="text-red-400 text-center py-8">{error}</p>
            ) : !evidence ? (
              <div className="text-center py-8">
                <p className="text-[#F5F3EF]/50">Evidence not yet computed for this connection.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Connection overview */}
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-[#C9A962]/5 rounded-lg">
                    <div className="text-2xl font-mono text-[#C9A962]">
                      {(evidence.confidence_score * 100).toFixed(0)}%
                    </div>
                    <div className="text-xs text-[#F5F3EF]/50">Confidence</div>
                  </div>
                  <div className="text-center p-3 bg-[#C9A962]/5 rounded-lg">
                    <div className="text-lg text-[#C9A962] capitalize">
                      {evidence.connection_type}
                    </div>
                    <div className="text-xs text-[#F5F3EF]/50">Type</div>
                  </div>
                  <div className="text-center p-3 bg-[#C9A962]/5 rounded-lg">
                    <div className="text-lg text-[#C9A962] capitalize">
                      {evidence.directionality?.replace(/_/g, ' ')}
                    </div>
                    <div className="text-xs text-[#F5F3EF]/50">Direction</div>
                  </div>
                </div>

                {/* Top signals */}
                {topSignals.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-[#F5F3EF]/70 mb-3">Top Contributing Signals</h4>
                    <div className="space-y-2">
                      {topSignals.map((signal) => (
                        <div key={signal.name} className="flex items-center gap-3">
                          <span className="text-sm text-[#F5F3EF]/60 w-32">{signal.name}</span>
                          <div className="flex-1 h-2 bg-[#C9A962]/10 rounded-full">
                            <div
                              className="h-full bg-[#C9A962] rounded-full"
                              style={{ width: `${signal.value * 100}%` }}
                            />
                          </div>
                          <span className="text-xs text-[#F5F3EF]/40 w-16 text-right">
                            {signal.contribution}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Matched phrases */}
                {evidence.matched_phrases?.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-[#F5F3EF]/70 mb-3">Matched Phrases</h4>
                    <div className="space-y-2">
                      {evidence.matched_phrases.map((phrase, i) => (
                        <div key={i} className="grid grid-cols-2 gap-4 p-2 bg-[#C9A962]/5 rounded">
                          <div className="text-sm font-serif text-[#F5F3EF]/80">{phrase.source}</div>
                          <div className="text-sm font-serif text-[#F5F3EF]/80">{phrase.target}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Shared rare words */}
                {evidence.shared_rare_words?.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-[#F5F3EF]/70 mb-3">Shared Rare Terms</h4>
                    <div className="flex flex-wrap gap-2">
                      {evidence.shared_rare_words.map((word) => (
                        <Badge key={word} variant="default" size="sm">
                          {word}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Confidence notes */}
                {evidence.confidence_notes && (
                  <div className="p-3 bg-[#C9A962]/5 rounded-lg border border-[#C9A962]/20">
                    <h4 className="text-sm font-semibold text-[#F5F3EF]/70 mb-2">Analysis Notes</h4>
                    <p className="text-sm text-[#F5F3EF]/60">{evidence.confidence_notes}</p>
                  </div>
                )}

                {/* Alternative explanations */}
                {evidence.alternative_explanations?.length > 0 && (
                  <div className="p-3 bg-red-900/10 rounded-lg border border-red-400/20">
                    <h4 className="text-sm font-semibold text-red-400 mb-2">Alternative Explanations</h4>
                    <ul className="text-sm text-[#F5F3EF]/60 list-disc list-inside space-y-1">
                      {evidence.alternative_explanations.map((exp, i) => (
                        <li key={i}>{exp}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

// ============================================================================
// Export convenience hook
// ============================================================================

export function useEvidenceDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [entityType, setEntityType] = useState('');
  const [entityId, setEntityId] = useState('');

  const open = (type: string, id: string) => {
    setEntityType(type);
    setEntityId(id);
    setIsOpen(true);
  };

  const close = () => {
    setIsOpen(false);
  };

  return {
    isOpen,
    entityType,
    entityId,
    open,
    close,
    DrawerComponent: () => (
      <EvidenceDrawer
        isOpen={isOpen}
        onClose={close}
        entityType={entityType}
        entityId={entityId}
      />
    ),
  };
}
