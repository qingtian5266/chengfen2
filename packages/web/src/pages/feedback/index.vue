<template>
  <view class="feedback-page">
    <nut-textarea v-model="content" placeholder="请输入你的意见反馈" maxlength="300" />
    <nut-button block type="primary" class="submit" :loading="loading" @click="submit">
      提交反馈
    </nut-button>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Taro from '@tarojs/taro'
import { feedbackApi } from '../../apis/feedback'
import { ensureLogin } from '../../utils/auth'

const content = ref('')
const loading = ref(false)

const submit = async () => {
  const value = content.value.trim()
  if (!value) {
    Taro.showToast({ title: '请输入反馈内容', icon: 'none' })
    return
  }

  loading.value = true
  try {
    await ensureLogin()
    await feedbackApi.create(value)
    Taro.showToast({ title: '反馈已收到', icon: 'none' })
    content.value = ''
    setTimeout(() => {
      Taro.navigateBack()
    }, 1200)
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}
</script>

<style lang="less">
.feedback-page {
  padding: 20px;

  .submit {
    margin-top: 16px;
  }
}
</style>
