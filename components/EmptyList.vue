<template>
  <v-row v-if="!loading && !list.length" class="justify-center my-8 py-16">
    <v-icon class="w-100 my-5 text-red-lighten-2"
            size="100">
      mdi-file-alert-outline
    </v-icon>

    <v-label class="text-black">
      داده‌ای یافت نشد!
    </v-label>
  </v-row>
</template>

<script>
export default {
  props: ['list', 'loading'],
  data() {
    return {}
  }
}
</script>


<style scoped>

</style>