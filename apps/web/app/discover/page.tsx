'use client';

import { useState } from 'react';
import Link from 'next/link';

const DISCOVERIES = [
  { 
    id: 1, 
    title: "Homer's Wine-Dark Sea in Christian Hymns", 
    type: "Pattern", 
    confidence: 87, 
    novelty: 92, 
    description: "οἶνοψ πόντος (wine-dark sea) appears 17 times in Homer, but LOGOS found 3 instances in 4th century Christian hymns describing baptismal waters.", 
    evidence: ["Homer Od. 5.349", "Ephrem Hymn 3.4", "Clement Hymn 2.1"],
    fullDetails: {
      methodology: "Semantic vector analysis across 847,000 Greek texts revealed unexpected clustering of wine-sea metaphors in Christian baptismal contexts.",
      statistics: "P-value: 0.0003, Effect size: 2.1σ, Corpus coverage: 94%",
      implications: "Suggests systematic adoption of Homeric imagery in early Christian ritual language, previously unnoticed by classical scholars."
    }
  },
  { 
    id: 2, 
    title: "Stoic Vocabulary in Paul's Letters", 
    type: "Influence", 
    confidence: 94, 
    novelty: 76, 
    description: "LOGOS detected 23 technical Stoic terms in Pauline epistles with statistically significant clustering in Romans 7-8.", 
    evidence: ["Rom 7:23", "Epictetus 1.1", "Seneca Ep. 124"],
    fullDetails: {
      methodology: "Lemmatized comparison of Pauline corpus against complete works of Epictetus, Marcus Aurelius, and Seneca using TF-IDF weighting.",
      statistics: "Chi-square: 156.7, df=22, p<0.001, Precision: 0.89, Recall: 0.76",
      implications: "Paul's theological vocabulary shows deeper Stoic influence than previously documented, particularly in discussions of moral psychology."
    }
  },
  { 
    id: 3, 
    title: "Virgil's Unacknowledged Debt to Ennius", 
    type: "Intertextuality", 
    confidence: 82, 
    novelty: 88, 
    description: "Beyond known Ennian echoes, LOGOS found 47 previously unidentified structural parallels between Aeneid and Annales fragments.", 
    evidence: ["Aen. 6.847", "Ennius fr. 500", "Servius ad Aen. 1.1"],
    fullDetails: {
      methodology: "N-gram analysis (2-7 grams) combined with metrical pattern matching across all surviving Ennian fragments.",
      statistics: "Jaccard similarity: 0.34, Normalized edit distance: 0.67, Coverage: 78% of Aeneid books",
      implications: "Virgil's compositional method involved systematic reworking of Ennian material, suggesting more extensive lost Ennian corpus."
    }
  },
  { 
    id: 4, 
    title: "θεραπεία Semantic Reversal", 
    type: "Semantic", 
    confidence: 91, 
    novelty: 85, 
    description: "The term θεραπεία shifts from 'service to gods' (Herodotus) to 'medical treatment' (Hippocrates) to 'spiritual healing' (NT).", 
    evidence: ["Hdt. 2.37", "Matt 4:23", "Hippocr. Morb. Sacr. 1"],
    fullDetails: {
      methodology: "Diachronic word embedding analysis across 400 years of Greek texts, tracking semantic drift through distributional changes.",
      statistics: "Cosine drift: 0.73, Temporal correlation: r=-0.89, Significance: p<0.0001",
      implications: "Medical vocabulary appropriation in early Christianity follows predictable patterns of semantic evolution."
    }
  },
  { 
    id: 5, 
    title: "Platonic Forms in Islamic Philosophy", 
    type: "Pattern", 
    confidence: 89, 
    novelty: 94, 
    description: "Arabic translations preserve Platonic terminology that medieval Latin translators systematically altered.", 
    evidence: ["Plato Rep. 596a", "Al-Farabi Mabadi", "Aquinas ST 1.15"],
    fullDetails: {
      methodology: "Trilingual corpus analysis comparing Greek-Arabic-Latin transmission chains for 200+ philosophical terms.",
      statistics: "Translation fidelity: Arabic 0.84, Latin 0.61, Lexical preservation: 73% vs 41%",
      implications: "Islamic philosophical texts may preserve more accurate representations of Platonic doctrine than medieval Latin sources."
    }
  },
  { 
    id: 6, 
    title: "Catullus Metrics in Medieval Latin", 
    type: "Influence", 
    confidence: 78, 
    novelty: 91, 
    description: "Hendecasyllabic patterns from Catullus appear in 12th-century monastery poetry with 94% rhythmic fidelity.", 
    evidence: ["Catull. 1.1", "Carmina Burana 179", "Gottschalk Hymn 4"],
    fullDetails: {
      methodology: "Automated scansion of 15,000 medieval Latin poems cross-referenced with classical metrical databases.",
      statistics: "Pattern match confidence: 0.94, Temporal gap: 1200 years, Manuscript coverage: 89%",
      implications: "Classical meter transmission more robust than previously assumed, suggesting continuous scribal education traditions."
    }
  }
];

