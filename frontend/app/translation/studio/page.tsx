'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Languages, 
  BookOpen, 
  Brain, 
  Zap, 
  History, 
  Users, 
  Target, 
  Sparkles,
  ChevronDown,
  Copy,
  Heart,
  MessageSquare,
  GitBranch,
  Search,
  Filter,
  Volume2,
  ExternalLink,
  RefreshCw,
  Settings,
  Save,
  Share2,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Clock,
  Lightbulb,
  Globe,
  Database,
  Layers
} from 'lucide-react'
import { MultiScaleView } from '@/components/innovations/multi_scale_view'
import { ComparativeFrames } from '@/components/innovations/comparative_frames'

interface Translation {
  id: string
  text: string
  confidence: number
  source: 'ai' | 'scholar' | 'traditional'
  author?: string
  context?: string
  notes?: string
  timestamp: Date
}

interface DictionaryEntry {
  word: string
  lemma: string
  definition: string
  etymology: string
  frequency: number
  contexts: string[]
  relatedTerms: string[]
}

interface SemanticContext {
  author: string
  work: string
  period: string
  genre: string
  philosophicalSchool?: string
}

const TranslationStudio = () => {
  const [sourceText, setSourceText] = useState('')
  const [selectedText, setSelectedText] = useState('')
  const [translations, setTranslations] = useState<Translation[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'translate' | 'context' | 'memory' | 'collaborate'>('translate')
  const [semanticContext, setSemanticContext] = useState<SemanticContext>({
    author: 'Aristotle',
    work: 'Nicomachean Ethics',
    period: 'Classical',
    genre: 'Philosophy'
  })
  const [showDictionary, setShowDictionary] = useState(false)
  const [dictionaryEntries, setDictionaryEntries] = useState<DictionaryEntry[]>([])
  const [translationHistory, setTranslationHistory] = useState<Translation[]>([])
  const [collaborativeInsights, setCollaborativeInsights] = useState([])
  const [consistencyWarnings, setConsistencyWarnings] = useState([])
  const [showAdvanced, setShowAdvanced] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Sample data for demonstration
  const mockTranslations: Translation[] = [
    {
      id: '1',
      text: 'Excellence, then, is not an act but a habit.',
      confidence: 0.95,
      source: 'ai',
      context: 'Aristotelian virtue ethics - emphasizing habituation',
      notes: 'Captures the key concept of hexis (settled disposition)',
      timestamp: new Date()
    },
    {
      id: '2',
      text: 'Virtue, therefore, is not a single action but a way of being.',
      confidence: 0.88,
      source: 'scholar',
      author: 'Dr. Sarah Mitchell',
      context: 'Alternative rendering emphasizing ontological aspect',
      notes: 'More literal to Greek philosophical terminology',
      timestamp: new Date()
    },
    {
      id: '3',
      text: 'So virtue is not an act, but a habit.',
      confidence: 0.75,
      source: 'traditional',
      author: 'W.D. Ross (1925)',
      context: 'Classical translation - widely cited',
      notes: 'Traditional rendering, somewhat dated style',
      timestamp: new Date()
    }
  ]

  const mockDictionary: DictionaryEntry[] = [
    {
      word: 'ἀρετή',
      lemma: 'ἀρετή, ἀρετῆς, ἡ',
      definition: 'excellence, virtue, goodness of any kind',
      etymology: 'From ἄριστος (best, noblest)',
      frequency: 847,
      contexts: ['ethics', 'politics', 'metaphysics'],
      relatedTerms: ['κακία', 'ἕξις', 'ἐνέργεια']
    },
    {
      word: 'ἕξις',
      lemma: 'ἕξις, ἕξεως, ἡ',
      definition: 'a having, holding; a state, condition; habit, disposition',
      etymology: 'From ἔχω (to have, hold)',
      frequency: 234,
      contexts: ['psychology', 'ethics', 'physics'],
      relatedTerms: ['διάθεσις', 'δύναμις', 'ἐνέργεια']
    }
  ]

  const handleTranslate = async () => {
    if (!sourceText.trim()) return
    
    setLoading(true)
    setError(null)
    
    try {
      // Simulate AI translation processing
      await new Promise(resolve => setTimeout(resolve, 2000))
      setTranslations(mockTranslations)
      setDictionaryEntries(mockDictionary)
    } catch (err) {
      setError('Translation failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleTextSelection = () => {
    if (textareaRef.current) {
      const start = textareaRef.current.selectionStart
      const end = textareaRef.current.selectionEnd
      const selected = sourceText.substring(start, end)
      if (selected) {
        setSelectedText(selected)
        setShowDictionary(true)
      }
    }
  }

  const copyTranslation = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const saveTranslation = (translation: Translation) => {
    setTranslationHistory(prev => [translation, ...prev])
  }

  return (
    <div className="min-h-screen bg-[#0D0D0F] text-[#F5F3EF]">
      {/* Header */}
      <div className="border-b border-white/10 bg-black/20 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#C9A962] to-[#8B7355] flex items-center justify-center">
                <Languages className="w-6 h-6 text-black" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-[#C9A962] to-[#8B7355] bg-clip-text text-transparent">
                  Context-Aware Translation Studio
                </h1>
                <p className="text-sm text-white/60">AI that understands what it's translating</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                className="px-4 py-2 bg-[#C9A962] text-black rounded-lg font-medium"
              >
                <Save className="w-4 h-4 inline mr-2" />
                Save Session
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                className="p-2 bg-white/5 border border-white/10 rounded-lg"
              >
                <Settings className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Context Selector */}
        <div className="mb-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center">
                <Brain className="w-5 h-5 mr-2 text-[#C9A962]" />
                Semantic Context
              </h3>
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="text-sm text-[#C9A962] flex items-center"
              >
                Advanced {showAdvanced ? <EyeOff className="w-4 h-4 ml-1" /> : <Eye className="w-4 h-4 ml-1" />}
              </motion.button>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm text-white/60 mb-2">Author</label>
                <select 
                  className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm"
                  value={semanticContext.author}
                  onChange={(e) => setSemanticContext(prev => ({...prev, author: e.target.value}))}
                >
                  <option value="Aristotle">Aristotle</option>
                  <option value="Plato">Plato</option>
                  <option value="Cicero">Cicero</option>
                  <option value="Homer">Homer</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-white/60 mb-2">Work</label>
                <select 
                  className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm"
                  value={semanticContext.work}
                  onChange={(e) => setSemanticContext(prev => ({...prev, work: e.target.value}))}
                >
                  <option value="Nicomachean Ethics">Nicomachean Ethics</option>
                  <option value="Politics">Politics</option>
                  <option value="Metaphysics">Metaphysics</option>
                  <option value="Poetics">Poetics</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-white/60 mb-2">Period</label>
                <select 
                  className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm"
                  value={semanticContext.period}
                  onChange={(e) => setSemanticContext(prev => ({...prev, period: e.target.value}))}
                >
                  <option value="Classical">Classical</option>
                  <option value="Hellenistic">Hellenistic</option>
                  <option value="Imperial">Imperial</option>
                  <option value="Late Antique">Late Antique</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-white/60 mb-2">Genre</label>
                <select 
                  className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm"
                  value={semanticContext.genre}
                  onChange={(e) => setSemanticContext(prev => ({...prev, genre: e.target.value}))}
                >
                  <option value="Philosophy">Philosophy</option>
                  <option value="Poetry">Poetry</option>
                  <option value="History">History</option>
                  <option value="Rhetoric">Rhetoric</option>
                </select>
              </div>
            </div>

            {showAdvanced && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-4 pt-4 border-t border-white/10"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-white/60 mb-2">Philosophical School</label>
                    <select className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm">
                      <option value="Peripatetic">Peripatetic</option>
                      <option value="Platonic">Platonic</option>
                      <option value="Stoic">Stoic</option>
                      <option value="Epicurean">Epicurean</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-white/60 mb-2">Translation Style</label>
                    <select className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm">
                      <option value="scholarly">Scholarly</option>
                      <option value="literal">Literal</option>
                      <option value="dynamic">Dynamic</option>
                      <option value="poetic">Poetic</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* Main Translation Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Input Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold flex items-center">
                <BookOpen className="w-5 h-5 mr-2 text-[#7C9885]" />
                Source Text
              </h3>
              <div className="flex items-center space-x-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className="p-2 bg-white/5 border border-white/10 rounded-lg"
                >
                  <Volume2 className="w-4 h-4" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className="p-2 bg-white/5 border border-white/10 rounded-lg"
                >
                  <Search className="w-4 h-4" />
                </motion.button>
              </div>
            </div>

            <div className="relative">
              <textarea
                ref={textareaRef}
                value={sourceText}
                onChange={(e) => setSourceText(e.target.value)}
                onSelect={handleTextSelection}
                placeholder="Paste your Greek or Latin text here..."
                className="w-full h-64 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4 text-lg leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-[#C9A962]/50"
                style={{ fontFamily: 'Georgia, serif' }}
              />
              
              {sourceText && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute bottom-4 right-4"
                >
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleTranslate}
                    disabled={loading}
                    className="px-6 py-3 bg-gradient-to-r from-[#C9A962] to-[#8B7355] text-black rounded-lg font-semibold flex items-center space-x-2 disabled:opacity-50"
                  >
                    {loading ? (
                      <RefreshCw className="w-5 h-5 animate-spin" />
                    ) : (
                      <Zap className="w-5 h-5" />
                    )}
                    <span>{loading ? 'Translating...' : 'Translate'}</span>
                  </motion.button>
                </motion.div>
              )}
            </div>

            {/* Sample text suggestions */}
            <div className="flex flex-wrap gap-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                onClick={() => setSourceText('ἔστιν ἄρα ἡ ἀρετὴ ἕξις προαιρετική')}
                className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-sm hover:bg-white/10"
              >
                Sample: Aristotle
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                onClick={() => setSourceText('μένε ἐσθλός περ ἐὼν καὶ ἐπὶ κρείουσι γένοιο')}
                className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-sm hover:bg-white/10"
              >
                Sample: Homer
              </motion.button>
            </div>
          </motion.div>

          {/* Translation Results */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold flex items-center">
                <Sparkles className="w-5 h-5 mr-2 text-[#C9A962]" />
                AI Translations
              </h3>
              <div className="flex items-center space-x-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className="p-2 bg-white/5 border border-white/10 rounded-lg"
                >
                  <Filter className="w-4 h-4" />
                </motion.button>
              </div>
            </div>

            <div className="space-y-3">
              <AnimatePresence>
                {loading && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 border-2 border-[#C9A962] border-t-transparent rounded-full animate-spin"></div>
                      <div className="space-y-2 flex-1">
                        <div className="h-4 bg-white/10 rounded animate-pulse"></div>
                        <div className="h-3 bg-white/5 rounded animate-pulse w-3/4"></div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-center space-x-3"
                  >
                    <AlertCircle className="w-5 h-5 text-red-400" />
                    <span className="text-red-200">{error}</span>
                  </motion.div>
                )}

                {translations.map((translation, index) => (
                  <motion.div
                    key={translation.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${
                          translation.source === 'ai' ? 'bg-[#C9A962]' :
                          translation.source === 'scholar' ? 'bg-[#7C9885]' :
                          'bg-[#8B7355]'
                        }`}></div>
                        <span className="text-sm font-medium capitalize">{translation.source}</span>
                        {translation.author && (
                          <span className="text-xs text-white/60">• {translation.author}</span>
                        )}
                      </div>
                      <div className="flex items-center space-x-1">
                        <div className="flex items-center space-x-1">
                          {[...Array(5)].map((_, i) => (
                            <div
                              key={i}
                              className={`w-1 h-3 rounded-full ${
                                i < Math.floor(translation.confidence * 5) 
                                  ? 'bg-[#C9A962]' 
                                  : 'bg-white/10'
                              }`}
                            ></div>
                          ))}
                        </div>
                        <span className="text-xs text-white/60 ml-2">
                          {Math.round(translation.confidence * 100)}%
                        </span>
                      </div>
                    </div>

                    <p className="text-lg leading-relaxed mb-3 font-serif">
                      {translation.text}
                    </p>

                    {translation.context && (
                      <p className="text-sm text-white/60 mb-3">{translation.context}</p>
                    )}

                    {translation.notes && (
                      <div className="bg-black/20 rounded-lg p-3 mb-3">
                        <p className="text-sm text-white/80">{translation.notes}</p>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          onClick={() => copyTranslation(translation.text)}
                          className="flex items-center space-x-1 text-sm text-white/60 hover:text-white"
                        >
                          <Copy className="w-4 h-4" />
                          <span>Copy</span>
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          onClick={() => saveTranslation(translation)}
                          className="flex items-center space-x-1 text-sm text-white/60 hover:text-white"
                        >
                          <Heart className="w-4 h-4" />
                          <span>Save</span>
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          className="flex items-center space-x-1 text-sm text-white/60 hover:text-white"
                        >
                          <MessageSquare className="w-4 h-4" />
                          <span>Discuss</span>
                        </motion.button>
                      </div>
                      <span className="text-xs text-white/40">
                        {translation.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {!loading && translations.length === 0 && sourceText && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12 text-white/60"
                >
                  <Lightbulb className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Enter some text and click translate to see AI-powered suggestions</p>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Innovation Components Section */}
        {translations.length > 0 && (
          <div className="space-y-8 mb-8">
            <MultiScaleView
              data={{
                word: selectedText || 'ἀρετή',
                sentence: sourceText || 'ἔστιν ἄρα ἡ ἀρετὴ ἕξις προαιρετική',
                paragraph: 'Full paragraph context would appear here...',
                chapter: 'Chapter context and cross-references...',
                work: 'Work-level thematic connections...'
              }}
            />

            <ComparativeFrames
              items={translations.map(t => ({
                id: t.id,
                title: `${t.source.charAt(0).toUpperCase() + t.source.slice(1)} Translation`,
                subtitle: t.author || 'AI Generated',
                content: t.text,
                metadata: {
                  confidence: t.confidence,
                  context: t.context,
                  timestamp: t.timestamp.toISOString()
                }
              }))}
            />
          </div>
        )}

        {/* Dictionary Panel */}
        <AnimatePresence>
          {showDictionary && selectedText && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-8"
            >
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold flex items-center">
                    <Database className="w-5 h-5 mr-2 text-[#7C9885]" />
                    Dictionary Lookup: {selectedText}
                  </h3>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    onClick={() => setShowDictionary(false)}
                    className="p-2 bg-white/5 border border-white/10 rounded-lg"
                  >
                    <EyeOff className="w-4 h-4" />
                  </motion.button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {dictionaryEntries.map((entry, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="space-y-4"
                    >
                      <div>
                        <h4 className="text-xl font-serif text-[#C9A962] mb-1">{entry.word}</h4>
                        <p className="text-sm text-white/60 font-mono">{entry.lemma}</p>
                      </div>

                      <div>
                        <h5 className="font-semibold text-sm mb-2">Definition</h5>
                        <p className="text-white/80">{entry.definition}</p>
                      </div>

                      <div>
                        <h5 className="font-semibold text-sm mb-2">Etymology</h5>
                        <p className="text-white/70 italic">{entry.etymology}</p>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <h5 className="font-semibold text-sm mb-1">Frequency</h5>
                          <div className="flex items-center space-x-2">
                            <div className="w-32 h-2 bg-white/10 rounded-full">
                              <div 
                                className="h-full bg-[#C9A962] rounded-full"
                                style={{ width: `${Math.min(entry.frequency / 1000 * 100, 100)}%` }}
                              ></div>
                            </div>
                            <span className="text-xs text-white/60">{entry.frequency}</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h5 className="font-semibold text-sm mb-2">Common Contexts</h5>
                        <div className="flex flex-wrap gap-2">
                          {entry.contexts.map((context, i) => (
                            <span 
                              key={i}
                              className="px-2 py-1 bg-white/10 rounded-lg text-xs"
                            >
                              {context}
                            </span>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Advanced Features Tabs */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
          <div className="flex border-b border-white/10">
            {[
              { id: 'translate', label: 'Smart Translate', icon: Brain },
              { id: 'context', label: 'Cross-References', icon: GitBranch },
              { id: 'memory', label: 'Translation Memory', icon: History },
              { id: 'collaborate', label: 'Collaborative', icon: Users }
            ].map(tab => (
              <motion.button
                key={tab.id}
                whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 px-6 py-4 flex items-center justify-center space-x-2 text-sm font-medium transition-colors ${
                  activeTab === tab.id 
                    ? 'text-[#C9A962] bg-white/5' 
                    : 'text-white/60 hover:text-white/80'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </motion.button>
            ))}
          </div>

          <div className="p-6">
            <AnimatePresence mode="wait">
              {activeTab === 'translate' && (
                <motion.div
                  key="translate"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <div>
                    <h4 className="text-lg font-semibold mb-3 flex items-center">
                      <Target className="w-5 h-5 mr-2 text-[#C9A962]" />
                      AI-Powered Translation Intelligence
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-black/20 rounded-lg p-4">
                        <h5 className="font-medium mb-2 flex items-center">
                          <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
                          Consistency Check
                        </h5>
                        <p className="text-sm text-white/70">AI tracks your translation choices and suggests consistent terminology across your work.</p>
                      </div>
                      <div className="bg-black/20 rounded-lg p-4">
                        <h5 className="font-medium mb-2 flex items-center">
                          <Globe className="w-4 h-4 mr-2 text-blue-400" />
                          Contextual Awareness
                        </h5>
                        <p className="text-sm text-white/70">Understands philosophical, literary, and historical contexts to provide nuanced translations.</p>
                      </div>
                      <div className="bg-black/20 rounded-lg p-4">
                        <h5 className="font-medium mb-2 flex items-center">
                          <Layers className="w-4 h-4 mr-2 text-purple-400" />
                          Multi-Level Analysis
                        </h5>
                        <p className="text-sm text-white/70">Analyzes word, sentence, paragraph, and document-level meanings simultaneously.</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'context' && (
                <motion.div
                  key="context"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <div>
                    <h4 className="text-lg font-semibold mb-3">Cross-References & Parallels</h4>
                    <div className="space-y-4">
                      <div className="bg-black/20 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h5 className="font-medium">Similar Passages</h5>
                          <span className="text-xs text-white/60">Found 12 matches</span>
                        </div>
                        <div className="space-y-3">
                          <div className="flex items-start space-x-3">
                            <div className="w-2 h-2 rounded-full bg-[#C9A962] mt-2"></div>
                            <div>
                              <p className="text-sm font-mono text-white/80">Pol. 1.2.1253a</p>
                              <p className="text-sm text-white/70">Similar usage of ἀρετή in political context</p>
                            </div>
                          </div>
                          <div className="flex items-start space-x-3">
                            <div className="w-2 h-2 rounded-full bg-[#7C9885] mt-2"></div>
                            <div>
                              <p className="text-sm font-mono text-white/80">Met. 9.9.1051b</p>
                              <p className="text-sm text-white/70">Metaphysical discussion of hexis and energeia</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'memory' && (
                <motion.div
                  key="memory"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <div>
                    <h4 className="text-lg font-semibold mb-3">Your Translation History</h4>
                    <div className="space-y-3">
                      {translationHistory.length > 0 ? (
                        translationHistory.map((translation, index) => (
                          <div key={index} className="bg-black/20 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium">{translation.source}</span>
                              <span className="text-xs text-white/60">
                                {translation.timestamp.toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-white/80 mb-2">{translation.text}</p>
                            {translation.notes && (
                              <p className="text-sm text-white/60">{translation.notes}</p>
                            )}
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8 text-white/60">
                          <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
                          <p>No saved translations yet. Save translations to build your personal memory.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'collaborate' && (
                <motion.div
                  key="collaborate"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <div>
                    <h4 className="text-lg font-semibold mb-3">Scholarly Collaboration</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-black/20 rounded-lg p-4">
                        <h5 className="font-medium mb-3">Active Discussions</h5>
                        <div className="space-y-3">
                          <div className="flex items-start space-x-3">
                            <div className="w-8 h-8 bg-[#C9A962] rounded-full flex items-center justify-center text-xs font-bold text-black">SM</div>
                            <div className="flex-1">
                              <p className="text-sm font-medium">Dr. Sarah Mitchell</p>
                              <p className="text-xs text-white/60">Discussing ἀρετή vs. excellence</p>
                            </div>
                            <span className="text-xs text-white/40">2h</span>
                          </div>
                          <div className="flex items-start space-x-3">
                            <div className="w-8 h-8 bg-[#7C9885] rounded-full flex items-center justify-center text-xs font-bold text-black">RP</div>
                            <div className="flex-1">
                              <p className="text-sm font-medium">Prof. Robert Park</p>
                              <p className="text-xs text-white/60">Hexis in Aristotelian context</p>
                            </div>
                            <span className="text-xs text-white/40">5h</span>
                          </div>
                        </div>
                      </div>
                      <div className="bg-black/20 rounded-lg p-4">
                        <h5 className="font-medium mb-3">Community Insights</h5>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Translation confidence</span>
                            <span className="text-sm text-[#C9A962]">94% agree</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Alternative readings</span>
                            <span className="text-sm text-[#7C9885]">3 variants</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Scholarly notes</span>
                            <span className="text-sm text-[#8B7355]">12 annotations</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TranslationStudio
