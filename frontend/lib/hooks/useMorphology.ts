'use client';

import { useState, useCallback } from 'react';
import type { TokenAnnotation } from '@/lib/types';

interface UseMorphologyResult {
  tokens: TokenAnnotation[];
  loading: boolean;
  error: string | null;
  hasMorphology: boolean;
  fetchMorphology: (urn: string) => Promise<void>;
  getTokenByIndex: (index: number) => TokenAnnotation | undefined;
  getTokenByWord: (word: string, index: number) => TokenAnnotation | undefined;
}

export function useMorphology(): UseMorphologyResult {
  const [tokens, setTokens] = useState<TokenAnnotation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMorphology, setHasMorphology] = useState(false);

  const fetchMorphology = useCallback(async (urn: string) => {
    if (!urn) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/morphology/${encodeURIComponent(urn)}`);
      const data = await response.json();

      if (data.error) {
        setError(data.error);
        setHasMorphology(false);
      } else {
        setTokens(data.tokens || []);
        setHasMorphology(data.has_morphology || false);
      }
    } catch (err) {
      setError('Failed to fetch morphology');
      setHasMorphology(false);
    } finally {
      setLoading(false);
    }
  }, []);

  const getTokenByIndex = useCallback(
    (index: number) => tokens.find((t) => t.token_index === index),
    [tokens]
  );

  const getTokenByWord = useCallback(
    (word: string, index: number) => {
      // Try exact match by index first
      const byIndex = tokens.find((t) => t.token_index === index);
      if (byIndex) return byIndex;

      // Fall back to surface form match
      return tokens.find(
        (t) => t.surface_form.toLowerCase() === word.toLowerCase()
      );
    },
    [tokens]
  );

  return {
    tokens,
    loading,
    error,
    hasMorphology,
    fetchMorphology,
    getTokenByIndex,
    getTokenByWord,
  };
}

// Hook for fetching similar passages
export function useSimilarPassages() {
  const [results, setResults] = useState<
    Array<{
      urn: string;
      author: string;
      work: string;
      section: string;
      content: string;
      similarity: number;
    }>
  >([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const findSimilar = useCallback(async (urn: string, options?: { limit?: number; excludeSameWork?: boolean }) => {
    if (!urn) return;

    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (options?.limit) params.set('limit', String(options.limit));
      if (options?.excludeSameWork) params.set('exclude_same_work', 'true');

      const response = await fetch(`/api/passages/${encodeURIComponent(urn)}/similar?${params}`);
      const data = await response.json();

      if (data.error) {
        setError(data.error);
      } else {
        setResults(data.results || []);
      }
    } catch (err) {
      setError('Failed to find similar passages');
    } finally {
      setLoading(false);
    }
  }, []);

  return { results, loading, error, findSimilar };
}

// Hook for semantic search
export function useSemanticSearch() {
  const [results, setResults] = useState<
    Array<{
      urn: string;
      author: string;
      work: string;
      content: string;
      similarity: number;
    }>
  >([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(async (query: string, options?: { limit?: number; language?: string }) => {
    if (!query) return;

    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({ q: query });
      if (options?.limit) params.set('limit', String(options.limit));
      if (options?.language) params.set('language', options.language);

      const response = await fetch(`/api/search/semantic?${params}`);
      const data = await response.json();

      if (data.error) {
        setError(data.error);
      } else {
        setResults(data.results || []);
      }
    } catch (err) {
      setError('Semantic search failed');
    } finally {
      setLoading(false);
    }
  }, []);

  return { results, loading, error, search };
}
