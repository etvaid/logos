'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Lesson {
  id: string;
  title: string;
  description: string;
  level: string;
  duration: number;
  completed: boolean;
  progress: number;
}

interface UserProgress {
  totalLessons: number;
  completedLessons: number;
  currentStreak: number;
  totalPoints: number;
  level: string;
}

export default function LearnGreekPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
  const [selectedLevel, setSelectedLevel] = useState('beginner');

  useEffect(() => {
    fetchGreekLessons();
  }, [selectedLevel]);

  const fetchGreekLessons = async () => {
    try {
      setLoading(true);
      const [lessonsResponse, progressResponse] = await Promise.all([
        fetch(`/api/lessons/greek?level=${selectedLevel}`),
        fetch('/api/user/progress/greek')
      ]);

      if (!lessonsResponse.ok || !progressResponse.ok) {
        throw new Error('Failed to fetch data');
      }

      const lessonsData = await lessonsResponse.json();
      const progressData = await progressResponse.json();

      setLessons(lessonsData);
      setUserProgress(progressData);
    } catch (err) {
      setError('Failed to load Greek lessons. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner': return '#22C55E';
      case 'intermediate': return '#F59E0B';
      case 'advanced': return '#DC2626';
      default: return '#3B82F6';
    }
  };

  if (loading) {
    return (
      <div style={{ backgroundColor: '#0D0D0F', minHeight: '100vh', color: '#F5F4F2' }}>
        <nav style={{ 
          backgroundColor: '#1E1E24', 
          padding: '16px 24px', 
          borderBottom: '1px solid rgba(201,162,39,0.2)' 
        }}>
          <div style={{ 
            maxWidth: '1200px', 
            margin: '0 auto', 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center' 
          }}>
            <Link href="/" style={{ 
              fontSize: '24px', 
              fontWeight: 'bold', 
              color: '#C9A227', 
              textDecoration: 'none' 
            }}>
              LOGOS
            </Link>
            <div style={{ display: 'flex', gap: '24px' }}>
              <Link href="/learn" style={{ color: '#F5F4F2', textDecoration: 'none' }}>Learn</Link>
              <Link href="/research" style={{ color: '#9CA3AF', textDecoration: 'none' }}>Research</Link>
              <Link href="/texts" style={{ color: '#9CA3AF', textDecoration: 'none' }}>Texts</Link>
            </div>
          </div>
        </nav>

        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '60vh',
          flexDirection: 'column',
          gap: '16px'
        }}>
          <div style={{ 
            width: '48px', 
            height: '48px', 
            border: '4px solid #C9A227', 
            borderTop: '4px solid transparent', 
            borderRadius: '50%', 
            animation: 'spin 1s linear infinite' 
          }}></div>
          <p style={{ color: '#9CA3AF' }}>Loading Greek lessons...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ backgroundColor: '#0D0D0F', minHeight: '100vh', color: '#F5F4F2' }}>
        <nav style={{ 
          backgroundColor: '#1E1E24', 
          padding: '16px 24px', 
          borderBottom: '1px solid rgba(201,162,39,0.2)' 
        }}>
          <div style={{ 
            maxWidth: '1200px', 
            margin: '0 auto', 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center' 
          }}>
            <Link href="/" style={{ 
              fontSize: '24px', 
              fontWeight: 'bold', 
              color: '#C9A227', 
              textDecoration: 'none' 
            }}>
              LOGOS
            </Link>
            <div style={{ display: 'flex', gap: '24px' }}>
              <Link href="/learn" style={{ color: '#F5F4F2', textDecoration: 'none' }}>Learn</Link>
              <Link href="/research" style={{ color: '#9CA3AF', textDecoration: 'none' }}>Research</Link>
              <Link href="/texts" style={{ color: '#9CA3AF', textDecoration: 'none' }}>Texts</Link>
            </div>
          </div>
        </nav>

        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '60vh',
          flexDirection: 'column',
          gap: '16px'
        }}>
          <div style={{ 
            backgroundColor: '#DC2626', 
            color: '#F5F4F2', 
            padding: '16px 24px', 
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <p>{error}</p>
            <button 
              onClick={fetchGreekLessons}
              style={{ 
                backgroundColor: '#C9A227', 
                color: '#0D0D0F', 
                border: 'none', 
                padding: '8px 16px', 
                borderRadius: '6px',
                marginTop: '12px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#0D0D0F', minHeight: '100vh', color: '#F5F4F2' }}>
      <nav style={{ 
        backgroundColor: '#1E1E24', 
        padding: '16px 24px', 
        borderBottom: '1px solid rgba(201,162,39,0.2)' 
      }}>
        <div style={{ 
          maxWidth: '1200px', 
          margin: '0 auto', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center' 
        }}>
          <Link href="/" style={{ 
            fontSize: '24px', 
            fontWeight: 'bold', 
            color: '#C9A227', 
            textDecoration: 'none' 
          }}>
            LOGOS
          </Link>
          <div style={{ display: 'flex', gap: '24px' }}>
            <Link href="/learn" style={{ color: '#F5F4F2', textDecoration: 'none' }}>Learn</Link>
            <Link href="/research" style={{ color: '#9CA3AF', textDecoration: 'none' }}>Research</Link>
            <Link href="/texts" style={{ color: '#9CA3AF', textDecoration: 'none' }}>Texts</Link>
          </div>
        </div>
      </nav>

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <div style={{ 
              width: '4px', 
              height: '32px', 
              backgroundColor: '#3B82F6', 
              borderRadius: '2px' 
            }}></div>
            <h1 style={{ fontSize: '32px', fontWeight: 'bold', margin: '0' }}>Learn Ancient Greek</h1>
          </div>
          <p style={{ color: '#9CA3AF', fontSize: '18px', margin: '0' }}>
            Master the language of Homer, Plato, and the New Testament
          </p>
        </div>

        {userProgress && (
          <div style={{ 
            backgroundColor: '#1E1E24', 
            borderRadius: '12px', 
            padding: '24px',
            marginBottom: '32px',
            border: '1px solid rgba(59,130,246,0.2)'
          }}>
            <h2 style={{ fontSize: '24px', marginBottom: '20px', color: '#3B82F6' }}>Your Progress</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#C9A227' }}>
                  {userProgress.completedLessons}/{userProgress.totalLessons}
                </div>
                <div style={{ color: '#9CA3AF' }}>Lessons Complete</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#22C55E' }}>
                  {userProgress.currentStreak}
                </div>
                <div style={{ color: '#9CA3AF' }}>Day Streak</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#F59E0B' }}>
                  {userProgress.totalPoints}
                </div>
                <div style={{ color: '#9CA3AF' }}>Total Points</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ 
                  fontSize: '20px', 
                  fontWeight: 'bold', 
                  color: getLevelColor(userProgress.level),
                  textTransform: 'capitalize'
                }}>
                  {userProgress.level}
                </div>
                <div style={{ color: '#9CA3AF' }}>Current Level</div>
              </div>
            </div>
          </div>
        )}

        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ fontSize: '24px', marginBottom: '16px' }}>Select Difficulty Level</h2>
          <div style={{ display: 'flex', gap: '12px' }}>
            {['beginner', 'intermediate', 'advanced'].map((level) => (
              <button
                key={level}
                onClick={() => setSelectedLevel(level)}
                style={{
                  padding: '12px 24px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: selectedLevel === level ? '#C9A227' : '#1E1E24',
                  color: selectedLevel === level ? '#0D0D0F' : '#F5F4F2',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  textTransform: 'capitalize',
                  transition: 'all 0.2s'
                }}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        {lessons.length === 0 ? (
          <div style={{ 
            backgroundColor: '#1E1E24', 
            borderRadius: '12px', 
            padding: '48px 24px',
            textAlign: 'center',
            color: '#9CA3AF'
          }}>
            <p style={{ fontSize: '18px', margin: '0' }}>No lessons available for this level yet.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '24px' }}>
            {lessons.map((lesson) => (
              <div
                key={lesson.id}
                style={{
                  backgroundColor: '#1E1E24',
                  borderRadius: '12px',
                  padding: '24px',
                  border: lesson.completed ? '1px solid rgba(34,197,94,0.3)' : '1px solid rgba(59,130,246,0.2)',
                  transition: 'all 0.2s',
                  cursor: 'pointer'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <h3 style={{ fontSize: '20px', fontWeight: 'bold', margin: '0', color: '#F5F4F2' }}>
                    {lesson.title}
                  </h3>
                  <div style={{
                    padding: '4px 8px',
                    borderRadius: '4px',
                    backgroundColor: getLevelColor(lesson.level),
                    color: '#FFFFFF',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    textTransform: 'uppercase'
                  }}>
                    {lesson.level}
                  </div>
                </div>

                <p style={{ color: '#9CA3AF', marginBottom: '16px', lineHeight: '1.5' }}>
                  {lesson.description}
                </p>

                <div style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ color: '#9CA3AF', fontSize: '14px' }}>Progress</span>
                    <span style={{ color: '#9CA3AF', fontSize: '14px' }}>{lesson.progress}%</span>
                  </div>
                  <div style={{ 
                    width: '100%', 
                    height: '6px', 
                    backgroundColor: '#0D0D0F', 
                    borderRadius: '3px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${lesson.progress}%`,
                      height: '100%',
                      backgroundColor: lesson.completed ? '#22C55E' : '#3B82F6',
                      transition: 'width 0.3s'
                    }}></div>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#9CA3AF' }}>
                    <span style={{ fontSize: '14px' }}>⏱️ {lesson.duration} min</span>
                    {lesson.completed && (
                      <span style={{ color: '#22C55E', fontSize: '14px' }}>✓ Completed</span>
                    )}
                  </div>
                  
                  <Link
                    href={`/learn/greek/lesson/${lesson.id}`}
                    style={{
                      backgroundColor: lesson.completed ? '#22C55E' : '#C9A227',
                      color: lesson.completed ? '#FFFFFF' : '#0D0D0F',
                      padding: '8px 16px',
                      borderRadius: '6px',
                      textDecoration: 'none',
                      fontSize: '14px',
                      fontWeight: 'bold',
                      transition: 'all 0.2s'
                    }}
                  >
                    {lesson.completed ? 'Review' : lesson.progress > 0 ? 'Continue' : 'Start'}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}