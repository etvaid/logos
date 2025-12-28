import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { pathname } = new URL(request.url);
    const word = pathname.split('/').pop();
    
    // Mock data for semantic analysis of classical texts
    const data = {
      word: word,
      language: "greek",
      lemma: "λόγος",
      morphology: {
        case: "nominative",
        number: "singular",
        gender: "masculine",
        declension: "2nd"
      },
      semanticFields: [
        {
          field: "speech_communication",
          weight: 0.85,
          contexts: ["rhetoric", "discourse", "dialogue"]
        },
        {
          field: "reasoning_logic",
          weight: 0.78,
          contexts: ["philosophy", "argument", "proof"]
        },
        {
          field: "divine_word",
          weight: 0.62,
          contexts: ["theology", "sacred_text", "revelation"]
        }
      ],
      collocations: [
        { word: "ἀληθής", frequency: 23, meaning: "true" },
        { word: "σοφός", frequency: 18, meaning: "wise" },
        { word: "καλός", frequency: 15, meaning: "beautiful/good" }
      ],
      literaryDevices: [
        {
          device: "metaphor",
          examples: ["logos as light", "word as seed"],
          frequency: 12
        },
        {
          device: "personification", 
          examples: ["logos speaks", "word dwells"],
          frequency: 8
        }
      ],
      authors: [
        { name: "Plato", frequency: 45, works: ["Republic", "Phaedrus"] },
        { name: "Aristotle", frequency: 38, works: ["Rhetoric", "Poetics"] },
        { name: "John", frequency: 22, works: ["Gospel"] }
      ],
      sentiment: {
        polarity: 0.72,
        subjectivity: 0.45,
        dominantEmotion: "reverence"
      }
    };
    
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to analyze semantic data' }, { status: 500 });
  }
}