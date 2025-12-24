'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function LexiconWordPage({ params }: { params: { word: string } }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [wordData, setWordData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('definitions');

  useEffect(() => {
    const fetchWordData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/lexicon/${params.word}`);
        if (!response.ok) {
          throw new Error('Word not found');
        }
        const data = await response.json();
        setWordData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load word data');
      } finally {
        setLoading(false);
      }
    };

    fetchWordData();
  }, [params.word]);

  if (loading) {
    return (
      <div style={{ backgroundColor: '#0D0D0F', minHeight: '100vh', color: '#F5F4F2' }}>
        <nav style={{ backgroundColor: '#1E1E24', padding: '16px 24px', borderBottom: '1px solid rgba(201,162,39,0.2)' }}>
          <Link href="/" style={{ color: '#C9A227', fontSize: '24px', fontWeight: 'bold', textDecoration: 'none' }}>
            LOGOS
          </Link>
        </nav>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
          <div style={{ fontSize: '18px', color: '#9CA3AF' }}>Loading word data...</div>
        </div>
      </div>
    );
  }

  if (error || !wordData) {
    return (
      <div style={{ backgroundColor: '#0D0D0F', minHeight: '100vh', color: '#F5F4F2' }}>
        <nav style={{ backgroundColor: '#1E1E24', padding: '16px 24px', borderBottom: '1px solid rgba(201,162,39,0.2)' }}>
          <Link href="/" style={{ color: '#C9A227', fontSize: '24px', fontWeight: 'bold', textDecoration: 'none' }}>
            LOGOS
          </Link>
        </nav>
        <div style={{ padding: '40px 24px', textAlign: 'center' }}>
          <h1 style={{ fontSize: '32px', color: '#DC2626', marginBottom: '16px' }}>Word Not Found</h1>
          <p style={{ fontSize: '18px', color: '#9CA3AF', marginBottom: '24px' }}>{error || 'This word could not be found in the lexicon.'}</p>
          <Link href="/lexicon" style={{ backgroundColor: '#C9A227', color: '#0D0D0F', padding: '12px 24px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold' }}>
            Back to Lexicon
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#0D0D0F', minHeight: '100vh', color: '#F5F4F2' }}>
      <nav style={{ backgroundColor: '#1E1E24', padding: '16px 24px', borderBottom: '1px solid rgba(201,162,39,0.2)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1200px', margin: '0 auto' }}>
          <Link href="/" style={{ color: '#C9A227', fontSize: '24px', fontWeight: 'bold', textDecoration: 'none' }}>
            LOGOS
          </Link>
          <div style={{ display: 'flex', gap: '24px' }}>
            <Link href="/lexicon" style={{ color: '#F5F4F2', textDecoration: 'none', fontSize: '16px' }}>Lexicon</Link>
            <Link href="/texts" style={{ color: '#F5F4F2', textDecoration: 'none', fontSize: '16px' }}>Texts</Link>
            <Link href="/grammar" style={{ color: '#F5F4F2', textDecoration: 'none', fontSize: '16px' }}>Grammar</Link>
          </div>
        </div>
      </nav>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px' }}>
        <div style={{ marginBottom: '24px' }}>
          <nav style={{ fontSize: '14px', color: '#6B7280', marginBottom: '16px' }}>
            <Link href="/" style={{ color: '#6B7280', textDecoration: 'none' }}>Home</Link>
            <span style={{ margin: '0 8px' }}>/</span>
            <Link href="/lexicon" style={{ color: '#6B7280', textDecoration: 'none' }}>Lexicon</Link>
            <span style={{ margin: '0 8px' }}>/</span>
            <span style={{ color: '#C9A227' }}>{wordData.lemma}</span>
          </nav>
        </div>

        <div style={{ backgroundColor: '#1E1E24', borderRadius: '12px', padding: '32px', marginBottom: '32px' }}>
          <div style={{ borderBottom: '1px solid rgba(201,162,39,0.2)', paddingBottom: '24px', marginBottom: '24px' }}>
            <h1 style={{ fontSize: '48px', fontWeight: 'bold', color: '#C9A227', marginBottom: '8px', fontFamily: 'serif' }}>
              {wordData.lemma}
            </h1>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '16px' }}>
              <span style={{ backgroundColor: wordData.language === 'Greek' ? '#3B82F6' : '#DC2626', color: '#F5F4F2', padding: '4px 12px', borderRadius: '20px', fontSize: '14px', fontWeight: 'bold' }}>
                {wordData.language}
              </span>
              <span style={{ color: '#9CA3AF', fontSize: '18px' }}>{wordData.partOfSpeech}</span>
              {wordData.gender && <span style={{ color: '#E8D5A3', fontSize: '16px' }}>({wordData.gender})</span>}
            </div>
            <div style={{ fontSize: '16px', color: '#9CA3AF', fontFamily: 'monospace' }}>
              {wordData.transliteration}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '24px', marginBottom: '24px' }}>
            <button
              onClick={() => setActiveTab('definitions')}
              style={{
                backgroundColor: activeTab === 'definitions' ? '#C9A227' : 'transparent',
                color: activeTab === 'definitions' ? '#0D0D0F' : '#9CA3AF',
                border: '1px solid #4B5563',
                padding: '8px 16px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 'bold',
                transition: 'all 0.2s'
              }}
            >
              Definitions
            </button>
            <button
              onClick={() => setActiveTab('forms')}
              style={{
                backgroundColor: activeTab === 'forms' ? '#C9A227' : 'transparent',
                color: activeTab === 'forms' ? '#0D0D0F' : '#9CA3AF',
                border: '1px solid #4B5563',
                padding: '8px 16px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 'bold',
                transition: 'all 0.2s'
              }}
            >
              Forms
            </button>
            <button
              onClick={() => setActiveTab('etymology')}
              style={{
                backgroundColor: activeTab === 'etymology' ? '#C9A227' : 'transparent',
                color: activeTab === 'etymology' ? '#0D0D0F' : '#9CA3AF',
                border: '1px solid #4B5563',
                padding: '8px 16px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 'bold',
                transition: 'all 0.2s'
              }}
            >
              Etymology
            </button>
            <button
              onClick={() => setActiveTab('usage')}
              style={{
                backgroundColor: activeTab === 'usage' ? '#C9A227' : 'transparent',
                color: activeTab === 'usage' ? '#0D0D0F' : '#9CA3AF',
                border: '1px solid #4B5563',
                padding: '8px 16px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 'bold',
                transition: 'all 0.2s'
              }}
            >
              Usage
            </button>
          </div>

          {activeTab === 'definitions' && (
            <div>
              {wordData.senses?.map((sense: any, index: number) => (
                <div key={index} style={{ backgroundColor: '#141419', borderRadius: '8px', padding: '20px', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                    <div style={{ backgroundColor: '#C9A227', color: '#0D0D0F', fontWeight: 'bold', fontSize: '14px', padding: '4px 8px', borderRadius: '4px', minWidth: '24px', textAlign: 'center' }}>
                      {index + 1}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '18px', color: '#F5F4F2', marginBottom: '8px', fontWeight: '500' }}>
                        {sense.definition}
                      </div>
                      {sense.register && (
                        <div style={{ fontSize: '14px', color: '#E8D5A3', marginBottom: '8px', fontStyle: 'italic' }}>
                          ({sense.register})
                        </div>
                      )}
                      {sense.examples?.map((example: any, exIndex: number) => (
                        <div key={exIndex} style={{ backgroundColor: '#0D0D0F', borderRadius: '6px', padding: '12px', marginTop: '12px', borderLeft: '3px solid #C9A227' }}>
                          <div style={{ fontSize: '16px', color: '#E8D5A3', marginBottom: '4px', fontFamily: 'serif' }}>
                            {example.text}
                          </div>
                          <div style={{ fontSize: '14px', color: '#9CA3AF', marginBottom: '4px' }}>
                            {example.translation}
                          </div>
                          <div style={{ fontSize: '12px', color: '#6B7280' }}>
                            — {example.author}, <em>{example.work}</em>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'forms' && (
            <div>
              {wordData.paradigm && (
                <div style={{ backgroundColor: '#141419', borderRadius: '8px', padding: '20px' }}>
                  <h3 style={{ fontSize: '20px', color: '#C9A227', marginBottom: '16px', fontWeight: 'bold' }}>
                    Inflected Forms
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                    {Object.entries(wordData.paradigm).map(([form, value]: [string, any]) => (
                      <div key={form} style={{ backgroundColor: '#0D0D0F', borderRadius: '6px', padding: '12px' }}>
                        <div style={{ fontSize: '14px', color: '#9CA3AF', marginBottom: '4px' }}>
                          {form.replace(/([A-Z])/g, ' $1').toLowerCase()}
                        </div>
                        <div style={{ fontSize: '16px', color: '#F5F4F2', fontFamily: 'serif' }}>
                          {value}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'etymology' && (
            <div style={{ backgroundColor: '#141419', borderRadius: '8px', padding: '20px' }}>
              <h3 style={{ fontSize: '20px', color: '#C9A227', marginBottom: '16px', fontWeight: 'bold' }}>
                Etymology
              </h3>
              {wordData.etymology ? (
                <div>
                  <div style={{ fontSize: '16px', color: '#F5F4F2', lineHeight: 1.6, marginBottom: '16px' }}>
                    {wordData.etymology.description}
                  </div>
                  {wordData.etymology.cognates && (
                    <div>
                      <h4 style={{ fontSize: '16px', color: '#E8D5A3', marginBottom: '12px', fontWeight: 'bold' }}>
                        Related Words:
                      </h4>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {wordData.etymology.cognates.map((cognate: string, index: number) => (
                          <span key={index} style={{ backgroundColor: '#0D0D0F', color: '#9CA3AF', padding: '4px 8px', borderRadius: '4px', fontSize: '14px' }}>
                            {cognate}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div style={{ fontSize: '16px', color: '#6B7280', fontStyle: 'italic' }}>
                  Etymology information not available.
                </div>
              )}
            </div>
          )}

          {activeTab === 'usage' && (
            <div style={{ backgroundColor: '#141419', borderRadius: '8px', padding: '20px' }}>
              <h3 style={{ fontSize: '20px', color: '#C9A227', marginBottom: '16px', fontWeight: 'bold' }}>
                Usage Statistics
              </h3>
              {wordData.frequency ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                  <div style={{ backgroundColor: '#0D0D0F', borderRadius: '6px', padding: '16px' }}>
                    <div style={{ fontSize: '14px', color: '#9CA3AF', marginBottom: '4px' }}>Frequency Rank</div>
                    <div style={{ fontSize: '24px', color: '#C9A227', fontWeight: 'bold' }}>
                      #{wordData.frequency.rank}
                    </div>
                  </div>
                  <div style={{ backgroundColor: '#0D0D0F', borderRadius: '6px', padding: '16px' }}>
                    <div style={{ fontSize: '14px', color: '#9CA3AF', marginBottom: '4px' }}>Occurrences</div>
                    <div style={{ fontSize: '24px', color: '#3B82F6', fontWeight: 'bold' }}>
                      {wordData.frequency.count}
                    </div>
                  </div>
                  <div style={{ backgroundColor: '#0D0D0F', borderRadius: '6px', padding: '16px' }}>
                    <div style={{ fontSize: '14px', color: '#9CA3AF', marginBottom: '4px' }}>Most Common In</div>
                    <div style={{ fontSize: '16px', color: '#F5F4F2' }}>
                      {wordData.frequency.commonIn}
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{ fontSize: '16px', color: '#6B7280', fontStyle: 'italic' }}>
                  Usage statistics not available.
                </div>
              )}
            </div>
          )}
        </div>

        <div style={{ backgroundColor: '#1E1E24', borderRadius: '12px', padding: '24px' }}>
          <h3 style={{ fontSize: '20px', color: '#C9A227', marginBottom: '16px', fontWeight: 'bold' }}>
            Related Words
          </h3>
          {wordData.relatedWords?.length > 0 ? (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
              {wordData.relatedWords.map((related: any, index: number) => (
                <Link
                  key={index}
                  href={`/lexicon/${related.lemma}`}
                  style={{
                    backgroundColor: '#141419',
                    color: '#F5F4F2',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    transition: 'all 0.2s',
                    border: '1px solid rgba(201,162,39,0.3)'
                  }}
                >
                  <div style={{ fontSize: '16px', fontFamily: 'serif', marginBottom: '2px' }}>
                    {related.lemma}
                  </div>
                  <div style={{ fontSize: '12px', color: '#9CA3AF' }}>
                    {related.relation}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div style={{ fontSize: '16px', color: '#6B7280', fontStyle: 'italic' }}>
              No related words found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}