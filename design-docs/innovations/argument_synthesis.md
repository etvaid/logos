# argument_synthesis

# Argument Synthesis Layer - React Component System

## 1. Component Hierarchy and Relationships

```
ArgumentSynthesisLayer/
├── ArgumentCard (Main container)
│   ├── ThesisHeader
│   │   ├── ThesisStatement
│   │   ├── ConfidenceGauge
│   │   └── ExportActions
│   ├── ArgumentAbstract
│   ├── KeyPointsList
│   │   └── KeyPointItem[]
│   │       ├── EvidenceChain
│   │       │   ├── EvidenceNode[]
│   │       │   └── PassagePreview
│   │       └── EvidenceToggle
│   ├── CounterEvidenceDrawer
│   │   ├── CounterEvidenceItem[]
│   │   └── CounterEvidenceToggle
│   └── RefinePanel
│       ├── FollowUpInput
│       ├── RefinementSuggestions
│       └── RefineButton
└── CitationExporter (Modal)
    ├── ExportFormatTabs
    ├── CitationPreview
    └── ExportActions
```

## 2. TypeScript Interfaces

```typescript
interface Passage {
  id: string;
  content: string;
  source: {
    author: string;
    title: string;
    publication?: string;
    year: number;
    pages?: string;
    url?: string;
  };
  relevanceScore: number;
  timestamp: Date;
  highlights: Array<{
    start: number;
    end: number;
    type: 'supporting' | 'contradicting' | 'contextual';
  }>;
}

interface EvidenceChainNode {
  id: string;
  passage: Passage;
  connectionType: 'direct' | 'inferential' | 'contextual';
  strength: number; // 0-1
  position: { x: number; y: number }; // for visual positioning
}

interface KeyPoint {
  id: string;
  statement: string;
  supportingPassages: Passage[];
  evidenceChain: EvidenceChainNode[];
  confidenceScore: number;
  order: number;
  category: string;
}

interface CounterEvidence {
  id: string;
  statement: string;
  passages: Passage[];
  severity: 'minor' | 'moderate' | 'significant';
  refutability: number; // 0-1, how easily this can be addressed
}

interface ArgumentSynthesis {
  id: string;
  query: string;
  thesis: string;
  abstract: string;
  overallConfidence: number;
  keyPoints: KeyPoint[];
  counterEvidence: CounterEvidence[];
  totalPassagesAnalyzed: number;
  generatedAt: Date;
  lastRefined?: Date;
}

interface RefinementSuggestion {
  id: string;
  question: string;
  type: 'clarification' | 'expansion' | 'counter-investigation';
  estimatedNewPassages: number;
}

// Component Props
interface ArgumentCardProps {
  synthesis: ArgumentSynthesis;
  isLoading?: boolean;
  error?: string;
  onRefine: (query: string) => Promise<void>;
  onExport: (format: 'zotero' | 'bibtex' | 'apa' | 'mla') => void;
  className?: string;
}

interface ConfidenceGaugeProps {
  confidence: number;
  totalPassages: number;
  size?: 'small' | 'medium' | 'large';
  showDetails?: boolean;
  animated?: boolean;
}

interface EvidenceChainProps {
  chain: EvidenceChainNode[];
  keyPointId: string;
  isExpanded: boolean;
  onPassageSelect: (passageId: string) => void;
  maxVisibleNodes?: number;
}

interface CounterEvidenceDrawerProps {
  counterEvidence: CounterEvidence[];
  isOpen: boolean;
  onToggle: () => void;
  onAddressCounterEvidence: (id: string, response: string) => void;
}

interface RefinePanelProps {
  suggestions: RefinementSuggestion[];
  isRefining: boolean;
  onRefine: (query: string) => Promise<void>;
  onGenerateSuggestions: () => void;
}
```

## 3. State Management Approach

Using Zustand for global state with React Query for server state:

