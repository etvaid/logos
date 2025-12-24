'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function PhilosophyTool() {
  const [arguments, setArguments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newArgument, setNewArgument] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/arguments');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setArguments(data);
        setLoading(false);
      } catch (e: any) {
        setError(e.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (e: any) => {
    setNewArgument(e.target.value);
  };

  const addArgument = async () => {
    try {
      const response = await fetch('/api/arguments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: newArgument }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const newArgumentData = await response.json();
      setArguments([...arguments, newArgumentData]);
      setNewArgument('');
    } catch (e: any) {
      setError(e.message);
    }
  };


  return (
    <div style={{ backgroundColor: '#0D0D0F', color: '#F5F4F2', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {/* Nav Bar */}
      <nav style={{ backgroundColor: '#1E1E24', padding: '16px 24px', borderBottom: '1px solid rgba(201,162,39,0.2)', width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href="/" style={{ color: '#F5F4F2', fontWeight: 'bold', fontSize: '1.2rem', textDecoration: 'none' }}>
          LOGOS
        </Link>
        <div>
          <Link href="/tools" style={{ color: '#9CA3AF', textDecoration: 'none', margin: '0 12px' }}>Tools</Link>
          <Link href="/about" style={{ color: '#9CA3AF', textDecoration: 'none', margin: '0 12px' }}>About</Link>
        </div>
      </nav>

      {/* Main Content */}
      <main style={{ maxWidth: '960px', width: '100%', padding: '24px' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '24px', color: '#F5F4F2' }}>Philosophy Argument Mapper</h1>

        {loading && <p style={{ textAlign: 'center', color: '#9CA3AF' }}>Loading arguments...</p>}
        {error && <p style={{ textAlign: 'center', color: '#DC2626' }}>Error: {error}</p>}

        {!loading && !error && arguments.length === 0 && (
          <p style={{ textAlign: 'center', color: '#9CA3AF' }}>No arguments found. Add one below!</p>
        )}

        <div style={{ marginBottom: '24px' }}>
          <input
            type="text"
            placeholder="Enter new argument..."
            value={newArgument}
            onChange={handleInputChange}
            style={{ backgroundColor: '#0D0D0F', border: '1px solid #4B5563', borderRadius: 8, padding: '12px 16px', color: '#F5F4F2', width: '100%', marginBottom: '12px' }}
          />
          <button
            onClick={addArgument}
            style={{ backgroundColor: '#C9A227', color: '#0D0D0F', padding: '12px 24px', borderRadius: 8, fontWeight: 'bold', cursor: 'pointer', width: '100%' }}
          >
            Add Argument
          </button>
        </div>

        {arguments.map((arg: any) => (
          <div key={arg.id} style={{ backgroundColor: '#1E1E24', borderRadius: 12, padding: 24, marginBottom: '16px', transition: 'all 0.2s', ':hover': { boxShadow: '0 0 30px rgba(201,162,39,0.3)' } }}>
            <p style={{ color: '#F5F4F2' }}>{arg.text}</p>
          </div>
        ))}
      </main>
    </div>
  );
}