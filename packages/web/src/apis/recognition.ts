import { request } from '../utils/request'

/**
 * 风险等级枚举
 * A: 无风险，B: 低风险，C: 中风险，D: 高风险
 */
export type RiskLevel = 'A' | 'B' | 'C' | 'D'

/**
 * 整体风险评估
 */
export type OverallRisk = 'safe' | 'low' | 'medium' | 'high'

export interface ComponentItem {
  name: string          // 成分名称
  riskLevel: RiskLevel  // 风险等级 A/B/C/D
  tags: string[]        // 成分标签，如 ["食品主料"]
  functions: string[]   // 作用信息，如 ["膨化剂", "营养强化剂"]
  confidence: number    // 置信度 0-1
}

export interface OcrResponse {
  imageUrl: string
  provider: string
  components: ComponentItem[]
  overallRisk: OverallRisk  // 整体风险评估：safe/low/medium/high
  sensitiveIngredients: string[]  // 敏感成分列表
  ocrText?: string  // OCR 识别的原始文本（可选，用于展示）
}

export const recognitionApi = {
  /**
   * OCR 识别
   * @param data.imageUrl 图片临时路径（用于展示）
   * @param data.base64 图片 base64 编码（传给后端进行 OCR 识别）
   * @param data.mockText Mock 文本（开发测试用）
   */
  ocr(data: { imageUrl?: string; base64?: string; mockText?: string }): Promise<OcrResponse> {
    return request.post('/recognition/ocr', data)
  },
}
