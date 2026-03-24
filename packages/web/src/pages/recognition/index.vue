<template>
  <view class="recognition-page">
    <!-- 顶部导航栏占位 -->
    <view class="page-header">
      <text class="page-title">查询结果</text>
    </view>

    <!-- 图片展示区 -->
    <view class="image-section" v-if="imageUrl">
      <image class="preview-image" :src="imageUrl" mode="aspectFit" />
      <view class="image-actions">
        <view class="action-btn" @click="rechooseImage">重新拍摄</view>
      </view>
    </view>

    <!-- 选择图片入口 -->
    <view class="upload-section" v-else>
      <view class="upload-btn" @click="chooseImage">
        <view class="upload-icon">📷</view>
        <text>点击拍摄或从相册选择</text>
      </view>
    </view>

    <!-- OCR 识别中 -->
    <view class="loading-section" v-if="loading">
      <view class="loading-spinner" />
      <text class="loading-text">正在识别成分...</text>
    </view>

    <!-- OCR 识别结果 -->
    <view class="result-section" v-else-if="ocrResult && !loading">
      <!-- 整体风险评估横幅 -->
      <view class="risk-banner" :class="riskBannerClass">
        <view class="risk-icon-wrapper">
          <view class="risk-icon" :class="overallRiskClass">
            <text>{{ overallRiskLetter }}</text>
          </view>
          <text class="risk-sub">无风险</text>
        </view>
        <text class="risk-text">{{ riskBannerText }}</text>
      </view>

      <!-- 敏感成分区域（如有） -->
      <view class="sensitive-section" v-if="ocrResult.sensitiveIngredients.length > 0">
        <view class="section-title-row">
          <text class="section-title">敏感成分</text>
          <view class="tip-icon">?</view>
        </view>
        <view class="sensitive-list">
          <view v-for="(item, index) in ocrResult.sensitiveIngredients" :key="index" class="sensitive-item">
            {{ item }}
          </view>
        </view>
      </view>

      <!-- 拍照成分解读 -->
      <view class="components-section">
        <view class="section-header">
          <text class="section-main-title">拍照成分解读</text>
          <text class="section-sub">解读出{{ ocrResult.components.length }}种成分</text>
        </view>

        <!-- 成分表格 -->
        <view class="components-table">
          <view class="table-header">
            <view class="table-cell header-cell">成分名称</view>
            <view class="table-cell header-cell">风险等级</view>
            <view class="table-cell header-cell">成分标签</view>
            <view class="table-cell header-cell">作用</view>
          </view>
          <view class="table-body">
            <view v-for="(item, index) in ocrResult.components" :key="index" class="table-row">
              <view class="table-cell name-cell">{{ item.name }}</view>
              <view class="table-cell risk-cell">
                <view class="risk-badge" :class="'risk-' + item.riskLevel.toLowerCase()">
                  {{ getRiskLevelText(item.riskLevel) }}
                </view>
              </view>
              <view class="table-cell tags-cell">
                <text v-for="(tag, tIndex) in item.tags" :key="tIndex" class="tag-item">{{ tag }}</text>
              </view>
              <view class="table-cell functions-cell">{{ item.functions.join('、') }}</view>
            </view>
          </view>
        </view>

        <view class="table-note">
          <text>*此配料表的成分信息及顺序来源于商品配料顺序</text>
        </view>
      </view>

      <!-- 风险等级说明 -->
      <view class="risk-legend">
        <view class="legend-item">
          <view class="legend-badge legend-a">A</view>
          <text>表示无风险成分，安全食用</text>
        </view>
        <view class="legend-item">
          <view class="legend-badge legend-b">B</view>
          <text>表示低风险成分，注意适量食用</text>
        </view>
        <view class="legend-item">
          <view class="legend-badge legend-c">C</view>
          <text>表示中风险成分，注意谨慎食用</text>
        </view>
        <view class="legend-item">
          <view class="legend-badge legend-d">D</view>
          <text>表示高风险成分，减少或避免使用</text>
        </view>
      </view>
    </view>

    <!-- 底部操作栏 -->
    <view class="bottom-actions" v-if="ocrResult && !loading">
      <view class="share-btn" @click="shareResult">
        <text class="share-icon">📤</text>
        <text>分享</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import Taro from '@tarojs/taro'
