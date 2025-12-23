'use client';
import React, { useState } from 'react';

export default function TranslatePage() {
  const [inputText, setInputText] = useState('μῆνιν ἄειδε, θεά, Πηληϊάδεω Ἀχιλῆος');
  const [selectedStyle, setSelectedStyle] = useState('Literary');
  const [translation, setTranslation] = useState('Sing, goddess, the rage of Achilles, son of Peleus');
  const [qualityScore] = useState(85);

  const translationStyles = ['Literal', 'Literary', 'Student'];

  const translations = {
    'μῆνιν ἄειδε, θεά, Πηληϊάδεω Ἀχιλῆος': {
      'Literal': 'Wrath sing, goddess, of Peleus-son Achilles',
      'Literary': 'Sing, goddess, the rage of Achilles, son of Peleus',
      'Student': 'Goddess, sing about the anger of Achilles, who was Peleus\'s son'
    }
  };

  const handleTranslate = () => {
    const result = translations[inputText]?.[selectedStyle] || `${selectedStyle} translation of: "${inputText}"`;
    setTranslation(result);
  };

  return (
    <div className="min-h-screen bg-[#0D0D0F] text-[#F5F4F2] p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-[#F5F4F2] to-[#C9A227] bg-clip-text text-transparent">
            Classical Translator
          </h1>
          <p className="text-xl text-[#F5F4F2]/70">
            Translate ancient Greek and Latin with scholarly precision
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            <div className="bg-[#1A1A1C] rounded-2xl p-6 border border-[#C9A227]/20 hover:border-[#C9A227]/40 transition-all duration-300">
              <label className="block text-lg font-semibold mb-4 text-[#C9A227]">
                Source Text (Greek/Latin)
              </label>
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="w-full h-40 bg-[#0D0D0F] border border-[#F5F4F2]/20 rounded-xl p-4 text-[#F5F4F2] text-lg leading-relaxed resize-none focus:outline-none focus:border-[#C9A227] focus:ring-2 focus:ring-[#C9A227]/20 transition-all duration-300"
                placeholder="Enter Greek or Latin text..."
              />
            </div>

            {/* Style Selection */}
            <div className="bg-[#1A1A1C] rounded-2xl p-6 border border-[#C9A227]/20">
              <label className="block text-lg font-semibold mb-4 text-[#C9A227]">
                Translation Style
              </label>
              <div className="grid grid-cols-3 gap-3">
                {translationStyles.map((style) => (
                  <button
                    key={style}
                    onClick={() => setSelectedStyle(style)}
                    className={`py-3 px-4 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 ${
                      selectedStyle === style
                        ? 'bg-[#C9A227] text-[#0D0D0F] shadow-lg shadow-[#C9A227]/30'
                        : 'bg-[#0D0D0F] text-[#F5F4F2] border border-[#F5F4F2]/30 hover:border-[#C9A227] hover:bg-[#C9A227]/10'
                    }`}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>

            {/* Translate Button */}
            <button
              onClick={handleTranslate}
              className="w-full bg-gradient-to-r from-[#C9A227] to-[#E6B52F] text-[#0D0D0F] py-4 px-8 rounded-xl font-bold text-lg hover:shadow-2xl hover:shadow-[#C9A227]/30 transform hover:scale-105 transition-all duration-300"
            >
              Translate Text
            </button>
          </div>

          {/* Output Section */}
          <div className="space-y-6">
            <div className="bg-[#1A1A1C] rounded-2xl p-6 border border-[#C9A227]/20 hover:border-[#C9A227]/40 transition-all duration-300">
              <label className="block text-lg font-semibold mb-4 text-[#C9A227]">
                Translation ({selectedStyle})
              </label>
              <div className="bg-[#0D0D0F] border border-[#F5F4F2]/20 rounded-xl p-4 h-40">
                <p className="text-[#F5F4F2] text-lg leading-relaxed">
                  {translation}
                </p>
              </div>
            </div>

            {/* Quality Score */}
            <div className="bg-[#1A1A1C] rounded-2xl p-6 border border-[#C9A227]/20">
              <div className="flex justify-between items-center mb-3">
                <label className="text-lg font-semibold text-[#C9A227]">
                  Translation Quality
                </label>
                <span className="text-2xl font-bold text-[#C9A227]">
                  {qualityScore}%
                </span>
              </div>
              <div className="w-full bg-[#0D0D0F] rounded-full h-4 border border-[#F5F4F2]/20">
                <div
                  className="bg-gradient-to-r from-[#C9A227] to-[#E6B52F] h-full rounded-full transition-all duration-1000 ease-out shadow-lg shadow-[#C9A227]/50"
                  style={{ width: `${qualityScore}%` }}
                ></div>
              </div>
              <p className="text-sm text-[#F5F4F2]/60 mt-2">
                Based on linguistic accuracy and contextual appropriateness
              </p>
            </div>

            {/* Translation Info */}
            <div className="bg-[#1A1A1C] rounded-2xl p-6 border border-[#C9A227]/20">
              <h3 className="text-lg font-semibold text-[#C9A227] mb-3">
                Translation Notes
              </h3>
              <div className="space-y-2 text-sm text-[#F5F4F2]/80">
                <div className="flex justify-between">
                  <span>Language:</span>
                  <span className="text-[#C9A227]">Ancient Greek</span>
                </div>
                <div className="flex justify-between">
                  <span>Source:</span>
                  <span className="text-[#C9A227]">Homer's Iliad</span>
                </div>
                <div className="flex justify-between">
                  <span>Meter:</span>
                  <span className="text-[#C9A227]">Dactylic Hexameter</span>
                </div>
                <div className="flex justify-between">
                  <span>Difficulty:</span>
                  <span className="text-[#C9A227]">Intermediate</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Style Descriptions */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#1A1A1C] rounded-2xl p-6 border border-[#F5F4F2]/10 hover:border-[#C9A227]/30 transition-all duration-300">
            <h3 className="text-xl font-bold text-[#C9A227] mb-3">Literal</h3>
            <p className="text-[#F5F4F2]/70">
              Word-for-word translation maintaining original syntax and structure for academic analysis.
            </p>
          </div>
          <div className="bg-[#1A1A1C] rounded-2xl p-6 border border-[#F5F4F2]/10 hover:border-[#C9A227]/30 transition-all duration-300">
            <h3 className="text-xl font-bold text-[#C9A227] mb-3">Literary</h3>
            <p className="text-[#F5F4F2]/70">
              Elegant translation capturing the poetic beauty and cultural context of the original.
            </p>
          </div>
          <div className="bg-[#1A1A1C] rounded-2xl p-6 border border-[#F5F4F2]/10 hover:border-[#C9A227]/30 transition-all duration-300">
            <h3 className="text-xl font-bold text-[#C9A227] mb-3">Student</h3>
            <p className="text-[#F5F4F2]/70">
              Clear, accessible translation with explanatory elements for learning purposes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}