/* eslint-disable @typescript-eslint/no-explicit-any */
import { entitySchema } from '@coreloops-orm/schema';
import {
  abilityEntity,
  pokemonAbilityEntity,
  pokemonEntity,
  pokemonTypeEntity,
  typeEntity,
} from '@coreloops-orm/schemas';
import dotenv from 'dotenv';
import { drizzle, NodePgTransaction } from 'drizzle-orm/node-postgres';
import path from 'node:path';
import { seedAbilities } from './seed-abilities';
import { seedPokemon } from './seed-pokemon';
import { seedPokemonAbilities } from './seed-pokemon-abilities';
import { seedPokemonTypes } from './seed-pokemon-types';
import { seedTypes } from './seed-types';

const nodeEnv = process.env.NODE_ENV || 'development';
dotenv.config({ path: path.resolve(process.cwd(), `.env.${nodeEnv}`) });

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set');
}

const db = drizzle(process.env.DATABASE_URL, { schema: entitySchema });

const BATCH_SIZE = 1000;

function chunk<T>(arr: readonly T[], size = BATCH_SIZE): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

async function insertBatched<T>(
  tx: NodePgTransaction<typeof entitySchema, any>,
  table: any,
  rows: readonly T[],
  mapValues?: (row: T) => any,
) {
  if (!rows.length) return;
  for (const batch of chunk(rows)) {
    const values = mapValues ? batch.map(mapValues) : (batch as any[]);
    try {
      await tx.insert(table).values(values).onConflictDoNothing();
    } catch (e) {
      console.log('error for rows', rows);
      throw e;
    }
  }
}

async function main() {
  console.log(`🌱 Seeding (${nodeEnv})…`);

  await db.transaction(async tx => {
    // 1) Pokemon Types
    console.log(`→ types (${seedTypes.length})`);
    await insertBatched(tx, typeEntity, seedTypes, t => ({
      id: t.id,
      name: t.name,
      iconUrl: t.iconUrl,
    }));

    // 2) Pokemon Abilities
    console.log(`→ abilities (${seedAbilities.length})`);
    await insertBatched(tx, abilityEntity, seedAbilities, a => ({
      id: a.id,
      name: a.name,
      description: a.description,
    }));

    // 3) Pokemon
    console.log(`→ pokemon (${seedPokemon.length})`);
    await insertBatched(tx, pokemonEntity, seedPokemon, p => ({
      id: p.id,
      pokedexNumber: p.pokedexNumber,
      name: p.name,
    }));

    // 4) Pokemon Types
    console.log(`→ pokemon_types (${seedPokemonTypes.length})`);
    await insertBatched(tx, pokemonTypeEntity, seedPokemonTypes, pt => ({
      pokemonId: pt.pokemonId,
      typeId: pt.typeId,
    }));

    // 5) Pokemon Abilities
    console.log(`→ pokemon_abilities (${seedPokemonAbilities.length})`);
    await insertBatched(tx, pokemonAbilityEntity, seedPokemonAbilities, pa => ({
      pokemonId: pa.pokemonId,
      abilityId: pa.abilityId,
      hidden: pa.hidden,
    }));
  });

  console.log('✅ Seeding completed');
}

main().catch((err: unknown) => {
  console.error('❌ Seeding failed:', err);
  process.exit(1);
});
