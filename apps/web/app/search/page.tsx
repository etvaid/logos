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
  { id: 11, author: "Euripides", work: "Medea", book: "214", text: "ἀλλ᾽ οὐ ταὐτὸν ἀνδράσιν τε καὶ γυναιξὶ κεῖται νόμος", translation: "But the same law does not apply to men and women", era: "classical", language: "greek", topics: ["tragedy", "gender", "law"], manuscript: "Marcianus", variants: ["ταὐτὸν: τὸ αὐτὸν M", "κεῖται: τίθεται rec."], lemma: ["ἀνήρ", "γυνή", "νόμος"], embeddings: [0.7, 0.8, 0.6], semanticDrift: ["law→custom", "same→equal"] },
  { id: 12, author: "Tacitus", work: "Annales", book: "1.1", text: "Urbem Romam a principio reges habuere; libertatem et consulatum L. Brutus instituit", translation: "The city of Rome from the beginning was ruled by kings; liberty and the consulship were established by L. Brutus", era: "imperial", language: "latin", topics: ["history", "politics", "liberty"], manuscript: "Mediceus", variants: ["habuere: habuerunt M", "instituit: constituit C"], lemma: ["urbs", "rex", "libertas"], embeddings: [0.8, 0.7, 0.9], semanticDrift: ["king→ruler", "liberty→freedom"] }
];

const ERA_COLORS = {
  archaic: '#D97706',
  classical: '#F59E0B',
  hellenistic: '#3B82F6',
  imperial: '#DC2626',
  lateAntique: '#7C3AED',
  byzantine: '#059669'
};

const TOPIC_COLORS = {
  epic: '#C9A227',
  philosophy: '#3B82F6',
  tragedy: '#7C3AED',
  rhetoric: '#DC2626',
  history: '#059669',
  theology: '#D97706',
  war: '#DC2626',
  ethics: '#3B82F6',
  oratory: '#F59E0B',
  stoicism: '#6B7280'
};

