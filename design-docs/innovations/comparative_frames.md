# comparative_frames

# Comparative Frames Component System

## 1. Component Hierarchy and Relationships

```typescript
ComparativeFrames/
├── ComparativeFramesContainer (root)
├── LanguageColumn (repeatable)
│   ├── RootMeaningCard
│   ├── SemanticFieldCloud
│   ├── CollocationList
│   └── PassageCounter
├── DifferenceHighlight (overlay)
├── ParallelPassages (bottom section)
├── ComparisonControls (top toolbar)
└── ConceptSelector (language addition)
```

## 2. TypeScript Interfaces

```typescript
interface Language {
  code: string; // 'grc', 'lat', 'heb'
  name: string;
  direction: 'ltr' | 'rtl';
  font: string;
}

interface ConceptData {
  id: string;
  term: string;
  language: Language;
  rootMeaning: RootMeaning;
  semanticField: SemanticWord[];
  collocations: Collocation[];
  passages: Passage[];
  keyCharacteristics: string[];
}

interface RootMeaning {
  etymology: string;
  primarySense: string;
  development: string[];
  cognates?: string[];
}

interface SemanticWord {
  term: string;
  transliteration?: string;
  relationship: 'synonym' | 'antonym' | 'hypernym' | 'hyponym' | 'related';
  frequency: number;
  cooccurrenceScore: number;
}

interface Collocation {
  phrase: string;
  transliteration?: string;
  frequency: number;
  contexts: string[];
  significance: 'high' | 'medium' | 'low';
}

interface Passage {
  id: string;
  source: string;
  text: string;
  translation: string;
  context: string;
  conceptUsage: ConceptUsage;
}

interface ConceptUsage {
  semanticRole: string;
  rhetoricalFunction: string;
  theologicalImplication?: string;
}

interface Difference {
  type: 'semantic' | 'pragmatic' | 'cultural' | 'temporal';
  description: string;
  languages: string[];
  examples: string[];
  significance: number; // 0-1
}

interface ParallelPassage {
  id: string;
  theme: string;
  passages: {
    [languageCode: string]: Passage;
  };
  commentary: string;
}

// Component Props
interface ComparativeFramesProps {
  concepts: ConceptData[];
  differences: Difference[];
  parallels: ParallelPassage[];
  onConceptAdd: (language: string) => void;
  onConceptRemove: (conceptId: string) => void;
  className?: string;
}

interface LanguageColumnProps {
  concept: ConceptData;
  isHighlighted: boolean;
  highlightedDifferences: string[];
  onTermClick: (term: string) => void;
  onPassageOpen: (passageId: string) => void;
}

interface RootMeaningCardProps {
  rootMeaning: RootMeaning;
  language: Language;
  isExpanded: boolean;
  onToggle: () => void;
}

interface SemanticFieldCloudProps {
  words: SemanticWord[];
  language: Language;
  selectedWord: string | null;
  onWordSelect: (word: string) => void;
  maxWords?: number;
}

interface CollocationListProps {
  collocations: Collocation[];
  language: Language;
  showAll: boolean;
  onToggleExpand: () => void;
  onCollocationClick: (phrase: string) => void;
}

interface DifferenceHighlightProps {
  differences: Difference[];
  concepts: ConceptData[];
  activeIndex: number;
  onNavigate: (direction: 'prev' | 'next') => void;
  onClose: () => void;
}

interface ParallelPassagesProps {
  parallels: ParallelPassage[];
  selectedParallel: string | null;
  onParallelSelect: (id: string) => void;
  languages: Language[];
}
```

## 3. State Management Approach

