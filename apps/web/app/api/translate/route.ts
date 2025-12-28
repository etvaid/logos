import { NextResponse } from 'next/server';

type TranslationRequest = {
  text: string;
  sourceLanguage: 'greek' | 'latin';
  targetLanguage: 'greek' | 'latin';
};

type TranslationResponse = {
  originalText: string;
  translatedText: string;
  sourceLanguage: 'greek' | 'latin';
  targetLanguage: 'greek' | 'latin';
};

export async function POST(request: Request) {
  try {
    const body: TranslationRequest = await request.json();
    const { text, sourceLanguage, targetLanguage } = body;

    if (!text || !sourceLanguage || !targetLanguage) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    if (sourceLanguage === targetLanguage) {
      return NextResponse.json({ error: 'Source and target languages must be different' }, { status: 400 });
    }

    // Mock translation logic
    const translatedText =
      sourceLanguage === 'greek'
        ? text.replace(/a/g, 'α').replace(/b/g, 'β')
        : text.replace(/alpha/g, 'a').replace(/beta/g, 'b');

    const response: TranslationResponse = {
      originalText: text,
      translatedText,
      sourceLanguage,
      targetLanguage
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}