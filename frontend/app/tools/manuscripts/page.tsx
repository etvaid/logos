'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Search, 
  Filter, 
  Calendar, 
  MapPin, 
  Image, 
  Download, 
  Eye, 
  BookOpen, 
  Scroll, 
  Clock, 
  Globe,
  Zap,
  Star,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Layers,
  Database,
  Camera,
  Archive,
  Users,
  Award,
  FileText,
  Link2,
  Bookmark,
  Grid3x3,
  List,
  SortAsc,
  AlertCircle,
  CheckCircle2,
  Loader2
} from 'lucide-react'
import { ArgumentSynthesis } from '@/components/innovations/argument_synthesis'
import { ComparativeFrames } from '@/components/innovations/comparative_frames'

interface Manuscript {
  id: string
  siglum: string
  name: string
  date: {
    earliest: number
    latest: number
    certainty: 'certain' | 'probable' | 'possible'
    description: string
  }
  provenance: {
    origin: string
    history: string[]
    currentLocation: string
    institution: string
  }
  images: {
    folios: number
    digitized: number
    quality: 'high' | 'medium' | 'low'
    viewer_url: string
    download_url: string
  }
  contents: string[]
  importance: number
  condition: 'excellent' | 'good' | 'fair' | 'poor'
  material: string
  dimensions: {
    height: number
    width: number
  }
  scripts: string[]
  annotations: {
    marginalia: boolean
    corrections: boolean
    glosses: boolean
  }
}

const SAMPLE_MANUSCRIPTS: Manuscript[] = [
  {
    id: 'vat-gr-1209',
    siglum: 'V',
    name: 'Venetus A',
    date: {
      earliest: 950,
      latest: 1000,
      certainty: 'probable',
      description: 'Mid-10th century CE'
    },
    provenance: {
      origin: 'Constantinople',
      history: ['Byzantine Imperial Library', 'Cardinal Bessarion (1468)', 'Venetian Republic'],
      currentLocation: 'Venice, Italy',
      institution: 'Biblioteca Marciana'
    },
    images: {
      folios: 327,
      digitized: 327,
      quality: 'high',
      viewer_url: '/viewer/vat-gr-1209',
      download_url: '/download/vat-gr-1209'
    },
    contents: ['Iliad (complete)', 'Scholia A', 'Scholia D', 'Interlinear notes'],
    importance: 10,
    condition: 'excellent',
    material: 'Parchment',
    dimensions: { height: 395, width: 285 },
    scripts: ['Minuscule', 'Majuscule (titles)'],
    annotations: { marginalia: true, corrections: true, glosses: true }
  },
  {
    id: 'oxford-clarke-39',
    siglum: 'T',
    name: 'Townleyanus',
    date: {
      earliest: 1050,
      latest: 1100,
      certainty: 'certain',
      description: 'Late 11th century CE'
    },
    provenance: {
      origin: 'Southern Italy',
      history: ['Monastery of Grottaferrata', 'Private collectors', 'Townley Collection'],
      currentLocation: 'London, England',
      institution: 'British Library'
    },
    images: {
      folios: 365,
      digitized: 365,
      quality: 'high',
      viewer_url: '/viewer/oxford-clarke-39',
      download_url: '/download/oxford-clarke-39'
    },
    contents: ['Iliad (Books 1-12)', 'Scholia bT'],
    importance: 9,
    condition: 'good',
    material: 'Parchment',
    dimensions: { height: 310, width: 245 },
    scripts: ['Minuscule'],
    annotations: { marginalia: true, corrections: false, glosses: true }
  },
  {
    id: 'paris-gr-2706',
    siglum: 'P',
    name: 'Parisinus',
    date: {
      earliest: 1200,
      latest: 1250,
      certainty: 'probable',
      description: 'Early 13th century CE'
    },
    provenance: {
      origin: 'France',
      history: ['Abbey of Saint-Denis', 'Royal Library of France'],
      currentLocation: 'Paris, France',
      institution: 'Bibliothèque nationale de France'
    },
    images: {
      folios: 298,
      digitized: 250,
      quality: 'medium',
      viewer_url: '/viewer/paris-gr-2706',
      download_url: '/download/paris-gr-2706'
    },
    contents: ['Odyssey (complete)', 'Later scholia'],
    importance: 7,
    condition: 'fair',
    material: 'Paper',
    dimensions: { height: 280, width: 200 },
    scripts: ['Minuscule'],
    annotations: { marginalia: false, corrections: true, glosses: false }
  }
]

