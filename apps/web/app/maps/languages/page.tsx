'use client';
import React, { useState } from 'react';

export default function LanguageMaps() {
  const [selectedEra, setSelectedEra] = useState(0);
  const [hoveredRegion, setHoveredRegion] = useState('');

  const eras = [
    { name: 'Classical Period', year: '500 BCE', period: 0 },
    { name: 'Hellenistic Era', year: '300 BCE', period: 1 },
    { name: 'Early Roman', year: '100 BCE', period: 2 },
    { name: 'Imperial Rome', year: '100 CE', period: 3 },
    { name: 'Late Empire', year: '300 CE', period: 4 },
    { name: 'Byzantine Rise', year: '500 CE', period: 5 }
  ];

  const languages = {
    greek: { name: 'Greek', color: '#2563EB', bgColor: 'bg-blue-600' },
    latin: { name: 'Latin', color: '#DC2626', bgColor: 'bg-red-600' },
    hebrew: { name: 'Hebrew/Aramaic', color: '#059669', bgColor: 'bg-emerald-600' },
    mixed: { name: 'Mixed/Transitional', color: '#7C3AED', bgColor: 'bg-purple-600' }
  };

  const regionData = {
    0: { // 500 BCE
      italia: 'latin',
      sicilia: 'greek',
      gallia: 'latin',
      hispania: 'latin',
      africa: 'mixed',
      aegyptus: 'greek',
      syria: 'hebrew',
      asia_minor: 'greek',
      thracia: 'greek',
      macedonia: 'greek',
      achaia: 'greek',
      creta: 'greek',
      cyprus: 'greek',
      judea: 'hebrew'
    },
    1: { // 300 BCE
      italia: 'latin',
      sicilia: 'greek',
      gallia: 'latin',
      hispania: 'latin',
      africa: 'mixed',
      aegyptus: 'greek',
      syria: 'greek',
      asia_minor: 'greek',
      thracia: 'greek',
      macedonia: 'greek',
      achaia: 'greek',
      creta: 'greek',
      cyprus: 'greek',
      judea: 'hebrew'
    },
    2: { // 100 BCE
      italia: 'latin',
      sicilia: 'mixed',
      gallia: 'latin',
      hispania: 'latin',
      africa: 'latin',
      aegyptus: 'greek',
      syria: 'greek',
      asia_minor: 'greek',
      thracia: 'mixed',
      macedonia: 'mixed',
      achaia: 'greek',
      creta: 'greek',
      cyprus: 'greek',
      judea: 'hebrew'
    },
    3: { // 100 CE
      italia: 'latin',
      sicilia: 'latin',
      gallia: 'latin',
      hispania: 'latin',
      africa: 'latin',
      aegyptus: 'greek',
      syria: 'greek',
      asia_minor: 'greek',
      thracia: 'latin',
      macedonia: 'mixed',
      achaia: 'greek',
      creta: 'greek',
      cyprus: 'greek',
      judea: 'mixed'
    },
    4: { // 300 CE
      italia: 'latin',
      sicilia: 'latin',
      gallia: 'latin',
      hispania: 'latin',
      africa: 'latin',
      aegyptus: 'greek',
      syria: 'greek',
      asia_minor: 'greek',
      thracia: 'latin',
      macedonia: 'greek',
      achaia: 'greek',
      creta: 'greek',
      cyprus: 'greek',
      judea: 'greek'
    },
    5: { // 500 CE
      italia: 'latin',
      sicilia: 'mixed',
      gallia: 'latin',
      hispania: 'latin',
      africa: 'mixed',
      aegyptus: 'greek',
      syria: 'greek',
      asia_minor: 'greek',
      thracia: 'greek',
      macedonia: 'greek',
      achaia: 'greek',
      creta: 'greek',
      cyprus: 'greek',
      judea: 'greek'
    }
  };

  const regionNames = {
    italia: 'Italia',
    sicilia: 'Sicilia',
    gallia: 'Gallia',
    hispania: 'Hispania',
    africa: 'Africa',
    aegyptus: 'Aegyptus',
    syria: 'Syria',
    asia_minor: 'Asia Minor',
    thracia: 'Thracia',
    macedonia: 'Macedonia',
    achaia: 'Achaia',
    creta: 'Creta',
    cyprus: 'Cyprus',
    judea: 'Judea'
  };

  const getRegionColor = (regionId) => {
    const currentData = regionData[selectedEra];
    const language = currentData[regionId];
    return languages[language]?.color || '#6B7280';
  };

  const getRegionOpacity = (regionId) => {
    return hoveredRegion === regionId ? 0.9 : 0.7;
  };

  return (
    <div className="min-h-screen bg-[#0D0D0F] text-[#F5F4F2] p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-[#C9A227] to-[#F5F4F2] bg-clip-text text-transparent">
            Language Distribution Map
          </h1>
          <p className="text-xl text-[#F5F4F2]/80 max-w-3xl mx-auto">
            Explore the evolution of dominant languages across the Mediterranean from Classical Antiquity through the Byzantine Era
          </p>
        </div>

        {/* Era Slider */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-[#C9A227] mb-4">
              {eras[selectedEra].name}
            </h2>
            <p className="text-xl text-[#F5F4F2]/80">
              {eras[selectedEra].year}
            </p>
          </div>
          
          <div className="flex justify-center items-center space-x-4 mb-8">
            <button 
              onClick={() => setSelectedEra(Math.max(0, selectedEra - 1))}
              disabled={selectedEra === 0}
              className="px-4 py-2 bg-[#C9A227] text-[#0D0D0F] rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#C9A227]/80 transition-colors"
            >
              Previous
            </button>
            
            <div className="flex space-x-2">
              {eras.map((era, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedEra(index)}
                  className={`w-4 h-4 rounded-full transition-all ${
                    selectedEra === index 
                      ? 'bg-[#C9A227] scale-125' 
                      : 'bg-[#F5F4F2]/30 hover:bg-[#F5F4F2]/50'
                  }`}
                />
              ))}
            </div>
            
            <button 
              onClick={() => setSelectedEra(Math.min(eras.length - 1, selectedEra + 1))}
              disabled={selectedEra === eras.length - 1}
              className="px-4 py-2 bg-[#C9A227] text-[#0D0D0F] rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#C9A227]/80 transition-colors"
            >
              Next
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Map */}
          <div className="lg:col-span-3">
            <div className="bg-[#F5F4F2]/5 rounded-2xl p-8 backdrop-blur-sm border border-[#F5F4F2]/10">
              <svg
                viewBox="0 0 1200 600"
                className="w-full h-auto"
                style={{ maxHeight: '600px' }}
              >
                {/* Mediterranean Sea */}
                <rect x="300" y="250" width="600" height="200" fill="#1e40af" opacity="0.3" rx="20"/>
                
                {/* Regions */}
                {/* Italia */}
                <path
                  d="M 450 180 L 470 160 L 480 180 L 490 220 L 485 280 L 475 320 L 460 340 L 450 320 L 445 280 L 440 220 Z"
                  fill={getRegionColor('italia')}
                  opacity={getRegionOpacity('italia')}
                  stroke="#F5F4F2"
                  strokeWidth="2"
                  className="cursor-pointer transition-all duration-300 hover:stroke-[#C9A227] hover:stroke-4"
                  onMouseEnter={() => setHoveredRegion('italia')}
                  onMouseLeave={() => setHoveredRegion('')}
                />
                
                {/* Sicilia */}
                <circle
                  cx="460"
                  cy="360"
                  r="25"
                  fill={getRegionColor('sicilia')}
                  opacity={getRegionOpacity('sicilia')}
                  stroke="#F5F4F2"
                  strokeWidth="2"
                  className="cursor-pointer transition-all duration-300 hover:stroke-[#C9A227] hover:stroke-4"
                  onMouseEnter={() => setHoveredRegion('sicilia')}
                  onMouseLeave={() => setHoveredRegion('')}
                />
                
                {/* Gallia */}
                <path
                  d="M 300 120 L 420 120 L 440 140 L 430 180 L 400 200 L 350 190 L 300 160 Z"
                  fill={getRegionColor('gallia')}
                  opacity={getRegionOpacity('gallia')}
                  stroke="#F5F4F2"
                  strokeWidth="2"
                  className="cursor-pointer transition-all duration-300 hover:stroke-[#C9A227] hover:stroke-4"
                  onMouseEnter={() => setHoveredRegion('gallia')}
                  onMouseLeave={() => setHoveredRegion('')}
                />
                
                {/* Hispania */}
                <path
                  d="M 200 160 L 290 150 L 300 180 L 290 220 L 270 260 L 220 270 L 180 240 L 180 190 Z"
                  fill={getRegionColor('hispania')}
                  opacity={getRegionOpacity('hispania')}
                  stroke="#F5F4F2"
                  strokeWidth="2"
                  className="cursor-pointer transition-all duration-300 hover:stroke-[#C9A227] hover:stroke-4"
                  onMouseEnter={() => setHoveredRegion('hispania')}
                  onMouseLeave={() => setHoveredRegion('')}
                />
                
                {/* Africa */}
                <path
                  d="M 300 380 L 500 390 L 520 420 L 500 460 L 450 480 L 350 470 L 280 450 L 280 400 Z"
                  fill={getRegionColor('africa')}
                  opacity={getRegionOpacity('africa')}
                  stroke="#F5F4F2"
                  strokeWidth="2"
                  className="cursor-pointer transition-all duration-300 hover:stroke-[#C9A227] hover:stroke-4"
                  onMouseEnter={() => setHoveredRegion('africa')}
                  onMouseLeave={() => setHoveredRegion('')}
                />
                
                {/* Aegyptus */}
                <path
                  d="M 700 380 L 750 390 L 780 420 L 770 480 L 720 490 L 690 460 L 680 420 Z"
                  fill={getRegionColor('aegyptus')}
                  opacity={getRegionOpacity('aegyptus')}
                  stroke="#F5F4F2"
                  strokeWidth="2"
                  className="cursor-pointer transition-all duration-300 hover:stroke-[#C9A227] hover:stroke-4"
                  onMouseEnter={() => setHoveredRegion('aegyptus')}
                  onMouseLeave={() => setHoveredRegion('')}
                />
                
                {/* Syria */}
                <path
                  d="M 780 280 L 850 270 L 880 300 L 870 340 L 840 360 L 800 350 L 770 320 Z"
                  fill={getRegionColor('syria')}
                  opacity={getRegionOpacity('syria')}
                  stroke="#F5F4F2"
                  strokeWidth="2"
                  className="cursor-pointer transition-all duration-300 hover:stroke-[#C9A227] hover:stroke-4"
                  onMouseEnter={() => setHoveredRegion('syria')}
                  onMouseLeave={() => setHoveredRegion('')}
                />
                
                {/* Asia Minor */}
                <path
                  d="M 650 180 L 780 170 L 820 200 L 800 250 L 740 260 L 680 240 L 640 210 Z"
                  fill={getRegionColor('asia_minor')}
                  opacity={getRegionOpacity('asia_minor')}
                  stroke="#F5F4F2"
                  strokeWidth="2"
                  className="cursor-pointer transition-all duration-300 hover:stroke-[#C9A227] hover:stroke-4"
                  onMouseEnter={() => setHoveredRegion('asia_minor')}
                  onMouseLeave={() => setHoveredRegion('')}
                />
                
                {/* Thracia */}
                <path
                  d="M 580 160 L 640 150 L 660 180 L 650 220 L 600 230 L 560 200 Z"
                  fill={getRegionColor('thracia')}
                  opacity={getRegionOpacity('thracia')}
                  stroke="#F5F4F2"
                  strokeWidth="2"
                  className="cursor-pointer transition-all duration-300 hover:stroke-[#C9A227] hover:stroke-4"
                  onMouseEnter={() => setHoveredRegion('thracia')}
                  onMouseLeave={() => setHoveredRegion('')}
                />
                
                {/* Macedonia */}
                <path
                  d="M 530 200 L 580 190 L 600 220 L 580 250 L 540 260 L 510 230 Z"
                  fill={getRegionColor('macedonia')}
                  opacity={getRegionOpacity('macedonia')}
                  stroke="#F5F4F2"
                  strokeWidth="2"
                  className="cursor-pointer transition-all duration-300 hover:stroke-[#C9A227] hover:stroke-4"
                  onMouseEnter={() => setHoveredRegion('macedonia')}
                  onMouseLeave={() => setHoveredRegion('')}
                />
                
                {/* Achaia */}
                <path
                  d="M 520 260 L 560 250 L 580 280 L 570 320 L 530 330 L 500 300 Z"
                  fill={getRegionColor('achaia')}
                  opacity={getRegionOpacity('achaia')}
                  stroke="#F5F4F2"
                  strokeWidth="2"
                  className="cursor-pointer transition-all duration-300 hover:stroke-[#C9A227] hover:stroke-4"
                  onMouseEnter={() => setHoveredRegion('achaia')}
                  onMouseLeave={() => setHoveredRegion('')}
                />
                
                {/* Creta */}
                <ellipse
                  cx="600"
                  cy="380"
                  rx="40"
                  ry="15"
                  fill={getRegionColor('creta')}
                  opacity={getRegionOpacity('creta')}
                  stroke="#F5F4F2"
                  strokeWidth="2"
                  className="cursor-pointer transition-all duration-300 hover:stroke-[#C9A227] hover:stroke-4"
                  onMouseEnter={() => setHoveredRegion('creta')}
                  onMouseLeave={() => setHoveredRegion('')}
                />
                
                {/* Cyprus */}
                <ellipse
                  cx="720"
                  cy="320"
                  rx="30"
                  ry="20"
                  fill={getRegionColor('cyprus')}
                  opacity={getRegionOpacity('cyprus')}
                  stroke="#F5F4F2"
                  strokeWidth="2"
                  className="cursor-pointer transition-all duration-300 hover:stroke-[#C9A227] hover:stroke-4"
                  onMouseEnter={() => setHoveredRegion('cyprus')}
                  onMouseLeave={() => setHoveredRegion('')}
                />
                
                {/* Judea */}
                <path
                  d="M 750 320 L 780 310 L 790 340 L 780 370 L 750 380 L 730 360 L 730 340 Z"
                  fill={getRegionColor('judea')}
                  opacity={getRegionOpacity('judea')}
                  stroke="#F5F4F2"
                  strokeWidth="2"
                  className="cursor-pointer transition-all duration-300 hover:stroke-[#C9A227] hover:stroke-4"
                  onMouseEnter={() => setHoveredRegion('judea')}
                  onMouseLeave={() => setHoveredRegion('')}
                />
                
                {/* Region Labels */}
                {Object.entries(regionNames).map(([id, name]) => {
                  const positions = {
                    italia: [465, 250],
                    sicilia: [460, 365],
                    gallia: [360, 155],
                    hispania: [240, 210],
                    africa: [390, 425],
                    aegyptus: [730, 435],
                    syria: [825, 305],
                    asia_minor: [720, 215],
                    thracia: [600, 185],
                    macedonia: [545, 225],
                    achaia: [540, 295],
                    creta: [600, 385],
                    cyprus: [720, 325],
                    judea: [760, 345]
                  };
                  
                  const [x, y] = positions[id] || [0, 0];
                  
                  return (
                    <text
                      key={id}
                      x={x}
                      y={y}
                      textAnchor="middle"
                      fill="#F5F4F2"
                      fontSize="12"
                      fontWeight="bold"
                      className="pointer-events-none"
                    >
                      {name}
                    </text>
                  );
                })}
              </svg>
              
              {/* Hover Info */}
              {hoveredRegion && (
                <div className="mt-4 p-4 bg-[#F5F4F2]/10 rounded-lg border border-[#C9A227]/30">
                  <h3 className="text-xl font-bold text-[#C9A227] mb-2">
                    {regionNames[hoveredRegion]}
                  </h3>
                  <p className="text-[#F5F4F2]/80">
                    Dominant Language: <span className="font-semibold" style={{color: languages[regionData[selectedEra][hoveredRegion]]?.color}}>
                      {languages[regionData[selectedEra][hoveredRegion]]?.name}
                    </span>
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Legend */}
          <div className="lg:col-span-1">
            <div className="bg-[#F5F4F2]/5 rounded-2xl p-6 backdrop-blur-sm border border-[#F5F4F2]/10 sticky top-8">
              <h3 className="text-2xl font-bold text-[#C9A227] mb-6">Language Legend</h3>
              
              <div className="space-y-4">
                {Object.entries(languages).map(([key, lang]) => (
                  <div key={key} className="flex items-center space-x-3">
                    <div 
                      className="w-6 h-6 rounded-full border-2 border-[#F5F4F2]/30"
                      style={{ backgroundColor: lang.color }}
                    ></div>
                    <span className="font-medium">{lang.name}</span>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 pt-6 border-t border-[#F5F4F2]/20">
                <h4 className="text-lg font-semibold text-[#C9A227] mb-4">Historical Context</h4>
                <div className="space-y-3 text-sm text-[#F5F4F2]/80">
                  <div className="p-3 bg-[#F5F4F2]/5 rounded-lg">
                    <p className="font-medium text-blue-400">Greek Influence</p>
                    <p>Hellenistic culture and trade networks</p>
                  </div>
                  <div className="p-3 bg-[#F5F4F2]/5 rounded-lg">
                    <p className="font-medium text-red-400">Latin Expansion</p>
                    <p>Roman conquest and administration</p>
                  </div>
                  <div className="p-3 bg-[#F5F4F2]/5 rounded-lg">
                    <p className="font-medium text-emerald-400">Semitic Heritage</p>
                    <p>Hebrew and Aramaic traditions</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}