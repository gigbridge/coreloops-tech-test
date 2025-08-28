# Pokédex Tech Test

## Submission

### Changes Made

#### Database Updates

- Added a new `moves` table with schema definitions and migrations.
- Added a join table `pokemon_moves` to support many-to-many relationships between Pokémon and their moves.
- Updated the seeding process to include both moves and Pokémon moves by integrating the existing seed files into `libs/data-access-layer/orm/seed/seed.ts`.

#### Pokémon Detail Modal

- Implemented a modal on the home page that opens when the “View” button is clicked.
- The modal displays detailed information about a Pokémon, including a sortable table of moves.
- Sorting is enabled by level and power, with the default sort set to level ascending.

#### Home Page Refactor

- Improved the code structure for readability and maintainability.
- Applied React best practices for hooks, and component composition.
- Decoupled the home page so it is readable and easier to manage.

#### Admin-Only Delete

- Extended the `users` table with a new `is_admin` boolean column (default `false`).
- Admin users can see and use the delete button on Pokémon cards.
- Non-admin users do not see the delete option at all.

#### General Polish

- Ensured type safety and consistency where possible.

### Use of AI

I used AI to help debug and understand the error I was getting from Drizzle ORM. The error messages were not very clear, and AI helped me figure out why the issue was happening and how to correctly initialize Drizzle with schema and relations.

### Challenges Faced

The main challenge I faced was with Drizzle ORM schema initialization and Seeding.

Initially, I attempted to combine schema and relations during setup like this:

```ts
const db = drizzle(process.env.DATABASE_URL, { schema: { ...tablesAndRelations } });
```

However, Drizzle doesn’t support this approach. The correct method is to export everything from a single schema module and initialize with:

```ts
const db = drizzle(process.env.DATABASE_URL, { schema });
```

This clarification unblocked me and allowed me to properly run migrations, seeds, and queries.