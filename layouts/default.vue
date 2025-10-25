<script setup lang="ts">
import '~/assets/css/style.scss'
</script>

<template>
  <div>
    <v-theme-provider theme="zeroLight">
      <v-app>
        <!-- Header -->
        <Header />

        <!-- Page   -->
        <v-container class="pa-0 body px-5 px-md-16 pt-10" fluid>
          <slot />
        </v-container>

        <!-- Footer -->
        <Footer />

        <!-- Notification System -->
        <Notifier />
      </v-app>
    </v-theme-provider>
  </div>
</template>
