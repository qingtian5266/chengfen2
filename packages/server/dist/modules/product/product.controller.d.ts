import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { ProductService } from './product.service';
export declare class ProductController {
    private readonly productService;
    private readonly jwtService;
    constructor(productService: ProductService, jwtService: JwtService);
    barcode(dto: {
        barcode: string;
    }): Promise<{
        id: number;
        name: string;
        brand: string;
        barcode: string;
        category: string;
        risk_level: string;
    }>;
    detail(dto: {
        id: number;
    }, req: Request): Promise<{
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
    private extractOpenid;
}
