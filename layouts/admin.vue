<template>
  <div>
    <FullLayout>
      <slot />
    </FullLayout>
  </div>
</template>

<script setup>
import FullLayout from './full/FullLayout.vue'
import '~/assets/scss/style.scss'
import '~/assets/scss/spike-theme.scss'
</script>
