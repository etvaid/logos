'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Clock, BookOpen, Zap, ArrowRight, Calendar, Globe, Layers, Filter, Star, TrendingUp, Eye, MapPin, Compass, Sparkles, ChevronDown, ChevronRight, Play, Pause, RotateCcw, FastForward } from 'lucide-react'
import { NarrativeTimeline } from '@/components/innovations/narrative_timeline'
import { MultiScaleView } from '@/components/innovations/multi_scale_view'
import { ComparativeFrames } from '@/components/innovations/comparative_frames'

interface TimelineEvent {
  date: string
  period: string
  word: string
  meaning: string
  context: string
  author: string
  work: string
  significance: string
  connections: string[]
}

interface SemanticEvolution {
  word: string
  periods: {
    era: string
    meaning: string
    frequency: number
    examples: { author: string; work: string; context: string }[]
  }[]
  trajectory: 'expanding' | 'narrowing' | 'shifting' | 'splitting'
}

interface EraData {
  name: string
  period: string
  description: string
  keyChanges: string[]
  majorAuthors: string[]
  color: string
}

const FEATURED_EVOLUTIONS: SemanticEvolution[] = [
  {
    word: 'λόγος',
    trajectory: 'expanding',
    periods: [
      {
        era: 'Archaic (800-480 BCE)',
        meaning: 'speech, account, story',
        frequency: 0.3,
        examples: [
          { author: 'Heraclitus', work: 'Fragments', context: 'Universal principle governing cosmos' },
          { author: 'Homer', work: 'Iliad', context: 'Speech in assembly, narrative account' }
        ]
      },
      {
        era: 'Classical (480-323 BCE)',
        meaning: 'reason, argument, proportion',
        frequency: 0.8,
        examples: [
          { author: 'Plato', work: 'Republic', context: 'Rational principle of soul and state' },
          { author: 'Aristotle', work: 'Rhetoric', context: 'Logical proof in persuasion' }
        ]
      },
      {
        era: 'Hellenistic (323-146 BCE)',
        meaning: 'divine reason, cosmic law',
        frequency: 0.6,
        examples: [
          { author: 'Epictetus', work: 'Discourses', context: 'Divine rational principle in nature' },
          { author: 'Marcus Aurelius', work: 'Meditations', context: 'Universal reason governing fate' }
        ]
      },
      {
        era: 'Koine (146 BCE-600 CE)',
        meaning: 'Word of God, Christ as Logos',
        frequency: 0.9,
        examples: [
          { author: 'John', work: 'Gospel', context: 'In beginning was the Word (Logos)' },
          { author: 'Origen', work: 'Against Celsus', context: 'Christ as divine Logos incarnate' }
        ]
      }
    ]
  },
  {
    word: 'ἀρετή',
    trajectory: 'shifting',
    periods: [
      {
        era: 'Archaic (800-480 BCE)',
        meaning: 'excellence, prowess in battle',
        frequency: 0.7,
        examples: [
          { author: 'Homer', work: 'Iliad', context: 'Heroic excellence in war and combat' },
          { author: 'Hesiod', work: 'Works and Days', context: 'Excellence in work and craft' }
        ]
      },
      {
        era: 'Classical (480-323 BCE)',
        meaning: 'moral virtue, character excellence',
        frequency: 0.9,
        examples: [
          { author: 'Aristotle', work: 'Nicomachean Ethics', context: 'Habit of choosing the mean between extremes' },
          { author: 'Plato', work: 'Republic', context: 'Justice as harmony of soul\'s parts' }
        ]
      },
      {
        era: 'Hellenistic (323-146 BCE)',
        meaning: 'wisdom, philosophical virtue',
        frequency: 0.8,
        examples: [
          { author: 'Epictetus', work: 'Enchiridion', context: 'Virtue as only true good, wisdom in action' },
          { author: 'Cicero', work: 'De Finibus', context: 'Virtue sufficient for happiness' }
        ]
      }
    ]
  },
  {
    word: 'φιλοσοφία',
    trajectory: 'narrowing',
    periods: [
      {
        era: 'Classical (480-323 BCE)',
        meaning: 'love of wisdom, intellectual curiosity',
        frequency: 0.4,
        examples: [
          { author: 'Herodotus', work: 'Histories', context: 'Solon\'s travels for learning and observation' },
          { author: 'Plato', work: 'Phaedrus', context: 'Philosophical eros, ascent to truth' }
        ]
      },
      {
        era: 'Hellenistic (323-146 BCE)',
        meaning: 'systematic discipline, school doctrine',
        frequency: 0.8,
        examples: [
          { author: 'Sextus Empiricus', work: 'Outlines', context: 'Philosophical schools and their dogmas' },
          { author: 'Diogenes Laertius', work: 'Lives', context: 'Biographical tradition of philosophers' }
        ]
      },
      {
        era: 'Late Antique (146 BCE-600 CE)',
        meaning: 'theoretical knowledge vs. practical wisdom',
        frequency: 0.6,
        examples: [
          { author: 'Plotinus', work: 'Enneads', context: 'Philosophical contemplation of the One' },
          { author: 'Augustine', work: 'City of God', context: 'Pagan philosophy vs. Christian revelation' }
        ]
      }
    ]
  }
]

