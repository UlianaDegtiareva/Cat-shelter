import { Controller, Get, Post, Body, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserEntity } from './entities/user.entity';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

@ApiTags('Users Management')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Create new user/volunteer' })
  @ApiResponse({ status: 201, description: 'User successfully created.' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @ApiOperation({ summary: 'List all users', description: 'Returns a list of all registered users.' })
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ 
    summary: 'Get user profile', 
    description: 'Retrieves user details and the list of cats they have adopted.' 
  })
  @ApiResponse({ status: 200, description: 'User found.' })
  @ApiResponse({ status: 400, description: 'Invalid ID format provided.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne(id);
  }

  @Get(':id/cats')
  @ApiOperation({ 
    summary: 'Get all cats adopted by a specific user',
    description: 'Returns user profile with the list of their adopted cats.' 
  })
  @ApiParam({ name: 'id', description: 'User ID', example: 1 })
  @ApiResponse({ status: 200, description: 'Success', type: UserEntity })
  @ApiResponse({ status: 404, description: 'User not found' })
  getUserCats(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findUserCats(id);
  }

  @Delete(':id')
  @ApiOperation({ 
    summary: 'Delete user profile', 
    description: 'Permanently removes a user. Note: Associated cats will remain in the system but will become ownerless (SET NULL).' 
  })
  @ApiParam({ name: 'id', description: 'User ID to delete', example: 1 })
  @ApiResponse({ status: 204, description: 'User deleted successfully.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.remove(id);
  }
}