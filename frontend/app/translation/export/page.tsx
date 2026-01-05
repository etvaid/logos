
'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Download, 
  FileText, 
  File, 
  Code, 
  Eye, 
  Settings, 
  Copy, 
  Check,
  BookOpen,
  Quote,
  Languages,
  Layers,
  Zap,
  Clock,
  Users,
  GitBranch,
  Sparkles,
  Archive,
  Filter,
  Search,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Star,
  History,
  Brain,
  Target,
  Globe,
  Layout,
  Type,
  Palette,
  Bookmark,
  Share2,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Loader2
} from 'lucide-react'
import { MultiScaleView } from '@/components/innovations/multi_scale_view'
import { ComparativeFrames } from '@/components/innovations/comparative_frames'

interface Translation {
  id: string
  title: string
  author: string
  work: string
  passage: string
  language: 'greek' | 'latin'
  originalText: string
  translation: string
  notes: string[]
  citations: string[]
  createdAt: Date
  lastModified: Date
  wordCount: number
  completionStatus: 'draft' | 'review' | 'final'
  collaborators: string[]
  semanticTags: string[]
  crossReferences: Array<{
    passage: string
    relevance: number
    note: string
  }>
}

interface ExportFormat {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  extensions: string[]
  supportsOriginal: boolean
  supportsCitations: boolean
  supportsNotes: boolean
  supportsFormatting: boolean
  previewAvailable: boolean
}

interface ExportOptions {
  format: string
  includeOriginal: boolean
  citationStyle: 'cts' | 'traditional' | 'custom'
  includeNotes: boolean
  includeMetadata: boolean
  pageLayout: 'single' | 'parallel' | 'interlinear'
  fontSize: number
  fontFamily: string
  includeSemanticTags: boolean
  includeCrossRefs: boolean
  exportScope: 'current' | 'selection' | 'all'
  customTemplate?: string
}

interface ExportJob {
  id: string
  translationIds: string[]
  options: ExportOptions
  status: 'preparing' | 'processing' | 'ready' | 'failed' | 'completed'
  progress: number
  downloadUrl?: string
  createdAt: Date
  estimatedSize: string
  name?: string
  format?: string
  timestamp?: string
}

const mockTranslations: Translation[] = [
  {
    id: '1',
    title: 'Republic Book IV - The Tripartite Soul',
    author: 'Plato',
    work: 'Republic',
    passage: '4.441c-442d',
    language: 'greek',
    originalText: 'ἆρ\' οὖν οὐχὶ τρία ταῦτά ἐστι, καὶ τρεῖς ἀρεταὶ αὐτῶν;',
    translation: 'Are these not three things, then, and three virtues belonging to them?',
    notes: ['Key passage on tripartite soul theory', 'ἀρετή here means excellence/virtue'],
    citations: ['Pl. Rep. 4.441c3-5'],
    createdAt: new Date('2024-01-15'),
    lastModified: new Date('2024-01-20'),
    wordCount: 1247,
    completionStatus: 'final',
    collaborators: ['Dr. Sarah Chen', 'Prof. Marcus Weber'],
    semanticTags: ['soul', 'virtue', 'tripartition', 'justice'],
    crossReferences: [
      { passage: 'Phaedrus 246a-b', relevance: 0.9, note: 'Chariot allegory of soul' },
      { passage: 'Laws 9.863a', relevance: 0.7, note: 'Later treatment of soul parts' }
    ]
  },
  {
    id: '2',
    title: 'Nicomachean Ethics I.7 - The Function Argument',
    author: 'Aristotle',
    work: 'Nicomachean Ethics',
    passage: '1.7.1097b22-1098a20',
    language: 'greek',
    originalText: 'τί δή ποτε τοῦτ\' ἂν εἴη; εἰ γὰρ αὐλητῇ καὶ ἀνδριαντοποιῷ',
    translation: 'What then could this be? For if there is some function for a flute-player and a sculptor...',
    notes: ['Function argument for human good', 'ἔργον = function/work'],
    citations: ['Arist. EN 1.7.1097b25-28'],
    createdAt: new Date('2024-01-10'),
    lastModified: new Date('2024-01-18'),
    wordCount: 892,
    completionStatus: 'review',
    collaborators: ['Prof. Elena Rodriguez'],
    semanticTags: ['function', 'eudaimonia', 'virtue', 'good'],
    crossReferences: [
      { passage: 'Politics 1.2', relevance: 0.8, note: 'Human as political animal' }
    ]
  }
]

