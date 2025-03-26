<script setup>
  import { ref,onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  import { ElMessage } from 'element-plus'
  import { loginApi } from '@/api/login'
  
  const router = useRouter()
  const formRef = ref(null)
  
  const loginForm = ref({
    identityNumber: '',
    password: ''
  })

  const login = async() => {
    const result = await loginApi(loginForm.value); 
    console.log(result)
    // 把帳號密碼給API
        if (result.code) {
          // 1. 提示信息
          ElMessage.success('登入成功')
          // 2. 存儲當前登入用戶的訊息
          localStorage.setItem('loginUser',JSON.stringify( result.data))
          // 3. 跳轉首頁
          router.push('/homepage')
          console.log(result.data)
        } else {
          ElMessage.error('登入失敗')
        }
  }
  

  // 表單驗證規則
  const rules = {
    username: [
      { required: true, message: '請輸入帳號!', trigger: 'submit' }
    ],
    password: [
      { required: true, message: '請輸入密碼!', trigger: 'submit' }
    ]
  }
  
 
  const handleSocialLogin = (platform) => {
    ElMessage.info(`使用 ${platform} 登入`)
  }

  onMounted(() => {
    const loginUser = JSON.parse(localStorage.getItem('loginUser') || 'null')
    if (loginUser && loginUser.token) {
        router.push('/homepage')
    }
})
  </script>

<template>
    <div class="login-container">
      <!-- 左側區域 -->
      <div class="login-left">
        <div class="left-content">
          <div class="image-box">
            <img src="/Doorman.png" alt="圖片加載中..." />
          </div>
          <h2>頂級奢華，尊榮人生</h2>
          <p>悅來富坐落於城市黃金地段，結合現代建築美學與頂級奢華設計，為尊貴住戶打造極致生活體驗。社區內擁有國際級會所、恆溫泳池、私人健身中心與空中花園，提供無與倫比的尊榮享受。鄰近高端購物中心、米其林餐廳與國際學府，讓品味與便捷兼得。這裡，不僅是一處居所，更是身份與品味的象徵。</p>
        </div>
      </div>
  
      <!-- 右側登入表單 -->
      <div class="login-right">
        <div class="form-wrapper">
          <h1>悅來富社區</h1>
  
          <el-form ref="formRef" :model="form" :rules="rules" @submit.prevent>
            <div class="form-group">
              <label>
                <span class="required">*</span>
                帳號
              </label>
              <el-form-item prop="username">
                <el-input v-model="loginForm.identityNumber" placeholder="請輸入帳號" />
              </el-form-item>
            </div>
  
            <div class="form-group">
              <label>
                <span class="required">*</span>
                密碼
              </label>
              <el-form-item prop="password">
                <el-input v-model="loginForm.password" type="password" placeholder="請輸入密碼" show-password />
              </el-form-item>
            </div>
  
            <div class="forgot-password">
              <a href="#">忘記密碼?</a>
            </div>
  
            <el-button class="sign-in-btn" @click="login">登入</el-button>
          </el-form>
  
          <div class="divider">or</div>
  
          <div class="social-buttons">
            <button class="social-btn" @click="handleSocialLogin('Google')">
              使用 Google 繼續
            </button>
            <button class="social-btn" @click="handleSocialLogin('Apple')">
              使用 Apple 繼續
            </button>
            <button class="social-btn" @click="handleSocialLogin('Facebook')">
              使用 Facebook 繼續
            </button>
            <button class="social-btn" @click="handleSocialLogin('Github')">
              使用 Github 繼續
            </button>
          </div>
  
          <div class="create-account">
            還沒有帳號嗎? <a href="#">點此註冊</a>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <style scoped>
  .login-container {
    display: flex;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
  }
  
  .login-left {
    flex: 1;
    background-color: #b5d1c2;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .left-content {
    text-align: center;
    color: white;
    width: 100%;
    max-width: 500px;
    padding: 0 20px;
  }
  
  .image-box {
    width: 280px;
    height: 280px;
    margin: 0 auto 30px;
    background: white;
    border-radius: 8px;
    overflow: hidden;
  }
  
  .image-box img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .left-content h2 {
    font-size: 32px;
    margin-bottom: 16px;
  }
  
  .left-content p {
    font-size: 16px;
    line-height: 1.5;
    margin-bottom: 24px;
  }
  
  .dots {
    display: flex;
    justify-content: center;
    gap: 8px;
  }
  
  .dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.5);
  }
  
  .dot.active {
    background: white;
  }
  
  .login-right {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .form-wrapper {
    width: 100%;
    max-width: 400px;
    padding: 0 40px;
  }
  
  .form-wrapper h1 {
    font-size: 32px;
    text-align: center;
    margin-bottom: 8px;
    color: #333;
  }
  
  .welcome-text {
    text-align: center;
    color: #666;
    margin-bottom: 32px;
  }
  
  .form-group {
    margin-bottom: 20px;
  }
  
  .form-group label {
    display: block;
    margin-bottom: 8px;
    color: #333;
  }
  
  .required {
    color: #ff4949;
    margin-right: 4px;
  }
  
  /* 移除 el-form-item 的預設 margin-bottom */
  :deep(.el-form-item) {
    margin-bottom: 0;
  }
  
  /* 自定義錯誤訊息樣式 */
  :deep(.el-form-item__error) {
    color: #ff4949;
    font-size: 12px;
    margin-top: 4px;
  }
  
  .forgot-password {
    text-align: right;
    margin: 8px 0 20px;
  }
  
  .forgot-password a {
    color: #666;
    text-decoration: none;
  }
  
  .sign-in-btn {
    width: 100%;
    height: 40px;
    background: #4a5568;
    color: white;
    border: none;
    border-radius: 4px;
  }
  
  .divider {
    text-align: center;
    position: relative;
    margin: 24px 0;
    color: #666;
  }
  
  .divider::before,
  .divider::after {
    content: '';
    position: absolute;
    top: 50%;
    width: calc(50% - 20px);
    height: 1px;
    background: #ddd;
  }
  
  .divider::before {
    left: 0;
  }
  
  .divider::after {
    right: 0;
  }
  
  .social-buttons {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  
  .social-btn {
    width: 100%;
    height: 40px;
    background: #0e3a3d;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: opacity 0.2s;
  }
  
  .social-btn:hover {
    opacity: 0.9;
  }
  
  .create-account {
    text-align: center;
    margin-top: 24px;
    color: #666;
  }
  
  .create-account a {
    color: #409eff;
    text-decoration: none;
  }
  
  :deep(.el-input__inner) {
    height: 40px;
  }
  </style>