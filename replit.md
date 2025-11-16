# On-Chain CV Proof Vault

## Overview

On-Chain CV Proof Vault is a full-stack web application that enables candidates to register their CVs with blockchain-backed proof and allows recruiters to verify the authenticity of CV submissions. The system creates tamper-proof CV records by computing file hashes, storing documents in decentralized storage (Walrus), and registering proof records on the Sui blockchain. Each registration generates a unique shareable proof code that recruiters can use to verify CV authenticity.

The application is built as a monorepo with a React frontend and Express backend, both written in TypeScript. The current implementation includes mock services for Walrus and Sui integration, with the architecture designed to easily swap in real SDK implementations when ready.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React 18 with TypeScript running on Vite as the build tool and development server.

**Routing**: Wouter for client-side routing with the following key routes:
- `/` - Landing page with hero and features
- `/register` - CV registration form
- `/verify` - Proof code verification lookup
- `/p/:proofCode` - Public proof display page
- `/success/:proofCode` - Post-registration success page

**State Management**: TanStack Query (React Query) for server state management with custom query client configuration. No global client state management library is used.

**UI Component Library**: Shadcn UI (New York variant) built on Radix UI primitives with Tailwind CSS for styling. The design follows a modern, professional aesthetic inspired by Material Design and contemporary SaaS applications.

**Form Handling**: React Hook Form with Zod for schema validation and type-safe form management.

**Design System**: Custom Tailwind configuration with HSL-based color tokens supporting light/dark modes. Typography uses Inter for body text and JetBrains Mono for code/monospace elements. The design emphasizes trust, clarity, and a security-forward visual language appropriate for HR/recruiting contexts.

### Backend Architecture

**Framework**: Express.js with TypeScript, compiled using esbuild for production builds.

**API Structure**: RESTful API with primary endpoint `/api/proof/register` for CV registration. File uploads handled via Multer middleware with 10MB size limit and PDF-only validation.

**Data Storage**: In-memory storage implementation (`MemStorage`) using Maps for development/demo purposes. The storage interface (`IStorage`) is abstracted to allow easy migration to database-backed storage (e.g., PostgreSQL with Drizzle ORM).

**File Processing**: 
- PDF file validation on upload
- SHA-256 hash computation for file integrity verification
- File buffer handling for storage service integration

**Proof Registration Flow**:
1. Validate uploaded PDF file and wallet address
2. Compute SHA-256 hash of CV file
3. Upload CV to Walrus storage (mocked)
4. Register proof on Sui blockchain (mocked)
5. Store proof record with unique proof code
6. Return proof details to client

**Service Layer Architecture**: 
- `walrusService.ts` - Decentralized storage integration (currently mocked)
- `suiService.ts` - Blockchain proof registration (currently mocked)

Both services include detailed comments explaining the real implementation approach when SDKs become available.

### Database Schema (Drizzle ORM)

**Primary Table**: `cv_proofs`
- `id` - UUID primary key
- `walletAddress` - User's wallet identifier
- `fileHash` - SHA-256 hash of the PDF file
- `contentId` - Walrus storage content identifier
- `storageUrl` - URL to retrieve CV from Walrus
- `txHash` - Sui blockchain transaction hash
- `proofCode` - Unique shareable verification code
- `createdAt` - Timestamp of registration

**Schema Configuration**: PostgreSQL dialect configured via Drizzle Kit, expecting `DATABASE_URL` environment variable. Schema definitions use Drizzle-Zod for automatic validation schema generation.

**Migration Strategy**: Migrations generated to `./migrations` directory. Currently using in-memory storage but architecture supports switching to Postgres by provisioning a database and running `npm run db:push`.

### Development Environment

**Replit Integration**: 
- Custom Vite plugins for Replit-specific features (runtime error overlay, cartographer, dev banner)
- Development server proxies API requests from frontend to backend
- Hot module replacement enabled for frontend development

**Build Process**:
- Frontend: Vite bundles React app to `dist/public`
- Backend: esbuild compiles server code to `dist/index.js` as ESM bundle
- Production mode serves static files from Express

**Environment Configuration**: Uses `.env` for configuration with placeholder support for future Walrus API keys and Sui RPC URLs.

## External Dependencies

### Third-Party Services (Planned Integration)

**Walrus Decentralized Storage**:
- Purpose: Store CV PDF files in decentralized network
- Current State: Mocked in `walrusService.ts` with simulated content IDs and URLs
- Integration Point: Replace mock with official Walrus SDK when available
- Expected SDK: `@walrus/sdk` or similar
- Documentation: https://docs.walrus.storage/

**Sui Blockchain**:
- Purpose: Register immutable proof records on-chain
- Current State: Mocked in `suiService.ts` with generated transaction hashes
- Integration Point: Replace mock with `@mysten/sui.js` SDK
- Expected Implementation: Move call to smart contract with proof data
- Documentation: https://docs.sui.io/

### UI and Component Libraries

**Radix UI**: Headless component primitives for accessible UI components (accordions, dialogs, dropdowns, forms, etc.)

**Shadcn UI**: Pre-built component library using Radix UI and Tailwind CSS with "New York" style variant

**Lucide React**: Icon library for consistent iconography throughout the application

**Tailwind CSS**: Utility-first CSS framework with custom configuration for design system

### Development Tools

**TypeScript**: Strict type checking enabled across frontend, backend, and shared code

**Drizzle ORM**: Type-safe database toolkit for PostgreSQL (configured but not actively used with in-memory storage)

**Zod**: Schema validation library used for API request validation and form validation

**Multer**: Express middleware for handling multipart/form-data file uploads

**TanStack Query**: Data fetching and caching library for React

**React Hook Form**: Form state management with performance optimization

**Vite**: Next-generation frontend build tool with fast HMR

**ESBuild**: Extremely fast bundler for backend TypeScript compilation

### Database and Session Management

**@neondatabase/serverless**: Serverless PostgreSQL driver (configured for future use)

**connect-pg-simple**: PostgreSQL session store for Express (available but not currently implemented)

### Notable Design Decisions

1. **Monorepo Structure**: Single repository with `client/`, `server/`, and `shared/` directories enables code sharing and simplified deployment

2. **Mock-First Architecture**: Blockchain and storage services are mocked with clear integration points, allowing development without external dependencies while maintaining production-ready structure

3. **Type Safety**: Shared schema definitions between frontend and backend using Drizzle-Zod ensures type consistency across the stack

4. **File Validation**: Strict PDF-only validation with size limits protects against malicious uploads

5. **Proof Code Generation**: Unique, shareable proof codes enable public verification without exposing internal IDs

6. **In-Memory Storage**: Development simplicity with clear path to database migration via `IStorage` interface abstraction

7. **Professional Design Language**: Modern, trust-focused UI inspired by Linear, Stripe, and Vercel rather than crypto-aesthetic to appeal to HR/recruiting professionals