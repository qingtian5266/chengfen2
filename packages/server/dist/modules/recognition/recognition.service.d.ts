export declare class RecognitionService {
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
