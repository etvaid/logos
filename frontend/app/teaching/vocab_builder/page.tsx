'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  BookOpen, 
  Brain, 
  Download, 
  BarChart3, 
  FileText, 
  Zap, 
  Target, 
  Clock, 
  Layers,
  Upload,
  Play,
  Pause,
  RotateCcw,
  CheckCircle,
  Circle,
  TrendingUp,
  Filter,
  Search,
  Settings,
  Eye,
  EyeOff,
  Star,
  Calendar,
  Users,
  ArrowRight,
  Lightbulb,
  Database,
  RefreshCw,
  Award,
  Timer,
  Volume2,
  Bookmark
} from 'lucide-react'
import { MultiScaleView } from '@/components/innovations/multi_scale_view'
import { NarrativeTimeline } from '@/components/innovations/narrative_timeline'

interface VocabWord {
  id: string
  word: string
  lemma: string
  definition: string
  frequency: number
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  partOfSpeech: string
  contexts: string[]
  mastery: number
  nextReview: Date
  interval: number
}

interface TextSource {
  id: string
  title: string
  author: string
  excerpt: string
  wordCount: number
  difficulty: string
}

interface StudySession {
  date: Date
  wordsStudied: number
  accuracy: number
  timeSpent: number
}

export default function VocabBuilderPage() {
  const [sourceText, setSourceText] = useState('')
  const [extractedWords, setExtractedWords] = useState<VocabWord[]>([])
  const [selectedWords, setSelectedWords] = useState<Set<string>>(new Set())
  const [isExtracting, setIsExtracting] = useState(false)
  const [activeTab, setActiveTab] = useState<'extract' | 'study' | 'analytics'>('extract')
  const [studyMode, setStudyMode] = useState<'flashcards' | 'recognition' | 'context'>('flashcards')
  const [currentStudyIndex, setCurrentStudyIndex] = useState(0)
  const [showDefinition, setShowDefinition] = useState(false)
  const [studySessions, setStudySessions] = useState<StudySession[]>([])
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'frequency' | 'difficulty' | 'mastery'>('frequency')
  const [isStudyActive, setIsStudyActive] = useState(false)
  const [studyTimer, setStudyTimer] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')

  // Mock data for demonstration
  const sampleTexts: TextSource[] = [
    {
      id: '1',
      title: 'De Bello Gallico I.1',
      author: 'Caesar',
      excerpt: 'Gallia est omnis divisa in partes tres...',
      wordCount: 234,
      difficulty: 'Intermediate'
    },
    {
      id: '2',
      title: 'Catilina I.1-5',
      author: 'Cicero',
      excerpt: 'Quo usque tandem abutere, Catilina...',
      wordCount: 187,
      difficulty: 'Advanced'
    },
    {
      id: '3',
      title: 'Eclogues I',
      author: 'Virgil',
      excerpt: 'Tityre, tu patulae recubans sub tegmine fagi...',
      wordCount: 156,
      difficulty: 'Beginner'
    }
  ]

  const mockWords: VocabWord[] = [
    {
      id: '1',
      word: 'divido',
      lemma: 'dividere',
      definition: 'to divide, separate, distribute',
      frequency: 23,
      difficulty: 'intermediate',
      partOfSpeech: 'verb',
      contexts: ['Gallia est omnis divisa in partes tres'],
      mastery: 0.7,
      nextReview: new Date(Date.now() + 86400000),
      interval: 3
    },
    {
      id: '2',
      word: 'populus',
      lemma: 'populus',
      definition: 'people, nation, population',
      frequency: 45,
      difficulty: 'beginner',
      partOfSpeech: 'noun',
      contexts: ['populus Romanus', 'populi liberi'],
      mastery: 0.9,
      nextReview: new Date(Date.now() + 172800000),
      interval: 7
    },
    {
      id: '3',
      word: 'consuetudo',
      lemma: 'consuetudo',
      definition: 'custom, habit, practice',
      frequency: 12,
      difficulty: 'advanced',
      partOfSpeech: 'noun',
      contexts: ['maiorum consuetudine', 'nova consuetudo'],
      mastery: 0.3,
      nextReview: new Date(Date.now() + 43200000),
      interval: 1
    }
  ]

  useEffect(() => {
    setExtractedWords(mockWords)
    setStudySessions([
      { date: new Date(Date.now() - 86400000), wordsStudied: 15, accuracy: 0.87, timeSpent: 23 },
      { date: new Date(Date.now() - 172800000), wordsStudied: 12, accuracy: 0.92, timeSpent: 18 },
      { date: new Date(Date.now() - 259200000), wordsStudied: 18, accuracy: 0.79, timeSpent: 31 }
    ])
  }, [])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isStudyActive) {
      interval = setInterval(() => {
        setStudyTimer(prev => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isStudyActive])

  const handleTextExtraction = async () => {
    setIsExtracting(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Mock extraction results based on input
    const words = sourceText.split(/\s+/).filter(word => word.length > 3)
    const newWords = words.slice(0, 10).map((word, index) => ({
      id: `extracted-${index}`,
      word: word.toLowerCase().replace(/[.,;:!?]/g, ''),
      lemma: word.toLowerCase().replace(/[.,;:!?]/g, ''),
      definition: `Definition for ${word}`,
      frequency: Math.floor(Math.random() * 50) + 1,
      difficulty: ['beginner', 'intermediate', 'advanced'][Math.floor(Math.random() * 3)] as any,
      partOfSpeech: ['noun', 'verb', 'adjective'][Math.floor(Math.random() * 3)],
      contexts: [sourceText.slice(0, 50) + '...'],
      mastery: Math.random(),
      nextReview: new Date(Date.now() + Math.random() * 86400000 * 7),
      interval: Math.floor(Math.random() * 7) + 1
    }))
    
    setExtractedWords(prev => [...prev, ...newWords])
    setIsExtracting(false)
  }

  const filteredWords = useMemo(() => {
    let words = extractedWords.filter(word => 
      (filterDifficulty === 'all' || word.difficulty === filterDifficulty) &&
      (searchQuery === '' || word.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
       word.definition.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    
    words.sort((a, b) => {
      switch (sortBy) {
        case 'frequency':
          return b.frequency - a.frequency
        case 'difficulty':
          const difficultyOrder = { beginner: 1, intermediate: 2, advanced: 3 }
          return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty]
        case 'mastery':
          return a.mastery - b.mastery
        default:
          return 0
      }
    })
    
    return words
  }, [extractedWords, filterDifficulty, sortBy, searchQuery])

  const studyWords = useMemo(() => {
    return Array.from(selectedWords).map(id => 
      extractedWords.find(word => word.id === id)
    ).filter(Boolean) as VocabWord[]
  }, [selectedWords, extractedWords])

  const currentWord = studyWords[currentStudyIndex]

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const exportToAnki = () => {
    const selectedWordsData = Array.from(selectedWords).map(id => {
      const word = extractedWords.find(w => w.id === id)
      return word ? `${word.word}\t${word.definition}\t${word.contexts.join('; ')}` : ''
    }).filter(Boolean)
    
    const ankiData = selectedWordsData.join('\n')
    const blob = new Blob([ankiData], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'vocabulary-deck.txt'
    a.click()
  }

  const timelineData = studySessions.map(session => ({
    id: session.date.toISOString(),
    date: session.date,
    title: `Study Session`,
    description: `${session.wordsStudied} words • ${session.accuracy}% accuracy`,
    category: 'study' as const,
    impact: session.accuracy > 0.8 ? 'high' : 'medium' as const
  }))

  const scaleViews = [
    {
      scale: 'overview',
      label: 'Overview',
      data: {
        totalWords: extractedWords.length,
        selectedWords: selectedWords.size,
        averageMastery: extractedWords.reduce((sum, word) => sum + word.mastery, 0) / extractedWords.length
      }
    },
    {
      scale: 'detailed',
      label: 'Word Analysis',
      data: {
        byDifficulty: {
          beginner: extractedWords.filter(w => w.difficulty === 'beginner').length,
          intermediate: extractedWords.filter(w => w.difficulty === 'intermediate').length,
          advanced: extractedWords.filter(w => w.difficulty === 'advanced').length
        }
      }
    },
    {
      scale: 'granular',
      label: 'Individual Words',
      data: filteredWords
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0D0D0F] via-[#1A1A1D] to-[#0D0D0F]">
      {/* Header */}
      <div className="border-b border-white/10 bg-black/20 backdrop-blur-xl">
        <div className="container mx-auto px-6 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-r from-[#C9A962] to-[#8B7355]">
                <Brain className="w-8 h-8 text-[#0D0D0F]" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-[#F5F3EF]">Vocabulary Builder</h1>
                <p className="text-[#C9A962] font-medium">PEDAGOGY ENGINE</p>
              </div>
            </div>
            <p className="text-xl text-[#7C9885] max-w-3xl mx-auto leading-relaxed">
              Tools that actually help people learn • Extract, analyze, and master vocabulary with intelligent spaced repetition
            </p>
          </motion.div>
        </div>
      </div>

      {/* Navigation */}
      <div className="border-b border-white/10 bg-black/10">
        <div className="container mx-auto px-6">
          <div className="flex gap-1">
            {[
              { id: 'extract', label: 'Text Extraction', icon: FileText },
              { id: 'study', label: 'Study Mode', icon: Brain },
              { id: 'analytics', label: 'Analytics', icon: BarChart3 }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-6 py-4 font-medium transition-all ${
                  activeTab === tab.id
                    ? 'text-[#C9A962] border-b-2 border-[#C9A962]'
                    : 'text-[#F5F3EF]/60 hover:text-[#F5F3EF]'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        <AnimatePresence mode="wait">
          {/* Text Extraction Tab */}
          {activeTab === 'extract' && (
            <motion.div
              key="extract"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              {/* Source Selection */}
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-[#F5F3EF] mb-6 flex items-center gap-3">
                  <Upload className="w-6 h-6 text-[#C9A962]" />
                  Text Source
                </h2>
                
                <div className="grid lg:grid-cols-2 gap-8">
                  {/* Text Input */}
                  <div className="space-y-4">
                    <label className="block text-[#F5F3EF] font-medium">
                      Paste Text or Upload File
                    </label>
                    <textarea
                      value={sourceText}
                      onChange={(e) => setSourceText(e.target.value)}
                      placeholder="Paste your Latin text here..."
                      className="w-full h-64 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-[#F5F3EF] placeholder-[#F5F3EF]/40 focus:outline-none focus:ring-2 focus:ring-[#C9A962]/50 resize-none"
                    />
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleTextExtraction}
                      disabled={!sourceText.trim() || isExtracting}
                      className="w-full bg-gradient-to-r from-[#C9A962] to-[#8B7355] text-[#0D0D0F] font-bold py-4 px-6 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isExtracting ? (
                        <>
                          <RefreshCw className="w-5 h-5 animate-spin" />
                          Extracting Vocabulary...
                        </>
                      ) : (
                        <>
                          <Zap className="w-5 h-5" />
                          Extract Vocabulary
                        </>
                      )}
                    </motion.button>
                  </div>

                  {/* Sample Texts */}
                  <div className="space-y-4">
                    <label className="block text-[#F5F3EF] font-medium">
                      Or Choose from Samples
                    </label>
                    <div className="space-y-3">
                      {sampleTexts.map(text => (
                        <motion.div
                          key={text.id}
                          whileHover={{ scale: 1.02 }}
                          className="p-4 bg-white/5 border border-white/10 rounded-xl cursor-pointer hover:border-[#C9A962]/50 transition-colors"
                          onClick={() => setSourceText(text.excerpt)}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-bold text-[#F5F3EF]">{text.title}</h3>
                            <span className="text-sm text-[#7C9885] bg-[#7C9885]/20 px-2 py-1 rounded">
                              {text.difficulty}
                            </span>
                          </div>
                          <p className="text-sm text-[#F5F3EF]/70 mb-2">{text.author}</p>
                          <p className="text-sm text-[#F5F3EF]/60 mb-2">{text.excerpt}</p>
                          <p className="text-xs text-[#C9A962]">{text.wordCount} words</p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Extracted Words with MultiScaleView */}
              {extractedWords.length > 0 && (
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-[#F5F3EF] flex items-center gap-3">
                      <Database className="w-6 h-6 text-[#C9A962]" />
                      Extracted Vocabulary
                    </h2>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Search className="w-4 h-4 text-[#F5F3EF]/60" />
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Search words..."
                          className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-[#F5F3EF] placeholder-[#F5F3EF]/40 focus:outline-none focus:ring-2 focus:ring-[#C9A962]/50 text-sm"
                        />
                      </div>
                      <select
                        value={filterDifficulty}
                        onChange={(e) => setFilterDifficulty(e.target.value)}
                        className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-[#F5F3EF] focus:outline-none focus:ring-2 focus:ring-[#C9A962]/50 text-sm"
                      >
                        <option value="all">All Levels</option>
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                      </select>
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as any)}
                        className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-[#F5F3EF] focus:outline-none focus:ring-2 focus:ring-[#C9A962]/50 text-sm"
                      >
                        <option value="frequency">By Frequency</option>
                        <option value="difficulty">By Difficulty</option>
                        <option value="mastery">By Mastery</option>
                      </select>
                    </div>
                  </div>

                  <MultiScaleView 
                    views={scaleViews}
                    onScaleChange={() => {}}
                  />

                  {/* Word List */}
                  <div className="mt-8 grid gap-4 max-h-96 overflow-y-auto">
                    {filteredWords.map(word => (
                      <motion.div
                        key={word.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`p-4 bg-white/5 border rounded-xl cursor-pointer transition-all ${
                          selectedWords.has(word.id)
                            ? 'border-[#C9A962] bg-[#C9A962]/10'
                            : 'border-white/10 hover:border-white/20'
                        }`}
                        onClick={() => {
                          const newSelected = new Set(selectedWords)
                          if (selectedWords.has(word.id)) {
                            newSelected.delete(word.id)
                          } else {
                            newSelected.add(word.id)
                          }
                          setSelectedWords(newSelected)
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            {selectedWords.has(word.id) ? (
                              <CheckCircle className="w-5 h-5 text-[#C9A962]" />
                            ) : (
                              <Circle className="w-5 h-5 text-[#F5F3EF]/40" />
                            )}
                            <div>
                              <div className="flex items-center gap-3">
                                <h3 className="font-bold text-[#F5F3EF] text-lg">{word.word}</h3>
                                <span className="text-sm text-[#F5F3EF]/70 italic">({word.lemma})</span>
                                <span className={`text-xs px-2 py-1 rounded ${
                                  word.difficulty === 'beginner' ? 'bg-green-500/20 text-green-400' :
                                  word.difficulty === 'intermediate' ? 'bg-yellow-500/20 text-yellow-400' :
                                  'bg-red-500/20 text-red-400'
                                }`}>
                                  {word.difficulty}
                                </span>
                              </div>
                              <p className="text-[#F5F3EF]/80 mt-1">{word.definition}</p>
                              <div className="flex items-center gap-4 mt-2 text-sm text-[#F5F3EF]/60">
                                <span>Frequency: {word.frequency}</span>
                                <span>•</span>
                                <span>Mastery: {Math.round(word.mastery * 100)}%</span>
                                <span>•</span>
                                <span>{word.partOfSpeech}</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="w-32 bg-white/10 rounded-full h-2 mb-2">
                              <div 
                                className="h-2 bg-gradient-to-r from-[#C9A962] to-[#7C9885] rounded-full"
                                style={{ width: `${word.mastery * 100}%` }}
                              />
                            </div>
                            <span className="text-sm text-[#F5F3EF]/60">
                              Next: {word.nextReview.toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Export Actions */}
                  {selectedWords.size > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-6 flex items-center justify-between p-4 bg-[#C9A962]/10 border border-[#C9A962]/30 rounded-xl"
                    >
                      <div className="text-[#F5F3EF]">
                        <strong>{selectedWords.size}</strong> words selected for study
                      </div>
                      <div className="flex gap-3">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={exportToAnki}
                          className="bg-[#7C9885] text-white font-medium py-2 px-4 rounded-lg flex items-center gap-2"
                        >
                          <Download className="w-4 h-4" />
                          Export to Anki
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setActiveTab('study')}
                          className="bg-gradient-to-r from-[#C9A962] to-[#8B7355] text-[#0D0D0F] font-bold py-2 px-4 rounded-lg flex items-center gap-2"
                        >
                          <Play className="w-4 h-4" />
                          Start Studying
                        </motion.button>
                      </div>
                    </motion.div>
                  )}
                </div>
              )}
            </motion.div>
          )}

          {/* Study Mode Tab */}
          {activeTab === 'study' && (
            <motion.div
              key="study"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              {studyWords.length === 0 ? (
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-12 text-center">
                  <BookOpen className="w-16 h-16 text-[#C9A962] mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-[#F5F3EF] mb-2">No Words Selected</h3>
                  <p className="text-[#F5F3EF]/60 mb-6">Select some vocabulary words from the extraction tab to start studying.</p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveTab('extract')}
                    className="bg-gradient-to-r from-[#C9A962] to-[#8B7355] text-[#0D0D0F] font-bold py-3 px-6 rounded-xl"
                  >
                    Go to Text Extraction
                  </motion.button>
                </div>
              ) : (
                <>
                  {/* Study Controls */}
                  <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-2xl font-bold text-[#F5F3EF] flex items-center gap-3">
                        <Brain className="w-6 h-6 text-[#C9A962]" />
                        Study Session
                      </h2>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 text-[#F5F3EF]">
                          <Timer className="w-4 h-4" />
                          {formatTime(studyTimer)}
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setIsStudyActive(!isStudyActive)}
                          className={`p-2 rounded-lg ${
                            isStudyActive
                              ? 'bg-red-500 text-white'
                              : 'bg-green-500 text-white'
                          }`}
                        >
                          {isStudyActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        </motion.button>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4 mb-6">
                      {[
                        { id: 'flashcards', label: 'Flashcards', icon: Layers },
                        { id: 'recognition', label: 'Recognition', icon: Eye },
                        { id: 'context', label: 'Context', icon: FileText }
                      ].map(mode => (
                        <motion.button
                          key={mode.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setStudyMode(mode.id as any)}
                          className={`p-4 rounded-xl font-medium flex items-center gap-3 transition-colors ${
                            studyMode === mode.id
                              ? 'bg-[#C9A962] text-[#0D0D0F]'
                              : 'bg-white/5 text-[#F5F3EF] hover:bg-white/10'
                          }`}
                        >
                          <mode.icon className="w-5 h-5" />
                          {mode.label}
                        </motion.button>
                      ))}
                    </div>

                    <div className="flex items-center justify-between text-[#F5F3EF]/60 text-sm">
                      <span>Progress: {currentStudyIndex + 1} of {studyWords.length}</span>
                      <div className="w-48 bg-white/10 rounded-full h-2">
                        <div 
                          className="h-2 bg-gradient-to-r from-[#C9A962] to-[#7C9885] rounded-full transition-all"
                          style={{ width: `${((currentStudyIndex + 1) / studyWords.length) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Study Card */}
                  {currentWord && (
                    <motion.div
                      key={currentWord.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-12 text-center"
                    >
                      <div className="max-w-2xl mx-auto">
                        <div className="mb-8">
                          <h3 className="text-4xl font-bold text-[#F5F3EF] mb-4">
                            {currentWord.word}
                          </h3>
                          <p className="text-xl text-[#F5F3EF]/70 italic mb-2">
                            ({currentWord.lemma})
                          </p>
                          <span className={`inline-block px-3 py-1 rounded-full text-sm ${
                            currentWord.difficulty === 'beginner' ? 'bg-green-500/20 text-green-400' :
                            currentWord.difficulty === 'intermediate' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-red-500/20 text-red-400'
                          }`}>
                            {currentWord.difficulty} • {currentWord.partOfSpeech}
                          </span>
                        </div>

                        <AnimatePresence>
                          {showDefinition && (
                            <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -20 }}
                              className="mb-8"
                            >
                              <p className="text-2xl text-[#C9A962] mb-4">
                                {currentWord.definition}
                              </p>
                              {currentWord.contexts.length > 0 && (
                                <div className="bg-white/5 rounded-xl p-4">
                                  <h4 className="text-sm font-bold text-[#F5F3EF] mb-2">Context:</h4>
                                  <p className="text-[#F5F3EF]/80 italic">
                                    "{currentWord.contexts[0]}"
                                  </p>
                                </div>
                              )}
                            </motion.div>
                          )}
                        </AnimatePresence>

                        <div className="flex items-center justify-center gap-4">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setShowDefinition(!showDefinition)}
                            className="bg-white/10 text-[#F5F3EF] font-medium py-3 px-6 rounded-xl flex items-center gap-2"
                          >
                            {showDefinition ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            {showDefinition ? 'Hide Definition' : 'Show Definition'}
                          </motion.button>

                          {showDefinition && (
                            <>
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => {
                                  setCurrentStudyIndex(prev => 
                                    prev < studyWords.length - 1 ? prev + 1 : 0
                                  )
                                  setShowDefinition(false)
                                }}
                                className="bg-red-500 text-white font-medium py-3 px-6 rounded-xl"
                              >
                                Need More Practice
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => {
                                  setCurrentStudyIndex(prev => 
                                    prev < studyWords.length - 1 ? prev + 1 : 0
                                  )
                                  setShowDefinition(false)
                                }}
                                className="bg-gradient-to-r from-[#C9A962] to-[#7C9885] text-[#0D0D0F] font-bold py-3 px-6 rounded-xl"
                              >
                                Got It!
                              </motion.button>
                            </>
                          )}
                        </div>

                        <div className="mt-8 text-sm text-[#F5F3EF]/60">
                          <div className="flex items-center justify-between">
                            <span>Current mastery: {Math.round(currentWord.mastery * 100)}%</span>
                            <span>Next review: {currentWord.nextReview.toLocaleDateString()}</span>
                          </div>
                          <div className="w-full bg-white/10 rounded-full h-1 mt-2">
                            <div 
                              className="h-1 bg-gradient-to-r from-[#C9A962] to-[#7C9885] rounded-full"
                              style={{ width: `${currentWord.mastery * 100}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </>
              )}
            </motion.div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <motion.div
              key="analytics"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              {/* Stats Overview */}
              <div className="grid md:grid-cols-4 gap-6">
                {[
                  {
                    label: 'Total Words',
                    value: extractedWords.length.toString(),
                    icon: Database,
                    color: 'from-[#C9A962] to-[#8B7355]'
                  },
                  {
                    label: 'Average Mastery',
                    value: `${Math.round((extractedWords.reduce((sum, word) => sum + word.mastery, 0) / extractedWords.length) * 100)}%`,
                    icon: TrendingUp,
                    color: 'from-[#7C9885] to-[#C9A962]'
                  },
                  {
                    label: 'Study Sessions',
                    value: studySessions.length.toString(),
                    icon: Calendar,
                    color: 'from-[#8B7355] to-[#7C9885]'
                  },
                  {
                    label: 'Average Accuracy',
                    value: `${Math.round(studySessions.reduce((sum, s) => sum + s.accuracy, 0) / studySessions.length * 100)}%`,
                    icon: Award,
                    color: 'from-[#C9A962] to-[#7C9885]'
                  }
                ].map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.color}`}>
                        <stat.icon className="w-6 h-6 text-[#0D0D0F]" />
                      </div>
                    </div>
                    <div className="text-3xl font-bold text-[#F5F3EF] mb-2">
                      {stat.value}
                    </div>
                    <div className="text-[#F5F3EF]/60">
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Study Timeline */}
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-[#F5F3EF] mb-6 flex items-center gap-3">
                  <Clock className="w-6 h-6 text-[#C9A962]" />
                  Study Progress Timeline
                </h2>
                <NarrativeTimeline 
                  events={timelineData}
                  onEventClick={() => {}}
                />
              </div>

              {/* Difficulty Distribution */}
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-[#F5F3EF] mb-6 flex items-center gap-3">
                  <BarChart3 className="w-6 h-6 text-[#C9A962]" />
                  Vocabulary Analysis
                </h2>
                
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Difficulty Chart */}
                  <div>
                    <h3 className="text-lg font-bold text-[#F5F3EF] mb-4">By Difficulty Level</h3>
                    <div className="space-y-4">
                      {[
                        { level: 'Beginner', count: extractedWords.filter(w => w.difficulty === 'beginner').length, color: 'bg-green-500' },
                        { level: 'Intermediate', count: extractedWords.filter(w => w.difficulty === 'intermediate').length, color: 'bg-yellow-500' },
                        { level: 'Advanced', count: extractedWords.filter(w => w.difficulty === 'advanced').length, color: 'bg-red-500' }
                      ].map(item => (
                        <div key={item.level} className="flex items-center gap-4">
                          <div className="w-20 text-[#F5F3EF] text-sm">{item.level}</div>
                          <div className="flex-1 bg-white/10 rounded-full h-6 relative">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${(item.count / extractedWords.length) * 100}%` }}
                              transition={{ delay: 0.5, duration: 1 }}
                              className={`h-6 ${item.color} rounded-full flex items-center justify-center text-white text-sm font-bold`}
                            >
                              {item.count}
                            </motion.div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Mastery Distribution */}
                  <div>
                    <h3 className="text-lg font-bold text-[#F5F3EF] mb-4">Mastery Levels</h3>
                    <div className="space-y-4">
                      {[
                        { level: 'Needs Work (0-30%)', count: extractedWords.filter(w => w.mastery <= 0.3).length, color: 'bg-red-500' },
                        { level: 'Learning (31-70%)', count: extractedWords.filter(w => w.mastery > 0.3 && w.mastery <= 0.7).length, color: 'bg-yellow-500' },
                        { level: 'Mastered (71-100%)', count: extractedWords.filter(w => w.mastery > 0.7).length, color: 'bg-green-500' }
                      ].map(item => (
                        <div key={item.level} className="flex items-center gap-4">
                          <div className="w-32 text-[#F5F3EF] text-sm">{item.level}</div>
                          <div className="flex-1 bg-white/10 rounded-full h-6 relative">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${(item.count / extractedWords.length) * 100}%` }}
                              transition={{ delay: 1, duration: 1 }}
                              className={`h-6 ${item.color} rounded-full flex items-center justify-center text-white text-sm font-bold`}
                            >
                              {item.count}
                            </motion.div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
