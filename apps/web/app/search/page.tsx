'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'

const PASSAGES = [
  {id:1, author:"Homer", work:"Iliad", text:"Μῆνιν ἄειδε θεὰ Πηληϊάδεω Ἀχιλῆος", translation:"Sing, O goddess, the anger of Achilles", era:"archaic", language:"greek"},
  {id:2, author:"Homer", work:"Odyssey", text:"Ἄνδρα μοι ἔννεπε, μοῦσα, πολύτροπον", translation:"Tell me, O muse, of that ingenious hero", era:"archaic", language:"greek"},
  {id:3, author:"Plato", work:"Republic", text:"Δικαιοσύνη ἐστίν ἀρετή", translation:"Justice is a virtue", era:"classical", language:"greek"},
  {id:4, author:"Plato", work:"Apology", text:"ἓν οἶδα ὅτι οὐδὲν οἶδα", translation:"I know that I know nothing", era:"classical", language:"greek"},
  {id:5, author:"Aristotle", work:"Ethics", text:"Πᾶσα τέχνη καὶ πᾶσα μέθοδος", translation:"Every art and every inquiry", era:"classical", language:"greek"},
  {id:6, author:"Virgil", work:"Aeneid", text:"Arma virumque cano", translation:"I sing of arms and the man", era:"imperial", language:"latin"},
  {id:7, author:"Cicero", work:"In Catilinam", text:"Quo usque tandem abutere patientia nostra?", translation:"How long will you abuse our patience?", era:"imperial", language:"latin"},
  {id:8, author:"Seneca", work:"Letters", text:"Vindica te tibi", translation:"Claim yourself for yourself", era:"imperial", language:"latin"},
  {id:9, author:"Augustine", work:"Confessions", text:"Magnus es, Domine", translation:"Great are you, O Lord", era:"lateAntique", language:"latin"},
  {id:10, author:"Ovid", work:"Metamorphoses", text:"In nova fert animus", translation:"My mind inclines to tell of forms changed", era:"imperial", language:"latin"},
];

const ERA_COLORS = {
  archaic: '#D97706',
  classical: '#F59E0B',
  hellenistic: '#3B82F6',
  imperial: '#DC2626',
  lateAntique: '#7C3AED'
}

