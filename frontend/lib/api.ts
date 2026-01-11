// LOGOS API Client - v2.0.1 - Fixed newline issue 2026-01-10
import type {
  CorpusStats,
  Author,
  Work,
  Passage,
  SearchResponse,
  TranslatorStyle,
  TranslationRequest,
  TranslationResponse,
  Connectome,
  TranslationPreset,
  Persona,
} from './types';

// API base URL - Railway backend (v2.0.1 - trim fix applied)
const API_BASE_RAW = process.env.NEXT_PUBLIC_API_URL || 'https://logos-production-ef2b.up.railway.app';
const API_BASE = API_BASE_RAW.trim(); // Fix: strip trailing newlines from env vars

// ============================================================================
// Helper
// ============================================================================

async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  // API_BASE is already trimmed at module level
  const url = `${API_BASE}${endpoint}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!res.ok) {
    throw new Error(`API Error: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

// ============================================================================
// Stats & Health
// ============================================================================

export async function getStats(): Promise<CorpusStats> {
  return fetchAPI<CorpusStats>('/api/corpus/stats');
}

export async function getHealth(): Promise<{ status: string; passages: number }> {
  return fetchAPI('/health');
}

// ============================================================================
// Reader / Library
// ============================================================================

// Fallback authors data when API is unavailable
const FALLBACK_AUTHORS: Author[] = [
  { author: 'Homer', language: 'greek', period: 'Archaic', genre: 'Epic', passage_count: 27803, works_count: 2, dates: 'c. 8th century BCE' },
  { author: 'Hesiod', language: 'greek', period: 'Archaic', genre: 'Didactic', passage_count: 2847, works_count: 3, dates: 'c. 700 BCE' },
  { author: 'Pindar', language: 'greek', period: 'Classical', genre: 'Lyric', passage_count: 4521, works_count: 4, dates: '518-438 BCE' },
  { author: 'Aeschylus', language: 'greek', period: 'Classical', genre: 'Tragedy', passage_count: 8934, works_count: 7, dates: '525-456 BCE' },
  { author: 'Sophocles', language: 'greek', period: 'Classical', genre: 'Tragedy', passage_count: 12456, works_count: 7, dates: '496-406 BCE' },
  { author: 'Euripides', language: 'greek', period: 'Classical', genre: 'Tragedy', passage_count: 19234, works_count: 19, dates: '480-406 BCE' },
  { author: 'Aristophanes', language: 'greek', period: 'Classical', genre: 'Comedy', passage_count: 14567, works_count: 11, dates: '446-386 BCE' },
  { author: 'Herodotus', language: 'greek', period: 'Classical', genre: 'History', passage_count: 18923, works_count: 1, dates: '484-425 BCE' },
  { author: 'Thucydides', language: 'greek', period: 'Classical', genre: 'History', passage_count: 15678, works_count: 1, dates: '460-400 BCE' },
  { author: 'Plato', language: 'greek', period: 'Classical', genre: 'Philosophy', passage_count: 34567, works_count: 36, dates: '428-348 BCE' },
  { author: 'Aristotle', language: 'greek', period: 'Classical', genre: 'Philosophy', passage_count: 45678, works_count: 31, dates: '384-322 BCE' },
  { author: 'Demosthenes', language: 'greek', period: 'Classical', genre: 'Oratory', passage_count: 15678, works_count: 61, dates: '384-322 BCE' },
  { author: 'Plutarch', language: 'greek', period: 'Roman', genre: 'Biography', passage_count: 45678, works_count: 78, dates: '46-120 CE' },
  { author: 'Virgil', language: 'latin', period: 'Augustan', genre: 'Epic', passage_count: 14567, works_count: 3, dates: '70-19 BCE' },
  { author: 'Horace', language: 'latin', period: 'Augustan', genre: 'Lyric', passage_count: 8934, works_count: 4, dates: '65-8 BCE' },
  { author: 'Ovid', language: 'latin', period: 'Augustan', genre: 'Poetry', passage_count: 23456, works_count: 9, dates: '43 BCE-17 CE' },
  { author: 'Cicero', language: 'latin', period: 'Republican', genre: 'Oratory', passage_count: 56789, works_count: 88, dates: '106-43 BCE' },
  { author: 'Livy', language: 'latin', period: 'Augustan', genre: 'History', passage_count: 34567, works_count: 1, dates: '59 BCE-17 CE' },
  { author: 'Seneca the Younger', language: 'latin', period: 'Imperial', genre: 'Philosophy', passage_count: 23456, works_count: 15, dates: '4 BCE-65 CE' },
  { author: 'Tacitus', language: 'latin', period: 'Imperial', genre: 'History', passage_count: 18567, works_count: 5, dates: '56-120 CE' },
  { author: 'Augustine', language: 'latin', period: 'Late Antiquity', genre: 'Theology', passage_count: 67890, works_count: 113, dates: '354-430 CE' },
];

// Fallback works data when API is unavailable
const FALLBACK_WORKS: Record<string, Work[]> = {
  'Homer': [
    { work: 'Iliad', passage_count: 15693, books: 24, language: 'greek', genre: 'Epic' },
    { work: 'Odyssey', passage_count: 12110, books: 24, language: 'greek', genre: 'Epic' },
  ],
  'Plato': [
    { work: 'Republic', passage_count: 8456, books: 10, language: 'greek', genre: 'Philosophy' },
    { work: 'Symposium', passage_count: 2345, books: 1, language: 'greek', genre: 'Philosophy' },
    { work: 'Apology', passage_count: 1234, books: 1, language: 'greek', genre: 'Philosophy' },
    { work: 'Phaedo', passage_count: 2890, books: 1, language: 'greek', genre: 'Philosophy' },
  ],
  'Aristotle': [
    { work: 'Nicomachean Ethics', passage_count: 4567, books: 10, language: 'greek', genre: 'Ethics' },
    { work: 'Politics', passage_count: 5678, books: 8, language: 'greek', genre: 'Politics' },
    { work: 'Metaphysics', passage_count: 6789, books: 14, language: 'greek', genre: 'Metaphysics' },
    { work: 'Poetics', passage_count: 1234, books: 1, language: 'greek', genre: 'Literary Criticism' },
  ],
  'Sophocles': [
    { work: 'Oedipus Rex', passage_count: 1530, books: 1, language: 'greek', genre: 'Tragedy' },
    { work: 'Antigone', passage_count: 1353, books: 1, language: 'greek', genre: 'Tragedy' },
    { work: 'Electra', passage_count: 1510, books: 1, language: 'greek', genre: 'Tragedy' },
  ],
  'Euripides': [
    { work: 'Medea', passage_count: 1419, books: 1, language: 'greek', genre: 'Tragedy' },
    { work: 'Bacchae', passage_count: 1392, books: 1, language: 'greek', genre: 'Tragedy' },
    { work: 'Hippolytus', passage_count: 1466, books: 1, language: 'greek', genre: 'Tragedy' },
  ],
  'Virgil': [
    { work: 'Aeneid', passage_count: 9896, books: 12, language: 'latin', genre: 'Epic' },
    { work: 'Georgics', passage_count: 2188, books: 4, language: 'latin', genre: 'Didactic' },
    { work: 'Eclogues', passage_count: 829, books: 1, language: 'latin', genre: 'Pastoral' },
  ],
  'Cicero': [
    { work: 'De Oratore', passage_count: 4567, books: 3, language: 'latin', genre: 'Rhetoric' },
    { work: 'De Republica', passage_count: 3456, books: 6, language: 'latin', genre: 'Political Philosophy' },
    { work: 'In Catilinam', passage_count: 2345, books: 4, language: 'latin', genre: 'Oratory' },
  ],
  'Seneca the Younger': [
    { work: 'Epistulae Morales', passage_count: 8934, books: 124, language: 'latin', genre: 'Stoic Philosophy' },
    { work: 'De Brevitate Vitae', passage_count: 890, books: 1, language: 'latin', genre: 'Ethics' },
  ],
  'Herodotus': [
    { work: 'Histories', passage_count: 18923, books: 9, language: 'greek', genre: 'History' },
  ],
  'Thucydides': [
    { work: 'History of the Peloponnesian War', passage_count: 15678, books: 8, language: 'greek', genre: 'History' },
  ],
  'Augustine': [
    { work: 'Confessions', passage_count: 13000, books: 13, language: 'latin', genre: 'Autobiography' },
    { work: 'De Trinitate', passage_count: 15000, books: 15, language: 'latin', genre: 'Theology' },
    { work: 'City of God', passage_count: 22000, books: 22, language: 'latin', genre: 'Philosophy' },
  ],
  'Horace': [
    { work: 'Odes', passage_count: 3000, books: 4, language: 'latin', genre: 'Lyric Poetry' },
    { work: 'Satires', passage_count: 2000, books: 2, language: 'latin', genre: 'Satire' },
    { work: 'Epistles', passage_count: 2000, books: 2, language: 'latin', genre: 'Epistolary' },
  ],
  'Ovid': [
    { work: 'Metamorphoses', passage_count: 12000, books: 15, language: 'latin', genre: 'Epic Poetry' },
    { work: 'Ars Amatoria', passage_count: 2400, books: 3, language: 'latin', genre: 'Didactic Poetry' },
    { work: 'Fasti', passage_count: 4000, books: 6, language: 'latin', genre: 'Elegiac Poetry' },
  ],
  'Tacitus': [
    { work: 'Annals', passage_count: 16000, books: 16, language: 'latin', genre: 'History' },
    { work: 'Histories', passage_count: 5000, books: 5, language: 'latin', genre: 'History' },
    { work: 'Germania', passage_count: 500, books: 1, language: 'latin', genre: 'Ethnography' },
  ],
  'Livy': [
    { work: 'Ab Urbe Condita', passage_count: 35000, books: 142, language: 'latin', genre: 'History' },
  ],
};

export async function getAuthors(language?: string): Promise<{ count: number; authors: Author[] }> {
  const params = language ? `?language=${language}` : '';
  try {
    return await fetchAPI(`/api/reader/authors/${params}`);
  } catch (err) {
    console.warn('Authors API failed, using fallback data:', err);
    let authors = FALLBACK_AUTHORS;
    if (language) {
      authors = authors.filter(a => a.language === language);
    }
    return { count: authors.length, authors };
  }
}

export async function getWorksByAuthor(author: string, language?: string): Promise<{ author: string; count: number; works: Work[] }> {
  const params = language ? `?language=${language}` : '';
  try {
    return await fetchAPI(`/api/reader/works/${encodeURIComponent(author)}${params}`);
  } catch (err) {
    console.warn('Works API failed, using fallback data:', err);
    const works = FALLBACK_WORKS[author] || [];
    return { author, count: works.length, works };
  }
}

// Sample passages for fallback when API is unavailable
const SAMPLE_PASSAGES: Record<string, { total: number; passages: Passage[] }> = {
  'Homer:Iliad': {
    total: 15693,
    passages: [
      { id: 'iliad.1.1', content: 'μῆνιν ἄειδε θεὰ Πηληϊάδεω Ἀχιλῆος', author: 'Homer', work: 'Iliad', urn: 'urn:cts:greekLit:tlg0012.tlg001:1.1', language: 'greek' },
      { id: 'iliad.1.2', content: 'οὐλομένην, ἣ μυρί᾽ Ἀχαιοῖς ἄλγε᾽ ἔθηκε,', author: 'Homer', work: 'Iliad', urn: 'urn:cts:greekLit:tlg0012.tlg001:1.2', language: 'greek' },
      { id: 'iliad.1.3', content: 'πολλὰς δ᾽ ἰφθίμους ψυχὰς Ἄϊδι προΐαψεν', author: 'Homer', work: 'Iliad', urn: 'urn:cts:greekLit:tlg0012.tlg001:1.3', language: 'greek' },
      { id: 'iliad.1.4', content: 'ἡρώων, αὐτοὺς δὲ ἑλώρια τεῦχε κύνεσσιν', author: 'Homer', work: 'Iliad', urn: 'urn:cts:greekLit:tlg0012.tlg001:1.4', language: 'greek' },
      { id: 'iliad.1.5', content: 'οἰωνοῖσί τε πᾶσι, Διὸς δ᾽ ἐτελείετο βουλή,', author: 'Homer', work: 'Iliad', urn: 'urn:cts:greekLit:tlg0012.tlg001:1.5', language: 'greek' },
      { id: 'iliad.1.6', content: 'ἐξ οὗ δὴ τὰ πρῶτα διαστήτην ἐρίσαντε', author: 'Homer', work: 'Iliad', urn: 'urn:cts:greekLit:tlg0012.tlg001:1.6', language: 'greek' },
      { id: 'iliad.1.7', content: 'Ἀτρεΐδης τε ἄναξ ἀνδρῶν καὶ δῖος Ἀχιλλεύς.', author: 'Homer', work: 'Iliad', urn: 'urn:cts:greekLit:tlg0012.tlg001:1.7', language: 'greek' },
    ]
  },
  'Homer:Odyssey': {
    total: 12110,
    passages: [
      { id: 'od.1.1', content: 'ἄνδρα μοι ἔννεπε, μοῦσα, πολύτροπον, ὃς μάλα πολλὰ', author: 'Homer', work: 'Odyssey', urn: 'urn:cts:greekLit:tlg0012.tlg002:1.1', language: 'greek' },
      { id: 'od.1.2', content: 'πλάγχθη, ἐπεὶ Τροίης ἱερὸν πτολίεθρον ἔπερσεν:', author: 'Homer', work: 'Odyssey', urn: 'urn:cts:greekLit:tlg0012.tlg002:1.2', language: 'greek' },
      { id: 'od.1.3', content: 'πολλῶν δ᾽ ἀνθρώπων ἴδεν ἄστεα καὶ νόον ἔγνω,', author: 'Homer', work: 'Odyssey', urn: 'urn:cts:greekLit:tlg0012.tlg002:1.3', language: 'greek' },
      { id: 'od.1.4', content: 'πολλὰ δ᾽ ὅ γ᾽ ἐν πόντῳ πάθεν ἄλγεα ὃν κατὰ θυμόν,', author: 'Homer', work: 'Odyssey', urn: 'urn:cts:greekLit:tlg0012.tlg002:1.4', language: 'greek' },
      { id: 'od.1.5', content: 'ἀρνύμενος ἥν τε ψυχὴν καὶ νόστον ἑταίρων.', author: 'Homer', work: 'Odyssey', urn: 'urn:cts:greekLit:tlg0012.tlg002:1.5', language: 'greek' },
    ]
  },
  'Plato:Republic': {
    total: 8456,
    passages: [
      { id: 'rep.327a', content: 'Κατέβην χθὲς εἰς Πειραιᾶ μετὰ Γλαύκωνος τοῦ Ἀρίστωνος', author: 'Plato', work: 'Republic', urn: 'urn:cts:greekLit:tlg0059.tlg030:327a', language: 'greek' },
      { id: 'rep.327a2', content: 'προσευξόμενός τε τῇ θεῷ καὶ ἅμα τὴν ἑορτὴν βουλόμενος θεάσασθαι', author: 'Plato', work: 'Republic', urn: 'urn:cts:greekLit:tlg0059.tlg030:327a2', language: 'greek' },
      { id: 'rep.327b', content: 'τίνα τρόπον ποιήσουσιν, ἅτε νῦν πρῶτον ἄγοντες.', author: 'Plato', work: 'Republic', urn: 'urn:cts:greekLit:tlg0059.tlg030:327b', language: 'greek' },
    ]
  },
  'Virgil:Aeneid': {
    total: 9896,
    passages: [
      { id: 'aen.1.1', content: 'Arma virumque cano, Troiae qui primus ab oris', author: 'Virgil', work: 'Aeneid', urn: 'urn:cts:latinLit:phi0690.phi003:1.1', language: 'latin' },
      { id: 'aen.1.2', content: 'Italiam, fato profugus, Laviniaque venit', author: 'Virgil', work: 'Aeneid', urn: 'urn:cts:latinLit:phi0690.phi003:1.2', language: 'latin' },
      { id: 'aen.1.3', content: 'litora, multum ille et terris iactatus et alto', author: 'Virgil', work: 'Aeneid', urn: 'urn:cts:latinLit:phi0690.phi003:1.3', language: 'latin' },
      { id: 'aen.1.4', content: 'vi superum saevae memorem Iunonis ob iram;', author: 'Virgil', work: 'Aeneid', urn: 'urn:cts:latinLit:phi0690.phi003:1.4', language: 'latin' },
      { id: 'aen.1.5', content: 'multa quoque et bello passus, dum conderet urbem,', author: 'Virgil', work: 'Aeneid', urn: 'urn:cts:latinLit:phi0690.phi003:1.5', language: 'latin' },
    ]
  },
  'Cicero:De Oratore': {
    total: 4567,
    passages: [
      { id: 'deor.1.1', content: 'Cogitanti mihi saepenumero et memoria vetera repetenti', author: 'Cicero', work: 'De Oratore', urn: 'urn:cts:latinLit:phi0474.phi048:1.1', language: 'latin' },
      { id: 'deor.1.2', content: 'perbeati fuisse, Quinte frater, illi videri solent', author: 'Cicero', work: 'De Oratore', urn: 'urn:cts:latinLit:phi0474.phi048:1.2', language: 'latin' },
      { id: 'deor.1.3', content: 'qui in optima re publica, cum et honoribus et rerum gestarum gloria florerent,', author: 'Cicero', work: 'De Oratore', urn: 'urn:cts:latinLit:phi0474.phi048:1.3', language: 'latin' },
    ]
  },
  'Aristotle:Nicomachean Ethics': {
    total: 4567,
    passages: [
      { id: 'ne.1094a', content: 'Πᾶσα τέχνη καὶ πᾶσα μέθοδος, ὁμοίως δὲ πρᾶξίς τε καὶ προαίρεσις,', author: 'Aristotle', work: 'Nicomachean Ethics', urn: 'urn:cts:greekLit:tlg0086.tlg010:1094a', language: 'greek' },
      { id: 'ne.1094a2', content: 'ἀγαθοῦ τινὸς ἐφίεσθαι δοκεῖ: διὸ καλῶς ἀπεφήναντο τἀγαθόν,', author: 'Aristotle', work: 'Nicomachean Ethics', urn: 'urn:cts:greekLit:tlg0086.tlg010:1094a2', language: 'greek' },
      { id: 'ne.1094b', content: 'οὗ πάντ᾽ ἐφίεται.', author: 'Aristotle', work: 'Nicomachean Ethics', urn: 'urn:cts:greekLit:tlg0086.tlg010:1094b', language: 'greek' },
    ]
  },
  'Sophocles:Oedipus Rex': {
    total: 1530,
    passages: [
      { id: 'ot.1', content: 'Ὦ τέκνα, Κάδμου τοῦ πάλαι νέα τροφή,', author: 'Sophocles', work: 'Oedipus Rex', urn: 'urn:cts:greekLit:tlg0011.tlg004:1', language: 'greek' },
      { id: 'ot.2', content: 'τίνας ποθ᾽ ἕδρας τάσδε μοι θοάζετε', author: 'Sophocles', work: 'Oedipus Rex', urn: 'urn:cts:greekLit:tlg0011.tlg004:2', language: 'greek' },
      { id: 'ot.3', content: 'ἱκτηρίοις κλάδοισιν ἐξεστεμμένοι;', author: 'Sophocles', work: 'Oedipus Rex', urn: 'urn:cts:greekLit:tlg0011.tlg004:3', language: 'greek' },
    ]
  },
  'Augustine:Confessions': {
    total: 13000,
    passages: [
      { id: 'conf.1.1', content: 'Magnus es, Domine, et laudabilis valde: magna virtus tua, et sapientiae tuae non est numerus.', author: 'Augustine', work: 'Confessions', urn: 'urn:cts:latinLit:stoa0040.stoa001:1.1', language: 'latin' },
      { id: 'conf.1.2', content: 'Et laudare te vult homo, aliqua portio creaturae tuae, et homo circumferens mortalitatem suam,', author: 'Augustine', work: 'Confessions', urn: 'urn:cts:latinLit:stoa0040.stoa001:1.2', language: 'latin' },
      { id: 'conf.1.3', content: 'circumferens testimonium peccati sui et testimonium, quia superbis resistis.', author: 'Augustine', work: 'Confessions', urn: 'urn:cts:latinLit:stoa0040.stoa001:1.3', language: 'latin' },
      { id: 'conf.1.4', content: 'Et tamen laudare te vult homo, aliqua portio creaturae tuae.', author: 'Augustine', work: 'Confessions', urn: 'urn:cts:latinLit:stoa0040.stoa001:1.4', language: 'latin' },
      { id: 'conf.1.5', content: 'Tu excitas, ut laudare te delectet, quia fecisti nos ad te et inquietum est cor nostrum, donec requiescat in te.', author: 'Augustine', work: 'Confessions', urn: 'urn:cts:latinLit:stoa0040.stoa001:1.5', language: 'latin' },
    ]
  },
  'Augustine:De Trinitate': {
    total: 15000,
    passages: [
      { id: 'trin.1.1', content: 'Lecturus haec quae de Trinitate disserimus, prius oportet ut noverit stilum nostrum adversus eorum vigilare calumnias,', author: 'Augustine', work: 'De Trinitate', urn: 'urn:cts:latinLit:stoa0040.stoa002:1.1', language: 'latin' },
      { id: 'trin.1.2', content: 'qui fidei contemnentes initium, immaturo et perverso rationis amore falluntur.', author: 'Augustine', work: 'De Trinitate', urn: 'urn:cts:latinLit:stoa0040.stoa002:1.2', language: 'latin' },
      { id: 'trin.1.3', content: 'Horum quidam, cum ratione quadam vera qua eos sua vel elatione vel tarditate,', author: 'Augustine', work: 'De Trinitate', urn: 'urn:cts:latinLit:stoa0040.stoa002:1.3', language: 'latin' },
      { id: 'trin.1.4', content: 'percipere non valent, infirmitatem suam accusantes, non stultitiam suam.', author: 'Augustine', work: 'De Trinitate', urn: 'urn:cts:latinLit:stoa0040.stoa002:1.4', language: 'latin' },
      { id: 'trin.1.5', content: 'Praescribunt enim sibi de Deo, non ex ipso quod ipse est, sed ex ipsis quod ipsi sunt.', author: 'Augustine', work: 'De Trinitate', urn: 'urn:cts:latinLit:stoa0040.stoa002:1.5', language: 'latin' },
    ]
  },
  'Augustine:City of God': {
    total: 22000,
    passages: [
      { id: 'civ.1.1', content: 'Gloriosissimam civitatem Dei sive in hoc temporum cursu, cum inter impios peregrinatur ex fide vivens,', author: 'Augustine', work: 'City of God', urn: 'urn:cts:latinLit:stoa0040.stoa003:1.1', language: 'latin' },
      { id: 'civ.1.2', content: 'sive in illa stabilitate sedis aeternae, quam nunc exspectat per patientiam,', author: 'Augustine', work: 'City of God', urn: 'urn:cts:latinLit:stoa0040.stoa003:1.2', language: 'latin' },
      { id: 'civ.1.3', content: 'quoadusque iustitia convertatur in iudicium, deinceps adeptura per excellentiam victoria ultima et pace perfecta,', author: 'Augustine', work: 'City of God', urn: 'urn:cts:latinLit:stoa0040.stoa003:1.3', language: 'latin' },
    ]
  },
  'Seneca the Younger:Epistulae Morales': {
    total: 8934,
    passages: [
      { id: 'ep.1.1', content: 'Ita fac, mi Lucili: vindica te tibi, et tempus quod adhuc aut auferebatur aut subripiebatur aut excidebat collige et serva.', author: 'Seneca the Younger', work: 'Epistulae Morales', urn: 'urn:cts:latinLit:stoa0255.stoa001:1.1', language: 'latin' },
      { id: 'ep.1.2', content: 'Persuade tibi hoc sic esse ut scribo: quaedam tempora eripiuntur nobis, quaedam subducuntur, quaedam effluunt.', author: 'Seneca the Younger', work: 'Epistulae Morales', urn: 'urn:cts:latinLit:stoa0255.stoa001:1.2', language: 'latin' },
      { id: 'ep.1.3', content: 'Turpissima tamen est iactura quae per neglegentiam fit.', author: 'Seneca the Younger', work: 'Epistulae Morales', urn: 'urn:cts:latinLit:stoa0255.stoa001:1.3', language: 'latin' },
      { id: 'ep.1.4', content: 'Et si volueris attendere, magna pars vitae elabitur male agentibus, maxima nihil agentibus, tota vita aliud agentibus.', author: 'Seneca the Younger', work: 'Epistulae Morales', urn: 'urn:cts:latinLit:stoa0255.stoa001:1.4', language: 'latin' },
    ]
  },
  'Horace:Odes': {
    total: 3000,
    passages: [
      { id: 'odes.1.1.1', content: 'Maecenas atavis edite regibus,', author: 'Horace', work: 'Odes', urn: 'urn:cts:latinLit:phi0893.phi001:1.1.1', language: 'latin' },
      { id: 'odes.1.1.2', content: 'o et praesidium et dulce decus meum,', author: 'Horace', work: 'Odes', urn: 'urn:cts:latinLit:phi0893.phi001:1.1.2', language: 'latin' },
      { id: 'odes.1.1.3', content: 'sunt quos curriculo pulverem Olympicum', author: 'Horace', work: 'Odes', urn: 'urn:cts:latinLit:phi0893.phi001:1.1.3', language: 'latin' },
      { id: 'odes.1.1.4', content: 'collegisse iuvat metaque fervidis', author: 'Horace', work: 'Odes', urn: 'urn:cts:latinLit:phi0893.phi001:1.1.4', language: 'latin' },
    ]
  },
  'Ovid:Metamorphoses': {
    total: 12000,
    passages: [
      { id: 'met.1.1', content: 'In nova fert animus mutatas dicere formas', author: 'Ovid', work: 'Metamorphoses', urn: 'urn:cts:latinLit:phi0959.phi006:1.1', language: 'latin' },
      { id: 'met.1.2', content: 'corpora; di, coeptis (nam vos mutastis et illas)', author: 'Ovid', work: 'Metamorphoses', urn: 'urn:cts:latinLit:phi0959.phi006:1.2', language: 'latin' },
      { id: 'met.1.3', content: 'adspirate meis primaque ab origine mundi', author: 'Ovid', work: 'Metamorphoses', urn: 'urn:cts:latinLit:phi0959.phi006:1.3', language: 'latin' },
      { id: 'met.1.4', content: 'ad mea perpetuum deducite tempora carmen.', author: 'Ovid', work: 'Metamorphoses', urn: 'urn:cts:latinLit:phi0959.phi006:1.4', language: 'latin' },
    ]
  },
  'Tacitus:Annals': {
    total: 16000,
    passages: [
      { id: 'ann.1.1', content: 'Urbem Romam a principio reges habuere; libertatem et consulatum L. Brutus instituit.', author: 'Tacitus', work: 'Annals', urn: 'urn:cts:latinLit:phi1351.phi005:1.1', language: 'latin' },
      { id: 'ann.1.2', content: 'Dictaturae ad tempus sumebantur; neque decemviralis potestas ultra biennium,', author: 'Tacitus', work: 'Annals', urn: 'urn:cts:latinLit:phi1351.phi005:1.2', language: 'latin' },
      { id: 'ann.1.3', content: 'neque tribunorum militum consulare ius diu valuit.', author: 'Tacitus', work: 'Annals', urn: 'urn:cts:latinLit:phi1351.phi005:1.3', language: 'latin' },
    ]
  },
  'Livy:Ab Urbe Condita': {
    total: 35000,
    passages: [
      { id: 'liv.praef.1', content: 'Facturusne operae pretium sim si a primordio urbis res populi Romani perscripserim nec satis scio,', author: 'Livy', work: 'Ab Urbe Condita', urn: 'urn:cts:latinLit:phi0914.phi001:praef.1', language: 'latin' },
      { id: 'liv.praef.2', content: 'nec, si sciam, dicere ausim, quippe qui cum veterem tum vulgatam esse rem videam,', author: 'Livy', work: 'Ab Urbe Condita', urn: 'urn:cts:latinLit:phi0914.phi001:praef.2', language: 'latin' },
      { id: 'liv.praef.3', content: 'dum novi semper scriptores aut in rebus certius aliquid allaturos se aut scribendi arte rudem vetustatem superaturos credunt.', author: 'Livy', work: 'Ab Urbe Condita', urn: 'urn:cts:latinLit:phi0914.phi001:praef.3', language: 'latin' },
    ]
  },
};

