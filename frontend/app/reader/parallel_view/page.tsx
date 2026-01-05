'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import { 
  BookOpen, 
  Languages, 
  Eye, 
  Layers, 
  Maximize2, 
  Settings, 
  Search,
  MessageSquare,
  Bookmark,
  Share,
  Download,
  Palette,
  MousePointer,
  Zap,
  Brain,
  Users,
  Filter,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  Type,
  Moon,
  Sun,
  Loader2,
  AlertCircle,
  BookMarked,
  Sparkles,
  Network,
  Target,
  Globe
} from 'lucide-react'
import { MultiScaleView } from '@/components/innovations/multi_scale_view'
import { ResearchCanvas } from '@/components/innovations/research_canvas'

interface TextSegment {
  id: string
  original: string
  translations: {
    literal: string
    literary: string
    modern: string
    [key: string]: string
  }
  morphology: {
    word: string
    lemma: string
    pos: string
    features: string[]
  }[]
  commentary: string[]
  citations: string[]
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  themes: string[]
}

interface ReadingSession {
  id: string
  title: string
  author: string
  work: string
  segments: TextSegment[]
  collaborators: {
    id: string
    name: string
    avatar: string
    status: 'online' | 'offline'
  }[]
  annotations: {
    id: string
    userId: string
    segmentId: string
    content: string
    type: 'note' | 'question' | 'insight' | 'correction'
    timestamp: Date
  }[]
}

