'use client';
import React, { useState, useEffect } from 'react';
const STATS = { users: 1247, searches: 38920, translations: 14560, discoveries: 847 };
const DAILY = [65, 78, 82, 91, 88, 95, 102];
export default function AnalyticsPage() {
  const [range, setRange] = useState('7d');
  useEffect(() => { const t = localStorage.getItem('logos_admin_token'); if (!t) window.location.href = '/admin'; }, []);
  return (
    <div className="min-h-screen bg-[#0D0D0F] text-[#F5F4F2]">
      <nav className="fixed top-0 w-full z-50 bg-[#0D0D0F]/80 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <a href="/" className="text-2xl font-bold tracking-wider">LOGOS</a>
          <a href="/admin" className="text-gray-400">← Admin</a>
        </div>
      </nav>
      <main className="pt-24 pb-12 px-6 max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Analytics</h1>
          <div className="flex gap-2">{['7d', '30d', 'all'].map(r => (<button key={r} onClick={() => setRange(r)} className={`px-3 py-1 rounded-lg ${range === r ? 'bg-[#C9A227] text-black' : 'bg-[#1E1E24]'}`}>{r}</button>))}</div>
        </div>
        <div className="grid md:grid-cols-4 gap-4 mb-8">{Object.entries(STATS).map(([k, v]) => (<div key={k} className="p-5 rounded-2xl bg-[#1E1E24]"><div className="text-gray-400 text-sm capitalize">{k}</div><div className="text-3xl font-bold">{v.toLocaleString()}</div></div>))}</div>
        <div className="p-6 rounded-2xl bg-[#1E1E24] mb-8">
          <h2 className="font-semibold mb-4">Daily Active Users</h2>
          <div className="flex items-end gap-2 h-40">{DAILY.map((d, i) => (<div key={i} className="flex-1 bg-[#C9A227] rounded-t" style={{ height: `${d}%` }} />))}</div>
          <div className="flex justify-between mt-2 text-xs text-gray-400">{['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => (<span key={d}>{d}</span>))}</div>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl bg-[#1E1E24]"><h3 className="font-semibold mb-4">Top Searches</h3>{['justice', 'virtue', 'fate', 'love', 'god'].map((s, i) => (<div key={i} className="flex justify-between py-2"><span>{s}</span><span className="text-gray-400">{Math.floor(Math.random() * 500) + 100}</span></div>))}</div>
          <div className="p-6 rounded-2xl bg-[#1E1E24]"><h3 className="font-semibold mb-4">User Demographics</h3>{[{ n: 'Students', p: 60 }, { n: 'Scholars', p: 25 }, { n: 'Other', p: 15 }].map(d => (<div key={d.n} className="mb-3"><div className="flex justify-between mb-1"><span>{d.n}</span><span>{d.p}%</span></div><div className="h-2 bg-gray-700 rounded-full"><div className="h-full bg-[#C9A227] rounded-full" style={{ width: `${d.p}%` }} /></div></div>))}</div>
        </div>
      </main>
    </div>
  );
}
