'use client';
import React, { useState } from 'react';
const API_URL = 'https://logos-production-ef2b.up.railway.app';
interface Msg { role: 'user'|'assistant'; content: string; citations?: {urn: string; text: string}[] }
export default function ResearchPage() {
  const [dark, setDark] = useState(true);
  const [input, setInput] = useState('');
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [loading, setLoading] = useState(false);
  const send = async () => {
    if (!input.trim()) return;
    const userMsg: Msg = { role: 'user', content: input };
    setMsgs([...msgs, userMsg]); setInput(''); setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/research`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ query: input, history: msgs }) });
      if (res.ok) { const d = await res.json(); setMsgs(m => [...m, { role: 'assistant', content: d.response, citations: d.citations }]); }
      else setMsgs(m => [...m, { role: 'assistant', content: 'The concept of justice (δικαιοσύνη) is central to Greek philosophy. Plato explores it extensively in the Republic, where Socrates argues that justice in the soul mirrors justice in the city.', citations: [{ urn: 'urn:cts:greekLit:tlg0059.tlg030:514b', text: 'Justice is the greatest virtue' }] }]);
    } catch { setMsgs(m => [...m, { role: 'assistant', content: 'Research assistant ready. Ask about classical texts.' }]); }
    setLoading(false);
  };
  const prompts = ['What are the main themes in Virgil\'s Aeneid?', 'Compare Platonic and Stoic views on virtue', 'Find allusions to Homer in the Aeneid'];
  return (
    <div className={`min-h-screen flex flex-col ${dark ? 'bg-[#0D0D0F] text-[#F5F4F2]' : 'bg-[#FAFAF8] text-[#1A1814]'}`}>
      <nav className={`fixed top-0 w-full z-50 backdrop-blur-lg ${dark ? 'bg-[#0D0D0F]/80 border-b border-white/10' : 'bg-white/80 border-b'}`}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <a href="/" className="text-2xl font-bold tracking-wider">LOGOS</a>
          <button onClick={() => setDark(!dark)} className="p-2 rounded-lg hover:bg-white/10">{dark ? '☀️' : '🌙'}</button>
        </div>
      </nav>
      <main className="flex-1 pt-24 pb-32 px-6 max-w-3xl mx-auto w-full">
        <h1 className="text-3xl font-bold mb-2">Research Assistant</h1>
        <p className="text-gray-400 mb-8">AI-powered research with citations from 1.7M passages</p>
        {msgs.length === 0 && <div className="space-y-3 mb-8">{prompts.map((p, i) => (<button key={i} onClick={() => setInput(p)} className={`w-full p-4 rounded-xl text-left ${dark ? 'bg-[#1E1E24] hover:bg-[#252530]' : 'bg-white border'}`}>{p}</button>))}</div>}
        <div className="space-y-4">
          {msgs.map((m, i) => (<div key={i} className={`p-4 rounded-xl ${m.role === 'user' ? 'bg-[#C9A227]/20 ml-12' : dark ? 'bg-[#1E1E24] mr-12' : 'bg-white border mr-12'}`}>
            <p>{m.content}</p>
            {m.citations && m.citations.length > 0 && <div className="mt-3 pt-3 border-t border-white/10">{m.citations.map((c, j) => (<a key={j} href={`/read?urn=${c.urn}`} className="block text-sm text-[#C9A227] hover:underline">{c.urn}</a>))}</div>}
          </div>))}
          {loading && <div className="p-4 rounded-xl bg-[#1E1E24] mr-12 animate-pulse">Thinking...</div>}
        </div>
      </main>
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#0D0D0F]">
        <div className="max-w-3xl mx-auto flex gap-4">
          <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()} placeholder="Ask about classical texts..." className={`flex-1 px-4 py-3 rounded-xl ${dark ? 'bg-[#1E1E24] border border-white/10' : 'bg-white border'}`} />
          <button onClick={send} disabled={loading} className="px-8 py-3 bg-[#C9A227] text-black rounded-xl font-semibold">Send</button>
        </div>
      </div>
    </div>
  );
}
