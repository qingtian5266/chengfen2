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
exports.WechatService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const wechat_user_entity_1 = require("./wechat-user.entity");
const axios = __importStar(require("axios"));
let WechatService = class WechatService {
    constructor(wechatUserRepository, jwtService) {
        this.wechatUserRepository = wechatUserRepository;
        this.jwtService = jwtService;
        this.wechatAppId = process.env.WECHAT_APP_ID || '';
        this.wechatAppSecret = process.env.WECHAT_APP_SECRET || '';
    }
    async login(dto) {
        const tokenUrl = `https://api.weixin.qq.com/sns/oauth2/access_token?appid=${this.wechatAppId}&secret=${this.wechatAppSecret}&code=${dto.code}&grant_type=authorization_code`;
        const tokenResponse = await axios.default.get(tokenUrl);
        const tokenData = tokenResponse.data;
        if (tokenData.errcode) {
            throw new common_1.UnauthorizedException(`微信登录失败：${tokenData.errmsg}`);
        }
        const { openid, access_token, refresh_token, expires_in, scope } = tokenData;
        const userInfoUrl = `https://api.weixin.qq.com/sns/userinfo?access_token=${access_token}&openid=${openid}&lang=zh_CN`;
        const userInfoResponse = await axios.default.get(userInfoUrl);
        const userInfo = userInfoResponse.data;
        if (userInfo.errcode) {
            throw new common_1.UnauthorizedException(`获取用户信息失败：${userInfo.errmsg}`);
        }
        let wechatUser = await this.wechatUserRepository.findOne({
            where: { openid },
        });
        if (wechatUser) {
            wechatUser.nickname = userInfo.nickname;
            wechatUser.avatar = userInfo.headimgurl;
            wechatUser.sex = userInfo.sex;
            wechatUser.province = userInfo.province;
            wechatUser.city = userInfo.city;
            wechatUser.country = userInfo.country;
            wechatUser.access_token = access_token;
            wechatUser.refresh_token = refresh_token;
            wechatUser.token_expires_at = Math.floor(Date.now() / 1000) + expires_in;
            wechatUser.scope = scope;
            wechatUser.last_login_at = new Date();
            await this.wechatUserRepository.save(wechatUser);
        }
        else {
            wechatUser = this.wechatUserRepository.create({
                openid,
                unionid: userInfo.unionid,
                nickname: userInfo.nickname,
                sex: userInfo.sex,
                province: userInfo.province,
                city: userInfo.city,
                country: userInfo.country,
                avatar: userInfo.headimgurl,
                access_token,
                refresh_token,
                token_expires_at: Math.floor(Date.now() / 1000) + expires_in,
                scope,
                role: 'user',
                status: 1,
                last_login_at: new Date(),
            });
            await this.wechatUserRepository.save(wechatUser);
        }
        const token = await this.generateToken(wechatUser);
        return {
            token,
            user: {
                id: wechatUser.id,
                openid: wechatUser.openid,
                nickname: wechatUser.nickname,
                avatar: wechatUser.avatar,
                sex: wechatUser.sex,
                phone: wechatUser.phone,
                role: wechatUser.role,
            },
        };
    }
    async list() {
        const users = await this.wechatUserRepository.find({
            where: { status: 1 },
            order: { created_at: 'DESC' },
        });
        return users.map(user => ({
            id: user.id,
            openid: user.openid,
            unionid: user.unionid,
            nickname: user.nickname,
            sex: user.sex,
            province: user.province,
            city: user.city,
            country: user.country,
            avatar: user.avatar,
            phone: user.phone,
            role: user.role,
            status: user.status,
            last_login_at: user.last_login_at,
            created_at: user.created_at,
            updated_at: user.updated_at,
        }));
    }
    async detail(id) {
        const user = await this.wechatUserRepository.findOne({
            where: { id },
        });
        if (!user) {
            throw new common_1.UnauthorizedException('用户不存在');
        }
        return {
            id: user.id,
            openid: user.openid,
            unionid: user.unionid,
            nickname: user.nickname,
            sex: user.sex,
            province: user.province,
            city: user.city,
            country: user.country,
            avatar: user.avatar,
            phone: user.phone,
            role: user.role,
            status: user.status,
            last_login_at: user.last_login_at,
            created_at: user.created_at,
            updated_at: user.updated_at,
        };
    }
    async detailByOpenid(openid) {
        const user = await this.wechatUserRepository.findOne({
            where: { openid },
        });
        if (!user) {
            throw new common_1.UnauthorizedException('用户不存在');
        }
        return {
            id: user.id,
            openid: user.openid,
            unionid: user.unionid,
            nickname: user.nickname,
            sex: user.sex,
            province: user.province,
            city: user.city,
            country: user.country,
            avatar: user.avatar,
            phone: user.phone,
            role: user.role,
            status: user.status,
            last_login_at: user.last_login_at,
            created_at: user.created_at,
            updated_at: user.updated_at,
        };
    }
    async delete(id) {
        const user = await this.wechatUserRepository.findOne({
            where: { id },
        });
        if (!user) {
            throw new common_1.UnauthorizedException('用户不存在');
        }
        user.status = 0;
        await this.wechatUserRepository.save(user);
        return { success: true };
    }
    async generateToken(user) {
        return this.jwtService.signAsync({
            sub: user.id,
            openid: user.openid,
            role: user.role,
        });
    }
};
exports.WechatService = WechatService;
exports.WechatService = WechatService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(wechat_user_entity_1.WechatUser)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        jwt_1.JwtService])
], WechatService);
//# sourceMappingURL=wechat.service.js.map