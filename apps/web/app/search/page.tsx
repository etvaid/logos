'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

const PASSAGES = [
  { id: 1, author: "Homer", work: "Iliad", book: "1.1-5", text: "Μῆνιν ἄειδε θεὰ Πηληϊάδεω Ἀχιλῆος οὐλομένην", translation: "Sing, O goddess, the anger of Achilles son of Peleus, that brought countless ills", era: "archaic", language: "greek" },
  { id: 2, author: "Homer", work: "Odyssey", book: "1.1-4", text: "Ἄνδρα μοι ἔννεπε, μοῦσα, πολύτροπον", translation: "Tell me, O muse, of that ingenious hero who traveled far and wide", era: "archaic", language: "greek" },
  { id: 3, author: "Plato", work: "Republic", book: "514a", text: "Μετὰ ταῦτα δή ἀπείκασον τοιούτῳ πάθει τὴν ἡμετέραν φύσιν", translation: "Next, compare our nature in respect of education to such an experience", era: "classical", language: "greek" },
  { id: 4, author: "Plato", work: "Apology", book: "21d", text: "ἓν οἶδα ὅτι οὐδὲν οἶδα", translation: "I know that I know nothing", era: "classical", language: "greek" },
  { id: 5, author: "Aristotle", work: "Nicomachean Ethics", book: "1094a", text: "Πᾶσα τέχνη καὶ πᾶσα μέθοδος", translation: "Every art and every inquiry aims at some good", era: "classical", language: "greek" },
  { id: 6, author: "Virgil", work: "Aeneid", book: "1.1-4", text: "Arma virumque cano, Troiae qui primus ab oris", translation: "I sing of arms and the man, who first from the shores of Troy", era: "imperial", language: "latin" },
  { id: 7, author: "Cicero", work: "In Catilinam", book: "1.1", text: "Quo usque tandem abutere, Catilina, patientia nostra?", translation: "How long, O Catiline, will you abuse our patience?", era: "imperial", language: "latin" },
  { id: 8, author: "Seneca", work: "Epistulae", book: "1.1", text: "Ita fac, mi Lucili: vindica te tibi", translation: "Do this, my dear Lucilius: claim yourself for yourself", era: "imperial", language: "latin" },
  { id: 9, author: "Augustine", work: "Confessiones", book: "1.1", text: "Magnus es, Domine, et laudabilis valde", translation: "Great are you, O Lord, and greatly to be praised", era: "lateAntique", language: "latin" },
  { id: 10, author: "Sophocles", work: "Antigone", book: "332", text: "Πολλὰ τὰ δεινὰ κοὐδὲν ἀνθρώπου δεινότερον πέλει", translation: "Many wonders there are, but none more wondrous than man", era: "classical", language: "greek" },
  { id: 11, author: "Herodotus", work: "Histories", book: "1.1", text: "Ἡροδότου Ἁλικαρνησσέος ἱστορίης ἀπόδεξις ἥδε", translation: "This is the showing forth of the inquiry of Herodotus of Halicarnassus", era: "classical", language: "greek" },
  { id: 12, author: "Thucydides", work: "History", book: "1.1", text: "Θουκυδίδης Ἀθηναῖος ξυνέγραψε τὸν πόλεμον", translation: "Thucydides the Athenian wrote the history of the war", era: "classical", language: "greek" },
  { id: 13, author: "Euripides", work: "Medea", book: "1", text: "Εἴθ᾽ ὤφελ᾽ Ἀργοῦς μὴ διαπτάσθαι σκάφος", translation: "Would that the Argo's hull had never winged its way", era: "classical", language: "greek" },
  { id: 14, author: "Aeschylus", work: "Prometheus Bound", book: "1", text: "Χθονὸς μὲν εἰς τηλουρὸν ἥκομεν πέδον", translation: "To earth's remotest limit we come", era: "classical", language: "greek" },
  { id: 15, author: "Ovid", work: "Metamorphoses", book: "1.1", text: "In nova fert animus mutatas dicere formas", translation: "My mind is bent to tell of bodies changed into new forms", era: "imperial", language: "latin" },
  { id: 16, author: "Horace", work: "Odes", book: "1.11", text: "Carpe diem quam minimum credula postero", translation: "Seize the day, trusting as little as possible in tomorrow", era: "imperial", language: "latin" },
  { id: 17, author: "Tacitus", work: "Annals", book: "1.1", text: "Urbem Romam a principio reges habuere", translation: "The city of Rome from the beginning was ruled by kings", era: "imperial", language: "latin" },
  { id: 18, author: "Livy", work: "Ab Urbe Condita", book: "1.1", text: "Facturusne operae pretium sim si a primordio urbis", translation: "Whether I shall accomplish anything worthy if I write from the beginning of the city", era: "imperial", language: "latin" },
  { id: 19, author: "Plutarch", work: "Lives", book: "Alexander.1", text: "Ἀλέξανδρον τὸν βασιλέα γράφων", translation: "Writing about Alexander the king", era: "hellenistic", language: "greek" },
  { id: 20, author: "Epictetus", work: "Discourses", book: "1.1", text: "Τῶν ὄντων τὰ μέν ἐστιν ἐφ᾽ ἡμῖν", translation: "Some things are within our power, while others are not", era: "imperial", language: "greek" },
  { id: 21, author: "Marcus Aurelius", work: "Meditations", book: "2.11", text: "Τὸ παρὸν μόνον ἐστὶν οὗ στερηθῆναι δύναται", translation: "The present moment is the only time over which we have dominion", era: "imperial", language: "greek" },
  { id: 22, author: "Catullus", work: "Carmina", book: "5", text: "Vivamus mea Lesbia atque amemus", translation: "Let us live, my Lesbia, and let us love", era: "imperial", language: "latin" },
  { id: 23, author: "Lucretius", work: "De Rerum Natura", book: "1.1", text: "Aeneadum genetrix hominum divomque voluptas", translation: "Mother of the Aeneadae, pleasure of men and gods", era: "imperial", language: "latin" },
  { id: 24, author: "Sappho", work: "Fragments", book: "31", text: "φαίνεταί μοι κῆνος ἴσος θέοισιν", translation: "He seems to me equal to the gods", era: "archaic", language: "greek" },
  { id: 25, author: "Pindar", work: "Olympian Odes", book: "1.1", text: "Ἄριστον μὲν ὕδωρ", translation: "Water is best", era: "archaic", language: "greek" }
];

const QUICK_SEARCH_TAGS = [
  { label: "Homer", type: "author", query: "homer" },
  { label: "Plato", type: "author", query: "plato" },
  { label: "Aristotle", type: "author", query: "aristotle" },
  { label: "Virgil", type: "author", query: "virgil" },
  { label: "Cicero", type: "author", query: "cicero" },
  { label: "Philosophy", type: "topic", query: "ethics meditations republic" },
  { label: "Epic Poetry", type: "topic", query: "iliad odyssey aeneid" },
  { label: "History", type: "topic", query: "histories annals" },
  { label: "Drama", type: "topic", query: "antigone medea prometheus" },
  { label: "Love Poetry", type: "topic", query: "sappho catullus" }
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

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [query, setQuery] = useState(searchParams?.get('q') || '');
  const [languageFilter, setLanguageFilter] = useState(searchParams?.get('lang') || 'all');
  const [eraFilter, setEraFilter] = useState(searchParams?.get('era') || 'all');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const resultsPerPage = 10;

  const filteredPassages = PASSAGES.filter(passage => {
    const matchesQuery = !query || 
      passage.author.toLowerCase().includes(query.toLowerCase()) ||
      passage.work.toLowerCase().includes(query.toLowerCase()) ||
      passage.text.toLowerCase().includes(query.toLowerCase()) ||
      passage.translation.toLowerCase().includes(query.toLowerCase());
    
    const matchesLanguage = languageFilter === 'all' || passage.language === languageFilter;
    const matchesEra = eraFilter === 'all' || passage.era === eraFilter;
    
    return matchesQuery && matchesLanguage && matchesEra;
  });

  const totalPages = Math.ceil(filteredPassages.length / resultsPerPage);
  const paginatedResults = filteredPassages.slice(
    (currentPage - 1) * resultsPerPage,
    currentPage * resultsPerPage
  );

  const handleSearch = (newQuery: string) => {
    setQuery(newQuery);
    setCurrentPage(1);
    updateURL(newQuery, languageFilter, eraFilter);
  };

  const handleLanguageFilter = (lang: string) => {
    setLanguageFilter(lang);
    setCurrentPage(1);
    updateURL(query, lang, eraFilter);
  };

  const handleEraFilter = (era: string) => {
    setEraFilter(era);
    setCurrentPage(1);
    updateURL(query, languageFilter, era);
  };

  const updateURL = (q: string, lang: string, era: string) => {
    const params = new URLSearchParams();
    if (q) params.set('q', q);
    if (lang && lang !== 'all') params.set('lang', lang);
    if (era && era !== 'all') params.set('era', era);
    
    const url = params.toString() ? `/search?${params.toString()}` : '/search';
    router.push(url, { scroll: false });
  };

  const handleQuickSearch = (tag: any) => {
    setIsLoading(true);
    setTimeout(() => {
      handleSearch(tag.query);
      setIsLoading(false);
    }, 300);
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
        padding: '16px 0',
        borderBottom: '1px solid #141419'
      }}>
        <div style={{ 
          maxWidth: '1200px', 
          margin: '0 auto', 
          padding: '0 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <div style={{ 
              fontSize: '24px', 
              fontWeight: 'bold', 
              color: '#C9A227',
              transition: 'all 0.2s'
            }}>
              LOGOS
            </div>
          </Link>
          <div style={{ display: 'flex', gap: '32px' }}>
            <Link href="/library" style={{ 
              color: '#9CA3AF', 
              textDecoration: 'none',
              fontSize: '16px',
              transition: 'all 0.2s'
            }}>
              Library
            </Link>
            <Link href="/search" style={{ 
              color: '#C9A227', 
              textDecoration: 'none',
              fontSize: '16px',
              fontWeight: '500'
            }}>
              Search
            </Link>
            <Link href="/timeline" style={{ 
              color: '#9CA3AF', 
              textDecoration: 'none',
              fontSize: '16px',
              transition: 'all 0.2s'
            }}>
              Timeline
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px' }}>
        {/* Header */}
        <div style={{ marginBottom: '48px' }}>
          <h1 style={{ 
            fontSize: '48px', 
            fontWeight: 'bold', 
            marginBottom: '16px',
            background: 'linear-gradient(135deg, #C9A227, #E8D5A3)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Search Classical Texts
          </h1>
          <p style={{ 
            fontSize: '18px', 
            color: '#9CA3AF', 
            maxWidth: '600px' 
          }}>
            Search through our comprehensive collection of Greek and Latin texts across all historical periods.
          </p>
        </div>

        {/* Search Controls */}
        <div style={{ 
          backgroundColor: '#1E1E24',
          borderRadius: '16px',
          padding: '32px',
          marginBottom: '32px',
          border: '1px solid #141419'
        }}>
          {/* Search Input */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ 
              display: 'block',
              fontSize: '16px',
              fontWeight: '600',
              marginBottom: '8px',
              color: '#F5F4F2'
            }}>
              Search Query
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch(query)}
                placeholder="Search by author, work, or text content..."
                style={{
                  width: '100%',
                  padding: '16px 48px 16px 16px',
                  fontSize: '16px',
                  backgroundColor: '#141419',
                  border: '1px solid #6B7280',
                  borderRadius: '12px',
                  color: '#F5F4F2',
                  outline: 'none',
                  transition: 'all 0.2s'
                }}
                onFocus={(e) => e.target.style.borderColor = '#C9A227'}
                onBlur={(e) => e.target.style.borderColor = '#6B7280'}
              />
              <button
                onClick={() => handleSearch(query)}
                style={{
                  position: 'absolute',
                  right: '8px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  padding: '8px 12px',
                  backgroundColor: '#C9A227',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#0D0D0F',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#E8D5A3'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#C9A227'}
              >
                Search
              </button>
            </div>
          </div>

          {/* Filters Row */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr', 
            gap: '24px',
            marginBottom: '24px'
          }}>
            {/* Language Filter */}
            <div>
              <label style={{ 
                display: 'block',
                fontSize: '16px',
                fontWeight: '600',
                marginBottom: '8px',
                color: '#F5F4F2'
              }}>
                Language
              </label>
              <select
                value={languageFilter}
                onChange={(e) => handleLanguageFilter(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  fontSize: '16px',
                  backgroundColor: '#141419',
                  border: '1px solid #6B7280',
                  borderRadius: '12px',
                  color: '#F5F4F2',
                  outline: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onFocus={(e) => e.target.style.borderColor = '#C9A227'}
                onBlur={(e) => e.target.style.borderColor = '#6B7280'}
              >
                <option value="all">All Languages</option>
                <option value="greek">Greek</option>
                <option value="latin">Latin</option>
              </select>
            </div>

            {/* Era Filter */}
            <div>
              <label style={{ 
                display: 'block',
                fontSize: '16px',
                fontWeight: '600',
                marginBottom: '8px',
                color: '#F5F4F2'
              }}>
                Historical Era
              </label>
              <select
                value={eraFilter}
                onChange={(e) => handleEraFilter(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  fontSize: '16px',
                  backgroundColor: '#141419',
                  border: '1px solid #6B7280',
                  borderRadius: '12px',
                  color: '#F5F4F2',
                  outline: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onFocus={(e) => e.target.style.borderColor = '#C9A227'}
                onBlur={(e) => e.target.style.borderColor = '#6B7280'}
              >
                <option value="all">All Eras</option>
                <option value="archaic">Archaic (800-500 BCE)</option>
                <option value="classical">Classical (500-323 BCE)</option>
                <option value="hellenistic">Hellenistic (323-31 BCE)</option>
                <option value="imperial">Imperial (31 BCE-284 CE)</option>
                <option value="lateAntique">Late Antique (284-600 CE)</option>
                <option value="byzantine">Byzantine (600-1453 CE)</option>
              </select>
            </div>
          </div>

          {/* Quick Search Tags */}
          <div>
            <label style={{ 
              display: 'block',
              fontSize: '16px',
              fontWeight: '600',
              marginBottom: '12px',
              color: '#F5F4F2'
            }}>
              Quick Search
            </label>
            <div style={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: '8px' 
            }}>
              {QUICK_SEARCH_TAGS.map((tag, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickSearch(tag)}
                  disabled={isLoading}
                  style={{
                    padding: '8px 16px',
                    fontSize: '14px',
                    backgroundColor: tag.type === 'author' ? '#3B82F6' : '#7C3AED',
                    color: '#F5F4F2',
                    border: 'none',
                    borderRadius: '20px',
                    cursor: isLoading ? 'not-allowed' : 'pointer',
                    fontWeight: '500',
                    transition: 'all 0.2s',
                    opacity: isLoading ? 0.6 : 1
                  }}
                  onMouseEnter={(e) => !isLoading && (e.currentTarget.style.transform = 'translateY(-2px)')}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0px)'}
                >
                  {tag.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Summary */}
        <div style={{ 
          marginBottom: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h2 style={{ 
              fontSize: '24px', 
              fontWeight: '600', 
              marginBottom: '4px' 
            }}>
              Search Results
            </h2>
            <p style={{ 
              color: '#9CA3AF',
              fontSize: '16px'
            }}>
              {filteredPassages.length} passages found
              {query && ` for "${query}"`}
              {languageFilter !== 'all' && ` in ${languageFilter}`}
              {eraFilter !== 'all' && ` from ${ERA_LABELS[eraFilter as keyof typeof ERA_LABELS]}`}
            </p>
          </div>

          {/* Active Filters */}
          {(query || languageFilter !== 'all' || eraFilter !== 'all') && (
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <span style={{ color: '#9CA3AF', fontSize: '14px' }}>Filters:</span>
              {query && (
                <span style={{
                  padding: '4px 12px',
                  backgroundColor: '#C9A227',
                  color: '#0D0D0F',
                  borderRadius: '16px',
                  fontSize: '12px',
                  fontWeight: '500'
                }}>
                  "{query}"
                </span>
              )}
              {languageFilter !== 'all' && (
                <span style={{
                  padding: '4px 12px',
                  backgroundColor: languageFilter === 'greek' ? '#3B82F6' : '#DC2626',
                  color: '#F5F4F2',
                  borderRadius: '16px',
                  fontSize: '12px',
                  fontWeight: '500'
                }}>
                  {languageFilter}
                </span>
              )}
              {eraFilter !== 'all' && (
                <span style={{
                  padding: '4px 12px',
                  backgroundColor: ERA_COLORS[eraFilter as keyof typeof ERA_COLORS],
                  color: '#F5F4F2',
                  borderRadius: '16px',
                  fontSize: '12px',
                  fontWeight: '500'
                }}>
                  {eraFilter}
                </span>
              )}
              <button
                onClick={() => {
                  setQuery('');
                  setLanguageFilter('all');
                  setEraFilter('all');
                  setCurrentPage(1);
                  router.push('/search');
                }}
                style={{
                  padding: '4px 8px',
                  backgroundColor: '#6B7280',
                  color: '#F5F4F2',
                  border: 'none',
                  borderRadius: '16px',
                  fontSize: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#9CA3AF'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#6B7280'}
              >
                Clear
              </button>
            </div>
          )}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            padding: '64px',
            color: '#9CA3AF'
          }}>
            <div style={{ 
              animation: 'spin 1s linear infinite',
              width: '32px',
              height: '32px',
              border: '2px solid #6B7280',
              borderTop: '2px solid #C9A227',
              borderRadius: '50%'
            }} />
          </div>
        )}

        {/* Results */}
        {!isLoading && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {paginatedResults.map((passage) => (
              <div
                key={passage.id}
                style={{
                  backgroundColor: '#1E1E24',
                  borderRadius: '12px',
                  padding: '24px',
                  border: '1px solid #141419',
                  transition: 'all 0.2s',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#C9A227';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#141419';
                  e.currentTarget.style.transform = 'translateY(0px)';
                }}
              >
                {/* Header */}
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'flex-start',
                  marginBottom: '16px'
                }}>
                  <div>
                    <h3 style={{ 
                      fontSize: '20px', 
                      fontWeight: '600', 
                      marginBottom: '4px',
                      color: '#F5F4F2'
                    }}>
                      {passage.author} - {passage.work}
                    </h3>
                    <p style={{ 
                      color: '#9CA3AF',
                      fontSize: '14px'
                    }}>
                      {passage.book}
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <span style={{
                      padding: '4px 12px',
                      backgroundColor: passage.language === 'greek' ? '#3B82F6' : '#DC2626',
                      color: '#F5F4F2',
                      borderRadius: '16px',
                      fontSize: '12px',
                      fontWeight: '500'
                    }}>
                      {passage.language}
                    </span>
                    <span style={{
                      padding: '4px 12px',
                      backgroundColor: ERA_COLORS[passage.era as keyof typeof ERA_COLORS],
                      color: '#F5F4F2',
                      borderRadius: '16px',
                      fontSize: '12px',
                      fontWeight: '500'
                    }}>
                      {passage.era}
                    </span>
                  </div>
                </div>

                {/* Text Content */}
                <div style={{ marginBottom: '16px' }}>
                  <p style={{ 
                    fontSize: '18px',
                    lineHeight: '1.6',
                    marginBottom: '12px',
                    color: '#F5F4F2',
                    fontFamily: passage.language === 'greek' ? 'serif' : 'inherit'
                  }}>
                    {passage.text}
                  </p>
                  <p style={{ 
                    fontSize: '16px',
                    lineHeight: '1.6',
                    color: '#9CA3AF',
                    fontStyle: 'italic'
                  }}>
                    {passage.translation}
                  </p>
                </div>

                {/* View Link */}
                <Link 
                  href={`/passage/${passage.id}`}
                  style={{
                    color: '#C9A227',
                    textDecoration: 'none',
                    fontSize: '14px',
                    fontWeight: '500',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => e