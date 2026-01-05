# debate_view

# Debate View Component System

## 1. Component Hierarchy & Relationships

```
DebateView
├── DebateHeader
│   ├── DebateQuestion
│   └── DebateFilters
├── PositionsGrid
│   ├── PositionColumn (A)
│   │   ├── PositionHeader
│   │   ├── AuthorStack
│   │   │   └── AuthorCard[]
│   │   └── QuoteCarousel
│   │       └── QuoteCard[]
│   ├── PositionColumn (B)
│   └── PositionColumn (C)
├── VerdictBar
└── AnalysisPanel
    ├── TimelineOverlay
    ├── GenreBreakdown
    └── ConfidenceMetrics
```

## 2. TypeScript Interfaces

```typescript
interface DebateData {
  id: string;
  question: string;
  description: string;
  confidence: number; // 0-1, AI confidence in debate identification
  positions: Position[];
  timeline: TimelineEntry[];
  genreBreakdown: GenreData[];
  metadata: {
    totalAuthors: number;
    totalPassages: number;
    dateRange: [number, number]; // BCE years
    lastUpdated: string;
  };
}

interface Position {
  id: string;
  label: string; // "Position A", "Position B", etc.
  title: string; // "Determinism", "Libertarian Free Will"
  description: string;
  percentage: number; // 0-100, corpus distribution
  confidence: number; // 0-1, AI confidence in classification
  authors: AuthorPosition[];
  quotes: Quote[];
  keyArguments: string[];
  evolution: PositionEvolution[];
}

interface AuthorPosition {
  author: Author;
  confidence: number; // 0-1, certainty author held this position
  passageCount: number;
  keyWorks: Work[];
  strength: 'strong' | 'moderate' | 'weak'; // conviction level
}

interface Author {
  id: string;
  name: string;
  nameGreek?: string;
  dates: [number, number]; // BCE birth/death
  school: string;
  avatar?: string;
  color: string; // for visual consistency
}

interface Quote {
  id: string;
  text: string;
  textGreek?: string;
  author: Author;
  work: Work;
  passage: string; // citation
  context: string;
  relevanceScore: number; // 0-1, how well it represents position
  sentiment: number; // -1 to 1, strength of position
}

interface Work {
  id: string;
  title: string;
  titleGreek?: string;
  author: Author;
  genre: string;
  dateComposed: number; // BCE
}

interface TimelineEntry {
  period: string; // "Hellenistic", "Imperial", etc.
  dateRange: [number, number];
  distribution: Record<string, number>; // positionId -> percentage
  significantEvents: string[];
}

interface GenreData {
  genre: string;
  distribution: Record<string, number>; // positionId -> percentage
  totalWorks: number;
  examples: Work[];
}

interface DebateFilters {
  timeRange: [number, number];
  genres: string[];
  schools: string[];
  minConfidence: number;
  showOnlyStrongPositions: boolean;
}

interface DebateViewProps {
  debateId: string;
  initialFilters?: Partial<DebateFilters>;
  onAuthorClick?: (author: Author) => void;
  onQuoteClick?: (quote: Quote) => void;
  className?: string;
}

interface PositionColumnProps {
  position: Position;
  totalAuthors: number;
  isHighlighted?: boolean;
  onAuthorClick?: (author: Author) => void;
  onQuoteClick?: (quote: Quote) => void;
}

interface AuthorStackProps {
  authors: AuthorPosition[];
  maxVisible: number;
  onAuthorClick?: (author: Author) => void;
  sortBy: 'confidence' | 'chronological' | 'influence';
}

interface QuoteCarouselProps {
  quotes: Quote[];
  maxVisible: number;
  autoRotate: boolean;
  onQuoteClick?: (quote: Quote) => void;
}

interface VerdictBarProps {
  positions: Position[];
  showPercentages: boolean;
  animated: boolean;
  onClick?: (position: Position) => void;
}

interface TimelineOverlayProps {
  timeline: TimelineEntry[];
  selectedPeriod?: string;
  onPeriodSelect?: (period: string) => void;
}
```

## 3. State Management Approach

```typescript
// Context for debate data and filters
interface DebateContextValue {
  debate: DebateData | null;
  filters: DebateFilters;
  loading: boolean;
  error: string | null;
  
  // Interactions
  highlightedPosition: string | null;
  selectedAuthor: Author | null;
  selectedQuote: Quote | null;
  selectedTimePeriod: string | null;
  
  // Actions
  updateFilters: (filters: Partial<DebateFilters>) => void;
  highlightPosition: (positionId: string | null) => void;
  selectAuthor: (author: Author | null) => void;
  selectQuote: (quote: Quote | null) => void;
  selectTimePeriod: (period: string | null) => void;
  refetchDebate: () => Promise<void>;
}

// Custom hooks
function useDebateData(debateId: string) {
  const [state, setState] = useState<{
    data: DebateData | null;
    loading: boolean;
    error: string | null;
  }>({ data: null, loading: true, error: null });
  
  // Fetch and cache logic
  return state;
}

function useDebateFilters(initialFilters?: Partial<DebateFilters>) {
  const [filters, setFilters] = useState<DebateFilters>({
    timeRange: [-800, 500], // 800 BCE to 500 CE
    genres: [],
    schools: [],
    minConfidence: 0.3,
    showOnlyStrongPositions: false,
    ...initialFilters
  });
  
  const updateFilters = useCallback((updates: Partial<DebateFilters>) => {
    setFilters(prev => ({ ...prev, ...updates }));
  }, []);
  
  return [filters, updateFilters] as const;
}

// Derived data hooks
function useFilteredPositions(
  positions: Position[], 
  filters: DebateFilters
): Position[] {
  return useMemo(() => {
    return positions
      .filter(pos => pos.confidence >= filters.minConfidence)
      .filter(pos => !filters.showOnlyStrongPositions || pos.percentage > 20)
      .map(pos => ({
        ...pos,
        authors: pos.authors.filter(auth => 
          auth.author.dates[0] >= filters.timeRange[0] &&
          auth.author.dates[1] <= filters.timeRange[1] &&
          (filters.schools.length === 0 || filters.schools.includes(auth.author.school))
        )
      }));
  }, [positions, filters]);
}
```

