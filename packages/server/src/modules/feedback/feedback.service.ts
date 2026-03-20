import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserFeedback } from './user-feedback.entity';

@Injectable()
export class FeedbackService {
  constructor(
    @InjectRepository(UserFeedback)
    private readonly feedbackRepository: Repository<UserFeedback>,
  ) {}

  async create(openid: string, content: string) {
    const text = (content || '').trim();
    if (!text) {
      throw new BadRequestException('请输入反馈内容');
    }

    const feedback = this.feedbackRepository.create({
      openid,
      content: text,
      status: 0,
    });

    await this.feedbackRepository.save(feedback);
    return { success: true, id: feedback.id };
  }
}
