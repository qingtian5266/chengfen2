import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { JwtGuard } from '../../common/guards/jwt.guard';
import { FeedbackService } from './feedback.service';

@Controller('feedback')
@UseGuards(JwtGuard)
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Post('create')
  async create(@Body() dto: { content: string }, @Req() req: Request) {
    const openid = (req as any).user.openid;
    return this.feedbackService.create(openid, dto.content);
  }
}
