<template>
  <view class="create-user-page">
    <nut-form ref="formRef" :model-value="formData">
      <nut-form-item label="用户名" prop="username" required>
        <nut-input v-model="formData.username" placeholder="请输入用户名" />
      </nut-form-item>

      <nut-form-item label="密码" prop="password" required>
        <nut-input
          v-model="formData.password"
          type="password"
          placeholder="请输入密码"
        />
      </nut-form-item>

      <nut-form-item label="邮箱" prop="email">
        <nut-input v-model="formData.email" placeholder="请输入邮箱" />
      </nut-form-item>

      <nut-form-item label="手机号" prop="phone">
        <nut-input v-model="formData.phone" placeholder="请输入手机号" />
      </nut-form-item>
    </nut-form>

    <view class="form-actions">
      <nut-button type="primary" block @click="handleSubmit" :loading="loading">
        创建用户
      </nut-button>
    </view>

    <nut-toast v-model:visible="toastVisible" :msg="toastMsg" :type="toastType" />
  </view>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import Taro from '@tarojs/taro'
import { usersApi, type CreateUserDto } from '../../apis/users'

const formData = reactive<CreateUserDto>({
  username: '',
  password: '',
  email: '',
  phone: '',
})

const loading = ref(false)
const toastVisible = ref(false)
const toastMsg = ref('')
const toastType = ref<'success' | 'fail'>('success')

const showToast = (msg: string, type: 'success' | 'fail' = 'success') => {
  toastMsg.value = msg
  toastType.value = type
  toastVisible.value = true
}

const handleSubmit = async () => {
  if (!formData.username || !formData.password) {
    showToast('请填写用户名和密码', 'fail')
    return
  }

  loading.value = true
  try {
    await usersApi.create(formData)
    showToast('创建成功')
    setTimeout(() => {
      Taro.navigateBack()
    }, 1500)
  } catch (error: any) {
    showToast(error.message || '创建失败', 'fail')
  } finally {
    loading.value = false
  }
}
</script>

<style lang="less">
.create-user-page {
  padding: 20px;

  .form-actions {
    margin-top: 40px;
  }
}
</style>
