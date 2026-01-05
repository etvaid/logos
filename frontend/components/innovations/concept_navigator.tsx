'use client';

/**
 * LOGOS Concept Navigator
 * Phase 8: Cross-language concept exploration UI
 *
 * Allows users to search for concepts across Greek, Latin, Hebrew texts
 * and explore semantic clusters.
 */

import React, { useState, useCallback } from 'react';

interface ClusterSummary {
  clusterId: string;
  name: string | null;
  memberCount: number;
  languages: string[];
  topTerms: Record<string, string[]>;
}

interface ClusterMember {
  urn: string;
  language: string;
  snippet: string | null;
  distance: number | null;
}

interface ClusterDetail extends ClusterSummary {
  description: string | null;
  members: ClusterMember[];
}

const LANGUAGE_LABELS: Record<string, string> = {
  greek: 'Greek',
  latin: 'Latin',
  hebrew: 'Hebrew',
  aramaic: 'Aramaic',
  english: 'English'
};

const LANGUAGE_COLORS: Record<string, string> = {
  greek: 'bg-blue-100 text-blue-800',
  latin: 'bg-amber-100 text-amber-800',
  hebrew: 'bg-green-100 text-green-800',
  aramaic: 'bg-purple-100 text-purple-800',
  english: 'bg-gray-100 text-gray-800'
};

export default function ConceptNavigator() {
  const [query, setQuery] = useState('');
  const [clusters, setClusters] = useState<ClusterSummary[]>([]);
  const [selectedCluster, setSelectedCluster] = useState<ClusterDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchTime, setSearchTime] = useState<number | null>(null);

  const searchConcepts = useCallback(async () => {
    if (!query.trim()) return;

    setLoading(true);
    setSelectedCluster(null);

    try {
      const res = await fetch(`/api/semantia/concept_navigator/search?query=${encodeURIComponent(query)}&limit=20`);
      const data = await res.json();

      setClusters(data.clusters || []);
      setSearchTime(data.latencyMs);
    } catch (error) {
      console.error('Search failed:', error);
      setClusters([]);
    } finally {
      setLoading(false);
    }
  }, [query]);

  const loadCluster = useCallback(async (clusterId: string) => {
    setLoading(true);

    try {
      const res = await fetch(`/api/semantia/concept_navigator/cluster/${clusterId}`);
      const data = await res.json();
      setSelectedCluster(data);
    } catch (error) {
      console.error('Failed to load cluster:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      searchConcepts();
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Concept Navigator
        </h1>
        <p className="text-gray-600">
          Explore cross-language concepts in Greek, Latin, and Hebrew texts.
          Search by concept (e.g., "justice", "love", "war") to find related passages across languages.
        </p>
      </div>

      {/* Search */}
      <div className="mb-8">
        <div className="flex gap-4">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search concepts (e.g., 'wisdom', 'virtue', 'death')..."
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            onClick={searchConcepts}
            disabled={loading || !query.trim()}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
        {searchTime !== null && (
          <p className="mt-2 text-sm text-gray-500">
            Found {clusters.length} concept clusters in {searchTime}ms
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Cluster List */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Concept Clusters</h2>
          {clusters.length === 0 && !loading && (
            <p className="text-gray-500">
              Search for a concept to explore cross-language clusters.
            </p>
          )}
          <div className="space-y-4">
            {clusters.map((cluster) => (
              <div
                key={cluster.clusterId}
                onClick={() => loadCluster(cluster.clusterId)}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedCluster?.clusterId === cluster.clusterId
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {cluster.name || 'Unnamed Cluster'}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {cluster.memberCount} passages
                    </p>
                  </div>
                  <div className="flex gap-1">
                    {cluster.languages.map((lang) => (
                      <span
                        key={lang}
                        className={`px-2 py-0.5 text-xs rounded ${LANGUAGE_COLORS[lang] || 'bg-gray-100'}`}
                      >
                        {LANGUAGE_LABELS[lang] || lang}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Top terms preview */}
                <div className="flex flex-wrap gap-1 mt-2">
                  {Object.entries(cluster.topTerms).slice(0, 2).flatMap(([lang, terms]) =>
                    (terms as string[]).slice(0, 3).map((term, i) => (
                      <span
                        key={`${lang}-${i}`}
                        className="px-2 py-0.5 text-xs bg-gray-100 rounded"
                      >
                        {term}
                      </span>
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cluster Detail */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Cluster Detail</h2>
          {!selectedCluster && (
            <p className="text-gray-500">
              Select a cluster to see its members.
            </p>
          )}
          {selectedCluster && (
            <div className="border rounded-lg p-4">
              <h3 className="text-lg font-medium mb-2">
                {selectedCluster.name || 'Unnamed Cluster'}
              </h3>
              {selectedCluster.description && (
                <p className="text-gray-600 mb-4">{selectedCluster.description}</p>
              )}

              {/* Top terms by language */}
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Top Terms</h4>
                <div className="space-y-2">
                  {Object.entries(selectedCluster.topTerms).map(([lang, terms]) => (
                    <div key={lang} className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 text-xs rounded ${LANGUAGE_COLORS[lang] || 'bg-gray-100'}`}>
                        {LANGUAGE_LABELS[lang] || lang}
                      </span>
                      <span className="text-sm text-gray-600">
                        {(terms as string[]).join(', ')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Members */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Passages ({selectedCluster.members.length})
                </h4>
                <div className="max-h-96 overflow-y-auto space-y-3">
                  {selectedCluster.members.map((member, i) => (
                    <div key={i} className="p-3 bg-gray-50 rounded text-sm">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-2 py-0.5 text-xs rounded ${LANGUAGE_COLORS[member.language] || 'bg-gray-100'}`}>
                          {LANGUAGE_LABELS[member.language] || member.language}
                        </span>
                        <span className="text-xs text-gray-400 truncate">
                          {member.urn}
                        </span>
                      </div>
                      {member.snippet && (
                        <p className="text-gray-700 line-clamp-3">
                          {member.snippet}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
