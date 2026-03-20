import { Repository } from 'typeorm';
import { UserFeedback } from './user-feedback.entity';
export declare class FeedbackService {
    private readonly feedbackRepository;
    constructor(feedbackRepository: Repository<UserFeedback>);
    create(openid: string, content: string): Promise<{
        success: boolean;
        id: number;
    }>;
}
