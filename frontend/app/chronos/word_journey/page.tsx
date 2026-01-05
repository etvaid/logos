'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Clock, 
  BookOpen, 
  Search, 
  Filter, 
  ArrowRight, 
  ArrowLeft,
  Play,
  Pause,
  RotateCcw,
  Zap,
  Target,
  Globe,
  Layers,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Sparkles,
  TrendingUp,
  Users,
  Quote,
  Map,
  Coffee
} from 'lucide-react'
import { NarrativeTimeline } from '@/components/innovations/narrative_timeline'
import { MultiScaleView } from '@/components/innovations/multi_scale_view'
import { ComparativeFrames } from '@/components/innovations/comparative_frames'

interface SemanticLayer {
  id: string
  meaning: string
  intensity: number
  dominantGenres: string[]
  keyAuthors: string[]
  culturalContext: string
  examples: {
    text: string
    author: string
    work: string
    translation: string
    significance: string
  }[]
}

interface TemporalPoint {
  year: number
  period: string
  semanticLayers: SemanticLayer[]
  majorTransition?: {
    type: string
    description: string
    catalysts: string[]
  }
}

interface WordEvolution {
  lemma: string
  originalForm: string
  etymology: string
  semanticHistory: TemporalPoint[]
  modernDescendants: {
    language: string
    word: string
    meaning: string
  }[]
}

