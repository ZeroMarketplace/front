<script setup>
</script>
<template>
    <div class="d-flex align-center justify-center flex-column ga-6 mb-8 h-100">
        <ProcessOrderProgressBar :step-active="5"/>
        <div class="d-flex  flex-column container align-center w-100">
            <v-icon size="121" color="#A9A9A9" class="mdi mdi-emoticon-sad"></v-icon>
            <span class="mt-5 messageTitle text-center">متاسفانه سفارش شما موفقیت آمیز نبود.</span>
            <span class="mt-3 messageSubtitle text-center">برای اطلاعات بیشتر لطفا با بخش پشتیبانی در ارتباط باشید</span>
            <v-btn color="#424242" rounded="lg" class="mt-9 text-body-2 px-15 pa-2">ارتباط با پشتیبانی</v-btn>
        </div>
    </div>

</template>
<style scoped>
.container{
    border-radius: 21px;
    background-color: #FFFFFF;
    padding: 60px 100px;
}
.messageTitle{
    font-size: 22px;
    font-weight: 400;
}
.messageSubtitle{
    font-size: 16px;
    font-weight: 400;
    color: #424242B2;
}

</style>