/**
 * Vector Operations Module
 * Provides embedding generation and similarity search capabilities.
 */

export {
  type EmbeddingResult,
  type SimilarityResult,
  type VectorProvider,
  type ProviderType,
  OpenAIProvider,
  LocalProvider,
  createVectorProvider,
  getVectorProvider,
  cosineSimilarity,
  averageVectors,
} from './provider';
