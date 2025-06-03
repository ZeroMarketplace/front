<template>
  <v-card flat class="pa-6 rounded-xl">
    <div class="border-b pb-4 mb-4">
      <div class="d-flex align-center flex-wrap justify-space-between">
        <div class="d-flex align-center ml-4">
          <span class="text-h6 font-weight-bold">{{ product.title }}</span>
          <div class="product-discount-badge mr-2">30%</div>
        </div>
        <div class="d-flex align-center">
          <span class="ml-1 mt-1 rate-value">4.6</span>
          <v-icon color="#FFAB00">mdi-star</v-icon>
        </div>
      </div>
      <div>
        <div class="d-flex align-center mt-4">
          <v-icon class="text-grey-darken-1">mdi-message-text-outline</v-icon>
          <span class="mr-1 text-grey-darken-1">3 دیدگاه</span>
        </div>
      </div>
    </div>

    <v-row>
      <v-col cols="12" md="6">
        <div class="mb-2">
          <div class="d-flex align-center">
            <v-icon class="text-black">mdi-clipboard-text-outline</v-icon>
            <span class="text-black mr-1 text-lg">مشخصات</span>
          </div>
          <div class="mt-5">
            <ul class="pr-6">
              <li class="mb-3" v-for="spec in product.specs" :key="spec.label">
                <span class="font-weight-bold">{{ spec.label }}:</span>
                <span class="text-grey-darken-1 pr-2">{{ spec.value }}</span>
              </li>
            </ul>
          </div>
        </div>
      </v-col>
      <v-col cols="12" md="6">
        <div>
          <div class="d-flex align-center mb-3">
            <v-icon class="text-black">mdi-tag-outline</v-icon>
            <span class="text-black mr-1 text-lg">ویژگی ها</span>
          </div>
          <div class="mb-2 d-flex align-center">
            <span class="font-weight-bold pl-2">رنگ:</span>
            <product-detail-productVariantSelector
              type="color"
              :options="product.colors"
              :model-value="selectedColor"
              @update:modelValue="$emit('update:color', $event)"
            />
          </div>
          <div class="mb-2 d-flex align-center">
            <span class="font-weight-bold pl-2">سایز:</span>
            <product-detail-productVariantSelector
              type="size"
              :options="product.sizes"
              :model-value="selectedSize"
              @update:modelValue="$emit('update:size', $event)"
            />
          </div>
        </div>
      </v-col>
    </v-row>
    <div
      class="d-flex justify-space-between flex-wrap align-center mt-4 p-price-section"
    >
      <div class="d-flex flex-column mt-4 mb-4 mb-md-auto">
        <span
          class="text-grey text-decoration-line-through mr-2"
          v-if="product.oldPrice"
          >{{ product.oldPrice.toLocaleString() }}</span
        >
        <div>
          <span class="text-h5 font-weight-bold text-pink-lighten-1"
            >{{ product.price.toLocaleString() }} </span
          ><span class="pr-2 text-grey">تومان</span>
        </div>
      </div>
      <v-btn
        size="large"
        color="pink-lighten-1"
        class="rounded-base w-100 w-md-auto"
      >
        <v-icon right>mdi-cart</v-icon>
        <span class="pr-2 font-weight-regular"> افزودن به سبد خرید</span>
      </v-btn>
    </div>
  </v-card>
  <!-- Sticky Bottom Bar (Mobile Only) -->
  <Teleport to="body">
    <div class="sticky-bottom-bar d-md-none">
      <div class="d-flex justify-space-between align-center w-100">
        <div class="d-flex flex-column mt-4 mb-4 mb-md-auto">
          <span
            class="text-grey text-decoration-line-through mr-2"
            v-if="product.oldPrice"
            >{{ product.oldPrice.toLocaleString() }}</span
          >
          <div class="d-flex align-center">
            <span class="font-weight-bold text-pink-lighten-1"
              >{{ product.price.toLocaleString() }}
            </span>
            <div class="pr-2 text-grey order-first">تومان</div>
          </div>
        </div>
        <v-btn size="large" color="pink-lighten-1 ml-2" class="rounded-base">
          <v-icon>mdi-cart</v-icon>
        </v-btn>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
defineProps<{
  product: any;
  selectedColor: string;
  selectedSize: string;
}>();
defineEmits(["update:color", "update:size"]);
</script>

<style scoped>
.product-discount-badge {
  background: #ec407a;
  width: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 24px;
  border-radius: 13px;
  text-align: center;
  color: #ffffff;
  font-size: 12px;
  font-weight: 400;
  flex-shrink: 0;
}
.rate-value {
  columns: #424242;
  font-weight: 400;
  font-size: 14px;
}
.p-price-section {
  border-top: 1px dashed rgba(0, 0, 0, 0.2);
}
.sticky-bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100vw;
  background: #fff;
  box-shadow: 0 -2px 16px rgba(0, 0, 0, 0.07);
  padding: 16px 20px 12px 20px;
  z-index: 100;
  border-top-left-radius: 18px;
  border-top-right-radius: 18px;
}
@media (min-width: 960px) {
  .sticky-bottom-bar {
    display: none !important;
  }
}
</style>
