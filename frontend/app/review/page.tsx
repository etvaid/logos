'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, Button, Badge, Select, LoadingSpinner } from '@/components/ui';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs';

interface FlaggedIssue {
  id: string;
  urn: string;
  translator: string;
  style: string;
  sourceText: string;
  translatedText: string;
  flagReason: string;
  flagType: 'quality' | 'bias' | 'register' | 'semantic';
  severity: 'low' | 'medium' | 'high';
  scores: {
    overall: number;
    semanticFidelity: number;
    registerMatch: number;
    styleConsistency: number;
    translatorBias: number;
  };
  createdAt: string;
  status: 'pending' | 'approved' | 'rejected' | 'revised';
}

const MOCK_FLAGGED: FlaggedIssue[] = [
  {
    id: 'f1',
    urn: 'urn:cts:greekLit:tlg0012.tlg001:1.1-7',
    translator: 'Pope',
    style: 'formal_academic',
    sourceText: 'μῆνιν ἄειδε θεὰ Πηληϊάδεω Ἀχιλῆος',
    translatedText: "Achilles' wrath, to Greece the direful spring / Of woes unnumber'd, heavenly goddess, sing!",
    flagReason: 'High translator bias detected (35%) - significant deviation from source semantics',
    flagType: 'bias',
    severity: 'high',
    scores: { overall: 0.814, semanticFidelity: 0.78, registerMatch: 0.95, styleConsistency: 0.91, translatorBias: 0.35 },
    createdAt: '2024-01-15T10:30:00Z',
    status: 'pending',
  },
  {
    id: 'f2',
    urn: 'urn:cts:latinLit:phi0690.phi003:1.1-7',
    translator: 'Dryden',
    style: 'formal_academic',
    sourceText: 'Arma virumque cano, Troiae qui primus ab oris',
    translatedText: 'Arms, and the man I sing, who, forc\'d by fate, / And haughty Juno\'s unrelenting hate',
    flagReason: 'Meaning drift detected - semantic fidelity below threshold',
    flagType: 'semantic',
    severity: 'medium',
    scores: { overall: 0.828, semanticFidelity: 0.81, registerMatch: 0.94, styleConsistency: 0.92, translatorBias: 0.28 },
    createdAt: '2024-01-14T14:22:00Z',
    status: 'pending',
  },
  {
    id: 'f3',
    urn: 'urn:cts:greekLit:tlg0059.tlg030:428e',
    translator: 'AI: Scholarly',
    style: 'scholarly',
    sourceText: 'ἀλλ᾽ ὁ μὲν δίκαιος εὐδαίμων',
    translatedText: 'But the just person is happy',
    flagReason: 'Style consistency below threshold (0.65 < 0.70)',
    flagType: 'register',
    severity: 'medium',
    scores: { overall: 0.78, semanticFidelity: 0.82, registerMatch: 0.70, styleConsistency: 0.65, translatorBias: 0.35 },
    createdAt: '2024-01-13T09:15:00Z',
    status: 'pending',
  },
  {
    id: 'f4',
    urn: 'urn:cts:greekLit:tlg0085.tlg003:1-10',
    translator: 'AI: Conversational',
    style: 'conversational',
    sourceText: 'ἄνδρα μοι ἔννεπε, μοῦσα',
    translatedText: 'Tell me about that man, Muse',
    flagReason: 'Register mismatch: epic tone lost in conversational rendering',
    flagType: 'register',
    severity: 'high',
    scores: { overall: 0.65, semanticFidelity: 0.70, registerMatch: 0.55, styleConsistency: 0.58, translatorBias: 0.42 },
    createdAt: '2024-01-12T16:45:00Z',
    status: 'pending',
  },
  {
    id: 'f5',
    urn: 'urn:cts:greekLit:tlg0059.tlg011:201d',
    translator: 'AI: Poetic',
    style: 'poetic',
    sourceText: 'τὸ καλόν ἐστι χαλεπόν',
    translatedText: 'Beauty is difficult indeed',
    flagReason: 'Quality score below minimum threshold',
    flagType: 'quality',
    severity: 'low',
    scores: { overall: 0.72, semanticFidelity: 0.75, registerMatch: 0.68, styleConsistency: 0.71, translatorBias: 0.22 },
    createdAt: '2024-01-11T11:30:00Z',
    status: 'approved',
  },
];

const FLAG_TYPE_COLORS = {
  quality: 'warning',
  bias: 'error',
  register: 'default',
  semantic: 'error',
} as const;

