import { request } from '../utils/request'

export interface ComponentDetail {
  id: number
  name: string
  risk_level: string
  description?: string
}

export const componentApi = {
  detail(params: { id?: number; name?: string }): Promise<ComponentDetail> {
    return request.post('/component/detail', params)
  },
}
