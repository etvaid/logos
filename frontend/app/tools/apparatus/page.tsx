'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  BookOpen, 
  Search, 
  Filter, 
  Settings, 
  Eye, 
  GitBranch, 
  Users, 
  Bookmark, 
  Download, 
  Share2,
  ChevronRight,
  ChevronDown,
  MousePointer2,
  Zap,
  Brain,
  Network,
  FileText,
  Globe,
  Calendar,
  MapPin,
  Layers,
  RotateCcw,
  Plus,
  Minus,
  X,
  Check,
  AlertCircle,
  Loader2,
  ArrowRight,
  ExternalLink,
  Copy,
  Star,
  MessageSquare,
  History,
  Lightbulb
} from 'lucide-react'
import { ArgumentSynthesis } from '@/components/innovations/argument_synthesis'
import { ComparativeFrames } from '@/components/innovations/comparative_frames'

interface Variant {
  id: string
  reading: string
  manuscripts: string[]
  probability: number
  reasoning: string
  type: 'omission' | 'addition' | 'substitution' | 'transposition'
}

interface Manuscript {
  siglum: string
  name: string
  date: string
  location: string
  family: string
  quality: 'excellent' | 'good' | 'fair' | 'poor'
  digitalImages: boolean
}

interface ApparatusEntry {
  line: number
  lemma: string
  variants: Variant[]
  note: string
  significance: 'high' | 'medium' | 'low'
}

interface StemmaNode {
  id: string
  type: 'archetype' | 'manuscript' | 'family'
  name: string
  x: number
  y: number
  children: string[]
}

