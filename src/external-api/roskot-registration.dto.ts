import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class RosKotRegistrationDto {
  @ApiProperty({ example: 'Барсик', description: 'Имя кошки' })
  @IsString()
  @MinLength(2)
  name: string;

  @ApiProperty({ example: 'Метис', description: 'Порода кошки' })
  @IsString()
  @MinLength(2)
  breed: string;
}