import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Mock data for now
    const data = {
      id: params.id,
      title: "Aeneid Book I, Lines 1-11",
      author: "Virgil",
      work: "Aeneid",
      book: 1,
      startLine: 1,
      endLine: 11,
      language: "latin",
      originalText: "Arma virumque cano, Troiae qui primus ab oris\nItaliam, fato profugus, Laviniaque venit\nlitora, multum ille et terris iactatus et alto\nvi superum saevae memorem Iunonis ob iram;\nmulta quoque et bello passus, dum conderet urbem,\ninferretque deos Latio, genus unde Latinum,\nAlbanique patres, atque altae moenia Romae.\nMusa, mihi causas memora, quo numine laeso,\nquidve dolens, regina deum tot volvere casus\ninsignem pietate virum, tot adire labores\nimpulerit. Tantaene animis caelestibus irae?",
      translation: "I sing of arms and the man, he who, exiled by fate,\nfirst came from the coasts of Troy to Italy, and to\nLavinian shores—hurled about endlessly by land and sea,\nby the will of the gods, on account of savage Juno's\nunforgetting anger; and much too he suffered in war,\nuntil he could found a city and bring his gods to Latium;\nfrom him came the Latin people and the fathers of Alba,\nand the walls of lofty Rome.\nTell me, Muse, the causes: how was her divine will\nlessened, or what did she, queen of the gods, suffering,\ndrive a man famed for righteousness to revolve so many\nchances of fortune, to enter upon so many labors?\nCan wrath so great dwell in celestial minds?",
      scansion: "Arma vi|rumque ca|nō, Troi|ae quī | prīmus ab | ōrīs",
      grammaticalNotes: [
        {
          word: "Arma",
          form: "accusative plural neuter",
          lemma: "arma, armorum",
          meaning: "arms, weapons"
        },
        {
          word: "virumque",
          form: "accusative singular masculine",
          lemma: "vir, viri",
          meaning: "man, hero"
        }
      ],
      themes: ["heroism", "fate", "divine intervention", "founding myth"],
      difficulty: "intermediate",
      createdAt: "2024-01-15T10:30:00Z",
      updatedAt: "2024-01-15T10:30:00Z"
    };
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch passage' }, { status: 500 });
  }
}