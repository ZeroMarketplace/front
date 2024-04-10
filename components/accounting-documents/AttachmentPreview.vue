<template>
  <v-img :src="image" class="w-100 h-100">
    <v-btn v-if="showDelete"
           class="mt-2 mr-2 border border-opacity-100"
           size="30"
           variant="elevated"
           @click="deleteFile"
           icon>
      <v-icon color="red">mdi-delete</v-icon>
    </v-btn>
  </v-img>
</template>

<script>
import {useCookie} from "#app";

export default {
  props: ['src', 'showDelete'],
  data() {
    return {
      image: '',
    }
  },
  methods: {
    deleteFile() {
      this.$emit('deleteFile');
    }
  },
  mounted() {
    // get user
    this.user = useCookie('user').value;

    // if is blobbed
    if (this.src instanceof Blob) {
      this.image = this.src;
    } else {
      fetch(this.src, {
        headers: {
          'authorization': 'Bearer ' + this.user.token
        },
      }).then(response => response.blob())
          .then(imageBlob => {
            this.image = URL.createObjectURL(imageBlob);
          });
    }
  }
}
</script>

<style scoped>

</style>