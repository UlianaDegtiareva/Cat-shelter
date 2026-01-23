import { CatsService } from './cats.service';
import { CreateCatDto } from './dto/create-cat.dto';
import { UpdateCatDto } from './dto/update-cat.dto';
export declare class CatsController {
    private readonly catsService;
    constructor(catsService: CatsService);
    create(dto: CreateCatDto): Promise<import("./entities/cat.entity").CatEntity>;
    findAll(breed?: string, isAdopted?: string): Promise<import("./entities/cat.entity").CatEntity[]>;
    findOne(id: number): Promise<import("./entities/cat.entity").CatEntity>;
    adopt(catId: number, userId: number): Promise<import("./entities/cat.entity").CatEntity>;
    update(id: number, dto: UpdateCatDto): Promise<import("./entities/cat.entity").CatEntity>;
    remove(id: number): Promise<void>;
    findByUser(userId: number): Promise<import("./entities/cat.entity").CatEntity[]>;
}
