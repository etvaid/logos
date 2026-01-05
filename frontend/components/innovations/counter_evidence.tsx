'use client'

import React, { useState, useReducer, useMemo, useCallback, useEffect, createContext, useContext } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  AlertTriangle, 
  ChevronDown, 
  ChevronRight, 
  Filter, 
  BookOpen, 
  Clock, 
  MapPin, 
  Users, 
  MessageSquare,
  TrendingDown,
  Eye,
  CheckCircle2,
  BarChart3,
  Lightbulb,
  Search,
  SortDesc,
  ExternalLink,
  Brain,
  Target,
  Layers,
  Zap
} from 'lucide-react'

interface Contradiction {
  id: string
  passage: string
  source: {
    author: string
    work: string
    date: string
    location?: string
  }
  category: ContradictionCategory
  strength: 'weak' | 'moderate' | 'strong' | 'critical'
  relevance: number
  context: string
  tags: string[]
  createdAt: Date
}

interface ContradictionCategory {
  id: string
  name: string
  description: string
  count: number
  icon: string
  color: string
}

interface NuanceInsight {
  id: string
  explanation: string
  factors: ContextualFactor[]
  confidence: number
  generatedAt: Date
  sources: string[]
}

interface ContextualFactor {
  type: 'temporal' | 'geographic' | 'social' | 'rhetorical' | 'genre'
  description: string
  impact: 'low' | 'medium' | 'high'
  examples: string[]
}

interface ConfidenceMetrics {
  original: number
  adjusted: number
  factors: {
    contradictionCount: number
    strengthWeight: number
    categoryDiversity: number
    temporalSpread: number
  }
  breakdown: ConfidenceBreakdown[]
}

interface ConfidenceBreakdown {
  factor: string
  impact: number
  description: string
}

interface CounterEvidenceState {
  contradictions: Contradiction[]
  categories: ContradictionCategory[]
  nuanceInsight: NuanceInsight | null
  confidenceMetrics: ConfidenceMetrics
  isExpanded: boolean
  isAcknowledged: boolean
  selectedCategory: string | null
  sortBy: 'strength' | 'relevance' | 'date' | 'author'
  expandedItems: Set<string>
  loading: {
    contradictions: boolean
    insight: boolean
    confidence: boolean
  }
  error: {
    contradictions?: string
    insight?: string
    confidence?: string
  }
}

type CounterEvidenceAction = 
  | { type: 'TOGGLE_EXPANDED' }
  | { type: 'SET_ACKNOWLEDGED'; payload: boolean }
  | { type: 'SELECT_CATEGORY'; payload: string | null }
  | { type: 'SET_SORT_BY'; payload: 'strength' | 'relevance' | 'date' | 'author' }
  | { type: 'TOGGLE_ITEM'; payload: string }
  | { type: 'SET_CONTRADICTIONS'; payload: Contradiction[] }
  | { type: 'SET_INSIGHT'; payload: NuanceInsight }
  | { type: 'SET_CONFIDENCE'; payload: ConfidenceMetrics }
  | { type: 'SET_LOADING'; payload: { type: keyof CounterEvidenceState['loading']; value: boolean } }
  | { type: 'SET_ERROR'; payload: { type: keyof CounterEvidenceState['error']; value: string | undefined } }

const initialState: CounterEvidenceState = {
  contradictions: [],
  categories: [],
  nuanceInsight: null,
  confidenceMetrics: {
    original: 85,
    adjusted: 72,
    factors: {
      contradictionCount: 12,
      strengthWeight: 0.7,
      categoryDiversity: 4,
      temporalSpread: 0.8
    },
    breakdown: []
  },
  isExpanded: false,
  isAcknowledged: false,
  selectedCategory: null,
  sortBy: 'strength',
  expandedItems: new Set(),
  loading: {
    contradictions: true,
    insight: true,
    confidence: false
  },
  error: {}
}

