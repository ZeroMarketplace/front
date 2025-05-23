<template>
  <div class="category-tabs justify-md-center">
    <div
      v-for="(tab, idx) in tabs"
      :key="tab.label"
      :class="['category-tab', { active: idx === activeTab }]"
      @click="activeTab = idx"
    >
      <div class="tab-box">
        <span class="tab-icon">
          <img :src="tab.img" :alt="tab.label" />
        </span>
      </div>
      <span class="tab-label">{{ tab.label }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
const tabs = [
  { img: "img/categories/smartphone.png", label: "دیجیتال" },
  { img: "img/categories/tshirt.png", label: "پوشاک" },
  { img: "img/categories/grapes.png", label: "میوه و سبزیجات" },
  { img: "img/categories/clean-dishes.png", label: "خانه و آشپزخانه" },
  { img: "img/categories/heart-attack.png", label: "زیبایی و سلامت" },
  { img: "img/categories/scissors.png", label: "لوازم التحریر" },
];
const activeTab = ref(5);
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
</style>
