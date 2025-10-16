<script setup>
import { Icon } from '@iconify/vue';
const props = defineProps({ item: Object, level: Number });

</script>

<template>
  <template v-if="level > 0">
    <component
      :icon="'solar:' + item"
      size="14"
      stroke-width="1.5"
      class="iconClass"
    ></component>
  </template>
  <template v-else>
    <component
      :icon="'solar:' + item"
      size="24"
      stroke-width="1.5"
      class="iconClass"
    ></component>
  </template>
</template>
