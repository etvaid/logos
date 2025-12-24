'use client';

import { useState } from 'react';
import Link from 'next/link';

// Word forms dictionary
const WORD_FORMS: Record<string, { translation: string; type: string; forms: string; etymology?: string; lsj?: string; embedding?: number[]; semanticHistory?: Array<{period: string; meaning: string; evidence: string; color: string}> }> = {
  // Greek words
  "μῆνιν": { 
    translation: "wrath, rage", 
    type: "noun (accusative)", 
    forms: "μῆνις, μῆνιδος (f.)", 
    etymology: "From Proto-Indo-European *mēnis-",
    lsj: "μῆνις, ιδος, ἡ, wrath, anger, esp. of the gods",
    embedding: [0.2, 0.8, 0.1, 0.9, 0.3],
    semanticHistory: [
      { period: "Archaic", meaning: "divine wrath", evidence: "Homer Il. 1.1", color: "#D97706" },
      { period: "Classical", meaning: "human anger", evidence: "Aeschylus Ag. 155", color: "#F59E0B" },
      { period: "Hellenistic", meaning: "resentment", evidence: "Polybius 1.35.6", color: "#3B82F6" }
    ]
  },
  "ἄειδε": { 
    translation: "sing!", 
    type: "verb (imperative 2sg)", 
    forms: "ἀείδω, ἀείσω, ἤεισα", 
    etymology: "From *aweyd- 'to sing'",
    lsj: "ἀείδω, sing, chant, esp. epic poetry",
    embedding: [0.7, 0.3, 0.8, 0.2, 0.6]
  },
  "θεὰ": { 
    translation: "goddess", 
    type: "noun (vocative)", 
    forms: "θεός, θεοῦ (m./f.)", 
    etymology: "From *dheh₁s- 'divine'",
    lsj: "θεός, οῦ, ὁ, ἡ, god, goddess, divine being",
    embedding: [0.9, 0.1, 0.7, 0.8, 0.4]
  },
  "λόγος": { 
    translation: "word, reason", 
    type: "noun (nominative)", 
    forms: "λόγος, λόγου (m.)", 
    etymology: "From *leg- 'to gather, speak'",
    lsj: "λόγος, ου, ὁ, word, speech, reason, account",
    embedding: [0.5, 0.9, 0.3, 0.7, 0.8],
    semanticHistory: [
      { period: "Archaic", meaning: "speech, tale", evidence: "Homer Od. 1.56", color: "#D97706" },
      { period: "Classical", meaning: "reason, argument", evidence: "Heraclitus DK 22 B1", color: "#F59E0B" },
      { period: "Hellenistic", meaning: "divine principle", evidence: "Stoic sources", color: "#3B82F6" },
      { period: "Imperial", meaning: "Christian Logos", evidence: "John 1:1", color: "#DC2626" }
    ]
  },
  // Latin words
  "arma": { 
    translation: "arms, weapons", 
    type: "noun (accusative pl.)", 
    forms: "arma, armōrum (n.)", 
    etymology: "From *h₂er- 'to fit together'",
    embedding: [0.8, 0.2, 0.9, 0.1, 0.5]
  },
  "virumque": { 
    translation: "and the man", 
    type: "noun (acc.) + enclitic", 
    forms: "vir, virī (m.) + -que", 
    etymology: "From *wiHrós 'man'",
    embedding: [0.6, 0.4, 0.7, 0.3, 0.8]
  },
  "virtus": {
    translation: "virtue, courage",
    type: "noun (nominative)",
    forms: "virtūs, virtūtis (f.)",
    etymology: "From vir 'man' + -tūs",
    embedding: [0.4, 0.8, 0.2, 0.9, 0.6],
    semanticHistory: [
      { period: "Archaic", meaning: "manliness, physical strength", evidence: "Ennius Ann. 363", color: "#D97706" },
      { period: "Classical", meaning: "moral excellence", evidence: "Cicero Rep. 1.2", color: "#F59E0B" },
      { period: "Imperial", meaning: "Christian virtue", evidence: "Augustine Conf. 8.1", color: "#DC2626" },
      { period: "Late Antique", meaning: "ascetic virtue", evidence: "Jerome Ep. 22.7", color: "#7C3AED" }
    ]
  }
};

