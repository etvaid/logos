'use client';
import React, { useState, useEffect } from 'react';
const POSTS = [
  { id: 1, title: '5 Ways AI is Transforming Classical Studies', status: 'draft', time: '8 min' },
  { id: 2, title: 'How Semantic Search Changes Homer Research', status: 'draft', time: '6 min' },
  { id: 3, title: 'Finding Virgil\'s Hidden Allusions with AI', status: 'draft', time: '7 min' },
  { id: 4, title: 'SEMANTIA: Challenging 100 Years of Lexicography', status: 'draft', time: '9 min' },
  { id: 5, title: 'What Greek Words ACTUALLY Meant', status: 'draft', time: '8 min' },
];
export default function ContentPage() {
  const [tab, setTab] = useState('blog');
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
        <h1 className="text-3xl font-bold mb-8">Content Management</h1>
        <div className="flex gap-2 mb-8">{['blog', 'social', 'seo'].map(t => (<button key={t} onClick={() => setTab(t)} className={`px-4 py-2 rounded-xl capitalize ${tab === t ? 'bg-[#C9A227] text-black' : 'bg-[#1E1E24]'}`}>{t}</button>))}</div>
        {tab === 'blog' && <div className="space-y-4">{POSTS.map(p => (
          <div key={p.id} className="p-5 rounded-2xl bg-[#1E1E24] flex justify-between items-center">
            <div><h3 className="font-semibold">{p.title}</h3><p className="text-gray-400 text-sm">{p.time} read • {p.status}</p></div>
            <div className="flex gap-2"><button className="px-3 py-1 bg-white/10 rounded-lg text-sm">Edit</button><button className="px-3 py-1 bg-[#C9A227] text-black rounded-lg text-sm">Publish</button></div>
          </div>
        ))}</div>}
        {tab === 'social' && <div className="p-8 rounded-2xl bg-[#1E1E24] text-center text-gray-400">Content calendar coming soon</div>}
        {tab === 'seo' && <div className="p-6 rounded-2xl bg-[#1E1E24]"><h3 className="font-semibold mb-4">SEO Status</h3>{['Meta tags', 'Sitemap', 'Schema markup', 'Open Graph'].map((s, i) => (<div key={i} className="flex justify-between py-2 border-b border-white/10"><span>{s}</span><span className="text-green-400">✓ Configured</span></div>))}</div>}
      </main>
    </div>
  );
}
