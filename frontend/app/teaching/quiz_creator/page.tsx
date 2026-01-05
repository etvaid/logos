
'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  BookOpen, 
  Brain, 
  Target, 
  Zap, 
  ChevronRight, 
  Play, 
  Pause, 
  RotateCcw, 
  Download, 
  Share2, 
  Settings, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Users, 
  Sparkles, 
  FileText, 
  Grid3X3, 
  Sliders, 
  Key,
  MousePointer,
  Type,
  BarChart3,
  Lightbulb,
  ArrowRight,
  Quote,
  Layers,
  Wand2,
  BookMarked,
  GraduationCap,
  RefreshCw
} from 'lucide-react'
import { MultiScaleView } from '@/components/innovations/multi_scale_view'
import { NarrativeTimeline } from '@/components/innovations/narrative_timeline'

interface QuizQuestion {
  id: string
  type: 'multiple_choice' | 'translation' | 'parsing' | 'fill_blank' | 'essay'
  difficulty: 'novice' | 'intermediate' | 'advanced' | 'expert'
  question: string
  options?: string[]
  correctAnswer: string | string[]
  explanation: string
  textReference: {
    author: string
    work: string
    citation: string
    context: string
  }
}

interface TextSelection {
  text: string
  author: string
  work: string
  citation: string
  difficulty: string
  grammarTopics: string[]
  vocabulary: string[]
}

interface QuizTemplate {
  id: string
  name: string
  description: string
  questionTypes: string[]
  targetLevel: string
  estimatedTime: number
  icon: React.ReactNode
}

