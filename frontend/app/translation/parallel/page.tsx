'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Languages, 
  Search, 
  BookOpen, 
  Users, 
  Brain, 
  Clock, 
  ArrowRight, 
  Eye, 
  Zap,
  Target,
  GitBranch,
  Lightbulb,
  Layers,
  Link,
  ChevronDown,
  ChevronRight,
  MessageSquare,
  Star,
  History,
  Filter,
  Settings,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react'
import { MultiScaleView } from '@/components/innovations/multi_scale_view'
import { ComparativeFrames } from '@/components/innovations/comparative_frames'

interface WordAlignment {
  original: string
  translation: string
  confidence: number
  alternatives: string[]
  morphology?: {
    pos: string
    case?: string
    number?: string
    gender?: string
    tense?: string
    voice?: string
    mood?: string
  }
  semanticContext: {
    domain: string
    frequency: number
    significance: 'high' | 'medium' | 'low'
  }
  crossReferences: Array<{
    text: string
    passage: string
    context: string
  }>
  scholarNotes: Array<{
    scholar: string
    note: string
    confidence: number
  }>
}

interface TranslationVariant {
  id: string
  translator: string
  text: string
  year: number
  type: 'scholarly' | 'collaborative' | 'ai-assisted'
  confidence: number
  notes?: string
}

interface TextPassage {
  id: string
  originalText: string
  citation: string
  author: string
  work: string
  alignments: WordAlignment[]
  translations: TranslationVariant[]
  context: {
    preceding: string
    following: string
  }
  semanticTags: string[]
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert'
  cruxStatus?: 'resolved' | 'disputed' | 'consensus'
}

const samplePassage: TextPassage = {
  id: 'aristotle-ethics-1094a',
  originalText: 'πᾶσα τέχνη καὶ πᾶσα μέθοδος, ὁμοίως δὲ πρᾶξίς τε καὶ προαίρεσις, ἀγαθοῦ τινος ἐφίεσθαι δοκεῖ',
  citation: 'Nicomachean Ethics 1094a1-3',
  author: 'Aristotle',
  work: 'Nicomachean Ethics',
  context: {
    preceding: 'τὰ μὲν οὖν καθ᾽ ἕκαστα...',
    following: 'διὸ καλῶς ἀπεφήναντο τἀγαθόν...'
  },
  semanticTags: ['teleology', 'ethics', 'methodology', 'good'],
  difficulty: 'intermediate',
  cruxStatus: 'consensus',
  alignments: [
    {
      original: 'πᾶσα',
      translation: 'every',
      confidence: 0.95,
      alternatives: ['all', 'each'],
      morphology: {
        pos: 'adjective',
        case: 'nominative',
        number: 'singular',
        gender: 'feminine'
      },
      semanticContext: {
        domain: 'universal quantification',
        frequency: 847,
        significance: 'high'
      },
      crossReferences: [
        {
          text: 'Republic 4.441c',
          passage: 'πᾶσα ψυχή',
          context: 'Universal claims about soul'
        }
      ],
      scholarNotes: [
        {
          scholar: 'Ross',
          note: 'Emphasizes the universal scope of the claim',
          confidence: 0.9
        }
      ]
    },
    {
      original: 'τέχνη',
      translation: 'art',
      confidence: 0.85,
      alternatives: ['craft', 'skill', 'technique'],
      morphology: {
        pos: 'noun',
        case: 'nominative',
        number: 'singular',
        gender: 'feminine'
      },
      semanticContext: {
        domain: 'epistemology',
        frequency: 234,
        significance: 'high'
      },
      crossReferences: [
        {
          text: 'Metaphysics 981a',
          passage: 'τέχνη γίγνεται',
          context: 'Genesis of craft knowledge'
        }
      ],
      scholarNotes: [
        {
          scholar: 'Irwin',
          note: 'Craft implies systematic knowledge with productive aim',
          confidence: 0.88
        }
      ]
    }
  ],
  translations: [
    {
      id: 'ross-1925',
      translator: 'W.D. Ross',
      text: 'Every art and every inquiry, and similarly every action and pursuit, is thought to aim at some good',
      year: 1925,
      type: 'scholarly',
      confidence: 0.92,
      notes: 'Standard scholarly translation emphasizing teleological structure'
    },
    {
      id: 'irwin-1999',
      translator: 'Terence Irwin',
      text: 'Every craft and every line of inquiry, and likewise every action and decision, seems to seek some good',
      year: 1999,
      type: 'scholarly',
      confidence: 0.89,
      notes: 'More contemporary philosophical terminology'
    },
    {
      id: 'ai-collaborative-2024',
      translator: 'LOGOS Community',
      text: 'Every systematic practice and methodical approach, as well as every action and choice, appears to strive toward some particular good',
      year: 2024,
      type: 'collaborative',
      confidence: 0.87,
      notes: 'AI-assisted collaborative translation with enhanced precision'
    }
  ]
}

