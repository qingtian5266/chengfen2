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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const bcrypt = __importStar(require("bcrypt"));
const axios_1 = __importDefault(require("axios"));
const user_entity_1 = require("../modules/users/user.entity");
const wechat_user_entity_1 = require("../modules/wechat/wechat-user.entity");
let AuthService = class AuthService {
    constructor(userRepository, wechatUserRepository, jwtService) {
        this.userRepository = userRepository;
        this.wechatUserRepository = wechatUserRepository;
        this.jwtService = jwtService;
    }
    async register(dto) {
        const existing = await this.userRepository.findOne({
            where: { username: dto.username },
        });
        if (existing) {
            throw new common_1.ConflictException('用户名已存在');
        }
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(dto.password, salt);
        const user = this.userRepository.create({
            username: dto.username,
            password: passwordHash,
            email: dto.email,
            phone: dto.phone,
            role: 'user',
            status: 1,
        });
        await this.userRepository.save(user);
        const token = await this.generateToken(user);
        return {
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                phone: user.phone,
                role: user.role,
                avatar: user.avatar,
            },
        };
    }
    async login(dto) {
        const user = await this.userRepository.findOne({
            where: { username: dto.username },
        });
        if (!user) {
            throw new common_1.UnauthorizedException('用户名或密码错误');
        }
        const isValid = await bcrypt.compare(dto.password, user.password);
        if (!isValid) {
            throw new common_1.UnauthorizedException('用户名或密码错误');
        }
        if (user.status === 0) {
            throw new common_1.UnauthorizedException('账号已被禁用');
        }
        const token = await this.generateToken(user);
        return {
            token,
            info: {
                id: user.id,
                username: user.username,
            },
        };
    }
    async wechatLogin(dto) {
        const code = (dto.code || '').trim();
        if (!code) {
            throw new common_1.BadRequestException('code不能为空');
        }
        const openid = await this.resolveMiniOpenid(code);
        const now = new Date();
        let user = await this.wechatUserRepository.findOne({ where: { openid } });
        if (!user) {
            user = this.wechatUserRepository.create({
                openid,
                nickname: dto.nickname || `微信用户${openid.slice(-6)}`,
                avatar: dto.avatar || '',
                role: 'user',
                status: 1,
                last_login_at: now,
            });
        }
        else {
            user.nickname = dto.nickname || user.nickname;
            user.avatar = dto.avatar || user.avatar;
            user.last_login_at = now;
            user.status = 1;
        }
        await this.wechatUserRepository.save(user);
        const token = await this.jwtService.signAsync({
            sub: user.id,
            openid: user.openid,
            role: user.role,
        });
        return {
            token,
            user: {
                id: user.id,
                openid: user.openid,
                nickname: user.nickname,
                avatar: user.avatar,
                role: user.role,
            },
        };
    }
    async resolveMiniOpenid(code) {
        const appid = process.env.WECHAT_APP_ID || '';
        const secret = process.env.WECHAT_APP_SECRET || '';
        if (!appid || !secret || code.startsWith('mock_')) {
            return `mock_openid_${code.replace(/[^a-zA-Z0-9]/g, '').slice(0, 30)}`;
        }
        const url = 'https://api.weixin.qq.com/sns/jscode2session';
        const response = await axios_1.default.get(url, {
            params: {
                appid,
                secret,
                js_code: code,
                grant_type: 'authorization_code',
            },
        });
        const data = response.data;
        if (!data || data.errcode || !data.openid) {
            throw new common_1.UnauthorizedException(`微信登录失败：${data?.errmsg || '未知错误'}`);
        }
        return data.openid;
    }
    async generateToken(user) {
        return this.jwtService.signAsync({
            sub: user.id,
            username: user.username,
            role: user.role,
        });
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(wechat_user_entity_1.WechatUser)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map