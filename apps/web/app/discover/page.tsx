
'use client';

import { useState } from 'react';
import Link from 'next/link';

const DISCOVERIES = [
  { id: 1, title: "Homer's Wine-Dark Sea in Christian Hymns", type: "Pattern", confidence: 87, novelty: 92, description: "οἶνοψ πόντος (wine-dark sea) appears 17 times in Homer, but LOGOS found 3 instances in 4th century Christian hymns describing baptismal waters.", evidence: ["Homer Od. 5.349", "Ephrem Hymn 3.4"] },
  { id: 2, title: "Stoic Vocabulary in Paul's Letters", type: "Influence", confidence: 94, novelty: 76, description: "LOGOS detected 23 technical Stoic terms in Pauline epistles with statistically significant clustering in Romans 7-8.", evidence: ["Rom 7:23", "Epictetus 1.1"] },
  { id: 3, title: "Virgil's Unacknowledged Debt to Ennius", type: "Intertextuality", confidence: 82, novelty: 88, description: "Beyond known Ennian echoes, LOGOS found 47 previously unidentified structural parallels between Aeneid and Annales fragments.", evidence: ["Aen. 6.847", "Ennius fr. 500"] },
  { id: 4, title: "θεραπεία Semantic Reversal", type: "Semantic", confidence: 91, novelty: 85, description: "The term θεραπεία shifts from 'service to gods' (Herodotus) to 'medical treatment' (Hippocrates) to 'spiritual healing' (NT).", evidence: ["Hdt. 2.37", "Matt 4:23"] },
];

const TYPE_COLORS: Record<string, string> = { Pattern: "#3B82F6", Influence: "#10B981", Intertextuality: "#F59E0B", Semantic: "#EC4899" };

export default function DiscoverPage() {
  const [filter, setFilter] = useState('all');
  const filtered = filter === 'all' ? DISCOVERIES : DISCOVERIES.filter(d => d.type === filter);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0D0D0F', color: '#F5F4F2' }}>
      <nav style={{ borderBottom: '1px solid #2D2D35', padding: '16px 0' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link href="/" style={{ fontSize: '24px', fontWeight: 'bold', color: '#C9A227', textDecoration: 'none' }}>LOGOS</Link>
          <div style={{ display: 'flex', gap: '24px' }}>
            <Link href="/search" style={{ color: '#9CA3AF', textDecoration: 'none' }}>Search</Link>
            <Link href="/discover" style={{ color: '#C9A227', textDecoration: 'none' }}>Discover</Link>
            <Link href="/connectome" style={{ color: '#9CA3AF', textDecoration: 'none' }}>Connectome</Link>
          </div>
        </div>
      </nav>

      <main style={{ maxWidth: '1000px', margin: '0 auto', padding: '32px 24px' }}>
        <h1 style={{ fontSize: '36px', fontWeight: 'bold', color: '#C9A227', marginBottom: '8px' }}>AI Discovery Engine</h1>
        <p style={{ color: '#9CA3AF', marginBottom: '24px' }}>Patterns across 1.7M passages that no human could see</p>

        <div style={{ display: 'flex', gap: '12px', marginBottom: '32px', flexWrap: 'wrap' }}>
          {['all', ...Object.keys(TYPE_COLORS)].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{ padding: '10px 20px', backgroundColor: filter === f ? '#C9A227' : '#1E1E24', color: filter === f ? '#0D0D0F' : '#F5F4F2', border: '1px solid #2D2D35', borderRadius: '8px', cursor: 'pointer', fontWeight: filter === f ? 'bold' : 'normal', textTransform: 'capitalize' }}>{f}</button>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {filtered.map(d => (
            <div key={d.id} style={{ padding: '24px', backgroundColor: '#1E1E24', borderRadius: '16px', border: '1px solid #2D2D35' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                <span style={{ padding: '6px 16px', borderRadius: '20px', fontSize: '14px', fontWeight: '600', backgroundColor: `${TYPE_COLORS[d.type]}20`, color: TYPE_COLORS[d.type] }}>{d.type}</span>
                <div style={{ marginLeft: 'auto', display: 'flex', gap: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ color: '#6B7280', fontSize: '14px' }}>Confidence</span>
                    <div style={{ width: '80px', height: '6px', backgroundColor: '#0D0D0F', borderRadius: '3px' }}><div style={{ width: `${d.confidence}%`, height: '100%', backgroundColor: '#10B981', borderRadius: '3px' }}></div></div>
                    <span style={{ color: '#10B981', fontSize: '14px' }}>{d.confidence}%</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ color: '#6B7280', fontSize: '14px' }}>Novelty</span>
                    <div style={{ width: '80px', height: '6px', backgroundColor: '#0D0D0F', borderRadius: '3px' }}><div style={{ width: `${d.novelty}%`, height: '100%', backgroundColor: '#C9A227', borderRadius: '3px' }}></div></div>
                    <span style={{ color: '#C9A227', fontSize: '14px' }}>{d.novelty}%</span>
                  </div>
                </div>
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '12px' }}>{d.title}</h3>
              <p style={{ color: '#9CA3AF', marginBottom: '16px', lineHeight: '1.6' }}>{d.description}</p>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {d.evidence.map((e, i) => (
                  <span key={i} style={{ padding: '4px 12px', backgroundColor: '#0D0D0F', borderRadius: '4px', fontSize: '13px', color: '#6B7280' }}>{e}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
