import { createApp } from 'vue'

import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import zhTw from 'element-plus/es/locale/lang/zh-tw'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

import './assets/main.css'

const app = createApp(App)
// 功能：創建一個 Vue 應用實例，並將根組件 App.vue 作為起點。
// 用途：初始化應用，準備掛載到 DOM。
// 說明：這是應用啟動的核心步驟，app 是後續配置的基礎物件。

app.use(router)
app.use(ElementPlus, {locale: zhTw})
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.mount('#app')
// 功能：將 Vue 應用掛載到 HTML 的指定 DOM 元素。
// 用途：將應用渲染到頁面，通常對應 index.html 中的 <div id="app"></div>。
// 說明：這是啟動應用的最後一步，應用開始運行並顯示在瀏覽器中。