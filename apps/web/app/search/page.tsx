'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';

const PASSAGES = [
  { id: 1, author: "Homer", work: "Iliad", book: "1.1-5", text: "Μῆνιν ἄειδε θεὰ Πηληϊάδεω Ἀχιλῆος οὐλομένην, ἣ μυρί᾽ Ἀχαιοῖς ἄλγε᾽ ἔθηκε", translation: "Sing, O goddess, the anger of Achilles son of Peleus, that brought countless ills upon the Achaeans", era: "archaic", language: "greek", topics: ["epic", "war", "heroism"], manuscript: "Venetus A", variants: ["Μῆνιν: μῆνις codd. alii", "οὐλομένην: ὀλομένην Zen.", "ἄλγε᾽: ἄλγεα rec."], lemma: ["Μῆνις", "ἄειδω", "θεός"], embeddings: [0.8, 0.6, 0.9], semanticDrift: ["wrath→anger", "sing→hymn"] },
  { id: 2, author: "Homer", work: "Odyssey", book: "1.1-4", text: "Ἄνδρα μοι ἔννεπε, μοῦσα, πολύτροπον, ὃς μάλα πολλὰ πλάγχθη", translation: "Tell me, O muse, of that ingenious hero who traveled far and wide after he had sacked Troy", era: "archaic", language: "greek", topics: ["epic", "journey", "heroism"], manuscript: "Laurentianus", variants: ["πολύτροπον: πολύφρονα sch.", "πλάγχθη: πλανήθη A"], lemma: ["ἀνήρ", "ἔννεπω", "πολύτροπος"], embeddings: [0.9, 0.7, 0.8], semanticDrift: ["man→hero", "tell→sing"] },
  { id: 3, author: "Plato", work: "Republic", book: "514a", text: "Μετὰ ταῦτα δή, εἶπον, ἀπείκασον τοιούτῳ πάθει τὴν ἡμετέραν φύσιν παιδείας τε πέρι καὶ ἀπαιδευσίας", translation: "Next, I said, compare our nature in respect of education and its lack to such an experience as this", era: "classical", language: "greek", topics: ["philosophy", "education", "allegory"], manuscript: "Parisinus gr. 1807", variants: ["ἀπείκασον: εἴκασον A", "πάθει: παθήματι B"], lemma: ["ἀπεικάζω", "φύσις", "παιδεία"], embeddings: [0.7, 0.8, 0.9], semanticDrift: ["nature→essence", "education→culture"] },
  { id: 4, author: "Plato", work: "Apology", book: "21d", text: "ἓν οἶδα ὅτι οὐδὲν οἶδα. τοῦτο γάρ που καὶ πρὸς τὸν θεὸν ἁμαρτάνειν ἂν εἴη", translation: "I know one thing: that I know nothing. For this would perhaps be sinning against the god", era: "classical", language: "greek", topics: ["philosophy", "wisdom", "knowledge"], manuscript: "Bodleianus", variants: ["οὐδὲν: οὐδέν τι B", "ἁμαρτάνειν: ἁμαρτεῖν T"], lemma: ["οἶδα", "οὐδείς", "θεός"], embeddings: [0.9, 0.6, 0.7], semanticDrift: ["know→understand", "god→divine"] },
  { id: 5, author: "Aristotle", work: "Nicomachean Ethics", book: "1094a", text: "Πᾶσα τέχνη καὶ πᾶσα μέθοδος, ὁμοίως δὲ πρᾶξίς τε καὶ προαίρεσις, ἀγαθοῦ τινὸς ἐφίεσθαι δοκεῖ", translation: "Every art and every inquiry, and similarly every action and pursuit, is thought to aim at some good", era: "classical", language: "greek", topics: ["philosophy", "ethics", "virtue"], manuscript: "Laurentianus", variants: ["ὁμοίως: ὁμοίως om. K", "ἐφίεσθαι: ἐφιέμενα L"], lemma: ["τέχνη", "μέθοδος", "ἀγαθός"], embeddings: [0.8, 0.7, 0.9], semanticDrift: ["art→skill", "good→virtue"] },
  { id: 6, author: "Virgil", work: "Aeneid", book: "1.1-4", text: "Arma virumque cano, Troiae qui primus ab oris Italiam, fato profugus, Laviniaque venit litora", translation: "I sing of arms and the man, who first from the shores of Troy, exiled by fate, came to Italy and the Lavinian shores", era: "imperial", language: "latin", topics: ["epic", "war", "founding"], manuscript: "Mediceus", variants: ["Laviniaque: Lavinia quoque γ", "profugus: perfugus P"], lemma: ["arma", "vir", "cano"], embeddings: [0.9, 0.8, 0.7], semanticDrift: ["arms→warfare", "man→hero"] },
  { id: 7, author: "Cicero", work: "In Catilinam", book: "1.1", text: "Quo usque tandem abutere, Catilina, patientia nostra? quam diu etiam furor iste tuus nos eludet?", translation: "How long, O Catiline, will you abuse our patience? How long will that frenzy of yours mock us?", era: "imperial", language: "latin", topics: ["rhetoric", "politics", "oratory"], manuscript: "Palatinus", variants: ["abutere: abuteris P", "furor: fervor F"], lemma: ["abutor", "patientia", "furor"], embeddings: [0.7, 0.6, 0.8], semanticDrift: ["abuse→misuse", "patience→tolerance"] },
  { id: 8, author: "Seneca", work: "Epistulae", book: "1.1", text: "Ita fac, mi Lucili: vindica te tibi, et tempus quod adhuc aut auferebatur aut subripiebatur aut excidebat collige et serva", translation: "Do this, my dear Lucilius: claim yourself for yourself, and time that has until now been taken away, stolen, or lost, gather and preserve", era: "imperial", language: "latin", topics: ["philosophy", "stoicism", "ethics"], manuscript: "Quirinianus", variants: ["adhuc: ad huc Q", "serva: conserva C"], lemma: ["vindico", "tempus", "colligo"], embeddings: [0.8, 0.9, 0.7], semanticDrift: ["claim→assert", "time→moment"] },
  { id: 9, author: "Augustine", work: "Confessiones", book: "1.1", text: "Magnus es, Domine, et laudabilis valde: magna virtus tua, et sapientiae tuae non est numerus", translation: "Great are you, O Lord, and greatly to be praised; great is your power, and of your wisdom there is no measure", era: "lateAntique", language: "latin", topics: ["theology", "confession", "Christianity"], manuscript: "Sessorianus", variants: ["laudabilis: laudandus S", "numerus: terminus T"], lemma: ["magnus", "virtus", "sapientia"], embeddings: [0.9, 0.8, 0.9], semanticDrift: ["great→magnificent", "wisdom→knowledge"] },
  { id: 10, author: "Sophocles", work: "Antigone", book: "332", text: "Πολλὰ τὰ δεινὰ κοὐδὲν ἀνθρώπου δεινότερον πέλει. τοῦτο καὶ πολιοῦ πέραν πόντου", translation: "Many wonders there are, but none more wondrous than man. This being crosses even the gray sea", era: "classical", language: "greek", topics: ["tragedy", "human nature", "wonder"], manuscript: "Laurentianus", variants: ["δεινὰ: δεινότερα L", "πέλει: ἔφυ Brunck"], lemma: ["πολύς", "δεινός", "ἄνθρωπος"], embeddings: [0.6, 0.9, 0.8], semanticDrift: ["wonder→terrible", "man→mortal"] },
  { id: 11, author: "Euripides", work: "Medea", book: "214", text: "ἀλλ᾽ οὐ ταὐτὸν ἀνδράσιν τε καὶ γυναιξὶ κεῖται νόμος", translation: "But the same law does not apply to men and women", era: "classical", language: "greek", topics: ["tragedy", "gender", "justice"], manuscript: "Palatinus", variants: ["ταὐτὸν: τὸ αὐτὸ P", "κεῖται: τίθεται T"], lemma: ["αὐτός", "ἀνήρ", "νόμος"], embeddings: [0.7, 0.8, 0.6], semanticDrift: ["law→custom", "apply→lie"] }
];

