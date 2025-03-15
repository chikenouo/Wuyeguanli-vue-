<script setup>
import { ref, onMounted } from 'vue'

// 表格數據
const tableData = ref([
  {
    doorplate: 'A-101',
    year: '2024',
    quarter: 'Q1',
    isPaid: true,
    note: '按時繳納',
    lastOperateTime: '2024-01-15 14:30:00'
  },
  {
    doorplate: 'A-102',
    year: '2024',
    quarter: 'Q1',
    isPaid: false,
    note: '待繳納',
    lastOperateTime: '2024-01-10 09:15:00'
  }
])

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
</script>

<template>
  <div class="fee-page">
    <!-- 標題區域 -->
    <div class="title-banner">
      管理費
    </div>

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
          :header-cell-style="{ textAlign: 'center', backgroundColor: '#f0f5ff' }"
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
          <el-table-column prop="note" label="備註" min-width="180" />
          <el-table-column prop="lastOperateTime" label="最後操作時間" width="180" />
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
  </div>
</template>

<style scoped>
.fee-page {
  padding: 20px;
  background: linear-gradient(135deg, #6FB7B7 0%, #8ec5c5 50%, #6FB7B7 100%);
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
  justify-content: center;
}

:deep(.el-table--border) {
  border-radius: 8px;
  overflow: hidden;
}

:deep(.el-table th) {
  background-color: #f8f9fa !important;
}
</style>