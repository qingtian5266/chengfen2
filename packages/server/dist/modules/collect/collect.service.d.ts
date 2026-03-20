import { Repository } from 'typeorm';
import { UserCollect } from './user-collect.entity';
import { Product } from '../product/product.entity';
export declare class CollectService {
    private readonly collectRepository;
    private readonly productRepository;
    constructor(collectRepository: Repository<UserCollect>, productRepository: Repository<Product>);
    create(openid: string, productId: number): Promise<{
        success: boolean;
        collected: boolean;
    }>;
    cancel(openid: string, productId: number): Promise<{
        success: boolean;
        collected: boolean;
    }>;
    list(openid: string, page?: number, pageSize?: number): Promise<{
        list: {
            id: number;
            product: Product;
            created_at: Date;
        }[];
        total: number;
        page: number;
        pageSize: number;
    }>;
}
