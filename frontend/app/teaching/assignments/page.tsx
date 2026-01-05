
'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FileText, 
  Settings, 
  Star, 
  Clock, 
  Users, 
  BookOpen, 
  CheckCircle, 
  AlertCircle, 
  Plus,
  Filter,
  Search,
  Download,
  Upload,
  Eye,
  Edit3,
  Save,
  X,
  ChevronDown,
  ChevronRight,
  Target,
  MessageSquare,
  Calendar,
  Lightbulb,
  Brain,
  Zap,
  Award,
  TrendingUp,
  BarChart3,
  Layers,
  Sparkles,
  Wand2,
  GraduationCap,
  ClipboardList,
  Timer,
  Users2,
  FileCheck,
  MessageCircle,
  Palette,
  Code,
  Globe,
  Book
} from 'lucide-react'
import { MultiScaleView } from '@/components/innovations/multi_scale_view'
import { NarrativeTimeline } from '@/components/innovations/narrative_timeline'

interface Assignment {
  id: string
  title: string
  type: 'translation' | 'analysis' | 'grammar' | 'composition' | 'research' | 'multimedia'
  status: 'draft' | 'published' | 'archived'
  dueDate: string
  submissions: number
  totalStudents: number
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  estimatedTime: number
  rubric?: Rubric
  feedbackTemplate?: string
  tags: string[]
  createdAt: string
  lastModified: string
}

interface Rubric {
  id: string
  name: string
  criteria: RubricCriterion[]
  totalPoints: number
}

interface RubricCriterion {
  id: string
  name: string
  description: string
  weight: number
  levels: RubricLevel[]
}

interface RubricLevel {
  id: string
  name: string
  description: string
  points: number
}

interface FeedbackTemplate {
  id: string
  name: string
  type: 'praise' | 'correction' | 'suggestion' | 'question'
  content: string
  category: string
  isQuick: boolean
}

interface AssignmentType {
  id: string
  name: string
  description: string
  icon: React.ComponentType<any>
  color: string
  features: string[]
  examples: string[]
  difficulty: string[]
  estimatedTime: string
}

const assignmentTypes: AssignmentType[] = [
  {
    id: 'translation',
    name: 'Translation Exercise',
    description: 'Structured translation with morphological support and vocabulary hints',
    icon: Globe,
    color: 'from-blue-500 to-cyan-500',
    features: ['Hover definitions', 'Grammar hints', 'Progressive reveal', 'Auto-grading'],
    examples: ['Caesar passage', 'Cicero speech excerpt', 'Ovid poetry selection'],
    difficulty: ['Beginner', 'Intermediate', 'Advanced'],
    estimatedTime: '30-45 minutes'
  },
  {
    id: 'analysis',
    name: 'Literary Analysis',
    description: 'Deep dive into rhetorical devices, themes, and literary techniques',
    icon: Brain,
    color: 'from-purple-500 to-pink-500',
    features: ['Annotation tools', 'Citation helper', 'Comparative analysis', 'Peer review'],
    examples: ['Rhetorical analysis', 'Character study', 'Theme exploration'],
    difficulty: ['Intermediate', 'Advanced'],
    estimatedTime: '60-90 minutes'
  },
  {
    id: 'grammar',
    name: 'Grammar Mastery',
    description: 'Interactive grammar exercises with immediate feedback',
    icon: Code,
    color: 'from-green-500 to-emerald-500',
    features: ['Adaptive difficulty', 'Instant feedback', 'Progress tracking', 'Gamification'],
    examples: ['Subjunctive practice', 'Participle identification', 'Syntax parsing'],
    difficulty: ['Beginner', 'Intermediate', 'Advanced'],
    estimatedTime: '20-30 minutes'
  },
  {
    id: 'composition',
    name: 'Latin Composition',
    description: 'Guided Latin writing with AI-powered feedback',
    icon: Edit3,
    color: 'from-amber-500 to-orange-500',
    features: ['Writing prompts', 'Grammar checker', 'Style suggestions', 'Revision tracking'],
    examples: ['Narrative writing', 'Descriptive passages', 'Argumentative essays'],
    difficulty: ['Intermediate', 'Advanced'],
    estimatedTime: '45-60 minutes'
  },
  {
    id: 'research',
    name: 'Research Project',
    description: 'Comprehensive research assignments with digital humanities tools',
    icon: Book,
    color: 'from-indigo-500 to-blue-500',
    features: ['Source integration', 'Citation management', 'Collaborative tools', 'Multimedia support'],
    examples: ['Historical investigation', 'Comparative mythology', 'Archaeological study'],
    difficulty: ['Advanced'],
    estimatedTime: '2-3 hours'
  },
  {
    id: 'multimedia',
    name: 'Creative Project',
    description: 'Multimedia assignments combining technology and classical content',
    icon: Palette,
    color: 'from-rose-500 to-pink-500',
    features: ['Video creation', 'Interactive timelines', 'Digital exhibitions', 'Presentation tools'],
    examples: ['Ancient Rome VR tour', 'Mythology podcast', 'Historical timeline'],
    difficulty: ['Beginner', 'Intermediate', 'Advanced'],
    estimatedTime: '90-120 minutes'
  }
]

