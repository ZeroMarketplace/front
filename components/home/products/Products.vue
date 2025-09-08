<template>
  <div class="products-container">
    <button class="t-products-prev-nav-btn">
      <v-icon class="">mdi-arrow-right</v-icon>
    </button>
    <button class="t-products-next-nav-btn">
      <v-icon class="">mdi-arrow-left</v-icon>
    </button>
    <div>
      <Swiper
        :breakpoints="config.breakpoints"
        :modules="[SwiperNavigation, SwiperPagination]"
        :navigation="{
          nextEl: '.t-products-next-nav-btn',
          prevEl: '.t-products-prev-nav-btn',
        }"
        class="custom-swiper"
        dir="rtl"
      >
        <swiper-slide v-for="product in products" :key="product._id">
          <home-products-product-item
            :product="product"
          ></home-products-product-item>
        </swiper-slide>
      </Swiper>
    </div>
  </div>
</template>

<script setup lang="ts">
type Product = {
  _id: string;
  title?: string;
  name?: string;
  files?: string[];
};

const { data: products } = await useAsyncData<Product[]>(
  "products-home-latest",
  () => useApiService.get("products/home/latest"),
  { default: () => [] }
);

const config = ref({
  auto: {
    delay: 1000,
    disableOnInteraction: false,
  },
  breakpoints: {
    "320": {
      slidesPerView: 1.2,
      spaceBetween: 20,
    },
    "410": {
      slidesPerView: 1.4,
      spaceBetween: 20,
    },
    "640": {
      slidesPerView: 1.4,
      spaceBetween: 20,
    },
    "768": {
      slidesPerView: 2.4,
      spaceBetween: 20,
    },
    "1024": {
      slidesPerView: 3.5,
      spaceBetween: 20,
    },
    "1200": {
      slidesPerView: 4.2,
      spaceBetween: 20,
    },
    "1400": {
      slidesPerView: 5,
      spaceBetween: 15,
    },
  },
});
</script>

<style scoped>
.products-container {
  position: relative;
  margin-top: 30px;
}
.t-products-prev-nav-btn,
.t-products-next-nav-btn {
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
.t-products-prev-nav-btn.swiper-button-disabled i,
.t-products-next-nav-btn.swiper-button-disabled i {
  color: #4242424d !important;
}

.t-products-prev-nav-btn {
  right: -44px;
}
.t-products-next-nav-btn {
  left: -44px;
}

@media (min-width: 960px) {
  .t-products-prev-nav-btn,
  .t-products-next-nav-btn {
    display: flex;
  }
}
</style>
