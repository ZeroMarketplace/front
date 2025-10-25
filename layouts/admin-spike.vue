<template>
  <div>
    <v-theme-provider theme="spikeLight">
      <FullLayout>
        <slot />
      </FullLayout>
    </v-theme-provider>
  </div>
</template>

<script setup>
import FullLayout from './full/FullLayout.vue'
import '~/assets/scss/style.scss'
</script>
