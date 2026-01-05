# multi_scale_view

# Multi-Scale Research Views Component System

## 1. Component Hierarchy & Relationships

```
ResearchViewport (root)
├── ZoomControl
├── BreadcrumbNav
├── ViewContainer
│   ├── ThesisView
│   ├── AbstractView  
│   ├── SectionView
│   │   └── SectionCard[]
│   │       └── EvidencePreview[]
│   └── EvidenceView
│       └── PassageCard[]
│           ├── OriginalText
│           ├── Translation
│           └── MorphologyPanel
└── ViewportOverlay
    ├── LoadingSpinner
    ├── ErrorBoundary
    └── EmptyState
```

## 2. TypeScript Interfaces

```typescript
// Core Data Types
interface ResearchData {
  id: string;
  title: string;
  author: string;
  lastModified: Date;
  thesis: ThesisData;
  abstract: AbstractData;
  sections: SectionData[];
}

interface ThesisData {
  statement: string;
  confidence: number; // 0-1
  keyTerms: string[];
}

interface AbstractData {
  text: string;
  highlightedTerms: HighlightedTerm[];
  wordCount: number;
  readingTime: number;
}

interface HighlightedTerm {
  term: string;
  definition: string;
  greekTerm?: string;
  positions: TextRange[];
}

interface SectionData {
  id: string;
  title: string;
  description: string;
  evidenceCount: number;
  passages: PassageData[];
  subsections?: SectionData[];
  isExpanded: boolean;
}

interface PassageData {
  id: string;
  reference: string; // "NE 1103a17"
  originalText: string;
  translation: string;
  context: string;
  morphology: MorphologyData[];
  relevanceScore: number;
  tags: string[];
}

interface MorphologyData {
  word: string;
  lemma: string;
  partOfSpeech: string;
  case?: string;
  gender?: string;
  number?: string;
  position: number;
}

// Component Props
interface ResearchViewportProps {
  data: ResearchData;
  initialZoomLevel?: ZoomLevel;
  onNavigate?: (level: ZoomLevel, context?: NavigationContext) => void;
  className?: string;
}

interface ZoomControlProps {
  currentLevel: ZoomLevel;
  availableLevels: ZoomLevel[];
  onZoomChange: (level: ZoomLevel) => void;
  disabled?: boolean;
  showLabels?: boolean;
}

interface BreadcrumbNavProps {
  path: BreadcrumbItem[];
  onNavigate: (item: BreadcrumbItem) => void;
  maxItems?: number;
}

interface ThesisViewProps {
  thesis: ThesisData;
  isActive: boolean;
  onTermClick?: (term: string) => void;
}

interface AbstractViewProps {
  abstract: AbstractData;
  isActive: boolean;
  onTermHover?: (term: HighlightedTerm) => void;
  onZoomIn?: () => void;
}

interface SectionViewProps {
  sections: SectionData[];
  isActive: boolean;
  onSectionExpand: (sectionId: string) => void;
  onSectionClick: (sectionId: string) => void;
  sortBy?: 'relevance' | 'alphabetical' | 'evidence-count';
}

interface EvidenceViewProps {
  passages: PassageData[];
  sectionContext: SectionData;
  isActive: boolean;
  onPassageSelect?: (passageId: string) => void;
  showMorphology?: boolean;
}

// State Management
interface ViewportState {
  currentZoomLevel: ZoomLevel;
  activeSection?: string;
  selectedPassage?: string;
  breadcrumbPath: BreadcrumbItem[];
  viewTransition: TransitionState;
  loading: LoadingState;
  error?: ErrorState;
}

type ZoomLevel = 'thesis' | 'abstract' | 'sections' | 'evidence';

interface NavigationContext {
  sectionId?: string;
  passageId?: string;
  previousLevel?: ZoomLevel;
}

interface BreadcrumbItem {
  label: string;
  level: ZoomLevel;
  context?: NavigationContext;
}

interface TransitionState {
  isTransitioning: boolean;
  fromLevel: ZoomLevel;
  toLevel: ZoomLevel;
  duration: number;
}

interface LoadingState {
  isLoading: boolean;
  loadingText?: string;
  progress?: number;
}

interface ErrorState {
  type: 'network' | 'parsing' | 'not-found' | 'permission';
  message: string;
  retryable: boolean;
}
```

