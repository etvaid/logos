'use client'

import { useState } from 'react'
import Link from 'next/link'

const API_BASE = 'https://logos-production-ef2b.up.railway.app'

export default function TranslatePage() {
  const [text, setText] = useState('')
  const [language, setLanguage] = useState<'grc' | 'lat'>('grc')
  const [style, setStyle] = useState<'literal' | 'literary' | 'student'>('literary')
  const [translation, setTranslation] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const handleTranslate = async () => {
    if (!text.trim()) return
    setLoading(true)
    
    try {
      const response = await fetch(`${API_BASE}/api/translate/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, language, style, include_notes: true })
      })
      const data = await response.json()
      setTranslation(data)
    } catch (err) {
      setTranslation({ translation: 'Translation failed. Please try again.', error: true })
    } finally {
      setLoading(false)
    }
  }

  const sampleTexts = {
    grc: [
      { text: 'μῆνιν ἄειδε θεὰ Πηληϊάδεω Ἀχιλῆος', source: 'Homer, Iliad 1.1' },
      { text: 'γνῶθι σεαυτόν', source: 'Delphic Maxim' },
      { text: 'ἓν οἶδα ὅτι οὐδὲν οἶδα', source: 'Socrates' },
    ],
    lat: [
      { text: 'Arma virumque cano, Troiae qui primus ab oris', source: 'Virgil, Aeneid 1.1' },
      { text: 'Veni, vidi, vici', source: 'Julius Caesar' },
      { text: 'Carpe diem, quam minimum credula postero', source: 'Horace' },
    ]
  }

  return (
    <main className="min-h-screen bg-obsidian">
      <nav className="glass border-b border-gold/10 px-6 py-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="font-serif text-2xl font-bold text-gold tracking-widest">LOGOS</Link>
          <div className="flex items-center gap-8">
            <Link href="/search" className="text-marble/70 hover:text-gold transition-colors">Search</Link>
            <Link href="/translate" className="text-gold">Translate</Link>
            <Link href="/discover" className="text-marble/70 hover:text-gold transition-colors">Discover</Link>
            <Link href="/research" className="text-marble/70 hover:text-gold transition-colors">Research</Link>
            <Link href="/learn" className="text-marble/70 hover:text-gold transition-colors">Learn</Link>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="font-serif text-4xl text-gold mb-4">AI Translation</h1>
          <p className="text-marble/60">Three styles: Literal, Literary, Student-friendly</p>
        </div>

        {/* Language & Style Selection */}
        <div className="flex gap-4 mb-6 justify-center flex-wrap">
          <div className="flex gap-2">
            <button
              onClick={() => setLanguage('grc')}
              className={`px-4 py-2 rounded-lg transition-colors ${language === 'grc' ? 'bg-gold text-obsidian' : 'bg-obsidian-light text-marble/70 hover:text-gold'}`}
            >
              Greek
            </button>
            <button
              onClick={() => setLanguage('lat')}
              className={`px-4 py-2 rounded-lg transition-colors ${language === 'lat' ? 'bg-gold text-obsidian' : 'bg-obsidian-light text-marble/70 hover:text-gold'}`}
            >
              Latin
            </button>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setStyle('literal')}
              className={`px-4 py-2 rounded-lg transition-colors ${style === 'literal' ? 'bg-gold text-obsidian' : 'bg-obsidian-light text-marble/70 hover:text-gold'}`}
            >
              📖 Literal
            </button>
            <button
              onClick={() => setStyle('literary')}
              className={`px-4 py-2 rounded-lg transition-colors ${style === 'literary' ? 'bg-gold text-obsidian' : 'bg-obsidian-light text-marble/70 hover:text-gold'}`}
            >
              ✨ Literary
            </button>
            <button
              onClick={() => setStyle('student')}
              className={`px-4 py-2 rounded-lg transition-colors ${style === 'student' ? 'bg-gold text-obsidian' : 'bg-obsidian-light text-marble/70 hover:text-gold'}`}
            >
              🎓 Student
            </button>
          </div>
        </div>

        {/* Text Input */}
        <div className="glass rounded-xl p-6 mb-6">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={language === 'grc' ? 'Enter Greek text...' : 'Enter Latin text...'}
            className="w-full bg-transparent border-none text-marble text-lg placeholder-marble/30 focus:outline-none resize-none min-h-[150px] font-greek"
          />
          <div className="flex justify-between items-center mt-4 pt-4 border-t border-gold/10">
            <span className="text-marble/50 text-sm">{text.length} characters</span>
            <button
              onClick={handleTranslate}
              disabled={loading || !text.trim()}
              className="px-6 py-2 bg-gold text-obsidian rounded-lg font-medium hover:bg-gold-light transition-colors disabled:opacity-50"
            >
              {loading ? 'Translating...' : 'Translate'}
            </button>
          </div>
        </div>

        {/* Sample Texts */}
        <div className="mb-8">
          <p className="text-marble/50 text-sm mb-3">Try a sample:</p>
          <div className="flex flex-wrap gap-2">
            {sampleTexts[language].map((sample, i) => (
              <button
                key={i}
                onClick={() => setText(sample.text)}
                className="px-3 py-2 bg-obsidian-light border border-gold/10 rounded-lg text-marble/70 hover:text-gold hover:border-gold/30 transition-colors text-sm"
              >
                {sample.source}
              </button>
            ))}
          </div>
        </div>

        {/* Translation Result */}
        {translation && (
          <div className="glass rounded-xl p-6 space-y-6">
            <div>
              <span className="text-gold/70 text-sm uppercase tracking-wide">{translation.style || style} Translation</span>
              <p className="text-marble text-xl mt-2 leading-relaxed">{translation.translation}</p>
            </div>

            {translation.notes && Object.keys(translation.notes).length > 0 && (
              <div className="bg-obsidian-light rounded-lg p-4">
                <span className="text-gold/70 text-sm">Notes</span>
                <div className="mt-2 space-y-2">
                  {Object.entries(translation.notes).map(([key, value]) => (
                    <div key={key}>
                      <span className="text-marble/50 text-sm capitalize">{key}:</span>
                      <p className="text-marble/80 text-sm">
                        {Array.isArray(value) ? value.join(', ') : typeof value === 'object' ? JSON.stringify(value) : String(value)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-4 pt-4 border-t border-gold/10">
              <button className="text-gold/70 hover:text-gold text-sm">📋 Copy</button>
              <button className="text-gold/70 hover:text-gold text-sm">📤 Share</button>
              <button className="text-gold/70 hover:text-gold text-sm">🔊 Pronounce</button>
            </div>
          </div>
        )}

        {/* Style Descriptions */}
        <div className="grid md:grid-cols-3 gap-6 mt-12">
          <div className="glass rounded-xl p-6">
            <span className="text-2xl mb-3 block">📖</span>
            <h3 className="font-serif text-lg text-gold mb-2">Literal</h3>
            <p className="text-marble/60 text-sm">Word-for-word translation preserving original structure. Best for grammar study and parsing practice.</p>
          </div>
          <div className="glass rounded-xl p-6">
            <span className="text-2xl mb-3 block">✨</span>
            <h3 className="font-serif text-lg text-gold mb-2">Literary</h3>
            <p className="text-marble/60 text-sm">Elegant translation capturing style and meaning. Best for reading pleasure and appreciating literary quality.</p>
          </div>
          <div className="glass rounded-xl p-6">
            <span className="text-2xl mb-3 block">🎓</span>
            <h3 className="font-serif text-lg text-gold mb-2">Student</h3>
            <p className="text-marble/60 text-sm">Learning-focused with explanations. Best for beginners, classroom use, and vocabulary building.</p>
          </div>
        </div>
      </div>
    </main>
  )
}
