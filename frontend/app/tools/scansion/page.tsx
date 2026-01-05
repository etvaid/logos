'use client'

import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Scan, BookOpen, BarChart3, Grid3X3, Play, Pause, RotateCcw,
  ChevronRight, Eye, EyeOff, Download, Share2, Settings,
  Zap, Brain, Target, Layers, ArrowRight, MousePointer,
  TrendingUp, Activity, PieChart, LineChart, Wand2,
  FileText, Clock, Bookmark, History, Search, Filter
} from 'lucide-react'
import { ArgumentSynthesis } from '@/components/innovations/argument_synthesis'
import { ComparativeFrames } from '@/components/innovations/comparative_frames'

interface FootMark {
  type: 'stressed' | 'unstressed' | 'caesura' | 'diaeresis'
  position: number
  confidence: number
}

interface ScanResult {
  line: string
  pattern: string
  meter: string
  feet: FootMark[]
  anomalies: string[]
  confidence: number
}

interface MetricalStats {
  totalLines: number
  dominantMeter: string
  caesuraFrequency: number
  substitutions: { [key: string]: number }
  rhythmVariation: number
}

const sampleTexts = {
  homer: {
    title: "Homer - Iliad 1.1-10",
    text: `μῆνιν ἄειδε θεὰ Πηληϊάδεω Ἀχιλῆος
οὐλομένην, ἣ μυρί᾽ Ἀχαιοῖς ἄλγε᾽ ἔθηκε,
πολλὰς δ᾽ ἰφθίμους ψυχὰς Ἄϊδι προΐαψεν
ἡρώων, αὐτοὺς δὲ ἑλώρια τεῦχε κύνεσσιν
οἰωνοῖσί τε πᾶσι, Διὸς δ᾽ ἐτελείετο βουλή,
ἐξ οὗ δὴ τὰ πρῶτα διαστήτην ἐρίσαντε
Ἀτρεΐδης τε ἄναξ ἀνδρῶν καὶ δῖος Ἀχιλλεύς.
τίς τ᾽ ἄρ σφωε θεῶν ἔριδι ξυνέηκε μάχεσθαι;
Λητοῦς καὶ Διὸς υἱός· ὃ γὰρ βασιλῆϊ χολωθεὶς
νοῦσον ἀνὰ στρατὸν ὦρσε κακήν, ὀλέκοντο δὲ λαοί`
  },
  virgil: {
    title: "Virgil - Aeneid 1.1-10",
    text: `Arma virumque cano, Troiae qui primus ab oris
Italiam, fato profugus, Laviniaque venit
litora, multum ille et terris iactatus et alto
vi superum saevae memorem Iunonis ob iram;
multa quoque et bello passus, dum conderet urbem,
inferretque deos Latio, genus unde Latinum,
Albanique patres, atque altae moenia Romae.
Musa, mihi causas memora, quo numine laeso,
quidve dolens, regina deum tot volvere casus
insignem pietate virum, tot adire labores`
  },
  shakespeare: {
    title: "Shakespeare - Sonnet 18",
    text: `Shall I compare thee to a summer's day?
Thou art more lovely and more temperate:
Rough winds do shake the darling buds of May,
And summer's lease hath all too short a date:
Sometime too hot the eye of heaven shines,
And often is his gold complexion dimm'd;
And every fair from fair sometime declines,
By chance or nature's changing course untrimm'd;
But thy eternal summer shall not fade
Nor lose possession of that fair thou owest;`
  }
}

