import { NextRequest, NextResponse } from 'next/server';
import { getTimelineEvents } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const start = searchParams.get('start') ? parseInt(searchParams.get('start')!) : undefined;
    const end = searchParams.get('end') ? parseInt(searchParams.get('end')!) : undefined;
    const events = getTimelineEvents(start, end);
    return NextResponse.json({ events });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch timeline' }, { status: 500 });
  }
}
