'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Search, 
  BookOpen, 
  Brain, 
  Network, 
  Download, 
  Share2, 
  Eye, 
  Layers, 
  Zap,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Filter,
  Sparkles,
  Target,
  Quote,
  GitBranch,
  Clock,
  Star,
  AlertTriangle,
  CheckCircle,
  FileText,
  Globe,
  Link,
  Lightbulb,
  TrendingUp,
  Scale,
  Compass
} from 'lucide-react'
import { ArgumentSynthesis } from '@/components/innovations/argument_synthesis'
import { DebateView } from '@/components/innovations/debate_view'
import { CounterEvidence } from '@/components/innovations/counter_evidence'
import { ResearchCanvas } from '@/components/innovations/research_canvas'

interface DiscoveryAnswer {
  id: string
  question: string
  mainArgument: string
  confidence: number
  sources: Array<{
    author: string
    work: string
    passage: string
    relevance: number
    context: string
  }>
  relatedConcepts: Array<{
    concept: string
    connections: number
    strength: number
  }>
  timeline: Array<{
    period: string
    developments: string[]
    keyFigures: string[]
  }>
  counterArguments: Array<{
    position: string
    evidence: string
    strength: number
    sources: string[]
  }>
  unexpectedFindings: Array<{
    finding: string
    significance: string
    surprise: number
  }>
}

interface ViewMode {
  type: 'synthesis' | 'debate' | 'timeline' | 'network' | 'evidence'
  scale: 'micro' | 'meso' | 'macro'
}

