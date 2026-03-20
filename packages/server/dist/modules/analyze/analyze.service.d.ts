type RiskLevel = 'low' | 'medium' | 'high';
export declare class AnalyzeService {
    private readonly ruleMap;
    analyzeComponents(dto: {
        category?: string;
        components: string[];
    }): Promise<{
        category: string;
        summary: Record<RiskLevel, number>;
        list: {
            name: string;
            risk_level: RiskLevel;
            reason: string;
        }[];
    }>;
    private reasonByRisk;
}
export {};
