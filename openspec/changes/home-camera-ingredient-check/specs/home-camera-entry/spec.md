## ADDED Requirements

### Requirement: 首页拍照查成分按钮调用相机菜单
系统 SHALL 在用户点击首页"拍照查成分"按钮后，直接弹出系统图片选择器，提供拍照和从相册选择两个选项。

#### Scenario: 点击按钮弹出选择器
- **WHEN** 用户点击首页"拍照查成分"按钮
- **THEN** 系统弹出图片选择器，显示"拍照"和"从相册选择"选项

#### Scenario: 选择器来源配置
- **WHEN** 选择器弹出时
- **THEN** `sourceType` 配置为 `['camera', 'album']`，同时支持相机和相册

### Requirement: 用户选择图片后跳转识别页
系统 SHALL 在用户选择图片后，携带图片临时路径跳转到识别页面并自动开始 OCR 识别。

#### Scenario: 成功选择图片
- **WHEN** 用户从相机或相册选择一张图片并确认
- **THEN** 系统跳转至 `/pages/recognition/index?imageSource=selected`，并传递 `tempFilePath`，自动触发 OCR 识别

#### Scenario: 用户取消选择
- **WHEN** 用户在选择器中点击取消或关闭
- **THEN** 系统停留在首页，不跳转，不显示错误提示

#### Scenario: 选择失败处理
- **WHEN** 图片选择因系统原因失败（如权限不足）
- **THEN** 系统显示轻提示"选择图片失败"，控制台记录错误日志

### Requirement: 识别页接收并展示传入的图片
系统 SHALL 在识别页面加载时，检查 URL 参数或路由参数，若包含图片路径则自动展示并识别。

#### Scenario: 携带图片参数进入识别页
- **WHEN** 用户从首页选择图片后进入识别页，URL 包含 `imageSource=selected` 且传递了 `tempFilePath`
- **THEN** 识别页自动在页面上方展示该图片，`imageUrl` 状态初始化为传入路径，并自动调用 OCR 接口

#### Scenario: 无图片参数进入识别页
- **WHEN** 用户通过其他入口（如底部导航）进入识别页
- **THEN** 识别页保持初始状态，显示"选择图片"按钮

### Requirement: 识别页展示 OCR 识别结果
系统 SHALL 在图片下方展示 OCR 识别结果，包含成分列表、风险等级、成分标签和作用信息。

#### Scenario: OCR 识别成功
- **WHEN** OCR 接口返回识别结果
- **THEN** 页面在图片下方展示成分表格，包含成分名称、风险等级、成分标签、作用信息

#### Scenario: OCR 识别中
- **WHEN** OCR 请求正在进行
- **THEN** 页面展示加载状态（如加载动画或"识别中"提示）

#### Scenario: OCR 识别失败
- **WHEN** OCR 接口请求失败
- **THEN** 页面展示错误提示，并提供"重新识别"按钮

### Requirement: 图片选择数量限制
系统 SHALL 限制用户每次只能选择一张图片进行识别。

#### Scenario: 单次选择限制
- **WHEN** 用户调用图片选择器
- **THEN** `count` 参数设置为 1，用户无法选择多张图片
