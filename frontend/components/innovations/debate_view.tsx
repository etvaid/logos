'use client'

import React, { useState, useCallback, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Scale, 
  Users, 
  Quote, 
  Clock, 
  Filter, 
  ChevronLeft, 
  ChevronRight,
  TrendingUp,
  BookOpen,
  Sparkles,
  Eye,
  Calendar,
  Shuffle
} from 'lucide-react'

// TypeScript Interfaces
interface DebateData {
  id: string
  question: string
  description: string
  confidence: number
  positions: Position[]
  timeline: TimelineEntry[]
  genreBreakdown: GenreData[]
  metadata: {
    totalAuthors: number
    totalPassages: number
    dateRange: [number, number]
    lastUpdated: string
  }
}

interface Position {
  id: string
  label: string
  title: string
  description: string
  percentage: number
  confidence: number
  authors: AuthorPosition[]
  quotes: Quote[]
  keyArguments: string[]
  evolution: PositionEvolution[]
}

interface AuthorPosition {
  author: Author
  confidence: number
  passageCount: number
  keyWorks: Work[]
  strength: 'strong' | 'moderate' | 'weak'
}

interface Author {
  id: string
  name: string
  nameGreek?: string
  dates: [number, number]
  school: string
  avatar?: string
  color: string
}

interface Quote {
  id: string
  text: string
  textGreek?: string
  author: Author
  work: Work
  passage: string
  context: string
  relevanceScore: number
  sentiment: number
}

interface Work {
  id: string
  title: string
  titleGreek?: string
  author: Author
  genre: string
  dateComposed: number
}

interface TimelineEntry {
  period: string
  dateRange: [number, number]
  distribution: Record<string, number>
  significantEvents: string[]
}

interface GenreData {
  genre: string
  distribution: Record<string, number>
  totalWorks: number
  examples: Work[]
}

interface DebateFilters {
  timeRange: [number, number]
  genres: string[]
  schools: string[]
  minConfidence: number
  showOnlyStrongPositions: boolean
}

interface PositionEvolution {
  period: string
  percentage: number
  keyDevelopments: string[]
}

interface DebateViewProps {
  debateId?: string
  initialFilters?: Partial<DebateFilters>
  onAuthorClick?: (author: Author) => void
  onQuoteClick?: (quote: Quote) => void
  className?: string
  // Additional props for flexibility
  data?: any
  onArgumentSelect?: (arg: any) => void
  participants?: string[]
  topic?: string
  arguments?: any[]
  debate?: any
  onPositionSelect?: (position: any) => void
  mainPosition?: string
  counterArguments?: any[]
  sources?: any[]
}

