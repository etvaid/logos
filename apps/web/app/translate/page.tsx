'use client'

import { useState } from 'react'

const PHRASES: Record<string, {translation: string, words: {word: string, meaning: string}[]}> = {
  "μῆνιν ἄειδε θεὰ": {translation: "Sing, goddess, of the wrath", words: [{word:"μῆνιν",meaning:"wrath"},{word:"ἄειδε",meaning:"sing"},{word:"θεὰ",meaning:"goddess"}]},
  "arma virumque cano": {translation: "I sing of arms and the man", words: [{word:"arma",meaning:"arms"},{word:"virumque",meaning:"man"},{word:"cano",meaning:"I sing"}]},
  "carpe diem": {translation: "Seize the day", words: [{word:"carpe",meaning:"seize"},{word:"diem",meaning:"day"}]},
  "veni vidi vici": {translation: "I came, I saw, I conquered", words: [{word:"veni",meaning:"I came"},{word:"vidi",meaning:"I saw"},{word:"vici",meaning:"I conquered"}]},
  "cogito ergo sum": {translation: "I think, therefore I am", words: [{word:"cogito",meaning:"I think"},{word:"ergo",meaning:"therefore"},{word:"sum",meaning:"I am"}]},
  "γνῶθι σεαυτόν": {translation: "Know thyself", words: [{word:"γνῶθι",meaning:"know"},{word:"σεαυτόν",meaning:"thyself"}]},
  "memento mori": {translation: "Remember you will die", words: [{word:"memento",meaning:"remember"},{word:"mori",meaning:"to die"}]},
};

const PHRASES_LOWERCASE = Object.fromEntries(
  Object.entries(PHRASES).map(([key, value]) => [key.toLowerCase(), value])
);

export default function TranslatePage() {
  const [input, setInput] = useState('')
  const [result, setResult] = useState<{translation: string, words: {word: string, meaning: string}[]} | null>(null)
  const [error, setError] = useState('')

  const handleTranslate = () => {
    const trimmedInput = input.toLowerCase().trim()
    const match = PHRASES_LOWERCASE[trimmedInput]
    
    if (match) {
      setResult(match)
      setError('')
    } else {
      setResult(null)
      setError('Translation not found')
    }
  }

  const handleExample = (phrase: string) => {
    setInput(phrase)
    setResult(null)
    setError('')
  }

  const isGreek = (text: string) => /[\u0370-\u03FF]/.test(text)

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0D0D0F', color: '#F5F4F2' }}>
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4" style={{ color: '#C9A227' }}>
            Classical Translation Tool
          </h1>
          <p className="text-xl opacity-80">
            Translate ancient Greek and Latin phrases
          </p>
        </div>

        {/* Input Section */}
        <div className="mb-8">
          <label className="block text-lg font-semibold mb-3">
            Enter text to translate:
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full h-32 p-4 rounded-lg text-lg font-mono resize-none focus:outline-none focus:ring-2"
            style={{ 
              backgroundColor: '#1E1E24', 
              color: '#F5F4F2',
              focusRingColor: '#C9A227'
            }}
            placeholder="Type or paste your classical text here..."
          />
          
          <button
            onClick={handleTranslate}
            className="mt-4 px-8 py-3 rounded-lg font-semibold text-lg transition-all hover:opacity-90"
            style={{ backgroundColor: '#C9A227', color: '#0D0D0F' }}
          >
            Translate
          </button>
        </div>

        {/* Example Phrases */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4" style={{ color: '#C9A227' }}>
            Try These Examples:
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.keys(PHRASES).map((phrase) => (
              <button
                key={phrase}
                onClick={() => handleExample(phrase)}
                className="p-4 rounded-lg text-left transition-all hover:opacity-80 border"
                style={{ 
                  backgroundColor: '#1E1E24',
                  borderColor: isGreek(phrase) ? '#3B82F6' : '#DC2626'
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span 
                    className="px-2 py-1 rounded text-sm font-bold"
                    style={{ 
                      backgroundColor: isGreek(phrase) ? '#3B82F6' : '#DC2626',
                      color: '#F5F4F2'
                    }}
                  >
                    {isGreek(phrase) ? 'Α' : 'L'}
                  </span>
                </div>
                <div className="font-mono text-lg mb-2">{phrase}</div>
                <div className="text-sm opacity-70">{PHRASES[phrase].translation}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Results Section */}
        {(result || error) && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4" style={{ color: '#C9A227' }}>
              Translation Result:
            </h2>
            
            {error && (
              <div 
                className="p-6 rounded-lg border-l-4"
                style={{ 
                  backgroundColor: '#1E1E24',
                  borderLeftColor: '#DC2626'
                }}
              >
                <p className="text-lg" style={{ color: '#DC2626' }}>{error}</p>
              </div>
            )}

            {result && (
              <div>
                {/* Translation */}
                <div 
                  className="p-6 rounded-lg mb-6"
                  style={{ backgroundColor: '#1E1E24' }}
                >
                  <h3 className="text-lg font-semibold mb-2 opacity-80">Translation:</h3>
                  <p className="text-2xl font-serif italic" style={{ color: '#C9A227' }}>
                    "{result.translation}"
                  </p>
                </div>

                {/* Word Breakdown */}
                <div>
                  <h3 className="text-xl font-bold mb-4">Word-by-Word Analysis:</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {result.words.map((word, index) => (
                      <div
                        key={index}
                        className="p-4 rounded-lg border"
                        style={{ 
                          backgroundColor: '#1E1E24',
                          borderColor: '#C9A227'
                        }}
                      >
                        <div className="font-mono text-lg font-bold mb-2" style={{ color: '#C9A227' }}>
                          {word.word}
                        </div>
                        <div className="text-base opacity-90">
                          {word.meaning}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Instructions */}
        <div 
          className="p-6 rounded-lg"
          style={{ backgroundColor: '#1E1E24' }}
        >
          <h3 className="text-lg font-semibold mb-3" style={{ color: '#C9A227' }}>
            How to Use:
          </h3>
          <ul className="space-y-2 opacity-80">
            <li>• Type or paste classical Greek or Latin text in the input field</li>
            <li>• Click "Translate" to see the English translation</li>
            <li>• Use the example buttons to quickly try famous phrases</li>
            <li>• View word-by-word breakdowns to understand grammar</li>
            <li>• Greek phrases are marked with Α, Latin phrases with L</li>
          </ul>
        </div>
      </div>
    </div>
  )
}