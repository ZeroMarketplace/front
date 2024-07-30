<template>
  <v-select label="انبار"
            :readonly="loading"
            :rules="rules"
            :items="list"
            item-title="title.fa"
            item-value="_id"
            density="compact"
            variant="outlined">
  </v-select>
</template>

<script>
import {useCookie} from "#app";

export default {
  props: {
    'input-rules': {
      type: Array
    },
    preload      : {
      type   : Boolean,
      default: true
    }
  },
  data() {
    return {
      loading: false,
      list   : [],
      rules  : [],
    }
  },
  methods: {
    getWarehouses() {
      this.loading = true;
      fetch(
          this.runtimeConfig.public.API_BASE_URL + 'warehouses', {
            method : 'get',
            headers: {'authorization': 'Bearer ' + this.user.token}
          }).then(async response => {
        response     = await response.json();
        this.list    = response.list;
        this.loading = false;
      });
    },
  },
  created() {
    if (this.inputRules)
      this.rules = this.inputRules;
  },
  mounted() {
    this.user          = useCookie('user').value;
    this.runtimeConfig = useRuntimeConfig();
    // check has items
    if (!this.list.length && this.preload) {
      this.getWarehouses();
    }
  }
}
</script>

<style scoped>

</style>
