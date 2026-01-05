'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import { 
  BookOpen, 
  MessageSquare, 
  Users, 
  Share2, 
  Search, 
  Layers,
  Eye,
  EyeOff,
  Plus,
  Filter,
  ChevronDown,
  ChevronRight,
  Bookmark,
  Clock,
  Star,
  MessageCircle,
  Lightbulb,
  Quote,
  Link2,
  Type,
  Palette,
  Settings,
  Play,
  Pause,
  Volume2,
  Languages,
  Brain,
  Network,
  Sparkles,
  Target,
  User,
  Crown,
  School
} from 'lucide-react'
import { MultiScaleView } from '@/components/innovations/multi_scale_view'
import { ResearchCanvas } from '@/components/innovations/research_canvas'

interface Annotation {
  id: string
  type: 'personal' | 'commentary' | 'collaborative' | 'ai'
  author: string
  text: string
  selection: string
  position: { start: number; end: number }
  timestamp: Date
  likes: number
  replies: number
  tags: string[]
  isHighlighted: boolean
}

interface CommentaryLayer {
  id: string
  name: string
  author: string
  type: 'classical' | 'modern' | 'pedagogical' | 'linguistic'
  isActive: boolean
  color: string
  annotationCount: number
}

interface ReadingSession {
  text: string
  title: string
  author: string
  section: string
  progress: number
  annotations: Annotation[]
  vocabularyLevel: number
  readingMode: 'study' | 'research' | 'casual'
}

interface AIInsight {
  id: string
  type: 'translation' | 'morphology' | 'context' | 'intertextual'
  content: string
  confidence: number
  isVisible: boolean
}

