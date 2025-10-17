<script setup>
import { Icon } from '@iconify/vue';
const props = defineProps({ item: Object, level: Number });

</script>

<template>
  <template v-if="level > 0">
    <Icon
      :icon="item"
      :width="14"
      :height="14"
      class="iconClass"
    />
  </template>
  <template v-else>
    <Icon
      :icon="item"
      :width="24"
      :height="24"
      class="iconClass"
    />
  </template>
</template>
