import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Mock data for now
    const data = {
      sourceText: "Gallia est omnis divisa in partes tres, quarum unam incolunt Belgae, aliam Aquitani, tertiam qui ipsorum lingua Celtae, nostra Galli appellantur.",
      language: "latin",
      author: "Julius Caesar",
      work: "Commentarii de Bello Gallico",
      book: "I",
      section: "1",
      translations: [
        {
          id: "1",
          translator: "H.J. Edwards",
          year: 1917,
          translation: "All Gaul is divided into three parts, one of which the Belgae inhabit, the Aquitani another, those who in their own language are called Celts, in ours Gauls, the third.",
          publisher: "Loeb Classical Library",
          notes: "Standard scholarly translation"
        },
        {
          id: "2", 
          translator: "S.A. Handford",
          year: 1951,
          translation: "Gaul as a whole is divided into three parts: the Belgae live in one, the Aquitani in another, and the third is inhabited by a people called in their own tongue Celts, in ours Gauls.",
          publisher: "Penguin Classics",
          notes: "More accessible modern rendering"
        },
        {
          id: "3",
          translator: "Carolyn Hammond", 
          year: 1996,
          translation: "The whole of Gaul is divided into three parts: one of these is inhabited by the Belgae, another by the Aquitani, and the third by those who are called Celts in their own language and Gauls in ours.",
          publisher: "Oxford World's Classics",
          notes: "Contemporary scholarly translation"
        }
      ],
      comparison: {
        keyDifferences: [
          {
            phrase: "Gallia est omnis divisa",
            translations: [
              { translator: "Edwards", rendering: "All Gaul is divided" },
              { translator: "Handford", rendering: "Gaul as a whole is divided" },
              { translator: "Hammond", rendering: "The whole of Gaul is divided" }
            ],
            analysis: "Variation in emphasis on totality"
          }
        ],
        literalness: [
          { translator: "Edwards", score: 9, notes: "Maintains Latin word order closely" },
          { translator: "Handford", score: 7, notes: "More natural English flow" }, 
          { translator: "Hammond", score: 8, notes: "Balance of accuracy and readability" }
        ],
        readability: [
          { translator: "Edwards", score: 6, notes: "Formal, academic style" },
          { translator: "Handford", score: 9, notes: "Clear, accessible prose" },
          { translator: "Hammond", score: 8, notes: "Scholarly yet approachable" }
        ]
      }
    };
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}