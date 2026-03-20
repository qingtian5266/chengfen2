import { RecognitionService } from './recognition.service';
export declare class RecognitionController {
    private readonly recognitionService;
    constructor(recognitionService: RecognitionService);
    ocr(dto: {
        imageUrl?: string;
        base64?: string;
        mockText?: string;
    }): Promise<{
        imageUrl: string;
        components: {
            name: string;
            confidence: number;
        }[];
        provider: string;
    }>;
}
