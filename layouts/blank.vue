<script setup lang="ts">

</script>

<template>
  <div>
    <v-theme-provider theme="zeroLight">
      <v-app>
        <v-container class="pa-0 body" fluid>
          <slot />
          <Notifier />
        </v-container>
      </v-app>
    </v-theme-provider>
  </div>
</template>

<style scoped></style>
