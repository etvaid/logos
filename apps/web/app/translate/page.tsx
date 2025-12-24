'use client';

import { useState } from 'react';
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
    notes: "Encouraging motto about perseverance through difficulties",
    language: 'latin',
    era: 'Imperial'
  },
  "tempus fugit": { 
    translation: "Time flies", 
    notes: "Reminder of the swift passage of time",
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
  { text: "μῆνιν ἄειδε θεὰ", type: "greek" },
  { text: "γνῶθι σεαυτόν", type: "greek" },
  { text: "πάντα ῥεῖ", type: "greek" },
  { text: "arma virumque cano", type: "latin" },
  { text: "carpe diem", type: "latin" },
  { text: "veni vidi vici", type: "latin" },
  { text: "cogito ergo sum", type: "latin" },
  { text: "memento mori", type: "latin" },
  { text: "per aspera ad astra", type: "latin" }
];

export default function TranslatePage() {
  const [inputText, setInputText] = useState('');
  const [translation, setTranslation] = useState<string>('');
  const [breakdown, setBreakdown] = useState<Array<{ word: string; translation: string; type: string; forms: string; etymology?: string }>>([]);
  const [detectedLanguage, setDetectedLanguage] = useState<'greek' | 'latin' | null>(null);
  const [phraseData, setPhraseData] = useState<any>(null);
  const [isTranslating, setIsTranslating] = useState(false);

  const detectLanguage = (text: string): 'greek' | 'latin' | null => {
    // Greek characters detection
    if (/[\u0370-\u03FF]/.test(text)) return 'greek';
    // Latin characters with common Latin patterns
    if (/[āēīōūăĕĭŏŭ]/.test(text) || /que$|us$|um$|is$|a$/.test(text)) return 'latin';
    // Check if words are in our dictionary
    const words = text.toLowerCase().split(/\s+/);
    for (const word of words) {
      if (WORD_FORMS[word]) {
        const phrase = Object.keys(TRANSLATIONS).find(key => key.includes(word));
        if (phrase && TRANSLATIONS[phrase]) {
          return TRANSLATIONS[phrase].language;
        }
      }
    }
    return null;
  };

  const translateText = async () => {
    if (!inputText.trim()) return;
    
    setIsTranslating(true);
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const cleanText = inputText.trim().toLowerCase();
    const language = detectLanguage(cleanText);
    setDetectedLanguage(language);

    // Check for exact phrase matches first
    const exactMatch = Object.keys(TRANSLATIONS).find(key => 
      key.toLowerCase() === cleanText
    );

    if (exactMatch) {
      const phraseInfo = TRANSLATIONS[exactMatch];
      setTranslation(phraseInfo.translation);
      setPhraseData(phraseInfo);
    } else {
      // Fallback translation for unknown phrases
      setTranslation("Translation not found in database");
      setPhraseData(null);
    }

    // Word-by-word breakdown
    const words = cleanText.split(/\s+/);
    const wordBreakdown = words.map(word => {
      const cleanWord = word.replace(/[.,;:!?]/g, '');
      const wordData = WORD_FORMS[cleanWord];
      
      if (wordData) {
        return {
          word: cleanWord,
          translation: wordData.translation,
          type: wordData.type,
          forms: wordData.forms,
          etymology: wordData.etymology
        };
      } else {
        return {
          word: cleanWord,
          translation: "unknown",
          type: "unknown",
          forms: "—",
          etymology: undefined
        };
      }
    });

    setBreakdown(wordBreakdown);
    setIsTranslating(false);
  };

  const loadExamplePhrase = (phrase: string) => {
    setInputText(phrase);
    setTranslation('');
    setBreakdown([]);
    setDetectedLanguage(null);
    setPhraseData(null);
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
        padding: '16px 24px', 
        backgroundColor: '#1E1E24', 
        borderBottom: '1px solid #333',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{ 
          maxWidth: '1200px', 
          margin: '0 auto', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between' 
        }}>
          <Link href="/" style={{ 
            fontSize: '24px', 
            fontWeight: 'bold', 
            color: '#C9A227', 
            textDecoration: 'none',
            transition: 'all 0.2s'
          }}>
            ΛΟΓΟΣ
          </Link>
          <div style={{ display: 'flex', gap: '24px' }}>
            <Link href="/learn" style={{ 
              color: '#9CA3AF', 
              textDecoration: 'none',
              transition: 'all 0.2s',
              padding: '8px 16px',
              borderRadius: '8px'
            }} 
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#C9A227';
              e.currentTarget.style.backgroundColor = '#1E1E24';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#9CA3AF';
              e.currentTarget.style.backgroundColor = 'transparent';
            }}>
              Learn
            </Link>
            <Link href="/texts" style={{ 
              color: '#9CA3AF', 
              textDecoration: 'none',
              transition: 'all 0.2s',
              padding: '8px 16px',
              borderRadius: '8px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#C9A227';
              e.currentTarget.style.backgroundColor = '#1E1E24';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#9CA3AF';
              e.currentTarget.style.backgroundColor = 'transparent';
            }}>
              Texts
            </Link>
            <Link href="/translate" style={{ 
              color: '#C9A227', 
              textDecoration: 'none',
              padding: '8px 16px',
              borderRadius: '8px',
              backgroundColor: '#1E1E24'
            }}>
              Translate
            </Link>
            <Link href="/culture" style={{ 
              color: '#9CA3AF', 
              textDecoration: 'none',
              transition: 'all 0.2s',
              padding: '8px 16px',
              borderRadius: '8px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#C9A227';
              e.currentTarget.style.backgroundColor = '#1E1E24';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#9CA3AF';
              e.currentTarget.style.backgroundColor = 'transparent';
            }}>
              Culture
            </Link>
          </div>
        </div>
      </nav>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '48px 24px' }}>
        <h1 style={{ 
          fontSize: '48px', 
          fontWeight: 'bold', 
          marginBottom: '16px',
          background: 'linear-gradient(135deg, #C9A227, #E8D5A3)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textAlign: 'center'
        }}>
          Ancient Text Translator
        </h1>
        
        <p style={{ 
          color: '#9CA3AF', 
          fontSize: '18px', 
          textAlign: 'center', 
          marginBottom: '48px',
          maxWidth: '600px',
          margin: '0 auto 48px auto'
        }}>
          Translate Ancient Greek and Latin texts with detailed word-by-word analysis
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginBottom: '32px' }}>
          {/* Input Section */}
          <div style={{ 
            backgroundColor: '#1E1E24', 
            padding: '24px', 
            borderRadius: '12px',
            border: '1px solid #333'
          }}>
            <h2 style={{ 
              fontSize: '20px', 
              fontWeight: 'bold', 
              marginBottom: '16px',
              color: '#C9A227'
            }}>
              Input Text
            </h2>
            
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Enter Ancient Greek or Latin text..."
              style={{
                width: '100%',
                height: '120px',
                backgroundColor: '#141419',
                border: '2px solid #333',
                borderRadius: '8px',
                padding: '16px',
                color: '#F5F4F2',
                fontSize: '16px',
                fontFamily: 'Georgia, serif',
                resize: 'vertical',
                transition: 'all 0.2s',
                outline: 'none'
              }}
              onFocus={(e) => e.target.style.borderColor = '#C9A227'}
              onBlur={(e) => e.target.style.borderColor = '#333'}
            />

            {detectedLanguage && (
              <div style={{ 
                marginTop: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <div style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  backgroundColor: detectedLanguage === 'greek' ? '#3B82F6' : '#DC2626'
                }}></div>
                <span style={{ color: '#9CA3AF', fontSize: '14px' }}>
                  Detected: {detectedLanguage === 'greek' ? 'Ancient Greek' : 'Latin'}
                </span>
              </div>
            )}

            <button
              onClick={translateText}
              disabled={!inputText.trim() || isTranslating}
              style={{
                marginTop: '16px',
                width: '100%',
                padding: '12px 24px',
                backgroundColor: inputText.trim() && !isTranslating ? '#C9A227' : '#333',
                color: inputText.trim() && !isTranslating ? '#0D0D0F' : '#6B7280',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: inputText.trim() && !isTranslating ? 'pointer' : 'not-allowed',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                if (inputText.trim() && !isTranslating) {
                  e.currentTarget.style.backgroundColor = '#E8D5A3';
                }
              }}
              onMouseLeave={(e) => {
                if (inputText.trim() && !isTranslating) {
                  e.currentTarget.style.backgroundColor = '#C9A227';
                }
              }}
            >
              {isTranslating ? 'Translating...' : 'Translate'}
            </button>
          </div>

          {/* Output Section */}
          <div style={{ 
            backgroundColor: '#1E1E24', 
            padding: '24px', 
            borderRadius: '12px',
            border: '1px solid #333'
          }}>
            <h2 style={{ 
              fontSize: '20px', 
              fontWeight: 'bold', 
              marginBottom: '16px',
              color: '#C9A227'
            }}>
              Translation
            </h2>
            
            {translation ? (
              <div>
                <div style={{
                  backgroundColor: '#141419',
                  padding: '16px',
                  borderRadius: '8px',
                  marginBottom: '16px',
                  border: '1px solid #333'
                }}>
                  <p style={{ 
                    fontSize: '18px', 
                    fontStyle: 'italic',
                    marginBottom: phraseData ? '12px' : '0'
                  }}>
                    "{translation}"
                  </p>
                  
                  {phraseData && (
                    <div style={{ borderTop: '1px solid #333', paddingTop: '12px' }}>
                      <p style={{ 
                        color: '#9CA3AF', 
                        fontSize: '14px',
                        marginBottom: '8px'
                      }}>
                        {phraseData.notes}
                      </p>
                      
                      <div style={{ display: 'flex', gap: '16px', fontSize: '12px' }}>
                        <span style={{ 
                          color: phraseData.language === 'greek' ? '#3B82F6' : '#DC2626',
                          fontWeight: 'bold'
                        }}>
                          {phraseData.language === 'greek' ? 'Ancient Greek' : 'Latin'}
                        </span>
                        <span style={{ color: '#6B7280' }}>
                          {phraseData.era}
                        </span>
                        {phraseData.author && (
                          <span style={{ color: '#9CA3AF' }}>
                            {phraseData.author}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div style={{
                backgroundColor: '#141419',
                padding: '16px',
                borderRadius: '8px',
                border: '1px solid #333',
                textAlign: 'center',
                color: '#6B7280'
              }}>
                Translation will appear here...
              </div>
            )}
          </div>
        </div>

        {/* Word-by-word breakdown */}
        {breakdown.length > 0 && (
          <div style={{ 
            backgroundColor: '#1E1E24', 
            padding: '24px', 
            borderRadius: '12px',
            border: '1px solid #333',
            marginBottom: '32px'
          }}>
            <h2 style={{ 
              fontSize: '20px', 
              fontWeight: 'bold', 
              marginBottom: '16px',
              color: '#C9A227'
            }}>
              Word-by-Word Analysis
            </h2>
            
            <div style={{ display: 'grid', gap: '16px' }}>
              {breakdown.map((word, index) => (
                <div key={index} style={{
                  backgroundColor: '#141419',
                  padding: '16px',
                  borderRadius: '8px',
                  border: '1px solid #333'
                }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '16px', marginBottom: '8px' }}>
                    <span style={{ 
                      fontSize: '18px', 
                      fontWeight: 'bold',
                      fontFamily: 'Georgia, serif'
                    }}>
                      {word.word}
                    </span>
                    <span style={{ 
                      fontSize: '16px',
                      color: '#C9A227'
                    }}>
                      {word.translation}
                    </span>
                    <span style={{ 
                      fontSize: '14px',
                      color: '#6B7280',
                      fontStyle: 'italic'
                    }}>
                      {word.type}
                    </span>
                  </div>
                  
                  <div style={{ fontSize: '14px', color: '#9CA3AF' }}>
                    <strong>Forms:</strong> {word.forms}
                  </div>
                  
                  {word.etymology && (
                    <div style={{ fontSize: '12px', color: '#6B7280', marginTop: '4px' }}>
                      <strong>Etymology:</strong> {word.etymology}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Example Phrases */}
        <div style={{ 
          backgroundColor: '#1E1E24', 
          padding: '24px', 
          borderRadius: '12px',
          border: '1px solid #333'
        }}>
          <h2 style={{ 
            fontSize: '20px', 
            fontWeight: 'bold', 
            marginBottom: '16px',
            color: '#C9A227'
          }}>
            Example Phrases
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
            {EXAMPLE_PHRASES.map((phrase, index) => (
              <button
                key={index}
                onClick={() => loadExamplePhrase(phrase.text)}
                style={{
                  backgroundColor: '#141419',
                  border: `2px solid ${phrase.type === 'greek' ? '#3B82F6' : '#DC2626'}`,
                  borderRadius: '8px',
                  padding: '16px',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  color: '#F5F4F2'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#1E1E24';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#141419';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div style={{ 
                  fontSize: '16px', 
                  fontFamily: 'Georgia, serif',
                  marginBottom: '4px'
                }}>
                  {phrase.text}
                </div>
                <div style={{ 
                  fontSize: '12px', 
                  color: phrase.type === 'greek' ? '#3B82F6' : '#DC2626',
                  fontWeight: 'bold'
                }}>
                  {phrase.type === 'greek' ? 'Ancient Greek' : 'Latin'}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}