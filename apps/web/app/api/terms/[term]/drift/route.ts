import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'https://logos-backend-production-0d96.up.railway.app';

const DEMO_DRIFT_DATA: Record<string, object> = {
  'logos': {
    term: 'λόγος',
    language: 'greek',
    periods: [
      {
        name: 'Archaic (800-500 BCE)',
        startYear: -800,
        endYear: -500,
        primaryMeaning: 'word, speech, account',
        secondaryMeanings: ['story', 'saying'],
        frequency: 0.65,
        examples: [
          { urn: 'urn:cts:greekLit:tlg0012.tlg001:1.1', text: 'λόγον εἰπεῖν', author: 'Homer' },
        ],
      },
      {
        name: 'Classical (500-323 BCE)',
        startYear: -500,
        endYear: -323,
        primaryMeaning: 'reason, argument, rational account',
        secondaryMeanings: ['word', 'speech', 'proportion', 'definition'],
        frequency: 0.85,
        examples: [
          { urn: 'urn:cts:greekLit:tlg0059.tlg030:534d', text: 'τὸν λόγον διδόναι', author: 'Plato' },
          { urn: 'urn:cts:greekLit:tlg0086.tlg038:1094a', text: 'κατὰ τὸν ὀρθὸν λόγον', author: 'Aristotle' },
        ],
      },
      {
        name: 'Hellenistic (323-31 BCE)',
        startYear: -323,
        endYear: -31,
        primaryMeaning: 'reason, cosmic principle',
        secondaryMeanings: ['word', 'rational order', 'divine reason'],
        frequency: 0.75,
        examples: [
          { urn: 'urn:cts:greekLit:tlg0555.tlg001:1', text: 'σπερματικὸς λόγος', author: 'Stoics' },
        ],
      },
      {
        name: 'Roman/Imperial (31 BCE-300 CE)',
        startYear: -31,
        endYear: 300,
        primaryMeaning: 'divine Word, cosmic reason',
        secondaryMeanings: ['word', 'reason', 'principle'],
        frequency: 0.90,
        examples: [
          { urn: 'urn:cts:greekLit:tlg0031.tlg004:1.1', text: 'Ἐν ἀρχῇ ἦν ὁ λόγος', author: 'John' },
          { urn: 'urn:cts:greekLit:tlg0555.tlg002:1', text: 'ὁ θεῖος λόγος', author: 'Philo' },
        ],
      },
      {
        name: 'Late Antiquity (300-600 CE)',
        startYear: 300,
        endYear: 600,
        primaryMeaning: 'Christ as Word, theological term',
        secondaryMeanings: ['reason', 'doctrine'],
        frequency: 0.95,
        examples: [
          { urn: 'urn:cts:greekLit:tlg2022.tlg001:1', text: 'ὁ Λόγος σαρξ ἐγένετο', author: 'Church Fathers' },
        ],
      },
    ],
  },
  'arete': {
    term: 'ἀρετή',
    language: 'greek',
    periods: [
      {
        name: 'Archaic (800-500 BCE)',
        startYear: -800,
        endYear: -500,
        primaryMeaning: 'excellence, valor (especially martial)',
        secondaryMeanings: ['nobility', 'skill'],
        frequency: 0.80,
        examples: [
          { urn: 'urn:cts:greekLit:tlg0012.tlg001:9.443', text: 'ἀρετῇ δ᾽ ἐκέκαστο', author: 'Homer' },
        ],
      },
      {
        name: 'Classical (500-323 BCE)',
        startYear: -500,
        endYear: -323,
        primaryMeaning: 'moral virtue, excellence of character',
        secondaryMeanings: ['skill', 'effectiveness'],
        frequency: 0.95,
        examples: [
          { urn: 'urn:cts:greekLit:tlg0059.tlg030:335c', text: 'ἀρετὴ δικαιοσύνη', author: 'Plato' },
        ],
      },
      {
        name: 'Hellenistic (323-31 BCE)',
        startYear: -323,
        endYear: -31,
        primaryMeaning: 'virtue as path to happiness',
        secondaryMeanings: ['excellence', 'moral perfection'],
        frequency: 0.85,
        examples: [
          { urn: 'urn:cts:greekLit:tlg0555.tlg001:1', text: 'ἡ ἀρετὴ αὐτάρκης', author: 'Stoics' },
        ],
      },
    ],
  },
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ term: string }> }
) {
  const { term } = await params;
  const decodedTerm = decodeURIComponent(term).toLowerCase();

  try {
    const res = await fetch(`${BACKEND_URL}/terms/${encodeURIComponent(decodedTerm)}/drift`, {
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

  // Return matching demo data or logos as default
  const driftData = DEMO_DRIFT_DATA[decodedTerm] || DEMO_DRIFT_DATA['logos'];
  return NextResponse.json(driftData);
}
