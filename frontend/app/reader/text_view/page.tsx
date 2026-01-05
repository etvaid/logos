'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  BookOpen, 
  Settings, 
  MessageSquare, 
  Search, 
  Eye, 
  EyeOff, 
  Volume2, 
  Bookmark, 
  Share2, 
  ChevronLeft, 
  ChevronRight, 
  Layers, 
  Zap, 
  Brain, 
  Users, 
  Filter,
  RotateCcw,
  Lightbulb,
  Sparkles,
  Target,
  ArrowRight,
  Globe,
  Library
} from 'lucide-react'
import { MultiScaleView } from '@/components/innovations/multi_scale_view'
import { ResearchCanvas } from '@/components/innovations/research_canvas'

interface TextSegment {
  id: string
  greek: string
  latin: string
  english: string
  morphology?: {
    lemma: string
    pos: string
    case?: string
    number?: string
    gender?: string
    tense?: string
    voice?: string
    mood?: string
  }
  difficulty: number
  notes: Note[]
  connections: Connection[]
}

interface Note {
  id: string
  content: string
  author: string
  timestamp: Date
  type: 'personal' | 'scholarly' | 'pedagogical'
  highlight?: boolean
}

interface Connection {
  id: string
  targetText: string
  type: 'intertextual' | 'thematic' | 'linguistic'
  similarity: number
}

interface ReadingText {
  id: string
  title: string
  author: string
  citation: string
  segments: TextSegment[]
}

const SAMPLE_TEXT: ReadingText = {
  id: 'homer-iliad-1',
  title: 'Iliad',
  author: 'Homer',
  citation: 'Book 1, Lines 1-10',
  segments: [
    {
      id: 'seg-1',
      greek: 'μῆνιν',
      latin: 'menin',
      english: 'rage',
      morphology: {
        lemma: 'μῆνις',
        pos: 'noun',
        case: 'accusative',
        number: 'singular',
        gender: 'feminine'
      },
      difficulty: 3,
      notes: [
        {
          id: 'note-1',
          content: 'The opening word establishes the central theme of divine wrath',
          author: 'Prof. Wilson',
          timestamp: new Date(),
          type: 'scholarly'
        }
      ],
      connections: [
        {
          id: 'conn-1',
          targetText: 'Aeschylus, Agamemnon 155',
          type: 'thematic',
          similarity: 0.85
        }
      ]
    },
    {
      id: 'seg-2',
      greek: 'ἄειδε',
      latin: 'aeide',
      english: 'sing',
      morphology: {
        lemma: 'ἀείδω',
        pos: 'verb',
        tense: 'present',
        voice: 'active',
        mood: 'imperative'
      },
      difficulty: 2,
      notes: [],
      connections: []
    },
    {
      id: 'seg-3',
      greek: 'θεὰ',
      latin: 'thea',
      english: 'goddess',
      morphology: {
        lemma: 'θεά',
        pos: 'noun',
        case: 'vocative',
        number: 'singular',
        gender: 'feminine'
      },
      difficulty: 1,
      notes: [],
      connections: []
    }
  ]
}

