'use client'

import { useState, useMemo } from 'react'

const PASSAGES = [
  {id:1, author:"Homer", work:"Iliad", text:"Μῆνιν ἄειδε θεὰ", translation:"Sing, goddess, the wrath", era:"archaic", language:"greek"},
  {id:2, author:"Plato", work:"Republic", text:"Δικαιοσύνη ἐστίν", translation:"Justice is", era:"classical", language:"greek"},
  {id:3, author:"Virgil", work:"Aeneid", text:"Arma virumque cano", translation:"I sing of arms and the man", era:"imperial", language:"latin"},
  {id:4, author:"Cicero", work:"De Officiis", text:"Quamquam te", translation:"Although you", era:"imperial", language:"latin"},
  {id:5, author:"Aristotle", work:"Ethics", text:"Πᾶσα τέχνη", translation:"Every art", era:"classical", language:"greek"},
  {id:6, author:"Seneca", work:"Letters", text:"Vindica te tibi", translation:"Claim yourself", era:"imperial", language:"latin"},
  {id:7, author:"Sophocles", work:"Antigone", text:"Πολλὰ τὰ δεινά", translation:"Many wonders", era:"classical", language:"greek"},
  {id:8, author:"Augustine", work:"Confessions", text:"Magnus es Domine", translation:"Great are you Lord", era:"lateAntique", language:"latin"},
]

const ERA_COLORS = {
  archaic: '#D97706',
  classical: '#F59E0B',
  hellenistic: '#3B82F6',
  imperial: '#DC2626',
  lateAntique: '#7C3AED',
  byzantine: '#059669'
}

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [languageFilter, setLanguageFilter] = useState('all')
  const [eraFilters, setEraFilters] = useState<string[]>([])

  const filteredPassages = useMemo(() => {
    return PASSAGES.filter(passage => {
      // Search query filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        const matchesSearch = 
          passage.author.toLowerCase().includes(query) ||
          passage.work.toLowerCase().includes(query) ||
          passage.text.toLowerCase().includes(query) ||
          passage.translation.toLowerCase().includes(query)
        if (!matchesSearch) return false
      }

      // Language filter
      if (languageFilter !== 'all' && passage.language !== languageFilter) {
        return false
      }

      // Era filter
      if (eraFilters.length > 0 && !eraFilters.includes(passage.era)) {
        return false
      }

      return true
    })
  }, [searchQuery, languageFilter, eraFilters])

  const toggleEraFilter = (era: string) => {
    setEraFilters(prev => 
      prev.includes(era) 
        ? prev.filter(e => e !== era)
        : [...prev, era]
    )
  }

  const quickSearch = (query: string) => {
    setSearchQuery(query)
    setLanguageFilter('all')
    setEraFilters([])
  }

  return (
    <div className="min-h-screen bg-[#0D0D0F] text-[#F5F4F2] p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Search Texts</h1>
          <p className="text-gray-400">Explore classical Greek and Latin literature</p>
        </div>

        {/* Search Input */}
        <div className="mb-6">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by author, work, text, or translation..."
            className="w-full px-4 py-3 bg-[#1E1E24] border border-gray-700 rounded-lg text-[#F5F4F2] placeholder-gray-500 focus:outline-none focus:border-[#C9A227]"
          />
        </div>

        {/* Quick Search Buttons */}
        <div className="flex flex-wrap gap-2 mb-6">
          {['Homer', 'virtue', 'wrath', 'Plato'].map(term => (
            <button
              key={term}
              onClick={() => quickSearch(term)}
              className="px-3 py-1 bg-[#1E1E24] hover:bg-[#C9A227] rounded-full text-sm transition-colors"
            >
              {term}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-[#1E1E24] rounded-lg p-4 sticky top-6">
              <h3 className="font-semibold mb-4 text-[#C9A227]">Filters</h3>
              
              {/* Language Filter */}
              <div className="mb-6">
                <h4 className="font-medium mb-2">Language</h4>
                <div className="space-y-2">
                  {[
                    { value: 'all', label: 'All Languages' },
                    { value: 'greek', label: 'Greek (Α)' },
                    { value: 'latin', label: 'Latin (L)' }
                  ].map(option => (
                    <label key={option.value} className="flex items-center">
                      <input
                        type="radio"
                        name="language"
                        value={option.value}
                        checked={languageFilter === option.value}
                        onChange={(e) => setLanguageFilter(e.target.value)}
                        className="mr-2"
                      />
                      <span className="text-sm">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Era Filter */}
              <div>
                <h4 className="font-medium mb-2">Era</h4>
                <div className="space-y-2">
                  {[
                    { value: 'archaic', label: 'Archaic' },
                    { value: 'classical', label: 'Classical' },
                    { value: 'hellenistic', label: 'Hellenistic' },
                    { value: 'imperial', label: 'Imperial' },
                    { value: 'lateAntique', label: 'Late Antique' },
                    { value: 'byzantine', label: 'Byzantine' }
                  ].map(era => (
                    <label key={era.value} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={eraFilters.includes(era.value)}
                        onChange={() => toggleEraFilter(era.value)}
                        className="mr-2"
                      />
                      <span className="text-sm">{era.label}</span>
                      <div 
                        className="w-3 h-3 rounded-full ml-2"
                        style={{ backgroundColor: ERA_COLORS[era.value as keyof typeof ERA_COLORS] }}
                      ></div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Clear Filters */}
              {(searchQuery || languageFilter !== 'all' || eraFilters.length > 0) && (
                <button
                  onClick={() => {
                    setSearchQuery('')
                    setLanguageFilter('all')
                    setEraFilters([])
                  }}
                  className="mt-4 w-full px-3 py-2 bg-gray-600 hover:bg-gray-700 rounded text-sm transition-colors"
                >
                  Clear All Filters
                </button>
              )}
            </div>
          </div>

          {/* Results */}
          <div className="lg:col-span-3">
            <div className="mb-4">
              <p className="text-gray-400">
                {filteredPassages.length} result{filteredPassages.length !== 1 ? 's' : ''} found
              </p>
            </div>

            <div className="space-y-4">
              {filteredPassages.map(passage => (
                <div
                  key={passage.id}
                  className="bg-[#1E1E24] rounded-lg p-4 border-l-4"
                  style={{ 
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
                        <h3 className="font-semibold text-[#F5F4F2]">
                          {passage.author}
                        </h3>
                        <p className="text-sm text-gray-400">{passage.work}</p>
                      </div>
                    </div>
                    <span 
                      className="px-2 py-1 rounded text-xs font-medium text-white capitalize"
                      style={{ 
                        backgroundColor: ERA_COLORS[passage.era as keyof typeof ERA_COLORS] 
                      }}
                    >
                      {passage.era}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <p className="text-[#F5F4F2] font-medium">
                      {passage.text}
                    </p>
                    <p className="text-gray-300 italic">
                      "{passage.translation}"
                    </p>
                  </div>
                </div>
              ))}

              {filteredPassages.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-400 mb-2">No passages found</p>
                  <p className="text-sm text-gray-500">Try adjusting your search terms or filters</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}