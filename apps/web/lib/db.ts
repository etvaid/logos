import Database from 'better-sqlite3';
import path from 'path';

let db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (!db) {
    const dbPath = path.join(process.cwd(), 'data', 'logos.db');
    db = new Database(dbPath);
    db.pragma('journal_mode = WAL');
  }
  return db;
}

export function getWord(form: string) {
  const db = getDb();
  let word = db.prepare('SELECT w.*, l.entry_full, l.senses FROM words w LEFT JOIN lexicon l ON l.word_id = w.id WHERE w.lemma = ?').get(form);
  if (!word) {
    const wf = db.prepare('SELECT word_id FROM word_forms WHERE form = ?').get(form) as any;
    if (wf) word = db.prepare('SELECT w.*, l.entry_full, l.senses FROM words w LEFT JOIN lexicon l ON l.word_id = w.id WHERE w.id = ?').get(wf.word_id);
  }
  return word || null;
}

export function getWordForms(wordId: number) { return getDb().prepare('SELECT * FROM word_forms WHERE word_id = ?').all(wordId); }
export function getMorphology(form: string) { return getDb().prepare('SELECT wf.*, w.lemma, w.pos, w.definition_short FROM word_forms wf JOIN words w ON wf.word_id = w.id WHERE wf.form = ?').all(form); }
export function getWorks(language?: string) { if (language) return getDb().prepare('SELECT w.*, a.name as author_name FROM works w JOIN authors a ON w.author_id = a.id WHERE w.language = ?').all(language); return getDb().prepare('SELECT w.*, a.name as author_name FROM works w JOIN authors a ON w.author_id = a.id').all(); }
export function getWork(id: number) { return getDb().prepare('SELECT w.*, a.name as author_name FROM works w JOIN authors a ON w.author_id = a.id WHERE w.id = ?').get(id); }
export function getWorkStructure(workId: number) { const books = getDb().prepare('SELECT * FROM books WHERE work_id = ? ORDER BY book_number').all(workId) as any[]; for (const book of books) book.chapters = getDb().prepare('SELECT * FROM chapters WHERE book_id = ? ORDER BY chapter_number').all(book.id); return books; }
export function getWorkFullText(workId: number) { const passages = getDb().prepare('SELECT text_original, translation FROM passages WHERE work_id = ? ORDER BY sequence_num').all(workId) as any[]; return { text: passages.map(p => p.text_original).join('\n\n'), translation: passages.map(p => p.translation).filter(Boolean).join('\n\n') }; }
export function searchPassages(query: string, limit = 50) { try { return getDb().prepare('SELECT p.*, w.title as work_title, a.name as author_name FROM passages p JOIN works w ON p.work_id = w.id JOIN authors a ON w.author_id = a.id WHERE p.text_original LIKE ? OR p.translation LIKE ? LIMIT ?').all(`%${query}%`, `%${query}%`, limit); } catch { return []; } }
export function getAuthors(era?: string) { if (era) return getDb().prepare('SELECT * FROM authors WHERE era = ?').all(era); return getDb().prepare('SELECT * FROM authors').all(); }
export function getAuthor(id: number) { return getDb().prepare('SELECT * FROM authors WHERE id = ?').get(id); }
export function getAuthorConnections() { return getDb().prepare('SELECT ac.*, a1.name as source_name, a1.era as source_era, a2.name as target_name, a2.era as target_era FROM author_connections ac JOIN authors a1 ON ac.source_id = a1.id JOIN authors a2 ON ac.target_id = a2.id').all(); }
export function getTimelineEvents(start?: number, end?: number) { let sql = 'SELECT * FROM timeline_events WHERE 1=1'; const params: number[] = []; if (start !== undefined) { sql += ' AND year >= ?'; params.push(start); } if (end !== undefined) { sql += ' AND year <= ?'; params.push(end); } return getDb().prepare(sql + ' ORDER BY year').all(...params); }
export function getLifeContext(era: string, region?: string) { let sql = 'SELECT * FROM life_contexts WHERE era = ?'; const params: string[] = [era]; if (region) { sql += ' AND region = ?'; params.push(region); } return getDb().prepare(sql).all(...params); }
export function getStats() { const db = getDb(); return { passages: (db.prepare('SELECT COUNT(*) as c FROM passages').get() as any)?.c || 0, words: (db.prepare('SELECT COUNT(*) as c FROM words').get() as any)?.c || 0, authors: (db.prepare('SELECT COUNT(*) as c FROM authors').get() as any)?.c || 0, works: (db.prepare('SELECT COUNT(*) as c FROM works').get() as any)?.c || 0 }; }
export function getUserProgress(userId: string) { return getDb().prepare('SELECT * FROM user_progress WHERE user_id = ?').all(userId); }
