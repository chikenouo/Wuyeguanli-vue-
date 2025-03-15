import request from "@/utils/request";
//因為在 request.js 中設定了 baseURL: '/api'，
// 所以在 api.js 中使用 request.post('/emps', emp) 時，
// axios 會自動將 /api 作為基礎路徑，與 /emps 拼接在一起，最終的請求網址就會變成 /api/emps。

// 搜尋全部
export const DashBoardSearchAll = (dashBoardList) => request.get(`/api/dashboards/getAll`,dashBoardList)
  

export const ruleSearchAll = (date, sort, header,content) => {
    const ruleList = {
      date: "",
      sort: "",
      header: "",
      content:"",
    }
    if (date) {
      ruleList.date = date;
    }
    if (sort) {
      ruleList.sort = sort;
    }
    if (header) {
      ruleList.header = header;
    }
    if (content) {
        ruleList.content = content;
    }
    return  request.get(`/api/rules/getAll`,ruleList)
  }

export const feeSearchById= () => request.get('/api/fees/getById')