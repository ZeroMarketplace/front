<template>
  <div class="products-tab-container">
    <div>
      <h4 class="product-tabs-title text-center text-h6">بر اساس دسته بندی</h4>
    </div>
    <home-product-categories-category-tabs
      @category-change="handleCategoryChange"></home-product-categories-category-tabs>
    <div class="products-slider-outer py-10">
      <div class="products-slider-header flex-column flex-sm-row justify-center justify-sm-space-between px-10 mb-7">
        <v-menu offset-y>
          <template #activator="{ props }">
            <div class="products-slider-header-right cursor-pointer" v-bind="props">
              <v-icon size="small" class="filter-icon ml-1">mdi-filter-outline</v-icon>
              <span class="d-flex align-center">
                {{ filterOptions[selectedFilter] }}
                <v-icon size="small" color="#2323237D" class="mr-10">mdi-chevron-down</v-icon>
              </span>
            </div>
          </template>
          <v-list>
            <v-list-item v-for="(item, idx) in filterOptions" :key="item" @click="selectedFilter = idx"
              :class="['filter-menu-item', { active: selectedFilter === idx }]">
              <span>{{ item }}</span>
            </v-list-item>
          </v-list>
        </v-menu>
        <nuxt-link to="/product" class="d-flex align-center">
          <span class="show-more pt-4 pt-sm-0">
            مشاهده همه
            <v-icon size="small" color="#2323237D" class="pr-4">mdi-arrow-left</v-icon>
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

        <ClientOnly>
          <div v-if="productsLoading" class="products-loading">
            <div class="loading-grid">
              <div v-for="i in 6" :key="i" class="product-loading-item">
                <div class="loading-skeleton-image"></div>
                <div class="loading-skeleton-text-container">
                  <div class="loading-skeleton-text-title"></div>
                  <div class="loading-skeleton-text-price"></div>
                </div>
              </div>
            </div>
          </div>

          <div v-else-if="productsError" class="products-error">
            <p>{{ productsError }}</p>
            <button @click="refreshProductsManual()" class="retry-products-btn">
              تلاش مجدد
            </button>
          </div>

          <swiper v-else-if="products.length > 0" :modules="[SwiperNavigation]" :breakpoints="config.breakpoints"
            class="products-swiper py-2 px-2" :navigation="{
              nextEl: '.tab-products-next-nav-btn',
              prevEl: '.tab-products-prev-nav-btn',
            }">
            <swiper-slide v-for="product in products" :key="product._id">
              <ProductItem :product="product" />
            </swiper-slide>
          </swiper>

          <div v-else class="products-empty">
            <p>هیچ محصولی یافت نشد</p>
          </div>

          <template #fallback>
            <div class="products-loading">
              <div class="loading-grid">
                <div v-for="i in 6" :key="i" class="product-loading-item">
                  <div class="loading-skeleton-image"></div>
                  <div class="loading-skeleton-text-container">
                    <div class="loading-skeleton-text-title"></div>
                    <div class="loading-skeleton-text-price"></div>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </ClientOnly>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import ProductItem from "~/components/home/products/ProductItem.vue";
import { get } from "~/composables/useApiService";

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
  name: string;
  title: string;
  code: number;
  files: string[];
  dimensions?: {
    length: number;
    width: number;
  };
  _categories: string[];
  _brand: string;
  _unit: string;
  barcode?: string;
  iranCode?: string;
  weight?: number;
  tags?: string;
  properties?: Array<{
    title: string;
    value: string;
  }>;
  variants?: Array<{
    code: number;
    properties: Array<{
      _property: string;
      value: number;
      _id: string;
    }>;
    title: string;
    _id: string;
    price?: {
      consumer: number;
      store: number;
    };
  }>;
  content?: string;
  status: number;
  _user: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  createdAtJalali: string;
  updatedAtJalali: string;
};

const selectedCategoryId = ref<string | null>(null);
const {
  data: productsData,
  error: productsError,
  pending: productsLoading,
  refresh: refreshProducts,
} = await useAsyncData<Product[]>(
  () =>
    selectedCategoryId.value
      ? `products-category-${selectedCategoryId.value}`
      : "products-empty",
  async () => {
    if (!selectedCategoryId.value) {
      return [] as Product[];
    }
    return await useApiService.get<Product[]>(`products/category`, {
      categoryId: selectedCategoryId.value,
    });
  },
  {
    default: () => [] as Product[],
    watch: [selectedCategoryId],
    immediate: false,
  }
);

const products = computed(() => productsData.value || ([] as Product[]));

const handleCategoryChange = (categoryId: string) => {
  selectedCategoryId.value = categoryId;
};

const refreshProductsManual = () => {
  if (productsData.value) {
    refreshProducts();
  }
};

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

.products-loading {
  padding: 24px;
}

.loading-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.product-loading-item {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.loading-skeleton-image {
  width: 100%;
  height: 150px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  border-radius: 8px;
}

.loading-skeleton-text-container {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.loading-skeleton-text-title {
  width: 80%;
  height: 16px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  border-radius: 4px;
}

.loading-skeleton-text-price {
  width: 60%;
  height: 14px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  border-radius: 4px;
}

@keyframes loading {
  0% {
    background-position: 200% 0;
  }

  100% {
    background-position: -200% 0;
  }
}

.products-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  text-align: center;
  color: #666;
}

.products-error p {
  margin-bottom: 16px;
  font-size: 1rem;
}

.retry-products-btn {
  background: #e91e63;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.2s;
}

.retry-products-btn:hover {
  background: #c2185b;
}

.products-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  text-align: center;
  color: #999;
}

.products-empty p {
  font-size: 1rem;
}
</style>
