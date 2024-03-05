import { IsString, IsNotEmpty, IsNumber, IsPositive, IsDate } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  public name: string;

  @IsNumber()
  @IsPositive()
  public quantity: number;

  @IsNotEmpty()
  @IsDate()
  public expiry: Date;
}
