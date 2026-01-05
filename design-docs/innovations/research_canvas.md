# research_canvas

# Research Canvas Component System Design

## 1. Component Hierarchy and Relationships

```
ResearchCanvas
├── CanvasProvider (Context)
├── CanvasToolbar
│   ├── ZoomControls
│   ├── UndoRedoButtons
│   ├── ExportButton
│   └── ShareButton
├── CanvasWorkspace
│   ├── InfiniteCanvas
│   │   ├── SelectionBox
│   │   ├── ConnectionLine[] (rendered first, below elements)
│   │   ├── PassageCard[]
│   │   ├── AuthorNode[]
│   │   ├── ThemeCluster[]
│   │   └── NotesPanel[]
│   └── CanvasMinimapCanvasContainer
├── SidePanel
│   ├── SearchPanel
│   ├── ElementsLibrary
│   └── PropertiesPanel
└── CanvasModals
    ├── ExportModal
    ├── ShareModal
    └── ConnectionModal
```

## 2. TypeScript Interfaces and Props

### Core Data Types

```typescript
// Core canvas element types
type ElementType = 'passage' | 'author' | 'theme' | 'note';

interface Position {
  x: number;
  y: number;
}

interface Dimensions {
  width: number;
  height: number;
}

interface BaseCanvasElement {
  id: string;
  type: ElementType;
  position: Position;
  dimensions: Dimensions;
  zIndex: number;
  selected: boolean;
  locked: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface Citation {
  id: string;
  author: string;
  title: string;
  publication?: string;
  year?: number;
  pages?: string;
  doi?: string;
  url?: string;
  citationStyle: 'mla' | 'apa' | 'chicago' | 'custom';
}

interface PassageElement extends BaseCanvasElement {
  type: 'passage';
  content: string;
  citation: Citation;
  highlightedText?: string;
  tags: string[];
  language?: string;
  translation?: string;
}

interface AuthorElement extends BaseCanvasElement {
  type: 'author';
  name: string;
  bio?: string;
  lifespan?: string;
  wordFrequencies: Record<string, number>;
  relatedPassages: string[]; // passage IDs
  imageUrl?: string;
}

interface ThemeClusterElement extends BaseCanvasElement {
  type: 'theme';
  title: string;
  description?: string;
  color: string;
  childElements: string[]; // IDs of contained elements
  collapsed: boolean;
}

interface NoteElement extends BaseCanvasElement {
  type: 'note';
  content: string;
  color: string;
  fontSize: number;
  isMinimized: boolean;
}

type CanvasElement = PassageElement | AuthorElement | ThemeClusterElement | NoteElement;

interface Connection {
  id: string;
  fromElementId: string;
  toElementId: string;
  label?: string;
  type: 'relates-to' | 'contradicts' | 'supports' | 'builds-on' | 'custom';
  style: {
    color: string;
    strokeWidth: number;
    strokeDasharray?: string;
  };
  controlPoints: Position[]; // For curved connections
}

interface CanvasState {
  elements: Record<string, CanvasElement>;
  connections: Record<string, Connection>;
  viewport: {
    x: number;
    y: number;
    zoom: number;
  };
  selection: string[]; // selected element IDs
  clipboard: CanvasElement[];
  history: CanvasHistoryState[];
  historyIndex: number;
}

interface CanvasHistoryState {
  elements: Record<string, CanvasElement>;
  connections: Record<string, Connection>;
  timestamp: Date;
  action: string;
}
```

### Component Props

