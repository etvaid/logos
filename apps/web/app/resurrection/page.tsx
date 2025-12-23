'use client'

import { useState } from 'react'
import { Search, BookOpen, Zap, Eye, Beaker, Star, Fragment, Clock } from 'lucide-react'

const DEMO_AUTHORS = [
  {
    id: 'sappho',
    name: 'Sappho of Lesbos',
    era: 'archaic',
    language: 'greek',
    surviving: 650,
    lost: 9000,
    reconstructed: 3,
    confidence: 85,
    fragments: [
      {
        id: 1,
        title: 'Fragment 31 - Jealousy Poem',
        text: 'φαίνεταί μοι κῆνος ἴσος θέοισιν / ἔμμεν᾽ ὤνηρ, ὄττις ἐνάντιός τοι / ἰσδάνει καὶ πλάσιον ἆδυ φωνεί- / σας ὐπακούει',
        translation: 'That man seems to me equal to the gods / who sits facing you / and listens closely to your sweet voice',
        confidence: 92,
        sources: ['P.Oxy. 2288', 'Longinus On Sublimity']
      },
      {
        id: 2,
        title: 'Fragment 16 - Helen Poem',
        text: '[...κάλλιστον ἐπὶ γᾶς μέλαι]ναν / Ἔλεναν... τὸν πάγκαλον ἄνδρα / καλλίπαισα βᾶ ᾽ς Τροΐαν πλέοισα',
        translation: 'the most beautiful thing on dark earth... Helen... leaving her beautiful husband sailed to Troy',
        confidence: 78,
        sources: ['P.Oxy. 1231']
      }
    ]
  },
  {
    id: 'livy',
    name: 'Titus Livius',
    era: 'imperial',
    language: 'latin',
    surviving: 35,
    lost: 107,
    reconstructed: 12,
    confidence: 62,
    fragments: [
      {
        id: 1,
        title: 'Book 67 - Dacian Wars',
        text: 'Decebalus rex Dacorum... montibus suis confidens Romanos provocabat',
        translation: 'Decebalus king of the Dacians... trusting in his mountains was provoking the Romans',
        confidence: 71,
        sources: ['Cassius Dio', 'Epitome']
      }
    ]
  },
  {
    id: 'cicero',
    name: 'Marcus Tullius Cicero',
    era: 'classical',
    language: 'latin',
    surviving: 0,
    lost: 1,
    reconstructed: 2,
    confidence: 45,
    fragments: [
      {
        id: 1,
        title: 'De Gloria - Opening',
        text: 'Gloria est frequens de aliquo fama cum laude... virtutis comes est gloria',
        translation: 'Glory is widespread talk about someone with praise... glory is the companion of virtue',
        confidence: 41,
        sources: ['Augustine', 'Quintilian references']
      }
    ]
  },
  {
    id: 'ennius',
    name: 'Quintus Ennius',
    era: 'classical',
    language: 'latin',
    surviving: 600,
    lost: 20000,
    reconstructed: 8,
    confidence: 68,
    fragments: [
      {
        id: 1,
        title: 'Annales Book 1 - Invocation',
        text: 'Musae quae pedibus magnum pulsatis Olympum / et genus humanum ingenio superatis et omnes',
        translation: 'Muses who strike great Olympus with your feet / and surpass the human race in talent',
        confidence: 89,
        sources: ['Varro', 'Gellius']
      }
    ]
  }
]

const ERA_COLORS = {
  archaic: '#D97706',
  classical: '#F59E0B',
  hellenistic: '#3B82F6',
  imperial: '#DC2626',
  lateAntique: '#7C3AED',
  byzantine: '#059669'
}

const LANGUAGE_COLORS = {
  greek: '#3B82F6',
  latin: '#DC2626'
}