const ParallelViewPage = () => {
  const [currentSession, setCurrentSession] = useState<ReadingSession | null>(null)
  const [activeTranslation, setActiveTranslation] = useState('literary')
  const [showOriginal, setShowOriginal] = useState(true)
  const [highlightedWord, setHighlightedWord] = useState<string | null>(null)
  const [syncScroll, setSyncScroll] = useState(true)
  const [readingMode, setReadingMode] = useState<'parallel' | 'overlay' | 'focus'>('parallel')
  const [selectedSegment, setSelectedSegment] = useState<string | null>(null)
  const [showAnnotations, setShowAnnotations] = useState(true)
  const [aiAssistant, setAiAssistant] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [readingSpeed, setReadingSpeed] = useState(2)
  const [fontSize, setFontSize] = useState(16)
  const [theme, setTheme] = useState<'dark' | 'sepia' | 'light'>('dark')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<string[]>([])

  const originalRef = useRef<HTMLDivElement>(null)
  const translationRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll()
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0.8])

  // Mock data
  const mockSession: ReadingSession = {
    id: '1',
    title: 'Oedipus Rex - Opening Chorus',
    author: 'Sophocles',
    work: 'Oedipus Rex',
    segments: [
      {
        id: '1',
        original: 'ὦ γλυκεῖα θύγατερ Διός, τί ποτε παρὰ σῶν',
        translations: {
          literal: 'O sweet daughter of Zeus, what ever from you',
          literary: 'O sweet daughter of Zeus, what message do you bring',
          modern: 'Sweet child of Zeus, what news do you carry'
        },
        morphology: [
          { word: 'ὦ', lemma: 'ὦ', pos: 'interjection', features: ['vocative'] },
          { word: 'γλυκεῖα', lemma: 'γλυκύς', pos: 'adjective', features: ['feminine', 'nominative', 'singular'] }
        ],
        commentary: [
          'The opening invocation establishes the religious tone',
          'Note the use of γλυκεῖα - sweetness in bitter times'
        ],
        citations: ['Soph. OT 1'],
        difficulty: 'intermediate',
        themes: ['divine-intervention', 'prophecy', 'irony']
      },
      {
        id: '2',
        original: 'χρυσέας ἐλπίδος ἔρχεται φάτις;',
        translations: {
          literal: 'of golden hope comes a prophetic word?',
          literary: 'does word of golden hope arrive?',
          modern: 'do you bring us golden hope?'
        },
        morphology: [
          { word: 'χρυσέας', lemma: 'χρύσεος', pos: 'adjective', features: ['feminine', 'genitive', 'singular'] }
        ],
        commentary: [
          'The imagery of gold suggests divine blessing',
          'Hope and prophecy intertwined - typical of Sophocles'
        ],
        citations: ['Soph. OT 2'],
        difficulty: 'advanced',
        themes: ['hope', 'prophecy', 'divine-signs']
      }
    ],
    collaborators: [
      { id: '1', name: 'Dr. Sarah Chen', avatar: '/avatars/chen.jpg', status: 'online' },
      { id: '2', name: 'Marcus Thompson', avatar: '/avatars/thompson.jpg', status: 'online' },
      { id: '3', name: 'Prof. Elena Rossi', avatar: '/avatars/rossi.jpg', status: 'offline' }
    ],
    annotations: [
      {
        id: '1',
        userId: '1',
        segmentId: '1',
        content: 'Note the dramatic irony here - the audience knows what Oedipus does not',
        type: 'insight',
        timestamp: new Date()
      }
    ]
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentSession(mockSession)
      setLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  const handleSyncScroll = useCallback((source: 'original' | 'translation', scrollTop: number) => {
    if (!syncScroll) return
    
    const targetRef = source === 'original' ? translationRef : originalRef
    if (targetRef.current) {
      targetRef.current.scrollTop = scrollTop
    }
  }, [syncScroll])

  const handleWordHighlight = useCallback((word: string, segment: TextSegment) => {
    setHighlightedWord(word)
    setSelectedSegment(segment.id)
  }, [])

  const LoadingState = () => (
    <div className="min-h-screen bg-[#0D0D0F] flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center space-y-6"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="mx-auto w-16 h-16 border-2 border-[#C9A962]/20 border-t-[#C9A962] rounded-full"
        />
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-[#F5F3EF]">Loading Ancient Wisdom</h2>
          <p className="text-[#7C9885]">Preparing your immersive reading experience...</p>
        </div>
      </motion.div>
    </div>
  )

  const ErrorState = () => (
    <div className="min-h-screen bg-[#0D0D0F] flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-6 max-w-md"
      >
        <AlertCircle className="mx-auto w-16 h-16 text-red-400" />
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-[#F5F3EF]">Unable to Load Text</h2>
          <p className="text-[#7C9885]">{error}</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => window.location.reload()}
          className="px-6 py-3 bg-[#C9A962] text-[#0D0D0F] rounded-lg font-medium hover:bg-[#C9A962]/90 transition-colors"
        >
          Try Again
        </motion.button>
      </motion.div>
    </div>
  )

  if (loading) return <LoadingState />
  if (error) return <ErrorState />
  if (!currentSession) return <ErrorState />

  return (
    <div className="min-h-screen bg-[#0D0D0F] text-[#F5F3EF]">
      {/* Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="sticky top-0 z-50 bg-[#0D0D0F]/90 backdrop-blur-xl border-b border-white/10"
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <BookOpen className="w-8 h-8 text-[#C9A962]" />
                <div>
                  <h1 className="text-xl font-bold">LOGOS</h1>
                  <p className="text-xs text-[#7C9885]">Parallel Reader</p>
                </div>
              </div>
              <div className="h-8 w-px bg-white/10" />
              <div>
                <h2 className="font-semibold">{currentSession.title}</h2>
                <p className="text-sm text-[#7C9885]">{currentSession.author}</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {/* Collaborators */}
              <div className="flex -space-x-2">
                {currentSession.collaborators.map((collab) => (
                  <motion.div
                    key={collab.id}
                    whileHover={{ scale: 1.1, zIndex: 10 }}
                    className="relative"
                  >
                    <div className={`w-8 h-8 rounded-full bg-gradient-to-br from-[#C9A962] to-[#8B7355] flex items-center justify-center text-sm font-medium border-2 border-[#0D0D0F] ${collab.status === 'online' ? 'ring-2 ring-green-400/50' : ''}`}>
                      {collab.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    {collab.status === 'online' && (
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-[#0D0D0F]" />
                    )}
                  </motion.div>
                ))}
              </div>

              {/* Controls */}
              <div className="flex items-center space-x-1 bg-white/5 rounded-lg p-1">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsPlaying(!isPlaying)}
                  className={`p-2 rounded ${isPlaying ? 'bg-[#C9A962] text-[#0D0D0F]' : 'hover:bg-white/10'}`}
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSyncScroll(!syncScroll)}
                  className={`p-2 rounded ${syncScroll ? 'bg-[#7C9885] text-[#0D0D0F]' : 'hover:bg-white/10'}`}
                >
                  <MousePointer className="w-4 h-4" />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setAiAssistant(!aiAssistant)}
                  className={`p-2 rounded ${aiAssistant ? 'bg-purple-500 text-white' : 'hover:bg-white/10'}`}
                >
                  <Brain className="w-4 h-4" />
                </motion.button>
              </div>

              <Settings className="w-5 h-5 text-[#7C9885] hover:text-[#C9A962] cursor-pointer" />
            </div>
          </div>

          {/* Translation Controls */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-4 flex items-center justify-between"
          >
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Languages className="w-4 h-4 text-[#7C9885]" />
                <select
                  value={activeTranslation}
                  onChange={(e) => setActiveTranslation(e.target.value)}
                  className="bg-white/5 border border-white/10 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A962]/50"
                >
                  <option value="literal">Literal</option>
                  <option value="literary">Literary</option>
                  <option value="modern">Modern</option>
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <Eye className="w-4 h-4 text-[#7C9885]" />
                <select
                  value={readingMode}
                  onChange={(e) => setReadingMode(e.target.value as any)}
                  className="bg-white/5 border border-white/10 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A962]/50"
                >
                  <option value="parallel">Parallel</option>
                  <option value="overlay">Overlay</option>
                  <option value="focus">Focus</option>
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <Type className="w-4 h-4 text-[#7C9885]" />
                <input
                  type="range"
                  min="12"
                  max="24"
                  value={fontSize}
                  onChange={(e) => setFontSize(Number(e.target.value))}
                  className="w-20 accent-[#C9A962]"
                />
                <span className="text-xs text-[#7C9885]">{fontSize}px</span>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#7C9885]" />
                <input
                  type="text"
                  placeholder="Search across all texts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A962]/50 w-64"
                />
              </div>

              <div className="flex items-center space-x-1">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowAnnotations(!showAnnotations)}
                  className={`p-2 rounded ${showAnnotations ? 'bg-[#7C9885] text-[#0D0D0F]' : 'hover:bg-white/10'}`}
                >
                  <MessageSquare className="w-4 h-4" />
                </motion.button>

                <Bookmark className="w-4 h-4 text-[#7C9885] hover:text-[#C9A962] cursor-pointer" />
                <Share className="w-4 h-4 text-[#7C9885] hover:text-[#C9A962] cursor-pointer" />
              </div>
            </div>
          </motion.div>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-12 gap-8">
          {/* Main Reading Area */}
          <div className="col-span-8">
            <MultiScaleView
              data={{
                overview: 'Text Overview',
                details: currentSession.segments,
                connections: []
              }}
              onFocusChange={(item) => setSelectedSegment(item as string)}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden"
                style={{ opacity }}
              >
                {readingMode === 'parallel' && (
                  <div className="grid grid-cols-2 h-[70vh]">
                    {/* Original Text */}
                    <div
                      ref={originalRef}
                      className="p-8 border-r border-white/10 overflow-y-auto scrollbar-thin scrollbar-thumb-white/20"
                      onScroll={(e) => handleSyncScroll('original', e.currentTarget.scrollTop)}
                    >
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-[#C9A962]">Original Text</h3>
                        <div className="flex items-center space-x-2">
                          <Globe className="w-4 h-4 text-[#7C9885]" />
                          <span className="text-sm text-[#7C9885]">Ancient Greek</span>
                        </div>
                      </div>

                      <div className="space-y-6">
                        {currentSession.segments.map((segment, index) => (
                          <motion.div
                            key={segment.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className={`group cursor-pointer transition-all duration-200 ${
                              selectedSegment === segment.id 
                                ? 'bg-[#C9A962]/10 border border-[#C9A962]/30 rounded-lg' 
                                : 'hover:bg-white/5 rounded-lg'
                            }`}
                            onClick={() => setSelectedSegment(segment.id)}
                          >
                            <div className="p-4">
                              <div className="flex items-center justify-between mb-3">
                                <span className="text-xs text-[#7C9885] font-mono">
                                  {segment.citations[0]}
                                </span>
                                <div className="flex items-center space-x-1">
                                  <div className={`w-2 h-2 rounded-full ${
                                    segment.difficulty === 'beginner' ? 'bg-green-400' :
                                    segment.difficulty === 'intermediate' ? 'bg-yellow-400' : 'bg-red-400'
                                  }`} />
                                  <span className="text-xs text-[#7C9885] capitalize">
                                    {segment.difficulty}
                                  </span>
                                </div>
                              </div>

                              <p 
                                className="text-lg leading-relaxed font-serif"
                                style={{ fontSize: `${fontSize}px` }}
                              >
                                {segment.original.split(' ').map((word, wordIndex) => (
                                  <motion.span
                                    key={wordIndex}
                                    whileHover={{ scale: 1.05 }}
                                    className={`inline-block mr-2 cursor-pointer transition-all duration-200 ${
                                      highlightedWord === word 
                                        ? 'bg-[#C9A962] text-[#0D0D0F] px-1 rounded' 
                                        : 'hover:bg-[#C9A962]/20 hover:text-[#C9A962] px-1 rounded'
                                    }`}
                                    onClick={() => handleWordHighlight(word, segment)}
                                  >
                                    {word}
                                  </motion.span>
                                ))}
                              </p>

                              {showAnnotations && segment.themes.length > 0 && (
                                <div className="mt-3 flex flex-wrap gap-2">
                                  {segment.themes.map((theme) => (
                                    <span
                                      key={theme}
                                      className="px-2 py-1 text-xs bg-[#7C9885]/20 text-[#7C9885] rounded-full"
                                    >
                                      {theme.replace('-', ' ')}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {/* Translation */}
                    <div
                      ref={translationRef}
                      className="p-8 overflow-y-auto scrollbar-thin scrollbar-thumb-white/20"
                      onScroll={(e) => handleSyncScroll('translation', e.currentTarget.scrollTop)}
                    >
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-[#C9A962]">Translation</h3>
                        <div className="flex items-center space-x-2">
                          <Languages className="w-4 h-4 text-[#7C9885]" />
                          <span className="text-sm text-[#7C9885] capitalize">
                            {activeTranslation}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-6">
                        {currentSession.segments.map((segment, index) => (
                          <motion.div
                            key={`trans-${segment.id}`}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className={`group cursor-pointer transition-all duration-200 ${
                              selectedSegment === segment.id 
                                ? 'bg-[#C9A962]/10 border border-[#C9A962]/30 rounded-lg' 
                                : 'hover:bg-white/5 rounded-lg'
                            }`}
                            onClick={() => setSelectedSegment(segment.id)}
                          >
                            <div className="p-4">
                              <div className="flex items-center justify-between mb-3">
                                <span className="text-xs text-[#7C9885] font-mono">
                                  Translation {index + 1}
                                </span>
                                {aiAssistant && (
                                  <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="flex items-center space-x-1 text-purple-400"
                                  >
                                    <Sparkles className="w-3 h-3" />
                                    <span className="text-xs">AI Enhanced</span>
                                  </motion.div>
                                )}
                              </div>

                              <p 
                                className="text-lg leading-relaxed"
                                style={{ fontSize: `${fontSize}px` }}
                              >
                                {segment.translations[activeTranslation]}
                              </p>

                              {showAnnotations && segment.commentary.length > 0 && (
                                <div className="mt-4 space-y-2">
                                  {segment.commentary.map((comment, idx) => (
                                    <div
                                      key={idx}
                                      className="flex items-start space-x-2 p-3 bg-white/5 rounded-lg"
                                    >
                                      <MessageSquare className="w-4 h-4 text-[#7C9885] mt-0.5" />
                                      <p className="text-sm text-[#7C9885]">{comment}</p>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {readingMode === 'focus' && selectedSegment && (
                  <div className="p-8">
                    {(() => {
                      const segment = currentSession.segments.find(s => s.id === selectedSegment)
                      if (!segment) return null
                      
                      return (
                        <motion.div
                          key={selectedSegment}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="space-y-8"
                        >
                          <div className="text-center">
                            <h3 className="text-2xl font-bold text-[#C9A962] mb-2">Focus Mode</h3>
                            <p className="text-[#7C9885]">{segment.citations[0]}</p>
                          </div>

                          <div className="grid grid-cols-1 gap-8">
                            <div className="bg-white/5 rounded-xl p-6">
                              <h4 className="text-lg font-semibold text-[#C9A962] mb-4">Original</h4>
                              <p className="text-2xl leading-relaxed font-serif">
                                {segment.original}
                              </p>
                            </div>

                            <div className="bg-white/5 rounded-xl p-6">
                              <h4 className="text-lg font-semibold text-[#C9A962] mb-4">Translation</h4>
                              <p className="text-xl leading-relaxed">
                                {segment.translations[activeTranslation]}
                              </p>
                            </div>

                            <div className="bg-white/5 rounded-xl p-6">
                              <h4 className="text-lg font-semibold text-[#C9A962] mb-4">Analysis</h4>
                              <div className="space-y-4">
                                {segment.commentary.map((comment, idx) => (
                                  <div key={idx} className="flex items-start space-x-3">
                                    <Target className="w-5 h-5 text-[#7C9885] mt-0.5" />
                                    <p className="text-[#7C9885]">{comment}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>

                          <div className="flex justify-between">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => {
                                const currentIndex = currentSession.segments.findIndex(s => s.id === selectedSegment)
                                if (currentIndex > 0) {
                                  setSelectedSegment(currentSession.segments[currentIndex - 1].id)
                                }
                              }}
                              className="flex items-center space-x-2 px-6 py-3 bg-[#7C9885] text-[#0D0D0F] rounded-lg hover:bg-[#7C9885]/90"
                            >
                              <ChevronLeft className="w-4 h-4" />
                              <span>Previous</span>
                            </motion.button>

                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => setReadingMode('parallel')}
                              className="px-6 py-3 bg-[#C9A962] text-[#0D0D0F] rounded-lg hover:bg-[#C9A962]/90"
                            >
                              Back to Parallel View
                            </motion.button>

                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => {
                                const currentIndex = currentSession.segments.findIndex(s => s.id === selectedSegment)
                                if (currentIndex < currentSession.segments.length - 1) {
                                  setSelectedSegment(currentSession.segments[currentIndex + 1].id)
                                }
                              }}
                              className="flex items-center space-x-2 px-6 py-3 bg-[#7C9885] text-[#0D0D0F] rounded-lg hover:bg-[#7C9885]/90"
                            >
                              <span>Next</span>
                              <ChevronRight className="w-4 h-4" />
                            </motion.button>
                          </div>
                        </motion.div>
                      )
                    })()}
                  </div>
                )}
              </motion.div>
            </MultiScaleView>
          </div>

          {/* Sidebar */}
          <div className="col-span-4 space-y-6">
            {/* Research Canvas */}
            <ResearchCanvas
              nodes={[
                { id: '1', type: 'text', data: { title: 'Oedipus Rex', author: 'Sophocles' } },
                { id: '2', type: 'theme', data: { name: 'Fate vs Free Will' } },
                { id: '3', type: 'connection', data: { type: 'thematic', strength: 0.9 } }
              ]}
              edges={[
                { id: '1-2', source: '1', target: '2' }
              ]}
              onNodeSelect={(node) => console.log('Selected node:', node)}
            >
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-6"
              >
                <h3 className="text-lg font-semibold text-[#C9A962] mb-4 flex items-center">
                  <Network className="w-5 h-5 mr-2" />
                  Research Map
                </h3>
                <div className="text-center text-[#7C9885] py-8">
                  <p>Interactive research connections will appear here</p>
                </div>
              </motion.div>
            </ResearchCanvas>

            {/* Word Analysis */}
            {highlightedWord && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-6"
              >
                <h3 className="text-lg font-semibold text-[#C9A962] mb-4 flex items-center">
                  <Zap className="w-5 h-5 mr-2" />
                  Word Analysis
                </h3>
                <div className="space-y-4">
                  <div className="bg-white/5 rounded-lg p-4">
                    <h4 className="font-semibold text-[#C9A962] text-xl mb-2">
                      {highlightedWord}
                    </h4>
                    <p className="text-sm text-[#7C9885]">
                      Morphological analysis and contextual information
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Annotations */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-6"
            >
              <h3 className="text-lg font-semibold text-[#C9A962] mb-4 flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Collaborative Notes
              </h3>
              <div className="space-y-4">
                {currentSession.annotations.map((annotation) => (
                  <motion.div
                    key={annotation.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-white/5 rounded-lg p-4"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-sm font-medium text-[#C9A962]">
                        {currentSession.collaborators.find(c => c.id === annotation.userId)?.name || 'Unknown'}
                      </span>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        annotation.type === 'insight' ? 'bg-purple-500/20 text-purple-300' :
                        annotation.type === 'question' ? 'bg-blue-500/20 text-blue-300' :
                        annotation.type === 'correction' ? 'bg-red-500/20 text-red-300' :
                        'bg-green-500/20 text-green-300'
                      }`}>
                        {annotation.type}
                      </span>
                    </div>
                    <p className="text-sm text-[#7C9885]">{annotation.content}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* AI Assistant */}
            <AnimatePresence>
              {aiAssistant && (
                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 20, scale: 0.95 }}
                  className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 backdrop-blur-xl rounded-xl border border-purple-500/20 p-6"
                >
                  <h3 className="text-lg font-semibold text-purple-300 mb-4 flex items-center">
                    <Brain className="w-5 h-5 mr-2" />
                    AI Reading Assistant
                  </h3>
                  <div className="space-y-4">
                    <div className="bg-white/5 rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        <Sparkles className="w-5 h-5 text-purple-400 mt-0.5" />
                        <div>
                          <p className="text-sm text-purple-200 mb-2">
                            <strong>Insight:</strong> This passage shows Sophocles' characteristic use of dramatic irony...
                          </p>
                          <button className="text-xs text-purple-400 hover:text-purple-300">
                            Show similar passages →
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <motion.div
        className="fixed bottom-0 left-0 right-0 h-1 bg-[#C9A962]/20"
        style={{ transformOrigin: "0%", scaleX: scrollYProgress }}
      >
        <motion.div
          className="h-full bg-[#C9A962]"
          style={{ scaleX: scrollYProgress }}
        />
      </motion.div>
    </div>
  )
}

export default ParallelViewPage
