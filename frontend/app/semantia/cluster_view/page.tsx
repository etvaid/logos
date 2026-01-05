'use client'

import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Network, 
  Eye, 
  Filter, 
  Calendar, 
  User, 
  BookOpen, 
  Search, 
  Layers, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Play, 
  Pause, 
  Settings,
  Sparkles,
  ArrowRight,
  MousePointer2,
  Maximize2,
  Download,
  Share2,
  RefreshCw,
  ChevronDown
} from 'lucide-react'
import { ArgumentSynthesis } from '@/components/innovations/argument_synthesis'
import { MultiScaleView } from '@/components/innovations/multi_scale_view'
import { CounterEvidence } from '@/components/innovations/counter_evidence'
import { NarrativeTimeline } from '@/components/innovations/narrative_timeline'

interface SemanticNode {
  id: string
  word: string
  lemma: string
  frequency: number
  centrality: number
  era: string
  authors: string[]
  position: { x: number; y: number; z: number }
  cluster: string
  semanticWeight: number
  contexts: Array<{
    text: string
    author: string
    work: string
    passage: string
  }>
}

interface SemanticCluster {
  id: string
  name: string
  concept: string
  nodes: string[]
  color: string
  centroid: { x: number; y: number; z: number }
  coherence: number
  temporalSpread: number[]
}

interface FilterState {
  era: string[]
  authors: string[]
  minFrequency: number
  maxDistance: number
  clusters: string[]
  searchTerm: string
}

