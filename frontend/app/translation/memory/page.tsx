'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Search, 
  BookOpen, 
  Share2, 
  Clock, 
  Filter, 
  Star,
  Users,
  Eye,
  Copy,
  Edit3,
  Layers,
  Zap,
  Brain,
  Globe,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  FileText,
  Tag,
  TrendingUp,
  Hash,
  Quote,
  Bookmark,
  Download,
  Upload,
  Settings,
  Plus,
  X,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  RefreshCw
} from 'lucide-react'
import { MultiScaleView } from '@/components/innovations/multi_scale_view'
import { ComparativeFrames } from '@/components/innovations/comparative_frames'

interface TranslationMemory {
  id: string
  sourceText: string
  translation: string
  author: string
  work: string
  passage: string
  scholar: string
  timestamp: Date
  context: string
  tags: string[]
  confidence: number
  usage_count: number
  semantic_group: string
  alternatives: Array<{
    translation: string
    scholar: string
    reasoning: string
    votes: number
  }>
}

interface SemanticCluster {
  concept: string
  frequency: number
  translations: string[]
  contexts: string[]
  evolution: Array<{
    period: string
    dominant_translation: string
    usage_percentage: number
  }>
}

export default function TranslationMemoryStudio() {
  const [memories, setMemories] = useState<TranslationMemory[]>([])
  const [filteredMemories, setFilteredMemories] = useState<TranslationMemory[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedMemory, setSelectedMemory] = useState<TranslationMemory | null>(null)
  const [activeFilter, setActiveFilter] = useState<'all' | 'recent' | 'starred' | 'collaborative'>('all')
  const [viewMode, setViewMode] = useState<'list' | 'semantic' | 'timeline'>('list')
  const [isLoading, setIsLoading] = useState(true)
  const [semanticClusters, setSemanticClusters] = useState<SemanticCluster[]>([])
  const [showUpload, setShowUpload] = useState(false)
  const [selectedCluster, setSelectedCluster] = useState<string | null>(null)

  // Mock data generation
  useEffect(() => {
    const generateMockMemories = (): TranslationMemory[] => {
      const mockData = [
        {
          sourceText: "φρόνησις",
          translation: "practical wisdom",
          author: "Aristotle",
          work: "Nicomachean Ethics",
          passage: "VI.5.1140b",
          context: "Virtue ethics discussion - distinguishing phronesis from episteme and techne",
          tags: ["virtue", "wisdom", "ethics", "phronesis"],
          semantic_group: "intellectual_virtues"
        },
        {
          sourceText: "λόγος κατὰ φύσιν",
          translation: "reason according to nature",
          author: "Marcus Aurelius",
          work: "Meditations",
          passage: "II.11",
          context: "Stoic doctrine on living according to rational nature",
          tags: ["logos", "nature", "stoicism", "reason"],
          semantic_group: "stoic_physics"
        },
        {
          sourceText: "τὸ καλόν",
          translation: "the beautiful",
          author: "Plato",
          work: "Phaedrus",
          passage: "249d",
          context: "Theory of Forms - beauty as transcendent Form",
          tags: ["beauty", "forms", "aesthetics", "metaphysics"],
          semantic_group: "platonic_forms"
        },
        {
          sourceText: "virtus",
          translation: "virtue",
          author: "Cicero",
          work: "De Officiis",
          passage: "I.15",
          context: "Stoic influence on Roman moral philosophy",
          tags: ["virtue", "ethics", "stoicism", "roman"],
          semantic_group: "roman_ethics"
        },
        {
          sourceText: "ἀρετή",
          translation: "excellence",
          author: "Homer",
          work: "Iliad",
          passage: "IX.443",
          context: "Heroic excellence in martial context",
          tags: ["excellence", "heroic", "warfare", "homer"],
          semantic_group: "heroic_values"
        }
      ]

      return mockData.map((item, index) => ({
        id: `mem_${index}`,
        ...item,
        scholar: ["Dr. Sarah Chen", "Prof. Marcus Stone", "Dr. Elena Vasquez", "Prof. James Wright"][index % 4],
        timestamp: new Date(Date.now() - Math.random() * 10000000000),
        confidence: 0.7 + Math.random() * 0.3,
        usage_count: Math.floor(Math.random() * 50) + 1,
        alternatives: [
          {
            translation: index === 0 ? "prudence" : "wisdom",
            scholar: "Prof. Classical",
            reasoning: "Traditional rendering emphasizing practical judgment",
            votes: Math.floor(Math.random() * 10)
          }
        ]
      }))
    }

    const generateSemanticClusters = (): SemanticCluster[] => [
      {
        concept: "φρόνησις (phronesis)",
        frequency: 127,
        translations: ["practical wisdom", "prudence", "wise judgment", "practical intelligence"],
        contexts: ["Aristotelian ethics", "Stoic psychology", "Christian virtue"],
        evolution: [
          { period: "Classical", dominant_translation: "practical wisdom", usage_percentage: 78 },
          { period: "Medieval", dominant_translation: "prudence", usage_percentage: 85 },
          { period: "Modern", dominant_translation: "practical wisdom", usage_percentage: 72 }
        ]
      },
      {
        concept: "λόγος (logos)",
        frequency: 89,
        translations: ["reason", "word", "account", "principle", "ratio"],
        contexts: ["Heraclitean cosmology", "Stoic physics", "Christian theology"],
        evolution: [
          { period: "Pre-Socratic", dominant_translation: "account", usage_percentage: 65 },
          { period: "Stoic", dominant_translation: "reason", usage_percentage: 82 },
          { period: "Patristic", dominant_translation: "word", usage_percentage: 71 }
        ]
      }
    ]

    setTimeout(() => {
      const mockMemories = generateMockMemories()
      setMemories(mockMemories)
      setFilteredMemories(mockMemories)
      setSemanticClusters(generateSemanticClusters())
      setIsLoading(false)
    }, 1000)
  }, [])

  // Search and filter logic
  useEffect(() => {
    let filtered = memories

    if (searchQuery) {
      filtered = filtered.filter(memory => 
        memory.sourceText.toLowerCase().includes(searchQuery.toLowerCase()) ||
        memory.translation.toLowerCase().includes(searchQuery.toLowerCase()) ||
        memory.context.toLowerCase().includes(searchQuery.toLowerCase()) ||
        memory.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }

    switch (activeFilter) {
      case 'recent':
        filtered = filtered.filter(memory => 
          Date.now() - memory.timestamp.getTime() < 7 * 24 * 60 * 60 * 1000
        )
        break
      case 'starred':
        filtered = filtered.filter(memory => memory.confidence > 0.8)
        break
      case 'collaborative':
        filtered = filtered.filter(memory => memory.alternatives.length > 0)
        break
    }

    setFilteredMemories(filtered)
  }, [searchQuery, activeFilter, memories])

  const MemoryCard = ({ memory }: { memory: TranslationMemory }) => (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 hover:bg-white/8 transition-all duration-300 cursor-pointer group"
      onClick={() => setSelectedMemory(memory)}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-xl font-serif text-[#C9A962]">{memory.sourceText}</h3>
            <div className="flex items-center gap-1">
              {memory.confidence > 0.8 && <Star className="w-4 h-4 text-[#C9A962] fill-current" />}
              {memory.alternatives.length > 0 && <Users className="w-4 h-4 text-[#7C9885]" />}
            </div>
          </div>
          <p className="text-[#F5F3EF] text-lg mb-2">"{memory.translation}"</p>
          <div className="flex items-center gap-4 text-sm text-[#F5F3EF]/70">
            <span>{memory.author} • {memory.work}</span>
            <span>{memory.passage}</span>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-[#F5F3EF]/50" />
            <span className="text-sm text-[#F5F3EF]/70">{memory.usage_count}</span>
          </div>
          <div className="flex gap-1">
            <Copy className="w-4 h-4 text-[#F5F3EF]/50 opacity-0 group-hover:opacity-100 transition-opacity" />
            <Share2 className="w-4 h-4 text-[#F5F3EF]/50 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2 mb-3">
        {memory.tags.map(tag => (
          <span key={tag} className="px-2 py-1 bg-[#8B7355]/20 text-[#F5F3EF]/80 rounded-md text-xs">
            {tag}
          </span>
        ))}
      </div>
      
      <p className="text-sm text-[#F5F3EF]/60 line-clamp-2">{memory.context}</p>
      
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/5">
        <span className="text-xs text-[#F5F3EF]/50">{memory.scholar}</span>
        <div className="flex items-center gap-2">
          <div className="w-16 bg-white/10 rounded-full h-1">
            <div 
              className="h-1 bg-[#C9A962] rounded-full" 
              style={{ width: `${memory.confidence * 100}%` }}
            />
          </div>
          <span className="text-xs text-[#F5F3EF]/70">{Math.round(memory.confidence * 100)}%</span>
        </div>
      </div>
    </motion.div>
  )

  const SemanticClusterView = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {semanticClusters.map((cluster, index) => (
        <motion.div
          key={cluster.concept}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-serif text-[#C9A962]">{cluster.concept}</h3>
            <div className="flex items-center gap-2">
              <Hash className="w-4 h-4 text-[#F5F3EF]/50" />
              <span className="text-sm text-[#F5F3EF]/70">{cluster.frequency}</span>
            </div>
          </div>
          
          <div className="mb-4">
            <h4 className="text-sm font-medium text-[#F5F3EF]/80 mb-2">Common Translations</h4>
            <div className="flex flex-wrap gap-2">
              {cluster.translations.map(translation => (
                <span key={translation} className="px-2 py-1 bg-[#7C9885]/20 text-[#F5F3EF]/80 rounded-md text-xs">
                  {translation}
                </span>
              ))}
            </div>
          </div>
          
          <div className="mb-4">
            <h4 className="text-sm font-medium text-[#F5F3EF]/80 mb-2">Historical Evolution</h4>
            {cluster.evolution.map(period => (
              <div key={period.period} className="flex items-center justify-between mb-2">
                <span className="text-sm text-[#F5F3EF]/70">{period.period}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#F5F3EF]/60">{period.dominant_translation}</span>
                  <div className="w-12 bg-white/10 rounded-full h-1">
                    <div 
                      className="h-1 bg-[#C9A962] rounded-full" 
                      style={{ width: `${period.usage_percentage}%` }}
                    />
                  </div>
                  <span className="text-xs text-[#F5F3EF]/50">{period.usage_percentage}%</span>
                </div>
              </div>
            ))}
          </div>
          
          <button 
            onClick={() => setSelectedCluster(selectedCluster === cluster.concept ? null : cluster.concept)}
            className="w-full py-2 px-4 bg-[#C9A962]/10 hover:bg-[#C9A962]/20 border border-[#C9A962]/20 rounded-lg text-[#C9A962] text-sm transition-all duration-200 flex items-center justify-center gap-2"
          >
            <Brain className="w-4 h-4" />
            Explore Cluster
          </button>
        </motion.div>
      ))}
    </div>
  )

  const DetailModal = ({ memory }: { memory: TranslationMemory }) => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={() => setSelectedMemory(null)}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-[#0D0D0F] border border-white/20 rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-2xl font-serif text-[#C9A962] mb-2">{memory.sourceText}</h2>
            <p className="text-xl text-[#F5F3EF] mb-4">"{memory.translation}"</p>
          </div>
          <button 
            onClick={() => setSelectedMemory(null)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-[#F5F3EF]/70" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-[#F5F3EF]/80 mb-2">Source</h3>
              <p className="text-[#F5F3EF]/70">{memory.author} • {memory.work} {memory.passage}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-[#F5F3EF]/80 mb-2">Scholar</h3>
              <p className="text-[#F5F3EF]/70">{memory.scholar}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-[#F5F3EF]/80 mb-2">Usage & Confidence</h3>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-[#F5F3EF]/50" />
                  <span className="text-[#F5F3EF]/70">{memory.usage_count} uses</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-16 bg-white/10 rounded-full h-2">
                    <div 
                      className="h-2 bg-[#C9A962] rounded-full" 
                      style={{ width: `${memory.confidence * 100}%` }}
                    />
                  </div>
                  <span className="text-[#F5F3EF]/70">{Math.round(memory.confidence * 100)}%</span>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-[#F5F3EF]/80 mb-2">Context</h3>
            <p className="text-[#F5F3EF]/70 leading-relaxed">{memory.context}</p>
          </div>
        </div>

        {memory.alternatives.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-medium text-[#F5F3EF]/90 mb-4">Alternative Translations</h3>
            <div className="space-y-3">
              {memory.alternatives.map((alt, index) => (
                <div key={index} className="bg-white/5 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <p className="text-[#F5F3EF] font-medium">"{alt.translation}"</p>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-[#7C9885]" />
                      <span className="text-sm text-[#F5F3EF]/70">{alt.votes} votes</span>
                    </div>
                  </div>
                  <p className="text-sm text-[#F5F3EF]/60 mb-1">{alt.reasoning}</p>
                  <p className="text-xs text-[#F5F3EF]/50">{alt.scholar}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-3">
          <button className="flex-1 py-3 px-4 bg-[#C9A962] hover:bg-[#C9A962]/90 text-[#0D0D0F] rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2">
            <Copy className="w-4 h-4" />
            Copy Translation
          </button>
          <button className="py-3 px-4 bg-[#7C9885]/20 hover:bg-[#7C9885]/30 text-[#7C9885] rounded-lg transition-all duration-200 flex items-center gap-2">
            <Share2 className="w-4 h-4" />
            Share
          </button>
          <button className="py-3 px-4 bg-[#8B7355]/20 hover:bg-[#8B7355]/30 text-[#8B7355] rounded-lg transition-all duration-200 flex items-center gap-2">
            <ExternalLink className="w-4 h-4" />
            View Source
          </button>
        </div>
      </motion.div>
    </motion.div>
  )

  return (
    <div className="min-h-screen bg-[#0D0D0F] text-[#F5F3EF]">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#C9A962]/10 via-transparent to-[#7C9885]/10" />
        <div className="container mx-auto px-4 py-24 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              <Brain className="w-12 h-12 text-[#C9A962]" />
              <h1 className="text-5xl md:text-6xl font-serif font-bold text-[#C9A962]">
                Translation Memory
              </h1>
            </div>
            <p className="text-xl text-[#F5F3EF]/80 max-w-3xl mx-auto leading-relaxed">
              AI that understands what it's translating. Never lose a translation again. 
              Learn from the collective wisdom of scholars worldwide.
            </p>
          </motion.div>

          {/* Innovation Components */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <MultiScaleView
                title="Semantic Evolution"
                levels={[
                  { name: "Word", data: "φρόνησις", description: "Individual lexeme" },
                  { name: "Concept", data: "Practical Wisdom", description: "Philosophical concept" },
                  { name: "Tradition", data: "Aristotelian Ethics", description: "Intellectual framework" },
                  { name: "Era", data: "Classical Period", description: "Historical context" }
                ]}
                onLevelChange={(level) => console.log('Level changed:', level)}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <ComparativeFrames
                title="Translation Approaches"
                frames={[
                  {
                    title: "Aristotelian Context",
                    content: "φρόνησις as intellectual virtue - practical wisdom that guides ethical action",
                    metadata: { scholar: "Dr. Sarah Chen", confidence: 0.92, usage: 45 }
                  },
                  {
                    title: "Thomistic Reading", 
                    content: "φρόνησις as prudentia - cardinal virtue of practical reason in moral theology",
                    metadata: { scholar: "Prof. Marcus Stone", confidence: 0.87, usage: 32 }
                  },
                  {
                    title: "Contemporary Ethics",
                    content: "φρόνησις as contextual judgment - situational wisdom in applied ethics",
                    metadata: { scholar: "Dr. Elena Vasquez", confidence: 0.94, usage: 28 }
                  }
                ]}
                onFrameSelect={(frame) => console.log('Frame selected:', frame)}
              />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main Interface */}
      <div className="container mx-auto px-4 py-12">
        {/* Controls Bar */}
        <div className="flex flex-col lg:flex-row gap-6 mb-8">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#F5F3EF]/50" />
            <input
              type="text"
              placeholder="Search translations, contexts, or concepts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl text-[#F5F3EF] placeholder-[#F5F3EF]/50 focus:outline-none focus:border-[#C9A962]/50 focus:bg-white/8 transition-all duration-200"
            />
          </div>

          {/* Filters */}
          <div className="flex gap-3">
            {[
              { key: 'all', label: 'All Memories', icon: FileText },
              { key: 'recent', label: 'Recent', icon: Clock },
              { key: 'starred', label: 'High Confidence', icon: Star },
              { key: 'collaborative', label: 'Collaborative', icon: Users }
            ].map(filter => (
              <button
                key={filter.key}
                onClick={() => setActiveFilter(filter.key as any)}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-200 ${
                  activeFilter === filter.key
                    ? 'bg-[#C9A962] text-[#0D0D0F]'
                    : 'bg-white/5 text-[#F5F3EF]/70 hover:bg-white/10'
                }`}
              >
                <filter.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{filter.label}</span>
              </button>
            ))}
          </div>

          {/* View Mode */}
          <div className="flex gap-2 bg-white/5 rounded-lg p-1">
            {[
              { key: 'list', icon: FileText },
              { key: 'semantic', icon: Brain },
              { key: 'timeline', icon: Clock }
            ].map(mode => (
              <button
                key={mode.key}
                onClick={() => setViewMode(mode.key as any)}
                className={`p-2 rounded-md transition-all duration-200 ${
                  viewMode === mode.key
                    ? 'bg-[#C9A962] text-[#0D0D0F]'
                    : 'text-[#F5F3EF]/70 hover:bg-white/10'
                }`}
              >
                <mode.icon className="w-4 h-4" />
              </button>
            ))}
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <button
              onClick={() => setShowUpload(true)}
              className="px-4 py-2 bg-[#7C9885]/20 hover:bg-[#7C9885]/30 text-[#7C9885] rounded-lg flex items-center gap-2 transition-all duration-200"
            >
              <Upload className="w-4 h-4" />
              <span className="hidden sm:inline">Import</span>
            </button>
            <button className="px-4 py-2 bg-[#C9A962] hover:bg-[#C9A962]/90 text-[#0D0D0F] rounded-lg flex items-center gap-2 transition-all duration-200">
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">New Memory</span>
            </button>
          </div>
        </div>

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          {[
            { label: 'Total Memories', value: memories.length, icon: Bookmark, color: '[#C9A962]' },
            { label: 'Scholars', value: '127', icon: Users, color: '[#7C9885]' },
            { label: 'Languages', value: '8', icon: Globe, color: '[#8B7355]' },
            { label: 'Reused', value: '2.4k', icon: RefreshCw, color: '[#C9A962]' }
          ].map((stat, index) => (
            <div key={stat.label} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <stat.icon className={`w-5 h-5 text-${stat.color}`} />
                <span className="text-sm text-[#F5F3EF]/70">{stat.label}</span>
              </div>
              <p className={`text-2xl font-bold text-${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </motion.div>

        {/* Main Content */}
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center py-24"
            >
              <div className="flex items-center gap-3">
                <RefreshCw className="w-6 h-6 text-[#C9A962] animate-spin" />
                <span className="text-[#F5F3EF]/70">Loading translation memories...</span>
              </div>
            </motion.div>
          ) : filteredMemories.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-24"
            >
              <Search className="w-16 h-16 text-[#F5F3EF]/30 mx-auto mb-6" />
              <h3 className="text-xl font-medium text-[#F5F3EF]/80 mb-2">No memories found</h3>
              <p className="text-[#F5F3EF]/60 mb-8">Try adjusting your search or filters</p>
              <button className="px-6 py-3 bg-[#C9A962] hover:bg-[#C9A962]/90 text-[#0D0D0F] rounded-lg font-medium transition-all duration-200 flex items-center gap-2 mx-auto">
                <Plus className="w-4 h-4" />
                Create First Memory
              </button>
            </motion.div>
          ) : (
            <motion.div
              key={viewMode}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {viewMode === 'list' && (
                <div className="space-y-4">
                  {filteredMemories.map(memory => (
                    <MemoryCard key={memory.id} memory={memory} />
                  ))}
                </div>
              )}
              
              {viewMode === 'semantic' && <SemanticClusterView />}
              
              {viewMode === 'timeline' && (
                <div className="space-y-8">
                  {/* Timeline Header */}
                  <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Clock className="w-6 h-6 text-[#C9A962]" />
                      <h3 className="text-xl font-serif text-[#F5F3EF]">Translation Evolution Timeline</h3>
                    </div>
                    <p className="text-[#F5F3EF]/60 text-sm">
                      Explore how key terms have been translated across different historical periods
                    </p>
                  </div>

                  {/* Evolution Charts for Each Concept */}
                  {semanticClusters.map((cluster, clusterIndex) => (
                    <motion.div
                      key={cluster.concept}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: clusterIndex * 0.1 }}
                      className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6"
                    >
                      <div className="flex items-center justify-between mb-6">
                        <div>
                          <h4 className="text-lg font-serif text-[#C9A962] mb-1">{cluster.concept}</h4>
                          <p className="text-sm text-[#F5F3EF]/60">{cluster.frequency} occurrences across corpus</p>
                        </div>
                        <div className="flex gap-2">
                          {cluster.translations.slice(0, 3).map(t => (
                            <span key={t} className="px-2 py-1 bg-white/10 text-[#F5F3EF]/70 text-xs rounded-full">
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Timeline Visualization */}
                      <div className="relative">
                        {/* Timeline Line */}
                        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#C9A962] via-[#7C9885] to-[#8B7355]" />

                        {/* Timeline Points */}
                        <div className="space-y-6 pl-12">
                          {cluster.evolution.map((evo, evoIndex) => (
                            <motion.div
                              key={evo.period}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: clusterIndex * 0.1 + evoIndex * 0.05 }}
                              className="relative"
                            >
                              {/* Timeline Dot */}
                              <div className="absolute -left-12 top-1 w-8 h-8 bg-[#0D0D0F] rounded-full border-2 border-[#C9A962] flex items-center justify-center">
                                <div className="w-3 h-3 bg-[#C9A962] rounded-full" />
                              </div>

                              {/* Period Card */}
                              <div className="bg-white/5 border border-white/10 rounded-lg p-4 hover:border-[#C9A962]/30 transition-colors">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-[#C9A962] font-medium">{evo.period}</span>
                                  <span className="text-sm text-[#7C9885]">{evo.usage_percentage}% of translations</span>
                                </div>
                                <div className="flex items-center gap-3">
                                  <Quote className="w-4 h-4 text-[#F5F3EF]/40" />
                                  <span className="text-[#F5F3EF] font-serif italic">"{evo.dominant_translation}"</span>
                                </div>
                                {/* Usage Bar */}
                                <div className="mt-3 h-2 bg-white/10 rounded-full overflow-hidden">
                                  <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${evo.usage_percentage}%` }}
                                    transition={{ duration: 0.8, delay: clusterIndex * 0.1 + evoIndex * 0.1 }}
                                    className="h-full bg-gradient-to-r from-[#C9A962] to-[#7C9885] rounded-full"
                                  />
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>

                      {/* Context Tags */}
                      <div className="mt-6 pt-4 border-t border-white/10">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs text-[#F5F3EF]/50">Contexts:</span>
                          {cluster.contexts.map(ctx => (
                            <span key={ctx} className="px-2 py-1 bg-[#7C9885]/20 text-[#7C9885] text-xs rounded-full">
                              {ctx}
                            </span>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  ))}

                  {/* Recent Translation Activity */}
                  <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <TrendingUp className="w-5 h-5 text-[#7C9885]" />
                      <h4 className="text-lg font-medium text-[#F5F3EF]">Recent Translation Activity</h4>
                    </div>
                    <div className="space-y-3">
                      {filteredMemories.slice(0, 5).map((memory, idx) => (
                        <motion.div
                          key={memory.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: idx * 0.05 }}
                          className="flex items-center justify-between py-3 border-b border-white/5 last:border-0"
                        >
                          <div className="flex items-center gap-4">
                            <div className="text-sm text-[#F5F3EF]/40">
                              {memory.timestamp.toLocaleDateString()}
                            </div>
                            <div>
                              <span className="text-[#C9A962] font-serif">{memory.sourceText}</span>
                              <ArrowRight className="inline w-4 h-4 mx-2 text-[#F5F3EF]/30" />
                              <span className="text-[#F5F3EF]">{memory.translation}</span>
                            </div>
                          </div>
                          <div className="text-xs text-[#F5F3EF]/50">
                            {memory.author}, {memory.work}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedMemory && <DetailModal memory={selectedMemory} />}
      </AnimatePresence>

      {/* Upload Modal */}
      <AnimatePresence>
        {showUpload && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowUpload(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#0D0D0F] border border-white/20 rounded-2xl p-8 max-w-2xl w-full"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-serif text-[#C9A962]">Import Translation Memory</h2>
                <button 
                  onClick={() => setShowUpload(false)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-[#F5F3EF]/70" />
                </button>
              </div>
              
              <div className="border-2 border-dashed border-white/20 rounded-xl p-12 text-center mb-6">
                <Upload className="w-12 h-12 text-[#C9A962] mx-auto mb-4" />
                <h3 className="text-lg font-medium text-[#F5F3EF]/90 mb-2">Drop your files here</h3>
                <p className="text-[#F5F3EF]/60 mb-4">Supports TMX, JSON, CSV, and plain text formats</p>
                <button className="px-6 py-3 bg-[#C9A962] hover:bg-[#C9A962]/90 text-[#0D0D0F] rounded-lg font-medium transition-all duration-200">
                  Choose Files
                </button>
              </div>
              
              <div className="flex gap-3">
                <button 
                  onClick={() => setShowUpload(false)}
                  className="flex-1 py-3 px-4 bg-white/5 hover:bg-white/10 border border-white/10 text-[#F5F3EF] rounded-lg transition-all duration-200"
                >
                  Cancel
                </button>
                <button className="flex-1 py-3 px-4 bg-[#C9A962] hover:bg-[#C9A962]/90 text-[#0D0D0F] rounded-lg font-medium transition-all duration-200">
                  Import Memory
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
