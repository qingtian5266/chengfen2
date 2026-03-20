## ADDED Requirements

### Requirement: 用户使用用户名和密码登录
系统 SHALL 允许用户通过用户名和密码进行身份验证，验证成功后返回 JWT token 和用户基本信息。

#### Scenario: 登录成功
- **WHEN** 用户提供正确的用户名和密码
- **THEN** 系统返回包含 token 和用户信息的响应 `{token, info: {id, username}}`

#### Scenario: 用户名不存在
- **WHEN** 用户提供的用户名在系统中不存在
- **THEN** 系统返回 401 错误，提示"用户名或密码错误"

#### Scenario: 密码错误
- **WHEN** 用户名存在但密码错误
- **THEN** 系统返回 401 错误，提示"用户名或密码错误"

#### Scenario: 请求体缺少必填字段
- **WHEN** 登录请求缺少 username 或 password 字段
- **THEN** 系统返回 400 错误，提示缺少必填字段

### Requirement: 系统生成和验证 JWT token
系统 SHALL 使用用户的 ID 生成 JWT token，并能够验证 token 的有效性。

#### Scenario: 生成 token
- **WHEN** 用户登录成功
- **THEN** 系统使用用户 ID 和 JWT_SECRET 生成有效期为 7 天的 token

#### Scenario: token 验证成功
- **WHEN** 请求携带有效的未过期 token
- **THEN** Guard 允许请求通过，并解析出 userId

#### Scenario: token 已过期
- **WHEN** 请求携带已过期的 token
- **THEN** Guard 拒绝请求，返回 401 错误

#### Scenario: token 格式无效
- **WHEN** 请求携带格式错误的 token
- **THEN** Guard 拒绝请求，返回 401 错误

### Requirement: 用户接口需要认证保护
所有用户相关的接口 SHALL 要求请求携带有效的 JWT token，未认证的请求将被拒绝。

#### Scenario: 携带有效 token 访问受保护接口
- **WHEN** 用户携带有效 token 访问受保护的用户接口
- **THEN** 接口正常返回数据

#### Scenario: 未携带 token 访问受保护接口
- **WHEN** 用户未携带 token 访问受保护的用户接口
- **THEN** 接口返回 401 错误

#### Scenario: 公开接口无需认证
- **WHEN** 用户访问标记为 @Public() 的接口（如登录接口）
- **THEN** 接口正常处理，不要求 token

### Requirement: 用户密码加密存储
系统 SHALL 使用 bcrypt 算法对用户密码进行哈希加密后存储。

#### Scenario: 新用户密码存储
- **WHEN** 创建新用户时
- **THEN** 系统使用 bcrypt（saltRounds=10）对密码进行哈希后存储

#### Scenario: 密码验证
- **WHEN** 用户登录时
- **THEN** 系统使用 bcrypt.compare 验证输入密码与存储的哈希值是否匹配
