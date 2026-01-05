'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Search, 
  Filter, 
  TrendingUp, 
  Brain, 
  Star, 
  StarOff,
  ChevronDown,
  Sparkles,
  BookOpen,
  Network,
  Target,
  Zap,
  Eye,
  Clock,
  Users,
  ArrowRight,
  Download,
  Share2,
  Layers,
  Compass
} from 'lucide-react'
import { ArgumentSynthesis } from '@/components/innovations/argument_synthesis'
import { DebateView } from '@/components/innovations/debate_view'
import { CounterEvidence } from '@/components/innovations/counter_evidence'
import { ResearchCanvas } from '@/components/innovations/research_canvas'

interface Insight {
  id: string
  title: string
  category: 'semantic_patterns' | 'cross_textual' | 'temporal_evolution' | 'conceptual_networks' | 'surprising_connections'
  confidence: number
  topic: string[]
  description: string
  keyFindings: string[]
  sources: string[]
  relatedConcepts: string[]
  timestamp: string
  viewCount: number
  isBookmarked: boolean
  impactScore: number
  noveltyScore: number
}

const mockInsights: Insight[] = [
  {
    id: '1',
    title: 'Hidden Stoic Influence in Early Christian Virtue Ethics',
    category: 'cross_textual',
    confidence: 0.89,
    topic: ['ethics', 'stoicism', 'christianity'],
    description: 'AI analysis reveals systematic adoption of Stoic virtue terminology in early Christian texts, particularly in discussions of temperance and fortitude.',
    keyFindings: [
      'Clement of Alexandria uses σωφροσύνη in contexts identical to Epictetus',
      '73% semantic overlap between Christian and Stoic virtue hierarchies',
      'Previously unnoticed lexical borrowing in 12 early Church fathers'
    ],
    sources: ['Clement of Alexandria', 'Epictetus', 'Marcus Aurelius', 'John Chrysostom'],
    relatedConcepts: ['virtue', 'temperance', 'wisdom', 'practical ethics'],
    timestamp: '2024-01-15T10:30:00Z',
    viewCount: 234,
    isBookmarked: false,
    impactScore: 8.7,
    noveltyScore: 9.2
  },
  {
    id: '2',
    title: 'Evolution of δικαιοσύνη: From Homer to Aristotle',
    category: 'temporal_evolution',
    confidence: 0.94,
    topic: ['justice', 'ethics', 'evolution'],
    description: 'Semantic analysis traces how "justice" transforms from cosmic order to individual virtue across 400 years of Greek literature.',
    keyFindings: [
      'Homer: δικαιοσύνη as divine/cosmic principle (100% of uses)',
      'Tragic poets: 60% cosmic, 40% human social order',
      'Aristotle: 85% individual virtue, revolutionary shift'
    ],
    sources: ['Homer', 'Hesiod', 'Aeschylus', 'Sophocles', 'Aristotle'],
    relatedConcepts: ['justice', 'virtue', 'cosmic order', 'individual ethics'],
    timestamp: '2024-01-14T15:45:00Z',
    viewCount: 456,
    isBookmarked: true,
    impactScore: 9.1,
    noveltyScore: 7.8
  },
  {
    id: '3',
    title: 'Unexpected Platonic Resonances in Lucretius',
    category: 'surprising_connections',
    confidence: 0.76,
    topic: ['platonism', 'epicureanism', 'metaphysics'],
    description: 'Despite philosophical opposition, Lucretius employs Platonic metaphysical language when describing atomic forms and eternal patterns.',
    keyFindings: [
      'Uses forma/species in ways echoing Platonic Forms theory',
      'Atomic "archetypes" parallel eidos terminology',
      'Suggests deeper philosophical cross-pollination than previously recognized'
    ],
    sources: ['Lucretius', 'Plato', 'Epicurus'],
    relatedConcepts: ['forms', 'atoms', 'metaphysics', 'materialism'],
    timestamp: '2024-01-13T09:20:00Z',
    viewCount: 189,
    isBookmarked: true,
    impactScore: 7.3,
    noveltyScore: 9.5
  },
  {
    id: '4',
    title: 'Network Analysis: Friendship Concepts Across Schools',
    category: 'conceptual_networks',
    confidence: 0.91,
    topic: ['friendship', 'social philosophy', 'networks'],
    description: 'Reveals hidden connections between Aristotelian, Stoic, and Epicurean friendship theories through shared vocabulary and conceptual structures.',
    keyFindings: [
      'All three schools use φιλία in exactly 4 distinct semantic contexts',
      'Epicurean "friendship utility" secretly parallels Aristotelian categories',
      'Stoic φιλία maps onto Aristotelian virtue-friendship 78% of the time'
    ],
    sources: ['Aristotle', 'Epicurus', 'Seneca', 'Cicero'],
    relatedConcepts: ['friendship', 'virtue', 'utility', 'social bonds'],
    timestamp: '2024-01-12T14:15:00Z',
    viewCount: 312,
    isBookmarked: false,
    impactScore: 8.2,
    noveltyScore: 8.9
  },
  {
    id: '5',
    title: 'Semantic Patterns in Tragic Fate vs. Free Will',
    category: 'semantic_patterns',
    confidence: 0.87,
    topic: ['tragedy', 'fate', 'free will'],
    description: 'AI identifies consistent linguistic patterns that predict whether a character will be portrayed as agent or victim in Greek tragedy.',
    keyFindings: [
      'Characters using βούλομαι vs. χρή predict tragic outcomes with 84% accuracy',
      'Passive vs. active voice usage correlates with fate/agency themes',
      'Aeschylus shows different patterns than Sophocles and Euripides'
    ],
    sources: ['Aeschylus', 'Sophocles', 'Euripides'],
    relatedConcepts: ['fate', 'agency', 'tragedy', 'determinism'],
    timestamp: '2024-01-11T11:30:00Z',
    viewCount: 278,
    isBookmarked: true,
    impactScore: 7.9,
    noveltyScore: 8.4
  }
]

