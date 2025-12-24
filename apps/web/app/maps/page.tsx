'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function MapsHub() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [hoveredFilter, setHoveredFilter] = useState<string | null>(null);

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
      title: "Dialectal Distribution",
      subtitle: "διαλεκτικὴ γεωγραφία",
      desc: "Spatial analysis of Greek dialects (Ionic, Aeolic, Doric) and Latin regional variants across the Mediterranean basin",
      icon: "🗣️",
      color: "#3B82F6",
      category: "Linguistic",
      lang: "Α",
      features: ["Isogloss mapping", "Phonetic evolution", "Substrate influence"],
      scholars: "Thumb • Buck • Hoffmann"
    },
    {
      id: 2,
      href: "/maps/political",
      title: "Imperial Chronotopes",
      subtitle: "imperium sine fine",
      desc: "Diachronic visualization of political control from Archaic poleis to Byzantine themes",
      icon: "👑",
      color: "#DC2626",
      category: "Political",
      lang: "L",
      features: ["Administrative units", "Frontier dynamics", "Urban hierarchies"],
      scholars: "Millar • Hopkins • Ward-Perkins"
    },
    {
      id: 3,
      href: "/maps/authors",
      title: "Literary Geography",
      subtitle: "τόποι καὶ ποιηταί",
      desc: "Prosopographical mapping of classical authors with biographical and intertextual networks",
      icon: "✍️",
      color: "#10B981",
      category: "Literary",
      lang: "Α",
      features: ["Author mobility", "Literary centers", "Manuscript transmission"],
      scholars: "Pfeiffer • Reynolds • Wilson"
    },
    {
      id: 4,
      href: "/maps/trade",
      title: "Commercial Networks",
      subtitle: "negotiatores et mercatores",
      desc: "Economic flows and trade route analysis with amphora distribution patterns",
      icon: "🚢",
      color: "#F59E0B",
      category: "Economic",
      lang: "L",
      features: ["Commodity flows", "Port hierarchies", "Currency zones"],
      scholars: "Hopkins • Fink • Bang"
    },
    {
      id: 5,
      href: "/maps/education",
      title: "Scholastic Centers",
      subtitle: "παιδεία καὶ eruditio",
      desc: "Educational institutions from gymnasium to university, tracking intellectual traditions",
      icon: "📚",
      color: "#8B5CF6",
      category: "Educational",
      lang: "Α",
      features: ["School networks", "Curriculum diffusion", "Teacher mobility"],
      scholars: "Clarke • Bonner • Marrou"
    },
    {
      id: 6,
      href: "/maps/chronology",
      title: "Temporal Stratification",
      subtitle: "tempus et chronos",
      desc: "Multi-layered chronological visualization of cultural and political transformations",
      icon: "⏱️",
      color: "#EC4899",
      category: "Temporal",
      lang: "L",
      features: ["Period boundaries", "Cultural phases", "Synchronic analysis"],
      scholars: "Momigliano • Koselleck • Hartog"
    },
    {
      id: 7,
      href: "/maps/religion",
      title: "Sacred Landscapes",
      subtitle: "θεοὶ καὶ numina",
      desc: "Religious geography mapping sanctuaries, cult distribution, and pilgrimage routes",
      icon: "⚡",
      color: "#A855F7",
      category: "Cultural",
      lang: "Α",
      features: ["Sanctuary networks", "Cult diffusion", "Ritual calendars"],
      scholars: "Burkert • Scheid • Price"
    },
    {
      id: 8,
      href: "/maps/military",
      title: "Strategic Geography",
      subtitle: "στρατηγία καὶ tacticus",
      desc: "Military campaigns, fortification systems, and strategic chokepoints across classical antiquity",
      icon: "⚔️",
      color: "#EF4444",
      category: "Military",
      lang: "Α",
      features: ["Campaign routes", "Fortification types", "Battle analysis"],
      scholars: "Goldsworthy • Sabin • Campbell"
    },
    {
      id: 9,
      href: "/maps/manuscripts",
      title: "Codicological Atlas",
      subtitle: "codices et paleographia",
      desc: "Manuscript transmission networks and scribal centers from papyrus to codex",
      icon: "📜",
      color: "#14B8A6",
      category: "Literary",
      lang: "L",
      features: ["Scriptoria mapping", "Textual families", "Paleographic zones"],
      scholars: "Reynolds • Wilson • Cavallo"
    },
    {
      id: 10,
      href: "/maps/philosophy",
      title: "Philosophical Schools",
      subtitle: "αἱρέσεις φιλοσοφικαί",
      desc: "Intellectual networks and philosophical transmission from pre-Socratics to Neoplatonists",
      icon: "🎭",
      color: "#F97316",
      category: "Cultural",
      lang: "Α",
      features: ["School genealogies", "Doctrinal diffusion", "Philosophical centers"],
      scholars: "Diels • Long • Hadot"
    },
    {
      id: 11,
      href: "/maps/epigraphy",
      title: "Epigraphic Distribution",
      subtitle: "inscriptiones et tituli",
      desc: "Stone-carved evidence patterns revealing administrative, religious, and social structures",
      icon: "🗿",
      color: "#6366F1",
      category: "Political",
      lang: "L",
      features: ["Inscription density", "Formula distribution", "Material analysis"],
      scholars: "Mommsen • Robert • Bodel"
    },
    {
      id: 12,
      href: "/maps/numismatics",
      title: "Monetary Geography",
      subtitle: "νομίσματα καὶ monetae",
      desc: "Coin circulation patterns and monetary systems across Greek poleis and Roman provinces",
      icon: "🪙",
      color: "#84CC16",
      category: "Economic",
      lang: "Α",
      features: ["Mint distribution", "Currency zones", "Economic integration"],
      scholars: "Crawford • Howgego • Foldvary"
    }
  ];

  const filteredMaps = selectedCategory === 'All' 
    ? maps 
    : maps.filter(map => map.category === selectedCategory);

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#0D0D0F',
      color: '#F5F4F2'
    }}>
      {/* Header */}
      <div style={{ 
        backgroundColor: '#141419', 
        borderBottom: '1px solid #1E1E24',
        padding: '2rem 0'
      }}>
        <div style={{ 
          maxWidth: '1200px', 
          margin: '0 auto', 
          padding: '0 1.5rem'
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '1rem',
            marginBottom: '1rem'
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              backgroundColor: '#C9A227',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px'
            }}>
              🗺️
            </div>
            <div>
              <h1 style={{ 
                fontSize: '2.5rem', 
                fontWeight: 'bold', 
                margin: 0,
                background: 'linear-gradient(135deg, #C9A227, #F59E0B)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                Cartographic Atlas
              </h1>
              <p style={{ 
                color: '#9CA3AF', 
                margin: 0, 
                fontSize: '1.1rem'
              }}>
                χωρογραφία τῆς ἀρχαιότητος • spatium antiquitatis
              </p>
            </div>
          </div>
          <p style={{ 
            color: '#9CA3AF', 
            lineHeight: '1.6',
            fontSize: '1.1rem',
            maxWidth: '800px'
          }}>
            Digital cartography for classical antiquity, integrating spatial analysis with philological precision. 
            Navigate through dialectological landscapes, political chronotopes, and cultural networks of the ancient Mediterranean.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div style={{ 
        backgroundColor: '#1E1E24',
        borderBottom: '1px solid #141419',
        padding: '1.5rem 0',
        position: 'sticky',
        top: 0,
        zIndex: 10
      }}>
        <div style={{ 
          maxWidth: '1200px', 
          margin: '0 auto', 
          padding: '0 1.5rem'
        }}>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.75rem',
            alignItems: 'center'
          }}>
            <span style={{
              color: '#9CA3AF',
              fontSize: '0.9rem',
              fontWeight: '500',
              marginRight: '0.5rem'
            }}>
              Filter by domain:
            </span>
            {categories.map(category => (
              <button
                key={category.name}
                onClick={() => setSelectedCategory(category.name)}
                onMouseEnter={() => setHoveredFilter(category.name)}
                onMouseLeave={() => setHoveredFilter(null)}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '20px',
                  border: 'none',
                  backgroundColor: selectedCategory === category.name 
                    ? category.color 
                    : hoveredFilter === category.name 
                      ? '#141419' 
                      : 'transparent',
                  color: selectedCategory === category.name 
                    ? '#0D0D0F' 
                    : '#F5F4F2',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  fontSize: '0.9rem',
                  fontWeight: '500',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  border: `1px solid ${selectedCategory === category.name ? category.color : '#1E1E24'}`,
                  transform: hoveredFilter === category.name ? 'translateY(-1px)' : 'none'
                }}
              >
                <span>{category.icon}</span>
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Maps Grid */}
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        padding: '3rem 1.5rem'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))',
          gap: '2rem'
        }}>
          {filteredMaps.map(map => (
            <Link
              key={map.id}
              href={map.href}
              onMouseEnter={() => setHoveredCard(map.id)}
              onMouseLeave={() => setHoveredCard(null)}
              style={{
                textDecoration: 'none',
                color: 'inherit'
              }}
            >
              <div style={{
                backgroundColor: '#1E1E24',
                borderRadius: '16px',
                padding: '1.5rem',
                border: `1px solid ${hoveredCard === map.id ? map.color : '#141419'}`,
                transition: 'all 0.3s ease',
                transform: hoveredCard === map.id ? 'translateY(-4px)' : 'translateY(0)',
                boxShadow: hoveredCard === map.id 
                  ? `0 8px 32px ${map.color}20` 
                  : '0 2px 8px rgba(0,0,0,0.3)',
                cursor: 'pointer',
                height: '100%',
                display: 'flex',
                flexDirection: 'column'
              }}>
                {/* Header */}
                <div style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  marginBottom: '1rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      backgroundColor: `${map.color}20`,
                      borderRadius: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '20px',
                      border: `1px solid ${map.color}30`
                    }}>
                      {map.icon}
                    </div>
                    <div>
                      <h3 style={{
                        margin: 0,
                        fontSize: '1.25rem',
                        fontWeight: 'bold',
                        color: '#F5F4F2'
                      }}>
                        {map.title}
                      </h3>
                      <p style={{
                        margin: 0,
                        fontSize: '0.9rem',
                        color: '#9CA3AF',
                        fontStyle: 'italic'
                      }}>
                        {map.subtitle}
                      </p>
                    </div>
                  </div>
                  <div style={{
                    display: 'flex',
                    gap: '0.5rem',
                    alignItems: 'center'
                  }}>
                    <div style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      backgroundColor: map.lang === 'Α' ? '#3B82F6' : '#DC2626',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      color: '#F5F4F2'
                    }}>
                      {map.lang}
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p style={{
                  color: '#9CA3AF',
                  lineHeight: '1.6',
                  marginBottom: '1.5rem',
                  fontSize: '0.95rem',
                  flex: '1'
                }}>
                  {map.desc}
                </p>

                {/* Features */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <h4 style={{
                    color: '#F5F4F2',
                    fontSize: '0.8rem',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    margin: '0 0 0.75rem 0'
                  }}>
                    Analytical Features
                  </h4>
                  <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '0.5rem'
                  }}>
                    {map.features.map(feature => (
                      <span
                        key={feature}
                        style={{
                          padding: '0.25rem 0.75rem',
                          backgroundColor: `${map.color}15`,
                          border: `1px solid ${map.color}30`,
                          borderRadius: '12px',
                          fontSize: '0.8rem',
                          color: map.color,
                          fontWeight: '500'
                        }}
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Scholars */}
                <div style={{
                  borderTop: '1px solid #141419',
                  paddingTop: '1rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <p style={{
                      margin: 0,
                      fontSize: '0.8rem',
                      color: '#6B7280',
                      fontWeight: '500'
                    }}>
                      Key scholars: {map.scholars}
                    </p>
                  </div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    color: map.color,
                    fontSize: '0.9rem',
                    fontWeight: '500',
                    opacity: hoveredCard === map.id ? 1 : 0.7,
                    transition: 'opacity 0.2s ease'
                  }}>
                    <span>Explore</span>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      style={{
                        transform: hoveredCard === map.id ? 'translateX(4px)' : 'translateX(0)',
                        transition: 'transform 0.2s ease'
                      }}
                    >
                      <path
                        d="M6 3l5 5-5 5"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Stats Footer */}
        <div style={{
          marginTop: '4rem',
          padding: '2rem',
          backgroundColor: '#141419',
          borderRadius: '16px',
          border: '1px solid #1E1E24'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '2rem',
            textAlign: 'center'
          }}>
            <div>
              <div style={{
                fontSize: '2.5rem',
                fontWeight: 'bold',
                color: '#C9A227',
                marginBottom: '0.5rem'
              }}>
                {filteredMaps.length}
              </div>
              <div style={{ color: '#9CA3AF', fontSize: '0.9rem' }}>
                Cartographic Modules
              </div>
            </div>
            <div>
              <div style={{
                fontSize: '2.5rem',
                fontWeight: 'bold',
                color: '#3B82F6',
                marginBottom: '0.5rem'
              }}>
                2.1K
              </div>
              <div style={{ color: '#9CA3AF', fontSize: '0.9rem' }}>
                Geotagged Locations
              </div>
            </div>
            <div>
              <div style={{
                fontSize: '2.5rem',
                fontWeight: 'bold',
                color: '#10B981',
                marginBottom: '0.5rem'
              }}>
                847
              </div>
              <div style={{ color: '#9CA3AF', fontSize: '0.9rem' }}>
                Scholarly Citations
              </div>
            </div>
            <div>
              <div style={{
                fontSize: '2.5rem',
                fontWeight: 'bold',
                color: '#F59E0B',
                marginBottom: '0.5rem'
              }}>
                1.2M
              </div>
              <div style={{ color: '#9CA3AF', fontSize: '0.9rem' }}>
                Data Points Analyzed
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}