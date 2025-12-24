import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { word: string } }
) {
  try {
    const { word } = params;
    
    if (!word) {
      return NextResponse.json({ error: 'Word parameter required' }, { status: 400 });
    }

    const db = await getDb();
    
    // Get word information
    const wordQuery = `
      SELECT 
        w.id,
        w.word,
        w.language,
        w.lemma,
        w.part_of_speech,
        w.definition,
        w.pronunciation,
        w.frequency_rank,
        w.era,
        w.created_at,
        w.updated_at
      FROM words w 
      WHERE w.word = ? OR w.lemma = ?
      LIMIT 1
    `;
    
    const wordResult = await db.get(wordQuery, [word, word]);
    
    if (!wordResult) {
      return NextResponse.json({ error: 'Word not found' }, { status: 404 });
    }

    // Get word forms
    const formsQuery = `
      SELECT 
        f.id,
        f.form,
        f.form_type,
        f.grammatical_info,
        f.frequency
      FROM word_forms f 
      WHERE f.word_id = ?
      ORDER BY f.frequency DESC
    `;
    
    const forms = await db.all(formsQuery, [wordResult.id]);

    // Get etymology
    const etymologyQuery = `
      SELECT 
        e.id,
        e.origin_language,
        e.origin_word,
        e.meaning_evolution,
        e.cognates,
        e.notes
      FROM etymology e 
      WHERE e.word_id = ?
    `;
    
    const etymology = await db.get(etymologyQuery, [wordResult.id]);

    // Get usage examples
    const examplesQuery = `
      SELECT 
        ex.id,
        ex.text,
        ex.translation,
        ex.source,
        ex.era,
        ex.context
      FROM examples ex 
      WHERE ex.word_id = ?
      ORDER BY ex.frequency DESC
      LIMIT 10
    `;
    
    const examples = await db.all(examplesQuery, [wordResult.id]);

    // Get related words
    const relatedQuery = `
      SELECT 
        rw.related_word_id,
        w2.word as related_word,
        w2.definition as related_definition,
        rw.relationship_type
      FROM related_words rw
      JOIN words w2 ON w2.id = rw.related_word_id
      WHERE rw.word_id = ?
      LIMIT 20
    `;
    
    const related = await db.all(relatedQuery, [wordResult.id]);

    // Get frequency data over time
    const frequencyQuery = `
      SELECT 
        period,
        frequency_score,
        text_count
      FROM frequency_data 
      WHERE word_id = ?
      ORDER BY period
    `;
    
    const frequencyData = await db.all(frequencyQuery, [wordResult.id]);

    const data = {
      word: {
        ...wordResult,
        forms: forms || [],
        etymology: etymology || null,
        examples: examples || [],
        related: related || [],
        frequencyData: frequencyData || []
      }
    };

    return NextResponse.json({ data });
    
  } catch (error) {
    console.error('Word API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch word data' }, 
      { status: 500 }
    );
  }
}