const DiscoveryAnswerPage: React.FC = () => {
  const [answer, setAnswer] = useState<DiscoveryAnswer | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<ViewMode>({ type: 'synthesis', scale: 'meso' })
  const [activeFilter, setActiveFilter] = useState<string>('all')
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['main']))
  const [showExportMenu, setShowExportMenu] = useState(false)
  const [selectedSources, setSelectedSources] = useState<Set<string>>(new Set())

  useEffect(() => {
    const fetchAnswer = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1500))
        
        setAnswer({
          id: '1',
          question: 'How did Stoic concepts of virtue influence later Christian moral philosophy?',
          mainArgument: 'Stoic virtue ethics provided foundational conceptual frameworks that early Christian philosophers adapted and transformed, particularly through the mediating influence of Hellenistic Jewish thought and the pedagogical methods of late ancient philosophical schools.',
          confidence: 87,
          sources: [
            {
              author: 'Seneca',
              work: 'Moral Letters',
              passage: 'Letter 41: "God is near you, he is with you, he is within you"',
              relevance: 94,
              context: 'Divine immanence and moral guidance'
            },
            {
              author: 'Clement of Alexandria',
              work: 'Stromata',
              passage: 'Book 2, Chapter 19: On the utility of Greek philosophy',
              relevance: 91,
              context: 'Synthesis of pagan wisdom and Christian doctrine'
            },
            {
              author: 'Marcus Aurelius',
              work: 'Meditations',
              passage: 'Book 7.9: "The universe is transformation"',
              relevance: 88,
              context: 'Cosmic perspective and moral duty'
            },
            {
              author: 'Augustine',
              work: 'City of God',
              passage: 'Book 19: On the supreme good and evil',
              relevance: 95,
              context: 'Christian critique and appropriation of Stoic ethics'
            }
          ],
          relatedConcepts: [
            { concept: 'Natural Law', connections: 23, strength: 92 },
            { concept: 'Divine Providence', connections: 18, strength: 88 },
            { concept: 'Moral Education', connections: 15, strength: 85 },
            { concept: 'Cosmic Citizenship', connections: 12, strength: 79 }
          ],
          timeline: [
            {
              period: 'Early Stoa (3rd-2nd c. BCE)',
              developments: ['Foundation of virtue ethics', 'Natural law theory'],
              keyFigures: ['Zeno', 'Chrysippus']
            },
            {
              period: 'Roman Stoa (1st-2nd c. CE)',
              developments: ['Practical ethics', 'Individual moral development'],
              keyFigures: ['Seneca', 'Epictetus', 'Marcus Aurelius']
            },
            {
              period: 'Early Christianity (1st-3rd c. CE)',
              developments: ['Apologetic engagement', 'Philosophical theology'],
              keyFigures: ['Justin Martyr', 'Clement', 'Origen']
            }
          ],
          counterArguments: [
            {
              position: 'Fundamental theological incompatibility',
              evidence: 'Stoic materialism conflicts with Christian spiritual dualism',
              strength: 75,
              sources: ['Tertullian, Against the Heathen', 'Jerome, Letters']
            },
            {
              position: 'Different concepts of divine transcendence',
              evidence: 'Stoic immanent logos vs Christian transcendent God',
              strength: 68,
              sources: ['Plotinus, Enneads', 'Augustine, Confessions']
            }
          ],
          unexpectedFindings: [
            {
              finding: 'Medical metaphors bridge Stoic and Christian virtue language',
              significance: 'Both traditions use therapeutic models for moral development',
              surprise: 85
            },
            {
              finding: 'Monastic literature shows direct Stoic exercise influence',
              significance: 'Practical techniques transferred more than theoretical frameworks',
              surprise: 79
            }
          ]
        })
      } catch (err) {
        setError('Failed to load discovery results')
      } finally {
        setLoading(false)
      }
    }

    fetchAnswer()
  }, [])

  const toggleSection = (section: string) => {
    setExpandedSections(prev => {
      const next = new Set(prev)
      if (next.has(section)) {
        next.delete(section)
      } else {
        next.add(section)
      }
      return next
    })
  }

  const handleExport = (format: string) => {
    console.log(`Exporting as ${format}`)
    setShowExportMenu(false)
  }

  const viewModes = [
    { type: 'synthesis', label: 'Synthesis', icon: Brain },
    { type: 'debate', label: 'Debate', icon: Scale },
    { type: 'timeline', label: 'Timeline', icon: Clock },
    { type: 'network', label: 'Network', icon: Network },
    { type: 'evidence', label: 'Evidence', icon: Target }
  ]

  const scaleOptions = [
    { scale: 'micro', label: 'Passage Level' },
    { scale: 'meso', label: 'Work Level' },
    { scale: 'macro', label: 'Historical Scope' }
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0D0D0F] p-8">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="flex items-center justify-center h-96"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="text-center">
              <motion.div
                className="w-16 h-16 border-4 border-[#C9A962] border-t-transparent rounded-full mx-auto mb-4"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
              <p className="text-[#F5F3EF] text-lg">Synthesizing discoveries...</p>
              <p className="text-[#7C9885] text-sm mt-2">Finding connections you didn't know to look for</p>
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0D0D0F] p-8">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="flex items-center justify-center h-96"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="text-center">
              <AlertTriangle className="w-16 h-16 text-red-400 mx-auto mb-4" />
              <p className="text-[#F5F3EF] text-lg mb-2">Discovery Failed</p>
              <p className="text-[#7C9885]">{error}</p>
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  if (!answer) {
    return (
      <div className="min-h-screen bg-[#0D0D0F] p-8">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center py-24"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Compass className="w-16 h-16 text-[#7C9885] mx-auto mb-4" />
            <p className="text-[#F5F3EF] text-lg">No discoveries found</p>
            <p className="text-[#7C9885]">Try exploring a different question</p>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0D0D0F]">
      {/* Header */}
      <motion.header 
        className="border-b border-white/10 backdrop-blur-xl bg-black/20"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-2">
              <Brain className="w-8 h-8 text-[#C9A962]" />
              <div>
                <h1 className="text-2xl font-bold text-[#F5F3EF]">LOGOS</h1>
                <p className="text-[#7C9885] text-sm">Find what you didn't know to look for</p>
              </div>
            </div>
            <div className="flex-1" />
            <div className="flex items-center gap-3">
              <motion.div className="flex items-center gap-2 bg-[#C9A962]/20 px-3 py-1 rounded-full">
                <CheckCircle className="w-4 h-4 text-[#C9A962]" />
                <span className="text-[#C9A962] text-sm font-medium">{answer.confidence}% Confidence</span>
              </motion.div>
              <div className="relative">
                <motion.button
                  className="flex items-center gap-2 bg-white/5 backdrop-blur-xl border border-white/10 px-4 py-2 rounded-lg text-[#F5F3EF] hover:bg-white/10 transition-colors"
                  onClick={() => setShowExportMenu(!showExportMenu)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Download className="w-4 h-4" />
                  Export
                </motion.button>
                <AnimatePresence>
                  {showExportMenu && (
                    <motion.div
                      className="absolute top-full right-0 mt-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg p-2 min-w-[150px] z-50"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      {['PDF Report', 'Research Notes', 'Citation List', 'Raw Data'].map((format) => (
                        <button
                          key={format}
                          className="w-full text-left px-3 py-2 text-[#F5F3EF] hover:bg-white/10 rounded transition-colors"
                          onClick={() => handleExport(format)}
                        >
                          {format}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
          
          <motion.h2 
            className="text-xl text-[#F5F3EF] mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {answer.question}
          </motion.h2>

          {/* View Controls */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg p-1">
              {viewModes.map(({ type, label, icon: Icon }) => (
                <motion.button
                  key={type}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${
                    viewMode.type === type 
                      ? 'bg-[#C9A962] text-black font-medium' 
                      : 'text-[#F5F3EF] hover:bg-white/10'
                  }`}
                  onClick={() => setViewMode({ ...viewMode, type: type as any })}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </motion.button>
              ))}
            </div>

            <div className="flex bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg p-1">
              {scaleOptions.map(({ scale, label }) => (
                <motion.button
                  key={scale}
                  className={`px-3 py-2 rounded-md text-sm transition-colors ${
                    viewMode.scale === scale 
                      ? 'bg-[#7C9885] text-black font-medium' 
                      : 'text-[#F5F3EF] hover:bg-white/10'
                  }`}
                  onClick={() => setViewMode({ ...viewMode, scale: scale as any })}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {label}
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-8 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Primary Analysis */}
          <div className="xl:col-span-3 space-y-8">
            {/* Main Argument Synthesis */}
            <motion.section
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center gap-2">
                  <Brain className="w-6 h-6 text-[#C9A962]" />
                  <h3 className="text-xl font-semibold text-[#F5F3EF]">Full Argument Synthesis</h3>
                </div>
                <motion.div 
                  className="flex items-center gap-1 bg-[#C9A962]/20 px-2 py-1 rounded-full"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <Sparkles className="w-3 h-3 text-[#C9A962]" />
                  <span className="text-[#C9A962] text-xs font-medium">AI Enhanced</span>
                </motion.div>
              </div>

              <ArgumentSynthesis 
                argument={answer.mainArgument}
                sources={answer.sources}
                confidence={answer.confidence}
              />
            </motion.section>

            {/* Multi-Scale View */}
            <motion.section
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex items-center gap-3 mb-6">
                <Layers className="w-6 h-6 text-[#7C9885]" />
                <h3 className="text-xl font-semibold text-[#F5F3EF]">Multi-Scale Analysis</h3>
              </div>

              <AnimatePresence mode="wait">
                {viewMode.type === 'synthesis' && (
                  <motion.div
                    key="synthesis"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <ArgumentSynthesis 
                      argument={answer.mainArgument}
                      sources={answer.sources}
                      confidence={answer.confidence}
                    />
                  </motion.div>
                )}
                
                {viewMode.type === 'debate' && (
                  <motion.div
                    key="debate"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <DebateView 
                      mainPosition={answer.mainArgument}
                      counterArguments={answer.counterArguments}
                      sources={answer.sources}
                    />
                  </motion.div>
                )}

                {viewMode.type === 'network' && (
                  <motion.div
                    key="network"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <ResearchCanvas 
                      concepts={answer.relatedConcepts}
                      sources={answer.sources}
                      scale={viewMode.scale}
                    />
                  </motion.div>
                )}

                {viewMode.type === 'timeline' && (
                  <motion.div
                    key="timeline"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    {answer.timeline.map((period, index) => (
                      <motion.div
                        key={period.period}
                        className="relative pl-8 border-l-2 border-[#C9A962]/30"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <div className="absolute -left-2 top-0 w-4 h-4 bg-[#C9A962] rounded-full" />
                        <div className="bg-white/5 rounded-xl p-4">
                          <h4 className="text-[#C9A962] font-semibold mb-2">{period.period}</h4>
                          <div className="space-y-2">
                            <div>
                              <h5 className="text-[#F5F3EF] text-sm font-medium">Developments:</h5>
                              <ul className="text-[#7C9885] text-sm">
                                {period.developments.map((dev, i) => (
                                  <li key={i}>• {dev}</li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <h5 className="text-[#F5F3EF] text-sm font-medium">Key Figures:</h5>
                              <p className="text-[#7C9885] text-sm">{period.keyFigures.join(', ')}</p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                )}

                {viewMode.type === 'evidence' && (
                  <motion.div
                    key="evidence"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <CounterEvidence 
                      evidence={answer.counterArguments}
                      mainArgument={answer.mainArgument}
                      sources={answer.sources}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.section>

            {/* Unexpected Discoveries */}
            <motion.section
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <button 
                className="flex items-center gap-3 mb-6 w-full text-left"
                onClick={() => toggleSection('discoveries')}
              >
                <Lightbulb className="w-6 h-6 text-[#C9A962]" />
                <h3 className="text-xl font-semibold text-[#F5F3EF]">Unexpected Discoveries</h3>
                <div className="flex-1" />
                {expandedSections.has('discoveries') ? 
                  <ChevronUp className="w-5 h-5 text-[#7C9885]" /> : 
                  <ChevronDown className="w-5 h-5 text-[#7C9885]" />
                }
              </button>

              <AnimatePresence>
                {expandedSections.has('discoveries') && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-4"
                  >
                    {answer.unexpectedFindings.map((finding, index) => (
                      <motion.div
                        key={index}
                        className="bg-gradient-to-r from-[#C9A962]/10 to-transparent p-4 rounded-xl border border-[#C9A962]/20"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex items-center gap-1 bg-[#C9A962]/20 px-2 py-1 rounded-full">
                            <Zap className="w-3 h-3 text-[#C9A962]" />
                            <span className="text-[#C9A962] text-xs font-medium">{finding.surprise}%</span>
                          </div>
                          <div className="flex-1">
                            <h4 className="text-[#F5F3EF] font-medium mb-2">{finding.finding}</h4>
                            <p className="text-[#7C9885] text-sm">{finding.significance}</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Source Evidence */}
            <motion.div
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h3 className="text-lg font-semibold text-[#F5F3EF] mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-[#7C9885]" />
                Primary Sources
              </h3>
              <div className="space-y-3">
                {answer.sources.map((source, index) => (
                  <motion.div
                    key={index}
                    className="bg-white/5 rounded-xl p-3 border border-white/5 hover:border-[#C9A962]/30 transition-colors cursor-pointer"
                    whileHover={{ scale: 1.02 }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="text-[#F5F3EF] text-sm font-medium">{source.author}</h4>
                        <p className="text-[#7C9885] text-xs">{source.work}</p>
                      </div>
                      <div className="flex items-center gap-1 bg-[#C9A962]/20 px-2 py-1 rounded-full">
                        <span className="text-[#C9A962] text-xs">{source.relevance}%</span>
                      </div>
                    </div>
                    <p className="text-[#F5F3EF] text-xs mb-2">"{source.passage}"</p>
                    <p className="text-[#7C9885] text-xs">{source.context}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Related Concepts */}
            <motion.div
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <h3 className="text-lg font-semibold text-[#F5F3EF] mb-4 flex items-center gap-2">
                <Network className="w-5 h-5 text-[#8B7355]" />
                Related Concepts
              </h3>
              <div className="space-y-3">
                {answer.relatedConcepts.map((concept, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center justify-between p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
                    whileHover={{ scale: 1.02 }}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                  >
                    <div>
                      <h4 className="text-[#F5F3EF] text-sm font-medium">{concept.concept}</h4>
                      <p className="text-[#7C9885] text-xs">{concept.connections} connections</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${
                        concept.strength > 85 ? 'bg-[#C9A962]' : 
                        concept.strength > 70 ? 'bg-[#7C9885]' : 
                        'bg-[#8B7355]'
                      }`} />
                      <span className="text-xs text-[#7C9885]">{concept.strength}%</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Counter Evidence Summary */}
            <motion.div
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <h3 className="text-lg font-semibold text-[#F5F3EF] mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-orange-400" />
                Counter Evidence
              </h3>
              <div className="space-y-3">
                {answer.counterArguments.map((counter, index) => (
                  <motion.div
                    key={index}
                    className="p-3 bg-orange-400/5 border border-orange-400/20 rounded-xl"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                  >
                    <h4 className="text-[#F5F3EF] text-sm font-medium mb-2">{counter.position}</h4>
                    <p className="text-[#7C9885] text-xs mb-2">{counter.evidence}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-orange-400 text-xs">Strength: {counter.strength}%</span>
                      <span className="text-[#7C9885] text-xs">{counter.sources.length} sources</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Export Options */}
            <motion.div
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
            >
              <h3 className="text-lg font-semibold text-[#F5F3EF] mb-4 flex items-center gap-2">
                <Share2 className="w-5 h-5 text-[#C9A962]" />
                Export Options
              </h3>
              <div className="space-y-2">
                {[
                  { label: 'Research Report', icon: FileText, format: 'PDF' },
                  { label: 'Citation List', icon: Quote, format: 'BibTeX' },
                  { label: 'Raw Data', icon: Globe, format: 'JSON' },
                  { label: 'Share Link', icon: Link, format: 'URL' }
                ].map((option, index) => (
                  <motion.button
                    key={option.label}
                    className="w-full flex items-center gap-3 p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors text-left"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleExport(option.format)}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                  >
                    <option.icon className="w-4 h-4 text-[#7C9885]" />
                    <span className="text-[#F5F3EF] text-sm">{option.label}</span>
                    <div className="flex-1" />
                    <span className="text-[#7C9885] text-xs">{option.format}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DiscoveryAnswerPage
