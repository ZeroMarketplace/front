<template>
  <div class="featured-products-container mx-md-10">
    <div class="mb-7">
      <h4 class="product-tabs-title text-center text-h6">محصولات ویژه</h4>
    </div>
    <div class="position-relative">
      <button class="featured-products-prev-nav-btn">
        <v-icon class="">mdi-arrow-right</v-icon>
      </button>
      <button class="featured-products-next-nav-btn">
        <v-icon class="">mdi-arrow-left</v-icon>
      </button>
      <Swiper
        :breakpoints="config.breakpoints"
        :modules="[SwiperNavigation, SwiperPagination]"
        :navigation="{
          nextEl: '.featured-products-next-nav-btn',
          prevEl: '.featured-products-prev-nav-btn',
        }"
        class="custom-swiper"
        dir="rtl"
      >
        <swiper-slide v-for="(slide, index) in 10" :key="index">
          <home-featured-products-product-item></home-featured-products-product-item>
        </swiper-slide>
      </Swiper>
    </div>
  </div>
</template>

<script setup lang="ts">
const config = ref({
  auto: {
    delay: 1000,
    disableOnInteraction: false,
  },
  breakpoints: {
    "320": {
      slidesPerView: 1.1,
      spaceBetween: 5,
    },
    "410": {
      slidesPerView: 1.1,
      spaceBetween: 20,
    },
    "640": {
      slidesPerView: 1.4,
      spaceBetween: 20,
    },
    "768": {
      slidesPerView: 1.6,
      spaceBetween: 20,
    },
    "1024": {
      slidesPerView: 1.9,
      spaceBetween: 20,
    },
    "1200": {
      slidesPerView: 3,
      spaceBetween: 20,
    },
    "1400": {
      slidesPerView: 3,
      spaceBetween: 15,
    },
  },
});
</script>

<style scoped>
.featured-products-container {
  position: relative;
  margin-top: 70px;
}
.featured-products-prev-nav-btn,
.featured-products-next-nav-btn {
  position: absolute;
  top: 50%;
  z-index: 10;
  color: #424242;
  border: none;
  border-radius: 50%;
  font-size: 1rem;
  display: none;
  align-items: center;
  justify-content: center;
  transform: translateY(-50%);
  cursor: pointer;
}

@media (min-width: 960px) {
  .featured-products-prev-nav-btn,
  .featured-products-next-nav-btn {
    display: flex;
  }
}
.featured-products-prev-nav-btn.swiper-button-disabled i,
.featured-products-next-nav-btn.swiper-button-disabled i {
  color: #4242424d !important;
}

.featured-products-prev-nav-btn {
  right: -4%;
}
.featured-products-next-nav-btn {
  left: -4%;
}
</style>
