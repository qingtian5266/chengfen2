import Taro from '@tarojs/taro'

interface ResponseData<T = any> {
  code: number
  data: T
  message: string
}

const BASE_URL = '/api'

class Request {
  private baseURL: string

  constructor(baseURL: string) {
    this.baseURL = baseURL
  }

  private async request<T>(
    url: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    data?: any
  ): Promise<T> {
    const token = Taro.getStorageSync('token')

    try {
      const response = await Taro.request({
        url: `${this.baseURL}${url}`,
        method,
        data,
        header: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      })

      const result = response.data as ResponseData<T>

      if (result.code === 0) {
        return result.data
      } else {
        Taro.showToast({
          title: result.message || '请求失败',
          icon: 'none',
        })
        throw new Error(result.message || '请求失败')
      }
    } catch (error: any) {
      Taro.showToast({
        title: error.message || '网络错误',
        icon: 'none',
      })
      throw error
    }
  }

  get<T>(url: string, params?: any): Promise<T> {
    const queryString = params
      ? '?' + Object.entries(params)
          .map(([key, value]) => `${key}=${encodeURIComponent(String(value))}`)
          .join('&')
      : ''
    return this.request<T>(`${url}${queryString}`, 'GET')
  }

  post<T>(url: string, data?: any): Promise<T> {
    return this.request<T>(url, 'POST', data)
  }

  put<T>(url: string, data?: any): Promise<T> {
    return this.request<T>(url, 'PUT', data)
  }

  delete<T>(url: string, data?: any): Promise<T> {
    return this.request<T>(url, 'DELETE', data)
  }
}

export const request = new Request(BASE_URL)
