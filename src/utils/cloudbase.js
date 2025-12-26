import cloudbase from '@cloudbase/js-sdk'

// 初始化云开发
const app = cloudbase.init({
  env: 'cloud1-5gg8o6fs5ac02a6f', // 替换为您的环境ID
  region: 'ap-shanghai'
})

// 获取认证模块
export const auth = app.auth()
export default app