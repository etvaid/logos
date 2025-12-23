'use client';
import React, { useState } from 'react';

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('justice');
  const [selectedLanguage, setSelectedLanguage] = useState('All');

  const languages = ['All', 'Greek', 'Latin'];

  const searchResults = [
    {
      id: 1,
      originalText: "δικαιοσύνη δὲ ἀρετή τις εἶναι δοκεῖ καὶ ὁ δίκαιος δίκαιος",
      translation: "Justice seems to be a virtue, and the just person is just",
      author: "Aristotle",
      work: "Nicomachean Ethics",
      book: "Book V, Chapter 1",
      language: "Greek",
      relevanceScore: 98,
      context: "On the nature of justice and virtue"
    },
    {
      id: 2,
      originalText: "iustitia est constans et perpetua voluntas ius suum cuique tribuendi",
      translation: "Justice is the constant and perpetual will to give each person his due",
      author: "Justinian",
      work: "Institutes",
      book: "Book I, Title I",
      language: "Latin",
      relevanceScore: 96,
      context: "Definition of justice in Roman law"
    },
    {
      id: 3,
      originalText: "τὸ δίκαιον ἄρα μεσότης τίς ἐστιν, οὐχὶ τὸν αὐτὸν τρόπον τοῖς ἄλλαις ἀρεταῖς",
      translation: "Justice is therefore a mean, but not in the same way as the other virtues",
      author: "Aristotle",
      work: "Nicomachean Ethics",
      book: "Book V, Chapter 5",
      language: "Greek",
      relevanceScore: 94,
      context: "Justice as a mean between extremes"
    },
    {
      id: 4,
      originalText: "summum ius summa iniuria",
      translation: "The highest law is the highest injustice",
      author: "Cicero",
      work: "De Officiis",
      book: "Book I, Chapter 10",
      language: "Latin",
      relevanceScore: 89,
      context: "On the application of strict law"
    }
  ];

  const filteredResults = selectedLanguage === 'All' 
    ? searchResults 
    : searchResults.filter(result => result.language === selectedLanguage);

  return (
    <div className="min-h-screen bg-[#0D0D0F] text-[#F5F4F2]">
      <div className="container mx-auto px-6 py-12 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-[#F5F4F2] via-[#C9A227] to-[#F5F4F2] bg-clip-text text-transparent">
            Semantic Search
          </h1>
          <p className="text-xl text-[#F5F4F2]/70">
            Discover wisdom across ancient texts with AI-powered search
          </p>
        </div>

        {/* Search Section */}
        <div className="mb-12">
          <div className="relative mb-8">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search 1.7 million passages..."
              className="w-full px-8 py-6 text-2xl bg-[#1A1A1F] border-2 border-[#2A2A35] rounded-2xl text-[#F5F4F2] placeholder-[#F5F4F2]/50 focus:outline-none focus:border-[#C9A227] focus:ring-4 focus:ring-[#C9A227]/20 transition-all duration-300"
            />
            <div className="absolute right-6 top-1/2 transform -translate-y-1/2">
              <div className="w-8 h-8 bg-[#C9A227] rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-[#0D0D0F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Language Filters */}
          <div className="flex gap-4 justify-center mb-8">
            {languages.map((language) => (
              <button
                key={language}
                onClick={() => setSelectedLanguage(language)}
                className={`px-8 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 ${
                  selectedLanguage === language
                    ? 'bg-[#C9A227] text-[#0D0D0F] shadow-lg shadow-[#C9A227]/30'
                    : 'bg-[#1A1A1F] text-[#F5F4F2] hover:bg-[#2A2A35] border border-[#2A2A35]'
                }`}
              >
                {language}
              </button>
            ))}
          </div>

          {/* Results Count */}
          <div className="text-center mb-8">
            <p className="text-[#F5F4F2]/70">
              Found <span className="text-[#C9A227] font-semibold">{filteredResults.length.toLocaleString()}</span> passages matching "{searchQuery}"
            </p>
          </div>
        </div>

        {/* Search Results */}
        <div className="space-y-8">
          {filteredResults.map((result) => (
            <div
              key={result.id}
              className="bg-[#1A1A1F] border border-[#2A2A35] rounded-2xl p-8 hover:border-[#C9A227]/50 hover:shadow-lg hover:shadow-[#C9A227]/10 transition-all duration-300 transform hover:-translate-y-1"
            >
              {/* Result Header */}
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    result.language === 'Greek' 
                      ? 'bg-blue-500/20 text-blue-400' 
                      : 'bg-purple-500/20 text-purple-400'
                  }`}>
                    {result.language}
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-[#C9A227] rounded-full"></div>
                    <span className="text-[#C9A227] font-semibold">{result.relevanceScore}% match</span>
                  </div>
                </div>
              </div>

              {/* Original Text */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-[#C9A227] mb-2 uppercase tracking-wider">Original Text</h3>
                <p className="text-2xl font-serif leading-relaxed text-[#F5F4F2] italic">
                  "{result.originalText}"
                </p>
              </div>

              {/* Translation */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-[#C9A227] mb-2 uppercase tracking-wider">Translation</h3>
                <p className="text-xl leading-relaxed text-[#F5F4F2]/90">
                  "{result.translation}"
                </p>
              </div>

              {/* Source Information */}
              <div className="flex flex-wrap gap-6 text-[#F5F4F2]/70">
                <div>
                  <span className="font-semibold text-[#F5F4F2]">{result.author}</span>
                </div>
                <div>
                  <span className="italic">{result.work}</span>
                </div>
                <div>
                  <span>{result.book}</span>
                </div>
              </div>

              {/* Context */}
              <div className="mt-4 pt-4 border-t border-[#2A2A35]">
                <p className="text-sm text-[#F5F4F2]/60">
                  Context: {result.context}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Load More Button */}
        <div className="text-center mt-12">
          <button className="px-12 py-4 bg-gradient-to-r from-[#C9A227] to-[#E6B82E] text-[#0D0D0F] font-bold rounded-xl hover:shadow-lg hover:shadow-[#C9A227]/30 transform hover:scale-105 transition-all duration-300">
            Load More Results
          </button>
        </div>
      </div>
    </div>
  );
}