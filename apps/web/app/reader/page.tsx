'use client'

import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

const sampleTexts = [
  {
    urn: 'urn:cts:greekLit:tlg0012.tlg001.perseus-grc1:1.1-1.10',
    title: 'Iliad 1.1-10',
    author: 'Homer',
    language: 'greek',
    content: 'μῆνιν ἄειδε θεὰ Πηληϊάδεω Ἀχιλῆος οὐλομένην, ἣ μυρί᾽ Ἀχαιοῖς ἄλγε᾽ ἔθηκε, πολλὰς δ᾽ ἰφθίμους ψυχὰς Ἄϊδι προΐαψεν ἡρώων, αὐτοὺς δὲ ἑλώρια τεῦχε κύνεσσιν οἰωνοῖσί τε πᾶσι, Διὸς δ᾽ ἐτελείετο βουλή, ἐξ οὗ δὴ τὰ πρῶτα διαστήτην ἐρίσαντε Ἀτρεΐδης τε ἄναξ ἀνδρῶν καὶ δῖος Ἀχιλλεύς.',
    translation: 'Sing, goddess, the rage of Peleus son Achilles, the destructive rage that brought countless woes upon the Achaeans, and sent many mighty souls of heroes down to Hades, while making their bodies prey for dogs and all birds. Thus the will of Zeus was accomplished, from the time when first they parted in strife—Atreus son, lord of men, and brilliant Achilles.',
    commentary: [
      {
        section: 'Opening Invocation',
        content: 'The opening of the Iliad establishes the central theme of rage (μῆνις) and its consequences. This proem follows the traditional epic formula, invoking the Muse and summarizing the story that follows.'
      },
      {
        section: 'The Concept of μῆνις',
        content: 'μῆνις (mēnis) is not ordinary anger but a cosmic, destructive force that drives the entire narrative. It differs from θυμός (thymos) or χόλος (cholos) in its divine and fateful character.'
      },
      {
        section: 'Divine Will',
        content: 'The phrase "Διὸς δ᾽ ἐτελείετο βουλή" (Thus the will of Zeus was accomplished) introduces the theme of divine plan underlying human action, a central concern of the Iliad.'
      }
    ]
  },
  {
    urn: 'urn:cts:latinLit:phi0690.phi003.perseus-lat1:1.1-1.10',
    title: 'Aeneid 1.1-11',
    author: 'Virgil',
    language: 'latin',
    content: 'Arma virumque cano, Troiae qui primus ab oris Italiam, fato profugus, Laviniaque venit litora, multum ille et terris iactatus et alto vi superum saevae memorem Iunonis ob iram; multa quoque et bello passus, dum conderet urbem, inferretque deos Latio, genus unde Latinum, Albanique patres, atque altae moenia Romae. Musa, mihi causas memora, quo numine laeso, quidve dolens, regina deum tot volvere casus insignem pietate virum, tot adire labores impulerit.',
    translation: 'I sing of arms and the man, who first from the shores of Troy, exiled by fate, came to Italy and to Lavinian shores—much buffeted he was on sea and land by the will of the gods, on account of the never-forgetting anger of fierce Juno; much too he suffered in war, until he could found a city and bring his gods to Latium; from him are the race of the Latins and Alban fathers and the walls of lofty Rome. Muse, tell me the causes, by what divine will injured, or grieving at what, did the queen of the gods drive a man outstanding in piety to encounter so many misfortunes, to face so many labors?',
    commentary: [
      {
        section: 'Homeric Echo',
        content: 'Virgil\'s opening echoes Homer while establishing distinctly Roman themes. The phrase "arma virumque" (arms and the man) signals both epic warfare and individual heroism, combining the Iliad\'s war theme with the Odyssey\'s wandering hero.'
      },
      {
        section: 'Roman Destiny',
        content: 'The progression from Troy to "altae moenia Romae" (walls of lofty Rome) establishes the teleological structure of the epic, where all suffering leads to Rome\'s foundation and future greatness.'
      },
      {
        section: 'Pietas',
        content: 'The phrase "insignem pietate virum" introduces pietas as Aeneas\'s defining virtue, encompassing duty to gods, family, and destiny—a distinctly Roman value system overlaid on Greek epic tradition.'
      }
    ]
  }
]

