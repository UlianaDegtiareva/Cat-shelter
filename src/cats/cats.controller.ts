import { Controller, Get, Post, Patch, Delete, Body, Param, HttpCode, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';
import { CatsService } from './cats.service';
import { CreateCatDto } from './dto/create-cat.dto';
import { UpdateCatDto } from './dto/update-cat.dto';

@ApiTags('Cats Management')
@Controller('cats')
export class CatsController {
  constructor(private readonly catsService: CatsService) {}

  @Post()
  @ApiOperation({ 
    summary: 'Register a new cat', 
    description: 'Creates a new cat record in the database. The name must be unique.' 
  })
  // TODO: Реализовать согласно Contract Specification (Responses: 201, 400, 409)
  create(@Body() dto: CreateCatDto) {
    // TODO: Вызвать метод создания в сервисе
  }

  @Get()
  @ApiOperation({ summary: 'Get all cats in the shelter' })
  // TODO: Реализовать согласно Contract Specification (Response: 200)
  findAll() {
    // TODO: Получить список всех кошек
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get cat details by ID' })
  @ApiParam({ name: 'id', description: 'Unique numerical ID', example: 1 })
  // TODO: Реализовать согласно Contract Specification (Responses: 200, 400, 404)
  findOne(@Param('id', ParseIntPipe) id: number) {
    // TODO: Получить данные одной кошки
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove a cat from the database' })
  @ApiParam({ name: 'id', description: 'Unique numerical ID', example: 1 })
  // TODO: Установить верный HTTP статус-код для успешного удаления
  // TODO: Реализовать согласно Contract Specification (Responses: 204, 400, 404)
  remove(@Param('id', ParseIntPipe) id: number) {
    // TODO: Удалить запись через сервис
  }
}