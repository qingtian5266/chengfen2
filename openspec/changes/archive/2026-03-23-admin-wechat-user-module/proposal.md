## Why

后端已有微信用户模块（WechatUser），但 admin 管理端缺少对应的管理界面。需要在 admin 端添加微信用户管理功能，方便运营人员查看和管理微信用户数据。

## What Changes

- 新增 admin 端微信用户管理模块
- 实现微信用户列表展示（支持关键词搜索）
- 实现微信用户删除功能
- 实现微信用户详情查看
- 遵循全局 API 规范：所有接口使用 POST 方法

## Capabilities

### New Capabilities
- `wechat-user-admin`: 微信用户管理后台页面，包括列表展示、搜索、删除功能

### Modified Capabilities
<!-- 现有 capabilities 的需求变更（不仅仅是实现）。仅当规范级别行为变更时列出。 -->

## Impact

- **前端 (packages/admin)**:
  - 新增微信用户管理路由 `/wechat-users`
  - 新增微信用户列表页面
  - 新增微信用户 API 调用函数
- **后端 (packages/server)**:
  - 已有 WechatUser 实体和 WechatModule
  - 已有 list、detail 接口（需要确认是否有 delete 接口）
  - 可能需要新增 delete 接口
- **依赖**: 遵循现有项目架构和 API 规范（所有接口使用 POST）
