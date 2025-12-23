'use client';
import React, { useState } from 'react';

const API_URL = 'https://logos-production-ef2b.up.railway.app';

interface VerifyResult {
  claim: string;
  corroboration_score: number;
  confidence: string;
  verdict: 'LIKELY TRUE' | 'UNCERTAIN' | 'LIKELY EMBELLISHED';
  confirming_sources: { author: string; work: string; quote: string; reliability: number }[];
  contradicting_sources: { author: string; work: string; quote: string; issue: string }[];
  timeline_valid: boolean;
  author_bias: { author: string; position: string; predicted_distortion: string };
  fact_vs_embellishment: number;
}

const DEMO_CLAIMS: Record<string, VerifyResult> = {
  'caesar rubicon': {
    claim: 'Caesar crossed the Rubicon on January 10, 49 BCE',
    corroboration_score: 85,
    confidence: 'HIGH',
    verdict: 'LIKELY TRUE',
    confirming_sources: [
      { author: 'Suetonius', work: 'Divus Iulius 31-33', quote: 'Crossing with his legions, he came to the river Rubicon...', reliability: 0.75 },
      { author: 'Plutarch', work: 'Caesar 32', quote: 'Caesar deliberated long... then crossed the river...', reliability: 0.80 },
      { author: 'Appian', work: 'Civil Wars 2.35', quote: 'He ordered his army to cross the Rubicon...', reliability: 0.70 },
      { author: 'Cassius Dio', work: '41.4', quote: 'Caesar crossed the boundary river of Italy...', reliability: 0.65 },
    ],
    contradicting_sources: [],
    timeline_valid: true,
    author_bias: {
      author: 'All sources',
      position: 'Writing after Caesar\'s deification',
      predicted_distortion: 'Likely dramatized the moment; "alea iacta est" quote may be literary embellishment'
    },
    fact_vs_embellishment: 85,
  },
  'constantine cross': {
    claim: 'Constantine saw a cross in the sky before the Battle of Milvian Bridge',
    corroboration_score: 45,
    confidence: 'LOW-MEDIUM',
    verdict: 'UNCERTAIN',
    confirming_sources: [
      { author: 'Eusebius', work: 'Vita Constantini 1.28-29', quote: 'A most incredible sign appeared... a cross of light in the heavens...', reliability: 0.50 },
      { author: 'Lactantius', work: 'De Mortibus Persecutorum 44', quote: 'Constantine was directed in a dream to mark the shields...', reliability: 0.55 },
    ],
    contradicting_sources: [
      { author: 'Zosimus', work: 'Historia Nova 2.29', quote: '(Does not mention vision)', issue: 'Hostile pagan source omits entirely' },
      { author: 'Eusebius vs Lactantius', work: 'Comparison', quote: 'Details conflict significantly', issue: 'Eusebius: daytime vision; Lactantius: nighttime dream' },
    ],
    timeline_valid: true,
    author_bias: {
      author: 'Eusebius',
      position: 'Court bishop, Christian apologist',
      predicted_distortion: 'HIGH incentive to dramatize Constantine\'s Christian credentials'
    },
    fact_vs_embellishment: 35,
  },
  'nero fire': {
    claim: 'Nero played the lyre while Rome burned',
    corroboration_score: 25,
    confidence: 'LOW',
    verdict: 'LIKELY EMBELLISHED',
    confirming_sources: [
      { author: 'Tacitus', work: 'Annals 15.39', quote: 'A rumor had spread that while the city was burning, Nero had gone on his private stage...', reliability: 0.85 },
    ],
    contradicting_sources: [
      { author: 'Tacitus', work: 'Annals 15.38-39', quote: 'Nero was at Antium when the fire broke out... hurried back to Rome...', issue: 'Tacitus himself notes Nero was away and returned to help' },
      { author: 'Suetonius', work: 'Nero 38', quote: 'From his tower he watched... and sang about the sack of Troy', issue: 'Different account; may be hostile embellishment' },
    ],
    timeline_valid: false,
    author_bias: {
      author: 'Tacitus & Suetonius',
      position: 'Both writing under Flavians who replaced Nero\'s dynasty',
      predicted_distortion: 'VERY HIGH incentive to vilify Nero; this story serves political purpose'
    },
    fact_vs_embellishment: 15,
  },
};

