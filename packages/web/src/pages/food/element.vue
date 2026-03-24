<template>
  <view class="food-element-page">
    <view v-if="loading" class="state-card">加载中...</view>

    <view v-else class="detail-content">
      <view class="product-card">
        <view class="product-image-wrap">
          <image class="product-image" :src="coverImage" mode="aspectFit" />
        </view>

        <view class="product-name">{{ product.name }}</view>
        <view class="product-meta">品牌：{{ product.brand || '未知' }}&nbsp;&nbsp;规格：{{ productSpec }}</view>

        <view class="tag-row">
          <view
            v-for="tag in productTags"
            :key="tag"
            class="tag-chip"
          >
            {{ tag }}
          </view>
        </view>
      </view>

      <view class="table-section">
        <view class="table-title-row">
          <view class="table-title">成分解读表</view>
          <view class="table-count">解读出 {{ tableRows.length }} 种成分</view>
        </view>

        <view class="table-wrapper">
          <view class="table-row table-header">
            <view class="col col-name">成分名称</view>
            <view class="col col-risk">风险等级</view>
            <view class="col col-tag">成分标签</view>
            <view class="col col-effect">作用</view>
          </view>

          <view
            v-for="row in tableRows"
            :key="row.key"
            class="table-row table-body"
            @click="goComponent(row)"
          >
            <view class="col col-name">{{ row.name }}</view>
            <view class="col col-risk">
              <view :class="['risk-badge', `risk-${row.riskTone}`]">{{ row.riskGrade }}</view>
            </view>
            <view class="col col-tag">{{ row.tag }}</view>
            <view class="col col-effect">{{ row.effect }}</view>
          </view>

          <view v-if="!tableRows.length" class="table-empty">暂无成分数据</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import Taro, { useLoad } from '@tarojs/taro'
import { productApi, type ProductDetail } from '../../apis/product'
import { MOCK_FOOD_DETAIL, type FoodDetailMock } from './mock'

type RiskTone = 'low' | 'medium' | 'high' | 'unknown'

type ProductView = ProductDetail & {
  image_url?: string
  imageUrl?: string
  cover?: string
  spec?: string
}

interface IngredientRow {
  key: string
  id?: number
  name: string
  riskTone: RiskTone
  riskGrade: string
  tag: string
  effect: string
}

const loading = ref(false)
const productId = ref(0)
const product = ref<ProductView>({ ...MOCK_FOOD_DETAIL })

const normalizedRisk = (value?: string) => (value || '').toLowerCase().trim()

const mapRisk = (risk?: string): { tone: RiskTone; grade: string } => {
  const value = normalizedRisk(risk)

  if (value.includes('high') || value.includes('高') || value.includes('danger') || value.includes('禁')) {
    return { tone: 'high', grade: 'C' }
  }

  if (value.includes('medium') || value.includes('中')) {
    return { tone: 'medium', grade: 'B' }
  }

  if (value.includes('low') || value.includes('低')) {
    return { tone: 'low', grade: 'A' }
  }

  return { tone: 'unknown', grade: '-' }
}

const deriveTag = (name: string, description?: string) => {
  const text = `${name} ${description || ''}`

  if (/防腐|亚硝酸/.test(text)) return '防腐类'
  if (/增鲜|味精/.test(text)) return '增鲜类'
  if (/磷酸|卡拉胶|保持/.test(text)) return '稳定剂'
  if (/香辛|香料/.test(text)) return '调味类'
  if (/蛋白|肉|淀粉|盐|糖/.test(text)) return '基础成分'

  return '常规成分'
}

const deriveEffect = (name: string, description?: string) => {
  if (description?.trim()) {
    return description
  }

  const text = `${name} ${description || ''}`

  if (/防腐|亚硝酸/.test(text)) return '抑菌保鲜'
  if (/增鲜|味精/.test(text)) return '增强鲜味'
  if (/磷酸|卡拉胶|保持/.test(text)) return '保持口感'
  if (/香辛|香料/.test(text)) return '调味'
  if (/蛋白|肉|淀粉|盐|糖/.test(text)) return '食品主料'

  return '食品辅料'
}

const coverImage = computed(() => {
  const p = product.value
  return (
    p.image_url ||
    p.imageUrl ||
    p.cover ||
    MOCK_FOOD_DETAIL.image_url
  )
})

const productSpec = computed(() => {
  if (product.value.spec) {
    return product.value.spec
  }

  const name = product.value.name || ''
  const matched = name.match(/(\d+(?:\.\d+)?\s?(?:g|kg|ml|l))/i)
  if (matched) {
    return matched[1].replace(/\s+/g, '').toLowerCase()
  }

  return '340g'
})

const productTags = computed(() => {
  const ingredients = product.value.ingredients_text || ''
  const tags: string[] = []

  const hasHigh = (product.value.components || []).some((item) => mapRisk(item.risk_level).tone === 'high')
  tags.push(hasHigh ? '高脂肪' : '风险较低')
  tags.push(/甜味剂/.test(ingredients) ? '含甜味剂' : '无人工甜味剂')
  tags.push(/色素/.test(ingredients) ? '含色素' : '无人工色素')

  return tags
})

