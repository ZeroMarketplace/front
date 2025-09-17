<template>
  <div class="d-flex gap-2 flex-wrap">
    <template v-if="type === 'color'">
      <div
        v-for="option in options"
        :key="option.value"
        class="variant-color-outer"
        :class="{ selected: modelValue === option.value }"
        @click="$emit('update:modelValue', option.value)"
      >
        <div
          class="variant-color-inner"
          :style="{ backgroundColor: option.value }"
        >
          <v-icon v-if="modelValue === option.value" color="#1976d2" size="18"
            >mdi-check</v-icon
          >
        </div>
      </div>
    </template>
    <template v-else>
      <v-btn
        flat
        size="small"
        v-for="option in options"
        :key="option.value"
        :color="modelValue === option.value ? '#64DD17' : '#C4C4C4'"
        @click="$emit('update:modelValue', option.value)"
        class="ma-1 text-white rounded-lg"
      >
        {{ option.title }}
      </v-btn>
    </template>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  type: "color" | "size";
  options: Array<{ value: string; label?: string }>;
  modelValue: string;
}>();
defineEmits(["update:modelValue"]);
</script>
<style scoped>
.variant-color-outer {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 39px;
  height: 39px;
  border-radius: 50%;
  margin: 0 4px;
  cursor: pointer;
  transition: border 0.2s;
}
.variant-color-outer.selected {
  border: 2px solid #1976d2;
  box-sizing: border-box;
}
.variant-color-inner {
  width: 31px;
  height: 31px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 1px 4px #0001;
}

.variant-size-item {
}
</style>
