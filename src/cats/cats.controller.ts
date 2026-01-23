import { Controller, Get, Post, Patch, Delete, Body, Param, HttpCode, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiParam, ApiResponse, ApiBody } from '@nestjs/swagger';
import { CatsService } from './cats.service';
import { CreateCatDto } from './dto/create-cat.dto';
import { UpdateCatDto } from './dto/update-cat.dto';
import { ParseIntPipe } from '../common/pipes/parse-int.pipe';

@ApiTags('cats')
@Controller('cats')
export class CatsController {
  constructor(private readonly catsService: CatsService) {}

  @Post()
  @ApiOperation({ summary: 'Добавить новую кошку' })
  create(@Body() dto: CreateCatDto) {
    return this.catsService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Список всех кошек с фильтрацией' })
  @ApiQuery({ name: 'breed', required: false, description: 'Фильтр по породе' })
  @ApiQuery({ name: 'isAdopted', required: false, description: 'Фильтр по статусу (true/false)' })
  findAll(
    @Query('breed') breed?: string,
    @Query('isAdopted') isAdopted?: string,
  ) {
    return this.catsService.findAll(breed, isAdopted);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Детальная информация о кошке' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.catsService.findOne(id);
  }

  @Patch(':id/adopt')
  @ApiOperation({ summary: 'Усыновить кошку (закрепить за пользователем)' })
  @ApiParam({ name: 'id', description: 'ID кошки' })
  @ApiBody({ 
    schema: { 
      type: 'object', 
      properties: { 
        userId: { type: 'number', example: 1 } 
      } 
    } 
  })
  adopt(
    @Param('id', ParseIntPipe) catId: number,
    @Body('userId', ParseIntPipe) userId: number,
  ) {
    return this.catsService.adopt(catId, userId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Обновить данные кошки' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateCatDto) {
    return this.catsService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Удалить кошку из базы' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.catsService.remove(id);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Получить всех кошек, усыновленных конкретным пользователем' })
  @ApiParam({ name: 'userId', description: 'ID владельца' })
  findByUser(@Param('userId', ParseIntPipe) userId: number) {
    return this.catsService.findAdoptedByUser(userId);
  }
}