export default function GhostResurrection() {
  const [selectedAuthor, setSelectedAuthor] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTab, setActiveTab] = useState('overview')

  const filteredAuthors = DEMO_AUTHORS.filter(author =>
    author.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getConfidenceColor = (confidence) => {
    if (confidence >= 80) return '#059669'
    if (confidence >= 60) return '#F59E0B'
    return '#DC2626'
  }

  return (
    <div className="min-h-screen bg-[#0D0D0F] text-[#F5F4F2]">
      {/* Header */}
      <div className="border-b border-[#1E1E24] p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-[#1E1E24] rounded-lg">
              <Zap className="w-6 h-6 text-[#C9A227]" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Ghost Resurrection</h1>
              <p className="text-[#F5F4F2]/70">Reconstructing lost works through fragments and testimony</p>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#F5F4F2]/50" />
            <input
              type="text"
              placeholder="Search lost authors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#1E1E24] border border-[#1E1E24] rounded-lg focus:outline-none focus:border-[#C9A227]"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {!selectedAuthor ? (
          <>
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-[#1E1E24] rounded-lg p-6 text-center">
                <Fragment className="w-8 h-8 text-[#C9A227] mx-auto mb-2" />
                <div className="text-2xl font-bold">25,250</div>
                <div className="text-sm text-[#F5F4F2]/70">Lost Lines</div>
              </div>
              <div className="bg-[#1E1E24] rounded-lg p-6 text-center">
                <BookOpen className="w-8 h-8 text-[#3B82F6] mx-auto mb-2" />
                <div className="text-2xl font-bold">1,285</div>
                <div className="text-sm text-[#F5F4F2]/70">Surviving Lines</div>
              </div>
              <div className="bg-[#1E1E24] rounded-lg p-6 text-center">
                <Beaker className="w-8 h-8 text-[#059669] mx-auto mb-2" />
                <div className="text-2xl font-bold">25</div>
                <div className="text-sm text-[#F5F4F2]/70">Reconstructions</div>
              </div>
            </div>

            {/* Author Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredAuthors.map((author) => (
                <div
                  key={author.id}
                  onClick={() => setSelectedAuthor(author)}
                  className="bg-[#1E1E24] rounded-lg p-6 cursor-pointer hover:bg-[#2A2A32] transition-colors"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold mb-1">{author.name}</h3>
                      <div className="flex items-center gap-2">
                        <span
                          className="px-2 py-1 rounded text-xs font-medium"
                          style={{
                            backgroundColor: ERA_COLORS[author.era] + '20',
                            color: ERA_COLORS[author.era]
                          }}
                        >
                          {author.era}
                        </span>
                        <span
                          className="w-5 h-5 rounded flex items-center justify-center text-xs font-bold"
                          style={{
                            backgroundColor: LANGUAGE_COLORS[author.language] + '20',
                            color: LANGUAGE_COLORS[author.language]
                          }}
                        >
                          {author.language === 'greek' ? 'Α' : 'L'}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-sm" style={{ color: getConfidenceColor(author.confidence) }}>
                      <Star className="w-4 h-4" />
                      {author.confidence}%
                    </div>
                  </div>

                  {/* Survival Stats */}
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Surviving</span>
                        <span>{author.surviving.toLocaleString()} lines</span>
                      </div>
                      <div className="h-2 bg-[#0D0D0F] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#059669]"
                          style={{
                            width: `${(author.surviving / (author.surviving + author.lost)) * 100}%`
                          }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Lost</span>
                        <span>{author.lost.toLocaleString()} lines</span>
                      </div>
                      <div className="h-2 bg-[#0D0D0F] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#DC2626]"
                          style={{
                            width: `${(author.lost / (author.surviving + author.lost)) * 100}%`
                          }}
                        />
                      </div>
                    </div>

                    <div className="pt-2 border-t border-[#0D0D0F]">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-[#C9A227]">
                          {author.reconstructed} reconstructed stanzas
                        </span>
                        <Eye className="w-4 h-4 text-[#F5F4F2]/50" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div>
            {/* Back Button */}
            <button
              onClick={() => setSelectedAuthor(null)}
              className="mb-6 text-[#C9A227] hover:text-[#C9A227]/80 flex items-center gap-2"
            >
              ← Back to Authors
            </button>

            {/* Author Header */}
            <div className="bg-[#1E1E24] rounded-lg p-6 mb-6">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold mb-2">{selectedAuthor.name}</h2>
                  <div className="flex items-center gap-4 text-sm text-[#F5F4F2]/70">
                    <span>Era: {selectedAuthor.era}</span>
                    <span>Language: {selectedAuthor.language}</span>
                    <span>Reconstruction confidence: {selectedAuthor.confidence}%</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-[#C9A227]">
                    {selectedAuthor.reconstructed}
                  </div>
                  <div className="text-sm text-[#F5F4F2]/70">Reconstructions</div>
                </div>
              </div>

              {/* Loss Visualization */}
              <div className="mt-4">
                <div className="flex justify-between text-sm mb-2">
                  <span>Textual Survival</span>
                  <span>
                    {((selectedAuthor.surviving / (selectedAuthor.surviving + selectedAuthor.lost)) * 100).toFixed(1)}% survives
                  </span>
                </div>
                <div className="h-3 bg-[#0D0D0F] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#059669]"
                    style={{
                      width: `${(selectedAuthor.surviving / (selectedAuthor.surviving + selectedAuthor.lost)) * 100}%`
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 mb-6">
              {['fragments', 'reconstruction', 'sources'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-lg capitalize transition-colors ${
                    activeTab === tab
                      ? 'bg-[#C9A227] text-[#0D0D0F]'
                      : 'bg-[#1E1E24] text-[#F5F4F2]/70 hover:text-[#F5F4F2]'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            {activeTab === 'fragments' && (
              <div className="space-y-6">
                {selectedAuthor.fragments.map((fragment) => (
                  <div key={fragment.id} className="bg-[#1E1E24] rounded-lg p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-lg font-bold">{fragment.title}</h3>
                      <div className="flex items-center gap-2">
                        <div
                          className="px-2 py-1 rounded text-xs font-medium"
                          style={{
                            backgroundColor: getConfidenceColor(fragment.confidence) + '20',
                            color: getConfidenceColor(fragment.confidence)
                          }}
                        >
                          {fragment.confidence}% confidence
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <div className="text-sm text-[#F5F4F2]/70 mb-2">Original Text:</div>
                        <div className="font-mono text-[#C9A227] bg-[#0D0D0F] p-3 rounded">
                          {fragment.text}
                        </div>
                      </div>

                      <div>
                        <div className="text-sm text-[#F5F4F2]/70 mb-2">Translation:</div>
                        <div className="italic text-[#F5F4F2]/90">
                          {fragment.translation}
                        </div>
                      </div>

                      <div>
                        <div className="text-sm text-[#F5F4F2]/70 mb-2">Sources:</div>
                        <div className="flex flex-wrap gap-2">
                          {fragment.sources.map((source, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-1 bg-[#0D0D0F] rounded text-xs"
                            >
                              {source}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'reconstruction' && (
              <div className="bg-[#1E1E24] rounded-lg p-6">
                <div className="flex items-center gap-3 mb-6">
                  <Beaker className="w-6 h-6 text-[#C9A227]" />
                  <h3 className="text-xl font-bold">Reconstruction Lab</h3>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-[#0D0D0F] rounded">
                      <div className="text-lg font-bold text-[#C9A227]">
                        {selectedAuthor.fragments.length}
                      </div>
                      <div className="text-sm text-[#F5F4F2]/70">Source Fragments</div>
                    </div>
                    <div className="text-center p-4 bg-[#0D0D0F] rounded">
                      <div className="text-lg font-bold text-[#3B82F6]">47</div>
                      <div className="text-sm text-[#F5F4F2]/70">Cross References</div>
                    </div>
                    <div className="text-center p-4 bg-[#0D0D0F] rounded">
                      <div className="text-lg font-bold text-[#059669]">23</div>
                      <div className="text-sm text-[#F5F4F2]/70">Parallels Found</div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-bold mb-3">Reconstruction Methods</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-[#0D0D0F] rounded">
                        <span>Papyrus fragments</span>
                        <span className="text-[#059669]">High reliability</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-[#0D0D0F] rounded">
                        <span>Ancient quotations</span>
                        <span className="text-[#F59E0B]">Medium reliability</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-[#0D0D0F] rounded">
                        <span>Testimonia</span>
                        <span className="text-[#DC2626]">Lower reliability</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-[#0D0D0F] rounded">
                        <span>Computational analysis</span>
                        <span className="text-[#7C3AED]">Experimental</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'sources' && (
              <div className="bg-[#1E1E24] rounded-lg p-6">
                <h3 className="text-xl font-bold mb-6">Evidence Sources</h3>

                <div className="space-y-4">
                  <div className="p-4 bg-[#0D0D0F] rounded">
                    <div className="flex items-center gap-3 mb-2">
                      <Clock className="w-4 h-4 text-[#C9A227]" />
                      <span className="font-medium">Papyrus Sources</span>
                    </div>
                    <div className="text-sm text-[#F5F4F2]/70 space-y-1">
                      <div>• P.Oxy. 2288 (2nd century CE)</div>
                      <div>• P.Oxy. 1231 (3rd century CE)</div>
                      <div>• P.Sapph. Obbink (2014 discovery)</div>
                    </div>
                  </div>

                  <div className="p-4 bg-[#0D0D0F] rounded">
                    <div className="flex items-center gap-3 mb-2">
                      <BookOpen className="w-4 h-4 text-[#3B82F6]" />
                      <span className="font-medium">Ancient Authors</span>
                    </div>
                    <div className="text-sm text-[#F5F4F2]/70 space-y-1">
                      <div>• Longinus, On the Sublime</div>
                      <div>• Dionysius of Halicarnassus</div>
                      <div>• Athenaeus, Deipnosophistae</div>
                    </div>
                  </div>

                  <div className="p-4 bg-[#0D0D0F] rounded">
                    <div className="flex items-center gap-3 mb-2">
                      <Fragment className="w-4 h-4 text-[#059669]" />
                      <span className="font-medium">Medieval Manuscripts</span>
                    </div>
                    <div className="text-sm text-[#F5F4F2]/70 space-y-1">
                      <div>• Palatine Anthology</div>
                      <div>• Byzantine scholia</div>
                      <div>• Etymological lexica</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}