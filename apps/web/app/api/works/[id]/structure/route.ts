import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Mock data for now
    const data = {
      id: "homer-iliad",
      title: "Ilias",
      author: "Homerus",
      language: "grc",
      structure: {
        type: "epic",
        books: [
          {
            id: "book-1",
            number: 1,
            title: "Μῆνις",
            lines: 611,
            chapters: [],
            summary: "The wrath of Achilles"
          },
          {
            id: "book-2", 
            number: 2,
            title: "Ὄνειρος",
            lines: 877,
            chapters: [],
            summary: "The dream and catalogue of ships"
          },
          {
            id: "book-3",
            number: 3,
            title: "Μαχαιροσκοπία",
            lines: 461,
            chapters: [],
            summary: "Helen on the walls of Troy"
          },
          {
            id: "book-6",
            number: 6,
            title: "Ἕκτωρ καὶ Ἀνδρομάχη",
            lines: 529,
            chapters: [],
            summary: "Hector and Andromache"
          },
          {
            id: "book-24",
            number: 24,
            title: "Λύτρα",
            lines: 804,
            chapters: [],
            summary: "The ransom of Hector"
          }
        ],
        totalBooks: 24,
        totalLines: 15693
      }
    };
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}