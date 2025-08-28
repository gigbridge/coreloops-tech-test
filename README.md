# Pokédex Tech Test

## Submission

### Changes Made

#### Database Updates

- Added a new moves table with schema definitions and migrations.
- Added a join table pokemon_moves for the many-to-many relationship between Pokémon and moves.
- Integrated both move-related seed files into the main seed.ts script.

#### Pokémon Detail Modal

- Added a modal that opens when clicking “View” on a Pokémon card.
- Displays Pokémon details along with a sortable table of moves (by level and power, default: level ascending).

#### Home Page Refactor

- Refactored for improved readability and maintainability.
- Applied React best practices for hooks and component composition.
- Decoupled logic into smaller, reusable parts.

#### Admin-Only Delete

- Extended the users table with an is_admin boolean column (default false).
- Only admin users can see and use the delete button.
- Non-admin users do not see the option at all.

#### Repository & Services

- Updated the Pokémon repository to support fetching with moves, pagination, and deletion.
- Updated the Pokémon service to use the repository for clean data access.
- Added an Admin-only controller endpoint to handle Pokémon deletion securely.

#### General Polish

- Ensured type safety and consistency across components and services.
- Improved overall code clarity and separation of concerns.

### Use of AI

I used AI (ChatGPT) to debug and understand the error I was getting from Drizzle ORM. The error messages were not very clear, and AI helped me identify the root cause and correct schema initialization approach.

### Challenges Faced

The main challenge I faced was with Drizzle ORM schema initialization and seeding.

I initially both schema and relations were combined into a single schema module, but this approach was not supported by Drizzle.
I later realized Drizzle requires everything to be exported from a single schema module and passed in directly.
This unblocked migrations, seeding, and queries.

```ts
// Incorrect
const db = drizzle(process.env.DATABASE_URL, { schema: { ...tablesAndRelations } });
```

```ts
// Correct
const db = drizzle(process.env.DATABASE_URL, { schema });
```