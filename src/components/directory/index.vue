<script setup>
import { ref } from 'vue';
import { Phone } from '@element-plus/icons-vue';

const tableData = ref([
  {
    category: '物業管理中心',
    phone: '(02)2345-6789',
    hours: '週一至週五 09:00-18:00'
  },
  {
    category: '24小時保全室',
    phone: '(02)2345-6790',
    hours: '24小時服務'
  },
  {
    category: '社區會所',
    phone: '(02)2345-6791',
    hours: '週一至週日 07:00-22:00'
  },
  {
    category: '健身房',
    phone: '(02)2345-6792',
    hours: '週一至週日 06:00-23:00'
  },
  {
    category: '游泳池管理室',
    phone: '(02)2345-6793',
    hours: '週二至週日 06:30-21:30'
  }
]);
</script>

<template>
  <div class="page-container">
    <!-- 標題橫幅 -->
    <div class="title-banner">
      通訊錄
    </div>

    <div class="content-container">
      <!-- 管理員專線資訊框 -->
      <div class="contact-card">
        <div class="contact-header">
          <el-icon class="phone-icon"><Phone /></el-icon>
          <h2>管理中心緊急專線</h2>
        </div>
        <div class="contact-number"> 07-351-3959</div>
        <div class="contact-info">
          <p>提供 24 小時緊急事件處理服務</p>
          <p>包含：漏水、停電、電梯故障、消防警報等緊急狀況</p>
        </div>
        <div class="contact-hours">
          服務時間：24 小時
        </div>
      </div>

      <!-- 表格區域 -->
      <div class="table-container">
        <el-table
          :data="tableData"
          style="width: 100%"
          :header-cell-style="{
            background: '#f5f7fa',
            color: '#606266',
            fontWeight: 'bold',
            textAlign: 'center',
            padding: '12px 8px'
          }"
          :cell-style="{
            textAlign: 'center',
            padding: '12px 8px'
          }"
        >
          <el-table-column 
            prop="category" 
            label="分類" 
            min-width="200"
            align="center"
          >
            <template #default="scope">
              <div class="category-cell">{{ scope.row.category }}</div>
            </template>
          </el-table-column>
          
          <el-table-column 
            prop="phone" 
            label="連絡電話" 
            min-width="200"
            align="center"
          >
            <template #default="scope">
              <div class="phone-cell">
                <el-icon><Phone /></el-icon>
                <span>{{ scope.row.phone }}</span>
              </div>
            </template>
          </el-table-column>
          
          <el-table-column 
            prop="hours" 
            label="營業時間" 
            min-width="200"
            align="center"
          >
            <template #default="scope">
              <span class="hours-text">{{ scope.row.hours }}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page-container {
  padding: 20px;
  background: linear-gradient(135deg, #6FB7B7 0%, #8ec5c5 50%, #6FB7B7 100%);
  min-height: 100vh;
  position: relative;
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

/* 標題橫幅樣式 */
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

/* 管理員專線資訊框樣式 */
.contact-card {
  background-color: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.contact-header {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
}

.phone-icon {
  font-size: 20px;
  color: #7FB5B5;
  margin-right: 8px;
}

.contact-header h2 {
  font-size: 16px;
  color: #333;
  margin: 0;
}

.contact-number {
  font-size: 20px;
  color: #7FB5B5;
  font-weight: bold;
  margin-bottom: 10px;
  text-align: center;
}

.contact-info {
  color: #666;
  font-size: 13px;
  line-height: 1.4;
  margin-bottom: 10px;
  text-align: center;
}

.contact-info p {
  margin: 3px 0;
}

.contact-hours {
  color: #7FB5B5;
  font-weight: 500;
  font-size: 13px;
  text-align: center;
}

/* 表格樣式更新 */
.table-container {
  margin: 0 auto;
}

.category-cell {
  font-weight: 500;
  color: #606266;
  white-space: nowrap;
  padding: 0 8px;
}

.phone-cell {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  white-space: nowrap;
  padding: 0 8px;
}

.phone-cell .el-icon {
  color: #7FB5B5;
}

.phone-cell span {
  color: #606266;
  font-family: monospace;
}

.hours-text {
  background-color: #f5f7fa;
  padding: 4px 12px;
  border-radius: 4px;
  font-size: 13px;
  color: #606266;
  white-space: nowrap;
}

/* Element Plus 表格樣式覆蓋 */
:deep(.el-table) {
  border-radius: 6px;
  overflow: hidden;
  border: 1px solid #ebeef5;
}

:deep(.el-table__header) {
  background-color: #f5f7fa;
}

:deep(.el-table__row) {
  border-bottom: 1px solid #ebeef5;
}

:deep(.el-table__row:hover) {
  background-color: #f5f7fa !important;
}

:deep(.el-table__cell) {
  padding: 8px !important;
}

:deep(.el-table__header-wrapper) {
  width: 100%;
}

:deep(.el-table__body-wrapper) {
  width: 100%;
}

:deep(.el-table__inner-wrapper) {
  width: 100%;
}

:deep(.el-table__body) {
  width: 100% !important;
}

:deep(.el-table__header) {
  width: 100% !important;
}
</style>