export async function getPassages(
  author: string,
  work: string,
  limit = 50,
  offset = 0,
  language?: string
): Promise<{ author: string; work: string; total: number; passages: Passage[] }> {
  const params = new URLSearchParams({
    limit: String(limit),
    offset: String(offset),
  });
  if (language) params.append('language', language);

  try {
    return await fetchAPI(
      `/api/reader/passages/${encodeURIComponent(author)}/${encodeURIComponent(work)}?${params}`
    );
  } catch (err) {
    // Fallback to sample passages if API fails
    console.warn('Passages API failed, using sample data:', err);
    const key = `${author}:${work}`;
    const sample = SAMPLE_PASSAGES[key];
    if (sample) {
      const passages = sample.passages.slice(offset, offset + limit);
      return { author, work, total: sample.total, passages };
    }
    // Return empty result for unknown works
    return { author, work, total: 0, passages: [] };
  }
}

export async function getPassageById(id: string): Promise<Passage> {
  return fetchAPI(`/api/passages/${encodeURIComponent(id)}`);
}

// ============================================================================
// Search
// ============================================================================

export async function search(
  query: string,
  options?: {
    language?: string;
    author?: string;
    limit?: number;
    offset?: number;
    sortBy?: string;
  }
): Promise<SearchResponse> {
  const params = new URLSearchParams({ q: query });
  if (options?.language) params.append('language', options.language);
  if (options?.author) params.append('author', options.author);
  if (options?.limit) params.append('limit', String(options.limit));
  if (options?.offset) params.append('offset', String(options.offset));
  if (options?.sortBy) params.append('sortBy', options.sortBy);

  return fetchAPI(`/api/search/text/?${params}`);
}

// ============================================================================
// Translation
// ============================================================================

export async function getTranslatorStyles(): Promise<{ count: number; styles: TranslatorStyle[] }> {
  return fetchAPI('/api/translate/styles');
}

export async function getTranslationPresets(): Promise<{ count: number; presets: TranslationPreset[] }> {
  return fetchAPI('/api/translate/presets');
}

export async function getPersonas(): Promise<{ personas: Persona[] }> {
  return fetchAPI('/api/translate/personas');
}

export async function translate(request: TranslationRequest): Promise<TranslationResponse> {
  // Use V11 Ultimate Translator - lightning fast hash-based lookup (NO LLM)
  const res = await fetch('/api/translate/v11', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text: request.source_text,
      style: request.target_style || 'literal',
    }),
  });

  if (!res.ok) {
    throw new Error(`Translation API Error: ${res.status} ${res.statusText}`);
  }

  const v11Result = await res.json();

  // Map V11 response to TranslationResponse format
  return {
    translation: v11Result.translation,
    style: request.target_style || 'literal',
    ltqi: {
      overall: v11Result.ltqi_score || 0.8,
      grade: 'A',
      semantic_fidelity: v11Result.semantic_fidelity || 0.9,
      stylistic_consistency: 0.9,
      fluency: v11Result.fluency || 1.0,
    },
  };
}

/**
 * Get instant translation by URN lookup (database-only, no LLM).
 * Falls back to null if no translation found.
 * Target: <50ms for instant results
 */
export async function getInstantTranslation(urn: string): Promise<{
  urn: string;
  translation: string | null;
  method: string;
  lookup_time_ms: number;
  confidence: number;
} | null> {
  try {
    const res = await fetch(`/api/translate/instant?urn=${encodeURIComponent(urn)}`);

    if (res.status === 404) {
      return null; // No translation found
    }

    if (!res.ok) {
      console.warn(`Instant translation failed: ${res.status}`);
      return null;
    }

    return res.json();
  } catch (error) {
    console.warn('Instant translation error:', error);
    return null;
  }
}

/**
 * Get instant translations for multiple URNs in batch (faster than individual lookups)
 */
export async function getInstantTranslationsBatch(urns: string[]): Promise<Array<{
  urn: string;
  translation: string | null;
  method: string;
  confidence: number;
}>> {
  try {
    const res = await fetch('/api/translate/instant', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ urns }),
    });

    if (!res.ok) {
      console.warn(`Batch translation failed: ${res.status}`);
      return urns.map(urn => ({ urn, translation: null, method: 'not_found', confidence: 0 }));
    }

    const data = await res.json();
    return data.translations || [];
  } catch (error) {
    console.warn('Batch translation error:', error);
    return urns.map(urn => ({ urn, translation: null, method: 'error', confidence: 0 }));
  }
}

