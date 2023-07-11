<template>
  <v-list class="w-100">
    <CategoryViewItem v-for="item in list"
                      @setEdit="setEdit"
                      @setParent="setParent"
                      @setDelete="setDelete"
                      :item="item"/>
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
    },
    setEdit(data) {
      this.$emit('setEdit', data);
    },
    setDelete(data) {
      this.$emit('setDelete', data);
    }
  }
}
</script>

<style scoped>

</style>