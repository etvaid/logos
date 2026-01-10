// Translator Personas - 38 distinct translation styles

export interface TranslatorPersona {
  id: string;
  name: string;
  era: string;
  dates?: string;
  specialty: string[];
  style: {
    literalness: number; // 0-100, 0 = very free, 100 = very literal
    poeticness: number; // 0-100
    formality: number; // 0-100
    accessibility: number; // 0-100
    scholarlyPrecision: number; // 0-100
  };
  description: string;
  signature: string; // What makes them distinctive
  sampleTranslation?: {
    source: string;
    translation: string;
    work: string;
  };
  avatar?: string;
  works: string[];
}

export const TRANSLATOR_PERSONAS: TranslatorPersona[] = [
  {
    id: 'lattimore',
    name: 'Richmond Lattimore',
    era: 'Modern (20th c.)',
    dates: '1906-1984',
    specialty: ['Homer', 'Greek Tragedy', 'New Testament'],
    style: {
      literalness: 85,
      poeticness: 70,
      formality: 80,
      accessibility: 60,
      scholarlyPrecision: 90,
    },
    description: 'Austere and faithful. Preserves Greek hexameter rhythm in English. Highly influential academic translation.',
    signature: 'Preserves original meter and word order as much as possible',
    sampleTranslation: {
      source: 'μῆνιν ἄειδε θεὰ Πηληϊάδεω Ἀχιλῆος',
      translation: 'Sing, goddess, the anger of Peleus\' son Achilleus',
      work: 'Iliad 1.1',
    },
    works: ['Iliad', 'Odyssey', 'Oresteia', 'Greek Lyrics'],
  },
  {
    id: 'fagles',
    name: 'Robert Fagles',
    era: 'Modern (Late 20th c.)',
    dates: '1933-2008',
    specialty: ['Homer', 'Virgil', 'Greek Tragedy'],
    style: {
      literalness: 55,
      poeticness: 85,
      formality: 60,
      accessibility: 85,
      scholarlyPrecision: 75,
    },
    description: 'Dynamic and dramatic. Makes ancient texts feel alive and urgent. Bestselling modern translations.',
    signature: 'Vivid, cinematic prose that captures drama and emotion',
    sampleTranslation: {
      source: 'μῆνιν ἄειδε θεὰ Πηληϊάδεω Ἀχιλῆος',
      translation: 'Rage—Goddess, sing the rage of Peleus\' son Achilles',
      work: 'Iliad 1.1',
    },
    works: ['Iliad', 'Odyssey', 'Aeneid', 'Oresteia'],
  },
  {
    id: 'wilson',
    name: 'Emily Wilson',
    era: 'Contemporary',
    dates: 'b. 1971',
    specialty: ['Homer', 'Seneca'],
    style: {
      literalness: 60,
      poeticness: 75,
      formality: 45,
      accessibility: 95,
      scholarlyPrecision: 80,
    },
    description: 'Fresh, direct, challenges traditional interpretations. First woman to translate the Odyssey into English.',
    signature: 'Clear, contemporary language with feminist awareness',
    sampleTranslation: {
      source: 'ἄνδρα μοι ἔννεπε, Μοῦσα, πολύτροπον',
      translation: 'Tell me about a complicated man',
      work: 'Odyssey 1.1',
    },
    works: ['Odyssey', 'Seneca\'s Tragedies'],
  },
  {
    id: 'fitzgerald',
    name: 'Robert Fitzgerald',
    era: 'Modern (20th c.)',
    dates: '1910-1985',
    specialty: ['Homer', 'Virgil'],
    style: {
      literalness: 50,
      poeticness: 95,
      formality: 70,
      accessibility: 75,
      scholarlyPrecision: 70,
    },
    description: 'Lyrical and musical. Creates beautiful English verse that stands as poetry in its own right.',
    signature: 'Elegant blank verse with subtle musicality',
    sampleTranslation: {
      source: 'Arma virumque cano',
      translation: 'I sing of warfare and a man at war',
      work: 'Aeneid 1.1',
    },
    works: ['Odyssey', 'Iliad', 'Aeneid'],
  },
  {
    id: 'murray',
    name: 'A.T. Murray',
    era: 'Early Modern',
    dates: '1866-1940',
    specialty: ['Homer'],
    style: {
      literalness: 95,
      poeticness: 40,
      formality: 90,
      accessibility: 50,
      scholarlyPrecision: 95,
    },
    description: 'The Loeb Classical Library standard. Scholarly prose aimed at accuracy over beauty.',
    signature: 'Precise, academic prose for scholarly reference',
    sampleTranslation: {
      source: 'μῆνιν ἄειδε θεὰ Πηληϊάδεω Ἀχιλῆος',
      translation: 'The wrath sing, goddess, of Peleus\' son Achilles',
      work: 'Iliad 1.1',
    },
    works: ['Iliad', 'Odyssey'],
  },
  {
    id: 'rouse',
    name: 'W.H.D. Rouse',
    era: 'Early Modern',
    dates: '1863-1950',
    specialty: ['Homer'],
    style: {
      literalness: 40,
      poeticness: 30,
      formality: 35,
      accessibility: 95,
      scholarlyPrecision: 55,
    },
    description: 'Prose translation emphasizing story over poetry. Reads like a novel.',
    signature: 'Readable prose that prioritizes narrative flow',
    sampleTranslation: {
      source: 'μῆνιν ἄειδε θεὰ Πηληϊάδεω Ἀχιλῆος',
      translation: 'An angry man—there is my story',
      work: 'Iliad 1.1',
    },
    works: ['Iliad', 'Odyssey'],
  },
  {
    id: 'butler',
    name: 'Samuel Butler',
    era: 'Victorian',
    dates: '1835-1902',
    specialty: ['Homer'],
    style: {
      literalness: 60,
      poeticness: 25,
      formality: 80,
      accessibility: 70,
      scholarlyPrecision: 65,
    },
    description: 'Victorian prose translation. Formal but clear. Believed Odyssey was written by a woman.',
    signature: 'Clear Victorian prose with occasional footnoted theories',
    works: ['Iliad', 'Odyssey'],
  },
  {
    id: 'rieu',
    name: 'E.V. Rieu',
    era: 'Modern (20th c.)',
    dates: '1887-1972',
    specialty: ['Homer', 'Virgil'],
    style: {
      literalness: 50,
      poeticness: 45,
      formality: 55,
      accessibility: 90,
      scholarlyPrecision: 60,
    },
    description: 'Penguin Classics founder. Created accessible prose translations for general readers.',
    signature: 'Smooth, readable prose for mass audiences',
    works: ['Odyssey', 'Iliad', 'Aeneid'],
  },
  {
    id: 'lombardo',
    name: 'Stanley Lombardo',
    era: 'Contemporary',
    dates: 'b. 1943',
    specialty: ['Homer', 'Hesiod', 'Virgil'],
    style: {
      literalness: 45,
      poeticness: 80,
      formality: 30,
      accessibility: 90,
      scholarlyPrecision: 65,
    },
    description: 'Contemporary, punchy, performative. Translations meant to be read aloud.',
    signature: 'Short lines, modern idiom, spoken-word energy',
    sampleTranslation: {
      source: 'μῆνιν ἄειδε θεὰ Πηληϊάδεω Ἀχιλῆος',
      translation: 'Wrath: sing, Goddess, Achilles\' wrath',
      work: 'Iliad 1.1',
    },
    works: ['Iliad', 'Odyssey', 'Aeneid', 'Hesiod'],
  },
  {
    id: 'alexander',
    name: 'Caroline Alexander',
    era: 'Contemporary',
    dates: 'b. 1956',
    specialty: ['Homer'],
    style: {
      literalness: 75,
      poeticness: 70,
      formality: 65,
      accessibility: 75,
      scholarlyPrecision: 85,
    },
    description: 'Recent scholarly translation balancing accuracy with readability.',
    signature: 'Careful attention to Homeric epithets and formulas',
    works: ['Iliad'],
  },
  {
    id: 'ruden',
    name: 'Sarah Ruden',
    era: 'Contemporary',
    dates: 'b. 1962',
    specialty: ['Virgil', 'Apuleius', 'Augustine', 'Gospels'],
    style: {
      literalness: 70,
      poeticness: 75,
      formality: 65,
      accessibility: 70,
      scholarlyPrecision: 80,
    },
    description: 'Theological sensitivity combined with classical scholarship. Quaker perspective.',
    signature: 'Attention to religious/spiritual dimensions of texts',
    works: ['Aeneid', 'Golden Ass', 'Confessions', 'Gospels'],
  },
  {
    id: 'green',
    name: 'Peter Green',
    era: 'Modern-Contemporary',
    dates: 'b. 1924',
    specialty: ['Hellenistic poetry', 'Ovid', 'Apollonius'],
    style: {
      literalness: 60,
      poeticness: 75,
      formality: 55,
      accessibility: 70,
      scholarlyPrecision: 90,
    },
    description: 'Scholarly wit and comprehensive notes. Hellenistic period specialist.',
    signature: 'Extensive learned commentary accompanying translations',
    works: ['Argonautica', 'Metamorphoses', 'Greek Anthology'],
  },
  {
    id: 'mandelbaum',
    name: 'Allen Mandelbaum',
    era: 'Modern (20th c.)',
    dates: '1926-2011',
    specialty: ['Virgil', 'Dante', 'Ovid'],
    style: {
      literalness: 55,
      poeticness: 90,
      formality: 70,
      accessibility: 65,
      scholarlyPrecision: 75,
    },
    description: 'Poet\'s translation. Beautiful blank verse praised for its musicality.',
    signature: 'Flowing blank verse with consistent elegance',
    works: ['Aeneid', 'Metamorphoses', 'Divine Comedy'],
  },
  {
    id: 'dryden',
    name: 'John Dryden',
    era: 'Restoration',
    dates: '1631-1700',
    specialty: ['Virgil', 'Ovid', 'Juvenal'],
    style: {
      literalness: 35,
      poeticness: 95,
      formality: 85,
      accessibility: 50,
      scholarlyPrecision: 55,
    },
    description: 'Augustan Age master. Heroic couplets that were the standard for centuries.',
    signature: 'Majestic heroic couplets in 17th-century English',
    works: ['Aeneid', 'Metamorphoses', 'Satires'],
  },
  {
    id: 'pope',
    name: 'Alexander Pope',
    era: 'Augustan',
    dates: '1688-1744',
    specialty: ['Homer'],
    style: {
      literalness: 25,
      poeticness: 100,
      formality: 90,
      accessibility: 45,
      scholarlyPrecision: 50,
    },
    description: 'The great Augustan Homer. Rhyming couplets that are poems in their own right.',
    signature: 'Brilliant heroic couplets, more Pope than Homer',
    sampleTranslation: {
      source: 'μῆνιν ἄειδε θεὰ Πηληϊάδεω Ἀχιλῆος',
      translation: 'Achilles\' wrath, to Greece the direful spring / Of woes unnumber\'d, heavenly goddess, sing!',
      work: 'Iliad 1.1-2',
    },
    works: ['Iliad', 'Odyssey'],
  },
  {
    id: 'chapman',
    name: 'George Chapman',
    era: 'Elizabethan',
    dates: '1559-1634',
    specialty: ['Homer'],
    style: {
      literalness: 40,
      poeticness: 85,
      formality: 85,
      accessibility: 35,
      scholarlyPrecision: 60,
    },
    description: 'First complete English Homer. Inspired Keats\'s famous sonnet.',
    signature: 'Elizabethan vigor with fourteener verse',
    works: ['Iliad', 'Odyssey'],
  },
  {
    id: 'jowett',
    name: 'Benjamin Jowett',
    era: 'Victorian',
    dates: '1817-1893',
    specialty: ['Plato', 'Thucydides'],
    style: {
      literalness: 70,
      poeticness: 30,
      formality: 85,
      accessibility: 70,
      scholarlyPrecision: 85,
    },
    description: 'Oxford Master of Balliol. Standard Victorian Plato translations.',
    signature: 'Clear Victorian prose for philosophical texts',
    works: ['Plato\'s Dialogues', 'Thucydides'],
  },
  {
    id: 'grube',
    name: 'G.M.A. Grube',
    era: 'Modern (20th c.)',
    dates: '1899-1982',
    specialty: ['Plato'],
    style: {
      literalness: 75,
      poeticness: 35,
      formality: 65,
      accessibility: 80,
      scholarlyPrecision: 85,
    },
    description: 'Clear, accurate Plato for modern students. Hackett series.',
    signature: 'Philosophical precision with modern clarity',
    works: ['Republic', 'Five Dialogues'],
  },
  {
    id: 'shorey',
    name: 'Paul Shorey',
    era: 'Early Modern',
    dates: '1857-1934',
    specialty: ['Plato'],
    style: {
      literalness: 85,
      poeticness: 25,
      formality: 90,
      accessibility: 55,
      scholarlyPrecision: 95,
    },
    description: 'Loeb Classical Library Plato. Scholarly reference standard.',
    signature: 'Academic prose with extensive commentary',
    works: ['Republic', 'Laws'],
  },
  {
    id: 'waterfield',
    name: 'Robin Waterfield',
    era: 'Contemporary',
    dates: 'b. 1952',
    specialty: ['Plato', 'Herodotus', 'Xenophon'],
    style: {
      literalness: 65,
      poeticness: 45,
      formality: 55,
      accessibility: 85,
      scholarlyPrecision: 80,
    },
    description: 'Prolific contemporary translator. Readable scholarly translations.',
    signature: 'Balanced approach for modern general readers',
    works: ['Symposium', 'Phaedrus', 'Histories', 'Anabasis'],
  },
  {
    id: 'selincourt',
    name: 'Aubrey de Sélincourt',
    era: 'Modern (20th c.)',
    dates: '1894-1962',
    specialty: ['Herodotus', 'Livy'],
    style: {
      literalness: 55,
      poeticness: 50,
      formality: 60,
      accessibility: 85,
      scholarlyPrecision: 70,
    },
    description: 'Penguin Classics Herodotus. Lively and engaging prose.',
    signature: 'Storytelling emphasis in historical narrative',
    works: ['Histories', 'Early History of Rome'],
  },
  {
    id: 'crawley',
    name: 'Richard Crawley',
    era: 'Victorian',
    dates: '1840-1893',
    specialty: ['Thucydides'],
    style: {
      literalness: 80,
      poeticness: 35,
      formality: 85,
      accessibility: 60,
      scholarlyPrecision: 85,
    },
    description: 'Victorian Thucydides. Dense but accurate.',
    signature: 'Formal Victorian prose preserving Greek complexity',
    works: ['History of the Peloponnesian War'],
  },
  {
    id: 'warner',
    name: 'Rex Warner',
    era: 'Modern (20th c.)',
    dates: '1905-1986',
    specialty: ['Thucydides', 'Xenophon'],
    style: {
      literalness: 65,
      poeticness: 40,
      formality: 65,
      accessibility: 80,
      scholarlyPrecision: 75,
    },
    description: 'Penguin Classics Thucydides. More readable than Crawley.',
    signature: 'Clear modern prose for historical texts',
    works: ['Peloponnesian War', 'Hellenica'],
  },
  {
    id: 'grene',
    name: 'David Grene',
    era: 'Modern (20th c.)',
    dates: '1913-2002',
    specialty: ['Greek Tragedy', 'Herodotus'],
    style: {
      literalness: 70,
      poeticness: 65,
      formality: 70,
      accessibility: 70,
      scholarlyPrecision: 85,
    },
    description: 'Chicago Complete Greek Tragedies co-editor. Scholarly and readable.',
    signature: 'Academic accuracy with dramatic sensibility',
    works: ['Sophocles', 'Herodotus'],
  },
  {
    id: 'arrowsmith',
    name: 'William Arrowsmith',
    era: 'Modern (20th c.)',
    dates: '1924-1992',
    specialty: ['Greek Comedy', 'Euripides', 'Petronius'],
    style: {
      literalness: 45,
      poeticness: 75,
      formality: 40,
      accessibility: 85,
      scholarlyPrecision: 75,
    },
    description: 'Witty, theatrical translations. Made ancient comedy funny again.',
    signature: 'Contemporary humor and theatrical vitality',
    works: ['Aristophanes', 'Euripides', 'Satyricon'],
  },
  {
    id: 'loeb_cicero',
    name: 'Walter Miller',
    era: 'Early Modern',
    dates: '1864-1949',
    specialty: ['Cicero'],
    style: {
      literalness: 90,
      poeticness: 25,
      formality: 85,
      accessibility: 55,
      scholarlyPrecision: 95,
    },
    description: 'Loeb Classical Library Cicero. Reference-quality translations.',
    signature: 'Precise scholarly prose for philosophical works',
    works: ['De Officiis', 'De Finibus'],
  },
  {
    id: 'grant',
    name: 'Michael Grant',
    era: 'Modern (20th c.)',
    dates: '1914-2004',
    specialty: ['Cicero', 'Tacitus'],
    style: {
      literalness: 55,
      poeticness: 40,
      formality: 60,
      accessibility: 85,
      scholarlyPrecision: 75,
    },
    description: 'Penguin Classics Latin prose. Clear and accessible.',
    signature: 'Modern readable prose for Roman authors',
    works: ['Selected Political Speeches', 'Annals'],
  },
  {
    id: 'west_virgil',
    name: 'David West',
    era: 'Contemporary',
    dates: '1931-2015',
    specialty: ['Virgil', 'Horace'],
    style: {
      literalness: 55,
      poeticness: 80,
      formality: 55,
      accessibility: 85,
      scholarlyPrecision: 80,
    },
    description: 'Penguin Virgil. Prose that captures poetic beauty.',
    signature: 'Lyrical prose translations of Latin verse',
    works: ['Aeneid', 'Odes'],
  },
  {
    id: 'kline',
    name: 'A.S. Kline',
    era: 'Contemporary',
    dates: 'b. 1947',
    specialty: ['Ovid', 'Virgil', 'Catullus'],
    style: {
      literalness: 65,
      poeticness: 70,
      formality: 50,
      accessibility: 90,
      scholarlyPrecision: 70,
    },
    description: 'Free online translations. Accessible verse for wide audience.',
    signature: 'Readable verse translations freely available online',
    works: ['Metamorphoses', 'Aeneid', 'Catullus'],
  },
  {
    id: 'rolfe',
    name: 'John C. Rolfe',
    era: 'Early Modern',
    dates: '1859-1943',
    specialty: ['Suetonius', 'Gellius'],
    style: {
      literalness: 90,
      poeticness: 20,
      formality: 85,
      accessibility: 55,
      scholarlyPrecision: 95,
    },
    description: 'Loeb Classical Library. Standard scholarly translations.',
    signature: 'Reference-quality prose for Roman biography',
    works: ['Lives of the Caesars', 'Attic Nights'],
  },
  {
    id: 'graves',
    name: 'Robert Graves',
    era: 'Modern (20th c.)',
    dates: '1895-1985',
    specialty: ['Suetonius', 'Apuleius', 'Lucan'],
    style: {
      literalness: 40,
      poeticness: 60,
      formality: 45,
      accessibility: 90,
      scholarlyPrecision: 55,
    },
    description: 'Novelist\'s translations. Vivid storytelling over strict accuracy.',
    signature: 'Narrative drive and novelistic flair',
    works: ['The Twelve Caesars', 'Golden Ass', 'Pharsalia'],
  },
  {
    id: 'radice',
    name: 'Betty Radice',
    era: 'Modern (20th c.)',
    dates: '1912-1985',
    specialty: ['Pliny', 'Terence', 'Erasmus'],
    style: {
      literalness: 70,
      poeticness: 40,
      formality: 60,
      accessibility: 80,
      scholarlyPrecision: 80,
    },
    description: 'Penguin Classics editor and translator. Clear, careful work.',
    signature: 'Careful scholarship with readability',
    works: ['Letters of Pliny', 'Comedies'],
  },
  {
    id: 'church_brodribb',
    name: 'Church & Brodribb',
    era: 'Victorian',
    dates: '19th c.',
    specialty: ['Tacitus'],
    style: {
      literalness: 75,
      poeticness: 55,
      formality: 90,
      accessibility: 50,
      scholarlyPrecision: 85,
    },
    description: 'Classic Victorian Tacitus. Formal and dignified.',
    signature: 'Victorian gravitas matching Tacitus\'s style',
    works: ['Annals', 'Histories', 'Agricola', 'Germania'],
  },
  {
    id: 'hammond',
    name: 'Martin Hammond',
    era: 'Contemporary',
    dates: 'b. 1944',
    specialty: ['Homer', 'Marcus Aurelius'],
    style: {
      literalness: 75,
      poeticness: 60,
      formality: 60,
      accessibility: 80,
      scholarlyPrecision: 80,
    },
    description: 'Penguin Classics. Scholarly but accessible translations.',
    signature: 'Balanced modern scholarly translations',
    works: ['Iliad', 'Meditations'],
  },
  {
    id: 'hays',
    name: 'Gregory Hays',
    era: 'Contemporary',
    dates: 'b. 1961',
    specialty: ['Marcus Aurelius'],
    style: {
      literalness: 60,
      poeticness: 50,
      formality: 45,
      accessibility: 95,
      scholarlyPrecision: 75,
    },
    description: 'Modern Library Meditations. Fresh, contemporary idiom.',
    signature: 'Contemporary accessibility for philosophical texts',
    works: ['Meditations'],
  },
  {
    id: 'kenney',
    name: 'E.J. Kenney',
    era: 'Contemporary',
    dates: 'b. 1924',
    specialty: ['Apuleius', 'Ovid'],
    style: {
      literalness: 70,
      poeticness: 65,
      formality: 65,
      accessibility: 75,
      scholarlyPrecision: 90,
    },
    description: 'Cambridge scholar. Precise and learned translations.',
    signature: 'Scholarly precision with literary sensitivity',
    works: ['Golden Ass', 'Heroides'],
  },
  {
    id: 'verity',
    name: 'Anthony Verity',
    era: 'Contemporary',
    dates: '20th-21st c.',
    specialty: ['Homer', 'Pindar', 'Theocritus'],
    style: {
      literalness: 75,
      poeticness: 65,
      formality: 60,
      accessibility: 75,
      scholarlyPrecision: 80,
    },
    description: 'Oxford World\'s Classics. Reliable scholarly translations.',
    signature: 'Scholarly verse translations for students',
    works: ['Iliad', 'Olympian Odes', 'Idylls'],
  },
];

