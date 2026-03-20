import { request } from '../utils/request'

export interface OcrResponse {
  imageUrl: string
  provider: string
  components: Array<{
    name: string
    confidence: number
  }>
}

export const recognitionApi = {
  ocr(data: { imageUrl?: string; base64?: string; mockText?: string }): Promise<OcrResponse> {
    return request.post('/recognition/ocr', data)
  },
}
