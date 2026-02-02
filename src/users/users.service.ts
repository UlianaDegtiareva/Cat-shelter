import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  // TODO: Реализовать метод create

  // TODO: Реализовать метод findAll

  // TODO: Реализовать метод findOne с обработкой 404

  // TODO: Реализовать метод remove

  async findUserCats(userId: number): Promise<UserEntity> {
    // TODO: Найти пользователя по ID и подгрузить его кошек через relations
    // TODO: Обработать 404 ошибку
    return null;
  }
}