'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Search, 
  Sparkles, 
  TrendingUp, 
  Clock, 
  Star, 
  ArrowRight, 
  Globe, 
  BookOpen, 
  Network, 
  Eye,
  Zap,
  Users,
  Calendar,
  Filter,
  Languages,
  MapPin,
  Compass,
  ChevronRight,
  Brain,
  Lightbulb,
  Target
} from 'lucide-react'
import { ArgumentSynthesis } from '@/components/innovations/argument_synthesis'
import { MultiScaleView } from '@/components/innovations/multi_scale_view'
import { CounterEvidence } from '@/components/innovations/counter_evidence'
import { NarrativeTimeline } from '@/components/innovations/narrative_timeline'

interface WordDiscovery {
  word: string
  originalMeaning: string
  actualMeaning: string
  author: string
  period: string
  confidence: number
  semanticNeighbors: string[]
  examples: number
  trend: 'rising' | 'stable' | 'declining'
}

interface RecentSearch {
  query: string
  timestamp: Date
  resultCount: number
  type: 'word' | 'concept' | 'author'
}

interface TrendingConcept {
  concept: string
  searches: number
  change: number
  relatedWords: string[]
  description: string
}

const SemantiaMainPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [showKeyboard, setShowKeyboard] = useState(false)
  const [searchType, setSearchType] = useState<'semantic' | 'exact' | 'concept'>('semantic')
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<'discoveries' | 'recent' | 'trending'>('discoveries')

  const [featuredDiscoveries] = useState<WordDiscovery[]>([
    {
      word: 'ἀρετή',
      originalMeaning: 'virtue, excellence',
      actualMeaning: 'competitive excellence that generates social recognition',
      author: 'Homer → Aristotle',
      period: '8th-4th century BCE',
      confidence: 0.94,
      semanticNeighbors: ['κλέος', 'τιμή', 'ἀγών', 'εὐδαιμονία'],
      examples: 847,
      trend: 'rising'
    },
    {
      word: 'λόγος',
      originalMeaning: 'word, speech',
      actualMeaning: 'rational principle underlying reality\'s intelligible structure',
      author: 'Heraclitus → Stoics',
      period: '6th century BCE - 3rd century CE',
      confidence: 0.91,
      semanticNeighbors: ['νοῦς', 'φύσις', 'κόσμος', 'ἁρμονία'],
      examples: 1247,
      trend: 'stable'
    },
    {
      word: 'σοφία',
      originalMeaning: 'wisdom, skill',
      actualMeaning: 'practical intelligence about navigating divine-human boundaries',
      author: 'Early Lyric → Plato',
      period: '7th-4th century BCE',
      confidence: 0.87,
      semanticNeighbors: ['φρόνησις', 'τέχνη', 'ἐπιστήμη', 'μαντική'],
      examples: 623,
      trend: 'rising'
    }
  ])

  const [recentSearches] = useState<RecentSearch[]>([
    { query: 'justice semantic neighbors', timestamp: new Date(Date.now() - 300000), resultCount: 234, type: 'concept' },
    { query: 'δικαιοσύνη', timestamp: new Date(Date.now() - 600000), resultCount: 156, type: 'word' },
    { query: 'Plato metaphysics evolution', timestamp: new Date(Date.now() - 900000), resultCount: 89, type: 'author' },
    { query: 'φιλοσοφία meaning drift', timestamp: new Date(Date.now() - 1200000), resultCount: 312, type: 'concept' }
  ])

  const [trendingConcepts] = useState<TrendingConcept[]>([
    {
      concept: 'Divine Madness',
      searches: 1834,
      change: 23.4,
      relatedWords: ['μανία', 'ἐνθουσιασμός', 'βακχεία', 'προφητεία'],
      description: 'Inspired states that transcend rational boundaries'
    },
    {
      concept: 'Cosmic Justice',
      searches: 1456,
      change: 18.7,
      relatedWords: ['δίκη', 'μοῖρα', 'ἀνάγκη', 'τάξις'],
      description: 'Universal principle maintaining cosmic order'
    },
    {
      concept: 'Philosophical Conversion',
      searches: 1203,
      change: 34.2,
      relatedWords: ['περιαγωγή', 'μεταστροφή', 'ἐπιστροφή', 'θεραπεία'],
      description: 'Transformation of soul through philosophical practice'
    }
  ])

  const greekKeyboard = [
    ['α', 'β', 'γ', 'δ', 'ε', 'ζ', 'η', 'θ'],
    ['ι', 'κ', 'λ', 'μ', 'ν', 'ξ', 'ο', 'π'],
    ['ρ', 'σ', 'τ', 'υ', 'φ', 'χ', 'ψ', 'ω']
  ]

  const handleKeyboardInput = (char: string) => {
    setSearchQuery(prev => prev + char)
  }

  const handleSearch = () => {
    if (!searchQuery.trim()) return
    setIsLoading(true)
    // Simulate search
    setTimeout(() => {
      setIsLoading(false)
      // Navigate to results
    }, 1000)
  }

  const formatTimeAgo = (timestamp: Date) => {
    const minutes = Math.floor((Date.now() - timestamp.getTime()) / 60000)
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ago`
    return `${Math.floor(hours / 24)}d ago`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-100">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23C9A962' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 pt-20 pb-16">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <div className="flex items-center justify-center mb-6">
              <motion.div 
                className="p-4 rounded-full bg-gradient-to-r from-yellow-400/20 to-orange-400/20 backdrop-blur-xl border border-yellow-400/30"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Brain className="w-8 h-8 text-yellow-400" />
              </motion.div>
            </div>
            <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent">
              SEMANTIA
            </h1>
            <p className="text-2xl text-slate-300 mb-4 font-light">
              Organic Meaning Discovery
            </p>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Discover what words <span className="text-yellow-400 font-semibold">ACTUALLY</span> meant, 
              not dictionary definitions. Explore semantic neighborhoods, meaning drift, and conceptual evolution 
              across ancient texts.
            </p>
          </motion.div>

          {/* Search Section */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-4xl mx-auto mb-16"
          >
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-8 shadow-2xl">
              {/* Search Type Selector */}
              <div className="flex items-center justify-center mb-6 space-x-4">
                {[
                  { type: 'semantic' as const, label: 'Semantic Search', icon: Network },
                  { type: 'exact' as const, label: 'Exact Match', icon: Target },
                  { type: 'concept' as const, label: 'Concept Map', icon: Compass }
                ].map(({ type, label, icon: Icon }) => (
                  <motion.button
                    key={type}
                    onClick={() => setSearchType(type)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                      searchType === type 
                        ? 'bg-yellow-400/20 text-yellow-400 border border-yellow-400/30' 
                        : 'bg-white/5 text-slate-400 hover:text-slate-300 border border-transparent hover:border-white/10'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{label}</span>
                  </motion.button>
                ))}
              </div>

              {/* Search Bar */}
              <div className="relative">
                <div className="flex items-center bg-white/10 rounded-xl border border-white/20 focus-within:border-yellow-400/50 focus-within:ring-2 focus-within:ring-yellow-400/20 transition-all">
                  <Search className="w-5 h-5 text-slate-400 ml-4" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    placeholder="Search for words, concepts, or semantic neighborhoods..."
                    className="flex-1 bg-transparent px-4 py-4 text-slate-100 placeholder-slate-400 focus:outline-none text-lg"
                  />
                  <motion.button
                    onClick={() => setShowKeyboard(!showKeyboard)}
                    className="px-3 py-2 text-slate-400 hover:text-slate-300 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Languages className="w-5 h-5" />
                  </motion.button>
                  <motion.button
                    onClick={handleSearch}
                    disabled={!searchQuery.trim() || isLoading}
                    className="bg-gradient-to-r from-yellow-400 to-orange-400 text-slate-900 px-6 py-4 m-1 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {isLoading ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      >
                        <Zap className="w-5 h-5" />
                      </motion.div>
                    ) : (
                      <Sparkles className="w-5 h-5" />
                    )}
                    <span>Discover</span>
                  </motion.button>
                </div>

                {/* Greek Keyboard */}
                <AnimatePresence>
                  {showKeyboard && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute top-full left-0 right-0 mt-2 bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 p-4 z-50"
                    >
                      <div className="space-y-2">
                        {greekKeyboard.map((row, rowIndex) => (
                          <div key={rowIndex} className="flex justify-center space-x-2">
                            {row.map((char) => (
                              <motion.button
                                key={char}
                                onClick={() => handleKeyboardInput(char)}
                                className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-lg text-slate-200 font-medium transition-colors"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                              >
                                {char}
                              </motion.button>
                            ))}
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Quick Filters */}
              <div className="flex items-center justify-center mt-6 space-x-4 text-sm">
                <span className="text-slate-400">Quick filters:</span>
                {['Homer', 'Plato', 'Aristotle', 'Stoics', 'Neoplatonists'].map((filter) => (
                  <motion.button
                    key={filter}
                    className="px-3 py-1 bg-white/5 hover:bg-white/10 rounded-full text-slate-300 hover:text-slate-200 transition-colors border border-white/10"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {filter}
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 pb-20">
        {/* Navigation Tabs */}
        <div className="flex items-center justify-center mb-12">
          <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-2">
            {[
              { key: 'discoveries' as const, label: 'Featured Discoveries', icon: Star, count: featuredDiscoveries.length },
              { key: 'recent' as const, label: 'Recent Searches', icon: Clock, count: recentSearches.length },
              { key: 'trending' as const, label: 'Trending Concepts', icon: TrendingUp, count: trendingConcepts.length }
            ].map(({ key, label, icon: Icon, count }) => (
              <motion.button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`flex items-center space-x-3 px-6 py-3 rounded-lg transition-all font-medium ${
                  activeTab === key
                    ? 'bg-gradient-to-r from-yellow-400/20 to-orange-400/20 text-yellow-400 border border-yellow-400/30'
                    : 'text-slate-400 hover:text-slate-300 hover:bg-white/5'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Icon className="w-5 h-5" />
                <span>{label}</span>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  activeTab === key ? 'bg-yellow-400/20' : 'bg-white/10'
                }`}>
                  {count}
                </span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Content Sections */}
        <AnimatePresence mode="wait">
          {activeTab === 'discoveries' && (
            <motion.div
              key="discoveries"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-slate-200 mb-4">Featured Word Discoveries</h2>
                <p className="text-slate-400 max-w-2xl mx-auto">
                  Explore groundbreaking semantic insights uncovered through AI-powered analysis 
                  of ancient texts, revealing meanings that traditional dictionaries miss.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {featuredDiscoveries.map((discovery, index) => (
                  <motion.div
                    key={discovery.word}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="group"
                  >
                    <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-6 hover:border-yellow-400/30 transition-all duration-300 h-full flex flex-col">
                      {/* Header */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="text-2xl font-bold text-yellow-400 font-mono">
                          {discovery.word}
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className={`w-2 h-2 rounded-full ${
                            discovery.trend === 'rising' ? 'bg-green-400' :
                            discovery.trend === 'stable' ? 'bg-blue-400' : 'bg-orange-400'
                          }`} />
                          <span className="text-xs text-slate-400 font-medium">
                            {discovery.confidence * 100}% confidence
                          </span>
                        </div>
                      </div>

                      {/* Meanings Comparison */}
                      <div className="space-y-4 mb-6 flex-1">
                        <div>
                          <div className="text-sm text-slate-400 mb-1">Dictionary Definition:</div>
                          <div className="text-slate-300 text-sm italic">"{discovery.originalMeaning}"</div>
                        </div>
                        <div className="border-l-2 border-yellow-400/30 pl-4">
                          <div className="text-sm text-yellow-400 mb-1 flex items-center space-x-2">
                            <Lightbulb className="w-4 h-4" />
                            <span>Actual Semantic Reality:</span>
                          </div>
                          <div className="text-slate-200 font-medium">"{discovery.actualMeaning}"</div>
                        </div>
                      </div>

                      {/* Metadata */}
                      <div className="space-y-3 text-sm">
                        <div className="flex items-center space-x-2 text-slate-400">
                          <Users className="w-4 h-4" />
                          <span>{discovery.author}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-slate-400">
                          <Calendar className="w-4 h-4" />
                          <span>{discovery.period}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-slate-400">
                          <BookOpen className="w-4 h-4" />
                          <span>{discovery.examples.toLocaleString()} examples analyzed</span>
                        </div>
                      </div>

                      {/* Semantic Neighbors */}
                      <div className="mt-4 pt-4 border-t border-white/10">
                        <div className="text-sm text-slate-400 mb-2">Semantic Neighbors:</div>
                        <div className="flex flex-wrap gap-2">
                          {discovery.semanticNeighbors.map((neighbor) => (
                            <span
                              key={neighbor}
                              className="px-2 py-1 bg-white/10 rounded text-xs text-slate-300 font-mono"
                            >
                              {neighbor}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* CTA */}
                      <motion.button
                        className="mt-4 w-full bg-gradient-to-r from-yellow-400/10 to-orange-400/10 hover:from-yellow-400/20 hover:to-orange-400/20 border border-yellow-400/30 text-yellow-400 py-3 px-4 rounded-lg font-medium transition-all flex items-center justify-center space-x-2 group"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <span>Explore Semantic Journey</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Innovation Components */}
              <div className="mt-16 space-y-12">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <ArgumentSynthesis />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <MultiScaleView />
                </motion.div>
              </div>
            </motion.div>
          )}

          {activeTab === 'recent' && (
            <motion.div
              key="recent"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-slate-200 mb-4">Recent Searches</h2>
                <p className="text-slate-400 max-w-2xl mx-auto">
                  Continue your semantic exploration journey. Revisit previous discoveries 
                  or build upon earlier research insights.
                </p>
              </div>

              <div className="max-w-4xl mx-auto">
                <div className="space-y-4">
                  {recentSearches.map((search, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-6 hover:border-yellow-400/30 transition-all cursor-pointer group"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className={`p-2 rounded-lg ${
                            search.type === 'word' ? 'bg-blue-400/20 text-blue-400' :
                            search.type === 'concept' ? 'bg-green-400/20 text-green-400' :
                            'bg-purple-400/20 text-purple-400'
                          }`}>
                            {search.type === 'word' ? <BookOpen className="w-5 h-5" /> :
                             search.type === 'concept' ? <Network className="w-5 h-5" /> :
                             <Users className="w-5 h-5" />}
                          </div>
                          <div>
                            <div className="text-slate-200 font-medium text-lg">{search.query}</div>
                            <div className="text-slate-400 text-sm flex items-center space-x-4">
                              <span>{search.resultCount} results</span>
                              <span>•</span>
                              <span>{formatTimeAgo(search.timestamp)}</span>
                            </div>
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-yellow-400 group-hover:translate-x-1 transition-all" />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Innovation Components */}
              <div className="mt-16 space-y-12">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <CounterEvidence />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <NarrativeTimeline />
                </motion.div>
              </div>
            </motion.div>
          )}

          {activeTab === 'trending' && (
            <motion.div
              key="trending"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-slate-200 mb-4">Trending Concepts</h2>
                <p className="text-slate-400 max-w-2xl mx-auto">
                  Discover what concepts are capturing scholarly attention. These semantic territories 
                  are experiencing increased research activity and new interpretive insights.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {trendingConcepts.map((concept, index) => (
                  <motion.div
                    key={concept.concept}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-6 hover:border-yellow-400/30 transition-all duration-300 group cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold text-slate-200 group-hover:text-yellow-400 transition-colors">
                        {concept.concept}
                      </h3>
                      <div className="flex items-center space-x-2">
                        <TrendingUp className="w-4 h-4 text-green-400" />
                        <span className="text-green-400 font-bold text-sm">+{concept.change}%</span>
                      </div>
                    </div>

                    <p className="text-slate-300 mb-4 leading-relaxed">
                      {concept.description}
                    </p>

                    <div className="flex items-center space-x-2 text-slate-400 mb-4">
                      <Eye className="w-4 h-4" />
                      <span className="text-sm">{concept.searches.toLocaleString()} searches</span>
                    </div>

                    <div className="space-y-2">
                      <div className="text-sm text-slate-400">Related Terms:</div>
                      <div className="flex flex-wrap gap-2">
                        {concept.relatedWords.map((word) => (
                          <span
                            key={word}
                            className="px-2 py-1 bg-gradient-to-r from-yellow-400/10 to-orange-400/10 border border-yellow-400/20 rounded text-xs text-yellow-400 font-mono"
                          >
                            {word}
                          </span>
                        ))}
                      </div>
                    </div>

                    <motion.div
                      className="mt-4 pt-4 border-t border-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      whileHover={{ scale: 1.05 }}
                    >
                      <span className="text-yellow-400 text-sm font-medium flex items-center space-x-2">
                        <Compass className="w-4 h-4" />
                        <span>Explore Concept Map</span>
                      </span>
                    </motion.div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default SemantiaMainPage
