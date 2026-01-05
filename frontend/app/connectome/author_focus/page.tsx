'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  BookOpen, 
  Network, 
  ArrowRight, 
  ArrowLeft, 
  Users, 
  Quote, 
  Search,
  Filter,
  Eye,
  Lightbulb,
  GitBranch,
  Clock,
  Star,
  ChevronDown,
  ExternalLink,
  Shuffle,
  Brain,
  Zap,
  Target,
  Compass
} from 'lucide-react'
import { ResearchCanvas } from '@/components/innovations/research_canvas'
import { MultiScaleView } from '@/components/innovations/multi_scale_view'
import { DebateView } from '@/components/innovations/debate_view'

interface Author {
  id: string
  name: string
  period: string
  school?: string
  works: number
  connections: number
}

interface Connection {
  id: string
  author: Author
  type: 'influenced_by' | 'influenced' | 'contemporary' | 'disputed'
  strength: number
  sharedConcepts: string[]
  keyPassages: number
}

interface ConceptNode {
  id: string
  term: string
  frequency: number
  evolution: string[]
  relatedTerms: string[]
  significance: 'high' | 'medium' | 'low'
}

interface ParallelPassage {
  id: string
  authorA: string
  authorB: string
  textA: string
  textB: string
  similarity: number
  concept: string
  analysis: string
  workA: string
  workB: string
}

