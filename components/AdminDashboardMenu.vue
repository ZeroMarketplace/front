<template>
  <div class="dashboardMenu bg-grey-darken-3 pb-10 w-100 h-100">

    <!-- Logo   -->
    <div class="d-flex justify-center pt-10">
      <NuxtLink to="/">
        <img src="/img/logo.png" width="110" height="50">
      </NuxtLink>
    </div>

    <!-- list  -->
    <v-list class="bg-grey-darken-3 pa-5 rounded-xl">
      <v-list-item
          v-for="(item,i) in list"
          :key="i"
          :value="item"
          class="pa-5 mt-3 rounded-lg"
          rounded="rounded">
        <template v-slot:prepend>
          <v-icon :icon="item.icon"></v-icon>
        </template>

        <v-list-item-title v-text="item.text"></v-list-item-title>
      </v-list-item>
    </v-list>

    <v-divider class="mx-6"></v-divider>

    <!--  logout   -->
    <v-btn class="mt-2 px-2 mr-9" height="50" variant="text">
      <v-icon size="25">mdi-power</v-icon>
      <p class="mr-7">خروج از پنل کاربری</p>
    </v-btn>


    <!--  Date Time   -->
    <v-label class="d-block mr-12 mt-8 text-subtitle-2 text-white">
      امروز ۱۵ تیر ۱۴۰۱
    </v-label>

  </div>
</template>

<script>
import {useUserStore} from "~/store/user";

export default {
  props: ['admin'],
  data() {
    return {
      list: [
        {
          text: 'داشبورد',
          link: '/dashboard',
          icon: 'mdi-view-dashboard',
          role: ['admin', 'user']
        },
        {
          text: 'لیست فروش',
          link: '/dashboard',
          icon: 'mdi-cart',
          role: ['admin']
        },
        {
          text: 'فاکتور فروش',
          link: '/dashboard',
          icon: 'mdi-cart-outline',
          role: ['admin']
        },
        {
          text: 'محصولات من',
          link: '/dashboard',
          icon: 'mdi-cart-outline',
          role: ['admin']
        },
        {
          text: 'سفارشات من',
          link: '/dashboard',
          icon: 'mdi-cart-outline',
          role: ['user']
        },
        {
          text: 'اطلاعات پروفایل',
          link: '/dashboard',
          icon: 'mdi-card-account-details-outline',
          role: ['admin', 'user']
        },
        {
          text: 'اعلانات',
          link: '/dashboard',
          icon: 'mdi-bell-outline',
          role: ['admin', 'user']
        },
        {
          text: 'تیکت‌ها',
          link: '/dashboard',
          icon: 'mdi-cart',
          role: ['admin', 'user']
        }
      ]
    }
  }
}
</script>

<style scoped>
.dashboardMenu {
  min-height: 650px;
}
</style>