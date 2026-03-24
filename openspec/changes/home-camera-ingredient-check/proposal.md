## Why

首页"拍照查成分"按钮当前跳转到独立的识别页面，用户需要额外点击才能使用相机。为了缩短用户操作路径，点击后应直接调用小程序相机菜单（包含拍照和从相册选择），提升查成分效率。

## What Changes

- 首页"拍照查成分"按钮点击后直接弹出小程序相机菜单
- 相机菜单提供两个选项：**拍照**和**从相册选择**
- 用户选择图片后自动跳转到识别结果页或成分分析流程
- 保持现有识别功能不变，仅优化入口交互

## Capabilities

### New Capabilities

- `home-camera-entry`: 首页相机入口交互，定义相机菜单调用、图片选择后的跳转逻辑

### Modified Capabilities

<!-- 无现有 capability 需要修改，这是新增的入口交互 -->

## Impact

- 修改首页 `pages/index/index.vue` 的 `goRecognition` 方法
- 调用 Taro 原生 API：`Taro.chooseImage`（已确认项目现有使用）
- 依赖现有识别页面 `pages/recognition/index` 处理图片
- 不影响现有扫码、链接查成分等其他入口