export default function CriticalApparatusViewer() {
  const [selectedPassage, setSelectedPassage] = useState('Iliad 1.1-10')
  const [activeView, setActiveView] = useState<'apparatus' | 'stemma' | 'compare'>('apparatus')
  const [selectedVariants, setSelectedVariants] = useState<string[]>([])
  const [manuscriptFilter, setManuscriptFilter] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [selectedManuscripts, setSelectedManuscripts] = useState<string[]>(['A', 'B', 'T'])

  // Mock data
  const manuscripts: Manuscript[] = [
    { siglum: 'A', name: 'Venetus A', date: '10th c.', location: 'Venice', family: 'α', quality: 'excellent', digitalImages: true },
    { siglum: 'B', name: 'Venetus B', date: '11th c.', location: 'Venice', family: 'α', quality: 'good', digitalImages: true },
    { siglum: 'T', name: 'Townley', date: '11th c.', location: 'London', family: 'β', quality: 'good', digitalImages: false },
    { siglum: 'D', name: 'Laurentianus', date: '10th c.', location: 'Florence', family: 'β', quality: 'excellent', digitalImages: true },
  ]

  const apparatusEntries: ApparatusEntry[] = [
    {
      line: 1,
      lemma: 'μῆνιν',
      variants: [
        {
          id: '1a',
          reading: 'μῆνιν',
          manuscripts: ['A', 'B', 'D'],
          probability: 0.95,
          reasoning: 'Strongest manuscript support, metrical necessity',
          type: 'substitution'
        },
        {
          id: '1b',
          reading: 'χόλον',
          manuscripts: ['T'],
          probability: 0.05,
          reasoning: 'Later substitution, possibly influenced by Virgil',
          type: 'substitution'
        }
      ],
      note: 'The opening word sets the thematic tone for the entire epic',
      significance: 'high'
    },
    {
      line: 2,
      lemma: 'οὐλομένην',
      variants: [
        {
          id: '2a',
          reading: 'οὐλομένην',
          manuscripts: ['A', 'B', 'T'],
          probability: 0.85,
          reasoning: 'Consistent manuscript tradition',
          type: 'substitution'
        },
        {
          id: '2b',
          reading: 'ὀλομένην',
          manuscripts: ['D'],
          probability: 0.15,
          reasoning: 'Variant spelling, same meaning',
          type: 'substitution'
        }
      ],
      note: 'Orthographic variant with no semantic difference',
      significance: 'low'
    }
  ]

  const stemmaNodes: StemmaNode[] = [
    { id: 'omega', type: 'archetype', name: 'Ω', x: 50, y: 10, children: ['alpha', 'beta'] },
    { id: 'alpha', type: 'family', name: 'α', x: 25, y: 40, children: ['A', 'B'] },
    { id: 'beta', type: 'family', name: 'β', x: 75, y: 40, children: ['T', 'D'] },
    { id: 'A', type: 'manuscript', name: 'A', x: 15, y: 70, children: [] },
    { id: 'B', type: 'manuscript', name: 'B', x: 35, y: 70, children: [] },
    { id: 'T', type: 'manuscript', name: 'T', x: 65, y: 70, children: [] },
    { id: 'D', type: 'manuscript', name: 'D', x: 85, y: 70, children: [] },
  ]

  const handleSearch = async () => {
    setIsLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    setIsLoading(false)
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case 'excellent': return 'text-emerald-400'
      case 'good': return 'text-blue-400'
      case 'fair': return 'text-yellow-400'
      case 'poor': return 'text-red-400'
      default: return 'text-gray-400'
    }
  }

  const getProbabilityColor = (probability: number) => {
    if (probability >= 0.8) return 'text-emerald-400'
    if (probability >= 0.6) return 'text-yellow-400'
    return 'text-red-400'
  }

  const getSignificanceColor = (significance: string) => {
    switch (significance) {
      case 'high': return 'border-red-400/50 bg-red-400/10'
      case 'medium': return 'border-yellow-400/50 bg-yellow-400/10'
      case 'low': return 'border-gray-400/50 bg-gray-400/10'
      default: return 'border-gray-400/50 bg-gray-400/10'
    }
  }

  return (
    <div className="min-h-screen bg-[#0D0D0F] text-[#F5F3EF]">
      {/* Header */}
      <motion.header 
        className="border-b border-white/10 bg-black/20 backdrop-blur-xl sticky top-0 z-50"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded bg-gradient-to-br from-[#C9A962] to-[#8B7355] flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-black" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-[#C9A962]">Critical Apparatus</h1>
                  <p className="text-sm text-white/60">Everything a serious scholar needs</p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 bg-[#C9A962]/20 text-[#C9A962] rounded-lg border border-[#C9A962]/30 hover:bg-[#C9A962]/30 transition-colors"
              >
                <Share2 className="w-4 h-4 mr-2 inline" />
                Share
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 bg-[#7C9885]/20 text-[#7C9885] rounded-lg border border-[#7C9885]/30 hover:bg-[#7C9885]/30 transition-colors"
              >
                <Download className="w-4 h-4 mr-2 inline" />
                Export
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Search Bar */}
      <motion.div 
        className="max-w-7xl mx-auto px-6 py-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div 
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
          variants={itemVariants}
        >
          <div className="flex items-center space-x-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 w-5 h-5" />
              <input
                type="text"
                placeholder="Search passages, variants, or manuscript sigla..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-[#C9A962] transition-colors"
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSearch}
              disabled={isLoading}
              className="px-6 py-3 bg-[#C9A962] text-black rounded-lg hover:bg-[#C9A962]/90 transition-colors disabled:opacity-50 flex items-center space-x-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Searching...</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>Search</span>
                </>
              )}
            </motion.button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-white/60">Current passage:</span>
              <span className="text-[#C9A962] font-medium">{selectedPassage}</span>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="text-sm text-[#7C9885] hover:text-[#7C9885]/80 flex items-center space-x-1"
            >
              <Settings className="w-4 h-4" />
              <span>Advanced</span>
              {showAdvanced ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </motion.button>
          </div>

          <AnimatePresence>
            {showAdvanced && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 pt-4 border-t border-white/10"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Manuscript Families</label>
                    <div className="space-y-2">
                      {['α', 'β', 'γ'].map(family => (
                        <label key={family} className="flex items-center space-x-2">
                          <input type="checkbox" className="rounded" />
                          <span className="text-sm">{family}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Variant Types</label>
                    <div className="space-y-2">
                      {['omission', 'addition', 'substitution', 'transposition'].map(type => (
                        <label key={type} className="flex items-center space-x-2">
                          <input type="checkbox" className="rounded" />
                          <span className="text-sm capitalize">{type}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Significance</label>
                    <div className="space-y-2">
                      {['high', 'medium', 'low'].map(sig => (
                        <label key={sig} className="flex items-center space-x-2">
                          <input type="checkbox" className="rounded" />
                          <span className="text-sm capitalize">{sig}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex space-x-1 bg-white/5 backdrop-blur-xl rounded-lg p-1 w-fit">
          {[
            { id: 'apparatus', label: 'Critical Apparatus', icon: FileText },
            { id: 'stemma', label: 'Stemma', icon: GitBranch },
            { id: 'compare', label: 'Compare Readings', icon: Eye }
          ].map(({ id, label, icon: Icon }) => (
            <motion.button
              key={id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveView(id as any)}
              className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors ${
                activeView === id
                  ? 'bg-[#C9A962] text-black'
                  : 'text-white/60 hover:text-white hover:bg-white/10'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="font-medium">{label}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Manuscript Panel */}
          <motion.div 
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
            variants={itemVariants}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-[#C9A962]">Manuscripts</h3>
              <Filter className="w-5 h-5 text-white/40" />
            </div>

            <div className="space-y-3">
              {manuscripts.map((ms) => (
                <motion.div
                  key={ms.siglum}
                  whileHover={{ scale: 1.02 }}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    selectedManuscripts.includes(ms.siglum)
                      ? 'border-[#C9A962]/50 bg-[#C9A962]/10'
                      : 'border-white/10 bg-white/5 hover:border-white/20'
                  }`}
                  onClick={() => {
                    setSelectedManuscripts(prev =>
                      prev.includes(ms.siglum)
                        ? prev.filter(s => s !== ms.siglum)
                        : [...prev, ms.siglum]
                    )
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-[#C9A962]">{ms.siglum}</span>
                    <div className="flex items-center space-x-1">
                      {ms.digitalImages && <Eye className="w-4 h-4 text-[#7C9885]" />}
                      <span className={`text-xs font-medium ${getQualityColor(ms.quality)}`}>
                        {ms.quality}
                      </span>
                    </div>
                  </div>
                  <div className="text-sm text-white/80 font-medium">{ms.name}</div>
                  <div className="text-xs text-white/60 mt-1">
                    <div>{ms.date} • {ms.location}</div>
                    <div>Family {ms.family}</div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-white/10">
              <h4 className="font-medium mb-2 text-[#7C9885]">Quick Stats</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-white/60">Total MSS:</span>
                  <span className="text-white">{manuscripts.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Selected:</span>
                  <span className="text-[#C9A962]">{selectedManuscripts.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Digital:</span>
                  <span className="text-[#7C9885]">{manuscripts.filter(m => m.digitalImages).length}</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              {activeView === 'apparatus' && (
                <motion.div
                  key="apparatus"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  {/* Text Display */}
                  <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold text-[#C9A962]">Text & Apparatus</h3>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-white/60">Iliad 1.1-10</span>
                        <ExternalLink className="w-4 h-4 text-white/40" />
                      </div>
                    </div>

                    <div className="bg-white/10 rounded-lg p-4 mb-6 font-serif text-lg leading-relaxed">
                      <div className="space-y-2">
                        <div>
                          <span className="text-[#C9A962] hover:bg-[#C9A962]/20 px-1 rounded cursor-pointer transition-colors">
                            μῆνιν
                          </span>{' '}
                          <span className="text-white/80">ἄειδε θεὰ Πηληϊάδεω Ἀχιλῆος</span>
                        </div>
                        <div>
                          <span className="text-[#C9A962] hover:bg-[#C9A962]/20 px-1 rounded cursor-pointer transition-colors">
                            οὐλομένην
                          </span>{' '}
                          <span className="text-white/80">ἣ μυρί᾽ Ἀχαιοῖς ἄλγε᾽ ἔθηκε</span>
                        </div>
                      </div>
                    </div>

                    {/* Apparatus Entries */}
                    <div className="space-y-4">
                      {apparatusEntries.map((entry) => (
                        <motion.div
                          key={entry.line}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`border rounded-lg p-4 ${getSignificanceColor(entry.significance)}`}
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-3">
                              <span className="text-[#C9A962] font-bold">Line {entry.line}</span>
                              <span className="font-mono text-white bg-white/10 px-2 py-1 rounded">
                                {entry.lemma}
                              </span>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                entry.significance === 'high' ? 'bg-red-400/20 text-red-300' :
                                entry.significance === 'medium' ? 'bg-yellow-400/20 text-yellow-300' :
                                'bg-gray-400/20 text-gray-300'
                              }`}>
                                {entry.significance}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <button className="text-white/40 hover:text-white transition-colors">
                                <Bookmark className="w-4 h-4" />
                              </button>
                              <button className="text-white/40 hover:text-white transition-colors">
                                <MessageSquare className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          <div className="space-y-3">
                            {entry.variants.map((variant) => (
                              <div
                                key={variant.id}
                                className="bg-white/10 rounded-lg p-3 hover:bg-white/15 transition-colors"
                              >
                                <div className="flex items-center justify-between mb-2">
                                  <div className="flex items-center space-x-3">
                                    <span className="font-mono text-white font-medium">
                                      {variant.reading}
                                    </span>
                                    <div className="flex items-center space-x-1">
                                      {variant.manuscripts.map((ms) => (
                                        <span
                                          key={ms}
                                          className="px-2 py-1 bg-[#7C9885]/20 text-[#7C9885] rounded text-xs font-medium"
                                        >
                                          {ms}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <span className={`text-sm font-medium ${getProbabilityColor(variant.probability)}`}>
                                      {(variant.probability * 100).toFixed(0)}%
                                    </span>
                                    <span className="px-2 py-1 bg-white/10 rounded text-xs">
                                      {variant.type}
                                    </span>
                                  </div>
                                </div>
                                <p className="text-sm text-white/80">{variant.reasoning}</p>
                              </div>
                            ))}
                          </div>

                          <div className="mt-3 pt-3 border-t border-white/10">
                            <div className="flex items-start space-x-2">
                              <Lightbulb className="w-4 h-4 text-[#C9A962] mt-0.5 flex-shrink-0" />
                              <p className="text-sm text-white/80">{entry.note}</p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* AI Insights */}
                  <ArgumentSynthesis
                    arguments={[
                      {
                        id: '1',
                        title: 'Manuscript Authority',
                        content: 'The reading μῆνιν is supported by the oldest and most reliable manuscripts (A, B, D), representing both major families of the tradition.',
                        strength: 0.9,
                        sources: ['Venetus A', 'Venetus B', 'Laurentianus']
                      },
                      {
                        id: '2',
                        title: 'Metrical Consideration',
                        content: 'The word μῆνιν fits perfectly in the dactylic hexameter, while χόλον would create metrical difficulties.',
                        strength: 0.8,
                        sources: ['West 1998', 'Allen 1931']
                      }
                    ]}
                    topic="μῆνιν vs χόλον in Iliad 1.1"
                  />
                </motion.div>
              )}

              {activeView === 'stemma' && (
                <motion.div
                  key="stemma"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
                >
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-[#C9A962]">Stemma Codicum</h3>
                    <div className="flex items-center space-x-2">
                      <button className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
                        <Plus className="w-4 h-4" />
                      </button>
                      <button className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
                        <Minus className="w-4 h-4" />
                      </button>
                      <button className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
                        <RotateCcw className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="bg-white/10 rounded-lg p-8 mb-6 relative" style={{ height: '400px' }}>
                    <svg viewBox="0 0 100 100" className="w-full h-full">
                      {/* Draw connections */}
                      {stemmaNodes.map(node => 
                        node.children.map(childId => {
                          const child = stemmaNodes.find(n => n.id === childId)
                          if (!child) return null
                          return (
                            <line
                              key={`${node.id}-${childId}`}
                              x1={node.x}
                              y1={node.y}
                              x2={child.x}
                              y2={child.y}
                              stroke="#7C9885"
                              strokeWidth="0.5"
                            />
                          )
                        })
                      )}
                      
                      {/* Draw nodes */}
                      {stemmaNodes.map(node => (
                        <g key={node.id}>
                          <circle
                            cx={node.x}
                            cy={node.y}
                            r="3"
                            fill={
                              node.type === 'archetype' ? '#C9A962' :
                              node.type === 'family' ? '#7C9885' : '#8B7355'
                            }
                          />
                          <text
                            x={node.x}
                            y={node.y - 5}
                            textAnchor="middle"
                            className="text-xs fill-current"
                            style={{ fontSize: '3px' }}
                          >
                            {node.name}
                          </text>
                        </g>
                      ))}
                    </svg>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white/10 rounded-lg p-4">
                      <h4 className="font-medium text-[#C9A962] mb-2">Legend</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 rounded-full bg-[#C9A962]"></div>
                          <span>Archetype</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 rounded-full bg-[#7C9885]"></div>
                          <span>Family</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 rounded-full bg-[#8B7355]"></div>
                          <span>Manuscript</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white/10 rounded-lg p-4">
                      <h4 className="font-medium text-[#7C9885] mb-2">Relationships</h4>
                      <div className="space-y-1 text-sm text-white/80">
                        <div>α family: A, B</div>
                        <div>β family: T, D</div>
                        <div>Both from Ω</div>
                      </div>
                    </div>

                    <div className="bg-white/10 rounded-lg p-4">
                      <h4 className="font-medium text-[#8B7355] mb-2">Analysis</h4>
                      <p className="text-sm text-white/80">
                        Clear bifid tradition with two main branches. Family α shows closer agreement.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeView === 'compare' && (
                <motion.div
                  key="compare"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <ComparativeFrames
                    items={[
                      {
                        id: 'reading1',
                        title: 'μῆνιν (A, B, D)',
                        content: 'The traditional reading "wrath" emphasizes the destructive anger that drives the plot. Manuscript support is overwhelming.',
                        category: 'Strong Support',
                        metadata: { probability: 0.95, manuscripts: 3 }
                      },
                      {
                        id: 'reading2',
                        title: 'χόλον (T)',
                        content: 'Alternative reading "anger" found in manuscript T. May reflect later influence from Latin poetry or scribal variation.',
                        category: 'Minority Reading',
                        metadata: { probability: 0.05, manuscripts: 1 }
                      }
                    ]}
                    onCompare={(items) => console.log('Comparing:', items)}
                    title="Variant Readings Comparison"
                  />

                  <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                    <h3 className="text-lg font-bold text-[#C9A962] mb-4">Reading Analysis</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Text Comparison */}
                      <div className="space-y-4">
                        <h4 className="font-medium text-[#7C9885]">Side-by-Side Comparison</h4>
                        <div className="bg-white/10 rounded-lg p-4 space-y-3">
                          <div className="border-b border-white/10 pb-2">
                            <div className="text-sm text-white/60 mb-1">Majority Reading (A, B, D)</div>
                            <div className="font-mono text-lg text-[#C9A962]">μῆνιν ἄειδε θεὰ Πηληϊάδεω Ἀχιλῆος</div>
                          </div>
                          <div>
                            <div className="text-sm text-white/60 mb-1">Variant Reading (T)</div>
                            <div className="font-mono text-lg text-[#8B7355]">χόλον ἄειδε θεὰ Πηληϊάδεω Ἀχιλῆος</div>
                          </div>
                        </div>
                      </div>

                      {/* Statistical Analysis */}
                      <div className="space-y-4">
                        <h4 className="font-medium text-[#7C9885]">Statistical Overview</h4>
                        <div className="bg-white/10 rounded-lg p-4">
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-sm">Manuscript Support</span>
                              <div className="flex space-x-1">
                                <span className="px-2 py-1 bg-[#C9A962]/20 text-[#C9A962] rounded text-xs">3/4</span>
                                <span className="px-2 py-1 bg-[#8B7355]/20 text-[#8B7355] rounded text-xs">1/4</span>
                              </div>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm">Probability</span>
                              <div className="flex space-x-1">
                                <span className="text-emerald-400 font-medium">95%</span>
                                <span className="text-red-400 font-medium">5%</span>
                              </div>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm">Editorial Consensus</span>
                              <span className="text-[#C9A962] font-medium">μῆνιν</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Detailed Analysis */}
                    <div className="mt-6 pt-4 border-t border-white/10">
                      <h4 className="font-medium text-[#7C9885] mb-3">Scholarly Commentary</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white/10 rounded-lg p-4">
                          <div className="flex items-center space-x-2 mb-2">
                            <Check className="w-4 h-4 text-emerald-400" />
                            <span className="font-medium text-emerald-400">Arguments for μῆνιν</span>
                          </div>
                          <ul className="text-sm text-white/80 space-y-1 list-disc list-inside">
                            <li>Superior manuscript support</li>
                            <li>Establishes key thematic word</li>
                            <li>Consistent with epic tradition</li>
                            <li>Metrical appropriateness</li>
                          </ul>
                        </div>
                        <div className="bg-white/10 rounded-lg p-4">
                          <div className="flex items-center space-x-2 mb-2">
                            <AlertCircle className="w-4 h-4 text-yellow-400" />
                            <span className="font-medium text-yellow-400">Arguments for χόλον</span>
                          </div>
                          <ul className="text-sm text-white/80 space-y-1 list-disc list-inside">
                            <li>Possible alternative tradition</li>
                            <li>Semantic similarity to μῆνιν</li>
                            <li>Could reflect ancient variant</li>
                            <li>Attested in manuscript T</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-20 border-t border-white/10 bg-black/20 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="text-sm text-white/60">
              © 2024 LOGOS Scholar's Workbench. Critical apparatus powered by AI.
            </div>
            <div className="flex items-center space-x-4 text-sm">
              <button className="text-[#7C9885] hover:text-[#7C9885]/80 flex items-center space-x-1">
                <History className="w-4 h-4" />
                <span>Version History</span>
              </button>
              <button className="text-[#C9A962] hover:text-[#C9A962]/80 flex items-center space-x-1">
                <Brain className="w-4 h-4" />
                <span>AI Insights</span>
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
