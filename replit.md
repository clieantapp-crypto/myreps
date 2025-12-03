# FIFA Arab Cup Qatar 2025 - Ticketing Platform

## Overview

This is a full-stack web application for purchasing tickets to the FIFA Arab Cup Qatar 2025. The platform allows users to browse events, view matches, select seats from different categories, and complete purchases through a checkout flow. The application features a mobile-first design with a Qatar-themed brand identity (maroon/burgundy color scheme) and supports both English and Arabic text.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build Tool**
- React with TypeScript for type safety and developer experience
- Vite as the build tool and development server for fast hot module replacement
- Wouter for client-side routing (lightweight React Router alternative)

**UI Component System**
- shadcn/ui components built on Radix UI primitives for accessible, unstyled components
- Tailwind CSS v4 for styling with custom CSS variables for theming
- Custom Qatar-themed color scheme (maroon primary color: `343 72% 31%`)
- Mobile-first responsive design approach

**State Management**
- TanStack Query (React Query) for server state management, data fetching, and caching
- React Context API for shopping cart state (CartContext)
- Local storage for session persistence (cart session ID)

**Key Design Patterns**
- Component-based architecture with reusable UI components in `client/src/components`
- Custom hooks for shared logic (`use-mobile`, `use-toast`)
- Asset imports via Vite's `@assets` alias for generated images
- Form handling with React Hook Form and Zod validation

### Backend Architecture

**Server Framework**
- Express.js for HTTP server and API routing
- Node.js with ES modules (type: "module" in package.json)
- TypeScript for type safety across the stack

**API Design**
- RESTful API endpoints under `/api` prefix
- Resource-based routes for events, matches, seat categories, and cart operations
- Request validation using Zod schemas from shared schema definitions
- Centralized error handling and logging middleware

**Server Structure**
- `server/index.ts`: Main application entry point with middleware setup
- `server/routes.ts`: API route definitions and handlers
- `server/storage.ts`: Data access layer with IStorage interface abstraction
- `server/static.ts`: Static file serving for production builds
- `server/vite.ts`: Vite middleware integration for development

**Development vs Production**
- Development: Vite middleware serves client with HMR
- Production: Pre-built static files served from `dist/public`
- Custom build script bundles server code with esbuild, selectively bundling dependencies to reduce syscalls

### Data Storage Solutions

**Database**
- PostgreSQL as the primary database (via Neon serverless)
- Drizzle ORM for type-safe database queries and schema management
- WebSocket connection pooling for serverless environments

**Schema Design**
- `users`: User authentication (UUID primary key, username/password)
- `events`: Tournament/competition events (auto-increment ID, dates, location, pricing)
- `matches`: Individual matches linked to events (teams, stadium, date/time, status)
- `seatCategories`: Ticket categories per match (price, availability, color coding)
- `cartItems`: Shopping cart persistence (linked to session ID and match/category)

**Data Access Pattern**
- Storage interface (`IStorage`) abstracts database operations
- `DatabaseStorage` class implements the interface using Drizzle ORM
- Shared schema definitions in `shared/schema.ts` used by both client and server
- Drizzle-Zod integration for automatic validation schema generation

### Authentication & Authorization

**Current Implementation**
- User schema exists with username/password fields
- Session-based cart tracking using locally generated session IDs
- No active authentication flow implemented in current codebase (prepared for future implementation)

**Planned Architecture**
- Express session middleware with PostgreSQL session store (`connect-pg-simple`)
- Passport.js for authentication strategy (local strategy prepared in dependencies)
- JWT tokens for API authentication (jsonwebtoken in dependencies)

### External Dependencies

**Payment Processing**
- Stripe integration prepared (dependency installed, not yet implemented)
- OTP verification modal component exists for 2FA/payment confirmation

**Email Services**
- Nodemailer dependency included for transactional emails

**Third-party UI Libraries**
- Radix UI primitives for 40+ accessible component patterns
- Lucide React for iconography
- Vaul for mobile-friendly drawer/modal interactions
- embla-carousel for image carousels
- input-otp for OTP input fields
- cmdk for command palette patterns

**Development Tools**
- Replit-specific plugins: vite-plugin-cartographer, vite-plugin-dev-banner, vite-plugin-runtime-error-modal
- Custom vite-plugin-meta-images for OpenGraph image URL updates

**Database & ORM**
- @neondatabase/serverless: PostgreSQL client optimized for serverless
- Drizzle ORM with PostgreSQL dialect
- drizzle-kit for schema migrations

**Fonts**
- Google Fonts: Inter (primary), Noto Sans Arabic, Dancing Script (for partner mockups)

**Validation**
- Zod for runtime type validation
- @hookform/resolvers for React Hook Form integration
- zod-validation-error for user-friendly error messages