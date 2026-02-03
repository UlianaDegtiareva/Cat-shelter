import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ 
    example: 'vanya_pro', 
    description: 'The unique username of the account' 
  })
  @IsString()
  @IsNotEmpty({ message: 'Login is required' })
  readonly login: string;

  @ApiProperty({ 
    example: 'password123', 
    description: 'The account password' 
  })
  @IsString()
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  readonly password: string;
}