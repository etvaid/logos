'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ChronosPage() {
  const [selectedConcept, setSelectedConcept] = useState<string>('ἀρετή');
  const [expandedNode, setExpandedNode] = useState<number | null>(null);
  const [hoveredNode, setHoveredNode] = useState<number | null>(null);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);

  const concepts = {
    'ἀρετή': {
      transliteration: 'arete',
      modern: 'virtue',
      data: [
        {
          era: 'Archaic',
          period: '800-500 BCE',
          meaning: 'Battle excellence, prowess in war',
          evolution: 'Originally referred to any kind of excellence or effectiveness, especially in warfare. Heroes in Homer displayed arete through brave deeds and martial skill.',
          authors: ['Homer', 'Hesiod'],
          confidence: 92,
          color: '#D97706',
          year: -800,
          position: 0
        },
        {
          era: 'Classical',
          period: '500-323 BCE',
          meaning: 'Moral excellence, ethical virtue',
          evolution: 'Transformed into moral and intellectual excellence. Plato divided it into four cardinal virtues: wisdom, courage, temperance, and justice. Aristotle refined it as the mean between extremes.',
          authors: ['Plato', 'Aristotle'],
          confidence: 95,
          color: '#F59E0B',
          year: -500,
          position: 1
        },
        {
          era: 'Hellenistic',
          period: '323-31 BCE',
          meaning: 'Philosophical virtue, wisdom',
          evolution: 'Became central to philosophical schools as practical wisdom for living well. Stoics emphasized virtue as the only true good, while Epicureans saw it as instrumental to happiness.',
          authors: ['Stoics', 'Epicurus'],
          confidence: 88,
          color: '#3B82F6',
          year: -323,
          position: 2
        },
        {
          era: 'Imperial',
          period: '31 BCE-284 CE',
          meaning: 'Civic virtue, public duty',
          evolution: 'Emphasized as civic responsibility and public service. Roman authors like Plutarch highlighted virtue in leadership and citizenship, while Marcus Aurelius stressed personal virtue in public life.',
          authors: ['Plutarch', 'Marcus Aurelius'],
          confidence: 85,
          color: '#DC2626',
          year: -31,
          position: 3
        },
        {
          era: 'Late Antique',
          period: '284-600 CE',
          meaning: 'Christian virtue, divine grace',
          evolution: 'Christianized as divine gift and moral perfection through grace. Augustine synthesized classical virtue with Christian theology, emphasizing virtue as participation in divine nature.',
          authors: ['Augustine', 'John Chrysostom'],
          confidence: 90,
          color: '#7C3AED',
          year: 284,
          position: 4
        }
      ]
    },
    'λόγος': {
      transliteration: 'logos',
      modern: 'word/reason',
      data: [
        {
          era: 'Archaic',
          period: '800-500 BCE',
          meaning: 'Speech, story, account',
          evolution: 'Basic meaning of spoken word or narrative account. In Homer, logos meant speech or story. Heraclitus elevated it to cosmic principle - the underlying order of the universe.',
          authors: ['Homer', 'Heraclitus'],
          confidence: 94,
          color: '#D97706',
          year: -800,
          position: 0
        },
        {
          era: 'Classical',
          period: '500-323 BCE',
          meaning: 'Reason, rational argument',
          evolution: 'Developed into rational discourse and logical argument. Plato distinguished logos from mythos (myth), while Aristotle systematized logos as logical reasoning in rhetoric and dialectic.',
          authors: ['Plato', 'Aristotle'],
          confidence: 96,
          color: '#F59E0B',
          year: -500,
          position: 1
        },
        {
          era: 'Hellenistic',
          period: '323-31 BCE',
          meaning: 'Cosmic reason, divine principle',
          evolution: 'Stoics made logos the divine rational principle governing the universe. Philo of Alexandria began synthesizing Greek logos with Hebrew wisdom, preparing for Christian adaptation.',
          authors: ['Stoics', 'Philo'],
          confidence: 91,
          color: '#3B82F6',
          year: -323,
          position: 2
        },
        {
          era: 'Late Antique',
          period: '284-600 CE',
          meaning: 'Divine Word, Christ',
          evolution: 'Christianized as the divine Word (Gospel of John). Church Fathers like Origen and Augustine identified logos with Christ as divine reason incarnate, bridging Greek philosophy and Christian theology.',
          authors: ['John', 'Origen', 'Augustine'],
          confidence: 93,
          color: '#7C3AED',
          year: 284,
          position: 3
        }
      ]
    },
    'δίκη': {
      transliteration: 'dike',
      modern: 'justice',
      data: [
        {
          era: 'Archaic',
          period: '800-500 BCE',
          meaning: 'Custom, traditional way',
          evolution: 'Originally referred to traditional customs and ways of life. In Homer, dike was the established order. Hesiod personified Dike as goddess of justice who reports wrongdoing to Zeus.',
          authors: ['Homer', 'Hesiod'],
          confidence: 90,
          color: '#D97706',
          year: -800,
          position: 0
        },
        {
          era: 'Classical',
          period: '500-323 BCE',
          meaning: 'Justice, legal lawsuit',
          evolution: 'Transformed into legal justice and court procedures. Plato made justice the supreme virtue and principle of the ideal state. Court speeches by orators like Demosthenes show practical legal usage.',
          authors: ['Plato', 'Demosthenes'],
          confidence: 94,
          color: '#F59E0B',
          year: -500,
          position: 1
        },
        {
          era: 'Hellenistic',
          period: '323-31 BCE',
          meaning: 'Divine justice, cosmic order',
          evolution: 'Elevated to cosmic principle of universal justice. Stoics viewed dike as part of the divine logos governing the universe. Legal dike developed into more systematic jurisprudence.',
          authors: ['Chrysippus', 'Polybius'],
          confidence: 87,
          color: '#3B82F6',
          year: -323,
          position: 2
        },
        {
          era: 'Imperial',
          period: '31 BCE-284 CE',
          meaning: 'Roman law, imperial justice',
          evolution: 'Incorporated into Roman legal system as iustitia. Greek dike influenced Roman jurisprudence, particularly in concepts of natural law and universal justice principles.',
          authors: ['Cicero', 'Ulpian'],
          confidence: 91,
          color: '#DC2626',
          year: -31,
          position: 3
        }
      ]
    }
  };

  const currentConcept = concepts[selectedConcept as keyof typeof concepts];

  return (
    <div style={{ backgroundColor: '#0D0D0F', minHeight: '100vh', color: '#F5F4F2', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* Navigation */}
      <nav style={{ borderBottom: '1px solid #1E1E24', padding: '16px 0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
            <Link href="/" style={{ fontSize: '24px', fontWeight: 'bold', color: '#C9A227', textDecoration: 'none' }}>
              LOGOS
            </Link>
            <div style={{ display: 'flex', gap: '24px' }}>
              <Link href="/morpheus" style={{ color: '#9CA3AF', textDecoration: 'none', fontSize: '14px', fontWeight: '500', transition: 'color 0.2s' }}>
                MORPHEUS
              </Link>
              <Link href="/chronos" style={{ color: '#C9A227', textDecoration: 'none', fontSize: '14px', fontWeight: '500' }}>
                CHRONOS
              </Link>
              <Link href="/atlas" style={{ color: '#9CA3AF', textDecoration: 'none', fontSize: '14px', fontWeight: '500', transition: 'color 0.2s' }}>
                ATLAS
              </Link>
              <Link href="/synthesis" style={{ color: '#9CA3AF', textDecoration: 'none', fontSize: '14px', fontWeight: '500', transition: 'color 0.2s' }}>
                SYNTHESIS
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Header */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '48px 24px 32px' }}>
        <h1 style={{ fontSize: '48px', fontWeight: 'bold', margin: '0 0 16px 0', background: 'linear-gradient(135deg, #C9A227, #E8D5A3)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          CHRONOS
        </h1>
        <p style={{ fontSize: '18px', color: '#9CA3AF', margin: '0 0 32px 0', maxWidth: '600px' }}>
          Trace the evolution of philosophical concepts through time, witnessing how ideas transform across cultures and centuries.
        </p>

        {/* Concept Selector */}
        <div style={{ position: 'relative', marginBottom: '48px' }}>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#F5F4F2', marginBottom: '8px' }}>
            Select Concept
          </label>
          <div 
            style={{ 
              position: 'relative',
              backgroundColor: '#1E1E24',
              border: '1px solid #141419',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <div style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <span style={{ fontSize: '18px', color: '#3B82F6', marginRight: '12px' }}>{selectedConcept}</span>
                <span style={{ fontSize: '14px', color: '#9CA3AF' }}>
                  ({currentConcept.transliteration}) - {currentConcept.modern}
                </span>
              </div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ transform: showDropdown ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
                <path d="M7 10l5 5 5-5" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            
            {showDropdown && (
              <div style={{ 
                position: 'absolute', 
                top: '100%', 
                left: '0', 
                right: '0', 
                backgroundColor: '#1E1E24', 
                border: '1px solid #141419', 
                borderRadius: '8px', 
                marginTop: '4px', 
                zIndex: 10,
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)'
              }}>
                {Object.entries(concepts).map(([concept, data]) => (
                  <div
                    key={concept}
                    style={{ 
                      padding: '12px 16px', 
                      cursor: 'pointer', 
                      borderBottom: concept === Object.keys(concepts)[Object.keys(concepts).length - 1] ? 'none' : '1px solid #141419',
                      transition: 'background-color 0.2s'
                    }}
                    onMouseEnter={(e) => (e.target as HTMLElement).style.backgroundColor = '#141419'}
                    onMouseLeave={(e) => (e.target as HTMLElement).style.backgroundColor = 'transparent'}
                    onClick={() => {
                      setSelectedConcept(concept);
                      setShowDropdown(false);
                      setExpandedNode(null);
                    }}
                  >
                    <div>
                      <span style={{ fontSize: '16px', color: '#3B82F6', marginRight: '12px' }}>{concept}</span>
                      <span style={{ fontSize: '14px', color: '#9CA3AF' }}>
                        ({data.transliteration}) - {data.modern}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px 48px', display: 'flex', gap: '48px' }}>
        {/* Timeline Column */}
        <div style={{ flex: '0 0 400px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#F5F4F2', marginBottom: '24px' }}>
            Timeline Evolution
          </h2>
          
          {/* Vertical Timeline */}
          <div style={{ position: 'relative' }}>
            {/* Timeline Line */}
            <div style={{ 
              position: 'absolute', 
              left: '24px', 
              top: '0', 
              bottom: '0', 
              width: '2px', 
              background: 'linear-gradient(to bottom, #D97706, #F59E0B, #3B82F6, #DC2626, #7C3AED)'
            }} />
            
            {/* Era Nodes */}
            {currentConcept.data.map((node, index) => (
              <div 
                key={index}
                style={{ 
                  position: 'relative', 
                  marginBottom: index === currentConcept.data.length - 1 ? '0' : '32px',
                  paddingLeft: '64px',
                  cursor: 'pointer'
                }}
                onClick={() => setExpandedNode(expandedNode === index ? null : index)}
                onMouseEnter={() => setHoveredNode(index)}
                onMouseLeave={() => setHoveredNode(null)}
              >
                {/* Era Node Circle */}
                <div style={{ 
                  position: 'absolute', 
                  left: '16px', 
                  top: '8px',
                  width: '16px', 
                  height: '16px', 
                  backgroundColor: node.color, 
                  borderRadius: '50%',
                  border: '3px solid #0D0D0F',
                  transform: hoveredNode === index ? 'scale(1.3)' : 'scale(1)',
                  transition: 'transform 0.2s',
                  zIndex: 2
                }} />
                
                {/* Era Card */}
                <div style={{ 
                  backgroundColor: '#1E1E24', 
                  borderRadius: '12px', 
                  padding: '16px',
                  border: expandedNode === index ? `2px solid ${node.color}` : '1px solid #141419',
                  transition: 'all 0.3s',
                  transform: hoveredNode === index ? 'translateX(4px)' : 'translateX(0)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <h3 style={{ 
                      fontSize: '16px', 
                      fontWeight: 'bold', 
                      color: node.color, 
                      margin: '0' 
                    }}>
                      {node.era}
                    </h3>
                    <span style={{ fontSize: '12px', color: '#6B7280' }}>
                      {node.period}
                    </span>
                  </div>
                  
                  <p style={{ 
                    fontSize: '14px', 
                    color: '#F5F4F2', 
                    margin: '0 0 8px 0', 
                    fontWeight: '500' 
                  }}>
                    {node.meaning}
                  </p>
                  
                  {/* Authors */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '8px' }}>
                    {node.authors.map((author, authorIndex) => (
                      <span 
                        key={authorIndex}
                        style={{ 
                          fontSize: '12px', 
                          backgroundColor: '#141419', 
                          color: '#9CA3AF', 
                          padding: '2px 8px', 
                          borderRadius: '12px' 
                        }}
                      >
                        {author}
                      </span>
                    ))}
                  </div>
                  
                  {/* Confidence Bar */}
                  <div style={{ marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ fontSize: '11px', color: '#6B7280' }}>Confidence</span>
                      <span style={{ fontSize: '11px', color: '#9CA3AF' }}>{node.confidence}%</span>
                    </div>
                    <div style={{ 
                      width: '100%', 
                      height: '4px', 
                      backgroundColor: '#141419', 
                      borderRadius: '2px', 
                      overflow: 'hidden' 
                    }}>
                      <div style={{ 
                        width: `${node.confidence}%`, 
                        height: '100%', 
                        backgroundColor: node.color,
                        transition: 'width 0.5s ease-out'
                      }} />
                    </div>
                  </div>
                  
                  {/* Expand indicator */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '8px' }}>
                    <svg 
                      width="16" 
                      height="16" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      style={{ 
                        transform: expandedNode === index ? 'rotate(180deg)' : 'rotate(0deg)', 
                        transition: 'transform 0.2s' 
                      }}
                    >
                      <path d="M7 10l5 5 5-5" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Details Column */}
        <div style={{ flex: '1' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#F5F4F2', marginBottom: '24px' }}>
            Meaning Evolution
          </h2>
          
          {expandedNode !== null ? (
            <div style={{ 
              backgroundColor: '#1E1E24', 
              borderRadius: '16px', 
              padding: '32px',
              border: `2px solid ${currentConcept.data[expandedNode].color}`,
              animation: 'fadeIn 0.3s ease-out'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                <div style={{ 
                  width: '24px', 
                  height: '24px', 
                  backgroundColor: currentConcept.data[expandedNode].color, 
                  borderRadius: '50%' 
                }} />
                <div>
                  <h3 style={{ 
                    fontSize: '28px', 
                    fontWeight: 'bold', 
                    color: currentConcept.data[expandedNode].color, 
                    margin: '0 0 4px 0' 
                  }}>
                    {currentConcept.data[expandedNode].era} Era
                  </h3>
                  <p style={{ fontSize: '16px', color: '#9CA3AF', margin: '0' }}>
                    {currentConcept.data[expandedNode].period}
                  </p>
                </div>
              </div>
              
              <div style={{ marginBottom: '24px' }}>
                <h4 style={{ fontSize: '18px', fontWeight: '600', color: '#F5F4F2', marginBottom: '12px' }}>
                  Core Meaning
                </h4>
                <p style={{ fontSize: '16px', color: '#E5E5E5', lineHeight: '1.6', margin: '0' }}>
                  {currentConcept.data[expandedNode].meaning}
                </p>
              </div>
              
              <div style={{ marginBottom: '24px' }}>
                <h4 style={{ fontSize: '18px', fontWeight: '600', color: '#F5F4F2', marginBottom: '12px' }}>
                  Historical Evolution
                </h4>
                <p style={{ fontSize: '14px', color: '#D1D5DB', lineHeight: '1.7', margin: '0' }}>
                  {currentConcept.data[expandedNode].evolution}
                </p>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#F5F4F2', marginBottom: '8px' }}>
                    Key Authors
                  </h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {currentConcept.data[expandedNode].authors.map((author, index) => (
                      <span 
                        key={index}
                        style={{ 
                          fontSize: '14px', 
                          backgroundColor: currentConcept.data[expandedNode].color + '20', 
                          color: currentConcept.data[expandedNode].color, 
                          padding: '4px 12px', 
                          borderRadius: '16px',
                          border: `1px solid ${currentConcept.data[expandedNode].color}30`
                        }}
                      >
                        {author}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div style={{ textAlign: 'right' }}>
                  <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#F5F4F2', marginBottom: '8px' }}>
                    Confidence
                  </h4>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: currentConcept.data[expandedNode].color }}>
                    {currentConcept.data[expandedNode].confidence}%
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ 
              backgroundColor: '#1E1E24', 
              borderRadius: '16px', 
              padding: '48px 32px',
              textAlign: 'center',
              border: '1px solid #141419'
            }}>
              <div style={{ 
                width: '64px', 
                height: '64px', 
                backgroundColor: '#141419', 
                borderRadius: '50%', 
                margin: '0 auto 24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2 17l10 5 10-5" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2 12l10 5 10-5" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#F5F4F2', marginBottom: '12px' }}>
                Select an Era
              </h3>
              <p style={{ fontSize: '14px', color: '#9CA3AF', margin: '0' }}>
                Click on any era node in the timeline to explore the detailed evolution of <span style={{ color: '#3B82F6' }}>{selectedConcept}</span> during that historical period.
              </p>
            </div>
          )}
        </div>
      </div>
      
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}