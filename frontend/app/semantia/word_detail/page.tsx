
'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  BookOpen, 
  Clock, 
  Users, 
  Network, 
  Eye, 
  TrendingUp,
  Search,
  Filter,
  ArrowRight,
  Quote,
  Sparkles,
  Brain,
  MapPin,
  BarChart3,
  Layers,
  ChevronDown,
  ExternalLink,
  Zap,
  Target,
  Globe
} from 'lucide-react'
import { ArgumentSynthesis } from '@/components/innovations/argument_synthesis'
import { MultiScaleView } from '@/components/innovations/multi_scale_view'
import { CounterEvidence } from '@/components/innovations/counter_evidence'
import { NarrativeTimeline } from '@/components/innovations/narrative_timeline'

interface WordDetail {
  word: string
  lemma: string
  organicMeaning: {
    core_concept: string
    semantic_dimensions: string[]
    contextual_clusters: Array<{
      context: string
      frequency: number
      examples: string[]
    }>
    ai_interpretation: string
    confidence_score: number
  }
  dictionaryComparison: {
    lsj: string
    middle_liddell: string
    semantic_gaps: string[]
    novel_discoveries: string[]
  }
  usageTimeline: Array<{
    period: string
    frequency: number
    semantic_shift: string
    key_authors: string[]
  }>
  authorDistribution: Array<{
    author: string
    frequency: number
    distinctive_usage: string
    semantic_contribution: string
  }>
  collocations: Array<{
    word: string
    strength: number
    context: string
    semantic_role: string
  }>
  examplePassages: Array<{
    author: string
    work: string
    passage: string
    translation: string
    semantic_significance: string
    innovation_score: number
  }>
  semanticNeighbors: Array<{
    word: string
    similarity: number
    relationship_type: string
  }>
}

