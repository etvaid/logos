"use client"

import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import TranslationStyleDial from '@/components/reader/TranslationStyleDial'

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

interface Word {
  id: string
  text: string
  lemma: string
  pos: string
  morph: {
    case?: string
    number?: string
    gender?: string
    tense?: string
    mood?: string
    voice?: string
    person?: string
    dialect?: string
  }
  definition: string
  etymology?: string
  frequency: number
  semantiaDefinition?: string
}

interface Line {
  id: string
  lineNumber: number
  words: Word[]
  translation: string
  literalTranslation?: string
  studentTranslation?: string
  notes?: string[]
}

// ═══════════════════════════════════════════════════════════════════════════════
// DEMO DATA - ILIAD BOOK 1, LINES 1-10
// ═══════════════════════════════════════════════════════════════════════════════

const DEMO_LINES: Line[] = [
  {
    id: "1",
    lineNumber: 1,
    words: [
      { id: "1-1", text: "μῆνιν", lemma: "μῆνις", pos: "noun", morph: { case: "accusative", number: "singular", gender: "feminine" }, definition: "wrath, anger", etymology: "PIE *méh₁nis 'passion'", frequency: 12, semantiaDefinition: "Divine or heroic rage that drives the narrative; not ordinary anger but cosmic fury" },
      { id: "1-2", text: "ἄειδε", lemma: "ἀείδω", pos: "verb", morph: { tense: "present", mood: "imperative", voice: "active", person: "2nd" }, definition: "sing, celebrate", etymology: "PIE *h₂weyd- 'speak solemnly'", frequency: 45, semantiaDefinition: "Ritual invocation of the Muse; the bard becomes vessel for divine song" },
      { id: "1-3", text: "θεά", lemma: "θεά", pos: "noun", morph: { case: "vocative", number: "singular", gender: "feminine" }, definition: "goddess", etymology: "PIE *dʰéh₁s 'deity'", frequency: 234, semantiaDefinition: "The Muse, daughter of Memory (Mnemosyne); source of poetic authority" },
      { id: "1-4", text: "Πηληϊάδεω", lemma: "Πηληϊάδης", pos: "noun", morph: { case: "genitive", number: "singular", gender: "masculine" }, definition: "son of Peleus", frequency: 89, semantiaDefinition: "Patronymic for Achilles; emphasizes divine lineage through Thetis" },
      { id: "1-5", text: "Ἀχιλῆος", lemma: "Ἀχιλλεύς", pos: "noun", morph: { case: "genitive", number: "singular", gender: "masculine" }, definition: "Achilles", frequency: 312, semantiaDefinition: "Central hero; his name possibly from ἄχος + λαός 'grief of the people'" },
    ],
    translation: "Sing, goddess, the wrath of Achilles son of Peleus",
    literalTranslation: "Wrath sing, goddess, of-Peleus-son of-Achilles",
    studentTranslation: "Goddess, please sing about the anger of Achilles, who was Peleus's son",
  },
  {
    id: "2",
    lineNumber: 2,
    words: [
      { id: "2-1", text: "οὐλομένην", lemma: "ὄλλυμι", pos: "participle", morph: { case: "accusative", number: "singular", gender: "feminine", tense: "aorist", voice: "middle" }, definition: "destructive, accursed", etymology: "PIE *h₃elh₁- 'destroy'", frequency: 8, semantiaDefinition: "Fatally destructive; literally 'the destroying one' - personifies wrath as active agent" },
      { id: "2-2", text: "ἣ", lemma: "ὅς", pos: "pronoun", morph: { case: "nominative", number: "singular", gender: "feminine" }, definition: "which, who", frequency: 2341, semantiaDefinition: "Relative pronoun referring to μῆνις; grammatically feminine" },
      { id: "2-3", text: "μυρί᾽", lemma: "μυρίος", pos: "adjective", morph: { case: "accusative", number: "plural", gender: "neuter" }, definition: "countless, ten thousand", etymology: "Unknown, pre-Greek", frequency: 67, semantiaDefinition: "Innumerable; the conventional epic number for 'countless'" },
      { id: "2-4", text: "Ἀχαιοῖς", lemma: "Ἀχαιός", pos: "noun", morph: { case: "dative", number: "plural", gender: "masculine" }, definition: "Achaeans, Greeks", frequency: 456, semantiaDefinition: "One of three names Homer uses for Greeks (also Danaans, Argives)" },
      { id: "2-5", text: "ἄλγε᾽", lemma: "ἄλγος", pos: "noun", morph: { case: "accusative", number: "plural", gender: "neuter" }, definition: "pains, sufferings", etymology: "PIE *h₂elǵ- 'cold, frost'", frequency: 34, semantiaDefinition: "Physical and mental suffering; the cost of Achilles' withdrawal" },
      { id: "2-6", text: "ἔθηκε", lemma: "τίθημι", pos: "verb", morph: { tense: "aorist", mood: "indicative", voice: "active", person: "3rd", number: "singular" }, definition: "placed, caused", etymology: "PIE *dʰeh₁- 'put, place'", frequency: 234, semantiaDefinition: "Causative action; wrath as subject actively 'placed' suffering" },
    ],
    translation: "the accursed wrath that brought countless sufferings upon the Achaeans",
    literalTranslation: "destructive, which countless upon-Achaeans pains placed",
    studentTranslation: "that terrible anger which caused so much pain for the Greek army",
  },
  {
    id: "3",
    lineNumber: 3,
    words: [
      { id: "3-1", text: "πολλὰς", lemma: "πολύς", pos: "adjective", morph: { case: "accusative", number: "plural", gender: "feminine" }, definition: "many", etymology: "PIE *polh₁ú- 'much'", frequency: 890, semantiaDefinition: "Emphatic quantity; paired with ἰφθίμους for rhetorical effect" },
      { id: "3-2", text: "δ᾽", lemma: "δέ", pos: "particle", morph: {}, definition: "and, but", frequency: 8934, semantiaDefinition: "Continuative particle; connects clauses without strong contrast" },
      { id: "3-3", text: "ἰφθίμους", lemma: "ἴφθιμος", pos: "adjective", morph: { case: "accusative", number: "plural", gender: "feminine" }, definition: "valiant, mighty", frequency: 23, semantiaDefinition: "Epic epithet for strong warriors; emphasizes what was lost" },
      { id: "3-4", text: "ψυχὰς", lemma: "ψυχή", pos: "noun", morph: { case: "accusative", number: "plural", gender: "feminine" }, definition: "souls, lives", etymology: "PIE *bʰes- 'breathe'", frequency: 156, semantiaDefinition: "In Homer: breath-soul that departs at death, not immortal soul of later philosophy" },
      { id: "3-5", text: "Ἄϊδι", lemma: "Ἅιδης", pos: "noun", morph: { case: "dative", number: "singular", gender: "masculine" }, definition: "to Hades", etymology: "PIE *n̥-wid- 'unseen'", frequency: 89, semantiaDefinition: "The underworld; literally 'the unseen place'" },
      { id: "3-6", text: "προΐαψεν", lemma: "προϊάπτω", pos: "verb", morph: { tense: "aorist", mood: "indicative", voice: "active", person: "3rd", number: "singular" }, definition: "sent forth, hurled", frequency: 4, semantiaDefinition: "Violent dispatch; souls hurled down to death" },
    ],
    translation: "and hurled many valiant souls of heroes to Hades",
    literalTranslation: "many and valiant souls to-Hades sent-forth",
    studentTranslation: "and sent the brave souls of many warriors down to the underworld",
  },
  {
    id: "4",
    lineNumber: 4,
    words: [
      { id: "4-1", text: "ἡρώων", lemma: "ἥρως", pos: "noun", morph: { case: "genitive", number: "plural", gender: "masculine" }, definition: "of heroes", etymology: "Pre-Greek, possibly from Hera", frequency: 234, semantiaDefinition: "Semi-divine warriors; Homeric heroes are stronger than modern men" },
      { id: "4-2", text: "αὐτοὺς", lemma: "αὐτός", pos: "pronoun", morph: { case: "accusative", number: "plural", gender: "masculine" }, definition: "themselves", frequency: 3456, semantiaDefinition: "Emphatic: their very selves/bodies (contrasted with souls)" },
      { id: "4-3", text: "δὲ", lemma: "δέ", pos: "particle", morph: {}, definition: "but, and", frequency: 8934, semantiaDefinition: "Here mildly contrastive: souls vs. bodies" },
      { id: "4-4", text: "ἑλώρια", lemma: "ἑλώριον", pos: "noun", morph: { case: "accusative", number: "plural", gender: "neuter" }, definition: "prey, spoil", frequency: 3, semantiaDefinition: "Rare word for carrion; bodies as food for scavengers" },
      { id: "4-5", text: "τεῦχε", lemma: "τεύχω", pos: "verb", morph: { tense: "imperfect", mood: "indicative", voice: "active", person: "3rd", number: "singular" }, definition: "made, rendered", etymology: "PIE *dʰewgʰ- 'produce'", frequency: 123, semantiaDefinition: "Creative making; wrath 'made' bodies into carrion" },
      { id: "4-6", text: "κύνεσσιν", lemma: "κύων", pos: "noun", morph: { case: "dative", number: "plural", gender: "masculine" }, definition: "for dogs", etymology: "PIE *ḱwṓ 'dog'", frequency: 67, semantiaDefinition: "Ultimate dishonor: denial of proper burial" },
    ],
    translation: "and made the heroes themselves prey for dogs",
    literalTranslation: "of-heroes themselves and prey made for-dogs",
    studentTranslation: "and left the bodies of the heroes to be eaten by dogs",
  },
  {
    id: "5",
    lineNumber: 5,
    words: [
      { id: "5-1", text: "οἰωνοῖσί", lemma: "οἰωνός", pos: "noun", morph: { case: "dative", number: "plural", gender: "masculine" }, definition: "for birds", etymology: "PIE *h₂ewi- 'bird'", frequency: 34, semantiaDefinition: "Birds of prey, especially vultures; carrion birds" },
      { id: "5-2", text: "τε", lemma: "τε", pos: "particle", morph: {}, definition: "and", frequency: 6789, semantiaDefinition: "Enclitic connective; τε...τε = both...and" },
      { id: "5-3", text: "πᾶσι", lemma: "πᾶς", pos: "adjective", morph: { case: "dative", number: "plural", gender: "masculine" }, definition: "for all", etymology: "Unknown", frequency: 567, semantiaDefinition: "Universal: every kind of carrion bird" },
      { id: "5-4", text: "Διὸς", lemma: "Ζεύς", pos: "noun", morph: { case: "genitive", number: "singular", gender: "masculine" }, definition: "of Zeus", etymology: "PIE *dyḗws 'sky god'", frequency: 678, semantiaDefinition: "King of gods; his will (βουλή) frames the entire narrative" },
      { id: "5-5", text: "δ᾽", lemma: "δέ", pos: "particle", morph: {}, definition: "and", frequency: 8934, semantiaDefinition: "Transitional: shifts to divine causation" },
      { id: "5-6", text: "ἐτελείετο", lemma: "τελέω", pos: "verb", morph: { tense: "imperfect", mood: "indicative", voice: "middle", person: "3rd", number: "singular" }, definition: "was being accomplished", etymology: "PIE *kwel- 'turn, revolve'", frequency: 56, semantiaDefinition: "Divine plan unfolding; imperfect shows ongoing process" },
      { id: "5-7", text: "βουλή", lemma: "βουλή", pos: "noun", morph: { case: "nominative", number: "singular", gender: "feminine" }, definition: "will, plan, counsel", etymology: "PIE *gʷelh₃- 'throw'", frequency: 89, semantiaDefinition: "Zeus's overarching plan; everything happens according to divine design" },
    ],
    translation: "and for all the birds, and the will of Zeus was being accomplished",
    literalTranslation: "for-birds and for-all of-Zeus and was-being-accomplished will",
    studentTranslation: "and for all the birds to eat, and Zeus's plan was coming true",
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// COLOR SCHEME
// ═══════════════════════════════════════════════════════════════════════════════

const POS_COLORS: Record<string, string> = {
  noun: "#C9A962",
  verb: "#3B82F6",
  adjective: "#10B981",
  participle: "#8B5CF6",
  pronoun: "#EC4899",
  particle: "#6B7280",
  adverb: "#F59E0B",
}

// ═══════════════════════════════════════════════════════════════════════════════
// WORD POPUP COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

interface WordPopupProps {
  word: Word
  position: { x: number; y: number }
  onClose: () => void
}

const WordPopup: React.FC<WordPopupProps> = ({ word, position, onClose }) => {
  const popupRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
        onClose()
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [onClose])

  return (
    <motion.div
      ref={popupRef}
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.95 }}
      className="fixed z-50 w-96 max-h-[80vh] overflow-y-auto"
      style={{
        left: Math.min(position.x, window.innerWidth - 400),
        top: Math.min(position.y + 20, window.innerHeight - 400),
      }}
    >
      <div className="bg-[#1A1A1F] border border-[#C9A962]/30 rounded-xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#C9A962]/20 to-[#8B7355]/20 p-4 border-b border-[#C9A962]/20">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-2xl font-serif text-[#C9A962]">{word.text}</h3>
              <p className="text-[#F5F3EF]/60 text-sm">
                {word.lemma} • <span style={{ color: POS_COLORS[word.pos] || '#fff' }}>{word.pos}</span>
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-[#F5F3EF]/40 hover:text-[#F5F3EF] transition"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {/* Morphology */}
          <div>
            <h4 className="text-xs uppercase tracking-wider text-[#C9A962]/70 mb-2">Morphology</h4>
            <div className="flex flex-wrap gap-2">
              {Object.entries(word.morph).filter(([_, v]) => v).map(([key, value]) => (
                <span
                  key={key}
                  className="px-2 py-1 bg-[#0D0D0F] rounded text-xs text-[#F5F3EF]/80"
                >
                  {key}: <span className="text-[#C9A962]">{value}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Definition */}
          <div>
            <h4 className="text-xs uppercase tracking-wider text-[#C9A962]/70 mb-2">LSJ Definition</h4>
            <p className="text-[#F5F3EF]/80">{word.definition}</p>
          </div>

          {/* SEMANTIA Definition */}
          {word.semantiaDefinition && (
            <div className="bg-[#C9A962]/10 rounded-lg p-3 border border-[#C9A962]/20">
              <h4 className="text-xs uppercase tracking-wider text-[#C9A962] mb-2 flex items-center gap-2">
                <span className="w-2 h-2 bg-[#C9A962] rounded-full animate-pulse"></span>
                SEMANTIA (Corpus-Derived)
              </h4>
              <p className="text-[#F5F3EF]/90 text-sm italic">{word.semantiaDefinition}</p>
            </div>
          )}

          {/* Etymology */}
          {word.etymology && (
            <div>
              <h4 className="text-xs uppercase tracking-wider text-[#C9A962]/70 mb-2">Etymology</h4>
              <p className="text-[#F5F3EF]/70 text-sm">{word.etymology}</p>
            </div>
          )}

          {/* Frequency */}
          <div>
            <h4 className="text-xs uppercase tracking-wider text-[#C9A962]/70 mb-2">Frequency</h4>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-2 bg-[#0D0D0F] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#C9A962] to-[#E8D5A3]"
                  style={{ width: `${Math.min(word.frequency / 10, 100)}%` }}
                />
              </div>
              <span className="text-sm text-[#F5F3EF]/60">{word.frequency}× in corpus</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2 border-t border-[#C9A962]/10">
            <button className="flex-1 py-2 px-3 bg-[#C9A962]/10 hover:bg-[#C9A962]/20 text-[#C9A962] rounded-lg text-sm transition">
              All Occurrences →
            </button>
            <button className="flex-1 py-2 px-3 bg-[#3B82F6]/10 hover:bg-[#3B82F6]/20 text-[#3B82F6] rounded-lg text-sm transition">
              Challenge LSJ
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN READER COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export default function ReaderPage() {
  const [selectedWord, setSelectedWord] = useState<Word | null>(null)
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 })
  const [translationStyle, setTranslationStyle] = useState<'literary' | 'literal' | 'student'>('literary')
  const [showTranslation, setShowTranslation] = useState(true)
  const [syntaxHighlight, setSyntaxHighlight] = useState(true)
  const [fontSize, setFontSize] = useState(20)

  const handleWordClick = useCallback((word: Word, event: React.MouseEvent) => {
    setSelectedWord(word)
    setPopupPosition({ x: event.clientX, y: event.clientY })
  }, [])

  const getTranslation = (line: Line) => {
    switch (translationStyle) {
      case 'literal': return line.literalTranslation || line.translation
      case 'student': return line.studentTranslation || line.translation
      default: return line.translation
    }
  }

  return (
    <div className="min-h-screen bg-[#0D0D0F] text-[#F5F3EF]">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#0D0D0F]/95 backdrop-blur border-b border-[#C9A962]/20">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div>
                <Link href="/" className="text-[#C9A962] font-serif text-2xl hover:text-[#E8D5A3] transition">
                  LOGOS
                </Link>
                <span className="mx-3 text-[#F5F3EF]/30">|</span>
                <span className="text-[#F5F3EF]/70">Reader</span>
              </div>

              {/* Author/Translator Selection Dial */}
              <TranslationStyleDial
                onChange={(persona, translator) => {
                  console.log('Selected:', persona, translator)
                  // Map translator to translation style
                  if (translator === 'plain' || translator === 'rouse') {
                    setTranslationStyle('student')
                  } else if (translator === 'lattimore' || translator === 'loeb') {
                    setTranslationStyle('literal')
                  } else {
                    setTranslationStyle('literary')
                  }
                }}
              />
            </div>

            <div className="flex items-center gap-4">
              {/* Translation Style */}
              <div className="flex bg-[#1A1A1F] rounded-lg p-1">
                {(['literary', 'literal', 'student'] as const).map((style) => (
                  <button
                    key={style}
                    onClick={() => setTranslationStyle(style)}
                    className={`px-3 py-1 rounded text-sm capitalize transition ${
                      translationStyle === style
                        ? 'bg-[#C9A962] text-[#0D0D0F]'
                        : 'text-[#F5F3EF]/60 hover:text-[#F5F3EF]'
                    }`}
                  >
                    {style}
                  </button>
                ))}
              </div>

              {/* Toggle Buttons */}
              <button
                onClick={() => setShowTranslation(!showTranslation)}
                className={`px-3 py-1 rounded text-sm transition ${
                  showTranslation ? 'bg-[#C9A962]/20 text-[#C9A962]' : 'text-[#F5F3EF]/40'
                }`}
              >
                Translation
              </button>
              <button
                onClick={() => setSyntaxHighlight(!syntaxHighlight)}
                className={`px-3 py-1 rounded text-sm transition ${
                  syntaxHighlight ? 'bg-[#C9A962]/20 text-[#C9A962]' : 'text-[#F5F3EF]/40'
                }`}
              >
                Syntax
              </button>

              {/* Font Size */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setFontSize(Math.max(14, fontSize - 2))}
                  className="w-8 h-8 rounded bg-[#1A1A1F] text-[#F5F3EF]/60 hover:text-[#F5F3EF]"
                >
                  A-
                </button>
                <button
                  onClick={() => setFontSize(Math.min(32, fontSize + 2))}
                  className="w-8 h-8 rounded bg-[#1A1A1F] text-[#F5F3EF]/60 hover:text-[#F5F3EF]"
                >
                  A+
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Work Title */}
      <div className="bg-gradient-to-b from-[#C9A962]/10 to-transparent py-8">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="font-serif text-4xl text-[#C9A962] mb-2">Ἰλιάς</h1>
          <p className="text-[#F5F3EF]/60">Homer • Iliad • Book 1, Lines 1-5</p>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-8">
        <div className="space-y-6">
          {DEMO_LINES.map((line) => (
            <div
              key={line.id}
              className="group bg-[#1A1A1F]/50 hover:bg-[#1A1A1F] rounded-xl p-6 transition border border-transparent hover:border-[#C9A962]/20"
            >
              {/* Line Number */}
              <div className="flex gap-4">
                <span className="text-[#C9A962]/50 font-mono text-sm w-8 flex-shrink-0 pt-1">
                  {line.lineNumber}
                </span>

                <div className="flex-1 space-y-3">
                  {/* Greek Text */}
                  <p
                    className="font-serif leading-relaxed"
                    style={{ fontSize: `${fontSize}px` }}
                  >
                    {line.words.map((word, i) => (
                      <React.Fragment key={word.id}>
                        <span
                          onClick={(e) => handleWordClick(word, e)}
                          className="cursor-pointer hover:bg-[#C9A962]/20 rounded px-0.5 transition"
                          style={{
                            color: syntaxHighlight ? POS_COLORS[word.pos] || '#F5F3EF' : '#F5F3EF',
                          }}
                        >
                          {word.text}
                        </span>
                        {i < line.words.length - 1 && ' '}
                      </React.Fragment>
                    ))}
                  </p>

                  {/* Translation */}
                  <AnimatePresence>
                    {showTranslation && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="text-[#F5F3EF]/60 text-sm italic border-l-2 border-[#C9A962]/30 pl-4"
                      >
                        {getTranslation(line)}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                {/* Bookmark */}
                <button className="opacity-0 group-hover:opacity-100 text-[#F5F3EF]/30 hover:text-[#C9A962] transition">
                  ☆
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="mt-12 p-6 bg-[#1A1A1F] rounded-xl border border-[#C9A962]/20">
          <h3 className="text-[#C9A962] font-serif text-lg mb-4">Syntax Highlighting Legend</h3>
          <div className="flex flex-wrap gap-4">
            {Object.entries(POS_COLORS).map(([pos, color]) => (
              <div key={pos} className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
                <span className="text-sm capitalize text-[#F5F3EF]/70">{pos}</span>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Word Popup */}
      <AnimatePresence>
        {selectedWord && (
          <WordPopup
            word={selectedWord}
            position={popupPosition}
            onClose={() => setSelectedWord(null)}
          />
        )}
      </AnimatePresence>

      {/* Keyboard Shortcuts */}
      <div className="fixed bottom-4 right-4 text-[#F5F3EF]/30 text-xs">
        Press <kbd className="px-1 bg-[#1A1A1F] rounded">?</kbd> for shortcuts
      </div>
    </div>
  )
}