```typescript
// Main Canvas Component
interface ResearchCanvasProps {
  projectId: string;
  initialState?: Partial<CanvasState>;
  readOnly?: boolean;
  collaborationEnabled?: boolean;
  onSave?: (state: CanvasState) => void;
  onExport?: (format: ExportFormat, options: ExportOptions) => void;
}

// Canvas Workspace
interface CanvasWorkspaceProps {
  elements: Record<string, CanvasElement>;
  connections: Record<string, Connection>;
  viewport: CanvasState['viewport'];
  selection: string[];
  onElementMove: (elementId: string, position: Position) => void;
  onElementResize: (elementId: string, dimensions: Dimensions) => void;
  onElementSelect: (elementIds: string[], append?: boolean) => void;
  onConnectionCreate: (fromId: string, toId: string) => void;
  onViewportChange: (viewport: CanvasState['viewport']) => void;
}

// Passage Card
interface PassageCardProps {
  element: PassageElement;
  isSelected: boolean;
  isConnecting: boolean;
  scale: number; // from canvas zoom
  onMove: (position: Position) => void;
  onResize: (dimensions: Dimensions) => void;
  onSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onConnectionStart: (elementId: string) => void;
}

// Author Node
interface AuthorNodeProps {
  element: AuthorElement;
  isSelected: boolean;
  isConnecting: boolean;
  scale: number;
  onMove: (position: Position) => void;
  onSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onConnectionStart: (elementId: string) => void;
}

// Theme Cluster
interface ThemeClusterProps {
  element: ThemeClusterElement;
  childElements: CanvasElement[];
  isSelected: boolean;
  scale: number;
  onMove: (position: Position) => void;
  onResize: (dimensions: Dimensions) => void;
  onSelect: () => void;
  onToggleCollapse: () => void;
  onAddChild: (childId: string) => void;
  onRemoveChild: (childId: string) => void;
}

// Connection Line
interface ConnectionLineProps {
  connection: Connection;
  fromElement: CanvasElement;
  toElement: CanvasElement;
  isSelected: boolean;
  scale: number;
  onSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onUpdateControlPoints: (points: Position[]) => void;
}

// Notes Panel
interface NotesPanelProps {
  element: NoteElement;
  isSelected: boolean;
  scale: number;
  onMove: (position: Position) => void;
  onResize: (dimensions: Dimensions) => void;
  onEdit: (content: string) => void;
  onColorChange: (color: string) => void;
  onToggleMinimize: () => void;
}

// Export Button
interface ExportButtonProps {
  elements: Record<string, CanvasElement>;
  connections: Record<string, Connection>;
  onExport: (format: ExportFormat, options: ExportOptions) => Promise<void>;
  isLoading?: boolean;
}

type ExportFormat = 'docx' | 'pdf' | 'html' | 'json' | 'png';

interface ExportOptions {
  includeNotes: boolean;
  includeCitations: boolean;
  citationStyle: 'mla' | 'apa' | 'chicago';
  imageResolution?: number;
  pageSize?: 'letter' | 'a4';
}
```

## 3. State Management Approach

### Canvas Context Provider

```typescript
interface CanvasContextType {
  state: CanvasState;
  dispatch: React.Dispatch<CanvasAction>;
  
  // Computed selectors
  selectedElements: CanvasElement[];
  visibleElements: CanvasElement[];
  canUndo: boolean;
  canRedo: boolean;
  
  // Actions
  addElement: (element: Omit<CanvasElement, 'id'>) => void;
  updateElement: (id: string, updates: Partial<CanvasElement>) => void;
  deleteElement: (id: string) => void;
  selectElements: (ids: string[], append?: boolean) => void;
  clearSelection: () => void;
  
  addConnection: (connection: Omit<Connection, 'id'>) => void;
  updateConnection: (id: string, updates: Partial<Connection>) => void;
  deleteConnection: (id: string) => void;
  
  setViewport: (viewport: Partial<CanvasState['viewport']>) => void;
  
  undo: () => void;
  redo: () => void;
  
  copy: () => void;
  paste: () => void;
  
  saveToHistory: (action: string) => void;
}

// Action types for reducer
type CanvasAction = 
  | { type: 'ADD_ELEMENT'; payload: CanvasElement }
  | { type: 'UPDATE_ELEMENT'; payload: { id: string; updates: Partial<CanvasElement> } }
  | { type: 'DELETE_ELEMENT'; payload: { id: string } }
  | { type: 'SELECT_ELEMENTS'; payload: { ids: string[]; append: boolean } }
  | { type: 'CLEAR_SELECTION' }
  | { type: 'ADD_CONNECTION'; payload: Connection }
  | { type: 'UPDATE_CONNECTION'; payload: { id: string; updates: Partial<Connection> } }
  | { type: 'DELETE_CONNECTION'; payload: { id: string } }
  | { type: 'SET_VIEWPORT'; payload: Partial<CanvasState['viewport']> }
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'LOAD_STATE'; payload: CanvasState }
  | { type: 'SAVE_TO_HISTORY'; payload: { action: string } };

const CanvasProvider: React.FC<{ children: React.ReactNode; initialState?: CanvasState }> = ({ 
  children, 
  initialState 
}) => {
  const [state, dispatch] = useReducer(canvasReducer, initialState || getInitialCanvasState());
  
  // Memoized selectors and actions
  const contextValue = useMemo(() => ({
    state,
    dispatch,
    selectedElements: state.selection.map(id => state.elements[id]).filter(Boolean),
    // ... other computed values and actions
  }), [state]);
  
  return (
    <CanvasContext.Provider value={contextValue}>
      {children}
    </CanvasContext.Provider>
  );
};
```

