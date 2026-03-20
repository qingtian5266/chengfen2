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
exports.WechatController = void 0;
const common_1 = require("@nestjs/common");
const wechat_service_1 = require("./wechat.service");
const jwt_guard_1 = require("../../common/guards/jwt.guard");
let WechatController = class WechatController {
    constructor(wechatService) {
        this.wechatService = wechatService;
    }
    async login(dto) {
        return this.wechatService.login(dto);
    }
    async list(dto) {
        return this.wechatService.list(dto);
    }
    async detail(dto) {
        return this.wechatService.detail(dto.id);
    }
    async detailByOpenid(dto) {
        return this.wechatService.detailByOpenid(dto.openid);
    }
};
exports.WechatController = WechatController;
__decorate([
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], WechatController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('list'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtGuard),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], WechatController.prototype, "list", null);
__decorate([
    (0, common_1.Post)('detail'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtGuard),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], WechatController.prototype, "detail", null);
__decorate([
    (0, common_1.Post)('detail-by-openid'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtGuard),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], WechatController.prototype, "detailByOpenid", null);
exports.WechatController = WechatController = __decorate([
    (0, common_1.Controller)('wechat'),
    __metadata("design:paramtypes", [wechat_service_1.WechatService])
], WechatController);
//# sourceMappingURL=wechat.controller.js.map