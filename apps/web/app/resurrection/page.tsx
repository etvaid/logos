'use client';
import React, { useState } from 'react';

const GhostAuthorResurrection = () => {
  const [selectedAuthor, setSelectedAuthor] = useState('sappho');
  const [reconstructionParams, setReconstructionParams] = useState({
    stylistic_weight: 75,
    thematic_consistency: 80,
    historical_context: 70,
    linguistic_patterns: 85
  });

  const authors = {
    sappho: {
      name: 'Sappho of Lesbos',
      period: '630-570 BCE',
      surviving_fragments: 650,
      estimated_lost: 9000,
      total_books: 9,
      specialty: 'Lyric Poetry',
      reconstructions: [
        {
          title: 'Fragment 31 Extension',
          confidence: 82,
          content: 'Sweet mother, I cannot weave—\nslender Aphrodite has overcome me\nwith longing for a girl.\n\nHer laughter pours like honey\nthrough shadows of olive groves,\nwhile I, trembling, follow\nthe sound of her voice.',
          source: 'Reconstructed from papyrus fragments P.Oxy 1787',
          meter: 'Sapphic stanzas'
        },
        {
          title: 'Wedding Song Reconstruction',
          confidence: 75,
          content: 'Evening star, you bring back all\nthat bright dawn scattered:\nyou bring the sheep, you bring the goat,\nyou bring the child back to her mother.\n\nLike the hyacinth shepherds crush\nwith their feet in the mountains,\nyet still purple blooms upon the ground—',
          source: 'Based on Himerius testimonium and metrical analysis',
          meter: 'Ionic meter'
        },
        {
          title: 'Prayer to Aphrodite Extension',
          confidence: 78,
          content: 'Deathless Aphrodite, throned in flowers,\nchild of Zeus, weaver of wiles,\nwith suffering and longing\ndo not crush my heart.\n\nBut come here, if ever before\nyou heard my far-off cry\nand listened, leaving your father\'s\ngolden house, you came—',
          source: 'Expanded from Fragment 1 using dialect patterns',
          meter: 'Sapphic stanzas'
        }
      ]
    },
    ennius: {
      name: 'Quintus Ennius',
      period: '239-169 BCE',
      surviving_fragments: 800,
      estimated_lost: 15000,
      total_books: 18,
      specialty: 'Epic Poetry (Annales)',
      reconstructions: [
        {
          title: 'Hannibal at the Gates',
          confidence: 71,
          content: 'Poenas dare poenas Carthaginis hostis,\nHannibal audaci cum pectore Alpis\ntransiit. Italiam ferro ignique petivit,\nRomanos tremulos fecit.',
          source: 'Reconstructed from Cicero citations and historical records',
          meter: 'Dactylic hexameter'
        },
        {
          title: 'Romulus Foundation',
          confidence: 68,
          content: 'Septimus ille dies, septem de montibus alte\nRomus auspiciis avibus dat signa futuris.\nQuirites clamant, Romam condentibus astris\nmagna virorum urbs oritur.',
          source: 'Based on Livy parallels and augural terminology',
          meter: 'Dactylic hexameter'
        }
      ]
    },
    livy: {
      name: 'Titus Livius',
      period: '59 BCE - 17 CE',
      surviving_fragments: 35,
      estimated_lost: 107,
      total_books: 142,
      specialty: 'Historical Prose',
      reconstructions: [
        {
          title: 'Caesar\'s Gallic Campaigns',
          confidence: 85,
          content: 'Caesar, having crossed the Rubicon with his veteran legions, found the path to Rome defended not by armies but by the weight of tradition itself. The Senate, trembling in their curule chairs, sent envoys bearing olive branches that concealed daggers of legal precedent.',
          source: 'Reconstructed from Plutarch parallels and Suetonian fragments',
          meter: 'Prose'
        },
        {
          title: 'Germanic Wars',
          confidence: 73,
          content: 'Beyond the Rhine, where Roman eagles had never cast their shadows, Arminius gathered the tribes. The Cherusci prince, educated in Roman camps, knew both the strength and weakness of the legions that had made him.',
          source: 'Based on Tacitus Annales and archaeological evidence',
          meter: 'Prose'
        }
      ]
    },
    cicero: {
      name: 'Marcus Tullius Cicero',
      period: '106-43 BCE',
      surviving_fragments: 58,
      estimated_lost: 150,
      total_books: 208,
      specialty: 'Oratory & Philosophy',
      reconstructions: [
        {
          title: 'Against Clodius (Lost Speech)',
          confidence: 79,
          content: 'How long, citizens of Rome, will you suffer this demagogue to mock the sacred institutions of our ancestors? Clodius, that enemy of order, that corruptor of sacred rites, stands before you not as a magistrate but as a disease upon the body politic.',
          source: 'Reconstructed from Asconius commentary and rhetorical patterns',
          meter: 'Oratorical prose'
        },
        {
          title: 'Hortensius Memorial',
          confidence: 74,
          content: 'Never shall I forget, Hortensius, how you adorned the forum with the flowers of your eloquence. Like a master painter who knows when to use shadow and when to burst forth with color, you wielded words as others wield swords.',
          source: 'Based on surviving letters and Brutus dialogue',
          meter: 'Epideictic prose'
        }
      ]
    }
  };

  const currentAuthor = authors[selectedAuthor];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-purple-900 text-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 to-blue-900/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-24">
          <div className="text-center">
            <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              GHOST RESURRECTION
            </h1>
            <p className="text-2xl text-purple-300 mb-8">
              Recovering Lost Literature Through AI Analysis
            </p>
            <div className="flex justify-center items-center space-x-8 text-lg">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                <span>Analyzing fragments to reconstruct lost masterpieces</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Global Stats */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16">
          <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-purple-500/30">
            <div className="text-3xl font-bold text-purple-400 mb-2">2.4M+</div>
            <div className="text-gray-300">Fragments Analyzed</div>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-blue-500/30">
            <div className="text-3xl font-bold text-blue-400 mb-2">847</div>
            <div className="text-gray-300">Works Reconstructed</div>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-green-500/30">
            <div className="text-3xl font-bold text-green-400 mb-2">73.2%</div>
            <div className="text-gray-300">Avg Confidence</div>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-orange-500/30">
            <div className="text-3xl font-bold text-orange-400 mb-2">156</div>
            <div className="text-gray-300">Lost Authors</div>
          </div>
        </div>

        {/* Author Selector */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-8 text-center">Select Author for Reconstruction</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(authors).map(([key, author]) => (
              <button
                key={key}
                onClick={() => setSelectedAuthor(key)}
                className={`p-6 rounded-xl border-2 transition-all duration-300 ${
                  selectedAuthor === key
                    ? 'border-purple-400 bg-purple-500/20 shadow-lg shadow-purple-500/25'
                    : 'border-gray-600 bg-gray-800/50 hover:border-purple-500'
                }`}
              >
                <div className="font-bold text-lg mb-2">{author.name}</div>
                <div className="text-gray-400 text-sm">{author.period}</div>
                <div className="text-purple-300 text-sm mt-2">{author.specialty}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Author Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2">
            <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-8 border border-gray-600">
              <h3 className="text-2xl font-bold mb-6 text-purple-400">{currentAuthor.name}</h3>
              
              {/* Survival Stats */}
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div>
                  <div className="text-green-400 text-2xl font-bold">{currentAuthor.surviving_fragments.toLocaleString()}</div>
                  <div className="text-gray-300">Surviving {currentAuthor.specialty === 'Oratory & Philosophy' || currentAuthor.specialty === 'Historical Prose' ? 'Pages' : 'Lines'}</div>
                  <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                    <div 
                      className="bg-green-400 h-2 rounded-full" 
                      style={{ width: `${(currentAuthor.surviving_fragments / (currentAuthor.surviving_fragments + currentAuthor.estimated_lost)) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="text-red-400 text-2xl font-bold">{currentAuthor.estimated_lost.toLocaleString()}</div>
                  <div className="text-gray-300">Estimated Lost {currentAuthor.specialty === 'Oratory & Philosophy' || currentAuthor.specialty === 'Historical Prose' ? 'Pages' : 'Lines'}</div>
                  <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                    <div 
                      className="bg-red-400 h-2 rounded-full" 
                      style={{ width: `${(currentAuthor.estimated_lost / (currentAuthor.surviving_fragments + currentAuthor.estimated_lost)) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="text-center p-4 bg-gray-700/50 rounded-lg">
                <div className="text-lg text-gray-300">Reconstruction Confidence</div>
                <div className="text-3xl font-bold text-blue-400 mt-2">
                  {Math.round(currentAuthor.reconstructions.reduce((acc, r) => acc + r.confidence, 0) / currentAuthor.reconstructions.length)}%
                </div>
              </div>
            </div>
          </div>

          {/* Reconstruction Laboratory */}
          <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-6 border border-gray-600">
            <h4 className="text-xl font-bold mb-4 text-purple-400">Reconstruction Laboratory</h4>
            <div className="space-y-4">
              {Object.entries(reconstructionParams).map(([param, value]) => (
                <div key={param}>
                  <div className="flex justify-between mb-2">
                    <label className="text-sm text-gray-300 capitalize">
                      {param.replace('_', ' ')}
                    </label>
                    <span className="text-purple-400">{value}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={value}
                    onChange={(e) => setReconstructionParams({
                      ...reconstructionParams,
                      [param]: parseInt(e.target.value)
                    })}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>
              ))}
            </div>
            <button className="w-full mt-6 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105">
              Regenerate Reconstructions
            </button>
          </div>
        </div>

        {/* Reconstructed Passages */}
        <div className="mb-12">
          <h3 className="text-3xl font-bold mb-8 text-center">AI-Reconstructed Passages</h3>
          <div className="space-y-8">
            {currentAuthor.reconstructions.map((reconstruction, index) => (
              <div key={index} className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-8 border border-gray-600">
                <div className="flex justify-between items-start mb-4">
                  <h4 className="text-xl font-bold text-purple-400">{reconstruction.title}</h4>
                  <div className="flex items-center">
                    <div className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      reconstruction.confidence >= 80 ? 'bg-green-500/20 text-green-400' :
                      reconstruction.confidence >= 70 ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {reconstruction.confidence}% Confidence
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-900/50 rounded-lg p-6 mb-4 border-l-4 border-purple-500">
                  <div className="font-serif text-lg leading-relaxed whitespace-pre-line text-gray-100">
                    {reconstruction.content}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-400">
                  <div>
                    <span className="font-semibold text-purple-300">Source: </span>
                    {reconstruction.source}
                  </div>
                  <div>
                    <span className="font-semibold text-purple-300">Meter: </span>
                    {reconstruction.meter}
                  </div>
                </div>
                
                <div className="mt-4 flex space-x-2">
                  <button className="px-4 py-2 bg-blue-600/20 text-blue-400 rounded-lg hover:bg-blue-600/30 transition-colors">
                    View Fragment Sources
                  </button>
                  <button className="px-4 py-2 bg-purple-600/20 text-purple-400 rounded-lg hover:bg-purple-600/30 transition-colors">
                    Analyze Methodology
                  </button>
                  <button className="px-4 py-2 bg-green-600/20 text-green-400 rounded-lg hover:bg-green-600/30 transition-colors">
                    Compare Variants
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Fragment Viewer */}
        <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-8 border border-gray-600">
          <h3 className="text-2xl font-bold mb-6 text-purple-400">Original Fragment Viewer</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h4 className="text-lg font-semibold mb-4 text-gray-300">Papyrus P.Oxy 1787</h4>
              <div className="bg-gray-900/50 rounded-lg p-4 border-2 border-dashed border-gray-600">
                <div className="font-mono text-sm text-gray-400 mb-2">[Column I]</div>
                <div className="text-gray-300 font-serif">
                  ]μητερ, οὐ δύναμαι κρέκειν τὸν ἴστον<br/>
                  ]πόθῳ δάμεισα παῖδος βραδίνας δι᾽<br/>
                  ]Ἀφροδίτας<br/>
                  <span className="text-gray-500">[lacuna]</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4 text-gray-300">Reconstruction Analysis</h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Dialect consistency:</span>
                  <span className="text-green-400">94%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Metrical accuracy:</span>
                  <span className="text-green-400">91%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Thematic coherence:</span>
                  <span className="text-yellow-400">87%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Vocabulary probability:</span>
                  <span className="text-green-400">89%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #a855f7;
          cursor: pointer;
        }
        
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #a855f7;
          cursor: pointer;
          border: none;
        }
      `}</style>
    </div>
  );
};

export default GhostAuthorResurrection;