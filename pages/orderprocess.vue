<script setup>
let selectedAddress = ref('one')
</script>
<template>
    <div class="d-flex flex-column ga-2 align-center">
        <ProcessOrderProgressBar/>
        <div class="d-flex ga-4">
            <div class="px-8 py-7 completionForm">
                <v-text-title class="FromTitle">فرم تکمیل اطلاعات</v-text-title>
                <v-radio-group class="mt-12" v-model="selectedAddress">
                    <v-radio label="مشهد - خیابان بهار - بهار ۶ - پلاک ۱۰ - طبقه اول" value="one" :class="['pa-3',{'selectedAddress' : selectedAddress == 'one'}]"></v-radio>
                    <v-radio label="تهران - ابتدا عباس آباد - خیابان نادری - پلاک ۶۰ - طبقه دوم" value="two" :class="['pa-3',{'selectedAddress' : selectedAddress == 'two'}]"></v-radio>
                </v-radio-group>
                <v-divider color="#000000d6" :thickness="1"></v-divider>
                <v-container fluid>
                    <v-row class="gap-y-5">
                        <v-col cols="12" md="6">
                            <v-text-field label="نام" placeholder="وارد کنید" variant="outlined" hide-details style="border-radius: 12px !important;" />
                        </v-col>

                        <v-col cols="12" md="6">
                            <v-text-field label="نام خانوادگی" placeholder="وارد کنید" variant="outlined" hide-details />
                        </v-col>

                        <v-col cols="12" md="6">
                            <v-text-field label="ایمیل" placeholder="وارد کنید" variant="outlined" hide-details />
                        </v-col>

                        <v-col cols="12" md="6">
                            <v-text-field label="تلفن ثابت" placeholder="وارد کنید" variant="outlined" hide-details />
                        </v-col>

                        <v-col cols="12" md="6">
                            <v-text-field label="شماره تماس" placeholder="وارد کنید" variant="outlined" hide-details />
                        </v-col>

                        <v-col cols="12" md="6">
                            <v-text-field label="کد پستی" placeholder="وارد کنید" variant="outlined" hide-details />
                        </v-col>

                        <!-- Address - full width always, appears at the bottom -->
                        <v-col cols="12">
                            <v-textarea label="آدرس" placeholder="وارد کنید" variant="outlined" hide-details></v-textarea>
                        </v-col>
                    </v-row>
                </v-container>
            </div>
            <div class="d-flex flex-column ga-4">
                <div class="px-8 py-7 completionForm">
                    <v-text-title class="FromTitle">انتخاب موقعیت</v-text-title>
                </div>

                <div class="px-8 py-7 completionForm">
                    <v-text-title class="FromTitle">نحوه ارسال</v-text-title>
                    <v-select
                    class="mt-12"
                    label="انتخاب نحوه ارسال"
                    :items="[ 'تیپاکس', 'پست']"
                    variant="outlined"
                    />
                </div>
            </div>
          
        </div>

        <v-btn color="#424242" class="rounded-lg align-self-end mt-8">مرحله بعد</v-btn>
    </div>

</template>
<style scoped>
.completionForm{
    border-radius: 21px;
    background-color: white;
    max-width: 544px;
    min-width: 300px;
}
.FromTitle{
    border-right: 4px solid #424242;
    padding-right: 11px;
}

.selectedAddress {
    background-color: #F4F4F4;
    border-radius: 10px;
}

:deep(.v-field) {
  border-radius: 12px !important;
}
:deep(.addressInput .v-field) {
  min-height: 120px !important;
}
:deep(.v-container .v-field__input),
:deep(.v-container .v-label) {
  font-size: 13px;
  font-weight: 400;
}
.v-btn{
    margin-bottom: 150px;
}
:deep(.v-select__menu-icon){
    color: #EC407A !important;
    opacity: 1 !important;
}
</style>