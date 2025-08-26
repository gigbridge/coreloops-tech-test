# Pokédex Tech Test

Greetings, Trainer! 👋

Professor Oak needs your help to complete his Pokédex.
He’s entrusted you with a Coreloops codebase, but it’s missing some key features.
Your mission is to extend the project, refine it, and prove your skills as a true full-stack Pokémon Master.

---

## Getting Started
### Initial Setup
1. Install dependencies:

    ```
    pnpm install
   ```

2. Run the following command to get the database started:

    ```
    docker compose up -d
    ```

3. Run the following command to migrate the database:

    ```
    pnpm run migrate:local
    ```

4. Run the following command to seed the initial data:

    ```
    pnpm run seed:local
    ```

5. Run the following command to start the server

    ```
    pnpm run serve:dev
    ```

6. Run the following command to start the frontend:

    ```
    pnpm run serve:web
   ```

### Tooling
Our database definitions live in `libs/data-access-layer`. In here we use Drizzle to handle our migrations. When you add a new table to the database, you must run the command `pnpm run barrels` to generate barrel files
and they will be auto imported into the schema. You them also need to add the new files into the `drizzle.config.ts` file.

We have a `libs/shared-types` package that houses our data models, separated by View / Post. Whenever a new file is added in here, you can run the same `pnpm run barrels` command and it will auto generate the barrel files
and you can then import the types into whichever project requires them.

To generate and perform a migration you can use `pnpm run migrate:local`.

## Tasks

Your goal is to complete as many of the following tasks as possible within 3 hours. Don’t worry if you don’t finish them all – we want to see your approach, thought process, and code quality more than a perfectly finished product.
1. Create new database tables
   - Add a table for moves (there is already a seed file located at `libs/data-access-layer/orm/seed/seed-moves.ts`)
   - Add a join table for pokemon_moves (so Pokémon can learn many moves) (there is already a seed file located at `libs/data-access-layer/orm/seed/seed-pokemon-moves.ts`)
   - Add the seed files to the `libs/data-access-layer/orm/seed/seed.ts` script and insert into the database.
2. Pokémon detail modal
   - On the home page, each Pokémon card has a “View” button.
   - When clicked, a modal should appear showing:
     - The Pokémon’s details
     - All the moves it can learn, in a table format
     - The table must:
       - Be sortable by level and move power
       - Default sort: level ascending
3. Refactor Home Page
   - Improve the code structure and readability of the home page.
   - Apply React best practices for state management, hooks, and component composition.
4. Admin-only delete
   - Admin users can delete Pokémon from the database.
   - Non-admin users should not see the delete button at all.
   - Extend the users table with a new column:
```
is_admin boolean DEFAULT false
```

5. Polish
   - Anything else you can do to improve UX, code clarity, or consistency is a bonus.

---

Timebox
•	You have 3 hours to work on this.
•	Get as far as you can – partial progress is fine, we’ll review your approach.

---



Submitting Your Work
1. Clone or fork this repository.
2. Complete the tasks in your fork.
3. Push your finished work to a new GitHub repository and include a fresh readme. The readme should contain the following:
   - A brief description of the changes you've made and why you made them (if applicable)
   - Whether or not AI was used, and for what (using AI is OK, we just want to know how/if you use it)
   - What was challenging about the task, skip this if everything was all good!
4. Email the repo link to:
   - stephen@coreloops.ai
   - gabriel@coreloops.ai
5. Deadline: Thursday 5pm (UK time)

---

Hints from the Professor
•	Use Drizzle ORM migrations for schema changes.
•	The UI is powered with Next.js, React, and shadcn/ui components.
•	Keep your changes modular – imagine the Pokédex will grow with many new features.
•	Bonus points for clean commits, type safety, and solid React patterns.

---

Example Feature Flow
1.	Add moves + pokemon_moves tables.
2.	Update seed data / controllers to expose moves.
3.	On Pokémon card → View → open modal → show table of moves.
4.	Sort the table by clicking headers. (maybe tanstack table??)
5.	Add is_admin to users → show delete button only if true.

---

Closing Words

“Your very own Pokémon legend is about to unfold!
A world of dreams and adventures with code awaits! Let’s go!” -, Professor Oak

Good luck, Trainer, we’re excited to see how you evolve this Pokédex! 🚀
