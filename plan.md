# Lawyer 全栈项目 - 实施计划

## 📋 项目概述

- **项目名称**: lawyer
- **项目路径**: `/Users/admin/vibe-coding/lawyer`
- **项目类型**: Taro + Vue3 + NutUI 跨端小程序（H5 优先） + NestJS 全栈

## 📁 最终目录结构

```
/Users/admin/vibe-coding/lawyer/
├── app/                                    # 前端应用（Taro + Vue3）
│   ├── src/
│   │   ├── pages/
│   │   │   ├── index/                      # 首页
│   │   │   ├── login/                      # 登录页
│   │   │   └── users/                      # 用户管理
│   │   │       ├── index.vue               # 用户列表页
│   │   │       ├── create.vue              # 新增用户页
│   │   │       └── edit.vue                # 编辑用户页
│   │   ├── api/                            # API 封装
│   │   │   ├── config.ts                   # API 配置（端口5555）
│   │   │   ├── request.ts                  # 请求工具
│   │   │   └── users.ts                    # 用户 API
│   │   ├── utils/
│   │   │   └── token.ts                    # Token 管理
│   │   ├── app.config.ts
│   │   ├── app.vue
│   │   └── app.less
│   ├── config/
│   └── package.json
│
├── server/                                 # 后端服务（NestJS）
│   ├── src/
│   │   ├── auth/                           # 认证模块
│   │   ├── users/                          # 用户模块
│   │   ├── common/
│   │   │   ├── interceptors/              # 统一响应格式
│   │   │   ├── guards/                     # Token 认证
│   │   │   └── filters/                    # 异常处理
│   │   ├── config/
│   │   └── main.ts
│   ├── .env.local                          # 本地开发环境
│   ├── .env.prod                           # 生产环境
│   ├── .env.example
│   ├── package.json
│   └── sql/
│       └── init.sql                        # 初始化 SQL
│
├── docker-compose.yml                      # MySQL 容器
├── README.md
└── PLAN.md
```

## 🔧 技术栈配置

| 配置项 | 值 |
|--------|-----|
| **前端框架** | Taro + Vue3 |
| **UI 库** | NutUI（全量引入） |
| **样式** | Less |
| **后端框架** | NestJS |
| **ORM** | TypeORM |
| **数据库** | MySQL |
| **数据库名** | lawyer|
| **表名** | user |
| **认证方式** | JWT Token |
| **响应格式** | `{ code: 0, data: {}, message: '' }` |
| **API 前缀** | `/api` |
| **接口方法** | 全部 POST |
| **Body 格式** | JSON |
| **后端端口** | 5555 |
| **前端端口** | 5556 |

## 🗄️ 数据库结构

**user 表字段：**
- `id` - 主键（自增）
- `username` - 用户名（唯一）
- `password` - 密码（bcrypt 加密）
- `email` - 邮箱
- `phone` - 手机号
- `status` - 状态（0-禁用，1-启用）
- `role` - 角色（admin/user）
- `avatar` - 头像 URL

## 🔌 API 接口列表（全部 POST）

| 功能 | 路径 | 说明 |
|------|------|------|
| 用户注册 | `POST /api/auth/register` | 注册新用户 |
| 用户登录 | `POST /api/auth/login` | 登录获取 token |
| 获取用户列表 | `POST /api/users/list` | Body 传参 {page, size} |
| 获取用户详情 | `POST /api/users/detail` | Body 传 {id} |
| 创建用户 | `POST /api/users/create` | 创建新用户 |
| 更新用户 | `POST /api/users/update` | Body 传 {id, ...data} |
| 删除用户 | `POST /api/users/delete` | Body 传 {id} |

## 📱 前端页面

| 页面 | 路径 | 功能 | NutUI 组件 |
|------|------|------|------------|
| 首页 | `/pages/index/index` | 欢迎页 + 导航 | Button, Card |
| 登录页 | `/pages/login/index` | 用户登录 | Form, Input, Button |
| 用户列表 | `/pages/users/index` | 查询、删除用户 | List, Cell, Button, Dialog |
| 新增用户 | `/pages/users/create` | 创建新用户 | Form, Input, Button |
| 编辑用户 | `/pages/users/edit` | 更新用户信息 | Form, Input, Button |

## 🚀 实施步骤

### 阶段一：项目初始化（5 分钟）
1. 创建项目根目录
2. 初始化前端（Taro + Vue3 + NutUI）
3. 初始化后端（NestJS）
4. 配置 Docker Compose（MySQL）

### 阶段二：后端开发（15 分钟）
1. 配置 TypeORM + MySQL 连接
2. 创建 User 实体
3. 实现统一响应格式
4. 实现 JWT 认证
5. 实现 Auth 模块（登录、注册）
6. 实现 Users 模块（CRUD API）
7. 配置环境变量（.env.local / .env.prod）

### 阶段三：前端开发（20 分钟）
1. 全量引入 NutUI
2. 配置 API 请求工具（端口 5555）
3. 创建登录页
4. 创建用户列表页
5. 创建新增用户页
6. 创建编辑用户页
7. 实现路由配置

## ⏱️ 预计时间
- 总计：约 **50 分钟**
