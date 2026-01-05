'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Network, 
  Clock, 
  Users, 
  BookOpen, 
  Zap, 
  ArrowRight, 
  Search, 
  Filter, 
  Layers,
  GitBranch,
  Eye,
  Shuffle,
  Play,
  Pause,
  RotateCcw,
  Maximize2,
  Share2,
  Download,
  Settings,
  Info,
  ChevronDown,
  ChevronUp,
  Star,
  TrendingUp,
  Activity,
  X
} from 'lucide-react'
import { ResearchCanvas } from '@/components/innovations/research_canvas'
import { MultiScaleView } from '@/components/innovations/multi_scale_view'
import { DebateView } from '@/components/innovations/debate_view'

interface Author {
  id: string
  name: string
  period: string
  dates: string
  works: string[]
  position: { x: number; y: number }
  influence_strength: number
  color: string
}

interface Connection {
  id: string
  from: string
  to: string
  concept: string
  strength: number
  transformation: string
  passages: Array<{
    source_text: string
    target_text: string
    similarity: number
  }>
  path: Array<{ x: number; y: number }>
}

interface ConceptNode {
  id: string
  label: string
  definition: string
  greek_terms: string[]
  latin_terms: string[]
  frequency: number
  evolution: Array<{
    period: string
    interpretation: string
    key_authors: string[]
  }>
  related_concepts: string[]
}

const SAMPLE_AUTHORS: Author[] = [
  {
    id: 'heraclitus',
    name: 'Heraclitus',
    period: 'Pre-Socratic',
    dates: '535-475 BCE',
    works: ['Fragments'],
    position: { x: 100, y: 200 },
    influence_strength: 0.9,
    color: '#C9A962'
  },
  {
    id: 'chrysippus',
    name: 'Chrysippus',
    period: 'Early Stoic',
    dates: '279-206 BCE',
    works: ['On Fate', 'On Physics'],
    position: { x: 300, y: 180 },
    influence_strength: 0.95,
    color: '#7C9885'
  },
  {
    id: 'cicero',
    name: 'Cicero',
    period: 'Roman Republic',
    dates: '106-43 BCE',
    works: ['De Fato', 'De Natura Deorum'],
    position: { x: 500, y: 220 },
    influence_strength: 0.8,
    color: '#8B7355'
  },
  {
    id: 'seneca',
    name: 'Seneca',
    period: 'Roman Empire',
    dates: '4 BCE-65 CE',
    works: ['Letters', 'Natural Questions'],
    position: { x: 650, y: 160 },
    influence_strength: 0.85,
    color: '#C9A962'
  },
  {
    id: 'epictetus',
    name: 'Epictetus',
    period: 'Roman Empire',
    dates: '50-135 CE',
    works: ['Discourses', 'Enchiridion'],
    position: { x: 700, y: 250 },
    influence_strength: 0.9,
    color: '#7C9885'
  },
  {
    id: 'marcus_aurelius',
    name: 'Marcus Aurelius',
    period: 'Roman Empire',
    dates: '121-180 CE',
    works: ['Meditations'],
    position: { x: 850, y: 200 },
    influence_strength: 0.88,
    color: '#8B7355'
  }
]

const SAMPLE_CONNECTIONS: Connection[] = [
  {
    id: 'heraclitus-chrysippus',
    from: 'heraclitus',
    to: 'chrysippus',
    concept: 'logos',
    strength: 0.9,
    transformation: 'From cosmic principle to rational law',
    passages: [
      {
        source_text: 'τοῦ δὲ λόγου τοῦδε ἐόντος ἀεὶ ἀξύνετοι γίνονται ἄνθρωποι',
        target_text: 'λόγος as the divine reason governing all things',
        similarity: 0.85
      }
    ],
    path: [{ x: 100, y: 200 }, { x: 300, y: 180 }]
  },
  {
    id: 'chrysippus-cicero',
    from: 'chrysippus',
    to: 'cicero',
    concept: 'fate',
    strength: 0.75,
    transformation: 'From physical necessity to theological problem',
    passages: [
      {
        source_text: 'εἱμαρμένη as eternal cause-chain',
        target_text: 'fatum as divine providence vs. free will',
        similarity: 0.7
      }
    ],
    path: [{ x: 300, y: 180 }, { x: 500, y: 220 }]
  }
]

