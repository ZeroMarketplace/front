<template>
  <div v-if="render">
    <!--  Image   -->
    <v-img v-if="file"
           :width="size"
           :height="size"
           max-width="100"
           :src="staticsUrl + 'products/' + file"
           aspect-ratio="1/1"
           cover>
      <template v-slot:placeholder>
        <div class="d-flex align-center justify-center fill-height">
          <v-progress-circular indeterminate></v-progress-circular>
        </div>
      </template>
    </v-img>

    <!--        Icon        -->
    <v-icon v-if="!file" class="mx-0" :size="size">mdi-image-outline</v-icon>
  </div>
</template>

<script>
export default {
  props: ['file', 'size'],
  data() {
    return {
      render: false
    }
  },
  created() {
    this.runtimeConfig = useRuntimeConfig();
    this.staticsUrl    = this.runtimeConfig.public.STATICS_URL;

    // size
    if(!this.size)
      this.size = 100;

    this.render        = true;
  }
}
</script>


<style scoped>

</style>
