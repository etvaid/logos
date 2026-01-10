/**
 * Vector Provider Abstraction Layer
 * Supports multiple embedding providers with a unified interface.
 */

export interface EmbeddingResult {
  vector: number[];
  model: string;
  dimensions: number;
  usage?: {
    prompt_tokens: number;
    total_tokens: number;
  };
}

export interface SimilarityResult {
  id: string;
  score: number;
  metadata?: Record<string, unknown>;
}

export interface VectorProvider {
  name: string;
  dimensions: number;

  // Core operations
  embed(text: string): Promise<EmbeddingResult>;
  embedBatch(texts: string[]): Promise<EmbeddingResult[]>;

  // Similarity search (if provider supports it)
  search?(
    query: number[],
    collection: string,
    limit: number
  ): Promise<SimilarityResult[]>;
}

// OpenAI Provider
export class OpenAIProvider implements VectorProvider {
  name = 'openai';
  dimensions = 1536;
  private model = 'text-embedding-3-small';
  private apiKey: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.OPENAI_API_KEY || '';
    if (!this.apiKey) {
      console.warn('OpenAI API key not configured');
    }
  }

  async embed(text: string): Promise<EmbeddingResult> {
    const results = await this.embedBatch([text]);
    return results[0];
  }

  async embedBatch(texts: string[]): Promise<EmbeddingResult[]> {
    if (!this.apiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const response = await fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        input: texts,
        model: this.model,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI embedding error: ${response.statusText}`);
    }

    const data = await response.json();

    return data.data.map(
      (item: { embedding: number[]; index: number }, idx: number) => ({
        vector: item.embedding,
        model: this.model,
        dimensions: this.dimensions,
        usage: idx === 0 ? data.usage : undefined,
      })
    );
  }
}

// Local/Mock Provider (uses existing word_embeddings)
export class LocalProvider implements VectorProvider {
  name = 'local';
  dimensions = 300;

  async embed(text: string): Promise<EmbeddingResult> {
    // Return zero vector for local provider
    // Real implementation would use local model
    return {
      vector: new Array(this.dimensions).fill(0),
      model: 'local-mock',
      dimensions: this.dimensions,
    };
  }

  async embedBatch(texts: string[]): Promise<EmbeddingResult[]> {
    return Promise.all(texts.map((t) => this.embed(t)));
  }
}

// Provider factory
export type ProviderType = 'openai' | 'local' | 'auto';

export function createVectorProvider(type: ProviderType = 'auto'): VectorProvider {
  if (type === 'auto') {
    // Try OpenAI first, fall back to local
    if (process.env.OPENAI_API_KEY) {
      return new OpenAIProvider();
    }
    return new LocalProvider();
  }

  switch (type) {
    case 'openai':
      return new OpenAIProvider();
    case 'local':
      return new LocalProvider();
    default:
      throw new Error(`Unknown provider type: ${type}`);
  }
}

// Singleton instance
let defaultProvider: VectorProvider | null = null;

export function getVectorProvider(): VectorProvider {
  if (!defaultProvider) {
    defaultProvider = createVectorProvider('auto');
  }
  return defaultProvider;
}

// Utility: Compute cosine similarity
export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) {
    throw new Error('Vectors must have same dimensions');
  }

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }

  const denominator = Math.sqrt(normA) * Math.sqrt(normB);
  return denominator === 0 ? 0 : dotProduct / denominator;
}

// Utility: Average multiple vectors
export function averageVectors(vectors: number[][]): number[] {
  if (vectors.length === 0) return [];

  const dimensions = vectors[0].length;
  const result = new Array(dimensions).fill(0);

  for (const vec of vectors) {
    for (let i = 0; i < dimensions; i++) {
      result[i] += vec[i];
    }
  }

  for (let i = 0; i < dimensions; i++) {
    result[i] /= vectors.length;
  }

  return result;
}
