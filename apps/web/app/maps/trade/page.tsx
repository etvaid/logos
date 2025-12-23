'use client';

import React, { useState } from 'react';

export default function TradeRoutesMap() {
  const [selectedEra, setSelectedEra] = useState('medieval');
  const [hoveredRoute, setHoveredRoute] = useState(null);

  const eras = [
    { id: 'ancient', name: 'Ancient (500 BC - 500 AD)', period: 'Classical Antiquity' },
    { id: 'medieval', name: 'Medieval (500 - 1500 AD)', period: 'Middle Ages' },
    { id: 'renaissance', name: 'Renaissance (1400 - 1600 AD)', period: 'Age of Exploration' }
  ];

  const commodities = [
    { id: 'silk', name: 'Silk & Textiles', color: '#C9A227' },
    { id: 'spices', name: 'Spices', color: '#E74C3C' },
    { id: 'gold', name: 'Gold & Silver', color: '#F1C40F' },
    { id: 'grain', name: 'Grain & Food', color: '#27AE60' },
    { id: 'pottery', name: 'Pottery & Crafts', color: '#8E44AD' },
    { id: 'slaves', name: 'Slaves', color: '#34495E' }
  ];

  const tradeRoutes = {
    ancient: [
      {
        id: 1,
        name: 'Phoenician Trade Network',
        commodity: 'pottery',
        path: 'M 400 180 Q 350 160 300 170 Q 250 180 200 190 Q 150 200 100 220',
        origin: 'Tyre',
        destination: 'Carthage',
        goods: 'Purple dye, Cedar wood, Glass',
        value: '500,000 denarii/year'
      },
      {
        id: 2,
        name: 'Roman Grain Route',
        commodity: 'grain',
        path: 'M 300 240 Q 320 220 350 210 Q 380 200 420 190',
        origin: 'Alexandria',
        destination: 'Rome',
        goods: 'Egyptian grain, Papyrus',
        value: '2,000,000 denarii/year'
      },
      {
        id: 3,
        name: 'Silk Road Terminal',
        commodity: 'silk',
        path: 'M 450 160 Q 480 150 520 160 Q 560 170 600 180',
        origin: 'Constantinople',
        destination: 'Antioch',
        goods: 'Chinese silk, Indian spices',
        value: '1,500,000 denarii/year'
      }
    ],
    medieval: [
      {
        id: 4,
        name: 'Venetian Spice Route',
        commodity: 'spices',
        path: 'M 350 150 Q 380 140 420 150 Q 460 160 500 170 Q 540 180 580 190',
        origin: 'Venice',
        destination: 'Constantinople',
        goods: 'Pepper, Cinnamon, Nutmeg',
        value: '800,000 florins/year'
      },
      {
        id: 5,
        name: 'Genoese Gold Route',
        commodity: 'gold',
        path: 'M 280 160 Q 250 150 220 160 Q 190 170 160 180 Q 130 190 100 200',
        origin: 'Genoa',
        destination: 'Tunis',
        goods: 'African gold, Ivory',
        value: '600,000 florins/year'
      },
      {
        id: 6,
        name: 'Byzantine Silk Trade',
        commodity: 'silk',
        path: 'M 500 170 Q 520 160 540 150 Q 580 140 620 150',
        origin: 'Constantinople',
        destination: 'Trebizond',
        goods: 'Byzantine silk, Religious artifacts',
        value: '400,000 bezants/year'
      },
      {
        id: 7,
        name: 'Maghreb Caravan Route',
        commodity: 'slaves',
        path: 'M 150 220 Q 180 240 220 250 Q 260 260 300 250',
        origin: 'Fez',
        destination: 'Tunis',
        goods: 'Sub-Saharan slaves, Gold dust',
        value: '300,000 dinars/year'
      }
    ],
    renaissance: [
      {
        id: 8,
        name: 'Ottoman Spice Monopoly',
        commodity: 'spices',
        path: 'M 500 170 Q 480 160 450 150 Q 420 140 390 150 Q 360 160 330 170',
        origin: 'Constantinople',
        destination: 'Venice',
        goods: 'Asian spices, Coffee',
        value: '1,200,000 ducats/year'
      },
      {
        id: 9,
        name: 'Spanish Silver Fleet',
        commodity: 'gold',
        path: 'M 200 180 Q 170 170 140 180 Q 110 190 80 200',
        origin: 'Seville',
        destination: 'Genoa',
        goods: 'American silver, Colonial goods',
        value: '3,000,000 reales/year'
      },
      {
        id: 10,
        name: 'Levantine Textile Route',
        commodity: 'silk',
        path: 'M 520 180 Q 550 170 580 180 Q 610 190 640 200',
        origin: 'Aleppo',
        destination: 'Smyrna',
        goods: 'Syrian textiles, Raw silk',
        value: '700,000 piastres/year'
      }
    ]
  };

  const cities = [
    { name: 'Venice', x: 350, y: 150 },
    { name: 'Genoa', x: 280, y: 160 },
    { name: 'Rome', x: 320, y: 180 },
    { name: 'Constantinople', x: 500, y: 170 },
    { name: 'Alexandria', x: 480, y: 240 },
    { name: 'Tunis', x: 300, y: 250 },
    { name: 'Palermo', x: 340, y: 220 },
    { name: 'Barcelona', x: 220, y: 180 },
    { name: 'Marseille', x: 250, y: 160 }
  ];

  const currentRoutes = tradeRoutes[selectedEra] || [];

  return (
    <div className="min-h-screen bg-[#0D0D0F] text-[#F5F4F2] p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-[#C9A227] to-[#F5F4F2] bg-clip-text text-transparent">
            Mediterranean Trade Routes
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Explore the commercial arteries that connected civilizations across the Mediterranean Sea
          </p>
        </div>

        {/* Era Selector */}
        <div className="flex justify-center mb-8">
          <div className="bg-gray-800 rounded-lg p-2 flex space-x-2">
            {eras.map((era) => (
              <button
                key={era.id}
                onClick={() => setSelectedEra(era.id)}
                className={`px-6 py-3 rounded-md transition-all duration-300 ${
                  selectedEra === era.id
                    ? 'bg-[#C9A227] text-[#0D0D0F] font-semibold'
                    : 'text-[#F5F4F2] hover:bg-gray-700'
                }`}
              >
                <div className="text-center">
                  <div className="text-sm font-medium">{era.period}</div>
                  <div className="text-xs opacity-75">{era.name}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Map */}
          <div className="lg:col-span-3">
            <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
              <svg 
                viewBox="0 0 700 300" 
                className="w-full h-auto bg-gradient-to-br from-blue-950 to-blue-900 rounded-xl border border-gray-700"
              >
                {/* Mediterranean Sea Background */}
                <defs>
                  <radialGradient id="seaGradient" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#1e3a8a" />
                    <stop offset="100%" stopColor="#0f172a" />
                  </radialGradient>
                </defs>
                <rect width="700" height="300" fill="url(#seaGradient)" />

                {/* Simplified Mediterranean Coastlines */}
                <path
                  d="M 50 80 Q 150 60 250 80 Q 350 100 450 90 Q 550 80 650 100 L 650 120 Q 600 110 550 120 Q 500 130 450 140 Q 400 135 350 140 Q 300 145 250 150 Q 200 155 150 160 Q 100 165 50 170 Z"
                  fill="#2d4a3d"
                  stroke="#4a6b5c"
                  strokeWidth="1"
                  opacity="0.8"
                />
                
                {/* Southern Coastline (North Africa) */}
                <path
                  d="M 50 220 Q 100 200 150 210 Q 200 220 250 215 Q 300 210 350 220 Q 400 230 450 225 Q 500 220 550 230 Q 600 240 650 235 L 650 280 L 50 280 Z"
                  fill="#3d2d1a"
                  stroke="#5c4a2d"
                  strokeWidth="1"
                  opacity="0.8"
                />

                {/* Eastern Coastline */}
                <path
                  d="M 600 100 Q 620 120 630 140 Q 640 160 650 180 Q 660 200 650 220 L 630 210 Q 620 190 610 170 Q 600 150 590 130 Z"
                  fill="#2d3d1a"
                  stroke="#4a5c2d"
                  strokeWidth="1"
                  opacity="0.8"
                />

                {/* Trade Routes */}
                {currentRoutes.map((route) => {
                  const commodity = commodities.find(c => c.id === route.commodity);
                  return (
                    <path
                      key={route.id}
                      d={route.path}
                      fill="none"
                      stroke={commodity?.color || '#C9A227'}
                      strokeWidth={hoveredRoute === route.id ? "4" : "2"}
                      strokeDasharray="5,5"
                      opacity={hoveredRoute === route.id ? "1" : "0.7"}
                      className="cursor-pointer transition-all duration-300"
                      onMouseEnter={() => setHoveredRoute(route.id)}
                      onMouseLeave={() => setHoveredRoute(null)}
                    >
                      <animate
                        attributeName="stroke-dashoffset"
                        values="0;10"
                        dur="2s"
                        repeatCount="indefinite"
                      />
                    </path>
                  );
                })}

                {/* Cities */}
                {cities.map((city, index) => (
                  <g key={index}>
                    <circle
                      cx={city.x}
                      cy={city.y}
                      r="4"
                      fill="#C9A227"
                      stroke="#F5F4F2"
                      strokeWidth="1"
                      className="hover:r-6 transition-all duration-300 cursor-pointer"
                    />
                    <text
                      x={city.x}
                      y={city.y - 10}
                      textAnchor="middle"
                      fill="#F5F4F2"
                      fontSize="10"
                      fontWeight="500"
                      className="pointer-events-none"
                    >
                      {city.name}
                    </text>
                  </g>
                ))}

                {/* Route Direction Arrows */}
                {currentRoutes.map((route) => (
                  <defs key={`arrow-${route.id}`}>
                    <marker
                      id={`arrowhead-${route.id}`}
                      markerWidth="10"
                      markerHeight="7"
                      refX="9"
                      refY="3.5"
                      orient="auto"
                    >
                      <polygon
                        points="0 0, 10 3.5, 0 7"
                        fill={commodities.find(c => c.id === route.commodity)?.color || '#C9A227'}
                      />
                    </marker>
                  </defs>
                ))}
              </svg>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Legend */}
            <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
              <h3 className="text-xl font-bold text-[#C9A227] mb-4">Commodities</h3>
              <div className="space-y-3">
                {commodities.map((commodity) => (
                  <div key={commodity.id} className="flex items-center space-x-3">
                    <div
                      className="w-4 h-4 rounded-full border border-gray-600"
                      style={{ backgroundColor: commodity.color }}
                    ></div>
                    <span className="text-sm">{commodity.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Route Details */}
            {hoveredRoute && (
              <div className="bg-gray-900 rounded-xl p-6 border border-[#C9A227] border-opacity-50">
                <h3 className="text-lg font-bold text-[#C9A227] mb-3">Route Details</h3>
                {(() => {
                  const route = currentRoutes.find(r => r.id === hoveredRoute);
                  if (!route) return null;
                  return (
                    <div className="space-y-2 text-sm">
                      <div><span className="font-semibold">Route:</span> {route.name}</div>
                      <div><span className="font-semibold">From:</span> {route.origin}</div>
                      <div><span className="font-semibold">To:</span> {route.destination}</div>
                      <div><span className="font-semibold">Goods:</span> {route.goods}</div>
                      <div><span className="font-semibold">Annual Value:</span> {route.value}</div>
                    </div>
                  );
                })()}
              </div>
            )}

            {/* Era Statistics */}
            <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
              <h3 className="text-lg font-bold text-[#C9A227] mb-3">Era Statistics</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Active Routes:</span>
                  <span className="font-semibold">{currentRoutes.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Major Ports:</span>
                  <span className="font-semibold">{cities.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Trade Volume:</span>
                  <span className="font-semibold">
                    {selectedEra === 'ancient' ? 'High' : 
                     selectedEra === 'medieval' ? 'Very High' : 'Peak'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 text-center text-gray-400">
          <p>Hover over trade routes to see detailed information • Select different eras to explore changing patterns</p>
        </div>
      </div>
    </div>
  );
}