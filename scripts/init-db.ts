import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const dataDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

const db = new Database(path.join(dataDir, 'logos.db'));
console.log('Initializing LOGOS database...');

db.exec(`
  CREATE TABLE IF NOT EXISTS authors (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, name_greek TEXT, name_latin TEXT, birth_year INTEGER, death_year INTEGER, era TEXT, language TEXT, biography TEXT);
  CREATE TABLE IF NOT EXISTS works (id INTEGER PRIMARY KEY AUTOINCREMENT, author_id INTEGER REFERENCES authors(id), title TEXT NOT NULL, title_original TEXT, language TEXT, genre TEXT, total_words INTEGER, total_books INTEGER);
  CREATE TABLE IF NOT EXISTS passages (id INTEGER PRIMARY KEY AUTOINCREMENT, work_id INTEGER REFERENCES works(id), book_num INTEGER, chapter_num INTEGER, text_original TEXT NOT NULL, text_normalized TEXT, translation TEXT, word_count INTEGER, sequence_num INTEGER);
  CREATE TABLE IF NOT EXISTS words (id INTEGER PRIMARY KEY AUTOINCREMENT, lemma TEXT NOT NULL UNIQUE, language TEXT, pos TEXT, frequency INTEGER DEFAULT 0, definition_short TEXT, definition_full TEXT);
  CREATE TABLE IF NOT EXISTS word_forms (id INTEGER PRIMARY KEY AUTOINCREMENT, word_id INTEGER REFERENCES words(id), form TEXT NOT NULL, parsing TEXT, frequency INTEGER DEFAULT 0);
  CREATE TABLE IF NOT EXISTS lexicon (id INTEGER PRIMARY KEY AUTOINCREMENT, word_id INTEGER REFERENCES words(id), entry_full TEXT, senses TEXT);
  CREATE TABLE IF NOT EXISTS author_connections (id INTEGER PRIMARY KEY AUTOINCREMENT, source_id INTEGER REFERENCES authors(id), target_id INTEGER REFERENCES authors(id), connection_type TEXT, strength REAL DEFAULT 0.5);
  CREATE TABLE IF NOT EXISTS timeline_events (id INTEGER PRIMARY KEY AUTOINCREMENT, year INTEGER NOT NULL, title TEXT NOT NULL, description TEXT, category TEXT);
  CREATE TABLE IF NOT EXISTS life_contexts (id INTEGER PRIMARY KEY AUTOINCREMENT, era TEXT, region TEXT, social_class TEXT, occupation TEXT, description TEXT, daily_life TEXT);
  CREATE TABLE IF NOT EXISTS user_progress (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id TEXT NOT NULL, word_id INTEGER, familiarity INTEGER DEFAULT 0, xp INTEGER DEFAULT 0, streak INTEGER DEFAULT 0);
  CREATE INDEX IF NOT EXISTS idx_passages_work ON passages(work_id);
  CREATE INDEX IF NOT EXISTS idx_word_forms_form ON word_forms(form);
`);

const authors = [
  { name: 'Homer', era: 'archaic', language: 'greek', birth_year: -800 },
  { name: 'Hesiod', era: 'archaic', language: 'greek', birth_year: -750 },
  { name: 'Sappho', era: 'archaic', language: 'greek', birth_year: -630 },
  { name: 'Herodotus', era: 'classical', language: 'greek', birth_year: -484 },
  { name: 'Plato', era: 'classical', language: 'greek', birth_year: -428 },
  { name: 'Aristotle', era: 'classical', language: 'greek', birth_year: -384 },
  { name: 'Virgil', era: 'imperial', language: 'latin', birth_year: -70 },
  { name: 'Horace', era: 'imperial', language: 'latin', birth_year: -65 },
  { name: 'Ovid', era: 'imperial', language: 'latin', birth_year: -43 },
  { name: 'Cicero', era: 'imperial', language: 'latin', birth_year: -106 },
  { name: 'Caesar', era: 'imperial', language: 'latin', birth_year: -100 },
  { name: 'Seneca', era: 'imperial', language: 'latin', birth_year: -4 },
  { name: 'Augustine', era: 'late_antique', language: 'latin', birth_year: 354 },
];

const insertAuthor = db.prepare('INSERT OR IGNORE INTO authors (name, era, language, birth_year) VALUES (?, ?, ?, ?)');
for (const a of authors) insertAuthor.run(a.name, a.era, a.language, a.birth_year);

const works = [
  { author: 'Homer', title: 'Iliad', language: 'greek', genre: 'epic', words: 115000 },
  { author: 'Homer', title: 'Odyssey', language: 'greek', genre: 'epic', words: 87000 },
  { author: 'Plato', title: 'Republic', language: 'greek', genre: 'philosophy', words: 95000 },
  { author: 'Virgil', title: 'Aeneid', language: 'latin', genre: 'epic', words: 63000 },
  { author: 'Caesar', title: 'De Bello Gallico', language: 'latin', genre: 'history', words: 45000 },
  { author: 'Ovid', title: 'Metamorphoses', language: 'latin', genre: 'epic', words: 75000 },
];

