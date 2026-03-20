import { request } from '../utils/request'

export interface User {
  id: number
  username: string
  email?: string
  phone?: string
  role: string
  status: number
  created_at: string
  updated_at: string
}

export interface CreateUserDto {
  username: string
  password: string
  email?: string
  phone?: string
}

export interface UpdateUserDto {
  id: number
  username?: string
  email?: string
  phone?: string
  status?: number
}

export interface UserListResponse {
  list: User[]
  total: number
  page: number
  pageSize: number
}

export const usersApi = {
  // 获取用户列表
  list(params?: { page?: number; pageSize?: number; keyword?: string }): Promise<UserListResponse> {
    return request.post('/users/list', params)
  },

  // 获取用户详情
  detail(id: number): Promise<User> {
    return request.post('/users/detail', { id })
  },

  // 创建用户
  create(data: CreateUserDto): Promise<User> {
    return request.post('/users/create', data)
  },

  // 更新用户
  update(data: UpdateUserDto): Promise<User> {
    return request.post('/users/update', data)
  },

  // 删除用户
  delete(id: number): Promise<void> {
    return request.post('/users/delete', { id })
  },
}
