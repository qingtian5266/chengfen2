<template>
  <view class="detail-shell">
    <view class="top-nav">
      <view class="nav-btn" @click="goBack">‹</view>
      <view class="nav-title">产品详情</view>
      <view class="nav-btn" @click="mockShare">↗</view>
    </view>

    <view v-if="loading" class="state-card">加载中...</view>
    <view v-else-if="!product" class="state-card">产品不存在</view>

    <view v-else>
      <view class="hero-card">
        <view class="hero-top">
          <view class="hero-cover">{{ shortName }}</view>
          <view class="risk-panel" :class="riskMeta.levelClass">
            <view class="risk-emoji">{{ riskMeta.emoji }}</view>
            <view class="risk-label">{{ riskMeta.label }}</view>
          </view>
        </view>

        <view class="product-name">{{ product.name }}</view>
        <view class="product-meta">
          品牌：{{ product.brand || '未知' }}
          <text class="meta-dot">|</text>
          条码尾号：{{ barcodeTail }}
        </view>

        <view class="tag-row">
          <view class="tag-chip" v-for="tag in featureTags" :key="tag">{{ tag }}</view>
        </view>
      </view>

      <view class="section-card">
        <view class="section-head">
          <view class="section-title">配料表</view>
          <view class="section-link" @click="goHealthSetting">健康关注设置</view>
        </view>

        <view class="ingredients-box">{{ displayIngredients }}</view>

        <view class="risk-box">
          <view class="risk-title">发现高风险成分</view>
          <view v-if="riskComponents.length" class="risk-list">
            <view
              v-for="item in riskComponents"
              :key="item.id"
              class="risk-item"
              @click="goComponent(item.id)"
            >
              <view class="risk-name">{{ item.name }}</view>
              <view class="risk-badge">{{ item.risk_level || '需关注' }}</view>
            </view>
          </view>
          <view v-else class="risk-empty">当前暂无明显高风险成分</view>
        </view>
      </view>

      <view class="section-card nutrition-card">
        <view class="section-head">
          <view class="section-title">营养成分表</view>
          <view class="grade-chip" :class="riskMeta.levelClass">{{ riskMeta.grade }}</view>
        </view>

        <view class="energy-box">
          <view class="energy-value">{{ calorieValue }} 千卡 / {{ calorieValue * 4.184 }} 千焦</view>
          <view class="energy-note">相当于快走 {{ walkStepEstimate }} 步</view>
        </view>
      </view>
    </view>

    <view v-if="product" class="bottom-bar">
      <view class="collect-btn" @click="toggleCollect">{{ product.isCollected ? '已收藏' : '收藏' }}</view>
      <view class="buy-btn" @click="mockBuy">去天猫旗舰店购买</view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import Taro, { useLoad } from '@tarojs/taro'
import { productApi, type ProductDetail } from '../../apis/product'
import { collectApi } from '../../apis/collect'
import { ensureLogin } from '../../utils/auth'

const id = ref(0)
const product = ref<ProductDetail | null>(null)
const loading = ref(false)
const collecting = ref(false)

const normalizedRisk = (value?: string) => (value || '').toLowerCase().trim()

const isHighRisk = (value?: string) => {
  const risk = normalizedRisk(value)
  return (
    risk.includes('high') ||
    risk.includes('高') ||
    risk.includes('danger') ||
    risk.includes('禁') ||
    risk.includes('中') ||
    risk.includes('medium')
  )
}

const riskMeta = computed(() => {
  const risk = normalizedRisk(product.value?.risk_level)
  if (risk.includes('high') || risk.includes('高') || risk.includes('danger') || risk.includes('禁')) {
    return {
      label: '谨慎食用',
      emoji: '⚠',
      grade: 'D',
      levelClass: 'risk-high',
    }
  }
  if (risk.includes('medium') || risk.includes('中')) {
    return {
      label: '适量食用',
      emoji: '•',
      grade: 'C',
      levelClass: 'risk-medium',
    }
  }
  return {
    label: '相对安心',
    emoji: '✓',
    grade: 'A',
    levelClass: 'risk-low',
  }
})

const shortName = computed(() => {
  const value = product.value?.name?.trim() || '成分喵'
  return value.slice(0, 4)
})

const barcodeTail = computed(() => {
  const value = product.value?.barcode || '-'
  return value.length > 6 ? value.slice(-6) : value
})

const featureTags = computed(() => {
  const tags: string[] = []
  if (!product.value) {
    return tags
  }

  if (product.value.category === 'food') {
    tags.push('食品')
  } else if (product.value.category === 'daily') {
    tags.push('日化')
  }

  tags.push(`成分 ${product.value.components.length} 项`)

  const highRiskCount = product.value.components.filter((item) => isHighRisk(item.risk_level)).length
  if (highRiskCount > 0) {
    tags.push(`高风险 ${highRiskCount} 项`)
  } else {
    tags.push('暂无高风险')
  }

  return tags.slice(0, 3)
})

