
'use client'

import React, { useState, useEffect, useRef, useMemo } from 'react'
import { motion, AnimatePresence, useAnimation } from 'framer-motion'
import { 
  ChevronLeft, 
  ChevronRight, 
  ZoomIn, 
  ZoomOut, 
  BookOpen, 
  User, 
  Calendar, 
  MapPin, 
  ArrowRight, 
  Sparkles,
  ScrollText,
  Eye,
  EyeOff,
  Search,
  Filter,
  X
} from 'lucide-react'

interface WordMeaning {
  id: string
  word: string
  meaning: string
  definition: string
  date: number
  confidence: 'high' | 'medium' | 'low'
  coordinates: { x: number; y: number }
  parentMeaningId?: string
  tags: string[]
  usage: string
}

interface Author {
  id: string
  name: string
  displayName: string
  lifespan: { birth?: number; death?: number }
  culture: string
  works: Work[]
  significance: number
}

interface Work {
  id: string
  title: string
  date: number
  authorId: string
  passages: Passage[]
  genre: string
}

interface Passage {
  id: string
  text: string
  translation?: string
  workId: string
  reference: string
  meaningIds: string[]
  significance: 'pivotal' | 'supporting' | 'contextual'
  context: string
  author?: string
  work?: string
  date?: string
}

interface Transition {
  id: string
  fromMeaningId: string
  toMeaningId: string
  type: 'evolution' | 'branch' | 'merge' | 'borrowing'
  description: string
  keyPassages: string[]
  confidence: 'high' | 'medium' | 'low'
  catalyst: string
}

interface BranchPoint {
  id: string
  date: number
  parentMeaningId: string
  childMeaningIds: string[]
  description: string
  cause: 'cultural' | 'philosophical' | 'religious' | 'linguistic'
  impact: string
}

interface NarrativeTimelineProps {
  word?: string
  dateRange?: { start: number; end: number }
  onWordChange?: (word: string) => void
  className?: string
  // Additional props for chronos page compatibility
  events?: any[]
  selectedPeriod?: string
  onEventHover?: (event: any) => void
  timelinePosition?: number
  data?: any[]
  currentPeriod?: string
  onSelectEvent?: (event: any) => void
  timePoints?: any[]
  currentYear?: number
  onYearSelect?: (year: number) => void
  currentPosition?: number
  onPositionChange?: (position: number) => void
  renderEvent?: (event: any) => React.ReactNode
  children?: React.ReactNode
  steps?: any[]
  currentStep?: number
  onStepClick?: (stepIndex: number) => void
  onEventClick?: () => void
}

