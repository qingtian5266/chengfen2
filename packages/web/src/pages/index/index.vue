<template>
  <view class="home-page">
    <view class="bg-overlay" />

    <view class="top-meta">
      <view class="location-pill">
        <view class="pill-dot" />
        <text>包头市</text>
        <view class="pill-arrow" />
      </view>
      <view class="user-avatar" @click="goMine" />
    </view>

    <view class="weather-row">
      <view class="sun-icon" />
      <text class="weather-text">晴7°C | 紫外线 3级 中等 | 空气质量 中度污染</text>
    </view>

    <view class="brand-block">
      <view class="brand-title-row">
        <view class="brand-logo">
          <view class="cat-face" />
        </view>
        <view class="brand-title">成分喵</view>
      </view>
      <view class="brand-sub">食品添加剂和化妆品成分查询</view>
    </view>

    <view class="search-bar">
      <input
        v-model="keyword"
        class="search-input"
        placeholder="输入关键词或复制商品链接到这里"
        placeholder-style="color:#b9c4d3;"
        confirm-type="search"
        @confirm="goSearch"
      />
      <view class="search-icons">
        <view class="icon-btn" @click="scanBarcode">⌗</view>
        <view class="icon-btn" @click="goRecognition">◌</view>
      </view>
    </view>

    <view v-if="suggestions.length" class="suggest-panel">
      <view
        v-for="item in suggestions"
        :key="item"
        class="suggest-item"
        @click="selectSuggestion(item)"
      >
        {{ item }}
      </view>
    </view>

    <view class="action-row">
      <view class="action-item" @click="goRecognition">
        <view class="action-orb orb-blue">
          <view class="orb-core">◍</view>
        </view>
        <view class="action-label">拍照查成分</view>
      </view>
      <view class="action-item" @click="scanBarcode">
        <view class="action-orb orb-green">
          <view class="orb-core">▥</view>
        </view>
        <view class="action-label">扫码查成分</view>
      </view>
      <view class="action-item" @click="openLinkSearch">
        <view class="action-orb orb-violet">
          <view class="orb-core">⌁</view>
        </view>
        <view class="action-label">链接查成分</view>
      </view>
    </view>

    <view class="quick-row">
      <view class="quick-pill" @click="goBatch">批号查询</view>
      <view class="quick-pill" @click="goHistory">浏览历史</view>
      <view class="quick-pill" @click="goHelp">使用帮助</view>
    </view>
    <AppTabBar current="home" />
  </view>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import Taro from '@tarojs/taro'
import { searchApi } from '../../apis/search'
import { productApi } from '../../apis/product'
import { ensureLogin } from '../../utils/auth'
import AppTabBar from '../../components/app-tabbar.vue'

const keyword = ref('')
const suggestions = ref<string[]>([])
let suggestTimer: ReturnType<typeof setTimeout> | null = null

const onKeywordChange = () => {
  if (suggestTimer) {
    clearTimeout(suggestTimer)
  }
  suggestTimer = setTimeout(loadSuggest, 220)
}

watch(keyword, () => {
  onKeywordChange()
})

const loadSuggest = async () => {
  const value = keyword.value.trim()
  if (!value) {
    suggestions.value = []
    return
  }

  try {
    suggestions.value = await searchApi.suggest(value)
  } catch (error) {
    console.error('suggest error', error)
  }
}

const selectSuggestion = (value: string) => {
  keyword.value = value
  goSearch()
}

const goSearch = () => {
  const value = keyword.value.trim()
  if (!value) {
    Taro.showToast({ title: '请输入关键词', icon: 'none' })
    return
  }
  Taro.navigateTo({ url: `/pages/search/result?keyword=${encodeURIComponent(value)}` })
}

const openLinkSearch = async () => {
  try {
    const clipboard = await Taro.getClipboardData()
    const value = String(clipboard.data || '').trim()
    if (!value) {
      Taro.showToast({ title: '剪贴板暂无内容', icon: 'none' })
      return
    }
    keyword.value = value
    goSearch()
  } catch (error) {
    console.error('clipboard error', error)
    Taro.showToast({ title: '读取剪贴板失败', icon: 'none' })
  }
}

const goRecognition = () => {
  Taro.navigateTo({ url: '/pages/recognition/index' })
}

const goHistory = async () => {
  await ensureLogin()
  Taro.navigateTo({ url: '/pages/history/index' })
}

const goMine = () => {
  Taro.redirectTo({ url: '/pages/mine/index' })
}

const goBatch = () => {
  Taro.showToast({ title: '批号查询即将上线', icon: 'none' })
}

