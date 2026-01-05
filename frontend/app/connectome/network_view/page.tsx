'use client'

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Network, 
  Search, 
  Filter, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Eye, 
  EyeOff,
  Settings,
  Users,
  BookOpen,
  Quote,
  GitBranch,
  Clock,
  MapPin,
  Layers,
  Share2,
  Download,
  Info,
  ChevronDown,
  ChevronUp,
  Star,
  Link,
  Lightbulb,
  ArrowRight,
  Play,
  Pause,
  SkipBack,
  SkipForward
} from 'lucide-react'
import { ResearchCanvas } from '@/components/innovations/research_canvas'
import { MultiScaleView } from '@/components/innovations/multi_scale_view'
import { DebateView } from '@/components/innovations/debate_view'

interface NetworkNode {
  id: string
  type: 'author' | 'work' | 'concept' | 'passage' | 'scholar'
  label: string
  description: string
  period?: string
  genre?: string
  connections: number
  influence: number
  x: number
  y: number
  vx: number
  vy: number
  fx?: number
  fy?: number
  size: number
  color: string
  metadata: {
    dates?: string
    location?: string
    school?: string
    works?: string[]
    citations?: number
    annotations?: number
  }
}

interface NetworkEdge {
  id: string
  source: string
  target: string
  type: 'influence' | 'citation' | 'thematic' | 'temporal' | 'collaboration'
  weight: number
  label?: string
  passages?: Array<{
    sourcePassage: string
    targetPassage: string
    similarity: number
  }>
}

interface NetworkData {
  nodes: NetworkNode[]
  edges: NetworkEdge[]
  concepts: string[]
  periods: string[]
  schools: string[]
}

interface FilterState {
  nodeTypes: Set<string>
  edgeTypes: Set<string>
  periods: Set<string>
  schools: Set<string>
  minInfluence: number
  minConnections: number
}

interface ViewState {
  scale: number
  centerX: number
  centerY: number
  selectedNode: NetworkNode | null
  hoveredNode: NetworkNode | null
  selectedConcept: string | null
  timelinePosition: number
  isPlaying: boolean
}

const MOCK_NETWORK_DATA: NetworkData = {
  nodes: [
    {
      id: 'plato',
      type: 'author',
      label: 'Plato',
      description: 'Athenian philosopher, student of Socrates',
      period: 'Classical',
      connections: 47,
      influence: 95,
      x: 100,
      y: 100,
      vx: 0,
      vy: 0,
      size: 20,
      color: '#C9A962',
      metadata: {
        dates: '428-348 BCE',
        location: 'Athens',
        school: 'Academy',
        works: ['Republic', 'Phaedrus', 'Timaeus'],
        citations: 1247,
        annotations: 892
      }
    },
    {
      id: 'aristotle',
      type: 'author',
      label: 'Aristotle',
      description: 'Student of Plato, tutor to Alexander',
      period: 'Classical',
      connections: 52,
      influence: 92,
      x: 200,
      y: 150,
      vx: 0,
      vy: 0,
      size: 22,
      color: '#C9A962',
      metadata: {
        dates: '384-322 BCE',
        location: 'Stagira/Athens',
        school: 'Lyceum',
        works: ['Metaphysics', 'Ethics', 'Physics'],
        citations: 1456,
        annotations: 1023
      }
    },
    {
      id: 'republic',
      type: 'work',
      label: 'Republic',
      description: "Plato's masterwork on justice and the ideal state",
      period: 'Classical',
      connections: 89,
      influence: 88,
      x: 150,
      y: 80,
      vx: 0,
      vy: 0,
      size: 18,
      color: '#7C9885',
      metadata: {
        dates: '380 BCE',
        citations: 2341,
        annotations: 1567
      }
    },
    {
      id: 'justice',
      type: 'concept',
      label: 'δικαιοσύνη (Justice)',
      description: 'Central concept in Greek political philosophy',
      connections: 156,
      influence: 85,
      x: 175,
      y: 120,
      vx: 0,
      vy: 0,
      size: 16,
      color: '#8B7355',
      metadata: {
        citations: 892,
        annotations: 634
      }
    },
    {
      id: 'marcus_aurelius',
      type: 'author',
      label: 'Marcus Aurelius',
      description: 'Roman Emperor and Stoic philosopher',
      period: 'Imperial',
      connections: 34,
      influence: 76,
      x: 300,
      y: 200,
      vx: 0,
      vy: 0,
      size: 17,
      color: '#C9A962',
      metadata: {
        dates: '121-180 CE',
        location: 'Rome',
        school: 'Stoicism',
        works: ['Meditations'],
        citations: 567,
        annotations: 423
      }
    },
    {
      id: 'smith_j',
      type: 'scholar',
      label: 'Dr. Jennifer Smith',
      description: 'Modern scholar of ancient ethics',
      connections: 23,
      influence: 45,
      x: 250,
      y: 300,
      vx: 0,
      vy: 0,
      size: 12,
      color: '#F5F3EF',
      metadata: {
        location: 'Oxford',
        works: ['Platonic Justice in Context'],
        annotations: 234
      }
    }
  ],
  edges: [
    {
      id: 'plato-republic',
      source: 'plato',
      target: 'republic',
      type: 'citation',
      weight: 1.0,
      label: 'Author'
    },
    {
      id: 'republic-justice',
      source: 'republic',
      target: 'justice',
      type: 'thematic',
      weight: 0.9,
      label: 'Central Theme'
    },
    {
      id: 'plato-aristotle',
      source: 'plato',
      target: 'aristotle',
      type: 'influence',
      weight: 0.85,
      label: 'Teacher-Student'
    },
    {
      id: 'aristotle-marcus',
      source: 'aristotle',
      target: 'marcus_aurelius',
      type: 'influence',
      weight: 0.6,
      label: 'Indirect Influence'
    },
    {
      id: 'smith-justice',
      source: 'smith_j',
      target: 'justice',
      type: 'collaboration',
      weight: 0.4,
      label: 'Modern Analysis'
    }
  ],
  concepts: ['δικαιοσύνη (Justice)', 'ἀρετή (Virtue)', 'φύσις (Nature)', 'λόγος (Reason)'],
  periods: ['Archaic', 'Classical', 'Hellenistic', 'Imperial', 'Byzantine', 'Modern'],
  schools: ['Academy', 'Lyceum', 'Stoicism', 'Epicureanism', 'Skepticism', 'Neoplatonism']
}