function SearchPageContent() {
  const searchParams = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('q') || '')
  const [languageFilter, setLanguageFilter] = useState('')
  const [results, setResults] = useState(PASSAGES)
  const [hoveredButton, setHoveredButton] = useState<string | null>(null)

  const performSearch = () => {
    let filtered = PASSAGES

    // Filter by query
    if (query.trim()) {
      const searchTerm = query.toLowerCase()
      filtered = filtered.filter(passage =>
        passage.author.toLowerCase().includes(searchTerm) ||
        passage.work.toLowerCase().includes(searchTerm) ||
        passage.text.toLowerCase().includes(searchTerm) ||
        passage.translation.toLowerCase().includes(searchTerm)
      )
    }

    // Filter by language
    if (languageFilter) {
      filtered = filtered.filter(passage => passage.language === languageFilter)
    }

    setResults(filtered)
  }

  // Auto-search when language filter changes
  useEffect(() => {
    performSearch()
  }, [languageFilter])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      performSearch()
    }
  }

  const handleQuickSearch = (searchTerm: string) => {
    setQuery(searchTerm)
    const searchLower = searchTerm.toLowerCase()
    let filtered = PASSAGES.filter(passage =>
      passage.author.toLowerCase().includes(searchLower) ||
      passage.work.toLowerCase().includes(searchLower) ||
      passage.text.toLowerCase().includes(searchLower) ||
      passage.translation.toLowerCase().includes(searchLower)
    )

    if (languageFilter) {
      filtered = filtered.filter(passage => passage.language === languageFilter)
    }

    setResults(filtered)
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0D0D0F', color: '#F5F4F2' }}>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2" style={{ color: '#C9A227' }}>
            LOGOS Search
          </h1>
          <p className="text-lg opacity-90">
            Search through classical texts and translations
          </p>
        </div>

        {/* Search Controls */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex gap-4 mb-4">
            <div className="flex-1">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search authors, works, text, or translations..."
                className="w-full px-4 py-3 rounded-lg border border-opacity-20"
                style={{ 
                  backgroundColor: '#1E1E24', 
                  borderColor: '#C9A227',
                  color: '#F5F4F2'
                }}
              />
            </div>
            <button
              onClick={performSearch}
              className="px-6 py-3 rounded-lg font-semibold transition-colors"
              style={{ 
                backgroundColor: '#C9A227', 
                color: '#0D0D0F'
              }}
            >
              Search
            </button>
          </div>

          {/* Language Filter */}
          <div className="flex gap-4 items-center mb-6">
            <label className="text-sm font-medium">Filter by Language:</label>
            <select
              value={languageFilter}
              onChange={(e) => setLanguageFilter(e.target.value)}
              className="px-3 py-2 rounded border border-opacity-20"
              style={{ 
                backgroundColor: '#1E1E24', 
                borderColor: '#C9A227',
                color: '#F5F4F2'
              }}
            >
              <option value="">All Languages</option>
              <option value="greek">Greek</option>
              <option value="latin">Latin</option>
            </select>
          </div>

          {/* Quick Search Buttons */}
          <div className="flex flex-wrap gap-2">
            <span className="text-sm font-medium mr-2">Quick searches:</span>
            {['Homer', 'Plato', 'virtue', 'Virgil', 'Augustine'].map((term) => (
              <button
                key={term}
                onClick={() => handleQuickSearch(term)}
                onMouseEnter={() => setHoveredButton(term)}
                onMouseLeave={() => setHoveredButton(null)}
                className="px-3 py-1 rounded text-sm transition-colors border"
                style={{ 
                  borderColor: '#C9A227',
                  backgroundColor: hoveredButton === term ? '#C9A227' : 'transparent',
                  color: hoveredButton === term ? '#0D0D0F' : '#C9A227'
                }}
              >
                {term}
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">
              Search Results
            </h2>
            <div className="text-sm opacity-75">
              {results.length} passage{results.length !== 1 ? 's' : ''} found
            </div>
          </div>

          <div className="space-y-4">
            {results.map((passage) => (
              <div
                key={passage.id}
                className="rounded-lg p-6 border-l-4"
                style={{ 
                  backgroundColor: '#1E1E24',
                  borderLeftColor: ERA_COLORS[passage.era as keyof typeof ERA_COLORS]
                }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm"
                      style={{ 
                        backgroundColor: passage.language === 'greek' ? '#3B82F6' : '#DC2626'
                      }}
                    >
                      {passage.language === 'greek' ? 'Α' : 'L'}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">
                        {passage.author}
                      </h3>
                      <p className="text-sm opacity-75">
                        {passage.work}
                      </p>
                    </div>
                  </div>
                  <div
                    className="px-2 py-1 rounded text-xs font-medium uppercase tracking-wide"
                    style={{ 
                      backgroundColor: ERA_COLORS[passage.era as keyof typeof ERA_COLORS] + '20',
                      color: ERA_COLORS[passage.era as keyof typeof ERA_COLORS]
                    }}
                  >
                    {passage.era}
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-lg font-medium mb-1" style={{ color: '#F5F4F2' }}>
                      {passage.text}
                    </p>
                  </div>
                  <div>
                    <p className="italic opacity-90">
                      "{passage.translation}"
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {results.length === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4" style={{ color: '#C9A227' }}>
                  📚
                </div>
                <p className="text-xl mb-2">No passages found</p>
                <p className="opacity-75">
                  Try adjusting your search terms or filters
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0D0D0F', color: '#F5F4F2' }}>Loading...</div>}>
      <SearchPageContent />
    </Suspense>
  )
}