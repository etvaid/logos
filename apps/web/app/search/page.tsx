'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

const API_BASE = 'https://logos-production-ef2b.up.railway.app'

interface SearchResult {
  urn: string
  content: string
  translation_preview: string
  similarity: number
  author: string
  work: string
  language: string
  section?: string
}

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedLanguage, setSelectedLanguage] = useState<string>('')
  const [selectedAuthor, setSelectedAuthor] = useState<string>('')
  const [trending, setTrending] = useState<Array<{ query: string; searches: number }>>([])
  const [selectedResult, setSelectedResult] = useState<SearchResult | null>(null)
  const [translation, setTranslation] = useState<{ translation: string; style: string; notes?: any } | null>(null)
  const [translating, setTranslating] = useState(false)
  const [parseResult, setParseResult] = useState<any | null>(null)

  useEffect(() => {
    fetch(`${API_BASE}/api/search/trending`)
      .then(res => res.json())
      .then(data => setTrending(data.trending || []))
      .catch(() => {})
  }, [])

  const handleSearch = async (searchQuery?: string) => {
    const q = searchQuery || query
    if (!q.trim()) return

    setLoading(true)
    setError(null)
    setSelectedResult(null)
    setTranslation(null)

    try {
      const params = new URLSearchParams({ q })
      if (selectedLanguage) params.append('lang', selectedLanguage)
      if (selectedAuthor) params.append('author', selectedAuthor)

      const response = await fetch(`${API_BASE}/api/search/?${params}`)
      const data = await response.json()
      setResults(data.results || [])
    } catch (err) {
      setError('Search failed. Please try again.')
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  const handleTranslate = async (result: SearchResult, style: 'literal' | 'literary' | 'student') => {
    setSelectedResult(result)
    setTranslating(true)
    setTranslation(null)

    try {
      const response = await fetch(`${API_BASE}/api/translate/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: result.content,
          language: result.language,
          style,
          include_notes: true
        })
      })
      const data = await response.json()
      setTranslation(data)
    } catch (err) {
      setTranslation({ translation: 'Translation failed', style, notes: null })
    } finally {
      setTranslating(false)
    }
  }

  const handleWordClick = async (word: string, lang: string) => {
    try {
      const response = await fetch(`${API_BASE}/api/parse/${encodeURIComponent(word)}?lang=${lang}`)
      const data = await response.json()
      setParseResult(data)
    } catch (err) {
      setParseResult(null)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleSearch()
  }

  return (
    <main className="min-h-screen bg-obsidian">
      <nav className="glass border-b border-gold/10 px-6 py-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="font-serif text-2xl font-bold text-gold tracking-widest">LOGOS</Link>
          <div className="flex items-center gap-8">
            <Link href="/search" className="text-gold">Search</Link>
            <Link href="/translate" className="text-marble/70 hover:text-gold transition-colors">Translate</Link>
            <Link href="/discover" className="text-marble/70 hover:text-gold transition-colors">Discover</Link>
            <Link href="/research" className="text-marble/70 hover:text-gold transition-colors">Research</Link>
            <Link href="/learn" className="text-marble/70 hover:text-gold transition-colors">Learn</Link>
            <Link href="/admin" className="text-marble/70 hover:text-gold transition-colors">Admin</Link>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="font-serif text-4xl text-gold mb-4">Semantic Search</h1>
          <p className="text-marble/60">Search 69M+ words of Greek & Latin by meaning</p>
        </div>

        <form onSubmit={handleSubmit} className="mb-8">
          <div className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search: 'What is justice?' or 'immortality of the soul'"
              className="w-full bg-obsidian-light border border-gold/20 rounded-xl px-6 py-4 text-lg text-marble placeholder-marble/30 focus:outline-none focus:border-gold/50 transition-colors pr-32"
            />
            <button
              type="submit"
              disabled={loading}
              className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2 bg-gold text-obsidian rounded-lg font-medium hover:bg-gold-light transition-colors disabled:opacity-50"
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>

          <div className="flex gap-4 mt-4 flex-wrap">
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="bg-obsidian-light border border-gold/20 rounded-lg px-4 py-2 text-marble/70 focus:outline-none"
            >
              <option value="">All Languages</option>
              <option value="grc">Greek</option>
              <option value="lat">Latin</option>
            </select>
            <select
              value={selectedAuthor}
              onChange={(e) => setSelectedAuthor(e.target.value)}
              className="bg-obsidian-light border border-gold/20 rounded-lg px-4 py-2 text-marble/70 focus:outline-none"
            >
              <option value="">All Authors</option>
              <option value="Homer">Homer</option>
              <option value="Virgil">Virgil</option>
              <option value="Plato">Plato</option>
              <option value="Aristotle">Aristotle</option>
              <option value="Cicero">Cicero</option>
            </select>
          </div>
        </form>

        {error && (
          <div className="mb-8 p-4 bg-crimson/20 border border-crimson/40 rounded-lg text-marble">{error}</div>
        )}

        {results.length > 0 && (
          <div className="space-y-6 mb-12">
            <p className="text-marble/50">{results.length} results found</p>
            {results.map((result, i) => (
              <div key={i} className="glass rounded-xl p-6 gold-glow">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className={`text-xs px-2 py-1 rounded ${result.language === 'grc' ? 'bg-blue-500/20 text-blue-400' : 'bg-amber/20 text-amber'}`}>
                      {result.language === 'grc' ? 'GREEK' : 'LATIN'}
                    </span>
                    <span className="text-marble/50 text-sm ml-2">{result.author} • {result.work}</span>
                  </div>
                  <span className="text-gold font-medium">{Math.round(result.similarity * 100)}%</span>
                </div>
                <p className="font-greek text-xl text-gold mb-2">
                  {result.content.split(' ').map((word, wi) => (
                    <span key={wi} className="hover:bg-gold/20 px-1 rounded cursor-pointer" onClick={() => handleWordClick(word, result.language)}>
                      {word}{' '}
                    </span>
                  ))}
                </p>
                <p className="text-marble/80">{result.translation_preview}</p>
                <div className="flex gap-4 mt-4 pt-4 border-t border-gold/10">
                  <button onClick={() => handleTranslate(result, 'literal')} className="text-gold/70 hover:text-gold text-sm">📖 Literal</button>
                  <button onClick={() => handleTranslate(result, 'literary')} className="text-gold/70 hover:text-gold text-sm">✨ Literary</button>
                  <button onClick={() => handleTranslate(result, 'student')} className="text-gold/70 hover:text-gold text-sm">🎓 Student</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {selectedResult && translation && (
          <div className="fixed bottom-0 left-0 right-0 glass border-t border-gold/20 p-6">
            <div className="max-w-6xl mx-auto">
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-serif text-xl text-gold">{translation.style} Translation</h3>
                <button onClick={() => { setSelectedResult(null); setTranslation(null) }} className="text-marble/50 hover:text-marble">✕</button>
              </div>
              <p className="text-marble text-lg">{translation.translation}</p>
            </div>
          </div>
        )}

        {parseResult && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={() => setParseResult(null)}>
            <div className="glass rounded-xl p-6 max-w-md w-full" onClick={e => e.stopPropagation()}>
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-serif text-2xl text-gold">{parseResult.word}</h3>
                <button onClick={() => setParseResult(null)} className="text-marble/50">✕</button>
              </div>
              <div className="space-y-3">
                <div><span className="text-marble/50 text-sm">Lemma</span><p className="text-gold">{parseResult.lemma}</p></div>
                <div><span className="text-marble/50 text-sm">Part of Speech</span><p className="text-marble">{parseResult.part_of_speech}</p></div>
                <div><span className="text-marble/50 text-sm">Definition</span><p className="text-marble">{parseResult.definition}</p></div>
              </div>
            </div>
          </div>
        )}

        {results.length === 0 && !loading && (
          <div className="text-center py-16">
            <p className="text-marble/50 mb-6">Try searching for concepts like:</p>
            <div className="flex flex-wrap justify-center gap-3">
              {['What is justice?', 'immortality of the soul', 'anger and war', 'love poetry'].map(s => (
                <button key={s} onClick={() => { setQuery(s); handleSearch(s) }} className="px-4 py-2 bg-obsidian-light border border-gold/20 rounded-lg text-marble/70 hover:text-gold hover:border-gold/40 transition-colors">
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