## 3. State Management Approach

```typescript
// Using Zustand for lightweight state management
import { create } from 'zustand';

interface ViewportStore {
  // State
  currentZoomLevel: ZoomLevel;
  activeSection: string | null;
  selectedPassage: string | null;
  breadcrumbPath: BreadcrumbItem[];
  viewTransition: TransitionState;
  
  // Actions
  setZoomLevel: (level: ZoomLevel) => void;
  navigateToSection: (sectionId: string) => void;
  navigateToPassage: (passageId: string, sectionId: string) => void;
  goBack: () => void;
  updateBreadcrumbs: (item: BreadcrumbItem) => void;
  
  // Computed
  canZoomIn: () => boolean;
  canZoomOut: () => boolean;
  getCurrentContext: () => NavigationContext;
}

const useViewportStore = create<ViewportStore>((set, get) => ({
  currentZoomLevel: 'thesis',
  activeSection: null,
  selectedPassage: null,
  breadcrumbPath: [],
  viewTransition: { isTransitioning: false, fromLevel: 'thesis', toLevel: 'thesis', duration: 0 },
  
  setZoomLevel: (level) => {
    const current = get().currentZoomLevel;
    set(state => ({
      currentZoomLevel: level,
      viewTransition: {
        isTransitioning: true,
        fromLevel: current,
        toLevel: level,
        duration: 300
      }
    }));
    
    // Clear transition after duration
    setTimeout(() => {
      set(state => ({
        viewTransition: { ...state.viewTransition, isTransitioning: false }
      }));
    }, 300);
  },
  
  navigateToSection: (sectionId) => {
    set(state => ({
      activeSection: sectionId,
      currentZoomLevel: 'sections',
      breadcrumbPath: [
        ...state.breadcrumbPath,
        { label: `Section: ${sectionId}`, level: 'sections', context: { sectionId } }
      ]
    }));
  },
  
  // ... other actions
}));

// React Query for data fetching
const useResearchData = (researchId: string) => {
  return useQuery({
    queryKey: ['research', researchId],
    queryFn: async () => {
      const response = await fetch(`/api/research/${researchId}`);
      if (!response.ok) throw new Error('Failed to fetch research data');
      return response.json() as ResearchData;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });
};
```

## 4. Data Flow Between Components

```typescript
// Main Viewport Component
export const ResearchViewport: React.FC<ResearchViewportProps> = ({
  data,
  initialZoomLevel = 'thesis',
  onNavigate,
  className
}) => {
  const {
    currentZoomLevel,
    activeSection,
    selectedPassage,
    breadcrumbPath,
    viewTransition,
    setZoomLevel,
    navigateToSection,
    navigateToPassage,
    goBack
  } = useViewportStore();

  // Initialize zoom level
  useEffect(() => {
    if (initialZoomLevel !== currentZoomLevel) {
      setZoomLevel(initialZoomLevel);
    }
  }, [initialZoomLevel]);

  // Handle external navigation events
  useEffect(() => {
    if (onNavigate) {
      onNavigate(currentZoomLevel, { 
        sectionId: activeSection || undefined,
        passageId: selectedPassage || undefined 
      });
    }
  }, [currentZoomLevel, activeSection, selectedPassage, onNavigate]);

  return (
    <div className={`research-viewport ${className}`}>
      <ZoomControl
        currentLevel={currentZoomLevel}
        availableLevels={['thesis', 'abstract', 'sections', 'evidence']}
        onZoomChange={setZoomLevel}
        disabled={viewTransition.isTransitioning}
      />
      
      <BreadcrumbNav
        path={breadcrumbPath}
        onNavigate={(item) => {
          setZoomLevel(item.level);
          if (item.context?.sectionId) {
            navigateToSection(item.context.sectionId);
          }
        }}
      />
      
      <ViewContainer
        data={data}
        currentLevel={currentZoomLevel}
        transition={viewTransition}
        onSectionClick={navigateToSection}
        onPassageClick={navigateToPassage}
      />
    </div>
  );
};

// View Container handles transitions between different zoom levels
const ViewContainer: React.FC<ViewContainerProps> = ({
  data,
  currentLevel,
  transition,
  onSectionClick,
  onPassageClick
}) => {
  const getActiveView = () => {
    switch (currentLevel) {
      case 'thesis':
        return <ThesisView thesis={data.thesis} isActive={!transition.isTransitioning} />;
      case 'abstract':
        return <AbstractView abstract={data.abstract} isActive={!transition.isTransitioning} />;
      case 'sections':
        return (
          <SectionView 
            sections={data.sections} 
            isActive={!transition.isTransitioning}
            onSectionClick={onSectionClick}
          />
        );
      case 'evidence':
        return (
          <EvidenceView 
            passages={getActivePassages(data)}
            isActive={!transition.isTransitioning}
            onPassageClick={onPassageClick}
          />
        );
      default:
        return null;
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentLevel}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 1.05 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="view-container"
      >
        {getActiveView()}
      </motion.div>
    </AnimatePresence>
  );
};
```

