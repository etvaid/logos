import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const text = searchParams.get('text') || '';
    
    const predictions = [
      {
        id: 1,
        text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
        confidence: 0.92,
        language: "latin",
        author: "Cicero",
        work: "De Finibus Bonorum et Malorum",
        completion: "sed do eiusmod tempor incididunt ut labore"
      },
      {
        id: 2,
        text: "Μῆνιν ἄειδε θεὰ Πηληϊάδεω Ἀχιλῆος",
        confidence: 0.89,
        language: "greek",
        author: "Homer",
        work: "Iliad",
        completion: "οὐλομένην, ἣ μυρί᾽ Ἀχαιοῖς ἄλγε᾽ ἔθηκε"
      },
      {
        id: 3,
        text: "Gallia est omnis divisa in partes tres",
        confidence: 0.95,
        language: "latin",
        author: "Julius Caesar",
        work: "Commentarii de Bello Gallico",
        completion: "quarum unam incolunt Belgae"
      },
      {
        id: 4,
        text: "Ἄνδρα μοι ἔννεπε, μοῦσα, πολύτροπον",
        confidence: 0.87,
        language: "greek",
        author: "Homer",
        work: "Odyssey",
        completion: "ὃς μάλα πολλὰ πλάγχθη"
      }
    ];

    const filteredPredictions = text 
      ? predictions.filter(p => p.text.toLowerCase().includes(text.toLowerCase()))
      : predictions;

    const data = {
      predictions: filteredPredictions,
      totalResults: filteredPredictions.length,
      inputText: text,
      processingTime: Math.random() * 200 + 50
    };

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Text prediction failed' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text, maxResults = 5, language } = body;

    const mockPrediction = {
      originalText: text,
      predictions: [
        {
          completion: "et dolore magna aliqua",
          confidence: 0.94,
          nextWords: ["et", "dolore", "magna"],
          grammaticalAnalysis: {
            case: "nominative",
            number: "singular",
            mood: "indicative"
          }
        },
        {
          completion: "sed ut perspiciatis unde",
          confidence: 0.88,
          nextWords: ["sed", "ut", "perspiciatis"],
          grammaticalAnalysis: {
            case: "ablative",
            number: "plural",
            mood: "subjunctive"
          }
        }
      ],
      metadata: {
        detectedLanguage: language || "latin",
        processingTime: 127,
        modelVersion: "classical-texts-v2.1",
        timestamp: new Date().toISOString()
      }
    };

    return NextResponse.json(mockPrediction);
  } catch (error) {
    return NextResponse.json({ error: 'Text prediction failed' }, { status: 500 });
  }
}