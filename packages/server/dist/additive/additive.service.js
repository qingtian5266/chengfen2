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
exports.AdditiveService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const additive_entity_1 = require("./additive.entity");
let AdditiveService = class AdditiveService {
    constructor(additiveRepository) {
        this.additiveRepository = additiveRepository;
    }
    async list() {
        return this.additiveRepository.find({
            order: { created_at: 'DESC' },
        });
    }
    async create(dto) {
        console.log(555, dto);
        const existing = await this.additiveRepository.findOne({
            where: { nameCn: dto.nameCn },
        });
        if (existing) {
            throw new common_1.ConflictException('中文名称已存在');
        }
        console.log(555, dto);
        const additive = this.additiveRepository.create(dto);
        await this.additiveRepository.save(additive);
        return additive;
    }
    async update(dto) {
        const additive = await this.additiveRepository.findOne({ where: { id: dto.id } });
        if (!additive) {
            throw new common_1.NotFoundException('添加剂不存在');
        }
        const existing = await this.additiveRepository.findOne({
            where: { nameCn: dto.nameCn },
        });
        if (existing && existing.id !== dto.id) {
            throw new common_1.ConflictException('中文名称已存在');
        }
        Object.assign(additive, dto);
        await this.additiveRepository.save(additive);
        return additive;
    }
    async delete(id) {
        const additive = await this.additiveRepository.findOne({ where: { id } });
        if (!additive) {
            throw new common_1.NotFoundException('添加剂不存在');
        }
        await this.additiveRepository.remove(additive);
        return { success: true };
    }
};
exports.AdditiveService = AdditiveService;
exports.AdditiveService = AdditiveService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(additive_entity_1.Additive)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], AdditiveService);
//# sourceMappingURL=additive.service.js.map