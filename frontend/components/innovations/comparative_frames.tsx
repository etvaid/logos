'use client'

import React, { useState, useCallback, useReducer, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Plus, 
  X, 
  BookOpen, 
  Network, 
  ArrowLeftRight, 
  ChevronRight, 
  ChevronDown,
  Eye,
  EyeOff,
  Zap,
  Globe,
  Search,
  Filter,
  RotateCcw,
  Sparkles,
  Link2,
  Target,
  Layers
} from 'lucide-react'

interface Language {
  code: string
  name: string
  direction: 'ltr' | 'rtl'
  font: string
}

interface RootMeaning {
  etymology: string
  primarySense: string
  development: string[]
  cognates?: string[]
}

interface SemanticWord {
  term: string
  transliteration?: string
  relationship: 'synonym' | 'antonym' | 'hypernym' | 'hyponym' | 'related'
  frequency: number
  cooccurrenceScore: number
}

interface Collocation {
  phrase: string
  transliteration?: string
  frequency: number
  contexts: string[]
  significance: 'high' | 'medium' | 'low'
}

interface ConceptUsage {
  semanticRole: string
  rhetoricalFunction: string
  theologicalImplication?: string
}

interface Passage {
  id: string
  source: string
  text: string
  translation: string
  context: string
  conceptUsage: ConceptUsage
}

interface ConceptData {
  id: string
  term: string
  language: Language
  rootMeaning: RootMeaning
  semanticField: SemanticWord[]
  collocations: Collocation[]
  passages: Passage[]
  keyCharacteristics: string[]
}

interface Difference {
  type: 'semantic' | 'pragmatic' | 'cultural' | 'temporal'
  description: string
  languages: string[]
  examples: string[]
  significance: number
}

interface ParallelPassage {
  id: string
  theme: string
  passages: { [languageCode: string]: Passage }
  commentary: string
}

interface ComparativeFramesState {
  concepts: ConceptData[]
  selectedDifference: number | null
  expandedSections: { [conceptId: string]: { [section: string]: boolean } }
  selectedParallel: string | null
  highlightMode: 'differences' | 'similarities' | null
  selectedWord: string | null
  showAllCollocations: { [conceptId: string]: boolean }
  filters: {
    significanceThreshold: number
    showOnlyHighFrequency: boolean
  }
}

type ComparativeFramesAction = 
  | { type: 'ADD_CONCEPT'; payload: ConceptData }
  | { type: 'REMOVE_CONCEPT'; payload: string }
  | { type: 'TOGGLE_SECTION'; payload: { conceptId: string; section: string } }
  | { type: 'SELECT_DIFFERENCE'; payload: number | null }
  | { type: 'SET_HIGHLIGHT_MODE'; payload: 'differences' | 'similarities' | null }
  | { type: 'SELECT_WORD'; payload: string | null }
  | { type: 'TOGGLE_COLLOCATIONS'; payload: string }
  | { type: 'SELECT_PARALLEL'; payload: string | null }

const initialState: ComparativeFramesState = {
  concepts: [],
  selectedDifference: null,
  expandedSections: {},
  selectedParallel: null,
  highlightMode: null,
  selectedWord: null,
  showAllCollocations: {},
  filters: {
    significanceThreshold: 0.5,
    showOnlyHighFrequency: false
  }
}

export const comparativeFramesReducer = (state: ComparativeFramesState, action: ComparativeFramesAction): ComparativeFramesState => {
  switch (action.type) {
    case 'ADD_CONCEPT':
      return {
        ...state,
        concepts: [...state.concepts, action.payload],
        expandedSections: {
          ...state.expandedSections,
          [action.payload.id]: { rootMeaning: true, semanticField: true, collocations: false }
        }
      }
    case 'REMOVE_CONCEPT':
      return {
        ...state,
        concepts: state.concepts.filter(c => c.id !== action.payload),
        expandedSections: Object.fromEntries(
          Object.entries(state.expandedSections).filter(([id]) => id !== action.payload)
        )
      }
    case 'TOGGLE_SECTION':
      return {
        ...state,
        expandedSections: {
          ...state.expandedSections,
          [action.payload.conceptId]: {
            ...state.expandedSections[action.payload.conceptId],
            [action.payload.section]: !state.expandedSections[action.payload.conceptId]?.[action.payload.section]
          }
        }
      }
    case 'SELECT_DIFFERENCE':
      return { ...state, selectedDifference: action.payload }
    case 'SET_HIGHLIGHT_MODE':
      return { ...state, highlightMode: action.payload }
    case 'SELECT_WORD':
      return { ...state, selectedWord: action.payload }
    case 'TOGGLE_COLLOCATIONS':
      return {
        ...state,
        showAllCollocations: {
          ...state.showAllCollocations,
          [action.payload]: !state.showAllCollocations[action.payload]
        }
      }
    case 'SELECT_PARALLEL':
      return { ...state, selectedParallel: action.payload }
    default:
      return state
  }
}

