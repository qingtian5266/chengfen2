import { request } from '../utils/request'

export interface ProductDetail {
  id: number
  name: string
  brand?: string
  barcode: string
  category: string
  risk_level: string
  ingredients_text?: string
  isCollected?: boolean
  components: Array<{
    id: number
    name: string
    risk_level: string
    description?: string
  }>
}

export const productApi = {
  barcode(barcode: string): Promise<{ id: number; name: string } | null> {
    return request.post('/product/barcode', { barcode })
  },
  detail(id: number): Promise<ProductDetail> {
    return request.post('/product/detail', { id })
  },
}
