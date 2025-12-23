'use client';
import React, { useState } from 'react';

export default function Semantia() {
  const [searchTerm, setSearchTerm] = useState('ἀρετή');

  const demoData = {
    word: 'ἀρετή',
    transliteration: 'arete',
    corpusMeaning: 'Excellence of character; virtue; moral goodness; the fulfillment of purpose or function; human flourishing through the actualization of potential.',
    lsjDefinition: 'goodness, excellence, of any kind esp. of manly qualities, manhood, valour, prowess, as in Homer, of moral virtue, as in Plato and Aristotle.',
    semanticNeighbors: [
      { word: 'καλοκἀγαθία', transliteration: 'kalokagathia', meaning: 'nobility of character' },
      { word: 'σοφία', transliteration: 'sophia', meaning: 'wisdom' },
      { word: 'δικαιοσύνη', transliteration: 'dikaiosyne', meaning: 'justice' },
      { word: 'ἀνδρεία', transliteration: 'andreia', meaning: 'courage' },
      { word: 'σωφροσύνη', transliteration: 'sophrosyne', meaning: 'temperance' }
    ],
    usageData: [
      { period: '8th-7th BC', frequency: 12 },
      { period: '6th-5th BC', frequency: 45 },
      { period: '4th BC', frequency: 89 },
      { period: '3rd-1st BC', frequency: 67 },
      { period: '1st-3rd AD', frequency: 34 },
      { period: '4th-6th AD', frequency: 23 }
    ],
    examples: [
      {
        author: 'Aristotle',
        work: 'Nicomachean Ethics',
        passage: 'ἔστιν ἄρα ἡ ἀρετὴ ἕξις προαιρετική, ἐν μεσότητι οὖσα τῇ πρὸς ἡμᾶς',
        translation: 'Virtue is therefore a disposition involving choice, lying in a mean relative to us'
      },
      {
        author: 'Plato',
        work: 'Republic',
        passage: 'οὐκοῦν καὶ ψυχῆς ἀρετήν τινα εἶναί φαμεν καὶ κακίαν;',
        translation: 'Do we not say that there is virtue of the soul and vice?'
      },
      {
        author: 'Homer',
        work: 'Iliad',
        passage: 'αἰεὶ ἀριστεύειν καὶ ὑπείροχον ἔμμεναι ἄλλων',
        translation: 'Always to be the best and to excel above others'
      }
    ]
  };

  const maxFrequency = Math.max(...demoData.usageData.map(d => d.frequency));

  return (
    <div className="min-h-screen bg-[#0D0D0F] text-[#F5F4F2] p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-[#C9A227] to-[#F5F4F2] bg-clip-text text-transparent">
            SEMANTIA
          </h1>
          <p className="text-xl text-[#F5F4F2]/70">Ancient Greek & Latin Semantic Analysis</p>
        </div>

        {/* Search Section */}
        <div className="mb-12">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#1A1A1F] border border-[#2A2A2F] rounded-lg px-6 py-4 text-2xl text-[#F5F4F2] focus:border-[#C9A227] focus:outline-none transition-all duration-300 hover:border-[#C9A227]/50"
              placeholder="Enter Greek or Latin word..."
            />
            <button className="absolute right-4 top-1/2 -translate-y-1/2 bg-[#C9A227] text-[#0D0D0F] px-6 py-2 rounded-lg font-semibold hover:bg-[#C9A227]/90 transition-all duration-300 transform hover:scale-105">
              Analyze
            </button>
          </div>
        </div>

        {/* Main Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Corpus vs LSJ */}
          <div className="bg-[#1A1A1F] rounded-xl p-8 border border-[#2A2A2F] hover:border-[#C9A227]/30 transition-all duration-300 transform hover:-translate-y-1">
            <h2 className="text-2xl font-bold mb-6 text-[#C9A227]">Definition Analysis</h2>
            
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3 text-[#F5F4F2]/90">Corpus Meaning</h3>
              <p className="text-[#F5F4F2]/80 leading-relaxed bg-[#0D0D0F] p-4 rounded-lg border-l-4 border-[#C9A227]">
                {demoData.corpusMeaning}
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3 text-[#F5F4F2]/90">LSJ Definition</h3>
              <p className="text-[#F5F4F2]/80 leading-relaxed bg-[#0D0D0F] p-4 rounded-lg border-l-4 border-[#F5F4F2]/30">
                {demoData.lsjDefinition}
              </p>
            </div>
          </div>

          {/* Semantic Neighbors */}
          <div className="bg-[#1A1A1F] rounded-xl p-8 border border-[#2A2A2F] hover:border-[#C9A227]/30 transition-all duration-300 transform hover:-translate-y-1">
            <h2 className="text-2xl font-bold mb-6 text-[#C9A227]">Semantic Neighbors</h2>
            <div className="space-y-4">
              {demoData.semanticNeighbors.map((neighbor, index) => (
                <div key={index} className="bg-[#0D0D0F] p-4 rounded-lg hover:bg-[#252529] transition-all duration-300 cursor-pointer group">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-lg font-semibold text-[#C9A227] group-hover:text-[#F5F4F2] transition-colors duration-300">
                      {neighbor.word}
                    </span>
                    <span className="text-sm text-[#F5F4F2]/60 italic">
                      {neighbor.transliteration}
                    </span>
                  </div>
                  <p className="text-[#F5F4F2]/80 text-sm">{neighbor.meaning}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Usage Over Time */}
        <div className="bg-[#1A1A1F] rounded-xl p-8 border border-[#2A2A2F] hover:border-[#C9A227]/30 transition-all duration-300 mb-12">
          <h2 className="text-2xl font-bold mb-8 text-[#C9A227]">Usage Frequency Over Time</h2>
          <div className="flex items-end justify-between space-x-4 h-64">
            {demoData.usageData.map((data, index) => {
              const height = (data.frequency / maxFrequency) * 100;
              return (
                <div key={index} className="flex-1 flex flex-col items-center group">
                  <div className="relative flex-1 flex items-end w-full">
                    <div 
                      className="w-full bg-gradient-to-t from-[#C9A227] to-[#C9A227]/70 rounded-t-lg transition-all duration-500 hover:from-[#C9A227]/90 hover:to-[#C9A227] cursor-pointer transform hover:scale-105"
                      style={{ height: `${height}%` }}
                    >
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#0D0D0F] px-2 py-1 rounded text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        {data.frequency}
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 text-xs text-center text-[#F5F4F2]/70 font-medium">
                    {data.period}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Example Passages */}
        <div className="bg-[#1A1A1F] rounded-xl p-8 border border-[#2A2A2F] hover:border-[#C9A227]/30 transition-all duration-300">
          <h2 className="text-2xl font-bold mb-8 text-[#C9A227]">Example Passages</h2>
          <div className="space-y-8">
            {demoData.examples.map((example, index) => (
              <div key={index} className="bg-[#0D0D0F] p-6 rounded-lg border-l-4 border-[#C9A227] hover:bg-[#151518] transition-all duration-300">
                <div className="flex items-center mb-4">
                  <span className="text-[#C9A227] font-semibold mr-3">{example.author}</span>
                  <span className="text-[#F5F4F2]/60 italic">{example.work}</span>
                </div>
                <div className="mb-4">
                  <p className="text-lg text-[#F5F4F2] leading-relaxed mb-2 font-serif">
                    {example.passage}
                  </p>
                  <p className="text-[#F5F4F2]/80 italic">
                    "{example.translation}"
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}