const getAuthorId = db.prepare('SELECT id FROM authors WHERE name = ?');
const insertWork = db.prepare('INSERT OR IGNORE INTO works (author_id, title, language, genre, total_words) VALUES (?, ?, ?, ?, ?)');
for (const w of works) { const author = getAuthorId.get(w.author) as any; if (author) insertWork.run(author.id, w.title, w.language, w.genre, w.words); }

const passages = [
  { work: 'Iliad', text: 'Μῆνιν ἄειδε, θεά, Πηληϊάδεω Ἀχιλῆος', translation: 'Sing, goddess, the anger of Achilles son of Peleus' },
  { work: 'Iliad', text: 'οὐλομένην, ἣ μυρί᾽ Ἀχαιοῖς ἄλγε᾽ ἔθηκε', translation: 'the destructive anger which brought countless sorrows upon the Achaeans' },
  { work: 'Odyssey', text: 'Ἄνδρα μοι ἔννεπε, Μοῦσα, πολύτροπον', translation: 'Tell me, Muse, of the man of many ways' },
  { work: 'Aeneid', text: 'Arma virumque cano, Troiae qui primus ab oris', translation: 'I sing of arms and the man, who first from the shores of Troy' },
  { work: 'Republic', text: 'Κατέβην χθὲς εἰς Πειραιᾶ μετὰ Γλαύκωνος', translation: 'I went down yesterday to the Piraeus with Glaucon' },
  { work: 'De Bello Gallico', text: 'Gallia est omnis divisa in partes tres', translation: 'All Gaul is divided into three parts' },
];

const getWorkId = db.prepare('SELECT id FROM works WHERE title = ?');
const insertPassage = db.prepare('INSERT INTO passages (work_id, text_original, translation, sequence_num) VALUES (?, ?, ?, ?)');
let seq = 1;
for (const p of passages) { const work = getWorkId.get(p.work) as any; if (work) insertPassage.run(work.id, p.text, p.translation, seq++); }

const words = [
  { lemma: 'μῆνις', language: 'greek', pos: 'noun', definition: 'wrath, anger, fury' },
  { lemma: 'ἀείδω', language: 'greek', pos: 'verb', definition: 'to sing' },
  { lemma: 'θεά', language: 'greek', pos: 'noun', definition: 'goddess' },
  { lemma: 'ἀνήρ', language: 'greek', pos: 'noun', definition: 'man' },
  { lemma: 'λόγος', language: 'greek', pos: 'noun', definition: 'word, speech, reason' },
  { lemma: 'arma', language: 'latin', pos: 'noun', definition: 'arms, weapons' },
  { lemma: 'vir', language: 'latin', pos: 'noun', definition: 'man' },
  { lemma: 'cano', language: 'latin', pos: 'verb', definition: 'to sing' },
];

const insertWord = db.prepare('INSERT OR IGNORE INTO words (lemma, language, pos, definition_short) VALUES (?, ?, ?, ?)');
for (const w of words) insertWord.run(w.lemma, w.language, w.pos, w.definition);

const connections = [
  { source: 'Homer', target: 'Virgil', type: 'influence', strength: 0.95 },
  { source: 'Homer', target: 'Plato', type: 'influence', strength: 0.8 },
  { source: 'Plato', target: 'Aristotle', type: 'teacher_student', strength: 1.0 },
  { source: 'Plato', target: 'Cicero', type: 'influence', strength: 0.7 },
  { source: 'Cicero', target: 'Seneca', type: 'influence', strength: 0.5 },
  { source: 'Seneca', target: 'Augustine', type: 'influence', strength: 0.5 },
];

const insertConnection = db.prepare('INSERT INTO author_connections (source_id, target_id, connection_type, strength) VALUES (?, ?, ?, ?)');
for (const c of connections) { const s = getAuthorId.get(c.source) as any, t = getAuthorId.get(c.target) as any; if (s && t) insertConnection.run(s.id, t.id, c.type, c.strength); }

const events = [
  { year: -776, title: 'First Olympic Games', category: 'culture' },
  { year: -490, title: 'Battle of Marathon', category: 'military' },
  { year: -480, title: 'Battle of Thermopylae', category: 'military' },
  { year: -431, title: 'Peloponnesian War begins', category: 'military' },
  { year: -323, title: 'Death of Alexander', category: 'political' },
  { year: -44, title: 'Assassination of Caesar', category: 'political' },
  { year: 79, title: 'Eruption of Vesuvius', category: 'disaster' },
  { year: 476, title: 'Fall of Western Rome', category: 'political' },
];

const insertEvent = db.prepare('INSERT INTO timeline_events (year, title, category) VALUES (?, ?, ?)');
for (const e of events) insertEvent.run(e.year, e.title, e.category);

const contexts = [
  { era: 'classical', region: 'greece', social_class: 'citizen', occupation: 'farmer', daily_life: 'Rise at dawn, work olive groves and wheat fields, attend assembly.' },
  { era: 'imperial', region: 'rome', social_class: 'merchant', occupation: 'trader', daily_life: 'Trade goods at the forum, manage shipping contracts.' },
];

const insertContext = db.prepare('INSERT INTO life_contexts (era, region, social_class, occupation, daily_life) VALUES (?, ?, ?, ?, ?)');
for (const c of contexts) insertContext.run(c.era, c.region, c.social_class, c.occupation, c.daily_life);

console.log('Database initialized successfully!');
db.close();
