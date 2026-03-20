import Taro from '@tarojs/taro'
import { authApi } from '../apis/auth'

const TOKEN_KEY = 'token'
const USER_INFO_KEY = 'userInfo'
const OPENID_KEY = 'openid'

export interface LocalUserInfo {
  id: number
  openid: string
  nickname: string
  avatar?: string
  role: string
}

export const getToken = (): string => Taro.getStorageSync(TOKEN_KEY) || ''

export const getUserInfo = (): LocalUserInfo | null => Taro.getStorageSync(USER_INFO_KEY) || null

export const isLoggedIn = (): boolean => Boolean(getToken() && getUserInfo()?.openid)

export const clearAuth = () => {
  Taro.removeStorageSync(TOKEN_KEY)
  Taro.removeStorageSync(USER_INFO_KEY)
  Taro.removeStorageSync(OPENID_KEY)
}

export const ensureLogin = async (): Promise<LocalUserInfo> => {
  const user = getUserInfo()
  const token = getToken()
  if (user && token) {
    return user
  }

  let code = `mock_${Date.now()}`
  try {
    const loginRes = await Taro.login()
    if (loginRes.code) {
      code = loginRes.code
    }
  } catch (error) {
    console.warn('Taro.login failed, fallback to mock code', error)
  }

  let nickname = '微信用户'
  let avatar = ''
  try {
    const profileRes: any = await Taro.getUserProfile({ desc: '用于完善用户信息' })
    if (profileRes?.userInfo?.nickName) {
      nickname = profileRes.userInfo.nickName
    }
    if (profileRes?.userInfo?.avatarUrl) {
      avatar = profileRes.userInfo.avatarUrl
    }
  } catch (error) {
    console.warn('getUserProfile skipped', error)
  }

  const result = await authApi.wechatLogin({ code, nickname, avatar })
  Taro.setStorageSync(TOKEN_KEY, result.token)
  Taro.setStorageSync(USER_INFO_KEY, result.user)
  Taro.setStorageSync(OPENID_KEY, result.user.openid)

  return result.user
}
