import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { word: string } }
) {
  try {
    const word = params.word;
    
    if (!word) {
      return NextResponse.json(
        { error: 'Word parameter is required' },
        { status: 400 }
      );
    }

    const db = await getDb();

    // Query morphological data for the word
    const morphologyQuery = `
      SELECT 
        w.form,
        w.lemma,
        w.pos,
        w.case_type,
        w.number_type,
        w.gender,
        w.tense,
        w.voice,
        w.mood,
        w.person,
        w.degree,
        l.meaning,
        l.etymology,
        l.frequency,
        l.era,
        l.language
      FROM words w
      LEFT JOIN lemmas l ON w.lemma = l.lemma
      WHERE LOWER(w.form) = LOWER(?)
      ORDER BY l.frequency DESC
    `;

    const morphologyResults = await db.all(morphologyQuery, [word]);

    if (morphologyResults.length === 0) {
      return NextResponse.json(
        { error: 'Word not found in morphological database' },
        { status: 404 }
      );
    }

    // Get related forms for the same lemma(s)
    const lemmas = [...new Set(morphologyResults.map(r => r.lemma))];
    
    const relatedFormsQuery = `
      SELECT DISTINCT form, pos, case_type, number_type, gender, tense, voice, mood, person
      FROM words 
      WHERE lemma IN (${lemmas.map(() => '?').join(',')})
      AND LOWER(form) != LOWER(?)
      ORDER BY form
      LIMIT 20
    `;

    const relatedForms = await db.all(relatedFormsQuery, [...lemmas, word]);

    // Format the response
    const analyses = morphologyResults.map(result => ({
      form: result.form,
      lemma: result.lemma,
      partOfSpeech: result.pos,
      morphology: {
        case: result.case_type,
        number: result.number_type,
        gender: result.gender,
        tense: result.tense,
        voice: result.voice,
        mood: result.mood,
        person: result.person,
        degree: result.degree
      },
      lexical: {
        meaning: result.meaning,
        etymology: result.etymology,
        frequency: result.frequency,
        era: result.era,
        language: result.language
      }
    }));

    const data = {
      word: word,
      analyses: analyses,
      relatedForms: relatedForms.map(form => ({
        form: form.form,
        partOfSpeech: form.pos,
        morphology: {
          case: form.case_type,
          number: form.number_type,
          gender: form.gender,
          tense: form.tense,
          voice: form.voice,
          mood: form.mood,
          person: form.person
        }
      })),
      totalAnalyses: analyses.length,
      timestamp: new Date().toISOString()
    };

    return NextResponse.json({ data });

  } catch (error) {
    console.error('Morphology API error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze word morphology' },
      { status: 500 }
    );
  }
}