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
          apparatus: 'εὐσέβεια A B : θεοσέβεια V',
          context: 'Byzantine imperial ideology'
        }
      ]
    }
  };

  const conceptData = concepts[selectedConcept as keyof typeof concepts];

  const handleEraClick = (index: number) => {
    setSelectedEra(index);
    setExpandedNode(index); // Automatically expand on click
  };

  const eraColors = {
    'Archaic': '#D97706',
    'Classical': '#F59E0B',
    'Hellenistic': '#3B82F6',
    'Imperial': '#DC2626',
    'Late Antique': '#7C3AED',
    'Byzantine': '#059669'
  };

  return (
    <div style={{ backgroundColor: '#0D0D0F', color: '#F5F4F2', minHeight: '100vh', fontFamily: 'sans-serif', padding: '20px', transition: 'background-color 0.3s ease' }}>
      <header style={{ marginBottom: '20px', borderBottom: '1px solid #1E1E24', paddingBottom: '10px' }}>
        <h1 style={{ fontSize: '2.5em', fontWeight: 'bold', color: '#C9A227', textShadow: '1px 1px 2px #000' }}>
          Chronos: A Visual Exploration of Concepts
        </h1>
        <p style={{ color: '#9CA3AF', fontStyle: 'italic' }}>
          Tracing the evolution of key concepts through ancient texts.
        </p>
      </header>

      <main style={{ display: 'flex', flexDirection: 'column' }}>
        <section style={{ marginBottom: '30px', backgroundColor: '#1E1E24', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)', transition: 'background-color 0.3s ease' }}>
          <h2 style={{ fontSize: '1.8em', color: '#F5F4F2', marginBottom: '15px' }}>
            Concept: <span style={{ color: '#C9A227' }}>{selectedConcept}</span> ({conceptData.transliteration})
          </h2>
          <p style={{ color: '#9CA3AF' }}>
            Modern Translation: {conceptData.modern}
          </p>
          <p style={{ color: '#9CA3AF' }}>
            {conceptData.lsj}
          </p>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>
            <button
              style={{
                backgroundColor: showApparatus ? '#6B7280' : '#3B82F6',
                color: '#F5F4F2',
                padding: '10px 15px',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                transition: 'background-color 0.3s ease',
                boxShadow: '0 1px 2px rgba(0, 0, 0, 0.3)'
              }}
              onClick={() => setShowApparatus(!showApparatus)}
            >
              {showApparatus ? 'Hide Apparatus' : 'Show Apparatus'}
            </button>

            <button
              style={{
                backgroundColor: showParadigm ? '#6B7280' : '#DC2626',
                color: '#F5F4F2',
                padding: '10px 15px',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                transition: 'background-color 0.3s ease',
                boxShadow: '0 1px 2px rgba(0, 0, 0, 0.3)'
              }}
              onClick={() => setShowParadigm(!showParadigm)}
            >
              {showParadigm ? 'Hide Paradigm' : 'Show Paradigm'}
            </button>

             <button
              style={{
                backgroundColor: embeddingView ? '#6B7280' : '#C9A227',
                color: '#0D0D0F',
                padding: '10px 15px',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                transition: 'background-color 0.3s ease',
                boxShadow: '0 1px 2px rgba(0, 0, 0, 0.3)'
              }}
              onClick={() => setEmbeddingView(!embeddingView)}
            >
              {embeddingView ? 'Hide Embeddings' : 'Show Embeddings'}
            </button>
          </div>


          {showParadigm && (
            <div style={{ marginTop: '20px', backgroundColor: '#141419', padding: '15px', borderRadius: '5px', color: '#F5F4F2' }}>
              <h3 style={{ fontSize: '1.2em', color: '#C9A227', marginBottom: '10px' }}>Paradigm</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={{ padding: '8px', borderBottom: '1px solid #6B7280', textAlign: 'left', color: '#9CA3AF' }}>Case</th>
                    <th style={{ padding: '8px', borderBottom: '1px solid #6B7280', textAlign: 'left', color: '#9CA3AF' }}>Singular</th>
                    <th style={{ padding: '8px', borderBottom: '1px solid #6B7280', textAlign: 'left', color: '#9CA3AF' }}>Plural</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ padding: '8px', borderBottom: '1px solid #6B7280', color: '#F5F4F2' }}>Nominative</td>
                    <td style={{ padding: '8px', borderBottom: '1px solid #6B7280', color: '#F5F4F2' }}>{conceptData.paradigm.nom_sg}</td>
                    <td style={{ padding: '8px', borderBottom: '1px solid #6B7280', color: '#F5F4F2' }}>{conceptData.paradigm.nom_pl}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '8px', borderBottom: '1px solid #6B7280', color: '#F5F4F2' }}>Genitive</td>
                    <td style={{ padding: '8px', borderBottom: '1px solid #6B7280', color: '#F5F4F2' }}>{conceptData.paradigm.gen_sg}</td>
                    <td style={{ padding: '8px', borderBottom: '1px solid #6B7280', color: '#F5F4F2' }}>{conceptData.paradigm.gen_pl}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '8px', borderBottom: '1px solid #6B7280', color: '#F5F4F2' }}>Dative</td>
                    <td style={{ padding: '8px', borderBottom: '1px solid #6B7280', color: '#F5F4F2' }}>{conceptData.paradigm.dat_sg}</td>
                    <td style={{ padding: '8px', borderBottom: '1px solid #6B7280', color: '#F5F4F2' }}>{conceptData.paradigm.dat_pl}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '8px', color: '#F5F4F2' }}>Accusative</td>
                    <td style={{ padding: '8px', color: '#F5F4F2' }}>{conceptData.paradigm.acc_sg}</td>
                    <td style={{ padding: '8px', color: '#F5F4F2' }}>{conceptData.paradigm.acc_pl}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

           {embeddingView && (
            <div style={{ marginTop: '20px', backgroundColor: '#141419', padding: '15px', borderRadius: '5px', color: '#F5F4F2', overflow: 'hidden' }}>
              <h3 style={{ fontSize: '1.2em', color: '#C9A227', marginBottom: '10px' }}>Semantic Embeddings</h3>
              <svg width="350" height="300">
                {conceptData.embeddings.map((embedding, index) => (
                  <g key={index}
                    onMouseEnter={() => setHoveredEmbedding(embedding.word)}
                    onMouseLeave={() => setHoveredEmbedding(null)}
                  >
                    <circle
                      cx={embedding.x}
                      cy={embedding.y}
                      r={7}
                      fill={hoveredEmbedding === embedding.word ? '#C9A227' : '#3B82F6'}
                      style={{ transition: 'fill 0.2s ease' }}
                    />
                    {hoveredEmbedding === embedding.word && (
                      <text x={embedding.x + 10} y={embedding.y + 5} fill="#F5F4F2" fontSize="0.8em">
                        {embedding.word} ({embedding.similarity.toFixed(2)})
                      </text>
                    )}
                  </g>
                ))}
              </svg>
            </div>
          )}
        </section>

        <section style={{ position: 'relative' }}>
          <div
            ref={timelineRef}
            style={{
              display: 'flex',
              overflowX: 'auto',
              paddingBottom: '15px',
              marginBottom: '20px',
            }}
          >
            {conceptData.data.map((eraData, index) => (
              <div
                key={index}
                style={{
                  flexShrink: 0,
                  width: '200px',
                  marginLeft: index > 0 ? '20px' : '0',
                  backgroundColor: selectedEra === index ? eraData.color : '#1E1E24',
                  color: '#F5F4F2',
                  borderRadius: '8px',
                  padding: '15px',
                  cursor: 'pointer',
                  transition: 'background-color 0.3s ease, transform 0.3s ease',
                  transform: selectedEra === index ? 'scale(1.05)' : 'scale(1)',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
                }}
                onClick={() => handleEraClick(index)}
                onMouseEnter={() => setHoveredNode(index)}
                onMouseLeave={() => setHoveredNode(null)}
              >
                <h3 style={{ fontSize: '1.2em', marginBottom: '5px', color: hoveredNode === index || selectedEra === index ? '#0D0D0F' : '#C9A227' }}>
                  {eraData.era}
                </h3>
                <p style={{ fontSize: '0.9em', color: '#9CA3AF' }}>{eraData.period}</p>
              </div>
            ))}
          </div>

          {selectedEra !== null && (
            <div style={{
              backgroundColor: '#141419',
              padding: '20px',
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
              transition: 'max-height 0.5s ease, opacity 0.3s ease',
              maxHeight: expandedNode === selectedEra ? '1000px' : '0',
              opacity: expandedNode === selectedEra ? 1 : 0,
              overflow: 'hidden'
            }}>
              <h3 style={{ fontSize: '1.5em', color: conceptData.data[selectedEra].color, marginBottom: '10px' }}>
                {conceptData.data[selectedEra].era} Era
              </h3>
              <p style={{ color: '#F5F4F2', marginBottom: '10px' }}>
                <span style={{ fontWeight: 'bold', color: '#C9A227' }}>Meaning:</span> {conceptData.data[selectedEra].meaning}
              </p>
              <p style={{ color: '#F5F4F2', marginBottom: '10px' }}>
                <span style={{ fontWeight: 'bold', color: '#C9A227' }}>Evolution:</span> {conceptData.data[selectedEra].evolution}
              </p>
              <p style={{ color: '#F5F4F2', marginBottom: '10px' }}>
                <span style={{ fontWeight: 'bold', color: '#C9A227' }}>Authors:</span> {conceptData.data[selectedEra].authors.join(', ')}
              </p>
              <p style={{ color: '#F5F4F2', marginBottom: '10px' }}>
                <span style={{ fontWeight: 'bold', color: '#C9A227' }}>Example:</span> {conceptData.data[selectedEra].example}
              </p>
              <p style={{ color: '#F5F4F2', marginBottom: '10px' }}>
                <span style={{ fontWeight: 'bold', color: '#C9A227' }}>Translation:</span> {conceptData.data[selectedEra].translation}
              </p>
              {showApparatus && (
                <p style={{ color: '#9CA3AF', fontStyle: 'italic', marginTop: '10px' }}>
                  <span style={{ fontWeight: 'bold', color: '#6B7280' }}>Apparatus:</span> {conceptData.data[selectedEra].apparatus}
                </p>
              )}
              <p style={{ color: '#9CA3AF' }}>
                <span style={{ fontWeight: 'bold', color: '#6B7280' }}>Context:</span> {conceptData.data[selectedEra].context}
              </p>
            </div>
          )}
        </section>
      </main>

      <footer style={{ marginTop: '30px', textAlign: 'center', color: '#6B7280', borderTop: '1px solid #1E1E24', paddingTop: '10px' }}>
        <p>
          &copy; 2024 Logos Professional Design System
        </p>
      </footer>
    </div>
  );
}