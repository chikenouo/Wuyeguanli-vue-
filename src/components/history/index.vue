<script setup>
import { ref, onMounted } from 'vue';

// 社區發展沿革數據
const timelineEvents = ref([
  {
    id: 1,
    year: '2000',
    title: '高端住宅啟航',
    description: '社區進行大規模規劃調整，轉型為高端住宅區，吸引中上層階級入住。建築設計融入歐式與現代風格，提供更寬敞的居住空間與完善的社區配套設施，提升住戶的居住品質與生活品味。',
    image: 'https://upload.wikimedia.org/wikipedia/zh/3/3a/Chiikawa.jpeg'
  },
  {
    id: 2,
    year: '2005',
    title: '會所正式啟用',
    description: '社區專屬會所正式落成，內設高級健身房、恆溫游泳池、高端宴會廳與私人休閒空間，提供住戶全方位的社交與健康服務，讓社區生活更具質感與尊榮感。',
    image: 'https://i0.wp.com/chiikawahk.com/wp-content/uploads/2024/09/image-12-1024x575.png?resize=1024%2C575&ssl=1'
  },
  {
    id: 3,
    year: '2012',
    title: '智能安防升級 ',
    description: '為提升住戶安全，社區全面升級智慧安防系統，引進24小時監控、人臉識別門禁與智慧巡邏機器人，確保住戶能夠享受無憂無慮的尊貴生活環境。',
    image: 'https://p3-pc-sign.douyinpic.com/tos-cn-i-0813/oYT4ztIgAh9CIcyByAygfCXEE1emAADWDAEAd6~tplv-dy-aweme-images:q75.webp?biz_tag=aweme_images&from=327834062&lk3s=138a59ce&s=PackSourceEnum_SEARCH&sc=image&se=false&x-expires=1743984000&x-signature=wCTd1nKtLKQbjh%2B4GKWZE4%2FK14E%3D'
  },
  {
    id: 4,
    year: '2018',
    title: '綠化景觀改造',
    description: '社區推動大規模綠化改造計畫，增設空中花園、中央生態公園與環保步道，打造低碳、宜居的高端綠色社區，讓住戶在繁華都市中擁有一片靜謐的自然綠洲。',
    image: 'https://i0.wp.com/chiikawahk.com/wp-content/uploads/2024/01/image-18-1024x504.png?resize=1024%2C504&ssl=1'
  },
  {
    id: 5,
    year: '2025',
    title: '智慧社區啟動 ',
    description: '社區全面導入 AI 智慧管理系統，整合智能家居、無人車接駁、雲端物業管理與智慧能源控制，讓住戶享受最先進的便捷生活，開啟未來智慧豪宅的新時代。',
    image: 'https://d1grca2t3zpuug.cloudfront.net/2024/07/66a8b2af64dc1-870x586.webp'
  }
]);

// 社區名人數據
const famousPeople = ref([
  {
    id: 1,
    name: '吉伊卡哇',
    englishName: 'ちいかわ',
    photo: 'https://img.shoplineapp.com/media/image_clips/663c6333a1cc270011604bc1/original.jpg?1715233587',
    specialty: '主委'
  },
  {
    id: 2,
    name: '烏薩奇',
    englishName: 'うさぎ',
    photo:'https://img.shoplineapp.com/media/image_clips/663c8aebb455500019558155/original.jpg?1715243755',
    specialty: '副主委'
  },
  {
    id: 3,
    name: '小八',
    englishName: '(ハチワレ)',
    photo: 'https://img.shoplineapp.com/media/image_clips/663c633b4e4ee000171971aa/original.jpg?1715233595',
    specialty: '財務委員'
  },
  {
    id: 4,
    name: '小桃鼠',
    englishName: 'モモンガ',
    photo: 'https://img.shoplineapp.com/media/image_clips/663c634aefa4ea00118ae417/original.jpg?1715233609',
    specialty: '監察委員'
  },
]);

// 當前選中的時間軸事件
const activeTimelineEvent = ref(timelineEvents.value[0]);

// 選擇時間軸事件
const selectTimelineEvent = (event) => {
  activeTimelineEvent.value = event;
};

onMounted(() => {
  // 頁面加載完成後的初始化操作
  console.log('社區歷史頁面已加載');
});
</script>

