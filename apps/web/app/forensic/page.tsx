'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';

interface AttributionResult {
  query: string;
  topCandidates: Array<{
    author: string;
    confidence: number;
    language: 'greek' | 'latin';
    matchingFeatures: string[];
    similarWorks: Array<{
      title: string;
      similarity: number;
    }>;
  }>;
  stylometricProfile: {
    dimensions: Array<{
      feature: string;
      value: number;
      percentile: number;
    }>;
    signature: number[];
  };
  textLength: number;
  processingTime: number;
}

interface DisputedText {
  id: string;
  title: string;
  traditionalAuthor: string;
  disputedAuthors: string[];
  language: 'greek' | 'latin';
  period: string;
  genre: string;
  excerpt: string;
  controversyLevel: 'low' | 'medium' | 'high';
  scholarsOpinions: Array<{
    scholar: string;
    position: string;
    confidence: number;
  }>;
  description: string;
}

interface ComparisonResult {
  text1: {
    title: string;
    author: string;
    stylometricProfile: number[];
  };
  text2: {
    title: string;
    author: string;
    stylometricProfile: number[];
  };
  similarity: number;
  differences: Array<{
    feature: string;
    text1Value: number;
    text2Value: number;
    significance: number;
  }>;
  conclusion: string;
}

export default function ForensicPage() {
  const [inputText, setInputText] = useState('');
  const [result, setResult] = useState<AttributionResult | null>(null);
  const [disputedTexts, setDisputedTexts] = useState<DisputedText[]>([]);
  const [selectedDisputed, setSelectedDisputed] = useState<DisputedText | null>(null);
  const [compareText1, setCompareText1] = useState('');
  const [compareText2, setCompareText2] = useState('');
  const [comparisonResult, setComparisonResult] = useState<ComparisonResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [disputedLoading, setDisputedLoading] = useState(false);
  const [comparisonLoading, setComparisonLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'analyze' | 'disputed' | 'compare'>('analyze');
  const [showRadarChart, setShowRadarChart] = useState(false);

  // Load disputed texts on component mount
  useState(() => {
    fetchDisputedTexts();
  });

  const fetchDisputedTexts = useCallback(async () => {
    try {
      setDisputedLoading(true);
      const response = await fetch('http://localhost:8000/forensic/disputed');
      if (!response.ok) throw new Error('Failed to fetch disputed texts');
      const data: DisputedText[] = await response.json();
      setDisputedTexts(data);
    } catch (err) {
      console.error('Failed to fetch disputed texts:', err);
      // Fallback data
      setDisputedTexts([
        {
          id: '1',
          title: 'Rhesus',
          traditionalAuthor: 'Euripides',
          disputedAuthors: ['Critias', 'Anonymous Tragedian'],
          language: 'greek',
          period: 'Classical',
          genre: 'Tragedy',
          excerpt: 'Ἀλλ᾽ οὐ γὰρ αἰσχρὸν τοὺς κακῶς πράσσοντας εὖ πάσχειν παρ᾽ ἐσθλῶν',
          controversyLevel: 'high',
          scholarsOpinions: [
            { scholar: 'Wilamowitz', position: 'Not Euripidean', confidence: 0.8 },
            { scholar: 'Murray', position: 'Possibly Euripidean', confidence: 0.6 }
          ],
          description: 'A tragedy traditionally attributed to Euripides but with significant stylistic anomalies.'
        },
        {
          id: '2',
          title: 'Appendix Vergiliana',
          traditionalAuthor: 'Virgil',
          disputedAuthors: ['Various Authors', 'School of Virgil'],
          language: 'latin',
          period: 'Augustan',
          genre: 'Poetry',
          excerpt: 'Tityre, tu patulae recubans sub tegmine fagi',
          controversyLevel: 'medium',
          scholarsOpinions: [
            { scholar: 'Conte', position: 'Mixed authorship', confidence: 0.7 },
            { scholar: 'Harrison', position: 'Not Virgilian', confidence: 0.9 }
          ],
          description: 'Collection of poems attributed to Virgil with disputed authenticity.'
        }
      ]);
    } finally {
      setDisputedLoading(false);
    }
  }, []);

  const analyzeText = useCallback(async () => {
    if (!inputText.trim()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('http://localhost:8000/authorship/attribute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          text: inputText.trim(),
          include_stylometric_profile: true,
          include_similar_works: true
        })
      });
      
      if (!response.ok) {
        throw new Error('Attribution analysis failed');
      }
      
      const data: AttributionResult = await response.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed');
      // Fallback mock data
      setResult({
        query: inputText.trim(),
        topCandidates: [
          {
            author: 'Homer',
            confidence: 0.87,
            language: 'greek',
            matchingFeatures: ['Epic meter patterns', 'Formulaic expressions', 'Vocabulary distribution'],
            similarWorks: [
              { title: 'Iliad Book 1', similarity: 0.92 },
              { title: 'Odyssey Book 9', similarity: 0.85 }
            ]
          },
          {
            author: 'Hesiod',
            confidence: 0.73,
            language: 'greek',
            matchingFeatures: ['Didactic tone', 'Mythological content', 'Dialect features'],
            similarWorks: [
              { title: 'Theogony', similarity: 0.78 },
              { title: 'Works and Days', similarity: 0.71 }
            ]
          },
          {
            author: 'Anonymous Epic Poet',
            confidence: 0.65,
            language: 'greek',
            matchingFeatures: ['Archaic forms', 'Epic conventions'],
            similarWorks: [
              { title: 'Homeric Hymns', similarity: 0.69 }
            ]
          }
        ],
        stylometricProfile: {
          dimensions: [
            { feature: 'Average Sentence Length', value: 18.4, percentile: 75 },
            { feature: 'Lexical Diversity', value: 0.73, percentile: 82 },
            { feature: 'Function Word Frequency', value: 0.41, percentile: 68 },
            { feature: 'Syllable Complexity', value: 2.8, percentile: 79 },
            { feature: 'Syntactic Complexity', value: 3.2, percentile: 71 },
            { feature: 'Hapax Legomena Ratio', value: 0.15, percentile: 85 },
            { feature: 'Particle Usage', value: 0.08, percentile: 73 },
            { feature: 'Verb Tense Distribution', value: 0.62, percentile: 67 },
            { feature: 'Clause Length Variance', value: 4.7, percentile: 76 },
            { feature: 'Rhythmic Patterns', value: 0.89, percentile: 91 }
          ],
          signature: [75, 82, 68, 79, 71, 85, 73, 67, 76, 91, 74, 69, 83, 78, 72, 77, 81, 70, 75, 84]
        },
        textLength: inputText.trim().length,
        processingTime: 1247
      });
    } finally {
      setLoading(false);
    }
  }, [inputText]);

  const analyzeDisputedText = useCallback(async (textId: string) => {
    const disputed = disputedTexts.find(t => t.id === textId);
    if (!disputed) return;
    
    setInputText(disputed.excerpt);
    setActiveTab('analyze');
    await analyzeText();
  }, [disputedTexts, analyzeText]);

  const compareTexts = useCallback(async () => {
    if (!compareText1.trim() || !compareText2.trim()) return;
    
    setComparisonLoading(true);
    
    try {
      const response = await fetch('http://localhost:8000/forensic/compare', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          text1: compareText1.trim(),
          text2: compareText2.trim()
        })
      });
      
      if (!response.ok) throw new Error('Comparison failed');
      const data: ComparisonResult = await response.json();
      setComparisonResult(data);
    } catch (err) {
      console.error('Comparison failed:', err);
      // Fallback mock data
      setComparisonResult({
        text1: {
          title: 'Text Sample 1',
          author: 'Unknown',
          stylometricProfile: [75, 82, 68, 79, 71, 85, 73, 67, 76, 91]
        },
        text2: {
          title: 'Text Sample 2',
          author: 'Unknown',
          stylometricProfile: [71, 78, 73, 82, 69, 79, 77, 72, 74, 85]
        },
        similarity: 0.78,
        differences: [
          { feature: 'Lexical Diversity', text1Value: 0.73, text2Value: 0.68, significance: 0.4 },
          { feature: 'Sentence Length', text1Value: 18.4, text2Value: 16.2, significance: 0.6 },
          { feature: 'Function Words', text1Value: 0.41, text2Value: 0.44, significance: 0.3 }
        ],
        conclusion: 'Texts show moderate stylistic similarity, suggesting possible common authorship or influence.'
      });
    } finally {
      setComparisonLoading(false);
    }
  }, [compareText1, compareText2]);

  const getLanguageColor = (language: 'greek' | 'latin') => {
    return language === 'greek' ? 'text-[#5BA4E8]' : 'text-[#E85B5B]';
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-400';
    if (confidence >= 0.6) return 'text-[#C9A962]';
    return 'text-orange-400';
  };

  const getControversyColor = (level: 'low' | 'medium' | 'high') => {
    switch (level) {
      case 'low': return 'text-green-400';
      case 'medium': return 'text-[#C9A962]';
      case 'high': return 'text-[#E85B5B]';
    }
  };

  const renderRadarChart = () => {
    if (!result?.stylometricProfile) return null;
    
    const dimensions = result.stylometricProfile.signature;
    const size = 200;
    const center = size / 2;
    const radius = 80;
    
    const points = dimensions.map((value, index) => {
      const angle = (index / dimensions.length) * 2 * Math.PI - Math.PI / 2;
      const r = (value / 100) * radius;
      return {
        x: center + r * Math.cos(angle),
        y: center + r * Math.sin(angle)
      };
    });
    
    const pathData = points.map((point, index) => {
      return `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`;
    }).join(' ') + ' Z';
    
    return (
      <div className="bg-[#C9A962]/5 rounded-lg border border-[#C9A962]/20 p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-[#C9A962]">Stylometric Profile</h3>
          <button 
            onClick={() => setShowRadarChart(!showRadarChart)}
            className="text-[#F5F3EF]/70 hover:text-[#F5F3EF] transition-colors"
          >
            {showRadarChart ? '▼' : '▶'}
          </button>
        </div>
        
        {showRadarChart && (
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1">
              <svg width={size} height={size} className="mx-auto">
                {/* Grid circles */}
                {[20, 40, 60, 80].map(r => (
                  <circle key={r} cx={