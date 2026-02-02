import { Controller, Get, Post, Patch, Delete, Body, Param, HttpCode, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiParam, ApiResponse, ApiBody } from '@nestjs/swagger';
import { CatsService } from './cats.service';
import { CreateCatDto } from './dto/create-cat.dto';
import { UpdateCatDto } from './dto/update-cat.dto';
import { ParseIntPipe } from '../common/pipes/parse-int.pipe';

@ApiTags('Cats Management')
@Controller('cats')
export class CatsController {
  constructor(private readonly catsService: CatsService) {}

  @Post()
  @ApiOperation({ 
    summary: 'Register a new cat', 
    description: 'Creates a new cat record in the database. The name must be unique to avoid identification errors.' 
  })
  @ApiResponse({ status: 201, description: 'The cat has been successfully registered.' })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  @ApiResponse({ status: 409, description: 'Conflict: A cat with this name already exists.' })
  create(@Body() dto: CreateCatDto) {
    return this.catsService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update cat information' })
  // TODO: Описать ответы (200, 400, 404, 409) согласно Contract Specification в ТЗ
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateCatDto) {
    // TODO: Реализовать вызов сервиса
  }

  @Get()
  @ApiOperation({ summary: 'Search shelter database' })
  // TODO: Добавить декораторы @ApiQuery для 'breed' и 'isAdopted'
  // TODO: Описать ответ 200 согласно ТЗ
  findAll(@Query('breed') breed?: string, @Query('isAdopted') isAdopted?: string) {
    // TODO: Реализовать передачу фильтров в сервис
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get cat details' })
  // TODO: Описать ответы (200, 400, 404) согласно ТЗ
  findOne(@Param('id', ParseIntPipe) id: number) {
    // TODO: Реализовать получение кошки
  }

  @Patch(':id/adopt')
  @ApiOperation({ summary: 'Process adoption' })
  // TODO: Описать тело запроса (userId) через @ApiBody
  // TODO: Описать ответы (200, 400, 404) согласно ТЗ
  adopt(@Param('id', ParseIntPipe) catId: number, @Body('userId', ParseIntPipe) userId: number) {
    // TODO: Реализовать логику усыновления через сервис
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Remove cat from system', description: 'Permanently deletes a cat record from the database.' })
  @ApiResponse({ status: 204, description: 'Record deleted successfully.' })
  @ApiResponse ({ status: 400, description: 'Invalid ID format. Expected an integer.'})
  @ApiResponse({ status: 404, description: 'Cat not found, cannot delete.' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.catsService.remove(id);
  }
}