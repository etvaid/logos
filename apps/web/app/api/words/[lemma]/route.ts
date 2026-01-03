import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'https://logos-backend-production-0d96.up.railway.app';

const DEMO_WORDS: Record<string, object> = {
  'μῆνις': {
    lemma: 'μῆνις',
    forms: ['μῆνιν', 'μῆνις', 'μήνιος', 'μῆνι'],
    pos: 'noun',
    definition: 'wrath, anger (especially divine or heroic)',
    etymology: 'From Proto-Indo-European *men- (to think, have in mind). Cognate with Latin memini, English mind.',
    relatedWords: ['μηνίω', 'μηνιθμός', 'χόλος', 'ὀργή'],
    occurrences: 24,
    topAuthors: [
      { name: 'Homer', count: 18 },
      { name: 'Hesiod', count: 3 },
      { name: 'Aeschylus', count: 2 },
      { name: 'Apollonius', count: 1 },
    ],
  },
  'ἀρετή': {
    lemma: 'ἀρετή',
    forms: ['ἀρετή', 'ἀρετήν', 'ἀρετῆς', 'ἀρεταί', 'ἀρετῶν'],
    pos: 'noun',
    definition: 'excellence, virtue, moral goodness',
    etymology: 'From ἀρείων (better), from Proto-Indo-European *h₂er- (to fit together).',
    relatedWords: ['ἄριστος', 'ἀγαθός', 'καλός'],
    occurrences: 1250,
    topAuthors: [
      { name: 'Plato', count: 412 },
      { name: 'Aristotle', count: 385 },
      { name: 'Xenophon', count: 156 },
      { name: 'Isocrates', count: 98 },
    ],
  },
  'λόγος': {
    lemma: 'λόγος',
    forms: ['λόγος', 'λόγον', 'λόγου', 'λόγῳ', 'λόγοι', 'λόγων', 'λόγους'],
    pos: 'noun',
    definition: 'word, speech, reason, account, rational principle',
    etymology: 'From λέγω (to say, gather), from Proto-Indo-European *leǵ- (to collect, speak).',
    relatedWords: ['λέγω', 'λογίζομαι', 'λογικός', 'διάλογος'],
    occurrences: 8450,
    topAuthors: [
      { name: 'Plato', count: 2340 },
      { name: 'Aristotle', count: 1890 },
      { name: 'Herodotus', count: 780 },
      { name: 'Thucydides', count: 520 },
    ],
  },
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ lemma: string }> }
) {
  const { lemma } = await params;
  const decodedLemma = decodeURIComponent(lemma);

  try {
    const res = await fetch(`${BACKEND_URL}/words/${encodeURIComponent(decodedLemma)}`, {
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

  // Return matching demo data or μῆνις as default
  const wordData = DEMO_WORDS[decodedLemma] || {
    ...DEMO_WORDS['μῆνις'],
    lemma: decodedLemma,
  };
  return NextResponse.json(wordData);
}
