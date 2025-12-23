'use client'

import React, { useState } from 'react'

const AuthorOriginsMap = () => {
  const [selectedEra, setSelectedEra] = useState<string>('all')
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all')
  const [selectedAuthor, setSelectedAuthor] = useState<any>(null)

  const authors = [
    {
      name: 'Homer',
      location: 'Ionia',
      coordinates: { x: 38.4, y: 27.1 },
      language: 'greek',
      era: 'archaic',
      corpusSize: 'large',
      works: ['Iliad', 'Odyssey'],
      dates: '8th century BCE'
    },
    {
      name: 'Plato',
      location: 'Athens',
      coordinates: { x: 37.9, y: 23.7 },
      language: 'greek',
      era: 'classical',
      corpusSize: 'large',
      works: ['Republic', 'Phaedo', 'Symposium'],
      dates: '428-348 BCE'
    },
    {
      name: 'Aristotle',
      location: 'Stagira',
      coordinates: { x: 40.5, y: 23.7 },
      language: 'greek',
      era: 'classical',
      corpusSize: 'large',
      works: ['Nicomachean Ethics', 'Politics', 'Poetics'],
      dates: '384-322 BCE'
    },
    {
      name: 'Virgil',
      location: 'Mantua',
      coordinates: { x: 45.1, y: 10.8 },
      language: 'latin',
      era: 'imperial',
      corpusSize: 'medium',
      works: ['Aeneid', 'Georgics', 'Eclogues'],
      dates: '70-19 BCE'
    },
    {
      name: 'Cicero',
      location: 'Arpinum',
      coordinates: { x: 41.6, y: 13.6 },
      language: 'latin',
      era: 'imperial',
      corpusSize: 'large',
      works: ['Catiline Orations', 'De Officiis'],
      dates: '106-43 BCE'
    },
    {
      name: 'Augustine',
      location: 'Thagaste',
      coordinates: { x: 36.3, y: 8.0 },
      language: 'latin',
      era: 'lateAntique',
      corpusSize: 'large',
      works: ['Confessions', 'City of God'],
      dates: '354-430 CE'
    }
  ]

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

  const corpusSizes = {
    small: 8,
    medium: 12,
    large: 16
  }

  const filteredAuthors = authors.filter(author => {
    if (selectedEra !== 'all' && author.era !== selectedEra) return false
    if (selectedLanguage !== 'all' && author.language !== selectedLanguage) return false
    return true
  })

  const convertCoordinates = (lat: number, lon: number) => {
    // Convert real coordinates to SVG viewBox (simplified projection)
    const x = ((lon + 180) / 360) * 800 + 100
    const y = ((90 - lat) / 180) * 400 + 50
    return { x, y }
  }

  return (
    <div className="w-full h-full bg-[#0D0D0F] text-[#F5F4F2] p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[#C9A227] mb-2">Author Origins</h1>
        <p className="text-[#F5F4F2]/70">Explore the geographical origins of classical authors</p>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium mb-2">Era</label>
          <select
            value={selectedEra}
            onChange={(e) => setSelectedEra(e.target.value)}
            className="bg-[#1E1E24] border border-[#C9A227]/20 rounded px-3 py-2 text-[#F5F4F2]"
          >
            <option value="all">All Eras</option>
            <option value="archaic">Archaic</option>
            <option value="classical">Classical</option>
            <option value="hellenistic">Hellenistic</option>
            <option value="imperial">Imperial</option>
            <option value="lateAntique">Late Antique</option>
            <option value="byzantine">Byzantine</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Language</label>
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="bg-[#1E1E24] border border-[#C9A227]/20 rounded px-3 py-2 text-[#F5F4F2]"
          >
            <option value="all">All Languages</option>
            <option value="greek">Greek</option>
            <option value="latin">Latin</option>
          </select>
        </div>
      </div>

      {/* Legend */}
      <div className="flex gap-8 mb-6 text-sm">
        <div>
          <h3 className="font-semibold mb-2">Languages</h3>
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-[#3B82F6]"></div>
              <span>Greek (Α)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-[#DC2626]"></div>
              <span>Latin (L)</span>
            </div>
          </div>
        </div>
        <div>
          <h3 className="font-semibold mb-2">Corpus Size</h3>
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#C9A227]"></div>
              <span>Small</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#C9A227]"></div>
              <span>Medium</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-[#C9A227]"></div>
              <span>Large</span>
            </div>
          </div>
        </div>
      </div>

      {/* Map */}
      <div className="relative">
        <svg
          viewBox="0 0 1000 500"
          className="w-full h-96 bg-[#1E1E24] rounded-lg border border-[#C9A227]/20"
        >
          {/* Simplified Mediterranean outline */}
          <path
            d="M100 300 Q200 250 300 280 Q400 270 500 275 Q600 280 700 285 Q800 290 900 300 L900 400 Q800 380 700 385 Q600 390 500 385 Q400 380 300 385 Q200 390 100 395 Z"
            fill="none"
            stroke="#C9A227"
            strokeWidth="1"
            opacity="0.3"
          />
          
          {/* Land masses (simplified) */}
          <ellipse cx="200" cy="200" rx="80" ry="40" fill="#C9A227" opacity="0.1" />
          <ellipse cx="400" cy="180" rx="60" ry="30" fill="#C9A227" opacity="0.1" />
          <ellipse cx="600" cy="170" rx="70" ry="35" fill="#C9A227" opacity="0.1" />
          <ellipse cx="300" cy="350" rx="100" ry="50" fill="#C9A227" opacity="0.1" />

          {/* Author markers */}
          {filteredAuthors.map((author, index) => {
            const coords = convertCoordinates(author.coordinates.x, author.coordinates.y)
            const size = corpusSizes[author.corpusSize as keyof typeof corpusSizes]
            const color = languageColors[author.language as keyof typeof languageColors]
            
            return (
              <g key={author.name}>
                <circle
                  cx={coords.x}
                  cy={coords.y}
                  r={size}
                  fill={color}
                  stroke="#0D0D0F"
                  strokeWidth="2"
                  className="cursor-pointer hover:opacity-80"
                  onClick={() => setSelectedAuthor(author)}
                />
                <text
                  x={coords.x}
                  y={coords.y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  className="text-xs font-bold fill-white pointer-events-none"
                >
                  {author.language === 'greek' ? 'Α' : 'L'}
                </text>
                <text
                  x={coords.x}
                  y={coords.y + size + 15}
                  textAnchor="middle"
                  className="text-xs fill-[#F5F4F2] pointer-events-none"
                >
                  {author.name}
                </text>
              </g>
            )
          })}
        </svg>
      </div>

      {/* Author Info Popup */}
      {selectedAuthor && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#1E1E24] border border-[#C9A227]/20 rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-[#C9A227]">{selectedAuthor.name}</h3>
              <button
                onClick={() => setSelectedAuthor(null)}
                className="text-[#F5F4F2]/70 hover:text-[#F5F4F2]"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-3 text-sm">
              <div>
                <span className="font-medium">Origin:</span> {selectedAuthor.location}
              </div>
              <div>
                <span className="font-medium">Language:</span>
                <span
                  className="ml-2 px-2 py-1 rounded text-xs"
                  style={{ backgroundColor: languageColors[selectedAuthor.language as keyof typeof languageColors] }}
                >
                  {selectedAuthor.language === 'greek' ? 'Greek (Α)' : 'Latin (L)'}
                </span>
              </div>
              <div>
                <span className="font-medium">Era:</span>
                <span
                  className="ml-2 px-2 py-1 rounded text-xs"
                  style={{ backgroundColor: eraColors[selectedAuthor.era as keyof typeof eraColors] }}
                >
                  {selectedAuthor.era}
                </span>
              </div>
              <div>
                <span className="font-medium">Dates:</span> {selectedAuthor.dates}
              </div>
              <div>
                <span className="font-medium">Major Works:</span>
                <ul className="mt-1 ml-4">
                  {selectedAuthor.works.map((work: string, index: number) => (
                    <li key={index} className="text-[#F5F4F2]/70">• {work}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="mt-6 grid grid-cols-3 gap-4 text-center">
        <div className="bg-[#1E1E24] rounded-lg p-4">
          <div className="text-2xl font-bold text-[#C9A227]">{filteredAuthors.length}</div>
          <div className="text-sm text-[#F5F4F2]/70">Authors Shown</div>
        </div>
        <div className="bg-[#1E1E24] rounded-lg p-4">
          <div className="text-2xl font-bold text-[#3B82F6]">
            {filteredAuthors.filter(a => a.language === 'greek').length}
          </div>
          <div className="text-sm text-[#F5F4F2]/70">Greek Authors</div>
        </div>
        <div className="bg-[#1E1E24] rounded-lg p-4">
          <div className="text-2xl font-bold text-[#DC2626]">
            {filteredAuthors.filter(a => a.language === 'latin').length}
          </div>
          <div className="text-sm text-[#F5F4F2]/70">Latin Authors</div>
        </div>
      </div>
    </div>
  )
}

export default AuthorOriginsMap