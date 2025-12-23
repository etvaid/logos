'use client'

import { useState } from 'react'

interface Evidence {
  id: string
  type: 'Archaeological' | 'Epigraphic' | 'Numismatic' | 'Papyrological' | 'Literary' | 'Manuscript'
  reliability: number
  icon: string
  title: string
  description: string
  location: string
  date: string
  era: 'archaic' | 'classical' | 'hellenistic' | 'imperial' | 'lateAntique' | 'byzantine'
  language: 'greek' | 'latin'
  claimId: string
}

interface Claim {
  id: string
  title: string
  description: string
  evidenceIds: string[]
}

const evidenceTypes = {
  Archaeological: { reliability: 95, icon: '🏛️' },
  Epigraphic: { reliability: 90, icon: '🪨' },
  Numismatic: { reliability: 90, icon: '🪙' },
  Papyrological: { reliability: 85, icon: '📋' },
  Literary: { reliability: 75, icon: '📜' },
  Manuscript: { reliability: 70, icon: '📖' }
}

const eraColors = {
  archaic: '#D97706',
  classical: '#F59E0B',
  hellenistic: '#3B82F6',
  imperial: '#DC2626',
  lateAntique: '#7C3AED',
  byzantine: '#059669'
}

const languageColors = {
  greek: '#3B82F6',
  latin: '#DC2626'
}

const demoEvidence: Evidence[] = [
  {
    id: '1',
    type: 'Archaeological',
    reliability: 95,
    icon: '🏛️',
    title: 'Parthenon Construction',
    description: 'Physical remains of the Parthenon temple on the Athenian Acropolis',
    location: 'Athens, Greece',
    date: '447-432 BCE',
    era: 'classical',
    language: 'greek',
    claimId: 'claim1'
  },
  {
    id: '2',
    type: 'Epigraphic',
    reliability: 90,
    icon: '🪨',
    title: 'Parthenon Building Accounts',
    description: 'Inscribed stone records of expenses for Parthenon construction',
    location: 'Acropolis Museum',
    date: '440s-430s BCE',
    era: 'classical',
    language: 'greek',
    claimId: 'claim1'
  },
  {
    id: '3',
    type: 'Literary',
    reliability: 75,
    icon: '📜',
    title: 'Plutarch\'s Life of Pericles',
    description: 'Account of Pericles\' building program including the Parthenon',
    location: 'Various manuscripts',
    date: 'c. 100 CE',
    era: 'imperial',
    language: 'greek',
    claimId: 'claim1'
  },
  {
    id: '4',
    type: 'Numismatic',
    reliability: 90,
    icon: '🪙',
    title: 'Athenian Tetradrachm',
    description: 'Silver coins depicting Athena, funding source for Parthenon',
    location: 'Various collections',
    date: '450-400 BCE',
    era: 'classical',
    language: 'greek',
    claimId: 'claim1'
  },
  {
    id: '5',
    type: 'Archaeological',
    reliability: 95,
    icon: '🏛️',
    title: 'Forum Romanum Excavations',
    description: 'Excavated remains of Roman Forum buildings and structures',
    location: 'Rome, Italy',
    date: '500 BCE - 500 CE',
    era: 'imperial',
    language: 'latin',
    claimId: 'claim2'
  },
  {
    id: '6',
    type: 'Literary',
    reliability: 75,
    icon: '📜',
    title: 'Livy\'s Ab Urbe Condita',
    description: 'Historical account of early Roman history and Forum development',
    location: 'Various manuscripts',
    date: '27-9 BCE',
    era: 'imperial',
    language: 'latin',
    claimId: 'claim2'
  }
]

const demoClaims: Claim[] = [
  {
    id: 'claim1',
    title: 'Parthenon Built Under Pericles',
    description: 'The Parthenon was constructed during Pericles\' leadership as part of his building program',
    evidenceIds: ['1', '2', '3', '4']
  },
  {
    id: 'claim2',
    title: 'Forum as Center of Roman Life',
    description: 'The Roman Forum served as the political, commercial, and social center of ancient Rome',
    evidenceIds: ['5', '6']
  }
]

