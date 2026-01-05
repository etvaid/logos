
'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  BookOpen, 
  Brain, 
  Users, 
  Download, 
  Sparkles, 
  Target, 
  Clock, 
  Layers, 
  Zap,
  CheckCircle,
  ArrowRight,
  Plus,
  Edit3,
  Share2,
  Calendar,
  FileText,
  Globe,
  Settings,
  Star,
  TrendingUp,
  Award,
  Lightbulb,
  Search,
  Filter,
  RotateCcw,
  Save,
  Eye,
  Play,
  Pause,
  SkipForward
} from 'lucide-react'
import { MultiScaleView } from '@/components/innovations/multi_scale_view'
import { NarrativeTimeline } from '@/components/innovations/narrative_timeline'

interface LessonPlan {
  id: string
  title: string
  topic: string
  duration: number
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  objectives: string[]
  activities: Activity[]
  assessments: Assessment[]
  resources: Resource[]
  created: Date
  lastModified: Date
}

interface Activity {
  id: string
  type: 'reading' | 'grammar' | 'vocabulary' | 'composition' | 'discussion' | 'assessment'
  title: string
  description: string
  duration: number
  materials: string[]
  instructions: string[]
  adaptations: Adaptation[]
}

interface Assessment {
  id: string
  type: 'formative' | 'summative'
  title: string
  description: string
  rubric: RubricCriteria[]
}

interface RubricCriteria {
  criterion: string
  levels: { level: string; description: string; points: number }[]
}

interface Resource {
  id: string
  type: 'text' | 'audio' | 'video' | 'interactive'
  title: string
  url: string
  description: string
}

interface Adaptation {
  level: string
  modification: string
}

interface Topic {
  id: string
  name: string
  category: string
  difficulty: string
  prerequisites: string[]
  learningOutcomes: string[]
  estimatedTime: number
}

const SAMPLE_TOPICS: Topic[] = [
  {
    id: '1',
    name: 'Ablative Absolute Construction',
    category: 'Grammar',
    difficulty: 'Advanced',
    prerequisites: ['Participles', 'Case System', 'Ablative Uses'],
    learningOutcomes: ['Identify ablative absolute in context', 'Translate accurately', 'Compose original examples'],
    estimatedTime: 90
  },
  {
    id: '2',
    name: 'Cicero\'s First Catiline Oration',
    category: 'Literature',
    difficulty: 'Intermediate',
    prerequisites: ['Basic syntax', 'Political vocabulary', 'Rhetorical figures'],
    learningOutcomes: ['Analyze rhetorical strategies', 'Understand historical context', 'Parse complex sentences'],
    estimatedTime: 120
  },
  {
    id: '3',
    name: 'Deponent Verbs',
    category: 'Grammar',
    difficulty: 'Beginner',
    prerequisites: ['Verb conjugation', 'Active/passive voice'],
    learningOutcomes: ['Recognize deponent forms', 'Translate correctly', 'Distinguish from passive'],
    estimatedTime: 60
  }
]

const ACTIVITY_TEMPLATES = {
  reading: {
    icon: BookOpen,
    color: 'from-blue-500 to-cyan-500',
    templates: ['Close Reading', 'Sight Reading', 'Comparative Reading', 'Guided Reading']
  },
  grammar: {
    icon: Target,
    color: 'from-purple-500 to-pink-500',
    templates: ['Parsing Practice', 'Form Drill', 'Syntax Analysis', 'Error Correction']
  },
  vocabulary: {
    icon: Brain,
    color: 'from-green-500 to-teal-500',
    templates: ['Word Study', 'Etymology Exploration', 'Semantic Fields', 'Frequency Lists']
  },
  composition: {
    icon: Edit3,
    color: 'from-orange-500 to-red-500',
    templates: ['Prose Composition', 'Translation', 'Imitation Exercises', 'Creative Writing']
  },
  discussion: {
    icon: Users,
    color: 'from-indigo-500 to-purple-500',
    templates: ['Socratic Seminar', 'Debate', 'Think-Pair-Share', 'Literature Circles']
  },
  assessment: {
    icon: CheckCircle,
    color: 'from-yellow-500 to-orange-500',
    templates: ['Quiz', 'Test', 'Project', 'Portfolio Assessment']
  }
}

