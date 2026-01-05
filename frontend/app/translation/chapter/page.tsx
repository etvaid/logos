'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  BookOpen, 
  Save, 
  ChevronLeft, 
  ChevronRight, 
  Eye, 
  Edit3, 
  MessageSquare, 
  Search,
  Clock,
  Users,
  Lightbulb,
  ArrowRight,
  FileText,
  History,
  Bookmark,
  Layers,
  Brain,
  Target,
  CheckCircle,
  AlertTriangle,
  Plus,
  X,
  RotateCcw,
  Share2,
  Download,
  Settings,
  Zap,
  Sparkles,
  Globe,
  Link,
  Scroll
} from 'lucide-react'
import { MultiScaleView } from '@/components/innovations/multi_scale_view'
import { ComparativeFrames } from '@/components/innovations/comparative_frames'

interface Chapter {
  id: string
  number: number
  title: string
  sections: number
  progress: number
  lastModified: Date
  difficulty: 'easy' | 'medium' | 'hard' | 'crux'
  wordCount: number
}

interface TranslationNote {
  id: string
  position: number
  type: 'lexical' | 'grammatical' | 'interpretive' | 'cultural'
  content: string
  author: string
  timestamp: Date
  isCollaborative?: boolean
}

interface SemanticSuggestion {
  word: string
  context: string
  suggestions: Array<{
    translation: string
    confidence: number
    usage: string
    frequency: number
  }>
  crossReferences: Array<{
    author: string
    work: string
    passage: string
    translation: string
  }>
}

interface TranslationMemory {
  phrase: string
  translations: Array<{
    text: string
    context: string
    scholar: string
    confidence: number
  }>
  frequency: number
}

const mockChapters: Chapter[] = [
  { id: '1', number: 1, title: 'De Natura Boni', sections: 12, progress: 100, lastModified: new Date('2024-01-15'), difficulty: 'medium', wordCount: 847 },
  { id: '2', number: 2, title: 'Virtus et Sapientia', sections: 18, progress: 75, lastModified: new Date('2024-01-20'), difficulty: 'hard', wordCount: 1203 },
  { id: '3', number: 3, title: 'De Summo Bono', sections: 24, progress: 45, lastModified: new Date('2024-01-22'), difficulty: 'crux', wordCount: 1456 },
  { id: '4', number: 4, title: 'Dolor et Voluptas', sections: 15, progress: 20, lastModified: new Date('2024-01-18'), difficulty: 'medium', wordCount: 932 },
  { id: '5', number: 5, title: 'Amicitia Vera', sections: 21, progress: 0, lastModified: new Date(), difficulty: 'easy', wordCount: 1124 }
]

const mockNotes: TranslationNote[] = [
  { id: '1', position: 45, type: 'lexical', content: 'φρόνησις here clearly means practical wisdom, not mere intelligence', author: 'Dr. Sarah Chen', timestamp: new Date('2024-01-20T10:30:00'), isCollaborative: true },
  { id: '2', position: 67, type: 'interpretive', content: 'The subjunctive suggests uncertainty - Cicero is hedging his claim', author: 'Prof. Marcus Webb', timestamp: new Date('2024-01-21T14:15:00') },
  { id: '3', position: 89, type: 'cultural', content: 'Roman understanding of virtus differs significantly from Greek ἀρετή', author: 'You', timestamp: new Date('2024-01-22T09:45:00') }
]

