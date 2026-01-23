import { Repository } from 'typeorm';
import { CatEntity } from './entities/cat.entity';
import { CreateCatDto } from './dto/create-cat.dto';
import { UpdateCatDto } from './dto/update-cat.dto';
import { UserEntity } from 'src/users/entities/user.entity';
export declare class CatsService {
    private readonly catRepository;
    private readonly userRepository;
    constructor(catRepository: Repository<CatEntity>, userRepository: Repository<UserEntity>);
    findAll(breed?: string, isAdopted?: string): Promise<CatEntity[]>;
    create(dto: CreateCatDto): Promise<CatEntity>;
    findOne(id: number): Promise<CatEntity>;
    update(id: number, dto: UpdateCatDto): Promise<CatEntity>;
    remove(id: number): Promise<void>;
    adopt(catId: number, userId: number): Promise<CatEntity>;
    findAdoptedByUser(userId: number): Promise<CatEntity[]>;
}
