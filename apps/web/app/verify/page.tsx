'use client';

import React, { useState } from 'react';

export default function VerifyPage() {
  const [claim, setClaim] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const handleVerify = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setShowResults(true);
    }, 2000);
  };

  const handleDemo = () => {
    setClaim("Caesar crossed the Rubicon in 49 BCE");
    setShowResults(false);
  };

  const sources = [
    {
      title: "Plutarch's Lives",
      author: "Plutarch",
      date: "c. 100 CE",
      excerpt: "Caesar, taking with him only one legion, crossed the river Rubicon, which was the boundary of his province...",
      reliability: 85
    },
    {
      title: "The Twelve Caesars",
      author: "Suetonius",
      date: "c. 121 CE",
      excerpt: "When Caesar came to the river Rubicon, the boundary of his province, he paused for a while...",
      reliability: 90
    },
    {
      title: "Roman History",
      author: "Cassius Dio",
      date: "c. 220 CE",
      excerpt: "Caesar advanced to the Rubicon with his army. This river marked the boundary between Gaul and Italy...",
      reliability: 88
    }
  ];

  const analysisPoints = [
    { aspect: "Multiple Independent Sources", score: 95, description: "Confirmed by 3+ independent historians" },
    { aspect: "Contemporary Evidence", score: 85, description: "Sources written within 200 years of event" },
    { aspect: "Archaeological Support", score: 90, description: "Geographic and military evidence aligns" },
    { aspect: "Historical Consensus", score: 98, description: "Widely accepted by modern historians" }
  ];

  return (
    <div className="min-h-screen bg-[#0D0D0F] text-[#F5F4F2] p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-[#F5F4F2] to-[#C9A227] bg-clip-text text-transparent">
            Historical Claim Verification
          </h1>
          <p className="text-xl text-[#F5F4F2]/70 max-w-3xl mx-auto">
            Analyze historical claims against primary sources, archaeological evidence, and scholarly consensus
          </p>
        </div>

        {/* Input Section */}
        <div className="bg-[#1A1A1D] rounded-2xl p-8 mb-8 border border-[#C9A227]/20 hover:border-[#C9A227]/40 transition-all duration-300">
          <label className="block text-[#C9A227] font-semibold mb-4 text-lg">
            Enter Historical Claim
          </label>
          <div className="flex gap-4 mb-4">
            <textarea
              value={claim}
              onChange={(e) => setClaim(e.target.value)}
              placeholder="Enter a historical claim to verify..."
              className="flex-1 bg-[#0D0D0F] border border-[#C9A227]/30 rounded-xl p-4 text-[#F5F4F2] placeholder-[#F5F4F2]/40 focus:border-[#C9A227] focus:outline-none transition-colors duration-300 resize-none h-24"
            />
          </div>
          <div className="flex gap-4">
            <button
              onClick={handleVerify}
              disabled={!claim || isAnalyzing}
              className="bg-[#C9A227] text-[#0D0D0F] px-8 py-3 rounded-xl font-semibold hover:bg-[#C9A227]/90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
            >
              {isAnalyzing ? 'Analyzing...' : 'Verify Claim'}
            </button>
            <button
              onClick={handleDemo}
              className="border border-[#C9A227] text-[#C9A227] px-6 py-3 rounded-xl font-semibold hover:bg-[#C9A227]/10 transition-all duration-300 transform hover:scale-105"
            >
              Try Demo
            </button>
          </div>
        </div>

        {/* Loading Animation */}
        {isAnalyzing && (
          <div className="bg-[#1A1A1D] rounded-2xl p-12 mb-8 border border-[#C9A227]/20 text-center">
            <div className="animate-spin w-16 h-16 border-4 border-[#C9A227]/20 border-t-[#C9A227] rounded-full mx-auto mb-6"></div>
            <h3 className="text-2xl font-semibold text-[#C9A227] mb-4">Analyzing Claim</h3>
            <div className="space-y-2 text-[#F5F4F2]/70">
              <p>• Cross-referencing primary sources...</p>
              <p>• Checking archaeological evidence...</p>
              <p>• Analyzing historical consensus...</p>
            </div>
          </div>
        )}

        {/* Results */}
        {showResults && (
          <div className="space-y-8">
            {/* Verdict */}
            <div className="bg-[#1A1A1D] rounded-2xl p-8 border border-[#C9A227]/20">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-3xl font-bold mb-2">Verification Result</h2>
                  <p className="text-[#F5F4F2]/70">"{claim}"</p>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-bold text-green-400 mb-2">LIKELY TRUE</div>
                  <div className="text-2xl text-[#C9A227]">Confidence: 92%</div>
                </div>
              </div>
              
              {/* Confidence Meter */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[#F5F4F2]/70">Confidence Level</span>
                  <span className="text-[#C9A227] font-semibold">92%</span>
                </div>
                <div className="w-full bg-[#0D0D0F] rounded-full h-3">
                  <div className="bg-gradient-to-r from-[#C9A227] to-green-400 h-3 rounded-full transition-all duration-1000 ease-out" style={{width: '92%'}}></div>
                </div>
              </div>
            </div>

            {/* Analysis Breakdown */}
            <div className="bg-[#1A1A1D] rounded-2xl p-8 border border-[#C9A227]/20">
              <h3 className="text-2xl font-bold text-[#C9A227] mb-6">Corroboration Analysis</h3>
              <div className="grid md:grid-cols-2 gap-6">
                {analysisPoints.map((point, index) => (
                  <div key={index} className="bg-[#0D0D0F] rounded-xl p-6 border border-[#C9A227]/10 hover:border-[#C9A227]/30 transition-all duration-300">
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="font-semibold text-[#F5F4F2]">{point.aspect}</h4>
                      <span className="text-[#C9A227] font-bold text-lg">{point.score}%</span>
                    </div>
                    <p className="text-[#F5F4F2]/60 text-sm mb-3">{point.description}</p>
                    <div className="w-full bg-[#1A1A1D] rounded-full h-2">
                      <div 
                        className="bg-[#C9A227] h-2 rounded-full transition-all duration-1000 ease-out" 
                        style={{width: `${point.score}%`}}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sources */}
            <div className="bg-[#1A1A1D] rounded-2xl p-8 border border-[#C9A227]/20">
              <h3 className="text-2xl font-bold text-[#C9A227] mb-6">Primary Sources</h3>
              <div className="space-y-6">
                {sources.map((source, index) => (
                  <div key={index} className="bg-[#0D0D0F] rounded-xl p-6 border border-[#C9A227]/10 hover:border-[#C9A227]/30 transition-all duration-300 transform hover:scale-[1.02]">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="text-xl font-semibold text-[#F5F4F2] mb-1">{source.title}</h4>
                        <p className="text-[#C9A227]">{source.author} • {source.date}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-[#F5F4F2]/60">Reliability</div>
                        <div className="text-lg font-bold text-[#C9A227]">{source.reliability}%</div>
                      </div>
                    </div>
                    <blockquote className="text-[#F5F4F2]/80 italic border-l-4 border-[#C9A227] pl-4">
                      "{source.excerpt}"
                    </blockquote>
                    <div className="mt-4 w-full bg-[#1A1A1D] rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-[#C9A227] to-[#C9A227]/60 h-2 rounded-full transition-all duration-1000 ease-out" 
                        style={{width: `${source.reliability}%`}}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Summary */}
            <div className="bg-[#1A1A1D] rounded-2xl p-8 border border-[#C9A227]/20">
              <h3 className="text-2xl font-bold text-[#C9A227] mb-4">Expert Summary</h3>
              <div className="text-[#F5F4F2]/80 space-y-4">
                <p>
                  The claim that "Caesar crossed the Rubicon in 49 BCE" is <strong className="text-green-400">LIKELY TRUE</strong> based on substantial historical evidence.
                </p>
                <p>
                  Multiple independent ancient sources, including Plutarch, Suetonius, and Cassius Dio, corroborate this event. The crossing of the Rubicon marked Caesar's point of no return in his conflict with the Roman Senate, making it a pivotal moment in Roman history.
                </p>
                <p>
                  Archaeological and geographical evidence supports the historical accounts, and there is overwhelming consensus among modern historians regarding the authenticity of this event.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}