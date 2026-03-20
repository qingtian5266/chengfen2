## Context

当前系统已有用户认证模块和基础架构，需要扩展食品添加剂管理功能。食品添加剂是食品安全管理的重要数据，需要完整的管理界面。

**技术栈:**
- 后端：NestJS 10 + TypeORM + MySQL2
- 前端：Vue3 + NaiveUI
- 全局规范：所有 API 使用 POST 方法

**字段列表（14 个）:**
| 字段 | 类型 | 说明 |
|------|------|------|
| id | number | 主键 |
| nameCn | string | 中文名称 |
| nameEn | string | 英文名称 |
| alias | string | 别名 |
| description | string | 描述 |
| type | string | 分类 |
| riskLevel | string | 风险等级 |
| dailyLimit | string | 每日限值 |
| nationalStandard | string | 国家标准类别 |
| internationalCode | string | 国际编号 |
| productionMethod | string | 生成方式 |
| mainUsage | string | 主要用途 |
| healthRisk | string | 健康风险描述 |

## Goals / Non-Goals

**Goals:**
- 实现添加剂完整 CRUD 功能
- 列表无分页，一次性展示所有数据
- 新增和编辑复用同一页面（路由区分）
- 遵循项目 API 规范（POST 方法）

**Non-Goals:**
- 不包含添加剂导入/导出功能
- 不包含批量操作
- 不包含审核流程

## Decisions

### 1. 数据库设计
**决策:** 创建 additive 表，所有字段使用 varchar 类型（除 id 外）
**理由:**
- 每日限值可能是范围值（如"0-50mg"），使用 string 更灵活
- 风险等级使用中文描述（如"低风险"、"中风险"、"高风险"）
- 简化类型设计，便于前端展示

### 2. API 设计
**决策:** 4 个接口，全部使用 POST 方法
- `POST /additive/list` - 获取列表（无分页）
- `POST /additive/create` - 新增
- `POST /additive/update` - 更新
- `POST /additive/delete` - 删除

**理由:**
- 遵循项目全局 API 规范
- 与现有用户管理接口风格一致

### 3. 前端路由设计
**决策:** 
- 列表页：`/additives`
- 新增/编辑页：`/additives/edit`
- 通过 `route.query.id` 区分：无 id 为新增，有 id 为编辑

**理由:**
- 列表和表单使用独立页面组件
- 通过 query.id 是否存在区分新增/编辑模式
- 路由语义清晰：`/additives/edit` 表示编辑操作
- 新增时不传 id，编辑时传 `?id=xxx`

### 4. 表单验证
**决策:** 必填字段：中文名称 (nameCn)、英文名称 (nameEn)
**理由:**
- 中文名称和英文名称是最基本的识别信息
- 其他字段为可选，便于灵活录入

### 5. 列表展示
**决策:** 表格展示，显示关键字段（中文名称、英文名称、分类、风险等级、国际编号）
**理由:**
- 避免列过多导致横向滚动
- 关键字段足够识别添加剂
- 点击编辑可查看完整信息

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| 数据量过大时列表性能问题 | 后续可添加分页或虚拟滚动 |
| 字段较多表单较长 | 使用分组布局优化展示 |
| 风险等级无统一标准 | 后续添加数据字典管理 |
| 国际编号格式不统一 | 添加格式验证规则 |

## Migration Plan

1. **数据库**: 创建 additive 表（TypeORM synchronize 自动创建或手动执行 SQL）
2. **后端开发**:
   - 创建 Additive 实体
   - 创建模块、服务、控制器
   - 实现 4 个接口
3. **前端开发**:
   - 创建路由配置
   - 创建列表页面
   - 创建表单页面（新增/编辑复用）
   - 创建 API 调用函数
4. **测试验证**: CRUD 功能测试

## Open Questions

- 是否需要添加剂分类的层级管理？（当前为单层分类）
- 是否需要图片/附件上传功能？
- 风险等级是否需要量化数值？
