import { IsString, Length } from 'class-validator';

export class FindUserDto {
  @IsString()
  @Length(2, 100)
  query: string;
}
