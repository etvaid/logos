# counter_evidence

# Counter-Evidence Display System

## 1. Component Hierarchy and Relationships

```
CounterEvidenceProvider
└── ResearchFinding
    ├── MainEvidence
    └── CounterEvidenceContainer
        ├── CounterEvidenceToggle (always visible)
        ├── CounterEvidenceDrawer
        │   ├── ContradictionList
        │   │   ├── ContradictionCategory
        │   │   │   └── ContradictionItem[]
        │   │   └── ContradictionFilters
        │   ├── NuancePanel
        │   │   ├── AIInsight
        │   │   └── ContextualFactors
        │   └── ConfidenceAdjuster
        │       ├── ConfidenceVisualization
        │       └── ConfidenceMetrics
        └── AcknowledgeButton (floating, persistent)
```

## 2. TypeScript Interfaces

```typescript
interface Contradiction {
  id: string;
  passage: string;
  source: {
    author: string;
    work: string;
    date: string;
    location?: string;
  };
  category: ContradictionCategory;
  strength: 'weak' | 'moderate' | 'strong' | 'critical';
  relevance: number; // 0-1
  context: string;
  tags: string[];
  createdAt: Date;
}

interface ContradictionCategory {
  id: string;
  name: string;
  description: string;
  count: number;
  icon: string;
  color: string;
}

interface NuanceInsight {
  id: string;
  explanation: string;
  factors: ContextualFactor[];
  confidence: number;
  generatedAt: Date;
  sources: string[];
}

interface ContextualFactor {
  type: 'temporal' | 'geographic' | 'social' | 'rhetorical' | 'genre';
  description: string;
  impact: 'low' | 'medium' | 'high';
  examples: string[];
}

interface ConfidenceMetrics {
  original: number;
  adjusted: number;
  factors: {
    contradictionCount: number;
    strengthWeight: number;
    categoryDiversity: number;
    temporalSpread: number;
  };
  breakdown: ConfidenceBreakdown[];
}

interface ConfidenceBreakdown {
  factor: string;
  impact: number; // -100 to 100
  description: string;
}

// Component Props
interface CounterEvidenceToggleProps {
  contradictionCount: number;
  isExpanded: boolean;
  onToggle: () => void;
  severity: 'low' | 'medium' | 'high' | 'critical';
  isAcknowledged: boolean;
}

interface ContradictionListProps {
  contradictions: Contradiction[];
  categories: ContradictionCategory[];
  selectedCategory?: string;
  sortBy: 'strength' | 'relevance' | 'date' | 'author';
  onCategorySelect: (categoryId: string) => void;
  onSortChange: (sort: string) => void;
  loading: boolean;
  error?: string;
}

interface ContradictionItemProps {
  contradiction: Contradiction;
  isExpanded: boolean;
  onToggle: () => void;
  onContextRequest: (id: string) => void;
}

interface NuancePanelProps {
  insight: NuanceInsight;
  contradictions: Contradiction[];
  loading: boolean;
  onRegenerateInsight: () => void;
  onFactorExplore: (factor: ContextualFactor) => void;
}

interface ConfidenceAdjusterProps {
  metrics: ConfidenceMetrics;
  onBreakdownToggle: () => void;
  showBreakdown: boolean;
  animated?: boolean;
}

interface AcknowledgeButtonProps {
  isAcknowledged: boolean;
  onAcknowledge: () => void;
  contradictionCount: number;
  disabled: boolean;
}
```

## 3. State Management Approach

```typescript
// Context Provider
interface CounterEvidenceContextValue {
  contradictions: Contradiction[];
  categories: ContradictionCategory[];
  nuanceInsight: NuanceInsight | null;
  confidenceMetrics: ConfidenceMetrics;
  isExpanded: boolean;
  isAcknowledged: boolean;
  selectedCategory: string | null;
  sortBy: string;
  loading: {
    contradictions: boolean;
    insight: boolean;
    confidence: boolean;
  };
  error: {
    contradictions?: string;
    insight?: string;
    confidence?: string;
  };
}

interface CounterEvidenceActions {
  toggleExpanded: () => void;
  acknowledgeEvidence: () => void;
  selectCategory: (categoryId: string | null) => void;
  setSortBy: (sort: string) => void;
  regenerateInsight: () => void;
  loadMoreContradictions: () => void;
  reportContradiction: (id: string, reason: string) => void;
}

// Custom Hooks
const useCounterEvidence = (findingId: string) => {
  const [state, dispatch] = useReducer(counterEvidenceReducer, initialState);
  
  // Auto-fetch contradictions on mount
  // Real-time updates via WebSocket
  // Debounced insight regeneration
  // Confidence recalculation on data changes
};

const useConfidenceCalculation = (
  contradictions: Contradiction[],
  originalConfidence: number
) => {
  return useMemo(() => {
    // Complex algorithm considering:
    // - Number of contradictions
    // - Strength weighting
    // - Category diversity
    // - Temporal distribution
    // - Source reliability
  }, [contradictions, originalConfidence]);
};
```

