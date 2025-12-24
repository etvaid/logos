import { NextRequest, NextResponse } from 'next/server';
import { getAuthors, getAuthorConnections } from '@/lib/db';

export async function GET() {
  try {
    const authors = getAuthors() as any[];
    const connections = getAuthorConnections() as any[];
    const nodes = authors.map((a, i) => ({ id: a.id.toString(), name: a.name, era: a.era || 'classical', language: a.language || 'greek', x: 100 + (i % 5) * 100 + Math.random() * 50, y: 80 + Math.floor(i / 5) * 80 + Math.random() * 50, influence: 5 }));
    const edges = connections.map(c => ({ source: c.source_id.toString(), target: c.target_id.toString(), type: c.connection_type, strength: c.strength }));
    return NextResponse.json({ nodes, edges });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch connections' }, { status: 500 });
  }
}
