# narrative_timeline

# Narrative Timeline Component System

## 1. Component Hierarchy and Relationships

```
NarrativeTimeline (Container)
├── TimelineControls
│   ├── WordSelector
│   ├── DateRangeSlider
│   └── ViewModeToggle
├── TimelineVisualization
│   ├── TimelineTrack
│   │   ├── DateMarkers
│   │   └── GridLines
│   ├── MeaningLayer
│   │   ├── MeaningNode[]
│   │   ├── TransitionArrow[]
│   │   └── BranchPoint[]
│   └── AuthorLayer
│       └── AuthorMarker[]
├── InteractionLayer
│   ├── KeyPassagePopup
│   ├── MeaningTooltip
│   └── AuthorTooltip
└── TimelinePanel
    ├── SelectedMeaningDetails
    ├── PassageViewer
    └── RelatedWordsPanel
```

## 2. TypeScript Interfaces

```typescript
// Core Data Types
interface WordMeaning {
  id: string;
  word: string;
  meaning: string;
  definition: string;
  date: number; // BCE/CE as negative/positive
  confidence: 'high' | 'medium' | 'low';
  coordinates: { x: number; y: number };
  parentMeaningId?: string;
  tags: string[];
}

interface Author {
  id: string;
  name: string;
  displayName: string;
  lifespan: { birth?: number; death?: number };
  culture: string;
  works: Work[];
}

interface Work {
  id: string;
  title: string;
  date: number;
  authorId: string;
  passages: Passage[];
}

interface Passage {
  id: string;
  text: string;
  translation?: string;
  workId: string;
  reference: string;
  meaningIds: string[];
  significance: 'pivotal' | 'supporting' | 'contextual';
}

interface Transition {
  id: string;
  fromMeaningId: string;
  toMeaningId: string;
  type: 'evolution' | 'branch' | 'merge' | 'borrowing';
  description: string;
  keyPassages: string[];
  confidence: 'high' | 'medium' | 'low';
}

interface BranchPoint {
  id: string;
  date: number;
  parentMeaningId: string;
  childMeaningIds: string[];
  description: string;
  cause: 'cultural' | 'philosophical' | 'religious' | 'linguistic';
}

// Component Props
interface NarrativeTimelineProps {
  word: string;
  dateRange: { start: number; end: number };
  onWordChange: (word: string) => void;
  className?: string;
}

interface TimelineTrackProps {
  dateRange: { start: number; end: number };
  width: number;
  height: number;
  onDateHover: (date: number | null) => void;
}

interface MeaningNodeProps {
  meaning: WordMeaning;
  position: { x: number; y: number };
  isSelected: boolean;
  isHighlighted: boolean;
  scale: number;
  onClick: (meaningId: string) => void;
  onHover: (meaningId: string | null) => void;
}

interface TransitionArrowProps {
  transition: Transition;
  fromPosition: { x: number; y: number };
  toPosition: { x: number; y: number };
  isVisible: boolean;
  animationDelay: number;
  onClick: (transitionId: string) => void;
}

interface AuthorMarkerProps {
  author: Author;
  meanings: WordMeaning[];
  position: { x: number; y: number };
  size: 'small' | 'medium' | 'large';
  onClick: (authorId: string) => void;
}

interface KeyPassagePopupProps {
  passage: Passage;
  position: { x: number; y: number };
  isVisible: boolean;
  onClose: () => void;
  onNavigateToWork: (workId: string) => void;
}

// State Interfaces
interface TimelineState {
  selectedMeaningId: string | null;
  hoveredMeaningId: string | null;
  selectedAuthorId: string | null;
  visibleTransitions: string[];
  popupState: {
    type: 'passage' | 'meaning' | 'author' | null;
    id: string | null;
    position: { x: number; y: number };
  };
  viewMode: 'meanings' | 'authors' | 'both';
  zoomLevel: number;
  panOffset: { x: number; y: number };
}

interface TimelineData {
  meanings: WordMeaning[];
  authors: Author[];
  works: Work[];
  passages: Passage[];
  transitions: Transition[];
  branchPoints: BranchPoint[];
}
```

## 3. State Management Approach

