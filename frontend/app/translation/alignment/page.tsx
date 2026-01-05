'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  MousePointer, 
  ArrowUpDown, 
  BookOpen, 
  Layers, 
  GitBranch,
  Lightbulb,
  Users,
  History,
  Eye,
  EyeOff,
  Settings,
  Zap,
  Brain,
  Target,
  CheckCircle,
  AlertCircle,
  Search,
  Filter,
  RefreshCw,
  Download,
  Share2,
  Bookmark,
  MessageSquare,
  TrendingUp,
  Link,
  Shuffle
} from 'lucide-react'
import { MultiScaleView } from '@/components/innovations/multi_scale_view'
import { ComparativeFrames } from '@/components/innovations/comparative_frames'

interface WordAlignment {
  id: string
  sourceWord: string
  targetWord: string
  morphology: {
    pos: string
    case?: string
    number?: string
    gender?: string
    tense?: string
    mood?: string
    voice?: string
  }
  confidence: number
  semanticGroup: string
  alternatives: string[]
  context: string
  frequency: number
  etymology?: string
  citations: string[]
  scholarNotes: Array<{
    scholar: string
    note: string
    timestamp: string
  }>
  connections: string[]
}

interface TranslationMemoryEntry {
  passage: string
  translation: string
  translator: string
  context: string
  confidence: number
  date: string
}

interface AlignmentViewOptions {
  showMorphology: boolean
  showSemantics: boolean
  showFrequency: boolean
  showAlternatives: boolean
  alignmentStyle: 'linear' | 'curved' | 'table'
  colorScheme: 'semantic' | 'confidence' | 'frequency'
  groupBySemantic: boolean
  showOnlyUncertain: boolean
}

const SAMPLE_ALIGNMENTS: WordAlignment[] = [
  {
    id: '1',
    sourceWord: 'φρόνησις',
    targetWord: 'practical wisdom',
    morphology: { pos: 'noun', case: 'nominative', number: 'singular', gender: 'feminine' },
    confidence: 0.92,
    semanticGroup: 'virtue-ethics',
    alternatives: ['prudence', 'practical intelligence', 'wisdom'],
    context: 'Aristotelian ethics context',
    frequency: 127,
    etymology: 'φρήν (mind) + -σις (action/process)',
    citations: ['EN 1140a24', 'EN 1140b4', 'Pol 1277a15'],
    scholarNotes: [
      { scholar: 'Ross', note: 'Distinguished from sophia', timestamp: '2024-01-15' },
      { scholar: 'Broadie', note: 'Contextual practical reasoning', timestamp: '2024-01-20' }
    ],
    connections: ['σοφία', 'ἐπιστήμη', 'τέχνη']
  },
  {
    id: '2',
    sourceWord: 'λόγος',
    targetWord: 'reason',
    morphology: { pos: 'noun', case: 'nominative', number: 'singular', gender: 'masculine' },
    confidence: 0.76,
    semanticGroup: 'cognition',
    alternatives: ['argument', 'discourse', 'principle', 'ratio'],
    context: 'Metaphysical discourse',
    frequency: 342,
    etymology: 'λέγω (to speak/gather)',
    citations: ['Met 1006a11', 'Phys 184a16', 'DA 429b10'],
    scholarNotes: [
      { scholar: 'Heidegger', note: 'Gathering/revealing function', timestamp: '2024-01-12' },
      { scholar: 'Barnes', note: 'Context determines translation', timestamp: '2024-01-18' }
    ],
    connections: ['διάνοια', 'νοῦς', 'φρόνησις']
  },
  {
    id: '3',
    sourceWord: 'ἀρετή',
    targetWord: 'virtue',
    morphology: { pos: 'noun', case: 'nominative', number: 'singular', gender: 'feminine' },
    confidence: 0.89,
    semanticGroup: 'virtue-ethics',
    alternatives: ['excellence', 'goodness', 'merit'],
    context: 'Ethical treatise',
    frequency: 234,
    etymology: 'ἄριστος (best)',
    citations: ['EN 1103a14', 'EN 1106b36', 'Pol 1323b21'],
    scholarNotes: [
      { scholar: 'Anscombe', note: 'Excellence rather than moral virtue', timestamp: '2024-01-14' },
      { scholar: 'MacIntyre', note: 'Practice-based conception', timestamp: '2024-01-19' }
    ],
    connections: ['κακία', 'ἕξις', 'μεσότης']
  },
  {
    id: '4',
    sourceWord: 'εὐδαιμονία',
    targetWord: 'flourishing',
    morphology: { pos: 'noun', case: 'nominative', number: 'singular', gender: 'feminine' },
    confidence: 0.84,
    semanticGroup: 'virtue-ethics',
    alternatives: ['happiness', 'well-being', 'blessedness'],
    context: 'Ultimate good discussion',
    frequency: 89,
    etymology: 'εὖ (well) + δαίμων (spirit)',
    citations: ['EN 1095a16', 'EN 1097b1', 'Pol 1323a14'],
    scholarNotes: [
      { scholar: 'Foot', note: 'Objective rather than subjective', timestamp: '2024-01-13' },
      { scholar: 'Crisp', note: 'Activity not state', timestamp: '2024-01-17' }
    ],
    connections: ['ἡδονή', 'ἀρετή', 'τέλος']
  }
]

