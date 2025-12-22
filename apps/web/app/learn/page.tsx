'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

const API_BASE = 'https://logos-production-ef2b.up.railway.app'

interface Flashcard {
  id: number
  word: string
  language: string
  definition: string
  example_urn?: string
  example_text?: string
}

interface Progress {
  vocabulary_mastered: number
  passages_read: number
  exercises_completed: number
  streak_days: number
  xp_total: number
  level: number
  achievements: string[]
}

export default function LearnPage() {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([])
  const [currentCard, setCurrentCard] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)
  const [progress, setProgress] = useState<Progress | null>(null)
  const [loading, setLoading] = useState(true)
  const [mode, setMode] = useState<'flashcards' | 'quiz' | 'progress'>('flashcards')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [cardsRes, progressRes] = await Promise.all([
        fetch(`${API_BASE}/api/learn/flashcards?limit=20`),
        fetch(`${API_BASE}/api/learn/progress`)
      ])
      const cardsData = await cardsRes.json()
      const progressData = await progressRes.json()
      setFlashcards(cardsData.flashcards || [])
      setProgress(progressData)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleReview = async (quality: number) => {
    if (flashcards.length === 0) return
    
    try {
      await fetch(`${API_BASE}/api/learn/flashcards/review?card_id=${flashcards[currentCard].id}&quality=${quality}`, {
        method: 'POST'
      })
    } catch (err) {
      console.error(err)
    }

    // Move to next card
    setShowAnswer(false)
    if (currentCard < flashcards.length - 1) {
      setCurrentCard(currentCard + 1)
    } else {
      // End of deck
      setCurrentCard(0)
      fetchData()
    }
  }

  const getLevelProgress = () => {
    if (!progress) return 0
    const xpForNextLevel = progress.level * 500
    const currentLevelXp = progress.xp_total % 500
    return (currentLevelXp / xpForNextLevel) * 100
  }

  return (
    <main className="min-h-screen bg-obsidian">
      <nav className="glass border-b border-gold/10 px-6 py-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="font-serif text-2xl font-bold text-gold tracking-widest">LOGOS</Link>
          <div className="flex items-center gap-8">
            <Link href="/search" className="text-marble/70 hover:text-gold transition-colors">Search</Link>
            <Link href="/translate" className="text-marble/70 hover:text-gold transition-colors">Translate</Link>
            <Link href="/discover" className="text-marble/70 hover:text-gold transition-colors">Discover</Link>
            <Link href="/research" className="text-marble/70 hover:text-gold transition-colors">Research</Link>
            <Link href="/learn" className="text-gold">Learn</Link>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="font-serif text-4xl text-gold mb-4">Learn</h1>
          <p className="text-marble/60">Master Greek and Latin with spaced repetition</p>
        </div>

        {/* Mode Tabs */}
        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={() => setMode('flashcards')}
            className={`px-6 py-2 rounded-lg transition-colors ${mode === 'flashcards' ? 'bg-gold text-obsidian' : 'bg-obsidian-light text-marble/70 hover:text-gold'}`}
          >
            📚 Flashcards
          </button>
          <button
            onClick={() => setMode('quiz')}
            className={`px-6 py-2 rounded-lg transition-colors ${mode === 'quiz' ? 'bg-gold text-obsidian' : 'bg-obsidian-light text-marble/70 hover:text-gold'}`}
          >
            🎯 Quiz
          </button>
          <button
            onClick={() => setMode('progress')}
            className={`px-6 py-2 rounded-lg transition-colors ${mode === 'progress' ? 'bg-gold text-obsidian' : 'bg-obsidian-light text-marble/70 hover:text-gold'}`}
          >
            📊 Progress
          </button>
        </div>

        {loading ? (
          <div className="text-center py-16 text-marble/50">Loading...</div>
        ) : (
          <>
            {/* Flashcards Mode */}
            {mode === 'flashcards' && flashcards.length > 0 && (
              <div className="max-w-md mx-auto">
                <div className="text-center text-marble/50 text-sm mb-4">
                  Card {currentCard + 1} of {flashcards.length}
                </div>
                
                <div
                  onClick={() => setShowAnswer(!showAnswer)}
                  className="glass rounded-xl p-8 min-h-[300px] flex flex-col justify-center items-center cursor-pointer hover:border-gold/30 transition-all"
                >
                  <span className={`text-xs px-2 py-1 rounded mb-4 ${flashcards[currentCard].language === 'grc' ? 'bg-blue-500/20 text-blue-400' : 'bg-amber/20 text-amber'}`}>
                    {flashcards[currentCard].language === 'grc' ? 'GREEK' : 'LATIN'}
                  </span>
                  
                  <h2 className="font-greek text-4xl text-gold mb-4">{flashcards[currentCard].word}</h2>
                  
                  {showAnswer ? (
                    <div className="text-center">
                      <p className="text-marble text-xl mb-4">{flashcards[currentCard].definition}</p>
                      {flashcards[currentCard].example_text && (
                        <p className="text-marble/50 text-sm italic">"{flashcards[currentCard].example_text}"</p>
                      )}
                    </div>
                  ) : (
                    <p className="text-marble/40">Click to reveal</p>
                  )}
                </div>

                {showAnswer && (
                  <div className="flex justify-center gap-4 mt-6">
                    <button
                      onClick={() => handleReview(1)}
                      className="px-4 py-2 bg-crimson/20 text-crimson rounded-lg hover:bg-crimson/30 transition-colors"
                    >
                      Again
                    </button>
                    <button
                      onClick={() => handleReview(3)}
                      className="px-4 py-2 bg-amber/20 text-amber rounded-lg hover:bg-amber/30 transition-colors"
                    >
                      Hard
                    </button>
                    <button
                      onClick={() => handleReview(4)}
                      className="px-4 py-2 bg-emerald/20 text-emerald rounded-lg hover:bg-emerald/30 transition-colors"
                    >
                      Good
                    </button>
                    <button
                      onClick={() => handleReview(5)}
                      className="px-4 py-2 bg-gold/20 text-gold rounded-lg hover:bg-gold/30 transition-colors"
                    >
                      Easy
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Progress Mode */}
            {mode === 'progress' && progress && (
              <div className="space-y-6">
                {/* Level & XP */}
                <div className="glass rounded-xl p-6">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <span className="text-marble/50 text-sm">Level</span>
                      <h2 className="text-4xl font-bold text-gold">{progress.level}</h2>
                    </div>
                    <div className="text-right">
                      <span className="text-marble/50 text-sm">Total XP</span>
                      <h2 className="text-2xl text-gold">{progress.xp_total.toLocaleString()}</h2>
                    </div>
                  </div>
                  <div className="w-full bg-obsidian-light rounded-full h-3">
                    <div
                      className="bg-gold rounded-full h-3 transition-all"
                      style={{ width: `${getLevelProgress()}%` }}
                    />
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="glass rounded-xl p-4 text-center">
                    <span className="text-3xl mb-2 block">🔥</span>
                    <p className="text-2xl font-bold text-gold">{progress.streak_days}</p>
                    <p className="text-marble/50 text-sm">Day Streak</p>
                  </div>
                  <div className="glass rounded-xl p-4 text-center">
                    <span className="text-3xl mb-2 block">📚</span>
                    <p className="text-2xl font-bold text-gold">{progress.vocabulary_mastered}</p>
                    <p className="text-marble/50 text-sm">Words Mastered</p>
                  </div>
                  <div className="glass rounded-xl p-4 text-center">
                    <span className="text-3xl mb-2 block">📖</span>
                    <p className="text-2xl font-bold text-gold">{progress.passages_read}</p>
                    <p className="text-marble/50 text-sm">Passages Read</p>
                  </div>
                  <div className="glass rounded-xl p-4 text-center">
                    <span className="text-3xl mb-2 block">✅</span>
                    <p className="text-2xl font-bold text-gold">{progress.exercises_completed}</p>
                    <p className="text-marble/50 text-sm">Exercises Done</p>
                  </div>
                </div>

                {/* Achievements */}
                {progress.achievements && progress.achievements.length > 0 && (
                  <div className="glass rounded-xl p-6">
                    <h3 className="font-serif text-lg text-gold mb-4">Achievements</h3>
                    <div className="flex flex-wrap gap-2">
                      {progress.achievements.map((achievement, i) => (
                        <span key={i} className="px-3 py-2 bg-gold/20 text-gold rounded-lg text-sm">
                          🏆 {achievement}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Quiz Mode Placeholder */}
            {mode === 'quiz' && (
              <div className="text-center py-16">
                <span className="text-6xl mb-4 block">🎯</span>
                <h2 className="font-serif text-2xl text-gold mb-2">Quiz Mode Coming Soon</h2>
                <p className="text-marble/50">Practice with multiple choice and fill-in-the-blank exercises</p>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  )
}
