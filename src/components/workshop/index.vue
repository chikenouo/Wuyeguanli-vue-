<script setup>
import { ref, computed, onMounted } from 'vue';
import { 
  Search, 
  RefreshRight, 
  Edit, 
  View, 
  Plus, 
  Location, 
  Picture,
  OfficeBuilding,
  Cpu,
  Promotion,
  HomeFilled,
  Connection
} from '@element-plus/icons-vue';

// 搜尋表單數據
const searchForm = ref({
  type: '',
  location: '',
  status: '',
  dateRange: []
});

// 種類選項
const typeOptions = ref(['電器設備', '水電管線', '結構損壞', '網路設備', '空調系統', '其他']);

// 分頁相關
const currentPage = ref(1);
const pageSize = ref(10);
const totalReports = ref(0);

// 加載狀態
const loading = ref(false);

// 排行榜數據
const topReportItems = ref([
  { type: '空調系統', location: '辦公室', count: 28 },
  { type: '水電管線', location: '廁所', count: 23 },
  { type: '網路設備', location: '會議室', count: 15 }
]);

// 模擬的維修通報數據
const reportList = ref([]);

// 查看對話框
const viewDialogVisible = ref(false);
const currentReport = ref(null);

const reportDialogVisible = ref(false);
const reportForm = ref({
  location: '',
  type: '',
  description: '',
  image1: null,
  image2: null
});

const locationOptions = [
  { value: 'office', label: '辦公室' },
  { value: 'meetingroom', label: '會議室' },
  { value: 'bathroom', label: '廁所' },
  { value: 'lobby', label: '大廳' }
];

// 根據搜尋條件過濾的列表
const filteredReportList = computed(() => {
  const sortedList = [...reportList.value].sort((a, b) => {
    return new Date(b.reportTime) - new Date(a.reportTime);
  }).map(item => ({
    ...item,
    truncatedDescription: item.description.length > 10 
      ? item.description.substring(0, 10) + '...'
      : item.description
  }));
  
  return sortedList.slice(
    (currentPage.value - 1) * pageSize.value,
    currentPage.value * pageSize.value
  );
});

// 獲取狀態對應的類型
const getStatusType = (status) => {
  switch (status) {
    case '未處理':
      return 'danger';
    case '處理中':
      return 'warning';
    case '已修繕':
      return 'success';
    default:
      return 'info';
  }
};

// 獲取排行榜百分比
const getPercentage = (count) => {
  const maxCount = Math.max(...topReportItems.value.map(item => item.count));
  return (count / maxCount) * 100;
};

// 獲取排行榜顏色
const getRankColor = (index) => {
  const colors = ['#f56c6c', '#e6a23c', '#409eff'];
  return colors[index] || '#909399';
};

// 獲取種類對應的圖標
const getIconForType = (type) => {
  switch (type) {
    case '空調系統':
      return HomeFilled;
    case '水電管線':
      return Promotion; // 使用 Promotion 替代不存在的 Pipe
    case '網路設備':
      return Connection;
    case '電器設備':
      return Cpu;
    case '結構損壞':
      return OfficeBuilding;
    default:
      return Promotion;
  }
};

// 獲取圖片URL（模擬）
const getImageUrl = (index) => {
  // 這裡使用隨機圖片作為示例，實際應用中應該使用真實的圖片URL
  return `https://picsum.photos/800/600?random=${index}`;
};

// 搜尋處理
const handleSearch = () => {
  // 實際應用中這裡會調用API進行搜尋
  loading.value = true;
  setTimeout(() => {
    // 模擬API請求
    loading.value = false;
    // 重置分頁
    currentPage.value = 1;
  }, 500);
};

// 重置搜尋
const resetSearch = () => {
  searchForm.value = {
    type: '',
    location: '',
    status: '',
    dateRange: []
  };
  handleSearch();
};

// 新增處理
const handleAdd = () => {
  reportDialogVisible.value = true;
};

const handleReportSubmit = () => {
  // 處理表單提交邏輯
  console.log(reportForm.value);
  reportDialogVisible.value = false;
};

const handleImageUpload = (file, type) => {
  reportForm.value[type] = file;
};


// 查看處理
const handleView = (row) => {
  currentReport.value = row;
  viewDialogVisible.value = true;
};

// 分頁大小變更
const handleSizeChange = (val) => {
  pageSize.value = val;
};

// 當前頁變更
const handleCurrentChange = (val) => {
  currentPage.value = val;
};

// 生成模擬數據
const generateMockData = () => {
  const statuses = ['未處理', '處理中', '已修繕'];
  const types = ['電器設備', '水電管線', '結構損壞', '網路設備', '空調系統', '其他'];
  const locations = ['辦公室', '會議室', '廁所', '茶水間', '走廊', '停車場', '大廳'];
  
  const mockData = [];
  
  for (let i = 1; i <= 100; i++) {
    const randomDate = new Date(
      2025, 
      Math.floor(Math.random() * 12), 
      Math.floor(Math.random() * 28) + 1,
      Math.floor(Math.random() * 24),
      Math.floor(Math.random() * 60),
      Math.floor(Math.random() * 60)
    );
    
    const formattedDate = `${randomDate.getFullYear()}-${String(randomDate.getMonth() + 1).padStart(2, '0')}-${String(randomDate.getDate()).padStart(2, '0')} ${String(randomDate.getHours()).padStart(2, '0')}-${String(randomDate.getMinutes()).padStart(2, '0')}-${String(randomDate.getSeconds()).padStart(2, '0')}`;
    
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    
    mockData.push({
      id: i,
      type: types[Math.floor(Math.random() * types.length)],
      location: locations[Math.floor(Math.random() * locations.length)],
      description: `損壞描述 ${i}：設備無法正常運作，需要維修。`,
      reportTime: formattedDate,
      status: status,
      cost: status === '已修繕' ? Math.floor(Math.random() * 10000) + 500 : null
    });
  }
  
  return mockData;
};

// 組件掛載時初始化數據
onMounted(() => {
  loading.value = true;
  // 模擬API請求延遲
  setTimeout(() => {
    reportList.value = generateMockData();
    totalReports.value = reportList.value.length;
    loading.value = false;
  }, 1000);
});
</script>

