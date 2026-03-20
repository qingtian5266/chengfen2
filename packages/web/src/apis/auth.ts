import { request } from '../utils/request'

export interface WechatLoginDto {
  code: string
  nickname?: string
  avatar?: string
}

export interface WechatLoginResponse {
  token: string
  user: {
    id: number
    openid: string
    nickname: string
    avatar?: string
    role: string
  }
}

export const authApi = {
  wechatLogin(data: WechatLoginDto): Promise<WechatLoginResponse> {
    return request.post('/auth/wechatLogin', data)
  },
}
