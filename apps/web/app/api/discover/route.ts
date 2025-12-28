import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Mock data for now
    const data = {
      recommendations: [
        {
          id: 'homer-odyssey',
          title: 'The Odyssey',
          author: 'Homer',
          language: 'Greek',
          period: 'Archaic',
          genre: 'Epic Poetry',
          difficulty: 'Advanced',
          description: 'Epic tale of Odysseus\' journey home after the Trojan War',
          estimatedReadTime: '12 hours',
          popularity: 95,
          tags: ['epic', 'mythology', 'adventure', 'heroic journey']
        },
        {
          id: 'cicero-catiline',
          title: 'Catiline Orations',
          author: 'Cicero',
          language: 'Latin',
          period: 'Late Republic',
          genre: 'Oratory',
          difficulty: 'Intermediate',
          description: 'Four speeches denouncing Catiline\'s conspiracy against Rome',
          estimatedReadTime: '3 hours',
          popularity: 78,
          tags: ['politics', 'rhetoric', 'conspiracy', 'republic']
        },
        {
          id: 'sophocles-antigone',
          title: 'Antigone',
          author: 'Sophocles',
          language: 'Greek',
          period: 'Classical',
          genre: 'Tragedy',
          difficulty: 'Intermediate',
          description: 'Tragic conflict between divine law and human authority',
          estimatedReadTime: '2 hours',
          popularity: 87,
          tags: ['tragedy', 'ethics', 'family', 'law']
        }
      ],
      trending: [
        { id: 'plato-republic', title: 'The Republic', author: 'Plato', views: 2847 },
        { id: 'virgil-aeneid', title: 'Aeneid', author: 'Virgil', views: 2341 },
        { id: 'ovid-metamorphoses', title: 'Metamorphoses', author: 'Ovid', views: 1923 }
      ],
      categories: [
        { name: 'Epic Poetry', count: 23, icon: '⚔️' },
        { name: 'Philosophy', count: 45, icon: '🤔' },
        { name: 'Tragedy', count: 31, icon: '🎭' },
        { name: 'History', count: 28, icon: '📜' },
        { name: 'Oratory', count: 19, icon: '🗣️' }
      ],
      featuredAuthors: [
        { name: 'Homer', works: 2, language: 'Greek', specialty: 'Epic Poetry' },
        { name: 'Cicero', works: 12, language: 'Latin', specialty: 'Oratory' },
        { name: 'Aristotle', works: 8, language: 'Greek', specialty: 'Philosophy' },
        { name: 'Tacitus', works: 5, language: 'Latin', specialty: 'History' }
      ]
    };
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch discovery data' }, { status: 500 });
  }
}