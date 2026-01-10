'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Card, Button, Badge, Modal } from '@/components/ui';
import { formatNumber } from '@/lib/utils';
import { getModuleLessons, hasLessonContent } from '@/lib/lessons';
import { LessonViewer } from '@/components/LessonViewer';

// Curriculum data
const GREEK_MODULES = [
  { id: 'g1', name: 'The Alphabet', description: 'Learn the 24 letters of Greek', lessons: 5, xp: 100, category: 'fundamentals' },
  { id: 'g2', name: 'Pronunciation', description: 'Sound out ancient Greek', lessons: 4, xp: 80, category: 'fundamentals' },
  { id: 'g3', name: 'Basic Vocabulary', description: 'First 50 essential words', lessons: 10, xp: 200, category: 'fundamentals' },
  { id: 'g4', name: 'Articles & Gender', description: 'ὁ, ἡ, τό and noun genders', lessons: 6, xp: 120, category: 'fundamentals' },
  { id: 'g5', name: 'Present Tense', description: 'First verb conjugations', lessons: 8, xp: 160, category: 'verbs' },
  { id: 'g6', name: 'First Declension', description: 'Feminine nouns in -α/-η', lessons: 6, xp: 120, category: 'nouns' },
  { id: 'g7', name: 'Second Declension', description: 'Masculine -ος, neuter -ον', lessons: 6, xp: 120, category: 'nouns' },
  { id: 'g8', name: 'Adjectives', description: 'Agreement and position', lessons: 7, xp: 140, category: 'nouns' },
  { id: 'g9', name: 'Personal Pronouns', description: 'ἐγώ, σύ, αὐτός', lessons: 5, xp: 100, category: 'fundamentals' },
  { id: 'g10', name: 'Imperfect Tense', description: 'Past continuous actions', lessons: 7, xp: 140, category: 'verbs' },
  { id: 'g11', name: 'Third Declension', description: 'Consonant stems', lessons: 10, xp: 200, category: 'nouns' },
  { id: 'g12', name: 'Aorist Tense', description: 'Simple past actions', lessons: 10, xp: 200, category: 'verbs' },
  { id: 'g13', name: 'Middle Voice', description: 'Reflexive and self-interest', lessons: 6, xp: 150, category: 'verbs' },
  { id: 'g14', name: 'Passive Voice', description: 'Being acted upon', lessons: 6, xp: 150, category: 'verbs' },
  { id: 'g15', name: 'Prepositions', description: 'Cases and meanings', lessons: 8, xp: 160, category: 'syntax' },
  { id: 'g16', name: 'Infinitives', description: 'Verbal nouns', lessons: 6, xp: 120, category: 'verbs' },
  { id: 'g17', name: 'Participles I', description: 'Present and aorist', lessons: 10, xp: 200, category: 'verbs' },
  { id: 'g18', name: 'Perfect Tense', description: 'Completed actions', lessons: 8, xp: 180, category: 'verbs' },
  { id: 'g19', name: 'Subjunctive', description: 'Possibility and purpose', lessons: 8, xp: 180, category: 'verbs' },
  { id: 'g20', name: 'Optative', description: 'Wishes and potential', lessons: 6, xp: 150, category: 'verbs' },
  { id: 'g21', name: 'Relative Clauses', description: 'ὅς, ἥ, ὅ constructions', lessons: 6, xp: 140, category: 'syntax' },
  { id: 'g22', name: 'Conditional Sentences', description: 'If-then in Greek', lessons: 8, xp: 180, category: 'syntax' },
  { id: 'g23', name: 'Indirect Discourse', description: 'Reported speech', lessons: 8, xp: 180, category: 'syntax' },
  { id: 'g24', name: 'Purpose Clauses', description: 'ἵνα and final clauses', lessons: 5, xp: 120, category: 'syntax' },
  { id: 'g25', name: 'Fear Clauses', description: 'μή constructions', lessons: 4, xp: 100, category: 'syntax' },
  { id: 'g26', name: 'Result Clauses', description: 'ὥστε and consequence', lessons: 5, xp: 120, category: 'syntax' },
  { id: 'g27', name: 'Participles II', description: 'Genitive absolute', lessons: 6, xp: 150, category: 'syntax' },
  { id: 'g28', name: 'Contract Verbs', description: '-αω, -εω, -οω', lessons: 8, xp: 180, category: 'verbs' },
  { id: 'g29', name: 'MI Verbs', description: 'δίδωμι, τίθημι, ἵστημι', lessons: 10, xp: 250, category: 'verbs' },
  { id: 'g30', name: 'Reading Homer', description: 'Epic dialect features', lessons: 12, xp: 300, category: 'reading' },
  { id: 'g31', name: 'Reading Plato', description: 'Attic prose style', lessons: 12, xp: 300, category: 'reading' },
  { id: 'g32', name: 'Reading NT Greek', description: 'Koine Greek features', lessons: 10, xp: 250, category: 'reading' },
];

