import { IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  public name: string;

  @IsNumber()
  @IsPositive()
  public quantity: number;

  @IsNotEmpty()
  @IsNumber()
  public expiry: number;
}
