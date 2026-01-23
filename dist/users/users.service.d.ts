import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
export declare class UsersService {
    private readonly userRepository;
    constructor(userRepository: Repository<UserEntity>);
    create(dto: CreateUserDto): Promise<UserEntity>;
    findAll(): Promise<UserEntity[]>;
    findOne(id: number): Promise<UserEntity>;
    remove(id: number): Promise<void>;
}
