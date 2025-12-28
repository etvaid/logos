import { NextResponse } from 'next/server';

type ChronosData = {
  id: number;
  title: string;
  description: string;
  date: string;
  category: 'Greek' | 'Latin';
};

async function getMockChronosData(): Promise<ChronosData[]> {
  return [
    {
      id: 1,
      title: 'Homeric Epics',
      description: 'A collection of epic poems attributed to Homer, including the Iliad and the Odyssey.',
      date: '800 BC',
      category: 'Greek',
    },
    {
      id: 2,
      title: 'Aristotelian Philosophy',
      description: 'Works of Aristotle focusing on logic, metaphysics, and ethics.',
      date: '384 BC',
      category: 'Greek',
    },
    {
      id: 3,
      title: 'The Twelve Tables',
      description: 'The earliest attempt by the Romans to create a code of law.',
      date: '450 BC',
      category: 'Latin',
    },
    {
      id: 4,
      title: 'Caesar\'s Commentaries',
      description: 'Julius Caesar\'s first-hand accounts of his military campaigns.',
      date: '58 BC',
      category: 'Latin',
    },
  ];
}

export async function POST(request: Request) {
  try {
    const data = await getMockChronosData();
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch Chronos data' });
  }
}