export default function EvidenceExplorer() {
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])
  const [selectedClaim, setSelectedClaim] = useState<string>('')

  const filteredEvidence = demoEvidence.filter(evidence => {
    const typeMatch = selectedTypes.length === 0 || selectedTypes.includes(evidence.type)
    const claimMatch = !selectedClaim || evidence.claimId === selectedClaim
    return typeMatch && claimMatch
  })

  const calculateReliability = (evidenceIds: string[]) => {
    const evidences = demoEvidence.filter(e => evidenceIds.includes(e.id))
    if (evidences.length === 0) return 0
    
    // Combined reliability using probability theory
    let combinedReliability = 0
    evidences.forEach(evidence => {
      const reliability = evidence.reliability / 100
      combinedReliability = combinedReliability + reliability - (combinedReliability * reliability)
    })
    
    return Math.round(combinedReliability * 100)
  }

  const toggleType = (type: string) => {
    setSelectedTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    )
  }

  return (
    <div className="min-h-screen bg-[#0D0D0F] text-[#F5F4F2]">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Evidence Explorer</h1>
          <p className="text-[#F5F4F2]/70">Analyze historical claims through multiple evidence types</p>
        </div>

        {/* Filters */}
        <div className="grid lg:grid-cols-4 gap-6 mb-8">
          {/* Evidence Type Filter */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-semibold mb-4">Evidence Types</h2>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(evidenceTypes).map(([type, data]) => (
                <button
                  key={type}
                  onClick={() => toggleType(type)}
                  className={`p-3 rounded-lg border transition-all ${
                    selectedTypes.includes(type)
                      ? 'bg-[#C9A227] border-[#C9A227] text-[#0D0D0F]'
                      : 'bg-[#1E1E24] border-[#1E1E24] hover:border-[#C9A227]/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{data.icon}</span>
                      <span className="text-sm font-medium">{type}</span>
                    </div>
                    <span className="text-xs font-bold">{data.reliability}%</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Claims Filter */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-semibold mb-4">Historical Claims</h2>
            <div className="space-y-2">
              <button
                onClick={() => setSelectedClaim('')}
                className={`w-full p-3 rounded-lg border text-left transition-all ${
                  !selectedClaim
                    ? 'bg-[#C9A227] border-[#C9A227] text-[#0D0D0F]'
                    : 'bg-[#1E1E24] border-[#1E1E24] hover:border-[#C9A227]/50'
                }`}
              >
                All Claims
              </button>
              {demoClaims.map(claim => (
                <button
                  key={claim.id}
                  onClick={() => setSelectedClaim(claim.id)}
                  className={`w-full p-3 rounded-lg border text-left transition-all ${
                    selectedClaim === claim.id
                      ? 'bg-[#C9A227] border-[#C9A227] text-[#0D0D0F]'
                      : 'bg-[#1E1E24] border-[#1E1E24] hover:border-[#C9A227]/50'
                  }`}
                >
                  <div className="font-medium text-sm mb-1">{claim.title}</div>
                  <div className="text-xs opacity-70">
                    Reliability: {calculateReliability(claim.evidenceIds)}% | 
                    Evidence: {claim.evidenceIds.length} sources
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Evidence Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {filteredEvidence.map(evidence => (
            <div key={evidence.id} className="bg-[#1E1E24] rounded-lg p-6 border border-[#1E1E24] hover:border-[#C9A227]/30 transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{evidence.icon}</span>
                  <div>
                    <div className="font-semibold text-[#F5F4F2]">{evidence.title}</div>
                    <div className="text-sm text-[#F5F4F2]/70">{evidence.type}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-[#C9A227]">{evidence.reliability}%</div>
                  <div className="text-xs text-[#F5F4F2]/60">reliability</div>
                </div>
              </div>

              <p className="text-[#F5F4F2]/80 text-sm mb-4">{evidence.description}</p>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#F5F4F2]/60">Location:</span>
                  <span className="text-[#F5F4F2]">{evidence.location}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#F5F4F2]/60">Date:</span>
                  <span className="text-[#F5F4F2]">{evidence.date}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#F5F4F2]/60">Era:</span>
                  <span 
                    className="px-2 py-1 rounded text-white text-xs font-medium"
                    style={{ backgroundColor: eraColors[evidence.era] }}
                  >
                    {evidence.era}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#F5F4F2]/60">Language:</span>
                  <span 
                    className="px-2 py-1 rounded text-white text-xs font-medium"
                    style={{ backgroundColor: languageColors[evidence.language] }}
                  >
                    {evidence.language === 'greek' ? 'Α Greek' : 'L Latin'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredEvidence.length === 0 && (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold mb-2">No Evidence Found</h3>
            <p className="text-[#F5F4F2]/70">Try adjusting your filters to see more results</p>
          </div>
        )}

        {/* Corroboration Analysis */}
        {selectedClaim && (
          <div className="mt-12 bg-[#1E1E24] rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">Evidence Corroboration</h2>
            {demoClaims
              .filter(claim => claim.id === selectedClaim)
              .map(claim => {
                const claimEvidence = demoEvidence.filter(e => claim.evidenceIds.includes(e.id))
                const reliability = calculateReliability(claim.evidenceIds)
                
                return (
                  <div key={claim.id}>
                    <h3 className="text-xl font-medium mb-2">{claim.title}</h3>
                    <p className="text-[#F5F4F2]/80 mb-4">{claim.description}</p>
                    
                    <div className="flex items-center gap-4 mb-6">
                      <div className="text-3xl font-bold text-[#C9A227]">{reliability}%</div>
                      <div>
                        <div className="font-semibold">Combined Reliability</div>
                        <div className="text-sm text-[#F5F4F2]/70">
                          Based on {claimEvidence.length} corroborating sources
                        </div>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {claimEvidence.map(evidence => (
                        <div key={evidence.id} className="bg-[#0D0D0F] rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <span>{evidence.icon}</span>
                            <span className="font-medium text-sm">{evidence.type}</span>
                            <span className="ml-auto text-[#C9A227] font-bold text-sm">
                              {evidence.reliability}%
                            </span>
                          </div>
                          <div className="text-xs text-[#F5F4F2]/70">{evidence.title}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
          </div>
        )}
      </div>
    </div>
  )
}