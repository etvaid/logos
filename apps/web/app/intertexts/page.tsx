'use client';
import React, { useState } from 'react';
import Link from 'next/link';

const CONNECTIONS = [
  {
    id: 1,
    source: { ref: 'Aeneid 1.1-4', text: 'Arma virumque cano, Troiae qui primus ab oris / Italiam, fato profugus, Laviniaque venit / litora, multum ille et terris iactatus et alto / vi superum saevae memorem Iunonis ob iram', author: 'Virgil', work: 'Aeneid', language: 'latin' },
    target: { ref: 'Iliad 1.1-4', text: 'μῆνιν ἄειδε θεὰ Πηληϊάδεω Ἀχιλῆος / οὐλομένην, ἣ μυρί᾽ Ἀχαιοῖς ἄλγε᾽ ἔθηκε, / πολλὰς δ᾽ ἰφθίμους ψυχὰς Ἄϊδι προΐαψεν / ἡρώων, αὐτοὺς δὲ ἑλώρια τεῦχε κύνεσσιν', author: 'Homer', work: 'Iliad', language: 'greek' },
    type: 'Structural',
    strength: 92,
    description: 'Both epics begin with the traditional invocation formula, establishing the hero and conflict',
    connections: [
      { source: 'Arma virumque', target: 'μῆνιν', type: 'structural', reason: 'Opening theme announcement' },
      { source: 'cano', target: 'ἄειδε', type: 'verbal', reason: 'Imperative of singing/performance' },
      { source: 'qui primus', target: 'Πηληϊάδεω Ἀχιλῆος', type: 'structural', reason: 'Hero identification pattern' }
    ]
  },
  {
    id: 2,
    source: { ref: 'Aeneid 6.847-853', text: 'tu regere imperio populos, Romane, memento / (hae tibi erunt artes), pacique imponere morem, / parcere subiectis et debellare superbos', author: 'Virgil', work: 'Aeneid', language: 'latin' },
    target: { ref: 'Iliad 6.146-149', text: 'οἵη περ φύλλων γενεή, τοίη δὲ καὶ ἀνδρῶν. / φύλλα τὰ μέν τ᾽ ἄνεμος χαμάδις χέει, ἄλλα δέ θ᾽ ὕλη / τηλεθόωσα φύει, ἔαρος δ᾽ ἐπιγίγνεται ὥρη', author: 'Homer', work: 'Iliad', language: 'greek' },
    type: 'Thematic',
    strength: 88,
    description: 'Contrast between Roman imperial destiny and Greek heroic mortality themes',
    connections: [
      { source: 'regere imperio', target: 'φύλλων γενεή', type: 'thematic', reason: 'Power vs transient nature' },
      { source: 'parcere subiectis', target: 'ἄνεμος χαμάδις χέει', type: 'thematic', reason: 'Control vs natural forces' }
    ]
  },
  {
    id: 3,
    source: { ref: 'Metamorphoses 1.1-4', text: 'In nova fert animus mutatas dicere formas / corpora; di, coeptis (nam vos mutastis et illas) / adspirate meis primaque ab origine mundi / ad mea perpetuum deducite tempora carmen', author: 'Ovid', work: 'Metamorphoses', language: 'latin' },
    target: { ref: 'Theogony 1-8', text: 'Μουσάων Ἑλικωνιάδων ἀρχώμεθ᾽ ἀείδειν, / αἳ θ᾽ Ἑλικῶνος ἔχουσιν ὄρος μέγα τε ζάθεόν τε', author: 'Hesiod', work: 'Theogony', language: 'greek' },
    type: 'Verbal',
    strength: 85,
    description: 'Programmatic opening invoking divine aid for cosmogonical narrative',
    connections: [
      { source: 'di, coeptis', target: 'Μουσάων', type: 'verbal', reason: 'Divine invocation formula' },
      { source: 'ab origine mundi', target: 'ἀρχώμεθ᾽ ἀείδειν', type: 'thematic', reason: 'Cosmogonical beginning' }
    ]
  },
  {
    id: 4,
    source: { ref: 'Georgics 4.453-456', text: 'hic vero subitum ac dictu mirabile monstrum / aspiciunt: liquefacta boum per viscera toto / corpore collectus', author: 'Virgil', work: 'Georgics', language: 'latin' },
    target: { ref: 'Works and Days 109-120', text: 'χρύσεον μὲν πρώτιστα γένος μερόπων ἀνθρώπων / ἀθάνατοι ποίησαν Ὀλύμπια δώματ᾽ ἔχοντες', author: 'Hesiod', work: 'Works and Days', language: 'greek' },
    type: 'Structural',
    strength: 76,
    description: 'Agricultural wisdom tradition with divine intervention themes',
    connections: [
      { source: 'mirabile monstrum', target: 'χρύσεον γένος', type: 'thematic', reason: 'Miraculous origins and divine creation' }
    ]
  },
  {
    id: 5,
    source: { ref: 'Eclogues 4.4-7', text: 'Ultima Cumaei venit iam carminis aetas; / magnus ab integro saeclorum nascitur ordo', author: 'Virgil', work: 'Eclogues', language: 'latin' },
    target: { ref: 'Pindar Olympian 1.1-4', text: 'Ἄριστον μὲν ὕδωρ, ὁ δὲ χρυσὸς αἰθόμενον πῦρ / ἅτε διαπρέπει νυκτὶ μεγάνορος ἔξοχα πλούτου', author: 'Pindar', work: 'Olympian 1', language: 'greek' },
    type: 'Thematic',
    strength: 71,
    description: 'Golden age imagery and supreme excellence themes',
    connections: [
      { source: 'magnus ordo', target: 'Ἄριστον', type: 'thematic', reason: 'Supreme order and excellence' }
    ]
  }
];