export const counterEvidenceReducer = (state: CounterEvidenceState, action: CounterEvidenceAction): CounterEvidenceState => {
  switch (action.type) {
    case 'TOGGLE_EXPANDED':
      return { ...state, isExpanded: !state.isExpanded }
    case 'SET_ACKNOWLEDGED':
      return { ...state, isAcknowledged: action.payload }
    case 'SELECT_CATEGORY':
      return { ...state, selectedCategory: action.payload }
    case 'SET_SORT_BY':
      return { ...state, sortBy: action.payload }
    case 'TOGGLE_ITEM':
      const newExpandedItems = new Set(state.expandedItems)
      if (newExpandedItems.has(action.payload)) {
        newExpandedItems.delete(action.payload)
      } else {
        newExpandedItems.add(action.payload)
      }
      return { ...state, expandedItems: newExpandedItems }
    case 'SET_CONTRADICTIONS':
      return { ...state, contradictions: action.payload }
    case 'SET_INSIGHT':
      return { ...state, nuanceInsight: action.payload }
    case 'SET_CONFIDENCE':
      return { ...state, confidenceMetrics: action.payload }
    case 'SET_LOADING':
      return { 
        ...state, 
        loading: { ...state.loading, [action.payload.type]: action.payload.value }
      }
    case 'SET_ERROR':
      return {
        ...state,
        error: { ...state.error, [action.payload.type]: action.payload.value }
      }
    default:
      return state
  }
}

const CounterEvidenceContext = createContext<{
  state: CounterEvidenceState
  dispatch: React.Dispatch<CounterEvidenceAction>
} | null>(null)

export const useCounterEvidence = () => {
  const context = useContext(CounterEvidenceContext)
  if (!context) {
    throw new Error('useCounterEvidence must be used within CounterEvidenceProvider')
  }
  return context
}

const CounterEvidenceProvider: React.FC<{
  findingId: string
  children: React.ReactNode
}> = ({ findingId, children }) => {
  const [state, dispatch] = useReducer(counterEvidenceReducer, initialState)

  useEffect(() => {
    // Simulate data loading
    setTimeout(() => {
      const mockContradictions: Contradiction[] = [
        {
          id: '1',
          passage: 'The evidence from the Oxyrhynchus papyri suggests a markedly different reading practice, one that emphasizes communal interpretation rather than individual contemplation.',
          source: {
            author: 'Margaret Williams',
            work: 'Reading Communities in Late Antiquity',
            date: '2019',
            location: 'Oxford University Press'
          },
          category: {
            id: 'temporal',
            name: 'Temporal Variation',
            description: 'Contradictions based on time period differences',
            count: 5,
            icon: 'Clock',
            color: '#C9A962'
          },
          strength: 'strong',
          relevance: 0.9,
          context: 'Late Antique Egypt, 3rd-4th century CE',
          tags: ['papyrology', 'reading practices', 'community'],
          createdAt: new Date('2024-01-15')
        },
        {
          id: '2',
          passage: 'Contrary to the proposed thesis, the manuscript evidence from Bobbio reveals highly individualized annotation patterns that suggest private, contemplative reading was the norm among monastic communities.',
          source: {
            author: 'Thomas Benedetti',
            work: 'Manuscript Culture at Bobbio',
            date: '2021',
            location: 'Medieval Studies, 83(1)'
          },
          category: {
            id: 'geographic',
            name: 'Geographic Variation',
            description: 'Regional differences in practice',
            count: 3,
            icon: 'MapPin',
            color: '#7C9885'
          },
          strength: 'critical',
          relevance: 0.95,
          context: 'Northern Italian monasteries, 6th-8th century',
          tags: ['monasticism', 'annotation', 'private reading'],
          createdAt: new Date('2024-01-10')
        },
        {
          id: '3',
          passage: 'The rhetorical tradition preserved in the scholia suggests that public performance remained the primary mode of textual engagement well into the Byzantine period.',
          source: {
            author: 'Elena Constantinides',
            work: 'Byzantine Rhetorical Practice',
            date: '2020',
            location: 'Dumbarton Oaks Papers, 74'
          },
          category: {
            id: 'genre',
            name: 'Genre Specificity',
            description: 'Contradictions within specific genres',
            count: 4,
            icon: 'BookOpen',
            color: '#8B7355'
          },
          strength: 'moderate',
          relevance: 0.75,
          context: 'Byzantine educational contexts',
          tags: ['rhetoric', 'performance', 'education'],
          createdAt: new Date('2024-01-12')
        }
      ]

      const mockInsight: NuanceInsight = {
        id: '1',
        explanation: 'The contradictions reveal a complex landscape where reading practices varied significantly across temporal, geographic, and social boundaries. Rather than undermining the core thesis, these variations suggest that the transition from communal to individual reading was neither uniform nor linear, but followed distinct patterns based on institutional context, textual genre, and regional traditions.',
        factors: [
          {
            type: 'temporal',
            description: 'Reading practices evolved differently in various time periods',
            impact: 'high',
            examples: ['Late Antique communalism', 'Medieval individualism', 'Byzantine performance tradition']
          },
          {
            type: 'geographic',
            description: 'Regional variations in literacy and book culture',
            impact: 'medium',
            examples: ['Egyptian papyrus culture', 'Irish monastic tradition', 'Byzantine urban centers']
          }
        ],
        confidence: 0.78,
        generatedAt: new Date(),
        sources: ['Williams 2019', 'Benedetti 2021', 'Constantinides 2020']
      }

      dispatch({ type: 'SET_CONTRADICTIONS', payload: mockContradictions })
      dispatch({ type: 'SET_INSIGHT', payload: mockInsight })
      dispatch({ type: 'SET_LOADING', payload: { type: 'contradictions', value: false } })
      dispatch({ type: 'SET_LOADING', payload: { type: 'insight', value: false } })
    }, 1500)
  }, [findingId])

  return (
    <CounterEvidenceContext.Provider value={{ state, dispatch }}>
      {children}
    </CounterEvidenceContext.Provider>
  )
}

