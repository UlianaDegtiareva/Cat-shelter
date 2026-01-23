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
exports.CatsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const cats_service_1 = require("./cats.service");
const create_cat_dto_1 = require("./dto/create-cat.dto");
const update_cat_dto_1 = require("./dto/update-cat.dto");
const parse_int_pipe_1 = require("../common/pipes/parse-int.pipe");
let CatsController = class CatsController {
    constructor(catsService) {
        this.catsService = catsService;
    }
    create(dto) {
        return this.catsService.create(dto);
    }
    findAll(breed, isAdopted) {
        return this.catsService.findAll(breed, isAdopted);
    }
    findOne(id) {
        return this.catsService.findOne(id);
    }
    adopt(catId, userId) {
        return this.catsService.adopt(catId, userId);
    }
    update(id, dto) {
        return this.catsService.update(id, dto);
    }
    remove(id) {
        return this.catsService.remove(id);
    }
    findByUser(userId) {
        return this.catsService.findAdoptedByUser(userId);
    }
};
exports.CatsController = CatsController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Добавить новую кошку' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_cat_dto_1.CreateCatDto]),
    __metadata("design:returntype", void 0)
], CatsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Список всех кошек с фильтрацией' }),
    (0, swagger_1.ApiQuery)({ name: 'breed', required: false, description: 'Фильтр по породе' }),
    (0, swagger_1.ApiQuery)({ name: 'isAdopted', required: false, description: 'Фильтр по статусу (true/false)' }),
    __param(0, (0, common_1.Query)('breed')),
    __param(1, (0, common_1.Query)('isAdopted')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], CatsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Детальная информация о кошке' }),
    __param(0, (0, common_1.Param)('id', parse_int_pipe_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], CatsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id/adopt'),
    (0, swagger_1.ApiOperation)({ summary: 'Усыновить кошку (закрепить за пользователем)' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'ID кошки' }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                userId: { type: 'number', example: 1 }
            }
        }
    }),
    __param(0, (0, common_1.Param)('id', parse_int_pipe_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)('userId', parse_int_pipe_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", void 0)
], CatsController.prototype, "adopt", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Обновить данные кошки' }),
    __param(0, (0, common_1.Param)('id', parse_int_pipe_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_cat_dto_1.UpdateCatDto]),
    __metadata("design:returntype", void 0)
], CatsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(204),
    (0, swagger_1.ApiOperation)({ summary: 'Удалить кошку из базы' }),
    __param(0, (0, common_1.Param)('id', parse_int_pipe_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], CatsController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)('user/:userId'),
    (0, swagger_1.ApiOperation)({ summary: 'Получить всех кошек, усыновленных конкретным пользователем' }),
    (0, swagger_1.ApiParam)({ name: 'userId', description: 'ID владельца' }),
    __param(0, (0, common_1.Param)('userId', parse_int_pipe_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], CatsController.prototype, "findByUser", null);
exports.CatsController = CatsController = __decorate([
    (0, swagger_1.ApiTags)('cats'),
    (0, common_1.Controller)('cats'),
    __metadata("design:paramtypes", [cats_service_1.CatsService])
], CatsController);
//# sourceMappingURL=cats.controller.js.map