<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

// 表格數據
const tableData = ref([])

// 從 localStorage 獲取用戶地址
const getUserAddress = () => {
  const userStr = localStorage.getItem('loginUser')
  if (userStr) {
    const user = JSON.parse(userStr)
    return user.address
  }
  return null
}

// 處理其他字段的數據轉換
const parseOtherField = (otherStr) => {
  const items = JSON.parse(otherStr)
  return items.map(item => {
    const year = item.substring(0, 3)  // 取前三位作為年度
    const quarter = item.substring(3, 4)  // 取第四位作為季度
    const isPaid = item.endsWith('是')  // 判斷是否繳費
    
    return {
      doorplate: getUserAddress(),
      year: year,
      quarter: `Q${quarter}`,
      isPaid: isPaid,
      note: isPaid ? '已繳清' : '待繳納',
      lastOperateTime: new Date().toISOString().split('T')[0]
    }
  })
}

// 獲取費用數據
const fetchFeeData = async () => {
  const address = getUserAddress()
  if (!address) return
  
  try {
    const response = await axios.get(`http://localhost:8585/fee/getbyid?address=${address}`)
    if (response.data && response.data.length > 0) {
      const feeInfo = response.data[0]
      tableData.value = parseOtherField(feeInfo.other)
    }
  } catch (error) {
    console.error('獲取費用數據失敗:', error)
  }
}

onMounted(() => {
  fetchFeeData()
})

// 分頁設置
const currentPage = ref(1)
const pageSize = ref(10)
const pageSizes = [10, 20, 30, 50]

// 處理分頁大小變化
const handleSizeChange = (val) => {
  pageSize.value = val
}

// 處理當前頁變化
const handleCurrentChange = (val) => {
  currentPage.value = val
}


// 控制詳情對話框
const dialogVisible = ref(false)
const currentDetail = ref(null)
// 生成隨機10位數帳號
const generateRandomAccount = () => {
  return Math.floor(1000000000 + Math.random() * 9000000000).toString()
}

// 生成隨機金額（500-2000之間的整百數）
const generateRandomAmount = () => {
  const min = 5
  const max = 20
  return (Math.floor(Math.random() * (max - min + 1)) + min) * 100
}

// 生成2025年的隨機時間
const generateRandomTime = () => {
  const start = new Date('2025-01-01 00:00:00')
  const end = new Date('2025-12-31 23:59:59')
  const randomDate = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
  return randomDate.toISOString().replace('T', ' ').slice(0, 19)
}

// 查看繳費詳情
const handleViewDetail = (row) => {
  currentDetail.value = {
    ...row,
    fee: row.isPaid ? generateRandomAmount() : '待繳納',
    accountNumber: row.isPaid ? generateRandomAccount() : '待繳納',
    paymentTime: row.isPaid ? generateRandomTime() : '待繳納'
  }
  dialogVisible.value = true
}

</script>

<template>
  <div class="fee-page">
    <!-- 標題區域 -->
    <div class="title-banner">管理費</div>

    <!-- 列表區域 -->
    <div class="content-container">
      <div class="table-container">
        <el-table
          :data="tableData"
          style="width: 100%"
          :stripe="true"
          :border="true"
          :resizable="false"
          :cell-style="{ textAlign: 'center' }"
          :header-cell-style="{
            textAlign: 'center',
            backgroundColor: '#f0f5ff',
          }"
        >
          <el-table-column prop="doorplate" label="門牌" width="120" />
          <el-table-column prop="year" label="年度" width="100" />
          <el-table-column prop="quarter" label="季" width="80" />
          <el-table-column prop="isPaid" label="繳費狀態" width="120">
            <template #default="scope">
              <el-tag
                :type="scope.row.isPaid ? 'success' : 'danger'"
                effect="dark"
              >
                {{ scope.row.isPaid ? '已繳清' : '未繳清' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="lastOperateTime" label="更改時間" min-width="180" />
          <el-table-column label="操作" width="180">
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
            :total="tableData.length"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>
    </div>

    <!-- 詳情對話框 -->
    <el-dialog
      v-model="dialogVisible"
      title="費用詳情"
      width="500px"
      :modal="true"
      :append-to-body="true"
      destroy-on-close
    >
      <el-descriptions
        v-if="currentDetail"
        :column="1"
        border
        class="fee-details"
      >
        <el-descriptions-item label="門牌">
          {{ currentDetail.doorplate }}
        </el-descriptions-item>
        <el-descriptions-item label="年度">
          {{ currentDetail.year }}
        </el-descriptions-item>
        <el-descriptions-item label="季度">
          {{ currentDetail.quarter }}
        </el-descriptions-item>
        <el-descriptions-item label="費用">
          {{ currentDetail.fee }}
        </el-descriptions-item>
        <el-descriptions-item label="匯款帳號">
          {{ currentDetail.accountNumber }}
        </el-descriptions-item>
        <el-descriptions-item label="匯款時間">
          {{ currentDetail.paymentTime }}
        </el-descriptions-item>
        <el-descriptions-item label="備註">
          {{ currentDetail.note }}
        </el-descriptions-item>
      </el-descriptions>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">關閉</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.fee-page {
  padding: 20px;
  background: linear-gradient(135deg, #6fb7b7 0%, #8ec5c5 50%, #6fb7b7 100%);
  min-height: 100vh;
  position: relative;
}

.title-banner {
  width: 900px;
  margin: 0 auto 20px;
  text-align: center;
  font-size: 38px;
  color: #fff;
  padding: 15px 0;
  font-weight: 700;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  background: linear-gradient(45deg, #4a8f8f, #6FB7B7);
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.content-container {
  width: 900px;
  margin: 0 auto;
  background: linear-gradient(to bottom right, #ffffff, #f8f9fa);
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.5);
}

.table-container {
  margin-top: 20px;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

/* 對話框樣式 */
:deep(.el-dialog) {
  border-radius: 8px;
  overflow: hidden;
}

:deep(.el-dialog__header) {
  background-color: #f0f5ff;
  margin: 0;
  padding: 15px 20px;
}

:deep(.el-dialog__title) {
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

:deep(.el-dialog__body) {
  padding: 20px;
}

.fee-details {
  margin-bottom: 20px;
}

:deep(.el-descriptions__label) {
  background-color: #f5f7fa;
  padding: 12px 15px;
}

:deep(.el-descriptions__content) {
  padding: 12px 15px;
}

.dialog-footer {
  text-align: right;
  padding-top: 10px;
}
</style>
