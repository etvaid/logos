'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function VocabularyPage() {
  const [words, setWords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });

  useEffect(() => { fetch('/api/learn/vocabulary?language=greek').then(r => r.json()).then(d => { setWords(d.words || []); setLoading(false); }).catch(() => setLoading(false)); }, []);

  const handleAnswer = (correct: boolean) => { setScore(s => ({ correct: s.correct + (correct ? 1 : 0), total: s.total + 1 })); setShowAnswer(false); setCurrent(c => (c + 1) % words.length); };

  if (loading) return <div style={{ backgroundColor: '#0D0D0F', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#C9A227' }}>Loading...</div>;

  const word = words[current];

  return (
    <div style={{ backgroundColor: '#0D0D0F', minHeight: '100vh', color: '#F5F4F2' }}>
      <nav style={{ backgroundColor: '#1E1E24', padding: '16px 24px', borderBottom: '1px solid rgba(201,162,39,0.2)' }}>
        <Link href="/" style={{ textDecoration: 'none' }}><span style={{ color: '#C9A227', fontSize: 24, fontWeight: 'bold' }}>🏛️ LOGOS</span></Link>
      </nav>
      <div style={{ maxWidth: 600, margin: '0 auto', padding: 24 }}>
        <h1 style={{ color: '#C9A227', marginBottom: 24 }}>📝 Vocabulary</h1>
        <div style={{ backgroundColor: '#1E1E24', borderRadius: 8, padding: 16, marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
          <span>Score: {score.correct}/{score.total}</span>
          <span>Card {current + 1}/{words.length}</span>
        </div>
        {word ? (
          <div style={{ backgroundColor: '#1E1E24', borderRadius: 12, padding: 48, textAlign: 'center', minHeight: 300, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ fontSize: 48, marginBottom: 24, color: '#3B82F6' }}>{word.lemma}</div>
            {showAnswer ? (
              <>
                <div style={{ fontSize: 24, marginBottom: 24 }}>{word.definition_short}</div>
                <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
                  <button onClick={() => handleAnswer(false)} style={{ padding: '12px 32px', backgroundColor: '#EF4444', color: '#FFF', border: 'none', borderRadius: 8, cursor: 'pointer' }}>❌ Didn't Know</button>
                  <button onClick={() => handleAnswer(true)} style={{ padding: '12px 32px', backgroundColor: '#10B981', color: '#FFF', border: 'none', borderRadius: 8, cursor: 'pointer' }}>✅ Knew It</button>
                </div>
              </>
            ) : (
              <button onClick={() => setShowAnswer(true)} style={{ padding: '16px 48px', backgroundColor: '#C9A227', color: '#0D0D0F', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 18, fontWeight: 'bold' }}>Show Answer</button>
            )}
          </div>
        ) : (
          <div style={{ backgroundColor: '#1E1E24', borderRadius: 12, padding: 48, textAlign: 'center', color: '#6B7280' }}>No words available</div>
        )}
      </div>
    </div>
  );
}
