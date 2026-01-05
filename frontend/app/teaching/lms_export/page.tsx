'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Download, 
  Upload, 
  Settings, 
  CheckCircle, 
  AlertCircle,
  FileText,
  BookOpen,
  Users,
  Zap,
  ArrowRight,
  Play,
  Pause,
  RotateCcw,
  Eye,
  Code,
  Globe,
  Shield,
  Clock,
  Target,
  Layers,
  Box,
  FileDown,
  ExternalLink,
  Wrench,
  BookMarked,
  GraduationCap,
  Star,
  TrendingUp,
  Database,
  Cpu,
  Network,
  HardDrive
} from 'lucide-react'
import { MultiScaleView } from '@/components/innovations/multi_scale_view'
import { NarrativeTimeline } from '@/components/innovations/narrative_timeline'

interface ExportJob {
  id: string
  title: string
  format: string
  platform: string
  status: 'queued' | 'processing' | 'completed' | 'failed'
  progress: number
  createdAt: Date
  size?: string
  downloadUrl?: string
}

interface LMSPlatform {
  id: string
  name: string
  logo: string
  formats: string[]
  features: string[]
  marketShare: number
  complexity: 'Simple' | 'Moderate' | 'Advanced'
  setupTime: string
}

const lmsPlatforms: LMSPlatform[] = [
  {
    id: 'canvas',
    name: 'Canvas',
    logo: '🎨',
    formats: ['SCORM 1.2', 'SCORM 2004', 'xAPI', 'QTI', 'Common Cartridge'],
    features: ['Rich Content', 'SpeedGrader', 'Analytics', 'Mobile App'],
    marketShare: 32,
    complexity: 'Simple',
    setupTime: '2 minutes'
  },
  {
    id: 'blackboard',
    name: 'Blackboard',
    logo: '⬛',
    formats: ['SCORM 1.2', 'SCORM 2004', 'QTI', 'WebCT'],
    features: ['Grade Center', 'SafeAssign', 'Collaborate', 'Mobile Learn'],
    marketShare: 28,
    complexity: 'Moderate',
    setupTime: '5 minutes'
  },
  {
    id: 'moodle',
    name: 'Moodle',
    logo: '🎓',
    formats: ['SCORM 1.2', 'SCORM 2004', 'xAPI', 'IMS', 'AICC'],
    features: ['Open Source', 'Plugins', 'Competencies', 'Analytics'],
    marketShare: 18,
    complexity: 'Advanced',
    setupTime: '10 minutes'
  },
  {
    id: 'd2l',
    name: 'Brightspace',
    logo: '💡',
    formats: ['SCORM 1.2', 'SCORM 2004', 'xAPI', 'QTI'],
    features: ['Adaptive Release', 'Intelligence Plus', 'Creator+'],
    marketShare: 12,
    complexity: 'Moderate',
    setupTime: '3 minutes'
  },
  {
    id: 'schoology',
    name: 'Schoology',
    logo: '🏫',
    formats: ['SCORM 1.2', 'Common Cartridge', 'QTI'],
    features: ['Social Learning', 'Analytics', 'Mobile', 'Gradebook'],
    marketShare: 8,
    complexity: 'Simple',
    setupTime: '2 minutes'
  },
  {
    id: 'google',
    name: 'Google Classroom',
    logo: '📚',
    formats: ['Google Drive', 'Web Links', 'PDF', 'SCORM via plugins'],
    features: ['G Suite Integration', 'Simple Interface', 'Free'],
    marketShare: 2,
    complexity: 'Simple',
    setupTime: '1 minute'
  }
]

const exportFormats = [
  {
    id: 'scorm12',
    name: 'SCORM 1.2',
    description: 'Legacy standard, maximum compatibility',
    features: ['Universal Support', 'Basic Tracking', 'Simple Deployment'],
    recommended: false,
    fileSize: 'Small',
    compatibility: 98
  },
  {
    id: 'scorm2004',
    name: 'SCORM 2004',
    description: 'Modern standard with sequencing and navigation',
    features: ['Advanced Tracking', 'Sequencing Rules', 'Rich Interactions'],
    recommended: true,
    fileSize: 'Medium',
    compatibility: 94
  },
  {
    id: 'xapi',
    name: 'xAPI (Tin Can)',
    description: 'Next-generation tracking with detailed analytics',
    features: ['Detailed Analytics', 'Offline Learning', 'Mobile Support'],
    recommended: true,
    fileSize: 'Large',
    compatibility: 78
  },
  {
    id: 'qti',
    name: 'QTI 2.1',
    description: 'Assessment-focused format for quizzes and tests',
    features: ['Rich Assessments', 'Question Banks', 'Adaptive Testing'],
    recommended: false,
    fileSize: 'Small',
    compatibility: 85
  },
  {
    id: 'cc',
    name: 'Common Cartridge',
    description: 'Complete course packaging standard',
    features: ['Full Course Export', 'Content + Structure', 'Metadata Rich'],
    recommended: true,
    fileSize: 'Large',
    compatibility: 72
  }
]

const timelineSteps = [
  {
    id: 'content',
    title: 'Content Analysis',
    description: 'AI analyzes your course materials and identifies optimal structure',
    duration: '30 seconds',
    status: 'completed' as const
  },
  {
    id: 'format',
    title: 'Format Conversion',
    description: 'Converting to SCORM 2004 with enhanced tracking capabilities',
    duration: '2 minutes',
    status: 'active' as const
  },
  {
    id: 'package',
    title: 'Package Assembly',
    description: 'Building manifest and organizing resources for LMS compatibility',
    duration: '1 minute',
    status: 'pending' as const
  },
  {
    id: 'validation',
    title: 'Validation & Testing',
    description: 'Testing package integrity and LMS-specific requirements',
    duration: '45 seconds',
    status: 'pending' as const
  },
  {
    id: 'delivery',
    title: 'Ready for Download',
    description: 'Package ready with installation instructions and support',
    duration: 'Instant',
    status: 'pending' as const
  }
]

export default function LMSExportPage() {
  const [selectedPlatform, setSelectedPlatform] = useState<string>('')
  const [selectedFormat, setSelectedFormat] = useState<string>('scorm2004')
  const [exportJobs, setExportJobs] = useState<ExportJob[]>([])
  const [isExporting, setIsExporting] = useState(false)
  const [exportProgress, setExportProgress] = useState(0)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [viewMode, setViewMode] = useState<'platforms' | 'formats' | 'progress'>('platforms')

  useEffect(() => {
    // Simulate export progress
    if (isExporting) {
      const interval = setInterval(() => {
        setExportProgress(prev => {
          if (prev >= 100) {
            setIsExporting(false)
            return 100
          }
          return prev + Math.random() * 15
        })
      }, 300)
      return () => clearInterval(interval)
    }
  }, [isExporting])

  const handleExport = () => {
    if (!selectedPlatform || !selectedFormat) return
    
    setIsExporting(true)
    setExportProgress(0)
    setViewMode('progress')

    // Create new export job
    const newJob: ExportJob = {
      id: Math.random().toString(36).substr(2, 9),
      title: `Classical Text Analysis - ${lmsPlatforms.find(p => p.id === selectedPlatform)?.name}`,
      format: selectedFormat,
      platform: selectedPlatform,
      status: 'processing',
      progress: 0,
      createdAt: new Date()
    }

    setExportJobs(prev => [newJob, ...prev])
  }

  const scaleData = [
    {
      level: 'overview',
      title: 'Export Ecosystem',
      items: [
        { id: '1', title: 'Learning Management Systems', count: 6, category: 'Platforms' },
        { id: '2', title: 'Export Formats', count: 5, category: 'Standards' },
        { id: '3', title: 'Active Exports', count: 12, category: 'Jobs' },
        { id: '4', title: 'Success Rate', count: 98, category: 'Reliability' }
      ]
    },
    {
      level: 'platforms',
      title: 'LMS Platforms',
      items: lmsPlatforms.map(platform => ({
        id: platform.id,
        title: platform.name,
        count: platform.marketShare,
        category: platform.complexity,
        metadata: {
          setupTime: platform.setupTime,
          formats: platform.formats.length
        }
      }))
    },
    {
      level: 'formats',
      title: 'Export Formats',
      items: exportFormats.map(format => ({
        id: format.id,
        title: format.name,
        count: format.compatibility,
        category: format.fileSize,
        metadata: {
          recommended: format.recommended,
          features: format.features.length
        }
      }))
    }
  ]

  return (
    <div className="min-h-screen bg-[#0D0D0F]">
      {/* Hero Section */}
      <section className="relative py-24 px-4 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-[#C9A962]/20 via-transparent to-[#7C9885]/20" />
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#C9A962]/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#7C9885]/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full px-6 py-3 mb-8">
              <Box className="w-5 h-5 text-[#C9A962]" />
              <span className="text-[#F5F3EF] font-medium">Pedagogy Engine</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-br from-[#F5F3EF] to-[#C9A962] bg-clip-text text-transparent mb-6">
              LMS Export Hub
            </h1>
            
            <p className="text-xl text-[#F5F3EF]/80 max-w-3xl mx-auto mb-8">
              Tools that actually help people learn. Export your carefully crafted classical content 
              to any Learning Management System with perfect fidelity and enhanced pedagogical features.
            </p>

            <div className="flex flex-wrap justify-center gap-4 mb-12">
              {['Canvas/Blackboard/Moodle', 'Format converter', 'SCORM support'].map((feature, index) => (
                <motion.div
                  key={feature}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-full px-6 py-3"
                >
                  <span className="text-[#C9A962] font-medium">{feature}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Multi-Scale View Integration */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="mb-16"
          >
            <MultiScaleView
              data={scaleData}
              onScaleChange={(level) => {
                if (level === 'platforms') setViewMode('platforms')
                if (level === 'formats') setViewMode('formats')
              }}
              className="h-96"
            />
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Navigation Tabs */}
          <div className="flex flex-wrap gap-2 mb-12">
            {[
              { id: 'platforms', label: 'Choose Platform', icon: Globe },
              { id: 'formats', label: 'Select Format', icon: FileDown },
              { id: 'progress', label: 'Export Progress', icon: TrendingUp }
            ].map(({ id, label, icon: Icon }) => (
              <motion.button
                key={id}
                onClick={() => setViewMode(id as any)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                  viewMode === id
                    ? 'bg-[#C9A962] text-[#0D0D0F]'
                    : 'bg-white/5 text-[#F5F3EF] hover:bg-white/10'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Icon className="w-5 h-5" />
                {label}
              </motion.button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {/* Platform Selection */}
            {viewMode === 'platforms' && (
              <motion.div
                key="platforms"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
              >
                {lmsPlatforms.map((platform) => (
                  <motion.div
                    key={platform.id}
                    className={`bg-white/5 backdrop-blur-xl border rounded-2xl p-6 cursor-pointer transition-all ${
                      selectedPlatform === platform.id
                        ? 'border-[#C9A962] bg-[#C9A962]/10'
                        : 'border-white/10 hover:border-white/20'
                    }`}
                    onClick={() => setSelectedPlatform(platform.id)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-start gap-4 mb-4">
                      <div className="text-3xl">{platform.logo}</div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-[#F5F3EF] mb-1">{platform.name}</h3>
                        <div className="flex items-center gap-2 text-sm text-[#F5F3EF]/60">
                          <span>{platform.marketShare}% market share</span>
                          <span>•</span>
                          <span>{platform.setupTime} setup</span>
                        </div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Shield className="w-4 h-4 text-[#7C9885]" />
                        <span className="text-sm font-medium text-[#F5F3EF]">Supported Formats</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {platform.formats.slice(0, 3).map((format) => (
                          <span key={format} className="bg-white/10 text-xs px-2 py-1 rounded text-[#F5F3EF]/80">
                            {format}
                          </span>
                        ))}
                        {platform.formats.length > 3 && (
                          <span className="text-xs text-[#F5F3EF]/60">+{platform.formats.length - 3} more</span>
                        )}
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Star className="w-4 h-4 text-[#C9A962]" />
                        <span className="text-sm font-medium text-[#F5F3EF]">Key Features</span>
                      </div>
                      <div className="space-y-1">
                        {platform.features.map((feature) => (
                          <div key={feature} className="flex items-center gap-2">
                            <CheckCircle className="w-3 h-3 text-[#7C9885]" />
                            <span className="text-sm text-[#F5F3EF]/80">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className={`text-sm px-2 py-1 rounded ${
                        platform.complexity === 'Simple' ? 'bg-[#7C9885]/20 text-[#7C9885]' :
                        platform.complexity === 'Moderate' ? 'bg-[#C9A962]/20 text-[#C9A962]' :
                        'bg-[#8B7355]/20 text-[#8B7355]'
                      }`}>
                        {platform.complexity} Setup
                      </span>
                      
                      {selectedPlatform === platform.id && (
                        <CheckCircle className="w-5 h-5 text-[#C9A962]" />
                      )}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* Format Selection */}
            {viewMode === 'formats' && (
              <motion.div
                key="formats"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-6 mb-12"
              >
                {exportFormats.map((format) => (
                  <motion.div
                    key={format.id}
                    className={`bg-white/5 backdrop-blur-xl border rounded-2xl p-6 cursor-pointer transition-all ${
                      selectedFormat === format.id
                        ? 'border-[#C9A962] bg-[#C9A962]/10'
                        : 'border-white/10 hover:border-white/20'
                    }`}
                    onClick={() => setSelectedFormat(format.id)}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <div className="flex items-start gap-6">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold text-[#F5F3EF]">{format.name}</h3>
                          {format.recommended && (
                            <span className="bg-[#C9A962]/20 text-[#C9A962] text-xs px-2 py-1 rounded-full font-medium">
                              Recommended
                            </span>
                          )}
                        </div>
                        <p className="text-[#F5F3EF]/80 mb-4">{format.description}</p>
                        
                        <div className="grid md:grid-cols-3 gap-4">
                          <div>
                            <div className="text-sm text-[#F5F3EF]/60 mb-1">Features</div>
                            <div className="space-y-1">
                              {format.features.map((feature) => (
                                <div key={feature} className="flex items-center gap-2">
                                  <CheckCircle className="w-3 h-3 text-[#7C9885]" />
                                  <span className="text-sm text-[#F5F3EF]">{feature}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          <div>
                            <div className="text-sm text-[#F5F3EF]/60 mb-1">File Size</div>
                            <div className="text-[#F5F3EF] font-medium">{format.fileSize}</div>
                            
                            <div className="text-sm text-[#F5F3EF]/60 mb-1 mt-3">Compatibility</div>
                            <div className="flex items-center gap-2">
                              <div className="flex-1 bg-white/10 rounded-full h-2">
                                <div
                                  className="bg-[#7C9885] h-2 rounded-full"
                                  style={{ width: `${format.compatibility}%` }}
                                />
                              </div>
                              <span className="text-sm text-[#F5F3EF] font-medium">{format.compatibility}%</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-end">
                            {selectedFormat === format.id && (
                              <CheckCircle className="w-6 h-6 text-[#C9A962]" />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* Export Progress */}
            {viewMode === 'progress' && (
              <motion.div
                key="progress"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-8"
              >
                {/* Current Export Progress */}
                {isExporting && (
                  <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
                    <div className="mb-6">
                      <h3 className="text-2xl font-bold text-[#F5F3EF] mb-2">Exporting Your Content</h3>
                      <p className="text-[#F5F3EF]/80">
                        Converting to {exportFormats.find(f => f.id === selectedFormat)?.name} for{' '}
                        {lmsPlatforms.find(p => p.id === selectedPlatform)?.name}
                      </p>
                    </div>

                    <div className="mb-8">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[#F5F3EF] font-medium">Overall Progress</span>
                        <span className="text-[#C9A962] font-bold">{Math.round(exportProgress)}%</span>
                      </div>
                      <div className="bg-white/10 rounded-full h-3">
                        <motion.div
                          className="bg-gradient-to-r from-[#C9A962] to-[#7C9885] h-3 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${exportProgress}%` }}
                          transition={{ duration: 0.3 }}
                        />
                      </div>
                    </div>

                    <NarrativeTimeline
                      steps={timelineSteps}
                      currentStep={Math.floor(exportProgress / 20)}
                      className="mb-6"
                    />
                  </div>
                )}

                {/* Export History */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
                  <h3 className="text-2xl font-bold text-[#F5F3EF] mb-6">Recent Exports</h3>
                  
                  {exportJobs.length === 0 ? (
                    <div className="text-center py-12">
                      <FileDown className="w-12 h-12 text-[#F5F3EF]/20 mx-auto mb-4" />
                      <p className="text-[#F5F3EF]/60">No exports yet. Start by selecting a platform and format.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {exportJobs.map((job) => (
                        <motion.div
                          key={job.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-xl"
                        >
                          <div className="flex-shrink-0">
                            {job.status === 'completed' ? (
                              <CheckCircle className="w-6 h-6 text-[#7C9885]" />
                            ) : job.status === 'processing' ? (
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                              >
                                <Cpu className="w-6 h-6 text-[#C9A962]" />
                              </motion.div>
                            ) : job.status === 'failed' ? (
                              <AlertCircle className="w-6 h-6 text-red-400" />
                            ) : (
                              <Clock className="w-6 h-6 text-[#F5F3EF]/40" />
                            )}
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-medium text-[#F5F3EF]">{job.title}</h4>
                              <span className="text-xs px-2 py-1 bg-white/10 rounded text-[#F5F3EF]/60">
                                {job.format.toUpperCase()}
                              </span>
                            </div>
                            <div className="text-sm text-[#F5F3EF]/60">
                              {job.platform} • {job.createdAt.toLocaleDateString()}
                              {job.size && ` • ${job.size}`}
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            {job.status === 'processing' && (
                              <div className="text-sm text-[#C9A962] font-medium">
                                {job.progress}%
                              </div>
                            )}
                            {job.status === 'completed' && job.downloadUrl && (
                              <button className="flex items-center gap-2 px-3 py-2 bg-[#C9A962] text-[#0D0D0F] rounded-lg font-medium hover:bg-[#C9A962]/90 transition-colors">
                                <Download className="w-4 h-4" />
                                Download
                              </button>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Export Controls */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8"
          >
            <div className="flex flex-col md:flex-row gap-6 items-end">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-[#F5F3EF] mb-4">Export Settings</h3>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-[#F5F3EF] mb-2">
                      Target Platform
                    </label>
                    <div className="text-sm text-[#F5F3EF]/80">
                      {selectedPlatform ? 
                        lmsPlatforms.find(p => p.id === selectedPlatform)?.name || 'None selected' :
                        'Select a platform above'
                      }
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-[#F5F3EF] mb-2">
                      Export Format
                    </label>
                    <div className="text-sm text-[#F5F3EF]/80">
                      {exportFormats.find(f => f.id === selectedFormat)?.name || 'SCORM 2004'}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="flex items-center gap-2 text-sm text-[#C9A962] hover:text-[#C9A962]/80 mt-4"
                >
                  <Wrench className="w-4 h-4" />
                  Advanced Options
                </button>

                <AnimatePresence>
                  {showAdvanced && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="mt-4 pt-4 border-t border-white/10"
                    >
                      <div className="grid md:grid-cols-3 gap-4">
                        <label className="flex items-center gap-2">
                          <input type="checkbox" className="rounded" defaultChecked />
                          <span className="text-sm text-[#F5F3EF]">Include analytics tracking</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input type="checkbox" className="rounded" defaultChecked />
                          <span className="text-sm text-[#F5F3EF]">Optimize for mobile</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input type="checkbox" className="rounded" />
                          <span className="text-sm text-[#F5F3EF]">Include source files</span>
                        </label>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setViewMode('platforms')}
                  className="flex items-center gap-2 px-6 py-3 bg-white/10 text-[#F5F3EF] rounded-xl hover:bg-white/20 transition-colors"
                  disabled={isExporting}
                >
                  <Settings className="w-5 h-5" />
                  Configure
                </button>
                
                <button
                  onClick={handleExport}
                  disabled={!selectedPlatform || !selectedFormat || isExporting}
                  className="flex items-center gap-2 px-8 py-3 bg-[#C9A962] text-[#0D0D0F] rounded-xl font-medium hover:bg-[#C9A962]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isExporting ? (
                    <>
                      <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
                        <Cpu className="w-5 h-5" />
                      </motion.div>
                      Exporting...
                    </>
                  ) : (
                    <>
                      <Download className="w-5 h-5" />
                      Start Export
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-white/5">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-[#F5F3EF] mb-6">
              Why Scholars Choose Our Export Tools
            </h2>
            <p className="text-xl text-[#F5F3EF]/80 max-w-3xl mx-auto">
              Finally, export tools designed by educators who understand the unique challenges 
              of teaching classical languages in digital environments.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: 'Pedagogical Integrity',
                description: 'Preserves your carefully designed learning progressions and maintains proper text encoding for all classical scripts.'
              },
              {
                icon: Zap,
                title: 'Lightning Fast',
                description: 'Export complete courses in minutes, not hours. Our optimized pipeline handles large corpora without breaking a sweat.'
              },
              {
                icon: Target,
                title: 'LMS-Specific Optimization',
                description: 'Each export is tailored to your target platform\'s capabilities, ensuring maximum compatibility and feature utilization.'
              },
              {
                icon: Database,
                title: 'Metadata Rich',
                description: 'Automatically generates proper learning objectives, competency mappings, and accessibility metadata.'
              },
              {
                icon: Network,
                title: 'Seamless Integration',
                description: 'One-click import into your LMS with automatic grade book setup and student progress tracking configuration.'
              },
              {
                icon: HardDrive,
                title: 'Future-Proof Formats',
                description: 'Exports use the latest standards ensuring your content works today and remains compatible tomorrow.'
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all group"
              >
                <feature.icon className="w-8 h-8 text-[#C9A962] mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-bold text-[#F5F3EF] mb-3">{feature.title}</h3>
                <p className="text-[#F5F3EF]/80">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