const displayIngredients = computed(() => {
  if (!product.value?.ingredients_text) {
    return '暂无配料文本，可通过拍照识别补充。'
  }
  return product.value.ingredients_text
})

const riskComponents = computed(() => {
  return (product.value?.components || []).filter((item) => isHighRisk(item.risk_level)).slice(0, 6)
})

const calorieValue = computed(() => {
  const base = 180
  const dynamic = (product.value?.components.length || 0) * 14
  return base + dynamic
})

const walkStepEstimate = computed(() => calorieValue.value * 36)

const loadDetail = async () => {
  if (!id.value) {
    return
  }
  loading.value = true
  try {
    product.value = await productApi.detail(id.value)
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

const toggleCollect = async () => {
  if (!product.value || collecting.value) {
    return
  }

  collecting.value = true
  try {
    await ensureLogin()
    if (product.value.isCollected) {
      await collectApi.cancel(product.value.id)
      Taro.showToast({ title: '已取消收藏', icon: 'none' })
    } else {
      await collectApi.create(product.value.id)
      Taro.showToast({ title: '收藏成功', icon: 'none' })
    }
    await loadDetail()
  } catch (error) {
    console.error(error)
  } finally {
    collecting.value = false
  }
}

const goComponent = (componentId: number) => {
  Taro.navigateTo({ url: `/pages/component/detail?id=${componentId}` })
}

const goHealthSetting = () => {
  Taro.showToast({ title: '健康关注设置即将上线', icon: 'none' })
}

const mockBuy = () => {
  Taro.showToast({ title: '购买链接即将接入', icon: 'none' })
}

const goBack = () => {
  Taro.navigateBack({
    delta: 1,
    fail: () => {
      Taro.redirectTo({ url: '/pages/index/index' })
    },
  })
}

const mockShare = () => {
  Taro.showToast({ title: '分享功能即将上线', icon: 'none' })
}

useLoad((params) => {
  id.value = Number(params.id || 0)
  loadDetail()
})
</script>

<style lang="less">
.detail-shell {
  min-height: 100vh;
  padding: calc(env(safe-area-inset-top) + 14rpx) 24rpx 168rpx;

  .top-nav {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12rpx;
  }

  .nav-title {
    font-size: 52rpx;
    font-weight: 700;
    color: #1e3156;
  }

  .nav-btn {
    width: 56rpx;
    height: 56rpx;
    border-radius: 50%;
    border: 2rpx solid rgba(67, 96, 147, 0.24);
    color: #22385f;
    font-size: 38rpx;
    line-height: 52rpx;
    text-align: center;
  }

  .state-card {
    margin-top: 80rpx;
    border-radius: 28rpx;
    padding: 56rpx 24rpx;
    text-align: center;
    font-size: 34rpx;
    color: #7683a2;
    background: rgba(255, 255, 255, 0.9);
    border: 2rpx solid rgba(126, 180, 230, 0.2);
  }

  .hero-card,
  .section-card {
    border-radius: 30rpx;
    background: rgba(255, 255, 255, 0.92);
    border: 2rpx solid rgba(126, 180, 230, 0.2);
    box-shadow: 0 18rpx 46rpx rgba(99, 137, 195, 0.11);
  }

  .hero-card {
    padding: 28rpx;
    animation: rise-in 420ms ease-out;
  }

  .hero-top {
    display: flex;
    justify-content: space-between;
    gap: 20rpx;
  }

  .hero-cover {
    flex: 1;
    min-height: 230rpx;
    border-radius: 24rpx;
    background: linear-gradient(160deg, #f6fbff 0%, #cee8ff 100%);
    border: 2rpx solid rgba(130, 180, 230, 0.24);
    color: #4f6e9c;
    font-size: 56rpx;
    font-weight: 700;
    letter-spacing: 2rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 0 24rpx;
  }

  .risk-panel {
    width: 170rpx;
    border-radius: 20rpx;
    border: 2rpx dashed rgba(234, 188, 92, 0.34);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 10rpx;
  }

  .risk-emoji {
    width: 64rpx;
    height: 64rpx;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 30rpx;
    font-weight: 700;
  }

  .risk-label {
    font-size: 30rpx;
    color: #2d3e5f;
  }

  .risk-low {
    background: rgba(78, 186, 132, 0.12);

    .risk-emoji {
      background: rgba(62, 190, 129, 0.2);
      color: #2f9f69;
    }
  }

  .risk-medium {
    background: rgba(243, 181, 92, 0.12);

    .risk-emoji {
      background: rgba(243, 181, 92, 0.2);
      color: #cc8e2d;
    }
  }

  .risk-high {
    background: rgba(236, 103, 113, 0.12);

    .risk-emoji {
      background: rgba(236, 103, 113, 0.2);
      color: #d6515c;
    }
  }

  .product-name {
    margin-top: 24rpx;
    font-size: 52rpx;
    line-height: 1.32;
    font-weight: 700;
    color: #1f3052;
  }

  .product-meta {
    margin-top: 14rpx;
    color: #667594;
    font-size: 30rpx;
  }

  .meta-dot {
    margin: 0 12rpx;
    color: #a0aec7;
  }

  .tag-row {
    margin-top: 20rpx;
    display: flex;
    flex-wrap: wrap;
    gap: 12rpx;
  }

  .tag-chip {
    min-height: 48rpx;
    padding: 0 16rpx;
    border-radius: 999rpx;
    display: flex;
    align-items: center;
    font-size: 24rpx;
    color: #2f8ecc;
    background: rgba(86, 181, 240, 0.16);
    border: 1rpx solid rgba(86, 181, 240, 0.2);
  }

  .section-card {
    margin-top: 18rpx;
    padding: 24rpx;
  }

  .section-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .section-title {
    font-size: 50rpx;
    font-weight: 700;
    color: #25395d;
  }

  .section-link {
    color: #4aa8df;
    font-size: 30rpx;
  }

  .ingredients-box {
    margin-top: 20rpx;
    border-radius: 22rpx;
    border: 2rpx solid rgba(131, 175, 224, 0.18);
    background: rgba(247, 251, 255, 0.76);
    padding: 22rpx;
    color: #3d4f73;
    line-height: 1.7;
    font-size: 34rpx;
  }

  .risk-box {
    margin-top: 22rpx;
    border-radius: 22rpx;
    border: 2rpx solid rgba(131, 175, 224, 0.18);
    overflow: hidden;
    background: rgba(255, 255, 255, 0.75);
  }

  .risk-title {
    padding: 20rpx 24rpx;
    font-size: 36rpx;
    color: #344d78;
    background: rgba(240, 247, 255, 0.85);
  }

  .risk-list {
    padding: 12rpx 18rpx 18rpx;
    display: flex;
    flex-direction: column;
    gap: 10rpx;
  }

  .risk-item {
    border-radius: 14rpx;
    padding: 14rpx 14rpx;
    background: rgba(255, 246, 246, 0.72);
    border: 1rpx solid rgba(234, 154, 164, 0.32);
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .risk-name {
    font-size: 32rpx;
    color: #d25c6b;
    font-weight: 600;
  }

  .risk-badge {
    min-height: 44rpx;
    padding: 0 14rpx;
    border-radius: 999rpx;
    background: rgba(232, 95, 109, 0.14);
    color: #d45767;
    font-size: 24rpx;
    display: flex;
    align-items: center;
  }

  .risk-empty {
    padding: 20rpx 24rpx 24rpx;
    color: #6e7d9d;
    font-size: 30rpx;
  }

  .nutrition-card {
    margin-bottom: 20rpx;
  }

  .grade-chip {
    min-width: 58rpx;
    height: 58rpx;
    padding: 0 16rpx;
    border-radius: 999rpx;
    color: #fff;
    font-size: 32rpx;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .risk-low.grade-chip {
    background: linear-gradient(160deg, #54cb94 0%, #2da66f 100%);
  }

  .risk-medium.grade-chip {
    background: linear-gradient(160deg, #f5c169 0%, #ec9838 100%);
  }

  .risk-high.grade-chip {
    background: linear-gradient(160deg, #ef7f86 0%, #df5a68 100%);
  }

  .energy-box {
    margin-top: 20rpx;
    border-radius: 22rpx;
    background: linear-gradient(160deg, rgba(234, 245, 255, 0.8) 0%, rgba(229, 239, 251, 0.8) 100%);
    border: 2rpx solid rgba(135, 177, 225, 0.2);
    padding: 30rpx 20rpx;
    text-align: center;
  }

  .energy-value {
    font-size: 54rpx;
    font-weight: 700;
    color: #2d3f66;
  }

  .energy-note {
    margin-top: 14rpx;
    font-size: 30rpx;
    color: #7382a0;
  }

  .bottom-bar {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    height: calc(132rpx + env(safe-area-inset-bottom));
    padding: 14rpx 22rpx calc(14rpx + env(safe-area-inset-bottom));
    display: flex;
    gap: 14rpx;
    background: rgba(255, 255, 255, 0.95);
    box-shadow: 0 -14rpx 32rpx rgba(104, 136, 181, 0.1);
  }

  .collect-btn {
    width: 192rpx;
    border-radius: 999rpx;
    background: #fff4f5;
    color: #df6f78;
    font-size: 30rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2rpx solid rgba(232, 141, 149, 0.24);
  }

  .buy-btn {
    flex: 1;
    border-radius: 999rpx;
    background: linear-gradient(160deg, #ff7893 0%, #ff4d6d 100%);
    color: #fff;
    font-size: 34rpx;
    font-weight: 600;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

@keyframes rise-in {
  0% {
    opacity: 0;
    transform: translateY(18rpx);
  }

  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
