<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { DashBoardSearchAll } from '@/api/api'

const total = ref(0)
const originalData = ref([]) // 保存原始數據
const filteredData = ref([]) // 存儲篩選後的數據

// 搜尋表單數據
const searchForm = ref({
  date: '',
  category: '',
  title: '',
})

// 分頁設置
const currentPage = ref(1)
const pageSize = ref(10)
const pageSizes = [10, 20, 30, 50]

// 排序设置
const sortConfig = ref({
  prop: 'date', // 默認按日期排序
  order: 'descending', // 默認降序排列（最新到最舊）
})

// 表格數據 - 經過排序和分頁後的數據
const dashBoardData = computed(() => {
  // 先对数据进行排序
  const sortedData = [...filteredData.value].sort((a, b) => {
    const propA = a[sortConfig.value.prop]
    const propB = b[sortConfig.value.prop]

    // 日期排序
    if (sortConfig.value.prop === 'date') {
      const dateA = new Date(propA)
      const dateB = new Date(propB)

      return sortConfig.value.order === 'ascending'
        ? dateA - dateB
        : dateB - dateA
    }

    // 其他字段的排序
    if (sortConfig.value.order === 'ascending') {
      return propA < propB ? -1 : propA > propB ? 1 : 0
    } else {
      return propA > propB ? -1 : propA < propB ? 1 : 0
    }
  })

  // 再进行分页
  const startIndex = (currentPage.value - 1) * pageSize.value
  const endIndex = startIndex + pageSize.value
  return sortedData.slice(startIndex, endIndex)
})

// 類別選項 - 動態從後端數據中獲取
const categoryOptions = computed(() => {
  // 獲取所有不重複的類別
  const categories = [...new Set(originalData.value.map((item) => item.sort))]
  // 轉換為選項格式
  return [
    { label: '全部', value: '' },
    ...categories.map((category) => ({ label: category, value: category })),
  ]
})

// 從API獲取所有公告
const searchAll = async () => {
    try {
        const result = await DashBoardSearchAll()
        if (result && result.statusCode === 200) {
            originalData.value = result.dashBoardList || []
            filteredData.value = [...originalData.value]
            total.value = filteredData.value.length
            console.log('Search:', originalData.value)
        } else {
            ElMessage.error('獲取公告失敗')
        }
    } catch (error) {
        if (error.message !== '未授權') {
            console.error('獲取公告錯誤:', error)
            ElMessage.error('獲取公告時發生錯誤')
        }
    }
}

// 重置搜尋
const resetSearch = () => {
  searchForm.value = {
    date: '',
    category: '',
    title: '',
  }
  // 重置後自動執行一次篩選
  handleSearch()
}

// 執行搜尋
const handleSearch = () => {
  // 篩選數據
  filteredData.value = originalData.value.filter((item) => {
    // 日期篩選
    let matchDate = true
    if (searchForm.value.date && searchForm.value.date.length === 2) {
      const startDate = new Date(searchForm.value.date[0])
      const endDate = new Date(searchForm.value.date[1])
      const itemDate = new Date(item.date)

      // 設置時間為00:00:00確保包含當天
      startDate.setHours(0, 0, 0, 0)

      // 設置時間為23:59:59確保包含當天
      endDate.setHours(23, 59, 59, 999)

      matchDate = itemDate >= startDate && itemDate <= endDate
    }

    // 類別篩選
    const matchCategory =
      !searchForm.value.category || item.sort === searchForm.value.category

    // 標題模糊搜尋
    const matchTitle =
      !searchForm.value.title ||
      item.header.toLowerCase().includes(searchForm.value.title.toLowerCase())

    // 所有條件都符合才返回true
    return matchDate && matchCategory && matchTitle
  })

  // 重置到第一頁
  currentPage.value = 1

  // 更新總數
  total.value = filteredData.value.length

  console.log('搜尋結果:', filteredData.value)
}

// 處理列排序
const handleSortChange = (column) => {
  console.log('Sort changed:', column)
  if (column) {
    sortConfig.value = {
      prop: column.prop,
      order: column.order || 'descending', // 如果沒有order，默認為降序
    }
  }
}