export default function IntertextsPage() {
  const [selectedConnection, setSelectedConnection] = useState(CONNECTIONS[0]);
  const [displayMode, setDisplayMode] = useState('parallel');
  const [showAnalysis, setShowAnalysis] = useState(true);
  const [sortBy, setSortBy] = useState('strength');
  const [filterType, setFilterType] = useState('all');
  const [highlightedConnection, setHighlightedConnection] = useState<number | null>(null);

  const getStrengthColor = (strength: number) => {
    if (strength >= 90) return '#10B981';
    if (strength >= 80) return '#C9A227';
    if (strength >= 70) return '#F59E0B';
    return '#6B7280';
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Structural': return '#3B82F6';
      case 'Thematic': return '#8B5CF6';
      case 'Verbal': return '#10B981';
      default: return '#6B7280';
    }
  };

  const sortedConnections = [...CONNECTIONS].sort((a, b) => {
    if (sortBy === 'strength') return b.strength - a.strength;
    if (sortBy === 'type') return a.type.localeCompare(b.type);
    return 0;
  });

  const filteredConnections = sortedConnections.filter(conn => 
    filterType === 'all' || conn.type === filterType
  );

  const highlightText = (text: string, connections: any[], isSource: boolean) => {
    if (!connections || connections.length === 0) return text;
    
    let result = text;
    connections.forEach((conn, index) => {
      const phrase = isSource ? conn.source : conn.target;
      if (phrase && text.includes(phrase)) {
        const color = highlightedConnection === index ? '#C9A227' : '#E8D5A3';
        result = result.replace(
          phrase,
          `<span style="background-color: ${color}; color: #0D0D0F; padding: 2px 4px; border-radius: 4px;">${phrase}</span>`
        );
      }
    });
    return result;
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0D0D0F', color: '#F5F4F2' }}>
      {/* Navigation */}
      <nav style={{ 
        borderBottom: '1px solid #1E1E24', 
        backgroundColor: '#0D0D0F',
        position: 'sticky',
        top: 0,
        zIndex: 50
      }}>
        <div style={{ 
          maxWidth: '1200px', 
          margin: '0 auto', 
          padding: '16px 24px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between' 
        }}>
          <Link href="/" style={{ 
            fontSize: '24px', 
            fontWeight: 'bold', 
            color: '#C9A227', 
            textDecoration: 'none',
            transition: 'color 0.2s'
          }}>
            LOGOS
          </Link>
          <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
            <Link href="/texts" style={{ color: '#F5F4F2', textDecoration: 'none', transition: 'color 0.2s' }}>Texts</Link>
            <Link href="/intertexts" style={{ color: '#C9A227', textDecoration: 'none' }}>Intertexts</Link>
            <Link href="/timelines" style={{ color: '#F5F4F2', textDecoration: 'none', transition: 'color 0.2s' }}>Timelines</Link>
            <Link href="/analysis" style={{ color: '#F5F4F2', textDecoration: 'none', transition: 'color 0.2s' }}>Analysis</Link>
          </div>
        </div>
      </nav>

      {/* Header */}
      <div style={{ 
        backgroundColor: '#141419', 
        borderBottom: '1px solid #1E1E24',
        padding: '48px 0'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
          <h1 style={{ 
            fontSize: '48px', 
            fontWeight: 'bold', 
            marginBottom: '16px',
            background: 'linear-gradient(135deg, #C9A227, #E8D5A3)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Intertextuality
          </h1>
          <p style={{ 
            fontSize: '18px', 
            color: '#9CA3AF', 
            maxWidth: '600px', 
            lineHeight: '1.6' 
          }}>
            Explore textual connections and relationships across classical literature through parallel comparison and detailed analysis
          </p>
        </div>
      </div>

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '32px 24px' }}>
        {/* Controls */}
        <div style={{ 
          display: 'flex', 
          gap: '24px', 
          marginBottom: '32px',
          flexWrap: 'wrap',
          alignItems: 'center'
        }}>
          {/* Display Mode */}
          <div style={{ display: 'flex', gap: '8px' }}>
            {['parallel', 'stacked'].map(mode => (
              <button
                key={mode}
                onClick={() => setDisplayMode(mode)}
                style={{
                  padding: '8px 16px',
                  backgroundColor: displayMode === mode ? '#C9A227' : '#1E1E24',
                  color: displayMode === mode ? '#0D0D0F' : '#F5F4F2',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  textTransform: 'capitalize'
                }}
                onMouseEnter={(e) => {
                  if (displayMode !== mode) {
                    e.target.style.backgroundColor = '#2A2A30';
                  }
                }}
                onMouseLeave={(e) => {
                  if (displayMode !== mode) {
                    e.target.style.backgroundColor = '#1E1E24';
                  }
                }}
              >
                {mode}
              </button>
            ))}
          </div>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{
              padding: '8px 12px',
              backgroundColor: '#1E1E24',
              color: '#F5F4F2',
              border: '1px solid #2A2A30',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            <option value="strength">Sort by Strength</option>
            <option value="type">Sort by Type</option>
          </select>

          {/* Filter Type */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            style={{
              padding: '8px 12px',
              backgroundColor: '#1E1E24',
              color: '#F5F4F2',
              border: '1px solid #2A2A30',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            <option value="all">All Types</option>
            <option value="Structural">Structural</option>
            <option value="Thematic">Thematic</option>
            <option value="Verbal">Verbal</option>
          </select>

          {/* Toggle Analysis */}
          <button
            onClick={() => setShowAnalysis(!showAnalysis)}
            style={{
              padding: '8px 16px',
              backgroundColor: showAnalysis ? '#C9A227' : '#1E1E24',
              color: showAnalysis ? '#0D0D0F' : '#F5F4F2',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            {showAnalysis ? 'Hide' : 'Show'} Analysis
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '32px' }}>
          {/* Connection List */}
          <div style={{ 
            backgroundColor: '#1E1E24', 
            borderRadius: '12px', 
            padding: '24px',
            height: 'fit-content'
          }}>
            <h3 style={{ 
              fontSize: '18px', 
              fontWeight: 'bold', 
              marginBottom: '16px',
              color: '#C9A227'
            }}>
              Connections ({filteredConnections.length})
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {filteredConnections.map(connection => (
                <div
                  key={connection.id}
                  onClick={() => setSelectedConnection(connection)}
                  style={{
                    padding: '16px',
                    backgroundColor: selectedConnection.id === connection.id ? '#2A2A30' : '#141419',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    border: selectedConnection.id === connection.id ? '2px solid #C9A227' : '2px solid transparent'
                  }}
                  onMouseEnter={(e) => {
                    if (selectedConnection.id !== connection.id) {
                      e.target.style.backgroundColor = '#252529';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedConnection.id !== connection.id) {
                      e.target.style.backgroundColor = '#141419';
                    }
                  }}
                >
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    marginBottom: '8px'
                  }}>
                    <span style={{
                      padding: '4px 8px',
                      backgroundColor: getTypeColor(connection.type),
                      color: '#F5F4F2',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: '500'
                    }}>
                      {connection.type}
                    </span>
                    <span style={{
                      color: getStrengthColor(connection.strength),
                      fontWeight: 'bold',
                      fontSize: '14px'
                    }}>
                      {connection.strength}%
                    </span>
                  </div>
                  <div style={{ fontSize: '14px', color: '#9CA3AF', marginBottom: '4px' }}>
                    {connection.source.work} → {connection.target.work}
                  </div>
                  <div style={{ fontSize: '12px', color: '#6B7280' }}>
                    {connection.source.ref} ↔ {connection.target.ref}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Main Comparison Area */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Connection Header */}
            <div style={{ 
              backgroundColor: '#1E1E24', 
              borderRadius: '12px', 
              padding: '24px' 
            }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: '16px'
              }}>
                <h2 style={{ 
                  fontSize: '24px', 
                  fontWeight: 'bold',
                  color: '#F5F4F2'
                }}>
                  Connection Analysis
                </h2>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                  <span style={{
                    padding: '6px 12px',
                    backgroundColor: getTypeColor(selectedConnection.type),
                    color: '#F5F4F2',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}>
                    {selectedConnection.type}
                  </span>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '8px' 
                  }}>
                    <span style={{ color: '#9CA3AF', fontSize: '14px' }}>Strength:</span>
                    <div style={{ 
                      width: '100px', 
                      height: '8px', 
                      backgroundColor: '#2A2A30', 
                      borderRadius: '4px',
                      overflow: 'hidden'
                    }}>
                      <div style={{ 
                        width: `${selectedConnection.strength}%`, 
                        height: '100%', 
                        backgroundColor: getStrengthColor(selectedConnection.strength),
                        transition: 'width 0.3s'
                      }} />
                    </div>
                    <span style={{
                      color: getStrengthColor(selectedConnection.strength),
                      fontWeight: 'bold',
                      fontSize: '14px'
                    }}>
                      {selectedConnection.strength}%
                    </span>
                  </div>
                </div>
              </div>
              <p style={{ 
                color: '#9CA3AF', 
                lineHeight: '1.6',
                fontSize: '16px'
              }}>
                {selectedConnection.description}
              </p>
            </div>

            {/* Passage Comparison */}
            <div style={{
              display: displayMode === 'parallel' ? 'grid' : 'flex',
              gridTemplateColumns: displayMode === 'parallel' ? '1fr 1fr' : 'none',
              flexDirection: displayMode === 'stacked' ? 'column' : 'row',
              gap: '24px'
            }}>
              {/* Source Passage */}
              <div style={{ 
                backgroundColor: '#1E1E24', 
                borderRadius: '12px', 
                padding: '24px',
                border: '2px solid #DC2626'
              }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  marginBottom: '16px'
                }}>
                  <h3 style={{ 
                    fontSize: '18px', 
                    fontWeight: 'bold',
                    color: '#DC2626'
                  }}>
                    Source (Latin)
                  </h3>
                  <span style={{
                    backgroundColor: '#DC2626',
                    color: '#F5F4F2',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: '500'
                  }}>
                    {selectedConnection.source.language.toUpperCase()}
                  </span>
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ color: '#9CA3AF', fontSize: '14px', marginBottom: '8px' }}>
                    {selectedConnection.source.author}, <em>{selectedConnection.source.work}</em> {selectedConnection.source.ref}
                  </div>
                  <div 
                    style={{ 
                      fontSize: '16px', 
                      lineHeight: '1.8',
                      color: '#F5F4F2',
                      fontStyle: 'italic'
                    }}
                    dangerouslySetInnerHTML={{
                      __html: highlightText(
                        selectedConnection.source.text,
                        selectedConnection.connections,
                        true
                      )
                    }}
                  />
                </div>
              </div>

              {/* Target Passage */}
              <div style={{ 
                backgroundColor: '#1E1E24', 
                borderRadius: '12px', 
                padding: '24px',
                border: '2px solid #3B82F6'
              }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  marginBottom: '16px'
                }}>
                  <h3 style={{ 
                    fontSize: '18px', 
                    fontWeight: 'bold',
                    color: '#3B82F6'
                  }}>
                    Target (Greek)
                  </h3>
                  <span style={{
                    backgroundColor: '#3B82F6',
                    color: '#F5F4F2',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: '500'
                  }}>
                    {selectedConnection.target.language.toUpperCase()}
                  </span>
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ color: '#9CA3AF', fontSize: '14px', marginBottom: '8px' }}>
                    {selectedConnection.target.author}, <em>{selectedConnection.target.work}</em> {selectedConnection.target.ref}
                  </div>
                  <div 
                    style={{ 
                      fontSize: '16px', 
                      lineHeight: '1.8',
                      color: '#F5F4F2',
                      fontStyle: 'italic'
                    }}
                    dangerouslySetInnerHTML={{
                      __html: highlightText(
                        selectedConnection.target.text,
                        selectedConnection.connections,
                        false
                      )
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Detailed Analysis */}
            {showAnalysis && (
              <div style={{ 
                backgroundColor: '#1E1E24', 
                borderRadius: '12px', 
                padding: '24px' 
              }}>
                <h3 style={{ 
                  fontSize: '20px', 
                  fontWeight: 'bold', 
                  marginBottom: '16px',
                  color: '#C9A227'
                }}>
                  Detailed Connections
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {selectedConnection.connections.map((conn, index) => (
                    <div
                      key={index}
                      onMouseEnter={() => setHighlightedConnection(index)}
                      onMouseLeave={() => setHighlightedConnection(null)}
                      style={{
                        padding: '16px',
                        backgroundColor: highlightedConnection === index ? '#2A2A30' : '#141419',
                        borderRadius: '8px',
                        transition: 'all 0.2s',
                        cursor: 'pointer',
                        border: highlightedConnection === index ? '1px solid #C9A227' : '1px solid transparent'
                      }}
                    >
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        marginBottom: '8px'
                      }}>
                        <span style={{
                          padding: '4px 8px',
                          backgroundColor: getTypeColor(conn.type),
                          color: '#F5F4F2',
                          borderRadius: '4px',
                          fontSize: '12px',
                          fontWeight: '500',
                          textTransform: 'capitalize'
                        }}>
                          {conn.type}
                        </span>
                      </div>
                      <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: '1fr auto 1fr', 
                        gap: '16px',
                        alignItems: 'center',
                        marginBottom: '12px'
                      }}>
                        <div style={{ 
                          padding: '8px 12px', 
                          backgroundColor: '#DC2626', 
                          borderRadius: '6px',
                          color: '#F5F4F2',
                          fontSize: '14px',
                          fontWeight: '500',
                          textAlign: 'center'
                        }}>
                          "{conn.source}"
                        </div>
                        <div style={{ 
                          color: '#9CA3AF', 
                          fontSize: '20px',
                          textAlign: 'center'
                        }}>
                          ↔
                        </div>
                        <div style={{ 
                          padding: '8px 12px', 
                          backgroundColor: '#3B82F6', 
                          borderRadius: '6px',
                          color: '#F5F4F2',
                          fontSize: '14px',
                          fontWeight: '500',
                          textAlign: 'center'
                        }}>
                          "{conn.target}"
                        </div>
                      </div>
                      <p style={{ 
                        color: '#9CA3AF', 
                        fontSize: '14px',
                        lineHeight: '1.5'
                      }}>
                        {conn.reason}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}