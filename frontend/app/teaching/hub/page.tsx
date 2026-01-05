'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  BookOpen, 
  Layers, 
  Zap, 
  Users, 
  Clock, 
  Plus, 
  Search,
  Filter,
  Star,
  Share2,
  Download,
  Play,
  ChevronRight,
  Brain,
  Target,
  Sparkles,
  Globe,
  Library,
  Wand2,
  ArrowRight,
  Eye,
  Heart,
  MessageSquare,
  Bookmark,
  Award,
  Lightbulb,
  Puzzle,
  Microscope,
  Atom,
  GitBranch,
  Workflow,
  Shuffle,
  TrendingUp,
  Calendar,
  User,
  Settings,
  RefreshCw
} from 'lucide-react'
import { MultiScaleView } from '@/components/innovations/multi_scale_view'
import { NarrativeTimeline } from '@/components/innovations/narrative_timeline'

interface Tool {
  id: string
  name: string
  description: string
  category: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  usage: number
  rating: number
  icon: any
  features: string[]
  lastUsed?: string
  isNew?: boolean
  isPremium?: boolean
}

interface Material {
  id: string
  title: string
  type: string
  author: string
  lastModified: string
  category: string
  difficulty: string
  usage: number
  thumbnail: string
  tags: string[]
  isShared: boolean
  collaborators: number
}

interface SharedResource {
  id: string
  title: string
  creator: string
  category: string
  downloads: number
  rating: number
  description: string
  tags: string[]
  createdAt: string
  thumbnail: string
  isVerified: boolean
}

const TOOL_CATEGORIES = [
  {
    id: 'grammar',
    name: 'Grammar Engine',
    description: 'AI-powered parsing, analysis, and explanation tools',
    icon: Brain,
    color: 'from-emerald-500/20 to-teal-600/20',
    count: 12
  },
  {
    id: 'vocabulary',
    name: 'Vocabulary Builder',
    description: 'Adaptive vocabulary acquisition and retention systems',
    icon: Target,
    color: 'from-blue-500/20 to-indigo-600/20',
    count: 8
  },
  {
    id: 'reading',
    name: 'Reading Scaffold',
    description: 'Progressive difficulty and contextual support tools',
    icon: BookOpen,
    color: 'from-purple-500/20 to-violet-600/20',
    count: 15
  },
  {
    id: 'composition',
    name: 'Composition Lab',
    description: 'Writing practice with intelligent feedback systems',
    icon: Wand2,
    color: 'from-orange-500/20 to-red-600/20',
    count: 9
  },
  {
    id: 'assessment',
    name: 'Assessment Suite',
    description: 'Diagnostic and formative evaluation instruments',
    icon: Award,
    color: 'from-pink-500/20 to-rose-600/20',
    count: 11
  },
  {
    id: 'collaboration',
    name: 'Social Learning',
    description: 'Peer interaction and collaborative annotation tools',
    icon: Users,
    color: 'from-cyan-500/20 to-blue-600/20',
    count: 6
  }
]

const FEATURED_TOOLS = [
  {
    id: 'semantic-parser',
    name: 'Semantic Grammar Parser',
    description: 'Search for grammatical patterns across entire corpora with AI-powered understanding',
    category: 'grammar',
    difficulty: 'advanced' as const,
    usage: 1247,
    rating: 4.9,
    icon: Microscope,
    features: ['Semantic search', 'Pattern recognition', 'Cross-reference analysis', 'Export results'],
    isNew: true
  },
  {
    id: 'adaptive-vocab',
    name: 'Adaptive Vocabulary System',
    description: 'Personalized vocabulary learning that adapts to student knowledge and learning patterns',
    category: 'vocabulary',
    difficulty: 'beginner' as const,
    usage: 3421,
    rating: 4.8,
    icon: Target,
    features: ['Spaced repetition', 'Contextual learning', 'Progress tracking', 'Gamification'],
    isNew: false
  },
  {
    id: 'ai-tutor',
    name: 'AI Grammar Tutor',
    description: 'Intelligent tutoring system that provides real-time feedback and explanations',
    category: 'grammar',
    difficulty: 'intermediate' as const,
    usage: 2156,
    rating: 4.7,
    icon: Brain,
    features: ['Real-time feedback', 'Personalized explanations', 'Error analysis', 'Study plans'],
    isPremium: true
  },
  {
    id: 'collaborative-annotation',
    name: 'Collaborative Commentary',
    description: 'Real-time collaborative annotation with version control and discussion threads',
    category: 'collaboration',
    difficulty: 'intermediate' as const,
    usage: 892,
    rating: 4.6,
    icon: MessageSquare,
    features: ['Real-time editing', 'Version control', 'Discussion threads', 'Export options']
  }
]

