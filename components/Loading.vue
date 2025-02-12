<template>
  <v-row class="d-flex justify-center py-16 my-16" v-if="loading">
    <v-progress-circular class="my-16 py-2" indeterminate>
    </v-progress-circular>
  </v-row>
</template>

<script setup>
const props = defineProps({
  loading: {
    type: Boolean
  }
})
</script>

<style scoped>

</style>