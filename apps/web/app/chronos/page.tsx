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
          meaning: 'Philosophical justice',
          evolution: 'Stoics developed sophisticated theories of natural law and cosmic justice. Justice became harmony with the rational order of the universe, influencing Roman jurisprudence.',
          authors: ['Stoics', 'Cicero'],
          confidence: 87,
          color: '#3B82F6',
          year: -323,
          position: 2
        },
        {
          era: 'Imperial',
          period: '31 BCE-284 CE',
          meaning: 'Roman law, imperial justice',
          evolution: 'Systematized in Roman law and imperial administration. Justice became procedural and institutional, balancing Greek philosophical concepts with Roman practical governance.',
          authors: ['Ulpian', 'Gaius'],
          confidence: 89,
          color: '#DC2626',
          year: -31,
          position: 3
        }
      ]
    },
    'φιλοσοφία': {
      transliteration: 'philosophia',
      modern: 'philosophy',
      data: [
        {
          era: 'Archaic',
          period: '800-500 BCE',
          meaning: 'Love of wisdom',
          evolution: 'Pythagoras coined the term, meaning "love of wisdom" as opposed to claiming to be wise. Early philosophers sought natural explanations for phenomena previously explained by mythology.',
          authors: ['Pythagoras', 'Thales'],
          confidence: 88,
          color: '#D97706',
          year: -600,
          position: 0
        },
        {
          era: 'Classical',
          period: '500-323 BCE',
          meaning: 'Systematic inquiry into reality',
          evolution: 'Became systematic investigation of reality, knowledge, and values. Socratic method, Platonic forms, and Aristotelian categories established philosophical methodology and core problems.',
          authors: ['Socrates', 'Plato', 'Aristotle'],
          confidence: 98,
          color: '#F59E0B',
          year: -500,
          position: 1
        },
        {
          era: 'Hellenistic',
          period: '323-31 BCE',
          meaning: 'Way of life, practical wisdom',
          evolution: 'Transformed into competing schools offering comprehensive ways of life. Philosophy became therapeutic, addressing how to live well and achieve happiness through reason.',
          authors: ['Epicurus', 'Zeno', 'Sextus Empiricus'],
          confidence: 92,
          color: '#3B82F6',
          year: -323,
          position: 2
        },
        {
          era: 'Late Antique',
          period: '284-600 CE',
          meaning: 'Synthesis with theology',
          evolution: 'Integrated with Christian theology. Philosophy became handmaiden to theology, with Neoplatonism providing metaphysical framework for Christian doctrine.',
          authors: ['Plotinus', 'Augustine', 'Pseudo-Dionysius'],
          confidence: 90,
          color: '#7C3AED',
          year: 284,
          position: 3
        }
      ]
    }
  };

  const currentConcept = concepts[selectedConcept];

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#0D0D0F', 
      color: '#F5F4F2' 
    }}>
      {/* Navigation */}
      <nav style={{ 
        backgroundColor: '#1E1E24',
        borderBottom: '1px solid #2D2D35',
        padding: '16px 0'
      }}>
        <div style={{ 
          maxWidth: '1200px', 
          margin: '0 auto', 
          padding: '0 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <Link href="/" style={{
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#C9A227',
              textDecoration: 'none'
            }}>
              LOGOS
            </Link>
            <div style={{ display: 'flex', gap: '24px' }}>
              <Link href="/lexicon" style={{
                color: '#9CA3AF',
                textDecoration: 'none',
                transition: 'color 0.2s'
              }}>Lexicon</Link>
              <Link href="/chronos" style={{
                color: '#C9A227',
                textDecoration: 'none'
              }}>Chronos</Link>
              <Link href="/contextus" style={{
                color: '#9CA3AF',
                textDecoration: 'none',
                transition: 'color 0.2s'
              }}>Contextus</Link>
              <Link href="/apparatus" style={{
                color: '#9CA3AF',
                textDecoration: 'none',
                transition: 'color 0.2s'
              }}>Apparatus</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Header */}
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        padding: '48px 24px 0'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h1 style={{
            fontSize: '48px',
            fontWeight: 'bold',
            color: '#C9A227',
            marginBottom: '16px',
            background: 'linear-gradient(135deg, #C9A227, #E8D5A3)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            CHRONOS
          </h1>
          <p style={{
            fontSize: '20px',
            color: '#9CA3AF',
            maxWidth: '600px',
            margin: '0 auto',
            lineHeight: '1.6'
          }}>
            Trace the evolution of philosophical concepts through time
          </p>
        </div>

        {/* Concept Selector */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center',
          marginBottom: '48px',
          position: 'relative'
        }}>
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              style={{
                backgroundColor: '#1E1E24',
                border: '2px solid #C9A227',
                borderRadius: '12px',
                padding: '16px 24px',
                color: '#F5F4F2',
                fontSize: '18px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                minWidth: '280px',
                justifyContent: 'space-between',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#2D2D35';
                e.currentTarget.style.borderColor = '#E8D5A3';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#1E1E24';
                e.currentTarget.style.borderColor = '#C9A227';
              }}
            >
              <div>
                <span style={{ color: '#C9A227', fontWeight: 'bold' }}>
                  {selectedConcept}
                </span>
                <span style={{ color: '#9CA3AF', marginLeft: '8px' }}>
                  ({currentConcept.transliteration})
                </span>
              </div>
              <svg 
                width="20" 
                height="20" 
                viewBox="0 0 24 24" 
                fill="none" 
                style={{
                  transform: showDropdown ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s'
                }}
              >
                <path 
                  d="M7 10L12 15L17 10" 
                  stroke="#C9A227" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            {showDropdown && (
              <div style={{
                position: 'absolute',
                top: '100%',
                left: '0',
                right: '0',
                backgroundColor: '#1E1E24',
                border: '2px solid #C9A227',
                borderRadius: '12px',
                marginTop: '8px',
                zIndex: 1000,
                overflow: 'hidden'
              }}>
                {Object.entries(concepts).map(([concept, data]) => (
                  <button
                    key={concept}
                    onClick={() => {
                      setSelectedConcept(concept);
                      setShowDropdown(false);
                      setExpandedNode(null);
                    }}
                    style={{
                      width: '100%',
                      padding: '16px 24px',
                      backgroundColor: concept === selectedConcept ? '#2D2D35' : 'transparent',
                      border: 'none',
                      color: '#F5F4F2',
                      textAlign: 'left',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      if (concept !== selectedConcept) {
                        e.currentTarget.style.backgroundColor = '#2D2D35';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (concept !== selectedConcept) {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }
                    }}
                  >
                    <div>
                      <span style={{ color: '#C9A227', fontWeight: 'bold' }}>
                        {concept}
                      </span>
                      <span style={{ color: '#9CA3AF', marginLeft: '8px' }}>
                        ({data.transliteration})
                      </span>
                    </div>
                    <div style={{ color: '#6B7280', fontSize: '14px', marginTop: '4px' }}>
                      {data.modern}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Timeline Container */}
        <div style={{
          backgroundColor: '#1E1E24',
          borderRadius: '16px',
          padding: '48px',
          position: 'relative',
          maxWidth: '800px',
          margin: '0 auto'
        }}>
          {/* Timeline Line */}
          <div style={{
            position: 'absolute',
            left: '80px',
            top: '80px',
            bottom: '80px',
            width: '4px',
            backgroundColor: '#C9A227',
            borderRadius: '2px'
          }}>
            {/* Gradient overlay */}
            <div style={{
              position: 'absolute',
              top: '0',
              left: '0',
              right: '0',
              bottom: '0',
              background: 'linear-gradient(180deg, #C9A227, #E8D5A3)',
              borderRadius: '2px'
            }} />
          </div>

          {/* Era Nodes */}
          {currentConcept.data.map((node, index) => (
            <div
              key={index}
              style={{
                position: 'relative',
                marginBottom: index === currentConcept.data.length - 1 ? '0' : '80px',
                paddingLeft: '120px'
              }}
            >
              {/* Node Circle */}
              <div
                style={{
                  position: 'absolute',
                  left: '62px',
                  top: '24px',
                  width: '36px',
                  height: '36px',
                  backgroundColor: node.color,
                  borderRadius: '50%',
                  border: '4px solid #1E1E24',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  transform: hoveredNode === index ? 'scale(1.2)' : 'scale(1)',
                  boxShadow: expandedNode === index ? `0 0 20px ${node.color}` : 'none',
                  zIndex: 10
                }}
                onClick={() => setExpandedNode(expandedNode === index ? null : index)}
                onMouseEnter={() => setHoveredNode(index)}
                onMouseLeave={() => setHoveredNode(null)}
              >
                <div style={{
                  position: 'absolute',
                  inset: '4px',
                  backgroundColor: node.color,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#0D0D0F',
                  fontSize: '12px',
                  fontWeight: 'bold'
                }}>
                  {index + 1}
                </div>
              </div>

              {/* Era Label */}
              <div style={{
                position: 'absolute',
                left: '-60px',
                top: '0',
                width: '120px',
                textAlign: 'center'
              }}>
                <div style={{
                  fontSize: '14px',
                  fontWeight: 'bold',
                  color: node.color,
                  marginBottom: '4px'
                }}>
                  {node.era}
                </div>
                <div style={{
                  fontSize: '12px',
                  color: '#6B7280'
                }}>
                  {node.period}
                </div>
              </div>

              {/* Content Card */}
              <div style={{
                backgroundColor: '#141419',
                borderRadius: '12px',
                padding: '24px',
                border: `2px solid ${expandedNode === index ? node.color : 'transparent'}`,
                transition: 'all 0.3s',
                cursor: 'pointer',
                transform: hoveredNode === index ? 'translateY(-4px)' : 'translateY(0)'
              }}
              onClick={() => setExpandedNode(expandedNode === index ? null : index)}
              onMouseEnter={() => setHoveredNode(index)}
              onMouseLeave={() => setHoveredNode(null)}
              >
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '16px'
                }}>
                  <h3 style={{
                    color: '#F5F4F2',
                    fontSize: '18px',
                    fontWeight: 'bold',
                    margin: '0'
                  }}>
                    {node.meaning}
                  </h3>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <div style={{
                      fontSize: '12px',
                      color: '#9CA3AF'
                    }}>
                      Confidence
                    </div>
                    <div style={{
                      width: '80px',
                      height: '6px',
                      backgroundColor: '#2D2D35',
                      borderRadius: '3px',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        width: `${node.confidence}%`,
                        height: '100%',
                        backgroundColor: node.color,
                        borderRadius: '3px',
                        transition: 'width 0.3s'
                      }} />
                    </div>
                    <span style={{
                      fontSize: '12px',
                      color: node.color,
                      fontWeight: 'bold'
                    }}>
                      {node.confidence}%
                    </span>
                  </div>
                </div>

                {/* Authors */}
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '8px',
                  marginBottom: expandedNode === index ? '16px' : '0'
                }}>
                  {node.authors.map((author, authorIndex) => (
                    <span
                      key={authorIndex}
                      style={{
                        backgroundColor: '#2D2D35',
                        color: '#C9A227',
                        padding: '4px 8px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: '500'
                      }}
                    >
                      {author}
                    </span>
                  ))}
                </div>

                {/* Expanded Content */}
                {expandedNode === index && (
                  <div style={{
                    borderTop: '1px solid #2D2D35',
                    paddingTop: '16px',
                    animation: 'fadeIn 0.3s ease-in'
                  }}>
                    <h4 style={{
                      color: '#C9A227',
                      fontSize: '14px',
                      fontWeight: 'bold',
                      marginBottom: '12px',
                      margin: '0 0 12px 0'
                    }}>
                      Evolution of Meaning
                    </h4>
                    <p style={{
                      color: '#9CA3AF',
                      lineHeight: '1.6',
                      fontSize: '14px',
                      margin: '0'
                    }}>
                      {node.evolution}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div style={{
          marginTop: '48px',
          backgroundColor: '#1E1E24',
          borderRadius: '16px',
          padding: '32px',
          maxWidth: '800px',
          margin: '48px auto 0'
        }}>
          <h3 style={{
            color: '#C9A227',
            fontSize: '18px',
            fontWeight: 'bold',
            marginBottom: '24px',
            margin: '0 0 24px 0'
          }}>
            Historical Periods
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px'
          }}>
            {[
              { name: 'Archaic', period: '800-500 BCE', color: '#D97706' },
              { name: 'Classical', period: '500-323 BCE', color: '#F59E0B' },
              { name: 'Hellenistic', period: '323-31 BCE', color: '#3B82F6' },
              { name: 'Imperial', period: '31 BCE-284 CE', color: '#DC2626' },
              { name: 'Late Antique', period: '284-600 CE', color: '#7C3AED' },
              { name: 'Byzantine', period: '600-1453 CE', color: '#059669' }
            ].map((era, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px',
                  backgroundColor: '#141419',
                  borderRadius: '8px',
                  transition: 'all 0.2s'
                }}
              >
                <div style={{
                  width: '16px',
                  height: '16px',
                  backgroundColor: era.color,
                  borderRadius: '50%'
                }} />
                <div>
                  <div style={{
                    color: '#F5F4F2',
                    fontSize: '14px',
                    fontWeight: 'bold'
                  }}>
                    {era.name}
                  </div>
                  <div style={{
                    color: '#6B7280',
                    fontSize: '12px'
                  }}>
                    {era.period}
                  </div>
                </div>
              </div>
            ))}
          </div>
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