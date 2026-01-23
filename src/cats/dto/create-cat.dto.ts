import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, IsOptional, Min, MinLength } from 'class-validator';

export class CreateCatDto {
  @ApiProperty({ 
    example: 'Barsik', 
    description: 'The official name of the cat for registration',
    minLength: 2 
  })
  @IsString()
  @MinLength(2)
  name: string;

  @ApiProperty({ 
    example: 2, 
    description: 'Age of the cat in years',
    minimum: 0 
  })
  @IsInt()
  @Min(0)
  age: number;

  @ApiProperty({ 
    example: 'Siamese', 
    description: 'Breed or closest phenotype' 
  })
  @IsString()
  breed: string;

  @ApiProperty({ 
    example: 'Found in a park during winter 2024', 
    description: 'Background story of how the cat arrived at the shelter',
    required: false 
  })
  @IsOptional()
  @IsString()
  history?: string;
}