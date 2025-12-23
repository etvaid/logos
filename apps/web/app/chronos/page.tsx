'use client'

import { useState } from 'react'
import { Search, Clock, TrendingUp, Users, Target } from 'lucide-react'

const ARETE_DATA = {
  word: "ἀρετή",
  eras: [
    {era: "Archaic", years: "800-500 BCE", color: "#D97706", meaning: "Excellence in battle, prowess", authors: ["Homer", "Hesiod"], confidence: 92},
    {era: "Classical", years: "500-323 BCE", color: "#F59E0B", meaning: "Moral excellence, virtue", authors: ["Plato", "Aristotle"], confidence: 95},
    {era: "Hellenistic", years: "323-31 BCE", color: "#3B82F6", meaning: "Philosophical virtue", authors: ["Stoics", "Epicureans"], confidence: 88},
    {era: "Imperial", years: "31 BCE-284 CE", color: "#DC2626", meaning: "Civic virtue", authors: ["Plutarch", "Epictetus"], confidence: 85},
    {era: "Late Antique", years: "284-600 CE", color: "#7C3AED", meaning: "Christian virtue", authors: ["Augustine", "Basil"], confidence: 90},
  ]
}

export default function ChronosPage() {
  const [selectedEra, setSelectedEra] = useState<number | null>(null)
  const [searchTerm, setSearchTerm] = useState("ἀρετή")

  const maxConfidence = Math.max(...ARETE_DATA.eras.map(e => e.confidence))

  return (
    <div className="min-h-screen bg-[#0D0D0F] text-[#F5F4F2]">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#1E1E24] to-[#0D0D0F]">
        <div className="absolute inset-0 bg-gradient-to-r from-[#C9A227]/5 to-transparent" />
        <div className="relative px-6 py-24">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center gap-4 mb-6">
              <Clock className="w-12 h-12 text-[#C9A227]" />
              <h1 className="text-6xl font-bold bg-gradient-to-r from-[#C9A227] to-[#F5F4F2] bg-clip-text text-transparent">
                CHRONOS
              </h1>
            </div>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Trace the evolution of concepts across millennia. Watch ideas transform through the lens of history.
            </p>
            <div className="text-sm text-[#C9A227] font-medium tracking-wider">
              CONCEPT EVOLUTION ENGINE
            </div>
          </div>
        </div>
      </div>

      {/* Search Section */}
      <div className="px-6 py-12 bg-[#1E1E24]">
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Enter concept to trace..."
              className="w-full pl-14 pr-6 py-4 bg-[#0D0D0F] border border-gray-700 rounded-xl text-[#F5F4F2] text-lg focus:outline-none focus:ring-2 focus:ring-[#C9A227] focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Timeline Section */}
      <div className="px-6 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">
              Evolution of <span className="text-[#C9A227]">{ARETE_DATA.word}</span>
            </h2>
            <p className="text-gray-400">Click on any era to explore its unique interpretation</p>
          </div>

          {/* Horizontal Timeline */}
          <div className="relative mb-12">
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-[#D97706] via-[#F59E0B] via-[#3B82F6] via-[#DC2626] to-[#7C3AED] transform -translate-y-1/2" />
            <div className="flex justify-between items-center relative">
              {ARETE_DATA.eras.map((era, index) => (
                <button
                  key={era.era}
                  onClick={() => setSelectedEra(selectedEra === index ? null : index)}
                  className={`relative group transition-all duration-300 ${
                    selectedEra === index ? 'scale-110' : 'hover:scale-105'
                  }`}
                >
                  <div 
                    className={`w-6 h-6 rounded-full border-4 border-[#0D0D0F] transition-all duration-300 ${
                      selectedEra === index ? 'w-8 h-8' : ''
                    }`}
                    style={{ backgroundColor: era.color }}
                  />
                  <div className="absolute top-10 left-1/2 transform -translate-x-1/2 text-center">
                    <div className="font-bold text-sm mb-1" style={{ color: era.color }}>
                      {era.era}
                    </div>
                    <div className="text-xs text-gray-400 whitespace-nowrap">
                      {era.years}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Era Details */}
          {selectedEra !== null && (
            <div className="bg-[#1E1E24] rounded-2xl p-8 border border-gray-700 mb-12 animate-in slide-in-from-bottom duration-300">
              <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <div className="flex items-center gap-3 mb-4">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: ARETE_DATA.eras[selectedEra].color }}
                    />
                    <h3 className="text-2xl font-bold">
                      {ARETE_DATA.eras[selectedEra].era} Period
                    </h3>
                    <span className="text-gray-400">
                      ({ARETE_DATA.eras[selectedEra].years})
                    </span>
                  </div>
                  <div className="text-lg text-gray-300 mb-6">
                    {ARETE_DATA.eras[selectedEra].meaning}
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-[#C9A227]" />
                      <span className="text-sm font-medium">Key Authors:</span>
                      <span className="text-sm text-gray-400">
                        {ARETE_DATA.eras[selectedEra].authors.join(", ")}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-center justify-center bg-[#0D0D0F] rounded-xl p-6">
                  <Target className="w-8 h-8 text-[#C9A227] mb-2" />
                  <div className="text-3xl font-bold mb-1">
                    {ARETE_DATA.eras[selectedEra].confidence}%
                  </div>
                  <div className="text-sm text-gray-400">Confidence Score</div>
                  <div className="w-full bg-gray-700 rounded-full h-2 mt-3">
                    <div 
                      className="h-2 rounded-full transition-all duration-500"
                      style={{ 
                        width: `${ARETE_DATA.eras[selectedEra].confidence}%`,
                        backgroundColor: ARETE_DATA.eras[selectedEra].color
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Semantic Drift Graph */}
          <div className="bg-[#1E1E24] rounded-2xl p-8 border border-gray-700">
            <div className="flex items-center gap-3 mb-6">
              <TrendingUp className="w-6 h-6 text-[#C9A227]" />
              <h3 className="text-2xl font-bold">Semantic Drift Analysis</h3>
            </div>
            <div className="relative h-64">
              <div className="absolute inset-0 flex items-end justify-between gap-2">
                {ARETE_DATA.eras.map((era, index) => (
                  <div key={era.era} className="flex-1 flex flex-col items-center">
                    <div 
                      className="w-full rounded-t-lg transition-all duration-700 delay-300"
                      style={{ 
                        height: `${(era.confidence / maxConfidence) * 200}px`,
                        backgroundColor: era.color
                      }}
                    />
                    <div className="text-xs text-gray-400 mt-2 text-center">
                      {era.era}
                    </div>
                  </div>
                ))}
              </div>
              <div className="absolute left-0 top-0 bottom-8 flex flex-col justify-between text-xs text-gray-500">
                <span>100%</span>
                <span>75%</span>
                <span>50%</span>
                <span>25%</span>
                <span>0%</span>
              </div>
            </div>
            <div className="text-center text-sm text-gray-400 mt-4">
              Confidence levels across historical periods
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}