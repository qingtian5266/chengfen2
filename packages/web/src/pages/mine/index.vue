<template>
  <view class="mine-shell">
    <view class="ambient ambient-a" />
    <view class="ambient ambient-b" />

    <view class="profile-wrap">
      <image v-if="userInfo?.avatar" class="profile-avatar" :src="userInfo.avatar" mode="aspectFill" />
      <view v-else class="profile-avatar avatar-fallback">{{ avatarText }}</view>

      <view class="nickname">{{ userInfo?.nickname || '未登录用户' }}</view>
      <view class="openid" v-if="userInfo?.openid">ID: {{ userInfo.openid }}</view>
      <view class="login-btn" v-if="!userInfo" @click="handleLogin">微信登录</view>
    </view>

    <view class="shortcut-card">
      <view class="shortcut-item" @click="goCollect">
        <view class="shortcut-ico">藏</view>
        <view class="shortcut-text">我的收藏</view>
      </view>
      <view class="shortcut-item" @click="mockHealth">
        <view class="shortcut-ico">健</view>
        <view class="shortcut-text">健康关注</view>
      </view>
      <view class="shortcut-item" @click="mockUpload">
        <view class="shortcut-ico">传</view>
        <view class="shortcut-text">我的上传</view>
      </view>
      <view class="shortcut-item" @click="goHistory">
        <view class="shortcut-ico">迹</view>
        <view class="shortcut-text">浏览历史</view>
      </view>
    </view>

    <view class="menu-card">
      <view class="menu-row" @click="goFeedback">
        <view class="menu-left">
          <view class="menu-ico">议</view>
          <view class="menu-name">意见反馈</view>
        </view>
        <view class="menu-arrow">›</view>
      </view>
      <view class="menu-row" @click="mockInvite">
        <view class="menu-left">
          <view class="menu-ico">友</view>
          <view class="menu-name">推荐好友</view>
        </view>
        <view class="menu-arrow">›</view>
      </view>
      <view class="menu-row menu-row-danger" v-if="userInfo" @click="logout">
        <view class="menu-left">
          <view class="menu-ico">退</view>
          <view class="menu-name">退出登录</view>
        </view>
        <view class="menu-arrow">›</view>
      </view>
    </view>
    <AppTabBar current="mine" />
  </view>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import Taro, { useDidShow } from '@tarojs/taro'
import { clearAuth, ensureLogin, getUserInfo, type LocalUserInfo } from '../../utils/auth'
import AppTabBar from '../../components/app-tabbar.vue'

const userInfo = ref<LocalUserInfo | null>(null)

const avatarText = computed(() => {
  const nickname = userInfo.value?.nickname || '午'
  return nickname.slice(0, 1)
})

const refreshUser = () => {
  userInfo.value = getUserInfo()
}

const handleLogin = async () => {
  await ensureLogin()
  refreshUser()
}

const goCollect = async () => {
  await ensureLogin()
  Taro.navigateTo({ url: '/pages/collect/index' })
}

const goHistory = async () => {
  await ensureLogin()
  Taro.navigateTo({ url: '/pages/history/index' })
}

const goFeedback = async () => {
  await ensureLogin()
  Taro.navigateTo({ url: '/pages/feedback/index' })
}

const quickToast = (title: string) => {
  Taro.showToast({ title, icon: 'none' })
}

const mockHealth = () => quickToast('健康关注即将上线')
const mockUpload = () => quickToast('上传记录即将上线')
const mockService = () => quickToast('在线客服建设中')
const mockInvite = () => quickToast('推荐好友功能开发中')
const mockRate = () => quickToast('感谢你的支持')
const mockSetting = () => quickToast('设置功能开发中')

const logout = () => {
  clearAuth()
  refreshUser()
  Taro.showToast({ title: '已退出登录', icon: 'none' })
}

useDidShow(() => {
  refreshUser()
})
</script>