const SEVERITY_COLORS = {
  low: 'text-yellow-400',
  medium: 'text-orange-400',
  high: 'text-red-400',
};

export default function ReviewQueuePage() {
  const [issues, setIssues] = useState<FlaggedIssue[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIssue, setSelectedIssue] = useState<FlaggedIssue | null>(null);
  const [filterType, setFilterType] = useState<string>('');
  const [filterSeverity, setFilterSeverity] = useState<string>('');
  const [activeTab, setActiveTab] = useState('pending');

  useEffect(() => {
    // Simulate API fetch
    const fetchData = async () => {
      setLoading(true);
      try {
        // In production, this would fetch from /api/review/flagged
        await new Promise((r) => setTimeout(r, 500));
        setIssues(MOCK_FLAGGED);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredIssues = issues.filter((issue) => {
    if (activeTab === 'pending' && issue.status !== 'pending') return false;
    if (activeTab === 'resolved' && issue.status === 'pending') return false;
    if (filterType && issue.flagType !== filterType) return false;
    if (filterSeverity && issue.severity !== filterSeverity) return false;
    return true;
  });

  const handleAction = (issueId: string, action: 'approve' | 'reject' | 'revise') => {
    setIssues((prev) =>
      prev.map((issue) =>
        issue.id === issueId
          ? { ...issue, status: action === 'approve' ? 'approved' : action === 'reject' ? 'rejected' : 'revised' }
          : issue
      )
    );
    setSelectedIssue(null);
  };

  const pendingCount = issues.filter((i) => i.status === 'pending').length;
  const highSeverityCount = issues.filter((i) => i.status === 'pending' && i.severity === 'high').length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-[#F5F3EF]/50">Loading review queue...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-b from-red-500/10 to-transparent py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold mb-2">
                <span className="text-red-400">Review</span> Queue
              </h1>
              <p className="text-[#F5F3EF]/70">
                Flagged translations requiring human review
              </p>
            </div>
            <div className="flex gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-[#C9A962]">{pendingCount}</div>
                <div className="text-xs text-[#F5F3EF]/50">Pending</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-400">{highSeverityCount}</div>
                <div className="text-xs text-[#F5F3EF]/50">High Severity</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">
                  {issues.filter((i) => i.status === 'approved').length}
                </div>
                <div className="text-xs text-[#F5F3EF]/50">Resolved</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs & Filters */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <Tabs defaultValue="pending" onValueChange={(value) => setActiveTab(value as 'pending' | 'resolved')}>
            <TabsList>
              <TabsTrigger value="pending">
                Pending ({pendingCount})
              </TabsTrigger>
              <TabsTrigger value="resolved">
                Resolved ({issues.length - pendingCount})
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex gap-3">
            <Select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              options={[
                { value: '', label: 'All Types' },
                { value: 'quality', label: 'Quality' },
                { value: 'bias', label: 'Bias' },
                { value: 'register', label: 'Register' },
                { value: 'semantic', label: 'Semantic' },
              ]}
              className="w-36"
            />
            <Select
              value={filterSeverity}
              onChange={(e) => setFilterSeverity(e.target.value)}
              options={[
                { value: '', label: 'All Severity' },
                { value: 'high', label: 'High' },
                { value: 'medium', label: 'Medium' },
                { value: 'low', label: 'Low' },
              ]}
              className="w-36"
            />
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Issue List */}
          <div className="lg:col-span-2 space-y-4">
            {filteredIssues.length === 0 ? (
              <Card padding="lg" className="text-center">
                <div className="text-4xl mb-4">✓</div>
                <h3 className="text-lg font-semibold text-[#C9A962] mb-2">All Clear!</h3>
                <p className="text-[#F5F3EF]/60">No flagged issues match your filters.</p>
              </Card>
            ) : (
              filteredIssues.map((issue) => (
                <Card
                  key={issue.id}
                  padding="md"
                  variant="interactive"
                  className={`cursor-pointer ${selectedIssue?.id === issue.id ? 'ring-2 ring-[#C9A962]' : ''} ${
                    issue.status !== 'pending' ? 'opacity-60' : ''
                  }`}
                  onClick={() => setSelectedIssue(issue)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Badge variant={FLAG_TYPE_COLORS[issue.flagType]} size="sm">
                        {issue.flagType}
                      </Badge>
                      <span className={`text-xs font-medium uppercase ${SEVERITY_COLORS[issue.severity]}`}>
                        {issue.severity}
                      </span>
                      {issue.status !== 'pending' && (
                        <Badge
                          variant={issue.status === 'approved' ? 'success' : issue.status === 'rejected' ? 'error' : 'warning'}
                          size="sm"
                        >
                          {issue.status}
                        </Badge>
                      )}
                    </div>
                    <span className="text-xs text-[#F5F3EF]/40">
                      {new Date(issue.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="mb-3">
                    <div className="text-sm font-medium text-[#C9A962] mb-1">{issue.translator}</div>
                    <div className="text-xs text-[#F5F3EF]/50">{issue.urn.split(':').pop()}</div>
                  </div>

                  <p className="text-sm text-[#F5F3EF]/70 mb-3">{issue.flagReason}</p>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-[#F5F3EF]/50">Overall:</span>
                      <span className={`text-sm font-medium ${issue.scores.overall >= 0.7 ? 'text-[#C9A962]' : 'text-red-400'}`}>
                        {(issue.scores.overall * 100).toFixed(0)}%
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-[#F5F3EF]/50">Bias:</span>
                      <span className={`text-sm font-medium ${issue.scores.translatorBias < 0.2 ? 'text-green-400' : 'text-red-400'}`}>
                        {(issue.scores.translatorBias * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>

          {/* Detail Panel */}
          <div className="space-y-6">
            {selectedIssue ? (
              <>
                <Card padding="lg">
                  <h3 className="text-sm font-semibold text-[#C9A962] mb-4">Issue Details</h3>

                  <div className="space-y-4">
                    <div>
                      <div className="text-xs text-[#F5F3EF]/50 mb-1">Source Text</div>
                      <p className="text-sm font-serif text-[#F5F3EF]/80 p-2 bg-[#C9A962]/5 rounded">
                        {selectedIssue.sourceText}
                      </p>
                    </div>

                    <div>
                      <div className="text-xs text-[#F5F3EF]/50 mb-1">Translation</div>
                      <p className="text-sm font-serif text-[#F5F3EF]/80 p-2 bg-[#C9A962]/5 rounded">
                        {selectedIssue.translatedText}
                      </p>
                    </div>

                    <div>
                      <div className="text-xs text-[#F5F3EF]/50 mb-1">Flag Reason</div>
                      <p className="text-sm text-red-400 p-2 bg-red-900/10 rounded border border-red-400/20">
                        {selectedIssue.flagReason}
                      </p>
                    </div>
                  </div>
                </Card>

                <Card padding="lg">
                  <h3 className="text-sm font-semibold text-[#C9A962] mb-4">Quality Scores</h3>
                  <div className="space-y-3">
                    {Object.entries(selectedIssue.scores).map(([key, value]) => (
                      <div key={key} className="flex items-center gap-2">
                        <span className="text-xs text-[#F5F3EF]/50 w-28 truncate">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                        <div className="flex-1 h-1.5 bg-[#C9A962]/10 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              key === 'translatorBias'
                                ? value < 0.2 ? 'bg-green-400' : 'bg-red-400'
                                : value >= 0.7 ? 'bg-[#C9A962]' : 'bg-orange-400'
                            }`}
                            style={{ width: `${value * 100}%` }}
                          />
                        </div>
                        <span className="text-xs font-mono w-10 text-right">{(value * 100).toFixed(0)}%</span>
                      </div>
                    ))}
                  </div>
                </Card>

                {selectedIssue.status === 'pending' && (
                  <Card padding="lg">
                    <h3 className="text-sm font-semibold text-[#C9A962] mb-4">Actions</h3>
                    <div className="space-y-2">
                      <Button
                        variant="primary"
                        className="w-full"
                        onClick={() => handleAction(selectedIssue.id, 'approve')}
                      >
                        Approve Translation
                      </Button>
                      <Button
                        variant="secondary"
                        className="w-full"
                        onClick={() => handleAction(selectedIssue.id, 'revise')}
                      >
                        Request Revision
                      </Button>
                      <Button
                        variant="danger"
                        className="w-full"
                        onClick={() => handleAction(selectedIssue.id, 'reject')}
                      >
                        Reject Translation
                      </Button>
                    </div>
                  </Card>
                )}

                <Link href={`/passage/${encodeURIComponent(selectedIssue.urn)}`}>
                  <Button variant="ghost" className="w-full">
                    View Full Passage
                  </Button>
                </Link>
              </>
            ) : (
              <Card padding="lg" className="text-center">
                <div className="text-4xl mb-4 opacity-50">←</div>
                <h3 className="text-sm font-semibold text-[#C9A962] mb-2">Select an Issue</h3>
                <p className="text-xs text-[#F5F3EF]/50">
                  Click on a flagged translation to view details and take action.
                </p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
