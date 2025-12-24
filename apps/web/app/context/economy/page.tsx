'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function EconomyPage() {
  const [economicData, setEconomicData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/economy');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setEconomicData(data);
      } catch (e) {
        setError(e);
        console.error("Failed to fetch economy data:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div style={{ backgroundColor: '#0D0D0F', color: '#F5F4F2', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Navigation Bar */}
      <nav style={{ backgroundColor: '#1E1E24', padding: '16px 24px', borderBottom: '1px solid rgba(201,162,39,0.2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href="/" style={{ color: '#C9A227', fontWeight: 'bold', fontSize: '1.2rem', textDecoration: 'none' }}>
          LOGOS
        </Link>
        <div>
          <Link href="/context/economy" style={{ color: '#F5F4F2', textDecoration: 'none', marginRight: '16px' }}>Economy</Link>
          <Link href="/context/culture" style={{ color: '#F5F4F2', textDecoration: 'none', marginRight: '16px' }}>Culture</Link>
          <Link href="/context/politics" style={{ color: '#F5F4F2', textDecoration: 'none' }}>Politics</Link>
        </div>
      </nav>

      {/* Main Content */}
      <main style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
        <h1 style={{ color: '#F5F4F2', marginBottom: '24px' }}>Ancient Economy</h1>

        {loading && (
          <div style={{ textAlign: 'center', fontSize: '1.2rem', color: '#9CA3AF' }}>Loading economic data...</div>
        )}

        {error && (
          <div style={{ color: '#DC2626', marginBottom: '16px' }}>Error: {error.message}</div>
        )}

        {economicData ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
            {economicData.prices && economicData.prices.length > 0 ? (
              <div style={{ backgroundColor: '#1E1E24', borderRadius: 12, padding: 24 }}>
                <h2 style={{ color: '#F5F4F2', marginBottom: '12px' }}>Prices</h2>
                <ul>
                  {economicData.prices.map((price, index) => (
                    <li key={index} style={{ color: '#9CA3AF', marginBottom: '8px' }}>
                      {price.item}: {price.price}
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div style={{ backgroundColor: '#1E1E24', borderRadius: 12, padding: 24, color: '#9CA3AF' }}>No price data available.</div>
            )}

            {economicData.wages && economicData.wages.length > 0 ? (
              <div style={{ backgroundColor: '#1E1E24', borderRadius: 12, padding: 24 }}>
                <h2 style={{ color: '#F5F4F2', marginBottom: '12px' }}>Wages</h2>
                <ul>
                  {economicData.wages.map((wage, index) => (
                    <li key={index} style={{ color: '#9CA3AF', marginBottom: '8px' }}>
                      {wage.occupation}: {wage.wage}
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div style={{ backgroundColor: '#1E1E24', borderRadius: 12, padding: 24, color: '#9CA3AF' }}>No wage data available.</div>
            )}

            {economicData.trade && economicData.trade.length > 0 ? (
              <div style={{ backgroundColor: '#1E1E24', borderRadius: 12, padding: 24 }}>
                <h2 style={{ color: '#F5F4F2', marginBottom: '12px' }}>Trade Data</h2>
                <ul>
                  {economicData.trade.map((trade, index) => (
                    <li key={index} style={{ color: '#9CA3AF', marginBottom: '8px' }}>
                      {trade.item}: {trade.volume}
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div style={{ backgroundColor: '#1E1E24', borderRadius: 12, padding: 24, color: '#9CA3AF' }}>No trade data available.</div>
            )}
          </div>
        ) : !loading && !error ? (
          <div style={{ color: '#9CA3AF' }}>No economic data available.</div>
        ) : null}
      </main>
    </div>
  );
}