// Manuscript variants
const MANUSCRIPT_VARIANTS: Record<string, Array<{ms: string; reading: string; date: string; location: string}>> = {
  "μῆνιν": [
    { ms: "A (Venetus A)", reading: "μῆνιν", date: "10th c.", location: "Venice" },
    { ms: "B (Venetus B)", reading: "μῆνιν", date: "11th c.", location: "Venice" },
    { ms: "T (Townleyanus)", reading: "μῆνιν", date: "11th c.", location: "London" }
  ],
  "ἄειδε": [
    { ms: "A", reading: "ἄειδε", date: "10th c.", location: "Venice" },
    { ms: "B", reading: "ἄειδε", date: "11th c.", location: "Venice" },
    { ms: "Π¹", reading: "εἰδε", date: "12th c.", location: "Paris" }
  ],
  "arma": [
    { ms: "M (Mediceus)", reading: "arma", date: "5th c.", location: "Florence" },
    { ms: "P (Palatinus)", reading: "arma", date: "4th-5th c.", location: "Vatican" },
    { ms: "R (Romanus)", reading: "arma", date: "5th c.", location: "Vatican" }
  ],
  "λόγος": [
    { ms: "P.Oxy. 2069", reading: "λόγος", date: "3rd c. CE", location: "Oxyrhynchus" },
    { ms: "Laurentianus", reading: "λόγος", date: "9th c.", location: "Florence" }
  ]
};

// Example sentences
const EXAMPLE_SENTENCES = [
  {
    id: 1,
    language: "Greek",
    indicator: "Α",
    color: "#3B82F6",
    text: "μῆνιν ἄειδε θεὰ Πηληϊάδεω Ἀχιλῆος",
    translation: "Sing, goddess, of the wrath of Achilles, son of Peleus",
    source: "Homer, Iliad 1.1",
    period: "Archaic"
  },
  {
    id: 2,
    language: "Greek",
    indicator: "Α",
    color: "#3B82F6",
    text: "ἐν ἀρχῇ ἦν ὁ λόγος",
    translation: "In the beginning was the Word",
    source: "John 1:1",
    period: "Imperial"
  },
  {
    id: 3,
    language: "Latin",
    indicator: "L",
    color: "#DC2626",
    text: "Arma virumque cano, Troiae qui primus ab oris",
    translation: "I sing of arms and the man, who first from the shores of Troy",
    source: "Virgil, Aeneid 1.1",
    period: "Imperial"
  }
];

// Declension tables
const PARADIGM_TABLES: Record<string, {type: string; forms: Array<{case: string; singular: string; plural: string}>}> = {
  "μῆνις": {
    type: "Third Declension (Feminine)",
    forms: [
      { case: "Nominative", singular: "μῆνις", plural: "μήνιδες" },
      { case: "Genitive", singular: "μήνιδος", plural: "μηνίδων" },
      { case: "Dative", singular: "μήνιδι", plural: "μήνισι(ν)" },
      { case: "Accusative", singular: "μῆνιν", plural: "μήνιδας" },
      { case: "Vocative", singular: "μῆνι", plural: "μήνιδες" }
    ]
  },
  "λόγος": {
    type: "Second Declension (Masculine)",
    forms: [
      { case: "Nominative", singular: "λόγος", plural: "λόγοι" },
      { case: "Genitive", singular: "λόγου", plural: "λόγων" },
      { case: "Dative", singular: "λόγῳ", plural: "λόγοις" },
      { case: "Accusative", singular: "λόγον", plural: "λόγους" },
      { case: "Vocative", singular: "λόγε", plural: "λόγοι" }
    ]
  },
  "virtus": {
    type: "Third Declension (Feminine)",
    forms: [
      { case: "Nominative", singular: "virtūs", plural: "virtūtēs" },
      { case: "Genitive", singular: "virtūtis", plural: "virtūtum" },
      { case: "Dative", singular: "virtūtī", plural: "virtūtibus" },
      { case: "Accusative", singular: "virtūtem", plural: "virtūtēs" },
      { case: "Ablative", singular: "virtūte", plural: "virtūtibus" }
    ]
  }
};

