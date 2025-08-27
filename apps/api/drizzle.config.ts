import * as dotenv from 'dotenv';
import { defineConfig } from 'drizzle-kit';
import { join } from 'path';

const envPath = join(__dirname, `./.env.${process.env.NODE_ENV || 'development'}`);
console.info('Loading .env file from:', envPath);
dotenv.config({ path: envPath });

const basePath = './src/app/orm';

export default defineConfig({
  schema: [
    `${basePath}/abilities/ability.entity.ts`,
    `${basePath}/abilities/ability.relations.ts`,
    `${basePath}/pokemon-abilities/pokemon-ability.entity.ts`,
    `${basePath}/pokemon-abilities/pokemon-ability.relations.ts`,
    `${basePath}/pokemon-types/pokemon-type.entity.ts`,
    `${basePath}/pokemon-types/pokemon-type.relations.ts`,
    `${basePath}/pokemons/pokemon.entity.ts`,
    `${basePath}/pokemons/pokemon.relations.ts`,
    `${basePath}/types/type.entity.ts`,
    `${basePath}/types/type.relations.ts`,
    `${basePath}/users/user.entity.ts`,
    `${basePath}/users/user.relations.ts`,
  ],
  out: './drizzle-orm/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL as string,
  },
});
