'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function SemanticAnalysisPage({ params }: { params: { word: string } }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [wordData, setWordData] = useState<any>(null);
  const [semanticData, setSemanticData] = useState<any>(null);
  const [examples, setExamples] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('meanings');

  useEffect(() => {
    fetchWordData();
  }, [params.word]);

  const fetchWordData = async () => {
    try {
      setLoading(true);
      setError('');

      const [wordResponse, semanticResponse, examplesResponse] = await Promise.all([
        fetch(`/api/words/${params.word}`),
        fetch(`/api/semantia/${params.word}`),
        fetch(`/api/examples/${params.word}`)
      ]);

      if (!wordResponse.ok || !semanticResponse.ok || !examplesResponse.ok) {
        throw new Error('Failed to fetch data');
      }

      const [word, semantic, exampleData] = await Promise.all([
        wordResponse.json(),
        semanticResponse.json(),
        examplesResponse.json()
      ]);

      setWordData(word);
      setSemanticData(semantic);
      setExamples(exampleData.examples || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load semantic analysis');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ backgroundColor: '#0D0D0F', minHeight: '100vh', color: '#F5F4F2', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
        <nav style={{ backgroundColor: '#1E1E24', padding: '16px 24px', borderBottom: '1px solid rgba(201,162,39,0.2)' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Link href="/" style={{ textDecoration: 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '32px', height: '32px', backgroundColor: '#C9A227', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#0D0D0F' }}>Λ</div>
                <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#C9A227' }}>LOGOS</span>
              </div>
            </Link>
            <div style={{ display: 'flex', gap: '24px' }}>
              <Link href="/lexicon" style={{ color: '#F5F4F2', textDecoration: 'none', fontSize: '16px' }}>Lexicon</Link>
              <Link href="/corpus" style={{ color: '#F5F4F2', textDecoration: 'none', fontSize: '16px' }}>Corpus</Link>
              <Link href="/analysis" style={{ color: '#F5F4F2', textDecoration: 'none', fontSize: '16px' }}>Analysis</Link>
            </div>
          </div>
        </nav>

        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '48px 24px', textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>⏳</div>
          <h2 style={{ fontSize: '24px', marginBottom: '8px' }}>Loading Semantic Analysis</h2>
          <p style={{ color: '#9CA3AF' }}>Analyzing semantic patterns for "{decodeURIComponent(params.word)}"...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ backgroundColor: '#0D0D0F', minHeight: '100vh', color: '#F5F4F2', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
        <nav style={{ backgroundColor: '#1E1E24', padding: '16px 24px', borderBottom: '1px solid rgba(201,162,39,0.2)' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Link href="/" style={{ textDecoration: 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '32px', height: '32px', backgroundColor: '#C9A227', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#0D0D0F' }}>Λ</div>
                <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#C9A227' }}>LOGOS</span>
              </div>
            </Link>
            <div style={{ display: 'flex', gap: '24px' }}>
              <Link href="/lexicon" style={{ color: '#F5F4F2', textDecoration: 'none', fontSize: '16px' }}>Lexicon</Link>
              <Link href="/corpus" style={{ color: '#F5F4F2', textDecoration: 'none', fontSize: '16px' }}>Corpus</Link>
              <Link href="/analysis" style={{ color: '#F5F4F2', textDecoration: 'none', fontSize: '16px' }}>Analysis</Link>
            </div>
          </div>
        </nav>

        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '48px 24px', textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>❌</div>
          <h2 style={{ fontSize: '24px', marginBottom: '8px', color: '#DC2626' }}>Error Loading Analysis</h2>
          <p style={{ color: '#9CA3AF', marginBottom: '24px' }}>{error}</p>
          <button 
            onClick={fetchWordData}
            style={{ backgroundColor: '#C9A227', color: '#0D0D0F', padding: '12px 24px', borderRadius: '8px', border: 'none', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#0D0D0F', minHeight: '100vh', color: '#F5F4F2', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <nav style={{ backgroundColor: '#1E1E24', padding: '16px 24px', borderBottom: '1px solid rgba(201,162,39,0.2)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '32px', height: '32px', backgroundColor: '#C9A227', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#0D0D0F' }}>Λ</div>
              <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#C9A227' }}>LOGOS</span>
            </div>
          </Link>
          <div style={{ display: 'flex', gap: '24px' }}>
            <Link href="/lexicon" style={{ color: '#F5F4F2', textDecoration: 'none', fontSize: '16px' }}>Lexicon</Link>
            <Link href="/corpus" style={{ color: '#F5F4F2', textDecoration: 'none', fontSize: '16px' }}>Corpus</Link>
            <Link href="/analysis" style={{ color: '#F5F4F2', textDecoration: 'none', fontSize: '16px' }}>Analysis</Link>
          </div>
        </div>
      </nav>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>
        <div style={{ marginBottom: '32px' }}>
          <nav style={{ marginBottom: '16px' }}>
            <Link href="/semantia" style={{ color: '#9CA3AF', textDecoration: 'none', fontSize: '14px' }}>
              ← Back to Semantic Analysis
            </Link>
          </nav>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
            <h1 style={{ fontSize: '48px', margin: '0', color: '#C9A227' }}>
              {wordData?.word || decodeURIComponent(params.word)}
            </h1>
            <div style={{ backgroundColor: '#1E1E24', padding: '8px 16px', borderRadius: '20px', fontSize: '14px', color: '#9CA3AF' }}>
              {wordData?.language === 'greek' ? '🏛️ Ancient Greek' : '🏺 Latin'}
            </div>
          </div>

          {wordData?.pronunciation && (
            <div style={{ fontSize: '18px', color: '#9CA3AF', marginBottom: '8px' }}>
              /{wordData.pronunciation}/
            </div>
          )}

          {wordData?.etymology && (
            <div style={{ fontSize: '16px', color: '#6B7280' }}>
              Etymology: {wordData.etymology}
            </div>
          )}
        </div>

        <div style={{ display: 'flex', gap: '8px', marginBottom: '32px', borderBottom: '1px solid #4B5563' }}>
          {[
            { key: 'meanings', label: 'Core Meanings', icon: '💭' },
            { key: 'contexts', label: 'Usage Contexts', icon: '📚' },
            { key: 'examples', label: 'Text Examples', icon: '📜' },
            { key: 'semantic', label: 'Semantic Map', icon: '🗺️' }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                backgroundColor: activeTab === tab.key ? '#C9A227' : 'transparent',
                color: activeTab === tab.key ? '#0D0D0F' : '#F5F4F2',
                border: 'none',
                padding: '12px 20px',
                borderRadius: '8px 8px 0 0',
                fontSize: '16px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'meanings' && (
          <div style={{ display: 'grid', gap: '24px' }}>
            <div style={{ backgroundColor: '#1E1E24', borderRadius: '12px', padding: '24px' }}>
              <h3 style={{ fontSize: '20px', marginBottom: '16px', color: '#C9A227', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>🎯</span> Primary Meanings
              </h3>
              <div style={{ display: 'grid', gap: '12px' }}>
                {(semanticData?.meanings || [
                  { sense: 'Primary meaning', definition: 'Core semantic concept', frequency: 85 },
                  { sense: 'Extended meaning', definition: 'Metaphorical extension', frequency: 45 },
                  { sense: 'Specialized usage', definition: 'Technical or literary context', frequency: 25 }
                ]).map((meaning: any, index: number) => (
                  <div key={index} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '16px', backgroundColor: '#141419', borderRadius: '8px' }}>
                    <div style={{ backgroundColor: '#C9A227', color: '#0D0D0F', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold', minWidth: 'fit-content' }}>
                      {meaning.frequency}%
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>{meaning.sense}</div>
                      <div style={{ color: '#9CA3AF', fontSize: '14px' }}>{meaning.definition}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ backgroundColor: '#1E1E24', borderRadius: '12px', padding: '24px' }}>
              <h3 style={{ fontSize: '20px', marginBottom: '16px', color: '#C9A227', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>🔗</span> Semantic Relations
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
                {[
                  { type: 'Synonyms', words: ['φιλία', 'στοργή', 'ἔρως'], color: '#059669' },
                  { type: 'Antonyms', words: ['μῖσος', 'ἔχθρα'], color: '#DC2626' },
                  { type: 'Related', words: ['φίλος', 'φιλεῖν', 'φίλτρον'], color: '#3B82F6' }
                ].map((relation, index) => (
                  <div key={index} style={{ padding: '16px', backgroundColor: '#141419', borderRadius: '8px', borderLeft: `4px solid ${relation.color}` }}>
                    <div style={{ fontWeight: 'bold', marginBottom: '8px', color: relation.color }}>{relation.type}</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {relation.words.map((word, wordIndex) => (
                        <Link key={wordIndex} href={`/semantia/${encodeURIComponent(word)}`} style={{ textDecoration: 'none' }}>
                          <span style={{ backgroundColor: '#0D0D0F', color: '#F5F4F2', padding: '4px 12px', borderRadius: '16px', fontSize: '14px', cursor: 'pointer', transition: 'all 0.2s' }}>
                            {word}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'contexts' && (
          <div style={{ display: 'grid', gap: '24px' }}>
            <div style={{ backgroundColor: '#1E1E24', borderRadius: '12px', padding: '24px' }}>
              <h3 style={{ fontSize: '20px', marginBottom: '16px', color: '#C9A227', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>🎭</span> Literary Contexts
              </h3>
              <div style={{ display: 'grid', gap: '16px' }}>
                {[
                  { context: 'Epic Poetry', usage: 'Heroic relationships and divine love', authors: ['Homer', 'Hesiod'], frequency: 65 },
                  { context: 'Philosophy', usage: 'Intellectual and spiritual connection', authors: ['Plato', 'Aristotle'], frequency: 45 },
                  { context: 'Drama', usage: 'Emotional bonds and conflicts', authors: ['Sophocles', 'Euripides'], frequency: 55 }
                ].map((context, index) => (
                  <div key={index} style={{ backgroundColor: '#141419', borderRadius: '8px', padding: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                      <h4 style={{ fontSize: '18px', margin: '0', color: '#F5F4F2' }}>{context.context}</h4>
                      <div style={{ backgroundColor: '#C9A227', color: '#0D0D0F', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>
                        {context.frequency}%
                      </div>
                    </div>
                    <p style={{ color: '#9CA3AF', marginBottom: '12px', fontSize: '14px' }}>{context.usage}</p>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <span style={{ fontSize: '12px', color: '#6B7280' }}>Key authors:</span>
                      {context.authors.map((author, authorIndex) => (
                        <span key={authorIndex} style={{ fontSize: '12px', color: '#C9A227' }}>{author}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ backgroundColor: '#1E1E24', borderRadius: '12px', padding: '24px' }}>
              <h3 style={{ fontSize: '20px', marginBottom: '16px', color: '#C9A227', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>⏳</span> Historical Evolution
              </h3>
              <div style={{ display: 'grid', gap: '12px' }}>
                {[
                  { period: 'Archaic', usage: 'Basic affection and kinship bonds', color: '#D97706' },
                  { period: 'Classical', usage: 'Philosophical concept of ideal love', color: '#F59E0B' },
                  { period: 'Hellenistic', usage: 'Emotional and romantic expressions', color: '#3B82F6' },
                  { period: 'Roman', usage: 'Influence on Latin literary traditions', color: '#DC2626' }
                ].map((period, index) => (
                  <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', backgroundColor: '#141419', borderRadius: '8px' }}>
                    <div style={{ width: '80px', padding: '8px', backgroundColor: period.color, color: '#F5F4F2', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold', textAlign: 'center' }}>
                      {period.period}
                    </div>
                    <div style={{ flex: 1, fontSize: '14px', color: '#9CA3AF' }}>{period.usage}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'examples' && (
          <div style={{ display: 'grid', gap: '24px' }}>
            {examples.length > 0 ? examples.map((example, index) => (
              <div key={index} style={{ backgroundColor: '#1E1E24', borderRadius: '12px', padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div>
                    <h4 style={{ fontSize: '18px', margin: '0', marginBottom: '4px' }}>{example.author}</h4>
                    <p style={{ color: '#9CA3AF', fontSize: '14px', margin: '0' }}>{example.work} • {example.passage}</p>
                  </div>
                  <div style={{ backgroundColor: example.language === 'greek' ? '#3B82F6' : '#DC2626', color: '#F5F4F2', padding: '4px 8px', borderRadius: '4px', fontSize: '12px' }}>
                    {example.language === 'greek' ? 'Greek' : 'Latin'}
                  </div>
                </div>
                
                <div style={{ backgroundColor: '#141419', borderRadius: '8px', padding: '16px', marginBottom: '12px' }}>
                  <div style={{ fontSize: '16px', lineHeight: '1.6', marginBottom: '8px', fontFamily: 'Georgia, serif' }}>
                    {example.originalText}
                  </div>
                  {example.transliteration && (
                    <div style={{ fontSize: '14px', color: '#9CA3AF', marginBottom: '8px', fontStyle: 'italic' }}>
                      {example.transliteration}
                    </div>
                  )}
                  <div style={{ fontSize: '14px', color: '#E8D5A3' }}>
                    "{example.translation}"
                  </div>
                </div>

                <div style={{ fontSize: '14px', color: '#6B7280' }}>
                  <strong>Context:</strong> {example.context}
                </div>
              </div>
            )) : (
              <div style={{ backgroundColor: '#1E1E24', borderRadius: '12px', padding: '48px', textAlign: 'center' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>📚</div>
                <h3 style={{ fontSize: '20px', marginBottom: '8px' }}>No Examples Available</h3>
                <p style={{ color: '#9CA3AF' }}>Text examples for this word are being compiled. Check back soon!</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'semantic' && (
          <div style={{ display: 'grid', gap: '24px' }}>
            <div style={{ backgroundColor: '#1E1E24', borderRadius: '12px', padding: '24px' }}>
              <h3 style={{ fontSize: '20px', marginBottom: '16px', color: '#C9A227', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>🗺️</span> Semantic Field Map
              </h3>
              <div style={{ backgroundColor: '#141419', borderRadius: '8px', padding: '32px', textAlign: 'center', minHeight: '300px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <div style={{ fontSize: '64px', marginBottom: '16px' }}>🔮</div>
                <h4 style={{ fontSize: '18px', marginBottom: '8px' }}>Semantic Visualization</h4>
                <p style={{ color: '#9CA3AF', fontSize: '14px', maxWidth: '400px' }}>
                  Interactive semantic field mapping showing conceptual relationships, frequency patterns, and contextual clustering will be displayed here.
                </p>
              </div>
            </div>

            <div style={{ backgroundColor: '#1E1E24', borderRadius: '12px', padding: '24px' }}>
              <h3 style={{ fontSize: '20px', marginBottom: '16px', color: '#C9A227', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>📊</span> Usage Statistics
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                {[
                  { metric: 'Corpus Frequency', value: '1,247', change: '+12%', color: '#059669' },
                  { metric: 'Unique Contexts', value: '89', change: '+5%', color: '#3B82F6' },
                  { metric: 'Author Usage', value: '34', change: '-3%', color: '#DC2626' },
                  { metric: 'Semantic Density', value: '7.2', change: '+8%', color: '#C9A227' }
                ].map((stat, index) => (
                  <div key={index} style={{ backgroundColor: '#141419', borderRadius: '8px', padding: '20px', textAlign: 'center' }}>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '8px' }}>{stat.value}</div>
                    <div style={{ fontSize: '14px', color: '#9CA3AF', marginBottom: '4px' }}>{stat.metric}</div>
                    <div style={{ fontSize: '12px', color: stat.color, fontWeight: 'bold' }}>{stat.change}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}