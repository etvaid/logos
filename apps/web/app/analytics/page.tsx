'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function AnalyticsPage() {
  const [selectedComparison, setSelectedComparison] = useState('semantic');
  const [selectedTimeframe, setSelectedTimeframe] = useState('all');
  const [activeVisualization, setActiveVisualization] = useState('frequency');
  const [selectedWord, setSelectedWord] = useState(null);
  const [hoveredVariant, setHoveredVariant] = useState(null);

  const analyticsData = {
    wordFrequency: [
      { word: 'λόγος', frequency: 847, era: 'Classical', meaning: 'word, speech, reason', lsj: 'A.1046', embeddings: [0.2, 0.8, 0.6, 0.3, 0.9] },
      { word: 'θεός', frequency: 623, era: 'Archaic', meaning: 'god, deity', lsj: 'A.812', embeddings: [0.9, 0.3, 0.7, 0.5, 0.8] },
      { word: 'ἄνθρωπος', frequency: 445, era: 'Classical', meaning: 'human, person', lsj: 'A.164', embeddings: [0.4, 0.7, 0.5, 0.8, 0.3] },
      { word: 'ψυχή', frequency: 389, era: 'Classical', meaning: 'soul, mind', lsj: 'Ψ.2029', embeddings: [0.6, 0.4, 0.9, 0.2, 0.7] },
      { word: 'πόλις', frequency: 356, era: 'Classical', meaning: 'city, state', lsj: 'Π.1438', embeddings: [0.3, 0.6, 0.4, 0.9, 0.5] },
      { word: 'φύσις', frequency: 298, era: 'Classical', meaning: 'nature', lsj: 'Φ.2031', embeddings: [0.7, 0.5, 0.8, 0.4, 0.6] },
      { word: 'ἀρχή', frequency: 267, era: 'Archaic', meaning: 'beginning, rule', lsj: 'A.252', embeddings: [0.5, 0.8, 0.3, 0.7, 0.4] }
    ],
    semanticDrift: [
      { 
        word: 'κόσμος', 
        archaic: { meaning: 'order', freq: 45, color: '#D97706' }, 
        classical: { meaning: 'universe', freq: 123, color: '#F59E0B' }, 
        hellenistic: { meaning: 'world', freq: 89, color: '#3B82F6' }, 
        imperial: { meaning: 'ornament', freq: 67, color: '#DC2626' },
        lsj: 'Κ.981'
      },
      { 
        word: 'ἀρετή', 
        archaic: { meaning: 'excellence', freq: 67, color: '#D97706' }, 
        classical: { meaning: 'virtue', freq: 234, color: '#F59E0B' }, 
        hellenistic: { meaning: 'moral virtue', freq: 156, color: '#3B82F6' }, 
        imperial: { meaning: 'christian virtue', freq: 98, color: '#DC2626' },
        lsj: 'A.241'
      },
      { 
        word: 'δαίμων', 
        archaic: { meaning: 'divine being', freq: 89, color: '#D97706' }, 
        classical: { meaning: 'spirit', freq: 167, color: '#F59E0B' }, 
        hellenistic: { meaning: 'fate', freq: 134, color: '#3B82F6' }, 
        imperial: { meaning: 'demon', freq: 203, color: '#DC2626' },
        lsj: 'Δ.12'
      },
      { 
        word: 'λόγος', 
        archaic: { meaning: 'account', freq: 34, color: '#D97706' }, 
        classical: { meaning: 'reason', freq: 289, color: '#F59E0B' }, 
        hellenistic: { meaning: 'discourse', freq: 178, color: '#3B82F6' }, 
        imperial: { meaning: 'word (divine)', freq: 156, color: '#DC2626' },
        lsj: 'Λ.1046'
      }
    ],
    manuscriptVariants: [
      { 
        text: 'Hom. Il. 1.1', 
        variants: 23, 
        manuscripts: ['P.Oxy 3.412', 'Venetus A', 'Marcianus 454', 'Laurentianus 32.15'],
        apparatus: [
          { lemma: 'μῆνιν', variants: ['μῆνιν A', 'μένιν B', 'μάνιν C'], preferred: 'μῆνιν' },
          { lemma: 'ἄειδε', variants: ['ἄειδε A B', 'ἔσπετε C D'], preferred: 'ἄειδε' },
          { lemma: 'θεά', variants: ['θεά A', 'θεαί B', 'om. C'], preferred: 'θεά' }
        ]
      },
      { 
        text: 'Pl. Rep. 1.327a', 
        variants: 18, 
        manuscripts: ['Parisinus gr. 1807', 'Vaticanus gr. 1', 'Laurentianus 85.9', 'Venetus 185'],
        apparatus: [
          { lemma: 'κατέβην', variants: ['κατέβην A F', 'κατῆλθον B T'], preferred: 'κατέβην' },
          { lemma: 'χθὲς', variants: ['χθὲς A F B T', 'τῇδε add. D'], preferred: 'χθὲς' }
        ]
      },
      { 
        text: 'Arist. Met. 1.980a', 
        variants: 31, 
        manuscripts: ['Laurentianus 87.12', 'Parisinus gr. 1853', 'Vaticanus gr. 256', 'Ambrosianus 490'],
        apparatus: [
          { lemma: 'εἰδέναι', variants: ['εἰδέναι A B', 'ἰδεῖν E J'], preferred: 'εἰδέναι' },
          { lemma: 'ὀρέγονται', variants: ['ὀρέγονται A B', 'ἐφίενται E'], preferred: 'ὀρέγονται' }
        ]
      }
    ],
    paradigms: {
      'λόγος': {
        type: 'o-stem masculine',
        forms: {
          'Nom. Sg.': 'λόγος',
          'Gen. Sg.': 'λόγου',
          'Dat. Sg.': 'λόγῳ',
          'Acc. Sg.': 'λόγον',
          'Nom. Pl.': 'λόγοι',
          'Gen. Pl.': 'λόγων',
          'Dat. Pl.': 'λόγοις',
          'Acc. Pl.': 'λόγους'
        }
      },
      'ψυχή': {
        type: 'a-stem feminine',
        forms: {
          'Nom. Sg.': 'ψυχή',
          'Gen. Sg.': 'ψυχῆς',
          'Dat. Sg.': 'ψυχῇ',
          'Acc. Sg.': 'ψυχήν',
          'Nom. Pl.': 'ψυχαί',
          'Gen. Pl.': 'ψυχῶν',
          'Dat. Pl.': 'ψυχαῖς',
          'Acc. Pl.': 'ψυχάς'
        }
      }
    }
  };

  const exportData = (format: string) => {
    const timestamp = new Date().toISOString().split('T')[0];
    console.log(`Exporting analytical data in ${format} format - ${timestamp}`);
    // Simulate file download
    const element = document.createElement('a');
    const data = format === 'CSV' ? 
      'word,frequency,era,meaning,lsj\n' + analyticsData.wordFrequency.map(w => `${w.word},${w.frequency},${w.era},${w.meaning},${w.lsj}`).join('\n') :
      format === 'JSON' ?
      JSON.stringify(analyticsData, null, 2) :
      `<?xml version="1.0" encoding="UTF-8"?>\n<TEI xmlns="http://www.tei-c.org/ns/1.0">\n  <analytics>${JSON.stringify(analyticsData)}</analytics>\n</TEI>`;
    
    const file = new Blob([data], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `corpus-analytics-${timestamp}.${format.toLowerCase()}`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const renderWordEmbeddings = (word: any) => {
    const maxRadius = 30;
    return (
      <svg width="200" height="80" style={{ marginTop: '8px' }}>
        {word.embeddings.map((value: number, index: number) => (
          <circle
            key={index}
            cx={20 + index * 35}
            cy={40}
            r={value * maxRadius}
            fill="#3B82F6"
            fillOpacity={0.3}
            stroke="#3B82F6"
            strokeWidth="2"
          />
        ))}
        <text x="10" y="70" fill="#9CA3AF" fontSize="10">Semantic Dimensions</text>
      </svg>
    );
  };

  const renderSemanticDrift = () => {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
        {analyticsData.semanticDrift.map((item, index) => (
          <div key={index} style={{
            backgroundColor: '#1E1E24',
            borderRadius: '8px',
            padding: '24px',
            border: '1px solid #C9A227',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = '0 8px 32px rgba(201, 162, 39, 0.2)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
              <span style={{ 
                fontSize: '20px', 
                fontWeight: '600', 
                color: '#F5F4F2',
                fontFamily: 'Georgia, serif'
              }}>
                {item.word}
              </span>
              <span style={{ 
                marginLeft: 'auto',
                fontSize: '12px',
                color: '#9CA3AF',
                backgroundColor: '#141419',
                padding: '2px 8px',
                borderRadius: '4px'
              }}>
                LSJ {item.lsj}
              </span>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {Object.entries(item).filter(([key]) => key !== 'word' && key !== 'lsj').map(([era, data]: [string, any]) => (
                <div key={era} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    backgroundColor: data.color
                  }} />
                  <span style={{ 
                    fontSize: '14px', 
                    fontWeight: '500', 
                    color: '#F5F4F2',
                    minWidth: '80px',
                    textTransform: 'capitalize'
                  }}>
                    {era}:
                  </span>
                  <span style={{ color: '#9CA3AF', fontSize: '14px' }}>
                    {data.meaning}
                  </span>
                  <div style={{
                    marginLeft: 'auto',
                    width: `${(data.freq / 300) * 60}px`,
                    height: '4px',
                    backgroundColor: data.color,
                    borderRadius: '2px'
                  }} />
                  <span style={{ color: '#6B7280', fontSize: '12px', minWidth: '30px' }}>
                    {data.freq}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderManuscriptVariants = () => {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {analyticsData.manuscriptVariants.map((item, index) => (
          <div key={index} style={{
            backgroundColor: '#1E1E24',
            borderRadius: '8px',
            padding: '24px',
            border: '1px solid #DC2626'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h3 style={{ 
                  fontSize: '18px', 
                  fontWeight: '600', 
                  color: '#F5F4F2',
                  margin: '0 0 4px 0',
                  fontFamily: 'Georgia, serif'
                }}>
                  {item.text}
                </h3>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                  <span style={{ color: '#9CA3AF', fontSize: '14px' }}>
                    {item.variants} variants
                  </span>
                  <span style={{ color: '#6B7280', fontSize: '12px' }}>
                    {item.manuscripts.length} manuscripts
                  </span>
                </div>
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ color: '#F5F4F2', fontSize: '14px', fontWeight: '600', marginBottom: '12px' }}>
                Manuscript Witnesses:
              </h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {item.manuscripts.map((ms, msIndex) => (
                  <span key={msIndex} style={{
                    backgroundColor: '#141419',
                    color: '#9CA3AF',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontFamily: 'monospace'
                  }}>
                    {ms}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h4 style={{ color: '#F5F4F2', fontSize: '14px', fontWeight: '600', marginBottom: '12px' }}>
                Critical Apparatus:
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {item.apparatus.map((app, appIndex) => (
                  <div key={appIndex} style={{
                    backgroundColor: '#141419',
                    padding: '12px',
                    borderRadius: '6px',
                    fontSize: '13px'
                  }}>
                    <span style={{ 
                      color: '#C9A227', 
                      fontWeight: '600',
                      fontFamily: 'Georgia, serif'
                    }}>
                      {app.lemma}
                    </span>
                    <span style={{ color: '#9CA3AF', margin: '0 8px' }}>]</span>
                    {app.variants.map((variant, vIndex) => (
                      <span key={vIndex}>
                        <span style={{ 
                          color: vIndex === 0 ? '#F5F4F2' : '#9CA3AF',
                          fontFamily: 'Georgia, serif'
                        }}>
                          {variant}
                        </span>
                        {vIndex < app.variants.length - 1 && 
                          <span style={{ color: '#6B7280', margin: '0 4px' }}> | </span>
                        }
                      </span>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderParadigmTable = (word: string) => {
    const paradigm = analyticsData.paradigms[word];
    if (!paradigm) return null;

    return (
      <div style={{
        backgroundColor: '#1E1E24',
        borderRadius: '8px',
        padding: '20px',
        border: '1px solid #3B82F6',
        marginTop: '16px'
      }}>
        <h4 style={{ 
          color: '#F5F4F2', 
          fontSize: '16px', 
          fontWeight: '600', 
          marginBottom: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span style={{ fontFamily: 'Georgia, serif' }}>{word}</span>
          <span style={{ 
            fontSize: '12px', 
            color: '#9CA3AF',
            backgroundColor: '#141419',
            padding: '2px 8px',
            borderRadius: '4px'
          }}>
            {paradigm.type}
          </span>
        </h4>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '12px' 
        }}>
          {Object.entries(paradigm.forms).map(([case_form, form]) => (
            <div key={case_form} style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '8px 12px',
              backgroundColor: '#141419',
              borderRadius: '4px',
              border: '1px solid #2D2D35'
            }}>
              <span style={{ color: '#9CA3AF', fontSize: '13px' }}>{case_form}</span>
              <span style={{ 
                color: '#F5F4F2', 
                fontSize: '14px',
                fontFamily: 'Georgia, serif',
                fontWeight: '500'
              }}>
                {form}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#0D0D0F', 
      color: '#F5F4F2',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Header */}
      <div style={{ 
        borderBottom: '1px solid #1E1E24',
        padding: '24px',
        backgroundColor: '#141419'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <div>
              <h1 style={{ 
                fontSize: '32px', 
                fontWeight: '700', 
                color: '#F5F4F2',
                margin: '0 0 8px 0',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <span style={{ color: '#C9A227' }}>📊</span>
                Corpus Analytics
              </h1>
              <p style={{ color: '#9CA3AF', margin: '0', fontSize: '16px' }}>
                Advanced philological analysis • Computational linguistics • Manuscript variants
              </p>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              {['CSV', 'JSON', 'TEI'].map(format => (
                <button
                  key={format}
                  onClick={() => exportData(format)}
                  style={{
                    padding: '10px 18px',
                    backgroundColor: '#1E1E24',
                    color: '#F5F4F2',
                    border: '1px solid #C9A227',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = '#C9A227';
                    e.currentTarget.style.color = '#0D0D0F';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = '#1E1E24';
                    e.currentTarget.style.color = '#F5F4F2';
                  }}
                >
                  Export {format}
                </button>
              ))}
            </div>
          </div>

          {/* Navigation Tabs */}
          <div style={{ display: 'flex', gap: '4px' }}>
            {[
              { id: 'frequency', label: 'Word Frequency', icon: '📈' },
              { id: 'semantic', label: 'Semantic Drift', icon: '🔄' },
              { id: 'manuscripts', label: 'Manuscript Variants', icon: '📜' },
              { id: 'paradigms', label: 'Morphological Paradigms', icon: '📋' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveVisualization(tab.id)}
                style={{
                  padding: '12px 20px',
                  backgroundColor: activeVisualization === tab.id ? '#C9A227' : '#1E1E24',
                  color: activeVisualization === tab.id ? '#0D0D0F' : '#F5F4F2',
                  border: activeVisualization === tab.id ? '1px solid #C9A227' : '1px solid #2D2D35',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  fontSize: '14px',
                  fontWeight: '500',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
                onMouseOver={(e) => {
                  if (activeVisualization !== tab.id) {
                    e.currentTarget.style.backgroundColor = '#2D2D35';
                  }
                }}
                onMouseOut={(e) => {
                  if (activeVisualization !== tab.id) {
                    e.currentTarget.style.backgroundColor = '#1E1E24';
                  }
                }}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px' }}>
        
        {/* Word Frequency Analysis */}
        {activeVisualization === 'frequency' && (
          <div>
            <div style={{ marginBottom: '32px' }}>
              <h2 style={{ 
                fontSize: '24px', 
                fontWeight: '600', 
                color: '#F5F4F2',
                marginBottom: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <span style={{ 
                  width: '4px',
                  height: '24px',
                  backgroundColor: '#C9A227',
                  borderRadius: '2px'
                }} />
                Lexical Frequency Distribution
              </h2>
              <p style={{ color: '#9CA3AF', fontSize: '16px', margin: '0' }}>
                Statistical analysis with semantic embeddings and LSJ references
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
              {analyticsData.wordFrequency.map((word, index) => (
                <div 
                  key={index} 
                  style={{
                    backgroundColor: '#1E1E24',
                    borderRadius: '8px',
                    padding: '24px',
                    border: selectedWord === word.word ? '2px solid #C9A227' : '1px solid #2D2D35',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onClick={() => setSelectedWord(selectedWord === word.word ? null : word.word)}
                  onMouseOver={(e) => {
                    if (selectedWord !== word.word) {
                      e.currentTarget.style.borderColor = '#C9A227';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }
                  }}
                  onMouseOut={(e) => {
                    if (selectedWord !== word.word) {
                      e.currentTarget.style.borderColor = '#2D2D35';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                    <div style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: '#3B82F6',
                      marginRight: '8px'
                    }} />
                    <span style={{ 
                      fontSize: '20px', 
                      fontWeight: '600', 
                      color: '#F5F4F2',
                      fontFamily: 'Georgia, serif'
                    }}>
                      {word.word}
                    </span>
                    <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ 
                        fontSize: '14px',
                        color: '#C9A227',
                        backgroundColor: '#141419',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontWeight: '500'
                      }}>
                        {word.frequency}
                      </span>
                      <span style={{ 
                        fontSize: '12px',
                        color: '#9CA3AF',
                        backgroundColor: '#141419',
                        padding: '2px 8px',
                        borderRadius: '4px'
                      }}>
                        LSJ {word.lsj}
                      </span>
                    </div>
                  </div>

                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{ color: '#9CA3AF', fontSize: '14px' }}>{word.meaning}</span>
                      <span style={{ color: '#6B7280', fontSize: '12px' }}>{word.era} Period</span>
                    </div>
                    
                    <div style={{
                      width: '100%',
                      height: '6px',
                      backgroundColor: '#141419',
                      borderRadius: '3px',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        width: `${(word.frequency / 847) * 100}%`,
                        height: '100%',
                        backgroundColor: '#3B82F6',
                        transition: 'width 0.5s ease'
                      }} />
                    </div>
                  </div>

                  {renderWordEmbeddings(word)}

                  {selectedWord === word.word && renderParadigmTable(word.word)}
                </div>
              ))}
            </div>

            {/* Frequency Chart */}
            <div style={{ 
              backgroundColor: '#1E1E24', 
              borderRadius: '8px', 
              padding: '32px',
              marginTop: '32px',
              border: '1px solid #2D2D35'
            }}>
              <h3 style={{ 
                fontSize: '18px', 
                fontWeight: '600', 
                color: '#F5F4F2',
                marginBottom: '24px'
              }}>
                Frequency Distribution Chart
              </h3>
              <svg width="100%" height="300" style={{ overflow: 'visible' }}>
                {analyticsData.wordFrequency.map((word, index) => {
                  const barHeight = (word.frequency / 847) * 200;
                  const x = index * 120 + 50;
                  return (
                    <g key={index}>
                      <rect
                        x={x}
                        y={250 - barHeight}
                        width="80"
                        height={barHeight}
                        fill="#3B82F6"
                        fillOpacity="0.8"
                        rx="4"
                      />
                      