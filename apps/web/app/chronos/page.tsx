'use client';
import React, { useState } from 'react';

export default function ChronosEngine() {
  const [searchTerm, setSearchTerm] = useState('ἀρετή');
  const [showTimeline, setShowTimeline] = useState(false);

  const timelineData = [
    {
      era: 'Archaic',
      period: '800-480 BCE',
      definition: 'excellence in battle',
      description: 'Originally denoted prowess in warfare and physical excellence. Heroes like Achilles embodied this martial virtue.',
      confidence: 92,
      color: 'amber',
      bgColor: 'bg-amber-500',
      textColor: 'text-amber-400'
    },
    {
      era: 'Classical',
      period: '480-323 BCE',
      definition: 'moral virtue',
      description: 'Evolved into moral excellence through Socratic philosophy. Virtue became linked to knowledge and ethical behavior.',
      confidence: 95,
      color: 'yellow',
      bgColor: 'bg-yellow-500',
      textColor: 'text-yellow-400'
    },
    {
      era: 'Hellenistic',
      period: '323-146 BCE',
      definition: 'philosophical excellence',
      description: 'Stoics and Epicureans refined virtue as philosophical practice. Emphasis on wisdom and rational living.',
      confidence: 88,
      color: 'blue',
      bgColor: 'bg-blue-500',
      textColor: 'text-blue-400'
    },
    {
      era: 'Imperial',
      period: '146 BCE-330 CE',
      definition: 'civic virtue',
      description: 'Roman adaptation emphasized duty to state and society. Virtus became central to Roman identity.',
      confidence: 85,
      color: 'red',
      bgColor: 'bg-red-500',
      textColor: 'text-red-400'
    },
    {
      era: 'Late Antique',
      period: '330-726 CE',
      definition: 'Christian virtue',
      description: 'Synthesis with Christian theology. Cardinal virtues merged with faith, hope, and charity.',
      confidence: 90,
      color: 'purple',
      bgColor: 'bg-purple-500',
      textColor: 'text-purple-400'
    },
    {
      era: 'Byzantine',
      period: '726-1453 CE',
      definition: 'theological virtue',
      description: 'Fully integrated into Orthodox theology. Virtue as path to divine union and spiritual excellence.',
      confidence: 87,
      color: 'green',
      bgColor: 'bg-green-500',
      textColor: 'text-green-400'
    }
  ];

  const handleSearch = () => {
    setShowTimeline(true);
  };

  return (
    <div className="min-h-screen bg-[#0D0D0F] text-[#F5F4F2] p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-[#C9A227] to-[#F5F4F2] bg-clip-text text-transparent">
            CHRONOS Engine
          </h1>
          <p className="text-xl text-[#F5F4F2]/80 mb-8">
            Trace the evolution of concepts across time and cultures
          </p>
        </div>

        {/* Search Interface */}
        <div className="bg-[#1A1A1D] rounded-2xl p-8 mb-12 border border-[#C9A227]/20">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1">
              <label className="block text-sm font-medium text-[#C9A227] mb-2">
                Search Concept
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 bg-[#0D0D0F] border border-[#C9A227]/30 rounded-lg text-[#F5F4F2] focus:border-[#C9A227] focus:outline-none transition-all duration-300"
                placeholder="Enter a concept (e.g., ἀρετή, virtue, courage)"
              />
            </div>
            <button
              onClick={handleSearch}
              className="px-8 py-3 bg-[#C9A227] text-[#0D0D0F] font-semibold rounded-lg hover:bg-[#C9A227]/90 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Analyze Evolution
            </button>
          </div>
        </div>

        {/* Timeline */}
        {showTimeline && (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-[#C9A227] mb-2">
                Evolution of "{searchTerm}"
              </h2>
              <p className="text-[#F5F4F2]/70">
                Conceptual development across historical periods
              </p>
            </div>

            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-amber-500 via-blue-500 to-green-500 rounded-full"></div>

              {/* Timeline Items */}
              <div className="space-y-8">
                {timelineData.map((item, index) => (
                  <div key={index} className="relative">
                    {/* Timeline Dot */}
                    <div className={`absolute left-4 w-9 h-9 ${item.bgColor} rounded-full border-4 border-[#0D0D0F] z-10 flex items-center justify-center shadow-lg`}>
                      <div className="w-3 h-3 bg-[#0D0D0F] rounded-full"></div>
                    </div>

                    {/* Content Card */}
                    <div className="ml-20 bg-[#1A1A1D] rounded-2xl p-6 border border-[#C9A227]/20 hover:border-[#C9A227]/40 transition-all duration-300 hover:transform hover:scale-[1.02] hover:shadow-xl">
                      <div className="flex flex-col md:flex-row md:items-start gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <h3 className={`text-2xl font-bold ${item.textColor}`}>
                              {item.era}
                            </h3>
                            <span className="px-3 py-1 bg-[#C9A227]/20 text-[#C9A227] rounded-full text-sm font-medium">
                              {item.period}
                            </span>
                          </div>
                          
                          <div className="mb-4">
                            <h4 className="text-lg font-semibold text-[#F5F4F2] mb-2">
                              "{item.definition}"
                            </h4>
                            <p className="text-[#F5F4F2]/80 leading-relaxed">
                              {item.description}
                            </p>
                          </div>
                        </div>

                        {/* Confidence Score */}
                        <div className="md:w-32">
                          <div className="text-center">
                            <div className="text-sm text-[#C9A227] font-medium mb-2">
                              Confidence
                            </div>
                            <div className="relative w-16 h-16 mx-auto">
                              <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                                <circle
                                  cx="18"
                                  cy="18"
                                  r="16"
                                  fill="none"
                                  className="stroke-current text-[#C9A227]/20"
                                  strokeWidth="2"
                                />
                                <circle
                                  cx="18"
                                  cy="18"
                                  r="16"
                                  fill="none"
                                  className={`stroke-current ${item.textColor}`}
                                  strokeWidth="2"
                                  strokeDasharray={`${item.confidence}, 100`}
                                  strokeLinecap="round"
                                />
                              </svg>
                              <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-sm font-bold text-[#F5F4F2]">
                                  {item.confidence}%
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Summary */}
            <div className="mt-12 bg-gradient-to-r from-[#C9A227]/10 to-[#C9A227]/5 rounded-2xl p-8 border border-[#C9A227]/30">
              <h3 className="text-2xl font-bold text-[#C9A227] mb-4">
                Evolution Summary
              </h3>
              <p className="text-[#F5F4F2]/90 leading-relaxed">
                The concept of <span className="text-[#C9A227] font-semibold">ἀρετή</span> demonstrates 
                remarkable semantic evolution from its archaic roots in martial excellence to its 
                sophisticated theological interpretation in Byzantine thought. This transformation 
                reflects broader cultural shifts in Greek and Roman civilization, showing how 
                fundamental concepts adapt while maintaining core elements of excellence and virtue.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}