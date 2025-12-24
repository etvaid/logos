'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

// Word forms dictionary
const WORD_FORMS: Record<string, { translation: string; type: string; forms: string; etymology?: string }> = {
  // Greek words
  "μῆνιν": { translation: "wrath, rage", type: "noun (accusative)", forms: "μῆνις, μῆνιδος", etymology: "From Proto-Indo-European *mēnis-" },
  "ἄειδε": { translation: "sing!", type: "verb (imperative)", forms: "ἀείδω, ἀείσω, ἤεισα", etymology: "From *aweyd- 'to sing'" },
  "θεὰ": { translation: "goddess", type: "noun (vocative)", forms: "θεός, θεοῦ", etymology: "From *dheh₁s- 'divine'" },
  "ἓν": { translation: "one", type: "numeral", forms: "εἷς, μία, ἕν" },
  "οἶδα": { translation: "I know", type: "verb (perfect)", forms: "οἶδα, εἰδέναι", etymology: "From *weyd- 'to see, know'" },
  "ὅτι": { translation: "that", type: "conjunction", forms: "invariable" },
  "οὐδὲν": { translation: "nothing", type: "pronoun", forms: "οὐδείς, οὐδεμία, οὐδέν" },
  "γνῶθι": { translation: "know!", type: "verb (imperative)", forms: "γινώσκω, γνώσομαι", etymology: "From *ǵneh₃-" },
  "σεαυτόν": { translation: "yourself", type: "pronoun (accusative)", forms: "σεαυτοῦ, σεαυτῷ, σεαυτόν" },
  "πάντα": { translation: "all things", type: "pronoun (nominative pl.)", forms: "πᾶς, πᾶσα, πᾶν" },
  "ῥεῖ": { translation: "flows", type: "verb (3rd sg.)", forms: "ῥέω, ῥεύσομαι" },
  // Latin words
  "arma": { translation: "arms, weapons", type: "noun (accusative pl.)", forms: "arma, armōrum (n.)", etymology: "From *h₂er- 'to fit together'" },
  "virumque": { translation: "and the man", type: "noun (accusative) + enclitic", forms: "vir, virī (m.) + -que", etymology: "From *wiHrós 'man'" },
  "cano": { translation: "I sing", type: "verb (1st sg.)", forms: "canō, canere, cecinī, cantus", etymology: "From *kan- 'to sing'" },
  "carpe": { translation: "seize!", type: "verb (imperative)", forms: "carpō, carpere, carpsī, carptus", etymology: "From *kerp- 'to pluck'" },
  "diem": { translation: "day", type: "noun (accusative)", forms: "diēs, diēī (m./f.)", etymology: "From *dyēws 'sky, day'" },
  "veni": { translation: "I came", type: "verb (perfect)", forms: "veniō, venīre, vēnī, ventus", etymology: "From *gʷem- 'to come'" },
  "vidi": { translation: "I saw", type: "verb (perfect)", forms: "videō, vidēre, vīdī, vīsus", etymology: "From *weyd- 'to see'" },
  "vici": { translation: "I conquered", type: "verb (perfect)", forms: "vincō, vincere, vīcī, victus", etymology: "From *weyk- 'to conquer'" },
  "cogito": { translation: "I think", type: "verb (1st sg.)", forms: "cōgitō, cōgitāre, cōgitāvī, cōgitātus", etymology: "From co- + agitāre 'to drive together'" },
  "ergo": { translation: "therefore", type: "adverb", forms: "invariable", etymology: "From *h₁regʷ- 'to direct'" },
  "sum": { translation: "I am", type: "verb (1st sg.)", forms: "sum, esse, fuī, futūrus", etymology: "From *h₁es- 'to be'" },
  "memento": { translation: "remember!", type: "verb (imperative)", forms: "meminī, meminisse" },
  "mori": { translation: "to die", type: "verb (infinitive)", forms: "morior, morī, mortuus" },
  "per": { translation: "through", type: "preposition", forms: "invariable" },
  "aspera": { translation: "hardships", type: "adjective (neuter pl.)", forms: "asper, aspera, asperum" },
  "ad": { translation: "to", type: "preposition", forms: "invariable" },
  "astra": { translation: "stars", type: "noun (accusative pl.)", forms: "astrum, astrī (n.)" },
  "tempus": { translation: "time", type: "noun (nominative)", forms: "tempus, temporis (n.)" },
  "fugit": { translation: "flees", type: "verb (3rd sg.)", forms: "fugiō, fugere, fūgī, fugitūrus" },
  "alea": { translation: "die", type: "noun (nominative)", forms: "alea, aleae (f.)" },
  "iacta": { translation: "cast", type: "participle (feminine)", forms: "iaciō, iacere, iēcī, iactus" },
  "est": { translation: "is", type: "verb (3rd sg.)", forms: "sum, esse, fuī, futūrus" }
};

