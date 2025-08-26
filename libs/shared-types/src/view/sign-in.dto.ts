import { IsString } from 'class-validator';

export class ViewSignInDto {
  @IsString()
  accessToken!: string;
}
