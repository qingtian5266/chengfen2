## ADDED Requirements

### Requirement: 查询食品添加剂列表
系统 SHALL 提供查询所有食品添加剂列表的接口，返回全部数据（无分页）。

#### Scenario: 获取添加剂列表
- **WHEN** 客户端调用列表接口
- **THEN** 系统返回所有添加剂数据，按创建时间倒序排列

#### Scenario: 列表字段完整
- **WHEN** 返回添加剂列表
- **THEN** 每个添加剂包含全部 14 个字段（id, nameCn, nameEn, alias, description, type, riskLevel, dailyLimit, nationalStandard, internationalCode, productionMethod, mainUsage, healthRisk）

### Requirement: 新增食品添加剂
系统 SHALL 提供新增食品添加剂的接口，验证必填字段后保存数据。

#### Scenario: 新增成功
- **WHEN** 客户端提交包含必填字段（nameCn, nameEn）的新增请求
- **THEN** 系统保存数据并返回新创建的添加剂信息（包含生成的 id）

#### Scenario: 必填字段缺失
- **WHEN** 客户端提交的新增请求缺少必填字段（nameCn 或 nameEn）
- **THEN** 系统返回 400 错误，提示缺少的字段

#### Scenario: 中文名称重复
- **WHEN** 客户端提交的中文名称已存在
- **THEN** 系统返回 400 错误，提示"中文名称已存在"

### Requirement: 编辑食品添加剂
系统 SHALL 提供修改食品添加剂信息的接口，根据 id 更新数据。

#### Scenario: 更新成功
- **WHEN** 客户端提交包含有效 id 和更新数据的请求
- **THEN** 系统更新数据并返回更新后的添加剂信息

#### Scenario: 添加剂不存在
- **WHEN** 客户端提交的 id 在系统中不存在
- **THEN** 系统返回 404 错误，提示"添加剂不存在"

#### Scenario: 必填字段缺失
- **WHEN** 客户端提交的更新请求中必填字段（nameCn 或 nameEn）为空
- **THEN** 系统返回 400 错误，提示必填字段不能为空

### Requirement: 删除食品添加剂
系统 SHALL 提供删除食品添加剂的接口，根据 id 删除数据。

#### Scenario: 删除成功
- **WHEN** 客户端提交包含有效 id 的删除请求
- **THEN** 系统删除数据并返回成功响应

#### Scenario: 添加剂不存在
- **WHEN** 客户端提交的 id 在系统中不存在
- **THEN** 系统返回 404 错误，提示"添加剂不存在"

### Requirement: 食品添加剂数据结构
系统 SHALL 使用以下 14 个字段存储食品添加剂信息。

#### Scenario: 字段定义
- **WHEN** 创建或查询添加剂
- **THEN** 数据包含以下字段：
  - id: 主键
  - nameCn: 中文名称（必填）
  - nameEn: 英文名称（必填）
  - alias: 别名
  - description: 描述
  - type: 分类
  - riskLevel: 风险等级
  - dailyLimit: 每日限值
  - nationalStandard: 国家标准类别
  - internationalCode: 国际编号
  - productionMethod: 生成方式
  - mainUsage: 主要用途
  - healthRisk: 健康风险描述
