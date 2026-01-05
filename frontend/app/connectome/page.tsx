'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Search, 
  Network, 
  Users, 
  BookOpen, 
  Zap, 
  ArrowRight, 
  TrendingUp,
  Globe,
  Brain,
  Layers,
  Target,
  Eye,
  Filter,
  Sparkles,
  Clock,
  MapPin,
  Share2,
  Play,
  ChevronRight,
  Activity,
  Database,
  Link2,
  Star
} from 'lucide-react'
import { ResearchCanvas } from '@/components/innovations/research_canvas'
import { MultiScaleView } from '@/components/innovations/multi_scale_view'
import { DebateView } from '@/components/innovations/debate_view'

interface ConnectionStats {
  totalConnections: number
  activeScholars: number
  conceptsTracked: number
  crossReferences: number
}

interface FeaturedNetwork {
  id: string
  title: string
  description: string
  authors: string[]
  concepts: string[]
  connections: number
  lastUpdated: string
  scholars: number
  color: string
}

interface LiveConnection {
  id: string
  from: string
  to: string
  concept: string
  strength: number
  timestamp: string
}

const ConnectomeMainPage = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchType, setSearchType] = useState<'author' | 'work' | 'concept'>('concept')
  const [isSearching, setIsSearching] = useState(false)
  const [selectedNetwork, setSelectedNetwork] = useState<string | null>(null)
  const [connectionStats, setConnectionStats] = useState<ConnectionStats>({
    totalConnections: 0,
    activeScholars: 0,
    conceptsTracked: 0,
    crossReferences: 0
  })
  const [liveConnections, setLiveConnections] = useState<LiveConnection[]>([])
  const [viewMode, setViewMode] = useState<'network' | 'timeline' | 'canvas'>('network')

  // Simulated real-time connection stats
  useEffect(() => {
    const interval = setInterval(() => {
      setConnectionStats({
        totalConnections: Math.floor(45000 + Math.random() * 100),
        activeScholars: Math.floor(280 + Math.random() * 20),
        conceptsTracked: Math.floor(8500 + Math.random() * 50),
        crossReferences: Math.floor(125000 + Math.random() * 200)
      })
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  // Simulated live connections feed
  useEffect(() => {
    const connections = [
      { id: '1', from: 'Marcus Aurelius', to: 'Epictetus', concept: 'prohairesis', strength: 0.9, timestamp: '2 min ago' },
      { id: '2', from: 'Plotinus', to: 'Plato', concept: 'the One', strength: 0.95, timestamp: '5 min ago' },
      { id: '3', from: 'Aristotle', to: 'Plato', concept: 'eudaimonia', strength: 0.8, timestamp: '8 min ago' },
      { id: '4', from: 'Cicero', to: 'Chrysippus', concept: 'fate', strength: 0.75, timestamp: '12 min ago' },
      { id: '5', from: 'Augustine', to: 'Plotinus', concept: 'divine illumination', strength: 0.85, timestamp: '15 min ago' }
    ]
    setLiveConnections(connections)
  }, [])

  const featuredNetworks: FeaturedNetwork[] = [
    {
      id: 'stoic-ethics',
      title: 'Stoic Ethics Evolution',
      description: 'How ethical concepts flow from Zeno through Roman Stoicism',
      authors: ['Zeno', 'Chrysippus', 'Epictetus', 'Marcus Aurelius', 'Seneca'],
      concepts: ['virtue', 'prohairesis', 'kathēkon', 'apatheia'],
      connections: 1847,
      lastUpdated: '3 hours ago',
      scholars: 23,
      color: 'from-yellow-500/20 to-orange-500/20'
    },
    {
      id: 'platonic-metaphysics',
      title: 'Platonic Metaphysics Network',
      description: 'Ideas and Forms across Platonist tradition',
      authors: ['Plato', 'Plotinus', 'Proclus', 'Damascius', 'Simplicius'],
      concepts: ['eidos', 'the One', 'nous', 'psyche', 'henosis'],
      connections: 2156,
      lastUpdated: '1 hour ago',
      scholars: 31,
      color: 'from-blue-500/20 to-purple-500/20'
    },
    {
      id: 'aristotelian-causation',
      title: 'Aristotelian Causation Web',
      description: 'Four causes doctrine through medieval reception',
      authors: ['Aristotle', 'Alexander', 'Averroes', 'Aquinas', 'Albert'],
      concepts: ['aitia', 'kinesis', 'energeia', 'dunamis', 'telos'],
      connections: 1634,
      lastUpdated: '6 hours ago',
      scholars: 18,
      color: 'from-green-500/20 to-emerald-500/20'
    },
    {
      id: 'christian-philosophy',
      title: 'Christian Philosophy Synthesis',
      description: 'Greek philosophy integrated into Christian thought',
      authors: ['Justin Martyr', 'Clement', 'Origen', 'Augustine', 'Pseudo-Dionysius'],
      concepts: ['logos', 'theosis', 'trinity', 'providence', 'grace'],
      connections: 1923,
      lastUpdated: '2 hours ago',
      scholars: 27,
      color: 'from-purple-500/20 to-pink-500/20'
    }
  ]

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) return

    setIsSearching(true)
    // Simulate search
    await new Promise(resolve => setTimeout(resolve, 1500))
    setIsSearching(false)
    
    // In real implementation, this would navigate to search results
    console.log(`Searching for ${searchType}: ${searchQuery}`)
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6 }
    }
  }

  const floatingVariants = {
    animate: {
      y: [0, -10, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  }

  return (
    <div className="min-h-screen bg-[#0D0D0F] text-[#F5F3EF]">
      {/* Hero Section with Network Visualization */}
      <div className="relative overflow-hidden">
        {/* Background Network Animation */}
        <div className="absolute inset-0 opacity-20">
          <svg className="w-full h-full" viewBox="0 0 1200 800">
            {/* Animated connection lines */}
            {Array.from({ length: 12 }, (_, i) => (
              <motion.line
                key={i}
                x1={Math.random() * 1200}
                y1={Math.random() * 800}
                x2={Math.random() * 1200}
                y2={Math.random() * 800}
                stroke="#C9A962"
                strokeWidth="1"
                opacity="0.3"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{
                  duration: 3 + i * 0.5,
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: "easeInOut"
                }}
              />
            ))}
            {/* Network nodes */}
            {Array.from({ length: 20 }, (_, i) => (
              <motion.circle
                key={i}
                cx={Math.random() * 1200}
                cy={Math.random() * 800}
                r="3"
                fill="#C9A962"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 0.6 }}
                transition={{
                  delay: i * 0.2,
                  duration: 1,
                  repeat: Infinity,
                  repeatType: "reverse",
                  repeatDelay: 3
                }}
              />
            ))}
          </svg>
        </div>

        <div className="relative z-10 container mx-auto px-6 py-20">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div
              variants={itemVariants}
              className="flex items-center justify-center gap-3 mb-6"
            >
              <motion.div
                variants={floatingVariants}
                animate="animate"
                className="p-3 bg-[#C9A962]/20 rounded-full backdrop-blur-xl"
              >
                <Brain className="w-8 h-8 text-[#C9A962]" />
              </motion.div>
              <h1 className="text-6xl font-bold bg-gradient-to-r from-[#C9A962] via-[#F5F3EF] to-[#7C9885] bg-clip-text text-transparent">
                CONNECTOME
              </h1>
            </motion.div>

            <motion.h2
              variants={itemVariants}
              className="text-3xl font-light text-[#7C9885] mb-4"
            >
              Living Network of Ideas
            </motion.h2>

            <motion.p
              variants={itemVariants}
              className="text-xl text-[#F5F3EF]/80 mb-12 leading-relaxed"
            >
              See how texts, authors, and ideas connect across the centuries. 
              Discover influence pathways, trace concept evolution, and explore 
              the living web of classical thought.
            </motion.p>

            {/* Search Interface */}
            <motion.div
              variants={itemVariants}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 mb-16"
            >
              <form onSubmit={handleSearch} className="space-y-6">
                {/* Search Type Selector */}
                <div className="flex justify-center gap-4 mb-6">
                  {(['concept', 'author', 'work'] as const).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setSearchType(type)}
                      className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                        searchType === type
                          ? 'bg-[#C9A962] text-[#0D0D0F]'
                          : 'bg-white/5 text-[#F5F3EF]/70 hover:bg-white/10'
                      }`}
                    >
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </button>
                  ))}
                </div>

                <div className="flex gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#7C9885] w-5 h-5" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder={`Search for ${searchType}... (e.g., "${searchType === 'concept' ? 'virtue, fate, the One' : searchType === 'author' ? 'Plato, Marcus Aurelius' : 'Republic, Meditations'}")`}
                      className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/20 rounded-xl text-[#F5F3EF] placeholder-[#F5F3EF]/50 focus:outline-none focus:border-[#C9A962] focus:bg-white/10 transition-all duration-300"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSearching || !searchQuery.trim()}
                    className="px-8 py-4 bg-gradient-to-r from-[#C9A962] to-[#8B7355] text-[#0D0D0F] font-medium rounded-xl hover:shadow-lg hover:shadow-[#C9A962]/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center gap-2"
                  >
                    {isSearching ? (
                      <div className="w-5 h-5 border-2 border-[#0D0D0F]/20 border-t-[#0D0D0F] rounded-full animate-spin" />
                    ) : (
                      <Network className="w-5 h-5" />
                    )}
                    Explore Network
                  </button>
                </div>
              </form>

              {/* Quick Search Suggestions */}
              <div className="mt-6 flex flex-wrap gap-2 justify-center">
                <span className="text-[#F5F3EF]/60 text-sm">Quick explore:</span>
                {['virtue ethics', 'Platonic Forms', 'Stoic physics', 'Christian Platonism'].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => setSearchQuery(suggestion)}
                    className="px-3 py-1 text-sm bg-[#C9A962]/20 text-[#C9A962] rounded-full hover:bg-[#C9A962]/30 transition-colors duration-200"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Connection Statistics */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="container mx-auto px-6 py-16"
      >
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: 'Total Connections', value: connectionStats.totalConnections.toLocaleString(), icon: Link2, color: 'text-[#C9A962]' },
            { label: 'Active Scholars', value: connectionStats.activeScholars.toLocaleString(), icon: Users, color: 'text-[#7C9885]' },
            { label: 'Concepts Tracked', value: connectionStats.conceptsTracked.toLocaleString(), icon: Brain, color: 'text-[#8B7355]' },
            { label: 'Cross-References', value: connectionStats.crossReferences.toLocaleString(), icon: Network, color: 'text-[#C9A962]' }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.7 + index * 0.1, duration: 0.5 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 text-center group hover:bg-white/10 transition-all duration-300"
            >
              <stat.icon className={`w-8 h-8 mx-auto mb-3 ${stat.color} group-hover:scale-110 transition-transform duration-300`} />
              <div className={`text-2xl font-bold ${stat.color} mb-1`}>
                {stat.value}
              </div>
              <div className="text-[#F5F3EF]/70 text-sm">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* View Mode Selector */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="container mx-auto px-6 py-8"
      >
        <div className="flex justify-center gap-4 mb-12">
          {([
            { mode: 'network', label: 'Network View', icon: Network },
            { mode: 'timeline', label: 'Timeline View', icon: Clock },
            { mode: 'canvas', label: 'Research Canvas', icon: Layers }
          ] as const).map(({ mode, label, icon: Icon }) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                viewMode === mode
                  ? 'bg-[#C9A962] text-[#0D0D0F]'
                  : 'bg-white/5 text-[#F5F3EF]/70 hover:bg-white/10'
              }`}
            >
              <Icon className="w-5 h-5" />
              {label}
            </button>
          ))}
        </div>

        {/* Innovation Components */}
        <AnimatePresence mode="wait">
          <motion.div
            key={viewMode}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 mb-16"
          >
            {viewMode === 'network' && (
              <MultiScaleView
                data={{
                  nodes: featuredNetworks.map(network => ({
                    id: network.id,
                    label: network.title,
                    connections: network.connections,
                    category: 'network'
                  })),
                  connections: liveConnections.map(conn => ({
                    source: conn.from,
                    target: conn.to,
                    strength: conn.strength,
                    concept: conn.concept
                  }))
                }}
                onNodeSelect={(nodeId) => setSelectedNetwork(nodeId)}
              />
            )}
            
            {viewMode === 'timeline' && (
              <DebateView
                debate={{
                  id: 'stoic-ethics-evolution',
                  title: 'Evolution of Stoic Ethics',
                  participants: [
                    { id: 'zeno', name: 'Zeno of Citium', period: '334-262 BCE', position: 'Virtue as only good' },
                    { id: 'chrysippus', name: 'Chrysippus', period: '279-206 BCE', position: 'Systematic virtue theory' },
                    { id: 'epictetus', name: 'Epictetus', period: '50-135 CE', position: 'Practical ethics focus' },
                    { id: 'marcus', name: 'Marcus Aurelius', period: '121-180 CE', position: 'Philosophical kingship' }
                  ],
                  timeline: [
                    { date: '300 BCE', author: 'Zeno', position: 'Establishes virtue as supreme good' },
                    { date: '250 BCE', author: 'Chrysippus', position: 'Develops logical foundation for ethics' },
                    { date: '100 CE', author: 'Epictetus', position: 'Emphasizes practical application' },
                    { date: '170 CE', author: 'Marcus Aurelius', position: 'Integrates ethics with governance' }
                  ]
                }}
                onPositionSelect={(position) => console.log('Selected position:', position)}
              />
            )}
            
            {viewMode === 'canvas' && (
              <ResearchCanvas
                initialData={{
                  nodes: featuredNetworks.slice(0, 2).map(network => ({
                    id: network.id,
                    type: 'network',
                    title: network.title,
                    content: network.description,
                    position: { x: Math.random() * 400, y: Math.random() * 300 },
                    connections: network.authors
                  })),
                  connections: [
                    { source: featuredNetworks[0].id, target: featuredNetworks[1].id, type: 'influence' }
                  ]
                }}
                onNodeAdd={(node) => console.log('Added node:', node)}
                onConnectionCreate={(connection) => console.log('Created connection:', connection)}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </motion.section>

      {/* Featured Networks */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.8 }}
        className="container mx-auto px-6 py-16"
      >
        <div className="flex items-center gap-3 mb-12">
          <div className="p-2 bg-[#C9A962]/20 rounded-lg">
            <Star className="w-6 h-6 text-[#C9A962]" />
          </div>
          <h2 className="text-3xl font-bold text-[#F5F3EF]">Featured Networks</h2>
          <div className="flex-1 h-px bg-gradient-to-r from-[#C9A962]/50 to-transparent"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {featuredNetworks.map((network, index) => (
            <motion.div
              key={network.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 + index * 0.1, duration: 0.6 }}
              className={`relative overflow-hidden bg-gradient-to-br ${network.color} backdrop-blur-xl border border-white/10 rounded-xl p-6 group hover:scale-105 transition-all duration-500 cursor-pointer`}
              onClick={() => setSelectedNetwork(selectedNetwork === network.id ? null : network.id)}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16"></div>
              
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-xl font-bold text-[#F5F3EF] group-hover:text-[#C9A962] transition-colors duration-300">
                    {network.title}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-[#F5F3EF]/70">
                    <Users className="w-4 h-4" />
                    {network.scholars}
                  </div>
                </div>

                <p className="text-[#F5F3EF]/80 mb-4 leading-relaxed">
                  {network.description}
                </p>

                <div className="space-y-3 mb-4">
                  <div>
                    <div className="text-sm font-medium text-[#C9A962] mb-1">Key Authors</div>
                    <div className="flex flex-wrap gap-1">
                      {network.authors.slice(0, 4).map((author) => (
                        <span key={author} className="px-2 py-1 text-xs bg-white/10 rounded-full text-[#F5F3EF]/80">
                          {author}
                        </span>
                      ))}
                      {network.authors.length > 4 && (
                        <span className="px-2 py-1 text-xs bg-white/10 rounded-full text-[#F5F3EF]/60">
                          +{network.authors.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm font-medium text-[#7C9885] mb-1">Core Concepts</div>
                    <div className="flex flex-wrap gap-1">
                      {network.concepts.slice(0, 3).map((concept) => (
                        <span key={concept} className="px-2 py-1 text-xs bg-[#7C9885]/20 rounded-full text-[#7C9885]">
                          {concept}
                        </span>
                      ))}
                      {network.concepts.length > 3 && (
                        <span className="px-2 py-1 text-xs bg-[#7C9885]/20 rounded-full text-[#7C9885]/70">
                          +{network.concepts.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-[#F5F3EF]/60">
                    <div className="flex items-center gap-1">
                      <Link2 className="w-4 h-4" />
                      {network.connections.toLocaleString()} connections
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {network.lastUpdated}
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-[#C9A962] group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </div>

              <AnimatePresence>
                {selectedNetwork === network.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-6 pt-6 border-t border-white/10"
                  >
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-[#C9A962] mb-2">Recent Activity</h4>
                        <div className="space-y-2">
                          <div className="text-sm text-[#F5F3EF]/80">New connection: virtue → eudaimonia</div>
                          <div className="text-sm text-[#F5F3EF]/80">Scholar annotation on Meditations 4.23</div>
                          <div className="text-sm text-[#F5F3EF]/80">Cross-reference with Nicomachean Ethics</div>
                        </div>
                      </div>
                      <button className="w-full py-2 bg-[#C9A962] text-[#0D0D0F] font-medium rounded-lg hover:bg-[#C9A962]/90 transition-colors duration-200">
                        Explore Network
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Live Connection Feed */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4, duration: 0.8 }}
        className="container mx-auto px-6 py-16"
      >
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 bg-[#7C9885]/20 rounded-lg">
            <Activity className="w-6 h-6 text-[#7C9885]" />
          </div>
          <h2 className="text-3xl font-bold text-[#F5F3EF]">Live Connection Discovery</h2>
          <div className="flex items-center gap-2 text-sm text-[#7C9885]">
            <div className="w-2 h-2 bg-[#7C9885] rounded-full animate-pulse"></div>
            Real-time
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">
          <div className="space-y-4">
            {liveConnections.map((connection, index) => (
              <motion.div
                key={connection.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="flex items-center gap-4 p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors duration-200 group"
              >
                <div className="flex-shrink-0">
                  <div className={`w-3 h-3 rounded-full bg-[#C9A962] opacity-${Math.round(connection.strength * 100)}`}>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-medium text-[#F5F3EF]">{connection.from}</span>
                    <ArrowRight className="w-4 h-4 text-[#7C9885]" />
                    <span className="font-medium text-[#F5F3EF]">{connection.to}</span>
                    <span className="px-2 py-1 bg-[#C9A962]/20 text-[#C9A962] rounded-full text-xs">
                      {connection.concept}
                    </span>
                  </div>
                </div>
                <div className="flex-shrink-0 text-xs text-[#F5F3EF]/60">
                  {connection.timestamp}
                </div>
                <button className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <Eye className="w-4 h-4 text-[#7C9885]" />
                </button>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-6 text-center">
            <button className="px-6 py-3 bg-gradient-to-r from-[#7C9885] to-[#8B7355] text-[#F5F3EF] font-medium rounded-lg hover:shadow-lg hover:shadow-[#7C9885]/25 transition-all duration-300">
              View All Live Connections
            </button>
          </div>
        </div>
      </motion.section>

      {/* Call to Action */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.6, duration: 0.8 }}
        className="container mx-auto px-6 py-20"
      >
        <div className="text-center bg-gradient-to-br from-[#C9A962]/10 to-[#7C9885]/10 backdrop-blur-xl border border-white/10 rounded-2xl p-12">
          <motion.div
            variants={floatingVariants}
            animate="animate"
            className="inline-block p-4 bg-[#C9A962]/20 rounded-full mb-6"
          >
            <Sparkles className="w-12 h-12 text-[#C9A962]" />
          </motion.div>
          
          <h2 className="text-4xl font-bold text-[#F5F3EF] mb-4">
            Ready to Explore the Living Web of Ideas?
          </h2>
          
          <p className="text-xl text-[#F5F3EF]/80 mb-8 max-w-2xl mx-auto">
            Join scholars worldwide in mapping the connections that shaped Western thought. 
            Discover new insights, trace influence pathways, and contribute to the growing network.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-4 bg-gradient-to-r from-[#C9A962] to-[#8B7355] text-[#0D0D0F] font-bold rounded-xl hover:shadow-lg hover:shadow-[#C9A962]/25 transition-all duration-300 flex items-center gap-2">
              <Play className="w-5 h-5" />
              Start Exploring
            </button>
            <button className="px-8 py-4 bg-white/5 border border-white/20 text-[#F5F3EF] font-medium rounded-xl hover:bg-white/10 transition-all duration-300 flex items-center gap-2">
              <Share2 className="w-5 h-5" />
              Learn More
            </button>
          </div>
        </div>
      </motion.section>
    </div>
  )
}

export default ConnectomeMainPage
