import { request } from '../utils/request'

export interface HistoryListItem {
  id: number
  product: {
    id: number
    name: string
    brand?: string
    barcode: string
    risk_level: string
  }
  created_at: string
  updated_at: string
}

export interface HistoryListResponse {
  list: HistoryListItem[]
  total: number
  page: number
  pageSize: number
}

export const historyApi = {
  list(page = 1, pageSize = 20): Promise<HistoryListResponse> {
    return request.post('/history/list', { page, pageSize })
  },
  delete(id: number): Promise<{ success: boolean }> {
    return request.post('/history/delete', { id })
  },
  clear(): Promise<{ success: boolean }> {
    return request.post('/history/clear', {})
  },
}
