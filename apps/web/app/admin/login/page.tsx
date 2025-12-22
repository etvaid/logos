'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Check credentials
    const ADMIN_EMAIL = 'admin@logos-classics.com'
    const ADMIN_PASSWORD = 'raizada2'

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      localStorage.setItem('logos_admin_token', 'admin_authenticated')
      router.push('/admin/dashboard')
    } else {
      setError('Invalid credentials')
    }
    setLoading(false)
  }

  return (
    <main className="min-h-screen bg-obsidian flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="font-serif text-3xl font-bold text-gold tracking-widest">
            LOGOS
          </Link>
          <p className="text-marble/60 mt-2">Admin Login</p>
        </div>

        <form onSubmit={handleLogin} className="glass rounded-xl p-8">
          {error && (
            <div className="mb-6 p-4 bg-crimson/20 border border-crimson/40 rounded-lg text-crimson text-sm">
              {error}
            </div>
          )}

          <div className="mb-6">
            <label className="block text-marble/70 text-sm mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-obsidian-light border border-gold/20 rounded-lg px-4 py-3 text-marble placeholder-marble/30 focus:outline-none focus:border-gold/50"
              placeholder="admin@logos-classics.com"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-marble/70 text-sm mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-obsidian-light border border-gold/20 rounded-lg px-4 py-3 text-marble placeholder-marble/30 focus:outline-none focus:border-gold/50"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gold text-obsidian rounded-lg font-medium hover:bg-gold-light transition-colors disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-marble/40 text-sm mt-6">
          <Link href="/" className="hover:text-gold transition-colors">
            ← Back to LOGOS
          </Link>
        </p>
      </div>
    </main>
  )
}
