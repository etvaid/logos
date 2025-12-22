'use client'

import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

const API_BASE = 'https://logos-production-ef2b.up.railway.app'

function ReaderContent() {
  const searchParams = useSearchParams()
  const urnParam = searchParams.get('urn')
  
  const [urn, setUrn] = useState(urnParam || '')
  const [text, setText] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [selectedWord, setSelectedWord] = useState<any>(null)

  useEffect(() => {
    if (urnParam) fetchText(urnParam)
  }, [urnParam])

  const fetchText = async (textUrn: string) => {
    setLoading(true)
    try {
      const response = await fetch(`${API_BASE}/api/texts/${encodeURIComponent(textUrn)}`)
      const data = await response.json()
      setText(data)
    } catch (err) {
      setText(null)
    } finally {
      setLoading(false)
    }
  }

  const sampleTexts = [
    { urn: 'urn:cts:greekLit:tlg0012.tlg001:1.1-1.10', title: 'Iliad 1.1-10', author: 'Homer' },
    { urn: 'urn:cts:latinLit:phi0690.phi003:1.1-1.10', title: 'Aeneid 1.1-10', author: 'Virgil' },
  ]

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="text-center mb-12">
        <h1 className="font-serif text-4xl text-gold mb-4">Text Reader</h1>
        <p className="text-marble/60">Read Greek and Latin texts with click-to-parse</p>
      </div>

      <div className="glass rounded-xl p-6 mb-8">
        <div className="flex gap-4">
          <input
            type="text"
            value={urn}
            onChange={(e) => setUrn(e.target.value)}
            placeholder="Enter CTS URN..."
            className="flex-1 bg-obsidian-light border border-gold/20 rounded-lg px-4 py-3 text-marble placeholder-marble/30 focus:outline-none"
          />
          <button
            onClick={() => fetchText(urn)}
            disabled={!urn || loading}
            className="px-6 py-3 bg-gold text-obsidian rounded-lg font-medium hover:bg-gold-light disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'Load'}
          </button>
        </div>
        <div className="flex gap-2 mt-4">
          {sampleTexts.map((s, i) => (
            <button key={i} onClick={() => { setUrn(s.urn); fetchText(s.urn) }}
              className="px-3 py-1 bg-obsidian-light border border-gold/10 rounded text-marble/60 text-sm hover:text-gold">
              {s.title}
            </button>
          ))}
        </div>
      </div>

      {text && (
        <div className="glass rounded-xl p-8">
          <h2 className="font-serif text-xl text-gold mb-4">{text.work || 'Text'}</h2>
          <p className="font-greek text-2xl text-gold leading-loose">{text.content}</p>
        </div>
      )}

      {!text && !loading && (
        <div className="text-center py-16 text-marble/50">
          Select a sample text or enter a URN above
        </div>
      )}
    </div>
  )
}

export default function ReaderPage() {
  return (
    <main className="min-h-screen bg-obsidian">
      <nav className="glass border-b border-gold/10 px-6 py-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="font-serif text-2xl font-bold text-gold tracking-widest">LOGOS</Link>
          <div className="flex items-center gap-8">
            <Link href="/search" className="text-marble/70 hover:text-gold">Search</Link>
            <Link href="/translate" className="text-marble/70 hover:text-gold">Translate</Link>
            <Link href="/discover" className="text-marble/70 hover:text-gold">Discover</Link>
            <Link href="/learn" className="text-marble/70 hover:text-gold">Learn</Link>
          </div>
        </div>
      </nav>
      <Suspense fallback={<div className="text-center py-16 text-marble/50">Loading...</div>}>
        <ReaderContent />
      </Suspense>
    </main>
  )
}