const HISTORICAL_ERAS: EraData[] = [
  {
    name: 'Archaic',
    period: '800-480 BCE',
    description: 'Epic poetry, early lyric, emergence of philosophical thinking',
    keyChanges: ['Oral to written transition', 'Religious to rational explanations', 'Heroic to civic values'],
    majorAuthors: ['Homer', 'Hesiod', 'Heraclitus', 'Sappho', 'Solon'],
    color: '#8B4513'
  },
  {
    name: 'Classical',
    period: '480-323 BCE',
    description: 'Athenian democracy, philosophical schools, dramatic flourishing',
    keyChanges: ['Systematic philosophy', 'Democratic vocabulary', 'Technical terminology'],
    majorAuthors: ['Plato', 'Aristotle', 'Sophocles', 'Thucydides', 'Demosthenes'],
    color: '#C9A962'
  },
  {
    name: 'Hellenistic',
    period: '323-146 BCE',
    description: 'Cultural fusion, competing schools, individual focus',
    keyChanges: ['Cosmopolitan outlook', 'Therapeutic philosophy', 'Scientific specialization'],
    majorAuthors: ['Epicurus', 'Chrysippus', 'Archimedes', 'Apollonius', 'Callimachus'],
    color: '#7C9885'
  },
  {
    name: 'Roman',
    period: '146 BCE-284 CE',
    description: 'Greek culture in Roman context, synthesis and preservation',
    keyChanges: ['Political adaptation', 'Religious syncretism', 'Educational codification'],
    majorAuthors: ['Plutarch', 'Epictetus', 'Marcus Aurelius', 'Galen', 'Ptolemy'],
    color: '#8B7355'
  },
  {
    name: 'Late Antique',
    period: '284-600 CE',
    description: 'Christian transformation, Neoplatonic synthesis, textual transmission',
    keyChanges: ['Theological vocabulary', 'Mystical language', 'Institutional preservation'],
    majorAuthors: ['Plotinus', 'John Chrysostom', 'Gregory Nazianzus', 'Proclus', 'Simplicius'],
    color: '#9932CC'
  }
]

