> **全局规范**: 所有 API 接口统一使用 POST 方法
> 详见：`openspec/specs/api-convention.md`

## 1. 数据库准备

- [x] 1.1 创建 additive 表（14 个字段：id, nameCn, nameEn, alias, description, type, riskLevel, dailyLimit, nationalStandard, internationalCode, productionMethod, mainUsage, healthRisk, created_at, updated_at）

## 2. 后端 - Additive 实体和模块

- [x] 2.1 创建 Additive 实体类（packages/server/src/additive/additive.entity.ts）
- [x] 2.2 创建 Additive 模块（packages/server/src/additive/additive.module.ts）
- [x] 2.3 创建 AdditiveService（提供 list, create, update, delete 方法）
- [x] 2.4 创建 AdditiveController（实现 4 个 POST 接口）

## 3. 后端 - 接口实现

- [x] 3.1 实现 POST /additive/list 接口（返回全部数据，无分页）
- [x] 3.2 实现 POST /additive/create 接口（验证必填字段，检查中文名称重复）
- [x] 3.3 实现 POST /additive/update 接口（根据 id 更新，验证必填字段）
- [x] 3.4 实现 POST /additive/delete 接口（根据 id 删除）
- [x] 3.5 添加 DTO 类（CreateAdditiveDto, UpdateAdditiveDto）使用 class-validator 验证

## 4. 前端 - 路由配置

- [x] 4.1 在 admin 路由中添加 `/additives` 路由（列表页）
- [x] 4.2 添加 `/additives/edit` 路由（新增/编辑页）

## 5. 前端 - API 模块

- [x] 5.1 创建添加剂 API 文件（packages/admin/src/api/additive.ts）
- [x] 5.2 实现 list 函数：调用 POST /additive/list
- [x] 5.3 实现 create 函数：调用 POST /additive/create
- [x] 5.4 实现 update 函数：调用 POST /additive/update
- [x] 5.5 实现 delete 函数：调用 POST /additive/delete

## 6. 前端 - 列表页面

- [x] 6.1 创建添加剂列表页面（packages/admin/src/views/AdditiveListView.vue）
- [x] 6.2 实现表格展示（关键字段：中文名称、英文名称、分类、风险等级、国际编号）
- [x] 6.3 实现操作列（编辑按钮、删除按钮）
- [x] 6.4 实现新增按钮（跳转到 /additives/edit）
- [x] 6.5 实现删除确认对话框
- [x] 6.6 实现页面加载时获取列表数据

## 7. 前端 - 表单页面（新增/编辑复用）

- [x] 7.1 创建添加剂表单页面（packages/admin/src/views/AdditiveFormView.vue）
- [x] 7.2 实现 14 个字段的表单输入
- [x] 7.3 实现字段分组布局（基本信息、分类与标准、用途与风险）
- [x] 7.4 实现必填字段验证（中文名称 nameCn、英文名称 nameEn）
- [x] 7.5 实现编辑模式识别（route.query.id 存在为编辑模式，无为新增模式）
- [x] 7.6 编辑模式下根据 id 加载现有数据
- [x] 7.7 实现保存功能（新增调用 create，编辑调用 update）
- [x] 7.8 实现取消/返回按钮（跳转回列表页）
- [x] 7.9 实现保存成功后刷新列表并跳转回列表页

## 8. 导航和菜单

- [x] 8.1 在 App.vue 导航栏中添加"添加剂管理"链接
- [ ] 8.2 配置菜单权限（如需要）

## 9. 测试和验证

- [x] 9.1 测试列表接口返回全部数据
- [x] 9.2 测试新增功能（必填字段验证、名称重复检查）
- [x] 9.3 测试编辑功能（数据加载、更新保存）
- [x] 9.4 测试删除功能（确认对话框、删除成功）
- [x] 9.5 测试前端路由跳转
- [x] 9.6 测试表单验证
