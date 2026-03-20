import { UsersService, UserListDto, CreateUserDto, UpdateUserDto } from './users.service';
export declare class UsersController {
    private usersService;
    constructor(usersService: UsersService);
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
    detail(dto: {
        id: number;
    }): Promise<{
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
    delete(dto: {
        id: number;
    }): Promise<{
        success: boolean;
    }>;
}
export declare class UserController {
    private usersService;
    constructor(usersService: UsersService);
    info(req: any): Promise<{
        id: number;
        username: string;
    }>;
}
