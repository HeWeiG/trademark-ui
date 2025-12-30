<template>
  <el-dialog
    :model-value="visible"
    :title="isEdit ? '编辑商标' : '新增商标'"
    width="900px"
    :before-close="handleClose"
    class="trademark-edit-dialog"
  >
    <div class="trademark-form-container">
      <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-width="100px"
        class="compact-form"
      >
        <!-- 商标图样 -->
        <div class="form-row">
          <el-form-item label="商标图样" prop="trademarkImage">
            <div class="trademark-image-uploader">
              <!-- 图片预览 -->
              <div v-if="formData.trademarkImage" class="image-preview">
                <img :src="displayImageUrl" alt="商标图样" class="preview-image" />
                <!-- <div class="image-info">
                  <div class="file-id">File ID: {{ formData.trademarkImage }}</div>
                </div> -->
                <div class="image-actions">
                  <el-button type="primary" size="small" @click="downloadImage" :loading="imageDownloading">
                    <el-icon><Download /></el-icon>
                    下载
                  </el-button>
                  <el-button type="danger" size="small" @click="removeImage">
                    <el-icon><Delete /></el-icon>
                    删除
                  </el-button>
                </div>
              </div>
              
              <!-- 上传控件 -->
              <el-upload
                v-else
                class="image-upload"
                :show-file-list="false"
                :before-upload="beforeImageUpload"
                :http-request="handleImageUpload"
                accept="image/*"
              >
                <el-button type="primary" :loading="imageUploading">
                  <el-icon><Plus /></el-icon>
                  上传商标图样
                </el-button>
                <template #tip>
                  <div class="el-upload__tip">支持 JPG、PNG 格式，大小不超过 2MB</div>
                </template>
              </el-upload>
            </div>
          </el-form-item>
        </div>

        <!-- 商标基本信息 -->
          <el-form-item label="商标名称" prop="name">
            <el-input v-model="formData.name" placeholder="请输入商标名称" />
          </el-form-item>
          
          <el-form-item label="注册号" prop="registrationNo">
            <el-input v-model="formData.registrationNo" placeholder="请输入注册号" />
          </el-form-item>

        <!-- 分类信息 -->
          <el-form-item label="商标类别" prop="classCode">
            <el-select v-model="formData.classCode" placeholder="请选择商标类别" filterable >
              <el-option v-for="item in trademarkClasses" :key="item.code" :label="item.label" :value="item.code" />
            </el-select>
          </el-form-item>
          <el-form-item label="有效群组" prop="validGroups">
            <el-input v-model="formData.validGroups" placeholder="请输入有效群组" />
          </el-form-item>
          <el-form-item label="核准商品服务" prop="approvedGoodsServices">
            <el-input
              v-model="formData.approvedGoodsServices"
              type="textarea"
              :rows="2"
              placeholder="请输入核准商品服务"
            />
          </el-form-item>
        <!-- 权利信息 -->
          <el-form-item label="专用权开始" prop="exclusiveRightStart">
            <el-date-picker
              v-model="formData.exclusiveRightStart"
              type="date"
              placeholder="选择专用权开始日期"
              value-format="YYYY-MM-DD"
              style="width: 100%;"
            />
          </el-form-item>
          
          <el-form-item label="专用权截止" prop="exclusiveRightEnd">
            <el-date-picker
              v-model="formData.exclusiveRightEnd"
              type="date"
              placeholder="选择专用权截止日期"
              value-format="YYYY-MM-DD"
              style="width: 100%;"
            />
          </el-form-item>
        
        <!-- 商业信息 -->
          <el-form-item label="价格" prop="price">
            <el-input-number v-model="formData.price" :min="0" :precision="2" :step="100" />
          </el-form-item>
          
          <el-form-item label="原价" prop="originalPrice">
            <el-input-number v-model="formData.originalPrice" :min="0" :precision="2" :step="100" />
          </el-form-item>
          
          <el-form-item label="申请量" prop="applicationsCount">
            <el-input-number v-model="formData.applicationsCount" :min="0"  />
          </el-form-item>
  
        <!-- 合作方信息 -->
          <el-form-item label="合作方名称" prop="partnerName">
            <el-input v-model="formData.partnerName" placeholder="请输入合作方名称" />
          </el-form-item>
          
          <el-form-item label="合作方联系人" prop="partnerContact">
            <el-input v-model="formData.partnerContact" placeholder="请输入合作方联系人" />
          </el-form-item>
          <el-form-item label="合作方电话" prop="partnerPhone">
            <el-input v-model="formData.partnerPhone" placeholder="请输入合作方电话" />
          </el-form-item>
          
          <el-form-item label="合作方邮箱" prop="partnerEmail">
            <el-input v-model="formData.partnerEmail" placeholder="请输入合作方邮箱" />
          </el-form-item>

        <!-- 内部管理信息 -->
          <el-form-item label="咨询联系人" prop="consultantContact">
            <el-input v-model="formData.consultantContact" placeholder="请输入咨询联系人" />
          </el-form-item>
          
          <el-form-item label="商标状态">
            <div class="trademark-status-checkboxes">
              <el-checkbox v-model="formData.isDiscount">精品商标</el-checkbox>
              <el-checkbox v-model="formData.isFeatured">特价商标</el-checkbox>
              <el-checkbox v-model="formData.isSold">已售出</el-checkbox>
            </div>
          </el-form-item>

        <!-- 其他信息 -->
          <el-form-item label="备注" prop="desc">
            <el-input
              v-model="formData.desc"
              type="textarea"
              :rows="2"
              placeholder="请输入备注信息"
            />
          </el-form-item>
      </el-form>
    </div>
    
    <template #footer>
      <span class="trademark-dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="loading">
          {{ isEdit ? '保存' : '新增' }}
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, watch, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Download, Delete, Plus } from '@element-plus/icons-vue'
import trademarkService from '@/services/trademark'
import classesService from '@/services/classes'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  classData: {
    type: Object,
    default: () => ({})
  },
  trademarkClasses: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update:visible', 'success'])

