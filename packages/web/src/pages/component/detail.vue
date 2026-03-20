<template>
  <view class="component-detail-page">
    <nut-empty v-if="!detail" description="暂无成分数据" />

    <view v-if="detail">
      <view class="title">{{ detail.name }}</view>
      <view class="meta">风险等级：{{ detail.risk_level }}</view>
      <view class="desc">{{ detail.description || '暂无该成分解读' }}</view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Taro, { useLoad } from '@tarojs/taro'
import { componentApi, type ComponentDetail } from '../../apis/component'

const detail = ref<ComponentDetail | null>(null)

const loadDetail = async (params: { id?: string; name?: string }) => {
  try {
    detail.value = await componentApi.detail({
      id: params.id ? Number(params.id) : undefined,
      name: params.name ? decodeURIComponent(params.name) : undefined,
    })
  } catch (error) {
    console.error(error)
  }
}

useLoad((params) => {
  loadDetail(params)
})
</script>

<style lang="less">
.component-detail-page {
  padding: 20px;

  .title {
    font-size: 22px;
    font-weight: 600;
  }

  .meta {
    margin-top: 12px;
    color: #ff9f00;
  }

  .desc {
    margin-top: 12px;
    line-height: 1.7;
    color: #444;
  }
}
</style>
