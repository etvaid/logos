'use client';
import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface TimelinePeriod {
  period: string;
  years: string;
  meaning: string;
  driftScore: number;
  keyAuthors: string[];
  examples: string[];
}

interface ConceptData {
  [key: string]: {
    greek?: string;
    latin?: string;
    periods: TimelinePeriod[];
  };
}

const ChronosEngine = () => {
  const [selectedConcept, setSelectedConcept] = useState('ἀρετή');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const demoData: ConceptData = {
    'ἀρετή': {
      greek: 'ἀρετή',
      periods: [
        {
          period: 'Archaic',
          years: '800-480 BCE',
          meaning: 'Excellence in battle, heroic prowess, martial valor',
          driftScore: 0,
          keyAuthors: ['Homer', 'Hesiod'],
          examples: ['Achilles\' battlefield excellence', 'Heroic competitions']
        },
        {
          period: 'Classical',
          years: '480-323 BCE',
          meaning: 'Moral and ethical excellence, character virtue',
          driftScore: 2.1,
          keyAuthors: ['Plato', 'Aristotle', 'Sophocles'],
          examples: ['Four cardinal virtues', 'Virtue ethics theory']
        },
        {
          period: 'Hellenistic',
          years: '323-146 BCE',
          meaning: 'Philosophical virtue, wisdom-based excellence',
          driftScore: 3.2,
          keyAuthors: ['Epictetus', 'Marcus Aurelius', 'Zeno'],
          examples: ['Stoic virtue', 'Ataraxia achievement']
        },
        {
          period: 'Imperial',
          years: '146 BCE-284 CE',
          meaning: 'Civic virtue, public service excellence',
          driftScore: 4.1,
          keyAuthors: ['Plutarch', 'Dio Chrysostom'],
          examples: ['Roman civic duty', 'Public magistrate virtues']
        },
        {
          period: 'Late Antique',
          years: '284-600 CE',
          meaning: 'Christian virtue, spiritual holiness, divine grace',
          driftScore: 6.8,
          keyAuthors: ['Augustine', 'John Chrysostom', 'Basil'],
          examples: ['Theological virtues', 'Monastic perfection']
        },
        {
          period: 'Medieval',
          years: '600-1500 CE',
          meaning: 'Theological virtue, scholastic synthesis',
          driftScore: 7.5,
          keyAuthors: ['Aquinas', 'Boethius', 'Pseudo-Dionysius'],
          examples: ['Summa Theologica', 'University curriculum']
        }
      ]
    },
    'λόγος': {
      greek: 'λόγος',
      periods: [
        {
          period: 'Archaic',
          years: '800-480 BCE',
          meaning: 'Speech, story, account, narrative',
          driftScore: 0,
          keyAuthors: ['Homer', 'Heraclitus'],
          examples: ['Epic narratives', 'Divine cosmic principle']
        },
        {
          period: 'Classical',
          years: '480-323 BCE',
          meaning: 'Reason, rational argument, philosophical discourse',
          driftScore: 1.8,
          keyAuthors: ['Plato', 'Aristotle'],
          examples: ['Dialectical method', 'Logical reasoning']
        },
        {
          period: 'Hellenistic',
          years: '323-146 BCE',
          meaning: 'Universal reason, cosmic rationality',
          driftScore: 2.9,
          keyAuthors: ['Stoics', 'Philo of Alexandria'],
          examples: ['Logos spermatikos', 'Divine wisdom']
        },
        {
          period: 'Imperial',
          years: '146 BCE-284 CE',
          meaning: 'Divine word, mediating principle',
          driftScore: 4.2,
          keyAuthors: ['Philo', 'Justin Martyr'],
          examples: ['Logos theology', 'Apologetic writings']
        },
        {
          period: 'Late Antique',
          years: '284-600 CE',
          meaning: 'Christ as Logos, incarnate Word of God',
          driftScore: 6.5,
          keyAuthors: ['John Chrysostom', 'Augustine'],
          examples: ['Gospel of John', 'Christological debates']
        },
        {
          period: 'Medieval',
          years: '600-1500 CE',
          meaning: 'Scholastic reason, theological discourse',
          driftScore: 7.2,
          keyAuthors: ['Aquinas', 'Abelard'],
          examples: ['University debates', 'Rational theology']
        }
      ]
    },
    'virtus': {
      latin: 'virtus',
      periods: [
        {
          period: 'Archaic',
          years: '800-480 BCE',
          meaning: 'Manly courage, warrior strength, military valor',
          driftScore: 0,
          keyAuthors: ['Ennius', 'Early Latin poets'],
          examples: ['Roman military prowess', 'Battlefield courage']
        },
        {
          period: 'Classical',
          years: '480-323 BCE',
          meaning: 'Civic excellence, political virtue, moral character',
          driftScore: 1.9,
          keyAuthors: ['Cicero', 'Caesar', 'Sallust'],
          examples: ['Republican ideals', 'Senatorial dignity']
        },
        {
          period: 'Hellenistic',
          years: '323-146 BCE',
          meaning: 'Philosophical virtue influenced by Greek thought',
          driftScore: 2.7,
          keyAuthors: ['Roman Stoics', 'Hellenistic writers'],
          examples: ['Stoic influence', 'Greek philosophical adoption']
        },
        {
          period: 'Imperial',
          years: '146 BCE-284 CE',
          meaning: 'Imperial virtue, loyalty to emperor, civic duty',
          driftScore: 3.8,
          keyAuthors: ['Seneca', 'Tacitus', 'Pliny'],
          examples: ['Imperial loyalty', 'Administrative excellence']
        },
        {
          period: 'Late Antique',
          years: '284-600 CE',
          meaning: 'Christian virtue, spiritual strength, martyrdom',
          driftScore: 5.9,
          keyAuthors: ['Ambrose', 'Jerome', 'Augustine'],
          examples: ['Martyr courage', 'Christian fortitude']
        },
        {
          period: 'Medieval',
          years: '600-1500 CE',
          meaning: 'Chivalric virtue, knightly honor, Christian valor',
          driftScore: 6.8,
          keyAuthors: ['Medieval chroniclers', 'Aquinas'],
          examples: ['Chivalric codes', 'Crusading ideals']
        }
      ]
    },
    'pietas': {
      latin: 'pietas',
      periods: [
        {
          period: 'Archaic',
          years: '800-480 BCE',
          meaning: 'Duty to family, ancestors, clan obligations',
          driftScore: 0,
          keyAuthors: ['Early Roman writers'],
          examples: ['Ancestral worship', 'Family duties']
        },
        {
          period: 'Classical',
          years: '480-323 BCE',
          meaning: 'Duty to gods, state, and family - civic piety',
          driftScore: 1.5,
          keyAuthors: ['Virgil', 'Livy', 'Cicero'],
          examples: ['Aeneas\' piety', 'Religious observance']
        },
        {
          period: 'Hellenistic',
          years: '323-146 BCE',
          meaning: 'Religious devotion, philosophical piety',
          driftScore: 2.3,
          keyAuthors: ['Roman philosophers'],
          examples: ['Philosophical religion', 'Mystery cults']
        },
        {
          period: 'Imperial',
          years: '146 BCE-284 CE',
          meaning: 'Imperial cult devotion, state religion, emperor worship',
          driftScore: 3.6,
          keyAuthors: ['Imperial historians', 'Court writers'],
          examples: ['Emperor divinity', 'State ceremonies']
        },
        {
          period: 'Late Antique',
          years: '284-600 CE',
          meaning: 'Christian piety, devotion to God, religious observance',
          driftScore: 6.2,
          keyAuthors: ['Augustine', 'Ambrose', 'Jerome'],
          examples: ['Christian devotion', 'Liturgical piety']
        },
        {
          period: 'Medieval',
          years: '600-1500 CE',
          meaning: 'Monastic piety, ecclesiastical devotion, spiritual discipline',
          driftScore: 7.1,
          keyAuthors: ['Benedict', 'Bernard', 'Aquinas'],
          examples: ['Monastic rules', 'Mystical devotion']
        }
      ]
    }
  };

  const currentData = demoData[selectedConcept];
  const chartData = currentData?.periods.map(period => ({
    period: period.period,
    drift: period.driftScore
  })) || [];

  const handleSearch = () => {
    if (searchTerm && demoData[searchTerm]) {
      setSelectedConcept(searchTerm);
    }
  };

  const conceptOptions = Object.keys(demoData);

  return (
    <div className="min-h-screen bg-[#0D0D0F] text-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#0D0D0F] via-[#1a1a1f] to-[#0D0D0F]">
        <div className="absolute inset-0 bg-gradient-to-r from-[#C9A227]/5 to-transparent"></div>
        <div className="container mx-auto px-6 py-20 relative">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-[#C9A227] to-white bg-clip-text text-transparent">
              CHRONOS ENGINE
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-4xl mx-auto">
              Watch Ideas Evolve Across 1,500 Years of Human Thought
            </p>
            <p className="text-lg text-gray-400 mb-12 max-w-3xl mx-auto">
              Trace the semantic evolution of Greek and Latin concepts from ancient origins to medieval synthesis
            </p>
          </div>
        </div>
      </div>

      {/* Search Section */}
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="bg-[#1a1a1f] rounded-2xl p-8 border border-[#C9A227]/20">
            <h2 className="text-2xl font-bold text-[#C9A227] mb-6">Explore Concepts</h2>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Enter Greek or Latin concept (ἀρετή, λόγος, virtus, pietas)"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-3 bg-[#0D0D0F] border border-[#C9A227]/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#C9A227]"
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <button
                onClick={handleSearch}
                disabled={isLoading}
                className="px-8 py-3 bg-[#C9A227] text-black font-semibold rounded-lg hover:bg-[#B8921F] transition-colors disabled:opacity-50"
              >
                {isLoading ? 'Searching...' : 'Trace Evolution'}
              </button>
            </div>
            
            {/* Concept Selection */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {conceptOptions.map(concept => (
                <button
                  key={concept}
                  onClick={() => setSelectedConcept(concept)}
                  className={`p-3 rounded-lg border transition-all ${
                    selectedConcept === concept
                      ? 'bg-[#C9A227]/20 border-[#C9A227] text-[#C9A227]'
                      : 'bg-[#0D0D0F] border-gray-600 text-gray-300 hover:border-[#C9A227]/50'
                  }`}
                >
                  {concept}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Evolution Visualization */}
      {currentData && (
        <div className="container mx-auto px-6 pb-12">
          <div className="max-w-7xl mx-auto">
            {/* Chart */}
            <div className="bg-[#1a1a1f] rounded-2xl p-8 border border-[#C9A227]/20 mb-8">
              <h3 className="text-2xl font-bold text-[#C9A227] mb-6">
                Semantic Drift: {selectedConcept}
              </h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis 
                      dataKey="period" 
                      stroke="#C9A227"
                      fontSize={12}
                    />
                    <YAxis 
                      stroke="#C9A227"
                      label={{ value: 'Drift Score', angle: -90, position: 'insideLeft' }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1a1a1f', 
                        border: '1px solid #C9A227',
                        borderRadius: '8px',
                        color: 'white'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="drift" 
                      stroke="#C9A227" 
                      strokeWidth={3}
                      dot={{ fill: '#C9A227', strokeWidth: 2, r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Timeline */}
            <div className="space-y-6">
              <h3 className="text-3xl font-bold text-center text-[#C9A227]">
                Evolution Timeline: {selectedConcept}
              </h3>
              
              <div className="grid gap-6">
                {currentData.periods.map((period, index) => (
                  <div key={period.period} className="relative">
                    {/* Timeline connector */}
                    {index < currentData.periods.length - 1 && (
                      <div className="absolute left-8 top-20 w-0.5 h-full bg-gradient-to-b from-[#C9A227] to-transparent opacity-50 z-0"></div>
                    )}
                    
                    <div className="bg-[#1a1a1f] rounded-2xl p-8 border border-[#C9A227]/20 relative z-10">
                      <div className="flex items-start gap-6">
                        {/* Period indicator */}
                        <div className="flex-shrink-0">
                          <div className="w-16 h-16 bg-[#C9A227] rounded-full flex items-center justify-center text-black font-bold text-sm">
                            {period.driftScore.toFixed(1)}
                          </div>
                        </div>
                        
                        {/* Content */}
                        <div className="flex-1">
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                            <h4 className="text-2xl font-bold text-[#C9A227]">{period.period} Period</h4>
                            <span className="text-gray-400 text-lg">{period.years}</span>
                          </div>
                          
                          <p className="text-lg text-gray-200 mb-6 leading-relaxed">
                            {period.meaning}
                          </p>
                          
                          <div className="grid md:grid-cols-2 gap-6">
                            <div>
                              <h5 className="text-[#C9A227] font-semibold mb-3">Key Authors</h5>
                              <div className="flex flex-wrap gap-2">
                                {period.keyAuthors.map(author => (
                                  <span key={author} className="px-3 py-1 bg-[#C9A227]/20 text-[#C9A227] rounded-full text-sm">
                                    {author}
                                  </span>
                                ))}
                              </div>
                            </div>
                            
                            <div>
                              <h5 className="text-[#C9A227] font-semibold mb-3">Examples</h5>
                              <ul className="text-gray-300 space-y-1">
                                {period.examples.map((example, idx) => (
                                  <li key={idx} className="flex items-start">
                                    <span className="text-[#C9A227] mr-2">•</span>
                                    {example}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChronosEngine;