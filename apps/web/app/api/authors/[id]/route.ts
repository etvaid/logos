import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const id = request.url.split('/').slice(-2)[0];
    
    const authors: { [key: string]: any } = {
      '1': {
        id: 1,
        name: 'Homer',
        fullName: 'Homeros',
        period: '8th century BCE',
        origin: 'Ancient Greece',
        language: 'Ancient Greek',
        biography: 'Legendary ancient Greek epic poet, traditionally said to be the author of the epic poems the Iliad and the Odyssey.',
        majorWorks: [
          { id: 1, title: 'Iliad', year: '8th century BCE', genre: 'Epic Poetry' },
          { id: 2, title: 'Odyssey', year: '8th century BCE', genre: 'Epic Poetry' }
        ],
        themes: ['heroism', 'war', 'journey', 'divine intervention', 'honor'],
        influence: 'Foundational figure in Western literature',
        historicalContext: 'Greek Dark Ages transitioning to Archaic period'
      },
      '2': {
        id: 2,
        name: 'Virgil',
        fullName: 'Publius Vergilius Maro',
        period: '70-19 BCE',
        origin: 'Roman Empire',
        language: 'Latin',
        biography: 'Roman poet of the Augustan period, regarded as one of Rome\'s greatest poets.',
        majorWorks: [
          { id: 3, title: 'Aeneid', year: '29-19 BCE', genre: 'Epic Poetry' },
          { id: 4, title: 'Georgics', year: '29 BCE', genre: 'Didactic Poetry' },
          { id: 5, title: 'Eclogues', year: '42-37 BCE', genre: 'Pastoral Poetry' }
        ],
        themes: ['destiny', 'empire', 'duty', 'pastoral life', 'divine will'],
        influence: 'Major influence on Dante and medieval literature',
        historicalContext: 'Augustan Rome, Pax Romana'
      },
      '3': {
        id: 3,
        name: 'Sophocles',
        fullName: 'Sophokles',
        period: '496-406 BCE',
        origin: 'Athens, Ancient Greece',
        language: 'Ancient Greek',
        biography: 'One of three ancient Greek tragedians whose plays have survived complete.',
        majorWorks: [
          { id: 6, title: 'Oedipus Rex', year: '429 BCE', genre: 'Tragedy' },
          { id: 7, title: 'Antigone', year: '441 BCE', genre: 'Tragedy' },
          { id: 8, title: 'Electra', year: '410 BCE', genre: 'Tragedy' }
        ],
        themes: ['fate vs free will', 'divine justice', 'moral conflict', 'family honor'],
        influence: 'Fundamental to dramatic theory and practice',
        historicalContext: 'Golden Age of Athens, Pericles era'
      }
    };

    const author = authors[id];
    
    if (!author) {
      return NextResponse.json({ error: 'Author not found' }, { status: 404 });
    }

    return NextResponse.json(author);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch author details' }, { status: 500 });
  }
}