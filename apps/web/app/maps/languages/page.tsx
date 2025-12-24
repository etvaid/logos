'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function LanguagesMap() {
  const [selectedEra, setSelectedEra] = useState(500);
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

  const eras = [
    { year: 800, label: '800 BCE', color: '#D97706', name: 'Archaic' },
    { year: 500, label: '500 BCE', color: '#F59E0B', name: 'Classical' },
    { year: 323, label: '323 BCE', color: '#3B82F6', name: 'Hellenistic' },
    { year: 31, label: '31 BCE', color: '#DC2626', name: 'Imperial' },
    { year: 284, label: '284 CE', color: '#7C3AED', name: 'Late Antique' },
    { year: 600, label: '600 CE', color: '#059669', name: 'Byzantine' }
  ];

  const languageTypes = [
    { name: 'Greek', color: '#3B82F6', symbol: 'Γ' },
    { name: 'Latin', color: '#DC2626', symbol: 'L' },
    { name: 'Celtic', color: '#D97706', symbol: 'C' },
    { name: 'Germanic', color: '#10B981', symbol: 'G' },
    { name: 'Persian', color: '#7C3AED', symbol: 'P' },
    { name: 'Egyptian', color: '#F59E0B', symbol: 'E' },
    { name: 'Semitic', color: '#EF4444', symbol: 'S' }
  ];

  const allRegions: { [key: number]: Array<{
    id: string;
    name: string;
    language: string;
    color: string;
    type: string;
    cx: number;
    cy: number;
    size: number;
    influence: string;
    population: string;
    description: string;
  }> } = {
    800: [
      { id: 'attica', name: 'Attica', language: 'Attic Greek', color: '#3B82F6', type: 'Greek', cx: 480, cy: 180, size: 15, influence: 'Strong Greek presence in city-states', population: '~200,000', description: 'Home to Athens, developing distinct dialect' },
      { id: 'ionia', name: 'Ionia', language: 'Ionic Greek', color: '#3B82F6', type: 'Greek', cx: 520, cy: 160, size: 20, influence: 'Birthplace of philosophy and science', population: '~300,000', description: 'Greek colonies on Asia Minor coast' },
      { id: 'sparta', name: 'Sparta', language: 'Doric Greek', color: '#3B82F6', type: 'Greek', cx: 460, cy: 200, size: 18, influence: 'Military-focused Greek dialect', population: '~150,000', description: 'Conservative Doric Greek speakers' },
      { id: 'rome', name: 'Early Rome', language: 'Archaic Latin', color: '#DC2626', type: 'Latin', cx: 340, cy: 180, size: 12, influence: 'Small city-state influence', population: '~50,000', description: 'Early Latin developing in central Italy' },
      { id: 'gaul', name: 'Gaul', language: 'Celtic Languages', color: '#D97706', type: 'Celtic', cx: 260, cy: 100, size: 25, influence: 'Diverse tribal languages', population: '~2,000,000', description: 'Multiple Celtic language groups' },
      { id: 'egypt', name: 'Egypt', language: 'Late Egyptian', color: '#F59E0B', type: 'Egyptian', cx: 540, cy: 280, size: 22, influence: 'Ancient script traditions', population: '~3,000,000', description: 'Hieroglyphic and demotic scripts' }
    ],
    500: [
      { id: 'athens', name: 'Athens', language: 'Attic Greek', color: '#3B82F6', type: 'Greek', cx: 480, cy: 180, size: 20, influence: 'Cultural and intellectual center', population: '~300,000', description: 'Golden Age Greek literature and philosophy' },
      { id: 'sparta', name: 'Sparta', language: 'Doric Greek', color: '#3B82F6', type: 'Greek', cx: 460, cy: 200, size: 18, influence: 'Military hegemony', population: '~200,000', description: 'Conservative Greek dialect preserved' },
      { id: 'ionia', name: 'Ionia', language: 'Ionic Greek', color: '#3B82F6', type: 'Greek', cx: 520, cy: 160, size: 19, influence: 'Scientific revolution center', population: '~400,000', description: 'Under Persian rule but culturally Greek' },
      { id: 'rome', name: 'Roman Republic', language: 'Classical Latin', color: '#DC2626', type: 'Latin', cx: 340, cy: 180, size: 16, influence: 'Growing regional power', population: '~200,000', description: 'Latin spreading through conquest' },
      { id: 'persia', name: 'Persian Empire', language: 'Old Persian', color: '#7C3AED', type: 'Persian', cx: 620, cy: 140, size: 30, influence: 'Imperial administration', population: '~10,000,000', description: 'Administrative lingua franca' },
      { id: 'egypt', name: 'Persian Egypt', language: 'Egyptian/Persian', color: '#F59E0B', type: 'Egyptian', cx: 540, cy: 280, size: 20, influence: 'Under foreign rule', population: '~2,500,000', description: 'Egyptian continues under Persian rule' }
    ],
    323: [
      { id: 'macedonia', name: 'Macedonia', language: 'Koine Greek', color: '#3B82F6', type: 'Greek', cx: 470, cy: 160, size: 25, influence: 'Hellenistic cultural center', population: '~500,000', description: 'Birth of common Greek dialect' },
      { id: 'ptolemaic', name: 'Ptolemaic Egypt', language: 'Koine Greek', color: '#3B82F6', type: 'Greek', cx: 540, cy: 280, size: 28, influence: 'Scholarly and administrative', population: '~3,000,000', description: 'Greek rulers, Egyptian subjects' },
      { id: 'seleucid', name: 'Seleucid Empire', language: 'Koine Greek', color: '#3B82F6', type: 'Greek', cx: 580, cy: 160, size: 35, influence: 'Vast multilingual empire', population: '~8,000,000', description: 'Greek as elite language across Near East' },
      { id: 'rome', name: 'Roman Republic', language: 'Latin', color: '#DC2626', type: 'Latin', cx: 340, cy: 180, size: 20, influence: 'Growing Mediterranean power', population: '~500,000', description: 'Latin spreading through Italy' },
      { id: 'carthage', name: 'Carthage', language: 'Punic', color: '#EF4444', type: 'Semitic', cx: 300, cy: 260, size: 18, influence: 'Maritime commercial network', population: '~400,000', description: 'Phoenician dialect across trade routes' }
    ],
    31: [
      { id: 'rome', name: 'Roman Empire', language: 'Latin', color: '#DC2626', type: 'Latin', cx: 400, cy: 200, size: 50, influence: 'Imperial standard across West', population: '~50,000,000', description: 'Latin as official language of empire' },
      { id: 'alexandria', name: 'Alexandria', language: 'Koine Greek', color: '#3B82F6', type: 'Greek', cx: 540, cy: 280, size: 25, influence: 'Intellectual center', population: '~400,000', description: 'Greek scholarship continues under Rome' },
      { id: 'antioch', name: 'Antioch', language: 'Koine Greek', color: '#3B82F6', type: 'Greek', cx: 580, cy: 160, size: 22, influence: 'Eastern Roman administration', population: '~300,000', description: 'Greek-speaking Roman province' },
      { id: 'gaul', name: 'Roman Gaul', language: 'Latin/Gaulish', color: '#DC2626', type: 'Latin', cx: 260, cy: 120, size: 28, influence: 'Romanization in progress', population: '~3,000,000', description: 'Celtic languages declining' },
      { id: 'britannia', name: 'Britannia', language: 'Latin/Celtic', color: '#DC2626', type: 'Latin', cx: 200, cy: 80, size: 18, influence: 'Recent Roman conquest', population: '~1,000,000', description: 'Latin imposed on Celtic substrate' }
    ],
    284: [
      { id: 'constantinople', name: 'Constantinople', language: 'Greek', color: '#3B82F6', type: 'Greek', cx: 500, cy: 160, size: 30, influence: 'Eastern capital', population: '~500,000', description: 'Greek becomes imperial language in East' },
      { id: 'rome', name: 'Western Empire', language: 'Latin', color: '#DC2626', type: 'Latin', cx: 340, cy: 180, size: 35, influence: 'Western imperial center', population: '~1,000,000', description: 'Latin remains Western official language' },
      { id: 'alexandria', name: 'Alexandria', language: 'Greek/Coptic', color: '#3B82F6', type: 'Greek', cx: 540, cy: 280, size: 20, influence: 'Christian scholarship', population: '~300,000', description: 'Coptic Christianity emerges' },
      { id: 'antioch', name: 'Antioch', language: 'Greek/Syriac', color: '#3B82F6', type: 'Greek', cx: 580, cy: 160, size: 18, influence: 'Eastern theological center', population: '~200,000', description: 'Syriac Christian communities' },
      { id: 'persia', name: 'Sassanid Persia', language: 'Middle Persian', color: '#7C3AED', type: 'Persian', cx: 640, cy: 180, size: 25, influence: 'Eastern rival to Rome', population: '~5,000,000', description: 'Zoroastrian Persian revival' }
    ],
    600: [
      { id: 'constantinople', name: 'Byzantine Empire', language: 'Byzantine Greek', color: '#059669', type: 'Greek', cx: 500, cy: 160, size: 40, influence: 'Orthodox Christian center', population: '~8,000,000', description: 'Greek as sole imperial language' },
      { id: 'ravenna', name: 'Byzantine Italy', language: 'Greek/Latin', color: '#059669', type: 'Greek', cx: 340, cy: 180, size: 15, influence: 'Byzantine reconquest', population: '~500,000', description: 'Greek administration in Italy' },
      { id: 'carthage', name: 'Byzantine Africa', language: 'Greek/Latin', color: '#059669', type: 'Greek', cx: 300, cy: 260, size: 18, influence: 'Reconquered provinces', population: '~800,000', description: 'Greek officials, Latin populace' },
      { id: 'frankish', name: 'Frankish Kingdoms', language: 'Latin/Germanic', color: '#10B981', type: 'Germanic', cx: 280, cy: 100, size: 30, influence: 'Post-Roman kingdoms', population: '~4,000,000', description: 'Romance languages emerging' },
      { id: 'visigothic', name: 'Visigothic Spain', language: 'Latin/Gothic', color: '#10B981', type: 'Germanic', cx: 220, cy: 200, size: 25, influence: 'Germanic kingdoms', population: '~3,000,000', description: 'Latin-Germanic fusion' }
    ]
  };

  const currentRegions = allRegions[selectedEra] || [];
  const currentEra = eras.find(era => era.year === selectedEra);

  const handleRegionClick = (regionId: string) => {
    setSelectedRegion(selectedRegion === regionId ? null : regionId);
  };

  const selectedRegionData = currentRegions.find(region => region.id === selectedRegion);

  return (
    <div style={{ backgroundColor: '#0D0D0F', minHeight: '100vh', color: '#F5F4F2' }}>
      {/* Navigation */}
      <nav style={{ backgroundColor: '#1E1E24', padding: '16px 24px', borderBottom: '1px solid #2D2D35' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/" style={{ fontSize: '24px', fontWeight: 'bold', color: '#C9A227', textDecoration: 'none' }}>
            ΛΟΓΟΣ
          </Link>
          <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
            <Link href="/maps" style={{ color: '#9CA3AF', textDecoration: 'none', transition: 'color 0.2s' }}>Maps</Link>
            <Link href="/texts" style={{ color: '#9CA3AF', textDecoration: 'none', transition: 'color 0.2s' }}>Texts</Link>
            <Link href="/timeline" style={{ color: '#9CA3AF', textDecoration: 'none', transition: 'color 0.2s' }}>Timeline</Link>
          </div>
        </div>
      </nav>

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '32px 24px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h1 style={{ fontSize: '48px', fontWeight: 'bold', margin: '0 0 16px 0', background: 'linear-gradient(135deg, #C9A227, #E8D5A3)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Languages of the Ancient Mediterranean
          </h1>
          <p style={{ fontSize: '20px', color: '#9CA3AF', margin: '0', maxWidth: '800px', margin: '0 auto' }}>
            Explore the evolution of languages across the Mediterranean world from 800 BCE to 600 CE
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '32px' }}>
          {/* Map Container */}
          <div style={{ backgroundColor: '#1E1E24', borderRadius: '16px', padding: '24px' }}>
            {/* Era Info */}
            {currentEra && (
              <div style={{ marginBottom: '24px', textAlign: 'center' }}>
                <h2 style={{ 
                  fontSize: '28px', 
                  fontWeight: 'bold', 
                  margin: '0 0 8px 0',
                  color: currentEra.color
                }}>
                  {currentEra.name} Period
                </h2>
                <p style={{ fontSize: '16px', color: '#9CA3AF', margin: '0' }}>
                  {currentEra.label} - {currentRegions.length} major language regions
                </p>
              </div>
            )}

            {/* Mediterranean Map SVG */}
            <div style={{ position: 'relative' }}>
              <svg 
                viewBox="0 0 800 400" 
                style={{ 
                  width: '100%', 
                  height: '500px', 
                  backgroundColor: '#141419', 
                  borderRadius: '12px',
                  border: '2px solid #2D2D35'
                }}
              >
                {/* Mediterranean Sea */}
                <path
                  d="M150 150 Q300 120 450 140 Q600 130 750 160 L750 300 Q600 280 450 290 Q300 300 150 280 Z"
                  fill="#1E3A5F"
                  stroke="#2D4A6B"
                  strokeWidth="2"
                />
                
                {/* Landmasses */}
                {/* Iberian Peninsula */}
                <path
                  d="M50 180 Q100 160 150 170 L150 220 Q100 240 50 220 Z"
                  fill="#2D2D35"
                  stroke="#3D3D45"
                  strokeWidth="1"
                />
                
                {/* Italian Peninsula */}
                <path
                  d="M320 160 L340 140 L360 160 L370 200 L360 240 L340 250 L330 240 L320 200 Z"
                  fill="#2D2D35"
                  stroke="#3D3D45"
                  strokeWidth="1"
                />
                
                {/* Balkan Peninsula */}
                <path
                  d="M400 120 Q460 110 500 120 L520 140 L500 180 L480 190 L460 180 L440 160 L420 140 Z"
                  fill="#2D2D35"
                  stroke="#3D3D45"
                  strokeWidth="1"
                />
                
                {/* Asia Minor */}
                <path
                  d="M520 120 Q580 110 620 130 L640 150 L620 170 L580 180 L540 170 L520 150 Z"
                  fill="#2D2D35"
                  stroke="#3D3D45"
                  strokeWidth="1"
                />
                
                {/* North Africa */}
                <path
                  d="M200 280 Q400 270 600 285 L600 320 L580 340 L400 350 L200 340 L180 320 Z"
                  fill="#2D2D35"
                  stroke="#3D3D45"
                  strokeWidth="1"
                />
                
                {/* Gaul */}
                <path
                  d="M200 80 Q280 70 320 90 L300 120 L280 140 L220 130 L200 120 Z"
                  fill="#2D2D35"
                  stroke="#3D3D45"
                  strokeWidth="1"
                />
                
                {/* Britain */}
                <path
                  d="M180 40 Q220 30 240 50 L230 80 L200 90 L180 80 Z"
                  fill="#2D2D35"
                  stroke="#3D3D45"
                  strokeWidth="1"
                />

                {/* Language Regions */}
                {currentRegions.map((region) => {
                  const isHovered = hoveredRegion === region.id;
                  const isSelected = selectedRegion === region.id;
                  const scale = isHovered || isSelected ? 1.2 : 1;
                  const opacity = isHovered || isSelected ? 0.9 : 0.7;

                  return (
                    <g key={region.id}>
                      {/* Region influence area */}
                      <circle
                        cx={region.cx}
                        cy={region.cy}
                        r={region.size * 2}
                        fill={region.color}
                        opacity={0.2}
                        style={{
                          transform: `scale(${scale})`,
                          transformOrigin: `${region.cx}px ${region.cy}px`,
                          transition: 'all 0.3s ease'
                        }}
                      />
                      
                      {/* Main region circle */}
                      <circle
                        cx={region.cx}
                        cy={region.cy}
                        r={region.size}
                        fill={region.color}
                        opacity={opacity}
                        stroke={isSelected ? '#C9A227' : region.color}
                        strokeWidth={isSelected ? 3 : 1}
                        style={{
                          cursor: 'pointer',
                          transform: `scale(${scale})`,
                          transformOrigin: `${region.cx}px ${region.cy}px`,
                          transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={() => setHoveredRegion(region.id)}
                        onMouseLeave={() => setHoveredRegion(null)}
                        onClick={() => handleRegionClick(region.id)}
                      />
                      
                      {/* Language label */}
                      <text
                        x={region.cx}
                        y={region.cy + 5}
                        textAnchor="middle"
                        fill="#F5F4F2"
                        fontSize="12"
                        fontWeight="bold"
                        style={{
                          pointerEvents: 'none',
                          transform: `scale(${scale})`,
                          transformOrigin: `${region.cx}px ${region.cy}px`,
                          transition: 'all 0.3s ease'
                        }}
                      >
                        {languageTypes.find(t => t.name === region.type)?.symbol || region.type[0]}
                      </text>
                      
                      {/* Region name on hover */}
                      {(isHovered || isSelected) && (
                        <text
                          x={region.cx}
                          y={region.cy - region.size - 10}
                          textAnchor="middle"
                          fill="#F5F4F2"
                          fontSize="14"
                          fontWeight="bold"
                          style={{
                            pointerEvents: 'none'
                          }}
                        >
                          {region.name}
                        </text>
                      )}
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Time Slider */}
            <div style={{ marginTop: '32px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px', color: '#C9A227' }}>
                Historical Period
              </h3>
              <div style={{ position: 'relative' }}>
                <input
                  type="range"
                  min="0"
                  max={eras.length - 1}
                  value={eras.findIndex(era => era.year === selectedEra)}
                  onChange={(e) => setSelectedEra(eras[parseInt(e.target.value)].year)}
                  style={{
                    width: '100%',
                    height: '8px',
                    backgroundColor: '#2D2D35',
                    borderRadius: '4px',
                    outline: 'none',
                    cursor: 'pointer'
                  }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
                  {eras.map((era, index) => (
                    <button
                      key={era.year}
                      onClick={() => setSelectedEra(era.year)}
                      style={{
                        backgroundColor: selectedEra === era.year ? era.color : '#2D2D35',
                        color: '#F5F4F2',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '8px 12px',
                        fontSize: '12px',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        opacity: selectedEra === era.year ? 1 : 0.6
                      }}
                    >
                      {era.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Legend */}
            <div style={{ backgroundColor: '#1E1E24', borderRadius: '16px', padding: '24px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px', color: '#C9A227' }}>
                Language Families
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {languageTypes.map((type) => (
                  <div key={type.name} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      backgroundColor: type.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      color: '#F5F4F2'
                    }}>
                      {type.symbol}
                    </div>
                    <span style={{ fontSize: '16px', color: '#F5F4F2' }}>{type.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Selected Region Details */}
            {selectedRegionData && (
              <div style={{ backgroundColor: '#1E1E24', borderRadius: '16px', padding: '24px' }}>
                <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px', color: '#C9A227' }}>
                  {selectedRegionData.name}
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div>
                    <h4 style={{ fontSize: '14px', fontWeight: 'bold', color: '#9CA3AF', margin: '0 0 4px 0' }}>
                      Language
                    </h4>
                    <p style={{ fontSize: '16px', color: '#F5F4F2', margin: '0' }}>
                      {selectedRegionData.language}
                    </p>
                  </div>
                  <div>
                    <h4 style={{ fontSize: '14px', fontWeight: 'bold', color: '#9CA3AF', margin: '0 0 4px 0' }}>
                      Population
                    </h4>
                    <p style={{ fontSize: '16px', color: '#F5F4F2', margin: '0' }}>
                      {selectedRegionData.population}
                    </p>
                  </div>
                  <div>
                    <h4 style={{ fontSize: '14px', fontWeight: 'bold', color: '#9CA3AF', margin: '0 0 4px 0' }}>
                      Influence
                    </h4>
                    <p style={{ fontSize: '16px', color: '#F5F4F2', margin: '0' }}>
                      {selectedRegionData.influence}
                    </p>
                  </div>
                  <div>
                    <h4 style={{ fontSize: '14px', fontWeight: 'bold', color: '#9CA3AF', margin: '0 0 4px 0' }}>
                      Description
                    </h4>
                    <p style={{ fontSize: '14px', color: '#9CA3AF', margin: '0', lineHeight: '1.5' }}>
                      {selectedRegionData.description}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Historical Context */}
            <div style={{ backgroundColor: '#1E1E24', borderRadius: '16px', padding: '24px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px', color: '#C9A227' }}>
                Historical Context
              </h3>
              <div style={{ fontSize: '14px', color: '#9CA3AF', lineHeight: '1.6' }}>
                {selectedEra === 800 && (
                  <p>The Archaic period sees the emergence of Greek city-states and the early development of the Latin language in central Italy. Celtic languages dominate much of Europe.</p>
                )}
                {selectedEra === 500 && (
                  <p>The Classical period marks the golden age of Greek culture, with Attic Greek becoming prestigious. The Roman Republic begins expanding Latin influence.</p>
                )}
                {selectedEra === 323 && (
                  <p>Alexander's conquests spread Koine Greek as a lingua franca across the eastern Mediterranean, while Latin continues expanding in the west.</p>
                )}
                {selectedEra === 31 && (
                  <p>The Roman Empire establishes Latin as the official language of the western Mediterranean, while Greek remains dominant in the east.</p>
                )}
                {selectedEra === 284 && (
                  <p>The empire splits, with Greek becoming the primary language of the Eastern Empire and Latin remaining supreme in the West.</p>
                )}
                {selectedEra === 600 && (
                  <p>The Byzantine Empire continues Greek traditions while Germanic kingdoms establish new linguistic patterns in former Roman territories.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}