const AuthorConnectomePage = () => {
  const [selectedAuthor, setSelectedAuthor] = useState<Author | null>(null)
  const [activeView, setActiveView] = useState<'network' | 'concepts' | 'passages' | 'timeline'>('network')
  const [connections, setConnections] = useState<Connection[]>([])
  const [concepts, setConcepts] = useState<ConceptNode[]>([])
  const [passages, setPassages] = useState<ParallelPassage[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<'all' | 'influenced_by' | 'influenced' | 'contemporary'>('all')
  const [isLoading, setIsLoading] = useState(true)
  const [selectedConcept, setSelectedConcept] = useState<string | null>(null)
  const [showInfluenceMap, setShowInfluenceMap] = useState(false)
  const [canvasData, setCanvasData] = useState<any>(null)
  const [debateData, setDebateData] = useState<any>(null)

  // Mock data - in real app would come from API
  useEffect(() => {
    const loadAuthorData = async () => {
      setIsLoading(true)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const mockAuthor: Author = {
        id: 'marcus-aurelius',
        name: 'Marcus Aurelius',
        period: '121-180 CE',
        school: 'Stoic',
        works: 1,
        connections: 23
      }
      
      const mockConnections: Connection[] = [
        {
          id: '1',
          author: { id: 'epictetus', name: 'Epictetus', period: '55-135 CE', school: 'Stoic', works: 8, connections: 15 },
          type: 'influenced_by',
          strength: 0.9,
          sharedConcepts: ['προαίρεσις', 'ἀδιάφορα', 'κατάληψις'],
          keyPassages: 47
        },
        {
          id: '2',
          author: { id: 'seneca', name: 'Seneca', period: '4 BCE-65 CE', school: 'Stoic', works: 124, connections: 31 },
          type: 'influenced_by',
          strength: 0.85,
          sharedConcepts: ['providentia', 'fatum', 'virtus'],
          keyPassages: 32
        },
        {
          id: '3',
          author: { id: 'chrysippus', name: 'Chrysippus', period: '279-206 BCE', school: 'Stoic', works: 705, connections: 45 },
          type: 'influenced_by',
          strength: 0.7,
          sharedConcepts: ['εἱμαρμένη', 'συμπάθεια', 'λόγος'],
          keyPassages: 18
        },
        {
          id: '4',
          author: { id: 'simplicius', name: 'Simplicius', period: '490-560 CE', school: 'Neoplatonic', works: 12, connections: 28 },
          type: 'influenced',
          strength: 0.6,
          sharedConcepts: ['ψυχή', 'νοῦς', 'ἕνωσις'],
          keyPassages: 8
        }
      ]
      
      const mockConcepts: ConceptNode[] = [
        {
          id: '1',
          term: 'προαίρεσις',
          frequency: 156,
          evolution: ['Aristotle: choice', 'Epictetus: moral faculty', 'Marcus: will/intention'],
          relatedTerms: ['βούλησις', 'ἐκλογή', 'κρίσις'],
          significance: 'high'
        },
        {
          id: '2',
          term: 'λόγος',
          frequency: 243,
          evolution: ['Heraclitus: cosmic principle', 'Stoics: divine reason', 'Marcus: rational order'],
          relatedTerms: ['νοῦς', 'φρόνησις', 'σοφία'],
          significance: 'high'
        },
        {
          id: '3',
          term: 'ἀδιάφορα',
          frequency: 89,
          evolution: ['Aristo: all non-virtues', 'Chrysippus: preferred indifferents', 'Marcus: externals'],
          relatedTerms: ['προηγμένα', 'ἀποπροηγμένα', 'μέσα'],
          significance: 'medium'
        }
      ]
      
      const mockPassages: ParallelPassage[] = [
        {
          id: '1',
          authorA: 'Marcus Aurelius',
          authorB: 'Epictetus',
          workA: 'Meditations 2.17',
          workB: 'Discourses 1.1.7',
          textA: 'τὰ μὲν ἐφ᾽ ἡμῖν, τὰ δὲ οὐκ ἐφ᾽ ἡμῖν',
          textB: 'τῶν ὄντων τὰ μέν ἐστιν ἐφ᾽ ἡμῖν, τὰ δὲ οὐκ ἐφ᾽ ἡμῖν',
          similarity: 0.95,
          concept: 'dichotomy of control',
          analysis: 'Nearly identical formulation of core Stoic principle'
        },
        {
          id: '2',
          authorA: 'Marcus Aurelius',
          authorB: 'Seneca',
          workA: 'Meditations 4.23',
          workB: 'Letters 77.12',
          textA: 'πάντα κατὰ φύσιν γίνεται',
          textB: 'omnia naturae parent',
          similarity: 0.88,
          concept: 'cosmic determinism',
          analysis: 'Parallel expressions of natural order in Greek and Latin traditions'
        }
      ]

      // Mock canvas data
      setCanvasData({
        nodes: mockConnections.map(conn => ({
          id: conn.author.id,
          label: conn.author.name,
          type: 'author',
          data: conn
        })),
        connections: mockConnections.map(conn => ({
          source: 'marcus-aurelius',
          target: conn.author.id,
          strength: conn.strength,
          type: conn.type
        }))
      })

      // Mock debate data
      setDebateData({
        topic: 'Stoic Determinism vs Free Will',
        participants: mockConnections.map(conn => conn.author),
        arguments: [
          {
            author: 'Marcus Aurelius',
            position: 'Hard determinism with practical freedom',
            evidence: ['Med. 2.17', 'Med. 4.23', 'Med. 10.6']
          },
          {
            author: 'Epictetus',
            position: 'Compatibilist freedom through choice',
            evidence: ['Disc. 1.1', 'Disc. 2.19', 'Ench. 1']
          }
        ]
      })
      
      setSelectedAuthor(mockAuthor)
      setConnections(mockConnections)
      setConcepts(mockConcepts)
      setPassages(mockPassages)
      setIsLoading(false)
    }
    
    loadAuthorData()
  }, [])

  const filteredConnections = connections.filter(conn => {
    const matchesFilter = filterType === 'all' || conn.type === filterType
    const matchesSearch = searchTerm === '' || 
      conn.author.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conn.sharedConcepts.some(concept => concept.toLowerCase().includes(searchTerm.toLowerCase()))
    return matchesFilter && matchesSearch
  })

  const getConnectionTypeIcon = (type: string) => {
    switch (type) {
      case 'influenced_by': return <ArrowLeft className="h-4 w-4 text-[#C9A962]" />
      case 'influenced': return <ArrowRight className="h-4 w-4 text-[#7C9885]" />
      case 'contemporary': return <Users className="h-4 w-4 text-[#8B7355]" />
      default: return <Network className="h-4 w-4 text-white/60" />
    }
  }

  const getStrengthColor = (strength: number) => {
    if (strength > 0.8) return '#C9A962'
    if (strength > 0.6) return '#7C9885'
    return '#8B7355'
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0D0D0F] flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="h-12 w-12 border-2 border-[#C9A962] border-t-transparent rounded-full"
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0D0D0F] text-[#F5F3EF]">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-b border-white/10 bg-black/20 backdrop-blur-xl sticky top-0 z-50"
      >
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 bg-gradient-to-br from-[#C9A962] to-[#8B7355] rounded-lg flex items-center justify-center">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-[#C9A962]">Living Network of Ideas</h1>
                <p className="text-white/60">See how texts, authors, and ideas connect</p>
              </div>
            </div>
            
            {selectedAuthor && (
              <div className="text-right">
                <h2 className="text-xl font-semibold">{selectedAuthor.name}</h2>
                <p className="text-white/60">{selectedAuthor.period} • {selectedAuthor.school}</p>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex space-x-2 mb-8"
        >
          {[
            { key: 'network', label: 'Influence Network', icon: Network },
            { key: 'concepts', label: 'Shared Vocabulary', icon: Lightbulb },
            { key: 'passages', label: 'Parallel Passages', icon: Quote },
            { key: 'timeline', label: 'Temporal View', icon: Clock }
          ].map(({ key, label, icon: Icon }) => (
            <motion.button
              key={key}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveView(key as any)}
              className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-all ${
                activeView === key
                  ? 'bg-[#C9A962] text-black'
                  : 'bg-white/5 text-white/70 hover:bg-white/10'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{label}</span>
            </motion.button>
          ))}
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap gap-4 mb-8"
        >
          <div className="relative flex-1 min-w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/40" />
            <input
              type="text"
              placeholder="Search connections, concepts, or authors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:border-[#C9A962] outline-none"
            />
          </div>
          
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
            className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:border-[#C9A962] outline-none"
          >
            <option value="all">All Connections</option>
            <option value="influenced_by">Influences</option>
            <option value="influenced">Influenced</option>
            <option value="contemporary">Contemporaries</option>
          </select>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowInfluenceMap(!showInfluenceMap)}
            className="px-4 py-2 bg-[#7C9885] text-white rounded-lg flex items-center space-x-2"
          >
            <Compass className="h-4 w-4" />
            <span>3D Map</span>
          </motion.button>
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Primary Content */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {activeView === 'network' && (
                <motion.div
                  key="network"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-[#C9A962] mb-4 flex items-center space-x-2">
                      <Network className="h-5 w-5" />
                      <span>Influence Network</span>
                    </h3>
                    
                    {canvasData && (
                      <ResearchCanvas
                        data={canvasData}
                        height={400}
                        onNodeSelect={(node) => console.log('Selected:', node)}
                      />
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredConnections.map((connection) => (
                      <motion.div
                        key={connection.id}
                        whileHover={{ scale: 1.02, y: -2 }}
                        className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4 cursor-pointer"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-2">
                            {getConnectionTypeIcon(connection.type)}
                            <span className="font-medium">{connection.author.name}</span>
                          </div>
                          <div 
                            className="h-2 w-16 rounded-full"
                            style={{ 
                              backgroundColor: getStrengthColor(connection.strength),
                              opacity: connection.strength 
                            }}
                          />
                        </div>
                        
                        <p className="text-sm text-white/60 mb-3">
                          {connection.author.period} • {connection.author.school}
                        </p>
                        
                        <div className="flex flex-wrap gap-2 mb-3">
                          {connection.sharedConcepts.slice(0, 3).map((concept, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-1 bg-[#C9A962]/20 text-[#C9A962] text-xs rounded-full"
                            >
                              {concept}
                            </span>
                          ))}
                        </div>
                        
                        <div className="flex items-center justify-between text-sm text-white/60">
                          <span>{connection.keyPassages} parallel passages</span>
                          <ExternalLink className="h-4 w-4" />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeView === 'concepts' && (
                <motion.div
                  key="concepts"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-[#C9A962] mb-4 flex items-center space-x-2">
                      <Lightbulb className="h-5 w-5" />
                      <span>Key Shared Vocabulary</span>
                    </h3>
                    
                    <MultiScaleView
                      data={{
                        concepts: concepts.map(concept => ({
                          id: concept.id,
                          term: concept.term,
                          frequency: concept.frequency,
                          significance: concept.significance,
                          evolution: concept.evolution
                        })),
                        relationships: concepts.map(concept => ({
                          source: concept.id,
                          targets: concept.relatedTerms,
                          strength: concept.frequency / 100
                        }))
                      }}
                      onConceptSelect={(concept) => setSelectedConcept(concept.id)}
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    {concepts.map((concept) => (
                      <motion.div
                        key={concept.id}
                        whileHover={{ scale: 1.01 }}
                        onClick={() => setSelectedConcept(selectedConcept === concept.id ? null : concept.id)}
                        className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4 cursor-pointer"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <span className="text-xl font-bold text-[#C9A962]">{concept.term}</span>
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              concept.significance === 'high' 
                                ? 'bg-[#C9A962]/20 text-[#C9A962]'
                                : concept.significance === 'medium'
                                ? 'bg-[#7C9885]/20 text-[#7C9885]'
                                : 'bg-[#8B7355]/20 text-[#8B7355]'
                            }`}>
                              {concept.significance}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2 text-white/60">
                            <span className="text-sm">{concept.frequency} occurrences</span>
                            <ChevronDown className={`h-4 w-4 transition-transform ${
                              selectedConcept === concept.id ? 'rotate-180' : ''
                            }`} />
                          </div>
                        </div>

                        <AnimatePresence>
                          {selectedConcept === concept.id && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="space-y-3"
                            >
                              <div>
                                <h4 className="font-medium text-[#7C9885] mb-2">Evolution</h4>
                                <div className="space-y-2">
                                  {concept.evolution.map((stage, idx) => (
                                    <div key={idx} className="flex items-center space-x-2">
                                      <div className="h-2 w-2 bg-[#C9A962] rounded-full" />
                                      <span className="text-sm text-white/80">{stage}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              <div>
                                <h4 className="font-medium text-[#7C9885] mb-2">Related Terms</h4>
                                <div className="flex flex-wrap gap-2">
                                  {concept.relatedTerms.map((term, idx) => (
                                    <span
                                      key={idx}
                                      className="px-2 py-1 bg-[#8B7355]/20 text-[#8B7355] text-sm rounded-full"
                                    >
                                      {term}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeView === 'passages' && (
                <motion.div
                  key="passages"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-[#C9A962] mb-4 flex items-center space-x-2">
                      <Quote className="h-5 w-5" />
                      <span>Parallel Passages</span>
                    </h3>
                    
                    {debateData && (
                      <DebateView
                        data={debateData}
                        onArgumentSelect={(arg) => console.log('Selected argument:', arg)}
                      />
                    )}
                  </div>

                  <div className="space-y-4">
                    {passages.map((passage) => (
                      <motion.div
                        key={passage.id}
                        whileHover={{ scale: 1.01 }}
                        className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-2">
                            <Target className="h-5 w-5 text-[#C9A962]" />
                            <span className="font-medium text-[#C9A962]">{passage.concept}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-white/60">Similarity:</span>
                            <div className="flex items-center space-x-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < Math.round(passage.similarity * 5)
                                      ? 'text-[#C9A962] fill-current'
                                      : 'text-white/20'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="font-medium">{passage.authorA}</span>
                              <span className="text-sm text-white/60">{passage.workA}</span>
                            </div>
                            <div className="bg-black/20 rounded-lg p-3">
                              <p className="text-[#F5F3EF] font-mono">{passage.textA}</p>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="font-medium">{passage.authorB}</span>
                              <span className="text-sm text-white/60">{passage.workB}</span>
                            </div>
                            <div className="bg-black/20 rounded-lg p-3">
                              <p className="text-[#F5F3EF] font-mono">{passage.textB}</p>
                            </div>
                          </div>
                        </div>

                        <div className="border-t border-white/10 pt-4">
                          <p className="text-sm text-white/80">{passage.analysis}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeView === 'timeline' && (
                <motion.div
                  key="timeline"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6"
                >
                  <h3 className="text-lg font-semibold text-[#C9A962] mb-6 flex items-center space-x-2">
                    <Clock className="h-5 w-5" />
                    <span>Temporal Evolution of Ideas</span>
                  </h3>
                  
                  <div className="relative">
                    <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#C9A962] to-[#8B7355]" />
                    
                    {connections
                      .sort((a, b) => parseInt(a.author.period) - parseInt(b.author.period))
                      .map((connection, idx) => (
                        <motion.div
                          key={connection.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          className="relative flex items-center space-x-6 pb-8"
                        >
                          <div className="h-8 w-8 bg-[#C9A962] rounded-full flex items-center justify-center z-10">
                            <BookOpen className="h-4 w-4 text-black" />
                          </div>
                          
                          <div className="flex-1 bg-white/5 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-semibold">{connection.author.name}</h4>
                              <span className="text-sm text-white/60">{connection.author.period}</span>
                            </div>
                            
                            <p className="text-sm text-white/80 mb-3">
                              {connection.author.school} • {connection.keyPassages} connections
                            </p>
                            
                            <div className="flex flex-wrap gap-2">
                              {connection.sharedConcepts.map((concept, conceptIdx) => (
                                <span
                                  key={conceptIdx}
                                  className="px-2 py-1 bg-[#7C9885]/20 text-[#7C9885] text-xs rounded-full"
                                >
                                  {concept}
                                </span>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6"
            >
              <h3 className="text-lg font-semibold text-[#C9A962] mb-4">Quick Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-white/60">Total Connections</span>
                  <span className="font-bold text-[#C9A962]">{connections.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/60">Key Concepts</span>
                  <span className="font-bold text-[#7C9885]">{concepts.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/60">Parallel Passages</span>
                  <span className="font-bold text-[#8B7355]">{passages.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/60">Time Span</span>
                  <span className="font-bold">500+ years</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6"
            >
              <h3 className="text-lg font-semibold text-[#7C9885] mb-4">Related Authors</h3>
              <div className="space-y-3">
                {connections.slice(0, 3).map((connection) => (
                  <motion.div
                    key={connection.id}
                    whileHover={{ scale: 1.02 }}
                    className="flex items-center space-x-3 p-2 rounded-lg hover:bg-white/5 cursor-pointer"
                  >
                    <div className="h-8 w-8 bg-gradient-to-br from-[#7C9885] to-[#8B7355] rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-white">
                        {connection.author.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-sm">{connection.author.name}</p>
                      <p className="text-xs text-white/60">{connection.author.period}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-[#C9A962]/10 to-[#8B7355]/10 border border-[#C9A962]/20 rounded-xl p-6"
            >
              <h3 className="text-lg font-semibold text-[#C9A962] mb-3 flex items-center space-x-2">
                <Zap className="h-5 w-5" />
                <span>AI Insights</span>
              </h3>
              <p className="text-sm text-white/80 mb-4">
                Marcus Aurelius shows strongest conceptual alignment with Epictetus, 
                particularly in the formulation of the dichotomy of control and 
                practical ethics.
              </p>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full px-4 py-2 bg-[#C9A962] text-black rounded-lg font-medium"
              >
                Explore AI Analysis
              </motion.button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* 3D Influence Map Modal */}
      <AnimatePresence>
        {showInfluenceMap && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6"
            onClick={() => setShowInfluenceMap(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#0D0D0F] border border-white/20 rounded-2xl p-6 max-w-4xl w-full max-h-[80vh] overflow-hidden"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-[#C9A962]">3D Influence Network</h3>
                <button
                  onClick={() => setShowInfluenceMap(false)}
                  className="text-white/60 hover:text-white"
                >
                  ✕
                </button>
              </div>
              
              <div className="h-96 bg-black/20 rounded-xl flex items-center justify-center">
                <p className="text-white/60">3D Network Visualization Would Load Here</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default AuthorConnectomePage
