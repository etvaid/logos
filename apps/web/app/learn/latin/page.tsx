'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Lesson {
  id: string;
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  completed: boolean;
  exercises: number;
  duration: string;
}

interface Progress {
  completedLessons: number;
  totalLessons: number;
  streak: number;
  level: string;
}

export default function LearnLatinPage() {
  const [loading, setLoading] = useState(true);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [progress, setProgress] = useState<Progress | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('lessons');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const [lessonsRes, progressRes] = await Promise.all([
          fetch('/api/learn/latin/lessons'),
          fetch('/api/learn/latin/progress')
        ]);

        if (!lessonsRes.ok || !progressRes.ok) {
          throw new Error('Failed to fetch data');
        }

        const lessonsData = await lessonsRes.json();
        const progressData = await progressRes.json();

        setLessons(lessonsData.lessons || [
          {
            id: '1',
            title: 'Introduction to Latin',
            description: 'Basic pronunciation, alphabet, and fundamental concepts',
            difficulty: 'Beginner',
            completed: true,
            exercises: 5,
            duration: '30 min'
          },
          {
            id: '2',
            title: 'First Declension Nouns',
            description: 'Puella, rosa, and feminine nouns ending in -a',
            difficulty: 'Beginner',
            completed: true,
            exercises: 8,
            duration: '45 min'
          },
          {
            id: '3',
            title: 'Present Tense Verbs',
            description: 'Amo, laudo, and first conjugation verbs',
            difficulty: 'Beginner',
            completed: false,
            exercises: 10,
            duration: '50 min'
          },
          {
            id: '4',
            title: 'Second Declension Nouns',
            description: 'Dominus, puer, and masculine/neuter nouns',
            difficulty: 'Intermediate',
            completed: false,
            exercises: 12,
            duration: '60 min'
          },
          {
            id: '5',
            title: 'Adjective Agreement',
            description: 'Magnus, bonus, and adjective-noun agreement',
            difficulty: 'Intermediate',
            completed: false,
            exercises: 9,
            duration: '40 min'
          }
        ]);

        setProgress(progressData.progress || {
          completedLessons: 2,
          totalLessons: 5,
          streak: 3,
          level: 'Novice'
        });

      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return '#059669';
      case 'Intermediate': return '#F59E0B';
      case 'Advanced': return '#DC2626';
      default: return '#6B7280';
    }
  };

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        backgroundColor: '#0D0D0F',
        color: '#F5F4F2'
      }}>
        <nav style={{
          backgroundColor: '#1E1E24',
          padding: '16px 24px',
          borderBottom: '1px solid rgba(201,162,39,0.2)'
        }}>
          <div style={{ 
            maxWidth: '1200px', 
            margin: '0 auto', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between' 
          }}>
            <Link href="/" style={{ 
              fontSize: '24px', 
              fontWeight: 'bold', 
              color: '#C9A227', 
              textDecoration: 'none' 
            }}>
              LOGOS
            </Link>
          </div>
        </nav>
        
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: 'calc(100vh - 80px)',
          fontSize: '18px'
        }}>
          Loading Latin course...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        backgroundColor: '#0D0D0F',
        color: '#F5F4F2'
      }}>
        <nav style={{
          backgroundColor: '#1E1E24',
          padding: '16px 24px',
          borderBottom: '1px solid rgba(201,162,39,0.2)'
        }}>
          <div style={{ 
            maxWidth: '1200px', 
            margin: '0 auto', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between' 
          }}>
            <Link href="/" style={{ 
              fontSize: '24px', 
              fontWeight: 'bold', 
              color: '#C9A227', 
              textDecoration: 'none' 
            }}>
              LOGOS
            </Link>
          </div>
        </nav>
        
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: 'calc(100vh - 80px)',
          textAlign: 'center'
        }}>
          <h2 style={{ color: '#DC2626', marginBottom: '16px' }}>Error Loading Course</h2>
          <p style={{ color: '#9CA3AF' }}>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#0D0D0F',
      color: '#F5F4F2'
    }}>
      <nav style={{
        backgroundColor: '#1E1E24',
        padding: '16px 24px',
        borderBottom: '1px solid rgba(201,162,39,0.2)'
      }}>
        <div style={{ 
          maxWidth: '1200px', 
          margin: '0 auto', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between' 
        }}>
          <Link href="/" style={{ 
            fontSize: '24px', 
            fontWeight: 'bold', 
            color: '#C9A227', 
            textDecoration: 'none' 
          }}>
            LOGOS
          </Link>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <Link href="/search" style={{ color: '#9CA3AF', textDecoration: 'none' }}>
              Search
            </Link>
            <Link href="/learn" style={{ color: '#C9A227', textDecoration: 'none' }}>
              Learn
            </Link>
            <Link href="/library" style={{ color: '#9CA3AF', textDecoration: 'none' }}>
              Library
            </Link>
          </div>
        </div>
      </nav>

      <main style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        padding: '40px 24px' 
      }}>
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ 
            fontSize: '32px', 
            fontWeight: 'bold', 
            marginBottom: '8px',
            color: '#DC2626'
          }}>
            Learn Latin
          </h1>
          <p style={{ 
            fontSize: '18px', 
            color: '#9CA3AF',
            marginBottom: '24px'
          }}>
            Master the language of ancient Rome through structured lessons and exercises
          </p>
          
          <Link href="/learn" style={{
            color: '#C9A227',
            textDecoration: 'none',
            fontSize: '16px'
          }}>
            ← Back to Learning Hub
          </Link>
        </div>

        {progress && (
          <div style={{
            backgroundColor: '#1E1E24',
            borderRadius: '12px',
            padding: '24px',
            marginBottom: '32px',
            border: '1px solid rgba(220,38,38,0.2)'
          }}>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>
              Your Progress
            </h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              <div>
                <div style={{ fontSize: '14px', color: '#9CA3AF', marginBottom: '4px' }}>
                  Lessons Completed
                </div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#DC2626' }}>
                  {progress.completedLessons}/{progress.totalLessons}
                </div>
              </div>
              
              <div>
                <div style={{ fontSize: '14px', color: '#9CA3AF', marginBottom: '4px' }}>
                  Current Level
                </div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#C9A227' }}>
                  {progress.level}
                </div>
              </div>
              
              <div>
                <div style={{ fontSize: '14px', color: '#9CA3AF', marginBottom: '4px' }}>
                  Study Streak
                </div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#059669' }}>
                  {progress.streak} days
                </div>
              </div>
            </div>
            
            <div style={{ marginTop: '16px' }}>
              <div style={{ fontSize: '14px', color: '#9CA3AF', marginBottom: '8px' }}>
                Overall Progress
              </div>
              <div style={{
                width: '100%',
                height: '8px',
                backgroundColor: '#374151',
                borderRadius: '4px',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: `${(progress.completedLessons / progress.totalLessons) * 100}%`,
                  height: '100%',
                  backgroundColor: '#DC2626',
                  transition: 'width 0.3s'
                }} />
              </div>
            </div>
          </div>
        )}

        <div style={{
          display: 'flex',
          gap: '16px',
          marginBottom: '32px',
          borderBottom: '1px solid rgba(75,85,99,0.3)'
        }}>
          <button
            onClick={() => setActiveTab('lessons')}
            style={{
              padding: '12px 24px',
              backgroundColor: 'transparent',
              color: activeTab === 'lessons' ? '#C9A227' : '#9CA3AF',
              border: 'none',
              borderBottom: activeTab === 'lessons' ? '2px solid #C9A227' : '2px solid transparent',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: '500',
              transition: 'all 0.2s'
            }}
          >
            Lessons
          </button>
          <button
            onClick={() => setActiveTab('exercises')}
            style={{
              padding: '12px 24px',
              backgroundColor: 'transparent',
              color: activeTab === 'exercises' ? '#C9A227' : '#9CA3AF',
              border: 'none',
              borderBottom: activeTab === 'exercises' ? '2px solid #C9A227' : '2px solid transparent',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: '500',
              transition: 'all 0.2s'
            }}
          >
            Exercises
          </button>
          <button
            onClick={() => setActiveTab('grammar')}
            style={{
              padding: '12px 24px',
              backgroundColor: 'transparent',
              color: activeTab === 'grammar' ? '#C9A227' : '#9CA3AF',
              border: 'none',
              borderBottom: activeTab === 'grammar' ? '2px solid #C9A227' : '2px solid transparent',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: '500',
              transition: 'all 0.2s'
            }}
          >
            Grammar Guide
          </button>
        </div>

        {activeTab === 'lessons' && (
          <div>
            <div style={{ display: 'grid', gap: '16px' }}>
              {lessons.map((lesson) => (
                <div
                  key={lesson.id}
                  style={{
                    backgroundColor: '#1E1E24',
                    borderRadius: '12px',
                    padding: '24px',
                    border: lesson.completed ? '1px solid rgba(5,150,105,0.3)' : '1px solid rgba(75,85,99,0.3)',
                    transition: 'all 0.2s',
                    cursor: 'pointer'
                  }}
                  onClick={() => {
                    window.location.href = `/learn/latin/lesson/${lesson.id}`;
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ 
                        fontSize: '18px', 
                        fontWeight: 'bold', 
                        marginBottom: '4px',
                        color: lesson.completed ? '#059669' : '#F5F4F2'
                      }}>
                        {lesson.title}
                      </h3>
                      <p style={{ 
                        color: '#9CA3AF', 
                        fontSize: '14px',
                        marginBottom: '8px'
                      }}>
                        {lesson.description}
                      </p>
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {lesson.completed && (
                        <span style={{
                          color: '#059669',
                          fontSize: '20px'
                        }}>
                          ✓
                        </span>
                      )}
                      <span style={{
                        padding: '4px 8px',
                        backgroundColor: getDifficultyColor(lesson.difficulty),
                        color: '#FFF',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: '500'
                      }}>
                        {lesson.difficulty}
                      </span>
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '16px', fontSize: '14px', color: '#6B7280' }}>
                    <span>{lesson.exercises} exercises</span>
                    <span>{lesson.duration}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'exercises' && (
          <div style={{
            backgroundColor: '#1E1E24',
            borderRadius: '12px',
            padding: '48px',
            textAlign: 'center'
          }}>
            <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}>
              Practice Exercises
            </h3>
            <p style={{ color: '#9CA3AF', marginBottom: '24px' }}>
              Complete lessons to unlock exercises and test your knowledge
            </p>
            <button style={{
              backgroundColor: '#C9A227',
              color: '#0D0D0F',
              padding: '12px 24px',
              borderRadius: '8px',
              fontWeight: 'bold',
              border: 'none',
              cursor: 'pointer'
            }}>
              Start Practice Session
            </button>
          </div>
        )}

        {activeTab === 'grammar' && (
          <div style={{
            backgroundColor: '#1E1E24',
            borderRadius: '12px',
            padding: '24px'
          }}>
            <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '24px' }}>
              Latin Grammar Reference
            </h3>
            
            <div style={{ display: 'grid', gap: '16px' }}>
              <div style={{
                backgroundColor: '#141419',
                padding: '16px',
                borderRadius: '8px',
                border: '1px solid rgba(220,38,38,0.2)'
              }}>
                <h4 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '8px', color: '#DC2626' }}>
                  Noun Declensions
                </h4>
                <p style={{ color: '#9CA3AF', fontSize: '14px' }}>
                  Five declension patterns for Latin nouns with case endings
                </p>
              </div>
              
              <div style={{
                backgroundColor: '#141419',
                padding: '16px',
                borderRadius: '8px',
                border: '1px solid rgba(220,38,38,0.2)'
              }}>
                <h4 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '8px', color: '#DC2626' }}>
                  Verb Conjugations
                </h4>
                <p style={{ color: '#9CA3AF', fontSize: '14px' }}>
                  Four conjugation patterns with tense, mood, and voice forms
                </p>
              </div>
              
              <div style={{
                backgroundColor: '#141419',
                padding: '16px',
                borderRadius: '8px',
                border: '1px solid rgba(220,38,38,0.2)'
              }}>
                <h4 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '8px', color: '#DC2626' }}>
                  Adjective Agreement
                </h4>
                <p style={{ color: '#9CA3AF', fontSize: '14px' }}>
                  How adjectives agree with nouns in case, number, and gender
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}