export default function DataVisualization() {
  const [selectedPassage, setSelectedPassage] = useState(null);
  const [viewMode, setViewMode] = useState('timeline');
  const [filterEra, setFilterEra] = useState('all');
  const [filterLanguage, setFilterLanguage] = useState('all');
  const [hoveredNode, setHoveredNode] = useState(null);
  const [animationFrame, setAnimationFrame] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationFrame(prev => (prev + 1) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const filteredPassages = useMemo(() => {
    return PASSAGES.filter(passage => {
      const eraMatch = filterEra === 'all' || passage.era === filterEra;
      const langMatch = filterLanguage === 'all' || passage.language === filterLanguage;
      return eraMatch && langMatch;
    });
  }, [filterEra, filterLanguage]);

  const timelineData = useMemo(() => {
    const eraOrder = ['archaic', 'classical', 'hellenistic', 'imperial', 'lateAntique', 'byzantine'];
    return eraOrder.map((era, index) => ({
      era,
      passages: filteredPassages.filter(p => p.era === era),
      x: (index * 160) + 80,
      color: ERA_COLORS[era]
    }));
  }, [filteredPassages]);

  const semanticNetwork = useMemo(() => {
    const nodes = [];
    const edges = [];
    
    filteredPassages.forEach((passage, i) => {
      const angle = (i / filteredPassages.length) * 2 * Math.PI;
      const radius = 200 + Math.sin(animationFrame * 0.01 + i) * 20;
      nodes.push({
        id: passage.id,
        x: 300 + Math.cos(angle) * radius,
        y: 300 + Math.sin(angle) * radius,
        passage,
        embedding: passage.embeddings[0] || 0.5
      });
      
      // Create edges based on topic similarity
      filteredPassages.forEach((other, j) => {
        if (i < j) {
          const commonTopics = passage.topics.filter(t => other.topics.includes(t)).length;
          if (commonTopics > 0) {
            edges.push({
              from: passage.id,
              to: other.id,
              strength: commonTopics / Math.max(passage.topics.length, other.topics.length),
              opacity: 0.3 + (commonTopics * 0.3)
            });
          }
        }
      });
    });
    
    return { nodes, edges };
  }, [filteredPassages, animationFrame]);

  const renderTimeline = () => (
    <div style={{ 
      width: '100%', 
      height: '600px', 
      position: 'relative',
      background: 'linear-gradient(135deg, #1E1E24 0%, #141419 100%)',
      borderRadius: '12px',
      overflow: 'hidden',
      border: '1px solid #C9A227'
    }}>
      <svg width="100%" height="100%" style={{ position: 'absolute' }}>
        {/* Timeline axis */}
        <line
          x1="50"
          y1="300"
          x2="950"
          y2="300"
          stroke="#C9A227"
          strokeWidth="3"
          style={{
            filter: 'drop-shadow(0 0 6px #C9A227)',
            animation: `pulse 2s ease-in-out infinite`
          }}
        />
        
        {/* Era markers */}
        {timelineData.map((era, index) => (
          <g key={era.era}>
            <circle
              cx={era.x}
              cy="300"
              r="8"
              fill={era.color}
              stroke="#F5F4F2"
              strokeWidth="2"
              style={{
                filter: `drop-shadow(0 0 8px ${era.color})`,
                transform: `scale(${hoveredNode === era.era ? 1.5 : 1})`,
                transition: 'transform 0.2s ease'
              }}
              onMouseEnter={() => setHoveredNode(era.era)}
              onMouseLeave={() => setHoveredNode(null)}
            />
            
            {/* Era label */}
            <text
              x={era.x}
              y="280"
              textAnchor="middle"
              style={{
                fill: '#F5F4F2',
                fontSize: '12px',
                fontWeight: 'bold',
                textTransform: 'capitalize'
              }}
            >
              {era.era}
            </text>
            
            {/* Passages for this era */}
            {era.passages.map((passage, pIndex) => (
              <g key={passage.id}>
                <circle
                  cx={era.x + (pIndex - era.passages.length/2 + 0.5) * 25}
                  cy="350"
                  r="6"
                  fill={passage.language === 'greek' ? '#3B82F6' : '#DC2626'}
                  stroke="#F5F4F2"
                  strokeWidth="1"
                  style={{
                    cursor: 'pointer',
                    filter: `drop-shadow(0 0 4px ${passage.language === 'greek' ? '#3B82F6' : '#DC2626'})`,
                    transform: `scale(${selectedPassage?.id === passage.id ? 1.3 : 1})`,
                    transition: 'transform 0.2s ease'
                  }}
                  onClick={() => setSelectedPassage(passage)}
                />
                
                {/* Connection line */}
                <line
                  x1={era.x}
                  y1="308"
                  x2={era.x + (pIndex - era.passages.length/2 + 0.5) * 25}
                  y2="344"
                  stroke={era.color}
                  strokeWidth="1"
                  opacity="0.5"
                />
              </g>
            ))}
          </g>
        ))}
      </svg>
      
      {/* Floating info panel */}
      {hoveredNode && (
        <div style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          background: 'rgba(13, 13, 15, 0.95)',
          border: `1px solid ${ERA_COLORS[hoveredNode]}`,
          borderRadius: '8px',
          padding: '16px',
          color: '#F5F4F2',
          backdropFilter: 'blur(10px)',
          boxShadow: `0 8px 32px rgba(0, 0, 0, 0.3), 0 0 16px ${ERA_COLORS[hoveredNode]}30`
        }}>
          <div style={{ fontSize: '14px', fontWeight: 'bold', color: ERA_COLORS[hoveredNode], textTransform: 'capitalize' }}>
            {hoveredNode} Period
          </div>
          <div style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '4px' }}>
            {timelineData.find(e => e.era === hoveredNode)?.passages.length || 0} passages
          </div>
        </div>
      )}
    </div>
  );

  const renderSemanticNetwork = () => (
    <div style={{ 
      width: '100%', 
      height: '600px', 
      position: 'relative',
      background: 'radial-gradient(circle at center, #1E1E24 0%, #0D0D0F 100%)',
      borderRadius: '12px',
      overflow: 'hidden',
      border: '1px solid #C9A227'
    }}>
      <svg width="100%" height="100%" style={{ position: 'absolute' }}>
        {/* Background grid */}
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1E1E24" strokeWidth="1" opacity="0.3"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
        
        {/* Edges */}
        {semanticNetwork.edges.map((edge, index) => {
          const fromNode = semanticNetwork.nodes.find(n => n.id === edge.from);
          const toNode = semanticNetwork.nodes.find(n => n.id === edge.to);
          if (!fromNode || !toNode) return null;
          
          return (
            <line
              key={index}
              x1={fromNode.x}
              y1={fromNode.y}
              x2={toNode.x}
              y2={toNode.y}
              stroke="#C9A227"
              strokeWidth={edge.strength * 3}
              opacity={edge.opacity}
              style={{
                filter: 'drop-shadow(0 0 2px #C9A227)',
                animation: `pulse ${2 + edge.strength}s ease-in-out infinite`
              }}
            />
          );
        })}
        
        {/* Nodes */}
        {semanticNetwork.nodes.map((node, index) => {
          const pulse = Math.sin(animationFrame * 0.05 + index * 0.5) * 0.2 + 1;
          return (
            <g key={node.id}>
              {/* Outer glow */}
              <circle
                cx={node.x}
                cy={node.y}
                r={15 * pulse}
                fill={ERA_COLORS[node.passage.era]}
                opacity="0.1"
              />
              
              {/* Main node */}
              <circle
                cx={node.x}
                cy={node.y}
                r={8 + node.embedding * 6}
                fill={node.passage.language === 'greek' ? '#3B82F6' : '#DC2626'}
                stroke={ERA_COLORS[node.passage.era]}
                strokeWidth="2"
                style={{
                  cursor: 'pointer',
                  filter: `drop-shadow(0 0 8px ${ERA_COLORS[node.passage.era]})`,
                  transform: `scale(${selectedPassage?.id === node.id ? 1.5 : hoveredNode === node.id ? 1.2 : 1})`,
                  transition: 'transform 0.3s ease'
                }}
                onClick={() => setSelectedPassage(node.passage)}
                onMouseEnter={() => setHoveredNode(node.id)}
                onMouseLeave={() => setHoveredNode(null)}
              />
              
              {/* Language indicator */}
              <text
                x={node.x}
                y={node.y + 2}
                textAnchor="middle"
                style={{
                  fill: '#F5F4F2',
                  fontSize: '8px',
                  fontWeight: 'bold',
                  pointerEvents: 'none'
                }}
              >
                {node.passage.language === 'greek' ? 'Α' : 'L'}
              </text>
              
              {/* Author label on hover */}
              {hoveredNode === node.id && (
                <text
                  x={node.x}
                  y={node.y - 20}
                  textAnchor="middle"
                  style={{
                    fill: '#F5F4F2',
                    fontSize: '10px',
                    fontWeight: 'bold',
                    textShadow: '0 0 4px rgba(0,0,0,0.8)'
                  }}
                >
                  {node.passage.author}
                </text>
              )}
            </g>
          );
        })}
      </svg>
      
      {/* Network stats */}
      <div style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        background: 'rgba(13, 13, 15, 0.9)',
        border: '1px solid #C9A227',
        borderRadius: '8px',
        padding: '12px',
        color: '#F5F4F2',
        fontSize: '12px'
      }}>
        <div style={{ color: '#C9A227', fontWeight: 'bold' }}>Network Stats</div>
        <div style={{ marginTop: '4px' }}>Nodes: {semanticNetwork.nodes.length}</div>
        <div>Edges: {semanticNetwork.edges.length}</div>
        <div>Density: {(semanticNetwork.edges.length / (semanticNetwork.nodes.length * (semanticNetwork.nodes.length - 1) / 2) * 100).toFixed(1)}%</div>
      </div>
    </div>
  );

  const renderTopicClusters = () => {
    const topics = [...new Set(filteredPassages.flatMap(p => p.topics))];
    const topicData = topics.map((topic, index) => {
      const passages = filteredPassages.filter(p => p.topics.includes(topic));
      const angle = (index / topics.length) * 2 * Math.PI;
      const radius = 180 + Math.sin(animationFrame * 0.02 + index) * 30;
      
      return {
        topic,
        passages,
        x: 400 + Math.cos(angle) * radius,
        y: 250 + Math.sin(angle) * radius,
        size: Math.sqrt(passages.length) * 20,
        color: TOPIC_COLORS[topic] || '#9CA3AF'
      };
    });

    return (
      <div style={{ 
        width: '100%', 
        height: '500px', 
        position: 'relative',
        background: 'conic-gradient(from 0deg, #1E1E24, #141419, #1E1E24)',
        borderRadius: '12px',
        overflow: 'hidden',
        border: '1px solid #C9A227'
      }}>
        <svg width="100%" height="100%" style={{ position: 'absolute' }}>
          {/* Topic clusters */}
          {topicData.map((cluster, index) => (
            <g key={cluster.topic}>
              {/* Cluster background */}
              <circle
                cx={cluster.x}
                cy={cluster.y}
                r={cluster.size + 10}
                fill={cluster.color}
                opacity="0.1"
                style={{
                  animation: `pulse ${3 + index * 0.5}s ease-in-out infinite`
                }}
              />
              
              {/* Main cluster node */}
              <circle
                cx={cluster.x}
                cy={cluster.y}
                r={cluster.size}
                fill={cluster.color}
                stroke="#F5F4F2"
                strokeWidth="2"
                opacity="0.8"
                style={{
                  cursor: 'pointer',
                  filter: `drop-shadow(0 0 12px ${cluster.color})`,
                  transform: `scale(${hoveredNode === cluster.topic ? 1.2 : 1})`,
                  transition: 'transform 0.3s ease'
                }}
                onMouseEnter={() => setHoveredNode(cluster.topic)}
                onMouseLeave={() => setHoveredNode(null)}
              />
              
              {/* Topic label */}
              <text
                x={cluster.x}
                y={cluster.y + 4}
                textAnchor="middle"
                style={{
                  fill: '#F5F4F2',
                  fontSize: '11px',
                  fontWeight: 'bold',
                  textTransform: 'capitalize',
                  pointerEvents: 'none',
                  textShadow: '0 0 4px rgba(0,0,0,0.8)'
                }}
              >
                {cluster.topic}
              </text>
              
              {/* Passage count */}
              <text
                x={cluster.x}
                y={cluster.y + cluster.size + 20}
                textAnchor="middle"
                style={{
                  fill: '#9CA3AF',
                  fontSize: '9px',
                  pointerEvents: 'none'
                }}
              >
                {cluster.passages.length} passages
              </text>
              
              {/* Individual passages around cluster */}
              {cluster.passages.slice(0, 8).map((passage, pIndex) => {
                const pAngle = (pIndex / Math.min(8, cluster.passages.length)) * 2 * Math.PI;
                const pRadius = cluster.size + 25;
                const px = cluster.x + Math.cos(pAngle) * pRadius;
                const py = cluster.y + Math.sin(pAngle) * pRadius;
                
                return (
                  <g key={passage.id}>
                    <line
                      x1={cluster.x}
                      y1={cluster.y}
                      x2={px}
                      y2={py}
                      stroke={cluster.color}
                      strokeWidth="1"
                      opacity="0.4"
                    />
                    <circle
                      cx={px}
                      cy={py}
                      r="4"
                      fill={passage.language === 'greek' ? '#3B82F6' : '#DC2626'}
                      stroke="#F5F4F2"
                      strokeWidth="1"
                      style={{
                        cursor: 'pointer',
                        transform: `scale(${selectedPassage?.id === passage.id ? 1.5 : 1})`,
                        transition: 'transform 0.2s ease'
                      }}
                      onClick={() => setSelectedPassage(passage)}
                    />
                  </g>
                );
              })}
            </g>
          ))}
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
        <div style={{ 
          maxWidth: '1200px', 
          margin: '0 auto', 
          padding: '0 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }