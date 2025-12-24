'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function MapsHub() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [hoveredNav, setHoveredNav] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = [
    { name: 'All', icon: '🗺️', color: '#C9A227' },
    { name: 'Linguistic', icon: '🗣️', color: '#3B82F6' },
    { name: 'Political', icon: '👑', color: '#DC2626' },
    { name: 'Literary', icon: '✍️', color: '#10B981' },
    { name: 'Economic', icon: '🚢', color: '#F59E0B' },
    { name: 'Educational', icon: '📚', color: '#8B5CF6' },
    { name: 'Temporal', icon: '⏱️', color: '#EC4899' },
    { name: 'Cultural', icon: '⚡', color: '#A855F7' },
    { name: 'Military', icon: '⚔️', color: '#EF4444' }
  ];

  const maps = [
    { 
      id: 1,
      href: "/maps/languages", 
      title: "Language Distribution", 
      desc: "Where Greek and Latin dominated across the Mediterranean world",
      icon: "🗣️", 
      color: "#3B82F6",
      category: "Linguistic",
      preview: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='200' viewBox='0 0 300 200'%3E%3Crect width='300' height='200' fill='%23141419'/%3E%3Ccircle cx='80' cy='60' r='25' fill='%233B82F6' opacity='0.7'/%3E%3Ccircle cx='150' cy='80' r='35' fill='%23DC2626' opacity='0.7'/%3E%3Ccircle cx='220' cy='70' r='20' fill='%233B82F6' opacity='0.7'/%3E%3Ctext x='150' y='130' fill='%23F5F4F2' text-anchor='middle' font-size='12'%3ELanguage Regions%3C/text%3E%3C/svg%3E"
    },
    { 
      id: 2,
      href: "/maps/political", 
      title: "Political Control", 
      desc: "2000 years of empires, kingdoms, and city-states",
      icon: "👑", 
      color: "#DC2626",
      category: "Political",
      preview: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='200' viewBox='0 0 300 200'%3E%3Crect width='300' height='200' fill='%23141419'/%3E%3Crect x='20' y='40' width='80' height='60' fill='%23DC2626' opacity='0.7'/%3E%3Crect x='110' y='30' width='90' height='80' fill='%23F59E0B' opacity='0.7'/%3E%3Crect x='210' y='50' width='70' height='50' fill='%237C3AED' opacity='0.7'/%3E%3Ctext x='150' y='130' fill='%23F5F4F2' text-anchor='middle' font-size='12'%3EEmpire Boundaries%3C/text%3E%3C/svg%3E"
    },
    { 
      id: 3,
      href: "/maps/authors", 
      title: "Author Origins", 
      desc: "Birthplaces and centers of classical writers and philosophers",
      icon: "✍️", 
      color: "#10B981",
      category: "Literary",
      preview: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='200' viewBox='0 0 300 200'%3E%3Crect width='300' height='200' fill='%23141419'/%3E%3Ccircle cx='60' cy='80' r='4' fill='%2310B981'/%3E%3Ccircle cx='120' cy='60' r='6' fill='%2310B981'/%3E%3Ccircle cx='180' cy='90' r='5' fill='%2310B981'/%3E%3Ccircle cx='240' cy='70' r='4' fill='%2310B981'/%3E%3Ccircle cx='90' cy='120' r='5' fill='%2310B981'/%3E%3Ctext x='150' y='150' fill='%23F5F4F2' text-anchor='middle' font-size='12'%3EAuthor Locations%3C/text%3E%3C/svg%3E"
    },
    { 
      id: 4,
      href: "/maps/trade", 
      title: "Trade Routes", 
      desc: "Ancient commerce paths connecting civilizations",
      icon: "🚢", 
      color: "#F59E0B",
      category: "Economic",
      preview: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='200' viewBox='0 0 300 200'%3E%3Crect width='300' height='200' fill='%23141419'/%3E%3Cpath d='M20 100 Q80 60 150 80 T280 70' stroke='%23F59E0B' stroke-width='3' fill='none' opacity='0.8'/%3E%3Cpath d='M30 120 Q100 140 200 110 T270 120' stroke='%23F59E0B' stroke-width='2' fill='none' opacity='0.6'/%3E%3Ccircle cx='50' cy='90' r='3' fill='%23F59E0B'/%3E%3Ccircle cx='150' cy='80' r='3' fill='%23F59E0B'/%3E%3Ccircle cx='250' cy='75' r='3' fill='%23F59E0B'/%3E%3Ctext x='150' y='160' fill='%23F5F4F2' text-anchor='middle' font-size='12'%3ETrade Networks%3C/text%3E%3C/svg%3E"
    },
    { 
      id: 5,
      href: "/maps/libraries", 
      title: "Libraries & Schools", 
      desc: "Centers of ancient learning and manuscript preservation",
      icon: "📚", 
      color: "#8B5CF6",
      category: "Educational",
      preview: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='200' viewBox='0 0 300 200'%3E%3Crect width='300' height='200' fill='%23141419'/%3E%3Crect x='70' y='60' width='20' height='30' fill='%238B5CF6' opacity='0.8'/%3E%3Crect x='130' y='50' width='25' height='40' fill='%238B5CF6' opacity='0.9'/%3E%3Crect x='200' y='65' width='20' height='25' fill='%238B5CF6' opacity='0.7'/%3E%3Ccircle cx='80' cy='75' r='15' stroke='%23C9A227' stroke-width='2' fill='none' opacity='0.6'/%3E%3Ccircle cx='142' cy='70' r='20' stroke='%23C9A227' stroke-width='2' fill='none' opacity='0.8'/%3E%3Ctext x='150' y='140' fill='%23F5F4F2' text-anchor='middle' font-size='12'%3ELearning Centers%3C/text%3E%3C/svg%3E"
    },
    { 
      id: 6,
      href: "/timeline", 
      title: "Historical Timeline", 
      desc: "Major events across 2300 years of classical history",
      icon: "⏱️", 
      color: "#EC4899",
      category: "Temporal",
      preview: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='200' viewBox='0 0 300 200'%3E%3Crect width='300' height='200' fill='%23141419'/%3E%3Cline x1='30' y1='100' x2='270' y2='100' stroke='%23EC4899' stroke-width='3'/%3E%3Ccircle cx='60' cy='100' r='5' fill='%23D97706'/%3E%3Ccircle cx='120' cy='100' r='5' fill='%23F59E0B'/%3E%3Ccircle cx='180' cy='100' r='5' fill='%233B82F6'/%3E%3Ccircle cx='240' cy='100' r='5' fill='%23DC2626'/%3E%3Ctext x='150' y='130' fill='%23F5F4F2' text-anchor='middle' font-size='12'%3EHistorical Timeline%3C/text%3E%3C/svg%3E"
    },
    { 
      id: 7,
      href: "/maps/mythology", 
      title: "Mythological Sites", 
      desc: "Sacred places and legendary locations from ancient myths",
      icon: "⚡", 
      color: "#A855F7",
      category: "Cultural",
      preview: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='200' viewBox='0 0 300 200'%3E%3Crect width='300' height='200' fill='%23141419'/%3E%3Cpolygon points='150,40 160,70 190,70 170,90 180,120 150,100 120,120 130,90 110,70 140,70' fill='%23A855F7' opacity='0.8'/%3E%3Ccircle cx='80' cy='80' r='8' fill='%23C9A227' opacity='0.6'/%3E%3Ccircle cx='220' cy='110' r='6' fill='%23C9A227' opacity='0.6'/%3E%3Ctext x='150' y='160' fill='%23F5F4F2' text-anchor='middle' font-size='12'%3EMythic Locations%3C/text%3E%3C/svg%3E"
    },
    { 
      id: 8,
      href: "/maps/battles", 
      title: "Famous Battles", 
      desc: "Decisive military encounters that shaped ancient history",
      icon: "⚔️", 
      color: "#EF4444",
      category: "Military",
      preview: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='200' viewBox='0 0 300 200'%3E%3Crect width='300' height='200' fill='%23141419'/%3E%3Cpath d='M50 80 L100 60 L90 100 Z' fill='%23EF4444' opacity='0.7'/%3E%3Cpath d='M150 70 L200 50 L190 90 Z' fill='%233B82F6' opacity='0.7'/%3E%3Cpath d='M220 100 L270 80 L260 120 Z' fill='%23EF4444' opacity='0.7'/%3E%3Ctext x='150' y='150' fill='%23F5F4F2' text-anchor='middle' font-size='12'%3EBattle Sites%3C/text%3E%3C/svg%3E"
    },
    { 
      id: 9,
      href: "/maps/cities", 
      title: "Major Cities", 
      desc: "Greatest urban centers of the classical world",
      icon: "🏛️", 
      color: "#F59E0B",
      category: "Cultural",
      preview: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='200' viewBox='0 0 300 200'%3E%3Crect width='300' height='200' fill='%23141419'/%3E%3Crect x='60' y='100' width='8' height='40' fill='%23F59E0B'/%3E%3Crect x='70' y='90' width='10' height='50' fill='%23F59E0B'/%3E%3Crect x='82' y='95' width='8' height='45' fill='%23F59E0B'/%3E%3Crect x='150' y='85' width='12' height='55' fill='%23C9A227'/%3E%3Crect x='164' y='95' width='8' height='45' fill='%23C9A227'/%3E%3Crect x='220' y='105' width='6' height='35' fill='%23F59E0B'/%3E%3Ctext x='150' y='165' fill='%23F5F4F2' text-anchor='middle' font-size='12'%3EUrban Centers%3C/text%3E%3C/svg%3E"
    }
  ];

  const filteredMaps = selectedCategory === 'All' 
    ? maps 
    : maps.filter(map => map.category === selectedCategory);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0D0D0F', color: '#F5F4F2' }}>
      {/* Navigation */}
      <nav style={{ backgroundColor: '#1E1E24', borderBottom: '1px solid #141419' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '16px 24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Link href="/" style={{ 
              fontSize: '28px', 
              fontWeight: 'bold', 
              color: '#C9A227', 
              textDecoration: 'none',
              transition: 'all 0.2s'
            }}>
              ΛΟΓΟΣ
            </Link>
            
            <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
              {['Texts', 'Authors', 'Maps', 'Timeline', 'Library'].map((item) => (
                <Link
                  key={item}
                  href={`/${item.toLowerCase()}`}
                  style={{
                    color: hoveredNav === item ? '#C9A227' : '#F5F4F2',
                    textDecoration: 'none',
                    fontSize: '16px',
                    fontWeight: item === 'Maps' ? 'bold' : '500',
                    transition: 'all 0.2s',
                    borderBottom: item === 'Maps' ? '2px solid #C9A227' : 'none',
                    paddingBottom: '4px'
                  }}
                  onMouseEnter={() => setHoveredNav(item)}
                  onMouseLeave={() => setHoveredNav(null)}
                >
                  {item}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h1 style={{ 
            fontSize: '48px', 
            fontWeight: 'bold', 
            marginBottom: '16px',
            background: 'linear-gradient(135deg, #C9A227, #E8D5A3)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Interactive Maps
          </h1>
          <p style={{ fontSize: '20px', color: '#9CA3AF', maxWidth: '600px', margin: '0 auto' }}>
            Explore the classical world through geography, language, politics, and culture
          </p>
        </div>

        {/* Category Filters */}
        <div style={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: '12px', 
          justifyContent: 'center', 
          marginBottom: '48px' 
        }}>
          {categories.map((category) => (
            <button
              key={category.name}
              onClick={() => setSelectedCategory(category.name)}
              style={{
                backgroundColor: selectedCategory === category.name ? category.color : '#1E1E24',
                color: selectedCategory === category.name ? '#0D0D0F' : '#F5F4F2',
                border: `1px solid ${selectedCategory === category.name ? category.color : '#141419'}`,
                borderRadius: '12px',
                padding: '12px 24px',
                fontSize: '16px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <span style={{ fontSize: '18px' }}>{category.icon}</span>
              {category.name}
            </button>
          ))}
        </div>

        {/* Maps Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: '24px',
          marginBottom: '48px'
        }}>
          {filteredMaps.map((map) => (
            <Link
              key={map.id}
              href={map.href}
              style={{ textDecoration: 'none', color: 'inherit' }}
              onMouseEnter={() => setHoveredCard(map.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div style={{
                backgroundColor: hoveredCard === map.id ? '#1E1E24' : '#141419',
                border: `1px solid ${hoveredCard === map.id ? map.color : '#1E1E24'}`,
                borderRadius: '16px',
                padding: '24px',
                transition: 'all 0.3s',
                transform: hoveredCard === map.id ? 'translateY(-4px)' : 'translateY(0)',
                boxShadow: hoveredCard === map.id 
                  ? `0 8px 32px rgba(201, 162, 39, 0.1)` 
                  : '0 4px 16px rgba(0, 0, 0, 0.2)',
                cursor: 'pointer'
              }}>
                {/* Preview Image */}
                <div style={{
                  width: '100%',
                  height: '200px',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  marginBottom: '16px',
                  backgroundColor: '#0D0D0F',
                  border: '1px solid #1E1E24'
                }}>
                  <img
                    src={map.preview}
                    alt={map.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'all 0.3s',
                      transform: hoveredCard === map.id ? 'scale(1.05)' : 'scale(1)'
                    }}
                  />
                </div>

                {/* Content */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                  {/* Category Icon */}
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    backgroundColor: map.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '24px',
                    flexShrink: 0,
                    transition: 'all 0.2s',
                    transform: hoveredCard === map.id ? 'scale(1.1)' : 'scale(1)'
                  }}>
                    {map.icon}
                  </div>

                  <div style={{ flex: 1 }}>
                    <h3 style={{
                      fontSize: '20px',
                      fontWeight: 'bold',
                      marginBottom: '8px',
                      color: hoveredCard === map.id ? '#C9A227' : '#F5F4F2',
                      transition: 'all 0.2s'
                    }}>
                      {map.title}
                    </h3>
                    <p style={{
                      fontSize: '14px',
                      color: '#9CA3AF',
                      lineHeight: '1.5',
                      marginBottom: '12px'
                    }}>
                      {map.desc}
                    </p>
                    <div style={{
                      display: 'inline-block',
                      backgroundColor: map.color,
                      color: '#0D0D0F',
                      fontSize: '12px',
                      fontWeight: '600',
                      padding: '4px 12px',
                      borderRadius: '8px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>
                      {map.category}
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Footer Info */}
        <div style={{
          backgroundColor: '#1E1E24',
          borderRadius: '16px',
          padding: '32px',
          textAlign: 'center',
          border: '1px solid #141419'
        }}>
          <h3 style={{
            fontSize: '24px',
            fontWeight: 'bold',
            marginBottom: '16px',
            color: '#C9A227'
          }}>
            Discover the Classical World
          </h3>
          <p style={{
            fontSize: '16px',
            color: '#9CA3AF',
            lineHeight: '1.6',
            maxWidth: '800px',
            margin: '0 auto'
          }}>
            Our interactive maps bring ancient history to life, showing how Greek and Latin literature, 
            politics, trade, and culture spread across the Mediterranean and beyond. Each map tells 
            the story of human civilization through geographical visualization.
          </p>
        </div>
      </div>
    </div>
  );
}