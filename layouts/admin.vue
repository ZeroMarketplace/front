<template>
  <v-app>

    <!-- Container   -->
    <v-container class="pa-0 body" fluid>
      <v-row>
        <!--  Admin Dashboard Menu   -->
        <v-col class="pa-0 d-none d-md-inline" md="2">
          <AdminDashboardMenu/>
        </v-col>

        <!--  Page   -->
        <v-col class="ma-0 pa-0" cols="12" md="10">

          <AdminHeaderBar />

          <slot/>

        </v-col>

      </v-row>

      <Notifier />
    </v-container>

  </v-app>
</template>

<script setup lang="ts">

</script>

<style scoped>

</style>
