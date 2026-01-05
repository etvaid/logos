'use client'

import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ZoomIn, 
  ZoomOut, 
  ChevronRight, 
  BookOpen, 
  FileText, 
  List, 
  Quote,
  Search,
  Loader2,
  AlertTriangle,
  ArrowLeft,
  Eye,
  Target
} from 'lucide-react'

type ZoomLevel = 'thesis' | 'abstract' | 'sections' | 'evidence'

interface HighlightedTerm {
  term: string
  definition: string
  greekTerm?: string
  positions: Array<{ start: number; end: number }>
}

interface ThesisData {
  statement: string
  confidence: number
  keyTerms: string[]
}

interface AbstractData {
  text: string
  highlightedTerms: HighlightedTerm[]
  wordCount: number
  readingTime: number
}

interface PassageData {
  id: string
  reference: string
  originalText: string
  translation: string
  context: string
  relevanceScore: number
  tags: string[]
}

interface SectionData {
  id: string
  title: string
  description: string
  evidenceCount: number
  passages: PassageData[]
  isExpanded: boolean
}

interface ResearchData {
  id: string
  title: string
  author: string
  lastModified: Date
  thesis: ThesisData
  abstract: AbstractData
  sections: SectionData[]
}

interface BreadcrumbItem {
  label: string
  level: ZoomLevel
  sectionId?: string
  passageId?: string
}

interface ResearchViewportProps {
  data?: ResearchData | any[] | any
  initialZoomLevel?: ZoomLevel
  onNavigate?: (level: ZoomLevel) => void
  className?: string
  // Additional props for chronos page compatibility
  selectedItem?: any
  onItemSelect?: (item: any) => void
  scaleType?: string
  views?: any[]
  focusWord?: string
  currentPeriod?: any
  selectedItems?: string[]
  onSelectionChange?: (items: any) => void
  colorScheme?: any
  onConceptSelect?: (concept: any) => void
  levels?: any[]
  currentLevel?: string | number
  onLevelChange?: (level?: any) => void
  onNodeSelect?: (nodeId: any) => void
  children?: React.ReactNode
  onTextSelection?: () => void
  onFocusChange?: (item: any) => void
  metrics?: any[]
  scales?: any[]
  currentScale?: string
  renderItem?: (item: any, scale: any) => React.ReactNode
  onScaleChange?: (scale: any) => void
  currentView?: string
  onViewChange?: () => void
  title?: string
}

const mockData: ResearchData = {
  id: '1',
  title: 'Aristotelian Virtue Ethics and Modern Moral Philosophy',
  author: 'Dr. Sarah Chen',
  lastModified: new Date(),
  thesis: {
    statement: 'Aristotle\'s conception of phronesis (practical wisdom) provides a superior framework for moral decision-making compared to contemporary deontological and consequentialist approaches.',
    confidence: 0.85,
    keyTerms: ['phronesis', 'virtue ethics', 'eudaimonia', 'moral decision-making']
  },
  abstract: {
    text: 'This research examines Aristotle\'s Nicomachean Ethics, particularly the concept of phronesis (practical wisdom), and argues that it offers a more nuanced and practical approach to moral philosophy than modern alternatives. Through careful analysis of key passages and comparison with contemporary ethical frameworks, this study demonstrates how Aristotelian virtue ethics addresses the limitations of both deontological and consequentialist theories by emphasizing character development and contextual moral reasoning.',
    highlightedTerms: [
      { 
        term: 'phronesis', 
        definition: 'Practical wisdom; the intellectual virtue that enables one to deliberate well about human affairs',
        greekTerm: 'φρόνησις',
        positions: [{ start: 85, end: 94 }]
      },
      {
        term: 'eudaimonia',
        definition: 'Human flourishing; the highest human good according to Aristotle',
        greekTerm: 'εὐδαιμονία', 
        positions: [{ start: 200, end: 210 }]
      }
    ],
    wordCount: 89,
    readingTime: 2
  },
  sections: [
    {
      id: 'section-1',
      title: 'The Nature of Practical Wisdom',
      description: 'Examining Aristotle\'s definition and characteristics of phronesis',
      evidenceCount: 8,
      isExpanded: false,
      passages: [
        {
          id: 'passage-1',
          reference: 'NE 1140b4-6',
          originalText: 'φρόνησις δὲ περὶ τὰ ἀνθρώπινα καὶ περὶ ὧν ἔστι βουλεύσασθαι',
          translation: 'Practical wisdom is concerned with human affairs and with things about which it is possible to deliberate',
          context: 'Aristotle distinguishes practical wisdom from theoretical knowledge',
          relevanceScore: 0.95,
          tags: ['phronesis', 'definition', 'human affairs']
        }
      ]
    },
    {
      id: 'section-2', 
      title: 'Virtue and Character Development',
      description: 'How practical wisdom shapes moral character over time',
      evidenceCount: 12,
      isExpanded: false,
      passages: []
    },
    {
      id: 'section-3',
      title: 'Comparison with Modern Ethics',
      description: 'Contrasting Aristotelian approach with contemporary moral theories',
      evidenceCount: 15,
      isExpanded: false,
      passages: []
    }
  ]
}

