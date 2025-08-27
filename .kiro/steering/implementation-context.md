---
inclusion: manual
---

# Implementation Context for Pokédex Tech Test

## Project Overview

This is a technical assessment project that involves extending an existing Pokédex application built with modern full-stack technologies. The project has a 3-hour time constraint and focuses on demonstrating practical development skills, code quality, and best practices.

## Key Project Files and Structure

### Database Layer (`libs/data-access-layer`)
- **Schema Location**: `src/orm/schemas/` - Contains all Drizzle entity definitions
- **Migration Files**: `drizzle-orm/migrations/` - Database migration history
- **Seed Data**: `src/orm/seed/` - Contains pre-built seed files for moves and pokemon-moves
- **Configuration**: `drizzle.config.ts` - Must be updated when adding new schema files

### Shared Types (`libs/shared-types`)
- **View DTOs**: `src/view/` - Response data transfer objects
- **Post DTOs**: `src/post/` - Request data transfer objects
- **Auto-generated**: Uses barrelsby for automatic exports

### API Layer (`apps/api`)
- **Controllers**: `src/app/api/rest/controllers/` - HTTP endpoint handlers
- **Services**: `src/app/api/rest/services/` - Business logic layer
- **Repositories**: `src/app/repositories/` - Data access layer
- **Base Classes**: Extend `BaseRepository` for consistent patterns

### Frontend Layer (`apps/web`)
- **Pages**: `src/app/` - Next.js App Router pages
- **Components**: `src/components/` - Reusable UI components
- **API Hooks**: `src/api/hooks/` - React Query integration
- **UI Library**: Uses shadcn/ui components

## Existing Patterns to Follow

### Database Entity Pattern
```typescript
// Entity definition in libs/data-access-layer/src/orm/schemas/[entity]/[entity].entity.ts
export const entityNameEntity = pgTable('table_name', {
  id: uuid('id').notNull().defaultRandom().primaryKey(),
  // other fields...
});

// Relations in [entity].relations.ts
export const entityNameRelations = relations(entityNameEntity, ({ many, one }) => ({
  // relations...
}));

// Types in [entity].types.ts
export type EntitySelectEntity = typeof entityNameEntity.$inferSelect;
```

### Repository Pattern
```typescript
@Injectable()
export class EntityRepository extends BaseRepository {
  readonly table = entityNameEntity;
  
  constructor(
    protected readonly drizzle: DrizzleProvider,
    protected readonly cls: ClsService<UserStore>,
  ) {
    super(drizzle, cls);
  }
  
  // Custom methods...
}
```

### DTO Pattern
```typescript
export class ViewEntityDto {
  @IsUUID()
  id!: string;
  
  // other fields with validation decorators...
  
  constructor(entity: EntitySelectEntity) {
    if (entity) {
      Object.assign(this, entity);
      // Transform relations if needed...
    }
  }
}
```

### React Query Hook Pattern
```typescript
export function useApiQuery<T>(
  queryKey: string[],
  endpoint: string,
  options?: UseQueryOptions<T>
) {
  return useQuery({
    queryKey,
    queryFn: () => apiClient.get<T>(endpoint).then(res => res.data),
    ...options,
  });
}
```

## Important Commands

### Database Operations
- `pnpm run migrate:local` - Run database migrations
- `pnpm run seed:local` - Seed database with initial data
- `pnpm run barrels` - Generate barrel exports for new files

### Development
- `pnpm run serve:dev` - Start API server
- `pnpm run serve:web` - Start frontend development server
- `docker compose up -d` - Start PostgreSQL database

## Time Management Strategy

Given the 3-hour constraint, prioritize tasks in this order:
1. **Database Schema** (30 minutes) - Foundation for everything else
2. **API Layer** (60 minutes) - Backend functionality and endpoints
3. **Frontend Components** (60 minutes) - UI components and integration
4. **Polish & Testing** (30 minutes) - UX improvements and basic testing

## Quality vs Speed Balance

- **Must Have**: Working functionality that meets core requirements
- **Should Have**: Proper TypeScript types and basic error handling
- **Nice to Have**: Comprehensive testing and advanced UX features
- **Focus Areas**: Code that demonstrates understanding of the existing patterns

## Existing Seed Data

The project includes pre-built seed files:
- `seed-moves.ts` - Contains ~800 Pokémon moves with complete data
- `seed-pokemon-moves.ts` - Contains relationships between Pokémon and moves with levels

These files are ready to use and should be integrated into the main seed script.

## Authentication Context

The application has existing authentication with:
- User context available via `useAuth()` hook
- Admin status will need to be added to user entity
- Authorization middleware exists for protected endpoints

## UI Component Library

The project uses shadcn/ui components:
- `Button`, `Card`, `Modal` components are available
- Consistent styling with Tailwind CSS
- Responsive design patterns already established
- Focus on reusing existing components where possible