// Enhanced translation dictionary
const TRANSLATIONS: Record<string, { translation: string; notes: string; language: 'greek' | 'latin'; era: string; author?: string; work?: string }> = {
  "μῆνιν ἄειδε θεὰ": { 
    translation: "Sing, O goddess, of the wrath", 
    notes: "Opening line of Homer's Iliad. The 'wrath' refers to Achilles' rage.", 
    language: 'greek',
    era: 'Archaic',
    author: 'Homer',
    work: 'Iliad'
  },
  "ἓν οἶδα ὅτι οὐδὲν οἶδα": { 
    translation: "One thing I know: that I know nothing", 
    notes: "Socratic paradox expressing intellectual humility",
    language: 'greek',
    era: 'Classical',
    author: 'Socrates'
  },
  "γνῶθι σεαυτόν": { 
    translation: "Know thyself", 
    notes: "Delphic maxim inscribed at the Temple of Apollo",
    language: 'greek',
    era: 'Archaic'
  },
  "πάντα ῥεῖ": { 
    translation: "Everything flows", 
    notes: "Heraclitean doctrine of universal flux",
    language: 'greek',
    era: 'Archaic',
    author: 'Heraclitus'
  },
  "arma virumque cano": { 
    translation: "I sing of arms and the man", 
    notes: "Opening of Virgil's Aeneid, introducing Aeneas",
    language: 'latin',
    era: 'Imperial',
    author: 'Virgil',
    work: 'Aeneid'
  },
  "carpe diem": { 
    translation: "Seize the day", 
    notes: "Horatian philosophy of living in the present moment",
    language: 'latin',
    era: 'Imperial',
    author: 'Horace',
    work: 'Odes'
  },
  "veni vidi vici": { 
    translation: "I came, I saw, I conquered", 
    notes: "Caesar's laconic report of his victory at Zela (47 BCE)",
    language: 'latin',
    era: 'Imperial',
    author: 'Julius Caesar'
  },
  "cogito ergo sum": { 
    translation: "I think, therefore I am", 
    notes: "Cartesian foundational principle of philosophy",
    language: 'latin',
    era: 'Imperial',
    author: 'René Descartes'
  },
  "memento mori": { 
    translation: "Remember you must die", 
    notes: "Stoic reminder of human mortality",
    language: 'latin',
    era: 'Imperial'
  },
  "per aspera ad astra": { 
    translation: "Through hardships to the stars", 
    notes: "Inspirational motto about perseverance",
    language: 'latin',
    era: 'Imperial'
  },
  "tempus fugit": { 
    translation: "Time flies", 
    notes: "Reminder of time's swift passage",
    language: 'latin',
    era: 'Imperial'
  },
  "alea iacta est": { 
    translation: "The die is cast", 
    notes: "Caesar's words when crossing the Rubicon",
    language: 'latin',
    era: 'Imperial',
    author: 'Julius Caesar'
  }
};

const EXAMPLE_PHRASES = [
  "μῆνιν ἄειδε θεὰ",
  "γνῶθι σεαυτόν",
  "πάντα ῥεῖ",
  "arma virumque cano",
  "carpe diem",
  "veni vidi vici",
  "cogito ergo sum",
  "memento mori"
];

export default function TranslatePage() {
  const [inputText, setInputText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [wordBreakdown, setWordBreakdown] = useState<any[]>([]);
  const [detectedLanguage, setDetectedLanguage] = useState<'greek' | 'latin' | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [translationNotes, setTranslationNotes] = useState<any>(null);

  const detectLanguage = (text: string): 'greek' | 'latin' | null => {
    // Greek unicode range
    if (/[\u0370-\u03FF\u1F00-\u1FFF]/.test(text)) {
      return 'greek';
    }
    // Latin characters (could be Latin text)
    if (/[a-zA-Z]/.test(text) && !/[\u0370-\u03FF\u1F00-\u1FFF]/.test(text)) {
      return 'latin';
    }
    return null;
  };

  const translateText = async (text: string) => {
    setIsLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const normalizedText = text.trim().toLowerCase();
    const language = detectLanguage(text);
    setDetectedLanguage(language);
    
    // Check if we have a direct translation
    const directTranslation = TRANSLATIONS[normalizedText];
    if (directTranslation) {
      setTranslatedText(directTranslation.translation);
      setTranslationNotes(directTranslation);
    } else {
      // Try word-by-word translation
      const words = text.split(/\s+/);
      const translations = words.map(word => {
        const cleanWord = word.toLowerCase().replace(/[.,;:!?]/g, '');
        const wordData = WORD_FORMS[cleanWord];
        return wordData ? wordData.translation : `[${word}]`;
      });
      setTranslatedText(translations.join(' '));
      setTranslationNotes(null);
    }
    
    // Generate word breakdown
    const words = text.split(/\s+/);
    const breakdown = words.map(word => {
      const cleanWord = word.toLowerCase().replace(/[.,;:!?]/g, '');
      const wordData = WORD_FORMS[cleanWord];
      return {
        original: word,
        translation: wordData?.translation || `[unknown: ${word}]`,
        type: wordData?.type || 'unknown',
        forms: wordData?.forms || 'N/A',
        etymology: wordData?.etymology || 'Unknown etymology'
      };
    });
    setWordBreakdown(breakdown);
    
    setIsLoading(false);
  };

  const handleTranslate = () => {
    if (inputText.trim()) {
      translateText(inputText);
    }
  };

  const handleExampleClick = (phrase: string) => {
    setInputText(phrase);
    translateText(phrase);
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#0D0D0F', 
      color: '#F5F4F2',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      {/* Navigation */}
      <nav style={{
        backgroundColor: '#1E1E24',
        padding: '16px 24px',
        borderBottom: '1px solid #333'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          gap: '32px'
        }}>
          <Link href="/" style={{
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#C9A227',
            textDecoration: 'none'
          }}>
            LOGOS
          </Link>
          <div style={{ display: 'flex', gap: '24px' }}>
            <Link href="/library" style={{
              color: '#9CA3AF',
              textDecoration: 'none',
              transition: 'color 0.2s'
            }}>Library</Link>
            <Link href="/translate" style={{
              color: '#C9A227',
              textDecoration: 'none'
            }}>Translate</Link>
            <Link href="/learn" style={{
              color: '#9CA3AF',
              textDecoration: 'none',
              transition: 'color 0.2s'
            }}>Learn</Link>
          </div>
        </div>
      </nav>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px' }}>
        {/* Header */}
        <div style={{ marginBottom: '48px' }}>
          <h1 style={{ 
            fontSize: '48px', 
            fontWeight: 'bold', 
            marginBottom: '16px',
            background: 'linear-gradient(45deg, #C9A227, #E8D5A3)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Classical Translator
          </h1>
          <p style={{ 
            fontSize: '20px', 
            color: '#9CA3AF',
            lineHeight: '1.6'
          }}>
            Translate Ancient Greek and Latin texts with detailed linguistic analysis
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
          {/* Input Section */}
          <div style={{
            backgroundColor: '#1E1E24',
            borderRadius: '16px',
            padding: '32px',
            border: '1px solid #333'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>Input</h2>
              {detectedLanguage && (
                <div style={{
                  padding: '4px 12px',
                  borderRadius: '8px',
                  backgroundColor: detectedLanguage === 'greek' ? '#3B82F6' : '#DC2626',
                  color: '#F5F4F2',
                  fontSize: '14px',
                  fontWeight: '500'
                }}>
                  {detectedLanguage === 'greek' ? 'Ancient Greek' : 'Latin'}
                </div>
              )}
            </div>

            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Enter Ancient Greek or Latin text..."
              style={{
                width: '100%',
                height: '200px',
                backgroundColor: '#141419',
                border: '1px solid #333',
                borderRadius: '12px',
                padding: '16px',
                color: '#F5F4F2',
                fontSize: '16px',
                fontFamily: 'Georgia, serif',
                resize: 'vertical',
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#C9A227';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#333';
              }}
            />

            <button
              onClick={handleTranslate}
              disabled={!inputText.trim() || isLoading}
              style={{
                marginTop: '16px',
                width: '100%',
                padding: '16px',
                backgroundColor: inputText.trim() && !isLoading ? '#C9A227' : '#333',
                color: inputText.trim() && !isLoading ? '#0D0D0F' : '#6B7280',
                border: 'none',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: inputText.trim() && !isLoading ? 'pointer' : 'not-allowed',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => {
                if (inputText.trim() && !isLoading) {
                  e.currentTarget.style.backgroundColor = '#E8D5A3';
                }
              }}
              onMouseOut={(e) => {
                if (inputText.trim() && !isLoading) {
                  e.currentTarget.style.backgroundColor = '#C9A227';
                }
              }}
            >
              {isLoading ? 'Translating...' : 'Translate'}
            </button>

            {/* Example Phrases */}
            <div style={{ marginTop: '32px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px', color: '#C9A227' }}>
                Try These Examples
              </h3>
              <div style={{ display: 'grid', gap: '8px' }}>
                {EXAMPLE_PHRASES.map((phrase, index) => (
                  <button
                    key={index}
                    onClick={() => handleExampleClick(phrase)}
                    style={{
                      padding: '12px',
                      backgroundColor: '#141419',
                      border: '1px solid #333',
                      borderRadius: '8px',
                      color: '#F5F4F2',
                      fontSize: '14px',
                      fontFamily: 'Georgia, serif',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      textAlign: 'left'
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.backgroundColor = '#1E1E24';
                      e.currentTarget.style.borderColor = '#C9A227';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.backgroundColor = '#141419';
                      e.currentTarget.style.borderColor = '#333';
                    }}
                  >
                    {phrase}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Output Section */}
          <div style={{
            backgroundColor: '#1E1E24',
            borderRadius: '16px',
            padding: '32px',
            border: '1px solid #333'
          }}>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '24px' }}>Translation</h2>
            
            {isLoading ? (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '200px',
                color: '#9CA3AF'
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  border: '4px solid #333',
                  borderTop: '4px solid #C9A227',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }}>
                  <style>{`
                    @keyframes spin {
                      0% { transform: rotate(0deg); }
                      100% { transform: rotate(360deg); }
                    }
                  `}</style>
                </div>
              </div>
            ) : translatedText ? (
              <div>
                <div style={{
                  backgroundColor: '#141419',
                  border: '1px solid #333',
                  borderRadius: '12px',
                  padding: '24px',
                  marginBottom: '24px'
                }}>
                  <p style={{
                    fontSize: '18px',
                    lineHeight: '1.6',
                    margin: 0,
                    fontFamily: 'Georgia, serif'
                  }}>
                    {translatedText}
                  </p>
                </div>

                {translationNotes && (
                  <div style={{
                    backgroundColor: '#141419',
                    border: '1px solid #C9A227',
                    borderRadius: '12px',
                    padding: '24px',
                    marginBottom: '24px'
                  }}>
                    <h4 style={{ color: '#C9A227', marginBottom: '12px', fontSize: '16px', fontWeight: 'bold' }}>
                      Context & Notes
                    </h4>
                    <p style={{ color: '#9CA3AF', lineHeight: '1.6', marginBottom: '16px' }}>
                      {translationNotes.notes}
                    </p>
                    {translationNotes.author && (
                      <div style={{ display: 'flex', gap: '16px', fontSize: '14px', color: '#6B7280' }}>
                        <span><strong>Author:</strong> {translationNotes.author}</span>
                        {translationNotes.work && <span><strong>Work:</strong> {translationNotes.work}</span>}
                        <span><strong>Era:</strong> {translationNotes.era}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '200px',
                color: '#6B7280',
                fontStyle: 'italic'
              }}>
                Translation will appear here...
              </div>
            )}
          </div>
        </div>

        {/* Word-by-Word Breakdown */}
        {wordBreakdown.length > 0 && (
          <div style={{
            backgroundColor: '#1E1E24',
            borderRadius: '16px',
            padding: '32px',
            border: '1px solid #333',
            marginTop: '32px'
          }}>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '24px', color: '#C9A227' }}>
              Word-by-Word Analysis
            </h2>
            <div style={{ display: 'grid', gap: '16px' }}>
              {wordBreakdown.map((word, index) => (
                <div
                  key={index}
                  style={{
                    backgroundColor: '#141419',
                    border: '1px solid #333',
                    borderRadius: '12px',
                    padding: '20px',
                    transition: 'all 0.2s'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.borderColor = '#C9A227';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.borderColor = '#333';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                      <div style={{ marginBottom: '12px' }}>
                        <span style={{ 
                          fontSize: '20px', 
                          fontFamily: 'Georgia, serif',
                          color: '#F5F4F2',
                          marginRight: '12px'
                        }}>
                          {word.original}
                        </span>
                        <span style={{ 
                          fontSize: '16px',
                          color: '#C9A227',
                          fontWeight: 'bold'
                        }}>
                          {word.translation}
                        </span>
                      </div>
                      <div style={{ color: '#9CA3AF', fontSize: '14px' }}>
                        <div><strong>Type:</strong> {word.type}</div>
                        <div><strong>Forms:</strong> {word.forms}</div>
                      </div>
                    </div>
                    {word.etymology !== 'Unknown etymology' && (
                      <div style={{ color: '#6B7280', fontSize: '14px' }}>
                        <strong>Etymology:</strong> {word.etymology}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}