<template>
  <div class="page-container">
    <el-breadcrumb separator="/" class="breadcrumb">
      <el-breadcrumb-item><el-icon><CollectionTag /></el-icon> 商标管理</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 搜索区域 -->
    <div class="search-container">
      <el-input
        v-model.trim="keyword"
        placeholder="输入查询条件"
        prefix-icon="Search"
        clearable
        class="search-input"
        @keyup.enter="handleSearch"
      />
      <el-select
        v-model="classCode"
        filterable
        placeholder="请选择商标类别"
        clearable
        class="search-input"
      >
        <el-option label="全部" value="" />
        <el-option v-for="item in trademarkClasses" :key="item.code" :label="item.label" :value="item.code" />
      </el-select>
      <el-select
          v-model="isDiscount"
          placeholder="是否精品"
          clearable
          class="status-select"
        >
          <el-option label="全部" value="" />
          <el-option label="精品商标" :value="true" />
          <el-option label="普通商标" :value="false" />
        </el-select>

        <el-select
          v-model="isFeatured"
          placeholder="是否特价"
          clearable
          class="status-select"
        >
          <el-option label="全部" value="" />
          <el-option label="特价商标" :value="true" />
          <el-option label="原价商标" :value="false" />
        </el-select>

        <el-select
          v-model="isSold"
          placeholder="是否已售"
          clearable
          class="status-select"
        >
          <el-option label="全部" value="" />
          <el-option label="已售出" :value="true" />
          <el-option label="在售中" :value="false" />
        </el-select>
      <!-- 价格区间查询 -->
      <el-input-number
        v-model="minPrice"
        placeholder="最低价格"
        :min="0"
        :precision="2"
        :step="100"
        class="price-input"
        controls-position="right"
      />
      <span class="price-separator">-</span>
      <el-input-number
        v-model="maxPrice"
        placeholder="最高价格"
        :min="0"
        :precision="2"
        :step="100"
        class="price-input"
        controls-position="right"
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
      <!-- 新增按钮 -->
      <el-button
        type="primary"
        @click="handleAdd"
        icon="Plus"
        class="add-button"
      >
        新增商标
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
      @sort-change="handleSortChange"
    >
      <el-table-column prop="index" label="序号" align="center" >
        <template #default="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column prop="name" label="商标名称" min-width="100"/>
      <el-table-column prop="registrationNo" label="注册号"/>
      <el-table-column prop="classCode" label="商标类别" width="100">
        <template #default="scope">
          {{ getClassCodeName(scope.row.classCode) }}
        </template>
      </el-table-column>
       <el-table-column prop="validGroups" label="有效群组" min-width="100"/>
      <el-table-column prop="approvedGoodsServices" label="核准商品服务"  min-width="120" show-overflow-tooltip />
      <el-table-column prop="exclusiveRightStart" label="专用权开始" width="120" sortable="custom"/>
      <el-table-column prop="exclusiveRightEnd" label="专用权截止" width="120" sortable="custom"/>
      <el-table-column prop="price" label="价格" sortable="custom"/>
      <el-table-column prop="originalPrice" label="原价" sortable="custom"/>
      <el-table-column prop="applicationsCount" label="申请量"/>
      <el-table-column prop="partnerName" label="合作方" >
        <template #default="scope">
           <el-tooltip class="item" effect="dark" :content="`合作方：${scope.row.partnerName},联系人：${scope.row.partnerContact},咨询电话：${scope.row.partnerPhone},邮箱：${scope.row.partnerEmail}`" placement="top-start">
            {{ scope.row.partnerName }}
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="consultantContact" label="咨询联系人" width="120"/>
      
     
      <el-table-column prop="desc" label="备注" show-overflow-tooltip />
      <!-- <el-table-column  prop="tags" label="标签" min-width="200" align="center">
        <template #default="scope">
          <Tags :tags="scope.row.tags" />
        </template>
       </el-table-column> -->
       <el-table-column label="商标类型" width="180" align="center">
         <template #default="scope">
           <div class="status-container">
             <el-switch
                 v-model="scope.row.isDiscount"
                 :loading="scope.row.isDiscountLoading"
                 @change="handleStatusChange(scope.row, 'isDiscount')"
                 size="small"
                 active-text="精品"
                 inactive-text="普通"
               />
             <el-switch
                 v-model="scope.row.isFeatured"
                 :loading="scope.row.isFeaturedLoading"
                 @change="handleStatusChange(scope.row, 'isFeatured')"
                 size="small"
                 active-text="特价"
                 inactive-text="原价"
               />
            <el-switch
                 v-model="scope.row.isSold"
                 :loading="scope.row.isSoldLoading"
                 @change="handleStatusChange(scope.row, 'isSold')"
                 size="small"
                 active-text="已售"
                 inactive-text="在售"
               />
           </div>
         </template>
       </el-table-column>
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
    <TrademarkEditForm
      v-model:visible="editDialogVisible"
      :class-data="selectedClass"
      :trademark-classes="trademarkClasses"
      @success="handleEditSuccess"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import classesService from '@/services/classes'
import trademarkService from '@/services/trademark'
import TrademarkEditForm from './TrademarkEditForm.vue'
import Tags from '@/components/view/Tags.vue'

// 加载状态
const loading = ref(false)

