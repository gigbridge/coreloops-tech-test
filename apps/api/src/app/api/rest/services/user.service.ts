import { UserRepository } from '@coreloops-repos/users/user.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  constructor(private readonly userRepo: UserRepository) {}

  async getUserByUsername(username: string) {
    return this.userRepo.getUserByUsername(username);
  }

  async createUser(username: string, password: string) {
    return this.userRepo.createUser(username, password);
  }
}
