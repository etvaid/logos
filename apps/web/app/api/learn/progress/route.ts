import { NextRequest, NextResponse } from 'next/server';
import { getUserProgress } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('user_id') || 'anonymous';
    const progress = getUserProgress(userId) as any[];
    const totalXp = progress.reduce((sum, p) => sum + (p.xp || 0), 0);
    return NextResponse.json({ userId, xp: totalXp, wordsLearned: progress.length, level: Math.floor(totalXp / 100) + 1, streak: 0, progress });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch progress' }, { status: 500 });
  }
}
