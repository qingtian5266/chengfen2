<template>
  <view class="search-result-page">
    <view class="keyword">关键词：{{ keyword }}</view>

    <nut-divider>商品结果</nut-divider>
    <nut-empty v-if="products.length === 0" description="暂无相关商品" />
    <nut-cell-group v-else>
      <nut-cell
        v-for="item in products"
        :key="item.id"
        :title="item.name"
        :sub-title="`${item.brand || ''} ${item.barcode || ''}`"
        @click="goProduct(item.id)"
      >
        <template #link>
          <text class="risk">{{ item.risk_level }}</text>
        </template>
      </nut-cell>
    </nut-cell-group>

    <nut-divider>成分结果</nut-divider>
    <nut-empty v-if="components.length === 0" description="暂无相关成分" />
    <nut-cell-group v-else>
      <nut-cell
        v-for="item in components"
        :key="item.id"
        :title="item.name"
        :sub-title="item.risk_level"
        @click="goComponent(item.id)"
      />
    </nut-cell-group>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Taro, { useLoad } from '@tarojs/taro'
import { searchApi } from '../../apis/search'

const keyword = ref('')
const products = ref<Array<any>>([])
const components = ref<Array<any>>([])

const loadData = async () => {
  if (!keyword.value) {
    return
  }
  try {
    const data = await searchApi.query(keyword.value)
    products.value = data.products || []
    components.value = data.components || []
  } catch (error) {
    console.error('search query error', error)
  }
}

const goProduct = (id: number) => {
  Taro.navigateTo({ url: `/pages/product/detail?id=${id}` })
}

const goComponent = (id: number) => {
  Taro.navigateTo({ url: `/pages/component/detail?id=${id}` })
}

useLoad((params) => {
  keyword.value = decodeURIComponent(params.keyword || '')
  loadData()
})
</script>

<style lang="less">
.search-result-page {
  padding: 20px;

  .keyword {
    font-size: 14px;
    color: #666;
    margin-bottom: 10px;
  }

  .risk {
    color: #fa2c19;
    font-size: 12px;
  }
}
</style>
