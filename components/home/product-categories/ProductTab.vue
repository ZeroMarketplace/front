<template>
  <div class="products-tab-container">
    <div>
      <h4 class="product-tabs-title text-center text-h6">بر اساس دسته بندی</h4>
    </div>
    <home-product-categories-category-tabs></home-product-categories-category-tabs>
    <div class="products-slider-outer py-10">
      <div
        class="products-slider-header flex-column flex-sm-row justify-center justify-sm-space-between px-10 mb-7"
      >
        <v-menu offset-y>
          <template #activator="{ props }">
            <div
              class="products-slider-header-right cursor-pointer"
              v-bind="props"
            >
              <v-icon size="small" class="filter-icon ml-1"
                >mdi-filter-outline</v-icon
              >
              <span class="d-flex align-center">
                {{ filterOptions[selectedFilter] }}
                <v-icon size="small" color="#2323237D" class="mr-10"
                  >mdi-chevron-down</v-icon
                >
              </span>
            </div>
          </template>
          <v-list>
            <v-list-item
              v-for="(item, idx) in filterOptions"
              :key="item"
              @click="selectedFilter = idx"
              :class="['filter-menu-item', { active: selectedFilter === idx }]"
            >
              <span>{{ item }}</span>
            </v-list-item>
          </v-list>
        </v-menu>
        <nuxt-link to="/" class="d-flex align-center">
          <span class="show-more pt-4 pt-sm-0">
            مشاهده همه
            <v-icon size="small" color="#2323237D" class="pr-4"
              >mdi-arrow-left</v-icon
            >
          </span>
        </nuxt-link>
      </div>
      <div class="mx-10">
        <button class="tab-products-prev-nav-btn">
          <v-icon class="">mdi-arrow-right</v-icon>
        </button>
        <button class="tab-products-next-nav-btn">
          <v-icon class="">mdi-arrow-left</v-icon>
        </button>
        <Swiper
          :modules="[SwiperNavigation]"
          :breakpoints="config.breakpoints"
          class="products-swiper py-2 px-2"
          :navigation="{
            nextEl: '.tab-products-next-nav-btn',
            prevEl: '.tab-products-prev-nav-btn',
          }"
        >
          <swiper-slide v-for="product in products" :key="product._id">
            <ProductItem :product="product" />
          </swiper-slide>
        </Swiper>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import ProductItem from "~/components/home/products/ProductItem.vue";

const filterOptions = [
  "مرتبط‌ترین",
  "کمترین قیمت",
  "بیشترین قیمت",
  "پیشنهاد خریداران",
  "بیشترین فروش",
  "بیشترین تخفیف",
];
const selectedFilter = ref(0);

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
      slidesPerView: 1,
      spaceBetween: 15,
    },
    "410": {
      slidesPerView: 1,
      spaceBetween: 30,
    },
    "640": {
      slidesPerView: 2.2,
      spaceBetween: 20,
    },
    "768": {
      slidesPerView: 3.2,
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
.tab-products-prev-nav-btn,
.tab-products-next-nav-btn {
  width: 39px;
  height: 39px;
  background: #ffffff;
  border-radius: 50%;
  box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
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
.tab-products-prev-nav-btn.swiper-button-disabled i,
.tab-products-next-nav-btn.swiper-button-disabled i {
  color: #4242424d !important;
}

@media (min-width: 960px) {
  .tab-products-prev-nav-btn,
  .tab-products-next-nav-btn {
    display: flex;
  }
}

.tab-products-prev-nav-btn {
  right: -1%;
}
.tab-products-next-nav-btn {
  left: -1%;
}
.products-tab-container {
  margin-top: 70px;
  margin-bottom: 30px;
}

.products-slider-outer {
  background: #fff;
  border-radius: 32px;
  padding: 32px 0 32px 0;
  position: relative;
}
.products-slider-header {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}
.products-slider-header-right {
  display: flex;
  align-items: center;
  gap: 8px;
}
.filter-menu-item {
  font-size: 1rem;
  color: #232323;
  font-weight: 400;
  padding: 0 16px;
  min-width: 120px;
  justify-content: center;
}
.filter-menu-item.active {
  color: #e91e63;
  font-weight: 700;
  position: relative;
}
.filter-menu-item.active span {
  position: relative;
}
.filter-menu-item.active span::after {
  content: "";
  display: block;
  width: 80%;
  height: 3px;
  background: #e91e63;
  border-radius: 2px;
  margin: 4px 0 0 auto;
}
.products-swiper {
  padding: 0 24px;
}
</style>
