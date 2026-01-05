'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Clock, 
  BookOpen, 
  Users, 
  Lightbulb, 
  ArrowLeft, 
  ArrowRight,
  Filter,
  Search,
  Zap,
  Scroll,
  Brain,
  Globe,
  Star,
  TrendingUp,
  Eye,
  Sparkles,
  ChevronDown,
  Calendar,
  User,
  Feather,
  Target,
  Network
} from 'lucide-react'
import { NarrativeTimeline } from '@/components/innovations/narrative_timeline'
import { MultiScaleView } from '@/components/innovations/multi_scale_view'
import { ComparativeFrames } from '@/components/innovations/comparative_frames'

interface Author {
  id: string
  name: string
  greekName: string
  works: string[]
  influence: number
  innovations: string[]
  timeline: { start: number; end: number }
}

interface SemanticTerm {
  term: string
  greekTerm: string
  definition: string
  frequency: number
  evolution: string[]
  contexts: string[]
  relatedTerms: string[]
  innovation: boolean
}

interface Period {
  id: string
  name: string
  years: string
  description: string
  culturalContext: string
  linguisticFeatures: string[]
  majorThemes: string[]
  authors: Author[]
  keyTerms: SemanticTerm[]
  semanticInnovations: string[]
  influences: string[]
}

const samplePeriod: Period = {
  id: 'classical',
  name: 'Classical Period',
  years: '480-323 BCE',
  description: 'The golden age of Greek literature and philosophy, marked by the flourishing of democracy in Athens and the revolutionary thinking of Socrates, Plato, and Aristotle.',
  culturalContext: 'Peak of Athenian democracy, Persian Wars aftermath, rise of philosophy, dramatic innovation',
  linguisticFeatures: [
    'Attic dialect dominance',
    'Refined prose development',
    'Philosophical vocabulary creation',
    'Technical terminology emergence'
  ],
  majorThemes: [
    'Democracy and citizenship',
    'Virtue and excellence',
    'Knowledge and wisdom',
    'Justice and ethics',
    'Beauty and art',
    'Nature and cosmos'
  ],
  authors: [
    {
      id: 'plato',
      name: 'Plato',
      greekName: 'Πλάτων',
      works: ['Republic', 'Phaedo', 'Symposium', 'Meno'],
      influence: 95,
      innovations: ['Philosophical dialogue', 'Theory of Forms', 'Political theory'],
      timeline: { start: -428, end: -348 }
    },
    {
      id: 'aristotle',
      name: 'Aristotle',
      greekName: 'Ἀριστοτέλης',
      works: ['Nicomachean Ethics', 'Poetics', 'Politics', 'Metaphysics'],
      influence: 98,
      innovations: ['Systematic philosophy', 'Logical categories', 'Scientific method'],
      timeline: { start: -384, end: -322 }
    },
    {
      id: 'sophocles',
      name: 'Sophocles',
      greekName: 'Σοφοκλῆς',
      works: ['Oedipus Rex', 'Antigone', 'Electra'],
      influence: 87,
      innovations: ['Third actor', 'Character psychology', 'Tragic irony'],
      timeline: { start: -496, end: -406 }
    },
    {
      id: 'euripides',
      name: 'Euripides',
      greekName: 'Εὐριπίδης',
      works: ['Medea', 'The Bacchae', 'Hippolytus'],
      influence: 82,
      innovations: ['Psychological realism', 'Divine machinery critique', 'Female protagonists'],
      timeline: { start: -480, end: -406 }
    }
  ],
  keyTerms: [
    {
      term: 'arete',
      greekTerm: 'ἀρετή',
      definition: 'Excellence of character; virtue as the fulfillment of purpose or function',
      frequency: 89,
      evolution: ['Heroic excellence', 'Moral virtue', 'Intellectual excellence'],
      contexts: ['Ethics', 'Politics', 'Education'],
      relatedTerms: ['eudaimonia', 'phronesis', 'sophia'],
      innovation: false
    },
    {
      term: 'eidos',
      greekTerm: 'εἶδος',
      definition: 'Form or idea; eternal, unchanging essence of things',
      frequency: 76,
      evolution: ['Visible form', 'Conceptual form', 'Platonic Form'],
      contexts: ['Metaphysics', 'Epistemology', 'Aesthetics'],
      relatedTerms: ['idea', 'morphe', 'ousia'],
      innovation: true
    },
    {
      term: 'logos',
      greekTerm: 'λόγος',
      definition: 'Reason, word, principle; the rational structure underlying reality',
      frequency: 95,
      evolution: ['Speech', 'Rational account', 'Universal reason'],
      contexts: ['Philosophy', 'Rhetoric', 'Theology'],
      relatedTerms: ['nous', 'sophia', 'episteme'],
      innovation: false
    },
    {
      term: 'polis',
      greekTerm: 'πόλις',
      definition: 'City-state; the ideal community for human flourishing',
      frequency: 88,
      evolution: ['Fortified place', 'City-state', 'Political community'],
      contexts: ['Politics', 'Ethics', 'Social theory'],
      relatedTerms: ['politeia', 'polites', 'koinonia'],
      innovation: false
    }
  ],
  semanticInnovations: [
    'Technical philosophical vocabulary',
    'Abstract concept formation',
    'Systematic categorization',
    'Dialectical reasoning terms'
  ],
  influences: [
    'Earlier lyric poetry',
    'Presocratic philosophy',
    'Democratic political discourse',
    'Mystery religions'
  ]
}

