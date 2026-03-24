<template>
  <view class="food-detail-shell">
    <view class="top-nav">
      <view class="nav-btn" @click="goBack">‹</view>
      <view class="nav-title">产品详情</view>
      <view class="nav-btn" @click="mockShare">↗</view>
    </view>

    <view v-if="loading" class="state-card">加载中...</view>
    <view v-else-if="!product" class="state-card">产品不存在</view>

    <view v-else class="detail-content">
      <view class="hero-card">
        <view class="hero-top">
          <view class="hero-cover">
            <image v-if="coverImage" class="hero-cover-img" :src="coverImage" mode="aspectFill" />
            <view v-else class="hero-cover-fallback">
              <view class="fallback-can">🥫</view>
              <view class="fallback-name">{{ shortName }}</view>
            </view>
          </view>

          <view class="risk-panel" :class="riskMeta.levelClass">
            <view class="risk-emoji">{{ riskMeta.emoji }}</view>
            <view class="risk-label">{{ riskMeta.label }}</view>
          </view>
        </view>

        <view class="product-name">{{ product.name }}</view>
        <view class="product-meta">品牌：{{ product.brand || '未知' }}<text class="meta-gap" />规格：{{ productSpec }}</view>

        <view class="tag-row">
          <view
            v-for="tag in featureTags"
            :key="tag.label"
            class="tag-chip"
            :class="`tag-${tag.tone}`"
          >
            {{ tag.label }}
          </view>
        </view>
      </view>

      <view class="section-card">
        <view class="section-head">
          <view class="section-title">配料表</view>
          <view class="section-link" @click="goHealthSetting">健康关注设置 ›</view>
        </view>

        <view class="ingredients-box">{{ displayIngredients }}</view>

        <view class="risk-box">
          <view class="risk-title">发现高风险成分</view>
          <view class="risk-chip-row">
            <view
              v-for="chip in riskHintTags"
              :key="chip.key"
              class="risk-chip"
              :class="`risk-chip-${chip.tone}`"
              @click="chip.componentId ? goComponent(chip.componentId) : undefined"
            >
              {{ chip.label }}
            </view>
          </view>
        </view>

        <view class="analysis-btn" @click="goAnalyzeAll">全部成分解读</view>
      </view>

      <view class="section-card nutrition-card">
        <view class="section-head nutrition-head">
          <view class="section-title">营养成分表</view>
          <view class="nutrition-badge">每罐 {{ productSpec }}</view>
        </view>

        <view class="energy-box">
          <view class="energy-header">
            <view class="energy-label">100g</view>
            <view class="energy-weight">{{ productSpec }}</view>
          </view>
          <view class="energy-value">{{ calorieValue }}千卡 / {{ energyKj }}千焦</view>
          <view class="energy-note">相当于行走{{ walkStepEstimate }}步</view>
        </view>
      </view>
    </view>

    <view v-if="product" class="bottom-bar">
      <view class="collect-btn" @click="toggleCollect">
        <view class="collect-icon">{{ product.isCollected ? '★' : '☆' }}</view>
        <view class="collect-text">{{ product.isCollected ? '已收藏' : '收藏' }}</view>
      </view>

      <view class="buy-combo" @click="mockBuy">
        <view class="price-pane">¥ {{ displayPrice }}</view>
        <view class="buy-pane">去天猫旗舰店购买</view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import Taro, { useLoad } from '@tarojs/taro'
import { productApi, type ProductDetail } from '../../apis/product'
import { collectApi } from '../../apis/collect'
import { ensureLogin } from '../../utils/auth'
import { MOCK_FOOD_DETAIL } from './mock'

type TagTone = 'warning' | 'info'
type RiskChipTone = 'blue' | 'danger' | 'muted'

const id = ref(0)
const product = ref<ProductDetail | null>(null)
const loading = ref(false)
const collecting = ref(false)

const normalizedRisk = (value?: string) => (value || '').toLowerCase().trim()

const isHighRisk = (value?: string) => {
  const risk = normalizedRisk(value)
  return risk.includes('high') || risk.includes('高') || risk.includes('danger') || risk.includes('禁')
}