const DATING_ARGUMENTS = [
  {
    position: "10th Century Attribution",
    evidence: [
      "Paleographic analysis shows characteristic minuscule forms",
      "Parchment preparation techniques match Byzantine standards",
      "Scholia tradition indicates early exemplar"
    ],
    scholars: ["Allen", "West", "Bird"]
  },
  {
    position: "9th Century Attribution", 
    evidence: [
      "Script shows transitional majuscule features",
      "Orthographic archaisms suggest earlier tradition",
      "Codicological analysis indicates imperial scriptorium"
    ],
    scholars: ["Dindorf", "Erbse"]
  }
]

const COMPARATIVE_DATA = [
  {
    category: "Textual Tradition",
    items: [
      { 
        manuscript: "Venetus A",
        feature: "Preserves ancient scholia",
        significance: "Primary witness to Alexandrian scholarship"
      },
      {
        manuscript: "Townleyanus", 
        feature: "Independent tradition",
        significance: "Confirms readings without Byzantine revision"
      }
    ]
  },
  {
    category: "Codicological Features",
    items: [
      {
        manuscript: "Venetus A",
        feature: "Purple ink for quotations", 
        significance: "Indicates imperial or luxury production"
      },
      {
        manuscript: "Parisinus",
        feature: "Paper substrate",
        significance: "Later medieval production methods"
      }
    ]
  }
]

