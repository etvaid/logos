import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const language = searchParams.get('language') || 'greek';
    const words = getDb().prepare('SELECT * FROM words WHERE language = ? LIMIT 50').all(language);
    return NextResponse.json({ language, words });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch vocabulary' }, { status: 500 });
  }
}
