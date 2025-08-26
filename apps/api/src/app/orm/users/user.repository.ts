import { DrizzleProvider } from '@coreloops-orm/db';
import { userEntity } from '@coreloops-orm/users/user.entity';
import { Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';

@Injectable()
export class UserRepository {
  constructor(private readonly drizzle: DrizzleProvider) {}

  async getUserByUsername(username: string) {
    return this.drizzle.db.query.userEntity.findFirst({
      where: eq(userEntity.username, username),
    });
  }

  async createUser(username: string, password: string) {
    const [inserted] = await this.drizzle.db
      .insert(userEntity)
      .values({
        username,
        password,
      })
      .returning();

    return inserted;
  }
}
