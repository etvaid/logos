import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text, source_lang, style } = body;
    if (!text) return NextResponse.json({ error: 'Text required' }, { status: 400 });
    const words = text.split(/\s+/).filter((w: string) => w);
    const breakdown = words.slice(0, 100).map((word: string) => ({ word, lemma: word.toLowerCase(), parsing: 'form', meaning: '[definition]' }));
    return NextResponse.json({ translation: '[Translation - connect Claude API for real translation]', breakdown, wordCount: words.length });
  } catch (error) {
    return NextResponse.json({ error: 'Translation failed' }, { status: 500 });
  }
}
