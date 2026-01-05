'use client'

import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  BookOpen, 
  Target, 
  TrendingUp, 
  AlertTriangle, 
  Download, 
  RefreshCw, 
  ChevronDown, 
  ChevronRight,
  ExternalLink,
  Zap,
  Brain,
  Link2,
  FileText,
  Quote,
  Eye,
  EyeOff,
  Lightbulb,
  ArrowRight,
  CheckCircle,
  XCircle,
  Circle
} from 'lucide-react'

interface Passage {
  id: string
  content: string
  source: {
    author: string
    title: string
    publication?: string
    year: number
    pages?: string
    url?: string
  }
  relevanceScore: number
  timestamp: Date
  highlights: Array<{
    start: number
    end: number
    type: 'supporting' | 'contradicting' | 'contextual'
  }>
}

interface EvidenceChainNode {
  id: string
  passage: Passage
  connectionType: 'direct' | 'inferential' | 'contextual'
  strength: number
  position: { x: number; y: number }
}

interface KeyPoint {
  id: string
  statement: string
  supportingPassages: Passage[]
  evidenceChain: EvidenceChainNode[]
  confidenceScore: number
  order: number
  category: string
}

interface CounterEvidence {
  id: string
  statement: string
  passages: Passage[]
  severity: 'minor' | 'moderate' | 'significant'
  refutability: number
}

interface ArgumentSynthesis {
  id: string
  query: string
  thesis: string
  abstract: string
  overallConfidence: number
  keyPoints: KeyPoint[]
  counterEvidence: CounterEvidence[]
  totalPassagesAnalyzed: number
  generatedAt: Date
  lastRefined?: Date
}

interface RefinementSuggestion {
  id: string
  question: string
  type: 'clarification' | 'expansion' | 'counter-investigation'
  estimatedNewPassages: number
}

interface ArgumentSynthesisLayerProps {
  synthesis?: ArgumentSynthesis
  isLoading?: boolean
  error?: string
  onRefine?: (query: string) => Promise<void>
  onExport?: (format: 'zotero' | 'bibtex' | 'apa' | 'mla') => void
  // Additional props for flexibility
  arguments?: any[]
  className?: string
  argument?: string
  sources?: any[]
  confidence?: number
  onSynthesisComplete?: () => void
  topic?: string
}

