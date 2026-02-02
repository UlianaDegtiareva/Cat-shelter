import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CatEntity } from './entities/cat.entity';
import { CreateCatDto } from './dto/create-cat.dto';
import { UpdateCatDto } from './dto/update-cat.dto';
import { UserEntity } from 'src/users/entities/user.entity';
import { Equal } from 'typeorm';

@Injectable()
export class CatsService {
  constructor(
    @InjectRepository(CatEntity)
    private readonly catRepository: Repository<CatEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async findAll(breed?: string, isAdopted?: string): Promise<CatEntity[]> {
    // TODO: Сформировать объект 'where' для фильтрации по породе и статусу
    // TODO: Настроить подгрузку владельца через relations
    return [];
  }

  async create(dto: CreateCatDto): Promise<CatEntity> {
    const existing = await this.catRepository.findOneBy({ name: dto.name });
    if (existing) throw new ConflictException(`Имя ${dto.name} уже занято`);
    
    const newCat = this.catRepository.create(dto);
    return this.catRepository.save(newCat);
  }

  async findOne(id: number): Promise<CatEntity> {
    // TODO: Найти кошку по ID с подгрузкой владельца (relations)
    // TODO: Обработать ошибку 404
    return null;
  }

  async update(id: number, dto: UpdateCatDto): Promise<CatEntity> {
    // TODO: Использовать preload для обновления данных
    // TODO: Реализовать проверку на уникальность имени (ConflictException 409)
    return null;
  }

  async remove(id: number): Promise<void> {
    const cat = await this.catRepository.findOneBy({ id });
    
    if (!cat) {
      throw new NotFoundException(`Кошка с id=${id} не найдена, удаление невозможно.`);
    }

    await this.catRepository.remove(cat);
  }

  // Логика усыновления
  async adopt(catId: number, userId: number): Promise<CatEntity> {
    // TODO: Найти кошку и пользователя. Если кто-то не найден — 404.
    // TODO: Проверить, не усыновлена ли уже кошка — 400 (BadRequestException).
    // TODO: Установить owner, isAdopted = true и текущую дату.
    // TODO: Сохранить и вернуть результат.
    return null;
  }
}