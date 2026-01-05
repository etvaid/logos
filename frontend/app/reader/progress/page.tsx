
'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  BookOpen, 
  Target, 
  Brain, 
  Trophy, 
  Clock, 
  TrendingUp, 
  Calendar, 
  Star,
  ChevronRight,
  Flame,
  Zap,
  Award,
  BookMarked,
  Users,
  Globe,
  Eye,
  Heart,
  Lightbulb,
  ArrowRight,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Circle,
  BarChart3,
  PieChart,
  Activity,
  Bookmark,
  MessageSquare,
  Share2,
  Filter,
  Search,
  Settings,
  Plus,
  Minus
} from 'lucide-react'
import { MultiScaleView } from '@/components/innovations/multi_scale_view'
import { ResearchCanvas } from '@/components/innovations/research_canvas'

interface ReadingProgress {
  id: string
  title: string
  author: string
  progress: number
  totalLines: number
  currentLine: number
  timeSpent: number
  lastRead: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  genre: string
  vocabulary: {
    learned: number
    total: number
    recent: string[]
  }
  annotations: number
  bookmarks: number
}

interface VocabularyItem {
  word: string
  definition: string
  context: string
  masteryLevel: number
  encounters: number
  lastSeen: string
  etymology: string
  relatedWords: string[]
}

interface ReadingGoal {
  id: string
  type: 'daily' | 'weekly' | 'monthly' | 'custom'
  target: number
  current: number
  metric: 'pages' | 'lines' | 'minutes' | 'books'
  deadline: string
  isActive: boolean
}

interface ReadingSession {
  date: string
  duration: number
  linesRead: number
  book: string
  focusScore: number
}

const MOCK_PROGRESS: ReadingProgress[] = [
  {
    id: '1',
    title: 'Iliad',
    author: 'Homer',
    progress: 68,
    totalLines: 15693,
    currentLine: 10671,
    timeSpent: 2847,
    lastRead: '2024-01-15T14:30:00Z',
    difficulty: 'intermediate',
    genre: 'Epic',
    vocabulary: { learned: 247, total: 1834, recent: ['ἀρετή', 'κλέος', 'μῆνις'] },
    annotations: 43,
    bookmarks: 12
  },
  {
    id: '2',
    title: 'Oedipus Rex',
    author: 'Sophocles',
    progress: 34,
    totalLines: 1530,
    currentLine: 520,
    timeSpent: 892,
    lastRead: '2024-01-14T16:45:00Z',
    difficulty: 'advanced',
    genre: 'Tragedy',
    vocabulary: { learned: 89, total: 456, recent: ['τύχη', 'μοῖρα', 'ὕβρις'] },
    annotations: 18,
    bookmarks: 7
  },
  {
    id: '3',
    title: 'Apology',
    author: 'Plato',
    progress: 91,
    totalLines: 892,
    currentLine: 812,
    timeSpent: 1245,
    lastRead: '2024-01-13T10:20:00Z',
    difficulty: 'beginner',
    genre: 'Philosophy',
    vocabulary: { learned: 156, total: 234, recent: ['σοφία', 'ἀρετή', 'δικαιοσύνη'] },
    annotations: 31,
    bookmarks: 15
  }
]

const MOCK_VOCABULARY: VocabularyItem[] = [
  {
    word: 'ἀρετή',
    definition: 'excellence, virtue, prowess',
    context: 'ἀρετὴν δὲ καὶ σοφίην πρώτιστον',
    masteryLevel: 85,
    encounters: 23,
    lastSeen: '2024-01-15T14:30:00Z',
    etymology: 'From ἄριστος (best, noblest)',
    relatedWords: ['ἄριστος', 'ἀρίστη', 'ἀριστεύς']
  },
  {
    word: 'κλέος',
    definition: 'fame, glory, renown',
    context: 'κλέος ἄφθιτον εἴη',
    masteryLevel: 92,
    encounters: 31,
    lastSeen: '2024-01-15T13:45:00Z',
    etymology: 'From κλύω (to hear)',
    relatedWords: ['κλυτός', 'κλεινός', 'ἀκλεής']
  },
  {
    word: 'μῆνις',
    definition: 'wrath, anger (especially divine)',
    context: 'μῆνιν ἄειδε θεὰ Πηληϊάδεω Ἀχιλῆος',
    masteryLevel: 67,
    encounters: 15,
    lastSeen: '2024-01-15T12:20:00Z',
    etymology: 'Related to μένω (to remain, last)',
    relatedWords: ['μένος', 'μένω', 'μείνω']
  }
]

