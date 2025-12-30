import cloudbase from '@/utils/cloudbase'

class trademarkService { 
  // 查询列表（支持分页和模糊查询）
  async queryTrademarks(params) {
    try {
      const result = await cloudbase.callFunction({
        name: 'query-trademarks',
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

  // 更新商标状态 - 修改为微信云开发格式
  async updateTrademarkStatus(trademarkId, field, value) {
    try {
      const result = await cloudbase.callFunction({
        name: 'update-trademark-status',
        data: {
          trademarkId,
          field,
          value
        }
      })
      if (result.result && result.result.code === 200) {
        return {
          success: true,
          message: result.result.message || '状态更新成功',
          data: result.result.data
        }
      } else {
        return {
          success: false,
          message: result.result.message || '状态更新失败'
        }
      }
    } catch (error) {
      return {
        success: false,
        message: error.message || '网络请求失败'
      }
    }
  }

  // 新增：保存商标（新增/编辑）
  async saveTrademark(trademarkData) {
    try {
      const result = await cloudbase.callFunction({
        name: 'save-trademark',
        data: trademarkData
      })
      if (result.result && result.result.code === 200) {
        return {
          success: true,
          message: result.result.message || '保存成功',
          data: result.result.data
        }
      } else {
        return {
          success: false,
          message: result.result.message || '保存失败'
        }
      }
    } catch (error) {
      return {
        success: false,
        message: error.message || '网络请求失败'
      }
    }
  }

  // 修改：通过云函数上传商标图样
  async uploadTrademarkImage(file) {
    try {
      // 将文件转换为base64
      const base64Data = await this.fileToBase64(file)
      
      const result = await cloudbase.callFunction({
        name: 'upload-trademark-image',
        data: {
          fileName: file.name,
          fileType: file.type,
          base64Data: base64Data
        }
      })
      
      if (result.result && result.result.code === 200) {
        return {
          success: true,
          fileId: result.result.data.fileId,
          fileUrl: result.result.data.fileUrl,
          message: '上传成功'
        }
      } else {
        return {
          success: false,
          message: result.result.message || '上传失败'
        }
      }
    } catch (error) {
      return {
        success: false,
        message: error.message || '上传失败'
      }
    }
  }

  // 新增：将File ID转换为可访问的URL
  async getImageUrlFromFileId(fileId) {
    try {
      if (!fileId) return ''
      
      // 如果是完整的File ID格式，直接使用云开发API获取临时URL
      if (fileId.startsWith('cloud://')) {
        const result = await cloudbase.getTempFileURL({
          fileList: [fileId]
        })
        
        if (result.fileList && result.fileList[0]) {
          return result.fileList[0].tempFileURL
        }
      }
      
      return fileId // 如果已经是URL，直接返回
    } catch (error) {
      console.error('获取图片URL失败:', error)
      return fileId // 出错时返回原值
    }
  }

  // 新增：批量获取图片URL（用于列表显示）
  async getImageUrlsFromFileIds(fileIds) {
    try {
      if (!fileIds || fileIds.length === 0) return []
      
      // 过滤出File ID格式的
      const cloudFileIds = fileIds.filter(id => id.startsWith('cloud://'))
      
      if (cloudFileIds.length === 0) return fileIds
      
      const result = await cloudbase.getTempFileURL({
        fileList: cloudFileIds
      })
      
      const urlMap = {}
      if (result.fileList) {
        result.fileList.forEach(item => {
          urlMap[item.fileID] = item.tempFileURL
        })
      }
      
      // 返回转换后的URL数组
      return fileIds.map(id => {
        if (id.startsWith('cloud://')) {
          return urlMap[id] || id
        }
        return id
      })
    } catch (error) {
      console.error('批量获取图片URL失败:', error)
      return fileIds
    }
  }

  // 辅助方法：文件转base64
  fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => {
        // 移除data:image/png;base64,前缀
        const base64 = reader.result.split(',')[1]
        resolve(base64)
      }
      reader.onerror = error => reject(error)
    })
  }

  // 修改：通过云函数获取下载链接
  async downloadTrademarkImage(fileId) {
    try {
      // 先获取可访问的URL
      const downloadUrl = await this.getImageUrlFromFileId(fileId)
      
      if (downloadUrl) {
        return {
          success: true,
          downloadUrl: downloadUrl
        }
      } else {
        return {
          success: false,
          message: '获取下载链接失败'
        }
      }
    } catch (error) {
      return {
        success: false,
        message: error.message || '下载失败'
      }
    }
  }

  // 修改：通过云函数删除图片
  async deleteTrademarkImage(fileId) {
    try {
      const result = await cloudbase.callFunction({
        name: 'delete-trademark-image',
        data: { fileId }
      })
      
      console.log('删除图片云函数返回:', result)
      
      if (result.result && result.result.code === 200) {
        return {
          success: true,
          message: result.result.message || '删除成功',
          data: result.result.data
        }
      } else {
        return {
          success: false,
          message: result.result?.message || '删除失败',
          data: result.result?.data
        }
      }
    } catch (error) {
      console.error('删除图片失败:', error)
      return {
        success: false,
        message: error.message || '删除失败'
      }
    }
  }
}

export default new trademarkService()