const QuizCreatorPage: React.FC = () => {
  const [selectedText, setSelectedText] = useState<TextSelection | null>(null)
  const [activeQuestionTypes, setActiveQuestionTypes] = useState<string[]>(['multiple_choice'])
  const [difficultyLevel, setDifficultyLevel] = useState<string>('intermediate')
  const [generatedQuiz, setGeneratedQuiz] = useState<QuizQuestion[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [activeTab, setActiveTab] = useState<'select' | 'configure' | 'preview' | 'export'>('select')
  const [showAnswerKeys, setShowAnswerKeys] = useState(false)
  const [quizSettings, setQuizSettings] = useState({
    questionCount: 10,
    timeLimit: 30,
    randomOrder: true,
    showFeedback: true,
    allowRetakes: false,
    adaptiveDifficulty: true
  })

  const textSelectorRef = useRef<HTMLDivElement>(null)
  const [highlightedSelection, setHighlightedSelection] = useState<string>('')

  const questionTypes = [
    {
      id: 'multiple_choice',
      name: 'Multiple Choice',
      description: 'Traditional A, B, C, D questions',
      icon: <Grid3X3 className="w-5 h-5" />,
      color: 'from-blue-500 to-purple-500',
      difficulty: 'Easy to create'
    },
    {
      id: 'translation',
      name: 'Translation',
      description: 'Latin to English or vice versa',
      icon: <Type className="w-5 h-5" />,
      color: 'from-green-500 to-emerald-500',
      difficulty: 'Moderate complexity'
    },
    {
      id: 'parsing',
      name: 'Morphological Parsing',
      description: 'Identify grammatical forms',
      icon: <Layers className="w-5 h-5" />,
      color: 'from-orange-500 to-red-500',
      difficulty: 'High precision'
    },
    {
      id: 'fill_blank',
      name: 'Fill in the Blanks',
      description: 'Complete missing words or forms',
      icon: <FileText className="w-5 h-5" />,
      color: 'from-purple-500 to-pink-500',
      difficulty: 'Context-dependent'
    },
    {
      id: 'essay',
      name: 'Short Answer',
      description: 'Open-ended responses',
      icon: <Quote className="w-5 h-5" />,
      color: 'from-teal-500 to-cyan-500',
      difficulty: 'Requires rubric'
    }
  ]

  const difficultyLevels = [
    {
      id: 'novice',
      name: 'Novice',
      description: 'First-year students, basic vocabulary',
      color: 'from-green-400 to-emerald-400',
      features: ['High-frequency words', 'Simple grammar', 'Lots of context']
    },
    {
      id: 'intermediate',
      name: 'Intermediate',
      description: 'Second-year, complex constructions',
      color: 'from-yellow-400 to-orange-400',
      features: ['Mixed vocabulary', 'Subjunctives', 'Participles']
    },
    {
      id: 'advanced',
      name: 'Advanced',
      description: 'Upper-level, nuanced interpretation',
      color: 'from-orange-400 to-red-400',
      features: ['Literary devices', 'Rare words', 'Cultural context']
    },
    {
      id: 'expert',
      name: 'Expert',
      description: 'Graduate level, scholarly analysis',
      color: 'from-red-400 to-purple-400',
      features: ['Textual criticism', 'Paleography', 'Manuscript variants']
    }
  ]

  const quizTemplates: QuizTemplate[] = [
    {
      id: 'vocab_mastery',
      name: 'Vocabulary Mastery',
      description: 'Focus on word recognition and meaning',
      questionTypes: ['multiple_choice', 'fill_blank'],
      targetLevel: 'novice',
      estimatedTime: 15,
      icon: <BookMarked className="w-6 h-6" />
    },
    {
      id: 'grammar_intensive',
      name: 'Grammar Deep Dive',
      description: 'Morphology and syntax practice',
      questionTypes: ['parsing', 'fill_blank', 'multiple_choice'],
      targetLevel: 'intermediate',
      estimatedTime: 25,
      icon: <Layers className="w-6 h-6" />
    },
    {
      id: 'translation_practice',
      name: 'Translation Workshop',
      description: 'Comprehensive translation skills',
      questionTypes: ['translation', 'essay', 'multiple_choice'],
      targetLevel: 'advanced',
      estimatedTime: 45,
      icon: <Type className="w-6 h-6" />
    },
    {
      id: 'comprehensive_review',
      name: 'Comprehensive Assessment',
      description: 'All skills mixed for thorough evaluation',
      questionTypes: ['multiple_choice', 'translation', 'parsing', 'fill_blank', 'essay'],
      targetLevel: 'expert',
      estimatedTime: 60,
      icon: <GraduationCap className="w-6 h-6" />
    }
  ]

  const sampleTexts = [
    {
      text: "Gallia est omnis divisa in partes tres, quarum unam incolunt Belgae, aliam Aquitani, tertiam qui ipsorum lingua Celtae, nostra Galli appellantur.",
      author: "Caesar",
      work: "De Bello Gallico",
      citation: "1.1",
      difficulty: "intermediate",
      grammarTopics: ["passive voice", "relative clauses", "ablative case"],
      vocabulary: ["divido", "pars", "incolo", "lingua", "appello"]
    },
    {
      text: "Arma virumque cano, Troiae qui primus ab oris Italiam, fato profugus, Laviniaque venit litora.",
      author: "Vergil",
      work: "Aeneid",
      citation: "1.1-3",
      difficulty: "advanced",
      grammarTopics: ["relative clauses", "ablative absolute", "poetic word order"],
      vocabulary: ["arma", "cano", "profugus", "fatum", "litus"]
    },
    {
      text: "In principio erat Verbum, et Verbum erat apud Deum, et Deus erat Verbum.",
      author: "Jerome",
      work: "Vulgate",
      citation: "John 1:1",
      difficulty: "novice",
      grammarTopics: ["copulative verbs", "prepositions", "word order"],
      vocabulary: ["principium", "verbum", "apud", "deus"]
    }
  ]

  const timelineSteps = [
    {
      id: 'text_selection',
      title: 'Select Text',
      description: 'Choose passage for quiz generation',
      timestamp: '2024-01-15T10:00:00Z',
      completed: selectedText !== null
    },
    {
      id: 'question_config',
      title: 'Configure Questions',
      description: 'Set types and difficulty levels',
      timestamp: '2024-01-15T10:05:00Z',
      completed: activeQuestionTypes.length > 0
    },
    {
      id: 'ai_generation',
      title: 'AI Generation',
      description: 'Create intelligent questions',
      timestamp: '2024-01-15T10:10:00Z',
      completed: generatedQuiz.length > 0
    },
    {
      id: 'review_export',
      title: 'Review & Export',
      description: 'Final polish and distribution',
      timestamp: '2024-01-15T10:15:00Z',
      completed: false
    }
  ]

  const generateQuiz = async () => {
    setIsGenerating(true)
    
    // Simulate AI quiz generation
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    const mockQuestions: QuizQuestion[] = [
      {
        id: '1',
        type: 'multiple_choice',
        difficulty: difficultyLevel as any,
        question: 'What is the subject of "Gallia est omnis divisa"?',
        options: ['Gallia', 'omnis', 'divisa', 'est'],
        correctAnswer: 'Gallia',
        explanation: 'Gallia is the nominative subject of the passive construction.',
        textReference: {
          author: selectedText?.author || 'Caesar',
          work: selectedText?.work || 'De Bello Gallico',
          citation: selectedText?.citation || '1.1',
          context: selectedText?.text || ''
        }
      },
      {
        id: '2',
        type: 'translation',
        difficulty: difficultyLevel as any,
        question: 'Translate: "in partes tres"',
        correctAnswer: 'into three parts',
        explanation: 'Accusative of motion toward with preposition "in".',
        textReference: {
          author: selectedText?.author || 'Caesar',
          work: selectedText?.work || 'De Bello Gallico',
          citation: selectedText?.citation || '1.1',
          context: selectedText?.text || ''
        }
      }
    ]
    
    setGeneratedQuiz(mockQuestions)
    setIsGenerating(false)
    setActiveTab('preview')
  }

  const handleTextSelection = () => {
    if (textSelectorRef.current) {
      const selection = window.getSelection()
      if (selection && selection.toString().trim()) {
        setHighlightedSelection(selection.toString())
      }
    }
  }

  return (
    <div className="min-h-screen bg-[#0D0D0F] text-[#F5F3EF]">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#C9A962]/20 via-[#7C9885]/10 to-transparent" />
        
        <div className="relative max-w-7xl mx-auto px-6 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              <motion.div
                whileHover={{ rotate: 180 }}
                transition={{ duration: 0.3 }}
                className="p-3 rounded-2xl bg-gradient-to-r from-[#C9A962] to-[#8B7355]"
              >
                <Wand2 className="w-8 h-8 text-white" />
              </motion.div>
              <div className="text-left">
                <h1 className="text-5xl font-bold bg-gradient-to-r from-[#C9A962] to-[#8B7355] bg-clip-text text-transparent">
                  Quiz Creator
                </h1>
                <p className="text-lg text-[#7C9885] mt-2">Pedagogy Engine</p>
              </div>
            </div>
            
            <p className="text-xl text-[#F5F3EF]/80 max-w-3xl mx-auto leading-relaxed">
              Generate intelligent, adaptive quizzes from any Latin text. Our AI understands grammar, 
              vocabulary difficulty, and pedagogical progression to create assessments that actually 
              help students learn.
            </p>

            <div className="flex items-center justify-center gap-8 mt-8 text-sm">
              <div className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-[#C9A962]" />
                <span>AI-Powered Generation</span>
              </div>
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-[#7C9885]" />
                <span>Adaptive Difficulty</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-[#8B7355]" />
                <span>Instant Export</span>
              </div>
            </div>
          </motion.div>

          {/* Progress Timeline */}
          <div className="mb-12">
            <NarrativeTimeline
              steps={timelineSteps}
              currentStep={activeTab === 'select' ? 0 : activeTab === 'configure' ? 1 : activeTab === 'preview' ? 2 : 3}
              onStepClick={(stepIndex) => {
                const tabs = ['select', 'configure', 'preview', 'export']
                setActiveTab(tabs[stepIndex] as any)
              }}
            />
          </div>

          {/* Tab Navigation */}
          <div className="flex justify-center mb-8">
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-2 border border-white/10">
              {[
                { id: 'select', label: 'Text Selection', icon: MousePointer },
                { id: 'configure', label: 'Question Types', icon: Grid3X3 },
                { id: 'preview', label: 'Preview Quiz', icon: FileText },
                { id: 'export', label: 'Export & Share', icon: Share2 }
              ].map((tab) => {
                const Icon = tab.icon
                return (
                  <motion.button
                    key={tab.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2 ${
                      activeTab === tab.id
                        ? 'bg-[#C9A962] text-white shadow-lg'
                        : 'text-[#F5F3EF]/60 hover:text-[#F5F3EF] hover:bg-white/5'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </motion.button>
                )
              })}
            </div>
          </div>

          {/* Main Content Area */}
          <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden">
            <AnimatePresence mode="wait">
              {/* Text Selection Tab */}
              {activeTab === 'select' && (
                <motion.div
                  key="select"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="p-8"
                >
                  <div className="flex items-center gap-3 mb-8">
                    <MousePointer className="w-6 h-6 text-[#C9A962]" />
                    <h2 className="text-2xl font-bold">Select Your Text</h2>
                    <span className="text-sm text-[#F5F3EF]/60">Step 1 of 4</span>
                  </div>

                  <MultiScaleView
                    views={[
                      {
                        id: 'paste_text',
                        title: 'Paste Custom Text',
                        scale: 'detail',
                        content: (
                          <div className="space-y-4">
                            <div 
                              ref={textSelectorRef}
                              className="relative"
                              onMouseUp={handleTextSelection}
                            >
                              <textarea
                                className="w-full h-40 bg-white/5 border border-white/20 rounded-xl p-4 text-[#F5F3EF] placeholder-[#F5F3EF]/40 resize-none focus:border-[#C9A962] focus:ring-2 focus:ring-[#C9A962]/20 transition-all"
                                placeholder="Paste your Latin text here, or select from our curated examples below..."
                                onChange={(e) => {
                                  if (e.target.value.trim()) {
                                    setSelectedText({
                                      text: e.target.value,
                                      author: 'Custom',
                                      work: 'Custom Text',
                                      citation: 'User Selection',
                                      difficulty: 'intermediate',
                                      grammarTopics: [],
                                      vocabulary: []
                                    })
                                  }
                                }}
                              />
                              {highlightedSelection && (
                                <motion.div
                                  initial={{ opacity: 0, scale: 0.9 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  className="absolute top-2 right-2 bg-[#C9A962] text-white px-3 py-1 rounded-lg text-sm"
                                >
                                  Selection: {highlightedSelection.slice(0, 20)}...
                                </motion.div>
                              )}
                            </div>
                            
                            <div className="flex gap-3">
                              <input
                                type="text"
                                placeholder="Author"
                                className="flex-1 bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-sm focus:border-[#C9A962] transition-all"
                              />
                              <input
                                type="text"
                                placeholder="Work"
                                className="flex-1 bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-sm focus:border-[#C9A962] transition-all"
                              />
                              <input
                                type="text"
                                placeholder="Citation"
                                className="flex-1 bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-sm focus:border-[#C9A962] transition-all"
                              />
                            </div>
                          </div>
                        )
                      },
                      {
                        id: 'sample_texts',
                        title: 'Curated Examples',
                        scale: 'overview',
                        content: (
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {sampleTexts.map((text, index) => (
                              <motion.div
                                key={index}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setSelectedText(text)}
                                className={`p-6 rounded-xl border-2 transition-all cursor-pointer ${
                                  selectedText?.text === text.text
                                    ? 'border-[#C9A962] bg-[#C9A962]/10'
                                    : 'border-white/20 bg-white/5 hover:border-[#C9A962]/50'
                                }`}
                              >
                                <div className="flex items-center justify-between mb-3">
                                  <h3 className="font-bold text-[#C9A962]">{text.author}</h3>
                                  <span className={`px-2 py-1 rounded text-xs ${
                                    text.difficulty === 'novice' ? 'bg-green-500/20 text-green-400' :
                                    text.difficulty === 'intermediate' ? 'bg-yellow-500/20 text-yellow-400' :
                                    'bg-red-500/20 text-red-400'
                                  }`}>
                                    {text.difficulty}
                                  </span>
                                </div>
                                <p className="text-sm text-[#F5F3EF]/80 mb-3">{text.work} {text.citation}</p>
                                <p className="text-sm italic line-clamp-3 mb-4">"{text.text}"</p>
                                <div className="flex flex-wrap gap-1">
                                  {text.grammarTopics.slice(0, 3).map((topic, i) => (
                                    <span key={i} className="px-2 py-1 bg-[#7C9885]/20 text-[#7C9885] text-xs rounded">
                                      {topic}
                                    </span>
                                  ))}
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        )
                      }
                    ]}
                    currentView="sample_texts"
                    onViewChange={() => {}}
                  />

                  {selectedText && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-8 p-6 bg-[#C9A962]/10 border border-[#C9A962]/30 rounded-xl"
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <CheckCircle className="w-5 h-5 text-[#C9A962]" />
                        <h3 className="font-bold">Text Selected</h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-[#F5F3EF]/60">Author:</span>
                          <p className="font-medium">{selectedText.author}</p>
                        </div>
                        <div>
                          <span className="text-[#F5F3EF]/60">Work:</span>
                          <p className="font-medium">{selectedText.work}</p>
                        </div>
                        <div>
                          <span className="text-[#F5F3EF]/60">Citation:</span>
                          <p className="font-medium">{selectedText.citation}</p>
                        </div>
                      </div>
                      <div className="mt-4 flex justify-end">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setActiveTab('configure')}
                          className="px-6 py-2 bg-[#C9A962] hover:bg-[#C9A962]/80 rounded-lg font-medium transition-all flex items-center gap-2"
                        >
                          Continue to Configuration
                          <ArrowRight className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              )}

              {/* Configuration Tab */}
              {activeTab === 'configure' && (
                <motion.div
                  key="configure"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="p-8"
                >
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                      <Grid3X3 className="w-6 h-6 text-[#C9A962]" />
                      <h2 className="text-2xl font-bold">Configure Quiz</h2>
                      <span className="text-sm text-[#F5F3EF]/60">Step 2 of 4</span>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg font-medium transition-all flex items-center gap-2"
                    >
                      <Settings className="w-4 h-4" />
                      Advanced Settings
                    </motion.button>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Question Types */}
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                          <Type className="w-5 h-5 text-[#C9A962]" />
                          Question Types
                        </h3>
                        <div className="space-y-3">
                          {questionTypes.map((type) => (
                            <motion.div
                              key={type.id}
                              whileHover={{ scale: 1.01 }}
                              className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                                activeQuestionTypes.includes(type.id)
                                  ? 'border-[#C9A962] bg-[#C9A962]/10'
                                  : 'border-white/20 bg-white/5 hover:border-[#C9A962]/50'
                              }`}
                              onClick={() => {
                                setActiveQuestionTypes(prev => 
                                  prev.includes(type.id)
                                    ? prev.filter(t => t !== type.id)
                                    : [...prev, type.id]
                                )
                              }}
                            >
                              <div className="flex items-center gap-3 mb-2">
                                <div className={`p-2 rounded-lg bg-gradient-to-r ${type.color}`}>
                                  {type.icon}
                                </div>
                                <div className="flex-1">
                                  <h4 className="font-bold">{type.name}</h4>
                                  <p className="text-sm text-[#F5F3EF]/60">{type.description}</p>
                                </div>
                                {activeQuestionTypes.includes(type.id) && (
                                  <CheckCircle className="w-5 h-5 text-[#C9A962]" />
                                )}
                              </div>
                              <div className="text-xs text-[#F5F3EF]/50">{type.difficulty}</div>
                            </motion.div>
                          ))}
                        </div>
                      </div>

                      {/* Quiz Templates */}
                      <div>
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                          <BookMarked className="w-5 h-5 text-[#7C9885]" />
                          Quick Templates
                        </h3>
                        <div className="grid grid-cols-1 gap-3">
                          {quizTemplates.map((template) => (
                            <motion.button
                              key={template.id}
                              whileHover={{ scale: 1.01 }}
                              whileTap={{ scale: 0.99 }}
                              onClick={() => {
                                setActiveQuestionTypes(template.questionTypes)
                                setDifficultyLevel(template.targetLevel)
                              }}
                              className="p-4 bg-white/5 hover:bg-white/10 border border-white/20 hover:border-[#7C9885] rounded-xl transition-all text-left"
                            >
                              <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-[#7C9885]/20 rounded-lg">
                                  {template.icon}
                                </div>
                                <div className="flex-1">
                                  <h4 className="font-bold">{template.name}</h4>
                                  <p className="text-sm text-[#F5F3EF]/60">{template.description}</p>
                                </div>
                                <div className="text-right text-sm">
                                  <div className="text-[#7C9885]">{template.estimatedTime} min</div>
                                  <div className="text-[#F5F3EF]/50 capitalize">{template.targetLevel}</div>
                                </div>
                              </div>
                            </motion.button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Difficulty & Settings */}
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                          <BarChart3 className="w-5 h-5 text-[#8B7355]" />
                          Difficulty Level
                        </h3>
                        <div className="space-y-3">
                          {difficultyLevels.map((level) => (
                            <motion.div
                              key={level.id}
                              whileHover={{ scale: 1.01 }}
                              className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                                difficultyLevel === level.id
                                  ? 'border-[#C9A962] bg-[#C9A962]/10'
                                  : 'border-white/20 bg-white/5 hover:border-[#C9A962]/50'
                              }`}
                              onClick={() => setDifficultyLevel(level.id)}
                            >
                              <div className="flex items-center justify-between mb-3">
                                <div>
                                  <h4 className="font-bold">{level.name}</h4>
                                  <p className="text-sm text-[#F5F3EF]/60">{level.description}</p>
                                </div>
                                {difficultyLevel === level.id && (
                                  <CheckCircle className="w-5 h-5 text-[#C9A962]" />
                                )}
                              </div>
                              <div className="flex flex-wrap gap-1">
                                {level.features.map((feature, i) => (
                                  <span key={i} className={`px-2 py-1 text-xs rounded bg-gradient-to-r ${level.color} text-white`}>
                                    {feature}
                                  </span>
                                ))}
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>

                      {/* Advanced Settings */}
                      <div>
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                          <Sliders className="w-5 h-5 text-[#7C9885]" />
                          Quiz Settings
                        </h3>
                        <div className="bg-white/5 border border-white/20 rounded-xl p-6 space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium mb-2">Question Count</label>
                              <input
                                type="number"
                                value={quizSettings.questionCount}
                                onChange={(e) => setQuizSettings(prev => ({ ...prev, questionCount: parseInt(e.target.value) }))}
                                className="w-full bg-white/5 border border-white/20 rounded-lg px-3 py-2 focus:border-[#C9A962] transition-all"
                                min="5"
                                max="50"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-2">Time Limit (minutes)</label>
                              <input
                                type="number"
                                value={quizSettings.timeLimit}
                                onChange={(e) => setQuizSettings(prev => ({ ...prev, timeLimit: parseInt(e.target.value) }))}
                                className="w-full bg-white/5 border border-white/20 rounded-lg px-3 py-2 focus:border-[#C9A962] transition-all"
                                min="5"
                                max="180"
                              />
                            </div>
                          </div>
                          
                          <div className="space-y-3">
                            {[
                              { key: 'randomOrder', label: 'Randomize Question Order', icon: RefreshCw },
                              { key: 'showFeedback', label: 'Show Immediate Feedback', icon: Lightbulb },
                              { key: 'allowRetakes', label: 'Allow Multiple Attempts', icon: RotateCcw },
                              { key: 'adaptiveDifficulty', label: 'Adaptive Difficulty', icon: Brain }
                            ].map(({ key, label, icon: Icon }) => (
                              <label key={key} className="flex items-center gap-3 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={quizSettings[key as keyof typeof quizSettings] as boolean}
                                  onChange={(e) => setQuizSettings(prev => ({ ...prev, [key]: e.target.checked }))}
                                  className="w-4 h-4 text-[#C9A962] border-white/20 rounded focus:ring-[#C9A962] focus:ring-2"
                                />
                                <Icon className="w-4 h-4 text-[#C9A962]" />
                                <span className="text-sm">{label}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center mt-8 pt-6 border-t border-white/20">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setActiveTab('select')}
                      className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-lg font-medium transition-all"
                    >
                      Back to Text Selection
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={generateQuiz}
                      disabled={!selectedText || activeQuestionTypes.length === 0 || isGenerating}
                      className="px-8 py-3 bg-gradient-to-r from-[#C9A962] to-[#8B7355] hover:from-[#C9A962]/80 hover:to-[#8B7355]/80 rounded-lg font-bold transition-all flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isGenerating ? (
                        <>
                          <RefreshCw className="w-5 h-5 animate-spin" />
                          Generating Quiz...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-5 h-5" />
                          Generate Quiz with AI
                        </>
                      )}
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {/* Preview Tab */}
              {activeTab === 'preview' && (
                <motion.div
                  key="preview"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="p-8"
                >
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                      <FileText className="w-6 h-6 text-[#C9A962]" />
                      <h2 className="text-2xl font-bold">Quiz Preview</h2>
                      <span className="text-sm text-[#F5F3EF]/60">Step 3 of 4</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setShowAnswerKeys(!showAnswerKeys)}
                        className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg font-medium transition-all flex items-center gap-2"
                      >
                        <Key className="w-4 h-4" />
                        {showAnswerKeys ? 'Hide' : 'Show'} Answer Keys
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={generateQuiz}
                        className="px-4 py-2 bg-[#7C9885] hover:bg-[#7C9885]/80 rounded-lg font-medium transition-all flex items-center gap-2"
                      >
                        <RefreshCw className="w-4 h-4" />
                        Regenerate
                      </motion.button>
                    </div>
                  </div>

                  {generatedQuiz.length > 0 ? (
                    <div className="space-y-6">
                      {/* Quiz Header */}
                      <div className="bg-gradient-to-r from-[#C9A962]/20 to-[#8B7355]/20 border border-[#C9A962]/30 rounded-xl p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-xl font-bold">
                            Quiz: {selectedText?.author} - {selectedText?.work} {selectedText?.citation}
                          </h3>
                          <div className="flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {quizSettings.timeLimit} minutes
                            </div>
                            <div className="flex items-center gap-1">
                              <FileText className="w-4 h-4" />
                              {generatedQuiz.length} questions
                            </div>
                            <div className="flex items-center gap-1">
                              <BarChart3 className="w-4 h-4" />
                              {difficultyLevel}
                            </div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div className="bg-white/10 rounded-lg p-3">
                            <div className="text-[#F5F3EF]/60">Question Types</div>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {activeQuestionTypes.map(type => (
                                <span key={type} className="px-2 py-1 bg-[#C9A962]/20 text-[#C9A962] rounded text-xs">
                                  {questionTypes.find(qt => qt.id === type)?.name}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div className="bg-white/10 rounded-lg p-3">
                            <div className="text-[#F5F3EF]/60">Settings</div>
                            <div className="mt-1">
                              {quizSettings.randomOrder && <div className="text-xs">• Random order</div>}
                              {quizSettings.showFeedback && <div className="text-xs">• Immediate feedback</div>}
                              {quizSettings.adaptiveDifficulty && <div className="text-xs">• Adaptive difficulty</div>}
                            </div>
                          </div>
                          <div className="bg-white/10 rounded-lg p-3">
                            <div className="text-[#F5F3EF]/60">Source Text</div>
                            <div className="text-xs italic mt-1 line-clamp-2">
                              "{selectedText?.text.slice(0, 100)}..."
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Questions */}
                      <div className="space-y-4">
                        {generatedQuiz.map((question, index) => (
                          <motion.div
                            key={question.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white/5 border border-white/20 rounded-xl p-6"
                          >
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-[#C9A962] rounded-lg flex items-center justify-center text-white font-bold">
                                  {index + 1}
                                </div>
                                <div>
                                  <h4 className="font-bold">{question.question}</h4>
                                  <div className="flex items-center gap-2 mt-1">
                                    <span className={`px-2 py-1 rounded text-xs ${
                                      question.type === 'multiple_choice' ? 'bg-blue-500/20 text-blue-400' :
                                      question.type === 'translation' ? 'bg-green-500/20 text-green-400' :
                                      question.type === 'parsing' ? 'bg-orange-500/20 text-orange-400' :
                                      'bg-purple-500/20 text-purple-400'
                                    }`}>
                                      {questionTypes.find(qt => qt.id === question.type)?.name}
                                    </span>
                                    <span className={`px-2 py-1 rounded text-xs ${
                                      question.difficulty === 'novice' ? 'bg-green-500/20 text-green-400' :
                                      question.difficulty === 'intermediate' ? 'bg-yellow-500/20 text-yellow-400' :
                                      question.difficulty === 'advanced' ? 'bg-orange-500/20 text-orange-400' :
                                      'bg-red-500/20 text-red-400'
                                    }`}>
                                      {question.difficulty}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {question.options && (
                              <div className="grid grid-cols-2 gap-2 mb-4">
                                {question.options.map((option, optIndex) => (
                                  <div
                                    key={optIndex}
                                    className={`p-3 rounded-lg border transition-all ${
                                      showAnswerKeys && option === question.correctAnswer
                                        ? 'border-green-500 bg-green-500/10'
                                        : 'border-white/20 bg-white/5'
                                    }`}
                                  >
                                    <span className="font-medium mr-2">
                                      {String.fromCharCode(65 + optIndex)}.
                                    </span>
                                    {option}
                                    {showAnswerKeys && option === question.correctAnswer && (
                                      <CheckCircle className="w-4 h-4 text-green-400 ml-2" />
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <FileText className="w-16 h-16 text-white/20 mx-auto mb-4" />
                      <p className="text-white/60">Generate questions to preview your quiz</p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}

export default QuizCreatorPage
