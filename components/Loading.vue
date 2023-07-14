<template>
  <v-row class="d-flex justify-center pa-16" v-if="loading">
    <v-progress-circular indeterminate>
    </v-progress-circular>
  </v-row>
</template>

<script>
export default {
  props: ['loading'],
  data() {
    return {}
  }
}
</script>

<style scoped>

</style>