## 4. Data Flow Between Components

### Event Flow Diagram

```
User Action (drag, click, etc.)
    ↓
Component Event Handler (onMove, onSelect, etc.)
    ↓
Canvas Context Action (updateElement, selectElements, etc.)
    ↓
Canvas Reducer (canvasReducer)
    ↓
State Update
    ↓
Component Re-render (via useCanvas hook)
    ↓
DOM Update with Animations
```

### Key Data Flow Patterns

```typescript
// 1. Element Updates Flow
// PassageCard -> onMove -> updateElement -> state update -> re-render

// 2. Selection Flow  
// CanvasWorkspace -> onElementSelect -> selectElements -> selection state -> visual feedback

// 3. Connection Creation Flow
// Element A -> onConnectionStart -> connection mode -> Element B click -> addConnection

// 4. Export Flow
// ExportButton -> gather elements -> format data -> generate document -> download

// Custom hooks for data access
const useCanvas = () => {
  const context = useContext(CanvasContext);
  if (!context) throw new Error('useCanvas must be used within CanvasProvider');
  return context;
};

const useCanvasElement = (elementId: string) => {
  const { state } = useCanvas();
  return state.elements[elementId];
};

const useCanvasSelection = () => {
  const { state, selectElements, clearSelection } = useCanvas();
  return {
    selection: state.selection,
    selectedElements: state.selection.map(id => state.elements[id]).filter(Boolean),
    selectElements,
    clearSelection
  };
};
```

## 5. Animation Specifications

### CSS-in-JS Animation Styles

```typescript
// Animation configurations
const ANIMATION_CONFIG = {
  // Element movements
  elementMove: {
    duration: '150ms',
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
    property: 'transform'
  },
  
  // Selection feedback
  selection: {
    duration: '200ms',
    easing: 'ease-out',
    property: 'box-shadow, border-color'
  },
  
  // Cluster expand/collapse
  clusterToggle: {
    duration: '300ms',
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
    property: 'height, opacity, transform'
  },
  
  // Connection drawing
  connectionDraw: {
    duration: '400ms',
    easing: 'ease-in-out',
    property: 'stroke-dashoffset'
  },
  
  // Zoom transitions
  zoom: {
    duration: '250ms',
    easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    property: 'transform'
  }
};

// Framer Motion variants for complex animations
const elementVariants = {
  idle: {
    scale: 1,
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    transition: ANIMATION_CONFIG.selection
  },
  selected: {
    scale: 1.02,
    boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
    transition: ANIMATION_CONFIG.selection
  },
  dragging: {
    scale: 1.05,
    boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
    zIndex: 1000,
    transition: { duration: 0.1 }
  }
};

const clusterVariants = {
  expanded: {
    height: 'auto',
    opacity: 1,
    transition: ANIMATION_CONFIG.clusterToggle
  },
  collapsed: {
    height: 60, // Header height only
    opacity: 0.8,
    transition: ANIMATION_CONFIG.clusterToggle
  }
};

// Connection line animation (SVG)
const connectionVariants = {
  hidden: {
    strokeDashoffset: 1000,
    transition: { duration: 0 }
  },
  visible: {
    strokeDashoffset: 0,
    transition: ANIMATION_CONFIG.connectionDraw
  }
};
```

### React Spring Animations for Performance

```typescript
// For high-performance canvas panning/zooming
const useCanvasTransform = (viewport: CanvasState['viewport']) => {
  const [springs, api] = useSpring(() => ({
    x: viewport.x,
    y: viewport.y,
    scale: viewport.zoom,
    config: {
      tension: 300,
      friction: 30
    }
  }));
  
  useEffect(() => {
    api.start({
      x: viewport.x,
      y: viewport.y,
      