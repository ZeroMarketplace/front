<template>

  <v-container class="bg-white px-md-16" fluid>
    <v-row class="pb-3">

      <!--  Name And Logo  -->
      <v-col class="mt-2" sm="6" md="3">
        <h2 class="d-none d-md-inline font-weight-bold">فروشگاه زیرو</h2>
        <p class="d-md-none font-weight-bold mt-2">فروشگاه زیرو</p>
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
      <v-col class="pt-4 text-left" sm="6" md="4" lg="3">

        <!--   Profile     -->
        <v-btn class="d-none d-md-inline"
               variant="plain" height="50"
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
               variant="plain"
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

        <v-btn class="d-md-none rounded-lg"
               color="secondary"
               size="small"
               icon>
          <v-icon>mdi-menu</v-icon>
        </v-btn>

      </v-col>

    </v-row>

    <v-divider></v-divider>

  </v-container>
</template>

<script>
import {useUserStore} from "~/store/user";

export default {
  methods : {
    async openProfile() {
      if (this.user.authenticated) {
        await navigateTo('/dashboard');
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