# 项目 API 设计规范

## 全局约束

本规范适用于本项目所有 API 接口的开发，所有新增或修改的接口都必须遵循此规范。

---

## 1. 请求方法规范

### Requirement: 所有 API 接口统一使用 POST 方法
系统 SHALL 统一使用 POST 方法作为所有 API 接口的请求方式，包括查询、创建、更新、删除操作。

**理由:**
- 统一请求方法，降低开发和维护成本
- 避免 GET 请求参数长度限制
- 请求体使用 JSON 格式，结构更清晰
- 与小程序/移动端开发习惯保持一致

#### Scenario: 查询接口使用 POST
- **WHEN** 客户端调用查询类接口（如列表、详情、信息获取）
- **THEN** 使用 POST 方法，参数通过请求体传递
- **示例**: `POST /user/info`, `POST /users/list`

#### Scenario: 创建接口使用 POST
- **WHEN** 客户端调用创建类接口
- **THEN** 使用 POST 方法，数据通过请求体传递
- **示例**: `POST /users/create`

#### Scenario: 更新接口使用 POST
- **WHEN** 客户端调用更新类接口
- **THEN** 使用 POST 方法，数据通过请求体传递
- **示例**: `POST /users/update`

#### Scenario: 删除接口使用 POST
- **WHEN** 客户端调用删除类接口
- **THEN** 使用 POST 方法，参数通过请求体传递
- **示例**: `POST /users/delete`

---

## 2. 响应格式规范

### Requirement: 统一响应格式
系统 SHALL 使用统一的响应格式返回数据。

#### Scenario: 成功响应
- **WHEN** 接口调用成功
- **THEN** 返回格式：`{code: 0, data: {...}, message: "success"}`

#### Scenario: 错误响应
- **WHEN** 接口调用失败
- **THEN** 返回格式：`{code: 非 0 值，data: null, message: "错误信息"}`

---

## 3. 认证规范

### Requirement: Token 传递方式
系统 SHALL 在所有需要认证的接口中，通过 Authorization header 传递 JWT token。

#### Scenario: 携带 Token
- **WHEN** 客户端调用需要认证的接口
- **THEN** 在请求头中添加 `Authorization: Bearer <token>`

---

## 4. 前端调用规范

### Requirement: 前端统一使用 postJson 方法
前端 SHALL 统一使用 `postJson` 方法调用所有后端 API。

#### Scenario: API 调用
- **WHEN** 前端需要调用后端接口
- **THEN** 使用 `postJson(path, body)` 方法
- **示例**: 
  ```typescript
  // 登录
  const result = await postJson('/auth/login', { username, password });
  
  // 获取用户信息
  const userInfo = await postJson('/user/info', {});
  
  // 查询列表
  const list = await postJson('/users/list', { page: 1, size: 10 });
  ```

---

## 5. 路径命名规范

### Requirement: 接口路径命名
系统 SHALL 遵循 RESTful 风格的路径命名规范。

#### Scenario: 资源路径
- **WHEN** 定义 API 路径
- **THEN** 使用复数名词，如 `/users`, `/products`
- **示例**: `/users/list`, `/products/detail`

#### Scenario: 认证路径
- **WHEN** 定义认证相关接口
- **THEN** 使用 `/auth` 前缀
- **示例**: `/auth/login`, `/auth/register`

---

## 违规检查清单

开发时请自查：
- [ ] 是否使用了 POST 方法？（不是 GET/PUT/DELETE）
- [ ] 参数是否通过请求体传递？
- [ ] 响应格式是否符合 `{code, data, message}` 结构？
- [ ] 前端是否使用 `postJson` 方法调用？

---

**位置**: `openspec/specs/api-convention.md`  
**适用范围**: 项目所有 API 接口  
**最后更新**: 2026-03-20
