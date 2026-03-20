"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComponentModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const component_controller_1 = require("./component.controller");
const component_service_1 = require("./component.service");
const component_entity_1 = require("./component.entity");
let ComponentModule = class ComponentModule {
};
exports.ComponentModule = ComponentModule;
exports.ComponentModule = ComponentModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([component_entity_1.ComponentEntity])],
        controllers: [component_controller_1.ComponentController],
        providers: [component_service_1.ComponentService],
    })
], ComponentModule);
//# sourceMappingURL=component.module.js.map