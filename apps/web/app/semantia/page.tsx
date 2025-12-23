'use client'

import { useState } from 'react'

const WORDS: Record<string, {word:string, translit:string, traditional:string, corpus:string, count:number, drift:{era:string,meaning:string,pct:number,color:string}[], insight:string}> = {
  "ἀρετή": {
    word:"ἀρετή", translit:"aretē", traditional:"virtue", 
    corpus:"excellence → moral virtue → Christian virtue",
    count:2847,
    drift:[
      {era:"Archaic",meaning:"Battle excellence, prowess",pct:92,color:"#D97706"},
      {era:"Classical",meaning:"Moral excellence, virtue",pct:95,color:"#F59E0B"},
      {era:"Late Antique",meaning:"Christian virtue",pct:90,color:"#7C3AED"}
    ],
    insight:"LSJ misses the shift from Homeric battle prowess to Platonic moral virtue."
  },
  "λόγος": {
    word:"λόγος", translit:"logos", traditional:"word, reason",
    corpus:"speech → reason → cosmic principle → divine Word",
    count:12453,
    drift:[
      {era:"Archaic",meaning:"Speech, story",pct:94,color:"#D97706"},
      {era:"Classical",meaning:"Reason, argument",pct:96,color:"#F59E0B"},
      {era:"Late Antique",meaning:"Divine Word",pct:93,color:"#7C3AED"}
    ],
    insight:"Most dramatic semantic transformation in Greek."
  },
  "ψυχή": {
    word:"ψυχή", translit:"psychē", traditional:"soul",
    corpus:"breath-soul → immortal soul",
    count:5621,
    drift:[
      {era:"Archaic",meaning:"Breath, life-force",pct:93,color:"#D97706"},
      {era:"Classical",meaning:"Immortal soul",pct:95,color:"#F59E0B"}
    ],
    insight:"Homer's psychē is NOT Plato's."
  }
};

export default function SemantiaPage() {
  const [selected, setSelected] = useState<typeof WORDS[string] | null>(null)

  return (
    <div className="min-h-screen" style={{backgroundColor: '#0D0D0F', color: '#F5F4F2'}}>
      <div className="container mx-auto px-6 py-8">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4" style={{color: '#C9A227'}}>
            SEMANTIA
          </h1>
          <p className="text-xl" style={{color: '#F5F4F2'}}>
            Semantic Drift Analysis | How ancient meanings transform across millennia
          </p>
        </div>

        {/* Word Selection */}
        <div className="mb-8">
          <div className="flex gap-4 mb-6">
            {Object.keys(WORDS).map(key => (
              <button
                key={key}
                onClick={() => setSelected(WORDS[key])}
                className="px-6 py-3 rounded-lg font-semibold text-lg transition-all hover:opacity-80"
                style={{
                  backgroundColor: selected?.word === WORDS[key].word ? '#C9A227' : '#1E1E24',
                  color: selected?.word === WORDS[key].word ? '#0D0D0F' : '#F5F4F2',
                  border: `1px solid ${selected?.word === WORDS[key].word ? '#C9A227' : '#1E1E24'}`
                }}
              >
                {WORDS[key].word}
              </button>
            ))}
          </div>
        </div>

        {/* Word Analysis */}
        {selected ? (
          <div className="space-y-8">
            {/* Header */}
            <div style={{backgroundColor: '#1E1E24'}} className="rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-3xl font-bold" style={{color: '#C9A227'}}>
                    {selected.word}
                  </h2>
                  <p className="text-xl italic" style={{color: '#F5F4F2'}}>
                    {selected.translit}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold" style={{color: '#C9A227'}}>
                    {selected.count.toLocaleString()}
                  </div>
                  <div className="text-sm" style={{color: '#F5F4F2'}}>
                    corpus instances
                  </div>
                </div>
              </div>
            </div>

            {/* Meanings Comparison */}
            <div className="grid md:grid-cols-2 gap-6">
              <div style={{backgroundColor: '#1E1E24'}} className="rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-3" style={{color: '#DC2626'}}>
                  Traditional Definition
                </h3>
                <p className="text-lg" style={{color: '#F5F4F2'}}>
                  {selected.traditional}
                </p>
              </div>
              <div style={{backgroundColor: '#1E1E24'}} className="rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-3" style={{color: '#3B82F6'}}>
                  Corpus Evolution
                </h3>
                <p className="text-lg" style={{color: '#F5F4F2'}}>
                  {selected.corpus}
                </p>
              </div>
            </div>

            {/* Semantic Drift Timeline */}
            <div style={{backgroundColor: '#1E1E24'}} className="rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-6" style={{color: '#C9A227'}}>
                Semantic Drift Timeline
              </h3>
              <div className="space-y-6">
                {selected.drift.map((period, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold" style={{color: period.color}}>
                        {period.era}
                      </span>
                      <span className="text-sm" style={{color: '#F5F4F2'}}>
                        {period.pct}% confidence
                      </span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-3">
                      <div 
                        className="h-3 rounded-full transition-all duration-500"
                        style={{
                          backgroundColor: period.color,
                          width: `${period.pct}%`
                        }}
                      />
                    </div>
                    <p className="text-sm" style={{color: '#F5F4F2'}}>
                      {period.meaning}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Insight */}
            <div style={{backgroundColor: '#1E1E24'}} className="rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4" style={{color: '#C9A227'}}>
                Key Insight
              </h3>
              <p className="text-lg" style={{color: '#F5F4F2'}}>
                {selected.insight}
              </p>
            </div>
          </div>
        ) : (
          <div style={{backgroundColor: '#1E1E24'}} className="rounded-lg p-12 text-center">
            <h3 className="text-2xl font-semibold mb-4" style={{color: '#C9A227'}}>
              Select a Word Above
            </h3>
            <p className="text-lg" style={{color: '#F5F4F2'}}>
              Click on any word to explore its semantic evolution across ancient history
            </p>
          </div>
        )}
      </div>
    </div>
  )
}