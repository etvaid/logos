'use client'

import React, { useState } from 'react'

const DISCOVERIES = [
  {
    id: 1,
    title: "Homer's Wine-Dark Sea in Early Christian Hymnography",
    type: "Pattern",
    confidence: 87,
    novelty: 92,
    description: "AI detected systematic adaptation of Homeric maritime imagery in 4th-century Christian hymns, particularly the transformation of 'wine-dark sea' into metaphors for spiritual depth and divine mystery.",
    evidence: [
      "οἶνοψ πόντος appears in 23 Homeric contexts",
      "Parallel βαθύς μυστήριον in Ephrem's hymns",
      "Semantic bridging through 'depth' metaphor",
      "Geographic clustering in Cappadocian texts"
    ],
    language: "Greek",
    era: "lateAntique"
  },
  {
    id: 2,
    title: "Stoic Technical Vocabulary in Pauline Epistles",
    type: "Influence",
    confidence: 94,
    novelty: 78,
    description: "Systematic borrowing of Stoic philosophical terminology in Paul's letters, particularly in discussions of virtue, emotion, and cosmic order, suggesting deeper philosophical engagement than previously recognized.",
    evidence: [
      "προκοπή (moral progress) in Phil 1:12",
      "αὐτάρκεια (self-sufficiency) recontextualized",
      "15 technical terms with Stoic parallels",
      "Conceptual frameworks match Epictetus"
    ],
    language: "Greek",
    era: "imperial"
  },
  {
    id: 3,
    title: "Virgil's Systematic Debt to Ennian Prosody",
    type: "Pattern",
    confidence: 91,
    novelty: 85,
    description: "Machine analysis reveals previously undetected patterns of Ennian influence on Virgilian hexameter, including specific rhythmic signatures and caesura preferences inherited from the Annales.",
    evidence: [
      "67% match in 4th-foot caesura patterns",
      "Ennian spondaic rhythm clusters",
      "Alliterative sequences mirror Annales",
      "Statistical significance p<0.001"
    ],
    language: "Latin",
    era: "imperial"
  },
  {
    id: 4,
    title: "θεραπεία: From 'Service' to 'Healing' - A Semantic Reversal",
    type: "Semantic",
    confidence: 96,
    novelty: 89,
    description: "Traced the complete semantic evolution of θεραπεία from 'religious service/attendance' in archaic texts to 'medical healing' in Hellenistic period, revealing key transitional contexts in classical drama.",
    evidence: [
      "Archaic: 89% religious contexts (Homer, Hesiod)",
      "Classical: 34% medical usage emerges (Sophocles)",
      "Hellenistic: 78% medical (Hippocratic corpus)",
      "Key pivot in Euripides' Alcestis 1087"
    ],
    language: "Greek",
    era: "classical"
  },
  {
    id: 5,
    title: "Platonic Forms Theory in Early Islamic Falsafa",
    type: "Influence",
    confidence: 88,
    novelty: 94,
    description: "AI translation analysis reveals direct textual parallels between Republic VII and early Arabic philosophical texts, suggesting more extensive Greek manuscript availability than historical records indicate.",
    evidence: [
      "Cave allegory parallels in al-Farabi's Perfect State",
      "Technical terminology: 'idea' → 'mithāl'",
      "Structural argument mapping 85% congruent",
      "Previously unknown translation pathway"
    ],
    language: "Greek",
    era: "classical"
  },
  {
    id: 6,
    title: "Hidden Sappho Fragments in Papyrus Marginalia",
    type: "Discovery",
    confidence: 82,
    novelty: 98,
    description: "Computer vision analysis of papyrus margins identified 12 previously overlooked lines with Sapphic meter and vocabulary patterns, hidden in the margins of P.Oxy 1787 housing Alcaeus fragments.",
    evidence: [
      "Aeolic meter signature matches known Sappho",
      "4 hapax legomena consistent with dialect",
      "Paleographic analysis confirms 3rd century",
      "Thematic coherence with fr. 94 (farewell poems)"
    ],
    language: "Greek",
    era: "archaic"
  }
]

const DISCOVERY_TYPES = ['All', 'Pattern', 'Influence', 'Semantic', 'Discovery']