const TIMELINE_EVENTS: TimelineEvent[] = [
  {
    date: '750 BCE',
    period: 'Archaic',
    word: 'ἀρετή',
    meaning: 'Excellence in battle, heroic prowess',
    context: 'Achilles chooses short life with eternal glory',
    author: 'Homer',
    work: 'Iliad 9.412-416',
    significance: 'Establishes heroic conception of excellence',
    connections: ['κλέος', 'τιμή', 'μένος']
  },
  {
    date: '500 BCE',
    period: 'Archaic',
    word: 'λόγος',
    meaning: 'Universal principle, cosmic order',
    context: 'Hidden harmony stronger than apparent',
    author: 'Heraclitus',
    work: 'Fragment 54',
    significance: 'First philosophical use of logos as cosmic principle',
    connections: ['ἁρμονία', 'κόσμος', 'φύσις']
  },
  {
    date: '380 BCE',
    period: 'Classical',
    word: 'δικαιοσύνη',
    meaning: 'Justice as psychic harmony',
    context: 'Each part of soul doing its proper work',
    author: 'Plato',
    work: 'Republic 441c-442d',
    significance: 'Transforms justice from legal to psychological concept',
    connections: ['ψυχή', 'ἀρετή', 'εἰκών']
  },
  {
    date: '335 BCE',
    period: 'Classical',
    word: 'φιλία',
    meaning: 'Friendship as highest ethical bond',
    context: 'Three types: utility, pleasure, virtue',
    author: 'Aristotle',
    work: 'Nicomachean Ethics VIII.3-4',
    significance: 'Systematic analysis of interpersonal relationships',
    connections: ['ἀρετή', 'εὐδαιμονία', 'κοινωνία']
  },
  {
    date: '100 CE',
    period: 'Roman',
    word: 'προαίρεσις',
    meaning: 'Moral choice, faculty of decision',
    context: 'What is up to us vs. not up to us',
    author: 'Epictetus',
    work: 'Discourses 1.1.7-12',
    significance: 'Central Stoic concept of human agency',
    connections: ['ἐλευθερία', 'ἀρετή', 'εὐδαιμονία']
  },
  {
    date: '30 CE',
    period: 'Koine',
    word: 'λόγος',
    meaning: 'Divine Word, Christ as cosmic principle',
    context: 'In the beginning was the Word',
    author: 'John',
    work: 'Gospel 1:1',
    significance: 'Christianization of philosophical terminology',
    connections: ['θεός', 'σάρξ', 'ζωή']
  }
]

