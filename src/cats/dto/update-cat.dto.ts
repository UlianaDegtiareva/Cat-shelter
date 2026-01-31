import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Min, MinLength, IsNotEmpty } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateCatDto {
  @ApiPropertyOptional({ example: 'Barsik' })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  @IsNotEmpty()
  @MinLength(2)
  readonly name?: string;

  @ApiPropertyOptional({ example: 3 })
  @IsOptional()
  @IsInt()
  @Min(0)
  readonly age?: number;

  @ApiPropertyOptional({ example: 'Siamese' })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  @IsNotEmpty()
  readonly breed?: string;

  @ApiPropertyOptional({ example: 'Healthy and active' })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  readonly history?: string;

  @ApiPropertyOptional({ example: 'Loves playing with balls' })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  readonly description?: string;
}