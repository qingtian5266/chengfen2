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
exports.SearchService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const product_entity_1 = require("../product/product.entity");
const component_entity_1 = require("../component/component.entity");
let SearchService = class SearchService {
    constructor(productRepository, componentRepository) {
        this.productRepository = productRepository;
        this.componentRepository = componentRepository;
    }
    async suggest(keyword) {
        const q = (keyword || '').trim();
        if (!q) {
            return [];
        }
        const [products, components] = await Promise.all([
            this.productRepository.find({
                select: ['name'],
                where: { name: (0, typeorm_2.Like)(`%${q}%`) },
                take: 5,
            }),
            this.componentRepository.find({
                select: ['name'],
                where: { name: (0, typeorm_2.Like)(`%${q}%`) },
                take: 5,
            }),
        ]);
        return Array.from(new Set([...products.map((item) => item.name), ...components.map((item) => item.name)]));
    }
    async query(keyword) {
        const q = (keyword || '').trim();
        if (!q) {
            return {
                products: [],
                components: [],
            };
        }
        const [products, components] = await Promise.all([
            this.productRepository.find({
                where: [{ name: (0, typeorm_2.Like)(`%${q}%`) }, { brand: (0, typeorm_2.Like)(`%${q}%`) }, { barcode: (0, typeorm_2.Like)(`%${q}%`) }],
                order: { created_at: 'DESC' },
                take: 30,
            }),
            this.componentRepository.find({
                where: { name: (0, typeorm_2.Like)(`%${q}%`) },
                take: 30,
            }),
        ]);
        return {
            products,
            components,
        };
    }
};
exports.SearchService = SearchService;
exports.SearchService = SearchService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(product_entity_1.Product)),
    __param(1, (0, typeorm_1.InjectRepository)(component_entity_1.ComponentEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], SearchService);
//# sourceMappingURL=search.service.js.map