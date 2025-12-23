'use client'

import React, { useState } from 'react'

const WORDS = {
  'ἀρετή': {
    transliteration: 'aretē',
    language: 'Greek',
    traditional: 'virtue',
    corpus: 'excellence, skill, functional effectiveness',
    occurrences: 847,
    insight: 'Originally meant functional excellence of any kind - a sharp knife had aretē. Only later narrowed to moral virtue.',
    semanticDrift: [
      { era: 'archaic', meaning: 'functional excellence, skill', confidence: 0.9, color: '#D97706' },
      { era: 'classical', meaning: 'moral virtue, character excellence', confidence: 0.85, color: '#F59E0B' },
      { era: 'imperial', meaning: 'philosophical virtue, ideal behavior', confidence: 0.8, color: '#DC2626' },
      { era: 'lateAntique', meaning: 'Christian virtue, divine grace', confidence: 0.75, color: '#7C3AED' }
    ]
  },
  'λόγος': {
    transliteration: 'logos',
    language: 'Greek',
    traditional: 'word',
    corpus: 'rational principle, divine reason, cosmic order',
    occurrences: 1243,
    insight: 'Evolved from simple "word" to cosmic principle. John\'s Gospel uses this evolution: "In the beginning was the Logos."',
    semanticDrift: [
      { era: 'archaic', meaning: 'word, speech, story', confidence: 0.95, color: '#D97706' },
      { era: 'classical', meaning: 'reason, argument, proportion', confidence: 0.9, color: '#F59E0B' },
      { era: 'imperial', meaning: 'rational principle, cosmic law', confidence: 0.85, color: '#DC2626' },
      { era: 'lateAntique', meaning: 'divine Word, Christ', confidence: 0.8, color: '#7C3AED' }
    ]
  },
  'ψυχή': {
    transliteration: 'psychē',
    language: 'Greek',
    traditional: 'soul',
    corpus: 'life-breath, animating principle, consciousness',
    occurrences: 956,
    insight: 'Started as visible breath leaving the body at death. Developed into complex theories of mind and spirit.',
    semanticDrift: [
      { era: 'archaic', meaning: 'breath of life, ghost', confidence: 0.9, color: '#D97706' },
      { era: 'classical', meaning: 'soul, mind, rational principle', confidence: 0.85, color: '#F59E0B' },
      { era: 'imperial', meaning: 'immortal soul, psyche', confidence: 0.8, color: '#DC2626' },
      { era: 'lateAntique', meaning: 'human spirit, divine spark', confidence: 0.75, color: '#7C3AED' }
    ]
  },
  'virtus': {
    transliteration: 'virtus',
    language: 'Latin',
    traditional: 'virtue',
    corpus: 'manliness, courage, excellence',
    occurrences: 634,
    insight: 'From vir (man) - originally meant specifically masculine courage. Later generalized to moral excellence.',
    semanticDrift: [
      { era: 'archaic', meaning: 'manliness, masculine courage', confidence: 0.95, color: '#D97706' },
      { era: 'classical', meaning: 'courage, valor, excellence', confidence: 0.9, color: '#F59E0B' },
      { era: 'imperial', meaning: 'moral virtue, character', confidence: 0.85, color: '#DC2626' },
      { era: 'lateAntique', meaning: 'Christian virtue, spiritual strength', confidence: 0.8, color: '#7C3AED' }
    ]
  },
  'φύσις': {
    transliteration: 'physis',
    language: 'Greek',
    traditional: 'nature',
    corpus: 'growth, natural development, essential character',
    occurrences: 721,
    insight: 'From root meaning "to grow" - nature was originally the process of growth, not static essence.',
    semanticDrift: [
      { era: 'archaic', meaning: 'growth, emergence, becoming', confidence: 0.9, color: '#D97706' },
      { era: 'classical', meaning: 'natural character, essence', confidence: 0.85, color: '#F59E0B' },
      { era: 'imperial', meaning: 'nature as cosmic principle', confidence: 0.8, color: '#DC2626' },
      { era: 'lateAntique', meaning: 'created nature, divine order', confidence: 0.75, color: '#7C3AED' }
    ]
  }
}

