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
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [viewMode, setViewMode] = useState<'map' | 'network' | 'timeline'>('map');
  const mapRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationPhase(prev => (prev + 1) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, []);

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
      { id: 'rome', name: 'Rome', language: 'Classical Latin', color: '#DC2626', type: 'Latin', cx: 340, cy: 180, size: 18, influence: 'Republican expansion', population: '~100,000', description: 'Legal and oratorical register', manuscripts: ['Codex Ambrosianus'], variants: ['honos/honor'], paradigm: 'amo', lsj: 'N/A (Latin)', semantic_drift: 'honos: "honor" → "office" → "glory"', polytonic: 'N/A' },
      { id: 'delphi', name: 'Delphi', language: 'Delphic Greek', color: '#3B82F6', type: 'Greek', cx: 470, cy: 170, size: 15, influence: 'Religious authority', population: '~10,000', description: 'Oracular inscriptions', manuscripts: ['CID I'], variants: ['θεός/θεός'], paradigm: 'μαντεύομαι', lsj: 'μαντεύομαι: to divine, prophesy', semantic_drift: 'μαντεύομαι: "oracle" → "prophecy" → "predict"', polytonic: 'μαντεύομαι, μαντεύῃ, μαντεύεται' },
      { id: 'massalia', name: 'Massalia', language: 'Phocaean Greek', color: '#3B82F6', type: 'Greek', cx: 280, cy: 190, size: 10, influence: 'Trade and cultural exchange', population: '~30,000', description: 'Greek colony in Gaul', manuscripts: ['Massalia inscriptions'], variants: ['πόλις/πόλις'], paradigm: 'οἰκέω', lsj: 'οἰκέω: to inhabit, dwell', semantic_drift: 'οἰκέω: "settle" → "inhabit" → "manage"', polytonic: 'οἰκέω, οἰκεῖς, οἰκεῖ' },
      { id: 'carthage', name: 'Carthage', language: 'Punic', color: '#EF4444', type: 'Semitic', cx: 360, cy: 250, size: 12, influence: 'Phoenician influence', population: '~100,000', description: 'Trade and maritime power', manuscripts: ['Poenulus'], variants: [], paradigm: 'N/A', lsj: 'N/A (Punic)', semantic_drift: 'N/A', polytonic: 'N/A' }
    ],
    323: [
      { id: 'alexandria', name: 'Alexandria', language: 'Koine Greek', color: '#3B82F6', type: 'Greek', cx: 540, cy: 210, size: 30, influence: 'Hellenistic center', population: '~500,000', description: 'Library and Museum', manuscripts: ['P.Ryl. III 457'], variants: ['βασιλεύς/βασιλεύς'], paradigm: 'βασιλεύω', lsj: 'βασιλεύω: to be king, rule', semantic_drift: 'βασιλεύω: "king" → "reign" → "dominate"', polytonic: 'βασιλεύω, βασιλεύεις, βασιλεύει' },
      { id: 'antioch', name: 'Antioch', language: 'Koine Greek', color: '#3B82F6', type: 'Greek', cx: 580, cy: 180, size: 25, influence: 'Seleucid capital', population: '~300,000', description: 'Cultural and commercial hub', manuscripts: ['P.Ant. I 2'], variants: ['λόγος/λόγος'], paradigm: 'λέγω', lsj: 'λέγω: to say, speak', semantic_drift: 'λέγω: "gather" → "speak" → "mean"', polytonic: 'λέγω, λέγεις, λέγει' },
      { id: 'pergamum', name: 'Pergamum', language: 'Koine Greek', color: '#3B82F6', type: 'Greek', cx: 510, cy: 150, size: 18, influence: 'Attalid dynasty', population: '~150,000', description: 'Scroll production', manuscripts: ['P.Perg. 1'], variants: ['βιβλίον/βιβλίον'], paradigm: 'γράφω', lsj: 'γράφω: to write, draw', semantic_drift: 'γράφω: "scratch" → "write" → "depict"', polytonic: 'γράφω, γράφεις, γράφει' },
      { id: 'rome', name: 'Rome', language: 'Early Latin', color: '#DC2626', type: 'Latin', cx: 340, cy: 180, size: 20, influence: 'Expansion in Italy', population: '~200,000', description: 'Early Republic', manuscripts: ['Carmen Saliare'], variants: ['lasa/lar'], paradigm: 'sum', lsj: 'N/A (Latin)', semantic_drift: 'sum: "be" → "exist" → "occur"', polytonic: 'N/A' },
      { id: 'seleucia', name: 'Seleucia', language: 'Aramaic', color: '#EF4444', type: 'Semitic', cx: 620, cy: 200, size: 15, influence: 'Seleucid administration', population: '~100,000', description: 'Mesopotamian trade hub', manuscripts: [], variants: [], paradigm: 'N/A', lsj: 'N/A (Aramaic)', semantic_drift: 'N/A', polytonic: 'N/A' }
    ],
    31: [
      { id: 'rome', name: 'Rome', language: 'Classical Latin', color: '#DC2626', type: 'Latin', cx: 340, cy: 180, size: 35, influence: 'Imperial power', population: '~1,000,000', description: 'Augustan Age', manuscripts: ['Vergilius Romanus'], variants: ['virtus/virtus'], paradigm: 'sum', lsj: 'N/A (Latin)', semantic_drift: 'virtus: "manliness" → "courage" → "excellence"', polytonic: 'N/A' },
      { id: 'alexandria', name: 'Alexandria', language: 'Koine Greek', color: '#3B82F6', type: 'Greek', cx: 540, cy: 210, size: 30, influence: 'Roman province', population: '~500,000', description: 'Continued scholarship', manuscripts: ['P.Oxy. I 29'], variants: ['θεός/θεός'], paradigm: 'εἰμί', lsj: 'εἰμί: to be', semantic_drift: 'εἰμί: "be" → "exist" → "occur"', polytonic: 'εἰμί, εἶ, ἐστί' },
      { id: 'lyon', name: 'Lugdunum', language: 'Latin', color: '#DC2626', type: 'Latin', cx: 270, cy: 120, size: 15, influence: 'Roman Gaul', population: '~50,000', description: 'Important administrative center', manuscripts: ['Lugdunum Altar'], variants: ['urbs/urbs'], paradigm: 'do', lsj: 'N/A (Latin)', semantic_drift: 'urbs: "city" → "capital" → "state"', polytonic: 'N/A' },
      { id: 'athens', name: 'Athens', language: 'Koine Greek', color: '#3B82F6', type: 'Greek', cx: 480, cy: 180, size: 20, influence: 'Roman influence', population: '~100,000', description: 'Center of philosophy', manuscripts: ['P.Oxy. I 22'], variants: ['φιλοσοφία/φιλοσοφία'], paradigm: 'ζάω', lsj: 'ζάω: to live', semantic_drift: 'ζάω: "breathe" → "live" → "thrive"', polytonic: 'ζάω, ζῇς, ζῇ' },
      { id: 'jerusalem', name: 'Jerusalem', language: 'Aramaic/Hebrew', color: '#EF4444', type: 'Semitic', cx: 590, cy: 240, size: 12, influence: 'Religious center', population: '~50,000', description: 'Under Roman rule', manuscripts: ['Dead Sea Scrolls'], variants: [], paradigm: 'N/A', lsj: 'N/A (Semitic)', semantic_drift: 'N/A', polytonic: 'N/A' }
    ],
    284: [
      { id: 'rome', name: 'Rome', language: 'Late Latin', color: '#DC2626', type: 'Latin', cx: 340, cy: 180, size: 30, influence: 'Diocletian reforms', population: '~800,000', description: 'Administrative changes', manuscripts: ['Fragmenta Vatienana'], variants: ['lex/lex'], paradigm: 'dico', lsj: 'N/A (Latin)', semantic_drift: 'lex: "law" → "rule" → "principle"', polytonic: 'N/A' },
      { id: 'constantinople', name: 'Byzantium', language: 'Koine Greek', color: '#3B82F6', type: 'Greek', cx: 530, cy: 170, size: 25, influence: 'Strategic location', population: '~50,000', description: 'Emerging imperial capital', manuscripts: ['Early codices'], variants: ['πόλις/πόλις'], paradigm: 'ποιέω', lsj: 'ποιέω: to do, make', semantic_drift: 'ποιέω: "build" → "create" → "cause"', polytonic: 'ποιέω, ποιεῖς, ποιεῖ' },
      { id: 'treves', name: 'Augusta Treverorum', language: 'Latin', color: '#DC2626', type: 'Latin', cx: 240, cy: 90, size: 18, influence: 'Imperial residence', population: '~70,000', description: 'Important administrative center', manuscripts: ['Mosella'], variants: ['via/via'], paradigm: 'eo', lsj: 'N/A (Latin)', semantic_drift: 'via: "road" → "path" → "method"', polytonic: 'N/A' },
      { id: 'carthage', name: 'Carthage', language: 'Latin', color: '#DC2626', type: 'Latin', cx: 360, cy: 250, size: 15, influence: 'African province', population: '~100,000', description: 'Christian intellectual center', manuscripts: ['Codex Claromontanus'], variants: ['ecclesia/ecclesia'], paradigm: 'sum', lsj: 'N/A (Latin)', semantic_drift: 'ecclesia: "assembly" → "church" → "congregation"', polytonic: 'N/A' },
      { id: 'thebes', name: 'Thebes', language: 'Egyptian/Greek', color: '#F59E0B', type: 'Egyptian', cx: 560, cy: 270, size: 12, influence: 'Cultural continuity', population: '~40,000', description: 'Religious and cultural traditions', manuscripts: ['Coptic texts'], variants: [], paradigm: 'N/A', lsj: 'N/A (Egyptian)', semantic_drift: 'N/A', polytonic: 'N/A' }
    ],
    600: [
      { id: 'constantinople', name: 'Constantinople', language: 'Medieval Greek', color: '#3B82F6', type: 'Greek', cx: 530, cy: 170, size: 35, influence: 'Byzantine capital', population: '~300,000', description: 'Center of Orthodox Christianity', manuscripts: ['Codex Sinaiticus'], variants: ['θεός/θεός'], paradigm: 'εἰμί', lsj: 'εἰμί: to be', semantic_drift: 'θεός: "god" → "divine" → "holy"', polytonic: 'εἰμί, εἶ, ἐστί' },
      { id: 'rome', name: 'Rome', language: 'Vulgar Latin', color: '#DC2626', type: 'Latin', cx: 340, cy: 180, size: 25, influence: 'Papal authority', population: '~50,000', description: 'Rise of the papacy', manuscripts: ['Gregorian Sacramentary'], variants: ['populus/populus'], paradigm: 'amo', lsj: 'N/A (Latin)', semantic_drift: 'populus: "people" → "nation" → "community"', polytonic: 'N/A' },
      { id: 'cordoba', name: 'Cordoba', language: 'Latin/Arabic', color: '#DC2626', type: 'Latin', cx: 250, cy: 230, size: 20, influence: 'Visigothic kingdom', population: '~100,000', description: 'Cultural interactions', manuscripts: ['Etymologiae'], variants: ['rex/rex'], paradigm: 'ago', lsj: 'N/A (Latin)', semantic_drift: 'rex: "king" → "ruler" → "sovereign"', polytonic: 'N/A' },
      { id: 'alexandria', name: 'Alexandria', language: 'Greek/Arabic', color: '#3B82F6', type: 'Greek', cx: 540, cy: 210, size: 18, influence: 'Byzantine control', population: '~150,000', description: 'Cultural and commercial center', manuscripts: ['Medical texts'], variants: ['ἰατρός/ἰατρός'], paradigm: 'θεραπεύω', lsj: 'θεραπεύω: to treat, heal', semantic_drift: 'θεραπεύω: "serve" → "heal" → "cherish"', polytonic: 'θεραπεύω, θεραπεύεις, θεραπεύει' },
      { id: 'paris', name: 'Paris', language: 'Vulgar Latin', color: '#DC2626', type: 'Latin', cx: 270, cy: 110, size: 15, influence: 'Merovingian dynasty', population: '~20,000', description: 'Emerging Frankish power', manuscripts: ['Vita Sancti Eligii'], variants: ['urbs/urbs'], paradigm: 'paro', lsj: 'N/A (Latin)', semantic_drift: 'urbs: "city" → "town" → "settlement"', polytonic: 'N/A' }
    ]
  };

  const regions = allRegions[selectedEra] || [];

  const handleEraChange = (year: number) => {
    setSelectedEra(year);
    setSelectedRegion(null); // Clear region when era changes
  };

  const handleRegionClick = (regionId: string) => {
    setSelectedRegion(regionId);
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (mapRef.current) {
      const rect = mapRef.current.getBoundingClientRect();
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
  };

  const getRegionDetails = () => {
    if (!selectedRegion) return null;
    const region = regions.find(r => r.id === selectedRegion);
    return region;
  };

  const selectedRegionDetails = getRegionDetails();

  const generateGlowEffect = (color: string, intensity: number = 1) => {
    return `
      0 0 ${5 * intensity}px ${color},
      0 0 ${10 * intensity}px ${color},
      0 0 ${15 * intensity}px ${color}
    `;
  };

  return (
    <div style={{ backgroundColor: '#0D0D0F', color: '#F5F4F2', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px', transition: 'background-color 0.3s, color 0.3s' }}>
      <h1 style={{ fontSize: '2.5em', fontWeight: 'bold', marginBottom: '20px', textShadow: '2px 2px 4px #000000', color: '#C9A227' }}>Logos: Languages of the Ancient World</h1>

      <div style={{ display: 'flex', flexDirection: 'row', gap: '20px', marginBottom: '20px' }}>
        {eras.map((era) => (
          <button
            key={era.year}
            onClick={() => handleEraChange(era.year)}
            style={{
              backgroundColor: selectedEra === era.year ? era.color : '#1E1E24',
              color: '#F5F4F2',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '1em',
              transition: 'background-color 0.3s, color 0.3s, transform 0.2s',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
              transform: selectedEra === era.year ? 'scale(1.1)' : 'scale(1)',
            }}
          >
            {era.label}
          </button>
        ))}
      </div>

      <div style={{ backgroundColor: '#1E1E24', padding: '20px', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.5)', marginBottom: '20px', width: '90%', maxWidth: '1200px', transition: 'background-color 0.3s' }}>
        <h2 style={{ fontSize: '1.8em', marginBottom: '15px', color: '#C9A227', textShadow: '1px 1px 2px #000' }}>
          {eras.find(era => era.year === selectedEra)?.name || 'Era'} ({selectedEra} BCE/CE)
        </h2>

        <div style={{ position: 'relative' }}>
          <svg
            ref={mapRef}
            width="1200"
            height="600"
            style={{ border: '1px solid #6B7280', borderRadius: '5px', transition: 'filter 0.3s', filter: `drop-shadow(0 0 5px rgba(0,0,0,0.5))` }}
            onMouseMove={handleMouseMove}
          >
            <image href="/europe_map.png" width="1200" height="600" style={{ objectFit: 'cover' }} />

            {regions.map((region) => (
              <circle
                key={region.id}
                cx={region.cx}
                cy={region.cy}
                r={region.size}
                fill={region.color}
                opacity={0.7}
                style={{
                  cursor: 'pointer',
                  transition: 'opacity 0.3s, transform 0.2s, filter 0.3s',
                  filter: hoveredRegion === region.id || selectedRegion === region.id ? generateGlowEffect(region.color, 2) : '',
                  transform: hoveredRegion === region.id || selectedRegion === region.id ? 'scale(1.2)' : 'scale(1)',
                }}
                onMouseEnter={() => setHoveredRegion(region.id)}
                onMouseLeave={() => setHoveredRegion(null)}
                onClick={() => handleRegionClick(region.id)}
              />
            ))}

          </svg>
        </div>
      </div>

      {selectedRegionDetails && (
        <div style={{ backgroundColor: '#1E1E24', padding: '20px', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.5)', width: '90%', maxWidth: '800px', transition: 'background-color 0.3s' }}>
          <h3 style={{ fontSize: '1.5em', marginBottom: '10px', color: '#C9A227', textShadow: '1px 1px 2px #000' }}>{selectedRegionDetails.name}</h3>
          <p style={{ color: '#9CA3AF', marginBottom: '8px' }}>Language: {selectedRegionDetails.language} ({selectedRegionDetails.type})</p>
          <p style={{ color: '#9CA3AF', marginBottom: '8px' }}>Population: {selectedRegionDetails.population}</p>
          <p style={{ color: '#9CA3AF', marginBottom: '12px' }}>Influence: {selectedRegionDetails.influence}</p>
          <p style={{ color: '#F5F4F2', marginBottom: '15px', borderBottom: '1px solid #6B7280', paddingBottom: '15px' }}>{selectedRegionDetails.description}</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <p style={{ color: '#9CA3AF' }}>Manuscripts: {selectedRegionDetails.manuscripts.join(', ')}</p>
            <p style={{ color: '#9CA3AF' }}>Variants: {selectedRegionDetails.variants.join(', ')}</p>
            <p style={{ color: '#9CA3AF' }}>Paradigm: {selectedRegionDetails.paradigm}</p>
             {selectedRegionDetails.lsj &&  <p style={{ color: '#9CA3AF' }}>LSJ Definition: {selectedRegionDetails.lsj}</p> }
            <p style={{ color: '#9CA3AF' }}>Semantic Drift: {selectedRegionDetails.semantic_drift}</p>
            {selectedRegionDetails.polytonic &&  <p style={{ color: '#9CA3AF' }}>Polytonic Example: {selectedRegionDetails.polytonic}</p> }
          </div>
        </div>
      )}

      <footer style={{ marginTop: '30px', color: '#9CA3AF', textAlign: 'center' }}>
        <p>&copy; 2024 Logos Project</p>
      </footer>
    </div>
  );
}