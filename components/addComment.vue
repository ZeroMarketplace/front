<script setup>
const props = defineProps({
  show: Boolean
})
const emit = defineEmits(['update:show'])

const rating = ref(0)

function setRating(value) {
  rating.value = value
}
const rules = [
  v => !!v || 'این فیلد اجباری است',
]


</script>

<template>
  <div class="text-center pa-4">

    <v-dialog
      :model-value="show"
      @update:model-value="emit('update:show', $event)"
      width="auto"
      class="responsive-dialog"
    >
      <v-card
            class="pt-15 pb-8 px-8 rounded-xl"
      >
      <v-btn
        class="closeBtn"
        @click="emit('update:show', false)"
      >
        <span class="mdi mdi-close text-body-1"></span>
      </v-btn>
      <v-card-title class="text-center mb-7 text-body-1">
        افزودن کامنت
      </v-card-title>
      <v-textarea
        label="نظر خود را بنویسید" 
        variant="outlined" 
        rounded="xl" 
        class="custom-font"
        :rules="rules"
        no-resize
        ></v-textarea>
      <div class="d-flex align-center align-self-center p-3 rounded-lg text-body-2 mb-5 ga-2 ">
        رتبه شما به محصول:
            <span
            v-for="n in 5"
            :key="n"
            class="mdi mdi-star star"
            :class="{ active: rating >= n }"
            @click="setRating(n)"
            />
        </div>

          <v-btn
            class="ms-auto bg-424242 text-white w-100 text-body-2 radius-10"
            text="ثبت نظر"
            @click="emit('update:show', false)"
            height="45"
          ></v-btn>
      </v-card>
    </v-dialog>
  </div>
</template>

<style scoped>

.v-card {
  overflow: visible !important;
  position: relative;
}


.star {
  font-size: 24px;
  color: #ffaa00;
  opacity: 0.3;
  cursor: pointer;
  transition: opacity 0.2s ease;
  user-select: none;
}

.star.active {
  opacity: 1;
}

.bg-424242{
    background-color: #424242;
}

.closeBtn{
    position: absolute;
    top: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 43px;
    min-width: 43px;
    height: 43px;
    border-radius: 50%;
    padding: 0px;
    z-index: 10000;
}
.mdi-close{
    margin-left: 2px;
    margin-top: 2px;
}
 :deep(.v-overlay__content) {
  min-width: 350px;
  min-height: 350px;
}

@media (min-width: 700px) {
     :deep(.v-overlay__content) {
    min-width: 600px;
  }
}

.radius-10{
    border-radius: 10px;
}


:deep(.v-textarea .v-field--active textarea)  {
    font-size: 14px;
  }
</style>