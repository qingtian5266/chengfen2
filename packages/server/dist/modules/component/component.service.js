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
exports.ComponentService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const component_entity_1 = require("./component.entity");
let ComponentService = class ComponentService {
    constructor(componentRepository) {
        this.componentRepository = componentRepository;
    }
    async detail(dto) {
        const { id, name } = dto;
        const component = id
            ? await this.componentRepository.findOne({ where: { id } })
            : await this.componentRepository.findOne({ where: { name: (name || '').trim() } });
        if (!component) {
            throw new common_1.NotFoundException('成分不存在');
        }
        return component;
    }
};
exports.ComponentService = ComponentService;
exports.ComponentService = ComponentService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(component_entity_1.ComponentEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ComponentService);
//# sourceMappingURL=component.service.js.map