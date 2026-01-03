import { NextRequest } from 'next/server';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Rate limiting
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 10; // translations per minute (more expensive)
const RATE_WINDOW = 60 * 1000;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_WINDOW });
    return true;
  }

  if (record.count >= RATE_LIMIT) {
    return false;
  }

  record.count++;
  return true;
}

// Style definitions with semantic constraints
const STYLE_PROMPTS: Record<string, string> = {
  scholarly: `Translate with maximum semantic precision and scholarly accuracy.
    - Preserve technical terms with transliterations where helpful
    - Include important grammatical nuances in brackets
    - Prioritize accuracy over readability
    - Use formal academic English`,

  literary: `Translate with literary elegance while maintaining fidelity.
    - Preserve poetic structures where possible
    - Use elevated but accessible English
    - Maintain rhythm and flow
    - Balance beauty with accuracy`,

  accessible: `Translate for a general audience with clarity as the priority.
    - Use simple, modern English
    - Explain cultural concepts inline where needed
    - Prioritize understanding over literal accuracy
    - Avoid technical jargon`,

  literal: `Provide a highly literal, word-for-word translation.
    - Follow source language word order where possible
    - Use consistent English equivalents for repeated terms
    - Include grammatical markers (articles, particles)
    - Sacrifice English idiom for source fidelity`,
};

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') || 'unknown';

  if (!checkRateLimit(ip)) {
    return new Response(JSON.stringify({ error: 'Rate limit exceeded. Please wait.' }), {
      status: 429,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const body = await request.json();
    const { sourceText, sourceLanguage, targetStyles } = body;

    if (!sourceText || !sourceLanguage) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const styles = targetStyles || ['scholarly', 'literary', 'accessible'];

    // If no API key, return mock translations
    if (!OPENAI_API_KEY) {
      const mockTranslations = styles.map((style: string) => ({
        style,
        translation: `[${style.charAt(0).toUpperCase() + style.slice(1)} translation of "${sourceText.substring(0, 50)}..."]`,
        fidelityScore: 0.85 + Math.random() * 0.1,
      }));

      return new Response(JSON.stringify({
        translations: mockTranslations,
        sourceText,
        sourceLanguage,
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Generate translations for each style
    const translations = await Promise.all(
      styles.map(async (style: string) => {
        const stylePrompt = STYLE_PROMPTS[style] || STYLE_PROMPTS.scholarly;

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${OPENAI_API_KEY}`,
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              {
                role: 'system',
                content: `You are an expert translator of ${sourceLanguage} classical texts. ${stylePrompt}

CRITICAL CONSTRAINTS:
1. Never add content not present in the source
2. Never omit content from the source
3. Flag any ambiguous terms with [?]
4. Maintain semantic fidelity as the highest priority

Respond with ONLY the translation, no commentary.`,
              },
              {
                role: 'user',
                content: `Translate this ${sourceLanguage} text:\n\n${sourceText}`,
              },
            ],
            max_tokens: 1000,
            temperature: 0.3, // Lower temperature for translation accuracy
          }),
        });

        if (!response.ok) {
          throw new Error(`OpenAI API error: ${response.status}`);
        }

        const data = await response.json();
        const translation = data.choices?.[0]?.message?.content || '';

        // Calculate a mock fidelity score (in production, use actual semantic similarity)
        const fidelityScore = 0.85 + Math.random() * 0.12;

        return {
          style,
          translation: translation.trim(),
          fidelityScore,
        };
      })
    );

    return new Response(JSON.stringify({
      translations,
      sourceText,
      sourceLanguage,
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('AI translate error:', error);
    return new Response(JSON.stringify({
      error: 'Translation failed. Please try again.',
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
