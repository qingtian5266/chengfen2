import { Request } from 'express';
import { CollectService } from './collect.service';
export declare class CollectController {
    private readonly collectService;
    constructor(collectService: CollectService);
    create(dto: {
        productId: number;
    }, req: Request): Promise<{
        success: boolean;
        collected: boolean;
    }>;
    cancel(dto: {
        productId: number;
    }, req: Request): Promise<{
        success: boolean;
        collected: boolean;
    }>;
    list(dto: {
        page?: number;
        pageSize?: number;
    }, req: Request): Promise<{
        list: {
            id: number;
            product: import("../product/product.entity").Product;
            created_at: Date;
        }[];
        total: number;
        page: number;
        pageSize: number;
    }>;
}
