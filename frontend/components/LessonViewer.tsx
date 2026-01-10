'use client';

import { useState } from 'react';
import { Card, Button, Badge } from './ui';
import type { Lesson } from '@/lib/lessons';

interface LessonViewerProps {
  lesson: Lesson;
  onComplete: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
  hasNext: boolean;
  hasPrevious: boolean;
  lessonNumber: number;
  totalLessons: number;
}

export function LessonViewer({
  lesson,
  onComplete,
  onNext,
  onPrevious,
  hasNext,
  hasPrevious,
  lessonNumber,
  totalLessons,
}: LessonViewerProps) {
  const [currentExercise, setCurrentExercise] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [exercisesCompleted, setExercisesCompleted] = useState<boolean[]>(
    new Array(lesson.exercises.length).fill(false)
  );

  const handleAnswerSelect = (index: number) => {
    setSelectedAnswer(index);
    setShowExplanation(true);

    const exercise = lesson.exercises[currentExercise];
    if (index === exercise.correct) {
      const newCompleted = [...exercisesCompleted];
      newCompleted[currentExercise] = true;
      setExercisesCompleted(newCompleted);
    }
  };

  const nextExercise = () => {
    if (currentExercise < lesson.exercises.length - 1) {
      setCurrentExercise(currentExercise + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    }
  };

  const previousExercise = () => {
    if (currentExercise > 0) {
      setCurrentExercise(currentExercise - 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    }
  };

  const allExercisesComplete = exercisesCompleted.every(e => e);
  const currentEx = lesson.exercises[currentExercise];

  return (
    <div className="max-w-4xl mx-auto">
      {/* Lesson Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <Badge variant="ghost">
            Lesson {lessonNumber} of {totalLessons}
          </Badge>
          <div className="flex gap-2">
            {hasPrevious && (
              <Button size="sm" variant="secondary" onClick={onPrevious}>
                ← Previous
              </Button>
            )}
            {hasNext && (
              <Button size="sm" variant="secondary" onClick={onNext}>
                Next →
              </Button>
            )}
          </div>
        </div>
        <h1 className="text-3xl font-bold text-[#C9A962] mb-2">{lesson.title}</h1>
      </div>

      {/* Lesson Content */}
      <Card className="mb-6 border-[#C9A962]/30">
        <div className="p-6">
          <div className="prose prose-invert max-w-none">
            <div
              className="text-[#F5F3EF]/90 leading-relaxed whitespace-pre-line"
              dangerouslySetInnerHTML={{
                __html: lesson.content.replace(/\*\*(.*?)\*\*/g, '<strong class="text-[#C9A962]">$1</strong>')
              }}
            />
          </div>

          {/* Examples */}
          {lesson.examples.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-[#C9A962] mb-3">Examples</h3>
              <div className="space-y-3">
                {lesson.examples.map((example, idx) => (
                  <div
                    key={idx}
                    className="bg-[#1A1410]/50 rounded-lg p-4 border border-[#C9A962]/10"
                  >
                    {example.greek && (
                      <div className="text-xl font-serif text-[#C9A962] mb-2">
                        {example.greek}
                      </div>
                    )}
                    {example.latin && (
                      <div className="text-xl font-serif text-[#C9A962] mb-2">
                        {example.latin}
                      </div>
                    )}
                    <div className="text-[#F5F3EF]/80 mb-1">{example.english}</div>
                    {example.source && (
                      <div className="text-sm text-[#F5F3EF]/50 italic">— {example.source}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Vocabulary */}
          {lesson.vocabulary && lesson.vocabulary.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-[#C9A962] mb-3">Vocabulary</h3>
              <div className="grid md:grid-cols-2 gap-3">
                {lesson.vocabulary.map((vocab, idx) => (
                  <div
                    key={idx}
                    className="bg-[#1A1410]/50 rounded-lg p-3 border border-[#C9A962]/10"
                  >
                    <div className="font-serif text-[#C9A962] mb-1">{vocab.word}</div>
                    <div className="text-sm text-[#F5F3EF]/80">{vocab.meaning}</div>
                    {vocab.notes && (
                      <div className="text-xs text-[#F5F3EF]/50 mt-1">{vocab.notes}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Exercises */}
      {lesson.exercises.length > 0 && (
        <Card className="border-[#C9A962]/30">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-[#C9A962]">
                Exercise {currentExercise + 1} of {lesson.exercises.length}
              </h3>
              <div className="flex gap-1">
                {lesson.exercises.map((_, idx) => (
                  <div
                    key={idx}
                    className={`w-2 h-2 rounded-full ${
                      exercisesCompleted[idx]
                        ? 'bg-green-500'
                        : idx === currentExercise
                        ? 'bg-[#C9A962]'
                        : 'bg-[#C9A962]/20'
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="mb-6">
              <p className="text-[#F5F3EF] mb-4 text-lg">{currentEx.question}</p>

              <div className="space-y-2">
                {currentEx.options.map((option, idx) => {
                  const isSelected = selectedAnswer === idx;
                  const isCorrect = idx === currentEx.correct;
                  const showResult = showExplanation;

                  let bgColor = 'bg-[#1A1410]/30 hover:bg-[#C9A962]/10';
                  let borderColor = 'border-[#C9A962]/20';

                  if (showResult && isSelected) {
                    if (isCorrect) {
                      bgColor = 'bg-green-500/20';
                      borderColor = 'border-green-500';
                    } else {
                      bgColor = 'bg-red-500/20';
                      borderColor = 'border-red-500';
                    }
                  } else if (showResult && isCorrect) {
                    bgColor = 'bg-green-500/10';
                    borderColor = 'border-green-500/50';
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => !showExplanation && handleAnswerSelect(idx)}
                      disabled={showExplanation}
                      className={`w-full text-left p-4 rounded-lg border transition-all ${bgColor} ${borderColor} ${
                        showExplanation ? 'cursor-default' : 'cursor-pointer'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full border-2 border-[#C9A962]/30 flex items-center justify-center font-semibold">
                          {String.fromCharCode(65 + idx)}
                        </div>
                        <div className="flex-1 text-[#F5F3EF]">{option}</div>
                        {showResult && isCorrect && (
                          <div className="text-green-500 text-xl">✓</div>
                        )}
                        {showResult && isSelected && !isCorrect && (
                          <div className="text-red-500 text-xl">✗</div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Explanation */}
            {showExplanation && (
              <div className="mb-6 p-4 rounded-lg bg-[#C9A962]/10 border border-[#C9A962]/30">
                <div className="flex items-start gap-2">
                  <div className="text-[#C9A962] text-xl mt-0.5">💡</div>
                  <div>
                    <div className="font-semibold text-[#C9A962] mb-1">Explanation</div>
                    <div className="text-[#F5F3EF]/90 text-sm">{currentEx.explanation}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Exercise Navigation */}
            <div className="flex justify-between items-center">
              <Button
                onClick={previousExercise}
                disabled={currentExercise === 0}
                variant="secondary"
                size="sm"
              >
                ← Previous Question
              </Button>

              <div className="text-sm text-[#F5F3EF]/50">
                {exercisesCompleted.filter(e => e).length} of {lesson.exercises.length} correct
              </div>

              {currentExercise < lesson.exercises.length - 1 ? (
                <Button
                  onClick={nextExercise}
                  variant="secondary"
                  size="sm"
                  disabled={!showExplanation}
                >
                  Next Question →
                </Button>
              ) : (
                <Button
                  onClick={onComplete}
                  disabled={!allExercisesComplete}
                  variant={allExercisesComplete ? 'primary' : 'secondary'}
                  size="sm"
                >
                  {allExercisesComplete ? 'Complete Lesson ✓' : 'Complete All Exercises First'}
                </Button>
              )}
            </div>
          </div>
        </Card>
      )}

      {/* Complete button if no exercises */}
      {lesson.exercises.length === 0 && (
        <div className="flex justify-center">
          <Button onClick={onComplete} size="lg">
            Complete Lesson
          </Button>
        </div>
      )}
    </div>
  );
}
