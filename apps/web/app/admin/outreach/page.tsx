'use client';
import React, { useState, useEffect } from 'react';

const PROFESSORS = [
  { id: 1, name: 'Gregory Nagy', title: 'CHS Director', email: 'nagy@chs.harvard.edu', specialty: 'Homeric poetry', status: 'not_contacted' },
  { id: 2, name: 'Richard Thomas', title: 'Professor', email: 'rthomas@fas.harvard.edu', specialty: 'Virgil, intertextuality', status: 'not_contacted' },
  { id: 3, name: 'Mark Schiefsky', title: 'Professor', email: 'schiefsk@fas.harvard.edu', specialty: 'Digital humanities', status: 'not_contacted' },
  { id: 4, name: 'Kathleen Coleman', title: 'James Loeb Professor', email: 'kcoleman@fas.harvard.edu', specialty: 'Latin literature', status: 'not_contacted' },
  { id: 5, name: 'Emma Dench', title: 'McLean Professor', email: 'edench@fas.harvard.edu', specialty: 'Roman history', status: 'not_contacted' },
  { id: 6, name: 'Paul Kosmin', title: 'Professor', email: 'pkosmin@fas.harvard.edu', specialty: 'Hellenistic history', status: 'not_contacted' },
  { id: 7, name: 'Jan Ziolkowski', title: 'Porter Professor', email: 'ziolkowski@fas.harvard.edu', specialty: 'Medieval Latin', status: 'not_contacted' },
  { id: 8, name: 'Teresa Morgan', title: 'Professor', email: 'tmorgan@fas.harvard.edu', specialty: 'Ancient education', status: 'not_contacted' },
  { id: 9, name: 'Adrian Staehli', title: 'Professor', email: 'astaehli@fas.harvard.edu', specialty: 'Greek art', status: 'not_contacted' },
  { id: 10, name: 'Ivy Livingston', title: 'Senior Preceptor', email: 'ilivingston@fas.harvard.edu', specialty: 'Latin pedagogy', status: 'not_contacted' },
];

export default function OutreachPage() {
  const [dark] = useState(true);
  const [profs, setProfs] = useState(PROFESSORS);
  const [modal, setModal] = useState<typeof PROFESSORS[0] | null>(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const token = localStorage.getItem('logos_admin_token');
    if (!token) window.location.href = '/admin';
  }, []);

  const getTemplate = (p: typeof PROFESSORS[0]) => {
    const base = `Dear Professor ${p.name.split(' ')[1]},\n\nI hope this message finds you well. I'm reaching out to share LOGOS, an AI-powered research platform for classical literature that I believe may be of interest given your work in ${p.specialty}.\n\n`;
    const specifics: Record<string, string> = {
      'Homeric poetry': `LOGOS includes SEMANTIA, which derives word meaning from 1.7M passages rather than dictionaries. For Homeric studies, this reveals semantic fields that traditional lexicons miss—for instance, how μῆνις clusters with divine anger patterns across the corpus.`,
      'Virgil, intertextuality': `Our intertextuality engine has mapped 500,000+ relationships across the classical corpus, including automatic detection of Virgilian allusions. The system identifies verbal, thematic, and structural parallels with confidence scoring.`,
      'Digital humanities': `LOGOS represents a new approach to computational classics: 892K semantic embeddings, higher-order pattern detection (1st through 4th order), and a Truth/Verification layer that cross-references historical claims. Built on pgvector, Neo4j, and Claude/GPT-4.`,
      'Latin literature': `LOGOS provides comprehensive Latin coverage including much of the Patrologia Latina, with AI translation in three styles (literal, literary, student-friendly) and corpus-grounded quality scoring.`,
    };
    const specific = specifics[p.specialty] || `LOGOS offers semantic search across 1.7M passages, AI translation with quality scoring, and a Discovery Engine that finds patterns no human could see at scale.`;
    return base + specific + `\n\nWould you have 15 minutes for a brief demo this week?\n\nBest regards,\nRoy Vaid\nFounder, LOGOS`;
  };

  const updateStatus = (id: number, status: string) => {
    setProfs(profs.map(p => p.id === id ? { ...p, status } : p));
  };

  const filtered = filter === 'all' ? profs : profs.filter(p => p.status === filter);
  const statusColors: Record<string, string> = {
    not_contacted: 'bg-gray-500/20 text-gray-400',
    sent: 'bg-yellow-500/20 text-yellow-400',
    replied: 'bg-green-500/20 text-green-400',
    meeting: 'bg-blue-500/20 text-blue-400',
  };

  return (
    <div className="min-h-screen bg-[#0D0D0F] text-[#F5F4F2]">
      <nav className="fixed top-0 w-full z-50 bg-[#0D0D0F]/80 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <a href="/" className="text-2xl font-bold tracking-wider">LOGOS</a>
          <a href="/admin" className="text-gray-400 hover:text-white">← Admin</a>
        </div>
      </nav>
      <main className="pt-24 pb-12 px-6 max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Harvard Outreach</h1>
        <p className="text-gray-400 mb-8">10 professors in Harvard Classics Department</p>

        <div className="flex gap-2 mb-6">
          {['all', 'not_contacted', 'sent', 'replied', 'meeting'].map(s => (
            <button key={s} onClick={() => setFilter(s)} className={`px-4 py-2 rounded-xl capitalize ${filter === s ? 'bg-[#C9A227] text-black' : 'bg-[#1E1E24]'}`}>
              {s.replace('_', ' ')}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {filtered.map(p => (
            <div key={p.id} className="p-5 rounded-2xl bg-[#1E1E24]">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-bold text-lg">{p.name}</h3>
                  <p className="text-gray-400">{p.title}</p>
                  <p className="text-sm text-[#C9A227]">{p.specialty}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm capitalize ${statusColors[p.status]}`}>
                  {p.status.replace('_', ' ')}
                </span>
              </div>
              <p className="text-gray-400 mb-4">{p.email}</p>
              <div className="flex gap-3">
                <button onClick={() => setModal(p)} className="px-4 py-2 bg-[#C9A227] text-black rounded-xl font-semibold">Compose Email</button>
                <button onClick={() => updateStatus(p.id, 'sent')} className="px-4 py-2 bg-white/10 rounded-xl">Mark Sent</button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {modal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-6" onClick={() => setModal(null)}>
          <div className="max-w-2xl w-full max-h-[80vh] overflow-auto p-6 rounded-2xl bg-[#1E1E24]" onClick={e => e.stopPropagation()}>
            <h2 className="text-xl font-bold mb-4">Email to {modal.name}</h2>
            <p className="text-gray-400 mb-2">To: {modal.email}</p>
            <p className="text-gray-400 mb-4">Subject: LOGOS - AI-Powered Classical Research Platform</p>
            <pre className="whitespace-pre-wrap text-sm bg-[#0D0D0F] p-4 rounded-xl mb-4">{getTemplate(modal)}</pre>
            <div className="flex gap-3">
              <a href={`mailto:${modal.email}?subject=LOGOS - AI-Powered Classical Research Platform&body=${encodeURIComponent(getTemplate(modal))}`}
                className="px-6 py-3 bg-[#C9A227] text-black rounded-xl font-semibold">Open in Mail</a>
              <button onClick={() => { updateStatus(modal.id, 'sent'); setModal(null); }} className="px-6 py-3 bg-white/10 rounded-xl">Mark as Sent</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