export default function WordDetailPage({
  searchParams
}: {
  searchParams: { word?: string }
}) {
  const word = searchParams.word ?? "φιλοσοφία"
  const [wordData, setWordData] = useState<WordDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeView, setActiveView] = useState<'organic' | 'dictionary' | 'timeline' | 'usage'>('organic')
  const [selectedAuthor, setSelectedAuthor] = useState<string | null>(null)
  const [filterPeriod, setFilterPeriod] = useState<string>('all')
  const [showInnovations, setShowInnovations] = useState(false)

  useEffect(() => {
    const fetchWordDetail = async () => {
      setLoading(true)
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500))
        
        const mockData: WordDetail = {
          word: "φιλοσοφία",
          lemma: "φιλοσοφία",
          organicMeaning: {
            core_concept: "Active pursuit of understanding through love of wisdom",
            semantic_dimensions: [
              "Intellectual curiosity as driving force",
              "Systematic investigation methodology", 
              "Love as epistemological foundation",
              "Practical life guidance",
              "Dialectical knowledge construction"
            ],
            contextual_clusters: [
              {
                context: "Educational practice",
                frequency: 0.34,
                examples: ["Phaedrus 266b", "Republic 498a", "Gorgias 484c"]
              },
              {
                context: "Way of life",
                frequency: 0.28,
                examples: ["Apology 28e", "Phaedo 64a", "Letters VII 340c"]
              },
              {
                context: "Divine aspiration",
                frequency: 0.23,
                examples: ["Phaedrus 249c", "Theaetetus 176b", "Timaeus 90b"]
              },
              {
                context: "Political critique",
                frequency: 0.15,
                examples: ["Republic 473d", "Gorgias 521d", "Statesman 259b"]
              }
            ],
            ai_interpretation: "Unlike modern 'philosophy' as academic discipline, φιλοσοφία represents an existential orientation—a passionate intellectual eros that transforms both knower and known. The word captures the paradox of wisdom: true knowledge begins with recognizing ignorance, and love drives the endless pursuit of understanding.",
            confidence_score: 0.92
          },
          dictionaryComparison: {
            lsj: "love of wisdom, pursuit of wisdom, philosophy",
            middle_liddell: "philosophy, love of wisdom",
            semantic_gaps: [
              "Dictionaries miss the erotic dimension of philosophical pursuit",
              "No recognition of φιλοσοφία as transformative practice",
              "Missing connection to divine aspiration and soul-turning",
              "Overlooks political and social critique dimensions"
            ],
            novel_discoveries: [
              "φιλοσοφία often appears in contexts of divine madness (μανία)",
              "Strong collocations with conversion language (περιαγωγή)",
              "Used as contrast term to σοφία (completed wisdom)",
              "Frequently paired with erotic vocabulary (ἔρως, πόθος)"
            ]
          },
          usageTimeline: [
            {
              period: "5th century BCE",
              frequency: 12,
              semantic_shift: "Initial coinage - intellectual curiosity",
              key_authors: ["Herodotus", "Thucydides"]
            },
            {
              period: "4th century BCE",
              frequency: 187,
              semantic_shift: "Platonic development - transformative practice",
              key_authors: ["Plato", "Xenophon", "Aristotle"]
            },
            {
              period: "3rd century BCE",
              frequency: 94,
              semantic_shift: "Hellenistic systematization - school identity",
              key_authors: ["Epicurus", "Chrysippus", "Arcesilaus"]
            },
            {
              period: "2nd century BCE",
              frequency: 76,
              semantic_shift: "Roman appropriation - practical wisdom",
              key_authors: ["Polybius", "Panaetius"]
            }
          ],
          authorDistribution: [
            {
              author: "Plato",
              frequency: 147,
              distinctive_usage: "Erotic-dialectical pursuit of Forms",
              semantic_contribution: "Established φιλοσοφία as soul-turning practice"
            },
            {
              author: "Aristotle", 
              frequency: 89,
              distinctive_usage: "Systematic scientific investigation",
              semantic_contribution: "Categorized types of philosophical knowledge"
            },
            {
              author: "Plutarch",
              frequency: 63,
              distinctive_usage: "Moral formation and character development",
              semantic_contribution: "Democratized philosophy as ethical guidance"
            },
            {
              author: "Sextus Empiricus",
              frequency: 41,
              distinctive_usage: "Skeptical suspension of judgment", 
              semantic_contribution: "Philosophy as therapeutic doubt"
            }
          ],
          collocations: [
            {
              word: "παιδεία",
              strength: 0.89,
              context: "Educational transformation",
              semantic_role: "Complementary practice"
            },
            {
              word: "ἔρως",
              strength: 0.76,
              context: "Passionate pursuit",
              semantic_role: "Driving force"
            },
            {
              word: "διαλεκτική",
              strength: 0.71,
              context: "Methodological approach",
              semantic_role: "Technical method"
            },
            {
              word: "σοφία",
              strength: 0.68,
              context: "Aspirational goal",
              semantic_role: "Contrasting ideal"
            }
          ],
          examplePassages: [
            {
              author: "Plato",
              work: "Phaedrus 249c",
              passage: "ἀνὴρ δὲ φιλοσοφίᾳ διατρίβων ἢ παιδεραστῶν φιλοσόφως",
              translation: "The man who spends his time in philosophy or loves boys philosophically",
              semantic_significance: "Links φιλοσοφία with erotic pursuit and soul recognition",
              innovation_score: 0.94
            },
            {
              author: "Plato",
              work: "Republic 473d",
              passage: "ἐὰν μὴ ἢ οἱ φιλόσοφοι βασιλεύσωσιν ἐν ταῖς πόλεσι",
              translation: "Unless philosophers rule in cities",
              semantic_significance: "Revolutionary claim linking φιλοσοφία to political authority",
              innovation_score: 0.91
            },
            {
              author: "Aristotle",
              work: "Metaphysics 982b",
              passage: "διὸ καὶ ἡ κτῆσις αὐτῆς ἔστι που θεῖον μᾶλλον ἢ ἀνθρώπινον",
              translation: "Hence its acquisition is in a sense divine rather than human",
              semantic_significance: "Establishes divine dimension of philosophical pursuit",
              innovation_score: 0.87
            }
          ],
          semanticNeighbors: [
            {
              word: "σοφία",
              similarity: 0.91,
              relationship_type: "aspirational_goal"
            },
            {
              word: "παιδεία",
              similarity: 0.84,
              relationship_type: "transformative_practice"
            },
            {
              word: "ἐπιστήμη",
              similarity: 0.79,
              relationship_type: "knowledge_type"
            },
            {
              word: "διαλεκτική",
              similarity: 0.76,
              relationship_type: "methodological"
            }
          ]
        }

        setWordData(mockData)
      } catch (err) {
        setError('Failed to load word details')
      } finally {
        setLoading(false)
      }
    }

    fetchWordDetail()
  }, [word])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0D0D0F] flex items-center justify-center">
        <motion.div 
          className="flex flex-col items-center space-y-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="w-16 h-16 border-4 border-[#C9A962] border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <div className="text-[#F5F3EF] text-lg font-light">Discovering organic meaning...</div>
          <div className="text-[#7C9885] text-sm">Analyzing semantic patterns across 2,847 passages</div>
        </motion.div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0D0D0F] flex items-center justify-center">
        <motion.div 
          className="bg-white/5 backdrop-blur-xl border border-red-500/20 rounded-2xl p-12 max-w-md text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="text-red-400 text-6xl mb-4">⚠</div>
          <h1 className="text-[#F5F3EF] text-xl font-semibold mb-2">Discovery Failed</h1>
          <p className="text-[#7C9885] mb-6">{error}</p>
          <button className="bg-[#C9A962] text-[#0D0D0F] px-6 py-3 rounded-xl font-medium hover:bg-[#C9A962]/90 transition-colors">
            Try Again
          </button>
        </motion.div>
      </div>
    )
  }

  if (!wordData) return null

  return (
    <div className="min-h-screen bg-[#0D0D0F] text-[#F5F3EF]">
      {/* Header */}
      <motion.header 
        className="border-b border-white/10 bg-white/5 backdrop-blur-xl"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <motion.div
                className="w-12 h-12 bg-gradient-to-br from-[#C9A962] to-[#8B7355] rounded-xl flex items-center justify-center"
                whileHover={{ scale: 1.05, rotate: 5 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <Brain className="w-6 h-6 text-[#0D0D0F]" />
              </motion.div>
              <div>
                <div className="text-sm text-[#7C9885] font-medium">SEMANTIA / Organic Discovery</div>
                <div className="text-xs text-[#F5F3EF]/60">What words ACTUALLY meant</div>
              </div>
            </div>
            <motion.button
              onClick={() => setShowInnovations(!showInnovations)}
              className="flex items-center space-x-2 bg-[#C9A962]/20 border border-[#C9A962]/30 rounded-xl px-4 py-2 text-[#C9A962] hover:bg-[#C9A962]/30 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">AI Innovations</span>
            </motion.button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2">
              <motion.h1 
                className="text-5xl font-bold mb-4 bg-gradient-to-r from-[#C9A962] to-[#8B7355] bg-clip-text text-transparent"
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.8 }}
              >
                {wordData.word}
              </motion.h1>
              <motion.p 
                className="text-xl text-[#7C9885] mb-6"
                initial={{ x: -30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.8 }}
              >
                {wordData.organicMeaning.core_concept}
              </motion.p>
              <motion.div
                className="flex items-center space-x-6"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              >
                <div className="flex items-center space-x-2 text-sm text-[#F5F3EF]/80">
                  <Target className="w-4 h-4 text-[#C9A962]" />
                  <span>AI Confidence: {Math.round(wordData.organicMeaning.confidence_score * 100)}%</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-[#F5F3EF]/80">
                  <Globe className="w-4 h-4 text-[#7C9885]" />
                  <span>{wordData.examplePassages.length} passages analyzed</span>
                </div>
              </motion.div>
            </div>

            <motion.div
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              <h3 className="text-lg font-semibold mb-4 text-[#C9A962]">Quick Insights</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#F5F3EF]/70">Peak Usage</span>
                  <span className="text-sm font-medium text-[#C9A962]">4th century BCE</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#F5F3EF]/70">Top Author</span>
                  <span className="text-sm font-medium text-[#C9A962]">Plato (147×)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#F5F3EF]/70">Key Innovation</span>
                  <span className="text-sm font-medium text-[#C9A962]">Erotic pursuit</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#F5F3EF]/70">Closest Neighbor</span>
                  <span className="text-sm font-medium text-[#C9A962]">σοφία (91%)</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.header>

      {/* Navigation Tabs */}
      <motion.div 
        className="border-b border-white/10 bg-white/5 backdrop-blur-xl sticky top-0 z-40"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex space-x-8">
            {[
              { id: 'organic', label: 'Organic Meaning', icon: Brain },
              { id: 'dictionary', label: 'Dictionary Gap', icon: BookOpen },
              { id: 'timeline', label: 'Evolution', icon: Clock },
              { id: 'usage', label: 'Author Usage', icon: Users }
            ].map((tab) => (
              <motion.button
                key={tab.id}
                onClick={() => setActiveView(tab.id as any)}
                className={`flex items-center space-x-2 py-4 px-2 border-b-2 transition-colors relative ${
                  activeView === tab.id 
                    ? 'border-[#C9A962] text-[#C9A962]' 
                    : 'border-transparent text-[#F5F3EF]/60 hover:text-[#F5F3EF]/80'
                }`}
                whileHover={{ y: -2 }}
                whileTap={{ y: 0 }}
              >
                <tab.icon className="w-4 h-4" />
                <span className="font-medium">{tab.label}</span>
                {activeView === tab.id && (
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C9A962]"
                    layoutId="activeTab"
                  />
                )}
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* AI Innovations Overlay */}
      <AnimatePresence>
        {showInnovations && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowInnovations(false)}
          >
            <motion.div
              className="bg-[#0D0D0F] border border-[#C9A962]/30 rounded-2xl p-8 max-w-4xl w-full max-h-[80vh] overflow-y-auto"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-[#C9A962]">AI-Powered Innovations</h2>
                <button
                  onClick={() => setShowInnovations(false)}
                  className="text-[#F5F3EF]/60 hover:text-[#F5F3EF] transition-colors"
                >
                  ×
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ArgumentSynthesis 
                  arguments={[
                    {
                      claim: "φιλοσοφία represents erotic pursuit of wisdom",
                      evidence: ["Phaedrus 249c collocations", "ἔρως frequency analysis"],
                      strength: 0.89
                    },
                    {
                      claim: "Philosophy as soul-turning practice (περιαγωγή)",
                      evidence: ["Republic cave allegory", "Conversion language patterns"],
                      strength: 0.91
                    }
                  ]}
                />

                <MultiScaleView
                  scales={[
                    { level: "word", data: "φιλοσοφία usage patterns" },
                    { level: "passage", data: "Contextual meaning clusters" },
                    { level: "work", data: "Cross-dialogue development" },
                    { level: "corpus", data: "Historical semantic evolution" }
                  ]}
                />

                <CounterEvidence
                  mainClaim="φιλοσοφία always implies systematic method"
                  counterEvidence={[
                    "Herodotean usage suggests curiosity without method",
                    "Pre-Socratic fragments show intuitive rather than systematic approach"
                  ]}
                />

                <NarrativeTimeline
                  events={[
                    {
                      period: "5th century",
                      event: "Word coined for intellectual curiosity",
                      significance: "Initial semantic foundation"
                    },
                    {
                      period: "Plato",
                      event: "Erotic-dialectical transformation",
                      significance: "Revolutionary redefinition"
                    },
                    {
                      period: "Aristotle",
                      event: "Systematic categorization",
                      significance: "Academic institutionalization"
                    }
                  ]}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <AnimatePresence mode="wait">
          {activeView === 'organic' && (
            <motion.div
              key="organic"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6 }}
              className="space-y-12"
            >
              {/* AI Interpretation */}
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-8 h-8 bg-[#C9A962] rounded-lg flex items-center justify-center">
                    <Zap className="w-4 h-4 text-[#0D0D0F]" />
                  </div>
                  <h2 className="text-2xl font-bold text-[#C9A962]">AI-Discovered Meaning</h2>
                  <div className="bg-[#7C9885]/20 text-[#7C9885] px-3 py-1 rounded-full text-xs font-medium">
                    {Math.round(wordData.organicMeaning.confidence_score * 100)}% confidence
                  </div>
                </div>
                <p className="text-lg leading-relaxed text-[#F5F3EF]/90 mb-8">
                  {wordData.organicMeaning.ai_interpretation}
                </p>

                {/* Semantic Dimensions */}
                <h3 className="text-xl font-semibold mb-4 text-[#7C9885]">Semantic Dimensions</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {wordData.organicMeaning.semantic_dimensions.map((dimension, index) => (
                    <motion.div
                      key={index}
                      className="bg-white/5 border border-white/10 rounded-xl p-4"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-[#C9A962] rounded-full mt-2 flex-shrink-0" />
                        <span className="text-sm font-medium text-[#F5F3EF]">{dimension}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Contextual Clusters */}
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-[#C9A962] mb-6">Contextual Usage Clusters</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {wordData.organicMeaning.contextual_clusters.map((cluster, index) => (
                    <motion.div
                      key={index}
                      className="bg-white/5 border border-white/10 rounded-xl p-6"
                      initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.2 }}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-[#F5F3EF]">{cluster.context}</h3>
                        <div className="text-[#C9A962] font-bold">
                          {Math.round(cluster.frequency * 100)}%
                        </div>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-2 mb-4">
                        <motion.div
                          className="bg-gradient-to-r from-[#C9A962] to-[#8B7355] h-2 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${cluster.frequency * 100}%` }}
                          transition={{ delay: index * 0.2 + 0.5, duration: 1 }}
                        />
                      </div>
                      <div className="space-y-2">
                        {cluster.examples.map((example, i) => (
                          <div key={i} className="flex items-center space-x-2 text-sm text-[#F5F3EF]/70">
                            <Quote className="w-3 h-3 text-[#7C9885] flex-shrink-0" />
                            <span>{example}</span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Semantic Neighbors */}
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-[#C9A962] mb-6 flex items-center space-x-2">
                  <Network className="w-6 h-6" />
                  <span>Semantic Neighborhood</span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {wordData.semanticNeighbors.map((neighbor, index) => (
                    <motion.div
                      key={index}
                      className="flex items-center justify-between bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-colors cursor-pointer"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ x: 5 }}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="text-lg font-medium text-[#C9A962]">{neighbor.word}</div>
                        <div className="text-xs text-[#F5F3EF]/60 bg-white/10 px-2 py-1 rounded">
                          {neighbor.relationship_type.replace('_', ' ')}
                        </div>
                      </div>
                      <div className="text-[#7C9885] font-bold">
                        {Math.round(neighbor.similarity * 100)}%
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeView === 'dictionary' && (
            <motion.div
              key="dictionary"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              {/* Traditional Definitions */}
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-[#C9A962] mb-6">Traditional Dictionary Definitions</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-[#F5F3EF] mb-3">LSJ (Liddell-Scott-Jones)</h3>
                    <p className="text-[#F5F3EF]/80 leading-relaxed">{wordData.dictionaryComparison.lsj}</p>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-[#F5F3EF] mb-3">Middle Liddell</h3>
                    <p className="text-[#F5F3EF]/80 leading-relaxed">{wordData.dictionaryComparison.middle_liddell}</p>
                  </div>
                </div>
              </div>

              {/* Semantic Gaps */}
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-[#C9A962] mb-6">What Dictionaries Miss</h2>
                <div className="space-y-4">
                  {wordData.dictionaryComparison.semantic_gaps.map((gap, index) => (
                    <motion.div
                      key={index}
                      className="flex items-start space-x-3 bg-red-500/10 border border-red-500/20 rounded-xl p-4"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="w-6 h-6 bg-red-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Eye className="w-3 h-3 text-red-400" />
                      </div>
                      <p className="text-[#F5F3EF] leading-relaxed">{gap}</p>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Novel Discoveries */}
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-[#C9A962] mb-6">AI-Discovered Insights</h2>
                <div className="space-y-4">
                  {wordData.dictionaryComparison.novel_discoveries.map((discovery, index) => (
                    <motion.div
                      key={index}
                      className="flex items-start space-x-3 bg-[#C9A962]/10 border border-[#C9A962]/20 rounded-xl p-4"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="w-6 h-6 bg-[#C9A962]/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Sparkles className="w-3 h-3 text-[#C9A962]" />
                      </div>
                      <p className="text-[#F5F3EF] leading-relaxed">{discovery}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeView === 'timeline' && (
            <motion.div
              key="timeline"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              {/* Usage Timeline */}
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-[#C9A962] mb-8">Semantic Evolution Timeline</h2>
                <div className="relative">
                  <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#C9A962] to-[#8B7355]" />
                  <div className="space-y-8">
                    {wordData.usageTimeline.map((period, index) => (
                      <motion.div
                        key={index}
                        className="relative flex items-start space-x-6"
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.2 }}
                      >
                        <motion.div
                          className="w-4 h-4 bg-[#C9A962] rounded-full border-4 border-[#0D0D0F] z-10"
                          whileHover={{ scale: 1.5 }}
                        />
                        <div className="flex-1 bg-white/5 border border-white/10 rounded-xl p-6">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-semibold text-[#F5F3EF]">{period.period}</h3>
                            <div className="flex items-center space-x-2">
                              <BarChart3 className="w-4 h-4 text-[#7C9885]" />
                              <span className="text-[#7C9885] font-medium">{period.frequency} instances</span>
                            </div>
                          </div>
                          <p className="text-[#F5F3EF]/80 mb-4 leading-relaxed">{period.semantic_shift}</p>
                          <div className="flex flex-wrap gap-2">
                            {period.key_authors.map((author, i) => (
                              <span
                                key={i}
                                className="bg-[#C9A962]/20 text-[#C9A962] px-3 py-1 rounded-full text-sm font-medium"
                              >
                                {author}
                              </span>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Collocations */}
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-[#C9A962] mb-6">Strongest Collocations</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {wordData.collocations.map((collocation, index) => (
                    <motion.div
                      key={index}
                      className="bg-white/5 border border-white/10 rounded-xl p-4"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-lg font-medium text-[#C9A962]">{collocation.word}</span>
                        <span className="text-[#7C9885] font-bold">
                          {Math.round(collocation.strength * 100)}%
                        </span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-1.5 mb-3">
                        <motion.div
                          className="bg-gradient-to-r from-[#C9A962] to-[#7C9885] h-1.5 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${collocation.strength * 100}%` }}
                          transition={{ delay: index * 0.1 + 0.5, duration: 0.8 }}
                        />
                      </div>
                      <div className="text-sm text-[#F5F3EF]/70 mb-1">{collocation.context}</div>
                      <div className="text-xs text-[#F5F3EF]/50">{collocation.semantic_role}</div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeView === 'usage' && (
            <motion.div
              key="usage"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              {/* Author Distribution */}
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-[#C9A962] mb-6">Author Usage Patterns</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {wordData.authorDistribution.map((author, index) => (
                    <motion.div
                      key={index}
                      className={`bg-white/5 border border-white/10 rounded-xl p-6 cursor-pointer transition-all ${
                        selectedAuthor === author.author ? 'ring-2 ring-[#C9A962] bg-[#C9A962]/10' : 'hover:bg-white/10'
                      }`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => setSelectedAuthor(selectedAuthor === author.author ? null : author.author)}
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-semibold text-[#F5F3EF]">{author.author}</h3>
                        <div className="text-[#C9A962] font-bold text-lg">{author.frequency}×</div>
                      </div>
                      <p className="text-[#F5F3EF]/80 mb-3 leading-relaxed">{author.distinctive_usage}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-[#7C9885] font-medium">Contribution:</span>
                        <ChevronDown className={`w-4 h-4 text-[#7C9885] transition-transform ${
                          selectedAuthor === author.author ? 'rotate-180' : ''
                        }`} />
                      </div>
                      <AnimatePresence>
                        {selectedAuthor === author.author && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="mt-4 pt-4 border-t border-white/10"
                          >
                            <p className="text-[#F5F3EF]/70 text-sm leading-relaxed">
                              {author.semantic_contribution}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Example Passages */}
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-[#C9A962] mb-6">Key Passages</h2>
                <div className="space-y-6">
                  {wordData.examplePassages.map((passage, index) => (
                    <motion.div
                      key={index}
                      className="bg-white/5 border border-white/10 rounded-xl p-6"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.2 }}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <span className="text-lg font-semibold text-[#C9A962]">{passage.author}</span>
                          <span className="text-[#F5F3EF]/60">•</span>
                          <span className="text-[#F5F3EF]/80">{passage.work}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="text-xs text-[#7C9885]">Innovation Score</div>
                          <div className="text-[#7C9885] font-bold">
                            {Math.round(passage.innovation_score * 100)}%
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-white/5 border-l-4 border-[#C9A962] p-4 mb-4">
                        <div className="text-lg font-mono text-[#F5F3EF] mb-2 leading-relaxed">
                          {passage.passage}
                        </div>
                        <div className="text-[#F5F3EF]/70 italic">
                          {passage.translation}
                        </div>
                      </div>

                      <p className="text-sm text-[#7C9885] leading-relaxed">
                        {passage.semantic_significance}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}