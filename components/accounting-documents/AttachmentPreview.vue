<template>
  <v-img :src="image" class="w-100 h-100">

  </v-img>
</template>

<script>
import {useCookie} from "#app";

export default {
  props: ['src'],
  data() {
    return {
      image: '',
    }
  },
  methods: {},
  mounted() {
    // get user
    this.user          = useCookie('user').value;

    // if is blob
    if (this.src instanceof Blob) {
      this.image = this.src;
    } else {
      fetch(this.src, {
        headers: {
          'authorization': 'Bearer ' + this.user.token
        },
      })
          .then(response => response.blob())
          .then(imageBlob => {
            this.image = URL.createObjectURL(imageBlob);
          }).catch(error => console.error('خطا در دریافت عکس: ', error));
    }
  }
}
</script>

<style scoped>

</style>