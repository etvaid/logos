'use client';

import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';

export default function LanguagesMap() {
  const [selectedEra, setSelectedEra] = useState(500);
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [showCriticalApparatus, setShowCriticalApparatus] = useState(false);
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [showParadigms, setShowParadigms] = useState(false);
  const [showWordEmbeddings, setShowWordEmbeddings] = useState(false);
  const [animationPhase, setAnimationPhase] = useState(0);
  const mapRef = useRef<SVGSVGElement>(null);

  const eras = [
    { year: 800, label: '800 BCE', color: '#D97706', name: 'Archaic' },
    { year: 500, label: '500 BCE', color: '#F59E0B', name: 'Classical' },
    { year: 323, label: '323 BCE', color: '#3B82F6', name: 'Hellenistic' },
    { year: 31, label: '31 BCE', color: '#DC2626', name: 'Imperial' },
    { year: 284, label: '284 CE', color: '#7C3AED', name: 'Late Antique' },
    { year: 600, label: '600 CE', color: '#059669', name: 'Byzantine' }
  ];

  const languageTypes = [
    { name: 'Greek', color: '#3B82F6', symbol: 'Α' },
    { name: 'Latin', color: '#DC2626', symbol: 'L' },
    { name: 'Celtic', color: '#D97706', symbol: 'C' },
    { name: 'Germanic', color: '#10B981', symbol: 'G' },
    { name: 'Persian', color: '#7C3AED', symbol: 'P' },
    { name: 'Egyptian', color: '#F59E0B', symbol: 'E' },
    { name: 'Semitic', color: '#EF4444', symbol: 'S' }
  ];

  const allRegions: { [key: number]: Array<{
    id: string;
    name: string;
    language: string;
    color: string;
    type: string;
    cx: number;
    cy: number;
    size: number;
    influence: string;
    population: string;
    description: string;
    manuscripts: string[];
    variants: string[];
    paradigm: string;
    lsj: string;
    semantic_drift: string;
    polytonic: string;
  }> } = {
    800: [
      { id: 'attica', name: 'Attica', language: 'Attic Greek', color: '#3B82F6', type: 'Greek', cx: 480, cy: 180, size: 15, influence: 'Emerging polis system', population: '~200,000', description: 'Developing distinctive dialect features', manuscripts: ['P.Oxy 1'], variants: ['ἄνθρωπος/ἀνέρ'], paradigm: 'λύω', lsj: 'λύω: to loose, release', semantic_drift: 'λύω: "untie" → "solve" → "destroy"', polytonic: 'λύω, λῡ́εις, λῡ́ει' },
      { id: 'ionia', name: 'Ionia', language: 'Ionic Greek', color: '#3B82F6', type: 'Greek', cx: 520, cy: 160, size: 20, influence: 'Early literary tradition', population: '~300,000', description: 'Homer\'s linguistic homeland', manuscripts: ['Venetus A'], variants: ['ἠώς/αὐγή'], paradigm: 'φιλέω', lsj: 'φιλέω: to love, regard with affection', semantic_drift: 'φιλέω: "kiss" → "love" → "honor"', polytonic: 'φιλέω, φιλεῖς, φιλεῖ' },
      { id: 'sparta', name: 'Laconia', language: 'Doric Greek', color: '#3B82F6', type: 'Greek', cx: 460, cy: 200, size: 18, influence: 'Conservative dialectal forms', population: '~150,000', description: 'Preserving archaic features', manuscripts: ['Alcman fr.'], variants: ['ἁμέρα/ἡμέρα'], paradigm: 'δίδωμι', lsj: 'δίδωμι: to give', semantic_drift: 'δίδωμι: "give" → "grant" → "allow"', polytonic: 'δίδωμι, δίδως, δίδωσι' },
      { id: 'rome', name: 'Latium', language: 'Old Latin', color: '#DC2626', type: 'Latin', cx: 340, cy: 180, size: 12, influence: 'Local Italic dialect', population: '~50,000', description: 'Pre-literary Latin forms', manuscripts: ['CIL I²'], variants: ['duonoro/bonorum'], paradigm: 'amo', lsj: 'N/A (Latin)', semantic_drift: 'amo: "love" → "like" → "prefer"', polytonic: 'N/A' },
      { id: 'gaul', name: 'Gallia', language: 'Gaulish', color: '#D97706', type: 'Celtic', cx: 260, cy: 100, size: 25, influence: 'Celtic substrate', population: '~2,000,000', description: 'Continental Celtic languages', manuscripts: ['Coligny'], variants: ['brigā/castellum'], paradigm: 'N/A', lsj: 'N/A (Celtic)', semantic_drift: 'brigā: "hill" → "fort" → "town"', polytonic: 'N/A' }
    ],
    500: [
      { id: 'athens', name: 'Athens', language: 'Attic Greek', color: '#3B82F6', type: 'Greek', cx: 480, cy: 180, size: 25, influence: 'Literary koinē emerging', population: '~300,000', description: 'Classical prose standard', manuscripts: ['Bodmer VIII'], variants: ['οἶδα/εἰδῶ'], paradigm: 'παιδεύω', lsj: 'παιδεύω: to bring up a child, educate', semantic_drift: 'παιδεύω: "raise child" → "educate" → "correct"', polytonic: 'παιδεύω, παιδεύεις, παιδεύει' },
      { id: 'ionia', name: 'Ionia', language: 'Ionic Greek', color: '#3B82F6', type: 'Greek', cx: 520, cy: 160, size: 20, influence: 'Historical prose', population: '~350,000', description: 'Herodotean historiography', manuscripts: ['Papyrus Florentinus'], variants: ['ἱστορίη/ἱστορία'], paradigm: 'ἱστορέω', lsj: 'ἱστορέω: to inquire, examine', semantic_drift: 'ἱστορέω: "see" → "inquire" → "narrate"', polytonic: 'ἱστορέω, ἱστορέεις, ἱστορέει' },
      { id: 'rome', name: 'Rome', language: 'Classical Latin', color: '#DC2626', type: 'Latin', cx: 340, cy: 180, size: 18, influence: 'Republican expansion', population: '~100,000', description: 'Legal and oratorical register', manuscripts: ['Codex Ambrosianus'], variants: ['honos/honor'], paradigm: 'amo', lsj: 'N/A (Latin)', semantic_drift: 'honos: "honor" → "office" → "glory"', polytonic: 'N/A' }
    ],
    323: [
      { id: 'alexandria', name: 'Alexandria', language: 'Koinē Greek', color: '#3B82F6', type: 'Greek', cx: 540, cy: 250, size: 30, influence: 'Hellenistic scholarship', population: '~400,000', description: 'Scholarly koinē standard', manuscripts: ['P.Hibeh', 'P.Petrie'], variants: ['σύνταξις/τάξις'], paradigm: 'συντάσσω', lsj: 'συντάσσω: to arrange together', semantic_drift: 'συντάσσω: "arrange" → "compose" → "organize"', polytonic: 'συντάσσω, συντάσσεις, συντάσσει' },
      { id: 'antioch', name: 'Antioch', language: 'Koinē Greek', color: '#3B82F6', type: 'Greek', cx: 560, cy: 200, size: 22, influence: 'Syriac influence', population: '~150,000', description: 'Blending Hellenic and Semitic cultures', manuscripts: ['P. Dura-Europos'], variants: ['λόγος/ܡܠܬܐ'], paradigm: 'ποιέω', lsj: 'ποιέω: to make, do', semantic_drift: 'ποιέω: "make" → "create" → "perform"', polytonic: 'ποιέω, ποιεῖς, ποιεῖ' },
      { id: 'rome_hellenistic', name: 'Rome', language: 'Vulgar Latin', color: '#DC2626', type: 'Latin', cx: 340, cy: 180, size: 20, influence: 'Emerging Romance languages', population: '~200,000', description: 'Colloquial spoken register', manuscripts: ['Pompeii graffiti'], variants: ['equos/caballus'], paradigm: 'amare', lsj: 'N/A (Latin)', semantic_drift: 'amare: "love" → "like" → "want"', polytonic: 'N/A' }
    ],
    31: [
      { id: 'rome_imperial', name: 'Rome', language: 'Classical Latin', color: '#DC2626', type: 'Latin', cx: 340, cy: 180, size: 35, influence: 'Imperial administration', population: '~1,000,000', description: 'Golden Age literature', manuscripts: ['Vergilius Romanus'], variants: ['urbs/civitas'], paradigm: 'amare', lsj: 'N/A (Latin)', semantic_drift: 'urbs: "city" → "capital" → "metropolis"', polytonic: 'N/A' },
      { id: 'athens_imperial', name: 'Athens', language: 'Koinē Greek', color: '#3B82F6', type: 'Greek', cx: 480, cy: 180, size: 28, influence: 'Roman patronage', population: '~200,000', description: 'Second Sophistic movement', manuscripts: ['P.Oxy. 8'], variants: ['χρόνος/καιρός'], paradigm: 'ἔχω', lsj: 'ἔχω: to have, hold', semantic_drift: 'ἔχω: "hold" → "possess" → "control"', polytonic: 'ἔχω, ἔχεις, ἔχει' },
      { id: 'alexandria_imperial', name: 'Alexandria', language: 'Koinē Greek', color: '#3B82F6', type: 'Greek', cx: 540, cy: 250, size: 32, influence: 'Syncretic philosophy', population: '~500,000', description: 'Greco-Egyptian culture', manuscripts: ['P.Chester Beatty'], variants: ['θεός/νέθερ'], paradigm: 'πιστεύω', lsj: 'πιστεύω: to believe, trust', semantic_drift: 'πιστεύω: "trust" → "believe" → "rely"', polytonic: 'πιστεύω, πιστεύεις, πιστεύει' }
    ],
    284: [
      { id: 'rome_late_antique', name: 'Rome', language: 'Late Latin', color: '#DC2626', type: 'Latin', cx: 340, cy: 180, size: 30, influence: 'Christian Latin', population: '~500,000', description: 'Emergence of Vulgar Latin dialects', manuscripts: ['Codex Theodosianus'], variants: ['testa/caput'], paradigm: 'amare', lsj: 'N/A (Latin)', semantic_drift: 'testa: "potsherd" → "head" → "person"', polytonic: 'N/A' },
      { id: 'constantinople', name: 'Constantinople', language: 'Koinē Greek', color: '#3B82F6', type: 'Greek', cx: 500, cy: 170, size: 35, influence: 'Byzantine capital', population: '~400,000', description: 'Early Byzantine Greek', manuscripts: ['Vienna Genesis'], variants: ['βασιλεύς/ρήξ'], paradigm: 'δείκνυμι', lsj: 'δείκνυμι: to show, point out', semantic_drift: 'δείκνυμι: "show" → "prove" → "demonstrate"', polytonic: 'δείκνυμι, δείκνυς, δείκνυσι' },
      { id: 'carthage', name: 'Carthage', language: 'Latin/Punic', color: '#DC2626', type: 'Latin', cx: 310, cy: 230, size: 22, influence: 'North African Latin', population: '~150,000', description: 'Influence of Punic substratum', manuscripts: ['Augustine Conf.'], variants: ['domus/casa'], paradigm: 'orare', lsj: 'N/A (Latin)', semantic_drift: 'orare: "speak" → "pray" → "beg"', polytonic: 'N/A' }
    ],
    600: [
      { id: 'constantinople_byz', name: 'Constantinople', language: 'Medieval Greek', color: '#3B82F6', type: 'Greek', cx: 500, cy: 170, size: 40, influence: 'Byzantine administration', population: '~500,000', description: 'Development of Medieval Greek grammar', manuscripts: ['Codex Sinaiticus'], variants: ['ἄνθρωπος/βροτός'], paradigm: 'γίγνομαι', lsj: 'γίγνομαι: to become, happen', semantic_drift: 'γίγνομαι: "be born" → "become" → "exist"', polytonic: 'γίγνομαι, γίγνῃ, γίγνεται' },
      { id: 'rome_byz', name: 'Rome', language: 'Vulgar Latin', color: '#DC2626', type: 'Latin', cx: 340, cy: 180, size: 25, influence: 'Papal States', population: '~100,000', description: 'Transition to early Romance languages', manuscripts: ['Greg. Tours Hist.'], variants: ['ignis/focum'], paradigm: 'cantare', lsj: 'N/A (Latin)', semantic_drift: 'cantare: "sing" → "chant" → "tell"', polytonic: 'N/A' },
      { id: 'cordoba', name: 'Cordoba', language: 'Vulgar Latin/Arabic', color: '#DC2626', type: 'Latin', cx: 280, cy: 200, size: 20, influence: 'Visigothic and Islamic influences', population: '~75,000', description: 'Mozarabic language emergence', manuscripts: ['Isidore Etym.'], variants: ['oculus/ojo'], paradigm: 'habere', lsj: 'N/A (Latin)', semantic_drift: 'habere: "have" → "hold" → "consider"', polytonic: 'N/A' }
    ]
  };


  const currentRegions = allRegions[selectedEra] || [];

  const handleRegionClick = (regionId: string) => {
    setSelectedRegion(regionId);
  };

  const selectedRegionData = currentRegions.find(region => region.id === selectedRegion);


  const handleEraChange = (year: number) => {
    setSelectedEra(year);
    setAnimationPhase(1); // Trigger animation
    setTimeout(() => setAnimationPhase(0), 300); // Reset after animation duration
  };


  useEffect(() => {
      if (mapRef.current) {
          const svg = mapRef.current;
          svg.querySelectorAll('circle').forEach(circle => {
              circle.addEventListener('mouseover', (event) => {
                  const target = event.target as SVGCircleElement;
                  target.style.transform = 'scale(1.2)';
                  target.style.transition = 'transform 0.2s';
              });

              circle.addEventListener('mouseout', (event) => {
                  const target = event.target as SVGCircleElement;
                  target.style.transform = 'scale(1)';
                  target.style.transition = 'transform 0.2s';
              });
          });
      }
  }, [currentRegions]);



  return (
    <div style={{ backgroundColor: '#0D0D0F', color: '#F5F4F2', fontFamily: 'sans-serif', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px', transition: 'background-color 0.3s, color 0.3s' }}>
      <header style={{ marginBottom: '20px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.5em', fontWeight: 'bold', color: '#C9A227', transition: 'color 0.3s' }}>Logos: Languages of the Ancient World</h1>
        <p style={{ color: '#9CA3AF', fontSize: '1.1em', transition: 'color 0.3s' }}>A dynamic visualization of language evolution through time.</p>
      </header>

      <section style={{ display: 'flex', flexDirection: 'row', width: '90%', maxWidth: '1200px', gap: '20px' }}>

        <aside style={{ width: '25%', backgroundColor: '#1E1E24', padding: '15px', borderRadius: '8px', transition: 'background-color 0.3s', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)' }}>
          <h3 style={{ color: '#F5F4F2', marginBottom: '10px', fontSize: '1.4em', transition: 'color 0.3s' }}>Time Navigation</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {eras.map((era) => (
              <button
                key={era.year}
                onClick={() => handleEraChange(era.year)}
                style={{
                  backgroundColor: era.year === selectedEra ? era.color : '#374151',
                  color: '#F5F4F2',
                  padding: '8px 12px',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  transition: 'background-color 0.3s, color 0.3s, transform 0.2s',
                  boxShadow: era.year === selectedEra ? '0 2px 4px rgba(0, 0, 0, 0.5)' : 'none',
                  transform: era.year === selectedEra ? 'scale(1.05)' : 'scale(1)',
                  outline: 'none',
                  fontSize: '1em',
                }}
              >
                {era.label}
              </button>
            ))}
          </div>

          <h3 style={{ color: '#F5F4F2', marginTop: '20px', marginBottom: '10px', fontSize: '1.4em', transition: 'color 0.3s' }}>Language Key</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {languageTypes.map((type) => (
              <div key={type.name} style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#9CA3AF', transition: 'color 0.3s' }}>
                <span style={{ color: type.color, fontWeight: 'bold', fontSize: '1.2em' }}>{type.symbol}</span>
                <span>{type.name}</span>
              </div>
            ))}
          </div>
        </aside>

        <main style={{ width: '50%', backgroundColor: '#1E1E24', borderRadius: '8px', overflow: 'hidden', transition: 'background-color 0.3s', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)' }}>
          <div style={{ position: 'relative' }}>
            <svg
              ref={mapRef}
              width="100%"
              height="auto"
              viewBox="0 0 600 400"
              style={{ transition: 'opacity 0.3s', opacity: animationPhase === 1 ? 0.5 : 1, display: 'block' }}
            >
              <image href="/europe_map.svg" width="600" height="400" style={{pointerEvents: 'none'}}/>
              {currentRegions.map((region) => (
                <circle
                  key={region.id}
                  cx={region.cx}
                  cy={region.cy}
                  r={region.size}
                  fill={region.color}
                  style={{
                    cursor: 'pointer',
                    opacity: hoveredRegion === region.id || selectedRegion === region.id ? 0.9 : 0.7,
                    transition: 'opacity 0.2s, transform 0.2s',
                    transformOrigin: 'center',
                  }}
                  onMouseOver={() => setHoveredRegion(region.id)}
                  onMouseOut={() => setHoveredRegion(null)}
                  onClick={() => handleRegionClick(region.id)}
                  title={region.name}
                />
              ))}
            </svg>
          </div>
        </main>

        <aside style={{ width: '25%', backgroundColor: '#1E1E24', padding: '15px', borderRadius: '8px', transition: 'background-color 0.3s', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)' }}>
          {selectedRegionData ? (
            <>
              <h3 style={{ color: '#F5F4F2', marginBottom: '10px', fontSize: '1.4em', transition: 'color 0.3s' }}>{selectedRegionData.name}</h3>
              <p style={{ color: '#9CA3AF', fontSize: '1em', transition: 'color 0.3s' }}>Language: {selectedRegionData.language}</p>
               <p style={{ color: '#9CA3AF', fontSize: '1em', transition: 'color 0.3s' }}>Population: {selectedRegionData.population}</p>
              <p style={{ color: '#9CA3AF', fontSize: '1em', transition: 'color 0.3s' }}>Influence: {selectedRegionData.influence}</p>
              <p style={{ color: '#9CA3AF', fontSize: '1em', transition: 'color 0.3s' }}>Description: {selectedRegionData.description}</p>

              <button
                onClick={() => setShowCriticalApparatus(!showCriticalApparatus)}
                style={{
                  backgroundColor: '#374151',
                  color: '#F5F4F2',
                  padding: '8px 12px',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  transition: 'background-color 0.3s, color 0.3s, transform 0.2s',
                  marginTop: '10px',
                  width: '100%',
                  textAlign: 'center',
                  fontSize: '0.9em',
                }}
              >
                {showCriticalApparatus ? 'Hide Apparatus' : 'Show Apparatus'}
              </button>

              {showCriticalApparatus && (
                <div style={{ marginTop: '10px', borderTop: '1px solid #6B7280', paddingTop: '10px' }}>
                  <h4 style={{ color: '#F5F4F2', fontSize: '1.2em', transition: 'color 0.3s', marginBottom: '5px' }}>Critical Apparatus</h4>
                  <p style={{ color: '#9CA3AF', fontSize: '0.9em', transition: 'color 0.3s' }}>Manuscripts: {selectedRegionData.manuscripts.join(', ')}</p>
                  <p style={{ color: '#9CA3AF', fontSize: '0.9em', transition: 'color 0.3s' }}>Variants: {selectedRegionData.variants.join(', ')}</p>
                  <p style={{ color: '#9CA3AF', fontSize: '0.9em', transition: 'color 0.3s' }}>LSJ: {selectedRegionData.lsj}</p>
                  <p style={{ color: '#9CA3AF', fontSize: '0.9em', transition: 'color 0.3s' }}>Semantic Drift: {selectedRegionData.semantic_drift}</p>
                  <p style={{ color: '#9CA3AF', fontSize: '0.9em', transition: 'color 0.3s' }}>Polytonic: {selectedRegionData.polytonic}</p>
                </div>
              )}

            </>
          ) : (
            <p style={{ color: '#9CA3AF', textAlign: 'center', transition: 'color 0.3s' }}>Select a region to view details.</p>
          )}
        </aside>
      </section>


      <footer style={{ marginTop: '30px', textAlign: 'center', color: '#6B7280', transition: 'color 0.3s' }}>
        <p>&copy; 2024 Logos Project. All rights reserved.</p>
      </footer>
    </div>
  );
}