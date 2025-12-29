'use client';

import { useState, useCallback, useEffect } from 'react';
import Link from 'next/link';

interface PatternEvidence {
  textId: string;
  author: string;
  work: string;
  passage: string;
  language: 'greek' | 'latin';
  context: string;
  relevance: number;
  book?: number;
  chapter?: number;
  line?: number;
}

interface Pattern {
  id: string;
  type: 'syntactic' | 'semantic' | 'thematic' | 'stylistic';
  order: 1 | 2 | 3 | 4;
  pattern: string;
  description: string;
  frequency: number;
  confidence: number;
  significance: number;
  evidence: PatternEvidence[];
  relatedPatterns: string[];
  temporalDistribution: Array<{
    period: string;
    frequency: number;
  }>;
  authorDistribution: Array<{
    author: string;
    frequency: number;
  }>;
  discoveredAt: string;
}

interface ResearchHypothesis {
  id: string;
  title: string;
  description: string;
  relatedPatterns: string[];
  researchQuestions: string[];
  methodology: string;
  expectedOutcomes: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: string;
  keywords: string[];
}

interface PaperGeneration {
  title: string;
  abstract: string;
  introduction: string;
  methodology: string;
  findings: string;
  conclusion: string;
  bibliography: string[];
  patterns: string[];
  language: 'english' | 'latin';
  style: 'academic' | 'dissertation' | 'article';
  length: 'short' | 'medium' | 'long';
}