// Mock data for demonstration
const mockDebateData: DebateData = {
  id: 'free-will-determinism',
  question: 'Do humans possess free will, or are all actions determined by fate and necessity?',
  description: 'The fundamental question of human agency that divided ancient philosophers across all schools of thought.',
  confidence: 0.92,
  positions: [
    {
      id: 'determinism',
      label: 'Position A',
      title: 'Hard Determinism',
      description: 'All events, including human actions, are the result of prior causes and natural necessity.',
      percentage: 45,
      confidence: 0.88,
      authors: [
        {
          author: {
            id: 'chrysippus',
            name: 'Chrysippus of Soli',
            nameGreek: 'Χρύσιππος ὁ Σολεύς',
            dates: [-279, -206],
            school: 'Stoic',
            color: '#C9A962'
          },
          confidence: 0.95,
          passageCount: 47,
          keyWorks: [],
          strength: 'strong'
        },
        {
          author: {
            id: 'cleanthes',
            name: 'Cleanthes of Assos',
            nameGreek: 'Κλεάνθης ὁ Ἀσσώς',
            dates: [-330, -230],
            school: 'Stoic',
            color: '#7C9885'
          },
          confidence: 0.87,
          passageCount: 23,
          keyWorks: [],
          strength: 'strong'
        },
        {
          author: {
            id: 'democritus',
            name: 'Democritus of Abdera',
            nameGreek: 'Δημόκριτος',
            dates: [-460, -370],
            school: 'Atomist',
            color: '#8B7355'
          },
          confidence: 0.91,
          passageCount: 31,
          keyWorks: [],
          strength: 'strong'
        }
      ],
      quotes: [
        {
          id: 'chrysippus-1',
          text: 'Everything happens according to fate, and nothing can alter the course of destiny.',
          textGreek: 'πάντα κατὰ εἱμαρμένην γίνεται',
          author: {
            id: 'chrysippus',
            name: 'Chrysippus',
            dates: [-279, -206],
            school: 'Stoic',
            color: '#C9A962'
          },
          work: {
            id: 'on-fate',
            title: 'On Fate',
            author: {
              id: 'chrysippus',
              name: 'Chrysippus',
              dates: [-279, -206],
              school: 'Stoic',
              color: '#C9A962'
            },
            genre: 'Philosophy',
            dateComposed: -240
          },
          passage: 'Fragment 574',
          context: 'Defending Stoic determinism',
          relevanceScore: 0.96,
          sentiment: 0.9
        },
        {
          id: 'democritus-1',
          text: 'Everything existing in the universe is the fruit of chance and necessity.',
          author: {
            id: 'democritus',
            name: 'Democritus',
            dates: [-460, -370],
            school: 'Atomist',
            color: '#8B7355'
          },
          work: {
            id: 'great-world-system',
            title: 'Great World-System',
            author: {
              id: 'democritus',
              name: 'Democritus',
              dates: [-460, -370],
              school: 'Atomist',
              color: '#8B7355'
            },
            genre: 'Physics',
            dateComposed: -420
          },
          passage: 'Fragment 2',
          context: 'On atomic causation',
          relevanceScore: 0.89,
          sentiment: 0.8
        }
      ],
      keyArguments: [
        'Causal determinism governs all events',
        'Human actions follow natural laws',
        'Free will is an illusion of ignorance'
      ],
      evolution: []
    },
    {
      id: 'libertarian',
      label: 'Position B',
      title: 'Libertarian Free Will',
      description: 'Humans possess genuine agency and can make choices independent of prior causes.',
      percentage: 35,
      confidence: 0.82,
      authors: [
        {
          author: {
            id: 'aristotle',
            name: 'Aristotle of Stagira',
            nameGreek: 'Ἀριστοτέλης',
            dates: [-384, -322],
            school: 'Peripatetic',
            color: '#C9A962'
          },
          confidence: 0.78,
          passageCount: 52,
          keyWorks: [],
          strength: 'moderate'
        },
        {
          author: {
            id: 'epicurus',
            name: 'Epicurus of Samos',
            nameGreek: 'Ἐπίκουρος',
            dates: [-341, -270],
            school: 'Epicurean',
            color: '#7C9885'
          },
          confidence: 0.85,
          passageCount: 29,
          keyWorks: [],
          strength: 'strong'
        }
      ],
      quotes: [
        {
          id: 'aristotle-1',
          text: 'The origin of action is choice, and choice is deliberate desire.',
          textGreek: 'ἀρχὴ δὲ πράξεως προαίρεσις',
          author: {
            id: 'aristotle',
            name: 'Aristotle',
            dates: [-384, -322],
            school: 'Peripatetic',
            color: '#C9A962'
          },
          work: {
            id: 'nicomachean-ethics',
            title: 'Nicomachean Ethics',
            author: {
              id: 'aristotle',
              name: 'Aristotle',
              dates: [-384, -322],
              school: 'Peripatetic',
              color: '#C9A962'
            },
            genre: 'Ethics',
            dateComposed: -350
          },
          passage: 'VI.2',
          context: 'On moral responsibility',
          relevanceScore: 0.93,
          sentiment: 0.7
        }
      ],
      keyArguments: [
        'Deliberation enables genuine choice',
        'Moral responsibility requires freedom',
        'Human agency transcends mechanism'
      ],
      evolution: []
    },
    {
      id: 'compatibilism',
      label: 'Position C',
      title: 'Compatibilism',
      description: 'Free will and determinism can coexist through proper understanding of both concepts.',
      percentage: 20,
      confidence: 0.71,
      authors: [
        {
          author: {
            id: 'alexander',
            name: 'Alexander of Aphrodisias',
            nameGreek: 'Ἀλέξανδρος ὁ Ἀφροδισιεύς',
            dates: [150, 215],
            school: 'Peripatetic',
            color: '#8B7355'
          },
          confidence: 0.74,
          passageCount: 18,
          keyWorks: [],
          strength: 'moderate'
        }
      ],
      quotes: [
        {
          id: 'alexander-1',
          text: 'What is up to us operates within the realm of what is fated, not against it.',
          author: {
            id: 'alexander',
            name: 'Alexander of Aphrodisias',
            dates: [150, 215],
            school: 'Peripatetic',
            color: '#8B7355'
          },
          work: {
            id: 'on-fate',
            title: 'On Fate',
            author: {
              id: 'alexander',
              name: 'Alexander of Aphrodisias',
              dates: [150, 215],
              school: 'Peripatetic',
              color: '#8B7355'
            },
            genre: 'Philosophy',
            dateComposed: 200
          },
          passage: 'Chapter 14',
          context: 'Reconciling freedom and fate',
          relevanceScore: 0.81,
          sentiment: 0.3
        }
      ],
      keyArguments: [
        'Freedom operates within necessity',
        'Different kinds of causation exist',
        'Agency emerges from deterministic processes'
      ],
      evolution: []
    }
  ],
  timeline: [
    {
      period: 'Pre-Socratic',
      dateRange: [-600, -400],
      distribution: {
        'determinism': 70,
        'libertarian': 20,
        'compatibilism': 10
      },
      significantEvents: ['Atomistic theories emerge', 'Natural philosophy develops']
    },
    {
      period: 'Classical',
      dateRange: [-400, -323],
      distribution: {
        'determinism': 40,
        'libertarian': 45,
        'compatibilism': 15
      },
      significantEvents: ['Aristotelian ethics', 'Stoic school founded']
    },
    {
      period: 'Hellenistic',
      dateRange: [-323, -146],
      distribution: {
        'determinism': 55,
        'libertarian': 30,
        'compatibilism': 15
      },
      significantEvents: ['Stoic determinism refined', 'Epicurean response']
    }
  ],
  genreBreakdown: [
    {
      genre: 'Ethics',
      distribution: {
        'determinism': 35,
        'libertarian': 50,
        'compatibilism': 15
      },
      totalWorks: 23,
      examples: []
    },
    {
      genre: 'Physics',
      distribution: {
        'determinism': 65,
        'libertarian': 25,
        'compatibilism': 10
      },
      totalWorks: 18,
      examples: []
    }
  ],
  metadata: {
    totalAuthors: 47,
    totalPassages: 234,
    dateRange: [-600, 300],
    lastUpdated: '2024-01-15'
  }
}

// DebateQuestion Component
export const DebateQuestion: React.FC<{ debate: DebateData }> = ({ debate }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center mb-8"
    >
      <div className="flex items-center justify-center gap-3 mb-4">
        <Scale className="w-8 h-8 text-[#C9A962]" />
        <motion.div
          className="flex items-center gap-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full px-4 py-2"
          whileHover={{ scale: 1.05 }}
        >
          <Sparkles className="w-4 h-4 text-[#C9A962]" />
          <span className="text-sm text-[#7C9885]">
            AI Confidence: {Math.round(debate.confidence * 100)}%
          </span>
        </motion.div>
      </div>
      
      <h1 className="text-3xl font-bold text-[#F5F3EF] mb-4 leading-tight">
        {debate.question}
      </h1>
      
      <p className="text-[#7C9885] text-lg max-w-4xl mx-auto leading-relaxed">
        {debate.description}
      </p>
      
      <div className="flex items-center justify-center gap-6 mt-6 text-sm text-[#8B7355]">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4" />
          <span>{debate.metadata.totalAuthors} authors</span>
        </div>
        <div className="flex items-center gap-2">
          <Quote className="w-4 h-4" />
          <span>{debate.metadata.totalPassages} passages</span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          <span>{Math.abs(debate.metadata.dateRange[0])} BCE - {debate.metadata.dateRange[1]} CE</span>
        </div>
      </div>
    </motion.div>
  )
}

