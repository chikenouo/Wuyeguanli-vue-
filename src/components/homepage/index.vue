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

const communityName = ref('暖市');
const communityDescription = ref('臺灣南方最繁華的國際城市——高雄市，為民國98年（西元2009年）世界運動會主辦城市，因受海洋氣候調節，全年陽光普照、氣候宜人，有獨特的「海洋首都」特性。近年來大力推展觀光事業，已成為全臺最美麗的城市之一。高雄除了愛河、壽山、西子灣、蓮池潭、旗津、左營舊城等知名景點外，融合了福佬人、客家人、平埔族、鄒族、魯凱族、布農族、排灣族、以及眷村文化，是個「山、海、河港、人文、古跡」的城市。來到高雄，您不僅可以體驗自然生態、品嘗珍饈佳饌，還能欣賞客家美濃紙傘、內門宋江陣、大樹佛光山…等多元的民族文化，更擁有眾多的購物中心，及著名的觀光夜市，可說是全部旅遊元素一應俱全，值得您深度造訪。高雄人的熱情，就像南方和煦的陽光。誠摯的歡迎大家到高雄作客！');
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