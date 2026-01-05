'use client'

import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  BookOpen, 
  GitBranch, 
  Edit3, 
  Layers, 
  Search, 
  Eye, 
  Download,
  Upload,
  Zap,
  Users,
  Brain,
  FileText,
  ChevronDown,
  ChevronRight,
  Plus,
  X,
  Settings,
  Clock,
  Star,
  Filter,
  ArrowRight,
  Sparkles,
  Network,
  Database,
  Microscope,
  Library,
  ScrollText,
  Target,
  Workflow
} from 'lucide-react'
import { ArgumentSynthesis } from '@/components/innovations/argument_synthesis'
import { ComparativeFrames } from '@/components/innovations/comparative_frames'

interface Variant {
  id: string
  manuscript: string
  reading: string
  confidence: number
  notes: string
  witnesses: string[]
}

interface CollationUnit {
  id: string
  reference: string
  lemma: string
  variants: Variant[]
  apparatus: string
  status: 'draft' | 'reviewed' | 'published'
}

interface Manuscript {
  id: string
  siglum: string
  name: string
  date: string
  family: string
  quality: number
  location: string
}

interface StemmaNode {
  id: string
  label: string
  type: 'archetype' | 'hyparchetype' | 'manuscript'
  x: number
  y: number
  children: string[]
}

export default function TextualCriticismPage() {
  const [activeTab, setActiveTab] = useState('collation')
  const [selectedProject, setSelectedProject] = useState('homer_iliad_1')
  const [collationUnits, setCollationUnits] = useState<CollationUnit[]>([])
  const [manuscripts, setManuscripts] = useState<Manuscript[]>([])
  const [stemmaNodes, setStemmaNodes] = useState<StemmaNode[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedUnit, setSelectedUnit] = useState<string | null>(null)
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([])
  const [showAiPanel, setShowAiPanel] = useState(false)

  // Initialize with sample data
  useEffect(() => {
    setManuscripts([
      { id: 'A', siglum: 'A', name: 'Venetus A', date: '10th c.', family: 'α', quality: 95, location: 'Venice' },
      { id: 'B', siglum: 'B', name: 'Venetus B', date: '11th c.', family: 'β', quality: 88, location: 'Venice' },
      { id: 'T', siglum: 'T', name: 'Townley', date: '11th c.', family: 'α', quality: 82, location: 'London' },
      { id: 'D', siglum: 'D', name: 'Laurentianus', date: '10th c.', family: 'γ', quality: 79, location: 'Florence' }
    ])

    setCollationUnits([
      {
        id: '1',
        reference: '1.1',
        lemma: 'μῆνιν ἄειδε',
        variants: [
          { id: 'v1', manuscript: 'A', reading: 'μῆνιν ἄειδε', confidence: 100, notes: 'Clear reading', witnesses: ['A', 'T'] },
          { id: 'v2', manuscript: 'B', reading: 'μῆνιν ἀείδω', confidence: 90, notes: 'First person', witnesses: ['B'] },
          { id: 'v3', manuscript: 'D', reading: 'μῆνιν ἄιδε', confidence: 85, notes: 'Contracted form', witnesses: ['D'] }
        ],
        apparatus: 'μῆνιν ἄειδε A T : ἀείδω B : ἄιδε D',
        status: 'reviewed'
      },
      {
        id: '2',
        reference: '1.5',
        lemma: 'ἥρωων',
        variants: [
          { id: 'v4', manuscript: 'A', reading: 'ἡρώων', confidence: 95, notes: 'Standard genitive', witnesses: ['A', 'B', 'T'] },
          { id: 'v5', manuscript: 'D', reading: 'ἡρόων', confidence: 70, notes: 'Unusual contraction', witnesses: ['D'] }
        ],
        apparatus: 'ἡρώων A B T : ἡρόων D',
        status: 'draft'
      }
    ])

    setStemmaNodes([
      { id: 'omega', label: 'Ω', type: 'archetype', x: 400, y: 50, children: ['alpha', 'beta'] },
      { id: 'alpha', label: 'α', type: 'hyparchetype', x: 200, y: 150, children: ['A', 'T'] },
      { id: 'beta', label: 'β', type: 'hyparchetype', x: 600, y: 150, children: ['B', 'D'] },
      { id: 'A', label: 'A', type: 'manuscript', x: 150, y: 250, children: [] },
      { id: 'T', label: 'T', type: 'manuscript', x: 250, y: 250, children: [] },
      { id: 'B', label: 'B', type: 'manuscript', x: 550, y: 250, children: [] },
      { id: 'D', label: 'D', type: 'manuscript', x: 650, y: 250, children: [] }
    ])
  }, [])

  const CollationTool = () => (
    <div className="space-y-6">
      {/* Control Panel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-[#F5F3EF] mb-2">Collation Workspace</h3>
            <p className="text-white/70">Compare manuscript readings with AI assistance</p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowAiPanel(!showAiPanel)}
              className="flex items-center px-4 py-2 bg-[#C9A962]/20 border border-[#C9A962]/30 rounded-xl hover:bg-[#C9A962]/30 transition-colors"
            >
              <Brain className="h-4 w-4 text-[#C9A962] mr-2" />
              <span className="text-[#C9A962] font-medium">AI Assistant</span>
            </button>
            <button className="flex items-center px-4 py-2 bg-[#7C9885]/20 border border-[#7C9885]/30 rounded-xl hover:bg-[#7C9885]/30 transition-colors">
              <Upload className="h-4 w-4 text-[#7C9885] mr-2" />
              <span className="text-[#7C9885] font-medium">Import</span>
            </button>
            <button className="flex items-center px-4 py-2 bg-[#8B7355]/20 border border-[#8B7355]/30 rounded-xl hover:bg-[#8B7355]/30 transition-colors">
              <Download className="h-4 w-4 text-[#8B7355] mr-2" />
              <span className="text-[#8B7355] font-medium">Export</span>
            </button>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
            <input
              type="text"
              placeholder="Search by reference, lemma, or reading..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/20 rounded-xl text-[#F5F3EF] placeholder-white/50 focus:border-[#C9A962] focus:outline-none"
            />
          </div>
          <button className="flex items-center px-4 py-3 bg-white/5 border border-white/20 rounded-xl hover:bg-white/10 transition-colors">
            <Filter className="h-4 w-4 text-white/70 mr-2" />
            <span className="text-white/70">Filter</span>
          </button>
        </div>
      </motion.div>

      {/* Collation Units */}
      <div className="space-y-4">
        {collationUnits.map((unit, index) => (
          <motion.div
            key={unit.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <span className="text-[#C9A962] font-bold text-lg">{unit.reference}</span>
                  <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                    unit.status === 'published' ? 'bg-green-500/20 text-green-400' :
                    unit.status === 'reviewed' ? 'bg-blue-500/20 text-blue-400' :
                    'bg-orange-500/20 text-orange-400'
                  }`}>
                    {unit.status}
                  </span>
                </div>
                <p className="text-[#F5F3EF] text-lg font-medium">{unit.lemma}</p>
              </div>
              <button
                onClick={() => setSelectedUnit(selectedUnit === unit.id ? null : unit.id)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                {selectedUnit === unit.id ? 
                  <ChevronDown className="h-5 w-5 text-white/70" /> :
                  <ChevronRight className="h-5 w-5 text-white/70" />
                }
              </button>
            </div>

            <AnimatePresence>
              {selectedUnit === unit.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-4"
                >
                  {/* Variants */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {unit.variants.map((variant) => (
                      <div
                        key={variant.id}
                        className="bg-white/5 border border-white/20 rounded-xl p-4"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[#C9A962] font-bold">{variant.manuscript}</span>
                          <div className="flex items-center">
                            <div className={`w-2 h-2 rounded-full mr-2 ${
                              variant.confidence >= 90 ? 'bg-green-400' :
                              variant.confidence >= 70 ? 'bg-yellow-400' : 'bg-red-400'
                            }`} />
                            <span className="text-xs text-white/70">{variant.confidence}%</span>
                          </div>
                        </div>
                        <p className="text-[#F5F3EF] font-medium mb-2">{variant.reading}</p>
                        <p className="text-white/60 text-sm mb-2">{variant.notes}</p>
                        <div className="flex flex-wrap gap-1">
                          {variant.witnesses.map((witness) => (
                            <span
                              key={witness}
                              className="px-2 py-1 bg-[#7C9885]/20 text-[#7C9885] text-xs rounded-lg"
                            >
                              {witness}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Apparatus */}
                  <div className="bg-[#C9A962]/10 border border-[#C9A962]/20 rounded-xl p-4">
                    <h4 className="text-[#C9A962] font-medium mb-2">Critical Apparatus</h4>
                    <p className="text-[#F5F3EF] font-mono">{unit.apparatus}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      {/* AI Assistant Panel */}
      <AnimatePresence>
        {showAiPanel && (
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            className="fixed right-6 top-24 bottom-6 w-80 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 z-50"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-[#F5F3EF]">AI Assistant</h3>
              <button
                onClick={() => setShowAiPanel(false)}
                className="p-1 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="h-4 w-4 text-white/70" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="bg-[#C9A962]/10 border border-[#C9A962]/20 rounded-xl p-4">
                <div className="flex items-center mb-2">
                  <Sparkles className="h-4 w-4 text-[#C9A962] mr-2" />
                  <span className="text-[#C9A962] font-medium">Suggestions</span>
                </div>
                <ul className="space-y-2 text-sm text-white/80">
                  <li>• Consider dialectal variation in μῆνιν reading</li>
                  <li>• Check parallel passages in Odyssey</li>
                  <li>• Review palaeographic evidence for ἄιδε</li>
                </ul>
              </div>
              
              <div className="bg-[#7C9885]/10 border border-[#7C9885]/20 rounded-xl p-4">
                <div className="flex items-center mb-2">
                  <Target className="h-4 w-4 text-[#7C9885] mr-2" />
                  <span className="text-[#7C9885] font-medium">Similar Patterns</span>
                </div>
                <p className="text-sm text-white/80">Found 3 similar variant patterns in other passages</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )

  const VariantEditor = () => (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
      >
        <h3 className="text-xl font-bold text-[#F5F3EF] mb-6">Variant Editor</h3>
        
        {/* Editor Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Manuscript Panel */}
          <div className="lg:col-span-2">
            <div className="bg-white/5 border border-white/20 rounded-xl p-4 mb-4">
              <h4 className="text-[#C9A962] font-medium mb-3">Manuscripts</h4>
              <div className="grid grid-cols-2 gap-4">
                {manuscripts.map((ms) => (
                  <div
                    key={ms.id}
                    className="bg-white/5 border border-white/20 rounded-lg p-3 hover:bg-white/10 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[#F5F3EF] font-bold">{ms.siglum}</span>
                      <div className="flex items-center">
                        <Star className="h-3 w-3 text-yellow-400 mr-1" />
                        <span className="text-xs text-white/70">{ms.quality}%</span>
                      </div>
                    </div>
                    <p className="text-white/80 text-sm mb-1">{ms.name}</p>
                    <div className="flex items-center justify-between text-xs text-white/60">
                      <span>{ms.date}</span>
                      <span className="px-2 py-1 bg-[#7C9885]/20 text-[#7C9885] rounded">
                        {ms.family}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Reading Input */}
            <div className="bg-white/5 border border-white/20 rounded-xl p-4">
              <h4 className="text-[#C9A962] font-medium mb-3">Add New Variant</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-white/70 text-sm mb-2">Reference</label>
                  <input
                    type="text"
                    placeholder="e.g., 1.15"
                    className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-[#F5F3EF] placeholder-white/50 focus:border-[#C9A962] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-white/70 text-sm mb-2">Reading</label>
                  <input
                    type="text"
                    placeholder="Enter the variant reading..."
                    className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-[#F5F3EF] placeholder-white/50 focus:border-[#C9A962] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-white/70 text-sm mb-2">Notes</label>
                  <textarea
                    placeholder="Add notes about this variant..."
                    rows={3}
                    className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-lg text-[#F5F3EF] placeholder-white/50 focus:border-[#C9A962] focus:outline-none resize-none"
                  />
                </div>
                <button className="w-full px-4 py-2 bg-[#C9A962] text-[#0D0D0F] font-medium rounded-lg hover:bg-[#C9A962]/90 transition-colors">
                  Add Variant
                </button>
              </div>
            </div>
          </div>

          {/* Tools Panel */}
          <div>
            <div className="bg-white/5 border border-white/20 rounded-xl p-4">
              <h4 className="text-[#7C9885] font-medium mb-3">Editor Tools</h4>
              <div className="space-y-3">
                <button className="w-full flex items-center px-3 py-2 bg-white/5 border border-white/20 rounded-lg hover:bg-white/10 transition-colors">
                  <Microscope className="h-4 w-4 text-[#C9A962] mr-2" />
                  <span className="text-white/80 text-sm">Paleographic Analysis</span>
                </button>
                <button className="w-full flex items-center px-3 py-2 bg-white/5 border border-white/20 rounded-lg hover:bg-white/10 transition-colors">
                  <Network className="h-4 w-4 text-[#7C9885] mr-2" />
                  <span className="text-white/80 text-sm">Witness Relationships</span>
                </button>
                <button className="w-full flex items-center px-3 py-2 bg-white/5 border border-white/20 rounded-lg hover:bg-white/10 transition-colors">
                  <Database className="h-4 w-4 text-[#8B7355] mr-2" />
                  <span className="text-white/80 text-sm">Parallel Search</span>
                </button>
                <button className="w-full flex items-center px-3 py-2 bg-white/5 border border-white/20 rounded-lg hover:bg-white/10 transition-colors">
                  <Brain className="h-4 w-4 text-purple-400 mr-2" />
                  <span className="text-white/80 text-sm">AI Suggestions</span>
                </button>
              </div>
            </div>

            <div className="bg-white/5 border border-white/20 rounded-xl p-4 mt-4">
              <h4 className="text-[#8B7355] font-medium mb-3">Recent Activity</h4>
              <div className="space-y-2">
                {[
                  { action: 'Added variant', ref: '1.5', time: '2 min ago' },
                  { action: 'Updated apparatus', ref: '1.3', time: '15 min ago' },
                  { action: 'Reviewed unit', ref: '1.1', time: '1 hour ago' }
                ].map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 bg-white/5 rounded-lg"
                  >
                    <div>
                      <p className="text-white/80 text-sm">{activity.action}</p>
                      <p className="text-[#C9A962] text-xs">{activity.ref}</p>
                    </div>
                    <span className="text-white/60 text-xs">{activity.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Innovation Components */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <ArgumentSynthesis />
      </motion.div>
    </div>
  )

  const ApparatusGenerator = () => (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-[#F5F3EF] mb-2">Apparatus Generator</h3>
            <p className="text-white/70">Generate critical apparatus automatically</p>
          </div>
          <div className="flex items-center space-x-3">
            <button className="flex items-center px-4 py-2 bg-[#C9A962]/20 border border-[#C9A962]/30 rounded-xl hover:bg-[#C9A962]/30 transition-colors">
              <Zap className="h-4 w-4 text-[#C9A962] mr-2" />
              <span className="text-[#C9A962] font-medium">Auto Generate</span>
            </button>
            <button className="flex items-center px-4 py-2 bg-[#7C9885]/20 border border-[#7C9885]/30 rounded-xl hover:bg-[#7C9885]/30 transition-colors">
              <Settings className="h-4 w-4 text-[#7C9885] mr-2" />
              <span className="text-[#7C9885] font-medium">Configure</span>
            </button>
          </div>
        </div>

        {/* Configuration Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white/5 border border-white/20 rounded-xl p-4">
            <h4 className="text-[#C9A962] font-medium mb-3">Apparatus Style</h4>
            <div className="space-y-3">
              {[
                { id: 'oxford', name: 'Oxford Classical Texts', selected: true },
                { id: 'teubner', name: 'Teubner', selected: false },
                { id: 'loeb', name: 'Loeb Classical Library', selected: false },
                { id: 'custom', name: 'Custom Style', selected: false }
              ].map((style) => (
                <label key={style.id} className="flex items-center">
                  <input
                    type="radio"
                    name="style"
                    defaultChecked={style.selected}
                    className="mr-3 text-[#C9A962]"
                  />
                  <span className="text-white/80">{style.name}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="bg-white/5 border border-white/20 rounded-xl p-4">
            <h4 className="text-[#7C9885] font-medium mb-3">Options</h4>
            <div className="space-y-3">
              {[
                'Include manuscript sigla',
                'Show confidence levels',
                'Group by manuscript family',
                'Include paleographic notes'
              ].map((option, index) => (
                <label key={index} className="flex items-center">
                  <input
                    type="checkbox"
                    defaultChecked={index < 2}
                    className="mr-3 text-[#7C9885]"
                  />
                  <span className="text-white/80">{option}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Generated Apparatus Preview */}
        <div className="bg-white/5 border border-white/20 rounded-xl p-4">
          <h4 className="text-[#8B7355] font-medium mb-3">Preview</h4>
          <div className="bg-[#0D0D0F]/50 border border-white/10 rounded-lg p-4 font-mono text-sm">
            <div className="space-y-2 text-[#F5F3EF]">
              <p>1.1 μῆνιν ἄειδε A T : ἀείδω B : ἄιδε D</p>
              <p>1.5 ἡρώων A B T : ἡρόων D</p>
              <p>1.7 πολλὰς δὲ A B : πολλὰς τε T D</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Comparative Analysis */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <ComparativeFrames />
      </motion.div>
    </div>
  )

  const StemmaBuilder = () => (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-[#F5F3EF] mb-2">Stemma Builder</h3>
            <p className="text-white/70">Visualize manuscript relationships</p>
          </div>
          <div className="flex items-center space-x-3">
            <button className="flex items-center px-4 py-2 bg-[#C9A962]/20 border border-[#C9A962]/30 rounded-xl hover:bg-[#C9A962]/30 transition-colors">
              <Network className="h-4 w-4 text-[#C9A962] mr-2" />
              <span className="text-[#C9A962] font-medium">Auto Layout</span>
            </button>
            <button className="flex items-center px-4 py-2 bg-[#7C9885]/20 border border-[#7C9885]/30 rounded-xl hover:bg-[#7C9885]/30 transition-colors">
              <Plus className="h-4 w-4 text-[#7C9885] mr-2" />
              <span className="text-[#7C9885] font-medium">Add Node</span>
            </button>
            <button className="flex items-center px-4 py-2 bg-[#8B7355]/20 border border-[#8B7355]/30 rounded-xl hover:bg-[#8B7355]/30 transition-colors">
              <Download className="h-4 w-4 text-[#8B7355] mr-2" />
              <span className="text-[#8B7355] font-medium">Export SVG</span>
            </button>
          </div>
        </div>

        {/* Stemma Canvas */}
        <div className="bg-white/5 border border-white/20 rounded-xl p-6 mb-6">
          <div className="relative h-96 bg-[#0D0D0F]/50 rounded-lg overflow-hidden">
            <svg className="w-full h-full" viewBox="0 0 800 400">
              {/* Connections */}
              {stemmaNodes.map(node => 
                node.children.map(childId => {
                  const child = stemmaNodes.find(n => n.id === childId)
                  if (!child) return null
                  return (
                    <line
                      key={`${node.id}-${childId}`}
                      x1={node.x}
                      y1={node.y}
                      x2={child.x}
                      y2={child.y}
                      stroke="#C9A962"
                      strokeWidth="2"
                      opacity="0.6"
                    />
                  )
                })
              )}
              
              {/* Nodes */}
              {stemmaNodes.map(node => (
                <g key={node.id}>
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={node.type === 'manuscript' ? 25 : 30}
                    fill={
                      node.type === 'archetype' ? '#C9A962' :
                      node.type === 'hyparchetype' ? '#7C9885' :
                      '#8B7355'
                    }
                    fillOpacity="0.3"
                    stroke={
                      node.type === 'archetype' ? '#C9A962' :
                      node.type === 'hyparchetype' ? '#7C9885' :
                      '#8B7355'
                    }
                    strokeWidth="2"
                    className="cursor-pointer hover:fill-opacity-50 transition-all"
                  />
                  <text
                    x={node.x}
                    y={node.y + 5}
                    textAnchor="middle"
                    className="fill-[#F5F3EF] font-bold text-sm pointer-events-none"
                  >
                    {node.label}
                  </text>
                </g>
              ))}
            </svg>
          </div>
        </div>

        {/* Node Properties */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white/5 border border-white/20 rounded-xl p-4">
            <h4 className="text-[#C9A962] font-medium mb-3">Manuscript Properties</h4>
            <div className="space-y-3">
              {manuscripts.map((ms) => (
                <div
                  key={ms.id}
                  className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
                >
                  <div>
                    <span className="text-[#F5F3EF] font-medium">{ms.siglum}</span>
                    <span className="text-white/60 ml-2">{ms.name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-1 bg-[#7C9885]/20 text-[#7C9885] text-xs rounded">
                      {ms.family}
                    </span>
                    <span className="text-white/60 text-xs">{ms.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white/5 border border-white/20 rounded-xl p-4">
            <h4 className="text-[#7C9885] font-medium mb-3">Relationship Analysis</h4>
            <div className="space-y-3">
              <div className="p-3 bg-[#C9A962]/10 border border-[#C9A962]/20 rounded-lg">
                <div className="flex items-center mb-2">
                  <Workflow className="h-4 w-4 text-[#C9A962] mr-2" />
                  <span className="text-[#C9A962] font-medium">α Family</span>
                </div>
                <p className="text-white/80 text-sm">Strong agreement between A and T (94% variants)</p>
              </div>
              <div className="p-3 bg-[#7C9885]/10 border border-[#7C9885]/20 rounded-lg">
                <div className="flex items-center mb-2">
                  <Workflow className="h-4 w-4 text-[#7C9885] mr-2" />
                  <span className="text-[#7C9885] font-medium">β Family</span>
                </div>
                <p className="text-white/80 text-sm">B and D show independent development</p>
              </div>
              <div className="p-3 bg-[#8B7355]/10 border border-[#8B7355]/20 rounded-lg">
                <div className="flex items-center mb-2">
                  <Target className="h-4 w-4 text-[#8B7355] mr-2" />
                  <span className="text-[#8B7355] font-medium">Contamination</span>
                </div>
                <p className="text-white/80 text-sm">Possible cross-influence between families</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )

  const tabs = [
    { id: 'collation', name: 'Collation Tool', icon: BookOpen, component: CollationTool },
    { id: 'editor', name: 'Variant Editor', icon: Edit3, component: VariantEditor },
    { id: 'apparatus', name: 'Apparatus Generator', icon: Layers, component: ApparatusGenerator },
    { id: 'stemma', name: 'Stemma Builder', icon: GitBranch, component: StemmaBuilder }
  ]

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component || CollationTool

  return (
    <div className="min-h-screen bg-[#0D0D0F] text-[#F5F3EF]">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-b border-white/10 bg-white/5 backdrop-blur-xl sticky top-0 z-40"
      >
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-[#F5F3EF] mb-2">
                Textual Criticism
              </h1>
              <p className="text-white/70 text-lg">
                Everything a serious scholar needs
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={selectedProject}
                onChange={(e) => setSelectedProject(e.target.value)}
                className="px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-[#F5F3EF] focus:border-[#C9A962] focus:outline-none"
              >
                <option value="homer_iliad_1">Homer, Iliad 1</option>
                <option value="homer_odyssey_1">Homer, Odyssey 1</option>
                <option value="virgil_aeneid_1">Virgil, Aeneid 1</option>
              </select>
              <button className="flex items-center px-4 py-2 bg-[#C9A962] text-[#0D0D0F] font-medium rounded-xl hover:bg-[#C9A962]/90 transition-colors">
                <Users className="h-4 w-4 mr-2" />
                Collaborate
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex items-center space-x-1 bg-white/5 p-2 rounded-2xl mb-8">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center px-6 py-3 rounded-xl font-medium transition-all ${
                  activeTab === tab.id
                    ? 'text-[#0D0D0F] bg-[#C9A962]'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Icon className="h-4 w-4 mr-2" />
                {tab.name}
              </motion.button>
            )
          })}
        </div>

        {/* Main Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <ActiveComponent />
        </motion.div>
      </div>
    </div>
  )
}
