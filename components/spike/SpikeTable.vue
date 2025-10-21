<template>
  <v-card class="spike-card border" elevation="0">
    <div class="border-table">
      <v-table class="month-table spike-table">
        <thead>
          <tr>
            <th
              v-for="header in headers"
              :key="header.key"
              class="text-subtitle-1 font-weight-semibold"
              :class="header.align ? `text-${header.align}` : ''"
            >
              {{ header.title }}
            </th>
          </tr>
        </thead>
        <tbody>
          <slot name="body"></slot>
        </tbody>
      </v-table>
    </div>
  </v-card>
</template>

<script setup>
defineProps({
  headers: {
    type: Array,
    required: true,
    // Example: [{ title: 'Name', key: 'name', align: 'start' }]
  },
});
</script>

<style scoped lang="scss">
@import '@/assets/scss/spike-theme.scss';
</style>