```typescript
// stores/argumentSynthesisStore.ts
interface ArgumentSynthesisStore {
  // Current synthesis state
  currentSynthesis: ArgumentSynthesis | null;
  
  // UI state
  expandedKeyPoints: Set<string>;
  selectedPassages: Set<string>;
  counterEvidenceOpen: boolean;
  refinePanelOpen: boolean;
  
  // Loading states
  isGenerating: boolean;
  isRefining: boolean;
  isExporting: boolean;
  
  // Actions
  setSynthesis: (synthesis: ArgumentSynthesis) => void;
  toggleKeyPoint: (pointId: string) => void;
  selectPassage: (passageId: string) => void;
  toggleCounterEvidence: () => void;
  setRefinePanelOpen: (open: boolean) => void;
  
  // Async actions
  generateSynthesis: (query: string) => Promise<void>;
  refineSynthesis: (refinementQuery: string) => Promise<void>;
  exportCitations: (format: string) => Promise<void>;
}

// hooks/useArgumentSynthesis.ts
export const useArgumentSynthesis = () => {
  const store = useArgumentSynthesisStore();
  
  const generateMutation = useMutation({
    mutationFn: synthesisApi.generate,
    onSuccess: (data) => store.setSynthesis(data),
    onError: (error) => toast.error(error.message),
  });
  
  const refineMutation = useMutation({
    mutationFn: synthesisApi.refine,
    onSuccess: (data) => store.setSynthesis(data),
  });
  
  return {
    ...store,
    generate: generateMutation.mutate,
    refine: refineMutation.mutate,
    isLoading: generateMutation.isPending || refineMutation.isPending,
    error: generateMutation.error || refineMutation.error,
  };
};
```

## 4. Data Flow Between Components

```typescript
// ArgumentSynthesisLayer.tsx - Root component
const ArgumentSynthesisLayer: React.FC<{ query: string }> = ({ query }) => {
  const {
    currentSynthesis,
    generate,
    refine,
    isLoading,
    error,
    expandedKeyPoints,
    selectedPassages,
  } = useArgumentSynthesis();

  useEffect(() => {
    if (query) {
      generate(query);
    }
  }, [query]);

  return (
    <div className="argument-synthesis-layer">
      {isLoading && <ArgumentSynthesisLoader />}
      {error && <ErrorDisplay error={error} onRetry={() => generate(query)} />}
      {currentSynthesis && (
        <ArgumentCard
          synthesis={currentSynthesis}
          onRefine={refine}
          onExport={exportCitations}
        />
      )}
    </div>
  );
};

// Data flow pattern:
// 1. User query → generateSynthesis API call
// 2. API response → Store update → Component re-render
// 3. User interactions (expand/collapse) → Local store updates
// 4. Refinement queries → API call → Store merge → UI update
// 5. Export actions → API call → Download trigger
```

## 5. Animation Specifications

```typescript
// animations/argumentAnimations.ts
export const argumentAnimations = {
  // Card entrance
  cardEntrance: {
    initial: { opacity: 0, y: 30, scale: 0.95 },
    animate: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.1, 0.25, 1], // Custom cubic-bezier
        staggerChildren: 0.1
      }
    }
  },

  // Key point expansion
  keyPointExpansion: {
    collapsed: { 
      height: 0, 
      opacity: 0,
      transition: { duration: 0.3, ease: "easeInOut" }
    },
    expanded: { 
      height: "auto", 
      opacity: 1,
      transition: { duration: 0.4, ease: "easeOut" }
    }
  },

  // Evidence chain flow
  evidenceChainFlow: {
    container: {
      animate: { transition: { staggerChildren: 0.15 } }
    },
    node: {
      initial: { scale: 0, opacity: 0 },
      animate: { 
        scale: 1, 
        opacity: 1,
        transition: { 
          type: "spring", 
          stiffness: 300, 
          damping: 25 
        }
      },
      hover: { 
        scale: 1.05, 
        transition: { duration: 0.2 }
      }
    }
  },

  // Confidence gauge
  confidenceGauge: {
    arc: {
      initial: { pathLength: 0 },
      animate: (confidence: number) => ({
        pathLength: confidence / 100,
        transition: { 
          duration: 1.2, 
          ease: "easeOut",
          delay: 0.3
        }
      })
    },
    pulse: {
      animate: {
        scale: [1, 1.02, 1],
        transition: {
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }
      }
    }
  },

  // Counter-evidence drawer
  counterDrawer: {
    closed: { 
      x: "100%",
      transition: { duration: 0.3, ease: "easeInOut" }
    },
    open: { 
      x: "0%",
      transition: { duration: 0.4, ease: "easeOut" }
    }
  },

  // Loading states
  skeleton: {
    animate: {
      opacity: [0.6, 1, 0.6],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  }
};

// Usage in components:
const ArgumentCard: React.FC<ArgumentCardProps> = ({ synthesis, isLoading }) => {
  return (
    <motion.div
      variants={argumentAnimations.cardEntrance}
      initial="initial"
      animate="animate"
      className="argument-card"
    >
      {/* Content */}
    </motion.div>
  );
};
```

## 6. Accessibility Requirements

```typescript
// accessibility/argumentA11y.ts
export const argumentA11yProps = {
  // ARIA labels and descriptions
  argumentCard: {
    role: "article",
    "aria-labelledby": "thesis-statement",
    "aria-describedby": "argument-abstract"
  },

  confidenceGauge: (confidence: number) => ({
    role: "img",
    "aria-label": `Confidence level: ${confidence}% based on evidence analysis`,
    "aria-describedby": "confidence-explanation"
  }),

  evidenceChain: {
    role: "tree",
    "aria-label": "Evidence supporting this key point",
    "aria-expanded": "false" // Dynamic based on state
  },

  evidenceNode: (passage: Passage) => ({
    role: "treeitem",
    "aria-describedby": `passage-${passage.id}`,
    tabIndex: 0
  }),

  counterEvidenceDrawer: (isOpen: boolean) => ({
    role: "complementary",
    "aria-label": "Counter-evidence and contradictory information",
    "aria-expanded": isOpen.toString(),
    "aria-hidden": (!isOpen).toString()
  }),

  refinePanel: {
    role: "search",
    "aria-label": "Refine and expand argument analysis"
  }
};

// Keyboard navigation
export const keyboardHandlers = {
  evidenceChain: {
    onKeyDown: (e: KeyboardEvent, nodeId: string) => {
      switch (e.key) {
        case 'Enter':
        case ' ':
          e.preventDefault();
          selectEvidenceNode(nodeId);
          break;
        case 'ArrowRight':
          e.preventDefault();
          expandEvidenceNode(nodeId);
          break;
        case 'ArrowLeft':
          e.preventDefault();
          collapseEvidenceNode(nodeId);
          break;
        case 'ArrowDown':
          e.preventDefault();
          focusNextNode(nodeId);
          break;
        case 'ArrowUp':
          e.preventDefault();
          focusPreviousNode(nodeId);
          break;
      }
    }
  }
};

// Screen reader announcements
export const useScreenReaderAnnouncements = () => {
  const announce = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', priority);
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    document.body.appendChild(announcement);
    setTimeout(() => document.body.removeChild(announcement), 1000);
  };

  return { announce };
};
```

## 7. Responsive Breakpoints

```scss
// styles/breakpoints.scss
$breakpoints: (
  xs: 0,
  sm: 640px,
  md: 768px,
  lg: 1024px,
  xl: 1280px,
  xxl: 1536px
);

// Component-specific responsive behavior
.argument-card {
  // Mobile-first approach
  padding: 1rem;
  
  @media (min-width: map-get($breakpoints, sm)) {
    padding: 1.5rem;
  }
  
  @media (min-width: map-get($breakpoints, lg)) {
    padding: 2rem;
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 2rem;
  }
}

.key-points-list {
  @media (max-width: map-get($breakpoints, md)) {
    .evidence-chain {
      // Simplified mobile view
      display: none;
      
      &.expanded {
        display: block;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: white;
        z-index: 1000;
        padding: 1rem;
        overflow-y: auto;
      }
    }
  }
}

.confidence-gauge {
  // Responsive sizing
  width: 120px;
  height: 120px;
  
  @media (max-width: map-get($breakpoints, sm)) {
    width: 80px;
    height: 80px;
  }
  
  @media (min-width: map-get($breakpoints, xl)) {
    width: 160px;
    height: 160px;
  }
}

.counter-evidence-drawer {
  @media (max-width: map-get($breakpoints, lg)) {
    // Full-screen modal on mobile