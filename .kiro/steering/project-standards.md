# Project Standards and Guidelines

## Code Quality Standards

### TypeScript Best Practices
- Use strict TypeScript configuration with proper type definitions
- Prefer interfaces over types for object shapes
- Use proper generic constraints and utility types
- Implement proper error handling with typed exceptions
- Follow consistent naming conventions (camelCase for variables, PascalCase for classes)

### React Best Practices
- Use functional components with hooks over class components
- Implement proper component composition and prop drilling avoidance
- Use React.memo for performance optimization where appropriate
- Follow the single responsibility principle for components
- Implement proper error boundaries for error handling

### NestJS Best Practices
- Follow dependency injection patterns consistently
- Use proper decorators for validation and transformation
- Implement proper exception filters and guards
- Follow modular architecture with clear separation of concerns
- Use proper logging and monitoring practices

## Database Standards

### Drizzle ORM Patterns
- Follow existing entity naming conventions (entityName + "Entity")
- Use proper relation definitions with foreign key constraints
- Implement proper indexing for performance optimization
- Follow migration best practices with rollback capabilities
- Use proper seed data validation and error handling

### Schema Design
- Use UUID primary keys for all entities
- Implement proper foreign key relationships
- Use appropriate data types and constraints
- Follow consistent naming conventions for tables and columns
- Implement proper audit trails where necessary

## API Design Standards

### RESTful API Conventions
- Use proper HTTP methods and status codes
- Implement consistent error response formats
- Follow proper pagination patterns (cursor-based)
- Use proper request/response validation
- Implement proper authentication and authorization

### Response Formats
- Use consistent DTO patterns for data transformation
- Implement proper serialization and validation
- Follow existing Connection pattern for paginated responses
- Use proper error message formatting
- Implement proper API versioning strategies

## Testing Standards

### Unit Testing
- Achieve minimum 80% code coverage for new code
- Use proper mocking strategies for dependencies
- Follow AAA pattern (Arrange, Act, Assert)
- Write descriptive test names and documentation
- Implement proper test data factories

### Integration Testing
- Test complete user workflows end-to-end
- Use proper test database setup and teardown
- Implement proper API contract testing
- Test error scenarios and edge cases
- Use proper test environment configuration

## Performance Standards

### Frontend Performance
- Implement proper code splitting and lazy loading
- Use React Query for efficient data fetching and caching
- Optimize bundle sizes and loading times
- Implement proper image optimization
- Use proper performance monitoring

### Backend Performance
- Implement proper database query optimization
- Use appropriate caching strategies
- Monitor API response times and throughput
- Implement proper rate limiting and throttling
- Use proper connection pooling and resource management

## Security Standards

### Authentication & Authorization
- Implement proper JWT token handling
- Use secure session management
- Implement proper role-based access control
- Follow OWASP security guidelines
- Use proper input validation and sanitization

### Data Protection
- Implement proper data encryption at rest and in transit
- Use secure password hashing algorithms
- Implement proper audit logging
- Follow GDPR compliance requirements where applicable
- Use proper error message sanitization to prevent information leakage