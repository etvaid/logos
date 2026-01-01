"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

interface Module {
  id: string;
  title: string;
  level: number;
  lessons: number;
}

interface Modules {
  greek: Module[];
  latin: Module[];
}

const LEVELS = [
  { name: "Novice", min_xp: 0, color: "gray" },
  { name: "Discipulus", min_xp: 500, color: "green" },
  { name: "Studiosus", min_xp: 2000, color: "blue" },
  { name: "Doctus", min_xp: 5000, color: "purple" },
  { name: "Magister", min_xp: 10000, color: "yellow" },
  { name: "Philosophus", min_xp: 25000, color: "gold" }
];

export default function LearnPage() {
  const [modules, setModules] = useState<Modules>({ greek: [], latin: [] });
  const [selectedLang, setSelectedLang] = useState<"greek" | "latin">("greek");
  const [userXP, setUserXP] = useState(0);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    fetch("https://logos-backend-production-0d96.up.railway.app/learn/modules")
      .then(r => r.json())
      .then(data => setModules(data))
      .catch(console.error);
  }, []);

  const currentLevel = LEVELS.reduce((acc, level) => 
    userXP >= level.min_xp ? level : acc, LEVELS[0]);
  const nextLevel = LEVELS.find(l => l.min_xp > userXP) || LEVELS[LEVELS.length - 1];
  const progress = nextLevel.min_xp > currentLevel.min_xp 
    ? (userXP - currentLevel.min_xp) / (nextLevel.min_xp - currentLevel.min_xp) * 100 
    : 100;

  const currentModules = modules[selectedLang] || [];

  return (
    <div className="min-h-screen bg-[#0D0D0F] text-[#F5F3EF]">
      <nav className="border-b border-[#C9A962]/20 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-[#C9A962]">LOGOS</Link>
          <span className="text-[#F5F3EF]/70">Learn</span>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto p-8">
        {/* User Stats */}
        <div className="bg-gradient-to-r from-[#C9A962]/20 to-[#C9A962]/5 rounded-lg p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-2xl font-bold">{currentLevel.name}</h2>
              <p className="text-[#F5F3EF]/70">{userXP.toLocaleString()} XP</p>
            </div>
            <div className="text-right">
              <div className="text-3xl">🔥 {streak}</div>
              <p className="text-sm text-[#F5F3EF]/50">day streak</p>
            </div>
          </div>
          <div className="w-full bg-[#0D0D0F] rounded-full h-3">
            <div 
              className="bg-[#C9A962] h-3 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-xs text-[#F5F3EF]/50 mt-1">
            {nextLevel.min_xp - userXP} XP to {nextLevel.name}
          </p>
        </div>

        {/* Language Toggle */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setSelectedLang("greek")}
            className={`px-6 py-3 rounded-lg font-semibold ${
              selectedLang === "greek" 
                ? "bg-blue-500 text-white" 
                : "bg-blue-500/10 text-blue-400"
            }`}
          >
            🇬🇷 Greek (32 modules)
          </button>
          <button
            onClick={() => setSelectedLang("latin")}
            className={`px-6 py-3 rounded-lg font-semibold ${
              selectedLang === "latin" 
                ? "bg-red-500 text-white" 
                : "bg-red-500/10 text-red-400"
            }`}
          >
            🏛️ Latin (32 modules)
          </button>
        </div>

        {/* Modules Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {currentModules.length > 0 ? currentModules.map(mod => (
            <div
              key={mod.id}
              className="p-4 bg-[#C9A962]/5 border border-[#C9A962]/20 rounded-lg hover:border-[#C9A962]/40 transition cursor-pointer"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold">{mod.title}</h3>
                <span className="text-xs px-2 py-1 bg-[#C9A962]/20 rounded">
                  Level {mod.level}
                </span>
              </div>
              <p className="text-sm text-[#F5F3EF]/50">{mod.lessons} lessons</p>
              <div className="mt-2 w-full bg-[#0D0D0F] rounded-full h-2">
                <div className="bg-[#C9A962]/50 h-2 rounded-full" style={{ width: "0%" }}></div>
              </div>
            </div>
          )) : (
            <div className="col-span-3 text-center text-[#F5F3EF]/50 py-8">
              <p>Modules loading...</p>
              <p className="text-sm mt-2">64 modules across Greek and Latin curriculum</p>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid md:grid-cols-3 gap-4">
          <button className="p-4 bg-[#C9A962] text-[#0D0D0F] rounded-lg font-semibold">
            📚 Daily Lesson (+50 XP)
          </button>
          <button className="p-4 bg-[#C9A962]/20 text-[#C9A962] rounded-lg font-semibold">
            🎯 Practice Quiz (+25 XP)
          </button>
          <button className="p-4 bg-[#C9A962]/20 text-[#C9A962] rounded-lg font-semibold">
            📖 Review Flashcards (+10 XP)
          </button>
        </div>
      </div>
    </div>
  );
}
