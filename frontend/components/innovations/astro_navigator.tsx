'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Star, Database, Play, RefreshCw, ChevronDown, ChevronRight,
  Globe, Calendar, Target, Activity, Search, FileText
} from 'lucide-react'

// API base URL - configurable via env or defaults to localhost
const API_BASE = process.env.NEXT_PUBLIC_ASTRO_API_URL || 'http://localhost:8787'

interface Catalog {
  catalog_key: string
  name: string
  coord_system: string
  epoch_year: number | null
}

interface Run {
  run_key: string
  created_at: string
  config: Record<string, any>
}

interface ModelSummary {
  catalog_key: string
  n_entries: number
  mix_weight_b: number
  bic_a: number
  bic_b: number
  bic_mix: number
  log_bayes_factor_mix_vs_best: number
  rms_a: number
  rms_b: number
}

interface StarPrediction {
  object_key: string
  canonical_name: string
  constellation: string
  hip_id: number
  recorded_lon: number
  recorded_lat: number
  pred_lon: number
  pred_lat: number
  dlon: number
  dlat: number
  ang_resid: number
}

interface ApiStats {
  catalogs: number
  objects: number
  entries: number
  runs: number
  predictions: number
  mentions: number
}

export default function AstroNavigator() {
  const [activeTab, setActiveTab] = useState<'overview' | 'catalogs' | 'runs' | 'stars'>('overview')
  const [health, setHealth] = useState<{ ok: boolean; database: boolean } | null>(null)
  const [stats, setStats] = useState<ApiStats | null>(null)
  const [catalogs, setCatalogs] = useState<Catalog[]>([])
  const [runs, setRuns] = useState<Run[]>([])
  const [selectedRun, setSelectedRun] = useState<string | null>(null)
  const [runSummary, setRunSummary] = useState<ModelSummary | null>(null)
  const [stars, setStars] = useState<StarPrediction[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch health status
  const fetchHealth = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/health`)
      const data = await res.json()
      setHealth(data)
    } catch (e) {
      setHealth({ ok: false, database: false })
      setError('Cannot connect to Astro Navigator API')
    }
  }, [])

  // Fetch stats
  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/stats`)
      const data = await res.json()
      setStats(data)
    } catch (e) {
      console.error('Failed to fetch stats:', e)
    }
  }, [])

  // Fetch catalogs
  const fetchCatalogs = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/catalogs`)
      const data = await res.json()
      setCatalogs(data)
    } catch (e) {
      setError('Failed to fetch catalogs')
    } finally {
      setLoading(false)
    }
  }, [])

  // Fetch runs
  const fetchRuns = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/runs?limit=20`)
      const data = await res.json()
      setRuns(data)
    } catch (e) {
      setError('Failed to fetch runs')
    } finally {
      setLoading(false)
    }
  }, [])

  // Fetch run summary
  const fetchRunSummary = useCallback(async (runKey: string) => {
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/run/${runKey}/summary`)
      const data = await res.json()
      if (data.length > 0) {
        setRunSummary(data[0])
      }
    } catch (e) {
      setError('Failed to fetch run summary')
    } finally {
      setLoading(false)
    }
  }, [])

  // Fetch stars for a run
  const fetchStars = useCallback(async (runKey: string, hypothesis: string = 'ptolemy_epoch') => {
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/run/${runKey}/stars?hypothesis=${hypothesis}&limit=100`)
      const data = await res.json()
      setStars(data)
    } catch (e) {
      setError('Failed to fetch star predictions')
    } finally {
      setLoading(false)
    }
  }, [])

  // Initial load
  useEffect(() => {
    fetchHealth()
    fetchStats()
  }, [fetchHealth, fetchStats])

  // Load data when tab changes
  useEffect(() => {
    if (activeTab === 'catalogs') fetchCatalogs()
    if (activeTab === 'runs') fetchRuns()
  }, [activeTab, fetchCatalogs, fetchRuns])

  // Load run details when selected
  useEffect(() => {
    if (selectedRun) {
      fetchRunSummary(selectedRun)
      fetchStars(selectedRun)
    }
  }, [selectedRun, fetchRunSummary, fetchStars])

  return (
    <div className="w-full min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-900 p-6 border-b border-slate-700">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-600 rounded-xl">
              <Star className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">LOGOS Astro Navigator</h1>
              <p className="text-slate-400">Ancient Star Catalog Analysis & Dating</p>
            </div>
            <div className="ml-auto flex items-center gap-3">
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm ${
                health?.database ? 'bg-green-900/50 text-green-400' : 'bg-red-900/50 text-red-400'
              }`}>
                <Database className="w-4 h-4" />
                {health?.database ? 'Connected' : 'Disconnected'}
              </div>
              <button
                onClick={() => { fetchHealth(); fetchStats(); }}
                className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-slate-800 border-b border-slate-700">
        <div className="max-w-7xl mx-auto flex">
          {[
            { id: 'overview', label: 'Overview', icon: Activity },
            { id: 'catalogs', label: 'Catalogs', icon: Database },
            { id: 'runs', label: 'Analysis Runs', icon: Play },
            { id: 'stars', label: 'Star Data', icon: Star },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-6 py-4 border-b-2 transition ${
                activeTab === tab.id
                  ? 'border-indigo-500 text-indigo-400 bg-slate-700/50'
                  : 'border-transparent text-slate-400 hover:text-white hover:bg-slate-700/30'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto p-6">
        {error && (
          <div className="mb-6 p-4 bg-red-900/30 border border-red-700 rounded-lg text-red-400">
            {error}
            <button onClick={() => setError(null)} className="ml-4 underline">Dismiss</button>
          </div>
        )}

        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Stats Cards */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {[
                  { label: 'Catalogs', value: stats?.catalogs ?? '-', icon: Database, color: 'indigo' },
                  { label: 'Objects', value: stats?.objects ?? '-', icon: Star, color: 'purple' },
                  { label: 'Entries', value: stats?.entries ?? '-', icon: Globe, color: 'blue' },
                  { label: 'Runs', value: stats?.runs ?? '-', icon: Play, color: 'green' },
                  { label: 'Predictions', value: stats?.predictions ?? '-', icon: Target, color: 'amber' },
                  { label: 'Mentions', value: stats?.mentions ?? '-', icon: FileText, color: 'rose' },
                ].map(stat => (
                  <div key={stat.label} className={`p-4 bg-slate-800 rounded-xl border border-slate-700`}>
                    <div className="flex items-center gap-2 text-slate-400 mb-2">
                      <stat.icon className="w-4 h-4" />
                      <span className="text-sm">{stat.label}</span>
                    </div>
                    <div className="text-2xl font-bold">
                      {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
                    </div>
                  </div>
                ))}
              </div>

              {/* About */}
              <div className="p-6 bg-slate-800 rounded-xl border border-slate-700">
                <h2 className="text-xl font-semibold mb-4">About LOGOS Astro Navigator</h2>
                <div className="prose prose-invert max-w-none">
                  <p className="text-slate-300">
                    The Astro Navigator analyzes ancient star catalogs using modern Gaia DR3 astrometry
                    to determine their observation epochs and detect evidence of copying between catalogs.
                  </p>
                  <div className="grid md:grid-cols-2 gap-4 mt-4">
                    <div className="p-4 bg-slate-700/50 rounded-lg">
                      <h3 className="font-semibold text-indigo-400 mb-2">Epoch Analysis</h3>
                      <p className="text-sm text-slate-400">
                        Uses proper motion back-propagation to find the epoch that best fits recorded star positions.
                      </p>
                    </div>
                    <div className="p-4 bg-slate-700/50 rounded-lg">
                      <h3 className="font-semibold text-purple-400 mb-2">Source Detection</h3>
                      <p className="text-sm text-slate-400">
                        Mixture modeling identifies which stars may have been copied from earlier catalogs.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'catalogs' && (
            <motion.div
              key="catalogs"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
                <div className="p-4 border-b border-slate-700 flex items-center justify-between">
                  <h2 className="text-lg font-semibold">Available Catalogs</h2>
                  <button onClick={fetchCatalogs} className="p-2 hover:bg-slate-700 rounded-lg">
                    <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                  </button>
                </div>
                <div className="divide-y divide-slate-700">
                  {catalogs.length === 0 ? (
                    <div className="p-8 text-center text-slate-400">
                      {loading ? 'Loading...' : 'No catalogs found. Import one using the CLI.'}
                    </div>
                  ) : catalogs.map(cat => (
                    <div key={cat.catalog_key} className="p-4 hover:bg-slate-700/50 transition">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold">{cat.name}</h3>
                          <p className="text-sm text-slate-400">
                            <code className="text-indigo-400">{cat.catalog_key}</code>
                            {' | '}
                            {cat.coord_system}
                            {cat.epoch_year && ` | Epoch: ${cat.epoch_year}`}
                          </p>
                        </div>
                        <Database className="w-5 h-5 text-slate-500" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'runs' && (
            <motion.div
              key="runs"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Runs List */}
                <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
                  <div className="p-4 border-b border-slate-700 flex items-center justify-between">
                    <h2 className="text-lg font-semibold">Analysis Runs</h2>
                    <button onClick={fetchRuns} className="p-2 hover:bg-slate-700 rounded-lg">
                      <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                  </div>
                  <div className="divide-y divide-slate-700 max-h-[500px] overflow-y-auto">
                    {runs.length === 0 ? (
                      <div className="p-8 text-center text-slate-400">
                        {loading ? 'Loading...' : 'No analysis runs found. Run a comparison using the CLI.'}
                      </div>
                    ) : runs.map(run => (
                      <button
                        key={run.run_key}
                        onClick={() => setSelectedRun(run.run_key)}
                        className={`w-full p-4 text-left hover:bg-slate-700/50 transition ${
                          selectedRun === run.run_key ? 'bg-indigo-900/30 border-l-2 border-indigo-500' : ''
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          {selectedRun === run.run_key ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                          <div>
                            <code className="text-indigo-400 text-sm">{run.run_key}</code>
                            <p className="text-xs text-slate-500 mt-1">
                              {new Date(run.created_at).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Run Summary */}
                {selectedRun && runSummary && (
                  <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
                    <h2 className="text-lg font-semibold mb-4">Run Summary</h2>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 bg-slate-700/50 rounded-lg">
                          <div className="text-sm text-slate-400">Entries Analyzed</div>
                          <div className="text-xl font-bold">{runSummary.n_entries}</div>
                        </div>
                        <div className="p-3 bg-slate-700/50 rounded-lg">
                          <div className="text-sm text-slate-400">Hipparchus Mix Weight</div>
                          <div className="text-xl font-bold">{(runSummary.mix_weight_b * 100).toFixed(1)}%</div>
                        </div>
                      </div>
                      <div className="p-4 bg-indigo-900/30 rounded-lg border border-indigo-700">
                        <h3 className="font-semibold text-indigo-400 mb-2">BIC Comparison</h3>
                        <div className="text-sm space-y-1">
                          <div className="flex justify-between">
                            <span>Ptolemy Epoch:</span>
                            <span className="font-mono">{runSummary.bic_a?.toFixed(1)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Hipparchus Copy:</span>
                            <span className="font-mono">{runSummary.bic_b?.toFixed(1)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Mixture Model:</span>
                            <span className="font-mono">{runSummary.bic_mix?.toFixed(1)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="p-4 bg-purple-900/30 rounded-lg border border-purple-700">
                        <h3 className="font-semibold text-purple-400 mb-2">Log Bayes Factor</h3>
                        <div className="text-2xl font-bold">
                          {runSummary.log_bayes_factor_mix_vs_best?.toFixed(2)}
                        </div>
                        <p className="text-xs text-slate-400 mt-1">
                          (Mixture vs best single hypothesis)
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'stars' && (
            <motion.div
              key="stars"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
                <div className="p-4 border-b border-slate-700 flex items-center justify-between">
                  <h2 className="text-lg font-semibold">Star Predictions</h2>
                  {selectedRun && (
                    <span className="text-sm text-slate-400">Run: {selectedRun}</span>
                  )}
                </div>
                {!selectedRun ? (
                  <div className="p-8 text-center text-slate-400">
                    Select a run from the "Analysis Runs" tab to view star predictions.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-slate-700/50">
                        <tr>
                          <th className="px-4 py-3 text-left">Star</th>
                          <th className="px-4 py-3 text-left">Constellation</th>
                          <th className="px-4 py-3 text-right">Recorded Lon</th>
                          <th className="px-4 py-3 text-right">Predicted Lon</th>
                          <th className="px-4 py-3 text-right">dLon</th>
                          <th className="px-4 py-3 text-right">Residual</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-700">
                        {stars.map(star => (
                          <tr key={star.object_key} className="hover:bg-slate-700/30">
                            <td className="px-4 py-3">
                              <div className="font-medium">{star.canonical_name}</div>
                              <div className="text-xs text-slate-500">HIP {star.hip_id}</div>
                            </td>
                            <td className="px-4 py-3 text-slate-400">{star.constellation}</td>
                            <td className="px-4 py-3 text-right font-mono">{star.recorded_lon?.toFixed(2)}°</td>
                            <td className="px-4 py-3 text-right font-mono">{star.pred_lon?.toFixed(2)}°</td>
                            <td className="px-4 py-3 text-right font-mono">
                              <span className={star.dlon > 0 ? 'text-green-400' : 'text-red-400'}>
                                {star.dlon > 0 ? '+' : ''}{star.dlon?.toFixed(3)}°
                              </span>
                            </td>
                            <td className="px-4 py-3 text-right font-mono">
                              {(star.ang_resid * 60)?.toFixed(1)}'
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
