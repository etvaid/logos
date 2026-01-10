// Complete lesson content for all Greek and Latin modules

export interface Lesson {
  id: string;
  title: string;
  content: string;
  examples: Array<{
    greek?: string;
    latin?: string;
    english: string;
    source?: string;
  }>;
  exercises: Array<{
    question: string;
    options: string[];
    correct: number;
    explanation: string;
  }>;
  vocabulary?: Array<{
    word: string;
    meaning: string;
    notes?: string;
  }>;
}

export interface Module {
  id: string;
  lessons: Lesson[];
}

// ==================================================================
// GREEK MODULES - Complete Content
// ==================================================================

export const GREEK_LESSONS: Record<string, Module> = {
  g1: {
    id: 'g1',
    lessons: [
      {
        id: 'g1-1',
        title: 'Introduction to the Greek Alphabet',
        content: `The Greek alphabet has 24 letters, derived from the Phoenician alphabet around 800 BCE. Unlike Phoenician, Greek added vowels, making it the first true alphabet.

The letters are divided into:
- **Vowels**: α, ε, η, ι, ο, υ, ω (7 letters)
- **Consonants**: β, γ, δ, ζ, θ, κ, λ, μ, ν, ξ, π, ρ, σ/ς, τ, φ, χ, ψ (17 letters)

Note: σ is used at the beginning or middle of words, ς at the end.`,
        examples: [
          {
            greek: 'ἀλφάβητος',
            english: 'alphabet (literally: alpha-beta)',
          },
          {
            greek: 'λόγος',
            english: 'word, speech, reason',
            source: 'One of the most important Greek concepts'
          },
        ],
        exercises: [
          {
            question: 'How many letters are in the Greek alphabet?',
            options: ['20', '22', '24', '26'],
            correct: 2,
            explanation: 'The Greek alphabet has 24 letters, including 7 vowels and 17 consonants.'
          },
          {
            question: 'Which letter is used only at the end of Greek words?',
            options: ['σ', 'ς', 'ρ', 'ν'],
            correct: 1,
            explanation: 'ς (final sigma) is used only at the end of words, while σ is used everywhere else.'
          },
        ],
        vocabulary: [
          { word: 'α', meaning: 'alpha - first letter' },
          { word: 'β', meaning: 'beta - second letter' },
          { word: 'γ', meaning: 'gamma - third letter' },
          { word: 'δ', meaning: 'delta - fourth letter' },
          { word: 'ε', meaning: 'epsilon - fifth letter' },
        ],
      },
      {
        id: 'g1-2',
        title: 'Vowels and Diphthongs',
        content: `Greek vowels can be short or long:
- **Short vowels**: ε (epsilon), ο (omicron)
- **Long vowels**: η (eta), ω (omega)
- **Variable length**: α, ι, υ

**Diphthongs** (two vowel sounds together):
- αι (like "eye"), ει (like "day"), οι (like "boy")
- αυ, ευ, ου (like "too"), ηυ, υι

The vowels α, η, ω are called **open vowels** (ἀνοιχτά).
The vowels ι, υ are called **close vowels** (κλειστά).`,
        examples: [
          {
            greek: 'παιδεία',
            english: 'education, culture',
            source: 'Root of "pedagogy"'
          },
          {
            greek: 'οἶκος',
            english: 'house, household',
            source: 'Root of "economy" (οἰκονομία)'
          },
        ],
        exercises: [
          {
            question: 'Which of these is always a long vowel?',
            options: ['α', 'ε', 'η', 'ι'],
            correct: 2,
            explanation: 'η (eta) is always long, while ε (epsilon) is always short.'
          },
          {
            question: 'The diphthong "ου" sounds like:',
            options: ['"oo" in food', '"ow" in how', '"oi" in oil', '"ay" in day'],
            correct: 0,
            explanation: 'ου sounds like "oo" in "food" or "too".'
          },
        ],
        vocabulary: [
          { word: 'αἰών', meaning: 'age, eon', notes: 'Contains diphthong αι' },
          { word: 'εἰρήνη', meaning: 'peace', notes: 'Contains diphthong ει' },
          { word: 'οὐρανός', meaning: 'heaven, sky', notes: 'Contains diphthong ου' },
        ],
      },
      {
        id: 'g1-3',
        title: 'Consonants and Breathing Marks',
        content: `Greek consonants are classified by how they're pronounced:

**Stops (mutes)**:
- **Labials** (lips): π, β, φ
- **Dentals** (teeth): τ, δ, θ
- **Gutturals** (throat): κ, γ, χ

**Liquids**: λ, ρ
**Nasals**: μ, ν
**Sibilant**: σ/ς
**Double consonants**: ζ (= δ+σ), ξ (= κ+σ), ψ (= π+σ)

**Breathing marks** appear over initial vowels:
- **Smooth breathing** (᾿): no sound (like "apple")
- **Rough breathing** (῾): "h" sound (like "happy")`,
        examples: [
          {
            greek: 'ἀγορά',
            english: 'marketplace',
            source: 'Smooth breathing (᾿) - no "h" sound'
          },
          {
            greek: 'ἱστορία',
            english: 'inquiry, history',
            source: 'Rough breathing (῾) - pronounce "historia"'
          },
        ],
        exercises: [
          {
            question: 'The rough breathing mark adds what sound?',
            options: ['No sound', '"h" sound', '"w" sound', '"y" sound'],
            correct: 1,
            explanation: 'The rough breathing (῾) adds an "h" sound at the beginning of words.'
          },
          {
            question: 'Which letter is a double consonant representing κ+σ?',
            options: ['ζ', 'ξ', 'ψ', 'φ'],
            correct: 1,
            explanation: 'ξ (xi) represents the sound κ+σ, while ζ = δ+σ and ψ = π+σ.'
          },
        ],
        vocabulary: [
          { word: 'φιλοσοφία', meaning: 'love of wisdom, philosophy' },
          { word: 'χρόνος', meaning: 'time' },
          { word: 'ψυχή', meaning: 'soul, breath, life' },
        ],
      },
      {
        id: 'g1-4',
        title: 'Accents and Punctuation',
        content: `Greek has three accent marks indicating pitch (not stress):
- **Acute** (΄): rising pitch (e.g., ά)
- **Grave** (\`): falling pitch (e.g., ὰ)
- **Circumflex** (῀): rise-fall pitch (e.g., ᾶ)

The circumflex can only appear on long vowels (α, η, ι, υ, ω) or diphthongs.

**Accent rules**:
- Every Greek word has one accent
- Accent can only fall on one of the last three syllables
- The grave accent appears only on the last syllable and only if another word follows

**Punctuation**:
- Period: . (same as English)
- Comma: , (same as English)
- Semicolon/question mark: ; (Greek question mark!)
- Colon: · (raised dot)`,
        examples: [
          {
            greek: 'ἄνθρωπος',
            english: 'human being',
            source: 'Acute accent on first syllable'
          },
          {
            greek: 'τί ἐστι;',
            english: 'What is it?',
            source: 'Note the semicolon as question mark'
          },
        ],
        exercises: [
          {
            question: 'What does a semicolon (;) mean in Greek?',
            options: ['Period', 'Comma', 'Question mark', 'Exclamation'],
            correct: 2,
            explanation: 'In Greek, the semicolon (;) is used as a question mark.'
          },
          {
            question: 'The circumflex accent can appear on:',
            options: ['Any syllable', 'Only short vowels', 'Only long vowels or diphthongs', 'Only the first syllable'],
            correct: 2,
            explanation: 'The circumflex (῀) can only appear on long vowels or diphthongs.'
          },
        ],
        vocabulary: [
          { word: 'πῶς', meaning: 'how?', notes: 'Circumflex on long omega' },
          { word: 'τίς', meaning: 'who?', notes: 'Acute accent, interrogative' },
          { word: 'τὶς', meaning: 'someone', notes: 'Grave accent, indefinite' },
        ],
      },
      {
        id: 'g1-5',
        title: 'Reading Practice and Review',
        content: `Now that you know the alphabet, let's practice reading actual Greek texts. Start with short, common words and work up to sentences.

**Reading tips**:
1. Look for breathing marks on initial vowels
2. Note the accent placement
3. Identify diphthongs
4. Watch for final sigma (ς)
5. Practice reading aloud - Greek is meant to be spoken!

Remember: Classical Greek pronunciation varied by region (Attic, Ionic, Doric). We typically use restored Classical/Attic pronunciation for reading ancient texts.`,
        examples: [
          {
            greek: 'μῆνιν ἄειδε θεά',
            english: 'Sing, goddess, the wrath',
            source: 'Homer, Iliad 1.1 - First line of Western literature'
          },
          {
            greek: 'γνῶθι σεαυτόν',
            english: 'Know yourself',
            source: 'Delphic maxim - inscribed at Apollo\'s temple'
          },
          {
            greek: 'ἓν οἶδα ὅτι οὐδὲν οἶδα',
            english: 'One thing I know: that I know nothing',
            source: 'Socrates (reported by Plato)'
          },
        ],
        exercises: [
          {
            question: 'In the word "θεός" (god), what kind of breathing does θ have?',
            options: ['Smooth breathing', 'Rough breathing', 'No breathing mark', 'Circumflex'],
            correct: 1,
            explanation: 'θεός has rough breathing, so it\'s pronounced "theos" with an initial "h" sound.'
          },
          {
            question: 'How many syllables are in "φιλοσοφία"?',
            options: ['3', '4', '5', '6'],
            correct: 2,
            explanation: 'φιλοσοφία has 5 syllables: φι-λο-σο-φί-α (phi-lo-so-phi-a).'
          },
        ],
        vocabulary: [
          { word: 'καλός', meaning: 'beautiful, good' },
          { word: 'ἀγαθός', meaning: 'good, noble' },
          { word: 'σοφία', meaning: 'wisdom' },
          { word: 'ἀρετή', meaning: 'excellence, virtue' },
        ],
      },
    ],
  },

  g2: {
    id: 'g2',
    lessons: [
      {
        id: 'g2-1',
        title: 'Vowel Pronunciation',
        content: `Each Greek vowel has a specific sound. Practice these carefully:

**Short vowels**:
- **ε** (epsilon): like "e" in "pet" - ALWAYS short
- **ο** (omicron): like "o" in "pot" - ALWAYS short

**Long vowels**:
- **η** (eta): like "a" in "say" (long e) - ALWAYS long
- **ω** (omega): like "aw" in "saw" (long o) - ALWAYS long

**Variable vowels**:
- **α** (alpha): like "a" in "father" (can be short or long)
- **ι** (iota): like "ee" in "see" (can be short or long)
- **υ** (upsilon): like "u" in French "tu" or German "über"

The difference between short and long vowels is crucial for understanding Greek meter and poetry.`,
        examples: [
          {
            greek: 'ἔπος',
            english: 'word, epic poetry',
            source: 'Short epsilon (ε)'
          },
          {
            greek: 'ἦθος',
            english: 'character, custom',
            source: 'Long eta (η) - root of "ethics"'
          },
        ],
        exercises: [
          {
            question: 'Which vowel is ALWAYS long?',
            options: ['α', 'ε', 'η', 'ι'],
            correct: 2,
            explanation: 'η (eta) is always long, pronounced like "ay" in "day".'
          },
          {
            question: 'The vowel ο (omicron) is:',
            options: ['Always short', 'Always long', 'Can be either', 'Silent'],
            correct: 0,
            explanation: 'ο (omicron) is always short, while ω (omega) is always long.'
          },
        ],
        vocabulary: [
          { word: 'μέγας', meaning: 'great, large', notes: 'Short epsilon' },
          { word: 'μήτηρ', meaning: 'mother', notes: 'Long eta' },
          { word: 'πόλεμος', meaning: 'war', notes: 'Short omicron' },
          { word: 'δῶρον', meaning: 'gift', notes: 'Long omega' },
        ],
      },
      {
        id: 'g2-2',
        title: 'Diphthong Pronunciation',
        content: `A diphthong is two vowel sounds blended into one syllable. Greek has several important diphthongs:

**Common diphthongs**:
- **αι**: like "eye" or "ai" in "aisle"
- **ει**: like "ay" in "day" or "ei" in "eight"
- **οι**: like "oy" in "boy"
- **αυ**: like "ow" in "cow"
- **ευ**: like "eh-oo" (say both sounds quickly)
- **ου**: like "oo" in "food"

**Less common**:
- **υι**: like "wee"
- **ηυ**: like "ay-oo"

Special note: ου is the most common diphthong and almost always sounds like "oo."`,
        examples: [
          {
            greek: 'αἷμα',
            english: 'blood',
            source: 'Diphthong αι - root of "hematology"'
          },
          {
            greek: 'εὐδαιμονία',
            english: 'happiness, flourishing',
            source: 'Contains diphthongs ευ and αι'
          },
        ],
        exercises: [
          {
            question: 'The diphthong "ει" sounds like:',
            options: ['"eye"', '"day"', '"boy"', '"too"'],
            correct: 1,
            explanation: 'ει sounds like "ay" in "day" or "ei" in "eight".'
          },
          {
            question: 'Which diphthong sounds like "oo" in "food"?',
            options: ['αι', 'ει', 'οι', 'ου'],
            correct: 3,
            explanation: 'ου sounds like "oo" in "food" and is very common in Greek.'
          },
        ],
        vocabulary: [
          { word: 'παῖς', meaning: 'child', notes: 'Diphthong αι' },
          { word: 'θεῖος', meaning: 'divine', notes: 'Diphthong ει' },
          { word: 'ποιητής', meaning: 'poet, maker', notes: 'Diphthong οι' },
          { word: 'βούλομαι', meaning: 'I wish, want', notes: 'Diphthong ου' },
        ],
      },
      {
        id: 'g2-3',
        title: 'Consonant Pronunciation',
        content: `Greek consonants follow clear pronunciation patterns:

**Stops (organized by where they're formed)**:
- **Labials** (lips): π [p], β [b], φ [ph as in "top-hat"]
- **Dentals** (teeth): τ [t], δ [d], θ [th as in "thin"]
- **Gutturals** (throat): κ [k], γ [g], χ [kh as in "Bach"]

**Important notes**:
- φ is NOT "f" - it's an aspirated "p" (like "p" with extra breath)
- θ is NOT "th" as in "the" - it's "th" as in "thin"
- χ is NOT "ch" as in "church" - it's "kh" as in Scottish "loch"

**Other consonants**:
- **Liquids**: λ [l], ρ [r] (trilled, like Spanish or Italian)
- **Nasals**: μ [m], ν [n]
- **Sibilant**: σ/ς [s] (always "s" as in "snake," never "z")
- **Double**: ζ [zd or dz], ξ [ks], ψ [ps]`,
        examples: [
          {
            greek: 'φιλία',
            english: 'friendship',
            source: 'φ is "phil" not "fil"'
          },
          {
            greek: 'θάνατος',
            english: 'death',
            source: 'θ is "th" as in "thin"'
          },
        ],
        exercises: [
          {
            question: 'The letter φ is pronounced:',
            options: ['"f"', 'aspirated "p" (ph)', '"v"', '"b"'],
            correct: 1,
            explanation: 'φ is an aspirated "p" sound, like "p" in "top-hat" said quickly.'
          },
          {
            question: 'The double consonant ψ represents:',
            options: ['"ks"', '"ps"', '"ts"', '"fs"'],
            correct: 1,
            explanation: 'ψ represents the sound "ps" as in "lapse".'
          },
        ],
        vocabulary: [
          { word: 'χρόνος', meaning: 'time', notes: 'χ = "kh" sound' },
          { word: 'ψυχή', meaning: 'soul', notes: 'ψ = "ps" sound' },
          { word: 'ξένος', meaning: 'stranger, foreigner', notes: 'ξ = "ks" sound' },
        ],
      },
      {
        id: 'g2-4',
        title: 'Reading Aloud Practice',
        content: `Greek was primarily an oral language - texts were read aloud, even when reading alone. Practice reading these famous passages:

**Tips for reading Greek aloud**:
1. Read slowly at first - accuracy over speed
2. Pay attention to breathing marks
3. Note accent placement (though in reading, often treated as stress)
4. Pronounce every letter - nothing is silent (unlike English)
5. Practice rhythm - Greek has musical qualities

**Common mistakes to avoid**:
- Don't pronounce Greek letters with their English names ("alpha", "beta")
- Don't add sounds that aren't there (e.g., "h" before smooth breathing)
- Don't skip over diphthongs - blend them smoothly
- Don't read ου as "oo-oo" (two sounds) - it's one sound "oo"`,
        examples: [
          {
            greek: 'ἐν ἀρχῇ ἦν ὁ λόγος',
            english: 'In the beginning was the Word',
            source: 'Gospel of John 1:1'
          },
          {
            greek: 'πάντα ῥεῖ',
            english: 'Everything flows',
            source: 'Heraclitus'
          },
          {
            greek: 'σῶμα σῆμα',
            english: 'The body is a tomb',
            source: 'Orphic/Platonic saying'
          },
        ],
        exercises: [
          {
            question: 'When reading Greek aloud, you should:',
            options: ['Skip silent letters', 'Pronounce every letter', 'Add English sounds', 'Read backwards'],
            correct: 1,
            explanation: 'Greek has no silent letters - every letter should be pronounced.'
          },
          {
            question: 'A word with smooth breathing at the start should be pronounced:',
            options: ['With an "h" sound', 'Without an "h" sound', 'With a "w" sound', 'Silently'],
            correct: 1,
            explanation: 'Smooth breathing (᾿) means NO "h" sound - just the vowel itself.'
          },
        ],
        vocabulary: [
          { word: 'ἀρχή', meaning: 'beginning, principle, rule' },
          { word: 'λέγω', meaning: 'I say, speak' },
          { word: 'γράφω', meaning: 'I write' },
          { word: 'ὁράω', meaning: 'I see' },
        ],
      },
    ],
  },

  g3: {
    id: 'g3',
    lessons: [
      {
        id: 'g3-1',
        title: 'Essential Nouns',
        content: `Let's learn your first 25 Greek nouns - the most common words in ancient texts.

**People**:
- **ἄνθρωπος** (ánthrōpos) - human being, person
- **ἀνήρ** (anḗr) - man, husband
- **γυνή** (gynḗ) - woman, wife
- **παῖς** (paîs) - child
- **φίλος** (phílos) - friend

**Abstract Concepts**:
- **λόγος** (lógos) - word, speech, reason
- **νοῦς** (noûs) - mind, intellect
- **ψυχή** (psykhḗ) - soul, life, spirit
- **ἀλήθεια** (alḗtheia) - truth
- **δίκη** (díkē) - justice, lawsuit

**Time & Space**:
- **χρόνος** (khrónos) - time
- **τόπος** (tópos) - place, region
- **πόλις** (pólis) - city, city-state
- **οἶκος** (oîkos) - house, household

These words appear thousands of times in Greek literature.`,
        examples: [
          {
            greek: 'ὁ λόγος σὰρξ ἐγένετο',
            english: 'The Word became flesh',
            source: 'Gospel of John 1:14'
          },
          {
            greek: 'γνῶθι σεαυτόν',
            english: 'Know yourself',
            source: 'Delphic maxim'
          },
        ],
        exercises: [
          {
            question: 'What does "λόγος" mean?',
            options: ['time', 'word/speech/reason', 'city', 'soul'],
            correct: 1,
            explanation: 'λόγος (logos) means word, speech, or reason - it\'s the root of "-logy" in English.'
          },
          {
            question: 'What does "πόλις" mean?',
            options: ['police', 'city/city-state', 'politics', 'many'],
            correct: 1,
            explanation: 'πόλις (polis) means city or city-state. Root of "politics", "metropolis", etc.'
          },
        ],
        vocabulary: [
          { word: 'θεός', meaning: 'god, deity' },
          { word: 'κόσμος', meaning: 'order, world, cosmos' },
          { word: 'βίος', meaning: 'life' },
          { word: 'θάνατος', meaning: 'death' },
        ],
      },
      {
        id: 'g3-2',
        title: 'Essential Verbs',
        content: `The 20 most common Greek verbs - you'll see these everywhere.

**Being & Becoming**:
- **εἰμί** (eimí) - I am, exist
- **γίγνομαι** (gígnomai) - I become, happen

**Saying & Thinking**:
- **λέγω** (légō) - I say, speak
- **φημί** (phēmí) - I say, affirm
- **νομίζω** (nomízō) - I think, believe

**Doing & Making**:
- **ποιέω** (poiéō) - I do, make
- **πράττω** (prát tō) - I do, act

**Moving**:
- **ἔρχομαι** (érkhomai) - I come, go
- **βαίνω** (baínō) - I go, walk

**Having & Giving**:
- **ἔχω** (ékhō) - I have, hold
- **δίδωμι** (dídōmi) - I give
- **λαμβάνω** (lambánō) - I take, receive

These verbs account for ~30% of all verb occurrences in Greek texts.`,
        examples: [
          {
            greek: 'ἔρχομαι πρὸς σέ',
            english: 'I come to you',
            source: 'Common phrase'
          },
          {
            greek: 'τί ποιεῖς;',
            english: 'What are you doing?',
            source: 'Common question'
          },
        ],
        exercises: [
          {
            question: 'What does "λέγω" mean?',
            options: ['I go', 'I say', 'I have', 'I become'],
            correct: 1,
            explanation: 'λέγω means "I say" or "I speak" - root of words like "dialog".'
          },
          {
            question: 'What does "ἔχω" mean?',
            options: ['I give', 'I take', 'I have', 'I say'],
            correct: 2,
            explanation: 'ἔχω means "I have" or "I hold".'
          },
        ],
        vocabulary: [
          { word: 'ὁράω', meaning: 'I see' },
          { word: 'γράφω', meaning: 'I write' },
          { word: 'ἀκούω', meaning: 'I hear' },
          { word: 'εὑρίσκω', meaning: 'I find' },
        ],
      },
      {
        id: 'g3-3',
        title: 'Common Adjectives',
        content: `Essential Greek adjectives for describing the world.

**Size & Quantity**:
- **μέγας** (mégas) - great, large
- **μικρός** (mikrós) - small
- **πολύς** (polýs) - much, many
- **ὀλίγος** (olígos) - few, little

**Quality**:
- **ἀγαθός** (agathós) - good, noble
- **κακός** (kakós) - bad, evil
- **καλός** (kalós) - beautiful, fine
- **αἰσχρός** (aiskhros) - ugly, shameful

**Other Essentials**:
- **νέος** (néos) - new, young
- **παλαιός** (palaiós) - old, ancient
- **πρῶτος** (prôtos) - first
- **ἔσχατος** (éskhatos) - last

Greek adjectives agree with their nouns in gender, number, and case.`,
        examples: [
          {
            greek: 'καλὸς κἀγαθός',
            english: 'beautiful and good (the ideal Greek citizen)',
            source: 'Classical ideal'
          },
          {
            greek: 'μέγα βιβλίον, μέγα κακόν',
            english: 'big book, big evil',
            source: 'Callimachus - ancient book critic!'
          },
        ],
        exercises: [
          {
            question: 'What does "καλός" mean?',
            options: ['bad', 'beautiful/fine', 'small', 'new'],
            correct: 1,
            explanation: 'καλός means beautiful, fine, or noble. Root of "calligraphy" (beautiful writing).'
          },
          {
            question: 'What does "πολύς" mean?',
            options: ['few', 'much/many', 'first', 'last'],
            correct: 1,
            explanation: 'πολύς means much or many. Root of "poly-" in English (polygon, polymath).'
          },
        ],
        vocabulary: [
          { word: 'σοφός', meaning: 'wise' },
          { word: 'δίκαιος', meaning: 'just, righteous' },
          { word: 'ἀληθής', meaning: 'true' },
          { word: 'ψευδής', meaning: 'false' },
        ],
      },
    ],
  },

  g4: {
    id: 'g4',
    lessons: [
      {
        id: 'g4-1',
        title: 'Introduction to the Greek Article',
        content: `Greek has a **definite article** (the) but no indefinite article (a/an).

The article changes form based on:
1. **Gender**: masculine, feminine, or neuter
2. **Number**: singular or plural
3. **Case**: nominative, genitive, dative, accusative

**Nominative (subject) forms**:
- **ὁ** (ho) - the (masculine singular)
- **ἡ** (hē) - the (feminine singular)
- **τό** (to) - the (neuter singular)
- **οἱ** (hoi) - the (masculine plural)
- **αἱ** (hai) - the (feminine plural)
- **τά** (ta) - the (neuter plural)

The article must agree with its noun in gender, number, and case.`,
        examples: [
          {
            greek: 'ὁ ἄνθρωπος',
            english: 'the human being',
            source: 'masculine singular'
          },
          {
            greek: 'ἡ πόλις',
            english: 'the city',
            source: 'feminine singular'
          },
          {
            greek: 'τὸ τέκνον',
            english: 'the child',
            source: 'neuter singular'
          },
        ],
        exercises: [
          {
            question: 'What is the masculine singular article?',
            options: ['ὁ', 'ἡ', 'τό', 'οἱ'],
            correct: 0,
            explanation: 'ὁ is the masculine singular nominative article ("the").'
          },
          {
            question: 'What is the feminine singular article?',
            options: ['ὁ', 'ἡ', 'τό', 'αἱ'],
            correct: 1,
            explanation: 'ἡ is the feminine singular nominative article.'
          },
        ],
        vocabulary: [
          { word: 'ὁ λόγος', meaning: 'the word (masc.)', notes: 'Note the masculine article' },
          { word: 'ἡ ψυχή', meaning: 'the soul (fem.)', notes: 'Note the feminine article' },
          { word: 'τὸ δῶρον', meaning: 'the gift (neut.)', notes: 'Note the neuter article' },
        ],
      },
      {
        id: 'g4-2',
        title: 'Noun Gender in Greek',
        content: `Every Greek noun has a **grammatical gender**: masculine, feminine, or neuter. This is NOT about biological sex - it's purely grammatical.

**Generally**:
- Male beings → masculine (ὁ ἀνήρ - the man)
- Female beings → feminine (ἡ γυνή - the woman)
- BUT most nouns don't follow biological logic!

**Examples of "illogical" gender**:
- ἡ ὁδός (the road) - feminine, but roads aren't female
- ὁ οἶνος (the wine) - masculine
- τὸ βιβλίον (the book) - neuter

**Clues to gender**:
- Nouns ending in -ος are usually masculine
- Nouns ending in -α/-η are usually feminine
- Nouns ending in -ον are usually neuter

BUT there are many exceptions! You must learn the article with each noun.`,
        examples: [
          {
            greek: 'ὁ θεός',
            english: 'the god',
            source: 'masculine - ends in -ος'
          },
          {
            greek: 'ἡ θεά',
            english: 'the goddess',
            source: 'feminine - ends in -α'
          },
          {
            greek: 'τὸ δαιμόνιον',
            english: 'the divine spirit',
            source: 'neuter - ends in -ον'
          },
        ],
        exercises: [
          {
            question: 'Nouns ending in -ος are usually:',
            options: ['masculine', 'feminine', 'neuter', 'any gender'],
            correct: 0,
            explanation: 'Nouns ending in -ος are usually masculine, like ὁ λόγος.'
          },
          {
            question: 'Nouns ending in -ον are usually:',
            options: ['masculine', 'feminine', 'neuter', 'any gender'],
            correct: 2,
            explanation: 'Nouns ending in -ον are usually neuter, like τὸ δῶρον.'
          },
        ],
        vocabulary: [
          { word: 'ὁ ἵππος', meaning: 'the horse (masc.)' },
          { word: 'ἡ ὁδός', meaning: 'the road (fem.)' },
          { word: 'τὸ ζῷον', meaning: 'the animal (neut.)' },
        ],
      },
    ],
  },
};

