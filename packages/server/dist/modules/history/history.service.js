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
exports.HistoryService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_history_entity_1 = require("./user-history.entity");
const product_entity_1 = require("../product/product.entity");
let HistoryService = class HistoryService {
    constructor(historyRepository, productRepository) {
        this.historyRepository = historyRepository;
        this.productRepository = productRepository;
    }
    async list(openid, page = 1, pageSize = 20) {
        const skip = (page - 1) * pageSize;
        const [rows, total] = await this.historyRepository.findAndCount({
            where: { openid },
            order: { updated_at: 'DESC' },
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
                updated_at: row.updated_at,
            }))
                .filter((item) => item.product),
            total,
            page,
            pageSize,
        };
    }
    async delete(openid, id) {
        await this.historyRepository.delete({ openid, id });
        return { success: true };
    }
    async clear(openid) {
        await this.historyRepository.delete({ openid });
        return { success: true };
    }
};
exports.HistoryService = HistoryService;
exports.HistoryService = HistoryService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_history_entity_1.UserHistory)),
    __param(1, (0, typeorm_1.InjectRepository)(product_entity_1.Product)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], HistoryService);
//# sourceMappingURL=history.service.js.map