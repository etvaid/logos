'use client';

import { useState, useCallback } from 'react';

interface ExplainContext {
  type: 'confidence' | 'translation' | 'intertext' | 'drift' | 'general';
  passage?: string;
  confidence?: number;
  gatesPassed?: number;
  factors?: string[];
  source?: string;
  target?: string;
  translation?: string;
  translator?: string;
  score?: number;
  sourceLanguage?: string;
  term?: string;
  language?: string;
  driftScore?: number;
  periods?: string[];
  connectionType?: string;
  strength?: number;
  question?: string;
}

interface TranslateRequest {
  sourceText: string;
  sourceLanguage: string;
  targetStyles?: string[];
}

interface TranslationResult {
  style: string;
  translation: string;
  fidelityScore: number;
}

export function useExplain() {
  const [explanation, setExplanation] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const explain = useCallback(async (context: ExplainContext) => {
    setLoading(true);
    setError(null);
    setExplanation('');

    try {
      const response = await fetch('/api/ai/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: context.type, context }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to get explanation');
      }

      // Check if streaming response
      const contentType = response.headers.get('content-type');
      if (contentType?.includes('text/event-stream')) {
        // Handle streaming response
        const reader = response.body?.getReader();
        if (!reader) throw new Error('No response body');

        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const data = JSON.parse(line.slice(6));
                if (data.content) {
                  setExplanation((prev) => prev + data.content);
                }
              } catch {
                // Skip invalid JSON
              }
            }
          }
        }
      } else {
        // Handle non-streaming response
        const data = await response.json();
        setExplanation(data.explanation || '');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setExplanation('');
    setError(null);
  }, []);

  return { explanation, loading, error, explain, reset };
}

export function useMultiStyleTranslate() {
  const [translations, setTranslations] = useState<TranslationResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const translate = useCallback(async (request: TranslateRequest) => {
    setLoading(true);
    setError(null);
    setTranslations([]);

    try {
      const response = await fetch('/api/ai/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Translation failed');
      }

      const data = await response.json();
      setTranslations(data.translations || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, []);

  return { translations, loading, error, translate };
}