const wordData = {
  'μῆνιν': {
    word: 'μῆνιν',
    lemma: 'μῆνις',
    partOfSpeech: 'noun (accusative singular feminine)',
    definition: 'wrath, rage, anger; especially divine or heroic anger that has cosmic consequences',
    etymology: 'From PIE root *men- "to think, mental activity"',
    usage: 'Often used of divine anger or the destructive rage of heroes'
  },
  'ἄειδε': {
    word: 'ἄειδε',
    lemma: 'ἀείδω',
    partOfSpeech: 'verb (imperative singular)',
    definition: 'sing, celebrate in song',
    etymology: 'Related to ἀοιδή (song) and ἀοιδός (singer)',
    usage: 'Traditional formula for invoking the Muse in epic poetry'
  },
  'θεὰ': {
    word: 'θεὰ',
    lemma: 'θεά',
    partOfSpeech: 'noun (nominative singular feminine)',
    definition: 'goddess; divine female being',
    etymology: 'Feminine form of θεός (god)',
    usage: 'Used here to invoke the Muse'
  },
  'Ἀχιλῆος': {
    word: 'Ἀχιλῆος',
    lemma: 'Ἀχιλλεύς',
    partOfSpeech: 'proper noun (genitive singular)',
    definition: 'Achilles, greatest of the Greek heroes at Troy',
    etymology: 'Possibly "he whose people have distress" (ἄχος + λαός)',
    usage: 'Central hero of the Iliad'
  },
  'Arma': {
    word: 'Arma',
    lemma: 'arma',
    partOfSpeech: 'noun (accusative plural neuter)',
    definition: 'arms, weapons, military equipment; warfare, military exploits',
    etymology: 'From PIE *h₂er- "to fit together"',
    usage: 'Often used metonymically for war itself'
  },
  'virumque': {
    word: 'virumque',
    lemma: 'vir',
    partOfSpeech: 'noun (accusative singular masculine) + -que',
    definition: 'and the man; male person; hero, brave man',
    etymology: 'From PIE *wiHrós "man, hero"',
    usage: 'Emphasizes masculine virtue and heroic qualities'
  },
  'cano': {
    word: 'cano',
    lemma: 'cano',
    partOfSpeech: 'verb (1st person singular present)',
    definition: 'I sing, chant; celebrate in verse',
    etymology: 'From PIE *kan- "to sing"',
    usage: 'Traditional epic opening formula'
  },
  'fato': {
    word: 'fato',
    lemma: 'fatum',
    partOfSpeech: 'noun (ablative singular neuter)',
    definition: 'by fate, destiny; divine decree',
    etymology: 'From fari "to speak" - what has been spoken by gods',
    usage: 'Central concept in Roman thought about divine will'
  }
}

