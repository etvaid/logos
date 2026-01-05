'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Search, 
  Plus, 
  X, 
  BookOpen, 
  Calendar,
  TrendingUp,
  Shuffle,
  Eye,
  Layers,
  ChevronRight,
  ArrowRight,
  Filter,
  Download,
  Share2,
  Lightbulb,
  Target,
  GitBranch,
  Clock,
  Users,
  Zap
} from 'lucide-react'
import { ArgumentSynthesis } from '@/components/innovations/argument_synthesis'
import { MultiScaleView } from '@/components/innovations/multi_scale_view'
import { CounterEvidence } from '@/components/innovations/counter_evidence'
import { NarrativeTimeline } from '@/components/innovations/narrative_timeline'

interface Word {
  id: string
  term: string
  primaryMeaning: string
  contexts: number
  firstUse: string
  evolution: 'stable' | 'expanding' | 'shifting' | 'declining'
  semanticNeighbors: string[]
  authors: string[]
  conceptualRange: number
}

interface ComparisonData {
  overlap: number
  divergence: number
  sharedContexts: string[]
  uniqueFeatures: { [key: string]: string[] }
  historicalSplit?: string
  convergencePoints: string[]
}

interface TimelineEvent {
  period: string
  author: string
  innovation: string
  context: string
  significance: 'major' | 'minor' | 'pivotal'
}

const SAMPLE_WORDS: Word[] = [
  {
    id: '1',
    term: 'ἀρετή',
    primaryMeaning: 'excellence of any kind',
    contexts: 1247,
    firstUse: 'Homer, Il. 1.91',
    evolution: 'expanding',
    semanticNeighbors: ['κακία', 'ἀγαθός', 'καλός', 'σοφία'],
    authors: ['Homer', 'Hesiod', 'Pindar', 'Plato', 'Aristotle'],
    conceptualRange: 89
  },
  {
    id: '2',
    term: 'δικαιοσύνη',
    primaryMeaning: 'righteousness, justice',
    contexts: 892,
    firstUse: 'Hesiod, Th. 902',
    evolution: 'shifting',
    semanticNeighbors: ['νόμος', 'θέμις', 'ἀδικία', 'ἴσος'],
    authors: ['Hesiod', 'Solon', 'Aeschylus', 'Plato'],
    conceptualRange: 76
  },
  {
    id: '3',
    term: 'σοφία',
    primaryMeaning: 'skill, wisdom',
    contexts: 634,
    firstUse: 'Homer, Il. 15.412',
    evolution: 'stable',
    semanticNeighbors: ['τέχνη', 'ἐπιστήμη', 'φρόνησις', 'νοῦς'],
    authors: ['Homer', 'Heraclitus', 'Plato', 'Aristotle'],
    conceptualRange: 92
  }
]

const TIMELINE_EVENTS: TimelineEvent[] = [
  {
    period: '8th c. BCE',
    author: 'Homer',
    innovation: 'ἀρετή = martial prowess',
    context: 'Heroic excellence in battle',
    significance: 'major'
  },
  {
    period: '7th c. BCE',
    author: 'Hesiod',
    innovation: 'δικαιοσύνη = cosmic order',
    context: 'Justice as divine principle',
    significance: 'pivotal'
  },
  {
    period: '6th c. BCE',
    author: 'Solon',
    innovation: 'δικαιοσύνη = legal fairness',
    context: 'Constitutional reforms',
    significance: 'major'
  },
  {
    period: '5th c. BCE',
    author: 'Plato',
    innovation: 'ἀρετή = knowledge of good',
    context: 'Socratic intellectualism',
    significance: 'pivotal'
  }
]