## 4. Data Flow

```typescript
// Data Flow Architecture
const CounterEvidenceProvider: React.FC<{
  findingId: string;
  children: React.ReactNode;
}> = ({ findingId, children }) => {
  const [state, dispatch] = useReducer(counterEvidenceReducer, {
    contradictions: [],
    isExpanded: false,
    isAcknowledged: false,
    loading: { contradictions: true, insight: false, confidence: false }
  });

  // Auto-fetch on mount and finding changes
  useEffect(() => {
    dispatch({ type: 'FETCH_CONTRADICTIONS_START' });
    
    Promise.all([
      fetchContradictions(findingId),
      fetchNuanceInsight(findingId),
      calculateConfidenceMetrics(findingId)
    ])
    .then(([contradictions, insight, metrics]) => {
      dispatch({
        type: 'FETCH_SUCCESS',
        payload: { contradictions, insight, metrics }
      });
    })
    .catch(error => {
      dispatch({ type: 'FETCH_ERROR', payload: error.message });
    });
  }, [findingId]);

  // Real-time updates
  useWebSocket(`/findings/${findingId}/counter-evidence`, {
    onMessage: (data) => {
      dispatch({ type: 'REAL_TIME_UPDATE', payload: data });
    }
  });

  return (
    <CounterEvidenceContext.Provider value={{ state, dispatch }}>
      {children}
    </CounterEvidenceContext.Provider>
  );
};
```

## 5. Animation Specifications

```typescript
// Animation Constants
const ANIMATIONS = {
  drawerExpand: {
    duration: 400,
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
    initial: { height: 0, opacity: 0 },
    animate: { height: 'auto', opacity: 1 },
    exit: { height: 0, opacity: 0 }
  },
  
  confidenceAdjustment: {
    duration: 1200,
    easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    delay: 200 // After drawer opens
  },
  
  contradictionReveal: {
    duration: 300,
    stagger: 50, // Each item 50ms after previous
    initial: { x: -20, opacity: 0 },
    animate: { x: 0, opacity: 1 }
  },
  
  pulseWarning: {
    duration: 2000,
    repeat: Infinity,
    values: [1, 1.05, 1],
    times: [0, 0.5, 1]
  },
  
  acknowledgeSuccess: {
    duration: 600,
    initial: { scale: 1 },
    animate: { scale: [1, 1.1, 1] }
  }
};

// Framer Motion Components
const AnimatedDrawer = motion.div;
const AnimatedConfidence = motion.div;
const AnimatedContradiction = motion.div;

// Usage in Components
const CounterEvidenceDrawer: React.FC = () => {
  const { isExpanded } = useCounterEvidence();
  
  return (
    <AnimatedDrawer
      initial={ANIMATIONS.drawerExpand.initial}
      animate={isExpanded ? ANIMATIONS.drawerExpand.animate : ANIMATIONS.drawerExpand.initial}
      transition={{ duration: ANIMATIONS.drawerExpand.duration }}
      className="overflow-hidden"
    >
      {/* Content */}
    </AnimatedDrawer>
  );
};
```

## 6. Accessibility Requirements

