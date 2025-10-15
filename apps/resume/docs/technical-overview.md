# Technical Implementation Overview

## State Management Architecture

### Zustand Store Design

The resume editor uses a centralized Zustand store that provides:
- **Single source of truth** for resume data
- **Optimized re-renders** through selective subscriptions
- **Automatic change tracking** for navigation protection
- **Type-safe operations** with TypeScript integration

#### Store Structure
```typescript
interface ResumeEditorState {
  // Data
  resume: Resume | null;
  originalResume: Resume | null;
  
  // State flags
  hasUnsavedChanges: boolean;
  lastSaved: Date | null;
  isAutoSaving: boolean;
  isSaving: boolean;
  error: string | null;
  
  // Actions
  initializeResume: (resume: Resume) => void;
  updateSection: <T extends keyof Resume>(section: T, data: Resume[T]) => void;
  saveToDatabase: () => Promise<void>;
  
  // Section-specific updaters
  updateBasicInfo: (info: Partial<BasicInfo>) => void;
  updateWorkExperience: (experience: WorkExperience[]) => void;
  // ... more sections
}
```

#### Performance Optimizations

1. **Selective Re-renders**
```typescript
// ❌ Causes re-render on any store change
const store = useResumeEditorStore();

// ✅ Only re-renders when basicInfo changes
const basicInfo = useResumeBasicInfo();
```

2. **Cached Selectors**
```typescript
// Prevents new object creation on each render
let cachedBasicInfo: any = null;
let cachedResumeId: string | null = null;

const selectBasicInfo = (state: ResumeEditorState) => {
  if (state.resume?.id === cachedResumeId && cachedBasicInfo) {
    return cachedBasicInfo;
  }
  // Create and cache new object...
};
```

## Data Flow Architecture

### 1. Component → Store → Database
```
User Input → Store Update → Set hasUnsavedChanges → Preview Update → Debounced Save
```

### 2. Database → Store → Component
```
Server Action → Store Update → Clear hasUnsavedChanges → Component Re-render
```

### 3. Profile Import Flow
```
Profile Query → Transform Data → Store Update → All Components Re-render
```

## Real-time Preview System

### A4 Scaling Implementation
The preview panel maintains consistent A4 proportions while scaling to fit the container:

```typescript
const calculateScale = () => {
  const containerWidth = container.clientWidth;
  const containerHeight = container.clientHeight;
  
  // A4 dimensions in pixels (96 DPI)
  const documentWidth = 794;   // 210mm
  const documentHeight = 1123; // 297mm
  
  const scaleX = (containerWidth - 40) / documentWidth;
  const scaleY = (containerHeight - 40) / documentHeight;
  
  // Use smaller scale to fit both dimensions
  const scale = Math.min(scaleX, scaleY, 1);
  
  setScale(scale);
};
```

### CSS Transform Application
```css
.resume-document {
  width: 210mm;
  min-height: 297mm;
  transform: scale(var(--scale-factor));
  transform-origin: top center;
}
```

## Navigation Protection System

### Multi-layer Protection

1. **Browser Events**
```typescript
// Handles refresh, close tab
window.addEventListener('beforeunload', (e) => {
  if (hasUnsavedChanges) {
    e.preventDefault();
    e.returnValue = '';
  }
});
```

2. **Router Override**
```typescript
// Intercepts Next.js navigation
const originalPush = router.push;
router.push = (href: string, options?: any) => {
  if (hasUnsavedChanges) {
    const confirmed = window.confirm(message);
    if (!confirmed) return Promise.resolve();
  }
  return originalPush.call(router, href, options);
};
```

3. **History API**
```typescript
// Handles back/forward buttons
window.addEventListener('popstate', (e) => {
  if (hasUnsavedChanges) {
    const confirmed = window.confirm(message);
    if (!confirmed) {
      window.history.pushState(null, '', window.location.href);
    }
  }
});
```

## Form Management Patterns

### Controlled Components Pattern
All form inputs are controlled components connected directly to the store:

```typescript
<Input
  value={currentData.fieldName || ''}
  onChange={(e) => updateField('fieldName', e.target.value)}
  placeholder="Enter value..."
/>
```

