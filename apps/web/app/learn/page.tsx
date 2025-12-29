'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Module {
  id: number;
  title: string;
  language: 'greek' | 'latin';
  level: number;
  totalLessons: number;
  completedLessons: number;
  isLocked: boolean;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: number;
  icon: string;
}

interface Lesson {
  id: number;
  moduleId: number;
  title: string;
  type: 'vocabulary' | 'grammar' | 'translation' | 'reading';
  isCompleted: boolean;
  isLocked: boolean;
  xpReward: number;
  difficulty: number;
}

interface UserStats {
  totalXP: number;
  currentLevel: number;
  xpToNextLevel: number;
  maxLevelXP: number;
  currentStreak: number;
  longestStreak: number;
  totalLessonsCompleted: number;
  totalHoursLearned: number;
  achievements: Achievement[];
  recentActivity: Activity[];
}

interface Achievement {
  id: number;
  title: string;
  description: string;
  icon: string;
  isUnlocked: boolean;
  unlockedAt?: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface Activity {
  id: number;
  type: 'lesson_completed' | 'achievement_unlocked' | 'streak_milestone';
  title: string;
  timestamp: string;
  xpGained: number;
}

interface LeaderboardEntry {
  id: number;
  username: string;
  level: number;
  totalXP: number;
  weeklyXP: number;
  avatar: string;
  isCurrentUser: boolean;
}

export default function LearnPage() {
  const [modules, setModules] = useState<Module[]>([]);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [moduleLessons, setModuleLessons] = useState<Lesson[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [lessonsLoading, setLessonsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'greek' | 'latin'>('all');
  const [difficultyFilter, setDifficultyFilter] = useState<'all' | 'beginner' | 'intermediate' | 'advanced'>('all');
  const [showAchievements, setShowAchievements] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(true);

  const userId = 1;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [modulesResponse, statsResponse, leaderboardResponse] = await Promise.all([
          fetch('http://localhost:8000/learn/modules'),
          fetch(`http://localhost:8000/learn/user/${userId}/stats`),
          fetch('http://localhost:8000/learn/leaderboard')
        ]);
        
        if (!modulesResponse.ok || !statsResponse.ok || !leaderboardResponse.ok) {
          throw new Error('Failed to fetch data');
        }
        
        const [modulesData, statsData, leaderboardData] = await Promise.all([
          modulesResponse.json(),
          statsResponse.json(),
          leaderboardResponse.json()
        ]);
        
        setModules(modulesData);
        setUserStats(statsData);
        setLeaderboard(leaderboardData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load learning data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [userId]);

  const fetchModuleLessons = async (moduleId: number) => {
    try {
      setLessonsLoading(true);
      const response = await fetch(`http://localhost:8000/learn/modules/${moduleId}/lessons`);
      if (!response.ok) throw new Error('Failed to fetch lessons');
      const data = await response.json();
      setModuleLessons(data);
    } catch (err) {
      console.error('Failed to fetch lessons:', err);
    } finally {
      setLessonsLoading(false);
    }
  };

  const handleModuleClick = (module: Module) => {
    if (!module.isLocked) {
      setSelectedModule(module);
      fetchModuleLessons(module.id);
    }
  };

  const getLanguageColor = (language: 'greek' | 'latin') => language === 'greek' ? 'text-[#5BA4E8]' : 'text-[#E85B5B]';
  const getDifficultyColor = (difficulty: 'beginner' | 'intermediate' | 'advanced') => {
    switch (difficulty) {
      case 'beginner': return 'text-green-400';
      case 'intermediate': return 'text-[#C9A962]';
      case 'advanced': return 'text-red-400';
    }
  };
  const getRarityColor = (rarity: 'common' | 'rare' | 'epic' | 'legendary') => {
    switch (rarity) {
      case 'common': return 'text-gray-400';
      case 'rare': return 'text-[#5BA4E8]';
      case 'epic': return 'text-[#C9A962]';
      case 'legendary': return 'text-[#E85B5B]';
    }
  };
  const getProgressPercentage = (completed: number, total: number) => total > 0 ? (completed / total) * 100 : 0;
  const getLevelProgress = () => userStats ? (userStats.maxLevelXP > 0 ? (userStats.xpToNextLevel / userStats.maxLevelXP) * 100 : 0) : 0;

  const filteredModules = modules.filter(module => {
    if (filter !== 'all' && module.language !== filter) return false;
    if (difficultyFilter !== 'all' && module.difficulty !== difficultyFilter) return false;
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0D0D0F] text-[#F5F3EF] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-2 border-[#C9A962]/20 border-t-[#C9A962] rounded-full mx-auto mb-4"></div>
          <p className="text-[#F5F3EF]/70">Loading your learning journey...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0D0D0F] text-[#F5F3EF] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#E85B5B] mb-4">Error: {error}</p>
          <button onClick={() => window.location.reload()} className="px-4 py-2 bg-[#C9A962] text-[#0D0D0F] rounded-lg font-semibold hover:bg-[#C9A962]/90 transition-all">Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0D0D0F] text-[#F5F3EF]">
      <nav className="border-b border-[#C9A962]/20 bg-[#0D0D0F]/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-8">
              <Link href="/" className="text-2xl font-bold text-[#C9A962]">LOGOS</Link>
              <div className="hidden md:flex space-x-6">
                <Link href="/reader" className="text-[#F5F3EF]/70 hover:text-[#F5F3EF] transition-colors">Reader</Link>
                <Link href="/semantia" className="text-[#F5F3EF]/70 hover:text-[#F5F3EF] transition-colors">SEMANTIA</Link>
                <Link href="/translate" className="text-[#F5F3EF]/70 hover:text-[#F5F3EF] transition-colors">Translate</Link>
                <Link href="/learn" className="text-[#C9A962] font-semibold">Learn</Link>
                <Link href="/discovery" className="text-[#F5F3EF]/70 hover:text-[#F5F3EF] transition-colors">Discovery</Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        <div className={`flex-1 transition-all duration-300 ${showLeaderboard ? 'mr-80' : ''}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
              <h1 className="text-4xl md:text-5xl font-bold text-[#C9A962] mb-4 font-serif">Learn</h1>
              
              {userStats && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                  <div className="bg-[#C9A962]/5 rounded-lg border border-[#C9A962]/20 p-6">
                    <div className="text-2xl font-bold text-[#C9A962] mb-2">Level {userStats.currentLevel}</div>
                    <div className="text-[#F5F3EF]/70 mb-3">{userStats.totalXP.toLocaleString()} XP</div>
                    <div className="w-full bg-[#0D0D0F] rounded-full h-2">
                      <div className="bg-[#C9A962] h-2 rounded-full transition-all" style={{ width: `${getLevelProgress()}%` }}></div>
                    </div>
                    <div className="text-[#F5F3EF]/50 text-sm mt-2">{userStats.xpToNextLevel} XP to next level</div>
                  </div>
                  <div className="bg-[#C9A962]/5 rounded-lg border border-[#C9A962]/20 p-6">
                    <div className="flex items-center mb-2">
                      <span className="text-2xl mr-2">🔥</span>
                      <div className="text-2xl font-bold text-[#C9A962]">{userStats.currentStreak}</div>
                    </div>
                    <div className="text-[#F5F3EF]/70">Day Streak</div>
                    <div className="text-[#F5F3EF]/50 text-sm mt-2">Best: {userStats.longestStreak} days</div>
                  </div>
                  <div className="bg-[#C9A962]/5 rounded-lg border border-[#C9A962]/20 p-6">
                    <div className="text-2xl font-bold text-[#C9A962] mb-2">{userStats.totalLessonsCompleted}</div>
                    <div className="text-[#F5F3EF]/70">Lessons Completed</div>
                    <div className="text-[#F5F3EF]/50 text-sm mt-2">{userStats.totalHoursLearned}h learned</div>
                  </div>
                  <div className="bg-[#C9A962]/5 rounded-lg border border-[#C9A962]/20 p-6">
                    <div className="text-2xl font-bold text-[#C9A962] mb-2">{userStats.achievements.filter(a => a.isUnlocked).length}</div>
                    <div className="text-[#F5F3EF]/70">Achievements</div>
                    <button onClick={() => setShowAchievements(true)} className="text-[#F5F3EF]/50 text-sm mt-2 hover:text-[#C9A962] transition-colors">View all →</button>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-[#C9A962]/5 rounded-lg border border-[#C9A962]/20 p-6 mb-8">
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div>
                    <label className="block text-[#F5F3EF]/70 text-sm mb-2">Language</label>
                    <select value={filter} onChange={(e) => setFilter(e.target.value as 'all' | 'greek' | 'latin')} className="px-3 py-2 bg-[#0D0D0F] border border-[#C9A962]/20 rounded-lg text-[#F5F3EF] focus:outline-none focus:border-[#C9A962]/40">
                      <option value="all">All Languages</option>
                      <option value="greek">Greek</option>
                      <option value="latin">Latin</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[#F5F3EF]/70 text-sm mb-2">Difficulty</label>
                    <select value={difficultyFilter} onChange={(e) => setDifficultyFilter(e.target.value as 'all' | 'beginner' | 'intermediate' | 'advanced')} className="px-3 py-2 bg-[#0D0D0F] border border-[#C9A962]/20