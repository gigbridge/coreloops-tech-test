import { IsString } from 'class-validator';

export class PostSignInPostDto {
  @IsString()
  username!: string;

  @IsString()
  password!: string;
}
