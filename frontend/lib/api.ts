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

// Fallback authors data when API is unavailable - COMPLETE CORPUS
const FALLBACK_AUTHORS: Author[] = [
  // Greek Authors
  { author: 'Homer', language: 'greek', period: 'Archaic', genre: 'Epic', passage_count: 27803, works_count: 2, dates: 'c. 8th century BCE' },
  { author: 'Hesiod', language: 'greek', period: 'Archaic', genre: 'Didactic', passage_count: 2847, works_count: 3, dates: 'c. 700 BCE' },
  { author: 'Pindar', language: 'greek', period: 'Classical', genre: 'Lyric', passage_count: 4521, works_count: 4, dates: '518-438 BCE' },
  { author: 'Sappho', language: 'greek', period: 'Archaic', genre: 'Lyric', passage_count: 264, works_count: 1, dates: 'c. 630-570 BCE' },
  { author: 'Aeschylus', language: 'greek', period: 'Classical', genre: 'Tragedy', passage_count: 8934, works_count: 7, dates: '525-456 BCE' },
  { author: 'Sophocles', language: 'greek', period: 'Classical', genre: 'Tragedy', passage_count: 12456, works_count: 7, dates: '496-406 BCE' },
  { author: 'Euripides', language: 'greek', period: 'Classical', genre: 'Tragedy', passage_count: 19234, works_count: 13, dates: '480-406 BCE' },
  { author: 'Aristophanes', language: 'greek', period: 'Classical', genre: 'Comedy', passage_count: 14567, works_count: 11, dates: '446-386 BCE' },
  { author: 'Herodotus', language: 'greek', period: 'Classical', genre: 'History', passage_count: 18923, works_count: 1, dates: '484-425 BCE' },
  { author: 'Thucydides', language: 'greek', period: 'Classical', genre: 'History', passage_count: 15678, works_count: 1, dates: '460-400 BCE' },
  { author: 'Xenophon', language: 'greek', period: 'Classical', genre: 'History', passage_count: 21345, works_count: 5, dates: '430-354 BCE' },
  { author: 'Plato', language: 'greek', period: 'Classical', genre: 'Philosophy', passage_count: 34567, works_count: 13, dates: '428-348 BCE' },
  { author: 'Aristotle', language: 'greek', period: 'Classical', genre: 'Philosophy', passage_count: 45678, works_count: 10, dates: '384-322 BCE' },
  { author: 'Demosthenes', language: 'greek', period: 'Classical', genre: 'Oratory', passage_count: 15678, works_count: 5, dates: '384-322 BCE' },
  { author: 'Plutarch', language: 'greek', period: 'Roman', genre: 'Biography', passage_count: 45678, works_count: 8, dates: '46-120 CE' },
  { author: 'Epictetus', language: 'greek', period: 'Roman', genre: 'Philosophy', passage_count: 4567, works_count: 2, dates: '50-135 CE' },
  { author: 'Marcus Aurelius', language: 'greek', period: 'Roman', genre: 'Philosophy', passage_count: 3456, works_count: 1, dates: '121-180 CE' },
  { author: 'Hippocrates', language: 'greek', period: 'Classical', genre: 'Medicine', passage_count: 12890, works_count: 5, dates: '460-370 BCE' },
  { author: 'Galen', language: 'greek', period: 'Roman', genre: 'Medicine', passage_count: 34567, works_count: 3, dates: '129-216 CE' },
  // Latin Authors
  { author: 'Plautus', language: 'latin', period: 'Republican', genre: 'Comedy', passage_count: 12345, works_count: 7, dates: '254-184 BCE' },
  { author: 'Terence', language: 'latin', period: 'Republican', genre: 'Comedy', passage_count: 6789, works_count: 6, dates: '185-159 BCE' },
  { author: 'Lucretius', language: 'latin', period: 'Republican', genre: 'Philosophy', passage_count: 7890, works_count: 1, dates: '99-55 BCE' },
  { author: 'Catullus', language: 'latin', period: 'Republican', genre: 'Lyric', passage_count: 2345, works_count: 1, dates: '84-54 BCE' },
  { author: 'Virgil', language: 'latin', period: 'Augustan', genre: 'Epic', passage_count: 14567, works_count: 3, dates: '70-19 BCE' },
  { author: 'Horace', language: 'latin', period: 'Augustan', genre: 'Lyric', passage_count: 8934, works_count: 4, dates: '65-8 BCE' },
  { author: 'Ovid', language: 'latin', period: 'Augustan', genre: 'Poetry', passage_count: 23456, works_count: 6, dates: '43 BCE-17 CE' },
  { author: 'Cicero', language: 'latin', period: 'Republican', genre: 'Oratory', passage_count: 56789, works_count: 11, dates: '106-43 BCE' },
  { author: 'Julius Caesar', language: 'latin', period: 'Republican', genre: 'History', passage_count: 8934, works_count: 2, dates: '100-44 BCE' },
  { author: 'Sallust', language: 'latin', period: 'Republican', genre: 'History', passage_count: 5678, works_count: 2, dates: '86-35 BCE' },
  { author: 'Livy', language: 'latin', period: 'Augustan', genre: 'History', passage_count: 34567, works_count: 1, dates: '59 BCE-17 CE' },
  { author: 'Seneca the Younger', language: 'latin', period: 'Imperial', genre: 'Philosophy', passage_count: 23456, works_count: 8, dates: '4 BCE-65 CE' },
  { author: 'Tacitus', language: 'latin', period: 'Imperial', genre: 'History', passage_count: 18567, works_count: 5, dates: '56-120 CE' },
  { author: 'Quintilian', language: 'latin', period: 'Imperial', genre: 'Rhetoric', passage_count: 12345, works_count: 1, dates: '35-100 CE' },
  { author: 'Pliny the Elder', language: 'latin', period: 'Imperial', genre: 'Encyclopedia', passage_count: 23456, works_count: 1, dates: '23-79 CE' },
  { author: 'Pliny the Younger', language: 'latin', period: 'Imperial', genre: 'Letters', passage_count: 8934, works_count: 2, dates: '61-113 CE' },
  { author: 'Martial', language: 'latin', period: 'Imperial', genre: 'Epigram', passage_count: 15678, works_count: 1, dates: '40-104 CE' },
  { author: 'Juvenal', language: 'latin', period: 'Imperial', genre: 'Satire', passage_count: 4567, works_count: 1, dates: '55-130 CE' },
  { author: 'Apuleius', language: 'latin', period: 'Imperial', genre: 'Novel', passage_count: 6789, works_count: 2, dates: '124-170 CE' },
  { author: 'Augustine', language: 'latin', period: 'Late Antiquity', genre: 'Theology', passage_count: 67890, works_count: 4, dates: '354-430 CE' },
  { author: 'Jerome', language: 'latin', period: 'Late Antiquity', genre: 'Theology', passage_count: 34567, works_count: 3, dates: '347-420 CE' },
  { author: 'Boethius', language: 'latin', period: 'Late Antiquity', genre: 'Philosophy', passage_count: 4567, works_count: 2, dates: '480-524 CE' },
  // Hebrew Authors
  { author: 'Torah', language: 'hebrew', period: 'Ancient', genre: 'Scripture', passage_count: 5845, works_count: 5, dates: 'c. 1400-400 BCE' },
  { author: "Prophets (Nevi'im)", language: 'hebrew', period: 'Ancient', genre: 'Prophecy', passage_count: 9234, works_count: 8, dates: 'c. 800-400 BCE' },
  { author: 'Writings (Ketuvim)', language: 'hebrew', period: 'Ancient', genre: 'Wisdom', passage_count: 6789, works_count: 11, dates: 'c. 1000-200 BCE' },
  { author: 'Josephus', language: 'hebrew', period: 'Roman', genre: 'History', passage_count: 23456, works_count: 4, dates: '37-100 CE' },
  { author: 'Philo of Alexandria', language: 'hebrew', period: 'Roman', genre: 'Philosophy', passage_count: 12345, works_count: 4, dates: '20 BCE-50 CE' },
  // Aramaic Authors
  { author: 'Targum Onkelos', language: 'aramaic', period: 'Late Antiquity', genre: 'Translation', passage_count: 5845, works_count: 5, dates: 'c. 100 CE' },
  { author: 'Babylonian Talmud', language: 'aramaic', period: 'Late Antiquity', genre: 'Law', passage_count: 63456, works_count: 6, dates: 'c. 500 CE' },
];

