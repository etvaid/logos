import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'https://logos-backend-production-0d96.up.railway.app';

// Demo data for fallback
const DEMO_PASSAGE = {
  urn: 'urn:cts:greekLit:tlg0012.tlg001.perseus-grc1:1.1',
  work: 'Iliad',
  author: 'Homer',
  section: 'Book 1, Line 1',
  language: 'greek',
  sourceText: 'μῆνιν ἄειδε θεὰ Πηληϊάδεω Ἀχιλῆος οὐλομένην, ἣ μυρί᾽ Ἀχαιοῖς ἄλγε᾽ ἔθηκε',
  words: [
    { form: 'μῆνιν', lemma: 'μῆνις', pos: 'noun', morph: 'acc.sg.fem' },
    { form: 'ἄειδε', lemma: 'ἀείδω', pos: 'verb', morph: 'impv.pres.act.2sg' },
    { form: 'θεὰ', lemma: 'θεά', pos: 'noun', morph: 'nom.sg.fem' },
    { form: 'Πηληϊάδεω', lemma: 'Πηληϊάδης', pos: 'noun', morph: 'gen.sg.masc' },
    { form: 'Ἀχιλῆος', lemma: 'Ἀχιλλεύς', pos: 'noun', morph: 'gen.sg.masc' },
  ],
  translations: [
    {
      id: 't1',
      translator: 'Richmond Lattimore',
      style: 'literal',
      text: 'Sing, goddess, the anger of Peleus\' son Achilleus and its devastation, which put pains thousandfold upon the Achaians',
      qualityScore: 0.92,
    },
    {
      id: 't2',
      translator: 'Robert Fagles',
      style: 'dynamic',
      text: 'Rage—Goddess, sing the rage of Peleus\' son Achilles, murderous, doomed, that cost the Achaeans countless losses',
      qualityScore: 0.89,
    },
    {
      id: 't3',
      translator: 'AI: Scholarly',
      style: 'scholarly',
      text: 'The wrath—sing, goddess—of Achilles, son of Peleus, that destructive wrath which brought countless woes upon the Achaeans',
      qualityScore: 0.85,
    },
  ],
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ urn: string }> }
) {
  const { urn } = await params;
  const decodedUrn = decodeURIComponent(urn);

  try {
    // Try to fetch from backend
    const res = await fetch(`${BACKEND_URL}/passages/${encodeURIComponent(decodedUrn)}`, {
      headers: { 'Accept': 'application/json' },
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (res.ok) {
      const data = await res.json();
      return NextResponse.json(data);
    }
  } catch (error) {
    console.log('Backend unavailable, using demo data');
  }

  // Return demo data as fallback
  return NextResponse.json({
    ...DEMO_PASSAGE,
    urn: decodedUrn,
  });
}
