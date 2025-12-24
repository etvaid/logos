'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface TranslationError {
  id: string;
  sourceText: string;
  translatedText: string;
  correctTranslation: string;
  errorType: string;
  severity: 'minor' | 'major' | 'critical';
  author: string;
  work: string;
  citation: string;
  language: 'greek' | 'latin';
  explanation: string;
  reportedBy: string;
  dateReported: string;
  status: 'pending' | 'verified' | 'disputed';
}

export default function TranslationErrors() {
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState<TranslationError[]>([]);
  const [filteredErrors, setFilteredErrors] = useState<TranslationError[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchErrors = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/translation-errors');
        if (!response.ok) throw new Error('Failed to fetch translation errors');
        const data = await response.json();
        setErrors(data);
        setFilteredErrors(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load translation errors');
      } finally {
        setLoading(false);
      }
    };

    fetchErrors();
  }, []);

  useEffect(() => {
    let filtered = errors.filter(error => {
      const matchesLanguage = selectedLanguage === 'all' || error.language === selectedLanguage;
      const matchesSeverity = selectedSeverity === 'all' || error.severity === selectedSeverity;
      const matchesStatus = selectedStatus === 'all' || error.status === selectedStatus;
      const matchesSearch = searchQuery === '' || 
        error.sourceText.toLowerCase().includes(searchQuery.toLowerCase()) ||
        error.translatedText.toLowerCase().includes(searchQuery.toLowerCase()) ||
        error.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        error.work.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesLanguage && matchesSeverity && matchesStatus && matchesSearch;
    });

    setFilteredErrors(filtered);
  }, [errors, selectedLanguage, selectedSeverity, selectedStatus, searchQuery]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return '#DC2626';
      case 'major': return '#F59E0B';
      case 'minor': return '#059669';
      default: return '#6B7280';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified': return '#059669';
      case 'disputed': return '#F59E0B';
      case 'pending': return '#6B7280';
      default: return '#6B7280';
    }
  };

  const getLanguageColor = (language: string) => {
    return language === 'greek' ? '#3B82F6' : '#DC2626';
  };

  if (loading) {
    return (
      <div style={{ backgroundColor: '#0D0D0F', minHeight: '100vh', color: '#F5F4F2' }}>
        <nav style={{ backgroundColor: '#1E1E24', padding: '16px 24px', borderBottom: '1px solid rgba(201,162,39,0.2)' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Link href="/" style={{ fontSize: '24px', fontWeight: 'bold', color: '#C9A227', textDecoration: 'none' }}>
              LOGOS
            </Link>
            <div style={{ display: 'flex', gap: '24px' }}>
              <Link href="/translate" style={{ color: '#F5F4F2', textDecoration: 'none', transition: 'color 0.2s' }}>
                Translate
              </Link>
              <Link href="/analyze" style={{ color: '#F5F4F2', textDecoration: 'none', transition: 'color 0.2s' }}>
                Analyze
              </Link>
              <Link href="/library" style={{ color: '#F5F4F2', textDecoration: 'none', transition: 'color 0.2s' }}>
                Library
              </Link>
            </div>
          </div>
        </nav>

        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '48px 24px', textAlign: 'center' }}>
          <div style={{ fontSize: '18px', color: '#9CA3AF' }}>Loading translation errors...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ backgroundColor: '#0D0D0F', minHeight: '100vh', color: '#F5F4F2' }}>
        <nav style={{ backgroundColor: '#1E1E24', padding: '16px 24px', borderBottom: '1px solid rgba(201,162,39,0.2)' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Link href="/" style={{ fontSize: '24px', fontWeight: 'bold', color: '#C9A227', textDecoration: 'none' }}>
              LOGOS
            </Link>
            <div style={{ display: 'flex', gap: '24px' }}>
              <Link href="/translate" style={{ color: '#F5F4F2', textDecoration: 'none', transition: 'color 0.2s' }}>
                Translate
              </Link>
              <Link href="/analyze" style={{ color: '#F5F4F2', textDecoration: 'none', transition: 'color 0.2s' }}>
                Analyze
              </Link>
              <Link href="/library" style={{ color: '#F5F4F2', textDecoration: 'none', transition: 'color 0.2s' }}>
                Library
              </Link>
            </div>
          </div>
        </nav>

        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '48px 24px', textAlign: 'center' }}>
          <div style={{ backgroundColor: '#1E1E24', borderRadius: '12px', padding: '48px', color: '#DC2626' }}>
            <h2 style={{ fontSize: '24px', marginBottom: '16px' }}>Error Loading Translation Errors</h2>
            <p style={{ fontSize: '16px', color: '#9CA3AF' }}>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#0D0D0F', minHeight: '100vh', color: '#F5F4F2' }}>
      <nav style={{ backgroundColor: '#1E1E24', padding: '16px 24px', borderBottom: '1px solid rgba(201,162,39,0.2)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/" style={{ fontSize: '24px', fontWeight: 'bold', color: '#C9A227', textDecoration: 'none' }}>
            LOGOS
          </Link>
          <div style={{ display: 'flex', gap: '24px' }}>
            <Link href="/translate" style={{ color: '#F5F4F2', textDecoration: 'none', transition: 'color 0.2s' }}>
              Translate
            </Link>
            <Link href="/analyze" style={{ color: '#F5F4F2', textDecoration: 'none', transition: 'color 0.2s' }}>
              Analyze
            </Link>
            <Link href="/library" style={{ color: '#F5F4F2', textDecoration: 'none', transition: 'color 0.2s' }}>
              Library
            </Link>
          </div>
        </div>
      </nav>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '48px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h1 style={{ fontSize: '48px', fontWeight: 'bold', marginBottom: '16px', background: 'linear-gradient(135deg, #C9A227 0%, #E8D5A3 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Translation Errors
          </h1>
          <p style={{ fontSize: '20px', color: '#9CA3AF', maxWidth: '600px', margin: '0 auto' }}>
            Academic detection and correction of errors in published classical translations
          </p>
        </div>

        <div style={{ backgroundColor: '#1E1E24', borderRadius: '12px', padding: '24px', marginBottom: '32px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', color: '#9CA3AF', fontSize: '14px', fontWeight: 'bold' }}>
                Search
              </label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search text, author, work..."
                style={{
                  width: '100%',
                  backgroundColor: '#0D0D0F',
                  border: '1px solid #4B5563',
                  borderRadius: '8px',
                  padding: '12px 16px',
                  color: '#F5F4F2',
                  fontSize: '14px'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', color: '#9CA3AF', fontSize: '14px', fontWeight: 'bold' }}>
                Language
              </label>
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                style={{
                  width: '100%',
                  backgroundColor: '#0D0D0F',
                  border: '1px solid #4B5563',
                  borderRadius: '8px',
                  padding: '12px 16px',
                  color: '#F5F4F2',
                  fontSize: '14px'
                }}
              >
                <option value="all">All Languages</option>
                <option value="greek">Greek</option>
                <option value="latin">Latin</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', color: '#9CA3AF', fontSize: '14px', fontWeight: 'bold' }}>
                Severity
              </label>
              <select
                value={selectedSeverity}
                onChange={(e) => setSelectedSeverity(e.target.value)}
                style={{
                  width: '100%',
                  backgroundColor: '#0D0D0F',
                  border: '1px solid #4B5563',
                  borderRadius: '8px',
                  padding: '12px 16px',
                  color: '#F5F4F2',
                  fontSize: '14px'
                }}
              >
                <option value="all">All Severities</option>
                <option value="critical">Critical</option>
                <option value="major">Major</option>
                <option value="minor">Minor</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', color: '#9CA3AF', fontSize: '14px', fontWeight: 'bold' }}>
                Status
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                style={{
                  width: '100%',
                  backgroundColor: '#0D0D0F',
                  border: '1px solid #4B5563',
                  borderRadius: '8px',
                  padding: '12px 16px',
                  color: '#F5F4F2',
                  fontSize: '14px'
                }}
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="verified">Verified</option>
                <option value="disputed">Disputed</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ color: '#9CA3AF' }}>
              {filteredErrors.length} of {errors.length} errors
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => {
                  setSelectedLanguage('all');
                  setSelectedSeverity('all');
                  setSelectedStatus('all');
                  setSearchQuery('');
                }}
                style={{
                  backgroundColor: '#4B5563',
                  color: '#F5F4F2',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '8px 16px',
                  fontSize: '14px',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {filteredErrors.length === 0 ? (
          <div style={{ backgroundColor: '#1E1E24', borderRadius: '12px', padding: '48px', textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
            <h3 style={{ fontSize: '24px', marginBottom: '8px' }}>No Translation Errors Found</h3>
            <p style={{ color: '#9CA3AF' }}>Try adjusting your search criteria or filters</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '24px' }}>
            {filteredErrors.map((error) => (
              <div key={error.id} style={{ backgroundColor: '#1E1E24', borderRadius: '12px', padding: '24px', border: `1px solid ${getSeverityColor(error.severity)}33` }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                      <span
                        style={{
                          backgroundColor: getLanguageColor(error.language),
                          color: '#F5F4F2',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontSize: '12px',
                          fontWeight: 'bold',
                          textTransform: 'uppercase'
                        }}
                      >
                        {error.language}
                      </span>
                      <span
                        style={{
                          backgroundColor: getSeverityColor(error.severity),
                          color: '#F5F4F2',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontSize: '12px',
                          fontWeight: 'bold',
                          textTransform: 'uppercase'
                        }}
                      >
                        {error.severity}
                      </span>
                      <span
                        style={{
                          backgroundColor: getStatusColor(error.status),
                          color: '#F5F4F2',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontSize: '12px',
                          fontWeight: 'bold',
                          textTransform: 'uppercase'
                        }}
                      >
                        {error.status}
                      </span>
                    </div>
                    <h3 style={{ fontSize: '18px', marginBottom: '4px' }}>
                      {error.author} - <em>{error.work}</em>
                    </h3>
                    <p style={{ color: '#9CA3AF', fontSize: '14px', marginBottom: '12px' }}>
                      {error.citation}
                    </p>
                  </div>
                  <div style={{ color: '#6B7280', fontSize: '14px' }}>
                    {error.errorType}
                  </div>
                </div>

                <div style={{ display: 'grid', gap: '16px' }}>
                  <div style={{ backgroundColor: '#0D0D0F', borderRadius: '8px', padding: '16px' }}>
                    <div style={{ color: '#9CA3AF', fontSize: '12px', fontWeight: 'bold', marginBottom: '8px', textTransform: 'uppercase' }}>
                      Original Text
                    </div>
                    <div style={{ fontSize: '16px', fontFamily: 'serif', lineHeight: '1.6' }}>
                      {error.sourceText}
                    </div>
                  </div>

                  <div style={{ backgroundColor: '#0D0D0F', borderRadius: '8px', padding: '16px', border: '1px solid #DC2626' }}>
                    <div style={{ color: '#DC2626', fontSize: '12px', fontWeight: 'bold', marginBottom: '8px', textTransform: 'uppercase' }}>
                      Incorrect Translation
                    </div>
                    <div style={{ fontSize: '16px', lineHeight: '1.6' }}>
                      {error.translatedText}
                    </div>
                  </div>

                  <div style={{ backgroundColor: '#0D0D0F', borderRadius: '8px', padding: '16px', border: '1px solid #059669' }}>
                    <div style={{ color: '#059669', fontSize: '12px', fontWeight: 'bold', marginBottom: '8px', textTransform: 'uppercase' }}>
                      Correct Translation
                    </div>
                    <div style={{ fontSize: '16px', lineHeight: '1.6' }}>
                      {error.correctTranslation}
                    </div>
                  </div>

                  <div style={{ backgroundColor: '#141419', borderRadius: '8px', padding: '16px' }}>
                    <div style={{ color: '#C9A227', fontSize: '12px', fontWeight: 'bold', marginBottom: '8px', textTransform: 'uppercase' }}>
                      Explanation
                    </div>
                    <div style={{ fontSize: '14px', lineHeight: '1.6', color: '#9CA3AF' }}>
                      {error.explanation}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #4B5563' }}>
                  <div style={{ color: '#6B7280', fontSize: '12px' }}>
                    Reported by {error.reportedBy} on {new Date(error.dateReported).toLocaleDateString()}
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      style={{
                        backgroundColor: '#4B5563',
                        color: '#F5F4F2',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '6px 12px',
                        fontSize: '12px',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                    >
                      View Details
                    </button>
                    <button
                      style={{
                        backgroundColor: '#C9A227',
                        color: '#0D0D0F',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '6px 12px',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                    >
                      Verify
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}