const CENTRAL_CONCEPT: ConceptNode = {
  id: 'logos',
  label: 'Logos (λόγος)',
  definition: 'Divine reason, cosmic principle, rational law',
  greek_terms: ['λόγος', 'λογικόν', 'λόγῳ'],
  latin_terms: ['ratio', 'verbum', 'logos'],
  frequency: 847,
  evolution: [
    {
      period: 'Pre-Socratic',
      interpretation: 'Cosmic principle of order and measure',
      key_authors: ['Heraclitus']
    },
    {
      period: 'Early Stoic',
      interpretation: 'Divine reason governing physical world',
      key_authors: ['Chrysippus', 'Cleanthes']
    },
    {
      period: 'Roman Stoic',
      interpretation: 'Rational principle accessible to human reason',
      key_authors: ['Seneca', 'Epictetus', 'Marcus Aurelius']
    }
  ],
  related_concepts: ['fate', 'providence', 'reason', 'nature', 'virtue']
}

export default function ConnectomePage() {
  const [selectedConcept, setSelectedConcept] = useState<ConceptNode>(CENTRAL_CONCEPT)
  const [selectedAuthor, setSelectedAuthor] = useState<string | null>(null)
  const [selectedConnection, setSelectedConnection] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [timelinePosition, setTimelinePosition] = useState(0)
  const [viewMode, setViewMode] = useState<'network' | 'timeline' | 'concept'>('network')
  const [filterStrength, setFilterStrength] = useState(0.5)
  const [showTransformations, setShowTransformations] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedEvolution, setExpandedEvolution] = useState<number | null>(null)

  // Simulate loading states
  useEffect(() => {
    setIsLoading(true)
    const timer = setTimeout(() => setIsLoading(false), 1500)
    return () => clearTimeout(timer)
  }, [selectedConcept])

  // Filter connections based on strength
  const filteredConnections = useMemo(() => {
    return SAMPLE_CONNECTIONS.filter(conn => conn.strength >= filterStrength)
  }, [filterStrength])

  // Timeline animation
  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setTimelinePosition(prev => (prev + 1) % 100)
      }, 100)
      return () => clearInterval(interval)
    }
  }, [isPlaying])

  const handleConceptSearch = (query: string) => {
    setSearchQuery(query)
    // Simulate concept search
    if (query.length > 2) {
      setIsLoading(true)
      setTimeout(() => setIsLoading(false), 800)
    }
  }

  const NetworkView = () => (
    <div className="relative w-full h-[600px] bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl rounded-xl border border-white/20 overflow-hidden">
      {/* Network Canvas */}
      <svg className="absolute inset-0 w-full h-full">
        {/* Connection paths */}
        {filteredConnections.map((connection) => {
          const fromAuthor = SAMPLE_AUTHORS.find(a => a.id === connection.from)
          const toAuthor = SAMPLE_AUTHORS.find(a => a.id === connection.to)
          if (!fromAuthor || !toAuthor) return null

          return (
            <motion.g
              key={connection.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: Math.random() * 0.5 }}
            >
              {/* Connection line */}
              <motion.line
                x1={fromAuthor.position.x}
                y1={fromAuthor.position.y}
                x2={toAuthor.position.x}
                y2={toAuthor.position.y}
                stroke={`url(#gradient-${connection.id})`}
                strokeWidth={connection.strength * 4}
                className="cursor-pointer hover:stroke-[#C9A962] transition-colors"
                onClick={() => setSelectedConnection(connection.id)}
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
              />

              {/* Gradient definition */}
              <defs>
                <linearGradient id={`gradient-${connection.id}`} x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor={fromAuthor.color} stopOpacity="0.6" />
                  <stop offset="100%" stopColor={toAuthor.color} stopOpacity="0.6" />
                </linearGradient>
              </defs>

              {/* Transformation indicator */}
              {showTransformations && (
                <motion.circle
                  cx={(fromAuthor.position.x + toAuthor.position.x) / 2}
                  cy={(fromAuthor.position.y + toAuthor.position.y) / 2}
                  r="6"
                  fill="#C9A962"
                  className="cursor-pointer hover:r-8 transition-all"
                  onClick={() => setSelectedConnection(connection.id)}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1 }}
                />
              )}
            </motion.g>
          )
        })}

        {/* Author nodes */}
        {SAMPLE_AUTHORS.map((author, index) => (
          <motion.g
            key={author.id}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: index * 0.1 }}
            className="cursor-pointer"
            onClick={() => setSelectedAuthor(author.id === selectedAuthor ? null : author.id)}
          >
            {/* Author circle */}
            <motion.circle
              cx={author.position.x}
              cy={author.position.y}
              r={20 + (author.influence_strength * 15)}
              fill={author.color}
              fillOpacity="0.8"
              stroke={selectedAuthor === author.id ? '#F5F3EF' : 'transparent'}
              strokeWidth="3"
              className="hover:stroke-[#F5F3EF] transition-colors"
              whileHover={{ scale: 1.1 }}
            />

            {/* Author name */}
            <text
              x={author.position.x}
              y={author.position.y + 50}
              textAnchor="middle"
              className="fill-[#F5F3EF] text-sm font-medium"
            >
              {author.name}
            </text>

            {/* Period */}
            <text
              x={author.position.x}
              y={author.position.y + 65}
              textAnchor="middle"
              className="fill-[#F5F3EF]/70 text-xs"
            >
              {author.dates}
            </text>
          </motion.g>
        ))}
      </svg>

      {/* Central concept node */}
      <motion.div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ duration: 0.8, type: "spring" }}
      >
        <div className="relative">
          <div className="w-32 h-32 bg-gradient-to-br from-[#C9A962] to-[#8B7355] rounded-full flex items-center justify-center shadow-2xl border-4 border-white/20">
            <div className="text-center">
              <div className="text-white font-bold text-lg">{selectedConcept.label.split(' ')[0]}</div>
              <div className="text-white/80 text-xs">{selectedConcept.frequency} refs</div>
            </div>
          </div>
          
          {/* Pulsing rings */}
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-[#C9A962]/30"
            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
      </motion.div>
    </div>
  )

  const TimelineView = () => (
    <div className="w-full h-[600px] bg-white/5 backdrop-blur-xl rounded-xl border border-white/20 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-[#F5F3EF]">Evolution Timeline</h3>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center space-x-2 px-4 py-2 bg-[#C9A962] text-[#0D0D0F] rounded-lg hover:bg-[#C9A962]/80 transition-colors"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{isPlaying ? 'Pause' : 'Play'}</span>
          </button>
          <button
            onClick={() => setTimelinePosition(0)}
            className="p-2 bg-white/10 text-[#F5F3EF] rounded-lg hover:bg-white/20 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {selectedConcept.evolution.map((phase, index) => (
          <motion.div
            key={index}
            className="relative"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.2 }}
          >
            <div 
              className={`p-6 rounded-xl border cursor-pointer transition-all ${
                expandedEvolution === index 
                  ? 'bg-[#C9A962]/20 border-[#C9A962]' 
                  : 'bg-white/5 border-white/10 hover:border-white/20'
              }`}
              onClick={() => setExpandedEvolution(expandedEvolution === index ? null : index)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-3 h-3 bg-[#C9A962] rounded-full" />
                  <div>
                    <h4 className="text-lg font-semibold text-[#F5F3EF]">{phase.period}</h4>
                    <p className="text-[#F5F3EF]/70">{phase.interpretation}</p>
                  </div>
                </div>
                {expandedEvolution === index ? <ChevronUp className="w-5 h-5 text-[#F5F3EF]/70" /> : <ChevronDown className="w-5 h-5 text-[#F5F3EF]/70" />}
              </div>

              <AnimatePresence>
                {expandedEvolution === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="mt-4 pt-4 border-t border-white/10"
                  >
                    <div className="flex flex-wrap gap-2">
                      {phase.key_authors.map((author) => (
                        <span
                          key={author}
                          className="px-3 py-1 bg-[#7C9885]/20 text-[#7C9885] rounded-full text-sm"
                        >
                          {author}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Timeline connector */}
            {index < selectedConcept.evolution.length - 1 && (
              <div className="absolute left-8 top-full w-0.5 h-6 bg-gradient-to-b from-[#C9A962] to-[#7C9885]" />
            )}
          </motion.div>
        ))}
      </div>
    </div>
  )

  const ConceptExplorer = () => (
    <div className="w-full h-[600px] bg-white/5 backdrop-blur-xl rounded-xl border border-white/20 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-[#F5F3EF]">Concept Analysis</h3>
        <div className="flex items-center space-x-2">
          <Star className="w-5 h-5 text-[#C9A962]" />
          <span className="text-[#F5F3EF]/70">High Impact</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100%-5rem)]">
        {/* Definition and Terms */}
        <div className="space-y-6">
          <div className="p-4 bg-white/5 rounded-lg border border-white/10">
            <h4 className="text-lg font-semibold text-[#F5F3EF] mb-2">Definition</h4>
            <p className="text-[#F5F3EF]/80">{selectedConcept.definition}</p>
          </div>

          <div className="p-4 bg-white/5 rounded-lg border border-white/10">
            <h4 className="text-lg font-semibold text-[#F5F3EF] mb-3">Greek Terms</h4>
            <div className="flex flex-wrap gap-2 mb-4">
              {selectedConcept.greek_terms.map((term, index) => (
                <motion.span
                  key={term}
                  className="px-3 py-1 bg-[#C9A962]/20 text-[#C9A962] rounded-full text-sm font-greek cursor-pointer hover:bg-[#C9A962]/30 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {term}
                </motion.span>
              ))}
            </div>

            <h4 className="text-lg font-semibold text-[#F5F3EF] mb-3">Latin Terms</h4>
            <div className="flex flex-wrap gap-2">
              {selectedConcept.latin_terms.map((term, index) => (
                <motion.span
                  key={term}
                  className="px-3 py-1 bg-[#8B7355]/20 text-[#8B7355] rounded-full text-sm cursor-pointer hover:bg-[#8B7355]/30 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: (selectedConcept.greek_terms.length + index) * 0.1 }}
                >
                  {term}
                </motion.span>
              ))}
            </div>
          </div>
        </div>

        {/* Related Concepts and Statistics */}
        <div className="space-y-6">
          <div className="p-4 bg-white/5 rounded-lg border border-white/10">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-lg font-semibold text-[#F5F3EF]">Usage Statistics</h4>
              <TrendingUp className="w-5 h-5 text-[#7C9885]" />
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[#F5F3EF]/70">Total References</span>
                <span className="text-[#C9A962] font-bold">{selectedConcept.frequency}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#F5F3EF]/70">Authors</span>
                <span className="text-[#7C9885] font-bold">{SAMPLE_AUTHORS.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#F5F3EF]/70">Time Span</span>
                <span className="text-[#8B7355] font-bold">~700 years</span>
              </div>
            </div>
          </div>

          <div className="p-4 bg-white/5 rounded-lg border border-white/10">
            <h4 className="text-lg font-semibold text-[#F5F3EF] mb-3">Related Concepts</h4>
            <div className="flex flex-wrap gap-2">
              {selectedConcept.related_concepts.map((concept, index) => (
                <motion.button
                  key={concept}
                  className="px-3 py-1 bg-[#7C9885]/20 text-[#7C9885] rounded-full text-sm hover:bg-[#7C9885]/30 transition-colors capitalize"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => handleConceptSearch(concept)}
                >
                  {concept}
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const ControlPanel = () => (
    <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/20 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-[#F5F3EF] flex items-center space-x-2">
          <Activity className="w-5 h-5 text-[#C9A962]" />
          <span>Network Controls</span>
        </h3>
        
        <div className="flex items-center space-x-2">
          <button className="p-2 bg-white/10 text-[#F5F3EF] rounded-lg hover:bg-white/20 transition-colors">
            <Share2 className="w-4 h-4" />
          </button>
          <button className="p-2 bg-white/10 text-[#F5F3EF] rounded-lg hover:bg-white/20 transition-colors">
            <Download className="w-4 h-4" />
          </button>
          <button className="p-2 bg-white/10 text-[#F5F3EF] rounded-lg hover:bg-white/20 transition-colors">
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* View Mode Selector */}
        <div>
          <label className="block text-sm font-medium text-[#F5F3EF]/70 mb-2">View Mode</label>
          <div className="flex rounded-lg bg-white/10 p-1">
            {[
              { id: 'network', icon: Network, label: 'Network' },
              { id: 'timeline', icon: Clock, label: 'Timeline' },
              { id: 'concept', icon: BookOpen, label: 'Analysis' }
            ].map(({ id, icon: Icon, label }) => (
              <button
                key={id}
                onClick={() => setViewMode(id as any)}
                className={`flex-1 flex items-center justify-center space-x-2 px-3 py-2 rounded-md transition-all ${
                  viewMode === id 
                    ? 'bg-[#C9A962] text-[#0D0D0F]' 
                    : 'text-[#F5F3EF]/70 hover:text-[#F5F3EF] hover:bg-white/10'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm">{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Influence Strength Filter */}
        <div>
          <label className="block text-sm font-medium text-[#F5F3EF]/70 mb-2">
            Influence Threshold: {Math.round(filterStrength * 100)}%
          </label>
          <div className="relative">
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={filterStrength}
              onChange={(e) => setFilterStrength(parseFloat(e.target.value))}
              className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer slider"
            />
            <div 
              className="absolute top-0 left-0 h-2 bg-gradient-to-r from-[#C9A962] to-[#7C9885] rounded-lg pointer-events-none"
              style={{ width: `${filterStrength * 100}%` }}
            />
          </div>
        </div>

        {/* Display Options */}
        <div>
          <label className="block text-sm font-medium text-[#F5F3EF]/70 mb-2">Display Options</label>
          <div className="space-y-2">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={showTransformations}
                onChange={(e) => setShowTransformations(e.target.checked)}
                className="form-checkbox h-4 w-4 text-[#C9A962] bg-white/10 border-white/20 rounded focus:ring-[#C9A962]"
              />
              <span className="text-sm text-[#F5F3EF]/70">Show Transformations</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#0D0D0F] text-[#F5F3EF]">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#0D0D0F] via-[#1a1a1f] to-[#0D0D0F]">
        <div className="absolute inset-0 bg-[url('/patterns/connectome.svg')] opacity-5" />
        
        <div className="relative max-w-7xl mx-auto px-6 py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="flex items-center justify-center space-x-3 mb-6">
              <motion.div
                className="p-3 bg-gradient-to-br from-[#C9A962] to-[#8B7355] rounded-xl"
                animate={{ rotate: [0, 180, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <Network className="w-8 h-8 text-[#0D0D0F]" />
              </motion.div>
              <h1 className="text-5xl lg:text-6xl font-bold bg-gradient-to-r from-[#C9A962] via-[#F5F3EF] to-[#7C9885] bg-clip-text text-transparent">
                CONNECTOME
              </h1>
            </div>
            
            <p className="text-xl text-[#F5F3EF]/80 mb-4">Living Network of Ideas</p>
            <p className="text-lg text-[#F5F3EF]/60 max-w-3xl mx-auto">
              See how texts, authors, and ideas connect. Trace an idea through history and witness the evolution of thought across centuries.
            </p>

            {/* Search Bar */}
            <motion.div
              className="mt-8 max-w-xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#F5F3EF]/40" />
                <input
                  type="text"
                  placeholder="Search concepts, authors, or terms..."
                  value={searchQuery}
                  onChange={(e) => handleConceptSearch(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-xl text-[#F5F3EF] placeholder-[#F5F3EF]/40 focus:outline-none focus:border-[#C9A962] transition-colors"
                />
                {isLoading && (
                  <motion.div
                    className="absolute right-4 top-1/2 transform -translate-y-1/2"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <Zap className="w-5 h-5 text-[#C9A962]" />
                  </motion.div>
                )}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center h-96"
            >
              <div className="text-center space-y-4">
                <motion.div
                  className="w-16 h-16 border-4 border-[#C9A962]/20 border-t-[#C9A962] rounded-full mx-auto"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                <p className="text-[#F5F3EF]/70">Mapping conceptual connections...</p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="content"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              {/* Control Panel */}
              <ControlPanel />

              {/* Main Visualization */}
              {viewMode === 'network' && <NetworkView />}
              {viewMode === 'timeline' && <TimelineView />}
              {viewMode === 'concept' && <ConceptExplorer />}

              {/* Innovation Components */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <ResearchCanvas
                  title="Collaborative Annotations"
                  data={[]}
                  onInteraction={() => {}}
                />
                <MultiScaleView
                  levels={['concept', 'author', 'period', 'tradition']}
                  currentLevel="concept"
                  onLevelChange={() => {}}
                />
                <DebateView
                  participants={['Modern Scholars', 'Historical Context']}
                  topic="Interpretation of Logos"
                  arguments={[]}
                />
              </div>

              {/* Connection Details Panel */}
              <AnimatePresence>
                {selectedConnection && (
                  <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 50 }}
                    className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/20 p-6"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold text-[#F5F3EF]">Connection Analysis</h3>
                      <button
                        onClick={() => setSelectedConnection(null)}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                      >
                        <X className="w-5 h-5 text-[#F5F3EF]/70" />
                      </button>
                    </div>
                    
                    {(() => {
                      const connection = SAMPLE_CONNECTIONS.find(c => c.id === selectedConnection)
                      if (!connection) return null
                      
                      return (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h4 className="font-semibold text-[#F5F3EF] mb-2">Transformation</h4>
                            <p className="text-[#F5F3EF]/80 mb-4">{connection.transformation}</p>
                            
                            <div className="flex items-center space-x-4">
                              <div className="flex items-center space-x-2">
                                <GitBranch className="w-4 h-4 text-[#C9A962]" />
                                <span className="text-sm text-[#F5F3EF]/70">
                                  Strength: {Math.round(connection.strength * 100)}%
                                </span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <BookOpen className="w-4 h-4 text-[#7C9885]" />
                                <span className="text-sm text-[#F5F3EF]/70">
                                  {connection.passages.length} passage(s)
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="font-semibold text-[#F5F3EF] mb-2">Parallel Passages</h4>
                            {connection.passages.map((passage, index) => (
                              <div key={index} className="mb-3 p-3 bg-white/5 rounded-lg">
                                <div className="text-sm text-[#C9A962] mb-1 font-greek">
                                  {passage.source_text}
                                </div>
                                <div className="text-sm text-[#7C9885]">
                                  {passage.target_text}
                                </div>
                                <div className="text-xs text-[#F5F3EF]/50 mt-1">
                                  Similarity: {Math.round(passage.similarity * 100)}%
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )
                    })()}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
