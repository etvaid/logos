'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const API_BASE = 'https://logos-production-ef2b.up.railway.app'

export default function TwitterAdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [connected, setConnected] = useState(false)
  const [account, setAccount] = useState('')
  const [tweetContent, setTweetContent] = useState('')
  const [posting, setPosting] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string; url?: string } | null>(null)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('logos_admin_token')
    if (!token) {
      router.push('/admin/login')
      return
    }
    setIsAuthenticated(true)
    setIsLoading(false)
    checkConnection()
  }, [router])

  const checkConnection = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/social/twitter/verify`)
      const data = await res.json()
      setConnected(data.connected)
      setAccount(data.account || '')
    } catch (err) {
      setConnected(false)
    }
  }

  const postTweet = async () => {
    setPosting(true)
    setResult(null)
    
    try {
      const res = await fetch(`${API_BASE}/api/social/twitter/post`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: tweetContent })
      })
      const data = await res.json()
      setResult(data)
      if (data.success) setTweetContent('')
    } catch (err) {
      setResult({ success: false, message: 'Failed to post tweet' })
    } finally {
      setPosting(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('logos_admin_token')
    router.push('/admin/login')
  }

  const sampleTweets = [
    "🏛️ Did you know? The word 'tragedy' comes from Greek τραγῳδία — literally 'goat song.' #Classics #Etymology",
    "✨ \"μῆνιν ἄειδε, θεά\" — 'Sing, goddess, the wrath' opens Homer's Iliad. That single word μῆνιν shapes the entire epic. #Homer",
    "📚 Virgil's Aeneid opens with 'Arma virumque cano' — echoing both the Iliad (arms) and the Odyssey (man). Masterful intertextuality. #Virgil",
    "🏛️ Introducing LOGOS — AI-powered classical research. Search 69M+ words of Greek & Latin by meaning. https://logos-classics.com #DigitalHumanities",
  ]

  if (isLoading) {
    return <main className="min-h-screen bg-obsidian flex items-center justify-center"><p className="text-marble/50">Loading...</p></main>
  }

  if (!isAuthenticated) return null

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
            <Link href="/admin/twitter" className="text-gold">Twitter</Link>
            <Link href="/admin/analytics" className="text-marble/70 hover:text-gold transition-colors">Analytics</Link>
            <button onClick={handleLogout} className="text-crimson hover:text-crimson/80">Logout</button>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="font-serif text-3xl text-gold">Twitter Manager</h1>
            <p className="text-marble/60 mt-1">Post tweets about classical content</p>
          </div>
          <div className={`px-4 py-2 rounded-lg ${connected ? 'bg-emerald/20 text-emerald' : 'bg-crimson/20 text-crimson'}`}>
            {connected ? `✓ Connected as @${account}` : '✗ Not connected'}
          </div>
        </div>

        {result && (
          <div className={`mb-6 p-4 rounded-lg ${result.success ? 'bg-emerald/20 border border-emerald/30' : 'bg-crimson/20 border border-crimson/30'}`}>
            <p className={result.success ? 'text-emerald' : 'text-crimson'}>{result.message}</p>
            {result.url && (
              <a href={result.url} target="_blank" rel="noopener noreferrer" className="text-gold hover:underline text-sm mt-1 block">
                View tweet →
              </a>
            )}
          </div>
        )}

        <div className="glass rounded-xl p-6 mb-8">
          <textarea
            value={tweetContent}
            onChange={(e) => setTweetContent(e.target.value)}
            placeholder="What's happening in the classical world?"
            className="w-full bg-transparent border-none text-marble text-lg placeholder-marble/30 focus:outline-none resize-none min-h-[120px]"
            maxLength={280}
          />
          <div className="flex justify-between items-center mt-4 pt-4 border-t border-gold/10">
            <span className={`text-sm ${tweetContent.length > 260 ? 'text-amber' : 'text-marble/50'}`}>
              {tweetContent.length}/280
            </span>
            <button
              onClick={postTweet}
              disabled={posting || !tweetContent.trim() || !connected}
              className="px-6 py-2 bg-gold text-obsidian rounded-lg font-medium hover:bg-gold-light transition-colors disabled:opacity-50"
            >
              {posting ? 'Posting...' : 'Tweet'}
            </button>
          </div>
        </div>

        <div className="glass rounded-xl p-6">
          <h2 className="font-serif text-lg text-gold mb-4">Sample Tweets</h2>
          <div className="space-y-3">
            {sampleTweets.map((tweet, i) => (
              <button
                key={i}
                onClick={() => setTweetContent(tweet)}
                className="block w-full text-left p-4 bg-obsidian-light rounded-lg text-marble/70 hover:text-marble hover:bg-gold/10 transition-colors text-sm"
              >
                {tweet}
              </button>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
