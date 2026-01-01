'use client';

import { useState, useEffect } from 'react';
import { Card, Button, Input, Badge, LoadingSpinner, Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui';
import { formatNumber } from '@/lib/utils';

// Sample admin data
const SAMPLE_STATS = {
  totalPassages: 6712847,
  totalAuthors: 74927,
  totalWorks: 152341,
  searchesThisMonth: 245892,
  translationsThisMonth: 45621,
  activeUsers: 12847,
  apiCalls: 1523456,
  avgResponseTime: 145,
};

const RECENT_ACTIVITY = [
  { action: 'Search', query: 'λόγος', user: 'user_123', time: '2 min ago' },
  { action: 'Translation', text: 'Arma virumque...', user: 'user_456', time: '5 min ago' },
  { action: 'Analysis', word: 'virtus', user: 'user_789', time: '8 min ago' },
  { action: 'Search', query: 'Plato Republic', user: 'user_234', time: '12 min ago' },
  { action: 'Reader', author: 'Homer', user: 'user_567', time: '15 min ago' },
];

const CORPUS_SOURCES = [
  { name: 'Perseus Digital Library', passages: 2450000, status: 'active' },
  { name: 'First1KGreek', passages: 1850000, status: 'active' },
  { name: 'Latin Library', passages: 1200000, status: 'active' },
  { name: 'PHI Latin Texts', passages: 890000, status: 'active' },
  { name: 'Biblical Texts', passages: 322847, status: 'active' },
];

export default function ResearchPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(SAMPLE_STATS);

  // Check session storage for auth
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isAuth = sessionStorage.getItem('logos_research_auth');
      if (isAuth === 'true') {
        setAuthenticated(true);
      }
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Simple password check (in production would be proper auth)
    setTimeout(() => {
      if (password === 'logos2024' || password === 'admin') {
        setAuthenticated(true);
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('logos_research_auth', 'true');
        }
      } else {
        setError('Invalid password');
      }
      setLoading(false);
    }, 500);
  };

  const handleLogout = () => {
    setAuthenticated(false);
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('logos_research_auth');
    }
  };

  // Login screen
  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <Card padding="lg" className="w-full max-w-md">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-[#C9A962] mb-2">Research Dashboard</h1>
            <p className="text-[#F5F3EF]/60 text-sm">
              Enter password to access admin features
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password..."
              className="text-center"
            />

            {error && (
              <p className="text-red-400 text-sm text-center">{error}</p>
            )}

            <Button type="submit" className="w-full" loading={loading}>
              Access Dashboard
            </Button>
          </form>

          <p className="text-xs text-[#F5F3EF]/30 text-center mt-6">
            For authorized researchers only
          </p>
        </Card>
      </div>
    );
  }

  // Admin dashboard
  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-b from-[#C9A962]/10 to-transparent py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-[#C9A962]">Research Dashboard</h1>
              <p className="text-[#F5F3EF]/60">LOGOS Admin & Analytics</p>
            </div>
            <Button variant="ghost" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Passages', value: formatNumber(stats.totalPassages), icon: '📜' },
            { label: 'Total Authors', value: formatNumber(stats.totalAuthors), icon: '✍️' },
            { label: 'Total Works', value: formatNumber(stats.totalWorks), icon: '📚' },
            { label: 'API Calls', value: formatNumber(stats.apiCalls), icon: '🔗' },
          ].map((stat) => (
            <Card key={stat.label} className="text-center">
              <div className="text-2xl mb-2">{stat.icon}</div>
              <div className="text-2xl font-bold text-[#C9A962]">{stat.value}</div>
              <div className="text-sm text-[#F5F3EF]/50">{stat.label}</div>
            </Card>
          ))}
        </div>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="corpus">Corpus</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="api">API</TabsTrigger>
          </TabsList>

          {/* Overview */}
          <TabsContent value="overview">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Usage stats */}
              <Card padding="lg">
                <h3 className="font-semibold text-[#C9A962] mb-4">Monthly Usage</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-[#C9A962]/10 rounded-lg text-center">
                    <div className="text-2xl font-bold text-[#C9A962]">
                      {formatNumber(stats.searchesThisMonth)}
                    </div>
                    <div className="text-sm text-[#F5F3EF]/50">Searches</div>
                  </div>
                  <div className="p-4 bg-[#C9A962]/10 rounded-lg text-center">
                    <div className="text-2xl font-bold text-[#C9A962]">
                      {formatNumber(stats.translationsThisMonth)}
                    </div>
                    <div className="text-sm text-[#F5F3EF]/50">Translations</div>
                  </div>
                  <div className="p-4 bg-[#C9A962]/10 rounded-lg text-center">
                    <div className="text-2xl font-bold text-[#C9A962]">
                      {formatNumber(stats.activeUsers)}
                    </div>
                    <div className="text-sm text-[#F5F3EF]/50">Active Users</div>
                  </div>
                  <div className="p-4 bg-[#C9A962]/10 rounded-lg text-center">
                    <div className="text-2xl font-bold text-[#C9A962]">
                      {stats.avgResponseTime}ms
                    </div>
                    <div className="text-sm text-[#F5F3EF]/50">Avg Response</div>
                  </div>
                </div>
              </Card>

              {/* Recent activity */}
              <Card padding="lg">
                <h3 className="font-semibold text-[#C9A962] mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  {RECENT_ACTIVITY.map((activity, i) => (
                    <div key={i} className="flex items-center justify-between p-2 hover:bg-[#C9A962]/5 rounded">
                      <div className="flex items-center gap-3">
                        <Badge size="sm">{activity.action}</Badge>
                        <span className="text-sm text-[#F5F3EF]/80">
                          {activity.query || activity.word || activity.author || activity.text?.slice(0, 20) + '...'}
                        </span>
                      </div>
                      <span className="text-xs text-[#F5F3EF]/40">{activity.time}</span>
                    </div>
                  ))}
                </div>
              </Card>

              {/* System health */}
              <Card padding="lg">
                <h3 className="font-semibold text-[#C9A962] mb-4">System Health</h3>
                <div className="space-y-4">
                  {[
                    { name: 'API Server', status: 'operational', uptime: '99.9%' },
                    { name: 'Database', status: 'operational', uptime: '99.8%' },
                    { name: 'Search Index', status: 'operational', uptime: '99.9%' },
                    { name: 'Translation Engine', status: 'operational', uptime: '99.5%' },
                  ].map((service) => (
                    <div key={service.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500" />
                        <span>{service.name}</span>
                      </div>
                      <span className="text-sm text-[#F5F3EF]/50">{service.uptime}</span>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Quick actions */}
              <Card padding="lg">
                <h3 className="font-semibold text-[#C9A962] mb-4">Quick Actions</h3>
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="secondary" size="sm">Refresh Cache</Button>
                  <Button variant="secondary" size="sm">Export Data</Button>
                  <Button variant="secondary" size="sm">Run Indexer</Button>
                  <Button variant="secondary" size="sm">View Logs</Button>
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* Corpus */}
          <TabsContent value="corpus">
            <div className="space-y-6">
              <Card padding="lg">
                <h3 className="font-semibold text-[#C9A962] mb-4">Corpus Sources</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-[#C9A962]/20">
                        <th className="py-3 px-4 text-left">Source</th>
                        <th className="py-3 px-4 text-right">Passages</th>
                        <th className="py-3 px-4 text-center">Status</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {CORPUS_SOURCES.map((source) => (
                        <tr key={source.name} className="border-b border-[#C9A962]/10">
                          <td className="py-3 px-4">{source.name}</td>
                          <td className="py-3 px-4 text-right text-[#C9A962]">
                            {formatNumber(source.passages)}
                          </td>
                          <td className="py-3 px-4 text-center">
                            <Badge variant="success">{source.status}</Badge>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <Button variant="ghost" size="sm">Manage</Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>

              <div className="grid md:grid-cols-2 gap-6">
                <Card padding="lg">
                  <h3 className="font-semibold text-[#C9A962] mb-4">Add New Source</h3>
                  <div className="space-y-4">
                    <Input placeholder="Source name" />
                    <Input placeholder="Source URL or path" />
                    <select className="w-full px-4 py-2 bg-[#0D0D0F] border border-[#C9A962]/20 rounded-lg">
                      <option>Select format</option>
                      <option>TEI XML</option>
                      <option>Plain Text</option>
                      <option>JSON</option>
                      <option>CSV</option>
                    </select>
                    <Button className="w-full">Import Source</Button>
                  </div>
                </Card>

                <Card padding="lg">
                  <h3 className="font-semibold text-[#C9A962] mb-4">Corpus Statistics</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-[#F5F3EF]/60">Greek passages</span>
                      <span className="text-[#C9A962]">{formatNumber(4250000)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#F5F3EF]/60">Latin passages</span>
                      <span className="text-[#C9A962]">{formatNumber(2140000)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#F5F3EF]/60">Hebrew passages</span>
                      <span className="text-[#C9A962]">{formatNumber(322847)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#F5F3EF]/60">Total unique words</span>
                      <span className="text-[#C9A962]">{formatNumber(2450000)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#F5F3EF]/60">Last updated</span>
                      <span className="text-[#C9A962]">2 hours ago</span>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Analytics */}
          <TabsContent value="analytics">
            <div className="grid md:grid-cols-2 gap-6">
              <Card padding="lg">
                <h3 className="font-semibold text-[#C9A962] mb-4">Top Searches (This Month)</h3>
                <div className="space-y-3">
                  {[
                    { term: 'λόγος', count: 12450 },
                    { term: 'amor', count: 9823 },
                    { term: 'Plato', count: 8756 },
                    { term: 'virtue', count: 7234 },
                    { term: 'Homer Iliad', count: 6543 },
                  ].map((search, i) => (
                    <div key={search.term} className="flex items-center gap-3">
                      <span className="text-[#C9A962]/50 w-6">{i + 1}.</span>
                      <span className="flex-1">{search.term}</span>
                      <span className="text-[#C9A962]">{formatNumber(search.count)}</span>
                    </div>
                  ))}
                </div>
              </Card>

              <Card padding="lg">
                <h3 className="font-semibold text-[#C9A962] mb-4">Popular Authors</h3>
                <div className="space-y-3">
                  {[
                    { author: 'Plato', views: 45230 },
                    { author: 'Homer', views: 38920 },
                    { author: 'Aristotle', views: 32450 },
                    { author: 'Cicero', views: 28340 },
                    { author: 'Virgil', views: 24560 },
                  ].map((author, i) => (
                    <div key={author.author} className="flex items-center gap-3">
                      <span className="text-[#C9A962]/50 w-6">{i + 1}.</span>
                      <span className="flex-1">{author.author}</span>
                      <span className="text-[#C9A962]">{formatNumber(author.views)}</span>
                    </div>
                  ))}
                </div>
              </Card>

              <Card padding="lg" className="md:col-span-2">
                <h3 className="font-semibold text-[#C9A962] mb-4">Usage Over Time</h3>
                <div className="h-48 flex items-end justify-between gap-2">
                  {[65, 72, 80, 68, 85, 92, 78, 88, 95, 82, 75, 90].map((value, i) => (
                    <div
                      key={i}
                      className="flex-1 bg-[#C9A962]/20 rounded-t transition-all hover:bg-[#C9A962]/40"
                      style={{ height: `${value}%` }}
                      title={`Month ${i + 1}: ${value}%`}
                    />
                  ))}
                </div>
                <div className="flex justify-between mt-2 text-xs text-[#F5F3EF]/40">
                  <span>Jan</span>
                  <span>Dec</span>
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* API */}
          <TabsContent value="api">
            <div className="space-y-6">
              <Card padding="lg">
                <h3 className="font-semibold text-[#C9A962] mb-4">API Endpoints</h3>
                <div className="space-y-3">
                  {[
                    { endpoint: '/api/search', method: 'POST', calls: 125430, status: 'active' },
                    { endpoint: '/api/translate', method: 'POST', calls: 45621, status: 'active' },
                    { endpoint: '/api/authors', method: 'GET', calls: 34520, status: 'active' },
                    { endpoint: '/api/passages', method: 'GET', calls: 28340, status: 'active' },
                    { endpoint: '/api/stats', method: 'GET', calls: 12450, status: 'active' },
                  ].map((api) => (
                    <div key={api.endpoint} className="flex items-center justify-between p-3 bg-[#C9A962]/5 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Badge size="sm" variant={api.method === 'GET' ? 'success' : 'default'}>
                          {api.method}
                        </Badge>
                        <code className="text-sm">{api.endpoint}</code>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-[#F5F3EF]/50">{formatNumber(api.calls)} calls</span>
                        <div className="w-2 h-2 rounded-full bg-green-500" />
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card padding="lg">
                <h3 className="font-semibold text-[#C9A962] mb-4">API Keys</h3>
                <div className="space-y-4">
                  <div className="p-4 bg-[#C9A962]/5 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">Production Key</span>
                      <Badge variant="success">Active</Badge>
                    </div>
                    <code className="text-sm text-[#F5F3EF]/60">sk_live_••••••••••••••••</code>
                  </div>
                  <Button variant="secondary" size="sm">Generate New Key</Button>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
