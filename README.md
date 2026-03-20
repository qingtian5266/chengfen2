# Lawyer 全栈项目

企业级全栈管理系统 - Taro + Vue3 + NutUI + NestJS

## 📁 项目结构

```
lawyer/
├── app/              # 前端应用（Taro + Vue3 + NutUI）
├── server/           # 后端服务（NestJS + TypeORM + MySQL）
└── docker-compose.yml # MySQL 容器配置
```

## 🚀 快速开始

### 1. 启动数据库

```bash
cd /Users/admin/vibe-coding/lawyer
docker-compose up -d
```

### 2. 启动后端

```bash
cd server
npm install
npm run dev
```

后端运行在：http://localhost:5555

### 3. 启动前端

```bash
cd app
npm install
npm run dev:h5
```

前端运行在：http://localhost:5556

## 🔧 技术栈

**前端：**
- Taro 3.6（跨端框架）
- Vue3（UI 框架）
- NutUI（移动端组件库）
- TypeScript

**后端：**
- NestJS 10（Node.js 框架）
- TypeORM（ORM）
- MySQL 8.0（数据库）
- JWT（认证）
- bcrypt（密码加密）

## 📌 API 接口

所有接口均为 **POST** 方法，统一响应格式：

```json
{
  "code": 0,
  "data": {},
  "message": "success"
}
```

| 接口 | 路径 | 说明 |
|------|------|------|
| 注册 | POST /api/auth/register | 注册新用户 |
| 登录 | POST /api/auth/login | 登录获取 token |
| 用户列表 | POST /api/users/list | 分页查询用户 |
| 用户详情 | POST /api/users/detail | 获取用户详情 |
| 创建用户 | POST /api/users/create | 创建新用户 |
| 更新用户 | POST /api/users/update | 更新用户信息 |
| 删除用户 | POST /api/users/delete | 删除用户 |

## 🔐 认证方式

- JWT Token 认证
- Token 有效期：24 小时
- 请求头：`Authorization: Bearer <token>`

## 📝 环境变量

后端支持多环境配置：

- `.env.local` - 本地开发环境
- `.env.prod` - 生产环境

## 🎯 功能特性

- ✅ 用户注册/登录
- ✅ JWT Token 认证
- ✅ 用户管理（CRUD）
- ✅ 角色权限（admin/user）
- ✅ 状态管理（启用/禁用）
- ✅ 分页查询
- ✅ 密码 bcrypt 加密
- ✅ 统一响应格式
- ✅ 全局异常处理

## 📱 前端页面

- 首页（/pages/index/index）
- 登录页（/pages/login/index）
- 用户列表（/pages/users/index）
- 新增用户（/pages/users/create）
- 编辑用户（/pages/users/edit）

## 🐛 常见问题

### 数据库连接失败
检查 MySQL 是否启动：
```bash
docker ps | grep lawyer-mysql
```

### 端口冲突
修改 `.env.local` 中的端口配置

### Token 失效
Token 过期后会自动跳转到登录页

## 📄 License

MIT