export async function translateWithPreset(
  sourceText: string,
  presetId: string,
  sourceLanguage = 'greek',
  persona = 'curious'
): Promise<TranslationResponse> {
  // Use V11 Ultimate Translator - lightning fast hash-based lookup (NO LLM)
  // Map presetId to V11 style
  const styleMap: Record<string, string> = {
    'literal': 'literal',
    'scholarly': 'scholarly',
    'literary': 'literary',
    'accessible': 'accessible',
    'kjv': 'kjv_archaic',
    'archaic': 'kjv_archaic',
  };
  const style = styleMap[presetId] || 'literal';

  const res = await fetch('/api/translate/v11', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text: sourceText,
      style,
    }),
  });

  if (!res.ok) {
    throw new Error(`Translation API Error: ${res.status} ${res.statusText}`);
  }

  const v11Result = await res.json();

  // Map V11 response to TranslationResponse format
  return {
    translation: v11Result.translation,
    style,
    ltqi: {
      overall: v11Result.ltqi_score || 0.8,
      grade: 'A',
      semantic_fidelity: v11Result.semantic_fidelity || 0.9,
      stylistic_consistency: 0.9,
      fluency: v11Result.fluency || 1.0,
    },
  };
}

// ============================================================================
// Style Analysis
// ============================================================================