export default function PedagogyEnginePage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [materials, setMaterials] = useState<Material[]>([])
  const [sharedResources, setSharedResources] = useState<SharedResource[]>([])
  const [activeView, setActiveView] = useState<'grid' | 'list'>('grid')

  // Mock data loading
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true)
        await new Promise(resolve => setTimeout(resolve, 1500))
        
        setMaterials([
          {
            id: '1',
            title: 'Caesar BGI.1-10 with Adaptive Scaffolding',
            type: 'Reading Passage',
            author: 'Dr. Sarah Chen',
            lastModified: '2 hours ago',
            category: 'reading',
            difficulty: 'Intermediate',
            usage: 234,
            thumbnail: '/api/placeholder/300/200',
            tags: ['Caesar', 'Narrative', 'War', 'Beginner-Friendly'],
            isShared: true,
            collaborators: 3
          },
          {
            id: '2',
            title: 'Subjunctive Mastery Sequence',
            type: 'Grammar Module',
            author: 'Prof. Marcus Rodriguez',
            lastModified: '1 day ago',
            category: 'grammar',
            difficulty: 'Advanced',
            usage: 156,
            thumbnail: '/api/placeholder/300/200',
            tags: ['Grammar', 'Subjunctive', 'Progressive'],
            isShared: false,
            collaborators: 1
          },
          {
            id: '3',
            title: 'Cicero Vocabulary Builder',
            type: 'Vocabulary Set',
            author: 'Dr. Elena Vasquez',
            lastModified: '3 days ago',
            category: 'vocabulary',
            difficulty: 'Intermediate',
            usage: 445,
            thumbnail: '/api/placeholder/300/200',
            tags: ['Cicero', 'Rhetoric', 'Advanced Vocabulary'],
            isShared: true,
            collaborators: 7
          }
        ])

        setSharedResources([
          {
            id: '1',
            title: 'Complete Vergil Aeneid Commentary',
            creator: 'Cambridge Classics Collective',
            category: 'reading',
            downloads: 15420,
            rating: 4.9,
            description: 'Comprehensive commentary with grammatical notes, cultural context, and discussion questions for all 12 books',
            tags: ['Vergil', 'Epic', 'Commentary', 'Complete'],
            createdAt: '2023-09-15',
            thumbnail: '/api/placeholder/300/200',
            isVerified: true
          },
          {
            id: '2',
            title: 'Latin Prose Composition Toolkit',
            creator: 'Prof. David Williams',
            category: 'composition',
            downloads: 8934,
            rating: 4.7,
            description: 'Progressive exercises in Latin composition with model answers and style guides',
            tags: ['Composition', 'Prose', 'Exercises', 'Style'],
            createdAt: '2023-10-22',
            thumbnail: '/api/placeholder/300/200',
            isVerified: true
          },
          {
            id: '3',
            title: 'Interactive Roman History Timeline',
            creator: 'Digital Humanities Lab',
            category: 'collaboration',
            downloads: 12156,
            rating: 4.8,
            description: 'Interactive timeline connecting historical events with literary texts and primary sources',
            tags: ['History', 'Timeline', 'Interactive', 'Context'],
            createdAt: '2023-11-08',
            thumbnail: '/api/placeholder/300/200',
            isVerified: true
          }
        ])
        
        setError(null)
      } catch (err) {
        setError('Failed to load teaching tools. Please try again.')
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  const filteredTools = FEATURED_TOOLS.filter(tool => {
    const matchesCategory = selectedCategory === 'all' || tool.category === selectedCategory
    const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         tool.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-400 bg-green-400/10'
      case 'intermediate': return 'text-yellow-400 bg-yellow-400/10'
      case 'advanced': return 'text-red-400 bg-red-400/10'
      default: return 'text-gray-400 bg-gray-400/10'
    }
  }

  const QuickCreateSection = () => (
    <div className="bg-gradient-to-br from-[#C9A962]/10 to-[#7C9885]/10 rounded-2xl p-8 border border-white/10">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-[#C9A962]/20 rounded-lg">
          <Sparkles className="w-6 h-6 text-[#C9A962]" />
        </div>
        <h3 className="text-2xl font-bold text-[#F5F3EF]">Quick Create</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: BookOpen, label: 'Reading Passage', color: 'text-blue-400' },
          { icon: Brain, label: 'Grammar Exercise', color: 'text-green-400' },
          { icon: Target, label: 'Vocabulary Set', color: 'text-purple-400' },
          { icon: Award, label: 'Assessment', color: 'text-orange-400' }
        ].map((item, index) => (
          <motion.button
            key={item.label}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-6 bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 hover:border-[#C9A962]/30 transition-all duration-300"
          >
            <item.icon className={`w-8 h-8 ${item.color} mb-3 mx-auto`} />
            <p className="text-[#F5F3EF] font-medium">{item.label}</p>
          </motion.button>
        ))}
      </div>
      
      <div className="mt-6 p-4 bg-[#C9A962]/5 rounded-lg border border-[#C9A962]/20">
        <div className="flex items-center gap-2 text-[#C9A962] mb-2">
          <Lightbulb className="w-4 h-4" />
          <span className="text-sm font-medium">AI Assistant Ready</span>
        </div>
        <p className="text-sm text-[#F5F3EF]/70">
          Describe what you want to create, and our AI will generate a complete learning module with exercises, assessments, and adaptive difficulty.
        </p>
      </div>
    </div>
  )

  if (error) {
    return (
      <div className="min-h-screen bg-[#0D0D0F] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <RefreshCw className="w-8 h-8 text-red-400" />
          </div>
          <h2 className="text-2xl font-bold text-[#F5F3EF] mb-2">Something went wrong</h2>
          <p className="text-[#F5F3EF]/70 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-[#C9A962] text-[#0D0D0F] rounded-lg font-medium hover:bg-[#C9A962]/90 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0D0D0F]">
      {/* Hero Section */}
      <div className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-gradient-to-br from-[#C9A962]/5 via-transparent to-[#7C9885]/5" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 bg-[#C9A962]/10 border border-[#C9A962]/20 rounded-full px-4 py-2 mb-6">
              <Zap className="w-4 h-4 text-[#C9A962]" />
              <span className="text-[#C9A962] text-sm font-medium">Pedagogy Engine</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-[#F5F3EF] via-[#C9A962] to-[#7C9885] bg-clip-text text-transparent">
                Tools that actually
              </span>
              <br />
              <span className="text-[#F5F3EF]">help people learn</span>
            </h1>
            <p className="text-xl text-[#F5F3EF]/70 max-w-3xl mx-auto leading-relaxed">
              Revolutionary teaching instruments powered by AI, designed by educators who understand 
              the real challenges of classical language pedagogy.
            </p>
          </motion.div>

          {/* Stats Row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16"
          >
            {[
              { label: 'Active Tools', value: '61+', icon: Workflow },
              { label: 'Institutions', value: '247', icon: Library },
              { label: 'Success Rate', value: '94%', icon: TrendingUp },
              { label: 'AI Accuracy', value: '99.2%', icon: Target }
            ].map((stat, index) => (
              <div key={stat.label} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-white/5 rounded-lg mb-3">
                  <stat.icon className="w-6 h-6 text-[#C9A962]" />
                </div>
                <div className="text-3xl font-bold text-[#F5F3EF] mb-1">{stat.value}</div>
                <div className="text-[#F5F3EF]/60 text-sm">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Tool Categories */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mb-16"
        >
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-[#F5F3EF]">Tool Categories</h2>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="w-5 h-5 text-[#F5F3EF]/40 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search tools..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-[#F5F3EF] placeholder-[#F5F3EF]/40 focus:outline-none focus:border-[#C9A962]/50 focus:ring-2 focus:ring-[#C9A962]/20"
                />
              </div>
              <button className="p-2 bg-white/5 rounded-lg border border-white/10 hover:border-[#C9A962]/30 transition-colors">
                <Filter className="w-5 h-5 text-[#F5F3EF]/70" />
              </button>
            </div>
          </div>

          <MultiScaleView>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {TOOL_CATEGORIES.map((category, index) => (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, y: -2 }}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`p-6 rounded-2xl border cursor-pointer transition-all duration-300 ${
                    selectedCategory === category.id
                      ? 'bg-white/10 border-[#C9A962]/50 shadow-lg shadow-[#C9A962]/10'
                      : 'bg-white/5 border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${category.color} flex items-center justify-center mb-4`}>
                    <category.icon className="w-8 h-8 text-[#F5F3EF]" />
                  </div>
                  <h3 className="text-xl font-bold text-[#F5F3EF] mb-2">{category.name}</h3>
                  <p className="text-[#F5F3EF]/70 mb-4 leading-relaxed">{category.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-[#C9A962] font-medium">{category.count} tools</span>
                    <ChevronRight className="w-5 h-5 text-[#F5F3EF]/40" />
                  </div>
                </motion.div>
              ))}
            </div>
          </MultiScaleView>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-3 mb-8">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedCategory === 'all'
                  ? 'bg-[#C9A962] text-[#0D0D0F]'
                  : 'bg-white/5 text-[#F5F3EF]/70 hover:bg-white/10'
              }`}
            >
              All Tools
            </button>
            {TOOL_CATEGORIES.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === category.id
                    ? 'bg-[#C9A962] text-[#0D0D0F]'
                    : 'bg-white/5 text-[#F5F3EF]/70 hover:bg-white/10'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>

          {/* Featured Tools Grid */}
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
              >
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="bg-white/5 rounded-2xl p-6 animate-pulse">
                    <div className="w-12 h-12 bg-white/10 rounded-lg mb-4" />
                    <div className="h-6 bg-white/10 rounded mb-3" />
                    <div className="h-4 bg-white/10 rounded mb-2" />
                    <div className="h-4 bg-white/10 rounded w-2/3" />
                  </div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
              >
                {filteredTools.map((tool, index) => (
                  <motion.div
                    key={tool.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02, y: -4 }}
                    className="group bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 hover:border-[#C9A962]/30 transition-all duration-300 cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="p-3 bg-[#C9A962]/20 rounded-xl">
                        <tool.icon className="w-6 h-6 text-[#C9A962]" />
                      </div>
                      <div className="flex gap-2">
                        {tool.isNew && (
                          <span className="px-2 py-1 bg-green-400/20 text-green-400 text-xs font-medium rounded-full">
                            NEW
                          </span>
                        )}
                        {tool.isPremium && (
                          <span className="px-2 py-1 bg-[#C9A962]/20 text-[#C9A962] text-xs font-medium rounded-full">
                            PRO
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <h3 className="text-lg font-bold text-[#F5F3EF] mb-2 group-hover:text-[#C9A962] transition-colors">
                      {tool.name}
                    </h3>
                    <p className="text-[#F5F3EF]/70 text-sm mb-4 leading-relaxed">
                      {tool.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-1 mb-4">
                      {tool.features.slice(0, 2).map(feature => (
                        <span
                          key={feature}
                          className="px-2 py-1 bg-white/10 text-[#F5F3EF]/60 text-xs rounded-full"
                        >
                          {feature}
                        </span>
                      ))}
                      {tool.features.length > 2 && (
                        <span className="px-2 py-1 bg-white/10 text-[#F5F3EF]/60 text-xs rounded-full">
                          +{tool.features.length - 2}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-[#F5F3EF] text-sm font-medium">{tool.rating}</span>
                        </div>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getDifficultyColor(tool.difficulty)}`}>
                          {tool.difficulty}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-[#F5F3EF]/60 text-sm">
                        <Eye className="w-4 h-4" />
                        {tool.usage}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.section>

        {/* Quick Create Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mb-16"
        >
          <QuickCreateSection />
        </motion.section>

        {/* Recent Materials */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mb-16"
        >
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-[#F5F3EF]">Recent Materials</h2>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveView('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  activeView === 'grid' ? 'bg-[#C9A962] text-[#0D0D0F]' : 'bg-white/5 text-[#F5F3EF]/70'
                }`}
              >
                <Layers className="w-5 h-5" />
              </button>
              <button
                onClick={() => setActiveView('list')}
                className={`p-2 rounded-lg transition-colors ${
                  activeView === 'list' ? 'bg-[#C9A962] text-[#0D0D0F]' : 'bg-white/5 text-[#F5F3EF]/70'
                }`}
              >
                <Library className="w-5 h-5" />
              </button>
            </div>
          </div>

          <NarrativeTimeline>
            <div className={`grid gap-6 ${
              activeView === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'
            }`}>
              {materials.map((material, index) => (
                <motion.div
                  key={material.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.01 }}
                  className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 hover:border-[#7C9885]/30 transition-all duration-300 overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-[#F5F3EF] mb-1">{material.title}</h3>
                        <p className="text-[#F5F3EF]/60 text-sm">{material.type} • {material.author}</p>
                      </div>
                      <div className="flex gap-2">
                        {material.isShared && (
                          <div className="p-2 bg-[#7C9885]/20 rounded-lg">
                            <Share2 className="w-4 h-4 text-[#7C9885]" />
                          </div>
                        )}
                        <button className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
                          <Bookmark className="w-4 h-4 text-[#F5F3EF]/70" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {material.tags.map(tag => (
                        <span
                          key={tag}
                          className="px-3 py-1 bg-white/10 text-[#F5F3EF]/70 text-xs rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-[#F5F3EF]/60">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {material.lastModified}
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {material.collaborators}
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        {material.usage}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </NarrativeTimeline>
          
          {materials.length === 0 && !isLoading && (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-[#F5F3EF]/40" />
              </div>
              <h3 className="text-xl font-bold text-[#F5F3EF] mb-2">No materials yet</h3>
              <p className="text-[#F5F3EF]/60 mb-6">Start creating your first teaching material to see it here.</p>
              <button className="px-6 py-3 bg-[#C9A962] text-[#0D0D0F] rounded-lg font-medium hover:bg-[#C9A962]/90 transition-colors">
                Create First Material
              </button>
            </div>
          )}
        </motion.section>

        {/* Shared Resources */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mb-16"
        >
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-[#F5F3EF]">Shared Resources</h2>
            <button className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-lg border border-white/10 hover:border-[#7C9885]/30 transition-colors text-[#F5F3EF]/70">
              <Globe className="w-5 h-5" />
              Browse Community
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sharedResources.map((resource, index) => (
              <motion.div
                key={resource.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -2 }}
                className="group bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 hover:border-[#8B7355]/30 transition-all duration-300 overflow-hidden cursor-pointer"
              >
                <div className="aspect-video bg-gradient-to-br from-[#C9A962]/20 to-[#7C9885]/20 relative">
                  <div className="absolute inset-0 bg-black/20" />
                  <div className="absolute top-4 left-4 flex gap-2">
                    {resource.isVerified && (
                      <span className="px-2 py-1 bg-green-500/90 text-white text-xs font-medium rounded-full flex items-center gap-1">
                        <Award className="w-3 h-3" />
                        Verified
                      </span>
                    )}
                  </div>
                  <div className="absolute bottom-4 right-4">
                    <button className="p-2 bg-black/50 backdrop-blur-sm rounded-full hover:bg-black/70 transition-colors">
                      <Play className="w-4 h-4 text-white" />
                    </button>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-bold text-[#F5F3EF] group-hover:text-[#C9A962] transition-colors leading-tight">
                      {resource.title}
                    </h3>
                    <button className="p-1 hover:bg-white/10 rounded transition-colors">
                      <Heart className="w-4 h-4 text-[#F5F3EF]/60" />
                    </button>
                  </div>
                  
                  <p className="text-[#F5F3EF]/60 text-sm mb-3">{resource.creator}</p>
                  <p className="text-[#F5F3EF]/70 text-sm mb-4 leading-relaxed line-clamp-2">
                    {resource.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-1 mb-4">
                    {resource.tags.slice(0, 3).map(tag => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-white/10 text-[#F5F3EF]/60 text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-[#F5F3EF] text-sm font-medium">{resource.rating}</span>
                      </div>
                      <div className="flex items-center gap-1 text-[#F5F3EF]/60 text-sm">
                        <Download className="w-4 h-4" />
                        {resource.downloads.toLocaleString()}
                      </div>
                    </div>
                    <span className="text-[#F5F3EF]/60 text-xs">
                      {new Date(resource.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </div>

      {/* Footer CTA */}
      <div className="border-t border-white/10 bg-gradient-to-r from-[#C9A962]/10 via-[#7C9885]/10 to-[#8B7355]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h2 className="text-4xl font-bold text-[#F5F3EF] mb-4">
              Ready to revolutionize your teaching?
            </h2>
            <p className="text-xl text-[#F5F3EF]/70 mb-8 max-w-2xl mx-auto">
              Join thousands of educators already using AI-powered tools to create 
              more engaging and effective classical language learning experiences.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-4 bg-[#C9A962] text-[#0D0D0F] rounded-lg font-bold hover:bg-[#C9A962]/90 transition-colors flex items-center justify-center gap-2">
                Start Creating
                <Sparkles className="w-5 h-5" />
              </button>
              <button className="px-8 py-4 bg-white/5 text-[#F5F3EF] border border-white/10 rounded-lg font-bold hover:bg-white/10 transition-colors flex items-center justify-center gap-2">
                Explore Tools
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
