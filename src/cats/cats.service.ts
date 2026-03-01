import { Injectable, NotFoundException, BadRequestException, ConflictException, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CatEntity } from './entities/cat.entity';
import { CreateCatDto } from './dto/create-cat.dto';
import { UpdateCatDto } from './dto/update-cat.dto';
import { UserEntity } from 'src/users/entities/user.entity';
import { Equal } from 'typeorm';
import { HealthCard } from './entities/health-card.entity';
import { CreateHealthCardDto } from './dto/create-health-card.dto';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom } from 'rxjs';
import { RosKotRegistrationDto } from 'src/external-api/roskot-registration.dto';


@Injectable()
export class CatsService {
  constructor(
    @InjectRepository(CatEntity)
    private readonly catRepository: Repository<CatEntity>,
    private readonly httpService: HttpService,     // Для HTTP запросов
    private readonly configService: ConfigService, // Для чтения .env
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(HealthCard)
    private readonly healthCardRepo: Repository<HealthCard>,
  ) {}

  async findAll(breed?: string, isAdopted?: string, isKitten?: string): Promise<CatEntity[]> {
    const query = this.catRepository
      .createQueryBuilder('cat')
      .leftJoinAndSelect('cat.owner', 'owner')
      .leftJoinAndSelect('cat.healthCard', 'healthCard');
    if (breed) {
      query.andWhere('cat.breed = :breed', { breed });
    }
    if (isAdopted !== undefined) {
      query.andWhere('cat.isAdopted = :isAdopted', { 
        isAdopted: isAdopted === 'true' 
      });
    }
    if (isKitten === 'true') {
      query.andWhere('cat.age < :age', { age: 1 });
    }
    return query.getMany();
  }

  async create(dto: CreateCatDto): Promise<CatEntity> {
    const existing = await this.catRepository.findOneBy({ name: dto.name });
    if (existing) throw new ConflictException(`Имя ${dto.name} уже занято`);
    
    const newCat = this.catRepository.create(dto);
    return this.catRepository.save(newCat);
  }

  async findOne(id: number): Promise<CatEntity> {
    const cat = await this.catRepository.findOne({ 
      where: { id },
      relations: ['owner', 'healthCard']
    });
    if (!cat) throw new NotFoundException(`Кошка с id ${id} не найдена`);
    return cat;
  }

  async update(id: number, dto: UpdateCatDto): Promise<CatEntity> {
    const cat = await this.catRepository.preload({
      id: id,
      ...dto,
    });

    if (!cat) {
      throw new NotFoundException(`Cat with ID ${id} not found`);
    }

    if (dto.name) {
      const existing = await this.catRepository.findOneBy({ name: dto.name });
      if (existing && existing.id !== id) {
        throw new ConflictException(`Name "${dto.name}" is already taken`);
      }
    }

    await this.catRepository.save(cat);

    return this.findOne(id);
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

  async createHealthCard(catId: number, dto: CreateHealthCardDto) {
    // Исправили catsRepository -> catRepository
    const cat = await this.catRepository.findOne({ 
      where: { id: catId }, 
      relations: ['healthCard'] 
    });
    
    if (!cat) throw new NotFoundException('Кошка не найдена');
    if (cat.healthCard) throw new ConflictException('У этой кошки уже есть медкарта');
  
    const card = this.healthCardRepo.create({
      ...dto,
      cat: cat
    });
    
    return await this.healthCardRepo.save(card);
  }

  async updateHealthCard(catId: number, dto: Partial<CreateHealthCardDto>) {
    const card = await this.healthCardRepo.findOne({ where: { cat: { id: catId } } });
    if (!card) throw new NotFoundException('Медкарта для этой кошки не найдена');
  
    Object.assign(card, dto);
    return await this.healthCardRepo.save(card);
  }

  async chipCat(id: number) {
    // 1. Ищем кошку в нашей базе
    const cat = await this.catRepository.findOneBy({ id });
    if (!cat) throw new NotFoundException('Cat not found');
    if (cat.chipCode) throw new BadRequestException('The cat is already microchipped');
  
    // 2. Берем настройки из .env
    const apiUrl = this.configService.get('ROSKOT_API_URL');
    const apiKey = this.configService.get('ROSKOT_API_KEY');
  
    try {
      const payload: RosKotRegistrationDto = {
        name: cat.name || 'Без имени',
        breed: cat.breed || 'Метис',
      };
      
      // 3. Делаем запрос к имитатору
      const response = await lastValueFrom(
        this.httpService.post(
          `${apiUrl}/register-chip`, 
          payload, // Передаем подготовленный объект
          { 
            headers: { 
              'x-api-key': apiKey,
              'Content-Type': 'application/json', // Явно указываем тип контента
            },
            timeout: 5000 
          }
        )
      );
  
      cat.chipCode = response.data.chipId;
      return await this.catRepository.save(cat);
  
    } catch (error) {
      const status = error.response?.status || 500;
      throw new HttpException(
        `RosKotMonitoring Error: ${error.response?.data?.message || error.message}`, 
        status
      );
    }
  }
}