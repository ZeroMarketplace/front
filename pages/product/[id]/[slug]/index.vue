<template>
  <v-container fluid>
    <div>
      <Breadcrumbs :items="breadcrumbs" />
    </div>

    <v-row>
      <v-col cols="12" md="8">
        <product-detail-section
          :product="product"
          :selectedColor="selectedColor"
          :selectedSize="selectedSize"
          @update:color="selectedColor = $event"
          @update:size="selectedSize = $event"
        />
      </v-col>
      <v-col cols="12" md="4" class="product-gallery__column">
        <product-detail-product-gallery-section
          :images="images"
          :selectedImage="selectedImage"
          @select-image="selectedImage = $event"
        />
      </v-col>
    </v-row>

    <!-- Tabs Section -->
    <v-row class="mt-8">
      <v-col cols="12">
        <product-detail-product-tabs v-model="tab" />
      </v-col>
    </v-row>

    <v-row class="mt-8">
      <v-col cols="12">
        <product-detail-similar-products />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
const breadcrumbs = [
  { title: "خانه", disabled: false, href: "/" },
  { title: "لوازم دیجیتال", disabled: false, href: "/" },
  {
    title: "گوشی موبایل اپل iPhone ظرفیت ۱۲۸ گیگ ZA",
    disabled: true,
    href: "/",
  },
];

const images = [
  "/img/products/01.png",
  "/img/products/02.png",
  "/img/products/03.png",
];
const selectedImage = ref(images[0]);

const product = {
  title: "گوشی موبایل اپل iPhone مدل ZA ظرفیت ۱۲۸ گیگ",
  rating: 4.6,
  discount: 30,
  price: 34450000,
  oldPrice: 34450000 / 0.7,
  specs: [
    { label: "ابعاد", value: "۱۴۶.۷x۷۱.۵x۷.۶۵" },
    { label: "شبکه های ارتباطی", value: "2G , 3G , 4G , 5G" },
    { label: "صفحه نمایش", value: "6.3 inch" },
    { label: "پردازنده", value: "Apple A15 Bionic" },
    { label: "مقدار رم", value: "چهار گیگابایت" },
    { label: "حافظه داخلی", value: "۱۲۸ گیگابایت" },
  ],
  colors: [
    { value: "#fbe9e7" },
    { value: "#b2ebf2" },
    { value: "#d32f2f" },
    { value: "#263238" },
    { value: "#37474f" },
  ],
  sizes: [
    { value: "XXL", label: "XXL" },
    { value: "XL", label: "XL" },
    { value: "L", label: "L" },
    { value: "M", label: "M" },
  ],
};
const selectedColor = ref(product.colors[0].value);
const selectedSize = ref(product.sizes[2].value);

const tab = ref("desc");
</script>

<style scoped>
.product-tabs {
  background: #fff;
  border-radius: 16px 16px 0 0;
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.04);
  min-height: 56px;
}
.tab-title {
  font-size: 1.1rem;
  color: #222;
  min-width: 120px;
  letter-spacing: 0.5px;
}
.tab-title .v-icon {
  margin-left: 6px;
}
.tab-title.font-weight-bold {
  font-weight: bold;
}
.product-gallery__column {
  order: -1;
}

@media (min-width: 960px) {
  .product-gallery__column {
    order: 2;
  }
}
</style>
