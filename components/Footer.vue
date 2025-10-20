<template>
  <v-container class="pa-0" fluid>
    <Notifier ref="notifier" />

    <!--  definitions   -->
    <v-row class="text-center transparentColor py-5 px-16">
      <v-col class="my-2" cols="12" md="3">
        <v-icon class="mx-2">mdi-gesture-tap</v-icon>
        رابط کاربری آسان
      </v-col>
      <v-col class="my-2" cols="12" md="3">
        <v-icon class="mx-2">mdi-arrow-top-right-bold-outline</v-icon>
        سرعت در ارسال
      </v-col>
      <v-col class="my-2" cols="12" md="3">
        <v-icon class="mx-2">mdi-shield-lock-outline</v-icon>
        امنیت در پرداخت
      </v-col>
      <v-col class="my-2" cols="12" md="3">
        <v-icon class="mx-2">mdi-forum-outline</v-icon>
        پشتیبانی آنلاین
      </v-col>
    </v-row>

    <!--  Sections   -->
    <v-row class="mt-5 mx-16">
      <!--   Logo and Description   -->
      <v-col class="px-md-5" cols="12" md="4">
        <v-img class="mb-5 w-50" src="/img/logo.svg" max-height="60"> </v-img>
        <div class="text-wrap text-justify w-100">
          <v-label class="my-2"
            >اصفهان، سمیرم، فتح‌آباد، خ شهید اشتری، پلاک 25</v-label
          >
          <v-label class="my-1"> تلفن: 09135533374</v-label>
        </div>
      </v-col>

      <!--   Links   -->
      <v-col cols="12" md="4">
        <v-row>
          <!--   Links    -->
          <v-col v-for="section in links" cols="6">
            <v-label class="text-secondary d-block font-weight-bold">{{
              section.title
            }}</v-label>
            <NuxtLink
              v-for="link in section.links"
              :to="link.to"
              class="text-caption d-block my-2"
            >
              {{ link.title }}
            </NuxtLink>
          </v-col>
        </v-row>
      </v-col>

      <!--   Symbols  -->
      <v-col cols="12" md="4">
        <v-label class="text-secondary d-block font-weight-bold"
          >نماد‌ها</v-label
        >
        <a
          v-if="showTrustSeal"
          referrerpolicy="origin"
          target="_blank"
          href="https://trustseal.enamad.ir/?id=241154&amp;Code=gABBONVarBBpvMmUbB52"
        >
          <img
            referrerpolicy="origin"
            src="https://Trustseal.eNamad.ir/logo.aspx?id=241154&amp;Code=gABBONVarBBpvMmUbB52"
            alt=""
            style="cursor: pointer"
            id="gABBONVarBBpvMmUbB52"
          />
        </a>
      </v-col>
    </v-row>

    <!--  Social Media   -->
    <v-row class="bg-orange justify-center justify-between d-none">
      <a
        v-for="item in socialMedia"
        class="mx-2"
        target="_blank"
        :href="item.to"
      >
        <v-icon size="large" color="white">mdi-{{ item.icon }}</v-icon>
      </a>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      showTrustSeal: false,
      links: {
        orders: {
          title: "سفارشات",
          links: [
            { title: "پیگیری سفارش", to: "" },
            { title: "ثبت سفارش", to: "" },
            { title: "اعلام مغایرت", to: "" },
            { title: "عودت وجه", to: "" },
          ],
        },
        site: {
          title: "پیوند‌ها",
          links: [
            { title: "درباره ما", to: "" },
            { title: "ارتباط با فروشگاه", to: "" },
            { title: "قوانین و مقررات", to: "" },
            { title: "سوالات متداول", to: "" },
          ],
        },
      },
      socialMedia: [
        { icon: "instagram", to: "https://www.instagram.com/zero.underwer/" },
        { icon: "linkedin", to: "#" },
        { icon: "whatsapp", to: "#" },
      ],
    };
  },
  mounted() {
    try {
      // Only show on non-localhost environments
      const isClient = typeof window !== "undefined";
      const localHosts = ["localhost", "127.0.0.1", "0.0.0.0"];
      this.showTrustSeal =
        isClient && !localHosts.includes(window.location.hostname);
    } catch (e) {
      this.showTrustSeal = false;
    }
  },
};
</script>

<style scoped>
.transparentColor {
  background-color: #ebeaea !important;
}
</style>
