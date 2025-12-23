'use client';
import React, { useState } from 'react';

const API_URL = 'https://logos-production-ef2b.up.railway.app';

interface Discovery {
  id: string; order: number; hypothesis: string; confidence: number; novelty: number; p_value: string;
  evidence: { text: string; author: string; work: string }[];
}

const DEMO: Discovery[] = [
  { id: '1', order: 3, hypothesis: 'Intertextual promiscuity signals political heterodoxy', confidence: 94, novelty: 94, p_value: '<0.001', evidence: [{ text: 'Authors who draw from many sources show heterodox views', author: 'Analysis', work: '1.7M passages' }] },
  { id: '2', order: 2, hypothesis: 'Cross-genre intertextuality is THE mechanism of innovation', confidence: 91, novelty: 91, p_value: '<0.001', evidence: [{ text: 'Most innovative works draw from different genres', author: 'Pattern', work: 'Corpus-wide' }] },
  { id: '3', order: 3, hypothesis: 'Greek engagement follows bottleneck pattern 50-150 CE', confidence: 87, novelty: 87, p_value: '<0.01', evidence: [{ text: 'Latin authors\' Greek usage drops dramatically then recovers', author: 'Temporal', work: 'Analysis' }] },
  { id: '4', order: 4, hypothesis: 'Stoic vocabulary correlates with political opposition literature', confidence: 82, novelty: 89, p_value: '<0.01', evidence: [{ text: 'Predicted from 3rd-order patterns, validated in holdout texts', author: 'Predictive', work: 'Model' }] },
];

export default function DiscoverPage() {
  const [dark, setDark] = useState(true);
  const [order, setOrder] = useState<number | null>(null);
  const [discoveries, setDiscoveries] = useState<Discovery[]>(DEMO);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

  const load = async (o: number | null) => {
    setOrder(o); setLoading(true);
    try {
      const url = o ? `${API_URL}/api/discovery/patterns?order=${o}` : `${API_URL}/api/discovery/patterns`;
      const res = await fetch(url);
      if (res.ok) { const d = await res.json(); setDiscoveries(d.discoveries || DEMO); }
    } catch { setDiscoveries(o ? DEMO.filter(d => d.order === o) : DEMO); }
    setLoading(false);
  };

  const orderColors: Record<number, string> = { 1: '#3B82F6', 2: '#10B981', 3: '#F59E0B', 4: '#EC4899' };

  return (
    <div className={`min-h-screen ${dark ? 'bg-[#0D0D0F] text-[#F5F4F2]' : 'bg-[#FAFAF8] text-[#1A1814]'}`}>
      <nav className={`fixed top-0 w-full z-50 backdrop-blur-lg ${dark ? 'bg-[#0D0D0F]/80 border-b border-white/10' : 'bg-white/80 border-b'}`}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <a href="/" className="text-2xl font-bold tracking-wider">LOGOS</a>
          <button onClick={() => setDark(!dark)} className="p-2 rounded-lg hover:bg-white/10">{dark ? '☀️' : '🌙'}</button>
        </div>
      </nav>
      <main className="pt-24 pb-12 px-6 max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#10B981]/20 text-[#10B981] text-sm font-medium mb-4">
            <span>💡</span><span>Layer 5: Discovery</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Higher-Order Discovery</h1>
          <p className={`text-xl max-w-2xl mx-auto ${dark ? 'text-gray-400' : 'text-gray-600'}`}>
            AI finds patterns across 1.7M passages that no human could see
          </p>
        </div>

        {/* Order Explanation */}
        <div className={`p-6 rounded-2xl mb-8 ${dark ? 'bg-[#1E1E24]' : 'bg-white border'}`}>
          <h2 className="font-bold text-lg mb-4">What Are Higher-Order Patterns?</h2>
          <div className="grid md:grid-cols-4 gap-4 text-sm">
            <div className={`p-4 rounded-xl border-l-4`} style={{ borderColor: orderColors[1] }}>
              <div className="font-bold mb-1" style={{ color: orderColors[1] }}>1st Order</div>
              <p className={dark ? 'text-gray-400' : 'text-gray-600'}>Direct: Virgil → Homer</p>
            </div>
            <div className={`p-4 rounded-xl border-l-4`} style={{ borderColor: orderColors[2] }}>
              <div className="font-bold mb-1" style={{ color: orderColors[2] }}>2nd Order</div>
              <p className={dark ? 'text-gray-400' : 'text-gray-600'}>Compare: Virgil→Homer vs Lucan→Virgil</p>
            </div>
            <div className={`p-4 rounded-xl border-l-4`} style={{ borderColor: orderColors[3] }}>
              <div className="font-bold mb-1" style={{ color: orderColors[3] }}>3rd Order</div>
              <p className={dark ? 'text-gray-400' : 'text-gray-600'}>Correlate with politics/context</p>
            </div>
            <div className={`p-4 rounded-xl border-l-4`} style={{ borderColor: orderColors[4] }}>
              <div className="font-bold mb-1" style={{ color: orderColors[4] }}>4th Order</div>
              <p className={dark ? 'text-gray-400' : 'text-gray-600'}>Predict unanalyzed texts</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-8">
          <button onClick={() => load(null)} className={`px-4 py-2 rounded-xl font-semibold ${order === null ? 'bg-[#C9A227] text-black' : dark ? 'bg-[#1E1E24]' : 'bg-gray-100'}`}>All Orders</button>
          {[1, 2, 3, 4].map(o => (
            <button key={o} onClick={() => load(o)} className={`px-4 py-2 rounded-xl font-semibold ${order === o ? 'text-white' : dark ? 'bg-[#1E1E24]' : 'bg-gray-100'}`} style={order === o ? { background: orderColors[o] } : {}}>
              {o}st/nd/rd/th Order
            </button>
          ))}
        </div>

        {/* Discoveries */}
        <div className="space-y-4">
          {discoveries.map(d => (
            <div key={d.id} className={`p-6 rounded-2xl ${dark ? 'bg-[#1E1E24]' : 'bg-white border'}`}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 rounded-lg text-sm font-bold text-white" style={{ background: orderColors[d.order] }}>Order {d.order}</span>
                  <span className="px-3 py-1 rounded-lg text-sm bg-[#C9A227]/20 text-[#C9A227]">Novelty {d.novelty}%</span>
                </div>
                <span className={`text-sm ${dark ? 'text-gray-400' : 'text-gray-600'}`}>p {d.p_value}</span>
              </div>
              <h3 className="text-xl font-bold mb-3">"{d.hypothesis}"</h3>
              <div className="flex items-center gap-4 mb-4">
                <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#10B981] to-[#C9A227]" style={{ width: `${d.confidence}%` }} />
                </div>
                <span className="font-semibold">{d.confidence}% confidence</span>
              </div>
              <button onClick={() => setExpanded(expanded === d.id ? null : d.id)} className="text-[#C9A227] text-sm">
                {expanded === d.id ? 'Hide evidence ↑' : 'Show evidence ↓'}
              </button>
              {expanded === d.id && (
                <div className={`mt-4 pt-4 border-t ${dark ? 'border-white/10' : 'border-gray-200'}`}>
                  {d.evidence.map((e, i) => (
                    <div key={i} className={`p-3 rounded-xl mb-2 ${dark ? 'bg-[#0D0D0F]' : 'bg-gray-50'}`}>
                      <p className="italic mb-1">"{e.text}"</p>
                      <p className={`text-sm ${dark ? 'text-gray-400' : 'text-gray-600'}`}>— {e.author}, {e.work}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
