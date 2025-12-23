'use client'

import { useState, useEffect } from 'react'

export default function LanguageDistributionMap() {
  const [selectedYear, setSelectedYear] = useState(1)
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null)
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null)

  const languages = {
    greek: { color: '#3B82F6', name: 'Greek', icon: 'Α' },
    latin: { color: '#DC2626', name: 'Latin', icon: 'L' },
    coptic: { color: '#7C3AED', name: 'Coptic', icon: 'Ⲁ' },
    aramaic: { color: '#F59E0B', name: 'Aramaic', icon: 'א' },
    punic: { color: '#D97706', name: 'Punic', icon: 'P' }
  }

  const regions = {
    greece: {
      name: 'Greece & Aegean',
      path: 'M380,200 L420,195 L435,210 L445,220 L440,240 L425,245 L405,250 L385,245 L375,225 Z',
      languages: {
        [-500]: { dominant: 'greek', percentage: 95 },
        [-300]: { dominant: 'greek', percentage: 98 },
        [0]: { dominant: 'greek', percentage: 92 },
        [300]: { dominant: 'greek', percentage: 88 },
        [500]: { dominant: 'greek', percentage: 85 }
      }
    },
    italy: {
      name: 'Italian Peninsula',
      path: 'M320,180 L340,175 L355,190 L365,210 L360,235 L350,250 L335,240 L325,220 L315,200 Z',
      languages: {
        [-500]: { dominant: 'latin', percentage: 70 },
        [-300]: { dominant: 'latin', percentage: 85 },
        [0]: { dominant: 'latin', percentage: 95 },
        [300]: { dominant: 'latin', percentage: 98 },
        [500]: { dominant: 'latin', percentage: 95 }
      }
    },
    egypt: {
      name: 'Egypt',
      path: 'M450,280 L480,275 L485,295 L490,315 L485,335 L470,340 L455,335 L450,315 L445,295 Z',
      languages: {
        [-500]: { dominant: 'greek', percentage: 20 },
        [-300]: { dominant: 'greek', percentage: 40 },
        [0]: { dominant: 'greek', percentage: 60 },
        [300]: { dominant: 'coptic', percentage: 70 },
        [500]: { dominant: 'coptic', percentage: 85 }
      }
    },
    levant: {
      name: 'Levant',
      path: 'M490,240 L520,235 L525,250 L530,270 L525,285 L510,290 L495,285 L485,265 Z',
      languages: {
        [-500]: { dominant: 'aramaic', percentage: 80 },
        [-300]: { dominant: 'greek', percentage: 45 },
        [0]: { dominant: 'greek', percentage: 55 },
        [300]: { dominant: 'aramaic', percentage: 60 },
        [500]: { dominant: 'aramaic', percentage: 75 }
      }
    },
    northAfrica: {
      name: 'North Africa',
      path: 'M250,280 L350,275 L360,295 L370,315 L365,335 L340,340 L280,345 L245,340 L240,315 L245,295 Z',
      languages: {
        [-500]: { dominant: 'punic', percentage: 85 },
        [-300]: { dominant: 'punic', percentage: 75 },
        [0]: { dominant: 'latin', percentage: 60 },
        [300]: { dominant: 'latin', percentage: 80 },
        [500]: { dominant: 'latin', percentage: 70 }
      }
    }
  }

  const getYearFromSlider = (value: number) => {
    const years = [-500, -300, 0, 300, 500]
    return years[value]
  }

  const getRegionColor = (regionId: string) => {
    const region = regions[regionId as keyof typeof regions]
    const year = getYearFromSlider(selectedYear)
    const languageData = region.languages[year as keyof typeof region.languages]
    return languages[languageData.dominant as keyof typeof languages].color
  }

  const getRegionOpacity = (regionId: string) => {
    return hoveredRegion === regionId ? 0.8 : selectedRegion === regionId ? 0.9 : 0.6
  }

  return (
    <div className="min-h-screen bg-[#0D0D0F] text-[#F5F4F2] p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 text-[#C9A227]">
            Language Distribution Map
          </h1>
          <p className="text-lg text-[#F5F4F2]/80">
            Explore how languages spread across the Mediterranean world
          </p>
        </div>

        {/* Controls */}
        <div className="mb-6 p-4 bg-[#1E1E24] rounded-lg">
          <div className="flex items-center gap-6 mb-4">
            <div className="flex items-center gap-4">
              <span className="font-semibold">Year:</span>
              <input
                type="range"
                min="0"
                max="4"
                step="1"
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                className="w-48 h-2 bg-[#0D0D0F] rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #C9A227 0%, #C9A227 ${selectedYear * 25}%, #0D0D0F ${selectedYear * 25}%, #0D0D0F 100%)`
                }}
              />
              <span className="text-[#C9A227] font-bold min-w-[80px]">
                {getYearFromSlider(selectedYear) < 0 
                  ? `${Math.abs(getYearFromSlider(selectedYear))} BCE`
                  : `${getYearFromSlider(selectedYear)} CE`
                }
              </span>
            </div>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-4">
            {Object.entries(languages).map(([key, lang]) => (
              <div key={key} className="flex items-center gap-2">
                <div 
                  className="w-6 h-6 rounded flex items-center justify-center text-white font-bold text-sm"
                  style={{ backgroundColor: lang.color }}
                >
                  {lang.icon}
                </div>
                <span>{lang.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-6">
          {/* Map */}
          <div className="flex-1">
            <div className="bg-[#1E1E24] rounded-lg p-6">
              <svg 
                viewBox="0 0 700 500" 
                className="w-full h-auto max-h-[600px] border border-[#F5F4F2]/20 rounded"
              >
                {/* Mediterranean Sea */}
                <rect width="700" height="500" fill="#0D0D0F" />
                
                {/* Sea */}
                <ellipse cx="350" cy="250" rx="280" ry="120" fill="#1E1E24" opacity="0.5" />
                
                {/* Regions */}
                {Object.entries(regions).map(([regionId, region]) => (
                  <path
                    key={regionId}
                    d={region.path}
                    fill={getRegionColor(regionId)}
                    opacity={getRegionOpacity(regionId)}
                    stroke="#F5F4F2"
                    strokeWidth="2"
                    className="cursor-pointer transition-all duration-200"
                    onMouseEnter={() => setHoveredRegion(regionId)}
                    onMouseLeave={() => setHoveredRegion(null)}
                    onClick={() => setSelectedRegion(selectedRegion === regionId ? null : regionId)}
                  />
                ))}

                {/* Region Labels */}
                {Object.entries(regions).map(([regionId, region]) => {
                  const bounds = region.path.match(/\d+/g)?.map(Number) || []
                  const centerX = Math.max(...bounds.filter((_, i) => i % 2 === 0)) - 
                                 Math.min(...bounds.filter((_, i) => i % 2 === 0))
                  const centerY = Math.max(...bounds.filter((_, i) => i % 2 === 1)) - 
                                 Math.min(...bounds.filter((_, i) => i % 2 === 1))
                  
                  return (
                    <text
                      key={`${regionId}-label`}
                      x={Math.min(...bounds.filter((_, i) => i % 2 === 0)) + centerX / 2}
                      y={Math.min(...bounds.filter((_, i) => i % 2 === 1)) + centerY / 2}
                      fill="#F5F4F2"
                      fontSize="12"
                      fontWeight="bold"
                      textAnchor="middle"
                      className="pointer-events-none"
                    >
                      {region.name}
                    </text>
                  )
                })}
              </svg>
            </div>
          </div>

          {/* Region Details */}
          <div className="w-80">
            <div className="bg-[#1E1E24] rounded-lg p-6">
              <h3 className="text-xl font-bold mb-4 text-[#C9A227]">
                Region Details
              </h3>
              
              {selectedRegion ? (
                <div>
                  <h4 className="text-lg font-semibold mb-3">
                    {regions[selectedRegion as keyof typeof regions].name}
                  </h4>
                  
                  <div className="mb-4">
                    <p className="text-sm text-[#F5F4F2]/70 mb-2">
                      Year: {getYearFromSlider(selectedYear) < 0 
                        ? `${Math.abs(getYearFromSlider(selectedYear))} BCE`
                        : `${getYearFromSlider(selectedYear)} CE`
                      }
                    </p>
                    
                    {(() => {
                      const region = regions[selectedRegion as keyof typeof regions]
                      const year = getYearFromSlider(selectedYear)
                      const languageData = region.languages[year as keyof typeof region.languages]
                      const dominantLang = languages[languageData.dominant as keyof typeof languages]
                      
                      return (
                        <div className="space-y-3">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <div 
                                className="w-5 h-5 rounded flex items-center justify-center text-white font-bold text-xs"
                                style={{ backgroundColor: dominantLang.color }}
                              >
                                {dominantLang.icon}
                              </div>
                              <span className="font-semibold">{dominantLang.name}</span>
                              <span className="text-[#C9A227]">{languageData.percentage}%</span>
                            </div>
                            <div className="w-full bg-[#0D0D0F] rounded-full h-2">
                              <div 
                                className="h-2 rounded-full transition-all duration-500"
                                style={{ 
                                  backgroundColor: dominantLang.color,
                                  width: `${languageData.percentage}%` 
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      )
                    })()}
                  </div>

                  <div className="mt-4 p-3 bg-[#0D0D0F] rounded">
                    <h5 className="font-semibold mb-2">Historical Context</h5>
                    <p className="text-sm text-[#F5F4F2]/80">
                      {selectedRegion === 'greece' && 'Center of Greek civilization and philosophical thought.'}
                      {selectedRegion === 'italy' && 'Heart of the Roman Empire and Latin literature.'}
                      {selectedRegion === 'egypt' && 'Hellenistic culture mixing with local traditions.'}
                      {selectedRegion === 'levant' && 'Crossroads of Greek, Aramaic, and local languages.'}
                      {selectedRegion === 'northAfrica' && 'Roman colonization replacing Punic influence.'}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-[#F5F4F2]/60">
                  Click on a region to see detailed language distribution data
                </p>
              )}
            </div>

            {/* Timeline Events */}
            <div className="mt-6 bg-[#1E1E24] rounded-lg p-6">
              <h3 className="text-lg font-bold mb-3 text-[#C9A227]">
                Key Events
              </h3>
              <div className="space-y-2 text-sm">
                {getYearFromSlider(selectedYear) <= -500 && (
                  <div className="p-2 bg-[#0D0D0F] rounded">
                    <span className="text-[#3B82F6]">500 BCE:</span> Greek city-states flourishing
                  </div>
                )}
                {getYearFromSlider(selectedYear) <= -300 && (
                  <div className="p-2 bg-[#0D0D0F] rounded">
                    <span className="text-[#F59E0B]">323 BCE:</span> Alexander's empire spreads Greek
                  </div>
                )}
                {getYearFromSlider(selectedYear) <= 0 && (
                  <div className="p-2 bg-[#0D0D0F] rounded">
                    <span className="text-[#DC2626]">27 BCE:</span> Roman Empire established
                  </div>
                )}
                {getYearFromSlider(selectedYear) <= 300 && (
                  <div className="p-2 bg-[#0D0D0F] rounded">
                    <span className="text-[#7C3AED]">313 CE:</span> Christianity legalized
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}