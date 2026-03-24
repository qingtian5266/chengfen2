## Why

需要管理食品添加剂信息，包括添加剂的基本信息、分类、风险等级、使用标准等。当前系统缺少食品添加剂管理功能，无法对添加剂数据进行增删改查操作。

## What Changes

- 新增食品添加剂管理模块（后端 + 前端）
- 后端提供添加剂的增删改查接口（列表无分页）
- 前端实现添加剂管理页面，支持列表查看、新增、编辑、删除
- 新增和编辑复用同一页面（非弹窗形式）
- 遵循全局 API 规范：所有接口使用 POST 方法

## Capabilities

### New Capabilities
- `additive`: 食品添加剂管理能力，包括增删改查接口和数据实体
- `additive-admin`: 添加剂管理后台页面，支持列表展示、新增、编辑、删除操作

### Modified Capabilities
<!-- 现有 capabilities 的需求变更（不仅仅是实现）。仅当规范级别行为变更时列出。 -->

## Impact

- **后端 (packages/server)**:
  - 新增 Additive 实体（包含 14 个字段）
  - 新增 AdditiveModule、AdditiveService、AdditiveController
  - 新增增删改查 4 个接口（POST 方法）
- **前端 (packages/admin)**:
  - 新增添加剂管理路由 `/additives`
  - 新增添加剂列表页面
  - 新增添加剂表单页面（新增/编辑复用）
  - 新增添加剂相关 API 调用函数
- **数据库**: 需要 additive 表存储食品添加剂数据
- **依赖**: 遵循现有项目架构和 API 规范