export default function PeriodView() {
  const [period, setPeriod] = useState<Period | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedFilter, setSelectedFilter] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [activeView, setActiveView] = useState<'overview' | 'terms' | 'authors' | 'innovations'>('overview')

  useEffect(() => {
    const loadPeriod = async () => {
      setLoading(true)
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1200))
      setPeriod(samplePeriod)
      setLoading(false)
    }
    loadPeriod()
  }, [])

  const filteredTerms = period?.keyTerms.filter(term => {
    const matchesSearch = searchTerm === '' || 
      term.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
      term.greekTerm.includes(searchTerm) ||
      term.definition.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesFilter = selectedFilter === 'all' ||
      (selectedFilter === 'innovations' && term.innovation) ||
      (selectedFilter === 'high-frequency' && term.frequency > 80) ||
      term.contexts.some(context => context.toLowerCase().includes(selectedFilter))
    
    return matchesSearch && matchesFilter
  }) || []

  if (loading) {
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
            className="w-16 h-16 border-4 border-[#C9A962] border-t-transparent rounded-full mx-auto mb-4"
          />
          <p className="text-[#F5F3EF] text-lg">Traveling through time...</p>
        </motion.div>
      </div>
    )
  }

  if (!period) {
    return (
      <div className="min-h-screen bg-[#0D0D0F] flex items-center justify-center">
        <div className="text-center">
          <Clock className="w-16 h-16 text-[#C9A962] mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-[#F5F3EF] mb-2">Period Not Found</h2>
          <p className="text-[#7C9885]">This historical period could not be located in our temporal database.</p>
        </div>
      </div>
    )
  }

  const timelineData = [
    {
      id: 'cultural-context',
      title: 'Cultural Context',
      content: period.culturalContext,
      timestamp: period.years,
      category: 'context'
    },
    ...period.authors.map(author => ({
      id: author.id,
      title: `${author.name} (${author.greekName})`,
      content: `Active period with major works: ${author.works.join(', ')}`,
      timestamp: `${Math.abs(author.timeline.start)}-${Math.abs(author.timeline.end)} BCE`,
      category: 'author'
    }))
  ]

  const scaleViews = [
    {
      id: 'macro',
      title: 'Historical Context',
      description: 'Broad cultural and political movements',
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg p-4">
              <h4 className="text-[#C9A962] font-semibold mb-2">Major Themes</h4>
              <div className="space-y-2">
                {period.majorThemes.map((theme, i) => (
                  <div key={i} className="flex items-center space-x-2">
                    <Star className="w-4 h-4 text-[#7C9885]" />
                    <span className="text-[#F5F3EF] text-sm">{theme}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg p-4">
              <h4 className="text-[#C9A962] font-semibold mb-2">Cultural Influences</h4>
              <div className="space-y-2">
                {period.influences.map((influence, i) => (
                  <div key={i} className="flex items-center space-x-2">
                    <Globe className="w-4 h-4 text-[#8B7355]" />
                    <span className="text-[#F5F3EF] text-sm">{influence}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'micro',
      title: 'Linguistic Features',
      description: 'Specific language developments',
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {period.linguisticFeatures.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg p-4"
            >
              <div className="flex items-center space-x-2 mb-2">
                <Feather className="w-4 h-4 text-[#C9A962]" />
                <span className="text-[#F5F3EF] font-medium">{feature}</span>
              </div>
            </motion.div>
          ))}
        </div>
      )
    }
  ]

  const comparisonFrames = [
    {
      id: 'authors',
      title: 'Key Authors',
      items: period.authors.map(author => ({
        id: author.id,
        label: author.name,
        value: author.influence,
        metadata: {
          greekName: author.greekName,
          works: author.works.length,
          innovations: author.innovations
        }
      }))
    },
    {
      id: 'terms',
      title: 'Term Frequency',
      items: period.keyTerms.map(term => ({
        id: term.term,
        label: term.term,
        value: term.frequency,
        metadata: {
          greekTerm: term.greekTerm,
          innovation: term.innovation,
          contexts: term.contexts
        }
      }))
    }
  ]

  return (
    <div className="min-h-screen bg-[#0D0D0F] text-[#F5F3EF]">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/5 backdrop-blur-xl border-b border-white/10"
      >
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center space-x-4 mb-6">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </motion.button>
            <div className="flex items-center space-x-3">
              <Clock className="w-8 h-8 text-[#C9A962]" />
              <div>
                <p className="text-sm text-[#7C9885]">Semantic Time Travel</p>
                <p className="text-xs text-[#8B7355]">Watch meanings evolve across centuries</p>
              </div>
            </div>
          </div>

          <div className="flex items-start justify-between">
            <div>
              <motion.h1
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-4xl md:text-5xl font-bold mb-2"
              >
                {period.name}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="text-xl text-[#C9A962] mb-4"
              >
                {period.years}
              </motion.p>
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="text-[#7C9885] max-w-3xl leading-relaxed"
              >
                {period.description}
              </motion.p>
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="hidden md:block bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg p-4"
            >
              <div className="text-center">
                <Calendar className="w-8 h-8 text-[#C9A962] mx-auto mb-2" />
                <p className="text-sm font-medium">{period.years}</p>
                <p className="text-xs text-[#8B7355]">Active Period</p>
              </div>
            </motion.div>
          </div>

          {/* Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex space-x-1 mt-8"
          >
            {[
              { id: 'overview', icon: Eye, label: 'Overview' },
              { id: 'terms', icon: BookOpen, label: 'Key Terms' },
              { id: 'authors', icon: Users, label: 'Authors' },
              { id: 'innovations', icon: Lightbulb, label: 'Innovations' }
            ].map((tab) => (
              <motion.button
                key={tab.id}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveView(tab.id as any)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                  activeView === tab.id
                    ? 'bg-[#C9A962] text-[#0D0D0F]'
                    : 'bg-white/5 hover:bg-white/10'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span className="font-medium">{tab.label}</span>
              </motion.button>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <AnimatePresence mode="wait">
          {activeView === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Timeline */}
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">
                <h2 className="text-2xl font-bold mb-6 flex items-center space-x-2">
                  <Scroll className="w-6 h-6 text-[#C9A962]" />
                  <span>Historical Timeline</span>
                </h2>
                <NarrativeTimeline data={timelineData} />
              </div>

              {/* Multi-Scale View */}
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">
                <h2 className="text-2xl font-bold mb-6 flex items-center space-x-2">
                  <Brain className="w-6 h-6 text-[#C9A962]" />
                  <span>Cultural Analysis</span>
                </h2>
                <MultiScaleView views={scaleViews} />
              </div>

              {/* Comparative Frames */}
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">
                <h2 className="text-2xl font-bold mb-6 flex items-center space-x-2">
                  <TrendingUp className="w-6 h-6 text-[#C9A962]" />
                  <span>Influence Metrics</span>
                </h2>
                <ComparativeFrames frames={comparisonFrames} />
              </div>
            </motion.div>
          )}

          {activeView === 'terms' && (
            <motion.div
              key="terms"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Search and Filters */}
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="w-5 h-5 text-[#7C9885] absolute left-3 top-1/2 transform -translate-y-1/2" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search terms, definitions, or Greek text..."
                      className="w-full bg-white/10 border border-white/20 rounded-lg pl-10 pr-4 py-2 text-[#F5F3EF] placeholder-[#8B7355] focus:outline-none focus:border-[#C9A962]"
                    />
                  </div>
                  <div className="flex space-x-2">
                    {[
                      { id: 'all', label: 'All Terms' },
                      { id: 'innovations', label: 'Innovations' },
                      { id: 'high-frequency', label: 'High Frequency' },
                      { id: 'ethics', label: 'Ethics' },
                      { id: 'metaphysics', label: 'Metaphysics' }
                    ].map((filter) => (
                      <motion.button
                        key={filter.id}
                        whileHover={{ y: -1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedFilter(filter.id)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                          selectedFilter === filter.id
                            ? 'bg-[#C9A962] text-[#0D0D0F]'
                            : 'bg-white/10 hover:bg-white/20'
                        }`}
                      >
                        {filter.label}
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Terms Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <AnimatePresence>
                  {filteredTerms.map((term, index) => (
                    <motion.div
                      key={term.term}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ y: -4, scale: 1.02 }}
                      className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 relative overflow-hidden group"
                    >
                      {term.innovation && (
                        <div className="absolute top-3 right-3">
                          <Sparkles className="w-5 h-5 text-[#C9A962]" />
                        </div>
                      )}

                      <div className="mb-4">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-xl font-bold text-[#F5F3EF] capitalize">
                            {term.term}
                          </h3>
                          <span className="text-lg text-[#C9A962] font-medium">
                            {term.greekTerm}
                          </span>
                        </div>
                        <p className="text-[#7C9885] leading-relaxed">
                          {term.definition}
                        </p>
                      </div>

                      <div className="space-y-3">
                        {/* Frequency */}
                        <div className="flex items-center space-x-2">
                          <Target className="w-4 h-4 text-[#8B7355]" />
                          <span className="text-sm text-[#F5F3EF]">Frequency:</span>
                          <div className="flex-1 bg-white/10 rounded-full h-2">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${term.frequency}%` }}
                              transition={{ delay: 0.5, duration: 1 }}
                              className="bg-[#C9A962] h-2 rounded-full"
                            />
                          </div>
                          <span className="text-sm font-medium text-[#C9A962]">
                            {term.frequency}%
                          </span>
                        </div>

                        {/* Contexts */}
                        <div className="flex flex-wrap gap-2">
                          {term.contexts.map((context, i) => (
                            <span
                              key={i}
                              className="px-2 py-1 bg-white/10 rounded-full text-xs text-[#7C9885]"
                            >
                              {context}
                            </span>
                          ))}
                        </div>

                        {/* Evolution */}
                        <div className="group-hover:opacity-100 opacity-0 transition-opacity">
                          <p className="text-xs text-[#8B7355] mb-2">Semantic Evolution:</p>
                          <div className="flex items-center space-x-2">
                            {term.evolution.map((stage, i) => (
                              <div key={i} className="flex items-center">
                                {i > 0 && <ArrowRight className="w-3 h-3 text-[#7C9885] mx-1" />}
                                <span className="text-xs bg-white/5 px-2 py-1 rounded">
                                  {stage}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {filteredTerms.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12"
                >
                  <Search className="w-16 h-16 text-[#7C9885] mx-auto mb-4 opacity-50" />
                  <h3 className="text-xl font-medium text-[#F5F3EF] mb-2">No Terms Found</h3>
                  <p className="text-[#8B7355]">Try adjusting your search or filter criteria.</p>
                </motion.div>
              )}
            </motion.div>
          )}

          {activeView === 'authors' && (
            <motion.div
              key="authors"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {period.authors.map((author, index) => (
                  <motion.div
                    key={author.id}
                    initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -4, scale: 1.02 }}
                    className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#C9A962]/10 to-transparent rounded-bl-full" />
                    
                    <div className="relative">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-2xl font-bold text-[#F5F3EF] mb-1">
                            {author.name}
                          </h3>
                          <p className="text-[#C9A962] text-lg font-medium mb-2">
                            {author.greekName}
                          </p>
                          <p className="text-sm text-[#7C9885]">
                            {Math.abs(author.timeline.start)}-{Math.abs(author.timeline.end)} BCE
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center space-x-1 mb-1">
                            <Star className="w-4 h-4 text-[#C9A962]" />
                            <span className="text-lg font-bold text-[#F5F3EF]">
                              {author.influence}
                            </span>
                          </div>
                          <p className="text-xs text-[#8B7355]">Influence Score</p>
                        </div>
                      </div>

                      <div className="mb-4">
                        <h4 className="text-sm font-semibold text-[#C9A962] mb-2">Major Works</h4>
                        <div className="space-y-1">
                          {author.works.map((work, i) => (
                            <div key={i} className="flex items-center space-x-2">
                              <BookOpen className="w-3 h-3 text-[#7C9885]" />
                              <span className="text-sm text-[#F5F3EF]">{work}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="text-sm font-semibold text-[#C9A962] mb-2">Key Innovations</h4>
                        <div className="flex flex-wrap gap-2">
                          {author.innovations.map((innovation, i) => (
                            <span
                              key={i}
                              className="px-3 py-1 bg-[#C9A962]/20 border border-[#C9A962]/30 rounded-full text-xs text-[#C9A962] font-medium"
                            >
                              {innovation}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {activeView === 'innovations' && (
            <motion.div
              key="innovations"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">
                <h2 className="text-2xl font-bold mb-6 flex items-center space-x-2">
                  <Zap className="w-6 h-6 text-[#C9A962]" />
                  <span>Semantic Innovations</span>
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {period.semanticInnovations.map((innovation, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.05 }}
                      className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg p-4 hover:border-[#C9A962]/50 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-[#C9A962]/20 rounded-lg flex items-center justify-center">
                          <Lightbulb className="w-5 h-5 text-[#C9A962]" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-[#F5F3EF]">{innovation}</h3>
                          <p className="text-sm text-[#7C9885]">Period Innovation</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Innovation Network */}
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">
                <h3 className="text-xl font-bold mb-4 flex items-center space-x-2">
                  <Network className="w-5 h-5 text-[#C9A962]" />
                  <span>Innovation Network</span>
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {period.keyTerms.filter(t => t.innovation).map((term, index) => (
                    <motion.div
                      key={term.term}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.2 }}
                      className="bg-gradient-to-br from-[#C9A962]/10 to-[#7C9885]/10 border border-[#C9A962]/30 rounded-lg p-4"
                    >
                      <div className="flex items-center space-x-2 mb-3">
                        <Sparkles className="w-4 h-4 text-[#C9A962]" />
                        <h4 className="font-bold text-[#F5F3EF]">{term.term}</h4>
                        <span className="text-[#C9A962]">{term.greekTerm}</span>
                      </div>
                      <p className="text-sm text-[#7C9885] mb-3">{term.definition}</p>
                      <div className="flex flex-wrap gap-1">
                        {term.relatedTerms.slice(0, 3).map((related, i) => (
                          <span
                            key={i}
                            className="px-2 py-1 bg-white/10 rounded text-xs text-[#8B7355]"
                          >
                            {related}
                          </span>
                        ))}
                      </div>
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
