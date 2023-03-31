import { IsNumber, IsString, Length } from 'class-validator';

export class UpdateWishDto {
  @IsNumber()
  price: number;
  @IsString()
  @Length(1, 1024)
  description: string;
}
