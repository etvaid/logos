'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Search, 
  Lightbulb, 
  TrendingUp, 
  Clock, 
  Sparkles, 
  Brain, 
  Network, 
  BookOpen, 
  ArrowRight, 
  Zap, 
  Eye, 
  MessageCircle,
  ChevronRight,
  Star,
  Filter,
  RefreshCw,
  Users,
  Globe,
  Target,
  Compass
} from 'lucide-react'
import ArgumentSynthesisLayer from '@/components/innovations/argument_synthesis'
import DebateView from '@/components/innovations/debate_view'
import CounterEvidenceDisplay from '@/components/innovations/counter_evidence'
import ResearchCanvas from '@/components/innovations/research_canvas'

interface ResearchQuery {
  id: string
  text: string
  type: 'semantic' | 'thematic' | 'comparative' | 'temporal'
  confidence: number
  estimatedResults: number
  relatedConcepts: string[]
}

interface Discovery {
  id: string
  title: string
  description: string
  relevance: number
  type: 'connection' | 'pattern' | 'anomaly' | 'trend'
  sources: string[]
  timestamp: string
  tags: string[]
}

interface TrendingTopic {
  id: string
  title: string
  description: string
  momentum: number
  scholars: number
  recentFindings: number
  category: string
  keywords: string[]
}

const SUGGESTED_QUESTIONS = [
  {
    category: "Philosophical Concepts",
    questions: [
      "How does the concept of justice evolve from Homer to Plato?",
      "What are the hidden connections between Stoic physics and ethics?",
      "Where do we see early ideas of consciousness in pre-Socratic texts?"
    ]
  },
  {
    category: "Literary Patterns", 
    questions: [
      "Which authors use similar metaphors for the soul's journey?",
      "How do tragic choruses comment on fate across different plays?",
      "What recurring symbols appear in mystery religion texts?"
    ]
  },
  {
    category: "Historical Analysis",
    questions: [
      "How do political upheavals reflect in contemporary literature?",
      "What economic concepts appear in philosophical dialogues?",
      "Which texts show influence from Egyptian or Persian thought?"
    ]
  },
  {
    category: "Cross-Cultural Connections",
    questions: [
      "Where do we see Buddhist-like ideas in Hellenistic philosophy?",
      "How do Roman adaptations change Greek philosophical concepts?",
      "What parallels exist between Orphic and Near Eastern creation myths?"
    ]
  }
]

const RECENT_DISCOVERIES = [
  {
    id: '1',
    title: 'Hidden Aristotelian Influence in Late Stoic Ethics',
    description: 'AI analysis reveals unexplored connections between Aristotelian virtue theory and Marcus Aurelius\' Meditations, particularly in passages about moral development.',
    relevance: 0.94,
    type: 'connection' as const,
    sources: ['Marcus Aurelius', 'Aristotle', 'Epictetus'],
    timestamp: '2 hours ago',
    tags: ['ethics', 'stoicism', 'aristotle']
  },
  {
    id: '2', 
    title: 'Recurring Water Metaphors in Neoplatonic Texts',
    description: 'Cross-corpus analysis identified a previously unnoticed pattern of water imagery used to describe emanation across Plotinus, Proclus, and Damascius.',
    relevance: 0.89,
    type: 'pattern' as const,
    sources: ['Plotinus', 'Proclus', 'Damascius'],
    timestamp: '5 hours ago',
    tags: ['neoplatonism', 'metaphor', 'emanation']
  },
  {
    id: '3',
    title: 'Anomalous Usage of δικαιοσύνη in Republic Book IV',
    description: 'Statistical analysis reveals Plato uses δικαιοσύνη with unusual grammatical constructions in three key passages, possibly indicating scribal variants or deliberate emphasis.',
    relevance: 0.87,
    type: 'anomaly' as const,
    sources: ['Plato'],
    timestamp: '1 day ago', 
    tags: ['plato', 'justice', 'textual-criticism']
  },
  {
    id: '4',
    title: 'Emerging Interest in Presocratic Cosmology',
    description: 'Surge in scholarly queries about Anaximander and Heraclitus suggests renewed focus on early cosmological thinking, possibly influenced by modern physics parallels.',
    relevance: 0.85,
    type: 'trend' as const,
    sources: ['Anaximander', 'Heraclitus', 'Empedocles'],
    timestamp: '2 days ago',
    tags: ['presocratics', 'cosmology', 'physics']
  }
]

