'use client'

import { useState } from 'react'

const TRANSLATIONS = {
  "μῆνιν ἄειδε θεὰ": "Sing, goddess, of the wrath",
  "arma virumque cano": "I sing of arms and the man",
  "cogito ergo sum": "I think therefore I am",
  "γνῶθι σεαυτόν": "Know thyself",
  "carpe diem": "Seize the day",
  "veni vidi vici": "I came, I saw, I conquered",
  "ἀγαθός": "good",
  "virtus": "virtue",
}

const EXAMPLE_TEXTS = [
  "μῆνιν ἄειδε θεὰ",
  "arma virumque cano",
  "cogito ergo sum",
  "γνῶθι σεαυτόν",
  "carpe diem",
  "veni vidi vici",
  "ἀγαθός",
  "virtus"
]

export default function TranslationPage() {
  const [inputText, setInputText] = useState('')
  const [outputText, setOutputText] = useState('')
  const [style, setStyle] = useState('literal')

  const handleTranslate = () => {
    const cleanInput = inputText.trim()
    const translation = TRANSLATIONS[cleanInput as keyof typeof TRANSLATIONS]
    
    if (translation) {
      let result = translation
      
      if (style === 'literary') {
        result = `${translation} (literary interpretation)`
      } else if (style === 'student') {
        result = `${translation} (word-for-word)`
      }
      
      setOutputText(result)
    } else {
      setOutputText('Translation not found in demo database. Try one of the examples.')
    }
  }

  const handleExample = (text: string) => {
    setInputText(text)
    setOutputText('')
  }

  return (
    <div className="min-h-screen bg-[#0D0D0F] text-[#F5F4F2] p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-[#C9A227]">Translation Tool</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Input Section */}
          <div className="bg-[#1E1E24] rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Original Text</h2>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Enter Greek or Latin text..."
              className="w-full h-64 bg-[#0D0D0F] border border-gray-600 rounded-lg p-4 text-[#F5F4F2] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#C9A227] resize-none"
            />
          </div>

          {/* Output Section */}
          <div className="bg-[#1E1E24] rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Translation</h2>
            <div className="w-full h-64 bg-[#0D0D0F] border border-gray-600 rounded-lg p-4 text-[#F5F4F2] overflow-y-auto">
              {outputText || <span className="text-gray-400">Translation will appear here...</span>}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-[#1E1E24] rounded-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
            {/* Style Selector */}
            <div className="flex-1">
              <label className="block text-sm font-medium mb-2">Translation Style</label>
              <select
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                className="bg-[#0D0D0F] border border-gray-600 rounded-lg px-4 py-2 text-[#F5F4F2] focus:outline-none focus:ring-2 focus:ring-[#C9A227]"
              >
                <option value="literal">Literal</option>
                <option value="literary">Literary</option>
                <option value="student">Student</option>
              </select>
            </div>

            {/* Translate Button */}
            <button
              onClick={handleTranslate}
              className="bg-[#C9A227] hover:bg-[#B8911F] text-[#0D0D0F] font-semibold px-8 py-2 rounded-lg transition-colors"
            >
              Translate
            </button>
          </div>
        </div>

        {/* Examples */}
        <div className="bg-[#1E1E24] rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Example Texts</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {EXAMPLE_TEXTS.map((text, index) => (
              <button
                key={index}
                onClick={() => handleExample(text)}
                className="bg-[#0D0D0F] hover:bg-gray-800 border border-gray-600 rounded-lg p-3 text-left text-sm transition-colors"
              >
                <div className="font-medium text-[#C9A227]">
                  {text.match(/[α-ωΑ-Ω]/) ? 'Greek' : 'Latin'}
                </div>
                <div className="text-[#F5F4F2] mt-1 truncate">
                  {text}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}