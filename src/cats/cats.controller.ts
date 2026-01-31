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
  @ApiOperation({ 
    summary: 'Update cat information', 
    description: 'Updates specific fields like name, breed, or history. System fields (isAdopted) should not be modified here.' 
  })
  @ApiParam({ name: 'id', description: 'Unique numerical ID of the cat' })
  @ApiResponse({ status: 200, description: 'Cat info updated successfully.' })
  @ApiResponse({ status: 404, description: 'Cat not found.' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateCatDto) {
    return this.catsService.update(id, dto);
  }

  @Get()
  @ApiOperation({ 
    summary: 'Search shelter database', 
    description: 'Returns a list of all cats. Supports filtering by breed and adoption status.' 
  })
  @ApiQuery({ name: 'breed', required: false, description: 'Filter cats by specific breed' })
  @ApiQuery({ name: 'isAdopted', required: false, description: 'Filter by adoption status (true/false)' })
  findAll(@Query('breed') breed?: string, @Query('isAdopted') isAdopted?: string) {
    return this.catsService.findAll(breed, isAdopted);
  }

  @Get(':id')
  @ApiOperation({ 
    summary: 'Get cat details', 
    description: 'Returns full information about a specific cat, including history and owner details if adopted.' 
  })
  @ApiParam({ name: 'id', description: 'Unique numerical ID of the cat' })
  @ApiResponse({ status: 200, description: 'Cat data retrieved successfully.' })
  @ApiResponse ({ status: 400, description: 'Invalid ID format. Expected an integer.'})
  @ApiResponse({ status: 404, description: 'Cat not found.' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.catsService.findOne(id);
  }

  @Patch(':id/adopt')
  @ApiOperation({ 
    summary: 'Process adoption', 
    description: 'Links a cat to a specific user. Sets adoption status to true and records the current timestamp.' 
  })
  @ApiBody({ 
    schema: { type: 'object', properties: { userId: { type: 'number', description: 'Internal ID of the adopter' } } } 
  })
  @ApiResponse({ status: 200, description: 'Adoption process completed.' })
  @ApiResponse({ status: 400, description: 'Cat is already adopted or invalid user ID.' })
  @ApiResponse({ status: 404, description: 'Cat or User not found.' })
  adopt(@Param('id', ParseIntPipe) catId: number, @Body('userId', ParseIntPipe) userId: number) {
    return this.catsService.adopt(catId, userId);
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