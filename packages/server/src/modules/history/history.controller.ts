import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { JwtGuard } from '../../common/guards/jwt.guard';
import { HistoryService } from './history.service';

@Controller('history')
@UseGuards(JwtGuard)
export class HistoryController {
  constructor(private readonly historyService: HistoryService) {}

  @Post('list')
  async list(@Body() dto: { page?: number; pageSize?: number }, @Req() req: Request) {
    const openid = (req as any).user.openid;
    return this.historyService.list(openid, dto.page || 1, dto.pageSize || 20);
  }

  @Post('delete')
  async delete(@Body() dto: { id: number }, @Req() req: Request) {
    const openid = (req as any).user.openid;
    return this.historyService.delete(openid, dto.id);
  }

  @Post('clear')
  async clear(@Req() req: Request) {
    const openid = (req as any).user.openid;
    return this.historyService.clear(openid);
  }
}