<template>
  <div class="maintenance-dashboard">
    <!-- 頂部排行榜 -->
    <div class="ranking-section">
      <div class="section-header">
        <h2>維修事項排行榜</h2>
      </div>
      <div class="ranking-cards">
        <el-card v-for="(item, index) in topReportItems" :key="index" class="ranking-card">
          <div class="ranking-badge" :class="`rank-${index + 1}`">{{ index + 1 }}</div>
          <div class="ranking-content">
            <div class="ranking-icon">
              <el-icon :size="36" :class="`icon-type-${index + 1}`">
                <component :is="getIconForType(item.type)" />
              </el-icon>
            </div>
            <div class="ranking-info">
              <h3>{{ item.type }}</h3>
              <p class="location"><el-icon><Location /></el-icon> {{ item.location }}</p>
              <div class="ranking-stats">
                <el-progress 
                  :percentage="getPercentage(item.count)" 
                  :color="getRankColor(index)"
                  :show-text="false"
                  :stroke-width="8"
                />
                <span class="count-badge">{{ item.count }} 次通報</span>
              </div>
            </div>
          </div>
        </el-card>
      </div>
    </div>

    <!-- 中間搜尋欄 -->
    <div class="search-section">
      <div class="search-form">
        <el-form :inline="true" :model="searchForm" class="search-form-content">
          <el-form-item label="地點">
            <el-input v-model="searchForm.location" placeholder="請輸入地點" />
          </el-form-item>
          <el-form-item label="種類">
            <el-select v-model="searchForm.type" placeholder="請選擇種類" clearable>
              <el-option v-for="item in typeOptions" :key="item" :label="item" :value="item" />
            </el-select>
          </el-form-item>
          <el-form-item label="處理狀態">
            <el-select v-model="searchForm.status" placeholder="請選擇狀態" clearable>
              <el-option label="未處理" value="未處理" />
              <el-option label="處理中" value="處理中" />
              <el-option label="已修繕" value="已修繕" />
            </el-select>
          </el-form-item>
          <el-form-item label="通報時間">
            <el-date-picker
              v-model="searchForm.dateRange"
              type="daterange"
              range-separator="至"
              start-placeholder="開始日期"
              end-placeholder="結束日期"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSearch">
              <el-icon><Search /></el-icon> 搜尋
            </el-button>
            <el-button @click="resetSearch">
              <el-icon><RefreshRight /></el-icon> 重置
            </el-button>
          </el-form-item>
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
        <el-table-column prop="location" label="地點" width="120" />
        <el-table-column prop="type" label="種類" width="120" />
        <el-table-column 
          prop="truncatedDescription" 
          label="損壞描述" 
          show-overflow-tooltip
        />
        <el-table-column label="處理狀態" width="120">
          <template #default="scope">
            <el-tag
              :type="getStatusType(scope.row.status)"
              effect="light"
            >
              {{ scope.row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
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
      width="60%"
      destroy-on-close
    >
      <div v-if="currentReport" class="view-dialog-content">
        <div class="report-info">
          <h3>{{ currentReport.type }} - {{ currentReport.location }}</h3>
          <p class="description">{{ currentReport.description }}</p>
          <div class="report-details">
            <div class="detail-item">
              <span class="label">通報時間：</span>
              <span>{{ currentReport.reportTime }}</span>
            </div>
            <div class="detail-item">
              <span class="label">處理狀態：</span>
              <el-tag :type="getStatusType(currentReport.status)">
                {{ currentReport.status }}
              </el-tag>
            </div>
            <div class="detail-item">
              <span class="label">費用：</span>
              <span>{{ currentReport.cost ? `$${currentReport.cost}` : '尚未產生費用' }}</span>
            </div>
          </div>
        </div>
        
        <div class="image-section">
          <h4>損壞照片</h4>
          <div class="image-container">
            <div class="image-item">
              <el-image 
                :src="getImageUrl(1)" 
                fit="cover"
                :preview-src-list="[getImageUrl(1)]"
              >
                <template #error>
                  <div class="image-error">
                    <el-icon><Picture /></el-icon>
                    <span>圖片加載失敗</span>
                  </div>
                </template>
              </el-image>
              <div class="image-caption">圖片 1</div>
            </div>
            <div class="image-item">
              <el-image 
                :src="getImageUrl(2)" 
                fit="cover"
                :preview-src-list="[getImageUrl(2)]"
              >
                <template #error>
                  <div class="image-error">
                    <el-icon><Picture /></el-icon>
                    <span>圖片加載失敗</span>
                  </div>
                </template>
              </el-image>
              <div class="image-caption">圖片 2</div>
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
  background: linear-gradient(135deg, #6FB7B7 0%, #8ec5c5 50%, #6FB7B7 100%);
  min-height: 100vh;
  position: relative;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.section-header h2 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #303133;
}

/* 排行榜樣式 */
.ranking-section {
  width: 900px;
  margin: 0 auto 20px;
  background: linear-gradient(to bottom right, #ffffff, #f8f9fa);
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.5);
}

.ranking-cards {
  display: flex;
  gap: 20px;
}

.ranking-card {
  flex: 1;
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.3s;
  position: relative;
}

.ranking-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
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
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
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

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 0 10px;
}

.section-header h2 {
  font-size: 18px;
  color: #303133;
  margin: 0;
  font-weight: 600;
}

.search-section {
  background: linear-gradient(to right, #f8f9fa, #f1f3f5);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.5);
}

.search-form-content {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  justify-content: flex-start;
  align-items: center;
}
</style>