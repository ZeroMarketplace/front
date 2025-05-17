<template>
  <div>Dashboard</div>
</template>

<script lang="ts" setup>
definePageMeta({
  name: 'dashboard',
  middleware: 'auth',
  requiresAuth: true,
  requiresRole: 'user'
})
</script>

<style scoped></style>
