import { Repository } from 'typeorm';
import { User } from './user.entity';
export interface UserListDto {
    page: number;
    size: number;
    username?: string;
    status?: number;
}
export interface CreateUserDto {
    username: string;
    password: string;
    email?: string;
    phone?: string;
    role?: string;
    avatar?: string;
}
export interface UpdateUserDto {
    id: number;
    username?: string;
    email?: string;
    phone?: string;
    status?: number;
    role?: string;
    avatar?: string;
}
export declare class UsersService {
    private userRepository;
    constructor(userRepository: Repository<User>);
    list(dto: UserListDto): Promise<{
        list: {
            id: number;
            username: string;
            email: string;
            phone: string;
            status: number;
            role: string;
            avatar: string;
            created_at: Date;
            updated_at: Date;
        }[];
        total: number;
        page: number;
        size: number;
    }>;
    detail(id: number): Promise<{
        id: number;
        username: string;
        email: string;
        phone: string;
        status: number;
        role: string;
        avatar: string;
        created_at: Date;
        updated_at: Date;
    }>;
    create(dto: CreateUserDto): Promise<{
        id: number;
        username: string;
        email: string;
        phone: string;
        status: number;
        role: string;
        avatar: string;
        created_at: Date;
        updated_at: Date;
    }>;
    update(dto: UpdateUserDto): Promise<{
        id: number;
        username: string;
        email: string;
        phone: string;
        status: number;
        role: string;
        avatar: string;
        created_at: Date;
        updated_at: Date;
    }>;
    delete(id: number): Promise<{
        success: boolean;
    }>;
    findByUsername(username: string): Promise<User | null>;
    getCurrentUserInfo(userId: number): Promise<{
        id: number;
        username: string;
    }>;
    private hidePassword;
}