export default function LogosSemanticComparePage() {
  const [selectedWords, setSelectedWords] = useState<Word[]>([SAMPLE_WORDS[0], SAMPLE_WORDS[1]])
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [comparisonData, setComparisonData] = useState<ComparisonData | null>(null)
  const [activeView, setActiveView] = useState<'cards' | 'venn' | 'timeline'>('cards')
  const [showInnovations, setShowInnovations] = useState(false)

  useEffect(() => {
    if (selectedWords.length >= 2) {
      setIsLoading(true)
      // Simulate API call
      setTimeout(() => {
        setComparisonData({
          overlap: 34,
          divergence: 66,
          sharedContexts: ['moral philosophy', 'political theory', 'education'],
          uniqueFeatures: {
            [selectedWords[0].id]: ['heroic contexts', 'competitive excellence', 'physical prowess'],
            [selectedWords[1].id]: ['legal frameworks', 'divine order', 'social harmony']
          },
          historicalSplit: '6th century BCE - Philosophical revolution',
          convergencePoints: ['Platonic synthesis', 'Aristotelian systematization']
        })
        setIsLoading(false)
      }, 800)
    }
  }, [selectedWords])

  const addWord = (word: Word) => {
    if (selectedWords.length < 4 && !selectedWords.find(w => w.id === word.id)) {
      setSelectedWords([...selectedWords, word])
    }
  }

  const removeWord = (wordId: string) => {
    setSelectedWords(selectedWords.filter(w => w.id !== wordId))
  }

  const VennDiagram = () => (
    <div className="relative w-full h-96 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative"
      >
        {/* Left circle */}
        <motion.div
          className="absolute w-48 h-48 rounded-full border-2 border-[#C9A962] bg-[#C9A962]/10"
          style={{ left: -40, top: 0 }}
          initial={{ x: -100 }}
          animate={{ x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="absolute top-4 left-4 text-sm font-bold text-[#C9A962]">
            {selectedWords[0]?.term}
          </div>
          <div className="absolute top-10 left-4 text-xs text-[#F5F3EF]/70">
            {comparisonData?.uniqueFeatures[selectedWords[0]?.id]?.slice(0, 2).map(feature => (
              <div key={feature}>• {feature}</div>
            ))}
          </div>
        </motion.div>

        {/* Right circle */}
        <motion.div
          className="absolute w-48 h-48 rounded-full border-2 border-[#7C9885] bg-[#7C9885]/10"
          style={{ left: 40, top: 0 }}
          initial={{ x: 100 }}
          animate={{ x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="absolute top-4 right-4 text-sm font-bold text-[#7C9885]">
            {selectedWords[1]?.term}
          </div>
          <div className="absolute top-10 right-4 text-xs text-[#F5F3EF]/70 text-right">
            {comparisonData?.uniqueFeatures[selectedWords[1]?.id]?.slice(0, 2).map(feature => (
              <div key={feature}>• {feature}</div>
            ))}
          </div>
        </motion.div>

        {/* Overlap */}
        <motion.div
          className="absolute top-16 left-16 w-16 h-16 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <div className="text-center">
            <div className="text-xl font-bold text-[#F5F3EF]">{comparisonData?.overlap}%</div>
            <div className="text-xs text-[#F5F3EF]/70">shared</div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )

  const ComparisonCard = ({ word, index }: { word: Word; index: number }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 space-y-4"
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-2xl font-bold text-[#C9A962] mb-1">{word.term}</h3>
          <p className="text-[#F5F3EF]/70 text-sm">{word.primaryMeaning}</p>
        </div>
        <button
          onClick={() => removeWord(word.id)}
          className="text-[#F5F3EF]/50 hover:text-red-400 transition-colors"
        >
          <X size={16} />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-[#F5F3EF]/70">
            <BookOpen size={14} />
            <span>{word.contexts} contexts</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-[#F5F3EF]/70">
            <Calendar size={14} />
            <span>{word.firstUse}</span>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-[#F5F3EF]/70">
            <TrendingUp size={14} />
            <span className={`capitalize ${
              word.evolution === 'expanding' ? 'text-green-400' :
              word.evolution === 'shifting' ? 'text-yellow-400' :
              word.evolution === 'declining' ? 'text-red-400' : 'text-blue-400'
            }`}>
              {word.evolution}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-[#F5F3EF]/70">
            <Target size={14} />
            <span>{word.conceptualRange}% range</span>
          </div>
        </div>
      </div>

      <div>
        <h4 className="text-sm font-semibold text-[#F5F3EF] mb-2 flex items-center gap-2">
          <Layers size={14} />
          Semantic Neighbors
        </h4>
        <div className="flex flex-wrap gap-1">
          {word.semanticNeighbors.map(neighbor => (
            <span
              key={neighbor}
              className="px-2 py-1 bg-[#7C9885]/20 text-[#7C9885] text-xs rounded-md"
            >
              {neighbor}
            </span>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-sm font-semibold text-[#F5F3EF] mb-2 flex items-center gap-2">
          <Users size={14} />
          Key Authors
        </h4>
        <div className="text-sm text-[#F5F3EF]/70">
          {word.authors.join(' • ')}
        </div>
      </div>
    </motion.div>
  )

  return (
    <div className="min-h-screen bg-[#0D0D0F] text-[#F5F3EF]">
      {/* Header */}
      <div className="border-b border-white/10 bg-black/20 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-[#C9A962] mb-2">
                Semantic Comparison
              </h1>
              <p className="text-[#F5F3EF]/70 text-lg max-w-2xl">
                Discover what words ACTUALLY meant, not dictionary definitions. 
                Compare semantic evolution across authors, periods, and contexts.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setShowInnovations(!showInnovations)}
                className="flex items-center gap-2 px-4 py-2 bg-[#C9A962]/20 text-[#C9A962] rounded-lg hover:bg-[#C9A962]/30 transition-colors"
              >
                <Zap size={16} />
                AI Insights
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors">
                <Download size={16} />
                Export
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors">
                <Share2 size={16} />
                Share
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Word Search & Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-3 text-[#F5F3EF]/50" size={16} />
              <input
                type="text"
                placeholder="Search for words to compare..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:border-[#C9A962] focus:outline-none transition-colors"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-3 bg-[#7C9885]/20 text-[#7C9885] rounded-lg hover:bg-[#7C9885]/30 transition-colors">
              <Filter size={16} />
              Filters
            </button>
          </div>

          {/* Available Words */}
          {searchTerm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6"
            >
              {SAMPLE_WORDS.filter(word => 
                word.term.includes(searchTerm) || 
                word.primaryMeaning.toLowerCase().includes(searchTerm.toLowerCase())
              ).map(word => (
                <button
                  key={word.id}
                  onClick={() => addWord(word)}
                  className="flex items-center justify-between p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-colors text-left"
                >
                  <div>
                    <div className="font-semibold text-[#C9A962]">{word.term}</div>
                    <div className="text-sm text-[#F5F3EF]/70">{word.primaryMeaning}</div>
                  </div>
                  <Plus size={16} className="text-[#F5F3EF]/50" />
                </button>
              ))}
            </motion.div>
          )}

          {/* Selected Words Count */}
          <div className="flex items-center gap-2 text-sm text-[#F5F3EF]/70">
            <Eye size={14} />
            <span>Comparing {selectedWords.length} words</span>
            {selectedWords.length < 4 && (
              <span className="text-[#7C9885]">(add up to {4 - selectedWords.length} more)</span>
            )}
          </div>
        </motion.div>

        {/* View Toggle */}
        <div className="flex items-center gap-2 mb-8">
          {[
            { key: 'cards', label: 'Side-by-Side', icon: Layers },
            { key: 'venn', label: 'Venn Diagram', icon: GitBranch },
            { key: 'timeline', label: 'Timeline', icon: Clock }
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveView(key as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                activeView === key
                  ? 'bg-[#C9A962] text-black'
                  : 'bg-white/5 text-[#F5F3EF]/70 hover:bg-white/10'
              }`}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-center py-12"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 border-2 border-[#C9A962] border-t-transparent rounded-full animate-spin"></div>
              <span className="text-[#F5F3EF]/70">Analyzing semantic relationships...</span>
            </div>
          </motion.div>
        )}

        {/* Main Content */}
        <AnimatePresence mode="wait">
          {!isLoading && (
            <motion.div
              key={activeView}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {activeView === 'cards' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {selectedWords.map((word, index) => (
                    <ComparisonCard key={word.id} word={word} index={index} />
                  ))}
                </div>
              )}

              {activeView === 'venn' && comparisonData && (
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-8">
                  <h2 className="text-2xl font-bold text-[#C9A962] mb-6 flex items-center gap-2">
                    <GitBranch size={24} />
                    Usage Overlap Analysis
                  </h2>
                  <VennDiagram />
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-[#C9A962] mb-2">{comparisonData.overlap}%</div>
                      <div className="text-sm text-[#F5F3EF]/70 mb-3">Semantic Overlap</div>
                      <div className="space-y-1">
                        {comparisonData.sharedContexts.map(context => (
                          <div key={context} className="text-xs bg-white/5 px-2 py-1 rounded">
                            {context}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-[#7C9885] mb-2">{comparisonData.divergence}%</div>
                      <div className="text-sm text-[#F5F3EF]/70 mb-3">Divergence</div>
                      <div className="text-xs text-[#F5F3EF]/50">
                        {comparisonData.historicalSplit}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-[#8B7355] mb-2">{comparisonData.convergencePoints.length}</div>
                      <div className="text-sm text-[#F5F3EF]/70 mb-3">Convergence Points</div>
                      <div className="space-y-1">
                        {comparisonData.convergencePoints.map(point => (
                          <div key={point} className="text-xs bg-[#8B7355]/10 px-2 py-1 rounded">
                            {point}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeView === 'timeline' && (
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-8">
                  <h2 className="text-2xl font-bold text-[#C9A962] mb-6 flex items-center gap-2">
                    <Clock size={24} />
                    Semantic Evolution Timeline
                  </h2>
                  <div className="space-y-6">
                    {TIMELINE_EVENTS.map((event, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start gap-4"
                      >
                        <div className={`w-3 h-3 rounded-full mt-2 ${
                          event.significance === 'pivotal' ? 'bg-[#C9A962]' :
                          event.significance === 'major' ? 'bg-[#7C9885]' : 'bg-[#8B7355]'
                        }`}></div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="font-semibold text-[#C9A962]">{event.period}</span>
                            <span className="text-[#F5F3EF]/70">•</span>
                            <span className="font-medium">{event.author}</span>
                          </div>
                          <div className="text-lg font-medium text-[#F5F3EF] mb-1">{event.innovation}</div>
                          <div className="text-sm text-[#F5F3EF]/70">{event.context}</div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* AI Innovations Panel */}
        <AnimatePresence>
          {showInnovations && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-8 space-y-6"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ArgumentSynthesis 
                  arguments={[
                    {
                      claim: "ἀρετή undergoes semantic broadening in 5th c. BCE",
                      evidence: ["Pindar's athletic contexts", "Platonic intellectual virtue", "Aristotelian classification"],
                      strength: 0.92
                    },
                    {
                      claim: "δικαιοσύνη shifts from cosmic to civic domain",
                      evidence: ["Hesiodic divine justice", "Solonic legal reforms", "Democratic discourse"],
                      strength: 0.87
                    }
                  ]}
                />
                <MultiScaleView 
                  data={{
                    word: "σοφία",
                    scales: {
                      syllable: { emphasis: ["σο-", "φί-", "α"], patterns: ["wisdom root", "skill suffix"] },
                      word: { frequency: 634, collocations: ["θεῖα σοφία", "ἀνθρωπίνη σοφία"] },
                      phrase: { commonPhrases: ["σοφία καὶ ἀρετή", "πᾶσα σοφία"] },
                      passage: { keyPassages: 3, themes: ["divine wisdom", "technical skill"] }
                    }
                  }}
                />
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <CounterEvidence 
                  mainClaim="Virtue terms show linear semantic development"
                  counterEvidence={[
                    {
                      point: "Cyclical returns to earlier meanings",
                      source: "Hellenistic revival of Homeric ἀρετή",
                      strength: 0.73
                    },
                    {
                      point: "Simultaneous competing definitions",
                      source: "Platonic vs. Aristotelian σοφία",
                      strength: 0.81
                    }
                  ]}
                />
                <NarrativeTimeline 
                  events={[
                    {
                      period: "Archaic",
                      event: "Heroic virtues established",
                      impact: "Foundation of ethical vocabulary",
                      connections: ["Epic tradition", "Aristocratic values"]
                    },
                    {
                      period: "Classical",
                      event: "Philosophical systematization",
                      impact: "Abstract ethical concepts",
                      connections: ["Socratic method", "Academy"]
                    },
                    {
                      period: "Hellenistic",
                      event: "Practical ethics focus",
                      impact: "Therapeutic philosophy",
                      connections: ["Stoicism", "Epicureanism"]
                    }
                  ]}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {[
            { label: 'Find Similar Words', icon: Shuffle, color: 'bg-[#7C9885]/20 text-[#7C9885]' },
            { label: 'Export Analysis', icon: Download, color: 'bg-[#C9A962]/20 text-[#C9A962]' },
            { label: 'View Contexts', icon: BookOpen, color: 'bg-[#8B7355]/20 text-[#8B7355]' },
            { label: 'Track Evolution', icon: TrendingUp, color: 'bg-white/5 text-[#F5F3EF]' }
          ].map(({ label, icon: Icon, color }) => (
            <button
              key={label}
              className={`flex flex-col items-center gap-2 p-4 ${color} rounded-lg hover:opacity-80 transition-opacity`}
            >
              <Icon size={20} />
              <span className="text-sm font-medium">{label}</span>
            </button>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
