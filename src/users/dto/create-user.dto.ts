import { IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ 
    example: 'Ivan', 
    description: 'First name of the user/volunteer',
    minLength: 2 
  })
  @IsString()
  @MinLength(2)
  readonly firstName: string;

  @ApiProperty({ 
    example: 'Ivanov', 
    description: 'Last name of the user/volunteer',
    minLength: 2 
  })
  @IsString()
  @MinLength(2)
  readonly lastName: string;
}