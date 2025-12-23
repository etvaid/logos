'use client';
import React, { useState, useEffect } from 'react';

const API_URL = 'https://logos-production-ef2b.up.railway.app';

interface Fragment {
  id: string;
  text: string;
  source: string;
  context: string;
  confidence: number;
  work_title: string;
  fragment_number: string;
}

interface Author {
  id: string;
  name: string;
  period: string;
  description: string;
}

interface Stats {
  total_lost_works: number;
  total_fragments: number;
  authors_count: number;
}

const GhostTextsPage = () => {
  const [selectedAuthor, setSelectedAuthor] = useState<string>('');
  const [authors, setAuthors] = useState<Author[]>([]);
  const [fragments, setFragments] = useState<Fragment[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(false);

  // Demo data for Ennius fragments
  const demoAuthors: Author[] = [
    {
      id: 'ennius',
      name: 'Ennius',
      period: '239-169 BCE',
      description: 'Father of Roman poetry, known for the Annales epic'
    },
    {
      id: 'sappho',
      name: 'Sappho',
      period: '630-570 BCE',
      description: 'Greek lyric poet from Lesbos'
    }
  ];

  const demoFragments: Fragment[] = [
    {
      id: '1',
      text: 'Musae, quae pedibus magnum pulsatis Olympum',
      source: 'Cicero',
      context: 'Quoted in De Divinatione I.114 as an example of Ennius\'s invocation of the Muses',
      confidence: 0.95,
      work_title: 'Annales',
      fragment_number: 'Fr. 1'
    },
    {
      id: '2',
      text: 'O Tite tute Tati tibi tanta tyranne tulisti',
      source: 'Cicero',
      context: 'Cited in Orator 164 as an example of alliteration, referring to King Titus Tatius',
      confidence: 0.98,
      work_title: 'Annales',
      fragment_number: 'Fr. 109'
    },
    {
      id: '3',
      text: 'Moribus antiquis res stat Romana virisque',
      source: 'Cicero',
      context: 'Quoted in De Re Publica V.1 to illustrate Roman values and virtue',
      confidence: 0.92,
      work_title: 'Annales',
      fragment_number: 'Fr. 156'
    },
    {
      id: '4',
      text: 'Unus homo nobis cunctando restituit rem',
      source: 'Cicero',
      context: 'Referenced in De Senectute 10 about Fabius Maximus\'s strategy against Hannibal',
      confidence: 0.89,
      work_title: 'Annales',
      fragment_number: 'Fr. 363'
    },
    {
      id: '5',
      text: 'Pellitur e medio sapientia, vi geritur res',
      source: 'Virgil',
      context: 'Alluded to in the Aeneid, showing Ennius\'s influence on later epic poetry',
      confidence: 0.87,
      work_title: 'Annales',
      fragment_number: 'Fr. 208'
    }
  ];

  const demoStats: Stats = {
    total_lost_works: 847,
    total_fragments: 12456,
    authors_count: 156
  };

  useEffect(() => {
    // Load demo data
    setAuthors(demoAuthors);
    setStats(demoStats);
    setSelectedAuthor('ennius');
    setFragments(demoFragments);
  }, []);

  const handleAuthorChange = (authorId: string) => {
    setSelectedAuthor(authorId);
    setLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      if (authorId === 'ennius') {
        setFragments(demoFragments);
      } else {
        // Show fewer fragments for other authors
        setFragments(demoFragments.slice(0, 2));
      }
      setLoading(false);
    }, 500);
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return 'text-green-400';
    if (confidence >= 0.8) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getConfidenceLabel = (confidence: number) => {
    if (confidence >= 0.9) return 'High';
    if (confidence >= 0.8) return 'Medium';
    return 'Low';
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-gray-800 to-gray-900 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Discover Lost Works
          </h1>
          <p className="text-xl text-gray-300 mb-8 leading-relaxed">
            Explore fragments of ancient literature that survive only through quotations by later authors. 
            These ghost texts offer glimpses into lost masterpieces of human thought and creativity.
          </p>
          
          {/* Stats */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              <div className="bg-gray-800/50 rounded-lg p-6 backdrop-blur-sm">
                <div className="text-3xl font-bold text-purple-400">{stats.total_lost_works.toLocaleString()}</div>
                <div className="text-gray-400">Lost Works</div>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-6 backdrop-blur-sm">
                <div className="text-3xl font-bold text-pink-400">{stats.total_fragments.toLocaleString()}</div>
                <div className="text-gray-400">Fragments Recovered</div>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-6 backdrop-blur-sm">
                <div className="text-3xl font-bold text-blue-400">{stats.authors_count}</div>
                <div className="text-gray-400">Ancient Authors</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Author Selector */}
        <div className="mb-8">
          <label className="block text-lg font-semibold mb-3 text-gray-300">
            Select Author
          </label>
          <select
            value={selectedAuthor}
            onChange={(e) => handleAuthorChange(e.target.value)}
            className="w-full md:w-96 bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="">Choose an author...</option>
            {authors.map((author) => (
              <option key={author.id} value={author.id}>
                {author.name} ({author.period})
              </option>
            ))}
          </select>
          
          {selectedAuthor && (
            <div className="mt-4 p-4 bg-gray-800/50 rounded-lg">
              <p className="text-gray-300">
                {authors.find(a => a.id === selectedAuthor)?.description}
              </p>
            </div>
          )}
        </div>

        {/* Fragments Display */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400"></div>
          </div>
        ) : fragments.length > 0 ? (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-200">
              Fragments ({fragments.length})
            </h2>
            
            {fragments.map((fragment) => (
              <div key={fragment.id} className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-purple-500 transition-colors">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-purple-400">
                      {fragment.work_title} - {fragment.fragment_number}
                    </h3>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`text-sm font-medium ${getConfidenceColor(fragment.confidence)}`}>
                      {getConfidenceLabel(fragment.confidence)}
                    </span>
                    <span className="text-xs text-gray-400">
                      {Math.round(fragment.confidence * 100)}%
                    </span>
                  </div>
                </div>

                {/* Fragment Text */}
                <div className="mb-4 p-4 bg-gray-900 rounded-lg border-l-4 border-purple-500">
                  <p className="text-lg italic text-gray-200 font-serif leading-relaxed">
                    "{fragment.text}"
                  </p>
                </div>

                {/* Source and Context */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-400">Source:</span>
                    <span className="text-sm text-pink-400 font-medium">{fragment.source}</span>
                  </div>
                  
                  <div>
                    <span className="text-sm font-medium text-gray-400 block mb-1">Context:</span>
                    <p className="text-sm text-gray-300 leading-relaxed">
                      {fragment.context}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : selectedAuthor ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg">No fragments found for this author</div>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg">Select an author to explore their surviving fragments</div>
          </div>
        )}
      </div>

      {/* Footer Note */}
      <div className="bg-gray-800 mt-16 py-8 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-gray-400 text-sm">
            These fragments represent the surviving remnants of lost literary works, preserved through citations 
            by later authors. Confidence scores reflect scholarly consensus on authenticity and accurate transmission.
          </p>
        </div>
      </div>
    </div>
  );
};

export default GhostTextsPage;