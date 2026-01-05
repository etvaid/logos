'use client'

import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Search, 
  BookOpen, 
  Brain, 
  Lightbulb, 
  Filter,
  Star,
  Plus,
  ArrowUp,
  ArrowDown,
  MessageSquare,
  Download,
  FileText,
  Zap,
  Eye,
  ChevronRight,
  Layers,
  Network,
  Target,
  Sparkles,
  Globe,
  Clock,
  TrendingUp,
  Shuffle,
  Check,
  X,
  Edit3,
  Share2,
  Save,
  RefreshCw,
  Wand2
} from 'lucide-react'
import { ArgumentSynthesis } from '@/components/innovations/argument_synthesis'
import { DebateView } from '@/components/innovations/debate_view'
import { CounterEvidence } from '@/components/innovations/counter_evidence'
import { ResearchCanvas } from '@/components/innovations/research_canvas'

interface Finding {
  id: string
  type: 'passage' | 'pattern' | 'connection' | 'insight'
  title: string
  source: string
  content: string
  relevance: number
  timestamp: string
  tags: string[]
  relatedFindings: string[]
  aiInsight?: string
  evidence?: any[]
  counterEvidence?: any[]
}

interface ReportSection {
  id: string
  title: string
  findings: Finding[]
  commentary: string
  order: number
}