const mockData = {
  meanings: [
    {
      id: 'logos-1',
      word: 'logos',
      meaning: 'word, speech',
      definition: 'Spoken word or discourse in ordinary conversation',
      date: -500,
      confidence: 'high' as const,
      coordinates: { x: 0.2, y: 0.8 },
      tags: ['speech', 'communication'],
      usage: 'Common vernacular usage'
    },
    {
      id: 'logos-2',
      word: 'logos',
      meaning: 'reason, principle',
      definition: 'Universal principle governing cosmos and human reason',
      date: -300,
      confidence: 'high' as const,
      coordinates: { x: 0.35, y: 0.4 },
      parentMeaningId: 'logos-1',
      tags: ['philosophy', 'reason'],
      usage: 'Stoic philosophical discourse'
    },
    {
      id: 'logos-3',
      word: 'logos',
      meaning: 'divine word',
      definition: 'The creative and revelatory Word of God',
      date: 100,
      confidence: 'high' as const,
      coordinates: { x: 0.7, y: 0.2 },
      parentMeaningId: 'logos-2',
      tags: ['theology', 'divine'],
      usage: 'Christian theological writings'
    },
    {
      id: 'logos-4',
      word: 'logos',
      meaning: 'Christ as Word',
      definition: 'Jesus Christ as the incarnate divine Logos',
      date: 200,
      confidence: 'high' as const,
      coordinates: { x: 0.85, y: 0.3 },
      parentMeaningId: 'logos-3',
      tags: ['christology', 'incarnation'],
      usage: 'Patristic theology'
    }
  ],
  authors: [
    {
      id: 'heraclitus',
      name: 'Heraclitus',
      displayName: 'Heraclitus of Ephesus',
      lifespan: { birth: -535, death: -475 },
      culture: 'Greek',
      works: [],
      significance: 0.8
    },
    {
      id: 'stoics',
      name: 'Stoics',
      displayName: 'Stoic Philosophers',
      lifespan: { birth: -300, death: 200 },
      culture: 'Greco-Roman',
      works: [],
      significance: 0.9
    },
    {
      id: 'john-evangelist',
      name: 'John',
      displayName: 'John the Evangelist',
      lifespan: { birth: 10, death: 100 },
      culture: 'Jewish-Christian',
      works: [],
      significance: 1.0
    },
    {
      id: 'church-fathers',
      name: 'Church Fathers',
      displayName: 'Early Church Fathers',
      lifespan: { birth: 100, death: 400 },
      culture: 'Christian',
      works: [],
      significance: 0.85
    }
  ],
  passages: [
    {
      id: 'heraclitus-fragment',
      text: 'τοῦ δὲ λόγου τοῦδε ἐόντος ἀεὶ ἀξύνετοι γίνονται ἄνθρωποι',
      translation: 'Of this Logos, which is always, humans prove to be ignorant',
      workId: 'fragments',
      reference: 'Fragment 1',
      meaningIds: ['logos-1', 'logos-2'],
      significance: 'pivotal' as const,
      context: 'Introduces logos as cosmic principle',
      author: 'Heraclitus',
      work: 'Fragments',
      date: 'c. 500 BCE'
    },
    {
      id: 'john-prologue',
      text: 'Ἐν ἀρχῇ ἦν ὁ λόγος, καὶ ὁ λόγος ἦν πρὸς τὸν θεόν',
      translation: 'In the beginning was the Word, and the Word was with God',
      workId: 'john-gospel',
      reference: 'John 1:1',
      meaningIds: ['logos-3'],
      significance: 'pivotal' as const,
      context: 'Theological redefinition of logos',
      author: 'John the Evangelist',
      work: 'Gospel of John',
      date: 'c. 90 CE'
    },
    {
      id: 'john-incarnation',
      text: 'καὶ ὁ λόγος σὰρξ ἐγένετο καὶ ἐσκήνωσεν ἐν ἡμῖν',
      translation: 'And the Word became flesh and dwelt among us',
      workId: 'john-gospel',
      reference: 'John 1:14',
      meaningIds: ['logos-4'],
      significance: 'pivotal' as const,
      context: 'Incarnational theology',
      author: 'John the Evangelist',
      work: 'Gospel of John',
      date: 'c. 90 CE'
    }
  ],
  transitions: [
    {
      id: 'speech-to-reason',
      fromMeaningId: 'logos-1',
      toMeaningId: 'logos-2',
      type: 'evolution' as const,
      description: 'Philosophical abstraction from speech to cosmic principle',
      keyPassages: ['heraclitus-fragment'],
      confidence: 'high' as const,
      catalyst: 'Pre-Socratic philosophical revolution'
    },
    {
      id: 'reason-to-divine',
      fromMeaningId: 'logos-2',
      toMeaningId: 'logos-3',
      type: 'branch' as const,
      description: 'Theological appropriation of philosophical concept',
      keyPassages: ['john-prologue'],
      confidence: 'high' as const,
      catalyst: 'Johannine theological innovation'
    },
    {
      id: 'divine-to-incarnate',
      fromMeaningId: 'logos-3',
      toMeaningId: 'logos-4',
      type: 'evolution' as const,
      description: 'Christological development of divine Logos',
      keyPassages: ['john-incarnation'],
      confidence: 'high' as const,
      catalyst: 'Early Christian theological development'
    }
  ],
  branchPoints: [
    {
      id: 'philosophical-branch',
      date: -300,
      parentMeaningId: 'logos-1',
      childMeaningIds: ['logos-2'],
      description: 'Philosophical appropriation creates new meaning dimension',
      cause: 'philosophical' as const,
      impact: 'Establishes logos as cosmic principle'
    },
    {
      id: 'theological-branch',
      date: 100,
      parentMeaningId: 'logos-2',
      childMeaningIds: ['logos-3'],
      description: 'Christian theology transforms philosophical concept',
      cause: 'religious' as const,
      impact: 'Creates foundation for Trinitarian theology'
    }
  ]
}

