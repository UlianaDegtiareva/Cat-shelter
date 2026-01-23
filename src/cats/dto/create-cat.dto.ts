import { IsString, IsInt, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCatDto {
  @ApiProperty({ example: 'Барсик' }) @IsString() name: string;
  @ApiProperty({ example: 2 }) @IsInt() age: number;
  @ApiProperty({ example: 'Сиамский' }) @IsString() breed: string;
  @ApiProperty({ example: 'Найден на улице в 2024 году' }) @IsOptional() @IsString() history?: string;
}