const TRENDING_TOPICS = [
  {
    id: '1',
    title: 'Ancient Theories of Consciousness',
    description: 'Scholars are investigating proto-psychological concepts in ancient texts, driven by modern neuroscience parallels.',
    momentum: 0.92,
    scholars: 247,
    recentFindings: 18,
    category: 'Philosophy of Mind',
    keywords: ['consciousness', 'soul', 'perception', 'cognition']
  },
  {
    id: '2', 
    title: 'Climate and Environmental Awareness',
    description: 'Growing interest in how ancient authors understood natural cycles and environmental change.',
    momentum: 0.88,
    scholars: 189,
    recentFindings: 12,
    category: 'Environmental History',
    keywords: ['nature', 'seasons', 'agriculture', 'climate']
  },
  {
    id: '3',
    title: 'Gender and Identity in Ancient Sources',
    description: 'Renewed analysis of gender roles and identity concepts across philosophical and literary texts.',
    momentum: 0.85,
    scholars: 156,
    recentFindings: 23,
    category: 'Social History',
    keywords: ['gender', 'identity', 'sexuality', 'social-roles']
  },
  {
    id: '4',
    title: 'Mathematical Concepts in Philosophy',
    description: 'Investigation of mathematical thinking in Pythagorean, Platonic, and Aristotelian traditions.',
    momentum: 0.82,
    scholars: 134,
    recentFindings: 9,
    category: 'History of Mathematics',
    keywords: ['mathematics', 'geometry', 'number', 'proportion']
  }
]

