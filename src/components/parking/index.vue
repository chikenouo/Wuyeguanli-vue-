<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { ElMessage } from 'element-plus'
import request from '@/utils/request'

const total = ref(0)
const originalData = ref([]) // 保存原始數據
const filteredData = ref([]) // 存儲篩選後的數據

// 排序設置
const sortConfig = ref({
  prop: '', // 排序的屬性
  order: '' // 排序的順序
})

// 處理排序變化
const handleSortChange = ({ prop, order }) => {
  sortConfig.value = { prop, order }
}

// 搜尋表單數據
const searchForm = ref({
  vehicleType: '',
  parkingNumber: '',
  paid: '',
  owner: '' // 添加使用者搜尋欄位
})

// 車種選項
const vehicleTypeOptions = [
  { label: '全部', value: '' },
  { label: '機車', value: '機車' },
  { label: '汽車', value: '汽車' }
]

// 號碼選項
const parkingNumberOptions = computed(() => {
  const options = [{ label: '全部', value: '' }]
  if (searchForm.value.vehicleType === '機車') {
    for (let i = 1; i <= 10; i++) {
      options.push({ label: i.toString(), value: i.toString() })
    }
  } else if (searchForm.value.vehicleType === '汽車') {
    for (let i = 1; i <= 5; i++) {
      options.push({ label: i.toString(), value: i.toString() })
    }
  }
  return options
})

// 分頁設置
const currentPage = ref(1)
const pageSize = ref(10)
const pageSizes = [10, 20, 30, 50]

// 表格數據 - 經過排序、篩選和分頁後的數據
const parkingData = computed(() => {
  // 先處理數據，提取車種和號碼
  const processedData = filteredData.value.map(item => ({
    ...item,
    vehicleType: item.parking.includes('機車') ? '機車' : '汽車',
    parkingNumber: parseInt(item.parking.match(/\d+/)[0], 10) // 轉換為數字
  }))
  
  // 進行排序
  const sortedData = [...processedData].sort((a, b) => {
    if (!sortConfig.value.prop) return 0
    
    if (sortConfig.value.prop === 'parkingNumber') {
      // 直接使用已轉換為數字的parkingNumber進行排序
      return sortConfig.value.order === 'ascending' ? a.parkingNumber - b.parkingNumber : b.parkingNumber - a.parkingNumber
    }
    
    if (sortConfig.value.prop === 'parkingFee') {
      const feeA = parseInt(a.parkingFee, 10)
      const feeB = parseInt(b.parkingFee, 10)
      return sortConfig.value.order === 'ascending' ? feeA - feeB : feeB - feeA
    }
    
    const propA = a[sortConfig.value.prop]
    const propB = b[sortConfig.value.prop]

    if (sortConfig.value.order === 'ascending') {
      return propA < propB ? -1 : propA > propB ? 1 : 0
    } else {
      return propA > propB ? -1 : propA < propB ? 1 : 0
    }
  })

  // 再進行分頁
  const startIndex = (currentPage.value - 1) * pageSize.value
  const endIndex = startIndex + pageSize.value
  return sortedData.slice(startIndex, endIndex)
})

// 根據車種和號碼生成停車位字符串
const generateParkingString = (vehicleType, parkingNumber) => {
  if (!vehicleType || !parkingNumber) return ''
  return `${vehicleType}${parkingNumber}號`
}

// 繳費狀況選項
const paidOptions = [
  { label: '全部', value: '' },
  { label: '已繳費', value: true },
  { label: '未繳費', value: false }
]

// 從API獲取停車費用數據
const fetchParkingData = async () => {
  try {
    const response = await request.get('/money/sendtotalfee')
    if (response) {
      originalData.value = response
      filteredData.value = [...originalData.value]
      total.value = filteredData.value.length
    }
  } catch (error) {
    console.error('獲取停車費用數據失敗:', error)
    ElMessage.error('獲取停車費用數據失敗')
  }
}

// 重置搜尋
const resetSearch = () => {
  searchForm.value = {
    vehicleType: '',
    parkingNumber: '',
    paid: '',
    owner: ''
  }
  handleSearch()
}

// 執行搜尋
const handleSearch = () => {
  filteredData.value = originalData.value.filter((item) => {
    const parking = generateParkingString(searchForm.value.vehicleType, searchForm.value.parkingNumber)
    const matchVehicleType = !searchForm.value.vehicleType || item.parking.includes(searchForm.value.vehicleType)
    const matchParkingNumber = !searchForm.value.parkingNumber || item.parking.includes(searchForm.value.parkingNumber + '號')
    const matchPaid = searchForm.value.paid === '' || item.paid === searchForm.value.paid
    const matchOwner = !searchForm.value.owner || item.owner.toLowerCase().includes(searchForm.value.owner.toLowerCase())
    return matchVehicleType && matchParkingNumber && matchPaid && matchOwner
  })
  currentPage.value = 1
  total.value = filteredData.value.length
}