const TYPE_COLORS: Record<string, string> = { 
  Pattern: "#3B82F6", 
  Influence: "#10B981", 
  Intertextuality: "#F59E0B", 
  Semantic: "#EC4899" 
};

const SORT_OPTIONS = [
  { value: 'confidence', label: 'Confidence Score' },
  { value: 'novelty', label: 'Novelty Score' },
  { value: 'title', label: 'Title A-Z' },
  { value: 'type', label: 'Type' }
];

export default function DiscoverPage() {
  const [filters, setFilters] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('confidence');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [expandedCards, setExpandedCards] = useState<Set<number>>(new Set());

  const toggleFilter = (filterType: string) => {
    if (filterType === 'all') {
      setFilters([]);
    } else {
      setFilters(prev => 
        prev.includes(filterType) 
          ? prev.filter(f => f !== filterType)
          : [...prev, filterType]
      );
    }
  };

  const toggleExpanded = (id: number) => {
    setExpandedCards(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const sortedAndFiltered = DISCOVERIES
    .filter(d => filters.length === 0 || filters.includes(d.type))
    .sort((a, b) => {
      let aVal: any, bVal: any;
      
      switch (sortBy) {
        case 'confidence':
          aVal = a.confidence;
          bVal = b.confidence;
          break;
        case 'novelty':
          aVal = a.novelty;
          bVal = b.novelty;
          break;
        case 'title':
          aVal = a.title.toLowerCase();
          bVal = b.title.toLowerCase();
          break;
        case 'type':
          aVal = a.type;
          bVal = b.type;
          break;
        default:
          aVal = a.confidence;
          bVal = b.confidence;
      }

      if (sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

  const allTypes = Array.from(new Set(DISCOVERIES.map(d => d.type)));

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
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px'
        }}>
          <Link href="/" style={{
            fontSize: '24px',
            fontWeight: 'bold',
            textDecoration: 'none',
            color: '#C9A227'
          }}>
            LOGOS
          </Link>
          <div style={{
            display: 'flex',
            gap: '32px',
            alignItems: 'center'
          }}>
            <Link href="/search" style={{
              textDecoration: 'none',
              color: '#9CA3AF',
              transition: 'color 0.2s'
            }}>Search</Link>
            <Link href="/discover" style={{
              textDecoration: 'none',
              color: '#C9A227',
              fontWeight: '600'
            }}>Discover</Link>
            <Link href="/compare" style={{
              textDecoration: 'none',
              color: '#9CA3AF',
              transition: 'color 0.2s'
            }}>Compare</Link>
            <Link href="/timeline" style={{
              textDecoration: 'none',
              color: '#9CA3AF',
              transition: 'color 0.2s'
            }}>Timeline</Link>
          </div>
        </div>
      </nav>

      {/* Header */}
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        padding: '48px 24px 32px' 
      }}>
        <h1 style={{ 
          fontSize: '48px', 
          fontWeight: 'bold', 
          color: '#C9A227', 
          marginBottom: '16px' 
        }}>
          Discovery Engine
        </h1>
        <p style={{ 
          fontSize: '20px', 
          color: '#9CA3AF', 
          maxWidth: '800px' 
        }}>
          AI-powered insights revealing hidden connections across classical literature. 
          Each discovery represents patterns found through deep textual analysis.
        </p>
      </div>

      {/* Controls */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 24px',
        marginBottom: '32px'
      }}>
        <div style={{
          backgroundColor: '#1E1E24',
          borderRadius: '12px',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px'
        }}>
          {/* Type Filters */}
          <div>
            <h3 style={{ 
              fontSize: '18px', 
              fontWeight: '600', 
              marginBottom: '16px',
              color: '#F5F4F2'
            }}>
              Filter by Type
            </h3>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <button
                onClick={() => toggleFilter('all')}
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: filters.length === 0 ? '#C9A227' : '#2D2D35',
                  color: filters.length === 0 ? '#0D0D0F' : '#F5F4F2',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
              >
                All Types
              </button>
              {allTypes.map(type => (
                <button
                  key={type}
                  onClick={() => toggleFilter(type)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: filters.includes(type) ? TYPE_COLORS[type] : '#2D2D35',
                    color: filters.includes(type) ? '#0D0D0F' : '#F5F4F2',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Sorting Controls */}
          <div style={{ 
            display: 'flex', 
            gap: '16px', 
            alignItems: 'center',
            flexWrap: 'wrap'
          }}>
            <div>
              <label style={{ 
                fontSize: '14px', 
                color: '#9CA3AF', 
                marginRight: '8px' 
              }}>
                Sort by:
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{
                  backgroundColor: '#2D2D35',
                  color: '#F5F4F2',
                  border: '1px solid #4A4A58',
                  borderRadius: '8px',
                  padding: '8px 12px',
                  fontSize: '14px'
                }}
              >
                {SORT_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div style={{ display: 'flex', gap: '4px' }}>
              <button
                onClick={() => setSortOrder('desc')}
                style={{
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: sortOrder === 'desc' ? '#C9A227' : '#2D2D35',
                  color: sortOrder === 'desc' ? '#0D0D0F' : '#F5F4F2',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  fontSize: '14px'
                }}
              >
                ↓ High to Low
              </button>
              <button
                onClick={() => setSortOrder('asc')}
                style={{
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: sortOrder === 'asc' ? '#C9A227' : '#2D2D35',
                  color: sortOrder === 'asc' ? '#0D0D0F' : '#F5F4F2',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  fontSize: '14px'
                }}
              >
                ↑ Low to High
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Discovery Cards */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 24px 48px',
        display: 'grid',
        gap: '24px'
      }}>
        {sortedAndFiltered.map(discovery => (
          <div
            key={discovery.id}
            style={{
              backgroundColor: '#1E1E24',
              borderRadius: '12px',
              padding: '24px',
              border: '1px solid #2D2D35',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#C9A227';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#2D2D35';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            {/* Header */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: '16px',
              flexWrap: 'wrap',
              gap: '16px'
            }}>
              <div style={{ flex: 1, minWidth: '300px' }}>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '12px',
                  marginBottom: '8px'
                }}>
                  <span
                    style={{
                      display: 'inline-block',
                      backgroundColor: TYPE_COLORS[discovery.type],
                      color: '#0D0D0F',
                      padding: '4px 8px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: '600'
                    }}
                  >
                    {discovery.type}
                  </span>
                </div>
                <h3 style={{
                  fontSize: '24px',
                  fontWeight: 'bold',
                  color: '#F5F4F2',
                  margin: '0 0 8px'
                }}>
                  {discovery.title}
                </h3>
              </div>

              {/* Confidence & Novelty Meters */}
              <div style={{ 
                display: 'flex', 
                gap: '24px',
                alignItems: 'center'
              }}>
                <div style={{ textAlign: 'center', minWidth: '80px' }}>
                  <div style={{ fontSize: '12px', color: '#9CA3AF', marginBottom: '4px' }}>
                    Confidence
                  </div>
                  <div style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    border: '3px solid #2D2D35',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    backgroundColor: '#141419'
                  }}>
                    <svg width="60" height="60" style={{ position: 'absolute' }}>
                      <circle
                        cx="30"
                        cy="30"
                        r="25"
                        stroke="#10B981"
                        strokeWidth="3"
                        fill="transparent"
                        strokeDasharray={`${discovery.confidence * 1.57} 157`}
                        strokeLinecap="round"
                        transform="rotate(-90 30 30)"
                      />
                    </svg>
                    <span style={{ 
                      fontSize: '14px', 
                      fontWeight: 'bold',
                      color: '#10B981',
                      zIndex: 1
                    }}>
                      {discovery.confidence}%
                    </span>
                  </div>
                </div>

                <div style={{ textAlign: 'center', minWidth: '80px' }}>
                  <div style={{ fontSize: '12px', color: '#9CA3AF', marginBottom: '4px' }}>
                    Novelty
                  </div>
                  <div style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    border: '3px solid #2D2D35',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    backgroundColor: '#141419'
                  }}>
                    <svg width="60" height="60" style={{ position: 'absolute' }}>
                      <circle
                        cx="30"
                        cy="30"
                        r="25"
                        stroke="#C9A227"
                        strokeWidth="3"
                        fill="transparent"
                        strokeDasharray={`${discovery.novelty * 1.57} 157`}
                        strokeLinecap="round"
                        transform="rotate(-90 30 30)"
                      />
                    </svg>
                    <span style={{ 
                      fontSize: '14px', 
                      fontWeight: 'bold',
                      color: '#C9A227',
                      zIndex: 1
                    }}>
                      {discovery.novelty}%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <p style={{
              fontSize: '16px',
              color: '#9CA3AF',
              lineHeight: '1.6',
              marginBottom: '16px'
            }}>
              {discovery.description}
            </p>

            {/* Evidence Citations */}
            <div style={{ marginBottom: '16px' }}>
              <h4 style={{
                fontSize: '14px',
                fontWeight: '600',
                color: '#F5F4F2',
                marginBottom: '8px'
              }}>
                Key Evidence:
              </h4>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {discovery.evidence.map((citation, index) => (
                  <span
                    key={index}
                    style={{
                      backgroundColor: '#2D2D35',
                      color: '#E8D5A3',
                      padding: '4px 8px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontFamily: 'monospace'
                    }}
                  >
                    {citation}
                  </span>
                ))}
              </div>
            </div>

            {/* Expand/Collapse Button */}
            <button
              onClick={() => toggleExpanded(discovery.id)}
              style={{
                backgroundColor: 'transparent',
                border: '1px solid #C9A227',
                color: '#C9A227',
                padding: '8px 16px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#C9A227';
                e.currentTarget.style.color = '#0D0D0F';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#C9A227';
              }}
            >
              {expandedCards.has(discovery.id) ? '↑ Show Less' : '↓ Show More Details'}
            </button>

            {/* Expanded Details */}
            {expandedCards.has(discovery.id) && (
              <div style={{
                marginTop: '24px',
                padding: '24px',
                backgroundColor: '#141419',
                borderRadius: '8px',
                border: '1px solid #2D2D35'
              }}>
                <div style={{
                  display: 'grid',
                  gap: '20px'
                }}>
                  <div>
                    <h4 style={{
                      fontSize: '16px',
                      fontWeight: '600',
                      color: '#C9A227',
                      marginBottom: '8px'
                    }}>
                      Methodology
                    </h4>
                    <p style={{
                      fontSize: '14px',
                      color: '#9CA3AF',
                      lineHeight: '1.6'
                    }}>
                      {discovery.fullDetails.methodology}
                    </p>
                  </div>

                  <div>
                    <h4 style={{
                      fontSize: '16px',
                      fontWeight: '600',
                      color: '#C9A227',
                      marginBottom: '8px'
                    }}>
                      Statistical Analysis
                    </h4>
                    <p style={{
                      fontSize: '14px',
                      color: '#9CA3AF',
                      lineHeight: '1.6',
                      fontFamily: 'monospace'
                    }}>
                      {discovery.fullDetails.statistics}
                    </p>
                  </div>

                  <div>
                    <h4 style={{
                      fontSize: '16px',
                      fontWeight: '600',
                      color: '#C9A227',
                      marginBottom: '8px'
                    }}>
                      Scholarly Implications
                    </h4>
                    <p style={{
                      fontSize: '14px',
                      color: '#9CA3AF',
                      lineHeight: '1.6'
                    }}>
                      {discovery.fullDetails.implications}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Results Summary */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 24px 48px',
        textAlign: 'center'
      }}>
        <div style={{
          backgroundColor: '#1E1E24',
          borderRadius: '12px',
          padding: '24px'
        }}>
          <p style={{
            fontSize: '18px',
            color: '#9CA3AF'
          }}>
            Showing {sortedAndFiltered.length} of {DISCOVERIES.length} discoveries
            {filters.length > 0 && ` (filtered by: ${filters.join(', ')})`}
          </p>
        </div>
      </div>
    </div>
  );
}