const exportFormats: ExportFormat[] = [
  {
    id: 'docx',
    name: 'Microsoft Word',
    description: 'Rich formatting with comments and track changes',
    icon: <FileText className="w-5 h-5" />,
    extensions: ['.docx'],
    supportsOriginal: true,
    supportsCitations: true,
    supportsNotes: true,
    supportsFormatting: true,
    previewAvailable: true
  },
  {
    id: 'pdf',
    name: 'PDF Document',
    description: 'Professional layout with embedded fonts',
    icon: <File className="w-5 h-5" />,
    extensions: ['.pdf'],
    supportsOriginal: true,
    supportsCitations: true,
    supportsNotes: true,
    supportsFormatting: true,
    previewAvailable: true
  },
  {
    id: 'latex',
    name: 'LaTeX Source',
    description: 'Academic publishing with custom templates',
    icon: <Code className="w-5 h-5" />,
    extensions: ['.tex', '.cls'],
    supportsOriginal: true,
    supportsCitations: true,
    supportsNotes: true,
    supportsFormatting: true,
    previewAvailable: false
  },
  {
    id: 'html',
    name: 'HTML Web Page',
    description: 'Interactive web format with hyperlinks',
    icon: <Globe className="w-5 h-5" />,
    extensions: ['.html'],
    supportsOriginal: true,
    supportsCitations: true,
    supportsNotes: true,
    supportsFormatting: true,
    previewAvailable: true
  }
]

const citationStyles = [
  { id: 'cts', name: 'CTS URN', description: 'Canonical Text Services format' },
  { id: 'traditional', name: 'Traditional', description: 'Author abbreviation format' },
  { id: 'custom', name: 'Custom Template', description: 'Define your own citation format' }
]

const pageLayouts = [
  { id: 'single', name: 'Translation Only', description: 'Clean translation without original' },
  { id: 'parallel', name: 'Parallel Text', description: 'Original and translation side-by-side' },
  { id: 'interlinear', name: 'Interlinear', description: 'Translation beneath each line of original' }
]

