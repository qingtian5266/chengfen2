## Context

当前系统是一个 NestJS + Vue3 的 monorepo 项目，缺少用户认证机制。需要实现一个简洁的登录流程：用户输入用户名和密码，验证成功后返回 JWT token 和用户信息。

**技术栈:**
- 后端：NestJS 10 + TypeORM + MySQL2 + JWT
- 前端：Vue3 + NaiveUI
- 已安装依赖：`@nestjs/jwt`, `bcrypt`, `class-validator`

**全局规范:**
- 所有 API 接口统一使用 POST 方法（详见 `openspec/specs/api-convention.md`）

**约束:**
- 登录页只需用户名和密码两个字段
- 登录成功返回 `{token, info: {}}` 格式
- 所有用户接口必须添加 Guard 保护
- token 基于用户 ID 生成

## Goals / Non-Goals

**Goals:**
- 实现简洁的登录页面（仅用户名 + 密码）
- 后端 JWT 认证机制
- 用户接口 Guard 保护
- 密码 bcrypt 加密存储

**Non-Goals:**
- 不包含注册功能（后续扩展）
- 不包含密码找回/重置
- 不包含第三方登录
- 不包含 token 刷新机制

## Decisions

### 1. JWT Token 结构设计
**决策:** token payload 仅包含 `userId`，不包含其他用户信息
**理由:** 
- 最小化 token 大小
- 敏感信息不暴露在 token 中
- 用户信息通过受保护的 `/user/info` 接口获取

**Token 配置:**
- 算法：HS256
- 有效期：7 天
- Secret: 从环境变量 `JWT_SECRET` 读取

### 2. 密码存储方案
**决策:** 使用 bcrypt 进行密码哈希，saltRounds = 10
**理由:**
- bcrypt 是成熟的密码哈希算法
- 已安装在项目依赖中
- saltRounds=10 在安全性和性能间平衡

### 3. Guard 实现方式
**决策:** 创建 `JwtGuard` 和 `@Public()` 装饰器
**理由:**
- NestJS 标准认证模式
- 全局应用 Guard，通过 `@Public()` 豁免登录等公开接口
- 代码复用性高

### 4. 登录接口设计
**决策:** `POST /api/auth/login`，请求体 `{username, password}`
**理由:**
- RESTful 风格
- 符合常见认证 API 设计
- 响应格式：`{token, info: {id, username}}`

### 5. 前端登录页路由
**决策:** 登录页作为独立页面 `/login`，使用 Vue Router 守卫控制访问
**理由:**
- Vue3 标准路由模式
- 登录成功后跳转到首页 `/`
- 未登录访问其他页面自动跳转到登录页

### 6. 前端状态管理
**决策:** 使用 store（Pinia 或 Vuex）管理用户状态和 token
**理由:**
- 登录接口调用写在 store 的 action 中
- store 统一管理 token 和用户信息
- 路由守卫中调用 `store.getUserInfo` 在每次跳转时重新获取用户信息
- 确保用户信息始终是最新的

### 7. 路由守卫逻辑
**决策:** 每次路由跳转时调用 `getUserInfo` 接口验证 token 并刷新用户信息
**理由:**
- token 可能过期或被禁用，需要实时验证
- 用户信息可能变更，需要获取最新数据
- 如果 `getUserInfo` 失败（401），跳转到登录页

### 8. 登录页独立 Layout
**决策:** 为登录页创建独立的 Layout 组件，不显示导航菜单
**理由:**
- 登录页需要简洁、专注的视觉体验
- 避免导航菜单分散用户注意力
- 全屏布局更适合登录表单展示

**实现:**
- 创建 `LoginLayout.vue` 作为登录页的父组件
- App.vue 根据路由判断是否显示导航菜单（`v-if="!isLoginPage"`）

### 9. Token 持久化方案
**决策:** Token 同时存储到 Pinia state 和 localStorage
**理由:**
- state 用于运行时快速访问
- localStorage 用于页面刷新后恢复登录状态
- 路由守卫在每次跳转时检查并恢复 token

**实现:**
- 登录成功：`store.token = response.token` + `localStorage.setItem('token')`
- 页面初始化：`store.initToken()` 从 localStorage 恢复
- 路由守卫：确保 token 已初始化

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| JWT Secret 泄露 | 使用环境变量，不提交到代码库 |
| token 被盗用 | 后续可添加 token 黑名单机制 |
| 密码强度无限制 | 后续添加密码策略验证 |
| 无 token 刷新机制 | 用户需重新登录，后续添加 refresh token |
| 用户信息全放在 info 对象 | info 仅包含非敏感信息（id, username） |

## Migration Plan

1. **数据库准备**: 创建 users 表
2. **后端开发**:
   - 创建 User 实体
   - 创建 Auth 模块（login, token 生成）
   - 创建 JwtGuard 和 @Public() 装饰器
   - 为现有用户接口添加 Guard
3. **前端开发**:
   - 创建 store 模块（user store）
   - 实现登录 action 和 getUserInfo action
   - 创建登录页面组件
   - 实现路由守卫：每次跳转调用 getUserInfo
4. **测试验证**: 登录流程、Guard 保护验证、路由守卫验证
5. **部署**: 配置 JWT_SECRET 环境变量

## Open Questions

- 初始用户数据如何导入？（需要 seed 脚本或手动插入）
- 是否需要登录失败次数限制？（防暴力破解）