export default function LogosTranslationChapter() {
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null)
  const [translationMode, setTranslationMode] = useState<'draft' | 'review' | 'final'>('draft')
  const [currentSection, setCurrentSection] = useState(1)
  const [showNotes, setShowNotes] = useState(false)
  const [notes, setNotes] = useState<TranslationNote[]>(mockNotes)
  const [newNote, setNewNote] = useState('')
  const [noteType, setNoteType] = useState<TranslationNote['type']>('interpretive')
  const [translationText, setTranslationText] = useState('')
  const [semanticSuggestions, setSemanticSuggestions] = useState<SemanticSuggestion[]>([])
  const [translationMemory, setTranslationMemory] = useState<TranslationMemory[]>([])
  const [showMemory, setShowMemory] = useState(false)
  const [autoSave, setAutoSave] = useState(true)
  const [lastSaved, setLastSaved] = useState<Date>(new Date())
  const [searchQuery, setSearchQuery] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [collaborativeMode, setCollaborativeMode] = useState(false)
  const [showComparative, setShowComparative] = useState(false)
  const translationRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (autoSave && translationText) {
      const timer = setTimeout(() => {
        setLastSaved(new Date())
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [translationText, autoSave])

  const handleChapterSelect = (chapter: Chapter) => {
    setSelectedChapter(chapter)
    setCurrentSection(1)
    setTranslationText('')
    // Simulate loading chapter content
    setTimeout(() => {
      setSemanticSuggestions([
        {
          word: 'virtus',
          context: 'Stoic ethics context',
          suggestions: [
            { translation: 'virtue', confidence: 0.95, usage: 'moral excellence', frequency: 47 },
            { translation: 'courage', confidence: 0.72, usage: 'specific virtue', frequency: 23 },
            { translation: 'excellence', confidence: 0.68, usage: 'general merit', frequency: 15 }
          ],
          crossReferences: [
            { author: 'Aristotle', work: 'Nicomachean Ethics', passage: '1106b36', translation: 'excellence of character' },
            { author: 'Seneca', work: 'Epistulae', passage: '66.6', translation: 'moral strength' }
          ]
        }
      ])
      
      setTranslationMemory([
        {
          phrase: 'summum bonum',
          translations: [
            { text: 'the highest good', context: 'Aristotelian ethics', scholar: 'Prof. Anderson', confidence: 0.92 },
            { text: 'supreme good', context: 'Stoic philosophy', scholar: 'Dr. Liu', confidence: 0.88 },
            { text: 'ultimate end', context: 'teleological argument', scholar: 'Prof. García', confidence: 0.85 }
          ],
          frequency: 34
        }
      ])
    }, 1000)
  }

  const handleAddNote = () => {
    if (!newNote.trim()) return
    
    const note: TranslationNote = {
      id: Date.now().toString(),
      position: translationRef.current?.selectionStart || 0,
      type: noteType,
      content: newNote,
      author: 'You',
      timestamp: new Date(),
      isCollaborative: collaborativeMode
    }
    
    setNotes([...notes, note])
    setNewNote('')
  }

  const getDifficultyColor = (difficulty: Chapter['difficulty']) => {
    switch (difficulty) {
      case 'easy': return 'text-green-400'
      case 'medium': return 'text-yellow-400'
      case 'hard': return 'text-orange-400'
      case 'crux': return 'text-red-400'
      default: return 'text-gray-400'
    }
  }

  const getDifficultyIcon = (difficulty: Chapter['difficulty']) => {
    switch (difficulty) {
      case 'easy': return CheckCircle
      case 'medium': return Target
      case 'hard': return AlertTriangle
      case 'crux': return Brain
      default: return FileText
    }
  }

  const mockGreekText = `τί οὖν ἐστι τὸ ἀγαθόν; φρόνησις, φαίην ἄν. τί τὸ κακόν; ἀφροσύνη. τί τὸ οὐδέτερον; πάντα τὰ μεταξὺ φρονήσεως καὶ ἀφροσύνης.`

  return (
    <div className="min-h-screen bg-[#0D0D0F] text-[#F5F3EF]">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <motion.div 
                className="flex items-center space-x-3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <div className="p-2 bg-gradient-to-br from-[#C9A962] to-[#8B7355] rounded-lg">
                  <Scroll className="h-6 w-6 text-black" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-[#C9A962]">LOGOS: TRANSLATION</h1>
                  <p className="text-sm text-[#7C9885]">Context-Aware Translation Studio</p>
                </div>
              </motion.div>
            </div>
            
            <div className="flex items-center space-x-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowComparative(!showComparative)}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg flex items-center space-x-2 transition-colors"
              >
                <Layers className="h-4 w-4" />
                <span>Compare</span>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 bg-[#C9A962] hover:bg-[#B8975A] text-black rounded-lg flex items-center space-x-2 font-medium transition-colors"
              >
                <Save className="h-4 w-4" />
                <span>Save Progress</span>
              </motion.button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {!selectedChapter ? (
          /* Chapter Selector */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="text-center space-y-4">
              <h2 className="text-4xl font-bold text-[#C9A962]">Select Chapter to Translate</h2>
              <p className="text-xl text-[#7C9885]">AI that understands what it's translating</p>
            </div>

            {/* Search and Filters */}
            <div className="flex items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search chapters..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C9A962] focus:border-transparent"
                />
              </div>
              
              <div className="flex space-x-2">
                <button className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-colors">
                  All Difficulties
                </button>
                <button className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-colors">
                  In Progress
                </button>
              </div>
            </div>

            {/* Chapter Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockChapters.map((chapter, index) => {
                const DifficultyIcon = getDifficultyIcon(chapter.difficulty)
                
                return (
                  <motion.div
                    key={chapter.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => handleChapterSelect(chapter)}
                    className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 cursor-pointer hover:bg-white/10 transition-all"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-gradient-to-br from-[#C9A962] to-[#8B7355] rounded-lg">
                          <span className="text-black font-bold">{chapter.number}</span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{chapter.title}</h3>
                          <p className="text-sm text-gray-400">{chapter.sections} sections • {chapter.wordCount} words</p>
                        </div>
                      </div>
                      <DifficultyIcon className={`h-5 w-5 ${getDifficultyColor(chapter.difficulty)}`} />
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-400">Progress</span>
                        <span className="text-sm font-medium text-[#C9A962]">{chapter.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <motion.div
                          className="bg-gradient-to-r from-[#C9A962] to-[#7C9885] h-2 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${chapter.progress}%` }}
                          transition={{ duration: 1, delay: index * 0.2 }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-400">
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4" />
                        <span>{chapter.lastModified.toLocaleDateString()}</span>
                      </div>
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </motion.div>
                )
              })}
            </div>

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6"
            >
              <h3 className="text-xl font-semibold text-[#C9A962] mb-4">Recent Activity</h3>
              <div className="space-y-3">
                {mockChapters.slice(0, 3).map((chapter) => (
                  <div key={chapter.id} className="flex items-center justify-between py-2">
                    <div className="flex items-center space-x-3">
                      <History className="h-4 w-4 text-[#7C9885]" />
                      <span>Chapter {chapter.number}: {chapter.title}</span>
                    </div>
                    <span className="text-sm text-gray-400">{chapter.lastModified.toLocaleDateString()}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        ) : (
          /* Translation Interface */
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Main Translation Area */}
            <div className="xl:col-span-2 space-y-6">
              {/* Chapter Header */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => setSelectedChapter(null)}
                      className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <div>
                      <h1 className="text-2xl font-bold text-[#C9A962]">
                        Chapter {selectedChapter.number}: {selectedChapter.title}
                      </h1>
                      <p className="text-[#7C9885]">Section {currentSection} of {selectedChapter.sections}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <div className="text-sm text-gray-400">
                      {autoSave && <span className="text-[#7C9885]">Auto-saved {lastSaved.toLocaleTimeString()}</span>}
                    </div>
                    <Settings className="h-5 w-5 text-gray-400" />
                  </div>
                </div>

                {/* Progress and Navigation */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <button
                      disabled={currentSection <= 1}
                      onClick={() => setCurrentSection(prev => Math.max(1, prev - 1))}
                      className="p-2 bg-white/5 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <span className="text-sm font-medium">Section {currentSection}</span>
                    <button
                      disabled={currentSection >= selectedChapter.sections}
                      onClick={() => setCurrentSection(prev => Math.min(selectedChapter.sections, prev + 1))}
                      className="p-2 bg-white/5 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="flex space-x-2">
                    {(['draft', 'review', 'final'] as const).map((mode) => (
                      <button
                        key={mode}
                        onClick={() => setTranslationMode(mode)}
                        className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                          translationMode === mode
                            ? 'bg-[#C9A962] text-black'
                            : 'bg-white/5 hover:bg-white/10'
                        }`}
                      >
                        {mode.charAt(0).toUpperCase() + mode.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Original Text */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-[#C9A962]">Original Text</h3>
                  <div className="flex space-x-2">
                    <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setIsAnalyzing(!isAnalyzing)}
                      className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                      <Brain className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                
                <div className="bg-black/20 rounded-lg p-4 mb-4">
                  <p className="text-lg leading-relaxed font-serif">
                    {mockGreekText}
                  </p>
                </div>

                {isAnalyzing && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="bg-black/10 rounded-lg p-4 space-y-3"
                  >
                    <div className="flex items-center space-x-2 text-[#7C9885]">
                      <Sparkles className="h-4 w-4" />
                      <span className="font-medium">AI Analysis</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-400">Syntactic Structure:</span>
                        <p>Question-answer format with rhetorical progression</p>
                      </div>
                      <div>
                        <span className="text-gray-400">Key Terms:</span>
                        <p>φρόνησις (phronesis), ἀφροσύνη (aphrosyne)</p>
                      </div>
                      <div>
                        <span className="text-gray-400">Literary Context:</span>
                        <p>Stoic philosophical dialogue</p>
                      </div>
                      <div>
                        <span className="text-gray-400">Difficulty:</span>
                        <p className="text-orange-400">Medium - conceptual terminology</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>

              {/* Translation Area */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-[#C9A962]">Your Translation</h3>
                  <div className="flex space-x-2">
                    <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                      <RotateCcw className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setShowMemory(!showMemory)}
                      className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                      <History className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <textarea
                  ref={translationRef}
                  value={translationText}
                  onChange={(e) => setTranslationText(e.target.value)}
                  placeholder="Begin your translation here..."
                  className="w-full h-48 bg-black/20 border border-white/10 rounded-lg p-4 text-lg leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-[#C9A962] focus:border-transparent"
                />

                {translationText && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-4 flex items-center justify-between text-sm text-gray-400"
                  >
                    <span>{translationText.length} characters</span>
                    <span>Last saved: {lastSaved.toLocaleTimeString()}</span>
                  </motion.div>
                )}
              </motion.div>

              {/* Translation Memory */}
              <AnimatePresence>
                {showMemory && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6"
                  >
                    <div className="flex items-center space-x-2 mb-4">
                      <History className="h-5 w-5 text-[#7C9885]" />
                      <h3 className="text-lg font-semibold text-[#C9A962]">Translation Memory</h3>
                    </div>

                    <div className="space-y-4">
                      {translationMemory.map((memory, index) => (
                        <div key={index} className="bg-black/20 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-[#C9A962]">{memory.phrase}</span>
                            <span className="text-xs text-gray-400">Used {memory.frequency} times</span>
                          </div>
                          <div className="space-y-2">
                            {memory.translations.map((translation, tIndex) => (
                              <div key={tIndex} className="flex items-center justify-between text-sm">
                                <span>"{translation.text}"</span>
                                <div className="flex items-center space-x-2">
                                  <span className="text-gray-400">{translation.scholar}</span>
                                  <div className="w-12 bg-gray-600 rounded-full h-1">
                                    <div 
                                      className="bg-[#C9A962] h-1 rounded-full"
                                      style={{ width: `${translation.confidence * 100}%` }}
                                    />
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Comparative Analysis */}
              <AnimatePresence>
                {showComparative && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    <ComparativeFrames
                      items={[
                        {
                          id: '1',
                          title: 'Your Translation',
                          content: translationText || 'Begin translating to see comparison...',
                          metadata: { scholar: 'You', date: new Date().toLocaleDateString(), confidence: 0.85 }
                        },
                        {
                          id: '2',
                          title: 'Classical Translation',
                          content: 'What then is good? Wisdom, I would say. What is evil? Folly. What is indifferent? All that lies between wisdom and folly.',
                          metadata: { scholar: 'Prof. Anderson', date: '2023', confidence: 0.92 }
                        },
                        {
                          id: '3',
                          title: 'Modern Interpretation',
                          content: 'So what constitutes the good? Practical wisdom, I\'d argue. And the bad? Thoughtlessness. The neutral? Everything that falls between wisdom and ignorance.',
                          metadata: { scholar: 'Dr. Martinez', date: '2024', confidence: 0.88 }
                        }
                      ]}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Notes Panel */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-[#C9A962]">Notes</h3>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setCollaborativeMode(!collaborativeMode)}
                      className={`p-2 rounded-lg transition-colors ${
                        collaborativeMode ? 'bg-[#C9A962] text-black' : 'hover:bg-white/10'
                      }`}
                    >
                      <Users className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setShowNotes(!showNotes)}
                      className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                      <MessageSquare className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Add Note */}
                <div className="space-y-3 mb-6">
                  <select
                    value={noteType}
                    onChange={(e) => setNoteType(e.target.value as TranslationNote['type'])}
                    className="w-full px-3 py-2 bg-black/20 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C9A962]"
                  >
                    <option value="lexical">Lexical</option>
                    <option value="grammatical">Grammatical</option>
                    <option value="interpretive">Interpretive</option>
                    <option value="cultural">Cultural</option>
                  </select>
                  
                  <textarea
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Add a note..."
                    className="w-full h-20 px-3 py-2 bg-black/20 border border-white/10 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#C9A962]"
                  />
                  
                  <button
                    onClick={handleAddNote}
                    className="w-full px-4 py-2 bg-[#C9A962] hover:bg-[#B8975A] text-black rounded-lg font-medium transition-colors"
                  >
                    Add Note
                  </button>
                </div>

                {/* Notes List */}
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {notes.map((note) => (
                    <motion.div
                      key={note.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-black/20 rounded-lg p-3"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          note.type === 'lexical' ? 'bg-blue-500/20 text-blue-300' :
                          note.type === 'grammatical' ? 'bg-green-500/20 text-green-300' :
                          note.type === 'interpretive' ? 'bg-purple-500/20 text-purple-300' :
                          'bg-orange-500/20 text-orange-300'
                        }`}>
                          {note.type}
                        </span>
                        {note.isCollaborative && (
                          <Users className="h-3 w-3 text-[#7C9885]" />
                        )}
                      </div>
                      <p className="text-sm mb-2">{note.content}</p>
                      <div className="flex items-center justify-between text-xs text-gray-400">
                        <span>{note.author}</span>
                        <span>{note.timestamp.toLocaleTimeString()}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Semantic Suggestions */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6"
              >
                <div className="flex items-center space-x-2 mb-4">
                  <Lightbulb className="h-5 w-5 text-[#C9A962]" />
                  <h3 className="text-lg font-semibold text-[#C9A962]">AI Suggestions</h3>
                </div>

                <div className="space-y-4">
                  {semanticSuggestions.map((suggestion, index) => (
                    <div key={index} className="bg-black/20 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-medium text-[#C9A962]">{suggestion.word}</span>
                        <span className="text-xs text-gray-400">{suggestion.context}</span>
                      </div>

                      <div className="space-y-2 mb-4">
                        {suggestion.suggestions.map((sug, sIndex) => (
                          <div key={sIndex} className="flex items-center justify-between text-sm">
                            <span>"{sug.translation}"</span>
                            <div className="flex items-center space-x-2">
                              <span className="text-xs text-gray-400">{sug.frequency}×</span>
                              <div className="w-8 bg-gray-600 rounded-full h-1">
                                <div 
                                  className="bg-[#7C9885] h-1 rounded-full"
                                  style={{ width: `${sug.confidence * 100}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="border-t border-white/10 pt-3">
                        <span className="text-xs text-gray-400 mb-2 block">Cross-References:</span>
                        {suggestion.crossReferences.map((ref, rIndex) => (
                          <div key={rIndex} className="text-xs text-[#7C9885] mb-1">
                            {ref.author}, {ref.work} {ref.passage}: "{ref.translation}"
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Multi-Scale View */}
              <MultiScaleView
                data={{
                  word: { count: 847, context: 'Current section vocabulary' },
                  sentence: { count: 42, context: 'Sentence structures analyzed' },
                  paragraph: { count: 8, context: 'Thematic units identified' },
                  chapter: { count: 1, context: 'Full chapter context' },
                  work: { count: 1, context: 'Complete work integration' }
                }}
                onScaleChange={(scale) => {
                  // Handle scale changes for contextual analysis
                  console.log('Scale changed to:', scale)
                }}
              />

              {/* Progress Tracking */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6"
              >
                <h3 className="text-lg font-semibold text-[#C9A962] mb-4">Chapter Progress</h3>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Translation</span>
                    <span className="text-sm font-medium text-[#C9A962]">
                      {Math.round((currentSection / selectedChapter.sections) * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <motion.div
                      className="bg-gradient-to-r from-[#C9A962] to-[#7C9885] h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${(currentSection / selectedChapter.sections) * 100}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-[#C9A962]">{notes.length}</div>
                      <div className="text-xs text-gray-400">Notes Added</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-[#7C9885]">{currentSection}</div>
                      <div className="text-xs text-gray-400">Current Section</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
