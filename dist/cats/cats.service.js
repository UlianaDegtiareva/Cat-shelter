"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CatsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const cat_entity_1 = require("./entities/cat.entity");
const user_entity_1 = require("../users/entities/user.entity");
let CatsService = class CatsService {
    constructor(catRepository, userRepository) {
        this.catRepository = catRepository;
        this.userRepository = userRepository;
    }
    async findAll(breed, isAdopted) {
        const where = {};
        if (breed)
            where.breed = breed;
        if (isAdopted !== undefined)
            where.isAdopted = isAdopted === 'true';
        return this.catRepository.find({
            where,
            relations: ['owner']
        });
    }
    async create(dto) {
        const existing = await this.catRepository.findOneBy({ name: dto.name });
        if (existing)
            throw new common_1.ConflictException(`Имя ${dto.name} уже занято`);
        const newCat = this.catRepository.create(dto);
        return this.catRepository.save(newCat);
    }
    async findOne(id) {
        const cat = await this.catRepository.findOneBy({ id });
        if (!cat)
            throw new common_1.NotFoundException(`Кошка с id ${id} не найдена`);
        return cat;
    }
    async update(id, dto) {
        const cat = await this.findOne(id);
        Object.assign(cat, dto);
        return this.catRepository.save(cat);
    }
    async remove(id) {
        const cat = await this.catRepository.findOneBy({ id });
        if (!cat) {
            throw new common_1.NotFoundException(`Кошка с id=${id} не найдена, удаление невозможно.`);
        }
        await this.catRepository.remove(cat);
    }
    async adopt(catId, userId) {
        const cat = await this.catRepository.findOneBy({ id: catId });
        const user = await this.userRepository.findOneBy({ id: userId });
        if (!cat)
            throw new common_1.NotFoundException('Кошка не найдена');
        if (!user)
            throw new common_1.NotFoundException('Пользователь не найден');
        if (cat.isAdopted)
            throw new common_1.BadRequestException('Эту кошку уже забрали');
        cat.owner = user;
        cat.isAdopted = true;
        cat.adoptionDate = new Date();
        return this.catRepository.save(cat);
    }
    async findAdoptedByUser(userId) {
        return this.catRepository.find({
            where: {
                owner: { id: userId },
                isAdopted: true
            },
            order: { adoptionDate: 'DESC' }
        });
    }
};
exports.CatsService = CatsService;
exports.CatsService = CatsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(cat_entity_1.CatEntity)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.UserEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], CatsService);
//# sourceMappingURL=cats.service.js.map