import { request } from '../utils/request'

export interface AnalyzeResult {
  category: string
  summary: {
    low: number
    medium: number
    high: number
  }
  list: Array<{
    name: string
    risk_level: 'low' | 'medium' | 'high'
    reason: string
  }>
}

export const analyzeApi = {
  components(data: { category?: string; components: string[] }): Promise<AnalyzeResult> {
    return request.post('/analyze/components', data)
  },
}
