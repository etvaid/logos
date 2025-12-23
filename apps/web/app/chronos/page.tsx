'use client'

import { useState } from 'react'

const CONCEPTS: Record<string, {era:string,years:string,color:string,meaning:string,authors:string[],pct:number}[]> = {
  "ἀρετή": [
    {era:"Archaic",years:"800-500 BCE",color:"#D97706",meaning:"Battle excellence",authors:["Homer"],pct:92},
    {era:"Classical",years:"500-323 BCE",color:"#F59E0B",meaning:"Moral excellence",authors:["Plato","Aristotle"],pct:95},
    {era:"Late Antique",years:"284-600 CE",color:"#7C3AED",meaning:"Christian virtue",authors:["Augustine"],pct:90}
  ],
  "λόγος": [
    {era:"Archaic",years:"800-500 BCE",color:"#D97706",meaning:"Speech, story",authors:["Homer"],pct:94},
    {era:"Classical",years:"500-323 BCE",color:"#F59E0B",meaning:"Reason, argument",authors:["Plato"],pct:96},
    {era:"Late Antique",years:"284-600 CE",color:"#7C3AED",meaning:"Divine Word",authors:["John","Origen"],pct:93}
  ]
};

export default function ChronosPage() {
  const [selectedConcept, setSelectedConcept] = useState<string>("ἀρετή");

  const handleConceptSelect = (concept: string) => {
    setSelectedConcept(concept);
  };

  return (
    <div className="min-h-screen bg-[#0D0D0F] text-[#F5F4F2] p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4">
            <span className="text-[#C9A227]">CHRONOS</span>
          </h1>
          <p className="text-xl text-gray-300">Concept Evolution Through Time</p>
        </div>

        {/* Concept Selection */}
        <div className="mb-12">
          <div className="flex gap-4 flex-wrap">
            {Object.keys(CONCEPTS).map((concept) => (
              <button
                key={concept}
                onClick={() => handleConceptSelect(concept)}
                className={`px-6 py-3 rounded-lg text-lg font-medium transition-all ${
                  selectedConcept === concept
                    ? 'bg-[#C9A227] text-[#0D0D0F] shadow-lg'
                    : 'bg-[#1E1E24] text-[#F5F4F2] hover:bg-[#2A2A32]'
                }`}
              >
                {concept}
              </button>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Central Line */}
          <div className="absolute left-8 top-0 w-0.5 h-full bg-[#1E1E24]"></div>

          {/* Timeline Nodes */}
          <div className="space-y-12">
            {CONCEPTS[selectedConcept].map((evolution, index) => (
              <div key={index} className="relative flex items-start">
                {/* Era Node */}
                <div 
                  className="w-16 h-16 rounded-full flex items-center justify-center z-10 border-4 border-[#0D0D0F]"
                  style={{ backgroundColor: evolution.color }}
                >
                  <div className="w-2 h-2 bg-[#0D0D0F] rounded-full"></div>
                </div>

                {/* Content */}
                <div className="ml-8 flex-1">
                  <div className="bg-[#1E1E24] rounded-lg p-6 shadow-xl">
                    {/* Era Header */}
                    <div className="flex items-center gap-4 mb-4">
                      <h3 
                        className="text-2xl font-bold"
                        style={{ color: evolution.color }}
                      >
                        {evolution.era}
                      </h3>
                      <span className="text-gray-400 text-lg">{evolution.years}</span>
                    </div>

                    {/* Meaning */}
                    <div className="mb-4">
                      <h4 className="text-[#C9A227] font-semibold mb-2">Meaning:</h4>
                      <p className="text-lg">{evolution.meaning}</p>
                    </div>

                    {/* Authors */}
                    <div className="mb-4">
                      <h4 className="text-[#C9A227] font-semibold mb-2">Key Authors:</h4>
                      <div className="flex gap-2 flex-wrap">
                        {evolution.authors.map((author, authorIndex) => (
                          <span 
                            key={authorIndex}
                            className="px-3 py-1 bg-[#0D0D0F] rounded-full text-sm"
                          >
                            {author}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Confidence Bar */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="text-[#C9A227] font-semibold">Confidence:</h4>
                        <span className="text-sm text-gray-400">{evolution.pct}%</span>
                      </div>
                      <div className="w-full bg-[#0D0D0F] rounded-full h-3">
                        <div 
                          className="h-3 rounded-full transition-all duration-500"
                          style={{ 
                            width: `${evolution.pct}%`,
                            backgroundColor: evolution.color 
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div className="mt-16 p-6 bg-[#1E1E24] rounded-lg">
          <h3 className="text-xl font-bold text-[#C9A227] mb-4">
            Evolution of "{selectedConcept}"
          </h3>
          <p className="text-gray-300 leading-relaxed">
            This concept has undergone significant semantic evolution across {CONCEPTS[selectedConcept].length} major 
            historical periods, reflecting changing cultural, philosophical, and religious contexts 
            throughout ancient history.
          </p>
        </div>
      </div>
    </div>
  );
}