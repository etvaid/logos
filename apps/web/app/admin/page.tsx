'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

const API_BASE = 'https://logos-production-ef2b.up.railway.app'

interface Metrics {
  users_total: number
  users_today: number
  users_growth: number
  searches_today: number
  translations_today: number
  discoveries_total: number
  content_pending: number
}

interface ContentItem {
  id: number
  content_type: string
  title: string
  content: string
  seo_score: number
  status: string
}

export default function AdminPage() {
  const [metrics, setMetrics] = useState<Metrics | null>(null)
  const [content, setContent] = useState<ContentItem[]>([])
  const [loading, setLoading] = useState(true)
  const [twitterStatus, setTwitterStatus] = useState<{ connected: boolean; account?: string } | null>(null)

  useEffect(() => {
    fetchDashboard()
  }, [])

  const fetchDashboard = async () => {
    setLoading(true)
    try {
      const [metricsRes, contentRes, twitterRes] = await Promise.all([
        fetch(`${API_BASE}/api/admin/metrics`),
        fetch(`${API_BASE}/api/admin/content?status=pending`),
        fetch(`${API_BASE}/api/social/twitter/verify`)
      ])
      
      const metricsData = await metricsRes.json()
      const contentData = await contentRes.json()
      const twitterData = await twitterRes.json()
      
      setMetrics(metricsData)
      setContent(contentData.content || [])
      setTwitterStatus(twitterData)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const approveContent = async (id: number) => {
    try {
      await fetch(`${API_BASE}/api/admin/content/${id}/approve`, { method: 'POST' })
      setContent(prev => prev.filter(c => c.id !== id))
    } catch (err) {
      console.error(err)
    }
  }

  const generateContent = async () => {
    try {
      await fetch(`${API_BASE}/api/admin/content/generate`, { method: 'POST' })
      fetchDashboard()
    } catch (err) {
      console.error(err)
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
            <Link href="/admin" className="text-gold">Dashboard</Link>
            <Link href="/admin/outreach" className="text-marble/70 hover:text-gold transition-colors">Outreach</Link>
            <Link href="/admin/twitter" className="text-marble/70 hover:text-gold transition-colors">Twitter</Link>
            <Link href="/admin/analytics" className="text-marble/70 hover:text-gold transition-colors">Analytics</Link>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="font-serif text-3xl text-gold">Admin Dashboard</h1>
          <div className="flex gap-4">
            <button
              onClick={generateContent}
              className="px-4 py-2 bg-gold text-obsidian rounded-lg font-medium hover:bg-gold-light transition-colors"
            >
              ✨ Generate Content
            </button>
            <Link
              href="/admin/outreach"
              className="px-4 py-2 border border-gold/20 text-gold rounded-lg hover:bg-gold/10 transition-colors"
            >
              📧 Send Outreach
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-16 text-marble/50">Loading dashboard...</div>
        ) : (
          <>
            {/* Metrics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
              <div className="glass rounded-xl p-4">
                <span className="text-marble/50 text-sm">Total Users</span>
                <p className="text-2xl font-bold text-gold">{metrics?.users_total?.toLocaleString() || 0}</p>
              </div>
              <div className="glass rounded-xl p-4">
                <span className="text-marble/50 text-sm">Users Today</span>
                <p className="text-2xl font-bold text-gold">{metrics?.users_today || 0}</p>
                <span className="text-emerald text-xs">+{metrics?.users_growth || 0}%</span>
              </div>
              <div className="glass rounded-xl p-4">
                <span className="text-marble/50 text-sm">Searches Today</span>
                <p className="text-2xl font-bold text-gold">{metrics?.searches_today || 0}</p>
              </div>
              <div className="glass rounded-xl p-4">
                <span className="text-marble/50 text-sm">Translations</span>
                <p className="text-2xl font-bold text-gold">{metrics?.translations_today || 0}</p>
              </div>
              <div className="glass rounded-xl p-4">
                <span className="text-marble/50 text-sm">Discoveries</span>
                <p className="text-2xl font-bold text-gold">{metrics?.discoveries_total || 0}</p>
              </div>
              <div className="glass rounded-xl p-4">
                <span className="text-marble/50 text-sm">Pending Content</span>
                <p className="text-2xl font-bold text-amber">{metrics?.content_pending || content.length}</p>
              </div>
              <div className="glass rounded-xl p-4">
                <span className="text-marble/50 text-sm">Twitter</span>
                <p className={`text-lg font-bold ${twitterStatus?.connected ? 'text-emerald' : 'text-crimson'}`}>
                  {twitterStatus?.connected ? '✓ Connected' : '✗ Disconnected'}
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <Link href="/admin/outreach" className="glass rounded-xl p-6 hover:border-gold/30 transition-all">
                <span className="text-3xl mb-3 block">📧</span>
                <h3 className="font-serif text-lg text-gold mb-2">Harvard Outreach</h3>
                <p className="text-marble/60 text-sm">Send personalized emails to professors and researchers</p>
              </Link>
              <Link href="/admin/twitter" className="glass rounded-xl p-6 hover:border-gold/30 transition-all">
                <span className="text-3xl mb-3 block">🐦</span>
                <h3 className="font-serif text-lg text-gold mb-2">Twitter Manager</h3>
                <p className="text-marble/60 text-sm">Post tweets and threads about classical content</p>
              </Link>
              <Link href="/admin/analytics" className="glass rounded-xl p-6 hover:border-gold/30 transition-all">
                <span className="text-3xl mb-3 block">📊</span>
                <h3 className="font-serif text-lg text-gold mb-2">Analytics</h3>
                <p className="text-marble/60 text-sm">View detailed usage metrics and trends</p>
              </Link>
            </div>

            {/* Content Queue */}
            <div className="glass rounded-xl p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-serif text-xl text-gold">Content Approval Queue</h2>
                <span className="text-marble/50 text-sm">{content.length} pending</span>
              </div>

              {content.length > 0 ? (
                <div className="space-y-4">
                  {content.map(item => (
                    <div key={item.id} className="bg-obsidian-light rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <span className="text-xs px-2 py-1 bg-gold/20 text-gold rounded">{item.content_type}</span>
                          <h3 className="text-marble font-medium mt-2">{item.title}</h3>
                        </div>
                        <div className="text-right">
                          <span className="text-marble/50 text-sm">SEO Score</span>
                          <p className={`font-bold ${item.seo_score >= 80 ? 'text-emerald' : item.seo_score >= 60 ? 'text-amber' : 'text-crimson'}`}>
                            {item.seo_score}%
                          </p>
                        </div>
                      </div>
                      <p className="text-marble/60 text-sm mb-4 line-clamp-2">{item.content}</p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => approveContent(item.id)}
                          className="px-4 py-2 bg-emerald/20 text-emerald rounded-lg text-sm hover:bg-emerald/30 transition-colors"
                        >
                          ✓ Approve
                        </button>
                        <button className="px-4 py-2 bg-obsidian text-marble/70 rounded-lg text-sm hover:text-marble transition-colors">
                          Edit
                        </button>
                        <button className="px-4 py-2 bg-crimson/20 text-crimson rounded-lg text-sm hover:bg-crimson/30 transition-colors">
                          ✗ Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-marble/50">
                  No pending content. Click "Generate Content" to create new posts.
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </main>
  )
}
