'use client';

import React, { useState } from 'react';

export default function LearnPage() {
  const [currentStreak, setCurrentStreak] = useState(7);
  const [currentXP, setCurrentXP] = useState(1250);
  const [maxXP, setMaxXP] = useState(2000);
  const [selectedQuizAnswer, setSelectedQuizAnswer] = useState<number | null>(null);
  const [quizAnswered, setQuizAnswered] = useState(false);

  const vocabularyWords = [
    { greek: "μῆνις", transliteration: "mēnis", english: "wrath, anger", difficulty: "advanced" },
    { greek: "σοφία", transliteration: "sophia", english: "wisdom", difficulty: "intermediate" },
    { greek: "ἀρετή", transliteration: "aretē", english: "virtue, excellence", difficulty: "advanced" },
    { greek: "λόγος", transliteration: "logos", english: "word, reason", difficulty: "intermediate" },
    { greek: "φιλία", transliteration: "philia", english: "friendship, love", difficulty: "beginner" },
    { greek: "πόλις", transliteration: "polis", english: "city-state", difficulty: "beginner" },
    { greek: "ψυχή", transliteration: "psychē", english: "soul, mind", difficulty: "intermediate" },
    { greek: "κόσμος", transliteration: "kosmos", english: "universe, order", difficulty: "intermediate" },
    { greek: "ἀλήθεια", transliteration: "alētheia", english: "truth", difficulty: "advanced" },
    { greek: "δικαιοσύνη", transliteration: "dikaiosynē", english: "justice", difficulty: "advanced" }
  ];

  const quizOptions = [
    "anger, wrath",
    "wisdom",
    "friendship",
    "truth"
  ];

  const correctAnswer = 0;

  const handleQuizAnswer = (index: number) => {
    if (quizAnswered) return;
    setSelectedQuizAnswer(index);
    setQuizAnswered(true);
    if (index === correctAnswer) {
      setCurrentXP(prev => Math.min(prev + 50, maxXP));
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-400';
      case 'intermediate': return 'text-yellow-400';
      case 'advanced': return 'text-red-400';
      default: return 'text-[#F5F4F2]';
    }
  };

  return (
    <div className="min-h-screen bg-[#0D0D0F] text-[#F5F4F2] p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 text-[#C9A227]">Daily Learning</h1>
          <p className="text-lg opacity-80">Expand your ancient Greek vocabulary</p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Streak Counter */}
          <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl p-6 border border-gray-700/50 hover:border-[#C9A227]/30 transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#C9A227] rounded-full flex items-center justify-center">
                <span className="text-2xl">🔥</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-[#C9A227]">Learning Streak</h3>
                <p className="text-3xl font-bold">{currentStreak} days</p>
              </div>
            </div>
          </div>

          {/* XP Progress */}
          <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl p-6 border border-gray-700/50 hover:border-[#C9A227]/30 transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#C9A227] rounded-full flex items-center justify-center">
                <span className="text-2xl">⚡</span>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-[#C9A227] mb-2">Experience Points</h3>
                <div className="w-full bg-gray-700 rounded-full h-3 mb-2">
                  <div 
                    className="bg-gradient-to-r from-[#C9A227] to-yellow-300 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${(currentXP / maxXP) * 100}%` }}
                  ></div>
                </div>
                <p className="text-sm opacity-80">{currentXP} / {maxXP} XP</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Word of the Day */}
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl p-8 border border-gray-700/50 hover:border-[#C9A227]/30 transition-all duration-300">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-2xl">📚</span>
                <h2 className="text-2xl font-bold text-[#C9A227]">Word of the Day</h2>
              </div>
              
              <div className="text-center mb-6">
                <div className="text-6xl font-bold mb-4 text-[#C9A227]">μῆνις</div>
                <div className="text-2xl mb-2 opacity-80">mēnis</div>
                <div className="text-xl text-[#C9A227]">wrath, anger</div>
              </div>

              <div className="bg-gray-800/30 rounded-xl p-4 mb-4">
                <p className="text-sm opacity-80 leading-relaxed">
                  <span className="text-[#C9A227] font-semibold">Etymology:</span> From Proto-Indo-European *men- meaning "to think" or "mind". 
                  This word appears as the very first word of Homer's Iliad: "μῆνιν ἄειδε θεὰ" (Sing, goddess, of the wrath...)
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-[#C9A227]/20 text-[#C9A227] rounded-full text-sm">Epic Poetry</span>
                <span className="px-3 py-1 bg-[#C9A227]/20 text-[#C9A227] rounded-full text-sm">Emotion</span>
                <span className="px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-sm">Advanced</span>
              </div>
            </div>

            {/* Quiz Section */}
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl p-8 border border-gray-700/50">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-2xl">🧠</span>
                <h2 className="text-2xl font-bold text-[#C9A227]">Quick Quiz</h2>
              </div>

              <div className="mb-6">
                <p className="text-xl mb-4">What does <span className="text-[#C9A227] font-bold">μῆνις</span> mean?</p>
                <div className="space-y-3">
                  {quizOptions.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuizAnswer(index)}
                      disabled={quizAnswered}
                      className={`w-full p-4 text-left rounded-xl border transition-all duration-300 ${
                        quizAnswered
                          ? index === correctAnswer
                            ? 'bg-green-500/20 border-green-500 text-green-400'
                            : selectedQuizAnswer === index
                            ? 'bg-red-500/20 border-red-500 text-red-400'
                            : 'bg-gray-700/30 border-gray-600 opacity-50'
                          : 'bg-gray-700/30 border-gray-600 hover:border-[#C9A227] hover:bg-[#C9A227]/10'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              {quizAnswered && (
                <div className="text-center">
                  {selectedQuizAnswer === correctAnswer ? (
                    <div className="text-green-400">
                      <span className="text-2xl">🎉</span>
                      <p className="text-lg font-semibold">Correct! +50 XP</p>
                    </div>
                  ) : (
                    <div className="text-red-400">
                      <span className="text-2xl">❌</span>
                      <p className="text-lg font-semibold">Not quite. Keep studying!</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Vocabulary List */}
          <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-2xl p-6 border border-gray-700/50 h-fit">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-2xl">📖</span>
              <h2 className="text-xl font-bold text-[#C9A227]">Vocabulary Bank</h2>
            </div>

            <div className="space-y-3">
              {vocabularyWords.map((word, index) => (
                <div
                  key={index}
                  className="p-4 bg-gray-800/30 rounded-xl border border-gray-700/50 hover:border-[#C9A227]/30 transition-all duration-300 cursor-pointer group"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="text-lg font-bold text-[#C9A227] group-hover:text-yellow-300 transition-colors">
                      {word.greek}
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${getDifficultyColor(word.difficulty)} bg-current/10`}>
                      {word.difficulty}
                    </span>
                  </div>
                  <div className="text-sm opacity-70 mb-1">{word.transliteration}</div>
                  <div className="text-sm">{word.english}</div>
                </div>
              ))}
            </div>

            <div className="mt-6 text-center">
              <button className="w-full py-3 bg-[#C9A227] text-[#0D0D0F] rounded-xl font-semibold hover:bg-yellow-300 transition-all duration-300 transform hover:scale-105">
                Practice All Words
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}