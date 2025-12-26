<template>
  <div class="common-layout">
    <!-- 加载状态 -->
    <div v-if="loading" class="loading-container">
      <el-skeleton :rows="6" animated />
    </div>
    
    <!-- 登录页 -->
    <router-view v-else-if="$route.path === '/login'" />
    
    <!-- 主布局 -->
    <el-container v-else-if="isLoggedIn">
      <el-header class="header">
        <div class="header-title">商标交易管理后台</div>
        <header-menu />
      </el-header>
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import HeaderMenu from './components/layout/HeaderMenu.vue'
import authService from './services/auth'

const router = useRouter()
const loading = ref(true)
const isLoggedIn = ref(false)
// 检查登录状态
async function checkLoginStatus() {
  try {
    const { isLoggedIn } = await authService.checkLogin()
    return isLoggedIn
  } catch (error) {
    console.error('检查登录状态失败:', error)
    return false
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  // 应用初始化时检查登录状态
  isLoggedIn.value = await checkLoginStatus()
  
  // 如果当前在登录页且已登录，跳转到首页
  if (router.currentRoute.value.path === '/login' && isLoggedIn.value) {
    router.push('/')
  }
  // 如果当前在需要认证的页面且未登录，跳转到登录页
  else if (router.currentRoute.value.path !== '/login' && !isLoggedIn) {
    router.push('/login')
  }
})

// 监听路由变化，避免切换路由时的闪烁
watch(
  () => router.currentRoute.value.path,
  async (newPath) => {
    loading.value = true
    isLoggedIn.value = await checkLoginStatus()
    
    if (newPath !== '/login' && !isLoggedIn.value) {
      router.push('/login')
    }
  }
)
</script>

<style scoped>

</style>