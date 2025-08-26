import { UserService } from '@coreloops-api/rest/services/user.service';
import { Public } from '@coreloops-api/shared/guards';
import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserSelectEntity } from 'src/app/repositories/users/user.types';

type CredentialsDto = {
  username: string;
  password: string;
};

const JWT_SECRET = process.env.JWT_SECRET_KEY || 'dev_only_change_me';
const BCRYPT_SALT_ROUNDS = Number(process.env.BCRYPT_SALT_ROUNDS ?? 12);

@Controller('auth')
export class AuthController {
  constructor(
    private readonly jwt: JwtService,
    private readonly userService: UserService,
  ) {}

  @Post('sign-in')
  @HttpCode(HttpStatus.OK)
  @Public()
  async signIn(@Body() body: CredentialsDto) {
    const { username, password } = body;
    if (!username || !password) {
      throw new BadRequestException('username and password are required');
    }

    const user = await this.userService.getUserByUsername(username);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user.id, username: user.username };
    const accessToken = await this.jwt.signAsync(payload, {
      expiresIn: '24h',
      secret: JWT_SECRET,
    });

    return { accessToken };
  }

  @Post('sign-up')
  @HttpCode(HttpStatus.CREATED)
  @Public()
  async signUp(@Body() body: CredentialsDto) {
    const { username, password } = body;
    if (!username || !password) {
      throw new BadRequestException('username and password are required');
    }

    const existing = await this.userService.getUserByUsername(username);
    if (existing) {
      throw new ConflictException('Username is already taken');
    }

    const passwordHash = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);

    const created: UserSelectEntity = await this.userService.createUser(username, passwordHash);

    const payload = { sub: created.id, username: created.username };
    const accessToken = await this.jwt.signAsync(payload, {
      expiresIn: '24h',
      secret: JWT_SECRET,
    });

    return { accessToken };
  }
}
