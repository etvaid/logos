import { NextRequest, NextResponse } from 'next/server';
import { getWorks } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const language = searchParams.get('language') || undefined;
    const works = getWorks(language);
    return NextResponse.json({ works });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch works' }, { status: 500 });
  }
}
