"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CollectModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const collect_controller_1 = require("./collect.controller");
const collect_service_1 = require("./collect.service");
const user_collect_entity_1 = require("./user-collect.entity");
const product_entity_1 = require("../product/product.entity");
let CollectModule = class CollectModule {
};
exports.CollectModule = CollectModule;
exports.CollectModule = CollectModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([user_collect_entity_1.UserCollect, product_entity_1.Product])],
        controllers: [collect_controller_1.CollectController],
        providers: [collect_service_1.CollectService],
    })
], CollectModule);
//# sourceMappingURL=collect.module.js.map