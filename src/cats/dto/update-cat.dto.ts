import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Min, MinLength, IsNotEmpty } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateCatDto {
  @ApiPropertyOptional({ example: 'Barsik', description: 'Updated name' })
  @IsOptional()
  @IsString()
  // TODO: Добавить декоратор @MinLength(2)
  // TODO: Добавить @IsNotEmpty (если поле передано, оно не должно быть пустым)
  readonly name?: string;

  @ApiPropertyOptional({ example: 3, description: 'Updated age' })
  // TODO: Добавить @IsOptional, @IsInt и @Min(0)
  readonly age?: number;

  @ApiPropertyOptional({ example: 'Siamese', description: 'Updated breed' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  readonly breed?: string;

  // Поля history и description остаются опциональными строками
  @ApiPropertyOptional({ description: 'Updated history' })
  @IsOptional()
  @IsString()
  readonly history?: string;

  @ApiPropertyOptional({ description: 'Updated description' })
  @IsOptional()
  @IsString()
  readonly description?: string;
}