export default function DiscoveryPage() {
  const [query, setQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [searchResults, setSearchResults] = useState<ResearchQuery[]>([])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedDiscovery, setSelectedDiscovery] = useState<Discovery | null>(null)
  const [activeInnovation, setActiveInnovation] = useState<string | null>(null)
  const [showAdvanced, setShowAdvanced] = useState(false)

  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return
    
    setIsSearching(true)
    
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const mockResults: ResearchQuery[] = [
      {
        id: '1',
        text: searchQuery,
        type: 'semantic',
        confidence: 0.94,
        estimatedResults: 127,
        relatedConcepts: ['virtue', 'excellence', 'character', 'habit']
      },
      {
        id: '2', 
        text: `Comparative analysis: ${searchQuery} across different authors`,
        type: 'comparative',
        confidence: 0.89,
        estimatedResults: 89,
        relatedConcepts: ['influence', 'tradition', 'development', 'schools']
      },
      {
        id: '3',
        text: `Temporal evolution of concepts related to: ${searchQuery}`,
        type: 'temporal', 
        confidence: 0.86,
        estimatedResults: 156,
        relatedConcepts: ['chronology', 'development', 'change', 'continuity']
      }
    ]
    
    setSearchResults(mockResults)
    setIsSearching(false)
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
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  }

  const pulseVariants = {
    pulse: {
      scale: [1, 1.05, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  }

  return (
    <div className="min-h-screen bg-[#0D0D0F] text-[#F5F3EF]">
      {/* Hero Section */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="relative overflow-hidden"
      >
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-96 h-96 bg-[#C9A962]/5 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-80 h-80 bg-[#7C9885]/5 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-[#C9A962]/3 to-transparent rounded-full" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">
          <motion.div variants={itemVariants} className="text-center mb-16">
            <motion.div 
              variants={pulseVariants}
              animate="pulse"
              className="inline-flex items-center gap-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full px-6 py-3 mb-8"
            >
              <Sparkles className="w-5 h-5 text-[#C9A962]" />
              <span className="text-sm font-medium">AI Research Assistant</span>
            </motion.div>
            
            <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-[#C9A962] via-[#F5F3EF] to-[#7C9885] bg-clip-text text-transparent">
              Find what you didn't know to look for
            </h1>
            
            <p className="text-xl text-[#F5F3EF]/70 max-w-3xl mx-auto leading-relaxed">
              Discover hidden connections, emerging patterns, and unexplored relationships across the entire corpus of ancient texts using advanced AI analysis.
            </p>
          </motion.div>

          {/* Search Interface */}
          <motion.div variants={itemVariants} className="max-w-4xl mx-auto mb-16">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
              <div className="relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                  {isSearching ? (
                    <RefreshCw className="w-6 h-6 text-[#C9A962] animate-spin" />
                  ) : (
                    <Brain className="w-6 h-6 text-[#C9A962]" />
                  )}
                </div>
                
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch(query)}
                  placeholder="Ask a research question: 'How does the concept of justice evolve from Homer to Plato?'"
                  className="w-full bg-white/10 border border-white/20 rounded-xl pl-16 pr-32 py-4 text-lg placeholder-[#F5F3EF]/50 focus:outline-none focus:border-[#C9A962] focus:ring-2 focus:ring-[#C9A962]/20"
                />
                
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
                  <button
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className="px-4 py-2 bg-[#8B7355]/20 hover:bg-[#8B7355]/30 rounded-lg text-sm transition-all duration-200"
                  >
                    <Filter className="w-4 h-4" />
                  </button>
                  
                  <button
                    onClick={() => handleSearch(query)}
                    disabled={isSearching || !query.trim()}
                    className="px-6 py-2 bg-[#C9A962] hover:bg-[#C9A962]/80 disabled:bg-[#C9A962]/50 rounded-lg font-medium transition-all duration-200 flex items-center gap-2"
                  >
                    {isSearching ? 'Analyzing...' : 'Discover'}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Advanced Options */}
              <AnimatePresence>
                {showAdvanced && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-6 pt-6 border-t border-white/10"
                  >
                    <div className="grid grid-cols-4 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2 text-[#C9A962]">Analysis Type</label>
                        <select className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm">
                          <option value="semantic">Semantic</option>
                          <option value="comparative">Comparative</option>
                          <option value="temporal">Temporal</option>
                          <option value="thematic">Thematic</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2 text-[#C9A962]">Time Period</label>
                        <select className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm">
                          <option value="all">All Periods</option>
                          <option value="archaic">Archaic</option>
                          <option value="classical">Classical</option>
                          <option value="hellenistic">Hellenistic</option>
                          <option value="imperial">Imperial</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2 text-[#C9A962]">Genre</label>
                        <select className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm">
                          <option value="all">All Genres</option>
                          <option value="philosophy">Philosophy</option>
                          <option value="poetry">Poetry</option>
                          <option value="history">History</option>
                          <option value="oratory">Oratory</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2 text-[#C9A962]">Confidence</label>
                        <select className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm">
                          <option value="high">High (90%+)</option>
                          <option value="medium">Medium (70%+)</option>
                          <option value="low">Low (50%+)</option>
                        </select>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Search Results */}
            <AnimatePresence>
              {searchResults.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="mt-8 space-y-4"
                >
                  {searchResults.map((result, index) => (
                    <motion.div
                      key={result.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 hover:border-[#C9A962]/30 transition-all duration-300 cursor-pointer group"
                      onClick={() => setActiveInnovation('research-canvas')}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <div className={`w-3 h-3 rounded-full ${
                              result.type === 'semantic' ? 'bg-[#C9A962]' :
                              result.type === 'comparative' ? 'bg-[#7C9885]' :
                              result.type === 'temporal' ? 'bg-[#8B7355]' : 'bg-[#F5F3EF]'
                            }`} />
                            <span className="text-sm font-medium text-[#C9A962] capitalize">{result.type} Analysis</span>
                            <span className="text-sm text-[#F5F3EF]/60">
                              {result.confidence * 100}% confidence • {result.estimatedResults} results
                            </span>
                          </div>
                          
                          <h3 className="text-lg font-semibold mb-2 group-hover:text-[#C9A962] transition-colors">
                            {result.text}
                          </h3>
                          
                          <div className="flex flex-wrap gap-2">
                            {result.relatedConcepts.map((concept) => (
                              <span
                                key={concept}
                                className="px-3 py-1 bg-[#C9A962]/10 text-[#C9A962] rounded-full text-sm"
                              >
                                {concept}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        <ChevronRight className="w-5 h-5 text-[#F5F3EF]/40 group-hover:text-[#C9A962] transition-colors ml-4" />
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Innovation Showcase */}
          <AnimatePresence>
            {activeInnovation && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="fixed inset-0 z-50 bg-[#0D0D0F]/90 backdrop-blur-xl flex items-center justify-center p-6"
                onClick={() => setActiveInnovation(null)}
              >
                <div 
                  className="w-full max-w-6xl max-h-[90vh] overflow-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  {activeInnovation === 'research-canvas' && <ResearchCanvas />}
                  {activeInnovation === 'argument-synthesis' && <ArgumentSynthesisLayer />}
                  {activeInnovation === 'debate-view' && <DebateView />}
                  {activeInnovation === 'counter-evidence' && <CounterEvidenceDisplay />}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Main Content Grid */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Suggested Questions */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="lg:col-span-2"
          >
            <motion.div variants={itemVariants} className="mb-8">
              <div className="flex items-center gap-3 mb-6">
                <Lightbulb className="w-6 h-6 text-[#C9A962]" />
                <h2 className="text-2xl font-bold">Suggested Research Questions</h2>
              </div>
              
              <div className="grid gap-6">
                {SUGGESTED_QUESTIONS.map((category, categoryIndex) => (
                  <motion.div
                    key={category.category}
                    variants={itemVariants}
                    className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6"
                  >
                    <h3 className="text-lg font-semibold text-[#C9A962] mb-4">{category.category}</h3>
                    
                    <div className="space-y-3">
                      {category.questions.map((question, questionIndex) => (
                        <motion.button
                          key={questionIndex}
                          whileHover={{ x: 4 }}
                          onClick={() => {
                            setQuery(question)
                            handleSearch(question)
                          }}
                          className="w-full text-left p-4 bg-white/5 hover:bg-white/10 rounded-lg transition-all duration-200 group"
                        >
                          <div className="flex items-start gap-3">
                            <MessageCircle className="w-5 h-5 text-[#7C9885] mt-0.5 flex-shrink-0" />
                            <span className="text-[#F5F3EF]/90 group-hover:text-[#F5F3EF] leading-relaxed">
                              {question}
                            </span>
                            <ArrowRight className="w-4 h-4 text-[#F5F3EF]/40 group-hover:text-[#C9A962] transition-colors ml-auto flex-shrink-0 mt-0.5" />
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Trending Topics */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
          >
            <motion.div variants={itemVariants}>
              <div className="flex items-center gap-3 mb-6">
                <TrendingUp className="w-6 h-6 text-[#C9A962]" />
                <h2 className="text-xl font-bold">Trending Topics</h2>
              </div>
              
              <div className="space-y-4">
                {TRENDING_TOPICS.map((topic, index) => (
                  <motion.div
                    key={topic.id}
                    variants={itemVariants}
                    whileHover={{ scale: 1.02 }}
                    className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-5 hover:border-[#C9A962]/30 transition-all duration-300 cursor-pointer"
                    onClick={() => setActiveInnovation('debate-view')}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-semibold text-[#F5F3EF] leading-snug">{topic.title}</h3>
                      <div className="flex items-center gap-1 ml-2">
                        <Star className="w-4 h-4 text-[#C9A962]" />
                        <span className="text-sm text-[#C9A962]">{(topic.momentum * 100).toFixed(0)}</span>
                      </div>
                    </div>
                    
                    <p className="text-sm text-[#F5F3EF]/70 mb-4 leading-relaxed">
                      {topic.description}
                    </p>
                    
                    <div className="flex items-center justify-between text-xs text-[#F5F3EF]/60 mb-3">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {topic.scholars}
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          {topic.recentFindings}
                        </span>
                      </div>
                      <span className="text-[#7C9885]">{topic.category}</span>
                    </div>
                    
                    <div className="flex flex-wrap gap-1">
                      {topic.keywords.slice(0, 3).map((keyword) => (
                        <span
                          key={keyword}
                          className="px-2 py-1 bg-[#8B7355]/20 text-[#8B7355] rounded text-xs"
                        >
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Recent Discoveries */}
        <motion.div
          initial="hidden"
          whileInView="visible" 
          viewport={{ once: true }}
          variants={containerVariants}
          className="mt-16"
        >
          <motion.div variants={itemVariants}>
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <Compass className="w-6 h-6 text-[#C9A962]" />
                <h2 className="text-2xl font-bold">Recent Discoveries</h2>
              </div>
              
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#F5F3EF]/60" />
                <span className="text-sm text-[#F5F3EF]/60">Updated continuously</span>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              {RECENT_DISCOVERIES.map((discovery, index) => (
                <motion.div
                  key={discovery.id}
                  variants={itemVariants}
                  whileHover={{ y: -4 }}
                  className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 hover:border-[#C9A962]/30 transition-all duration-300 cursor-pointer group"
                  onClick={() => setActiveInnovation('argument-synthesis')}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      discovery.type === 'connection' ? 'bg-[#C9A962]/20' :
                      discovery.type === 'pattern' ? 'bg-[#7C9885]/20' :
                      discovery.type === 'anomaly' ? 'bg-[#8B7355]/20' : 'bg-[#F5F3EF]/20'
                    }`}>
                      {discovery.type === 'connection' && <Network className="w-6 h-6 text-[#C9A962]" />}
                      {discovery.type === 'pattern' && <Target className="w-6 h-6 text-[#7C9885]" />}
                      {discovery.type === 'anomaly' && <Zap className="w-6 h-6 text-[#8B7355]" />}
                      {discovery.type === 'trend' && <TrendingUp className="w-6 h-6 text-[#F5F3EF]" />}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-[#C9A962] uppercase tracking-wider">
                          {discovery.type}
                        </span>
                        <span className="text-xs text-[#F5F3EF]/60">{discovery.timestamp}</span>
                      </div>
                      
                      <h3 className="font-semibold text-[#F5F3EF] mb-3 group-hover:text-[#C9A962] transition-colors leading-snug">
                        {discovery.title}
                      </h3>
                      
                      <p className="text-sm text-[#F5F3EF]/70 mb-4 leading-relaxed">
                        {discovery.description}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex flex-wrap gap-1">
                          {discovery.tags.slice(0, 2).map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-1 bg-[#C9A962]/10 text-[#C9A962] rounded text-xs"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        
                        <div className="flex items-center gap-1 text-xs text-[#F5F3EF]/60">
                          <BookOpen className="w-3 h-3" />
                          <span>{discovery.sources.length} sources</span>
                        </div>
                      </div>
                      
                      <div className="mt-3 pt-3 border-t border-white/10">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-[#F5F3EF]/60">Relevance Score</span>
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-1.5 bg-white/20 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-[#C9A962] rounded-full transition-all duration-1000"
                                style={{ width: `${discovery.relevance * 100}%` }}
                              />
                            </div>
                            <span className="text-xs text-[#C9A962] font-medium">
                              {(discovery.relevance * 100).toFixed(0)}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Innovation Features Preview */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className="mt-20"
        >
          <motion.div variants={itemVariants} className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Revolutionary Research Tools</h2>
            <p className="text-xl text-[#F5F3EF]/70 max-w-3xl mx-auto">
              Experience the future of scholarly research with AI-powered analysis tools that think like a scholar.
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: 'Research Canvas',
                description: 'Visualize complex relationships between concepts, authors, and ideas in an interactive workspace.',
                icon: Network,
                color: 'C9A962',
                innovation: 'research-canvas'
              },
              {
                title: 'Argument Synthesis', 
                description: 'Automatically identify and synthesize competing arguments across multiple texts and authors.',
                icon: Brain,
                color: '7C9885',
                innovation: 'argument-synthesis'
              },
              {
                title: 'Scholarly Debates',
                description: 'See how scholars have interpreted key passages and join ongoing academic conversations.',
                icon: MessageCircle,
                color: '8B7355', 
                innovation: 'debate-view'
              },
              {
                title: 'Counter-Evidence',
                description: 'Discover evidence that challenges your assumptions and strengthens your arguments.',
                icon: Target,
                color: 'F5F3EF',
                innovation: 'counter-evidence'
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                variants={itemVariants}
                whileHover={{ y: -8, scale: 1.02 }}
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 hover:border-[#C9A962]/30 transition-all duration-300 cursor-pointer group"
                onClick={() => setActiveInnovation(feature.innovation)}
              >
                <div className={`w-14 h-14 rounded-xl bg-[#${feature.color}]/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className={`w-7 h-7 text-[#${feature.color}]`} />
                </div>
                
                <h3 className="text-lg font-semibold mb-3 group-hover:text-[#C9A962] transition-colors">
                  {feature.title}
                </h3>
                
                <p className="text-sm text-[#F5F3EF]/70 leading-relaxed mb-4">
                  {feature.description}
                </p>
                
                <div className="flex items-center gap-2 text-[#C9A962] font-medium text-sm group-hover:gap-3 transition-all duration-200">
                  <span>Try it now</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={itemVariants}
          className="mt-20 text-center"
        >
          <div className="bg-gradient-to-r from-[#C9A962]/10 via-[#7C9885]/10 to-[#8B7355]/10 rounded-2xl p-12 border border-white/10">
            <h2 className="text-3xl font-bold mb-4">Start Your Discovery Journey</h2>
            <p className="text-lg text-[#F5F3EF]/70 mb-8 max-w-2xl mx-auto">
              Join thousands of scholars who are already uncovering hidden insights in ancient texts. 
              Your next breakthrough is just a question away.
            </p>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => document.querySelector('input')?.focus()}
              className="bg-[#C9A962] hover:bg-[#C9A962]/80 text-[#0D0D0F] px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 inline-flex items-center gap-3"
            >
              <Sparkles className="w-5 h-5" />
              Begin Discovering
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
