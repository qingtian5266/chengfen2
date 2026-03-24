import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { WechatUser } from './wechat-user.entity';
export interface WechatLoginDto {
    code: string;
}
export interface WechatUserInfoDto {
    openid: string;
    nickname?: string;
    sex?: number;
    province?: string;
    city?: string;
    country?: string;
    headimgurl?: string;
    phone?: string;
}
export declare class WechatService {
    private wechatUserRepository;
    private jwtService;
    private readonly wechatAppId;
    private readonly wechatAppSecret;
    constructor(wechatUserRepository: Repository<WechatUser>, jwtService: JwtService);
    login(dto: WechatLoginDto): Promise<{
        token: string;
        user: {
            id: number;
            openid: string;
            nickname: string;
            avatar: string;
            sex: number;
            phone: string;
            role: string;
        };
    }>;
    list(): Promise<{
        id: number;
        openid: string;
        unionid: string;
        nickname: string;
        sex: number;
        province: string;
        city: string;
        country: string;
        avatar: string;
        phone: string;
        role: string;
        status: number;
        last_login_at: Date;
        created_at: Date;
        updated_at: Date;
    }[]>;
    detail(id: number): Promise<{
        id: number;
        openid: string;
        unionid: string;
        nickname: string;
        sex: number;
        province: string;
        city: string;
        country: string;
        avatar: string;
        phone: string;
        role: string;
        status: number;
        last_login_at: Date;
        created_at: Date;
        updated_at: Date;
    }>;
    detailByOpenid(openid: string): Promise<{
        id: number;
        openid: string;
        unionid: string;
        nickname: string;
        sex: number;
        province: string;
        city: string;
        country: string;
        avatar: string;
        phone: string;
        role: string;
        status: number;
        last_login_at: Date;
        created_at: Date;
        updated_at: Date;
    }>;
    delete(id: number): Promise<{
        success: boolean;
    }>;
    private generateToken;
}