const sampleAssignments: Assignment[] = [
  {
    id: '1',
    title: 'Caesar Gallic Wars 1.1-3: Strategic Translation',
    type: 'translation',
    status: 'published',
    dueDate: '2024-02-15',
    submissions: 23,
    totalStudents: 28,
    difficulty: 'intermediate',
    estimatedTime: 45,
    tags: ['Caesar', 'Military', 'Geography'],
    createdAt: '2024-01-20',
    lastModified: '2024-01-25'
  },
  {
    id: '2',
    title: 'Rhetorical Analysis: Cicero\'s First Catiline Oration',
    type: 'analysis',
    status: 'published',
    dueDate: '2024-02-20',
    submissions: 18,
    totalStudents: 28,
    difficulty: 'advanced',
    estimatedTime: 75,
    tags: ['Cicero', 'Rhetoric', 'Politics'],
    createdAt: '2024-01-22',
    lastModified: '2024-01-28'
  },
  {
    id: '3',
    title: 'Subjunctive Mood Mastery Challenge',
    type: 'grammar',
    status: 'draft',
    dueDate: '2024-02-18',
    submissions: 0,
    totalStudents: 28,
    difficulty: 'intermediate',
    estimatedTime: 30,
    tags: ['Grammar', 'Subjunctive', 'Practice'],
    createdAt: '2024-02-01',
    lastModified: '2024-02-01'
  }
]

const feedbackTemplates: FeedbackTemplate[] = [
  {
    id: '1',
    name: 'Excellent Translation',
    type: 'praise',
    content: 'Outstanding work! Your translation captures both the literal meaning and the stylistic nuances of the original text.',
    category: 'Translation',
    isQuick: true
  },
  {
    id: '2',
    name: 'Grammar Correction',
    type: 'correction',
    content: 'Remember that the ablative absolute construction requires both noun and participle to be in the ablative case.',
    category: 'Grammar',
    isQuick: true
  },
  {
    id: '3',
    name: 'Analysis Depth',
    type: 'suggestion',
    content: 'Consider exploring how this rhetorical device connects to the broader themes of the work. What effect does it have on the audience?',
    category: 'Analysis',
    isQuick: false
  }
]

