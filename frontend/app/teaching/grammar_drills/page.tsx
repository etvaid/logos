
'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Book, 
  Target, 
  Zap, 
  TrendingUp, 
  CheckCircle, 
  XCircle, 
  RotateCcw, 
  Lightbulb,
  Brain,
  Award,
  ArrowRight,
  Play,
  Pause,
  SkipForward,
  Settings,
  Filter,
  Download,
  Share2,
  BookOpen,
  GraduationCap,
  Clock,
  Star,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Eye,
  EyeOff,
  Volume2,
  VolumeX,
  Bookmark,
  MessageSquare,
  BarChart3,
  Calendar,
  Users,
  Flame
} from 'lucide-react'
import { MultiScaleView } from '@/components/innovations/multi_scale_view'
import { NarrativeTimeline } from '@/components/innovations/narrative_timeline'

interface GrammarTopic {
  id: string
  name: string
  category: 'morphology' | 'syntax' | 'vocabulary' | 'prose'
  difficulty: 1 | 2 | 3 | 4 | 5
  prerequisites: string[]
  description: string
  examples: string[]
  commonErrors: string[]
  masteryThreshold: number
}

interface Exercise {
  id: string
  type: 'identification' | 'transformation' | 'completion' | 'translation' | 'parsing'
  question: string
  options?: string[]
  correctAnswer: string | string[]
  explanation: string
  hints: string[]
  difficulty: number
  timeEstimate: number
  context?: string
  audio?: string
}

interface StudentProgress {
  topicId: string
  accuracy: number
  attempts: number
  timeSpent: number
  lastAttempt: Date
  masteryLevel: 'novice' | 'developing' | 'proficient' | 'mastered'
  streakDays: number
  problemAreas: string[]
}

interface DrillSession {
  id: string
  topicIds: string[]
  exercises: Exercise[]
  currentIndex: number
  responses: Array<{
    exerciseId: string
    userAnswer: string | string[]
    correct: boolean
    timeSpent: number
    hintsUsed: number
  }>
  startTime: Date
  settings: {
    timeLimit?: number
    showHints: boolean
    playAudio: boolean
    adaptiveDifficulty: boolean
  }
}

const grammarTopics: GrammarTopic[] = [
  {
    id: 'nominative-case',
    name: 'Nominative Case',
    category: 'morphology',
    difficulty: 1,
    prerequisites: [],
    description: 'Subject and predicate nominative identification',
    examples: ['Puella pulchra est', 'Marcus poeta bonus est'],
    commonErrors: ['Confusing with accusative', 'Missing agreement'],
    masteryThreshold: 0.85
  },
  {
    id: 'accusative-case',
    name: 'Accusative Case',
    category: 'morphology',
    difficulty: 1,
    prerequisites: ['nominative-case'],
    description: 'Direct objects and accusative of extent',
    examples: ['Puella librum legit', 'Tres horas ambulavit'],
    commonErrors: ['Subject/object confusion', 'Preposition mistakes'],
    masteryThreshold: 0.85
  },
  {
    id: 'ablative-absolute',
    name: 'Ablative Absolute',
    category: 'syntax',
    difficulty: 4,
    prerequisites: ['ablative-case', 'participles'],
    description: 'Independent ablative constructions',
    examples: ['Caesare duce, milites pugnaverunt', 'His verbis dictis, abiit'],
    commonErrors: ['Agreeing with main clause subject', 'Wrong participle tense'],
    masteryThreshold: 0.75
  },
  {
    id: 'subjunctive-purpose',
    name: 'Subjunctive of Purpose',
    category: 'syntax',
    difficulty: 3,
    prerequisites: ['subjunctive-formation', 'ut-clauses'],
    description: 'Purpose clauses with ut/ne + subjunctive',
    examples: ['Venit ut amicos videat', 'Laborat ne pauper sit'],
    commonErrors: ['Using indicative mood', 'Wrong sequence of tenses'],
    masteryThreshold: 0.80
  }
]

