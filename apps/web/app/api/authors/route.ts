import { NextRequest, NextResponse } from 'next/server';
import { getAuthors } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const era = searchParams.get('era') || undefined;
    const authors = getAuthors(era);
    return NextResponse.json({ authors });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch authors' }, { status: 500 });
  }
}
