import { Injectable, OnModuleInit } from '@nestjs/common';
import { NodePgDatabase, drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { schema } from './schema';

export type DrizzleDb = NodePgDatabase<typeof schema>;

@Injectable()
export class DrizzleProvider implements OnModuleInit {
  db!: DrizzleDb;

  async onModuleInit() {
    const client = new Pool({
      connectionString: process.env.DATABASE_URL,
    });

    await client.connect();
    this.db = drizzle({ client, schema });
  }
}
