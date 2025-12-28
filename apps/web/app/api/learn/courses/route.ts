import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Mock data for now
    const data = {
      courses: [
        {
          id: 1,
          title: "Introduction to Classical Latin",
          description: "Learn the fundamentals of Latin grammar and vocabulary through selected readings from Caesar's Gallic Wars.",
          language: "Latin",
          level: "Beginner",
          duration: "12 weeks",
          instructor: "Dr. Marcus Antonius",
          texts: ["Caesar - De Bello Gallico", "Wheelock's Latin"],
          enrollmentCount: 245,
          rating: 4.7,
          image: "/images/courses/latin-intro.jpg"
        },
        {
          id: 2,
          title: "Homer's Iliad: Epic Poetry in Ancient Greek",
          description: "Explore the masterpiece of ancient Greek literature with comprehensive language support and historical context.",
          language: "Greek",
          level: "Intermediate",
          duration: "16 weeks",
          instructor: "Prof. Helena Sophia",
          texts: ["Homer - Iliad", "Athenaze: Book II"],
          enrollmentCount: 189,
          rating: 4.9,
          image: "/images/courses/homer-iliad.jpg"
        },
        {
          id: 3,
          title: "Cicero's Orations: Rhetoric and Politics",
          description: "Study the art of Roman oratory through Cicero's most famous speeches against Catiline and Mark Antony.",
          language: "Latin",
          level: "Advanced",
          duration: "10 weeks",
          instructor: "Dr. Quintus Rhetor",
          texts: ["Cicero - In Catilinam", "Cicero - Philippics"],
          enrollmentCount: 156,
          rating: 4.8,
          image: "/images/courses/cicero-orations.jpg"
        },
        {
          id: 4,
          title: "Plato's Republic: Philosophy and Dialogue",
          description: "Dive into Platonic philosophy while mastering advanced Greek grammar and syntax.",
          language: "Greek",
          level: "Advanced",
          duration: "14 weeks",
          instructor: "Dr. Sophia Philosopha",
          texts: ["Plato - Republic", "Reading Greek: Grammar and Exercises"],
          enrollmentCount: 134,
          rating: 4.6,
          image: "/images/courses/plato-republic.jpg"
        },
        {
          id: 5,
          title: "Vergil's Aeneid: Roman National Epic",
          description: "Journey with Aeneas through Vergil's epic masterpiece, exploring Roman values and poetic techniques.",
          language: "Latin",
          level: "Intermediate",
          duration: "18 weeks",
          instructor: "Prof. Vergilius Poeta",
          texts: ["Vergil - Aeneid", "Pharr's Aeneid"],
          enrollmentCount: 298,
          rating: 4.8,
          image: "/images/courses/vergil-aeneid.jpg"
        },
        {
          id: 6,
          title: "Greek Tragedy: Sophocles and Euripides",
          description: "Analyze the dramatic works of the great tragedians while developing advanced reading skills.",
          language: "Greek",
          level: "Intermediate",
          duration: "12 weeks",
          instructor: "Dr. Dionysios Tragikos",
          texts: ["Sophocles - Oedipus Rex", "Euripides - Medea"],
          enrollmentCount: 167,
          rating: 4.7,
          image: "/images/courses/greek-tragedy.jpg"
        }
      ],
      categories: ["Beginner", "Intermediate", "Advanced"],
      languages: ["Latin", "Greek"],
      totalCourses: 6
    };
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch courses' }, { status: 500 });
  }
}