const LogosReader: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [readingSession, setReadingSession] = useState<ReadingSession | null>(null)
  const [commentaryLayers, setCommentaryLayers] = useState<CommentaryLayer[]>([])
  const [activeAnnotations, setActiveAnnotations] = useState<Annotation[]>([])
  const [selectedText, setSelectedText] = useState<string>('')
  const [showAnnotationPanel, setShowAnnotationPanel] = useState(false)
  const [annotationMode, setAnnotationMode] = useState<'view' | 'edit' | 'collaborate'>('view')
  const [readingPreferences, setReadingPreferences] = useState({
    fontSize: 18,
    lineHeight: 1.6,
    showMorphology: true,
    aiAssistance: true,
    immersiveMode: false,
    audioEnabled: false,
    translationHints: true
  })
  const [aiInsights, setAiInsights] = useState<AIInsight[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [intertextualConnections, setIntertextualConnections] = useState<any[]>([])
  const [showConnectionsMap, setShowConnectionsMap] = useState(false)

  const readerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ container: readerRef })
  const readingProgress = useTransform(scrollYProgress, [0, 1], [0, 100])

  // Initialize reading session
  useEffect(() => {
    const initializeReader = async () => {
      try {
        setIsLoading(true)
        
        // Simulate loading ancient text with annotations
        await new Promise(resolve => setTimeout(resolve, 1500))
        
        const mockSession: ReadingSession = {
          text: `Ἄνδρα μοι ἔννεπε, μοῦσα, πολύτροπον, ὃς μάλα πολλὰ
πλάγχθη, ἐπεὶ Τροίης ἱερὸν πτολίεθρον ἔπερσεν·
πολλῶν δ᾽ ἀνθρώπων ἴδεν ἄστεα καὶ νόον ἔγνω,
πολλὰ δ᾽ ὅ γ᾽ ἐν πόντῳ πάθεν ἄλγεα ὃν κατὰ θυμόν,
ἀρνύμενος ἥν τε ψυχὴν καὶ νόστον ἑταίρων.
ἀλλ᾽ οὐδ᾽ ὧς ἑτάρους ἐρρύσατο, ἱέμενός περ·
αὐτῶν γὰρ σφετέρῃσιν ἀτασθαλίῃσιν ὄλοντο,
νήπιοι, οἳ κατὰ βοῦς Ὑπερίονος Ἠελίοιο
ἤσθιον· αὐτὰρ ὁ τοῖσιν ἀφείλετο νόστιμον ἦμαρ.
τῶν ἁμόθεν γε, θεά, θύγατερ Διός, εἰπὲ καὶ ἡμῖν.`,
          title: "Odyssey",
          author: "Homer",
          section: "Book 1, Lines 1-10",
          progress: 15,
          annotations: [],
          vocabularyLevel: 7,
          readingMode: 'study'
        }
        
        const mockCommentaryLayers: CommentaryLayer[] = [
          {
            id: 'stanford',
            name: 'Stanford Commentary',
            author: 'R.B. Rutherford',
            type: 'classical',
            isActive: true,
            color: '#C9A962',
            annotationCount: 47
          },
          {
            id: 'cambridge',
            name: 'Cambridge Companion',
            author: 'Various',
            type: 'modern',
            isActive: false,
            color: '#7C9885',
            annotationCount: 23
          },
          {
            id: 'pedagogical',
            name: 'Student Notes',
            author: 'Dr. Sarah Chen',
            type: 'pedagogical',
            isActive: true,
            color: '#8B7355',
            annotationCount: 89
          },
          {
            id: 'linguistic',
            name: 'Morphological Analysis',
            author: 'AI Assistant',
            type: 'linguistic',
            isActive: false,
            color: '#A77B5B',
            annotationCount: 156
          }
        ]
        
        const mockAnnotations: Annotation[] = [
          {
            id: '1',
            type: 'commentary',
            author: 'R.B. Rutherford',
            text: 'The opening invocation follows the traditional epic formula, but Homer\'s choice of πολύτροπον immediately establishes Odysseus\'s defining characteristic.',
            selection: 'Ἄνδρα μοι ἔννεπε, μοῦσα, πολύτροπον',
            position: { start: 0, end: 35 },
            timestamp: new Date(),
            likes: 24,
            replies: 7,
            tags: ['invocation', 'epic-formula', 'characterization'],
            isHighlighted: true
          },
          {
            id: '2',
            type: 'personal',
            author: 'You',
            text: 'Note the emphasis on wandering and suffering - sets up the entire narrative structure',
            selection: 'πλάγχθη',
            position: { start: 65, end: 72 },
            timestamp: new Date(),
            likes: 0,
            replies: 0,
            tags: ['theme', 'structure'],
            isHighlighted: false
          },
          {
            id: '3',
            type: 'ai',
            author: 'AI Analysis',
            text: 'This passage contains 15 unique vocabulary items. Based on your learning history, you may need review of: πτολίεθρον (citadel), ἀτασθαλίῃσιν (recklessness).',
            selection: 'Τροίης ἱερὸν πτολίεθρον',
            position: { start: 85, end: 105 },
            timestamp: new Date(),
            likes: 12,
            replies: 2,
            tags: ['vocabulary', 'learning'],
            isHighlighted: false
          }
        ]

        const mockAIInsights: AIInsight[] = [
          {
            id: 'morphology-1',
            type: 'morphology',
            content: 'πολύτροπον: acc. sing. masc. of πολύτροπος - "of many ways/turns"',
            confidence: 0.96,
            isVisible: false
          },
          {
            id: 'context-1',
            type: 'context',
            content: 'This opening echoes the Iliad\'s structure but immediately differentiates through focus on individual journey vs. collective war.',
            confidence: 0.89,
            isVisible: false
          },
          {
            id: 'intertextual-1',
            type: 'intertextual',
            content: 'Found 23 similar passages across corpus discussing heroic wandering and divine intervention.',
            confidence: 0.94,
            isVisible: false
          }
        ]

        setReadingSession(mockSession)
        setCommentaryLayers(mockCommentaryLayers)
        setActiveAnnotations(mockAnnotations)
        setAiInsights(mockAIInsights)
        
        setIsLoading(false)
      } catch (err) {
        setError('Failed to load reading session')
        setIsLoading(false)
      }
    }

    initializeReader()
  }, [])

  const handleTextSelection = () => {
    const selection = window.getSelection()
    if (selection && selection.toString().trim()) {
      setSelectedText(selection.toString())
      setShowAnnotationPanel(true)
    }
  }

  const createAnnotation = async (text: string, type: Annotation['type']) => {
    if (!selectedText || !readingSession) return

    const newAnnotation: Annotation = {
      id: Date.now().toString(),
      type,
      author: 'You',
      text,
      selection: selectedText,
      position: { start: 0, end: selectedText.length },
      timestamp: new Date(),
      likes: 0,
      replies: 0,
      tags: [],
      isHighlighted: true
    }

    setActiveAnnotations(prev => [...prev, newAnnotation])
    setShowAnnotationPanel(false)
    setSelectedText('')
  }

  const toggleCommentaryLayer = (layerId: string) => {
    setCommentaryLayers(prev => 
      prev.map(layer => 
        layer.id === layerId 
          ? { ...layer, isActive: !layer.isActive }
          : layer
      )
    )
  }

  const handleSemanticSearch = async (query: string) => {
    setIsSearching(true)
    setSearchQuery(query)
    
    // Simulate AI-powered semantic search
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const mockConnections = [
      {
        text: 'Similar heroic journey themes in Aeneid 1.1-11',
        similarity: 0.89,
        source: 'Virgil, Aeneid'
      },
      {
        text: 'Divine intervention patterns in Apollonius 1.1-22',
        similarity: 0.76,
        source: 'Apollonius, Argonautica'
      }
    ]
    
    setIntertextualConnections(mockConnections)
    setIsSearching(false)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0D0D0F] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-[#C9A962]/20 border-t-[#C9A962] rounded-full mx-auto mb-4"
          />
          <p className="text-[#F5F3EF] text-lg">Loading ancient wisdom...</p>
          <p className="text-[#7C9885] text-sm mt-2">Preparing immersive reading experience</p>
        </motion.div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0D0D0F] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center bg-red-500/10 backdrop-blur-xl border border-red-500/20 rounded-2xl p-8 max-w-md"
        >
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-8 h-8 text-red-400" />
          </div>
          <h3 className="text-xl font-bold text-[#F5F3EF] mb-2">Reading Session Error</h3>
          <p className="text-red-400 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-[#C9A962] text-black rounded-lg hover:bg-[#C9A962]/80 transition-colors"
          >
            Retry Loading
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
        className="sticky top-0 z-50 bg-[#0D0D0F]/80 backdrop-blur-xl border-b border-white/10"
      >
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center space-x-3"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-[#C9A962] to-[#8B7355] rounded-lg flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-black" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-[#C9A962]">LOGOS</h1>
                  <p className="text-xs text-[#7C9885]">READER</p>
                </div>
              </motion.div>

              {readingSession && (
                <div className="hidden md:flex items-center space-x-4 text-sm">
                  <span className="text-[#F5F3EF] font-medium">{readingSession.author}</span>
                  <span className="text-[#7C9885]">•</span>
                  <span className="text-[#7C9885]">{readingSession.title}</span>
                  <span className="text-[#7C9885]">•</span>
                  <span className="text-[#8B7355]">{readingSession.section}</span>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-4">
              {/* Reading Progress */}
              <div className="hidden md:flex items-center space-x-2">
                <Clock className="w-4 h-4 text-[#7C9885]" />
                <div className="w-24 h-2 bg-white/10 rounded-full">
                  <motion.div
                    className="h-full bg-[#C9A962] rounded-full"
                    style={{ width: `${readingSession?.progress || 0}%` }}
                  />
                </div>
                <span className="text-xs text-[#7C9885]">{readingSession?.progress}%</span>
              </div>

              {/* Quick Actions */}
              <div className="flex items-center space-x-2">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowConnectionsMap(!showConnectionsMap)}
                  className="p-2 bg-white/5 hover:bg-[#C9A962]/20 rounded-lg transition-colors"
                >
                  <Network className="w-4 h-4 text-[#C9A962]" />
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setReadingPreferences(prev => ({ ...prev, aiAssistance: !prev.aiAssistance }))}
                  className="p-2 bg-white/5 hover:bg-[#7C9885]/20 rounded-lg transition-colors"
                >
                  <Brain className={`w-4 h-4 ${readingPreferences.aiAssistance ? 'text-[#7C9885]' : 'text-white/40'}`} />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 bg-white/5 hover:bg-[#8B7355]/20 rounded-lg transition-colors"
                >
                  <Settings className="w-4 h-4 text-[#8B7355]" />
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      <div className="flex">
        {/* Sidebar - Commentary Layers */}
        <motion.aside
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-80 bg-white/5 backdrop-blur-xl border-r border-white/10 h-screen sticky top-16 overflow-y-auto"
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-[#C9A962]">Commentary Layers</h2>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 bg-[#C9A962]/20 rounded-lg"
              >
                <Plus className="w-4 h-4 text-[#C9A962]" />
              </motion.button>
            </div>

            <div className="space-y-3 mb-8">
              {commentaryLayers.map((layer) => (
                <motion.div
                  key={layer.id}
                  layout
                  className="bg-white/5 rounded-xl p-4 border border-white/10"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => toggleCommentaryLayer(layer.id)}
                        className={`w-4 h-4 rounded-full border-2 ${
                          layer.isActive 
                            ? 'bg-[#C9A962] border-[#C9A962]' 
                            : 'border-white/30'
                        }`}
                      />
                      <div>
                        <h3 className="font-medium text-sm">{layer.name}</h3>
                        <p className="text-xs text-[#7C9885]">{layer.author}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-[#8B7355]">{layer.annotationCount}</span>
                      <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: layer.color }} />
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-xs">
                    <span className={`px-2 py-1 rounded-full ${
                      layer.type === 'classical' ? 'bg-[#C9A962]/20 text-[#C9A962]' :
                      layer.type === 'modern' ? 'bg-[#7C9885]/20 text-[#7C9885]' :
                      layer.type === 'pedagogical' ? 'bg-[#8B7355]/20 text-[#8B7355]' :
                      'bg-purple-500/20 text-purple-400'
                    }`}>
                      {layer.type === 'classical' && <Crown className="w-3 h-3 inline mr-1" />}
                      {layer.type === 'modern' && <Star className="w-3 h-3 inline mr-1" />}
                      {layer.type === 'pedagogical' && <School className="w-3 h-3 inline mr-1" />}
                      {layer.type === 'linguistic' && <Type className="w-3 h-3 inline mr-1" />}
                      {layer.type}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Semantic Search */}
            <div className="mb-8">
              <h3 className="text-lg font-bold text-[#7C9885] mb-4">Semantic Discovery</h3>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Find concepts across corpus..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSemanticSearch(searchQuery)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pr-12 text-sm placeholder-white/40 focus:outline-none focus:border-[#7C9885]/50"
                />
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleSemanticSearch(searchQuery)}
                  disabled={isSearching}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-[#7C9885] hover:text-[#C9A962] transition-colors"
                >
                  {isSearching ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <Search className="w-4 h-4" />
                    </motion.div>
                  ) : (
                    <Search className="w-4 h-4" />
                  )}
                </motion.button>
              </div>

              {intertextualConnections.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 space-y-2"
                >
                  {intertextualConnections.map((connection, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.02 }}
                      className="bg-white/5 rounded-lg p-3 border border-[#7C9885]/20 cursor-pointer"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-[#7C9885]">{connection.source}</span>
                        <span className="text-xs text-[#C9A962]">{Math.round(connection.similarity * 100)}%</span>
                      </div>
                      <p className="text-sm">{connection.text}</p>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </div>

            {/* AI Insights */}
            {readingPreferences.aiAssistance && (
              <div>
                <h3 className="text-lg font-bold text-[#8B7355] mb-4 flex items-center">
                  <Sparkles className="w-5 h-5 mr-2" />
                  AI Insights
                </h3>
                <div className="space-y-3">
                  {aiInsights.map((insight) => (
                    <motion.div
                      key={insight.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="bg-white/5 rounded-lg p-3 border border-white/10"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          insight.type === 'morphology' ? 'bg-blue-500/20 text-blue-400' :
                          insight.type === 'context' ? 'bg-green-500/20 text-green-400' :
                          insight.type === 'translation' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-purple-500/20 text-purple-400'
                        }`}>
                          {insight.type}
                        </span>
                        <span className="text-xs text-[#7C9885]">
                          {Math.round(insight.confidence * 100)}%
                        </span>
                      </div>
                      <p className="text-sm">{insight.content}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.aside>

        {/* Main Reading Area */}
        <div className="flex-1 flex">
          <motion.main
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1 p-8"
            ref={readerRef}
          >
            {/* Reading Controls */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 flex items-center justify-between"
            >
              <div className="flex items-center space-x-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setReadingPreferences(prev => ({ ...prev, immersiveMode: !prev.immersiveMode }))}
                  className={`px-4 py-2 rounded-xl text-sm transition-all ${
                    readingPreferences.immersiveMode
                      ? 'bg-[#C9A962] text-black'
                      : 'bg-white/5 border border-white/10 text-[#F5F3EF] hover:bg-white/10'
                  }`}
                >
                  <Eye className="w-4 h-4 inline mr-2" />
                  Immersive Mode
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setReadingPreferences(prev => ({ ...prev, audioEnabled: !prev.audioEnabled }))}
                  className={`px-4 py-2 rounded-xl text-sm transition-all ${
                    readingPreferences.audioEnabled
                      ? 'bg-[#7C9885] text-black'
                      : 'bg-white/5 border border-white/10 text-[#F5F3EF] hover:bg-white/10'
                  }`}
                >
                  <Volume2 className="w-4 h-4 inline mr-2" />
                  Audio
                </motion.button>

                <div className="flex items-center space-x-2">
                  <Type className="w-4 h-4 text-[#8B7355]" />
                  <input
                    type="range"
                    min="14"
                    max="24"
                    value={readingPreferences.fontSize}
                    onChange={(e) => setReadingPreferences(prev => ({ ...prev, fontSize: parseInt(e.target.value) }))}
                    className="w-20"
                  />
                  <span className="text-sm text-[#8B7355]">{readingPreferences.fontSize}px</span>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 bg-white/5 hover:bg-[#C9A962]/20 rounded-lg transition-colors"
                >
                  <Bookmark className="w-4 h-4 text-[#C9A962]" />
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 bg-white/5 hover:bg-[#7C9885]/20 rounded-lg transition-colors"
                >
                  <Share2 className="w-4 h-4 text-[#7C9885]" />
                </motion.button>
              </div>
            </motion.div>

            {/* Text Content with Multi-Scale View */}
            <div className="max-w-4xl mx-auto">
              <MultiScaleView
                data={{
                  text: readingSession?.text || '',
                  annotations: activeAnnotations,
                  fontSize: readingPreferences.fontSize,
                  lineHeight: readingPreferences.lineHeight
                }}
                onTextSelection={handleTextSelection}
                className="leading-relaxed"
              >
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="prose prose-invert max-w-none"
                  style={{ 
                    fontSize: `${readingPreferences.fontSize}px`,
                    lineHeight: readingPreferences.lineHeight 
                  }}
                >
                  <div 
                    className="text-[#F5F3EF] leading-relaxed whitespace-pre-line selection:bg-[#C9A962]/20"
                    onMouseUp={handleTextSelection}
                    style={{
                      fontFamily: 'Georgia, serif',
                      letterSpacing: '0.02em'
                    }}
                  >
                    {readingSession?.text}
                  </div>
                </motion.div>
              </MultiScaleView>
            </div>

            {/* Inline Annotations Display */}
            <AnimatePresence>
              {activeAnnotations.filter(ann => 
                commentaryLayers.find(layer => layer.isActive)?.type === 
                (ann.type === 'commentary' ? 'classical' : 
                 ann.type === 'personal' ? 'modern' : 
                 ann.type === 'ai' ? 'linguistic' : 'pedagogical')
              ).map((annotation) => (
                <motion.div
                  key={annotation.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="mt-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        annotation.type === 'commentary' ? 'bg-[#C9A962]/20' :
                        annotation.type === 'personal' ? 'bg-[#7C9885]/20' :
                        annotation.type === 'ai' ? 'bg-purple-500/20' :
                        'bg-[#8B7355]/20'
                      }`}>
                        {annotation.type === 'commentary' && <Crown className="w-5 h-5 text-[#C9A962]" />}
                        {annotation.type === 'personal' && <User className="w-5 h-5 text-[#7C9885]" />}
                        {annotation.type === 'ai' && <Brain className="w-5 h-5 text-purple-400" />}
                        {annotation.type === 'collaborative' && <Users className="w-5 h-5 text-[#8B7355]" />}
                      </div>
                      <div>
                        <h4 className="font-medium text-[#F5F3EF]">{annotation.author}</h4>
                        <p className="text-sm text-[#7C9885]">
                          {annotation.timestamp.toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2 text-[#7C9885] hover:text-[#C9A962] transition-colors"
                      >
                        <Star className="w-4 h-4" />
                      </motion.button>
                      <span className="text-sm text-[#8B7355]">{annotation.likes}</span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="text-sm text-[#C9A962] mb-2 font-mono bg-[#C9A962]/10 rounded-lg px-3 py-1 inline-block">
                      "{annotation.selection}"
                    </div>
                    <p className="text-[#F5F3EF]">{annotation.text}</p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {annotation.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs px-2 py-1 bg-white/10 rounded-full text-[#7C9885]"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center space-x-4">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="text-sm text-[#8B7355] hover:text-[#C9A962] transition-colors flex items-center"
                      >
                        <MessageCircle className="w-4 h-4 mr-1" />
                        {annotation.replies} replies
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="text-sm text-[#8B7355] hover:text-[#C9A962] transition-colors flex items-center"
                      >
                        <Share2 className="w-4 h-4 mr-1" />
                        Share
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.main>

          {/* Research Canvas Panel */}
          <AnimatePresence>
            {showConnectionsMap && (
              <motion.div
                initial={{ opacity: 0, x: 300 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 300 }}
                className="w-96 bg-white/5 backdrop-blur-xl border-l border-white/10"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-[#C9A962]">Research Canvas</h3>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setShowConnectionsMap(false)}
                      className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </motion.button>
                  </div>

                  <ResearchCanvas
                    nodes={[
                      {
                        id: 'odyssey-opening',
                        type: 'text',
                        content: 'Odyssey Opening',
                        x: 50,
                        y: 50
                      },
                      {
                        id: 'heroic-journey',
                        type: 'concept',
                        content: 'Heroic Journey Theme',
                        x: 200,
                        y: 100
                      },
                      {
                        id: 'aeneid-parallel',
                        type: 'reference',
                        content: 'Aeneid I.1-11',
                        x: 150,
                        y: 200
                      }
                    ]}
                    connections={[
                      { from: 'odyssey-opening', to: 'heroic-journey' },
                      { from: 'heroic-journey', to: 'aeneid-parallel' }
                    ]}
                    onNodeSelect={(node) => console.log('Selected node:', node)}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Annotation Creation Panel */}
      <AnimatePresence>
        {showAnnotationPanel && selectedText && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          >
            <motion.div
              initial={{ y: 20 }}
              animate={{ y: 0 }}
              className="bg-[#0D0D0F]/95 backdrop-blur-xl border border-white/20 rounded-2xl p-6 max-w-lg w-full mx-4"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-[#C9A962]">Add Annotation</h3>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowAnnotationPanel(false)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  ×
                </motion.button>
              </div>

              <div className="mb-4">
                <p className="text-sm text-[#7C9885] mb-2">Selected text:</p>
                <div className="bg-[#C9A962]/10 rounded-lg p-3 font-mono text-[#C9A962]">
                  "{selectedText}"
                </div>
              </div>

              <textarea
                placeholder="Share your insights..."
                className="w-full h-32 bg-white/5 border border-white/10 rounded-xl p-4 text-sm placeholder-white/40 focus:outline-none focus:border-[#C9A962]/50 resize-none"
              />

              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => createAnnotation('Personal note', 'personal')}
                    className="px-3 py-1 bg-[#7C9885]/20 text-[#7C9885] rounded-lg text-sm hover:bg-[#7C9885]/30 transition-colors"
                  >
                    Personal
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => createAnnotation('Shared insight', 'collaborative')}
                    className="px-3 py-1 bg-[#8B7355]/20 text-[#8B7355] rounded-lg text-sm hover:bg-[#8B7355]/30 transition-colors"
                  >
                    Share
                  </motion.button>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => createAnnotation('New annotation', 'personal')}
                  className="px-4 py-2 bg-[#C9A962] text-black rounded-lg hover:bg-[#C9A962]/80 transition-colors"
                >
                  Save
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default LogosReader