const categories = {
  semantic_patterns: { label: 'Semantic Patterns', icon: Brain, color: '#C9A962' },
  cross_textual: { label: 'Cross-Textual Analysis', icon: Network, color: '#7C9885' },
  temporal_evolution: { label: 'Temporal Evolution', icon: Clock, color: '#8B7355' },
  conceptual_networks: { label: 'Conceptual Networks', icon: Layers, color: '#C9A962' },
  surprising_connections: { label: 'Surprising Connections', icon: Sparkles, color: '#7C9885' }
}

const topics = [
  'ethics', 'metaphysics', 'politics', 'rhetoric', 'theology', 'cosmology',
  'epistemology', 'tragedy', 'comedy', 'history', 'poetry', 'philosophy'
]

export default function DiscoveryPage() {
  const [insights, setInsights] = useState<Insight[]>(mockInsights)
  const [filteredInsights, setFilteredInsights] = useState<Insight[]>(mockInsights)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedTopic, setSelectedTopic] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'confidence' | 'novelty' | 'impact' | 'recent'>('confidence')
  const [searchQuery, setSearchQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [selectedInsight, setSelectedInsight] = useState<Insight | null>(null)
  const [viewMode, setViewMode] = useState<'grid' | 'canvas'>('grid')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    filterAndSortInsights()
  }, [selectedCategory, selectedTopic, sortBy, searchQuery, insights])

  const filterAndSortInsights = () => {
    let filtered = [...insights]

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(insight => insight.category === selectedCategory)
    }

    // Filter by topic
    if (selectedTopic !== 'all') {
      filtered = filtered.filter(insight => insight.topic.includes(selectedTopic))
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(insight =>
        insight.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        insight.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        insight.keyFindings.some(finding => finding.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }

    // Sort insights
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'confidence':
          return b.confidence - a.confidence
        case 'novelty':
          return b.noveltyScore - a.noveltyScore
        case 'impact':
          return b.impactScore - a.impactScore
        case 'recent':
          return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        default:
          return 0
      }
    })

    setFilteredInsights(filtered)
  }

  const toggleBookmark = (insightId: string) => {
    setInsights(prev => prev.map(insight =>
      insight.id === insightId 
        ? { ...insight, isBookmarked: !insight.isBookmarked }
        : insight
    ))
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return '#C9A962'
    if (confidence >= 0.8) return '#7C9885'
    return '#8B7355'
  }

  const formatTimeAgo = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffHours / 24)
    
    if (diffDays > 0) return `${diffDays}d ago`
    return `${diffHours}h ago`
  }

  return (
    <div className="min-h-screen bg-[#0D0D0F] text-[#F5F3EF]">
      {/* Header Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden border-b border-white/10 bg-gradient-to-r from-[#C9A962]/5 to-[#7C9885]/5"
      >
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />
        <div className="relative max-w-7xl mx-auto px-6 py-12">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 rounded-xl bg-[#C9A962]/20 border border-[#C9A962]/30">
              <Compass className="h-8 w-8 text-[#C9A962]" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-[#C9A962] to-[#7C9885] bg-clip-text text-transparent">
                Discovery
              </h1>
              <p className="text-xl text-[#F5F3EF]/70 mt-2">Find what you didn't know to look for</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6"
            >
              <div className="flex items-center gap-3 mb-3">
                <Brain className="h-6 w-6 text-[#C9A962]" />
                <span className="text-sm font-medium text-[#C9A962]">Total Insights</span>
              </div>
              <div className="text-2xl font-bold">{insights.length}</div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6"
            >
              <div className="flex items-center gap-3 mb-3">
                <TrendingUp className="h-6 w-6 text-[#7C9885]" />
                <span className="text-sm font-medium text-[#7C9885]">Avg Confidence</span>
              </div>
              <div className="text-2xl font-bold">
                {Math.round(insights.reduce((acc, i) => acc + i.confidence, 0) / insights.length * 100)}%
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6"
            >
              <div className="flex items-center gap-3 mb-3">
                <Star className="h-6 w-6 text-[#8B7355]" />
                <span className="text-sm font-medium text-[#8B7355]">Bookmarked</span>
              </div>
              <div className="text-2xl font-bold">
                {insights.filter(i => i.isBookmarked).length}
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6"
            >
              <div className="flex items-center gap-3 mb-3">
                <Eye className="h-6 w-6 text-[#C9A962]" />
                <span className="text-sm font-medium text-[#C9A962]">Total Views</span>
              </div>
              <div className="text-2xl font-bold">
                {insights.reduce((acc, i) => acc + i.viewCount, 0).toLocaleString()}
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Controls Section */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-6 mb-8">
          {/* Search */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative flex-1"
          >
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#F5F3EF]/50" />
            <input
              type="text"
              placeholder="Search insights, findings, concepts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl text-[#F5F3EF] placeholder-[#F5F3EF]/50 focus:outline-none focus:border-[#C9A962]/50 focus:ring-2 focus:ring-[#C9A962]/20"
            />
          </motion.div>

          {/* Filter Toggle */}
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-6 py-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl hover:border-[#C9A962]/30 transition-colors"
          >
            <Filter className="h-5 w-5" />
            <span>Filters</span>
            <ChevronDown className={`h-5 w-5 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </motion.button>

          {/* View Mode Toggle */}
          <div className="flex bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-4 py-3 transition-colors ${
                viewMode === 'grid'
                  ? 'bg-[#C9A962] text-[#0D0D0F]'
                  : 'text-[#F5F3EF]/70 hover:text-[#F5F3EF]'
              }`}
            >
              <Layers className="h-5 w-5" />
            </button>
            <button
              onClick={() => setViewMode('canvas')}
              className={`px-4 py-3 transition-colors ${
                viewMode === 'canvas'
                  ? 'bg-[#C9A962] text-[#0D0D0F]'
                  : 'text-[#F5F3EF]/70 hover:text-[#F5F3EF]'
              }`}
            >
              <Network className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Filters Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-8 overflow-hidden"
            >
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Category Filter */}
                  <div>
                    <label className="block text-sm font-medium text-[#C9A962] mb-3">Category</label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full p-3 bg-[#0D0D0F] border border-white/20 rounded-lg text-[#F5F3EF] focus:outline-none focus:border-[#C9A962]/50"
                    >
                      <option value="all">All Categories</option>
                      {Object.entries(categories).map(([key, cat]) => (
                        <option key={key} value={key}>{cat.label}</option>
                      ))}
                    </select>
                  </div>

                  {/* Topic Filter */}
                  <div>
                    <label className="block text-sm font-medium text-[#7C9885] mb-3">Topic</label>
                    <select
                      value={selectedTopic}
                      onChange={(e) => setSelectedTopic(e.target.value)}
                      className="w-full p-3 bg-[#0D0D0F] border border-white/20 rounded-lg text-[#F5F3EF] focus:outline-none focus:border-[#7C9885]/50"
                    >
                      <option value="all">All Topics</option>
                      {topics.map(topic => (
                        <option key={topic} value={topic}>{topic.charAt(0).toUpperCase() + topic.slice(1)}</option>
                      ))}
                    </select>
                  </div>

                  {/* Sort By */}
                  <div>
                    <label className="block text-sm font-medium text-[#8B7355] mb-3">Sort By</label>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="w-full p-3 bg-[#0D0D0F] border border-white/20 rounded-lg text-[#F5F3EF] focus:outline-none focus:border-[#8B7355]/50"
                    >
                      <option value="confidence">Confidence Level</option>
                      <option value="novelty">Novelty Score</option>
                      <option value="impact">Impact Score</option>
                      <option value="recent">Most Recent</option>
                    </select>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <AnimatePresence mode="wait">
          {viewMode === 'grid' ? (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {filteredInsights.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-16"
                >
                  <Compass className="h-16 w-16 text-[#F5F3EF]/30 mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-[#F5F3EF]/70 mb-2">No insights found</h3>
                  <p className="text-[#F5F3EF]/50">Try adjusting your filters or search terms</p>
                </motion.div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {filteredInsights.map((insight, index) => {
                    const CategoryIcon = categories[insight.category].icon
                    return (
                      <motion.div
                        key={insight.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.02 }}
                        className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 hover:border-[#C9A962]/30 transition-all cursor-pointer"
                        onClick={() => setSelectedInsight(insight)}
                      >
                        {/* Header */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div 
                              className="p-2 rounded-lg"
                              style={{ 
                                backgroundColor: `${categories[insight.category].color}20`,
                                borderColor: `${categories[insight.category].color}30`
                              }}
                            >
                              <CategoryIcon className="h-5 w-5" style={{ color: categories[insight.category].color }} />
                            </div>
                            <div>
                              <span className="text-xs text-[#F5F3EF]/60">{categories[insight.category].label}</span>
                              <div className="flex items-center gap-2 mt-1">
                                <div
                                  className="h-2 w-16 rounded-full"
                                  style={{ backgroundColor: `${getConfidenceColor(insight.confidence)}40` }}
                                >
                                  <div
                                    className="h-full rounded-full"
                                    style={{
                                      width: `${insight.confidence * 100}%`,
                                      backgroundColor: getConfidenceColor(insight.confidence)
                                    }}
                                  />
                                </div>
                                <span className="text-xs text-[#F5F3EF]/70">
                                  {Math.round(insight.confidence * 100)}%
                                </span>
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              toggleBookmark(insight.id)
                            }}
                            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                          >
                            {insight.isBookmarked ? (
                              <Star className="h-5 w-5 text-[#C9A962] fill-current" />
                            ) : (
                              <StarOff className="h-5 w-5 text-[#F5F3EF]/50" />
                            )}
                          </button>
                        </div>

                        {/* Title */}
                        <h3 className="text-lg font-semibold mb-3 line-clamp-2">{insight.title}</h3>

                        {/* Description */}
                        <p className="text-[#F5F3EF]/70 text-sm mb-4 line-clamp-3">{insight.description}</p>

                        {/* Key Findings */}
                        <div className="mb-4">
                          <h4 className="text-xs font-medium text-[#C9A962] mb-2">KEY FINDINGS</h4>
                          <ul className="space-y-1">
                            {insight.keyFindings.slice(0, 2).map((finding, idx) => (
                              <li key={idx} className="text-sm text-[#F5F3EF]/80 flex items-start gap-2">
                                <Target className="h-3 w-3 text-[#C9A962] mt-0.5 flex-shrink-0" />
                                <span className="line-clamp-1">{finding}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Topics */}
                        <div className="flex flex-wrap gap-2 mb-4">
                          {insight.topic.slice(0, 3).map(topic => (
                            <span
                              key={topic}
                              className="px-2 py-1 text-xs bg-[#C9A962]/20 text-[#C9A962] rounded-full"
                            >
                              {topic}
                            </span>
                          ))}
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-between pt-4 border-t border-white/10">
                          <div className="flex items-center gap-4 text-xs text-[#F5F3EF]/50">
                            <div className="flex items-center gap-1">
                              <Eye className="h-3 w-3" />
                              {insight.viewCount}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {formatTimeAgo(insight.timestamp)}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1 text-xs">
                              <Sparkles className="h-3 w-3 text-[#7C9885]" />
                              <span className="text-[#F5F3EF]/60">{insight.noveltyScore}</span>
                            </div>
                            <ArrowRight className="h-4 w-4 text-[#F5F3EF]/30" />
                          </div>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="canvas"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6"
            >
              <ResearchCanvas insights={filteredInsights} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Insight Detail Modal */}
      <AnimatePresence>
        {selectedInsight && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedInsight(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-[#0D0D0F] border border-white/20 rounded-2xl p-8 max-w-4xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div 
                      className="p-2 rounded-lg"
                      style={{ 
                        backgroundColor: `${categories[selectedInsight.category].color}20`,
                        border: `1px solid ${categories[selectedInsight.category].color}30`
                      }}
                    >
                      {(() => {
                        const CategoryIcon = categories[selectedInsight.category].icon
                        return <CategoryIcon className="h-6 w-6" style={{ color: categories[selectedInsight.category].color }} />
                      })()}
                    </div>
                    <div>
                      <span className="text-sm text-[#F5F3EF]/60">{categories[selectedInsight.category].label}</span>
                      <div className="flex items-center gap-3 mt-1">
                        <div className="flex items-center gap-2">
                          <div
                            className="h-2 w-20 rounded-full"
                            style={{ backgroundColor: `${getConfidenceColor(selectedInsight.confidence)}40` }}
                          >
                            <div
                              className="h-full rounded-full"
                              style={{
                                width: `${selectedInsight.confidence * 100}%`,
                                backgroundColor: getConfidenceColor(selectedInsight.confidence)
                              }}
                            />
                          </div>
                          <span className="text-sm text-[#F5F3EF]/70">
                            {Math.round(selectedInsight.confidence * 100)}% confidence
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <h2 className="text-2xl font-bold mb-4">{selectedInsight.title}</h2>
                </div>
                <div className="flex items-center gap-2 ml-6">
                  <button
                    onClick={() => toggleBookmark(selectedInsight.id)}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    {selectedInsight.isBookmarked ? (
                      <Star className="h-6 w-6 text-[#C9A962] fill-current" />
                    ) : (
                      <StarOff className="h-6 w-6 text-[#F5F3EF]/50" />
                    )}
                  </button>
                  <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                    <Share2 className="h-6 w-6 text-[#F5F3EF]/70" />
                  </button>
                  <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                    <Download className="h-6 w-6 text-[#F5F3EF]/70" />
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                  {/* Description */}
                  <div>
                    <h3 className="text-lg font-semibold text-[#C9A962] mb-3">Overview</h3>
                    <p className="text-[#F5F3EF]/80 leading-relaxed">{selectedInsight.description}</p>
                  </div>

                  {/* Key Findings */}
                  <div>
                    <h3 className="text-lg font-semibold text-[#C9A962] mb-3">Key Findings</h3>
                    <ul className="space-y-3">
                      {selectedInsight.keyFindings.map((finding, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <Target className="h-4 w-4 text-[#C9A962] mt-0.5 flex-shrink-0" />
                          <span className="text-[#F5F3EF]/80">{finding}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Innovation Components */}
                  <div className="space-y-4">
                    <ArgumentSynthesis arguments={selectedInsight.keyFindings} />
                    <DebateView topic={selectedInsight.title} />
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Metrics */}
                  <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4">
                    <h3 className="text-lg font-semibold text-[#7C9885] mb-4">Metrics</h3>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-[#F5F3EF]/70">Impact Score</span>
                          <span className="text-[#C9A962]">{selectedInsight.impactScore}/10</span>
                        </div>
                        <div className="h-2 bg-white/10 rounded-full">
                          <div 
                            className="h-full bg-[#C9A962] rounded-full"
                            style={{ width: `${selectedInsight.impactScore * 10}%` }}
                          />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-[#F5F3EF]/70">Novelty Score</span>
                          <span className="text-[#7C9885]">{selectedInsight.noveltyScore}/10</span>
                        </div>
                        <div className="h-2 bg-white/10 rounded-full">
                          <div 
                            className="h-full bg-[#7C9885] rounded-full"
                            style={{ width: `${selectedInsight.noveltyScore * 10}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Sources */}
                  <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4">
                    <h3 className="text-lg font-semibold text-[#8B7355] mb-4">Sources</h3>
                    <div className="space-y-2">
                      {selectedInsight.sources.map((source, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <BookOpen className="h-4 w-4 text-[#8B7355]" />
                          <span className="text-sm text-[#F5F3EF]/80">{source}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Related Concepts */}
                  <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4">
                    <h3 className="text-lg font-semibold text-[#C9A962] mb-4">Related Concepts</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedInsight.relatedConcepts.map(concept => (
                        <span
                          key={concept}
                          className="px-3 py-1 text-sm bg-[#C9A962]/20 text-[#C9A962] border border-[#C9A962]/30 rounded-full"
                        >
                          {concept}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Counter Evidence */}
                  <CounterEvidence claim={selectedInsight.title} />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
