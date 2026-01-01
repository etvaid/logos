// LOGOS Type Definitions

// ============================================================================
// Corpus & Statistics
// ============================================================================

export interface CorpusStats {
  passages: number;
  authors: number;
  works: number;
  languages: Record<string, number>;
  translators: number;
  database: string;
}

// ============================================================================
// Authors & Works
// ============================================================================

export interface Author {
  author: string;
  language: string;
  passage_count: number;
  period?: string;
  genre?: string;
}

export interface Work {
  work: string;
  language: string;
  passage_count: number;
  author?: string;
}

export interface Passage {
  id: string;
  urn?: string;
  author: string;
  work: string;
  content: string;
  section: string;
  language: string;
}

// ============================================================================
// Search
// ============================================================================

export interface SearchResult {
  id: string;
  urn?: string;
  author: string;
  work: string;
  passage: string;
  reference: string;
  language: string;
}

export interface SearchResponse {
  query: string;
  total: number;
  count: number;
  results: SearchResult[];
  filters?: {
    language?: string;
    author?: string;
  };
}

// ============================================================================
// Translation
// ============================================================================

export interface TranslatorStyle {
  name: string;
  key: string;
  era: string;
  works_analyzed: number;
  words_analyzed: number;
  source: string;
}

export interface TranslationRequest {
  source_text: string;
  source_language: string;
  target_style: string;
  persona?: string;
  include_literal?: boolean;
}

export interface TranslationResponse {
  translation: string;
  style: string;
  ltqi?: {
    overall: number;
    grade: string;
    semantic_fidelity: number;
    stylistic_consistency: number;
    fluency: number;
  };
  literal_translation?: string;
  vibe?: {
    feeling: string;
    reads_like: string;
    era_flavor: string;
  };
}

// ============================================================================
// Word Analysis (SEMANTIA)
// ============================================================================

export interface WordContext {
  id: number;
  author: string;
  work: string;
  passage: string;
  reference: string;
  language: string;
}

export interface AuthorDistribution {
  author: string;
  count: number;
}

export interface WordAnalysis {
  word: string;
  frequency: number;
  sample_contexts: WordContext[];
  author_distribution: AuthorDistribution[];
  top_works: { work: string; count: number }[];
}

// ============================================================================
// Morphology
// ============================================================================

export interface Morphology {
  word: string;
  lemma: string;
  pos: string;
  case?: string;
  number?: string;
  gender?: string;
  tense?: string;
  mood?: string;
  voice?: string;
  definition: string;
  frequency?: number;
}

// ============================================================================
// Connectome
// ============================================================================

export interface ConnectomeNode {
  id: string;
  name: string;
  type: string;
  size?: number;
}

export interface ConnectomeEdge {
  source: string;
  target: string;
  weight?: number;
  type?: string;
}

export interface Connectome {
  nodes: ConnectomeNode[];
  edges: ConnectomeEdge[];
}

// ============================================================================
// Timeline (CHRONOS)
// ============================================================================

export interface TimelineEvent {
  id: string;
  year: number;
  title: string;
  description: string;
  type: 'author' | 'work' | 'event';
  language?: string;
}

// ============================================================================
// Learning
// ============================================================================

export interface LessonModule {
  id: string;
  title: string;
  description: string;
  level: number;
  language: 'greek' | 'latin';
  xp: number;
  completed?: boolean;
}

export interface UserProgress {
  level: number;
  xp: number;
  title: string;
  completedModules: string[];
}

// ============================================================================
// Presets
// ============================================================================

export interface TranslationPreset {
  id: string;
  name: string;
  description: string;
  icon: string;
  based_on: string;
  example: string;
  settings: Record<string, number>;
}

export interface Persona {
  id: string;
  name: string;
  icon: string;
  description: string;
  best_for: string;
}
