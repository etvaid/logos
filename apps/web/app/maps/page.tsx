'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { MapIcon, GlobeAltIcon, UserGroupIcon, TruckIcon, ClockIcon, BuildingLibraryIcon } from '@heroicons/react/24/outline'

const mapCards = [
  {
    id: 'languages',
    title: 'Language Distribution',
    description: 'Explore the geographical spread of Greek and Latin across the ancient world',
    icon: MapIcon,
    href: '/maps/languages',
    color: '#3B82F6'
  },
  {
    id: 'political',
    title: 'Political Control',
    description: 'Track territorial changes and political boundaries across different periods',
    icon: GlobeAltIcon,
    href: '/maps/political',
    color: '#DC2626'
  },
  {
    id: 'authors',
    title: 'Author Origins',
    description: 'Discover where ancient authors were born and where they worked',
    icon: UserGroupIcon,
    href: '/maps/authors',
    color: '#C9A227'
  },
  {
    id: 'trade',
    title: 'Trade Routes',
    description: 'Follow commercial networks that connected the ancient Mediterranean',
    icon: TruckIcon,
    href: '/maps/trade',
    color: '#F59E0B'
  },
  {
    id: 'timeline',
    title: 'Timeline',
    description: 'Navigate through different historical periods and their key events',
    icon: ClockIcon,
    href: '/timeline',
    color: '#7C3AED'
  },
  {
    id: 'libraries',
    title: 'Libraries',
    description: 'Locate major libraries and centers of learning in antiquity',
    icon: BuildingLibraryIcon,
    href: '/maps/libraries',
    color: '#D97706'
  }
]

export default function MapsHub() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)

  const handleCardHover = (cardId: string) => {
    setHoveredCard(cardId)
  }

  const handleCardLeave = () => {
    setHoveredCard(null)
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0D0D0F' }}>
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-12">
          <h1 
            className="text-4xl font-bold mb-4"
            style={{ color: '#F5F4F2' }}
          >
            Interactive Maps
          </h1>
          <p 
            className="text-xl opacity-80 max-w-3xl"
            style={{ color: '#F5F4F2' }}
          >
            Explore the ancient world through interactive visualizations of languages, politics, 
            culture, and commerce across different historical periods.
          </p>
        </div>

        {/* Maps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mapCards.map((card) => {
            const IconComponent = card.icon
            const isHovered = hoveredCard === card.id
            
            return (
              <Link key={card.id} href={card.href}>
                <div
                  className="rounded-lg border transition-all duration-300 cursor-pointer transform hover:scale-105"
                  style={{
                    backgroundColor: isHovered ? '#1E1E24' : '#0D0D0F',
                    borderColor: isHovered ? card.color : '#1E1E24',
                    borderWidth: '2px'
                  }}
                  onMouseEnter={() => handleCardHover(card.id)}
                  onMouseLeave={handleCardLeave}
                >
                  <div className="p-6">
                    {/* Icon */}
                    <div className="mb-4">
                      <div
                        className="w-12 h-12 rounded-lg flex items-center justify-center transition-colors duration-300"
                        style={{
                          backgroundColor: isHovered ? `${card.color}20` : '#1E1E24'
                        }}
                      >
                        <IconComponent
                          className="w-6 h-6"
                          style={{ color: card.color }}
                        />
                      </div>
                    </div>

                    {/* Title */}
                    <h3
                      className="text-xl font-semibold mb-2 transition-colors duration-300"
                      style={{
                        color: isHovered ? card.color : '#F5F4F2'
                      }}
                    >
                      {card.title}
                    </h3>

                    {/* Description */}
                    <p
                      className="text-sm leading-relaxed"
                      style={{ color: '#F5F4F2', opacity: 0.7 }}
                    >
                      {card.description}
                    </p>

                    {/* Arrow indicator */}
                    <div className="mt-4 flex items-center text-sm">
                      <span
                        className="transition-colors duration-300"
                        style={{
                          color: isHovered ? card.color : '#C9A227'
                        }}
                      >
                        Explore
                      </span>
                      <svg
                        className="w-4 h-4 ml-2 transition-transform duration-300"
                        style={{
                          color: isHovered ? card.color : '#C9A227',
                          transform: isHovered ? 'translateX(4px)' : 'translateX(0px)'
                        }}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        {/* Additional Info */}
        <div
          className="mt-12 p-6 rounded-lg border"
          style={{
            backgroundColor: '#1E1E24',
            borderColor: '#C9A227'
          }}
        >
          <div className="flex items-start space-x-4">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: '#C9A227' }}
            >
              <MapIcon className="w-5 h-5" style={{ color: '#0D0D0F' }} />
            </div>
            <div>
              <h3
                className="text-lg font-semibold mb-2"
                style={{ color: '#C9A227' }}
              >
                Interactive Features
              </h3>
              <p
                className="text-sm leading-relaxed"
                style={{ color: '#F5F4F2', opacity: 0.8 }}
              >
                Each map includes filtering by time period, zoom controls, detailed tooltips, 
                and the ability to overlay multiple data sets. Navigate between different eras 
                to see how the ancient world evolved over time.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}