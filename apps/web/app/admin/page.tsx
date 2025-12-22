'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function AdminDashboard() {
  const [metrics, setMetrics] = useState({
    users_total: 1247,
    users_today: 23,
    users_growth: 12.5,
    searches_today: 892,
    translations_today: 341,
    discoveries_total: 47,
    content_pending: 3
  })

  const [contentQueue, setContentQueue] = useState([
    { id: 1, type: 'blog', title: '5 Ways AI Transforms Classical Research', seo_score: 94, status: 'pending' },
    { id: 2, type: 'twitter', title: 'How Virgil echoed Homer — visualized', seo_score: 87, status: 'pending' },
    { id: 3, type: 'blog', title: 'The Future of Digital Humanities', seo_score: 91, status: 'pending' },
  ])

  const approveContent = (id: number) => {
    setContentQueue(prev => prev.map(c => 
      c.id === id ? { ...c, status: 'approved' } : c
    ))
  }

  return (
    <main className="min-h-screen bg-obsidian">
      {/* Header */}
      <header className="glass border-b border-gold/10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <Link href="/" className="font-serif text-xl text-gold">LOGOS</Link>
            <span className="text-marble/50 ml-4">Admin Dashboard</span>
          </div>
          <nav className="flex gap-6">
            <Link href="/admin" className="text-gold">Dashboard</Link>
            <Link href="/admin/outreach" className="text-marble/70 hover:text-gold">Outreach</Link>
            <Link href="/admin/growth" className="text-marble/70 hover:text-gold">Growth</Link>
          </nav>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <div className="glass rounded-xl p-6">
            <p className="text-marble/50 text-sm">Total Users</p>
            <p className="text-3xl font-bold text-gold">{metrics.users_total.toLocaleString()}</p>
            <p className="text-emerald text-sm">+{metrics.users_growth}% this week</p>
          </div>
          <div className="glass rounded-xl p-6">
            <p className="text-marble/50 text-sm">Searches Today</p>
            <p className="text-3xl font-bold text-gold">{metrics.searches_today}</p>
          </div>
          <div className="glass rounded-xl p-6">
            <p className="text-marble/50 text-sm">Translations Today</p>
            <p className="text-3xl font-bold text-gold">{metrics.translations_today}</p>
          </div>
          <div className="glass rounded-xl p-6">
            <p className="text-marble/50 text-sm">Discoveries</p>
            <p className="text-3xl font-bold text-gold">{metrics.discoveries_total}</p>
          </div>
        </div>

        {/* Today's Priorities */}
        <div className="glass rounded-xl p-6 mb-8">
          <h2 className="font-serif text-2xl text-gold mb-6">Today's Priorities</h2>
          
          <div className="space-y-4">
            {contentQueue.filter(c => c.status === 'pending').map(item => (
              <div key={item.id} className="bg-obsidian-light rounded-lg p-4 border border-gold/10">
                <div className="flex justify-between items-start">
                  <div>
                    <span className={`text-xs px-2 py-1 rounded ${
                      item.type === 'blog' ? 'bg-emerald/20 text-emerald' : 'bg-blue-500/20 text-blue-400'
                    }`}>
                      {item.type.toUpperCase()}
                    </span>
                    <h3 className="text-marble font-medium mt-2">{item.title}</h3>
                    <p className="text-marble/50 text-sm mt-1">SEO Score: {item.seo_score}/100</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="px-4 py-2 bg-obsidian border border-gold/20 rounded text-marble/70 hover:text-marble transition-colors">
                      Preview
                    </button>
                    <button 
                      onClick={() => approveContent(item.id)}
                      className="px-4 py-2 bg-gold text-obsidian rounded font-medium hover:bg-gold-light transition-colors"
                    >
                      Approve & Publish
                    </button>
                  </div>
                </div>
              </div>
            ))}
            
            {contentQueue.filter(c => c.status === 'pending').length === 0 && (
              <p className="text-marble/50 text-center py-8">All caught up! No pending content.</p>
            )}
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid md:grid-cols-2 gap-6">
          <Link href="/admin/outreach" className="glass rounded-xl p-6 hover:border-gold/40 transition-colors">
            <h3 className="font-serif text-xl text-gold mb-2">📧 Harvard Outreach</h3>
            <p className="text-marble/60">30 professors loaded. 5 emails ready to send.</p>
          </Link>
          
          <Link href="/admin/growth" className="glass rounded-xl p-6 hover:border-gold/40 transition-colors">
            <h3 className="font-serif text-xl text-gold mb-2">📈 Growth Engine</h3>
            <p className="text-marble/60">10 blog drafts ready. Social content queued.</p>
          </Link>
        </div>
      </div>
    </main>
  )
}
