import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { User } from '../modules/users/user.entity';
import { WechatUser } from '../modules/wechat/wechat-user.entity';
export interface RegisterDto {
    username: string;
    password: string;
    email?: string;
    phone?: string;
}
export interface LoginDto {
    username: string;
    password: string;
}
export interface WechatLoginDto {
    code: string;
    nickname?: string;
    avatar?: string;
}
export declare class AuthService {
    private userRepository;
    private wechatUserRepository;
    private jwtService;
    constructor(userRepository: Repository<User>, wechatUserRepository: Repository<WechatUser>, jwtService: JwtService);
    register(dto: RegisterDto): Promise<{
        token: string;
        user: {
            id: number;
            username: string;
            email: string;
            phone: string;
            role: string;
            avatar: string;
        };
    }>;
    login(dto: LoginDto): Promise<{
        token: string;
        info: {
            id: number;
            username: string;
        };
    }>;
    wechatLogin(dto: WechatLoginDto): Promise<{
        token: string;
        user: {
            id: number;
            openid: string;
            nickname: string;
            avatar: string;
            role: string;
        };
    }>;
    private resolveMiniOpenid;
    private generateToken;
}
