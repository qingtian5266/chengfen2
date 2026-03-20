import { Repository } from 'typeorm';
import { Product } from './product.entity';
import { ProductComponent } from './product-component.entity';
import { ComponentEntity } from '../component/component.entity';
import { UserCollect } from '../collect/user-collect.entity';
import { UserHistory } from '../history/user-history.entity';
export declare class ProductService {
    private readonly productRepository;
    private readonly productComponentRepository;
    private readonly componentRepository;
    private readonly collectRepository;
    private readonly historyRepository;
    constructor(productRepository: Repository<Product>, productComponentRepository: Repository<ProductComponent>, componentRepository: Repository<ComponentEntity>, collectRepository: Repository<UserCollect>, historyRepository: Repository<UserHistory>);
    byBarcode(barcode: string): Promise<{
        id: number;
        name: string;
        brand: string;
        barcode: string;
        category: string;
        risk_level: string;
    }>;
    detail(id: number, openid?: string): Promise<{
        components: {
            id: number;
            name: string;
            risk_level: string;
            description: string;
        }[];
        isCollected: boolean;
        id: number;
        name: string;
        brand: string;
        barcode: string;
        category: string;
        risk_level: string;
        ingredients_text: string;
        created_at: Date;
        updated_at: Date;
    }>;
    private recordHistory;
}