const formRef = ref()
const loading = ref(false)
const imageUploading = ref(false)
const imageDownloading = ref(false)
const displayImageUrl = ref('') // 用于显示的图片URL

// 表单数据
const formData = ref({
  name: '',
  registrationNo: '',
  classCode: '',
  price: 0,
  originalPrice: 0,
  applicationsCount: 0,
  partnerName: '',
  partnerContact: '',
  partnerPhone: '',
  partnerEmail: '',
  consultantContact: '',
  exclusiveRightStart: '',
  exclusiveRightEnd: '',
  validGroups: '',
  approvedGoodsServices: '',
  desc: '',
  isDiscount: false,
  isFeatured: false,
  isSold: false,
  trademarkImage: '' // 只存储File ID
})

// 计算属性：获取显示用的图片URL
const getDisplayImageUrl = async (fileId) => {
  if (!fileId) return ''
  
  try {
    console.log('原始File ID:', fileId)
    // 如果是File ID格式，转换为可访问的URL
    if (fileId.startsWith('cloud://')) {
      const url = await trademarkService.getImageUrlFromFileId(fileId)
      return url
    }
    
    // 如果已经是URL，直接返回
    return fileId
  } catch (error) {
    console.error('获取显示图片URL失败:', error)
    return fileId
  }
}

// 监听File ID变化，更新显示URL
watch(() => formData.value.trademarkImage, async (newFileId) => {
  if (newFileId) {
    displayImageUrl.value = await getDisplayImageUrl(newFileId)
  } else {
    displayImageUrl.value = ''
  }
})

// 组件挂载时初始化图片显示
onMounted(async () => {
  if (formData.value.trademarkImage) {
    displayImageUrl.value = await getDisplayImageUrl(formData.value.trademarkImage)
  }
})

// 表单验证规则
const formRules = {
  name: [{ required: true, message: '请输入商标名称', trigger: 'blur' }],
  registrationNo: [{ required: true, message: '请输入注册号', trigger: 'blur' }],
  classCode: [{ required: true, message: '请选择商标类别', trigger: 'change' }],
  price: [{ required: true, message: '请输入价格', trigger: 'blur' }]
}

// 判断是否为编辑模式
const isEdit = computed(() => props.classData && props.classData._id)