const CounterEvidenceToggle: React.FC = () => {
  const { state, dispatch } = useCounterEvidence()
  const { contradictions, isExpanded, isAcknowledged, loading } = state

  const severityLevel = useMemo(() => {
    if (loading.contradictions) return 'low'
    const criticalCount = contradictions.filter(c => c.strength === 'critical').length
    const strongCount = contradictions.filter(c => c.strength === 'strong').length
    
    if (criticalCount > 0) return 'critical'
    if (strongCount > 2) return 'high'
    if (contradictions.length > 5) return 'medium'
    return 'low'
  }, [contradictions, loading.contradictions])

  const severityColors = {
    low: 'text-[#7C9885] border-[#7C9885]/30',
    medium: 'text-[#C9A962] border-[#C9A962]/30',
    high: 'text-orange-400 border-orange-400/30',
    critical: 'text-red-400 border-red-400/30'
  }

  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.button
        onClick={() => dispatch({ type: 'TOGGLE_EXPANDED' })}
        className={`
          flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-xl
          bg-white/5 hover:bg-white/10 transition-all duration-300
          ${severityColors[severityLevel]}
          ${isAcknowledged ? 'opacity-70' : ''}
        `}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-4 h-4" />
        </motion.div>
        
        <AlertTriangle className={`w-5 h-5 ${severityLevel === 'critical' ? 'animate-pulse' : ''}`} />
        
        <div className="flex flex-col items-start">
          <span className="text-[#F5F3EF] font-medium">
            Counter-Evidence Found
          </span>
          <span className="text-sm opacity-80">
            {loading.contradictions ? 'Loading...' : `${contradictions.length} contradicting passages`}
          </span>
        </div>
        
        {isAcknowledged && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="ml-auto"
          >
            <CheckCircle2 className="w-5 h-5 text-[#7C9885]" />
          </motion.div>
        )}
      </motion.button>

      <AnimatePresence>
        {isExpanded && (
          <CounterEvidenceDrawer />
        )}
      </AnimatePresence>
    </motion.div>
  )
}

const CounterEvidenceDrawer: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="overflow-hidden"
    >
      <div className="mt-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ContradictionList />
          </div>
          <div className="space-y-6">
            <NuancePanel />
            <ConfidenceAdjuster />
          </div>
        </div>
      </div>
    </motion.div>
  )
}

