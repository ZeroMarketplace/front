<template>
  <v-breadcrumbs class="overflow-x-auto" :items="items" divider="/">
    <template v-slot:title="{ item }">
      <div class="text-no-wrap">{{ item.title }}</div>
    </template>
  </v-breadcrumbs>
</template>

<script setup lang="ts">
defineProps<{
  items: Array<{ title: string; disabled: boolean; href: string }>;
}>();
</script>
