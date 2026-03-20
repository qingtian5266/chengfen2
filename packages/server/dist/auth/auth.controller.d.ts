import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    login(dto: LoginDto): Promise<{
        token: string;
        info: {
            id: number;
            username: string;
        };
    }>;
    register(dto: any): Promise<{
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
    wechatLogin(dto: any): Promise<{
        token: string;
        user: {
            id: number;
            openid: string;
            nickname: string;
            avatar: string;
            role: string;
        };
    }>;
}
