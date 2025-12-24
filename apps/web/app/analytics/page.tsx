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
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '12px',
        padding: '16px',
        backgroundColor: '#141419',
        borderRadius: '12px',
        border: '2px solid #C9A227',
        transform: 'scale(1.05)',
        boxShadow: '0 20px 40px rgba(201, 162, 39, 0.3)',
        transition: 'all 0.3s ease'
      }}>
        <div style={{ fontSize: '24px', color: '#C9A227', fontWeight: '700' }}>
          {word.word}
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {word.embeddings.map((value: number, idx: number) => (
            <div
              key={idx}
              style={{
                width: `${8 + value * 20}px`,
                height: `${8 + value * 20}px`,
                backgroundColor: `hsl(${210 + idx * 30}, 70%, ${50 + value * 30}%)`,
                borderRadius: '50%',
                animation: `pulse-${idx} 2s infinite`,
                boxShadow: '0 0 20px rgba(59, 130, 246, 0.4)'
              }}
            />
          ))}
        </div>
        <div style={{ fontSize: '14px', color: '#9CA3AF' }}>
          LSJ: {word.lsj}
        </div>
      </div>
    );
  };

  const renderSemanticFlow = () => {
    return (
      <div style={{ width: '100%', height: '500px', position: 'relative' }}>
        <svg width="100%" height="100%" style={{ backgroundColor: '#0D0D0F', borderRadius: '12px' }}>
          <defs>
            <linearGradient id="flowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style={{ stopColor: '#D97706', stopOpacity: 1 }} />
              <stop offset="33%" style={{ stopColor: '#F59E0B', stopOpacity: 1 }} />
              <stop offset="66%" style={{ stopColor: '#3B82F6', stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: '#DC2626', stopOpacity: 1 }} />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {/* Era Labels */}
          <text x="100" y="30" fill="#D97706" fontSize="14" fontWeight="700" textAnchor="middle">ARCHAIC</text>
          <text x="300" y="30" fill="#F59E0B" fontSize="14" fontWeight="700" textAnchor="middle">CLASSICAL</text>
          <text x="500" y="30" fill="#3B82F6" fontSize="14" fontWeight="700" textAnchor="middle">HELLENISTIC</text>
          <text x="700" y="30" fill="#DC2626" fontSize="14" fontWeight="700" textAnchor="middle">IMPERIAL</text>

          {analyticsData.semanticDrift.map((wordData, wordIdx) => (
            <g key={wordData.word}>
              {/* Word label */}
              <text 
                x="50" 
                y={80 + wordIdx * 100} 
                fill="#C9A227" 
                fontSize="20" 
                fontWeight="700"
                style={{ cursor: 'pointer' }}
                onClick={() => setSelectedWord(wordData)}
              >
                {wordData.word}
              </text>
              
              {/* Semantic evolution line */}
              <path
                d={`M 100 ${80 + wordIdx * 100} 
                   Q 200 ${60 + wordIdx * 100} 300 ${80 + wordIdx * 100}
                   Q 400 ${60 + wordIdx * 100} 500 ${80 + wordIdx * 100}
                   Q 600 ${100 + wordIdx * 100} 700 ${80 + wordIdx * 100}`}
                stroke="url(#flowGradient)"
                strokeWidth="4"
                fill="none"
                filter="url(#glow)"
                style={{ 
                  animation: `flow-${wordIdx} 3s infinite`,
                  opacity: selectedWord?.word === wordData.word ? 1 : 0.7
                }}
              />

              {/* Era points */}
              {['archaic', 'classical', 'hellenistic', 'imperial'].map((era, eraIdx) => {
                const x = 100 + eraIdx * 200;
                const y = 80 + wordIdx * 100;
                const eraData = wordData[era];
                const radius = Math.sqrt(eraData.freq / 10) + 8;
                
                return (
                  <g key={era}>
                    <circle
                      cx={x}
                      cy={y}
                      r={radius}
                      fill={eraData.color}
                      opacity={hoveredVariant === `${wordData.word}-${era}` ? 1 : 0.8}
                      style={{ 
                        cursor: 'pointer',
                        filter: 'url(#glow)',
                        transform: hoveredVariant === `${wordData.word}-${era}` ? 'scale(1.2)' : 'scale(1)',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={() => setHoveredVariant(`${wordData.word}-${era}`)}
                      onMouseLeave={() => setHoveredVariant(null)}
                    />
                    
                    {hoveredVariant === `${wordData.word}-${era}` && (
                      <g>
                        <rect
                          x={x - 60}
                          y={y - 50}
                          width="120"
                          height="35"
                          fill="#1E1E24"
                          stroke="#C9A227"
                          strokeWidth="1"
                          rx="6"
                        />
                        <text
                          x={x}
                          y={y - 35}
                          fill="#F5F4F2"
                          fontSize="12"
                          textAnchor="middle"
                          fontWeight="600"
                        >
                          {eraData.meaning}
                        </text>
                        <text
                          x={x}
                          y={y - 20}
                          fill="#9CA3AF"
                          fontSize="10"
                          textAnchor="middle"
                        >
                          freq: {eraData.freq}
                        </text>
                      </g>
                    )}
                  </g>
                );
              })}
            </g>
          ))}
        </svg>

        <style jsx>{`
          @keyframes flow-0 {
            0% { stroke-dasharray: 0 1000; }
            100% { stroke-dasharray: 1000 0; }
          }
          @keyframes flow-1 {
            0% { stroke-dasharray: 0 1000; }
            100% { stroke-dasharray: 1000 0; }
          }
          @keyframes flow-2 {
            0% { stroke-dasharray: 0 1000; }
            100% { stroke-dasharray: 1000 0; }
          }
          @keyframes flow-3 {
            0% { stroke-dasharray: 0 1000; }
            100% { stroke-dasharray: 1000 0; }
          }
        `}</style>
      </div>
    );
  };

  const renderFrequencyChart = () => {
    const maxFreq = Math.max(...analyticsData.wordFrequency.map(w => w.frequency));
    
    return (
      <div style={{ width: '100%', height: '400px', backgroundColor: '#1E1E24', borderRadius: '16px', padding: '24px' }}>
        <div style={{ marginBottom: '24px' }}>
          <h3 style={{ color: '#F5F4F2', fontSize: '20px', fontWeight: '700', marginBottom: '8px' }}>
            Word Frequency Distribution
          </h3>
          <div style={{ display: 'flex', gap: '16px' }}>
            <span style={{ color: '#D97706', fontSize: '12px', fontWeight: '600' }}>● Archaic</span>
            <span style={{ color: '#F59E0B', fontSize: '12px', fontWeight: '600' }}>● Classical</span>
          </div>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'end', gap: '12px', height: '300px' }}>
          {analyticsData.wordFrequency.map((word, idx) => {
            const height = (word.frequency / maxFreq) * 250;
            const color = word.era === 'Archaic' ? '#D97706' : '#F59E0B';
            
            return (
              <div
                key={word.word}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  transform: selectedWord?.word === word.word ? 'scale(1.1)' : 'scale(1)'
                }}
                onClick={() => setSelectedWord(selectedWord?.word === word.word ? null : word)}
              >
                <div
                  style={{
                    width: '32px',
                    height: `${height}px`,
                    backgroundColor: color,
                    borderRadius: '8px 8px 0 0',
                    position: 'relative',
                    boxShadow: `0 0 20px ${color}50`,
                    animation: `grow-${idx} 1.5s ease-out`,
                    marginBottom: '8px'
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      top: '-30px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      color: '#F5F4F2',
                      fontSize: '12px',
                      fontWeight: '600',
                      opacity: selectedWord?.word === word.word ? 1 : 0,
                      transition: 'opacity 0.3s ease'
                    }}
                  >
                    {word.frequency}
                  </div>
                </div>
                <div style={{ 
                  color: '#C9A227', 
                  fontSize: '14px', 
                  fontWeight: '600',
                  writingMode: 'vertical-lr',
                  textOrientation: 'mixed',
                  height: '80px',
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  {word.word}
                </div>
              </div>
            );
          })}
        </div>

        <style jsx>{`
          ${analyticsData.wordFrequency.map((_, idx) => `
            @keyframes grow-${idx} {
              0% { height: 0; opacity: 0; }
              100% { height: ${(analyticsData.wordFrequency[idx].frequency / maxFreq) * 250}px; opacity: 1; }
            }
          `).join('')}
        `}</style>
      </div>
    );
  };

  const renderManuscriptNetwork = () => {
    return (
      <div style={{ width: '100%', height: '500px', backgroundColor: '#0D0D0F', borderRadius: '16px', position: 'relative', overflow: 'hidden' }}>
        <svg width="100%" height="100%">
          <defs>
            <radialGradient id="nodeGradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" style={{ stopColor: '#C9A227', stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: '#F59E0B', stopOpacity: 0.8 }} />
            </radialGradient>
            <filter id="nodeGlow">
              <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {/* Manuscript connections */}
          {analyticsData.manuscriptVariants.map((text, textIdx) => {
            const centerX = 200 + textIdx * 250;
            const centerY = 250;
            
            return (
              <g key={text.text}>
                {/* Central text node */}
                <circle
                  cx={centerX}
                  cy={centerY}
                  r="40"
                  fill="url(#nodeGradient)"
                  filter="url(#nodeGlow)"
                  style={{ 
                    cursor: 'pointer',
                    animation: `pulse-text-${textIdx} 3s infinite`
                  }}
                />
                <text
                  x={centerX}
                  y={centerY - 5}
                  fill="#0D0D0F"
                  fontSize="12"
                  fontWeight="700"
                  textAnchor="middle"
                >
                  {text.text.split('.')[0]}
                </text>
                <text
                  x={centerX}
                  y={centerY + 8}
                  fill="#0D0D0F"
                  fontSize="10"
                  fontWeight="600"
                  textAnchor="middle"
                >
                  {text.text.split('.').slice(1).join('.')}
                </text>

                {/* Manuscript nodes */}
                {text.manuscripts.map((ms, msIdx) => {
                  const angle = (msIdx / text.manuscripts.length) * 2 * Math.PI;
                  const msX = centerX + Math.cos(angle) * 120;
                  const msY = centerY + Math.sin(angle) * 120;
                  
                  return (
                    <g key={ms}>
                      {/* Connection line */}
                      <line
                        x1={centerX}
                        y1={centerY}
                        x2={msX}
                        y2={msY}
                        stroke="#3B82F6"
                        strokeWidth="2"
                        opacity="0.6"
                        style={{ 
                          animation: `connect-${textIdx}-${msIdx} 2s infinite alternate`
                        }}
                      />
                      
                      {/* Manuscript node */}
                      <circle
                        cx={msX}
                        cy={msY}
                        r="20"
                        fill="#3B82F6"
                        opacity="0.8"
                        style={{ 
                          cursor: 'pointer',
                          filter: 'url(#nodeGlow)',
                          animation: `orbit-${textIdx}-${msIdx} 8s infinite linear`
                        }}
                      />
                      <text
                        x={msX}
                        y={msY + 35}
                        fill="#9CA3AF"
                        fontSize="10"
                        textAnchor="middle"
                        fontWeight="600"
                      >
                        {ms.split(' ')[0]}
                      </text>
                    </g>
                  );
                })}

                {/* Variants indicator */}
                <rect
                  x={centerX - 15}
                  y={centerY + 60}
                  width="30"
                  height="20"
                  fill="#DC2626"
                  rx="4"
                />
                <text
                  x={centerX}
                  y={centerY + 75}
                  fill="#F5F4F2"
                  fontSize="12"
                  fontWeight="700"
                  textAnchor="middle"
                >
                  {text.variants}
                </text>
              </g>
            );
          })}
        </svg>

        <style jsx>{`
          ${analyticsData.manuscriptVariants.map((text, textIdx) => `
            @keyframes pulse-text-${textIdx} {
              0%, 100% { transform: scale(1); opacity: 0.8; }
              50% { transform: scale(1.1); opacity: 1; }
            }
            ${text.manuscripts.map((_, msIdx) => `
              @keyframes connect-${textIdx}-${msIdx} {
                0% { stroke-dasharray: 0 200; }
                100% { stroke-dasharray: 200 0; }
              }
              @keyframes orbit-${textIdx}-${msIdx} {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `).join('')}
          `).join('')}
        `}</style>
      </div>
    );
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#0D0D0F',
      backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(201, 162, 39, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)',
      color: '#F5F4F2'
    }}>
      {/* Navigation */}
      <nav style={{ 
        backgroundColor: '#1E1E24', 
        borderBottom: '2px solid #C9A227',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backdropFilter: 'blur(10px)'
      }}>
        <div style={{ 
          maxWidth: '1200px', 
          margin: '0 auto', 
          padding: '16px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <div style={{ 
              fontSize: '28px', 
              fontWeight: '700', 
              color: '#C9A227',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                background: 'linear-gradient(135deg, #C9A227 0%, #F59E0B 100%)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
                fontWeight: '900',
                color: '#0D0D0F',
                boxShadow: '0 8px 32px rgba(201, 162, 39, 0.3)'
              }}>
                Λ
              </div>
              ΛΟΓΟΣ Analytics
            </div>
          </Link>

          <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
            <Link href="/search" style={{ color: '#9CA3AF', textDecoration: 'none', transition: 'all 0.2s ease' }}>
              Search
            </Link>
            <Link href="/reader" style={{ color: '#9CA3AF', textDecoration: 'none', transition: 'all 0.2s ease' }}>
              Reader
            </Link>
            <Link href="/analytics" style={{ color: '#C9A227', textDecoration: 'none', fontWeight: '600' }}>
              Analytics
            </Link>
          </div>
        </div>
      </nav>

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '40px 24px' }}>
        {/* Header */}
        <div style={{ marginBottom: '48px', textAlign: 'center' }}>
          <h1 style={{ 
            fontSize: '48px', 
            fontWeight: '900', 
            background: 'linear-gradient(135deg, #C9A227 0%, #F59E0B 50%, #DC2626 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '16px',
            textShadow: '0 0 60px rgba(201, 162, 39, 0