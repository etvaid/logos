import { NextRequest, NextResponse } from 'next/server';
import { searchPassages } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const limit = parseInt(searchParams.get('limit') || '50');
    if (!query) return NextResponse.json({ error: 'Query required' }, { status: 400 });
    const results = searchPassages(query, limit);
    return NextResponse.json({ query, results, count: results.length });
  } catch (error) {
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}
