import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query') || '';
    const limit = parseInt(searchParams.get('limit') || '10');

    const mockResults = [
      {
        id: 'odyssey_1_1',
        title: 'Homer - Odyssey, Book 1',
        author: 'Homer',
        text: 'Tell me, Muse, of the man of many ways, who was driven far journeys, after he had sacked Troy\'s sacred citadel.',
        similarity: 0.92,
        language: 'greek',
        genre: 'epic',
        passage: {
          book: 1,
          line: 1,
          chapter: null
        }
      },
      {
        id: 'aeneid_1_1',
        title: 'Virgil - Aeneid, Book 1',
        author: 'Virgil',
        text: 'Arms and the man I sing, who first made way, predestined exile, from the Trojan shore to Italy.',
        similarity: 0.89,
        language: 'latin',
        genre: 'epic',
        passage: {
          book: 1,
          line: 1,
          chapter: null
        }
      },
      {
        id: 'republic_7_514',
        title: 'Plato - Republic, Book 7',
        author: 'Plato',
        text: 'And now, I said, let me show in a figure how far our nature is enlightened or unenlightened.',
        similarity: 0.85,
        language: 'greek',
        genre: 'philosophy',
        passage: {
          book: 7,
          line: 514,
          chapter: 'The Cave Allegory'
        }
      },
      {
        id: 'metamorphoses_1_1',
        title: 'Ovid - Metamorphoses, Book 1',
        author: 'Ovid',
        text: 'I intend to speak of forms changed into new entities.',
        similarity: 0.83,
        language: 'latin',
        genre: 'poetry',
        passage: {
          book: 1,
          line: 1,
          chapter: null
        }
      },
      {
        id: 'confessions_1_1',
        title: 'Augustine - Confessions, Book 1',
        author: 'Augustine',
        text: 'Great are you, O Lord, and exceedingly worthy of praise; your power is immense.',
        similarity: 0.81,
        language: 'latin',
        genre: 'theology',
        passage: {
          book: 1,
          line: 1,
          chapter: 1
        }
      }
    ];

    const filteredResults = mockResults.slice(0, limit);

    const data = {
      query,
      results: filteredResults,
      total: filteredResults.length,
      searchTime: '0.045s',
      semanticModel: 'classical-texts-v2'
    };

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Semantic search failed' }, { status: 500 });
  }
}