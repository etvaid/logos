'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AchievementsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [achievements, setAchievements] = useState([]);
  const [userProgress, setUserProgress] = useState({});

  useEffect(() => {
    fetchAchievements();
  }, []);

  const fetchAchievements = async () => {
    try {
      setLoading(true);
      const [achievementsRes, progressRes] = await Promise.all([
        fetch('/api/achievements'),
        fetch('/api/user/progress')
      ]);

      if (!achievementsRes.ok || !progressRes.ok) {
        throw new Error('Failed to fetch data');
      }

      const achievementsData = await achievementsRes.json();
      const progressData = await progressRes.json();

      setAchievements(achievementsData.achievements || []);
      setUserProgress(progressData.progress || {});
    } catch (err) {
      setError('Failed to load achievements. Please try again.');
      console.error('Error fetching achievements:', err);
    } finally {
      setLoading(false);
    }
  };

  const isUnlocked = (achievementId) => {
    return userProgress[achievementId]?.unlocked || false;
  };

  const getProgress = (achievementId) => {
    return userProgress[achievementId]?.progress || 0;
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'reading': return '#3B82F6';
      case 'translation': return '#DC2626';
      case 'research': return '#C9A227';
      case 'community': return '#059669';
      case 'mastery': return '#7C3AED';
      default: return '#6B7280';
    }
  };

  const getRarityColor = (rarity) => {
    switch (rarity) {
      case 'common': return '#6B7280';
      case 'rare': return '#3B82F6';
      case 'epic': return '#7C3AED';
      case 'legendary': return '#C9A227';
      default: return '#6B7280';
    }
  };

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        backgroundColor: '#0D0D0F', 
        color: '#F5F4F2',
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}>
        <nav style={{
          backgroundColor: '#1E1E24',
          padding: '16px 24px',
          borderBottom: '1px solid rgba(201,162,39,0.2)'
        }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Link href="/" style={{ textDecoration: 'none', color: '#C9A227', fontSize: 24, fontWeight: 'bold' }}>
              LOGOS
            </Link>
            <div style={{ display: 'flex', gap: 24 }}>
              <Link href="/learn" style={{ textDecoration: 'none', color: '#F5F4F2', transition: 'color 0.2s' }}>Learn</Link>
              <Link href="/texts" style={{ textDecoration: 'none', color: '#F5F4F2', transition: 'color 0.2s' }}>Texts</Link>
              <Link href="/tools" style={{ textDecoration: 'none', color: '#F5F4F2', transition: 'color 0.2s' }}>Tools</Link>
            </div>
          </div>
        </nav>

        <div style={{ padding: '48px 24px', textAlign: 'center' }}>
          <div style={{ fontSize: 18, color: '#9CA3AF' }}>Loading achievements...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        backgroundColor: '#0D0D0F', 
        color: '#F5F4F2',
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}>
        <nav style={{
          backgroundColor: '#1E1E24',
          padding: '16px 24px',
          borderBottom: '1px solid rgba(201,162,39,0.2)'
        }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Link href="/" style={{ textDecoration: 'none', color: '#C9A227', fontSize: 24, fontWeight: 'bold' }}>
              LOGOS
            </Link>
            <div style={{ display: 'flex', gap: 24 }}>
              <Link href="/learn" style={{ textDecoration: 'none', color: '#F5F4F2', transition: 'color 0.2s' }}>Learn</Link>
              <Link href="/texts" style={{ textDecoration: 'none', color: '#F5F4F2', transition: 'color 0.2s' }}>Texts</Link>
              <Link href="/tools" style={{ textDecoration: 'none', color: '#F5F4F2', transition: 'color 0.2s' }}>Tools</Link>
            </div>
          </div>
        </nav>

        <div style={{ padding: '48px 24px', textAlign: 'center' }}>
          <div style={{ color: '#DC2626', fontSize: 18, marginBottom: 16 }}>{error}</div>
          <button
            onClick={fetchAchievements}
            style={{
              backgroundColor: '#C9A227',
              color: '#0D0D0F',
              border: 'none',
              borderRadius: 8,
              padding: '12px 24px',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#0D0D0F', 
      color: '#F5F4F2',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <nav style={{
        backgroundColor: '#1E1E24',
        padding: '16px 24px',
        borderBottom: '1px solid rgba(201,162,39,0.2)'
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/" style={{ textDecoration: 'none', color: '#C9A227', fontSize: 24, fontWeight: 'bold' }}>
            LOGOS
          </Link>
          <div style={{ display: 'flex', gap: 24 }}>
            <Link href="/learn" style={{ textDecoration: 'none', color: '#F5F4F2', transition: 'color 0.2s' }}>Learn</Link>
            <Link href="/texts" style={{ textDecoration: 'none', color: '#F5F4F2', transition: 'color 0.2s' }}>Texts</Link>
            <Link href="/tools" style={{ textDecoration: 'none', color: '#F5F4F2', transition: 'color 0.2s' }}>Tools</Link>
          </div>
        </div>
      </nav>

      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 24px' }}>
        <div style={{ marginBottom: 48 }}>
          <h1 style={{ fontSize: 36, fontWeight: 'bold', marginBottom: 16, color: '#F5F4F2' }}>
            Achievement Gallery
          </h1>
          <p style={{ fontSize: 18, color: '#9CA3AF', lineHeight: 1.6 }}>
            Unlock badges by completing challenges, mastering texts, and contributing to the classical studies community.
          </p>
        </div>

        <div style={{ marginBottom: 32 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginBottom: 24 }}>
            {['all', 'reading', 'translation', 'research', 'community', 'mastery'].map((filter) => (
              <button
                key={filter}
                style={{
                  backgroundColor: filter === 'all' ? '#C9A227' : '#1E1E24',
                  color: filter === 'all' ? '#0D0D0F' : '#F5F4F2',
                  border: 'none',
                  borderRadius: 8,
                  padding: '8px 16px',
                  fontSize: 14,
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  textTransform: 'capitalize',
                  transition: 'all 0.2s'
                }}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {achievements.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '48px 24px',
            backgroundColor: '#1E1E24',
            borderRadius: 12,
            border: '1px solid rgba(201,162,39,0.2)'
          }}>
            <div style={{ fontSize: 18, color: '#9CA3AF', marginBottom: 16 }}>
              No achievements available yet
            </div>
            <p style={{ color: '#6B7280' }}>
              Complete lessons and engage with texts to unlock your first achievement.
            </p>
          </div>
        ) : (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
            gap: 24 
          }}>
            {achievements.map((achievement) => {
              const unlocked = isUnlocked(achievement.id);
              const progress = getProgress(achievement.id);
              const categoryColor = getCategoryColor(achievement.category);
              const rarityColor = getRarityColor(achievement.rarity);

              return (
                <div
                  key={achievement.id}
                  style={{
                    backgroundColor: unlocked ? '#1E1E24' : 'rgba(30,30,36,0.5)',
                    border: unlocked ? `2px solid ${rarityColor}` : '2px solid #374151',
                    borderRadius: 12,
                    padding: 24,
                    position: 'relative',
                    opacity: unlocked ? 1 : 0.7,
                    transition: 'all 0.2s',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 16 }}>
                    <div
                      style={{
                        width: 64,
                        height: 64,
                        backgroundColor: unlocked ? categoryColor : '#374151',
                        borderRadius: 12,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 24,
                        flexShrink: 0
                      }}
                    >
                      {achievement.icon || '🏆'}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                        <h3 style={{ 
                          fontSize: 18, 
                          fontWeight: 'bold', 
                          color: unlocked ? '#F5F4F2' : '#9CA3AF',
                          margin: 0
                        }}>
                          {achievement.title}
                        </h3>
                        <span
                          style={{
                            backgroundColor: rarityColor,
                            color: '#FFFFFF',
                            fontSize: 10,
                            fontWeight: 'bold',
                            padding: '2px 6px',
                            borderRadius: 4,
                            textTransform: 'uppercase'
                          }}
                        >
                          {achievement.rarity}
                        </span>
                      </div>
                      <div
                        style={{
                          backgroundColor: categoryColor,
                          color: '#FFFFFF',
                          fontSize: 12,
                          fontWeight: 'bold',
                          padding: '4px 8px',
                          borderRadius: 6,
                          textTransform: 'capitalize',
                          display: 'inline-block',
                          marginBottom: 8
                        }}
                      >
                        {achievement.category}
                      </div>
                    </div>
                  </div>

                  <p style={{ 
                    color: unlocked ? '#9CA3AF' : '#6B7280', 
                    fontSize: 14, 
                    lineHeight: 1.5,
                    marginBottom: 16 
                  }}>
                    {achievement.description}
                  </p>

                  <div style={{ marginBottom: 16 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                      <span style={{ fontSize: 12, color: '#6B7280', fontWeight: 'bold' }}>
                        Progress
                      </span>
                      <span style={{ fontSize: 12, color: unlocked ? '#C9A227' : '#6B7280' }}>
                        {unlocked ? 'Complete!' : `${progress}/${achievement.target || 100}`}
                      </span>
                    </div>
                    <div style={{ 
                      backgroundColor: '#0D0D0F', 
                      borderRadius: 4, 
                      height: 6,
                      overflow: 'hidden'
                    }}>
                      <div
                        style={{
                          backgroundColor: unlocked ? '#C9A227' : categoryColor,
                          height: '100%',
                          width: `${unlocked ? 100 : (progress / (achievement.target || 100)) * 100}%`,
                          transition: 'width 0.3s ease'
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ fontSize: 12, color: '#6B7280' }}>
                    <strong>Unlock condition:</strong> {achievement.condition}
                  </div>

                  {achievement.points && (
                    <div
                      style={{
                        position: 'absolute',
                        top: 12,
                        right: 12,
                        backgroundColor: 'rgba(201,162,39,0.2)',
                        color: '#C9A227',
                        fontSize: 12,
                        fontWeight: 'bold',
                        padding: '4px 8px',
                        borderRadius: 6
                      }}
                    >
                      +{achievement.points} XP
                    </div>
                  )}

                  {unlocked && (
                    <div
                      style={{
                        position: 'absolute',
                        top: -8,
                        left: -8,
                        backgroundColor: '#C9A227',
                        color: '#0D0D0F',
                        width: 32,
                        height: 32,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 16,
                        fontWeight: 'bold',
                        boxShadow: '0 4px 12px rgba(201,162,39,0.4)'
                      }}
                    >
                      ✓
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        <div style={{ marginTop: 48, padding: 24, backgroundColor: '#141419', borderRadius: 12 }}>
          <h2 style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16, color: '#C9A227' }}>
            Achievement Statistics
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 24 }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 28, fontWeight: 'bold', color: '#F5F4F2', marginBottom: 4 }}>
                {Object.values(userProgress).filter(p => p.unlocked).length}
              </div>
              <div style={{ color: '#9CA3AF', fontSize: 14 }}>Unlocked</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 28, fontWeight: 'bold', color: '#F5F4F2', marginBottom: 4 }}>
                {achievements.length}
              </div>
              <div style={{ color: '#9CA3AF', fontSize: 14 }}>Total Available</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 28, fontWeight: 'bold', color: '#F5F4F2', marginBottom: 4 }}>
                {Math.round((Object.values(userProgress).filter(p => p.unlocked).length / Math.max(achievements.length, 1)) * 100)}%
              </div>
              <div style={{ color: '#9CA3AF', fontSize: 14 }}>Completion</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}