const LATIN_MODULES = [
  { id: 'l1', name: 'The Alphabet', description: 'Roman letters and sounds', lessons: 4, xp: 80, category: 'fundamentals' },
  { id: 'l2', name: 'Pronunciation', description: 'Classical Latin sounds', lessons: 4, xp: 80, category: 'fundamentals' },
  { id: 'l3', name: 'Basic Vocabulary', description: 'First 50 essential words', lessons: 10, xp: 200, category: 'fundamentals' },
  { id: 'l4', name: 'First Declension', description: 'Feminine nouns in -a', lessons: 6, xp: 120, category: 'nouns' },
  { id: 'l5', name: 'Second Declension', description: 'Masculine -us, neuter -um', lessons: 6, xp: 120, category: 'nouns' },
  { id: 'l6', name: 'Present Tense', description: 'First conjugations', lessons: 8, xp: 160, category: 'verbs' },
  { id: 'l7', name: 'Adjectives I', description: '1st/2nd declension adj.', lessons: 6, xp: 120, category: 'nouns' },
  { id: 'l8', name: 'Sum & Possum', description: 'To be and to be able', lessons: 5, xp: 100, category: 'verbs' },
  { id: 'l9', name: 'Third Declension', description: 'Consonant & i-stems', lessons: 10, xp: 200, category: 'nouns' },
  { id: 'l10', name: 'Imperfect Tense', description: 'Past continuous', lessons: 6, xp: 120, category: 'verbs' },
  { id: 'l11', name: 'Future Tense', description: 'Simple future actions', lessons: 6, xp: 120, category: 'verbs' },
  { id: 'l12', name: 'Perfect Tense', description: 'Completed past actions', lessons: 8, xp: 160, category: 'verbs' },
  { id: 'l13', name: 'Adjectives II', description: '3rd declension adj.', lessons: 6, xp: 140, category: 'nouns' },
  { id: 'l14', name: '4th & 5th Declension', description: '-us and -es nouns', lessons: 6, xp: 140, category: 'nouns' },
  { id: 'l15', name: 'Personal Pronouns', description: 'ego, tu, is/ea/id', lessons: 5, xp: 100, category: 'fundamentals' },
  { id: 'l16', name: 'Pluperfect & Fut. Perfect', description: 'Past before past', lessons: 6, xp: 140, category: 'verbs' },
  { id: 'l17', name: 'Passive Voice', description: 'Being acted upon', lessons: 8, xp: 160, category: 'verbs' },
  { id: 'l18', name: 'Deponent Verbs', description: 'Passive forms, active meaning', lessons: 5, xp: 120, category: 'verbs' },
  { id: 'l19', name: 'Infinitives', description: 'Present, perfect, future', lessons: 6, xp: 140, category: 'verbs' },
  { id: 'l20', name: 'Participles', description: 'Present, perfect, future', lessons: 10, xp: 200, category: 'verbs' },
  { id: 'l21', name: 'Ablative Absolute', description: 'Independent participle clauses', lessons: 6, xp: 150, category: 'syntax' },
  { id: 'l22', name: 'Relative Clauses', description: 'qui, quae, quod', lessons: 6, xp: 140, category: 'syntax' },
  { id: 'l23', name: 'Subjunctive I', description: 'Present & imperfect', lessons: 8, xp: 180, category: 'verbs' },
  { id: 'l24', name: 'Subjunctive II', description: 'Perfect & pluperfect', lessons: 8, xp: 180, category: 'verbs' },
  { id: 'l25', name: 'Purpose Clauses', description: 'ut/ne + subjunctive', lessons: 5, xp: 120, category: 'syntax' },
  { id: 'l26', name: 'Result Clauses', description: 'ut + subjunctive', lessons: 5, xp: 120, category: 'syntax' },
  { id: 'l27', name: 'Cum Clauses', description: 'Temporal, causal, concessive', lessons: 6, xp: 140, category: 'syntax' },
  { id: 'l28', name: 'Indirect Statement', description: 'Accusative + infinitive', lessons: 8, xp: 180, category: 'syntax' },
  { id: 'l29', name: 'Indirect Question', description: 'Subjunctive questions', lessons: 5, xp: 120, category: 'syntax' },
  { id: 'l30', name: 'Conditionals', description: 'All conditional types', lessons: 10, xp: 220, category: 'syntax' },
  { id: 'l31', name: 'Reading Caesar', description: 'Military prose style', lessons: 12, xp: 300, category: 'reading' },
  { id: 'l32', name: 'Reading Virgil', description: 'Epic poetry features', lessons: 12, xp: 300, category: 'reading' },
];

