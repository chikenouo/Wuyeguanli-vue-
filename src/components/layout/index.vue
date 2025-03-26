<script setup>
import { ref, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'

const router = useRouter()
const isCollapsed = ref(false)
const loginName = ref('')

const toggleSidebar = () => {
  isCollapsed.value = !isCollapsed.value
}

const logout = () => {
  //彈出確認框, 如果確認, 則退出登錄, 跳轉到登錄頁面
  ElMessageBox.confirm('確認退出登錄嗎?', '提示', {
    confirmButtonText: '確定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    //確認, 則清空登錄信息
    ElMessage.success('退出登錄成功')
    localStorage.removeItem('loginUser')
    router.push('/login') //跳轉到登錄頁面
  })
}

const changePassword = () => {
  router.push({ name: 'changePassword' })
}

// 監聽 isCollapsed 變化，動態調整 main 區域的邊距
watch(isCollapsed, (newValue) => {
  const mainElement = document.querySelector('.modern-main')
  if (mainElement) {
    mainElement.classList.toggle('with-collapsed', newValue)
  }
})

//定義鉤子函數, 獲取登錄用戶名
onMounted(() => {
    const loginUser = JSON.parse(localStorage.getItem('loginUser') || 'null')
    if (loginUser && loginUser.token) {
        loginName.value = loginUser.name
    } else {
        // 未登入時不執行其他邏輯，直接重定向
        ElMessage.warning('請先登入')
        router.push('/login')
    }
})

</script>

<template>
  <div class="app-layout">
    <!-- 固定標題 -->
    <el-header class="modern-header">
      <div class="header-content">
        <div class="logo-container">
          <el-icon class="logo-icon"><OfficeBuilding /></el-icon>
          <span class="title">悅來富</span>
        </div>
        <div class="right-tools">
            <span>
              <a href="javascript:void(0)" @click="logout">
                <el-icon><SwitchButton /></el-icon> 登出 【{{ loginName }}】
              </a>
            </span>
        </div>
      </div>
    </el-header>

    <!-- 固定導航欄 -->
    <div class="sidebar-container">
      <el-aside :width="isCollapsed ? '64px' : '240px'" class="modern-sidebar">
        <div class="sidebar-header">
          <button class="collapse-button" @click="toggleSidebar">
            <el-icon v-if="isCollapsed"><ArrowRight /></el-icon>
            <el-icon v-else><ArrowLeft /></el-icon>
          </button>
        </div>
        <el-menu
          router
          :collapse="isCollapsed"
          class="modern-menu"
          :collapse-transition="false"
          background-color="transparent"
        >
          <el-menu-item index="/homepage">
            <el-icon><HomeFilled /></el-icon>
            <span>首頁</span>
          </el-menu-item>
          <el-menu-item index="/dashboard">
            <el-icon><Bell /></el-icon>
            <span>公告欄</span>
          </el-menu-item>
          <el-menu-item index="/rule">
            <el-icon><Document /></el-icon>
            <span>規約</span>
          </el-menu-item>
          <el-menu-item index="/history">
            <el-icon><OfficeBuilding /></el-icon>
            <span>社區資訊</span>
          </el-menu-item>
          <el-menu-item index="/parking">
            <el-icon><Van /></el-icon>
            <span>停車資訊</span>
          </el-menu-item>
          <el-menu-item index="/workshop">
            <el-icon><Tools /></el-icon>
            <span>維修履歷</span>
          </el-menu-item>
          <el-menu-item index="/fee">
            <el-icon><Money /></el-icon>
            <span>管理費用</span>
          </el-menu-item>
          <el-menu-item index="/directory">
            <el-icon><Phone /></el-icon>
            <span>通訊錄</span>
          </el-menu-item>
          <el-menu-item index="/settings">
            <el-icon><Setting /></el-icon>
            <span>設定</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
    </div>

    <!-- 主要內容區域，獨立滾動 -->
    <el-main class="modern-main">
      <router-view />
    </el-main>
  </div>
</template>

<style scoped>
.app-layout {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial,
    sans-serif;
  height: 100vh;
  background-color: #ffffff;
  display: flex;
  flex-direction: column; /* 確保垂直堆疊 */
}

/* 固定標題 */
.modern-header {
  background-color: #ffffff;
  height: 60px;
  padding: 0;
  border-bottom: 1px solid #e0e0e0;
  position: fixed; /* 固定在頂部 */
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000; /* 確保在其他元素之上 */
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  padding: 0 20px;
}

.logo-container {
  display: flex;
  align-items: center;
}

.logo-icon {
  font-size: 24px;
  color: #7fb5b5;
  margin-right: 12px;
}

.title {
  color: #333333;
  font-size: 20px;
  font-weight: 600;
}

.right-tools {
  display: flex;
  align-items: center;
  gap: 12px;
}

.modern-button {
  display: flex;
  align-items: center;
  background-color: transparent;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  color: #606266;
  padding: 6px 12px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.modern-button:hover {
  background-color: #f5f5f5;
  border-color: #7fb5b5;
  color: #7fb5b5;
}

.modern-button .el-icon {
  margin-right: 6px;
  font-size: 16px;
}

.modern-button.logout {
  color: #f56c6c;
  border-color: #fef0f0;
  background-color: #fef0f0;
}

.modern-button.logout:hover {
  background-color: #fff1f1;
  border-color: #f56c6c;
}

/* 固定導航欄 */
.sidebar-container {
  position: fixed; /* 固定導航欄 */
  top: 60px; /* 標題高度 */
  left: 0;
  height: calc(100vh - 60px); /* 減去標題高度 */
  z-index: 1000;
}

.modern-sidebar {
  background-color: #f8f8f8;
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow-x: hidden;
  border-right: 1px solid #e0e0e0;
  height: 100%; /* 填滿容器高度 */
}

.sidebar-header {
  padding: 16px;
  border-bottom: 1px solid #e0e0e0;
}

.collapse-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background-color: #7fb5b5;
  color: #ffffff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.collapse-button:hover {
  background-color: #6ca3a3;
}

/* Menu Styles */
.modern-menu {
  border-right: none;
}

.modern-menu:not(.el-menu--collapse) {
  width: 240px;
}

.el-menu--collapse {
  width: 64px;
}

.el-menu-item {
  padding: 0 16px !important;
  height: 40px !important;
  line-height: 40px !important;
  margin: 4px 8px;
  border-radius: 6px;
  color: #606266 !important;
}

.el-menu-item:hover,
.el-menu-item.is-active {
  background-color: rgba(127, 181, 181, 0.1) !important;
  color: #7fb5b5 !important;
}

.el-menu-item:hover::before,
.el-menu-item.is-active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 4px;
  background: #7fb5b5;
  border-radius: 0 2px 2px 0;
}

.el-menu-item .el-icon {
  color: #909399;
  margin-right: 12px;
  font-size: 18px;
}

.el-menu-item:hover .el-icon,
.el-menu-item.is-active .el-icon {
  color: #7fb5b5;
}

/* 主要內容區域 */
.modern-main {
  background-color: #7fb5b5;
  padding: 24px;
  margin-left: 240px; /* 預設導航欄寬度 */
  margin-top: 60px; /* 標題高度 */
  height: calc(100vh - 60px); /* 減去標題高度 */
  overflow-y: auto; /* 啟用滾動 */
}

.modern-main.with-collapsed {
  margin-left: 64px; /* 收起時的寬度 */
}

/* Animation for menu items */
.el-menu-item {
  transition: all 0.3s ease;
}

.el-menu-item:hover {
  transform: translateX(5px);
}

/* Ensure text doesn't overflow in collapsed state */
.el-menu-item span {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.el-menu--collapse .el-menu-item span {
  display: none;
}

.el-menu--collapse .el-menu-item .el-icon {
  margin: 0;
}
</style>
