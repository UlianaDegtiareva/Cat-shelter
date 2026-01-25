import { Controller, Get, Post, Delete, Body, Param, HttpCode, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CatsService } from './cats.service';
import { CreateCatDto } from './dto/create-cat.dto';

@ApiTags('Cats Management')
@Controller('cats')
export class CatsController {
  constructor(private readonly catsService: CatsService) {}

  @Post()
  @ApiOperation({ summary: 'Add a new cat to the shelter' })
  @ApiResponse({ status: 201, description: 'Cat successfully created.' })
  @ApiResponse({ status: 400, description: 'Validation failed.' })
  create(@Body() dto: CreateCatDto) {
    return this.catsService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all cats in the shelter' })
  @ApiResponse({ status: 200, description: 'Return list of cats.' })
  findAll() {
    return this.catsService.findAll();
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Remove a cat from the database' })
  @ApiResponse({ status: 204, description: 'Cat deleted.' })
  @ApiResponse({ status: 400, description: 'Invalid ID format.' })
  @ApiResponse({ status: 404, description: 'Cat not found.' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.catsService.remove(id);
  }
}