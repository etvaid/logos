'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function ExportTool() {
  const [exportType, setExportType] = useState('json');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/data?type=${exportType}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        setData(result);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [exportType]);

  const handleExport = async () => {
    setExporting(true);
    try {
      const response = await fetch(`/api/export?type=${exportType}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `logos_export.${exportType}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

    } catch (e: any) {
      setError(e.message);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#0D0D0F', color: '#F5F4F2', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingBottom: '48px' }}>
      <nav style={{ backgroundColor: '#1E1E24', padding: '16px 24px', borderBottom: '1px solid rgba(201,162,39,0.2)', width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href="/" style={{ color: '#C9A227', fontWeight: 'bold', fontSize: '1.2rem', textDecoration: 'none' }}>
          LOGOS
        </Link>
        <div>
          <Link href="/" style={{ color: '#9CA3AF', textDecoration: 'none', marginRight: '16px' }}>Home</Link>
          <Link href="/tools" style={{ color: '#9CA3AF', textDecoration: 'none' }}>Tools</Link>
        </div>
      </nav>

      <div style={{ maxWidth: '960px', width: '100%', padding: '24px' }}>
        <h1 style={{ color: '#F5F4F2', marginBottom: '24px' }}>Bulk Export Tool</h1>

        <div style={{ backgroundColor: '#1E1E24', borderRadius: '12px', padding: '24px', marginBottom: '24px' }}>
          <label htmlFor="exportType" style={{ display: 'block', marginBottom: '8px', color: '#9CA3AF' }}>Export Type:</label>
          <select
            id="exportType"
            value={exportType}
            onChange={(e) => setExportType(e.target.value)}
            style={{ backgroundColor: '#0D0D0F', border: '1px solid #4B5563', borderRadius: '8px', padding: '12px 16px', color: '#F5F4F2', width: '100%', marginBottom: '16px' }}
          >
            <option value="json">JSON</option>
            <option value="csv">CSV</option>
            <option value="tei">TEI-XML</option>
          </select>

          <button
            onClick={handleExport}
            disabled={exporting || loading || !data}
            style={{
              backgroundColor: '#C9A227',
              color: '#0D0D0F',
              padding: '12px 24px',
              borderRadius: '8px',
              fontWeight: 'bold',
              cursor: exporting || loading || !data ? 'not-allowed' : 'pointer',
              opacity: exporting || loading || !data ? 0.5 : 1,
              transition: 'all 0.2s',
              boxShadow: exporting || loading || !data ? 'none' : '0 0 10px rgba(201,162,39,0.3)'
            }}
          >
            {exporting ? 'Exporting...' : 'Export'}
          </button>
        </div>

        {loading && <div style={{ color: '#9CA3AF' }}>Loading data...</div>}
        {error && <div style={{ color: '#DC2626' }}>Error: {error}</div>}
        {data && (
          <div style={{ backgroundColor: '#1E1E24', borderRadius: '12px', padding: '24px' }}>
            <h2 style={{ color: '#F5F4F2', marginBottom: '16px' }}>Data Preview</h2>
            <pre style={{ backgroundColor: '#141419', color: '#9CA3AF', padding: '16px', borderRadius: '8px', overflowX: 'auto' }}>
              {JSON.stringify(data, null, 2)}
            </pre>
          </div>
        )}

        {!loading && !error && !data && (
          <div style={{ color: '#9CA3AF' }}>No data available.</div>
        )}
      </div>
    </div>
  );
}