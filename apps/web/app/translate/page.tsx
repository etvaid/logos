
'use client';

import { useState } from 'react';
import Link from 'next/link';

const TRANSLATIONS: Record<string, { translation: string; notes: string }> = {
  "μῆνιν ἄειδε θεὰ": { translation: "Sing, O goddess, of the wrath", notes: "Opening line of Homer's Iliad. μῆνιν (wrath) is the first word, emphasizing the theme." },
  "arma virumque cano": { translation: "I sing of arms and the man", notes: "Opening of Virgil's Aeneid. Deliberately echoes Homer while adding Roman martial emphasis." },
  "cogito ergo sum": { translation: "I think, therefore I am", notes: "Descartes' famous philosophical statement, though written in the early modern period." },
  "γνῶθι σεαυτόν": { translation: "Know thyself", notes: "Inscribed at the Temple of Apollo at Delphi. Attributed to various sages." },
  "carpe diem": { translation: "Seize the day", notes: "From Horace's Odes 1.11. Full phrase: carpe diem, quam minimum credula postero." },
  "veni vidi vici": { translation: "I came, I saw, I conquered", notes: "Julius Caesar's report to the Roman Senate after his swift victory at Zela in 47 BCE." },
  "ἓν οἶδα ὅτι οὐδὲν οἶδα": { translation: "I know that I know nothing", notes: "Socratic paradox from Plato's Apology. Foundation of philosophical humility." },
  "amor vincit omnia": { translation: "Love conquers all", notes: "From Virgil's Eclogues 10.69. Became a medieval and Renaissance motto." },
  "πάντα ῥεῖ": { translation: "Everything flows", notes: "Attributed to Heraclitus. Expresses the doctrine of universal flux." },
  "tempus fugit": { translation: "Time flies", notes: "From Virgil's Georgics 3.284: 'fugit irreparabile tempus' (irretrievable time flies)." },
};

const WORD_DICTIONARY: Record<string, { meaning: string; partOfSpeech: string }> = {
  "μῆνιν": { meaning: "wrath, anger", partOfSpeech: "noun (accusative)" },
  "ἄειδε": { meaning: "sing!", partOfSpeech: "verb (imperative)" },
  "θεὰ": { meaning: "goddess", partOfSpeech: "noun (vocative)" },
  "arma": { meaning: "arms, weapons", partOfSpeech: "noun (accusative plural)" },
  "virum": { meaning: "man, hero", partOfSpeech: "noun (accusative)" },
  "cano": { meaning: "I sing", partOfSpeech: "verb (1st person)" },
  "amor": { meaning: "love", partOfSpeech: "noun" },
  "vincit": { meaning: "conquers", partOfSpeech: "verb (3rd person)" },
  "omnia": { meaning: "all things", partOfSpeech: "noun (accusative plural)" },
  "tempus": { meaning: "time", partOfSpeech: "noun" },
  "fugit": { meaning: "flees, flies", partOfSpeech: "verb (3rd person)" },
};

const EXAMPLES = [
  "μῆνιν ἄειδε θεὰ",
  "arma virumque cano",
  "carpe diem",
  "veni vidi vici",
  "amor vincit omnia",
];

