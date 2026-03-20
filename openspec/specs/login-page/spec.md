## ADDED Requirements

### Requirement: 登录页使用独立 Layout
系统 SHALL 为登录页提供独立的 Layout，不显示导航菜单，全屏展示。

#### Scenario: 登录页无导航菜单
- **WHEN** 管理员访问登录页面 `/login`
- **THEN** 系统不显示顶部导航菜单，页面全屏展示

#### Scenario: 其他页面显示导航菜单
- **WHEN** 管理员访问非登录页面（如首页、用户管理页）
- **THEN** 系统显示顶部导航菜单

### Requirement: 管理员访问登录页面
系统 SHALL 提供登录页面，允许管理员输入用户名和密码进行登录。

#### Scenario: 访问登录页
- **WHEN** 管理员访问登录页面路由 `/login`
- **THEN** 系统显示登录表单，包含用户名和密码输入框

#### Scenario: 登录表单初始状态
- **WHEN** 登录页面加载完成
- **THEN** 表单为空，登录按钮处于可用状态

### Requirement: 管理员输入登录凭据
系统 SHALL 允许管理员在登录表单中输入用户名和密码。

#### Scenario: 输入用户名
- **WHEN** 管理员在用户名输入框中输入内容
- **THEN** 系统显示管理员输入的内容（明文）

#### Scenario: 输入密码
- **WHEN** 管理员在密码输入框中输入内容
- **THEN** 系统以密文（圆点）形式显示

### Requirement: 管理员提交登录表单
系统 SHALL 通过 store 调用登录 API 进行认证。

#### Scenario: 提交空用户名
- **WHEN** 管理员未输入用户名直接点击登录
- **THEN** 系统提示"请输入用户名"，不调用 API

#### Scenario: 提交空密码
- **WHEN** 管理员未输入密码直接点击登录
- **THEN** 系统提示"请输入密码"，不调用 API

#### Scenario: 登录成功
- **WHEN** 管理员输入正确的用户名和密码并提交
- **THEN** store 调用登录 API，存储 token 和用户信息到 localStorage，跳转到首页

#### Scenario: 登录失败
- **WHEN** 管理员输入错误的用户名或密码并提交
- **THEN** 系统显示错误提示"用户名或密码错误"

#### Scenario: 登录中状态
- **WHEN** 管理员点击登录按钮后 API 请求进行中
- **THEN** 系统显示加载状态，禁用登录按钮防止重复提交

### Requirement: 登录状态由 store 管理
系统 SHALL 使用 store（Pinia/Vuex）管理用户认证状态。

#### Scenario: 登录 action 调用
- **WHEN** 管理员提交登录表单
- **THEN** 调用 store 的 login action，该 action 负责调用登录 API

#### Scenario: token 存储
- **WHEN** 登录成功接收到 token
- **THEN** store 将 token 同时存储到 state 和 localStorage

#### Scenario: 用户信息存储
- **WHEN** 登录成功接收到用户信息
- **THEN** store 将用户信息存储到 state 中

#### Scenario: 页面刷新恢复 token
- **WHEN** 管理员刷新页面或重新打开应用
- **THEN** store 从 localStorage 恢复 token 到 state

### Requirement: 路由守卫验证用户信息
系统 SHALL 在每次路由跳转时调用 `store.getUserInfo` 重新获取用户信息。

#### Scenario: 路由跳转时获取用户信息
- **WHEN** 管理员在已登录状态下进行路由跳转
- **THEN** 路由守卫调用 `store.getUserInfo` 接口重新获取用户信息

#### Scenario: getUserInfo 成功
- **WHEN** `getUserInfo` 接口返回成功
- **THEN** store 更新用户信息，允许路由跳转

#### Scenario: getUserInfo 失败（token 过期或无效）
- **WHEN** `getUserInfo` 接口返回 401 错误
- **THEN** store 清除本地 token 和用户信息，重定向到登录页

#### Scenario: 未登录访问受保护页面
- **WHEN** 管理员未登录（无 token）访问需要认证的页面
- **THEN** 路由守卫重定向到登录页 `/login`

### Requirement: 携带 token 访问 API
系统 SHALL 在所有 API 请求中自动携带 token。

#### Scenario: API 请求拦截器
- **WHEN** 发起任何 API 请求
- **THEN** 请求拦截器从 store 读取 token（如果 store 中没有则从 localStorage 读取）并添加到 Authorization header

#### Scenario: token 格式
- **WHEN** 添加 token 到请求头
- **THEN** 使用 `Bearer <token>` 格式
