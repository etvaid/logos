// LOGOS Utility Functions

import { clsx, type ClassValue } from 'clsx';

// ============================================================================
// Class Names
// ============================================================================

export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs);
}

// ============================================================================
// Formatting
// ============================================================================

export function formatNumber(num: number): string {
  if (num >= 1_000_000) {
    return `${(num / 1_000_000).toFixed(1)}M`;
  }
  if (num >= 1_000) {
    return `${(num / 1_000).toFixed(1)}K`;
  }
  return num.toLocaleString();
}

export function formatYear(year: number): string {
  if (year < 0) {
    return `${Math.abs(year)} BCE`;
  }
  return `${year} CE`;
}

// ============================================================================
// Language Helpers
// ============================================================================

export const LANGUAGES = {
  greek: { name: 'Greek', native: 'Ἑλληνικά', color: '#4A90D9' },
  latin: { name: 'Latin', native: 'Latīna', color: '#D94A4A' },
  hebrew: { name: 'Hebrew', native: 'עברית', color: '#4AD97A' },
  aramaic: { name: 'Aramaic', native: 'ארמית', color: '#D9A94A' },
  coptic: { name: 'Coptic', native: 'ⲙⲉⲧⲣⲉⲙⲛ̀ⲭⲏⲙⲓ', color: '#9A4AD9' },
} as const;

export function getLanguageColor(lang: string): string {
  const key = lang.toLowerCase() as keyof typeof LANGUAGES;
  return LANGUAGES[key]?.color || '#C9A962';
}

export function getLanguageName(lang: string): string {
  const key = lang.toLowerCase() as keyof typeof LANGUAGES;
  return LANGUAGES[key]?.name || lang;
}

// ============================================================================
// Text Processing
// ============================================================================

export function highlightSearchTerm(text: string, term: string): string {
  if (!term) return text;
  const regex = new RegExp(`(${escapeRegex(term)})`, 'gi');
  return text.replace(regex, '<mark class="bg-[#C9A962]/30 text-[#C9A962]">$1</mark>');
}

export function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
}

export function extractSnippet(text: string, query: string, contextLength = 100): string {
  const lowerText = text.toLowerCase();
  const lowerQuery = query.toLowerCase();
  const pos = lowerText.indexOf(lowerQuery);

  if (pos === -1) {
    return text.slice(0, contextLength * 2) + (text.length > contextLength * 2 ? '...' : '');
  }

  const start = Math.max(0, pos - contextLength);
  const end = Math.min(text.length, pos + query.length + contextLength);

  let snippet = text.slice(start, end);
  if (start > 0) snippet = '...' + snippet;
  if (end < text.length) snippet = snippet + '...';

  return snippet;
}

// ============================================================================
// Word Analysis
// ============================================================================

