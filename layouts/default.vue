<script setup lang="ts">

</script>

<template>
  <v-app>

    <!-- Header -->
    <Header />

    <!-- Page   -->
    <v-container class="px-md-16 mt-0 pt-10 body"  fluid>
      <slot/>
    </v-container>


    <!-- Footer -->
    <Footer />

  </v-app>
</template>

<style scoped>

</style>