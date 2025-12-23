'use client'

import React, { useState, useEffect } from 'react'

interface TimelineEvent {
  year: number
  title: string
  era: 'archaic' | 'classical' | 'hellenistic' | 'imperial' | 'lateAntique' | 'byzantine'
  category: 'political' | 'religious' | 'intellectual'
  importance: number
  description: string
}

const demoEvents: TimelineEvent[] = [
  {
    year: -490,
    title: 'Battle of Marathon',
    era: 'archaic',
    category: 'political',
    importance: 8,
    description: 'Athenians defeat Persian forces in decisive battle'
  },
  {
    year: -399,
    title: 'Death of Socrates',
    era: 'classical',
    category: 'intellectual',
    importance: 9,
    description: 'Philosopher executed by drinking hemlock'
  },
  {
    year: -323,
    title: 'Death of Alexander',
    era: 'classical',
    category: 'political',
    importance: 10,
    description: 'Alexander the Great dies, empire fragments'
  },
  {
    year: -44,
    title: 'Caesar Assassination',
    era: 'imperial',
    category: 'political',
    importance: 9,
    description: 'Julius Caesar killed on the Ides of March'
  },
  {
    year: 33,
    title: 'Crucifixion',
    era: 'imperial',
    category: 'religious',
    importance: 10,
    description: 'Crucifixion of Jesus Christ'
  },
  {
    year: 313,
    title: 'Edict of Milan',
    era: 'lateAntique',
    category: 'religious',
    importance: 8,
    description: 'Constantine legalizes Christianity'
  },
  {
    year: 476,
    title: 'Fall of Rome',
    era: 'lateAntique',
    category: 'political',
    importance: 10,
    description: 'Last Western Roman Emperor deposed'
  },
  {
    year: 529,
    title: 'Academy Closes',
    era: 'byzantine',
    category: 'intellectual',
    importance: 7,
    description: 'Justinian closes Platonic Academy'
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

export default function TimelinePage() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['political', 'religious', 'intellectual'])
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentYear, setCurrentYear] = useState(-490)
  
  const filteredEvents = demoEvents.filter(event => 
    selectedCategories.includes(event.category)
  )

  const minYear = Math.min(...demoEvents.map(e => e.year))
  const maxYear = Math.max(...demoEvents.map(e => e.year))

  const formatYear = (year: number) => {
    return year < 0 ? `${Math.abs(year)} BCE` : `${year} CE`
  }

  const getPositionX = (year: number) => {
    return ((year - minYear) / (maxYear - minYear)) * 100
  }

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentYear(prev => {
          if (prev >= maxYear) {
            setIsPlaying(false)
            return minYear
          }
          return prev + 20
        })
      }, 200)
    }
    return () => clearInterval(interval)
  }, [isPlaying, minYear, maxYear])

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    )
  }

  const visibleEvents = filteredEvents.filter(event => 
    !isPlaying || event.year <= currentYear
  )

  return (
    <div className="min-h-screen bg-[#0D0D0F] text-[#F5F4F2] p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#C9A227] mb-4">Historical Timeline</h1>
          
          {/* Controls */}
          <div className="flex flex-wrap gap-4 items-center mb-6">
            <div className="flex gap-2">
              {['political', 'religious', 'intellectual'].map(category => (
                <button
                  key={category}
                  onClick={() => toggleCategory(category)}
                  className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                    selectedCategories.includes(category)
                      ? 'bg-[#C9A227] text-[#0D0D0F]'
                      : 'bg-[#1E1E24] text-[#F5F4F2] hover:bg-[#2A2A32]'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
            
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="px-4 py-2 bg-[#C9A227] text-[#0D0D0F] rounded font-medium hover:bg-[#D4AD2A] transition-colors"
            >
              {isPlaying ? '⏸️ Pause' : '▶️ Play'}
            </button>
            
            {isPlaying && (
              <span className="text-[#C9A227] font-medium">
                {formatYear(currentYear)}
              </span>
            )}
          </div>

          {/* Timeline */}
          <div className="relative bg-[#1E1E24] rounded-lg p-8 h-64 overflow-hidden">
            {/* Timeline line */}
            <div className="absolute top-32 left-8 right-8 h-1 bg-[#2A2A32]"></div>
            
            {/* Year markers */}
            <div className="absolute top-36 left-8 right-8">
              {[-500, -400, -300, -200, -100, 0, 100, 200, 300, 400, 500].map(year => {
                if (year >= minYear && year <= maxYear) {
                  return (
                    <div
                      key={year}
                      className="absolute text-xs text-gray-400"
                      style={{ left: `${getPositionX(year)}%`, transform: 'translateX(-50%)' }}
                    >
                      {formatYear(year)}
                    </div>
                  )
                }
                return null
              })}
            </div>

            {/* Events */}
            {visibleEvents.map((event, index) => (
              <div
                key={index}
                className="absolute cursor-pointer group"
                style={{
                  left: `${getPositionX(event.year)}%`,
                  top: '50%',
                  transform: 'translate(-50%, -50%)'
                }}
                onClick={() => setSelectedEvent(event)}
              >
                <div
                  className="rounded-full border-2 border-white hover:scale-110 transition-transform"
                  style={{
                    backgroundColor: eraColors[event.era],
                    width: `${event.importance * 4}px`,
                    height: `${event.importance * 4}px`
                  }}
                />
                <div className="absolute top-8 left-1/2 transform -translate-x-1/2 bg-[#0D0D0F] px-2 py-1 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-10">
                  {event.title}
                </div>
              </div>
            ))}

            {/* Current year indicator during animation */}
            {isPlaying && (
              <div
                className="absolute top-0 bottom-0 w-px bg-[#C9A227] opacity-80"
                style={{
                  left: `${getPositionX(currentYear)}%`
                }}
              />
            )}
          </div>

          {/* Legend */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
            <div>
              <h3 className="text-lg font-semibold mb-2 text-[#C9A227]">Eras</h3>
              <div className="space-y-1">
                {Object.entries(eraColors).map(([era, color]) => (
                  <div key={era} className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: color }}
                    />
                    <span className="text-sm capitalize">{era}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2 text-[#C9A227]">Categories</h3>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm">🏛️ Political</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm">✝️ Religious</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm">🎓 Intellectual</span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2 text-[#C9A227]">Size</h3>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-gray-400"/>
                  <span className="text-sm">Minor</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-gray-400"/>
                  <span className="text-sm">Major</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-gray-400"/>
                  <span className="text-sm">Critical</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Event Details Modal */}
        {selectedEvent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-[#1E1E24] rounded-lg p-6 max-w-md w-full">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold text-[#C9A227]">{selectedEvent.title}</h2>
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-3">
                <div>
                  <span className="text-sm text-gray-400">Date: </span>
                  <span>{formatYear(selectedEvent.year)}</span>
                </div>
                
                <div>
                  <span className="text-sm text-gray-400">Era: </span>
                  <span className="capitalize" style={{ color: eraColors[selectedEvent.era] }}>
                    {selectedEvent.era}
                  </span>
                </div>
                
                <div>
                  <span className="text-sm text-gray-400">Category: </span>
                  <span className="capitalize">{selectedEvent.category}</span>
                </div>
                
                <div>
                  <span className="text-sm text-gray-400">Importance: </span>
                  <span>{selectedEvent.importance}/10</span>
                </div>
                
                <div>
                  <span className="text-sm text-gray-400">Description: </span>
                  <p className="mt-1">{selectedEvent.description}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}