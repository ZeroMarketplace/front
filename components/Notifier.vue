<template>
  <div>
    <v-snackbar v-model="show"
                class="notifier text-justify"
                height="50"
                max-width="100"
                :color="color"
                timeout="3000"
                elevation="24"
                location="bottom"
                eager>
      {{ text }}
    </v-snackbar>
  </div>
</template>

<script>
import {defineStore} from "pinia";
import {useNotifierStore} from "~/store/notifier";

export default {
  data() {
    return {
      show : false,
      text : '',
      color: 'success'
    }
  },
  mounted() {
    // use notifier store
    const notifierStore = useNotifierStore();
    notifierStore.$subscribe((mutation, state) => {
      this.show  = state.show;
      this.text  = state.text;
      this.color = state.color;
    });
  }
}
</script>

<style scoped>

</style>