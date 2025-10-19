# FATS AMEX API - AI Agent Instructions

## Architecture Overview
This is a Node.js/Express.js REST API using Prisma ORM with SQL Server. The application manages asset tracking and inventory for FATS (Fixed Asset Tracking System) and WBS (Work Breakdown Structure) modules.

**Key Components:**
- **Controllers** (`src/controllers/`): Handle business logic with static class methods
- **Routes** (`src/routes/`): Define API endpoints with authentication middleware
- **Schemas** (`src/schemas/`): Joi validation for request/response data
- **Prisma Models** (`prisma/schema/`): Database schema using Prisma's schema folder feature
- **Workers** (`src/workers/`): Background job processing with BullMQ and Redis
- **Services** (`src/services/`): Business logic and external integrations

## Critical Developer Workflows

### Database Management
```bash
# Generate Prisma client after schema changes
pnpm run prisma:generate

# Push schema changes to database (development only)
pnpm run prisma:push

# Seed database with initial data
pnpm run seed
```

### Development Server
```bash
# Start development server with auto-reload
pnpm run dev

# Start background workers
pnpm run workers
```

### Testing
```bash
# Run Jest tests
pnpm run test
```

### Production Deployment
- Uses PM2 for process management
- Jenkins pipeline handles deployment with environment file copying
- Sentry integration for error monitoring and source maps

## Project-Specific Patterns

### Authentication & Authorization
- JWT-based auth with separate access/refresh tokens
- `verifyAccessToken` middleware for protected routes
- User roles: "fats", "wbs", "admin"
- Token payload includes: `userId`, `name`, `email`, `deptcode`

### Request Validation
- Joi schemas in `src/schemas/` validate all incoming requests
- Controllers validate input before processing
- Custom `MyError` class for consistent error responses

### Database Operations
- Single Prisma client instance exported from `src/utils/prismaClient.js`
- Models use PascalCase naming (e.g., `User`, `AssetCapture`)
- Complex queries include related data with `include` option
- SQL Server as database provider

### File Uploads
- Static file serving from `/uploads` directory
- Multer middleware for file handling
- File size limits configured in `config.js`

### Background Processing
- BullMQ queues with Redis connection
- Workers in `src/workers/` process jobs asynchronously
- Queue configuration in `src/config/queue.js`

### API Structure
- Base path: `/api/v1`
- RESTful endpoints with CRUD operations
- Swagger documentation at `/api-docs`
- Socket.io integration for real-time features

### Error Handling
- Centralized error middleware in `src/middlewares/error.js`
- Custom error responses with status codes
- Sentry integration for production monitoring

## Key Files to Reference
- `src/app.js`: Main application setup and middleware configuration
- `src/routes.js`: Route aggregation and mounting
- `prisma/schema/schema.prisma`: Database configuration
- `src/controllers/user.js`: Authentication and user management example
- `src/middlewares/auth.js`: JWT token verification patterns
- `src/schemas/user.schema.js`: Request validation patterns
- `src/config/config.js`: Environment configuration
- `package.json`: Scripts and dependencies

## Development Conventions
- ES modules throughout (import/export)
- Async/await for all database operations
- Consistent response format using `src/utils/response.js`
- Environment variables for configuration
- Separate development/production environments</content>
<parameter name="filePath">/Users/wasimzaman/Wasim/coding/--Node/Nartec/fats_amex_api/.github/copilot-instructions.md