const ERA_COLORS = {
  archaic: '#D97706',
  classical: '#F59E0B',
  hellenistic: '#3B82F6',
  imperial: '#DC2626',
  lateAntique: '#7C3AED',
  byzantine: '#059669'
};

const ERA_LABELS = {
  archaic: 'Archaic (800-500 BCE)',
  classical: 'Classical (500-323 BCE)',
  hellenistic: 'Hellenistic (323-31 BCE)',
  imperial: 'Imperial (31 BCE-284 CE)',
  lateAntique: 'Late Antique (284-600 CE)',
  byzantine: 'Byzantine (600-1453 CE)'
};

export default function PassageAnalysis() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('all');
  const [selectedEra, setSelectedEra] = useState('all');
  const [selectedTopic, setSelectedTopic] = useState('all');
  const [expandedPassage, setExpandedPassage] = useState(null);
  const [animatingPassages, setAnimatingPassages] = useState(new Set());
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('author');
  const [showAnalytics, setShowAnalytics] = useState(false);

  const allTopics = useMemo(() => {
    const topics = new Set();
    PASSAGES.forEach(passage => {
      passage.topics.forEach(topic => topics.add(topic));
    });
    return Array.from(topics).sort();
  }, []);

  const filteredPassages = useMemo(() => {
    let filtered = PASSAGES.filter(passage => {
      const matchesSearch = !searchQuery || 
        passage.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
        passage.translation.toLowerCase().includes(searchQuery.toLowerCase()) ||
        passage.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        passage.work.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesLanguage = selectedLanguage === 'all' || passage.language === selectedLanguage;
      const matchesEra = selectedEra === 'all' || passage.era === selectedEra;
      const matchesTopic = selectedTopic === 'all' || passage.topics.includes(selectedTopic);
      
      return matchesSearch && matchesLanguage && matchesEra && matchesTopic;
    });

    // Sort passages
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'author':
          return a.author.localeCompare(b.author);
        case 'era':
          const eraOrder = ['archaic', 'classical', 'hellenistic', 'imperial', 'lateAntique', 'byzantine'];
          return eraOrder.indexOf(a.era) - eraOrder.indexOf(b.era);
        case 'language':
          return a.language.localeCompare(b.language);
        default:
          return 0;
      }
    });

    return filtered;
  }, [searchQuery, selectedLanguage, selectedEra, selectedTopic, sortBy]);

  const handlePassageClick = useCallback((passageId) => {
    setAnimatingPassages(prev => new Set([...prev, passageId]));
    setTimeout(() => {
      setExpandedPassage(expandedPassage === passageId ? null : passageId);
      setAnimatingPassages(prev => {
        const next = new Set(prev);
        next.delete(passageId);
        return next;
      });
    }, 150);
  }, [expandedPassage]);

  const getEraData = useMemo(() => {
    const eraCount = {};
    PASSAGES.forEach(passage => {
      eraCount[passage.era] = (eraCount[passage.era] || 0) + 1;
    });
    return Object.entries(eraCount).map(([era, count]) => ({
      era,
      count,
      color: ERA_COLORS[era],
      label: ERA_LABELS[era]
    }));
  }, []);

  const getLanguageData = useMemo(() => {
    const langCount = { greek: 0, latin: 0 };
    PASSAGES.forEach(passage => {
      langCount[passage.language]++;
    });
    return [
      { language: 'Greek', count: langCount.greek, color: '#3B82F6' },
      { language: 'Latin', count: langCount.latin, color: '#DC2626' }
    ];
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0D0D0F',
      color: '#F5F4F2',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #1E1E24 0%, #141419 100%)',
        borderBottom: '1px solid #2A2A32',
        padding: '2rem 0',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backdropFilter: 'blur(10px)'
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '0 2rem'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1.5rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{
                width: '48px',
                height: '48px',
                background: 'linear-gradient(135deg, #C9A227 0%, #F4D03F 100%)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                fontWeight: 'bold',
                color: '#0D0D0F',
                boxShadow: '0 8px 32px rgba(201, 162, 39, 0.3)'
              }}>
                📜
              </div>
              <div>
                <h1 style={{
                  fontSize: '2rem',
                  fontWeight: '700',
                  margin: 0,
                  background: 'linear-gradient(135deg, #C9A227 0%, #F4D03F 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>
                  Passage Analysis
                </h1>
                <p style={{
                  margin: 0,
                  color: '#9CA3AF',
                  fontSize: '0.875rem'
                }}>
                  Explore {PASSAGES.length} classical passages with advanced analytics
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                onClick={() => setShowAnalytics(!showAnalytics)}
                style={{
                  padding: '0.75rem 1rem',
                  backgroundColor: showAnalytics ? '#C9A227' : '#1E1E24',
                  color: showAnalytics ? '#0D0D0F' : '#F5F4F2',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                📊 Analytics
              </button>
              <div style={{
                display: 'flex',
                backgroundColor: '#1E1E24',
                borderRadius: '8px',
                padding: '2px'
              }}>
                <button
                  onClick={() => setViewMode('grid')}
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: viewMode === 'grid' ? '#C9A227' : 'transparent',
                    color: viewMode === 'grid' ? '#0D0D0F' : '#9CA3AF',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  Grid
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: viewMode === 'list' ? '#C9A227' : 'transparent',
                    color: viewMode === 'list' ? '#0D0D0F' : '#9CA3AF',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  List
                </button>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem'
          }}>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                placeholder="Search passages, authors, works..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem 0.75rem 2.5rem',
                  backgroundColor: '#141419',
                  border: '1px solid #2A2A32',
                  borderRadius: '8px',
                  color: '#F5F4F2',
                  fontSize: '0.875rem',
                  outline: 'none',
                  transition: 'all 0.2s ease',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => e.target.style.borderColor = '#C9A227'}
                onBlur={(e) => e.target.style.borderColor = '#2A2A32'}
              />
              <div style={{
                position: 'absolute',
                left: '0.75rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#6B7280',
                fontSize: '1rem'
              }}>
                🔍
              </div>
            </div>

            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              style={{
                padding: '0.75rem 1rem',
                backgroundColor: '#141419',
                border: '1px solid #2A2A32',
                borderRadius: '8px',
                color: '#F5F4F2',
                fontSize: '0.875rem',
                cursor: 'pointer',
                outline: 'none'
              }}
            >
              <option value="all">All Languages</option>
              <option value="greek">Greek</option>
              <option value="latin">Latin</option>
            </select>

            <select
              value={selectedEra}
              onChange={(e) => setSelectedEra(e.target.value)}
              style={{
                padding: '0.75rem 1rem',
                backgroundColor: '#141419',
                border: '1px solid #2A2A32',
                borderRadius: '8px',
                color: '#F5F4F2',
                fontSize: '0.875rem',
                cursor: 'pointer',
                outline: 'none'
              }}
            >
              <option value="all">All Eras</option>
              {Object.entries(ERA_LABELS).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>

            <select
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              style={{
                padding: '0.75rem 1rem',
                backgroundColor: '#141419',
                border: '1px solid #2A2A32',
                borderRadius: '8px',
                color: '#F5F4F2',
                fontSize: '0.875rem',
                cursor: 'pointer',
                outline: 'none'
              }}
            >
              <option value="all">All Topics</option>
              {allTopics.map(topic => (
                <option key={topic} value={topic}>{topic}</option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                padding: '0.75rem 1rem',
                backgroundColor: '#141419',
                border: '1px solid #2A2A32',
                borderRadius: '8px',
                color: '#F5F4F2',
                fontSize: '0.875rem',
                cursor: 'pointer',
                outline: 'none'
              }}
            >
              <option value="author">Sort by Author</option>
              <option value="era">Sort by Era</option>
              <option value="language">Sort by Language</option>
            </select>
          </div>
        </div>
      </div>

      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '2rem'
      }}>
        {/* Analytics Panel */}
        {showAnalytics && (
          <div style={{
            marginBottom: '2rem',
            padding: '2rem',
            backgroundColor: '#1E1E24',
            borderRadius: '16px',
            border: '1px solid #2A2A32',
            transform: showAnalytics ? 'translateY(0)' : 'translateY(-20px)',
            opacity: showAnalytics ? 1 : 0,
            transition: 'all 0.3s ease'
          }}>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: '600',
              marginBottom: '1.5rem',
              color: '#F5F4F2'
            }}>
              Collection Analytics
            </h2>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '2rem'
            }}>
              {/* Era Distribution */}
              <div style={{
                backgroundColor: '#141419',
                padding: '1.5rem',
                borderRadius: '12px',
                border: '1px solid #2A2A32'
              }}>
                <h3 style={{
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  marginBottom: '1rem',
                  color: '#F5F4F2'
                }}>
                  Era Distribution
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {getEraData.map(({ era, count, color, label }) => (
                    <div key={era} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{
                        width: '16px',
                        height: '16px',
                        backgroundColor: color,
                        borderRadius: '4px'
                      }}></div>
                      <div style={{ flex: 1 }}>
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginBottom: '0.25rem'
                        }}>
                          <span style={{ fontSize: '0.875rem', color: '#F5F4F2' }}>{label}</span>
                          <span style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>{count}</span>
                        </div>
                        <div style={{
                          height: '4px',
                          backgroundColor: '#2A2A32',
                          borderRadius: '2px',
                          overflow: 'hidden'
                        }}>
                          <div style={{
                            height: '100%',
                            backgroundColor: color,
                            width: `${(count / PASSAGES.length) * 100}%`,
                            transition: 'width 0.3s ease'
                          }}></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Language Distribution */}
              <div style={{
                backgroundColor: '#141419',
                padding: '1.5rem',
                borderRadius: '12px',
                border: '1px solid #2A2A32'
              }}>
                <h3 style={{
                  fontSize: '1.125rem',
                  fontWeight: '600',
                  marginBottom: '1rem',
                  color: '#F5F4F2'
                }}>
                  Language Distribution
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {getLanguageData.map(({ language, count, color }) => (
                    <div key={language} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{
                        width: '16px',
                        height: '16px',
                        backgroundColor: color,
                        borderRadius: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '10px',
                        fontWeight: 'bold',
                        color: '#F5F4F2'
                      }}>
                        {language === 'Greek' ? 'Α' : 'L'}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginBottom: '0.25rem'
                        }}>
                          <span style={{ fontSize: '0.875rem', color: '#F5F4F2' }}>{language}</span>
                          <span style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>{count}</span>
                        </div>
                        <div style={{
                          height: '4px',
                          backgroundColor: '#2A2A32',
                          borderRadius: '2px',
                          overflow: 'hidden'
                        }}>
                          <div style={{
                            height: '100%',
                            backgroundColor: color,
                            width: `${(count / PASSAGES.length) * 100}%`,
                            transition: 'width 0.3s ease'
                          }}></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Results Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem'
        }}>
          <div>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: '600',
              margin: 0,
              color: '#F5F4F2'
            }}>
              Passages
            </h2>
            <p style={{
              margin: '0.25rem 0 0 0',
              color: '#9CA3AF',
              fontSize: '0.875rem'
            }}>
              {filteredPassages.length} of {PASSAGES.length} passages
            </p>
          </div>
        </div>

        {/* Passages Grid/List */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: viewMode === 'grid' ? 'repeat(auto-fit, minmax(400px, 1fr))' : '1fr',
          gap: '1.5rem'
        }}>
          {filt