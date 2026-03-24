import { WechatService, WechatLoginDto } from './wechat.service';
export declare class WechatController {
    private wechatService;
    constructor(wechatService: WechatService);
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
    detail(dto: {
        id: number;
    }): Promise<{
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
    detailByOpenid(dto: {
        openid: string;
    }): Promise<{
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
    delete(dto: {
        id: number;
    }): Promise<{
        success: boolean;
    }>;
}
