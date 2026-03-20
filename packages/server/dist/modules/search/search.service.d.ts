import { Repository } from 'typeorm';
import { Product } from '../product/product.entity';
import { ComponentEntity } from '../component/component.entity';
export declare class SearchService {
    private readonly productRepository;
    private readonly componentRepository;
    constructor(productRepository: Repository<Product>, componentRepository: Repository<ComponentEntity>);
    suggest(keyword?: string): Promise<string[]>;
    query(keyword?: string): Promise<{
        products: Product[];
        components: ComponentEntity[];
    }>;
}
