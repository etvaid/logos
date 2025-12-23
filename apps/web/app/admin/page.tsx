'use client';
import React, { useState, useEffect } from 'react';

const API_URL = 'https://logos-production-ef2b.up.railway.app';

export default function AdminPage() {
  const [dark] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('logos_admin_token');
    if (token) setLoggedIn(true);
  }, []);

  const login = async () => {
    setError('');
    if (email === 'admin@logosclassics.com' && password === 'raizada2') {
      localStorage.setItem('logos_admin_token', 'demo_token_' + Date.now());
      setLoggedIn(true);
    } else {
      try {
        const res = await fetch(`${API_URL}/api/auth/login`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });
        if (res.ok) { const d = await res.json(); localStorage.setItem('logos_admin_token', d.token); setLoggedIn(true); }
        else setError('Invalid credentials');
      } catch { setError('Login failed'); }
    }
  };

  const logout = () => { localStorage.removeItem('logos_admin_token'); setLoggedIn(false); };

  const stats = [
    { n: 'Total Users', v: '1,247', c: '+12%' },
    { n: 'Searches Today', v: '3,892', c: '+8%' },
    { n: 'Translations', v: '1,456', c: '+15%' },
    { n: 'Active Sessions', v: '89', c: '' },
  ];

  const actions = [
    { n: 'Harvard Outreach', d: '10 professors', l: '/admin/outreach', i: '🎓' },
    { n: 'Twitter', d: '@LogosClassics', l: '/admin/twitter', i: '🐦' },
    { n: 'Content', d: '7 drafts', l: '/admin/content', i: '📝' },
    { n: 'Analytics', d: 'View stats', l: '/admin/analytics', i: '📊' },
  ];

  if (!loggedIn) {
    return (
      <div className="min-h-screen bg-[#0D0D0F] text-[#F5F4F2] flex items-center justify-center p-6">
        <div className="max-w-md w-full p-8 rounded-2xl bg-[#1E1E24]">
          <h1 className="text-2xl font-bold mb-6 text-center">LOGOS Admin</h1>
          {error && <div className="mb-4 p-3 bg-red-500/20 text-red-400 rounded-xl text-sm">{error}</div>}
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email"
            className="w-full px-4 py-3 rounded-xl bg-[#0D0D0F] border border-white/10 mb-4" />
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password"
            className="w-full px-4 py-3 rounded-xl bg-[#0D0D0F] border border-white/10 mb-6" />
          <button onClick={login} className="w-full py-3 bg-[#C9A227] text-black rounded-xl font-bold">Login</button>
          <p className="mt-4 text-center text-gray-500 text-sm">Demo: admin@logosclassics.com / raizada2</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0D0D0F] text-[#F5F4F2]">
      <nav className="fixed top-0 w-full z-50 bg-[#0D0D0F]/80 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <a href="/" className="text-2xl font-bold tracking-wider">LOGOS</a>
          <div className="flex items-center gap-4">
            <span className="text-gray-400">Admin</span>
            <button onClick={logout} className="px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20">Logout</button>
          </div>
        </div>
      </nav>
      <main className="pt-24 pb-12 px-6 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

        <div className="grid md:grid-cols-4 gap-4 mb-8">
          {stats.map((s, i) => (
            <div key={i} className="p-5 rounded-2xl bg-[#1E1E24]">
              <div className="text-gray-400 text-sm mb-1">{s.n}</div>
              <div className="text-3xl font-bold">{s.v}</div>
              {s.c && <div className="text-green-400 text-sm">{s.c}</div>}
            </div>
          ))}
        </div>

        <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {actions.map((a, i) => (
            <a key={i} href={a.l} className="p-5 rounded-2xl bg-[#1E1E24] hover:bg-[#252530] transition">
              <div className="text-3xl mb-2">{a.i}</div>
              <div className="font-bold">{a.n}</div>
              <div className="text-gray-400 text-sm">{a.d}</div>
            </a>
          ))}
        </div>

        <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
        <div className="rounded-2xl bg-[#1E1E24] p-5">
          {[
            { t: '2 min ago', a: 'New user signup', d: 'scholar@harvard.edu' },
            { t: '15 min ago', a: 'Translation completed', d: 'Iliad 1.1-50 (Literary style)' },
            { t: '1 hour ago', a: 'Discovery generated', d: '3rd order pattern detected' },
            { t: '3 hours ago', a: 'SEMANTIA query', d: 'ἀρετή analyzed' },
          ].map((r, i) => (
            <div key={i} className={`py-3 ${i > 0 ? 'border-t border-white/10' : ''}`}>
              <div className="flex justify-between">
                <span className="font-medium">{r.a}</span>
                <span className="text-gray-500 text-sm">{r.t}</span>
              </div>
              <div className="text-gray-400 text-sm">{r.d}</div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
