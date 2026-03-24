## ADDED Requirements

### Requirement: 查看添加剂管理页面
系统 SHALL 提供食品添加剂管理页面，展示添加剂列表。

#### Scenario: 访问管理页面
- **WHEN** 管理员访问 `/additives` 路由
- **THEN** 系统显示添加剂列表页面，包含表格和操作按钮

#### Scenario: 列表展示
- **WHEN** 页面加载完成
- **THEN** 系统调用后端接口获取全部添加剂数据并以表格形式展示

#### Scenario: 表格字段
- **WHEN** 展示添加剂列表
- **THEN** 表格显示关键字段：中文名称、英文名称、分类、风险等级、国际编号

### Requirement: 新增添加剂
系统 SHALL 提供新增添加剂的功能，点击新增按钮进入表单页面。

#### Scenario: 进入新增页面
- **WHEN** 管理员点击"新增"按钮
- **THEN** 系统跳转到 `/additives/edit` 页面（无 query 参数），显示空表单

#### Scenario: 表单验证
- **WHEN** 管理员提交表单时缺少必填字段（nameCn 或 nameEn）
- **THEN** 系统提示"请填写必填字段"，不提交请求

#### Scenario: 新增成功
- **WHEN** 管理员填写完整信息并提交
- **THEN** 系统保存数据，提示"新增成功"，跳转回列表页

#### Scenario: 新增失败
- **WHEN** 提交的中文名称已存在
- **THEN** 系统提示错误信息，保持在表单页面

### Requirement: 编辑添加剂
系统 SHALL 提供编辑添加剂的功能，与新增复用同一页面，通过 query.id 区分。

#### Scenario: 进入编辑页面
- **WHEN** 管理员在列表页点击某条数据的"编辑"按钮
- **THEN** 系统跳转到 `/additives/edit?id=xxx` 页面，表单填充该数据的当前值

#### Scenario: 数据加载失败
- **WHEN** 编辑的添加剂 id 不存在
- **THEN** 系统提示"添加剂不存在"，跳转回列表页

#### Scenario: 更新成功
- **WHEN** 管理员修改信息并提交
- **THEN** 系统保存更新，提示"保存成功"，跳转回列表页

### Requirement: 删除添加剂
系统 SHALL 提供删除添加剂的功能，需要二次确认。

#### Scenario: 删除确认
- **WHEN** 管理员点击"删除"按钮
- **THEN** 系统弹出确认对话框，提示"确认删除该添加剂吗？"

#### Scenario: 取消删除
- **WHEN** 管理员在确认对话框中点击"取消"
- **THEN** 系统关闭对话框，不执行删除操作

#### Scenario: 确认删除
- **WHEN** 管理员在确认对话框中点击"确定"
- **THEN** 系统调用删除接口，成功后提示"删除成功"，刷新列表

#### Scenario: 删除失败
- **WHEN** 删除的添加剂不存在
- **THEN** 系统提示错误信息，保持在列表页

### Requirement: 表单字段布局
系统 SHALL 在新增/编辑页面展示完整的 14 个字段表单。

#### Scenario: 必填字段标识
- **WHEN** 显示表单
- **THEN** 必填字段（中文名称、英文名称）带有必填标识（*）

#### Scenario: 字段分组
- **WHEN** 显示表单
- **THEN** 字段按逻辑分组展示（基本信息、分类与标准、用途与风险）

#### Scenario: 表单提交
- **WHEN** 管理员点击"保存"按钮
- **THEN** 系统先进行前端验证（nameCn 和 nameEn 必填），验证通过后才提交请求

### Requirement: 返回列表
系统 SHALL 在表单页面提供返回按钮。

#### Scenario: 返回列表
- **WHEN** 管理员在表单页面点击"返回"按钮
- **THEN** 系统跳转回列表页 `/additives`
