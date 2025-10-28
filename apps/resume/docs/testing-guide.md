# Testing Guide

## Overview

This document describes the testing strategy and setup for the Resume Builder application.

## Testing Stack

- **Vitest** - Fast unit test framework powered by Vite
- **React Testing Library** - Component testing utilities
- **jsdom** - DOM environment for Node.js

## Running Tests

```bash
# Run all tests once
pnpm test

# Run tests in watch mode (re-runs on file changes)
pnpm test:watch

# Run tests with UI
pnpm vitest --ui
```

### Automatic Testing with Git Hooks

Tests automatically run before every commit via Husky pre-commit hook. If tests fail, the commit will be blocked.

To bypass this (use sparingly):
```bash
git commit --no-verify -m "your message"
```

## Test Structure

```
apps/resume/
├── __tests__/
│   ├── components/      # Component tests
│   ├── stores/          # Zustand store tests
│   ├── utils/           # Utility function tests
│   └── integration/     # Integration tests
└── vitest.config.ts
```

## Writing Tests

### Basic Test Example

```typescript
import { describe, expect, it } from "vitest";

describe("Feature Name", () => {
  it("should do something", () => {
    const result = someFunction();
    expect(result).toBe(expectedValue);
  });
});
```

### Component Test Example

```typescript
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MyComponent } from "./MyComponent";

describe("MyComponent", () => {
  it("should render correctly", () => {
    render(<MyComponent />);
    expect(screen.getByText("Hello")).toBeInTheDocument();
  });
});
```

### Store Test Example

```typescript
import { describe, expect, it, beforeEach } from "vitest";
import { useResumeEditorStore } from "../../stores/resume-editor-store";

describe("Resume Editor Store", () => {
  beforeEach(() => {
    useResumeEditorStore.getState().resetStore();
  });

  it("should update skills", () => {
    const { updateSkills } = useResumeEditorStore.getState();
    
    updateSkills([{ id: "1", category: "Tech", items: ["React"] }]);
    
    const state = useResumeEditorStore.getState();
    expect(state.resume?.skills).toHaveLength(1);
  });
});
```

## Testing Guidelines

### What to Test

1. **Pure Functions** - Utility functions, helpers, formatters
2. **Store Logic** - State updates, selectors, computed values
3. **Component Behavior** - User interactions, rendering logic
4. **Critical Flows** - Complete user workflows (integration tests)

### What NOT to Test

1. **Implementation Details** - Internal component state, private methods
2. **Third-Party Libraries** - React, Zustand, etc. (already tested)
3. **Styles** - CSS classes, Tailwind utilities
4. **Type Definitions** - TypeScript already validates types

## Test Coverage Goals

- **Stores**: 90%+ coverage (critical business logic)
- **Utilities**: 80%+ coverage (pure functions)
- **Components**: 60%+ coverage (key interactions)
- **Integration**: 5-10 critical user flows

## Current Test Status

### Implemented Tests

- ✅ String utility functions (`stripProtocol`)

### Planned Tests

- ⏳ Resume Editor Store
  - Skills CRUD operations
  - Work experience management
  - Section reordering
  - Auto-save functionality
  
- ⏳ Component Tests
  - Skills Content component
  - Work Experience component
  - HTML Preview Panel
  - Draggable components

- ⏳ Integration Tests
  - Complete resume creation flow
  - Import from profile
  - PDF generation

## Future Enhancements

### Phase 2: E2E Testing with Playwright

When the application is more stable, add end-to-end tests for:

- Authentication flows
- Complete resume creation journey
- PDF export validation
- Cross-browser compatibility
- Visual regression testing

### Phase 3: Performance Testing

- Store performance benchmarks
- Component render performance
- PDF generation performance

## Troubleshooting

### Common Issues

**Problem**: Tests fail with "Cannot find module"
**Solution**: Check `vitest.config.ts` path aliases

**Problem**: Tests timeout
**Solution**: Increase timeout in test or config:
```typescript
it("slow test", async () => {
  // ...
}, 10000); // 10 second timeout
```

**Problem**: React components not rendering
**Solution**: Ensure `jsdom` environment is configured in `vitest.config.ts`

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

## Contributing

When adding new features:

1. Write tests first (TDD approach recommended)
2. Aim for meaningful coverage, not just high percentages
3. Keep tests simple and readable
4. Use descriptive test names that explain behavior
5. Update this documentation as testing strategy evolves
