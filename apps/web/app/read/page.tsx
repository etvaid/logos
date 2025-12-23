'use client';
import React, { useState } from 'react';
const API_URL = 'https://logos-production-ef2b.up.railway.app';
const DEMO = { urn: 'urn:cts:greekLit:tlg0012.tlg001:1.1-5', text: 'μῆνιν ἄειδε θεὰ Πηληϊάδεω Ἀχιλῆος\nοὐλομένην, ἣ μυρί᾽ Ἀχαιοῖς ἄλγε᾽ ἔθηκε,\nπολλὰς δ᾽ ἰφθίμους ψυχὰς Ἄϊδι προΐαψεν\nἡρώων, αὐτοὺς δὲ ἑλώρια τεῦχε κύνεσσιν\nοἰωνοῖσί τε πᾶσι', author: 'Homer', work: 'Iliad', translation: 'Sing, goddess, the wrath of Achilles son of Peleus,\nthe destructive wrath that brought countless sorrows upon the Achaeans,\nand sent many mighty souls of heroes to Hades,\nmaking their bodies prey for dogs\nand all birds.' };
export default function ReadPage() {
  const [dark, setDark] = useState(true);
  const [showTrans, setShowTrans] = useState(true);
  return (
    <div className={`min-h-screen ${dark ? 'bg-[#0D0D0F] text-[#F5F4F2]' : 'bg-[#FAFAF8] text-[#1A1814]'}`}>
      <nav className={`fixed top-0 w-full z-50 backdrop-blur-lg ${dark ? 'bg-[#0D0D0F]/80 border-b border-white/10' : 'bg-white/80 border-b'}`}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <a href="/" className="text-2xl font-bold tracking-wider">LOGOS</a>
          <button onClick={() => setDark(!dark)} className="p-2 rounded-lg hover:bg-white/10">{dark ? '☀️' : '🌙'}</button>
        </div>
      </nav>
      <main className="pt-24 pb-12 px-6 max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div><h1 className="text-2xl font-bold">{DEMO.author}, {DEMO.work}</h1><p className="text-gray-400 text-sm">{DEMO.urn}</p></div>
          <button onClick={() => setShowTrans(!showTrans)} className={`px-4 py-2 rounded-xl ${showTrans ? 'bg-[#C9A227] text-black' : 'bg-white/10'}`}>Translation</button>
        </div>
        <div className={`grid ${showTrans ? 'md:grid-cols-2' : ''} gap-6`}>
          <div className={`p-6 rounded-2xl ${dark ? 'bg-[#1E1E24]' : 'bg-white border'}`}>
            <h2 className="font-semibold mb-4">Original Greek</h2>
            {DEMO.text.split('\n').map((line, i) => (<p key={i} className="text-lg font-serif leading-relaxed mb-2"><span className="text-gray-500 mr-4">{i+1}</span>{line}</p>))}
            <p className="text-sm text-gray-400 mt-4">Click any word for morphology analysis (SEMANTIA-powered)</p>
          </div>
          {showTrans && <div className={`p-6 rounded-2xl ${dark ? 'bg-[#1E1E24]' : 'bg-white border'}`}>
            <h2 className="font-semibold mb-4">Translation</h2>
            {DEMO.translation.split('\n').map((line, i) => (<p key={i} className="leading-relaxed mb-2 italic">{line}</p>))}
          </div>}
        </div>
      </main>
    </div>
  );
}