```typescript
// Using Zustand for state management
interface TimelineStore {
  // Data
  data: TimelineData;
  currentWord: string;
  dateRange: { start: number; end: number };
  
  // UI State
  ui: TimelineState;
  loading: boolean;
  error: string | null;
  
  // Actions
  loadWordData: (word: string) => Promise<void>;
  setSelectedMeaning: (meaningId: string | null) => void;
  setHoveredMeaning: (meaningId: string | null) => void;
  showPopup: (type: string, id: string, position: { x: number; y: number }) => void;
  hidePopup: () => void;
  setViewMode: (mode: 'meanings' | 'authors' | 'both') => void;
  setZoom: (level: number) => void;
  setPan: (offset: { x: number; y: number }) => void;
  setDateRange: (range: { start: number; end: number }) => void;
}

const useTimelineStore = create<TimelineStore>((set, get) => ({
  data: {
    meanings: [],
    authors: [],
    works: [],
    passages: [],
    transitions: [],
    branchPoints: []
  },
  currentWord: '',
  dateRange: { start: -800, end: 600 },
  ui: {
    selectedMeaningId: null,
    hoveredMeaningId: null,
    selectedAuthorId: null,
    visibleTransitions: [],
    popupState: { type: null, id: null, position: { x: 0, y: 0 } },
    viewMode: 'both',
    zoomLevel: 1,
    panOffset: { x: 0, y: 0 }
  },
  loading: false,
  error: null,

  loadWordData: async (word: string) => {
    set({ loading: true, error: null });
    try {
      const data = await fetchWordData(word);
      set({ data, currentWord: word, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  setSelectedMeaning: (meaningId) => 
    set(state => ({ 
      ui: { ...state.ui, selectedMeaningId: meaningId }
    })),

  // ... other actions
}));
```

## 4. Data Flow Between Components

```typescript
// Main Timeline Component
const NarrativeTimeline: React.FC<NarrativeTimelineProps> = ({ 
  word, 
  dateRange, 
  onWordChange 
}) => {
  const { 
    data, 
    ui, 
    loading, 
    error,
    loadWordData,
    setSelectedMeaning,
    setHoveredMeaning,
    showPopup,
    hidePopup 
  } = useTimelineStore();

  // Load data when word changes
  useEffect(() => {
    if (word) {
      loadWordData(word);
    }
  }, [word, loadWordData]);

  // Calculate positions for visual elements
  const positionCalculator = useMemo(() => 
    new TimelinePositionCalculator(dateRange, ui.zoomLevel, ui.panOffset),
    [dateRange, ui.zoomLevel, ui.panOffset]
  );

  // Filter visible elements based on date range and zoom
  const visibleMeanings = useMemo(() => 
    data.meanings.filter(m => 
      m.date >= dateRange.start && m.date <= dateRange.end
    ).map(meaning => ({
      ...meaning,
      position: positionCalculator.getMeaningPosition(meaning)
    })),
    [data.meanings, dateRange, positionCalculator]
  );

  // Event handlers
  const handleMeaningClick = useCallback((meaningId: string) => {
    setSelectedMeaning(meaningId);
    const meaning = data.meanings.find(m => m.id === meaningId);
    if (meaning?.keyPassages?.length > 0) {
      showPopup('passage', meaning.keyPassages[0], 
        positionCalculator.getMeaningPosition(meaning));
    }
  }, [data.meanings, setSelectedMeaning, showPopup, positionCalculator]);

  return (
    <div className="narrative-timeline">
      {/* Components receive computed props and callbacks */}
    </div>
  );
};

// Position Calculator Utility
class TimelinePositionCalculator {
  constructor(
    private dateRange: { start: number; end: number },
    private zoomLevel: number,
    private panOffset: { x: number; y: number },
    private dimensions: { width: number; height: number } = { width: 1200, height: 600 }
  ) {}

  getMeaningPosition(meaning: WordMeaning): { x: number; y: number } {
    const x = this.dateToX(meaning.date);
    const y = this.meaningToY(meaning);
    return { x, y };
  }

  private dateToX(date: number): number {
    const totalRange = this.dateRange.end - this.dateRange.start;
    const normalizedDate = (date - this.dateRange.start) / totalRange;
    return (normalizedDate * this.dimensions.width * this.zoomLevel) + this.panOffset.x;
  }

  private meaningToY(meaning: WordMeaning): number {
    // Position meanings vertically based on semantic relationships
    const baseY = this.dimensions.height / 2;
    const offset = meaning.coordinates?.y || 0;
    return baseY + (offset * 100);
  }
}
```

