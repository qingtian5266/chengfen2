import { request } from '../utils/request'

export interface CollectListItem {
  id: number
  product: {
    id: number
    name: string
    brand?: string
    barcode: string
    risk_level: string
  }
  created_at: string
}

export interface CollectListResponse {
  list: CollectListItem[]
  total: number
  page: number
  pageSize: number
}

export const collectApi = {
  create(productId: number): Promise<{ success: boolean; collected: boolean }> {
    return request.post('/collect/create', { productId })
  },
  cancel(productId: number): Promise<{ success: boolean; collected: boolean }> {
    return request.post('/collect/cancel', { productId })
  },
  list(page = 1, pageSize = 20): Promise<CollectListResponse> {
    return request.post('/collect/list', { page, pageSize })
  },
}