const goHelp = () => {
  Taro.navigateTo({ url: '/pages/feedback/index' })
}

const goFeedback = () => {
  Taro.navigateTo({ url: '/pages/feedback/index' })
}

const scanBarcode = async () => {
  try {
    const res = await Taro.scanCode({ scanType: ['barCode'] })
    const barcode = (res.result || '').trim()
    if (!barcode) {
      Taro.showToast({ title: '未识别到条码', icon: 'none' })
      return
    }

    const product = await productApi.barcode(barcode)
    if (product?.id) {
      Taro.navigateTo({ url: `/pages/product/detail?id=${product.id}` })
      return
    }

    Taro.showModal({
      title: '未收录该商品',
      content: '你可以使用拍照识别继续分析',
      confirmText: '拍照识别',
      success: (modalRes) => {
        if (modalRes.confirm) {
          goRecognition()
        }
      },
    })
  } catch (error) {
    Taro.showToast({ title: '扫码失败，请重试', icon: 'none' })
    console.error('scan error', error)
  }
}
</script>

<style lang="less">
.home-page {
  position: relative;
  min-height: 100vh;
  padding: 40rpx 40rpx; 
  overflow: hidden;
  background:
    linear-gradient(168deg, #dff3ff 0%, #edf4ff 48%, #f6f8ff 100%),
    radial-gradient(circle at 85% 6%, rgba(139, 214, 255, 0.44) 0%, rgba(139, 214, 255, 0) 52%),
    radial-gradient(circle at 6% 25%, rgba(167, 218, 255, 0.36) 0%, rgba(167, 218, 255, 0) 46%);

  .bg-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(132deg, rgba(255, 255, 255, 0) 32%, rgba(195, 218, 255, 0.24) 62%, rgba(255, 255, 255, 0) 82%);
    pointer-events: none;
  }

  .top-meta {
    position: relative;
    z-index: 2;
    margin-top: 10rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .location-pill {
    height: 50rpx;
    border-radius: 999rpx;
    background: rgba(92, 186, 246, 0.2);
    border: 1rpx solid rgba(105, 186, 237, 0.26);
    color: #3f5f8f;
    display: inline-flex;
    align-items: center;
    padding: 0 16rpx;
    font-size: 28rpx;
    gap: 8rpx;
  }

  .pill-dot {
    width: 16rpx;
    height: 16rpx;
    border-radius: 50%;
    background: #4fb2ec;
    position: relative;

    &::after {
      content: '';
      position: absolute;
      left: 6rpx;
      top: 6rpx;
      width: 8rpx;
      height: 8rpx;
      border-radius: 50%;
      background: #fff;
      opacity: 0.9;
    }
  }

  .pill-arrow {
    width: 0;
    height: 0;
    border-left: 6rpx solid transparent;
    border-right: 6rpx solid transparent;
    border-top: 8rpx solid #54a8df;
    margin-top: 4rpx;
  }

  .user-avatar {
    width: 66rpx;
    height: 66rpx;
    border-radius: 50%;
    background: linear-gradient(150deg, #ffd9b1 0%, #f3b48c 34%, #648fce 100%);
    border: 3rpx solid rgba(255, 255, 255, 0.8);
    box-shadow: 0 8rpx 20rpx rgba(91, 126, 183, 0.24);
  }

  .weather-row {
    position: relative;
    z-index: 2;
    margin-top: 22rpx;
    color: #324a78;
    font-size: 28rpx;
    display: flex;
    align-items: center;
    gap: 10rpx;
    letter-spacing: 0.2rpx;
  }

  .weather-text {
    flex: 1;
    white-space: nowrap;
  }

  .sun-icon {
    width: 24rpx;
    height: 24rpx;
    border-radius: 50%;
    background: #f69f98;
    box-shadow: 0 0 0 5rpx rgba(246, 159, 152, 0.24);
    margin-right: 4rpx;
  }

  .weather-arrow {
    color: #58698e;
    font-size: 34rpx;
    line-height: 1;
  }

  .brand-block {
    position: relative;
    z-index: 2;
    margin-top: 240rpx;
    text-align: center;
  }

  .brand-title-row {
    display: inline-flex;
    align-items: center;
    gap: 14rpx;
  }

  .brand-logo {
    width: 64rpx;
    height: 64rpx;
    border-radius: 50%;
    background: rgba(89, 189, 241, 0.2);
    border: 2rpx solid rgba(92, 186, 241, 0.6);
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;

    &::before,
    &::after {
      content: '';
      position: absolute;
      top: -6rpx;
      width: 12rpx;
      height: 12rpx;
      border-radius: 3rpx;
      border: 2rpx solid #5ab8ed;
      background: #e6f6ff;
      transform: rotate(45deg);
    }

    &::before {
      left: 14rpx;
    }

    &::after {
      right: 14rpx;
    }
  }

  .cat-face {
    width: 30rpx;
    height: 24rpx;
    border: 2rpx solid #56b5ea;
    border-radius: 999rpx 999rpx 12rpx 12rpx;
    position: relative;

    &::before,
    &::after {
      content: '';
      position: absolute;
      top: 9rpx;
      width: 4rpx;
      height: 4rpx;
      border-radius: 50%;
      background: #56b5ea;
    }

    &::before {
      left: 7rpx;
    }

    &::after {
      right: 7rpx;
    }
  }

  .brand-title {
    color: #43ace9;
    font-size: 66rpx;
    line-height: 1;
    font-weight: 700;
    letter-spacing: 2rpx;
  }

  .brand-sub {
    margin-top: 24rpx;
    color: #55aedd;
    font-size: 30rpx;
  }

  .search-bar {
    position: relative;
    z-index: 2;
    margin: 0 auto;
    margin-top: 78rpx;
    width: 96%;
    height: 120rpx;
    border-radius: 54rpx;
    border: 4rpx solid #4eb3ed;
    background: rgba(255, 255, 255, 0.78);
    box-shadow: inset 0 0 0 1rpx rgba(255, 255, 255, 0.65);
    display: flex;
    align-items: center;
    padding: 0 22rpx 0 36rpx;
  }

  .search-input {
    flex: 1;
    height: 100%;
    font-size: 28rpx;
    display: flex;
    align-items: center;

  }

  .search-icons {
    display: flex;
    align-items: center;
    gap: 8rpx;
  }

  .icon-btn {
    width: 50rpx;
    height: 50rpx;
    border-radius: 50%;
    color: #5a6386;
    font-size: 40rpx;
    font-weight: 500;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .suggest-panel {
    position: relative;
    z-index: 4;
    margin-top: 14rpx;
    border-radius: 24rpx;
    background: rgba(255, 255, 255, 0.92);
    border: 1rpx solid rgba(122, 174, 226, 0.26);
    overflow: hidden;
  }

  .suggest-item {
    min-height: 76rpx;
    padding: 0 26rpx;
    display: flex;
    align-items: center;
    color: #3f567f;
    font-size: 32rpx;
    border-top: 1rpx solid rgba(130, 171, 220, 0.2);

    &:first-child {
      border-top: none;
    }
  }

  .action-row {
    position: relative;
    z-index: 2;
    margin-top: 120rpx;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10rpx;
  }

  .action-item {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .action-orb {
    width: 90rpx;
    height: 90rpx;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;

    &::after {
      content: '';
      position: absolute;
      inset: -16rpx;
      border-radius: 50%;
      filter: blur(4rpx);
      z-index: -1;
    }
  }

  .orb-core {
    width: 56rpx;
    height: 56rpx;
    border-radius: 16rpx;
    background: rgba(255, 255, 255, 0.22);
    color: #fff;
    font-size: 32rpx;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .orb-blue {
    background: radial-gradient(circle at 24% 20%, #9cd9ff 0%, #45a9f0 74%);

    &::after {
      background: rgba(90, 157, 240, 0.24);
    }
  }

  .orb-green {
    background: radial-gradient(circle at 24% 20%, #a4efd8 0%, #43c49a 74%);

    &::after {
      background: rgba(77, 192, 145, 0.24);
    }
  }

  .orb-violet {
    background: radial-gradient(circle at 24% 20%, #cac4ff 0%, #7d76f4 74%);

    &::after {
      background: rgba(130, 113, 241, 0.24);
    }
  }

  .action-label {
    margin-top: 24rpx;
    color: #353a56;
    font-size: 28rpx;
    font-weight: 500;
  }

  .quick-row {
    position: relative;
    z-index: 2;
    margin-top: 44rpx;
    display: flex;
    gap: 10%;
    padding: 0 16rpx;
  }

  .quick-pill {
    flex: 1;
    height: 60rpx;
    border-radius: 999rpx;
    margin-top: 32px;
    border: 1rpx solid rgba(134, 187, 230, 0.34);
    background: rgba(255, 255, 255, 0.46);
    color: #7fa7c8;
    font-size: 28rpx;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .review-row {
    position: relative;
    z-index: 2;
    margin-top: 126rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10rpx;
    color: #63abd5;
    font-size: 38rpx;
  }

  .review-icon {
    font-size: 32rpx;
    line-height: 1;
  }

  .review-arrow {
    font-size: 38rpx;
    line-height: 1;
  }

}
</style>