// 分頁大小變化
const handleSizeChange = (size) => {
  pageSize.value = size
  currentPage.value = 1
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

// 監聽搜尋表單變化
watch(
  () => [searchForm.value.vehicleType, searchForm.value.parkingNumber, searchForm.value.paid, searchForm.value.owner],
  () => {
    handleSearch()
  },
  { deep: true }
)

// 監聽車種變化，重置號碼
watch(
  () => searchForm.value.vehicleType,
  () => {
    searchForm.value.parkingNumber = ''
  }
)

onMounted(() => {
  fetchParkingData()
})
</script>

<template>
  <div class="parking-page">
    <!-- 標題 -->
    <div class="parking-title">
      <h1>2026繳費進行中</h1>
    </div>

    <!-- 列表區域 -->
    <div class="list-section">
      <!-- 搜尋區域 -->
      <div class="search-section">
        <el-form :inline="true" :model="searchForm" class="search-form">
          <div class="form-fields">
            <el-form-item label="車種">
              <el-select
                v-model="searchForm.vehicleType"
                placeholder="選擇車種"
                style="width: 120px"
              >
                <el-option
                  v-for="option in vehicleTypeOptions"
                  :key="option.value"
                  :label="option.label"
                  :value="option.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="號碼">
              <el-select
                v-model="searchForm.parkingNumber"
                placeholder="選擇號碼"
                style="width: 120px"
                :disabled="!searchForm.vehicleType"
              >
                <el-option
                  v-for="option in parkingNumberOptions"
                  :key="option.value"
                  :label="option.label"
                  :value="option.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="繳費狀況">
              <el-select
                v-model="searchForm.paid"
                placeholder="選擇繳費狀況"
                style="width: 120px"
              >
                <el-option
                  v-for="option in paidOptions"
                  :key="option.value"
                  :label="option.label"
                  :value="option.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="使用者">
              <el-input
                v-model="searchForm.owner"
                placeholder="搜尋使用者"
                style="width: 120px"
                clearable
              />
              <el-button @click="resetSearch" style="margin-left: 10px">
                <el-icon><RefreshRight /></el-icon>
                清空
              </el-button>
            </el-form-item>
          </div>
        </el-form>
      </div>

      <el-table
        :data="parkingData"
        style="width: 100%"
        :stripe="true"
        :border="true"
        :resizable="false"
        :cell-style="{ textAlign: 'center' }"
        :header-cell-style="{ textAlign: 'center', backgroundColor: '#f0f5ff' }"
        @sort-change="handleSortChange"
      >
        <el-table-column prop="vehicleType" label="車種" min-width="12%">
          <template #default="scope">
            <el-tag
              :type="scope.row.vehicleType === '機車' ? 'warning' : 'success'"
              effect="light"
              class="vehicle-type-tag"
            >
              {{ scope.row.vehicleType }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="parkingNumber" label="號碼" min-width="10%" sortable />
        <el-table-column prop="parkingFee" label="金額" min-width="15%" sortable>
          <template #default="scope">
            {{ scope.row.parkingFee }} 元
          </template>
        </el-table-column>
        <el-table-column prop="owner" label="使用者" min-width="20%" />
        <el-table-column prop="paid" label="繳費狀態" min-width="15%">
          <template #default="scope">
            <el-tag
              :type="scope.row.paid ? 'success' : 'danger'"
              effect="dark"
            >
              {{ scope.row.paid ? '已繳費' : '未繳費' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="15%">
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
    <el-dialog v-model="dialogVisible" title="停車費用詳情" width="500px">
      <el-descriptions v-if="currentDetail" :column="1" border>
        <el-descriptions-item label="車位">
          {{ currentDetail.parking }}
        </el-descriptions-item>
        <el-descriptions-item label="金額">
          {{ currentDetail.parkingFee }} 元
        </el-descriptions-item>
        <el-descriptions-item label="使用者">
          {{ currentDetail.owner }}
        </el-descriptions-item>
        <el-descriptions-item label="繳費狀態">
          {{ currentDetail.paid ? '已繳費' : '未繳費' }}
        </el-descriptions-item>
        <el-descriptions-item label="收款帳號">
          {{ currentDetail.receiveMoneyAccount || '暫無' }}
        </el-descriptions-item>
        <el-descriptions-item label="收款金額">
          {{ currentDetail.receive }} 元
        </el-descriptions-item>
        <el-descriptions-item label="匯款帳號">
          {{ currentDetail.sendMoneyAccount || '暫無' }}
        </el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </div>
</template>

<style scoped>
.parking-page {
  padding: 20px;
  background: linear-gradient(135deg, #6fb7b7 0%, #8ec5c5 50%, #6fb7b7 100%);
  min-height: 100vh;
  position: relative;
}

.parking-page::before {
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
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
}

.parking-title {
  width: 900px;
  margin: 0 auto 20px;
  text-align: center;
}

.parking-title h1 {
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

.search-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.form-fields {
  display: flex;
  justify-content: center;
  gap: 20px;
}

.form-buttons {
  display: flex;
  justify-content: center;
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

.vehicle-type-tag {
  min-width: 60px;
  font-weight: 600;
  padding: 4px 8px;
}

:deep(.el-table) {
  width: 100% !important;
}
</style>
