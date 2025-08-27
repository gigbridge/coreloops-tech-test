# Tech Stack Guidelines

## Frontend Stack

### Next.js Configuration
- Use App Router for new routes and components
- Implement proper server-side rendering where beneficial
- Use proper client/server component boundaries
- Follow Next.js 14+ best practices for performance
- Implement proper SEO optimization

### React Query (TanStack Query)
- Use React Query for all API data fetching
- Implement proper cache invalidation strategies
- Use optimistic updates for better user experience
- Implement proper error handling and retry logic
- Use proper query key management for cache consistency

### UI Components (shadcn/ui)
- Use existing shadcn/ui components where possible
- Follow consistent design system patterns
- Implement proper accessibility features
- Use proper responsive design principles
- Maintain consistent styling and theming

### State Management
- Use React Query for server state management
- Use React hooks (useState, useReducer) for local state
- Avoid global state management unless absolutely necessary
- Implement proper state normalization where needed
- Use proper state lifting and prop drilling patterns

## Backend Stack

### NestJS Architecture
- Follow modular architecture with proper module separation
- Use dependency injection for all service dependencies
- Implement proper middleware for cross-cutting concerns
- Use proper guards for authentication and authorization
- Follow existing controller/service/repository patterns

### Drizzle ORM Usage
- Use Drizzle schema definitions for all database entities
- Implement proper relations and foreign key constraints
- Use proper query builders for complex queries
- Follow existing migration patterns and conventions
- Implement proper seed data management

### Database Design
- Use PostgreSQL as the primary database
- Implement proper indexing strategies for performance
- Use proper transaction management for data consistency
- Follow existing naming conventions for tables and columns
- Implement proper backup and recovery strategies

## Development Tools

### Package Management
- Use pnpm for package management
- Follow workspace configuration for monorepo structure
- Use proper dependency versioning and lock files
- Implement proper dev/prod dependency separation
- Use proper script organization in package.json

### Code Quality Tools
- Use ESLint with existing configuration
- Follow Prettier formatting rules
- Use proper TypeScript configuration
- Implement proper pre-commit hooks
- Use proper code review processes

### Build and Deployment
- Use Nx for build orchestration and caching
- Follow existing build scripts and configurations
- Implement proper environment variable management
- Use proper Docker configuration for containerization
- Follow existing CI/CD pipeline patterns

## API Integration Patterns

### Data Fetching
- Use React Query hooks for all API calls
- Implement proper loading and error states
- Use proper pagination patterns (cursor-based)
- Implement proper data transformation and validation
- Use proper cache management strategies

### Error Handling
- Implement consistent error response handling
- Use proper error boundaries for React components
- Implement proper API error logging and monitoring
- Use proper user-friendly error messages
- Implement proper retry mechanisms for failed requests

### Authentication Flow
- Use existing authentication patterns and contexts
- Implement proper token management and refresh
- Use proper role-based access control
- Implement proper logout and session management
- Follow existing security best practices

## Performance Optimization

### Frontend Optimization
- Implement proper code splitting and lazy loading
- Use React.memo and useMemo for expensive computations
- Optimize bundle sizes and loading performance
- Implement proper image optimization and lazy loading
- Use proper performance monitoring and analytics

### Backend Optimization
- Implement proper database query optimization
- Use appropriate caching strategies (Redis if needed)
- Implement proper API response compression
- Use proper connection pooling and resource management
- Monitor and optimize API response times

### Database Optimization
- Use proper indexing strategies for frequently queried fields
- Implement proper query optimization and analysis
- Use proper connection pooling and management
- Implement proper data archiving and cleanup strategies
- Monitor database performance and resource usage