const MOCK_GOALS: ReadingGoal[] = [
  {
    id: '1',
    type: 'daily',
    target: 300,
    current: 245,
    metric: 'lines',
    deadline: '2024-01-16T00:00:00Z',
    isActive: true
  },
  {
    id: '2',
    type: 'weekly',
    target: 50,
    current: 38,
    metric: 'pages',
    deadline: '2024-01-21T00:00:00Z',
    isActive: true
  },
  {
    id: '3',
    type: 'monthly',
    target: 3,
    current: 1,
    metric: 'books',
    deadline: '2024-01-31T00:00:00Z',
    isActive: true
  }
]

const MOCK_SESSIONS: ReadingSession[] = [
  { date: '2024-01-15', duration: 45, linesRead: 120, book: 'Iliad', focusScore: 88 },
  { date: '2024-01-14', duration: 32, linesRead: 89, book: 'Oedipus Rex', focusScore: 92 },
  { date: '2024-01-13', duration: 67, linesRead: 156, book: 'Apology', focusScore: 85 },
  { date: '2024-01-12', duration: 28, linesRead: 78, book: 'Iliad', focusScore: 79 },
  { date: '2024-01-11', duration: 51, linesRead: 134, book: 'Iliad', focusScore: 91 },
  { date: '2024-01-10', duration: 39, linesRead: 102, book: 'Oedipus Rex', focusScore: 87 },
  { date: '2024-01-09', duration: 44, linesRead: 115, book: 'Apology', focusScore: 94 }
]