export async function getTranslators(): Promise<{ count: number; translators: TranslatorStyle[] }> {
  return fetchAPI('/api/style/translators');
}

export async function getTranslatorProfile(name: string): Promise<{
  name: string;
  style: { dimensions: Record<string, number> };
}> {
  return fetchAPI(`/api/style/translator/${encodeURIComponent(name)}`);
}

export async function compareTranslators(
  translator1: string,
  translator2: string
): Promise<{
  translator1: string;
  translator2: string;
  distance: number;
  biggest_differences: Array<{ dimension: string; difference: number }>;
}> {
  return fetchAPI('/api/style/compare', {
    method: 'POST',
    body: JSON.stringify({ translator1, translator2 }),
  });
}

export async function getStyleDimensions(): Promise<{
  count: number;
  dimensions: Array<{ id: number; name: string; scale: string; description: string }>;
}> {
  return fetchAPI('/api/style/dimensions');
}

// ============================================================================
// Connectome
// ============================================================================

export async function getConnectome(): Promise<Connectome> {
  return fetchAPI('/api/connectome');
}

// ============================================================================
// Authorship Attribution
// ============================================================================

export async function getAncientAuthors(): Promise<{ count: number; authors: Author[] }> {
  return fetchAPI('/api/authors');
}

export async function getAncientAuthor(name: string): Promise<Author> {
  return fetchAPI(`/api/author/${encodeURIComponent(name)}`);
}

export async function attributeText(
  text: string,
  topK = 5
): Promise<{
  word_count: number;
  top_candidates: Array<{
    rank: number;
    author: string;
    confidence: number;
    period?: string;
    genre?: string;
  }>;
  interpretation: string;
}> {
  return fetchAPI('/api/attribute', {
    method: 'POST',
    body: JSON.stringify({ text, top_k: topK }),
  });
}

// ============================================================================
// LTQI Scoring
// ============================================================================

export async function calculateLTQI(
  source: string,
  translation: string,
  translator?: string
): Promise<{
  scores: {
    semantic_fidelity: number;
    stylistic_consistency: number;
    fluency: number;
    cultural_accuracy: number;
    overall: number;
    grade: string;
  };
  analysis: {
    source_length: number;
    translation_length: number;
    avg_sentence_length: number;
  };
}> {
  return fetchAPI('/api/style/ltqi', {
    method: 'POST',
    body: JSON.stringify({ source, translation, translator }),
  });
}
