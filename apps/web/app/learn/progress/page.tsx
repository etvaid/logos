'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function ProgressPage() {
  const [progress, setProgress] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetch('/api/learn/progress?user_id=anonymous').then(r => r.json()).then(d => { setProgress(d); setLoading(false); }).catch(() => setLoading(false)); }, []);

  if (loading) return <div style={{ backgroundColor: '#0D0D0F', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#C9A227' }}>Loading...</div>;

  const xp = progress?.xp || 0;
  const level = Math.floor(xp / 100) + 1;

  return (
    <div style={{ backgroundColor: '#0D0D0F', minHeight: '100vh', color: '#F5F4F2' }}>
      <nav style={{ backgroundColor: '#1E1E24', padding: '16px 24px', borderBottom: '1px solid rgba(201,162,39,0.2)' }}>
        <Link href="/" style={{ textDecoration: 'none' }}><span style={{ color: '#C9A227', fontSize: 24, fontWeight: 'bold' }}>🏛️ LOGOS</span></Link>
      </nav>
      <div style={{ maxWidth: 800, margin: '0 auto', padding: 24 }}>
        <h1 style={{ color: '#C9A227', marginBottom: 24 }}>📊 Your Progress</h1>
        <div style={{ backgroundColor: '#1E1E24', borderRadius: 12, padding: 24, marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
            <div><div style={{ fontSize: 14, color: '#6B7280' }}>Level {level}</div><div style={{ fontSize: 24, fontWeight: 'bold', color: '#C9A227' }}>Scholar</div></div>
            <div style={{ textAlign: 'right' }}><div style={{ fontSize: 14, color: '#6B7280' }}>Total XP</div><div style={{ fontSize: 24, fontWeight: 'bold' }}>{xp}</div></div>
          </div>
          <div style={{ backgroundColor: '#0D0D0F', borderRadius: 8, height: 12, overflow: 'hidden' }}>
            <div style={{ width: `${xp % 100}%`, height: '100%', background: 'linear-gradient(90deg, #C9A227, #E8D5A3)' }} />
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          <div style={{ backgroundColor: '#1E1E24', borderRadius: 8, padding: 16, textAlign: 'center' }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>📚</div>
            <div style={{ fontSize: 24, fontWeight: 'bold' }}>{progress?.wordsLearned || 0}</div>
            <div style={{ color: '#6B7280', fontSize: 12 }}>Words Learned</div>
          </div>
          <div style={{ backgroundColor: '#1E1E24', borderRadius: 8, padding: 16, textAlign: 'center' }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>🔥</div>
            <div style={{ fontSize: 24, fontWeight: 'bold' }}>{progress?.streak || 0}</div>
            <div style={{ color: '#6B7280', fontSize: 12 }}>Day Streak</div>
          </div>
          <div style={{ backgroundColor: '#1E1E24', borderRadius: 8, padding: 16, textAlign: 'center' }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>🎯</div>
            <div style={{ fontSize: 24, fontWeight: 'bold' }}>85%</div>
            <div style={{ color: '#6B7280', fontSize: 12 }}>Accuracy</div>
          </div>
        </div>
      </div>
    </div>
  );
}
