'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

const API_BASE = 'https://logos-production-ef2b.up.railway.app'

interface Discovery {
  id: number
  order_level: number
  pattern_type: string
  hypothesis: string
  description: string
  confidence: number
  novelty_score: number
  statistical_significance: string
}

export default function DiscoverPage() {
  const [discoveries, setDiscoveries] = useState<Discovery[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<number | null>(null)
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
      setTimeout(fetchDiscoveries, 2000)
    } catch (err) {
      console.error(err)
    } finally {
      setGenerating(false)
    }
  }

  const orderInfo = [
    { level: 1, name: '1st Order', desc: 'Direct allusions (A → B)', color: 'bg-blue-500/20 text-blue-400' },
    { level: 2, name: '2nd Order', desc: 'Pattern comparisons', color: 'bg-emerald/20 text-emerald' },
    { level: 3, name: '3rd Order', desc: 'Cross-pattern correlations', color: 'bg-amber/20 text-amber' },
    { level: 4, name: '4th Order', desc: 'Meta-patterns (predictive)', color: 'bg-gold/30 text-gold' },
  ]

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
            Find patterns in classical literature that humans might miss. From simple allusions to meta-patterns with predictive power.
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-4 mb-8">
          {orderInfo.map(order => (
            <button
              key={order.level}
              onClick={() => setSelectedOrder(selectedOrder === order.level ? null : order.level)}
              className={`glass rounded-xl p-4 text-left transition-all ${selectedOrder === order.level ? 'border-gold/50' : ''}`}
            >
              <span className={`inline-block px-2 py-1 rounded text-sm mb-2 ${order.color}`}>
                {order.name}
              </span>
              <p className="text-marble/50 text-sm">{order.desc}</p>
            </button>
          ))}
        </div>

        <div className="text-center mb-8">
          <button
            onClick={generateHypothesis}
            disabled={generating}
            className="px-8 py-3 bg-gold text-obsidian rounded-lg font-medium hover:bg-gold-light transition-colors disabled:opacity-50"
          >
            {generating ? 'Generating...' : '✨ Generate New Hypothesis'}
          </button>
          <p className="text-marble/40 text-sm mt-2">AI analyzes the corpus for novel patterns</p>
        </div>

        {loading ? (
          <div className="text-center py-16 text-marble/50">Loading discoveries...</div>
        ) : discoveries.length > 0 ? (
          <div className="space-y-6">
            {discoveries.map(discovery => (
              <div key={discovery.id} className="glass rounded-xl p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded text-sm ${orderInfo[discovery.order_level - 1]?.color || 'bg-gold/20 text-gold'}`}>
                      {discovery.order_level}st Order
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
                <div className="mt-4 pt-4 border-t border-gold/10">
                  <span className="text-marble/40 text-sm">Statistical significance: {discovery.statistical_significance}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-marble/50 mb-4">No discoveries found.</p>
            <button onClick={() => setSelectedOrder(null)} className="text-gold hover:underline">
              View all discoveries
            </button>
          </div>
        )}

        <div className="mt-12 glass rounded-xl p-6">
          <h2 className="font-serif text-xl text-gold mb-4">How It Works</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-gold/80 font-medium mb-2">Pattern Detection</h3>
              <p className="text-marble/60 text-sm">
                Our AI analyzes millions of passages across Greek and Latin literature, identifying verbal echoes, structural parallels, and thematic connections.
              </p>
            </div>
            <div>
              <h3 className="text-gold/80 font-medium mb-2">Higher-Order Analysis</h3>
              <p className="text-marble/60 text-sm">
                Beyond simple allusions, LOGOS finds patterns in patterns — correlations that emerge across multiple intertextual relationships.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
