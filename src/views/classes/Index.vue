<template>
  <div class="page-container">
    <el-breadcrumb separator="/" class="breadcrumb">
      <el-breadcrumb-item>分类管理</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 搜索区域 -->
    <div class="search-container">
      <el-input
        v-model="keyword"
        placeholder="请输入分类名称或代码"
        prefix-icon="Search"
        clearable
        class="search-input"
        @keyup.enter="handleSearch"
      />
      <el-button
        type="primary"
        @click="handleSearch"
        icon="Search"
        class="search-button"
      >
        搜索
      </el-button>
      <el-button
        type="success"
        @click="handleReset"
        icon="RefreshRight"
        class="reset-button"
      >
        重置
      </el-button>
    </div>

    <!-- 分类列表 -->
    <el-table
      v-loading="loading"
      :data="classesData"
      style="width: 100%"
      border
      stripe
      class="classes-table"
    >
      <el-table-column prop="code" label="分类代码" width="100" align="center" />
      <el-table-column prop="name" label="分类名称" min-width="100" />
      <el-table-column prop="desc" label="分类描述" min-width="200" show-overflow-tooltip />
      <el-table-column prop="iconClass" label="图标类名" width="240" />
      <el-table-column label="操作" width="180" align="center">
        <template #default="scope">
          <el-button size="small" type="primary" @click="handleEdit(scope.row)">
            编辑
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[10, 20, 50, 100]"
        :total="totalCount"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    
    <!-- 编辑弹窗 -->
    <ClassEditForm
      v-model:visible="editDialogVisible"
      :class-data="selectedClass"
      @success="handleEditSuccess"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import classesService from '@/services/classes'
import ClassEditForm from './ClassEditForm.vue'

// 加载状态
const loading = ref(false)

// 搜索条件
const keyword = ref('')

// 分页参数
const currentPage = ref(1)
const pageSize = ref(10)
const totalCount = ref(0)

// 分类数据
const classesData = ref([])

// 编辑弹窗
const editDialogVisible = ref(false)
const selectedClass = ref({})

// 加载分类数据
const loadClassesData = async () => {
  try {
    loading.value = true
    
    // 构造请求参数
    const params = {
      page: currentPage.value,
      pageSize: pageSize.value,
      keyword: keyword.value
    }
    
    // 调用云函数获取数据
    const result = await classesService.queryClasses(params)
    
    if (result.success) {
      classesData.value = result.data.list || []
      totalCount.value = result.data.pagination.total || 0
    } else {
      ElMessage.error(result.message || '获取分类数据失败')
    }
  } catch (error) {
    ElMessage.error('加载失败：' + error.message)
  } finally {
    loading.value = false
  }
}

// 搜索
const handleSearch = () => {
  currentPage.value = 1 // 重置到第一页
  loadClassesData()
}

// 重置
const handleReset = () => {
  keyword.value = ''
  currentPage.value = 1
  pageSize.value = 10
  loadClassesData()
}

// 分页大小变化
const handleSizeChange = (newSize) => {
  pageSize.value = newSize
  currentPage.value = 1 // 重置到第一页
  loadClassesData()
}

// 当前页变化
const handleCurrentChange = (newPage) => {
  currentPage.value = newPage
  loadClassesData()
}

// 编辑
const handleEdit = (row) => {
  selectedClass.value = { ...row }
  editDialogVisible.value = true
}

// 编辑成功
const handleEditSuccess = () => {
  loadClassesData() // 重新加载数据
}

// 组件挂载时加载数据
onMounted(() => {
  loadClassesData()
})
</script>

<style scoped>
.search-input {
  width: 200px;
}
</style>