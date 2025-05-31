<script setup>
const route = useRoute()

 const items = [
    {
      title: 'خانه',
      disabled: false,
      href: '/',
    },
    {
      title: 'لوازم دیجیتال',
      disabled: false,
      href: 'product',
    },
    {
      title: ' گوشی موبایل اپل مدل iPhone ظرفیت ۱۲۸ گیگ ZA',
      disabled: false,
      href: 'blog',
    },
]

</script>

<template>
    <div class="d-flex flex-column pa-4 align-center">
        <v-breadcrumbs :items="items" class="w-100 d-flex flex-column flex-md-row">
            <template v-slot:title="{ item }">
                <Nuxt-Link :class="{ activeUrl: route.name === item.href }" class="text-body-2 text-no-wrap">
                    {{ item.title }}
                </Nuxt-Link>
            </template>
        </v-breadcrumbs>
        <v-container>
            <v-card class="pa-4 rounded-xl d-flex flex-column align-center">
                <div class="d-flex flex-column justify-space-between w-100 align-right flex-md-row">
                    <v-card-title class="blogTitle">
                        گوشی موبایل اپل مدل iPhone ظرفیت ۱۲۸ گیگ ZA
                    </v-card-title>
                    <div class="d-flex align-center ga-1">

                        <span class="mdi mdi-eye-outline activeUrl"></span>
                        <p class="text-body-2 activeUrl">180 مشاهده</p>
                        <span class="mdi mdi-comment-text-outline activeUrl"></span>
                        <p class="text-body-2 activeUrl">3 دیدگاه</p>
                    </div>
                </div>
                <v-divider color="#00000080" class="w-100"></v-divider>
                <v-card-text class="blogContent">
                    لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ، و با استفاده از طراحان گرافیک است، چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است،
                    و برای شرایط فعلی تکنولوژی مورد نیاز، و کاربردهای متنوع با هدف بهبود ابزارهای کاربردی می باشد، کتابهای زیادی در شصت و سه درصد گذشته حال و آینده، شناخت فراوان جامعه و متخصصان را می طلبد،
                    تا با نرم افزارها شناخت بیشتری را برای طراحان رایانه ای علی الخصوص طراحان خلاقی، و فرهنگ پیشرو در زبان فارسی ایجاد کرد،
                    در این صورت می توان امید داشت که تمام و دشواری موجود در ارائه راهکارها، و شرایط سخت 
                </v-card-text>
                <img src="/assets/images/products/01.png" alt="">
                <h2 class="blogHeader my-4 d-flex align-right w-100">بررسی تخصصی</h2>
                <v-card-text class="blogContent">
                    لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ، و با استفاده از طراحان گرافیک است، چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است،
                    و برای شرایط فعلی تکنولوژی مورد نیاز، و کاربردهای متنوع با هدف بهبود ابزارهای کاربردی می باشد، کتابهای زیادی در شصت و سه درصد گذشته حال و آینده، شناخت فراوان جامعه و متخصصان را می طلبد،
                    تا با نرم افزارها شناخت بیشتری را برای طراحان رایانه ای علی الخصوص طراحان خلاقی، و فرهنگ پیشرو در زبان فارسی ایجاد کرد،
                    در این صورت می توان امید داشت که تمام و دشواری موجود در ارائه راهکارها، و شرایط سخت 
                </v-card-text>
                <img src="/assets/images/products/01.png" alt="">
                <h3 class="blogHeader my-4">این مقاله برای شما مفید بود؟</h3>
                <div class="d-flex flex-row ga-4 justify-center align-center mb-12">
                    <span class="mdi mdi-thumb-up-outline text-h5"></span>
                    <p class=" likeBlog">40</p>
                    <span class="mdi mdi-thumb-up-outline text-h5"></span>
                    <p class="dislikeBlog">5</p>
                </div>
                <v-divider color="#00000080" class="w-100 mb-4"></v-divider>
                <div class="d-flex justify-space-between w-100 align-right">
                    <div class="align-center d-flex">
                        <img src="/assets/images/products/01.png" width="34" height="34" class="rounded-circle" alt="">
                        <p class="text-caption">سهیل کاشانی </p>
                    </div>
                    <div class="d-flex align-center ga-1">
                        <span class="mdi mdi-share-variant text-h6"></span>
                        <span class="mdi mdi-calendar-blank text-h6"></span>
                        <p class="blogDate">۱۰ اردیبهشت ۱۴۰۱</p>
                    </div>
                    
                </div>
            </v-card>
        </v-container>
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
                <div class="d-flex justify-space-between w-100 align-center">
                    <div class="d-flex align-center">
                        <img src="/assets/images/products/01.png" width="56" height="56" class="rounded-circle" alt="">
                        <div class="d-flex flex-column">
                            <div class="d-flex align-center commentHeader ga-1">
                                <p>سهیل کاشانی  |</p>
                                <p>4.6</p>
                                <span class="mdi mdi-star color-FFAB00 text-body-1"></span>
                            </div>
                            <p class="blogDate">۱۰ اردیبهشت ۱۴۰۱</p>
                        </div>
                    </div>
                    <div class="d-flex flex-row ga-4 align-center">
                        <span class="mdi mdi-thumb-up-outline text-h6"></span>
                        <p class="commentRate">40</p>
                        <span class="mdi mdi-thumb-up-outline text-h6"></span>
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
.blogTitle{
    font-weight: 700;
    font-size: 17px;
}

.blogContent{
    font-weight: 400;
    font-size: 15;
    line-height: 40px;
}

.blogHeader{
    font-weight: 700;
    font-size: 20px;
}

.likeBlog{
    color: #3D9406;
    font-weight: 700;
    font-size: 24px;
}

.dislikeBlog{
    color: #FF0000;
    font-weight: 700;
    font-size: 24px;
}

.blogDate{
    color: #00000099;
    font-size: 12px;
    font-weight: 400;
}
.color-FFAB00{
    color: #FFAB00;
}

.commentHeader{
    color: #424242;
    font-size: 14px;
    font-weight: 400;
}

.commentRate{
    color: #00000099;
}

</style>