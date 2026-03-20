import { AnalyzeService } from './analyze.service';
export declare class AnalyzeController {
    private readonly analyzeService;
    constructor(analyzeService: AnalyzeService);
    analyzeComponents(dto: {
        category?: string;
        components: string[];
    }): Promise<{
        category: string;
        summary: Record<"medium" | "low" | "high", number>;
        list: {
            name: string;
            risk_level: "medium" | "low" | "high";
            reason: string;
        }[];
    }>;
}
