'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Author {
  id: number;
  name: string;
  dates: {
    birth: string;
    death: string;
  };
  language: 'greek' | 'latin';
  period: string;
  genre: string;
  worksCount: number;
  totalWords: number;
  portraitUrl?: string;
  biography: string;
  nationality: string;
  majorWorks: string[];
  influence: number;
  stylometricFingerprint: {
    avgSentenceLength: number;
    vocabularyRichness: number;
    functionalWordRatio: number;
    clauseComplexity: number;
    fingerprint: number[];
  };
}

export default function AuthorsPage() {
  const router = useRouter();
  const [authors, setAuthors] = useState<Author[]>([]);
  const [filteredAuthors, setFilteredAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'influence' | 'works' | 'period'>('influence');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    const fetchAuthors = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:8000/authorship/authors');
        if (!response.ok) {
          throw new Error('Failed to fetch authors');
        }
        const data = await response.json();
        
        // Mock data for fallback
        const mockAuthors: Author[] = [
          {
            id: 1,
            name: 'Homer',
            dates: { birth: '8th century BCE', death: '8th century BCE' },
            language: 'greek',
            period: 'Archaic',
            genre: 'Epic',
            worksCount: 2,
            totalWords: 27803,
            biography: 'Legendary ancient Greek poet traditionally said to be the author of the epic poems the Iliad and the Odyssey.',
            nationality: 'Greek',
            majorWorks: ['Iliad', 'Odyssey'],
            influence: 0.95,
            stylometricFingerprint: {
              avgSentenceLength: 24.5,
              vocabularyRichness: 0.82,
              functionalWordRatio: 0.34,
              clauseComplexity: 3.2,
              fingerprint: [0.8, 0.6, 0.9, 0.7, 0.5, 0.8, 0.4, 0.9, 0.6, 0.7, 0.8, 0.5, 0.6, 0.9, 0.7, 0.4, 0.8, 0.6, 0.5, 0.7]
            }
          },
          {
            id: 2,
            name: 'Virgil',
            dates: { birth: '70 BCE', death: '19 BCE' },
            language: 'latin',
            period: 'Augustan',
            genre: 'Epic',
            worksCount: 3,
            totalWords: 21500,
            biography: 'Roman poet of the Augustan period.',
            nationality: 'Roman',
            majorWorks: ['Aeneid', 'Georgics', 'Eclogues'],
            influence: 0.92,
            stylometricFingerprint: {
              avgSentenceLength: 22.1,
              vocabularyRichness: 0.78,
              functionalWordRatio: 0.36,
              clauseComplexity: 2.9,
              fingerprint: [0.7, 0.8, 0.6, 0.9, 0.5, 0.7, 0.8, 0.6, 0.9, 0.4, 0.8, 0.7, 0.5, 0.6, 0.9, 0.8, 0.7, 0.5, 0.6, 0.8]
            }
          },
          {
            id: 3,
            name: 'Plato',
            dates: { birth: '428/427 BCE', death: '348/347 BCE' },
            language: 'greek',
            period: 'Classical',
            genre: 'Philosophy',
            worksCount: 36,
            totalWords: 45000,
            biography: 'Ancient Greek philosopher.',
            nationality: 'Greek',
            majorWorks: ['Republic', 'Phaedo', 'Symposium'],
            influence: 0.88,
            stylometricFingerprint: {
              avgSentenceLength: 18.3,
              vocabularyRichness: 0.85,
              functionalWordRatio: 0.42,
              clauseComplexity: 2.1,
              fingerprint: [0.6, 0.7, 0.8, 0.5, 0.9, 0.6, 0.7, 0.4, 0.8, 0.9, 0.5, 0.7, 0.6, 0.8, 0.4, 0.9, 0.7, 0.6, 0.8, 0.5]
            }
          },
          {
            id: 4,
            name: 'Cicero',
            dates: { birth: '106 BCE', death: '43 BCE' },
            language: 'latin',
            period: 'Late Republic',
            genre: 'Oratory',
            worksCount: 58,
            totalWords: 52000,
            biography: 'Roman statesman, lawyer, scholar, philosopher.',
            nationality: 'Roman',
            majorWorks: ['Catiline Orations', 'Philippics'],
            influence: 0.86,
            stylometricFingerprint: {
              avgSentenceLength: 26.8,
              vocabularyRichness: 0.91,
              functionalWordRatio: 0.38,
              clauseComplexity: 3.8,
              fingerprint: [0.9, 0.7, 0.5, 0.8, 0.6, 0.9, 0.4, 0.7, 0.8, 0.5, 0.9, 0.6, 0.7, 0.4, 0.8, 0.9, 0.5, 0.7, 0.6, 0.8]
            }
          },
          {
            id: 5,
            name: 'Sophocles',
            dates: { birth: '496 BCE', death: '406 BCE' },
            language: 'greek',
            period: 'Classical',
            genre: 'Tragedy',
            worksCount: 7,
            totalWords: 18200,
            biography: 'Ancient Greek tragedian.',
            nationality: 'Greek',
            majorWorks: ['Oedipus Rex', 'Antigone'],
            influence: 0.84,
            stylometricFingerprint: {
              avgSentenceLength: 16.2,
              vocabularyRichness: 0.76,
              functionalWordRatio: 0.35,
              clauseComplexity: 2.4,
              fingerprint: [0.8, 0.5, 0.7, 0.9, 0.6, 0.4, 0.8, 0.7, 0.5, 0.9, 0.6, 0.8, 0.4, 0.7, 0.9, 0.5, 0.8, 0.6, 0.7, 0.9]
            }
          },
          {
            id: 6,
            name: 'Ovid',
            dates: { birth: '43 BCE', death: '17/18 CE' },
            language: 'latin',
            period: 'Augustan',
            genre: 'Poetry',
            worksCount: 12,
            totalWords: 35000,
            biography: 'Roman poet.',
            nationality: 'Roman',
            majorWorks: ['Metamorphoses', 'Ars Amatoria'],
            influence: 0.81,
            stylometricFingerprint: {
              avgSentenceLength: 19.7,
              vocabularyRichness: 0.83,
              functionalWordRatio: 0.33,
              clauseComplexity: 2.6,
              fingerprint: [0.7, 0.9, 0.5, 0.6, 0.8, 0.4, 0.9, 0.7, 0.6, 0.8, 0.5, 0.7, 0.9, 0.4, 0.8, 0.6, 0.7, 0.5, 0.9, 0.8]
            }
          }
        ];
        
        setAuthors(data.authors || data || mockAuthors);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load authors');
      } finally {
        setLoading(false);
      }
    };

    fetchAuthors();
  }, []);

  useEffect(() => {
    let filtered = [...authors];

    if (searchTerm) {
      filtered = filtered.filter(author => 
        author.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        author.majorWorks.some(work => work.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (selectedPeriod) {
      filtered = filtered.filter(author => author.period === selectedPeriod);
    }

    if (selectedLanguage) {
      filtered = filtered.filter(author => author.language === selectedLanguage);
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'influence':
          return b.influence - a.influence;
        case 'works':
          return b.worksCount - a.worksCount;
        case 'period':
          return a.period.localeCompare(b.period);
        default:
          return 0;
      }
    });

    setFilteredAuthors(filtered);
  }, [authors, searchTerm, selectedPeriod, selectedLanguage, sortBy]);

  const handleAuthorClick = (author: Author) => {
    router.push(`/authors/${author.id}`);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedPeriod('');
    setSelectedLanguage('');
  };

  const getLanguageColor = (language: 'greek' | 'latin') => {
    return language === 'greek' ? 'text-[#5BA4E8]' : 'text-[#E85B5B]';
  };

  const getInfluenceColor = (influence: number) => {
    if (influence >= 0.8) return 'text-[#C9A962]';
    if (influence >= 0.6) return 'text-green-400';
    return 'text-[#F5F3EF]/70';
  };

  const renderStylometricPreview = (fingerprint: Author['stylometricFingerprint']) => {
    return (
      <div className="mt-3 p-2 bg-[#0D0D0F]/50 rounded border border-[#C9A962]/10">
        <div className="text-[#F5F3EF]/70 text-xs mb-2">Stylometric Fingerprint</div>
        <div className="grid grid-cols-2 gap-1 text-xs">
          <div className="text-[#F5F3EF]/60">Sent. Len: {fingerprint.avgSentenceLength.toFixed(1)}</div>
          <div className="text-[#F5F3EF]/60">Vocab: {fingerprint.vocabularyRichness.toFixed(2)}</div>
          <div className="text-[#F5F3EF]/60">Func. Words: {(fingerprint.functionalWordRatio * 100).toFixed(0)}%</div>
          <div className="text-[#F5F3EF]/60">Complexity: {fingerprint.clauseComplexity.toFixed(1)}</div>
        </div>
        <div className="mt-2 flex space-x-0.5">
          {fingerprint.fingerprint.slice(0, 20).map((val, i) => (
            <div key={i} className="w-1 bg-[#C9A962] rounded-sm" style={{ height: `${Math.max(2, val * 16)}px` }} />
          ))}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0D0D0F] text-[#F5F3EF] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-2 border-[#C9A962]/20 border-t-[#C9A962] rounded-full mx-auto mb-4"></div>
          <p className="text-[#F5F3EF]/70">Loading authors...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0D0D0F] text-[#F5F3EF] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#E85B5B] mb-4">Error: {error}</p>
          <button onClick={() => window.location.reload()} className="px-4 py-2 bg-[#C9A962] text-[#0D0D0F] rounded-lg font-semibold hover:bg-[#C9A962]/90 transition-all">Retry</button>
        </div>
      </div>
    );