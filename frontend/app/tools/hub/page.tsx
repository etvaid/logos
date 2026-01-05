'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Search, 
  BookOpen, 
  Scroll, 
  Languages, 
  Brain, 
  Zap, 
  Star, 
  Clock, 
  Grid3x3, 
  List,
  Filter,
  ArrowRight,
  Sparkles,
  Globe,
  FileText,
  Calculator,
  Eye,
  Users,
  Target,
  Layers,
  Compass,
  Lightbulb,
  Workflow,
  Database,
  PenTool,
  BookMarked,
  Map,
  TreePine,
  Microscope,
  Network,
  Flame
} from 'lucide-react'
import { ArgumentSynthesis } from '@/components/innovations/argument_synthesis'
import { ComparativeFrames } from '@/components/innovations/comparative_frames'

interface Tool {
  id: string
  name: string
  description: string
  category: string
  icon: React.ReactNode
  status: 'available' | 'beta' | 'coming-soon'
  lastUsed?: Date
  isFavorite: boolean
  tags: string[]
  aiPowered?: boolean
}

interface ToolCategory {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  color: string
  tools: Tool[]
}

const ScholarWorkbench = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const toolCategories: ToolCategory[] = [
    {
      id: 'text-analysis',
      name: 'Text Analysis',
      description: 'Deep linguistic and literary analysis tools',
      icon: <Microscope className="w-6 h-6" />,
      color: 'from-blue-500/20 to-cyan-500/20',
      tools: [
        {
          id: 'morphological-parser',
          name: 'Morphological Parser',
          description: 'AI-enhanced parsing with contextual disambiguation',
          category: 'text-analysis',
          icon: <Brain className="w-5 h-5" />,
          status: 'available',
          isFavorite: true,
          tags: ['grammar', 'parsing', 'ai'],
          aiPowered: true,
          lastUsed: new Date('2024-01-15')
        },
        {
          id: 'semantic-search',
          name: 'Semantic Search',
          description: 'Find passages by meaning, not just keywords',
          category: 'text-analysis',
          icon: <Sparkles className="w-5 h-5" />,
          status: 'beta',
          isFavorite: true,
          tags: ['search', 'ai', 'semantic'],
          aiPowered: true,
          lastUsed: new Date('2024-01-14')
        },
        {
          id: 'intertextuality-detector',
          name: 'Intertextuality Detector',
          description: 'Discover hidden allusions and parallels across corpora',
          category: 'text-analysis',
          icon: <Network className="w-5 h-5" />,
          status: 'available',
          isFavorite: false,
          tags: ['allusions', 'parallels', 'ai'],
          aiPowered: true
        },
        {
          id: 'stylometric-analysis',
          name: 'Stylometric Analysis',
          description: 'Quantitative analysis of literary style and authorship',
          category: 'text-analysis',
          icon: <Calculator className="w-5 h-5" />,
          status: 'available',
          isFavorite: false,
          tags: ['statistics', 'authorship', 'style']
        }
      ]
    },
    {
      id: 'research-workspace',
      name: 'Research Workspace',
      description: 'Collaborative research and annotation tools',
      icon: <Users className="w-6 h-6" />,
      color: 'from-green-500/20 to-emerald-500/20',
      tools: [
        {
          id: 'living-apparatus',
          name: 'Living Apparatus',
          description: 'Dynamic, community-driven critical apparatus',
          category: 'research-workspace',
          icon: <BookOpen className="w-5 h-5" />,
          status: 'beta',
          isFavorite: true,
          tags: ['apparatus', 'collaboration', 'dynamic'],
          aiPowered: true,
          lastUsed: new Date('2024-01-16')
        },
        {
          id: 'annotation-studio',
          name: 'Annotation Studio',
          description: 'Rich multimedia annotations with automatic citations',
          category: 'research-workspace',
          icon: <PenTool className="w-5 h-5" />,
          status: 'available',
          isFavorite: true,
          tags: ['annotations', 'citations', 'multimedia'],
          lastUsed: new Date('2024-01-13')
        },
        {
          id: 'research-memory',
          name: 'Research Memory',
          description: 'AI assistant that remembers your entire research journey',
          category: 'research-workspace',
          icon: <Brain className="w-5 h-5" />,
          status: 'available',
          isFavorite: false,
          tags: ['ai', 'memory', 'assistant'],
          aiPowered: true,
          lastUsed: new Date('2024-01-14')
        },
        {
          id: 'collaborative-editor',
          name: 'Collaborative Editor',
          description: 'Real-time collaborative text editing and commentary',
          category: 'research-workspace',
          icon: <Users className="w-5 h-5" />,
          status: 'available',
          isFavorite: false,
          tags: ['collaboration', 'editing', 'real-time']
        }
      ]
    },
    {
      id: 'reference-library',
      name: 'Reference Library',
      description: 'Comprehensive dictionaries and reference works',
      icon: <BookMarked className="w-6 h-6" />,
      color: 'from-amber-500/20 to-orange-500/20',
      tools: [
        {
          id: 'polyglot-lexicon',
          name: 'Polyglot Lexicon',
          description: 'Unified search across all major dictionaries',
          category: 'reference-library',
          icon: <Languages className="w-5 h-5" />,
          status: 'available',
          isFavorite: true,
          tags: ['dictionary', 'multilingual', 'unified'],
          lastUsed: new Date('2024-01-16')
        },
        {
          id: 'etymology-explorer',
          name: 'Etymology Explorer',
          description: 'Visual etymology trees with Indo-European roots',
          category: 'reference-library',
          icon: <TreePine className="w-5 h-5" />,
          status: 'available',
          isFavorite: false,
          tags: ['etymology', 'visualization', 'indo-european']
        },
        {
          id: 'prosody-analyzer',
          name: 'Prosody Analyzer',
          description: 'Automated scansion with metrical pattern recognition',
          category: 'reference-library',
          icon: <Workflow className="w-5 h-5" />,
          status: 'beta',
          isFavorite: false,
          tags: ['prosody', 'meter', 'scansion'],
          aiPowered: true
        },
        {
          id: 'onomasticon',
          name: 'Digital Onomasticon',
          description: 'Comprehensive database of ancient names and places',
          category: 'reference-library',
          icon: <Map className="w-5 h-5" />,
          status: 'available',
          isFavorite: false,
          tags: ['names', 'places', 'geography']
        }
      ]
    },
    {
      id: 'corpus-explorer',
      name: 'Corpus Explorer',
      description: 'Advanced corpus navigation and discovery',
      icon: <Compass className="w-6 h-6" />,
      color: 'from-purple-500/20 to-violet-500/20',
      tools: [
        {
          id: 'temporal-navigator',
          name: 'Temporal Navigator',
          description: 'Explore texts chronologically with historical context',
          category: 'corpus-explorer',
          icon: <Clock className="w-5 h-5" />,
          status: 'available',
          isFavorite: false,
          tags: ['chronology', 'history', 'navigation']
        },
        {
          id: 'genre-classifier',
          name: 'Genre Classifier',
          description: 'AI-powered genre and theme classification',
          category: 'corpus-explorer',
          icon: <Target className="w-5 h-5" />,
          status: 'beta',
          isFavorite: false,
          tags: ['genre', 'classification', 'ai'],
          aiPowered: true
        },
        {
          id: 'influence-mapper',
          name: 'Influence Mapper',
          description: 'Visualize literary influence networks across time',
          category: 'corpus-explorer',
          icon: <Network className="w-5 h-5" />,
          status: 'available',
          isFavorite: false,
          tags: ['influence', 'networks', 'visualization'],
          aiPowered: true,
          lastUsed: new Date('2024-01-11')
        },
        {
          id: 'manuscript-viewer',
          name: 'Manuscript Viewer',
          description: 'High-resolution manuscript viewing with AI transcription',
          category: 'corpus-explorer',
          icon: <Scroll className="w-5 h-5" />,
          status: 'available',
          isFavorite: true,
          tags: ['manuscripts', 'transcription', 'ai'],
          aiPowered: true,
          lastUsed: new Date('2024-01-12')
        }
      ]
    }
  ]

  const getAllTools = (): Tool[] => {
    return toolCategories.flatMap(category => category.tools)
  }

  const getRecentTools = (): Tool[] => {
    return getAllTools()
      .filter(tool => tool.lastUsed)
      .sort((a, b) => (b.lastUsed?.getTime() || 0) - (a.lastUsed?.getTime() || 0))
      .slice(0, 6)
  }

  const getFavoriteTools = (): Tool[] => {
    return getAllTools().filter(tool => tool.isFavorite)
  }

  const getFilteredTools = (): Tool[] => {
    let tools = selectedCategory 
      ? toolCategories.find(cat => cat.id === selectedCategory)?.tools || []
      : getAllTools()

    if (searchQuery) {
      tools = tools.filter(tool => 
        tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }

    if (showFavoritesOnly) {
      tools = tools.filter(tool => tool.isFavorite)
    }

    return tools
  }

  const toggleFavorite = (toolId: string) => {
    // In real implementation, this would update the backend
    console.log(`Toggling favorite for tool: ${toolId}`)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'text-green-400'
      case 'beta': return 'text-amber-400'
      case 'coming-soon': return 'text-slate-400'
      default: return 'text-slate-400'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'available': return 'Available'
      case 'beta': return 'Beta'
      case 'coming-soon': return 'Coming Soon'
      default: return 'Unknown'
    }
  }

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [])

  if (error) {
    return (
      <div className="min-h-screen bg-[#0D0D0F] flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="text-red-400 text-xl mb-4">Error loading tools</div>
          <div className="text-[#F5F3EF]/70">{error}</div>
        </motion.div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0D0D0F] flex items-center justify-center">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-2 border-[#C9A962] border-t-transparent rounded-full"
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0D0D0F] text-[#F5F3EF]">
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative py-16 px-6"
      >
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full mb-6"
          >
            <Sparkles className="w-4 h-4 text-[#C9A962]" />
            <span className="text-sm text-[#C9A962]">Scholar's Workbench</span>
          </motion.div>
          
          <motion.h1 
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-[#C9A962] via-[#F5F3EF] to-[#7C9885] bg-clip-text text-transparent"
          >
            Everything a serious scholar needs
          </motion.h1>
          
          <motion.p 
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-[#F5F3EF]/70 max-w-3xl mx-auto mb-8"
          >
            Revolutionary tools that remember your research, understand your questions, and accelerate discovery through AI-powered analysis
          </motion.p>

          {/* Quick Search */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="relative max-w-md mx-auto mb-12"
          >
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#F5F3EF]/40" />
            <input
              type="text"
              placeholder="Search tools..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl text-[#F5F3EF] placeholder:text-[#F5F3EF]/40 focus:outline-none focus:border-[#C9A962] transition-colors"
            />
          </motion.div>
        </div>
      </motion.section>

      {/* Filter Controls */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="px-6 mb-8"
      >
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              className="flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg hover:bg-white/10 transition-colors"
            >
              {viewMode === 'grid' ? <Grid3x3 className="w-4 h-4" /> : <List className="w-4 h-4" />}
              <span className="text-sm">{viewMode === 'grid' ? 'Grid' : 'List'}</span>
            </button>
            
            <button
              onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
              className={`flex items-center gap-2 px-4 py-2 backdrop-blur-xl border rounded-lg transition-colors ${
                showFavoritesOnly 
                  ? 'bg-[#C9A962]/20 border-[#C9A962]/30 text-[#C9A962]' 
                  : 'bg-white/5 border-white/10 hover:bg-white/10'
              }`}
            >
              <Star className="w-4 h-4" />
              <span className="text-sm">Favorites</span>
            </button>
          </div>

          <div className="text-sm text-[#F5F3EF]/60">
            {getFilteredTools().length} tools
          </div>
        </div>
      </motion.section>

      {/* Tool Categories */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="px-6 mb-12"
      >
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">Tool Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`p-6 backdrop-blur-xl border rounded-2xl transition-all hover:scale-105 ${
                selectedCategory === null
                  ? 'bg-[#C9A962]/20 border-[#C9A962]/30'
                  : 'bg-white/5 border-white/10 hover:bg-white/10'
              }`}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg">
                  <Layers className="w-6 h-6" />
                </div>
                <span className="font-semibold">All Tools</span>
              </div>
              <p className="text-sm text-[#F5F3EF]/70 text-left">
                Browse all available tools
              </p>
            </button>

            {toolCategories.map((category, index) => (
              <motion.button
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                onClick={() => setSelectedCategory(category.id)}
                className={`p-6 backdrop-blur-xl border rounded-2xl transition-all hover:scale-105 ${
                  selectedCategory === category.id
                    ? 'bg-[#C9A962]/20 border-[#C9A962]/30'
                    : 'bg-white/5 border-white/10 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className={`p-2 bg-gradient-to-r ${category.color} rounded-lg`}>
                    {category.icon}
                  </div>
                  <span className="font-semibold">{category.name}</span>
                </div>
                <p className="text-sm text-[#F5F3EF]/70 text-left mb-3">
                  {category.description}
                </p>
                <div className="text-xs text-[#C9A962]">
                  {category.tools.length} tools
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Recent Tools */}
      {!selectedCategory && !searchQuery && (
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="px-6 mb-12"
        >
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <Clock className="w-6 h-6 text-[#C9A962]" />
              <h2 className="text-2xl font-bold">Recent Tools</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getRecentTools().map((tool, index) => (
                <motion.div
                  key={tool.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="group p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl hover:bg-white/10 hover:border-[#C9A962]/30 transition-all cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 bg-gradient-to-r from-[#C9A962]/20 to-[#7C9885]/20 rounded-xl">
                      {tool.icon}
                    </div>
                    <button
                      onClick={() => toggleFavorite(tool.id)}
                      className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                    >
                      <Star className={`w-4 h-4 ${tool.isFavorite ? 'text-[#C9A962] fill-current' : 'text-[#F5F3EF]/40'}`} />
                    </button>
                  </div>
                  
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold group-hover:text-[#C9A962] transition-colors">
                      {tool.name}
                    </h3>
                    {tool.aiPowered && <Sparkles className="w-4 h-4 text-[#C9A962]" />}
                  </div>
                  
                  <p className="text-sm text-[#F5F3EF]/70 mb-4">
                    {tool.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className={`text-xs ${getStatusColor(tool.status)}`}>
                      {getStatusText(tool.status)}
                    </span>
                    <span className="text-xs text-[#F5F3EF]/50">
                      {tool.lastUsed?.toLocaleDateString()}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>
      )}

      {/* Favorites Section */}
      {!selectedCategory && !searchQuery && (
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="px-6 mb-12"
        >
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <Star className="w-6 h-6 text-[#C9A962]" />
              <h2 className="text-2xl font-bold">Favorite Tools</h2>
            </div>
            {getFavoriteTools().length === 0 ? (
              <div className="text-center py-12">
                <Star className="w-12 h-12 text-[#F5F3EF]/30 mx-auto mb-4" />
                <p className="text-[#F5F3EF]/60">No favorite tools yet</p>
                <p className="text-sm text-[#F5F3EF]/40">Click the star icon on any tool to add it to your favorites</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {getFavoriteTools().map((tool, index) => (
                  <motion.div
                    key={tool.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 * index }}
                    className="group p-6 bg-gradient-to-br from-[#C9A962]/10 via-white/5 to-[#7C9885]/10 backdrop-blur-xl border border-[#C9A962]/20 rounded-2xl hover:border-[#C9A962]/40 transition-all cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="p-3 bg-gradient-to-r from-[#C9A962]/30 to-[#7C9885]/30 rounded-xl">
                        {tool.icon}
                      </div>
                      <div className="p-2 rounded-lg bg-[#C9A962]/20">
                        <Star className="w-4 h-4 text-[#C9A962] fill-current" />
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-[#C9A962]">
                        {tool.name}
                      </h3>
                      {tool.aiPowered && <Sparkles className="w-4 h-4 text-[#C9A962]" />}
                    </div>
                    
                    <p className="text-sm text-[#F5F3EF]/70 mb-4">
                      {tool.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <span className={`text-xs ${getStatusColor(tool.status)}`}>
                        {getStatusText(tool.status)}
                      </span>
                      {tool.lastUsed && (
                        <span className="text-xs text-[#C9A962]/70">
                          {tool.lastUsed.toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.section>
      )}

      {/* Tools Grid/List */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0 }}
        className="px-6 mb-12"
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">
              {selectedCategory 
                ? toolCategories.find(cat => cat.id === selectedCategory)?.name 
                : 'All Tools'
              }
            </h2>
            {selectedCategory && (
              <button
                onClick={() => setSelectedCategory(null)}
                className="flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg hover:bg-white/10 transition-colors"
              >
                <span className="text-sm">Clear Filter</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>

          <AnimatePresence mode="wait">
            {getFilteredTools().length === 0 ? (
              <motion.div
                key="empty-state"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center py-12"
              >
                <Search className="w-12 h-12 text-[#F5F3EF]/30 mx-auto mb-4" />
                <p className="text-[#F5F3EF]/60 mb-2">No tools found</p>
                <p className="text-sm text-[#F5F3EF]/40">Try adjusting your search or filters</p>
              </motion.div>
            ) : (
              <motion.div
                key="tools-grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={`grid gap-6 ${
                  viewMode === 'grid' 
                    ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                    : 'grid-cols-1'
                }`}
              >
                {getFilteredTools().map((tool, index) => (
                  <motion.div
                    key={tool.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ 
                      delay: 0.05 * index,
                      layout: { duration: 0.3 }
                    }}
                    className={`group p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl hover:bg-white/10 hover:border-[#C9A962]/30 transition-all cursor-pointer ${
                      viewMode === 'list' ? 'flex items-center gap-6' : ''
                    }`}
                  >
                    <div className={`${viewMode === 'list' ? 'flex-shrink-0' : ''}`}>
                      <div className="flex items-start justify-between mb-4">
                        <div className="p-3 bg-gradient-to-r from-[#C9A962]/20 to-[#7C9885]/20 rounded-xl">
                          {tool.icon}
                        </div>
                        {viewMode === 'grid' && (
                          <button
                            onClick={() => toggleFavorite(tool.id)}
                            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                          >
                            <Star className={`w-4 h-4 ${tool.isFavorite ? 'text-[#C9A962] fill-current' : 'text-[#F5F3EF]/40'}`} />
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="flex-grow">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold group-hover:text-[#C9A962] transition-colors">
                          {tool.name}
                        </h3>
                        {tool.aiPowered && <Sparkles className="w-4 h-4 text-[#C9A962]" />}
                        <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(tool.status)} bg-white/10`}>
                          {getStatusText(tool.status)}
                        </span>
                      </div>
                      
                      <p className="text-sm text-[#F5F3EF]/70 mb-4">
                        {tool.description}
                      </p>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        {tool.tags.map(tag => (
                          <span
                            key={tag}
                            className="text-xs px-2 py-1 bg-white/10 text-[#F5F3EF]/60 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      
                      <div className="flex items-center justify-between">
                        {tool.lastUsed && (
                          <span className="text-xs text-[#F5F3EF]/50">
                            Last used: {tool.lastUsed.toLocaleDateString()}
                          </span>
                        )}
                        {viewMode === 'list' && (
                          <button
                            onClick={() => toggleFavorite(tool.id)}
                            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                          >
                            <Star className={`w-4 h-4 ${tool.isFavorite ? 'text-[#C9A962] fill-current' : 'text-[#F5F3EF]/40'}`} />
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.section>

      {/* Innovation Showcase */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.1 }}
        className="px-6 py-12 border-t border-white/10"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#C9A962]/20 to-[#7C9885]/20 backdrop-blur-xl border border-[#C9A962]/30 rounded-full mb-6"
            >
              <Flame className="w-4 h-4 text-[#C9A962]" />
              <span className="text-sm text-[#C9A962]">Revolutionary Features</span>
            </motion.div>
            
            <h2 className="text-3xl font-bold mb-4">
              Innovations You've Never Seen Before
            </h2>
            <p className="text-[#F5F3EF]/70 max-w-2xl mx-auto">
              Experience the future of classical scholarship with AI-powered tools that understand context, meaning, and scholarly intent.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.3 }}
            >
              <ArgumentSynthesis />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.4 }}
            >
              <ComparativeFrames />
            </motion.div>
          </div>
        </div>
      </motion.section>
    </div>
  )
}

export default ScholarWorkbench
