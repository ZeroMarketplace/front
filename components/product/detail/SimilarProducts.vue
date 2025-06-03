<template>
  <div>
    <div class="d-flex align-cemter">
      <div>
        <v-icon>mdi-package-variant-closed</v-icon>
      </div>
      <div class="similar-product__title pr-2">محصولات مشابه</div>
    </div>
    <div class="mt-4">
      <div>
        <home-products></home-products>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
.similar-product__title {
  font-size: 18px;
  font-weight: 400;
  color: #000000;
}
</style>