const sampleExercises: Exercise[] = [
  {
    id: 'nom-1',
    type: 'identification',
    question: 'Identify the nominative case noun in: "Puella pulchra librum novum legit."',
    options: ['puella', 'pulchra', 'librum', 'novum'],
    correctAnswer: 'puella',
    explanation: 'Puella is the subject of the verb legit, so it takes the nominative case.',
    hints: ['Look for the subject of the verb', 'Who is doing the action?'],
    difficulty: 1,
    timeEstimate: 30,
    context: 'Basic case identification'
  },
  {
    id: 'acc-1',
    type: 'transformation',
    question: 'Change to accusative: "bonus poeta" (nominative)',
    correctAnswer: 'bonum poetam',
    explanation: 'Both adjective and noun must change to accusative case with matching endings.',
    hints: ['Both words need to change', 'Remember adjective agreement'],
    difficulty: 2,
    timeEstimate: 45,
    context: 'Case transformation with agreement'
  }
]

// Session Review Component
const SessionReview: React.FC<{
  session: DrillSession
  onReturnToSelect: () => void
}> = ({ session, onReturnToSelect }) => {
  const correctCount = session.responses.filter(r => r.correct).length
  const totalCount = session.responses.length
  const accuracy = totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-[#F5F3EF]">Session Review</h2>
        <button
          onClick={onReturnToSelect}
          className="px-6 py-3 bg-[#C9A962]/20 hover:bg-[#C9A962]/30 border border-[#C9A962]/30 rounded-xl text-[#C9A962] transition-all"
        >
          Start New Session
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white/5 rounded-xl border border-white/10">
          <div className="text-sm text-[#F5F3EF]/60 mb-2">Exercises Completed</div>
          <div className="text-3xl font-bold text-[#C9A962]">{totalCount}</div>
        </div>
        <div className="p-6 bg-white/5 rounded-xl border border-white/10">
          <div className="text-sm text-[#F5F3EF]/60 mb-2">Accuracy</div>
          <div className="text-3xl font-bold text-[#7C9885]">{accuracy}%</div>
        </div>
        <div className="p-6 bg-white/5 rounded-xl border border-white/10">
          <div className="text-sm text-[#F5F3EF]/60 mb-2">Correct Answers</div>
          <div className="text-3xl font-bold text-[#8B7355]">{correctCount}</div>
        </div>
      </div>
    </motion.div>
  )
}