// 分頁大小變化
const handleSizeChange = (size) => {
  pageSize.value = size
  currentPage.value = 1 // 切換每頁顯示數量時重置為第一頁
}

// 當前頁變化
const handleCurrentChange = (page) => {
  currentPage.value = page
}

// 控制詳情對話框
const dialogVisible = ref(false)
const currentDetail = ref(null)

// 查看詳情
const handleViewDetail = (row) => {
  currentDetail.value = row
  dialogVisible.value = true
}

// 監聽搜尋表單變化，當清空全部內容時自動執行搜尋
watch(
  () => [
    searchForm.value.date,
    searchForm.value.category,
    searchForm.value.title,
  ],
  (newVal, oldVal) => {
    // 檢查是否所有值都為空
    const allEmpty = !newVal[0] && !newVal[1] && !newVal[2]
    const wasNotAllEmpty = oldVal[0] || oldVal[1] || oldVal[2]

    // 如果從有值變成全部為空，則自動執行一次搜尋
    if (allEmpty && wasNotAllEmpty) {
      handleSearch()
    }
  },
  { deep: true }
)

// 监听类别选择变化，自动触发筛选
watch(
  () => searchForm.value.category,
  (newVal, oldVal) => {
    // 当类别变化时，自动执行筛选
    if (newVal !== oldVal) {
      handleSearch()
    }
  }
)

onMounted(() => {
    const loginUser = JSON.parse(localStorage.getItem('loginUser') || 'null')
    if (loginUser && loginUser.token) {
        searchAll()
    } else {
        // 清空數據，避免顯示舊數據
        originalData.value = []
        filteredData.value = []
        total.value = 0
        // 路由守衛會處理重定向
    }
})
</script>

