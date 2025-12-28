import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const courseId = params.id;
    
    // Mock data for now
    const courses: { [key: string]: any } = {
      '1': {
        id: '1',
        title: 'Introduction to Latin Grammar',
        description: 'Master the fundamentals of Latin grammar through Cicero\'s writings and classical prose.',
        language: 'Latin',
        difficulty: 'Beginner',
        instructor: 'Dr. Marcus Antonius',
        duration: '12 weeks',
        enrollmentCount: 1247,
        rating: 4.8,
        price: 199,
        imageUrl: '/images/courses/latin-grammar.jpg',
        syllabus: [
          { week: 1, topic: 'Latin Alphabet and Pronunciation', readings: ['Caesar, De Bello Gallico I.1-3'] },
          { week: 2, topic: 'First and Second Declensions', readings: ['Cicero, In Catilinam I.1-5'] },
          { week: 3, topic: 'Present Tense Verbs', readings: ['Virgil, Aeneid I.1-33'] },
          { week: 4, topic: 'Third Declension Nouns', readings: ['Ovid, Metamorphoses I.1-20'] }
        ],
        prerequisites: [],
        learningObjectives: [
          'Read basic Latin texts with comprehension',
          'Identify and decline nouns in all cases',
          'Conjugate regular verbs in present tense',
          'Translate simple Latin sentences'
        ]
      },
      '2': {
        id: '2',
        title: 'Homer\'s Odyssey: Epic Poetry Analysis',
        description: 'Journey through Homer\'s masterpiece while learning advanced Ancient Greek grammar and poetic techniques.',
        language: 'Ancient Greek',
        difficulty: 'Intermediate',
        instructor: 'Prof. Helena Athenaios',
        duration: '16 weeks',
        enrollmentCount: 892,
        rating: 4.9,
        price: 299,
        imageUrl: '/images/courses/odyssey.jpg',
        syllabus: [
          { week: 1, topic: 'Epic Poetry Introduction', readings: ['Odyssey Book 1, lines 1-95'] },
          { week: 2, topic: 'Dactylic Hexameter', readings: ['Odyssey Book 1, lines 96-200'] },
          { week: 3, topic: 'Homeric Epithets', readings: ['Odyssey Book 5, lines 1-100'] },
          { week: 4, topic: 'Divine Intervention Themes', readings: ['Odyssey Book 6, lines 1-150'] }
        ],
        prerequisites: ['Intermediate Ancient Greek Grammar', 'Greek Vocabulary (500+ words)'],
        learningObjectives: [
          'Analyze Homeric verse structure and meter',
          'Understand archaic Greek grammatical forms',
          'Interpret mythological and cultural references',
          'Compose critical essays on epic themes'
        ]
      }
    };

    const data = courses[courseId];
    
    if (!data) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch course details' }, { status: 500 });
  }
}