export const ZoomControl: React.FC<{
  currentLevel: ZoomLevel
  onZoomChange: (level: ZoomLevel) => void
  canZoomIn: boolean
  canZoomOut: boolean
}> = ({ currentLevel, onZoomChange, canZoomIn, canZoomOut }) => {
  const levels: Array<{ level: ZoomLevel; icon: React.ReactNode; label: string }> = [
    { level: 'thesis', icon: <Target className="w-4 h-4" />, label: 'Thesis' },
    { level: 'abstract', icon: <FileText className="w-4 h-4" />, label: 'Abstract' },
    { level: 'sections', icon: <List className="w-4 h-4" />, label: 'Sections' },
    { level: 'evidence', icon: <Quote className="w-4 h-4" />, label: 'Evidence' }
  ]

  return (
    <motion.div 
      className="fixed top-6 right-6 z-50"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-2">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => {
              const currentIndex = levels.findIndex(l => l.level === currentLevel)
              if (currentIndex > 0) {
                onZoomChange(levels[currentIndex - 1].level)
              }
            }}
            disabled={!canZoomOut}
            className="p-2 text-[#C9A962] hover:text-[#F5F3EF] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          
          <div className="flex space-x-1">
            {levels.map(({ level, icon, label }) => (
              <motion.button
                key={level}
                onClick={() => onZoomChange(level)}
                className={`p-2 rounded-lg transition-all ${
                  currentLevel === level 
                    ? 'bg-[#C9A962]/20 text-[#C9A962] border border-[#C9A962]/30' 
                    : 'text-[#7C9885] hover:text-[#F5F3EF] hover:bg-white/10'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                title={label}
              >
                {icon}
              </motion.button>
            ))}
          </div>
          
          <button
            onClick={() => {
              const currentIndex = levels.findIndex(l => l.level === currentLevel)
              if (currentIndex < levels.length - 1) {
                onZoomChange(levels[currentIndex + 1].level)
              }
            }}
            disabled={!canZoomIn}
            className="p-2 text-[#C9A962] hover:text-[#F5F3EF] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  )
}

const BreadcrumbNav: React.FC<{
  path: BreadcrumbItem[]
  onNavigate: (item: BreadcrumbItem) => void
}> = ({ path, onNavigate }) => {
  if (path.length <= 1) return null

  return (
    <motion.nav 
      className="fixed top-6 left-6 z-50"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl px-4 py-2">
        <div className="flex items-center space-x-2 text-sm">
          {path.map((item, index) => (
            <React.Fragment key={`${item.level}-${item.sectionId}-${index}`}>
              {index > 0 && <ChevronRight className="w-3 h-3 text-[#8B7355]" />}
              <button
                onClick={() => onNavigate(item)}
                className={`text-[#7C9885] hover:text-[#C9A962] transition-colors ${
                  index === path.length - 1 ? 'text-[#F5F3EF] font-medium' : ''
                }`}
              >
                {item.label}
              </button>
            </React.Fragment>
          ))}
        </div>
      </div>
    </motion.nav>
  )
}

const ThesisView: React.FC<{
  thesis: ThesisData
  isActive: boolean
  onZoomIn: () => void
}> = ({ thesis, isActive, onZoomIn }) => {
  if (!isActive) return null

  return (
    <motion.div
      className="flex items-center justify-center min-h-screen p-8"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-4xl mx-auto text-center space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <h1 className="text-5xl md:text-6xl font-light text-[#F5F3EF] leading-tight mb-6">
            {thesis.statement}
          </h1>
        </motion.div>
        
        <motion.div
          className="flex items-center justify-center space-x-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <div className="flex items-center space-x-2">
            <div className="text-[#7C9885] text-sm">Confidence</div>
            <div className="bg-white/10 rounded-full w-32 h-2 overflow-hidden">
              <motion.div
                className="bg-[#C9A962] h-full rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${thesis.confidence * 100}%` }}
                transition={{ delay: 0.6, duration: 0.8 }}
              />
            </div>
            <div className="text-[#C9A962] text-sm font-medium">
              {Math.round(thesis.confidence * 100)}%
            </div>
          </div>
        </motion.div>

        <motion.div
          className="flex flex-wrap justify-center gap-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          {thesis.keyTerms.map((term, index) => (
            <span
              key={term}
              className="px-3 py-1 bg-[#C9A962]/20 border border-[#C9A962]/30 rounded-full text-[#C9A962] text-sm"
            >
              {term}
            </span>
          ))}
        </motion.div>

        <motion.button
          onClick={onZoomIn}
          className="mt-12 px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-[#F5F3EF] transition-all flex items-center space-x-2 mx-auto"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <Eye className="w-4 h-4" />
          <span>Explore Details</span>
        </motion.button>
      </div>
    </motion.div>
  )
}

