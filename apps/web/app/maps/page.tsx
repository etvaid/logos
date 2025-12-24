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
      desc: "Coin circulation patterns providing insights into economic integration and monetary policies",
      icon: "💰",
      color: "#EAB308",
      category: "Economic",
      lang: "Α",
      features: ["Mint locations", "Coin distribution", "Hoard analysis"],
      scholars: "Crawford • Burnett • Howgego"
    }
  ];

  const filteredMaps = selectedCategory === 'All' ? maps : maps.filter(map => map.category === selectedCategory);

  return (
    <div style={{ backgroundColor: '#0D0D0F', color: '#F5F4F2', minHeight: '100vh', padding: '20px', fontFamily: 'sans-serif', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '20px', color: '#C9A227', textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)' }}>
        Logos Maps Hub
      </h1>

      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '20px' }}>
        {categories.map((category) => (
          <button
            key={category.name}
            style={{
              backgroundColor: selectedCategory === category.name ? category.color : '#1E1E24',
              color: '#F5F4F2',
              border: 'none',
              padding: '10px 15px',
              margin: '5px',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              transition: 'background-color 0.3s, color 0.3s, transform 0.2s',
              transform: hoveredFilter === category.name ? 'scale(1.05)' : 'scale(1)',
              boxShadow: selectedCategory === category.name ? '0 0 5px rgba(201, 162, 39, 0.7)' : 'none'
            }}
            onMouseEnter={() => setHoveredFilter(category.name)}
            onMouseLeave={() => setHoveredFilter(null)}
            onClick={() => setSelectedCategory(category.name)}
          >
            {category.icon} {category.name}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', width: '100%', maxWidth: '1200px' }}>
        {filteredMaps.map((map) => (
          <Link key={map.id} href={map.href} style={{ textDecoration: 'none' }}>
            <div
              style={{
                backgroundColor: '#1E1E24',
                color: '#F5F4F2',
                padding: '20px',
                borderRadius: '10px',
                transition: 'transform 0.2s, box-shadow 0.2s',
                transform: hoveredCard === map.id ? 'scale(1.05)' : 'scale(1)',
                boxShadow: hoveredCard === map.id ? '0 0 15px rgba(201, 162, 39, 0.5)' : '0 0 5px rgba(0, 0, 0, 0.3)',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
              }}
              onMouseEnter={() => setHoveredCard(map.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{ fontSize: '1.5rem', marginRight: '10px', color: map.color }}>{map.icon}</span>
                <div>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '5px' }}>{map.title}</h2>
                  <h3 style={{ fontSize: '1rem', color: '#9CA3AF' }}>{map.subtitle}</h3>
                </div>
                <span style={{ fontSize: '0.8rem', marginLeft: 'auto', color: map.color, fontWeight: 'bold' }}>{map.lang}</span>
              </div>
              <p style={{ fontSize: '1rem', color: '#9CA3AF', lineHeight: '1.4', marginBottom: '10px', flexGrow: 1 }}>{map.desc}</p>
              <div style={{ fontSize: '0.9rem', color: '#6B7280' }}>
                <strong style={{ color: '#F5F4F2' }}>Features:</strong>
                <ul style={{ listStyleType: 'none', padding: 0, margin: '5px 0' }}>
                  {map.features.map((feature, index) => (
                    <li key={index} style={{ marginBottom: '3px' }}>
                      • {feature}
                    </li>
                  ))}
                </ul>
                <strong style={{ color: '#F5F4F2' }}>Scholars:</strong> {map.scholars}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}