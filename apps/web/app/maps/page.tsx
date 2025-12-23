'use client';
import React, { useState } from 'react';

export default function MapsPage() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const mapCards = [
    {
      id: 'trade-routes',
      title: 'Trade Routes',
      description: 'Explore the commercial networks that connected medieval civilizations and facilitated cultural exchange.',
      color: 'amber',
      bgColor: 'bg-amber-500',
      textColor: 'text-amber-400',
      borderColor: 'border-amber-500',
      icon: '🛣️'
    },
    {
      id: 'language-distribution',
      title: 'Language Distribution',
      description: 'Discover the linguistic landscape of medieval Europe and the spread of vernacular literatures.',
      color: 'blue',
      bgColor: 'bg-blue-500',
      textColor: 'text-blue-400',
      borderColor: 'border-blue-500',
      icon: '🗣️'
    },
    {
      id: 'political-control',
      title: 'Political Control',
      description: 'Visualize the rise and fall of kingdoms, empires, and political boundaries across centuries.',
      color: 'red',
      bgColor: 'bg-red-500',
      textColor: 'text-red-400',
      borderColor: 'border-red-500',
      icon: '👑'
    },
    {
      id: 'author-origins',
      title: 'Author Origins',
      description: 'Map the geographical distribution of medieval writers and their cultural backgrounds.',
      color: 'green',
      bgColor: 'bg-green-500',
      textColor: 'text-green-400',
      borderColor: 'border-green-500',
      icon: '✍️'
    },
    {
      id: 'libraries-schools',
      title: 'Libraries & Schools',
      description: 'Locate centers of learning, scriptoriums, and educational institutions of the medieval world.',
      color: 'purple',
      bgColor: 'bg-purple-500',
      textColor: 'text-purple-400',
      borderColor: 'border-purple-500',
      icon: '📚'
    },
    {
      id: 'manuscript-survival',
      title: 'Manuscript Survival',
      description: 'Track the preservation and distribution of medieval texts across modern collections.',
      color: 'gray',
      bgColor: 'bg-gray-500',
      textColor: 'text-gray-400',
      borderColor: 'border-gray-500',
      icon: '📜'
    }
  ];

  const handleCardClick = (mapType: string) => {
    window.location.href = `/maps/${mapType}`;
  };

  return (
    <div className="min-h-screen bg-[#0D0D0F] text-[#F5F4F2]">
      {/* Header */}
      <div className="pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-4">
            <h1 className="text-6xl md:text-7xl font-bold tracking-tight mb-6">
              <span className="text-[#C9A227]">Maps</span> Hub
            </h1>
            <p className="text-xl md:text-2xl text-[#F5F4F2]/80 max-w-4xl mx-auto leading-relaxed">
              Navigate through interactive visualizations that reveal the geographical dimensions 
              of medieval literature and culture
            </p>
          </div>
        </div>
      </div>

      {/* Maps Grid */}
      <div className="max-w-7xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mapCards.map((card) => (
            <div
              key={card.id}
              className={`group relative bg-[#1A1A1F] border-2 ${
                hoveredCard === card.id ? card.borderColor : 'border-[#2A2A2F]'
              } rounded-2xl p-8 cursor-pointer transition-all duration-500 ease-out transform ${
                hoveredCard === card.id ? 'scale-105 shadow-2xl' : 'hover:scale-102'
              }`}
              onMouseEnter={() => setHoveredCard(card.id)}
              onMouseLeave={() => setHoveredCard(null)}
              onClick={() => handleCardClick(card.id)}
            >
              {/* Background Glow */}
              <div 
                className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 ${card.bgColor}`}
              />
              
              {/* Content */}
              <div className="relative z-10">
                {/* Icon */}
                <div className="mb-6">
                  <div className={`text-5xl mb-4 transition-all duration-300 ${
                    hoveredCard === card.id ? 'scale-110' : ''
                  }`}>
                    {card.icon}
                  </div>
                </div>

                {/* Title */}
                <h3 className={`text-2xl font-bold mb-4 transition-colors duration-300 ${
                  hoveredCard === card.id ? card.textColor : 'text-[#F5F4F2]'
                }`}>
                  {card.title}
                </h3>

                {/* Description */}
                <p className="text-[#F5F4F2]/70 leading-relaxed text-base mb-6">
                  {card.description}
                </p>

                {/* Action Indicator */}
                <div className={`flex items-center space-x-2 transition-all duration-300 ${
                  hoveredCard === card.id ? `${card.textColor} translate-x-2` : 'text-[#C9A227]'
                }`}>
                  <span className="text-sm font-semibold tracking-wide uppercase">Explore Map</span>
                  <svg 
                    className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>

              {/* Corner Accent */}
              <div className={`absolute top-0 right-0 w-20 h-20 rounded-bl-full rounded-tr-2xl opacity-10 transition-opacity duration-300 ${
                hoveredCard === card.id ? card.bgColor + ' opacity-30' : card.bgColor
              }`} />
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <p className="text-lg text-[#F5F4F2]/60 mb-8">
            Each map reveals unique patterns in medieval literary culture
          </p>
          <div className="inline-flex items-center space-x-4 bg-[#1A1A1F] border border-[#2A2A2F] rounded-full px-8 py-4">
            <span className="text-[#C9A227] text-sm font-semibold">6 Interactive Maps Available</span>
            <div className="w-2 h-2 bg-[#C9A227] rounded-full animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}