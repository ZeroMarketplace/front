<template>
  <div class="product-card">
    <span class="discount-badge">30%</span>
    <nuxt-link
      :to="`/product/${product?._id}/${(product?.title || product?.name || '')
        .toString()
        .replaceAll(' ', '-')}`"
    >
      <div class="product-media">
        <products-product-image :file="product?.files?.[0] || ''" :size="120" />
      </div>
    </nuxt-link>

    <nuxt-link
      :to="`/product/${product?._id}/${(product?.title || product?.name || '')
        .toString()
        .replaceAll(' ', '-')}`"
    >
      <div class="product-title">{{ product?.title || product?.name }}</div>
    </nuxt-link>

    <div class="product-card-footer">
      <div class="product-price d-flex align-center">
        <span class="price font-weight-regular" v-if="displayPrice">
          {{ displayPrice.toLocaleString() }}
        </span>
        <span class="currency pr-2" v-if="displayPrice">تومان</span>
      </div>
      <button class="add-to-cart-btn">
        <v-icon size="x-small">mdi-plus</v-icon>
      </button>
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
.product-card {
  background: #fff;
  border-radius: 22px;
  padding: 24px 16px 16px 16px;
  position: relative;
  box-shadow: 0 7px 30px 0 rgba(0, 0, 0, 0.04);
}
.discount-badge {
  position: absolute;
  top: 0;
  right: 0;
  background: #e91e63;
  color: #fff;
  font-size: 0.95rem;
  border-radius: 0 22px 0 22px;
  padding: 2px 14px;
  font-weight: 500;
  z-index: 2;
}
.product-media {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  margin-bottom: 30px;
  margin-top: 10px;
  height: 192px;
}
.product-image {
  width: 90px;
  height: 100%;
  object-fit: contain;
}
.product-title {
  font-size: 1.1rem;
  font-weight: 400;
  color: #222;
  margin-bottom: 32px;
}
.product-card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-top: auto;
}
.add-to-cart-btn {
  background: #424242;
  color: #fff;
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.3rem;
  cursor: pointer;
  transition: background 0.2s;
}
.add-to-cart-btn:hover {
}
.product-price {
  /* display: flex;
  flex-direction: column;
  align-items: flex-end;
  margin-right: 8px; */
}
.price {
  font-size: 14px;
  font-weight: 400;
  color: #000;
}
.currency {
  font-size: 10px;
  color: #bbb;
  margin-top: 2px;
}
</style>