// ==================================================================
// LATIN MODULES - Complete Content
// ==================================================================

export const LATIN_LESSONS: Record<string, Module> = {
  l1: {
    id: 'l1',
    lessons: [
      {
        id: 'l1-1',
        title: 'The Latin Alphabet',
        content: `The Latin alphabet originally had 23 letters, derived from the Etruscan alphabet (which came from Greek). The letters J, U, and W were added later.

**Classical Latin alphabet** (23 letters):
A B C D E F G H I K L M N O P Q R S T V X Y Z

**Important notes**:
- **I** served as both vowel "i" and consonant "j"
- **V** served as both vowel "u" and consonant "v"
- **K** was rarely used (C took its place)
- **Y** and **Z** were added later to spell Greek loanwords

In modern printed editions:
- J/j is used for consonantal I
- U/u is used for vocalic V
- V/v is used for consonantal V`,
        examples: [
          {
            latin: 'SENATVS·POPVLVSQVE·ROMANVS',
            english: 'The Senate and People of Rome (SPQR)',
            source: 'Classical inscription style - no J or U'
          },
          {
            latin: 'veni, vidi, vici',
            english: 'I came, I saw, I conquered',
            source: 'Julius Caesar'
          },
        ],
        exercises: [
          {
            question: 'How many letters were in the original classical Latin alphabet?',
            options: ['21', '23', '26', '28'],
            correct: 1,
            explanation: 'Classical Latin had 23 letters. J, U, and W were added later.'
          },
          {
            question: 'In classical inscriptions, how was the sound "u" written?',
            options: ['U', 'V', 'W', 'Y'],
            correct: 1,
            explanation: 'V was used for both "u" and "v" sounds in classical Latin.'
          },
        ],
        vocabulary: [
          { word: 'a, ab', meaning: 'from, away from', notes: 'One of the most common prepositions' },
          { word: 'ad', meaning: 'to, toward', notes: 'Root of many English words (advance, adapt)' },
          { word: 'et', meaning: 'and', notes: 'Similar to French "et"' },
        ],
      },
      {
        id: 'l1-2',
        title: 'Vowel Sounds',
        content: `Latin has five vowel letters, each with both short and long forms. Unlike Greek, Latin doesn't have different letters for long/short - length is marked with a macron (ˉ) in textbooks.

**Vowels**:
- **A/ā**: short like "ah" in "father" (short), long like "ahhh" (held longer)
- **E/ē**: short like "e" in "pet", long like "ay" in "day"
- **I/ī**: short like "i" in "sit", long like "ee" in "see"
- **O/ō**: short like "o" in "pot", long like "o" in "note"
- **U/ū**: short like "u" in "put", long like "oo" in "food"

**Diphthongs** (two vowels, one syllable):
- **ae**: like "eye" or "ai" in "aisle"
- **au**: like "ow" in "how"
- **ei**: like "ay" in "day"
- **eu**: like "eh-oo" (rare)
- **oe**: like "oi" in "oil"
- **ui**: like "wee" (rare)

Vowel length affects meaning AND meter in poetry.`,
        examples: [
          {
            latin: 'māter',
            english: 'mother',
            source: 'Long ā sound'
          },
          {
            latin: 'Caesar',
            english: 'Caesar',
            source: 'Diphthong ae pronounced like "eye-sar"'
          },
        ],
        exercises: [
          {
            question: 'The diphthong "ae" is pronounced:',
            options: ['"ay"', '"eye"', '"ee"', '"oy"'],
            correct: 1,
            explanation: 'The diphthong "ae" sounds like "eye" in Latin.'
          },
          {
            question: 'A macron (ˉ) over a vowel indicates:',
            options: ['Short vowel', 'Long vowel', 'Silent vowel', 'Stress'],
            correct: 1,
            explanation: 'A macron marks a long vowel, which is held longer in pronunciation.'
          },
        ],
        vocabulary: [
          { word: 'pater', meaning: 'father' },
          { word: 'mater', meaning: 'mother' },
          { word: 'frater', meaning: 'brother' },
          { word: 'soror', meaning: 'sister' },
        ],
      },
      {
        id: 'l1-3',
        title: 'Consonant Sounds',
        content: `Latin consonants are generally pronounced as in English, with some important exceptions:

**Standard consonants** (same as English):
- B, D, F, L, M, N, P, S, T

**Special pronunciations**:
- **C**: ALWAYS "k" as in "cat" (never soft "s")
- **G**: ALWAYS hard "g" as in "go" (never soft "j")
- **V**: pronounced "w" as in "wine" (not "v")
- **R**: trilled (rolled) like Spanish or Italian
- **H**: aspirated (breathy) like English "h"

**Consonant combinations**:
- **ch**: "k" sound (from Greek χ)
- **ph**: "p" + "h" (from Greek φ)
- **th**: "t" + "h" (from Greek θ)
- **gn**: "ngn" (both sounds) as in "hangnail"
- **qu**: "kw" as in "quick"

**Double consonants**: Pronounce both/hold longer (e.g., "tt" in "mittō")`,
        examples: [
          {
            latin: 'vīvō',
            english: 'I live',
            source: 'V pronounced as "w" - sounds like "wee-wo"'
          },
          {
            latin: 'vincit qui sē vincit',
            english: 'He conquers who conquers himself',
            source: 'C always "k", V always "w"'
          },
        ],
        exercises: [
          {
            question: 'In Latin, the letter C is pronounced:',
            options: ['Always "k"', 'Always "s"', 'Sometimes "k", sometimes "s"', 'Always "ch"'],
            correct: 0,
            explanation: 'C is ALWAYS pronounced "k" in classical Latin, never soft "s".'
          },
          {
            question: 'The letter V in Latin is pronounced:',
            options: ['"v"', '"w"', '"f"', '"b"'],
            correct: 1,
            explanation: 'V is pronounced as "w" in classical Latin pronunciation.'
          },
        ],
        vocabulary: [
          { word: 'vincō, vincere', meaning: 'to conquer, overcome' },
          { word: 'vīta', meaning: 'life' },
          { word: 'vōx', meaning: 'voice' },
          { word: 'cum', meaning: 'with' },
        ],
      },
      {
        id: 'l1-4',
        title: 'Reading Latin Aloud',
        content: `Latin was meant to be read aloud - rhetoric and oratory were central to Roman education. Practice reading with attention to:

**Pronunciation rules**:
1. Every letter is pronounced (no silent letters)
2. Vowels are pure sounds (don't diphthongize like English)
3. Consonants are crisp and clear
4. Double consonants are held longer

**Syllable rules**:
- A syllable is long if it has:
  - A long vowel or diphthong, OR
  - A short vowel followed by two consonants
- All other syllables are short

**Accent rules**:
- Words of 2 syllables: accent the first
- Words of 3+ syllables: accent the second-to-last (penult) IF it's long
- Otherwise: accent the third-to-last (antepenult)`,
        examples: [
          {
            latin: 'Arma virumque canō',
            english: 'I sing of arms and the man',
            source: 'Virgil, Aeneid 1.1 - first line of Rome\'s epic'
          },
          {
            latin: 'Carpe diem',
            english: 'Seize the day',
            source: 'Horace'
          },
          {
            latin: 'Dum spīrō, spērō',
            english: 'While I breathe, I hope',
            source: 'Latin motto'
          },
        ],
        exercises: [
          {
            question: 'In a two-syllable Latin word, which syllable is accented?',
            options: ['First', 'Second', 'Neither', 'Both'],
            correct: 0,
            explanation: 'Two-syllable words are always accented on the first syllable.'
          },
          {
            question: 'A syllable is long if it contains:',
            options: ['Any vowel', 'A long vowel or diphthong', 'A consonant', 'Two vowels'],
            correct: 1,
            explanation: 'A syllable is long if it has a long vowel/diphthong, or a short vowel + two consonants.'
          },
        ],
        vocabulary: [
          { word: 'arma', meaning: 'arms, weapons' },
          { word: 'vir', meaning: 'man, hero' },
          { word: 'canō, canere', meaning: 'to sing' },
          { word: 'diēs', meaning: 'day' },
        ],
      },
    ],
  },

  // Additional Latin modules would follow the same pattern...
};

// Helper function to get lessons for a module
export function getModuleLessons(moduleId: string): Lesson[] {
  const greekModule = GREEK_LESSONS[moduleId];
  if (greekModule) return greekModule.lessons;

  const latinModule = LATIN_LESSONS[moduleId];
  if (latinModule) return latinModule.lessons;

  return [];
}

// Helper to check if module has content
export function hasLessonContent(moduleId: string): boolean {
  return !!(GREEK_LESSONS[moduleId] || LATIN_LESSONS[moduleId]);
}
