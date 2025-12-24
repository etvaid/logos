'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function TranslationCompare() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWork, setSelectedWork] = useState('');
  const [selectedPassage, setSelectedPassage] = useState('');
  const [translations, setTranslations] = useState([]);
  const [works, setWorks] = useState([]);
  const [passages, setPassages] = useState([]);
  const [comparing, setComparing] = useState(false);

  useEffect(() => {
    fetchWorks();
  }, []);

  useEffect(() => {
    if (selectedWork) {
      fetchPassages(selectedWork);
    }
  }, [selectedWork]);

  const fetchWorks = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/works');
      if (!response.ok) throw new Error('Failed to fetch works');
      const data = await response.json();
      setWorks(data);
    } catch (err) {
      setError(err.message || 'Failed to load works');
    } finally {
      setLoading(false);
    }
  };

  const fetchPassages = async (workId) => {
    try {
      const response = await fetch(`/api/works/${workId}/passages`);
      if (!response.ok) throw new Error('Failed to fetch passages');
      const data = await response.json();
      setPassages(data);
    } catch (err) {
      setError(err.message || 'Failed to load passages');
    }
  };

  const compareTranslations = async () => {
    if (!selectedWork || !selectedPassage) return;
    
    try {
      setComparing(true);
      setError('');
      const response = await fetch('/api/translations/compare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workId: selectedWork,
          passageId: selectedPassage,
          translators: ['fagles', 'lattimore', 'ai']
        })
      });
      
      if (!response.ok) throw new Error('Failed to compare translations');
      const data = await response.json();
      setTranslations(data);
    } catch (err) {
      setError(err.message || 'Failed to compare translations');
    } finally {
      setComparing(false);
    }
  };

  const translatorColors = {
    fagles: '#3B82F6',
    lattimore: '#DC2626',
    ai: '#C9A227'
  };

  const translatorNames = {
    fagles: 'Robert Fagles',
    lattimore: 'Richmond Lattimore',
    ai: 'LOGOS AI'
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#0D0D0F', color: '#F5F4F2' }}>
        <nav style={{ 
          backgroundColor: '#1E1E24', 
          padding: '16px 24px', 
          borderBottom: '1px solid rgba(201,162,39,0.2)' 
        }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center' }}>
            <Link href="/" style={{ 
              fontSize: '24px', 
              fontWeight: 'bold', 
              color: '#C9A227', 
              textDecoration: 'none' 
            }}>
              LOGOS
            </Link>
          </div>
        </nav>
        
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '400px' 
        }}>
          <div style={{ fontSize: '18px', color: '#9CA3AF' }}>Loading works...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0D0D0F', color: '#F5F4F2' }}>
      <nav style={{ 
        backgroundColor: '#1E1E24', 
        padding: '16px 24px', 
        borderBottom: '1px solid rgba(201,162,39,0.2)' 
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/" style={{ 
            fontSize: '24px', 
            fontWeight: 'bold', 
            color: '#C9A227', 
            textDecoration: 'none' 
          }}>
            LOGOS
          </Link>
          
          <div style={{ display: 'flex', gap: '24px' }}>
            <Link href="/translate" style={{ color: '#F5F4F2', textDecoration: 'none' }}>
              Translate
            </Link>
            <Link href="/analyze" style={{ color: '#F5F4F2', textDecoration: 'none' }}>
              Analyze
            </Link>
            <Link href="/research" style={{ color: '#F5F4F2', textDecoration: 'none' }}>
              Research
            </Link>
          </div>
        </div>
      </nav>

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px' }}>
        <div style={{ marginBottom: '40px' }}>
          <h1 style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '16px', color: '#F5F4F2' }}>
            Translation Comparison
          </h1>
          <p style={{ fontSize: '18px', color: '#9CA3AF', lineHeight: '1.6' }}>
            Compare translations side-by-side from renowned scholars and LOGOS AI
          </p>
        </div>

        {error && (
          <div style={{ 
            backgroundColor: 'rgba(220, 38, 38, 0.1)', 
            border: '1px solid #DC2626', 
            borderRadius: '8px', 
            padding: '16px', 
            marginBottom: '24px',
            color: '#FEF2F2'
          }}>
            {error}
          </div>
        )}

        <div style={{ 
          backgroundColor: '#1E1E24', 
          borderRadius: '12px', 
          padding: '32px', 
          marginBottom: '32px' 
        }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '24px' }}>
            Select Passage
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                Work
              </label>
              <select
                value={selectedWork}
                onChange={(e) => setSelectedWork(e.target.value)}
                style={{
                  width: '100%',
                  backgroundColor: '#0D0D0F',
                  border: '1px solid #4B5563',
                  borderRadius: '8px',
                  padding: '12px 16px',
                  color: '#F5F4F2',
                  fontSize: '16px'
                }}
              >
                <option value="">Select a work...</option>
                {works.map((work) => (
                  <option key={work.id} value={work.id}>
                    {work.title} - {work.author}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                Passage
              </label>
              <select
                value={selectedPassage}
                onChange={(e) => setSelectedPassage(e.target.value)}
                disabled={!selectedWork}
                style={{
                  width: '100%',
                  backgroundColor: '#0D0D0F',
                  border: '1px solid #4B5563',
                  borderRadius: '8px',
                  padding: '12px 16px',
                  color: '#F5F4F2',
                  fontSize: '16px',
                  opacity: selectedWork ? 1 : 0.5
                }}
              >
                <option value="">Select a passage...</option>
                {passages.map((passage) => (
                  <option key={passage.id} value={passage.id}>
                    {passage.reference} - {passage.preview}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <button
            onClick={compareTranslations}
            disabled={!selectedWork || !selectedPassage || comparing}
            style={{
              backgroundColor: selectedWork && selectedPassage ? '#C9A227' : '#4B5563',
              color: selectedWork && selectedPassage ? '#0D0D0F' : '#9CA3AF',
              padding: '12px 24px',
              borderRadius: '8px',
              border: 'none',
              fontWeight: 'bold',
              fontSize: '16px',
              cursor: selectedWork && selectedPassage ? 'pointer' : 'not-allowed',
              transition: 'all 0.2s'
            }}
          >
            {comparing ? 'Comparing...' : 'Compare Translations'}
          </button>
        </div>

        {translations.length > 0 && (
          <div style={{ 
            backgroundColor: '#1E1E24', 
            borderRadius: '12px', 
            padding: '32px' 
          }}>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '24px' }}>
              Translation Comparison
            </h2>
            
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '12px', color: '#C9A227' }}>
                Original Text
              </h3>
              <div style={{ 
                backgroundColor: '#0D0D0F', 
                padding: '20px', 
                borderRadius: '8px',
                fontFamily: 'Georgia, serif',
                fontSize: '16px',
                lineHeight: '1.8',
                color: '#E8D5A3'
              }}>
                {translations[0]?.originalText || 'Original text not available'}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
              {translations.map((translation, index) => (
                <div key={index} style={{ 
                  border: `2px solid ${translatorColors[translation.translator]}`,
                  borderRadius: '12px',
                  padding: '24px',
                  backgroundColor: 'rgba(30,30,36,0.5)'
                }}>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    marginBottom: '16px',
                    gap: '12px'
                  }}>
                    <div style={{
                      width: '4px',
                      height: '24px',
                      backgroundColor: translatorColors[translation.translator],
                      borderRadius: '2px'
                    }}></div>
                    <h4 style={{ 
                      fontSize: '20px', 
                      fontWeight: 'bold',
                      color: translatorColors[translation.translator]
                    }}>
                      {translatorNames[translation.translator]}
                    </h4>
                  </div>
                  
                  <div style={{ 
                    fontSize: '16px',
                    lineHeight: '1.7',
                    color: '#F5F4F2',
                    fontFamily: 'Georgia, serif'
                  }}>
                    {translation.text}
                  </div>
                  
                  {translation.notes && (
                    <div style={{ 
                      marginTop: '16px',
                      padding: '12px 16px',
                      backgroundColor: 'rgba(0,0,0,0.3)',
                      borderRadius: '6px',
                      fontSize: '14px',
                      color: '#9CA3AF',
                      fontStyle: 'italic'
                    }}>
                      Notes: {translation.notes}
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            <div style={{ 
              marginTop: '32px',
              padding: '20px',
              backgroundColor: 'rgba(201,162,39,0.1)',
              border: '1px solid rgba(201,162,39,0.3)',
              borderRadius: '8px'
            }}>
              <h4 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '12px', color: '#C9A227' }}>
                Translation Analysis
              </h4>
              <p style={{ color: '#9CA3AF', lineHeight: '1.6' }}>
                Each translator brings a unique perspective to the ancient text. Fagles emphasizes readability and poetic flow, 
                Lattimore prioritizes literal accuracy and preserves Greek word order, while LOGOS AI combines scholarly 
                precision with contextual understanding to bridge ancient and modern sensibilities.
              </p>
            </div>
          </div>
        )}

        {translations.length === 0 && !comparing && (
          <div style={{ 
            textAlign: 'center', 
            padding: '60px 20px',
            color: '#6B7280'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📚</div>
            <h3 style={{ fontSize: '20px', marginBottom: '8px' }}>Ready to Compare</h3>
            <p>Select a work and passage above to see side-by-side translations</p>
          </div>
        )}
      </main>
    </div>
  );
}