export default function Semantia() {
  const [selectedWord, setSelectedWord] = useState<string | null>(null)

  const getLanguageIcon = (language: string) => {
    return language === 'Greek' ? 'Α' : 'L'
  }

  const getLanguageColor = (language: string) => {
    return language === 'Greek' ? '#3B82F6' : '#DC2626'
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0D0D0F', color: '#F5F4F2' }}>
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4">
            <span style={{ color: '#C9A227' }}>SEMANTIA</span>
          </h1>
          <p className="text-xl opacity-80">
            Tracking semantic evolution across classical antiquity
          </p>
          <p className="mt-2 opacity-60">
            How words changed meaning from archaic origins through late antiquity
          </p>
        </div>

        {/* Word Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {Object.entries(WORDS).map(([word, data]) => (
            <button
              key={word}
              onClick={() => setSelectedWord(selectedWord === word ? null : word)}
              className="p-6 rounded-lg border-2 transition-all duration-200 hover:scale-105 text-left"
              style={{ 
                backgroundColor: '#1A1A1D',
                borderColor: selectedWord === word ? '#C9A227' : '#333',
                borderWidth: selectedWord === word ? '2px' : '1px'
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl font-bold">{word}</span>
                <div className="flex items-center gap-2">
                  <span 
                    className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
                    style={{ backgroundColor: getLanguageColor(data.language) }}
                  >
                    {getLanguageIcon(data.language)}
                  </span>
                  <span className="text-sm opacity-60">{data.occurrences}</span>
                </div>
              </div>
              <div className="text-sm opacity-80 mb-2">{data.transliteration}</div>
              <div className="text-sm">
                <span className="opacity-60">Traditional: </span>
                <span>{data.traditional}</span>
              </div>
              <div className="text-sm mt-1">
                <span className="opacity-60">Corpus: </span>
                <span style={{ color: '#C9A227' }}>{data.corpus}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Detailed Analysis */}
        {selectedWord && WORDS[selectedWord as keyof typeof WORDS] && (
          <div className="p-8 rounded-lg" style={{ backgroundColor: '#1A1A1D' }}>
            <div className="mb-6">
              <div className="flex items-center gap-4 mb-4">
                <h2 className="text-3xl font-bold">{selectedWord}</h2>
                <span className="text-lg opacity-80">
                  {WORDS[selectedWord as keyof typeof WORDS].transliteration}
                </span>
                <span 
                  className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-white"
                  style={{ backgroundColor: getLanguageColor(WORDS[selectedWord as keyof typeof WORDS].language) }}
                >
                  {getLanguageIcon(WORDS[selectedWord as keyof typeof WORDS].language)}
                </span>
              </div>
              
              <div className="p-4 rounded" style={{ backgroundColor: '#0D0D0F' }}>
                <p className="text-lg italic" style={{ color: '#C9A227' }}>
                  {WORDS[selectedWord as keyof typeof WORDS].insight}
                </p>
              </div>
            </div>

            {/* Semantic Evolution Timeline */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold mb-4">Semantic Evolution</h3>
              
              {WORDS[selectedWord as keyof typeof WORDS].semanticDrift.map((stage, index) => (
                <div key={stage.era} className="flex items-center gap-6">
                  {/* Era Label */}
                  <div 
                    className="px-3 py-2 rounded font-semibold text-white min-w-[120px] text-center"
                    style={{ backgroundColor: stage.color }}
                  >
                    {stage.era.charAt(0).toUpperCase() + stage.era.slice(1)}
                  </div>
                  
                  {/* Meaning */}
                  <div className="flex-1">
                    <div className="text-lg mb-2">{stage.meaning}</div>
                    
                    {/* Confidence Bar */}
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full transition-all duration-500"
                        style={{ 
                          width: `${stage.confidence * 100}%`,
                          backgroundColor: stage.color
                        }}
                      />
                    </div>
                    <div className="text-sm opacity-60 mt-1">
                      Confidence: {Math.round(stage.confidence * 100)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary Stats */}
            <div className="mt-8 pt-6 border-t border-gray-600">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold" style={{ color: '#C9A227' }}>
                    {WORDS[selectedWord as keyof typeof WORDS].occurrences}
                  </div>
                  <div className="text-sm opacity-60">Total Occurrences</div>
                </div>
                <div>
                  <div className="text-2xl font-bold" style={{ color: '#C9A227' }}>
                    {WORDS[selectedWord as keyof typeof WORDS].semanticDrift.length}
                  </div>
                  <div className="text-sm opacity-60">Semantic Stages</div>
                </div>
                <div>
                  <div className="text-2xl font-bold" style={{ color: '#C9A227' }}>
                    {Math.round(WORDS[selectedWord as keyof typeof WORDS].semanticDrift.reduce((sum, stage) => sum + stage.confidence, 0) / WORDS[selectedWord as keyof typeof WORDS].semanticDrift.length * 100)}%
                  </div>
                  <div className="text-sm opacity-60">Avg Confidence</div>
                </div>
                <div>
                  <div className="text-2xl font-bold" style={{ color: getLanguageColor(WORDS[selectedWord as keyof typeof WORDS].language) }}>
                    {WORDS[selectedWord as keyof typeof WORDS].language}
                  </div>
                  <div className="text-sm opacity-60">Language</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}