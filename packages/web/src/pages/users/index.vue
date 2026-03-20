<template>
  <view class="users-page">
    <view class="header">
      <nut-button type="primary" @click="goToCreate">创建用户</nut-button>
    </view>

    <nut-cell-group v-if="users.length > 0">
      <nut-cell
        v-for="user in users"
        :key="user.id"
        :title="user.username"
        :sub-title="`${user.email || ''} ${user.phone || ''}`"
      >
        <template #link>
          <view class="user-info">
            <nut-tag :type="user.status === 1 ? 'success' : 'danger'">
              {{ user.status === 1 ? '启用' : '禁用' }}
            </nut-tag>
            <text class="role">{{ user.role }}</text>
          </view>
        </template>
      </nut-cell>
    </nut-cell-group>

    <nut-empty v-else description="暂无用户数据" />
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Taro from '@tarojs/taro'
import { usersApi, type User } from '../../apis/users'

const users = ref<User[]>([])

const loadUsers = async () => {
  try {
    const res = await usersApi.list({ page: 1, pageSize: 20 })
    users.value = res.list
  } catch (error) {
    console.error('加载用户列表失败:', error)
  }
}

const goToCreate = () => {
  Taro.navigateTo({ url: '/pages/users/create' })
}

onMounted(() => {
  loadUsers()
})
</script>

<style lang="less">
.users-page {
  padding: 20px;

  .header {
    margin-bottom: 20px;
  }

  .user-info {
    display: flex;
    align-items: center;
    gap: 10px;

    .role {
      font-size: 12px;
      color: #999;
    }
  }
}
</style>