export default function TranslationExportPage() {
  const [selectedTranslations, setSelectedTranslations] = useState<string[]>([])
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    format: 'pdf',
    includeOriginal: true,
    citationStyle: 'cts',
    includeNotes: true,
    includeMetadata: true,
    pageLayout: 'parallel',
    fontSize: 12,
    fontFamily: 'Times New Roman',
    includeSemanticTags: false,
    includeCrossRefs: true,
    exportScope: 'current'
  })
  const [exportJobs, setExportJobs] = useState<ExportJob[]>([])
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'select' | 'format' | 'export'>('select')
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'draft' | 'review' | 'final'>('all')
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false)
  const [copiedJobId, setCopiedJobId] = useState<string | null>(null)
  const [isExporting, setIsExporting] = useState(false)

  // Simulate export job processing
  useEffect(() => {
    const interval = setInterval(() => {
      setExportJobs(prev => prev.map(job => {
        if (job.status === 'processing' && job.progress < 100) {
          const newProgress = Math.min(job.progress + Math.random() * 15, 100)
          return {
            ...job,
            progress: newProgress,
            status: newProgress >= 100 ? 'ready' : 'processing',
            downloadUrl: newProgress >= 100 ? `/downloads/${job.id}` : undefined
          }
        }
        return job
      }))
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const filteredTranslations = mockTranslations.filter(translation => {
    const matchesSearch = searchQuery === '' || 
      translation.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      translation.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      translation.work.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesFilter = filterStatus === 'all' || translation.completionStatus === filterStatus
    
    return matchesSearch && matchesFilter
  })

  const selectedFormat = exportFormats.find(f => f.id === exportOptions.format)

  const handleTranslationSelect = (translationId: string) => {
    setSelectedTranslations(prev => 
      prev.includes(translationId) 
        ? prev.filter(id => id !== translationId)
        : [...prev, translationId]
    )
  }

  const handleExport = async () => {
    if (selectedTranslations.length === 0) return

    setIsExporting(true)
    
    const newJob: ExportJob = {
      id: Date.now().toString(),
      translationIds: [...selectedTranslations],
      options: { ...exportOptions },
      status: 'preparing',
      progress: 0,
      createdAt: new Date(),
      estimatedSize: `${(selectedTranslations.length * 2.3).toFixed(1)}MB`
    }

    setExportJobs(prev => [newJob, ...prev])
    
    // Simulate processing delay
    setTimeout(() => {
      setExportJobs(prev => prev.map(job => 
        job.id === newJob.id 
          ? { ...job, status: 'processing', progress: 5 }
          : job
      ))
      setIsExporting(false)
      setActiveTab('export')
    }, 1500)
  }

  const copyJobUrl = (jobId: string) => {
    navigator.clipboard.writeText(`${window.location.origin}/exports/${jobId}`)
    setCopiedJobId(jobId)
    setTimeout(() => setCopiedJobId(null), 2000)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'text-yellow-400'
      case 'review': return 'text-blue-400'
      case 'final': return 'text-green-400'
      default: return 'text-white/60'
    }
  }

  const getJobStatusIcon = (status: string) => {
    switch (status) {
      case 'preparing': return <Clock className="w-4 h-4 text-yellow-400" />
      case 'processing': return <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />
      case 'ready': return <CheckCircle2 className="w-4 h-4 text-green-400" />
      case 'failed': return <AlertCircle className="w-4 h-4 text-red-400" />
      default: return null
    }
  }

  return (
    <div className="min-h-screen bg-[#0D0D0F] text-[#F5F3EF]">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative overflow-hidden bg-gradient-to-br from-[#0D0D0F] via-[#1A1A1D] to-[#0D0D0F] py-24"
      >
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-32 h-32 bg-[#C9A962]/10 rounded-full blur-xl" />
          <div className="absolute bottom-20 right-20 w-40 h-40 bg-[#7C9885]/10 rounded-full blur-xl" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#8B7355]/5 rounded-full blur-2xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full px-4 py-2 mb-8">
              <Sparkles className="w-4 h-4 text-[#C9A962]" />
              <span className="text-sm text-white/80">Context-Aware Translation Studio</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-[#C9A962] via-[#F5F3EF] to-[#7C9885] bg-clip-text text-transparent mb-6">
              Export & Share
              <br />
              Your Translations
            </h1>
            
            <p className="text-xl md:text-2xl text-white/70 mb-12 max-w-3xl mx-auto leading-relaxed">
              Professional-grade export formats with semantic intelligence and collaborative features
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              {[
                { icon: FileText, label: 'Word & PDF', desc: 'Rich formatting' },
                { icon: Code, label: 'LaTeX', desc: 'Academic publishing' },
                { icon: Quote, label: 'Citations', desc: 'CTS & traditional' },
                { icon: Brain, label: 'AI-Enhanced', desc: 'Semantic metadata' }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4 text-center"
                >
                  <feature.icon className="w-8 h-8 text-[#C9A962] mx-auto mb-2" />
                  <h3 className="font-semibold text-white mb-1">{feature.label}</h3>
                  <p className="text-sm text-white/60">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Tab Navigation */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex items-center justify-center mb-12"
        >
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-2 flex items-center gap-2">
            {[
              { id: 'select', icon: Target, label: 'Select Translations' },
              { id: 'format', icon: Settings, label: 'Format Options' },
              { id: 'export', icon: Download, label: 'Export & Download' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-all ${
                  activeTab === tab.id
                    ? 'bg-[#C9A962]/20 text-[#C9A962] border border-[#C9A962]/20'
                    : 'text-white/60 hover:text-white/80 hover:bg-white/5'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {activeTab === 'select' && (
            <motion.div
              key="select"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 20, opacity: 0 }}
              className="space-y-8"
            >
              {/* Search and Filter */}
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
                  <input
                    type="text"
                    placeholder="Search translations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-[#C9A962]/50"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Filter className="w-5 h-5 text-white/60" />
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value as any)}
                    className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#C9A962]/50"
                  >
                    <option value="all">All Status</option>
                    <option value="draft">Draft</option>
                    <option value="review">Review</option>
                    <option value="final">Final</option>
                  </select>
                </div>
              </div>

              {/* Selection Summary */}
              {selectedTranslations.length > 0 && (
                <motion.div
                  initial={{ y: -10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="bg-[#C9A962]/10 border border-[#C9A962]/20 rounded-xl p-4 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#C9A962]" />
                    <span className="text-[#C9A962]">
                      {selectedTranslations.length} translation{selectedTranslations.length !== 1 ? 's' : ''} selected
                    </span>
                  </div>
                  <button
                    onClick={() => setActiveTab('format')}
                    className="bg-[#C9A962] hover:bg-[#B8984F] text-[#0D0D0F] px-4 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2"
                  >
                    Continue
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </motion.div>
              )}

              {/* Translations List */}
              <div className="space-y-4">
                {filteredTranslations.map((translation, index) => (
                  <motion.div
                    key={translation.id}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className={`bg-white/5 backdrop-blur-xl border rounded-xl p-6 cursor-pointer transition-all ${
                      selectedTranslations.includes(translation.id)
                        ? 'border-[#C9A962]/50 bg-[#C9A962]/10'
                        : 'border-white/10 hover:border-white/20 hover:bg-white/8'
                    }`}
                    onClick={() => handleTranslationSelect(translation.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                            selectedTranslations.includes(translation.id)
                              ? 'border-[#C9A962] bg-[#C9A962]'
                              : 'border-white/30'
                          }`}>
                            {selectedTranslations.includes(translation.id) && (
                              <Check className="w-3 h-3 text-[#0D0D0F]" />
                            )}
                          </div>
                          <h3 className="text-xl font-semibold text-white">{translation.title}</h3>
                          <span className={`px-2 py-1 rounded text-xs uppercase tracking-wider ${getStatusColor(translation.completionStatus)}`}>
                            {translation.completionStatus}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-white/60 mb-3">
                          <span>{translation.author} • {translation.work}</span>
                          <span>{translation.passage}</span>
                          <span>{translation.wordCount} words</span>
                        </div>

                        <p className="text-white/80 mb-4 line-clamp-2">{translation.translation}</p>

                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-2 text-white/60">
                            <Users className="w-4 h-4" />
                            <span>{translation.collaborators.length} collaborator{translation.collaborators.length !== 1 ? 's' : ''}</span>
                          </div>
                          <div className="flex items-center gap-2 text-white/60">
                            <Clock className="w-4 h-4" />
                            <span>{translation.lastModified.toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-2 text-white/60">
                            <GitBranch className="w-4 h-4" />
                            <span>{translation.crossReferences.length} cross-refs</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {filteredTranslations.length === 0 && (
                <div className="text-center py-12">
                  <BookOpen className="w-16 h-16 text-white/20 mx-auto mb-4" />
                  <h3 className="text-xl text-white/60 mb-2">No translations found</h3>
                  <p className="text-white/40">Try adjusting your search or filter criteria</p>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'format' && (
            <motion.div
              key="format"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 20, opacity: 0 }}
              className="space-y-8"
            >
              {/* Format Selection */}
              <div>
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <Layout className="w-6 h-6 text-[#C9A962]" />
                  Export Format
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {exportFormats.map((format) => (
                    <motion.div
                      key={format.id}
                      whileHover={{ scale: 1.02 }}
                      className={`bg-white/5 backdrop-blur-xl border rounded-xl p-6 cursor-pointer transition-all ${
                        exportOptions.format === format.id
                          ? 'border-[#C9A962]/50 bg-[#C9A962]/10'
                          : 'border-white/10 hover:border-white/20'
                      }`}
                      onClick={() => setExportOptions(prev => ({ ...prev, format: format.id }))}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="text-[#C9A962]">{format.icon}</div>
                        {exportOptions.format === format.id && (
                          <Check className="w-5 h-5 text-[#C9A962]" />
                        )}
                      </div>
                      <h3 className="text-lg font-semibold text-white mb-2">{format.name}</h3>
                      <p className="text-sm text-white/60 mb-3">{format.description}</p>
                      <div className="text-xs text-white/40">
                        {format.extensions.join(', ')}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              <MultiScaleView
                levels={[
                  {
                    id: 'basic',
                    title: 'Basic Options',
                    items: [
                      { label: 'Include Original Text', active: exportOptions.includeOriginal },
                      { label: 'Include Notes', active: exportOptions.includeNotes },
                      { label: 'Include Metadata', active: exportOptions.includeMetadata }
                    ]
                  },
                  {
                    id: 'layout',
                    title: 'Page Layout',
                    items: pageLayouts.map(layout => ({
                      label: layout.name,
                      active: exportOptions.pageLayout === layout.id,
                      description: layout.description
                    }))
                  },
                  {
                    id: 'advanced',
                    title: 'Advanced Features',
                    items: [
                      { label: 'Semantic Tags', active: exportOptions.includeSemanticTags },
                      { label: 'Cross-References', active: exportOptions.includeCrossRefs },
                      { label: 'Custom Template', active: !!exportOptions.customTemplate }
                    ]
                  }
                ]}
              />

              {/* Basic Options */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                    <Settings className="w-5 h-5 text-[#C9A962]" />
                    Content Options
                  </h3>
                  
                  <div className="space-y-4">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                        exportOptions.includeOriginal ? 'border-[#C9A962] bg-[#C9A962]' : 'border-white/30'
                      }`}>
                        {exportOptions.includeOriginal && <Check className="w-3 h-3 text-[#0D0D0F]" />}
                      </div>
                      <span className="text-white">Include Original Text</span>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer">
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                        exportOptions.includeNotes ? 'border-[#C9A962] bg-[#C9A962]' : 'border-white/30'
                      }`}>
                        {exportOptions.includeNotes && <Check className="w-3 h-3 text-[#0D0D0F]" />}
                      </div>
                      <span className="text-white">Include Notes & Commentary</span>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer">
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                        exportOptions.includeSemanticTags ? 'border-[#C9A962] bg-[#C9A962]' : 'border-white/30'
                      }`}>
                        {exportOptions.includeSemanticTags && <Check className="w-3 h-3 text-[#0D0D0F]" />}
                      </div>
                      <span className="text-white">Include Semantic Tags</span>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer">
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                        exportOptions.includeCrossRefs ? 'border-[#C9A962] bg-[#C9A962]' : 'border-white/30'
                      }`}>
                        {exportOptions.includeCrossRefs && <Check className="w-3 h-3 text-[#0D0D0F]" />}
                      </div>
                      <span className="text-white">Include Cross-References</span>
                    </label>
                  </div>
                </div>

                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                    <Quote className="w-5 h-5 text-[#C9A962]" />
                    Citation Format
                  </h3>

                  <div className="space-y-3">
                    {citationStyles.map((style) => (
                      <label
                        key={style.id}
                        className="flex items-start gap-3 cursor-pointer p-3 rounded-lg hover:bg-white/5 transition-colors"
                        onClick={() => setExportOptions(prev => ({ ...prev, citationStyle: style.id as any }))}
                      >
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 ${
                          exportOptions.citationStyle === style.id ? 'border-[#C9A962]' : 'border-white/30'
                        }`}>
                          {exportOptions.citationStyle === style.id && (
                            <div className="w-2 h-2 rounded-full bg-[#C9A962]" />
                          )}
                        </div>
                        <div>
                          <span className="text-white font-medium">{style.name}</span>
                          <p className="text-sm text-white/60">{style.description}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Page Layout */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  <Layers className="w-5 h-5 text-[#C9A962]" />
                  Page Layout
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {pageLayouts.map((layout) => (
                    <motion.div
                      key={layout.id}
                      whileHover={{ scale: 1.02 }}
                      className={`bg-white/5 backdrop-blur-xl border rounded-xl p-6 cursor-pointer transition-all ${
                        exportOptions.pageLayout === layout.id
                          ? 'border-[#C9A962]/50 bg-[#C9A962]/10'
                          : 'border-white/10 hover:border-white/20'
                      }`}
                      onClick={() => setExportOptions(prev => ({ ...prev, pageLayout: layout.id as any }))}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-white">{layout.name}</h4>
                        {exportOptions.pageLayout === layout.id && (
                          <Check className="w-5 h-5 text-[#C9A962]" />
                        )}
                      </div>
                      <p className="text-sm text-white/60">{layout.description}</p>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Advanced Options */}
              <motion.div
                initial={false}
                animate={{ height: isAdvancedOpen ? 'auto' : 'auto' }}
                className="overflow-hidden"
              >
                <button
                  onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
                  className="flex items-center gap-2 text-white hover:text-[#C9A962] transition-colors mb-4"
                >
                  <Zap className="w-5 h-5" />
                  <span className="font-semibold">Advanced Options</span>
                  {isAdvancedOpen ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>

                <AnimatePresence>
                  {isAdvancedOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="grid grid-cols-1 lg:grid-cols-2 gap-6"
                    >
                      <div className="space-y-4">
                        <div>
                          <label className="block text-white font-medium mb-2">Font Size</label>
                          <input
                            type="range"
                            min="8"
                            max="18"
                            step="1"
                            value={exportOptions.fontSize}
                            onChange={(e) => setExportOptions(prev => ({ ...prev, fontSize: parseInt(e.target.value) }))}
                            className="w-full accent-[#C9A962]"
                          />
                          <div className="flex justify-between text-sm text-white/60 mt-1">
                            <span>8pt</span>
                            <span className="text-[#C9A962]">{exportOptions.fontSize}pt</span>
                            <span>18pt</span>
                          </div>
                        </div>

                        <div>
                          <label className="block text-white font-medium mb-2">Font Family</label>
                          <select
                            value={exportOptions.fontFamily}
                            onChange={(e) => setExportOptions(prev => ({ ...prev, fontFamily: e.target.value }))}
                            className="w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#C9A962]/50"
                          >
                            <option value="Times New Roman">Times New Roman</option>
                            <option value="Minion Pro">Minion Pro</option>
                            <option value="Garamond">Garamond</option>
                            <option value="Palatino">Palatino</option>
                          </select>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-white font-medium mb-2">Export Scope</label>
                          <select
                            value={exportOptions.exportScope}
                            onChange={(e) => setExportOptions(prev => ({ ...prev, exportScope: e.target.value as any }))}
                            className="w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#C9A962]/50"
                          >
                            <option value="current">Selected Translations</option>
                            <option value="all">All Translations</option>
                          </select>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              <ComparativeFrames
                frames={[
                  {
                    title: 'Preview',
                    content: selectedFormat && (
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 text-[#C9A962]">
                          {selectedFormat.icon}
                          <span className="font-semibold">{selectedFormat.name}</span>
                        </div>
                        <div className="text-sm text-white/70">
                          <p>• {exportOptions.includeOriginal ? 'Original text included' : 'Translation only'}</p>
                          <p>• Citations in {citationStyles.find(s => s.id === exportOptions.citationStyle)?.name} format</p>
                          <p>• {pageLayouts.find(l => l.id === exportOptions.pageLayout)?.name} layout</p>
                          <p>• {exportOptions.fontSize}pt {exportOptions.fontFamily}</p>
                        </div>
                      </div>
                    )
                  },
                  {
                    title: 'Export Summary',
                    content: (
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-white/60">Translations:</span>
                          <span className="text-white">{selectedTranslations.length}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-white/60">Estimated size:</span>
                          <span className="text-white">{(selectedTranslations.length * 2.3).toFixed(1)}MB</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-white/60">Format:</span>
                          <span className="text-white">{selectedFormat?.name}</span>
                        </div>
                        <button
                          onClick={() => setActiveTab('export')}
                          disabled={selectedTranslations.length === 0}
                          className="w-full bg-[#C9A962] hover:bg-[#B8984F] disabled:bg-white/10 disabled:text-white/40 text-[#0D0D0F] px-4 py-3 rounded-lg font-semibold transition-colors mt-4"
                        >
                          Proceed to Export
                        </button>
                      </div>
                    )
                  }
                ]}
              />
            </motion.div>
          )}

          {activeTab === 'export' && (
            <motion.div
              key="export"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 20, opacity: 0 }}
              className="space-y-8"
            >
              {/* Export Summary */}
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <Download className="w-6 h-6 text-[#C9A962]" />
                  Export Summary
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-[#C9A962] mb-2">{selectedTranslations.length}</div>
                    <div className="text-white/60">Translations</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-[#C9A962] mb-2">{selectedFormat?.name}</div>
                    <div className="text-white/60">Format</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-[#C9A962] mb-2">
                      {(selectedTranslations.length * 2.3).toFixed(1)}MB
                    </div>
                    <div className="text-white/60">Est. Size</div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-white/10 flex flex-col md:flex-row gap-4">
                  <button
                    onClick={handleExport}
                    disabled={selectedTranslations.length === 0 || isExporting}
                    className="flex-1 bg-[#C9A962] hover:bg-[#B8984F] disabled:bg-white/10 disabled:text-white/40 text-[#0D0D0F] px-6 py-4 rounded-xl font-semibold transition-colors flex items-center justify-center gap-3"
                  >
                    {isExporting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Preparing Export...
                      </>
                    ) : (
                      <>
                        <Download className="w-5 h-5" />
                        Start Export
                      </>
                    )}
                  </button>
                  
                  <button
                    onClick={() => setIsPreviewOpen(true)}
                    disabled={!selectedFormat?.previewAvailable}
                    className="bg-white/10 hover:bg-white/15 disabled:bg-white/5 disabled:text-white/40 text-white px-6 py-4 rounded-xl font-semibold transition-colors flex items-center justify-center gap-3"
                  >
                    <Eye className="w-5 h-5" />
                    Preview
                  </button>
                </div>
              </div>

              {/* Export Jobs */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                  <History className="w-5 h-5 text-[#C9A962]" />
                  Export History
                </h3>

                {exportJobs.length === 0 ? (
                  <div className="text-center py-12 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl">
                    <Archive className="w-16 h-16 text-white/20 mx-auto mb-4" />
                    <h4 className="text-xl text-white/60 mb-2">No exports yet</h4>
                    <p className="text-white/40">Your export jobs will appear here</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {exportJobs.map((job, index) => (
                      <motion.div
                        key={job.id}
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-lg ${
                              job.status === 'completed' ? 'bg-green-500/20' :
                              job.status === 'processing' ? 'bg-blue-500/20' :
                              'bg-red-500/20'
                            }`}>
                              {job.status === 'completed' ? <CheckCircle2 className="w-5 h-5 text-green-400" /> :
                               job.status === 'processing' ? <Loader2 className="w-5 h-5 text-blue-400 animate-spin" /> :
                               <AlertCircle className="w-5 h-5 text-red-400" />}
                            </div>
                            <div>
                              <h4 className="font-medium text-white">{job.name}</h4>
                              <p className="text-sm text-white/60">{job.format} • {job.timestamp}</p>
                            </div>
                          </div>
                          {job.status === 'completed' && (
                            <button className="px-4 py-2 bg-[#C9A962] text-[#0D0D0F] rounded-lg hover:bg-[#C9A962]/80 transition-colors flex items-center gap-2">
                              <Download className="w-4 h-4" />
                              Download
                            </button>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