// Sample vocabulary for flashcards
const VOCABULARY = {
  greek: [
    { word: 'λόγος', meaning: 'word, reason, speech', frequency: 15420 },
    { word: 'θεός', meaning: 'god', frequency: 12850 },
    { word: 'ἄνθρωπος', meaning: 'human being, person', frequency: 8920 },
    { word: 'πόλις', meaning: 'city, city-state', frequency: 7650 },
    { word: 'ψυχή', meaning: 'soul, life, spirit', frequency: 6340 },
    { word: 'κόσμος', meaning: 'order, world, cosmos', frequency: 5280 },
    { word: 'ἀλήθεια', meaning: 'truth', frequency: 4920 },
    { word: 'δίκη', meaning: 'justice, lawsuit', frequency: 4350 },
  ],
  latin: [
    { word: 'res', meaning: 'thing, matter, affair', frequency: 18500 },
    { word: 'vir', meaning: 'man, hero', frequency: 14200 },
    { word: 'animus', meaning: 'soul, spirit, mind', frequency: 11800 },
    { word: 'virtus', meaning: 'virtue, courage, excellence', frequency: 8900 },
    { word: 'amor', meaning: 'love', frequency: 7650 },
    { word: 'bellum', meaning: 'war', frequency: 7200 },
    { word: 'pax', meaning: 'peace', frequency: 5400 },
    { word: 'imperium', meaning: 'command, empire', frequency: 4800 },
  ],
};

// Levels
const LEVELS = [
  { name: 'Novice', minXP: 0, icon: '🌱' },
  { name: 'Initiate', minXP: 500, icon: '📚' },
  { name: 'Student', minXP: 1500, icon: '✏️' },
  { name: 'Scholar', minXP: 3500, icon: '🎓' },
  { name: 'Master', minXP: 7000, icon: '🏛️' },
  { name: 'Sage', minXP: 12000, icon: '🦉' },
  { name: 'Philosophus', minXP: 20000, icon: '👑' },
];

