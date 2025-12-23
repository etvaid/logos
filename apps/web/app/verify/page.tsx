'use client';
import React, { useState } from 'react';

interface VerifyResult {
  claim: string;
  verdict: string;
  corroboration: number;
  sources: { author: string; work: string; agrees: boolean }[];
}

const DEMO: Record<string, VerifyResult> = {
  'caesar': { claim: 'Caesar crossed the Rubicon', verdict: 'LIKELY TRUE', corroboration: 85,
    sources: [{ author: 'Suetonius', work: 'Divus Iulius', agrees: true }, { author: 'Plutarch', work: 'Caesar', agrees: true }] },
  'nero': { claim: 'Nero played while Rome burned', verdict: 'LIKELY EMBELLISHED', corroboration: 25,
    sources: [{ author: 'Tacitus', work: 'Annals', agrees: false }, { author: 'Suetonius', work: 'Nero', agrees: true }] },
};

export default function VerifyPage() {
  const [dark, setDark] = useState(true);
  const [claim, setClaim] = useState('');
  const [result, setResult] = useState<VerifyResult | null>(null);

  const verify = () => {
    const key = Object.keys(DEMO).find(k => claim.toLowerCase().includes(k));
    if (key) setResult(DEMO[key]);
  };

  const getColor = (v: string) => v === 'LIKELY TRUE' ? 'text-green-400 bg-green-400/20' : 'text-red-400 bg-red-400/20';

  return (
    <div className={`min-h-screen ${dark ? 'bg-[#0D0D0F] text-[#F5F4F2]' : 'bg-white text-black'}`}>
      <nav className={`fixed top-0 w-full z-50 backdrop-blur-lg ${dark ? 'bg-[#0D0D0F]/80 border-b border-white/10' : 'bg-white/80 border-b'}`}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <a href="/" className="text-2xl font-bold tracking-wider">LOGOS</a>
          <button onClick={() => setDark(!dark)} className="p-2">{dark ? '☀️' : '🌙'}</button>
        </div>
      </nav>
      <main className="pt-24 pb-12 px-6 max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <span className="px-4 py-2 rounded-full bg-[#F59E0B]/20 text-[#F59E0B] text-sm">Layer 4: Truth</span>
          <h1 className="text-5xl font-bold mt-4 mb-4">Historical Verification</h1>
          <p className={`text-xl ${dark ? 'text-gray-400' : 'text-gray-600'}`}>Cross-reference claims across ALL ancient sources</p>
        </div>
        <div className={`p-6 rounded-2xl mb-8 ${dark ? 'bg-[#1E1E24]' : 'bg-gray-100'}`}>
          <textarea value={claim} onChange={e => setClaim(e.target.value)} placeholder="Enter a historical claim..."
            rows={2} className={`w-full px-4 py-3 rounded-xl mb-4 ${dark ? 'bg-[#0D0D0F]' : 'bg-white'}`} />
          <div className="flex justify-between">
            <div className="flex gap-2">
              <button onClick={() => setClaim('Caesar crossed the Rubicon')} className={`px-3 py-1 rounded-lg ${dark ? 'bg-white/10' : 'bg-gray-200'}`}>Caesar</button>
              <button onClick={() => setClaim('Nero played while Rome burned')} className={`px-3 py-1 rounded-lg ${dark ? 'bg-white/10' : 'bg-gray-200'}`}>Nero</button>
            </div>
            <button onClick={verify} className="px-8 py-3 bg-[#F59E0B] text-black rounded-xl font-semibold">Verify</button>
          </div>
        </div>
        {result && (
          <div className={`p-6 rounded-2xl ${dark ? 'bg-[#1E1E24]' : 'bg-gray-100'}`}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">"{result.claim}"</h2>
              <span className={`px-4 py-2 rounded-xl font-bold ${getColor(result.verdict)}`}>{result.verdict}</span>
            </div>
            <div className="mb-6">
              <div className="flex justify-between mb-2"><span>Corroboration</span><span>{result.corroboration}%</span></div>
              <div className="h-3 bg-gray-700 rounded-full"><div className="h-full bg-[#C9A227] rounded-full" style={{width: `${result.corroboration}%`}} /></div>
            </div>
            <h3 className="font-semibold mb-3">Sources</h3>
            {result.sources.map((s, i) => (
              <div key={i} className={`p-3 rounded-xl mb-2 flex justify-between ${dark ? 'bg-[#0D0D0F]' : 'bg-white'}`}>
                <span>{s.author} - {s.work}</span>
                <span className={s.agrees ? 'text-green-400' : 'text-red-400'}>{s.agrees ? '✓ Confirms' : '✗ Contradicts'}</span>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
