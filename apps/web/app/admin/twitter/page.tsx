'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

const API_BASE = 'https://logos-production-ef2b.up.railway.app'

export default function TwitterAdminPage() {
  const [connected, setConnected] = useState(false)
  const [account, setAccount] = useState('')
  const [tweetContent, setTweetContent] = useState('')
  const [threadMode, setThreadMode] = useState(false)
  const [threadTweets, setThreadTweets] = useState([''])
  const [posting, setPosting] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string; url?: string } | null>(null)
  const [queue, setQueue] = useState<any[]>([])

  useEffect(() => {
    checkConnection()
    fetchQueue()
  }, [])

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

  const fetchQueue = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/social/queue`)
      const data = await res.json()
      setQueue(data.queue || [])
    } catch (err) {
      console.error(err)
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

  const postThread = async () => {
    setPosting(true)
    setResult(null)
    
    try {
      const res = await fetch(`${API_BASE}/api/social/twitter/thread`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tweets: threadTweets.filter(t => t.trim()) })
      })
      const data = await res.json()
      setResult(data)
      if (data.success) setThreadTweets([''])
    } catch (err) {
      setResult({ success: false, message: 'Failed to post thread' })
    } finally {
      setPosting(false)
    }
  }

  const addThreadTweet = () => {
    setThreadTweets([...threadTweets, ''])
  }

  const updateThreadTweet = (index: number, value: string) => {
    const newTweets = [...threadTweets]
    newTweets[index] = value
    setThreadTweets(newTweets)
  }

  const sampleTweets = [
    "🏛️ Did you know? The word 'tragedy' comes from Greek τραγῳδία (tragōidía), literally 'goat song' — possibly referring to the prize of a goat in early dramatic competitions. #Classics #Etymology",
    "✨ \"μῆνιν ἄειδε, θεά\" — 'Sing, goddess, the wrath' opens Homer's Iliad. That single word μῆνιν (wrath) shapes the entire epic. What word would you choose to define your story? #Homer #GreekLiterature",
    "📚 Virgil's Aeneid opens with 'Arma virumque cano' — deliberately echoing both the Iliad (arms) and the Odyssey (man). A masterclass in intertextuality. #Virgil #LatinLiterature",
  ]

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
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="font-serif text-3xl text-gold">Twitter Manager</h1>
            <p className="text-marble/60 mt-1">Post tweets and threads about classical content</p>
          </div>
          <div className={`px-4 py-2 rounded-lg ${connected ? 'bg-emerald/20 text-emerald' : 'bg-crimson/20 text-crimson'}`}>
            {connected ? `✓ Connected as @${account}` : '✗ Not connected'}
          </div>
        </div>

        {/* Result Banner */}
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

        {/* Mode Toggle */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setThreadMode(false)}
            className={`px-4 py-2 rounded-lg transition-colors ${!threadMode ? 'bg-gold text-obsidian' : 'bg-obsidian-light text-marble/70 hover:text-gold'}`}
          >
            Single Tweet
          </button>
          <button
            onClick={() => setThreadMode(true)}
            className={`px-4 py-2 rounded-lg transition-colors ${threadMode ? 'bg-gold text-obsidian' : 'bg-obsidian-light text-marble/70 hover:text-gold'}`}
          >
            Thread
          </button>
        </div>

        {/* Single Tweet */}
        {!threadMode && (
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
        )}

        {/* Thread Mode */}
        {threadMode && (
          <div className="space-y-4 mb-8">
            {threadTweets.map((tweet, index) => (
              <div key={index} className="glass rounded-xl p-4">
                <div className="flex gap-4">
                  <span className="text-gold font-bold">{index + 1}/</span>
                  <div className="flex-1">
                    <textarea
                      value={tweet}
                      onChange={(e) => updateThreadTweet(index, e.target.value)}
                      placeholder={index === 0 ? "Start your thread..." : "Continue..."}
                      className="w-full bg-transparent border-none text-marble placeholder-marble/30 focus:outline-none resize-none min-h-[80px]"
                      maxLength={280}
                    />
                    <span className={`text-xs ${tweet.length > 260 ? 'text-amber' : 'text-marble/40'}`}>
                      {tweet.length}/280
                    </span>
                  </div>
                </div>
              </div>
            ))}
            
            <div className="flex gap-4">
              <button
                onClick={addThreadTweet}
                className="px-4 py-2 bg-obsidian-light text-gold rounded-lg hover:bg-gold/10 transition-colors"
              >
                + Add Tweet
              </button>
              <button
                onClick={postThread}
                disabled={posting || threadTweets.every(t => !t.trim()) || !connected}
                className="px-6 py-2 bg-gold text-obsidian rounded-lg font-medium hover:bg-gold-light transition-colors disabled:opacity-50"
              >
                {posting ? 'Posting...' : `Post Thread (${threadTweets.filter(t => t.trim()).length} tweets)`}
              </button>
            </div>
          </div>
        )}

        {/* Sample Tweets */}
        <div className="glass rounded-xl p-6 mb-8">
          <h2 className="font-serif text-lg text-gold mb-4">Sample Tweets</h2>
          <div className="space-y-3">
            {sampleTweets.map((tweet, i) => (
              <button
                key={i}
                onClick={() => threadMode ? updateThreadTweet(0, tweet) : setTweetContent(tweet)}
                className="block w-full text-left p-4 bg-obsidian-light rounded-lg text-marble/70 hover:text-marble hover:bg-gold/10 transition-colors text-sm"
              >
                {tweet}
              </button>
            ))}
          </div>
        </div>

        {/* Queue */}
        {queue.length > 0 && (
          <div className="glass rounded-xl p-6">
            <h2 className="font-serif text-lg text-gold mb-4">Scheduled Queue</h2>
            <div className="space-y-3">
              {queue.map((item, i) => (
                <div key={i} className="bg-obsidian-light rounded-lg p-4">
                  <p className="text-marble/80 text-sm">{item.content}</p>
                  <p className="text-marble/40 text-xs mt-2">Scheduled: {item.scheduled_for}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
