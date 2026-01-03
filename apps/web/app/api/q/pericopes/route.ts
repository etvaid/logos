import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'https://logos-backend-production-0d96.up.railway.app';

const DEMO_PERICOPES = [
  {
    id: 'q1',
    title: 'Beatitudes',
    matthewRef: 'Matt 5:3-12',
    lukeRef: 'Luke 6:20-23',
    confidence: 0.95,
    theme: 'Kingdom Ethics',
    reconstructedText: 'μακάριοι οἱ πτωχοί, ὅτι ὑμετέρα ἐστὶν ἡ βασιλεία τοῦ θεοῦ',
  },
  {
    id: 'q2',
    title: 'Love Your Enemies',
    matthewRef: 'Matt 5:44-48',
    lukeRef: 'Luke 6:27-36',
    confidence: 0.92,
    theme: 'Radical Love',
    reconstructedText: 'ἀγαπᾶτε τοὺς ἐχθροὺς ὑμῶν καὶ προσεύχεσθε ὑπὲρ τῶν διωκόντων ὑμᾶς',
  },
  {
    id: 'q3',
    title: "Lord's Prayer",
    matthewRef: 'Matt 6:9-13',
    lukeRef: 'Luke 11:2-4',
    confidence: 0.88,
    theme: 'Prayer',
    reconstructedText: 'πάτερ, ἁγιασθήτω τὸ ὄνομά σου· ἐλθέτω ἡ βασιλεία σου',
  },
  {
    id: 'q4',
    title: 'Do Not Worry',
    matthewRef: 'Matt 6:25-34',
    lukeRef: 'Luke 12:22-31',
    confidence: 0.90,
    theme: 'Trust in God',
    reconstructedText: 'μὴ μεριμνᾶτε τῇ ψυχῇ ὑμῶν τί φάγητε',
  },
  {
    id: 'q5',
    title: 'Judging Others',
    matthewRef: 'Matt 7:1-5',
    lukeRef: 'Luke 6:37-42',
    confidence: 0.87,
    theme: 'Self-Reflection',
    reconstructedText: 'μὴ κρίνετε, ἵνα μὴ κριθῆτε',
  },
  {
    id: 'q6',
    title: 'The Golden Rule',
    matthewRef: 'Matt 7:12',
    lukeRef: 'Luke 6:31',
    confidence: 0.96,
    theme: 'Ethics',
    reconstructedText: 'πάντα οὖν ὅσα ἐὰν θέλητε ἵνα ποιῶσιν ὑμῖν οἱ ἄνθρωποι, οὕτως καὶ ὑμεῖς ποιεῖτε αὐτοῖς',
  },
  {
    id: 'q7',
    title: 'Two Foundations',
    matthewRef: 'Matt 7:24-27',
    lukeRef: 'Luke 6:47-49',
    confidence: 0.91,
    theme: 'Wisdom',
    reconstructedText: 'πᾶς ὁ ἀκούων μου τοὺς λόγους τούτους καὶ ποιῶν αὐτούς',
  },
  {
    id: 'q8',
    title: "Centurion's Servant",
    matthewRef: 'Matt 8:5-13',
    lukeRef: 'Luke 7:1-10',
    confidence: 0.85,
    theme: 'Faith',
    reconstructedText: 'κύριε, οὐκ εἰμὶ ἱκανὸς ἵνα μου ὑπὸ τὴν στέγην εἰσέλθῃς',
  },
];

export async function GET(request: NextRequest) {
  try {
    const res = await fetch(`${BACKEND_URL}/q/pericopes`, {
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

  return NextResponse.json(DEMO_PERICOPES);
}