export default function ReadingProgressPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'overview' | 'books' | 'vocabulary' | 'goals'>('overview')
  const [selectedTimeframe, setSelectedTimeframe] = useState<'week' | 'month' | 'year'>('week')
  const [selectedBook, setSelectedBook] = useState<string | null>(null)
  const [showDetails, setShowDetails] = useState(false)
  const [vocabularyFilter, setVocabularyFilter] = useState<'all' | 'learning' | 'mastered'>('all')
  const [sortBy, setSortBy] = useState<'recent' | 'mastery' | 'encounters'>('recent')

  const [progress, setProgress] = useState<ReadingProgress[]>([])
  const [vocabulary, setVocabulary] = useState<VocabularyItem[]>([])
  const [goals, setGoals] = useState<ReadingGoal[]>([])
  const [sessions, setSessions] = useState<ReadingSession[]>([])

  useEffect(() => {
    const loadData = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1200))
        setProgress(MOCK_PROGRESS)
        setVocabulary(MOCK_VOCABULARY)
        setGoals(MOCK_GOALS)
        setSessions(MOCK_SESSIONS)
      } catch (err) {
        setError('Failed to load reading progress')
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours}h ago`
    const diffInDays = Math.floor(diffInHours / 24)
    return `${diffInDays}d ago`
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-400'
      case 'intermediate': return 'text-yellow-400'
      case 'advanced': return 'text-red-400'
      default: return 'text-gray-400'
    }
  }

  const getStreakData = () => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - (6 - i))
      const session = sessions.find(s => s.date === date.toISOString().split('T')[0])
      return {
        date: date.toLocaleDateString('en-US', { weekday: 'short' }),
        active: !!session,
        duration: session?.duration || 0,
        focus: session?.focusScore || 0
      }
    })
    return last7Days
  }

  const filteredVocabulary = vocabulary.filter(item => {
    if (vocabularyFilter === 'learning') return item.masteryLevel < 80
    if (vocabularyFilter === 'mastered') return item.masteryLevel >= 80
    return true
  }).sort((a, b) => {
    switch (sortBy) {
      case 'mastery': return b.masteryLevel - a.masteryLevel
      case 'encounters': return b.encounters - a.encounters
      case 'recent': return new Date(b.lastSeen).getTime() - new Date(a.lastSeen).getTime()
      default: return 0
    }
  })

  if (loading) {
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

  if (error) {
    return (
      <div className="min-h-screen bg-[#0D0D0F] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Eye className="w-8 h-8 text-red-400" />
          </div>
          <h2 className="text-xl font-bold text-[#F5F3EF] mb-2">Failed to Load Progress</h2>
          <p className="text-gray-400 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-[#C9A962] text-black rounded-lg hover:bg-[#C9A962]/80 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  const totalTimeSpent = progress.reduce((sum, book) => sum + book.timeSpent, 0)
  const totalVocabulary = progress.reduce((sum, book) => sum + book.vocabulary.learned, 0)
  const averageProgress = progress.reduce((sum, book) => sum + book.progress, 0) / progress.length
  const streakData = getStreakData()
  const currentStreak = streakData.reverse().findIndex(day => !day.active)
  const streak = currentStreak === -1 ? 7 : currentStreak

  return (
    <div className="min-h-screen bg-[#0D0D0F] text-[#F5F3EF]">
      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-b border-white/10 bg-black/40 backdrop-blur-xl sticky top-0 z-50"
      >
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-[#F5F3EF] mb-2">Reading Progress</h1>
              <p className="text-gray-400">Track ancient texts like never before</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-[#C9A962]">
                <Flame className="w-5 h-5" />
                <span className="font-bold">{streak} day streak</span>
              </div>
              <button className="p-2 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition-colors">
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex gap-1 bg-white/5 p-1 rounded-lg border border-white/10 mb-8"
        >
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'books', label: 'Books in Progress', icon: BookOpen },
            { id: 'vocabulary', label: 'Vocabulary', icon: Brain },
            { id: 'goals', label: 'Goals', icon: Target }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
                activeTab === tab.id
                  ? 'bg-[#C9A962] text-black font-medium'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </motion.div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-[#C9A962]/20 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-[#C9A962]" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{progress.length}</div>
                    <div className="text-sm text-gray-400">Books in Progress</div>
                  </div>
                </div>
                <div className="text-xs text-gray-500">
                  {Math.round(averageProgress)}% average completion
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-[#7C9885]/20 rounded-lg flex items-center justify-center">
                    <Clock className="w-6 h-6 text-[#7C9885]" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{formatDuration(totalTimeSpent)}</div>
                    <div className="text-sm text-gray-400">Time Spent Reading</div>
                  </div>
                </div>
                <div className="text-xs text-gray-500">
                  {Math.round(totalTimeSpent / 30)} hours this month
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-[#8B7355]/20 rounded-lg flex items-center justify-center">
                    <Brain className="w-6 h-6 text-[#8B7355]" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{totalVocabulary}</div>
                    <div className="text-sm text-gray-400">Words Learned</div>
                  </div>
                </div>
                <div className="text-xs text-gray-500">
                  +{progress.reduce((sum, book) => sum + book.vocabulary.recent.length, 0)} this week
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center">
                    <Flame className="w-6 h-6 text-red-400" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{streak}</div>
                    <div className="text-sm text-gray-400">Day Streak</div>
                  </div>
                </div>
                <div className="text-xs text-gray-500">
                  Keep it up!
                </div>
              </motion.div>
            </div>

            {/* Multi-Scale View for Reading Analytics */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5 text-[#C9A962]" />
                Reading Analytics
              </h3>
              <MultiScaleView
                data={{
                  daily: sessions.map(session => ({
                    date: session.date,
                    value: session.duration,
                    metadata: {
                      lines: session.linesRead,
                      focus: session.focusScore,
                      book: session.book
                    }
                  })),
                  weekly: [
                    { date: '2024-W2', value: 245, metadata: { books: 3, avgFocus: 87 } },
                    { date: '2024-W3', value: 312, metadata: { books: 3, avgFocus: 89 } }
                  ],
                  monthly: [
                    { date: '2024-01', value: 1200, metadata: { books: 3, completed: 1 } }
                  ]
                }}
                metrics={[
                  { key: 'duration', label: 'Reading Time', color: '#C9A962', unit: 'min' },
                  { key: 'lines', label: 'Lines Read', color: '#7C9885', unit: 'lines' },
                  { key: 'focus', label: 'Focus Score', color: '#8B7355', unit: '%' }
                ]}
                className="h-64"
              />
            </div>

            {/* Reading Streak Visualization */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#C9A962]" />
                Weekly Activity
              </h3>
              <div className="flex gap-2">
                {getStreakData().map((day, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex-1 text-center"
                  >
                    <div className="text-xs text-gray-400 mb-2">{day.date}</div>
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className={`h-12 rounded-lg flex items-center justify-center ${
                        day.active 
                          ? 'bg-[#C9A962] text-black' 
                          : 'bg-white/5 border border-white/10'
                      }`}
                    >
                      {day.active ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : (
                        <Circle className="w-5 h-5 text-gray-500" />
                      )}
                    </motion.div>
                    {day.active && (
                      <div className="text-xs text-gray-400 mt-1">
                        {formatDuration(day.duration)}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Books Tab */}
        {activeTab === 'books' && (
          <motion.div
            key="books"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {progress.map((book, index) => (
              <motion.div
                key={book.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.01 }}
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 cursor-pointer"
                onClick={() => setSelectedBook(selectedBook === book.id ? null : book.id)}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-20 bg-gradient-to-br from-[#C9A962]/20 to-[#8B7355]/20 rounded-lg flex items-center justify-center">
                      <BookOpen className="w-8 h-8 text-[#C9A962]" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-[#F5F3EF]">{book.title}</h3>
                      <p className="text-gray-400">{book.author}</p>
                      <div className="flex items-center gap-4 mt-1">
                        <span className={`text-xs px-2 py-1 rounded ${getDifficultyColor(book.difficulty)} bg-white/5`}>
                          {book.difficulty}
                        </span>
                        <span className="text-xs text-gray-500">{book.genre}</span>
                        <span className="text-xs text-gray-500">{formatTimeAgo(book.lastRead)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-[#C9A962]">{book.progress}%</div>
                    <div className="text-sm text-gray-400">{formatDuration(book.timeSpent)}</div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-400 mb-2">
                    <span>Line {book.currentLine.toLocaleString()}</span>
                    <span>{book.totalLines.toLocaleString()} total</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${book.progress}%` }}
                      transition={{ delay: index * 0.1, duration: 1, ease: "easeOut" }}
                      className="h-full bg-gradient-to-r from-[#C9A962] to-[#8B7355]"
                    />
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-[#7C9885] mb-1">
                      <Brain className="w-4 h-4" />
                      <span className="font-semibold">{book.vocabulary.learned}</span>
                    </div>
                    <div className="text-xs text-gray-400">Words</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-[#8B7355] mb-1">
                      <MessageSquare className="w-4 h-4" />
                      <span className="font-semibold">{book.annotations}</span>
                    </div>
                    <div className="text-xs text-gray-400">Notes</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-[#C9A962] mb-1">
                      <Bookmark className="w-4 h-4" />
                      <span className="font-semibold">{book.bookmarks}</span>
                    </div>
                    <div className="text-xs text-gray-400">Bookmarks</div>
                  </div>
                </div>

                {/* Expanded Details */}
                <AnimatePresence>
                  {selectedBook === book.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-6 pt-6 border-t border-white/10"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold mb-3">Recent Vocabulary</h4>
                          <div className="space-y-2">
                            {book.vocabulary.recent.map((word, idx) => (
                              <div key={idx} className="flex items-center gap-2 text-sm">
                                <div className="w-2 h-2 bg-[#C9A962] rounded-full" />
                                <span className="font-mono">{word}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-3">Reading Actions</h4>
                          <div className="space-y-2">
                            <button className="w-full flex items-center gap-3 p-3 bg-[#C9A962]/10 hover:bg-[#C9A962]/20 rounded-lg text-left transition-colors">
                              <Play className="w-5 h-5 text-[#C9A962]" />
                              <span>Continue Reading</span>
                            </button>
                            <button className="w-full flex items-center gap-3 p-3 bg-white/5 hover:bg-white/10 rounded-lg text-left transition-colors">
                              <Eye className="w-5 h-5 text-[#7C9885]" />
                              <span>View Annotations</span>
                            </button>
                            <button className="w-full flex items-center gap-3 p-3 bg-white/5 hover:bg-white/10 rounded-lg text-left transition-colors">
                              <Share2 className="w-5 h-5 text-[#8B7355]" />
                              <span>Share Progress</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Vocabulary Tab */}
        {activeTab === 'vocabulary' && (
          <motion.div
            key="vocabulary"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Vocabulary Controls */}
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex gap-1 bg-white/5 p-1 rounded-lg border border-white/10">
                {[
                  { id: 'all', label: 'All' },
                  { id: 'learning', label: 'Learning' },
                  { id: 'mastered', label: 'Mastered' }
                ].map((filter) => (
                  <button
                    key={filter.id}
                    onClick={() => setVocabularyFilter(filter.id as any)}
                    className={`px-3 py-1 rounded text-sm transition-all ${
                      vocabularyFilter === filter.id
                        ? 'bg-[#C9A962] text-black'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm"
              >
                <option value="recent">Most Recent</option>
                <option value="mastery">Mastery Level</option>
                <option value="encounters">Most Encountered</option>
              </select>
            </div>

            {/* Vocabulary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-2">
                  <Brain className="w-8 h-8 text-[#C9A962]" />
                  <div>
                    <div className="text-2xl font-bold">{vocabulary.length}</div>
                    <div className="text-sm text-gray-400">Total Words</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-2">
                  <TrendingUp className="w-8 h-8 text-[#7C9885]" />
                  <div>
                    <div className="text-2xl font-bold">
                      {Math.round(vocabulary.reduce((sum, w) => sum + w.masteryLevel, 0) / vocabulary.length)}%
                    </div>
                    <div className="text-sm text-gray-400">Avg Mastery</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-2">
                  <Zap className="w-8 h-8 text-[#8B7355]" />
                  <div>
                    <div className="text-2xl font-bold">
                      {vocabulary.filter(w => w.masteryLevel >= 80).length}
                    </div>
                    <div className="text-sm text-gray-400">Mastered</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Research Canvas for Etymology Connections */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Globe className="w-5 h-5 text-[#C9A962]" />
                Etymology Network
              </h3>
              <ResearchCanvas
                nodes={vocabulary.slice(0, 10).map(word => ({
                  id: word.word,
                  type: 'word',
                  title: word.word,
                  content: word.definition,
                  metadata: {
                    mastery: word.masteryLevel,
                    encounters: word.encounters,
                    etymology: word.etymology
                  },
                  x: Math.random() * 800,
                  y: Math.random() * 400
                }))}
                connections={vocabulary.slice(0, 10).flatMap(word =>
                  word.relatedWords.slice(0, 2).map(related => ({
                    sourceId: word.word,
                    targetId: related,
                    type: 'etymology',
                    strength: 0.7
                  }))
                )}
                className="h-96"
              />
            </div>

            {/* Vocabulary List */}
            <div className="space-y-4">
              {filteredVocabulary.map((word, index) => (
                <motion.div
                  key={word.word}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-mono text-[#C9A962]">{word.word}</h3>
                        <span className="text-sm text-gray-400">
                          {word.encounters} encounters
                        </span>
                        <span className="text-sm text-gray-400">
                          {formatTimeAgo(word.lastSeen)}
                        </span>
                      </div>
                      <p className="text-[#F5F3EF] mb-2">{word.definition}</p>
                      <div className="text-sm text-gray-400 mb-3 font-mono italic">
                        "{word.context}"
                      </div>
                      <div className="text-sm text-gray-400 mb-2">
                        <strong>Etymology:</strong> {word.etymology}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {word.relatedWords.map((related, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-white/10 rounded text-xs font-mono text-[#7C9885]"
                          >
                            {related}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="w-16 h-16 relative mb-2">
                        <svg className="w-16 h-16 transform -rotate-90">
                          <circle
                            cx="32"
                            cy="32"
                            r="28"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                            className="text-white/10"
                          />
                          <circle
                            cx="32"
                            cy="32"
                            r="28"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                            strokeDasharray={`${2 * Math.PI * 28}`}
                            strokeDashoffset={`${2 * Math.PI * 28 * (1 - word.masteryLevel / 100)}`}
                            className="text-[#C9A962] transition-all duration-1000"
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-sm font-bold">{word.masteryLevel}%</span>
                        </div>
                      </div>
                      <div className="text-xs text-gray-400">mastery</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Goals Tab */}
        {activeTab === 'goals' && (
          <motion.div
            key="goals"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Goal Creation */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Plus className="w-5 h-5 text-[#C9A962]" />
                Create New Goal
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <select className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg">
                  <option>Daily</option>
                  <option>Weekly</option>
                  <option>Monthly</option>
                </select>
                <input
                  type="number"
                  placeholder="Target"
                  className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg"
                />
                <select className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg">
                  <option>Lines</option>
                  <option>Pages</option>
                  <option>Minutes</option>
                  <option>Books</option>
                </select>
                <button className="px-4 py-2 bg-[#C9A962] text-black rounded-lg font-medium hover:bg-[#C9A962]/80 transition-colors">
                  Create Goal
                </button>
              </div>
            </div>

            {/* Active Goals */}
            <div className="space-y-4">
              {goals.map((goal, index) => (
                <motion.div
                  key={goal.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold capitalize text-[#F5F3EF]">
                        {goal.type} Goal
                      </h3>
                      <p className="text-gray-400">
                        {goal.current} / {goal.target} {goal.metric}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-2xl font-bold text-[#C9A962]">
                          {Math.round((goal.current / goal.target) * 100)}%
                        </div>
                        <div className="text-sm text-gray-400">
                          {new Date(goal.deadline).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="w-16 h-16 relative">
                        <svg className="w-16 h-16 transform -rotate-90">
                          <circle
                            cx="32"
                            cy="32"
                            r="28"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                            className="text-white/10"
                          />
                          <circle
                            cx="32"
                            cy="32"
                            r="28"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                            strokeDasharray={`${2 * Math.PI * 28}`}
                            strokeDashoffset={`${2 * Math.PI * 28 * (1 - goal.current / goal.target)}`}
                            className={`transition-all duration-1000 ${
                              goal.current >= goal.target 
                                ? 'text-green-400' 
                                : goal.current / goal.target > 0.8
                                ? 'text-[#C9A962]'
                                : 'text-[#7C9885]'
                            }`}
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          {goal.current >= goal.target ? (
                            <Trophy className="w-6 h-6 text-green-400" />
                          ) : (
                            <Target className="w-6 h-6 text-[#C9A962]" />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min((goal.current / goal.target) * 100, 100)}%` }}
                        transition={{ delay: index * 0.2, duration: 1.5, ease: "easeOut" }}
                        className={`h-full ${
                          goal.current >= goal.target 
                            ? 'bg-green-400' 
                            : 'bg-gradient-to-r from-[#C9A962] to-[#7C9885]'
                        }`}
                      />
                    </div>
                  </div>

                  {/* Goal Status */}
                  <div className="flex items-center justify-between text-sm">
                    <span className={`px-3 py-1 rounded-full ${
                      goal.current >= goal.target
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-[#C9A962]/20 text-[#C9A962]'
                    }`}>
                      {goal.current >= goal.target ? 'Completed!' : 'In Progress'}
                    </span>
                    <span className="text-gray-400">
                      {goal.target - goal.current > 0
                        ? `${goal.target - goal.current} ${goal.metric} to go`
                        : 'Goal achieved!'
                      }
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}