import { IsEmail, IsNotEmpty, IsString, IsUrl, Length } from 'class-validator';

export class UpdateUserDto {
  @IsEmail()
  email: string;
  @IsNotEmpty()
  password: string;
  @IsString()
  @Length(2, 200)
  about: string;
  @IsUrl()
  avatar: string;
}
