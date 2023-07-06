<template>
  <div>
    <v-row no-gutters>
      <v-col class="pa-0 d-none d-md-inline" md="3">
        <AdminDashboardMenu admin="true"/>
      </v-col>

      <v-col cols="12" md="9"></v-col>
    </v-row>
  </div>
</template>

<script>

definePageMeta({
  layout: "admin-layout",
});
export default {
  data() {
    return {}
  }
}
</script>

<style scoped>

</style>