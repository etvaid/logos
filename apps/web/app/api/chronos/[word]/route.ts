import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { pathname } = new URL(request.url);
    const word = pathname.split('/').pop();

    const mockEvolutionData: Record<string, any> = {
      'virtus': {
        etymology: {
          root: 'vir (man) + -tus (quality)',
          proto_indo_european: '*h₁nḗr',
          original_meaning: 'manliness, courage'
        },
        chronology: [
          {
            period: 'Early Latin (3rd-2nd c. BCE)',
            authors: ['Plautus', 'Ennius'],
            meanings: ['physical strength', 'courage in battle'],
            frequency: 0.12,
            contexts: ['military', 'heroic']
          },
          {
            period: 'Classical Latin (1st c. BCE - 1st c. CE)',
            authors: ['Cicero', 'Caesar', 'Virgil', 'Livy'],
            meanings: ['moral excellence', 'virtue', 'merit', 'valor'],
            frequency: 0.34,
            contexts: ['philosophical', 'political', 'moral']
          },
          {
            period: 'Silver Age (1st-2nd c. CE)',
            authors: ['Tacitus', 'Pliny', 'Quintilian'],
            meanings: ['excellence', 'distinction', 'good quality'],
            frequency: 0.28,
            contexts: ['rhetorical', 'historical']
          },
          {
            period: 'Late Latin (3rd-6th c. CE)',
            authors: ['Augustine', 'Jerome'],
            meanings: ['Christian virtue', 'divine grace', 'righteousness'],
            frequency: 0.19,
            contexts: ['theological', 'ecclesiastical']
          }
        ],
        semantic_evolution: {
          core_shift: 'physical_prowess → moral_excellence → divine_virtue',
          metaphorical_extensions: ['virtus as divine power', 'virtus as artistic skill'],
          gender_neutralization: 'gradual loss of masculine connotation'
        },
        related_forms: ['virtuosus', 'virtutis', 'virtutem'],
        cognates: {
          greek: 'ἀρετή (arete)',
          sanskrit: 'वीर्य (vīrya)',
          old_english: 'wer'
        }
      },
      'logos': {
        etymology: {
          root: 'λέγω (lego) - to say, speak',
          proto_indo_european: '*leǵ-',
          original_meaning: 'word, speech, account'
        },
        chronology: [
          {
            period: 'Archaic Greek (8th-6th c. BCE)',
            authors: ['Homer', 'Hesiod'],
            meanings: ['word', 'story', 'speech'],
            frequency: 0.18,
            contexts: ['epic', 'narrative']
          },
          {
            period: 'Classical Greek (5th-4th c. BCE)',
            authors: ['Heraclitus', 'Plato', 'Aristotle'],
            meanings: ['reason', 'principle', 'rational account', 'definition'],
            frequency: 0.42,
            contexts: ['philosophical', 'scientific', 'rhetorical']
          },
          {
            period: 'Hellenistic (3rd c. BCE - 3rd c. CE)',
            authors: ['Stoics', 'Philo', 'Plutarch'],
            meanings: ['divine reason', 'cosmic principle', 'seminal reason'],
            frequency: 0.31,
            contexts: ['stoic philosophy', 'jewish-hellenistic']
          },
          {
            period: 'Patristic (1st-5th c. CE)',
            authors: ['John', 'Justin Martyr', 'Origen', 'Athanasius'],
            meanings: ['Word of God', 'divine Logos', 'Christ'],
            frequency: 0.38,
            contexts: ['theological', 'christological']
          }
        ],
        semantic_evolution: {
          core_shift: 'speech → rational_principle → divine_word',
          metaphorical_extensions: ['logos as cosmic order', 'logos as divine emanation'],
          theological_development: 'identification with second person of Trinity'
        },
        related_forms: ['λογικός', 'λόγιος', 'λογισμός'],
        cognates: {
          latin: 'lectio',
          gothic: 'lisan',
          english: 'logic'
        }
      }
    };

    const data = mockEvolutionData[word as string] || {
      error: 'Word not found in chronological database',
      available_words: Object.keys(mockEvolutionData)
    };

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to retrieve word evolution data' }, { status: 500 });
  }
}