// Style presets for quick selection
export const STYLE_PRESETS = [
  {
    id: 'literal',
    name: 'Literal',
    description: 'Word-for-word accuracy, preserving original structure',
    style: { literalness: 95, poeticness: 30, formality: 80, accessibility: 50, scholarlyPrecision: 95 },
  },
  {
    id: 'literary',
    name: 'Literary',
    description: 'Elegant English prose, balancing accuracy and beauty',
    style: { literalness: 60, poeticness: 70, formality: 60, accessibility: 75, scholarlyPrecision: 75 },
  },
  {
    id: 'poetic',
    name: 'Poetic',
    description: 'Captures meter, rhythm, and artistic beauty',
    style: { literalness: 40, poeticness: 95, formality: 65, accessibility: 60, scholarlyPrecision: 60 },
  },
  {
    id: 'accessible',
    name: 'Accessible',
    description: 'Clear, contemporary language for modern readers',
    style: { literalness: 50, poeticness: 55, formality: 35, accessibility: 95, scholarlyPrecision: 65 },
  },
  {
    id: 'academic',
    name: 'Academic',
    description: 'Scholarly precision for research and study',
    style: { literalness: 85, poeticness: 35, formality: 85, accessibility: 55, scholarlyPrecision: 95 },
  },
];

// Get persona by ID
export function getPersonaById(id: string): TranslatorPersona | undefined {
  return TRANSLATOR_PERSONAS.find((p) => p.id === id);
}

