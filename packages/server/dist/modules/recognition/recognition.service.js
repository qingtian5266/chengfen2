"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecognitionService = void 0;
const common_1 = require("@nestjs/common");
let RecognitionService = class RecognitionService {
    async ocr(dto) {
        const text = (dto.mockText || '').trim();
        const components = text
            ? text
                .split(/[，,、\n\s]+/)
                .map((item) => item.trim())
                .filter(Boolean)
                .slice(0, 30)
            : ['水', '甘油', '丙二醇', '香精'];
        return {
            imageUrl: dto.imageUrl || '',
            components: components.map((name) => ({
                name,
                confidence: 0.85,
            })),
            provider: 'mock',
        };
    }
};
exports.RecognitionService = RecognitionService;
exports.RecognitionService = RecognitionService = __decorate([
    (0, common_1.Injectable)()
], RecognitionService);
//# sourceMappingURL=recognition.service.js.map