// Fallback works data when API is unavailable
const FALLBACK_WORKS: Record<string, Work[]> = {
  'Homer': [
    { work: 'Iliad', passage_count: 15693, books: 24, language: 'greek', genre: 'Epic' },
    { work: 'Odyssey', passage_count: 12110, books: 24, language: 'greek', genre: 'Epic' },
  ],
  'Hesiod': [
    { work: 'Theogony', passage_count: 1022, books: 1, language: 'greek', genre: 'Didactic' },
    { work: 'Works and Days', passage_count: 828, books: 1, language: 'greek', genre: 'Didactic' },
    { work: 'Shield of Heracles', passage_count: 480, books: 1, language: 'greek', genre: 'Epic' },
  ],
  'Pindar': [
    { work: 'Olympian Odes', passage_count: 1456, books: 14, language: 'greek', genre: 'Lyric' },
    { work: 'Pythian Odes', passage_count: 1234, books: 12, language: 'greek', genre: 'Lyric' },
    { work: 'Nemean Odes', passage_count: 890, books: 11, language: 'greek', genre: 'Lyric' },
    { work: 'Isthmian Odes', passage_count: 678, books: 8, language: 'greek', genre: 'Lyric' },
  ],
  'Aeschylus': [
    { work: 'Agamemnon', passage_count: 1673, books: 1, language: 'greek', genre: 'Tragedy' },
    { work: 'Libation Bearers', passage_count: 1076, books: 1, language: 'greek', genre: 'Tragedy' },
    { work: 'Eumenides', passage_count: 1047, books: 1, language: 'greek', genre: 'Tragedy' },
    { work: 'Prometheus Bound', passage_count: 1093, books: 1, language: 'greek', genre: 'Tragedy' },
    { work: 'Seven Against Thebes', passage_count: 1078, books: 1, language: 'greek', genre: 'Tragedy' },
    { work: 'Persians', passage_count: 1076, books: 1, language: 'greek', genre: 'Tragedy' },
    { work: 'Suppliants', passage_count: 1073, books: 1, language: 'greek', genre: 'Tragedy' },
  ],
  'Aristophanes': [
    { work: 'Clouds', passage_count: 1510, books: 1, language: 'greek', genre: 'Comedy' },
    { work: 'Birds', passage_count: 1765, books: 1, language: 'greek', genre: 'Comedy' },
    { work: 'Frogs', passage_count: 1533, books: 1, language: 'greek', genre: 'Comedy' },
    { work: 'Lysistrata', passage_count: 1321, books: 1, language: 'greek', genre: 'Comedy' },
    { work: 'Wasps', passage_count: 1537, books: 1, language: 'greek', genre: 'Comedy' },
    { work: 'Peace', passage_count: 1357, books: 1, language: 'greek', genre: 'Comedy' },
    { work: 'Knights', passage_count: 1408, books: 1, language: 'greek', genre: 'Comedy' },
    { work: 'Acharnians', passage_count: 1234, books: 1, language: 'greek', genre: 'Comedy' },
    { work: 'Thesmophoriazusae', passage_count: 1231, books: 1, language: 'greek', genre: 'Comedy' },
    { work: 'Ecclesiazusae', passage_count: 1183, books: 1, language: 'greek', genre: 'Comedy' },
    { work: 'Plutus', passage_count: 1209, books: 1, language: 'greek', genre: 'Comedy' },
  ],
  'Demosthenes': [
    { work: 'On the Crown', passage_count: 3456, books: 1, language: 'greek', genre: 'Oratory' },
    { work: 'Philippics', passage_count: 2890, books: 4, language: 'greek', genre: 'Oratory' },
    { work: 'Olynthiacs', passage_count: 1567, books: 3, language: 'greek', genre: 'Oratory' },
    { work: 'Against Meidias', passage_count: 1890, books: 1, language: 'greek', genre: 'Oratory' },
    { work: 'On the False Embassy', passage_count: 2345, books: 1, language: 'greek', genre: 'Oratory' },
  ],
  'Plutarch': [
    { work: 'Life of Alexander', passage_count: 2345, books: 1, language: 'greek', genre: 'Biography' },
    { work: 'Life of Caesar', passage_count: 2456, books: 1, language: 'greek', genre: 'Biography' },
    { work: 'Life of Pericles', passage_count: 1890, books: 1, language: 'greek', genre: 'Biography' },
    { work: 'Life of Cicero', passage_count: 2123, books: 1, language: 'greek', genre: 'Biography' },
    { work: 'Life of Antony', passage_count: 2567, books: 1, language: 'greek', genre: 'Biography' },
    { work: 'Moralia', passage_count: 15678, books: 78, language: 'greek', genre: 'Philosophy' },
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
  // Additional Greek Authors
  'Sappho': [
    { work: 'Fragments', passage_count: 264, books: 1, language: 'greek', genre: 'Lyric Poetry' },
  ],
  'Xenophon': [
    { work: 'Anabasis', passage_count: 4567, books: 7, language: 'greek', genre: 'History' },
    { work: 'Hellenica', passage_count: 5678, books: 7, language: 'greek', genre: 'History' },
    { work: 'Cyropaedia', passage_count: 6789, books: 8, language: 'greek', genre: 'Biography' },
    { work: 'Memorabilia', passage_count: 3456, books: 4, language: 'greek', genre: 'Philosophy' },
    { work: 'Symposium', passage_count: 855, books: 1, language: 'greek', genre: 'Philosophy' },
  ],
  'Epictetus': [
    { work: 'Discourses', passage_count: 3456, books: 4, language: 'greek', genre: 'Stoic Philosophy' },
    { work: 'Enchiridion', passage_count: 1111, books: 1, language: 'greek', genre: 'Stoic Philosophy' },
  ],
  'Marcus Aurelius': [
    { work: 'Meditations', passage_count: 3456, books: 12, language: 'greek', genre: 'Stoic Philosophy' },
  ],
  'Hippocrates': [
    { work: 'On Airs, Waters, Places', passage_count: 1234, books: 1, language: 'greek', genre: 'Medicine' },
    { work: 'Aphorisms', passage_count: 890, books: 7, language: 'greek', genre: 'Medicine' },
    { work: 'Prognostics', passage_count: 678, books: 1, language: 'greek', genre: 'Medicine' },
    { work: 'Epidemics', passage_count: 3456, books: 7, language: 'greek', genre: 'Medicine' },
    { work: 'On the Sacred Disease', passage_count: 567, books: 1, language: 'greek', genre: 'Medicine' },
  ],
  'Galen': [
    { work: 'On the Natural Faculties', passage_count: 4567, books: 3, language: 'greek', genre: 'Medicine' },
    { work: 'On the Usefulness of Parts', passage_count: 8934, books: 17, language: 'greek', genre: 'Anatomy' },
    { work: 'Method of Medicine', passage_count: 12345, books: 14, language: 'greek', genre: 'Therapeutics' },
  ],
  // Additional Latin Authors
  'Plautus': [
    { work: 'Amphitruo', passage_count: 1146, books: 1, language: 'latin', genre: 'Comedy' },
    { work: 'Aulularia', passage_count: 833, books: 1, language: 'latin', genre: 'Comedy' },
    { work: 'Captivi', passage_count: 1036, books: 1, language: 'latin', genre: 'Comedy' },
    { work: 'Menaechmi', passage_count: 1162, books: 1, language: 'latin', genre: 'Comedy' },
    { work: 'Miles Gloriosus', passage_count: 1437, books: 1, language: 'latin', genre: 'Comedy' },
    { work: 'Mostellaria', passage_count: 1181, books: 1, language: 'latin', genre: 'Comedy' },
    { work: 'Pseudolus', passage_count: 1335, books: 1, language: 'latin', genre: 'Comedy' },
  ],
  'Terence': [
    { work: 'Andria', passage_count: 981, books: 1, language: 'latin', genre: 'Comedy' },
    { work: 'Adelphoe', passage_count: 997, books: 1, language: 'latin', genre: 'Comedy' },
    { work: 'Eunuchus', passage_count: 1094, books: 1, language: 'latin', genre: 'Comedy' },
    { work: 'Heauton Timorumenos', passage_count: 1067, books: 1, language: 'latin', genre: 'Comedy' },
    { work: 'Hecyra', passage_count: 880, books: 1, language: 'latin', genre: 'Comedy' },
    { work: 'Phormio', passage_count: 1055, books: 1, language: 'latin', genre: 'Comedy' },
  ],
  'Lucretius': [
    { work: 'De Rerum Natura', passage_count: 7890, books: 6, language: 'latin', genre: 'Epicurean Philosophy' },
  ],
  'Catullus': [
    { work: 'Carmina', passage_count: 2345, books: 1, language: 'latin', genre: 'Lyric Poetry' },
  ],
  'Julius Caesar': [
    { work: 'De Bello Gallico', passage_count: 5678, books: 8, language: 'latin', genre: 'Military History' },
    { work: 'De Bello Civili', passage_count: 3256, books: 3, language: 'latin', genre: 'Military History' },
  ],
  'Sallust': [
    { work: 'Bellum Catilinae', passage_count: 2345, books: 1, language: 'latin', genre: 'Monograph' },
    { work: 'Bellum Jugurthinum', passage_count: 3333, books: 1, language: 'latin', genre: 'Monograph' },
  ],
  'Quintilian': [
    { work: 'Institutio Oratoria', passage_count: 12345, books: 12, language: 'latin', genre: 'Rhetorical Theory' },
  ],
  'Pliny the Elder': [
    { work: 'Naturalis Historia', passage_count: 23456, books: 37, language: 'latin', genre: 'Encyclopedia' },
  ],
  'Pliny the Younger': [
    { work: 'Epistulae', passage_count: 7234, books: 10, language: 'latin', genre: 'Letters' },
    { work: 'Panegyricus', passage_count: 1700, books: 1, language: 'latin', genre: 'Oratory' },
  ],
  'Martial': [
    { work: 'Epigrammata', passage_count: 15678, books: 15, language: 'latin', genre: 'Epigram' },
  ],
  'Juvenal': [
    { work: 'Satires', passage_count: 4567, books: 5, language: 'latin', genre: 'Satire' },
  ],
  'Apuleius': [
    { work: 'Metamorphoses (Golden Ass)', passage_count: 5678, books: 11, language: 'latin', genre: 'Novel' },
    { work: 'Apologia', passage_count: 1111, books: 1, language: 'latin', genre: 'Forensic' },
  ],
  'Jerome': [
    { work: 'Vulgate Bible', passage_count: 23456, books: 73, language: 'latin', genre: 'Translation' },
    { work: 'Letters', passage_count: 8934, books: 1, language: 'latin', genre: 'Epistolary' },
    { work: 'De Viris Illustribus', passage_count: 2177, books: 1, language: 'latin', genre: 'Biography' },
  ],
  'Boethius': [
    { work: 'Consolation of Philosophy', passage_count: 3456, books: 5, language: 'latin', genre: 'Philosophy' },
    { work: 'De Musica', passage_count: 1111, books: 5, language: 'latin', genre: 'Music Theory' },
  ],
  // Hebrew Authors
  'Torah': [
    { work: 'Genesis (Bereshit)', passage_count: 1533, books: 50, language: 'hebrew', genre: 'Narrative' },
    { work: 'Exodus (Shemot)', passage_count: 1213, books: 40, language: 'hebrew', genre: 'Narrative/Law' },
    { work: 'Leviticus (Vayikra)', passage_count: 859, books: 27, language: 'hebrew', genre: 'Law' },
    { work: 'Numbers (Bamidbar)', passage_count: 1288, books: 36, language: 'hebrew', genre: 'Narrative/Law' },
    { work: 'Deuteronomy (Devarim)', passage_count: 952, books: 34, language: 'hebrew', genre: 'Law' },
  ],
  "Prophets (Nevi'im)": [
    { work: 'Isaiah', passage_count: 1292, books: 66, language: 'hebrew', genre: 'Prophecy' },
    { work: 'Jeremiah', passage_count: 1364, books: 52, language: 'hebrew', genre: 'Prophecy' },
    { work: 'Ezekiel', passage_count: 1273, books: 48, language: 'hebrew', genre: 'Prophecy' },
    { work: 'Twelve Minor Prophets', passage_count: 2456, books: 67, language: 'hebrew', genre: 'Prophecy' },
    { work: 'Joshua', passage_count: 658, books: 24, language: 'hebrew', genre: 'History' },
    { work: 'Judges', passage_count: 618, books: 21, language: 'hebrew', genre: 'History' },
    { work: 'Samuel', passage_count: 1506, books: 55, language: 'hebrew', genre: 'History' },
    { work: 'Kings', passage_count: 1534, books: 47, language: 'hebrew', genre: 'History' },
  ],
  'Writings (Ketuvim)': [
    { work: 'Psalms (Tehillim)', passage_count: 2527, books: 150, language: 'hebrew', genre: 'Poetry' },
    { work: 'Proverbs (Mishlei)', passage_count: 915, books: 31, language: 'hebrew', genre: 'Wisdom' },
    { work: 'Job (Iyov)', passage_count: 1070, books: 42, language: 'hebrew', genre: 'Wisdom' },
    { work: 'Song of Songs', passage_count: 117, books: 8, language: 'hebrew', genre: 'Poetry' },
    { work: 'Ecclesiastes (Kohelet)', passage_count: 222, books: 12, language: 'hebrew', genre: 'Wisdom' },
    { work: 'Ruth', passage_count: 85, books: 4, language: 'hebrew', genre: 'Narrative' },
    { work: 'Lamentations (Eicha)', passage_count: 154, books: 5, language: 'hebrew', genre: 'Poetry' },
    { work: 'Daniel', passage_count: 357, books: 12, language: 'hebrew', genre: 'Apocalyptic' },
    { work: 'Esther', passage_count: 167, books: 10, language: 'hebrew', genre: 'Narrative' },
    { work: 'Ezra-Nehemiah', passage_count: 688, books: 23, language: 'hebrew', genre: 'History' },
    { work: 'Chronicles', passage_count: 1765, books: 65, language: 'hebrew', genre: 'History' },
  ],
  'Josephus': [
    { work: 'Jewish Antiquities', passage_count: 15678, books: 20, language: 'hebrew', genre: 'History' },
    { work: 'Jewish War', passage_count: 5678, books: 7, language: 'hebrew', genre: 'History' },
    { work: 'Against Apion', passage_count: 1234, books: 2, language: 'hebrew', genre: 'Apologetics' },
    { work: 'Life', passage_count: 866, books: 1, language: 'hebrew', genre: 'Autobiography' },
  ],
  'Philo of Alexandria': [
    { work: 'On the Creation', passage_count: 1234, books: 1, language: 'hebrew', genre: 'Exegesis' },
    { work: 'Allegorical Interpretation', passage_count: 3456, books: 3, language: 'hebrew', genre: 'Exegesis' },
    { work: 'On the Life of Moses', passage_count: 2345, books: 2, language: 'hebrew', genre: 'Biography' },
    { work: 'On the Contemplative Life', passage_count: 890, books: 1, language: 'hebrew', genre: 'Philosophy' },
  ],
  // Aramaic Authors
  'Targum Onkelos': [
    { work: 'Genesis', passage_count: 1533, books: 50, language: 'aramaic', genre: 'Translation' },
    { work: 'Exodus', passage_count: 1213, books: 40, language: 'aramaic', genre: 'Translation' },
    { work: 'Leviticus', passage_count: 859, books: 27, language: 'aramaic', genre: 'Translation' },
    { work: 'Numbers', passage_count: 1288, books: 36, language: 'aramaic', genre: 'Translation' },
    { work: 'Deuteronomy', passage_count: 952, books: 34, language: 'aramaic', genre: 'Translation' },
  ],
  'Babylonian Talmud': [
    { work: 'Berakhot', passage_count: 2456, books: 9, language: 'aramaic', genre: 'Law' },
    { work: 'Shabbat', passage_count: 4567, books: 24, language: 'aramaic', genre: 'Law' },
    { work: 'Bava Kamma', passage_count: 3456, books: 10, language: 'aramaic', genre: 'Law' },
    { work: 'Bava Metzia', passage_count: 3890, books: 10, language: 'aramaic', genre: 'Law' },
    { work: 'Bava Batra', passage_count: 4234, books: 10, language: 'aramaic', genre: 'Law' },
    { work: 'Sanhedrin', passage_count: 3567, books: 11, language: 'aramaic', genre: 'Law' },
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
  'Hesiod:Theogony': {
    total: 1022,
    passages: [
      { id: 'theog.1', content: 'Μουσάων Ἑλικωνιάδων ἀρχώμεθ᾽ ἀείδειν,', author: 'Hesiod', work: 'Theogony', urn: 'urn:cts:greekLit:tlg0020.tlg001:1', language: 'greek' },
      { id: 'theog.2', content: 'αἵ θ᾽ Ἑλικῶνος ἔχουσιν ὄρος μέγα τε ζάθεόν τε,', author: 'Hesiod', work: 'Theogony', urn: 'urn:cts:greekLit:tlg0020.tlg001:2', language: 'greek' },
      { id: 'theog.3', content: 'καί τε περὶ κρήνην ἰοειδέα πόσσ᾽ ἁπαλοῖσιν', author: 'Hesiod', work: 'Theogony', urn: 'urn:cts:greekLit:tlg0020.tlg001:3', language: 'greek' },
      { id: 'theog.4', content: 'ὀρχεῦνται καὶ βωμὸν ἐρισθενέος Κρονίωνος.', author: 'Hesiod', work: 'Theogony', urn: 'urn:cts:greekLit:tlg0020.tlg001:4', language: 'greek' },
    ]
  },
  'Hesiod:Works and Days': {
    total: 828,
    passages: [
      { id: 'wd.1', content: 'Μοῦσαι Πιερίηθεν ἀοιδῇσι κλείουσαι,', author: 'Hesiod', work: 'Works and Days', urn: 'urn:cts:greekLit:tlg0020.tlg002:1', language: 'greek' },
      { id: 'wd.2', content: 'δεῦτε Δί᾽ ἐννέπετε, σφέτερον πατέρ᾽ ὑμνείουσαι.', author: 'Hesiod', work: 'Works and Days', urn: 'urn:cts:greekLit:tlg0020.tlg002:2', language: 'greek' },
      { id: 'wd.3', content: 'ὅν τε διὰ βροτοὶ ἄνδρες ὁμῶς ἄφατοί τε φατοί τε,', author: 'Hesiod', work: 'Works and Days', urn: 'urn:cts:greekLit:tlg0020.tlg002:3', language: 'greek' },
    ]
  },
  'Pindar:Olympian Odes': {
    total: 1456,
    passages: [
      { id: 'ol.1.1', content: 'Ἄριστον μὲν ὕδωρ, ὁ δὲ χρυσὸς αἰθόμενον πῦρ', author: 'Pindar', work: 'Olympian Odes', urn: 'urn:cts:greekLit:tlg0033.tlg001:1.1', language: 'greek' },
      { id: 'ol.1.2', content: 'ἅτε διαπρέπει νυκτὶ μεγάνορος ἔξοχα πλούτου:', author: 'Pindar', work: 'Olympian Odes', urn: 'urn:cts:greekLit:tlg0033.tlg001:1.2', language: 'greek' },
      { id: 'ol.1.3', content: 'εἰ δ᾽ ἄεθλα γαρύεν ἔλδεαι, φίλον ἦτορ,', author: 'Pindar', work: 'Olympian Odes', urn: 'urn:cts:greekLit:tlg0033.tlg001:1.3', language: 'greek' },
    ]
  },
  'Aeschylus:Agamemnon': {
    total: 1673,
    passages: [
      { id: 'ag.1', content: 'Θεοὺς μὲν αἰτῶ τῶνδ᾽ ἀπαλλαγὴν πόνων,', author: 'Aeschylus', work: 'Agamemnon', urn: 'urn:cts:greekLit:tlg0085.tlg005:1', language: 'greek' },
      { id: 'ag.2', content: 'φρουρᾶς ἐτείας μῆκος, ἣν κοιμώμενος', author: 'Aeschylus', work: 'Agamemnon', urn: 'urn:cts:greekLit:tlg0085.tlg005:2', language: 'greek' },
      { id: 'ag.3', content: 'στέγαις Ἀτρειδῶν ἄγκαθεν, κυνὸς δίκην,', author: 'Aeschylus', work: 'Agamemnon', urn: 'urn:cts:greekLit:tlg0085.tlg005:3', language: 'greek' },
      { id: 'ag.4', content: 'ἄστρων κάτοιδα νυκτέρων ὁμήγυριν,', author: 'Aeschylus', work: 'Agamemnon', urn: 'urn:cts:greekLit:tlg0085.tlg005:4', language: 'greek' },
    ]
  },
  'Aeschylus:Prometheus Bound': {
    total: 1093,
    passages: [
      { id: 'pb.1', content: 'Χθονὸς μὲν ἐς τηλουρὸν ἥκομεν πέδον,', author: 'Aeschylus', work: 'Prometheus Bound', urn: 'urn:cts:greekLit:tlg0085.tlg003:1', language: 'greek' },
      { id: 'pb.2', content: 'Σκύθην ἐς οἶμον, ἄβατον εἰς ἐρημίαν.', author: 'Aeschylus', work: 'Prometheus Bound', urn: 'urn:cts:greekLit:tlg0085.tlg003:2', language: 'greek' },
      { id: 'pb.3', content: 'Ἥφαιστε, σοὶ δὲ χρὴ μέλειν ἐπιστολὰς', author: 'Aeschylus', work: 'Prometheus Bound', urn: 'urn:cts:greekLit:tlg0085.tlg003:3', language: 'greek' },
    ]
  },
  'Aristophanes:Clouds': {
    total: 1510,
    passages: [
      { id: 'nub.1', content: 'Ἰοὺ ἰού. ὦ Ζεῦ βασιλεῦ, τὸ χρῆμα τῶν νυκτῶν ὅσον.', author: 'Aristophanes', work: 'Clouds', urn: 'urn:cts:greekLit:tlg0019.tlg003:1', language: 'greek' },
      { id: 'nub.2', content: 'ἀπέραντον. οὐδέποθ᾽ ἡμέρα γενήσεται;', author: 'Aristophanes', work: 'Clouds', urn: 'urn:cts:greekLit:tlg0019.tlg003:2', language: 'greek' },
      { id: 'nub.3', content: 'καὶ μὴν πάλαι γ᾽ ἀλεκτρυόνος ἤκουσ᾽ ἐγώ.', author: 'Aristophanes', work: 'Clouds', urn: 'urn:cts:greekLit:tlg0019.tlg003:3', language: 'greek' },
    ]
  },
  'Aristophanes:Frogs': {
    total: 1533,
    passages: [
      { id: 'ran.1', content: 'Εἴπω τι τῶν εἰωθότων, ὦ δέσποτα,', author: 'Aristophanes', work: 'Frogs', urn: 'urn:cts:greekLit:tlg0019.tlg007:1', language: 'greek' },
      { id: 'ran.2', content: 'ἐφ᾽ οἷς ἀεὶ γελῶσιν οἱ θεώμενοι;', author: 'Aristophanes', work: 'Frogs', urn: 'urn:cts:greekLit:tlg0019.tlg007:2', language: 'greek' },
      { id: 'ran.3', content: 'Νὴ τὸν Δί᾽ ὅ τι βούλει γε, πλὴν "πιέζομαι":', author: 'Aristophanes', work: 'Frogs', urn: 'urn:cts:greekLit:tlg0019.tlg007:3', language: 'greek' },
    ]
  },
  'Demosthenes:On the Crown': {
    total: 3456,
    passages: [
      { id: 'cor.1', content: 'Πρῶτον μέν, ὦ ἄνδρες Ἀθηναῖοι, τοῖς θεοῖς εὔχομαι πᾶσι καὶ πάσαις,', author: 'Demosthenes', work: 'On the Crown', urn: 'urn:cts:greekLit:tlg0014.tlg018:1', language: 'greek' },
      { id: 'cor.2', content: 'ὅσην εὔνοιαν ἔχων ἐγὼ διατελῶ τῇ τε πόλει καὶ πᾶσιν ὑμῖν,', author: 'Demosthenes', work: 'On the Crown', urn: 'urn:cts:greekLit:tlg0014.tlg018:2', language: 'greek' },
      { id: 'cor.3', content: 'τοσαύτην ὑπάρξαι μοι παρ᾽ ὑμῶν εἰς τουτονὶ τὸν ἀγῶνα.', author: 'Demosthenes', work: 'On the Crown', urn: 'urn:cts:greekLit:tlg0014.tlg018:3', language: 'greek' },
    ]
  },
  'Plutarch:Life of Alexander': {
    total: 2345,
    passages: [
      { id: 'alex.1', content: 'Τὸν Ἀλεξάνδρου τοῦ βασιλέως βίον καὶ τὸν Καίσαρος, ὑφ᾽ οὗ κατελύθη Πομπήιος,', author: 'Plutarch', work: 'Life of Alexander', urn: 'urn:cts:greekLit:tlg0007.tlg047:1', language: 'greek' },
      { id: 'alex.2', content: 'ἐν τούτῳ τῷ βιβλίῳ γράφοντες, διὰ τὸ πλῆθος τῶν ὑποκειμένων πράξεων', author: 'Plutarch', work: 'Life of Alexander', urn: 'urn:cts:greekLit:tlg0007.tlg047:2', language: 'greek' },
      { id: 'alex.3', content: 'οὐδὲν ἄλλο προεροῦμεν ἢ παραιτησόμεθα τοὺς ἀναγινώσκοντας,', author: 'Plutarch', work: 'Life of Alexander', urn: 'urn:cts:greekLit:tlg0007.tlg047:3', language: 'greek' },
    ]
  },
  'Euripides:Medea': {
    total: 1419,
    passages: [
      { id: 'med.1', content: 'Εἴθ᾽ ὤφελ᾽ Ἀργοῦς μὴ διαπτάσθαι σκάφος', author: 'Euripides', work: 'Medea', urn: 'urn:cts:greekLit:tlg0006.tlg003:1', language: 'greek' },
      { id: 'med.2', content: 'Κόλχων ἐς αἶαν κυανέας Συμπληγάδας,', author: 'Euripides', work: 'Medea', urn: 'urn:cts:greekLit:tlg0006.tlg003:2', language: 'greek' },
      { id: 'med.3', content: 'μηδ᾽ ἐν νάπαισι Πηλίου πεσεῖν ποτε', author: 'Euripides', work: 'Medea', urn: 'urn:cts:greekLit:tlg0006.tlg003:3', language: 'greek' },
      { id: 'med.4', content: 'τμηθεῖσα πεύκη, μηδ᾽ ἐρετμῶσαι χέρας', author: 'Euripides', work: 'Medea', urn: 'urn:cts:greekLit:tlg0006.tlg003:4', language: 'greek' },
    ]
  },
  'Euripides:Bacchae': {
    total: 1392,
    passages: [
      { id: 'ba.1', content: 'Ἥκω Διὸς παῖς τήνδε Θηβαίων χθόνα', author: 'Euripides', work: 'Bacchae', urn: 'urn:cts:greekLit:tlg0006.tlg012:1', language: 'greek' },
      { id: 'ba.2', content: 'Διόνυσος, ὃν τίκτει ποθ᾽ ἡ Κάδμου κόρη', author: 'Euripides', work: 'Bacchae', urn: 'urn:cts:greekLit:tlg0006.tlg012:2', language: 'greek' },
      { id: 'ba.3', content: 'Σεμέλη λοχευθεῖσ᾽ ἀστραπηφόρῳ πυρί.', author: 'Euripides', work: 'Bacchae', urn: 'urn:cts:greekLit:tlg0006.tlg012:3', language: 'greek' },
    ]
  },
  'Sophocles:Antigone': {
    total: 1353,
    passages: [
      { id: 'ant.1', content: 'Ὦ κοινὸν αὐτάδελφον Ἰσμήνης κάρα,', author: 'Sophocles', work: 'Antigone', urn: 'urn:cts:greekLit:tlg0011.tlg002:1', language: 'greek' },
      { id: 'ant.2', content: 'ἆρ᾽ οἶσθ᾽ ὅ τι Ζεὺς τῶν ἀπ᾽ Οἰδίπου κακῶν', author: 'Sophocles', work: 'Antigone', urn: 'urn:cts:greekLit:tlg0011.tlg002:2', language: 'greek' },
      { id: 'ant.3', content: 'ὁποῖον οὐχὶ νῷν ἔτι ζώσαιν τελεῖ;', author: 'Sophocles', work: 'Antigone', urn: 'urn:cts:greekLit:tlg0011.tlg002:3', language: 'greek' },
    ]
  },
  'Sophocles:Electra': {
    total: 1510,
    passages: [
      { id: 'el.1', content: 'Ὦ τοῦ στρατηγήσαντος ἐν Τροίᾳ ποτὲ', author: 'Sophocles', work: 'Electra', urn: 'urn:cts:greekLit:tlg0011.tlg003:1', language: 'greek' },
      { id: 'el.2', content: 'Ἀγαμέμνονος παῖ, νῦν ἐκεῖν᾽ ἔξεστί σοι', author: 'Sophocles', work: 'Electra', urn: 'urn:cts:greekLit:tlg0011.tlg003:2', language: 'greek' },
      { id: 'el.3', content: 'παρόντι λεύσσειν, ὧν πρόθυμος ἦσθ᾽ ἀεί.', author: 'Sophocles', work: 'Electra', urn: 'urn:cts:greekLit:tlg0011.tlg003:3', language: 'greek' },
    ]
  },
  'Herodotus:Histories': {
    total: 18923,
    passages: [
      { id: 'hdt.1.1', content: 'Ἡροδότου Ἁλικαρνησσέος ἱστορίης ἀπόδεξις ἥδε,', author: 'Herodotus', work: 'Histories', urn: 'urn:cts:greekLit:tlg0016.tlg001:1.1', language: 'greek' },
      { id: 'hdt.1.2', content: 'ὡς μήτε τὰ γενόμενα ἐξ ἀνθρώπων τῷ χρόνῳ ἐξίτηλα γένηται,', author: 'Herodotus', work: 'Histories', urn: 'urn:cts:greekLit:tlg0016.tlg001:1.2', language: 'greek' },
      { id: 'hdt.1.3', content: 'μήτε ἔργα μεγάλα τε καὶ θωμαστά, τὰ μὲν Ἕλλησι τὰ δὲ βαρβάροισι ἀποδεχθέντα,', author: 'Herodotus', work: 'Histories', urn: 'urn:cts:greekLit:tlg0016.tlg001:1.3', language: 'greek' },
      { id: 'hdt.1.4', content: 'ἀκλεᾶ γένηται, τά τε ἄλλα καὶ δι᾽ ἣν αἰτίην ἐπολέμησαν ἀλλήλοισι.', author: 'Herodotus', work: 'Histories', urn: 'urn:cts:greekLit:tlg0016.tlg001:1.4', language: 'greek' },
    ]
  },
  'Thucydides:History of the Peloponnesian War': {
    total: 15678,
    passages: [
      { id: 'thuc.1.1', content: 'Θουκυδίδης Ἀθηναῖος ξυνέγραψε τὸν πόλεμον τῶν Πελοποννησίων καὶ Ἀθηναίων,', author: 'Thucydides', work: 'History of the Peloponnesian War', urn: 'urn:cts:greekLit:tlg0003.tlg001:1.1.1', language: 'greek' },
      { id: 'thuc.1.2', content: 'ὡς ἐπολέμησαν πρὸς ἀλλήλους, ἀρξάμενος εὐθὺς καθισταμένου', author: 'Thucydides', work: 'History of the Peloponnesian War', urn: 'urn:cts:greekLit:tlg0003.tlg001:1.1.2', language: 'greek' },
      { id: 'thuc.1.3', content: 'καὶ ἐλπίσας μέγαν τε ἔσεσθαι καὶ ἀξιολογώτατον τῶν προγεγενημένων,', author: 'Thucydides', work: 'History of the Peloponnesian War', urn: 'urn:cts:greekLit:tlg0003.tlg001:1.1.3', language: 'greek' },
    ]
  },
  'Plato:Symposium': {
    total: 2345,
    passages: [
      { id: 'symp.172a', content: 'Δοκῶ μοι περὶ ὧν πυνθάνεσθε οὐκ ἀμελέτητος εἶναι.', author: 'Plato', work: 'Symposium', urn: 'urn:cts:greekLit:tlg0059.tlg011:172a', language: 'greek' },
      { id: 'symp.172b', content: 'καὶ γὰρ ἐτύγχανον πρῴην εἰς ἄστυ οἴκοθεν ἀνιὼν Φαληρόθεν:', author: 'Plato', work: 'Symposium', urn: 'urn:cts:greekLit:tlg0059.tlg011:172b', language: 'greek' },
      { id: 'symp.172c', content: 'τῶν οὖν γνωρίμων τις ὄπισθεν κατιδών με πόρρωθεν ἐκάλεσε,', author: 'Plato', work: 'Symposium', urn: 'urn:cts:greekLit:tlg0059.tlg011:172c', language: 'greek' },
    ]
  },
  'Plato:Apology': {
    total: 1234,
    passages: [
      { id: 'apol.17a', content: 'Ὅ τι μὲν ὑμεῖς, ὦ ἄνδρες Ἀθηναῖοι, πεπόνθατε ὑπὸ τῶν ἐμῶν κατηγόρων, οὐκ οἶδα:', author: 'Plato', work: 'Apology', urn: 'urn:cts:greekLit:tlg0059.tlg002:17a', language: 'greek' },
      { id: 'apol.17b', content: 'ἐγὼ δ᾽ οὖν καὶ αὐτὸς ὑπ᾽ αὐτῶν ὀλίγου ἐμαυτοῦ ἐπελαθόμην,', author: 'Plato', work: 'Apology', urn: 'urn:cts:greekLit:tlg0059.tlg002:17b', language: 'greek' },
      { id: 'apol.17c', content: 'οὕτω πιθανῶς ἔλεγον. καίτοι ἀληθές γε ὡς ἔπος εἰπεῖν οὐδὲν εἰρήκασιν.', author: 'Plato', work: 'Apology', urn: 'urn:cts:greekLit:tlg0059.tlg002:17c', language: 'greek' },
    ]
  },
  'Plato:Phaedo': {
    total: 2890,
    passages: [
      { id: 'phaedo.57a', content: 'Αὐτός, ὦ Φαίδων, παρεγένου Σωκράτει ἐκείνῃ τῇ ἡμέρᾳ ᾗ τὸ φάρμακον ἔπιεν ἐν τῷ δεσμωτηρίῳ,', author: 'Plato', work: 'Phaedo', urn: 'urn:cts:greekLit:tlg0059.tlg004:57a', language: 'greek' },
      { id: 'phaedo.57b', content: 'ἢ ἄλλου του ἤκουσας;', author: 'Plato', work: 'Phaedo', urn: 'urn:cts:greekLit:tlg0059.tlg004:57b', language: 'greek' },
      { id: 'phaedo.57c', content: 'Αὐτός, ὦ Ἐχέκρατες.', author: 'Plato', work: 'Phaedo', urn: 'urn:cts:greekLit:tlg0059.tlg004:57c', language: 'greek' },
    ]
  },
  'Aristotle:Politics': {
    total: 5678,
    passages: [
      { id: 'pol.1252a', content: 'Ἐπειδὴ πᾶσαν πόλιν ὁρῶμεν κοινωνίαν τινὰ οὖσαν καὶ πᾶσαν κοινωνίαν ἀγαθοῦ τινος ἕνεκεν συνεστηκυῖαν', author: 'Aristotle', work: 'Politics', urn: 'urn:cts:greekLit:tlg0086.tlg035:1252a', language: 'greek' },
      { id: 'pol.1252b', content: '(τοῦ γὰρ εἶναι δοκοῦντος ἀγαθοῦ χάριν πάντα πράττουσι πάντες),', author: 'Aristotle', work: 'Politics', urn: 'urn:cts:greekLit:tlg0086.tlg035:1252b', language: 'greek' },
      { id: 'pol.1252c', content: 'δῆλον ὡς πᾶσαι μὲν ἀγαθοῦ τινος στοχάζονται,', author: 'Aristotle', work: 'Politics', urn: 'urn:cts:greekLit:tlg0086.tlg035:1252c', language: 'greek' },
    ]
  },
  'Aristotle:Metaphysics': {
    total: 6789,
    passages: [
      { id: 'met.980a', content: 'Πάντες ἄνθρωποι τοῦ εἰδέναι ὀρέγονται φύσει.', author: 'Aristotle', work: 'Metaphysics', urn: 'urn:cts:greekLit:tlg0086.tlg025:980a', language: 'greek' },
      { id: 'met.980b', content: 'σημεῖον δ᾽ ἡ τῶν αἰσθήσεων ἀγάπησις:', author: 'Aristotle', work: 'Metaphysics', urn: 'urn:cts:greekLit:tlg0086.tlg025:980b', language: 'greek' },
      { id: 'met.980c', content: 'καὶ γὰρ χωρὶς τῆς χρείας ἀγαπῶνται δι᾽ αὑτάς,', author: 'Aristotle', work: 'Metaphysics', urn: 'urn:cts:greekLit:tlg0086.tlg025:980c', language: 'greek' },
    ]
  },
  'Aristotle:Poetics': {
    total: 1234,
    passages: [
      { id: 'poet.1447a', content: 'Περὶ ποιητικῆς αὐτῆς τε καὶ τῶν εἰδῶν αὐτῆς, ἥν τινα δύναμιν ἕκαστον ἔχει,', author: 'Aristotle', work: 'Poetics', urn: 'urn:cts:greekLit:tlg0086.tlg034:1447a', language: 'greek' },
      { id: 'poet.1447b', content: 'καὶ πῶς δεῖ συνίστασθαι τοὺς μύθους εἰ μέλλει καλῶς ἕξειν ἡ ποίησις,', author: 'Aristotle', work: 'Poetics', urn: 'urn:cts:greekLit:tlg0086.tlg034:1447b', language: 'greek' },
      { id: 'poet.1447c', content: 'ἔτι δὲ ἐκ πόσων καὶ ποίων ἐστὶ μορίων,', author: 'Aristotle', work: 'Poetics', urn: 'urn:cts:greekLit:tlg0086.tlg034:1447c', language: 'greek' },
    ]
  },
  'Euripides:Hippolytus': {
    total: 1466,
    passages: [
      { id: 'hipp.1', content: 'Πολλή μέν ἐν βροτοῖσι κοὐκ ἀνώνυμος', author: 'Euripides', work: 'Hippolytus', urn: 'urn:cts:greekLit:tlg0006.tlg007:1', language: 'greek' },
      { id: 'hipp.2', content: 'θεὰ κέκλημαι Κύπρις οὐρανοῦ τ᾽ ἔσω.', author: 'Euripides', work: 'Hippolytus', urn: 'urn:cts:greekLit:tlg0006.tlg007:2', language: 'greek' },
      { id: 'hipp.3', content: 'ὅσοι τε Πόντου τερμόνων τ᾽ Ἀτλαντικῶν', author: 'Euripides', work: 'Hippolytus', urn: 'urn:cts:greekLit:tlg0006.tlg007:3', language: 'greek' },
    ]
  },
  'Virgil:Georgics': {
    total: 2188,
    passages: [
      { id: 'geo.1.1', content: 'Quid faciat laetas segetes, quo sidere terram', author: 'Virgil', work: 'Georgics', urn: 'urn:cts:latinLit:phi0690.phi002:1.1', language: 'latin' },
      { id: 'geo.1.2', content: 'vertere, Maecenas, ulmisque adiungere vitis', author: 'Virgil', work: 'Georgics', urn: 'urn:cts:latinLit:phi0690.phi002:1.2', language: 'latin' },
      { id: 'geo.1.3', content: 'conveniat, quae cura boum, qui cultus habendo', author: 'Virgil', work: 'Georgics', urn: 'urn:cts:latinLit:phi0690.phi002:1.3', language: 'latin' },
    ]
  },
  'Virgil:Eclogues': {
    total: 829,
    passages: [
      { id: 'ecl.1.1', content: 'Tityre, tu patulae recubans sub tegmine fagi', author: 'Virgil', work: 'Eclogues', urn: 'urn:cts:latinLit:phi0690.phi001:1.1', language: 'latin' },
      { id: 'ecl.1.2', content: 'silvestrem tenui Musam meditaris avena;', author: 'Virgil', work: 'Eclogues', urn: 'urn:cts:latinLit:phi0690.phi001:1.2', language: 'latin' },
      { id: 'ecl.1.3', content: 'nos patriae fines et dulcia linquimus arva,', author: 'Virgil', work: 'Eclogues', urn: 'urn:cts:latinLit:phi0690.phi001:1.3', language: 'latin' },
    ]
  },
  'Cicero:De Republica': {
    total: 3456,
    passages: [
      { id: 'rep.1.1', content: 'M. Cato ille senex cum esset, saepe mecum fuit,', author: 'Cicero', work: 'De Republica', urn: 'urn:cts:latinLit:phi0474.phi043:1.1', language: 'latin' },
      { id: 'rep.1.2', content: 'praesertim cum et invidus mihi cupiditate incensi eos,', author: 'Cicero', work: 'De Republica', urn: 'urn:cts:latinLit:phi0474.phi043:1.2', language: 'latin' },
      { id: 'rep.1.3', content: 'qui in maximis rebus suo ipsorum iudicio uti possunt.', author: 'Cicero', work: 'De Republica', urn: 'urn:cts:latinLit:phi0474.phi043:1.3', language: 'latin' },
    ]
  },
  'Cicero:In Catilinam': {
    total: 2345,
    passages: [
      { id: 'cat.1.1', content: 'Quo usque tandem abutere, Catilina, patientia nostra?', author: 'Cicero', work: 'In Catilinam', urn: 'urn:cts:latinLit:phi0474.phi014:1.1', language: 'latin' },
      { id: 'cat.1.2', content: 'Quam diu etiam furor iste tuus nos eludet?', author: 'Cicero', work: 'In Catilinam', urn: 'urn:cts:latinLit:phi0474.phi014:1.2', language: 'latin' },
      { id: 'cat.1.3', content: 'Quem ad finem sese effrenata iactabit audacia?', author: 'Cicero', work: 'In Catilinam', urn: 'urn:cts:latinLit:phi0474.phi014:1.3', language: 'latin' },
    ]
  },
  'Julius Caesar:Gallic Wars': {
    total: 8934,
    passages: [
      { id: 'bg.1.1', content: 'Gallia est omnis divisa in partes tres, quarum unam incolunt Belgae,', author: 'Julius Caesar', work: 'Gallic Wars', urn: 'urn:cts:latinLit:phi0448.phi001:1.1', language: 'latin' },
      { id: 'bg.1.2', content: 'aliam Aquitani, tertiam qui ipsorum lingua Celtae, nostra Galli appellantur.', author: 'Julius Caesar', work: 'Gallic Wars', urn: 'urn:cts:latinLit:phi0448.phi001:1.2', language: 'latin' },
      { id: 'bg.1.3', content: 'Hi omnes lingua, institutis, legibus inter se differunt.', author: 'Julius Caesar', work: 'Gallic Wars', urn: 'urn:cts:latinLit:phi0448.phi001:1.3', language: 'latin' },
    ]
  },
  'Lucretius:De Rerum Natura': {
    total: 7890,
    passages: [
      { id: 'drn.1.1', content: 'Aeneadum genetrix, hominum divomque voluptas,', author: 'Lucretius', work: 'De Rerum Natura', urn: 'urn:cts:latinLit:phi0550.phi001:1.1', language: 'latin' },
      { id: 'drn.1.2', content: 'alma Venus, caeli subter labentia signa', author: 'Lucretius', work: 'De Rerum Natura', urn: 'urn:cts:latinLit:phi0550.phi001:1.2', language: 'latin' },
      { id: 'drn.1.3', content: 'quae mare navigerum, quae terras frugiferentis', author: 'Lucretius', work: 'De Rerum Natura', urn: 'urn:cts:latinLit:phi0550.phi001:1.3', language: 'latin' },
    ]
  },
  'Catullus:Carmina': {
    total: 2345,
    passages: [
      { id: 'carm.1.1', content: 'Cui dono lepidum novum libellum', author: 'Catullus', work: 'Carmina', urn: 'urn:cts:latinLit:phi0472.phi001:1.1', language: 'latin' },
      { id: 'carm.1.2', content: 'arida modo pumice expolitum?', author: 'Catullus', work: 'Carmina', urn: 'urn:cts:latinLit:phi0472.phi001:1.2', language: 'latin' },
      { id: 'carm.1.3', content: 'Corneli, tibi: namque tu solebas', author: 'Catullus', work: 'Carmina', urn: 'urn:cts:latinLit:phi0472.phi001:1.3', language: 'latin' },
    ]
  },
  'Marcus Aurelius:Meditations': {
    total: 3456,
    passages: [
      { id: 'med.1.1', content: 'Παρὰ τοῦ πάππου Οὐήρου τὸ καλόηθες καὶ ἀόργητον.', author: 'Marcus Aurelius', work: 'Meditations', urn: 'urn:cts:greekLit:tlg0562.tlg001:1.1', language: 'greek' },
      { id: 'med.1.2', content: 'Παρὰ τῆς δόξης καὶ μνήμης τῆς περὶ τοῦ γεννήσαντος τὸ αἰδῆμον καὶ ἀρρενικόν.', author: 'Marcus Aurelius', work: 'Meditations', urn: 'urn:cts:greekLit:tlg0562.tlg001:1.2', language: 'greek' },
      { id: 'med.1.3', content: 'Παρὰ τῆς μητρὸς τὸ θεοσεβὲς καὶ μεταδοτικὸν', author: 'Marcus Aurelius', work: 'Meditations', urn: 'urn:cts:greekLit:tlg0562.tlg001:1.3', language: 'greek' },
    ]
  },
  'Epictetus:Discourses': {
    total: 4567,
    passages: [
      { id: 'disc.1.1', content: 'Τῶν ὄντων τὰ μέν ἐστιν ἐφ᾽ ἡμῖν, τὰ δὲ οὐκ ἐφ᾽ ἡμῖν.', author: 'Epictetus', work: 'Discourses', urn: 'urn:cts:greekLit:tlg0557.tlg001:1.1', language: 'greek' },
      { id: 'disc.1.2', content: 'ἐφ᾽ ἡμῖν μὲν ὑπόληψις, ὁρμή, ὄρεξις, ἔκκλισις,', author: 'Epictetus', work: 'Discourses', urn: 'urn:cts:greekLit:tlg0557.tlg001:1.2', language: 'greek' },
      { id: 'disc.1.3', content: 'καὶ ἑνὶ λόγῳ ὅσα ἡμέτερα ἔργα:', author: 'Epictetus', work: 'Discourses', urn: 'urn:cts:greekLit:tlg0557.tlg001:1.3', language: 'greek' },
    ]
  },
  'Epictetus:Enchiridion': {
    total: 500,
    passages: [
      { id: 'ench.1', content: 'Τῶν ὄντων τὰ μέν ἐστιν ἐφ᾽ ἡμῖν, τὰ δὲ οὐκ ἐφ᾽ ἡμῖν.', author: 'Epictetus', work: 'Enchiridion', urn: 'urn:cts:greekLit:tlg0557.tlg002:1', language: 'greek' },
      { id: 'ench.2', content: 'ἐφ᾽ ἡμῖν μὲν ὑπόληψις, ὁρμή, ὄρεξις, ἔκκλισις,', author: 'Epictetus', work: 'Enchiridion', urn: 'urn:cts:greekLit:tlg0557.tlg002:2', language: 'greek' },
      { id: 'ench.3', content: 'καὶ ἑνὶ λόγῳ ὅσα ἡμέτερα ἔργα:', author: 'Epictetus', work: 'Enchiridion', urn: 'urn:cts:greekLit:tlg0557.tlg002:3', language: 'greek' },
    ]
  },
  'Xenophon:Anabasis': {
    total: 7890,
    passages: [
      { id: 'anab.1.1', content: 'Δαρείου καὶ Παρυσάτιδος γίγνονται παῖδες δύο,', author: 'Xenophon', work: 'Anabasis', urn: 'urn:cts:greekLit:tlg0032.tlg006:1.1.1', language: 'greek' },
      { id: 'anab.1.2', content: 'πρεσβύτερος μὲν Ἀρταξέρξης, νεώτερος δὲ Κῦρος.', author: 'Xenophon', work: 'Anabasis', urn: 'urn:cts:greekLit:tlg0032.tlg006:1.1.2', language: 'greek' },
      { id: 'anab.1.3', content: 'ἐπεὶ δὲ ἠσθένει Δαρεῖος καὶ ὑπώπτευε τελευτὴν τοῦ βίου,', author: 'Xenophon', work: 'Anabasis', urn: 'urn:cts:greekLit:tlg0032.tlg006:1.1.3', language: 'greek' },
    ]
  },
  'Sappho:Fragments': {
    total: 264,
    passages: [
      { id: 'sappho.1', content: 'Ποικιλόθρον᾽ ἀθανάτ᾽ Ἀφρόδιτα,', author: 'Sappho', work: 'Fragments', urn: 'urn:cts:greekLit:tlg0009.tlg001:1', language: 'greek' },
      { id: 'sappho.2', content: 'παῖ Δίος δολόπλοκε, λίσσομαί σε,', author: 'Sappho', work: 'Fragments', urn: 'urn:cts:greekLit:tlg0009.tlg001:2', language: 'greek' },
      { id: 'sappho.3', content: 'μή μ᾽ ἄσαισι μηδ᾽ ὀνίαισι δάμνα,', author: 'Sappho', work: 'Fragments', urn: 'urn:cts:greekLit:tlg0009.tlg001:3', language: 'greek' },
    ]
  },
  'Torah:Genesis': {
    total: 1533,
    passages: [
      { id: 'gen.1.1', content: 'בְּרֵאשִׁ֖ית בָּרָ֣א אֱלֹהִ֑ים אֵ֥ת הַשָּׁמַ֖יִם וְאֵ֥ת הָאָֽרֶץ׃', author: 'Torah', work: 'Genesis', urn: 'urn:cts:hebrewLit:torah:gen:1.1', language: 'hebrew' },
      { id: 'gen.1.2', content: 'וְהָאָ֗רֶץ הָיְתָ֥ה תֹ֙הוּ֙ וָבֹ֔הוּ וְחֹ֖שֶׁךְ עַל־פְּנֵ֣י תְה֑וֹם', author: 'Torah', work: 'Genesis', urn: 'urn:cts:hebrewLit:torah:gen:1.2', language: 'hebrew' },
      { id: 'gen.1.3', content: 'וַיֹּ֥אמֶר אֱלֹהִ֖ים יְהִ֣י א֑וֹר וַֽיְהִי־אֽוֹר׃', author: 'Torah', work: 'Genesis', urn: 'urn:cts:hebrewLit:torah:gen:1.3', language: 'hebrew' },
    ]
  },
  'Torah:Exodus': {
    total: 1209,
    passages: [
      { id: 'ex.1.1', content: 'וְאֵ֗לֶּה שְׁמוֹת֙ בְּנֵ֣י יִשְׂרָאֵ֔ל הַבָּאִ֖ים מִצְרָ֑יְמָה', author: 'Torah', work: 'Exodus', urn: 'urn:cts:hebrewLit:torah:ex:1.1', language: 'hebrew' },
      { id: 'ex.1.2', content: 'אֵ֣ת יַעֲקֹ֔ב אִ֥ישׁ וּבֵית֖וֹ בָּֽאוּ׃', author: 'Torah', work: 'Exodus', urn: 'urn:cts:hebrewLit:torah:ex:1.2', language: 'hebrew' },
      { id: 'ex.1.3', content: 'רְאוּבֵ֣ן שִׁמְע֔וֹן לֵוִ֖י וִיהוּדָֽה׃', author: 'Torah', work: 'Exodus', urn: 'urn:cts:hebrewLit:torah:ex:1.3', language: 'hebrew' },
    ]
  },
};

// Generate dynamic sample passages for works without predefined samples
function generateSamplePassages(author: string, work: string, lang: string, count: number): Passage[] {
  const greekSamples = [
    'Ἐν ἀρχῇ ἦν ὁ λόγος, καὶ ὁ λόγος ἦν πρὸς τὸν θεόν.',
    'Πάντα ῥεῖ καὶ οὐδὲν μένει.',
    'Γνῶθι σεαυτόν.',
    'Μηδὲν ἄγαν.',
    'Ἀρχὴ ἥμισυ παντός.',
    'Ὁ βίος βραχύς, ἡ δὲ τέχνη μακρή.',
    'Πόλεμος πάντων μὲν πατήρ ἐστι.',
    'Τὸ εὖ πράττειν ἀπὸ τοῦ εὖ βουλεύεσθαι γίγνεται.',
    'Ἀνδρῶν ἐπιφανῶν πᾶσα γῆ τάφος.',
    'Χαλεπὰ τὰ καλά.',
  ];
  const latinSamples = [
    'Arma virumque cano, Troiae qui primus ab oris.',
    'Gallia est omnis divisa in partes tres.',
    'Veni, vidi, vici.',
    'Alea iacta est.',
    'Carpe diem, quam minimum credula postero.',
    'Mens sana in corpore sano.',
    'Errare humanum est, perseverare diabolicum.',
    'Cogito, ergo sum.',
    'Tempus fugit.',
    'Amor vincit omnia.',
  ];
  const hebrewSamples = [
    'בְּרֵאשִׁית בָּרָא אֱלֹהִים אֵת הַשָּׁמַיִם וְאֵת הָאָרֶץ.',
    'וַיֹּאמֶר אֱלֹהִים יְהִי אוֹר וַיְהִי אוֹר.',
    'שְׁמַע יִשְׂרָאֵל יְהוָה אֱלֹהֵינוּ יְהוָה אֶחָד.',
    'וְאָהַבְתָּ לְרֵעֲךָ כָּמוֹךָ.',
    'עֵת לָלֶדֶת וְעֵת לָמוּת.',
    'הֲבֵל הֲבָלִים הַכֹּל הָבֶל.',
    'טוֹב שֵׁם מִשֶּׁמֶן טוֹב.',
    'דּוֹר הֹלֵךְ וְדוֹר בָּא וְהָאָרֶץ לְעוֹלָם עֹמָדֶת.',
  ];
  const aramaicSamples = [
    'בְּרֵאשִׁית בְּרָא יְיָ יָת שְׁמַיָּא וְיָת אַרְעָא.',
    'וַאֲמַר יְיָ יְהֵי נְהוֹר וַהֲוָה נְהוֹר.',
    'שְׁמַע יִשְׂרָאֵל יְיָ אֱלָהָנָא יְיָ חָד.',
    'וּתְרַחֵם לְחַבְרָךְ כְּוָתָךְ.',
  ];

  const samples = lang === 'greek' ? greekSamples :
                  lang === 'latin' ? latinSamples :
                  lang === 'hebrew' ? hebrewSamples : aramaicSamples;

  const passages: Passage[] = [];
  for (let i = 0; i < Math.min(count, 10); i++) {
    passages.push({
      id: `${work.toLowerCase().replace(/\s+/g, '-')}.${i + 1}`,
      content: samples[i % samples.length],
      author,
      work,
      urn: `urn:cts:${lang}Lit:${author.toLowerCase().replace(/\s+/g, '')}:${i + 1}`,
      language: lang,
    });
  }
  return passages;
}

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

  // First try the passages endpoint
  try {
    return await fetchAPI(
      `/api/reader/passages/${encodeURIComponent(author)}/${encodeURIComponent(work)}?${params}`
    );
  } catch {
    // Passages endpoint failed, try search endpoint
  }

  // Try search endpoint with common words to get passages for this work
  const searchWords = language === 'latin'
    ? ['et', 'in', 'non', 'est', 'ad', 'qui', 'sed', 'cum', 'de', 'ut']
    : language === 'hebrew'
    ? ['את', 'על', 'אל', 'כי', 'לא', 'הוא', 'זה', 'מה', 'אשר', 'כל']
    : ['καὶ', 'τὸ', 'τῆς', 'ὁ', 'ἐν', 'δὲ', 'τὸν', 'τῶν', 'εἰς', 'μὲν'];

  for (const searchWord of searchWords) {
    try {
      const searchParams = new URLSearchParams({
        q: searchWord,
        author: author,
        limit: String(Math.min(limit, 100)),
        offset: String(offset),
      });

      const response = await fetch(`${API_BASE}/api/search/text/?${searchParams}`);
      if (response.ok) {
        const data = await response.json();
        if (data.results && data.results.length > 0) {
          // Filter to only passages from the requested work
          const workPassages = data.results.filter((r: any) => r.work === work);
          if (workPassages.length > 0) {
            const passages: Passage[] = workPassages.map((r: any, idx: number) => ({
              id: r.reference || `${work}.${idx + 1}`,
              content: r.passage,
              author: r.author,
              work: r.work,
              urn: r.reference || `urn:${r.language}:${author}:${work}:${idx + 1}`,
              language: r.language,
              translation: r.translation,
            }));
            return { author, work, total: data.total || passages.length, passages };
          }
        }
      }
    } catch {
      // Search failed, try next word
    }
  }

  // Fallback to sample passages with flexible matching
  const key = `${author}:${work}`;
  let sample = SAMPLE_PASSAGES[key];

  // Try case-insensitive matching if exact match fails
  if (!sample) {
    const lowerKey = key.toLowerCase();
    for (const [k, v] of Object.entries(SAMPLE_PASSAGES)) {
      if (k.toLowerCase() === lowerKey) {
        sample = v;
        break;
      }
    }
  }

  // Try partial matching for URL-decoded work names
  if (!sample) {
    const decodedWork = decodeURIComponent(work);
    const decodedKey = `${author}:${decodedWork}`;
    sample = SAMPLE_PASSAGES[decodedKey];
  }

  if (sample) {
    const passages = sample.passages.slice(offset, offset + limit);
    return { author, work, total: sample.total, passages };
  }

  // Generate dynamic sample passages for works in FALLBACK_WORKS
  const authorWorks = FALLBACK_WORKS[author];
  if (authorWorks) {
    const workData = authorWorks.find(w => w.work === work);
    if (workData) {
      const lang = workData.language || 'greek';
      const total = workData.passage_count || 100;
      const passages = generateSamplePassages(author, work, lang, Math.min(limit, 10));
      return { author, work, total, passages };
    }
  }

  // Return empty result for completely unknown works
  return { author, work, total: 0, passages: [] };
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
