# Resume Editor Quick Reference

## Common Tasks

### Add a New Resume Section

1. **Update the store with new selector:**
```typescript
// In stores/resume-editor-store.ts
export const useResumeNewSection = () => useResumeEditorStore(state => state.resume?.newSection || []);

// Add update method
updateNewSection: (data) => get().updateSection('newSection', data),
```

2. **Create the editor component:**
```typescript
// In _components/new-section-content.tsx
export function NewSectionContent() {
  const data = useResumeNewSection();
  const updateData = useResumeEditorStore(s => s.updateNewSection);
  
  return (
    <div>
      {/* Your form here */}
    </div>
  );
}
```

3. **Add to the accordion:**
```typescript
// In info-accordion.tsx
<AccordionItem value="new-section">
  <AccordionTrigger>New Section</AccordionTrigger>
  <AccordionContent>
    <NewSectionContent />
  </AccordionContent>
</AccordionItem>
```

### Add New Field to Existing Section

1. **Update types:**
```typescript
// In types/resume.ts or types/profile.ts
export type ExistingType = {
  // ... existing fields
  newField: string;
}
```

2. **Update the component:**
```typescript
// In the relevant content component
<Input
  value={currentData.newField || ''}
  onChange={(e) => updateField('newField', e.target.value)}
/>
```

### Debug Store Issues

```typescript
// Temporary debugging in any component
const store = useResumeEditorStore();
console.log('Full store:', store);
console.log('Has changes:', store.hasUnsavedChanges);
console.log('Resume data:', store.resume);
```

### Add Navigation Protection to New Page

```typescript
// In your new page component
import { useUnsavedChanges } from '../../../hooks/use-unsaved-changes';
import { useHasUnsavedChanges } from '../../../stores/resume-editor-store';

export function MyNewPage() {
  const hasChanges = useHasUnsavedChanges();
  
  useUnsavedChanges(hasChanges, {
    message: "Custom warning message"
  });
  
  return <div>My page content</div>;
}
```

## Store API Cheat Sheet

### Reading Data
```typescript
const resume = useResumeData();              // Full resume
const basicInfo = useResumeBasicInfo();      // Basic info only
const workExp = useResumeWorkExperience();   // Work experience
const hasChanges = useHasUnsavedChanges();   // Boolean
const isAutoSaving = useIsAutoSaving();      // Boolean
```

### Updating Data
```typescript
const { 
  updateBasicInfo,
  updateWorkExperience,
  updateSkills,
  updateProjects,
  saveToDatabase 
} = useResumeEditorStore();

// Update sections
updateBasicInfo({ firstName: "John" });
updateWorkExperience([...experiences, newExp]);

// Manual save
await saveToDatabase();
```

## Component Patterns

### Form Field Pattern
```typescript
<Input
  value={data.fieldName || ''}
  onChange={(e) => updateData('fieldName', e.target.value)}
  placeholder="Enter value..."
/>
```

### Array Field Pattern
```typescript
const addItem = () => {
  updateArray([...array, newItem]);
};

const deleteItem = (index: number) => {
  updateArray(array.filter((_, i) => i !== index));
};

const updateItem = (index: number, newData: any) => {
  const updated = [...array];
  updated[index] = newData;
  updateArray(updated);
};
```

### Loading States
```typescript
const { data, isLoading, error } = useQuery({
  queryKey: ['key'],
  queryFn: fetchFunction
});

if (isLoading) return <LoadingSpinner />;
if (error) return <ErrorMessage />;
```

## Common Debugging

### Store not updating?
1. Check if you're using the correct store action
2. Verify the action is actually being called
3. Make sure you're not mutating state directly

### Component not re-rendering?
1. Use specific selectors instead of full store
2. Check if the selector is returning new objects unnecessarily
3. Verify the component is properly subscribed to store

### Navigation warning not working?
1. Ensure `useUnsavedChanges` is called in client component
2. Check if `hasUnsavedChanges` is correctly connected
3. Verify you're using Next.js router correctly

## File Locations

```
Key files you'll work with:
├── stores/resume-editor-store.ts     ← State management
├── app/(dashboard)/resume/[id]/
│   ├── page.tsx                      ← Main page
│   └── _components/
│       ├── *-content.tsx             ← Section editors
│       └── info-accordion.tsx        ← Navigation
├── hooks/queries/
│   ├── resume-queries.ts             ← Data fetching
│   └── profile-queries.ts            ← Profile data
└── types/
    ├── resume.ts                     ← Type definitions
    └── profile.ts                    ← Profile types
```

## Testing Checklist

When adding new features:
- [ ] Does the preview update in real-time?
- [ ] Are unsaved changes tracked correctly?
- [ ] Does navigation warning work?
- [ ] Can data be saved to database?
- [ ] Does the component handle loading states?
- [ ] Are error states handled properly?
- [ ] Is the UI responsive?
- [ ] Do form validations work?