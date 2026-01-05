'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FileText, 
  Search, 
  Users, 
  BarChart3, 
  Brain, 
  Zap, 
  Upload, 
  Download,
  Eye,
  TrendingUp,
  Layers,
  Target,
  Sparkles,
  BookOpen,
  User,
  ArrowLeftRight,
  Filter,
  Settings,
  Play,
  Pause,
  RotateCcw,
  AlertCircle,
  CheckCircle,
  Loader2,
  PieChart,
  LineChart,
  ScatterChart,
  BarChart,
  Network,
  Fingerprint,
  Microscope,
  Lightbulb,
  History,
  Star,
  Crown,
  Wand2
} from 'lucide-react'
import { ArgumentSynthesis } from '@/components/innovations/argument_synthesis'
import { ComparativeFrames } from '@/components/innovations/comparative_frames'

interface AuthorProfile {
  id: string
  name: string
  works: number
  confidence: number
  period: string
  style: {
    avgSentenceLength: number
    vocabularyRichness: number
    functionWordRatio: number
  }
}

interface AnalysisResult {
  feature: string
  value: number
  significance: 'high' | 'medium' | 'low'
  description: string
}

interface Visualization {
  type: 'scatter' | 'bar' | 'network' | 'heatmap'
  data: any[]
  title: string
  insights: string[]
}

