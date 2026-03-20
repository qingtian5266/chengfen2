## Why

用户需要通过简单的用户名和密码进行身份验证，登录成功后获取 token 和个人信息用于后续 API 调用。当前系统缺少用户认证机制，所有接口都无法进行权限控制。

## What Changes

- 新增用户登录页面，仅需填写用户名和密码
- 新增登录 API 接口，验证用户凭证并返回 token 和用户信息
- 新增 JWT token 生成机制，基于用户 ID 生成 token
- 为所有用户相关接口添加 Guard 保护，要求认证后才能访问
- 登录成功后返回 `{token, info: {}}` 格式响应
- 登录页使用独立 Layout，不显示导航菜单
- Token 持久化到 localStorage，支持页面刷新后恢复

## Capabilities

### New Capabilities
- `user-auth`: 用户认证能力，包括登录、token 生成和验证
- `login-page`: 登录页面 UI 组件，提供用户名密码输入和提交功能

### Modified Capabilities
<!-- 现有 capabilities 的需求变更（不仅仅是实现）。仅当规范级别行为变更时列出。 -->

## Global Conventions

本项目遵循以下全局规范：
- **API 设计规范**: 所有接口统一使用 POST 方法（详见 `openspec/specs/api-convention.md`）

## Impact

- **前端 (packages/admin)**: 
  - 新增登录页面组件，使用 Vue3 + NaiveUI
  - 新增 Pinia/Vuex store 管理用户状态和 token
  - 登录接口调用写在 store 中
  - 路由守卫：每次跳转时调用 `store.getUserInfo` 重新获取用户信息
- **后端 (packages/server)**: 
  - 新增用户实体和认证模块
  - 新增 JWT Guard 装饰器
  - 所有用户接口需要添加 `@UseGuards(JwtGuard)` 保护
- **数据库**: 需要 users 表存储用户信息（用户名、密码哈希）
- **依赖**: `@nestjs/jwt`, `bcrypt` 已安装