// AuthorCard Component
const AuthorCard: React.FC<{ 
  authorPosition: AuthorPosition
  onClick?: (author: Author) => void 
}> = ({ authorPosition, onClick }) => {
  const { author, confidence, passageCount, strength } = authorPosition
  
  const strengthColors = {
    strong: 'border-[#C9A962] bg-[#C9A962]/10',
    moderate: 'border-[#7C9885] bg-[#7C9885]/10',
    weak: 'border-[#8B7355] bg-[#8B7355]/10'
  }
  
  return (
    <motion.div
      className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 ${strengthColors[strength]}`}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onClick?.(author)}
      layout
    >
      <div className="flex items-center gap-3">
        <div 
          className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm"
          style={{ backgroundColor: author.color }}
        >
          {author.name.split(' ').map(n => n[0]).join('')}
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className="text-[#F5F3EF] font-medium text-sm truncate">
            {author.name}
          </h4>
          <p className="text-[#7C9885] text-xs truncate">
            {author.school} • {Math.abs(author.dates[0])}-{Math.abs(author.dates[1])} BCE
          </p>
        </div>
        
        <div className="text-right">
          <div className="text-[#C9A962] text-xs font-medium">
            {Math.round(confidence * 100)}%
          </div>
          <div className="text-[#8B7355] text-xs">
            {passageCount} passages
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// QuoteCard Component  
const QuoteCard: React.FC<{ 
  quote: Quote
  onClick?: (quote: Quote) => void 
}> = ({ quote, onClick }) => {
  return (
    <motion.div
      className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg p-4 cursor-pointer"
      whileHover={{ scale: 1.02, borderColor: 'rgba(201, 169, 98, 0.3)' }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onClick?.(quote)}
      layout
    >
      <div className="flex items-start gap-3 mb-3">
        <Quote className="w-4 h-4 text-[#C9A962] mt-1 flex-shrink-0" />
        <blockquote className="text-[#F5F3EF] text-sm leading-relaxed italic">
          "{quote.text}"
        </blockquote>
      </div>
      
      {quote.textGreek && (
        <div className="text-[#7C9885] text-xs mb-3 font-serif">
          {quote.textGreek}
        </div>
      )}
      
      <div className="flex items-center justify-between">
        <div>
          <div className="text-[#C9A962] text-xs font-medium">
            {quote.author.name}
          </div>
          <div className="text-[#8B7355] text-xs">
            {quote.work.title} {quote.passage}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#C9A962]" 
               style={{ opacity: quote.relevanceScore }} />
          <span className="text-[#7C9885] text-xs">
            {Math.round(quote.relevanceScore * 100)}%
          </span>
        </div>
      </div>
    </motion.div>
  )
}

// QuoteCarousel Component
const QuoteCarousel: React.FC<{ 
  quotes: Quote[]
  onQuoteClick?: (quote: Quote) => void 
}> = ({ quotes, onQuoteClick }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoRotating, setIsAutoRotating] = useState(true)
  
  useEffect(() => {
    if (!isAutoRotating || quotes.length <= 1) return
    
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % quotes.length)
    }, 4000)
    
    return () => clearInterval(interval)
  }, [quotes.length, isAutoRotating])
  
  const nextQuote = useCallback(() => {
    setCurrentIndex(prev => (prev + 1) % quotes.length)
    setIsAutoRotating(false)
  }, [quotes.length])
  
  const prevQuote = useCallback(() => {
    setCurrentIndex(prev => (prev - 1 + quotes.length) % quotes.length)
    setIsAutoRotating(false)
  }, [quotes.length])
  
  if (quotes.length === 0) {
    return (
      <div className="text-center py-8 text-[#8B7355]">
        <Quote className="w-8 h-8 mx-auto mb-2 opacity-50" />
        <p>No quotes available</p>
      </div>
    )
  }
  
  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Quote className="w-4 h-4 text-[#C9A962]" />
          <span className="text-[#7C9885] text-sm">Key Quotes</span>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAutoRotating(!isAutoRotating)}
            className="p-1 rounded text-[#8B7355] hover:text-[#C9A962] transition-colors"
          >
            <Shuffle className={`w-4 h-4 ${isAutoRotating ? 'text-[#C9A962]' : ''}`} />
          </button>
          
          <div className="flex items-center gap-1">
            <button
              onClick={prevQuote}
              className="p-1 rounded text-[#8B7355] hover:text-[#C9A962] transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs text-[#8B7355] mx-2">
              {currentIndex + 1}/{quotes.length}
            </span>
            <button
              onClick={nextQuote}
              className="p-1 rounded text-[#8B7355] hover:text-[#C9A962] transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
      
      <div className="relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <QuoteCard 
              quote={quotes[currentIndex]} 
              onClick={onQuoteClick}
            />
          </motion.div>
        </AnimatePresence>
      </div>
      
      <div className="flex justify-center mt-3 gap-1">
        {quotes.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setCurrentIndex(index)
              setIsAutoRotating(false)
            }}
            className={`w-2 h-2 rounded-full transition-all duration-200 ${
              index === currentIndex 
                ? 'bg-[#C9A962]' 
                : 'bg-white/20 hover:bg-white/40'
            }`}
          />
        ))}
      </div>
    </div>
  )
}

// PositionColumn Component
const PositionColumn: React.FC<{ 
  position: Position
  totalAuthors: number
  isHighlighted?: boolean
  onAuthorClick?: (author: Author) => void
  onQuoteClick?: (quote: Quote) => void 
}> = ({ position, totalAuthors, isHighlighted, onAuthorClick, onQuoteClick }) => {
  const [sortBy, setSortBy] = useState<'confidence' | 'chronological' | 'influence'>('confidence')
  
  const sortedAuthors = useMemo(() => {
    return [...position.authors].sort((a, b) => {
      switch (sortBy) {
        case 'confidence':
          return b.confidence - a.confidence
        case 'chronological':
          return a.author.dates[0] - b.author.dates[0]
        case 'influence':
          return b.passageCount - a.passageCount
        default:
          return 0
      }
    })
  }, [position.authors, sortBy])
  
  return (
    <motion.div
      className={`bg-white/5 backdrop-blur-xl border rounded-xl p-6 transition-all duration-300 ${
        isHighlighted 
          ? 'border-[#C9A962] shadow-lg shadow-[#C9A962]/10' 
          : 'border-white/10'
      }`}
      whileHover={{ scale: 1.01 }}
      layout
    >
      {/* Position Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="text-[#8B7355] text-sm font-medium">
            {position.label}
          </div>
          <div className="flex-1 h-px bg-white/10" />
          <div className="text-[#C9A962] text-sm font-bold">
            {position.percentage}%
          </div>
        </div>
        
        <h3 className="text-[#F5F3EF] text-xl font-bold mb-2">
          {position.title}
        </h3>
        
        <p className="text-[#7C9885] text-sm leading-relaxed mb-4">
          {position.description}
        </p>
        
        <div className="flex items-center gap-4 text-xs text-[#8B7355]">
          <div className="flex items-center gap-1">
            <Users className="w-3 h-3" />
            <span>{position.authors.length} authors</span>
          </div>
          <div className="flex items-center gap-1">
            <Eye className="w-3 h-3" />
            <span>{Math.round(position.confidence * 100)}% confidence</span>
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="mt-4 h-2 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-[#C9A962] to-[#7C9885]"
            initial={{ width: 0 }}
            animate={{ width: `${position.percentage}%` }}
            transition={{ duration: 1, delay: 0.2 }}
          />
        </div>
      </div>
      
      {/* Author Stack */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-[#C9A962]" />
            <span className="text-[#7C9885] text-sm">Advocates</span>
          </div>
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-white/5 border border-white/10 rounded text-[#F5F3EF] text-xs px-2 py-1"
          >
            <option value="confidence">By Confidence</option>
            <option value="chronological">Chronological</option>
            <option value="influence">By Influence</option>
          </select>
        </div>
        
        <div className="space-y-3">
          <AnimatePresence>
            {sortedAuthors.map((authorPos, index) => (
              <motion.div
                key={authorPos.author.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
              >
                <AuthorCard 
                  authorPosition={authorPos}
                  onClick={onAuthorClick}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
      
      {/* Quote Carousel */}
      <QuoteCarousel 
        quotes={position.quotes}
        onQuoteClick={onQuoteClick}
      />
      
      {/* Key Arguments */}
      <div className="mt-6">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="w-4 h-4 text-[#C9A962]" />
          <span className="text-[#7C9885] text-sm">Key Arguments</span>
        </div>
        
        <div className="space-y-2">
          {position.keyArguments.map((argument, index) => (
            <motion.div
              key={index}
              className="text-[#F5F3EF] text-sm p-2 bg-white/5 rounded border-l-2 border-[#C9A962]"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
            >
              {argument}
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

// VerdictBar Component
const VerdictBar: React.FC<{ 
  positions: Position[]
  onPositionClick?: (position: Position) => void 
}> = ({ positions, onPositionClick }) => {
  return (
    <motion.div
      className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex items-center gap-3 mb-4">
        <Scale className="w-5 h-5 text-[#C9A962]" />
        <h3 className="text-[#F5F3EF] text-lg font-bold">Corpus Distribution</h3>
        <div className="flex-1" />
        <div className="text-[#8B7355] text-sm">
          Based on {positions.reduce((sum, p) => sum + p.authors.length, 0)} authors
        </div>
      </div>
      
      <div className="flex rounded-lg overflow-hidden h-12 mb-4">
        {positions.map((position, index) => (
          <motion.button
            key={position.id}
            className="relative group transition-all duration-200 hover:z-10"
            style={{ 
              flex: position.percentage,
              backgroundColor: `hsl(${45 + index * 60}, 45%, ${50 - index * 10}%)`
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onPositionClick?.(position)}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.3 + index * 0.2 }}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-white font-bold text-sm">
                {position.percentage}%
              </span>
            </div>
            
            <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              {position.title}
            </div>
          </motion.button>
        ))}
      </div>
      
      <div className="grid grid-cols-3 gap-4">
        {positions.map((position, index) => (
          <div key={position.id} className="flex items-center gap-2">
            <div 
              className="w-4 h-4 rounded"
              style={{ backgroundColor: `hsl(${45 + index * 60}, 45%, ${50 - index * 10}%)` }}
            />
            <div>
              <div className="text-[#F5F3EF] text-sm font-medium">
                {position.title}
              </div>
              <div className="text-[#8B7355] text-xs">
                {position.authors.length} authors • {position.percentage}%
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

// TimelineOverlay Component
const TimelineOverlay: React.FC<{ timeline: TimelineEntry[] }> = ({ timeline }) => {
  const [selectedPeriod, setSelectedPeriod] = useState<string | null>(null)
  
  return (
    <motion.div
      className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <div className="flex items-center gap-3 mb-6">
        <Clock className="w-5 h-5 text-[#C9A962]" />
        <h3 className="text-[#F5F3EF] text-lg font-bold">Historical Evolution</h3>
      </div>
      
      <div className="space-y-4">
        {timeline.map((entry, index) => (
          <motion.div
            key={entry.period}
            className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
              selectedPeriod === entry.period
                ? 'border-[#C9A962] bg-[#C9A962]/10'
                : 'border-white/10 hover:border-white/20'
            }`}
            onClick={() => setSelectedPeriod(
              selectedPeriod === entry.period ? null : entry.period
            )}
            whileHover={{ scale: 1.02 }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-[#F5F3EF] font-medium">
                {entry.period} Period
              </h4>
              <span className="text-[#8B7355] text-sm">
                {Math.abs(entry.dateRange[0])}-{Math.abs(entry.dateRange[1])} BCE
              </span>
            </div>
            
            <div className="flex gap-2 mb-2">
              {Object.entries(entry.distribution).map(([positionId, percentage], idx) => (
                <div
                  key={positionId}
                  className="h-2 rounded"
                  style={{
                    flex: percentage,
                    backgroundColor: `hsl(${45 + idx * 60}, 45%, ${50 - idx * 10}%)`
                  }}
                />
              ))}
            </div>
            
            <AnimatePresence>
              {selectedPeriod === entry.period && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="pt-3 border-t border-white/10">
                    <div className="text-[#7C9885] text-sm mb-2">
                      Significant developments:
                    </div>
                    <ul className="space-y-1">
                      {entry.significantEvents.map((event, idx) => (
                        <li key={idx} className="text-[#F5F3EF] text-sm flex items-start gap-2">
                          <div className="w-1 h-1 bg-[#C9A962] rounded-full mt-2 flex-shrink-0" />
                          {event}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

// Main DebateView Component
const DebateView: React.FC<DebateViewProps> = ({
  debateId,
  initialFilters,
  onAuthorClick,
  onQuoteClick,
  className
}) => {
  const [debate, setDebate] = useState<DebateData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [highlightedPosition, setHighlightedPosition] = useState<string | null>(null)
  const [filters, setFilters] = useState<DebateFilters>({
    timeRange: [-800, 500],
    genres: [],
    schools: [],
    minConfidence: 0.3,
    showOnlyStrongPositions: false,
    ...initialFilters
  })
  
  // Simulate loading data
  useEffect(() => {
    const loadDebate = async () => {
      setLoading(true)
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        setDebate(mockDebateData)
      } catch (err) {
        setError('Failed to load debate data')
      } finally {
        setLoading(false)
      }
    }
    
    loadDebate()
  }, [debateId])
  
  const handlePositionClick = useCallback((position: Position) => {
    setHighlightedPosition(
      highlightedPosition === position.id ? null : position.id
    )
  }, [highlightedPosition])
  
  if (loading) {
    return (
      <div className={`min-h-screen bg-[#0D0D0F] p-6 ${className}`}>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-96">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              className="w-8 h-8 border-2 border-[#C9A962] border-t-transparent rounded-full"
            />
            <span className="ml-4 text-[#7C9885]">Loading debate analysis...</span>
          </div>
        </div>
      </div>
    )
  }
  
  if (error || !debate) {
    return (
      <div className={`min-h-screen bg-[#0D0D0F] p-6 ${className}`}>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-96 text-center">
            <div>
              <Scale className="w-12 h-12 text-[#8B7355] mx-auto mb-4 opacity-50" />
              <h2 className="text-[#F5F3EF] text-xl mb-2">Debate Not Found</h2>
              <p className="text-[#7C9885]">
                {error || 'The requested debate could not be loaded.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }
  
  return (
    <div className={`min-h-screen bg-[#0D0D0F] p-6 ${className}`}>
      <div className="max-w-7xl mx-auto">
        <DebateQuestion debate={debate} />
        
        <VerdictBar 
          positions={debate.positions}
          onPositionClick={handlePositionClick}
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {debate.positions.map((position) => (
            <PositionColumn
              key={position.id}
              position={position}
              totalAuthors={debate.metadata.totalAuthors}
              isHighlighted={highlightedPosition === position.id}
              onAuthorClick={onAuthorClick}
              onQuoteClick={onQuoteClick}
            />
          ))}
        </div>
        
        <TimelineOverlay timeline={debate.timeline} />
      </div>
    </div>
  )
}

// Named and default exports for compatibility
export { DebateView }
export default DebateView
