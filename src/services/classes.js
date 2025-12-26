// src/services/classes.js
import cloudbase from '@/utils/cloudbase'

class ClassesService {
  // 查询分类列表（支持分页和模糊查询）
  async queryClasses(params) {
    try {
      const result = await cloudbase.callFunction({
        name: 'query-classes',
        data: params
      })
      if (result.result && result.result.code === 200) {
        return {
          success: true,
          data: result.result.data
        }
      } else {
        return {
          success: false,
          message: result.result.message || '查询失败'
        }
      }
    } catch (error) {
      return {
        success: false,
        message: error.message || '网络请求失败'
      }
    }
  }
  // 添加分类
  async saveClass(params) {
    try {
      const result = await cloudbase.callFunction({
        name: 'save-class',
        data: params
      })
      if (result.result && result.result.code === 200) {
        return {
          success: true,
          message: '分类添加成功'
        }
      } else {
        return {
          success: false,
          message: result.result.message || '添加失败'
        }
      }
    } catch (error) {
      return {
        success: false,
        message: error.message || '网络请求失败'
      }
    }
  }
}

export default new ClassesService()