```typescript
// Context for comparative analysis
interface ComparativeFramesState {
  concepts: ConceptData[];
  selectedDifference: number | null;
  expandedSections: {
    [conceptId: string]: {
      rootMeaning: boolean;
      semanticField: boolean;
      collocations: boolean;
    };
  };
  selectedParallel: string | null;
  highlightMode: 'differences' | 'similarities' | null;
  filters: {
    significanceThreshold: number;
    showOnlyHighFrequency: boolean;
    contextFilter: string[];
  };
  loading: {
    concepts: boolean;
    differences: boolean;
    parallels: boolean;
  };
  errors: {
    [key: string]: string;
  };
}

// Actions
type ComparativeFramesAction =
  | { type: 'ADD_CONCEPT'; payload: ConceptData }
  | { type: 'REMOVE_CONCEPT'; payload: string }
  | { type: 'TOGGLE_SECTION'; payload: { conceptId: string; section: string } }
  | { type: 'SELECT_DIFFERENCE'; payload: number }
  | { type: 'SET_HIGHLIGHT_MODE'; payload: 'differences' | 'similarities' | null }
  | { type: 'UPDATE_FILTERS'; payload: Partial<ComparativeFramesState['filters']> }
  | { type: 'SET_LOADING'; payload: { key: string; loading: boolean } }
  | { type: 'SET_ERROR'; payload: { key: string; error: string } };

// Custom hooks
const useComparativeFrames = (initialConcepts: string[]) => {
  const [state, dispatch] = useReducer(comparativeFramesReducer, initialState);
  
  const addConcept = useCallback(async (term: string, language: string) => {
    dispatch({ type: 'SET_LOADING', payload: { key: 'concepts', loading: true } });
    try {
      const conceptData = await conceptService.fetchConcept(term, language);
      dispatch({ type: 'ADD_CONCEPT', payload: conceptData });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: { key: 'concepts', error: error.message } });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: { key: 'concepts', loading: false } });
    }
  }, []);

  return { state, addConcept, dispatch };
};
```

## 4. Data Flow Between Components

```typescript
// Top-level data flow
const ComparativeFramesContainer: React.FC<ComparativeFramesProps> = (props) => {
  const { state, addConcept, dispatch } = useComparativeFrames(props.concepts);
  
  // Computed values
  const activeDifferences = useMemo(() => 
    state.selectedDifference !== null 
      ? [props.differences[state.selectedDifference]]
      : props.differences.filter(d => d.significance > state.filters.significanceThreshold)
  , [state.selectedDifference, props.differences, state.filters]);

  const highlightedConcepts = useMemo(() => 
    state.highlightMode === 'differences'
      ? getConceptsWithDifferences(state.concepts, activeDifferences)
      : state.concepts
  , [state.concepts, state.highlightMode, activeDifferences]);

  // Event handlers bubble up
  const handleTermClick = useCallback((conceptId: string, term: string) => {
    // Highlight related terms across languages
    const relatedTerms = findRelatedTerms(term, state.concepts);
    dispatch({ type: 'HIGHLIGHT_TERMS', payload: relatedTerms });
  }, [state.concepts]);

  return (
    <div className="comparative-frames">
      <ComparisonControls
        onFilterChange={(filters) => dispatch({ type: 'UPDATE_FILTERS', payload: filters })}
        onHighlightModeChange={(mode) => dispatch({ type: 'SET_HIGHLIGHT_MODE', payload: mode })}
      />
      
      <div className="language-columns">
        {highlightedConcepts.map(concept => (
          <LanguageColumn
            key={concept.id}
            concept={concept}
            isHighlighted={activeDifferences.some(d => d.languages.includes(concept.language.code))}
            onTermClick={(term) => handleTermClick(concept.id, term)}
          />
        ))}
      </div>

      {state.selectedDifference !== null && (
        <DifferenceHighlight
          differences={props.differences}
          activeIndex={state.selectedDifference}
          concepts={state.concepts}
          onNavigate={(direction) => {
            const newIndex = direction === 'next' 
              ? (state.selectedDifference + 1) % props.differences.length
              : (state.selectedDifference - 1 + props.differences.length) % props.differences.length;
            dispatch({ type: 'SELECT_DIFFERENCE', payload: newIndex });
          }}
        />
      )}

      <ParallelPassages
        parallels={props.parallels}
        selectedParallel={state.selectedParallel}
        onParallelSelect={(id) => dispatch({ type: 'SELECT_PARALLEL', payload: id })}
      />
    </div>
  );
};
```

## 5. Animation Specifications

