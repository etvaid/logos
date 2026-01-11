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
  work_count?: number;
  works_count?: number;
  is_work?: boolean; // True for Hebrew/Aramaic/Coptic where "author" is actually a work
  period?: string;
  genre?: string;
  dates?: string;
}

export interface Work {
  title?: string;
  work: string;
  language: string;
  passage_count: number;
  author?: string;
  books?: number;
  genre?: string;
}

export interface Passage {
  id: string;
  urn?: string;
  author: string;
  work: string;
  content: string;
  passage?: string;
  section?: string;
  reference?: string;
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

// ============================================================================
// Token Annotations (Real Morphology)
// ============================================================================

export interface TokenAnnotation {
  id: number;
  urn: string;
  token_index: number;
  surface_form: string;
  lemma: string | null;
  pos: string | null;
  morphology_code: string | null;
  case_value: string | null;
  number_value: string | null;
  gender: string | null;
  tense: string | null;
  mood: string | null;
  voice: string | null;
  person: string | null;
  gloss: string | null;
  confidence: number;
  source: string;
}

// ============================================================================
// Evidence & Confidence
// ============================================================================

export interface GateResult {
  name: string;
  passed: boolean;
  score: number;
  threshold: number;
  details?: Record<string, unknown>;
}

export interface GateResults {
  entity_type: string;
  entity_id: string;
  gates: GateResult[];
  gates_passed: number;
  total_gates: number;
  metrics?: Record<string, unknown>;
  computed_at: string;
  pipeline_version: string;
}

export interface ConfidenceScore {
  entity_type: string;
  entity_id: string;
  score: number;
  tier: 'high' | 'medium' | 'low' | 'uncertain';
  components: Record<string, number>;
  computed_at: string;
  pipeline_version: string;
}

// ============================================================================
// Intertext Evidence
// ============================================================================

export interface MatchedPhrase {
  source: string;
  target: string;
  type: 'exact' | 'near' | 'semantic';
}

export interface IntertextEvidence {
  id: number;
  source_urn: string;
  target_urn: string;
  confidence_score: number;
  connection_type: 'quotation' | 'allusion' | 'parallel' | 'thematic';
  directionality: 'source_to_target' | 'target_to_source' | 'bidirectional' | 'uncertain';

  // Evidence components
  lexical_overlap: number;
  function_word_overlap: number;
  rare_word_overlap: number;
  semantic_similarity: number;
  ngram_overlap_2: number;
  ngram_overlap_3: number;
  ngram_overlap_4: number;
  syntax_similarity: number;

  // Matched content
  matched_phrases: MatchedPhrase[];
  shared_rare_words: string[];
  shared_ngrams: string[];

  // Falsification
  alternative_explanations: string[];
  confidence_notes: string;

  computed_at: string;
  pipeline_version: string;
}

// ============================================================================
// Semantic Search
// ============================================================================

export interface SemanticSearchResult {
  urn: string;
  author: string;
  work: string;
  section: string;
  content: string;
  language: string;
  similarity: number;
}

export interface SemanticSearchResponse {
  query: string;
  results: SemanticSearchResult[];
  count: number;
  search_type: 'semantic' | 'text';
}

// ============================================================================
// Q Pericope Evidence
// ============================================================================

export interface QPericodeEvidence {
  pericope_id: string;
  q_confidence: number;
  q_tier: 'certain' | 'probable' | 'possible' | 'uncertain';
  verbatim_agreement: number;
  order_agreement: number;
  mark_independence: number;
  style_consistency: number;
  parallel_urns: {
    matthew?: string;
    luke?: string;
  };
  shared_vocabulary: string[];
  distinctive_features: string[];
  thomas_parallels?: string[];
  didache_parallels?: string[];
  external_confidence?: number;
}

// ============================================================================
// Translation Quality
// ============================================================================

export interface TranslationQuality {
  id: number;
  translation_id: number;
  translator_name: string;
  source_urn: string;
  overall_score: number;
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  semantic_fidelity: number;
  style_consistency: number;
  fluency: number;
  cultural_accuracy: number;
  register_match: number;
  literalness: number;
  readability: number;
  genre: string;
  genre_baseline_deviation: number;
  issues: TranslationIssue[];
}

export interface TranslationIssue {
  type: 'omission' | 'interpolation' | 'semantic_anomaly' | 'terminology_inconsistency';
  location: string;
  severity: 'high' | 'medium' | 'low';
  description: string;
}

// ============================================================================
// Passage Payload (Precomputed)
// ============================================================================

export interface PassagePayload {
  urn: string;
  author: string;
  work: string;
  section: string;
  content: string;
  language: string;
  tokens: TokenAnnotation[];
  translations: {
    translator: string;
    text: string;
    quality_score?: number;
  }[];
  intertexts: {
    urn: string;
    snippet: string;
    confidence: number;
    type: string;
  }[];
  drift_stats?: {
    term: string;
    drift_score: number;
  }[];
}
