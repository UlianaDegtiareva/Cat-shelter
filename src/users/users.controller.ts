import { Controller, Get, Post, Body, Param, Delete, ParseIntPipe, HttpCode } from '@nestjs/common';
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
  // TODO: Описать ответы (201, 400) согласно Contract Specification
  create(@Body() createUserDto: CreateUserDto) {
    // TODO: Реализовать создание через сервис
  }

  @Get()
  @ApiOperation({ summary: 'List all users' })
  // TODO: Описать ответ 200
  findAll() {
    // TODO: Реализовать получение списка
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user profile' })
  // TODO: Описать ответы (200, 400, 404)
  findOne(@Param('id', ParseIntPipe) id: number) {
    // TODO: Реализовать получение профиля
  }

  @Get(':id/cats')
  @ApiOperation({ summary: 'Get all cats adopted by user' })
  @ApiParam({ name: 'id', description: 'User ID' })
  // TODO: Описать ответы (200, 400, 404)
  getUserCats(@Param('id', ParseIntPipe) id: number) {
    // TODO: Вызвать метод findUserCats в сервисе
  }

  @Delete(':id')
  // TODO: Установить HTTP статус-код 204
  @ApiOperation({ summary: 'Delete user profile' })
  // TODO: Описать ответы (204, 400, 404)
  remove(@Param('id', ParseIntPipe) id: number) {
    // TODO: Реализовать удаление через сервис
  }
}