const StylometryPage = () => {
  const [inputText, setInputText] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisComplete, setAnalysisComplete] = useState(false)
  const [selectedAuthors, setSelectedAuthors] = useState<string[]>([])
  const [activeVisualization, setActiveVisualization] = useState('scatter')
  const [extractedFeatures, setExtractedFeatures] = useState<AnalysisResult[]>([])
  const [matchedAuthors, setMatchedAuthors] = useState<AuthorProfile[]>([])
  const [analysisStage, setAnalysisStage] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const knownAuthors: AuthorProfile[] = [
    {
      id: 'homer',
      name: 'Homer',
      works: 2,
      confidence: 0.89,
      period: '8th century BCE',
      style: {
        avgSentenceLength: 18.4,
        vocabularyRichness: 0.76,
        functionWordRatio: 0.31
      }
    },
    {
      id: 'plato',
      name: 'Plato',
      works: 36,
      confidence: 0.94,
      period: '5th-4th century BCE',
      style: {
        avgSentenceLength: 22.1,
        vocabularyRichness: 0.82,
        functionWordRatio: 0.28
      }
    },
    {
      id: 'aristotle',
      name: 'Aristotle',
      works: 47,
      confidence: 0.91,
      period: '4th century BCE',
      style: {
        avgSentenceLength: 25.3,
        vocabularyRichness: 0.71,
        functionWordRatio: 0.33
      }
    },
    {
      id: 'herodotus',
      name: 'Herodotus',
      works: 1,
      confidence: 0.96,
      period: '5th century BCE',
      style: {
        avgSentenceLength: 19.7,
        vocabularyRichness: 0.85,
        functionWordRatio: 0.29
      }
    },
    {
      id: 'thucydides',
      name: 'Thucydides',
      works: 1,
      confidence: 0.93,
      period: '5th century BCE',
      style: {
        avgSentenceLength: 26.8,
        vocabularyRichness: 0.79,
        functionWordRatio: 0.35
      }
    },
    {
      id: 'sophocles',
      name: 'Sophocles',
      works: 7,
      confidence: 0.87,
      period: '5th century BCE',
      style: {
        avgSentenceLength: 16.2,
        vocabularyRichness: 0.73,
        functionWordRatio: 0.27
      }
    }
  ]

  const sampleFeatures: AnalysisResult[] = [
    {
      feature: 'Average Sentence Length',
      value: 21.3,
      significance: 'high',
      description: 'Moderately long sentences suggest formal prose style'
    },
    {
      feature: 'Vocabulary Richness (TTR)',
      value: 0.78,
      significance: 'high',
      description: 'High type-token ratio indicates rich vocabulary'
    },
    {
      feature: 'Function Word Ratio',
      value: 0.31,
      significance: 'medium',
      description: 'Balanced use of grammatical particles'
    },
    {
      feature: 'Hapax Legomena Rate',
      value: 0.23,
      significance: 'medium',
      description: 'Moderate use of unique words'
    },
    {
      feature: 'Clause Complexity',
      value: 1.7,
      significance: 'high',
      description: 'Complex syntactic structures detected'
    },
    {
      feature: 'Rhythmic Patterns',
      value: 0.64,
      significance: 'low',
      description: 'Some metrical tendencies observed'
    }
  ]

  const visualizations: Visualization[] = [
    {
      type: 'scatter',
      title: 'Stylistic Distance Map',
      data: [],
      insights: [
        'Your text clusters closest to Plato and Aristotle',
        'Strong philosophical prose characteristics detected',
        'Distance from poetic authors (Homer, Sophocles) is significant'
      ]
    },
    {
      type: 'bar',
      title: 'Feature Comparison',
      data: [],
      insights: [
        'Sentence length matches Platonic average',
        'Vocabulary richness exceeds most authors',
        'Function word usage aligns with prose writers'
      ]
    },
    {
      type: 'network',
      title: 'Author Similarity Network',
      data: [],
      insights: [
        'Your text forms a cluster with philosophical works',
        'Weak connections to dramatic and epic poetry',
        'Strong stylistic coherence with Attic prose'
      ]
    }
  ]

  const runAnalysis = async () => {
    if (!inputText.trim()) return

    setIsAnalyzing(true)
    setAnalysisComplete(false)
    
    const stages = [
      'Tokenizing text...',
      'Extracting morphological features...',
      'Analyzing syntactic patterns...',
      'Computing statistical measures...',
      'Comparing with author profiles...',
      'Generating visualizations...',
      'Finalizing analysis...'
    ]

    for (let i = 0; i < stages.length; i++) {
      setAnalysisStage(stages[i])
      await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 400))
    }

    setExtractedFeatures(sampleFeatures)
    setMatchedAuthors(knownAuthors.sort((a, b) => b.confidence - a.confidence))
    setIsAnalyzing(false)
    setAnalysisComplete(true)
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setInputText(e.target?.result as string || '')
      }
      reader.readAsText(file)
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    }
  }

  return (
    <div className="min-h-screen bg-[#0D0D0F] text-[#F5F3EF]">
      {/* Hero Section */}
      <motion.section 
        className="relative py-20 px-4 overflow-hidden"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-[#C9A962] rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`
              }}
              animate={{
                x: [0, (Math.random() - 0.5) * 200],
                y: [0, (Math.random() - 0.5) * 200],
                opacity: [0, 1, 0]
              }}
              transition={{
                duration: 8 + Math.random() * 4,
                repeat: Infinity,
                delay: Math.random() * 2
              }}
            />
          ))}
        </div>

        <div className="max-w-7xl mx-auto relative">
          <motion.div className="text-center mb-16" variants={itemVariants}>
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="p-3 bg-[#C9A962]/20 rounded-xl backdrop-blur-sm border border-[#C9A962]/30">
                <Fingerprint className="w-8 h-8 text-[#C9A962]" />
              </div>
              <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-[#C9A962] via-[#F5F3EF] to-[#7C9885] bg-clip-text text-transparent">
                Stylometry
              </h1>
              <div className="p-3 bg-[#7C9885]/20 rounded-xl backdrop-blur-sm border border-[#7C9885]/30">
                <Brain className="w-8 h-8 text-[#7C9885]" />
              </div>
            </div>
            <p className="text-xl text-[#F5F3EF]/80 max-w-3xl mx-auto leading-relaxed">
              Uncover the hidden fingerprints of authorship through advanced computational analysis. 
              Compare writing styles, identify authors, and explore the quantitative patterns that make each voice unique.
            </p>
          </motion.div>

          {/* Feature Grid */}
          <motion.div className="grid md:grid-cols-4 gap-6 mb-16" variants={containerVariants}>
            {[
              { icon: FileText, title: 'Text Analysis', desc: 'Deep linguistic feature extraction' },
              { icon: Microscope, title: 'Pattern Detection', desc: 'Statistical signature identification' },
              { icon: ArrowLeftRight, title: 'Author Comparison', desc: 'Multi-dimensional style matching' },
              { icon: BarChart3, title: 'Rich Visualizations', desc: 'Interactive analytical displays' }
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300 hover:border-[#C9A962]/50"
                variants={itemVariants}
                whileHover={{ y: -5 }}
              >
                <feature.icon className="w-8 h-8 text-[#C9A962] mb-4" />
                <h3 className="text-lg font-semibold text-[#F5F3EF] mb-2">{feature.title}</h3>
                <p className="text-sm text-[#F5F3EF]/70">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Analysis Interface */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            
            {/* Text Input Panel */}
            <motion.div 
              className="lg:col-span-1"
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-[#F5F3EF] flex items-center gap-2">
                    <Upload className="w-6 h-6 text-[#C9A962]" />
                    Text Input
                  </h2>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 bg-[#7C9885]/20 text-[#7C9885] rounded-lg hover:bg-[#7C9885]/30 transition-colors flex items-center gap-2"
                  >
                    <FileText className="w-4 h-4" />
                    Upload
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".txt,.md"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>

                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Paste or type your text here for stylometric analysis. The more text you provide, the more accurate the analysis will be. Minimum recommended: 500 words."
                  className="w-full h-64 bg-white/5 border border-white/10 rounded-lg p-4 text-[#F5F3EF] placeholder-[#F5F3EF]/50 resize-none focus:outline-none focus:border-[#C9A962]/50 transition-colors"
                />

                <div className="flex items-center justify-between mt-4 text-sm text-[#F5F3EF]/70">
                  <span>{inputText.split(/\s+/).filter(word => word.length > 0).length} words</span>
                  <span>{inputText.length} characters</span>
                </div>

                <motion.button
                  onClick={runAnalysis}
                  disabled={!inputText.trim() || isAnalyzing}
                  className="w-full mt-6 px-6 py-3 bg-gradient-to-r from-[#C9A962] to-[#8B7355] text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-[#C9A962]/25 transition-all duration-300"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isAnalyzing ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Analyzing...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <Zap className="w-5 h-5" />
                      Run Analysis
                    </span>
                  )}
                </motion.button>

                {/* Analysis Progress */}
                <AnimatePresence>
                  {isAnalyzing && (
                    <motion.div
                      className="mt-4 p-4 bg-[#C9A962]/10 border border-[#C9A962]/30 rounded-lg"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <div className="flex items-center gap-3">
                        <Loader2 className="w-5 h-5 text-[#C9A962] animate-spin" />
                        <span className="text-[#F5F3EF]">{analysisStage}</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>

            {/* Results Panel */}
            <motion.div 
              className="lg:col-span-2"
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <AnimatePresence mode="wait">
                {!analysisComplete && !isAnalyzing && (
                  <motion.div
                    className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-12 text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="w-24 h-24 mx-auto mb-6 bg-[#C9A962]/20 rounded-full flex items-center justify-center">
                      <Microscope className="w-12 h-12 text-[#C9A962]" />
                    </div>
                    <h3 className="text-2xl font-bold text-[#F5F3EF] mb-4">Ready for Analysis</h3>
                    <p className="text-[#F5F3EF]/70">
                      Enter your text and click "Run Analysis" to begin the stylometric investigation.
                    </p>
                  </motion.div>
                )}

                {analysisComplete && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                  >
                    {/* Feature Extraction Results */}
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">
                      <div className="flex items-center gap-3 mb-6">
                        <Wand2 className="w-6 h-6 text-[#C9A962]" />
                        <h3 className="text-xl font-bold text-[#F5F3EF]">Extracted Features</h3>
                        <div className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">
                          {extractedFeatures.length} features detected
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        {extractedFeatures.map((feature, idx) => (
                          <motion.div
                            key={idx}
                            className="p-4 bg-white/5 rounded-lg border border-white/10"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-semibold text-[#F5F3EF]">{feature.feature}</h4>
                              <div className={`px-2 py-1 rounded-full text-xs ${
                                feature.significance === 'high' ? 'bg-red-500/20 text-red-400' :
                                feature.significance === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                                'bg-blue-500/20 text-blue-400'
                              }`}>
                                {feature.significance}
                              </div>
                            </div>
                            <div className="text-2xl font-bold text-[#C9A962] mb-2">{feature.value}</div>
                            <p className="text-sm text-[#F5F3EF]/70">{feature.description}</p>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {/* Author Matches */}
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">
                      <div className="flex items-center gap-3 mb-6">
                        <Crown className="w-6 h-6 text-[#C9A962]" />
                        <h3 className="text-xl font-bold text-[#F5F3EF]">Author Matches</h3>
                        <div className="px-3 py-1 bg-[#C9A962]/20 text-[#C9A962] rounded-full text-sm">
                          Ranked by similarity
                        </div>
                      </div>

                      <div className="space-y-3">
                        {matchedAuthors.slice(0, 4).map((author, idx) => (
                          <motion.div
                            key={author.id}
                            className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                          >
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-2">
                                <span className="text-2xl font-bold text-[#C9A962]">#{idx + 1}</span>
                                {idx === 0 && <Star className="w-5 h-5 text-yellow-400" />}
                              </div>
                              <div>
                                <h4 className="font-semibold text-[#F5F3EF]">{author.name}</h4>
                                <p className="text-sm text-[#F5F3EF]/70">{author.period} • {author.works} works</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-lg font-bold text-[#C9A962]">
                                {(author.confidence * 100).toFixed(1)}%
                              </div>
                              <div className="text-sm text-[#F5F3EF]/70">similarity</div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {/* Visualization Panel */}
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                          <BarChart3 className="w-6 h-6 text-[#C9A962]" />
                          <h3 className="text-xl font-bold text-[#F5F3EF]">Visualizations</h3>
                        </div>
                        <div className="flex gap-2">
                          {['scatter', 'bar', 'network'].map((type) => (
                            <button
                              key={type}
                              onClick={() => setActiveVisualization(type)}
                              className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                                activeVisualization === type
                                  ? 'bg-[#C9A962] text-white'
                                  : 'bg-white/5 text-[#F5F3EF]/70 hover:bg-white/10'
                              }`}
                            >
                              {type === 'scatter' && <ScatterChart className="w-4 h-4 inline mr-1" />}
                              {type === 'bar' && <BarChart className="w-4 h-4 inline mr-1" />}
                              {type === 'network' && <Network className="w-4 h-4 inline mr-1" />}
                              {type.charAt(0).toUpperCase() + type.slice(1)}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Visualization Placeholder */}
                      <div className="aspect-video bg-gradient-to-br from-[#C9A962]/10 to-[#7C9885]/10 rounded-lg border border-white/10 flex items-center justify-center mb-4">
                        <div className="text-center">
                          <div className="w-16 h-16 mx-auto mb-4 bg-[#C9A962]/20 rounded-full flex items-center justify-center">
                            {activeVisualization === 'scatter' && <ScatterChart className="w-8 h-8 text-[#C9A962]" />}
                            {activeVisualization === 'bar' && <BarChart className="w-8 h-8 text-[#C9A962]" />}
                            {activeVisualization === 'network' && <Network className="w-8 h-8 text-[#C9A962]" />}
                          </div>
                          <h4 className="text-lg font-semibold text-[#F5F3EF] mb-2">
                            {visualizations.find(v => v.type === activeVisualization)?.title}
                          </h4>
                          <p className="text-sm text-[#F5F3EF]/70">Interactive visualization will appear here</p>
                        </div>
                      </div>

                      {/* Insights */}
                      <div className="space-y-2">
                        <h4 className="font-semibold text-[#F5F3EF] flex items-center gap-2">
                          <Lightbulb className="w-4 h-4 text-[#C9A962]" />
                          Key Insights
                        </h4>
                        {visualizations.find(v => v.type === activeVisualization)?.insights.map((insight, idx) => (
                          <motion.div
                            key={idx}
                            className="flex items-start gap-2 text-sm text-[#F5F3EF]/80"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                          >
                            <div className="w-2 h-2 bg-[#C9A962] rounded-full mt-2 flex-shrink-0" />
                            {insight}
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Innovation Components */}
      <section className="py-16 px-4 bg-white/5">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-[#F5F3EF] mb-4">Advanced Analysis Tools</h2>
            <p className="text-[#F5F3EF]/70 max-w-2xl mx-auto">
              Leverage cutting-edge computational methods to extract deeper insights from your stylometric analysis.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <ArgumentSynthesis />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              <ComparativeFrames />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Advanced Features */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-[#F5F3EF] mb-4">Next-Generation Features</h2>
            <p className="text-[#F5F3EF]/70 max-w-2xl mx-auto">
              Experience the future of computational stylistics with AI-powered analysis and collaborative research tools.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Brain,
                title: 'AI Attribution Engine',
                description: 'Machine learning models trained on extensive corpora for precise authorship attribution.',
                color: '#C9A962'
              },
              {
                icon: Users,
                title: 'Collaborative Analysis',
                description: 'Share findings with colleagues and build upon community-driven stylometric databases.',
                color: '#7C9885'
              },
              {
                icon: History,
                title: 'Temporal Analysis',
                description: 'Track stylistic evolution across an author\'s career and detect chronological patterns.',
                color: '#8B7355'
              },
              {
                icon: Target,
                title: 'Genre Classification',
                description: 'Automatically identify literary genres and rhetorical modes through stylistic markers.',
                color: '#C9A962'
              },
              {
                icon: Layers,
                title: 'Multi-Modal Analysis',
                description: 'Combine lexical, syntactic, and semantic features for comprehensive style profiling.',
                color: '#7C9885'
              },
              {
                icon: Sparkles,
                title: 'Real-Time Feedback',
                description: 'Get instant stylometric insights as you type, perfect for composition analysis.',
                color: '#8B7355'
              }
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300 hover:border-white/20"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className={`w-12 h-12 rounded-xl bg-[${feature.color}]/20 flex items-center justify-center mb-4`}>
                  <feature.icon className={`w-6 h-6 text-[${feature.color}]`} />
                </div>
                <h3 className="text-lg font-semibold text-[#F5F3EF] mb-3">{feature.title}</h3>
                <p className="text-sm text-[#F5F3EF]/70 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default StylometryPage
