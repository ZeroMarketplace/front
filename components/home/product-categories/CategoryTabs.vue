<template>
  <div class="category-tabs-wrapper">
    <div v-if="pending" class="category-tabs justify-md-center">
      <div class="category-tab-loading" v-for="i in 6" :key="i">
        <div class="tab-box loading">
          <div class="loading-skeleton"></div>
        </div>
        <div class="tab-label loading">
          <div class="loading-skeleton-text"></div>
        </div>
      </div>
    </div>

    <div v-else-if="error" class="category-tabs-error">
      <p>خطا در بارگذاری دسته‌بندی‌ها</p>
      <button @click="refresh()" class="retry-btn">تلاش مجدد</button>
    </div>

    <div v-else-if="tabs.length > 0" class="category-tabs justify-md-center">
      <div
        v-for="(tab, idx) in tabs"
        :key="tab.id"
        :class="['category-tab', { active: idx === activeTab }]"
        @click="handleCategoryClick(idx)"
      >
        <div class="tab-box">
          <span class="tab-icon">
            <img :src="tab.img" :alt="tab.label" />
          </span>
        </div>
        <span class="tab-label">{{ tab.label }}</span>
      </div>
    </div>

    <div v-else class="category-tabs-empty">
      <p>هیچ دسته‌بندی‌ای یافت نشد</p>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Category {
  _id: string;
  title: string;
  code: number;
  profitPercent: number;
  _properties: string[];
  status: number;
  _user: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  createdAtJalali: string;
  updatedAtJalali: string;
}

interface CategoryResponse {
  list: Category[];
  total: number;
}

interface Tab {
  img: string;
  label: string;
  id: string;
}

const emit = defineEmits<{
  categoryChange: [categoryId: string];
}>();

const activeTab = ref(0);

const {
  data: categoriesResponse,
  error,
  pending,
  refresh,
} = await useAsyncData<CategoryResponse>(
  "categories-home-slider",
  async () => {
    try {
      return await useApiService.get<CategoryResponse>(
        "categories/home-slider"
      );
    } catch (err) {
      console.error("Error fetching categories:", err);
      return { list: [], total: 0 };
    }
  },
  {
    default: () => ({ list: [], total: 0 }),
    server: true,
  }
);

const tabs = computed(() => {
  const categories = categoriesResponse.value?.list || [];
  return categories.map((category: Category) => ({
    img: "img/categories/tshirt.png",
    label: category.title,
    id: category._id,
  }));
});

watch(
  () => tabs.value,
  (newTabs) => {
    if (newTabs && newTabs.length > 0 && activeTab.value === 0) {
      emit("categoryChange", newTabs[0].id);
    }
  },
  { immediate: true }
);

const handleCategoryClick = (idx: number) => {
  activeTab.value = idx;
  if (tabs.value && tabs.value[idx]) {
    emit("categoryChange", tabs.value[idx].id);
  }
};

const getDefaultImage = () => {
  return "img/categories/tshirt.png";
};
</script>

<style scoped>
.category-tabs {
  display: flex;
  align-items: flex-start;
  gap: 32px;
  padding: 32px 0 0 0;
  border-radius: 0 0 18px 18px;
  overflow-x: auto;
  overflow-y: hidden;
}
.category-tab {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  background: transparent;
  border: none;
  cursor: pointer;
  position: relative;
}
.tab-box {
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  border: 1.5px solid #dbdbdb;
  border-radius: 18px;
  width: 90px;
  height: 90px;
  transition: border 0.2s;
  position: relative;
}
.category-tab.active .tab-box {
  border: 1.5px solid #e91e63;
}
.tab-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}
.tab-icon img {
  width: 44px;
  height: 44px;
  object-fit: contain;
}
.tab-label {
  color: #424242b2;
  font-size: 1.05rem;
  margin-top: 18px;
  text-align: center;
  white-space: nowrap;
}
.category-tab.active .tab-label {
  color: #ec407a;
  font-weight: 500;
}
.category-tab.active .tab-label::after {
  content: "";
  display: block;
  margin: 17px auto 0 auto;
  width: 56px;
  height: 6px;
  border-radius: 3px;
  background: #ec407a;
}

.category-tabs-wrapper {
  width: 100%;
}

.category-tab-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  margin: 0 16px;
}

.tab-box.loading {
  background: #f5f5f5;
  border: 1.5px solid #e0e0e0;
}

.loading-skeleton {
  width: 44px;
  height: 44px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  border-radius: 4px;
}

.loading-skeleton-text {
  width: 60px;
  height: 16px;
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

.category-tabs-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  text-align: center;
  color: #666;
}

.category-tabs-error p {
  margin-bottom: 16px;
  font-size: 1rem;
}

.retry-btn {
  background: #e91e63;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.2s;
}

.retry-btn:hover {
  background: #c2185b;
}

.category-tabs-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  text-align: center;
  color: #999;
}

.category-tabs-empty p {
  font-size: 1rem;
}
</style>
