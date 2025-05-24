<script setup>
</script>

<template>
  <v-sheet
    class="filter-container mx-4 my-4 pa-3"
    elevation="2"
    rounded="xl"
  >
    <v-btn
      block
      class="mb-8 text-body-2 font-weight-regular text-h1 bg-C4C4C436"
    >
      فیلتر کردن نتایج
    </v-btn>

    <v-switch
      label="فقط کالا های موجود"
      inset
      class="mb-6"
    />

    <v-divider class="mb-4" />

    <v-text class="text-body-2 font-weight-regular mb-3 text-h1">
      مرتب سازی براساس
    </v-text>

    <v-radio-group>
      <v-radio label="پربازدید ترین" value="one" />
      <v-radio label="پرفروش ترین" value="two" />
      <v-radio label="جدید ترین" value="three" />
      <v-radio label="گران ترین" value="four" />
      <v-radio label="ارزان ترین" value="five" />
    </v-radio-group>

    <v-divider class="mb-5" />

    <v-text class="text-body-2 font-weight-regular mb-4 text-h1">
      بازه ی قیمتی
    </v-text>

    <v-slider color="pink" thumb-label class="mb-4" />

    <v-divider class="mb-5" />

    <v-switch label="فقط کالا های ویژه" />
  </v-sheet>
</template>

<style scoped>
.filter-container {
  width: 291px;
  height: 573px;
  background-color: white;
  box-shadow: 0px 8px 80px #0000000A;
}

:deep(.v-switch) .v-selection-control {
  flex-direction: row-reverse;
  justify-content: space-between;
}

:deep(.v-switch) .v-input__control,
:deep(.v-switch) .v-selection-control {
  height: 22px !important;
  min-height: 22px !important;
}

:deep(.v-switch) .v-label {
  font-size: 14px !important;
  height: 22px !important;
}

:deep(.v-switch__track) {
  background-color: white !important;
  border: 1px solid black;
  width: 38px !important;
  min-width: 38px !important;
  height: 17px !important;
}

:deep(.v-switch__thumb) {
  background-color: #424242CC !important;
  width: 11px !important;
  height: 11px !important;
  transform: none;
}

:deep(.v-radio) .v-label {
  font-size: 12px !important;
}

:deep(.v-radio-group) .v-selection-control {
  display: flex;
  justify-content: right;
  margin-top: -3px;
  margin-bottom: -3px;
}

:deep(.v-radio) .v-icon--size-default {
  font-size: 15px;
  border: 2px solid #D2D2D7;
  border-radius: 50%;
}

.bg-C4C4C436{
    background-color: #C4C4C436;
}
</style>