'use client';
import React, { useState, useEffect } from 'react';

const API_URL = 'https://logos-production-ef2b.up.railway.app';
const LETTERS = ['α', 'β', 'γ', 'δ', 'ε', 'ζ', 'η', 'θ', 'ι', 'κ', 'λ', 'μ', 'ν', 'ξ', 'ο', 'π'];

export default function HomePage() {
  const [dark, setDark] = useState(true);
  const [email, setEmail] = useState('');
  const [modal, setModal] = useState(false);
  const [role, setRole] = useState('student');
  const [demo, setDemo] = useState('scholars');

  const stats = [
    { v: '1.7M', l: 'Passages' },
    { v: '140M', l: 'Words' },
    { v: '892K', l: 'Semantic Embeddings' },
    { v: '500K+', l: 'Intertexts' },
  ];

  const layers = [
    { n: '1', t: 'TEXT', d: 'Parsing, translation, citations', c: '#3B82F6' },
    { n: '2', t: 'SEMANTIA', d: 'Corpus-derived word meaning', c: '#8B5CF6' },
    { n: '3', t: 'RELATIONSHIP', d: 'Intertextuality, knowledge graph', c: '#EC4899' },
    { n: '4', t: 'TRUTH', d: 'Historical verification, bias analysis', c: '#F59E0B' },
    { n: '5', t: 'DISCOVERY', d: 'Higher-order patterns', c: '#10B981' },
  ];

  const features = [
    { i: '🔍', t: 'Semantic Search', d: 'Search by meaning across languages', l: '/search' },
    { i: '🌐', t: 'AI Translation', d: '3 styles with quality scoring', l: '/translate' },
    { i: '💡', t: 'Discovery Engine', d: '1st-4th order pattern detection', l: '/discover' },
    { i: '📚', t: 'SEMANTIA', d: 'What words ACTUALLY meant', l: '/semantia' },
    { i: '🔗', t: 'Intertextuality', d: 'Automatic allusion detection', l: '/discover' },
    { i: '✓', t: 'Truth Layer', d: 'Verify historical claims', l: '/verify' },
    { i: '📖', t: 'Text Reader', d: 'Morphology & commentary', l: '/read' },
    { i: '🤖', t: 'Research Assistant', d: 'AI with citations', l: '/research' },
    { i: '🎓', t: 'Organic Learning', d: 'Learn from the corpus', l: '/learn' },
    { i: '👻', t: 'Ghost Texts', d: 'Find lost works', l: '/discover' },
    { i: '📊', t: 'Stylometry', d: 'Authorship analysis', l: '/search' },
    { i: '⚖️', t: 'Bias Detection', d: 'Game theory for authors', l: '/verify' },
  ];

  const discoveries = [
    { h: 'Intertextual promiscuity signals political heterodoxy', p: '<0.001', n: '0.94', o: 3 },
    { h: 'Cross-genre intertextuality is THE mechanism of innovation', p: '<0.001', n: '0.91', o: 2 },
    { h: 'Greek engagement follows bottleneck pattern 50-150 CE', p: '<0.01', n: '0.87', o: 3 },
  ];

  const demos: Record<string, { t: string; d: string; f: string[] }> = {
    scholars: { t: 'For Scholars', d: 'Advanced research with full citations and discovery.', f: ['Cross-lingual semantic search', 'Higher-order pattern detection', 'CTS URN citations', 'Challenge lexicons with data'] },
    students: { t: 'For Students', d: 'Learn classical languages from actual usage.', f: ['Organic vocabulary building', 'Grammar in context', 'Click-word morphology', 'XP and streaks'] },
    pastors: { t: 'For Pastors', d: 'Prepare sermons with original language insights.', f: ['Biblical Greek texts', 'Patristic sources', 'Cross-reference finder', 'Sermon research'] },
    writers: { t: 'For Writers', d: 'Find authentic classical references.', f: ['Quote finder', 'Historical accuracy', 'Anachronism checker', 'Name generator'] },
  };

  const testimonials = [
    { q: "LOGOS found connections between Virgil and Apollonius I'd missed after 30 years.", a: "Prof. Sarah Mitchell", t: "Yale Classics" },
    { q: "SEMANTIA challenges 100 years of lexicography with actual evidence.", a: "Dr. James Chen", t: "Stanford DH" },
    { q: "Finally, a tool that shows what Greek words ACTUALLY meant.", a: "Dr. Maria Santos", t: "Princeton" },
  ];

  const pricing = [
    { n: 'Student', p: 'Free', d: 'With .edu', f: ['100 searches/day', 'AI translation', 'Basic morphology'], c: 'Get Started', pop: false },
    { n: 'Personal', p: '$9', d: '/month', f: ['Unlimited everything', 'All 5 layers', 'SEMANTIA access', 'API access'], c: 'Start Free Trial', pop: true },
    { n: 'Institution', p: '$29', d: '/seat/mo', f: ['Everything', 'LMS integration', 'Bulk export', 'Custom training'], c: 'Contact Sales', pop: false },
  ];

  return (
    <div className={`min-h-screen transition-colors ${dark ? 'bg-[#0D0D0F] text-[#F5F4F2]' : 'bg-[#FAFAF8] text-[#1A1814]'}`}>
      <style jsx global>{`
        @keyframes float { 0%,100%{transform:translateY(0) rotate(0);opacity:0.03} 50%{transform:translateY(-30px) rotate(5deg);opacity:0.07} }
        .float{animation:float 20s ease-in-out infinite}
        @keyframes pulse-gold{0%,100%{box-shadow:0 0 20px rgba(201,162,39,0.3)}50%{box-shadow:0 0 40px rgba(201,162,39,0.5)}}
        .pulse-gold{animation:pulse-gold 3s ease-in-out infinite}
      `}</style>

      {/* Floating Letters */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {LETTERS.map((l, i) => (
          <div key={i} className="absolute text-7xl font-serif float select-none"
            style={{ left: `${(i*6.5)%95}%`, top: `${(i*7)%85}%`, animationDelay: `${i*1.2}s`, animationDuration: `${16+i*1.5}s`, color: dark ? 'rgba(201,162,39,0.04)' : 'rgba(139,38,53,0.04)' }}>
            {l}
          </div>
        ))}
      </div>

      {/* Nav */}
      <nav className={`fixed top-0 w-full z-50 backdrop-blur-lg ${dark ? 'bg-[#0D0D0F]/80 border-b border-white/10' : 'bg-white/80 border-b'}`}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <a href="/" className="text-2xl font-bold tracking-[0.2em]">LOGOS</a>
          <div className="hidden md:flex items-center gap-6 text-sm">
            {['Search', 'Translate', 'Discover', 'Read', 'Research', 'SEMANTIA', 'Learn'].map(x => (
              <a key={x} href={`/${x.toLowerCase()}`} className="hover:text-[#C9A227] transition">{x}</a>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setDark(!dark)} className="p-2 rounded-lg hover:bg-white/10">{dark ? '☀️' : '🌙'}</button>
            <a href="/admin" className="px-4 py-2 bg-[#C9A227] text-black rounded-lg font-semibold hover:bg-[#E8D5A3]">Admin</a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-28 pb-20 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#C9A227]/20 text-[#C9A227] text-sm font-medium mb-6">
            <span className="animate-pulse">🏛️</span>
            <span>5 Analysis Layers • AI-Powered Discovery</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-[1.1]">
            Search Ancient Texts<br/>by <span className="text-[#C9A227]">Meaning</span>
          </h1>
          <p className={`text-xl mb-8 max-w-3xl mx-auto ${dark ? 'text-gray-400' : 'text-gray-600'}`}>
            1.7 million passages. 892K semantic embeddings. Higher-order pattern detection.<br/>
            Find what no human could see.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <a href="/search" className="px-8 py-4 bg-[#C9A227] text-black rounded-xl font-bold text-lg hover:bg-[#E8D5A3] pulse-gold">
              Start Searching →
            </a>
            <button onClick={() => setModal(true)} className={`px-8 py-4 rounded-xl font-bold text-lg border-2 ${dark ? 'border-white/20 hover:bg-white/5' : 'border-gray-300 hover:bg-gray-50'}`}>
              Get Early Access
            </button>
          </div>
          <div className="flex flex-wrap justify-center gap-10 md:gap-16">
            {stats.map((s, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-[#C9A227]">{s.v}</div>
                <div className={dark ? 'text-gray-500' : 'text-gray-600'}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5 Layers */}
      <section className={`py-20 px-6 ${dark ? 'bg-[#141418]' : 'bg-white'}`}>
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4">The 5 Analysis Layers</h2>
          <p className={`text-center mb-12 ${dark ? 'text-gray-400' : 'text-gray-600'}`}>From raw text to unprecedented discovery</p>
          <div className="grid md:grid-cols-5 gap-4">
            {layers.map((l, i) => (
              <div key={i} className={`p-6 rounded-xl text-center ${dark ? 'bg-[#1E1E24]' : 'bg-gray-50'}`}>
                <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 text-white font-bold" style={{ background: l.c }}>{l.n}</div>
                <h3 className="font-bold mb-1">{l.t}</h3>
                <p className={`text-sm ${dark ? 'text-gray-400' : 'text-gray-600'}`}>{l.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">All Features</h2>
          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-5">
            {features.map((f, i) => (
              <a key={i} href={f.l} className={`group p-5 rounded-xl transition-all hover:scale-[1.02] ${dark ? 'bg-[#1E1E24] hover:bg-[#252530]' : 'bg-gray-50 hover:bg-gray-100'}`}>
                <div className="text-3xl mb-3">{f.i}</div>
                <h3 className="font-bold mb-1 group-hover:text-[#C9A227]">{f.t}</h3>
                <p className={`text-sm ${dark ? 'text-gray-400' : 'text-gray-600'}`}>{f.d}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Discoveries */}
      <section className={`py-20 px-6 ${dark ? 'bg-[#141418]' : 'bg-gray-50'}`}>
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4">Real Discoveries</h2>
          <p className={`text-center mb-12 ${dark ? 'text-gray-400' : 'text-gray-600'}`}>Patterns no human could see — found by AI</p>
          <div className="space-y-4">
            {discoveries.map((d, i) => (
              <div key={i} className={`p-6 rounded-xl ${dark ? 'bg-[#1E1E24]' : 'bg-white border'}`}>
                <div className="flex items-start justify-between">
                  <div>
                    <span className="inline-block px-2 py-1 text-xs rounded bg-[#C9A227]/20 text-[#C9A227] mb-2">Order {d.o}</span>
                    <h3 className="text-lg font-semibold">"{d.h}"</h3>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-[#10B981]">p {d.p}</div>
                    <div className="text-sm text-[#C9A227]">Novelty: {d.n}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <a href="/discover" className="inline-block px-6 py-3 bg-[#C9A227] text-black rounded-xl font-bold">Explore Discoveries →</a>
          </div>
        </div>
      </section>

      {/* Demographics */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">Built For You</h2>
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {Object.keys(demos).map(k => (
              <button key={k} onClick={() => setDemo(k)} className={`px-5 py-2 rounded-xl font-semibold transition ${demo === k ? 'bg-[#C9A227] text-black' : dark ? 'bg-[#1E1E24]' : 'bg-gray-100'}`}>
                {demos[k].t.replace('For ', '')}
              </button>
            ))}
          </div>
          <div className={`p-8 rounded-2xl ${dark ? 'bg-[#1E1E24]' : 'bg-white border'}`}>
            <h3 className="text-2xl font-bold mb-2">{demos[demo].t}</h3>
            <p className={`mb-6 ${dark ? 'text-gray-400' : 'text-gray-600'}`}>{demos[demo].d}</p>
            <ul className="grid md:grid-cols-2 gap-3">
              {demos[demo].f.map((f, i) => (
                <li key={i} className="flex items-center gap-3"><span className="text-[#C9A227]">✓</span>{f}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className={`py-20 px-6 ${dark ? 'bg-[#141418]' : 'bg-gray-50'}`}>
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">Trusted by Scholars</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className={`p-6 rounded-xl ${dark ? 'bg-[#1E1E24]' : 'bg-white border'}`}>
                <p className={`mb-4 italic ${dark ? 'text-gray-300' : 'text-gray-700'}`}>"{t.q}"</p>
                <div className="font-bold">{t.a}</div>
                <div className={dark ? 'text-gray-500' : 'text-gray-600'}>{t.t}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4">Simple Pricing</h2>
          <p className={`text-center mb-12 ${dark ? 'text-gray-400' : 'text-gray-600'}`}>Free for students. Affordable for everyone.</p>
          <div className="grid md:grid-cols-3 gap-6">
            {pricing.map((pl, i) => (
              <div key={i} className={`relative p-6 rounded-2xl ${pl.pop ? 'ring-2 ring-[#C9A227] scale-105' : ''} ${dark ? 'bg-[#1E1E24]' : 'bg-white border'}`}>
                {pl.pop && <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-[#C9A227] text-black text-xs font-bold rounded-full">POPULAR</div>}
                <h3 className="text-xl font-bold mb-2">{pl.n}</h3>
                <div className="flex items-baseline gap-1 mb-5">
                  <span className="text-3xl font-bold">{pl.p}</span>
                  <span className={dark ? 'text-gray-500' : 'text-gray-600'}>{pl.d}</span>
                </div>
                <ul className="space-y-2 mb-6">
                  {pl.f.map((f, j) => <li key={j} className="flex items-center gap-2"><span className="text-[#C9A227]">✓</span>{f}</li>)}
                </ul>
                <button className={`w-full py-3 rounded-xl font-bold ${pl.pop ? 'bg-[#C9A227] text-black' : dark ? 'bg-white/10' : 'bg-gray-100'}`}>{pl.c}</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className={`py-20 px-6 ${dark ? 'bg-[#141418]' : 'bg-gray-50'}`}>
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Transform Your Research?</h2>
          <p className={`text-xl mb-8 ${dark ? 'text-gray-400' : 'text-gray-600'}`}>Join scholars using AI to unlock the ancient world.</p>
          <a href="/search" className="inline-block px-10 py-5 bg-[#C9A227] text-black rounded-xl font-bold text-xl pulse-gold">Get Started Free →</a>
        </div>
      </section>

      {/* Footer */}
      <footer className={`py-10 px-6 ${dark ? 'border-t border-white/10' : 'border-t'}`}>
        <div className="max-w-6xl mx-auto flex flex-wrap justify-between items-center gap-6">
          <div>
            <div className="text-xl font-bold tracking-wider mb-1">LOGOS</div>
            <p className={dark ? 'text-gray-500' : 'text-gray-600'}>AI-Powered Classical Research</p>
          </div>
          <div className="flex flex-wrap gap-6">
            {['Search', 'Translate', 'Discover', 'SEMANTIA', 'Verify', 'Learn', 'Admin'].map(l => (
              <a key={l} href={`/${l.toLowerCase()}`} className="hover:text-[#C9A227]">{l}</a>
            ))}
          </div>
        </div>
      </footer>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-6" onClick={() => setModal(false)}>
          <div className={`max-w-md w-full p-8 rounded-2xl ${dark ? 'bg-[#1E1E24]' : 'bg-white'}`} onClick={e => e.stopPropagation()}>
            <h3 className="text-2xl font-bold mb-2">Get Early Access</h3>
            <p className={`mb-6 ${dark ? 'text-gray-400' : 'text-gray-600'}`}>Join the waitlist for all 5 analysis layers.</p>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@university.edu"
              className={`w-full px-4 py-3 rounded-xl mb-4 ${dark ? 'bg-[#0D0D0F] border border-white/10' : 'bg-gray-100'}`} />
            <select value={role} onChange={e => setRole(e.target.value)}
              className={`w-full px-4 py-3 rounded-xl mb-6 ${dark ? 'bg-[#0D0D0F] border border-white/10' : 'bg-gray-100'}`}>
              <option value="student">Student</option>
              <option value="scholar">Scholar</option>
              <option value="pastor">Pastor</option>
              <option value="writer">Writer</option>
            </select>
            <button className="w-full py-4 bg-[#C9A227] text-black rounded-xl font-bold">Join Waitlist →</button>
          </div>
        </div>
      )}
    </div>
  );
}
