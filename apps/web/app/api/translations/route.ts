import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'https://logos-backend-production-0d96.up.railway.app';

const DEMO_TRANSLATIONS = [
  {
    id: 't1',
    urn: 'urn:cts:greekLit:tlg0012.tlg001:1.1-5',
    translator: 'Richmond Lattimore',
    style: 'literal',
    sourceText: 'μῆνιν ἄειδε θεὰ Πηληϊάδεω Ἀχιλῆος',
    translatedText: 'Sing, goddess, the anger of Peleus\' son Achilleus',
    scores: {
      overall: 0.92,
      semanticFidelity: 0.95,
      registerMatch: 0.90,
      literalness: 0.88,
      readability: 0.91,
      styleConsistency: 0.93,
      translatorBias: 0.12,
    },
    flagged: false,
  },
  {
    id: 't2',
    urn: 'urn:cts:greekLit:tlg0012.tlg001:1.1-5',
    translator: 'Robert Fagles',
    style: 'dynamic',
    sourceText: 'μῆνιν ἄειδε θεὰ Πηληϊάδεω Ἀχιλῆος',
    translatedText: 'Rage—Goddess, sing the rage of Peleus\' son Achilles',
    scores: {
      overall: 0.89,
      semanticFidelity: 0.87,
      registerMatch: 0.92,
      literalness: 0.75,
      readability: 0.94,
      styleConsistency: 0.91,
      translatorBias: 0.18,
    },
    flagged: false,
  },
  {
    id: 't3',
    urn: 'urn:cts:greekLit:tlg0059.tlg030:428e',
    translator: 'AI: Scholarly',
    style: 'scholarly',
    sourceText: 'ἀλλ᾽ ὁ μὲν δίκαιος εὐδαίμων',
    translatedText: 'But the just person is happy',
    scores: {
      overall: 0.78,
      semanticFidelity: 0.82,
      registerMatch: 0.70,
      literalness: 0.85,
      readability: 0.88,
      styleConsistency: 0.65,
      translatorBias: 0.35,
    },
    flagged: true,
    flagReason: 'Style consistency below threshold (0.65 < 0.70)',
  },
  {
    id: 't4',
    urn: 'urn:cts:latinLit:phi0959.phi001:1.1',
    translator: 'Robert Fitzgerald',
    style: 'poetic',
    sourceText: 'Arma virumque cano, Troiae qui primus ab oris',
    translatedText: 'I sing of warfare and a man at war',
    scores: {
      overall: 0.91,
      semanticFidelity: 0.89,
      registerMatch: 0.94,
      literalness: 0.72,
      readability: 0.96,
      styleConsistency: 0.92,
      translatorBias: 0.15,
    },
    flagged: false,
  },
  {
    id: 't5',
    urn: 'urn:cts:greekLit:tlg0085.tlg003:1-10',
    translator: 'AI: Conversational',
    style: 'conversational',
    sourceText: 'ἄνδρα μοι ἔννεπε, μοῦσα',
    translatedText: 'Tell me about that man, Muse',
    scores: {
      overall: 0.65,
      semanticFidelity: 0.70,
      registerMatch: 0.55,
      literalness: 0.80,
      readability: 0.92,
      styleConsistency: 0.58,
      translatorBias: 0.42,
    },
    flagged: true,
    flagReason: 'Register mismatch: epic tone lost in conversational rendering',
  },
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const translator = searchParams.get('translator');
  const flagged = searchParams.get('flagged');
  const limit = parseInt(searchParams.get('limit') || '50');
  const offset = parseInt(searchParams.get('offset') || '0');

  try {
    const params = new URLSearchParams();
    if (translator) params.set('translator', translator);
    if (flagged) params.set('flagged', flagged);
    params.set('limit', limit.toString());
    params.set('offset', offset.toString());

    const res = await fetch(`${BACKEND_URL}/translations?${params}`, {
      headers: { 'Accept': 'application/json' },
      next: { revalidate: 300 }, // Cache for 5 minutes
    });

    if (res.ok) {
      const data = await res.json();
      return NextResponse.json(data);
    }
  } catch (error) {
    console.log('Backend unavailable, using demo data');
  }

  // Filter demo data
  let filtered = [...DEMO_TRANSLATIONS];
  if (translator) {
    filtered = filtered.filter(t => t.translator.toLowerCase().includes(translator.toLowerCase()));
  }
  if (flagged === 'true') {
    filtered = filtered.filter(t => t.flagged);
  }

  return NextResponse.json({
    items: filtered.slice(offset, offset + limit),
    total: filtered.length,
  });
}