export default function LearnPage() {
  const searchParams = useSearchParams();
  const langParam = searchParams?.get('lang') as 'greek' | 'latin' | null;

  const [selectedLanguage, setSelectedLanguage] = useState<'greek' | 'latin'>(
    langParam === 'latin' ? 'latin' : 'greek'
  );
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [userXP, setUserXP] = useState(0);
  const [completedModules, setCompletedModules] = useState<string[]>([]);
  const [showFlashcards, setShowFlashcards] = useState(false);
  const [flashcardIndex, setFlashcardIndex] = useState(0);
  const [flashcardFlipped, setFlashcardFlipped] = useState(false);
  const [selectedModule, setSelectedModule] = useState<typeof GREEK_MODULES[0] | null>(null);
  const [viewingLesson, setViewingLesson] = useState(false);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);

  // Set language from URL parameter
  useEffect(() => {
    if (langParam === 'greek' || langParam === 'latin') {
      setSelectedLanguage(langParam);
    }
  }, [langParam]);

  // Load progress from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedXP = localStorage.getItem('logos_xp');
      const savedModules = localStorage.getItem('logos_completed_modules');
      if (savedXP) setUserXP(parseInt(savedXP));
      if (savedModules) setCompletedModules(JSON.parse(savedModules));
    }
  }, []);

  // Get current modules
  const modules = selectedLanguage === 'greek' ? GREEK_MODULES : LATIN_MODULES;
  const filteredModules = selectedCategory
    ? modules.filter((m) => m.category === selectedCategory)
    : modules;

  // Calculate level
  const getCurrentLevel = () => {
    for (let i = LEVELS.length - 1; i >= 0; i--) {
      if (userXP >= LEVELS[i].minXP) return LEVELS[i];
    }
    return LEVELS[0];
  };

  const getNextLevel = () => {
    for (const level of LEVELS) {
      if (userXP < level.minXP) return level;
    }
    return LEVELS[LEVELS.length - 1];
  };

  const currentLevel = getCurrentLevel();
  const nextLevel = getNextLevel();
  const progressToNext = nextLevel.minXP > currentLevel.minXP
    ? ((userXP - currentLevel.minXP) / (nextLevel.minXP - currentLevel.minXP)) * 100
    : 100;

  // Complete a module (demo)
  const completeModule = (moduleId: string, xp: number) => {
    if (completedModules.includes(moduleId)) return;

    const newCompleted = [...completedModules, moduleId];
    const newXP = userXP + xp;

    setCompletedModules(newCompleted);
    setUserXP(newXP);

    if (typeof window !== 'undefined') {
      localStorage.setItem('logos_completed_modules', JSON.stringify(newCompleted));
      localStorage.setItem('logos_xp', newXP.toString());
    }
  };

  // Categories
  const categories = [...new Set(modules.map((m) => m.category))];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-b from-[#C9A962]/10 to-transparent py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <h1 className="text-4xl font-bold mb-2">
                <span className="text-[#C9A962]">LEARN</span>
              </h1>
              <p className="text-[#F5F3EF]/70">
                Master ancient languages with real corpus examples
              </p>
            </div>

            {/* XP/Level display */}
            <Card padding="lg" className="min-w-[280px]">
              <div className="flex items-center gap-4">
                <div className="text-4xl">{currentLevel.icon}</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-[#C9A962]">{currentLevel.name}</span>
                    <span className="text-sm text-[#F5F3EF]/50">{formatNumber(userXP)} XP</span>
                  </div>
                  <div className="h-2 bg-[#C9A962]/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#C9A962] transition-all"
                      style={{ width: `${progressToNext}%` }}
                    />
                  </div>
                  <div className="text-xs text-[#F5F3EF]/40 mt-1">
                    {formatNumber(nextLevel.minXP - userXP)} XP to {nextLevel.name}
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Language & Category Selection */}
        <div className="flex flex-wrap gap-4 mb-8">
          <div className="flex gap-2">
            <Button
              variant={selectedLanguage === 'greek' ? 'primary' : 'secondary'}
              onClick={() => setSelectedLanguage('greek')}
            >
              Greek
            </Button>
            <Button
              variant={selectedLanguage === 'latin' ? 'primary' : 'secondary'}
              onClick={() => setSelectedLanguage('latin')}
            >
              Latin
            </Button>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setSelectedCategory('')}
              className={`px-3 py-1 text-sm rounded-full transition ${
                !selectedCategory
                  ? 'bg-[#C9A962]/20 text-[#C9A962]'
                  : 'text-[#F5F3EF]/50 hover:text-[#F5F3EF]'
              }`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 text-sm rounded-full capitalize transition ${
                  selectedCategory === cat
                    ? 'bg-[#C9A962]/20 text-[#C9A962]'
                    : 'text-[#F5F3EF]/50 hover:text-[#F5F3EF]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <Button variant="secondary" onClick={() => setShowFlashcards(true)} className="ml-auto">
            Vocabulary Flashcards
          </Button>
        </div>

        {/* Progress overview */}
        <Card className="mb-8">
          <div className="flex flex-wrap gap-8 p-4">
            <div>
              <div className="text-3xl font-bold text-[#C9A962]">
                {completedModules.filter((id) => id.startsWith(selectedLanguage[0])).length}
                <span className="text-lg text-[#F5F3EF]/50">/{modules.length}</span>
              </div>
              <p className="text-sm text-[#F5F3EF]/50">Modules completed</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-[#C9A962]">
                {modules.reduce((acc, m) => acc + m.lessons, 0)}
              </div>
              <p className="text-sm text-[#F5F3EF]/50">Total lessons</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-[#C9A962]">
                {formatNumber(modules.reduce((acc, m) => acc + m.xp, 0))}
              </div>
              <p className="text-sm text-[#F5F3EF]/50">Total XP available</p>
            </div>
          </div>
        </Card>

        {/* Modules grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredModules.map((module, index) => {
            const isCompleted = completedModules.includes(module.id);
            const isLocked = index > 0 && !completedModules.includes(filteredModules[index - 1]?.id);

            return (
              <Card
                key={module.id}
                variant={isLocked ? 'default' : 'interactive'}
                className={`relative ${isLocked ? 'opacity-50' : ''} ${
                  isCompleted ? 'border-green-500/30' : ''
                }`}
                onClick={() => !isLocked && setSelectedModule(module)}
              >
                {isCompleted && (
                  <div className="absolute top-3 right-3 text-green-400">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}
                {isLocked && (
                  <div className="absolute top-3 right-3 text-[#F5F3EF]/30">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#C9A962]/10 flex items-center justify-center text-[#C9A962] font-bold shrink-0">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-[#C9A962] mb-1">{module.name}</h3>
                    <p className="text-sm text-[#F5F3EF]/60 mb-3">{module.description}</p>
                    <div className="flex items-center gap-4 text-xs text-[#F5F3EF]/40">
                      <span>{module.lessons} lessons</span>
                      <span>{module.xp} XP</span>
                      <Badge size="sm" className="capitalize">{module.category}</Badge>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Daily Challenge */}
        <Card className="mt-12 bg-gradient-to-r from-[#C9A962]/10 to-transparent border-[#C9A962]/30">
          <div className="flex flex-col md:flex-row items-center gap-6 p-6">
            <div className="text-6xl">🔥</div>
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl font-bold text-[#C9A962] mb-2">Daily Challenge</h2>
              <p className="text-[#F5F3EF]/70">
                Complete today's challenge to earn bonus XP and maintain your streak!
              </p>
            </div>
            <Button size="lg">
              Start Challenge
            </Button>
          </div>
        </Card>

        {/* Reading practice */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-[#C9A962] mb-6">Reading Practice</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                title: 'Homer\'s Iliad',
                description: 'Epic poetry - perfect for learning dactylic hexameter',
                difficulty: 'Advanced',
                language: 'greek',
              },
              {
                title: 'Plato\'s Apology',
                description: 'Attic prose - clear philosophical discourse',
                difficulty: 'Intermediate',
                language: 'greek',
              },
              {
                title: 'Caesar\'s Gallic Wars',
                description: 'Military prose - straightforward Latin style',
                difficulty: 'Intermediate',
                language: 'latin',
              },
              {
                title: 'Virgil\'s Aeneid',
                description: 'Epic poetry - masterful Latin verse',
                difficulty: 'Advanced',
                language: 'latin',
              },
            ]
              .filter((r) => r.language === selectedLanguage)
              .map((reading) => (
                <Card key={reading.title} variant="hover">
                  <h3 className="font-semibold text-[#C9A962]">{reading.title}</h3>
                  <p className="text-sm text-[#F5F3EF]/60 mt-1">{reading.description}</p>
                  <div className="flex items-center justify-between mt-4">
                    <Badge>{reading.difficulty}</Badge>
                    <Link href={`/reader?search=${encodeURIComponent(reading.title.split('\'s ')[1])}`}>
                      <Button variant="secondary" size="sm">
                        Start Reading
                      </Button>
                    </Link>
                  </div>
                </Card>
              ))}
          </div>
        </div>
      </div>

      {/* Module detail modal */}
      <Modal
        isOpen={!!selectedModule}
        onClose={() => setSelectedModule(null)}
        title={selectedModule?.name || ''}
        size="lg"
      >
        {selectedModule && (
          <div className="space-y-4">
            <p className="text-[#F5F3EF]/70">{selectedModule.description}</p>

            <div className="grid grid-cols-3 gap-4 py-4 border-y border-[#C9A962]/20">
              <div className="text-center">
                <div className="text-2xl font-bold text-[#C9A962]">{selectedModule.lessons}</div>
                <div className="text-sm text-[#F5F3EF]/50">Lessons</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#C9A962]">{selectedModule.xp}</div>
                <div className="text-sm text-[#F5F3EF]/50">XP Reward</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold capitalize text-[#C9A962]">{selectedModule.category}</div>
                <div className="text-sm text-[#F5F3EF]/50">Category</div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold text-[#C9A962]">What you'll learn:</h4>
              <ul className="list-disc list-inside text-[#F5F3EF]/70 space-y-1">
                <li>Core concepts and patterns</li>
                <li>Practice with real corpus examples</li>
                <li>Interactive exercises</li>
                <li>Vocabulary building</li>
              </ul>
            </div>

            <div className="flex gap-3 pt-4">
              {completedModules.includes(selectedModule.id) ? (
                <Button variant="secondary" className="flex-1" disabled>
                  Completed ✓
                </Button>
              ) : (
                <Button
                  className="flex-1"
                  onClick={() => {
                    if (hasLessonContent(selectedModule.id)) {
                      setCurrentLessonIndex(0);
                      setViewingLesson(true);
                    } else {
                      // Fallback for modules without content yet
                      completeModule(selectedModule.id, selectedModule.xp);
                      setSelectedModule(null);
                    }
                  }}
                >
                  {hasLessonContent(selectedModule.id) ? 'Start Lessons' : 'Start Module'}
                </Button>
              )}
              <Button variant="ghost" onClick={() => setSelectedModule(null)}>
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Lesson Viewer Modal */}
      {selectedModule && viewingLesson && (
        <Modal
          isOpen={viewingLesson}
          onClose={() => {
            setViewingLesson(false);
            setCurrentLessonIndex(0);
          }}
          title={selectedModule.name}
          size="xl"
        >
          {(() => {
            const lessons = getModuleLessons(selectedModule.id);
            if (lessons.length === 0) return <div>No lessons available</div>;

            const currentLesson = lessons[currentLessonIndex];
            return (
              <LessonViewer
                lesson={currentLesson}
                lessonNumber={currentLessonIndex + 1}
                totalLessons={lessons.length}
                hasNext={currentLessonIndex < lessons.length - 1}
                hasPrevious={currentLessonIndex > 0}
                onNext={() => setCurrentLessonIndex(currentLessonIndex + 1)}
                onPrevious={() => setCurrentLessonIndex(currentLessonIndex - 1)}
                onComplete={() => {
                  if (currentLessonIndex === lessons.length - 1) {
                    // Completed all lessons in module
                    completeModule(selectedModule.id, selectedModule.xp);
                    setViewingLesson(false);
                    setSelectedModule(null);
                    setCurrentLessonIndex(0);
                  } else {
                    // Move to next lesson
                    setCurrentLessonIndex(currentLessonIndex + 1);
                  }
                }}
              />
            );
          })()}
        </Modal>
      )}

      {/* Flashcard modal */}
      <Modal
        isOpen={showFlashcards}
        onClose={() => {
          setShowFlashcards(false);
          setFlashcardFlipped(false);
          setFlashcardIndex(0);
        }}
        title="Vocabulary Flashcards"
        size="lg"
      >
        <div className="space-y-6">
          <div className="flex gap-2 justify-center">
            <Button
              variant={selectedLanguage === 'greek' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => {
                setSelectedLanguage('greek');
                setFlashcardIndex(0);
                setFlashcardFlipped(false);
              }}
            >
              Greek
            </Button>
            <Button
              variant={selectedLanguage === 'latin' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => {
                setSelectedLanguage('latin');
                setFlashcardIndex(0);
                setFlashcardFlipped(false);
              }}
            >
              Latin
            </Button>
          </div>

          <div
            onClick={() => setFlashcardFlipped(!flashcardFlipped)}
            className="min-h-[200px] flex items-center justify-center p-8 bg-[#C9A962]/5 border-2 border-[#C9A962]/20 rounded-xl cursor-pointer hover:border-[#C9A962]/40 transition"
          >
            <div className="text-center">
              {flashcardFlipped ? (
                <>
                  <p className="text-xl text-[#F5F3EF]/90">
                    {VOCABULARY[selectedLanguage][flashcardIndex].meaning}
                  </p>
                  <p className="text-sm text-[#F5F3EF]/50 mt-2">
                    Frequency: {formatNumber(VOCABULARY[selectedLanguage][flashcardIndex].frequency)}
                  </p>
                </>
              ) : (
                <p className="text-4xl font-serif text-[#C9A962]">
                  {VOCABULARY[selectedLanguage][flashcardIndex].word}
                </p>
              )}
              <p className="text-xs text-[#F5F3EF]/30 mt-4">Click to flip</p>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => {
                setFlashcardIndex((i) => (i - 1 + VOCABULARY[selectedLanguage].length) % VOCABULARY[selectedLanguage].length);
                setFlashcardFlipped(false);
              }}
            >
              Previous
            </Button>
            <span className="text-[#F5F3EF]/50">
              {flashcardIndex + 1} / {VOCABULARY[selectedLanguage].length}
            </span>
            <Button
              variant="ghost"
              onClick={() => {
                setFlashcardIndex((i) => (i + 1) % VOCABULARY[selectedLanguage].length);
                setFlashcardFlipped(false);
              }}
            >
              Next
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
