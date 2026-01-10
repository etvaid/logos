'use client';

import { useState, useEffect } from 'react';
import { Card, Button, Badge, LoadingSpinner, Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui';
import { RadarChart, BarChart, LineChart, DonutChart } from '@/components/charts';

// Gate definitions
const GATES = [
  {
    id: 1,
    name: 'Style Separability',
    description: 'Can we distinguish authors using style residuals alone?',
    metric: 'Macro-F1 (GroupKFold)',
    threshold: 0.80,
    icon: '🎯',
    color: '#87CEEB',
  },
  {
    id: 2,
    name: 'Stability Across Windows',
    description: 'Do style signatures remain stable across different window sizes?',
    metric: 'ICC (500/1000/2000 tokens)',
    threshold: 0.75,
    icon: '📐',
    color: '#98D8C8',
  },
  {
    id: 3,
    name: 'Cross-Era Separation',
    description: 'Can we separate authors across different time periods?',
    metric: 'Min Accuracy (Easy/Medium/Hard)',
    threshold: 0.70,
    icon: '🏛️',
    color: '#DDA0DD',
  },
  {
    id: 4,
    name: 'External Validity',
    description: 'Do results match known scholarly attributions?',
    metric: 'Expected Calibration Error',
    threshold: 0.10,
    icon: '✓',
    color: '#F7DC6F',
  },
];

// Sample calibration data
const SAMPLE_LATEST_RUN = {
  run_id: 'cal-2025-001',
  timestamp: '2025-12-30T14:23:45Z',
  gates_passed: 4,
  total_gates: 4,
  runtime_seconds: 342.5,
  gates: [
    {
      gate: 1,
      passed: true,
      score: 0.847,
      threshold: 0.80,
      details: {
        accuracy: 0.823,
        precision: 0.851,
        recall: 0.834,
        f1_score: 0.847,
        authors_tested: 24,
        samples_per_author: 50,
        folds: 5,
      },
    },
    {
      gate: 2,
      passed: true,
      score: 0.812,
      threshold: 0.75,
      details: {
        icc_500: 0.789,
        icc_1000: 0.834,
        icc_2000: 0.812,
        authors_tested: 24,
        windows_per_author: 20,
      },
    },
    {
      gate: 3,
      passed: true,
      score: 0.756,
      threshold: 0.70,
      details: {
        easy_accuracy: 0.912,
        medium_accuracy: 0.834,
        hard_accuracy: 0.756,
        era_pairs_tested: 6,
      },
    },
    {
      gate: 4,
      passed: true,
      score: 0.067,
      threshold: 0.10,
      details: {
        ece: 0.067,
        external_matches: 47,
        total_tested: 50,
        match_rate: 0.94,
      },
    },
  ],
};

// Historical calibration data
const SAMPLE_HISTORY = [
  { date: '2025-12-30', gates_passed: 4, gate1: 0.847, gate2: 0.812, gate3: 0.756, gate4: 0.067 },
  { date: '2025-12-25', gates_passed: 4, gate1: 0.823, gate2: 0.798, gate3: 0.742, gate4: 0.078 },
  { date: '2025-12-20', gates_passed: 3, gate1: 0.812, gate2: 0.781, gate3: 0.689, gate4: 0.089 },
  { date: '2025-12-15', gates_passed: 3, gate1: 0.798, gate2: 0.756, gate3: 0.678, gate4: 0.095 },
  { date: '2025-12-10', gates_passed: 3, gate1: 0.789, gate2: 0.742, gate3: 0.712, gate4: 0.112 },
  { date: '2025-12-05', gates_passed: 2, gate1: 0.756, gate2: 0.723, gate3: 0.656, gate4: 0.134 },
];

// Feature importance data
const featureImportanceData = [
  { name: 'Particle Freq', value: 0.156, color: '#87CEEB' },
  { name: 'Sentence Len', value: 0.134, color: '#98D8C8' },
  { name: 'Clause Depth', value: 0.112, color: '#DDA0DD' },
  { name: 'TTR', value: 0.098, color: '#F7DC6F' },
  { name: 'Hapax Ratio', value: 0.087, color: '#F1948A' },
  { name: 'Verb Density', value: 0.076, color: '#BB8FCE' },
  { name: 'Coordination', value: 0.065, color: '#85C1E9' },
  { name: 'Subordination', value: 0.054, color: '#82E0AA' },
];

// Confusion matrix author labels
const confusionAuthors = ['Homer', 'Plato', 'Aristotle', 'Herodotus', 'Thucydides'];

export default function CalibrationPage() {
  const [loading, setLoading] = useState(false);
  const [running, setRunning] = useState(false);
  const [latestRun, setLatestRun] = useState(SAMPLE_LATEST_RUN);
  const [history, setHistory] = useState(SAMPLE_HISTORY);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedGate, setSelectedGate] = useState<number | null>(null);

  const runCalibration = async () => {
    setRunning(true);
    // Simulate calibration run
    await new Promise((resolve) => setTimeout(resolve, 3000));
    setRunning(false);
  };

  const allGatesPassed = latestRun.gates.every((g) => g.passed);
  const passedCount = latestRun.gates.filter((g) => g.passed).length;

  // Prepare line chart data for history
  const historyLineData = history.map((h) => ({
    name: h.date.slice(5), // MM-DD format
    'Gate 1': h.gate1,
    'Gate 2': h.gate2,
    'Gate 3': h.gate3,
    'Gate 4 (inv)': 1 - h.gate4, // Invert ECE so higher is better
  }));

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-b from-[#C9A962]/10 to-transparent py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">
                <span className="text-[#C9A962]">CALIBRATION</span> Dashboard
              </h1>
              <p className="text-[#F5F3EF]/70">
                4-gate validation ensuring scientific rigor in stylometric analysis
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className={`px-4 py-2 rounded-lg ${allGatesPassed ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                {allGatesPassed ? 'All Gates Passed' : `${passedCount}/4 Gates Passed`}
              </div>
              <Button onClick={runCalibration} loading={running} size="lg">
                {running ? 'Running...' : 'Run Calibration'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="flex gap-2 mb-8 border-b border-[#C9A962]/20 pb-4">
          {['overview', 'gates', 'history', 'features'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-t-lg text-sm font-medium transition ${
                activeTab === tab
                  ? 'bg-[#C9A962] text-[#0D0D0F]'
                  : 'bg-[#C9A962]/10 hover:bg-[#C9A962]/20'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Gate Summary Cards */}
            <div className="grid md:grid-cols-4 gap-4">
              {GATES.map((gate) => {
                const result = latestRun.gates.find((g) => g.gate === gate.id);
                const passed = result?.passed ?? false;
                const score = result?.score ?? 0;
                const isLowerBetter = gate.id === 4;
                const displayScore = isLowerBetter ? score : score;
                const progressPercent = isLowerBetter
                  ? Math.max(0, (1 - score / gate.threshold) * 100)
                  : (score / gate.threshold) * 100;

                return (
                  <Card
                    key={gate.id}
                    padding="lg"
                    className={`cursor-pointer transition-all hover:scale-[1.02] ${
                      passed ? 'border-green-500/30' : 'border-red-500/30'
                    }`}
                    onClick={() => setSelectedGate(gate.id)}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <span className="text-3xl">{gate.icon}</span>
                      <Badge variant={passed ? 'success' : 'error'}>
                        {passed ? 'PASS' : 'FAIL'}
                      </Badge>
                    </div>
                    <h3 className="font-semibold text-[#C9A962] mb-1">
                      Gate {gate.id}: {gate.name}
                    </h3>
                    <p className="text-xs text-[#F5F3EF]/50 mb-4">{gate.description}</p>

                    {/* Score display */}
                    <div className="mb-2">
                      <div className="flex justify-between text-sm mb-1">
                        <span>{gate.metric}</span>
                        <span className={passed ? 'text-green-400' : 'text-red-400'}>
                          {isLowerBetter ? displayScore.toFixed(3) : (displayScore * 100).toFixed(1) + '%'}
                        </span>
                      </div>
                      <div className="h-2 bg-[#0D0D0F] rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${passed ? 'bg-green-500' : 'bg-red-500'}`}
                          style={{ width: `${Math.min(progressPercent, 100)}%` }}
                        />
                      </div>
                      <div className="text-xs text-[#F5F3EF]/40 mt-1">
                        Threshold: {isLowerBetter ? '<' : '>'} {gate.threshold}
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>

            {/* Latest Run Details */}
            <Card padding="lg">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-[#C9A962]">Latest Calibration Run</h2>
                <div className="text-sm text-[#F5F3EF]/50">
                  {new Date(latestRun.timestamp).toLocaleString()} • {latestRun.runtime_seconds.toFixed(1)}s
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {/* Radar chart of gate scores */}
                <div>
                  <h3 className="font-medium text-[#F5F3EF]/80 mb-4">Gate Performance</h3>
                  <div className="h-64">
                    <RadarChart
                      data={[
                        { subject: 'Separability', value: latestRun.gates[0].score },
                        { subject: 'Stability', value: latestRun.gates[1].score },
                        { subject: 'Cross-Era', value: latestRun.gates[2].score },
                        { subject: 'External (inv)', value: 1 - latestRun.gates[3].score },
                      ]}
                      name="Score"
                    />
                  </div>
                </div>

                {/* Summary stats */}
                <div>
                  <h3 className="font-medium text-[#F5F3EF]/80 mb-4">Validation Summary</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-[#C9A962]/5 rounded-lg">
                      <span>Authors Tested</span>
                      <span className="font-mono text-[#87CEEB]">{latestRun.gates[0].details.authors_tested}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-[#C9A962]/5 rounded-lg">
                      <span>Samples per Author</span>
                      <span className="font-mono text-[#87CEEB]">{latestRun.gates[0].details.samples_per_author}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-[#C9A962]/5 rounded-lg">
                      <span>Cross-Validation Folds</span>
                      <span className="font-mono text-[#87CEEB]">{latestRun.gates[0].details.folds}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-[#C9A962]/5 rounded-lg">
                      <span>External Validation Rate</span>
                      <span className="font-mono text-[#87CEEB]">{((latestRun.gates[3]?.details?.match_rate ?? 0) * 100).toFixed(0)}%</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-[#C9A962]/5 rounded-lg">
                      <span>Overall Status</span>
                      <Badge variant={allGatesPassed ? 'success' : 'warning'} size="lg">
                        {allGatesPassed ? 'CALIBRATED' : 'NEEDS ATTENTION'}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Quick Actions */}
            <div className="grid md:grid-cols-3 gap-4">
              <Card variant="hover" padding="lg" className="cursor-pointer" onClick={() => setActiveTab('gates')}>
                <h3 className="font-semibold text-[#C9A962] mb-2">View Gate Details</h3>
                <p className="text-sm text-[#F5F3EF]/60">
                  Examine detailed metrics for each calibration gate
                </p>
              </Card>
              <Card variant="hover" padding="lg" className="cursor-pointer" onClick={() => setActiveTab('history')}>
                <h3 className="font-semibold text-[#C9A962] mb-2">Calibration History</h3>
                <p className="text-sm text-[#F5F3EF]/60">
                  Track calibration performance over time
                </p>
              </Card>
              <Card variant="hover" padding="lg" className="cursor-pointer" onClick={() => setActiveTab('features')}>
                <h3 className="font-semibold text-[#C9A962] mb-2">Feature Analysis</h3>
                <p className="text-sm text-[#F5F3EF]/60">
                  Understand which features drive separability
                </p>
              </Card>
            </div>
          </div>
        )}

        {/* Gates Tab */}
        {activeTab === 'gates' && (
          <div className="space-y-6">
            {GATES.map((gate) => {
              const result = latestRun.gates.find((g) => g.gate === gate.id);
              if (!result) return null;
              const isLowerBetter = gate.id === 4;

              return (
                <Card key={gate.id} padding="lg">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <span className="text-4xl">{gate.icon}</span>
                      <div>
                        <h2 className="text-xl font-semibold text-[#C9A962]">
                          Gate {gate.id}: {gate.name}
                        </h2>
                        <p className="text-[#F5F3EF]/60">{gate.description}</p>
                      </div>
                    </div>
                    <Badge variant={result.passed ? 'success' : 'error'} size="lg">
                      {result.passed ? 'PASSED' : 'FAILED'}
                    </Badge>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    {/* Score visualization */}
                    <div>
                      <h3 className="font-medium text-[#F5F3EF]/80 mb-4">Score: {
                        isLowerBetter
                          ? result.score.toFixed(3)
                          : (result.score * 100).toFixed(1) + '%'
                      }</h3>
                      <div className="space-y-3">
                        <div className="h-4 bg-[#0D0D0F] rounded-full overflow-hidden relative">
                          {/* Threshold marker */}
                          <div
                            className="absolute top-0 bottom-0 w-0.5 bg-yellow-500 z-10"
                            style={{
                              left: isLowerBetter
                                ? `${result.threshold * 100 * 5}%`  // Scale for ECE
                                : `${result.threshold * 100}%`
                            }}
                          />
                          <div
                            className={`h-full rounded-full transition-all ${result.passed ? 'bg-green-500' : 'bg-red-500'}`}
                            style={{
                              width: isLowerBetter
                                ? `${result.score * 100 * 5}%`  // Scale for ECE
                                : `${result.score * 100}%`
                            }}
                          />
                        </div>
                        <div className="flex justify-between text-xs text-[#F5F3EF]/40">
                          <span>0</span>
                          <span className="text-yellow-500">
                            Threshold: {isLowerBetter ? result.threshold : (result.threshold * 100) + '%'}
                          </span>
                          <span>{isLowerBetter ? '0.2' : '100%'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Details */}
                    <div>
                      <h3 className="font-medium text-[#F5F3EF]/80 mb-4">Details</h3>
                      <div className="grid grid-cols-2 gap-2">
                        {Object.entries(result.details).map(([key, value]) => (
                          <div key={key} className="flex justify-between p-2 bg-[#C9A962]/5 rounded">
                            <span className="text-sm text-[#F5F3EF]/60">
                              {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </span>
                            <span className="text-sm font-mono text-[#87CEEB]">
                              {typeof value === 'number' && value < 1 && value > 0
                                ? value.toFixed(3)
                                : value}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Gate-specific information */}
                  <div className="mt-6 pt-6 border-t border-[#C9A962]/20">
                    {gate.id === 1 && (
                      <div className="text-sm text-[#F5F3EF]/60">
                        <strong className="text-[#C9A962]">Methodology:</strong> Uses GroupKFold cross-validation
                        grouped by meaning_anchor_id to prevent data leakage. Trains LogisticRegression classifier
                        on style residual vectors to predict author identity.
                      </div>
                    )}
                    {gate.id === 2 && (
                      <div className="text-sm text-[#F5F3EF]/60">
                        <strong className="text-[#C9A962]">Methodology:</strong> Computes Intraclass Correlation Coefficient (ICC)
                        across windows of 500, 1000, and 2000 tokens to ensure style signatures remain stable
                        regardless of sample size.
                      </div>
                    )}
                    {gate.id === 3 && (
                      <div className="text-sm text-[#F5F3EF]/60">
                        <strong className="text-[#C9A962]">Methodology:</strong> Tests author attribution across time periods:
                        Easy (same era), Medium (adjacent eras), Hard (distant eras like Homer vs. Late Antiquity).
                        Must maintain accuracy across all difficulty levels.
                      </div>
                    )}
                    {gate.id === 4 && (
                      <div className="text-sm text-[#F5F3EF]/60">
                        <strong className="text-[#C9A962]">Methodology:</strong> Validates against scholarly consensus on
                        disputed attributions. Computes Expected Calibration Error (ECE) to ensure confidence scores
                        match actual accuracy rates.
                      </div>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <div className="space-y-8">
            {/* Trend Chart */}
            <Card padding="lg">
              <h2 className="text-xl font-semibold text-[#C9A962] mb-6">Calibration Trend</h2>
              <div className="h-80">
                <LineChart
                  data={historyLineData}
                  lines={[
                    { dataKey: 'Gate 1', name: 'Separability', color: '#87CEEB' },
                    { dataKey: 'Gate 2', name: 'Stability', color: '#98D8C8' },
                    { dataKey: 'Gate 3', name: 'Cross-Era', color: '#DDA0DD' },
                    { dataKey: 'Gate 4 (inv)', name: 'External (inverted)', color: '#F7DC6F' },
                  ]}
                />
              </div>
              <p className="text-sm text-[#F5F3EF]/50 mt-4">
                Note: Gate 4 (ECE) is inverted so that higher = better for visual consistency
              </p>
            </Card>

            {/* History Table */}
            <Card padding="lg">
              <h2 className="text-xl font-semibold text-[#C9A962] mb-6">Run History</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#C9A962]/20">
                      <th className="text-left py-3 px-4 text-[#F5F3EF]/60">Date</th>
                      <th className="text-center py-3 px-4 text-[#F5F3EF]/60">Status</th>
                      <th className="text-right py-3 px-4 text-[#F5F3EF]/60">Gate 1</th>
                      <th className="text-right py-3 px-4 text-[#F5F3EF]/60">Gate 2</th>
                      <th className="text-right py-3 px-4 text-[#F5F3EF]/60">Gate 3</th>
                      <th className="text-right py-3 px-4 text-[#F5F3EF]/60">Gate 4</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((run, i) => (
                      <tr key={i} className="border-b border-[#C9A962]/10 hover:bg-[#C9A962]/5">
                        <td className="py-3 px-4">{run.date}</td>
                        <td className="py-3 px-4 text-center">
                          <Badge variant={run.gates_passed === 4 ? 'success' : 'warning'}>
                            {run.gates_passed}/4
                          </Badge>
                        </td>
                        <td className={`py-3 px-4 text-right font-mono ${run.gate1 >= 0.80 ? 'text-green-400' : 'text-red-400'}`}>
                          {(run.gate1 * 100).toFixed(1)}%
                        </td>
                        <td className={`py-3 px-4 text-right font-mono ${run.gate2 >= 0.75 ? 'text-green-400' : 'text-red-400'}`}>
                          {(run.gate2 * 100).toFixed(1)}%
                        </td>
                        <td className={`py-3 px-4 text-right font-mono ${run.gate3 >= 0.70 ? 'text-green-400' : 'text-red-400'}`}>
                          {(run.gate3 * 100).toFixed(1)}%
                        </td>
                        <td className={`py-3 px-4 text-right font-mono ${run.gate4 <= 0.10 ? 'text-green-400' : 'text-red-400'}`}>
                          {run.gate4.toFixed(3)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

            {/* Improvement insights */}
            <Card padding="lg">
              <h2 className="text-xl font-semibold text-[#C9A962] mb-4">Improvement Insights</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                  <h3 className="font-medium text-green-400 mb-2">Improvements</h3>
                  <ul className="space-y-1 text-sm text-[#F5F3EF]/70">
                    <li>• Gate 1 improved by +9.1% over 25 days</li>
                    <li>• Gate 2 improved by +8.9% over 25 days</li>
                    <li>• Gate 4 (ECE) reduced by 50% since start</li>
                  </ul>
                </div>
                <div className="p-4 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                  <h3 className="font-medium text-yellow-400 mb-2">Recommendations</h3>
                  <ul className="space-y-1 text-sm text-[#F5F3EF]/70">
                    <li>• Gate 3 close to threshold - add more distant era pairs</li>
                    <li>• Consider increasing training samples for rare authors</li>
                    <li>• Review hard cross-era cases for feature engineering</li>
                  </ul>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Features Tab */}
        {activeTab === 'features' && (
          <div className="space-y-8">
            {/* Feature Importance */}
            <Card padding="lg">
              <h2 className="text-xl font-semibold text-[#C9A962] mb-6">Feature Importance</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-medium text-[#F5F3EF]/80 mb-4">Top Contributing Features</h3>
                  <div className="h-80">
                    <BarChart data={featureImportanceData} horizontal maxBars={8} />
                  </div>
                </div>
                <div>
                  <h3 className="font-medium text-[#F5F3EF]/80 mb-4">Feature Distribution</h3>
                  <DonutChart
                    data={featureImportanceData}
                    showLegend
                    centerText="50+"
                    centerSubtext="features"
                  />
                </div>
              </div>
            </Card>

            {/* Feature Categories */}
            <div className="grid md:grid-cols-3 gap-6">
              <Card padding="lg">
                <h3 className="font-semibold text-[#87CEEB] mb-4">Lexical Features</h3>
                <ul className="space-y-2 text-sm">
                  {[
                    'Type-Token Ratio (TTR)',
                    'Hapax Legomena Ratio',
                    'Vocabulary Richness',
                    'Word Length Distribution',
                    'Function Word Frequencies',
                    'Content Word Density',
                  ].map((f) => (
                    <li key={f} className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#87CEEB]" />
                      <span className="text-[#F5F3EF]/70">{f}</span>
                    </li>
                  ))}
                </ul>
              </Card>
              <Card padding="lg">
                <h3 className="font-semibold text-[#98D8C8] mb-4">Syntactic Features</h3>
                <ul className="space-y-2 text-sm">
                  {[
                    'Average Sentence Length',
                    'Subordination Depth',
                    'Clause Complexity',
                    'Coordination Patterns',
                    'Particle Placement',
                    'Case Distribution',
                  ].map((f) => (
                    <li key={f} className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#98D8C8]" />
                      <span className="text-[#F5F3EF]/70">{f}</span>
                    </li>
                  ))}
                </ul>
              </Card>
              <Card padding="lg">
                <h3 className="font-semibold text-[#DDA0DD] mb-4">Stylistic Features</h3>
                <ul className="space-y-2 text-sm">
                  {[
                    'Formulaic Expression Rate',
                    'Epithet Frequency',
                    'Enjambment Pattern',
                    'Hiatus Avoidance',
                    'Rhythm Regularity',
                    'Rhetorical Figure Density',
                  ].map((f) => (
                    <li key={f} className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#DDA0DD]" />
                      <span className="text-[#F5F3EF]/70">{f}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </div>

            {/* Feature Correlation */}
            <Card padding="lg">
              <h2 className="text-xl font-semibold text-[#C9A962] mb-4">Feature Analysis</h2>
              <p className="text-[#F5F3EF]/60 mb-6">
                Style residual vectors are computed by subtracting meaning anchors from translation embeddings,
                isolating pure stylistic signals. The calibration process validates that these residuals capture
                genuine authorial fingerprints rather than content-based or temporal artifacts.
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-[#C9A962]/5 rounded-lg">
                  <h4 className="font-medium text-[#C9A962] mb-2">Meaning Anchor Computation</h4>
                  <p className="text-sm text-[#F5F3EF]/60">
                    Anchors are computed using optimal transport barycenter across all translations
                    of the same source passage, ensuring robust semantic representation.
                  </p>
                </div>
                <div className="p-4 bg-[#C9A962]/5 rounded-lg">
                  <h4 className="font-medium text-[#C9A962] mb-2">Residual Extraction</h4>
                  <p className="text-sm text-[#F5F3EF]/60">
                    Style residuals isolate the translator's unique voice by removing shared
                    semantic content, enabling pure stylistic comparison.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Footer info */}
        <div className="mt-12 text-center text-sm text-[#F5F3EF]/40">
          <p>Calibration methodology based on the Style Residual framework with GroupKFold validation</p>
          <p className="mt-1">
            All gates must pass before stylometric analyses are considered scientifically valid
          </p>
        </div>
      </div>
    </div>
  );
}
