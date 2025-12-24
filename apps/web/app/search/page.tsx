'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';

const PASSAGES = [
  { id: 1, author: "Homer", work: "Iliad", book: "1.1-5", text: "Μῆνιν ἄειδε θεὰ Πηληϊάδεω Ἀχιλῆος οὐλομένην, ἣ μυρί᾽ Ἀχαιοῖς ἄλγε᾽ ἔθηκε", translation: "Sing, O goddess, the anger of Achilles son of Peleus, that brought countless ills upon the Achaeans", era: "archaic", language: "greek", topics: ["epic", "war", "heroism"], manuscript: "Venetus A", variants: ["Μῆνιν: μῆνις codd. alii", "οὐλομένην: ὀλομένην Zen.", "ἄλγε᾽: ἄλγεα rec."], lemma: ["Μῆνις", "ἄειδω", "θεός"], embeddings: [0.8, 0.6, 0.9], semanticDrift: ["wrath→anger", "sing→hymn"] },
  { id: 2, author: "Homer", work: "Odyssey", book: "1.1-4", text: "Ἄνδρα μοι ἔννεπε, μοῦσα, πολύτροπον, ὃς μάλα πολλὰ πλάγχθη", translation: "Tell me, O muse, of that ingenious hero who traveled far and wide after he had sacked Troy", era: "archaic", language: "greek", topics: ["epic", "journey", "heroism"], manuscript: "Laurentianus", variants: ["πολύτροπον: πολύφρονα sch.", "πλάγχθη: πλανήθη A"], lemma: ["ἀνήρ", "ἔννεπω", "πολύτροπος"], embeddings: [0.9, 0.7, 0.8], semanticDrift: ["man→hero", "tell→sing"] },
  { id: 3, author: "Plato", work: "Republic", book: "514a", text: "Μετὰ ταῦτα δή, εἶπον, ἀπείκασον τοιούτῳ πάθει τὴν ἡμετέραν φύσιν παιδείας τε πέρι καὶ ἀπαιδευσίας", translation: "Next, I said, compare our nature in respect of education and its lack to such an experience as this", era: "classical", language: "greek", topics: ["philosophy", "education", "allegory"], manuscript: "Parisinus gr. 1807", variants: ["ἀπείκασον: εἴκασον A", "πάθει: παθήματι B"], lemma: ["ἀπεικάζω", "φύσις", "παιδεία"], embeddings: [0.7, 0.8, 0.9], semanticDrift: ["nature→essence", "education→culture"] },
  { id: 4, author: "Plato", work: "Apology", book: "21d", text: "ἓν οἶδα ὅτι οὐδὲν οἶδα. τοῦτο γάρ που καὶ πρὸς τὸν θεὸν ἁμαρτάνειν ἂν εἴη", translation: "I know one thing: that I know nothing. For this would perhaps be sinning against the god", era: "classical", language: "greek", topics: ["philosophy", "wisdom", "knowledge"], manuscript: "Bodleianus", variants: ["οὐδὲν: οὐδέν τι B", "ἁμαρτάνειν: ἁμαρτεῖν T"], lemma: ["οἶδα", "οὐδείς", "θεός"], embeddings: [0.9, 0.6, 0.7], semanticDrift: ["know→understand", "god→divine"] },
  { id: 5, author: "Aristotle", work: "Nicomachean Ethics", book: "1094a", text: "Πᾶσα τέχνη καὶ πᾶσα μέθοδος, ὁμοίως δὲ πρᾶξίς τε καὶ προαίρεσις, ἀγαθοῦ τινὸς ἐφίεσθαι δοκεῖ", translation: "Every art and every inquiry, and similarly every action and pursuit, is thought to aim at some good", era: "classical", language: "greek", topics: ["philosophy", "ethics", "virtue"], manuscript: "Laurentianus", variants: ["ὁμοίως: ὁμοίως om. K", "ἐφίεσθαι: ἐφιέμενα L"], lemma: ["τέχνη", "μέθοδος", "ἀγαθός"], embeddings: [0.8, 0.7, 0.9], semanticDrift: ["art→skill", "good→virtue"] },
  { id: 6, author: "Virgil", work: "Aeneid", book: "1.1-4", text: "Arma virumque cano, Troiae qui primus ab oris Italiam, fato profugus, Laviniaque venit litora", translation: "I sing of arms and the man, who first from the shores of Troy, exiled by fate, came to Italy and the Lavinian shores", era: "imperial", language: "latin", topics: ["epic", "war", "founding"], manuscript: "Mediceus", variants: ["Laviniaque: Lavinia quoque γ", "profugus: perfugus P"], lemma: ["arma", "vir", "cano"], embeddings: [0.9, 0.8, 0.7], semanticDrift: ["arms→warfare", "man→hero"] },
  { id: 7, author: "Cicero", work: "In Catilinam", book: "1.1", text: "Quo usque tandem abutere, Catilina, patientia nostra? quam diu etiam furor iste tuus nos eludet?", translation: "How long, O Catiline, will you abuse our patience? How long will that frenzy of yours mock us?", era: "imperial", language: "latin", topics: ["rhetoric", "politics", "oratory"], manuscript: "Palatinus", variants: ["abutere: abuteris P", "furor: fervor F"], lemma: ["abutor", "patientia", "furor"], embeddings: [0.7, 0.6, 0.8], semanticDrift: ["abuse→misuse", "patience→tolerance"] },
  { id: 8, author: "Seneca", work: "Epistulae", book: "1.1", text: "Ita fac, mi Lucili: vindica te tibi, et tempus quod adhuc aut auferebatur aut subripiebatur aut excidebat collige et serva", translation: "Do this, my dear Lucilius: claim yourself for yourself, and time that has until now been taken away, stolen, or lost, gather and preserve", era: "imperial", language: "latin", topics: ["philosophy", "stoicism", "ethics"], manuscript: "Quirinianus", variants: ["adhuc: ad huc Q", "serva: conserva C"], lemma: ["vindico", "tempus", "colligo"], embeddings: [0.8, 0.9, 0.7], semanticDrift: ["claim→assert", "time→moment"] },
  { id: 9, author: "Augustine", work: "Confessiones", book: "1.1", text: "Magnus es, Domine, et laudabilis valde: magna virtus tua, et sapientiae tuae non est numerus", translation: "Great are you, O Lord, and greatly to be praised; great is your power, and of your wisdom there is no measure", era: "lateAntique", language: "latin", topics: ["theology", "confession", "Christianity"], manuscript: "Sessorianus", variants: ["laudabilis: laudandus S", "numerus: terminus T"], lemma: ["magnus", "virtus", "sapientia"], embeddings: [0.9, 0.8, 0.9], semanticDrift: ["great→magnificent", "wisdom→knowledge"] },
  { id: 10, author: "Sophocles", work: "Antigone", book: "332", text: "Πολλὰ τὰ δεινὰ κοὐδὲν ἀνθρώπου δεινότερον πέλει. τοῦτο καὶ πολιοῦ πέραν πόντου", translation: "Many wonders there are, but none more wondrous than man. This being crosses even the gray sea", era: "classical", language: "greek", topics: ["tragedy", "human nature", "wonder"], manuscript: "Laurentianus", variants: ["δεινὰ: δεινότερα L", "πέλει: ἔφυ Brunck"], lemma: ["πολύς", "δεινός", "ἄνθρωπος"], embeddings: [0.6, 0.9, 0.8], semanticDrift: ["wonder→terrible", "man→mortal"] },
  { id: 11, author: "Euripides", work: "Medea", book: "214", text: "ἀλλ᾽ οὐ ταὐτὸν ἀνδράσιν τε καὶ γυναιξὶ κεῖται νόμος", translation: "But the same law does not apply to men and women", era: "classical", language: "greek", topics: ["tragedy", "law", "gender"], manuscript: "Mediceus", variants: ["ταὐτὸν: τὸ αὐτὸ M", "κεῖται: τίθεται K"], lemma: ["ταὐτόν", "ἀνήρ", "νόμος"], embeddings: [0.7, 0.8, 0.6], semanticDrift: ["same→equal", "law→custom"] }
];

