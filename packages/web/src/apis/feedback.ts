import { request } from '../utils/request'

export const feedbackApi = {
  create(content: string): Promise<{ success: boolean; id: number }> {
    return request.post('/feedback/create', { content })
  },
}
