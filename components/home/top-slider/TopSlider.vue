<template>
  <div class="tslider-container">
    <!-- Custom Navigation Buttons -->
    <button class="tslider-prev-nav-btn">
      <v-icon class="">mdi-chevron-right</v-icon>
    </button>
    <button class="tslider-next-nav-btn">
      <v-icon class="">mdi-chevron-left</v-icon>
    </button>

    <Swiper
      :modules="[SwiperNavigation, SwiperPagination]"
      :navigation="{
        nextEl: '.tslider-next-nav-btn',
        prevEl: '.tslider-prev-nav-btn',
      }"
      :pagination="{ clickable: true }"
      class="custom-swiper"
      dir="rtl"
    >
      <swiper-slide v-for="(slide, index) in 2" :key="index">
        <div class="slide-content">
          <img src="/assets/images/01.png" class="slide-bg" />
        </div>
      </swiper-slide>

      <!-- Add more SwiperSlide components as needed -->
    </Swiper>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
.tslider-container {
  position: relative;
  border-radius: 32px;
  overflow: hidden;
}

.custom-swiper {
  width: 100%;
  height: 100%;
}
.slide-content {
  position: relative;
  width: 100%;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.slide-bg {
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
}

.slide-text {
  position: relative;
  z-index: 3;
  color: #fff;
  text-align: center;
}
.slide-text h2 {
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
}
.slide-text p {
  font-size: 2rem;
  font-weight: 500;
}
.tslider-prev-nav-btn,
.tslider-next-nav-btn {
  position: absolute;
  top: 50%;
  z-index: 10;
  color: #ffffff;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  font-size: 2rem;
  display: none;
  align-items: center;
  justify-content: center;
  transform: translateY(-50%);
  cursor: pointer;
}
.tslider-prev-nav-btn {
  right: 34px;
}
.tslider-next-nav-btn {
  left: 34px;
}
.custom-nav-btn:hover {
  background: #eee;
}

@media (min-width: 960px) {
  .slide-content {
    height: 400px;
  }
  .tslider-prev-nav-btn,
  .tslider-next-nav-btn {
    display: flex;
  }
}
</style>