export default function TeachingAssignmentsPage() {
  const [assignments, setAssignments] = useState<Assignment[]>(sampleAssignments)
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showRubricBuilder, setShowRubricBuilder] = useState(false)
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterType, setFilterType] = useState<string>('all')
  const [isLoading, setIsLoading] = useState(false)
  const [showFeedbackTemplates, setShowFeedbackTemplates] = useState(false)
  const [activeRubric, setActiveRubric] = useState<Rubric | null>(null)
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'timeline'>('grid')

  // Timeline data for narrative view
  const timelineData = [
    {
      id: '1',
      title: 'Course Introduction',
      date: '2024-01-15',
      type: 'milestone',
      description: 'Welcome to Advanced Latin Literature'
    },
    {
      id: '2',
      title: 'Caesar Translation Due',
      date: '2024-02-15',
      type: 'assignment',
      description: 'Strategic translation of Gallic Wars'
    },
    {
      id: '3',
      title: 'Midterm Assessment',
      date: '2024-03-15',
      type: 'assessment',
      description: 'Comprehensive grammar and translation exam'
    }
  ]

  const filteredAssignments = assignments.filter(assignment => {
    const matchesSearch = assignment.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         assignment.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesStatus = filterStatus === 'all' || assignment.status === filterStatus
    const matchesType = filterType === 'all' || assignment.type === filterType
    
    return matchesSearch && matchesStatus && matchesType
  })

  const handleCreateAssignment = (type: AssignmentType) => {
    setSelectedType(type.id)
    setShowCreateModal(true)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'text-green-400 bg-green-500/20'
      case 'draft': return 'text-amber-400 bg-amber-500/20'
      case 'archived': return 'text-gray-400 bg-gray-500/20'
      default: return 'text-gray-400 bg-gray-500/20'
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-400 bg-green-500/20'
      case 'intermediate': return 'text-amber-400 bg-amber-500/20'
      case 'advanced': return 'text-red-400 bg-red-500/20'
      default: return 'text-gray-400 bg-gray-500/20'
    }
  }

  useEffect(() => {
    // Simulate loading assignments
    setIsLoading(true)
    setTimeout(() => setIsLoading(false), 1000)
  }, [])

  return (
    <div className="min-h-screen bg-[#0D0D0F] text-[#F5F3EF] overflow-hidden">
      {/* Background Elements */}
      <div className="fixed inset-0 bg-gradient-to-br from-[#C9A962]/5 via-transparent to-[#7C9885]/5" />
      <div className="fixed inset-0">
        <div className="absolute top-20 left-20 w-64 h-64 bg-[#C9A962]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-[#7C9885]/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gradient-to-r from-[#8B7355]/5 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-6 py-8 border-b border-white/10"
        >
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-[#C9A962]/20 rounded-lg">
                    <GraduationCap className="w-6 h-6 text-[#C9A962]" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-[#C9A962] to-[#8B7355] bg-clip-text text-transparent">
                      Assignment Creator
                    </h1>
                    <p className="text-[#F5F3EF]/70 font-medium">Tools that actually help people learn</p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 bg-white/5 backdrop-blur-xl rounded-lg p-2 border border-white/10">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded ${viewMode === 'grid' ? 'bg-[#C9A962]/20 text-[#C9A962]' : 'text-[#F5F3EF]/50 hover:text-[#F5F3EF]'}`}
                  >
                    <Layers className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded ${viewMode === 'list' ? 'bg-[#C9A962]/20 text-[#C9A962]' : 'text-[#F5F3EF]/50 hover:text-[#F5F3EF]'}`}
                  >
                    <ClipboardList className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('timeline')}
                    className={`p-2 rounded ${viewMode === 'timeline' ? 'bg-[#C9A962]/20 text-[#C9A962]' : 'text-[#F5F3EF]/50 hover:text-[#F5F3EF]'}`}
                  >
                    <Calendar className="w-4 h-4" />
                  </button>
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowCreateModal(true)}
                  className="px-6 py-3 bg-gradient-to-r from-[#C9A962] to-[#8B7355] rounded-lg font-semibold text-[#0D0D0F] hover:shadow-xl hover:shadow-[#C9A962]/25 transition-all duration-300"
                >
                  <Plus className="w-5 h-5 inline mr-2" />
                  Create Assignment
                </motion.button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4"
              >
                <div className="flex items-center gap-3">
                  <FileText className="w-8 h-8 text-[#C9A962]" />
                  <div>
                    <p className="text-2xl font-bold">{assignments.length}</p>
                    <p className="text-sm text-[#F5F3EF]/70">Total Assignments</p>
                  </div>
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4"
              >
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-8 h-8 text-[#7C9885]" />
                  <div>
                    <p className="text-2xl font-bold">{assignments.filter(a => a.status === 'published').length}</p>
                    <p className="text-sm text-[#F5F3EF]/70">Published</p>
                  </div>
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4"
              >
                <div className="flex items-center gap-3">
                  <Users className="w-8 h-8 text-[#8B7355]" />
                  <div>
                    <p className="text-2xl font-bold">28</p>
                    <p className="text-sm text-[#F5F3EF]/70">Active Students</p>
                  </div>
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4"
              >
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-8 h-8 text-[#C9A962]" />
                  <div>
                    <p className="text-2xl font-bold">87%</p>
                    <p className="text-sm text-[#F5F3EF]/70">Completion Rate</p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Search and Filters */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col md:flex-row gap-4 mb-6"
            >
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#F5F3EF]/40" />
                <input
                  type="text"
                  placeholder="Search assignments, tags, or content..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg focus:outline-none focus:border-[#C9A962]/50 transition-colors"
                />
              </div>
              
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg focus:outline-none focus:border-[#C9A962]/50"
              >
                <option value="all">All Status</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
              </select>
              
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg focus:outline-none focus:border-[#C9A962]/50"
              >
                <option value="all">All Types</option>
                {assignmentTypes.map(type => (
                  <option key={type.id} value={type.id}>{type.name}</option>
                ))}
              </select>
            </motion.div>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="p-6">
          <div className="max-w-7xl mx-auto">
            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center justify-center py-12"
                >
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-[#C9A962] to-[#8B7355] rounded-full animate-spin mx-auto mb-4">
                      <div className="w-12 h-12 bg-[#0D0D0F] rounded-full m-2"></div>
                    </div>
                    <p className="text-[#F5F3EF]/70">Loading assignments...</p>
                  </div>
                </motion.div>
              ) : viewMode === 'timeline' ? (
                <motion.div
                  key="timeline"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">
                    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-[#C9A962]" />
                      Course Timeline
                    </h2>
                    <NarrativeTimeline
                      events={timelineData}
                      className="min-h-[400px]"
                    />
                  </div>
                </motion.div>
              ) : viewMode === 'list' ? (
                <motion.div
                  key="list"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-4"
                >
                  {filteredAssignments.map((assignment, index) => (
                    <motion.div
                      key={assignment.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 flex-1">
                          <div className="p-3 bg-[#C9A962]/20 rounded-lg">
                            {assignmentTypes.find(t => t.id === assignment.type)?.icon && 
                              React.createElement(assignmentTypes.find(t => t.id === assignment.type)!.icon, { 
                                className: "w-6 h-6 text-[#C9A962]" 
                              })
                            }
                          </div>
                          
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold mb-1">{assignment.title}</h3>
                            <div className="flex items-center gap-4 text-sm text-[#F5F3EF]/70">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(assignment.status)}`}>
                                {assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}
                              </span>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(assignment.difficulty)}`}>
                                {assignment.difficulty}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {assignment.estimatedTime}min
                              </span>
                              <span className="flex items-center gap-1">
                                <Users className="w-4 h-4" />
                                {assignment.submissions}/{assignment.totalStudents}
                              </span>
                              <span className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                Due {assignment.dueDate}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <button className="p-2 text-[#F5F3EF]/50 hover:text-[#C9A962] hover:bg-[#C9A962]/10 rounded-lg transition-colors">
                            <Eye className="w-5 h-5" />
                          </button>
                          <button className="p-2 text-[#F5F3EF]/50 hover:text-[#C9A962] hover:bg-[#C9A962]/10 rounded-lg transition-colors">
                            <Edit3 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  key="grid"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {filteredAssignments.map((assignment, index) => (
                    <motion.div
                      key={assignment.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ y: -5 }}
                      className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300 group"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-[#C9A962]/20 rounded-lg group-hover:bg-[#C9A962]/30 transition-colors">
                            {assignmentTypes.find(t => t.id === assignment.type)?.icon && 
                              React.createElement(assignmentTypes.find(t => t.id === assignment.type)!.icon, { 
                                className: "w-5 h-5 text-[#C9A962]" 
                              })
                            }
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(assignment.status)}`}>
                            {assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-1 text-[#F5F3EF]/50 hover:text-[#C9A962] rounded">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-1 text-[#F5F3EF]/50 hover:text-[#C9A962] rounded">
                            <Edit3 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      
                      <h3 className="text-lg font-semibold mb-2 line-clamp-2">{assignment.title}</h3>
                      
                      <div className="space-y-3 mb-4">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-[#F5F3EF]/70">Due Date</span>
                          <span className="font-medium">{assignment.dueDate}</span>
                        </div>
                        
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-[#F5F3EF]/70">Submissions</span>
                          <span className="font-medium">{assignment.submissions}/{assignment.totalStudents}</span>
                        </div>
                        
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-[#F5F3EF]/70">Estimated Time</span>
                          <span className="font-medium">{assignment.estimatedTime} min</span>
                        </div>
                        
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-[#F5F3EF]/70">Difficulty</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(assignment.difficulty)}`}>
                            {assignment.difficulty}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        {assignment.tags.slice(0, 3).map((tag, tagIndex) => (
                          <span key={tagIndex} className="px-2 py-1 bg-[#8B7355]/20 text-[#8B7355] text-xs rounded-full">
                            {tag}
                          </span>
                        ))}
                        {assignment.tags.length > 3 && (
                          <span className="px-2 py-1 bg-[#F5F3EF]/10 text-[#F5F3EF]/50 text-xs rounded-full">
                            +{assignment.tags.length - 3} more
                          </span>
                        )}
                      </div>
                      
                      <div className="w-full bg-[#F5F3EF]/10 rounded-full h-2 mb-4">
                        <div 
                          className="bg-gradient-to-r from-[#C9A962] to-[#8B7355] h-2 rounded-full transition-all duration-500"
                          style={{ width: `${(assignment.submissions / assignment.totalStudents) * 100}%` }}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-[#F5F3EF]/70">
                          Modified {assignment.lastModified}
                        </span>
                        <div className="flex items-center gap-1">
                          {assignment.submissions === assignment.totalStudents ? (
                            <CheckCircle className="w-4 h-4 text-[#7C9885]" />
                          ) : (
                            <Clock className="w-4 h-4 text-[#C9A962]" />
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Empty State */}
            {!isLoading && filteredAssignments.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-12"
              >
                <div className="w-24 h-24 bg-[#C9A962]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FileText className="w-12 h-12 text-[#C9A962]/50" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No assignments found</h3>
                <p className="text-[#F5F3EF]/70 mb-6">
                  {searchQuery || filterStatus !== 'all' || filterType !== 'all' 
                    ? "Try adjusting your filters or search terms"
                    : "Get started by creating your first assignment"
                  }
                </p>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowCreateModal(true)}
                  className="px-6 py-3 bg-gradient-to-r from-[#C9A962] to-[#8B7355] rounded-lg font-semibold text-[#0D0D0F]"
                >
                  Create First Assignment
                </motion.button>
              </motion.div>
            )}
          </div>
        </div>

        {/* Quick Tools Sidebar */}
        <div className="fixed right-6 top-1/2 transform -translate-y-1/2 space-y-4">
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowRubricBuilder(true)}
            className="w-12 h-12 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl flex items-center justify-center text-[#C9A962] hover:bg-[#C9A962]/20 transition-all duration-300 group"
            title="Rubric Builder"
          >
            <Target className="w-5 h-5" />
          </motion.button>

          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowFeedbackTemplates(true)}
            className="w-12 h-12 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl flex items-center justify-center text-[#7C9885] hover:bg-[#7C9885]/20 transition-all duration-300 group"
            title="Feedback Templates"
          >
            <MessageSquare className="w-5 h-5" />
          </motion.button>

          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-12 h-12 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl flex items-center justify-center text-[#8B7355] hover:bg-[#8B7355]/20 transition-all duration-300 group"
            title="Analytics"
          >
            <BarChart3 className="w-5 h-5" />
          </motion.button>
        </div>
      </div>

      {/* Create Assignment Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setShowCreateModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#0D0D0F] border border-white/20 rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-[#C9A962]">Create New Assignment</h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <MultiScaleView
                levels={[
                  {
                    id: 'types',
                    title: 'Assignment Types',
                    description: 'Choose the type of assignment you want to create',
                    content: (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {assignmentTypes.map((type, index) => (
                          <motion.div
                            key={type.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ scale: 1.02 }}
                            onClick={() => handleCreateAssignment(type)}
                            className="p-6 bg-white/5 border border-white/10 rounded-xl cursor-pointer hover:bg-white/10 transition-all duration-300 group"
                          >
                            <div className="flex items-center gap-4 mb-4">
                              <div className={`p-3 bg-gradient-to-r ${type.color} bg-opacity-20 rounded-lg`}>
                                <type.icon className="w-6 h-6 text-white" />
                              </div>
                              <div>
                                <h3 className="font-semibold text-lg">{type.name}</h3>
                                <p className="text-sm text-[#F5F3EF]/70">{type.estimatedTime}</p>
                              </div>
                            </div>
                            
                            <p className="text-[#F5F3EF]/70 mb-4">{type.description}</p>
                            
                            <div className="space-y-3">
                              <div>
                                <h4 className="text-sm font-medium text-[#C9A962] mb-2">Features</h4>
                                <div className="flex flex-wrap gap-1">
                                  {type.features.map((feature, featureIndex) => (
                                    <span key={featureIndex} className="px-2 py-1 bg-[#C9A962]/20 text-[#C9A962] text-xs rounded">
                                      {feature}
                                    </span>
                                  ))}
                                </div>
                              </div>
                              
                              <div>
                                <h4 className="text-sm font-medium text-[#7C9885] mb-2">Difficulty Levels</h4>
                                <div className="flex gap-1">
                                  {type.difficulty.map((level, levelIndex) => (
                                    <span key={levelIndex} className="px-2 py-1 bg-[#7C9885]/20 text-[#7C9885] text-xs rounded">
                                      {level}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )
                  },
                  {
                    id: 'templates',
                    title: 'Quick Start Templates',
                    description: 'Pre-built templates to get you started quickly',
                    content: (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                            <h3 className="font-semibold mb-2">Caesar Reading Comprehension</h3>
                            <p className="text-sm text-[#F5F3EF]/70 mb-3">
                              Structured translation with vocabulary support and comprehension questions
                            </p>
                            <div className="flex justify-between items-center">
                              <span className="text-xs text-[#C9A962]">~45 minutes</span>
                              <button className="px-3 py-1 bg-[#C9A962]/20 text-[#C9A962] text-xs rounded hover:bg-[#C9A962]/30">
                                Use Template
                              </button>
                            </div>
                          </div>
                          
                          <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                            <h3 className="font-semibold mb-2">Grammar Intensive</h3>
                            <p className="text-sm text-[#F5F3EF]/70 mb-3">
                              Focused practice on specific grammatical concepts with instant feedback
                            </p>
                            <div className="flex justify-between items-center">
                              <span className="text-xs text-[#7C9885]">~30 minutes</span>
                              <button className="px-3 py-1 bg-[#7C9885]/20 text-[#7C9885] text-xs rounded hover:bg-[#7C9885]/30">
                                Use Template
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  }
                ]}
                className="min-h-[400px]"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Rubric Builder Modal */}
      <AnimatePresence>
        {showRubricBuilder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setShowRubricBuilder(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#0D0D0F] border border-white/20 rounded-2xl p-8 max-w-6xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Target className="w-6 h-6 text-[#C9A962]" />
                  <h2 className="text-2xl font-bold text-[#C9A962]">Rubric Builder</h2>
                </div>
                <button
                  onClick={() => setShowRubricBuilder(false)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <Wand2 className="w-5 h-5 text-[#C9A962]" />
                      AI-Generated Criteria
                    </h3>
                    <div className="space-y-3">
                      {['Content Accuracy', 'Grammar & Syntax', 'Critical Analysis', 'Source Usage'].map((criterion, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                          <span className="text-[#F5F3EF]">{criterion}</span>
                          <input
                            type="range"
                            min="0"
                            max="25"
                            defaultValue="25"
                            className="w-24 accent-[#C9A962]"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <FileText className="w-5 h-5 text-[#7C9885]" />
                      Rubric Preview
                    </h3>
                    <div className="bg-white/5 border border-white/10 rounded-lg p-4 min-h-[200px]">
                      <p className="text-gray-400 text-sm">Your rubric will appear here as you configure criteria...</p>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-3 mt-6">
                  <button
                    onClick={() => setShowRubricBuilder(false)}
                    className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button className="px-4 py-2 bg-[#C9A962] text-black rounded-lg font-medium hover:bg-[#C9A962]/80 transition-colors">
                    Generate Rubric
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}