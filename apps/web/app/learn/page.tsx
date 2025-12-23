'use client';
import React, { useState } from 'react';
const WORD = { word: 'μῆνις', pron: 'mē-nis', meaning: 'wrath, divine anger', occurrences: 23, examples: [{ text: 'μῆνιν ἄειδε θεὰ', source: 'Homer, Iliad 1.1', trans: 'Sing, goddess, the wrath...' }, { text: 'μῆνιν Ἀπόλλωνος', source: 'Iliad 1.75', trans: 'the wrath of Apollo' }], neighbors: ['χόλος', 'ὀργή', 'θυμός'] };
export default function LearnPage() {
  const [dark, setDark] = useState(true);
  const [xp, setXp] = useState(120);
  const [streak, setStreak] = useState(3);
  return (
    <div className={`min-h-screen ${dark ? 'bg-[#0D0D0F] text-[#F5F4F2]' : 'bg-[#FAFAF8] text-[#1A1814]'}`}>
      <nav className={`fixed top-0 w-full z-50 backdrop-blur-lg ${dark ? 'bg-[#0D0D0F]/80 border-b border-white/10' : 'bg-white/80 border-b'}`}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <a href="/" className="text-2xl font-bold tracking-wider">LOGOS</a>
          <div className="flex items-center gap-4">
            <span className="text-[#C9A227]">🔥 {streak} days</span>
            <span>{xp} XP</span>
            <button onClick={() => setDark(!dark)} className="p-2 rounded-lg hover:bg-white/10">{dark ? '☀️' : '🌙'}</button>
          </div>
        </div>
      </nav>
      <main className="pt-24 pb-12 px-6 max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Organic Learning</h1>
        <p className="text-gray-400 mb-8">Learn Greek & Latin from actual corpus usage</p>
        <div className={`p-6 rounded-2xl mb-8 ${dark ? 'bg-[#1E1E24]' : 'bg-white border'}`}>
          <div className="text-center mb-6">
            <p className="text-gray-400 mb-2">Word of the Day</p>
            <h2 className="text-5xl font-serif font-bold text-[#C9A227] mb-2">{WORD.word}</h2>
            <p className="text-gray-400">{WORD.pron}</p>
          </div>
          <div className="text-center mb-6">
            <p className="text-xl font-semibold mb-2">{WORD.meaning}</p>
            <p className="text-gray-400">{WORD.occurrences} occurrences in corpus</p>
          </div>
          <h3 className="font-semibold mb-3">Examples from the corpus:</h3>
          {WORD.examples.map((e, i) => (<div key={i} className={`p-4 rounded-xl mb-3 ${dark ? 'bg-[#0D0D0F]' : 'bg-gray-100'}`}><p className="font-serif text-lg mb-1">{e.text}</p><p className="text-sm italic text-gray-400">{e.trans}</p><p className="text-xs text-[#C9A227]">{e.source}</p></div>))}
          <h3 className="font-semibold mb-3 mt-6">Semantic Neighbors:</h3>
          <div className="flex gap-2">{WORD.neighbors.map((n, i) => (<span key={i} className={`px-3 py-1 rounded-lg ${dark ? 'bg-white/10' : 'bg-gray-100'}`}>{n}</span>))}</div>
        </div>
        <button onClick={() => setXp(xp + 10)} className="w-full py-4 bg-[#C9A227] text-black rounded-xl font-bold text-lg">Mark as Learned (+10 XP)</button>
      </main>
    </div>
  );
}
