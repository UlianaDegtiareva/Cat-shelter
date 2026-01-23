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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateCatSchema = void 0;
const swagger_1 = require("@nestjs/swagger");
class CreateCatSchema {
}
exports.CreateCatSchema = CreateCatSchema;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Tom', description: 'The name of the cat' }),
    __metadata("design:type", String)
], CreateCatSchema.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 2, description: 'The age of the cat' }),
    __metadata("design:type", Number)
], CreateCatSchema.prototype, "age", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Persian', description: 'The breed of the cat' }),
    __metadata("design:type", String)
], CreateCatSchema.prototype, "breed", void 0);
//# sourceMappingURL=create-cat.schema.js.map