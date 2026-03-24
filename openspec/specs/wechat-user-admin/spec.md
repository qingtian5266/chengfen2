## ADDED Requirements

### Requirement: 查看微信用户列表
系统 SHALL 提供微信用户列表展示功能，展示所有字段数据。

#### Scenario: 获取用户列表
- **WHEN** 管理员访问微信用户管理页面
- **THEN** 系统调用后端 list 接口，返回全部数据（无分页）

#### Scenario: 列表字段展示
- **WHEN** 展示微信用户列表
- **THEN** 表格显示所有 17 个字段：头像、openid, unionid, 昵称，性别，省份，城市，国家，手机号，状态，角色，最后登录时间，创建时间

#### Scenario: 头像展示
- **WHEN** 展示用户头像
- **THEN** 显示头像缩略图，如头像 URL 为空则显示默认头像

### Requirement: 删除微信用户
系统 SHALL 提供删除（禁用）微信用户的功能，采用软删除。

#### Scenario: 删除确认
- **WHEN** 管理员点击"删除"按钮
- **THEN** 系统弹出确认对话框，提示"确认删除该用户吗？"

#### Scenario: 确认删除
- **WHEN** 管理员在确认对话框中点击"确定"
- **THEN** 系统调用 delete 接口，将用户 status 更新为 0，提示"删除成功"

#### Scenario: 取消删除
- **WHEN** 管理员在确认对话框中点击"取消"
- **THEN** 系统关闭对话框，不执行删除操作

#### Scenario: 删除失败
- **WHEN** 删除的用户不存在
- **THEN** 系统提示错误信息

### Requirement: 用户状态管理
系统 SHALL 支持启用/禁用微信用户。

#### Scenario: 禁用用户
- **WHEN** 管理员删除用户
- **THEN** 用户 status 更新为 0，无法登录

#### Scenario: 启用用户
- **WHEN** 管理员启用已禁用的用户
- **THEN** 用户 status 更新为 1，可以正常登录