## 4. Data Flow Between Components

```typescript
// Top-level DebateView component
export const DebateView: React.FC<DebateViewProps> = ({
  debateId,
  initialFilters,
  onAuthorClick,
  onQuoteClick,
  className
}) => {
  const debate = useDebateData(debateId);
  const [filters, updateFilters] = useDebateFilters(initialFilters);
  const [uiState, setUIState] = useState({
    highlightedPosition: null,
    selectedAuthor: null,
    selectedQuote: null,
    selectedTimePeriod: null
  });
  
  const filteredPositions = useFilteredPositions(
    debate.data?.positions || [], 
    filters
  );
  
  // Event handlers that coordinate between components
  const handlePositionHighlight = useCallback((positionId: string | null) => {
    setUIState(prev => ({ ...prev, highlightedPosition: positionId }));
  }, []);
  
  const handleAuthorSelect = useCallback((author: Author | null) => {
    setUIState(prev => ({ ...prev, selectedAuthor: author }));
    onAuthorClick?.(author);
  }, [onAuthorClick]);
  
  const handleTimelinePeriodSelect = useCallback((period: string) => {
    setUIState(prev => ({ ...prev, selectedTimePeriod: period }));
    // Update filters to match period
    const timelineEntry = debate.data?.timeline.find(t => t.period === period);
    if (timelineEntry) {
      updateFilters({ timeRange: timelineEntry.dateRange });
    }
  }, [debate.data, updateFilters]);
  
  // Context value
  const contextValue: DebateContextValue = {
    debate: debate.data,
    filters,
    loading: debate.loading,
    error: debate.error,
    ...uiState,
    updateFilters,
    highlightPosition: handlePositionHighlight,
    selectAuthor: handleAuthorSelect,
    selectQuote: handleQuoteSelect,
    selectTimePeriod: handleTimelinePeriodSelect,
    refetchDebate: debate.refetch
  };
  
  return (
    <DebateContext.Provider value={contextValue}>
      {/* Component tree */}
    </DebateContext.Provider>
  );
};

// Data flows:
// 1. User filters → updateFilters → filteredPositions → PositionColumns
// 2. Position hover → highlightPosition → VerdictBar highlight
// 3. Timeline selection → selectTimePeriod → filter update → re-render
// 4. Author click → selectAuthor → highlight in AuthorStack + external callback
// 5. Quote interaction → selectQuote → QuoteCarousel state + external callback
```

## 5. Animation Specifications

```typescript
// Framer Motion variants
const debateAnimations = {
  // Staggered entrance for positions
  positionsContainer: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1
      }
    }
  },
  
  positionColumn: {
    hidden: { 
      opacity: 0, 
      y: 30,
      scale: 0.95
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 25,
        duration: 0.6
      }
    },
    highlighted: {
      scale: 1.02,
      boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
      transition: { duration: 0.2 }
    }
  },
  
  // Verdict bar animation
  verdictBar: {
    hidden: { scaleX: 0 },
    visible: { 
      scaleX: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 20,
        delay: 0.3
      }
    }
  },
  
  verdictSegment: {
    initial: { width: 0 },
    animate: (percentage: number) => ({
      width: `${percentage}%`,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        delay: 0.1
      }
    })
  },
  
  // Author stack animations
  authorStack: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.2
      }
    }
  },
  
  authorCard: {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { type: "spring", stiffness: 400, damping: 25 }
    },
    hover: {
      scale: 1.05,
      transition: { duration: 0.15 }
    },
    tap: { scale: 0.98 }
  },
  
  // Quote carousel
  quoteCarousel: {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 300 : -300,
      opacity: 0
    })
  },
  
  // Timeline overlay
  timeline: {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { delay: 0.5, duration: 0.4 }
    }
  },
  
  timelinePeriod: {
    inactive: { opacity: 0.6, scale: 0.95 },
    active: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.2 }
    },
    hover: { scale: 1.05 }
  }
};

// Usage in components
const PositionColumn: React.FC<PositionColumnProps> = ({ position, isHighlighted }) => {
  return (
    <motion.div
      variants={debateAnimations.positionColumn}
      initial="hidden"
      animate={isHighlighted ? "highlighted" : "visible"}
      whileHover="highlighted"
      className="position-column"
    >
      {/* Content */}
    </motion.div>
  );
};

// Scroll-triggered animations
const useScrollAnimation = () => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });
  
  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);
  
  return [ref, controls];
};
```

## 6. Accessibility Requirements

```typescript
// ARIA labels and roles
const accessibilityProps = {
  debateView: {
    role: "main",
    "aria-labelledby": "debate-question",
    "aria-describedby": "debate-description"
  },
  
  positionColumn: (position: Position, index: number) => ({
    role: "region",
    "aria-labelledby": `position-${position.id}-title`,
    "aria-describedby": `position-${position.id}-description`,
    tabIndex: 0,
    onKeyDown: (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        // Handle position selection
      }
    }
  }),
  
  authorStack: {
    role: "list",
    "aria-label": "Authors supporting this position"
  },
  
  authorCard: (author: Author) => ({
    role: "listitem",
    tabIndex: 0,
    "aria-label": `${author.name},