<script setup lang="ts">

</script>

<template>
  <v-app>

    <!-- Header -->
    <Header />

    <!-- Page   -->
    <v-container class="pa-0 body" fluid>
      <slot/>
    </v-container>


    <!-- Footer -->
    <Footer />

  </v-app>
</template>

<style scoped>

</style>