export default function DiscoveryPage() {
  const [patterns, setPatterns] = useState<Pattern[]>([]);
  const [filteredPatterns, setFilteredPatterns] = useState<Pattern[]>([]);
  const [hypotheses, setHypotheses] = useState<ResearchHypothesis[]>([]);
  const [selectedPattern, setSelectedPattern] = useState<Pattern | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeOrder, setActiveOrder] = useState<1 | 2 | 3 | 4>(1);
  const [activeType, setActiveType] = useState<'all' | 'syntactic' | 'semantic' | 'thematic' | 'stylistic'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showPatternDetails, setShowPatternDetails] = useState(false);
  const [showHypotheses, setShowHypotheses] = useState(true);
  const [selectedHypothesis, setSelectedHypothesis] = useState<ResearchHypothesis | null>(null);
  const [paperGeneration, setPaperGeneration] = useState<PaperGeneration | null>(null);
  const [generatingPaper, setGeneratingPaper] = useState(false);
  const [showPaperModal, setShowPaperModal] = useState(false);
  const [paperSettings, setPaperSettings] = useState({
    language: 'english' as 'english' | 'latin',
    style: 'academic' as 'academic' | 'dissertation' | 'article',
    length: 'medium' as 'short' | 'medium' | 'long',
    includePatterns: [] as string[]
  });

  const fetchPatterns = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8000/discovery/patterns');
      if (!response.ok) {
        throw new Error('Failed to fetch patterns');
      }
      const data: Pattern[] = await response.json();
      setPatterns(data);
      setFilteredPatterns(data.filter(p => p.order === 1));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load patterns');
      // Fallback mock data
      const mockPatterns: Pattern[] = [
        {
          id: '1',
          type: 'syntactic',
          order: 1,
          pattern: 'Chiastic Structure in Epic Poetry',
          description: 'ABCBA pattern in narrative structure across Greek and Latin epic texts',
          frequency: 847,
          confidence: 0.89,
          significance: 0.92,
          evidence: [
            {
              textId: 'iliad_1',
              author: 'Homer',
              work: 'Iliad',
              passage: 'μῆνιν ἄειδε θεὰ Πηληϊάδεω Ἀχιλῆος οὐλομένην',
              language: 'greek',
              context: 'Opening invocation showing chiastic arrangement',
              relevance: 0.94,
              book: 1,
              line: 1
            },
            {
              textId: 'aeneid_1',
              author: 'Virgil',
              work: 'Aeneid',
              passage: 'Arma virumque cano, Troiae qui primus ab oris',
              language: 'latin',
              context: 'Epic opening with structural parallelism',
              relevance: 0.87,
              book: 1,
              line: 1
            }
          ],
          relatedPatterns: ['epic_formulae', 'ring_composition'],
          temporalDistribution: [
            { period: 'Archaic', frequency: 234 },
            { period: 'Classical', frequency: 312 },
            { period: 'Hellenistic', frequency: 189 },
            { period: 'Roman', frequency: 112 }
          ],
          authorDistribution: [
            { author: 'Homer', frequency: 156 },
            { author: 'Virgil', frequency: 89 },
            { author: 'Apollonius', frequency: 67 }
          ],
          discoveredAt: '2024-01-15T10:30:00Z'
        },
        {
          id: '2',
          type: 'semantic',
          order: 2,
          pattern: 'Divine Intervention Motifs',
          description: 'Recurring semantic patterns in descriptions of divine intervention across genres',
          frequency: 623,
          confidence: 0.82,
          significance: 0.88,
          evidence: [
            {
              textId: 'iliad_2',
              author: 'Homer',
              work: 'Iliad',
              passage: 'τὸν δ᾽ ἀπαμειβόμενος προσέφη κρείων Ἀγαμέμνων',
              language: 'greek',
              context: 'Divine-mortal dialogue patterns',
              relevance: 0.91
            }
          ],
          relatedPatterns: ['divine_epithets', 'theophany'],
          temporalDistribution: [
            { period: 'Archaic', frequency: 189 },
            { period: 'Classical', frequency: 267 },
            { period: 'Hellenistic', frequency: 123 },
            { period: 'Roman', frequency: 44 }
          ],
          authorDistribution: [
            { author: 'Homer', frequency: 134 },
            { author: 'Hesiod', frequency: 78 },
            { author: 'Aeschylus', frequency: 56 }
          ],
          discoveredAt: '2024-01-16T14:22:00Z'
        },
        {
          id: '3',
          type: 'thematic',
          order: 3,
          pattern: 'Exile and Return Narratives',
          description: 'Complex thematic patterns of exile, wandering, and homecoming',
          frequency: 445,
          confidence: 0.91,
          significance: 0.86,
          evidence: [
            {
              textId: 'odyssey_1',
              author: 'Homer',
              work: 'Odyssey',
              passage: 'ἄνδρα μοι ἔννεπε, μοῦσα, πολύτροπον, ὃς μάλα πολλὰ',
              language: 'greek',
              context: 'Archetypal exile narrative opening',
              relevance: 0.96
            }
          ],
          relatedPatterns: ['nostos_theme', 'wandering_hero'],
          temporalDistribution: [
            { period: 'Archaic', frequency: 167 },
            { period: 'Classical', frequency: 134 },
            { period: 'Hellenistic', frequency: 89 },
            { period: 'Roman', frequency: 55 }
          ],
          authorDistribution: [
            { author: 'Homer', frequency: 89 },
            { author: 'Virgil', frequency: 67 },
            { author: 'Ovid', frequency: 45 }
          ],
          discoveredAt: '2024-01-17T09:15:00Z'
        },
        {
          id: '4',
          type: 'stylistic',
          order: 4,
          pattern: 'Meta-Literary Commentary',
          description: 'Fourth-order patterns of self-referential literary commentary within texts',
          frequency: 234,
          confidence: 0.76,
          significance: 0.83,
          evidence: [
            {
              textId: 'metamorphoses_1',
              author: 'Ovid',
              work: 'Metamorphoses',
              passage: 'In nova fert animus mutatas dicere formas',
              language: 'latin',
              context: 'Self-conscious narrative transformation',
              relevance: 0.88
            }
          ],
          relatedPatterns: ['narrative_voice', 'poetic_self_reference'],
          temporalDistribution: [
            { period: 'Classical', frequency: 78 },
            { period: 'Hellenistic', frequency: 89 },
            { period: 'Roman', frequency: 67 }
          ],
          authorDistribution: [
            { author: 'Ovid', frequency: 45 },
            { author: 'Horace', frequency: 34 },
            { author: 'Propertius', frequency: 28 }
          ],
          discoveredAt: '2024-01-18T16:45:00Z'
        }
      ];
      setPatterns(mockPatterns);
      setFilteredPatterns(mockPatterns.filter(p => p.order === 1));
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchHypotheses = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:8000/discovery/hypotheses');
      if (!response.ok) throw new Error('Failed to fetch hypotheses');
      const data: ResearchHypothesis[] = await response.json();
      setHypotheses(data);
    } catch (err) {
      console.error('Failed to fetch hypotheses:', err);
      // Fallback mock data
      setHypotheses([
        {
          id: '1',
          title: 'Cross-Cultural Epic Formulae Evolution',
          description: 'Investigation of how epic formulaic patterns evolved from Greek to Latin literature',
          relatedPatterns: ['1', '3'],
          researchQuestions: [
            'How did Virgil adapt Homeric formulaic structures?',
            'What new patterns emerged in Latin epic poetry?',
            'How do syntactic differences affect formulaic adaptation?'
          ],
          methodology: 'Comparative stylometric analysis with computational pattern recognition',
          expectedOutcomes: [
            'Quantified influence metrics',
            'Novel formulaic pattern identification',
            'Temporal evolution mapping'
          ],
          difficulty: 'advanced',
          estimatedTime: '6-8 months',
          keywords: ['epic', 'formulae', 'adaptation', 'Homer', 'Virgil']
        },
        {
          id: '2',
          title: 'Divine Intervention Semantics Across Genres',
          description: 'Analysis of how divine intervention motifs vary across epic, tragedy, and history',
          relatedPatterns: ['2'],
          researchQuestions: [
            'How do divine intervention patterns differ by genre?',
            'What semantic fields are consistently associated?',
            'How did these patterns evolve over time?'
          ],
          methodology: 'Semantic network analysis with corpus-wide pattern matching',
          expectedOutcomes: [
            'Genre-specific pattern taxonomy',
            'Semantic evolution timeline',
            'Cross-genre influence mapping'
          ],
          difficulty: 'intermediate',
          estimatedTime: '4-6 months',
          keywords: ['divine', 'intervention', 'genre', 'semantics']
        }
      ]);
    }
  }, []);

  useEffect(() => {
    fetchPatterns();
    fetchHypotheses();
  }, [fetchPatterns, fetchHypotheses]);

  const filterPatterns = useCallback(() => {
    let filtered = patterns.filter(p => p.order === activeOrder);
    
    if (activeType !== 'all') {
      filtered = filtered.filter(p => p.type === activeType);
    }
    
    if (searchTerm) {
      filtered = filtered.filter(p => 
        p.pattern.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredPatterns(filtered);
  }, [patterns, activeOrder, activeType, searchTerm]);

  useEffect(() => {
    filterPatterns();
  }, [filterPatterns]);

  const generatePaper = useCallback(async (patternIds: string[], settings: typeof paperSettings) => {
    setGeneratingPaper(true);
    
    try {
      const response = await fetch('http://localhost:8000/discovery/generate-paper', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          patterns: