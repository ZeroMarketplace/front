<script setup>
const stepActive = ref(true)
</script>
<template>
  <div class="d-flex align-end justify-space-between px-4 pt-6 stepper-wrapper">
    <!-- Step 1: Done -->
    <div class="d-flex flex-column align-center text-center ga-4 mx-3">
    <v-icon height="30" width="30" class="mt-1 mb-1 mdi mdi-cart-outline" :color="stepActive ? 'pink': 'black' " />
    <div class="d-flex ga-2 text-center align-center">
        <v-avatar size="20" class="bg-white">
            <v-icon :color="stepActive ? 'pink': 'black' "  size="18">mdi-check</v-icon>
        </v-avatar>
        <p :class="['text-body-1', 'text-no-wrap', { activeStep: stepActive }]">سبد خرید</p>
    </div>
    </div>

    <!-- Line -->
    <v-divider :color="stepActive ? 'pink': '#00000026' " :thickness="1" class="border-opacity-100 mb-3"></v-divider>

    <!-- Step 2: Current -->
    <div class="d-flex flex-column align-center text-center ga-4 mx-3">
        <v-icon height="30" width="30" class="mt-1 mb-1 mdi mdi-card-account-details-outline" :color="stepActive ? 'pink': 'black' "  />
        <div class="d-flex ga-2 align-center">
            <v-avatar size="8" :color="stepActive ? 'pink': 'black' ">
              <v-icon :color="stepActive ? 'pink': 'black' "  size="7">mdi mdi-circle-medium</v-icon>
            </v-avatar>
          <p :class="['text-body-1', 'text-no-wrap', { activeStep: stepActive }]">تکمیل اطلاعات</p>
      </div>
    </div>

    <!-- Line -->
    <v-divider :color="stepActive ? 'pink': '#00000026' " :thickness="1" class="border-opacity-100 mb-3"></v-divider>

    <!-- Step 3: Upcoming -->
    <div class="d-flex flex-column align-center text-center ga-4 mx-3">
        <v-icon height="30" width="30" class="mt-1 mb-1 mdi mdi-hand-coin-outline"  :color="stepActive ? 'pink': 'black' " />
        <div class="d-flex ga-2 align-center">
            <v-avatar v-if="stepActive" size="8" :color="stepActive ? 'pink': 'black' ">
              <v-icon :color="stepActive ? 'pink': 'black' "  size="7">mdi mdi-circle-medium</v-icon>
            </v-avatar>
          <p :class="['text-body-1', 'text-no-wrap', { activeStep: stepActive }]">پرداخت</p>
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
</style>