const tableRows = computed<IngredientRow[]>(() => {
  const list = Array.isArray(product.value.components) ? product.value.components : []

  return list.map((item, index) => {
    const risk = mapRisk(item.risk_level)

    return {
      key: `${item.id || item.name || 'row'}-${index}`,
      id: item.id,
      name: item.name || '未知成分',
      riskTone: risk.tone,
      riskGrade: risk.grade,
      tag: deriveTag(item.name || '', item.description),
      effect: deriveEffect(item.name || '', item.description),
    }
  })
})

const loadDetail = async () => {
  if (!productId.value) {
    product.value = { ...MOCK_FOOD_DETAIL }
    return
  }

  loading.value = true
  try {
    const detail = await productApi.detail(productId.value)
    product.value = {
      ...detail,
      spec: (detail as any).spec,
      image_url: (detail as any).image_url,
      imageUrl: (detail as any).imageUrl,
      cover: (detail as any).cover,
    }
  } catch (error) {
    console.error('load food element detail failed', error)
    Taro.showToast({ title: '详情加载失败，已展示示例数据', icon: 'none' })
    product.value = {
      ...MOCK_FOOD_DETAIL,
      id: productId.value || MOCK_FOOD_DETAIL.id,
    }
  } finally {
    loading.value = false
  }
}

const goComponent = (row: IngredientRow) => {
  if (row.id) {
    Taro.navigateTo({ url: `/pages/component/detail?id=${row.id}` })
    return
  }

  Taro.navigateTo({ url: `/pages/component/detail?name=${encodeURIComponent(row.name)}` })
}

useLoad((params) => {
  const id = Number(params?.id || 0)
  productId.value = Number.isFinite(id) && id > 0 ? id : 0
  loadDetail()
})
</script>

<style lang="less">
.food-element-page {
  min-height: 100vh;
  padding: 12px 16px 24px;
  background: #f2f4f7;
  box-sizing: border-box;
}

.state-card {
  margin-top: 16px;
  padding: 16px;
  background: #fff;
  border: 1px solid #e7e9ee;
  border-radius: 10px;
  color: #6b7482;
  text-align: center;
}

.detail-content {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.product-card {
  background: #fff;
  border: 1px solid #e6e8ed;
  border-radius: 10px;
  padding: 10px;
}

.product-image-wrap {
  width: 100%;
  height: 236px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-radius: 8px;
  background: #f4f5f7;
}

.product-image {
  width: 168px;
  max-width: 68%;
  height: 220px;
  border-radius: 6px;
  background: transparent;
}

.product-name {
  margin-top: 10px;
  color: #2f3745;
  font-size: 22px;
  font-weight: 600;
  line-height: 1.35;
}

.product-meta {
  margin-top: 4px;
  color: #7a8391;
  font-size: 12px;
  line-height: 1.4;
}

.tag-row {
  margin-top: 10px;
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.tag-chip {
  border-radius: 999px;
  padding: 4px 10px;
  font-size: 11px;
  font-weight: 600;
  color: #54b1e6;
  background: #e9f5fd;
}

.table-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.table-title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #3c4452;
}

.table-title {
  font-size: 20px;
  font-weight: 600;
}

.table-count {
  font-size: 14px;
  font-weight: 600;
  color: #5e6775;
}

.table-wrapper {
  border: 1px solid #e3e6ec;
  background: #fff;
}

.table-row {
  display: flex;
  align-items: stretch;
}

.table-header {
  background: #f4f5f7;
  color: #7b8493;
  font-size: 12px;
  font-weight: 600;
}

.table-body {
  border-top: 1px solid #eceef2;
  font-size: 13px;
  color: #4b5563;
}

.col {
  box-sizing: border-box;
  padding: 10px 8px;
  border-right: 1px solid #eceef2;
  display: flex;
  align-items: center;
  line-height: 1.4;

  &:last-child {
    border-right: none;
  }
}

.col-name {
  width: 34%;
  color: #2f3745;
  font-weight: 500;
}

.col-risk {
  width: 14%;
  justify-content: center;
}

.col-tag {
  width: 25%;
  color: #5c6675;
}

.col-effect {
  width: 27%;
  color: #6b7482;
}

.risk-badge {
  min-width: 22px;
  height: 22px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;

  &.risk-low {
    background: #e7f7ef;
    color: #1f9d55;
  }

  &.risk-medium {
    background: #eaf3fb;
    color: #2f9ed7;
  }

  &.risk-high {
    background: #fdebec;
    color: #dc2626;
  }

  &.risk-unknown {
    background: #eef2f7;
    color: #6b7280;
  }
}

.table-empty {
  padding: 18px 12px;
  text-align: center;
  color: #8b94a2;
  font-size: 13px;
}
</style>
