<template>
  <v-text-field v-model="formattedValue"
                placeholder="وارد کنید"
                @input="onInput"
                density="compact"
                variant="outlined"
                hide-details>
    <template v-slot:append-inner>
      <v-icon v-if="Number(internalValue) <= 100">
        mdi-percent
      </v-icon>
      <v-label v-else>
        تومان
      </v-label>
    </template>
  </v-text-field>
</template>


<script setup lang="ts">
import {ref, computed, watch} from 'vue'
import {formatters}           from '~/utils/formatters'

const props = defineProps({
  modelValue: {
    type   : String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue'])

const internalValue = ref(props.modelValue)

const formattedValue = computed({
  get: () => {
    return formatters.price(internalValue.value)
  },
  set: (value) => {
    internalValue.value = value.replace(/,/g, '')
  }
})

const onInput = (event) => {
  const value         = event.target.value.replace(/,/g, '')
  internalValue.value = value
};

// Watch for changes in props.modelValue (price from parent)
watch(() => props.modelValue, (newValue) => {
  internalValue.value = newValue
})

watch(internalValue, (newValue) => {
  emit('update:modelValue', newValue)
})
</script>

<style scoped>

</style>