import request from "@/utils/request";
//因為在 request.js 中設定了 baseURL: '/api'，
// 所以在 api.js 中使用 request.post('/emps', emp) 時，
// axios 會自動將 /api 作為基礎路徑，與 /emps 拼接在一起，最終的請求網址就會變成 /api/emps。


// 住戶登入
export const loginApi = (data) => request.post('/api/residentLogin', data)