'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Flashcard {
  id: string;
  question: string;
  answer: string;
  category: string;
  difficulty: number;
  nextReview: string;
  streak: number;
  language: 'Greek' | 'Latin';
}

interface UserProgress {
  totalXP: number;
  level: number;
  streak: number;
  cardsReviewed: number;
}

export default function FlashcardsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [currentCard, setCurrentCard] = useState<Flashcard | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [userProgress, setUserProgress] = useState<UserProgress>({
    totalXP: 0,
    level: 1,
    streak: 0,
    cardsReviewed: 0
  });
  const [sessionStats, setSessionStats] = useState({
    correct: 0,
    incorrect: 0,
    xpGained: 0
  });

  useEffect(() => {
    fetchFlashcards();
    fetchUserProgress();
  }, []);

  const fetchFlashcards = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/flashcards/due');
      if (!response.ok) throw new Error('Failed to fetch flashcards');
      
      const data = await response.json();
      setFlashcards(data.flashcards || []);
      if (data.flashcards && data.flashcards.length > 0) {
        setCurrentCard(data.flashcards[0]);
      }
    } catch (err) {
      setError('Failed to load flashcards');
      // Mock data for demonstration
      const mockCards: Flashcard[] = [
        {
          id: '1',
          question: 'λόγος',
          answer: 'word, reason, account',
          category: 'Vocabulary',
          difficulty: 2,
          nextReview: '2024-01-15T10:00:00Z',
          streak: 3,
          language: 'Greek'
        },
        {
          id: '2',
          question: 'virtus',
          answer: 'virtue, courage, excellence',
          category: 'Vocabulary',
          difficulty: 1,
          nextReview: '2024-01-15T10:00:00Z',
          streak: 1,
          language: 'Latin'
        },
        {
          id: '3',
          question: 'What is the genitive singular of "pater"?',
          answer: 'patris',
          category: 'Grammar',
          difficulty: 2,
          nextReview: '2024-01-15T10:00:00Z',
          streak: 0,
          language: 'Latin'
        }
      ];
      setFlashcards(mockCards);
      setCurrentCard(mockCards[0]);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserProgress = async () => {
    try {
      const response = await fetch('/api/user/progress');
      if (response.ok) {
        const data = await response.json();
        setUserProgress(data);
      } else {
        // Mock data
        setUserProgress({
          totalXP: 2450,
          level: 8,
          streak: 12,
          cardsReviewed: 156
        });
      }
    } catch (err) {
      setUserProgress({
        totalXP: 2450,
        level: 8,
        streak: 12,
        cardsReviewed: 156
      });
    }
  };

  const handleAnswer = async (difficulty: 'easy' | 'medium' | 'hard') => {
    if (!currentCard) return;

    try {
      const xpGained = difficulty === 'easy' ? 10 : difficulty === 'medium' ? 15 : 25;
      
      await fetch('/api/flashcards/answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cardId: currentCard.id,
          difficulty,
          correct: true
        })
      });

      setSessionStats(prev => ({
        correct: prev.correct + 1,
        incorrect: prev.incorrect,
        xpGained: prev.xpGained + xpGained
      }));

      setUserProgress(prev => ({
        ...prev,
        totalXP: prev.totalXP + xpGained,
        cardsReviewed: prev.cardsReviewed + 1,
        streak: prev.streak + 1,
        level: Math.floor((prev.totalXP + xpGained) / 500) + 1
      }));

      nextCard();
    } catch (err) {
      setError('Failed to record answer');
    }
  };

  const handleIncorrect = async () => {
    if (!currentCard) return;

    try {
      await fetch('/api/flashcards/answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cardId: currentCard.id,
          correct: false
        })
      });

      setSessionStats(prev => ({
        correct: prev.correct,
        incorrect: prev.incorrect + 1,
        xpGained: prev.xpGained
      }));

      setUserProgress(prev => ({
        ...prev,
        cardsReviewed: prev.cardsReviewed + 1,
        streak: 0
      }));

      nextCard();
    } catch (err) {
      setError('Failed to record answer');
    }
  };

  const nextCard = () => {
    const remainingCards = flashcards.filter(card => card.id !== currentCard?.id);
    if (remainingCards.length > 0) {
      setCurrentCard(remainingCards[0]);
      setFlashcards(remainingCards);
    } else {
      setCurrentCard(null);
    }
    setShowAnswer(false);
  };

  const resetSession = () => {
    fetchFlashcards();
    setSessionStats({ correct: 0, incorrect: 0, xpGained: 0 });
    setShowAnswer(false);
  };

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        backgroundColor: '#0D0D0F', 
        color: '#F5F4F2',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <nav style={{
          backgroundColor: '#1E1E24',
          padding: '16px 24px',
          borderBottom: '1px solid rgba(201,162,39,0.2)'
        }}>
          <Link href="/" style={{
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#C9A227',
            textDecoration: 'none'
          }}>
            LOGOS
          </Link>
        </nav>
        
        <div style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{
            backgroundColor: '#1E1E24',
            borderRadius: '12px',
            padding: '48px',
            textAlign: 'center'
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              border: '4px solid #C9A227',
              borderTop: '4px solid transparent',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 16px'
            }}></div>
            <p style={{ color: '#9CA3AF' }}>Loading flashcards...</p>
          </div>
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
        borderBottom: '1px solid rgba(201,162,39,0.2)',
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
        
        <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#C9A227' }}>
              {userProgress.totalXP}
            </div>
            <div style={{ fontSize: '12px', color: '#9CA3AF' }}>XP</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#C9A227' }}>
              {userProgress.level}
            </div>
            <div style={{ fontSize: '12px', color: '#9CA3AF' }}>Level</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#C9A227' }}>
              {userProgress.streak}
            </div>
            <div style={{ fontSize: '12px', color: '#9CA3AF' }}>Streak</div>
          </div>
        </div>
      </nav>

      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        padding: '32px 24px'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '32px'
        }}>
          <div>
            <h1 style={{ fontSize: '32px', fontWeight: 'bold', margin: 0 }}>
              Flashcards
            </h1>
            <p style={{ color: '#9CA3AF', margin: '8px 0 0 0' }}>
              Spaced repetition learning system
            </p>
          </div>
          
          <div style={{
            backgroundColor: '#1E1E24',
            borderRadius: '12px',
            padding: '16px 24px',
            display: 'flex',
            gap: '24px'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: '#059669', fontWeight: 'bold' }}>
                {sessionStats.correct}
              </div>
              <div style={{ fontSize: '12px', color: '#9CA3AF' }}>Correct</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: '#DC2626', fontWeight: 'bold' }}>
                {sessionStats.incorrect}
              </div>
              <div style={{ fontSize: '12px', color: '#9CA3AF' }}>Incorrect</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: '#C9A227', fontWeight: 'bold' }}>
                +{sessionStats.xpGained}
              </div>
              <div style={{ fontSize: '12px', color: '#9CA3AF' }}>XP Today</div>
            </div>
          </div>
        </div>

        {error && (
          <div style={{
            backgroundColor: 'rgba(220, 38, 38, 0.1)',
            border: '1px solid #DC2626',
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '24px',
            color: '#DC2626'
          }}>
            {error}
          </div>
        )}

        {currentCard ? (
          <div style={{
            backgroundColor: '#1E1E24',
            borderRadius: '12px',
            padding: '48px',
            textAlign: 'center',
            marginBottom: '24px',
            minHeight: '400px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}>
            <div style={{
              display: 'inline-block',
              backgroundColor: currentCard.language === 'Greek' ? '#3B82F6' : '#DC2626',
              color: '#F5F4F2',
              padding: '4px 12px',
              borderRadius: '16px',
              fontSize: '12px',
              fontWeight: 'bold',
              marginBottom: '24px'
            }}>
              {currentCard.language} • {currentCard.category}
            </div>

            <div style={{
              fontSize: '36px',
              fontWeight: 'bold',
              marginBottom: '32px',
              color: '#F5F4F2',
              lineHeight: 1.2
            }}>
              {currentCard.question}
            </div>

            {showAnswer && (
              <div style={{
                fontSize: '24px',
                color: '#C9A227',
                marginBottom: '32px',
                padding: '24px',
                backgroundColor: '#0D0D0F',
                borderRadius: '8px',
                border: '2px solid #C9A227'
              }}>
                {currentCard.answer}
              </div>
            )}

            {!showAnswer ? (
              <button
                onClick={() => setShowAnswer(true)}
                style={{
                  backgroundColor: '#C9A227',
                  color: '#0D0D0F',
                  border: 'none',
                  padding: '16px 32px',
                  borderRadius: '8px',
                  fontSize: '18px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#E8D5A3'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#C9A227'}
              >
                Show Answer
              </button>
            ) : (
              <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
                <button
                  onClick={handleIncorrect}
                  style={{
                    backgroundColor: '#DC2626',
                    color: '#F5F4F2',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#B91C1C'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#DC2626'}
                >
                  Incorrect
                </button>
                
                <button
                  onClick={() => handleAnswer('hard')}
                  style={{
                    backgroundColor: '#F59E0B',
                    color: '#0D0D0F',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#D97706'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#F59E0B'}
                >
                  Hard (+25 XP)
                </button>
                
                <button
                  onClick={() => handleAnswer('medium')}
                  style={{
                    backgroundColor: '#3B82F6',
                    color: '#F5F4F2',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#2563EB'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#3B82F6'}
                >
                  Medium (+15 XP)
                </button>
                
                <button
                  onClick={() => handleAnswer('easy')}
                  style={{
                    backgroundColor: '#059669',
                    color: '#F5F4F2',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#047857'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#059669'}
                >
                  Easy (+10 XP)
                </button>
              </div>
            )}

            <div style={{
              marginTop: '32px',
              color: '#9CA3AF',
              fontSize: '14px'
            }}>
              {flashcards.length} cards remaining • Streak: {currentCard.streak}
            </div>
          </div>
        ) : (
          <div style={{
            backgroundColor: '#1E1E24',
            borderRadius: '12px',
            padding: '48px',
            textAlign: 'center'
          }}>
            <div style={{
              width: '64px',
              height: '64px',
              backgroundColor: '#C9A227',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px',
              fontSize: '32px'
            }}>
              🎉
            </div>
            
            <h2 style={{
              fontSize: '24px',
              fontWeight: 'bold',
              marginBottom: '16px'
            }}>
              Session Complete!
            </h2>
            
            <p style={{
              color: '#9CA3AF',
              marginBottom: '32px'
            }}>
              Great work! You've completed all available flashcards for today.
            </p>
            
            <div style={{
              backgroundColor: '#0D0D0F',
              borderRadius: '8px',
              padding: '24px',
              marginBottom: '32px',
              display: 'flex',
              justifyContent: 'space-around'
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#059669' }}>
                  {sessionStats.correct}
                </div>
                <div style={{ color: '#9CA3AF', fontSize: '14px' }}>Correct</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#DC2626' }}>
                  {sessionStats.incorrect}
                </div>
                <div style={{ color: '#9CA3AF', fontSize: '14px' }}>Incorrect</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#C9A227' }}>
                  +{sessionStats.xpGained}
                </div>
                <div style={{ color: '#9CA3AF', fontSize: '14px' }}>XP Gained</div>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
              <button
                onClick={resetSession}
                style={{
                  backgroundColor: '#C9A227',
                  color: '#0D0D0F',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#E8D5A3'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#C9A227'}
              >
                Study More
              </button>
              
              <Link
                href="/learn"
                style={{
                  backgroundColor: '#1E1E24',
                  color: '#F5F4F2',
                  border: '1px solid #4B5563',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  fontWeight: 'bold',
                  textDecoration: 'none',
                  transition: 'all 0.2s',
                  display: 'inline-block'
                }}
              >
                Back to Learn
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}