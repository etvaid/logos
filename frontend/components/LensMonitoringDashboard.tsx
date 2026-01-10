'use client';

import React, { useState, useEffect } from 'react';

interface SystemHealth {
  tables: Array<{
    table: string;
    row_count: number;
    size: string;
  }>;
  recent_jobs: Array<{
    job_type: string;
    status: string;
    processed: number;
    started_at: string;
    finished_at: string | null;
  }>;
}

interface FacetDistribution {
  facet: string;
  avg_score: number;
  stddev: number;
  high_count: number;
  medium_count: number;
  low_count: number;
}

export default function LensMonitoringDashboard() {
  const [health, setHealth] = useState<SystemHealth | null>(null);
  const [distribution, setDistribution] = useState<FacetDistribution[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [autoRefresh, setAutoRefresh] = useState(true);

  const fetchData = async () => {
    try {
      // Fetch health metrics
      const healthResponse = await fetch('/api/lens/analytics?metric=health');
      const healthData = await healthResponse.json();
      setHealth(healthData);

      // Fetch distribution
      const distResponse = await fetch('/api/lens/analytics?metric=distribution');
      const distData = await distResponse.json();
      setDistribution(distData.facets || []);

      setLastUpdate(new Date());
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch monitoring data:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    if (autoRefresh) {
      const interval = setInterval(fetchData, 30000); // Refresh every 30 seconds
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'done': return 'text-green-600 bg-green-100';
      case 'running': return 'text-blue-600 bg-blue-100';
      case 'paused': return 'text-yellow-600 bg-yellow-100';
      case 'failed': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat().format(num);
  };

  const formatTimestamp = (timestamp: string | null): string => {
    if (!timestamp) return 'N/A';
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">LOGOS Lens Monitoring</h1>
          <p className="text-sm text-gray-600 mt-1">
            Last updated: {lastUpdate.toLocaleTimeString()}
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`px-4 py-2 rounded font-medium ${
              autoRefresh
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            {autoRefresh ? '🔄 Auto-refresh ON' : 'Auto-refresh OFF'}
          </button>
          <button
            onClick={fetchData}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded font-medium hover:bg-gray-300"
          >
            🔄 Refresh Now
          </button>
        </div>
      </div>

      {/* System Health */}
      {health && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">System Health</h2>

          <div className="grid grid-cols-2 gap-4 mb-6">
            {health.tables.map((table, idx) => (
              <div key={idx} className="border rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-semibold text-gray-700">
                    {table.table}
                  </span>
                  <span className="text-xs text-gray-500">{table.size}</span>
                </div>
                <div className="text-2xl font-bold text-blue-600">
                  {formatNumber(table.row_count)}
                </div>
                <div className="text-xs text-gray-500">rows</div>
              </div>
            ))}
          </div>

          {/* Recent Jobs */}
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Recent Jobs</h3>
          <div className="space-y-2">
            {health.recent_jobs.slice(0, 5).map((job, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div className="flex-1">
                  <div className="font-medium text-gray-800">{job.job_type}</div>
                  <div className="text-xs text-gray-600">
                    Started: {formatTimestamp(job.started_at)}
                    {job.finished_at && ` • Finished: ${formatTimestamp(job.finished_at)}`}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-700">
                    {formatNumber(job.processed)} processed
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(job.status)}`}>
                    {job.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Facet Distribution */}
      {distribution.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Facet Distribution</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {distribution.map((facet, idx) => {
              const total = facet.high_count + facet.medium_count + facet.low_count;
              const highPct = total > 0 ? (facet.high_count / total * 100) : 0;
              const mediumPct = total > 0 ? (facet.medium_count / total * 100) : 0;
              const lowPct = total > 0 ? (facet.low_count / total * 100) : 0;

              return (
                <div key={idx} className="border rounded-lg p-4">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-bold text-gray-800 capitalize">{facet.facet}</h3>
                    <span className="text-sm text-gray-600">
                      avg: {facet.avg_score.toFixed(3)}
                    </span>
                  </div>

                  {/* Distribution bars */}
                  <div className="space-y-2 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-600 w-16">High ≥0.70</span>
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-600 h-2 rounded-full"
                          style={{ width: `${highPct}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-600 w-16 text-right">
                        {formatNumber(facet.high_count)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-600 w-16">Med 0.50-0.70</span>
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-yellow-600 h-2 rounded-full"
                          style={{ width: `${mediumPct}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-600 w-16 text-right">
                        {formatNumber(facet.medium_count)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-600 w-16">Low &lt;0.50</span>
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gray-400 h-2 rounded-full"
                          style={{ width: `${lowPct}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-600 w-16 text-right">
                        {formatNumber(facet.low_count)}
                      </span>
                    </div>
                  </div>

                  <div className="text-xs text-gray-500">
                    σ = {facet.stddev.toFixed(3)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* System Status Indicators */}
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 text-center">
          <div className="text-4xl mb-2">🎯</div>
          <div className="text-2xl font-bold text-blue-800">
            {distribution.length}
          </div>
          <div className="text-sm text-blue-700">Active Facets</div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 text-center">
          <div className="text-4xl mb-2">🔗</div>
          <div className="text-2xl font-bold text-green-800">
            {health?.tables.find(t => t.table === 'knowledge_nodes_v2')?.row_count || 0}
          </div>
          <div className="text-sm text-green-700">Knowledge Nodes</div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6 text-center">
          <div className="text-4xl mb-2">📊</div>
          <div className="text-2xl font-bold text-purple-800">
            {formatNumber(health?.tables.find(t => t.table === 'passage_facets_v2')?.row_count || 0)}
          </div>
          <div className="text-sm text-purple-700">Scored Passages</div>
        </div>
      </div>
    </div>
  );
}
