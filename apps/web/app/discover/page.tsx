'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

const API_BASE = 'https://logos-production-ef2b.up.railway.app'

interface Discovery {
  id: number
  order_level: 1 | 2 | 3 | 4
  pattern_type: string
  hypothesis: string
  description: string
  confidence: number
  novelty_score: number
  statistical_significance: string
  evidence: Array<{ type: string; detail: string }>
  supporting_passages: string[]
  attributed_to?: string
  doi?: string
}

export default function DiscoverPage() {
  const [discoveries, setDiscoveries] = useState<Discovery[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<number | null>(null)
  const [selectedDiscovery, setSelectedDiscovery] = useState<Discovery | null>(null)
  const [generating, setGenerating] = useState(false)

  useEffect(() => {
    fetchDiscoveries()
  }, [selectedOrder])

  const fetchDiscoveries = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (selectedOrder) params.append('order', selectedOrder.toString())
      const response = await fetch(`${API_BASE}/api/discovery/patterns?${params}`)
      const data = await response.json()
      setDiscoveries(data.discoveries || [])
    } catch (err) {
      setDiscoveries([])
    } finally {
      setLoading(false)
    }
  }

  const generateHypothesis = async () => {
    setGenerating(true)
    try {
      await fetch(`${API_BASE}/api/discovery/hypothesis`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ min_order: 3 })
      })
      // Refresh after generating
      setTimeout(fetchDiscoveries, 2000)
    } catch (err) {
      console.error(err)
    } finally {
      setGenerating(false)
    }
  }

  const orderColors = {
    1: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    2: 'bg-emerald/20 text-emerald border-emerald/30',
    3: 'bg-amber/20 text-amber border-amber/30',
    4: 'bg-gold/30 text-gold border-gold/50'
  }

  const orderDescriptions = {
    1: { name: 'First Order', desc: 'Direct relationships (A → B)', icon: '→' },
    2: { name: 'Second Order', desc: 'Pattern comparisons', icon: '⇄' },
    3: { name: 'Third Order', desc: 'Correlations across patterns', icon: '⟷' },
    4: { name: 'Fourth Order', desc: 'Meta-patterns with predictive power', icon: '★' }
  }

  return (
    <main className="min-h-screen bg-obsidian">
      <nav className="glass border-b border-gold/10 px-6 py-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="font-serif text-2xl font-bold text-gold tracking-widest">LOGOS</Link>
          <div className="flex items-center gap-8">
            <Link href="/search" className="text-marble/70 hover:text-gold transition-colors">Search</Link>
            <Link href="/translate" className="text-marble/70 hover:text-gold transition-colors">Translate</Link>
            <Link href="/discover" className="text-gold">Discover</Link>
            <Link href="/research" className="text-marble/70 hover:text-gold transition-colors">Research</Link>
            <Link href="/learn" className="text-marble/70 hover:text-gold transition-colors">Learn</Link>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="font-serif text-4xl text-gold mb-4">Higher-Order Discovery</h1>
          <p className="text-marble/60 max-w-2xl mx-auto">
            Find patterns in classical literature that no human could see. From simple allusions to meta-patterns with predictive power.
          </p>
        </div>

        {/* Order Level Explanation */}
        <div className="grid md:grid-cols-4 gap-4 mb-12">
          {[1, 2, 3, 4].map(order => (
            <button
              key={order}
              onClick={() => setSelectedOrder(selectedOrder === order ? null : order)}
              className={`glass rounded-xl p-4 text-left transition-all ${selectedOrder === order ? 'border-gold/50 ring-1 ring-gold/30' : ''}`}
            >
              <div className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-lg mb-2 ${orderColors[order as keyof typeof orderColors]}`}>
                {orderDescriptions[order as keyof typeof orderDescriptions].icon}
              </div>
              <h3 className="text-gold font-medium">{orderDescriptions[order as keyof typeof orderDescriptions].name}</h3>
              <p className="text-marble/50 text-sm mt-1">{orderDescriptions[order as keyof typeof orderDescriptions].desc}</p>
            </button>
          ))}
        </div>

        {/* Generate Button */}
        <div className="text-center mb-8">
          <button
            onClick={generateHypothesis}
            disabled={generating}
            className="px-8 py-3 bg-gold text-obsidian rounded-lg font-medium hover:bg-gold-light transition-colors disabled:opacity-50"
          >
            {generating ? '🔬 Generating Hypothesis...' : '✨ Generate New Hypothesis'}
          </button>
          <p className="text-marble/40 text-sm mt-2">AI will analyze the corpus and find novel patterns</p>
        </div>

        {/* Discoveries List */}
        {loading ? (
          <div className="text-center py-16 text-marble/50">Loading discoveries...</div>
        ) : (
          <div className="space-y-6">
            {discoveries.map(discovery => (
              <div
                key={discovery.id}
                onClick={() => setSelectedDiscovery(discovery)}
                className="glass rounded-xl p-6 cursor-pointer hover:border-gold/30 transition-all"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-sm border ${orderColors[discovery.order_level]}`}>
                      {discovery.order_level}{discovery.order_level === 1 ? 'st' : discovery.order_level === 2 ? 'nd' : discovery.order_level === 3 ? 'rd' : 'th'} Order
                    </span>
                    <span className="text-marble/50 text-sm">{discovery.pattern_type}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-gold font-medium">{Math.round(discovery.confidence * 100)}% confidence</div>
                    <div className="text-marble/40 text-sm">Novelty: {Math.round(discovery.novelty_score * 100)}%</div>
                  </div>
                </div>

                <h3 className="text-marble text-lg mb-2">{discovery.hypothesis}</h3>
                <p className="text-marble/60">{discovery.description}</p>

                {discovery.doi && (
                  <div className="mt-4 pt-4 border-t border-gold/10">
                    <span className="text-gold/70 text-sm">DOI: {discovery.doi}</span>
                  </div>
                )}
              </div>
            ))}

            {discoveries.length === 0 && (
              <div className="text-center py-16">
                <p className="text-marble/50 mb-4">No discoveries found for this filter.</p>
                <button onClick={() => setSelectedOrder(null)} className="text-gold hover:underline">
                  View all discoveries
                </button>
              </div>
            )}
          </div>
        )}

        {/* Discovery Detail Modal */}
        {selectedDiscovery && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={() => setSelectedDiscovery(null)}>
            <div className="glass rounded-xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
              <div className="flex justify-between items-start mb-6">
                <span className={`px-3 py-1 rounded-full text-sm border ${orderColors[selectedDiscovery.order_level]}`}>
                  {selectedDiscovery.order_level}{selectedDiscovery.order_level === 1 ? 'st' : selectedDiscovery.order_level === 2 ? 'nd' : selectedDiscovery.order_level === 3 ? 'rd' : 'th'} Order Discovery
                </span>
                <button onClick={() => setSelectedDiscovery(null)} className="text-marble/50 hover:text-marble text-xl">✕</button>
              </div>

              <h2 className="font-serif text-2xl text-gold mb-4">{selectedDiscovery.hypothesis}</h2>
              <p className="text-marble/80 mb-6">{selectedDiscovery.description}</p>

              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <div className="bg-obsidian-light rounded-lg p-4">
                  <span className="text-marble/50 text-sm">Confidence</span>
                  <p className="text-gold text-2xl font-bold">{Math.round(selectedDiscovery.confidence * 100)}%</p>
                </div>
                <div className="bg-obsidian-light rounded-lg p-4">
                  <span className="text-marble/50 text-sm">Novelty Score</span>
                  <p className="text-gold text-2xl font-bold">{Math.round(selectedDiscovery.novelty_score * 100)}%</p>
                </div>
                <div className="bg-obsidian-light rounded-lg p-4">
                  <span className="text-marble/50 text-sm">Statistical Significance</span>
                  <p className="text-gold text-lg font-bold">{selectedDiscovery.statistical_significance}</p>
                </div>
              </div>

              {selectedDiscovery.evidence && selectedDiscovery.evidence.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-gold font-medium mb-3">Evidence</h3>
                  <div className="space-y-2">
                    {selectedDiscovery.evidence.map((e, i) => (
                      <div key={i} className="bg-obsidian-light rounded-lg p-3">
                        <span className="text-marble/50 text-sm uppercase">{e.type}</span>
                        <p className="text-marble/80">{e.detail}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedDiscovery.doi && (
                <div className="pt-4 border-t border-gold/10">
                  <span className="text-marble/50 text-sm">Citable DOI:</span>
                  <p className="text-gold">{selectedDiscovery.doi}</p>
                  <p className="text-marble/40 text-sm mt-1">Attributed to: {selectedDiscovery.attributed_to || 'LOGOS_AI'}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
