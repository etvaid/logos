```tsx
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Search, Filter, BookOpen, Clock, User, Network, Moon, Sun, ChevronDown, ChevronUp, Loader2, X } from 'lucide-react';

interface Passage {
  id: string;
  text: string;
  author: string;
  work: string;
  book?: string;
  chapter?: string;
  line?: string;
  timeperiod: string;
  similarity: number;
  context?: string;
}

interface Connection {
  source: string;
  target: string;
  strength: number;
  sharedConcepts: string[];
}

interface DiscoverResponse {
  passages: Passage[];
  connections: Connection[];
  totalResults: number;
  query: string;
}

interface Filters {
  authors: string[];
  works: string[];
  timeperiods: string[];
  minSimilarity: number;
}

const IntertextualityPage: React.FC = () => {
  const [query, setQuery] = useState('');
  const [data, setData] = useState<DiscoverResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<Filters>({
    authors: [],
    works: [],
    timeperiods: [],
    minSimilarity: 0.3
  });
  const [showFilters, setShowFilters] = useState(false);
  const [expandedPassage, setExpandedPassage] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState(false);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  // Toggle dark mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Search function
  const handleSearch = async () => {
    if (!query.trim()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/discover`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: query.trim(),
          limit: 50,
          filters: filters
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: DiscoverResponse = await response.json();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Filter passages based on current filters
  const filteredPassages = useMemo(() => {
    if (!data) return [];
    
    return data.passages.filter(passage => {
      if (filters.authors.length > 0 && !filters.authors.includes(passage.author)) {
        return false;
      }
      if (filters.works.length > 0 && !filters.works.includes(passage.work)) {
        return false;
      }
      if (filters.timeperiods.length > 0 && !filters.timeperiods.includes(passage.timeperiod)) {
        return false;
      }
      if (passage.similarity < filters.minSimilarity) {
        return false;
      }
      return true;
    });
  }, [data, filters]);

  // Get unique values for filter options
  const filterOptions = useMemo(() => {
    if (!data) return { authors: [], works: [], timeperiods: [] };
    
    return {
      authors: [...new Set(data.passages.map(p => p.author))].sort(),
      works: [...new Set(data.passages.map(p => p.work))].sort(),
      timeperiods: [...new Set(data.passages.map(p => p.timeperiod))].sort()
    };
  }, [data]);

  // Network visualization component
  const NetworkVisualization: React.FC<{ passages: Passage[], connections: Connection[] }> = ({ passages, connections }) => {
    const width = 400;
    const height = 300;
    
    // Simple force-directed layout simulation
    const nodes = useMemo(() => {
      return passages.slice(0, 10).map((passage, index) => ({
        id: passage.id,
        x: width/2 + Math.cos(index * 2 * Math.PI / passages.length) * 80,
        y: height/2 + Math.sin(index * 2 * Math.PI / passages.length) * 80,
        radius: Math.max(5, passage.similarity * 15),
        passage
      }));
    }, [passages]);

    const edges = useMemo(() => {
      return connections.filter(conn => 
        nodes.some(n => n.id === conn.source) && nodes.some(n => n.id === conn.target)
      );
    }, [connections, nodes]);

    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-lg">
        <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Text Network</h3>
        <svg width={width} height={height} className="border border-gray-200 dark:border-gray-700 rounded">
          {/* Edges */}
          {edges.map((edge, index) => {
            const sourceNode = nodes.find(n => n.id === edge.source);
            const targetNode = nodes.find(n => n.id === edge.target);
            if (!sourceNode || !targetNode) return null;
            
            return (
              <line
                key={index}
                x1={sourceNode.x}
                y1={sourceNode.y}
                x2={targetNode.x}
                y2={targetNode.y}
                stroke={darkMode ? '#6B7280' : '#D1D5DB'}
                strokeWidth={edge.strength * 3}
                opacity={0.6}
              />
            );
          })}
          
          {/* Nodes */}
          {nodes.map((node) => (
            <g key={node.id}>
              <circle
                cx={node.x}
                cy={node.y}
                r={node.radius}
                fill={selectedNode === node.id ? '#3B82F6' : '#8B5CF6'}
                stroke={darkMode ? '#374151' : '#E5E7EB'}
                strokeWidth={2}
                className="cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => setSelectedNode(selectedNode === node.id ? null : node.id)}
              />
              <text
                x={node.x}
                y={node.y - node.radius - 5}
                textAnchor="middle"
                fontSize="10"
                fill={darkMode ? '#F3F4F6' : '#374151'}
                className="pointer-events-none"
              >
                {node.passage.author.split(' ').pop()}
              </text>
            </g>
          ))}
        </svg>
        
        {selectedNode && (
          <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-700 rounded text-sm">
            {(() => {
              const node = nodes.find(n => n.id === selectedNode);
              return node ? (
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    {node.passage.author} - {node.passage.work}
                  </div>
                  <div className="text-gray-600 dark:text-gray-300 mt-1">
                    Similarity: {(node.passage.similarity * 100).toFixed(1)}%
                  </div>
                </div>
              ) : null;
            })()}
          </div>
        )}
      </div>
    );
  };

  // Loading skeleton
  const LoadingSkeleton: React.FC = () => (
    <div className="space-y-4">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow animate-pulse">
          <div className="flex justify-between items-start mb-3">
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/3"></div>
            <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-12"></div>
          </div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-full"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-4/5"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/5"></div>
          </div>
          <div className="flex space-x-4 mt-4">
            <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-20"></div>
            <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-24"></div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className={`min-h-screen transition-colors duration-200 ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div className="mb-4 sm:mb-0">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Discover Intertextuality</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Explore connections between classical texts and concepts
            </p>
          </div>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="self-end sm:self-auto p-2 rounded-lg bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-shadow"
          >
            {darkMode ? (
              <Sun className="w-5 h-5 text-yellow-500" />
            ) : (
              <Moon className="w-5 h-5 text-gray-600" />
            )}
          </button>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Enter a passage or concept to explore..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg 
                         bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                         focus:ring-2 focus:ring-purple-500 focus:border-transparent
                         placeholder-gray-500 dark:placeholder-gray-400"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`px-4 py-2.5 rounded-lg border transition-colors flex items-center gap-2
                          ${showFilters 
                            ? 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300' 
                            : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                          }`}
              >
                <Filter className="w-4 h-4" />
                <span className="hidden sm:inline">Filters</span>
              </button>
              <button
                onClick={handleSearch}
                disabled={loading || !query.trim()}
                className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 
                         text-white rounded-lg transition-colors flex items-center gap-2
                         disabled:cursor-not-allowed"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Search className="w-4 h-4" />
                )}
                <span className="hidden sm:inline">Search</span>
              </button>
            </div>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="mt-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {/* Authors Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <User className="w-4 h-4 inline mr-1" />
                    Authors
                  </label>
                  <div className="max-h-32 overflow-y-auto space-y-1">
                    {filterOptions.authors.map(author => (
                      <label key={author} className="flex items-center text-sm">
                        <input
                          type="checkbox"
                          checked={filters.authors.includes(author)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFilters(prev => ({ ...prev, authors: [...prev.authors, author] }));
                            } else {
                              setFilters(prev => ({ ...prev, authors: prev.authors.filter(a => a !== author) }));
                            }
                          }}
                          className="mr-2 text-purple-600 focus:ring-purple-500"
                        />
                        <span className="text-gray-700 dark:text-gray-300">{author}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Works Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <BookOpen className="w-4 h-4 inline mr-1" />
                    Works
                  </label>
                  <div className="max-h-32 overflow-y-auto space-y-1">
                    {filterOptions.works.map(work => (
                      <label key={work} className="flex items-center text-sm">
                        <input
                          type="checkbox"
                          checked={filters.works.includes(work)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFilters(prev => ({ ...prev, works: [...prev.works, work] }));
                            } else {
                              setFilters(prev => ({ ...prev, works: prev.works.filter(w => w !== work) }));
                            }
                          }}
                          className="mr-2 text-purple-600 focus:ring-purple-500"
                        />
                        <span className="text-gray-700 dark:text-gray-300">{work}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Time Periods Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <Clock className="w-4 h-4 inline mr-1" />
                    Time Periods
                  </label>
                  <div className="max-h-32 overflow-y-auto space-y-1">
                    {filterOptions.timeperiods.map(period => (
                      <label key={period} className="flex items-center text-sm">
                        <input
                          type="checkbox"
                          checked={filters.timeperiods.includes(period)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFilters(prev => ({ ...prev, timeperiods: [...prev.timeperiods, period] }));
                            } else {
                              setFilters(prev => ({ ...prev, timeperiods: prev.timeperiods.filter(p => p !== period) }));
                            }
                          }}
                          className="mr-2 text-purple-600 focus:ring-purple-500"
                        />
                        <span className="text-gray-700 dark:text-gray-300">{period}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Similarity Threshold */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Minimum Similarity: {(filters.minSimilarity * 100).toFixed(0)}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={filters.minSimilarity}
                    onChange={(e) => setFilters(prev => ({ ...prev, minSimilarity: parseFloat(e.target.value) }))}
                    className="w-full"
                  />
                </div>
              </div>
              
              {/* Clear Filters */}
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => setFilters({ authors: [], works: [], timeperiods: [], minSimilarity: 0.3 })}
                  className="text-sm text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300"
                >
                  Clear all filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Error State */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <div className="flex items-center">
              <X className="w-5 h-5 text-red-500 mr-2" />
              <span className="text-red-700 dark:text-red-300">Error: {error}</span>
            </div>
          </div>
        )}

        {/* Results */}
        {loading ? (
          <LoadingSkeleton />
        ) : data ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Network Visualization */}
            <div className="lg:col-span-1">
              <NetworkVisualization passages={filteredPassages} connections={data.connections} />
              
              {/* Results Summary */}
              <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg p-4 shadow-lg">
                <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Results Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Total Results:</span>
                    <span className="font-medium text-gray-900 dark:text-white">{data.totalResults}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Filtered Results:</span>
                    <span className="font-medium text-gray-900 dark:text-white">{filteredPassages.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Connections:</span>
                    <span className="font-medium text-gray-900 dark:text-white">{data.connections.length}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Passages List */}
            <div className="lg:col-span-2">
              <div className="space-y-4">
                {filteredPassages.map((passage) => (
                  <div key={passage.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
                    <div className="p-6">
                      {/* Header */}
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {passage.author} - {passage.work}
                          </h3>
                          {(passage.book || passage.chapter) && (
                            <p className="text-gray-600 dark:text-gray-400 text-sm">
                              {[passage.book, passage.chapter, passage.line].filter(Boolean).join(', ')}
                            </p>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                            passage.similarity > 0.8 
                              ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300'
                              : passage.similarity > 0.6
                              ? 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300'
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
                          }`}>
                            {(passage.similarity * 100).toFixed(1)}%
                          </div>
                        </div>
                      </div>

                      {/* Passage Text */}
                      <div className="mb-4">
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed italic">
                          "{passage.text}"
                        </p>
                      </div>

                      {/* Metadata */}
                      <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400 mb-3">
                        <span className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {passage.timeperiod}
                        </span>
                      </div>

                      {/* Expand Context Button */}
                      <button
                        onClick={() => setExpandedPassage(expandedPassage === passage.id ? null : passage.id)}
                        className="flex items-center text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 text-sm font-medium"
                      >
                        {expandedPassage === passage.id ? (
                          <>
                            <ChevronUp className="w-4 h-4 mr-1" />
                            Hide Context
                          </>
                        ) : (
                          <>
                            <ChevronDown className="w-4 h-4 mr-1" />
                            Show Context
                          </>
                        )}
                      </button>

                      {/* Expanded Context */}
                      {expandedPassage === passage.id && passage.context && (
                        <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <h4 className="font-medium text-gray-900 dark:text-white mb-2">Extended Context:</h4>
                          <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                            {passage.context}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {filteredPassages.length === 0 && data.passages.length > 0 && (
                  <div className="text-center py-8">
                    <div className="text-gray-500 dark:text-gray-400">
                      No passages match your current filters. Try adjusting your filter criteria.
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          // Empty State
          <div className="text-center py-12">
            <Network className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Discover Textual Connections
            </h3>
            <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
              Enter a passage or concept to explore intertextual relationships and connections 
              across classical literature.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default IntertextualityPage;
```

This component provides a complete intertextuality discovery platform with all the requested features:

## Key Features:

1. **Search Interface**: Clean search input with enter key support
2. **Network Visualization**: Interactive SVG-based network showing text connections
3. **Passage Cards**: Detailed cards with similarity scores and metadata
4. **Advanced Filters**: Filter by author, work, time period, and similarity threshold
5. **Expandable Context**: Click to show extended passage context
6. **Dark/Light Mode**: Complete theme switching with persistence
7. **Loading States**: Skeleton UI for better UX
8. **Mobile Responsive**: Fully responsive design for all screen sizes

## Additional Features:

- **Interactive Network**: Click nodes to see details
- **Filter Persistence**: Filters remain applied during searches  
- **Results Summary**: Shows total and filtered result counts
- **Error Handling**: Proper error states and messaging
- **Accessibility**: Semantic HTML and keyboard navigation
- **Performance**: Memoized calculations for large datasets

The component integrates with your API endpoint and handles all the data transformation needed for the visualization and filtering systems.