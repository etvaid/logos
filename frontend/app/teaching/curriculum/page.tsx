
'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  BookOpen, 
  Target, 
  CheckSquare, 
  Library, 
  Plus, 
  Eye, 
  Users, 
  Clock, 
  Brain, 
  Lightbulb, 
  ArrowRight, 
  Play, 
  Download, 
  Share2, 
  Settings, 
  Zap,
  Trophy,
  TrendingUp,
  Layers,
  MessageSquare,
  Star,
  Filter,
  Search,
  Upload,
  Save,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  XCircle
} from 'lucide-react'
import { MultiScaleView } from '@/components/innovations/multi_scale_view'
import { NarrativeTimeline } from '@/components/innovations/narrative_timeline'

interface CurriculumModule {
  id: string
  title: string
  duration: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  prerequisites: string[]
  objectives: LearningObjective[]
  activities: Activity[]
  assessments: Assessment[]
  resources: Resource[]
  progress: number
  status: 'draft' | 'active' | 'completed'
}

interface LearningObjective {
  id: string
  category: 'knowledge' | 'comprehension' | 'application' | 'analysis' | 'synthesis' | 'evaluation'
  description: string
  assessmentMethods: string[]
  bloomsLevel: number
  measurable: boolean
}

interface Activity {
  id: string
  type: 'reading' | 'exercise' | 'discussion' | 'project' | 'assessment'
  title: string
  duration: number
  difficulty: number
  engagement: 'individual' | 'pair' | 'group' | 'class'
  materials: string[]
  instructions: string
  adaptiveFeatures: string[]
}

interface Assessment {
  id: string
  type: 'formative' | 'summative'
  method: 'quiz' | 'essay' | 'project' | 'presentation' | 'portfolio'
  weight: number
  criteria: string[]
  rubric: RubricLevel[]
  frequency: string
  feedback: string
}

interface RubricLevel {
  score: number
  descriptor: string
  criteria: string[]
}

interface Resource {
  id: string
  type: 'text' | 'digital' | 'multimedia' | 'tool' | 'reference'
  title: string
  author: string
  accessibility: 'required' | 'recommended' | 'supplemental'
  cost: 'free' | 'paid' | 'subscription'
  format: string[]
  pedagogicalNotes: string
}

interface CurriculumDesignState {
  modules: CurriculumModule[]
  objectives: LearningObjective[]
  assessments: Assessment[]
  resources: Resource[]
  selectedModule: string | null
  activeView: 'overview' | 'structure' | 'objectives' | 'assessments' | 'resources'
  isLoading: boolean
  error: string | null
  saveStatus: 'idle' | 'saving' | 'saved' | 'error'
}

const CurriculumDesignPage = () => {
  const [state, setState] = useState<CurriculumDesignState>({
    modules: [],
    objectives: [],
    assessments: [],
    resources: [],
    selectedModule: null,
    activeView: 'overview',
    isLoading: true,
    error: null,
    saveStatus: 'idle'
  })

  const [filters, setFilters] = useState({
    difficulty: 'all',
    status: 'all',
    type: 'all'
  })

  const [searchQuery, setSearchQuery] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'timeline' | 'hierarchy'>('grid')

  useEffect(() => {
    loadCurriculumData()
  }, [])

  const loadCurriculumData = async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }))
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const mockModules: CurriculumModule[] = [
        {
          id: 'mod-1',
          title: 'Latin Fundamentals: Noun Declensions',
          duration: '2 weeks',
          difficulty: 'beginner',
          prerequisites: [],
          objectives: [
            {
              id: 'obj-1',
              category: 'knowledge',
              description: 'Identify all five Latin noun declensions',
              assessmentMethods: ['quiz', 'recognition exercises'],
              bloomsLevel: 1,
              measurable: true
            },
            {
              id: 'obj-2',
              category: 'application',
              description: 'Parse noun forms in authentic Latin texts',
              assessmentMethods: ['translation', 'parsing exercises'],
              bloomsLevel: 3,
              measurable: true
            }
          ],
          activities: [
            {
              id: 'act-1',
              type: 'reading',
              title: 'Wheelock Chapter 1-3 Review',
              duration: 45,
              difficulty: 2,
              engagement: 'individual',
              materials: ['Wheelock textbook', 'audio recordings'],
              instructions: 'Read chapters focusing on declension patterns',
              adaptiveFeatures: ['difficulty scaling', 'personalized examples']
            }
          ],
          assessments: [
            {
              id: 'ass-1',
              type: 'formative',
              method: 'quiz',
              weight: 0.2,
              criteria: ['accuracy', 'speed', 'pattern recognition'],
              rubric: [
                { score: 4, descriptor: 'Mastery', criteria: ['95%+ accuracy', 'instant recognition'] },
                { score: 3, descriptor: 'Proficient', criteria: ['85%+ accuracy', 'quick recognition'] }
              ],
              frequency: 'weekly',
              feedback: 'immediate with explanations'
            }
          ],
          resources: [
            {
              id: 'res-1',
              type: 'text',
              title: 'Wheelock\'s Latin',
              author: 'Richard LaFleur',
              accessibility: 'required',
              cost: 'paid',
              format: ['print', 'ebook'],
              pedagogicalNotes: 'Standard grammar progression'
            }
          ],
          progress: 0.75,
          status: 'active'
        },
        {
          id: 'mod-2',
          title: 'Caesar: Gallic Wars Book 1',
          duration: '4 weeks',
          difficulty: 'intermediate',
          prerequisites: ['Basic grammar', 'Essential vocabulary'],
          objectives: [
            {
              id: 'obj-3',
              category: 'comprehension',
              description: 'Understand main narrative of Gallic Wars Book 1',
              assessmentMethods: ['translation', 'comprehension questions'],
              bloomsLevel: 2,
              measurable: true
            }
          ],
          activities: [],
          assessments: [],
          resources: [],
          progress: 0.4,
          status: 'active'
        }
      ]

      setState(prev => ({
        ...prev,
        modules: mockModules,
        isLoading: false
      }))
      
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Failed to load curriculum data',
        isLoading: false
      }))
    }
  }

  const saveCurriculum = async () => {
    setState(prev => ({ ...prev, saveStatus: 'saving' }))
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      setState(prev => ({ ...prev, saveStatus: 'saved' }))
      setTimeout(() => setState(prev => ({ ...prev, saveStatus: 'idle' })), 2000)
    } catch {
      setState(prev => ({ ...prev, saveStatus: 'error' }))
    }
  }

  const createNewModule = () => {
    const newModule: CurriculumModule = {
      id: `mod-${Date.now()}`,
      title: 'New Module',
      duration: '1 week',
      difficulty: 'beginner',
      prerequisites: [],
      objectives: [],
      activities: [],
      assessments: [],
      resources: [],
      progress: 0,
      status: 'draft'
    }
    
    setState(prev => ({
      ...prev,
      modules: [...prev.modules, newModule],
      selectedModule: newModule.id
    }))
    setShowCreateModal(false)
  }

  const filteredModules = state.modules.filter(module => {
    const matchesSearch = module.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesDifficulty = filters.difficulty === 'all' || module.difficulty === filters.difficulty
    const matchesStatus = filters.status === 'all' || module.status === filters.status
    return matchesSearch && matchesDifficulty && matchesStatus
  })

  const timelineData = state.modules.map(module => ({
    id: module.id,
    title: module.title,
    date: new Date(),
    category: module.difficulty,
    description: `${module.duration} • ${module.objectives.length} objectives`,
    details: {
      duration: module.duration,
      progress: module.progress,
      status: module.status
    }
  }))

  const multiScaleData = {
    overview: {
      title: 'Curriculum Overview',
      metrics: [
        { label: 'Total Modules', value: state.modules.length },
        { label: 'Learning Objectives', value: state.modules.reduce((acc, m) => acc + m.objectives.length, 0) },
        { label: 'Assessments', value: state.modules.reduce((acc, m) => acc + m.assessments.length, 0) },
        { label: 'Resources', value: state.modules.reduce((acc, m) => acc + m.resources.length, 0) }
      ]
    },
    details: state.modules.map(module => ({
      id: module.id,
      title: module.title,
      data: {
        progress: module.progress,
        difficulty: module.difficulty,
        status: module.status,
        objectives: module.objectives.length
      }
    }))
  }

  if (state.isLoading) {
    return (
      <div className="min-h-screen bg-[#0D0D0F] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <RefreshCw className="w-8 h-8 text-[#C9A962] animate-spin mx-auto mb-4" />
          <p className="text-[#F5F3EF]">Loading curriculum designer...</p>
        </motion.div>
      </div>
    )
  }

  if (state.error) {
    return (
      <div className="min-h-screen bg-[#0D0D0F] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <XCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-[#F5F3EF] mb-2">Error Loading Curriculum</h2>
          <p className="text-gray-400 mb-6">{state.error}</p>
          <button
            onClick={loadCurriculumData}
            className="px-6 py-2 bg-[#C9A962] text-black rounded-lg hover:bg-[#C9A962]/80 transition-colors"
          >
            Try Again
          </button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0D0D0F] text-[#F5F3EF]">
      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-b border-white/10 bg-white/5 backdrop-blur-xl sticky top-0 z-50"
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-[#C9A962] flex items-center gap-3">
                <Brain className="w-8 h-8" />
                Pedagogy Engine
              </h1>
              <p className="text-sm text-gray-400 mt-1">Tools that actually help people learn</p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                {state.saveStatus === 'saving' && <RefreshCw className="w-4 h-4 animate-spin" />}
                {state.saveStatus === 'saved' && <CheckCircle2 className="w-4 h-4 text-green-400" />}
                {state.saveStatus === 'error' && <AlertCircle className="w-4 h-4 text-red-400" />}
                <span className="text-sm text-gray-400">
                  {state.saveStatus === 'saving' && 'Saving...'}
                  {state.saveStatus === 'saved' && 'Saved'}
                  {state.saveStatus === 'error' && 'Save failed'}
                  {state.saveStatus === 'idle' && 'Ready'}
                </span>
              </div>
              
              <button
                onClick={saveCurriculum}
                className="px-4 py-2 bg-[#C9A962] text-black rounded-lg hover:bg-[#C9A962]/80 transition-colors flex items-center gap-2"
                disabled={state.saveStatus === 'saving'}
              >
                <Save className="w-4 h-4" />
                Save
              </button>
              
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-4 py-2 bg-[#7C9885] text-black rounded-lg hover:bg-[#7C9885]/80 transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                New Module
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Navigation */}
      <motion.nav 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="border-b border-white/10 bg-white/5 backdrop-blur-xl"
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-6">
              {[
                { id: 'overview', label: 'Overview', icon: Eye },
                { id: 'structure', label: 'Course Structure', icon: BookOpen },
                { id: 'objectives', label: 'Learning Objectives', icon: Target },
                { id: 'assessments', label: 'Assessment Plan', icon: CheckSquare },
                { id: 'resources', label: 'Resource List', icon: Library }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setState(prev => ({ ...prev, activeView: tab.id as any }))}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    state.activeView === tab.id
                      ? 'bg-[#C9A962] text-black'
                      : 'text-gray-400 hover:text-[#F5F3EF] hover:bg-white/5'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-white/5 rounded-lg p-1">
                {[
                  { id: 'grid', icon: Layers },
                  { id: 'timeline', icon: Clock },
                  { id: 'hierarchy', icon: TrendingUp }
                ].map((mode) => (
                  <button
                    key={mode.id}
                    onClick={() => setViewMode(mode.id as any)}
                    className={`p-2 rounded ${
                      viewMode === mode.id
                        ? 'bg-[#C9A962] text-black'
                        : 'text-gray-400 hover:text-[#F5F3EF]'
                    }`}
                  >
                    <mode.icon className="w-4 h-4" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <AnimatePresence mode="wait">
          {state.activeView === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                  { label: 'Total Modules', value: state.modules.length, icon: BookOpen, color: 'text-[#C9A962]' },
                  { label: 'Learning Objectives', value: state.modules.reduce((acc, m) => acc + m.objectives.length, 0), icon: Target, color: 'text-[#7C9885]' },
                  { label: 'Assessments', value: state.modules.reduce((acc, m) => acc + m.assessments.length, 0), icon: CheckSquare, color: 'text-[#8B7355]' },
                  { label: 'Resources', value: state.modules.reduce((acc, m) => acc + m.resources.length, 0), icon: Library, color: 'text-blue-400' }
                ].map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-400">{stat.label}</p>
                        <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
                      </div>
                      <stat.icon className={`w-8 h-8 ${stat.color}`} />
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Multi-Scale View */}
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">
                <h3 className="text-xl font-bold text-[#C9A962] mb-6">Curriculum Overview</h3>
                <MultiScaleView data={multiScaleData} />
              </div>

              {/* Progress Overview */}
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">
                <h3 className="text-xl font-bold text-[#C9A962] mb-6">Development Progress</h3>
                <div className="space-y-4">
                  {state.modules.map((module, index) => (
                    <motion.div
                      key={module.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-4 bg-white/5 rounded-lg"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-3 h-3 rounded-full ${
                          module.status === 'completed' ? 'bg-green-400' :
                          module.status === 'active' ? 'bg-[#C9A962]' :
                          'bg-gray-400'
                        }`} />
                        <div>
                          <h4 className="font-medium text-[#F5F3EF]">{module.title}</h4>
                          <p className="text-sm text-gray-400">{module.duration} • {module.difficulty}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="w-32 bg-white/10 rounded-full h-2">
                          <div 
                            className="bg-[#C9A962] h-2 rounded-full transition-all duration-500"
                            style={{ width: `${module.progress * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium">{Math.round(module.progress * 100)}%</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {state.activeView === 'structure' && (
            <motion.div
              key="structure"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Search and Filters */}
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 flex-1">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search modules..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-[#F5F3EF] placeholder-gray-400"
                    />
                  </div>
                  
                  <select
                    value={filters.difficulty}
                    onChange={(e) => setFilters(prev => ({ ...prev, difficulty: e.target.value }))}
                    className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-[#F5F3EF]"
                  >
                    <option value="all">All Levels</option>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                  
                  <select
                    value={filters.status}
                    onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                    className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-[#F5F3EF]"
                  >
                    <option value="all">All Status</option>
                    <option value="draft">Draft</option>
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>

              {/* Content based on view mode */}
              {viewMode === 'timeline' && (
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-[#C9A962] mb-6">Course Timeline</h3>
                  <NarrativeTimeline events={timelineData} />
                </div>
              )}

              {viewMode === 'grid' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredModules.map((module, index) => (
                    <motion.div
                      key={module.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 hover:border-[#C9A962]/50 transition-colors cursor-pointer"
                      onClick={() => setState(prev => ({ ...prev, selectedModule: module.id }))}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className={`w-3 h-3 rounded-full ${
                          module.status === 'completed' ? 'bg-green-400' :
                          module.status === 'active' ? 'bg-[#C9A962]' :
                          'bg-gray-400'
                        }`} />
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          module.difficulty === 'beginner' ? 'bg-green-500/20 text-green-400' :
                          module.difficulty === 'intermediate' ? 'bg-[#C9A962]/20 text-[#C9A962]' :
                          'bg-red-500/20 text-red-400'
                        }`}>
                          {module.difficulty}
                        </span>
                      </div>
                      
                      <h3 className="text-lg font-bold text-[#F5F3EF] mb-2">{module.title}</h3>
                      <p className="text-sm text-gray-400 mb-4">{module.duration}</p>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <Target className="w-4 h-4" />
                          {module.objectives.length} objectives
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <CheckSquare className="w-4 h-4" />
                          {module.assessments.length} assessments
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <Library className="w-4 h-4" />
                          {module.resources.length} resources
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-gray-400">Progress</span>
                          <span className="text-[#C9A962]">{Math.round(module.progress * 100)}%</span>
                        </div>
                        <div className="w-full bg-white/10 rounded-full h-2">
                          <div 
                            className="bg-[#C9A962] h-2 rounded-full transition-all duration-500"
                            style={{ width: `${module.progress * 100}%` }}
                          />
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-400 capitalize">{module.status}</span>
                        <ArrowRight className="w-4 h-4 text-[#C9A962]" />
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {filteredModules.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12"
                >
                  <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-300 mb-2">No modules found</h3>
                  <p className="text-gray-400 mb-6">Try adjusting your search or filters</p>
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="px-6 py-2 bg-[#C9A962] text-black rounded-lg hover:bg-[#C9A962]/80 transition-colors"
                  >
                    Create First Module
                  </button>
                </motion.div>
              )}
            </motion.div>
          )}

          {state.activeView === 'objectives' && (
            <motion.div
              key="objectives"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">
                <h3 className="text-xl font-bold text-[#C9A962] mb-6">Learning Objectives Dashboard</h3>
                
                {/* Bloom's Taxonomy Distribution */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                  <div>
                    <h4 className="text-lg font-medium text-[#F5F3EF] mb-4">Bloom's Taxonomy Distribution</h4>
                    <div className="space-y-3">
                      {[
                        { level: 1, name: 'Knowledge', color: 'bg-blue-500', count: 5 },
                        { level: 2, name: 'Comprehension', color: 'bg-green-500', count: 8 },
                        { level: 3, name: 'Application', color: 'bg-yellow-500', count: 6 },
                        { level: 4, name: 'Analysis', color: 'bg-orange-500', count: 4 },
                        { level: 5, name: 'Synthesis', color: 'bg-red-500', count: 2 },
                        { level: 6, name: 'Evaluation', color: 'bg-purple-500', count: 1 }
                      ].map((level) => (
                        <div key={level.level} className="flex items-center gap-3">
                          <div className={`w-4 h-4 ${level.color} rounded`} />
                          <span className="text-sm text-[#F5F3EF] flex-1">{level.name}</span>
                          <span className="text-sm text-gray-400">{level.count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-medium text-[#F5F3EF] mb-4">Assessment Methods</h4>
                    <div className="space-y-3">
                      {[
                        { method: 'Quiz', count: 12 },
                        { method: 'Translation', count: 8 },
                        { method: 'Essay', count: 4 },
                        { method: 'Project', count: 3 },
                        { method: 'Presentation', count: 2 }
                      ].map((method) => (
                        <div key={method.method} className="flex items-center justify-between">
                          <span className="text-sm text-[#F5F3EF]">{method.method}</span>
                          <div className="flex items-center gap-2">
                            <div className="w-16 bg-white/10 rounded-full h-2">
                              <div 
                                className="bg-[#C9A962] h-2 rounded-full"
                                style={{ width: `${(method.count / 12) * 100}%` }}
                              />
                            </div>
                            <span className="text-sm text-gray-400 w-6">{method.count}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Objectives List */}
                <div className="space-y-4">
                  <h4 className="text-lg font-medium text-[#F5F3EF]">All Learning Objectives</h4>
                  {state.modules.map((module) =>
                    module.objectives.map((objective, index) => (
                      <motion.div
                        key={objective.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-4 bg-white/5 rounded-lg"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <Target className="w-4 h-4 text-[#C9A962] mt-1" />
                            <div>
                              <h5 className="font-medium text-[#F5F3EF]">{objective.description}</h5>
                              <p className="text-sm text-gray-400">{module.title}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              objective.category === 'knowledge' ? 'bg-blue-500/20 text-blue-400' :
                              objective.category === 'comprehension' ? 'bg-green-500/20 text-green-400' :
                              objective.category === 'application' ? 'bg-yellow-500/20 text-yellow-400' :
                              'bg-orange-500/20 text-orange-400'
                            }`}>
                              {objective.category}
                            </span>
                            <span className="text-xs text-gray-400">Bloom's {objective.bloomsLevel}</span>
                            {objective.measurable && <CheckCircle2 className="w-4 h-4 text-green-400" />}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <span>Assessment:</span>
                          {objective.assessmentMethods.map((method, i) => (
                            <span key={i} className="px-2 py-1 bg-white/10 rounded text-xs">
                              {method}
                            </span>
                          ))}
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {state.activeView === 'assessments' && (
            <motion.div
              key="assessments"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">
                <h3 className="text-xl font-bold text-[#C9A962] mb-6">Assessment Plan</h3>
                
                {/* Assessment Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-white/5 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <CheckSquare className="w-5 h-5 text-[#C9A962]" />
                      <span className="font-medium text-[#F5F3EF]">Formative</span>
                    </div>
                    <p className="text-2xl font-bold text-[#C9A962]">12</p>
                    <p className="text-sm text-gray-400">Ongoing assessments</p>
                  </div>
                  
                  <div className="bg-white/5 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <Trophy className="w-5 h-5 text-[#7C9885]" />
                      <span className="font-medium text-[#F5F3EF]">Summative</span>
                    </div>
                    <p className="text-2xl font-bold text-[#7C9885]">4</p>
                    <p className="text-sm text-gray-400">Major evaluations</p>
                  </div>
                  
                  <div className="bg-white/5 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <Star className="w-5 h-5 text-[#8B7355]" />
                      <span className="font-medium text-[#F5F3EF]">Total Weight</span>
                    </div>
                    <p className="text-2xl font-bold text-[#8B7355]">100%</p>
                    <p className="text-sm text-gray-400">Grade distribution</p>
                  </div>
                </div>
                
                {/* Assessment Timeline */}
                <div className="mb-8">
                  <h4 className="text-lg font-medium text-[#F5F3EF] mb-4">Assessment Schedule</h4>
                  <div className="space-y-3">
                    {[
                      { week: 1, type: 'formative', name: 'Vocabulary Quiz 1', weight: '5%' },
                      { week: 2, type: 'formative', name: 'Grammar Exercise Set', weight: '10%' },
                      { week: 3, type: 'summative', name: 'Translation Test 1', weight: '20%' },
                      { week: 4, type: 'formative', name: 'Peer Review Activity', weight: '5%' },
                      { week: 6, type: 'summative', name: 'Midterm Examination', weight: '30%' },
                      { week: 8, type: 'summative', name: 'Research Project', weight: '25%' },
                      { week: 10, type: 'formative', name: 'Final Portfolio Review', weight: '5%' }
                    ].map((assessment, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
                      >
                        <div className="flex items-center gap-4">
                          <div className="text-sm font-medium text-[#C9A962] w-12">
                            Week {assessment.week}
                          </div>
                          <div className={`w-3 h-3 rounded-full ${
                            assessment.type === 'formative' ? 'bg-blue-400' : 'bg-[#C9A962]'
                          }`} />
                          <div>
                            <h5 className="font-medium text-[#F5F3EF]">{assessment.name}</h5>
                            <p className="text-sm text-gray-400 capitalize">{assessment.type}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-[#C9A962]">{assessment.weight}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
                
                {/* Rubric Preview */}
                <div>
                  <h4 className="text-lg font-medium text-[#F5F3EF] mb-4">Sample Rubric</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-white/10">
                          <th className="text-left p-3 text-gray-400">Criteria</th>
                          <th className="text-center p-3 text-green-400">Excellent (4)</th>
                          <th className="text-center p-3 text-[#C9A962]">Good (3)</th>
                          <th className="text-center p-3 text-orange-400">Satisfactory (2)</th>
                          <th className="text-center p-3 text-red-400">Needs Work (1)</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-white/10">
                          <td className="p-3 font-medium text-[#F5F3EF]">Translation Accuracy</td>
                          <td className="p-3 text-center text-sm text-gray-300">95-100%</td>
                          <td className="p-3 text-center text-sm text-gray-300">85-94%</td>
                          <td className="p-3 text-center text-sm text-gray-300">75-84%</td>
                          <td className="p-3 text-center text-sm text-gray-300">Below 75%</td>
                        </tr>
                        <tr className="border-b border-white/10">
                          <td className="p-3 font-medium text-[#F5F3EF]">Grammar Recognition</td>
                          <td className="p-3 text-center text-sm text-gray-300">All forms correct</td>
                          <td className="p-3 text-center text-sm text-gray-300">Minor errors</td>
                          <td className="p-3 text-center text-sm text-gray-300">Some errors</td>
                          <td className="p-3 text-center text-sm text-gray-300">Many errors</td>
                        </tr>
                        <tr>
                          <td className="p-3 font-medium text-[#F5F3EF]">Style & Flow</td>
                          <td className="p-3 text-center text-sm text-gray-300">Natural English</td>
                          <td className="p-3 text-center text-sm text-gray-300">Good flow</td>
                          <td className="p-3 text-center text-sm text-gray-300">Readable</td>
                          <td className="p-3 text-center text-sm text-gray-300">Choppy/unclear</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {state.activeView === 'resources' && (
            <motion.div
              key="resources"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">
                <h3 className="text-xl font-bold text-[#C9A962] mb-6">Resource Library</h3>
                
                {/* Resource Categories */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
                  {[
                    { type: 'text', label: 'Textbooks', count: 8, icon: BookOpen, color: 'text-[#C9A962]' },
                    { type: 'digital', label: 'Digital Tools', count: 12, icon: Zap, color: 'text-blue-400' },
                    { type: 'multimedia', label: 'Media', count: 6, icon: Play, color: 'text-purple-400' },
                    { type: 'tool', label: 'Software', count: 4, icon: Settings, color: 'text-green-400' },
                    { type: 'reference', label: 'References', count: 15, icon: Library, color: 'text-orange-400' }
                  ].map((category) => (
                    <div key={category.type} className="bg-white/5 rounded-lg p-4 text-center hover:bg-white/10 transition-colors cursor-pointer">
                      <category.icon className={`w-6 h-6 ${category.color} mx-auto mb-2`} />
                      <div className="text-[#F5F3EF] font-medium">{category.label}</div>
                      <div className="text-white/50 text-sm">{category.count} items</div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}

export default CurriculumDesignPage
