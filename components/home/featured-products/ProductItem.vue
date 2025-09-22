<template>
  <div class="featured-product-card">
    <span class="discount-badge">30%</span>
    <div class="featured-product-content">
      <nuxt-link
        :to="`/product/${product?._id}/${(product?.title || product?.name || '')
          .toString()
          .replaceAll(' ', '-')}`"
      >
        <div class="featured-product-image-wrap">
          <products-product-image
            :file="product?.files?.[0] || ''"
            :size="120"
          />
        </div>
      </nuxt-link>
      <div class="featured-product-info">
        <nuxt-link
          :to="`/product/${product?._id}/${(
            product?.title ||
            product?.name ||
            ''
          )
            .toString()
            .replaceAll(' ', '-')}`"
        >
          <div class="featured-product-title">
            {{ product?.title || product?.name }}
          </div>
        </nuxt-link>
        <div class="featured-product-price-row">
          <span class="featured-product-price" v-if="displayPrice">
            {{ displayPrice.toLocaleString() }}
          </span>
          <span class="featured-product-currency" v-if="displayPrice"
            >تومان</span
          >
        </div>
        <div class="featured-product-counter-row">
          <button class="featured-product-add-btn">
            <v-icon size="x-small">mdi-plus</v-icon>
          </button>
          <span class="featured-product-count">0</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
type Product = {
  _id: string;
  title?: string;
  name?: string;
  files?: string[];
  price?: {
    consumer?: number;
    store?: number;
  };
  variants?: Array<{
    _id: string;
    code: number;
    title: string;
    price?: {
      consumer?: number;
      store?: number;
    };
    properties?: Array<{
      _property: string;
      value: number;
      _id: string;
    }>;
  }>;
};

const props = defineProps<{ product: Product }>();

const displayPrice = computed(() => {
  if (props.product?.variants?.length) {
    const variantWithPrice = props.product.variants.find(
      (v) => v?.price && (v.price.consumer || v.price.store)
    );
    if (variantWithPrice?.price) {
      return variantWithPrice.price.consumer ?? variantWithPrice.price.store;
    }
  }

  if (props.product?.price) {
    return props.product.price.consumer ?? props.product.price.store;
  }

  return null;
});
</script>

<style scoped>
.featured-product-card {
  background: #fff;
  border-radius: 22px;
  box-shadow: 0 7px 30px 0 rgba(0, 0, 0, 0.04);
  padding: 0 0 0 0;
  min-height: 180px;
  position: relative;
  display: flex;
  align-items: stretch;
  overflow: hidden;
}
.discount-badge {
  position: absolute;
  top: 0;
  left: 0;
  background: #e91e63;
  color: #fff;
  font-size: 12px;
  border-radius: 0 0 18px 0;
  padding: 8px 22px 4px 22px;
  font-weight: 500;
  z-index: 2;
}
.featured-product-content {
  display: flex;
  flex-direction: row;
  width: 100%;
  padding: 20px;
  justify-content: space-between;
}
.featured-product-info {
  display: flex;
  flex-direction: column;
  flex: 1;
}
.featured-product-title {
  font-size: 15px;
  font-weight: 400;
  color: #232323;
  margin-bottom: 18px;
  margin-top: 15px;
}
.featured-product-price-row {
  display: flex;
  margin-bottom: 18px;
  align-items: center;
}
.featured-product-currency {
  color: #bdbdbd;
  font-size: 12px;
  margin-right: 6px;
}
.featured-product-price {
  color: #232323;
  font-size: 15px;
  font-weight: 500;
}
.featured-product-counter-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 0;
}
.featured-product-count {
  color: #ec407a;
  font-size: 17px;
  font-weight: 500;
  margin-left: 8px;
}
.featured-product-add-btn {
  background: #424242;
  color: #fff;
  border: none;
  border-radius: 50%;
  width: 25px;
  height: 25px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.2s;
}
.featured-product-add-btn i {
}
.featured-product-add-btn:hover {
  background: #232323;
}
.featured-product-image-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 90px;
  margin-left: 15px;
}
.featured-product-image {
  width: 120px;
  height: 120px;
  object-fit: contain;
}
</style>