### Array Management Pattern
For handling arrays like work experience or skills:

```typescript
// Add item
const addItem = () => {
  const newItem = createDefaultItem();
  updateArray([...currentArray, newItem]);
};

// Update item
const updateItem = (index: number, field: string, value: any) => {
  const updated = [...currentArray];
  updated[index] = { ...updated[index], [field]: value };
  updateArray(updated);
};

// Delete item
const deleteItem = (index: number) => {
  updateArray(currentArray.filter((_, i) => i !== index));
};
```

### Multi-item Navigation
When editing multiple work experiences:

```typescript
const [currentEditingIndex, setCurrentEditingIndex] = useState(0);

const currentExperience = workExperiences[currentEditingIndex] || defaultExperience;

// Navigate between experiences
{workExperiences.map((_, index) => (
  <Button
    key={index}
    variant={currentEditingIndex === index ? "default" : "outline"}
    onClick={() => setCurrentEditingIndex(index)}
  >
    {index + 1}
  </Button>
))}
```

## Error Handling Strategy

### Server Action Error Handling
```typescript
const saveToDatabase = async () => {
  set({ isAutoSaving: true, error: null });
  
  try {
    const result = await updateResumeAction({ id, data: resume });
    
    if (result.success) {
      markAsSaved(result.data);
    } else {
      set({ 
        error: result.error || "Failed to save resume",
        isAutoSaving: false 
      });
    }
  } catch (error) {
    set({ 
      error: error.message || "Network error occurred",
      isAutoSaving: false 
    });
  }
};
```

### Component Error Boundaries
Key components have error handling for graceful degradation:

```typescript
if (error) {
  return (
    <div className="error-state">
      <p>Unable to load resume data</p>
      <Button onClick={retry}>Try Again</Button>
    </div>
  );
}
```

## Performance Considerations

### Bundle Optimization
- **Code splitting**: Components are lazily loaded
- **Tree shaking**: Unused store methods are eliminated
- **Selective imports**: Only necessary UI components imported

### Runtime Performance
- **Debounced saves**: Prevents excessive database calls
- **Memoized selectors**: Reduces unnecessary re-renders
- **Efficient arrays**: Uses index-based updates vs full replacement

### Memory Management
- **Store cleanup**: Reset store on page unmount
- **Event listeners**: Proper cleanup in useEffect
- **Query cache**: TanStack Query handles cache lifecycle

## Security Considerations

### Data Validation
- **Server-side validation**: All data validated before database storage
- **Type safety**: TypeScript prevents runtime type errors
- **Input sanitization**: User inputs are sanitized before storage

### Access Control
- **User isolation**: Users can only access their own resumes
- **Authentication**: All server actions verify user authentication
- **Authorization**: Resume ownership checked on every operation

## Testing Strategy

### Unit Testing
- Store actions and selectors
- Individual component behavior
- Utility functions and helpers

### Integration Testing
- Store + component interaction
- Form submission flows
- Navigation protection

### End-to-End Testing
- Complete user workflows
- Cross-browser compatibility
- Mobile responsive behavior

## Future Scalability

### Planned Optimizations
- **Virtual scrolling** for large resume lists
- **Background sync** for offline capability
- **Real-time collaboration** using WebSocket
- **Advanced caching** with service workers

### Architecture Extensions
- **Plugin system** for custom resume sections
- **Theme system** for multiple resume templates
- **Export pipeline** for various formats (PDF, Word, etc.)
- **Version control** for resume history and rollback

## Dependencies

### Core Libraries
- **Next.js 14**: React framework with app router
- **Zustand 4**: State management
- **TanStack Query 5**: Server state management
- **React Hook Form**: Form handling (planned)
- **Zod**: Runtime validation (planned)

### UI Libraries
- **shadcn/ui**: Component library
- **Tailwind CSS**: Styling framework
- **Lucide React**: Icons
- **Radix UI**: Headless components

### Database
- **Prisma**: ORM and database toolkit
- **PostgreSQL**: Primary database
- **Supabase**: Database hosting and auth

This technical overview provides the foundation for understanding and extending the resume editor system.