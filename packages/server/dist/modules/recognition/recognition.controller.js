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
exports.RecognitionController = void 0;
const common_1 = require("@nestjs/common");
const recognition_service_1 = require("./recognition.service");
let RecognitionController = class RecognitionController {
    constructor(recognitionService) {
        this.recognitionService = recognitionService;
    }
    async ocr(dto) {
        return this.recognitionService.ocr(dto);
    }
};
exports.RecognitionController = RecognitionController;
__decorate([
    (0, common_1.Post)('ocr'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RecognitionController.prototype, "ocr", null);
exports.RecognitionController = RecognitionController = __decorate([
    (0, common_1.Controller)('recognition'),
    __metadata("design:paramtypes", [recognition_service_1.RecognitionService])
], RecognitionController);
//# sourceMappingURL=recognition.controller.js.map