
'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FileText, 
  Copy, 
  Download, 
  Plus, 
  Trash2, 
  BookOpen, 
  Quote, 
  Link2, 
  Settings, 
  Search, 
  Filter, 
  CheckCircle, 
  AlertCircle, 
  Upload,
  Grid,
  List,
  Eye,
  Share2,
  Calendar,
  User,
  Globe,
  Book,
  Scroll,
  Target,
  Zap,
  Brain,
  Sparkles,
  RefreshCw,
  Archive,
  Tag,
  Clock,
  TrendingUp
} from 'lucide-react'
import { ArgumentSynthesis } from '@/components/innovations/argument_synthesis'
import { ComparativeFrames } from '@/components/innovations/comparative_frames'

interface Citation {
  id: string
  type: 'book' | 'article' | 'digital' | 'manuscript' | 'inscription'
  title: string
  author: string
  year: number
  journal?: string
  publisher?: string
  pages?: string
  doi?: string
  url?: string
  accessed?: string
  location?: string
  manuscript?: string
  collection?: string
  tags: string[]
  notes: string
  created: Date
  lastModified: Date
  formats: {
    chicago: string
    mla: string
    apa: string
    turabian: string
    sbl: string
    classical: string
  }
}

interface CitationProject {
  id: string
  name: string
  description: string
  citations: string[]
  created: Date
  lastModified: Date
  color: string
}

const CITATION_FORMATS = [
  { id: 'chicago', name: 'Chicago', description: 'Chicago Manual of Style' },
  { id: 'mla', name: 'MLA', description: 'Modern Language Association' },
  { id: 'apa', name: 'APA', description: 'American Psychological Association' },
  { id: 'turabian', name: 'Turabian', description: 'Turabian Style Guide' },
  { id: 'sbl', name: 'SBL', description: 'Society of Biblical Literature' },
  { id: 'classical', name: 'Classical', description: 'Classical Studies Format' }
]

const CITATION_TYPES = [
  { id: 'book', name: 'Book', icon: Book },
  { id: 'article', name: 'Article', icon: FileText },
  { id: 'digital', name: 'Digital', icon: Globe },
  { id: 'manuscript', name: 'Manuscript', icon: Scroll },
  { id: 'inscription', name: 'Inscription', icon: Target }
]

export default function CitationGenerator() {
  const [citations, setCitations] = useState<Citation[]>([])
  const [projects, setProjects] = useState<CitationProject[]>([])
  const [selectedCitations, setSelectedCitations] = useState<string[]>([])
  const [activeFormat, setActiveFormat] = useState('chicago')
  const [activeView, setActiveView] = useState<'grid' | 'list'>('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showNewCitation, setShowNewCitation] = useState(false)
  const [showProjects, setShowProjects] = useState(false)
  const [activeProject, setActiveProject] = useState<string | null>(null)
  const [showZoteroSync, setShowZoteroSync] = useState(false)
  const [copyStatus, setCopyStatus] = useState<string | null>(null)
  const [newCitation, setNewCitation] = useState({
    type: 'book' as 'book' | 'article' | 'digital' | 'manuscript' | 'inscription',
    title: '',
    author: '',
    year: new Date().getFullYear(),
    journal: '',
    publisher: '',
    pages: '',
    doi: '',
    url: '',
    location: '',
    manuscript: '',
    collection: '',
    notes: ''
  })

  const fileInputRef = useRef<HTMLInputElement>(null)

  // Sample data
  useEffect(() => {
    const sampleCitations: Citation[] = [
      {
        id: '1',
        type: 'book',
        title: 'The Iliad',
        author: 'Homer',
        year: 2011,
        publisher: 'University of Chicago Press',
        pages: '1-683',
        tags: ['epic', 'homer', 'troy'],
        notes: 'Lattimore translation, excellent for teaching',
        created: new Date(),
        lastModified: new Date(),
        formats: {
          chicago: 'Homer. The Iliad. Translated by Richmond Lattimore. Chicago: University of Chicago Press, 2011.',
          mla: 'Homer. The Iliad. Trans. Richmond Lattimore. U of Chicago P, 2011.',
          apa: 'Homer. (2011). The Iliad (R. Lattimore, Trans.). University of Chicago Press.',
          turabian: 'Homer. The Iliad. Translated by Richmond Lattimore. Chicago: University of Chicago Press, 2011.',
          sbl: 'Homer. The Iliad. Translated by Richmond Lattimore. Chicago: University of Chicago Press, 2011.',
          classical: 'Homer, Il. (Lattimore trans., Chicago 2011)'
        }
      },
      {
        id: '2',
        type: 'article',
        title: 'Achilles and the Poetics of Anger',
        author: 'Gregory Nagy',
        year: 2019,
        journal: 'Classical Antiquity',
        pages: '45-72',
        doi: '10.1525/ca.2019.38.1.45',
        tags: ['achilles', 'anger', 'poetics'],
        notes: 'Groundbreaking analysis of μῆνις',
        created: new Date(),
        lastModified: new Date(),
        formats: {
          chicago: 'Nagy, Gregory. "Achilles and the Poetics of Anger." Classical Antiquity 38, no. 1 (2019): 45-72.',
          mla: 'Nagy, Gregory. "Achilles and the Poetics of Anger." Classical Antiquity, vol. 38, no. 1, 2019, pp. 45-72.',
          apa: 'Nagy, G. (2019). Achilles and the poetics of anger. Classical Antiquity, 38(1), 45-72.',
          turabian: 'Nagy, Gregory. "Achilles and the Poetics of Anger." Classical Antiquity 38, no. 1 (2019): 45-72.',
          sbl: 'Gregory Nagy, "Achilles and the Poetics of Anger," CA 38 (2019): 45-72.',
          classical: 'Nagy 2019, 45-72'
        }
      },
      {
        id: '3',
        type: 'digital',
        title: 'Perseus Digital Library',
        author: 'Gregory Crane',
        year: 2023,
        url: 'http://www.perseus.tufts.edu',
        accessed: '2024-01-15',
        tags: ['digital', 'texts', 'tools'],
        notes: 'Essential resource for Greek and Latin texts',
        created: new Date(),
        lastModified: new Date(),
        formats: {
          chicago: 'Crane, Gregory. "Perseus Digital Library." Accessed January 15, 2024. http://www.perseus.tufts.edu.',
          mla: 'Crane, Gregory. "Perseus Digital Library." Web. 15 Jan. 2024.',
          apa: 'Crane, G. (2023). Perseus Digital Library. Retrieved January 15, 2024, from http://www.perseus.tufts.edu',
          turabian: 'Crane, Gregory. "Perseus Digital Library." Accessed January 15, 2024. http://www.perseus.tufts.edu.',
          sbl: 'Gregory Crane, "Perseus Digital Library," http://www.perseus.tufts.edu (accessed January 15, 2024).',
          classical: 'Perseus Digital Library (accessed 15.01.2024)'
        }
      }
    ]
    setCitations(sampleCitations)

    const sampleProjects: CitationProject[] = [
      {
        id: '1',
        name: 'Dissertation Bibliography',
        description: 'Sources for my dissertation on Homeric similes',
        citations: ['1', '2'],
        created: new Date(),
        lastModified: new Date(),
        color: '#C9A962'
      },
      {
        id: '2',
        name: 'Course Reader',
        description: 'Required readings for Greek Epic course',
        citations: ['1', '3'],
        created: new Date(),
        lastModified: new Date(),
        color: '#7C9885'
      }
    ]
    setProjects(sampleProjects)
  }, [])

  const filteredCitations = citations.filter(citation => {
    const matchesSearch = citation.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         citation.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         citation.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesFilter = !filterType || citation.type === filterType
    const matchesProject = !activeProject || projects.find(p => p.id === activeProject)?.citations.includes(citation.id)
    return matchesSearch && matchesFilter && matchesProject
  })

  const handleAddCitation = () => {
    if (!newCitation.title || !newCitation.author) return

    const citation: Citation = {
      id: Date.now().toString(),
      ...newCitation,
      tags: [],
      created: new Date(),
      lastModified: new Date(),
      formats: generateFormats(newCitation)
    }

    setCitations(prev => [citation, ...prev])
    setNewCitation({
      type: 'book',
      title: '',
      author: '',
      year: new Date().getFullYear(),
      journal: '',
      publisher: '',
      pages: '',
      doi: '',
      url: '',
      location: '',
      manuscript: '',
      collection: '',
      notes: ''
    })
    setShowNewCitation(false)
  }

  const generateFormats = (citation: any) => {
    // Simplified format generation - in real app, this would be more sophisticated
    const formats = {
      chicago: `${citation.author}. "${citation.title}." ${citation.journal || citation.publisher}, ${citation.year}.`,
      mla: `${citation.author}. "${citation.title}." ${citation.journal || citation.publisher}, ${citation.year}.`,
      apa: `${citation.author}. (${citation.year}). ${citation.title}. ${citation.journal || citation.publisher}.`,
      turabian: `${citation.author}. "${citation.title}." ${citation.journal || citation.publisher}, ${citation.year}.`,
      sbl: `${citation.author}, "${citation.title}," ${citation.journal || citation.publisher} (${citation.year}).`,
      classical: `${citation.author} ${citation.year}`
    }
    return formats
  }

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopyStatus('copied')
      setTimeout(() => setCopyStatus(null), 2000)
    } catch (err) {
      setCopyStatus('error')
      setTimeout(() => setCopyStatus(null), 2000)
    }
  }

  const handleBatchCopy = async () => {
    const selectedTexts = citations
      .filter(c => selectedCitations.includes(c.id))
      .map(c => c.formats[activeFormat as keyof typeof c.formats])
      .join('\n\n')
    
    await handleCopy(selectedTexts)
  }

  const handleExport = () => {
    const selectedCitationData = citations.filter(c => selectedCitations.includes(c.id))
    const exportData = {
      format: activeFormat,
      citations: selectedCitationData,
      exported: new Date().toISOString()
    }
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `citations-${activeFormat}-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleZoteroSync = () => {
    setIsLoading(true)
    // Simulate Zotero sync
    setTimeout(() => {
      setIsLoading(false)
      setShowZoteroSync(false)
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0D0D0F] via-[#1A1A1F] to-[#0D0D0F]">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-[#0D0D0F]/80 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between"
          >
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-br from-[#C9A962] to-[#8B7355] rounded-xl">
                  <Quote className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-[#F5F3EF]">Citation Generator</h1>
                  <p className="text-[#C9A962] text-sm">Everything a serious scholar needs</p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowProjects(!showProjects)}
                className="flex items-center space-x-2 px-4 py-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl hover:bg-white/10 transition-all duration-200 text-[#F5F3EF]"
              >
                <Archive className="h-4 w-4" />
                <span>Projects</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowZoteroSync(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-[#7C9885] to-[#8B7355] rounded-xl hover:shadow-lg transition-all duration-200 text-white"
              >
                <Link2 className="h-4 w-4" />
                <span>Zotero Sync</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowNewCitation(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-[#C9A962] to-[#8B7355] rounded-xl hover:shadow-lg transition-all duration-200 text-white"
              >
                <Plus className="h-4 w-4" />
                <span>Add Citation</span>
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Format Selection */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
            >
              <h3 className="text-lg font-semibold text-[#F5F3EF] mb-4 flex items-center">
                <Settings className="h-5 w-5 text-[#C9A962] mr-2" />
                Citation Format
              </h3>
              
              <div className="space-y-2">
                {CITATION_FORMATS.map((format) => (
                  <motion.button
                    key={format.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveFormat(format.id)}
                    className={`w-full text-left p-3 rounded-xl transition-all duration-200 ${
                      activeFormat === format.id
                        ? 'bg-gradient-to-r from-[#C9A962] to-[#8B7355] text-white'
                        : 'bg-white/5 hover:bg-white/10 text-[#F5F3EF]'
                    }`}
                  >
                    <div className="font-medium">{format.name}</div>
                    <div className="text-xs opacity-70">{format.description}</div>
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Type Filter */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
            >
              <h3 className="text-lg font-semibold text-[#F5F3EF] mb-4 flex items-center">
                <Filter className="h-5 w-5 text-[#C9A962] mr-2" />
                Filter by Type
              </h3>
              
              <div className="space-y-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setFilterType(null)}
                  className={`w-full text-left p-3 rounded-xl transition-all duration-200 ${
                    !filterType
                      ? 'bg-gradient-to-r from-[#C9A962] to-[#8B7355] text-white'
                      : 'bg-white/5 hover:bg-white/10 text-[#F5F3EF]'
                  }`}
                >
                  All Types
                </motion.button>
                
                {CITATION_TYPES.map((type) => {
                  const Icon = type.icon
                  return (
                    <motion.button
                      key={type.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setFilterType(type.id)}
                      className={`w-full text-left p-3 rounded-xl transition-all duration-200 flex items-center ${
                        filterType === type.id
                          ? 'bg-gradient-to-r from-[#C9A962] to-[#8B7355] text-white'
                          : 'bg-white/5 hover:bg-white/10 text-[#F5F3EF]'
                      }`}
                    >
                      <Icon className="h-4 w-4 mr-2" />
                      {type.name}
                    </motion.button>
                  )
                })}
              </div>
            </motion.div>

            {/* Innovation Components */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <ArgumentSynthesis />
            </motion.div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Controls */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
                    <input
                      type="text"
                      placeholder="Search citations..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-xl text-[#F5F3EF] placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#C9A962] focus:border-transparent"
                    />
                  </div>

                  <div className="flex items-center space-x-2 bg-white/10 rounded-xl p-1">
                    <button
                      onClick={() => setActiveView('grid')}
                      className={`p-2 rounded-lg transition-all duration-200 ${
                        activeView === 'grid'
                          ? 'bg-[#C9A962] text-white'
                          : 'text-white/70 hover:text-white'
                      }`}
                    >
                      <Grid className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setActiveView('list')}
                      className={`p-2 rounded-lg transition-all duration-200 ${
                        activeView === 'list'
                          ? 'bg-[#C9A962] text-white'
                          : 'text-white/70 hover:text-white'
                      }`}
                    >
                      <List className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {selectedCitations.length > 0 && (
                  <div className="flex items-center space-x-3">
                    <span className="text-sm text-[#C9A962]">
                      {selectedCitations.length} selected
                    </span>
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleBatchCopy}
                      className="flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-[#7C9885] to-[#8B7355] rounded-xl text-white hover:shadow-lg transition-all duration-200"
                    >
                      <Copy className="h-4 w-4" />
                      <span>Copy All</span>
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleExport}
                      className="flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-[#C9A962] to-[#8B7355] rounded-xl text-white hover:shadow-lg transition-all duration-200"
                    >
                      <Download className="h-4 w-4" />
                      <span>Export</span>
                    </motion.button>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Citations Display */}
            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-12 text-center"
                >
                  <RefreshCw className="h-8 w-8 text-[#C9A962] mx-auto mb-4 animate-spin" />
                  <p className="text-[#F5F3EF]">Loading citations...</p>
                </motion.div>
              ) : filteredCitations.length === 0 ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-12 text-center"
                >
                  <FileText className="h-12 w-12 text-white/30 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-[#F5F3EF] mb-2">No Citations Found</h3>
                  <p className="text-white/60 mb-6">Add your first citation to get started</p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowNewCitation(true)}
                    className="px-6 py-3 bg-gradient-to-r from-[#C9A962] to-[#8B7355] rounded-xl text-white hover:shadow-lg transition-all duration-200"
                  >
                    Add Citation
                  </motion.button>
                </motion.div>
              ) : (
                <div className={`grid gap-6 ${activeView === 'grid' ? 'grid-cols-1' : 'grid-cols-1'}`}>
                  {filteredCitations.map((citation, index) => (
                    <motion.div
                      key={citation.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-200 ${
                        selectedCitations.includes(citation.id) ? 'ring-2 ring-[#C9A962]' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start space-x-4 flex-1">
                          <button
                            onClick={() => {
                              setSelectedCitations(prev =>
                                prev.includes(citation.id)
                                  ? prev.filter(id => id !== citation.id)
                                  : [...prev, citation.id]
                              )
                            }}
                            className={`mt-1 w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200 ${
                              selectedCitations.includes(citation.id)
                                ? 'bg-[#C9A962] border-[#C9A962]'
                                : 'border-white/30 hover:border-[#C9A962]'
                            }`}
                          >
                            {selectedCitations.includes(citation.id) && (
                              <CheckCircle className="h-3 w-3 text-white" />
                            )}
                          </button>

                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <span className={`inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium ${
                                citation.type === 'book' ? 'bg-blue-500/20 text-blue-300' :
                                citation.type === 'article' ? 'bg-green-500/20 text-green-300' :
                                citation.type === 'digital' ? 'bg-purple-500/20 text-purple-300' :
                                citation.type === 'manuscript' ? 'bg-yellow-500/20 text-yellow-300' :
                                'bg-red-500/20 text-red-300'
                              }`}>
                                {CITATION_TYPES.find(t => t.id === citation.type)?.name}
                              </span>
                              
                              {citation.tags.map((tag) => (
                                <span
                                  key={tag}
                                  className="inline-flex items-center px-2 py-1 rounded-lg text-xs bg-[#C9A962]/20 text-[#C9A962]"
                                >
                                  <Tag className="h-3 w-3 mr-1" />
                                  {tag}
                                </span>
                              ))}
                            </div>

                            <h4 className="font-semibold text-[#F5F3EF] mb-1">{citation.title}</h4>
                            <p className="text-[#C9A962] mb-2">{citation.author} ({citation.year})</p>
                            
                            {citation.notes && (
                              <p className="text-sm text-white/60 mb-3">{citation.notes}</p>
                            )}

                            <div className="bg-white/5 rounded-xl p-4 font-mono text-sm text-[#F5F3EF] border border-white/10">
                              {citation.formats[activeFormat as keyof typeof citation.formats]}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2 ml-4">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleCopy(citation.formats[activeFormat as keyof typeof citation.formats])}
                            className="p-2 bg-white/10 hover:bg-[#C9A962] rounded-xl transition-all duration-200 group"
                          >
                            <Copy className="h-4 w-4 text-white/70 group-hover:text-white" />
                          </motion.button>

                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="p-2 bg-white/10 hover:bg-red-500 rounded-xl transition-all duration-200 group"
                          >
                            <Trash2 className="h-4 w-4 text-white/70 group-hover:text-white" />
                          </motion.button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs text-white/50">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1">
                            <Clock className="h-3 w-3" />
                            <span>Created {citation.created.toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <TrendingUp className="h-3 w-3" />
                            <span>Modified {citation.lastModified.toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </AnimatePresence>

            {/* Comparative Frames Component */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <ComparativeFrames />
            </motion.div>
          </div>
        </div>
      </div>

      {/* New Citation Modal */}
      <AnimatePresence>
        {showNewCitation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#0D0D0F] border border-white/20 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-[#F5F3EF]">Add New Citation</h3>
                <button
                  onClick={() => setShowNewCitation(false)}
                  className="p-2 hover:bg-white/10 rounded-xl transition-all duration-200"
                >
                  <Plus className="h-5 w-5 text-white/70 rotate-45" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#F5F3EF] mb-2">Type</label>
                  <div className="grid grid-cols-5 gap-2">
                    {CITATION_TYPES.map((type) => {
                      const Icon = type.icon
                      return (
                        <button
                          key={type.id}
                          onClick={() => setNewCitation(prev => ({ ...prev, type: type.id as any }))}
                          className={`p-3 rounded-xl border transition-all duration-200 flex flex-col items-center space-y-1 ${
                            newCitation.type === type.id
                              ? 'bg-[#C9A962] border-[#C9A962] text-white'
                              : 'bg-white/5 border-white/20 text-white/70 hover:bg-white/10'
                          }`}
                        >
                          <Icon className="h-4 w-4" />
                          <span className="text-xs">{type.name}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#F5F3EF] mb-2">Title *</label>
                    <input
                      type="text"
                      value={newCitation.title}
                      onChange={(e) => setNewCitation(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-xl text-[#F5F3EF] focus:outline-none focus:ring-2 focus:ring-[#C9A962]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#F5F3EF] mb-2">Author *</label>
                    <input
                      type="text"
                      value={newCitation.author}
                      onChange={(e) => setNewCitation(prev => ({ ...prev, author: e.target.value }))}
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-xl text-[#F5F3EF] focus:outline-none focus:ring-2 focus:ring-[#C9A962]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#F5F3EF] mb-2">Year</label>
                    <input
                      type="number"
                      value={newCitation.year}
                      onChange={(e) => setNewCitation(prev => ({ ...prev, year: parseInt(e.target.value) }))}
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-xl text-[#F5F3EF] focus:outline-none focus:ring-2 focus:ring-[#C9A962]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#F5F3EF] mb-2">Pages</label>
                    <input
                      type="text"
                      value={newCitation.pages}
                      onChange={(e) => setNewCitation(prev => ({ ...prev, pages: e.target.value }))}
                      placeholder="e.g., 123-145"
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-xl text-[#F5F3EF] focus:outline-none focus:ring-2 focus:ring-[#C9A962]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#F5F3EF] mb-2">DOI</label>
                    <input
                      type="text"
                      value={newCitation.doi}
                      onChange={(e) => setNewCitation(prev => ({ ...prev, doi: e.target.value }))}
                      placeholder="10.1000/123456"
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-xl text-[#F5F3EF] focus:outline-none focus:ring-2 focus:ring-[#C9A962]"
                    />
                  </div>
                </div>

                {newCitation.type === 'book' && (
                  <div>
                    <label className="block text-sm font-medium text-[#F5F3EF] mb-2">Publisher</label>
                    <input
                      type="text"
                      value={newCitation.publisher}
                      onChange={(e) => setNewCitation(prev => ({ ...prev, publisher: e.target.value }))}
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-xl text-[#F5F3EF] focus:outline-none focus:ring-2 focus:ring-[#C9A962]"
                    />
                  </div>
                )}

                {newCitation.type === 'article' && (
                  <div>
                    <label className="block text-sm font-medium text-[#F5F3EF] mb-2">Journal</label>
                    <input
                      type="text"
                      value={newCitation.journal}
                      onChange={(e) => setNewCitation(prev => ({ ...prev, journal: e.target.value }))}
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-xl text-[#F5F3EF] focus:outline-none focus:ring-2 focus:ring-[#C9A962]"
                    />
                  </div>
                )}

                {newCitation.type === 'digital' && (
                  <div>
                    <label className="block text-sm font-medium text-[#F5F3EF] mb-2">URL</label>
                    <input
                      type="url"
                      value={newCitation.url}
                      onChange={(e) => setNewCitation(prev => ({ ...prev, url: e.target.value }))}
                      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-xl text-[#F5F3EF] focus:outline-none focus:ring-2 focus:ring-[#C9A962]"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-[#F5F3EF] mb-2">Notes</label>
                  <textarea
                    value={newCitation.notes}
                    onChange={(e) => setNewCitation(prev => ({ ...prev, notes: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-xl text-[#F5F3EF] focus:outline-none focus:ring-2 focus:ring-[#C9A962] resize-none"
                    placeholder="Personal notes about this source..."
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-4 mt-6 pt-6 border-t border-white/10">
                <button
                  onClick={() => setShowNewCitation(false)}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-[#F5F3EF] transition-all duration-200"
                >
                  Cancel
                </button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAddCitation}
                  disabled={!newCitation.title || !newCitation.author}
                  className="px-6 py-2 bg-gradient-to-r from-[#C9A962] to-[#8B7355] rounded-xl text-white hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add Citation
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Zotero Sync Modal */}
      <AnimatePresence>
        {showZoteroSync && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#0D0D0F] border border-white/20 rounded-2xl p-6 w-full max-w-md"
            >
              <div className="text-center">
                <div className="p-4 bg-gradient-to-br from-[#C9A962] to-[#8B7355] rounded-2xl w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Link2 className="h-8 w-8 text-white" />
                </div>
                
                <h3 className="text-xl font-semibold text-[#F5F3EF] mb-2">Sync with Zotero</h3>
                <p className="text-white/60 mb-6">
                  Connect your Zotero library to import and sync citations automatically.
                </p>

                {isLoading ? (
                  <div className="space-y-4">
                    <RefreshCw className="h-8 w-8 text-[#C9A962] mx-auto animate-spin" />
                    <p className="text-[#C9A962]">Syncing with Zotero...</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleZoteroSync}
                      className="w-full px-6 py-3 bg-gradient-to-r from-[#C9A962] to-[#8B7355] rounded-xl text-white hover:shadow-lg transition-all duration-200"
                    >
                      Connect to Zotero
                    </motion.button>

                    <button
                      onClick={() => setShowZoteroSync(false)}
                      className="w-full px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl text-[#F5F3EF] transition-all duration-200"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Copy Status Toast */}
      <AnimatePresence>
        {copyStatus && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-6 right-6 px-4 py-3 bg-green-500/20 border border-green-500/30 rounded-lg text-green-400 flex items-center gap-2"
          >
            <CheckCircle className="w-4 h-4" />
            {copyStatus}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}