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
exports.CollectService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_collect_entity_1 = require("./user-collect.entity");
const product_entity_1 = require("../product/product.entity");
let CollectService = class CollectService {
    constructor(collectRepository, productRepository) {
        this.collectRepository = collectRepository;
        this.productRepository = productRepository;
    }
    async create(openid, productId) {
        const product = await this.productRepository.findOne({ where: { id: productId } });
        if (!product) {
            throw new common_1.NotFoundException('产品不存在');
        }
        const existing = await this.collectRepository.findOne({
            where: { openid, product_id: productId },
        });
        if (existing) {
            return { success: true, collected: true };
        }
        const record = this.collectRepository.create({
            openid,
            product_id: productId,
        });
        await this.collectRepository.save(record);
        return { success: true, collected: true };
    }
    async cancel(openid, productId) {
        await this.collectRepository.delete({
            openid,
            product_id: productId,
        });
        return { success: true, collected: false };
    }
    async list(openid, page = 1, pageSize = 20) {
        const skip = (page - 1) * pageSize;
        const [rows, total] = await this.collectRepository.findAndCount({
            where: { openid },
            order: { created_at: 'DESC' },
            skip,
            take: pageSize,
        });
        const productIds = rows.map((item) => item.product_id);
        const products = productIds.length
            ? await this.productRepository.find({ where: { id: (0, typeorm_2.In)(productIds) } })
            : [];
        const productMap = new Map(products.map((item) => [item.id, item]));
        return {
            list: rows
                .map((row) => ({
                id: row.id,
                product: productMap.get(row.product_id) || null,
                created_at: row.created_at,
            }))
                .filter((item) => item.product),
            total,
            page,
            pageSize,
        };
    }
};
exports.CollectService = CollectService;
exports.CollectService = CollectService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_collect_entity_1.UserCollect)),
    __param(1, (0, typeorm_1.InjectRepository)(product_entity_1.Product)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], CollectService);
//# sourceMappingURL=collect.service.js.map