// Find personas by specialty
export function getPersonasBySpecialty(author: string): TranslatorPersona[] {
  const lowerAuthor = author.toLowerCase();
  return TRANSLATOR_PERSONAS.filter((p) =>
    p.specialty.some((s) => s.toLowerCase().includes(lowerAuthor))
  );
}

// Calculate style similarity between two personas
export function calculateStyleSimilarity(p1: TranslatorPersona, p2: TranslatorPersona): number {
  const keys = Object.keys(p1.style) as (keyof typeof p1.style)[];
  const differences = keys.map((key) => Math.abs(p1.style[key] - p2.style[key]));
  const avgDiff = differences.reduce((a, b) => a + b, 0) / differences.length;
  return 100 - avgDiff;
}

// Blend styles (for custom combinations)
export function blendStyles(
  personas: { persona: TranslatorPersona; weight: number }[]
): TranslatorPersona['style'] {
  const totalWeight = personas.reduce((sum, p) => sum + p.weight, 0);
  const keys: (keyof TranslatorPersona['style'])[] = [
    'literalness',
    'poeticness',
    'formality',
    'accessibility',
    'scholarlyPrecision',
  ];

  const blended: TranslatorPersona['style'] = {
    literalness: 0,
    poeticness: 0,
    formality: 0,
    accessibility: 0,
    scholarlyPrecision: 0,
  };

  for (const key of keys) {
    blended[key] = personas.reduce(
      (sum, p) => sum + (p.persona.style[key] * p.weight) / totalWeight,
      0
    );
  }

  return blended;
}
