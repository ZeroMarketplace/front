<template>
  <v-container class="bg-white px-1 px-md-16 border-b" fluid>

    <!--  Top Bar  -->
    <v-row class="">

      <!--  Name And Logo  -->
      <v-col class="pt-4 pt-md-5" cols="7" sm="7" md="3">

        <!--   Menu Icon   -->
        <v-btn class="d-md-none mr-1 rounded-lg"
               color="secondary"
               size="small"
               @click="navigationMenu = true"
               icon>
          <v-icon>mdi-menu</v-icon>
        </v-btn>

        <!--   Navigation Menu     -->
        <v-navigation-drawer v-model="navigationMenu"
                             class="d-md-none bg-grey-darken-3"
                             elevation="24">
        </v-navigation-drawer>

        <h2 class="d-none d-md-inline font-weight-bold">فروشگاه زیرو</h2>
        <p class="d-md-none d-inline-block font-weight-bold mt-1 mr-2">فروشگاه زیرو</p>
      </v-col>

      <!--  Search    -->
      <v-col class="pb-3 d-none d-md-inline" md="5" lg="6">
        <v-text-field
            class="border rounded-xl px-4 pb-2 w-75"
            variant="plain"
            density="compact"
            label="جستجو"
            append-inner-icon="mdi-magnify"
            rounded
            hide-details></v-text-field>
      </v-col>

      <!--  Icons    -->
      <v-col class="pt-4 text-left" cols="5" sm="5" md="4" lg="3">

        <!--   Profile     -->
        <v-btn class="d-none d-md-inline"
               variant="text"
               height="50"
               @click="openProfile">
          <p>پروفایل</p>
          <v-icon class="mr-2" size="large">mdi-account-outline</v-icon>
        </v-btn>

        <v-btn class="d-md-none rounded-lg"
               color="secondary"
               size="small"
               @click="openProfile"
               icon>
          <v-icon>mdi-account-outline</v-icon>
        </v-btn>

        <Login ref="login"/>

        <!--   Cart     -->
        <v-btn class="d-none d-md-inline"
               variant="text"
               height="50">
          <v-row>
            <v-col class="text-right">
              <p class="textSmall">سبد خرید </p>
              <p class="text-pink mx-1 textSmall">(4)</p>
              <p class="font-weight-thin mt-n1">۴ عدد</p>
            </v-col>
            <v-col class="mt-3 mr-n5">
              <v-icon size="large">mdi-cart-outline</v-icon>
            </v-col>
          </v-row>
        </v-btn>

        <v-btn class="d-md-none mx-1 rounded-lg"
               color="secondary"
               size="small"
               icon>
          <v-icon>mdi-cart-outline</v-icon>
        </v-btn>

      </v-col>

    </v-row>

    <v-divider class="d-none d-md-block mt-3"></v-divider>

    <!--  Category   -->
    <v-btn class="mt-2 d-none d-md-inline-flex"
           prepend-icon="mdi-view-dashboard"
           append-icon="mdi-menu-down"
           variant="text">
      دسته بندی
    </v-btn>

    <!--  Contact us   -->
    <v-btn class="mt-2 float-end d-none d-md-inline-flex"
           prepend-icon="mdi-phone-in-talk-outline"
           variant="text">
      ارتباط با ما
    </v-btn>

    <!--  About us   -->
    <v-btn class="mt-2 float-end d-none d-md-inline-flex"
           prepend-icon="mdi-information-slab-circle-outline"
           variant="text">
      درباره ما
    </v-btn>

  </v-container>
</template>

<script>
import {useUserStore} from "~/store/user";

export default {
  data() {
    return {
      navigationMenu: false
    }
  },
  methods : {
    async openProfile() {
      if (this.user.authenticated) {
        await navigateTo(this.user.role === 1 ? '/admin-dashboard' : '/dashboard');
      } else {
        this.$refs.login.openModal();
      }
    }
  },
  computed: {
    user() {
      return useUserStore();
    }
  },
  mounted() {

  }
}
</script>

<style scoped>
.textSmall {
  font-size: 0.85em;
  display: inline-block;
}
</style>