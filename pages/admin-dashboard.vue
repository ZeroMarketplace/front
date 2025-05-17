<template>
  <v-row class="bg-white mr-4 mr-md-1 ml-4 rounded-lg pb-16">
    Dashboard
  </v-row>
</template>

<script>

definePageMeta({
  layout: "admin",
  middleware: 'auth',
  requiresAuth: true,
  requiresRole: 'admin'
});
export default {
  data() {
    return {}
  }
}
</script>

<style scoped>

</style>