// 监听visible变化
watch(() => props.visible, async (val) => {
  if (val) {
    if (isEdit.value) {
      // 编辑模式：填充表单数据
      formData.value = { ...props.classData }
      
      // 如果有File ID，获取显示URL
      if (formData.value.trademarkImage) {
        displayImageUrl.value = await getDisplayImageUrl(formData.value.trademarkImage)
      }
    } else {
      // 新增模式：重置表单
      formData.value = {
        name: '',
        registrationNo: '',
        classCode: '',
        price: 0,
        originalPrice: 0,
        applicationsCount: 0,
        partnerName: '',
        partnerContact: '',
        partnerPhone: '',
        partnerEmail: '',
        consultantContact: '',
        exclusiveRightStart: '',
        exclusiveRightEnd: '',
        validGroups: '',
        approvedGoodsServices: '',
        desc: '',
        isDiscount: false,
        isFeatured: false,
        isSold: false,
        trademarkImage: ''
      }
      displayImageUrl.value = ''
    }
  }
})

// 图片上传前的验证
const beforeImageUpload = (file) => {
  const isImage = file.type.startsWith('image/')
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isImage) {
    ElMessage.error('只能上传图片文件!')
    return false
  }
  if (!isLt2M) {
    ElMessage.error('图片大小不能超过 2MB!')
    return false
  }
  return true
}

// 处理图片上传
const handleImageUpload = async (options) => {
  const { file } = options
  imageUploading.value = true
  
  try {
    const result = await trademarkService.uploadTrademarkImage(file)
    
    if (result.success) {
      // 只存储File ID，不存储URL（URL会过期）
      formData.value.trademarkImage = result.fileId
      ElMessage.success('商标图样上传成功')
    } else {
      ElMessage.error(result.message || '上传失败')
    }
  } catch (error) {
    ElMessage.error('上传失败：' + error.message)
  } finally {
    imageUploading.value = false
  }
}

// 下载图片
const downloadImage = async () => {
  if (!formData.value.trademarkImage) return
  
  imageDownloading.value = true
  try {
    const result = await trademarkService.downloadTrademarkImage(formData.value.trademarkImage)
    
    if (result.success) {
      // 创建下载链接
      const link = document.createElement('a')
      link.href = result.downloadUrl
      link.download = `trademark-image-${Date.now()}.png`
      link.click()
      ElMessage.success('开始下载商标图样')
    } else {
      ElMessage.error(result.message || '下载失败')
    }
  } catch (error) {
    ElMessage.error('下载失败：' + error.message)
  } finally {
    imageDownloading.value = false
  }
}

// 删除图片
const removeImage = async () => {
  try {
    await ElMessageBox.confirm('确定要删除商标图样吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    if (formData.value.trademarkImage) {
      const result = await trademarkService.deleteTrademarkImage(formData.value.trademarkImage)
      
      if (result.success) {
        ElMessage.success('商标图样删除成功')
      } else {
        ElMessage.warning(result.message || '删除失败')
      }
    }
    
    // 清除表单中的图片数据
    formData.value.trademarkImage = ''
    displayImageUrl.value = ''
    
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败：' + error.message)
    }
  }
}

// 关闭弹窗
const handleClose = () => {
  emit('update:visible', false)
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    loading.value = true
    
    // 调用云函数保存数据
    const result = await trademarkService.saveTrademark(formData.value)
    
    if (result.success) {
      ElMessage.success(result.message || (isEdit.value ? '保存成功' : '新增成功'))
      emit('success')
      handleClose()
    } else {
      ElMessage.error(result.message || (isEdit.value ? '保存失败' : '新增失败'))
    }
  } catch (error) {
    ElMessage.error('操作失败：' + error.message)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.trademark-image-uploader {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.image-preview {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
}

.preview-image {
  max-width: 200px;
  max-height: 200px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  padding: 4px;
  object-fit: contain;
}

.image-info {
  font-size: 12px;
  color: #909399;
  word-break: break-all;
  max-width: 300px;
}

.file-id {
  background: #f5f7fa;
  padding: 4px 8px;
  border-radius: 4px;
  font-family: monospace;
}

.image-actions {
  display: flex;
  gap: 8px;
}

.image-upload {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.el-upload__tip {
  font-size: 12px;
  color: #909399;
}
</style>