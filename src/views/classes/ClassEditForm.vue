<template>
  <el-dialog
    v-model="dialogVisible"
    :title="title"
    width="700px"
    @close="handleClose"
  >
    <el-form
      ref="editFormRef"
      :model="formData"
      :rules="rules"
      label-width="80px"
    >
      <el-form-item label="分类代码" prop="code">
        <el-input v-model="formData.code" placeholder="请输入分类代码" readonly/>
      </el-form-item>
      
      <el-form-item label="分类名称" prop="name">
        <el-input v-model="formData.name" placeholder="请输入分类名称" readonly/>
      </el-form-item>
      
      <el-form-item label="分类描述" prop="desc">
        <el-input
          v-model="formData.desc"
          type="textarea"
          :rows="6"
          placeholder="请输入分类描述"
        />
      </el-form-item>
      
      <el-form-item label="图标类名" prop="iconClass">
        <el-input v-model="formData.iconClass" placeholder="请输入图标类名" />
      </el-form-item>
    </el-form>
    
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" @click="handleSubmit">保存</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'
import classesService from '@/services/classes'

// Props
const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  classData: {
    type: Object,
    default: () => ({})
  }
})

// Emits
const emit = defineEmits(['update:visible', 'success', 'cancel'])

// 表单引用
const editFormRef = ref(null)

// 弹窗可见性
const dialogVisible = computed({
  get() {
    return props.visible
  },
  set(val) {
    emit('update:visible', val)
  }
})

// 表单数据
const formData = ref({
  code: '',
  name: '',
  desc: '',
  iconClass: ''
})

// 表单规则
const rules = ref({
  code: [
    { required: true, message: '请输入分类代码', trigger: 'blur' },
    { min: 1, max: 10, message: '分类代码长度在 1 到 10 个字符', trigger: 'blur' }
  ],
  name: [
    { required: true, message: '请输入分类名称', trigger: 'blur' },
    { min: 1, max: 50, message: '分类名称长度在 1 到 50 个字符', trigger: 'blur' }
  ],
  desc: [
    { max: 200, message: '分类描述最多 200 个字符', trigger: 'blur' }
  ],
  iconClass: [
    { max: 50, message: '图标类名最多 50 个字符', trigger: 'blur' }
  ]
})

// 弹窗标题
const title = computed(() => {
  return formData.value.id ? '编辑分类' : '新增分类'
})

// 监听分类数据变化，更新表单
watch(
  () => props.classData,
  (newVal) => {
    if (newVal) {
      formData.value = { ...newVal }
    }
  },
  { deep: true, immediate: true }
)

// 提交表单
const handleSubmit = async () => {
  if (!editFormRef.value) return
  
  await editFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        // 调用保存API
        const result = await classesService.saveClass(formData.value)
        
        if (result.success) {
          ElMessage.success('保存成功')
          emit('success', formData.value)
          dialogVisible.value = false
        } else {
          ElMessage.error(result.message || '保存失败')
        }
      } catch (error) {
        ElMessage.error('保存失败：' + error.message)
      }
    }
  })
}

// 取消
const handleCancel = () => {
  dialogVisible.value = false
  emit('cancel')
}

// 关闭弹窗
const handleClose = () => {
  resetForm()
  emit('cancel')
}

// 重置表单
const resetForm = () => {
  if (editFormRef.value) {
    editFormRef.value.resetFields()
  }
  formData.value = {
    code: '',
    name: '',
    desc: '',
    iconClass: ''
  }
}
</script>

<style scoped>
.dialog-footer {
  text-align: right;
}
</style>