## 5. Animation Specifications

```typescript
// Animation configurations
const TIMELINE_ANIMATIONS = {
  meaningNode: {
    enter: {
      scale: 0,
      opacity: 0,
      transition: { type: 'spring', stiffness: 300, damping: 25 }
    },
    visible: {
      scale: 1,
      opacity: 1,
      transition: { 
        delay: (index: number) => index * 0.1,
        type: 'spring',
        stiffness: 300,
        damping: 25
      }
    },
    hover: {
      scale: 1.15,
      transition: { type: 'spring', stiffness: 400, damping: 20 }
    },
    selected: {
      scale: 1.3,
      boxShadow: '0 0 20px rgba(59, 130, 246, 0.5)',
      transition: { type: 'spring', stiffness: 400, damping: 20 }
    }
  },
  
  transitionArrow: {
    hidden: { 
      pathLength: 0, 
      opacity: 0 
    },
    visible: { 
      pathLength: 1, 
      opacity: 1,
      transition: { 
        pathLength: { duration: 1, ease: 'easeInOut' },
        opacity: { duration: 0.3 }
      }
    }
  },

  popup: {
    hidden: {
      opacity: 0,
      scale: 0.8,
      y: 10
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 400, damping: 25 }
    }
  }
};

// Meaning Node with animations
const MeaningNode: React.FC<MeaningNodeProps> = ({ 
  meaning, 
  position, 
  isSelected, 
  isHighlighted,
  onClick,
  onHover 
}) => {
  return (
    <motion.div
      className="meaning-node"
      style={{ left: position.x, top: position.y }}
      variants={TIMELINE_ANIMATIONS.meaningNode}
      initial="enter"
      animate={isSelected ? "selected" : "visible"}
      whileHover="hover"
      onClick={() => onClick(meaning.id)}
      onMouseEnter={() => onHover(meaning.id)}
      onMouseLeave={() => onHover(null)}
      layout
    >
      <div className="meaning-content">
        <div className="meaning-text">{meaning.meaning}</div>
        <div className="meaning-date">{formatDate(meaning.date)}</div>
      </div>
      
      <AnimatePresence>
        {isHighlighted && (
          <motion.div
            className="meaning-highlight"
            initial={{ scale: 1, opacity: 0.5 }}
            animate={{ scale: 1.5, opacity: 0 }}
            transition={{ duration: 1, repeat: Infinity }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Transition Arrow with path animation
const TransitionArrow: React.FC<TransitionArrowProps> = ({ 
  transition, 
  fromPosition, 
  toPosition, 
  isVisible,
  animationDelay 
}) => {
  const pathD = useMemo(() => 
    generateCurvedPath(fromPosition, toPosition),
    [fromPosition, toPosition]
  );

  return (
    <svg className="transition-arrow">
      <motion.path
        d={pathD}
        variants={TIMELINE_ANIMATIONS.transitionArrow}
        initial="hidden"
        animate={isVisible ? "visible" : "hidden"}
        style={{ 
          stroke: getTransitionColor(transition.type),
          strokeWidth: 2,
          fill: 'none'
        }}
        transition={{ delay: animationDelay }}
      />
      
      {/* Arrowhead */}
      <motion.polygon
        points={generateArrowhead(toPosition)}
        initial={{ opacity: 0 }}
        animate={{ opacity: isVisible ? 1 : 0 }}
        transition={{ delay: animationDelay + 0.5 }}
        fill={getTransitionColor(transition.type)}
      />
    </svg>
  );
};
```

## 6. Accessibility Requirements

```typescript
// Accessibility implementation
const MeaningNode: React.FC<MeaningNodeProps> = ({ meaning, ...props }) => {
  return (
    <motion.button
      className="meaning-node"
      role="button"
      tabIndex={0}
      aria-label={`Meaning: ${meaning.meaning} from ${formatDate(meaning.date)}`}
      aria-describedby={`meaning-details-${meaning.id}`}
      aria-pressed={props.isSelected}
      onKeyDown={(e) => {
        if (e.key === 'Enter