export default function TranslatePage() {
  const [inputText, setInputText] = useState("μῆνιν ἄειδε θεὰ Πηληϊάδεω Ἀχιλῆος");
  const [hoveredWord, setHoveredWord] = useState<string | null>(null);
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'morphology' | 'variants' | 'examples' | 'paradigm'>('morphology');
  const [showEmbeddings, setShowEmbeddings] = useState(false);

  const getWordsFromText = (text: string) => {
    return text.split(/\s+/).filter(word => word.length > 0);
  };

  const renderWordEmbedding = (word: string) => {
    const wordData = WORD_FORMS[word];
    if (!wordData?.embedding) return null;

    return (
      <div style={{ backgroundColor: '#1E1E24', padding: '16px', borderRadius: '8px', marginTop: '12px' }}>
        <h4 style={{ color: '#F5F4F2', fontSize: '14px', marginBottom: '12px', fontWeight: '600' }}>
          Word Embedding Visualization
        </h4>
        <svg width="200" height="100" style={{ backgroundColor: '#141419', borderRadius: '4px' }}>
          {wordData.embedding.map((value, i) => (
            <rect
              key={i}
              x={i * 35 + 10}
              y={90 - (value * 70)}
              width="25"
              height={value * 70}
              fill="#C9A227"
              opacity={0.8}
            />
          ))}
          {wordData.embedding.map((value, i) => (
            <text
              key={i}
              x={i * 35 + 22}
              y="105"
              fill="#9CA3AF"
              fontSize="10"
              textAnchor="middle"
            >
              {i + 1}
            </text>
          ))}
        </svg>
        <p style={{ color: '#6B7280', fontSize: '12px', marginTop: '8px' }}>
          Semantic dimensions in 5D vector space
        </p>
      </div>
    );
  };

  const renderSemanticHistory = (word: string) => {
    const wordData = WORD_FORMS[word];
    if (!wordData?.semanticHistory) return null;

    return (
      <div style={{ backgroundColor: '#1E1E24', padding: '16px', borderRadius: '8px', marginTop: '12px' }}>
        <h4 style={{ color: '#F5F4F2', fontSize: '14px', marginBottom: '12px', fontWeight: '600' }}>
          Semantic Drift Analysis
        </h4>
        <div style={{ position: 'relative' }}>
          {wordData.semanticHistory.map((item, index) => (
            <div key={index} style={{ 
              display: 'flex', 
              alignItems: 'center', 
              marginBottom: '8px',
              padding: '8px',
              backgroundColor: '#141419',
              borderRadius: '4px',
              borderLeft: `3px solid ${item.color}`
            }}>
              <div style={{ 
                backgroundColor: item.color, 
                color: '#000', 
                padding: '2px 6px', 
                borderRadius: '4px', 
                fontSize: '10px', 
                fontWeight: 'bold',
                minWidth: '80px',
                textAlign: 'center'
              }}>
                {item.period}
              </div>
              <div style={{ marginLeft: '12px', flex: 1 }}>
                <div style={{ color: '#F5F4F2', fontSize: '12px' }}>{item.meaning}</div>
                <div style={{ color: '#6B7280', fontSize: '10px' }}>{item.evidence}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div style={{ backgroundColor: '#0D0D0F', minHeight: '100vh', color: '#F5F4F2' }}>
      {/* Header */}
      <header style={{ backgroundColor: '#1E1E24', borderBottom: '1px solid #374151', padding: '16px 0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
              <div style={{ 
                backgroundColor: '#C9A227', 
                width: '32px', 
                height: '32px', 
                borderRadius: '50%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                marginRight: '12px'
              }}>
                <span style={{ color: '#0D0D0F', fontWeight: 'bold', fontSize: '18px' }}>Λ</span>
              </div>
              <h1 style={{ color: '#F5F4F2', fontSize: '24px', fontWeight: 'bold' }}>LOGOS</h1>
            </Link>
            
            <nav style={{ display: 'flex', gap: '24px' }}>
              <Link href="/search" style={{ color: '#9CA3AF', textDecoration: 'none', transition: 'color 0.2s' }}>Search</Link>
              <Link href="/analyze" style={{ color: '#9CA3AF', textDecoration: 'none', transition: 'color 0.2s' }}>Analyze</Link>
              <Link href="/translate" style={{ color: '#C9A227', textDecoration: 'none' }}>Translate</Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px' }}>
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '8px' }}>
            Critical Translation Engine
          </h1>
          <p style={{ color: '#9CA3AF', fontSize: '18px' }}>
            Advanced morphological analysis with manuscript apparatus and semantic history
          </p>
        </div>

        {/* Input Section */}
        <div style={{ 
          backgroundColor: '#1E1E24', 
          padding: '24px', 
          borderRadius: '12px', 
          marginBottom: '32px',
          border: '1px solid #374151'
        }}>
          <label style={{ 
            display: 'block', 
            color: '#F5F4F2', 
            fontSize: '14px', 
            fontWeight: '600', 
            marginBottom: '8px' 
          }}>
            Text to Translate
          </label>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Enter Greek or Latin text..."
            style={{ 
              width: '100%', 
              height: '120px', 
              backgroundColor: '#141419', 
              border: '1px solid #374151', 
              borderRadius: '8px', 
              padding: '12px', 
              color: '#F5F4F2', 
              fontSize: '16px',
              fontFamily: 'serif',
              resize: 'vertical',
              transition: 'border-color 0.2s'
            }}
          />
          
          <div style={{ marginTop: '16px', display: 'flex', gap: '12px', alignItems: 'center' }}>
            <button
              onClick={() => setShowEmbeddings(!showEmbeddings)}
              style={{
                backgroundColor: showEmbeddings ? '#C9A227' : '#374151',
                color: showEmbeddings ? '#0D0D0F' : '#F5F4F2',
                padding: '8px 16px',
                borderRadius: '6px',
                border: 'none',
                fontSize: '14px',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              {showEmbeddings ? 'Hide' : 'Show'} Word Embeddings
            </button>
            
            <div style={{ color: '#6B7280', fontSize: '12px' }}>
              Click words for detailed analysis • Hover for quick translation
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '32px' }}>
          {/* Word-by-word translation */}
          <div style={{ backgroundColor: '#1E1E24', padding: '24px', borderRadius: '12px', border: '1px solid #374151' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>
              Word-by-Word Analysis
            </h2>
            
            <div style={{ 
              fontSize: '20px', 
              lineHeight: '1.8', 
              fontFamily: 'serif',
              marginBottom: '24px'
            }}>
              {getWordsFromText(inputText).map((word, index) => {
                const cleanWord = word.replace(/[.,;:!?]/g, '');
                const wordData = WORD_FORMS[cleanWord];
                const isHovered = hoveredWord === cleanWord;
                const isSelected = selectedWord === cleanWord;
                
                return (
                  <span key={index} style={{ position: 'relative', display: 'inline-block' }}>
                    <span
                      onMouseEnter={() => setHoveredWord(cleanWord)}
                      onMouseLeave={() => setHoveredWord(null)}
                      onClick={() => setSelectedWord(isSelected ? null : cleanWord)}
                      style={{
                        cursor: wordData ? 'pointer' : 'default',
                        backgroundColor: isSelected ? '#C9A227' : isHovered ? '#374151' : 'transparent',
                        color: isSelected ? '#0D0D0F' : '#F5F4F2',
                        padding: '2px 4px',
                        borderRadius: '4px',
                        transition: 'all 0.2s',
                        marginRight: '8px',
                        position: 'relative'
                      }}
                    >
                      {word}
                    </span>
                    
                    {/* Hover tooltip */}
                    {isHovered && wordData && !isSelected && (
                      <div style={{
                        position: 'absolute',
                        top: '100%',
                        left: '0',
                        backgroundColor: '#141419',
                        border: '1px solid #C9A227',
                        borderRadius: '8px',
                        padding: '8px',
                        zIndex: 10,
                        minWidth: '200px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
                      }}>
                        <div style={{ color: '#C9A227', fontSize: '14px', fontWeight: 'bold' }}>
                          {wordData.translation}
                        </div>
                        <div style={{ color: '#9CA3AF', fontSize: '12px' }}>
                          {wordData.type}
                        </div>
                      </div>
                    )}
                  </span>
                );
              })}
            </div>

            {/* Translation */}
            <div style={{ 
              backgroundColor: '#141419', 
              padding: '16px', 
              borderRadius: '8px',
              borderLeft: '4px solid #C9A227'
            }}>
              <h3 style={{ fontSize: '14px', color: '#C9A227', marginBottom: '8px', fontWeight: '600' }}>
                TRANSLATION
              </h3>
              <p style={{ fontSize: '16px', lineHeight: '1.6' }}>
                {inputText.includes("μῆνιν") ? "Sing, goddess, of the wrath of Achilles, son of Peleus" : 
                 inputText.includes("arma") ? "I sing of arms and the man, who first from the shores of Troy" :
                 "Enter text above for translation"}
              </p>
            </div>
          </div>

          {/* Analysis Panel */}
          <div style={{ backgroundColor: '#1E1E24', padding: '24px', borderRadius: '12px', border: '1px solid #374151' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>
              {selectedWord ? `Analysis: ${selectedWord}` : 'Select a word for analysis'}
            </h2>

            {selectedWord && WORD_FORMS[selectedWord] && (
              <>
                {/* Tab Navigation */}
                <div style={{ 
                  display: 'flex', 
                  borderBottom: '1px solid #374151', 
                  marginBottom: '16px',
                  gap: '4px'
                }}>
                  {[
                    { key: 'morphology' as const, label: 'Morphology' },
                    { key: 'variants' as const, label: 'Variants' },
                    { key: 'examples' as const, label: 'Examples' },
                    { key: 'paradigm' as const, label: 'Paradigm' }
                  ].map(tab => (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key)}
                      style={{
                        backgroundColor: activeTab === tab.key ? '#C9A227' : 'transparent',
                        color: activeTab === tab.key ? '#0D0D0F' : '#9CA3AF',
                        border: 'none',
                        padding: '8px 12px',
                        borderRadius: '6px 6px 0 0',
                        fontSize: '12px',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        fontWeight: activeTab === tab.key ? '600' : '400'
                      }}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Tab Content */}
                {activeTab === 'morphology' && (
                  <div>
                    <div style={{ marginBottom: '16px' }}>
                      <h4 style={{ color: '#C9A227', fontSize: '14px', marginBottom: '8px', fontWeight: '600' }}>
                        LEXICAL FORM
                      </h4>
                      <p style={{ color: '#F5F4F2', fontFamily: 'serif', fontSize: '16px' }}>
                        {WORD_FORMS[selectedWord].forms}
                      </p>
                    </div>

                    <div style={{ marginBottom: '16px' }}>
                      <h4 style={{ color: '#C9A227', fontSize: '14px', marginBottom: '8px', fontWeight: '600' }}>
                        MORPHOLOGICAL ANALYSIS
                      </h4>
                      <p style={{ color: '#F5F4F2', fontSize: '14px' }}>
                        {WORD_FORMS[selectedWord].type}
                      </p>
                    </div>

                    {WORD_FORMS[selectedWord].etymology && (
                      <div style={{ marginBottom: '16px' }}>
                        <h4 style={{ color: '#C9A227', fontSize: '14px', marginBottom: '8px', fontWeight: '600' }}>
                          ETYMOLOGY
                        </h4>
                        <p style={{ color: '#9CA3AF', fontSize: '13px' }}>
                          {WORD_FORMS[selectedWord].etymology}
                        </p>
                      </div>
                    )}

                    {WORD_FORMS[selectedWord].lsj && (
                      <div style={{ 
                        backgroundColor: '#141419', 
                        padding: '12px', 
                        borderRadius: '6px',
                        marginBottom: '16px'
                      }}>
                        <h4 style={{ color: '#3B82F6', fontSize: '12px', marginBottom: '6px', fontWeight: '600' }}>
                          LSJ DICTIONARY ENTRY
                        </h4>
                        <p style={{ color: '#F5F4F2', fontSize: '13px', fontFamily: 'serif' }}>
                          {WORD_FORMS[selectedWord].lsj}
                        </p>
                      </div>
                    )}

                    {showEmbeddings && renderWordEmbedding(selectedWord)}
                    {renderSemanticHistory(selectedWord)}
                  </div>
                )}

                {activeTab === 'variants' && MANUSCRIPT_VARIANTS[selectedWord] && (
                  <div>
                    <h4 style={{ color: '#C9A227', fontSize: '14px', marginBottom: '12px', fontWeight: '600' }}>
                      MANUSCRIPT APPARATUS
                    </h4>
                    {MANUSCRIPT_VARIANTS[selectedWord].map((variant, index) => (
                      <div key={index} style={{ 
                        backgroundColor: '#141419', 
                        padding: '12px', 
                        borderRadius: '6px', 
                        marginBottom: '8px' 
                      }}>
                        <div style={{ 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'center',
                          marginBottom: '4px'
                        }}>
                          <span style={{ color: '#F5F4F2', fontFamily: 'serif', fontWeight: '600' }}>
                            {variant.reading}
                          </span>
                          <span style={{ color: '#6B7280', fontSize: '12px' }}>
                            {variant.date}
                          </span>
                        </div>
                        <div style={{ color: '#9CA3AF', fontSize: '12px' }}>
                          {variant.ms} • {variant.location}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'examples' && (
                  <div>
                    <h4 style={{ color: '#C9A227', fontSize: '14px', marginBottom: '12px', fontWeight: '600' }}>
                      CONTEXTUAL EXAMPLES
                    </h4>
                    {EXAMPLE_SENTENCES
                      .filter(ex => ex.text.includes(selectedWord))
                      .map(example => (
                        <div key={example.id} style={{ 
                          backgroundColor: '#141419', 
                          padding: '12px', 
                          borderRadius: '6px', 
                          marginBottom: '12px',
                          borderLeft: `3px solid ${example.color}`
                        }}>
                          <div style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            marginBottom: '8px' 
                          }}>
                            <span style={{ 
                              backgroundColor: example.color, 
                              color: '#FFF', 
                              width: '20px', 
                              height: '20px', 
                              borderRadius: '50%', 
                              display: 'flex', 
                              alignItems: 'center', 
                              justifyContent: 'center', 
                              fontSize: '12px', 
                              fontWeight: 'bold',
                              marginRight: '8px'
                            }}>
                              {example.indicator}
                            </span>
                            <div>
                              <div style={{ color: '#9CA3AF', fontSize: '12px' }}>
                                {example.source} • {example.period}
                              </div>
                            </div>
                          </div>
                          <p style={{ 
                            color: '#F5F4F2',