'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

export default function ChronosPage() {
  const [selectedConcept, setSelectedConcept] = useState<string>('ἀρετή');
  const [expandedNode, setExpandedNode] = useState<number | null>(null);
  const [hoveredNode, setHoveredNode] = useState<number | null>(null);
  const [hoveredWord, setHoveredWord, setHoveredWord] = useState<string | null>(null);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [showApparatus, setShowApparatus] = useState<boolean>(false);
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
  const [embeddingView, setEmbeddingView] = useState<boolean>(false);
  const [showParadigm, setShowParadigm] = useState<boolean>(false);
  const [hoveredEmbedding, setHoveredEmbedding] = useState<string | null>(null);
  const [selectedEra, setSelectedEra] = useState<number | null>(null);
  const timelineRef = useRef<HTMLDivElement>(null);

  const concepts = {
    'ἀρετή': {
      transliteration: 'aretē',
      modern: 'virtue',
      lsj: 'LSJ s.v. ἀρετή: I. goodness, excellence of any kind. II. esp. of moral virtue',
      paradigm: {
        nom_sg: 'ἀρετή',
        gen_sg: 'ἀρετῆς',
        dat_sg: 'ἀρετῇ',
        acc_sg: 'ἀρετήν',
        nom_pl: 'ἀρεταί',
        gen_pl: 'ἀρετῶν',
        dat_pl: 'ἀρεταῖς',
        acc_pl: 'ἀρετάς'
      },
      manuscripts: [
        { siglum: 'A', reading: 'ἀρετή', confidence: 95 },
        { siglum: 'B', reading: 'ἀρετά', confidence: 12 },
        { siglum: 'V', reading: 'ἀρετή', confidence: 88 },
        { siglum: 'P', reading: 'ἀρετήν', confidence: 45 }
      ],
      embeddings: [
        { word: 'καλοκἀγαθία', similarity: 0.89, x: 120, y: 80 },
        { word: 'σοφία', similarity: 0.82, x: 180, y: 120 },
        { word: 'δικαιοσύνη', similarity: 0.78, x: 220, y: 160 },
        { word: 'ἀνδρεία', similarity: 0.76, x: 100, y: 200 },
        { word: 'σωφροσύνη', similarity: 0.74, x: 280, y: 140 },
        { word: 'εὐδαιμονία', similarity: 0.71, x: 240, y: 100 },
        { word: 'φρόνησις', similarity: 0.69, x: 160, y: 240 }
      ],
      data: [
        {
          era: 'Archaic',
          period: '800-500 BCE',
          meaning: 'Battle excellence, prowess in war',
          evolution: 'Originally referred to any kind of excellence or effectiveness, especially in warfare. Heroes in Homer displayed arete through brave deeds and martial skill.',
          authors: ['Homer', 'Hesiod', 'Tyrtaeus'],
          confidence: 92,
          color: '#D97706',
          year: -800,
          position: 0,
          example: 'ἀνδρὸς ἀρετήν τε καὶ εὐκλείην',
          translation: 'the excellence and glory of a man',
          apparatus: 'ἀρετήν A V : ἀρετά B : ἀρετὰν P.Oxy. 1234',
          context: 'Homeric poetry, heroic ideals'
        },
        {
          era: 'Classical',
          period: '500-323 BCE',
          meaning: 'Moral excellence, ethical virtue',
          evolution: 'Transformed into moral and intellectual excellence. Plato divided it into four cardinal virtues: wisdom, courage, temperance, and justice. Aristotle refined it as the mean between extremes.',
          authors: ['Plato', 'Aristotle', 'Xenophon'],
          confidence: 95,
          color: '#F59E0B',
          year: -500,
          position: 1,
          example: 'ἀρετὴ ἐπιστήμη ἐστί',
          translation: 'virtue is knowledge',
          apparatus: 'ἐπιστήμη A B V : ἐπιστήμης Stobaeus',
          context: 'Socratic paradox, philosophical ethics'
        },
        {
          era: 'Hellenistic',
          period: '323-31 BCE',
          meaning: 'Philosophical virtue, wisdom',
          evolution: 'Became central to philosophical schools as practical wisdom for living well. Stoics emphasized virtue as the only true good, while Epicureans saw it as instrumental to happiness.',
          authors: ['Chrysippus', 'Epicurus', 'Cleanthes'],
          confidence: 88,
          color: '#3B82F6',
          year: -323,
          position: 2,
          example: 'μόνον τὸ καλὸν ἀγαθόν',
          translation: 'virtue alone is good',
          apparatus: 'καλὸν A : κάλλος B : om. V',
          context: 'Stoic doctrine, Hellenistic schools'
        },
        {
          era: 'Imperial',
          period: '31 BCE-284 CE',
          meaning: 'Civic virtue, public duty',
          evolution: 'Emphasized as civic responsibility and public service. Roman authors like Plutarch highlighted virtue in leadership and citizenship, while Marcus Aurelius stressed personal virtue in public life.',
          authors: ['Plutarch', 'Marcus Aurelius', 'Epictetus'],
          confidence: 85,
          color: '#DC2626',
          year: -31,
          position: 3,
          example: 'τῆς πολιτικῆς ἀρετῆς',
          translation: 'of civic virtue',
          apparatus: 'πολιτικῆς A B : πολιτειακῆς V',
          context: 'Roman imperial philosophy'
        },
        {
          era: 'Late Antique',
          period: '284-600 CE',
          meaning: 'Christian virtue, divine grace',
          evolution: 'Christianized as divine gift and moral perfection through grace. Church fathers integrated classical virtue ethics with Christian theology.',
          authors: ['John Chrysostom', 'Gregory Nazianzen', 'Basil'],
          confidence: 82,
          color: '#7C3AED',
          year: 284,
          position: 4,
          example: 'θεία ἀρετὴ καὶ χάρις',
          translation: 'divine virtue and grace',
          apparatus: 'θεία A : θεῖα B V : om. P',
          context: 'Patristic theology, Christian ethics'
        },
        {
          era: 'Byzantine',
          period: '600-1453 CE',
          meaning: 'Imperial virtue, orthodox piety',
          evolution: 'Synthesized into imperial ideology and orthodox Christian practice. Emphasized as both personal sanctity and imperial responsibility.',
          authors: ['Photius', 'Psellus', 'Gemistos Plethon'],
          confidence: 78,
          color: '#059669',
          year: 600,
          position: 5,
          example: 'βασιλικὴ ἀρετὴ καὶ εὐσέβεια',
          translation: 'imperial virtue and piety',
          apparatus: 'βασιλικὴ A B : βασιλική V',
          context: 'Byzantine imperial ideology'
        }
      ]
    }
  };

  const conceptData = concepts[selectedConcept as keyof typeof concepts];

  const handleEraClick = (index: number) => {
    setSelectedEra(index === selectedEra ? null : index);
  };

  const eraColors = {
    'Archaic': '#D97706',
    'Classical': '#F59E0B',
    'Hellenistic': '#3B82F6',
    'Imperial': '#DC2626',
    'Late Antique': '#7C3AED',
    'Byzantine': '#059669'
  };

  useEffect(() => {
    if (timelineRef.current && selectedEra !== null) {
      const eraElement = timelineRef.current.children[selectedEra] as HTMLElement;
      if (eraElement) {
        eraElement.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
          inline: 'center',
        });
      }
    }
  }, [selectedEra]);

  return (
    <div style={{ backgroundColor: '#0D0D0F', color: '#F5F4F2', fontFamily: 'sans-serif', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px', transition: 'background-color 0.3s, color 0.3s' }}>

      {/* Header Section */}
      <header style={{ width: '100%', maxWidth: '1200px', marginBottom: '20px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#F5F4F2', letterSpacing: '1px', textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}>
          Chronos: A Journey Through Meaning
        </h1>
        <p style={{ fontSize: '1.1rem', color: '#9CA3AF', marginTop: '10px' }}>
          Explore the evolving definitions of key concepts in ancient thought.
        </p>
      </header>

      {/* Main Content Area */}
      <main style={{ width: '100%', maxWidth: '1200px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

        {/* Concept Information Card */}
        <div style={{ backgroundColor: '#1E1E24', borderRadius: '12px', padding: '25px', marginBottom: '25px', width: '100%', boxShadow: '0 4px 8px rgba(0,0,0,0.3)', transition: 'background-color 0.3s, box-shadow 0.3s' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 'bold', color: '#F5F4F2', marginBottom: '10px' }}>{selectedConcept} ({conceptData.transliteration})</h2>
          <p style={{ color: '#9CA3AF', fontSize: '1rem', lineHeight: '1.6' }}>
            <strong>Modern Translation:</strong> {conceptData.modern}<br />
            <strong>LSJ Definition:</strong> {conceptData.lsj}
          </p>
        </div>

        {/* Timeline Visualization */}
        <div style={{ width: '100%', overflowX: 'auto', marginBottom: '30px', paddingBottom: '15px' }}>
          <div ref={timelineRef} style={{ display: 'flex', width: `${conceptData.data.length * 300}px`, alignItems: 'center', transition: 'width 0.3s' }}>
            {conceptData.data.map((eraData, index) => (
              <div
                key={index}
                style={{
                  width: '280px',
                  minWidth: '280px',
                  backgroundColor: '#1E1E24',
                  borderRadius: '12px',
                  padding: '20px',
                  marginRight: '20px',
                  cursor: 'pointer',
                  transition: 'transform 0.2s, box-shadow 0.2s, background-color 0.3s',
                  transform: selectedEra === index ? 'scale(1.05)' : 'scale(1)',
                  boxShadow: selectedEra === index ? '0 6px 12px rgba(0,0,0,0.4)' : '0 3px 6px rgba(0,0,0,0.3)',
                  border: selectedEra === index ? `2px solid ${eraData.color}` : 'none',
                }}
                onClick={() => handleEraClick(index)}
                onMouseEnter={() => setHoveredNode(index)}
                onMouseLeave={() => setHoveredNode(null)}
              >
                <h3 style={{ fontSize: '1.3rem', fontWeight: 'semibold', color: eraData.color, marginBottom: '8px', textShadow: '1px 1px 1px rgba(0,0,0,0.4)' }}>
                  {eraData.era} Era
                </h3>
                <p style={{ color: '#9CA3AF', fontSize: '0.9rem', lineHeight: '1.5' }}>
                  <strong>Period:</strong> {eraData.period}<br />
                  <strong>Meaning:</strong> {eraData.meaning}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Era Details (Conditional Rendering) */}
        {selectedEra !== null && (
          <div style={{ backgroundColor: '#141419', borderRadius: '12px', padding: '25px', width: '100%', maxWidth: '800px', boxShadow: '0 4px 8px rgba(0,0,0,0.4)', transition: 'background-color 0.3s, box-shadow 0.3s' }}>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 'bold', color: concepts[selectedConcept as keyof typeof concepts].data[selectedEra].color, marginBottom: '15px', textShadow: '1px 1px 1px rgba(0,0,0,0.5)' }}>
              {concepts[selectedConcept as keyof typeof concepts].data[selectedEra].era} Era Details
            </h2>
            <p style={{ color: '#F5F4F2', fontSize: '1rem', lineHeight: '1.7' }}>
              <strong>Evolution:</strong> {concepts[selectedConcept as keyof typeof concepts].data[selectedEra].evolution}<br /><br />
              <strong>Example:</strong> <span style={{ fontStyle: 'italic', color: '#C9A227' }}>{concepts[selectedConcept as keyof typeof concepts].data[selectedEra].example}</span><br />
              <strong>Translation:</strong> {concepts[selectedConcept as keyof typeof concepts].data[selectedEra].translation}<br /><br />
              <strong>Context:</strong> {concepts[selectedConcept as keyof typeof concepts].data[selectedEra].context}
            </p>
          </div>
        )}


        {/*Manuscript Apparatues*/}
        {showApparatus && (
          <div style={{ backgroundColor: '#141419', borderRadius: '12px', padding: '25px', width: '100%', maxWidth: '800px', boxShadow: '0 4px 8px rgba(0,0,0,0.4)', transition: 'background-color 0.3s, box-shadow 0.3s' }}>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 'bold', color: "#C9A227", marginBottom: '15px', textShadow: '1px 1px 1px rgba(0,0,0,0.5)' }}>
              Manuscript Apparatus
            </h2>
            {conceptData.manuscripts.map((manuscript, index) => (
              <div key={index} style={{ marginBottom: '10px', padding: '10px', borderRadius: '8px', backgroundColor: '#1E1E24' }}>
                <strong style={{ color: '#F5F4F2' }}>Siglum:</strong> {manuscript.siglum}<br />
                <strong style={{ color: '#F5F4F2' }}>Reading:</strong> {manuscript.reading}<br />
                <strong style={{ color: '#F5F4F2' }}>Confidence:</strong> {manuscript.confidence}%
              </div>
            ))}
          </div>
        )}


        {/*Toggle Apparatues*/}
        <button
          onClick={() => setShowApparatus(!showApparatus)}
          style={{
            backgroundColor: '#C9A227',
            color: '#0D0D0F',
            padding: '10px 20px',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: 'bold',
            marginTop: '20px',
            transition: 'background-color 0.3s',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
            ':hover': {
              backgroundColor: '#F5F4F2',
              color: '#C9A227',
            },
          }}
        >
          {showApparatus ? 'Hide Apparatus' : 'Show Apparatus'}
        </button>

      </main>

      {/* Footer Section */}
      <footer style={{ width: '100%', maxWidth: '1200px', marginTop: '40px', padding: '20px', borderTop: '1px solid #1E1E24', textAlign: 'center', color: '#6B7280', fontSize: '0.9rem' }}>
        <p>&copy; 2024 Logos Project. All rights reserved.</p>
      </footer>
    </div>
  );
}