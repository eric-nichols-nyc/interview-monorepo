# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

This is a **next-forge** project - a production-grade Turborepo template for Next.js applications. It's designed as a comprehensive SaaS application foundation with a monorepo structure managed by Turborepo and pnpm.

**Current Status**: This appears to be a customized version with only a resume app currently implemented, but retains the full package structure for future development.

## Common Commands

### Development
```bash
# Start development server for all apps
pnpm dev

# Start development server for specific app (resume app runs on port 3000)
cd apps/resume && pnpm dev

# Install dependencies
pnpm install
```

### Building
```bash
# Build all apps and packages
pnpm build

# Build with dependencies handled by Turbo
turbo build
```

### Code Quality
```bash
# Run linting and formatting (uses Biome + ultracite)
pnpm check

# Auto-fix linting and formatting issues  
pnpm fix

# Type checking across workspace
pnpm typecheck
```

### Testing
```bash
# Run all tests
pnpm test

# Run tests with Turbo
turbo test
```

### Database Operations
```bash
# Generate Supabase types from your database schema
pnpm migrate

# Alternative: Manual database operations
cd packages/database
pnpm analyze  # Generates TypeScript types from Supabase schema
```

### Package Management
```bash
# Update dependencies (excludes react-day-picker, recharts)
pnpm bump-deps

# Update shadcn/ui components in design system
pnpm bump-ui

# Clean all node_modules
pnpm clean
```

### Analysis & Translation
```bash
# Run code analysis
pnpm analyze

# Run translation tasks
pnpm translate

# Check package boundaries
pnpm boundaries
```

## Architecture Overview

### Monorepo Structure
- **Package Manager**: pnpm with workspaces
- **Build System**: Turborepo with task orchestration
- **Code Quality**: Biome + ultracite for linting/formatting
- **TypeScript**: Strict configuration across all packages

### Current Apps
- **`apps/resume/`** - Next.js application (port 3000) with Turbopack
  - Uses workspace design system package
  - Tailwind CSS v4 for styling

### Core Packages
- **`packages/database/`** - Supabase database layer
  - PostgreSQL with Supabase serverless
  - TypeScript types generated from schema
  - Server and client utilities with SSR support

- **`packages/auth/`** - Authentication with Supabase Auth
  - Next.js integration via `@supabase/ssr`
  - Client and server authentication utilities
  - Session management with React context

- **`packages/design-system/`** - Shared component library
  - shadcn/ui based components
  - Excluded from Biome linting (UI components)

- **`packages/typescript-config/`** - Shared TypeScript configurations

### Additional Infrastructure Packages
The monorepo includes packages for:
- **Analytics** - Web and product analytics
- **Payments** - Stripe integration
- **Security** - Arcjet security, rate limiting
- **Observability** - Sentry, logging, monitoring
- **CMS** - Content management
- **SEO** - Metadata, sitemaps
- **AI** - AI integration utilities
- **Storage** - File upload/management
- **Internationalization** - Multi-language support
- **Notifications** - In-app notifications
- **Feature Flags** - Feature flag management

### Key Configuration Files
- **`turbo.json`** - Turborepo task configuration with caching
- **`biome.jsonc`** - Code formatting/linting (extends ultracite)
- **`pnpm-workspace.yaml`** - Workspace package definitions
- **`packages/database/types/supabase.ts`** - Generated Supabase TypeScript types

### Development Workflow
1. **Database**: Uses Supabase PostgreSQL with real-time features
2. **Authentication**: Supabase Auth with SSR support
3. **Styling**: Tailwind CSS v4 with design system components
4. **Type Safety**: End-to-end TypeScript with strict configs
5. **Build Optimization**: Turbo with smart caching and Turbopack for Next.js

### Environment Setup
- **Node.js**: 20+ required
- **Package Manager**: pnpm (version 10.18.1)
- **Database**: Supabase (PostgreSQL with real-time)
- **Authentication**: Supabase project with Auth enabled
- **Required Environment Variables**:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY` (optional, for admin operations)

### Testing Strategy
- Uses Vitest as the testing framework
- Tests run as part of build pipeline (build depends on test)
- Turborepo handles test task orchestration

This is a sophisticated, production-ready monorepo template optimized for rapid SaaS development with modern tooling and comprehensive package ecosystem. Now powered by Supabase for database and authentication, providing real-time capabilities and seamless SSR support.
