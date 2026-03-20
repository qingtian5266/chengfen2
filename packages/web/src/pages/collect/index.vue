<template>
  <view class="collect-shell">
    <view class="top-bar">
      <view class="back" @click="goBack">‹</view>
      <view class="title">我的收藏</view>
      <view class="right-actions">
        <view class="action" @click="mockSearch">搜</view>
        <view class="action" @click="mockEdit">编辑</view>
      </view>
    </view>

    <view class="category-tabs">
      <view class="tab" @click="onlyFoodTip('化妆品')">化妆品</view>
      <view class="tab tab-active">食品</view>
      <view class="tab" @click="onlyFoodTip('成分')">成分</view>
    </view>

    <view v-if="list.length === 0" class="empty-card">暂无收藏商品，先去首页逛逛吧</view>

    <view v-else class="collect-list">
      <view class="collect-card" v-for="item in list" :key="item.id" @click="goProduct(item.product.id)">
        <view class="thumb">{{ shortName(item.product.name) }}</view>

        <view class="info">
          <view class="name">{{ item.product.name }}</view>
          <view class="meta">{{ item.product.brand || '未知品牌' }} | 条码 {{ barcodeTail(item.product.barcode) }}</view>

          <view class="chips">
            <view class="chip chip-warning">高脂肪</view>
            <view class="chip">无人工甜味剂</view>
            <view class="chip">无人工色素</view>
          </view>

          <view class="risk-line">
            <view class="risk-dot" :class="riskClass(item.product.risk_level)" />
            <view class="risk-text">{{ riskText(item.product.risk_level) }}</view>
          </view>
        </view>

        <view class="delete-btn" @click.stop="cancel(item.product.id)">删除</view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Taro, { useDidShow } from '@tarojs/taro'
import { collectApi, type CollectListItem } from '../../apis/collect'
import { ensureLogin } from '../../utils/auth'

const list = ref<CollectListItem[]>([])

const normalizedRisk = (value?: string) => (value || '').toLowerCase().trim()

const loadData = async () => {
  try {
    await ensureLogin()
    const res = await collectApi.list()
    list.value = res.list
  } catch (error) {
    console.error(error)
  }
}

const cancel = async (productId: number) => {
  await collectApi.cancel(productId)
  Taro.showToast({ title: '已删除', icon: 'none' })
  await loadData()
}

const goProduct = (id: number) => {
  Taro.navigateTo({ url: `/pages/product/detail?id=${id}` })
}

const goBack = () => {
  Taro.navigateBack({
    delta: 1,
    fail: () => {
      Taro.redirectTo({ url: '/pages/mine/index' })
    },
  })
}

const shortName = (name: string) => {
  const text = (name || '').trim()
  return text.slice(0, 4) || '收藏'
}

const barcodeTail = (barcode: string) => {
  if (!barcode) {
    return '-'
  }
  return barcode.length > 6 ? barcode.slice(-6) : barcode
}

const riskClass = (value?: string) => {
  const risk = normalizedRisk(value)
  if (risk.includes('high') || risk.includes('高') || risk.includes('danger') || risk.includes('禁')) {
    return 'dot-high'
  }
  if (risk.includes('medium') || risk.includes('中')) {
    return 'dot-medium'
  }
  return 'dot-low'
}

const riskText = (value?: string) => {
  const risk = normalizedRisk(value)
  if (risk.includes('high') || risk.includes('高') || risk.includes('danger') || risk.includes('禁')) {
    return '高风险成分较多'
  }
  if (risk.includes('medium') || risk.includes('中')) {
    return '适量食用'
  }
  return '风险较低'
}

const onlyFoodTip = (name: string) => {
  Taro.showToast({ title: `${name}收藏即将上线`, icon: 'none' })
}

const mockSearch = () => {
  Taro.showToast({ title: '搜索功能建设中', icon: 'none' })
}

const mockEdit = () => {
  Taro.showToast({ title: '批量编辑即将上线', icon: 'none' })
}

useDidShow(() => {
  loadData()
})
</script>