export default function ManuscriptsPage() {
  const [manuscripts, setManuscripts] = useState<Manuscript[]>([])
  const [filteredManuscripts, setFilteredManuscripts] = useState<Manuscript[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCentury, setSelectedCentury] = useState<string>('all')
  const [selectedCondition, setSelectedCondition] = useState<string>('all')
  const [selectedMaterial, setSelectedMaterial] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'date' | 'importance' | 'name'>('importance')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [expandedManuscript, setExpandedManuscript] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setManuscripts(SAMPLE_MANUSCRIPTS)
      setFilteredManuscripts(SAMPLE_MANUSCRIPTS)
      setLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    let filtered = manuscripts.filter(ms => {
      const matchesSearch = ms.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          ms.siglum.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          ms.contents.some(content => content.toLowerCase().includes(searchTerm.toLowerCase()))

      const centuryStart = selectedCentury === 'all' ? -Infinity : 
                          parseInt(selectedCentury) * 100
      const centuryEnd = selectedCentury === 'all' ? Infinity : 
                        centuryStart + 99

      const matchesCentury = selectedCentury === 'all' || 
                           (ms.date.earliest <= centuryEnd && ms.date.latest >= centuryStart)

      const matchesCondition = selectedCondition === 'all' || ms.condition === selectedCondition
      const matchesMaterial = selectedMaterial === 'all' || ms.material.toLowerCase() === selectedMaterial

      return matchesSearch && matchesCentury && matchesCondition && matchesMaterial
    })

    // Sort manuscripts
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return a.date.earliest - b.date.earliest
        case 'importance':
          return b.importance - a.importance
        case 'name':
          return a.name.localeCompare(b.name)
        default:
          return 0
      }
    })

    setFilteredManuscripts(filtered)
  }, [manuscripts, searchTerm, selectedCentury, selectedCondition, selectedMaterial, sortBy])

  const getCenturyString = (year: number) => {
    return Math.floor((year - 1) / 100) + 1
  }

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'excellent': return 'text-emerald-400'
      case 'good': return 'text-blue-400'
      case 'fair': return 'text-yellow-400'
      case 'poor': return 'text-red-400'
      default: return 'text-gray-400'
    }
  }

  const getImportanceStars = (importance: number) => {
    return Array(Math.min(importance, 10)).fill(0).map((_, i) => (
      <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
    ))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0D0D0F] text-[#F5F3EF]">
        <div className="container mx-auto px-6 py-12">
          <div className="flex items-center justify-center h-96">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="flex items-center space-x-4"
            >
              <Loader2 className="h-8 w-8 text-[#C9A962]" />
              <span className="text-xl">Loading manuscript catalog...</span>
            </motion.div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0D0D0F] text-[#F5F3EF]">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-24">
        <div className="absolute inset-0 bg-gradient-to-br from-[#C9A962]/10 via-transparent to-[#7C9885]/10" />
        
        <div className="container mx-auto px-6 relative">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center space-x-3 mb-6">
              <Scroll className="h-8 w-8 text-[#C9A962]" />
              <span className="text-[#C9A962] font-semibold tracking-wider">SCHOLAR'S WORKBENCH</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-[#C9A962] via-[#F5F3EF] to-[#7C9885] bg-clip-text text-transparent">
              Manuscript Catalog
            </h1>
            
            <p className="text-xl md:text-2xl text-[#F5F3EF]/80 max-w-3xl mx-auto leading-relaxed">
              Everything a serious scholar needs: comprehensive manuscript data, provenance tracking, digital images, and AI-powered analysis tools
            </p>
          </motion.div>

          {/* Search and Filter Bar */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 mb-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
              <div className="relative md:col-span-2">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search manuscripts, contents, sigla..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-black/20 border border-white/10 rounded-xl text-[#F5F3EF] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#C9A962]/50"
                />
              </div>

              <select
                value={selectedCentury}
                onChange={(e) => setSelectedCentury(e.target.value)}
                className="px-4 py-3 bg-black/20 border border-white/10 rounded-xl text-[#F5F3EF] focus:outline-none focus:ring-2 focus:ring-[#C9A962]/50"
              >
                <option value="all">All Centuries</option>
                <option value="9">9th Century</option>
                <option value="10">10th Century</option>
                <option value="11">11th Century</option>
                <option value="12">12th Century</option>
                <option value="13">13th Century</option>
              </select>

              <select
                value={selectedCondition}
                onChange={(e) => setSelectedCondition(e.target.value)}
                className="px-4 py-3 bg-black/20 border border-white/10 rounded-xl text-[#F5F3EF] focus:outline-none focus:ring-2 focus:ring-[#C9A962]/50"
              >
                <option value="all">All Conditions</option>
                <option value="excellent">Excellent</option>
                <option value="good">Good</option>
                <option value="fair">Fair</option>
                <option value="poor">Poor</option>
              </select>

              <select
                value={selectedMaterial}
                onChange={(e) => setSelectedMaterial(e.target.value)}
                className="px-4 py-3 bg-black/20 border border-white/10 rounded-xl text-[#F5F3EF] focus:outline-none focus:ring-2 focus:ring-[#C9A962]/50"
              >
                <option value="all">All Materials</option>
                <option value="parchment">Parchment</option>
                <option value="paper">Paper</option>
                <option value="papyrus">Papyrus</option>
              </select>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <SortAsc className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-400">Sort by:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="px-3 py-1 bg-black/20 border border-white/10 rounded-lg text-sm text-[#F5F3EF] focus:outline-none focus:ring-1 focus:ring-[#C9A962]/50"
                  >
                    <option value="importance">Importance</option>
                    <option value="date">Date</option>
                    <option value="name">Name</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-[#C9A962] text-black' : 'bg-black/20 text-gray-400 hover:text-[#F5F3EF]'}`}
                >
                  <Grid3x3 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-[#C9A962] text-black' : 'bg-black/20 text-gray-400 hover:text-[#F5F3EF]'}`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Manuscript Catalog */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          {filteredManuscripts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <AlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-2xl font-semibold text-gray-400 mb-2">No manuscripts found</h3>
              <p className="text-gray-500">Try adjusting your search criteria</p>
            </motion.div>
          ) : (
            <div className={viewMode === 'grid' ? 'grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8' : 'space-y-6'}>
              <AnimatePresence>
                {filteredManuscripts.map((manuscript, index) => (
                  <motion.div
                    key={manuscript.id}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -50 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 group cursor-pointer"
                    onClick={() => setExpandedManuscript(expandedManuscript === manuscript.id ? null : manuscript.id)}
                  >
                    {/* Manuscript Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center space-x-3 mb-2">
                          <span className="inline-flex items-center justify-center w-8 h-8 bg-[#C9A962] text-black font-bold rounded-lg text-sm">
                            {manuscript.siglum}
                          </span>
                          <h3 className="text-xl font-semibold text-[#F5F3EF] group-hover:text-[#C9A962] transition-colors">
                            {manuscript.name}
                          </h3>
                        </div>
                        <div className="flex items-center space-x-1 mb-2">
                          {getImportanceStars(manuscript.importance)}
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="flex items-center space-x-2 mb-1">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-400">{manuscript.date.description}</span>
                        </div>
                        <div className={`text-sm font-medium ${getConditionColor(manuscript.condition)}`}>
                          {manuscript.condition.charAt(0).toUpperCase() + manuscript.condition.slice(1)}
                        </div>
                      </div>
                    </div>

                    {/* Basic Info */}
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-[#7C9885]" />
                        <span className="text-sm text-gray-300">{manuscript.provenance.currentLocation}</span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Archive className="h-4 w-4 text-[#8B7355]" />
                        <span className="text-sm text-gray-300">{manuscript.provenance.institution}</span>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Image className="h-4 w-4 text-[#C9A962]" />
                        <span className="text-sm text-gray-300">
                          {manuscript.images.digitized}/{manuscript.images.folios} folios digitized
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          manuscript.images.quality === 'high' ? 'bg-emerald-500/20 text-emerald-400' :
                          manuscript.images.quality === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-red-500/20 text-red-400'
                        }`}>
                          {manuscript.images.quality} quality
                        </span>
                      </div>
                    </div>

                    {/* Contents Preview */}
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-[#C9A962] mb-2">Contents</h4>
                      <div className="flex flex-wrap gap-2">
                        {manuscript.contents.slice(0, 3).map((content, idx) => (
                          <span key={idx} className="px-2 py-1 bg-black/20 rounded-lg text-xs text-gray-300">
                            {content}
                          </span>
                        ))}
                        {manuscript.contents.length > 3 && (
                          <span className="px-2 py-1 bg-black/20 rounded-lg text-xs text-gray-400">
                            +{manuscript.contents.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <button className="flex items-center space-x-2 px-3 py-2 bg-[#C9A962] text-black rounded-lg hover:bg-[#C9A962]/90 transition-colors text-sm font-medium">
                          <Eye className="h-4 w-4" />
                          <span>View Images</span>
                        </button>
                        
                        <button className="p-2 bg-black/20 hover:bg-black/40 rounded-lg transition-colors">
                          <Download className="h-4 w-4 text-gray-400" />
                        </button>
                      </div>

                      <div className="flex items-center space-x-2 text-gray-400">
                        <span className="text-sm">Details</span>
                        {expandedManuscript === manuscript.id ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </div>
                    </div>

                    {/* Expanded Details */}
                    <AnimatePresence>
                      {expandedManuscript === manuscript.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="mt-6 pt-6 border-t border-white/10 space-y-4"
                        >
                          {/* Dating Information */}
                          <div>
                            <h4 className="text-sm font-semibold text-[#C9A962] mb-2 flex items-center space-x-2">
                              <Clock className="h-4 w-4" />
                              <span>Dating Information</span>
                            </h4>
                            <div className="bg-black/20 rounded-lg p-3 space-y-2">
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-300">Date Range:</span>
                                <span className="text-sm text-[#F5F3EF]">
                                  {manuscript.date.earliest} - {manuscript.date.latest} CE
                                </span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-300">Certainty:</span>
                                <span className={`text-sm px-2 py-1 rounded ${
                                  manuscript.date.certainty === 'certain' ? 'bg-emerald-500/20 text-emerald-400' :
                                  manuscript.date.certainty === 'probable' ? 'bg-blue-500/20 text-blue-400' :
                                  'bg-yellow-500/20 text-yellow-400'
                                }`}>
                                  {manuscript.date.certainty}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Provenance */}
                          <div>
                            <h4 className="text-sm font-semibold text-[#C9A962] mb-2 flex items-center space-x-2">
                              <Globe className="h-4 w-4" />
                              <span>Provenance</span>
                            </h4>
                            <div className="bg-black/20 rounded-lg p-3 space-y-2">
                              <div className="flex justify-between items-start">
                                <span className="text-sm text-gray-300">Origin:</span>
                                <span className="text-sm text-[#F5F3EF]">{manuscript.provenance.origin}</span>
                              </div>
                              <div>
                                <span className="text-sm text-gray-300 mb-1 block">History:</span>
                                <div className="space-y-1">
                                  {manuscript.provenance.history.map((step, idx) => (
                                    <div key={idx} className="flex items-center space-x-2">
                                      <div className="w-1.5 h-1.5 bg-[#7C9885] rounded-full" />
                                      <span className="text-sm text-gray-400">{step}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Physical Description */}
                          <div>
                            <h4 className="text-sm font-semibold text-[#C9A962] mb-2 flex items-center space-x-2">
                              <Layers className="h-4 w-4" />
                              <span>Physical Description</span>
                            </h4>
                            <div className="bg-black/20 rounded-lg p-3 space-y-2">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <span className="text-sm text-gray-300 block">Material:</span>
                                  <span className="text-sm text-[#F5F3EF]">{manuscript.material}</span>
                                </div>
                                <div>
                                  <span className="text-sm text-gray-300 block">Dimensions:</span>
                                  <span className="text-sm text-[#F5F3EF]">
                                    {manuscript.dimensions.height} × {manuscript.dimensions.width} mm
                                  </span>
                                </div>
                              </div>
                              <div>
                                <span className="text-sm text-gray-300 block mb-1">Scripts:</span>
                                <div className="flex flex-wrap gap-1">
                                  {manuscript.scripts.map((script, idx) => (
                                    <span key={idx} className="px-2 py-1 bg-black/40 rounded text-xs text-gray-300">
                                      {script}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Annotations */}
                          <div>
                            <h4 className="text-sm font-semibold text-[#C9A962] mb-2 flex items-center space-x-2">
                              <FileText className="h-4 w-4" />
                              <span>Annotations</span>
                            </h4>
                            <div className="bg-black/20 rounded-lg p-3">
                              <div className="grid grid-cols-3 gap-4">
                                <div className="flex items-center space-x-2">
                                  {manuscript.annotations.marginalia ? (
                                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                                  ) : (
                                    <div className="w-4 h-4 border border-gray-500 rounded" />
                                  )}
                                  <span className="text-sm text-gray-300">Marginalia</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  {manuscript.annotations.corrections ? (
                                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                                  ) : (
                                    <div className="w-4 h-4 border border-gray-500 rounded" />
                                  )}
                                  <span className="text-sm text-gray-300">Corrections</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  {manuscript.annotations.glosses ? (
                                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                                  ) : (
                                    <div className="w-4 h-4 border border-gray-500 rounded" />
                                  )}
                                  <span className="text-sm text-gray-300">Glosses</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Digital Images Links */}
                          <div>
                            <h4 className="text-sm font-semibold text-[#C9A962] mb-2 flex items-center space-x-2">
                              <Camera className="h-4 w-4" />
                              <span>Digital Images</span>
                            </h4>
                            <div className="flex space-x-2">
                              <button className="flex items-center space-x-2 px-3 py-2 bg-[#7C9885] text-black rounded-lg hover:bg-[#7C9885]/90 transition-colors text-sm font-medium">
                                <Eye className="h-4 w-4" />
                                <span>Open Viewer</span>
                                <ExternalLink className="h-3 w-3" />
                              </button>
                              <button className="flex items-center space-x-2 px-3 py-2 bg-[#8B7355] text-[#F5F3EF] rounded-lg hover:bg-[#8B7355]/90 transition-colors text-sm font-medium">
                                <Download className="h-4 w-4" />
                                <span>Download</span>
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </section>

      {/* Innovation Components */}
      <section className="py-16">
        <div className="container mx-auto px-6 space-y-16">
          {/* Dating Analysis */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl font-bold text-[#C9A962] mb-8 flex items-center space-x-3">
              <Zap className="h-8 w-8" />
              <span>AI-Powered Dating Analysis</span>
            </h2>
            <ArgumentSynthesis
              topic="Venetus A Dating"
              arguments={DATING_ARGUMENTS}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl"
            />
          </motion.div>

          {/* Comparative Manuscript Analysis */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h2 className="text-3xl font-bold text-[#C9A962] mb-8 flex items-center space-x-3">
              <Layers className="h-8 w-8" />
              <span>Comparative Manuscript Analysis</span>
            </h2>
            <ComparativeFrames
              data={COMPARATIVE_DATA}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl"
            />
          </motion.div>
        </div>
      </section>

      {/* Stats Footer */}
      <section className="py-16 border-t border-white/10">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <div className="text-3xl font-bold text-[#C9A962] mb-2">
                {manuscripts.length}
              </div>
              <div className="text-gray-400">Manuscripts Cataloged</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-center"
            >
              <div className="text-3xl font-bold text-[#C9A962] mb-2">
                {manuscripts.reduce((sum, ms) => sum + ms.images.folios, 0).toLocaleString()}
              </div>
              <div className="text-gray-400">Total Folios</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center"
            >
              <div className="text-3xl font-bold text-[#C9A962] mb-2">
                {manuscripts.reduce((sum, ms) => sum + ms.images.digitized, 0).toLocaleString()}
              </div>
              <div className="text-gray-400">Images Available</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-center"
            >
              <div className="text-3xl font-bold text-[#C9A962] mb-2">
                {new Set(manuscripts.map(ms => ms.provenance.institution)).size}
              </div>
              <div className="text-gray-400">Institutions</div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}
