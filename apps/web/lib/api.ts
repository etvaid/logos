/**
 * LOGOS API Client
 * Connects frontend to Railway backend
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://logos-production-ef2b.up.railway.app';

interface SearchResult {
  urn: string;
  content: string;
  translation_preview: string;
  similarity: number;
  author: string;
  work: string;
  language: string;
  section?: string;
}

interface TranslationRequest {
  text: string;
  language: 'grc' | 'lat';
  style: 'literal' | 'literary' | 'student';
  include_notes?: boolean;
}

interface TranslationResponse {
  original: string;
  translation: string;
  style: string;
  language: string;
  notes?: Record<string, any>;
  confidence: number;
  model: string;
}

interface Discovery {
  id: number;
  order_level: 1 | 2 | 3 | 4;
  pattern_type: string;
  hypothesis: string;
  description: string;
  confidence: number;
  novelty_score: number;
  statistical_significance: string;
  evidence: Record<string, any>[];
  supporting_passages: string[];
}

interface ResearchResponse {
  question: string;
  answer: string;
  citations: Array<{
    urn: string;
    text: string;
    relevance: number;
    author: string;
    work: string;
  }>;
  confidence: number;
  further_reading: string[];
}

interface ParseResult {
  word: string;
  lemma: string;
  language: string;
  part_of_speech: string;
  morphology: Record<string, string>;
  definition: string;
  frequency?: number;
  examples?: string[];
}

interface IntertextResult {
  source_urn: string;
  target_urn: string;
  source_text: string;
  target_text: string;
  source_translation: string;
  target_translation: string;
  relationship_type: string;
  confidence: number;
  evidence: string[];
}

interface OutreachContact {
  id: number;
  name: string;
  email: string;
  institution: string;
  specialty: string;
  status: string;
  template: string;
}

interface DashboardMetrics {
  users_total: number;
  users_today: number;
  users_growth: number;
  searches_today: number;
  translations_today: number;
  discoveries_total: number;
  content_pending: number;
}

class LogosAPI {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE) {
    this.baseUrl = baseUrl;
  }

  private async fetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  // ============ SEARCH ============
  async search(query: string, options?: {
    lang?: string[];
    author?: string;
    genre?: string;
    limit?: number;
  }): Promise<{ results: SearchResult[]; total: number }> {
    const params = new URLSearchParams({ q: query });
    if (options?.lang) options.lang.forEach(l => params.append('lang', l));
    if (options?.author) params.append('author', options.author);
    if (options?.genre) params.append('genre', options.genre);
    if (options?.limit) params.append('limit', options.limit.toString());

    return this.fetch(`/api/search/?${params}`);
  }

  async getSearchSuggestions(query: string): Promise<{ suggestions: string[] }> {
    return this.fetch(`/api/search/suggestions?q=${encodeURIComponent(query)}`);
  }

  async getTrendingSearches(): Promise<{ trending: Array<{ query: string; searches: number }> }> {
    return this.fetch('/api/search/trending');
  }

  // ============ TRANSLATION ============
  async translate(request: TranslationRequest): Promise<TranslationResponse> {
    return this.fetch('/api/translate/', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async getTranslationStyles(): Promise<{ styles: Array<{ id: string; name: string; description: string; best_for: string }> }> {
    return this.fetch('/api/translate/styles');
  }

  // ============ TEXTS ============
  async getText(urn: string): Promise<{
    urn: string;
    content: string;
    language: string;
    author?: string;
    work?: string;
    section?: string;
  }> {
    return this.fetch(`/api/texts/${encodeURIComponent(urn)}`);
  }

  async listAuthors(language?: string): Promise<Array<{
    id: number;
    name_en: string;
    name_original?: string;
    language: string;
    era?: string;
    works_count: number;
  }>> {
    const params = language ? `?language=${language}` : '';
    return this.fetch(`/api/texts/authors${params}`);
  }

  async listWorks(options?: { author_id?: number; language?: string }): Promise<Array<{
    id: number;
    urn: string;
    title_en: string;
    author: string;
    language: string;
    genre?: string;
    word_count?: number;
  }>> {
    const params = new URLSearchParams();
    if (options?.author_id) params.append('author_id', options.author_id.toString());
    if (options?.language) params.append('language', options.language);
    return this.fetch(`/api/texts/works?${params}`);
  }

  // ============ INTERTEXTUALITY ============
  async getIntertexts(urn: string, options?: {
    direction?: 'source' | 'target' | 'both';
    min_confidence?: number;
  }): Promise<{ urn: string; intertexts: IntertextResult[]; total: number }> {
    const params = new URLSearchParams();
    if (options?.direction) params.append('direction', options.direction);
    if (options?.min_confidence) params.append('min_confidence', options.min_confidence.toString());
    return this.fetch(`/api/intertexts/${encodeURIComponent(urn)}?${params}`);
  }

  async discoverIntertexts(urn: string): Promise<{ urn: string; status: string; message: string }> {
    return this.fetch('/api/intertexts/discover', {
      method: 'POST',
      body: JSON.stringify({ urn }),
    });
  }

  // ============ DISCOVERY ============
  async getDiscoveries(options?: {
    order?: number;
    min_confidence?: number;
    min_novelty?: number;
    limit?: number;
  }): Promise<{ discoveries: Discovery[]; total: number }> {
    const params = new URLSearchParams();
    if (options?.order) params.append('order', options.order.toString());
    if (options?.min_confidence) params.append('min_confidence', options.min_confidence.toString());
    if (options?.min_novelty) params.append('min_novelty', options.min_novelty.toString());
    if (options?.limit) params.append('limit', options.limit.toString());
    return this.fetch(`/api/discovery/patterns?${params}`);
  }

  async generateHypothesis(options?: {
    focus_area?: string;
    min_order?: number;
  }): Promise<{ status: string; message: string }> {
    return this.fetch('/api/discovery/hypothesis', {
      method: 'POST',
      body: JSON.stringify(options),
    });
  }

  async getOrderLevels(): Promise<{ orders: Array<{ level: number; name: string; description: string; example: string; novelty: string }> }> {
    return this.fetch('/api/discovery/orders');
  }

  // ============ RESEARCH ============
  async askResearchQuestion(question: string, context?: string): Promise<ResearchResponse> {
    return this.fetch('/api/research/ask', {
      method: 'POST',
      body: JSON.stringify({ question, context, include_citations: true }),
    });
  }

  async generateBibliography(topic: string, style: string = 'chicago'): Promise<{
    topic: string;
    sources: Array<{ citation: string; type: string }>;
  }> {
    return this.fetch(`/api/research/bibliography?topic=${encodeURIComponent(topic)}&style=${style}`);
  }

  // ============ MORPHOLOGY ============
  async parseWord(word: string, lang: 'grc' | 'lat' = 'grc'): Promise<ParseResult> {
    return this.fetch(`/api/parse/${encodeURIComponent(word)}?lang=${lang}`);
  }

  async batchParse(words: string[], lang: 'grc' | 'lat' = 'grc'): Promise<{ words: ParseResult[] }> {
    return this.fetch('/api/parse/batch', {
      method: 'POST',
      body: JSON.stringify({ words, lang }),
    });
  }

  // ============ PROSODY ============
  async scanMeter(text: string, meter?: string): Promise<{
    text: string;
    meter: string;
    scansion: string;
    feet: string[];
    caesura?: string;
    notes: string[];
  }> {
    return this.fetch('/api/prosody/scan', {
      method: 'POST',
      body: JSON.stringify({ text, meter: meter || 'auto' }),
    });
  }

  // ============ ETYMOLOGY ============
  async getEtymology(word: string, lang: 'grc' | 'lat' = 'grc'): Promise<{
    word: string;
    etymology: Array<{ language: string; form: string; meaning: string; period?: string }>;
    cognates: Array<{ language: string; word: string; meaning: string }>;
    semantic_development: string;
  }> {
    return this.fetch(`/api/etymology/${encodeURIComponent(word)}?lang=${lang}`);
  }

  // ============ LEARNING ============
  async getFlashcards(limit: number = 20): Promise<{ flashcards: Array<{
    id: number;
    word: string;
    language: string;
    definition: string;
    due: boolean;
  }>; total_due: number }> {
    return this.fetch(`/api/learn/flashcards?limit=${limit}`);
  }

  async submitReview(cardId: number, quality: number): Promise<{ message: string }> {
    return this.fetch(`/api/learn/flashcards/review?card_id=${cardId}&quality=${quality}`, {
      method: 'POST',
    });
  }

  async getProgress(): Promise<{
    vocabulary_mastered: number;
    passages_read: number;
    exercises_completed: number;
    streak_days: number;
    xp_total: number;
    level: number;
    achievements: string[];
  }> {
    return this.fetch('/api/learn/progress');
  }

  // ============ AUDIO ============
  async getPronunciation(text: string, style: 'classical' | 'ecclesiastical' | 'reconstructed' = 'classical', lang: 'grc' | 'lat' = 'grc'): Promise<{
    text: string;
    ipa: string;
    audio_url: string;
    notes: string;
  }> {
    const params = new URLSearchParams({ text, style, language: lang });
    return this.fetch(`/api/audio/pronounce?${params}`);
  }

  // ============ ADMIN ============
  async getMetrics(): Promise<DashboardMetrics> {
    return this.fetch('/api/admin/metrics');
  }

  async getContentQueue(status?: string): Promise<{
    content: Array<{
      id: number;
      content_type: string;
      title: string;
      content: string;
      seo_score: number;
      status: string;
    }>;
    pending: number;
  }> {
    const params = status ? `?status=${status}` : '';
    return this.fetch(`/api/admin/content${params}`);
  }

  async approveContent(contentId: number): Promise<{ message: string }> {
    return this.fetch(`/api/admin/content/${contentId}/approve`, { method: 'POST' });
  }

  async getOutreachContacts(): Promise<{ contacts: OutreachContact[]; total: number }> {
    return this.fetch('/api/admin/outreach');
  }

  async sendOutreachEmail(contactId: number, customize?: string): Promise<{ message: string }> {
    return this.fetch(`/api/admin/outreach/${contactId}/send`, {
      method: 'POST',
      body: JSON.stringify({ customize }),
    });
  }

  async getAnalytics(period: string = '7d'): Promise<{
    metrics: Record<string, number[]>;
    top_searches: string[];
    top_texts: string[];
  }> {
    return this.fetch(`/api/admin/analytics?period=${period}`);
  }

  // ============ SOCIAL ============
  async postTweet(content: string): Promise<{ success: boolean; tweet_id?: string; url?: string; message: string }> {
    return this.fetch('/api/social/twitter/post', {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
  }

  async postThread(tweets: string[]): Promise<{ success: boolean; thread_length?: number; message: string }> {
    return this.fetch('/api/social/twitter/thread', {
      method: 'POST',
      body: JSON.stringify({ tweets }),
    });
  }

  async verifyTwitter(): Promise<{ connected: boolean; account?: string; message: string }> {
    return this.fetch('/api/social/twitter/verify');
  }

  // ============ AUTH ============
  async login(email: string, password: string): Promise<{
    access_token: string;
    user: { id: number; email: string; name?: string; role: string };
  }> {
    return this.fetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(email: string, password: string, name?: string): Promise<{
    access_token: string;
    user: { id: number; email: string; name?: string; role: string };
  }> {
    return this.fetch('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    });
  }

  // ============ HEALTH ============
  async health(): Promise<{ status: string; service: string }> {
    return this.fetch('/health');
  }
}

export const api = new LogosAPI();
export type {
  SearchResult,
  TranslationRequest,
  TranslationResponse,
  Discovery,
  ResearchResponse,
  ParseResult,
  IntertextResult,
  OutreachContact,
  DashboardMetrics,
};
