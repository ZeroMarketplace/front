<script setup>
defineProps({
  stepActive:String
})
</script>
<template>
  <div class="d-flex flex-column align-sm-end align-center justify-space-between px-4 pt-6 stepper-wrapper flex-sm-row">

    <div class="d-flex flex-column align-center text-center ga-1 mx-3">
    <v-icon class="mt-1 mb-1 mdi mdi-cart-outline text-h4" :color="stepActive >= 1 ? 'pink': '#00000026'" />
    <div class="d-flex ga-2 text-center align-center">
        <v-avatar v-if="stepActive >= 2" size="20" class="bg-white mdi mdi-check">
            <v-icon :color="stepActive >= 2 ? 'pink': '#00000026'" size="18" class="mdi mdi-check"></v-icon>
        </v-avatar>
        <v-avatar v-else size="10" :color="stepActive >= 1 ? 'pink': '#00000026'" class="mdi mdi-circle-medium">
        </v-avatar>
        <p :class="['text-body-1', 'text-no-wrap', { activeStep: stepActive >= 1 }]">سبد خرید</p>
    </div>
    </div>

    
    <v-divider :color="stepActive >= 1 ? 'pink': '#00000026' " :thickness="1" class="d-none d-sm-flex border-opacity-100 mb-3"></v-divider>

   
    <div class="d-flex flex-column align-center text-center ga-1 mx-3">
        <v-icon class="mt-1 mb-1 mdi mdi-card-account-details-outline text-h4" :color="stepActive >= 2 ? 'pink': '#00000026'"  />
        <div class="d-flex ga-2 align-center">
          <v-avatar v-if="stepActive >= 3" size="20" class="bg-white">
            <v-icon :color="stepActive >= 3 ? 'pink': '#00000026'" size="18" class="mdi mdi-check"></v-icon>
          </v-avatar>
          <v-avatar v-else size="10" :color="stepActive >= 2 ? 'pink': '#00000026'" class="mdi mdi-circle-medium">
          </v-avatar>
          <p :class="['text-body-1', 'text-no-wrap', { activeStep: stepActive >= 2 }]">تکمیل اطلاعات</p>
      </div>
    </div>

   
    <v-divider :color="stepActive >=3 ? 'pink': '#00000026' " :thickness="1" class="border-opacity-100 mb-3"></v-divider>

    
    <div class="d-flex flex-column align-center text-center ga-1 mx-3">
        <v-icon v-if="stepActive <= 4" class="mt-1 mb-1 mdi mdi-hand-coin-outline text-h4"  :color="stepActive >= 3 ? 'pink': '#00000026'" />
        <v-icon v-if="stepActive == 5" class="mt-1 mb-1 mdi mdi-alert-outline text-h4"  color="pink" />
        <div class="d-flex ga-2 align-center">
          <v-avatar v-if="stepActive >= 4" size="20" class="bg-white">
            <v-icon :color="stepActive >= 4 ? 'pink': '#00000026'" size="18" class="mdi mdi-check"></v-icon>
          </v-avatar>
          <v-avatar v-else size="10" :color="stepActive >= 3 ? 'pink': '#00000026'" class="mdi mdi-circle-medium">
          </v-avatar>
          <p :class="['text-body-1', 'text-no-wrap', { activeStep: stepActive >= 3 }]">پرداخت</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.stepper-wrapper {
  position: relative;
  background-color: white;
  padding: 28px 48px !important;
  border-radius: 22px;
  width:90%;
}
.activeStep{
    color: #EC407A;
}

:deep(.v-avatar::before){
  display: none !important;
}
</style>