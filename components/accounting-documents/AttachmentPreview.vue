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

<script setup>
// Import necessary composables
import {ref, onMounted} from 'vue';
import {useAPI}         from "~/composables/useAPI";

// Define props
const props = defineProps({
  src       : {
    type    : String || Blob, // Accepts either a string URL or a Blob
    required: true,
  },
  showDelete: {
    type   : Boolean,
    default: false,
  },
});

// Define reactive state
const image = ref('');

// Define emit events
const emit = defineEmits(['deleteFile']);

// Method to handle file deletion
const deleteFile = () => {
  emit('deleteFile');
};

// Lifecycle hook to fetch or set the image
onMounted(async () => {
  // If src is a Blob, set it directly
  if (props.src instanceof Blob) {
    image.value = props.src;
  } else {
    // Fetch the image if src is a URL
    const {data} = await useAPI(props.src, {
      method      : 'get',
      responseType: 'blob',
    });

    if (data.value) {
      const blob  = new Blob([data.value], {type: 'image/jpeg'});
      image.value = URL.createObjectURL(blob);
    }
  }
});
</script>

<style scoped>

</style>