// LOGOS API Client
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

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://logos-backend-production-0d96.up.railway.app';

// ============================================================================
// Helper
// ============================================================================

async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
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
  return fetchAPI<CorpusStats>('/api/stats');
}

export async function getHealth(): Promise<{ status: string; passages: number }> {
  return fetchAPI('/health');
}

// ============================================================================
// Reader / Library
// ============================================================================

export async function getAuthors(): Promise<{ count: number; authors: Author[] }> {
  return fetchAPI('/api/reader/authors');
}

export async function getWorksByAuthor(author: string): Promise<{ author: string; count: number; works: Work[] }> {
  return fetchAPI(`/api/reader/works/${encodeURIComponent(author)}`);
}

export async function getPassages(
  author: string,
  work: string,
  limit = 100,
  offset = 0
): Promise<{ author: string; work: string; total: number; passages: Passage[] }> {
  return fetchAPI(`/api/reader/passages/${encodeURIComponent(author)}/${encodeURIComponent(work)}?limit=${limit}&offset=${offset}`);
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
  }
): Promise<SearchResponse> {
  const params = new URLSearchParams({ q: query });
  if (options?.language) params.append('language', options.language);
  if (options?.author) params.append('author', options.author);
  if (options?.limit) params.append('limit', String(options.limit));

  return fetchAPI(`/api/search?${params}`);
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
  return fetchAPI('/api/translate', {
    method: 'POST',
    body: JSON.stringify(request),
  });
}

export async function translateWithPreset(
  sourceText: string,
  presetId: string,
  sourceLanguage = 'greek',
  persona = 'curious'
): Promise<TranslationResponse> {
  const params = new URLSearchParams({
    source_text: sourceText,
    source_language: sourceLanguage,
    preset_id: presetId,
    persona: persona,
  });
  return fetchAPI(`/api/translate/with-preset?${params}`, { method: 'POST' });
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