const ClusterView: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [nodes, setNodes] = useState<SemanticNode[]>([])
  const [clusters, setClusters] = useState<SemanticCluster[]>([])
  const [selectedNode, setSelectedNode] = useState<SemanticNode | null>(null)
  const [hoveredNode, setHoveredNode] = useState<SemanticNode | null>(null)
  const [filters, setFilters] = useState<FilterState>({
    era: [],
    authors: [],
    minFrequency: 1,
    maxDistance: 1.0,
    clusters: [],
    searchTerm: ''
  })
  const [viewMode, setViewMode] = useState<'2d' | '3d'>('2d')
  const [isAnimating, setIsAnimating] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [zoomLevel, setZoomLevel] = useState(1)
  const [timelinePosition, setTimelinePosition] = useState(0)
  const [isTimelineActive, setIsTimelineActive] = useState(false)

  // Mock data generation
  const generateMockData = useCallback(() => {
    const mockClusters: SemanticCluster[] = [
      {
        id: 'justice',
        name: 'Justice & Law',
        concept: 'δικαιοσύνη',
        nodes: [],
        color: '#C9A962',
        centroid: { x: 0, y: 0, z: 0 },
        coherence: 0.89,
        temporalSpread: [-400, -350, -300]
      },
      {
        id: 'wisdom',
        name: 'Wisdom & Knowledge',
        concept: 'σοφία',
        nodes: [],
        color: '#7C9885',
        centroid: { x: 300, y: -200, z: 100 },
        coherence: 0.82,
        temporalSpread: [-450, -380, -320]
      },
      {
        id: 'virtue',
        name: 'Virtue & Excellence',
        concept: 'ἀρετή',
        nodes: [],
        color: '#8B7355',
        centroid: { x: -250, y: 180, z: -50 },
        coherence: 0.76,
        temporalSpread: [-480, -400, -350]
      },
      {
        id: 'soul',
        name: 'Soul & Mind',
        concept: 'ψυχή',
        nodes: [],
        color: '#A67B5B',
        centroid: { x: 150, y: 250, z: -80 },
        coherence: 0.91,
        temporalSpread: [-500, -420, -380]
      }
    ]

    const mockWords = [
      { word: 'δίκαιος', lemma: 'δίκαιος', cluster: 'justice', freq: 245 },
      { word: 'νόμος', lemma: 'νόμος', cluster: 'justice', freq: 189 },
      { word: 'κρίσις', lemma: 'κρίσις', cluster: 'justice', freq: 167 },
      { word: 'σοφός', lemma: 'σοφός', cluster: 'wisdom', freq: 198 },
      { word: 'ἐπιστήμη', lemma: 'ἐπιστήμη', cluster: 'wisdom', freq: 145 },
      { word: 'γνῶσις', lemma: 'γνῶσις', cluster: 'wisdom', freq: 134 },
      { word: 'ἀγαθός', lemma: 'ἀγαθός', cluster: 'virtue', freq: 312 },
      { word: 'καλός', lemma: 'καλός', cluster: 'virtue', freq: 289 },
      { word: 'ἀνδρεία', lemma: 'ἀνδρεία', cluster: 'virtue', freq: 98 },
      { word: 'ψυχή', lemma: 'ψυχή', cluster: 'soul', freq: 456 },
      { word: 'νοῦς', lemma: 'νοῦς', cluster: 'soul', freq: 234 },
      { word: 'διάνοια', lemma: 'διάνοια', cluster: 'soul', freq: 123 }
    ]

    const authors = ['Plato', 'Aristotle', 'Xenophon', 'Isocrates', 'Demosthenes']
    const eras = ['Classical', 'Hellenistic', 'Imperial']

    const mockNodes: SemanticNode[] = mockWords.map((word, index) => {
      const cluster = mockClusters.find(c => c.id === word.cluster)!
      const angle = (index * 2 * Math.PI) / mockWords.filter(w => w.cluster === word.cluster).length
      const radius = 80 + Math.random() * 40

      return {
        id: `node-${index}`,
        word: word.word,
        lemma: word.lemma,
        frequency: word.freq,
        centrality: Math.random() * 0.8 + 0.2,
        era: eras[Math.floor(Math.random() * eras.length)],
        authors: [authors[Math.floor(Math.random() * authors.length)]],
        position: {
          x: cluster.centroid.x + Math.cos(angle) * radius,
          y: cluster.centroid.y + Math.sin(angle) * radius,
          z: cluster.centroid.z + (Math.random() - 0.5) * 100
        },
        cluster: word.cluster,
        semanticWeight: word.freq / 500,
        contexts: [
          {
            text: `Example context for ${word.word}...`,
            author: authors[Math.floor(Math.random() * authors.length)],
            work: 'Republic',
            passage: '1.347a'
          }
        ]
      }
    })

    setClusters(mockClusters)
    setNodes(mockNodes)
  }, [])

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      try {
        await new Promise(resolve => setTimeout(resolve, 1500))
        generateMockData()
        setError(null)
      } catch (err) {
        setError('Failed to load semantic clusters')
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [generateMockData])

  const filteredNodes = useMemo(() => {
    return nodes.filter(node => {
      if (filters.era.length && !filters.era.includes(node.era)) return false
      if (filters.authors.length && !filters.authors.some(author => node.authors.includes(author))) return false
      if (node.frequency < filters.minFrequency) return false
      if (filters.clusters.length && !filters.clusters.includes(node.cluster)) return false
      if (filters.searchTerm && !node.word.toLowerCase().includes(filters.searchTerm.toLowerCase())) return false
      return true
    })
  }, [nodes, filters])

  const handleNodeClick = (node: SemanticNode) => {
    setSelectedNode(node)
    setIsAnimating(true)
    setTimeout(() => setIsAnimating(false), 800)
  }

  const resetView = () => {
    setZoomLevel(1)
    setSelectedNode(null)
    setHoveredNode(null)
    setTimelinePosition(0)
    setIsTimelineActive(false)
  }

  const exportCluster = () => {
    const data = {
      clusters,
      nodes: filteredNodes,
      filters,
      timestamp: new Date().toISOString()
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'semantic-cluster.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0D0D0F] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-8"
        >
          <div className="relative">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 border-4 border-[#C9A962]/30 border-t-[#C9A962] rounded-full mx-auto"
            />
            <Sparkles className="w-6 h-6 text-[#C9A962] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </div>
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-[#F5F3EF]">Mapping Semantic Space</h2>
            <p className="text-[#7C9885] max-w-md">
              Discovering hidden connections between words across centuries of Greek thought...
            </p>
          </div>
        </motion.div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0D0D0F] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-6 max-w-md"
        >
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto">
            <RefreshCw className="w-8 h-8 text-red-400" />
          </div>
          <h2 className="text-xl font-bold text-[#F5F3EF]">Connection Lost</h2>
          <p className="text-[#F5F3EF]/60">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-[#C9A962] text-[#0D0D0F] rounded-lg font-medium hover:bg-[#C9A962]/90 transition-colors"
          >
            Reconnect
          </button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0D0D0F] text-[#F5F3EF]">
      {/* Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="border-b border-white/10 bg-black/20 backdrop-blur-xl sticky top-0 z-40"
      >
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center space-x-3">
                <Network className="w-8 h-8 text-[#C9A962]" />
                <div>
                  <h1 className="text-2xl font-bold">Semantic Clusters</h1>
                  <p className="text-sm text-[#7C9885]">Organic Meaning Discovery</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-white/5 rounded-lg p-2">
                <button
                  onClick={() => setViewMode('2d')}
                  className={`px-3 py-1 rounded text-sm transition-colors ${
                    viewMode === '2d' ? 'bg-[#C9A962] text-[#0D0D0F]' : 'text-[#F5F3EF]/60 hover:text-[#F5F3EF]'
                  }`}
                >
                  2D
                </button>
                <button
                  onClick={() => setViewMode('3d')}
                  className={`px-3 py-1 rounded text-sm transition-colors ${
                    viewMode === '3d' ? 'bg-[#C9A962] text-[#0D0D0F]' : 'text-[#F5F3EF]/60 hover:text-[#F5F3EF]'
                  }`}
                >
                  3D
                </button>
              </div>
              
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors border border-white/10"
              >
                <Filter className="w-4 h-4" />
                <span>Filters</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={exportCluster}
                  className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                  title="Export data"
                >
                  <Download className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    const url = window.location.href
                    navigator.clipboard.writeText(url)
                    alert('Link copied to clipboard!')
                  }}
                  className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                  title="Share view"
                >
                  <Share2 className="w-4 h-4" />
                </button>
                <button
                  onClick={resetView}
                  className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                  title="Reset view"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Filters Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-b border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden"
          >
            <div className="container mx-auto px-6 py-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-[#C9A962]">Search Term</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#F5F3EF]/40" />
                    <input
                      type="text"
                      value={filters.searchTerm}
                      onChange={(e) => setFilters(prev => ({ ...prev, searchTerm: e.target.value }))}
                      placeholder="Search words..."
                      className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:border-[#C9A962] focus:outline-none text-[#F5F3EF]"
                    />
                  </div>
                </div>
                
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-[#C9A962]">Era</label>
                  <div className="space-y-2">
                    {['Classical', 'Hellenistic', 'Imperial'].map(era => (
                      <label key={era} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filters.era.includes(era)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFilters(prev => ({ ...prev, era: [...prev.era, era] }))
                            } else {
                              setFilters(prev => ({ ...prev, era: prev.era.filter(e => e !== era) }))
                            }
                          }}
                          className="mr-2 rounded border-white/20 bg-white/5 text-[#C9A962] focus:ring-[#C9A962]"
                        />
                        <span className="text-sm text-[#F5F3EF]/80">{era}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-[#C9A962]">Frequency Range</label>
                  <input
                    type="range"
                    min="1"
                    max="500"
                    value={filters.minFrequency}
                    onChange={(e) => setFilters(prev => ({ ...prev, minFrequency: parseInt(e.target.value) }))}
                    className="w-full accent-[#C9A962]"
                  />
                  <div className="text-xs text-[#F5F3EF]/60">
                    Minimum: {filters.minFrequency} occurrences
                  </div>
                </div>
                
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-[#C9A962]">Clusters</label>
                  <div className="grid grid-cols-2 gap-2">
                    {clusters.map(cluster => (
                      <button
                        key={cluster.id}
                        onClick={() => {
                          if (filters.clusters.includes(cluster.id)) {
                            setFilters(prev => ({ ...prev, clusters: prev.clusters.filter(c => c !== cluster.id) }))
                          } else {
                            setFilters(prev => ({ ...prev, clusters: [...prev.clusters, cluster.id] }))
                          }
                        }}
                        className={`p-2 rounded-lg text-xs transition-colors ${
                          filters.clusters.includes(cluster.id)
                            ? 'bg-[#C9A962] text-[#0D0D0F]'
                            : 'bg-white/5 hover:bg-white/10 text-[#F5F3EF]/80'
                        }`}
                      >
                        {cluster.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-1">
        {/* Main Visualization */}
        <div className="flex-1 relative">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="h-[calc(100vh-140px)] relative overflow-hidden"
          >
            {/* Visualization Container */}
            <div className="w-full h-full relative bg-gradient-to-br from-black/40 to-transparent">
              {/* Clusters */}
              <svg className="absolute inset-0 w-full h-full">
                <defs>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                    <feMerge> 
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                </defs>
                
                {/* Cluster backgrounds */}
                {clusters.map(cluster => (
                  <motion.circle
                    key={cluster.id}
                    cx={400 + cluster.centroid.x * zoomLevel}
                    cy={300 + cluster.centroid.y * zoomLevel}
                    r={120 * zoomLevel}
                    fill={`${cluster.color}15`}
                    stroke={cluster.color}
                    strokeWidth="1"
                    strokeDasharray="5,5"
                    opacity={0.3}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: cluster.id === 'justice' ? 0 : 0.2 }}
                  />
                ))}
                
                {/* Connections between related nodes */}
                {filteredNodes.map((node, i) =>
                  filteredNodes.slice(i + 1).map((otherNode, j) => {
                    if (node.cluster === otherNode.cluster && Math.random() > 0.7) {
                      return (
                        <motion.line
                          key={`${node.id}-${otherNode.id}`}
                          x1={400 + node.position.x * zoomLevel}
                          y1={300 + node.position.y * zoomLevel}
                          x2={400 + otherNode.position.x * zoomLevel}
                          y2={300 + otherNode.position.y * zoomLevel}
                          stroke="#7C9885"
                          strokeWidth="1"
                          opacity={0.2}
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ delay: (i + j) * 0.05, duration: 1 }}
                        />
                      )
                    }
                    return null
                  })
                )}
              </svg>

              {/* Nodes */}
              {filteredNodes.map((node, index) => (
                <motion.div
                  key={node.id}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                  style={{
                    left: 400 + node.position.x * zoomLevel,
                    top: 300 + node.position.y * zoomLevel,
                    zIndex: selectedNode?.id === node.id ? 20 : 10
                  }}
                  onClick={() => handleNodeClick(node)}
                  onMouseEnter={() => setHoveredNode(node)}
                  onMouseLeave={() => setHoveredNode(null)}
                >
                  <motion.div
                    animate={{
                      scale: selectedNode?.id === node.id ? 1.5 : hoveredNode?.id === node.id ? 1.2 : 1,
                      rotate: selectedNode?.id === node.id ? 360 : 0
                    }}
                    transition={{ type: "spring", damping: 15, stiffness: 300 }}
                    className={`w-3 h-3 rounded-full border-2 ${
                      clusters.find(c => c.id === node.cluster)?.color
                    } bg-current shadow-lg`}
                    style={{
                      backgroundColor: clusters.find(c => c.id === node.cluster)?.color,
                      borderColor: clusters.find(c => c.id === node.cluster)?.color,
                      boxShadow: `0 0 20px ${clusters.find(c => c.id === node.cluster)?.color}40`,
                      transform: `scale(${Math.log(node.frequency + 1) / 3})`
                    }}
                  />
                  
                  {/* Node label */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ 
                      opacity: hoveredNode?.id === node.id || selectedNode?.id === node.id ? 1 : 0,
                      y: hoveredNode?.id === node.id || selectedNode?.id === node.id ? -25 : -15
                    }}
                    className="absolute bottom-full left-1/2 transform -translate-x-1/2 whitespace-nowrap"
                  >
                    <div className="bg-black/80 backdrop-blur-sm px-2 py-1 rounded text-xs text-[#F5F3EF] border border-white/20">
                      {node.word}
                      <div className="text-[10px] text-[#7C9885]">{node.frequency}x</div>
                    </div>
                  </motion.div>
                </motion.div>
              ))}
              
              {/* Zoom controls */}
              <div className="absolute top-4 right-4 flex flex-col space-y-2">
                <button
                  onClick={() => setZoomLevel(Math.min(zoomLevel * 1.2, 3))}
                  className="p-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg transition-colors"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setZoomLevel(Math.max(zoomLevel / 1.2, 0.5))}
                  className="p-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg transition-colors"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsTimelineActive(!isTimelineActive)}
                  className="p-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg transition-colors"
                >
                  {isTimelineActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>
              </div>

              {/* Cluster legend */}
              <div className="absolute bottom-4 left-4 space-y-2">
                <h3 className="text-sm font-medium text-[#C9A962]">Semantic Clusters</h3>
                <div className="space-y-1">
                  {clusters.map(cluster => (
                    <div key={cluster.id} className="flex items-center space-x-2 text-xs">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: cluster.color }}
                      />
                      <span className="text-[#F5F3EF]/80">{cluster.name}</span>
                      <span className="text-[#7C9885] text-[10px]">
                        {(cluster.coherence * 100).toFixed(0)}% coherent
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Instructions overlay */}
              {!selectedNode && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 2 }}
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                >
                  <div className="text-center space-y-2 opacity-40">
                    <MousePointer2 className="w-6 h-6 mx-auto text-[#C9A962]" />
                    <p className="text-sm text-[#F5F3EF]">Click any node to explore</p>
                    <p className="text-xs text-[#7C9885]">Distance = semantic similarity</p>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Timeline */}
          <AnimatePresence>
            {isTimelineActive && (
              <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                className="absolute bottom-0 left-0 right-0 bg-black/60 backdrop-blur-xl border-t border-white/10 p-4"
              >
                <NarrativeTimeline
                  events={[
                    { year: -500, title: "Archaic Concepts", description: "Early semantic formations" },
                    { year: -400, title: "Classical Refinement", description: "Plato and Aristotle" },
                    { year: -300, title: "Hellenistic Evolution", description: "Stoic and Epicurean thought" },
                  ]}
                  currentPosition={timelinePosition}
                  onPositionChange={setTimelinePosition}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Side Panel */}
        <AnimatePresence>
          {selectedNode && (
            <motion.div
              initial={{ x: 400, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 400, opacity: 0 }}
              className="w-96 bg-white/5 backdrop-blur-xl border-l border-white/10 overflow-y-auto"
            >
              <div className="p-6 space-y-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-[#C9A962]">{selectedNode.word}</h2>
                    <p className="text-[#7C9885]">Lemma: {selectedNode.lemma}</p>
                  </div>
                  <button
                    onClick={() => setSelectedNode(null)}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    ×
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 rounded-lg p-3">
                    <div className="text-xs text-[#7C9885] uppercase tracking-wide">Frequency</div>
                    <div className="text-lg font-bold text-[#F5F3EF]">{selectedNode.frequency}</div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-3">
                    <div className="text-xs text-[#7C9885] uppercase tracking-wide">Centrality</div>
                    <div className="text-lg font-bold text-[#F5F3EF]">
                      {(selectedNode.centrality * 100).toFixed(0)}%
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-[#C9A962] mb-3">Cluster Analysis</h3>
                  <div className="bg-white/5 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: clusters.find(c => c.id === selectedNode.cluster)?.color }}
                      />
                      <span className="font-medium">
                        {clusters.find(c => c.id === selectedNode.cluster)?.name}
                      </span>
                    </div>
                    <p className="text-sm text-[#F5F3EF]/80">
                      Core concept: {clusters.find(c => c.id === selectedNode.cluster)?.concept}
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-[#C9A962] mb-3">Innovation Components</h3>
                  <div className="space-y-4">
                    <MultiScaleView
                      levels={[
                        { name: "Word", data: selectedNode.word },
                        { name: "Concept", data: selectedNode.cluster },
                        { name: "Era", data: selectedNode.era }
                      ]}
                      currentLevel={0}
                      onLevelChange={() => {}}
                    />
                    
                    <ArgumentSynthesis
                      arguments={selectedNode.contexts.map(ctx => ({
                        id: ctx.passage,
                        text: ctx.text,
                        author: ctx.author,
                        strength: Math.random() * 0.5 + 0.5,
                        evidence: []
                      }))}
                      onSynthesisComplete={() => {}}
                    />
                    
                    <CounterEvidence
                      claims={[`${selectedNode.word} always means X`]}
                      evidence={[]}
                      onEvidenceFound={() => {}}
                    />
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-[#C9A962] mb-3">Related Contexts</h3>
                  <div className="space-y-3">
                    {selectedNode.contexts.map((context, index) => (
                      <div key={index} className="bg-white/5 rounded-lg p-3">
                        <div className="flex items-center justify-between text-xs text-[#7C9885] mb-2">
                          <span>{context.author}</span>
                          <span>{context.passage}</span>
                        </div>
                        <p className="text-sm text-[#F5F3EF]/90">{context.text}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button className="flex-1 py-2 px-4 bg-[#C9A962] hover:bg-[#C9A962]/90 text-[#0D0D0F] rounded-lg font-medium transition-colors">
                    Find Similar
                  </button>
                  <button className="flex-1 py-2 px-4 bg-white/10 hover:bg-white/20 text-[#F5F3EF] rounded-lg font-medium transition-colors">
                    Trace Evolution
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Stats Bar */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="border-t border-white/10 bg-black/20 backdrop-blur-xl"
      >
        <div className="container mx-auto px-6 py-3">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-6 text-[#7C9885]">
              <span>{filteredNodes.length} nodes visible</span>
              <span>{clusters.length} clusters</span>
              <span>Zoom: {(zoomLevel * 100).toFixed(0)}%</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-[#F5F3EF]/60">
                Discover what words ACTUALLY meant, not dictionary definitions
              </span>
              <ArrowRight className="w-4 h-4 text-[#C9A962]" />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default ClusterView
