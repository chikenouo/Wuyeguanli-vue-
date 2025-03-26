<script setup>
import { ref } from 'vue';

const carouselImages = ref([
  { 
    url: 'https://picsum.photos/600/300?random=1', 
    alt: '社區景觀',
    title: '系統維護公告',
    description: '系統將於本週五進行例行維護與更新。'
  },
  { 
    url: 'https://picsum.photos/600/300?random=2', 
    alt: '社區設施',
    title: '新中心開放時間',
    description: '鴻息中心周一至周五開放時間！'
  },
  { 
    url: 'https://picsum.photos/600/300?random=3', 
    alt: '社區活動',
    title: '歡迎報名！',
    description: '社區年度活動開始報名'
  }
]);

const communityName = ref('悅來富');
const communityDescription = ref('位於城市精華地段的悅來富，是一座結合奢華與舒適的高端住宅社區，專為追求卓越生活品質的菁英打造。社區名稱取「越來越富」之意，象徵住戶財富與幸福雙雙攀升，成為人生勝利組的象徵。 悅來富的建築設計融合現代美學與頂級匠心工藝，外觀氣派典雅，展現不凡品味。社區採用低密度開發，提供寬敞戶型，並擁有 五星級公設，包括無邊際泳池、私人健身房、景觀中庭與貴賓會所，讓住戶盡享尊榮生活。 地理位置更是財富與繁華的交匯點，鄰近商業核心區、高端百貨、米其林餐廳及頂級學府，兼具便捷與尊貴氛圍。社區更引入24 小時智慧安防與雲端物業管理，打造安全無憂的居住環境。 選擇悅來富，不只是擁有一處住所，更是開啟一段極致奢華的富貴人生。這裡，是人生更上一層樓的起點。');
</script>

<template>
  <div class="community-entrance">
    <!-- 輪播區域 -->
    <div class="carousel-container">
      <el-carousel :interval="2000" type="card" height="240px">
        <el-carousel-item v-for="(item, index) in carouselImages" :key="index">
          <div class="carousel-item">
            <img :src="item.url" :alt="item.alt" class="carousel-image">
            <div class="carousel-overlay">
              <h2>{{ item.title }}</h2>
              <p>{{ item.description }}</p>
            </div>
          </div>
        </el-carousel-item>
      </el-carousel>
    </div>

    <!-- 社區介紹區域 -->
    <div class="community-info">
      <div class="info-content">
        <h1>{{ communityName }}</h1>
        <p>{{ communityDescription }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.community-entrance {
  display: flex;
  flex-direction: column;
  max-width: 900px;
  margin: 0 auto;
  padding: 15px;
  background-color: #7FB5B5;
  gap: 20px;
}

.carousel-container {
  padding: 10px;
}

.carousel-item {
  position: relative;
  height: 100%;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.carousel-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.carousel-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 15px;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.6));
  color: white;
  text-align: left;
}

.carousel-overlay h2 {
  margin: 0;
  font-size: 1.2rem;
  font-weight: 500;
  margin-bottom: 4px;
}

.carousel-overlay p {
  margin: 0;
  font-size: 0.9rem;
  opacity: 0.9;
}

/* 社區介紹區域樣式 */
.community-info {
  background-color: rgba(0, 0, 0, 0.8);
  border-radius: 8px;
  padding: 20px;
  margin: 0 10px;
}

.info-content {
  text-align: center;
  color: white;
}

.info-content h1 {
  font-size: 1.8rem;
  margin-bottom: 15px;
  font-weight: 500;
}

.info-content p {
  font-size: 1rem;
  line-height: 1.6;
  margin: 0;
  opacity: 0.9;
}

/* Element Plus 輪播樣式覆蓋 */
:deep(.el-carousel__item) {
  border-radius: 8px;
  overflow: hidden;
}

:deep(.el-carousel__item:not(.is-active)) {
  filter: brightness(0.6);
  transform: scale(0.85);
}

:deep(.el-carousel__container) {
  margin: 0 30px;
}

:deep(.el-carousel__arrow) {
  background-color: rgba(0, 0, 0, 0.3);
  border-radius: 50%;
  border: 2px solid white;
}

:deep(.el-carousel__arrow:hover) {
  background-color: rgba(0, 0, 0, 0.5);
}

/* 響應式設計 */
@media (max-width: 768px) {
  .community-entrance {
    padding: 10px;
  }

  .carousel-container {
    padding: 5px;
  }

  .carousel-overlay h2 {
    font-size: 1rem;
  }

  .carousel-overlay p {
    font-size: 0.8rem;
  }

  .community-info {
    padding: 15px;
  }

  .info-content h1 {
    font-size: 1.5rem;
  }

  .info-content p {
    font-size: 0.9rem;
  }

  :deep(.el-carousel__container) {
    margin: 0 20px;
  }
}
</style>