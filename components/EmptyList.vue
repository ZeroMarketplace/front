<template>
  <v-row v-if="!loading && !list.length" class="justify-center my-16 py-16">
    <v-icon class="w-100 my-5"
            size="100">
      mdi-not-equal
    </v-icon>

    <v-label class="text-pink">
      متاسفانه هیچ داده‌ای یافت نشد
    </v-label>
  </v-row>
</template>

<script>
export default {
  props: ['list','loading'],
  data() {
    return {}
  }
}
</script>


<style scoped>

</style>