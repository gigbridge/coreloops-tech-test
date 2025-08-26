import { UserStore } from '@coreloops-api/shared/contexts';
import { DrizzleProvider } from '@coreloops-orm/db';
import { HttpException, Logger } from '@nestjs/common';
import { count, SQL } from 'drizzle-orm';
import { PgTable } from 'drizzle-orm/pg-core';
import { ClsService } from 'nestjs-cls';

export abstract class BaseRepository {
  protected readonly logger: Logger;
  abstract readonly table: PgTable;
  protected constructor(
    protected readonly drizzle: DrizzleProvider,
    protected readonly cls: ClsService<UserStore>,
  ) {
    this.logger = new Logger(this.constructor.name);
  }

  async getCount(filter?: SQL) {
    const query = this.drizzle.db
      .select({
        count: count(),
      })
      .from(this.table);

    const rows = await (filter ? query.where(filter) : query);

    return rows[0].count;
  }

  protected get currentUser() {
    const user = this.cls.get('user');
    if (!user) {
      throw new HttpException('User not found', 404);
    }

    return user;
  }
}
