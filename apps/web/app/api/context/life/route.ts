import { NextRequest, NextResponse } from 'next/server';
import { getLifeContext } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const era = searchParams.get('era') || 'classical';
    const region = searchParams.get('region') || undefined;
    const contexts = getLifeContext(era, region);
    return NextResponse.json({ contexts });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch context' }, { status: 500 });
  }
}
