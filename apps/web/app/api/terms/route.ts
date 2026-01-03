import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'https://logos-backend-production-0d96.up.railway.app';

// Demo terms for fallback
const DEMO_TERMS = [
  {
    id: 'logos',
    term: 'logos',
    language: 'greek',
    baseTranslation: 'word, reason, speech',
    semanticField: 'Philosophy/Theology',
    totalOccurrences: 45672,
    driftScore: 0.89,
    relatedTerms: ['mythos', 'lexis', 'rhema', 'verbum'],
    timeline: [
      { period: 'Homeric', year: -750, meaning: 'speech, story', usage: 'Narrative speech', frequency: 234, examples: [] },
      { period: 'Classical', year: -400, meaning: 'reason, argument', usage: 'Philosophical argumentation', frequency: 3456, examples: [] },
      { period: 'Imperial', year: 50, meaning: 'Word (divine)', usage: 'Christian theology', frequency: 8934, examples: [] },
    ],
  },
  {
    id: 'arete',
    term: 'arete',
    language: 'greek',
    baseTranslation: 'excellence, virtue',
    semanticField: 'Ethics',
    totalOccurrences: 23456,
    driftScore: 0.72,
    relatedTerms: ['virtus', 'kalos', 'agathon'],
    timeline: [
      { period: 'Homeric', year: -750, meaning: 'martial excellence', usage: 'Heroic prowess', frequency: 189, examples: [] },
      { period: 'Classical', year: -400, meaning: 'moral virtue', usage: 'Ethical excellence', frequency: 4567, examples: [] },
    ],
  },
  {
    id: 'pietas',
    term: 'pietas',
    language: 'latin',
    baseTranslation: 'duty, devotion, piety',
    semanticField: 'Religion/Ethics',
    totalOccurrences: 18923,
    driftScore: 0.65,
    relatedTerms: ['eusebeia', 'religio', 'fides'],
    timeline: [
      { period: 'Late Republic', year: -100, meaning: 'Roman virtue', usage: 'Civic duty', frequency: 2345, examples: [] },
      { period: 'Augustan', year: -20, meaning: 'Aenean virtue', usage: 'Imperial ideology', frequency: 4567, examples: [] },
    ],
  },
  {
    id: 'psyche',
    term: 'psyche',
    language: 'greek',
    baseTranslation: 'soul, life, mind',
    semanticField: 'Psychology/Philosophy',
    totalOccurrences: 34567,
    driftScore: 0.81,
    relatedTerms: ['anima', 'thymos', 'nous', 'pneuma'],
    timeline: [
      { period: 'Homeric', year: -750, meaning: 'breath-soul', usage: 'Life force', frequency: 456, examples: [] },
      { period: 'Classical', year: -400, meaning: 'rational soul', usage: 'Tripartite soul', frequency: 5678, examples: [] },
    ],
  },
  {
    id: 'natura',
    term: 'natura',
    language: 'latin',
    baseTranslation: 'nature, birth, character',
    semanticField: 'Philosophy/Science',
    totalOccurrences: 28456,
    driftScore: 0.58,
    relatedTerms: ['physis', 'ingenium', 'essentia'],
    timeline: [
      { period: 'Late Republic', year: -100, meaning: 'nature, essence', usage: 'Philosophical nature', frequency: 3456, examples: [] },
      { period: 'Imperial', year: 100, meaning: 'natural world', usage: 'Scientific usage', frequency: 5678, examples: [] },
    ],
  },
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const language = searchParams.get('language');
  const field = searchParams.get('field');

  try {
    const res = await fetch(`${BACKEND_URL}/terms?${searchParams.toString()}`, {
      headers: { 'Accept': 'application/json' },
      next: { revalidate: 3600 },
    });

    if (res.ok) {
      const data = await res.json();
      return NextResponse.json(data);
    }
  } catch (error) {
    console.log('Backend unavailable, using demo data');
  }

  // Filter demo data
  let filteredTerms = DEMO_TERMS;
  if (language) {
    filteredTerms = filteredTerms.filter(t => t.language === language);
  }
  if (field) {
    filteredTerms = filteredTerms.filter(t => t.semanticField === field);
  }

  return NextResponse.json({
    terms: filteredTerms,
    total: filteredTerms.length,
  });
}