export default function NetworkView() {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [networkData, setNetworkData] = useState<NetworkData | null>(null)
  const [filteredData, setFilteredData] = useState<NetworkData | null>(null)
  
  const [filters, setFilters] = useState<FilterState>({
    nodeTypes: new Set(['author', 'work', 'concept', 'passage', 'scholar']),
    edgeTypes: new Set(['influence', 'citation', 'thematic', 'temporal', 'collaboration']),
    periods: new Set(['Classical', 'Hellenistic', 'Imperial', 'Modern']),
    schools: new Set(['Academy', 'Lyceum', 'Stoicism']),
    minInfluence: 0,
    minConnections: 0
  })
  
  const [viewState, setViewState] = useState<ViewState>({
    scale: 1,
    centerX: 0,
    centerY: 0,
    selectedNode: null,
    hoveredNode: null,
    selectedConcept: null,
    timelinePosition: 0,
    isPlaying: false
  })
  
  const [searchQuery, setSearchQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [showTimeline, setShowTimeline] = useState(false)
  const [activeView, setActiveView] = useState<'network' | 'canvas' | 'multi' | 'debate'>('network')
  
  const svgRef = useRef<SVGSVGElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<number>()
  
  // Simulate loading network data
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true)
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000))
        setNetworkData(MOCK_NETWORK_DATA)
        setFilteredData(MOCK_NETWORK_DATA)
      } catch (err) {
        setError('Failed to load network data')
      } finally {
        setIsLoading(false)
      }
    }
    
    loadData()
  }, [])
  
  // Force-directed layout simulation
  const updateLayout = useCallback(() => {
    if (!filteredData) return
    
    const nodes = filteredData.nodes
    const edges = filteredData.edges
    const alpha = 0.1
    
    // Apply forces
    nodes.forEach((node, i) => {
      // Repulsion between nodes
      nodes.forEach((other, j) => {
        if (i !== j) {
          const dx = node.x - other.x
          const dy = node.y - other.y
          const distance = Math.sqrt(dx * dx + dy * dy)
          if (distance > 0) {
            const force = 100 / (distance * distance)
            node.vx += (dx / distance) * force * alpha
            node.vy += (dy / distance) * force * alpha
          }
        }
      })
      
      // Attraction along edges
      edges.forEach(edge => {
        if (edge.source === node.id) {
          const target = nodes.find(n => n.id === edge.target)
          if (target) {
            const dx = target.x - node.x
            const dy = target.y - node.y
            const distance = Math.sqrt(dx * dx + dy * dy)
            if (distance > 0) {
              const force = edge.weight * 0.1
              node.vx += (dx / distance) * force * alpha
              node.vy += (dy / distance) * force * alpha
            }
          }
        }
      })
      
      // Apply velocity with damping
      if (!node.fx) node.x += node.vx * 0.8
      if (!node.fy) node.y += node.vy * 0.8
      node.vx *= 0.9
      node.vy *= 0.9
    })
    
    setFilteredData({ ...filteredData, nodes })
  }, [filteredData])
  
  // Animation loop
  useEffect(() => {
    if (filteredData && activeView === 'network') {
      const animate = () => {
        updateLayout()
        animationRef.current = requestAnimationFrame(animate)
      }
      animationRef.current = requestAnimationFrame(animate)
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [filteredData, updateLayout, activeView])
  
  // Apply filters
  useEffect(() => {
    if (!networkData) return
    
    const filteredNodes = networkData.nodes.filter(node => {
      if (!filters.nodeTypes.has(node.type)) return false
      if (node.period && !filters.periods.has(node.period)) return false
      if (node.metadata.school && !filters.schools.has(node.metadata.school)) return false
      if (node.influence < filters.minInfluence) return false
      if (node.connections < filters.minConnections) return false
      if (searchQuery && !node.label.toLowerCase().includes(searchQuery.toLowerCase())) return false
      return true
    })
    
    const nodeIds = new Set(filteredNodes.map(n => n.id))
    const filteredEdges = networkData.edges.filter(edge => {
      if (!filters.edgeTypes.has(edge.type)) return false
      return nodeIds.has(edge.source) && nodeIds.has(edge.target)
    })
    
    setFilteredData({
      ...networkData,
      nodes: filteredNodes,
      edges: filteredEdges
    })
  }, [networkData, filters, searchQuery])
  
  const handleNodeClick = useCallback((node: NetworkNode) => {
    setViewState(prev => ({
      ...prev,
      selectedNode: prev.selectedNode?.id === node.id ? null : node
    }))
  }, [])
  
  const handleNodeHover = useCallback((node: NetworkNode | null) => {
    setViewState(prev => ({ ...prev, hoveredNode: node }))
  }, [])
  
  const handleZoom = useCallback((delta: number) => {
    setViewState(prev => ({
      ...prev,
      scale: Math.max(0.1, Math.min(5, prev.scale + delta))
    }))
  }, [])
  
  const resetView = useCallback(() => {
    setViewState(prev => ({
      ...prev,
      scale: 1,
      centerX: 0,
      centerY: 0,
      selectedNode: null
    }))
  }, [])
  
  const toggleFilter = useCallback((type: keyof FilterState, value: string) => {
    setFilters(prev => {
      const newFilters = { ...prev }
      const set = newFilters[type] as Set<string>
      if (set.has(value)) {
        set.delete(value)
      } else {
        set.add(value)
      }
      return newFilters
    })
  }, [])
  
  const nodeTypeColors = {
    author: '#C9A962',
    work: '#7C9885',
    concept: '#8B7355',
    passage: '#F5F3EF',
    scholar: '#9CA3AF'
  }
  
  const edgeTypeColors = {
    influence: '#C9A962',
    citation: '#7C9885',
    thematic: '#8B7355',
    temporal: '#F5F3EF',
    collaboration: '#9CA3AF'
  }
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0D0D0F] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-[#C9A962]/20 border-t-[#C9A962] rounded-full mx-auto mb-4"
          />
          <h2 className="text-xl font-medium text-[#F5F3EF] mb-2">Building the Network</h2>
          <p className="text-[#F5F3EF]/60">Mapping connections across the ancient world...</p>
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
          className="text-center bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8"
        >
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Info className="w-8 h-8 text-red-400" />
          </div>
          <h2 className="text-xl font-medium text-[#F5F3EF] mb-2">Network Unavailable</h2>
          <p className="text-[#F5F3EF]/60 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-[#C9A962] text-[#0D0D0F] rounded-xl font-medium hover:bg-[#C9A962]/90 transition-colors"
          >
            Try Again
          </button>
        </motion.div>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-[#0D0D0F]">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-b border-white/10 bg-white/5 backdrop-blur-xl"
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-[#F5F3EF] flex items-center gap-3">
                <Network className="w-8 h-8 text-[#C9A962]" />
                Living Network of Ideas
              </h1>
              <p className="text-[#F5F3EF]/60 mt-1">See how texts, authors, and ideas connect</p>
            </div>
            
            <div className="flex items-center gap-4">
              {/* View Toggle */}
              <div className="flex bg-white/5 rounded-xl p-1">
                {[
                  { id: 'network', label: 'Network', icon: Network },
                  { id: 'canvas', label: 'Canvas', icon: Layers },
                  { id: 'multi', label: 'Multi-Scale', icon: ZoomIn },
                  { id: 'debate', label: 'Debate', icon: Users }
                ].map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => setActiveView(id as any)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                      activeView === id
                        ? 'bg-[#C9A962] text-[#0D0D0F]'
                        : 'text-[#F5F3EF]/60 hover:text-[#F5F3EF] hover:bg-white/5'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                  </button>
                ))}
              </div>
              
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#F5F3EF]/40" />
                <input
                  type="text"
                  placeholder="Search network..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-64 pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[#F5F3EF] placeholder-[#F5F3EF]/40 focus:outline-none focus:border-[#C9A962]/50 focus:bg-white/10"
                />
              </div>
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* Main Content */}
      <div className="flex">
        {/* Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-80 border-r border-white/10 bg-white/2 backdrop-blur-xl h-screen sticky top-0 overflow-y-auto"
        >
          <div className="p-6 space-y-6">
            {/* Controls */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleZoom(0.2)}
                  className="p-2 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-colors"
                  title="Zoom In"
                >
                  <ZoomIn className="w-4 h-4 text-[#F5F3EF]" />
                </button>
                <button
                  onClick={() => handleZoom(-0.2)}
                  className="p-2 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-colors"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-4 h-4 text-[#F5F3EF]" />
                </button>
                <button
                  onClick={resetView}
                  className="p-2 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-colors"
                  title="Reset View"
                >
                  <RotateCcw className="w-4 h-4 text-[#F5F3EF]" />
                </button>
                <button
                  onClick={() => setShowTimeline(!showTimeline)}
                  className={`p-2 rounded-xl border border-white/10 transition-colors ${
                    showTimeline ? 'bg-[#C9A962] text-[#0D0D0F]' : 'bg-white/5 hover:bg-white/10 text-[#F5F3EF]'
                  }`}
                  title="Timeline View"
                >
                  <Clock className="w-4 h-4" />
                </button>
              </div>
              
              <div className="text-sm text-[#F5F3EF]/60">
                Scale: {viewState.scale.toFixed(1)}x
              </div>
            </div>
            
            {/* Filters */}
            <div className="space-y-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="w-full flex items-center justify-between p-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-[#C9A962]" />
                  <span className="font-medium text-[#F5F3EF]">Filters</span>
                </div>
                {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              
              <AnimatePresence>
                {showFilters && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-4 overflow-hidden"
                  >
                    {/* Node Types */}
                    <div>
                      <h4 className="text-sm font-medium text-[#F5F3EF] mb-2">Node Types</h4>
                      <div className="space-y-1">
                        {['author', 'work', 'concept', 'passage', 'scholar'].map(type => (
                          <label key={type} className="flex items-center gap-2 text-sm">
                            <input
                              type="checkbox"
                              checked={filters.nodeTypes.has(type)}
                              onChange={() => toggleFilter('nodeTypes', type)}
                              className="rounded border-white/20 bg-white/5 text-[#C9A962]"
                            />
                            <div 
                              className="w-3 h-3 rounded-full" 
                              style={{ backgroundColor: nodeTypeColors[type as keyof typeof nodeTypeColors] }}
                            />
                            <span className="text-[#F5F3EF]/80 capitalize">{type}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    
                    {/* Edge Types */}
                    <div>
                      <h4 className="text-sm font-medium text-[#F5F3EF] mb-2">Connection Types</h4>
                      <div className="space-y-1">
                        {['influence', 'citation', 'thematic', 'temporal', 'collaboration'].map(type => (
                          <label key={type} className="flex items-center gap-2 text-sm">
                            <input
                              type="checkbox"
                              checked={filters.edgeTypes.has(type)}
                              onChange={() => toggleFilter('edgeTypes', type)}
                              className="rounded border-white/20 bg-white/5 text-[#C9A962]"
                            />
                            <div 
                              className="w-3 h-1 rounded" 
                              style={{ backgroundColor: edgeTypeColors[type as keyof typeof edgeTypeColors] }}
                            />
                            <span className="text-[#F5F3EF]/80 capitalize">{type}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    
                    {/* Periods */}
                    <div>
                      <h4 className="text-sm font-medium text-[#F5F3EF] mb-2">Historical Periods</h4>
                      <div className="space-y-1">
                        {networkData?.periods.map(period => (
                          <label key={period} className="flex items-center gap-2 text-sm">
                            <input
                              type="checkbox"
                              checked={filters.periods.has(period)}
                              onChange={() => toggleFilter('periods', period)}
                              className="rounded border-white/20 bg-white/5 text-[#C9A962]"
                            />
                            <span className="text-[#F5F3EF]/80">{period}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            {/* Node Details */}
            <AnimatePresence>
              {(viewState.selectedNode || viewState.hoveredNode) && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4"
                >
                  {(() => {
                    const node = viewState.selectedNode || viewState.hoveredNode!
                    return (
                      <div>
                        <div className="flex items-center gap-3 mb-3">
                          <div
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: node.color }}
                          />
                          <h3 className="font-bold text-[#F5F3EF]">{node.label}</h3>
                        </div>
                        
                        <p className="text-sm text-[#F5F3EF]/80 mb-4">{node.description}</p>
                        
                        <div className="space-y-2 text-xs">
                          <div className="flex justify-between">
                            <span className="text-[#F5F3EF]/60">Connections:</span>
                            <span className="text-[#C9A962]">{node.connections}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-[#F5F3EF]/60">Influence:</span>
                            <span className="text-[#C9A962]">{node.influence}</span>
                          </div>
                          {node.metadata.dates && (
                            <div className="flex justify-between">
                              <span className="text-[#F5F3EF]/60">Dates:</span>
                              <span className="text-[#F5F3EF]">{node.metadata.dates}</span>
                            </div>
                          )}
                          {node.metadata.location && (
                            <div className="flex justify-between">
                              <span className="text-[#F5F3EF]/60">Location:</span>
                              <span className="text-[#F5F3EF]">{node.metadata.location}</span>
                            </div>
                          )}
                          {node.metadata.school && (
                            <div className="flex justify-between">
                              <span className="text-[#F5F3EF]/60">School:</span>
                              <span className="text-[#F5F3EF]">{node.metadata.school}</span>
                            </div>
                          )}
                        </div>
                        
                        {node.metadata.works && (
                          <div className="mt-4 pt-3 border-t border-white/10">
                            <h4 className="text-xs font-medium text-[#F5F3EF] mb-2">Major Works</h4>
                            <div className="space-y-1">
                              {node.metadata.works.slice(0, 3).map(work => (
                                <div key={work} className="text-xs text-[#F5F3EF]/80">{work}</div>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {viewState.selectedNode && (
                          <div className="mt-4 pt-3 border-t border-white/10">
                            <button className="w-full py-2 bg-[#C9A962] text-[#0D0D0F] rounded-xl text-sm font-medium hover:bg-[#C9A962]/90 transition-colors">
                              Explore Connections
                            </button>
                          </div>
                        )}
                      </div>
                    )
                  })()}
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Network Stats */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4">
              <h3 className="font-bold text-[#F5F3EF] mb-3 flex items-center gap-2">
                <GitBranch className="w-4 h-4 text-[#C9A962]" />
                Network Statistics
              </h3>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#F5F3EF]/60">Nodes:</span>
                  <span className="text-[#C9A962]">{filteredData?.nodes.length || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#F5F3EF]/60">Connections:</span>
                  <span className="text-[#C9A962]">{filteredData?.edges.length || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#F5F3EF]/60">Concepts:</span>
                  <span className="text-[#C9A962]">{networkData?.concepts.length || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#F5F3EF]/60">Time Span:</span>
                  <span className="text-[#F5F3EF]">2500+ years</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* Main Visualization Area */}
        <div className="flex-1 relative">
          <AnimatePresence mode="wait">
            {activeView === 'network' && (
              <motion.div
                key="network"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-screen"
                ref={containerRef}
              >
                <svg
                  ref={svgRef}
                  className="w-full h-full"
                  viewBox={`${-400 + viewState.centerX} ${-300 + viewState.centerY} ${800 / viewState.scale} ${600 / viewState.scale}`}
                >
                  {/* Edges */}
                  <g>
                    {filteredData?.edges.map(edge => {
                      const sourceNode = filteredData.nodes.find(n => n.id === edge.source)
                      const targetNode = filteredData.nodes.find(n => n.id === edge.target)
                      if (!sourceNode || !targetNode) return null
                      
                      return (
                        <line
                          key={edge.id}
                          x1={sourceNode.x}
                          y1={sourceNode.y}
                          x2={targetNode.x}
                          y2={targetNode.y}
                          stroke={edgeTypeColors[edge.type as keyof typeof edgeTypeColors]}
                          strokeWidth={edge.weight * 2}
                          strokeOpacity={0.6}
                        />
                      )
                    })}
                  </g>
                  
                  {/* Nodes */}
                  <g>
                    {filteredData?.nodes.map(node => (
                      <g key={node.id}>
                        <circle
                          cx={node.x}
                          cy={node.y}
                          r={node.size}
                          fill={node.color}
                          stroke={viewState.selectedNode?.id === node.id ? '#F5F3EF' : 'transparent'}
                          strokeWidth={2}
                          opacity={viewState.hoveredNode && viewState.hoveredNode.id !== node.id ? 0.3 : 1}
                          className="cursor-pointer transition-opacity"
                          onClick={() => handleNodeClick(node)}
                          onMouseEnter={() => handleNodeHover(node)}
                          onMouseLeave={() => handleNodeHover(null)}
                        />
                        <text
                          x={node.x}
                          y={node.y - node.size - 5}
                          textAnchor="middle"
                          className="fill-[#F5F3EF] text-xs font-medium pointer-events-none"
                          opacity={node.size > 14 ? 1 : 0}
                        >
                          {node.label}
                        </text>
                      </g>
                    ))}
                  </g>
                </svg>
                
                {/* Timeline */}
                <AnimatePresence>
                  {showTimeline && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      className="absolute bottom-6 left-6 right-6 bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl p-4"
                    >
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => setViewState(prev => ({ ...prev, isPlaying: !prev.isPlaying }))}
                          className="p-2 bg-[#C9A962] text-[#0D0D0F] rounded-xl hover:bg-[#C9A962]/90 transition-colors"
                        >
                          {viewState.isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        </button>
                        
                        <div className="flex-1">
                          <input
                            type="range"
                            min={0}
                            max={100}
                            value={viewState.timelinePosition}
                            onChange={(e) => setViewState(prev => ({ ...prev, timelinePosition: Number(e.target.value) }))}
                            className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer"
                          />
                          <div className="flex justify-between text-xs text-[#F5F3EF]/60 mt-1">
                            <span>800 BCE</span>
                            <span>Present</span>
                          </div>
                        </div>
                        
                        <div className="text-sm text-[#F5F3EF] font-medium">
                          {Math.round(-800 + (viewState.timelinePosition / 100) * 2800)} CE
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
            
            {activeView === 'canvas' && (
              <motion.div
                key="canvas"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-screen"
              >
                <ResearchCanvas />
              </motion.div>
            )}
            
            {activeView === 'multi' && (
              <motion.div
                key="multi"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-screen"
              >
                <MultiScaleView />
              </motion.div>
            )}
            
            {activeView === 'debate' && (
              <motion.div
                key="debate"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-screen"
              >
                <DebateView />
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Floating Controls */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute top-6 right-6 flex gap-2"
          >
            <button className="p-3 bg-white/10 backdrop-blur-xl border border-white/10 rounded-xl text-[#F5F3EF] hover:bg-white/20 transition-colors">
              <Share2 className="w-4 h-4" />
            </button>
            <button className="p-3 bg-white/10 backdrop-blur-xl border border-white/10 rounded-xl text-[#F5F3EF] hover:bg-white/20 transition-colors">
              <Download className="w-4 h-4" />
            </button>
            <button className="p-3 bg-white/10 backdrop-blur-xl border border-white/10 rounded-xl text-[#F5F3EF] hover:bg-white/20 transition-colors">
              <Settings className="w-4 h-4" />
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