export const ConfidenceGauge: React.FC<{
  confidence: number
  totalPassages: number
  size?: 'small' | 'medium' | 'large'
  animated?: boolean
}> = ({ confidence, totalPassages, size = 'medium', animated = true }) => {
  const radius = size === 'small' ? 30 : size === 'large' ? 50 : 40
  const strokeWidth = size === 'small' ? 4 : size === 'large' ? 6 : 5
  const normalizedRadius = radius - strokeWidth * 2
  const circumference = normalizedRadius * 2 * Math.PI
  const strokeDasharray = circumference
  const strokeDashoffset = circumference - (confidence / 100) * circumference

  const getConfidenceColor = (conf: number) => {
    if (conf >= 80) return '#C9A962'
    if (conf >= 60) return '#7C9885'
    if (conf >= 40) return '#8B7355'
    return '#DC2626'
  }

  return (
    <div className="flex items-center gap-3">
      <div className="relative">
        <svg
          height={radius * 2}
          width={radius * 2}
          className="transform -rotate-90"
        >
          <circle
            stroke="rgba(255,255,255,0.1)"
            fill="transparent"
            strokeWidth={strokeWidth}
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          <motion.circle
            stroke={getConfidenceColor(confidence)}
            fill="transparent"
            strokeWidth={strokeWidth}
            strokeDasharray={strokeDasharray}
            strokeDashoffset={animated ? strokeDashoffset : 0}
            strokeLinecap="round"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
            initial={animated ? { strokeDashoffset: circumference } : undefined}
            animate={animated ? { strokeDashoffset } : undefined}
            transition={{ duration: 2, ease: "easeOut", delay: 0.5 }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-bold text-[#F5F3EF]">
            {Math.round(confidence)}%
          </span>
        </div>
      </div>
      <div className="text-sm">
        <div className="text-[#F5F3EF] font-medium">Confidence</div>
        <div className="text-[#8B7355] text-xs">{totalPassages} passages</div>
      </div>
    </div>
  )
}

const PassagePreview: React.FC<{
  passage: Passage
  isSelected?: boolean
  onSelect?: () => void
}> = ({ passage, isSelected, onSelect }) => {
  const highlightContent = (content: string, highlights: Passage['highlights']) => {
    if (!highlights.length) return content

    const sortedHighlights = [...highlights].sort((a, b) => a.start - b.start)
    const parts: React.ReactNode[] = []
    let lastEnd = 0

    sortedHighlights.forEach((highlight, index) => {
      if (highlight.start > lastEnd) {
        parts.push(content.slice(lastEnd, highlight.start))
      }

      const highlightClass = {
        supporting: 'bg-[#C9A962]/20 text-[#C9A962]',
        contradicting: 'bg-red-500/20 text-red-400',
        contextual: 'bg-[#7C9885]/20 text-[#7C9885]'
      }[highlight.type]

      parts.push(
        <span key={index} className={`px-1 rounded ${highlightClass}`}>
          {content.slice(highlight.start, highlight.end)}
        </span>
      )

      lastEnd = highlight.end
    })

    if (lastEnd < content.length) {
      parts.push(content.slice(lastEnd))
    }

    return parts
  }

  return (
    <motion.div
      className={`p-4 rounded-lg border transition-all cursor-pointer ${
        isSelected
          ? 'bg-[#C9A962]/10 border-[#C9A962]/30'
          : 'bg-white/5 border-white/10 hover:bg-white/10'
      }`}
      onClick={onSelect}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="text-[#F5F3EF] text-sm leading-relaxed mb-3">
        {highlightContent(passage.content, passage.highlights)}
      </div>
      <div className="flex items-center justify-between text-xs">
        <div className="text-[#8B7355]">
          {passage.source.author} ({passage.source.year})
        </div>
        <div className="flex items-center gap-2">
          <div className={`px-2 py-1 rounded text-xs ${
            passage.relevanceScore > 0.8 ? 'bg-[#C9A962]/20 text-[#C9A962]' :
            passage.relevanceScore > 0.6 ? 'bg-[#7C9885]/20 text-[#7C9885]' :
            'bg-[#8B7355]/20 text-[#8B7355]'
          }`}>
            {Math.round(passage.relevanceScore * 100)}% relevant
          </div>
        </div>
      </div>
    </motion.div>
  )
}

const EvidenceChain: React.FC<{
  chain: EvidenceChainNode[]
  keyPointId: string
  isExpanded: boolean
  onPassageSelect: (passageId: string) => void
  maxVisibleNodes?: number
}> = ({ chain, isExpanded, onPassageSelect, maxVisibleNodes = 3 }) => {
  const [selectedPassage, setSelectedPassage] = useState<string | null>(null)
  const visibleNodes = isExpanded ? chain : chain.slice(0, maxVisibleNodes)

  const getConnectionIcon = (type: EvidenceChainNode['connectionType']) => {
    switch (type) {
      case 'direct': return <Target className="w-4 h-4" />
      case 'inferential': return <Brain className="w-4 h-4" />
      case 'contextual': return <Link2 className="w-4 h-4" />
    }
  }

  const getStrengthColor = (strength: number) => {
    if (strength > 0.8) return 'text-[#C9A962]'
    if (strength > 0.6) return 'text-[#7C9885]'
    return 'text-[#8B7355]'
  }

  return (
    <div className="space-y-3">
      <AnimatePresence>
        {visibleNodes.map((node, index) => (
          <motion.div
            key={node.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ delay: index * 0.1 }}
            className="relative"
          >
            {index < visibleNodes.length - 1 && (
              <div className="absolute left-6 top-12 w-px h-8 bg-gradient-to-b from-[#C9A962]/50 to-transparent" />
            )}
            
            <div className="flex gap-3">
              <div className={`flex-shrink-0 w-12 h-12 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center ${getStrengthColor(node.strength)}`}>
                {getConnectionIcon(node.connectionType)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs text-[#8B7355] capitalize">
                    {node.connectionType} connection
                  </span>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Circle
                        key={i}
                        className={`w-2 h-2 ${
                          i < Math.round(node.strength * 5) 
                            ? 'fill-current text-[#C9A962]' 
                            : 'text-white/20'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                
                <PassagePreview
                  passage={node.passage}
                  isSelected={selectedPassage === node.passage.id}
                  onSelect={() => {
                    setSelectedPassage(node.passage.id)
                    onPassageSelect(node.passage.id)
                  }}
                />
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
      
      {chain.length > maxVisibleNodes && (
        <div className="text-center">
          <button className="text-[#C9A962] text-sm hover:text-[#C9A962]/80 transition-colors">
            {isExpanded ? 'Show less' : `+${chain.length - maxVisibleNodes} more passages`}
          </button>
        </div>
      )}
    </div>
  )
}

const KeyPointItem: React.FC<{
  keyPoint: KeyPoint
  isExpanded: boolean
  onToggle: () => void
  onPassageSelect: (passageId: string) => void
}> = ({ keyPoint, isExpanded, onToggle, onPassageSelect }) => {
  return (
    <motion.div
      className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-start gap-4">
        <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${
          keyPoint.confidenceScore > 80 ? 'bg-[#C9A962]/20 text-[#C9A962]' :
          keyPoint.confidenceScore > 60 ? 'bg-[#7C9885]/20 text-[#7C9885]' :
          'bg-[#8B7355]/20 text-[#8B7355]'
        }`}>
          {keyPoint.order}
        </div>
        
        <div className="flex-1">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-[#F5F3EF] font-medium leading-relaxed pr-4">
              {keyPoint.statement}
            </h4>
            <div className="flex items-center gap-3">
              <div className="text-xs text-[#8B7355]">
                {keyPoint.supportingPassages.length} sources
              </div>
              <button
                onClick={onToggle}
                className="text-[#C9A962] hover:text-[#C9A962]/80 transition-colors"
              >
                {isExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
              </button>
            </div>
          </div>
          
          <div className="flex items-center gap-4 mb-4">
            <div className="text-xs text-[#7C9885] bg-[#7C9885]/10 px-2 py-1 rounded">
              {keyPoint.category}
            </div>
            <div className="text-xs text-[#8B7355]">
              {Math.round(keyPoint.confidenceScore)}% confidence
            </div>
          </div>
          
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="border-t border-white/10 pt-4"
              >
                <div className="mb-4">
                  <h5 className="text-[#C9A962] text-sm font-medium mb-3 flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    Evidence Chain
                  </h5>
                  <EvidenceChain
                    chain={keyPoint.evidenceChain}
                    keyPointId={keyPoint.id}
                    isExpanded={true}
                    onPassageSelect={onPassageSelect}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  )
}

const CounterEvidenceDrawer: React.FC<{
  counterEvidence: CounterEvidence[]
  isOpen: boolean
  onToggle: () => void
}> = ({ counterEvidence, isOpen, onToggle }) => {
  const getSeverityColor = (severity: CounterEvidence['severity']) => {
    switch (severity) {
      case 'significant': return 'text-red-400 bg-red-500/10'
      case 'moderate': return 'text-yellow-400 bg-yellow-500/10'
      case 'minor': return 'text-[#7C9885] bg-[#7C9885]/10'
    }
  }

  const getSeverityIcon = (severity: CounterEvidence['severity']) => {
    switch (severity) {
      case 'significant': return <XCircle className="w-4 h-4" />
      case 'moderate': return <AlertTriangle className="w-4 h-4" />
      case 'minor': return <Circle className="w-4 h-4" />
    }
  }

  return (
    <div className="border-t border-white/10">
      <button
        onClick={onToggle}
        className="w-full p-4 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-yellow-400" />
          <span className="text-[#F5F3EF] font-medium">Counter-Evidence</span>
          <span className="text-xs text-[#8B7355] bg-[#8B7355]/10 px-2 py-1 rounded">
            {counterEvidence.length} items
          </span>
        </div>
        {isOpen ? <ChevronDown className="w-5 h-5 text-[#8B7355]" /> : <ChevronRight className="w-5 h-5 text-[#8B7355]" />}
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="px-4 pb-4 space-y-3"
          >
            {counterEvidence.map((item) => (
              <motion.div
                key={item.id}
                className="bg-white/5 border border-white/10 rounded-lg p-4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-start gap-3">
                  <div className={`flex-shrink-0 p-2 rounded ${getSeverityColor(item.severity)}`}>
                    {getSeverityIcon(item.severity)}
                  </div>
                  <div className="flex-1">
                    <p className="text-[#F5F3EF] mb-2">{item.statement}</p>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[#8B7355]">
                        {item.passages.length} contradicting sources
                      </span>
                      <div className={`px-2 py-1 rounded capitalize ${getSeverityColor(item.severity)}`}>
                        {item.severity}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

const RefinePanel: React.FC<{
  suggestions: RefinementSuggestion[]
  isRefining: boolean
  onRefine: (query: string) => Promise<void>
}> = ({ suggestions, isRefining, onRefine }) => {
  const [customQuery, setCustomQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)

  const getSuggestionIcon = (type: RefinementSuggestion['type']) => {
    switch (type) {
      case 'clarification': return <Lightbulb className="w-4 h-4" />
      case 'expansion': return <TrendingUp className="w-4 h-4" />
      case 'counter-investigation': return <AlertTriangle className="w-4 h-4" />
    }
  }

  const handleRefine = async (query: string) => {
    await onRefine(query)
    setCustomQuery('')
  }

  return (
    <div className="border-t border-white/10">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-3">
          <RefreshCw className="w-5 h-5 text-[#C9A962]" />
          <span className="text-[#F5F3EF] font-medium">Refine Analysis</span>
        </div>
        {isOpen ? <ChevronDown className="w-5 h-5 text-[#8B7355]" /> : <ChevronRight className="w-5 h-5 text-[#8B7355]" />}
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="p-4 space-y-4"
          >
            <div>
              <label className="block text-[#F5F3EF] text-sm font-medium mb-2">
                Custom refinement query
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customQuery}
                  onChange={(e) => setCustomQuery(e.target.value)}
                  placeholder="Ask a follow-up question..."
                  className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-[#F5F3EF] placeholder-[#8B7355] focus:border-[#C9A962] focus:outline-none"
                />
                <button
                  onClick={() => handleRefine(customQuery)}
                  disabled={!customQuery.trim() || isRefining}
                  className="px-4 py-2 bg-[#C9A962] text-black rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#C9A962]/90 transition-colors flex items-center gap-2"
                >
                  {isRefining ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <ArrowRight className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
            
            <div>
              <h4 className="text-[#F5F3EF] text-sm font-medium mb-3">Suggested refinements</h4>
              <div className="space-y-2">
                {suggestions.map((suggestion) => (
                  <motion.button
                    key={suggestion.id}
                    onClick={() => handleRefine(suggestion.question)}
                    disabled={isRefining}
                    className="w-full p-3 text-left bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors disabled:opacity-50"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 text-[#C9A962] mt-0.5">
                        {getSuggestionIcon(suggestion.type)}
                      </div>
                      <div className="flex-1">
                        <p className="text-[#F5F3EF] text-sm mb-1">{suggestion.question}</p>
                        <p className="text-[#8B7355] text-xs">
                          ~{suggestion.estimatedNewPassages} new passages
                        </p>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

const CitationExporter: React.FC<{
  isOpen: boolean
  onClose: () => void
  synthesis: ArgumentSynthesis
  onExport: (format: 'zotero' | 'bibtex' | 'apa' | 'mla') => void
}> = ({ isOpen, onClose, synthesis, onExport }) => {
  const [selectedFormat, setSelectedFormat] = useState<'zotero' | 'bibtex' | 'apa' | 'mla'>('apa')

  const formats = [
    { key: 'apa' as const, name: 'APA Style', description: 'American Psychological Association' },
    { key: 'mla' as const, name: 'MLA Style', description: 'Modern Language Association' },
    { key: 'bibtex' as const, name: 'BibTeX', description: 'LaTeX bibliography format' },
    { key: 'zotero' as const, name: 'Zotero', description: 'Direct import to Zotero library' },
  ]

  if (!isOpen) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="bg-[#0D0D0F] border border-white/10 rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-[#F5F3EF] text-xl font-bold">Export Citations</h3>
          <button
            onClick={onClose}
            className="text-[#8B7355] hover:text-[#F5F3EF] transition-colors"
          >
            <XCircle className="w-6 h-6" />
          </button>
        </div>
        
        <div className="space-y-4">
          {formats.map((format) => (
            <label
              key={format.key}
              className={`block p-4 rounded-lg border cursor-pointer transition-all ${
                selectedFormat === format.key
                  ? 'bg-[#C9A962]/10 border-[#C9A962]/30'
                  : 'bg-white/5 border-white/10 hover:bg-white/10'
              }`}
            >
              <input
                type="radio"
                name="format"
                value={format.key}
                checked={selectedFormat === format.key}
                onChange={(e) => setSelectedFormat(e.target.value as typeof selectedFormat)}
                className="sr-only"
              />
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[#F5F3EF] font-medium">{format.name}</div>
                  <div className="text-[#8B7355] text-sm">{format.description}</div>
                </div>
                {selectedFormat === format.key && (
                  <CheckCircle className="w-5 h-5 text-[#C9A962]" />
                )}
              </div>
            </label>
          ))}
        </div>
        
        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-white/5 border border-white/10 text-[#F5F3EF] rounded-lg hover:bg-white/10 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onExport(selectedFormat)
              onClose()
            }}
            className="flex-1 px-4 py-2 bg-[#C9A962] text-black rounded-lg font-medium hover:bg-[#C9A962]/90 transition-colors flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export {synthesis.totalPassagesAnalyzed} Sources
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

const ArgumentSynthesisLayer: React.FC<ArgumentSynthesisLayerProps> = ({
  synthesis,
  isLoading = false,
  error,
  onRefine = async () => {},
  onExport = () => {}
}) => {
  const [expandedKeyPoints, setExpandedKeyPoints] = useState<Set<string>>(new Set())
  const [counterEvidenceOpen, setCounterEvidenceOpen] = useState(false)
  const [exporterOpen, setExporterOpen] = useState(false)
  const [selectedPassage, setSelectedPassage] = useState<string | null>(null)

  const mockSuggestions: RefinementSuggestion[] = [
    {
      id: '1',
      question: 'What are the long-term implications of this argument?',
      type: 'expansion',
      estimatedNewPassages: 15
    },
    {
      id: '2',
      question: 'How do recent developments affect this thesis?',
      type: 'clarification',
      estimatedNewPassages: 8
    },
    {
      id: '3',
      question: 'What are the strongest counter-arguments?',
      type: 'counter-investigation',
      estimatedNewPassages: 12
    }
  ]

  const toggleKeyPoint = (pointId: string) => {
    setExpandedKeyPoints(prev => {
      const newSet = new Set(prev)
      if (newSet.has(pointId)) {
        newSet.delete(pointId)
      } else {
        newSet.add(pointId)
      }
      return newSet
    })
  }

  if (isLoading) {
    return (
      <div className="w-full max-w-4xl mx-auto p-6">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
          <div className="flex items-center justify-center space-y-4 py-12">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="text-[#C9A962]"
            >
              <Brain className="w-8 h-8" />
            </motion.div>
            <div className="text-center">
              <p className="text-[#F5F3EF] font-medium mb-2">Synthesizing arguments...</p>
              <p className="text-[#8B7355] text-sm">Analyzing passages and building evidence chains</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="w-full max-w-4xl mx-auto p-6">
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-8 text-center">
          <XCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h3 className="text-red-400 font-bold mb-2">Synthesis Error</h3>
          <p className="text-[#F5F3EF]">{error}</p>
        </div>
      </div>
    )
  }

  if (!synthesis) {
    return (
      <div className="w-full max-w-4xl mx-auto p-6">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 text-center">
          <FileText className="w-12 h-12 text-[#8B7355] mx-auto mb-4" />
          <h3 className="text-[#F5F3EF] font-bold mb-2">No Synthesis Available</h3>
          <p className="text-[#8B7355]">Start a search to generate an argument synthesis</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-6">
      <motion.div
        className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <Target className="w-6 h-6 text-[#C9A962]" />
                <h2 className="text-[#F5F3EF] text-xl font-bold">Argument Synthesis</h2>
              </div>
              <p className="text-[#8B7355] text-sm mb-4">
                Query: {synthesis.query}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <ConfidenceGauge
                confidence={synthesis.overallConfidence}
                totalPassages={synthesis.totalPassagesAnalyzed}
                animated={true}
              />
              <button
                onClick={() => setExporterOpen(true)}
                className="px-4 py-2 bg-[#C9A962] text-black rounded-lg font-medium hover:bg-[#C9A962]/90 transition-colors flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
          </div>
          
          <div className="bg-[#C9A962]/10 border border-[#C9A962]/20 rounded-lg p-4 mb-4">
            <h3 className="text-[#C9A962] font-bold text-lg mb-2">Thesis</h3>
            <p className="text-[#F5F3EF] leading-relaxed">{synthesis.thesis}</p>
          </div>
          
          <div className="bg-white/5 border border-white/10 rounded-lg p-4">
            <h4 className="text-[#F5F3EF] font-medium mb-2">Abstract</h4>
            <p className="text-[#F5F3EF]/80 leading-relaxed text-sm">{synthesis.abstract}</p>
          </div>
        </div>

        {/* Key Points */}
        <div className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <BookOpen className="w-5 h-5 text-[#C9A962]" />
            <h3 className="text-[#F5F3EF] text-lg font-bold">Key Supporting Points</h3>
            <span className="text-xs text-[#8B7355] bg-[#8B7355]/10 px-2 py-1 rounded">
              {synthesis.keyPoints.length} points
            </span>
          </div>
          
          <div className="space-y-4">
            {synthesis.keyPoints.map((keyPoint) => (
              <KeyPointItem
                key={keyPoint.id}
                keyPoint={keyPoint}
                isExpanded={expandedKeyPoints.has(keyPoint.id)}
                onToggle={() => toggleKeyPoint(keyPoint.id)}
                onPassageSelect={setSelectedPassage}
              />
            ))}
          </div>
        </div>

        {/* Counter Evidence */}
        {synthesis.counterEvidence.length > 0 && (
          <CounterEvidenceDrawer
            counterEvidence={synthesis.counterEvidence}
            isOpen={counterEvidenceOpen}
            onToggle={() => setCounterEvidenceOpen(!counterEvidenceOpen)}
          />
        )}

        {/* Refine Panel */}
        <RefinePanel
          suggestions={mockSuggestions}
          isRefining={false}
          onRefine={onRefine}
        />
      </motion.div>

      {/* Citation Exporter Modal */}
      <AnimatePresence>
        {exporterOpen && (
          <CitationExporter
            isOpen={exporterOpen}
            onClose={() => setExporterOpen(false)}
            synthesis={synthesis}
            onExport={onExport}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

// Named and default exports for compatibility
export { ArgumentSynthesisLayer, ArgumentSynthesisLayer as ArgumentSynthesis }
export default ArgumentSynthesisLayer