## 5. Animation Specifications

```typescript
// Animation constants
const ANIMATION_CONFIG = {
  zoomTransition: {
    duration: 300,
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)', // Material Design standard easing
  },
  scaleFactors: {
    zoomIn: 0.95, // Start slightly smaller
    zoomOut: 1.05, // Start slightly larger
  },
  stagger: {
    sections: 50, // ms between section animations
    passages: 30, // ms between passage animations
  }
} as const;

// Framer Motion variants
const viewTransitionVariants = {
  initial: (direction: 'in' | 'out') => ({
    opacity: 0,
    scale: direction === 'in' ? 0.95 : 1.05,
    y: direction === 'in' ? 20 : -20,
  }),
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
  },
  exit: (direction: 'in' | 'out') => ({
    opacity: 0,
    scale: direction === 'in' ? 1.05 : 0.95,
    y: direction === 'in' ? -20 : 20,
  }),
};

const sectionCardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: index * 0.05,
      duration: 0.3,
    },
  }),
};

const passageRevealVariants = {
  hidden: { height: 0, opacity: 0 },
  visible: {
    height: 'auto',
    opacity: 1,
    transition: {
      height: { duration: 0.3 },
      opacity: { duration: 0.2, delay: 0.1 },
    },
  },
};

// CSS for smooth transitions
const smoothScrollConfig = {
  behavior: 'smooth' as ScrollBehavior,
  block: 'center' as ScrollLogicalPosition,
  inline: 'nearest' as ScrollLogicalPosition,
};

// Zoom control animation
const zoomControlVariants = {
  hover: { scale: 1.05 },
  tap: { scale: 0.95 },
  disabled: { opacity: 0.5, scale: 1 },
};
```

## 6. Accessibility Requirements

```typescript
// ARIA labels and roles
const AccessibilityConfig = {
  landmarks: {
    main: 'main',
    navigation: 'navigation',
    complementary: 'complementary',
  },
  
  labels: {
    zoomControl: 'Research detail level',
    breadcrumbs: 'Research navigation path',
    sectionList: 'Research sections',
    passageList: 'Evidence passages',
  },
  
  descriptions: {
    thesis: 'Main thesis statement',
    abstract: 'Research abstract with highlighted key terms',
    sections: 'Expandable research sections with evidence counts',
    evidence: 'Individual passages with original text and translations',
  },
  
  announcements: {
    zoomIn: 'Zoomed in to show more detail',
    zoomOut: 'Zoomed out to show overview',
    sectionExpanded: 'Section expanded to show evidence',
    passageSelected: 'Passage selected for detailed view',
  },
};

// Keyboard navigation
const KeyboardHandlers = {
  zoomControl: {
    'ArrowUp': () => zoomOut(),
    'ArrowDown': () => zoomIn(),
    'Home': () => setZoomLevel('thesis'),
    'End': () => setZoomLevel('evidence'),
  },
  
  sectionView: {
    'ArrowDown': () => navigateToNextSection(),
    'ArrowUp': () => navigateToPrevSection(),
    'Enter': () => expandCurrentSection(),
    'Space': () => expandCurrentSection(),
    'Escape': () => goBack(),
  },
  
  evidenceView: {
    'ArrowDown': () => navigateToNextPassage(),
    'ArrowUp': () => navigateToPrevPassage(),
    'Enter': () => selectCurrentPassage(),
    'Tab': () => focusNextMorphologyElement(),