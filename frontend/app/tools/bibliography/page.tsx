'use client'

import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Search, 
  Plus, 
  Download, 
  FileText, 
  Quote, 
  Book, 
  Calendar, 
  User, 
  Tag, 
  Filter, 
  SortAsc, 
  Copy, 
  Check, 
  ExternalLink,
  Trash2,
  Edit3,
  BookOpen,
  Scroll,
  Archive,
  Star,
  Clock,
  Globe,
  ChevronDown,
  ChevronRight,
  Settings,
  Wand2,
  Sparkles,
  Brain,
  Network,
  Zap
} from 'lucide-react'
import { ArgumentSynthesis } from '@/components/innovations/argument_synthesis'
import { ComparativeFrames } from '@/components/innovations/comparative_frames'

interface Work {
  id: string
  title: string
  author: string
  year: string
  publisher?: string
  location?: string
  pages?: string
  doi?: string
  isbn?: string
  type: 'book' | 'article' | 'dissertation' | 'manuscript' | 'inscription'
  tags: string[]
  notes?: string
  dateAdded: Date
  relevanceScore?: number
  citationCount?: number
  isStarred: boolean
}

interface SearchResult {
  id: string
  title: string
  author: string
  year: string
  snippet: string
  relevance: number
  type: string
  source: string
  doi?: string
}

const mockWorks: Work[] = [
  {
    id: '1',
    title: 'The Iliad: A Commentary',
    author: 'Geoffrey S. Kirk',
    year: '1985',
    publisher: 'Cambridge University Press',
    location: 'Cambridge',
    type: 'book',
    tags: ['Homer', 'Epic', 'Commentary'],
    dateAdded: new Date('2024-01-15'),
    relevanceScore: 95,
    citationCount: 1247,
    isStarred: true
  },
  {
    id: '2',
    title: 'Homeric Soundplay and the Aesthetics of Talk',
    author: 'Deborah Beck',
    year: '2020',
    publisher: 'Bloomsbury Academic',
    type: 'book',
    tags: ['Homer', 'Stylistics', 'Oral Poetry'],
    dateAdded: new Date('2024-01-20'),
    relevanceScore: 88,
    citationCount: 34,
    isStarred: false
  },
  {
    id: '3',
    title: 'The Making of Homeric Verse',
    author: 'Milman Parry',
    year: '1971',
    publisher: 'Oxford University Press',
    type: 'book',
    tags: ['Homer', 'Oral Tradition', 'Formula'],
    dateAdded: new Date('2024-01-12'),
    relevanceScore: 92,
    citationCount: 2156,
    isStarred: true
  }
]

const mockSearchResults: SearchResult[] = [
  {
    id: 'sr1',
    title: 'Digital Approaches to Homeric Epic',
    author: 'Maria Gonzalez',
    year: '2023',
    snippet: 'Recent computational analysis reveals new patterns in formulaic composition...',
    relevance: 94,
    type: 'article',
    source: 'Classical Quarterly',
    doi: '10.1017/S0009838823000123'
  },
  {
    id: 'sr2',
    title: 'The Archaeology of Troy: New Discoveries',
    author: 'Ernst Pernicka',
    year: '2023',
    snippet: 'Latest excavations provide fresh evidence for Bronze Age settlement patterns...',
    relevance: 87,
    type: 'article',
    source: 'Anatolian Studies'
  },
  {
    id: 'sr3',
    title: 'Intertextuality in Ancient Epic',
    author: 'Sarah Johnson',
    year: '2022',
    snippet: 'Cross-referential analysis reveals sophisticated literary networks...',
    relevance: 91,
    type: 'book',
    source: 'Harvard University Press'
  }
]

const citationFormats = [
  { id: 'mla', name: 'MLA 9th Edition', icon: FileText },
  { id: 'apa', name: 'APA 7th Edition', icon: Book },
  { id: 'chicago', name: 'Chicago 17th Edition', icon: Scroll },
  { id: 'harvard', name: 'Harvard Style', icon: Archive }
]

