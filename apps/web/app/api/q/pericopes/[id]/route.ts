import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'https://logos-backend-production-0d96.up.railway.app';

const DEMO_COMPARISON = {
  id: 'q1',
  title: 'Beatitudes',
  matthewText: `Blessed are the poor in spirit, for theirs is the kingdom of heaven.
Blessed are those who mourn, for they will be comforted.
Blessed are the meek, for they will inherit the earth.
Blessed are those who hunger and thirst for righteousness, for they will be filled.`,
  lukeText: `Blessed are you who are poor, for yours is the kingdom of God.
Blessed are you who are hungry now, for you will be filled.
Blessed are you who weep now, for you will laugh.
Blessed are you when people hate you, and when they exclude you.`,
  reconstructedQ: `μακάριοι οἱ πτωχοί, ὅτι ὑμετέρα ἐστὶν ἡ βασιλεία τοῦ θεοῦ.
μακάριοι οἱ πεινῶντες, ὅτι χορτασθήσεσθε.
μακάριοι οἱ κλαίοντες, ὅτι γελάσετε.`,
  agreements: [
    'μακάριοι (blessed) - identical wording',
    'πτωχοί (poor) - core agreement',
    'βασιλεία (kingdom) - shared kingdom language',
    'πεινῶντες/χορτασθήσεσθε - hunger/satisfaction motif',
  ],
  matthewRedaction: [
    'τῷ πνεύματι (in spirit) - Matthew\'s spiritualizing tendency',
    'τὴν δικαιοσύνην (righteousness) - Matthean theme',
    'Third person plural → universalizing',
    'Additional beatitudes (meek, merciful, pure in heart)',
  ],
  lukeRedaction: [
    'Second person direct address ("you who")',
    'Corresponding woes (Luke 6:24-26)',
    'νῦν (now) - eschatological emphasis',
    'Social/economic interpretation of poverty',
  ],
  scholarlyNotes: [
    'Robinson-Hoffmann: Original Q likely 4 beatitudes, closer to Lukan form',
    'Kloppenborg: Beatitudes belong to Q1 (sapiential layer)',
    'Tuckett: Matthew\'s "poor in spirit" is secondary spiritualization',
    'Catchpole: Luke preserves original second-person address',
  ],
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const res = await fetch(`${BACKEND_URL}/q/pericopes/${id}`, {
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

  return NextResponse.json({
    ...DEMO_COMPARISON,
    id,
  });
}
