<template>
  <view class="history-page">
    <view class="header-actions" v-if="list.length">
      <nut-button size="small" type="danger" @click="clearAll">清空历史</nut-button>
    </view>

    <nut-empty v-if="list.length === 0" description="暂无浏览记录" />

    <nut-cell-group v-else>
      <nut-cell
        v-for="item in list"
        :key="item.id"
        :title="item.product.name"
        :sub-title="formatTime(item.updated_at)"
        @click="goProduct(item.product.id)"
      >
        <template #link>
          <nut-button size="small" @click.stop="remove(item.id)">删除</nut-button>
        </template>
      </nut-cell>
    </nut-cell-group>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Taro, { useDidShow } from '@tarojs/taro'
import { historyApi, type HistoryListItem } from '../../apis/history'
import { ensureLogin } from '../../utils/auth'

const list = ref<HistoryListItem[]>([])

const loadData = async () => {
  try {
    await ensureLogin()
    const res = await historyApi.list()
    list.value = res.list
  } catch (error) {
    console.error(error)
  }
}

const remove = async (id: number) => {
  await historyApi.delete(id)
  await loadData()
}

const clearAll = async () => {
  await historyApi.clear()
  await loadData()
}

const goProduct = (id: number) => {
  Taro.navigateTo({ url: `/pages/product/detail?id=${id}` })
}

const formatTime = (time: string) => {
  if (!time) {
    return ''
  }
  return String(time).replace('T', ' ').slice(0, 19)
}

useDidShow(() => {
  loadData()
})
</script>

<style lang="less">
.history-page {
  padding: 20px;

  .header-actions {
    margin-bottom: 12px;
    display: flex;
    justify-content: flex-end;
  }
}
</style>
