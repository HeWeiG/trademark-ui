// src/services/auth.js
import { auth } from '@/utils/cloudbase'

class AuthService {
  // 1. 使用用户名密码注册
  async register(email, password, nickname = '') {
    
  }

  // 2. 使用用户名密码登录
  async login(username, password) {
    try {
      const result = await auth.signIn({
        username,
        password,
      })
      
      if (result) {
        // 获取当前用户信息
        const user = auth.currentUser
        return {
          success: true,
          message: '登录成功',
          user: {
            uid: user.uid,
            name: user.name,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            emailVerified: user.emailVerified
          }
        }
      }
    } catch (error) {      
      return {
        success: false,
        message: error.error_description || '登录失败'
      }
    }
  }

  // 3. 退出登录
  async logout() {
    try {
      await auth.signOut()
      return { success: true, message: '退出成功' }
    } catch (error) {
      return { success: false, message: '退出失败' }
    }
  }

  // 4. 获取当前用户
  getCurrentUser() {
    const user = auth.currentUser
    if (user) {
      return {
        uid: user.uid,
        name: user.name,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.picture,
        emailVerified: user.emailVerified
      }
    }
    return null
  }

  // 5. 检查登录状态
  async checkLogin() {
    try {
      const loginState = await auth.getLoginState()
      return {
        isLoggedIn: !!loginState,
        user: loginState
      }
    } catch (error) {
      return { isLoggedIn: false }
    }
  }
}

export default new AuthService()