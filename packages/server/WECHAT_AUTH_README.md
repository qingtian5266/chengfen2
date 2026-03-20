# 微信登录模块使用说明

## 功能概述

本模块实现了微信 OAuth2.0 登录功能，包括：
- 微信授权登录
- 微信用户列表查询
- 微信用户详情查询

## 环境配置

在 `.env.local` 文件中配置微信相关参数：

```env
WECHAT_APP_ID=your-wechat-app-id
WECHAT_APP_SECRET=your-wechat-app-secret
```

### 获取微信 AppID 和 AppSecret

1. 登录 [微信公众平台](https://mp.weixin.qq.com/)
2. 进入 开发 -> 基本配置
3. 获取 开发者 ID (AppID) 和 开发者密码 (AppSecret)

### 微信授权回调域名配置

在微信公众平台配置授权回调域名（用于前端获取 code）

## API 接口

### 1. 微信登录

**接口：** `POST /api/wechat-auth/login`

**请求参数：**
```json
{
  "code": "微信授权返回的 code"
}
```

**响应：**
```json
{
  "token": "JWT token",
  "user": {
    "id": 1,
    "openid": "wx_openid_xxx",
    "nickname": "用户昵称",
    "avatar": "头像 URL",
    "sex": 1,
    "phone": "手机号",
    "role": "user"
  }
}
```

**流程说明：**
1. 前端引导用户微信授权，获取授权 code
2. 后端使用 code 换取 access_token 和用户信息
3. 创建或更新微信用户记录
4. 返回 JWT token 用于后续接口认证

### 2. 获取微信用户列表（需认证）

**接口：** `POST /api/wechat-auth/list`

**请求参数：**
```json
{
  "page": 1,
  "pageSize": 20,
  "keyword": "可选，昵称关键词搜索"
}
```

**响应：**
```json
{
  "list": [
    {
      "id": 1,
      "openid": "wx_openid_xxx",
      "nickname": "用户昵称",
      "avatar": "头像 URL",
      "sex": 1,
      "phone": "手机号",
      "province": "省份",
      "city": "城市",
      "role": "user",
      "last_login_at": "2026-03-11T10:00:00.000Z",
      "created_at": "2026-03-11T10:00:00.000Z"
    }
  ],
  "total": 100,
  "page": 1,
  "pageSize": 20
}
```

### 3. 获取微信用户详情（需认证）

**接口：** `POST /api/wechat-auth/detail`

**请求参数：**
```json
{
  "id": 1
}
```

**响应：**
```json
{
  "id": 1,
  "openid": "wx_openid_xxx",
  "unionid": "wx_unionid_xxx",
  "nickname": "用户昵称",
  "sex": 1,
  "province": "省份",
  "city": "城市",
  "country": "国家",
  "avatar": "头像 URL",
  "phone": "手机号",
  "role": "user",
  "status": 1,
  "last_login_at": "2026-03-11T10:00:00.000Z",
  "created_at": "2026-03-11T10:00:00.000Z",
  "updated_at": "2026-03-11T10:00:00.000Z"
}
```

### 4. 通过 openid 获取用户详情（需认证）

**接口：** `POST /api/wechat-auth/detail-by-openid`

**请求参数：**
```json
{
  "openid": "wx_openid_xxx"
}
```

## 前端接入示例

### 微信网页授权流程

```javascript
// 1. 构建微信授权 URL（前端）
const redirectUri = encodeURIComponent('https://your-domain.com/callback');
const authUrl = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${APP_ID}&redirect_uri=${redirectUri}&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect`;

// 2. 用户授权后跳转到 redirectUri?code=CODE

// 3. 使用 code 调用后端登录接口
const response = await fetch('/api/wechat-auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ code: 'CODE' })
});
const { token, user } = await response.json();

// 4. 保存 token，后续请求携带 token
localStorage.setItem('token', token);
```

## 数据库表结构

表名：`wechat_user`

| 字段 | 类型 | 说明 |
|------|------|------|
| id | int | 主键 |
| openid | varchar(50) | 微信 openid（唯一） |
| unionid | varchar(100) | 微信 unionid |
| nickname | varchar(100) | 昵称 |
| sex | tinyint | 性别 0-未知 1-男 2-女 |
| province | varchar(50) | 省份 |
| city | varchar(50) | 城市 |
| country | varchar(100) | 国家 |
| avatar | varchar(255) | 头像 URL |
| phone | varchar(100) | 手机号 |
| status | tinyint | 状态 0-禁用 1-启用 |
| role | varchar(20) | 角色 admin/user |
| access_token | varchar(255) | 微信 access_token |
| token_expires_at | int | access_token 过期时间戳 |
| refresh_token | varchar(100) | 微信 refresh_token |
| scope | varchar(50) | 授权作用域 |
| last_login_at | datetime | 最后登录时间 |
| created_at | datetime | 创建时间 |
| updated_at | datetime | 更新时间 |

## 注意事项

1. **微信测试号**：开发环境可以使用 [微信测试号](https://mp.weixin.qq.com/debug/cgi-bin/sandbox?t=sandbox/login)
2. **HTTPS 要求**：生产环境授权回调域名必须使用 HTTPS
3. **Token 刷新**：access_token 有效期 2 小时，过期需使用 refresh_token 刷新
4. **用户隐私**：获取用户手机号需要额外授权（使用 `snsapi_userinfo` 作用域）