export function cleanWord(word: string): string {
  return word.replace(/[.,;:!?'"()«»\[\]{}—–-]/g, '').trim();
}

export function isGreekWord(word: string): boolean {
  return /[\u0370-\u03FF\u1F00-\u1FFF]/.test(word);
}

export function isLatinWord(word: string): boolean {
  return /^[a-zA-ZāēīōūȳĀĒĪŌŪȲæœÆŒ]+$/.test(word);
}

export function isHebrewWord(word: string): boolean {
  return /[\u0590-\u05FF]/.test(word);
}

export function detectLanguage(word: string): string {
  if (isGreekWord(word)) return 'greek';
  if (isHebrewWord(word)) return 'hebrew';
  if (isLatinWord(word)) return 'latin';
  return 'unknown';
}

// Detect language of a full passage based on character composition
export function detectPassageLanguage(text: string): string {
  if (!text || text.trim().length === 0) return 'unknown';

  // Remove common punctuation and whitespace for analysis
  const cleanText = text.replace(/[\s.,;:!?—\-()[\]{}'"«»„""''·]/g, '');

  let greekChars = 0;
  let hebrewChars = 0;
  let latinChars = 0;
  let otherChars = 0;

  for (const char of cleanText) {
    const code = char.charCodeAt(0);

    // Greek ranges
    if ((code >= 0x0370 && code <= 0x03FF) || (code >= 0x1F00 && code <= 0x1FFF)) {
      greekChars++;
    }
    // Hebrew/Aramaic range
    else if (code >= 0x0590 && code <= 0x05FF) {
      hebrewChars++;
    }
    // Coptic range
    else if (code >= 0x2C80 && code <= 0x2CFF) {
      return 'coptic'; // If any Coptic, it's Coptic
    }
    // Basic Latin (ASCII letters)
    else if ((code >= 0x0041 && code <= 0x005A) || (code >= 0x0061 && code <= 0x007A)) {
      latinChars++;
    }
    // Extended Latin (macrons, etc.)
    else if (code >= 0x0100 && code <= 0x017F) {
      latinChars++;
    }
    else {
      otherChars++;
    }
  }

  const total = greekChars + hebrewChars + latinChars + otherChars;
  if (total === 0) return 'unknown';

  // Calculate percentages
  const greekPct = greekChars / total;
  const hebrewPct = hebrewChars / total;
  const latinPct = latinChars / total;

  // If >40% of characters are from a specific script, classify as that language
  if (greekPct > 0.4) return 'greek';
  if (hebrewPct > 0.4) return 'hebrew'; // Could be Aramaic too
  if (latinPct > 0.4) return 'latin'; // Could be English, Spanish, etc.

  // For passages with mostly Latin characters but no Greek/Hebrew,
  // assume it's a translation (English, Spanish, French, etc.)
  if (latinChars > greekChars && latinChars > hebrewChars) {
    return 'english'; // Generic translation marker
  }

  return 'unknown';
}

// ============================================================================
// Level System
// ============================================================================

export const LEVELS = [
  { level: 1, xp: 0, title: 'Novice' },
  { level: 2, xp: 100, title: 'Student' },
  { level: 3, xp: 300, title: 'Apprentice' },
  { level: 4, xp: 600, title: 'Scholar' },
  { level: 5, xp: 1000, title: 'Erudite' },
  { level: 6, xp: 1500, title: 'Sage' },
  { level: 7, xp: 2100, title: 'Master' },
  { level: 8, xp: 2800, title: 'Philosophus' },
] as const;

export function getLevelInfo(xp: number): { level: number; title: string; nextXp: number; progress: number } {
  let currentLevel: (typeof LEVELS)[number] = LEVELS[0];

  for (const l of LEVELS) {
    if (xp >= l.xp) {
      currentLevel = l;
    } else {
      break;
    }
  }

  const nextLevelIndex = LEVELS.findIndex((l) => l.level === currentLevel.level) + 1;
  const nextLevel = LEVELS[nextLevelIndex] || currentLevel;
  const xpForCurrent = currentLevel.xp;
  const xpForNext = nextLevel.xp;
  const progress = xpForNext > xpForCurrent ? ((xp - xpForCurrent) / (xpForNext - xpForCurrent)) * 100 : 100;

  return {
    level: currentLevel.level,
    title: currentLevel.title,
    nextXp: nextLevel.xp,
    progress,
  };
}

// ============================================================================
// Citation
// ============================================================================

export function formatCitation(author: string, work: string, section?: string): string {
  let citation = `${author}, ${work}`;
  if (section) citation += ` ${section}`;
  return citation;
}

export function formatCitationMLA(author: string, work: string, section?: string): string {
  return `${author}. "${work}"${section ? `, ${section}` : ''}. LOGOS Classical Texts Database.`;
}

// ============================================================================
// Time & Date
// ============================================================================

export function getCenturyLabel(year: number): string {
  const century = Math.ceil(Math.abs(year) / 100);
  const suffix = year < 0 ? ' BCE' : ' CE';
  const ordinal = getOrdinal(century);
  return `${ordinal} century${suffix}`;
}

function getOrdinal(n: number): string {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

// ============================================================================
// Storage
// ============================================================================

export function getStoredValue<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
}

export function setStoredValue<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage full or unavailable
  }
}

// ============================================================================
// Bookmarks
// ============================================================================

export interface Bookmark {
  id: string;
  author: string;
  work: string;
  section: string;
  passage: string;
  timestamp: number;
}

export function getBookmarks(): Bookmark[] {
  return getStoredValue<Bookmark[]>('logos_bookmarks', []);
}

export function addBookmark(bookmark: Omit<Bookmark, 'timestamp'>): void {
  const bookmarks = getBookmarks();
  bookmarks.unshift({ ...bookmark, timestamp: Date.now() });
  setStoredValue('logos_bookmarks', bookmarks.slice(0, 100)); // Keep max 100
}

export function removeBookmark(id: string): void {
  const bookmarks = getBookmarks().filter((b) => b.id !== id);
  setStoredValue('logos_bookmarks', bookmarks);
}
