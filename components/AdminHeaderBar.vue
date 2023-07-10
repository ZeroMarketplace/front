<template>
  <v-row class="border-b bg-white px-4 pt-4 pb-1">

    <v-col>
      <v-label class="d-block text-h6 text-black">خوش آمدید</v-label>
      <v-label class="d-block text-subtitle-2">{{ user.firstName + ' ' + user.lastName }}</v-label>
      <v-label class="d-block text-caption text-gray">مدیر فروشگاه</v-label>
    </v-col>

    <v-col>
      <v-avatar class="float-left mt-3" size="large" color="blue">
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
      user: {
        firstName: '',
        lastName : ''
      }
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