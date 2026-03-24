## Why

当前 `packages/admin` 仍是默认示例页面，无法在后台直接维护用户。考虑到当前用户量和字段都较少，采用“简单列表 + 新增/编辑/删除”的轻量方案能更快交付并降低维护复杂度。

## What Changes

- 在 admin 端新增“用户管理”页面与路由入口，展示用户列表。
- 页面仅保留列表展示，不提供分页能力。
- 页面不提供用户详情查看能力。
- 提供新增、编辑、删除用户能力，对应调用 `/users/create`、`/users/update`、`/users/delete`。
- 新增与编辑复用同一个弹框表单组件，按模式区分初始化数据与提交行为。
- 增加前端 API 封装与基础表单校验，统一错误提示与请求状态反馈。

## Capabilities

### New Capabilities
- `admin-user-management`: 管理员可在后台查看用户列表并完成新增、编辑、删除，新增和编辑复用同一弹框。

### Modified Capabilities
- None.

## Impact

- 前端：`packages/admin/src/router`、`packages/admin/src/views`、`packages/admin/src/components`（新增用户列表与用户表单弹框组件）、API 请求层。
- 后端：复用 `packages/server/src/modules/users` 现有接口，重点使用 `/users/list`、`/users/create`、`/users/update`、`/users/delete`。
- 联调：需确认列表接口在“无分页展示”前提下的请求参数约定（前端固定请求第一页较大 size）。
- 测试：覆盖列表加载、新增、编辑、删除、错误提示与弹框复用流程。
