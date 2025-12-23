'use client';
import React, { useState } from 'react';

export default function DiscoverPage() {
  const [activeTab, setActiveTab] = useState('1st Order');

  const discoveryData = {
    '1st Order': [
      {
        hypothesis: "Neural pathway optimization occurs through repetitive pattern recognition, creating efficiency cascades in decision-making processes.",
        confidence: 87,
        novelty: "High",
        evidence: 142,
        id: 1
      },
      {
        hypothesis: "Quantum entanglement effects demonstrate measurable correlation with conscious observation patterns in controlled environments.",
        confidence: 91,
        novelty: "Critical",
        evidence: 89,
        id: 2
      },
      {
        hypothesis: "Emergent behavior in distributed systems follows predictable mathematical models based on node interaction frequency.",
        confidence: 83,
        novelty: "High",
        evidence: 267,
        id: 3
      }
    ],
    '2nd Order': [
      {
        hypothesis: "Metacognitive awareness amplifies pattern recognition capabilities exponentially across multiple cognitive domains simultaneously.",
        confidence: 79,
        novelty: "Moderate",
        evidence: 156,
        id: 4
      },
      {
        hypothesis: "Complex adaptive systems exhibit self-organizing properties that mirror biological neural network development patterns.",
        confidence: 88,
        novelty: "High",
        evidence: 203,
        id: 5
      },
      {
        hypothesis: "Information entropy reduction correlates with increased system coherence and predictive accuracy in dynamic environments.",
        confidence: 85,
        novelty: "Critical",
        evidence: 178,
        id: 6
      }
    ],
    '3rd Order': [
      {
        hypothesis: "Cross-domain pattern synthesis enables emergent intelligence that transcends individual component capabilities through synergistic integration.",
        confidence: 74,
        novelty: "Critical",
        evidence: 94,
        id: 7
      },
      {
        hypothesis: "Temporal pattern recognition across multiple scales reveals hidden causal relationships in complex system dynamics.",
        confidence: 81,
        novelty: "High",
        evidence: 132,
        id: 8
      },
      {
        hypothesis: "Recursive feedback loops in learning systems create self-improving algorithms that evolve beyond initial programming constraints.",
        confidence: 86,
        novelty: "Moderate",
        evidence: 215,
        id: 9
      }
    ],
    '4th Order': [
      {
        hypothesis: "Meta-pattern recognition enables prediction of pattern evolution itself, creating recursive forecasting capabilities across system hierarchies.",
        confidence: 69,
        novelty: "Revolutionary",
        evidence: 67,
        id: 10
      },
      {
        hypothesis: "Consciousness emergence patterns suggest quantifiable thresholds for self-awareness development in artificial intelligence systems.",
        confidence: 72,
        novelty: "Revolutionary",
        evidence: 45,
        id: 11
      },
      {
        hypothesis: "Universal pattern languages exist across domains, enabling cross-pollination of insights between disparate knowledge systems.",
        confidence: 77,
        novelty: "Critical",
        evidence: 98,
        id: 12
      }
    ]
  };

  const getNoveltyColor = (novelty) => {
    switch (novelty) {
      case 'Revolutionary': return 'text-purple-400';
      case 'Critical': return 'text-red-400';
      case 'High': return 'text-[#C9A227]';
      case 'Moderate': return 'text-blue-400';
      default: return 'text-gray-400';
    }
  };

  const getNoveltyBg = (novelty) => {
    switch (novelty) {
      case 'Revolutionary': return 'bg-purple-400/20';
      case 'Critical': return 'bg-red-400/20';
      case 'High': return 'bg-[#C9A227]/20';
      case 'Moderate': return 'bg-blue-400/20';
      default: return 'bg-gray-400/20';
    }
  };

  return (
    <div className="min-h-screen bg-[#0D0D0F] text-[#F5F4F2] p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-light mb-4 bg-gradient-to-r from-[#F5F4F2] to-[#C9A227] bg-clip-text text-transparent">
            AI-Discovered Patterns
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl">
            Advanced pattern recognition algorithms have uncovered these emergent insights across multiple orders of complexity.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="mb-10">
          <div className="flex space-x-1 bg-gray-800/30 p-1 rounded-xl backdrop-blur-sm">
            {Object.keys(discoveryData).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                  activeTab === tab
                    ? 'bg-[#C9A227] text-[#0D0D0F] shadow-lg shadow-[#C9A227]/25'
                    : 'text-gray-400 hover:text-[#F5F4F2] hover:bg-gray-700/50'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Discovery Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {discoveryData[activeTab].map((discovery) => (
            <div
              key={discovery.id}
              className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 hover:border-[#C9A227]/50 transition-all duration-500 hover:shadow-xl hover:shadow-[#C9A227]/10 hover:-translate-y-1 group"
            >
              {/* Hypothesis */}
              <div className="mb-6">
                <p className="text-[#F5F4F2] leading-relaxed text-base font-light">
                  {discovery.hypothesis}
                </p>
              </div>

              {/* Metrics */}
              <div className="space-y-4 mb-8">
                {/* Confidence */}
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm font-medium">Confidence</span>
                  <div className="flex items-center space-x-3">
                    <div className="w-24 h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-[#C9A227] to-yellow-300 transition-all duration-1000 ease-out"
                        style={{ width: `${discovery.confidence}%` }}
                      />
                    </div>
                    <span className="text-[#C9A227] font-semibold text-sm">{discovery.confidence}%</span>
                  </div>
                </div>

                {/* Novelty */}
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm font-medium">Novelty</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getNoveltyBg(discovery.novelty)} ${getNoveltyColor(discovery.novelty)}`}>
                    {discovery.novelty}
                  </span>
                </div>

                {/* Evidence Count */}
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm font-medium">Evidence Points</span>
                  <span className="text-[#F5F4F2] font-semibold">{discovery.evidence}</span>
                </div>
              </div>

              {/* Explore Button */}
              <button className="w-full bg-gradient-to-r from-[#C9A227] to-yellow-600 hover:from-yellow-600 hover:to-[#C9A227] text-[#0D0D0F] font-semibold py-3 px-6 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-[#C9A227]/30 group-hover:scale-105">
                Explore Pattern
              </button>
            </div>
          ))}
        </div>

        {/* Stats Footer */}
        <div className="mt-16 pt-8 border-t border-gray-800/50">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl font-light text-[#C9A227] mb-2">1,247</div>
              <div className="text-gray-400 text-sm">Total Patterns</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-light text-[#C9A227] mb-2">84%</div>
              <div className="text-gray-400 text-sm">Avg Confidence</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-light text-[#C9A227] mb-2">156</div>
              <div className="text-gray-400 text-sm">Critical Insights</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-light text-[#C9A227] mb-2">23</div>
              <div className="text-gray-400 text-sm">Revolutionary</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}