const TYPE_COLORS = {
  Pattern: '#3B82F6',
  Influence: '#DC2626', 
  Semantic: '#F59E0B',
  Discovery: '#7C3AED'
}

const ERA_COLORS = {
  archaic: '#D97706',
  classical: '#F59E0B', 
  imperial: '#DC2626',
  lateAntique: '#7C3AED'
}

const LANGUAGE_COLORS = {
  Greek: '#3B82F6',
  Latin: '#DC2626'
}

function DiscoveryEngine() {
  const [selectedType, setSelectedType] = useState('All')
  
  const filteredDiscoveries = selectedType === 'All' 
    ? DISCOVERIES 
    : DISCOVERIES.filter(d => d.type === selectedType)

  const MeterBar = ({ value, label, color }: { value: number; label: string; color: string }) => (
    <div className="mb-2">
      <div className="flex justify-between text-xs mb-1">
        <span className="text-[#F5F4F2]">{label}</span>
        <span className="text-[#F5F4F2]">{value}%</span>
      </div>
      <div className="w-full bg-gray-700 rounded-full h-2">
        <div 
          className="h-2 rounded-full transition-all duration-300"
          style={{ 
            width: `${value}%`,
            backgroundColor: color
          }}
        />
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#0D0D0F] text-[#F5F4F2]">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[#C9A227] mb-4">
            Discovery Engine
          </h1>
          <p className="text-xl text-[#F5F4F2] max-w-3xl mx-auto">
            AI-powered insights revealing hidden patterns, influences, and connections across classical antiquity
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex justify-center mb-8">
          <div className="flex gap-2 bg-gray-800 p-1 rounded-lg">
            {DISCOVERY_TYPES.map(type => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-4 py-2 rounded-md transition-all ${
                  selectedType === type
                    ? 'bg-[#C9A227] text-[#0D0D0F] font-semibold'
                    : 'text-[#F5F4F2] hover:bg-gray-700'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <div className="text-center mb-6">
          <span className="text-[#C9A227] font-semibold">
            {filteredDiscoveries.length} discoveries found
          </span>
        </div>

        {/* Discovery Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredDiscoveries.map(discovery => (
            <div key={discovery.id} className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-[#C9A227] transition-colors">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-[#F5F4F2] mb-2">
                    {discovery.title}
                  </h3>
                  <div className="flex items-center gap-3 flex-wrap">
                    <span 
                      className="px-3 py-1 rounded-full text-sm font-semibold text-white"
                      style={{ backgroundColor: TYPE_COLORS[discovery.type as keyof typeof TYPE_COLORS] }}
                    >
                      {discovery.type}
                    </span>
                    <span 
                      className="px-2 py-1 rounded text-xs font-bold text-white"
                      style={{ backgroundColor: LANGUAGE_COLORS[discovery.language as keyof typeof LANGUAGE_COLORS] }}
                    >
                      {discovery.language === 'Greek' ? 'Α' : 'L'}
                    </span>
                    <span 
                      className="px-2 py-1 rounded text-xs text-white"
                      style={{ backgroundColor: ERA_COLORS[discovery.era as keyof typeof ERA_COLORS] }}
                    >
                      {discovery.era}
                    </span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-[#F5F4F2] mb-4 leading-relaxed">
                {discovery.description}
              </p>

              {/* Confidence and Novelty Meters */}
              <div className="mb-4">
                <MeterBar 
                  value={discovery.confidence} 
                  label="Confidence" 
                  color="#10B981" 
                />
                <MeterBar 
                  value={discovery.novelty} 
                  label="Novelty" 
                  color="#C9A227" 
                />
              </div>

              {/* Evidence */}
              <div>
                <h4 className="font-semibold text-[#C9A227] mb-2">Key Evidence:</h4>
                <ul className="space-y-1">
                  {discovery.evidence.map((item, index) => (
                    <li key={index} className="text-sm text-[#F5F4F2] flex items-start">
                      <span className="text-[#C9A227] mr-2">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredDiscoveries.length === 0 && (
          <div className="text-center py-12">
            <p className="text-xl text-gray-400">
              No discoveries found for the selected filter.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default DiscoveryEngine