export const RootMeaningCard: React.FC<{
  rootMeaning: RootMeaning
  language: Language
  isExpanded: boolean
  onToggle: () => void
}> = ({ rootMeaning, language, isExpanded, onToggle }) => {
  return (
    <motion.div 
      className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4 mb-4"
      whileHover={{ backgroundColor: 'rgba(255,255,255,0.08)' }}
    >
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full text-left"
      >
        <div className="flex items-center gap-2">
          <Target className="w-4 h-4 text-[#C9A962]" />
          <span className="text-[#F5F3EF] font-semibold">Root Meaning</span>
        </div>
        <motion.div
          animate={{ rotate: isExpanded ? 90 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronRight className="w-4 h-4 text-[#7C9885]" />
        </motion.div>
      </button>
      
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-4"
          >
            <div className="mb-3">
              <span className="text-[#C9A962] text-sm font-medium">Etymology:</span>
              <p className="text-[#F5F3EF] text-sm mt-1" style={{ fontFamily: language.font }}>
                {rootMeaning.etymology}
              </p>
            </div>
            
            <div className="mb-3">
              <span className="text-[#C9A962] text-sm font-medium">Primary Sense:</span>
              <p className="text-[#F5F3EF] mt-1">{rootMeaning.primarySense}</p>
            </div>
            
            <div>
              <span className="text-[#C9A962] text-sm font-medium">Development:</span>
              <div className="mt-2 space-y-1">
                {rootMeaning.development.map((stage, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-2"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-[#7C9885]" />
                    <span className="text-[#F5F3EF] text-sm">{stage}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

const SemanticFieldCloud: React.FC<{
  words: SemanticWord[]
  language: Language
  selectedWord: string | null
  onWordSelect: (word: string | null) => void
}> = ({ words, language, selectedWord, onWordSelect }) => {
  const getRelationshipColor = (relationship: SemanticWord['relationship']) => {
    switch (relationship) {
      case 'synonym': return 'text-[#C9A962]'
      case 'antonym': return 'text-red-400'
      case 'hypernym': return 'text-blue-400'
      case 'hyponym': return 'text-green-400'
      default: return 'text-[#7C9885]'
    }
  }

  const getWordSize = (frequency: number) => {
    if (frequency > 0.8) return 'text-lg'
    if (frequency > 0.5) return 'text-base'
    return 'text-sm'
  }

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4 mb-4">
      <div className="flex items-center gap-2 mb-4">
        <Network className="w-4 h-4 text-[#C9A962]" />
        <span className="text-[#F5F3EF] font-semibold">Semantic Field</span>
        <span className="text-[#7C9885] text-xs">({words.length} terms)</span>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {words.map((word, index) => (
          <motion.button
            key={`${word.term}-${index}`}
            className={`px-3 py-1.5 rounded-lg border transition-all duration-200 ${
              selectedWord === word.term
                ? 'bg-[#C9A962]/20 border-[#C9A962] text-[#C9A962]'
                : 'bg-white/5 border-white/10 hover:bg-white/10'
            } ${getRelationshipColor(word.relationship)} ${getWordSize(word.frequency)}`}
            onClick={() => onWordSelect(selectedWord === word.term ? null : word.term)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            style={{ fontFamily: language.font }}
          >
            <div className="flex flex-col items-center">
              <span>{word.term}</span>
              {word.transliteration && (
                <span className="text-xs text-[#8B7355] italic">{word.transliteration}</span>
              )}
            </div>
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {selectedWord && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 pt-4 border-t border-white/10"
          >
            {words.filter(w => w.term === selectedWord).map(word => (
              <div key={word.term} className="space-y-2">
                <div className="flex items-center gap-4">
                  <span className="text-[#C9A962] text-sm">Relationship:</span>
                  <span className={`text-sm capitalize ${getRelationshipColor(word.relationship)}`}>
                    {word.relationship}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-[#C9A962] text-sm">Co-occurrence:</span>
                  <div className="flex-1 bg-white/10 rounded-full h-2">
                    <motion.div
                      className="bg-[#C9A962] h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${word.cooccurrenceScore * 100}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                  <span className="text-[#7C9885] text-sm">
                    {Math.round(word.cooccurrenceScore * 100)}%
                  </span>
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

const CollocationList: React.FC<{
  collocations: Collocation[]
  language: Language
  showAll: boolean
  onToggleExpand: () => void
  onCollocationClick: (phrase: string) => void
}> = ({ collocations, language, showAll, onToggleExpand, onCollocationClick }) => {
  const displayedCollocations = showAll ? collocations : collocations.slice(0, 5)
  
  const getSignificanceColor = (significance: Collocation['significance']) => {
    switch (significance) {
      case 'high': return 'bg-[#C9A962]/20 border-[#C9A962]/40'
      case 'medium': return 'bg-[#7C9885]/20 border-[#7C9885]/40'
      case 'low': return 'bg-[#8B7355]/20 border-[#8B7355]/40'
    }
  }

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Link2 className="w-4 h-4 text-[#C9A962]" />
          <span className="text-[#F5F3EF] font-semibold">Collocations</span>
          <span className="text-[#7C9885] text-xs">({collocations.length} found)</span>
        </div>
        {collocations.length > 5 && (
          <button
            onClick={onToggleExpand}
            className="text-[#C9A962] text-xs hover:text-[#C9A962]/80 flex items-center gap-1"
          >
            {showAll ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
            {showAll ? 'Show Less' : 'Show All'}
          </button>
        )}
      </div>
      
      <div className="space-y-2">
        {displayedCollocations.map((collocation, index) => (
          <motion.div
            key={`${collocation.phrase}-${index}`}
            className={`p-3 rounded-lg border cursor-pointer ${getSignificanceColor(collocation.significance)}`}
            onClick={() => onCollocationClick(collocation.phrase)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[#F5F3EF] font-medium" style={{ fontFamily: language.font }}>
                  {collocation.phrase}
                </div>
                {collocation.transliteration && (
                  <div className="text-[#8B7355] text-xs italic mt-1">
                    {collocation.transliteration}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[#7C9885] text-xs">
                  {collocation.frequency}×
                </span>
                <div className={`w-2 h-2 rounded-full ${
                  collocation.significance === 'high' ? 'bg-[#C9A962]' : 
                  collocation.significance === 'medium' ? 'bg-[#7C9885]' : 'bg-[#8B7355]'
                }`} />
              </div>
            </div>
            
            <div className="mt-2 flex flex-wrap gap-1">
              {collocation.contexts.slice(0, 3).map((context, contextIndex) => (
                <span
                  key={contextIndex}
                  className="text-xs bg-white/10 px-2 py-1 rounded text-[#F5F3EF]"
                >
                  {context}
                </span>
              ))}
              {collocation.contexts.length > 3 && (
                <span className="text-xs text-[#7C9885]">
                  +{collocation.contexts.length - 3} more
                </span>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

const LanguageColumn: React.FC<{
  concept: ConceptData
  expandedSections: { [section: string]: boolean }
  showAllCollocations: boolean
  selectedWord: string | null
  onToggleSection: (section: string) => void
  onWordSelect: (word: string | null) => void
  onToggleCollocations: () => void
  onCollocationClick: (phrase: string) => void
  onRemove: () => void
}> = ({ 
  concept, 
  expandedSections, 
  showAllCollocations, 
  selectedWord,
  onToggleSection, 
  onWordSelect, 
  onToggleCollocations,
  onCollocationClick,
  onRemove 
}) => {
  return (
    <motion.div
      className="flex-1 min-w-0 space-y-4"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.4 }}
    >
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <Globe className="w-5 h-5 text-[#C9A962]" />
            <div>
              <h3 className="text-xl font-bold text-[#F5F3EF]" style={{ fontFamily: concept.language.font }}>
                {concept.term}
              </h3>
              <span className="text-[#7C9885] text-sm">{concept.language.name}</span>
            </div>
          </div>
          <button
            onClick={onRemove}
            className="text-[#8B7355] hover:text-red-400 transition-colors p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        
        <div className="flex flex-wrap gap-2 mt-3">
          {concept.keyCharacteristics.map((characteristic, index) => (
            <motion.span
              key={index}
              className="bg-[#C9A962]/20 text-[#C9A962] px-2 py-1 rounded-md text-xs"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              {characteristic}
            </motion.span>
          ))}
        </div>
        
        <div className="flex items-center gap-4 mt-4 text-sm text-[#7C9885]">
          <div className="flex items-center gap-1">
            <BookOpen className="w-4 h-4" />
            <span>{concept.passages.length} passages</span>
          </div>
          <div className="flex items-center gap-1">
            <Network className="w-4 h-4" />
            <span>{concept.semanticField.length} related terms</span>
          </div>
          <div className="flex items-center gap-1">
            <Link2 className="w-4 h-4" />
            <span>{concept.collocations.length} collocations</span>
          </div>
        </div>
      </div>

      <RootMeaningCard
        rootMeaning={concept.rootMeaning}
        language={concept.language}
        isExpanded={expandedSections.rootMeaning}
        onToggle={() => onToggleSection('rootMeaning')}
      />

      {expandedSections.semanticField && (
        <SemanticFieldCloud
          words={concept.semanticField}
          language={concept.language}
          selectedWord={selectedWord}
          onWordSelect={onWordSelect}
        />
      )}

      {expandedSections.collocations && (
        <CollocationList
          collocations={concept.collocations}
          language={concept.language}
          showAll={showAllCollocations}
          onToggleExpand={onToggleCollocations}
          onCollocationClick={onCollocationClick}
        />
      )}
    </motion.div>
  )
}

const ComparisonControls: React.FC<{
  conceptCount: number
  highlightMode: 'differences' | 'similarities' | null
  onHighlightModeChange: (mode: 'differences' | 'similarities' | null) => void
  onAddConcept: () => void
  onReset: () => void
}> = ({ conceptCount, highlightMode, onHighlightModeChange, onAddConcept, onReset }) => {
  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#C9A962]" />
            <h2 className="text-xl font-bold text-[#F5F3EF]">Comparative Analysis</h2>
          </div>
          <span className="text-[#7C9885] text-sm">
            {conceptCount} concept{conceptCount !== 1 ? 's' : ''} loaded
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex bg-white/5 rounded-lg p-1">
            <button
              onClick={() => onHighlightModeChange(highlightMode === 'differences' ? null : 'differences')}
              className={`px-3 py-1.5 rounded text-sm transition-all ${
                highlightMode === 'differences'
                  ? 'bg-[#C9A962] text-black font-medium'
                  : 'text-[#F5F3EF] hover:bg-white/10'
              }`}
            >
              <ArrowLeftRight className="w-4 h-4 mr-1 inline" />
              Differences
            </button>
            <button
              onClick={() => onHighlightModeChange(highlightMode === 'similarities' ? null : 'similarities')}
              className={`px-3 py-1.5 rounded text-sm transition-all ${
                highlightMode === 'similarities'
                  ? 'bg-[#7C9885] text-black font-medium'
                  : 'text-[#F5F3EF] hover:bg-white/10'
              }`}
            >
              <Sparkles className="w-4 h-4 mr-1 inline" />
              Similarities
            </button>
          </div>
          
          <button
            onClick={onAddConcept}
            className="bg-[#C9A962] text-black px-4 py-2 rounded-lg font-medium hover:bg-[#C9A962]/90 transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Concept
          </button>
          
          <button
            onClick={onReset}
            className="text-[#8B7355] hover:text-[#F5F3EF] transition-colors p-2"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

const DifferenceHighlight: React.FC<{
  differences: Difference[]
  activeIndex: number | null
  onNavigate: (index: number) => void
  onClose: () => void
}> = ({ differences, activeIndex, onNavigate, onClose }) => {
  if (activeIndex === null || !differences[activeIndex]) return null

  const difference = differences[activeIndex]

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div 
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />
        
        <motion.div
          className="relative bg-[#0D0D0F] border border-white/20 rounded-xl p-6 max-w-2xl w-full"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-[#C9A962]" />
              <h3 className="text-lg font-bold text-[#F5F3EF] capitalize">
                {difference.type} Difference
              </h3>
            </div>
            <button
              onClick={onClose}
              className="text-[#8B7355] hover:text-[#F5F3EF] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <p className="text-[#F5F3EF] mb-4">{difference.description}</p>
          
          <div className="space-y-3">
            <div>
              <span className="text-[#C9A962] text-sm font-medium">Languages Involved:</span>
              <div className="flex gap-2 mt-1">
                {difference.languages.map(lang => (
                  <span key={lang} className="bg-white/10 px-2 py-1 rounded text-xs text-[#F5F3EF]">
                    {lang}
                  </span>
                ))}
              </div>
            </div>
            
            <div>
              <span className="text-[#C9A962] text-sm font-medium">Examples:</span>
              <ul className="mt-1 space-y-1">
                {difference.examples.map((example, index) => (
                  <li key={index} className="text-[#F5F3EF] text-sm flex items-start gap-2">
                    <div className="w-1 h-1 rounded-full bg-[#7C9885] mt-2 flex-shrink-0" />
                    {example}
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <span className="text-[#C9A962] text-sm font-medium">Significance:</span>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex-1 bg-white/10 rounded-full h-2">
                  <motion.div
                    className="bg-[#C9A962] h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${difference.significance * 100}%` }}
                  />
                </div>
                <span className="text-[#7C9885] text-sm">
                  {Math.round(difference.significance * 100)}%
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between mt-6">
            <span className="text-[#7C9885] text-sm">
              {activeIndex + 1} of {differences.length} differences
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => onNavigate(Math.max(0, activeIndex - 1))}
                disabled={activeIndex === 0}
                className="px-3 py-1 text-sm bg-white/10 rounded disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => onNavigate(Math.min(differences.length - 1, activeIndex + 1))}
                disabled={activeIndex === differences.length - 1}
                className="px-3 py-1 text-sm bg-white/10 rounded disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

const ComparativeFrames: React.FC<{
  className?: string
  // Additional props for chronos page compatibility
  items?: any[]
  comparisonType?: string
  selectedItems?: string[]
  onSelectionChange?: (items: any) => void
  frames?: any[]
  data?: any[]
  periods?: any[]
  selectedWord?: string
  onItemSelect?: (itemId: any) => void
  viewOptions?: string[]
  onCompare?: (items: any) => void
  title?: string
  onFrameSelect?: (frame: any) => void
  activeFrame?: string
  onFrameChange?: (frameId: any) => void
}> = ({ className = '', items, comparisonType, selectedItems, onSelectionChange, frames, data, periods, selectedWord, onItemSelect, viewOptions, onCompare, title, onFrameSelect, activeFrame, onFrameChange }) => {
  const [state, dispatch] = useReducer(comparativeFramesReducer, initialState)
  
  // Mock data for demonstration
  const mockConcepts: ConceptData[] = [
    {
      id: 'agape-grc',
      term: 'ἀγάπη',
      language: { code: 'grc', name: 'Ancient Greek', direction: 'ltr', font: 'serif' },
      rootMeaning: {
        etymology: 'From ἀγαπάω (agapaō), possibly related to ἄγαμαι (agamai) "to admire"',
        primarySense: 'Divine, unconditional love; selfless affection',
        development: [
          'Classical: general affection, preference',
          'Septuagint: divine love for humanity',
          'New Testament: defining characteristic of God',
          'Patristic: theological virtue, caritas'
        ]
      },
      semanticField: [
        { term: 'φιλία', relationship: 'related', frequency: 0.8, cooccurrenceScore: 0.6 },
        { term: 'ἔρως', relationship: 'related', frequency: 0.7, cooccurrenceScore: 0.3 },
        { term: 'στοργή', relationship: 'related', frequency: 0.5, cooccurrenceScore: 0.4 },
        { term: 'χάρις', relationship: 'related', frequency: 0.9, cooccurrenceScore: 0.7 }
      ],
      collocations: [
        { phrase: 'ἀγάπη θεοῦ', frequency: 45, contexts: ['theological', 'liturgical'], significance: 'high' },
        { phrase: 'ἐν ἀγάπῃ', frequency: 32, contexts: ['ethical', 'communal'], significance: 'high' },
        { phrase: 'ἀγάπη ἀλήθεια', frequency: 18, contexts: ['philosophical'], significance: 'medium' }
      ],
      passages: [],
      keyCharacteristics: ['Divine', 'Unconditional', 'Sacrificial', 'Universal']
    },
    {
      id: 'caritas-lat',
      term: 'caritas',
      language: { code: 'lat', name: 'Latin', direction: 'ltr', font: 'serif' },
      rootMeaning: {
        etymology: 'From carus "dear, expensive" + -itas suffix indicating quality',
        primarySense: 'Christian love, charity; costly affection',
        development: [
          'Classical: high price, costliness',
          'Vulgate: translation of ἀγάπη',
          'Patristic: theological virtue',
          'Medieval: organized charitable works'
        ]
      },
      semanticField: [
        { term: 'amor', relationship: 'related', frequency: 0.9, cooccurrenceScore: 0.5 },
        { term: 'dilectio', relationship: 'synonym', frequency: 0.7, cooccurrenceScore: 0.8 },
        { term: 'misericordia', relationship: 'related', frequency: 0.8, cooccurrenceScore: 0.6 },
        { term: 'pietas', relationship: 'related', frequency: 0.6, cooccurrenceScore: 0.4 }
      ],
      collocations: [
        { phrase: 'caritas Dei', frequency: 52, contexts: ['theological', 'liturgical'], significance: 'high' },
        { phrase: 'in caritate', frequency: 38, contexts: ['ethical', 'monastic'], significance: 'high' },
        { phrase: 'caritas proximi', frequency: 24, contexts: ['moral theology'], significance: 'medium' }
      ],
      passages: [],
      keyCharacteristics: ['Costly', 'Charitable', 'Virtue', 'Active']
    }
  ]

  const mockDifferences: Difference[] = [
    {
      type: 'semantic',
      description: 'While Greek ἀγάπη emphasizes the divine and transcendent nature of love, Latin caritas retains the notion of cost and value, suggesting love as something precious that is given.',
      languages: ['Greek', 'Latin'],
      examples: [
        'ἀγάπη appears in contexts of divine initiative and grace',
        'caritas often appears with economic metaphors of exchange and value'
      ],
      significance: 0.85
    }
  ]

  useEffect(() => {
    // Initialize with mock data
    mockConcepts.forEach(concept => {
      dispatch({ type: 'ADD_CONCEPT', payload: concept })
    })
  }, [])

  const handleAddConcept = useCallback(() => {
    // Mock adding a Hebrew concept
    const newConcept: ConceptData = {
      id: 'chesed-heb',
      term: 'חֶסֶד',
      language: { code: 'heb', name: 'Hebrew', direction: 'rtl', font: 'serif' },
      rootMeaning: {
        etymology: 'Root ח-ס-ד, related to kindness and covenant loyalty',
        primarySense: 'Covenant faithfulness, steadfast love, loyalty',
        development: [
          'Ancient: loyalty in relationships',
          'Covenantal: divine faithfulness to Israel',
          'Wisdom literature: practical kindness',
          'Rabbinic: acts of loving-kindness (gemilut chasadim)'
        ]
      },
      semanticField: [
        { term: 'אהבה', relationship: 'related', frequency: 0.7, cooccurrenceScore: 0.6 },
        { term: 'רחמים', relationship: 'synonym', frequency: 0.8, cooccurrenceScore: 0.7 },
        { term: 'אמת', relationship: 'related', frequency: 0.9, cooccurrenceScore: 0.8 },
        { term: 'ברית', relationship: 'related', frequency: 0.6, cooccurrenceScore: 0.9 }
      ],
      collocations: [
        { phrase: 'חֶסֶד וֶאֱמֶת', frequency: 67, contexts: ['covenantal', 'psalmic'], significance: 'high' },
        { phrase: 'חֶסֶד יְהוָה', frequency: 89, contexts: ['liturgical', 'prophetic'], significance: 'high' },
        { phrase: 'עֹשֵׂה חֶסֶד', frequency: 23, contexts: ['ethical', 'narrative'], significance: 'medium' }
      ],
      passages: [],
      keyCharacteristics: ['Covenantal', 'Faithful', 'Loyal', 'Relational']
    }
    
    dispatch({ type: 'ADD_CONCEPT', payload: newConcept })
  }, [])

  const handleReset = useCallback(() => {
    dispatch({ type: 'SELECT_DIFFERENCE', payload: null })
    dispatch({ type: 'SET_HIGHLIGHT_MODE', payload: null })
    dispatch({ type: 'SELECT_WORD', payload: null })
  }, [])

  return (
    <div className={`min-h-screen bg-[#0D0D0F] p-6 ${className}`}>
      <ComparisonControls
        conceptCount={state.concepts.length}
        highlightMode={state.highlightMode}
        onHighlightModeChange={(mode) => dispatch({ type: 'SET_HIGHLIGHT_MODE', payload: mode })}
        onAddConcept={handleAddConcept}
        onReset={handleReset}
      />

      <div className="grid gap-6" style={{ 
        gridTemplateColumns: `repeat(${Math.max(1, state.concepts.length)}, 1fr)` 
      }}>
        <AnimatePresence>
          {state.concepts.map((concept) => (
            <LanguageColumn
              key={concept.id}
              concept={concept}
              expandedSections={state.expandedSections[concept.id] || {}}
              showAllCollocations={state.showAllCollocations[concept.id] || false}
              selectedWord={state.selectedWord}
              onToggleSection={(section) => dispatch({ 
                type: 'TOGGLE_SECTION', 
                payload: { conceptId: concept.id, section } 
              })}
              onWordSelect={(word) => dispatch({ type: 'SELECT_WORD', payload: word })}
              onToggleCollocations={() => dispatch({ type: 'TOGGLE_COLLOCATIONS', payload: concept.id })}
              onCollocationClick={(phrase) => console.log('Clicked collocation:', phrase)}
              onRemove={() => dispatch({ type: 'REMOVE_CONCEPT', payload: concept.id })}
            />
          ))}
        </AnimatePresence>
      </div>

      {state.concepts.length === 0 && (
        <motion.div
          className="text-center py-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-12 max-w-md mx-auto">
            <Search className="w-12 h-12 text-[#7C9885] mx-auto mb-4" />
            <h3 className="text-xl font-bold text-[#F5F3EF] mb-2">No Concepts Loaded</h3>
            <p className="text-[#7C9885] mb-6">
              Add concepts from different languages to begin comparative analysis.
            </p>
            <button
              onClick={handleAddConcept}
              className="bg-[#C9A962] text-black px-6 py-3 rounded-lg font-medium hover:bg-[#C9A962]/90 transition-colors inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Your First Concept
            </button>
          </div>
        </motion.div>
      )}

      <DifferenceHighlight
        differences={mockDifferences}
        activeIndex={state.selectedDifference}
        onNavigate={(index) => dispatch({ type: 'SELECT_DIFFERENCE', payload: index })}
        onClose={() => dispatch({ type: 'SELECT_DIFFERENCE', payload: null })}
      />

      {state.highlightMode === 'differences' && state.concepts.length > 1 && (
        <motion.div
          className="fixed bottom-6 right-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <button
            onClick={() => dispatch({ type: 'SELECT_DIFFERENCE', payload: 0 })}
            className="bg-[#C9A962] text-black px-4 py-2 rounded-lg font-medium shadow-lg hover:bg-[#C9A962]/90 transition-colors flex items-center gap-2"
          >
            <Zap className="w-4 h-4" />
            View Differences ({mockDifferences.length})
          </button>
        </motion.div>
      )}
    </div>
  )
}

// Named export for compatibility with existing imports
export { ComparativeFrames }
export default ComparativeFrames
