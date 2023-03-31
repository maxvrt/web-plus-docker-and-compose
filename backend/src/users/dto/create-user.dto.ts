import { IsEmail, IsNotEmpty, IsString, IsUrl, Length } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @Length(2, 30)
  username: string;
  @IsEmail()
  email: string;
  @IsNotEmpty()
  password: string;
  @IsString()
  @Length(2, 200)
  about: string;
  @IsUrl()
  avatar: string;
  public get emailName() {
    return this.username + this.email;
  }
}
