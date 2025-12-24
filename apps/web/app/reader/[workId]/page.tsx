'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function WorkReaderPage() {
  const params = useParams();
  const [work, setWork] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showTranslation, setShowTranslation] = useState(true);
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [wordInfo, setWordInfo] = useState<any>(null);

  useEffect(() => { if (params.workId) fetch(`/api/works/${params.workId}/full`).then(r => r.json()).then(d => { setWork(d); setLoading(false); }).catch(() => setLoading(false)); }, [params.workId]);

  const handleWordClick = async (word: string) => {
    const cleanWord = word.replace(/[.,;:!?'"()\[\]]/g, '');
    setSelectedWord(cleanWord);
    try { const res = await fetch(`/api/words/${encodeURIComponent(cleanWord)}`); const data = await res.json(); setWordInfo(data); } catch (e) { setWordInfo(null); }
  };

  const renderText = (text: string) => {
    if (!text) return null;
    return text.split(/\s+/).map((word, i) => (
      <span key={i} onClick={() => handleWordClick(word)} style={{ cursor: 'pointer', marginRight: 4 }} onMouseEnter={(e) => (e.target as HTMLElement).style.color = '#C9A227'} onMouseLeave={(e) => (e.target as HTMLElement).style.color = '#F5F4F2'}>{word} </span>
    ));
  };

  if (loading) return <div style={{ backgroundColor: '#0D0D0F', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#C9A227' }}>Loading...</div>;
  if (!work) return <div style={{ backgroundColor: '#0D0D0F', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#EF4444' }}>Work not found</div>;

  return (
    <div style={{ backgroundColor: '#0D0D0F', minHeight: '100vh', color: '#F5F4F2' }}>
      <nav style={{ backgroundColor: '#1E1E24', padding: '16px 24px', borderBottom: '1px solid rgba(201,162,39,0.2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href="/" style={{ textDecoration: 'none' }}><span style={{ color: '#C9A227', fontSize: 24, fontWeight: 'bold' }}>🏛️ LOGOS</span></Link>
        <button onClick={() => setShowTranslation(!showTranslation)} style={{ padding: '8px 16px', backgroundColor: showTranslation ? '#C9A227' : '#1E1E24', color: showTranslation ? '#0D0D0F' : '#9CA3AF', border: '1px solid #4B5563', borderRadius: 4, cursor: 'pointer' }}>{showTranslation ? 'Hide' : 'Show'} Translation</button>
      </nav>
      <div style={{ display: 'flex' }}>
        <div style={{ flex: 1, padding: 24 }}>
          <h1 style={{ color: '#C9A227', marginBottom: 8 }}>{work.title}</h1>
          <p style={{ color: '#9CA3AF', marginBottom: 24 }}>{work.author_name}</p>
          <div style={{ display: 'grid', gridTemplateColumns: showTranslation ? '1fr 1fr' : '1fr', gap: 32 }}>
            <div><h3 style={{ color: '#6B7280', marginBottom: 16, fontSize: 14 }}>ORIGINAL</h3><div style={{ fontSize: 20, lineHeight: 1.8 }}>{renderText(work.text)}</div></div>
            {showTranslation && work.translation && (<div><h3 style={{ color: '#6B7280', marginBottom: 16, fontSize: 14 }}>TRANSLATION</h3><div style={{ fontSize: 16, lineHeight: 1.8, color: '#9CA3AF' }}>{work.translation}</div></div>)}
          </div>
        </div>
        {selectedWord && (
          <div style={{ width: 300, backgroundColor: '#1E1E24', padding: 24, borderLeft: '1px solid rgba(201,162,39,0.2)' }}>
            <h3 style={{ color: '#C9A227', marginBottom: 16 }}>{selectedWord}</h3>
            {wordInfo ? (<><p style={{ color: '#9CA3AF', marginBottom: 8 }}>Lemma: {wordInfo.lemma}</p><p style={{ color: '#F5F4F2' }}>{wordInfo.definition_short}</p></>) : (<p style={{ color: '#6B7280' }}>No definition found</p>)}
            <button onClick={() => setSelectedWord(null)} style={{ marginTop: 16, padding: '8px 16px', backgroundColor: '#0D0D0F', color: '#9CA3AF', border: '1px solid #4B5563', borderRadius: 4, cursor: 'pointer' }}>Close</button>
          </div>
        )}
      </div>
    </div>
  );
}
