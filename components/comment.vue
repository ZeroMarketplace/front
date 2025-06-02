<template>
    <div>
                <div class="d-flex py-4 ga-1 align-center w-100">
            <span class="mdi mdi-comment-text-outline"></span>
            <p class="text-body-1">نظرات</p>
            <p class="activeUrl text-caption">(49نظر)</p>
        </div>
        <v-container>
            <v-card class="pa-4 rounded-xl w-100 d-flex align-center justify-space-between">
                <div class="d-flex align-center">
                    <span class="mdi mdi-account-circle-outline activeUrl text-h5 mt-1"></span>
                    <v-card-title class="text-body-2">نظر خود را درباره این پست بنویسید</v-card-title>
                </div>
                <span class="mdi mdi-chevron-left text-h6 text-pink"></span>
            </v-card>
        </v-container>
        <v-container>
            <v-card class="pa-6 rounded-xl w-100 d-flex flex-column align-center justify-space-between">
                <div class="d-flex justify-space-between w-100 align-center flex-column flex-sm-row ga-4">
                    <div class="d-flex align-center">
                        <img src="/assets/images/products/01.png" width="56" height="56" class="rounded-circle ml-3" alt="">
                        <div class="d-flex flex-column ga-1">
                            <div class="d-flex align-center commentHeader ga-1">
                                <p>سهیل کاشانی  |</p>
                                <p>4.6</p>
                                <span class="mdi mdi-star color-FFAB00 text-body-1"></span>
                            </div>
                            <p class="commentDate">۱۰ اردیبهشت ۱۴۰۱</p>
                        </div>
                    </div>
                    <div class="d-flex flex-row ga-4 align-center">
                        <span class="mdi mdi-thumb-up-outline text-h6"></span>
                        <p class="commentRate">40</p>
                        <span class="mdi mdi-thumb-down-outline text-h6"></span>
                        <p class="commentRate">5</p>
                    </div>
                </div>
                <p class="text-body-2 mt-5">
                    لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ، و با استفاده از طراحان گرافیک است، چاپگرها
                     و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لا
                     زم است، و برای شرایط فعلی تکنولوژی مورد نیاز،
                      و کاربردهای متنوع با هدف بهبود ابزارهای کاربردی می باشد، کتابهای زیادی در شصت و سه درصد گذشته حال و آینده، شناخت ف
                     راوان جامعه و متخصصان را می طلبد، تا با نرم افزارها شناخت بیشتری را برای طراحان رایانه ای علی الخصوص طراحان خلاقی، و فرهنگ پیشرو
                      در زبان فارسی ایجاد کرد، در این صورت می توان امید داشت که تمام و دشواری موجود در ارائه راهکارها، و شرایط سخت 
                </p>
            </v-card>
        </v-container>
    </div>
</template>
<style scoped>
.v-container{
    margin-right: 0px;
    margin-left: 0px;
    padding-left: 0px;
    padding-right: 0px;
    min-width: 100%;
}
.activeUrl {
  color: #00000080;
}

.commentHeader{
    color: #424242;
    font-size: 14px;
    font-weight: 400;
}

.commentRate{
    color: #00000099;
}

.color-FFAB00{
    color: #FFAB00;
}

.commentDate{
    color: #00000099;
    font-size: 12px;
    font-weight: 400;
}
</style>