const TranslationStudio: React.FC = () => {
  const [selectedWord, setSelectedWord] = useState<WordAlignment | null>(null)
  const [activeTranslation, setActiveTranslation] = useState(0)
  const [viewMode, setViewMode] = useState<'aligned' | 'comparative' | 'analytical'>('aligned')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [showSemanticLayer, setShowSemanticLayer] = useState(false)
  const [collaborativeMode, setCollaborativeMode] = useState(false)
  const [translationMemory, setTranslationMemory] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const textRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Simulate loading translation memory
    const timer = setTimeout(() => {
      setTranslationMemory([
        { passage: 'Met. 980a21', translation: 'τέχνη → craft', confidence: 0.91 },
        { passage: 'Pol. 1253a15', translation: 'πᾶσα πόλις → every state', confidence: 0.94 },
        { passage: 'Phys. 184a10', translation: 'μέθοδος → method', confidence: 0.87 }
      ])
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  const handleWordClick = (word: WordAlignment) => {
    setSelectedWord(word)
    setIsAnalyzing(true)
    
    setTimeout(() => {
      setIsAnalyzing(false)
    }, 800)
  }

  const renderOriginalText = () => {
    const words = samplePassage.originalText.split(' ')
    
    return (
      <div className="text-2xl leading-relaxed font-serif">
        {words.map((word, index) => {
          const alignment = samplePassage.alignments.find(a => 
            word.replace(/[,;.·]/g, '') === a.original
          )
          
          return (
            <motion.span
              key={index}
              className={`
                inline-block mr-3 mb-2 px-2 py-1 rounded cursor-pointer transition-all duration-300
                ${alignment ? 'hover:bg-[#C9A962]/20 hover:text-[#C9A962]' : 'hover:bg-white/10'}
                ${selectedWord?.original === alignment?.original ? 'bg-[#C9A962]/30 text-[#C9A962]' : ''}
                ${showSemanticLayer && alignment?.semanticContext.significance === 'high' 
                  ? 'border-b-2 border-[#7C9885]' 
                  : ''
                }
              `}
              onClick={() => alignment && handleWordClick(alignment)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              {word}
            </motion.span>
          )
        })}
      </div>
    )
  }

  const renderTranslationText = (translation: TranslationVariant) => {
    const words = translation.text.split(' ')
    
    return (
      <div className="text-xl leading-relaxed">
        {words.map((word, index) => (
          <motion.span
            key={index}
            className="inline-block mr-2 mb-1 px-1 py-0.5 rounded hover:bg-white/10 cursor-pointer transition-all duration-300"
            whileHover={{ scale: 1.02 }}
          >
            {word}
          </motion.span>
        ))}
      </div>
    )
  }

  const renderWordAnalysis = () => {
    if (!selectedWord) return null

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 space-y-6"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#C9A962]/20 rounded-lg">
              <Target className="w-5 h-5 text-[#C9A962]" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-[#C9A962]">{selectedWord.original}</h3>
              <p className="text-sm text-white/70">
                {selectedWord.morphology?.pos} • Confidence: {(selectedWord.confidence * 100).toFixed(0)}%
              </p>
            </div>
          </div>
          {isAnalyzing && (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="p-2 bg-[#7C9885]/20 rounded-lg"
            >
              <Brain className="w-5 h-5 text-[#7C9885]" />
            </motion.div>
          )}
        </div>

        {/* Morphological Analysis */}
        {selectedWord.morphology && (
          <div className="space-y-3">
            <h4 className="font-semibold text-white/90 flex items-center gap-2">
              <Layers className="w-4 h-4" />
              Morphological Analysis
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {Object.entries(selectedWord.morphology).map(([key, value]) => (
                <div key={key} className="bg-white/5 rounded-lg p-3">
                  <div className="text-xs text-white/60 capitalize">{key}</div>
                  <div className="text-sm font-medium text-white/90">{value}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Translation Alternatives */}
        <div className="space-y-3">
          <h4 className="font-semibold text-white/90 flex items-center gap-2">
            <GitBranch className="w-4 h-4" />
            Translation Options
          </h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-[#C9A962]/10 rounded-lg border border-[#C9A962]/20">
              <span className="font-medium text-[#C9A962]">{selectedWord.translation}</span>
              <span className="text-xs bg-[#C9A962]/20 px-2 py-1 rounded">Primary</span>
            </div>
            {selectedWord.alternatives.map((alt, index) => (
              <motion.div
                key={alt}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 cursor-pointer transition-colors"
              >
                <span className="text-white/80">{alt}</span>
                <span className="text-xs text-white/50">Alternative</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Cross References */}
        <div className="space-y-3">
          <h4 className="font-semibold text-white/90 flex items-center gap-2">
            <Link className="w-4 h-4" />
            Cross References
          </h4>
          <div className="space-y-2">
            {selectedWord.crossReferences.map((ref, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-3 bg-white/5 rounded-lg hover:bg-white/10 cursor-pointer transition-colors border-l-2 border-[#7C9885]/50"
              >
                <div className="font-medium text-[#7C9885] text-sm">{ref.text}</div>
                <div className="text-xs text-white/60 mt-1">{ref.passage}</div>
                <div className="text-xs text-white/50 mt-1">{ref.context}</div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Scholar Notes */}
        <div className="space-y-3">
          <h4 className="font-semibold text-white/90 flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            Scholar Commentary
          </h4>
          <div className="space-y-3">
            {selectedWord.scholarNotes.map((note, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 bg-white/5 rounded-lg border border-white/10"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-[#C9A962]">{note.scholar}</span>
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-[#C9A962] fill-current" />
                    <span className="text-xs text-white/60">{(note.confidence * 100).toFixed(0)}%</span>
                  </div>
                </div>
                <p className="text-sm text-white/80">{note.note}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0D0D0F] flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="p-4 bg-[#C9A962]/20 rounded-full"
        >
          <Languages className="w-8 h-8 text-[#C9A962]" />
        </motion.div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0D0D0F] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="p-4 bg-red-500/20 rounded-full w-fit mx-auto">
            <Languages className="w-8 h-8 text-red-400" />
          </div>
          <h2 className="text-xl font-semibold text-white/90">Translation Error</h2>
          <p className="text-white/60">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-[#C9A962] text-[#0D0D0F] rounded-lg hover:bg-[#C9A962]/90 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0D0D0F] text-[#F5F3EF]">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#C9A962]/5 via-transparent to-[#7C9885]/5" />
        
        <div className="container mx-auto px-6 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-6 mb-16"
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              <motion.div
                whileHover={{ rotate: 180 }}
                transition={{ duration: 0.5 }}
                className="p-3 bg-[#C9A962]/20 rounded-full"
              >
                <Languages className="w-8 h-8 text-[#C9A962]" />
              </motion.div>
              <h1 className="text-4xl md:text-6xl font-bold">
                <span className="bg-gradient-to-r from-[#C9A962] to-[#7C9885] bg-clip-text text-transparent">
                  Context-Aware
                </span>
                <br />
                Translation Studio
              </h1>
            </div>
            <p className="text-xl md:text-2xl text-white/70 max-w-3xl mx-auto leading-relaxed">
              AI that understands what it's translating
            </p>
            
            {/* Feature Pills */}
            <div className="flex flex-wrap justify-center gap-3 mt-8">
              {[
                { icon: Eye, text: 'Semantic Awareness' },
                { icon: Users, text: 'Collaborative Intelligence' },
                { icon: Brain, text: 'Translation Memory' },
                { icon: Zap, text: 'Real-time Analysis' }
              ].map((feature, index) => (
                <motion.div
                  key={feature.text}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full hover:bg-white/10 transition-colors"
                >
                  <feature.icon className="w-4 h-4 text-[#C9A962]" />
                  <span className="text-sm text-white/80">{feature.text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Control Panel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 mb-8"
          >
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-[#C9A962]" />
                  <span className="font-semibold">{samplePassage.author}</span>
                  <ChevronRight className="w-4 h-4 text-white/40" />
                  <span className="text-white/70">{samplePassage.work}</span>
                  <ChevronRight className="w-4 h-4 text-white/40" />
                  <span className="text-[#C9A962]">{samplePassage.citation}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {/* View Mode Selector */}
                <div className="flex bg-white/5 rounded-lg p-1">
                  {[
                    { mode: 'aligned', icon: Target, label: 'Aligned' },
                    { mode: 'comparative', icon: GitBranch, label: 'Compare' },
                    { mode: 'analytical', icon: Brain, label: 'Analyze' }
                  ].map(({ mode, icon: Icon, label }) => (
                    <button
                      key={mode}
                      onClick={() => setViewMode(mode as any)}
                      className={`
                        flex items-center gap-2 px-3 py-2 rounded text-sm transition-all
                        ${viewMode === mode 
                          ? 'bg-[#C9A962] text-[#0D0D0F] font-medium' 
                          : 'text-white/70 hover:text-white/90 hover:bg-white/5'
                        }
                      `}
                    >
                      <Icon className="w-4 h-4" />
                      {label}
                    </button>
                  ))}
                </div>

                {/* Toggle Controls */}
                <button
                  onClick={() => setShowSemanticLayer(!showSemanticLayer)}
                  className={`
                    flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all
                    ${showSemanticLayer 
                      ? 'bg-[#7C9885]/20 text-[#7C9885] border border-[#7C9885]/30' 
                      : 'bg-white/5 text-white/70 border border-white/10 hover:bg-white/10'
                    }
                  `}
                >
                  <Layers className="w-4 h-4" />
                  Semantic
                </button>

                <button
                  onClick={() => setCollaborativeMode(!collaborativeMode)}
                  className={`
                    flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all
                    ${collaborativeMode 
                      ? 'bg-[#C9A962]/20 text-[#C9A962] border border-[#C9A962]/30' 
                      : 'bg-white/5 text-white/70 border border-white/10 hover:bg-white/10'
                    }
                  `}
                >
                  <Users className="w-4 h-4" />
                  Collaborate
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Translation Interface */}
      <section className="py-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Left Panel - Original Text */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="xl:col-span-2 space-y-6"
            >
              {/* Innovation Components */}
              <MultiScaleView
                data={[
                  { level: 'word', content: 'Individual lexical items with morphological analysis' },
                  { level: 'phrase', content: 'Syntactic units with grammatical relationships' },
                  { level: 'sentence', content: 'Complete thoughts with semantic coherence' },
                  { level: 'paragraph', content: 'Argumentative units with logical flow' }
                ]}
                onScaleChange={(scale) => console.log('Scale changed:', scale)}
              />

              <ComparativeFrames
                frames={[
                  { id: 'original', title: 'Original Greek', content: renderOriginalText() },
                  { id: 'translation', title: 'Modern Translation', content: renderTranslationText(samplePassage.translations[activeTranslation]) },
                  { id: 'analysis', title: 'Linguistic Analysis', content: selectedWord ? renderWordAnalysis() : <div className="text-white/50 text-center py-8">Click a word to see detailed analysis</div> }
                ]}
                activeFrame="original"
                onFrameChange={(frameId) => console.log('Frame changed:', frameId)}
              />

              {/* Original Text Panel */}
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-[#C9A962] flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    Original Text
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-white/60">
                    <span className="px-2 py-1 bg-[#7C9885]/20 rounded text-[#7C9885] capitalize">
                      {samplePassage.difficulty}
                    </span>
                    {samplePassage.cruxStatus && (
                      <span className={`px-2 py-1 rounded text-xs ${
                        samplePassage.cruxStatus === 'consensus' 
                          ? 'bg-green-500/20 text-green-400' 
                          : samplePassage.cruxStatus === 'disputed'
                          ? 'bg-red-500/20 text-red-400'
                          : 'bg-[#C9A962]/20 text-[#C9A962]'
                      }`}>
                        {samplePassage.cruxStatus}
                      </span>
                    )}
                  </div>
                </div>
                
                <div ref={textRef} className="space-y-6">
                  {renderOriginalText()}
                </div>

                {/* Semantic Tags */}
                {showSemanticLayer && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-6 pt-6 border-t border-white/10"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <Lightbulb className="w-4 h-4 text-[#7C9885]" />
                      <span className="text-sm font-medium text-white/80">Semantic Context</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {samplePassage.semanticTags.map((tag, index) => (
                        <motion.span
                          key={tag}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.1 }}
                          className="px-3 py-1 bg-[#7C9885]/20 border border-[#7C9885]/30 rounded-full text-sm text-[#7C9885]"
                        >
                          {tag}
                        </motion.span>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Translation Variants */}
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-[#C9A962] flex items-center gap-2">
                    <Languages className="w-5 h-5" />
                    Translation Variants
                  </h3>
                  <div className="text-sm text-white/60">
                    {samplePassage.translations.length} versions available
                  </div>
                </div>

                <div className="space-y-4">
                  {samplePassage.translations.map((translation, index) => (
                    <motion.div
                      key={translation.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`
                        p-6 rounded-xl border cursor-pointer transition-all duration-300
                        ${activeTranslation === index 
                          ? 'bg-[#C9A962]/10 border-[#C9A962]/30 ring-1 ring-[#C9A962]/20' 
                          : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                        }
                      `}
                      onClick={() => setActiveTranslation(index)}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-white/90">{translation.translator}</span>
                            <span className="text-sm text-white/60">({translation.year})</span>
                          </div>
                          <span className={`
                            px-2 py-1 text-xs rounded-full
                            ${translation.type === 'scholarly' 
                              ? 'bg-[#C9A962]/20 text-[#C9A962]'
                              : translation.type === 'collaborative'
                              ? 'bg-[#7C9885]/20 text-[#7C9885]'
                              : 'bg-blue-500/20 text-blue-400'
                            }
                          `}>
                            {translation.type.replace('-', ' ')}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-[#C9A962] fill-current" />
                          <span className="text-xs text-white/60">
                            {(translation.confidence * 100).toFixed(0)}%
                          </span>
                        </div>
                      </div>
                      
                      <div className="mb-3">
                        {renderTranslationText(translation)}
                      </div>

                      {translation.notes && (
                        <p className="text-sm text-white/60 italic">{translation.notes}</p>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Right Panel - Analysis & Tools */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="space-y-6"
            >
              {/* Word Analysis */}
              <AnimatePresence mode="wait">
                {selectedWord ? (
                  renderWordAnalysis()
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-8 text-center space-y-4"
                  >
                    <div className="p-4 bg-[#C9A962]/10 rounded-full w-fit mx-auto">
                      <Target className="w-8 h-8 text-[#C9A962]" />
                    </div>
                    <h3 className="text-xl font-semibold text-white/90">Word Analysis</h3>
                    <p className="text-white/60">
                      Click on any word in the original text to see detailed morphological, 
                      semantic, and contextual analysis.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Translation Memory */}
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <History className="w-5 h-5 text-[#7C9885]" />
                  <h3 className="font-semibold text-white/90">Translation Memory</h3>
                </div>
                
                {translationMemory.length > 0 ? (
                  <div className="space-y-3">
                    {translationMemory.map((memory, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-3 bg-white/5 rounded-lg hover:bg-white/10 cursor-pointer transition-colors"
                      >
                        <div className="text-sm font-medium text-[#7C9885]">{memory.passage}</div>
                        <div className="text-xs text-white/70 mt-1">{memory.translation}</div>
                        <div className="text-xs text-white/50 mt-1">
                          Confidence: {(memory.confidence * 100).toFixed(0)}%
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-white/60">
                    <Clock className="w-6 h-6 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Building translation memory...</p>
                  </div>
                )}
              </div>

              {/* Collaborative Features */}
              {collaborativeMode && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <Users className="w-5 h-5 text-[#C9A962]" />
                    <h3 className="font-semibold text-white/90">Collaborative Intelligence</h3>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="text-sm text-white/70">
                      3 scholars are currently working on this passage
                    </div>
                    
                    <div className="space-y-3">
                      {[
                        { name: 'Dr. Sarah Chen', status: 'Analyzing word alignments', avatar: 'SC' },
                        { name: 'Prof. Marcus Webb', status: 'Adding commentary', avatar: 'MW' },
                        { name: 'Dr. Elena Rodriguez', status: 'Cross-referencing sources', avatar: 'ER' }
                      ].map((scholar, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                          <div className="w-8 h-8 bg-[#C9A962]/20 rounded-full flex items-center justify-center text-xs font-medium text-[#C9A962]">
                            {scholar.avatar}
                          </div>
                          <div className="flex-1">
                            <div className="text-sm font-medium text-white/90">{scholar.name}</div>
                            <div className="text-xs text-white/60">{scholar.status}</div>
                          </div>
                          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Quick Tools */}
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">
                <h3 className="font-semibold text-white/90 mb-4 flex items-center gap-2">
                  <Settings className="w-5 h-5 text-white/70" />
                  Quick Tools
                </h3>
                
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { icon: Search, label: 'Search Corpus', color: '[#C9A962]' },
                    { icon: Filter, label: 'Filter Results', color: '[#7C9885]' },
                    { icon: GitBranch, label: 'Compare Texts', color: '[#8B7355]' },
                    { icon: Lightbulb, label: 'AI Insights', color: '[#C9A962]' }
                  ].map((tool, index) => (
                    <motion.button
                      key={tool.label}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`
                        p-3 bg-white/5 border border-white/10 rounded-lg 
                        hover:bg-${tool.color}/10 hover:border-${tool.color}/30 
                        transition-all duration-300 group
                      `}
                    >
                      <tool.icon className={`w-5 h-5 text-white/70 group-hover:text-${tool.color} mx-auto mb-1`} />
                      <div className="text-xs text-white/70 group-hover:text-white/90">
                        {tool.label}
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default TranslationStudio