export default function BibliographyBuilder() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedWorks, setSelectedWorks] = useState<Work[]>(mockWorks)
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [activeFilter, setActiveFilter] = useState<string>('all')
  const [sortBy, setSortBy] = useState<string>('date')
  const [selectedFormat, setSelectedFormat] = useState('mla')
  const [showFormatted, setShowFormatted] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [editingWork, setEditingWork] = useState<string | null>(null)
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false)
  const [aiSuggestions, setAiSuggestions] = useState(false)
  const [exportFormat, setExportFormat] = useState('bibtex')
  const [workCount, setWorkCount] = useState(mockWorks.length)

  const searchInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setWorkCount(selectedWorks.length)
  }, [selectedWorks])

  const handleSearch = async () => {
    if (!searchQuery.trim()) return
    
    setIsSearching(true)
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800))
    setSearchResults(mockSearchResults.filter(result => 
      result.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      result.author.toLowerCase().includes(searchQuery.toLowerCase())
    ))
    setIsSearching(false)
  }

  const addWorkToBibliography = (result: SearchResult) => {
    const newWork: Work = {
      id: result.id,
      title: result.title,
      author: result.author,
      year: result.year,
      type: result.type as any,
      tags: [],
      dateAdded: new Date(),
      relevanceScore: result.relevance,
      isStarred: false
    }
    setSelectedWorks(prev => [...prev, newWork])
  }

  const removeWork = (id: string) => {
    setSelectedWorks(prev => prev.filter(work => work.id !== id))
  }

  const toggleStar = (id: string) => {
    setSelectedWorks(prev => prev.map(work => 
      work.id === id ? { ...work, isStarred: !work.isStarred } : work
    ))
  }

  const formatCitation = (work: Work, format: string): string => {
    switch (format) {
      case 'mla':
        return `${work.author}. ${work.title}. ${work.publisher || 'Publisher'}, ${work.year}.`
      case 'apa':
        return `${work.author} (${work.year}). ${work.title}. ${work.publisher || 'Publisher'}.`
      case 'chicago':
        return `${work.author}. ${work.title}. ${work.location || 'Location'}: ${work.publisher || 'Publisher'}, ${work.year}.`
      case 'harvard':
        return `${work.author} ${work.year}, ${work.title}, ${work.publisher || 'Publisher'}.`
      default:
        return `${work.author} (${work.year}). ${work.title}.`
    }
  }

  const copyToClipboard = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const exportBibliography = () => {
    const formatted = selectedWorks.map(work => formatCitation(work, selectedFormat)).join('\n\n')
    const blob = new Blob([formatted], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `bibliography.${exportFormat}`
    a.click()
  }

  const filteredWorks = selectedWorks.filter(work => {
    if (activeFilter === 'all') return true
    if (activeFilter === 'starred') return work.isStarred
    return work.type === activeFilter
  })

  const sortedWorks = [...filteredWorks].sort((a, b) => {
    switch (sortBy) {
      case 'date':
        return b.dateAdded.getTime() - a.dateAdded.getTime()
      case 'author':
        return a.author.localeCompare(b.author)
      case 'year':
        return parseInt(b.year) - parseInt(a.year)
      case 'relevance':
        return (b.relevanceScore || 0) - (a.relevanceScore || 0)
      default:
        return 0
    }
  })

  return (
    <div className="min-h-screen bg-[#0D0D0F] text-[#F5F3EF]">
      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-black/20 backdrop-blur-xl border-b border-white/10"
      >
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <motion.h1 
                className="text-4xl font-bold bg-gradient-to-r from-[#C9A962] via-[#F5F3EF] to-[#7C9885] bg-clip-text text-transparent"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                Scholar's Workbench
              </motion.h1>
              <motion.p 
                className="text-[#7C9885] text-lg mt-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                Everything a serious scholar needs
              </motion.p>
            </div>
            <motion.div 
              className="flex items-center space-x-4"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
            >
              <div className="bg-white/5 px-4 py-2 rounded-lg border border-white/10">
                <span className="text-[#C9A962] font-semibold">{workCount}</span>
                <span className="text-white/70 ml-1">works</span>
              </div>
              <button
                onClick={() => setAiSuggestions(!aiSuggestions)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-all ${
                  aiSuggestions 
                    ? 'bg-[#C9A962]/20 border-[#C9A962]/50 text-[#C9A962]' 
                    : 'bg-white/5 border-white/10 text-white/70 hover:border-[#C9A962]/30'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>AI Assist</span>
              </button>
            </motion.div>
          </div>

          {/* Search Section */}
          <div className="space-y-4">
            <div className="flex space-x-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search for works, authors, topics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-lg focus:border-[#C9A962]/50 focus:outline-none focus:ring-2 focus:ring-[#C9A962]/20 text-[#F5F3EF] placeholder:text-white/40"
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSearch}
                disabled={isSearching}
                className="px-8 py-4 bg-gradient-to-r from-[#C9A962] to-[#8B7355] text-white font-medium rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
              >
                {isSearching ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Searching</span>
                  </div>
                ) : (
                  'Search Works'
                )}
              </motion.button>
              <button
                onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
                className="px-4 py-4 bg-white/5 border border-white/10 rounded-lg hover:border-[#C9A962]/30 transition-all"
              >
                <Settings className="w-5 h-5" />
              </button>
            </div>

            {/* Advanced Search */}
            <AnimatePresence>
              {showAdvancedSearch && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-white/5 border border-white/10 rounded-lg p-6"
                >
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Author</label>
                      <input className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-sm" placeholder="Author name" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Year Range</label>
                      <input className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-sm" placeholder="1990-2024" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Publication Type</label>
                      <select className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-sm">
                        <option>All Types</option>
                        <option>Book</option>
                        <option>Article</option>
                        <option>Dissertation</option>
                      </select>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Search Results */}
          <div className="lg:col-span-1">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-[#C9A962]">Search Results</h2>
                {aiSuggestions && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="flex items-center space-x-1 text-xs text-[#7C9885]"
                  >
                    <Brain className="w-3 h-3" />
                    <span>AI Enhanced</span>
                  </motion.div>
                )}
              </div>

              <AnimatePresence>
                {searchResults.length > 0 ? (
                  <div className="space-y-4">
                    {searchResults.map((result) => (
                      <motion.div
                        key={result.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white/5 border border-white/10 rounded-lg p-4 hover:border-[#C9A962]/30 transition-all"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h3 className="font-medium text-[#F5F3EF] mb-1 line-clamp-2">{result.title}</h3>
                            <p className="text-sm text-white/70">{result.author} ({result.year})</p>
                          </div>
                          <div className="flex items-center space-x-1 ml-2">
                            <span className="text-xs bg-[#C9A962]/20 text-[#C9A962] px-2 py-1 rounded">
                              {result.relevance}% match
                            </span>
                          </div>
                        </div>
                        <p className="text-sm text-white/60 mb-3 line-clamp-2">{result.snippet}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-[#7C9885]">{result.source}</span>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => addWorkToBibliography(result)}
                            className="flex items-center space-x-1 px-3 py-1 bg-[#C9A962] text-white text-xs rounded-md hover:bg-[#C9A962]/80 transition-all"
                          >
                            <Plus className="w-3 h-3" />
                            <span>Add</span>
                          </motion.button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : searchQuery && !isSearching ? (
                  <div className="text-center py-8 text-white/50">
                    <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No results found</p>
                    <p className="text-sm mt-2">Try different search terms</p>
                  </div>
                ) : (
                  <div className="text-center py-8 text-white/50">
                    <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Search for scholarly works</p>
                    <p className="text-sm mt-2">Enter keywords, authors, or topics above</p>
                  </div>
                )}
              </AnimatePresence>
            </div>

            {/* AI Suggestions */}
            <AnimatePresence>
              {aiSuggestions && selectedWorks.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="mt-6 bg-gradient-to-br from-[#C9A962]/10 to-[#7C9885]/10 backdrop-blur-xl border border-[#C9A962]/20 rounded-xl p-6"
                >
                  <div className="flex items-center space-x-2 mb-4">
                    <Zap className="w-5 h-5 text-[#C9A962]" />
                    <h3 className="text-lg font-semibold text-[#C9A962]">AI Suggestions</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="bg-white/5 border border-white/10 rounded-lg p-3">
                      <p className="text-sm text-[#F5F3EF] mb-2">Missing key work detected:</p>
                      <p className="text-sm text-[#7C9885]">"The Singer of Tales" by Albert Lord would strengthen your foundation in oral tradition theory.</p>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-lg p-3">
                      <p className="text-sm text-[#F5F3EF] mb-2">Recent scholarship:</p>
                      <p className="text-sm text-[#7C9885]">3 new articles on Homeric formula published this year match your research focus.</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Main Bibliography */}
          <div className="lg:col-span-2">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">
              {/* Controls */}
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div className="flex items-center space-x-4">
                  <h2 className="text-xl font-semibold text-[#C9A962]">Bibliography</h2>
                  <div className="flex items-center space-x-2">
                    <Filter className="w-4 h-4 text-white/50" />
                    <select 
                      value={activeFilter}
                      onChange={(e) => setActiveFilter(e.target.value)}
                      className="bg-white/5 border border-white/10 rounded px-3 py-1 text-sm"
                    >
                      <option value="all">All Types</option>
                      <option value="starred">Starred</option>
                      <option value="book">Books</option>
                      <option value="article">Articles</option>
                      <option value="manuscript">Manuscripts</option>
                    </select>
                  </div>
                  <div className="flex items-center space-x-2">
                    <SortAsc className="w-4 h-4 text-white/50" />
                    <select 
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="bg-white/5 border border-white/10 rounded px-3 py-1 text-sm"
                    >
                      <option value="date">Date Added</option>
                      <option value="author">Author</option>
                      <option value="year">Year</option>
                      <option value="relevance">Relevance</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setShowFormatted(!showFormatted)}
                    className={`px-4 py-2 rounded-lg border transition-all ${
                      showFormatted 
                        ? 'bg-[#C9A962]/20 border-[#C9A962]/50 text-[#C9A962]' 
                        : 'bg-white/5 border-white/10 hover:border-[#C9A962]/30'
                    }`}
                  >
                    Format Output
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={exportBibliography}
                    className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-[#7C9885] to-[#8B7355] text-white rounded-lg hover:shadow-lg transition-all"
                  >
                    <Download className="w-4 h-4" />
                    <span>Export</span>
                  </motion.button>
                </div>
              </div>

              {/* Format Selection */}
              <AnimatePresence>
                {showFormatted && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-6 p-4 bg-white/5 border border-white/10 rounded-lg"
                  >
                    <div className="flex flex-wrap gap-3">
                      {citationFormats.map((format) => (
                        <button
                          key={format.id}
                          onClick={() => setSelectedFormat(format.id)}
                          className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-all ${
                            selectedFormat === format.id
                              ? 'bg-[#C9A962]/20 border-[#C9A962]/50 text-[#C9A962]'
                              : 'bg-white/5 border-white/10 hover:border-[#C9A962]/30'
                          }`}
                        >
                          <format.icon className="w-4 h-4" />
                          <span>{format.name}</span>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Works List */}
              <div className="space-y-4">
                <AnimatePresence>
                  {sortedWorks.map((work, index) => (
                    <motion.div
                      key={work.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white/5 border border-white/10 rounded-lg p-4 hover:border-[#C9A962]/30 transition-all"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <button
                              onClick={() => toggleStar(work.id)}
                              className={`transition-colors ${work.isStarred ? 'text-[#C9A962]' : 'text-white/30 hover:text-[#C9A962]'}`}
                            >
                              <Star className="w-4 h-4" fill={work.isStarred ? 'currentColor' : 'none'} />
                            </button>
                            <h3 className="font-medium text-[#F5F3EF]">{work.title}</h3>
                            <span className="text-xs bg-[#7C9885]/20 text-[#7C9885] px-2 py-1 rounded">
                              {work.type}
                            </span>
                          </div>
                          <p className="text-white/70 mb-2">{work.author} ({work.year})</p>
                          
                          {showFormatted && (
                            <div className="bg-black/20 p-3 rounded border border-white/10 mb-3">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-xs text-[#C9A962] uppercase tracking-wide">{selectedFormat.toUpperCase()} Format</span>
                                <button
                                  onClick={() => copyToClipboard(formatCitation(work, selectedFormat), work.id)}
                                  className="flex items-center space-x-1 text-xs text-white/50 hover:text-[#C9A962] transition-colors"
                                >
                                  {copiedId === work.id ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                                  <span>{copiedId === work.id ? 'Copied' : 'Copy'}</span>
                                </button>
                              </div>
                              <p className="text-sm text-[#F5F3EF] font-mono leading-relaxed">
                                {formatCitation(work, selectedFormat)}
                              </p>
                            </div>
                          )}

                          <div className="flex flex-wrap items-center gap-2 mb-3">
                            {work.tags.map((tag) => (
                              <span key={tag} className="text-xs bg-[#8B7355]/20 text-[#8B7355] px-2 py-1 rounded">
                                {tag}
                              </span>
                            ))}
                          </div>

                          <div className="flex items-center space-x-4 text-xs text-white/50">
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-3 h-3" />
                              <span>Added {work.dateAdded.toLocaleDateString()}</span>
                            </div>
                            {work.relevanceScore && (
                              <div className="flex items-center space-x-1">
                                <Zap className="w-3 h-3" />
                                <span>{work.relevanceScore}% relevant</span>
                              </div>
                            )}
                            {work.citationCount && (
                              <div className="flex items-center space-x-1">
                                <Quote className="w-3 h-3" />
                                <span>{work.citationCount.toLocaleString()} citations</span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center space-x-2 ml-4">
                          <button
                            onClick={() => setEditingWork(work.id)}
                            className="p-2 text-white/50 hover:text-[#C9A962] transition-colors"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => removeWork(work.id)}
                            className="p-2 text-white/50 hover:text-red-400 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {selectedWorks.length === 0 && (
                <div className="text-center py-12 text-white/50">
                  <Archive className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-medium mb-2">No works in bibliography</h3>
                  <p className="text-sm">Search and add works to get started</p>
                </div>
              )}
            </div>

            {/* Innovation Components */}
            {selectedWorks.length > 2 && (
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-8 space-y-6"
              >
                <ArgumentSynthesis />
                <ComparativeFrames />
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
