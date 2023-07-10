<template>
  <v-list class="w-100">
    <CategoryViewItem v-for="item in list" :item="item"/>
  </v-list>
</template>

<script>
export default {
  props: ['list'],
  data() {
    return {}
  },
}
</script>

<style scoped>

</style>