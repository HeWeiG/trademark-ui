<template>
  <div class="header-content">
    <el-menu
      :default-active="activeMenu"
      class="el-menu-demo"
      mode="horizontal"
      @select="handleMenuSelect"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b"
      ellipsis
    >
      <el-menu-item
        v-for="route in routes"
        :key="route.path"
        :index="route.path"
      >
      <el-icon v-if="route.meta.icon"><component :is="route.meta.icon" /></el-icon>
        <span>{{ route.meta.title }}</span>
      </el-menu-item>
    </el-menu>
    
    <!-- 用户信息和退出登录 -->
    <div class="user-info">
      <el-dropdown @command="handleCommand">
        <span class="user-dropdown">
          <el-avatar :size="32" :src="currentUser?.photoURL || defaultAvatar" class="user-avatar"></el-avatar>
          <span class="user-name">{{ currentUser?.name || '用户' }}</span>
          <el-icon class="el-icon--right"><arrow-down /></el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="profile">个人中心</el-dropdown-item>
            <el-dropdown-item command="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { ArrowDown } from '@element-plus/icons-vue'
import router from '@/router'
import authService from '@/services/auth'

const route = useRoute()
const routerInstance = useRouter()
const currentUser = ref(null)
const defaultAvatar = 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'

onMounted(async () => {
  // 获取当前登录用户信息
  await fetchCurrentUser()
})

// 获取当前用户信息
const fetchCurrentUser = async () => {
  try {
    const user = await authService.getCurrentUser()
    currentUser.value = user
  } catch (error) {
    console.error('获取用户信息失败:', error)
  }
}

// 获取所有路由
const routes = computed(() => {
  return router.getRoutes().filter(route => route.meta && route.meta.title && !route.meta.hidden)
})

// 当前激活的菜单
const activeMenu = computed(() => {
  return route.path
})

// 处理菜单选择
const handleMenuSelect = (key) => {
  routerInstance.push(key)
}

// 处理下拉菜单命令
const handleCommand = async (command) => {
  if (command === 'logout') {
    await handleLogout()
  } else if (command === 'profile') {
    // 跳转到个人中心页面，这里可以根据实际路由修改
    ElMessage.info('跳转到个人中心')
  }
}

// 退出登录
const handleLogout = async () => {
  try {
    const result = await authService.logout()
    if (result.success) {
      ElMessage.success(result.message)
      // 跳转到登录页面
      routerInstance.push('/login')
    } else {
      ElMessage.error(result.message)
    }
  } catch (error) {
    console.error('退出登录失败:', error)
    ElMessage.error('退出登录失败')
  }
}
</script>

<style scoped>

</style>