export const TimelineTrack: React.FC<{
  dateRange: { start: number; end: number }
  width: number
  height: number
  onDateHover: (date: number | null) => void
  hoveredDate: number | null
}> = ({ dateRange, width, height, onDateHover, hoveredDate }) => {
  const dateToX = (date: number) => {
    const range = dateRange.end - dateRange.start
    return ((date - dateRange.start) / range) * width
  }

  const majorMarks = []
  const minorMarks = []
  const step = Math.ceil((dateRange.end - dateRange.start) / 8)
  
  for (let date = dateRange.start; date <= dateRange.end; date += step) {
    majorMarks.push(date)
  }
  
  for (let date = dateRange.start; date <= dateRange.end; date += step / 2) {
    if (!majorMarks.includes(date)) {
      minorMarks.push(date)
    }
  }

  const formatDate = (date: number) => {
    return date < 0 ? `${Math.abs(date)} BCE` : `${date} CE`
  }

  return (
    <div className="relative" style={{ width, height }}>
      <svg className="absolute inset-0 pointer-events-none">
        <defs>
          <linearGradient id="timelineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#C9A962" stopOpacity="0.2" />
            <stop offset="50%" stopColor="#C9A962" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#C9A962" stopOpacity="0.2" />
          </linearGradient>
        </defs>
        
        <line
          x1={0}
          y1={height / 2}
          x2={width}
          y2={height / 2}
          stroke="url(#timelineGradient)"
          strokeWidth="3"
        />
        
        {majorMarks.map(date => (
          <g key={date}>
            <line
              x1={dateToX(date)}
              y1={height / 2 - 15}
              x2={dateToX(date)}
              y2={height / 2 + 15}
              stroke="#C9A962"
              strokeWidth="2"
            />
            <text
              x={dateToX(date)}
              y={height / 2 + 35}
              fill="#7C9885"
              fontSize="12"
              textAnchor="middle"
              className="font-light"
            >
              {formatDate(date)}
            </text>
          </g>
        ))}
        
        {minorMarks.map(date => (
          <line
            key={date}
            x1={dateToX(date)}
            y1={height / 2 - 8}
            x2={dateToX(date)}
            y2={height / 2 + 8}
            stroke="#8B7355"
            strokeWidth="1"
            opacity="0.5"
          />
        ))}
        
        {hoveredDate && (
          <motion.g
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <line
              x1={dateToX(hoveredDate)}
              y1={0}
              x2={dateToX(hoveredDate)}
              y2={height}
              stroke="#C9A962"
              strokeWidth="1"
              strokeDasharray="4 4"
              opacity="0.7"
            />
          </motion.g>
        )}
      </svg>
      
      <div
        className="absolute inset-0 cursor-crosshair"
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect()
          const x = e.clientX - rect.left
          const date = dateRange.start + (x / width) * (dateRange.end - dateRange.start)
          onDateHover(Math.round(date))
        }}
        onMouseLeave={() => onDateHover(null)}
      />
    </div>
  )
}

