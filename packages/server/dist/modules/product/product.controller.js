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
exports.ProductController = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const product_service_1 = require("./product.service");
let ProductController = class ProductController {
    constructor(productService, jwtService) {
        this.productService = productService;
        this.jwtService = jwtService;
    }
    async barcode(dto) {
        return this.productService.byBarcode(dto.barcode);
    }
    async detail(dto, req) {
        const openid = await this.extractOpenid(req);
        return this.productService.detail(dto.id, openid);
    }
    async extractOpenid(req) {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return undefined;
        }
        const token = authHeader.slice(7);
        try {
            const payload = await this.jwtService.verifyAsync(token);
            return payload.openid;
        }
        catch {
            return undefined;
        }
    }
};
exports.ProductController = ProductController;
__decorate([
    (0, common_1.Post)('barcode'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "barcode", null);
__decorate([
    (0, common_1.Post)('detail'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "detail", null);
exports.ProductController = ProductController = __decorate([
    (0, common_1.Controller)('product'),
    __metadata("design:paramtypes", [product_service_1.ProductService,
        jwt_1.JwtService])
], ProductController);
//# sourceMappingURL=product.controller.js.map