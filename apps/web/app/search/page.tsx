'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';

const PASSAGES = [
  { id: 1, author: "Homer", work: "Iliad", book: "1.1-5", text: "Μῆνιν ἄειδε θεὰ Πηληϊάδεω Ἀχιλῆος οὐλομένην", translation: "Sing, O goddess, the anger of Achilles son of Peleus, that brought countless ills", era: "archaic", language: "greek", topics: ["epic", "war", "heroism"] },
  { id: 2, author: "Homer", work: "Odyssey", book: "1.1-4", text: "Ἄνδρα μοι ἔννεπε, μοῦσα, πολύτροπον", translation: "Tell me, O muse, of that ingenious hero who traveled far and wide", era: "archaic", language: "greek", topics: ["epic", "journey", "heroism"] },
  { id: 3, author: "Plato", work: "Republic", book: "514a", text: "Μετὰ ταῦτα δή ἀπείκασον τοιούτῳ πάθει τὴν ἡμετέραν φύσιν", translation: "Next, compare our nature in respect of education to such an experience", era: "classical", language: "greek", topics: ["philosophy", "education", "allegory"] },
  { id: 4, author: "Plato", work: "Apology", book: "21d", text: "ἓν οἶδα ὅτι οὐδὲν οἶδα", translation: "I know that I know nothing", era: "classical", language: "greek", topics: ["philosophy", "wisdom", "knowledge"] },
  { id: 5, author: "Aristotle", work: "Nicomachean Ethics", book: "1094a", text: "Πᾶσα τέχνη καὶ πᾶσα μέθοδος", translation: "Every art and every inquiry aims at some good", era: "classical", language: "greek", topics: ["philosophy", "ethics", "virtue"] },
  { id: 6, author: "Virgil", work: "Aeneid", book: "1.1-4", text: "Arma virumque cano, Troiae qui primus ab oris", translation: "I sing of arms and the man, who first from the shores of Troy", era: "imperial", language: "latin", topics: ["epic", "war", "founding"] },
  { id: 7, author: "Cicero", work: "In Catilinam", book: "1.1", text: "Quo usque tandem abutere, Catilina, patientia nostra?", translation: "How long, O Catiline, will you abuse our patience?", era: "imperial", language: "latin", topics: ["rhetoric", "politics", "oratory"] },
  { id: 8, author: "Seneca", work: "Epistulae", book: "1.1", text: "Ita fac, mi Lucili: vindica te tibi", translation: "Do this, my dear Lucilius: claim yourself for yourself", era: "imperial", language: "latin", topics: ["philosophy", "stoicism", "ethics"] },
  { id: 9, author: "Augustine", work: "Confessiones", book: "1.1", text: "Magnus es, Domine, et laudabilis valde", translation: "Great are you, O Lord, and greatly to be praised", era: "lateAntique", language: "latin", topics: ["theology", "confession", "Christianity"] },
  { id: 10, author: "Sophocles", work: "Antigone", book: "332", text: "Πολλὰ τὰ δεινὰ κοὐδὲν ἀνθρώπου δεινότερον πέλει", translation: "Many wonders there are, but none more wondrous than man", era: "classical", language: "greek", topics: ["tragedy", "human nature", "morality"] },
  { id: 11, author: "Herodotus", work: "Histories", book: "1.1", text: "Ἡροδότου Ἁλικαρνησσέος ἱστορίης ἀπόδεξις ἥδε", translation: "This is the showing forth of the inquiry of Herodotus of Halicarnassus", era: "classical", language: "greek", topics: ["history", "inquiry", "cultures"] },
  { id: 12, author: "Thucydides", work: "History", book: "1.1", text: "Θουκυδίδης Ἀθηναῖος ξυνέγραψε τὸν πόλεμον", translation: "Thucydides the Athenian wrote the history of the war", era: "classical", language: "greek", topics: ["history", "war", "politics"] },
  { id: 13, author: "Euripides", work: "Medea", book: "1", text: "Εἴθ᾽ ὤφελ᾽ Ἀργοῦς μὴ διαπτάσθαι σκάφος", translation: "Would that the Argo's hull had never winged its way", era: "classical", language: "greek", topics: ["tragedy", "love", "revenge"] },
  { id: 14, author: "Aeschylus", work: "Prometheus Bound", book: "1", text: "Χθονὸς μὲν εἰς τηλουρὸν ἥκομεν πέδον", translation: "To earth's remotest limit we come", era: "classical", language: "greek", topics: ["tragedy", "mythology", "punishment"] },
  { id: 15, author: "Ovid", work: "Metamorphoses", book: "1.1", text: "In nova fert animus mutatas dicere formas", translation: "My mind is bent to tell of bodies changed into new forms", era: "imperial", language: "latin", topics: ["mythology", "transformation", "poetry"] },
  { id: 16, author: "Horace", work: "Odes", book: "1.11", text: "Carpe diem quam minimum credula postero", translation: "Seize the day, trusting as little as possible in tomorrow", era: "imperial", language: "latin", topics: ["poetry", "philosophy", "time"] },
  { id: 17, author: "Tacitus", work: "Annals", book: "1.1", text: "Urbem Romam a principio reges habuere", translation: "The city of Rome from the beginning was ruled by kings", era: "imperial", language: "latin", topics: ["history", "politics", "empire"] },
  { id: 18, author: "Livy", work: "Ab Urbe Condita", book: "1.1", text: "Facturusne operae pretium sim si a primordio urbis", translation: "Whether I shall accomplish anything worthy if I write from the beginning of the city", era: "imperial", language: "latin", topics: ["history", "founding", "Rome"] },
  { id: 19, author: "Plutarch", work: "Lives", book: "Alexander.1", text: "Ἀλέξανδρον τὸν βασιλέα γράφων", translation: "Writing about Alexander the king", era: "hellenistic", language: "greek", topics: ["biography", "leadership", "heroism"] },
  { id: 20, author: "Epictetus", work: "Discourses", book: "1.1", text: "Τῶν ὄντων τὰ μέν ἐστιν ἐφ᾽ ἡμῖν", translation: "Some things are within our power, while others are not", era: "imperial", language: "greek", topics: ["philosophy", "stoicism", "control"] },
  { id: 21, author: "Marcus Aurelius", work: "Meditations", book: "2.11", text: "Τὸ παρὸν μόνον ἐστὶν οὗ στερηθῆναι δύναται", translation: "The present moment is the only time over which we have dominion", era: "imperial", language: "greek", topics: ["philosophy", "stoicism", "mindfulness"] },
  { id: 22, author: "Catullus", work: "Carmina", book: "5", text: "Vivamus mea Lesbia atque amemus", translation: "Let us live, my Lesbia, and let us love", era: "imperial", language: "latin", topics: ["poetry", "love", "passion"] }
];

const QUICK_TAGS = [
  { label: "Epic Poetry", query: "epic", type: "topic" },
  { label: "Philosophy", query: "philosophy", type: "topic" },
  { label: "Tragedy", query: "tragedy", type: "topic" },
  { label: "History", query: "history", type: "topic" },
  { label: "Stoicism", query: "stoicism", type: "topic" },
  { label: "Homer", query: "Homer", type: "author" },
  { label: "Plato", query: "Plato", type: "author" },
  { label: "Cicero", query: "Cicero", type: "author" }
];

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [languageFilter, setLanguageFilter] = useState('all');
  const [eraFilter, setEraFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const resultsPerPage = 10;

  const filteredResults = useMemo(() => {
    let filtered = PASSAGES;

    // Apply text search
    if (query.trim()) {
      const searchQuery = query.toLowerCase();
      filtered = filtered.filter(passage => 
        passage.author.toLowerCase().includes(searchQuery) ||
        passage.work.toLowerCase().includes(searchQuery) ||
        passage.text.toLowerCase().includes(searchQuery) ||
        passage.translation.toLowerCase().includes(searchQuery) ||
        passage.topics.some(topic => topic.toLowerCase().includes(searchQuery))
      );
    }

    // Apply language filter
    if (languageFilter !== 'all') {
      filtered = filtered.filter(passage => passage.language === languageFilter);
    }

    // Apply era filter
    if (eraFilter !== 'all') {
      filtered = filtered.filter(passage => passage.era === eraFilter);
    }

    return filtered;
  }, [query, languageFilter, eraFilter]);

  const totalPages = Math.ceil(filteredResults.length / resultsPerPage);
  const paginatedResults = filteredResults.slice(
    (currentPage - 1) * resultsPerPage,
    currentPage * resultsPerPage
  );

  const handleQuickTag = (tagQuery: string) => {
    setQuery(tagQuery);
    setCurrentPage(1);
  };

  const handleSearch = (newQuery: string) => {
    setIsLoading(true);
    setQuery(newQuery);
    setCurrentPage(1);
    // Simulate loading
    setTimeout(() => setIsLoading(false), 200);
  };

  const getEraColor = (era: string) => {
    const colors = {
      archaic: '#D97706',
      classical: '#F59E0B',
      hellenistic: '#3B82F6',
      imperial: '#DC2626',
      lateAntique: '#7C3AED'
    };
    return colors[era as keyof typeof colors] || '#9CA3AF';
  };

  const getLanguageColor = (language: string) => {
    return language === 'greek' ? '#3B82F6' : '#DC2626';
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#0D0D0F', 
      color: '#F5F4F2' 
    }}>
      {/* Navigation */}
      <nav style={{ 
        backgroundColor: '#1E1E24',
        borderBottom: '1px solid #2D2D32',
        padding: '16px 0'
      }}>
        <div style={{ 
          maxWidth: '1200px', 
          margin: '0 auto', 
          padding: '0 24px',
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
          <div style={{ display: 'flex', gap: '32px' }}>
            <Link href="/" style={{ 
              color: '#9CA3AF', 
              textDecoration: 'none',
              transition: 'color 0.2s'
            }}>
              Home
            </Link>
            <Link href="/search" style={{ 
              color: '#C9A227', 
              textDecoration: 'none'
            }}>
              Search
            </Link>
            <Link href="/timeline" style={{ 
              color: '#9CA3AF', 
              textDecoration: 'none',
              transition: 'color 0.2s'
            }}>
              Timeline
            </Link>
            <Link href="/analysis" style={{ 
              color: '#9CA3AF', 
              textDecoration: 'none',
              transition: 'color 0.2s'
            }}>
              Analysis
            </Link>
            <Link href="/compare" style={{ 
              color: '#9CA3AF', 
              textDecoration: 'none',
              transition: 'color 0.2s'
            }}>
              Compare
            </Link>
          </div>
        </div>
      </nav>

      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        padding: '48px 24px' 
      }}>
        {/* Header */}
        <div style={{ marginBottom: '48px', textAlign: 'center' }}>
          <h1 style={{ 
            fontSize: '48px',
            fontWeight: 'bold',
            marginBottom: '16px',
            background: 'linear-gradient(135deg, #C9A227, #E8D5A3)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Search Classical Texts
          </h1>
          <p style={{ 
            fontSize: '18px',
            color: '#9CA3AF',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            Explore thousands of passages from Greek and Latin literature across all historical periods
          </p>
        </div>

        {/* Search Interface */}
        <div style={{ 
          backgroundColor: '#1E1E24',
          padding: '32px',
          borderRadius: '16px',
          marginBottom: '32px',
          border: '1px solid #2D2D32'
        }}>
          {/* Main Search Bar */}
          <div style={{ 
            display: 'flex',
            gap: '16px',
            marginBottom: '24px'
          }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <input
                type="text"
                placeholder="Search by author, work, text, or topic..."
                value={query}
                onChange={(e) => handleSearch(e.target.value)}
                style={{
                  width: '100%',
                  padding: '16px 20px',
                  backgroundColor: '#141419',
                  border: '2px solid #2D2D32',
                  borderRadius: '12px',
                  color: '#F5F4F2',
                  fontSize: '16px',
                  outline: 'none',
                  transition: 'all 0.2s',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#C9A227';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#2D2D32';
                }}
              />
              {isLoading && (
                <div style={{
                  position: 'absolute',
                  right: '16px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '20px',
                  height: '20px',
                  border: '2px solid #2D2D32',
                  borderTop: '2px solid #C9A227',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }} />
              )}
            </div>
            <button
              onClick={() => handleSearch(query)}
              style={{
                padding: '16px 24px',
                backgroundColor: '#C9A227',
                color: '#0D0D0F',
                border: 'none',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s',
                whiteSpace: 'nowrap'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#E8D5A3';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#C9A227';
              }}
            >
              Search
            </button>
          </div>

          {/* Filters */}
          <div style={{ 
            display: 'flex',
            gap: '24px',
            alignItems: 'center',
            flexWrap: 'wrap'
          }}>
            <div>
              <label style={{ 
                display: 'block',
                marginBottom: '8px',
                fontSize: '14px',
                fontWeight: '600',
                color: '#9CA3AF'
              }}>
                Language
              </label>
              <select
                value={languageFilter}
                onChange={(e) => {
                  setLanguageFilter(e.target.value);
                  setCurrentPage(1);
                }}
                style={{
                  padding: '12px 16px',
                  backgroundColor: '#141419',
                  border: '2px solid #2D2D32',
                  borderRadius: '8px',
                  color: '#F5F4F2',
                  fontSize: '14px',
                  outline: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#C9A227';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#2D2D32';
                }}
              >
                <option value="all">All Languages</option>
                <option value="greek">Greek</option>
                <option value="latin">Latin</option>
              </select>
            </div>

            <div>
              <label style={{ 
                display: 'block',
                marginBottom: '8px',
                fontSize: '14px',
                fontWeight: '600',
                color: '#9CA3AF'
              }}>
                Era
              </label>
              <select
                value={eraFilter}
                onChange={(e) => {
                  setEraFilter(e.target.value);
                  setCurrentPage(1);
                }}
                style={{
                  padding: '12px 16px',
                  backgroundColor: '#141419',
                  border: '2px solid #2D2D32',
                  borderRadius: '8px',
                  color: '#F5F4F2',
                  fontSize: '14px',
                  outline: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#C9A227';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#2D2D32';
                }}
              >
                <option value="all">All Eras</option>
                <option value="archaic">Archaic (800-500 BCE)</option>
                <option value="classical">Classical (500-323 BCE)</option>
                <option value="hellenistic">Hellenistic (323-31 BCE)</option>
                <option value="imperial">Imperial (31 BCE-284 CE)</option>
                <option value="lateAntique">Late Antique (284-600 CE)</option>
              </select>
            </div>

            <div style={{ 
              marginLeft: 'auto',
              fontSize: '14px',
              color: '#9CA3AF'
            }}>
              {filteredResults.length} result{filteredResults.length !== 1 ? 's' : ''} found
            </div>
          </div>
        </div>

        {/* Quick Search Tags */}
        <div style={{ marginBottom: '32px' }}>
          <h3 style={{ 
            fontSize: '18px',
            fontWeight: '600',
            marginBottom: '16px',
            color: '#F5F4F2'
          }}>
            Quick Search
          </h3>
          <div style={{ 
            display: 'flex',
            gap: '12px',
            flexWrap: 'wrap'
          }}>
            {QUICK_TAGS.map((tag, index) => (
              <button
                key={index}
                onClick={() => handleQuickTag(tag.query)}
                style={{
                  padding: '8px 16px',
                  backgroundColor: query.toLowerCase() === tag.query.toLowerCase() ? '#C9A227' : '#141419',
                  color: query.toLowerCase() === tag.query.toLowerCase() ? '#0D0D0F' : '#9CA3AF',
                  border: '1px solid #2D2D32',
                  borderRadius: '20px',
                  fontSize: '14px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  whiteSpace: 'nowrap'
                }}
                onMouseEnter={(e) => {
                  if (query.toLowerCase() !== tag.query.toLowerCase()) {
                    e.currentTarget.style.backgroundColor = '#2D2D32';
                    e.currentTarget.style.color = '#F5F4F2';
                  }
                }}
                onMouseLeave={(e) => {
                  if (query.toLowerCase() !== tag.query.toLowerCase()) {
                    e.currentTarget.style.backgroundColor = '#141419';
                    e.currentTarget.style.color = '#9CA3AF';
                  }
                }}
              >
                {tag.label}
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        <div style={{ marginBottom: '32px' }}>
          {paginatedResults.length === 0 ? (
            <div style={{
              backgroundColor: '#1E1E24',
              padding: '48px',
              borderRadius: '16px',
              textAlign: 'center',
              border: '1px solid #2D2D32'
            }}>
              <div style={{ 
                fontSize: '48px',
                marginBottom: '16px'
              }}>
                📚
              </div>
              <h3 style={{ 
                fontSize: '24px',
                fontWeight: '600',
                marginBottom: '8px',
                color: '#F5F4F2'
              }}>
                No results found
              </h3>
              <p style={{ 
                color: '#9CA3AF',
                fontSize: '16px'
              }}>
                Try adjusting your search terms or filters
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {paginatedResults.map((passage) => (
                <div
                  key={passage.id}
                  style={{
                    backgroundColor: '#1E1E24',
                    padding: '24px',
                    borderRadius: '12px',
                    border: '1px solid #2D2D32',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#252530';
                    e.currentTarget.style.borderColor = '#3D3D42';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#1E1E24';
                    e.currentTarget.style.borderColor = '#2D2D32';
                  }}
                >
                  {/* Header */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '16px',
                    flexWrap: 'wrap',
                    gap: '12px'
                  }}>
                    <div>
                      <h4 style={{
                        fontSize: '18px',
                        fontWeight: '600',
                        color: '#F5F4F2',
                        margin: '0 0 4px 0'
                      }}>
                        {passage.author} - {passage.work}
                      </h4>
                      <p style={{
                        fontSize: '14px',
                        color: '#9CA3AF',
                        margin: 0
                      }}>
                        {passage.book}
                      </p>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <span
                        style={{
                          padding: '4px 8px',
                          backgroundColor: getLanguageColor(passage.language),
                          color: '#F5F4F2',
                          fontSize: '12px',
                          borderRadius: '4px',
                          fontWeight: '600'
                        }}
                      >
                        {passage.language.toUpperCase()}
                      </span>
                      <span
                        style={{
                          padding: '4px 8px',
                          backgroundColor: getEraColor(passage.era),
                          color: '#F5F4F2',
                          fontSize: '12px',
                          borderRadius: '4px',
                          fontWeight: '600'
                        }}
                      >
                        {passage.era.charAt(0).toUpperCase() + passage.era.slice(1)}
                      </span>
                    </div>
                  </div>

                  {/* Text */}
                  <div style={{ marginBottom: '16px' }}>
                    <p style={{
                      fontSize: '16px',
                      lineHeight: '1.6',
                      color: '#F5F4F2',
                      margin: '0 0 12px 0',
                      fontStyle: 'italic'
                    }}>
                      {passage.text}
                    </p>
                    <p style={{
                      fontSize: '16px',
                      lineHeight: '1.6',
                      color: '#C9A227',
                      margin: 0
                    }}>
                      {passage.translation}
                    </p>
                  </div>

                  {/* Topics */}
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {passage.topics.map((topic, topicIndex) => (
                      <span
                        key={topicIndex}
                        onClick={() => handleQuickTag(topic)}
                        style={{
                          padding: '4px 8px',
                          backgroundColor: '#141419',
                          color: '#9CA3AF',
                          fontSize: '12px',
                          borderRadius: '12px',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          border: '1px solid #2D2D32'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#2D2D32';
                          e.currentTarget.style.color = '#F5F4F2';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = '#141419';
                          e.currentTarget.style.color = '#9CA3AF';
                        }}
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '8px',
            marginTop: '32px'
          }}>
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              style={{
                padding: '12px 16px',
                backgroundColor: currentPage === 1 ? '#141419' : '#1E1E24',
                color: currentPage === 1 ? '#6B7280' : '#9CA3AF',
                border: '1px solid #2D2D32',
                borderRadius: '8px',
                cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                if (currentPage !== 1) {
                  e.currentTarget.style.backgroundColor = '#2D2D32';
                  e.currentTarget.style.color = '#F5F4F2';
                }
              }}
              onMouseLeave={(e) => {
                if (currentPage !== 1) {
                  e.currentTarget.style.backgroundColor = '#1E1E24';
                  e.currentTarget.style.color = '#9CA3AF';
                }
              }}
            >
              Previous
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                style={{
                  padding: '12px 16px',
                  backgroundColor: page === currentPage ? '#C9A227' : '#1E1E24',
                  color: page === currentPage ? '#0D0D0F' : '#9CA3AF',
                  border: '1px solid #2D2D32',
                  borderRadius: '8