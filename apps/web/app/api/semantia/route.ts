import { NextResponse } from 'next/server';

type SemantiaData = {
  id: number;
  term: string;
  definition: string;
  language: 'Greek' | 'Latin';
  example: string;
};

type ErrorResponse = {
  error: string;
  message: string;
};

const mockData: SemantiaData[] = [
  {
    id: 1,
    term: 'Logos',
    definition: 'The principle of reason and judgment.',
    language: 'Greek',
    example: 'The Logos is a central concept in Greek philosophy.'
  },
  {
    id: 2,
    term: 'Veritas',
    definition: 'Truth; the truth.',
    language: 'Latin',
    example: 'In Veritas, we find the foundation of all knowledge.'
  }
];

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { term } = body;

    if (!term) {
      return NextResponse.json<ErrorResponse>(
        { error: 'Invalid Request', message: 'Term is required' },
        { status: 400 }
      );
    }

    const result = mockData.find((entry) => entry.term.toLowerCase() === term.toLowerCase());

    if (!result) {
      return NextResponse.json<ErrorResponse>(
        { error: 'Not Found', message: `No definition found for term: ${term}` },
        { status: 404 }
      );
    }

    return NextResponse.json<SemantiaData>(result, { status: 200 });
  } catch (error) {
    return NextResponse.json<ErrorResponse>(
      { error: 'Internal Server Error', message: 'An unexpected error occurred.' },
      { status: 500 }
    );
  }
}