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
exports.ProductService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const product_entity_1 = require("./product.entity");
const product_component_entity_1 = require("./product-component.entity");
const component_entity_1 = require("../component/component.entity");
const user_collect_entity_1 = require("../collect/user-collect.entity");
const user_history_entity_1 = require("../history/user-history.entity");
let ProductService = class ProductService {
    constructor(productRepository, productComponentRepository, componentRepository, collectRepository, historyRepository) {
        this.productRepository = productRepository;
        this.productComponentRepository = productComponentRepository;
        this.componentRepository = componentRepository;
        this.collectRepository = collectRepository;
        this.historyRepository = historyRepository;
    }
    async byBarcode(barcode) {
        const code = (barcode || '').trim();
        if (!code) {
            return null;
        }
        const product = await this.productRepository.findOne({ where: { barcode: code } });
        if (!product) {
            return null;
        }
        return {
            id: product.id,
            name: product.name,
            brand: product.brand,
            barcode: product.barcode,
            category: product.category,
            risk_level: product.risk_level,
        };
    }
    async detail(id, openid) {
        const product = await this.productRepository.findOne({ where: { id } });
        if (!product) {
            throw new common_1.NotFoundException('产品不存在');
        }
        const links = await this.productComponentRepository.find({
            where: { product_id: id },
            order: { sort_order: 'ASC' },
        });
        const componentIds = links.map((item) => item.component_id);
        const components = componentIds.length
            ? await this.componentRepository.find({ where: { id: (0, typeorm_2.In)(componentIds) } })
            : [];
        const componentMap = new Map(components.map((item) => [item.id, item]));
        const orderedComponents = links
            .map((item) => componentMap.get(item.component_id))
            .filter(Boolean)
            .map((item) => ({
            id: item.id,
            name: item.name,
            risk_level: item.risk_level,
            description: item.description,
        }));
        let isCollected = false;
        if (openid) {
            const collect = await this.collectRepository.findOne({ where: { openid, product_id: id } });
            isCollected = Boolean(collect);
            await this.recordHistory(openid, id);
        }
        return {
            ...product,
            components: orderedComponents,
            isCollected,
        };
    }
    async recordHistory(openid, productId) {
        const existing = await this.historyRepository.findOne({
            where: { openid, product_id: productId },
        });
        if (existing) {
            existing.updated_at = new Date();
            await this.historyRepository.save(existing);
            return;
        }
        const history = this.historyRepository.create({
            openid,
            product_id: productId,
        });
        await this.historyRepository.save(history);
    }
};
exports.ProductService = ProductService;
exports.ProductService = ProductService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(product_entity_1.Product)),
    __param(1, (0, typeorm_1.InjectRepository)(product_component_entity_1.ProductComponent)),
    __param(2, (0, typeorm_1.InjectRepository)(component_entity_1.ComponentEntity)),
    __param(3, (0, typeorm_1.InjectRepository)(user_collect_entity_1.UserCollect)),
    __param(4, (0, typeorm_1.InjectRepository)(user_history_entity_1.UserHistory)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], ProductService);
//# sourceMappingURL=product.service.js.map