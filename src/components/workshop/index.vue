<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import * as echarts from 'echarts'
import {maintenanceSearchAll,findTop3} from '@/api/api'

// 圖表相關變量
let myChart = null
let option = {
  grid: {
    top: '10%',
    bottom: '15%',
    left: '15%',
    right: '15%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    data: [],
    axisLabel: {
      interval: 0,
      rotate: 0,
      fontSize: 14,
      lineHeight: 20,
      padding: [10, 8, 10, 8],
      width: 150,
      overflow: 'break'
    }
  },
  yAxis: {
    type: 'value',
    name: '報修次數'
  },
  series: [
    {
      data: [],
      type: 'bar',
      barWidth: '40%',
      itemStyle: {
        color: '#6fb7b7'
      }
    }
  ]
}

// 搜尋表單數據
const searchForm = ref({
  type: '',
  location: '',
  description: '', // 新增損害描述
  status: '',
  date: '',
})

// 控制排行榜顯示
const showRanking = ref(true)

// 監聽搜尋表單變化
watch(
  () => ({
    type: searchForm.value.type,
    location: searchForm.value.location,
    description: searchForm.value.description,
    status: searchForm.value.status,
    date: searchForm.value.date
  }),
  () => {
    handleSearch()
  },
  { deep: true }
)

// 種類選項
const typeOptions = ref([
  '設備相關',
  '水電相關',
  '結構相關',
  '其他',
])

// 分頁相關
const currentPage = ref(1)
const pageSize = ref(10)
const totalReports = ref(0)

// 加載狀態
const loading = ref(false)


// 模擬的維修通報數據
const reportList = ref([])

// 查看對話框
const viewDialogVisible = ref(false)
const currentReport = ref(null)

const reportDialogVisible = ref(false)
const reportForm = ref({
  location: '',
  type: '',
  description: '',
  image1: null,
  image2: null,
})



// 根據搜尋條件過濾的列表
const filteredReportList = computed(() => {
  // 先進行搜尋條件過濾
  const filteredList = reportList.value.filter(item => {
    const matchType = !searchForm.value.type || item.sort === searchForm.value.type
    const matchLocation = !searchForm.value.location || item.location.includes(searchForm.value.location)
    const matchDescription = !searchForm.value.description || item.description.includes(searchForm.value.description)
    const matchStatus = !searchForm.value.status || item.status === searchForm.value.status
    const matchDate = !searchForm.value.date || item.createTime.includes(searchForm.value.date)
    return matchType && matchLocation && matchDescription && matchStatus && matchDate
  })

  // 再進行排序
  const sortedList = filteredList
    .sort((a, b) => {
      return new Date(b.createTime) - new Date(a.createTime)
    })
    .map((item) => ({
      ...item,
      truncatedDescription:
        item.description.length > 10
          ? item.description.substring(0, 10) + '...'
          : item.description,
    }))

  // 最後進行分頁
  return sortedList.slice(
    (currentPage.value - 1) * pageSize.value,
    currentPage.value * pageSize.value
  )
})



// 獲取圖片URL
const getImageUrl = (url) => {
  if (!url) return '';
  return url.startsWith('http') ? url : `http://localhost:8585${url}`;
}

// 搜尋處理
const handleSearch = () => {
  loading.value = true
  const filteredList = reportList.value.filter(item => {
    const matchType = !searchForm.value.type || item.sort === searchForm.value.type
    const matchLocation = !searchForm.value.location || item.location.includes(searchForm.value.location)
    const matchDescription = !searchForm.value.description || item.description.includes(searchForm.value.description)
    const matchStatus = !searchForm.value.status || item.status === searchForm.value.status
    const matchDate = !searchForm.value.date || item.createTime.includes(searchForm.value.date)

    return matchType && matchLocation && matchDescription && matchStatus && matchDate
  })

  totalReports.value = filteredList.length
  loading.value = false
  currentPage.value = 1
}

// 重置搜尋
const resetSearch = () => {
  searchForm.value = {
    type: '',
    location: '',
    description: '',
    status: '',
    date: '',
  }
  handleSearch()
}

// 新增處理
const handleAdd = () => {
  reportDialogVisible.value = true
}

const handleReportSubmit = () => {
  // 處理表單提交邏輯
  console.log(reportForm.value)
  reportDialogVisible.value = false
}

const handleImageUpload = (file, type) => {
  reportForm.value[type] = file
}

// 查看處理
const handleView = (row) => {
  currentReport.value = row
  viewDialogVisible.value = true
}

// 分頁大小變更
const handleSizeChange = (val) => {
  pageSize.value = val
}

// 當前頁變更
const handleCurrentChange = (val) => {
  currentPage.value = val

  const mockData = []

  for (let i = 1; i <= 100; i++) {
    const randomDate = new Date(
      2025,
      Math.floor(Math.random() * 12),
      Math.floor(Math.random() * 28) + 1,
      Math.floor(Math.random() * 24),
      Math.floor(Math.random() * 60),
      Math.floor(Math.random() * 60)
    )

    const formattedDate = `${randomDate.getFullYear()}-${String(
      randomDate.getMonth() + 1
    ).padStart(2, '0')}-${String(randomDate.getDate()).padStart(
      2,
      '0'
    )} ${String(randomDate.getHours()).padStart(2, '0')}-${String(
      randomDate.getMinutes()
    ).padStart(2, '0')}-${String(randomDate.getSeconds()).padStart(2, '0')}`

    const status = statuses[Math.floor(Math.random() * statuses.length)]

    mockData.push({
      id: i,
      type: types[Math.floor(Math.random() * types.length)],
      location: locations[Math.floor(Math.random() * locations.length)],
      description: `損壞描述 ${i}：設備無法正常運作，需要維修。`,
      reportTime: formattedDate,
      status: status,
      cost:
        status === '已修繕' ? Math.floor(Math.random() * 10000) + 500 : null,
    })
  }

  return mockData
}
// 獲取種類對應的顏色
const getTypeColor = (type) => {
  switch (type) {
    case '設備相關':
      return '#e6a23c' // 黃色
    case '結構相關':
      return '#f56c6c' // 紅色
    case '水電相關':
      return '#409eff' // 藍色
    default:
      return '#909399' // 灰色
  }
}

// 獲取狀態對應的樣式
const getStatusType = (status) => {
  switch (status) {
    case '待處理':
      return 'warning'
    case '處理中':
      return 'primary'
    case '已完成':
      return 'success'
    default:
      return 'info'
  }
}

