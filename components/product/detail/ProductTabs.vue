<template>
  <v-tabs v-model="tabValue" align-tabs="end" class="product-tabs" grow>
    <v-tab value="desc" class="tab-title font-weight-bold">
      <v-icon start>mdi-format-size</v-icon>
      <span class="text-grey-darken-3">معرفی</span>
    </v-tab>
    <v-tab value="specs" class="tab-title">
      <v-icon start>mdi-clipboard-text-outline</v-icon>
      <span class="text-grey-darken-3">مشخصات</span>
    </v-tab>
    <v-tab value="comments" class="tab-title">
      <v-icon start>mdi-message-text-outline</v-icon>
      <span class="text-grey-darken-3">دیدگاه ها (49)</span>
    </v-tab>
  </v-tabs>
  <v-tabs-window v-model="tabValue">
    <v-tabs-window-item value="desc">
      <div class="bg-white px-8 py-10 p-tab-content mb-6">
        <div class="mb-4">
          <div class="text-h6 font-weight-bold mb-2">نگاه کل</div>
          <p class="text-body-1 text-grey-darken-2 mb-4">
            لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ، و با
            استفاده از طراحان گرافیک است، چاپگرها و متون بلکه روزنامه و مجله در
            ستون و سطرآنچنان که لازم است، و برای شرایط فعلی تکنولوژی مورد نیاز،
            و کاربردهای متنوع با هدف بهبود ابزارهای کاربردی می باشد، کتابهای
            زیادی در شصت و سه درصد گذشته حال و آینده، شناخت فراوان جامعه و
            متخصصان را می طلبد، تا با نرم افزارها شناخت بیشتری را برای طراحان
            رایانه ای علی الخصوص طراحان خلاقی، و فرهنگ پیشرو در زبان فارسی ایجاد
            کرد، در این صورت می توان امید داشت که تمام و دشواری موجود در ارائه
            راهکارها، و شرایط سخت تایپ به پایان رسد و زمان مورد نیاز شامل
            حروفچینی دستاوردهای اصلی، و جوابگوی سوالات پیوسته اهل دنیای موجود
            طراحی اساسا مورد استفاده قرار گیرد.
          </p>
        </div>
        <div class="mb-4">
          <div class="text-h6 font-weight-bold mb-2">بررسی تخصصی</div>
          <p class="text-body-1 text-grey-darken-2 mb-4">
            چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است،
            و برای شرایط فعلی تکنولوژی مورد نیاز، و کاربردهای متنوع با هدف بهبود
            ابزارهای کاربردی می باشد، کتابهای زیادی در شصت و سه درصد گذشته حال و
            آینده، شناخت فراوان جامعه و متخصصان را می طلبد، تا با نرم افزارها
            شناخت بیشتری را برای طراحان رایانه ای علی الخصوص طراحان خلاقی، و
            فرهنگ پیشرو در زبان فارسی ایجاد کرد، در این صورت می توان امید داشت
            که تمام و دشواری موجود در ارائه راهکارها، و شرایط سخت تایپ به پایان
            رسد و زمان مورد نیاز شامل حروفچینی دستاوردهای اصلی، و جوابگوی سوالات
            پیوسته اهل دنیای موجود طراحی اساسا مورد استفاده قرار گیرد.
          </p>
        </div>
        <div class="d-flex justify-center align-center mb-4"></div>
        <div>
          <p class="text-body-1 text-grey-darken-2 mb-0">
            لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ، و با
            استفاده از طراحان گرافیک است، چاپگرها و متون بلکه روزنامه و مجله در
            ستون و سطرآنچنان که لازم است، و برای شرایط فعلی تکنولوژی مورد نیاز،
            و کاربردهای متنوع با هدف بهبود ابزارهای کاربردی می باشد، کتابهای
            زیادی در شصت و سه درصد گذشته حال و آینده، شناخت فراوان جامعه و
            متخصصان را می طلبد، تا با نرم افزارها شناخت بیشتری را برای طراحان
            رایانه ای علی الخصوص طراحان خلاقی، و فرهنگ پیشرو در زبان فارسی ایجاد
            کرد، در این صورت می توان امید داشت که تمام و دشواری موجود در ارائه
            راهکارها، و شرایط سخت تایپ به پایان رسد و زمان مورد نیاز شامل
            حروفچینی دستاوردهای اصلی، و جوابگوی سوالات پیوسته اهل دنیای موجود
            طراحی اساسا مورد استفاده قرار گیرد.
          </p>
        </div>
      </div>
    </v-tabs-window-item>
    <v-tabs-window-item value="specs">
      <div class="bg-white px-8 py-10 p-tab-content mb-6">
        <div class="specification-items">
          <div class="specification-item" v-for="item in 12">
            <div>رنگ :</div>
            <div>آبی</div>
          </div>
        </div>
      </div>
    </v-tabs-window-item>
    <v-tabs-window-item value="comments"> </v-tabs-window-item>
  </v-tabs-window>
</template>

<script setup lang="ts">
const props = defineProps<{ modelValue: string }>();
const emit = defineEmits(["update:modelValue"]);
const tabValue = ref("desc");

watch(
  () => props.modelValue,
  (val) => {
    console.log("val", val);
  }
);
</script>

<style scoped>
.p-tab-content {
  border-radius: 39px;
}
.product-tabs {
  min-height: 56px;
  width: 100%;
}
.tab-title {
  font-size: 1.1rem;
  color: #222;
  min-width: 120px;
  letter-spacing: 0.5px;
}
.tab-title .v-icon {
  margin-left: 6px;
}
.tab-title.font-weight-bold {
  font-weight: bold;
}
.specification-items {
  display: grid;
  grid-template-columns: 1fr;
  gap: 5px 24px;
}
.specification-item {
  background: #f1f1f1;
  padding: 15px 20px;
  border-radius: 13px;
  font-size: 13px;
  font-weight: 400;
  color: #000000;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

@media (max-width: 960px) {
  .specification-item:nth-child(2n + 1) {
    background: #fff;
  }
}
@media (min-width: 960px) {
  .specification-items {
    grid-template-columns: 1fr 1fr;
  }
  .specification-item:nth-child(4n-1),
  .specification-item:nth-child(4n) {
    background: #fff;
  }
  .product-tabs {
    min-height: 56px;
    width: 40%;
  }
}
</style>
