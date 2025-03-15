import axios from 'axios'
import { ElMessage } from 'element-plus'
import router from '../router'
// 負責通用的 HTTP 請求配置
// 建立 axios 實例（在 request.js 中）並不代表立即取得 API 的資料。
// 建立實例只是配置一個 axios 物件，讓它可以方便地發送 HTTP 請求。
// 你可以把它想像成準備好了一支「API 連接槍」，但還沒有發射，也就是還沒有真正發送請求去獲取資料。

// 什麼時候取得資料？ 
// 只有當你使用 request 物件調用 get、post、put、delete 等方法時，才會真正發送請求並從 API 取得資料。
// 例如，在 emp.js 中，queryPageApi 函數會使用 request.get 來獲取員工列表資料。

//创建axios实例对象
const request = axios.create({
  baseURL: 'http://localhost:8585',
  timeout: 200000
})

request.interceptors.request.use(
  (config) => {
      let loginUser = JSON.parse(localStorage.getItem('loginUser'))
      if (loginUser && loginUser.token) {
          config.headers.Authorization = `Bearer ${loginUser.token}`
      }
      return config
  }
)

request.interceptors.response.use(
  (response) => response.data,
  (error) => {
      if (error.response) {
          const status = error.response.status
          if (status === 401) {
              ElMessage.error('登入失效，請重新登入')
              router.push('/login')
              return Promise.reject(new Error('未授權'))
          }
          ElMessage.error('接口訪問異常')
      } else {
          ElMessage.error('網絡錯誤')
      }
      return Promise.reject(error)
  }
)

export default request