```typescript
// ARIA Labels and Roles
const a11yProps = {
  counterEvidenceToggle: {
    role: 'button',
    'aria-expanded': 'isExpanded',
    'aria-label': `Counter-evidence: ${count} contradicting passages found`,
    'aria-describedby': 'counter-evidence-description',
    'aria-live': 'polite' // Announces count changes
  },
  
  contradictionList: {
    role: 'region',
    'aria-label': 'Contradicting evidence passages',
    'aria-busy': 'loading'
  },
  
  contradictionItem: {
    role: 'article',
    'aria-labelledby': 'contradiction-title',
    'aria-describedby': 'contradiction-context',
    tabIndex: 0
  },
  
  confidenceAdjuster: {
    role: 'img',
    'aria-label': `Confidence adjusted from ${original}% to ${adjusted}% due to counter-evidence`,
    'aria-describedby': 'confidence-explanation'
  },
  
  acknowledgeButton: {
    'aria-label': `Acknowledge ${count} pieces of counter-evidence`,
    'aria-pressed': 'isAcknowledged'
  }
};

// Keyboard Navigation
const useKeyboardNavigation = () => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          // Close expanded contradictions
          break;
        case 'Enter':
        case ' ':
          // Toggle expansion on focused items
          break;
        case 'ArrowDown':
        case 'ArrowUp':
          // Navigate through contradictions
          e.preventDefault();
          break;
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);
};

// Screen Reader Support
const ScreenReaderAnnouncement: React.FC<{ message: string }> = ({ message }) => (
  <div 
    role="status" 
    aria-live="polite" 
    className="sr-only"
  >
    {message}
  </div>
);
```

## 7. Responsive Breakpoints

```typescript
// Tailwind CSS Breakpoints
const breakpoints = {
  sm: '640px',   // Mobile landscape
  md: '768px',   // Tablet
  lg: '1024px',  // Desktop
  xl: '1280px',  // Large desktop
  '2xl': '1536px' // Extra large
};

// Responsive Component Layouts
const ResponsiveCounterEvidence: React.FC = () => {
  return (
    <div className={`
      // Mobile: Stack vertically, full width
      flex flex-col space-y-4
      
      // Tablet: Side-by-side with toggle always visible
      md:flex-row md:space-y-0 md:space-x-4
      
      // Desktop: Fixed sidebar layout
      lg:grid lg:grid-cols-4 lg:gap-6
      
      // Large desktop: More breathing room
      xl:gap-8
    `}>
      
      {/* Toggle - Always visible, responsive sizing */}
      <CounterEvidenceToggle 
        className={`
          // Mobile: Full width, prominent
          w-full py-4 px-6 text-lg
          
          // Tablet: Reduced padding
          md:py-3 md:px-4 md:text-base
          
          // Desktop: Sidebar width
          lg:col-span-1 lg:sticky lg:top-4
          
          // Large desktop: Refined spacing
          xl:py-4 xl:px-6
        `}
      />
      
      {/* Main content area */}
      <div className={`
        // Mobile: Full width
        w-full
        
        // Desktop: Main content area
        lg:col-span-3
      `}>
        
        {/* Contradictions - Responsive grid */}
        <ContradictionList 
          className={`
            // Mobile: Single column
            grid grid-cols-1 gap-4
            
            // Tablet: Two columns
            md:grid-cols-2
            
            // Desktop: Three columns if space allows
            lg:grid-cols-1 xl:grid-cols-2
          `}
        />
        
        {/* Nuance Panel - Responsive text */}
        <NuancePanel 
          className={`
            // Mobile: Smaller text, more padding
            text-sm p-4 mt-6
            
            // Tablet: Standard text
            md:text-base md:p-6
            
            // Desktop: Larger text, more space
            lg:text-lg lg:p-8 lg:mt-8
          `}
        />
        
      </div>
    </div>
  );
};

// Responsive Hook
const useResponsive = () => {
  const [breakpoint, setBreakpoint] = useState<string>('sm');
  
  useEffect(() => {
    const checkBreakpoint = () => {
      const width = window.innerWidth;
      if (width >= 1536) setBreakpoint('2xl');
      else if (width >= 1280) setBreakpoint('xl');
      else if (width >= 1024) setBreakpoint('lg');
      else if (width >= 768) setBreakpoint('md');
      else setBreakpoint('sm');
    };
    
    checkBreakpoint();
    window.addEventListener('resize', checkBreakpoint);
    return () => window.removeEventListener('resize', checkBreakpoint);
  }, []);
  
  return breakpoint;
};
```

## 8. Loading/Error/Empty States

```typescript
// Loading States
const LoadingStates = {
  contradictions: {
    skeleton: (
      <div className="space-y-4">
        {Array(5).fill(0).map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-3