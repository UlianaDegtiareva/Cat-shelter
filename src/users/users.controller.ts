import { Controller, Get, Post, Body, Param, Delete, ParseIntPipe, HttpCode, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserEntity } from './entities/user.entity';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Users Management')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post()
  @ApiOperation({ summary: 'Create new user/volunteer' })
  @ApiResponse({ status: 201, description: 'User successfully created.' })
  @ApiResponse({ status: 400, description: 'Validation failed' })
  @ApiResponse({ status: 401, description: 'Not authorized: No token provided or token invalid.' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get()
  @ApiOperation({ summary: 'List all users', description: 'Returns a list of all registered users.' })
  @ApiResponse({ status: 401, description: 'Not authorized: No token provided or token invalid.' })
  findAll() {
    return this.usersService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get(':id')
  @ApiOperation({ 
    summary: 'Get user profile', 
    description: 'Retrieves user details and the list of cats they have adopted.' 
  })
  @ApiResponse({ status: 200, description: 'User found.' })
  @ApiResponse({ status: 400, description: 'Invalid ID format provided.' })
  @ApiResponse({ status: 401, description: 'Not authorized: No token provided or token invalid.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get(':id/cats')
  @ApiOperation({ 
    summary: 'Get all cats adopted by a specific user',
    description: 'Returns user profile with the list of their adopted cats.' 
  })
  @ApiParam({ name: 'id', description: 'User ID', example: 1 })
  @ApiResponse({ status: 200, description: 'Success', type: UserEntity })
  @ApiResponse({ status: 400, description: 'Invalid ID' })
  @ApiResponse({ status: 401, description: 'Not authorized: No token provided or token invalid.' })
  @ApiResponse({ status: 404, description: 'User not found' })
  getUserCats(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findUserCats(id);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ 
    summary: 'Delete user profile', 
    description: 'Permanently removes a user. Note: Associated cats will remain in the system but will become ownerless (SET NULL).' 
  })
  @ApiParam({ name: 'id', description: 'User ID to delete', example: 1 })
  @ApiResponse({ status: 204, description: 'User deleted successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid ID' })
  @ApiResponse({ status: 401, description: 'Not authorized: No token provided or token invalid.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.remove(id);
  }
}