export default function ChronosSemanticTimeTravel() {
  const [selectedEra, setSelectedEra] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedWord, setSelectedWord] = useState<SemanticEvolution | null>(null)
  const [timelinePosition, setTimelinePosition] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [viewMode, setViewMode] = useState<'timeline' | 'evolution' | 'comparison'>('timeline')
  const [hoveredEvent, setHoveredEvent] = useState<TimelineEvent | null>(null)
  const [loading, setLoading] = useState(false)
  const [searchResults, setSearchResults] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isPlaying) {
      interval = setInterval(() => {
        setTimelinePosition(prev => (prev + 1) % 100)
      }, 100)
    }
    return () => clearInterval(interval)
  }, [isPlaying])

  const handleSearch = async (query: string) => {
    setLoading(true)
    setSearchQuery(query)
    
    // Simulate search delay
    await new Promise(resolve => setTimeout(resolve, 800))
    
    if (query.length > 2) {
      const mockResults = [
        'λόγος', 'ἀρετή', 'δικαιοσύνη', 'φιλία', 'σοφία', 'ἔρως', 'τέχνη', 'φύσις'
      ].filter(word => word.toLowerCase().includes(query.toLowerCase()))
      setSearchResults(mockResults)
    } else {
      setSearchResults([])
    }
    setLoading(false)
  }

  const filteredEvents = TIMELINE_EVENTS.filter(event => {
    const matchesEra = selectedEra === 'all' || event.period === selectedEra
    const matchesSearch = !searchQuery || 
      event.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.meaning.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.author.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesEra && matchesSearch
  })

  const getTrajectoryIcon = (trajectory: SemanticEvolution['trajectory']) => {
    switch (trajectory) {
      case 'expanding': return <TrendingUp className="w-4 h-4 text-green-400" />
      case 'narrowing': return <TrendingUp className="w-4 h-4 text-blue-400 transform rotate-180" />
      case 'shifting': return <Compass className="w-4 h-4 text-yellow-400" />
      case 'splitting': return <Layers className="w-4 h-4 text-purple-400" />
    }
  }

  const getTrajectoryColor = (trajectory: SemanticEvolution['trajectory']) => {
    switch (trajectory) {
      case 'expanding': return 'text-green-400'
      case 'narrowing': return 'text-blue-400'
      case 'shifting': return 'text-yellow-400'
      case 'splitting': return 'text-purple-400'
    }
  }

  return (
    <div className="min-h-screen bg-[#0D0D0F] text-[#F5F3EF]">
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative overflow-hidden pt-32 pb-20"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[#C9A962]/10 via-transparent to-[#7C9885]/10" />
        
        <div className="relative max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 bg-[#C9A962]/10 px-4 py-2 rounded-full border border-[#C9A962]/20 mb-6">
              <Clock className="w-4 h-4 text-[#C9A962]" />
              <span className="text-sm font-medium text-[#C9A962]">CHRONOS</span>
              <Sparkles className="w-4 h-4 text-[#C9A962]" />
            </div>
            
            <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-[#F5F3EF] via-[#C9A962] to-[#F5F3EF] bg-clip-text text-transparent">
              Semantic Time Travel
            </h1>
            
            <p className="text-xl md:text-2xl text-[#F5F3EF]/70 max-w-4xl mx-auto leading-relaxed">
              Watch meanings evolve across centuries. Discover how Greek words transformed 
              from Homer's epics to Christian theology, revealing the hidden archaeology of ideas.
            </p>
          </motion.div>

          {/* Interactive Search */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="max-w-4xl mx-auto mb-12"
          >
            <div className="relative">
              <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
                <div className="flex items-center gap-4 mb-6">
                  <Search className="w-6 h-6 text-[#C9A962]" />
                  <input
                    type="text"
                    placeholder="Enter a Greek word (e.g., λόγος, ἀρετή, δικαιοσύνη)..."
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="flex-1 bg-transparent border-none outline-none text-lg placeholder-[#F5F3EF]/50"
                  />
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center gap-2 px-4 py-2 bg-[#7C9885]/20 hover:bg-[#7C9885]/30 rounded-lg transition-colors"
                  >
                    <Filter className="w-4 h-4" />
                    <span className="text-sm">Filters</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                  </button>
                </div>

                <AnimatePresence>
                  {showFilters && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t border-white/10 pt-6 mb-6"
                    >
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                        {HISTORICAL_ERAS.map((era) => (
                          <button
                            key={era.name}
                            onClick={() => setSelectedEra(era.name === selectedEra ? 'all' : era.name)}
                            className={`p-3 rounded-lg border transition-all ${
                              selectedEra === era.name
                                ? 'border-[#C9A962] bg-[#C9A962]/10 text-[#C9A962]'
                                : 'border-white/10 hover:border-white/20 bg-white/5'
                            }`}
                          >
                            <div className="font-medium text-sm">{era.name}</div>
                            <div className="text-xs opacity-70">{era.period}</div>
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Search Results */}
                <AnimatePresence>
                  {loading && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-3 text-[#C9A962]"
                    >
                      <div className="w-5 h-5 border-2 border-[#C9A962]/30 border-t-[#C9A962] rounded-full animate-spin" />
                      <span>Searching through millennia...</span>
                    </motion.div>
                  )}

                  {searchResults.length > 0 && !loading && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex flex-wrap gap-2"
                    >
                      {searchResults.map((word) => (
                        <button
                          key={word}
                          onClick={() => setSearchQuery(word)}
                          className="px-3 py-1 bg-[#C9A962]/20 hover:bg-[#C9A962]/30 rounded-lg text-sm transition-colors"
                        >
                          {word}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>

          {/* View Mode Selector */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex justify-center mb-12"
          >
            <div className="flex bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-2">
              {[
                { key: 'timeline', label: 'Timeline View', icon: Calendar },
                { key: 'evolution', label: 'Evolution Paths', icon: TrendingUp },
                { key: 'comparison', label: 'Period Compare', icon: Layers }
              ].map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setViewMode(key as any)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all ${
                    viewMode === key
                      ? 'bg-[#C9A962] text-[#0D0D0F] shadow-lg'
                      : 'text-[#F5F3EF]/70 hover:text-[#F5F3EF] hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="font-medium">{label}</span>
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <AnimatePresence mode="wait">
          {viewMode === 'timeline' && (
            <motion.div
              key="timeline"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              className="space-y-8"
            >
              {/* Timeline Controls */}
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                <div className="flex items-center gap-4 mb-6">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="flex items-center gap-2 px-4 py-2 bg-[#C9A962]/20 hover:bg-[#C9A962]/30 rounded-lg transition-colors"
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    <span>{isPlaying ? 'Pause' : 'Play'}</span>
                  </button>
                  
                  <button
                    onClick={() => setTimelinePosition(0)}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                  
                  <div className="flex-1 mx-4">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={timelinePosition}
                      onChange={(e) => setTimelinePosition(Number(e.target.value))}
                      className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer"
                      style={{
                        background: `linear-gradient(to right, #C9A962 0%, #C9A962 ${timelinePosition}%, rgba(255,255,255,0.1) ${timelinePosition}%, rgba(255,255,255,0.1) 100%)`
                      }}
                    />
                  </div>
                  
                  <div className="text-sm text-[#F5F3EF]/70">
                    {Math.round(800 - (timelinePosition * 14))} BCE - {Math.round(600 - (timelinePosition * 6))} CE
                  </div>
                </div>

                <NarrativeTimeline
                  events={filteredEvents}
                  selectedPeriod={selectedEra}
                  onEventHover={setHoveredEvent}
                  timelinePosition={timelinePosition}
                />
              </div>

              {/* Event Details */}
              <AnimatePresence>
                {hoveredEvent && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      <div className="lg:col-span-2">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="text-2xl font-bold text-[#C9A962]">{hoveredEvent.word}</div>
                          <div className="px-3 py-1 bg-[#7C9885]/20 rounded-lg text-sm">
                            {hoveredEvent.period}
                          </div>
                          <div className="text-sm text-[#F5F3EF]/60">{hoveredEvent.date}</div>
                        </div>
                        
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-semibold mb-2 text-[#C9A962]">Meaning</h4>
                            <p className="text-[#F5F3EF]/90">{hoveredEvent.meaning}</p>
                          </div>
                          
                          <div>
                            <h4 className="font-semibold mb-2 text-[#C9A962]">Context</h4>
                            <p className="text-[#F5F3EF]/90 italic">"{hoveredEvent.context}"</p>
                            <p className="text-sm text-[#F5F3EF]/60 mt-1">
                              — {hoveredEvent.author}, <em>{hoveredEvent.work}</em>
                            </p>
                          </div>
                          
                          <div>
                            <h4 className="font-semibold mb-2 text-[#C9A962]">Historical Significance</h4>
                            <p className="text-[#F5F3EF]/90">{hoveredEvent.significance}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold mb-3 text-[#C9A962]">Related Concepts</h4>
                        <div className="space-y-2">
                          {hoveredEvent.connections.map((connection) => (
                            <button
                              key={connection}
                              onClick={() => setSearchQuery(connection)}
                              className="block w-full text-left px-3 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors text-sm"
                            >
                              {connection}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {viewMode === 'evolution' && (
            <motion.div
              key="evolution"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              className="space-y-8"
            >
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">Featured Semantic Evolutions</h2>
                <p className="text-[#F5F3EF]/70 max-w-3xl mx-auto">
                  Trace how key philosophical terms transformed across millennia, 
                  revealing the intellectual history embedded in language itself.
                </p>
              </div>

              <MultiScaleView
                data={FEATURED_EVOLUTIONS}
                selectedItem={selectedWord}
                onItemSelect={setSelectedWord}
                scaleType="semantic"
              />

              {/* Evolution Details */}
              <AnimatePresence>
                {selectedWord && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8"
                  >
                    <div className="flex items-center gap-4 mb-8">
                      <div className="text-3xl font-bold text-[#C9A962]">{selectedWord.word}</div>
                      {getTrajectoryIcon(selectedWord.trajectory)}
                      <div className={`font-medium ${getTrajectoryColor(selectedWord.trajectory)}`}>
                        {selectedWord.trajectory.charAt(0).toUpperCase() + selectedWord.trajectory.slice(1)} Meaning
                      </div>
                    </div>

                    <div className="grid gap-6">
                      {selectedWord.periods.map((period, index) => (
                        <motion.div
                          key={period.era}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="bg-white/5 rounded-xl p-6 border-l-4"
                          style={{ borderColor: HISTORICAL_ERAS.find(era => period.era.includes(era.name))?.color || '#C9A962' }}
                        >
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <h3 className="text-xl font-bold text-[#C9A962]">{period.era}</h3>
                              <div className="flex items-center gap-2">
                                <div className="w-24 h-2 bg-white/10 rounded-full overflow-hidden">
                                  <div 
                                    className="h-full bg-[#C9A962] transition-all duration-1000"
                                    style={{ width: `${period.frequency * 100}%` }}
                                  />
                                </div>
                                <span className="text-sm text-[#F5F3EF]/60">
                                  {Math.round(period.frequency * 100)}% frequency
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="mb-4">
                            <h4 className="font-semibold mb-2 text-[#7C9885]">Primary Meaning</h4>
                            <p className="text-[#F5F3EF]/90 text-lg">{period.meaning}</p>
                          </div>

                          <div>
                            <h4 className="font-semibold mb-3 text-[#7C9885]">Key Examples</h4>
                            <div className="grid md:grid-cols-2 gap-4">
                              {period.examples.map((example, idx) => (
                                <div key={idx} className="bg-white/5 rounded-lg p-4">
                                  <div className="font-medium text-[#C9A962] mb-2">
                                    {example.author} — <em>{example.work}</em>
                                  </div>
                                  <p className="text-sm text-[#F5F3EF]/80 italic">"{example.context}"</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {viewMode === 'comparison' && (
            <motion.div
              key="comparison"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              className="space-y-8"
            >
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">Cross-Period Comparison</h2>
                <p className="text-[#F5F3EF]/70 max-w-3xl mx-auto">
                  Compare how the same concepts were understood across different historical periods, 
                  revealing the evolution of human thought.
                </p>
              </div>

              <ComparativeFrames
                items={HISTORICAL_ERAS}
                comparisonType="historical_periods"
                selectedItems={selectedEra !== 'all' ? [selectedEra] : []}
                onSelectionChange={(items) => setSelectedEra(items[0] || 'all')}
              />

              {/* Era Details */}
              {selectedEra !== 'all' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8"
                >
                  {(() => {
                    const era = HISTORICAL_ERAS.find(e => e.name === selectedEra)
                    if (!era) return null
                    
                    return (
                      <div>
                        <div className="flex items-center gap-4 mb-6">
                          <div className="text-3xl font-bold text-[#C9A962]">{era.name} Period</div>
                          <div className="px-4 py-2 bg-[#7C9885]/20 rounded-lg">
                            {era.period}
                          </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8">
                          <div>
                            <h3 className="text-xl font-bold mb-4 text-[#C9A962]">Historical Context</h3>
                            <p className="text-[#F5F3EF]/90 mb-6">{era.description}</p>

                            <h4 className="font-semibold mb-3 text-[#7C9885]">Key Linguistic Changes</h4>
                            <ul className="space-y-2">
                              {era.keyChanges.map((change, index) => (
                                <li key={index} className="flex items-center gap-3">
                                  <ChevronRight className="w-4 h-4 text-[#C9A962]" />
                                  <span className="text-[#F5F3EF]/80">{change}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div>
                            <h4 className="font-semibold mb-3 text-[#7C9885]">Major Authors</h4>
                            <div className="grid grid-cols-2 gap-3">
                              {era.majorAuthors.map((author) => (
                                <div
                                  key={author}
                                  className="px-4 py-3 bg-white/5 rounded-lg text-center hover:bg-white/10 transition-colors cursor-pointer"
                                >
                                  {author}
                                </div>
                              ))}
                            </div>

                            <div className="mt-8 p-4 bg-[#C9A962]/10 rounded-lg border border-[#C9A962]/20">
                              <div className="flex items-center gap-2 mb-2">
                                <Sparkles className="w-4 h-4 text-[#C9A962]" />
                                <span className="font-medium text-[#C9A962]">Period Insight</span>
                              </div>
                              <p className="text-sm text-[#F5F3EF]/80">
                                The {era.name} period represents a crucial turning point in semantic evolution, 
                                where traditional meanings underwent systematic transformation through 
                                {era.keyChanges[0].toLowerCase()}.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })()}
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* Call to Action */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="bg-gradient-to-r from-[#C9A962]/10 via-[#7C9885]/5 to-[#8B7355]/10 py-20"
      >
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-4xl font-bold mb-6">Begin Your Semantic Journey</h2>
          <p className="text-xl text-[#F5F3EF]/70 mb-8">
            Discover how ancient words shaped modern thought. 
            Start exploring the hidden connections between language, culture, and ideas.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSearchQuery('λόγος')}
              className="flex items-center gap-3 px-8 py-4 bg-[#C9A962] hover:bg-[#C9A962]/90 text-[#0D0D0F] rounded-xl font-semibold transition-colors"
            >
              <Search className="w-5 h-5" />
              Explore λόγος Evolution
              <ArrowRight className="w-5 h-5" />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-3 px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl font-semibold transition-colors"
            >
              <BookOpen className="w-5 h-5" />
              View Documentation
            </motion.button>
          </div>
        </div>
      </motion.section>
    </div>
  )
}
