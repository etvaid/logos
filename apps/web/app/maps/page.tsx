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
      desc: "Coin circulation patterns and monetary systems from archaic electrum to Byzantine solidus",
      icon: "🪙",
      color: "#C9A227",
      category: "Economic",
      lang: "Α",
      features: ["Mint distribution", "Currency flows", "Iconographic analysis"],
      scholars: "Kraay • Howgego • Foldvary"
    }
  ];

  const filteredMaps = selectedCategory === 'All' 
    ? maps 
    : maps.filter(map => map.category === selectedCategory);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0D0D0F 0%, #141419 50%, #0D0D0F 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated Background Pattern */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        opacity: 0.03,
        backgroundImage: `
          radial-gradient(circle at 25% 25%, #C9A227 0%, transparent 50%),
          radial-gradient(circle at 75% 75%, #3B82F6 0%, transparent 50%),
          radial-gradient(circle at 75% 25%, #DC2626 0%, transparent 50%),
          radial-gradient(circle at 25% 75%, #10B981 0%, transparent 50%)
        `,
        animation: 'float 20s ease-in-out infinite'
      }} />

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          25% { transform: translateY(-10px) rotate(1deg); }
          50% { transform: translateY(0px) rotate(0deg); }
          75% { transform: translateY(10px) rotate(-1deg); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.05); opacity: 0.9; }
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>

      <div style={{ position: 'relative', zIndex: 10 }}>
        {/* Hero Header */}
        <div style={{
          textAlign: 'center',
          padding: '4rem 2rem 2rem',
          background: 'linear-gradient(180deg, rgba(201, 162, 39, 0.1) 0%, transparent 100%)'
        }}>
          <div style={{
            display: 'inline-block',
            background: 'linear-gradient(135deg, #C9A227, #F59E0B)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
            fontSize: '4rem',
            fontWeight: 'bold',
            marginBottom: '1rem',
            textShadow: '0 0 30px rgba(201, 162, 39, 0.3)',
            animation: 'shimmer 3s ease-in-out infinite'
          }}>
            CARTOGRAPHIA CLASSICA
          </div>
          <div style={{
            fontSize: '1.5rem',
            color: '#9CA3AF',
            fontStyle: 'italic',
            marginBottom: '2rem'
          }}>
            χωρογραφικὴ σοφία • geographica sapientia
          </div>
          
          {/* 3D Statistics Bar */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '2rem',
            flexWrap: 'wrap',
            marginTop: '2rem'
          }}>
            {[
              { label: 'Interactive Maps', value: '12', icon: '🗺️' },
              { label: 'Data Points', value: '2.4k', icon: '📍' },
              { label: 'Time Periods', value: '6', icon: '⏳' },
              { label: 'Languages', value: '2', icon: '📚' }
            ].map((stat, idx) => (
              <div key={idx} style={{
                background: 'linear-gradient(145deg, #1E1E24, #141419)',
                padding: '1rem 1.5rem',
                borderRadius: '12px',
                border: '1px solid rgba(201, 162, 39, 0.2)',
                textAlign: 'center',
                minWidth: '120px',
                transform: 'perspective(1000px) rotateX(5deg)',
                boxShadow: '0 8px 16px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)'
              }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{stat.icon}</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#C9A227' }}>
                  {stat.value}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#9CA3AF' }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Enhanced Filter Bar */}
        <div style={{
          padding: '0 2rem 2rem',
          display: 'flex',
          justifyContent: 'center'
        }}>
          <div style={{
            display: 'flex',
            gap: '0.5rem',
            flexWrap: 'wrap',
            justifyContent: 'center',
            background: 'rgba(30, 30, 36, 0.8)',
            padding: '1rem',
            borderRadius: '20px',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(201, 162, 39, 0.2)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
          }}>
            {categories.map((cat) => (
              <button
                key={cat.name}
                onClick={() => setSelectedCategory(cat.name)}
                onMouseEnter={() => setHoveredFilter(cat.name)}
                onMouseLeave={() => setHoveredFilter(null)}
                style={{
                  padding: '0.75rem 1.25rem',
                  borderRadius: '12px',
                  border: 'none',
                  background: selectedCategory === cat.name 
                    ? `linear-gradient(135deg, ${cat.color}, ${cat.color}dd)`
                    : hoveredFilter === cat.name
                    ? 'linear-gradient(135deg, #1E1E24, #2A2A32)'
                    : 'transparent',
                  color: selectedCategory === cat.name ? '#000' : '#F5F4F2',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  fontSize: '0.9rem',
                  fontWeight: selectedCategory === cat.name ? 'bold' : 'normal',
                  transform: hoveredFilter === cat.name ? 'translateY(-2px) scale(1.05)' : 'translateY(0)',
                  boxShadow: hoveredFilter === cat.name 
                    ? `0 6px 20px ${cat.color}40` 
                    : selectedCategory === cat.name
                    ? `0 4px 16px ${cat.color}60`
                    : 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <span style={{ fontSize: '1.1rem' }}>{cat.icon}</span>
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Enhanced Cards Grid */}
        <div style={{
          padding: '0 2rem 4rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: '2rem',
          maxWidth: '1400px',
          margin: '0 auto'
        }}>
          {filteredMaps.map((map) => (
            <Link key={map.id} href={map.href} style={{ textDecoration: 'none' }}>
              <div
                onMouseEnter={() => setHoveredCard(map.id)}
                onMouseLeave={() => setHoveredCard(null)}
                style={{
                  background: hoveredCard === map.id 
                    ? 'linear-gradient(145deg, #1E1E24, #141419)'
                    : 'linear-gradient(145deg, #1A1A20, #141419)',
                  borderRadius: '20px',
                  padding: '1.5rem',
                  border: `1px solid ${hoveredCard === map.id ? map.color : 'rgba(107, 114, 128, 0.2)'}`,
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  transform: hoveredCard === map.id 
                    ? 'translateY(-8px) perspective(1000px) rotateX(5deg) scale(1.02)' 
                    : 'translateY(0) perspective(1000px) rotateX(0deg) scale(1)',
                  boxShadow: hoveredCard === map.id 
                    ? `0 20px 40px rgba(0,0,0,0.4), 0 0 0 1px ${map.color}40, inset 0 1px 0 rgba(255,255,255,0.1)`
                    : '0 4px 16px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.05)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                {/* Animated Background Glow */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: `radial-gradient(circle at top right, ${map.color}15, transparent 70%)`,
                  opacity: hoveredCard === map.id ? 1 : 0,
                  transition: 'opacity 0.3s ease'
                }} />

                {/* Card Content */}
                <div style={{ position: 'relative', zIndex: 5 }}>
                  {/* Header */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{
                        fontSize: '2rem',
                        filter: `drop-shadow(0 0 10px ${map.color}80)`,
                        transform: hoveredCard === map.id ? 'scale(1.2) rotate(5deg)' : 'scale(1)',
                        transition: 'transform 0.3s ease'
                      }}>
                        {map.icon}
                      </div>
                      <div>
                        <h3 style={{
                          color: '#F5F4F2',
                          fontSize: '1.4rem',
                          fontWeight: 'bold',
                          margin: '0 0 0.25rem 0',
                          background: hoveredCard === map.id ? `linear-gradient(135deg, ${map.color}, #F5F4F2)` : undefined,
                          backgroundClip: hoveredCard === map.id ? 'text' : undefined,
                          WebkitBackgroundClip: hoveredCard === map.id ? 'text' : undefined,
                          color: hoveredCard === map.id ? 'transparent' : '#F5F4F2',
                          transition: 'all 0.3s ease'
                        }}>
                          {map.title}
                        </h3>
                        <p style={{
                          color: '#9CA3AF',
                          fontSize: '0.9rem',
                          fontStyle: 'italic',
                          margin: 0
                        }}>
                          {map.subtitle}
                        </p>
                      </div>
                    </div>
                    
                    {/* Language Indicator */}
                    <div style={{
                      background: map.lang === 'Α' ? '#3B82F6' : '#DC2626',
                      color: 'white',
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1rem',
                      fontWeight: 'bold',
                      boxShadow: `0 4px 12px ${map.lang === 'Α' ? '#3B82F6' : '#DC2626'}40`,
                      transform: hoveredCard === map.id ? 'scale(1.1)' : 'scale(1)',
                      transition: 'transform 0.3s ease'
                    }}>
                      {map.lang}
                    </div>
                  </div>

                  {/* Description */}
                  <p style={{
                    color: '#9CA3AF',
                    fontSize: '0.95rem',
                    lineHeight: '1.6',
                    marginBottom: '1.5rem',
                    opacity: hoveredCard === map.id ? 1 : 0.8,
                    transition: 'opacity 0.3s ease'
                  }}>
                    {map.desc}
                  </p>

                  {/* Features Pills */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
                    {map.features.map((feature, idx) => (
                      <span key={idx} style={{
                        background: `${map.color}20`,
                        color: map.color,
                        padding: '0.25rem 0.75rem',
                        borderRadius: '20px',
                        fontSize: '0.8rem',
                        border: `1px solid ${map.color}40`,
                        transform: hoveredCard === map.id ? 'translateY(-1px)' : 'translateY(0)',
                        transition: 'transform 0.3s ease'
                      }}>
                        {feature}
                      </span>
                    ))}
                  </div>

                  {/* Scholars Footer */}
                  <div style={{
                    borderTop: '1px solid rgba(107, 114, 128, 0.2)',
                    paddingTop: '1rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <span style={{
                      color: '#6B7280',
                      fontSize: '0.85rem',
                      fontStyle: 'italic'
                    }}>
                      {map.scholars}
                    </span>
                    <div style={{
                      color: map.color,
                      fontSize: '1.2rem',
                      transform: hoveredCard === map.id ? 'translateX(4px)' : 'translateX(0)',
                      transition: 'transform 0.3s ease'
                    }}>
                      →
                    </div>
                  </div>
                </div>

                {/* Hover Shimmer Effect */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: '-100%',
                  width: '100%',
                  height: '100%',
                  background: `linear-gradient(90deg, transparent, ${map.color}20, transparent)`,
                  transform: hoveredCard === map.id ? 'translateX(200%)' : 'translateX(-100%)',
                  transition: 'transform 0.6s ease',
                  pointerEvents: 'none'
                }} />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}