
'use client';

import { useState } from 'react';
import Link from 'next/link';

const TRANSLATIONS: Record<string, string> = {
  "μῆνιν ἄειδε θεὰ": "Sing, goddess, of the wrath",
  "arma virumque cano": "I sing of arms and the man",
  "cogito ergo sum": "I think, therefore I am",
  "γνῶθι σεαυτόν": "Know thyself",
  "carpe diem": "Seize the day",
  "veni vidi vici": "I came, I saw, I conquered",
  "memento mori": "Remember that you will die",
  "amor vincit omnia": "Love conquers all",
};

const WORDS: Record<string, string> = {
  "μῆνιν": "wrath", "ἄειδε": "sing", "θεὰ": "goddess", "arma": "arms",
  "virum": "man", "cano": "I sing", "amor": "love", "vincit": "conquers",
  "carpe": "seize", "diem": "day", "veni": "I came", "vidi": "I saw",
  "vici": "I conquered", "ἀρετή": "virtue", "λόγος": "word/reason",
};

export default function TranslatePage() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [words, setWords] = useState<{orig: string, trans: string}[]>([]);

  const translate = () => {
    const lower = input.toLowerCase().trim();
    if (TRANSLATIONS[lower]) {
      setOutput(TRANSLATIONS[lower]);
      setWords([]);
      return;
    }
    const parts = input.split(/\s+/).map(w => {
      const clean = w.toLowerCase().replace(/[.,;:!?]/g, '');
      return { orig: w, trans: WORDS[clean] || `[${w}]` };
    });
    setWords(parts);
    setOutput(parts.map(r => r.trans).join(' '));
  };

  return (
    <div className="min-h-screen bg-[#0D0D0F] text-[#F5F4F2]">
      <nav className="border-b border-gray-800 p-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-[#C9A227]">LOGOS</Link>
          <div className="flex gap-6 text-sm">
            <Link href="/search" className="hover:text-[#C9A227]">Search</Link>
            <Link href="/translate" className="text-[#C9A227]">Translate</Link>
            <Link href="/semantia" className="hover:text-[#C9A227]">SEMANTIA</Link>
            <Link href="/maps" className="hover:text-[#C9A227]">Maps</Link>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto p-8">
        <h1 className="text-4xl font-bold mb-2">AI Translation</h1>
        <p className="text-gray-400 mb-8">Translate Greek and Latin</p>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm text-gray-400 mb-2">Greek or Latin</label>
            <textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder="Enter text..."
              className="w-full h-40 px-4 py-3 bg-[#1E1E24] border border-gray-700 rounded-lg focus:border-[#C9A227] focus:outline-none font-serif text-lg resize-none" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">Translation</label>
            <div className="w-full h-40 px-4 py-3 bg-[#1E1E24] border border-gray-700 rounded-lg text-lg">
              {output || <span className="text-gray-500">Translation appears here...</span>}
            </div>
          </div>
        </div>

        <button onClick={translate} className="px-8 py-3 bg-[#C9A227] text-black font-bold rounded-lg hover:bg-[#E8D5A3] mb-8">Translate</button>

        <div className="mb-8">
          <p className="text-sm text-gray-400 mb-2">Try these:</p>
          <div className="flex gap-2 flex-wrap">
            {["μῆνιν ἄειδε θεὰ", "arma virumque cano", "carpe diem", "veni vidi vici"].map(ex => (
              <button key={ex} onClick={() => setInput(ex)} className="px-3 py-2 bg-[#1E1E24] border border-gray-700 rounded-lg text-sm hover:border-[#C9A227] font-serif">{ex}</button>
            ))}
          </div>
        </div>

        {words.length > 0 && (
          <div className="p-6 bg-[#1E1E24] rounded-lg">
            <h3 className="font-bold mb-4">Word by Word</h3>
            <div className="flex flex-wrap gap-4">
              {words.map((w, i) => (
                <div key={i} className="text-center">
                  <div className="font-serif text-lg">{w.orig}</div>
                  <div className="text-sm text-[#C9A227]">{w.trans}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
