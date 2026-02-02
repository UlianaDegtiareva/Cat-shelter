import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, Min, MinLength, IsOptional, IsNotEmpty } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateCatDto {
  @ApiProperty({ example: 'Barsik', description: 'Name of the cat' })
  // TODO: Добавить валидацию (минимум 2 символа, не пустое)
  // TODO: Реализовать обрезку пробелов через @Transform
  name: string;

  @ApiProperty({ example: 2, description: 'Age of the cat' })
  // TODO: Добавить валидацию типа и минимального значения
  age: number;

  @ApiProperty({ example: 'Siamese', description: 'Breed of the cat' })
  // TODO: Добавить валидацию (не пустое)
  // TODO: Реализовать обрезку пробелов через @Transform
  breed: string;

  @ApiProperty({ example: 'Found in 2024', required: false })
  // TODO: Поле должно быть опциональным
  // TODO: Реализовать обрезку пробелов через @Transform
  history?: string;

  @ApiProperty({ example: 'Very friendly', required: false })
  @IsOptional()
  @IsString()
  // TODO: Реализовать обрезку пробелов через @Transform
  description?: string;
}