export default function TextViewPage() {
  const [currentText, setCurrentText] = useState<ReadingText>(SAMPLE_TEXT)
  const [selectedWord, setSelectedWord] = useState<TextSegment | null>(null)
  const [difficulty, setDifficulty] = useState(2)
  const [showMorphology, setShowMorphology] = useState(true)
  const [showConnections, setShowConnections] = useState(false)
  const [annotationLayer, setAnnotationLayer] = useState<'personal' | 'scholarly' | 'all'>('all')
  const [fontSize, setFontSize] = useState(18)
  const [lineHeight, setLineHeight] = useState(1.8)
  const [isLoading, setIsLoading] = useState(false)
  const [readingMode, setReadingMode] = useState<'immersive' | 'analytical' | 'collaborative'>('immersive')
  const [aiInsights, setAiInsights] = useState<string[]>([])
  const [showAiPanel, setShowAiPanel] = useState(false)
  const [progress, setProgress] = useState(0)
  const textRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Simulate AI insights loading
    const timer = setTimeout(() => {
      setAiInsights([
        'This opening invocation follows the traditional epic formula',
        '3 related passages found in Virgil\'s Aeneid',
        'Vocabulary difficulty: Intermediate (B2 level)',
        'Metrical pattern: Dactylic hexameter detected'
      ])
    }, 2000)
    return () => clearTimeout(timer)
  }, [currentText])

  const handleWordClick = useCallback((segment: TextSegment) => {
    setSelectedWord(segment)
    setShowAiPanel(true)
  }, [])

  const getFilteredNotes = useCallback((notes: Note[]) => {
    if (annotationLayer === 'all') return notes
    return notes.filter(note => note.type === annotationLayer)
  }, [annotationLayer])

  const shouldShowWord = useCallback((segment: TextSegment) => {
    return segment.difficulty <= difficulty
  }, [difficulty])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0D0D0F] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 border-4 border-[#C9A962]/20 border-t-[#C9A962] rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#F5F3EF]/60">Loading ancient wisdom...</p>
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
        className="border-b border-white/10 bg-white/5 backdrop-blur-xl sticky top-0 z-40"
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-2"
              >
                <BookOpen className="h-6 w-6 text-[#C9A962]" />
                <div>
                  <h1 className="text-xl font-bold">{currentText.title}</h1>
                  <p className="text-sm text-[#F5F3EF]/60">{currentText.author} • {currentText.citation}</p>
                </div>
              </motion.div>
            </div>

            <div className="flex items-center gap-3">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-white/5 backdrop-blur-xl rounded-lg px-3 py-1 border border-white/10"
              >
                <span className="text-sm text-[#C9A962]">{Math.round(progress)}% complete</span>
              </motion.div>

              <div className="flex items-center gap-2 bg-white/5 backdrop-blur-xl rounded-lg p-1 border border-white/10">
                {(['immersive', 'analytical', 'collaborative'] as const).map((mode) => (
                  <motion.button
                    key={mode}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setReadingMode(mode)}
                    className={`px-3 py-1 rounded text-sm transition-colors ${
                      readingMode === mode
                        ? 'bg-[#C9A962] text-[#0D0D0F]'
                        : 'text-[#F5F3EF]/60 hover:text-[#F5F3EF]'
                    }`}
                  >
                    {mode === 'immersive' && <Eye className="h-4 w-4" />}
                    {mode === 'analytical' && <Brain className="h-4 w-4" />}
                    {mode === 'collaborative' && <Users className="h-4 w-4" />}
                  </motion.button>
                ))}
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 bg-white/5 backdrop-blur-xl rounded-lg border border-white/10 hover:bg-white/10 transition-colors"
              >
                <Settings className="h-5 w-5" />
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>

      <div className="flex">
        {/* Main Reading Area */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`flex-1 ${selectedWord ? 'lg:mr-96' : ''} transition-all duration-300`}
        >
          <div className="max-w-4xl mx-auto px-6 py-8">
            {/* Reading Controls */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-wrap items-center gap-4 mb-8 p-4 bg-white/5 backdrop-blur-xl rounded-xl border border-white/10"
            >
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-[#C9A962]" />
                <span className="text-sm">Difficulty:</span>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <motion.button
                      key={level}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setDifficulty(level)}
                      className={`w-3 h-3 rounded-full transition-colors ${
                        level <= difficulty ? 'bg-[#C9A962]' : 'bg-white/20'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Layers className="h-4 w-4 text-[#7C9885]" />
                <select
                  value={annotationLayer}
                  onChange={(e) => setAnnotationLayer(e.target.value as any)}
                  className="bg-white/10 border border-white/20 rounded px-2 py-1 text-sm"
                >
                  <option value="all">All Notes</option>
                  <option value="personal">Personal</option>
                  <option value="scholarly">Scholarly</option>
                </select>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowMorphology(!showMorphology)}
                className={`flex items-center gap-2 px-3 py-1 rounded-lg transition-colors ${
                  showMorphology ? 'bg-[#C9A962] text-[#0D0D0F]' : 'bg-white/10'
                }`}
              >
                <Zap className="h-4 w-4" />
                <span className="text-sm">Morphology</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowConnections(!showConnections)}
                className={`flex items-center gap-2 px-3 py-1 rounded-lg transition-colors ${
                  showConnections ? 'bg-[#7C9885] text-[#0D0D0F]' : 'bg-white/10'
                }`}
              >
                <Globe className="h-4 w-4" />
                <span className="text-sm">Connections</span>
              </motion.button>
            </motion.div>

            {/* Multi-Scale Reading View */}
            <MultiScaleView className="mb-8">
              <div className="space-y-6">
                <motion.div
                  ref={textRef}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="leading-relaxed"
                  style={{ fontSize: `${fontSize}px`, lineHeight }}
                >
                  <div className="flex flex-wrap items-baseline gap-2 mb-6">
                    {currentText.segments.map((segment, index) => (
                      <motion.div
                        key={segment.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="relative group"
                      >
                        <motion.span
                          whileHover={{ scale: 1.05 }}
                          onClick={() => handleWordClick(segment)}
                          className={`cursor-pointer inline-block px-1 py-0.5 rounded transition-all ${
                            selectedWord?.id === segment.id
                              ? 'bg-[#C9A962]/20 text-[#C9A962]'
                              : shouldShowWord(segment)
                              ? 'hover:bg-white/10'
                              : 'text-[#F5F3EF]/40'
                          } ${showConnections && segment.connections.length > 0 ? 'border-b-2 border-[#7C9885]/50' : ''}`}
                        >
                          {readingMode === 'immersive' ? segment.greek : 
                           readingMode === 'analytical' ? segment.latin : 
                           segment.english}
                        </motion.span>

                        {/* Morphology tooltip */}
                        <AnimatePresence>
                          {showMorphology && segment.morphology && (
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: 10 }}
                              className="absolute top-full left-0 mt-1 p-2 bg-[#0D0D0F]/90 backdrop-blur-xl border border-white/20 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-10"
                            >
                              <div className="text-[#C9A962] font-medium">{segment.morphology.lemma}</div>
                              <div className="text-[#F5F3EF]/60">{segment.morphology.pos}</div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    ))}
                  </div>

                  {/* Translation layers */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="space-y-3 text-[#F5F3EF]/70"
                  >
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-[#8B7355]">Literal:</span>
                      <span>Rage sing, goddess, of Peleus' son Achilles</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-[#7C9885]">Literary:</span>
                      <span>Sing, goddess, the rage of Achilles, son of Peleus</span>
                    </div>
                  </motion.div>
                </motion.div>
              </div>
            </MultiScaleView>

            {/* Research Canvas for Connections */}
            <AnimatePresence>
              {showConnections && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-8"
                >
                  <ResearchCanvas className="h-64">
                    <div className="p-4">
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Globe className="h-5 w-5 text-[#7C9885]" />
                        Textual Connections
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {currentText.segments.flatMap(segment => segment.connections).map((connection) => (
                          <motion.div
                            key={connection.id}
                            whileHover={{ scale: 1.02 }}
                            className="p-3 bg-white/5 backdrop-blur-xl rounded-lg border border-white/10"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium">{connection.targetText}</span>
                              <span className="text-xs text-[#C9A962]">{Math.round(connection.similarity * 100)}% match</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-[#F5F3EF]/60">
                              <span className="px-2 py-1 bg-[#7C9885]/20 rounded">{connection.type}</span>
                              <ArrowRight className="h-3 w-3" />
                              <span>Similar theme</span>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </ResearchCanvas>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Right Panel - Word Analysis & AI Insights */}
        <AnimatePresence>
          {selectedWord && (
            <motion.div
              initial={{ opacity: 0, x: 300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 300 }}
              className="fixed right-0 top-0 w-96 h-screen bg-white/5 backdrop-blur-xl border-l border-white/10 overflow-y-auto z-30"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold">Word Analysis</h3>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedWord(null)}
                    className="p-1 hover:bg-white/10 rounded"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </motion.button>
                </div>

                {/* Word Details */}
                <div className="space-y-4 mb-6">
                  <div className="text-center p-4 bg-white/5 backdrop-blur-xl rounded-xl border border-white/10">
                    <div className="text-2xl font-bold text-[#C9A962] mb-2">{selectedWord.greek}</div>
                    <div className="text-lg text-[#F5F3EF]/80 mb-1">{selectedWord.latin}</div>
                    <div className="text-sm text-[#F5F3EF]/60">{selectedWord.english}</div>
                  </div>

                  {selectedWord.morphology && (
                    <div className="p-4 bg-white/5 backdrop-blur-xl rounded-xl border border-white/10">
                      <h4 className="font-medium mb-3 flex items-center gap-2">
                        <Brain className="h-4 w-4 text-[#C9A962]" />
                        Morphological Analysis
                      </h4>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        {Object.entries(selectedWord.morphology).map(([key, value]) => (
                          <div key={key} className="flex justify-between">
                            <span className="text-[#F5F3EF]/60 capitalize">{key}:</span>
                            <span className="text-[#C9A962]">{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* AI Insights */}
                  <AnimatePresence>
                    {showAiPanel && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="p-4 bg-gradient-to-br from-[#C9A962]/10 to-[#7C9885]/10 backdrop-blur-xl rounded-xl border border-white/10"
                      >
                        <h4 className="font-medium mb-3 flex items-center gap-2">
                          <Sparkles className="h-4 w-4 text-[#C9A962]" />
                          AI Insights
                        </h4>
                        <div className="space-y-2">
                          {aiInsights.map((insight, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="flex items-start gap-2 text-sm"
                            >
                              <Lightbulb className="h-3 w-3 text-[#C9A962] mt-1 flex-shrink-0" />
                              <span className="text-[#F5F3EF]/80">{insight}</span>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Notes Section */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-[#7C9885]" />
                      Notes & Commentary
                    </h4>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="text-xs text-[#C9A962] hover:text-[#C9A962]/80"
                    >
                      Add Note
                    </motion.button>
                  </div>

                  <div className="space-y-3">
                    {getFilteredNotes(selectedWord.notes).map((note) => (
                      <motion.div
                        key={note.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-3 bg-white/5 backdrop-blur-xl rounded-lg border border-white/10"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-medium text-[#C9A962]">{note.author}</span>
                          <span className={`text-xs px-2 py-0.5 rounded ${
                            note.type === 'scholarly' ? 'bg-[#7C9885]/20 text-[#7C9885]' :
                            note.type === 'personal' ? 'bg-[#C9A962]/20 text-[#C9A962]' :
                            'bg-[#8B7355]/20 text-[#8B7355]'
                          }`}>
                            {note.type}
                          </span>
                        </div>
                        <p className="text-sm text-[#F5F3EF]/80">{note.content}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed bottom-0 left-0 right-0 p-4 bg-white/5 backdrop-blur-xl border-t border-white/10"
      >
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-xl rounded-lg border border-white/10 hover:bg-white/20 transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="text-sm">Previous</span>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-4 py-2 bg-[#C9A962] text-[#0D0D0F] rounded-lg hover:bg-[#C9A962]/80 transition-colors"
            >
              <span className="text-sm">Next</span>
              <ChevronRight className="h-4 w-4" />
            </motion.button>
          </div>

          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 bg-white/10 backdrop-blur-xl rounded-lg border border-white/10 hover:bg-white/20 transition-colors"
            >
              <Bookmark className="h-4 w-4" />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 bg-white/10 backdrop-blur-xl rounded-lg border border-white/10 hover:bg-white/20 transition-colors"
            >
              <Share2 className="h-4 w-4" />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 bg-white/10 backdrop-blur-xl rounded-lg border border-white/10 hover:bg-white/20 transition-colors"
            >
              <Volume2 className="h-4 w-4" />
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
