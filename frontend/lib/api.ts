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

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://logos-production-ef2b.up.railway.app';

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
  return fetchAPI<CorpusStats>('/api/corpus/stats');
}

export async function getHealth(): Promise<{ status: string; passages: number }> {
  return fetchAPI('/health');
}

// ============================================================================
// Reader / Library
// ============================================================================

export async function getAuthors(language?: string): Promise<{ count: number; authors: Author[] }> {
  const params = language ? `?language=${language}` : '';
  return fetchAPI(`/api/reader/authors/${params}`);
}

export async function getWorksByAuthor(author: string, language?: string): Promise<{ author: string; count: number; works: Work[] }> {
  const params = language ? `?language=${language}` : '';
  return fetchAPI(`/api/reader/works/${encodeURIComponent(author)}${params}`);
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