<style lang="less">
.collect-shell {
  min-height: 100vh;
  padding: calc(env(safe-area-inset-top) + 18rpx) 20rpx 26rpx;

  .top-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10rpx 6rpx 14rpx;
  }

  .back {
    width: 56rpx;
    height: 56rpx;
    border-radius: 50%;
    border: 2rpx solid rgba(66, 93, 145, 0.26);
    color: #243a62;
    font-size: 44rpx;
    line-height: 46rpx;
    text-align: center;
  }

  .title {
    font-size: 52rpx;
    font-weight: 700;
    color: #223355;
  }

  .right-actions {
    display: flex;
    align-items: center;
    gap: 12rpx;
  }

  .action {
    min-width: 68rpx;
    height: 56rpx;
    padding: 0 16rpx;
    border-radius: 999rpx;
    color: #425680;
    border: 2rpx solid rgba(66, 93, 145, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 28rpx;
  }

  .category-tabs {
    margin-top: 4rpx;
    height: 92rpx;
    border-radius: 18rpx;
    background: rgba(255, 255, 255, 0.86);
    border: 2rpx solid rgba(136, 176, 226, 0.2);
    display: flex;
    overflow: hidden;
  }

  .tab {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 36rpx;
    color: #54658c;
  }

  .tab-active {
    color: #23395f;
    font-weight: 700;
    position: relative;

    &::after {
      content: '';
      position: absolute;
      bottom: 10rpx;
      width: 46rpx;
      height: 6rpx;
      border-radius: 999rpx;
      background: #4db6f5;
    }
  }

  .empty-card {
    margin-top: 24rpx;
    border-radius: 26rpx;
    background: rgba(255, 255, 255, 0.9);
    border: 2rpx solid rgba(136, 176, 226, 0.2);
    text-align: center;
    padding: 80rpx 20rpx;
    color: #7483a1;
    font-size: 32rpx;
  }

  .collect-list {
    margin-top: 22rpx;
    display: flex;
    flex-direction: column;
    gap: 16rpx;
  }

  .collect-card {
    border-radius: 26rpx;
    background: rgba(255, 255, 255, 0.93);
    border: 2rpx solid rgba(136, 176, 226, 0.2);
    box-shadow: 0 14rpx 34rpx rgba(95, 132, 189, 0.12);
    padding: 16rpx;
    display: flex;
    gap: 16rpx;
    align-items: stretch;
  }

  .thumb {
    width: 170rpx;
    border-radius: 18rpx;
    background: linear-gradient(160deg, #f4f8ff 0%, #d7e7ff 100%);
    border: 2rpx solid rgba(138, 180, 224, 0.26);
    color: #40608d;
    font-size: 38rpx;
    font-weight: 700;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 10rpx;
  }

  .info {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
  }

  .name {
    font-size: 40rpx;
    line-height: 1.3;
    color: #223458;
    font-weight: 700;
  }

  .meta {
    margin-top: 8rpx;
    font-size: 30rpx;
    color: #7180a0;
  }

  .chips {
    margin-top: 12rpx;
    display: flex;
    flex-wrap: wrap;
    gap: 10rpx;
  }

  .chip {
    min-height: 44rpx;
    padding: 0 14rpx;
    border-radius: 999rpx;
    background: rgba(87, 183, 242, 0.15);
    color: #2f8ecc;
    font-size: 24rpx;
    display: flex;
    align-items: center;
  }

  .chip-warning {
    background: rgba(244, 178, 90, 0.16);
    color: #d19137;
  }

  .risk-line {
    margin-top: 12rpx;
    display: flex;
    align-items: center;
    gap: 10rpx;
  }

  .risk-dot {
    width: 14rpx;
    height: 14rpx;
    border-radius: 50%;
  }

  .dot-high {
    background: #ea6d77;
  }

  .dot-medium {
    background: #f0a64a;
  }

  .dot-low {
    background: #3fbf86;
  }

  .risk-text {
    font-size: 28rpx;
    color: #415474;
  }

  .delete-btn {
    align-self: center;
    min-width: 88rpx;
    height: 56rpx;
    border-radius: 999rpx;
    background: rgba(237, 108, 118, 0.13);
    color: #d9606a;
    font-size: 26rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 14rpx;
  }
}
</style>