const ContradictionList: React.FC = () => {
  const { state, dispatch } = useCounterEvidence()
  const { contradictions, selectedCategory, sortBy, loading, expandedItems } = state

  const sortedContradictions = useMemo(() => {
    let filtered = selectedCategory 
      ? contradictions.filter(c => c.category.id === selectedCategory)
      : contradictions

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'strength':
          const strengthOrder = { critical: 4, strong: 3, moderate: 2, weak: 1 }
          return strengthOrder[b.strength] - strengthOrder[a.strength]
        case 'relevance':
          return b.relevance - a.relevance
        case 'date':
          return new Date(b.source.date).getTime() - new Date(a.source.date).getTime()
        case 'author':
          return a.source.author.localeCompare(b.source.author)
        default:
          return 0
      }
    })
  }, [contradictions, selectedCategory, sortBy])

  const categories = useMemo(() => {
    const categoryMap = new Map<string, ContradictionCategory>()
    contradictions.forEach(c => {
      if (!categoryMap.has(c.category.id)) {
        categoryMap.set(c.category.id, { ...c.category, count: 0 })
      }
      categoryMap.get(c.category.id)!.count++
    })
    return Array.from(categoryMap.values())
  }, [contradictions])

  if (loading.contradictions) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-[#C9A962] mb-4">
          <BookOpen className="w-5 h-5" />
          <h3 className="font-semibold">Contradicting Evidence</h3>
        </div>
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white/5 rounded-lg p-4 animate-pulse"
          >
            <div className="h-4 bg-white/10 rounded mb-2"></div>
            <div className="h-3 bg-white/10 rounded w-3/4"></div>
          </motion.div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-[#C9A962]">
          <BookOpen className="w-5 h-5" />
          <h3 className="font-semibold">Contradicting Evidence</h3>
          <span className="text-sm opacity-70">({sortedContradictions.length})</span>
        </div>
        
        <div className="flex items-center gap-2">
          <select
            value={sortBy}
            onChange={(e) => dispatch({ type: 'SET_SORT_BY', payload: e.target.value as any })}
            className="bg-white/10 border border-white/20 rounded-lg px-3 py-1 text-sm text-[#F5F3EF]"
          >
            <option value="strength">By Strength</option>
            <option value="relevance">By Relevance</option>
            <option value="date">By Date</option>
            <option value="author">By Author</option>
          </select>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <button
          onClick={() => dispatch({ type: 'SELECT_CATEGORY', payload: null })}
          className={`px-3 py-1 rounded-full text-sm transition-all ${
            selectedCategory === null
              ? 'bg-[#C9A962] text-[#0D0D0F]'
              : 'bg-white/10 text-[#F5F3EF] hover:bg-white/20'
          }`}
        >
          All ({contradictions.length})
        </button>
        {categories.map(category => (
          <button
            key={category.id}
            onClick={() => dispatch({ type: 'SELECT_CATEGORY', payload: category.id })}
            className={`px-3 py-1 rounded-full text-sm transition-all ${
              selectedCategory === category.id
                ? 'bg-[#C9A962] text-[#0D0D0F]'
                : 'bg-white/10 text-[#F5F3EF] hover:bg-white/20'
            }`}
          >
            {category.name} ({category.count})
          </button>
        ))}
      </div>

      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {sortedContradictions.map((contradiction, index) => (
            <ContradictionItem
              key={contradiction.id}
              contradiction={contradiction}
              isExpanded={expandedItems.has(contradiction.id)}
              onToggle={() => dispatch({ type: 'TOGGLE_ITEM', payload: contradiction.id })}
              index={index}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}

const ContradictionItem: React.FC<{
  contradiction: Contradiction
  isExpanded: boolean
  onToggle: () => void
  index: number
}> = ({ contradiction, isExpanded, onToggle, index }) => {
  const strengthColors = {
    weak: 'border-l-[#7C9885]',
    moderate: 'border-l-[#C9A962]',
    strong: 'border-l-orange-400',
    critical: 'border-l-red-400'
  }

  const strengthLabels = {
    weak: 'Weak',
    moderate: 'Moderate',
    strong: 'Strong',
    critical: 'Critical'
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ delay: index * 0.05 }}
      className={`border-l-4 ${strengthColors[contradiction.strength]} bg-white/5 rounded-r-lg overflow-hidden`}
    >
      <motion.button
        onClick={onToggle}
        className="w-full p-4 text-left hover:bg-white/5 transition-colors"
        whileHover={{ x: 2 }}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span className={`px-2 py-1 rounded text-xs font-medium ${
                contradiction.strength === 'critical' ? 'bg-red-400/20 text-red-300' :
                contradiction.strength === 'strong' ? 'bg-orange-400/20 text-orange-300' :
                contradiction.strength === 'moderate' ? 'bg-[#C9A962]/20 text-[#C9A962]' :
                'bg-[#7C9885]/20 text-[#7C9885]'
              }`}>
                {strengthLabels[contradiction.strength]}
              </span>
              <span className="text-xs text-[#8B7355]">
                Relevance: {Math.round(contradiction.relevance * 100)}%
              </span>
            </div>
            
            <p className="text-[#F5F3EF] text-sm line-clamp-2 mb-2">
              {contradiction.passage}
            </p>
            
            <div className="flex items-center gap-4 text-xs text-[#8B7355]">
              <span>{contradiction.source.author}</span>
              <span>{contradiction.source.date}</span>
              <span>{contradiction.category.name}</span>
            </div>
          </div>
          
          <motion.div
            animate={{ rotate: isExpanded ? 90 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronRight className="w-4 h-4 text-[#8B7355]" />
          </motion.div>
        </div>
      </motion.button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="border-t border-white/10 p-4 bg-white/5"
          >
            <div className="space-y-3">
              <div>
                <h4 className="text-sm font-medium text-[#C9A962] mb-1">Full Citation</h4>
                <p className="text-sm text-[#F5F3EF]">
                  {contradiction.source.author}, <em>{contradiction.source.work}</em> ({contradiction.source.date})
                  {contradiction.source.location && `, ${contradiction.source.location}`}
                </p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-[#C9A962] mb-1">Context</h4>
                <p className="text-sm text-[#F5F3EF]">{contradiction.context}</p>
              </div>
              
              <div className="flex flex-wrap gap-1">
                {contradiction.tags.map(tag => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-white/10 rounded text-xs text-[#8B7355]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

const NuancePanel: React.FC = () => {
  const { state } = useCounterEvidence()
  const { nuanceInsight, loading } = state

  if (loading.insight) {
    return (
      <div className="bg-white/5 rounded-lg p-4">
        <div className="flex items-center gap-2 text-[#C9A962] mb-3">
          <Brain className="w-5 h-5" />
          <h3 className="font-semibold">AI Analysis</h3>
        </div>
        <div className="space-y-2">
          <div className="h-3 bg-white/10 rounded animate-pulse"></div>
          <div className="h-3 bg-white/10 rounded animate-pulse w-3/4"></div>
          <div className="h-3 bg-white/10 rounded animate-pulse w-1/2"></div>
        </div>
      </div>
    )
  }

  if (!nuanceInsight) return null

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="bg-white/5 rounded-lg p-4"
    >
      <div className="flex items-center gap-2 text-[#C9A962] mb-3">
        <Brain className="w-5 h-5" />
        <h3 className="font-semibold">AI Analysis</h3>
        <div className="ml-auto">
          <motion.div
            className="flex items-center gap-1 text-xs text-[#8B7355]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Zap className="w-3 h-3" />
            <span>Confidence: {Math.round(nuanceInsight.confidence * 100)}%</span>
          </motion.div>
        </div>
      </div>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-sm text-[#F5F3EF] leading-relaxed mb-4"
      >
        {nuanceInsight.explanation}
      </motion.p>

      <div className="space-y-2">
        <h4 className="text-sm font-medium text-[#C9A962]">Key Factors</h4>
        {nuanceInsight.factors.map((factor, index) => (
          <motion.div
            key={factor.type}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
            className="flex items-start gap-2 p-2 bg-white/5 rounded"
          >
            <div className={`w-2 h-2 rounded-full mt-1.5 ${
              factor.impact === 'high' ? 'bg-red-400' :
              factor.impact === 'medium' ? 'bg-[#C9A962]' :
              'bg-[#7C9885]'
            }`} />
            <div className="flex-1">
              <p className="text-sm text-[#F5F3EF] capitalize">
                {factor.type.replace('_', ' ')}: {factor.description}
              </p>
              <div className="flex flex-wrap gap-1 mt-1">
                {factor.examples.slice(0, 2).map(example => (
                  <span key={example} className="text-xs text-[#8B7355] bg-white/5 px-2 py-0.5 rounded">
                    {example}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

const ConfidenceAdjuster: React.FC = () => {
  const { state } = useCounterEvidence()
  const { confidenceMetrics } = state
  const [showBreakdown, setShowBreakdown] = useState(false)

  const impactPercentage = ((confidenceMetrics.original - confidenceMetrics.adjusted) / confidenceMetrics.original) * 100

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      className="bg-white/5 rounded-lg p-4"
    >
      <div className="flex items-center gap-2 text-[#C9A962] mb-4">
        <BarChart3 className="w-5 h-5" />
        <h3 className="font-semibold">Confidence Impact</h3>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-[#8B7355]">Original Confidence</span>
          <span className="text-[#F5F3EF] font-medium">{confidenceMetrics.original}%</span>
        </div>

        <div className="relative">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-[#8B7355]">Adjusted Confidence</span>
            <span className="text-[#F5F3EF] font-medium">{confidenceMetrics.adjusted}%</span>
          </div>
          
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${confidenceMetrics.adjusted}%` }}
              transition={{ duration: 1, delay: 0.5, ease: 'easeOut' }}
              className="h-full bg-gradient-to-r from-red-400 via-[#C9A962] to-[#7C9885]"
            />
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="flex items-center justify-between pt-2 border-t border-white/10"
        >
          <div className="flex items-center gap-2">
            <TrendingDown className="w-4 h-4 text-red-400" />
            <span className="text-sm text-red-300">
              -{Math.round(impactPercentage)}% impact
            </span>
          </div>
          
          <button
            onClick={() => setShowBreakdown(!showBreakdown)}
            className="text-xs text-[#8B7355] hover:text-[#C9A962] transition-colors"
          >
            {showBreakdown ? 'Hide' : 'Show'} breakdown
          </button>
        </motion.div>

        <AnimatePresence>
          {showBreakdown && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="space-y-2 pt-2 border-t border-white/10"
            >
              <div className="text-xs text-[#8B7355] space-y-1">
                <div className="flex justify-between">
                  <span>Contradictions found:</span>
                  <span>{confidenceMetrics.factors.contradictionCount}</span>
                </div>
                <div className="flex justify-between">
                  <span>Strength weighting:</span>
                  <span>{confidenceMetrics.factors.strengthWeight}</span>
                </div>
                <div className="flex justify-between">
                  <span>Category diversity:</span>
                  <span>{confidenceMetrics.factors.categoryDiversity}</span>
                </div>
                <div className="flex justify-between">
                  <span>Temporal spread:</span>
                  <span>{confidenceMetrics.factors.temporalSpread}</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

const AcknowledgeButton: React.FC = () => {
  const { state, dispatch } = useCounterEvidence()
  const { isAcknowledged, contradictions, isExpanded } = state

  if (!isExpanded) return null

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="fixed bottom-6 right-6 z-50"
    >
      <motion.button
        onClick={() => dispatch({ type: 'SET_ACKNOWLEDGED', payload: !isAcknowledged })}
        className={`
          flex items-center gap-3 px-6 py-3 rounded-full font-medium transition-all duration-300
          backdrop-blur-xl border shadow-xl
          ${isAcknowledged 
            ? 'bg-[#7C9885]/20 border-[#7C9885]/30 text-[#7C9885]' 
            : 'bg-[#C9A962]/20 border-[#C9A962]/30 text-[#C9A962] hover:bg-[#C9A962]/30'
          }
        `}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {isAcknowledged ? (
          <>
            <CheckCircle2 className="w-5 h-5" />
            <span>Counter-evidence acknowledged</span>
          </>
        ) : (
          <>
            <Eye className="w-5 h-5" />
            <span>Acknowledge counter-evidence</span>
          </>
        )}
      </motion.button>
    </motion.div>
  )
}

const CounterEvidenceDisplay: React.FC<{
  findingId?: string
  claim?: string
  className?: string
  evidence?: any[]
  mainArgument?: string
  sources?: any[]
  claims?: string[]
  onEvidenceFound?: () => void
  mainClaim?: string
  counterEvidence?: any[]
}> = ({ findingId = '', claim, className, evidence, mainArgument, sources, claims, onEvidenceFound, mainClaim, counterEvidence }) => {
  return (
    <CounterEvidenceProvider findingId={findingId}>
      <div className="space-y-4">
        <CounterEvidenceToggle />
        <AcknowledgeButton />
      </div>
    </CounterEvidenceProvider>
  )
}

// Named and default exports for compatibility
export { CounterEvidenceDisplay, CounterEvidenceDisplay as CounterEvidence }
export default CounterEvidenceDisplay
