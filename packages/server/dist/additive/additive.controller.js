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
exports.AdditiveController = void 0;
const common_1 = require("@nestjs/common");
const additive_service_1 = require("./additive.service");
const additive_dto_1 = require("./dto/additive.dto");
const public_decorator_1 = require("../common/decorators/public.decorator");
let AdditiveController = class AdditiveController {
    constructor(additiveService) {
        this.additiveService = additiveService;
    }
    async list() {
        return this.additiveService.list();
    }
    async create(dto) {
        return this.additiveService.create(dto);
    }
    async update(dto) {
        return this.additiveService.update(dto);
    }
    async delete(dto) {
        return this.additiveService.delete(dto.id);
    }
};
exports.AdditiveController = AdditiveController;
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('list'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdditiveController.prototype, "list", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('create'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [additive_dto_1.CreateAdditiveDto]),
    __metadata("design:returntype", Promise)
], AdditiveController.prototype, "create", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('update'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [additive_dto_1.UpdateAdditiveDto]),
    __metadata("design:returntype", Promise)
], AdditiveController.prototype, "update", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('delete'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdditiveController.prototype, "delete", null);
exports.AdditiveController = AdditiveController = __decorate([
    (0, common_1.Controller)('additive'),
    __metadata("design:paramtypes", [additive_service_1.AdditiveService])
], AdditiveController);
//# sourceMappingURL=additive.controller.js.map