import { recognitionApi, type OcrResponse, type OverallRisk } from '../../apis/recognition'

const imageUrl = ref('')
const loading = ref(false)
const ocrResult = ref<OcrResponse | null>(null)

// Mock 数据 - 用于演示 UI
const mockOcrResult: OcrResponse = {
  imageUrl: '',
  provider: 'mock',
  overallRisk: 'safe',
  sensitiveIngredients: [],
  components: [
    {
      name: '牛肉',
      riskLevel: 'A',
      tags: ['食品主料'],
      functions: [],
      confidence: 0.98,
    },
    {
      name: '碳酸钙',
      riskLevel: 'A',
      tags: ['膨松剂', '营养强化剂', '面粉处理剂'],
      functions: ['膨松剂', '营养强化剂', '面粉处理剂'],
      confidence: 0.95,
    },
    {
      name: '小麦',
      riskLevel: 'A',
      tags: ['食品主料'],
      functions: [],
      confidence: 0.97,
    },
    {
      name: '大豆',
      riskLevel: 'A',
      tags: ['食品主料'],
      functions: [],
      confidence: 0.96,
    },
  ],
}

// 计算属性
const riskBannerClass = computed(() => {
  if (!ocrResult.value) return ''
  const map: Record<OverallRisk, string> = {
    safe: 'risk-safe',
    low: 'risk-low',
    medium: 'risk-medium',
    high: 'risk-high',
  }
  return map[ocrResult.value.overallRisk]
})

const overallRiskClass = computed(() => {
  if (!ocrResult.value) return ''
  const map: Record<OverallRisk, string> = {
    safe: 'risk-a',
    low: 'risk-b',
    medium: 'risk-c',
    high: 'risk-d',
  }
  return map[ocrResult.value.overallRisk]
})

const overallRiskLetter = computed(() => {
  if (!ocrResult.value) return 'A'
  const map: Record<OverallRisk, string> = {
    safe: 'A',
    low: 'B',
    medium: 'C',
    high: 'D',
  }
  return map[ocrResult.value.overallRisk]
})

const riskBannerText = computed(() => {
  if (!ocrResult.value) return ''
  const map: Record<OverallRisk, string> = {
    safe: '基于拍照结果，暂未发现风险成分',
    low: '基于拍照结果，发现少量低风险成分',
    medium: '基于拍照结果，发现中风险成分，请谨慎食用',
    high: '基于拍照结果，发现高风险成分，建议避免食用',
  }
  return map[ocrResult.value.overallRisk]
})

// 方法
const getRiskLevelText = (level: string) => {
  const map: Record<string, string> = {
    a: '无风险',
    b: '低风险',
    c: '中风险',
    d: '高风险',
  }
  return map[level.toLowerCase()] || '未知'
}

const chooseImage = async () => {
  try {
    const res = await Taro.chooseImage({
      count: 1,
      sourceType: ['camera', 'album'],
    })
    if (res.tempFilePaths?.length) {
      const tempFilePath = res.tempFilePaths[0]
      imageUrl.value = tempFilePath
      
      // 转换为 base64 并调用 OCR
      await convertToBase64AndOcr(tempFilePath)
    }
  } catch (error) {
    console.error('选择图片失败', error)
  }
}

const rechooseImage = async () => {
  ocrResult.value = null
  imageUrl.value = ''
  await chooseImage()
}

const convertToBase64AndOcr = async (filePath: string) => {
  loading.value = true
  ocrResult.value = null
  
  try {
    // 获取图片信息
    const imgInfo = await Taro.getImageInfo({ src: filePath })
    
    // 创建 canvas 转换为 base64
    const canvasId = 'ocrCanvas'
    const ctx = Taro.createCanvasContext(canvasId)
    
    // 绘制图片到 canvas
    ctx.drawImage(filePath, 0, 0, imgInfo.width, imgInfo.height)
    
    // 导出为 base64
    // 注意：Taro 中需要使用 wx.canvasToTempFilePath 或类似方法
    // 这里简化处理，实际项目中需要根据平台适配
    
    // 简化方案：直接使用临时路径，后端也可以处理
    // 如果需要 base64，可以使用以下方案：
    const base64 = await filePathToBase64(filePath)
    
    // 调用 OCR 接口（使用 mock 数据）
    await callOcrWithMock(base64)
  } catch (error) {
    console.error('图片处理失败', error)
    Taro.showToast({ title: '图片处理失败', icon: 'none' })
    loading.value = false
  }
}

