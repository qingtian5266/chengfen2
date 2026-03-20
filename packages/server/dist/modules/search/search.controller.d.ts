import { SearchService } from './search.service';
export declare class SearchController {
    private readonly searchService;
    constructor(searchService: SearchService);
    suggest(dto: {
        keyword?: string;
    }): Promise<string[]>;
    query(dto: {
        keyword?: string;
    }): Promise<{
        products: import("../product/product.entity").Product[];
        components: import("../component/component.entity").ComponentEntity[];
    }>;
}