export default function VerifyPage() {
  const [dark, setDark] = useState(true);
  const [claim, setClaim] = useState('');
  const [result, setResult] = useState<VerifyResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleVerify = async () => {
    if (!claim.trim()) return;
    setLoading(true);
    setSearched(true);

    const key = Object.keys(DEMO_CLAIMS).find(k => claim.toLowerCase().includes(k));
    if (key) {
      await new Promise(r => setTimeout(r, 800));
      setResult(DEMO_CLAIMS[key]);
    } else {
      try {
        const res = await fetch(`${API_URL}/api/verify/claim`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ claim }),
        });
        if (res.ok) setResult(await res.json());
        else setResult(null);
      } catch {
        setResult(null);
      }
    }
    setLoading(false);
  };

  const examples = [
    'Caesar crossed the Rubicon',
    'Constantine saw a cross in the sky',
    'Nero played while Rome burned',
  ];

  const getVerdictColor = (v: string) => {
    if (v === 'LIKELY TRUE') return 'text-[#10B981] bg-[#10B981]/20';
    if (v === 'UNCERTAIN') return 'text-[#F59E0B] bg-[#F59E0B]/20';
    return 'text-[#EF4444] bg-[#EF4444]/20';
  };

  return (
    <div className={`min-h-screen transition-colors ${dark ? 'bg-[#0D0D0F] text-[#F5F4F2]' : 'bg-[#FAFAF8] text-[#1A1814]'}`}>
      <nav className={`fixed top-0 w-full z-50 backdrop-blur-lg ${dark ? 'bg-[#0D0D0F]/80 border-b border-white/10' : 'bg-white/80 border-b'}`}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <a href="/" className="text-2xl font-bold tracking-wider">LOGOS</a>
          <button onClick={() => setDark(!dark)} className="p-2 rounded-lg hover:bg-white/10">{dark ? '☀️' : '🌙'}</button>
        </div>
      </nav>

      <main className="pt-24 pb-12 px-6 max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#F59E0B]/20 text-[#F59E0B] text-sm font-medium mb-4">
            <span>✓</span>
            <span>Layer 4: Truth/History</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Historical Verification</h1>
          <p className={`text-xl max-w-2xl mx-auto ${dark ? 'text-gray-400' : 'text-gray-600'}`}>
            Cross-reference any claim across ALL ancient sources. Get confidence scores, not guesses.
          </p>
        </div>

        {/* Explanation */}
        <div className={`p-6 rounded-2xl mb-8 ${dark ? 'bg-[#1E1E24]' : 'bg-white border'}`}>
          <h2 className="font-bold text-lg mb-3">How Truth Verification Works</h2>
          <div className="grid md:grid-cols-2 gap-6 text-sm">
            <div>
              <h3 className="font-semibold text-[#10B981] mb-2">Truth Indicators ↑</h3>
              <ul className={`space-y-1 ${dark ? 'text-gray-400' : 'text-gray-600'}`}>
                <li>• Multiple independent sources agree</li>
                <li>• Against author's interest (admits unflattering)</li>
                <li>• Enemy corroboration</li>
                <li>• Material evidence (archaeology)</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-[#EF4444] mb-2">Embellishment Indicators ↓</h3>
              <ul className={`space-y-1 ${dark ? 'text-gray-400' : 'text-gray-600'}`}>
                <li>• Sole source claims</li>
                <li>• Serves author's interest</li>
                <li>• Standard rhetorical topos</li>
                <li>• Contradicts material evidence</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className={`p-6 rounded-2xl mb-8 ${dark ? 'bg-[#1E1E24]' : 'bg-white border'}`}>
          <textarea
            value={claim}
            onChange={e => setClaim(e.target.value)}
            placeholder="Enter a historical claim to verify..."
            rows={2}
            className={`w-full px-4 py-3 rounded-xl mb-4 ${dark ? 'bg-[#0D0D0F] border border-white/10' : 'bg-gray-100'}`}
          />
          <div className="flex justify-between items-center">
            <div className="flex flex-wrap gap-2">
              {examples.map((ex, i) => (
                <button key={i} onClick={() => setClaim(ex)}
                  className={`px-3 py-1 rounded-lg text-sm ${dark ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-100'}`}>
                  {ex}
                </button>
              ))}
            </div>
            <button onClick={handleVerify} disabled={loading}
              className="px-8 py-3 bg-[#F59E0B] text-black rounded-xl font-semibold hover:bg-[#FBBF24] disabled:opacity-50">
              {loading ? 'Verifying...' : 'Verify Claim'}
            </button>
          </div>
        </div>

        {/* Results */}
        {searched && !loading && result && (
          <div className="space-y-6">
            {/* Verdict */}
            <div className={`p-6 rounded-2xl ${dark ? 'bg-[#1E1E24]' : 'bg-white border'}`}>
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-xl font-bold mb-1">"{result.claim}"</h2>
                  <p className={dark ? 'text-gray-400' : 'text-gray-600'}>Analysis complete</p>
                </div>
                <span className={`px-4 py-2 rounded-xl font-bold ${getVerdictColor(result.verdict)}`}>
                  {result.verdict}
                </span>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div className={`p-4 rounded-xl ${dark ? 'bg-[#0D0D0F]' : 'bg-gray-50'}`}>
                  <div className="text-3xl font-bold text-[#C9A227]">{result.corroboration_score}%</div>
                  <div className={dark ? 'text-gray-400' : 'text-gray-600'}>Corroboration</div>
                </div>
                <div className={`p-4 rounded-xl ${dark ? 'bg-[#0D0D0F]' : 'bg-gray-50'}`}>
                  <div className="text-3xl font-bold">{result.fact_vs_embellishment}%</div>
                  <div className={dark ? 'text-gray-400' : 'text-gray-600'}>Fact Score</div>
                </div>
                <div className={`p-4 rounded-xl ${dark ? 'bg-[#0D0D0F]' : 'bg-gray-50'}`}>
                  <div className="text-3xl font-bold">{result.timeline_valid ? '✓' : '✗'}</div>
                  <div className={dark ? 'text-gray-400' : 'text-gray-600'}>Timeline Valid</div>
                </div>
              </div>
            </div>

            {/* Confirming Sources */}
            {result.confirming_sources.length > 0 && (
              <div className={`p-6 rounded-2xl ${dark ? 'bg-[#1E1E24]' : 'bg-white border'}`}>
                <h3 className="font-bold text-lg mb-4 text-[#10B981]">✓ Confirming Sources ({result.confirming_sources.length})</h3>
                <div className="space-y-4">
                  {result.confirming_sources.map((s, i) => (
                    <div key={i} className={`p-4 rounded-xl ${dark ? 'bg-[#0D0D0F]' : 'bg-gray-50'}`}>
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <span className="font-semibold">{s.author}</span>
                          <span className={`ml-2 ${dark ? 'text-gray-400' : 'text-gray-600'}`}>{s.work}</span>
                        </div>
                        <span className="text-sm text-[#10B981]">{(s.reliability * 100).toFixed(0)}% reliable</span>
                      </div>
                      <p className={`italic text-sm ${dark ? 'text-gray-300' : 'text-gray-700'}`}>"{s.quote}"</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Contradicting Sources */}
            {result.contradicting_sources.length > 0 && (
              <div className={`p-6 rounded-2xl ${dark ? 'bg-[#1E1E24]' : 'bg-white border'}`}>
                <h3 className="font-bold text-lg mb-4 text-[#EF4444]">✗ Contradicting Sources ({result.contradicting_sources.length})</h3>
                <div className="space-y-4">
                  {result.contradicting_sources.map((s, i) => (
                    <div key={i} className={`p-4 rounded-xl border-l-4 border-[#EF4444] ${dark ? 'bg-[#0D0D0F]' : 'bg-gray-50'}`}>
                      <div className="font-semibold mb-1">{s.author} - {s.work}</div>
                      <p className={`italic text-sm mb-2 ${dark ? 'text-gray-300' : 'text-gray-700'}`}>"{s.quote}"</p>
                      <p className="text-sm text-[#EF4444]">Issue: {s.issue}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Author Bias */}
            <div className={`p-6 rounded-2xl border-2 border-dashed ${dark ? 'border-[#F59E0B]/30 bg-[#F59E0B]/5' : 'border-[#F59E0B]/50'}`}>
              <h3 className="font-bold text-lg mb-3 text-[#F59E0B]">🎭 Author Bias Analysis (Game Theory)</h3>
              <div className="space-y-2">
                <p><strong>Author(s):</strong> {result.author_bias.author}</p>
                <p><strong>Position:</strong> {result.author_bias.position}</p>
                <p><strong>Predicted Distortion:</strong> {result.author_bias.predicted_distortion}</p>
              </div>
            </div>
          </div>
        )}

        {searched && !loading && !result && (
          <div className={`p-8 rounded-2xl text-center ${dark ? 'bg-[#1E1E24]' : 'bg-white border'}`}>
            <p className={dark ? 'text-gray-400' : 'text-gray-600'}>
              Could not verify this claim. Try one of the examples above.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
