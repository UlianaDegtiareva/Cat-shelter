import { IsString, MinLength, IsNotEmpty} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreateUserDto {
  @ApiProperty({ 
    example: 'Ivan', 
    description: 'First name of the user/volunteer',
    minLength: 2 
  })
  // TODO: Добавить проверку на строку
  // TODO: Реализовать обрезку пробелов (trim)
  // TODO: Добавить проверку на пустое значение
  // TODO: Установить минимальную длину 2 символа
  readonly firstName: string;

  @ApiProperty({ 
    example: 'Ivanov', 
    description: 'Last name of the user/volunteer',
    minLength: 2 
  })
  // TODO: Добавить валидацию аналогично полю firstName
  readonly lastName: string;
}