const filePathToBase64 = async (filePath: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    // 小程序环境
    if (typeof Taro !== 'undefined') {
      const fs = Taro.getFileSystemManager()
      fs.readFile({
        filePath: filePath,
        encoding: 'base64',
        success: (res) => {
          resolve(`data:image/jpeg;base64,${res.data}`)
        },
        fail: (err) => {
          reject(err)
        },
      })
    } else {
      // H5 环境降级处理
      resolve('')
    }
  })
}

const callOcrWithMock = async (base64: string) => {
  try {
    // 实际调用（注释掉，使用 mock）
    // const result = await recognitionApi.ocr({
    //   imageUrl: imageUrl.value,
    //   base64: base64,
    // })
    
    // 使用 mock 数据，延迟模拟网络请求
    await new Promise((resolve) => setTimeout(resolve, 1500))
    
    const result = {
      ...mockOcrResult,
      imageUrl: imageUrl.value,
    }
    
    ocrResult.value = result
  } catch (error) {
    console.error('OCR 识别失败', error)
    Taro.showToast({ title: '识别失败，请重试', icon: 'none' })
  } finally {
    loading.value = false
  }
}

const shareResult = () => {
  Taro.showShareMenu({
    withShareTicket: true,
    showShareItems: ['wechatFriends', 'wechatMoment'],
  })
}

// 页面加载时检查是否有传入参数
const initFromParams = () => {
  const pages = Taro.getCurrentPages()
  const currentPage = pages[pages.length - 1] as any
  const options = currentPage.$router?.params || {}
  
  if (options.imageSource === 'selected' && options.tempFilePath) {
    imageUrl.value = options.tempFilePath
    convertToBase64AndOcr(options.tempFilePath)
  }
}

// 生命周期
// 在 onReady 或 onShow 中初始化
</script>

<style lang="less">
.recognition-page {
  min-height: 100vh;
  background: #f5f7fa;
  padding-bottom: 120rpx;
}

.page-header {
  height: 88rpx;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1rpx solid #eee;
  
  .page-title {
    font-size: 32rpx;
    font-weight: 600;
    color: #333;
  }
}

.image-section {
  background: #fff;
  padding: 24rpx;
  
  .preview-image {
    width: 100%;
    max-height: 600rpx;
    border-radius: 12rpx;
  }
  
  .image-actions {
    margin-top: 16rpx;
    display: flex;
    justify-content: flex-end;
    
    .action-btn {
      font-size: 26rpx;
      color: #667eea;
      padding: 8rpx 16rpx;
    }
  }
}

.upload-section {
  padding: 80rpx 40rpx;
  
  .upload-btn {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 16rpx;
    padding: 60rpx 40rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    
    .upload-icon {
      font-size: 80rpx;
      margin-bottom: 16rpx;
    }
    
    text {
      color: #fff;
      font-size: 28rpx;
    }
  }
}

.loading-section {
  padding: 80rpx 40rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  
  .loading-spinner {
    width: 60rpx;
    height: 60rpx;
    border: 4rpx solid #e0e0e0;
    border-top-color: #667eea;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
  
  .loading-text {
    margin-top: 24rpx;
    color: #666;
    font-size: 28rpx;
  }
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.result-section {
  padding: 24rpx;
}

.risk-banner {
  background: #f0f9ff;
  border-radius: 12rpx;
  padding: 32rpx 24rpx;
  display: flex;
  align-items: center;
  gap: 24rpx;
  margin-bottom: 24rpx;
  
  &.risk-safe {
    background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
  }
  
  &.risk-low {
    background: linear-gradient(135deg, #fefce8 0%, #fef9c3 100%);
  }
  
  &.risk-medium {
    background: linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%);
  }
  
  &.risk-high {
    background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
  }
  
  .risk-icon-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .risk-icon {
    width: 64rpx;
    height: 64rpx;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 32rpx;
    font-weight: 700;
    color: #fff;
    
    &.risk-a {
      background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
    }
    
    &.risk-b {
      background: linear-gradient(135deg, #eab308 0%, #ca8a04 100%);
    }
    
    &.risk-c {
      background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
    }
    
    &.risk-d {
      background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
    }
  }
  
  .risk-sub {
    font-size: 22rpx;
    color: #666;
    margin-top: 4rpx;
  }
  
  .risk-text {
    flex: 1;
    font-size: 30rpx;
    font-weight: 600;
    color: #333;
  }
}

.sensitive-section {
  background: #fff;
  border-radius: 12rpx;
  padding: 24rpx;
  margin-bottom: 24rpx;
  
  .section-title-row {
    display: flex;
    align-items: center;
    gap: 12rpx;
    margin-bottom: 16rpx;
    
    .section-title {
      font-size: 30rpx;
      font-weight: 600;
      color: #333;
    }
    
    .tip-icon {
      width: 32rpx;
      height: 32rpx;
      border-radius: 50%;
      background: #f0f0f0;
      color: #999;
      font-size: 20rpx;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
  
  .sensitive-list {
    display: flex;
    flex-wrap: wrap;
    gap: 12rpx;
    
    .sensitive-item {
      background: #fef2f2;
      color: #dc2626;
      padding: 8rpx 16rpx;
      border-radius: 8rpx;
      font-size: 26rpx;
    }
  }
}

.components-section {
  background: #fff;
  border-radius: 12rpx;
  padding: 24rpx;
  margin-bottom: 24rpx;
  
  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24rpx;
    
    .section-main-title {
      font-size: 30rpx;
      font-weight: 600;
      color: #333;
    }
    
    .section-sub {
      font-size: 26rpx;
      color: #999;
    }
  }
  
  .components-table {
    .table-header {
      display: flex;
      background: #f8f9fa;
      border-radius: 8rpx;
      overflow: hidden;
      
      .header-cell {
        font-weight: 600;
        color: #666;
        font-size: 24rpx;
      }
    }
    
    .table-row {
      display: flex;
      border-bottom: 1rpx solid #f0f0f0;
      
      &:last-child {
        border-bottom: none;
      }
    }
    
    .table-cell {
      padding: 20rpx 12rpx;
      font-size: 24rpx;
      color: #666;
      
      &.name-cell {
        flex: 1.5;
        color: #667eea;
        font-weight: 500;
      }
      
      &.risk-cell {
        flex: 1;
      }
      
      &.tags-cell {
        flex: 1.5;
        display: flex;
        flex-wrap: wrap;
        gap: 8rpx;
        
        .tag-item {
          background: #f0f4ff;
          color: #667eea;
          padding: 4rpx 10rpx;
          border-radius: 4rpx;
          font-size: 22rpx;
        }
      }
      
      &.functions-cell {
        flex: 2;
        line-height: 1.6;
      }
    }
  }
  
  .table-note {
    margin-top: 16rpx;
    padding-top: 16rpx;
    border-top: 1rpx solid #f0f0f0;
    
    text {
      font-size: 22rpx;
      color: #999;
    }
  }
}

.risk-legend {
  background: #fff;
  border-radius: 12rpx;
  padding: 24rpx;
  
  .legend-item {
    display: flex;
    align-items: center;
    gap: 12rpx;
    margin-bottom: 12rpx;
    
    &:last-child {
      margin-bottom: 0;
    }
    
    text {
      font-size: 24rpx;
      color: #666;
    }
  }
  
  .legend-badge {
    width: 40rpx;
    height: 40rpx;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 22rpx;
    font-weight: 700;
    color: #fff;
    
    &.legend-a {
      background: #22c55e;
    }
    
    &.legend-b {
      background: #eab308;
    }
    
    &.legend-c {
      background: #f97316;
    }
    
    &.legend-d {
      background: #ef4444;
    }
  }
}

.bottom-actions {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100rpx;
  background: #fff;
  border-top: 1rpx solid #eee;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
  
  .share-btn {
    display: flex;
    align-items: center;
    gap: 8rpx;
    color: #667eea;
    font-size: 28rpx;
    
    .share-icon {
      font-size: 32rpx;
    }
  }
}
</style>