const AbstractView: React.FC<{
  abstract: AbstractData
  isActive: boolean
  onZoomIn: () => void
}> = ({ abstract, isActive, onZoomIn }) => {
  const [hoveredTerm, setHoveredTerm] = useState<HighlightedTerm | null>(null)

  if (!isActive) return null

  const renderHighlightedText = (text: string, terms: HighlightedTerm[]) => {
    if (!terms.length) return text

    const parts: Array<{ text: string; term?: HighlightedTerm }> = []
    let lastIndex = 0

    terms.forEach(term => {
      term.positions.forEach(pos => {
        if (pos.start > lastIndex) {
          parts.push({ text: text.slice(lastIndex, pos.start) })
        }
        parts.push({ text: text.slice(pos.start, pos.end), term })
        lastIndex = pos.end
      })
    })

    if (lastIndex < text.length) {
      parts.push({ text: text.slice(lastIndex) })
    }

    return parts.map((part, index) => (
      part.term ? (
        <span
          key={index}
          className="bg-[#C9A962]/20 text-[#C9A962] px-1 rounded cursor-help border-b border-[#C9A962]/50"
          onMouseEnter={() => setHoveredTerm(part.term!)}
          onMouseLeave={() => setHoveredTerm(null)}
        >
          {part.text}
        </span>
      ) : (
        <span key={index}>{part.text}</span>
      )
    ))
  }

  return (
    <motion.div
      className="flex items-center justify-center min-h-screen p-8"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-3xl mx-auto space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-2xl md:text-3xl leading-relaxed text-[#F5F3EF] font-light"
        >
          {renderHighlightedText(abstract.text, abstract.highlightedTerms)}
        </motion.div>

        <motion.div
          className="flex items-center justify-between text-sm text-[#7C9885] bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <div className="flex items-center space-x-4">
            <span>{abstract.wordCount} words</span>
            <span>•</span>
            <span>{abstract.readingTime} min read</span>
          </div>
          <button
            onClick={onZoomIn}
            className="px-4 py-2 bg-[#C9A962]/20 hover:bg-[#C9A962]/30 border border-[#C9A962]/30 rounded-lg text-[#C9A962] transition-all flex items-center space-x-2"
          >
            <Search className="w-4 h-4" />
            <span>View Sections</span>
          </button>
        </motion.div>

        <AnimatePresence>
          {hoveredTerm && (
            <motion.div
              className="fixed inset-x-0 bottom-6 mx-6 bg-[#0D0D0F]/90 backdrop-blur-xl border border-white/20 rounded-xl p-4 z-50"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.2 }}
            >
              <div className="max-w-3xl mx-auto">
                <div className="flex items-start space-x-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-[#C9A962] font-medium">{hoveredTerm.term}</span>
                      {hoveredTerm.greekTerm && (
                        <span className="text-[#7C9885] text-sm">({hoveredTerm.greekTerm})</span>
                      )}
                    </div>
                    <p className="text-[#F5F3EF] text-sm">{hoveredTerm.definition}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

const SectionView: React.FC<{
  sections: SectionData[]
  isActive: boolean
  onSectionClick: (sectionId: string) => void
}> = ({ sections, isActive, onSectionClick }) => {
  if (!isActive) return null

  return (
    <motion.div
      className="min-h-screen p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-4xl mx-auto">
        <motion.h2
          className="text-3xl font-light text-[#F5F3EF] mb-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          Research Sections
        </motion.h2>

        <div className="space-y-4">
          {sections.map((section, index) => (
            <motion.div
              key={section.id}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 cursor-pointer hover:bg-white/10 transition-all"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index, duration: 0.6 }}
              whileHover={{ scale: 1.02 }}
              onClick={() => onSectionClick(section.id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-xl font-medium text-[#F5F3EF] mb-2">
                    {section.title}
                  </h3>
                  <p className="text-[#7C9885] mb-4">{section.description}</p>
                  <div className="flex items-center space-x-4">
                    <span className="text-[#C9A962] text-sm bg-[#C9A962]/20 px-2 py-1 rounded-full">
                      {section.evidenceCount} passages
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-[#8B7355]" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

const EvidenceView: React.FC<{
  section: SectionData
  isActive: boolean
  onBack: () => void
}> = ({ section, isActive, onBack }) => {
  if (!isActive) return null

  return (
    <motion.div
      className="min-h-screen p-8"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <button
              onClick={onBack}
              className="flex items-center space-x-2 text-[#7C9885] hover:text-[#C9A962] transition-colors mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Sections</span>
            </button>
            <h2 className="text-3xl font-light text-[#F5F3EF]">{section.title}</h2>
            <p className="text-[#7C9885] mt-2">{section.description}</p>
          </div>
        </div>

        <div className="space-y-6">
          {section.passages.map((passage, index) => (
            <motion.div
              key={passage.id}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index, duration: 0.6 }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="bg-[#C9A962]/20 px-3 py-1 rounded-lg">
                  <span className="text-[#C9A962] text-sm font-mono">{passage.reference}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-[#C9A962] rounded-full"></div>
                  <span className="text-[#7C9885] text-sm">
                    {Math.round(passage.relevanceScore * 100)}% relevant
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="text-[#7C9885] text-sm font-medium mb-2">Original Text</h4>
                  <p className="text-[#F5F3EF] font-light text-lg italic">{passage.originalText}</p>
                </div>
                
                <div>
                  <h4 className="text-[#7C9885] text-sm font-medium mb-2">Translation</h4>
                  <p className="text-[#F5F3EF]">{passage.translation}</p>
                </div>

                <div>
                  <h4 className="text-[#7C9885] text-sm font-medium mb-2">Context</h4>
                  <p className="text-[#8B7355] text-sm">{passage.context}</p>
                </div>

                <div className="flex flex-wrap gap-2 pt-2">
                  {passage.tags.map(tag => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-[#8B7355]/20 text-[#8B7355] text-xs rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

const LoadingView: React.FC = () => (
  <div className="flex items-center justify-center min-h-screen">
    <motion.div
      className="text-center space-y-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <Loader2 className="w-8 h-8 text-[#C9A962] animate-spin mx-auto" />
      <p className="text-[#7C9885]">Loading research data...</p>
    </motion.div>
  </div>
)

const ErrorView: React.FC<{ onRetry: () => void }> = ({ onRetry }) => (
  <div className="flex items-center justify-center min-h-screen">
    <motion.div
      className="text-center space-y-6 max-w-md"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <AlertTriangle className="w-12 h-12 text-[#C9A962] mx-auto" />
      <div>
        <h2 className="text-xl font-medium text-[#F5F3EF] mb-2">Unable to Load Research</h2>
        <p className="text-[#7C9885]">There was an error loading the research data. Please try again.</p>
      </div>
      <button
        onClick={onRetry}
        className="px-6 py-3 bg-[#C9A962]/20 hover:bg-[#C9A962]/30 border border-[#C9A962]/30 rounded-xl text-[#C9A962] transition-all"
      >
        Retry Loading
      </button>
    </motion.div>
  </div>
)

function MultiScaleResearchViews({ 
  data = mockData, 
  initialZoomLevel = 'thesis',
  onNavigate,
  className = ''
}: ResearchViewportProps) {
  const [currentZoomLevel, setCurrentZoomLevel] = useState<ZoomLevel>(initialZoomLevel)
  const [activeSection, setActiveSection] = useState<string | null>(null)
  const [breadcrumbPath, setBreadcrumbPath] = useState<BreadcrumbItem[]>([
    { label: 'Thesis', level: 'thesis' }
  ])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const zoomLevels: ZoomLevel[] = ['thesis', 'abstract', 'sections', 'evidence']
  
  const canZoomIn = currentZoomLevel !== 'evidence'
  const canZoomOut = currentZoomLevel !== 'thesis'

  const handleZoomChange = useCallback((level: ZoomLevel) => {
    if (level === currentZoomLevel) return

    setIsLoading(true)
    
    setTimeout(() => {
      setCurrentZoomLevel(level)
      
      const newPath: BreadcrumbItem[] = []
      
      if (level === 'thesis' || level === 'abstract' || level === 'sections') {
        setActiveSection(null)
        newPath.push({ label: 'Thesis', level: 'thesis' })
        if (level === 'abstract') newPath.push({ label: 'Abstract', level: 'abstract' })
        if (level === 'sections') newPath.push({ label: 'Sections', level: 'sections' })
      }
      
      setBreadcrumbPath(newPath)
      setIsLoading(false)
      onNavigate?.(level)
    }, 300)
  }, [currentZoomLevel, onNavigate])

  const handleSectionClick = useCallback((sectionId: string) => {
    const section = data.sections.find((s: any) => s.id === sectionId)
    if (!section) return

    setActiveSection(sectionId)
    setCurrentZoomLevel('evidence')
    setBreadcrumbPath([
      { label: 'Thesis', level: 'thesis' },
      { label: 'Sections', level: 'sections' },
      { label: section.title, level: 'evidence', sectionId }
    ])
  }, [data.sections])

  const handleBreadcrumbNavigate = useCallback((item: BreadcrumbItem) => {
    if (item.level === 'evidence' && item.sectionId) {
      setActiveSection(item.sectionId)
      setCurrentZoomLevel('evidence')
    } else {
      setActiveSection(null)
      setCurrentZoomLevel(item.level)
    }
    
    const itemIndex = breadcrumbPath.findIndex(p => p.label === item.label)
    setBreadcrumbPath(breadcrumbPath.slice(0, itemIndex + 1))
  }, [breadcrumbPath])

  const handleBackToSections = useCallback(() => {
    setCurrentZoomLevel('sections')
    setActiveSection(null)
    setBreadcrumbPath([
      { label: 'Thesis', level: 'thesis' },
      { label: 'Sections', level: 'sections' }
    ])
  }, [])

  const selectedSection = useMemo(() => 
    activeSection ? data.sections.find((s: any) => s.id === activeSection) : null,
    [activeSection, data.sections]
  )

  if (error) {
    return (
      <div className={`bg-[#0D0D0F] min-h-screen ${className}`}>
        <ErrorView onRetry={() => setError(null)} />
      </div>
    )
  }

  return (
    <div className={`bg-[#0D0D0F] min-h-screen relative overflow-hidden ${className}`}>
      <ZoomControl
        currentLevel={currentZoomLevel}
        onZoomChange={handleZoomChange}
        canZoomIn={canZoomIn}
        canZoomOut={canZoomOut}
      />
      
      <BreadcrumbNav
        path={breadcrumbPath}
        onNavigate={handleBreadcrumbNavigate}
      />

      <AnimatePresence mode="wait">
        {isLoading ? (
          <LoadingView key="loading" />
        ) : (
          <div key={currentZoomLevel}>
            {data?.thesis && (
              <ThesisView
                thesis={data.thesis}
                isActive={currentZoomLevel === 'thesis'}
                onZoomIn={() => handleZoomChange('abstract')}
              />
            )}

            {data?.abstract && (
              <AbstractView
                abstract={data.abstract}
                isActive={currentZoomLevel === 'abstract'}
                onZoomIn={() => handleZoomChange('sections')}
              />
            )}

            {data?.sections && (
              <SectionView
                sections={data.sections}
                isActive={currentZoomLevel === 'sections'}
                onSectionClick={handleSectionClick}
              />
            )}

            {selectedSection && (
              <EvidenceView
                section={selectedSection}
                isActive={currentZoomLevel === 'evidence'}
                onBack={handleBackToSections}
              />
            )}
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Named and default exports for compatibility
export { MultiScaleResearchViews, MultiScaleResearchViews as MultiScaleView }
export default MultiScaleResearchViews
