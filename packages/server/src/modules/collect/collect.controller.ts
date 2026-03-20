import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { JwtGuard } from '../../common/guards/jwt.guard';
import { CollectService } from './collect.service';

@Controller('collect')
@UseGuards(JwtGuard)
export class CollectController {
  constructor(private readonly collectService: CollectService) {}

  @Post('create')
  async create(@Body() dto: { productId: number }, @Req() req: Request) {
    const openid = (req as any).user.openid;
    return this.collectService.create(openid, dto.productId);
  }

  @Post('cancel')
  async cancel(@Body() dto: { productId: number }, @Req() req: Request) {
    const openid = (req as any).user.openid;
    return this.collectService.cancel(openid, dto.productId);
  }

  @Post('list')
  async list(@Body() dto: { page?: number; pageSize?: number }, @Req() req: Request) {
    const openid = (req as any).user.openid;
    return this.collectService.list(openid, dto.page || 1, dto.pageSize || 20);
  }
}
