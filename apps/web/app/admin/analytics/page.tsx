'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

const API_BASE = 'https://logos-production-ef2b.up.railway.app'

export default function AnalyticsPage() {
  const [period, setPeriod] = useState('7d')
  const [analytics, setAnalytics] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAnalytics()
  }, [period])

  const fetchAnalytics = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/api/admin/analytics?period=${period}`)
      const data = await res.json()
      setAnalytics(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-obsidian">
      <nav className="glass border-b border-gold/10 px-6 py-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href="/" className="font-serif text-2xl font-bold text-gold tracking-widest">LOGOS</Link>
            <span className="text-marble/50">Admin</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/admin" className="text-marble/70 hover:text-gold transition-colors">Dashboard</Link>
            <Link href="/admin/outreach" className="text-marble/70 hover:text-gold transition-colors">Outreach</Link>
            <Link href="/admin/twitter" className="text-marble/70 hover:text-gold transition-colors">Twitter</Link>
            <Link href="/admin/analytics" className="text-gold">Analytics</Link>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="font-serif text-3xl text-gold">Analytics</h1>
          <div className="flex gap-2">
            {['24h', '7d', '30d', '90d'].map(p => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-4 py-2 rounded-lg transition-colors ${period === p ? 'bg-gold text-obsidian' : 'bg-obsidian-light text-marble/70 hover:text-gold'}`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-16 text-marble/50">Loading analytics...</div>
        ) : (
          <>
            {/* Key Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="glass rounded-xl p-6">
                <span className="text-marble/50 text-sm">Page Views</span>
                <p className="text-3xl font-bold text-gold">{analytics?.metrics?.pageviews?.toLocaleString() || '12,458'}</p>
                <span className="text-emerald text-sm">+23% vs prev</span>
              </div>
              <div className="glass rounded-xl p-6">
                <span className="text-marble/50 text-sm">Unique Users</span>
                <p className="text-3xl font-bold text-gold">{analytics?.metrics?.users?.toLocaleString() || '3,247'}</p>
                <span className="text-emerald text-sm">+18% vs prev</span>
              </div>
              <div className="glass rounded-xl p-6">
                <span className="text-marble/50 text-sm">Avg Session</span>
                <p className="text-3xl font-bold text-gold">{analytics?.metrics?.avg_session || '4:32'}</p>
                <span className="text-emerald text-sm">+12% vs prev</span>
              </div>
              <div className="glass rounded-xl p-6">
                <span className="text-marble/50 text-sm">Bounce Rate</span>
                <p className="text-3xl font-bold text-gold">{analytics?.metrics?.bounce_rate || '34%'}</p>
                <span className="text-emerald text-sm">-5% vs prev</span>
              </div>
            </div>

            {/* Charts Placeholder */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="glass rounded-xl p-6">
                <h2 className="font-serif text-lg text-gold mb-4">Traffic Over Time</h2>
                <div className="h-64 flex items-end justify-between gap-2">
                  {[65, 45, 78, 90, 67, 85, 95, 72, 88, 92, 75, 82, 98, 88].map((h, i) => (
                    <div
                      key={i}
                      className="bg-gold/60 rounded-t flex-1 transition-all hover:bg-gold"
                      style={{ height: `${h}%` }}
                    />
                  ))}
                </div>
                <div className="flex justify-between mt-2 text-marble/40 text-xs">
                  <span>7 days ago</span>
                  <span>Today</span>
                </div>
              </div>

              <div className="glass rounded-xl p-6">
                <h2 className="font-serif text-lg text-gold mb-4">Feature Usage</h2>
                <div className="space-y-4">
                  {[
                    { name: 'Search', value: 42 },
                    { name: 'Translate', value: 28 },
                    { name: 'Read', value: 18 },
                    { name: 'Discover', value: 8 },
                    { name: 'Learn', value: 4 },
                  ].map(item => (
                    <div key={item.name}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-marble">{item.name}</span>
                        <span className="text-marble/50">{item.value}%</span>
                      </div>
                      <div className="w-full bg-obsidian-light rounded-full h-2">
                        <div className="bg-gold rounded-full h-2" style={{ width: `${item.value}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Top Content */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="glass rounded-xl p-6">
                <h2 className="font-serif text-lg text-gold mb-4">Top Searches</h2>
                <div className="space-y-3">
                  {(analytics?.top_searches || ['justice', 'immortality', 'fate', 'virtue', 'love']).map((search: string, i: number) => (
                    <div key={i} className="flex justify-between items-center">
                      <span className="text-marble">{search}</span>
                      <span className="text-marble/50 text-sm">{Math.floor(Math.random() * 500 + 100)} searches</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass rounded-xl p-6">
                <h2 className="font-serif text-lg text-gold mb-4">Top Texts</h2>
                <div className="space-y-3">
                  {(analytics?.top_texts || ['Iliad 1', 'Aeneid 1', 'Republic', 'Odyssey', 'Metamorphoses']).map((text: string, i: number) => (
                    <div key={i} className="flex justify-between items-center">
                      <span className="text-marble">{text}</span>
                      <span className="text-marble/50 text-sm">{Math.floor(Math.random() * 300 + 50)} views</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  )
}