const TRANSLATION_MEMORY: TranslationMemoryEntry[] = [
  {
    passage: 'φρόνησις δὲ περὶ τὰ ἀνθρώπινα καὶ περὶ ὧν ἔστι βουλεύσασθαι',
    translation: 'practical wisdom concerns human affairs and things about which it is possible to deliberate',
    translator: 'Crisp (2000)',
    context: 'EN 1141b8-9',
    confidence: 0.91,
    date: '2024-01-15'
  },
  {
    passage: 'ὁ λόγος ὁ ὀρθὸς φρόνησίς ἐστιν',
    translation: 'right reason is practical wisdom',
    translator: 'Ross (1925)',
    context: 'EN 1144b27-28',
    confidence: 0.87,
    date: '2024-01-12'
  }
]

export default function TranslationAlignmentPage() {
  const [alignments, setAlignments] = useState<WordAlignment[]>(SAMPLE_ALIGNMENTS)
  const [selectedWord, setSelectedWord] = useState<WordAlignment | null>(null)
  const [hoveredWord, setHoveredWord] = useState<string | null>(null)
  const [viewOptions, setViewOptions] = useState<AlignmentViewOptions>({
    showMorphology: true,
    showSemantics: true,
    showFrequency: false,
    showAlternatives: true,
    alignmentStyle: 'curved',
    colorScheme: 'semantic',
    groupBySemantic: false,
    showOnlyUncertain: false
  })
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showMemory, setShowMemory] = useState(false)
  const [activeTab, setActiveTab] = useState<'alignment' | 'memory' | 'analysis'>('alignment')
  const svgRef = useRef<SVGSVGElement>(null)

  const filteredAlignments = alignments.filter(alignment => {
    const matchesSearch = !searchQuery || 
      alignment.sourceWord.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alignment.targetWord.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesConfidence = !viewOptions.showOnlyUncertain || alignment.confidence < 0.8

    return matchesSearch && matchesConfidence
  })

  const semanticGroups = Array.from(new Set(alignments.map(a => a.semanticGroup)))

  const getSemanticColor = (group: string) => {
    const colors = {
      'virtue-ethics': '#C9A962',
      'cognition': '#7C9885',
      'metaphysics': '#8B7355',
      'political': '#9B8B7A',
      'natural': '#6B8E5A'
    }
    return colors[group as keyof typeof colors] || '#C9A962'
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return '#22C55E'
    if (confidence >= 0.8) return '#EAB308'
    return '#EF4444'
  }

  useEffect(() => {
    if (viewOptions.alignmentStyle === 'curved' && svgRef.current) {
      // Redraw curved connections
      const svg = svgRef.current
      svg.innerHTML = ''
      
      filteredAlignments.forEach((alignment, index) => {
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
        const startY = 40 + index * 60
        const endY = startY
        const midX = 300
        const curve = `M 250 ${startY} Q ${midX} ${startY - 20} 350 ${endY}`
        
        path.setAttribute('d', curve)
        path.setAttribute('stroke', viewOptions.colorScheme === 'semantic' 
          ? getSemanticColor(alignment.semanticGroup)
          : getConfidenceColor(alignment.confidence))
        path.setAttribute('stroke-width', '2')
        path.setAttribute('fill', 'none')
        path.setAttribute('opacity', '0.6')
        
        svg.appendChild(path)
      })
    }
  }, [filteredAlignments, viewOptions])

  const handleWordClick = (alignment: WordAlignment) => {
    setSelectedWord(alignment)
  }

  const handleAlignmentUpdate = (alignmentId: string, newTranslation: string) => {
    setAlignments(prev => prev.map(a => 
      a.id === alignmentId ? { ...a, targetWord: newTranslation, confidence: 0.95 } : a
    ))
  }

  return (
    <div className="min-h-screen bg-[#0D0D0F] text-[#F5F3EF]">
      {/* Header */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky top-0 z-50 bg-[#0D0D0F]/80 backdrop-blur-xl border-b border-white/10"
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-br from-[#C9A962] to-[#8B7355] p-3 rounded-xl">
                <ArrowUpDown className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-[#C9A962]">Context-Aware Translation Studio</h1>
                <p className="text-[#F5F3EF]/60">AI that understands what it's translating</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="flex bg-white/5 rounded-xl p-1">
                {(['alignment', 'memory', 'analysis'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      activeTab === tab
                        ? 'bg-[#C9A962] text-white shadow-lg'
                        : 'text-[#F5F3EF]/60 hover:text-[#F5F3EF]'
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>
              
              <button className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl px-4 py-2 text-sm font-medium hover:bg-white/10 transition-colors">
                <Settings className="w-4 h-4 inline mr-2" />
                Settings
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Controls */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 mb-8"
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#F5F3EF]/40 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search alignments..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-white/10 border border-white/20 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A962] focus:border-transparent"
                />
              </div>
              
              <select
                value={viewOptions.alignmentStyle}
                onChange={(e) => setViewOptions(prev => ({ ...prev, alignmentStyle: e.target.value as any }))}
                className="bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A962]"
              >
                <option value="linear">Linear</option>
                <option value="curved">Curved</option>
                <option value="table">Table</option>
              </select>
              
              <select
                value={viewOptions.colorScheme}
                onChange={(e) => setViewOptions(prev => ({ ...prev, colorScheme: e.target.value as any }))}
                className="bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A962]"
              >
                <option value="semantic">Semantic</option>
                <option value="confidence">Confidence</option>
                <option value="frequency">Frequency</option>
              </select>
            </div>
            
            <div className="flex items-center space-x-2">
              <label className="flex items-center space-x-2 text-sm">
                <input
                  type="checkbox"
                  checked={viewOptions.showMorphology}
                  onChange={(e) => setViewOptions(prev => ({ ...prev, showMorphology: e.target.checked }))}
                  className="rounded border-white/20 bg-white/10 text-[#C9A962] focus:ring-[#C9A962]"
                />
                <span>Morphology</span>
              </label>
              
              <label className="flex items-center space-x-2 text-sm">
                <input
                  type="checkbox"
                  checked={viewOptions.showAlternatives}
                  onChange={(e) => setViewOptions(prev => ({ ...prev, showAlternatives: e.target.checked }))}
                  className="rounded border-white/20 bg-white/10 text-[#C9A962] focus:ring-[#C9A962]"
                />
                <span>Alternatives</span>
              </label>
              
              <label className="flex items-center space-x-2 text-sm">
                <input
                  type="checkbox"
                  checked={viewOptions.showOnlyUncertain}
                  onChange={(e) => setViewOptions(prev => ({ ...prev, showOnlyUncertain: e.target.checked }))}
                  className="rounded border-white/20 bg-white/10 text-[#C9A962] focus:ring-[#C9A962]"
                />
                <span>Uncertain only</span>
              </label>
            </div>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Alignment View */}
          <motion.div 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold flex items-center">
                  <Target className="w-5 h-5 mr-2 text-[#C9A962]" />
                  Word-Level Alignment
                </h2>
                
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-[#F5F3EF]/60">
                    {filteredAlignments.length} alignments
                  </span>
                  <button 
                    onClick={() => setIsLoading(true)}
                    className="bg-[#C9A962] hover:bg-[#C9A962]/80 text-white px-3 py-1 rounded-lg text-sm font-medium transition-colors"
                  >
                    <RefreshCw className={`w-4 h-4 inline mr-1 ${isLoading ? 'animate-spin' : ''}`} />
                    Realign
                  </button>
                </div>
              </div>
              
              {/* Alignment Display */}
              <div className="space-y-4">
                {viewOptions.alignmentStyle === 'table' ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-white/10">
                          <th className="text-left py-2 text-sm font-medium text-[#F5F3EF]/60">Source</th>
                          <th className="text-left py-2 text-sm font-medium text-[#F5F3EF]/60">Target</th>
                          <th className="text-left py-2 text-sm font-medium text-[#F5F3EF]/60">Confidence</th>
                          {viewOptions.showMorphology && (
                            <th className="text-left py-2 text-sm font-medium text-[#F5F3EF]/60">Morphology</th>
                          )}
                          <th className="text-left py-2 text-sm font-medium text-[#F5F3EF]/60">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredAlignments.map((alignment) => (
                          <motion.tr
                            key={alignment.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="border-b border-white/5 hover:bg-white/5 transition-colors"
                          >
                            <td className="py-3">
                              <button
                                onClick={() => handleWordClick(alignment)}
                                onMouseEnter={() => setHoveredWord(alignment.id)}
                                onMouseLeave={() => setHoveredWord(null)}
                                className="text-left font-medium hover:text-[#C9A962] transition-colors"
                              >
                                {alignment.sourceWord}
                              </button>
                            </td>
                            <td className="py-3">{alignment.targetWord}</td>
                            <td className="py-3">
                              <div className="flex items-center space-x-2">
                                <div 
                                  className="w-2 h-2 rounded-full"
                                  style={{ backgroundColor: getConfidenceColor(alignment.confidence) }}
                                />
                                <span className="text-sm">{(alignment.confidence * 100).toFixed(0)}%</span>
                              </div>
                            </td>
                            {viewOptions.showMorphology && (
                              <td className="py-3 text-sm text-[#F5F3EF]/60">
                                {alignment.morphology.pos}
                                {alignment.morphology.case && `, ${alignment.morphology.case}`}
                              </td>
                            )}
                            <td className="py-3">
                              <button className="text-[#C9A962] hover:text-[#C9A962]/80 text-sm">
                                Edit
                              </button>
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="relative">
                    {/* Source and Target Columns */}
                    <div className="flex">
                      {/* Source Words */}
                      <div className="flex-1 space-y-4">
                        <h3 className="text-sm font-medium text-[#F5F3EF]/60 mb-4">Ancient Greek</h3>
                        {filteredAlignments.map((alignment, index) => (
                          <motion.div
                            key={`source-${alignment.id}`}
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: index * 0.05 }}
                            className="relative"
                          >
                            <button
                              onClick={() => handleWordClick(alignment)}
                              onMouseEnter={() => setHoveredWord(alignment.id)}
                              onMouseLeave={() => setHoveredWord(null)}
                              className={`group relative bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl p-3 text-left w-full transition-all ${
                                selectedWord?.id === alignment.id ? 'ring-2 ring-[#C9A962] bg-[#C9A962]/10' : ''
                              }`}
                              style={{
                                borderColor: viewOptions.colorScheme === 'semantic' 
                                  ? getSemanticColor(alignment.semanticGroup)
                                  : getConfidenceColor(alignment.confidence)
                              }}
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-medium text-lg">{alignment.sourceWord}</span>
                                <div className="flex items-center space-x-2">
                                  {viewOptions.showFrequency && (
                                    <span className="text-xs text-[#F5F3EF]/60">
                                      {alignment.frequency}×
                                    </span>
                                  )}
                                  <div 
                                    className="w-2 h-2 rounded-full"
                                    style={{ 
                                      backgroundColor: viewOptions.colorScheme === 'semantic' 
                                        ? getSemanticColor(alignment.semanticGroup)
                                        : getConfidenceColor(alignment.confidence)
                                    }}
                                  />
                                </div>
                              </div>
                              
                              {viewOptions.showMorphology && (
                                <div className="mt-2 text-xs text-[#F5F3EF]/60">
                                  {alignment.morphology.pos}
                                  {alignment.morphology.case && `, ${alignment.morphology.case}`}
                                  {alignment.morphology.number && `, ${alignment.morphology.number}`}
                                </div>
                              )}
                              
                              {/* Hover Details */}
                              <AnimatePresence>
                                {hoveredWord === alignment.id && (
                                  <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    className="absolute top-full left-0 right-0 mt-2 bg-[#0D0D0F] border border-white/20 rounded-xl p-4 z-50 shadow-xl"
                                  >
                                    <div className="space-y-2">
                                      <div className="flex items-center space-x-2">
                                        <Brain className="w-4 h-4 text-[#C9A962]" />
                                        <span className="text-sm font-medium">Etymology</span>
                                      </div>
                                      <p className="text-sm text-[#F5F3EF]/80">
                                        {alignment.etymology || 'No etymology available'}
                                      </p>
                                      
                                      <div className="flex items-center space-x-2 mt-3">
                                        <BookOpen className="w-4 h-4 text-[#7C9885]" />
                                        <span className="text-sm font-medium">Citations</span>
                                      </div>
                                      <div className="flex flex-wrap gap-1">
                                        {alignment.citations.map((citation) => (
                                          <span
                                            key={citation}
                                            className="bg-[#7C9885]/20 text-[#7C9885] text-xs px-2 py-1 rounded-md"
                                          >
                                            {citation}
                                          </span>
                                        ))}
                                      </div>
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </button>
                          </motion.div>
                        ))}
                      </div>
                      
                      {/* Connection Lines */}
                      {viewOptions.alignmentStyle === 'curved' && (
                        <div className="flex-shrink-0 w-24 relative">
                          <svg
                            ref={svgRef}
                            className="absolute inset-0 w-full h-full"
                            style={{ minHeight: filteredAlignments.length * 80 }}
                          />
                        </div>
                      )}
                      
                      {/* Target Words */}
                      <div className="flex-1 space-y-4">
                        <h3 className="text-sm font-medium text-[#F5F3EF]/60 mb-4">English</h3>
                        {filteredAlignments.map((alignment, index) => (
                          <motion.div
                            key={`target-${alignment.id}`}
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: index * 0.05 + 0.1 }}
                            className="bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl p-3"
                            style={{
                              borderColor: viewOptions.colorScheme === 'semantic' 
                                ? getSemanticColor(alignment.semanticGroup)
                                : getConfidenceColor(alignment.confidence)
                            }}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-medium">{alignment.targetWord}</span>
                              <span className="text-sm text-[#F5F3EF]/60">
                                {(alignment.confidence * 100).toFixed(0)}%
                              </span>
                            </div>
                            
                            {viewOptions.showAlternatives && alignment.alternatives.length > 0 && (
                              <div className="mt-2 flex flex-wrap gap-1">
                                {alignment.alternatives.slice(0, 3).map((alt) => (
                                  <span
                                    key={alt}
                                    className="bg-white/10 text-xs px-2 py-1 rounded-md text-[#F5F3EF]/60"
                                  >
                                    {alt}
                                  </span>
                                ))}
                              </div>
                            )}
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
          
          {/* Sidebar */}
          <motion.div 
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            {/* Innovation Components */}
            <MultiScaleView
              scales={['word', 'phrase', 'sentence', 'passage']}
              currentScale="word"
              onScaleChange={() => {}}
            />
            
            <ComparativeFrames
              frames={[
                { id: '1', title: 'Aristotle', content: 'φρόνησις as practical wisdom' },
                { id: '2', title: 'Cicero', content: 'prudentia as practical judgment' }
              ]}
              onFrameSelect={() => {}}
            />
            
            {/* Selected Word Details */}
            <AnimatePresence>
              {selectedWord && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
                >
                  <h3 className="text-lg font-bold mb-4 flex items-center">
                    <MousePointer className="w-5 h-5 mr-2 text-[#C9A962]" />
                    Word Analysis
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-[#F5F3EF]/60 mb-2">Source Word</h4>
                      <p className="text-2xl font-bold text-[#C9A962]">{selectedWord.sourceWord}</p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-[#F5F3EF]/60 mb-2">Translation</h4>
                      <p className="text-lg">{selectedWord.targetWord}</p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-[#F5F3EF]/60 mb-2">Confidence</h4>
                      <div className="flex items-center space-x-3">
                        <div className="flex-1 bg-white/10 rounded-full h-2">
                          <div
                            className="h-2 rounded-full transition-all duration-500"
                            style={{
                              width: `${selectedWord.confidence * 100}%`,
                              backgroundColor: getConfidenceColor(selectedWord.confidence)
                            }}
                          />
                        </div>
                        <span className="text-sm">{(selectedWord.confidence * 100).toFixed(1)}%</span>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-[#F5F3EF]/60 mb-2">Morphology</h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>Part of Speech: <span className="text-[#C9A962]">{selectedWord.morphology.pos}</span></div>
                        {selectedWord.morphology.case && (
                          <div>Case: <span className="text-[#C9A962]">{selectedWord.morphology.case}</span></div>
                        )}
                        {selectedWord.morphology.number && (
                          <div>Number: <span className="text-[#C9A962]">{selectedWord.morphology.number}</span></div>
                        )}
                        {selectedWord.morphology.gender && (
                          <div>Gender: <span className="text-[#C9A962]">{selectedWord.morphology.gender}</span></div>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-[#F5F3EF]/60 mb-2">Alternative Translations</h4>
                      <div className="flex flex-wrap gap-1">
                        {selectedWord.alternatives.map((alt) => (
                          <button
                            key={alt}
                            onClick={() => handleAlignmentUpdate(selectedWord.id, alt)}
                            className="bg-white/10 hover:bg-[#C9A962]/20 border border-white/20 hover:border-[#C9A962] text-xs px-2 py-1 rounded-md transition-colors"
                          >
                            {alt}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-[#F5F3EF]/60 mb-2">Scholar Notes</h4>
                      <div className="space-y-2">
                        {selectedWord.scholarNotes.map((note, index) => (
                          <div key={index} className="bg-white/5 rounded-lg p-3">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm font-medium text-[#C9A962]">{note.scholar}</span>
                              <span className="text-xs text-[#F5F3EF]/60">{note.timestamp}</span>
                            </div>
                            <p className="text-sm text-[#F5F3EF]/80">{note.note}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-[#F5F3EF]/60 mb-2">Related Concepts</h4>
                      <div className="flex flex-wrap gap-1">
                        {selectedWord.connections.map((connection) => (
                          <span
                            key={connection}
                            className="bg-[#7C9885]/20 text-[#7C9885] text-xs px-2 py-1 rounded-md"
                          >
                            {connection}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Translation Memory */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
              <h3 className="text-lg font-bold mb-4 flex items-center">
                <History className="w-5 h-5 mr-2 text-[#7C9885]" />
                Translation Memory
              </h3>
              
              <div className="space-y-3">
                {TRANSLATION_MEMORY.slice(0, 2).map((entry, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white/5 rounded-lg p-3"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-[#7C9885]">{entry.translator}</span>
                      <span className="text-xs text-[#F5F3EF]/60">{entry.context}</span>
                    </div>
                    <p className="text-sm text-[#F5F3EF]/80 mb-2">{entry.passage}</p>
                    <p className="text-sm italic">{entry.translation}</p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center space-x-2">
                        <div 
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: getConfidenceColor(entry.confidence) }}
                        />
                        <span className="text-xs">{(entry.confidence * 100).toFixed(0)}%</span>
                      </div>
                      <span className="text-xs text-[#F5F3EF]/60">{entry.date}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              <button className="w-full mt-4 bg-[#7C9885]/20 hover:bg-[#7C9885]/30 border border-[#7C9885]/30 text-[#7C9885] py-2 rounded-lg text-sm font-medium transition-colors">
                View All Translations
              </button>
            </div>
            
            {/* Semantic Groups */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
              <h3 className="text-lg font-bold mb-4 flex items-center">
                <Layers className="w-5 h-5 mr-2 text-[#8B7355]" />
                Semantic Groups
              </h3>
              
              <div className="space-y-2">
                {semanticGroups.map((group) => {
                  const count = alignments.filter(a => a.semanticGroup === group).length
                  return (
                    <div key={group} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: getSemanticColor(group) }}
                        />
                        <span className="text-sm capitalize">{group.replace('-', ' ')}</span>
                      </div>
                      <span className="text-sm text-[#F5F3EF]/60">{count}</span>
                    </div>
                  )
                })}
              </div>
            </div>
            
            {/* AI Insights */}
            <div className="bg-gradient-to-br from-[#C9A962]/10 to-[#7C9885]/10 border border-[#C9A962]/20 rounded-2xl p-6">
              <h3 className="text-lg font-bold mb-4 flex items-center">
                <Lightbulb className="w-5 h-5 mr-2 text-[#C9A962]" />
                AI Insights
              </h3>
              
              <div className="space-y-3 text-sm">
                <div className="flex items-start space-x-2">
                  <Zap className="w-4 h-4 text-[#C9A962] mt-0.5 flex-shrink-0" />
                  <p>
                    <span className="font-medium">φρόνησις</span> appears in similar contexts to 
                    <span className="text-[#C9A962]"> σοφία</span> but with practical emphasis
                  </p>
                </div>
                
                <div className="flex items-start space-x-2">
                  <TrendingUp className="w-4 h-4 text-[#7C9885] mt-0.5 flex-shrink-0" />
                  <p>
                    Translation consistency for <span className="font-medium">ἀρετή</span> is 
                    <span className="text-[#7C9885]"> 89% across your corpus</span>
                  </p>
                </div>
                
                <div className="flex items-start space-x-2">
                  <Users className="w-4 h-4 text-[#8B7355] mt-0.5 flex-shrink-0" />
                  <p>
                    <span className="text-[#8B7355]">3 other scholars</span> have annotated 
                    similar passages in this work
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
