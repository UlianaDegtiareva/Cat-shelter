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
    const where: any = {};
    
    if (breed) where.breed = breed;
    if (isAdopted !== undefined) where.isAdopted = isAdopted === 'true';

    return this.catRepository.find({ 
      where, 
      relations: ['owner'] // Чтобы в ответе видеть данные хозяина
    });
  }

  async create(dto: CreateCatDto): Promise<CatEntity> {
    const existing = await this.catRepository.findOneBy({ name: dto.name });
    if (existing) throw new ConflictException(`Имя ${dto.name} уже занято`);
    
    const newCat = this.catRepository.create(dto);
    return this.catRepository.save(newCat);
  }

  // findAll(): Promise<CatEntity[]> {
  //   return this.catRepository.find();
  // }

  async findOne(id: number): Promise<CatEntity> {
    const cat = await this.catRepository.findOneBy({ id });
    if (!cat) throw new NotFoundException(`Кошка с id ${id} не найдена`);
    return cat;
  }

  async update(id: number, dto: UpdateCatDto): Promise<CatEntity> {
    const cat = await this.findOne(id);
    Object.assign(cat, dto);
    return this.catRepository.save(cat);
  }

  async remove(id: number): Promise<void> {
    // Сначала ищем кошку, чтобы убедиться, что она существует
    const cat = await this.catRepository.findOneBy({ id });
    
    if (!cat) {
      throw new NotFoundException(`Кошка с id=${id} не найдена, удаление невозможно.`);
    }

    // Удаляем запись из базы данных навсегда
    await this.catRepository.remove(cat);
  }

  // Логика усыновления
  async adopt(catId: number, userId: number): Promise<CatEntity> {
    const cat = await this.catRepository.findOneBy({ id: catId });
    const user = await this.userRepository.findOneBy({ id: userId });

    if (!cat) throw new NotFoundException('Кошка не найдена');
    if (!user) throw new NotFoundException('Пользователь не найден');
    if (cat.isAdopted) throw new BadRequestException('Эту кошку уже забрали');

    cat.owner = user;
    cat.isAdopted = true;
    cat.adoptionDate = new Date();

    return this.catRepository.save(cat);
  }

  async findAdoptedByUser(userId: number): Promise<CatEntity[]> {
    return this.catRepository.find({
      where: {
        owner: { id: userId },
        isAdopted: true
      },
      order: { adoptionDate: 'DESC' }
    });
  }
}