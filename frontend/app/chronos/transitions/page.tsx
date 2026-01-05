'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import { Clock, ArrowRight, Search, Filter, Eye, BookOpen, Zap, MapPin, Calendar, Users, Lightbulb, TrendingUp, History, ChevronDown, Play, Pause, RotateCcw, MousePointer } from 'lucide-react'
import { NarrativeTimeline } from '@/components/innovations/narrative_timeline'
import { MultiScaleView } from '@/components/innovations/multi_scale_view'
import { ComparativeFrames } from '@/components/innovations/comparative_frames'

interface SemanticEvolution {
  id: string
  word: string
  period: string
  year: number
  definition: string
  context: string
  author: string
  work: string
  passage: string
  translation: string
  semanticField: string[]
  frequency: number
  culturalContext: string
}

interface TimelinePeriod {
  period: string
  yearRange: [number, number]
  description: string
  keyFeatures: string[]
  majorWorks: string[]
  culturalShifts: string[]
}

const FEATURED_WORDS = [
  {
    word: 'λόγος',
    transliteration: 'logos',
    evolutionStages: 6,
    totalOccurrences: 2847,
    keyAuthors: ['Heraclitus', 'Plato', 'Aristotle', 'Stoics', 'John']
  },
  {
    word: 'δικαιοσύνη',
    transliteration: 'dikaiosyne',
    evolutionStages: 5,
    totalOccurrences: 1923,
    keyAuthors: ['Homer', 'Plato', 'Aristotle', 'Cicero', 'Augustine']
  },
  {
    word: 'ἀρετή',
    transliteration: 'arete',
    evolutionStages: 4,
    totalOccurrences: 3156,
    keyAuthors: ['Homer', 'Pindar', 'Plato', 'Aristotle', 'Plutarch']
  },
  {
    word: 'θεωρία',
    transliteration: 'theoria',
    evolutionStages: 5,
    totalOccurrences: 892,
    keyAuthors: ['Herodotus', 'Plato', 'Aristotle', 'Plotinus']
  }
]

const SAMPLE_EVOLUTION_DATA: SemanticEvolution[] = [
  {
    id: '1',
    word: 'λόγος',
    period: 'Pre-Socratic',
    year: -500,
    definition: 'Divine principle of order and knowledge',
    context: 'τοῦ δὲ λόγου τοῦδ᾽ ἐόντος ἀεὶ ἀξύνετοι γίνονται ἄνθρωποι',
    author: 'Heraclitus',
    work: 'Fragments',
    passage: 'DK 22 B1',
    translation: 'Of this logos which is always humans turn out to be ignorant',
    semanticField: ['cosmic-order', 'divine-principle', 'universal-law'],
    frequency: 23,
    culturalContext: 'Emerging philosophical cosmology'
  },
  {
    id: '2',
    word: 'λόγος',
    period: 'Classical',
    year: -380,
    definition: 'Rational discourse, argument, definition',
    context: 'λόγον διδόναι καὶ δέχεσθαι',
    author: 'Plato',
    work: 'Phaedrus',
    passage: '266c',
    translation: 'to give and receive a rational account',
    semanticField: ['reasoning', 'discourse', 'definition', 'explanation'],
    frequency: 156,
    culturalContext: 'Dialectical method development'
  },
  {
    id: '3',
    word: 'λόγος',
    period: 'Hellenistic',
    year: -200,
    definition: 'Divine reason governing the universe',
    context: 'κατὰ λόγον ζῆν',
    author: 'Chrysippus',
    work: 'On Providence',
    passage: 'SVF 2.913',
    translation: 'to live according to reason',
    semanticField: ['stoic-physics', 'providence', 'natural-law', 'virtue'],
    frequency: 89,
    culturalContext: 'Stoic systematization'
  },
  {
    id: '4',
    word: 'λόγος',
    period: 'Imperial',
    year: 90,
    definition: 'Divine Word, creative principle incarnate',
    context: 'Ἐν ἀρχῇ ἦν ὁ λόγος, καὶ ὁ λόγος ἦν πρὸς τὸν θεόν',
    author: 'John',
    work: 'Gospel',
    passage: '1:1',
    translation: 'In the beginning was the Word, and the Word was with God',
    semanticField: ['christology', 'incarnation', 'divine-word', 'creation'],
    frequency: 40,
    culturalContext: 'Christian theological development'
  }
]

