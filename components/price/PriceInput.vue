<template>
  <v-text-field
      v-model="formattedValue"
      @input="onInput"
      label="قیمت"
      density="compact"
      variant="outlined">
    <template v-slot:append-inner>
      تومان
    </template>
  </v-text-field>
</template>

<script setup>
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