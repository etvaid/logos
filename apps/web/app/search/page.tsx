'use client'

import { useState } from 'react'
import Link from 'next/link'

const demoResults = [
  {
    urn: 'urn:cts:greekLit:tlg0059.tlg030.perseus-grc1:331c',
    content: 'δικαιοσύνη ἐστὶν ἀρετὴ ψυχῆς',
    translation: 'Justice is a virtue of the soul',
    author: 'Plato',
    work: 'Republic',
    section: 'Book 1, 331c',
    similarity: 0.94,
    language: 'grc'
  },
  {
    urn: 'urn:cts:latinLit:phi0474.phi057.perseus-lat1:1.7.23',
    content: 'Iustitia est constans et perpetua voluntas ius suum cuique tribuendi',
    translation: 'Justice is the constant and perpetual will to give each their due',
    author: 'Cicero',
    work: 'De Officiis',
    section: '1.7.23',
    similarity: 0.91,
    language: 'lat'
  },
  {
    urn: 'urn:cts:greekLit:tlg0086.tlg034.perseus-grc1:1129a',
    content: 'ἡ δικαιοσύνη ἐστὶν ἕξις ἀφ᾽ ἧς οἱ δίκαιοι πρακτικοί',
    translation: 'Justice is a disposition from which just people act',
    author: 'Aristotle',
    work: 'Nicomachean Ethics',
    section: 'Book 5, 1129a',
    similarity: 0.89,
    language: 'grc'
  },
]

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<typeof demoResults>([])
  const [loading, setLoading] = useState(false)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return
    
    setLoading(true)
    // Simulate API call
    setTimeout(() => {
      setResults(demoResults)
      setLoading(false)
    }, 500)
  }

  return (
    <main className="min-h-screen bg-obsidian">
      {/* Navigation */}
      <nav className="glass border-b border-gold/10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="font-serif text-2xl font-bold text-gold tracking-widest">
            LOGOS
          </Link>
          <div className="flex items-center gap-8">
            <Link href="/search" className="text-gold">Search</Link>
            <Link href="/discover" className="text-marble/70 hover:text-gold transition-colors">Discover</Link>
            <Link href="/research" className="text-marble/70 hover:text-gold transition-colors">Research</Link>
            <Link href="/learn" className="text-marble/70 hover:text-gold transition-colors">Learn</Link>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Search Header */}
        <div className="text-center mb-12">
          <h1 className="font-serif text-4xl text-gold mb-4">Semantic Search</h1>
          <p className="text-marble/60">Search 69M+ words of Greek & Latin by meaning, not just keywords</p>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="mb-12">
          <div className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search: 'What is justice?' or 'immortality of the soul'"
              className="w-full bg-obsidian-light border border-gold/20 rounded-xl px-6 py-4 text-lg text-marble placeholder-marble/30 focus:outline-none focus:border-gold/50 transition-colors"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2 bg-gold text-obsidian rounded-lg font-medium hover:bg-gold-light transition-colors"
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>
          
          {/* Filters */}
          <div className="flex gap-4 mt-4">
            <select className="bg-obsidian-light border border-gold/20 rounded-lg px-4 py-2 text-marble/70 focus:outline-none">
              <option value="">All Languages</option>
              <option value="grc">Greek</option>
              <option value="lat">Latin</option>
            </select>
            <select className="bg-obsidian-light border border-gold/20 rounded-lg px-4 py-2 text-marble/70 focus:outline-none">
              <option value="">All Authors</option>
              <option value="homer">Homer</option>
              <option value="virgil">Virgil</option>
              <option value="plato">Plato</option>
              <option value="aristotle">Aristotle</option>
              <option value="cicero">Cicero</option>
            </select>
            <select className="bg-obsidian-light border border-gold/20 rounded-lg px-4 py-2 text-marble/70 focus:outline-none">
              <option value="">All Genres</option>
              <option value="epic">Epic</option>
              <option value="philosophy">Philosophy</option>
              <option value="history">History</option>
              <option value="drama">Drama</option>
            </select>
          </div>
        </form>

        {/* Results */}
        {results.length > 0 && (
          <div className="space-y-6">
            <p className="text-marble/50">{results.length} results found</p>
            
            {results.map((result, i) => (
              <div key={i} className="glass rounded-xl p-6 gold-glow">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className={`text-xs px-2 py-1 rounded ${
                      result.language === 'grc' ? 'bg-blue-500/20 text-blue-400' : 'bg-amber/20 text-amber'
                    }`}>
                      {result.language === 'grc' ? 'GREEK' : 'LATIN'}
                    </span>
                    <span className="text-marble/50 text-sm ml-2">
                      {result.author} • {result.work} • {result.section}
                    </span>
                  </div>
                  <span className="text-gold font-medium">{Math.round(result.similarity * 100)}% match</span>
                </div>
                
                <p className="font-greek text-xl text-gold mb-2">{result.content}</p>
                <p className="text-marble/80">{result.translation}</p>
                
                <div className="flex gap-4 mt-4 pt-4 border-t border-gold/10">
                  <button className="text-gold/70 hover:text-gold text-sm transition-colors">
                    📖 Read Full Text
                  </button>
                  <button className="text-gold/70 hover:text-gold text-sm transition-colors">
                    🔗 Find Intertexts
                  </button>
                  <button className="text-gold/70 hover:text-gold text-sm transition-colors">
                    📝 Translate
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {results.length === 0 && !loading && (
          <div className="text-center py-16">
            <p className="text-marble/50 mb-4">Try searching for concepts like:</p>
            <div className="flex flex-wrap justify-center gap-2">
              {['What is justice?', 'immortality of the soul', 'anger and war', 'love poetry'].map(suggestion => (
                <button
                  key={suggestion}
                  onClick={() => {
                    setQuery(suggestion)
                    setResults(demoResults)
                  }}
                  className="px-4 py-2 bg-obsidian-light border border-gold/20 rounded-lg text-marble/70 hover:text-gold hover:border-gold/40 transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
