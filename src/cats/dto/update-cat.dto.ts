import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, IsBoolean } from 'class-validator';

export class UpdateCatDto {
  @ApiPropertyOptional({ example: 'Barsik', description: 'Updated name of the cat' })
  @IsOptional() @IsString() readonly name?: string;

  @ApiPropertyOptional({ example: 3, description: 'Updated age of the cat' })
  @IsOptional() @IsInt() readonly age?: number;

  @ApiPropertyOptional({ example: 'Siamese', description: 'Updated breed' })
  @IsOptional() @IsString() readonly breed?: string;

  @ApiPropertyOptional({ example: 'Doing well, very active', description: 'Updated health or history notes' })
  @IsOptional() @IsString() readonly history?: string;

}