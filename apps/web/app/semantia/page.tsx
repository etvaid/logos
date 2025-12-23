'use client'

import React, { useState } from 'react'

const WORDS = {
  "ἀρετή": {
    word: "ἀρετή",
    translit: "aretē", 
    traditional: "virtue",
    corpus: "excellence; battle prowess → moral virtue",
    count: 2847,
    drift: [
      {era: "Archaic", meaning: "battle excellence", pct: 92},
      {era: "Classical", meaning: "moral virtue", pct: 95},
      {era: "Late Antique", meaning: "Christian virtue", pct: 90},
    ],
    insight: "LSJ misses the shift from Homeric battle prowess to Platonic moral virtue."
  },
  "λόγος": {
    word: "λόγος",
    translit: "logos",
    traditional: "word, reason",
    corpus: "speech → reason → cosmic principle → divine Word",
    count: 12453,
    drift: [
      {era: "Archaic", meaning: "speech, story", pct: 94},
      {era: "Classical", meaning: "reason, argument", pct: 96},
      {era: "Late Antique", meaning: "divine Word", pct: 93},
    ],
    insight: "Most dramatic semantic transformation in Greek."
  },
  "ψυχή": {
    word: "ψυχή",
    translit: "psychē",
    traditional: "soul",
    corpus: "breath-soul → immortal soul → rational soul",
    count: 5621,
    drift: [
      {era: "Archaic", meaning: "breath, life-force", pct: 93},
      {era: "Classical", meaning: "immortal soul", pct: 95},
    ],
    insight: "Homer's psychē is NOT Plato's."
  },
};

const ERA_COLORS = {
  "Archaic": "#D97706",
  "Classical": "#F59E0B", 
  "Hellenistic": "#3B82F6",
  "Imperial": "#DC2626",
  "Late Antique": "#7C3AED",
  "Byzantine": "#059669"
};

export default function SemantiaPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedWord, setSelectedWord] = useState<string | null>(null)

  const handleWordSelect = (word: string) => {
    setSelectedWord(word)
    setSearchTerm(word)
  }

  const wordData = selectedWord ? WORDS[selectedWord as keyof typeof WORDS] : null

  return (
    <div className="min-h-screen bg-[#0D0D0F] text-[#F5F4F2] p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">
            <span className="text-[#C9A227]">SEMANTIA</span>
          </h1>
          <p className="text-lg text-[#F5F4F2]/70">
            Corpus-derived meanings reveal how words actually evolved
          </p>
        </div>

        {/* Search */}
        <div className="mb-8">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search Greek words..."
            className="w-full p-4 bg-[#1E1E24] border border-[#1E1E24] rounded-lg text-[#F5F4F2] placeholder-[#F5F4F2]/50 focus:outline-none focus:border-[#C9A227]"
          />
        </div>

        {/* Demo Words */}
        <div className="mb-8">
          <p className="text-sm text-[#F5F4F2]/70 mb-4">Try these words:</p>
          <div className="flex gap-4 flex-wrap">
            {Object.keys(WORDS).map((word) => (
              <button
                key={word}
                onClick={() => handleWordSelect(word)}
                className="px-4 py-2 bg-[#1E1E24] hover:bg-[#C9A227]/20 border border-[#C9A227]/30 rounded-lg transition-colors"
              >
                {word}
              </button>
            ))}
          </div>
        </div>

        {/* Word Details */}
        {wordData && (
          <div className="space-y-6">
            {/* Word Header */}
            <div className="bg-[#1E1E24] rounded-lg p-6">
              <div className="flex items-center gap-4 mb-4">
                <h2 className="text-3xl font-bold text-[#3B82F6]">{wordData.word}</h2>
                <span className="text-xl text-[#F5F4F2]/70">{wordData.translit}</span>
                <span className="text-sm text-[#F5F4F2]/50 bg-[#0D0D0F] px-2 py-1 rounded">
                  {wordData.count.toLocaleString()} occurrences
                </span>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-semibold text-[#F5F4F2]/70 mb-2">TRADITIONAL (LSJ)</h3>
                  <p className="text-lg">{wordData.traditional}</p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-[#C9A227] mb-2">CORPUS EVIDENCE</h3>
                  <p className="text-lg">{wordData.corpus}</p>
                </div>
              </div>
            </div>

            {/* Semantic Drift Timeline */}
            <div className="bg-[#1E1E24] rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">Semantic Evolution</h3>
              <div className="space-y-4">
                {wordData.drift.map((period, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div 
                      className="w-4 h-4 rounded-full flex-shrink-0"
                      style={{ backgroundColor: ERA_COLORS[period.era as keyof typeof ERA_COLORS] }}
                    />
                    <div className="flex-grow">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium">{period.era}</span>
                        <span className="text-sm text-[#F5F4F2]/70">{period.pct}%</span>
                      </div>
                      <p className="text-[#F5F4F2]/80">{period.meaning}</p>
                      <div className="mt-2 w-full bg-[#0D0D0F] rounded-full h-2">
                        <div 
                          className="h-2 rounded-full transition-all duration-500"
                          style={{ 
                            width: `${period.pct}%`,
                            backgroundColor: ERA_COLORS[period.era as keyof typeof ERA_COLORS]
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* LOGOS Insight */}
            <div className="bg-gradient-to-r from-[#C9A227]/20 to-[#C9A227]/10 border border-[#C9A227]/30 rounded-lg p-6">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-[#C9A227] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-[#0D0D0F] font-bold text-sm">Λ</span>
                </div>
                <div>
                  <h3 className="font-semibold text-[#C9A227] mb-2">LOGOS Insight</h3>
                  <p className="text-[#F5F4F2]/90">{wordData.insight}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* No Selection State */}
        {!selectedWord && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📚</div>
            <p className="text-xl text-[#F5F4F2]/70">
              Select a word to explore its semantic evolution
            </p>
          </div>
        )}
      </div>
    </div>
  )
}