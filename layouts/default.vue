<script setup lang="ts"></script>

<template>
  <v-app>
    <!-- Header -->
    <Header />

    <!-- Page   -->
    <v-container class="pa-0 body px-5 px-md-16 pt-10" fluid>
      <slot />
    </v-container>

    <!-- Footer -->
    <Footer />
  </v-app>
</template>

<style scoped></style>
