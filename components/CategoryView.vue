<template>
  <v-list class="w-100">
    <CategoryViewItem v-for="item in list" @setParent="setParent" :item="item"/>
  </v-list>
</template>

<script>
export default {
  props: ['list'],
  data() {
    return {}
  },
  methods: {
    setParent(data) {
      this.$emit('setParent', data);
    }
  }
}
</script>

<style scoped>

</style>