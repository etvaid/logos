'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function AuthorsMap() {
  const [hoveredAuthor, setHoveredAuthor] = useState(null);

  const authors = [
    // Archaic Era (800-500 BCE)
    { name: 'Homer', birth: 'Ionia', coords: [370, 280], era: 'Archaic', dates: 'c. 800-750 BCE', works: ['Iliad', 'Odyssey'], language: 'Greek', color: '#D97706' },
    { name: 'Hesiod', birth: 'Ascra', coords: [320, 270], era: 'Archaic', dates: 'c. 750-650 BCE', works: ['Theogony', 'Works and Days'], language: 'Greek', color: '#D97706' },
    { name: 'Sappho', birth: 'Mytilene', coords: [340, 260], era: 'Archaic', dates: 'c. 630-570 BCE', works: ['Lyric Poetry'], language: 'Greek', color: '#D97706' },
    { name: 'Solon', birth: 'Athens', coords: [330, 280], era: 'Archaic', dates: 'c. 630-560 BCE', works: ['Political Elegies'], language: 'Greek', color: '#D97706' },

    // Classical Era (500-323 BCE)
    { name: 'Aeschylus', birth: 'Eleusis', coords: [330, 285], era: 'Classical', dates: '525-456 BCE', works: ['Oresteia', 'Seven Against Thebes'], language: 'Greek', color: '#F59E0B' },
    { name: 'Sophocles', birth: 'Colonus', coords: [328, 282], era: 'Classical', dates: 'c. 496-406 BCE', works: ['Oedipus Rex', 'Antigone'], language: 'Greek', color: '#F59E0B' },
    { name: 'Euripides', birth: 'Salamis', coords: [325, 280], era: 'Classical', dates: 'c. 480-406 BCE', works: ['Medea', 'The Bacchae'], language: 'Greek', color: '#F59E0B' },
    { name: 'Herodotus', birth: 'Halicarnassus', coords: [380, 300], era: 'Classical', dates: 'c. 484-425 BCE', works: ['Histories'], language: 'Greek', color: '#F59E0B' },
    { name: 'Thucydides', birth: 'Athens', coords: [330, 280], era: 'Classical', dates: 'c. 460-400 BCE', works: ['History of the Peloponnesian War'], language: 'Greek', color: '#F59E0B' },
    { name: 'Aristophanes', birth: 'Athens', coords: [332, 282], era: 'Classical', dates: 'c. 446-386 BCE', works: ['The Clouds', 'The Birds'], language: 'Greek', color: '#F59E0B' },
    { name: 'Plato', birth: 'Athens', coords: [328, 278], era: 'Classical', dates: 'c. 428-348 BCE', works: ['Republic', 'Phaedrus'], language: 'Greek', color: '#F59E0B' },
    { name: 'Aristotle', birth: 'Stagira', coords: [340, 240], era: 'Classical', dates: '384-322 BCE', works: ['Poetics', 'Metaphysics'], language: 'Greek', color: '#F59E0B' },

    // Hellenistic Era (323-31 BCE)
    { name: 'Callimachus', birth: 'Cyrene', coords: [280, 360], era: 'Hellenistic', dates: 'c. 310-240 BCE', works: ['Aetia', 'Hymns'], language: 'Greek', color: '#3B82F6' },
    { name: 'Apollonius', birth: 'Alexandria', coords: [290, 340], era: 'Hellenistic', dates: 'c. 295-215 BCE', works: ['Argonautica'], language: 'Greek', color: '#3B82F6' },
    { name: 'Theocritus', birth: 'Syracuse', coords: [240, 320], era: 'Hellenistic', dates: 'c. 300-260 BCE', works: ['Idylls'], language: 'Greek', color: '#3B82F6' },

    // Imperial Era (31 BCE-284 CE)
    { name: 'Virgil', birth: 'Mantua', coords: [200, 220], era: 'Imperial', dates: '70-19 BCE', works: ['Aeneid', 'Georgics'], language: 'Latin', color: '#DC2626' },
    { name: 'Ovid', birth: 'Sulmo', coords: [240, 250], era: 'Imperial', dates: '43 BCE-17 CE', works: ['Metamorphoses', 'Ars Amatoria'], language: 'Latin', color: '#DC2626' },
    { name: 'Horace', birth: 'Venusia', coords: [260, 280], era: 'Imperial', dates: '65-8 BCE', works: ['Odes', 'Satires'], language: 'Latin', color: '#DC2626' },
    { name: 'Tacitus', birth: 'Gaul', coords: [150, 180], era: 'Imperial', dates: 'c. 56-120 CE', works: ['Annals', 'Germania'], language: 'Latin', color: '#DC2626' },
    { name: 'Plutarch', birth: 'Chaeronea', coords: [320, 270], era: 'Imperial', dates: 'c. 46-120 CE', works: ['Parallel Lives', 'Moralia'], language: 'Greek', color: '#DC2626' },
    { name: 'Juvenal', birth: 'Aquinum', coords: [230, 260], era: 'Imperial', dates: 'c. 55-127 CE', works: ['Satires'], language: 'Latin', color: '#DC2626' },

    // Late Antique Era (284-600 CE)
    { name: 'Augustine', birth: 'Thagaste', coords: [180, 380], era: 'Late Antique', dates: '354-430 CE', works: ['Confessions', 'City of God'], language: 'Latin', color: '#7C3AED' },
    { name: 'Jerome', birth: 'Stridon', coords: [250, 220], era: 'Late Antique', dates: 'c. 347-420 CE', works: ['Vulgate Bible'], language: 'Latin', color: '#7C3AED' },
    { name: 'John Chrysostom', birth: 'Antioch', coords: [420, 320], era: 'Late Antique', dates: 'c. 349-407 CE', works: ['Homilies'], language: 'Greek', color: '#7C3AED' },

    // Byzantine Era (600-1453 CE)
    { name: 'Photius', birth: 'Constantinople', coords: [390, 280], era: 'Byzantine', dates: 'c. 810-893 CE', works: ['Bibliotheca'], language: 'Greek', color: '#059669' },
    { name: 'Michael Psellus', birth: 'Constantinople', coords: [392, 282], era: 'Byzantine', dates: '1018-1078 CE', works: ['Chronographia'], language: 'Greek', color: '#059669' }
  ];

  const regions = [
    { name: 'Sicily', coords: [240, 320], label: 'Sicilia' },
    { name: 'Italy', coords: [220, 260], label: 'Italia' },
    { name: 'Greece', coords: [330, 280], label: 'Hellas' },
    { name: 'Asia Minor', coords: [380, 270], label: 'Asia Minor' },
    { name: 'Egypt', coords: [290, 340], label: 'Aegyptus' },
    { name: 'North Africa', coords: [180, 380], label: 'Africa' }
  ];

  const eras = [
    { name: 'Archaic', period: '800-500 BCE', color: '#D97706', description: 'Foundation of Greek literary tradition' },
    { name: 'Classical', period: '500-323 BCE', color: '#F59E0B', description: 'Golden age of Athens' },
    { name: 'Hellenistic', period: '323-31 BCE', color: '#3B82F6', description: 'Post-Alexandrian scholarship' },
    { name: 'Imperial', period: '31 BCE-284 CE', color: '#DC2626', description: 'Roman literary dominance' },
    { name: 'Late Antique', period: '284-600 CE', color: '#7C3AED', description: 'Christian transformation' },
    { name: 'Byzantine', period: '600-1453 CE', color: '#059669', description: 'Eastern Roman legacy' }
  ];

  const mapWidth = 600;
  const mapHeight = 400;

  return (
    <div style={{ backgroundColor: '#0D0D0F', color: '#F5F4F2', fontFamily: 'sans-serif', display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '100vh', padding: '20px' }}>
      <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '20px', color: '#C9A227', textShadow: '1px 1px 2px #000' }}>
        Ancient Authors Map
      </h1>

      <div style={{ display: 'flex', justifyContent: 'space-around', width: '100%', maxWidth: '1200px', marginBottom: '20px' }}>
        <div style={{ backgroundColor: '#1E1E24', borderRadius: '8px', padding: '20px', width: '60%', boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.3)', transition: 'transform 0.3s ease, box-shadow 0.3s ease' }}>
          <svg width={mapWidth} height={mapHeight} style={{ display: 'block', margin: '0 auto' }}>
            <image href="/europe_map.svg" width={mapWidth} height={mapHeight} />
            {regions.map((region) => (
              <g key={region.name}>
                <circle cx={region.coords[0]} cy={region.coords[1]} r="4" fill="#9CA3AF" />
                <text x={region.coords[0] + 5} y={region.coords[1] + 5} fontSize="0.6em" fill="#9CA3AF" style={{ alignmentBaseline: 'middle' }}>
                  {region.label}
                </text>
              </g>
            ))}

            {authors.map((author) => (
              <g key={author.name} style={{ cursor: 'pointer', transition: 'opacity 0.2s' }}
                onMouseEnter={() => setHoveredAuthor(author.name)}
                onMouseLeave={() => setHoveredAuthor(null)}
              >
                <circle
                  cx={author.coords[0]}
                  cy={author.coords[1]}
                  r={hoveredAuthor === author.name ? '8' : '5'}
                  fill={author.color}
                  style={{ transition: 'r 0.2s, fill 0.2s' }}
                />
                {hoveredAuthor === author.name && (
                  <text
                    x={author.coords[0] + 10}
                    y={author.coords[1] + 5}
                    fontSize="0.8em"
                    fill="#F5F4F2"
                    style={{ alignmentBaseline: 'middle', textShadow: '1px 1px 2px #000' }}
                  >
                    {author.name}
                  </text>
                )}
              </g>
            ))}
          </svg>
        </div>

        <div style={{ backgroundColor: '#1E1E24', borderRadius: '8px', padding: '20px', width: '35%', boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.3)', transition: 'transform 0.3s ease, box-shadow 0.3s ease' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '10px', color: '#C9A227' }}>Author Details</h2>
          {hoveredAuthor ? (
            <>
              {authors.filter(author => author.name === hoveredAuthor).map(author => (
                <div key={author.name} style={{marginBottom: '10px'}}>
                  <h3 style={{fontSize: '1.2rem', color: '#F5F4F2'}}>{author.name}</h3>
                  <p style={{color: '#9CA3AF'}}>Era: <span style={{fontWeight: 'bold', color: author.color}}>{author.era}</span></p>
                  <p style={{color: '#9CA3AF'}}>Dates: {author.dates}</p>
                  <p style={{color: '#9CA3AF'}}>Birthplace: {author.birth}</p>
                  <p style={{color: '#9CA3AF'}}>Language: {author.language} {author.language === 'Greek' ? <span style={{color: '#3B82F6'}}>(Α)</span> : <span style={{color: '#DC2626'}}>(L)</span>}</p>
                  <p style={{color: '#9CA3AF'}}>Notable Works: {author.works.join(', ')}</p>
                </div>
              ))}
            </>
          ) : (
            <p style={{ color: '#6B7280' }}>Hover over an author on the map to see details.</p>
          )}
        </div>
      </div>

      <div style={{ backgroundColor: '#141419', borderRadius: '8px', padding: '20px', width: '100%', maxWidth: '1200px', boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.5)', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '15px', color: '#C9A227' }}>Historical Eras</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px' }}>
          {eras.map((era) => (
            <div key={era.name} style={{ backgroundColor: '#1E1E24', borderRadius: '8px', padding: '15px', border: `2px solid ${era.color}`, transition: 'transform 0.3s ease', cursor: 'pointer',  boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.4)' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#F5F4F2', marginBottom: '5px' }}>{era.name}</h3>
              <p style={{ color: '#9CA3AF', marginBottom: '5px' }}>Period: {era.period}</p>
              <p style={{ color: '#6B7280' }}>{era.description}</p>
            </div>
          ))}
        </div>
      </div>

      <footer style={{ marginTop: '20px', color: '#9CA3AF', textAlign: 'center' }}>
        &copy; 2024 Logos Professional Design System
      </footer>
    </div>
  );
}