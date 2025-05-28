<script setup>
</script>
<template>
    <div class="d-flex align-center justify-center flex-column ga-6 mb-8 h-100">
        <ProcessOrderProgressBar :step-active="4" class="w-100"/>
        <div class="d-flex  flex-column container align-center w-100">
            <v-icon size="121" color="#EC407A" class="mdi mdi-emoticon"></v-icon>
            <span class="mt-5 text-h5">سفارش شما با موفقیت ثبت شد</span>
            <div class="d-flex mt-5 ga-1">
                <p class="textColor-424242B2 text-body-1">کد پیگیری:</p>
                <p class="textColor-424242B2 text-body-1"> 964322000#  </p>
            </div>
            <v-btn color="#EC407A" rounded="lg" class="mt-9 text-body-2 px-15 pa-2">لیست سفارش های من</v-btn>
        </div>
    </div>

</template>
<style scoped>
.container{
    border-radius: 21px;
    background-color: #FFFFFF;
    padding: 60px 100px;
}
.textColor-424242B2{
    color: #424242B2;
}
</style>