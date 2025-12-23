'use client'

import { useState } from 'react'

const TRANSLATIONS = {
  "veni vidi vici": {
    translation: "I came, I saw, I conquered",
    language: "Latin",
    breakdown: [
      { word: "veni", meaning: "I came" },
      { word: "vidi", meaning: "I saw" },
      { word: "vici", meaning: "I conquered" }
    ]
  },
  "carpe diem": {
    translation: "Seize the day",
    language: "Latin",
    breakdown: [
      { word: "carpe", meaning: "seize" },
      { word: "diem", meaning: "day" }
    ]
  },
  "alea iacta est": {
    translation: "The die is cast",
    language: "Latin",
    breakdown: [
      { word: "alea", meaning: "die/dice" },
      { word: "iacta", meaning: "cast" },
      { word: "est", meaning: "is" }
    ]
  },
  "cogito ergo sum": {
    translation: "I think therefore I am",
    language: "Latin",
    breakdown: [
      { word: "cogito", meaning: "I think" },
      { word: "ergo", meaning: "therefore" },
      { word: "sum", meaning: "I am" }
    ]
  },
  "memento mori": {
    translation: "Remember you must die",
    language: "Latin",
    breakdown: [
      { word: "memento", meaning: "remember" },
      { word: "mori", meaning: "to die" }
    ]
  },
  "γνῶθι σεαυτόν": {
    translation: "Know thyself",
    language: "Greek",
    breakdown: [
      { word: "γνῶθι", meaning: "know" },
      { word: "σεαυτόν", meaning: "thyself" }
    ]
  },
  "εὖ πράττειν": {
    translation: "To fare well",
    language: "Greek",
    breakdown: [
      { word: "εὖ", meaning: "well" },
      { word: "πράττειν", meaning: "to do/fare" }
    ]
  },
  "καὶ σὺ τέκνον": {
    translation: "And you, my child",
    language: "Greek",
    breakdown: [
      { word: "καὶ", meaning: "and" },
      { word: "σὺ", meaning: "you" },
      { word: "τέκνον", meaning: "child" }
    ]
  },
  "tempus fugit": {
    translation: "Time flies",
    language: "Latin",
    breakdown: [
      { word: "tempus", meaning: "time" },
      { word: "fugit", meaning: "flies" }
    ]
  },
  "e pluribus unum": {
    translation: "Out of many, one",
    language: "Latin",
    breakdown: [
      { word: "e", meaning: "out of" },
      { word: "pluribus", meaning: "many" },
      { word: "unum", meaning: "one" }
    ]
  }
}

const WORDS = {
  // Latin words
  "amor": "love",
  "aqua": "water",
  "vita": "life",
  "mors": "death",
  "homo": "man/human",
  "deus": "god",
  "rex": "king",
  "pax": "peace",
  "bellum": "war",
  "terra": "earth/land",
  "caelum": "sky/heaven",
  "sol": "sun",
  "luna": "moon",
  "ignis": "fire",
  "mare": "sea",
  // Greek words
  "θεός": "god",
  "ἄνθρωπος": "human",
  "λόγος": "word/reason",
  "φιλία": "friendship",
  "σοφία": "wisdom",
  "καλός": "beautiful/good",
  "ἀγαθός": "good",
  "κακός": "bad/evil",
  "μέγας": "great/large",
  "μικρός": "small",
  "νῦν": "now",
  "τότε": "then",
  "ἐγώ": "I",
  "σύ": "you",
  "οὗτος": "this"
}

