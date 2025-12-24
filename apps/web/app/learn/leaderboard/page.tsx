'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function LeaderboardPage() {
  const [leaderboardData, setLeaderboardData] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeframe, setTimeframe] = useState('week'); // week, month, all-time

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/leaderboard?timeframe=${timeframe}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setLeaderboardData(data);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [timeframe]);

  const handleTimeframeChange = (newTimeframe: string) => {
    setTimeframe(newTimeframe);
  };

  return (
    <div style={{ backgroundColor: '#0D0D0F', color: '#F5F4F2', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Nav Bar */}
      <nav style={{ backgroundColor: '#1E1E24', padding: '16px 24px', borderBottom: '1px solid rgba(201,162,39,0.2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href="/" style={{ color: '#C9A227', fontWeight: 'bold', fontSize: '1.2em', textDecoration: 'none' }}>
          LOGOS
        </Link>
        <div>
          <Link href="/learn" style={{ color: '#9CA3AF', textDecoration: 'none', marginRight: '16px' }}>Learn</Link>
          <Link href="/research" style={{ color: '#9CA3AF', textDecoration: 'none' }}>Research</Link>
        </div>
      </nav>

      {/* Main Content */}
      <main style={{ padding: '24px', maxWidth: '960px', margin: '0 auto', flex: '1' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '24px' }}>Community Leaderboard</h1>

        {/* Timeframe Selection */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
          <button
            style={{
              backgroundColor: timeframe === 'week' ? '#C9A227' : '#1E1E24',
              color: timeframe === 'week' ? '#0D0D0F' : '#F5F4F2',
              padding: '12px 24px',
              borderRadius: '8px',
              fontWeight: 'bold',
              marginRight: '8px',
              cursor: 'pointer',
              transition: 'all 0.2s',
              border: 'none',
            }}
            onClick={() => handleTimeframeChange('week')}
          >
            This Week
          </button>
          <button
            style={{
              backgroundColor: timeframe === 'month' ? '#C9A227' : '#1E1E24',
              color: timeframe === 'month' ? '#0D0D0F' : '#F5F4F2',
              padding: '12px 24px',
              borderRadius: '8px',
              fontWeight: 'bold',
              marginRight: '8px',
              cursor: 'pointer',
              transition: 'all 0.2s',
              border: 'none',
            }}
            onClick={() => handleTimeframeChange('month')}
          >
            This Month
          </button>
          <button
            style={{
              backgroundColor: timeframe === 'all-time' ? '#C9A227' : '#1E1E24',
              color: timeframe === 'all-time' ? '#0D0D0F' : '#F5F4F2',
              padding: '12px 24px',
              borderRadius: '8px',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.2s',
              border: 'none',
            }}
            onClick={() => handleTimeframeChange('all-time')}
          >
            All Time
          </button>
        </div>


        {loading ? (
          <div style={{ textAlign: 'center', color: '#9CA3AF' }}>Loading leaderboard data...</div>
        ) : error ? (
          <div style={{ textAlign: 'center', color: '#DC2626' }}>Error: {error}</div>
        ) : leaderboardData.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#9CA3AF' }}>No leaderboard data available.</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {leaderboardData.map((entry: any, index: number) => (
              <div key={index} style={{ backgroundColor: '#1E1E24', borderRadius: '12px', padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span style={{ fontWeight: 'bold', marginRight: '8px' }}>{index + 1}.</span>
                  <span style={{ color: '#F5F4F2' }}>{entry.username}</span>
                </div>
                <span style={{ color: '#C9A227', fontWeight: 'bold' }}>{entry.score} points</span>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer style={{ textAlign: 'center', padding: '24px', color: '#6B7280' }}>
        © 2024 LOGOS Platform
      </footer>
    </div>
  );
}