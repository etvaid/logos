import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { word: string } }
) {
  try {
    const { word } = params;
    
    if (!word) {
      return NextResponse.json({ error: 'Word parameter is required' }, { status: 400 });
    }

    const db = await getDb();
    
    // Get main lexicon entry
    const lexiconEntry = await db.collection('lexicon').findOne({
      $or: [
        { word: word },
        { lemma: word },
        { variants: word }
      ]
    });

    if (!lexiconEntry) {
      return NextResponse.json({ error: 'Word not found' }, { status: 404 });
    }

    // Get related forms and derivatives
    const relatedForms = await db.collection('lexicon').find({
      $or: [
        { root: lexiconEntry.root },
        { lemma: lexiconEntry.lemma },
        { etymology: { $regex: lexiconEntry.lemma, $options: 'i' } }
      ],
      _id: { $ne: lexiconEntry._id }
    }).limit(10).toArray();

    // Get usage examples from texts
    const examples = await db.collection('texts').find({
      $text: { $search: word }
    }).limit(5).toArray();

    // Get frequency data
    const frequency = await db.collection('word_frequency').findOne({
      word: lexiconEntry.lemma
    });

    // Compile full dictionary entry
    const fullEntry = {
      id: lexiconEntry._id,
      word: lexiconEntry.word,
      lemma: lexiconEntry.lemma,
      language: lexiconEntry.language,
      partOfSpeech: lexiconEntry.partOfSpeech,
      definitions: lexiconEntry.definitions,
      etymology: lexiconEntry.etymology,
      root: lexiconEntry.root,
      variants: lexiconEntry.variants || [],
      morphology: lexiconEntry.morphology,
      pronunciation: lexiconEntry.pronunciation,
      transliteration: lexiconEntry.transliteration,
      frequency: frequency ? {
        rank: frequency.rank,
        count: frequency.count,
        relativeFrequency: frequency.relativeFrequency,
        era: frequency.era
      } : null,
      relatedForms: relatedForms.map(form => ({
        word: form.word,
        lemma: form.lemma,
        partOfSpeech: form.partOfSpeech,
        definition: form.definitions?.[0]?.meaning || '',
        relationship: form.etymology?.includes(lexiconEntry.lemma) ? 'derivative' : 'cognate'
      })),
      examples: examples.map(example => ({
        id: example._id,
        text: example.content,
        author: example.author,
        work: example.work,
        era: example.era,
        context: example.context
      })),
      metadata: {
        dateAdded: lexiconEntry.dateAdded,
        lastModified: lexiconEntry.lastModified,
        sources: lexiconEntry.sources || [],
        verified: lexiconEntry.verified || false
      }
    };

    return NextResponse.json({ 
      word: fullEntry,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Lexicon API error:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch dictionary entry' 
    }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { word: string } }
) {
  try {
    const { word } = params;
    const updates = await request.json();
    
    const db = await getDb();
    
    const result = await db.collection('lexicon').updateOne(
      { $or: [{ word }, { lemma: word }] },
      { 
        $set: { 
          ...updates, 
          lastModified: new Date() 
        } 
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Word not found' }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true,
      modified: result.modifiedCount > 0
    });
    
  } catch (error) {
    console.error('Lexicon update error:', error);
    return NextResponse.json({ 
      error: 'Failed to update dictionary entry' 
    }, { status: 500 });
  }
}