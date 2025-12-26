<template>
  <div class="login-container">
    <!-- 左侧插图区域 -->
    <div class="login-illustration">
      <img src="@/assets/images/loginbg.png" alt="登录背景" class="illustration-image">
      <div class="illustration-content">
        <h1 class="illustration-title">商标交易平台</h1>
        <p class="illustration-desc">专业、安全、高效的商标交易服务</p>
      </div>
    </div>
    
    <!-- 右侧登录表单区域 -->
    <div class="login-form-wrapper">
      <div class="login-panel">
        <div class="login-header">
          <div class="login-logo">
            <el-icon class="logo-icon"><Stamp /></el-icon>
          </div>
          <h2 class="login-title">商标交易管理后台</h2>
        </div>
        
        <!-- 用户名密码登录 -->
        <el-form 
          :model="passwordLoginForm" 
          :rules="passwordLoginRules" 
          ref="passwordLoginFormRef"
          class="login-form"
        >
          <el-form-item prop="username">
            <el-input 
              v-model="passwordLoginForm.username" 
              placeholder="请输入用户名"
              prefix-icon="User"
              size="large"
            />
          </el-form-item>
          <el-form-item prop="password">
            <el-input 
              v-model="passwordLoginForm.password" 
              type="password" 
              placeholder="请输入密码"
              prefix-icon="Lock"
              size="large"
              show-password
              @keyup.enter="handlePasswordLogin" 
            />
          </el-form-item>
          <div class="login-button-item">
            <el-button 
                type="primary" 
                :loading="passwordLoading" 
                @click="handlePasswordLogin"
                size="large"
              >
                {{ passwordLoading ? '登录中...' : '登录' }}
              </el-button>
          </div>          
        </el-form>     
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Stamp } from '@element-plus/icons-vue'
import '../../assets/login.less'
import authService from '@/services/auth'

const router = useRouter()
// 记住密码
const rememberMe = ref(false)

// 用户名密码登录
const passwordLoginFormRef = ref(null)
const passwordLoading = ref(false)
const passwordLoginForm = reactive({
  username: '',
  password: ''
})

const passwordLoginRules = reactive({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度在 3 到 20 个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度在 6 到 20 个字符', trigger: 'blur' }
  ]
})
// 计算属性
const canLogin = computed(() => {
  return passwordLoginForm.username && passwordLoginForm.password && passwordLoginForm.password.length >= 6
})

const canRegister = computed(() => {
  return (
    registerForm.email &&
    registerForm.password &&
    registerForm.password.length >= 6 &&
    registerForm.password === registerForm.confirmPassword
  )
})
// 生命周期
onMounted(async () => {
  // 检查是否已登录
  const { isLoggedIn, user } = await authService.checkLogin()
  if (isLoggedIn) {
    currentUser.value = user
    // 如果已登录，跳转到首页
    setTimeout(() => {
      router.push('/')
    }, 1500)
  }
})
const handlePasswordLogin = async () => {
   if (!canLogin.value) {
     ElMessage.error('请填写完整的登录信息')
    return
  }

  passwordLoading.value = true

  try {
    const result = await authService.login(passwordLoginForm.username, passwordLoginForm.password)
    if (result.success) {
      ElMessage.success('登录成功！')      
      // 清空表单
      passwordLoginForm.username = ''
      passwordLoginForm.password = ''
      
      // 跳转到首页
      setTimeout(() => {
        router.push('/')
      }, 1000)
    } else {
      ElMessage.error('登录失败:', result.message)
    }
  } catch (error) {
    console.error('登录失败:', error)
    ElMessage.error('登录失败')
  } finally {
    passwordLoading.value = false
  }
}
</script>

<style scoped>

</style>