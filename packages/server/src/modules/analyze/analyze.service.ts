import { Injectable } from '@nestjs/common';

type RiskLevel = 'low' | 'medium' | 'high';

@Injectable()
export class AnalyzeService {
  private readonly ruleMap: Record<string, RiskLevel> = {
    防腐剂: 'medium',
    香精: 'medium',
    苯甲酸钠: 'medium',
    亚硝酸钠: 'high',
    糖精钠: 'high',
    水: 'low',
    甘油: 'low',
    维生素c: 'low',
  };

  async analyzeComponents(dto: { category?: string; components: string[] }) {
    const components = (dto.components || []).map((item) => item.trim()).filter(Boolean);

    const analyzed = components.map((name) => {
      const lower = name.toLowerCase();
      const direct = this.ruleMap[name] || this.ruleMap[lower] || 'medium';

      return {
        name,
        risk_level: direct,
        reason: this.reasonByRisk(direct),
      };
    });

    const summary = analyzed.reduce(
      (acc, item) => {
        acc[item.risk_level] += 1;
        return acc;
      },
      { low: 0, medium: 0, high: 0 } as Record<RiskLevel, number>,
    );

    return {
      category: dto.category || 'food',
      summary,
      list: analyzed,
    };
  }

  private reasonByRisk(risk: RiskLevel) {
    if (risk === 'high') {
      return '存在较高风险，请结合摄入频率谨慎使用';
    }
    if (risk === 'medium') {
      return '存在争议或需控制使用量';
    }
    return '常见安全成分，正常使用风险较低';
  }
}
