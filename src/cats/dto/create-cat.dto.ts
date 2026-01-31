import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, Min, MinLength, IsOptional } from 'class-validator';

export class CreateCatDto {
  @ApiProperty({ example: 'Barsik', description: 'Name of the cat' })
  @IsString()
  @MinLength(2)
  name: string;

  @ApiProperty({ example: 2, description: 'Age of the cat' })
  @IsInt()
  @Min(0)
  age: number;

  @ApiProperty({ example: 'Siamese', description: 'Breed of the cat' })
  @IsString()
  breed: string;

  @ApiProperty({ example: 'Found in 2024', required: false })
  @IsOptional()
  @IsString()
  history?: string;

  @ApiProperty({ example: 'Very friendly', required: false })
  @IsOptional()
  @IsString()
  description?: string;
}