<template>
  <div class="community-history-container">
    <!-- 頁面標題 -->
    <h1 class="page-title">社區歷史</h1>
    
    <!-- 上方區塊：社區發展沿革時間軸 -->
    <div class="timeline-section">
      <h2 class="section-title">發展沿革</h2>
      
      <!-- 橫向時間軸 -->
      <div class="horizontal-timeline">
        <el-row>
          <el-col :span="24">
            <div class="timeline-navigation">
              <div 
                v-for="event in timelineEvents" 
                :key="event.id" 
                class="timeline-node"
                :class="{ 'active': activeTimelineEvent.id === event.id }"
                @click="selectTimelineEvent(event)"
              >
                <div class="year-marker">{{ event.year }}</div>
                <div class="node-dot"></div>
                <div class="event-title">{{ event.title }}</div>
              </div>
            </div>
          </el-col>
        </el-row>
        
        <!-- 選中事件的詳細內容 -->
        <div class="timeline-content">
          <el-card class="timeline-card">
            <el-row :gutter="20">
              <el-col :md="12" :sm="24">
                <el-image 
                  :src="activeTimelineEvent.image" 
                  fit="cover"
                  class="timeline-image"
                />
              </el-col>
              <el-col :md="12" :sm="24">
                <div class="timeline-details">
                  <h3>{{ activeTimelineEvent.title }} ({{ activeTimelineEvent.year }})</h3>
                  <p>{{ activeTimelineEvent.description }}</p>
                </div>
              </el-col>
            </el-row>
          </el-card>
        </div>
      </div>
    </div>
    
    <el-divider />
    
    <!-- 下方區塊:名單部分 -->
    <div class="famous-people-section">
      <h2 class="section-title">管委會名單</h2>
      
      <el-row :gutter="20">
        <el-col 
          v-for="person in famousPeople" 
          :key="person.id" 
          :xs="24" 
          :sm="12" 
          :md="8" 
          :lg="6" 
          class="person-col"
        >
          <el-card class="person-card" shadow="hover">
            <div class="person-image-container">
              <el-image 
                :src="person.photo" 
                fit="cover"
                class="person-image"
              />
            </div>
            <div class="person-info">
              <h3 class="person-name">{{ person.name }}<span class="english-name">{{ person.englishName }}</span></h3>
              <div class="person-specialty">{{ person.specialty }}</div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<style scoped>
.community-history-container {
  padding: 20px;
  background: linear-gradient(135deg, #6FB7B7 0%, #8ec5c5 50%, #6FB7B7 100%);
  min-height: 100vh;
  position: relative;
}

.page-title {
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

.section-title {
  font-size: 24px;
  margin-bottom: 20px;
  color: #333;
  position: relative;
  padding-left: 15px;
}

.section-title::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 5px;
  height: 24px;
  background-color: #409EFF;
  border-radius: 2px;
}

/* 時間軸樣式 */
.timeline-section {
  width: 900px;
  margin: 0 auto 40px;
  background: linear-gradient(to bottom right, #ffffff, #f8f9fa);
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.5);
}

.horizontal-timeline {
  position: relative;
  padding: 20px 0;
}

.timeline-navigation {
  display: flex;
  justify-content: space-between;
  position: relative;
  margin-bottom: 30px;
}

.timeline-navigation::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 2px;
  background-color: #E4E7ED;
  z-index: 1;
}

.timeline-node {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  z-index: 2;
  cursor: pointer;
  transition: all 0.3s;
}

.node-dot {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background-color: #E4E7ED;
  border: 2px solid #fff;
  margin: 10px 0;
  transition: all 0.3s;
}

.timeline-node.active .node-dot {
  background-color: #409EFF;
  transform: scale(1.2);
}

.year-marker {
  font-weight: bold;
  color: #606266;
  transition: all 0.3s;
}

.event-title {
  font-size: 14px;
  color: #606266;
  text-align: center;
  transition: all 0.3s;
}

.timeline-node.active .year-marker,
.timeline-node.active .event-title {
  color: #409EFF;
  font-weight: bold;
}

.timeline-content {
  margin-top: 20px;
}

.timeline-card {
  border-radius: 8px;
  overflow: hidden;
}

.timeline-image {
  width: 100%;
  height: 250px;
  border-radius: 4px;
}

.timeline-details {
  padding: 10px;
}

.timeline-details h3 {
  margin-top: 0;
  color: #303133;
}

/* 名人表樣式 */
.famous-people-section {
  width: 900px;
  margin: 40px auto 0;
  background: linear-gradient(to bottom right, #ffffff, #f8f9fa);
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.5);
}

.person-col {
  margin-bottom: 20px;
}

.person-card {
  height: 100%;
  display: flex;
  flex-direction: column;
  transition: transform 0.3s;
}

.person-card:hover {
  transform: translateY(-5px);
}

.person-image-container {
  overflow: hidden;
  border-radius: 4px 4px 0 0;
}

.person-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  transition: transform 0.3s;
}

.person-card:hover .person-image {
  transform: scale(1.05);
}

.person-info {
  padding: 15px;
  text-align: center;
  border-top: 1px solid #f0f0f0;
}

.person-name {
  margin: 0 0 8px 0;
  font-size: 16px;
  color: #303133;
}

.english-name {
  font-size: 14px;
  color: #606266;
  margin-left: 5px;
}

.person-specialty {
  font-size: 14px;
  color: #606266;
  line-height: 1.4;
}

/* 響應式調整 */
@media (max-width: 768px) {
  .timeline-navigation {
    overflow-x: auto;
    justify-content: flex-start;
    padding-bottom: 10px;
  }
  
  .timeline-node {
    margin-right: 40px;
    flex-shrink: 0;
  }
  
  .timeline-details {
    margin-top: 15px;
  }
}
</style>