"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdditiveModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const additive_entity_1 = require("./additive.entity");
const additive_controller_1 = require("./additive.controller");
const additive_service_1 = require("./additive.service");
let AdditiveModule = class AdditiveModule {
};
exports.AdditiveModule = AdditiveModule;
exports.AdditiveModule = AdditiveModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([additive_entity_1.Additive])],
        controllers: [additive_controller_1.AdditiveController],
        providers: [additive_service_1.AdditiveService],
        exports: [additive_service_1.AdditiveService],
    })
], AdditiveModule);
//# sourceMappingURL=additive.module.js.map