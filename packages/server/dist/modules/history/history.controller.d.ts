import { Request } from 'express';
import { HistoryService } from './history.service';
export declare class HistoryController {
    private readonly historyService;
    constructor(historyService: HistoryService);
    list(dto: {
        page?: number;
        pageSize?: number;
    }, req: Request): Promise<{
        list: {
            id: number;
            product: import("../product/product.entity").Product;
            created_at: Date;
            updated_at: Date;
        }[];
        total: number;
        page: number;
        pageSize: number;
    }>;
    delete(dto: {
        id: number;
    }, req: Request): Promise<{
        success: boolean;
    }>;
    clear(req: Request): Promise<{
        success: boolean;
    }>;
}
