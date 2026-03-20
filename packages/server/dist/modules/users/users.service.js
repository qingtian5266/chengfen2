"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("./user.entity");
let UsersService = class UsersService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async list(dto) {
        const { page = 1, size = 10, username, status } = dto;
        const queryBuilder = this.userRepository.createQueryBuilder('user');
        if (username) {
            queryBuilder.andWhere('user.username LIKE :username', {
                username: `%${username}%`,
            });
        }
        if (status !== undefined) {
            queryBuilder.andWhere('user.status = :status', { status });
        }
        queryBuilder
            .orderBy('user.created_at', 'DESC')
            .skip((page - 1) * size)
            .take(size);
        const [data, total] = await queryBuilder.getManyAndCount();
        return {
            list: data.map((user) => this.hidePassword(user)),
            total,
            page,
            size,
        };
    }
    async detail(id) {
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user) {
            throw new common_1.NotFoundException('用户不存在');
        }
        return this.hidePassword(user);
    }
    async create(dto) {
        console.log(dto);
        const existing = await this.userRepository.findOne({
            where: { username: dto.username },
        });
        if (existing) {
            throw new common_1.NotFoundException('用户名已存在');
        }
        const bcrypt = await Promise.resolve().then(() => __importStar(require('bcrypt')));
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(dto.password, salt);
        const user = this.userRepository.create({
            ...dto,
            password: passwordHash,
        });
        await this.userRepository.save(user);
        return this.hidePassword(user);
    }
    async update(dto) {
        const user = await this.userRepository.findOne({ where: { id: dto.id } });
        if (!user) {
            throw new common_1.NotFoundException('用户不存在');
        }
        if (dto.password) {
            const bcrypt = await Promise.resolve().then(() => __importStar(require('bcrypt')));
            const salt = await bcrypt.genSalt(10);
            dto.password = await bcrypt.hash(dto.password, salt);
        }
        Object.assign(user, dto);
        await this.userRepository.save(user);
        return this.hidePassword(user);
    }
    async delete(id) {
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user) {
            throw new common_1.NotFoundException('用户不存在');
        }
        await this.userRepository.remove(user);
        return { success: true };
    }
    async findByUsername(username) {
        return this.userRepository.findOne({ where: { username } });
    }
    async getCurrentUserInfo(userId) {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new common_1.NotFoundException('用户不存在');
        }
        return {
            id: user.id,
            username: user.username,
        };
    }
    hidePassword(user) {
        const { password, ...result } = user;
        return result;
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UsersService);
//# sourceMappingURL=users.service.js.map