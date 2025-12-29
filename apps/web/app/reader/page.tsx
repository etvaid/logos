'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';

interface Work {
  urn: string;
  title: string;
  author: string;
  language: string;
}

interface TextLine {
  lineNumber: number;
  text: string;
  words: Word[];
}

interface Word {
  text: string;
  position: number;
  language: 'greek' | 'latin' | 'other';
}

interface Morphology {
  lemma: string;
  pos: string;
  case?: string;
  number?: string;
  gender?: string;
  definition: string;
  forms: string[];
}

interface MorphologyPopup {
  word: string;
  x: number;
  y: number;
  morphology: Morphology | null;
  loading: boolean;
}

interface Translation {
  text: string;
  style: 'literal' | 'prose' | 'poetic';
}

export default function ReaderPage() {
  const [works, setWorks] = useState<Work[]>([]);
  const [selectedWork, setSelectedWork] = useState<string>('');
  const [textLines, setTextLines] = useState<TextLine[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [morphologyPopup, setMorphologyPopup] = useState<MorphologyPopup | null>(null);
  const [showTranslation, setShowTranslation] = useState(false);
  const [translation, setTranslation] = useState<Translation | null>(null);
  const [translationStyle, setTranslationStyle] = useState<'literal' | 'prose' | 'poetic'>('literal');
  const [currentLine, setCurrentLine] = useState(0);
  const [bookmarked, setBookmarked] = useState(false);
  
  const textContainerRef = useRef<HTMLDivElement>(null);

  // Fetch available works
  useEffect(() => {
    const fetchWorks = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:8000/reader/works');
        if (!response.ok) {
          throw new Error('Failed to fetch works');
        }
        const data = await response.json();
        setWorks(data);
        if (data.length > 0) {
          setSelectedWork(data[0].urn);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load works');
      } finally {
        setLoading(false);
      }
    };

    fetchWorks();
  }, []);

  // Fetch text when work is selected
  useEffect(() => {
    if (!selectedWork) return;

    const fetchText = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`http://localhost:8000/reader/work/${encodeURIComponent(selectedWork)}/text`);
        if (!response.ok) {
          throw new Error('Failed to fetch text');
        }
        const data = await response.json();
        
        // Process text into lines with words
        const lines: TextLine[] = data.lines?.map((line: any, index: number) => ({
          lineNumber: index + 1,
          text: line.text || '',
          words: processWordsInLine(line.text || '', line.language || 'other')
        })) || [];
        
        setTextLines(lines);
        setCurrentLine(0);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load text');
      } finally {
        setLoading(false);
      }
    };

    fetchText();
  }, [selectedWork]);

  // Process words in a line to identify language
  const processWordsInLine = (text: string, language: string): Word[] => {
    const words = text.split(/\s+/).filter(word => word.length > 0);
    return words.map((word, index) => {
      // Detect language based on character set
      const hasGreek = /[\u0370-\u03FF\u1F00-\u1FFF]/.test(word);
      const hasLatin = /[a-zA-Z]/.test(word);
      
      let detectedLang: 'greek' | 'latin' | 'other' = 'other';
      if (hasGreek) detectedLang = 'greek';
      else if (hasLatin) detectedLang = 'latin';
      
      return {
        text: word,
        position: index,
        language: detectedLang
      };
    });
  };

  // Handle word click for morphology
  const handleWordClick = async (word: string, event: React.MouseEvent) => {
    const rect = (event.target as HTMLElement).getBoundingClientRect();
    const popup: MorphologyPopup = {
      word,
      x: rect.left + rect.width / 2,
      y: rect.top - 10,
      morphology: null,
      loading: true
    };
    
    setMorphologyPopup(popup);

    try {
      const response = await fetch(`http://localhost:8000/reader/word/${encodeURIComponent(word)}/morphology`);
      if (!response.ok) {
        throw new Error('Failed to fetch morphology');
      }
      const morphology = await response.json();
      
      setMorphologyPopup(prev => prev ? {
        ...prev,
        morphology,
        loading: false
      } : null);
    } catch (err) {
      setMorphologyPopup(prev => prev ? {
        ...prev,
        morphology: {
          lemma: word,
          pos: 'unknown',
          definition: 'Morphology not available',
          forms: []
        },
        loading: false
      } : null);
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
        return;
      }

      switch (event.key.toLowerCase()) {
        case 'j':
          setCurrentLine(prev => Math.min(prev + 1, textLines.length - 1));
          event.preventDefault();
          break;
        case 'k':
          setCurrentLine(prev => Math.max(prev - 1, 0));
          event.preventDefault();
          break;
        case 'm':
          setMorphologyPopup(null);
          event.preventDefault();
          break;
        case 't':
          setShowTranslation(prev => !prev);
          event.preventDefault();
          break;
        case 'escape':
          setMorphologyPopup(null);
          event.preventDefault();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [textLines.length]);

  // Close morphology popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (morphologyPopup && !(event.target as Element).closest('.morphology-popup')) {
        setMorphologyPopup(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [morphologyPopup]);

  // Scroll current line into view
  useEffect(() => {
    if (textContainerRef.current && currentLine >= 0) {
      const lineElement = textContainerRef.current.querySelector(`[data-line="${currentLine}"]`);
      if (lineElement) {
        lineElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [currentLine]);

  const selectedWorkData = works.find(w => w.urn === selectedWork);

  const getWordClassName = (word: Word) => {
    let baseClass = 'cursor-pointer hover:bg-[#C9A962]/20 px-1 py-0.5 rounded transition-colors font-serif ';
    switch (word.language) {
      case 'greek':
        return baseClass + 'text-[#5BA4E8]';
      case 'latin':
        return baseClass + 'text-[#E85B5B]';
      default:
        return baseClass + 'text-[#F5F3EF]';
    }
  };

  return (
    <div className="min-h-screen bg-[#0D0D0F] text-[#F5F3EF]">
      {/* Navigation */}
      <nav className="border-b border-[#C9A962]/20 bg-[#0D0D0F]/95 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-8">
              <Link href="/" className="text-2xl font-bold text-[#C9A962] font-serif">
                LOGOS
              </Link>
              <div className="text-[#F5F3EF]/70 text-sm">
                Reader
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex text-xs text-[#F5F3EF]/50 space-x-4">
                <span>J/K: Navigate</span>
                <span>M: Morphology</span>
                <span>T: Translation</span>
              </div>
              <button 
                onClick={() => setBookmarked(!bookmarked)}
                className={`px-3 py-2 rounded-lg border transition-all ${
                  bookmarked 
                    ? 'border-[#C9A962] bg-[#C9A962]/10 text-[#C9A962]' 
                    : 'border-[#C9A962]/20 hover:border-[#C9A962]/40 text-[#F5F3EF]/70'
                }`}
              >
                {bookmarked ? '★' : '☆'}
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Sidebar - Controls */}
          <div className="lg:w-80 space-y-6">
            {/* Work Selector */}
            <div className="bg-[#C9A962]/5 rounded-lg border border-[#C9A962]/20 p-4">
              <h3 className="text-lg font-semibold text-[#C9A962] mb-4">Select Work</h3>
              {loading && works.length === 0 ? (
                <div className="animate-spin h-6 w-6 border-2 border-[#C9A962]/20 border-t-[#C9A962] rounded-full"></div>
              ) : (
                <select 
                  value={selectedWork} 
                  onChange={(e) => setSelectedWork(e.target.value)}
                  className="w-full bg-[#0D0D0F] border border-[#C9A962]/20 rounded-lg px-3 py-2 text-[#F5F3EF] focus:border-[#C9A962]/40 focus:outline-none"
                >
                  <option value="">Select a work...</option>
                  {works.map((work) => (
                    <option key={work.urn} value={work.urn}>
                      {work.author} - {work.title}
                    </option>
                  ))}
                </select>
              )}
              {selectedWorkData && (
                <div className="mt-4 text-sm text-[#F5F3EF]/70">
                  <p><span className="text-[#C9A962]">Author:</span> {selectedWorkData.author}</p>
                  <p><span className="text-[#C9A962]">Language:</span> {selectedWorkData.language}</p>
                  <p><span className="text-[#C9A962]">URN:</span> <span className="font-mono text-xs">{selectedWorkData.urn}</span></p>
                </div>
              )}
            </div>

            {/* Translation Controls */}
            <div className="bg-[#C9A962]/5 rounded-lg border border-[#C9A962]/20 p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-[#C9A962]">Translation</h3>
                <button
                  onClick={() => setShowTranslation(!showTranslation)}
                  className={`px-3 py-1 rounded text-sm border transition-all ${
                    showTranslation 
                      ? 'border-[#C9A962] bg-[#C9A962]/10 text-[#C9A962]' 
                      : 'border-[#C9A962]/20 hover:border-[#C9A962]/40 text-[#F5F3EF]/70'
                  }`}
                >
                  {showTranslation ? 'Hide' : 'Show'}
                </button>
              </div>
              {showTranslation && (
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {(['literal', 'prose', 'poetic'] as const).map((style) => (
                      <button
                        key={style}
                        onClick={() => setTranslationStyle(style)}
                        className={`px-3 py-1 rounded text-sm border transition-all capitalize ${
                          translationStyle === style
                            ? 'border-[#C9A962] bg-[#C9A962]/10 text-[#C9A962]'
                            : 'border-[#C9A962]/20 hover:border-[#C9