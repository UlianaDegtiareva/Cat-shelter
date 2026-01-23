import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    create(createUserDto: CreateUserDto): Promise<import("./entities/user.entity").UserEntity>;
    findAll(): Promise<import("./entities/user.entity").UserEntity[]>;
    findOne(id: number): Promise<import("./entities/user.entity").UserEntity>;
    remove(id: number): Promise<void>;
}
