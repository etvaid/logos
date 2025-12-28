import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query');
    const author = searchParams.get('author');
    const work = searchParams.get('work');
    
    // Mock data for now
    const data = {
      query: query || "arma virumque cano",
      totalResults: 15,
      passages: [
        {
          id: "intertext_1",
          sourceText: {
            author: "Vergilius",
            work: "Aeneis",
            book: 1,
            line: 1,
            text: "Arma virumque cano, Troiae qui primus ab oris",
            translation: "I sing of arms and the man, who first from the shores of Troy"
          },
          parallelPassages: [
            {
              author: "Ovidius",
              work: "Metamorphoses",
              book: 1,
              line: 1,
              text: "In nova fert animus mutatas dicere formas",
              translation: "My mind is bent to tell of bodies changed into new forms",
              similarity: 0.75,
              type: "epic_opening"
            },
            {
              author: "Homerus",
              work: "Ilias",
              book: 1,
              line: 1,
              text: "Μῆνιν ἄειδε θεὰ Πηληϊάδεω Ἀχιλῆος",
              translation: "Sing, goddess, the anger of Peleus' son Achilles",
              similarity: 0.82,
              type: "epic_invocation"
            }
          ]
        },
        {
          id: "intertext_2",
          sourceText: {
            author: "Horatius",
            work: "Carmina",
            book: 1,
            carmen: 11,
            line: 8,
            text: "carpe diem quam minimum credula postero",
            translation: "seize the day, trusting as little as possible in the future"
          },
          parallelPassages: [
            {
              author: "Seneca",
              work: "Epistulae",
              epistle: 1,
              section: 2,
              text: "Vindica te tibi, et tempus quod adhuc aut auferebatur aut surripiebatur",
              translation: "Reclaim yourself for yourself, and the time that has so far been taken away",
              similarity: 0.68,
              type: "philosophical_theme"
            },
            {
              author: "Euripides",
              work: "Alcestis",
              line: 782,
              text: "βραχὺς ὁ βίος καὶ τὸ μέλλον ἀσφαλές",
              translation: "life is short and the future uncertain",
              similarity: 0.71,
              type: "memento_mori"
            }
          ]
        },
        {
          id: "intertext_3",
          sourceText: {
            author: "Cicero",
            work: "De Officiis",
            book: 1,
            section: 44,
            text: "Summum bonum et malum",
            translation: "The highest good and evil"
          },
          parallelPassages: [
            {
              author: "Aristoteles",
              work: "Ethica Nicomachea",
              book: 1,
              chapter: 4,
              text: "τὸ ἀγαθὸν καὶ τὸ εὖ",
              translation: "the good and the well",
              similarity: 0.89,
              type: "philosophical_concept"
            },
            {
              author: "Plato",
              work: "Respublica",
              book: 6,
              text: "ἡ τοῦ ἀγαθοῦ ἰδέα",
              translation: "the idea of the good",
              similarity: 0.76,
              type: "ethical_theory"
            }
          ]
        }
      ],
      filters: {
        genres: ["epic", "lyric", "philosophical", "dramatic"],
        languages: ["latin", "greek"],
        periods: ["archaic", "classical", "hellenistic", "imperial"],
        similarityThreshold: 0.6
      },
      metadata: {
        searchTime: "0.234s",
        corpus: "Perseus Digital Library + TLG",
        algorithm: "semantic_similarity_v2"
      }
    };
    
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to retrieve intertexts' }, { status: 500 });
  }
}