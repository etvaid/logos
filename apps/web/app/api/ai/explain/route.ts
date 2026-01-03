import { NextRequest } from 'next/server';

// Server-side only - API key never exposed to client
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Simple in-memory rate limiting (use Redis in production)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 20; // requests per minute
const RATE_WINDOW = 60 * 1000; // 1 minute

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

export async function POST(request: NextRequest) {
  // Get client IP for rate limiting
  const ip = request.headers.get('x-forwarded-for') || 'unknown';

  if (!checkRateLimit(ip)) {
    return new Response(JSON.stringify({ error: 'Rate limit exceeded. Please wait a moment.' }), {
      status: 429,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (!OPENAI_API_KEY) {
    // Return mock response if no API key configured
    return new Response(JSON.stringify({
      explanation: 'AI explanation not configured. This passage shows typical characteristics of the genre with moderate confidence based on textual analysis.',
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const body = await request.json();
    const { type, context } = body;

    let systemPrompt = '';
    let userPrompt = '';

    switch (type) {
      case 'confidence':
        systemPrompt = `You are a biblical and classical studies expert. Explain confidence scores and methodology clearly and concisely. Be scholarly but accessible. Always cite specific evidence.`;
        userPrompt = `Explain why this passage has the given confidence score:\n\nPassage: ${context.passage}\nConfidence: ${context.confidence}%\nGates Passed: ${context.gatesPassed}/5\nKey Factors: ${context.factors?.join(', ') || 'Not specified'}`;
        break;

      case 'translation':
        systemPrompt = `You are a translation studies expert. Analyze translation quality, style choices, and semantic fidelity. Be specific about what works and what could be improved.`;
        userPrompt = `Analyze this translation:\n\nSource (${context.sourceLanguage}): ${context.source}\nTranslation: ${context.translation}\nTranslator: ${context.translator}\nQuality Score: ${context.score}%`;
        break;

      case 'intertext':
        systemPrompt = `You are an expert in classical intertextuality. Explain literary connections between ancient texts, identifying verbal echoes, thematic parallels, and influence patterns.`;
        userPrompt = `Explain the intertextual connection between these passages:\n\nSource: ${context.source}\nTarget: ${context.target}\nConnection Type: ${context.connectionType}\nStrength: ${context.strength}%`;
        break;

      case 'drift':
        systemPrompt = `You are a historical semantics expert. Explain how word meanings evolve over time in ancient languages, with attention to cultural, philosophical, and theological factors.`;
        userPrompt = `Explain the semantic drift of this term:\n\nTerm: ${context.term}\nLanguage: ${context.language}\nDrift Score: ${context.driftScore}%\nPeriods: ${context.periods?.join(' → ') || 'Not specified'}`;
        break;

      default:
        systemPrompt = `You are a classical and biblical studies expert. Provide clear, scholarly explanations.`;
        userPrompt = context.question || 'Explain this concept.';
    }

    // Call OpenAI API with streaming
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        max_tokens: 500,
        temperature: 0.7,
        stream: true,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    // Return streaming response
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        const reader = response.body?.getReader();
        if (!reader) {
          controller.close();
          return;
        }

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
              const data = line.slice(6);
              if (data === '[DONE]') {
                controller.close();
                return;
              }
              try {
                const parsed = JSON.parse(data);
                const content = parsed.choices?.[0]?.delta?.content;
                if (content) {
                  controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content })}\n\n`));
                }
              } catch {
                // Skip invalid JSON
              }
            }
          }
        }
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('AI explain error:', error);
    return new Response(JSON.stringify({
      error: 'Failed to generate explanation. Please try again.',
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
