# Resume App Documentation

## Quick Navigation

### 📚 Getting Started
- [Quick Reference Guide](./quick-reference.md) - Common tasks and patterns
- [Technical Overview](./technical-overview.md) - Architecture and implementation details

### 🔧 Feature Documentation
- [Resume Editor System](./resume-editor-system.md) - Core editing functionality  
- [Profile Form System](./profile-form-system.md) - Profile data management
- [Work Experience Implementation](./work-experience-implementation.md) - Work experience editor
- [Skills Implementation](./skills-implementation.md) - Skills editor
- [**PDF Export System**](./pdf-export-system.md) - **PDF generation and download** ⭐

## Recent Additions

### PDF Export System ✨
The PDF export system provides professional PDF generation from resume data:

- **High-quality PDF output** using `@react-pdf/renderer`
- **Visual consistency** with HTML preview styling
- **Dynamic filenames** based on user's name
- **One-click download** functionality
- **Same data source** as HTML preview (Zustand store)

**Quick Usage:**
```typescript
// Import the components
import { ResumePDF } from './resume-pdf';
import { ExportToPdfButton } from './export-to-pdf-button';

// Use the export button
<ExportToPdfButton />
```

See [PDF Export System Documentation](./pdf-export-system.md) for complete implementation details.

## Documentation Structure

```
docs/
├── README.md (this file)           ← Documentation index
├── quick-reference.md              ← Quick tasks and patterns
├── technical-overview.md           ← Architecture overview
├── resume-editor-system.md         ← Core editor functionality
├── profile-form-system.md          ← Profile management
├── work-experience-implementation.md ← Work experience editor
├── skills-implementation.md        ← Skills editor
└── pdf-export-system.md           ← PDF generation (NEW!)
```

## Key Files Reference

### Core Components
```
app/(dashboard)/resume/[id]/_components/
├── resume-pdf.tsx              ← PDF document component
├── export-to-pdf-button.tsx    ← PDF export button
├── html-preview-panel.tsx      ← HTML preview
├── info-accordion.tsx          ← Main navigation
└── *-content.tsx              ← Section editors
```

### State Management
```
stores/
└── resume-editor-store.ts      ← Centralized Zustand store
```

### Type Definitions
```
types/
├── resume.ts                   ← Resume data types
└── profile.ts                  ← Profile data types
```

## Development Workflow

1. **Making Changes**: Edit components and see real-time preview
2. **Testing**: Use the checklist in [quick-reference.md](./quick-reference.md)
3. **PDF Export**: Click "Export to PDF" to download current resume
4. **Documentation**: Update relevant docs when adding features

## Common Tasks

- **Add new resume section**: Follow [quick-reference.md](./quick-reference.md#add-a-new-resume-section)
- **Modify PDF styling**: Edit `resume-pdf.tsx` styles
- **Debug store issues**: Use debugging patterns in quick reference
- **Test PDF export**: Follow checklist in [pdf-export-system.md](./pdf-export-system.md#testing-considerations)

## Support

For implementation questions:
1. Check the [Quick Reference Guide](./quick-reference.md) first
2. Review the specific feature documentation
3. Look at existing component patterns
4. Check TypeScript types for data structures

---

**Last Updated**: October 2024  
**Latest Feature**: PDF Export System