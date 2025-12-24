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
  { id: 11, author: "Euripides", work: "Medea", book: "214", text: "ἀλλ᾽ οὐ ταὐτὸν ἀνδράσιν τε καὶ γυναιξὶ κεῖται νόμος", translation: "But the same law does not apply to men and women", era: "classical", language: "greek", topics: ["tragedy", "gender", "law"], manuscript: "Mediceus", variants: ["ταὐτὸν: τὸ αὐτὸ M", "κεῖται: κέκλειται K"], lemma: ["ταὐτός", "ἀνήρ", "νόμος"], embeddings: [0.7, 0.8, 0.6], semanticDrift: ["same→equal", "law→custom"] }
];

const ERA_COLORS = {
  archaic: '#D97706',
  classical: '#F59E0B',
  hellenistic: '#3B82F6',
  imperial: '#DC2626',
  lateAntique: '#7C3AED',
  byzantine: '#059669'
};

const LANGUAGE_COLORS = {
  greek: '#3B82F6',
  latin: '#DC2626'
};

export default function CorpusAnalyzer() {
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [selectedPassage, setSelectedPassage] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'timeline' | 'network'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [animationKey, setAnimationKey] = useState(0);

  // Memoized filtered passages
  const filteredPassages = useMemo(() => {
    let filtered = PASSAGES.filter(passage => {
      const matchesSearch = !searchQuery || 
        passage.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
        passage.translation.toLowerCase().includes(searchQuery.toLowerCase()) ||
        passage.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        passage.work.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesFilters = activeFilters.length === 0 || 
        activeFilters.every(filter => 
          passage.era === filter || 
          passage.language === filter || 
          passage.topics.includes(filter)
        );
      
      return matchesSearch && matchesFilters;
    });
    
    return filtered;
  }, [activeFilters, searchQuery]);

  const toggleFilter = useCallback((filter: string) => {
    setActiveFilters(prev => 
      prev.includes(filter) 
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    );
    setAnimationKey(k => k + 1);
  }, []);

  const clearFilters = useCallback(() => {
    setActiveFilters([]);
    setSearchQuery('');
    setAnimationKey(k => k + 1);
  }, []);

  // Analytics
  const analytics = useMemo(() => {
    const totalPassages = filteredPassages.length;
    const languages = filteredPassages.reduce((acc, p) => {
      acc[p.language] = (acc[p.language] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const eras = filteredPassages.reduce((acc, p) => {
      acc[p.era] = (acc[p.era] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const authors = filteredPassages.reduce((acc, p) => {
      acc[p.author] = (acc[p.author] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const avgEmbedding = filteredPassages.reduce((sum, p) => 
      sum + p.embeddings.reduce((a, b) => a + b, 0) / p.embeddings.length
    , 0) / (totalPassages || 1);

    return { totalPassages, languages, eras, authors, avgEmbedding };
  }, [filteredPassages]);

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#0D0D0F', 
      color: '#F5F4F2',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      {/* Header */}
      <header style={{
        background: 'linear-gradient(135deg, #141419 0%, #1E1E24 50%, #141419 100%)',
        borderBottom: '1px solid #C9A227',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backdropFilter: 'blur(10px)'
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '1.5rem 2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div>
              <h1 style={{ 
                fontSize: '2.5rem', 
                fontWeight: 'bold', 
                background: 'linear-gradient(45deg, #C9A227, #F59E0B)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                marginBottom: '0.5rem'
              }}>
                Classical Corpus Analyzer
              </h1>
              <p style={{ color: '#9CA3AF', fontSize: '1.1rem' }}>
                Advanced Analysis of {analytics.totalPassages} Ancient Texts
              </p>
            </div>
            
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {(['grid', 'timeline', 'network'] as const).map(mode => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  style={{
                    padding: '0.75rem 1.5rem',
                    backgroundColor: viewMode === mode ? '#C9A227' : '#1E1E24',
                    color: viewMode === mode ? '#0D0D0F' : '#F5F4F2',
                    border: `1px solid ${viewMode === mode ? '#C9A227' : '#6B7280'}`,
                    borderRadius: '8px',
                    textTransform: 'capitalize',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    transform: viewMode === mode ? 'translateY(-1px)' : 'none',
                    boxShadow: viewMode === mode ? '0 4px 12px rgba(201, 162, 39, 0.3)' : 'none'
                  }}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          {/* Search and Filters */}
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ position: 'relative', flex: '1', minWidth: '300px' }}>
              <input
                type="text"
                placeholder="Search texts, authors, translations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '1rem 1rem 1rem 3rem',
                  backgroundColor: '#1E1E24',
                  border: '2px solid #6B7280',
                  borderRadius: '12px',
                  color: '#F5F4F2',
                  fontSize: '1rem',
                  outline: 'none',
                  transition: 'border-color 0.2s ease',
                }}
                onFocus={(e) => e.target.style.borderColor = '#C9A227'}
                onBlur={(e) => e.target.style.borderColor = '#6B7280'}
              />
              <svg style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
              </svg>
            </div>
            
            {activeFilters.length > 0 && (
              <button
                onClick={clearFilters}
                style={{
                  padding: '1rem',
                  backgroundColor: '#DC2626',
                  color: '#F5F4F2',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  transition: 'all 0.2s ease',
                }}
              >
                Clear Filters ({activeFilters.length})
              </button>
            )}
          </div>

          {/* Filter Tags */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '1rem' }}>
            {/* Language Filters */}
            {['greek', 'latin'].map(lang => (
              <button
                key={lang}
                onClick={() => toggleFilter(lang)}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: activeFilters.includes(lang) ? LANGUAGE_COLORS[lang as keyof typeof LANGUAGE_COLORS] : '#1E1E24',
                  color: activeFilters.includes(lang) ? '#F5F4F2' : '#9CA3AF',
                  border: `1px solid ${activeFilters.includes(lang) ? LANGUAGE_COLORS[lang as keyof typeof LANGUAGE_COLORS] : '#6B7280'}`,
                  borderRadius: '20px',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  textTransform: 'capitalize'
                }}
              >
                {lang === 'greek' ? 'Α' : 'L'} {lang}
              </button>
            ))}
            
            {/* Era Filters */}
            {Object.keys(ERA_COLORS).map(era => (
              <button
                key={era}
                onClick={() => toggleFilter(era)}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: activeFilters.includes(era) ? ERA_COLORS[era as keyof typeof ERA_COLORS] : '#1E1E24',
                  color: activeFilters.includes(era) ? '#F5F4F2' : '#9CA3AF',
                  border: `1px solid ${activeFilters.includes(era) ? ERA_COLORS[era as keyof typeof ERA_COLORS] : '#6B7280'}`,
                  borderRadius: '20px',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  textTransform: 'capitalize'
                }}
              >
                {era.replace(/([A-Z])/g, ' $1').trim()}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Analytics Dashboard */}
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem' }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '1rem', 
          marginBottom: '2rem' 
        }}>
          {/* Total Passages */}
          <div style={{
            backgroundColor: '#1E1E24',
            borderRadius: '12px',
            padding: '1.5rem',
            border: '1px solid #6B7280',
            background: 'linear-gradient(135deg, #1E1E24 0%, #141419 100%)',
            transition: 'transform 0.2s ease',
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <h3 style={{ color: '#C9A227', fontSize: '0.875rem', fontWeight: '600', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
              Total Passages
            </h3>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#F5F4F2' }}>
              {analytics.totalPassages}
            </p>
          </div>

          {/* Languages Distribution */}
          <div style={{
            backgroundColor: '#1E1E24',
            borderRadius: '12px',
            padding: '1.5rem',
            border: '1px solid #6B7280',
            background: 'linear-gradient(135deg, #1E1E24 0%, #141419 100%)',
            transition: 'transform 0.2s ease',
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <h3 style={{ color: '#C9A227', fontSize: '0.875rem', fontWeight: '600', textTransform: 'uppercase', marginBottom: '1rem' }}>
              Languages
            </h3>
            {Object.entries(analytics.languages).map(([lang, count]) => (
              <div key={lang} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ color: LANGUAGE_COLORS[lang as keyof typeof LANGUAGE_COLORS], fontWeight: '500' }}>
                  {lang === 'greek' ? 'Α' : 'L'} {lang.charAt(0).toUpperCase() + lang.slice(1)}
                </span>
                <span style={{ color: '#F5F4F2', fontWeight: 'bold' }}>{count}</span>
              </div>
            ))}
          </div>

          {/* Semantic Similarity */}
          <div style={{
            backgroundColor: '#1E1E24',
            borderRadius: '12px',
            padding: '1.5rem',
            border: '1px solid #6B7280',
            background: 'linear-gradient(135deg, #1E1E24 0%, #141419 100%)',
            transition: 'transform 0.2s ease',
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <h3 style={{ color: '#C9A227', fontSize: '0.875rem', fontWeight: '600', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
              Avg Similarity
            </h3>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', color: '#F5F4F2' }}>
              {(analytics.avgEmbedding * 100).toFixed(1)}%
            </p>
            <div style={{
              width: '100%',
              height: '4px',
              backgroundColor: '#6B7280',
              borderRadius: '2px',
              marginTop: '0.5rem',
              overflow: 'hidden'
            }}>
              <div style={{
                width: `${analytics.avgEmbedding * 100}%`,
                height: '100%',
                backgroundColor: '#C9A227',
                transition: 'width 0.3s ease'
              }} />
            </div>
          </div>

          {/* Top Authors */}
          <div style={{
            backgroundColor: '#1E1E24',
            borderRadius: '12px',
            padding: '1.5rem',
            border: '1px solid #6B7280',
            background: 'linear-gradient(135deg, #1E1E24 0%, #141419 100%)',
            transition: 'transform 0.2s ease',
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <h3 style={{ color: '#C9A227', fontSize: '0.875rem', fontWeight: '600', textTransform: 'uppercase', marginBottom: '1rem' }}>
              Top Authors
            </h3>
            {Object.entries(analytics.authors)
              .sort(([,a], [,b]) => b - a)
              .slice(0, 3)
              .map(([author, count], index) => (
              <div key={author} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ color: '#F5F4F2', fontWeight: '500' }}>
                  #{index + 1} {author}
                </span>
                <span style={{ color: '#C9A227', fontWeight: 'bold' }}>{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Passages View */}
        {viewMode === 'grid' && (
          <div key={animationKey} style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(450px, 1fr))', 
            gap: '1.5rem',
            animation: 'fadeInUp 0.5s ease-out'
          }}>
            {filteredPassages.map((passage, index) => (
              <div
                key={passage.id}
                style={{
                  backgroundColor: '#1E1E24',
                  borderRadius: '16px',
                  padding: '1.5rem',
                  border: `2px solid ${selectedPassage === passage.id ? '#C9A227' : '#6B7280'}`,
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  position: 'relative',
                  overflow: 'hidden',
                  background: selectedPassage === passage.id 
                    ? 'linear-gradient(135deg, #1E1E24 0%, #141419 50%, rgba(201, 162, 39, 0.1) 100%)'
                    : 'linear-gradient(135deg, #1E1E24 0%, #141419 100%)',
                  animationDelay: `${index * 0.05}s`,
                  animation: 'slideInUp 0.6s ease-out forwards',
                  opacity: 0,
                  transform: 'translateY(20px)'
                }}
                onClick={() => setSelectedPassage(selectedPassage === passage.id ? null : passage.id)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px) scale(1.02)';
                  e.currentTarget.style.boxShadow = '0 12px 24px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(201, 162, 39, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {/* Language and Era Badges */}
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                  <span style={{
                    padding: '0.25rem 0.75rem',
                    backgroundColor: LANGUAGE_COLORS[passage.language as keyof typeof LANGUAGE_COLORS],
                    color: '#F5F4F2',
                    borderRadius: '12px',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem'
                  }}>
                    {passage.language === 'greek' ? 'Α' : 'L'} {passage.language.toUpperCase()}
                  </span>
                  <span style={{
                    padding: '0.25rem 0.75rem',
                    backgroundColor: ERA_COLORS[passage.era as keyof typeof ERA_COLORS],
                    color: '#F5F4F2',
                    borderRadius: '12px',
                    fontSize: '0.75rem',