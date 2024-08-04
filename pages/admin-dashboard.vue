<template>
  <v-row>
    <v-col class="pa-0 d-none d-md-inline" md="3">
      <AdminDashboardMenu/>
    </v-col>

    <v-col cols="12" md="9">
      <AdminHeaderBar/>
    </v-col>
  </v-row>
</template>

<script>

definePageMeta({
  layout: "admin",
});
export default {
  data() {
    return {}
  }
}
</script>

<style scoped>

</style>