export default function GrammarDrillsPage() {
  const [selectedTopics, setSelectedTopics] = useState<string[]>(['nominative-case'])
  const [currentSession, setCurrentSession] = useState<DrillSession | null>(null)
  const [studentProgress, setStudentProgress] = useState<StudentProgress[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [view, setView] = useState<'select' | 'drill' | 'review'>('select')
  const [filter, setFilter] = useState<'all' | 'morphology' | 'syntax' | 'vocabulary' | 'prose'>('all')
  const [sortBy, setSortBy] = useState<'difficulty' | 'name' | 'progress'>('difficulty')

  // Session management
  const [sessionSettings, setSessionSettings] = useState({
    timeLimit: undefined as number | undefined,
    showHints: true,
    playAudio: true,
    adaptiveDifficulty: true,
    exerciseCount: 10
  })

  // Filter and sort topics
  const filteredTopics = useMemo(() => {
    let filtered = grammarTopics
    
    if (filter !== 'all') {
      filtered = filtered.filter(topic => topic.category === filter)
    }

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'difficulty':
          return a.difficulty - b.difficulty
        case 'name':
          return a.name.localeCompare(b.name)
        case 'progress':
          const progressA = studentProgress.find(p => p.topicId === a.id)?.accuracy || 0
          const progressB = studentProgress.find(p => p.topicId === b.id)?.accuracy || 0
          return progressB - progressA
        default:
          return 0
      }
    })
  }, [filter, sortBy, studentProgress])

  // Generate exercises for selected topics
  const generateExercises = async (topicIds: string[]): Promise<Exercise[]> => {
    setIsLoading(true)
    // Simulate AI generation
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // For demo, return sample exercises
    const exercises = [...sampleExercises]
    setIsLoading(false)
    return exercises
  }

  // Start drill session
  const startDrillSession = async () => {
    const exercises = await generateExercises(selectedTopics)
    const session: DrillSession = {
      id: `session-${Date.now()}`,
      topicIds: selectedTopics,
      exercises: exercises.slice(0, sessionSettings.exerciseCount),
      currentIndex: 0,
      responses: [],
      startTime: new Date(),
      settings: sessionSettings
    }
    setCurrentSession(session)
    setView('drill')
  }

  // Handle exercise response
  const handleExerciseResponse = (answer: string | string[]) => {
    if (!currentSession) return

    const currentExercise = currentSession.exercises[currentSession.currentIndex]
    const isCorrect = Array.isArray(currentExercise.correctAnswer) 
      ? JSON.stringify(answer) === JSON.stringify(currentExercise.correctAnswer)
      : answer === currentExercise.correctAnswer

    const response = {
      exerciseId: currentExercise.id,
      userAnswer: answer,
      correct: isCorrect,
      timeSpent: Date.now() - currentSession.startTime.getTime(),
      hintsUsed: 0 // Track hints used
    }

    const updatedSession = {
      ...currentSession,
      responses: [...currentSession.responses, response]
    }

    setCurrentSession(updatedSession)

    // Move to next exercise or finish
    setTimeout(() => {
      if (currentSession.currentIndex < currentSession.exercises.length - 1) {
        setCurrentSession(prev => prev ? { ...prev, currentIndex: prev.currentIndex + 1 } : null)
      } else {
        // Session complete
        setView('review')
        updateProgress(updatedSession)
      }
    }, 2000) // Show feedback for 2 seconds
  }

  // Update student progress
  const updateProgress = (completedSession: DrillSession) => {
    // Calculate progress metrics
    const accuracy = completedSession.responses.reduce((acc, r) => acc + (r.correct ? 1 : 0), 0) / completedSession.responses.length
    const totalTime = completedSession.responses.reduce((acc, r) => acc + r.timeSpent, 0)

    // Update progress for each topic
    completedSession.topicIds.forEach(topicId => {
      setStudentProgress(prev => {
        const existing = prev.find(p => p.topicId === topicId)
        if (existing) {
          return prev.map(p => p.topicId === topicId ? {
            ...p,
            accuracy: (p.accuracy * p.attempts + accuracy) / (p.attempts + 1),
            attempts: p.attempts + 1,
            timeSpent: p.timeSpent + totalTime,
            lastAttempt: new Date(),
            masteryLevel: accuracy >= 0.9 ? 'mastered' : accuracy >= 0.8 ? 'proficient' : accuracy >= 0.6 ? 'developing' : 'novice'
          } : p)
        } else {
          return [...prev, {
            topicId,
            accuracy,
            attempts: 1,
            timeSpent: totalTime,
            lastAttempt: new Date(),
            masteryLevel: accuracy >= 0.9 ? 'mastered' : accuracy >= 0.8 ? 'proficient' : accuracy >= 0.6 ? 'developing' : 'novice',
            streakDays: 1,
            problemAreas: []
          }]
        }
      })
    })
  }

  const progressData = useMemo(() => {
    return selectedTopics.map(topicId => {
      const topic = grammarTopics.find(t => t.id === topicId)
      const progress = studentProgress.find(p => p.topicId === topicId)
      return {
        topic: topic?.name || 'Unknown',
        progress: progress?.accuracy || 0,
        attempts: progress?.attempts || 0,
        mastery: progress?.masteryLevel || 'novice'
      }
    })
  }, [selectedTopics, studentProgress])

  if (view === 'drill' && currentSession) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0D0D0F] via-[#1A1A1F] to-[#0D0D0F]">
        <div className="container mx-auto px-6 py-8">
          {/* Drill Header */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 mb-8"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-[#C9A962]/20 rounded-xl">
                  <Brain className="w-6 h-6 text-[#C9A962]" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-[#F5F3EF]">Grammar Drill Session</h1>
                  <p className="text-[#F5F3EF]/70">Question {currentSession.currentIndex + 1} of {currentSession.exercises.length}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setView('select')}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg border border-white/20 text-[#F5F3EF] transition-all"
                >
                  Exit
                </button>
              </div>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-white/10 rounded-full h-2">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${((currentSession.currentIndex + 1) / currentSession.exercises.length) * 100}%` }}
                className="h-full bg-gradient-to-r from-[#C9A962] to-[#7C9885] rounded-full"
                transition={{ duration: 0.5 }}
              />
            </div>
          </motion.div>

          {/* Current Exercise */}
          <DrillExercise
            exercise={currentSession.exercises[currentSession.currentIndex]}
            onResponse={handleExerciseResponse}
            settings={currentSession.settings}
          />
        </div>
      </div>
    )
  }

  if (view === 'review' && currentSession) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0D0D0F] via-[#1A1A1F] to-[#0D0D0F]">
        <div className="container mx-auto px-6 py-8">
          <SessionReview
            session={currentSession}
            onReturnToSelect={() => setView('select')}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0D0D0F] via-[#1A1A1F] to-[#0D0D0F]">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="p-4 bg-gradient-to-br from-[#C9A962]/20 to-[#7C9885]/20 rounded-2xl border border-[#C9A962]/30">
              <Target className="w-8 h-8 text-[#C9A962]" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-[#C9A962] via-[#F5F3EF] to-[#7C9885] bg-clip-text text-transparent">
                Grammar Drills
              </h1>
              <p className="text-[#F5F3EF]/70 text-lg mt-2">Tools that actually help people learn</p>
            </div>
          </div>
        </motion.div>

        {/* Multi-scale Topic Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <MultiScaleView
            data={progressData}
            scales={[
              { 
                name: 'Topic Overview', 
                view: 'grid',
                itemSize: 'large'
              },
              { 
                name: 'Progress Detail', 
                view: 'list',
                itemSize: 'medium' 
              },
              { 
                name: 'Mastery Tracking', 
                view: 'timeline',
                itemSize: 'small' 
              }
            ]}
            renderItem={(item, scale) => (
              <div className={`bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-4 
                ${scale.itemSize === 'large' ? 'h-32' : scale.itemSize === 'medium' ? 'h-24' : 'h-16'}`}>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-[#F5F3EF] truncate">{item.topic}</h3>
                  <div className={`px-2 py-1 rounded text-xs font-medium
                    ${item.mastery === 'mastered' ? 'bg-green-500/20 text-green-400' :
                      item.mastery === 'proficient' ? 'bg-blue-500/20 text-blue-400' :
                      item.mastery === 'developing' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-red-500/20 text-red-400'}`}>
                    {item.mastery}
                  </div>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2 mb-2">
                  <div 
                    className="h-full bg-gradient-to-r from-[#C9A962] to-[#7C9885] rounded-full"
                    style={{ width: `${item.progress * 100}%` }}
                  />
                </div>
                {scale.itemSize !== 'small' && (
                  <p className="text-[#F5F3EF]/70 text-sm">{item.attempts} attempts</p>
                )}
              </div>
            )}
          />
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Topic Selection */}
          <div className="lg:col-span-2">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-8"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Book className="w-6 h-6 text-[#C9A962]" />
                  <h2 className="text-2xl font-bold text-[#F5F3EF]">Grammar Topics</h2>
                </div>
                <div className="flex items-center gap-3">
                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value as any)}
                    className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-[#F5F3EF] text-sm"
                  >
                    <option value="all">All Categories</option>
                    <option value="morphology">Morphology</option>
                    <option value="syntax">Syntax</option>
                    <option value="vocabulary">Vocabulary</option>
                    <option value="prose">Prose</option>
                  </select>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-[#F5F3EF] text-sm"
                  >
                    <option value="difficulty">By Difficulty</option>
                    <option value="name">By Name</option>
                    <option value="progress">By Progress</option>
                  </select>
                </div>
              </div>

              <div className="grid gap-4 max-h-96 overflow-y-auto pr-2">
                <AnimatePresence>
                  {filteredTopics.map((topic, index) => {
                    const progress = studentProgress.find(p => p.topicId === topic.id)
                    const isSelected = selectedTopics.includes(topic.id)
                    
                    return (
                      <motion.div
                        key={topic.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ delay: index * 0.05 }}
                        className={`p-4 rounded-xl border transition-all cursor-pointer
                          ${isSelected 
                            ? 'bg-[#C9A962]/10 border-[#C9A962]/30 ring-2 ring-[#C9A962]/20' 
                            : 'bg-white/5 border-white/10 hover:bg-white/10'}`}
                        onClick={() => {
                          setSelectedTopics(prev => 
                            isSelected 
                              ? prev.filter(id => id !== topic.id)
                              : [...prev, topic.id]
                          )
                        }}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-[#F5F3EF]">{topic.name}</h3>
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <Star 
                                    key={i} 
                                    className={`w-3 h-3 ${i < topic.difficulty ? 'text-[#C9A962] fill-current' : 'text-gray-500'}`} 
                                  />
                                ))}
                              </div>
                            </div>
                            <p className="text-[#F5F3EF]/70 text-sm mb-2">{topic.description}</p>
                            <div className="flex items-center gap-2 text-xs">
                              <span className={`px-2 py-1 rounded-full
                                ${topic.category === 'morphology' ? 'bg-blue-500/20 text-blue-400' :
                                  topic.category === 'syntax' ? 'bg-green-500/20 text-green-400' :
                                  topic.category === 'vocabulary' ? 'bg-purple-500/20 text-purple-400' :
                                  'bg-orange-500/20 text-orange-400'}`}>
                                {topic.category}
                              </span>
                              {progress && (
                                <span className={`px-2 py-1 rounded-full
                                  ${progress.masteryLevel === 'mastered' ? 'bg-green-500/20 text-green-400' :
                                    progress.masteryLevel === 'proficient' ? 'bg-blue-500/20 text-blue-400' :
                                    progress.masteryLevel === 'developing' ? 'bg-yellow-500/20 text-yellow-400' :
                                    'bg-red-500/20 text-red-400'}`}>
                                  {Math.round(progress.accuracy * 100)}%
                                </span>
                              )}
                            </div>
                          </div>
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center
                            ${isSelected ? 'border-[#C9A962] bg-[#C9A962]' : 'border-white/30'}`}>
                            {isSelected && <CheckCircle className="w-4 h-4 text-white" />}
                          </div>
                        </div>
                        
                        {progress && (
                          <div className="w-full bg-white/10 rounded-full h-1">
                            <div 
                              className="h-full bg-gradient-to-r from-[#C9A962] to-[#7C9885] rounded-full"
                              style={{ width: `${progress.accuracy * 100}%` }}
                            />
                          </div>
                        )}
                      </motion.div>
                    )
                  })}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>

          {/* Session Controls */}
          <div className="space-y-6">
            {/* Settings */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <Settings className="w-5 h-5 text-[#C9A962]" />
                <h3 className="font-bold text-[#F5F3EF]">Drill Settings</h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#F5F3EF] mb-2">
                    Exercise Count
                  </label>
                  <select
                    value={sessionSettings.exerciseCount}
                    onChange={(e) => setSessionSettings(prev => ({ ...prev, exerciseCount: parseInt(e.target.value) }))}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-[#F5F3EF]"
                  >
                    <option value={5}>5 exercises</option>
                    <option value={10}>10 exercises</option>
                    <option value={15}>15 exercises</option>
                    <option value={20}>20 exercises</option>
                  </select>
                </div>

                <div className="space-y-3">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={sessionSettings.showHints}
                      onChange={(e) => setSessionSettings(prev => ({ ...prev, showHints: e.target.checked }))}
                      className="rounded"
                    />
                    <span className="text-sm text-[#F5F3EF]">Show hints</span>
                  </label>
                  
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={sessionSettings.adaptiveDifficulty}
                      onChange={(e) => setSessionSettings(prev => ({ ...prev, adaptiveDifficulty: e.target.checked }))}
                      className="rounded"
                    />
                    <span className="text-sm text-[#F5F3EF]">Adaptive difficulty</span>
                  </label>
                  
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={sessionSettings.playAudio}
                      onChange={(e) => setSessionSettings(prev => ({ ...prev, playAudio: e.target.checked }))}
                      className="rounded"
                    />
                    <span className="text-sm text-[#F5F3EF]">Audio pronunciation</span>
                  </label>
                </div>
              </div>
            </motion.div>

            {/* Progress Summary */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <TrendingUp className="w-5 h-5 text-[#C9A962]" />
                <h3 className="font-bold text-[#F5F3EF]">Your Progress</h3>
              </div>
              
              {studentProgress.length > 0 ? (
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#F5F3EF]/70">Topics Studied</span>
                    <span className="text-[#C9A962] font-medium">{studentProgress.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#F5F3EF]/70">Average Accuracy</span>
                    <span className="text-[#C9A962] font-medium">
                      {Math.round(studentProgress.reduce((acc, p) => acc + p.accuracy, 0) / studentProgress.length * 100)}%
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[#F5F3EF]/70">Total Attempts</span>
                    <span className="text-[#C9A962] font-medium">
                      {studentProgress.reduce((acc, p) => acc + p.attempts, 0)}
                    </span>
                  </div>
                </div>
              ) : (
                <p className="text-[#F5F3EF]/70 text-sm">No practice sessions yet. Start your first drill!</p>
              )}
            </motion.div>

            {/* Start Button */}
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              onClick={startDrillSession}
              disabled={selectedTopics.length === 0 || isLoading}
              className="w-full p-4 bg-gradient-to-r from-[#C9A962] to-[#7C9885] hover:from-[#C9A962]/90 hover:to-[#7C9885]/90 
                        disabled:opacity-50 disabled:cursor-not-allowed rounded-xl font-bold text-white 
                        transition-all flex items-center justify-center gap-2 group"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isLoading ? (
                <RefreshCw className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Play className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  Start Grammar Drill
                  {selectedTopics.length > 0 && (
                    <span className="bg-white/20 px-2 py-1 rounded-full text-xs">
                      {selectedTopics.length} topic{selectedTopics.length > 1 ? 's' : ''}
                    </span>
                  )}
                </>
              )}
            </motion.button>
          </div>
        </div>

        {/* Learning Timeline */}
        {studentProgress.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="mt-12"
          >
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-8">
              <div className="flex items-center gap-3 mb-6">
                <Calendar className="w-6 h-6 text-[#C9A962]" />
                <h2 className="text-2xl font-bold text-[#F5F3EF]">Learning Journey</h2>
              </div>
              
              <NarrativeTimeline
                events={studentProgress.map(p => {
                  const topic = grammarTopics.find(t => t.id === p.topicId)
                  return {
                    id: p.topicId,
                    title: topic?.name || 'Unknown Topic',
                    description: `${Math.round(p.accuracy * 100)}% accuracy in ${p.attempts} attempts`,
                    timestamp: p.lastAttempt,
                    category: topic?.category || 'unknown',
                    metadata: {
                      mastery: p.masteryLevel,
                      streak: p.streakDays,
                      timeSpent: p.timeSpent
                    }
                  }
                })}
                renderEvent={(event) => (
                  <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-[#F5F3EF]">{event.title}</h3>
                      <span className={`px-2 py-1 rounded text-xs font-medium
                        ${event.metadata.mastery === 'mastered' ? 'bg-green-500/20 text-green-400' :
                          event.metadata.mastery === 'proficient' ? 'bg-blue-500/20 text-blue-400' :
                          event.metadata.mastery === 'developing' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-red-500/20 text-red-400'}`}>
                        {event.metadata.mastery}
                      </span>
                    </div>
                    <p className="text-[#F5F3EF]/70 text-sm mb-2">{event.description}</p>
                    <div className="flex items-center gap-4 text-xs text-[#F5F3EF]/50">
                      <span>{event.timestamp.toLocaleDateString()}</span>
                      {event.metadata.streak > 1 && (
                        <span className="flex items-center gap-1">
                          <Flame className="w-3 h-3 text-orange-400" />
                          {event.metadata.streak} day streak
                        </span>
                      )}
                    </div>
                  </div>
                )}
              />
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

// Drill Exercise Component
function DrillExercise({ 
  exercise, 
  onResponse, 
  settings 
}: { 
  exercise: Exercise
  onResponse: (answer: string | string[]) => void
  settings: DrillSession['settings']
}) {
  const [selectedAnswer, setSelectedAnswer] = useState<string>('')
  const [showHints, setShowHints] = useState(false)
  const [hintsUsed, setHintsUsed] = useState(0)
  const [timeLeft, setTimeLeft] = useState(settings.timeLimit || 60)
  const [submitted, setSubmitted] = useState(false)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)

  useEffect(() => {
    if (settings.timeLimit) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleSubmit()
            return 0
          }
          return prev - 1
        })
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [])

  const handleSubmit = () => {
    if (submitted) return
    
    const correct = selectedAnswer === exercise.correctAnswer
    setIsCorrect(correct)
    setSubmitted(true)
    onResponse(selectedAnswer)
  }

  const handleHint = () => {
    setShowHints(true)
    setHintsUsed(prev => prev + 1)
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-8"
    >
      {/* Exercise Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-xl ${
            exercise.type === 'identification' ? 'bg-blue-500/20' :
            exercise.type === 'transformation' ? 'bg-green-500/20' :
            exercise.type === 'completion' ? 'bg-purple-500/20' :
            exercise.type === 'translation' ? 'bg-orange-500/20' :
            'bg-red-500/20'
          }`}>
            {exercise.type === 'identification' ? <Eye className="w-6 h-6" /> :
             exercise.type === 'transformation' ? <RefreshCw className="w-6 h-6" /> :
             exercise.type === 'completion' ? <BookOpen className="w-6 h-6" /> :
             exercise.type === 'translation' ? <MessageSquare className="w-6 h-6" /> :
             <Brain className="w-6 h-6" />}
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#F5F3EF] capitalize">{exercise.type}</h2>
            <p className="text-[#F5F3EF]/70">Estimated time: {exercise.timeEstimate}s</p>
          </div>
        </div>
        
        {settings.timeLimit && (
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#C9A962]" />
            <span className="text-[#C9A962] font-mono">{timeLeft}s</span>
          </div>
        )}
      </div>

      {/* Question */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-[#F5F3EF] mb-4">{exercise.question}</h3>
        {exercise.context && (
          <p className="text-[#F5F3EF]/60 text-sm bg-white/5 p-3 rounded-lg border border-white/10">
            Context: {exercise.context}
          </p>
        )}
      </div>

      {/* Options */}
      {exercise.options && (
        <div className="grid gap-3 mb-6">
          {exercise.options.map((option, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => !submitted && setSelectedAnswer(option)}
              className={`p-4 rounded-xl border text-left transition-all ${
                selectedAnswer === option
                  ? submitted
                    ? isCorrect
                      ? 'bg-green-500/20 border-green-500/30 text-green-400'
                      : 'bg-red-500/20 border-red-500/30 text-red-400'
                    : 'bg-[#C9A962]/20 border-[#C9A962]/30'
                  : submitted && option === exercise.correctAnswer
                    ? 'bg-green-500/10 border-green-500/20 text-green-400'
                    : 'bg-white/5 border-white/10 hover:bg-white/10'
              }`}
              disabled={submitted}
            >
              <div className="flex items-center gap-3">
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  selectedAnswer === option
                    ? submitted && isCorrect
                      ? 'border-green-500 bg-green-500'
                      : submitted && !isCorrect
                        ? 'border-red-500 bg-red-500'
                        : 'border-[#C9A962] bg-[#C9A962]'
                    : 'border-white/30'
                }`}>
                  {selectedAnswer === option && (
                    submitted ? (
                      isCorrect ? <CheckCircle className="w-4 h-4 text-white" /> : <XCircle className="w-4 h-4 text-white" />
                    ) : (
                      <div className="w-3 h-3 bg-white rounded-full" />
                    )
                  )}
                </div>
                <span className="text-[#F5F3EF]">{option}</span>
              </div>
            </motion.button>
          ))}
        </div>
      )}

      {/* Text Input for non-multiple choice */}
      {!exercise.options && (
        <div className="mb-6">
          <input
            type="text"
            value={selectedAnswer}
            onChange={(e) => !submitted && setSelectedAnswer(e.target.value)}
            placeholder="Enter your answer..."
            className="w-full p-4 bg-white/10 border border-white/20 rounded-xl text-[#F5F3EF] placeholder-[#F5F3EF]/50"
            disabled={submitted}
          />
        </div>
      )}

      {/* Feedback */}
      <AnimatePresence>
        {submitted && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`p-4 rounded-xl border mb-6 ${
              isCorrect 
                ? 'bg-green-500/10 border-green-500/20' 
                : 'bg-red-500/10 border-red-500/20'
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              {isCorrect ? (
                <CheckCircle className="w-5 h-5 text-green-400" />
              ) : (
                <XCircle className="w-5 h-5 text-red-400" />
              )}
              <span className={`font-medium ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                {isCorrect ? 'Correct!' : 'Incorrect'}
              </span>
            </div>
            <p className="text-[#F5F3EF]/80">{exercise.explanation}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hints */}
      <AnimatePresence>
        {showHints && settings.showHints && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-[#C9A962]/10 border border-[#C9A962]/20 rounded-xl p-4 mb-6"
          >
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="w-4 h-4 text-[#C9A962]" />
              <span className="font-medium text-[#C9A962]">Hints</span>
            </div>
            <ul className="space-y-1">
              {exercise.hints.slice(0, hintsUsed).map((hint, index) => (
                <li key={index} className="text-[#F5F3EF]/80 text-sm">• {hint}</li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Controls */}
      <div className="flex items-center gap-3">
        {!submitted && (
          <>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSubmit}
              disabled={!selectedAnswer}
              className="px-6 py-3 bg-gradient-to-r from-[#C9A962] to-[#7C9885] hover:from-[#C9A962]/90 hover:to-[#7C9885]/90 
                        disabled:opacity-50 disabled:cursor-not-allowed rounded-xl font-bold text-white transition-all"
            >
              Submit Answer
            </motion.button>
            
            {settings.showHints && hintsUsed < exercise.hints.length && (
              <button
                onClick={handleHint}
                className="px-4 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-[#F5F3EF] transition-all flex items-center gap-2"
              >
                <Lightbulb className="w-4 h-4" />
                Get Hint ({exercise.hints.length - hintsUsed} left)
              </button>
            )}
          </>
        )}
      </div>
    </motion.div>
  )
}
