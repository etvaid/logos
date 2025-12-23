'use client'

import { Suspense, useState, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'

const PASSAGES = [
  {
    id: 1,
    author: "Homer",
    work: "Iliad",
    text: "μῆνιν ἄειδε θεὰ Πηληϊάδεω Ἀχιλῆος οὐλομένην",
    translation: "Sing, goddess, of the rage of Achilles, son of Peleus, that destructive rage",
    language: "Greek",
    era: "archaic"
  },
  {
    id: 2,
    author: "Virgil",
    work: "Aeneid",
    text: "Arma virumque cano, Troiae qui primus ab oris",
    translation: "I sing of arms and the man who first came from the shores of Troy",
    language: "Latin",
    era: "classical"
  },
  {
    id: 3,
    author: "Plato",
    work: "Republic",
    text: "οὐκοῦν δικαιοσύνη μὲν ἦν τὸ τὰ αὑτοῦ πράττειν καὶ μὴ πολυπραγμονεῖν",
    translation: "Justice, then, is doing one's own work and not meddling with what isn't one's own",
    language: "Greek",
    era: "classical"
  },
  {
    id: 4,
    author: "Cicero",
    work: "De Officiis",
    text: "Sed de genere belli gerendi posteri viderint; mihi autem non dubium est",
    translation: "But posterity will judge the manner of waging war; for me, however, there is no doubt",
    language: "Latin",
    era: "classical"
  },
  {
    id: 5,
    author: "Sappho",
    work: "Fragment 31",
    text: "φαίνεταί μοι κῆνος ἴσος θέοισιν ἔμμεν ὤνηρ",
    translation: "That man seems to me equal to the gods",
    language: "Greek",
    era: "archaic"
  },
  {
    id: 6,
    author: "Ovid",
    work: "Metamorphoses",
    text: "In nova fert animus mutatas dicere formas corpora",
    translation: "My mind leads me to speak of forms changed into new bodies",
    language: "Latin",
    era: "imperial"
  },
  {
    id: 7,
    author: "Herodotus",
    work: "Histories",
    text: "Ἡροδότου Ἁλικαρνησσέος ἱστορίης ἀπόδεξις ἥδε",
    translation: "This is the display of the inquiry of Herodotus of Halicarnassus",
    language: "Greek",
    era: "classical"
  },
  {
    id: 8,
    author: "Tacitus",
    work: "Annals",
    text: "Urbem Romam a principio reges habuere; libertatem et consulatum L. Brutus instituit",
    translation: "Kings held the city of Rome from the beginning; L. Brutus established freedom and the consulship",
    language: "Latin",
    era: "imperial"
  },
  {
    id: 9,
    author: "Sophocles",
    work: "Oedipus Rex",
    text: "ὦ τέκνα Κάδμου τῆς νέας τροφίματα",
    translation: "O children, nurslings of ancient Cadmus",
    language: "Greek",
    era: "classical"
  },
  {
    id: 10,
    author: "Augustine",
    work: "Confessions",
    text: "Inquietum est cor nostrum donec requiescat in te",
    translation: "Our heart is restless until it rests in you",
    language: "Latin",
    era: "lateAntique"
  },
  {
    id: 11,
    author: "Hesiod",
    work: "Works and Days",
    text: "Μοῦσαι Πιερίηθεν ἀοιδῇσι κλείουσαι",
    translation: "Muses of Pieria who give glory through song",
    language: "Greek",
    era: "archaic"
  },
  {
    id: 12,
    author: "Seneca",
    work: "Epistles",
    text: "Omnis vita servitium est",
    translation: "All life is slavery",
    language: "Latin",
    era: "imperial"
  },
  {
    id: 13,
    author: "Pindar",
    work: "Olympian Odes",
    text: "ἄριστον μὲν ὕδωρ, ὁ δὲ χρυσὸς αἰθόμενον πῦρ",
    translation: "Water is best, and gold like blazing fire",
    language: "Greek",
    era: "archaic"
  },
  {
    id: 14,
    author: "Livy",
    work: "Ab Urbe Condita",
    text: "Facturusne operae pretium sim si a primordio urbis res populi Romani perscripserim",
    translation: "Whether I shall accomplish anything worthy of the labor, if I record completely the deeds of the Roman people from the beginning of the city",
    language: "Latin",
    era: "imperial"
  },
  {
    id: 15,
    author: "John Chrysostom",
    work: "Homilies",
    text: "Gloria in excelsis Deo et in terra pax hominibus bonae voluntatis",
    translation: "Glory to God in the highest, and on earth peace to men of good will",
    language: "Latin",
    era: "lateAntique"
  }
]

const ERA_COLORS = {
  archaic: '#D97706',
  classical: '#F59E0B', 
  imperial: '#DC2626',
  lateAntique: '#7C3AED'
}

function SearchContent() {
  const searchParams = useSearchParams()
  const [searchTerm, setSearchTerm] = useState(searchParams?.get('q') || '')
  const [languageFilter, setLanguageFilter] = useState('All')

  const filteredPassages = useMemo(() => {
    return PASSAGES.filter(passage => {
      const matchesSearch = !searchTerm || 
        passage.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        passage.work.toLowerCase().includes(searchTerm.toLowerCase()) ||
        passage.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
        passage.translation.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesLanguage = languageFilter === 'All' || passage.language === languageFilter
      
      return matchesSearch && matchesLanguage
    })
  }, [searchTerm, languageFilter])

  const quickSearches = ['Homer', 'Virgil', 'Plato', 'Cicero', 'justice', 'glory']

  return (
    <div className="min-h-screen bg-[#0D0D0F] text-[#F5F4F2] p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">
            Search <span className="text-[#C9A227]">LOGOS</span>
          </h1>
          <p className="text-lg opacity-80">Discover passages across classical antiquity</p>
        </div>

        {/* Search Controls */}
        <div className="bg-black/20 p-6 rounded-lg mb-8 border border-gray-800">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            {/* Search Input */}
            <div className="flex-1">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search authors, works, or text..."
                className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg text-[#F5F4F2] placeholder-gray-400 focus:border-[#C9A227] focus:outline-none"
              />
            </div>

            {/* Language Filter */}
            <select
              value={languageFilter}
              onChange={(e) => setLanguageFilter(e.target.value)}
              className="p-3 bg-gray-900 border border-gray-700 rounded-lg text-[#F5F4F2] focus:border-[#C9A227] focus:outline-none"
            >
              <option value="All">All Languages</option>
              <option value="Greek">Greek</option>
              <option value="Latin">Latin</option>
            </select>
          </div>

          {/* Quick Search Buttons */}
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-gray-400 mr-2">Quick searches:</span>
            {quickSearches.map((term) => (
              <button
                key={term}
                onClick={() => setSearchTerm(term)}
                className="px-3 py-1 text-sm bg-[#C9A227]/20 hover:bg-[#C9A227]/30 border border-[#C9A227]/40 rounded-md transition-colors"
              >
                {term}
              </button>
            ))}
            <button
              onClick={() => { setSearchTerm(''); setLanguageFilter('All'); }}
              className="px-3 py-1 text-sm bg-red-900/20 hover:bg-red-900/30 border border-red-500/40 rounded-md transition-colors"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-lg">
            Found <span className="text-[#C9A227] font-semibold">{filteredPassages.length}</span> passages
            {searchTerm && <span> for "{searchTerm}"</span>}
          </p>
        </div>

        {/* Results */}
        <div className="space-y-6">
          {filteredPassages.map((passage) => (
            <div
              key={passage.id}
              className="bg-black/30 border-l-4 border-gray-800 p-6 rounded-lg hover:bg-black/40 transition-colors"
              style={{ borderLeftColor: ERA_COLORS[passage.era as keyof typeof ERA_COLORS] }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm"
                    style={{ backgroundColor: passage.language === 'Greek' ? '#3B82F6' : '#DC2626' }}
                  >
                    {passage.language === 'Greek' ? 'Α' : 'L'}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-[#C9A227]">{passage.author}</h3>
                    <p className="text-gray-400">{passage.work}</p>
                  </div>
                </div>
                <div
                  className="px-3 py-1 rounded-full text-xs font-medium text-white capitalize"
                  style={{ backgroundColor: ERA_COLORS[passage.era as keyof typeof ERA_COLORS] }}
                >
                  {passage.era}
                </div>
              </div>

              <div className="space-y-3">
                <div className="p-4 bg-gray-900/50 rounded-lg border border-gray-700">
                  <p className="text-lg font-medium leading-relaxed">{passage.text}</p>
                </div>
                <div className="p-4 bg-gray-800/30 rounded-lg">
                  <p className="text-gray-300 italic leading-relaxed">{passage.translation}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredPassages.length === 0 && (
          <div className="text-center py-12">
            <p className="text-xl text-gray-400 mb-4">No passages found</p>
            <p className="text-gray-500">Try adjusting your search terms or filters</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0D0D0F] text-[#F5F4F2] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#C9A227] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading search...</p>
        </div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  )
}