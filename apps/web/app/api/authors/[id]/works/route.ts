import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const authorId = params.id;
    
    // Mock data for now
    const data = {
      authorId: authorId,
      works: [
        {
          id: "iliad",
          title: "Iliad",
          originalTitle: "Ἰλιάς",
          language: "ancient_greek",
          genre: "epic_poetry",
          dateComposed: "-8th century",
          books: 24,
          lines: 15693,
          description: "Epic poem about the Trojan War focusing on Achilles' wrath",
          manuscripts: 1757,
          firstModernEdition: "1488"
        },
        {
          id: "odyssey",
          title: "Odyssey", 
          originalTitle: "Ὀδύσσεια",
          language: "ancient_greek",
          genre: "epic_poetry", 
          dateComposed: "-8th century",
          books: 24,
          lines: 12110,
          description: "Epic poem recounting Odysseus' journey home from Troy",
          manuscripts: 1500,
          firstModernEdition: "1488"
        },
        {
          id: "homeric_hymns",
          title: "Homeric Hymns",
          originalTitle: "Ὁμηρικοὶ ὕμνοι", 
          language: "ancient_greek",
          genre: "hymn",
          dateComposed: "-7th-6th century",
          books: null,
          lines: 2774,
          description: "Collection of 33 hymns to various Greek deities",
          manuscripts: 31,
          firstModernEdition: "1749"
        }
      ],
      totalWorks: 3,
      languages: ["ancient_greek"],
      genres: ["epic_poetry", "hymn"],
      extantWorks: 3,
      fragmentaryWorks: 0
    };
    
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch author works' }, { status: 500 });
  }
}