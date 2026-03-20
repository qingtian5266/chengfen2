> **全局规范**: 所有 API 接口统一使用 POST 方法
> 详见：`openspec/specs/api-convention.md`

## 1. 数据库准备

- [x] 1.1 创建 users 表（id, username, password, created_at）
- [ ] 1.2 插入初始测试用户数据（可选）

## 2. 后端 - User 实体和模块

- [x] 2.1 创建 User 实体类（packages/server/src/user/user.entity.ts）
- [x] 2.2 创建 User 模块（packages/server/src/user/user.module.ts）
- [x] 2.3 创建 UserService（提供 findByUsername 方法）

## 3. 后端 - Auth 模块

- [x] 3.1 创建 Auth 模块结构（packages/server/src/auth/）
- [x] 3.2 创建 LoginDto（包含 username, password，使用 class-validator 验证）
- [x] 3.3 创建 AuthService（提供 validateUser 和 generateToken 方法）
- [x] 3.4 创建 AuthController（实现 POST /api/auth/login 接口）
- [x] 3.5 配置 JWT 模块（JwtModule.register，从 ConfigService 读取 secret）
- [x] 3.6 登录接口返回格式：`{token, info: {id, username}}`

## 4. 后端 - JWT Guard

- [x] 4.1 创建 JwtStrategy（继承 PassportStrategy）
- [x] 4.2 创建 JwtGuard（继承 AuthGuard('jwt')）
- [x] 4.3 创建 @Public() 装饰器（使用 SetMetadata）
- [x] 4.4 创建 JwtAuthGuard（检查 @Public() 元数据，决定是否需要认证）
- [x] 4.5 在全局或模块中应用 JwtAuthGuard

## 5. 后端 - 保护用户接口

- [x] 5.1 识别所有需要保护的用户相关接口
- [x] 5.2 为这些接口添加 `@UseGuards(JwtAuthGuard)` 或使用全局守卫
- [x] 5.3 公开接口（如登录）添加 `@Public()` 装饰器
- [x] 5.4 从 token 中解析 userId 并注入到请求中

## 6. 前端 - Store 配置

- [x] 6.1 安装 Pinia（如未安装）：`pnpm add pinia`
- [x] 6.2 创建 store 目录结构（packages/admin/src/store/）
- [x] 6.3 创建 user store（packages/admin/src/store/user.ts）
- [x] 6.4 实现 state：token, userInfo
- [x] 6.5 实现 login action：调用登录 API，存储 token 和用户信息
- [x] 6.6 实现 getUserInfo action：调用 /user/info 接口获取用户信息
- [x] 6.7 实现 logout action：清除 token 和用户信息，跳转到登录页

## 7. 前端 - API 模块

- [x] 7.1 创建请求拦截器（packages/admin/src/utils/request.ts 或类似）
- [x] 7.2 拦截器从 store 读取 token 并添加到 Authorization header
- [x] 7.3 创建 auth API 文件（packages/admin/src/api/auth.ts）
- [x] 7.4 实现 login 函数：调用 POST /api/auth/login
- [x] 7.5 实现 getUserInfo 函数：调用 GET /user/info

## 8. 前端 - 登录页面

- [x] 8.1 创建登录页面（packages/admin/src/views/LoginView.vue）
- [x] 8.2 实现登录表单 UI（用户名输入框、密码输入框、登录按钮），使用 NaiveUI 组件
- [x] 8.3 实现表单验证逻辑（空值检查）
- [x] 8.4 调用 store.login action
- [x] 8.5 处理登录成功：跳转到首页
- [x] 8.6 处理登录失败：显示错误提示
- [x] 8.7 实现登录中状态：禁用按钮，显示 loading

## 9. 前端 - 路由守卫

- [x] 9.1 创建路由守卫（packages/admin/src/router/index.ts 或单独文件）
- [x] 9.2 实现 beforeEach 守卫：检查目标路由是否需要认证
- [x] 9.3 已登录访问登录页：重定向到首页
- [x] 9.4 未登录访问受保护页面：重定向到登录页
- [x] 9.5 已登录访问受保护页面：调用 store.getUserInfo 重新获取用户信息
- [x] 9.6 getUserInfo 失败处理：清除状态，重定向到登录页

## 10. 配置和环境

- [x] 10.1 配置 JWT_SECRET 环境变量（.env 文件）
- [x] 10.2 配置数据库连接（确认 TypeORM 配置）
- [x] 10.3 配置前端 API 基础 URL（VUE_APP_API_BASE_URL 或类似）

## 11. 测试和验证

- [x] 11.1 测试登录成功流程
- [x] 11.2 测试登录失败场景（错误密码、不存在的用户）
- [x] 11.3 测试 Guard 保护：未登录访问受保护接口返回 401
- [x] 11.4 测试 Guard 保护：登录后访问受保护接口成功
- [x] 11.5 测试路由守卫：未登录访问受保护页面跳转到登录页
- [x] 11.6 测试路由守卫：每次跳转调用 getUserInfo
- [x] 11.7 测试 token 过期场景：getUserInfo 失败后跳转到登录页