<template>
  <div class="announcement-page">
    <!-- 社區公告標題 -->
    <div class="announcement-title">
      <h1>社區公告</h1>
    </div>

    <!-- 列表區域 -->
    <div class="list-section">
      <!-- 搜尋區域 -->
      <div class="search-section">
        <el-form :inline="true" :model="searchForm" class="search-form">
          <el-form-item label="日期">
            <el-date-picker
              v-model="searchForm.date"
              type="daterange"
              range-separator="至"
              start-placeholder="開始日期"
              end-placeholder="結束日期"
              style="width: 260px"
              value-format="YYYY-MM-DD"
            />
          </el-form-item>
          <el-form-item label="類別">
            <el-select
              v-model="searchForm.category"
              placeholder="選擇類別"
              style="width: 120px"
            >
              <!-- 動態生成類別選項 -->
              <el-option
                v-for="option in categoryOptions"
                :key="option.value"
                :label="option.label"
                :value="option.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="標題">
            <el-input
              v-model="searchForm.title"
              placeholder="請輸入標題關鍵字"
              style="width: 180px"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSearch">
              <el-icon><Search /></el-icon>
              查詢
            </el-button>
            <el-button @click="resetSearch">
              <el-icon><RefreshRight /></el-icon>
              清空
            </el-button>
          </el-form-item>
        </el-form>
      </div>

      <el-table
        :data="dashBoardData"
        style="width: 100%"
        :stripe="true"
        :border="true"
        :resizable="false"
        :cell-style="{ textAlign: 'center' }"
        :header-cell-style="{ textAlign: 'center', backgroundColor: '#f0f5ff' }"
        @sort-change="handleSortChange"
        :default-sort="{ prop: sortConfig.prop, order: sortConfig.order }"
      >
        <el-table-column
          prop="date"
          label="日期"
          width="120"
          sortable="custom"
        />
        <el-table-column prop="sort" label="類別" width="120">
          <template #default="scope">
            <el-tag
              :type="
                scope.row.sort === '水電相關'
                  ? 'warning' // 藍灰色，接近藍色
                  : scope.row.sort === '住戶相關'
                  ? 'success' // 綠色
                  : scope.row.sort === '維修相關'
                  ? 'danger' // 紅色
                  : 'info' // 灰色或其他
              "
              effect="dark"
            >
              {{ scope.row.sort }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="header" label="標題" min-width="180" />
        <el-table-column label="操作" width="120" fixed="right">
          <template #default="scope">
            <el-button
              type="primary"
              size="small"
              @click="handleViewDetail(scope.row)"
            >
              查看
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分頁 -->
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="pageSizes"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>

    <!-- 詳情對話框 -->
    <el-dialog v-model="dialogVisible" title="公告詳情" width="60%">
      <el-descriptions v-if="currentDetail" :column="1" border>
        <el-descriptions-item label="日期">
          {{ currentDetail.date }}
        </el-descriptions-item>
        <el-descriptions-item label="類別">
          {{ currentDetail.sort }}
        </el-descriptions-item>
        <el-descriptions-item label="標題">
          {{ currentDetail.header }}
        </el-descriptions-item>
        <el-descriptions-item label="內容">
          {{ currentDetail.content }}
        </el-descriptions-item>
      </el-descriptions>

      <div v-if="currentDetail?.image" class="dialog-image">
        <el-image
          :src="currentDetail.image"
          fit="contain"
          :preview-src-list="[currentDetail.image]"
        >
          <template #error>
            <div class="image-slot">
              <el-icon><Picture /></el-icon>
              <span>暫無圖片</span>
            </div>
          </template>
        </el-image>
      </div>
    </el-dialog>
  </div>
</template>

<style scoped>
/* 样式保持不变 */
.announcement-page {
  padding: 20px;
  background: linear-gradient(135deg, #6fb7b7 0%, #8ec5c5 50%, #6fb7b7 100%);
  min-height: 100vh;
  position: relative;
}

.announcement-page::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" fill="none"/><path d="M0 0h100v100H0z" fill="rgba(255,255,255,0.03)"/><path d="M50 0v100M0 50h100" stroke="rgba(0,0,0,0.03)" stroke-width="0.5"/></svg>');
  opacity: 0.8;
  pointer-events: none;
}

.list-section {
  width: 900px;
  margin: 0 auto;
  background: linear-gradient(to bottom right, #ffffff, #f8f9fa);
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.5);
}

.search-section {
  margin-bottom: 20px;
  padding: 20px;
  background: linear-gradient(to right, #f8f9fa, #f1f3f5);
  border-radius: 12px;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.03);
}

.carousel-section {
  width: 900px;
  margin: 0 auto 30px;
  padding: 0;
  filter: drop-shadow(0 10px 20px rgba(0, 0, 0, 0.1));
}

.carousel-content {
  position: relative;
  height: 100%;
  border-radius: 8px;
  overflow: hidden;
}

.carousel-image {
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  transition: transform 0.3s ease;
}

.carousel-caption {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20px;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent);
  color: white;
}

.carousel-caption h3 {
  margin: 0 0 8px;
  font-size: 1.5em;
  font-weight: 600;
}

.carousel-caption p {
  margin: 0;
  font-size: 1em;
  opacity: 0.9;
}

.announcement-title {
  width: 900px;
  margin: 0 auto 20px;
  text-align: center;
}

.announcement-title h1 {
  font-size: 38px;
  color: #fff;
  margin: 0;
  padding: 15px 0;
  font-weight: 700;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  background: linear-gradient(45deg, #4a8f8f, #6fb7b7);
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.search-section {
  margin-bottom: 20px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
}

.search-form {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}

:deep(.el-pagination) {
  justify-content: center;
  margin-top: 20px;
}

:deep(.el-form--inline .el-form-item) {
  margin-right: 0;
  margin-bottom: 0;
}

:deep(.el-form--inline) {
  justify-content: center;
}

:deep(.el-table th) {
  background-color: #f8f9fa !important;
}

:deep(.el-table--border) {
  border-radius: 8px;
  overflow: hidden;
}

/* 添加一個空數據的提示樣式 */
.empty-data {
  text-align: center;
  padding: 40px 0;
  color: #909399;
}
</style>
