'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';

interface TimelineEvent {
  id: string;
  title: string;
  year: number;
  category: 'political' | 'literary' | 'cultural';
  description: string;
  author?: string;
  work?: string;
  location?: string;
  impact: number;
  language?: 'greek' | 'latin';
  relatedTexts: Array<{
    title: string;
    author: string;
    excerpt: string;
    language: 'greek' | 'latin';
  }>;
}

interface AuthorLifespan {
  id: string;
  name: string;
  birthYear: number;
  deathYear: number;
  language: 'greek' | 'latin';
  genre: string[];
  influence: number;
  majorWorks: string[];
  significance: string;
}

interface TimelineData {
  events: TimelineEvent[];
  authors: AuthorLifespan[];
  timeRange: {
    min: number;
    max: number;
  };
}

export default function TimelinePage() {
  const [timelineData, setTimelineData] = useState<TimelineData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null);
  const [selectedAuthor, setSelectedAuthor] = useState<AuthorLifespan | null>(null);
  const [showEventDetails, setShowEventDetails] = useState(false);
  const [showAuthorDetails, setShowAuthorDetails] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'political' | 'literary' | 'cultural'>('all');
  const [languageFilter, setLanguageFilter] = useState<'all' | 'greek' | 'latin'>('all');
  const [zoomLevel, setZoomLevel] = useState(1);
  const [viewRange, setViewRange] = useState({ start: -800, end: 600 });
  const [showAuthors, setShowAuthors] = useState(true);
  const [showEvents, setShowEvents] = useState(true);
  
  const timelineRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const fetchTimelineData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8000/atlas/timeline/events');
      if (!response.ok) {
        throw new Error('Failed to fetch timeline data');
      }
      const data: TimelineData = await response.json();
      setTimelineData(data);
      if (data.timeRange) {
        setViewRange({ start: data.timeRange.min, end: data.timeRange.max });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load timeline data');
      // Fallback data for development
      setTimelineData({
        events: [
          {
            id: '1',
            title: 'Foundation of Rome',
            year: -753,
            category: 'political',
            description: 'According to legend, Rome was founded by Romulus',
            location: 'Rome',
            impact: 9,
            relatedTexts: [
              {
                title: 'Ab Urbe Condita',
                author: 'Livy',
                excerpt: 'Iam primum omnium satis constat Troia capta...',
                language: 'latin'
              }
            ]
          },
          {
            id: '2',
            title: 'Homer composes the Iliad',
            year: -750,
            category: 'literary',
            description: 'Homer composes the epic poem of the Trojan War',
            author: 'Homer',
            work: 'Iliad',
            impact: 10,
            language: 'greek',
            relatedTexts: [
              {
                title: 'Iliad',
                author: 'Homer',
                excerpt: 'μῆνιν ἄειδε θεὰ Πηληιάδεω Ἀχιλῆος',
                language: 'greek'
              }
            ]
          },
          {
            id: '3',
            title: 'Battle of Marathon',
            year: -490,
            category: 'political',
            description: 'Athenians defeat Persian invasion',
            location: 'Marathon',
            impact: 8,
            relatedTexts: [
              {
                title: 'Histories',
                author: 'Herodotus',
                excerpt: 'The battle at Marathon was a turning point...',
                language: 'greek'
              }
            ]
          },
          {
            id: '4',
            title: 'Pericles\'s Golden Age begins',
            year: -461,
            category: 'cultural',
            description: 'Athens reaches its cultural zenith under Pericles',
            location: 'Athens',
            impact: 9,
            relatedTexts: [
              {
                title: 'History of the Peloponnesian War',
                author: 'Thucydides',
                excerpt: 'Pericles was the first citizen of Athens...',
                language: 'greek'
              }
            ]
          },
          {
            id: '5',
            title: 'Julius Caesar assassinated',
            year: -44,
            category: 'political',
            description: 'The Ides of March - Caesar\'s assassination ends the Republic',
            location: 'Rome',
            impact: 10,
            relatedTexts: [
              {
                title: 'Life of Caesar',
                author: 'Plutarch',
                excerpt: 'Caesar ignored the soothsayer\'s warning...',
                language: 'greek'
              }
            ]
          },
          {
            id: '6',
            title: 'Virgil writes the Aeneid',
            year: -25,
            category: 'literary',
            description: 'Virgil completes Rome\'s national epic',
            author: 'Virgil',
            work: 'Aeneid',
            impact: 9,
            language: 'latin',
            relatedTexts: [
              {
                title: 'Aeneid',
                author: 'Virgil',
                excerpt: 'Arma virumque cano, Troiae qui primus ab oris',
                language: 'latin'
              }
            ]
          }
        ],
        authors: [
          {
            id: 'homer',
            name: 'Homer',
            birthYear: -800,
            deathYear: -750,
            language: 'greek',
            genre: ['Epic'],
            influence: 10,
            majorWorks: ['Iliad', 'Odyssey'],
            significance: 'Greatest epic poet of antiquity'
          },
          {
            id: 'virgil',
            name: 'Virgil',
            birthYear: -70,
            deathYear: -19,
            language: 'latin',
            genre: ['Epic', 'Pastoral'],
            influence: 9,
            majorWorks: ['Aeneid', 'Georgics', 'Eclogues'],
            significance: 'Rome\'s greatest poet'
          },
          {
            id: 'cicero',
            name: 'Cicero',
            birthYear: -106,
            deathYear: -43,
            language: 'latin',
            genre: ['Oratory', 'Philosophy'],
            influence: 9,
            majorWorks: ['Catiline Orations', 'On the Republic'],
            significance: 'Master of Latin prose and oratory'
          },
          {
            id: 'plato',
            name: 'Plato',
            birthYear: -428,
            deathYear: -348,
            language: 'greek',
            genre: ['Philosophy'],
            influence: 10,
            majorWorks: ['Republic', 'Phaedo', 'Symposium'],
            significance: 'Founder of Western philosophy'
          },
          {
            id: 'aristotle',
            name: 'Aristotle',
            birthYear: -384,
            deathYear: -322,
            language: 'greek',
            genre: ['Philosophy', 'Science'],
            influence: 10,
            majorWorks: ['Nicomachean Ethics', 'Poetics', 'Politics'],
            significance: 'Systematic philosopher and scientist'
          }
        ],
        timeRange: { min: -800, max: 600 }
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTimelineData();
  }, [fetchTimelineData]);

  const handleEventClick = (event: TimelineEvent) => {
    setSelectedEvent(event);
    setSelectedAuthor(null);
    setShowEventDetails(true);
    setShowAuthorDetails(false);
  };

  const handleAuthorClick = (author: AuthorLifespan) => {
    setSelectedAuthor(author);
    setSelectedEvent(null);
    setShowAuthorDetails(true);
    setShowEventDetails(false);
  };

  const handleZoom = (direction: 'in' | 'out') => {
    setZoomLevel(prev => {
      const newZoom = direction === 'in' ? prev * 1.5 : prev / 1.5;
      return Math.max(0.5, Math.min(5, newZoom));
    });
  };

  const getFilteredEvents = () => {
    if (!timelineData) return [];
    return timelineData.events.filter(event => {
      if (categoryFilter !== 'all' && event.category !== categoryFilter) return false;
      if (languageFilter !== 'all' && event.language && event.language !== languageFilter) return false;
      return event.year >= viewRange.start && event.year <= viewRange.end;
    });
  };

  const getFilteredAuthors = () => {
    if (!timelineData) return [];
    return timelineData.authors.filter(author => {
      if (languageFilter !== 'all' && author.language !== languageFilter) return false;
      return author.deathYear >= viewRange.start && author.birthYear <= viewRange.end;
    });
  };

  const getYearPosition = (year: number) => {
    const totalRange = viewRange.end - viewRange.start;
    const relativePosition = (year - viewRange.start) / totalRange;
    return relativePosition * 100;
  };

  const formatYear = (year: number) => {
    return year < 0 ? `${Math.abs(year)} BCE` : `${year} CE`;
  };

  const getLanguageColor = (language: 'greek' | 'latin') => {
    return language === 'greek' ? 'text-[#5BA4E8]' : 'text-[#E85B5B]';
  };

  const getCategoryColor = (category: 'political' | 'literary' | 'cultural') => {
    switch (category) {
      case 'political': return 'bg-[#E85B5B]';
      case 'literary': return 'bg-[#5BA4E8]';
      case 'cultural': return 'bg-[#C9A962]';
    }
  };

  const getCategoryBorder = (category: 'political' | 'literary' | 'cultural') => {
    switch (category) {
      case 'political': return 'border-[#E85B5B]/40';
      case 'literary': return 'border-[#5BA4E8]/40';
      case 'cultural': return 'border-[#C9A962]/40';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0D0D0F] text-[#F5F3EF] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-2 border-[#C9A962]/20 border-t-[#C9A962] rounded-full mx-auto mb-4"></div>
          <p className="text-[#F5F3EF]/70">Loading timeline...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0D0D0F] text-[#F5F3EF] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#E85B5B] mb-4">Error: {error}</p>
          <button onClick={() => window.location.reload()} className="px-4 py-2 bg-[#C9A962] text-[#0D0D0F] rounded-lg font-semibold hover:bg-[#C9A962]/90 transition-all">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0D0D0F] text-[#F5F3EF] overflow-hidden">
      {/* Navigation */}
      <nav className="border-b border-[#C9A962]/20 bg-[#0D0D0F]/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-8">
              <Link href="/" className="text-2xl font-bold text-[#C9A962]">LOGOS</Link>
              <div className="hidden md:flex space-x-6">
                <Link href="/reader" className="text-[#F5F3EF]/70 hover:text-[#F5F3EF] transition-colors">Reader</Link>
                <Link href="/semantia" className="text-[#F5F3