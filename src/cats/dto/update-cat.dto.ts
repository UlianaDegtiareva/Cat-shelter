import { ApiPropertyOptional } from '@nestjs/swagger';
// TODO: Импортировать валидаторы: IsInt, IsOptional, IsString, Min, MinLength, IsNotEmpty
// TODO: Импортировать Transform из class-transformer

export class UpdateCatDto {
  @ApiPropertyOptional({ example: 'Barsik' })
  // TODO: Сделать поле опциональным
  // TODO: Если передано: строка, не пустая, минимум 2 символа, trim
  readonly name?: string;

  @ApiPropertyOptional({ example: 3 })
  // TODO: Сделать поле опциональным
  // TODO: Если передано: целое число, минимум 0
  readonly age?: number;

  @ApiPropertyOptional({ example: 'Siamese' })
  // TODO: Сделать поле опциональным
  // TODO: Если передано: строка, не пустая, trim
  readonly breed?: string;

  @ApiPropertyOptional({ example: 'Healthy and active' })
  // TODO: Сделать поле опциональным
  // TODO: Если передано: строка, trim
  readonly history?: string;

  @ApiPropertyOptional({ example: 'Loves playing with balls' })
  // TODO: Сделать поле опциональным
  // TODO: Если передано: строка, trim
  readonly description?: string;
}