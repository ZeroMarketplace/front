<template>
  <v-row>

    <!--  Admin Dashboard Menu   -->
    <v-col class="pa-0 d-none d-md-inline" md="3">
      <AdminDashboardMenu/>
    </v-col>

    <!--  Page   -->
    <v-col cols="12" md="9">

      <AdminHeaderBar class="mb-3"/>

      <!--   Content     -->
      <v-row class="bg-white mr-1 ml-4 rounded-lg">

        <!--    Title And Action    -->
        <v-col cols="12">
          <v-row>
            <!--            -->
            <v-col>
              <v-icon class="mt-1 mr-2" color="grey">mdi-wallet-bifold-outline</v-icon>

              <v-label v-if="action === 'list'" class="text-h6 text-black mx-3">حساب‌ها</v-label>
              <v-label v-if="action === 'add'" class="text-h6 text-black mx-3">افزودن حساب</v-label>
              <v-label v-if="action === 'edit'" class="text-h6 text-black mx-3">ویرایش حساب</v-label>
            </v-col>

            <v-col></v-col>
          </v-row>
        </v-col>

        <!--    Add Account   -->


        <!--    Accounts List   -->
        <v-col cols="12" class="pb-16">

          <!--    loading      -->
          <Loading :loading="loading"/>

          <!--    List      -->
          <v-list class="mx-5">
            <v-list-item v-for="item in list"
                         class="rounded border-b pa-2" link>

              <!--      Title        -->
              <v-list-item-title>{{ item.title }}</v-list-item-title>

              <!--      Actions        -->
              <template v-slot:append>
                <!--  Delete   -->
                <v-btn class="mx-2"
                       color="red"
                       size="30"
                       @click="setDelete({_id: item._id})"
                       icon>
                  <v-icon size="15">mdi-delete-outline</v-icon>
                </v-btn>

                <!--  Edit   -->
                <v-btn class="mx-2"
                       color="secondary"
                       size="30"
                       @click="setEdit(item)"
                       icon>
                  <v-icon size="15">mdi-pencil</v-icon>
                </v-btn>

              </template>

            </v-list-item>
          </v-list>

          <!--    Empty List Alert      -->
          <EmptyList :list="list" :loading="loading"/>

        </v-col>

      </v-row>

    </v-col>

  </v-row>
</template>

<script>
import {useUserStore} from "~/store/user";

definePageMeta({
  layout: "admin-layout"
});

export default {
  data() {
    return {
      user   : {},
      loading: true,
      action : 'list',
      list   : [],
    }
  },
  methods: {
    async delete(_id) {
      await fetch(
          this.runtimeConfig.public.apiUrl + 'accounts/' + _id, {
            method : 'delete',
            headers: {
              'Content-Type' : 'application/json',
              'authorization': 'Bearer ' + this.user.token
            }
          }).then(async response => {
        const {$showMessage} = useNuxtApp();
        if (response.status === 200) {
          $showMessage('عملیات با موفقت انجام شد', 'success');

          // refresh list
          await this.getAccounts();
        } else {
          // show error
          $showMessage('مشکلی در عملیات پیش آمد؛ لطفا دوباره تلاش کنید', 'error');
        }
      });
    },
    getAccounts() {
      this.loading = true;
      fetch(this.runtimeConfig.public.apiUrl + 'accounts', {method: 'get',}).then(async response => {
        response     = await response.json();
        this.list    = response;
        this.loading = false;
      });
    },
    setEdit(data) {
      this.form = {
        title  : data.title,
        titleEn: data.titleEn,
        action : 'edit',
        _id    : data._id
      };
    },
    setDelete(data) {
      if (confirm('آیا مطمئن هستید؟')) {
        this.delete(data._id);
      }
    },
  },
  mounted() {
    this.user = useUserStore();
    this.getAccounts();
  },
  computed: {
    runtimeConfig() {
      return useRuntimeConfig();
    },
  }
}
</script>


<style scoped>

</style>