```typescript
// Animation configuration
const animations = {
  columnEntry: {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
    transition: { duration: 0.4, ease: 'easeOut' }
  },
  
  semanticCloud: {
    container: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      transition: { staggerChildren: 0.1 }
    },
    word: {
      initial: { scale: 0, opacity: 0 },
      animate: { scale: 1, opacity: 1 },
      hover: { scale: 1.1, y: -2 },
      transition: { type: 'spring', stiffness: 300 }
    }
  },
  
  differenceHighlight: {
    overlay: {
      initial: { opacity: 0, backdropFilter: 'blur(0px)' },
      animate: { opacity: 1, backdropFilter: 'blur(4px)' },
      exit: { opacity: 0, backdropFilter: 'blur(0px)' }
    },
    popup: {
      initial: { scale: 0.8, opacity: 0, y: 20 },
      animate: { scale: 1, opacity: 1, y: 0 },
      exit: { scale: 0.8, opacity: 0, y: 20 },
      transition: { type: 'spring', stiffness: 400, damping: 25 }
    }
  },
  
  cardExpansion: {
    content: {
      initial: { height: 0, opacity: 0 },
      animate: { height: 'auto', opacity: 1 },
      exit: { height: 0, opacity: 0 },
      transition: { duration: 0.3, ease: 'easeInOut' }
    }
  },
  
  passageReveal: {
    text: {
      initial: { opacity: 0, y: 10 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.4, ease: 'easeOut' }
    }
  }
};

// Usage in components
const LanguageColumn: React.FC<LanguageColumnProps> = (props) => (
  <motion.div
    className="language-column"
    {...animations.columnEntry}
    layout
  >
    {/* Component content */}
  </motion.div>
);

const SemanticFieldCloud: React.FC<SemanticFieldCloudProps> = (props) => (
  <motion.div
    className="semantic-cloud"
    variants={animations.semanticCloud.container}
    initial="initial"
    animate="animate"
  >
    {props.words.map(word => (
      <motion.span
        key={word.term}
        variants={animations.semanticCloud.word}
        whileHover="hover"
        className="semantic-word"
        style={{
          fontSize: `${0.8 + (word.frequency * 0.6)}rem`,
          fontWeight: word.cooccurrenceScore > 0.7 ? 600 : 400
        }}
      >
        {word.term}
      </motion.span>
    ))}
  </motion.div>
);
```

## 6. Accessibility Requirements

```typescript
// Accessibility utilities
const useAccessibilityAnnouncements = () => {
  const announce = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    const announcer = document.getElementById('accessibility-announcer');
    if (announcer) {
      announcer.setAttribute('aria-live', priority);
      announcer.textContent = message;
    }
  }, []);
  
  return { announce };
};

// Keyboard navigation hook
const useKeyboardNavigation = (items: any[], selectedIndex: number, onSelect: (index: number) => void) => {
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    switch (event.key) {
      case 'ArrowUp':
        event.preventDefault();
        onSelect(Math.max(0, selectedIndex - 1));
        break;
      case 'ArrowDown':
        event.preventDefault();
        onSelect(Math.min(items.length - 1, selectedIndex + 1));
        break;
      case 'Home':
        event.preventDefault();
        onSelect(0);
        break;
      case 'End':
        event.preventDefault();
        onSelect(items.length - 1);
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        // Trigger selection action
        break;
    }
  }, [selectedIndex, onSelect, items.length]);
  
  return { handleKeyDown };
};

// Component accessibility implementation
const SemanticFieldCloud: React.FC<SemanticFieldCloudProps> = (props) => {
  const { announce } = useAccessibilityAnnouncements();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { handleKeyDown } = useKeyboardNavigation(props.words, selectedIndex, setSelectedIndex);
  
  return (
    <div
      className="semantic-cloud"
      role="group"
      aria-label={`Semantic field for ${props.language.name} concept`}
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      {props.words.map((word, index) => (
        <button
          key={word.term}
          className={`semantic-word ${index === selectedIndex ? 'focused' : ''}`}
          onClick={() => {
            props.onWordSelect(word.term);
            announce(`Selected ${word.term}, related to main concept with ${word.relationship} relationship`);
          }}
          aria-label={`${word.term}, ${word.relationship} of main concept, frequency ${word.frequency}`}
          tabIndex={-1}
        >
          {word.term}
          {word.transliteration && (
            <span className="transliteration" aria-hidden