const isMediumRisk = (value?: string) => {
  const risk = normalizedRisk(value)
  return risk.includes('medium') || risk.includes('中')
}

const riskMeta = computed(() => {
  const risk = normalizedRisk(product.value?.risk_level)
  if (isHighRisk(risk)) {
    return {
      label: '谨慎食用',
      emoji: '⚠',
      grade: 'D',
      levelClass: 'risk-high',
    }
  }

  if (isMediumRisk(risk)) {
    return {
      label: '适量食用',
      emoji: '🙂',
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
  const value = product.value?.name?.trim() || '食品'
  return value.slice(0, 4)
})

const coverImage = computed(() => {
  const data = product.value as (ProductDetail & {
    image_url?: string
    imageUrl?: string
    cover?: string
  }) | null
  return data?.image_url || data?.imageUrl || data?.cover || ''
})

const productSpec = computed(() => {
  const data = product.value as (ProductDetail & { spec?: string }) | null
  if (data?.spec) {
    return data.spec
  }

  const name = product.value?.name || ''
  const matched = name.match(/(\d+(?:\.\d+)?\s?(?:g|kg|ml|l))/i)
  if (!matched) {
    return '340g'
  }

  return matched[1].replace(/\s+/g, '').toLowerCase()
})

const highRiskCount = computed(() => {
  return (product.value?.components || []).filter((item) => isHighRisk(item.risk_level)).length
})

const featureTags = computed<Array<{ label: string; tone: TagTone }>>(() => {
  const ingredients = product.value?.ingredients_text || ''
  const tags: Array<{ label: string; tone: TagTone }> = []

  if (highRiskCount.value > 0) {
    tags.push({ label: `高风险${highRiskCount.value}项`, tone: 'warning' })
  } else {
    tags.push({ label: '风险较低', tone: 'info' })
  }

  if (/甜味剂/.test(ingredients)) {
    tags.push({ label: '含人工甜味剂', tone: 'info' })
  } else {
    tags.push({ label: '无人工甜味剂', tone: 'info' })
  }

  if (/色素/.test(ingredients)) {
    tags.push({ label: '含人工色素', tone: 'info' })
  } else {
    tags.push({ label: '无人工色素', tone: 'info' })
  }

  return tags
})

const displayIngredients = computed(() => {
  if (!product.value?.ingredients_text) {
    return '暂无配料文本，可通过拍照识别补充。'
  }
  return product.value.ingredients_text
})

const riskComponents = computed(() => {
  return (product.value?.components || []).filter((item) => isHighRisk(item.risk_level)).slice(0, 2)
})

const riskHintTags = computed<Array<{ key: string; label: string; tone: RiskChipTone; componentId?: number }>>(() => {
  const chips: Array<{ key: string; label: string; tone: RiskChipTone; componentId?: number }> = []

  riskComponents.value.forEach((item, index) => {
    chips.push({
      key: `component-${item.id}-${index}`,
      label: item.name,
      tone: 'blue',
      componentId: item.id,
    })
  })

  chips.push({ key: 'grade', label: riskMeta.value.grade, tone: 'danger' })
  chips.push({ key: 'risk-label', label: riskMeta.value.label, tone: 'muted' })

  if (highRiskCount.value > 0) {
    chips.push({ key: 'high-risk-total', label: `${highRiskCount.value}类风险成分`, tone: 'danger' })
  } else {
    chips.push({ key: 'low-risk-tip', label: '暂无高风险成分', tone: 'muted' })
  }

  return chips.slice(0, 4)
})

const calorieValue = computed(() => {
  const base = 188
  const dynamic = (product.value?.components.length || 0) * 12
  return base + dynamic
})

const energyKj = computed(() => Math.round(calorieValue.value * 4.184))

const walkStepEstimate = computed(() => calorieValue.value * 37)

const displayPrice = computed(() => {
  const data = product.value as (ProductDetail & { price?: string | number }) | null
  if (typeof data?.price === 'number') {
    return data.price.toFixed(2)
  }

  if (typeof data?.price === 'string') {
    const parsed = Number(data.price)
    if (!Number.isNaN(parsed)) {
      return parsed.toFixed(2)
    }
  }

  return '9.81'
})

const loadDetail = async () => {
  if (!id.value) {
    product.value = { ...MOCK_FOOD_DETAIL }
    return
  }

  loading.value = true
  try {
    product.value = await productApi.detail(id.value)
  } catch (error) {
    console.error(error)
    product.value = { ...MOCK_FOOD_DETAIL, id: id.value || MOCK_FOOD_DETAIL.id }
    Taro.showToast({ title: '接口异常，已切换示例数据', icon: 'none' })
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

const goAnalyzeAll = () => {
  if (!product.value) {
    return
  }

  const components = product.value.components.map((item) => item.name).filter(Boolean)
  if (components.length === 0) {
    Taro.showToast({ title: '暂无可分析成分', icon: 'none' })
    return
  }

  Taro.setStorageSync('analyzePayload', {
    category: product.value.category || 'food',
    components,
  })
  Taro.navigateTo({ url: '/pages/analyze/result' })
}

const goHealthSetting = () => {
  Taro.showToast({ title: '健康关注设置即将上线', icon: 'none' })
}

const mockBuy = () => {
  Taro.showToast({ title: '购买链接即将接入', icon: 'none' })
}

const mockShare = () => {
  Taro.showToast({ title: '分享功能即将上线', icon: 'none' })
}

const goBack = () => {
  Taro.navigateBack({
    delta: 1,
    fail: () => {
      Taro.redirectTo({ url: '/pages/index/index' })
    },
  })
}

useLoad((params) => {
  id.value = Number(params.id || 0)
  loadDetail()
})
</script>

<style lang="less">
.food-detail-shell {
  min-height: 100vh;
  background: #f4f6f8;
  padding: calc(env(safe-area-inset-top) + 12rpx) 16rpx calc(170rpx + env(safe-area-inset-bottom));
}

.top-nav {
  height: 72rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.nav-btn {
  width: 64rpx;
  height: 64rpx;
  border-radius: 50%;
  color: #1f2a3c;
  font-size: 40rpx;
  line-height: 62rpx;
  text-align: center;
}

.nav-title {
  font-size: 30rpx;
  font-weight: 700;
  color: #1f2a3c;
}

.state-card {
  margin-top: 26rpx;
  border-radius: 22rpx;
  padding: 56rpx 24rpx;
  background: #ffffff;
  color: #7f8999;
  font-size: 30rpx;
  text-align: center;
}

.detail-content {
  display: flex;
  flex-direction: column;
  gap: 14rpx;
}

.hero-card,
.section-card {
  background: #ffffff;
  border-radius: 24rpx;
}

.hero-card {
  padding: 18rpx;
}

.hero-top {
  display: flex;
  gap: 12rpx;
}

.hero-cover {
  width: 160rpx;
  height: 160rpx;
  border-radius: 16rpx;
  overflow: hidden;
  background: #e8edf3;
  flex-shrink: 0;
}

.hero-cover-img {
  width: 100%;
  height: 100%;
}

.hero-cover-fallback {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(165deg, #f0f5fb 0%, #dce7f2 100%);
}

.fallback-can {
  font-size: 56rpx;
  line-height: 1;
}

.fallback-name {
  margin-top: 8rpx;
  font-size: 24rpx;
  color: #5e6880;
  font-weight: 600;
}

.risk-panel {
  flex: 1;
  min-height: 160rpx;
  border-radius: 16rpx;
  border: 2rpx dashed #f2d39e;
  background: #fffdf8;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6rpx;
}

.risk-emoji {
  width: 52rpx;
  height: 52rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28rpx;
}

.risk-label {
  font-size: 24rpx;
  color: #7b8495;
  font-weight: 600;
}

.risk-low .risk-emoji {
  background: rgba(78, 186, 132, 0.18);
  color: #2f9f69;
}

.risk-medium .risk-emoji {
  background: rgba(243, 181, 92, 0.2);
  color: #cc8e2d;
}

.risk-high .risk-emoji {
  background: rgba(236, 103, 113, 0.2);
  color: #d6515c;
}

.product-name {
  margin-top: 14rpx;
  font-size: 42rpx;
  line-height: 1.3;
  color: #1f2a3c;
  font-weight: 700;
}

.product-meta {
  margin-top: 8rpx;
  font-size: 26rpx;
  color: #7d8798;
}

.meta-gap {
  display: inline-block;
  width: 20rpx;
}

.tag-row {
  margin-top: 12rpx;
  display: flex;
  flex-wrap: wrap;
  gap: 8rpx;
}

.tag-chip {
  min-height: 42rpx;
  padding: 0 14rpx;
  border-radius: 999rpx;
  display: flex;
  align-items: center;
  font-size: 22rpx;
  font-weight: 600;
}

.tag-warning {
  background: #fff4de;
  color: #e3b25b;
}

.tag-info {
  background: #eaf8ff;
  color: #64b7e1;
}

.section-card {
  padding: 16rpx;
}

.section-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.section-title {
  font-size: 38rpx;
  font-weight: 700;
  color: #1f2a3c;
}

.section-link {
  font-size: 24rpx;
  color: #66c0ed;
}

.ingredients-box {
  margin-top: 12rpx;
  background: #f4f8fc;
  border-radius: 14rpx;
  padding: 12rpx;
  font-size: 24rpx;
  line-height: 1.62;
  color: #4f5868;
}

.risk-box {
  margin-top: 12rpx;
  background: #f8fbff;
  border-radius: 14rpx;
  padding: 12rpx;
}

.risk-title {
  font-size: 27rpx;
  color: #6f7889;
  font-weight: 600;
}

.risk-chip-row {
  margin-top: 10rpx;
  display: flex;
  flex-wrap: wrap;
  gap: 8rpx;
}

.risk-chip {
  min-height: 40rpx;
  padding: 0 12rpx;
  border-radius: 999rpx;
  display: flex;
  align-items: center;
  font-size: 22rpx;
}

.risk-chip-blue {
  background: #eaf7ff;
  color: #6bb9e6;
}

.risk-chip-danger {
  background: #fff0f0;
  color: #ef6a6a;
}

.risk-chip-muted {
  background: #f1f4f8;
  color: #6f7889;
}

.analysis-btn {
  margin-top: 12rpx;
  height: 60rpx;
  border-radius: 999rpx;
  background: #d8f0ff;
  color: #4aaedf;
  font-size: 30rpx;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nutrition-card {
  margin-bottom: 8rpx;
}

.nutrition-head {
  margin-bottom: 10rpx;
}

.nutrition-badge {
  font-size: 24rpx;
  color: #8e97a8;
  font-weight: 600;
}

.energy-box {
  background: #f4f7fb;
  border-radius: 14rpx;
  padding: 12rpx 16rpx;
}

.energy-header {
  display: flex;
  justify-content: center;
  gap: 120rpx;
  color: #91a0b4;
  font-size: 24rpx;
  font-weight: 600;
}

.energy-value {
  margin-top: 8rpx;
  text-align: center;
  color: #3f485a;
  font-size: 52rpx;
  line-height: 1.2;
  font-weight: 700;
}

.energy-note {
  margin-top: 8rpx;
  text-align: center;
  color: #8f99a9;
  font-size: 22rpx;
}

.bottom-bar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  gap: 10rpx;
  height: calc(94rpx + env(safe-area-inset-bottom));
  padding: 10rpx 14rpx calc(10rpx + env(safe-area-inset-bottom));
  background: #ffffff;
  box-shadow: 0 -10rpx 24rpx rgba(43, 57, 83, 0.08);
}

.collect-btn {
  width: 84rpx;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2rpx;
}

.collect-icon {
  font-size: 20rpx;
  color: #67c1eb;
  line-height: 1;
}

.collect-text {
  font-size: 20rpx;
  color: #8e97a8;
  line-height: 1;
}

.buy-combo {
  flex: 1;
  height: 100%;
  display: flex;
  border-radius: 999rpx;
  overflow: hidden;
}

.price-pane {
  width: 170rpx;
  background: #ffecee;
  color: #ea6c6c;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 34rpx;
  font-weight: 700;
}

.buy-pane {
  flex: 1;
  background: #ff5e76;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 26rpx;
  font-weight: 700;
}
</style>
