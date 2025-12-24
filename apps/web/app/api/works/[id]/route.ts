import { NextRequest, NextResponse } from 'next/server';
import { getWork, getWorkStructure } from '@/lib/db';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const work = getWork(parseInt(params.id));
    if (!work) return NextResponse.json({ error: 'Work not found' }, { status: 404 });
    const structure = getWorkStructure(parseInt(params.id));
    return NextResponse.json({ ...work, structure });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch work' }, { status: 500 });
  }
}
