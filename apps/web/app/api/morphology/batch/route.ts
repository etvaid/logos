import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { words } = await request.json();
    
    if (!words || !Array.isArray(words) || words.length === 0) {
      return NextResponse.json({ error: 'Words array is required' }, { status: 400 });
    }

    if (words.length > 100) {
      return NextResponse.json({ error: 'Maximum 100 words allowed per batch' }, { status: 400 });
    }

    const db = await getDb();
    
    const results = await Promise.all(
      words.map(async (word: string) => {
        try {
          const cleanWord = word.trim().toLowerCase();
          
          if (!cleanWord) {
            return {
              word,
              error: 'Empty word'
            };
          }

          // Find morphological analysis
          const morphology = await db.get(`
            SELECT 
              m.*,
              w.word_form,
              w.language,
              w.frequency,
              l.lemma,
              l.pos,
              l.definition
            FROM morphology m
            JOIN words w ON m.word_id = w.id
            LEFT JOIN lemmas l ON w.lemma_id = l.id
            WHERE LOWER(w.word_form) = ?
            ORDER BY w.frequency DESC
            LIMIT 1
          `, [cleanWord]);

          if (!morphology) {
            // Try to find partial matches or similar words
            const similar = await db.all(`
              SELECT word_form, language
              FROM words 
              WHERE LOWER(word_form) LIKE ?
              ORDER BY frequency DESC
              LIMIT 3
            `, [`%${cleanWord}%`]);

            return {
              word,
              found: false,
              suggestions: similar.map(s => s.word_form)
            };
          }

          return {
            word,
            found: true,
            data: {
              wordForm: morphology.word_form,
              language: morphology.language,
              lemma: morphology.lemma,
              pos: morphology.pos,
              definition: morphology.definition,
              morphology: {
                case: morphology.grammatical_case,
                number: morphology.number,
                gender: morphology.gender,
                person: morphology.person,
                tense: morphology.tense,
                mood: morphology.mood,
                voice: morphology.voice,
                degree: morphology.degree
              },
              frequency: morphology.frequency
            }
          };
        } catch (error) {
          return {
            word,
            error: 'Analysis failed'
          };
        }
      })
    );

    const successful = results.filter(r => r.found).length;
    const failed = results.filter(r => r.error || !r.found).length;

    return NextResponse.json({
      results,
      summary: {
        total: words.length,
        successful,
        failed,
        processedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Batch morphology analysis error:', error);
    return NextResponse.json(
      { error: 'Failed to process batch morphology analysis' }, 
      { status: 500 }
    );
  }
}