const TIMELINE_PERIODS: TimelinePeriod[] = [
  {
    period: 'Archaic',
    yearRange: [-800, -480],
    description: 'Epic and lyric foundations',
    keyFeatures: ['Oral tradition', 'Heroic values', 'Religious vocabulary'],
    majorWorks: ['Iliad', 'Odyssey', 'Hesiod'],
    culturalShifts: ['Writing adoption', 'Polis formation', 'Colonization']
  },
  {
    period: 'Classical',
    yearRange: [-480, -323],
    description: 'Philosophical and dramatic innovation',
    keyFeatures: ['Abstract concepts', 'Technical terminology', 'Dialectical precision'],
    majorWorks: ['Platonic dialogues', 'Aristotelian corpus', 'Attic tragedy'],
    culturalShifts: ['Democracy', 'Philosophical schools', 'Rhetoric development']
  },
  {
    period: 'Hellenistic',
    yearRange: [-323, -31],
    description: 'Systematic philosophy and science',
    keyFeatures: ['Cosmopolitan vocabulary', 'Scientific precision', 'Ethical focus'],
    majorWorks: ['Stoic physics', 'Epicurean ethics', 'Mathematical works'],
    culturalShifts: ['Cultural fusion', 'Library scholarship', 'Mystery religions']
  },
  {
    period: 'Imperial',
    yearRange: [-31, 500],
    description: 'Religious and mystical transformation',
    keyFeatures: ['Christian terminology', 'Mystical language', 'Commentary tradition'],
    majorWorks: ['New Testament', 'Plotinus', 'Church Fathers'],
    culturalShifts: ['Roman dominance', 'Christianity', 'Neoplatonism']
  }
]

