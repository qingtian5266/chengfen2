"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyzeService = void 0;
const common_1 = require("@nestjs/common");
let AnalyzeService = class AnalyzeService {
    constructor() {
        this.ruleMap = {
            防腐剂: 'medium',
            香精: 'medium',
            苯甲酸钠: 'medium',
            亚硝酸钠: 'high',
            糖精钠: 'high',
            水: 'low',
            甘油: 'low',
            维生素c: 'low',
        };
    }
    async analyzeComponents(dto) {
        const components = (dto.components || []).map((item) => item.trim()).filter(Boolean);
        const analyzed = components.map((name) => {
            const lower = name.toLowerCase();
            const direct = this.ruleMap[name] || this.ruleMap[lower] || 'medium';
            return {
                name,
                risk_level: direct,
                reason: this.reasonByRisk(direct),
            };
        });
        const summary = analyzed.reduce((acc, item) => {
            acc[item.risk_level] += 1;
            return acc;
        }, { low: 0, medium: 0, high: 0 });
        return {
            category: dto.category || 'food',
            summary,
            list: analyzed,
        };
    }
    reasonByRisk(risk) {
        if (risk === 'high') {
            return '存在较高风险，请结合摄入频率谨慎使用';
        }
        if (risk === 'medium') {
            return '存在争议或需控制使用量';
        }
        return '常见安全成分，正常使用风险较低';
    }
};
exports.AnalyzeService = AnalyzeService;
exports.AnalyzeService = AnalyzeService = __decorate([
    (0, common_1.Injectable)()
], AnalyzeService);
//# sourceMappingURL=analyze.service.js.map