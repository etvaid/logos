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
      desc: "Sacred places and legendary locations from ancient stories",
      icon: "⚡", 
      color: "#A855F7",
      category: "Cultural",
      preview: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='200' viewBox='0 0 300 200'%3E%3Crect width='300' height='200' fill='%23141419'/%3E%3Cpolygon points='150,40 160,70 190,70 170,90 180,120 150,100 120,120 130,90 110,70 140,70' fill='%23A855F7' opacity='0.8'/%3E%3Ccircle cx='80' cy='120' r='8' fill='%23C9A227' opacity='0.6'/%3E%3Ccircle cx='220' cy='110' r='6' fill='%23C9A227' opacity='0.6'/%3E%3Ctext x='150' y='160' fill='%23F5F4F2' text-anchor='middle' font-size='12'%3EMythical Places%3C/text%3E%3C/svg%3E"
    },
    { 
      id: 8,
      href: "/maps/military", 
      title: "Military Campaigns", 
      desc: "Famous battles and conquests that shaped the ancient world",
      icon: "⚔️", 
      color: "#EF4444",
      category: "Military",
      preview: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='200' viewBox='0 0 300 200'%3E%3Crect width='300' height='200' fill='%23141419'/%3E%3Cpath d='M50 150 L100 100 L150 120 L200 80 L250 90' stroke='%23EF4444' stroke-width='4' fill='none' opacity='0.8' marker-end='url(%23arrowhead)'/%3E%3Ccircle cx='100' cy='100' r='6' fill='%23EF4444'/%3E%3Ccircle cx='200' cy='80' r='6' fill='%23EF4444'/%3E%3Ctext x='150' y='170' fill='%23F5F4F2' text-anchor='middle' font-size='12'%3EBattle Routes%3C/text%3E%3C/svg%3E"
    },
    { 
      id: 9,
      href: "/maps/religions", 
      title: "Religious Centers", 
      desc: "Temples, oracles, and sacred sites of ancient faiths",
      icon: "🏛️", 
      color: "#10B981",
      category: "Cultural",
      preview: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='200' viewBox='0 0 300 200'%3E%3Crect width='300' height='200' fill='%23141419'/%3E%3Crect x='120' y='80' width='60' height='40' fill='%2310B981' opacity='0.7'/%3E%3Crect x='130' y='70' width='8' height='50' fill='%2310B981'/%3E%3Crect x='142' y='70' width='8' height='50' fill='%2310B981'/%3E%3Crect x='154' y='70' width='8' height='50' fill='%2310B981'/%3E%3Crect x='166' y='70' width='8' height='50' fill='%2310B981'/%3E%3Ctriangle points='120,70 180,70 150,50' fill='%2310B981' opacity='0.8'/%3E%3Ctext x='150' y='140' fill='%23F5F4F2' text-anchor='middle' font-size='12'%3ESacred Sites%3C/text%3E%3C/svg%3E"
    }
  ];

  const filteredMaps = selectedCategory === 'All' 
    ? maps 
    : maps.filter(map => map.category === selectedCategory);

  const navItems = [
    { label: 'Library', href: '/library' },
    { label: 'Timeline', href: '/timeline' },
    { label: 'Maps', href: '/maps' },
    { label: 'Search', href: '/search' },
    { label: 'Compare', href: '/compare' }
  ];

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#0D0D0F', 
      color: '#F5F4F2',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      {/* Navigation */}
      <nav style={{ 
        backgroundColor: '#1E1E24', 
        padding: '16px 32px',
        borderBottom: '1px solid #141419'
      }}>
        <div style={{ 
          maxWidth: '1400px', 
          margin: '0 auto', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between' 
        }}>
          <Link href="/" style={{ 
            fontSize: '24px', 
            fontWeight: 'bold', 
            color: '#C9A227', 
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <span style={{ fontSize: '28px' }}>📚</span>
            LOGOS
          </Link>
          
          <div style={{ display: 'flex', gap: '32px' }}>
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onMouseEnter={() => setHoveredNav(item.label)}
                onMouseLeave={() => setHoveredNav(null)}
                style={{
                  color: hoveredNav === item.label ? '#C9A227' : '#F5F4F2',
                  textDecoration: 'none',
                  fontSize: '16px',
                  fontWeight: '500',
                  transition: 'all 0.2s',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  backgroundColor: hoveredNav === item.label ? '#141419' : 'transparent'
                }}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '48px 32px' }}>
        {/* Header */}
        <div style={{ marginBottom: '48px', textAlign: 'center' }}>
          <h1 style={{ 
            fontSize: '48px', 
            fontWeight: 'bold', 
            marginBottom: '16px',
            background: 'linear-gradient(135deg, #C9A227, #E8D5A3)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            🗺️ Interactive Maps
          </h1>
          <p style={{ 
            fontSize: '20px', 
            color: '#9CA3AF', 
            maxWidth: '800px', 
            margin: '0 auto',
            lineHeight: '1.6'
          }}>
            Explore the ancient world through interactive visualizations of languages, 
            politics, culture, and more across 2000+ years of classical history.
          </p>
        </div>

        {/* Category Filters */}
        <div style={{ 
          marginBottom: '48px',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '12px',
          justifyContent: 'center'
        }}>
          {categories.map((category) => (
            <button
              key={category.name}
              onClick={() => setSelectedCategory(category.name)}
              style={{
                backgroundColor: selectedCategory === category.name ? category.color : '#1E1E24',
                color: selectedCategory === category.name ? '#0D0D0F' : '#F5F4F2',
                border: `2px solid ${selectedCategory === category.name ? category.color : '#141419'}`,
                padding: '12px 20px',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transform: selectedCategory === category.name ? 'scale(1.05)' : 'scale(1)'
              }}
              onMouseEnter={(e) => {
                if (selectedCategory !== category.name) {
                  e.currentTarget.style.borderColor = category.color;
                  e.currentTarget.style.backgroundColor = '#141419';
                }
              }}
              onMouseLeave={(e) => {
                if (selectedCategory !== category.name) {
                  e.currentTarget.style.borderColor = '#141419';
                  e.currentTarget.style.backgroundColor = '#1E1E24';
                }
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
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', 
          gap: '24px' 
        }}>
          {filteredMaps.map((map) => (
            <Link 
              key={map.id} 
              href={map.href}
              style={{ textDecoration: 'none' }}
            >
              <div
                onMouseEnter={() => setHoveredCard(map.id)}
                onMouseLeave={() => setHoveredCard(null)}
                style={{
                  backgroundColor: '#1E1E24',
                  border: `2px solid ${hoveredCard === map.id ? map.color : '#141419'}`,
                  borderRadius: '16px',
                  overflow: 'hidden',
                  transition: 'all 0.3s',
                  transform: hoveredCard === map.id ? 'translateY(-8px)' : 'translateY(0)',
                  boxShadow: hoveredCard === map.id 
                    ? `0 20px 40px rgba(0,0,0,0.4), 0 0 0 1px ${map.color}40` 
                    : '0 4px 20px rgba(0,0,0,0.2)',
                  cursor: 'pointer',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                {/* Preview Image */}
                <div style={{ 
                  height: '200px', 
                  backgroundColor: '#141419',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  <img 
                    src={map.preview}
                    alt={`${map.title} preview`}
                    style={{ 
                      width: '100%', 
                      height: '100%', 
                      objectFit: 'cover',
                      transition: 'transform 0.3s',
                      transform: hoveredCard === map.id ? 'scale(1.05)' : 'scale(1)'
                    }}
                  />
                  {/* Overlay gradient */}
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: `linear-gradient(135deg, ${map.color}20, transparent)`,
                    opacity: hoveredCard === map.id ? 1 : 0,
                    transition: 'opacity 0.3s'
                  }} />
                </div>

                {/* Content */}
                <div style={{ 
                  padding: '24px',
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column'
                }}>
                  {/* Header */}
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '12px', 
                    marginBottom: '16px' 
                  }}>
                    <span style={{ 
                      fontSize: '24px',
                      padding: '8px',
                      backgroundColor: `${map.color}20`,
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {map.icon}
                    </span>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ 
                        fontSize: '20px', 
                        fontWeight: 'bold', 
                        margin: 0,
                        color: hoveredCard === map.id ? map.color : '#F5F4F2',
                        transition: 'color 0.3s'
                      }}>
                        {map.title}
                      </h3>
                      <div style={{
                        fontSize: '14px',
                        color: map.color,
                        fontWeight: '600',
                        marginTop: '4px'
                      }}>
                        {map.category}
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <p style={{ 
                    fontSize: '16px', 
                    color: '#9CA3AF', 
                    margin: 0,
                    lineHeight: '1.5',
                    flex: 1
                  }}>
                    {map.desc}
                  </p>

                  {/* Action */}
                  <div style={{
                    marginTop: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    color: map.color,
                    fontSize: '14px',
                    fontWeight: '600'
                  }}>
                    Explore Map
                    <span style={{
                      transition: 'transform 0.3s',
                      transform: hoveredCard === map.id ? 'translateX(4px)' : 'translateX(0)'
                    }}>
                      →
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Stats Section */}
        <div style={{ 
          marginTop: '80px',
          backgroundColor: '#1E1E24',
          borderRadius: '16px',
          padding: '48px',
          border: '1px solid #141419'
        }}>
          <h2 style={{ 
            fontSize: '32px', 
            fontWeight: 'bold', 
            textAlign: 'center', 
            marginBottom: '32px',
            color: '#C9A227'
          }}>
            Map Collection Overview
          </h2>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '24px' 
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                fontSize: '36px', 
                fontWeight: 'bold', 
                color: '#3B82F6',
                marginBottom: '8px'
              }}>
                2300+
              </div>
              <div style={{ color: '#9CA3AF', fontSize: '16px' }}>Years Covered</div>
            </div>
            
            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                fontSize: '36px', 
                fontWeight: 'bold', 
                color: '#DC2626',
                marginBottom: '8px'
              }}>
                50+
              </div>
              <div style={{ color: '#9CA3AF', fontSize: '16px' }}>Ancient Cities</div>
            </div>
            
            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                fontSize: '36px', 
                fontWeight: 'bold', 
                color: '#10B981',
                marginBottom: '8px'
              }}>
                12
              </div>
              <div style={{ color: '#9CA3AF', fontSize: '16px' }}>Empires Tracked</div>
            </div>
            
            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                fontSize: '36px', 
                fontWeight: 'bold', 
                color: '#C9A227',
                marginBottom: '8px'
              }}>
                {filteredMaps.length}
              </div>
              <div style={{ color: '#9CA3AF', fontSize: '16px' }}>
                {selectedCategory === 'All' ? 'Total Maps' : `${selectedCategory} Maps`}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}