// src/router/guards/auth.js
import { auth } from '@/utils/cloudbase'

/**
 * 检查登录状态
 * @returns {Promise<{isLoggedIn: boolean, user: any}>}
 */
async function checkLoginStatus() {
  try {
    // 获取云开发登录状态
    const loginState = await auth.getLoginState()
    return {
      isLoggedIn: !!loginState,
      user: loginState
    }
  } catch (error) {
    console.error('检查登录状态失败:', error)
    return {
      isLoggedIn: false,
      user: null
    }
  }
}

/**
 * 创建认证路由守卫
 * @param {Array} whiteList 白名单路由（不需要登录即可访问）
 * @returns 路由守卫函数
 */
export function createAuthGuard(whiteList = ['/login']) {
  return async (to, from, next) => {
    // 检查目标路由是否需要认证
    const requiresAuth = to.meta?.requiresAuth !== false
    
    // 检查是否为白名单路由
    const isWhiteList = whiteList.includes(to.path)
    
    // 如果不需要认证或在白名单中，直接放行
    if (!requiresAuth || isWhiteList) {
      return next()
    }
    
    // 检查登录状态
    const { isLoggedIn } = await checkLoginStatus()
    
    if (!isLoggedIn) {
      // 未登录，跳转到登录页
      // 记录要访问的页面，登录后可以跳转回来
      next({
        path: '/login',
        query: {
          redirect: to.fullPath,
          from: from.fullPath
        }
      })
    } else {
      // 已登录，放行
      next()
    }
  }
}