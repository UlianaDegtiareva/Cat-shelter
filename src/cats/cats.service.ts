import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CatEntity } from './entities/cat.entity';
import { CreateCatDto } from './dto/create-cat.dto';
import { UpdateCatDto } from './dto/update-cat.dto';

@Injectable()
export class CatsService {
  constructor(
    @InjectRepository(CatEntity)
    private readonly catRepository: Repository<CatEntity>,
  ) {}

  async create(dto: CreateCatDto) {
    // TODO: Проверить уникальность имени (ошибка 409 ConflictException)
    // TODO: Создать экземпляр сущности и сохранить в БД
  }

  findAll() {
    // TODO: Вернуть массив всех кошек из базы
  }

  async findOne(id: number) {
    // TODO: Найти кошку по ID. Если не найдена — выбросить NotFoundException (404)
  }

  async remove(id: number) {
    // TODO: Проверить существование по ID. Если нет — 404.
    // TODO: Удалить запись из базы данных
  }
}