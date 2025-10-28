# Design Tokens Migration Guide

This guide shows how to migrate the existing resume-pdf.tsx and html-preview-panel.tsx components to use the shared design tokens for consistent formatting.

## Benefits

- **Consistency**: Both PDF and HTML preview will use identical colors, spacing, and typography
- **Maintainability**: Change design values in one place
- **Type Safety**: TypeScript support for design token keys
- **Scalability**: Easy to add new design tokens as the design system grows

## Migration Steps

### 1. Import the Design Tokens

Add this import to both components:
```typescript
import { resumeDesignTokens, pdfHelpers } from "../_config/resume-design-tokens";
// For HTML component, also import:
import { resumeDesignTokens, cssHelpers } from "../_config/resume-design-tokens";
```

### 2. Replace Hardcoded Values

#### In resume-pdf.tsx:

**Before:**
```typescript
const styles = StyleSheet.create({
  page: {
    padding: "6mm",
    backgroundColor: "#ffffff",
    fontFamily: "Helvetica",
  },
  name: {
    fontSize: 32,
    color: "#0f172a",
  },
});
```

**After:**
```typescript
const styles = StyleSheet.create({
  page: {
    padding: pdfHelpers.mm2pt(resumeDesignTokens.layout.page.padding.mm),
    backgroundColor: resumeDesignTokens.colors.neutral.white,
    fontFamily: resumeDesignTokens.typography.fontFamily.primary,
  },
  name: {
    fontSize: pdfHelpers.getFontSize("4xl"),
    color: pdfHelpers.getColor("primary.900"),
  },
});
```

#### In html-preview-panel.tsx:

**Before:**
```typescript
<h1 className="mb-3 font-bold text-4xl text-gray-900">
  {basicInfo.firstName} {basicInfo.lastName}
</h1>
```

**After:**
```typescript
<h1
  className={`
    mb-3 font-bold
    ${cssHelpers.getFontSizeClass('4xl')}
    ${cssHelpers.getColorClass('primary.900', 'text')}
  `}
>
  {basicInfo.firstName} {basicInfo.lastName}
</h1>
```

### 3. Use Consistent Spacing

Replace hardcoded margins and padding with token values:

**PDF:**
```typescript
marginBottom: pdfHelpers.getSpacing(10), // instead of 24
paddingBottom: pdfHelpers.getSpacing(7),  // instead of 16
```

**HTML:**
```typescript
style={{
  marginBottom: `${resumeDesignTokens.components.section.marginBottom}px`,
  paddingBottom: `${resumeDesignTokens.components.section.titlePaddingBottom}px`
}}
```

### 4. Standardize Colors

Replace all color values with token references:

**Common color mappings:**
- `#0f172a` → `pdfHelpers.getColor("primary.900")` or `cssHelpers.getColorClass('primary.900', 'text')`
- `#64748b` → `pdfHelpers.getColor("primary.500")` or `cssHelpers.getColorClass('primary.500', 'text')`
- `#2563eb` → `pdfHelpers.getColor("accent.600")` or `cssHelpers.getColorClass('accent.600', 'text')`
- `#e2e8f0` → `pdfHelpers.getColor("primary.200")` or `cssHelpers.getColorClass('primary.200', 'border')`

### 5. Update Typography

Replace font sizes and weights:

**Font size mappings:**
- `32` → `pdfHelpers.getFontSize("4xl")` or `cssHelpers.getFontSizeClass('4xl')`
- `12` → `pdfHelpers.getFontSize("lg")` or `cssHelpers.getFontSizeClass('lg')`
- `10` → `pdfHelpers.getFontSize("sm")` or `cssHelpers.getFontSizeClass('sm')`

## Key Helper Functions

### PDF Helpers (pdfHelpers)
- `pdfHelpers.getColor(path)` - Get color by path (e.g., "primary.900")
- `pdfHelpers.getFontSize(key)` - Get font size in points
- `pdfHelpers.getSpacing(key)` - Get spacing in points
- `pdfHelpers.mm2pt(mm)` - Convert millimeters to points

### CSS Helpers (cssHelpers)
- `cssHelpers.getColorClass(path, type)` - Get Tailwind color class
- `cssHelpers.getFontSizeClass(key)` - Get Tailwind font size class
- `cssHelpers.getSpacingClass(key, prefix)` - Get Tailwind spacing class

## Benefits After Migration

1. **Perfect Consistency**: Both components will render identically
2. **Easy Updates**: Change `resumeDesignTokens` to update both components
3. **Better DX**: TypeScript autocomplete for all design values
4. **Design System**: Foundation for expanding to other resume components

## Next Steps

After migration, you can:
- Add new design tokens for additional styling needs
- Create theme variants (dark mode, different color schemes)
- Extract more component-specific configurations
- Add design token validation and testing
