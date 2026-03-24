> **全局规范**: 所有 API 接口统一使用 POST 方法
> 详见：`openspec/specs/api-convention.md`

## 1. 后端 - 微信用户删除接口

- [x] 1.1 在 WechatService 中添加 delete 方法（软删除，更新 status=0）
- [x] 1.2 在 WechatController 中添加 POST /wechat/delete 接口
- [x] 1.3 添加 @Public() 装饰器或确保接口有 JWT 保护

## 2. 前端 - 路由配置

- [x] 2.1 在 admin 路由中添加 `/wechat-users` 路由

## 3. 前端 - API 模块

- [x] 3.1 创建微信用户 API 文件（packages/admin/src/api/wechat-user.ts）
- [x] 3.2 实现 listWechatUsers 函数：调用 POST /wechat/list
- [x] 3.3 实现 deleteWechatUser 函数：调用 POST /wechat/delete

## 4. 前端 - 列表页面

- [x] 4.1 创建微信用户列表页面（packages/admin/src/views/WechatUserListView.vue）
- [x] 4.2 实现表格展示所有 17 个字段
- [x] 4.3 实现头像列显示缩略图（带默认头像兜底）
- [x] 4.4 实现操作列（删除按钮）
- [x] 4.5 实现删除确认对话框
- [x] 4.6 实现页面加载时获取全部列表数据（无分页）

## 5. 导航和菜单

- [x] 5.1 在 App.vue 导航栏中添加"微信用户"链接

## 6. 测试和验证

- [x] 6.1 测试列表接口返回全部数据
- [x] 6.2 测试删除功能（确认对话框、软删除）
- [x] 6.3 测试前端路由跳转
- [x] 6.4 测试头像显示
