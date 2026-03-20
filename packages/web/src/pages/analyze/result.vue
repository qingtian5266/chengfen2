<template>
  <view class="analyze-page">
    <view v-if="result">
      <view class="summary">
        <text>低风险 {{ result.summary.low }}</text>
        <text>中风险 {{ result.summary.medium }}</text>
        <text>高风险 {{ result.summary.high }}</text>
      </view>

      <nut-cell-group>
        <nut-cell
          v-for="item in result.list"
          :key="item.name"
          :title="item.name"
          :sub-title="item.reason"
          @click="goComponent(item.name)"
        >
          <template #link>
            <text :class="`risk-${item.risk_level}`">{{ item.risk_level }}</text>
          </template>
        </nut-cell>
      </nut-cell-group>
    </view>
    <nut-empty v-else description="暂无分析结果" />
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Taro, { useLoad } from '@tarojs/taro'
import { analyzeApi, type AnalyzeResult } from '../../apis/analyze'

const result = ref<AnalyzeResult | null>(null)

const loadResult = async () => {
  const payload = Taro.getStorageSync('analyzePayload')
  if (!payload?.components?.length) {
    return
  }

  try {
    result.value = await analyzeApi.components(payload)
  } catch (error) {
    Taro.showToast({ title: '分析失败', icon: 'none' })
    console.error(error)
  }
}

const goComponent = (name: string) => {
  Taro.navigateTo({ url: `/pages/component/detail?name=${encodeURIComponent(name)}` })
}

useLoad(() => {
  loadResult()
})
</script>

<style lang="less">
.analyze-page {
  padding: 20px;

  .summary {
    display: flex;
    justify-content: space-between;
    margin-bottom: 16px;
    color: #666;
  }

  .risk-low {
    color: #3fbb46;
  }

  .risk-medium {
    color: #ff9f00;
  }

  .risk-high {
    color: #fa2c19;
  }
}
</style>
