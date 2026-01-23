import { IsInt, IsOptional, IsString, IsBoolean } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateCatDto {
  @ApiPropertyOptional({ example: 'Барсик' })
  @IsOptional()
  @IsString()
  readonly name?: string;

  @ApiPropertyOptional({ example: 3 })
  @IsOptional()
  @IsInt()
  readonly age?: number;

  @ApiPropertyOptional({ example: 'Сиамская' })
  @IsOptional()
  @IsString()
  readonly breed?: string;

  @ApiPropertyOptional({ example: 'Найден в парке, был очень напуган' })
  @IsOptional()
  @IsString()
  readonly history?: string;

  @ApiPropertyOptional({ example: 'Ласковый, любит играть' })
  @IsOptional()
  @IsString()
  readonly description?: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  readonly isAdopted?: boolean;
}