export default function TranslatePage() {
  const [input, setInput] = useState('')
  const [result, setResult] = useState(null)
  const [breakdown, setBreakdown] = useState([])

  const handleTranslate = () => {
    const cleanInput = input.trim().toLowerCase()
    
    // Check for exact phrase match
    const exactMatch = TRANSLATIONS[cleanInput]
    if (exactMatch) {
      setResult({
        translation: exactMatch.translation,
        language: exactMatch.language,
        type: 'phrase'
      })
      setBreakdown(exactMatch.breakdown)
      return
    }

    // Word-by-word translation
    const words = cleanInput.split(/\s+/)
    const wordBreakdown = words.map(word => {
      const cleanWord = word.replace(/[.,;:!?]/g, '')
      const translation = WORDS[cleanWord]
      return {
        word: cleanWord,
        meaning: translation || '(unknown)'
      }
    })

    const hasTranslations = wordBreakdown.some(w => w.meaning !== '(unknown)')
    
    if (hasTranslations) {
      setResult({
        translation: wordBreakdown.map(w => w.meaning).join(' '),
        language: 'Mixed',
        type: 'words'
      })
      setBreakdown(wordBreakdown)
    } else {
      setResult({
        translation: 'Translation not found',
        language: 'Unknown',
        type: 'none'
      })
      setBreakdown([])
    }
  }

  const handleExampleClick = (phrase) => {
    setInput(phrase)
    setResult(null)
    setBreakdown([])
  }

  const getLanguageColor = (lang) => {
    if (lang === 'Greek') return '#3B82F6'
    if (lang === 'Latin') return '#DC2626'
    return '#F5F4F2'
  }

  const getLanguageIcon = (lang) => {
    if (lang === 'Greek') return 'Α'
    if (lang === 'Latin') return 'L'
    return '?'
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0D0D0F', color: '#F5F4F2' }}>
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4" style={{ color: '#C9A227' }}>
            LOGOS Translation
          </h1>
          <p className="text-lg opacity-90">
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
            className="w-full h-32 p-4 rounded-lg border-2 text-lg"
            style={{
              backgroundColor: '#1A1A1C',
              borderColor: '#333',
              color: '#F5F4F2'
            }}
            placeholder="Type your Greek or Latin text here..."
          />
          <button
            onClick={handleTranslate}
            disabled={!input.trim()}
            className="mt-4 px-8 py-3 rounded-lg font-semibold text-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
            style={{
              backgroundColor: '#C9A227',
              color: '#0D0D0F'
            }}
          >
            Translate
          </button>
        </div>

        {/* Example Phrases */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4" style={{ color: '#C9A227' }}>
            Try these examples:
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {Object.keys(TRANSLATIONS).map((phrase, index) => (
              <button
                key={index}
                onClick={() => handleExampleClick(phrase)}
                className="p-3 rounded-lg border-2 text-left transition-all duration-200 hover:scale-105"
                style={{
                  backgroundColor: '#1A1A1C',
                  borderColor: '#333',
                  color: getLanguageColor(TRANSLATIONS[phrase].language)
                }}
              >
                <div className="flex items-center gap-2">
                  <span
                    className="w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold"
                    style={{
                      backgroundColor: getLanguageColor(TRANSLATIONS[phrase].language),
                      color: '#0D0D0F'
                    }}
                  >
                    {getLanguageIcon(TRANSLATIONS[phrase].language)}
                  </span>
                  <span className="font-medium">{phrase}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Translation Result */}
        {result && (
          <div className="mb-8">
            <div 
              className="p-6 rounded-lg border-2"
              style={{
                backgroundColor: '#1A1A1C',
                borderColor: '#333'
              }}
            >
              <div className="flex items-center gap-3 mb-4">
                <span
                  className="w-8 h-8 rounded-full flex items-center justify-center font-bold"
                  style={{
                    backgroundColor: getLanguageColor(result.language),
                    color: '#0D0D0F'
                  }}
                >
                  {getLanguageIcon(result.language)}
                </span>
                <span className="text-lg font-semibold">{result.language}</span>
              </div>
              
              <div className="text-2xl font-bold mb-2" style={{ color: '#C9A227' }}>
                {result.translation}
              </div>
              
              <div className="text-sm opacity-70">
                {result.type === 'phrase' ? 'Complete phrase translation' : 
                 result.type === 'words' ? 'Word-by-word translation' : 
                 'No translation available'}
              </div>
            </div>
          </div>
        )}

        {/* Word Breakdown */}
        {breakdown.length > 0 && (
          <div>
            <h3 className="text-xl font-bold mb-4" style={{ color: '#C9A227' }}>
              Word Breakdown:
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {breakdown.map((item, index) => (
                <div
                  key={index}
                  className="p-4 rounded-lg border-2"
                  style={{
                    backgroundColor: '#1A1A1C',
                    borderColor: '#333'
                  }}
                >
                  <div className="font-bold text-lg mb-1" style={{ color: '#C9A227' }}>
                    {item.word}
                  </div>
                  <div className="opacity-90">
                    {item.meaning}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}