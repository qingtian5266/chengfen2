## Context

当前首页"拍照查成分"按钮点击后跳转到 `pages/recognition/index` 页面，用户需要在该页面再次点击"选择图片"按钮才能调用相机。项目使用 Taro 框架，已封装 `Taro.chooseImage` API 支持相机拍照和相册选择。

## Goals / Non-Goals

**Goals:**
- 首页点击"拍照查成分"后直接弹出系统图片选择器（含拍照和相册选项）
- 用户选择图片后自动跳转到识别页面并携带图片
- 保持现有识别逻辑不变，复用 `recognitionApi.ocr` 接口

**Non-Goals:**
- 不修改识别页面的核心 OCR 逻辑
- 不新增相机硬件 API，使用 Taro 封装的 `chooseImage`
- 不涉及图片上传服务端改造

## Decisions

### 1. 使用 `Taro.chooseImage` 而非原生相机 API

**选择:** 使用 `Taro.chooseImage({ count: 1, sourceType: ['camera', 'album'] })`

**理由:**
- 项目现有代码已在 `recognition/index.vue` 中使用此 API
- Taro 跨框架兼容，自动处理小程序平台差异
- 单次调用同时支持拍照和相册，无需自定义菜单

**备选:** 使用 `wx.chooseMedia` 或原生相机组件 → 增加复杂度，无额外收益

### 2. 图片传递方式

**选择:** 通过 URL 参数传递临时图片路径 `tempFilePath` 到识别页

**理由:**
- 现有 `recognition/index.vue` 已支持通过 `imageUrl` 接收图片
- 临时路径在小程序生命周期内有效
- 避免全局状态管理复杂度

### 3. 跳转策略

**选择:** 用户选择图片后直接跳转到 `pages/recognition/index?imageSource=selected`

**理由:**
- 识别页面已有完整的图片预览和 OCR 流程
- 保持用户操作流程连贯
- 可通过参数区分"首页入口"和"独立识别"场景（用于后续埋点）

## Risks / Trade-offs

**[Risk]** 临时图片路径在小程序后台后可能失效 → **Mitigation:** 识别页面已在本地使用 `tempFilePath`，无需持久化

**[Risk]** 用户取消选择后无反馈 → **Mitigation:** 在 `catch` 分支添加轻提示

**[Trade-off]** 不新增独立相机组件 → 复用现有识别页，代码改动最小化