// 搜索条件
const keyword = ref('')
const classCode = ref('')
const minPrice = ref(null) // 新增：最低价格
const maxPrice = ref(null) // 新增：最高价格
// 状态条件查询
const isDiscount = ref('') // 精品商标
const isFeatured = ref('') // 特价商标
const isSold = ref('') // 已售商标



// 分页参数
const currentPage = ref(1)
const pageSize = ref(10)
const totalCount = ref(0)

// 排序参数
const orderField = ref('order')
const orderType = ref('')

// 分类数据
const classesData = ref([])
// 商标类别数据
const trademarkClasses = ref([])

// 编辑弹窗
const editDialogVisible = ref(false)
const selectedClass = ref({})

// 加载商标类别数据
const loadTrademarkClasses = async () => {
  try {
    
    // 调用云函数获取数据
    const result = await classesService.queryClassesOptions()
    
    if (result.success) {
      trademarkClasses.value = result.data || []
    } else {
      ElMessage.error(result.message || '获取分类数据失败')
    }
  } catch (error) {
    ElMessage.error('加载失败：' + error.message)
  }
}

// 加载分类数据
const loadTrademarkData = async () => {
  try {
    loading.value = true
    
    // 构造请求参数
    const params = {
      page: currentPage.value,
      pageSize: pageSize.value,
      keyword: keyword.value,
      classCode: classCode.value,
      orderField: orderField.value,
      orderType: orderType.value,
    }
    // 添加状态查询参数
    if (isDiscount.value !== '') {
      params.isDiscount = isDiscount.value
    }
    if (isFeatured.value !== '') {
      params.isFeatured = isFeatured.value
    }
    if (isSold.value !== '') {
      params.isSold = isSold.value
    }
    // 添加价格区间参数
    if (minPrice.value !== null && minPrice.value !== '') {
      params.minPrice = Number(minPrice.value)
    }
    if (maxPrice.value !== null && maxPrice.value !== '') {
      params.maxPrice = Number(maxPrice.value)
    }
    
    // 调用云函数获取数据
    const result = await trademarkService.queryTrademarks(params)
    
    if (result.success) {
      // 为每个商标数据添加加载状态
      classesData.value = (result.data.list || []).map(item => ({
        ...item,
        isDiscountLoading: false,
        isFeaturedLoading: false,
        isSoldLoading: false
      }))
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

// 处理状态切换
const handleStatusChange = async (row, field) => {
  try {
    // 设置对应字段的加载状态
    row[`${field}Loading`] = true
    
    // 修改调用方式，直接传递三个参数
    const result = await trademarkService.updateTrademarkStatus(
      row._id,  // trademarkId
      field,    // field
      row[field] // value
    )
    
    if (result.success) {
      ElMessage.success(result.message || '状态更新成功')
    } else {
      // 如果更新失败，恢复原来的状态
      row[field] = !row[field]
      ElMessage.error(result.message || '状态更新失败')
    }
  } catch (error) {
    // 如果出错，恢复原来的状态
    row[field] = !row[field]
    ElMessage.error('状态更新失败：' + error.message)
  } finally {
    row[`${field}Loading`] = false
  }
}

// 搜索
const handleSearch = () => {
  currentPage.value = 1 // 重置到第一页
  loadTrademarkData()
}

// 重置
const handleReset = () => {
  keyword.value = ''
  classCode.value = ''
  minPrice.value = null  // 新增：重置最低价格
  maxPrice.value = null  // 新增：重置最高价格
  isDiscount.value = '' // 重置精品商标
  isFeatured.value = '' // 重置特价商标
  isSold.value = '' // 重置已售商标
  orderField.value = 'order'
  orderType.value = ''
  currentPage.value = 1
  pageSize.value = 10
  loadTrademarkData()
}

// 分页大小变化
const handleSizeChange = (newSize) => {
  pageSize.value = newSize
  currentPage.value = 1 // 重置到第一页
  loadTrademarkData()
}

// 当前页变化
const handleCurrentChange = (newPage) => {
  currentPage.value = newPage
  loadTrademarkData()
}

// 新增商标
const handleAdd = () => {
  selectedClass.value = {}
  editDialogVisible.value = true
}

// 编辑
const handleEdit = (row) => {
  console.log('编辑商标:', { ...row })
  selectedClass.value = { ...row }
  editDialogVisible.value = true
}

// 编辑成功
const handleEditSuccess = () => {
  loadTrademarkData() // 重新加载数据
}

// 根据商标类别获取名称
const getClassCodeName = (classCode) => {
  const classItem = trademarkClasses.value.find(item => item.code === classCode)
  return classItem ? classItem.label : ''
}

// 排序变化处理
const handleSortChange = (sort) => {
  // sort参数包含字段名(prop)和排序类型(order: 'ascending'或'descending')
  orderField.value = sort.prop
  orderType.value = sort.order === 'ascending' ? 'asc' : 'desc'
  // 重新加载数据
  loadTrademarkData()
}

// 组件挂载时加载数据
onMounted(() => {
  loadTrademarkData()
  loadTrademarkClasses()
})
</script>

<style scoped>
.search-input {
  width: 200px;
}

.price-input {
  width: 120px;
}
.status-select {
  width: 120px;
  margin-right: 10px;
}

.price-separator {
  color: #666;
  margin: 0 5px;
}

.search-button{
  margin-left: 10px;
}

.add-button {
  margin-left: 10px;
}
</style>