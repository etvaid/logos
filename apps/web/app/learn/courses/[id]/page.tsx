'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Lesson {
  id: string;
  title: string;
  description: string;
  duration: number;
  completed: boolean;
  order: number;
}

interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  difficulty: string;
  totalLessons: number;
  completedLessons: number;
  duration: string;
  language: 'Greek' | 'Latin';
  era: string;
  lessons: Lesson[];
}

export default function CourseDetailPage({ params }: { params: { id: string } }) {
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCourse();
  }, [params.id]);

  const fetchCourse = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/courses/${params.id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch course');
      }
      const data = await response.json();
      setCourse(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner':
        return '#059669';
      case 'intermediate':
        return '#F59E0B';
      case 'advanced':
        return '#DC2626';
      default:
        return '#6B7280';
    }
  };

  const getLanguageColor = (language: string) => {
    return language === 'Greek' ? '#3B82F6' : '#DC2626';
  };

  const calculateProgress = () => {
    if (!course) return 0;
    return course.totalLessons > 0 ? (course.completedLessons / course.totalLessons) * 100 : 0;
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#0D0D0F', color: '#F5F4F2' }}>
        <nav style={{ backgroundColor: '#1E1E24', padding: '16px 24px', borderBottom: '1px solid rgba(201,162,39,0.2)' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Link href="/" style={{ textDecoration: 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#C9A227' }}>ΛΟΓΟΣ</div>
              </div>
            </Link>
            <div style={{ display: 'flex', gap: '24px' }}>
              <Link href="/learn" style={{ color: '#F5F4F2', textDecoration: 'none', transition: 'color 0.2s' }}>Learn</Link>
              <Link href="/research" style={{ color: '#F5F4F2', textDecoration: 'none', transition: 'color 0.2s' }}>Research</Link>
            </div>
          </div>
        </nav>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '18px', color: '#C9A227', marginBottom: '8px' }}>Loading...</div>
            <div style={{ color: '#9CA3AF' }}>Fetching course details</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#0D0D0F', color: '#F5F4F2' }}>
        <nav style={{ backgroundColor: '#1E1E24', padding: '16px 24px', borderBottom: '1px solid rgba(201,162,39,0.2)' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Link href="/" style={{ textDecoration: 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#C9A227' }}>ΛΟΓΟΣ</div>
              </div>
            </Link>
            <div style={{ display: 'flex', gap: '24px' }}>
              <Link href="/learn" style={{ color: '#F5F4F2', textDecoration: 'none', transition: 'color 0.2s' }}>Learn</Link>
              <Link href="/research" style={{ color: '#F5F4F2', textDecoration: 'none', transition: 'color 0.2s' }}>Research</Link>
            </div>
          </div>
        </nav>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px' }}>
          <div style={{ backgroundColor: '#1E1E24', borderRadius: '12px', padding: '40px', textAlign: 'center' }}>
            <div style={{ fontSize: '24px', color: '#DC2626', marginBottom: '16px' }}>Error</div>
            <div style={{ color: '#9CA3AF', marginBottom: '24px' }}>{error}</div>
            <Link href="/learn" style={{ backgroundColor: '#C9A227', color: '#0D0D0F', padding: '12px 24px', borderRadius: '8px', fontWeight: 'bold', textDecoration: 'none', display: 'inline-block' }}>
              Back to Courses
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#0D0D0F', color: '#F5F4F2' }}>
        <nav style={{ backgroundColor: '#1E1E24', padding: '16px 24px', borderBottom: '1px solid rgba(201,162,39,0.2)' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Link href="/" style={{ textDecoration: 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#C9A227' }}>ΛΟΓΟΣ</div>
              </div>
            </Link>
            <div style={{ display: 'flex', gap: '24px' }}>
              <Link href="/learn" style={{ color: '#F5F4F2', textDecoration: 'none', transition: 'color 0.2s' }}>Learn</Link>
              <Link href="/research" style={{ color: '#F5F4F2', textDecoration: 'none', transition: 'color 0.2s' }}>Research</Link>
            </div>
          </div>
        </nav>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px' }}>
          <div style={{ backgroundColor: '#1E1E24', borderRadius: '12px', padding: '40px', textAlign: 'center' }}>
            <div style={{ fontSize: '24px', color: '#C9A227', marginBottom: '16px' }}>Course Not Found</div>
            <div style={{ color: '#9CA3AF', marginBottom: '24px' }}>The requested course could not be found.</div>
            <Link href="/learn" style={{ backgroundColor: '#C9A227', color: '#0D0D0F', padding: '12px 24px', borderRadius: '8px', fontWeight: 'bold', textDecoration: 'none', display: 'inline-block' }}>
              Back to Courses
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const progress = calculateProgress();

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0D0D0F', color: '#F5F4F2' }}>
      <nav style={{ backgroundColor: '#1E1E24', padding: '16px 24px', borderBottom: '1px solid rgba(201,162,39,0.2)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#C9A227' }}>ΛΟΓΟΣ</div>
            </div>
          </Link>
          <div style={{ display: 'flex', gap: '24px' }}>
            <Link href="/learn" style={{ color: '#F5F4F2', textDecoration: 'none', transition: 'color 0.2s' }}>Learn</Link>
            <Link href="/research" style={{ color: '#F5F4F2', textDecoration: 'none', transition: 'color 0.2s' }}>Research</Link>
          </div>
        </div>
      </nav>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px' }}>
        <div style={{ marginBottom: '24px' }}>
          <Link href="/learn" style={{ color: '#C9A227', textDecoration: 'none', fontSize: '14px' }}>
            ← Back to Courses
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '32px' }}>
          <div>
            <div style={{ backgroundColor: '#1E1E24', borderRadius: '12px', padding: '32px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <span style={{ backgroundColor: getLanguageColor(course.language), color: '#F5F4F2', padding: '4px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold' }}>
                  {course.language}
                </span>
                <span style={{ backgroundColor: getDifficultyColor(course.difficulty), color: '#F5F4F2', padding: '4px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold' }}>
                  {course.difficulty}
                </span>
                <span style={{ color: '#9CA3AF', fontSize: '14px' }}>
                  {course.era}
                </span>
              </div>

              <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '16px', color: '#F5F4F2' }}>
                {course.title}
              </h1>

              <p style={{ color: '#9CA3AF', lineHeight: '1.6', marginBottom: '24px' }}>
                {course.description}
              </p>

              <div style={{ display: 'flex', gap: '32px', marginBottom: '24px' }}>
                <div>
                  <div style={{ color: '#6B7280', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>
                    Instructor
                  </div>
                  <div style={{ color: '#F5F4F2', fontWeight: '500' }}>
                    {course.instructor}
                  </div>
                </div>
                <div>
                  <div style={{ color: '#6B7280', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>
                    Duration
                  </div>
                  <div style={{ color: '#F5F4F2', fontWeight: '500' }}>
                    {course.duration}
                  </div>
                </div>
                <div>
                  <div style={{ color: '#6B7280', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>
                    Lessons
                  </div>
                  <div style={{ color: '#F5F4F2', fontWeight: '500' }}>
                    {course.completedLessons} / {course.totalLessons}
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ color: '#9CA3AF', fontSize: '14px' }}>Progress</span>
                  <span style={{ color: '#C9A227', fontSize: '14px', fontWeight: 'bold' }}>
                    {Math.round(progress)}%
                  </span>
                </div>
                <div style={{ backgroundColor: '#0D0D0F', borderRadius: '8px', height: '8px', overflow: 'hidden' }}>
                  <div style={{ backgroundColor: '#C9A227', height: '100%', width: `${progress}%`, transition: 'width 0.3s' }}></div>
                </div>
              </div>

              <Link href={`/learn/courses/${course.id}/lessons/${course.lessons[0]?.id || '1'}`} style={{ backgroundColor: '#C9A227', color: '#0D0D0F', padding: '16px 32px', borderRadius: '8px', fontWeight: 'bold', textDecoration: 'none', display: 'inline-block' }}>
                {course.completedLessons > 0 ? 'Continue Learning' : 'Start Course'}
              </Link>
            </div>

            <div style={{ backgroundColor: '#1E1E24', borderRadius: '12px', padding: '32px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '24px', color: '#F5F4F2' }}>
                Course Content
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {course.lessons.map((lesson) => (
                  <div key={lesson.id} style={{ border: '1px solid #374151', borderRadius: '8px', padding: '20px', backgroundColor: lesson.completed ? 'rgba(201,162,39,0.05)' : '#0D0D0F' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: lesson.completed ? '#C9A227' : '#374151', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold' }}>
                          {lesson.completed ? '✓' : lesson.order}
                        </div>
                        <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#F5F4F2' }}>
                          {lesson.title}
                        </h3>
                      </div>
                      <div style={{ color: '#9CA3AF', fontSize: '14px' }}>
                        {lesson.duration} min
                      </div>
                    </div>
                    <p style={{ color: '#9CA3AF', marginBottom: '16px', paddingLeft: '36px' }}>
                      {lesson.description}
                    </p>
                    <div style={{ paddingLeft: '36px' }}>
                      <Link href={`/learn/courses/${course.id}/lessons/${lesson.id}`} style={{ color: '#C9A227', textDecoration: 'none', fontSize: '14px', fontWeight: '500' }}>
                        {lesson.completed ? 'Review Lesson' : 'Start Lesson'} →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div>
            <div style={{ backgroundColor: '#1E1E24', borderRadius: '12px', padding: '24px', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px', color: '#F5F4F2' }}>
                Quick Stats
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#9CA3AF' }}>Completion</span>
                  <span style={{ color: '#C9A227', fontWeight: 'bold' }}>{Math.round(progress)}%</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#9CA3AF' }}>Language</span>
                  <span style={{ color: getLanguageColor(course.language), fontWeight: 'bold' }}>{course.language}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#9CA3AF' }}>Difficulty</span>
                  <span style={{ color: getDifficultyColor(course.difficulty), fontWeight: 'bold' }}>{course.difficulty}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#9CA3AF' }}>Era</span>
                  <span style={{ color: '#F5F4F2' }}>{course.era}</span>
                </div>
              </div>
            </div>

            <div style={{ backgroundColor: '#1E1E24', borderRadius: '12px', padding: '24px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px', color: '#F5F4F2' }}>
                Learning Path
              </h3>
              <div style={{ color: '#9CA3AF', fontSize: '14px', lineHeight: '1.6' }}>
                Complete this course to unlock advanced topics in {course.language} literature and continue your classical studies journey.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}