export default function ScansionTool() {
  const [inputText, setInputText] = useState('')
  const [selectedSample, setSelectedSample] = useState<keyof typeof sampleTexts | null>(null)
  const [scanResults, setScanResults] = useState<ScanResult[]>([])
  const [metricalStats, setMetricalStats] = useState<MetricalStats | null>(null)
  const [isScanning, setIsScanning] = useState(false)
  const [showPatterns, setShowPatterns] = useState(true)
  const [showFeet, setShowFeet] = useState(true)
  const [showStats, setShowStats] = useState(false)
  const [playingAnimation, setPlayingAnimation] = useState(false)
  const [currentLine, setCurrentLine] = useState(0)
  const [selectedMeter, setSelectedMeter] = useState('auto')
  const [scanningMode, setScanningMode] = useState<'auto' | 'manual' | 'assisted'>('auto')

  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Mock scanning function - in real implementation would call actual scansion engine
  const performScansion = async (text: string): Promise<{ results: ScanResult[], stats: MetricalStats }> => {
    return new Promise(resolve => {
      setTimeout(() => {
        const lines = text.split('\n').filter(line => line.trim())
        const results: ScanResult[] = lines.map((line, index) => ({
          line: line.trim(),
          pattern: '⏑ – ⏑ – | ⏑ – ⏑ – | ⏑ – ⏑ –',
          meter: 'Dactylic Hexameter',
          feet: [
            { type: 'unstressed', position: 0, confidence: 0.95 },
            { type: 'stressed', position: 2, confidence: 0.92 },
            { type: 'caesura', position: 15, confidence: 0.88 }
          ],
          anomalies: index === 2 ? ['Spondaic substitution in 3rd foot'] : [],
          confidence: 0.87 + Math.random() * 0.1
        }))

        const stats: MetricalStats = {
          totalLines: lines.length,
          dominantMeter: 'Dactylic Hexameter',
          caesuraFrequency: 0.78,
          substitutions: {
            'Spondaic': 12,
            'Trochaic': 3,
            'Anapestic': 1
          },
          rhythmVariation: 0.34
        }

        resolve({ results, stats })
      }, 2000)
    })
  }

  const handleScan = async () => {
    if (!inputText.trim()) return
    
    setIsScanning(true)
    try {
      const { results, stats } = await performScansion(inputText)
      setScanResults(results)
      setMetricalStats(stats)
    } catch (error) {
      console.error('Scansion failed:', error)
    }
    setIsScanning(false)
  }

  const loadSample = (key: keyof typeof sampleTexts) => {
    setSelectedSample(key)
    setInputText(sampleTexts[key].text)
    setScanResults([])
    setMetricalStats(null)
  }

  const playAnimation = () => {
    setPlayingAnimation(true)
    setCurrentLine(0)
    
    const interval = setInterval(() => {
      setCurrentLine(prev => {
        if (prev >= scanResults.length - 1) {
          setPlayingAnimation(false)
          clearInterval(interval)
          return 0
        }
        return prev + 1
      })
    }, 1500)
  }

  const renderScannedLine = (result: ScanResult, index: number) => {
    const isActive = playingAnimation && index === currentLine
    
    return (
      <motion.div
        key={index}
        className={`relative p-4 rounded-lg border transition-all duration-300 ${
          isActive 
            ? 'bg-[#C9A962]/10 border-[#C9A962]/30 shadow-lg shadow-[#C9A962]/20' 
            : 'bg-white/5 border-white/10 hover:bg-white/8'
        }`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
      >
        {/* Line number and confidence */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs text-[#7C9885] font-mono">
            Line {index + 1}
          </span>
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#8B7355]">
              {Math.round(result.confidence * 100)}% confidence
            </span>
            {result.anomalies.length > 0 && (
              <span className="text-xs bg-orange-500/20 text-orange-300 px-2 py-1 rounded">
                {result.anomalies.length} anomal{result.anomalies.length === 1 ? 'y' : 'ies'}
              </span>
            )}
          </div>
        </div>

        {/* Original text */}
        <div className="font-serif text-lg text-[#F5F3EF] mb-3 leading-relaxed">
          {result.line}
        </div>

        {/* Metrical pattern */}
        {showPatterns && (
          <div className="font-mono text-sm text-[#C9A962] mb-2 tracking-wider">
            {result.pattern}
          </div>
        )}

        {/* Feet visualization */}
        {showFeet && (
          <div className="flex items-center gap-1 mb-2 flex-wrap">
            {result.pattern.split(' ').map((foot, footIndex) => (
              <motion.span
                key={footIndex}
                className="px-2 py-1 bg-[#7C9885]/20 border border-[#7C9885]/30 rounded text-xs text-[#7C9885] font-mono"
                animate={isActive ? { scale: [1, 1.1, 1] } : {}}
                transition={{ delay: footIndex * 0.2 }}
              >
                {foot}
              </motion.span>
            ))}
          </div>
        )}

        {/* Meter identification */}
        <div className="text-sm text-[#8B7355]">
          <span className="font-medium">{result.meter}</span>
        </div>

        {/* Anomalies */}
        {result.anomalies.length > 0 && (
          <div className="mt-3 pt-3 border-t border-white/10">
            <div className="text-xs text-orange-300 font-medium mb-1">Anomalies:</div>
            {result.anomalies.map((anomaly, anomalyIndex) => (
              <div key={anomalyIndex} className="text-xs text-orange-200/80">
                • {anomaly}
              </div>
            ))}
          </div>
        )}
      </motion.div>
    )
  }

  const renderStats = () => {
    if (!metricalStats) return null

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Lines */}
        <motion.div 
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg p-6"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-[#C9A962]/20 rounded-lg">
              <FileText className="w-5 h-5 text-[#C9A962]" />
            </div>
            <div>
              <div className="text-2xl font-bold text-[#F5F3EF]">
                {metricalStats.totalLines}
              </div>
              <div className="text-sm text-[#8B7355]">Total Lines</div>
            </div>
          </div>
        </motion.div>

        {/* Dominant Meter */}
        <motion.div 
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg p-6"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-[#7C9885]/20 rounded-lg">
              <Activity className="w-5 h-5 text-[#7C9885]" />
            </div>
            <div>
              <div className="text-lg font-bold text-[#F5F3EF] leading-tight">
                {metricalStats.dominantMeter}
              </div>
              <div className="text-sm text-[#8B7355]">Dominant Meter</div>
            </div>
          </div>
        </motion.div>

        {/* Caesura Frequency */}
        <motion.div 
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg p-6"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-orange-500/20 rounded-lg">
              <TrendingUp className="w-5 h-5 text-orange-300" />
            </div>
            <div>
              <div className="text-2xl font-bold text-[#F5F3EF]">
                {Math.round(metricalStats.caesuraFrequency * 100)}%
              </div>
              <div className="text-sm text-[#8B7355]">Caesura Freq.</div>
            </div>
          </div>
        </motion.div>

        {/* Rhythm Variation */}
        <motion.div 
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg p-6"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <BarChart3 className="w-5 h-5 text-purple-300" />
            </div>
            <div>
              <div className="text-2xl font-bold text-[#F5F3EF]">
                {Math.round(metricalStats.rhythmVariation * 100)}%
              </div>
              <div className="text-sm text-[#8B7355]">Rhythm Variation</div>
            </div>
          </div>
        </motion.div>

        {/* Substitutions Chart */}
        <motion.div 
          className="md:col-span-2 lg:col-span-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg p-6"
          whileHover={{ scale: 1.01 }}
        >
          <h3 className="text-lg font-semibold text-[#F5F3EF] mb-4 flex items-center gap-2">
            <PieChart className="w-5 h-5 text-[#C9A962]" />
            Metrical Substitutions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(metricalStats.substitutions).map(([type, count]) => (
              <div key={type} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <span className="text-[#F5F3EF]">{type}</span>
                <div className="flex items-center gap-2">
                  <div 
                    className="h-2 bg-[#C9A962] rounded-full"
                    style={{ width: `${(count / 20) * 100}px` }}
                  />
                  <span className="text-[#8B7355] font-mono text-sm">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0D0D0F] text-[#F5F3EF]">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-[#C9A962]/5 via-transparent to-[#7C9885]/5" />
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#C9A962]/3 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#7C9885]/3 rounded-full blur-3xl" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 py-20">
          <motion.div
            className="text-center max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full px-6 py-3 mb-8">
              <Scan className="w-5 h-5 text-[#C9A962]" />
              <span className="text-[#8B7355] font-medium">Scholar's Workbench</span>
              <ChevronRight className="w-4 h-4 text-[#8B7355]" />
              <span className="text-[#C9A962] font-medium">Metrical Analysis</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-[#F5F3EF] via-[#C9A962] to-[#F5F3EF] bg-clip-text text-transparent">
              Scansion Engine
            </h1>
            
            <p className="text-xl text-[#8B7355] mb-8 leading-relaxed">
              Everything a serious scholar needs for metrical analysis
            </p>
            
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-[#7C9885]">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4" />
                Auto-scan text
              </div>
              <div className="flex items-center gap-2">
                <MousePointer className="w-4 h-4" />
                Mark feet
              </div>
              <div className="flex items-center gap-2">
                <Grid3X3 className="w-4 h-4" />
                Show patterns
              </div>
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Metrical statistics
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Interface */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Panel */}
          <div className="lg:col-span-1">
            <motion.div
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg p-6 sticky top-6"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-[#C9A962]" />
                Input Text
              </h2>

              {/* Sample Texts */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-[#8B7355] mb-3">Sample Texts</h3>
                <div className="space-y-2">
                  {Object.entries(sampleTexts).map(([key, sample]) => (
                    <button
                      key={key}
                      onClick={() => loadSample(key as keyof typeof sampleTexts)}
                      className={`w-full text-left p-3 rounded-lg border transition-all ${
                        selectedSample === key
                          ? 'bg-[#C9A962]/20 border-[#C9A962]/30 text-[#C9A962]'
                          : 'bg-white/5 border-white/10 hover:bg-white/8 text-[#F5F3EF]'
                      }`}
                    >
                      <div className="text-sm font-medium">{sample.title}</div>
                      <div className="text-xs text-[#8B7355] mt-1">
                        {sample.text.split('\n')[0].substring(0, 40)}...
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Text Input */}
              <div className="mb-6">
                <label className="text-sm font-medium text-[#8B7355] mb-3 block">
                  Paste your text here
                </label>
                <textarea
                  ref={textareaRef}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="w-full h-40 bg-white/5 border border-white/10 rounded-lg p-3 text-[#F5F3EF] placeholder-[#8B7355]/60 font-serif resize-none focus:outline-none focus:border-[#C9A962]/50"
                  placeholder="Enter ancient Greek, Latin, or English verse..."
                />
              </div>

              {/* Scan Settings */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-[#8B7355] mb-3">Scan Settings</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-[#8B7355] mb-1 block">Mode</label>
                    <select
                      value={scanningMode}
                      onChange={(e) => setScanningMode(e.target.value as 'auto' | 'manual' | 'assisted')}
                      className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-sm text-[#F5F3EF] focus:outline-none focus:border-[#C9A962]/50"
                    >
                      <option value="auto">Auto-detect</option>
                      <option value="assisted">AI-assisted</option>
                      <option value="manual">Manual</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-[#8B7355] mb-1 block">Expected Meter</label>
                    <select
                      value={selectedMeter}
                      onChange={(e) => setSelectedMeter(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-sm text-[#F5F3EF] focus:outline-none focus:border-[#C9A962]/50"
                    >
                      <option value="auto">Auto-detect</option>
                      <option value="dactylic">Dactylic Hexameter</option>
                      <option value="iambic">Iambic Pentameter</option>
                      <option value="trochaic">Trochaic Tetrameter</option>
                      <option value="anapestic">Anapestic Trimeter</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Scan Button */}
              <motion.button
                onClick={handleScan}
                disabled={!inputText.trim() || isScanning}
                className={`w-full py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-all ${
                  !inputText.trim() || isScanning
                    ? 'bg-white/5 border border-white/10 text-[#8B7355] cursor-not-allowed'
                    : 'bg-gradient-to-r from-[#C9A962] to-[#C9A962]/80 text-[#0D0D0F] hover:shadow-lg hover:shadow-[#C9A962]/30'
                }`}
                whileHover={!(!inputText.trim() || isScanning) ? { scale: 1.02 } : {}}
                whileTap={!(!inputText.trim() || isScanning) ? { scale: 0.98 } : {}}
              >
                {isScanning ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <Scan className="w-4 h-4" />
                    </motion.div>
                    Scanning...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4" />
                    Analyze Meter
                  </>
                )}
              </motion.button>
            </motion.div>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              {/* Controls */}
              {scanResults.length > 0 && (
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg p-4">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={playAnimation}
                        disabled={playingAnimation}
                        className="flex items-center gap-2 px-3 py-2 bg-[#C9A962]/20 border border-[#C9A962]/30 rounded-lg text-[#C9A962] hover:bg-[#C9A962]/30 transition-colors disabled:opacity-50"
                      >
                        {playingAnimation ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        {playingAnimation ? 'Playing' : 'Play Animation'}
                      </button>

                      <button
                        onClick={() => setCurrentLine(0)}
                        className="flex items-center gap-2 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-[#8B7355] hover:bg-white/8 transition-colors"
                      >
                        <RotateCcw className="w-4 h-4" />
                        Reset
                      </button>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setShowPatterns(!showPatterns)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                          showPatterns 
                            ? 'bg-[#7C9885]/20 border border-[#7C9885]/30 text-[#7C9885]'
                            : 'bg-white/5 border border-white/10 text-[#8B7355]'
                        }`}
                      >
                        {showPatterns ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                        Patterns
                      </button>

                      <button
                        onClick={() => setShowFeet(!showFeet)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                          showFeet 
                            ? 'bg-[#7C9885]/20 border border-[#7C9885]/30 text-[#7C9885]'
                            : 'bg-white/5 border border-white/10 text-[#8B7355]'
                        }`}
                      >
                        {showFeet ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                        Feet
                      </button>

                      <button
                        onClick={() => setShowStats(!showStats)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                          showStats 
                            ? 'bg-[#C9A962]/20 border border-[#C9A962]/30 text-[#C9A962]'
                            : 'bg-white/5 border border-white/10 text-[#8B7355]'
                        }`}
                      >
                        <BarChart3 className="w-4 h-4" />
                        Stats
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Results */}
              <AnimatePresence mode="wait">
                {isScanning && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg p-12"
                  >
                    <div className="text-center">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="w-12 h-12 border-2 border-[#C9A962]/30 border-t-[#C9A962] rounded-full mx-auto mb-4"
                      />
                      <h3 className="text-lg font-medium text-[#F5F3EF] mb-2">
                        Analyzing Metrical Patterns
                      </h3>
                      <p className="text-[#8B7355]">
                        AI is processing prosodic features and identifying rhythmic structures...
                      </p>
                    </div>
                  </motion.div>
                )}

                {!isScanning && scanResults.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg p-12"
                  >
                    <div className="text-center">
                      <Scan className="w-16 h-16 text-[#8B7355]/50 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-[#F5F3EF] mb-2">
                        Ready to Scan
                      </h3>
                      <p className="text-[#8B7355] mb-6">
                        Enter your text and click "Analyze Meter" to begin metrical analysis
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-md mx-auto">
                        <div className="text-center">
                          <div className="w-8 h-8 bg-[#C9A962]/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                            <Zap className="w-4 h-4 text-[#C9A962]" />
                          </div>
                          <p className="text-xs text-[#8B7355]">Auto-detect meters</p>
                        </div>
                        <div className="text-center">
                          <div className="w-8 h-8 bg-[#7C9885]/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                            <Target className="w-4 h-4 text-[#7C9885]" />
                          </div>
                          <p className="text-xs text-[#8B7355]">Mark cesuras</p>
                        </div>
                        <div className="text-center">
                          <div className="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                            <Brain className="w-4 h-4 text-orange-300" />
                          </div>
                          <p className="text-xs text-[#8B7355]">Find anomalies</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {!isScanning && scanResults.length > 0 && (
                  <div className="space-y-6">
                    {/* Stats Panel */}
                    {showStats && metricalStats && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                      >
                        {renderStats()}
                      </motion.div>
                    )}

                    {/* Scanned Lines */}
                    <div className="space-y-4">
                      <h3 className="text-xl font-semibold text-[#F5F3EF] flex items-center gap-2">
                        <Grid3X3 className="w-5 h-5 text-[#C9A962]" />
                        Scansion Results
                      </h3>
                      
                      <div className="space-y-4">
                        {scanResults.map((result, index) => renderScannedLine(result, index))}
                      </div>
                    </div>
                  </div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Innovation Components */}
      {scanResults.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <ArgumentSynthesis />
            <ComparativeFrames />
          </div>
        </section>
      )}

      {/* Export and Actions */}
      {scanResults.length > 0 && (
        <section className="border-t border-white/10 bg-white/2">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-[#8B7355]">
                <Clock className="w-4 h-4" />
                <span className="text-sm">Analysis completed • {scanResults.length} lines processed</span>
              </div>
              
              <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-[#8B7355] hover:bg-white/8 transition-colors">
                  <Bookmark className="w-4 h-4" />
                  Save Analysis
                </button>
                
                <button className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-[#8B7355] hover:bg-white/8 transition-colors">
                  <Download className="w-4 h-4" />
                  Export
                </button>
                
                <button className="flex items-center gap-2 px-4 py-2 bg-[#C9A962] text-[#0D0D0F] rounded-lg hover:bg-[#C9A962]/90 transition-colors font-medium">
                  <Share2 className="w-4 h-4" />
                  Share Results
                </button>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
