<template>
  <div class="slide-content">
    <img :src="src" class="slide-bg" />
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  src: {},
});
</script>

<style scoped></style>
