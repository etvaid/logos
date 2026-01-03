import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'https://logos-backend-production-0d96.up.railway.app';

const DEMO_INTERTEXTS = [
  {
    id: 'i1',
    sourceUrn: 'urn:cts:greekLit:tlg0012.tlg001:1.1',
    targetUrn: 'urn:cts:greekLit:tlg0020.tlg001:1.1',
    sourceText: 'μῆνιν ἄειδε θεὰ',
    targetText: 'ἔσπετε νῦν μοι Μοῦσαι',
    type: 'parallel',
    strength: 0.85,
    evidence: 'Both poems invoke divine inspiration at the opening',
  },
  {
    id: 'i2',
    sourceUrn: 'urn:cts:greekLit:tlg0012.tlg001:1.1',
    targetUrn: 'urn:cts:latinLit:phi0959.phi001:1.1',
    sourceText: 'μῆνιν ἄειδε θεὰ Πηληϊάδεω Ἀχιλῆος',
    targetText: 'Arma virumque cano',
    type: 'allusion',
    strength: 0.92,
    evidence: 'Virgil consciously echoes Homeric opening, inverting menis (wrath) to arma (arms)',
  },
  {
    id: 'i3',
    sourceUrn: 'urn:cts:greekLit:tlg0012.tlg001:1.1',
    targetUrn: 'urn:cts:greekLit:tlg0059.tlg030:245c',
    sourceText: 'μῆνιν ἄειδε θεὰ',
    targetText: 'ἐξαρχῆς δ\' αὖ πάλιν ποιητέον',
    type: 'echo',
    strength: 0.45,
    evidence: 'Plato alludes to epic beginnings in discussing poetic inspiration',
  },
];

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ urn: string }> }
) {
  const { urn } = await params;
  const decodedUrn = decodeURIComponent(urn);

  try {
    const res = await fetch(`${BACKEND_URL}/passages/${encodeURIComponent(decodedUrn)}/intertexts`, {
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

  return NextResponse.json(DEMO_INTERTEXTS);
}
