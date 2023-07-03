<template>
  <div>
    <input v-for="row in 5"
           type="text"
           class="border rounded d-inline-block mx-1 textBox">
  </div>
</template>

<script>
export default {
  data() {
    return {}
  }
}
</script>

<style scoped>
.textBox {
  width: 15% !important;
  height: 50px !important;
  text-align: center;
}
</style>