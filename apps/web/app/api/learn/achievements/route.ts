import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Mock data for now
    const data = {
      achievements: [
        {
          id: 'first_translation',
          title: 'Prima Verba',
          description: 'Complete your first Latin translation',
          icon: 'scroll',
          category: 'translation',
          points: 50,
          unlocked: true,
          unlockedAt: '2024-01-15T10:30:00Z'
        },
        {
          id: 'greek_alphabet_master',
          title: 'Alpha to Omega',
          description: 'Master the Greek alphabet',
          icon: 'alpha',
          category: 'fundamentals',
          points: 100,
          unlocked: true,
          unlockedAt: '2024-01-20T14:22:00Z'
        },
        {
          id: 'caesar_scholar',
          title: 'Gallic Warrior',
          description: 'Translate 10 passages from Caesar\'s Gallic Wars',
          icon: 'sword',
          category: 'authors',
          points: 300,
          unlocked: false,
          progress: 7,
          total: 10
        },
        {
          id: 'homer_devotee',
          title: 'Epic Reader',
          description: 'Complete 50 lines from the Iliad or Odyssey',
          icon: 'ship',
          category: 'authors',
          points: 500,
          unlocked: false,
          progress: 23,
          total: 50
        },
        {
          id: 'consecutive_days_7',
          title: 'Hebdomadal Scholar',
          description: 'Study for 7 consecutive days',
          icon: 'flame',
          category: 'consistency',
          points: 200,
          unlocked: true,
          unlockedAt: '2024-02-01T09:15:00Z'
        },
        {
          id: 'perfect_grammar',
          title: 'Grammaticus',
          description: 'Score 100% on 5 grammar exercises',
          icon: 'star',
          category: 'grammar',
          points: 250,
          unlocked: false,
          progress: 3,
          total: 5
        },
        {
          id: 'vocabulary_master',
          title: 'Lexicon Master',
          description: 'Learn 500 vocabulary words',
          icon: 'book',
          category: 'vocabulary',
          points: 400,
          unlocked: false,
          progress: 287,
          total: 500
        },
        {
          id: 'cicero_orator',
          title: 'Eloquent Speaker',
          description: 'Complete translations from Cicero\'s speeches',
          icon: 'column',
          category: 'authors',
          points: 350,
          unlocked: true,
          unlockedAt: '2024-02-10T16:45:00Z'
        }
      ],
      totalPoints: 1150,
      totalUnlocked: 4,
      categories: [
        { name: 'fundamentals', displayName: 'Fundamentals', count: 1 },
        { name: 'translation', displayName: 'Translation', count: 1 },
        { name: 'authors', displayName: 'Authors', count: 3 },
        { name: 'consistency', displayName: 'Consistency', count: 1 },
        { name: 'grammar', displayName: 'Grammar', count: 1 },
        { name: 'vocabulary', displayName: 'Vocabulary', count: 1 }
      ]
    };
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}