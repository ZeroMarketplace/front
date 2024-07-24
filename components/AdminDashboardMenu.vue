<template>
  <div class="dashboardMenu bg-grey-darken-3 pb-10 w-100 h-100">

    <!-- Logo   -->
    <div class="d-flex justify-center pt-10">
      <NuxtLink to="/">
        <img src="/img/logo.png" width="110" height="50">
      </NuxtLink>
    </div>

    <!-- list  -->
    <v-list v-for="(item,i) in list"
            :key="i"
            :value="item"
            class="bg-grey-darken-3 pa-2 rounded-xl">
      <v-list-item v-if="!item.items" class="pa-5 mt-3 rounded-lg"
                   rounded="rounded"
                   :to="item.link ?? ''"
                   :link="!item.items">
        <template v-slot:prepend>
          <v-icon :icon="item.icon"></v-icon>
        </template>
        <v-list-item-title v-text="item.text"></v-list-item-title>
      </v-list-item>

      <v-list-subheader class="text-white font-weight-bold" v-if="item.items">{{ item.text }}</v-list-subheader>

      <v-list-item v-if="item.items" v-for="(childItem,i) in item.items"
                   :key="i"
                   :value="item"
                   class=""
                   rounded="rounded"
                   :to="childItem.link ?? ''"
                   link>
        <template v-slot:prepend>
          <v-icon :icon="childItem.icon"></v-icon>
        </template>

        <v-list-item-title v-text="childItem.text"></v-list-item-title>
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
          link: '/admin-dashboard',
          icon: 'mdi-view-dashboard'
        },
        {
          text: 'لیست فروش',
          icon: 'mdi-cart'
        },
        {
          text: 'فاکتور فروش',
          link: '/sales-invoices',
          icon: 'mdi-receipt-text-edit'
        },
        {
          text: 'فاکتور خرید',
          icon: 'mdi-receipt-text-edit-outline',
          link: '/purchase-invoices'
        },
        {
          text: 'محصولات من',
          link: '/products',
          icon: 'mdi-cart-outline'
        },
        {
          text: 'حساب‌ها',
          icon: 'mdi-wallet-bifold-outline',
          link: '/accounts'
        },
        {
          text: 'اسناد حسابداری',
          icon: 'mdi-file-document-outline',
          link: '/accounting-documents'
        },
        {
          text: 'انبار‌ها',
          icon: 'mdi-warehouse',
          link: "/warehouses"
        },
        {
          text: 'موجودی کالا‌ها',
          icon: 'mdi-clipboard-list-outline',
          link: "/inventories"
        },
        {
          text: 'اطلاعات پروفایل',
          icon: 'mdi-card-account-details-outline'
        },
        {
          text: 'اعلانات',
          icon: 'mdi-bell-outline'
        },
        {
          text: 'تیکت‌ها',
          icon: 'mdi-cart'
        },
        {
          text : 'تنظیمات',
          icon : 'mdi-cog',
          items: [
            {
              text: 'دسته بندی‌ها',
              link: '/categories',
              icon: 'mdi-file-tree'
            },
            {
              text: 'برند‌ها',
              link: '/brands',
              icon: 'mdi-material-design'
            },
            {
              text: 'ویژگی‌ها',
              link: '/properties',
              icon: 'mdi-order-bool-descending-variant'
            },
            {
              text: 'واحد‌ها',
              link: '/units',
              icon: 'mdi-scale'
            },
            {
              text: 'اضافات و کسورات',
              link: '/add-and-subtract',
              icon: 'mdi-plus-minus-variant'
            }
          ]
        }
      ]
    }
  }
}
</script>

<style scoped>
.dashboardMenu {
  min-height: 100vh;
}
</style>
