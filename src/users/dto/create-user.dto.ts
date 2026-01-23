import { IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'Иван' })
  @IsString()
  @MinLength(2)
  readonly firstName: string;

  @ApiProperty({ example: 'Иванов' })
  @IsString()
  @MinLength(2)
  readonly lastName: string;
}