import { Body, Controller, Post, Req } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { ProductService } from './product.service';

@Controller('product')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('barcode')
  async barcode(@Body() dto: { barcode: string }) {
    return this.productService.byBarcode(dto.barcode);
  }

  @Post('detail')
  async detail(@Body() dto: { id: number }, @Req() req: Request) {
    const openid = await this.extractOpenid(req);
    return this.productService.detail(dto.id, openid);
  }

  private async extractOpenid(req: Request): Promise<string | undefined> {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return undefined;
    }

    const token = authHeader.slice(7);
    try {
      const payload = await this.jwtService.verifyAsync(token);
      return payload.openid;
    } catch {
      return undefined;
    }
  }
}
