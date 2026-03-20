<template>
  <view class="recognition-page">
    <nut-button type="primary" block @click="chooseImage">选择图片</nut-button>
    <image v-if="imageUrl" class="preview" :src="imageUrl" mode="aspectFill" />

    <nut-form>
      <nut-form-item label="识别辅助文本">
        <nut-textarea v-model="mockText" placeholder="可手动输入待识别成分文本，Mock OCR 使用" />
      </nut-form-item>
      <nut-form-item label="分类">
        <nut-radio-group v-model="category" direction="horizontal">
          <nut-radio label="food">食品</nut-radio>
          <nut-radio label="daily">日化</nut-radio>
        </nut-radio-group>
      </nut-form-item>
      <nut-form-item label="识别结果">
        <nut-textarea v-model="componentsText" placeholder="识别后可手动编辑成分（逗号分隔）" />
      </nut-form-item>
    </nut-form>

    <view class="actions">
      <nut-button type="success" @click="runOcr" :loading="loading">OCR识别</nut-button>
      <nut-button type="primary" @click="goAnalyze">开始分析</nut-button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Taro from '@tarojs/taro'
import { recognitionApi } from '../../apis/recognition'

const imageUrl = ref('')
const mockText = ref('')
const componentsText = ref('')
const category = ref<'food' | 'daily'>('food')
const loading = ref(false)

const chooseImage = async () => {
  try {
    const res = await Taro.chooseImage({ count: 1, sourceType: ['camera', 'album'] })
    if (res.tempFilePaths?.length) {
      imageUrl.value = res.tempFilePaths[0]
    }
  } catch (error) {
    Taro.showToast({ title: '选择图片失败', icon: 'none' })
    console.error(error)
  }
}

const runOcr = async () => {
  loading.value = true
  try {
    const res = await recognitionApi.ocr({
      imageUrl: imageUrl.value,
      mockText: mockText.value,
    })
    componentsText.value = res.components.map((item) => item.name).join('，')
  } catch (error) {
    Taro.showToast({ title: 'OCR识别失败', icon: 'none' })
    console.error(error)
  } finally {
    loading.value = false
  }
}

const goAnalyze = () => {
  const components = componentsText.value
    .split(/[，,、\n\s]+/)
    .map((item) => item.trim())
    .filter(Boolean)

  if (components.length === 0) {
    Taro.showToast({ title: '请先识别或填写成分', icon: 'none' })
    return
  }

  Taro.setStorageSync('analyzePayload', {
    category: category.value,
    components,
  })
  Taro.navigateTo({ url: '/pages/analyze/result' })
}
</script>

<style lang="less">
.recognition-page {
  padding: 20px;

  .preview {
    width: 100%;
    height: 220px;
    margin-top: 12px;
    border-radius: 8px;
  }

  .actions {
    margin-top: 20px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }
}
</style>
