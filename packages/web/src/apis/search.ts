import { request } from '../utils/request'

export interface SearchQueryResponse {
  products: Array<{
    id: number
    name: string
    brand?: string
    barcode: string
    risk_level: string
  }>
  components: Array<{
    id: number
    name: string
    risk_level: string
    description?: string
  }>
}

export const searchApi = {
  suggest(keyword: string): Promise<string[]> {
    return request.post('/search/suggest', { keyword })
  },
  query(keyword: string): Promise<SearchQueryResponse> {
    return request.post('/search/query', { keyword })
  },
}