const MeaningNode: React.FC<{
  meaning: WordMeaning
  position: { x: number; y: number }
  isSelected: boolean
  isHighlighted: boolean
  scale: number
  onClick: (meaningId: string) => void
  onHover: (meaningId: string | null) => void
  containerWidth: number
  containerHeight: number
}> = ({ 
  meaning, 
  position, 
  isSelected, 
  isHighlighted, 
  scale, 
  onClick, 
  onHover,
  containerWidth,
  containerHeight 
}) => {
  const controls = useAnimation()
  
  const x = position.x * containerWidth
  const y = position.y * containerHeight
  
  const baseSize = 40 + (meaning.confidence === 'high' ? 20 : meaning.confidence === 'medium' ? 10 : 0)
  const size = baseSize * scale

  const confidenceColors = {
    high: '#C9A962',
    medium: '#7C9885', 
    low: '#8B7355'
  }

  useEffect(() => {
    if (isHighlighted) {
      controls.start({
        scale: [1, 1.2, 1],
        transition: { duration: 0.6, ease: "easeInOut" }
      })
    }
  }, [isHighlighted, controls])

  return (
    <motion.div
      className="absolute cursor-pointer group"
      style={{ 
        left: x - size/2, 
        top: y - size/2,
        width: size,
        height: size
      }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ 
        scale: isSelected ? 1.3 : 1, 
        opacity: 1,
        ...controls
      }}
      whileHover={{ scale: 1.1 }}
      transition={{ 
        type: "spring", 
        stiffness: 260, 
        damping: 20,
        opacity: { duration: 0.3 }
      }}
      onClick={() => onClick(meaning.id)}
      onHoverStart={() => onHover(meaning.id)}
      onHoverEnd={() => onHover(null)}
    >
      <div
        className={`
          w-full h-full rounded-full border-2 backdrop-blur-xl
          flex items-center justify-center relative overflow-hidden
          transition-all duration-300
          ${isSelected 
            ? 'bg-white/20 border-white shadow-2xl shadow-[#C9A962]/30' 
            : 'bg-white/5 border-white/20 hover:bg-white/10 hover:border-white/30'
          }
        `}
        style={{
          borderColor: isSelected ? confidenceColors[meaning.confidence] : undefined
        }}
      >
        <div className="absolute inset-0 bg-gradient-radial from-white/10 to-transparent" />
        
        <Sparkles 
          size={size * 0.3} 
          className="text-[#C9A962] relative z-10" 
        />
        
        {isSelected && (
          <motion.div
            className="absolute inset-0 rounded-full border-2"
            style={{ borderColor: confidenceColors[meaning.confidence] }}
            animate={{ 
              scale: [1, 1.5, 1],
              opacity: [0.8, 0, 0.8]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        )}
      </div>
      
      <AnimatePresence>
        {(isSelected || isHighlighted) && (
          <motion.div
            className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 z-50"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <div className="bg-[#0D0D0F]/95 backdrop-blur-xl border border-white/20 rounded-lg p-3 min-w-[200px] shadow-xl">
              <div className="text-[#C9A962] font-medium text-sm mb-1">
                {meaning.meaning}
              </div>
              <div className="text-[#F5F3EF] text-xs mb-2">
                {meaning.definition}
              </div>
              <div className="flex items-center gap-2 text-xs">
                <Calendar size={12} className="text-[#7C9885]" />
                <span className="text-[#7C9885]">
                  {meaning.date < 0 ? `${Math.abs(meaning.date)} BCE` : `${meaning.date} CE`}
                </span>
                <div 
                  className="w-2 h-2 rounded-full ml-auto"
                  style={{ backgroundColor: confidenceColors[meaning.confidence] }}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

const TransitionArrow: React.FC<{
  transition: Transition
  fromPosition: { x: number; y: number }
  toPosition: { x: number; y: number }
  isVisible: boolean
  animationDelay: number
  onClick: (transitionId: string) => void
  containerWidth: number
  containerHeight: number
}> = ({ 
  transition, 
  fromPosition, 
  toPosition, 
  isVisible, 
  animationDelay, 
  onClick,
  containerWidth,
  containerHeight 
}) => {
  const fromX = fromPosition.x * containerWidth
  const fromY = fromPosition.y * containerHeight
  const toX = toPosition.x * containerWidth
  const toY = toPosition.y * containerHeight
  
  const midX = (fromX + toX) / 2
  const midY = (fromY + toY) / 2
  
  const angle = Math.atan2(toY - fromY, toX - fromX) * 180 / Math.PI
  const length = Math.sqrt((toX - fromX) ** 2 + (toY - fromY) ** 2)

  const typeColors = {
    evolution: '#C9A962',
    branch: '#7C9885',
    merge: '#8B7355',
    borrowing: '#F5F3EF'
  }

  if (!isVisible) return null

  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{
        left: fromX,
        top: fromY,
        width: length,
        height: 2,
        transformOrigin: '0 50%',
        transform: `rotate(${angle}deg)`
      }}
      initial={{ scaleX: 0, opacity: 0 }}
      animate={{ scaleX: 1, opacity: 0.8 }}
      transition={{ 
        delay: animationDelay,
        duration: 0.8,
        ease: "easeOut"
      }}
    >
      <div 
        className="h-full bg-gradient-to-r opacity-70 cursor-pointer pointer-events-auto relative"
        style={{ 
          background: `linear-gradient(90deg, ${typeColors[transition.type]}, transparent, ${typeColors[transition.type]})` 
        }}
        onClick={() => onClick(transition.id)}
      >
        <motion.div
          className="absolute right-0 top-1/2 transform -translate-y-1/2"
          animate={{
            x: [0, 5, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <ArrowRight 
            size={16} 
            style={{ color: typeColors[transition.type] }}
          />
        </motion.div>
      </div>
    </motion.div>
  )
}

const AuthorMarker: React.FC<{
  author: Author
  meanings: WordMeaning[]
  position: { x: number; y: number }
  size: 'small' | 'medium' | 'large'
  onClick: (authorId: string) => void
  containerWidth: number
  containerHeight: number
}> = ({ author, meanings, position, size, onClick, containerWidth, containerHeight }) => {
  const x = position.x * containerWidth
  const y = position.y * containerHeight
  
  const sizes = {
    small: 24,
    medium: 32,
    large: 40
  }
  
  const iconSize = sizes[size]

  return (
    <motion.div
      className="absolute cursor-pointer group"
      style={{
        left: x - iconSize/2,
        top: y - iconSize/2,
        width: iconSize,
        height: iconSize
      }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.2 }}
      transition={{ 
        type: "spring", 
        stiffness: 260, 
        damping: 20,
        delay: Math.random() * 0.5
      }}
      onClick={() => onClick(author.id)}
    >
      <div className="w-full h-full rounded-full bg-[#7C9885]/20 backdrop-blur-xl border border-[#7C9885]/30 flex items-center justify-center hover:bg-[#7C9885]/30 transition-all duration-300">
        <User size={iconSize * 0.6} className="text-[#7C9885]" />
      </div>
      
      <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
        <div className="bg-[#0D0D0F]/95 backdrop-blur-xl border border-white/20 rounded px-2 py-1 text-xs text-[#7C9885] whitespace-nowrap">
          {author.displayName}
        </div>
      </div>
    </motion.div>
  )
}

const KeyPassagePopup: React.FC<{
  passage: Passage
  position: { x: number; y: number }
  isVisible: boolean
  onClose: () => void
  onNavigateToWork: (workId: string) => void
}> = ({ passage, position, isVisible, onClose, onNavigateToWork }) => {
  if (!isVisible) return null

  return (
    <AnimatePresence>
      <motion.div
        className="fixed z-50 pointer-events-none"
        style={{ left: position.x, top: position.y }}
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: 20 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="bg-[#0D0D0F]/95 backdrop-blur-xl border border-white/20 rounded-xl p-6 max-w-md shadow-2xl pointer-events-auto">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2">
              <ScrollText className="text-[#C9A962]" size={20} />
              <span className="text-[#C9A962] font-medium">Key Passage</span>
            </div>
            <button
              onClick={onClose}
              className="text-[#7C9885] hover:text-[#F5F3EF] transition-colors"
            >
              <X size={16} />
            </button>
          </div>
          
          <div className="space-y-4">
            <div className="p-3 bg-white/5 rounded-lg border-l-2 border-[#C9A962]">
              <div className="text-[#F5F3EF] text-sm font-mono mb-2 leading-relaxed">
                {passage.text}
              </div>
              {passage.translation && (
                <div className="text-[#7C9885] text-sm italic">
                  "{passage.translation}"
                </div>
              )}
            </div>
            
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#8B7355]">{passage.reference}</span>
              <div className={`px-2 py-1 rounded-full text-xs ${
                passage.significance === 'pivotal' ? 'bg-[#C9A962]/20 text-[#C9A962]' :
                passage.significance === 'supporting' ? 'bg-[#7C9885]/20 text-[#7C9885]' :
                'bg-[#8B7355]/20 text-[#8B7355]'
              }`}>
                {passage.significance}
              </div>
            </div>
            
            <div className="pt-2 border-t border-white/10">
              <div className="text-[#7C9885] text-sm mb-2">Context:</div>
              <div className="text-[#F5F3EF] text-sm">
                {passage.context}
              </div>
            </div>
            
            <button
              onClick={() => onNavigateToWork(passage.workId)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-[#C9A962]/20 hover:bg-[#C9A962]/30 border border-[#C9A962]/30 rounded-lg text-[#C9A962] text-sm transition-all duration-200 hover:shadow-lg"
            >
              <BookOpen size={16} />
              View Complete Work
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

const TimelineControls: React.FC<{
  word: string
  dateRange: { start: number; end: number }
  viewMode: 'meanings' | 'authors' | 'both'
  zoomLevel: number
  onWordChange: (word: string) => void
  onDateRangeChange: (range: { start: number; end: number }) => void
  onViewModeChange: (mode: 'meanings' | 'authors' | 'both') => void
  onZoomChange: (zoom: number) => void
  showTransitions: boolean
  onToggleTransitions: () => void
}> = ({ 
  word, 
  dateRange, 
  viewMode, 
  zoomLevel, 
  onWordChange, 
  onDateRangeChange, 
  onViewModeChange, 
  onZoomChange,
  showTransitions,
  onToggleTransitions
}) => {
  const [searchTerm, setSearchTerm] = useState(word)

  const commonWords = ['logos', 'sophia', 'pneuma', 'nous', 'psyche', 'kosmos']

  return (
    <div className="flex flex-wrap items-center gap-4 p-4 bg-white/5 backdrop-blur-xl border-b border-white/10">
      <div className="flex items-center gap-2">
        <Search className="text-[#7C9885]" size={20} />
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && onWordChange(searchTerm)}
            placeholder="Enter word to trace..."
            className="bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-[#F5F3EF] text-sm w-48 focus:outline-none focus:border-[#C9A962] transition-colors"
          />
          <div className="absolute top-full left-0 mt-1 bg-[#0D0D0F]/95 backdrop-blur-xl border border-white/20 rounded-lg overflow-hidden opacity-0 hover:opacity-100 focus-within:opacity-100 transition-opacity">
            {commonWords.map(w => (
              <button
                key={w}
                onClick={() => {
                  setSearchTerm(w)
                  onWordChange(w)
                }}
                className="block w-full text-left px-3 py-1 text-[#7C9885] text-sm hover:bg-white/10 transition-colors"
              >
                {w}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Filter className="text-[#7C9885]" size={16} />
        <select
          value={viewMode}
          onChange={(e) => onViewModeChange(e.target.value as any)}
          className="bg-white/5 border border-white/20 rounded-lg px-3 py-1 text-[#F5F3EF] text-sm focus:outline-none focus:border-[#C9A962] transition-colors"
        >
          <option value="both">Both</option>
          <option value="meanings">Meanings Only</option>
          <option value="authors">Authors Only</option>
        </select>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onToggleTransitions}
          className={`flex items-center gap-1 px-2 py-1 rounded text-sm transition-all ${
            showTransitions 
              ? 'bg-[#C9A962]/20 text-[#C9A962] border border-[#C9A962]/30' 
              : 'bg-white/5 text-[#7C9885] border border-white/20 hover:bg-white/10'
          }`}
        >
          {showTransitions ? <Eye size={16} /> : <EyeOff size={16} />}
          Transitions
        </button>
      </div>

      <div className="flex items-center gap-2 ml-auto">
        <button
          onClick={() => onZoomChange(Math.max(0.5, zoomLevel - 0.25))}
          className="p-1 text-[#7C9885] hover:text-[#C9A962] transition-colors"
        >
          <ZoomOut size={20} />
        </button>
        <span className="text-[#7C9885] text-sm min-w-[3rem] text-center">
          {Math.round(zoomLevel * 100)}%
        </span>
        <button
          onClick={() => onZoomChange(Math.min(3, zoomLevel + 0.25))}
          className="p-1 text-[#7C9885] hover:text-[#C9A962] transition-colors"
        >
          <ZoomIn size={20} />
        </button>
      </div>
    </div>
  )
}

function NarrativeTimeline({ 
  word = 'logos', 
  dateRange = { start: -600, end: 400 },
  onWordChange,
  className = ''
}: NarrativeTimelineProps) {
  const [currentWord, setCurrentWord] = useState(word)
  const [currentDateRange, setCurrentDateRange] = useState(dateRange)
  const [selectedMeaningId, setSelectedMeaningId] = useState<string | null>(null)
  const [hoveredMeaningId, setHoveredMeaningId] = useState<string | null>(null)
  const [selectedAuthorId, setSelectedAuthorId] = useState<string | null>(null)
  const [selectedTransitionId, setSelectedTransitionId] = useState<string | null>(null)
  const [hoveredDate, setHoveredDate] = useState<number | null>(null)
  const [viewMode, setViewMode] = useState<'meanings' | 'authors' | 'both'>('both')
  const [zoomLevel, setZoomLevel] = useState(1)
  const [showTransitions, setShowTransitions] = useState(true)
  const [popupState, setPopupState] = useState<{
    type: 'passage' | null
    id: string | null
    position: { x: number; y: number }
  }>({ type: null, id: null, position: { x: 0, y: 0 } })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const containerRef = useRef<HTMLDivElement>(null)
  const timelineRef = useRef<HTMLDivElement>(null)

  const filteredMeanings = useMemo(() => {
    return mockData.meanings.filter(m => 
      m.date >= currentDateRange.start && m.date <= currentDateRange.end
    )
  }, [currentDateRange])

  const visibleTransitions = useMemo(() => {
    if (!showTransitions) return []
    return mockData.transitions.filter(t => {
      const fromMeaning = filteredMeanings.find(m => m.id === t.fromMeaningId)
      const toMeaning = filteredMeanings.find(m => m.id === t.toMeaningId)
      return fromMeaning && toMeaning
    })
  }, [filteredMeanings, showTransitions])

  const handleWordChange = (newWord: string) => {
    if (newWord !== currentWord) {
      setLoading(true)
      setError(null)
      setSelectedMeaningId(null)
      setSelectedAuthorId(null)
      
      setTimeout(() => {
        setCurrentWord(newWord)
        setLoading(false)
        onWordChange?.(newWord)
      }, 1000)
    }
  }

  const handlePassageClick = (passageId: string, event: React.MouseEvent) => {
    const passage = mockData.passages.find(p => p.id === passageId)
    if (passage) {
      setPopupState({
        type: 'passage',
        id: passageId,
        position: { x: event.clientX, y: event.clientY }
      })
    }
  }

  const selectedMeaning = selectedMeaningId ? 
    filteredMeanings.find(m => m.id === selectedMeaningId) : null

  const selectedPassages = selectedMeaning ? 
    mockData.passages.filter(p => p.meaningIds.includes(selectedMeaning.id)) : []

  if (loading) {
    return (
      <div className={`bg-[#0D0D0F] min-h-screen flex items-center justify-center ${className}`}>
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="w-16 h-16 border-4 border-[#C9A962]/20 border-t-[#C9A962] rounded-full mb-4 mx-auto"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <div className="text-[#C9A962] text-lg font-medium mb-2">
            Tracing Semantic Evolution
          </div>
          <div className="text-[#7C9885] text-sm">
            Loading historical data for "{currentWord}"...
          </div>
        </motion.div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`bg-[#0D0D0F] min-h-screen flex items-center justify-center ${className}`}>
        <div className="text-center">
          <div className="text-red-400 text-lg font-medium mb-2">
            Error Loading Timeline
          </div>
          <div className="text-[#7C9885] text-sm mb-4">
            {error}
          </div>
          <button
            onClick={() => {
              setError(null)
              setLoading(false)
            }}
            className="px-4 py-2 bg-[#C9A962]/20 border border-[#C9A962]/30 rounded-lg text-[#C9A962] hover:bg-[#C9A962]/30 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={`bg-[#0D0D0F] min-h-screen flex flex-col ${className}`} ref={containerRef}>
      <TimelineControls
        word={currentWord}
        dateRange={currentDateRange}
        viewMode={viewMode}
        zoomLevel={zoomLevel}
        onWordChange={handleWordChange}
        onDateRangeChange={setCurrentDateRange}
        onViewModeChange={setViewMode}
        onZoomChange={setZoomLevel}
        showTransitions={showTransitions}
        onToggleTransitions={() => setShowTransitions(!showTransitions)}
      />

      <div className="flex-1 flex">
        <div className="flex-1 relative overflow-hidden" ref={timelineRef}>
          <div className="absolute inset-0 p-8">
            <div className="w-full h-full relative">
              <TimelineTrack
                dateRange={currentDateRange}
                width={timelineRef.current?.clientWidth ? timelineRef.current.clientWidth - 64 : 800}
                height={80}
                onDateHover={setHoveredDate}
                hoveredDate={hoveredDate}
              />
              
              <div className="absolute inset-0 pt-20">
                {(viewMode === 'meanings' || viewMode === 'both') && 
                  filteredMeanings.map((meaning, index) => (
                    <MeaningNode
                      key={meaning.id}
                      meaning={meaning}
                      position={meaning.coordinates}
                      isSelected={selectedMeaningId === meaning.id}
                      isHighlighted={hoveredMeaningId === meaning.id}
                      scale={zoomLevel}
                      onClick={setSelectedMeaningId}
                      onHover={setHoveredMeaningId}
                      containerWidth={timelineRef.current?.clientWidth ? timelineRef.current.clientWidth - 64 : 800}
                      containerHeight={timelineRef.current?.clientHeight ? timelineRef.current.clientHeight - 120 : 400}
                    />
                  ))
                }
                
                {visibleTransitions.map((transition, index) => {
                  const fromMeaning = filteredMeanings.find(m => m.id === transition.fromMeaningId)
                  const toMeaning = filteredMeanings.find(m => m.id === transition.toMeaningId)
                  
                  if (!fromMeaning || !toMeaning) return null
                  
                  return (
                    <TransitionArrow
                      key={transition.id}
                      transition={transition}
                      fromPosition={fromMeaning.coordinates}
                      toPosition={toMeaning.coordinates}
                      isVisible={showTransitions}
                      animationDelay={index * 0.2}
                      onClick={setSelectedTransitionId}
                      containerWidth={timelineRef.current?.clientWidth ? timelineRef.current.clientWidth - 64 : 800}
                      containerHeight={timelineRef.current?.clientHeight ? timelineRef.current.clientHeight - 120 : 400}
                    />
                  )
                })}
                
                {(viewMode === 'authors' || viewMode === 'both') &&
                  mockData.authors.map((author, index) => {
                    const relevantMeanings = filteredMeanings.filter(m => 
                      Math.abs(m.date - (author.lifespan.birth || author.lifespan.death || 0)) < 100
                    )
                    
                    if (relevantMeanings.length === 0) return null
                    
                    const avgX = relevantMeanings.reduce((sum, m) => sum + m.coordinates.x, 0) / relevantMeanings.length
                    const avgY = Math.min(0.9, Math.max(0.1, relevantMeanings.reduce((sum, m) => sum + m.coordinates.y, 0) / relevantMeanings.length + 0.2))
                    
                    return (
                      <AuthorMarker
                        key={author.id}
                        author={author}
                        meanings={relevantMeanings}
                        position={{ x: avgX, y: avgY }}
                        size={author.significance > 0.8 ? 'large' : author.significance > 0.6 ? 'medium' : 'small'}
                        onClick={setSelectedAuthorId}
                        containerWidth={timelineRef.current?.clientWidth ? timelineRef.current.clientWidth - 64 : 800}
                        containerHeight={timelineRef.current?.clientHeight ? timelineRef.current.clientHeight - 120 : 400}
                      />
                    )
                  })
                }
              </div>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {selectedMeaning && (
            <motion.div
              className="w-80 bg-white/5 backdrop-blur-xl border-l border-white/10 p-6 overflow-y-auto"
              initial={{ x: 320, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 320, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-[#C9A962] text-lg font-medium">
                    Selected Meaning
                  </h3>
                  <button
                    onClick={() => setSelectedMeaningId(null)}
                    className="text-[#7C9885] hover:text-[#F5F3EF] transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <div className="text-[#F5F3EF] font-medium text-xl mb-1">
                      {selectedMeaning.meaning}
                    </div>
                    <div className="text-[#7C9885] text-sm">
                      {selectedMeaning.definition}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar size={16} className="text-[#8B7355]" />
                    <span className="text-[#8B7355]">
                      {selectedMeaning.date < 0 ? `${Math.abs(selectedMeaning.date)} BCE` : `${selectedMeaning.date} CE`}
                    </span>
                  </div>
                  
                  <div className="text-[#7C9885] text-sm">
                    <strong>Usage:</strong> {selectedMeaning.usage}
                  </div>
                  
                  <div className="flex flex-wrap gap-1">
                    {selectedMeaning.tags.map(tag => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-[#8B7355]/20 text-[#8B7355] text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {selectedPassages.length > 0 && (
                <div>
                  <h4 className="text-[#C9A962] font-medium mb-3">
                    Key Passages ({selectedPassages.length})
                  </h4>
                  
                  <div className="space-y-3">
                    {selectedPassages.map(passage => (
                      <motion.div
                        key={passage.id}
                        className="p-3 bg-white/5 rounded-lg border border-white/10 cursor-pointer hover:bg-white/10 transition-colors"
                        onClick={(e) => handlePassageClick(passage.id, e)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="text-[#F5F3EF] font-medium text-sm mb-1">
                          {passage.author}
                        </div>
                        <div className="text-[#7C9885] text-xs">
                          {passage.work} • {passage.date}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
          </motion.div>
        )}
      </AnimatePresence>
      </div>
    </div>
  )
}

// Named and default exports for compatibility
export { NarrativeTimeline }
export default NarrativeTimeline
