<template>
  <view class="app-tabbar">
    <nut-tabbar
      :model-value="current"
      bottom
      safe-area-inset-bottom
      placeholder
      unactive-color="#93a1b7"
      active-color="#2c456e"
      :before-switch="handleBeforeSwitch"
    >
      <nut-tabbar-item name="home" tab-title="首页">
        <template #icon="{ active }">
          <view class="tab-icon" :class="['tab-icon-home', { 'is-active': active }]">首</view>
        </template>
      </nut-tabbar-item>
      <nut-tabbar-item name="recognition" tab-title="识别">
        <template #icon="{ active }">
          <view class="tab-icon" :class="['tab-icon-scan', { 'is-active': active }]">扫</view>
        </template>
      </nut-tabbar-item>
      <nut-tabbar-item name="mine" tab-title="我的">
        <template #icon="{ active }">
          <view class="tab-icon" :class="['tab-icon-mine', { 'is-active': active }]">我</view>
        </template>
      </nut-tabbar-item>
    </nut-tabbar>
  </view>
</template>

<script setup lang="ts">
import Taro from '@tarojs/taro'

type TabKey = 'home' | 'recognition' | 'mine'

const props = defineProps<{
  current: 'home' | 'mine'
}>()

const routeMap: Record<Exclude<TabKey, 'recognition'>, string> = {
  home: '/pages/index/index',
  mine: '/pages/mine/index',
}

const handleBeforeSwitch = (_data: unknown, active: string | number) => {
  const key = String(active) as TabKey
  if (key === props.current) {
    return false
  }

  if (key === 'recognition') {
    Taro.navigateTo({ url: '/pages/recognition/index' })
    return false
  }

  const url = routeMap[key as Exclude<TabKey, 'recognition'>]
  if (url) {
    Taro.redirectTo({ url })
  }

  return false
}
</script>

<style lang="less" scoped>
.app-tabbar {
  :deep(.nut-tabbar) {
    height: calc(120rpx + env(safe-area-inset-bottom));
    padding: 0 28rpx env(safe-area-inset-bottom);
    border-top: none;
    border-bottom: none;
    background: rgba(255, 255, 255, 0.94);
    box-shadow: 0 -14rpx 36rpx rgba(84, 123, 176, 0.12);
    backdrop-filter: blur(10rpx);
  }

  :deep(.nut-tabbar-item_icon-box_nav-word) {
    margin-top: 8rpx;
    font-size: 24rpx;
    font-weight: 600;
  }
}

.tab-icon {
  width: 52rpx;
  height: 52rpx;
  border-radius: 50%;
  border: 2rpx solid currentColor;
  color: #9ca9bd;
  font-size: 24rpx;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 160ms ease;
}

.tab-icon-home {
  background: linear-gradient(160deg, rgba(97, 192, 246, 0.22) 0%, rgba(67, 171, 236, 0.14) 100%);
}

.tab-icon-scan {
  background: linear-gradient(160deg, rgba(135, 221, 255, 0.38) 0%, rgba(71, 190, 232, 0.24) 100%);
}

.tab-icon-mine {
  background: linear-gradient(160deg, rgba(166, 190, 244, 0.24) 0%, rgba(127, 151, 219, 0.16) 100%);
}

.is-active {
  color: #2c456e;
  transform: translateY(-2rpx);
}
</style>