export default function DiscoveryReportPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [selectedFindings, setSelectedFindings] = useState<string[]>([])
  const [reportSections, setReportSections] = useState<ReportSection[]>([])
  const [activeView, setActiveView] = useState<'discover' | 'arrange' | 'report'>('discover')
  const [currentCommentary, setCurrentCommentary] = useState('')
  const [showInnovations, setShowInnovations] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [exportFormat, setExportFormat] = useState<'pdf' | 'markdown' | 'latex'>('pdf')
  const [discoveryMode, setDiscoveryMode] = useState<'semantic' | 'thematic' | 'chronological'>('semantic')
  const canvasRef = useRef<HTMLDivElement>(null)

  const [findings] = useState<Finding[]>([
    {
      id: 'finding-1',
      type: 'insight',
      title: 'Evolution of φιλία across Platonic dialogues',
      source: 'Cross-corpus analysis',
      content: 'Semantic analysis reveals that Plato\'s concept of φιλία (friendship) undergoes significant development from early to late dialogues, shifting from social bonds in Lysis to metaphysical attraction in Phaedrus.',
      relevance: 0.95,
      timestamp: '2024-01-15T10:30:00Z',
      tags: ['Plato', 'φιλία', 'friendship', 'concept evolution'],
      relatedFindings: ['finding-3', 'finding-7'],
      aiInsight: 'This pattern suggests Plato\'s increasing integration of psychology and metaphysics in his mature philosophy.',
      evidence: [
        { text: 'Lysis 207d: τί ἐστι φίλον;', weight: 0.8 },
        { text: 'Phaedrus 255b: φιλία as cosmic principle', weight: 0.9 }
      ]
    },
    {
      id: 'finding-2',
      type: 'connection',
      title: 'Stoic appropriation of Platonic friendship theory',
      source: 'Chrysippus fragments + Republic',
      content: 'Previously unnoticed parallels between Chrysippus\' theory of οἰκείωσις and Plato\'s account of friendship in Republic IV suggest direct textual influence.',
      relevance: 0.87,
      timestamp: '2024-01-15T11:15:00Z',
      tags: ['Stoicism', 'Chrysippus', 'οἰκείωσις', 'Republic'],
      relatedFindings: ['finding-1', 'finding-5'],
      aiInsight: 'This connection challenges the traditional narrative of Stoic independence from Platonic ethics.'
    },
    {
      id: 'finding-3',
      type: 'pattern',
      title: 'Linguistic clusters in Aristotelian friendship taxonomy',
      source: 'Nicomachean Ethics VIII-IX',
      content: 'Statistical analysis reveals three distinct linguistic registers corresponding to utility, pleasure, and virtue-based friendships, suggesting deliberate stylistic choices.',
      relevance: 0.82,
      timestamp: '2024-01-15T12:00:00Z',
      tags: ['Aristotle', 'EN', 'friendship types', 'stylistics'],
      relatedFindings: ['finding-1'],
      aiInsight: 'The stylistic variation may indicate these sections had different compositional histories.'
    },
    {
      id: 'finding-4',
      type: 'passage',
      title: 'Unrecognized friendship metaphor in Heraclitus B67',
      source: 'Heraclitus B67 + contextual analysis',
      content: 'Fragment B67 (ὁ θεὸς ἡμέρη εὐφρόνη) contains an implicit friendship metaphor when read alongside testimonies about divine φιλία in Empedocles.',
      relevance: 0.76,
      timestamp: '2024-01-15T13:45:00Z',
      tags: ['Heraclitus', 'Empedocles', 'divine friendship', 'fragments'],
      relatedFindings: ['finding-6'],
      aiInsight: 'This reading opens new possibilities for understanding pre-Socratic theories of cosmic harmony.'
    },
    {
      id: 'finding-5',
      type: 'insight',
      title: 'Neo-Platonic synthesis in Plotinus Ennead VI.7',
      source: 'Plotinus + Aristotelian sources',
      content: 'Plotinus\' discussion of the One\'s "friendship" with itself integrates both Platonic and Aristotelian friendship theories in a novel metaphysical framework.',
      relevance: 0.91,
      timestamp: '2024-01-15T14:20:00Z',
      tags: ['Plotinus', 'One', 'self-love', 'metaphysics'],
      relatedFindings: ['finding-1', 'finding-2'],
      aiInsight: 'This represents the culmination of ancient friendship theory\'s transformation into mystical philosophy.'
    }
  ])

  const handleSearch = async () => {
    if (!searchQuery.trim()) return
    
    setIsSearching(true)
    // Simulate AI-powered semantic search
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsSearching(false)
  }

  const toggleFindingSelection = (findingId: string) => {
    setSelectedFindings(prev => 
      prev.includes(findingId) 
        ? prev.filter(id => id !== findingId)
        : [...prev, findingId]
    )
  }

  const createReportSection = () => {
    if (selectedFindings.length === 0) return
    
    const newSection: ReportSection = {
      id: `section-${Date.now()}`,
      title: `Research Section ${reportSections.length + 1}`,
      findings: findings.filter(f => selectedFindings.includes(f.id)),
      commentary: '',
      order: reportSections.length
    }
    
    setReportSections(prev => [...prev, newSection])
    setSelectedFindings([])
    setActiveView('arrange')
  }

  const updateSectionCommentary = (sectionId: string, commentary: string) => {
    setReportSections(prev => prev.map(section => 
      section.id === sectionId ? { ...section, commentary } : section
    ))
  }

  const reorderSections = (fromIndex: number, toIndex: number) => {
    setReportSections(prev => {
      const newSections = [...prev]
      const [movedSection] = newSections.splice(fromIndex, 1)
      newSections.splice(toIndex, 0, movedSection)
      return newSections.map((section, index) => ({ ...section, order: index }))
    })
  }

  const generateReport = async () => {
    setIsGenerating(true)
    await new Promise(resolve => setTimeout(resolve, 3000))
    setIsGenerating(false)
    setActiveView('report')
  }

  const exportReport = async (format: string) => {
    // Export logic would go here
    console.log(`Exporting report as ${format}`)
  }

  return (
    <div className="min-h-screen bg-[#0D0D0F] text-[#F5F3EF]">
      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-b border-white/10 bg-white/5 backdrop-blur-xl sticky top-0 z-50"
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-[#C9A962] to-[#8B7355] rounded-lg flex items-center justify-center">
                  <Brain className="w-4 h-4 text-[#0D0D0F]" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-[#C9A962]">LOGOS: DISCOVERY</h1>
                  <p className="text-sm text-[#7C9885]">Find what you didn't know to look for</p>
                </div>
              </div>
            </div>
            
            <nav className="flex items-center space-x-1">
              {['discover', 'arrange', 'report'].map((view) => (
                <button
                  key={view}
                  onClick={() => setActiveView(view as any)}
                  className={`px-4 py-2 rounded-lg capitalize transition-all ${
                    activeView === view
                      ? 'bg-[#C9A962] text-[#0D0D0F] font-medium'
                      : 'text-[#F5F3EF] hover:bg-white/10'
                  }`}
                >
                  {view}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </motion.header>

      {/* Discovery View */}
      <AnimatePresence mode="wait">
        {activeView === 'discover' && (
          <motion.div
            key="discover"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="max-w-7xl mx-auto px-6 py-8"
          >
            {/* Search Section */}
            <div className="mb-8">
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <Sparkles className="w-6 h-6 text-[#C9A962]" />
                  <h2 className="text-xl font-semibold">Semantic Discovery Engine</h2>
                </div>
                
                <div className="flex space-x-4 mb-4">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                      placeholder="Describe concepts, themes, or questions in natural language..."
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 pl-12 text-[#F5F3EF] placeholder-[#F5F3EF]/60 focus:outline-none focus:ring-2 focus:ring-[#C9A962] focus:border-transparent"
                    />
                    <Search className="absolute left-4 top-3.5 w-5 h-5 text-[#F5F3EF]/60" />
                  </div>
                  
                  <motion.button
                    onClick={handleSearch}
                    disabled={isSearching}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-[#C9A962] text-[#0D0D0F] px-6 py-3 rounded-xl font-medium hover:bg-[#C9A962]/90 transition-colors disabled:opacity-50"
                  >
                    {isSearching ? <RefreshCw className="w-5 h-5 animate-spin" /> : 'Discover'}
                  </motion.button>
                </div>

                <div className="flex items-center space-x-4">
                  <span className="text-sm text-[#F5F3EF]/70">Discovery Mode:</span>
                  {['semantic', 'thematic', 'chronological'].map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setDiscoveryMode(mode as any)}
                      className={`px-3 py-1 rounded-lg text-sm capitalize transition-all ${
                        discoveryMode === mode
                          ? 'bg-[#7C9885] text-[#0D0D0F]'
                          : 'bg-white/10 text-[#F5F3EF]/70 hover:bg-white/20'
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Innovation Components */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <button
                onClick={() => setShowInnovations(!showInnovations)}
                className="flex items-center space-x-2 text-[#C9A962] hover:text-[#C9A962]/80 transition-colors mb-4"
              >
                <Wand2 className="w-5 h-5" />
                <span>Advanced Research Tools</span>
                <ChevronRight className={`w-4 h-4 transition-transform ${showInnovations ? 'rotate-90' : ''}`} />
              </button>
              
              <AnimatePresence>
                {showInnovations && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="grid grid-cols-1 lg:grid-cols-2 gap-6"
                  >
                    <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
                      <ArgumentSynthesis />
                    </div>
                    <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
                      <DebateView />
                    </div>
                    <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
                      <CounterEvidence />
                    </div>
                    <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
                      <ResearchCanvas />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Findings Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {findings.map((finding, index) => (
                <motion.div
                  key={finding.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`bg-white/5 backdrop-blur-xl rounded-2xl border transition-all cursor-pointer ${
                    selectedFindings.includes(finding.id)
                      ? 'border-[#C9A962] bg-[#C9A962]/10'
                      : 'border-white/10 hover:border-white/20'
                  }`}
                  onClick={() => toggleFindingSelection(finding.id)}
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          finding.type === 'insight' ? 'bg-[#C9A962]/20 text-[#C9A962]' :
                          finding.type === 'connection' ? 'bg-[#7C9885]/20 text-[#7C9885]' :
                          finding.type === 'pattern' ? 'bg-[#8B7355]/20 text-[#8B7355]' :
                          'bg-white/20 text-[#F5F3EF]'
                        }`}>
                          {finding.type === 'insight' && <Lightbulb className="w-4 h-4" />}
                          {finding.type === 'connection' && <Network className="w-4 h-4" />}
                          {finding.type === 'pattern' && <Target className="w-4 h-4" />}
                          {finding.type === 'passage' && <BookOpen className="w-4 h-4" />}
                        </div>
                        <span className="text-xs uppercase tracking-wide text-[#F5F3EF]/60">
                          {finding.type}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-[#C9A962]" />
                          <span className="text-sm text-[#F5F3EF]/70">
                            {(finding.relevance * 100).toFixed(0)}%
                          </span>
                        </div>
                        {selectedFindings.includes(finding.id) && (
                          <Check className="w-5 h-5 text-[#C9A962]" />
                        )}
                      </div>
                    </div>

                    <h3 className="text-lg font-semibold mb-2 text-[#F5F3EF]">
                      {finding.title}
                    </h3>
                    
                    <p className="text-[#F5F3EF]/80 mb-4 text-sm leading-relaxed">
                      {finding.content}
                    </p>

                    {finding.aiInsight && (
                      <div className="bg-[#C9A962]/10 border border-[#C9A962]/20 rounded-xl p-3 mb-4">
                        <div className="flex items-start space-x-2">
                          <Zap className="w-4 h-4 text-[#C9A962] flex-shrink-0 mt-0.5" />
                          <p className="text-sm text-[#F5F3EF]/90">
                            {finding.aiInsight}
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-2">
                        {finding.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 bg-white/10 rounded-md text-xs text-[#F5F3EF]/70"
                          >
                            {tag}
                          </span>
                        ))}
                        {finding.tags.length > 3 && (
                          <span className="text-xs text-[#F5F3EF]/50">
                            +{finding.tags.length - 3} more
                          </span>
                        )}
                      </div>
                      
                      <span className="text-xs text-[#F5F3EF]/50">
                        {finding.source}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Selection Actions */}
            <AnimatePresence>
              {selectedFindings.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-[#C9A962] text-[#0D0D0F] px-6 py-3 rounded-xl shadow-xl flex items-center space-x-4"
                >
                  <span className="font-medium">
                    {selectedFindings.length} findings selected
                  </span>
                  <button
                    onClick={createReportSection}
                    className="bg-[#0D0D0F] text-[#C9A962] px-4 py-2 rounded-lg font-medium hover:bg-[#0D0D0F]/90 transition-colors flex items-center space-x-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create Section</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Arrange View */}
        {activeView === 'arrange' && (
          <motion.div
            key="arrange"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="max-w-4xl mx-auto px-6 py-8"
          >
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-2 text-[#C9A962]">Arrange Report Sections</h2>
              <p className="text-[#F5F3EF]/70">
                Organize your findings into a coherent research narrative
              </p>
            </div>

            {reportSections.length === 0 ? (
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-12 text-center">
                <Layers className="w-12 h-12 text-[#F5F3EF]/40 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No sections created yet</h3>
                <p className="text-[#F5F3EF]/70 mb-4">
                  Go back to Discovery to select findings and create report sections
                </p>
                <button
                  onClick={() => setActiveView('discover')}
                  className="bg-[#C9A962] text-[#0D0D0F] px-6 py-3 rounded-xl font-medium hover:bg-[#C9A962]/90 transition-colors"
                >
                  Back to Discovery
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {reportSections.map((section, index) => (
                  <motion.div
                    key={section.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-[#C9A962] text-[#0D0D0F] rounded-lg flex items-center justify-center font-bold">
                          {index + 1}
                        </div>
                        <input
                          type="text"
                          value={section.title}
                          onChange={(e) => {
                            setReportSections(prev => prev.map(s => 
                              s.id === section.id ? { ...s, title: e.target.value } : s
                            ))
                          }}
                          className="bg-transparent text-lg font-semibold text-[#F5F3EF] border-none outline-none"
                        />
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => reorderSections(index, Math.max(0, index - 1))}
                          disabled={index === 0}
                          className="p-2 rounded-lg hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <ArrowUp className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => reorderSections(index, Math.min(reportSections.length - 1, index + 1))}
                          disabled={index === reportSections.length - 1}
                          className="p-2 rounded-lg hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <ArrowDown className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      {section.findings.map((finding) => (
                        <div
                          key={finding.id}
                          className="bg-white/5 border border-white/10 rounded-xl p-4"
                        >
                          <h4 className="font-medium text-[#F5F3EF] mb-2 text-sm">
                            {finding.title}
                          </h4>
                          <p className="text-xs text-[#F5F3EF]/70 line-clamp-2">
                            {finding.content}
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="border-t border-white/10 pt-4">
                      <label className="block text-sm font-medium mb-2 text-[#F5F3EF]">
                        Commentary
                      </label>
                      <textarea
                        value={section.commentary}
                        onChange={(e) => updateSectionCommentary(section.id, e.target.value)}
                        placeholder="Add your interpretation, analysis, or commentary for this section..."
                        className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-[#F5F3EF] placeholder-[#F5F3EF]/60 focus:outline-none focus:ring-2 focus:ring-[#C9A962] focus:border-transparent resize-none"
                        rows={4}
                      />
                    </div>
                  </motion.div>
                ))}

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-center pt-6"
                >
                  <button
                    onClick={generateReport}
                    disabled={isGenerating}
                    className="bg-[#C9A962] text-[#0D0D0F] px-8 py-3 rounded-xl font-medium hover:bg-[#C9A962]/90 transition-colors flex items-center space-x-3"
                  >
                    {isGenerating ? (
                      <RefreshCw className="w-5 h-5 animate-spin" />
                    ) : (
                      <FileText className="w-5 h-5" />
                    )}
                    <span>{isGenerating ? 'Generating...' : 'Generate Report'}</span>
                  </button>
                </motion.div>
              </div>
            )}
          </motion.div>
        )}

        {/* Report View */}
        {activeView === 'report' && (
          <motion.div
            key="report"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="max-w-4xl mx-auto px-6 py-8"
          >
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold mb-2 text-[#C9A962]">Research Report</h2>
                <p className="text-[#F5F3EF]/70">
                  Generated report ready for export
                </p>
              </div>
              
              <div className="flex items-center space-x-4">
                <select
                  value={exportFormat}
                  onChange={(e) => setExportFormat(e.target.value as any)}
                  className="bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-[#F5F3EF] focus:outline-none focus:ring-2 focus:ring-[#C9A962]"
                >
                  <option value="pdf">PDF</option>
                  <option value="markdown">Markdown</option>
                  <option value="latex">LaTeX</option>
                </select>
                
                <button
                  onClick={() => exportReport(exportFormat)}
                  className="bg-[#C9A962] text-[#0D0D0F] px-6 py-2 rounded-xl font-medium hover:bg-[#C9A962]/90 transition-colors flex items-center space-x-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Export</span>
                </button>
              </div>
            </div>

            {reportSections.length === 0 ? (
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-12 text-center">
                <FileText className="w-12 h-12 text-[#F5F3EF]/40 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No report generated yet</h3>
                <p className="text-[#F5F3EF]/70 mb-4">
                  Create and arrange sections first, then generate your report
                </p>
              </div>
            ) : (
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-8">
                <div className="prose prose-invert max-w-none">
                  <h1 className="text-3xl font-bold text-[#C9A962] mb-6">
                    Ancient Philosophy Research Report
                  </h1>
                  
                  <div className="text-sm text-[#F5F3EF]/60 mb-8 flex items-center space-x-4">
                    <span>Generated: {new Date().toLocaleDateString()}</span>
                    <span>•</span>
                    <span>Sections: {reportSections.length}</span>
                    <span>•</span>
                    <span>Findings: {reportSections.reduce((acc, s) => acc + s.findings.length, 0)}</span>
                  </div>

                  {reportSections.map((section, index) => (
                    <motion.section
                      key={section.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="mb-8 last:mb-0"
                    >
                      <h2 className="text-2xl font-semibold text-[#7C9885] mb-4">
                        {index + 1}. {section.title}
                      </h2>
                      
                      {section.commentary && (
                        <div className="bg-[#7C9885]/10 border-l-4 border-[#7C9885] pl-6 py-4 mb-6">
                          <p className="text-[#F5F3EF]/90 leading-relaxed">
                            {section.commentary}
                          </p>
                        </div>
                      )}

                      <div className="space-y-4">
                        {section.findings.map((finding) => (
                          <div
                            key={finding.id}
                            className="bg-white/5 border border-white/10 rounded-xl p-6"
                          >
                            <div className="flex items-start justify-between mb-3">
                              <h3 className="text-lg font-medium text-[#F5F3EF]">
                                {finding.title}
                              </h3>
                              <span className="text-xs text-[#F5F3EF]/60 bg-white/10 px-2 py-1 rounded">
                                {finding.type}
                              </span>
                            </div>
                            
                            <p className="text-[#F5F3EF]/80 mb-4 leading-relaxed">
                              {finding.content}
                            </p>
                            
                            {finding.aiInsight && (
                              <div className="bg-[#C9A962]/10 border border-[#C9A962]/20 rounded-lg p-4 mb-4">
                                <p className="text-[#F5F3EF]/90 text-sm">
                                  <strong className="text-[#C9A962]">AI Insight:</strong> {finding.aiInsight}
                                </p>
                              </div>
                            )}
                            
                            <div className="flex items-center justify-between text-sm text-[#F5F3EF]/60">
                              <span>{finding.source}</span>
                              <div className="flex items-center space-x-1">
                                <Star className="w-3 h-3 text-[#C9A962]" />
                                <span>{(finding.relevance * 100).toFixed(0)}% relevance</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.section>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