const ChronosPage: React.FC = () => {
  const [currentWord, setCurrentWord] = useState<string>('λόγος')
  const [selectedYear, setSelectedYear] = useState<number>(500)
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1)
  const [viewMode, setViewMode] = useState<'timeline' | 'layers' | 'comparison'>('timeline')
  const [selectedLayers, setSelectedLayers] = useState<string[]>([])
  const [evolutionData, setEvolutionData] = useState<WordEvolution | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [showFilters, setShowFilters] = useState<boolean>(false)
  const [comparisonWords, setComparisonWords] = useState<string[]>(['λόγος', 'φύσις'])
  const timelineRef = useRef<HTMLDivElement>(null)
  const playbackRef = useRef<NodeJS.Timeout | null>(null)

  // Mock data - in real implementation, this would come from API
  const mockEvolutionData: WordEvolution = {
    lemma: 'λόγος',
    originalForm: 'ΛΟΓΟΣ',
    etymology: 'From PIE *leg- "to collect, gather" → λέγω "to speak, say"',
    semanticHistory: [
      {
        year: -800,
        period: 'Archaic Epic',
        semanticLayers: [
          {
            id: 'speech_act',
            meaning: 'Spoken word, utterance',
            intensity: 0.9,
            dominantGenres: ['Epic', 'Hymns'],
            keyAuthors: ['Homer', 'Hesiod'],
            culturalContext: 'Oral culture where spoken word has divine power',
            examples: [
              {
                text: 'μῦθον ἢ λόγον τιν᾽ εἰπεῖν',
                author: 'Homer',
                work: 'Iliad 15.393',
                translation: 'to speak some story or word',
                significance: 'Early pairing with μῦθος, showing overlap in meaning'
              }
            ]
          }
        ]
      },
      {
        year: -500,
        period: 'Classical Philosophy',
        majorTransition: {
          type: 'Philosophical Abstraction',
          description: 'Transition from concrete speech to abstract principle',
          catalysts: ['Heraclitean cosmology', 'Sophistical rhetoric', 'Platonic dialectic']
        },
        semanticLayers: [
          {
            id: 'cosmic_principle',
            meaning: 'Universal organizing principle',
            intensity: 0.8,
            dominantGenres: ['Philosophy', 'Natural philosophy'],
            keyAuthors: ['Heraclitus', 'Anaxagoras'],
            culturalContext: 'Emergence of rational cosmology',
            examples: [
              {
                text: 'τοῦ δὲ λόγου τοῦδε ἐόντος ἀεὶ ἀξύνετοι γίνονται ἄνθρωποι',
                author: 'Heraclitus',
                work: 'Fr. 1 DK',
                translation: 'Of this Logos which is eternally valid humans prove to be ignorant',
                significance: 'First use of logos as cosmic organizing principle'
              }
            ]
          },
          {
            id: 'reasoned_speech',
            meaning: 'Rational discourse, argument',
            intensity: 0.7,
            dominantGenres: ['Rhetoric', 'Dialectic'],
            keyAuthors: ['Plato', 'Sophists'],
            culturalContext: 'Democratic debate culture, sophisticated education',
            examples: [
              {
                text: 'λόγον δοῦναι καὶ δέξασθαι',
                author: 'Plato',
                work: 'Phaedo 76b',
                translation: 'to give and receive an account',
                significance: 'Technical philosophical usage for rational justification'
              }
            ]
          }
        ]
      },
      {
        year: -300,
        period: 'Hellenistic Systems',
        semanticLayers: [
          {
            id: 'stoic_reason',
            meaning: 'Divine rational principle pervading cosmos',
            intensity: 0.9,
            dominantGenres: ['Stoic philosophy', 'Physics'],
            keyAuthors: ['Chrysippus', 'Cleanthes'],
            culturalContext: 'Hellenistic cosmopolitanism, divine providence',
            examples: [
              {
                text: 'ὁ κοινὸς λόγος, ὅς ἐστι νόμος',
                author: 'Chrysippus',
                work: 'SVF 2.528',
                translation: 'the common logos, which is law',
                significance: 'Identification of logos with natural law and fate'
              }
            ]
          }
        ]
      },
      {
        year: 100,
        period: 'Early Christian',
        majorTransition: {
          type: 'Theological Personification',
          description: 'Logos becomes divine person, Word of God',
          catalysts: ['Johannine theology', 'Hellenistic Judaism', 'Christological development']
        },
        semanticLayers: [
          {
            id: 'divine_word',
            meaning: 'Divine Word, Second Person of Trinity',
            intensity: 1.0,
            dominantGenres: ['Gospel', 'Theology', 'Apologetics'],
            keyAuthors: ['John', 'Justin Martyr', 'Origen'],
            culturalContext: 'Christian theological development, Greco-Roman mission',
            examples: [
              {
                text: 'ἐν ἀρχῇ ἦν ὁ λόγος, καὶ ὁ λόγος ἦν πρὸς τὸν θεόν',
                author: 'John',
                work: 'Gospel 1:1',
                translation: 'In the beginning was the Word, and the Word was with God',
                significance: 'Revolutionary personification of logos as divine being'
              }
            ]
          }
        ]
      }
    ],
    modernDescendants: [
      { language: 'English', word: 'logic', meaning: 'reasoning' },
      { language: 'English', word: 'logos', meaning: 'divine word' },
      { language: 'Latin', word: 'ratio', meaning: 'reason' },
      { language: 'Arabic', word: 'kalima', meaning: 'word' },
      { language: 'German', word: 'Wort', meaning: 'word' }
    ]
  }

  useEffect(() => {
    const loadEvolutionData = async () => {
      setIsLoading(true)
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      setEvolutionData(mockEvolutionData)
      setIsLoading(false)
    }
    
    loadEvolutionData()
  }, [currentWord])

  useEffect(() => {
    if (isPlaying && evolutionData) {
      playbackRef.current = setInterval(() => {
        setSelectedYear(prev => {
          const nextYear = prev + (50 * playbackSpeed)
          const maxYear = Math.max(...evolutionData.semanticHistory.map(p => p.year))
          return nextYear > maxYear ? evolutionData.semanticHistory[0].year : nextYear
        })
      }, 1000)
    } else if (playbackRef.current) {
      clearInterval(playbackRef.current)
      playbackRef.current = null
    }

    return () => {
      if (playbackRef.current) {
        clearInterval(playbackRef.current)
      }
    }
  }, [isPlaying, playbackSpeed, evolutionData])

  const getCurrentSemanticState = () => {
    if (!evolutionData) return null
    
    // Find the closest temporal point
    const relevantPoint = evolutionData.semanticHistory
      .filter(p => p.year <= selectedYear)
      .sort((a, b) => b.year - a.year)[0]
    
    return relevantPoint
  }

  const handleTimelineNavigation = (direction: 'prev' | 'next') => {
    if (!evolutionData) return
    
    const years = evolutionData.semanticHistory.map(p => p.year).sort((a, b) => a - b)
    const currentIndex = years.findIndex(year => year >= selectedYear)
    
    if (direction === 'prev' && currentIndex > 0) {
      setSelectedYear(years[currentIndex - 1])
    } else if (direction === 'next' && currentIndex < years.length - 1) {
      setSelectedYear(years[currentIndex + 1])
    }
  }

  const toggleLayerSelection = (layerId: string) => {
    setSelectedLayers(prev => 
      prev.includes(layerId) 
        ? prev.filter(id => id !== layerId)
        : [...prev, layerId]
    )
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
            className="w-16 h-16 mx-auto mb-4 border-2 border-[#C9A962] border-t-transparent rounded-full"
          />
          <p className="text-[#F5F3EF] text-lg">Traveling through semantic time...</p>
          <motion.div className="flex justify-center space-x-1 mt-4">
            {[0, 1, 2].map(i => (
              <motion.div
                key={i}
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                className="w-2 h-2 bg-[#7C9885] rounded-full"
              />
            ))}
          </motion.div>
        </motion.div>
      </div>
    )
  }

  const currentState = getCurrentSemanticState()

  return (
    <div className="min-h-screen bg-[#0D0D0F] text-[#F5F3EF]">
      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/10"
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="flex items-center space-x-3"
              >
                <Clock className="w-8 h-8 text-[#C9A962]" />
                <div>
                  <h1 className="text-2xl font-bold text-[#C9A962]">CHRONOS</h1>
                  <p className="text-sm text-[#7C9885]">Watch meanings evolve across centuries</p>
                </div>
              </motion.div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#7C9885]" />
                <input
                  type="text"
                  placeholder="Search word..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-[#F5F3EF] placeholder-[#7C9885] focus:border-[#C9A962] focus:outline-none"
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowFilters(!showFilters)}
                className="p-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10"
              >
                <Filter className="w-4 h-4" />
              </motion.button>
            </div>
          </div>

          {/* Current Word Display */}
          <motion.div 
            layout
            className="mt-6 p-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-[#C9A962]">{evolutionData?.lemma}</h2>
                <p className="text-[#7C9885] mt-1">{evolutionData?.originalForm}</p>
                <p className="text-sm text-[#F5F3EF]/70 mt-2">{evolutionData?.etymology}</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-[#C9A962]">
                  {selectedYear < 0 ? `${Math.abs(selectedYear)} BCE` : `${selectedYear} CE`}
                </div>
                <div className="text-[#7C9885]">{currentState?.period}</div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.header>

      {/* View Mode Selector */}
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex space-x-2">
          {[
            { mode: 'timeline', label: 'Timeline Journey', icon: Clock },
            { mode: 'layers', label: 'Semantic Layers', icon: Layers },
            { mode: 'comparison', label: 'Word Comparison', icon: Target }
          ].map(({ mode, label, icon: Icon }) => (
            <motion.button
              key={mode}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setViewMode(mode as any)}
              className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors ${
                viewMode === mode
                  ? 'bg-[#C9A962] text-black'
                  : 'bg-white/5 border border-white/10 hover:bg-white/10'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{label}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 pb-12">
        <AnimatePresence mode="wait">
          {viewMode === 'timeline' && (
            <motion.div
              key="timeline"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              className="space-y-6"
            >
              {/* Timeline Controls */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleTimelineNavigation('prev')}
                    className="p-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="p-3 bg-[#C9A962] text-black rounded-lg hover:bg-[#B8984E]"
                  >
                    {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleTimelineNavigation('next')}
                    className="p-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                      setSelectedYear(evolutionData?.semanticHistory[0].year || -800)
                      setIsPlaying(false)
                    }}
                    className="p-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </motion.button>
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-[#7C9885]">Speed:</span>
                  {[0.5, 1, 2, 4].map(speed => (
                    <motion.button
                      key={speed}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setPlaybackSpeed(speed)}
                      className={`px-2 py-1 text-xs rounded ${
                        playbackSpeed === speed
                          ? 'bg-[#C9A962] text-black'
                          : 'bg-white/5 hover:bg-white/10'
                      }`}
                    >
                      {speed}×
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Narrative Timeline */}
              <NarrativeTimeline
                timePoints={evolutionData?.semanticHistory.map(point => ({
                  year: point.year,
                  period: point.period,
                  title: point.majorTransition?.type || point.period,
                  description: point.majorTransition?.description || 
                    `${point.semanticLayers.length} semantic layer${point.semanticLayers.length > 1 ? 's' : ''} active`,
                  significance: point.semanticLayers.map(layer => layer.meaning).join('; '),
                  keyFigures: point.semanticLayers.flatMap(layer => layer.keyAuthors),
                  culturalContext: point.semanticLayers[0]?.culturalContext || '',
                  isTransition: !!point.majorTransition
                })) || []}
                currentYear={selectedYear}
                onYearSelect={setSelectedYear}
              />

              {/* Current Semantic State */}
              {currentState && (
                <motion.div
                  layout
                  className="grid grid-cols-1 lg:grid-cols-2 gap-6"
                >
                  {/* Meanings Panel */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6"
                  >
                    <h3 className="text-xl font-bold text-[#C9A962] mb-4 flex items-center">
                      <Sparkles className="w-5 h-5 mr-2" />
                      Active Meanings
                    </h3>
                    <div className="space-y-4">
                      {currentState.semanticLayers.map((layer, index) => (
                        <motion.div
                          key={layer.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="p-4 bg-white/5 rounded-lg border-l-4 border-[#C9A962]"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-[#F5F3EF]">{layer.meaning}</h4>
                            <div className="flex items-center space-x-2">
                              <div className="w-2 h-2 bg-[#C9A962] rounded-full opacity-75" 
                                   style={{ opacity: layer.intensity }} />
                              <span className="text-xs text-[#7C9885]">
                                {Math.round(layer.intensity * 100)}%
                              </span>
                            </div>
                          </div>
                          <p className="text-sm text-[#7C9885] mb-3">{layer.culturalContext}</p>
                          <div className="flex flex-wrap gap-2">
                            {layer.keyAuthors.slice(0, 3).map(author => (
                              <span key={author} 
                                    className="px-2 py-1 text-xs bg-[#7C9885]/20 text-[#7C9885] rounded">
                                {author}
                              </span>
                            ))}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>

                  {/* Examples Panel */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6"
                  >
                    <h3 className="text-xl font-bold text-[#C9A962] mb-4 flex items-center">
                      <Quote className="w-5 h-5 mr-2" />
                      Key Passages
                    </h3>
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {currentState.semanticLayers.flatMap(layer => layer.examples).map((example, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="p-4 bg-white/5 rounded-lg"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <Users className="w-4 h-4 text-[#7C9885]" />
                              <span className="font-medium text-[#F5F3EF]">{example.author}</span>
                              <span className="text-sm text-[#7C9885]">•</span>
                              <span className="text-sm text-[#7C9885]">{example.work}</span>
                            </div>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              className="p-1 hover:bg-white/10 rounded"
                            >
                              <ExternalLink className="w-3 h-3 text-[#7C9885]" />
                            </motion.button>
                          </div>
                          <div className="mb-3">
                            <p className="font-mono text-sm text-[#C9A962] mb-1">{example.text}</p>
                            <p className="text-sm text-[#F5F3EF] italic">"{example.translation}"</p>
                          </div>
                          <p className="text-xs text-[#7C9885]">{example.significance}</p>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                </motion.div>
              )}

              {/* Transition Highlights */}
              {currentState?.majorTransition && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-gradient-to-r from-[#C9A962]/20 to-[#7C9885]/20 backdrop-blur-xl border border-[#C9A962]/30 rounded-xl p-6"
                >
                  <div className="flex items-center mb-4">
                    <Zap className="w-6 h-6 text-[#C9A962] mr-3" />
                    <h3 className="text-xl font-bold text-[#C9A962]">Major Transition: {currentState.majorTransition.type}</h3>
                  </div>
                  <p className="text-[#F5F3EF] mb-4">{currentState.majorTransition.description}</p>
                  <div>
                    <h4 className="font-semibold text-[#7C9885] mb-2">Key Catalysts:</h4>
                    <div className="flex flex-wrap gap-2">
                      {currentState.majorTransition.catalysts.map(catalyst => (
                        <span key={catalyst} 
                              className="px-3 py-1 bg-[#C9A962]/20 text-[#C9A962] rounded-full text-sm">
                          {catalyst}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}

          {viewMode === 'layers' && (
            <motion.div
              key="layers"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
            >
              <MultiScaleView
                data={evolutionData?.semanticHistory.map(point => ({
                  id: point.period,
                  label: point.period,
                  value: point.year,
                  children: point.semanticLayers.map(layer => ({
                    id: layer.id,
                    label: layer.meaning,
                    value: layer.intensity,
                    metadata: {
                      authors: layer.keyAuthors,
                      genres: layer.dominantGenres,
                      context: layer.culturalContext
                    }
                  }))
                })) || []}
                selectedItems={selectedLayers}
                onSelectionChange={setSelectedLayers}
                colorScheme={{
                  primary: '#C9A962',
                  secondary: '#7C9885',
                  accent: '#8B7355'
                }}
              />
            </motion.div>
          )}

          {viewMode === 'comparison' && (
            <motion.div
              key="comparison"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
            >
              <ComparativeFrames
                items={comparisonWords.map(word => ({
                  id: word,
                  title: word,
                  subtitle: `Evolution from ${evolutionData?.semanticHistory[0]?.year} to ${evolutionData?.semanticHistory[evolutionData.semanticHistory.length - 1]?.year}`,
                  data: evolutionData?.semanticHistory || [],
                  metadata: {
                    totalMeanings: evolutionData?.semanticHistory.reduce((acc, p) => acc + p.semanticLayers.length, 0) || 0,
                    keyPeriods: evolutionData?.semanticHistory.map(p => p.period) || [],
                    modernDescendants: evolutionData?.modernDescendants.length || 0
                  }
                }))}
                onItemSelect={(itemId) => setCurrentWord(itemId)}
                viewOptions={['semantic', 'chronological', 'cultural']}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Floating Action Button */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1 }}
        className="fixed bottom-6 right-6"
      >
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="w-14 h-14 bg-[#C9A962] text-black rounded-full shadow-lg flex items-center justify-center"
        >
          <Coffee className="w-6 h-6" />
        </motion.button>
      </motion.div>
    </div>
  )
}

export default ChronosPage
