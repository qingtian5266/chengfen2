import { Request } from 'express';
import { FeedbackService } from './feedback.service';
export declare class FeedbackController {
    private readonly feedbackService;
    constructor(feedbackService: FeedbackService);
    create(dto: {
        content: string;
    }, req: Request): Promise<{
        success: boolean;
        id: number;
    }>;
}