// 組件掛載時初始化數據
onMounted(async () => {
  try {
    loading.value = true
    // 獲取維修通報列表數據
    const maintenanceData = await maintenanceSearchAll()
    console.log(maintenanceData)
    if (maintenanceData) {
      reportList.value = maintenanceData
      totalReports.value = maintenanceData.length
    }

    // 初始化圖表
    myChart = echarts.init(document.getElementById('main'))

    // 獲取Top3數據
    const top3Data = await findTop3()
    if (top3Data) {
      // 更新圖表數據
      option.xAxis.data = top3Data.map(item => `${item.location}\n${item.description}`)
      option.series[0].data = top3Data.map(item => item.count)
      myChart.setOption(option)
      console.log(top3Data)
    }
  } catch (error) {
    console.error('獲取數據失敗:', error)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="maintenance-dashboard">
    <!-- 頂部排行榜 -->
    <div class="ranking-section">
      <div class="section-header" @click="showRanking = !showRanking" style="cursor: pointer;">
        <h2 class="ranking-title">維修事項排行榜</h2>
        <el-icon :class="{ 'is-reverse': showRanking }"><ArrowDown /></el-icon>
      </div>
      <div v-show="showRanking" class="ranking-content-wrapper">
        <div id="main" style="width: 100%; height: 300px; margin: 0 auto;"></div>
      </div>
    </div>

    <!-- 中間搜尋欄 -->
    <div class="search-section">
      <div class="search-form">
        <el-form :inline="true" :model="searchForm" class="search-form-content">
          <div class="search-grid">
            <el-form-item label="種類">
              <el-select v-model="searchForm.type" placeholder="請選擇種類" clearable>
                <el-option v-for="item in typeOptions" :key="item" :label="item" :value="item">
                  <span style="display: flex; align-items: center;">
                    <el-tag :style="{ backgroundColor: getTypeColor(item), color: '#fff', border: 'none', marginRight: '8px' }">
                      {{ item }}
                    </el-tag>
                  </span>
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="地點">
              <el-input v-model="searchForm.location" placeholder="請輸入地點" clearable />
            </el-form-item>
            <el-form-item label="損害描述">
              <el-input v-model="searchForm.description" placeholder="請輸入損害描述" clearable />
            </el-form-item>
            <el-form-item label="狀態">
              <el-select v-model="searchForm.status" placeholder="請選擇狀態" clearable>
                <el-option label="待處理" value="待處理" />
                <el-option label="處理中" value="處理中" />
                <el-option label="已完成" value="已完成" />
              </el-select>
            </el-form-item>
            <el-form-item label="日期">
              <el-date-picker
                v-model="searchForm.date"
                type="date"
                placeholder="選擇日期"
                format="YYYY/MM/DD"
                value-format="YYYY-MM-DD"
              />
            </el-form-item>
            <el-form-item>
              <el-button @click="resetSearch">
                <el-icon><RefreshRight /></el-icon> 清空
              </el-button>
            </el-form-item>
          </div>
        </el-form>
      </div>
    </div>

    <!-- 底部維修通報列表 -->
    <div class="report-list-section">
      <el-table
        :data="filteredReportList"
        style="width: 100%"
        border
        stripe
        v-loading="loading"
        :cell-style="{ textAlign: 'center' }"
        :header-cell-style="{ textAlign: 'center', backgroundColor: '#f5f7fa' }"
        :resizable="false"
      >
        <el-table-column type="index" label="編號" width="60" />
        <el-table-column label="種類" width="100">
          <template #default="scope">
            <el-tag :style="{ backgroundColor: getTypeColor(scope.row.sort), color: '#fff', border: 'none' }">
              {{ scope.row.sort }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="location" label="地點" width="140" />
        <el-table-column prop="description" label="損壞描述" width="150" />
        <el-table-column label="通報時間" width="207">
          <template #default="scope">
            {{ scope.row.createTime.replace('T', ' ') }}
          </template>
        </el-table-column>
        <el-table-column label="狀態" width="100">
          <template #default="scope">
            <el-tag :type="getStatusType(scope.row.status)" effect="light">
              {{ scope.row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100">
          <template #default="scope">
            <el-button
              type="success"
              size="small"
              @click="handleView(scope.row)"
            >
              <el-icon><View /></el-icon> 查看
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分頁 -->
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalReports"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>

    <!-- 查看詳情對話框 -->
    <el-dialog
      v-model="viewDialogVisible"
      title="維修詳情"
      width="40%"
      destroy-on-close
    >
      <div class="detail-content">
        <el-descriptions :column="1" border>
          <el-descriptions-item label="種類">
            <el-tag :style="{ backgroundColor: getTypeColor(currentReport?.sort), color: '#fff', border: 'none' }">
              {{ currentReport?.sort }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="地點">
            {{ currentReport?.location }}
          </el-descriptions-item>
          <el-descriptions-item label="通報時間">
            {{ currentReport?.createTime?.replace('T', ' ') }}
          </el-descriptions-item>
          <el-descriptions-item label="狀態">
            <el-tag :type="getStatusType(currentReport?.status)" effect="light">
              {{ currentReport?.status }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="損害描述">
            {{ currentReport?.description }}
          </el-descriptions-item>
        </el-descriptions>

        <div class="image-section">
          <h4>損壞照片</h4>
          <div class="image-container">
            <div class="image-item" v-for="(_, index) in 2" :key="index">
              <el-image
                :src="currentReport ? getImageUrl(index === 0 ? currentReport.photo1 : currentReport.photo2) : ''"
                fit="contain"
                :preview-src-list="currentReport ? [getImageUrl(index === 0 ? currentReport.photo1 : currentReport.photo2)] : []"
                style="width: 200px; height: 150px"
              >
                <template #error>
                  <div class="image-error">
                    <el-icon><Picture /></el-icon>
                    <span>無圖片</span>
                  </div>
                </template>
              </el-image>
              <div class="image-caption">圖片{{ index + 1 }}</div>
            </div>
          </div>
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="viewDialogVisible = false">關閉</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.maintenance-dashboard {
  padding: 20px;
  background: linear-gradient(135deg, #6fb7b7 0%, #8ec5c5 50%, #6fb7b7 100%);
  min-height: 100vh;
  position: relative;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  padding: 0 10px;
}

.section-header h2.ranking-title {
  margin: 0 auto;
  font-size: 28px;
  font-weight: 600;
  color: #303133;
  text-align: center;
}

/* 排行榜樣式 */
.ranking-section {
  width: 900px;
  margin: 0 auto 20px;
  background: linear-gradient(to bottom right, #ffffff, #f8f9fa);
  border-radius: 15px;
  padding: 15px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.5);
}

.ranking-content-wrapper {
  overflow: hidden;
  transition: all 0.3s ease-in-out;
}

.ranking-badge {
  position: absolute;
  top: 0;
  left: 0;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 20px;
  z-index: 1;
}

.rank-1 {
  background-color: #f56c6c;
}

.rank-2 {
  background-color: #e6a23c;
}

.rank-3 {
  background-color: #409eff;
}

.ranking-content {
  display: flex;
  padding: 20px;
  padding-left: 50px;
}

.ranking-icon {
  margin-right: 15px;
  display: flex;
  align-items: center;
}

.icon-type-1 {
  color: #f56c6c;
}

.icon-type-2 {
  color: #e6a23c;
}

.icon-type-3 {
  color: #409eff;
}

.ranking-info {
  flex: 1;
}

.ranking-info h3 {
  margin: 0 0 5px 0;
  font-size: 18px;
  font-weight: 600;
}

.ranking-info .location {
  display: flex;
  align-items: center;
  gap: 5px;
  margin: 0 0 15px 0;
  color: #606266;
}

.ranking-stats {
  position: relative;
}

.count-badge {
  position: absolute;
  right: 0;
  top: -5px;
  background-color: #f56c6c;
  color: white;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: bold;
}

/* 搜尋區域樣式 */
.search-section {
  width: 900px;
  margin: 0 auto 20px;
  background: linear-gradient(to right, #f8f9fa, #f1f3f5);
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.5);
}

.search-form-content {
  padding: 20px;
}

.search-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  align-items: start;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  transition: background-color 0.3s;
}

.section-header:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.is-reverse {
  transform: rotate(180deg);
  transition: transform 0.3s;
}

.report-list-section {
  width: 900px;
  margin: 0 auto;
  background: linear-gradient(to bottom right, #ffffff, #f8f9fa);
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.5);
}

.image-container {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 15px;
}

.image-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.image-caption {
  margin-top: 8px;
  color: #606266;
  font-size: 14px;
}

.image-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #909399;
}
</style>