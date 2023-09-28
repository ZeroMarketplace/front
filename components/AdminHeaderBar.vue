<template>
  <v-row class="border-b bg-white px-4 pt-4 pb-1 mb-3 bg-grey-darken-3 border-dotted">

    <v-col class="d-flex flex-grow-1 mr-n5 mr-md-0">

      <!--   Menu Button   -->
      <v-btn class="mt-1 mx-2 d-inline-block d-md-none"
             size="small"
             color="secondary"
             @click="toggleNavigationMenu"
             icon>
        <v-icon>mdi-menu</v-icon>
      </v-btn>

      <!--   Navigation Menu     -->
      <v-navigation-drawer v-model="navigationMenu"
                           class="d-md-none bg-grey-darken-3"
                           elevation="24">
        <AdminDashboardMenu/>
      </v-navigation-drawer>

      <!--  welcome and username    -->
      <div>
        <v-label class="d-block text-h6 text-secondary">خوش آمدید</v-label>
        <v-label class="d-block text-subtitle-2">{{ user.firstName + ' ' + user.lastName }}</v-label>
        <v-label class="d-block text-caption text-gray">مدیر فروشگاه</v-label>
      </div>

    </v-col>

    <v-col>
      <v-avatar class="float-left" size="large" color="red">
        A
      </v-avatar>
    </v-col>

  </v-row>
</template>

<script>
import {useUserStore} from "~/store/user";

export default {
  data() {
    return {
      navigationMenu: false,
      user          : {
        firstName: '',
        lastName : ''
      }
    }
  },
  methods : {
    toggleNavigationMenu() {
      this.navigationMenu = !this.navigationMenu;
    }
  },
  computed: {},
  mounted() {
    this.user = useUserStore();
  }
}
</script>

<style scoped>

</style>