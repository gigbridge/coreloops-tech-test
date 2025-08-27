# Pokédex Tech Test - Complete Specification

## Overview

This document provides a comprehensive specification for completing the Pokédex Tech Test, a 3-hour technical assessment that involves extending an existing full-stack Pokémon application with new features including move management, detailed views, improved architecture, and admin functionality.

## Project Context

### Technology Stack
- **Backend**: NestJS with TypeScript
- **Frontend**: Next.js 14+ with React and TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **UI**: shadcn/ui components with Tailwind CSS
- **State Management**: React Query (TanStack Query)
- **Build System**: Nx monorepo with pnpm

### Existing Architecture
The project follows a modular monorepo structure:
- `apps/api` - NestJS backend application
- `apps/web` - Next.js frontend application
- `libs/data-access-layer` - Drizzle ORM schemas and database logic
- `libs/shared-types` - Shared TypeScript types and DTOs

## Requirements Analysis

### 1. Database Schema Enhancement
**Objective**: Create new tables for moves and pokemon-moves relationships

**Technical Requirements**:
- Create `moves` table with fields: id, name, accuracy, damageClass, power, pp, typeId
- Create `pokemon_moves` join table with fields: pokemonId, moveId, level
- Establish proper foreign key relationships
- Integrate existing seed data (provided in seed files)

**Acceptance Criteria**:
- Tables created with proper Drizzle schema definitions
- Foreign key constraints properly established
- Seed data successfully populated
- Barrel files automatically generated

### 2. Pokémon Detail Modal
**Objective**: Display detailed Pokémon information with sortable moves table

**Technical Requirements**:
- Modal component with Pokémon details and moves
- Sortable table by level (default) and move power
- Integration with existing UI component library
- Proper state management and API integration

**Acceptance Criteria**:
- Modal opens when "View" button clicked
- Moves displayed in sortable table format
- Default sort by level ascending
- Proper modal close functionality

### 3. Home Page Refactoring
**Objective**: Improve code structure following React best practices

**Technical Requirements**:
- Component composition and separation of concerns
- Proper state management with React hooks
- Performance optimization with memoization
- Maintainable and readable code structure

**Acceptance Criteria**:
- Components properly separated and composed
- State management follows React best practices
- Code demonstrates improved maintainability
- Performance optimizations implemented

### 4. Admin-Only Delete Functionality
**Objective**: Add admin role and delete capabilities

**Technical Requirements**:
- Extend user table with `is_admin` boolean field
- Conditional UI rendering based on admin status
- Secure delete API endpoint with authorization
- Proper error handling and user feedback

**Acceptance Criteria**:
- Admin field added to user schema
- Delete buttons only visible to admin users
- Delete functionality works securely
- UI updates properly after deletion

### 5. User Experience Polish
**Objective**: Enhance overall application UX and consistency

**Technical Requirements**:
- Consistent loading states and error handling
- Responsive design across devices
- Smooth transitions and interactions
- User-friendly feedback and messaging

**Acceptance Criteria**:
- Loading states properly implemented
- Error messages user-friendly
- Responsive design maintained
- Smooth user interactions

## Technical Design

### Database Schema Design

```sql
-- Moves table
CREATE TABLE moves (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    accuracy INTEGER,
    damage_class TEXT NOT NULL,
    power INTEGER,
    pp INTEGER NOT NULL,
    type_id UUID NOT NULL REFERENCES types(id)
);

-- Pokemon moves junction table
CREATE TABLE pokemon_moves (
    pokemon_id UUID NOT NULL REFERENCES pokemons(id),
    move_id UUID NOT NULL REFERENCES moves(id),
    level INTEGER NOT NULL,
    PRIMARY KEY (pokemon_id, move_id)
);

-- Enhanced users table
ALTER TABLE poke_users ADD COLUMN is_admin BOOLEAN DEFAULT FALSE;
```

### API Endpoints Design

```typescript
// New endpoints to implement
GET /pokemon/:id          // Get pokemon with moves
DELETE /pokemon/:id       // Delete pokemon (admin only)

// Enhanced response types
interface PokemonWithMovesResponse {
  id: string;
  name: string;
  pokedexNumber: number;
  types: TypeDto[];
  abilities: AbilityDto[];
  moves: PokemonMoveDto[];
}

interface PokemonMoveDto {
  id: string;
  name: string;
  level: number;
  power: number | null;
  accuracy: number | null;
  damageClass: string;
  type: TypeDto;
}
```

### Component Architecture

```typescript
// Component hierarchy
HomePage
├── PokemonGrid
│   ├── PokemonCard (refactored)
│   │   ├── PokemonImage
│   │   ├── PokemonTypes
│   │   └── PokemonActions
│   └── LoadingSkeletons
├── PokemonDetailModal
│   ├── PokemonInfo
│   ├── MovesTable
│   │   ├── SortableHeader
│   │   └── MoveRow
│   └── ModalControls
└── InfiniteScrollSentinel
```

## Implementation Strategy

### Phase 1: Database Foundation (30 minutes)
1. Create move and pokemon-move entities with Drizzle
2. Set up proper relations and foreign keys
3. Update configuration and run migrations
4. Integrate seed data and test database setup

### Phase 2: API Layer Development (60 minutes)
1. Create move repository with query methods
2. Enhance pokemon repository with moves data
3. Implement service layer with business logic
4. Add API endpoints with proper validation
5. Implement admin authorization for delete

### Phase 3: Frontend Implementation (60 minutes)
1. Refactor home page with component composition
2. Create pokemon detail modal with moves table
3. Implement sortable table functionality
4. Add admin-conditional delete buttons
5. Integrate API calls with React Query

### Phase 4: Polish and Testing (30 minutes)
1. Add comprehensive error handling
2. Implement loading states and user feedback
3. Ensure responsive design
4. Add basic testing for critical paths
5. Final UX improvements and bug fixes

## Quality Assurance

### Code Quality Standards
- TypeScript strict mode with proper typing
- ESLint and Prettier configuration compliance
- Consistent naming conventions and patterns
- Proper error handling and validation
- Component composition and reusability

### Testing Strategy
- Unit tests for repository and service methods
- Component tests for UI functionality
- Integration tests for API endpoints
- End-to-end tests for critical user flows
- Minimum 80% code coverage for new code

### Performance Considerations
- Efficient database queries with proper joins
- React Query caching and optimization
- Component memoization where appropriate
- Lazy loading for modal components
- Proper bundle size management

## Success Criteria

### Functional Requirements
- ✅ Database tables created and populated
- ✅ Pokemon detail modal with sortable moves
- ✅ Refactored home page with better structure
- ✅ Admin-only delete functionality
- ✅ Enhanced user experience and polish

### Technical Requirements
- ✅ Follows existing code patterns and conventions
- ✅ Proper TypeScript typing throughout
- ✅ Responsive design maintained
- ✅ Error handling and loading states
- ✅ Security best practices implemented

### Code Quality Requirements
- ✅ Clean, readable, and maintainable code
- ✅ Proper component composition
- ✅ Efficient state management
- ✅ Consistent styling and UX
- ✅ Basic test coverage for new features

## Deliverables

1. **Database Schema**: New tables with proper relationships and seed data
2. **API Endpoints**: Enhanced pokemon endpoints with moves data and delete functionality
3. **Frontend Components**: Refactored home page and new modal component
4. **Documentation**: Updated README with changes and implementation notes
5. **Tests**: Basic test coverage for new functionality

## Time Management Tips

- **Focus on MVP first**: Get basic functionality working before adding polish
- **Leverage existing patterns**: Follow established code patterns for consistency
- **Use provided seed data**: Don't spend time creating test data
- **Prioritize core features**: Ensure main requirements work before adding extras
- **Test incrementally**: Verify each piece works before moving to the next

This specification provides a comprehensive roadmap for successfully completing the Pokédex Tech Test within the 3-hour timeframe while demonstrating strong technical skills and adherence to best practices.