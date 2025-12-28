import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { texts, targetLanguage, sourceLanguage } = await request.json();
    
    // Mock bulk translation data
    const data = {
      translations: [
        {
          id: "1",
          original: "Arma virumque cano, Troiae qui primus ab oris",
          translated: "I sing of arms and the man, who first from the shores of Troy",
          sourceLanguage: "la",
          targetLanguage: "en",
          confidence: 0.95,
          author: "Virgil",
          work: "Aeneid"
        },
        {
          id: "2",
          original: "Μῆνιν ἄειδε θεὰ Πηληϊάδεω Ἀχιλῆος",
          translated: "Sing, goddess, the rage of Peleus' son Achilles",
          sourceLanguage: "grc",
          targetLanguage: "en",
          confidence: 0.92,
          author: "Homer",
          work: "Iliad"
        },
        {
          id: "3",
          original: "Gallia est omnis divisa in partes tres",
          translated: "All Gaul is divided into three parts",
          sourceLanguage: "la",
          targetLanguage: "en",
          confidence: 0.98,
          author: "Caesar",
          work: "Commentarii de Bello Gallico"
        }
      ],
      totalProcessed: 3,
      processingTime: "2.3s",
      estimatedCost: "$0.15"
    };
    
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Bulk translation failed' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    // Mock translation job status
    const data = {
      jobs: [
        {
          id: "job_001",
          status: "completed",
          totalTexts: 25,
          processedTexts: 25,
          sourceLanguage: "la",
          targetLanguage: "en",
          createdAt: "2024-01-15T10:30:00Z",
          completedAt: "2024-01-15T10:32:45Z",
          author: "Cicero",
          work: "De Oratore"
        },
        {
          id: "job_002",
          status: "processing",
          totalTexts: 50,
          processedTexts: 32,
          sourceLanguage: "grc",
          targetLanguage: "en",
          createdAt: "2024-01-15T11:15:00Z",
          completedAt: null,
          author: "Plato",
          work: "Republic"
        }
      ]
    };
    
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch bulk translation jobs' }, { status: 500 });
  }
}