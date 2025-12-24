'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Exercise {
  id: string;
  type: 'parsing' | 'translation' | 'fill-blank';
  title: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  language: 'greek' | 'latin';
  content: string;
  answer: string;
  options?: string[];
  completed: boolean;
  score?: number;
}

interface UserProgress {
  totalCompleted: number;
  averageScore: number;
  streakDays: number;
  level: string;
}

export default function ExercisesPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [currentExercise, setCurrentExercise] = useState<Exercise | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [exercisesRes, progressRes] = await Promise.all([
        fetch('/api/exercises'),
        fetch('/api/user/progress')
      ]);

      if (!exercisesRes.ok || !progressRes.ok) {
        throw new Error('Failed to fetch data');
      }

      const exercisesData = await exercisesRes.json();
      const progressData = await progressRes.json();

      setExercises(exercisesData.exercises || []);
      setProgress(progressData.progress || null);
    } catch (err) {
      setError('Failed to load exercises');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredExercises = exercises.filter(exercise => {
    if (selectedType !== 'all' && exercise.type !== selectedType) return false;
    if (selectedLanguage !== 'all' && exercise.language !== selectedLanguage) return false;
    if (selectedDifficulty !== 'all' && exercise.difficulty !== selectedDifficulty) return false;
    return true;
  });

  const startExercise = (exercise: Exercise) => {
    setCurrentExercise(exercise);
    setUserAnswer('');
    setShowResult(false);
    setIsCorrect(false);
  };

  const submitAnswer = async () => {
    if (!currentExercise || !userAnswer.trim()) return;

    try {
      const response = await fetch('/api/exercises/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          exerciseId: currentExercise.id,
          answer: userAnswer
        })
      });

      if (!response.ok) throw new Error('Failed to submit answer');

      const result = await response.json();
      setIsCorrect(result.correct);
      setShowResult(true);

      if (result.correct) {
        setExercises(prev => prev.map(ex => 
          ex.id === currentExercise.id 
            ? { ...ex, completed: true, score: result.score }
            : ex
        ));
      }
    } catch (err) {
      console.error('Error submitting answer:', err);
    }
  };

  const closeExercise = () => {
    setCurrentExercise(null);
    setUserAnswer('');
    setShowResult(false);
    fetchData();
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'parsing': return '📝';
      case 'translation': return '🔄';
      case 'fill-blank': return '📋';
      default: return '📚';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return '#059669';
      case 'intermediate': return '#F59E0B';
      case 'advanced': return '#DC2626';
      default: return '#6B7280';
    }
  };

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        backgroundColor: '#0D0D0F', 
        color: '#F5F4F2',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ 
          backgroundColor: '#1E1E24', 
          padding: 40,
          borderRadius: 12,
          textAlign: 'center'
        }}>
          <div style={{ 
            width: 40, 
            height: 40, 
            border: '4px solid #C9A227', 
            borderTop: '4px solid transparent',
            borderRadius: '50%',
            margin: '0 auto 20px',
            animation: 'spin 1s linear infinite'
          }}></div>
          <p style={{ margin: 0, fontSize: 18 }}>Loading exercises...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#0D0D0F', color: '#F5F4F2' }}>
        <nav style={{ 
          backgroundColor: '#1E1E24', 
          padding: '16px 24px',
          borderBottom: '1px solid rgba(201,162,39,0.2)'
        }}>
          <Link href="/" style={{ 
            fontSize: 24, 
            fontWeight: 'bold', 
            color: '#C9A227',
            textDecoration: 'none'
          }}>
            ΛΟΓΟΣ
          </Link>
        </nav>
        
        <div style={{ 
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 'calc(100vh - 73px)',
          padding: 24
        }}>
          <div style={{ 
            backgroundColor: '#1E1E24', 
            padding: 40,
            borderRadius: 12,
            textAlign: 'center',
            maxWidth: 400
          }}>
            <h2 style={{ color: '#DC2626', marginTop: 0 }}>Error Loading Exercises</h2>
            <p style={{ color: '#9CA3AF', marginBottom: 24 }}>{error}</p>
            <button
              onClick={fetchData}
              style={{
                backgroundColor: '#C9A227',
                color: '#0D0D0F',
                border: 'none',
                padding: '12px 24px',
                borderRadius: 8,
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.2s'
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
    <div style={{ minHeight: '100vh', backgroundColor: '#0D0D0F', color: '#F5F4F2' }}>
      <nav style={{ 
        backgroundColor: '#1E1E24', 
        padding: '16px 24px',
        borderBottom: '1px solid rgba(201,162,39,0.2)'
      }}>
        <div style={{ 
          maxWidth: 1200, 
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <Link href="/" style={{ 
            fontSize: 24, 
            fontWeight: 'bold', 
            color: '#C9A227',
            textDecoration: 'none'
          }}>
            ΛΟΓΟΣ
          </Link>
          
          <div style={{ display: 'flex', gap: 24 }}>
            <Link href="/learn" style={{ 
              color: '#F5F4F2', 
              textDecoration: 'none',
              transition: 'color 0.2s'
            }}>
              Learn
            </Link>
            <Link href="/texts" style={{ 
              color: '#F5F4F2', 
              textDecoration: 'none',
              transition: 'color 0.2s'
            }}>
              Texts
            </Link>
            <Link href="/tools" style={{ 
              color: '#F5F4F2', 
              textDecoration: 'none',
              transition: 'color 0.2s'
            }}>
              Tools
            </Link>
          </div>
        </div>
      </nav>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: 24 }}>
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ 
            fontSize: 36, 
            fontWeight: 'bold', 
            marginBottom: 8,
            background: 'linear-gradient(135deg, #C9A227, #E8D5A3)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Practice Exercises
          </h1>
          <p style={{ fontSize: 18, color: '#9CA3AF', margin: 0 }}>
            Master Greek and Latin through interactive practice
          </p>
        </div>

        {progress && (
          <div style={{ 
            backgroundColor: '#1E1E24',
            borderRadius: 12,
            padding: 24,
            marginBottom: 32,
            border: '1px solid rgba(201,162,39,0.2)'
          }}>
            <h2 style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 16 }}>Your Progress</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 28, fontWeight: 'bold', color: '#C9A227' }}>
                  {progress.totalCompleted}
                </div>
                <div style={{ fontSize: 14, color: '#9CA3AF' }}>Exercises Completed</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 28, fontWeight: 'bold', color: '#C9A227' }}>
                  {progress.averageScore}%
                </div>
                <div style={{ fontSize: 14, color: '#9CA3AF' }}>Average Score</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 28, fontWeight: 'bold', color: '#C9A227' }}>
                  {progress.streakDays}
                </div>
                <div style={{ fontSize: 14, color: '#9CA3AF' }}>Day Streak</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 28, fontWeight: 'bold', color: '#C9A227' }}>
                  {progress.level}
                </div>
                <div style={{ fontSize: 14, color: '#9CA3AF' }}>Current Level</div>
              </div>
            </div>
          </div>
        )}

        <div style={{ 
          backgroundColor: '#1E1E24',
          borderRadius: 12,
          padding: 24,
          marginBottom: 32
        }}>
          <h3 style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 16 }}>Filter Exercises</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
            <div>
              <label style={{ display: 'block', marginBottom: 8, fontSize: 14, color: '#9CA3AF' }}>
                Type
              </label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                style={{
                  width: '100%',
                  backgroundColor: '#0D0D0F',
                  border: '1px solid #4B5563',
                  borderRadius: 8,
                  padding: '12px 16px',
                  color: '#F5F4F2',
                  fontSize: 14
                }}
              >
                <option value="all">All Types</option>
                <option value="parsing">Parsing</option>
                <option value="translation">Translation</option>
                <option value="fill-blank">Fill in the Blank</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: 8, fontSize: 14, color: '#9CA3AF' }}>
                Language
              </label>
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                style={{
                  width: '100%',
                  backgroundColor: '#0D0D0F',
                  border: '1px solid #4B5563',
                  borderRadius: 8,
                  padding: '12px 16px',
                  color: '#F5F4F2',
                  fontSize: 14
                }}
              >
                <option value="all">All Languages</option>
                <option value="greek">Greek</option>
                <option value="latin">Latin</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: 8, fontSize: 14, color: '#9CA3AF' }}>
                Difficulty
              </label>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                style={{
                  width: '100%',
                  backgroundColor: '#0D0D0F',
                  border: '1px solid #4B5563',
                  borderRadius: 8,
                  padding: '12px 16px',
                  color: '#F5F4F2',
                  fontSize: 14
                }}
              >
                <option value="all">All Levels</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 24 }}>
          {filteredExercises.map((exercise) => (
            <div
              key={exercise.id}
              style={{ 
                backgroundColor: '#1E1E24',
                borderRadius: 12,
                padding: 24,
                border: exercise.completed ? '1px solid #059669' : '1px solid #4B5563',
                transition: 'all 0.2s',
                cursor: 'pointer',
                position: 'relative'
              }}
              onClick={() => startExercise(exercise)}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#C9A227';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(201,162,39,0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = exercise.completed ? '#059669' : '#4B5563';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {exercise.completed && (
                <div style={{
                  position: 'absolute',
                  top: 12,
                  right: 12,
                  backgroundColor: '#059669',
                  color: 'white',
                  borderRadius: 12,
                  padding: '4px 8px',
                  fontSize: 12,
                  fontWeight: 'bold'
                }}>
                  ✓ {exercise.score}%
                </div>
              )}
              
              <div style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <span style={{ fontSize: 20 }}>{getTypeIcon(exercise.type)}</span>
                  <span style={{ 
                    fontSize: 12, 
                    fontWeight: 'bold',
                    color: exercise.language === 'greek' ? '#3B82F6' : '#DC2626',
                    textTransform: 'uppercase'
                  }}>
                    {exercise.language}
                  </span>
                  <span style={{
                    fontSize: 12,
                    fontWeight: 'bold',
                    color: getDifficultyColor(exercise.difficulty),
                    textTransform: 'uppercase'
                  }}>
                    {exercise.difficulty}
                  </span>
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 'bold', margin: 0, marginBottom: 8 }}>
                  {exercise.title}
                </h3>
                <p style={{ 
                  fontSize: 14, 
                  color: '#9CA3AF', 
                  margin: 0,
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}>
                  {exercise.content}
                </p>
              </div>
              
              <div style={{ 
                fontSize: 12,
                textTransform: 'uppercase',
                fontWeight: 'bold',
                color: '#C9A227'
              }}>
                {exercise.type.replace('-', ' ')}
              </div>
            </div>
          ))}
        </div>

        {filteredExercises.length === 0 && (
          <div style={{ 
            textAlign: 'center',
            padding: 60,
            backgroundColor: '#1E1E24',
            borderRadius: 12
          }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>📚</div>
            <h3 style={{ fontSize: 20, marginBottom: 8 }}>No exercises found</h3>
            <p style={{ color: '#9CA3AF', margin: 0 }}>
              Try adjusting your filters or check back later for new content.
            </p>
          </div>
        )}
      </div>

      {currentExercise && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: 24
        }}>
          <div style={{
            backgroundColor: '#1E1E24',
            borderRadius: 12,
            padding: 32,
            maxWidth: 600,
            width: '100%',
            maxHeight: '80vh',
            overflow: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 24 }}>
              <div>
                <h2 style={{ fontSize: 20, fontWeight: 'bold', margin: 0, marginBottom: 8 }}>
                  {currentExercise.title}
                </h2>
                <div style={{ display: 'flex', gap: 12, fontSize: 12 }}>
                  <span style={{ 
                    color: currentExercise.language === 'greek' ? '#3B82F6' : '#DC2626',
                    textTransform: 'uppercase',
                    fontWeight: 'bold'
                  }}>
                    {currentExercise.language}
                  </span>
                  <span style={{
                    color: getDifficultyColor(currentExercise.difficulty),
                    textTransform: 'uppercase',
                    fontWeight: 'bold'
                  }}>
                    {currentExercise.difficulty}
                  </span>
                </div>
              </div>
              <button
                onClick={closeExercise}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#9CA3AF',
                  fontSize: 24,
                  cursor: 'pointer',
                  padding: 4
                }}
              >
                ×
              </button>
            </div>

            <div style={{ 
              backgroundColor: '#0D0D0F',
              borderRadius: 8,
              padding: 20,
              marginBottom: 24,
              border: '1px solid #4B5563'
            }}>
              <p style={{ fontSize: 16, lineHeight: 1.6, margin: 0 }}>
                {currentExercise.content}
              </p>
            </div>

            {!showResult && (
              <div>
                {currentExercise.type === 'fill-blank' && currentExercise.options ? (
                  <div style={{ display: 'grid', gap: 12, marginBottom: 24 }}>
                    {currentExercise.options.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => setUserAnswer(option)}
                        style={{
                          backgroundColor: userAnswer === option ? '#C9A227' : '#0D0D0F',
                          color: userAnswer === option ? '#0D0D0F' : '#F5F4F2',
                          border: '1px solid #4B5563',
                          borderRadius: 8,
                          padding: 12,
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          textAlign: 'left'
                        }}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                ) : (
                  <textarea
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    placeholder="Enter your answer..."
                    style={{
                      width: '100%',
                      height: 120,
                      backgroundColor: '#0D0D0F',
                      border: '1px solid #4B5563',
                      borderRadius: 8,
                      padding: 12,
                      color: '#F5F4F2',
                      resize: 'vertical',
                      marginBottom: 24,
                      fontSize: 14,
                      fontFamily: 'inherit'
                    }}
                  />
                )}

                <div style={{ display: 'flex', gap: 12 }}>
                  <button
                    onClick={submitAnswer}
                    disabled={!userAnswer.trim()}
                    style={{
                      backgroundColor: userAnswer.trim() ? '#C9A227' : '#4B5563',
                      color: userAnswer.trim() ? '#0D0D0F' : '#9CA3AF',
                      border: 'none',
                      padding: '12px 24px',
                      borderRadius: 8,
                      fontWeight: 'bold',
                      cursor: userAnswer.trim() ? 'pointer' : 'not-allowed',
                      transition: 'all 0.2s'
                    }}
                  >
                    Submit Answer
                  </button>
                  <button
                    onClick={closeExercise}
                    style={{
                      backgroundColor: 'transparent',
                      color: '#9CA3AF',
                      border: '1px solid #4B5563',
                      padding: '12px 24px',
                      borderRadius: 8,
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {showResult && (
              <div style={{ textAlign: 'center' }}>
                <div style={{ 
                  fontSize: 48, 
                  marginBottom: 16,
                  color: isCorrect ? '#059669' : '#DC2626'
                }}>
                  {isCorrect ? '🎉' : '❌'}
                </div>
                <h3 style={{ 
                  fontSize: 20, 
                  marginBottom: 8,
                  color: isCorrect ? '#059669' : '#DC2626'
                }}>
                  {isCorrect ? 'Correct!' : 'Incorrect'}
                </h3>
                <p style={{ color: '#9CA3AF', marginBottom: 16 }}>
                  {isCorrect ? 'Well done! You got it right.' : `The correct answer is: ${currentExercise.answer}`}
                </p>
                <div style={{ 
                  backgroundColor: '#0D0D0F',
                  borderRadius: 8,
                  padding: 16,
                  marginBottom: 24,
                  border: '1px solid #4B5563'
                }}>
                  <div style={{ fontSize: 14, color: '#9CA3AF', marginBottom: 8 }}>Your answer:</div>
                  <div style={{ fontSize: 16 }}>{userAnswer}</div>
                </div>
                <button
                  onClick={closeExercise}
                  style={{
                    backgroundColor: '#C9A227',
                    color: '#0D0D0F',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: 8,
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  Continue
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}