export default function LessonPlannerPage() {
  const [currentStep, setCurrentStep] = useState<'select' | 'generate' | 'customize' | 'export'>('select')
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null)
  const [generatedPlan, setGeneratedPlan] = useState<LessonPlan | null>(null)
  const [customizations, setCustomizations] = useState<Record<string, any>>({})
  const [isGenerating, setIsGenerating] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showPreview, setShowPreview] = useState(false)

  const filteredTopics = SAMPLE_TOPICS.filter(topic => {
    const matchesSearch = topic.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         topic.category.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || topic.category === selectedCategory
    const matchesDifficulty = selectedDifficulty === 'all' || topic.difficulty === selectedDifficulty
    
    return matchesSearch && matchesCategory && matchesDifficulty
  })

  const generateLessonPlan = async (topic: Topic) => {
    setIsGenerating(true)
    setCurrentStep('generate')
    
    // Simulate AI generation
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    const plan: LessonPlan = {
      id: Date.now().toString(),
      title: `Mastering ${topic.name}`,
      topic: topic.name,
      duration: topic.estimatedTime,
      difficulty: topic.difficulty as any,
      objectives: topic.learningOutcomes,
      activities: generateActivities(topic),
      assessments: generateAssessments(topic),
      resources: generateResources(topic),
      created: new Date(),
      lastModified: new Date()
    }
    
    setGeneratedPlan(plan)
    setIsGenerating(false)
    setCurrentStep('customize')
  }

  const generateActivities = (topic: Topic): Activity[] => {
    return [
      {
        id: '1',
        type: 'vocabulary',
        title: 'Pre-Reading Vocabulary',
        description: 'Introduce key terms and concepts',
        duration: 15,
        materials: ['Vocabulary handout', 'Etymology charts'],
        instructions: [
          'Review essential vocabulary',
          'Explore word origins',
          'Practice pronunciation'
        ],
        adaptations: [
          { level: 'Beginner', modification: 'Provide additional visual aids' },
          { level: 'Advanced', modification: 'Include derived terms and compounds' }
        ]
      },
      {
        id: '2',
        type: 'reading',
        title: 'Guided Text Analysis',
        description: 'Close reading with scaffolded support',
        duration: 30,
        materials: ['Primary text', 'Parsing sheets', 'Commentary'],
        instructions: [
          'Read passage aloud',
          'Identify key grammatical structures',
          'Discuss meaning and context'
        ],
        adaptations: [
          { level: 'Beginner', modification: 'Provide pre-parsed sentences' },
          { level: 'Advanced', modification: 'Include stylistic analysis' }
        ]
      },
      {
        id: '3',
        type: 'grammar',
        title: 'Interactive Grammar Workshop',
        description: 'Practice identifying and using target structures',
        duration: 25,
        materials: ['Digital exercises', 'Manipulatives', 'Practice sentences'],
        instructions: [
          'Complete identification exercises',
          'Practice formation drills',
          'Create original examples'
        ],
        adaptations: [
          { level: 'Beginner', modification: 'Use visual grammar guides' },
          { level: 'Advanced', modification: 'Include complex variations' }
        ]
      },
      {
        id: '4',
        type: 'assessment',
        title: 'Formative Check',
        description: 'Quick assessment of understanding',
        duration: 10,
        materials: ['Exit tickets', 'Digital polling'],
        instructions: [
          'Complete quick check exercises',
          'Identify areas of confusion',
          'Plan follow-up activities'
        ],
        adaptations: [
          { level: 'Beginner', modification: 'Simplified question format' },
          { level: 'Advanced', modification: 'Include application questions' }
        ]
      }
    ]
  }

  const generateAssessments = (topic: Topic): Assessment[] => {
    return [
      {
        id: '1',
        type: 'formative',
        title: 'Understanding Check',
        description: 'Quick assessment during lesson',
        rubric: [
          {
            criterion: 'Recognition',
            levels: [
              { level: 'Developing', description: 'Identifies with support', points: 1 },
              { level: 'Proficient', description: 'Identifies independently', points: 2 },
              { level: 'Advanced', description: 'Identifies and explains', points: 3 }
            ]
          }
        ]
      },
      {
        id: '2',
        type: 'summative',
        title: 'Unit Assessment',
        description: 'Comprehensive evaluation of learning objectives',
        rubric: [
          {
            criterion: 'Application',
            levels: [
              { level: 'Developing', description: 'Limited application', points: 1 },
              { level: 'Proficient', description: 'Consistent application', points: 2 },
              { level: 'Advanced', description: 'Creative application', points: 3 }
            ]
          }
        ]
      }
    ]
  }

  const generateResources = (topic: Topic): Resource[] => {
    return [
      {
        id: '1',
        type: 'text',
        title: 'Primary Source Material',
        url: '#',
        description: 'Authentic Latin texts with annotations'
      },
      {
        id: '2',
        type: 'interactive',
        title: 'Grammar Visualization Tool',
        url: '#',
        description: 'Interactive diagrams and exercises'
      },
      {
        id: '3',
        type: 'video',
        title: 'Expert Commentary',
        url: '#',
        description: 'Scholarly insights and explanations'
      }
    ]
  }

  const timelineData = [
    {
      id: '1',
      title: 'Topic Selection',
      description: 'Choose your learning objective',
      timestamp: 0,
      type: 'milestone' as const,
      status: currentStep === 'select' ? 'active' : 'completed' as const
    },
    {
      id: '2',
      title: 'AI Generation',
      description: 'Create intelligent lesson structure',
      timestamp: 1,
      type: 'milestone' as const,
      status: currentStep === 'generate' ? 'active' : currentStep === 'select' ? 'pending' : 'completed' as const
    },
    {
      id: '3',
      title: 'Customization',
      description: 'Adapt to your teaching style',
      timestamp: 2,
      type: 'milestone' as const,
      status: currentStep === 'customize' ? 'active' : ['select', 'generate'].includes(currentStep) ? 'pending' : 'completed' as const
    },
    {
      id: '4',
      title: 'Export & Deploy',
      description: 'Share with your students',
      timestamp: 3,
      type: 'milestone' as const,
      status: currentStep === 'export' ? 'active' : 'pending' as const
    }
  ]

  const scaleViews = [
    {
      id: 'overview',
      title: 'Course Overview',
      description: 'Complete curriculum structure',
      scale: 1
    },
    {
      id: 'unit',
      title: 'Unit Focus',
      description: 'Weekly learning modules',
      scale: 0.5
    },
    {
      id: 'lesson',
      title: 'Lesson Detail',
      description: 'Individual class sessions',
      scale: 0.2
    },
    {
      id: 'activity',
      title: 'Activity Level',
      description: 'Specific learning tasks',
      scale: 0.1
    }
  ]

  return (
    <div className="min-h-screen bg-[#0D0D0F] text-[#F5F3EF]">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#C9A962]/10 via-[#7C9885]/5 to-transparent" />
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-2 h-2 bg-[#C9A962] rounded-full animate-pulse" />
          <div className="absolute top-40 right-20 w-1 h-1 bg-[#8B7355] rounded-full animate-pulse delay-1000" />
          <div className="absolute bottom-20 left-1/3 w-1.5 h-1.5 bg-[#7C9885] rounded-full animate-pulse delay-2000" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-6 py-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-xl rounded-full px-6 py-3 mb-8 border border-white/10"
            >
              <Sparkles className="w-5 h-5 text-[#C9A962]" />
              <span className="text-sm font-medium">Pedagogy Engine</span>
            </motion.div>
            
            <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-[#F5F3EF] via-[#C9A962] to-[#F5F3EF] bg-clip-text text-transparent">
              Lesson Planner
            </h1>
            
            <p className="text-xl md:text-2xl text-[#F5F3EF]/70 mb-8 leading-relaxed">
              Tools that actually help people learn
            </p>
            
            <p className="text-lg text-[#F5F3EF]/60 max-w-3xl mx-auto leading-relaxed">
              Create pedagogically sound lesson plans with AI assistance. From topic selection to LMS export, 
              build engaging classical language instruction that adapts to every learner.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Progress Timeline */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <NarrativeTimeline
          events={timelineData}
          className="mb-12"
        />
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 pb-24">
        <AnimatePresence mode="wait">
          {currentStep === 'select' && (
            <motion.div
              key="select"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="space-y-8"
            >
              {/* Topic Selection Header */}
              <div className="text-center max-w-2xl mx-auto">
                <h2 className="text-4xl font-bold mb-4">Choose Your Topic</h2>
                <p className="text-[#F5F3EF]/70">
                  Select a learning objective to generate a comprehensive lesson plan
                </p>
              </div>

              {/* Search and Filters */}
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#F5F3EF]/40" />
                    <input
                      type="text"
                      placeholder="Search topics..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full bg-white/5 border border-white/20 rounded-lg pl-10 pr-4 py-3 text-[#F5F3EF] placeholder-[#F5F3EF]/40 focus:outline-none focus:border-[#C9A962]/50 focus:ring-2 focus:ring-[#C9A962]/20"
                    />
                  </div>
                  
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-[#F5F3EF] focus:outline-none focus:border-[#C9A962]/50"
                  >
                    <option value="all">All Categories</option>
                    <option value="Grammar">Grammar</option>
                    <option value="Literature">Literature</option>
                    <option value="Culture">Culture</option>
                  </select>
                  
                  <select
                    value={selectedDifficulty}
                    onChange={(e) => setSelectedDifficulty(e.target.value)}
                    className="bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-[#F5F3EF] focus:outline-none focus:border-[#C9A962]/50"
                  >
                    <option value="all">All Levels</option>
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
              </div>

              {/* Topics Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTopics.map((topic, index) => (
                  <motion.div
                    key={topic.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="group bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-6 hover:border-[#C9A962]/30 transition-all duration-300 cursor-pointer"
                    onClick={() => setSelectedTopic(topic)}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className={`p-3 rounded-lg bg-gradient-to-br ${
                        topic.category === 'Grammar' ? 'from-purple-500/20 to-pink-500/20' :
                        topic.category === 'Literature' ? 'from-blue-500/20 to-cyan-500/20' :
                        'from-green-500/20 to-teal-500/20'
                      }`}>
                        <BookOpen className="w-6 h-6 text-[#C9A962]" />
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        topic.difficulty === 'Beginner' ? 'bg-green-500/20 text-green-300' :
                        topic.difficulty === 'Intermediate' ? 'bg-yellow-500/20 text-yellow-300' :
                        'bg-red-500/20 text-red-300'
                      }`}>
                        {topic.difficulty}
                      </span>
                    </div>
                    
                    <h3 className="text-xl font-bold mb-2 group-hover:text-[#C9A962] transition-colors">
                      {topic.name}
                    </h3>
                    
                    <p className="text-[#F5F3EF]/60 text-sm mb-4">{topic.category}</p>
                    
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs font-medium text-[#F5F3EF]/80 mb-1">Prerequisites</p>
                        <div className="flex flex-wrap gap-1">
                          {topic.prerequisites.slice(0, 2).map((prereq, i) => (
                            <span key={i} className="bg-white/10 text-xs px-2 py-1 rounded">
                              {prereq}
                            </span>
                          ))}
                          {topic.prerequisites.length > 2 && (
                            <span className="text-xs text-[#F5F3EF]/60">+{topic.prerequisites.length - 2} more</span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 text-[#F5F3EF]/60">
                          <Clock className="w-4 h-4" />
                          <span>{topic.estimatedTime} min</span>
                        </div>
                        <div className="flex items-center gap-2 text-[#C9A962] opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="text-sm font-medium">Generate Plan</span>
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Selected Topic Details */}
              <AnimatePresence>
                {selectedTopic && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-8"
                  >
                    <div className="flex items-start justify-between mb-6">
                      <div>
                        <h3 className="text-2xl font-bold mb-2">{selectedTopic.name}</h3>
                        <p className="text-[#F5F3EF]/70">{selectedTopic.category} • {selectedTopic.difficulty} Level</p>
                      </div>
                      <button
                        onClick={() => generateLessonPlan(selectedTopic)}
                        className="bg-gradient-to-r from-[#C9A962] to-[#8B7355] text-[#0D0D0F] px-6 py-3 rounded-lg font-medium hover:shadow-lg hover:shadow-[#C9A962]/25 transition-all duration-300 flex items-center gap-2"
                      >
                        <Sparkles className="w-5 h-5" />
                        Generate Lesson Plan
                      </button>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-8">
                      <div>
                        <h4 className="font-bold mb-3 text-[#C9A962]">Learning Outcomes</h4>
                        <ul className="space-y-2">
                          {selectedTopic.learningOutcomes.map((outcome, i) => (
                            <li key={i} className="flex items-start gap-2 text-[#F5F3EF]/80">
                              <CheckCircle className="w-4 h-4 text-[#7C9885] mt-0.5 flex-shrink-0" />
                              <span>{outcome}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-bold mb-3 text-[#C9A962]">Prerequisites</h4>
                        <ul className="space-y-2">
                          {selectedTopic.prerequisites.map((prereq, i) => (
                            <li key={i} className="flex items-start gap-2 text-[#F5F3EF]/80">
                              <Target className="w-4 h-4 text-[#8B7355] mt-0.5 flex-shrink-0" />
                              <span>{prereq}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {currentStep === 'generate' && (
            <motion.div
              key="generate"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="text-center max-w-2xl mx-auto"
            >
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-12">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="w-16 h-16 bg-gradient-to-r from-[#C9A962] to-[#8B7355] rounded-full flex items-center justify-center mx-auto mb-6"
                >
                  <Brain className="w-8 h-8 text-[#0D0D0F]" />
                </motion.div>
                
                <h2 className="text-3xl font-bold mb-4">Creating Your Lesson Plan</h2>
                <p className="text-[#F5F3EF]/70 mb-8">
                  Our AI pedagogy engine is analyzing learning objectives and generating 
                  a comprehensive, adaptive lesson structure...
                </p>
                
                <div className="space-y-4">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 3 }}
                    className="h-2 bg-gradient-to-r from-[#C9A962] to-[#7C9885] rounded-full"
                  />
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-[#7C9885]" />
                      <span>Analyzing prerequisites</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-[#7C9885]" />
                      <span>Generating activities</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-[#7C9885]" />
                      <span>Creating assessments</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-[#7C9885]" />
                      <span>Sourcing resources</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {currentStep === 'customize' && generatedPlan && (
            <motion.div
              key="customize"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="space-y-8"
            >
              {/* Lesson Plan Header */}
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-8">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-3xl font-bold mb-2">{generatedPlan.title}</h2>
                    <div className="flex items-center gap-4 text-[#F5F3EF]/70">
                      <span className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        {generatedPlan.duration} minutes
                      </span>
                      <span className="flex items-center gap-2">
                        <Target className="w-4 h-4" />
                        {generatedPlan.difficulty}
                      </span>
                      <span className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        {generatedPlan.activities.length} activities
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowPreview(!showPreview)}
                      className="bg-white/10 hover:bg-white/20 text-[#F5F3EF] px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      Preview
                    </button>
                    <button
                      onClick={() => setCurrentStep('export')}
                      className="bg-gradient-to-r from-[#C9A962] to-[#8B7355] text-[#0D0D0F] px-6 py-2 rounded-lg font-medium hover:shadow-lg hover:shadow-[#C9A962]/25 transition-all duration-300"
                    >
                      Export Plan
                    </button>
                  </div>
                </div>
                
                {/* Learning Objectives */}
                <div>
                  <h3 className="font-bold mb-3 text-[#C9A962]">Learning Objectives</h3>
                  <div className="grid md:grid-cols-2 gap-3">
                    {generatedPlan.objectives.map((objective, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <Star className="w-4 h-4 text-[#C9A962] mt-0.5 flex-shrink-0" />
                        <span className="text-[#F5F3EF]/80">{objective}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Scale View Integration */}
              <MultiScaleView
                views={scaleViews}
                onScaleChange={(scale) => console.log('Scale changed:', scale)}
                className="mb-8"
              />

              {/* Activities Customization */}
              <div className="space-y-6">
                <h3 className="text-2xl font-bold">Customize Activities</h3>
                
                {generatedPlan.activities.map((activity, index) => {
                  const ActivityIcon = ACTIVITY_TEMPLATES[activity.type]?.icon || BookOpen
                  const colorClass = ACTIVITY_TEMPLATES[activity.type]?.color || 'from-gray-500 to-gray-600'
                  
                  return (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-6"
                    >
                      <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-lg bg-gradient-to-br ${colorClass.replace('from-', 'from-').replace('to-', 'to-').replace('500', '500/20')}`}>
                          <ActivityIcon className="w-6 h-6 text-[#C9A962]" />
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h4 className="text-xl font-bold mb-1">{activity.title}</h4>
                              <p className="text-[#F5F3EF]/70 mb-2">{activity.description}</p>
                              <div className="flex items-center gap-4 text-sm text-[#F5F3EF]/60">
                                <span className="flex items-center gap-1">
                                  <Clock className="w-4 h-4" />
                                  {activity.duration} min
                                </span>
                                <span className="capitalize">{activity.type}</span>
                              </div>
                            </div>
                            
                            <div className="flex gap-2">
                              <button className="bg-white/10 hover:bg-white/20 text-[#F5F3EF] p-2 rounded-lg transition-colors">
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button className="bg-white/10 hover:bg-white/20 text-[#F5F3EF] p-2 rounded-lg transition-colors">
                                <Settings className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                          
                          <div className="grid md:grid-cols-2 gap-6">
                            <div>
                              <h5 className="font-medium mb-2 text-[#C9A962]">Instructions</h5>
                              <ul className="space-y-1">
                                {activity.instructions.map((instruction, i) => (
                                  <li key={i} className="text-sm text-[#F5F3EF]/80 flex items-start gap-2">
                                    <span className="w-1 h-1 bg-[#7C9885] rounded-full mt-2 flex-shrink-0" />
                                    {instruction}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            
                            <div>
                              <h5 className="font-medium mb-2 text-[#C9A962]">Materials</h5>
                              <div className="flex flex-wrap gap-1">
                                {activity.materials.map((material, i) => (
                                  <span key={i} className="bg-white/10 text-xs px-2 py-1 rounded">
                                    {material}
                                  </span>
                                ))}
                              </div>
                              
                              {activity.adaptations.length > 0 && (
                                <div className="mt-4">
                                  <h5 className="font-medium mb-2 text-[#C9A962]">Adaptations</h5>
                                  <div className="space-y-1">
                                    {activity.adaptations.map((adaptation, i) => (
                                      <div key={i} className="text-xs">
                                        <span className="font-medium text-[#8B7355]">{adaptation.level}:</span>
                                        <span className="text-[#F5F3EF]/70 ml-1">{adaptation.modification}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>

              {/* Quick Customization Panel */}
              <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-6">
                <h3 className="text-xl font-bold mb-4">Quick Customizations</h3>
                
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Lesson Duration</label>
                    <select className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-[#F5F3EF] focus:outline-none focus:border-[#C9A962]/50">
                      <option value="60">60 minutes</option>
                      <option value="90" selected>90 minutes</option>
                      <option value="120">120 minutes</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Class Size</label>
                    <select className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-[#F5F3EF] focus:outline-none focus:border-[#C9A962]/50">
                      <option value="small">Small (5-15)</option>
                      <option value="medium" selected>Medium (16-25)</option>
                      <option value="large">Large (25+)</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Technology Level</label>
                    <select className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-[#F5F3EF] focus:outline-none focus:border-[#C9A962]/50">
                      <option value="low">Low-tech</option>
                      <option value="medium" selected>Mixed</option>
                      <option value="high">High-tech</option>
                    </select>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {currentStep === 'export' && generatedPlan && (
            <motion.div
              key="export"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="space-y-8"
            >
              <div className="text-center max-w-2xl mx-auto">
                <h2 className="text-4xl font-bold mb-4">Export Your Lesson Plan</h2>
                <p className="text-[#F5F3EF]/70">
                  Choose how to share your lesson plan with students and colleagues
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { icon: Download, title: 'Download PDF', description: 'Print-friendly format with all details', color: 'from-red-500 to-pink-500' },
                  { icon: Share2, title: 'Canvas LMS', description: 'Import directly to Canvas course', color: 'from-blue-500 to-cyan-500' },
                  { icon: Globe, title: 'Blackboard', description: 'Export to Blackboard Learn', color: 'from-purple-500 to-indigo-500' },
                  { icon: FileText, title: 'Google Docs', description: 'Collaborative editing format', color: 'from-green-500 to-teal-500' },
                  { icon: Calendar, title: 'Moodle', description: 'Structured course module', color: 'from-orange-500 to-red-500' },
                  { icon: Sparkles, title: 'LOGOS Native', description: 'Full interactive experience', color: 'from-yellow-500 to-orange-500' }
                ].map((option, index) => (
                  <motion.div
                    key={option.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="group bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-6 hover:border-[#C9A962]/30 transition-all duration-300 cursor-pointer"
                  >
                    <div className={`p-4 rounded-lg bg-gradient-to-br ${option.color.replace('500', '500/20')} mb-4`}>
                      <option.icon className="w-8 h-8 text-[#C9A962]" />
                    </div>
                    
                    <h3 className="text-xl font-bold mb-2 group-hover:text-[#C9A962] transition-colors">
                      {option.title}
                    </h3>
                    
                    <p className="text-[#F5F3EF]/60 mb-4">{option.description}</p>
                    
                    <div className="flex items-center text-[#C9A962] opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-sm font-medium mr-2">Export Now</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Export Preview */}
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-8">
                <h3 className="text-2xl font-bold mb-6">Export Preview</h3>
                
                <div className="grid lg:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h4 className="font-bold text-[#C9A962]">What's Included</h4>
                    <div className="space-y-2">
                      {[
                        'Complete lesson timeline',
                        'All activity instructions',
                        'Assessment rubrics',
                        'Resource links and materials',
                        'Differentiation strategies',
                        'Learning objectives alignment'
                      ].map((item, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-[#7C9885]" />
                          <span className="text-[#F5F3EF]/80">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="font-bold text-[#C9A962]">Export Options</h4>
                    <div className="space-y-3">
                      <label className="flex items-center gap-3">
                        <input type="checkbox" defaultChecked className="rounded bg-white/10 border-white/20 text-[#C9A962] focus:ring-[#C9A962]/50" />
                        <span className="text-[#F5F3EF]/80">Include answer keys</span>
                      </label>
                      <label className="flex items-center gap-3">
                        <input type="checkbox" defaultChecked className="rounded bg-white/10 border-white/20 text-[#C9A962] focus:ring-[#C9A962]/50" />
                        <span className="text-[#F5F3EF]/80">Student handouts</span>
                      </label>
                      <label className="flex items-center gap-3">
                        <input type="checkbox" className="rounded bg-white/10 border-white/20 text-[#C9A962] focus:ring-[#C9A962]/50" />
                        <span className="text-[#F5F3EF]/80">Presentation slides</span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center mt-8">
                  <button className="bg-gradient-to-r from-[#C9A962] to-[#8B7355] text-[#0D0D0F] px-8 py-3 rounded-lg font-medium hover:shadow-lg hover:shadow-[#C9A962]/25 transition-all duration-300 flex items-center gap-2">
                    <Download className="w-5 h-5" />
                    Export Lesson Plan
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}