export default function ChronosSemanticTimeTravelPage() {
  const [selectedWord, setSelectedWord] = useState(FEATURED_WORDS[0])
  const [currentPeriod, setCurrentPeriod] = useState(TIMELINE_PERIODS[0])
  const [selectedEvolution, setSelectedEvolution] = useState<SemanticEvolution | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [timelinePosition, setTimelinePosition] = useState(0)
  const [viewMode, setViewMode] = useState<'timeline' | 'comparison' | 'network'>('timeline')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterBy, setFilterBy] = useState<'all' | 'frequency' | 'semantic-field' | 'author'>('all')
  const [isLoading, setIsLoading] = useState(true)
  const [hoveredPeriod, setHoveredPeriod] = useState<string | null>(null)

  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ container: containerRef })
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setTimelinePosition(prev => {
          const next = (prev + 1) % TIMELINE_PERIODS.length
          setCurrentPeriod(TIMELINE_PERIODS[next])
          return next
        })
      }, 3000)
      return () => clearInterval(interval)
    }
  }, [isPlaying])

  const handleWordSelect = (word: typeof FEATURED_WORDS[0]) => {
    setSelectedWord(word)
    setTimelinePosition(0)
    setCurrentPeriod(TIMELINE_PERIODS[0])
    setIsPlaying(false)
  }

  const filteredEvolutions = SAMPLE_EVOLUTION_DATA.filter(evolution => {
    const matchesSearch = evolution.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
      evolution.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      evolution.definition.toLowerCase().includes(searchTerm.toLowerCase())
    
    if (filterBy === 'all') return matchesSearch
    if (filterBy === 'frequency') return matchesSearch && evolution.frequency > 50
    if (filterBy === 'semantic-field') return matchesSearch && evolution.semanticField.length > 2
    if (filterBy === 'author') return matchesSearch && ['Plato', 'Aristotle', 'John'].includes(evolution.author)
    
    return matchesSearch
  })

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0D0D0F] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-[#C9A962] border-t-transparent rounded-full mx-auto mb-6"
          />
          <h2 className="text-2xl font-bold text-[#C9A962] mb-2">Initializing Temporal Semantic Engine</h2>
          <p className="text-[#F5F3EF]/70">Mapping meaning evolution across millennia...</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div ref={containerRef} className="min-h-screen bg-[#0D0D0F] text-[#F5F3EF] overflow-hidden">
      {/* Animated Background */}
      <motion.div
        style={{ y: backgroundY }}
        className="fixed inset-0 opacity-5"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[#C9A962]/20 via-transparent to-[#7C9885]/20" />
        {Array.from({ length: 50 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-[#C9A962]/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              scale: [0.5, 1.5, 0.5],
              opacity: [0.3, 1, 0.3],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </motion.div>

      {/* Hero Section */}
      <div className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <div className="flex items-center justify-center mb-6">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="w-20 h-20 border-4 border-[#C9A962] border-dashed rounded-full mr-6 flex items-center justify-center"
              >
                <Clock className="w-10 h-10 text-[#C9A962]" />
              </motion.div>
              <div>
                <h1 className="text-6xl font-bold mb-4">
                  <span className="text-[#C9A962]">CHRONOS</span>
                  <span className="text-[#7C9885]">/</span>
                  <span className="text-[#F5F3EF]">transitions</span>
                </h1>
                <p className="text-xl text-[#C9A962] font-light">
                  Semantic Time Travel
                </p>
              </div>
            </div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-3xl text-[#F5F3EF]/90 max-w-4xl mx-auto leading-relaxed"
            >
              Watch meanings evolve across centuries
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-lg text-[#F5F3EF]/70 max-w-3xl mx-auto mt-6"
            >
              Journey through time to witness how words transform, concepts evolve, and meanings migrate across cultures, authors, and epochs in the ancient world.
            </motion.p>
          </motion.div>

          {/* Control Panel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 mb-12"
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
              {/* Word Selection */}
              <div>
                <h3 className="text-lg font-semibold text-[#C9A962] mb-4 flex items-center">
                  <BookOpen className="w-5 h-5 mr-2" />
                  Select Word
                </h3>
                <div className="space-y-2">
                  {FEATURED_WORDS.map((word) => (
                    <motion.button
                      key={word.word}
                      onClick={() => handleWordSelect(word)}
                      className={`w-full text-left p-3 rounded-lg border transition-all duration-200 ${
                        selectedWord.word === word.word
                          ? 'bg-[#C9A962]/20 border-[#C9A962] text-[#C9A962]'
                          : 'bg-white/5 border-white/10 text-[#F5F3EF] hover:border-[#C9A962]/50'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="font-bold text-lg">{word.word}</span>
                          <span className="text-sm opacity-70 ml-2">({word.transliteration})</span>
                        </div>
                        <div className="text-right text-xs">
                          <div>{word.evolutionStages} stages</div>
                          <div className="opacity-70">{word.totalOccurrences} occurrences</div>
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Timeline Controls */}
              <div>
                <h3 className="text-lg font-semibold text-[#C9A962] mb-4 flex items-center">
                  <History className="w-5 h-5 mr-2" />
                  Timeline Controls
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="bg-[#C9A962] text-[#0D0D0F] p-2 rounded-lg hover:bg-[#C9A962]/90 transition-colors"
                    >
                      {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                    </button>
                    <button
                      onClick={() => {
                        setTimelinePosition(0)
                        setCurrentPeriod(TIMELINE_PERIODS[0])
                        setIsPlaying(false)
                      }}
                      className="bg-white/10 text-[#F5F3EF] p-2 rounded-lg hover:bg-white/20 transition-colors"
                    >
                      <RotateCcw className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-[#F5F3EF]/70">
                      Period: {currentPeriod.period}
                    </label>
                    <input
                      type="range"
                      min={0}
                      max={TIMELINE_PERIODS.length - 1}
                      value={timelinePosition}
                      onChange={(e) => {
                        const pos = parseInt(e.target.value)
                        setTimelinePosition(pos)
                        setCurrentPeriod(TIMELINE_PERIODS[pos])
                        setIsPlaying(false)
                      }}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-[#F5F3EF]/50">
                      <span>{currentPeriod.yearRange[0]}</span>
                      <span>{currentPeriod.yearRange[1]}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* View Options */}
              <div>
                <h3 className="text-lg font-semibold text-[#C9A962] mb-4 flex items-center">
                  <Eye className="w-5 h-5 mr-2" />
                  View Mode
                </h3>
                <div className="space-y-2">
                  {[
                    { key: 'timeline', label: 'Timeline Evolution', icon: TrendingUp },
                    { key: 'comparison', label: 'Period Comparison', icon: Filter },
                    { key: 'network', label: 'Semantic Network', icon: MapPin }
                  ].map(({ key, label, icon: Icon }) => (
                    <motion.button
                      key={key}
                      onClick={() => setViewMode(key as any)}
                      className={`w-full text-left p-3 rounded-lg border transition-all duration-200 flex items-center ${
                        viewMode === key
                          ? 'bg-[#7C9885]/20 border-[#7C9885] text-[#7C9885]'
                          : 'bg-white/5 border-white/10 text-[#F5F3EF] hover:border-[#7C9885]/50'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Icon className="w-4 h-4 mr-2" />
                      {label}
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>

            {/* Search and Filter */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#F5F3EF]/50" />
                <input
                  type="text"
                  placeholder="Search words, authors, or definitions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-[#F5F3EF] placeholder-[#F5F3EF]/50 focus:border-[#C9A962] focus:outline-none"
                />
              </div>
              <select
                value={filterBy}
                onChange={(e) => setFilterBy(e.target.value as any)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-[#F5F3EF] focus:border-[#C9A962] focus:outline-none"
              >
                <option value="all">All Results</option>
                <option value="frequency">High Frequency</option>
                <option value="semantic-field">Rich Semantic Fields</option>
                <option value="author">Major Authors</option>
              </select>
            </div>
          </motion.div>

          {/* Main Content Area */}
          <div className="space-y-8">
            {/* Current Period Overview */}
            <motion.div
              key={currentPeriod.period}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="bg-gradient-to-r from-[#C9A962]/10 via-[#7C9885]/10 to-[#8B7355]/10 backdrop-blur-xl border border-white/10 rounded-2xl p-8"
            >
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div>
                  <h3 className="text-2xl font-bold text-[#C9A962] mb-2">
                    {currentPeriod.period} Period
                  </h3>
                  <p className="text-[#F5F3EF]/80 mb-4">
                    {currentPeriod.yearRange[0]} - {currentPeriod.yearRange[1]} CE
                  </p>
                  <p className="text-[#F5F3EF]/70">
                    {currentPeriod.description}
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-[#7C9885] mb-3">Key Features</h4>
                  <ul className="space-y-1">
                    {currentPeriod.keyFeatures.map((feature, index) => (
                      <li key={index} className="text-sm text-[#F5F3EF]/70 flex items-center">
                        <div className="w-1 h-1 bg-[#7C9885] rounded-full mr-2" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-[#8B7355] mb-3">Cultural Shifts</h4>
                  <ul className="space-y-1">
                    {currentPeriod.culturalShifts.map((shift, index) => (
                      <li key={index} className="text-sm text-[#F5F3EF]/70 flex items-center">
                        <div className="w-1 h-1 bg-[#8B7355] rounded-full mr-2" />
                        {shift}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>

            {/* Innovation Components */}
            <div className="space-y-8">
              {viewMode === 'timeline' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8"
                >
                  <h3 className="text-xl font-semibold text-[#C9A962] mb-6 flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2" />
                    Semantic Evolution Timeline
                  </h3>
                  <NarrativeTimeline 
                    data={filteredEvolutions}
                    currentPeriod={currentPeriod.period}
                    onSelectEvent={(evolution) => setSelectedEvolution(evolution)}
                  />
                </motion.div>
              )}

              {viewMode === 'comparison' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8"
                >
                  <h3 className="text-xl font-semibold text-[#C9A962] mb-6 flex items-center">
                    <Filter className="w-5 h-5 mr-2" />
                    Period-by-Period Comparison
                  </h3>
                  <ComparativeFrames 
                    data={filteredEvolutions}
                    periods={TIMELINE_PERIODS}
                    selectedWord={selectedWord.word}
                  />
                </motion.div>
              )}

              {viewMode === 'network' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8"
                >
                  <h3 className="text-xl font-semibold text-[#C9A962] mb-6 flex items-center">
                    <MapPin className="w-5 h-5 mr-2" />
                    Multi-Scale Semantic Analysis
                  </h3>
                  <MultiScaleView 
                    data={filteredEvolutions}
                    focusWord={selectedWord.word}
                    currentPeriod={currentPeriod}
                  />
                </motion.div>
              )}
            </div>

            {/* Detailed Evolution Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {filteredEvolutions.map((evolution, index) => (
                  <motion.div
                    key={evolution.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.1 }}
                    className={`bg-white/5 backdrop-blur-xl border rounded-xl p-6 cursor-pointer transition-all duration-300 hover:bg-white/10 hover:border-[#C9A962]/50 ${
                      selectedEvolution?.id === evolution.id
                        ? 'border-[#C9A962] bg-[#C9A962]/10'
                        : 'border-white/10'
                    }`}
                    onClick={() => setSelectedEvolution(evolution)}
                    onHoverStart={() => setHoveredPeriod(evolution.period)}
                    onHoverEnd={() => setHoveredPeriod(null)}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="text-xl font-bold text-[#C9A962]">{evolution.word}</h4>
                        <p className="text-sm text-[#F5F3EF]/70">{evolution.period}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-[#7C9885] font-medium">
                          {evolution.year > 0 ? '+' : ''}{evolution.year}
                        </div>
                        <div className="text-xs text-[#F5F3EF]/50">
                          freq: {evolution.frequency}
                        </div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-sm text-[#F5F3EF] font-medium mb-2">
                        {evolution.definition}
                      </p>
                      <div className="bg-black/20 rounded p-3 mb-3">
                        <p className="text-sm text-[#C9A962] font-mono mb-1">
                          {evolution.context}
                        </p>
                        <p className="text-xs text-[#F5F3EF]/70 italic">
                          "{evolution.translation}"
                        </p>
                      </div>
                    </div>

                    <div className="flex justify-between items-center text-xs text-[#F5F3EF]/70">
                      <span>{evolution.author}</span>
                      <span>{evolution.work}</span>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-1">
                      {evolution.semanticField.slice(0, 3).map((field, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 bg-[#7C9885]/20 text-[#7C9885] text-xs rounded"
                        >
                          {field}
                        </span>
                      ))}
                      {evolution.semanticField.length > 3 && (
                        <span className="px-2 py-1 bg-white/10 text-[#F5F3EF]/50 text-xs rounded">
                          +{evolution.semanticField.length - 3}
                        </span>
                      )}
                    </div>

                    {hoveredPeriod === evolution.period && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="absolute inset-0 bg-gradient-to-r from-[#C9A962]/20 to-[#7C9885]/20 rounded-xl pointer-events-none"
                      />
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Selected Evolution Detail */}
            <AnimatePresence>
              {selectedEvolution && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-gradient-to-br from-[#C9A962]/10 via-[#7C9885]/10 to-[#8B7355]/10 backdrop-blur-xl border border-[#C9A962] rounded-2xl p-8"
                >
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="text-3xl font-bold text-[#C9A962] mb-2">
                        {selectedEvolution.word} in {selectedEvolution.period}
                      </h3>
                      <p className="text-lg text-[#F5F3EF]/80">
                        {selectedEvolution.author} • {selectedEvolution.work}
                      </p>
                    </div>
                    <motion.button
                      onClick={() => setSelectedEvolution(null)}
                      className="text-[#F5F3EF]/50 hover:text-[#F5F3EF] transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <ChevronDown className="w-6 h-6" />
                    </motion.button>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div>
                      <h4 className="font-semibold text-[#7C9885] mb-4">Context & Translation</h4>
                      <div className="bg-black/30 rounded-xl p-6">
                        <p className="text-[#C9A962] font-mono text-lg mb-4 leading-relaxed">
                          {selectedEvolution.context}
                        </p>
                        <p className="text-[#F5F3EF]/80 italic text-lg leading-relaxed">
                          "{selectedEvolution.translation}"
                        </p>
                      </div>
                      <div className="mt-4 text-sm text-[#F5F3EF]/70">
                        <p><span className="font-medium">Reference:</span> {selectedEvolution.passage}</p>
                        <p><span className="font-medium">Cultural Context:</span> {selectedEvolution.culturalContext}</p>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-[#7C9885] mb-4">Semantic Analysis</h4>
                      <div className="space-y-4">
                        <div>
                          <p className="text-[#F5F3EF] font-medium mb-2">Definition:</p>
                          <p className="text-[#F5F3EF]/80">{selectedEvolution.definition}</p>
                        </div>
                        
                        <div>
                          <p className="text-[#F5F3EF] font-medium mb-2">Semantic Fields:</p>
                          <div className="flex flex-wrap gap-2">
                            {selectedEvolution.semanticField.map((field, i) => (
                              <span
                                key={i}
                                className="px-3 py-2 bg-[#7C9885]/20 text-[#7C9885] text-sm rounded-lg border border-[#7C9885]/30"
                              >
                                {field}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-4">
                          <div className="text-center p-4 bg-white/5 rounded-lg">
                            <div className="text-2xl font-bold text-[#C9A962]">
                              {selectedEvolution.frequency}
                            </div>
                            <div className="text-sm text-[#F5F3EF]/70">Frequency</div>
                          </div>
                          <div className="text-center p-4 bg-white/5 rounded-lg">
                            <div className="text-2xl font-bold text-[#7C9885]">
                              {selectedEvolution.year > 0 ? '+' : ''}{selectedEvolution.year}
                            </div>
                            <div className="text-sm text-[#F5F3EF]/70">Year</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Usage Instructions */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8"
            >
              <h3 className="text-xl font-semibold text-[#C9A962] mb-6 flex items-center">
                <Lightbulb className="w-5 h-5 mr-2" />
                How to Navigate Semantic Time Travel
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  {
                    icon: MousePointer,
                    title: 'Select & Explore',
                    description: 'Choose a word from the featured list to begin your semantic journey through time.'
                  },
                  {
                    icon: Play,
                    title: 'Animate Timeline',
                    description: 'Use play controls to automatically progress through historical periods.'
                  },
                  {
                    icon: Eye,
                    title: 'Switch Views',
                    description: 'Toggle between timeline, comparison, and network views for different insights.'
                  },
                  {
                    icon: Filter,
                    title: 'Filter Results',
                    description: 'Search and filter by frequency, semantic fields, or specific authors.'
                  }
                ].map(({ icon: Icon, title, description }, index) => (
                  <motion.div
                    key={title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.4 + index * 0.1 }}
                    className="text-center"
                  >
                    <div className="w-12 h-12 bg-[#7C9885]/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-6 h-6 text-[#7C9885]" />
                    </div>
                    <h4 className="font-semibold text-[#F5F3EF] mb-2">{title}</h4>
                    <p className="text-sm text-[#F5F3EF]/70">{description}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Footer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.6 }}
              className="text-center py-8 border-t border-white/10"
            >
              <p className="text-[#F5F3EF]/50">
                Discover how ancient words carried ideas across millennia • 
                Track conceptual evolution • Uncover semantic archaeology
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
