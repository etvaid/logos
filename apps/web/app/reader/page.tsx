'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

const API_BASE = 'https://logos-production-ef2b.up.railway.app'

export default function ReaderPage() {
  const searchParams = useSearchParams()
  const urnParam = searchParams.get('urn')
  
  const [urn, setUrn] = useState(urnParam || '')
  const [text, setText] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [selectedWord, setSelectedWord] = useState<any>(null)
  const [intertexts, setIntertexts] = useState<any[]>([])
  const [showIntertexts, setShowIntertexts] = useState(false)

  useEffect(() => {
    if (urnParam) {
      fetchText(urnParam)
    }
  }, [urnParam])

  const fetchText = async (textUrn: string) => {
    setLoading(true)
    try {
      const response = await fetch(`${API_BASE}/api/texts/${encodeURIComponent(textUrn)}`)
      const data = await response.json()
      setText(data)
      
      // Also fetch intertexts
      const interResponse = await fetch(`${API_BASE}/api/intertexts/${encodeURIComponent(textUrn)}`)
      const interData = await interResponse.json()
      setIntertexts(interData.intertexts || [])
    } catch (err) {
      setText(null)
    } finally {
      setLoading(false)
    }
  }

  const handleWordClick = async (word: string, lang: string) => {
    try {
      const response = await fetch(`${API_BASE}/api/parse/${encodeURIComponent(word)}?lang=${lang}`)
      const data = await response.json()
      setSelectedWord(data)
    } catch (err) {
      setSelectedWord(null)
    }
  }

  const sampleTexts = [
    { urn: 'urn:cts:greekLit:tlg0012.tlg001.perseus-grc1:1.1-1.10', title: 'Iliad 1.1-10', author: 'Homer' },
    { urn: 'urn:cts:latinLit:phi0690.phi003.perseus-lat1:1.1-1.10', title: 'Aeneid 1.1-10', author: 'Virgil' },
    { urn: 'urn:cts:greekLit:tlg0059.tlg030.perseus-grc1:327a-328b', title: 'Republic 327a-328b', author: 'Plato' },
  ]

  return (
    <main className="min-h-screen bg-obsidian">
      <nav className="glass border-b border-gold/10 px-6 py-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="font-serif text-2xl font-bold text-gold tracking-widest">LOGOS</Link>
          <div className="flex items-center gap-8">
            <Link href="/search" className="text-marble/70 hover:text-gold transition-colors">Search</Link>
            <Link href="/translate" className="text-marble/70 hover:text-gold transition-colors">Translate</Link>
            <Link href="/discover" className="text-marble/70 hover:text-gold transition-colors">Discover</Link>
            <Link href="/research" className="text-marble/70 hover:text-gold transition-colors">Research</Link>
            <Link href="/learn" className="text-marble/70 hover:text-gold transition-colors">Learn</Link>
          </div>
        </div>
      </nav>

      <div className="flex h-[calc(100vh-73px)]">
        {/* Sidebar */}
        <div className="w-80 glass border-r border-gold/10 p-6 overflow-y-auto">
          <h2 className="font-serif text-lg text-gold mb-4">Text Reader</h2>
          
          <div className="mb-6">
            <label className="text-marble/50 text-sm block mb-2">Enter URN</label>
            <input
              type="text"
              value={urn}
              onChange={(e) => setUrn(e.target.value)}
              placeholder="urn:cts:greekLit:..."
              className="w-full bg-obsidian-light border border-gold/20 rounded-lg px-3 py-2 text-marble text-sm placeholder-marble/30 focus:outline-none"
            />
            <button
              onClick={() => fetchText(urn)}
              disabled={!urn || loading}
              className="w-full mt-2 px-4 py-2 bg-gold text-obsidian rounded-lg font-medium hover:bg-gold-light transition-colors disabled:opacity-50 text-sm"
            >
              {loading ? 'Loading...' : 'Load Text'}
            </button>
          </div>

          <div className="mb-6">
            <p className="text-marble/50 text-sm mb-3">Sample Texts:</p>
            <div className="space-y-2">
              {sampleTexts.map((sample, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setUrn(sample.urn)
                    fetchText(sample.urn)
                  }}
                  className="w-full text-left px-3 py-2 bg-obsidian-light border border-gold/10 rounded-lg text-marble/70 hover:text-gold hover:border-gold/30 transition-colors text-sm"
                >
                  <span className="block font-medium">{sample.title}</span>
                  <span className="text-marble/40 text-xs">{sample.author}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Intertexts Panel */}
          {intertexts.length > 0 && (
            <div>
              <button
                onClick={() => setShowIntertexts(!showIntertexts)}
                className="flex justify-between items-center w-full text-left mb-3"
              >
                <span className="text-gold font-medium">Intertexts ({intertexts.length})</span>
                <span className="text-marble/50">{showIntertexts ? '▼' : '▶'}</span>
              </button>
              
              {showIntertexts && (
                <div className="space-y-3">
                  {intertexts.map((inter, i) => (
                    <div key={i} className="bg-obsidian-light rounded-lg p-3 border-l-2 border-gold/50">
                      <span className="text-xs px-2 py-0.5 bg-gold/20 text-gold rounded">{inter.relationship_type}</span>
                      <p className="text-marble/70 text-sm mt-2">{inter.target_translation}</p>
                      <p className="text-marble/40 text-xs mt-1">{inter.confidence * 100}% confidence</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8 overflow-y-auto">
          {loading && (
            <div className="text-center py-16 text-marble/50">Loading text...</div>
          )}

          {text && (
            <div>
              <div className="mb-6">
                <h1 className="font-serif text-2xl text-gold">{text.work || 'Text'}</h1>
                <p className="text-marble/50">{text.author} {text.section && `• ${text.section}`}</p>
              </div>

              <div className="glass rounded-xl p-8">
                <p className="font-greek text-2xl text-gold leading-loose">
                  {text.content?.split(' ').map((word: string, i: number) => (
                    <span
                      key={i}
                      onClick={() => handleWordClick(word.replace(/[,.;:]/g, ''), text.language)}
                      className="hover:bg-gold/20 px-1 rounded cursor-pointer transition-colors inline-block"
                    >
                      {word}{' '}
                    </span>
                  ))}
                </p>
              </div>
            </div>
          )}

          {!text && !loading && (
            <div className="text-center py-16">
              <span className="text-6xl mb-4 block">📜</span>
              <h2 className="font-serif text-2xl text-gold mb-2">Select a Text</h2>
              <p className="text-marble/50">Enter a CTS URN or choose from the samples on the left</p>
            </div>
          )}
        </div>

        {/* Word Panel */}
        {selectedWord && (
          <div className="w-80 glass border-l border-gold/10 p-6 overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <h2 className="font-serif text-2xl text-gold">{selectedWord.word}</h2>
              <button onClick={() => setSelectedWord(null)} className="text-marble/50 hover:text-marble">✕</button>
            </div>

            <div className="space-y-4">
              <div>
                <span className="text-marble/50 text-sm">Lemma</span>
                <p className="text-gold text-lg">{selectedWord.lemma}</p>
              </div>
              
              <div>
                <span className="text-marble/50 text-sm">Part of Speech</span>
                <p className="text-marble">{selectedWord.part_of_speech}</p>
              </div>
              
              <div>
                <span className="text-marble/50 text-sm">Definition</span>
                <p className="text-marble">{selectedWord.definition}</p>
              </div>

              {selectedWord.morphology && Object.keys(selectedWord.morphology).length > 0 && (
                <div>
                  <span className="text-marble/50 text-sm">Morphology</span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {Object.entries(selectedWord.morphology).map(([key, value]) => (
                      <span key={key} className="px-2 py-1 bg-obsidian-light rounded text-sm text-marble/70">
                        {key}: {String(value)}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-gold/10 space-y-2">
                <button className="w-full px-4 py-2 bg-obsidian-light text-gold rounded-lg text-sm hover:bg-gold/20 transition-colors">
                  🔊 Pronounce
                </button>
                <button className="w-full px-4 py-2 bg-obsidian-light text-gold rounded-lg text-sm hover:bg-gold/20 transition-colors">
                  📚 Add to Flashcards
                </button>
                <button className="w-full px-4 py-2 bg-obsidian-light text-gold rounded-lg text-sm hover:bg-gold/20 transition-colors">
                  🔍 Find in Corpus
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
