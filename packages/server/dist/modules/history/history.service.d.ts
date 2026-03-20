import { Repository } from 'typeorm';
import { UserHistory } from './user-history.entity';
import { Product } from '../product/product.entity';
export declare class HistoryService {
    private readonly historyRepository;
    private readonly productRepository;
    constructor(historyRepository: Repository<UserHistory>, productRepository: Repository<Product>);
    list(openid: string, page?: number, pageSize?: number): Promise<{
        list: {
            id: number;
            product: Product;
            created_at: Date;
            updated_at: Date;
        }[];
        total: number;
        page: number;
        pageSize: number;
    }>;
    delete(openid: string, id: number): Promise<{
        success: boolean;
    }>;
    clear(openid: string): Promise<{
        success: boolean;
    }>;
}