const ERA_COLORS = {
  archaic: '#D97706',
  classical: '#F59E0B',
  hellenistic: '#3B82F6',
  imperial: '#DC2626',
  lateAntique: '#7C3AED',
  byzantine: '#059669'
};

const LANGUAGE_COLORS = {
  greek: '#3B82F6',
  latin: '#DC2626'
};

export default function TextualVisualization() {
  const [activeView, setActiveView] = useState('semantic');
  const [selectedEras, setSelectedEras] = useState(new Set(Object.keys(ERA_COLORS)));
  const [selectedLanguages, setSelectedLanguages] = useState(new Set(['greek', 'latin']));
  const [hoveredPassage, setHoveredPassage] = useState(null);
  const [animationPhase, setAnimationPhase] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationPhase(prev => (prev + 1) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const filteredPassages = useMemo(() => {
    return PASSAGES.filter(p => 
      selectedEras.has(p.era) && selectedLanguages.has(p.language)
    );
  }, [selectedEras, selectedLanguages]);

  const toggleEra = useCallback((era) => {
    setSelectedEras(prev => {
      const next = new Set(prev);
      if (next.has(era)) {
        next.delete(era);
      } else {
        next.add(era);
      }
      return next;
    });
  }, []);

  const toggleLanguage = useCallback((lang) => {
    setSelectedLanguages(prev => {
      const next = new Set(prev);
      if (next.has(lang)) {
        next.delete(lang);
      } else {
        next.add(lang);
      }
      return next;
    });
  }, []);

  const SemanticSpaceVisualization = () => {
    const maxEmbedding = Math.max(...filteredPassages.flatMap(p => p.embeddings));
    
    return (
      <div style={{ 
        position: 'relative', 
        width: '100%', 
        height: '600px',
        background: 'radial-gradient(circle at 50% 50%, #1E1E24 0%, #0D0D0F 100%)',
        borderRadius: '12px',
        border: '1px solid #C9A227',
        overflow: 'hidden'
      }}>
        {/* Animated background grid */}
        <svg 
          style={{ position: 'absolute', width: '100%', height: '100%', opacity: 0.1 }}
          viewBox="0 0 100 100"
        >
          <defs>
            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path 
                d="M 10 0 L 0 0 0 10" 
                fill="none" 
                stroke="#C9A227" 
                strokeWidth="0.5"
                opacity={0.3 + 0.2 * Math.sin(animationPhase * Math.PI / 180)}
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>

        {/* Semantic space nodes */}
        {filteredPassages.map((passage, index) => {
          const x = 100 + (passage.embeddings[0] / maxEmbedding) * 700;
          const y = 100 + (passage.embeddings[1] / maxEmbedding) * 400;
          const size = 8 + (passage.embeddings[2] / maxEmbedding) * 20;
          const pulseScale = 1 + 0.1 * Math.sin((animationPhase + index * 30) * Math.PI / 180);
          
          return (
            <div
              key={passage.id}
              style={{
                position: 'absolute',
                left: `${x}px`,
                top: `${y}px`,
                width: `${size * pulseScale}px`,
                height: `${size * pulseScale}px`,
                backgroundColor: ERA_COLORS[passage.era],
                borderRadius: '50%',
                border: `2px solid ${LANGUAGE_COLORS[passage.language]}`,
                cursor: 'pointer',
                transform: 'translate(-50%, -50%)',
                transition: 'all 0.3s ease',
                boxShadow: hoveredPassage === passage.id 
                  ? `0 0 20px ${ERA_COLORS[passage.era]}80`
                  : `0 0 10px ${ERA_COLORS[passage.era]}40`,
                zIndex: hoveredPassage === passage.id ? 10 : 1
              }}
              onMouseEnter={() => setHoveredPassage(passage.id)}
              onMouseLeave={() => setHoveredPassage(null)}
            >
              {/* Ripple effect */}
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: '200%',
                height: '200%',
                borderRadius: '50%',
                border: `1px solid ${ERA_COLORS[passage.era]}`,
                transform: 'translate(-50%, -50%)',
                opacity: hoveredPassage === passage.id ? 0.6 : 0,
                animation: hoveredPassage === passage.id ? 'ripple 1s infinite' : 'none'
              }} />
            </div>
          );
        })}

        {/* Connection lines between similar passages */}
        <svg style={{ position: 'absolute', width: '100%', height: '100%', pointerEvents: 'none' }}>
          {filteredPassages.map((p1, i) => 
            filteredPassages.slice(i + 1).map((p2, j) => {
              const similarity = p1.topics.filter(t => p2.topics.includes(t)).length / 
                                Math.max(p1.topics.length, p2.topics.length);
              if (similarity < 0.3) return null;
              
              const x1 = 100 + (p1.embeddings[0] / Math.max(...filteredPassages.flatMap(p => p.embeddings))) * 700;
              const y1 = 100 + (p1.embeddings[1] / Math.max(...filteredPassages.flatMap(p => p.embeddings))) * 400;
              const x2 = 100 + (p2.embeddings[0] / Math.max(...filteredPassages.flatMap(p => p.embeddings))) * 700;
              const y2 = 100 + (p2.embeddings[1] / Math.max(...filteredPassages.flatMap(p => p.embeddings))) * 400;
              
              return (
                <line
                  key={`${p1.id}-${p2.id}`}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="#C9A227"
                  strokeWidth={similarity * 3}
                  opacity={0.2 + similarity * 0.3}
                  strokeDasharray={`${similarity * 10},${(1-similarity) * 10}`}
                />
              );
            })
          )}
        </svg>

        {/* Hover tooltip */}
        {hoveredPassage && (
          <div style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            backgroundColor: '#1E1E24',
            border: '1px solid #C9A227',
            borderRadius: '8px',
            padding: '16px',
            maxWidth: '300px',
            zIndex: 20,
            boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
          }}>
            {(() => {
              const passage = filteredPassages.find(p => p.id === hoveredPassage);
              return (
                <>
                  <div style={{ 
                    color: '#C9A227', 
                    fontWeight: '600', 
                    fontSize: '14px', 
                    marginBottom: '8px' 
                  }}>
                    {passage.author} - {passage.work}
                  </div>
                  <div style={{ 
                    color: '#F5F4F2', 
                    fontSize: '12px', 
                    fontFamily: 'Georgia, serif',
                    marginBottom: '8px',
                    lineHeight: '1.4'
                  }}>
                    {passage.text.slice(0, 100)}...
                  </div>
                  <div style={{ 
                    color: '#9CA3AF', 
                    fontSize: '11px',
                    marginBottom: '8px'
                  }}>
                    {passage.translation.slice(0, 100)}...
                  </div>
                  <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                    {passage.topics.map(topic => (
                      <span
                        key={topic}
                        style={{
                          backgroundColor: ERA_COLORS[passage.era],
                          color: '#F5F4F2',
                          fontSize: '10px',
                          padding: '2px 6px',
                          borderRadius: '4px'
                        }}
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </>
              );
            })()}
          </div>
        )}
      </div>
    );
  };

  const TemporalEvolutionVisualization = () => {
    const eraOrder = ['archaic', 'classical', 'hellenistic', 'imperial', 'lateAntique', 'byzantine'];
    const eraData = eraOrder.map(era => ({
      era,
      passages: filteredPassages.filter(p => p.era === era),
      count: filteredPassages.filter(p => p.era === era).length
    }));
    
    const maxCount = Math.max(...eraData.map(e => e.count));
    
    return (
      <div style={{ 
        position: 'relative', 
        width: '100%', 
        height: '600px',
        background: 'linear-gradient(135deg, #0D0D0F 0%, #1E1E24 100%)',
        borderRadius: '12px',
        border: '1px solid #C9A227',
        padding: '40px'
      }}>
        <svg width="100%" height="100%" style={{ overflow: 'visible' }}>
          {/* Timeline base */}
          <line
            x1="50"
            y1="400"
            x2="750"
            y2="400"
            stroke="#C9A227"
            strokeWidth="3"
          />
          
          {/* Era segments */}
          {eraData.map((era, index) => {
            const x = 50 + (index * 700 / (eraData.length - 1));
            const height = (era.count / maxCount) * 300;
            const animatedHeight = height * (0.5 + 0.5 * Math.sin((animationPhase + index * 45) * Math.PI / 180));
            
            return (
              <g key={era.era}>
                {/* Era column */}
                <rect
                  x={x - 20}
                  y={400 - animatedHeight}
                  width="40"
                  height={animatedHeight}
                  fill={ERA_COLORS[era.era]}
                  opacity="0.7"
                  rx="4"
                />
                
                {/* Era label */}
                <text
                  x={x}
                  y="430"
                  textAnchor="middle"
                  fill="#F5F4F2"
                  fontSize="12"
                  fontWeight="600"
                >
                  {era.era.charAt(0).toUpperCase() + era.era.slice(1)}
                </text>
                
                {/* Count label */}
                <text
                  x={x}
                  y={400 - animatedHeight - 10}
                  textAnchor="middle"
                  fill="#C9A227"
                  fontSize="14"
                  fontWeight="bold"
                >
                  {era.count}
                </text>
                
                {/* Individual passage dots */}
                {era.passages.map((passage, pIndex) => {
                  const dotY = 400 - (pIndex * (animatedHeight / era.count));
                  const dotScale = 1 + 0.3 * Math.sin((animationPhase + pIndex * 60) * Math.PI / 180);
                  
                  return (
                    <circle
                      key={passage.id}
                      cx={x + (Math.random() - 0.5) * 30}
                      cy={dotY}
                      r={4 * dotScale}
                      fill={LANGUAGE_COLORS[passage.language]}
                      opacity="0.8"
                      style={{ cursor: 'pointer' }}
                      onMouseEnter={() => setHoveredPassage(passage.id)}
                      onMouseLeave={() => setHoveredPassage(null)}
                    />
                  );
                })}
              </g>
            );
          })}
          
          {/* Flowing connections between eras */}
          {eraData.slice(0, -1).map((era, index) => {
            const x1 = 50 + (index * 700 / (eraData.length - 1));
            const x2 = 50 + ((index + 1) * 700 / (eraData.length - 1));
            const curve = 50 * Math.sin((animationPhase + index * 90) * Math.PI / 180);
            
            return (
              <path
                key={`flow-${index}`}
                d={`M ${x1} 400 Q ${(x1 + x2) / 2} ${400 + curve} ${x2} 400`}
                fill="none"
                stroke="#C9A227"
                strokeWidth="2"
                opacity="0.4"
                strokeDasharray="5,5"
                strokeDashoffset={-animationPhase / 10}
              />
            );
          })}
        </svg>
      </div>
    );
  };

  const NetworkVisualization = () => {
    const nodes = filteredPassages.map((passage, index) => ({
      ...passage,
      x: 400 + 300 * Math.cos((index * 2 * Math.PI) / filteredPassages.length + animationPhase * Math.PI / 180),
      y: 300 + 200 * Math.sin((index * 2 * Math.PI) / filteredPassages.length + animationPhase * Math.PI / 180)
    }));
    
    return (
      <div style={{ 
        position: 'relative', 
        width: '100%', 
        height: '600px',
        background: 'radial-gradient(circle at center, #1E1E24 0%, #0D0D0F 100%)',
        borderRadius: '12px',
        border: '1px solid #C9A227',
        overflow: 'hidden'
      }}>
        <svg width="100%" height="100%">
          {/* Connection web */}
          {nodes.map((n1, i) => 
            nodes.slice(i + 1).map((n2, j) => {
              const sharedTopics = n1.topics.filter(t => n2.topics.includes(t)).length;
              if (sharedTopics === 0) return null;
              
              const distance = Math.sqrt((n1.x - n2.x) ** 2 + (n1.y - n2.y) ** 2);
              const opacity = Math.max(0.1, (sharedTopics / 3) * (500 / distance));
              
              return (
                <line
                  key={`${n1.id}-${n2.id}`}
                  x1={n1.x}
                  y1={n1.y}
                  x2={n2.x}
                  y2={n2.y}
                  stroke="#C9A227"
                  strokeWidth={sharedTopics}
                  opacity={opacity}
                />
              );
            })
          )}
          
          {/* Author clusters */}
          {nodes.map((node, index) => {
            const pulseRadius = 15 + 5 * Math.sin((animationPhase + index * 45) * Math.PI / 180);
            
            return (
              <g key={node.id}>
                {/* Outer pulse ring */}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={pulseRadius}
                  fill="none"
                  stroke={ERA_COLORS[node.era]}
                  strokeWidth="2"
                  opacity="0.3"
                />
                
                {/* Main node */}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r="12"
                  fill={ERA_COLORS[node.era]}
                  stroke={LANGUAGE_COLORS[node.language]}
                  strokeWidth="3"
                  style={{ cursor: 'pointer' }}
                  onMouseEnter={() => setHoveredPassage(node.id)}
                  onMouseLeave={() => setHoveredPassage(null)}
                />
                
                {/* Author label */}
                <text
                  x={node.x}
                  y={node.y - 25}
                  textAnchor="middle"
                  fill="#F5F4F2"
                  fontSize="10"
                  fontWeight="600"
                >
                  {node.author}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    );
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#0D0D0F', 
      color: '#F5F4F2',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #1E1E24 0%, #141419 100%)',
        borderBottom: '2px solid #C9A227',
        padding: '24px 0'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
            <div style={{
              width: '48px',
              height: '48px',
              backgroundColor: '#C9A227',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#0D0D0F'
            }}>
              📊
            </div>
            <div>
              <h1 style={{ 
                fontSize: '32px', 
                fontWeight: '700', 
                margin: '0',
                background: 'linear-gradient(135deg, #C9A227, #F5F4F2)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent'
              }}>
                Classical Text Analytics
              </h1>
              <p style={{ 
                color: '#9CA3AF', 
                margin: '4px 0 0 0',
                fontSize: '16px'
              }}>
                Interactive visualization of ancient Greek and Latin textual data
              </p>
            </div>
          </div>

          {/* View Controls */}
          <div style={{ display: 'flex', gap: '8px' }}>
            {[
              { id: 'semantic', label: 'Semantic Space', icon: '🌌' },
              { id: 'temporal', label