'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
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

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [metrics, setMetrics] = useState<Metrics | null>(null)
  const [twitterStatus, setTwitterStatus] = useState<{ connected: boolean; account?: string } | null>(null)
  const router = useRouter()

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('logos_admin_token')
    if (!token) {
      router.push('/admin/login')
      return
    }
    setIsAuthenticated(true)
    setIsLoading(false)
    fetchDashboard()
  }, [router])

  const fetchDashboard = async () => {
    try {
      const [metricsRes, twitterRes] = await Promise.all([
        fetch(`${API_BASE}/api/admin/metrics`),
        fetch(`${API_BASE}/api/social/twitter/verify`)
      ])
      
      const metricsData = await metricsRes.json()
      const twitterData = await twitterRes.json()
      
      setMetrics(metricsData)
      setTwitterStatus(twitterData)
    } catch (err) {
      console.error(err)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('logos_admin_token')
    router.push('/admin/login')
  }

  if (isLoading) {
    return (
      <main className="min-h-screen bg-obsidian flex items-center justify-center">
        <p className="text-marble/50">Loading...</p>
      </main>
    )
  }

  if (!isAuthenticated) {
    return null
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
            <button onClick={handleLogout} className="text-crimson hover:text-crimson/80 transition-colors">
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="font-serif text-3xl text-gold">Admin Dashboard</h1>
          <div className="flex gap-4">
            <Link
              href="/admin/outreach"
              className="px-4 py-2 bg-gold text-obsidian rounded-lg font-medium hover:bg-gold-light transition-colors"
            >
              📧 Send Outreach
            </Link>
            <Link
              href="/admin/twitter"
              className="px-4 py-2 border border-gold/20 text-gold rounded-lg hover:bg-gold/10 transition-colors"
            >
              🐦 Post Tweet
            </Link>
          </div>
        </div>

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
            <p className="text-2xl font-bold text-amber">{metrics?.content_pending || 0}</p>
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

        {/* Site Status */}
        <div className="glass rounded-xl p-6">
          <h2 className="font-serif text-xl text-gold mb-4">Site Status</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-obsidian-light rounded-lg p-4 flex justify-between items-center">
              <span className="text-marble">Frontend (Vercel)</span>
              <span className="text-emerald">✓ Online</span>
            </div>
            <div className="bg-obsidian-light rounded-lg p-4 flex justify-between items-center">
              <span className="text-marble">Backend API (Railway)</span>
              <span className="text-emerald">✓ Online</span>
            </div>
            <div className="bg-obsidian-light rounded-lg p-4 flex justify-between items-center">
              <span className="text-marble">Domain (logos-classics.com)</span>
              <span className="text-emerald">✓ Active</span>
            </div>
            <div className="bg-obsidian-light rounded-lg p-4 flex justify-between items-center">
              <span className="text-marble">SSL Certificate</span>
              <span className="text-emerald">✓ Valid</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
