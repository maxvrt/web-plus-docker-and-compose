import { IsString, Length } from 'class-validator';

export class LoginDto {
  @Length(2, 100)
  @IsString()
  username: string;
  @Length(2, 100)
  @IsString()
  password: string;
}