export default function TranslatePage() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<{ translation: string; notes: string; words: { word: string; meaning: string; pos: string }[] } | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);

  const translate = () => {
    if (!input.trim()) return;
    setIsTranslating(true);

    setTimeout(() => {
      const lower = input.toLowerCase().trim();
      const exact = TRANSLATIONS[lower];

      if (exact) {
        setResult({ translation: exact.translation, notes: exact.notes, words: [] });
      } else {
        // Word-by-word
        const words = input.split(/\s+/).map(w => {
          const clean = w.toLowerCase().replace(/[.,;:!?]/g, '');
          const entry = WORD_DICTIONARY[clean];
          return {
            word: w,
            meaning: entry?.meaning || '[unknown]',
            pos: entry?.partOfSpeech || '',
          };
        });
        setResult({
          translation: words.map(w => w.meaning).join(' '),
          notes: 'Word-by-word translation. Context may alter meaning.',
          words,
        });
      }
      setIsTranslating(false);
    }, 500);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0D0D0F', color: '#F5F4F2' }}>
      <nav style={{ borderBottom: '1px solid #2D2D35', padding: '16px 0' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link href="/" style={{ fontSize: '24px', fontWeight: 'bold', color: '#C9A227', textDecoration: 'none' }}>LOGOS</Link>
          <div style={{ display: 'flex', gap: '24px' }}>
            <Link href="/search" style={{ color: '#9CA3AF', textDecoration: 'none' }}>Search</Link>
            <Link href="/translate" style={{ color: '#C9A227', textDecoration: 'none' }}>Translate</Link>
            <Link href="/semantia" style={{ color: '#9CA3AF', textDecoration: 'none' }}>SEMANTIA</Link>
            <Link href="/maps" style={{ color: '#9CA3AF', textDecoration: 'none' }}>Maps</Link>
          </div>
        </div>
      </nav>

      <main style={{ maxWidth: '1000px', margin: '0 auto', padding: '32px 24px' }}>
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '36px', fontWeight: 'bold', color: '#C9A227', marginBottom: '8px' }}>AI Translation</h1>
          <p style={{ color: '#9CA3AF' }}>Context-aware translation of Greek and Latin texts</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
          {/* Input */}
          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: '#9CA3AF', fontSize: '14px' }}>Greek or Latin Text</label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter text to translate..."
              style={{
                width: '100%',
                height: '200px',
                padding: '16px',
                backgroundColor: '#1E1E24',
                border: '1px solid #2D2D35',
                borderRadius: '12px',
                color: '#F5F4F2',
                fontSize: '18px',
                fontFamily: 'Georgia, serif',
                resize: 'none',
                outline: 'none',
              }}
            />
          </div>

          {/* Output */}
          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: '#9CA3AF', fontSize: '14px' }}>Translation</label>
            <div
              style={{
                width: '100%',
                height: '200px',
                padding: '16px',
                backgroundColor: '#1E1E24',
                border: '1px solid #2D2D35',
                borderRadius: '12px',
                fontSize: '18px',
                overflow: 'auto',
              }}
            >
              {isTranslating ? (
                <span style={{ color: '#9CA3AF' }}>Translating...</span>
              ) : result ? (
                <div>
                  <p style={{ marginBottom: '12px', lineHeight: '1.6' }}>{result.translation}</p>
                  {result.notes && (
                    <p style={{ color: '#9CA3AF', fontSize: '14px', fontStyle: 'italic' }}>{result.notes}</p>
                  )}
                </div>
              ) : (
                <span style={{ color: '#6B7280' }}>Translation will appear here...</span>
              )}
            </div>
          </div>
        </div>

        <button
          onClick={translate}
          disabled={!input.trim() || isTranslating}
          style={{
            padding: '14px 32px',
            backgroundColor: input.trim() ? '#C9A227' : '#2D2D35',
            color: input.trim() ? '#0D0D0F' : '#6B7280',
            border: 'none',
            borderRadius: '10px',
            fontWeight: 'bold',
            cursor: input.trim() ? 'pointer' : 'not-allowed',
            fontSize: '16px',
            marginBottom: '32px',
          }}
        >
          Translate
        </button>

        {/* Word-by-word breakdown */}
        {result?.words && result.words.length > 0 && (
          <div style={{ backgroundColor: '#1E1E24', borderRadius: '12px', padding: '24px', marginBottom: '32px', border: '1px solid #2D2D35' }}>
            <h3 style={{ fontWeight: 'bold', marginBottom: '16px', color: '#C9A227' }}>Word Analysis</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
              {result.words.map((w, i) => (
                <div key={i} style={{ textAlign: 'center', padding: '12px 16px', backgroundColor: '#141419', borderRadius: '8px' }}>
                  <div style={{ fontSize: '20px', fontFamily: 'Georgia, serif', marginBottom: '4px' }}>{w.word}</div>
                  <div style={{ color: '#C9A227', fontSize: '14px' }}>{w.meaning}</div>
                  {w.pos && <div style={{ color: '#6B7280', fontSize: '12px' }}>{w.pos}</div>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Examples */}
        <div>
          <h3 style={{ fontWeight: 'bold', marginBottom: '16px' }}>Try these famous phrases</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
            {EXAMPLES.map(ex => (
              <button
                key={ex}
                onClick={() => setInput(ex)}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#1E1E24',
                  border: '1px solid #2D2D35',
                  borderRadius: '8px',
                  color: '#F5F4F2',
                  cursor: 'pointer',
                  fontFamily: 'Georgia, serif',
                  fontSize: '15px',
                }}
              >
                {ex}
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