<style lang="less">
.mine-shell {
  position: relative;
  min-height: 100vh;
  padding: 40rpx;
  overflow: hidden;

  .ambient {
    position: absolute;
    border-radius: 999rpx;
    pointer-events: none;
  }

  .ambient-a {
    width: 420rpx;
    height: 420rpx;
    top: -180rpx;
    left: -80rpx;
    background: radial-gradient(circle, rgba(111, 197, 255, 0.38) 0%, rgba(111, 197, 255, 0) 70%);
  }

  .ambient-b {
    width: 400rpx;
    height: 400rpx;
    top: 180rpx;
    right: -160rpx;
    background: radial-gradient(circle, rgba(173, 200, 255, 0.3) 0%, rgba(173, 200, 255, 0) 68%);
  }

  .profile-wrap {
    position: relative;
    z-index: 2;
    display: flex;
    flex-direction: column;
    align-items: center;
    animation: rise-in 450ms ease-out;
  }

  .profile-avatar {
    width: 170rpx;
    height: 170rpx;
    border-radius: 50%;
    box-shadow: 0 20rpx 44rpx rgba(88, 129, 194, 0.2);
    margin-top: 48rpx;
  }

  .avatar-fallback {
    background: linear-gradient(160deg, #9cd6ff 0%, #59acef 100%);
    color: #fff;
    font-size: 66rpx;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .nickname {
    margin-top: 22rpx;
    font-size: 58rpx;
    font-weight: 700;
    color: #1f2d4c;
  }

  .openid {
    margin-top: 10rpx;
    color: #7e8ca9;
    font-size: 24rpx;
    word-break: break-all;
  }

  .login-btn {
    margin-top: 24rpx;
    width: 220rpx;
    height: 68rpx;
    border-radius: 999rpx;
    background: linear-gradient(160deg, #5bc4ff 0%, #2e95dd 100%);
    color: #fff;
    font-size: 28rpx;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .shortcut-card {
    position: relative;
    z-index: 2;
    margin-top: 38rpx;
    padding: 30rpx 16rpx;
    border-radius: 28rpx;
    background: rgba(255, 255, 255, 0.88);
    border: 2rpx solid rgba(126, 180, 230, 0.2);
    box-shadow: 0 18rpx 48rpx rgba(99, 137, 195, 0.14);
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 10rpx;
  }

  .shortcut-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12rpx;
  }

  .shortcut-ico {
    width: 64rpx;
    height: 64rpx;
    border-radius: 50%;
    background: linear-gradient(160deg, #d7efff 0%, #9ed6fb 100%);
    color: #3d8ed0;
    font-size: 30rpx;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .shortcut-text {
    font-size: 28rpx;
    color: #2d3f62;
  }

  .menu-card {
    position: relative;
    z-index: 2;
    margin-top: 18rpx;
    border-radius: 28rpx;
    background: rgba(255, 255, 255, 0.9);
    border: 2rpx solid rgba(126, 180, 230, 0.2);
    box-shadow: 0 18rpx 48rpx rgba(99, 137, 195, 0.12);
    overflow: hidden;
  }

  .menu-row {
    height: 108rpx;
    padding: 0 26rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-top: 1rpx solid rgba(122, 164, 212, 0.16);

    &:first-child {
      border-top: none;
    }
  }

  .menu-row-danger .menu-name,
  .menu-row-danger .menu-ico {
    color: #e06c73;
  }

  .menu-left {
    display: flex;
    align-items: center;
    gap: 18rpx;
  }

  .menu-ico {
    width: 50rpx;
    height: 50rpx;
    border-radius: 50%;
    border: 2rpx solid rgba(69, 115, 170, 0.25);
    color: #3f5280;
    font-size: 24rpx;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .menu-name {
    font-size: 32rpx;
    color: #283b60;
  }

  .menu-arrow {
    color: #a8b2c6;
    font-size: 44rpx;
    line-height: 1;
  }

}

@keyframes rise-in {
  0% {
    opacity: 0;
    transform: translateY(22rpx);
  }

  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
