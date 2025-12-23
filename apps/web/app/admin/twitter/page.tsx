'use client';
import React, { useState, useEffect } from 'react';
const TEMPLATES = [
  { n: 'Launch', t: '🏛️ LOGOS is live!\n\nSearch 1.7M passages of Greek & Latin by meaning, not keywords.\n\n✨ AI translation (3 styles)\n🔍 Semantic search\n🔗 Intertextuality detection\n📚 Free for students\n\nlogos-classics.com' },
  { n: 'Greek Word', t: '📚 Greek word of the day: μῆνις (mēnis)\n\nMeaning: Divine wrath, heroic anger\n\nThis word opens the Iliad and sets the tone for the entire epic. SEMANTIA shows it clusters with divine rather than human anger.\n\nExplore more: logos-classics.com/semantia' },
  { n: 'Discovery', t: '💡 LOGOS just found a pattern:\n\n"Authors who draw from multiple literary traditions show 3.2x higher use of innovative vocabulary."\n\nNovelty score: 0.91\np < 0.001\n\nAI seeing what humans can\'t.\n\nlogos-classics.com/discover' },
];
export default function TwitterPage() {
  const [tweet, setTweet] = useState('');
  const [queue, setQueue] = useState<{id: number; content: string; time: string}[]>([]);
  useEffect(() => { const t = localStorage.getItem('logos_admin_token'); if (!t) window.location.href = '/admin'; }, []);
  return (
    <div className="min-h-screen bg-[#0D0D0F] text-[#F5F4F2]">
      <nav className="fixed top-0 w-full z-50 bg-[#0D0D0F]/80 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <a href="/" className="text-2xl font-bold tracking-wider">LOGOS</a>
          <a href="/admin" className="text-gray-400">← Admin</a>
        </div>
      </nav>
      <main className="pt-24 pb-12 px-6 max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Twitter Management</h1>
          <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">Connected @LogosClassics</span>
        </div>
        <div className="p-6 rounded-2xl bg-[#1E1E24] mb-8">
          <h2 className="font-semibold mb-4">Compose Tweet</h2>
          <textarea value={tweet} onChange={e => setTweet(e.target.value)} placeholder="What's happening in the ancient world?" rows={4} className="w-full px-4 py-3 rounded-xl bg-[#0D0D0F] border border-white/10 mb-2" />
          <div className="flex justify-between items-center mb-4">
            <span className={`text-sm ${tweet.length > 280 ? 'text-red-400' : 'text-gray-400'}`}>{tweet.length}/280</span>
            <div className="flex gap-3">
              <button onClick={() => setQueue([...queue, { id: Date.now(), content: tweet, time: 'Scheduled' }])} className="px-4 py-2 bg-white/10 rounded-xl">Schedule</button>
              <button className="px-4 py-2 bg-[#1DA1F2] text-white rounded-xl font-semibold">Post Now</button>
            </div>
          </div>
          <h3 className="font-semibold mb-3">Templates</h3>
          <div className="flex gap-2">{TEMPLATES.map((t, i) => (<button key={i} onClick={() => setTweet(t.t)} className="px-3 py-1 bg-white/5 rounded-lg text-sm hover:bg-white/10">{t.n}</button>))}</div>
        </div>
        <div className="p-6 rounded-2xl bg-[#1E1E24] mb-8">
          <h2 className="font-semibold mb-4">Scheduled Queue ({queue.length})</h2>
          {queue.length === 0 ? <p className="text-gray-400">No scheduled tweets</p> : queue.map(q => (
            <div key={q.id} className="p-4 bg-[#0D0D0F] rounded-xl mb-3"><p className="text-sm mb-2">{q.content.slice(0, 100)}...</p><div className="flex justify-between"><span className="text-gray-400 text-xs">{q.time}</span><button onClick={() => setQueue(queue.filter(x => x.id !== q.id))} className="text-red-400 text-xs">Delete</button></div></div>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-[#1E1E24] text-center"><div className="text-2xl font-bold">127</div><div className="text-gray-400 text-sm">Followers</div></div>
          <div className="p-4 rounded-2xl bg-[#1E1E24] text-center"><div className="text-2xl font-bold">3.2%</div><div className="text-gray-400 text-sm">Engagement</div></div>
          <div className="p-4 rounded-2xl bg-[#1E1E24] text-center"><div className="text-2xl font-bold">2.4K</div><div className="text-gray-400 text-sm">Impressions/wk</div></div>
        </div>
      </main>
    </div>
  );
}