function ReaderContent() {
  const searchParams = useSearchParams()
  const urnParam = searchParams.get('urn')
  
  const [selectedText, setSelectedText] = useState(sampleTexts[0])
  const [showTranslation, setShowTranslation] = useState(false)
  const [selectedWord, setSelectedWord] = useState<any>(null)
  const [highlightedWord, setHighlightedWord] = useState('')
  const [showCommentary, setShowCommentary] = useState(true)

  useEffect(() => {
    if (urnParam) {
      const found = sampleTexts.find(t => t.urn === urnParam)
      if (found) setSelectedText(found)
    }
  }, [urnParam])

  const handleWordClick = (word: string) => {
    const cleanWord = word.replace(/[,.;:!?'"]/g, '')
    setHighlightedWord(cleanWord)
    if (wordData[cleanWord as keyof typeof wordData]) {
      setSelectedWord(wordData[cleanWord as keyof typeof wordData])
    } else {
      setSelectedWord({
        word: cleanWord,
        lemma: 'Unknown',
        partOfSpeech: 'Unknown',
        definition: 'Definition not available in demo data',
        etymology: 'Etymology not available',
        usage: 'Usage notes not available'
      })
    }
  }

  const renderText = (text: string, isTranslation = false) => {
    return text.split(' ').map((word, index) => {
      const cleanWord = word.replace(/[,.;:!?'"]/g, '')
      const isHighlighted = cleanWord === highlightedWord
      const hasData = !isTranslation && wordData[cleanWord as keyof typeof wordData]
      
      return (
        <span
          key={index}
          onClick={() => !isTranslation && handleWordClick(word)}
          style={{
            cursor: isTranslation ? 'default' : 'pointer',
            backgroundColor: isHighlighted ? '#C9A227' : (hasData ? 'rgba(201, 162, 39, 0.1)' : 'transparent'),
            color: isHighlighted ? '#0D0D0F' : (hasData ? '#E8D5A3' : '#F5F4F2'),
            padding: '2px 4px',
            borderRadius: '4px',
            margin: '0 2px',
            transition: 'all 0.2s ease',
            border: isHighlighted ? '2px solid #E8D5A3' : 'none',
            fontWeight: isHighlighted ? 'bold' : 'normal',
            boxShadow: isHighlighted ? '0 0 8px rgba(201, 162, 39, 0.3)' : 'none'
          }}
          onMouseEnter={(e) => {
            if (!isTranslation && hasData && !isHighlighted) {
              e.currentTarget.style.backgroundColor = 'rgba(201, 162, 39, 0.2)'
              e.currentTarget.style.color = '#C9A227'
            }
          }}
          onMouseLeave={(e) => {
            if (!isTranslation && hasData && !isHighlighted) {
              e.currentTarget.style.backgroundColor = 'rgba(201, 162, 39, 0.1)'
              e.currentTarget.style.color = '#E8D5A3'
            }
          }}
        >
          {word}
        </span>
      )
    })
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0D0D0F', color: '#F5F4F2' }}>
      {/* Navigation */}
      <nav style={{ 
        backgroundColor: '#1E1E24', 
        borderBottom: '1px solid rgba(201, 162, 39, 0.1)',
        padding: '16px 32px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Link href="/" style={{ 
          fontSize: '24px', 
          fontWeight: 'bold', 
          color: '#C9A227', 
          textDecoration: 'none',
          fontFamily: 'serif'
        }}>
          LOGOS
        </Link>
        <div style={{ display: 'flex', gap: '24px' }}>
          <Link href="/library" style={{ color: '#9CA3AF', textDecoration: 'none', transition: 'color 0.2s' }}>
            Library
          </Link>
          <Link href="/reader" style={{ color: '#C9A227', textDecoration: 'none' }}>
            Reader
          </Link>
          <Link href="/search" style={{ color: '#9CA3AF', textDecoration: 'none', transition: 'color 0.2s' }}>
            Search
          </Link>
          <Link href="/tools" style={{ color: '#9CA3AF', textDecoration: 'none', transition: 'color 0.2s' }}>
            Tools
          </Link>
        </div>
      </nav>

      <div style={{ display: 'flex', height: 'calc(100vh - 73px)' }}>
        {/* Main Content */}
        <div style={{ flex: 1, padding: '32px', overflow: 'auto' }}>
          {/* Header */}
          <div style={{ 
            backgroundColor: '#1E1E24', 
            borderRadius: '12px', 
            padding: '24px', 
            marginBottom: '24px',
            border: '1px solid rgba(201, 162, 39, 0.1)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div>
                <h1 style={{ 
                  color: '#C9A227', 
                  fontSize: '28px', 
                  marginBottom: '8px',
                  fontFamily: 'serif'
                }}>
                  {selectedText.title}
                </h1>
                <p style={{ color: '#9CA3AF', fontSize: '18px', margin: 0 }}>
                  by {selectedText.author}
                </p>
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={() => setShowTranslation(!showTranslation)}
                  style={{
                    backgroundColor: showTranslation ? '#C9A227' : 'transparent',
                    color: showTranslation ? '#0D0D0F' : '#C9A227',
                    border: '2px solid #C9A227',
                    borderRadius: '8px',
                    padding: '8px 16px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '600',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (!showTranslation) {
                      e.currentTarget.style.backgroundColor = 'rgba(201, 162, 39, 0.1)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!showTranslation) {
                      e.currentTarget.style.backgroundColor = 'transparent'
                    }
                  }}
                >
                  {showTranslation ? 'Hide Translation' : 'Show Translation'}
                </button>
                <button
                  onClick={() => setShowCommentary(!showCommentary)}
                  style={{
                    backgroundColor: showCommentary ? '#3B82F6' : 'transparent',
                    color: showCommentary ? '#F5F4F2' : '#3B82F6',
                    border: '2px solid #3B82F6',
                    borderRadius: '8px',
                    padding: '8px 16px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '600',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (!showCommentary) {
                      e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.1)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!showCommentary) {
                      e.currentTarget.style.backgroundColor = 'transparent'
                    }
                  }}
                >
                  {showCommentary ? 'Hide Commentary' : 'Show Commentary'}
                </button>
              </div>
            </div>

            {/* Text Selection */}
            <div style={{ display: 'flex', gap: '12px' }}>
              {sampleTexts.map((text) => (
                <button
                  key={text.urn}
                  onClick={() => setSelectedText(text)}
                  style={{
                    backgroundColor: selectedText.urn === text.urn ? 
                      (text.language === 'greek' ? '#3B82F6' : '#DC2626') : 'transparent',
                    color: selectedText.urn === text.urn ? '#F5F4F2' : 
                      (text.language === 'greek' ? '#3B82F6' : '#DC2626'),
                    border: `2px solid ${text.language === 'greek' ? '#3B82F6' : '#DC2626'}`,
                    borderRadius: '8px',
                    padding: '8px 12px',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: '600',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (selectedText.urn !== text.urn) {
                      e.currentTarget.style.backgroundColor = text.language === 'greek' ? 
                        'rgba(59, 130, 246, 0.1)' : 'rgba(220, 38, 38, 0.1)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedText.urn !== text.urn) {
                      e.currentTarget.style.backgroundColor = 'transparent'
                    }
                  }}
                >
                  {text.title}
                </button>
              ))}
            </div>
          </div>

          {/* Text Display */}
          <div style={{ 
            backgroundColor: '#1E1E24', 
            borderRadius: '12px', 
            padding: '32px',
            marginBottom: '24px',
            border: '1px solid rgba(201, 162, 39, 0.1)',
            lineHeight: '2'
          }}>
            <div style={{ 
              fontSize: selectedText.language === 'greek' ? '20px' : '18px',
              fontFamily: selectedText.language === 'greek' ? 'serif' : 'serif',
              marginBottom: showTranslation ? '24px' : '0'
            }}>
              {renderText(selectedText.content)}
            </div>

            {showTranslation && (
              <>
                <div style={{ 
                  height: '1px', 
                  backgroundColor: 'rgba(201, 162, 39, 0.2)', 
                  margin: '24px 0' 
                }} />
                <div style={{ 
                  fontSize: '18px',
                  fontFamily: 'serif',
                  color: '#9CA3AF',
                  fontStyle: 'italic'
                }}>
                  {renderText(selectedText.translation, true)}
                </div>
              </>
            )}
          </div>

          {/* Word Analysis Panel */}
          {selectedWord && (
            <div style={{ 
              backgroundColor: '#1E1E24', 
              borderRadius: '12px', 
              padding: '24px',
              border: '1px solid rgba(201, 162, 39, 0.1)',
              marginBottom: '24px'
            }}>
              <h3 style={{ 
                color: '#C9A227', 
                marginBottom: '16px',
                fontSize: '20px',
                fontFamily: 'serif'
              }}>
                Word Analysis: {selectedWord.word}
              </h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                <div>
                  <div style={{ marginBottom: '12px' }}>
                    <strong style={{ color: '#E8D5A3' }}>Lemma:</strong>
                    <span style={{ marginLeft: '8px', color: '#F5F4F2' }}>{selectedWord.lemma}</span>
                  </div>
                  <div style={{ marginBottom: '12px' }}>
                    <strong style={{ color: '#E8D5A3' }}>Part of Speech:</strong>
                    <span style={{ marginLeft: '8px', color: '#F5F4F2' }}>{selectedWord.partOfSpeech}</span>
                  </div>
                  <div style={{ marginBottom: '12px' }}>
                    <strong style={{ color: '#E8D5A3' }}>Definition:</strong>
                    <p style={{ marginLeft: '0px', color: '#F5F4F2', marginTop: '4px', marginBottom: '0' }}>
                      {selectedWord.definition}
                    </p>
                  </div>
                </div>
                <div>
                  <div style={{ marginBottom: '12px' }}>
                    <strong style={{ color: '#E8D5A3' }}>Etymology:</strong>
                    <p style={{ marginLeft: '0px', color: '#F5F4F2', marginTop: '4px', marginBottom: '12px' }}>
                      {selectedWord.etymology}
                    </p>
                  </div>
                  <div>
                    <strong style={{ color: '#E8D5A3' }}>Usage:</strong>
                    <p style={{ marginLeft: '0px', color: '#F5F4F2', marginTop: '4px', marginBottom: '0' }}>
                      {selectedWord.usage}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Commentary Panel */}
        {showCommentary && (
          <div style={{ 
            width: '400px', 
            backgroundColor: '#141419',
            borderLeft: '1px solid rgba(201, 162, 39, 0.1)',
            padding: '32px 24px',
            overflow: 'auto'
          }}>
            <h3 style={{ 
              color: '#C9A227', 
              marginBottom: '24px',
              fontSize: '20px',
              fontFamily: 'serif'
            }}>
              Commentary
            </h3>
            
            {selectedText.commentary.map((section, index) => (
              <div key={index} style={{ 
                backgroundColor: '#1E1E24',
                borderRadius: '8px',
                padding: '16px',
                marginBottom: '16px',
                border: '1px solid rgba(201, 162, 39, 0.1)'
              }}>
                <h4 style={{ 
                  color: '#E8D5A3', 
                  marginBottom: '12px',
                  fontSize: '16px',
                  fontWeight: '600'
                }}>
                  {section.section}
                </h4>
                <p style={{ 
                  color: '#9CA3AF', 
                  lineHeight: '1.6',
                  margin: '0',
                  fontSize: '14px'
                }}>
                  {section.content}
                </p>
              </div>
            ))}

            <div style={{ 
              backgroundColor: '#1E1E24',
              borderRadius: '8px',
              padding: '16px',
              border: '1px solid rgba(201, 162, 39, 0.1)'
            }}>
              <h4 style={{ 
                color: '#E8D5A3', 
                marginBottom: '12px',
                fontSize: '16px',
                fontWeight: '600'
              }}>
                Interactive Features
              </h4>
              <ul style={{ 
                color: '#9CA3AF', 
                lineHeight: '1.6',
                margin: '0',
                paddingLeft: '16px',
                fontSize: '14px'
              }}>
                <li style={{ marginBottom: '8px' }}>
                  Click on highlighted words to see detailed analysis
                </li>
                <li style={{ marginBottom: '8px' }}>
                  Toggle translation to compare original and English
                </li>
                <li>
                  Words with available data glow when hovered
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function ReaderPage() {
  return (
    <Suspense fallback={
      <div style={{ 
        minHeight: '100vh', 
        backgroundColor: '#0D0D0F', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
        <div style={{ color: '#C9A227', fontSize: '18px' }}>Loading reader...</div>
      </div>
    }>
      <ReaderContent />
    </Suspense>
  )
}